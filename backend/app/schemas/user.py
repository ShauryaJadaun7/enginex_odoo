from datetime import datetime
from uuid import UUID
from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field

class RoleBase(BaseModel):
    role_name: str = Field(..., max_length=50, description="Name of the RBAC role")
    permissions: Dict[str, Any] = Field(default_factory=dict, description="UI permission matrix mapping")

class RoleResponse(RoleBase):
    id: UUID

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    role_id: UUID

class UserResponse(UserBase):
    id: UUID
    role_id: UUID
    last_active_at: Optional[datetime]

    class Config:
        from_attributes = True
