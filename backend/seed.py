import os
import uuid
from datetime import datetime
from passlib.context import CryptContext

from app.db.session import SessionLocal, engine
from app.db.base import Base
# Make sure all models are imported so Base.metadata can create tables
from app.models.user import User, Role
from app.models.vehicle import Vehicle
from app.models.driver import Driver
from app.models.trip import Trip
from app.models.maintenance import MaintenanceLog
from app.models.expense import Expense

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def seed_db():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Force clear roles to seed everything from scratch
        db.query(User).delete()
        db.query(Role).delete()
        db.commit()

        print("Seeding Roles...")
        roles_data = ["Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst"]
        roles = {}
        for role_name in roles_data:
            role = Role(id=uuid.uuid4(), role_name=role_name)
            db.add(role)
            roles[role_name] = role
        db.commit()

        print("Seeding Users...")
        # Create a default user for testing
        admin_user = User(
            id=uuid.uuid4(),
            email="admin@transitops.com",
            hashed_password=hash_password("admin"),
            role_id=roles["Fleet Manager"].id
        )
        db.add(admin_user)
        db.commit()

        print("Seeding Vehicles...")
        v1 = Vehicle(
            id=uuid.uuid4(),
            registration_number="GJ-01-AA-1234",
            model_name="Van-05",
            type="Van",
            max_capacity_kg=500,
            odometer=12000,
            acquisition_cost=15000,
            status="Available"
        )
        v2 = Vehicle(
            id=uuid.uuid4(),
            registration_number="MH-02-BB-5678",
            model_name="Volvo FH16",
            type="Semi-Truck",
            max_capacity_kg=20000,
            odometer=85000,
            acquisition_cost=95000,
            status="On Trip"
        )
        v3 = Vehicle(
            id=uuid.uuid4(),
            registration_number="DL-03-CC-9012",
            model_name="Tata Isuzu Mux",
            type="Pickup",
            max_capacity_kg=12000,
            odometer=45000,
            acquisition_cost=35000,
            status="In Shop"
        )
        db.add_all([v1, v2, v3])
        db.commit()
        
        print("Seeding Drivers...")
        d1 = Driver(
            id=uuid.uuid4(),
            name="Alex",
            license_number="DL-IND-9988",
            license_expiry=datetime.strptime("2028-12-31", "%Y-%m-%d").date(),
            contact_number="+91 9876543210",
            safety_score=95,
            status="Available"
        )
        d2 = Driver(
            id=uuid.uuid4(),
            name="Rajesh Kumar",
            license_number="DL-IND-4455",
            license_expiry=datetime.strptime("2027-05-14", "%Y-%m-%d").date(),
            contact_number="+91 9998887776",
            safety_score=88,
            status="On Trip"
        )
        d3 = Driver(
            id=uuid.uuid4(),
            name="John Doe",
            license_number="DL-IND-1122",
            license_expiry=datetime.strptime("2024-01-01", "%Y-%m-%d").date(),
            contact_number="+91 8887776665",
            safety_score=72,
            status="Available"
        )
        db.add_all([d1, d2, d3])
        db.commit()

        print("Seeding Trips...")
        t1 = Trip(
            id=uuid.uuid4(),
            source="Mundra Port",
            destination="Ahmedabad ICD",
            vehicle_id=v2.id,
            driver_id=d2.id,
            cargo_weight_kg=18000,
            planned_distance=350,
            revenue=2500,
            status="Dispatched"
        )
        db.add(t1)
        db.commit()

        print("Seeding MaintenanceLog...")
        m1 = MaintenanceLog(
            id=uuid.uuid4(),
            vehicle_id=v3.id,
            description="Engine Oil & Filter Change",
            cost=450,
            log_date=datetime.strptime("2026-07-10", "%Y-%m-%d").date(),
            status="Open"
        )
        db.add(m1)
        db.commit()

        print("Seeding Expenses...")
        e1 = Expense(
            id=uuid.uuid4(),
            vehicle_id=v2.id,
            expense_type="Toll",
            amount=45,
            expense_date=datetime.strptime("2026-07-11", "%Y-%m-%d").date()
        )
        e2 = Expense(
            id=uuid.uuid4(),
            vehicle_id=v2.id,
            expense_type="Fuel",
            amount=180,
            expense_date=datetime.strptime("2026-07-11", "%Y-%m-%d").date()
        )
        db.add_all([e1, e2])
        db.commit()

        print("Database seeding completed successfully.")

    except Exception as e:
        print(f"Error seeding DB: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
