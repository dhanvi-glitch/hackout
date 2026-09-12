from typing import List, Optional
from fastapi import APIRouter, Query
from backend.schemas.forecast import ForecastInterval
from backend.services.forecast_service import forecast_service

router = APIRouter(tags=["Forecast"])


@router.get("/forecast", response_model=List[ForecastInterval])
async def get_forecast(
    latitude: Optional[float] = Query(None, description="Optional latitude for forecast"),
    longitude: Optional[float] = Query(None, description="Optional longitude for forecast"),
):
    """Returns 24-hour predictive forecast across 96 fifteen-minute intervals."""
    return forecast_service.generate_24h_forecast(latitude=latitude, longitude=longitude)
