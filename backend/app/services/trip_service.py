from sqlalchemy.orm import Session
from app.models.trip import Trip
from app.schemas.trip import TripCreate
from app.services.driver_service import check_driver_compliance

def create_trip(db: Session, trip_in: TripCreate) -> Trip:
    """
    Create a new trip.
    Enforces Safety Officer compliance checks: The assigned driver must be legally compliant.
    If the driver's license is expired or they are Suspended, this will throw an exception and block the dispatch.
    """
    # 1. Enforce safety checks
    check_driver_compliance(db, trip_in.driver_id)
    
    # 2. Create the trip
    db_trip = Trip(
        vehicle_id=trip_in.vehicle_id,
        driver_id=trip_in.driver_id,
        source=trip_in.source,
        destination=trip_in.destination,
        cargo_weight_kg=trip_in.cargo_weight_kg,
        planned_distance=trip_in.planned_distance,
        revenue=trip_in.revenue,
        status="Draft"
    )
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip
