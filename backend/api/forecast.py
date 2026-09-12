from typing import List
from fastapi import APIRouter
from backend.schemas.forecast import ForecastInterval
from backend.services.forecast_service import forecast_service

router = APIRouter(tags=["Forecast"])


@router.get("/forecast", response_model=List[ForecastInterval])
async def get_forecast():
    """Returns 24-hour predictive forecast across 96 fifteen-minute intervals."""
    return forecast_service.generate_24h_forecast()
