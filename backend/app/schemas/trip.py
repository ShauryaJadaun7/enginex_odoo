from uuid import UUID
from typing import Optional, List, Dict
from pydantic import BaseModel, Field

class TripBase(BaseModel):
    vehicle_id: UUID
    driver_id: UUID
    source: str = Field(..., max_length=255)
    destination: str = Field(..., max_length=255)
    cargo_weight_kg: float = Field(..., gt=0)
    planned_distance: float = Field(..., gt=0)
    status: str = Field(default="Draft")
    route_polyline: List[Dict[str, float]] = Field(default_factory=list)
    ai_pairing_score: Optional[float] = Field(default=None, ge=0, le=100)

class TripCreate(TripBase):
    pass

class TripResponse(TripBase):
    id: UUID

    class Config:
        from_attributes = True
