from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.database import get_db
from backend.schemas.fuel import FuelStatusResponse
from backend.services.fuel_service import fuel_service

router = APIRouter(tags=["Fuel Intelligence & Logistics"])


@router.get("/fuel", response_model=FuelStatusResponse)
async def get_fuel_status(db: Session = Depends(get_db)):
    """Returns diesel tank levels, autonomy days, fuel burn rate, and generator status."""
    return fuel_service.get_status(db=db)
