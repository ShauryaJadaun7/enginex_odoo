from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional, Dict, Any
from sqlalchemy import String, ForeignKey, DateTime, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from pydantic import BaseModel, EmailStr, Field

from app.db.base import Base

# ==========================================
# 1. SQLALCHEMY ORM MODELS
# ==========================================

class Role(Base):
    __tablename__ = "roles"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    role_name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    permissions: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, default=lambda: {})

    # Relationships
    users: Mapped[list["User"]] = relationship(back_populates="role")


class User(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    role_id: Mapped[UUID] = mapped_column(ForeignKey("roles.id", ondelete="RESTRICT"), nullable=False)
    last_active_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    role: Mapped["Role"] = relationship(back_populates="users")


# ==========================================
# 2. PYDANTIC SCHEMAS (Validation Engine)
# ==========================================

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