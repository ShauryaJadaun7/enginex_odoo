# Import all models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base  # noqa
from app.models.user import User, Role  # noqa
from app.models.driver import Driver  # noqa
