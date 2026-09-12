from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field


class LocationInfo(BaseModel):
    name: str = "Dhordo, Kutch, Gujarat, India"
    shortName: str = "Dhordo, Kutch, Gujarat"
    community: str = "Dhordo Community Microgrid"
    latitude: float = 23.84
    longitude: float = 69.76
    district: str = "Kutch"
    state: str = "Gujarat"
    country: str = "India"


class WeatherInfo(BaseModel):
    condition: str = "Partly Cloudy"
    temperatureC: float = 28.5
    solarIrradianceWm2: float = 820.0
    windSpeedMs: float = 7.2
    forecastWarning: Optional[str] = None
    lastUpdated: Optional[str] = None
    location: str = "Dhordo, Kutch, Gujarat, India"
    weatherSource: str = "Open-Meteo"
    dataMode: str = "LIVE"  # LIVE, CACHED, or FALLBACK


class SystemMetrics(BaseModel):
    currentDemandKw: float = 48.2
    renewableGenKw: float = 41.7
    solarGenKw: float = 26.4
    windGenKw: float = 15.3
    batteryPowerKw: float = 6.5
    batterySocPercent: float = 68.0
    batteryHealthPercent: float = 91.0
    dieselStatus: str = "OFF"
    dieselPowerKw: float = 0.0
    renewablePercent: float = 86.5
    co2AvoidedKgDay: float = 142.8
    fuelRemainingLiters: float = 360.0
    fuelDaysRemaining: int = 20
    criticalLoadReliabilityPercent: float = 100.0
    dispatchStatus: str = "OPTIMAL"


class LiveDispatch(BaseModel):
    solarKw: float = 26.4
    windKw: float = 15.3
    batteryKw: float = 6.5
    dieselKw: float = 0.0
    totalSupplyKw: float = 48.2
    demandKw: float = 48.2
    status: str = "OPTIMAL"
    costPerHour: float = 4.25
    dieselSavedLitersDay: float = 85.0
    co2AvoidedKgDay: float = 142.8
    batteryImpact: str = "Normal Discharge (-6.5 kW)"
    reliability: str = "100% P0 Protected"


class SystemStatusResponse(BaseModel):
    # Prompt specification top-level fields
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    demand_kw: float = 48.2
    solar_kw: float = 26.4
    wind_kw: float = 15.3
    battery_kw: float = 6.5
    battery_soc: float = 68.0
    diesel_kw: float = 0.0
    diesel_status: str = "OFF"
    renewable_percentage: float = 86.5
    reliability: float = 100.0
    p0_reliability: float = 100.0
    storm_mode: bool = False
    system_status: str = "ONLINE"

    # Member 1 Frontend compatibility nested fields
    isOnline: bool = True
    lastOptimizationTime: str = "10:45:00"
    nextOptimizationInSeconds: int = 485
    weather: WeatherInfo = Field(default_factory=WeatherInfo)
    location: LocationInfo = Field(default_factory=LocationInfo)
    location_name: str = "Dhordo, Kutch, Gujarat, India"
    metrics: SystemMetrics = Field(default_factory=SystemMetrics)
    liveDispatch: LiveDispatch = Field(default_factory=LiveDispatch)
