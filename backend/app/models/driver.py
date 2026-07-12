# Driver SQLAlchemy Model placeholder

# driver.py
from datetime import date
from uuid import UUID, uuid4
from typing import TYPE_CHECKING
from sqlalchemy import String, Numeric, Date, Boolean, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from .trip import Trip

# ==========================================
# 1. SQLALCHEMY ORM MODELS
# ==========================================

class Driver(Base):
    __tablename__ = "drivers"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    license_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    license_category: Mapped[str] = mapped_column(String(50), nullable=False, default="Standard")
    contact_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    license_expiry: Mapped[date] = mapped_column(Date, nullable=False)
    safety_score: Mapped[float] = mapped_column(Numeric(5, 2), default=100.0)
    status: Mapped[str] = mapped_column(String(20), default="Available") # Available, On Trip, Off Duty, Suspended
    fatigue_flag: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relationships
    trips: Mapped[list["Trip"]] = relationship(back_populates="driver")

    __table_args__ = (
        CheckConstraint('safety_score >= 0 AND safety_score <= 100', name='chk_driver_safety'),
        CheckConstraint("status IN ('Available', 'On Trip', 'Off Duty', 'Suspended')", name='chk_driver_status'),
    )

