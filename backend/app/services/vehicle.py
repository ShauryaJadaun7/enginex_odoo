from sqlalchemy.orm import Session
from sqlalchemy import select
from fastapi import HTTPException, status
from typing import List, Optional

from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate

class VehicleService:
    @staticmethod
    def create_vehicle(db: Session, vehicle_in: VehicleCreate) -> Vehicle:
        # 1. Duplicate Check
        stmt = select(Vehicle).where(Vehicle.registration_number == vehicle_in.registration_number)
        existing_vehicle = db.execute(stmt).scalars().first()
        
        if existing_vehicle:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A vehicle with this registration number already exists."
            )

        # 2. Default Status
        vehicle_data = vehicle_in.model_dump()
        vehicle_data["status"] = "Available"

        # 3. Database Action
        new_vehicle = Vehicle(**vehicle_data)
        db.add(new_vehicle)
        
        try:
            db.commit()
            db.refresh(new_vehicle)
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while saving the vehicle to the database."
            )
        
        return new_vehicle

    @staticmethod
    def get_vehicles(
        db: Session, 
        status_filter: Optional[str] = None, 
        is_available_for_dispatch: Optional[bool] = False
    ) -> List[Vehicle]:
        stmt = select(Vehicle)

        # 1. Dispatch Filtering Logic
        if is_available_for_dispatch:
            stmt = stmt.where(Vehicle.status == "Available")
        elif status_filter:
            stmt = stmt.where(Vehicle.status == status_filter)

        # 2. Database Action
        try:
            vehicles = db.execute(stmt).scalars().all()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while retrieving vehicles from the database."
            )
            
        return list(vehicles)
