"""
Skills database loader and best-role finder.

Reads the skills CSV and provides helpers to:
  - load keywords for a specific role
  - list all available roles
  - find the best-matching role for a given resume
"""

import logging
from typing import Any, Dict, List, Optional, Set

import pandas as pd

from app.config import settings
from app.services.gap_analyzer import evaluate_resume
from app.services.resume_parser import extract_skills

logger = logging.getLogger(__name__)


def _read_csv(csv_path: Optional[str] = None) -> pd.DataFrame:
    """
    Safely read the skills CSV.

    Raises:
        FileNotFoundError: If the CSV does not exist at the given path.
    """
    path = csv_path or settings.SKILLS_CSV_PATH
    try:
        return pd.read_csv(path)
    except FileNotFoundError:
        raise FileNotFoundError(
            f"Skills database not found at '{path}'. "
            "Make sure skills_data.csv is placed in the data/ directory."
        )
    except Exception as exc:
        raise RuntimeError(f"Failed to read skills database: {exc}") from exc


def load_skill_database(
    role: str,
    csv_path: Optional[str] = None,
) -> Set[str]:
    """
    Load the combined skill + ATS keyword set for a given role.

    Args:
        role: Role name (case-insensitive).
        csv_path: Optional override path to the CSV file.

    Returns:
        A set of keyword strings for the role, or an empty set if the role
        is not found.
    """
    try:
        df = _read_csv(csv_path)
        df["Role"] = df["Role"].str.lower()
        role_lower = role.lower()

        filtered_df = df[df["Role"] == role_lower]
        if filtered_df.empty:
            return set()

        keywords_series = (
            pd.concat([
                filtered_df["ATS Keywords"].str.split(","),
                filtered_df["Skills"].str.split(","),
            ])
            .explode()
            .str.strip()
            .dropna()
        )
        return set(keywords_series)
    except FileNotFoundError:
        raise
    except Exception as exc:
        logger.warning("Error loading skill database for role '%s': %s", role, exc)
        return set()


def get_all_roles(csv_path: Optional[str] = None) -> List[str]:
    """
    Return a sorted list of unique role names from the skills CSV.

    Args:
        csv_path: Optional override path to the CSV file.

    Returns:
        List of role name strings.
    """
    df = _read_csv(csv_path)
    roles = df["Role"].dropna().unique().tolist()
    return sorted(set(roles))


def find_best_role(
    resume_text: str,
    csv_path: Optional[str] = None,
) -> Optional[Dict[str, Any]]:
    """
    Iterate every role in the skills database, score the resume against each,
    and return the best-matching role plus a ranked list of all role scores.

    Args:
        resume_text: Raw text extracted from the resume.
        csv_path: Optional override path to the CSV file.

    Returns:
        A dict with keys:
          - ``best_role``: str — name of the top role
          - ``score``: float — score on a 0-10 scale
          - ``matched_keywords``: list[str]
          - ``suggested_improvements``: list[str]
          - ``all_roles_scores``: list[dict] — [{role, score}, …] sorted desc

        Returns ``None`` if no roles are found or the CSV is missing.
    """
    path = csv_path or settings.SKILLS_CSV_PATH

    try:
        df = _read_csv(path)
    except (FileNotFoundError, RuntimeError) as exc:
        logger.error("Cannot find best role: %s", exc)
        return None

    all_roles = df["Role"].dropna().unique()
    if len(all_roles) == 0:
        return None

    best_score: float = -1.0
    best_report: Optional[Dict[str, Any]] = None
    all_scores: List[Dict[str, Any]] = []

    for role in all_roles:
        role_skills = load_skill_database(role, path)
        if not role_skills:
            continue

        resume_skills = extract_skills(resume_text, role_skills)
        report = evaluate_resume(resume_skills, role_skills, role)

        all_scores.append({"role": role, "score": report["score"]})

        if report["score"] > best_score:
            best_score = report["score"]
            best_report = report

    if best_report is None:
        return None

    # Sort all scores descending
    all_scores.sort(key=lambda x: x["score"], reverse=True)

    return {
        "best_role": best_report["role"],
        "score": best_report["score"],
        "matched_keywords": best_report["matched_keywords"],
        "suggested_improvements": best_report["suggested_improvements"],
        "all_roles_scores": all_scores,
    }
