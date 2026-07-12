from datetime import date
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field, field_validator

class DriverBase(BaseModel):
    name: str = Field(..., description="Driver's full name")
    license_number: str = Field(..., description="Unique license number")
    license_category: str = Field(..., description="E.g., 'Heavy Commercial', 'Light Commercial'")
    license_expiry_date: date = Field(..., description="Driver's license expiry date")
    contact_number: str = Field(..., description="Contact phone number")
    safety_score: int = Field(default=100, ge=0, le=100, description="Safety score (0-100)")

class DriverCreate(DriverBase):
    @field_validator("license_number", "contact_number")
    @classmethod
    def check_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Field cannot be empty or whitespace only")
        return v

class DriverUpdate(BaseModel):
    name: Optional[str] = None
    license_number: Optional[str] = None
    license_category: Optional[str] = None
    license_expiry_date: Optional[date] = None
    contact_number: Optional[str] = None
    safety_score: Optional[int] = Field(default=None, ge=0, le=100)
    status: Optional[str] = None

    @field_validator("license_number", "contact_number")
    @classmethod
    def check_not_empty_optional(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError("Field cannot be empty or whitespace only")
        return v

class DriverResponse(DriverBase):
    id: UUID
    status: str

    class Config:
        from_attributes = True
