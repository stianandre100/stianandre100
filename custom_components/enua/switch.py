"""Switch platform for Enua Charge (start/stop charging)."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .api import EnuaApiClient
from .const import DOMAIN, MANUFACTURER
from .coordinator import EnuaCoordinator

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Enua switches."""
    data = hass.data[DOMAIN][entry.entry_id]
    coordinator: EnuaCoordinator = data["coordinator"]
    client: EnuaApiClient = data["client"]

    entities = [
        EnuaChargingSwitch(coordinator, client, charger_id)
        for charger_id in coordinator.data
    ]
    async_add_entities(entities)


class EnuaChargingSwitch(CoordinatorEntity[EnuaCoordinator], SwitchEntity):
    """Switch to start/stop charging."""

    _attr_has_entity_name = True
    _attr_translation_key = "charging"
    _attr_name = "Charging"
    _attr_icon = "mdi:ev-station"

    def __init__(
        self,
        coordinator: EnuaCoordinator,
        client: EnuaApiClient,
        charger_id: str,
    ) -> None:
        super().__init__(coordinator)
        self._client = client
        self._charger_id = charger_id
        self._attr_unique_id = f"{charger_id}_charging"

    @property
    def _charger(self) -> dict:
        return self.coordinator.data[self._charger_id]

    @property
    def is_on(self) -> bool:
        return self._charger.get("hasActiveTransaction", False)

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Start charging."""
        await self._client.start_charging(self._charger_id)
        await self.coordinator.async_request_refresh()

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Stop charging."""
        await self._client.stop_charging(self._charger_id)
        await self.coordinator.async_request_refresh()

    @property
    def device_info(self) -> DeviceInfo:
        charger = self._charger
        return DeviceInfo(
            identifiers={(DOMAIN, self._charger_id)},
            name=charger.get("nickname") or charger.get("serialNumber", self._charger_id),
            manufacturer=MANUFACTURER,
            model=charger.get("firmwareVersion"),
            serial_number=charger.get("serialNumber"),
        )
