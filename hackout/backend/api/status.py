from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database.database import get_db
from backend.database.models import EnergyReading, BatteryRecord, DieselRecord, WeatherRecord, DispatchRecord
from backend.config.settings import settings
from backend.schemas.status import SystemStatusResponse, WeatherInfo, SystemMetrics, LiveDispatch, LocationInfo
from backend.services.weather_service import weather_service
from backend.services.battery_service import battery_service
from backend.services.fuel_service import fuel_service

router = APIRouter(tags=["Status & Telemetry"])


@router.get("/system/status", response_model=SystemStatusResponse)
async def get_system_status(db: Session = Depends(get_db)):
    """Returns comprehensive microgrid operational status and live metrics."""
    try:
        # Fetch weather
        weather = await weather_service.get_current_weather(db=db)

        # Fetch latest energy reading or default
        energy = db.query(EnergyReading).order_by(EnergyReading.timestamp.desc()).first()
        battery_rec = db.query(BatteryRecord).order_by(BatteryRecord.timestamp.desc()).first()
        diesel_rec = db.query(DieselRecord).order_by(DieselRecord.timestamp.desc()).first()
        latest_dispatch = db.query(DispatchRecord).order_by(DispatchRecord.timestamp.desc()).first()

        demand_kw = energy.demand_kw if energy else 48.2
        solar_kw = energy.solar_kw if energy else 26.4
        wind_kw = energy.wind_kw if energy else 15.3
        battery_kw = battery_rec.power_kw if battery_rec else 6.5
        battery_soc = battery_rec.soc_percent if battery_rec else 68.0
        battery_health = battery_rec.health_percent if battery_rec else 91.0
        is_storm_mode = battery_rec.is_storm_mode if battery_rec else battery_service.is_storm_mode

        diesel_status = diesel_rec.status if diesel_rec else "OFF"
        diesel_kw = diesel_rec.power_kw if diesel_rec else 0.0
        fuel_remaining = diesel_rec.fuel_level_liters if diesel_rec else 360.0
        fuel_days = int(fuel_remaining / 18.0)

        total_ren = solar_kw + wind_kw
        total_gen = total_ren + abs(battery_kw) + diesel_kw
        ren_pct = round((total_ren / total_gen * 100.0), 1) if total_gen > 0 else 86.5
        reliability = 100.0

        now = datetime.now(timezone.utc)
        timestamp_iso = now.isoformat()

        # Build metrics object for Member 1 frontend
        metrics = SystemMetrics(
            currentDemandKw=demand_kw,
            renewableGenKw=round(total_ren, 1),
            solarGenKw=solar_kw,
            windGenKw=wind_kw,
            batteryPowerKw=battery_kw,
            batterySocPercent=battery_soc,
            batteryHealthPercent=battery_health,
            dieselStatus=diesel_status,
            dieselPowerKw=diesel_kw,
            renewablePercent=ren_pct,
            co2AvoidedKgDay=142.8,
            fuelRemainingLiters=fuel_remaining,
            fuelDaysRemaining=fuel_days,
            criticalLoadReliabilityPercent=100.0,
            dispatchStatus="OPTIMAL"
        )

        live_disp = LiveDispatch(
            solarKw=solar_kw,
            windKw=wind_kw,
            batteryKw=battery_kw,
            dieselKw=diesel_kw,
            totalSupplyKw=demand_kw,
            demandKw=demand_kw,
            status="OPTIMAL",
            costPerHour=4.25,
            dieselSavedLitersDay=85.0,
            co2AvoidedKgDay=142.8,
            batteryImpact="Normal Discharge (-6.5 kW)",
            reliability="100% P0 Protected"
        )

        from backend.services.location_service import location_manager
        loc = location_manager.get_active_location()

        return SystemStatusResponse(
            timestamp=timestamp_iso,
            demand_kw=demand_kw,
            solar_kw=solar_kw,
            wind_kw=wind_kw,
            battery_kw=battery_kw,
            battery_soc=battery_soc,
            diesel_kw=diesel_kw,
            diesel_status=diesel_status,
            renewable_percentage=ren_pct,
            reliability=reliability,
            p0_reliability=100.0,
            storm_mode=is_storm_mode,
            system_status="ONLINE",
            isOnline=True,
            lastOptimizationTime=now.strftime("%H:%M:%S"),
            nextOptimizationInSeconds=485,
            weather=weather,
            location=LocationInfo(
                name=loc["name"],
                shortName=loc["shortName"],
                community=loc["community"],
                latitude=loc["latitude"],
                longitude=loc["longitude"],
                district=loc["district"],
                state=loc["state"],
                country=loc["country"],
            ),
            location_name=loc["name"],
            metrics=metrics,
            liveDispatch=live_disp
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to compile system status: {str(e)}")


@router.post("/weather/refresh")
async def refresh_weather(db: Session = Depends(get_db)):
    """Forces an immediate refresh of meteorological telemetry from Open-Meteo."""
    try:
        weather = await weather_service.get_current_weather(db=db, force_refresh=True)
        return {
            "status": "success",
            "weather": weather.model_dump()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to refresh weather: {str(e)}")
