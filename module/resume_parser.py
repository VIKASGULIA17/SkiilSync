import fitz  # PyMuPDF
from pathlib import Path
import re
import unicodedata
import string

def extract_text_from_pdf(file_obj):
    text = ""
    with fitz.open(stream=file_obj.read(), filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text

def preprocess_text(text):
    text = text.lower()
    text = unicodedata.normalize("NFKD", text) 
    text = text.translate(str.maketrans("", "", string.punctuation))
    text = re.sub(r"\s+", " ", text) 
    return text.strip()

def extract_skills(text, keywords):
    text = preprocess_text(text)
    matched = set()
    for word in keywords:
        clean_word = preprocess_text(word)
        if clean_word in text:
            matched.add(word)
    return list(matched)

#  Main pipeline

def main(resume_path, skill_db_path, role):
    print("🔍 Parsing resume...")
    resume_text = extract_text_from_pdf(resume_path)

    print("📚 Loading skill database...")
    expected_keywords = load_skill_database(skill_db_path, role)
    print(f"✅ Loaded {len(expected_keywords)} keywords for role '{role}'\n")

    print("🧠 Extracting skills...")
    extracted = extract_skills(resume_text, expected_keywords)
    print(f"✅ Extracted {extracted} potential skills\n")

    print("📊 Evaluating resume...\n")
    report = evaluate_resume(extracted, expected_keywords, role)

    if report:
        print(f"📌 Role: {report['Role']}")
        print(f"⭐ Score: {report['Score']} / 10")
        print(f"✅ Matched Keywords: {', '.join(report['Matched Keywords']) or 'None'}")
        if report['Suggested Improvements']:
            print("💡 Suggestions:")
            gpt_suggestions = resume_feedback(resume_text,report['Suggested Improvements'],role)
            for suggestion in gpt_suggestions:
                print(suggestion)
            
        else:
            print("💯 No major skill gaps found. Your resume is strongly aligned!")
        print("\n" + "-" * 60 + "\n")

if __name__ == "__main__":
    from load_dataset import load_skill_database
    from gap_analyzer import evaluate_resume
    from gpt_feedback import  resume_feedback

    resume_path = Path("module") / "Resume.pdf"
    skill_db_path = Path("data/skills_data.csv")
    role = "Data Analyst"
    main(resume_path, skill_db_path, role)