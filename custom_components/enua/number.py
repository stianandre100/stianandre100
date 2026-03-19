"""Number platform for Enua Charge (set max current)."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.number import NumberEntity, NumberMode
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import UnitOfElectricCurrent
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
    """Set up Enua number entities."""
    data = hass.data[DOMAIN][entry.entry_id]
    coordinator: EnuaCoordinator = data["coordinator"]
    client: EnuaApiClient = data["client"]

    entities = [
        EnuaMaxCurrentNumber(coordinator, client, charger_id)
        for charger_id in coordinator.data
    ]
    async_add_entities(entities)


class EnuaMaxCurrentNumber(CoordinatorEntity[EnuaCoordinator], NumberEntity):
    """Number entity to set the maximum charging current."""

    _attr_has_entity_name = True
    _attr_translation_key = "max_current"
    _attr_name = "Max Current"
    _attr_icon = "mdi:current-ac"
    _attr_native_unit_of_measurement = UnitOfElectricCurrent.AMPERE
    _attr_native_min_value = 6
    _attr_native_max_value = 32
    _attr_native_step = 1
    _attr_mode = NumberMode.SLIDER

    def __init__(
        self,
        coordinator: EnuaCoordinator,
        client: EnuaApiClient,
        charger_id: str,
    ) -> None:
        super().__init__(coordinator)
        self._client = client
        self._charger_id = charger_id
        self._attr_unique_id = f"{charger_id}_max_current"

    @property
    def _charger(self) -> dict:
        return self.coordinator.data[self._charger_id]

    @property
    def native_value(self) -> float | None:
        return self._charger.get("chargerMaxCurrent")

    async def async_set_native_value(self, value: float) -> None:
        """Set the max current."""
        await self._client.set_max_current(self._charger_id, int(value))
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
