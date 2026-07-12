from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.api.deps import get_db, RoleChecker
from app.schemas.maintenance import MaintenanceCreate, MaintenanceResponse
from app.services.maintenance import MaintenanceService

# Protect all routes by requiring Fleet Manager role
router = APIRouter(dependencies=[Depends(RoleChecker(["Fleet Manager"]))])

@router.post("/", response_model=MaintenanceResponse, status_code=status.HTTP_201_CREATED)
def issue_ticket(
    ticket_in: MaintenanceCreate,
    db: Session = Depends(get_db)
):
    return MaintenanceService.issue_ticket(db=db, ticket_in=ticket_in)


@router.get("/", response_model=List[MaintenanceResponse], status_code=status.HTTP_200_OK)
def get_logs(
    status_filter: Optional[str] = Query(None, alias="status", description="Filter logs by status"),
    db: Session = Depends(get_db)
):
    return MaintenanceService.get_logs(db=db, status_filter=status_filter)


@router.post("/{log_id}/close", response_model=MaintenanceResponse, status_code=status.HTTP_200_OK)
def close_ticket(
    log_id: UUID,
    final_cost: Optional[float] = Query(None, description="Final operational invoice cost"),
    db: Session = Depends(get_db)
):
    return MaintenanceService.close_ticket(db=db, log_id=log_id, final_cost=final_cost)
