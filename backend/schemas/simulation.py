from typing import Dict, Any, Union
from pydantic import BaseModel, Field, model_validator


class SimulationImpact(BaseModel):
    p0ReliabilityPercent: float = 100.0
    p1ServedPercent: float = 92.0
    p2ServedPercent: float = 61.0
    additionalDieselLiters: Union[float, str] = 0.0
    additionalCo2Kg: Union[float, str] = 0.0
    costDifferenceDollars: Union[float, str] = 0.0


class SimulationRequest(BaseModel):
    scenario: str = "SOLAR_FAILURE"
    severity: float = Field(default=80.0, ge=0, le=100)
    durationHours: float = Field(default=12.0, ge=1, le=168)

    @model_validator(mode="before")
    @classmethod
    def normalize_keys(cls, data: Any) -> Any:
        if not isinstance(data, dict):
            return data
        normalized = dict(data)
        if "duration_hours" in normalized and "durationHours" not in normalized:
            normalized["durationHours"] = normalized["duration_hours"]
        return normalized


class SimulationResponse(BaseModel):
    scenario: str
    severity: float
    durationHours: float
    before: Dict[str, float]
    after: Dict[str, float]
    impact: SimulationImpact
