from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from sqlalchemy.orm import Session

from app.api.deps import get_db, RoleChecker
from app.models.driver import Driver
from app.schemas.driver import DriverCreate, DriverUpdate, DriverResponse
from app.services import driver_service

router = APIRouter()

@router.post("/", response_model=DriverResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(RoleChecker(["Safety Officer"]))])
def onboard_driver(
    driver_in: DriverCreate,
    db: Session = Depends(get_db)
):
    """Onboard a new driver under Safety Officer RBAC."""
    return driver_service.create_driver(db=db, driver_in=driver_in)

@router.get("/", response_model=List[DriverResponse], dependencies=[Depends(RoleChecker(["Safety Officer", "Fleet Manager", "Dispatcher"]))])
def list_drivers(
    status: Optional[str] = Query(None, description="Filter by operational status"),
    license_category: Optional[str] = Query(None, description="Filter by license category"),
    db: Session = Depends(get_db)
):
    """List drivers with optional category or status filters."""
    query = db.query(Driver)
    if status:
        query = query.filter(Driver.status == status)
    if license_category:
        query = query.filter(Driver.license_category == license_category)
    return query.all()

@router.get("/compliance/expiring-licenses", response_model=List[DriverResponse], dependencies=[Depends(RoleChecker(["Safety Officer"]))])
def get_expiring_licenses(
    days: int = Query(30, ge=0, description="Days until expiry"),
    db: Session = Depends(get_db)
):
    """List drivers whose licenses expire within the specified number of days."""
    return driver_service.get_expiring_licenses(db=db, days=days)

@router.post("/compliance/suspend-expired", response_model=List[DriverResponse], dependencies=[Depends(RoleChecker(["Safety Officer"]))])
def suspend_expired_licenses(db: Session = Depends(get_db)):
    """Automatically suspend drivers with expired licenses."""
    return driver_service.suspend_expired_licenses(db=db)

@router.get("/compliance/low-safety-scores", response_model=List[DriverResponse], dependencies=[Depends(RoleChecker(["Safety Officer"]))])
def get_low_safety_scores(
    threshold: int = Query(70, ge=0, le=100, description="Safety score threshold"),
    db: Session = Depends(get_db)
):
    """List drivers with safety scores below a threshold."""
    return driver_service.get_low_safety_scores(db=db, threshold=threshold)

@router.get("/{driver_id}", response_model=DriverResponse, dependencies=[Depends(RoleChecker(["Safety Officer", "Fleet Manager", "Dispatcher"]))])
def get_driver_profile(
    driver_id: UUID,
    db: Session = Depends(get_db)
):
    """Retrieve details for a specific driver."""
    db_driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if not db_driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Driver profile not found."
        )
    return db_driver

@router.put("/{driver_id}", response_model=DriverResponse, dependencies=[Depends(RoleChecker(["Safety Officer", "Fleet Manager"]))])
def update_driver_details(
    driver_id: UUID,
    driver_in: DriverUpdate,
    db: Session = Depends(get_db)
):
    """Update driver profile details."""
    db_driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if not db_driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Driver profile not found."
        )
    
    update_data = driver_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_driver, key, value)
        
    # Enforce safety score status check on update
    if db_driver.safety_score < 40:
        db_driver.status = "Suspended"

    db.commit()
    db.refresh(db_driver)
    return db_driver

@router.patch("/{driver_id}/safety-score", response_model=DriverResponse, dependencies=[Depends(RoleChecker(["Safety Officer"]))])
def update_driver_safety_score(
    driver_id: UUID,
    safety_score: int = Body(..., ge=0, le=100, embed=True),
    db: Session = Depends(get_db)
):
    """Quick PATCH endpoint to update safety metrics."""
    db_driver = driver_service.update_safety_score(db=db, driver_id=driver_id, new_score=safety_score)
    if not db_driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Driver profile not found."
        )
    return db_driver
