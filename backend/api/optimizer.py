from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database.database import get_db
from backend.database.models import DispatchRecord
from backend.schemas.dispatch import OptimizeRequest, OptimizeResponse
from backend.services.optimizer_service import optimizer_service

router = APIRouter(tags=["Optimization Engine"])


@router.post("/optimize", response_model=OptimizeResponse)
async def run_optimization(request: OptimizeRequest, db: Session = Depends(get_db)):
    """
    Solves optimal microgrid energy dispatch.
    Connects to Member 3's MILP/MPC module if available,
    otherwise utilizes the verified merit-order dispatch solver.
    """
    try:
        return await optimizer_service.optimize(request, db=db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Optimization solver failed: {str(e)}")


@router.get("/dispatch/latest")
async def get_latest_dispatch(db: Session = Depends(get_db)):
    """Returns the most recent microgrid dispatch record."""
    record = db.query(DispatchRecord).order_by(DispatchRecord.timestamp.desc()).first()
    if not record:
        return {
            "solarKw": 26.4,
            "windKw": 15.3,
            "batteryKw": 6.5,
            "dieselKw": 0.0,
            "totalSupplyKw": 48.2,
            "demandKw": 48.2,
            "status": "OPTIMAL",
            "costPerHour": 4.25,
            "dieselSavedLitersDay": 85.0,
            "co2AvoidedKgDay": 142.8,
            "batteryImpact": "Normal Discharge (-6.5 kW)",
            "reliability": "100% P0 Protected"
        }

    return {
        "timestamp": record.timestamp.isoformat(),
        "solarKw": record.solar_kw,
        "windKw": record.wind_kw,
        "batteryKw": record.battery_kw,
        "dieselKw": record.diesel_kw,
        "totalSupplyKw": record.total_supply_kw,
        "demandKw": record.demand_kw,
        "unmetDemandKw": record.unmet_demand_kw,
        "renewablePercentage": record.renewable_percentage,
        "costPerHour": record.cost_per_hour,
        "status": record.status,
        "reliability": f"{record.reliability_pct}% P0 Protected",
        "dieselSavedLitersDay": 85.0,
        "co2AvoidedKgDay": record.co2_avoided_kg,
        "batteryImpact": f"Discharge (-{record.battery_kw} kW)" if record.battery_kw > 0 else "Charging"
    }


@router.get("/dispatch/history")
async def get_dispatch_history(limit: int = 24, db: Session = Depends(get_db)):
    """Returns past dispatch records for historical time-series analytics."""
    records = db.query(DispatchRecord).order_by(DispatchRecord.timestamp.desc()).limit(limit).all()
    if not records:
        # Return fallback historical data formatted for frontend
        from backend.services.forecast_service import forecast_service
        return forecast_service.generate_24h_forecast()[:limit]

    return [
        {
            "id": r.id,
            "timestamp": r.timestamp.isoformat(),
            "time": r.timestamp.strftime("%H:%M"),
            "demand": r.demand_kw,
            "solar": r.solar_kw,
            "wind": r.wind_kw,
            "battery": r.battery_kw,
            "diesel": r.diesel_kw,
            "total_supply": r.total_supply_kw,
            "unmet_demand": r.unmet_demand_kw,
            "renewable_percentage": r.renewable_percentage,
            "cost_per_hour": r.cost_per_hour,
            "status": r.status
        }
        for r in reversed(records)
    ]
