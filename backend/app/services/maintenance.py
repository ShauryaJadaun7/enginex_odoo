from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from fastapi import HTTPException, status
from typing import List, Optional
from uuid import UUID

from app.models.maintenance import MaintenanceLog
from app.models.vehicle import Vehicle
from app.models.expense import Expense
from app.schemas.maintenance import MaintenanceCreate

class MaintenanceService:
    @staticmethod
    def issue_ticket(db: Session, ticket_in: MaintenanceCreate) -> MaintenanceLog:
        # 1. Check vehicle and modify state
        stmt = select(Vehicle).where(Vehicle.id == ticket_in.vehicle_id)
        vehicle = db.execute(stmt).scalars().first()
        if not vehicle:
            raise HTTPException(status_code=404, detail="Vehicle not found")

        vehicle.status = "In Shop"
        
        # 2. Save log with Open status
        ticket_data = ticket_in.model_dump()
        ticket_data["status"] = "Open"
        new_ticket = MaintenanceLog(**ticket_data)
        
        db.add(new_ticket)
        try:
            db.commit()
            db.refresh(new_ticket)
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
            
        return new_ticket

    @staticmethod
    def get_logs(db: Session, status_filter: Optional[str] = None) -> List[MaintenanceLog]:
        # Include the vehicle relation eagerly to satisfy Pydantic Schema joining
        stmt = select(MaintenanceLog).options(joinedload(MaintenanceLog.vehicle))
        
        if status_filter:
            stmt = stmt.where(MaintenanceLog.status == status_filter)
            
        try:
            logs = db.execute(stmt).scalars().unique().all()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
            
        return list(logs)

    @staticmethod
    def close_ticket(db: Session, log_id: UUID, final_cost: Optional[float] = None) -> MaintenanceLog:
        stmt = select(MaintenanceLog).options(joinedload(MaintenanceLog.vehicle)).where(MaintenanceLog.id == log_id)
        ticket = db.execute(stmt).scalars().first()
        
        if not ticket:
            raise HTTPException(status_code=404, detail="Maintenance ticket not found")
            
        if ticket.status == "Closed":
            raise HTTPException(status_code=400, detail="Ticket is already closed")
            
        ticket.status = "Closed"
        
        # Log Operational Cost logic
        if final_cost is not None:
            ticket.cost = final_cost
            
            new_expense = Expense(
                vehicle_id=ticket.vehicle_id,
                expense_type="Maintenance",
                amount=final_cost,
                expense_date=ticket.log_date
            )
            db.add(new_expense)
            
        # Restore Vehicle Status logic
        if ticket.vehicle and ticket.vehicle.status != "Retired":
            ticket.vehicle.status = "Available"
            
        try:
            db.commit()
            db.refresh(ticket)
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
            
        return ticket
