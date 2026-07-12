from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db, RoleChecker
from app.models.expense import Expense
from app.schemas.expense import ExpenseResponse

router = APIRouter(dependencies=[Depends(RoleChecker(["Fleet Manager", "Financial Analyst"]))])

@router.get("/", response_model=List[ExpenseResponse])
def get_expenses(db: Session = Depends(get_db)):
    return db.query(Expense).all()
