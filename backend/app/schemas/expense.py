from datetime import date
from uuid import UUID
from typing import Optional, List
from pydantic import BaseModel, Field
from app.schemas.vehicle import VehicleResponse

class FuelLogBase(BaseModel):
    vehicle_id: UUID
    liters: float = Field(..., gt=0)
    cost: float = Field(..., gt=0)
    log_date: date = Field(default_factory=date.today)
    efficiency_anomaly: bool = Field(default=False)

class FuelLogResponse(FuelLogBase):
    id: UUID
    vehicle: Optional[VehicleResponse] = None

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
    vehicle: Optional[VehicleResponse] = None

    class Config:
        from_attributes = True

# Custom Operations Center Schemas

class OutflowCreate(BaseModel):
    vehicle_id: UUID
    cost: float = Field(..., gt=0)
    log_date: date = Field(default_factory=date.today)
    outflow_type: str = Field(...) # "Fuel" or "Incidental Expense"
    volume: Optional[float] = None # Required if outflow_type == "Fuel"

class OutflowMessage(BaseModel):
    message: str
    record_id: UUID

class OutflowLedgerResponse(BaseModel):
    fuel_acquisition_logs: List[FuelLogResponse]
    incidental_route_expenses: List[ExpenseResponse]

class VehicleROI(BaseModel):
    fleet_asset: str
    fuel_efficiency: str
    accumulated_cost: float
    gross_revenue: float
    net_operational_profit: float
    asset_roi: float
