# TransitOps Backend

Smart Transport Operations Platform.

## Directory Structure

This repository is set up with a modular architecture for FastAPI, SQLAlchemy (PostgreSQL), and Alembic:

- `app/main.py`: FastAPI application setup.
- `app/config.py`: Configuration and environment management.
- `app/api/`: Versioned API routers (V1) and dependencies (Auth/RBAC).
- `app/core/`: Security utils and custom exceptions.
- `app/db/`: Database connectivity (Session/Engine setup).
- `app/models/`: SQLAlchemy database models.
- `app/schemas/`: Pydantic validation schemas.
- `app/services/`: Core business logic services.
