from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.api.deps import get_db, RoleChecker
from app.schemas.vehicle import VehicleCreate, VehicleResponse
from app.services.vehicle import VehicleService

router = APIRouter()

@router.post("/", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(RoleChecker(["Fleet Manager"]))])
def create_vehicle(
    vehicle_in: VehicleCreate,
    db: Session = Depends(get_db)
):
    return VehicleService.create_vehicle(db=db, vehicle_in=vehicle_in)

@router.get("/", response_model=List[VehicleResponse], status_code=status.HTTP_200_OK, dependencies=[Depends(RoleChecker(["Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst"]))])
def get_vehicles(
    status_filter: Optional[str] = Query(None, alias="status", description="Filter vehicles by status"),
    is_available_for_dispatch: Optional[bool] = Query(False, description="Strictly filter for Available vehicles"),
    db: Session = Depends(get_db)
):
    return VehicleService.get_vehicles(
        db=db, 
        status_filter=status_filter, 
        is_available_for_dispatch=is_available_for_dispatch
    )
