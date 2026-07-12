from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, RoleChecker
from app.models.trip import Trip
from app.schemas.trip import TripResponse, TripCreate
from app.services import trip_service
from typing import List

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
    return trip_service.create_trip(db=db, trip_in=trip_in)
