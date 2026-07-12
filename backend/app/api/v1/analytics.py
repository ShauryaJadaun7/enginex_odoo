from fastapi import APIRouter

router = APIRouter()

@router.get("/kpis")
def get_kpis():
    return {"message": "Analytics KPIs placeholder"}
