# Expense SQLAlchemy Model placeholder

# expense.py
from datetime import date
from uuid import UUID, uuid4
from sqlalchemy import String, ForeignKey, Date, Numeric, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional

from app.db.base import Base

# ==========================================
# 1. SQLALCHEMY ORM MODELS
# ==========================================

class FuelLog(Base):
    __tablename__ = "fuel_logs"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    vehicle_id: Mapped[UUID] = mapped_column(ForeignKey("vehicles.id", ondelete="CASCADE"), nullable=False)
    liters: Mapped[float] = mapped_column(Numeric(8, 2), nullable=False)
    cost: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    log_date: Mapped[date] = mapped_column(Date, default=date.today)
    efficiency_anomaly: Mapped[bool] = mapped_column(Boolean, default=False)


class Expense(Base):
    __tablename__ = "expenses"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    vehicle_id: Mapped[UUID] = mapped_column(ForeignKey("vehicles.id", ondelete="CASCADE"), nullable=False)
    expense_type: Mapped[str] = mapped_column(String(50), nullable=False) # Toll, Maintenance, Parking
    amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    expense_date: Mapped[date] = mapped_column(Date, default=date.today)
    receipt_url: Mapped[str] = mapped_column(String(512), nullable=True)

