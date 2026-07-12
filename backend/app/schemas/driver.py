from datetime import date
from uuid import UUID
from typing import Optional
from pydantic import BaseModel, Field, field_validator

class DriverBase(BaseModel):
    name: str = Field(..., max_length=100)
    license_number: str = Field(..., max_length=50)
    license_category: str = Field(default="Standard", max_length=50)
    contact_number: Optional[str] = Field(default=None, max_length=20)
    license_expiry: date
    safety_score: float = Field(default=100.0, ge=0, le=100)
    status: str = Field(default="Available")
    fatigue_flag: bool = Field(default=False)

    @field_validator('license_expiry')
    @classmethod
    def check_not_expired(cls, value: date) -> date:
        if value < date.today():
            raise ValueError("Driver's license is already expired!")
        return value

    @field_validator('status')
    @classmethod
    def validate_status(cls, value: str) -> str:
        allowed = ["Available", "On Trip", "Off Duty", "Suspended"]
        if value not in allowed:
            raise ValueError(f"Status must be one of {allowed}")
        return value

class DriverCreate(DriverBase):
    pass

class DriverResponse(DriverBase):
    id: UUID

    class Config:
        from_attributes = True
