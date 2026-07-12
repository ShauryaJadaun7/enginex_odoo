# Vehicle SQLAlchemy Model placeholder

# vehicle.py
from uuid import UUID, uuid4
from typing import Optional, Dict, Any
from sqlalchemy import String, Numeric
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from pydantic import BaseModel, Field, field_validator

from .database import Base

# ==========================================
# 1. SQLALCHEMY ORM MODELS
# ==========================================

class Vehicle(Base):
    __tablename__ = "vehicles"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    registration_number: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False)
    max_capacity_kg: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    odometer: Mapped[float] = mapped_column(Numeric(12, 2), default=0.0)
    acquisition_cost: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="Available") # Available, On Trip, In Shop, Retired
    current_location: Mapped[Optional[Dict[str, float]]] = mapped_column(JSONB, default=lambda: {"lat": 0.0, "lng": 0.0})

    # Relationships
    trips: Mapped[list["Trip"]] = relationship(back_populates="vehicle")
    maintenance_logs: Mapped[list["MaintenanceLog"]] = relationship(back_populates="vehicle")


# ==========================================
# 2. PYDANTIC SCHEMAS (Validation Engine)
# ==========================================

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