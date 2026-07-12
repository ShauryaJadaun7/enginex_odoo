from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, RoleChecker
from app.models.driver import Driver
from app.schemas.driver import DriverResponse
from typing import List

router = APIRouter()

@router.get("/", response_model=List[DriverResponse], dependencies=[Depends(RoleChecker(["Safety Officer", "Fleet Manager", "Dispatcher"]))])
def get_drivers(db: Session = Depends(get_db)):
    return db.query(Driver).all()
