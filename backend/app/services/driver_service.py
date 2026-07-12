from datetime import date
from sqlalchemy.orm import Session
from app.models.driver import Driver
from app.schemas.driver import DriverCreate, DriverUpdate
from app.core.exceptions import ExpiredLicenseException, DriverSuspendedException

def create_driver(db: Session, driver_in: DriverCreate) -> Driver:
    """
    Onboard a driver.
    Checks if license_expiry_date is in the past and raises ExpiredLicenseException if so.
    """
    if driver_in.license_expiry_date < date.today():
        raise ExpiredLicenseException()
        
    db_driver = Driver(
        name=driver_in.name,
        license_number=driver_in.license_number,
        license_category=driver_in.license_category,
        license_expiry_date=driver_in.license_expiry_date,
        contact_number=driver_in.contact_number,
        safety_score=100,
        status="Available"
    )
    db.add(db_driver)
    db.commit()
    db.refresh(db_driver)
    return db_driver

def update_driver_status(db: Session, driver_id: int, status: str) -> Driver:
    """
    Manually update driver operational status (e.g. to Suspended, Off Duty, etc.).
    """
    db_driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if not db_driver:
        return None
        
    db_driver.status = status
    db.commit()
    db.refresh(db_driver)
    return db_driver

def update_safety_score(db: Session, driver_id: int, new_score: int) -> Driver:
    """
    Update driver safety score. If score falls below 40, automatically suspend the driver.
    """
    db_driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if not db_driver:
        return None
        
    db_driver.safety_score = new_score
    if new_score < 40:
        db_driver.status = "Suspended"
        
    db.commit()
    db.refresh(db_driver)
    return db_driver

def check_driver_compliance(db: Session, driver_id: int) -> bool:
    """
    Evaluate if driver is compliant and legally fit to drive.
    Raises ExpiredLicenseException if license is expired.
    Raises DriverSuspendedException if driver status is Suspended.
    Returns True if compliant.
    """
    db_driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if not db_driver:
        return False
        
    # Check expiry
    if db_driver.license_expiry_date < date.today():
        raise ExpiredLicenseException()
        
    # Check suspension
    if db_driver.status == "Suspended":
        raise DriverSuspendedException()
        
    return True
