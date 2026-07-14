"""
Gap analyser — compares extracted resume skills against expected role skills.
"""

from typing import Any, Dict, List, Set


def evaluate_resume(
    extracted_skills: List[str] | Set[str],
    expected_keywords: List[str] | Set[str],
    role: str,
) -> Dict[str, Any]:
    """
    Score a resume's skills against the expected keyword set for a role.

    Args:
        extracted_skills: Skills found in the resume.
        expected_keywords: Skills required / expected for the target role.
        role: The job-role name.

    Returns:
        A dict with keys: role, score (0-10 scale), matched_keywords,
        suggested_improvements.
    """
    extracted_set: set[str] = set(extracted_skills) if extracted_skills else set()
    expected_set: set[str] = set(expected_keywords) if expected_keywords else set()

    if not expected_set:
        return {
            "role": role,
            "score": 0.0,
            "matched_keywords": [],
            "suggested_improvements": [],
        }

    matched = extracted_set & expected_set
    suggestions = expected_set - extracted_set
    match_score = round((len(matched) / len(expected_set)) * 10, 2)

    return {
        "role": role,
        "score": match_score,
        "matched_keywords": sorted(matched),
        "suggested_improvements": sorted(suggestions),
    }
