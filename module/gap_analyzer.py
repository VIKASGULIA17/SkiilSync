def evaluate_resume(extracted_skills, expected_keywords, role):
    extracted_set = set(extracted_skills)
    matched = extracted_set & expected_keywords
    suggestions = expected_keywords - extracted_set
    match_score = round((len(matched) / len(expected_keywords)) * 10, 2) if expected_keywords else 0

    return {
        "Role": role,
        "Score": match_score,
        "Matched Keywords": list(matched),
        "Suggested Improvements": list(suggestions)
    }
