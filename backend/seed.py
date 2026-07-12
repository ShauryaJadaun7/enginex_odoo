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
            ("MH-01-AA-1234", "Tata Ace", "Light Truck", 750, 45000, 550000, "Available"),
            ("MH-04-BB-5678", "Tata Prima", "Heavy Truck", 25000, 185000, 3200000, "On Trip"),
            ("DL-01-CC-9012", "Ashok Leyland Dost", "Light Truck", 1250, 45000, 750000, "In Shop"),
            ("KA-05-DD-3456", "Mahindra Blazo X", "Heavy Truck", 35000, 220000, 3800000, "Available"),
            ("TN-02-EE-7890", "BharatBenz 3123R", "Heavy Truck", 31000, 115000, 3100000, "On Trip"),
            ("UP-14-FF-1122", "Mahindra Bolero Pik-Up", "Pickup", 1000, 68000, 850000, "Available"),
            ("RJ-14-GG-3344", "Eicher Pro 2049", "Light Truck", 2000, 35000, 1100000, "Available"),
            ("WB-02-HH-5566", "Tata Signa", "Heavy Truck", 40000, 135000, 3900000, "In Shop"),
            ("KL-07-II-7788", "Swaraj Mazda", "Box Truck", 8000, 192000, 1450000, "On Trip"),
            ("PB-08-JJ-9900", "Maruti Suzuki Super Carry", "Light Truck", 740, 60000, 490000, "Available"),
            ("HR-26-KK-1212", "Force Traveller", "Van", 1100, 118000, 1500000, "On Trip"),
            ("MP-09-LL-3434", "Eicher Pro 3015", "Heavy Truck", 15000, 210000, 2400000, "In Shop"),
            ("CH-01-MM-5656", "Ashok Leyland Boss", "Medium Truck", 11000, 185000, 1850000, "Available"),
            ("TS-09-NN-7878", "Tata Ultra", "Medium Truck", 7000, 81000, 1650000, "Available"),
            ("AP-16-OO-9090", "Mahindra Furio", "Medium Truck", 11000, 54000, 1780000, "On Trip"),
        ]
        vehicles = []
        for v in v_data:
            veh = Vehicle(id=uuid.uuid4(), registration_number=v[0], model_name=v[1], type=v[2], max_capacity_kg=v[3], odometer=v[4], acquisition_cost=v[5], status=v[6])
            vehicles.append(veh)
        db.add_all(vehicles)
        db.commit()

        print("Seeding Drivers...")
        d_data = [
            ("Rajesh Kumar", "DL-IND-9988", "Heavy Commercial", 95, "Available"),
            ("Amit Patel", "DL-IND-4455", "Heavy Commercial", 88, "On Trip"),
            ("Vikram Singh", "DL-IND-12345", "Light Commercial", 72, "Available"),
            ("Priya Desai", "DL-IND-78901", "Heavy Commercial", 99, "On Trip"),
            ("Rahul Verma", "DL-IND-34567", "Light Commercial", 85, "Suspended"),
            ("Neha Sharma", "DL-IND-23456", "Heavy Commercial", 91, "Available"),
            ("Suresh Menon", "DL-IND-1122", "Light Commercial", 78, "Off Duty"),
            ("Anjali Gupta", "DL-IND-88776", "Heavy Commercial", 82, "On Trip"),
            ("Ramesh Yadav", "DL-IND-5544", "Heavy Commercial", 96, "Available"),
            ("Manish Tiwari", "DL-IND-99001", "Light Commercial", 65, "Available"),
            ("Deepak Chahar", "DL-IND-44332", "Heavy Commercial", 93, "On Trip"),
            ("Sneha Iyer", "DL-IND-66554", "Heavy Commercial", 87, "Off Duty"),
            ("Manoj Bajpayee", "DL-IND-11223", "Light Commercial", 98, "Available"),
            ("Sunita Rao", "DL-IND-44556", "Heavy Commercial", 89, "On Trip"),
            ("Kiran Bedi", "DL-IND-77889", "Light Commercial", 74, "Suspended"),
        ]
        drivers = []
        for i, d in enumerate(d_data):
            drv = Driver(
                id=uuid.uuid4(),
                name=d[0],
                license_number=d[1],
                license_category=d[2],
                license_expiry_date=(datetime.now() + timedelta(days=random.randint(100, 2000))).date(),
                contact_number=f"+91 98765{i:04d}",
                safety_score=d[3],
                status=d[4]
            )
            drivers.append(drv)
        db.add_all(drivers)
        db.commit()

        print("Seeding Trips...")
        t_data = [
            (vehicles[1].id, drivers[1].id, "Mundra Port", "Ahmedabad ICD", 18000, 350, 45000, "Dispatched"),
            (vehicles[4].id, drivers[3].id, "Mumbai", "Pune", 25000, 150, 18000, "Dispatched"),
            (vehicles[8].id, drivers[7].id, "Delhi", "Jaipur", 20000, 280, 32000, "Completed"),
            (vehicles[10].id, drivers[10].id, "Chennai", "Bangalore", 1000, 350, 28000, "Dispatched"),
            (vehicles[14].id, drivers[13].id, "Hyderabad", "Vijayawada", 9500, 275, 24000, "Dispatched"),
            (vehicles[0].id, drivers[0].id, "Kolkata", "Haldia", 700, 120, 12000, "Completed"),
            (vehicles[3].id, drivers[2].id, "Surat", "Vadodara", 1200, 150, 14000, "Completed"),
            (vehicles[6].id, drivers[5].id, "Bangalore", "Mysore", 900, 145, 12500, "Completed"),
            (vehicles[9].id, drivers[8].id, "Lucknow", "Kanpur", 700, 90, 8000, "Dispatched"),
            (vehicles[12].id, drivers[12].id, "Coimbatore", "Kochi", 7500, 190, 22000, "Dispatched"),
            (vehicles[1].id, drivers[1].id, "Ahmedabad ICD", "Delhi", 20000, 900, 85000, "Completed"),
            (vehicles[4].id, drivers[3].id, "Pune", "Nashik", 22000, 210, 25000, "Completed"),
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
            (vehicles[2].id, "Engine Oil & Filter Change", 4500, "Open"),
            (vehicles[7].id, "Brake Pad Replacement", 8500, "Active"),
            (vehicles[11].id, "Transmission Overhaul", 45000, "Open"),
            (vehicles[0].id, "Tire Rotation", 1200, "Closed"),
            (vehicles[3].id, "Battery Replacement", 6500, "Closed"),
            (vehicles[4].id, "Coolant Flush", 1800, "Closed"),
            (vehicles[8].id, "Suspension Repair", 12500, "Active"),
            (vehicles[14].id, "Headlight Bulb Replacement", 500, "Closed"),
            (vehicles[9].id, "Wiper Blade Replacement", 400, "Closed"),
            (vehicles[1].id, "Routine Inspection", 2500, "Closed"),
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
        for _ in range(60):
            exp = Expense(
                id=uuid.uuid4(),
                vehicle_id=random.choice(vehicles).id,
                expense_type=random.choice(expense_types),
                amount=random.randint(500, 8000),
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
