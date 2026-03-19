"""Enua API client."""
from __future__ import annotations

import asyncio
import logging
from datetime import datetime
from typing import Any

import aiohttp

from .const import API_BASE_URL, API_VERSION

_LOGGER = logging.getLogger(__name__)


class EnuaApiError(Exception):
    """Generic Enua API error."""


class EnuaAuthError(EnuaApiError):
    """Authentication error."""


class EnuaRateLimitError(EnuaApiError):
    """Rate limit error. Contains retry_after datetime."""

    def __init__(self, retry_after: str | None = None) -> None:
        self.retry_after = retry_after
        super().__init__(f"Rate limited. Retry after: {retry_after}")


class EnuaDeviceTimeoutError(EnuaApiError):
    """Device timeout error (504). Should retry with backoff."""


class EnuaApiClient:
    """Client for the Enua REST API."""

    def __init__(self, session: aiohttp.ClientSession, access_token: str) -> None:
        self._session = session
        self._access_token = access_token

    def _headers(self) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {self._access_token}",
            "Accept-Language": "nb-NO,nb;q=0.9,no;q=0.8,en-US;q=0.7,en;q=0.6",
            "Content-Type": "application/json",
        }

    async def _request(
        self,
        method: str,
        path: str,
        json: dict[str, Any] | None = None,
    ) -> Any:
        url = f"{API_BASE_URL}{path}"
        params = {"apiVersion": API_VERSION}

        try:
            async with self._session.request(
                method,
                url,
                headers=self._headers(),
                params=params,
                json=json,
            ) as resp:
                if resp.status == 401:
                    raise EnuaAuthError("Unauthorized. Token may have expired.")

                if resp.status == 429:
                    retry_after = resp.headers.get("Retry-After")
                    raise EnuaRateLimitError(retry_after)

                if resp.status == 504:
                    raise EnuaDeviceTimeoutError("Charger did not respond.")

                if resp.status == 404:
                    data = await resp.json()
                    raise EnuaApiError(
                        data.get("detail", "Resource not found.")
                    )

                if not resp.ok:
                    text = await resp.text()
                    raise EnuaApiError(f"API error {resp.status}: {text}")

                if resp.status == 200:
                    return await resp.json()

                return None

        except aiohttp.ClientError as err:
            raise EnuaApiError(f"Connection error: {err}") from err

    async def get_chargers(self) -> list[dict[str, Any]]:
        """Return all chargers the user owns."""
        return await self._request("GET", "/chargers")

    async def get_charger(self, charger_id: str) -> dict[str, Any]:
        """Return a single charger by ID."""
        return await self._request("GET", f"/chargers/{charger_id}")

    async def start_charging(self, charger_id: str) -> None:
        """Authorize a charger to deliver power."""
        await self._request(
            "POST", f"/chargers/{charger_id}/commands/start-charging"
        )

    async def stop_charging(self, charger_id: str) -> None:
        """Revoke charging authorization."""
        await self._request(
            "POST", f"/chargers/{charger_id}/commands/stop-charging"
        )

    async def set_max_current(self, charger_id: str, max_current: int) -> None:
        """Set the maximum charging current (Ampere)."""
        await self._request(
            "POST",
            f"/chargers/{charger_id}/commands/set-max-current",
            json={"maxCurrent": max_current},
        )
