from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Import all models to register them on Base.metadata
from app.models.user import User, Role  # noqa
from app.models.driver import Driver  # noqa
