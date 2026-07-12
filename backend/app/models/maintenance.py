# Maintenance SQLAlchemy Model placeholder

# maintenance.py
from datetime import date
from uuid import UUID, uuid4
from typing import TYPE_CHECKING
from sqlalchemy import String, ForeignKey, Date, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from .vehicle import Vehicle

# ==========================================
# 1. SQLALCHEMY ORM MODELS
# ==========================================

class MaintenanceLog(Base):
    __tablename__ = "maintenance_logs"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    vehicle_id: Mapped[UUID] = mapped_column(ForeignKey("vehicles.id", ondelete="CASCADE"), nullable=False)
    log_date: Mapped[date] = mapped_column(Date, default=date.today)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="Open") # Open, Closed
    is_predictive: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relationships
    vehicle: Mapped["Vehicle"] = relationship(back_populates="maintenance_logs")

