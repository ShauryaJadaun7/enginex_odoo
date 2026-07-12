from datetime import date, timedelta
from typing import List
from sqlalchemy.orm import Session
from app.models.driver import Driver
from app.schemas.driver import DriverCreate, DriverUpdate
from app.core.exceptions import ExpiredLicenseException, DriverSuspendedException

def create_driver(db: Session, driver_in: DriverCreate) -> Driver:
    """
    Onboard a driver.
    Checks if license_expiry is in the past and raises ExpiredLicenseException if so.
    """
    if driver_in.license_expiry < date.today():
        raise ExpiredLicenseException()
        
    db_driver = Driver(
        name=driver_in.name,
        license_number=driver_in.license_number,
        license_category=driver_in.license_category,
        license_expiry=driver_in.license_expiry,
        contact_number=driver_in.contact_number,
        safety_score=driver_in.safety_score,
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
    if db_driver.license_expiry < date.today():
        raise ExpiredLicenseException()
        
    # Check suspension
    if db_driver.status == "Suspended":
        raise DriverSuspendedException()
        
    return True

def get_expiring_licenses(db: Session, days: int = 30) -> List[Driver]:
    """
    Get a list of drivers whose licenses have expired or will expire within the given number of days.
    """
    target_date = date.today() + timedelta(days=days)
    return db.query(Driver).filter(Driver.license_expiry <= target_date).all()

def suspend_expired_licenses(db: Session) -> List[Driver]:
    """
    Find all drivers with expired licenses whose status is not already Suspended,
    update their status to Suspended, and return them.
    """
    expired_drivers = db.query(Driver).filter(
        Driver.license_expiry < date.today(),
        Driver.status != "Suspended"
    ).all()
    
    for driver in expired_drivers:
        driver.status = "Suspended"
        
    if expired_drivers:
        db.commit()
        for driver in expired_drivers:
            db.refresh(driver)
            
    return expired_drivers

def get_low_safety_scores(db: Session, threshold: int = 70) -> List[Driver]:
    """
    Get a list of drivers whose safety score is below the given threshold.
    """
    return db.query(Driver).filter(Driver.safety_score < threshold).all()
