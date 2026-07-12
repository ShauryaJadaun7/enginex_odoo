from fastapi import APIRouter, Depends, HTTPException, status, Request, Form
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.core.security import verify_password
from app.models.user import User, Role

router = APIRouter()


@router.post("/login")
def login(
    request: Request,
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    """Authenticate user credentials and set session cookie."""
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated"
        )

    # Set user ID in session
    request.session["user_id"] = str(user.id)

    return {
        "id": str(user.id),
        "email": user.email,
        "role": user.role.role_name,
        "message": "Logged in successfully"
    }

@router.post("/logout")
def logout(request: Request):
    """Clear user session from cookies."""
    request.session.clear()
    return {"message": "Logged out successfully"}

@router.get("/me")
def read_current_user(current_user: User = Depends(get_current_user)):
    """Retrieve logged-in user profile details."""
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "role": current_user.role.role_name,
        "is_active": current_user.is_active
    }

