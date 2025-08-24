from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Pydantic-settings configuration for loading environment variables
    # This tells pydantic to look for a .env file.
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # --- General Project Settings ---
    PROJECT_NAME: str = "Cogzy AI"
    DEBUG_MODE: bool = False
    API_V1_STR: str = "/api/v1"

    # --- Database (PostgreSQL) Settings ---
    DATABASE_URL: str = Field(..., description="PostgreSQL database connection URL")

    # --- Authentication (Better Auth) Settings ---
    BETTER_AUTH_SECRET: str = Field(
        ..., description="Secret for Better Auth session encryption"
    )
    BETTER_AUTH_ALGORITHM: str = Field(
        ...,
        description="Cryptographic algorithm used for signing/verifying session cookies.",
    )
    BETTER_AUTH_COOKIE_NAME: str = Field(
        ..., description="Name of the cookie Better Auth sets in the browser. "
    )


settings = Settings()
