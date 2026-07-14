"""
Skills / roles routes.

GET /api/roles — list all available roles from the skills CSV.
"""

import logging
from typing import Dict, List

from fastapi import APIRouter, HTTPException

from app.services.skills_db import get_all_roles

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Skills"])


@router.get("/roles")
async def list_roles() -> Dict[str, List[str]]:
    """Return every unique role available in the skills database."""
    try:
        roles = get_all_roles()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    except Exception as exc:
        logger.exception("Failed to load roles")
        raise HTTPException(status_code=500, detail=f"Failed to load roles: {exc}")

    return {"roles": roles}
