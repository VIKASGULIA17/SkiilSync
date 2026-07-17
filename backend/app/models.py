"""
SQLAlchemy ORM models and Pydantic request / response schemas for SkillSync.
"""

import math
from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field ,AnyUrl
from sqlalchemy import Column, DateTime, Integer, String, Text
from sqlalchemy.sql import func

from app.database import Base


# ============================================================================
# SQLAlchemy ORM models
# ============================================================================

class Job(Base):  # type: ignore[misc]
    """Represents a scraped job listing."""

    __tablename__ = "jobs"

    id: int = Column(Integer, primary_key=True, index=True, autoincrement=True)
    platform: str = Column(String(50), nullable=False)
    title: str = Column(String(255), nullable=False)
    company: str = Column(String(255), nullable=False, default="")
    location: str = Column(String(255), nullable=False, default="Not specified")
    category: str = Column(String(100), nullable=False, default="Information Technology")
    salary: str = Column(String(255), nullable=False, default="Not disclosed")
    experience: str = Column(String(100), nullable=False, default="Fresher")
    link: str = Column(Text, nullable=False, default="")
    scraped_at: datetime = Column(DateTime, server_default=func.now(), nullable=False)


class ScrapeStatus(Base):  # type: ignore[misc]
    """Tracks the status of each scraping run."""

    __tablename__ = "scrape_status"

    id: int = Column(Integer, primary_key=True, index=True, autoincrement=True)
    started_at: datetime = Column(DateTime, nullable=False, default=datetime.utcnow)
    completed_at: Optional[datetime] = Column(DateTime, nullable=True)
    job_count: int = Column(Integer, nullable=False, default=0)
    status: str = Column(String(20), nullable=False, default="running")  # running | completed | failed
    error_message: Optional[str] = Column(Text, nullable=True)


# ============================================================================
# Pydantic schemas – Responses
# ============================================================================

class JobResponse(BaseModel):
    """Schema for a single job returned by the API."""

    id: int
    platform: str
    title: str
    company: str
    location: str
    category: str
    salary: str
    experience: str
    link: AnyUrl
    scraped_at: datetime

    model_config = ConfigDict(from_attributes=True)


class JobListResponse(BaseModel):
    """Paginated list of jobs."""

    jobs: List[JobResponse]
    total: int
    page: int
    per_page: int
    total_pages: int


class RoleScore(BaseModel):
    """Score for a single role during resume analysis."""

    role: str
    score: float


class AnalysisResponse(BaseModel):
    """Result of resume analysis (auto-detect or specific role)."""

    best_role: str
    score: float
    matched_skills: List[str]
    missing_skills: List[str]
    all_roles_scores: List[RoleScore]
    resume_text: str = Field(
        default="",
        description="Truncated resume text for downstream feedback calls",
    )


# ============================================================================
# Pydantic schemas – Requests
# ============================================================================

class FeedbackRequest(BaseModel):
    """Payload for requesting AI-generated feedback on a resume."""

    resume_text: str
    role: str
    missing_skills: List[str] = Field(default_factory=list)


class FeedbackResponse(BaseModel):
    """AI-generated feedback in Markdown."""

    feedback: str


class RoleAnalysisRequest(BaseModel):
    """Request to analyse a resume against a specific role."""

    resume_text: str
    role: str


class ApiKeyRequest(BaseModel):
    """Payload for setting / validating the Groq API key."""

    api_key: str


class ApiKeyStatusResponse(BaseModel):
    """Indicates whether an API key is configured."""

    configured: bool


class ScrapeStatusResponse(BaseModel):
    """Latest scrape status summary."""

    last_updated: Optional[datetime] = None
    job_count: int = 0
    status: str = "unknown"
    is_running: bool = False

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# User Authentication Models & Schemas
# ============================================================================

class User(Base):  # type: ignore[misc]
    """Represents a registered user in the system."""

    __tablename__ = "users"

    id: int = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email: str = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password: str = Column(String(255), nullable=False)
    full_name: str = Column(String(255), nullable=False, default="")
    created_at: datetime = Column(DateTime, server_default=func.now(), nullable=False)
    role: str = Column(String(20), nullable=False, default="user")


class UserCreate(BaseModel):
    """Schema for creating a new user account."""

    email: str
    password: str
    full_name: str
    role:str


class UserLogin(BaseModel):
    """Schema for user credentials at login."""

    email: str
    password: str


class UserResponse(BaseModel):
    """User profile response."""

    id: int
    email: str
    full_name: str
    created_at: datetime
    role:str

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    """Response containing JWT access token and user info."""

    access_token: str
    token_type: str = "bearer"
    user: UserResponse
