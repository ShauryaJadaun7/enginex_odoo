from fastapi import APIRouter
from app.api.v1 import auth, vehicles, drivers, trips, maintenance, expenses, analytics

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(vehicles.router, prefix="/vehicles", tags=["vehicles"])
api_router.include_router(drivers.router, prefix="/drivers", tags=["drivers"])
api_router.include_router(trips.router, prefix="/trips", tags=["trips"])
api_router.include_router(maintenance.router, prefix="/maintenance", tags=["maintenance"])
api_router.include_router(expenses.router, prefix="/expenses", tags=["expenses"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
