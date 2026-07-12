from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from app.api.deps import get_db, RoleChecker
from app.models.trip import Trip
from app.models.vehicle import Vehicle
from app.models.driver import Driver
from app.schemas.trip import TripResponse, TripCreate
from app.services import trip_service
from typing import List, Optional
from uuid import UUID

router = APIRouter()

@router.get("/", response_model=List[TripResponse], dependencies=[Depends(RoleChecker(["Dispatcher", "Fleet Manager", "Financial Analyst"]))])
def get_trips(db: Session = Depends(get_db)):
    return db.query(Trip).all()

@router.post("/", response_model=TripResponse, dependencies=[Depends(RoleChecker(["Dispatcher", "Fleet Manager"]))])
def create_new_trip(
    trip_in: TripCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new trip assignment. 
    Strictly blocked if the assigned driver has an expired license or is suspended (Safety Officer rules).
    """
    trip = trip_service.create_trip(db=db, trip_in=trip_in)
    
    # Update vehicle and driver status to On Trip
    veh = db.query(Vehicle).filter(Vehicle.id == trip.vehicle_id).first()
    drv = db.query(Driver).filter(Driver.id == trip.driver_id).first()
    if veh:
        veh.status = "On Trip"
    if drv:
        drv.status = "On Trip"
    db.commit()
    db.refresh(trip)
    return trip

@router.patch("/{trip_id}/status", response_model=TripResponse, dependencies=[Depends(RoleChecker(["Dispatcher", "Fleet Manager"]))])
def update_trip_status(
    trip_id: UUID,
    status: str = Body(..., embed=True),
    final_odometer: Optional[float] = Body(None, embed=True),
    db: Session = Depends(get_db)
):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    trip.status = status
    
    if status in ["Completed", "Cancelled"]:
        veh = db.query(Vehicle).filter(Vehicle.id == trip.vehicle_id).first()
        drv = db.query(Driver).filter(Driver.id == trip.driver_id).first()
        if veh:
            veh.status = "Available"
            if status == "Completed" and final_odometer is not None:
                veh.odometer = final_odometer
        if drv:
            drv.status = "Available"
            
    db.commit()
    db.refresh(trip)
    return trip

