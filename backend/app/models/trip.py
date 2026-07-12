# Trip SQLAlchemy Model placeholder

# trip.py
from uuid import UUID, uuid4
from typing import Optional, List, Dict, Any, TYPE_CHECKING
from sqlalchemy import String, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from .vehicle import Vehicle
    from .driver import Driver

# ==========================================
# 1. SQLALCHEMY ORM MODELS
# ==========================================

class Trip(Base):
    __tablename__ = "trips"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    vehicle_id: Mapped[UUID] = mapped_column(ForeignKey("vehicles.id", ondelete="RESTRICT"), nullable=False)
    driver_id: Mapped[UUID] = mapped_column(ForeignKey("drivers.id", ondelete="RESTRICT"), nullable=False)
    source: Mapped[str] = mapped_column(String(255), nullable=False)
    destination: Mapped[str] = mapped_column(String(255), nullable=False)
    cargo_weight_kg: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    planned_distance: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="Draft") # Draft, Dispatched, Completed, Cancelled
    route_polyline: Mapped[Optional[List[Dict[str, float]]]] = mapped_column(JSONB, default=lambda: [])
    ai_pairing_score: Mapped[Optional[float]] = mapped_column(Numeric(5, 2), nullable=True)

    # Relationships
    vehicle: Mapped["Vehicle"] = relationship(back_populates="trips")
    driver: Mapped["Driver"] = relationship(back_populates="trips")

