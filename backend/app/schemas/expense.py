from datetime import date
from uuid import UUID
from typing import Optional
from pydantic import BaseModel, Field

class FuelLogBase(BaseModel):
    vehicle_id: UUID
    liters: float = Field(..., gt=0)
    cost: float = Field(..., gt=0)
    log_date: date = Field(default_factory=date.today)
    efficiency_anomaly: bool = Field(default=False)

class FuelLogResponse(FuelLogBase):
    id: UUID

    class Config:
        from_attributes = True

class ExpenseBase(BaseModel):
    vehicle_id: UUID
    expense_type: str = Field(..., max_length=50)
    amount: float = Field(..., gt=0)
    expense_date: date = Field(default_factory=date.today)
    receipt_url: Optional[str] = None

class ExpenseResponse(ExpenseBase):
    id: UUID

    class Config:
        from_attributes = True
