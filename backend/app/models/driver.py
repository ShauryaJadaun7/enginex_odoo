from uuid import UUID, uuid4
from datetime import date
from typing import TYPE_CHECKING
from sqlalchemy import String, Integer, Date, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from .trip import Trip

class Driver(Base):
    __tablename__ = "drivers"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String, nullable=False)
    license_number: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    license_expiry: Mapped[date] = mapped_column(Date, nullable=False)
    contact_number: Mapped[str] = mapped_column(String, nullable=False)
    safety_score: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    status: Mapped[str] = mapped_column(String, default="Available", nullable=False)  # Available, On Trip, Off Duty, Suspended

    # Relationships
    trips: Mapped[list["Trip"]] = relationship(back_populates="driver")

    __table_args__ = (
        CheckConstraint('safety_score >= 0 AND safety_score <= 100', name='chk_driver_safety_score'),
        CheckConstraint("status IN ('Available', 'On Trip', 'Off Duty', 'Suspended')", name='chk_driver_status_choices'),
    )
