import os
import uuid
import random
from datetime import datetime, timedelta
from passlib.context import CryptContext

from app.db.session import SessionLocal, engine
from app.db.base import Base
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
        # Clear tables
        db.query(Expense).delete()
        db.query(MaintenanceLog).delete()
        db.query(Trip).delete()
        db.query(Driver).delete()
        db.query(Vehicle).delete()
        db.query(User).delete()
        db.query(Role).delete()
        db.commit()

        print("Seeding Roles & Users...")
        roles_data = ["Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst"]
        roles = {}
        for role_name in roles_data:
            role = Role(id=uuid.uuid4(), role_name=role_name)
            db.add(role)
            roles[role_name] = role
        
        users = [
            User(id=uuid.uuid4(), email="manager@transitops.com", hashed_password=hash_password("admin"), role_id=roles["Fleet Manager"].id),
            User(id=uuid.uuid4(), email="dispatcher@transitops.com", hashed_password=hash_password("admin"), role_id=roles["Dispatcher"].id),
            User(id=uuid.uuid4(), email="safety@transitops.com", hashed_password=hash_password("admin"), role_id=roles["Safety Officer"].id),
            User(id=uuid.uuid4(), email="finance@transitops.com", hashed_password=hash_password("admin"), role_id=roles["Financial Analyst"].id)
        ]
        db.add_all(users)
        db.commit()

        print("Seeding Vehicles...")
        v_data = [
            ("GJ-01-AA-1234", "Ford Transit", "Van", 1200, 15000, 32000, "Available"),
            ("MH-02-BB-5678", "Volvo FH16", "Semi-Truck", 25000, 85000, 120000, "On Trip"),
            ("DL-03-CC-9012", "Tata Prima", "Semi-Truck", 22000, 45000, 110000, "In Shop"),
            ("KA-04-DD-3456", "Isuzu D-Max", "Pickup", 1500, 22000, 28000, "Available"),
            ("TN-05-EE-7890", "Mercedes Actros", "Semi-Truck", 30000, 115000, 145000, "On Trip"),
            ("UP-06-FF-1122", "Mahindra Bolero", "Pickup", 1000, 8000, 15000, "Available"),
            ("RJ-07-GG-3344", "Ashok Leyland Dost", "Van", 1500, 5000, 12000, "Available"),
            ("WB-08-HH-5566", "Eicher Pro", "Box Truck", 8000, 35000, 45000, "In Shop"),
            ("KL-09-II-7788", "Scania R450", "Semi-Truck", 28000, 92000, 135000, "On Trip"),
            ("PB-10-JJ-9900", "Chevy Express", "Van", 1200, 60000, 29000, "Available"),
            ("HR-11-KK-1212", "Ford F-150", "Pickup", 1100, 18000, 35000, "On Trip"),
            ("MP-12-LL-3434", "Peterbilt 579", "Semi-Truck", 32000, 210000, 160000, "In Shop"),
            ("CH-13-MM-5656", "Kenworth T680", "Semi-Truck", 30000, 185000, 155000, "Available"),
            ("TS-14-NN-7878", "Ram 2500", "Pickup", 1400, 11000, 42000, "Available"),
            ("AP-15-OO-9090", "Hino 268", "Box Truck", 11000, 54000, 68000, "On Trip"),
        ]
        vehicles = []
        for v in v_data:
            veh = Vehicle(id=uuid.uuid4(), registration_number=v[0], model_name=v[1], type=v[2], max_capacity_kg=v[3], odometer=v[4], acquisition_cost=v[5], status=v[6])
            vehicles.append(veh)
        db.add_all(vehicles)
        db.commit()

        print("Seeding Drivers...")
        d_data = [
            ("Alex Carter", "DL-IND-9988", "Heavy Commercial", 95, "Available"),
            ("Rajesh Kumar", "DL-IND-4455", "Heavy Commercial", 88, "On Trip"),
            ("John Doe", "DL-US-12345", "Light Commercial", 72, "Available"),
            ("Maria Garcia", "DL-ES-78901", "Heavy Commercial", 99, "On Trip"),
            ("Ahmed Hassan", "DL-AE-34567", "Light Commercial", 85, "Suspended"),
            ("Wei Chen", "DL-CN-23456", "Heavy Commercial", 91, "Available"),
            ("Suresh Nair", "DL-IND-1122", "Light Commercial", 78, "Off Duty"),
            ("David Smith", "DL-UK-88776", "Heavy Commercial", 82, "On Trip"),
            ("Priya Sharma", "DL-IND-5544", "Heavy Commercial", 96, "Available"),
            ("Yusuf Ali", "DL-PK-99001", "Light Commercial", 65, "Available"),
            ("Liam O'Connor", "DL-IE-44332", "Heavy Commercial", 93, "On Trip"),
            ("Elena Rostova", "DL-RU-66554", "Heavy Commercial", 87, "Off Duty"),
            ("Kenji Tanaka", "DL-JP-11223", "Light Commercial", 98, "Available"),
            ("Fatima Diallo", "DL-ZA-44556", "Heavy Commercial", 89, "On Trip"),
            ("Carlos Ruiz", "DL-MX-77889", "Light Commercial", 74, "Suspended"),
        ]
        drivers = []
        for i, d in enumerate(d_data):
            drv = Driver(
                id=uuid.uuid4(),
                name=d[0],
                license_number=d[1],
                license_category=d[2],
                license_expiry_date=(datetime.now() + timedelta(days=random.randint(100, 2000))).date(),
                contact_number=f"+1 555-01{i:02d}",
                safety_score=d[3],
                status=d[4]
            )
            drivers.append(drv)
        db.add_all(drivers)
        db.commit()

        print("Seeding Trips...")
        t_data = [
            (vehicles[1].id, drivers[1].id, "Mundra Port", "Ahmedabad ICD", 18000, 350, 2500, "Dispatched"),
            (vehicles[4].id, drivers[3].id, "Los Angeles", "San Francisco", 25000, 600, 4200, "Dispatched"),
            (vehicles[8].id, drivers[7].id, "New York", "Boston", 20000, 340, 2800, "Completed"),
            (vehicles[10].id, drivers[10].id, "Chicago", "Detroit", 1000, 450, 1500, "Dispatched"),
            (vehicles[14].id, drivers[13].id, "Houston", "Dallas", 9500, 380, 2100, "Dispatched"),
            (vehicles[0].id, drivers[0].id, "Seattle", "Portland", 800, 280, 900, "Completed"),
            (vehicles[3].id, drivers[2].id, "Miami", "Orlando", 1200, 370, 1100, "Completed"),
            (vehicles[6].id, drivers[5].id, "Phoenix", "Tucson", 900, 180, 800, "Completed"),
            (vehicles[9].id, drivers[8].id, "Denver", "Colorado Springs", 1000, 110, 600, "Dispatched"),
            (vehicles[13].id, drivers[12].id, "Atlanta", "Savannah", 1300, 400, 1300, "Dispatched"),
            (vehicles[1].id, drivers[1].id, "Ahmedabad ICD", "Delhi", 20000, 900, 5500, "Completed"),
            (vehicles[4].id, drivers[3].id, "San Francisco", "Sacramento", 22000, 140, 1200, "Completed"),
        ]
        trips = []
        for t in t_data:
            trp = Trip(
                id=uuid.uuid4(),
                vehicle_id=t[0],
                driver_id=t[1],
                source=t[2],
                destination=t[3],
                cargo_weight_kg=t[4],
                planned_distance=t[5],
                revenue=t[6],
                status=t[7]
            )
            trips.append(trp)
        db.add_all(trips)
        db.commit()

        print("Seeding MaintenanceLog...")
        m_data = [
            (vehicles[2].id, "Engine Oil & Filter Change", 450, "Open"),
            (vehicles[7].id, "Brake Pad Replacement", 800, "Active"),
            (vehicles[11].id, "Transmission Overhaul", 3500, "Open"),
            (vehicles[0].id, "Tire Rotation", 120, "Closed"),
            (vehicles[3].id, "Battery Replacement", 250, "Closed"),
            (vehicles[4].id, "Coolant Flush", 180, "Closed"),
            (vehicles[8].id, "Suspension Repair", 1200, "Active"),
            (vehicles[14].id, "Headlight Bulb Replacement", 40, "Closed"),
            (vehicles[9].id, "Wiper Blade Replacement", 30, "Closed"),
            (vehicles[1].id, "Routine Inspection", 150, "Closed"),
        ]
        for i, m in enumerate(m_data):
            mlog = MaintenanceLog(
                id=uuid.uuid4(),
                vehicle_id=m[0],
                description=m[1],
                cost=m[2],
                log_date=(datetime.now() - timedelta(days=random.randint(1, 30))).date(),
                status=m[3]
            )
            db.add(mlog)
        db.commit()

        print("Seeding Expenses...")
        expense_types = ["Fuel", "Toll", "Permit", "Parking", "Fine", "Maintenance"]
        expenses = []
        for _ in range(40):
            exp = Expense(
                id=uuid.uuid4(),
                vehicle_id=random.choice(vehicles).id,
                expense_type=random.choice(expense_types),
                amount=random.randint(20, 500),
                expense_date=(datetime.now() - timedelta(days=random.randint(1, 60))).date()
            )
            expenses.append(exp)
        db.add_all(expenses)
        db.commit()

        print("Database seeding completed successfully.")

    except Exception as e:
        print(f"Error seeding DB: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()

