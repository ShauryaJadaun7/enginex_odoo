from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, RoleChecker
from app.models.expense import Expense
from app.schemas.expense import ExpenseResponse, OutflowCreate, OutflowMessage, OutflowLedgerResponse, VehicleROI
from app.services.expense import ExpenseService

router = APIRouter(dependencies=[Depends(RoleChecker(["Fleet Manager", "Financial Analyst"]))])

@router.post("/outflow", response_model=OutflowMessage, status_code=status.HTTP_201_CREATED)
def log_outflow(outflow_in: OutflowCreate, db: Session = Depends(get_db)):
    return ExpenseService.log_outflow(db=db, outflow=outflow_in)

@router.get("/logs", response_model=OutflowLedgerResponse, status_code=status.HTTP_200_OK)
def get_logs(db: Session = Depends(get_db)):
    return ExpenseService.get_logs(db=db)

@router.get("/roi-blueprint", response_model=List[VehicleROI], status_code=status.HTTP_200_OK)
def get_roi_blueprint(db: Session = Depends(get_db)):
    return ExpenseService.get_roi_blueprint(db=db)
@router.get("/", response_model=List[ExpenseResponse])
def get_expenses(db: Session = Depends(get_db)):
    return db.query(Expense).all()
