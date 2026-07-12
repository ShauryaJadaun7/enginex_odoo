from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db, RoleChecker
from app.models.maintenance import MaintenanceLog
from app.schemas.maintenance import MaintenanceResponse

router = APIRouter(dependencies=[Depends(RoleChecker(["Fleet Manager", "Safety Officer"]))])

@router.get("/")
def get_maintenance_logs():
    return []
