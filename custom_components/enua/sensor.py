"""Sensors for Enua Charge."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import UnitOfElectricCurrent, UnitOfElectricPotential, UnitOfEnergy
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN, MANUFACTURER, VEHICLE_STATE_MAP
from .coordinator import EnuaCoordinator


@dataclass(frozen=True)
class EnuaSensorEntityDescription(SensorEntityDescription):
    """Describe an Enua sensor."""
    value_fn: Any = None


SENSOR_DESCRIPTIONS: tuple[EnuaSensorEntityDescription, ...] = (
    EnuaSensorEntityDescription(
        key="vehicle_state",
        translation_key="vehicle_state",
        name="Vehicle State",
        icon="mdi:car-electric",
        value_fn=lambda d: VEHICLE_STATE_MAP.get(d.get("vehicleState"), d.get("vehicleState")),
    ),
    EnuaSensorEntityDescription(
        key="l1_current",
        translation_key="l1_current",
        name="L1 Current",
        native_unit_of_measurement=UnitOfElectricCurrent.AMPERE,
        device_class=SensorDeviceClass.CURRENT,
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda d: d.get("l1Current"),
    ),
    EnuaSensorEntityDescription(
        key="l2_current",
        translation_key="l2_current",
        name="L2 Current",
        native_unit_of_measurement=UnitOfElectricCurrent.AMPERE,
        device_class=SensorDeviceClass.CURRENT,
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda d: d.get("l2Current"),
    ),
    EnuaSensorEntityDescription(
        key="l3_current",
        translation_key="l3_current",
        name="L3 Current",
        native_unit_of_measurement=UnitOfElectricCurrent.AMPERE,
        device_class=SensorDeviceClass.CURRENT,
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda d: d.get("l3Current"),
    ),
    EnuaSensorEntityDescription(
        key="l1_voltage",
        translation_key="l1_voltage",
        name="L1 Voltage",
        native_unit_of_measurement=UnitOfElectricPotential.VOLT,
        device_class=SensorDeviceClass.VOLTAGE,
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda d: d.get("l1Voltage"),
    ),
    EnuaSensorEntityDescription(
        key="l2_voltage",
        translation_key="l2_voltage",
        name="L2 Voltage",
        native_unit_of_measurement=UnitOfElectricPotential.VOLT,
        device_class=SensorDeviceClass.VOLTAGE,
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda d: d.get("l2Voltage"),
    ),
    EnuaSensorEntityDescription(
        key="l3_voltage",
        translation_key="l3_voltage",
        name="L3 Voltage",
        native_unit_of_measurement=UnitOfElectricPotential.VOLT,
        device_class=SensorDeviceClass.VOLTAGE,
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda d: d.get("l3Voltage"),
    ),
    EnuaSensorEntityDescription(
        key="energy",
        translation_key="energy",
        name="Energy",
        native_unit_of_measurement=UnitOfEnergy.KILO_WATT_HOUR,
        device_class=SensorDeviceClass.ENERGY,
        state_class=SensorStateClass.TOTAL_INCREASING,
        value_fn=lambda d: d.get("energy"),
    ),
    EnuaSensorEntityDescription(
        key="charger_max_current",
        translation_key="charger_max_current",
        name="Charger Max Current",
        native_unit_of_measurement=UnitOfElectricCurrent.AMPERE,
        device_class=SensorDeviceClass.CURRENT,
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda d: d.get("chargerMaxCurrent"),
    ),
    EnuaSensorEntityDescription(
        key="vehicle_max_current",
        translation_key="vehicle_max_current",
        name="Vehicle Max Current",
        native_unit_of_measurement=UnitOfElectricCurrent.AMPERE,
        device_class=SensorDeviceClass.CURRENT,
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda d: d.get("vehicleMaxCurrent"),
    ),
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Enua sensors."""
    coordinator: EnuaCoordinator = hass.data[DOMAIN][entry.entry_id]["coordinator"]

    entities = [
        EnuaSensor(coordinator, charger_id, description)
        for charger_id in coordinator.data
        for description in SENSOR_DESCRIPTIONS
    ]
    async_add_entities(entities)


class EnuaSensor(CoordinatorEntity[EnuaCoordinator], SensorEntity):
    """Representation of an Enua sensor."""

    entity_description: EnuaSensorEntityDescription
    _attr_has_entity_name = True

    def __init__(
        self,
        coordinator: EnuaCoordinator,
        charger_id: str,
        description: EnuaSensorEntityDescription,
    ) -> None:
        super().__init__(coordinator)
        self.entity_description = description
        self._charger_id = charger_id
        self._attr_unique_id = f"{charger_id}_{description.key}"

    @property
    def _charger(self) -> dict:
        return self.coordinator.data[self._charger_id]

    @property
    def native_value(self):
        return self.entity_description.value_fn(self._charger)

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
