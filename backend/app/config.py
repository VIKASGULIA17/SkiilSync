"""
SkillSync application configuration.

Uses pydantic-settings to load environment variables from .env file.
Supports a runtime-settable API key that takes precedence over the .env value.
"""

from pathlib import Path
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


# ---------------------------------------------------------------------------
# Runtime API key storage (module-level, not part of BaseSettings)
# ---------------------------------------------------------------------------
_runtime_api_key: Optional[str] = None


def set_runtime_api_key(key: str) -> None:
    """Set the API key at runtime (e.g. from an API endpoint)."""
    global _runtime_api_key
    _runtime_api_key = key


def get_runtime_api_key() -> Optional[str]:
    """Return the runtime API key, if one has been set."""
    return _runtime_api_key


def get_api_key() -> Optional[str]:
    """
    Return the best available API key.

    Priority:
      1. Runtime key (set via the /api/settings/api-key endpoint)
      2. Environment / .env key (GROQ_API_KEY)
    """
    if _runtime_api_key:
        return _runtime_api_key
    return settings.GROQ_API_KEY


# ---------------------------------------------------------------------------
# Settings loaded from environment / .env
# ---------------------------------------------------------------------------
class Settings(BaseSettings):
    """Application settings loaded from environment variables and .env file."""

    GROQ_API_KEY: Optional[str] = None
    DATABASE_URL: str = "sqlite:///./data/skillsync.db"
    SKILLS_CSV_PATH: str = "./data/skills_data.csv"
    SCRAPE_ON_STARTUP: bool = True
    SCRAPE_INTERVAL_HOURS: int = 24
    JWT_SECRET_KEY: str = "skillsync_secret_key_for_development_purposes_only"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parent.parent / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


# Singleton instance — import `settings` wherever needed.
settings = Settings()
