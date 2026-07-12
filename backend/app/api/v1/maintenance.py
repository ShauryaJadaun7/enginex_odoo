from typing import List
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from uuid import UUID

from app.api.deps import get_db, RoleChecker
from app.models.maintenance import MaintenanceLog
from app.models.vehicle import Vehicle
from app.schemas.maintenance import MaintenanceResponse, MaintenanceCreate

router = APIRouter(dependencies=[Depends(RoleChecker(["Fleet Manager", "Safety Officer", "Financial Analyst"]))])

@router.get("/", response_model=List[MaintenanceResponse])
def get_maintenance_logs(db: Session = Depends(get_db)):
    return db.query(MaintenanceLog).all()

@router.post("/", response_model=MaintenanceResponse)
def create_maintenance_log(
    log_in: MaintenanceCreate,
    db: Session = Depends(get_db)
):
    import uuid
    db_log = MaintenanceLog(
        id=uuid.uuid4(),
        vehicle_id=log_in.vehicle_id,
        log_date=log_in.log_date,
        description=log_in.description,
        cost=log_in.cost,
        status=log_in.status,
        is_predictive=log_in.is_predictive
    )
    db.add(db_log)
    
    # Auto set vehicle status to "In Shop"
    veh = db.query(Vehicle).filter(Vehicle.id == log_in.vehicle_id).first()
    if veh:
        veh.status = "In Shop"
        
    db.commit()
    db.refresh(db_log)
    return db_log

@router.patch("/{log_id}/status", response_model=MaintenanceResponse)
def update_maintenance_status(
    log_id: UUID,
    status: str = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    log = db.query(MaintenanceLog).filter(MaintenanceLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
        
    log.status = status
    if status == "Closed":
        veh = db.query(Vehicle).filter(Vehicle.id == log.vehicle_id).first()
        if veh:
            veh.status = "Available"
            
    db.commit()
    db.refresh(log)
    return log

