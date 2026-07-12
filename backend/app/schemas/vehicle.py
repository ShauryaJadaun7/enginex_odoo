from uuid import UUID
from typing import Optional, Dict
from pydantic import BaseModel, Field, field_validator

class VehicleBase(BaseModel):
    registration_number: str = Field(..., max_length=20)
    model_name: str = Field(..., max_length=100)
    type: str = Field(..., max_length=50)
    max_capacity_kg: float = Field(..., gt=0)
    odometer: float = Field(default=0.0, ge=0)
    acquisition_cost: float = Field(..., gt=0)
    status: str = Field(default="Available")
    current_location: Optional[Dict[str, float]] = Field(default={"lat": 0.0, "lng": 0.0})

    @field_validator('status')
    @classmethod
    def validate_status(cls, value: str) -> str:
        allowed = ["Available", "On Trip", "In Shop", "Retired"]
        if value not in allowed:
            raise ValueError(f"Status must be one of {allowed}")
        return value

class VehicleCreate(VehicleBase):
    pass

class VehicleResponse(VehicleBase):
    id: UUID

    class Config:
        from_attributes = True
