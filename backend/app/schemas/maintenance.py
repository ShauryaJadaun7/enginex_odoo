from datetime import date
from uuid import UUID
from pydantic import BaseModel, Field
from typing import Optional
from app.schemas.vehicle import VehicleResponse

class MaintenanceBase(BaseModel):
    vehicle_id: UUID
    log_date: date = Field(default_factory=date.today)
    description: str
    cost: float = Field(default=0.00, ge=0)
    status: str = Field(default="Open")
    is_predictive: bool = Field(default=False)

class MaintenanceCreate(MaintenanceBase):
    pass

class MaintenanceResponse(MaintenanceBase):
    id: UUID
    vehicle: Optional[VehicleResponse] = None

    class Config:
        from_attributes = True
