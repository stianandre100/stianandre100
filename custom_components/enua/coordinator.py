"""Data update coordinator for Enua Charge."""
from __future__ import annotations

import logging
from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .api import EnuaApiClient, EnuaApiError, EnuaRateLimitError
from .const import DOMAIN, UPDATE_INTERVAL

_LOGGER = logging.getLogger(__name__)


class EnuaCoordinator(DataUpdateCoordinator):
    """Coordinator that fetches data for all chargers."""

    def __init__(self, hass: HomeAssistant, client: EnuaApiClient) -> None:
        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            update_interval=timedelta(seconds=UPDATE_INTERVAL),
        )
        self.client = client

    async def _async_update_data(self) -> dict:
        """Fetch data from Enua API."""
        try:
            chargers = await self.client.get_chargers()
            return {charger["id"]: charger for charger in chargers}
        except EnuaRateLimitError as err:
            _LOGGER.warning("Enua rate limit reached: %s", err)
            raise UpdateFailed(f"Rate limited: {err}") from err
        except EnuaApiError as err:
            raise UpdateFailed(f"Enua API error: {err}") from err
