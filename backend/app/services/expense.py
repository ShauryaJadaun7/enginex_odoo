from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, func
from fastapi import HTTPException
from typing import List
from uuid import UUID

from app.models.expense import Expense, FuelLog
from app.models.vehicle import Vehicle
from app.models.trip import Trip
from app.schemas.expense import OutflowCreate, OutflowMessage, OutflowLedgerResponse, VehicleROI

class ExpenseService:
    @staticmethod
    def log_outflow(db: Session, outflow: OutflowCreate) -> OutflowMessage:
        if outflow.outflow_type == "Fuel":
            if outflow.volume is None or outflow.volume <= 0:
                raise HTTPException(status_code=400, detail="Volume is required and must be > 0 for Fuel logs.")
            record = FuelLog(
                vehicle_id=outflow.vehicle_id,
                liters=outflow.volume,
                cost=outflow.cost,
                log_date=outflow.log_date
            )
            db.add(record)
        elif outflow.outflow_type == "Incidental Expense":
            record = Expense(
                vehicle_id=outflow.vehicle_id,
                expense_type="Incidental Expense",
                amount=outflow.cost,
                expense_date=outflow.log_date
            )
            db.add(record)
        else:
            raise HTTPException(status_code=400, detail="Invalid outflow_type. Must be 'Fuel' or 'Incidental Expense'.")

        try:
            db.commit()
            db.refresh(record)
            return OutflowMessage(message=f"Successfully logged {outflow.outflow_type}", record_id=record.id)
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    @staticmethod
    def get_logs(db: Session) -> OutflowLedgerResponse:
        fuel_stmt = select(FuelLog).options(joinedload(FuelLog.vehicle))
        expense_stmt = select(Expense).options(joinedload(Expense.vehicle))
        
        fuel_logs = db.execute(fuel_stmt).scalars().unique().all()
        expenses = db.execute(expense_stmt).scalars().unique().all()
        
        return OutflowLedgerResponse(
            fuel_acquisition_logs=list(fuel_logs),
            incidental_route_expenses=list(expenses)
        )

    @staticmethod
    def get_roi_blueprint(db: Session) -> List[VehicleROI]:
        # Query all active vehicles
        vehicles = db.execute(select(Vehicle).where(Vehicle.status != "Retired")).scalars().all()
        
        roi_data = []
        for vehicle in vehicles:
            # 1. Distance & Revenue from Trips
            trips = db.execute(select(Trip).where(Trip.vehicle_id == vehicle.id, Trip.status == "Completed")).scalars().all()
            total_distance = sum(float(t.planned_distance) for t in trips)
            total_revenue = sum(float(t.revenue) for t in trips)
            
            # 2. Fuel Metrics
            fuels = db.execute(select(FuelLog).where(FuelLog.vehicle_id == vehicle.id)).scalars().all()
            total_liters = sum(float(f.liters) for f in fuels)
            total_fuel_cost = sum(float(f.cost) for f in fuels)
            
            # 3. Incidental Expenses
            expenses = db.execute(select(Expense).where(Expense.vehicle_id == vehicle.id)).scalars().all()
            total_incidental_cost = sum(float(e.amount) for e in expenses)
            
            # 4. Perform Analytics Math
            accumulated_cost = total_fuel_cost + total_incidental_cost
            gross_revenue = total_revenue
            net_profit = gross_revenue - accumulated_cost
            
            if total_liters > 0:
                efficiency_val = total_distance / total_liters
                fuel_efficiency = f"{efficiency_val:.2f} km/L"
            else:
                fuel_efficiency = "N/A km/L"
                
            acq_cost = float(vehicle.acquisition_cost)
            if acq_cost > 0:
                asset_roi = (net_profit / acq_cost) * 100
            else:
                asset_roi = 0.0
                
            fleet_asset = f"{vehicle.registration_number} ({vehicle.model_name})"
            
            roi_data.append(VehicleROI(
                fleet_asset=fleet_asset,
                fuel_efficiency=fuel_efficiency,
                accumulated_cost=round(accumulated_cost, 2),
                gross_revenue=round(gross_revenue, 2),
                net_operational_profit=round(net_profit, 2),
                asset_roi=round(asset_roi, 2)
            ))
            
        return roi_data
