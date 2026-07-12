from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, RoleChecker
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleResponse
from typing import List

router = APIRouter()

@router.get("/", response_model=List[VehicleResponse], dependencies=[Depends(RoleChecker(["Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst"]))])
def get_vehicles(db: Session = Depends(get_db)):
    vehicles = db.query(Vehicle).all()
    return vehicles
