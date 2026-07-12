from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, RoleChecker
from app.models.trip import Trip
from app.schemas.trip import TripResponse
from typing import List

router = APIRouter()

@router.get("/", response_model=List[TripResponse], dependencies=[Depends(RoleChecker(["Dispatcher", "Fleet Manager"]))])
def get_trips(db: Session = Depends(get_db)):
    return db.query(Trip).all()
