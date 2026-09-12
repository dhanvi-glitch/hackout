import logging
import random
from datetime import datetime, timezone
from typing import Optional
import httpx
from sqlalchemy.orm import Session

from backend.config.settings import settings
from backend.database.models import WeatherRecord
from backend.schemas.status import WeatherInfo

logger = logging.getLogger(__name__)


class WeatherService:
    """Service to fetch live weather telemetry from Open-Meteo with fallback demo mode."""

    def __init__(self):
        self._cached_weather: Optional[WeatherInfo] = None
        self._last_fetched: Optional[datetime] = None
        self._cache_ttl_seconds = 300  # 5 minute cache

    async def get_current_weather(self, db: Optional[Session] = None, force_refresh: bool = False) -> WeatherInfo:
        now = datetime.now(timezone.utc)
        if (
            not force_refresh
            and self._cached_weather is not None
            and self._last_fetched is not None
            and (now - self._last_fetched).total_seconds() < self._cache_ttl_seconds
        ):
            return self._cached_weather

        weather = await self._fetch_open_meteo()
        if not weather:
            weather = self._generate_fallback_weather()

        self._cached_weather = weather
        self._last_fetched = now

        # Optionally persist to database
        if db:
            try:
                record = WeatherRecord(
                    timestamp=now,
                    condition=weather.condition,
                    temperature_c=weather.temperatureC,
                    solar_irradiance_wm2=weather.solarIrradianceWm2,
                    wind_speed_ms=weather.windSpeedMs,
                    forecast_warning=weather.forecastWarning
                )
                db.add(record)
                db.commit()
            except Exception as e:
                logger.warning(f"Failed to record weather to database: {e}")
                db.rollback()

        return weather

    async def _fetch_open_meteo(self) -> Optional[WeatherInfo]:
        """Fetch current conditions from Open-Meteo API."""
        url = f"{settings.OPEN_METEO_BASE_URL}/forecast"
        params = {
            "latitude": settings.DEFAULT_LATITUDE,
            "longitude": settings.DEFAULT_LONGITUDE,
            "current": "temperature_2m,direct_normal_irradiance,wind_speed_10m,weather_code,cloud_cover",
            "timezone": "auto"
        }

        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                resp = await client.get(url, params=params)
                if resp.status_code == 200:
                    data = resp.json()
                    current = data.get("current", {})
                    temp = float(current.get("temperature_2m", 28.5))
                    irradiance = float(current.get("direct_normal_irradiance", 820.0))
                    wind_speed = float(current.get("wind_speed_10m", 7.2))
                    cloud = float(current.get("cloud_cover", 20.0))

                    condition = "Sunny / Clear"
                    if cloud > 70:
                        condition = "Overcast"
                    elif cloud > 30:
                        condition = "Partly Cloudy"

                    warning = None
                    if wind_speed > 15.0:
                        warning = "High Wind Advisory: Turbines nearing cutout limit"

                    return WeatherInfo(
                        condition=condition,
                        temperatureC=round(temp, 1),
                        solarIrradianceWm2=round(irradiance, 1),
                        windSpeedMs=round(wind_speed, 1),
                        forecastWarning=warning,
                        lastUpdated=datetime.now(timezone.utc).isoformat()
                    )
        except Exception as e:
            logger.info(f"Open-Meteo request bypassed or failed ({e}); utilizing microgrid sensor model.")

        return None

    def _generate_fallback_weather(self) -> WeatherInfo:
        """Realistic microgrid telemetry model with day/night variability."""
        hour = datetime.now(timezone.utc).hour
        # Diurnal solar cycle peaking around 13:00
        if 6 <= hour <= 18:
            import math
            peak = 900.0
            fraction = math.sin((hour - 6) * math.pi / 12)
            irradiance = round(max(50.0, peak * fraction + random.uniform(-30, 30)), 1)
            temp = round(26.0 + 8.0 * fraction + random.uniform(-1, 1), 1)
            condition = "Sunny" if irradiance > 600 else "Partly Cloudy"
        else:
            irradiance = 0.0
            temp = round(22.0 + random.uniform(-1, 1), 1)
            condition = "Clear Night"

        wind_speed = round(7.0 + random.uniform(-1.5, 2.0), 1)

        return WeatherInfo(
            condition=condition,
            temperatureC=temp,
            solarIrradianceWm2=irradiance,
            windSpeedMs=wind_speed,
            forecastWarning=None,
            lastUpdated=datetime.now(timezone.utc).isoformat()
        )


weather_service = WeatherService()
