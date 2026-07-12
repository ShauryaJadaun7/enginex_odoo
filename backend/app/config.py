from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "TransitOps API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "transitops-super-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/transitops"

    class Config:
        env_file = ".env"

settings = Settings()
