from datetime import date
from sqlalchemy import Column, Integer, String, Date, CheckConstraint
from app.db.base import Base

class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    license_number = Column(String, unique=True, index=True, nullable=False)
    license_category = Column(String, nullable=False)
    license_expiry_date = Column(Date, nullable=False)
    contact_number = Column(String, nullable=False)
    safety_score = Column(Integer, default=100, nullable=False)
    status = Column(String, default="Available", nullable=False)  # Available, On Trip, Off Duty, Suspended

    __table_args__ = (
        CheckConstraint('safety_score >= 0 AND safety_score <= 100', name='chk_driver_safety_score'),
        CheckConstraint("status IN ('Available', 'On Trip', 'Off Duty', 'Suspended')", name='chk_driver_status_choices'),
    )
