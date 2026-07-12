# Vehicle SQLAlchemy Model placeholder

# vehicle.py
from uuid import UUID, uuid4
from typing import Optional, Dict, Any, TYPE_CHECKING
from sqlalchemy import String, Numeric, CheckConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from .trip import Trip
    from .maintenance import MaintenanceLog

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

    __table_args__ = (
        CheckConstraint("status IN ('Available', 'On Trip', 'In Shop', 'Retired')", name='chk_vehicle_status'),
    )

