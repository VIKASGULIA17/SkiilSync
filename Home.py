import streamlit as st
import pandas as pd
import os
import re
import time
import string
import unicodedata
from datetime import datetime, timedelta
import fitz  # PyMuPDF
from pathlib import Path

# --- Imports for REAL AI Feedback ---
from langchain_groq import ChatGroq
from dotenv import load_dotenv

# --- Imports for REAL Web Scraping ---
import requests 
from bs4 import BeautifulSoup

# ==============================================================================
# --- SECTION 1: WEB SCRAPING & DATA PROCESSING ---
# ==============================================================================

def classify_job_category(job_title):
    """
    Classify job into categories based on title keywords.
    """
    title_lower = job_title.lower()
    
    # Define category keywords
    categories = {
        "Data Analyst": ["data analyst", "analytics"],
        "Data Scientist": ["data scientist", "data science"],
        "Data Engineer": ["data engineer", "etl", "big data"],
        "Machine Learning Engineer": ["machine learning", "ml engineer"],
        "AI Engineer": ["ai engineer", "artificial intelligence"],
        "Web Developer": ["web developer"],
        "Full Stack Developer": ["full stack", "fullstack"],
        "Backend Developer": ["backend", "node.js", "django", "flask", "java", "spring"],
        "Frontend Developer": ["frontend", "react", "angular", "vue", "javascript", "html", "css"],
        "Android Developer": ["android", "mobile developer", "kotlin"],
        "iOS Developer": ["ios", "swift"],
        "Software Development": ["software", "developer", "programmer", "coding", "sde"],
        "DevOps": ["devops", "cloud", "aws", "azure", "kubernetes", "docker"],
        "Cybersecurity": ["security", "cyber", "penetration", "infosec"],
        "UI/UX Design": ["ui/ux", "ui designer", "ux designer", "product designer"],
        "Quality Assurance": ["qa", "testing", "test engineer", "automation"],
        "Database": ["database", "dba", "sql", "admin"],
        "Project Management": ["project manager", "scrum", "product manager"],
        "Business Analyst": ["business analyst", "ba", "system analyst"],
    }
    
    # Check each category
    for category, keywords in categories.items():
        if any(keyword in title_lower for keyword in keywords):
            return category
    
    # Default category
    return "Information Technology"

def scrape_freshersworld_jobs(num_pages=3):
    """
    Scrape jobs from FreshersWorld.com
    """
    all_jobs = []
    base_url = "https://www.freshersworld.com/jobs/category/it-software-job-vacancies"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://www.freshersworld.com/"
    }
    
    print("Starting FreshersWorld Scraper...")
    
    for page in range(1, num_pages + 1):
        try:
            # Pagination logic
            if page == 1:
                url = base_url
            else:
                offset = (page - 1) * 20
                url = f"{base_url}?&limit=20&offset={offset}"
            
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code != 200:
                continue
            
            soup = BeautifulSoup(response.text, 'html.parser')
            job_cards = soup.find_all('div', class_='job-container')
            
            if not job_cards:
                job_cards = soup.find_all('div', {'job_id': True}) # Fallback
            
            if not job_cards:
                break
                
            for card in job_cards:
                try:
                    title_elem = card.find('span', class_='wrap-title') or card.find('span', class_='seo_title')
                    job_title = title_elem.text.strip() if title_elem else ""
                    
                    company_elem = card.find('h3', class_='latest-jobs-title')
                    company = company_elem.text.strip() if company_elem else ""
                    
                    location_elem = card.find('span', class_='job-location')
                    location = location_elem.text.strip() if location_elem else "Not specified"
                    
                    # Extract Salary
                    salary = "Not disclosed"
                    for span in card.find_all('span', class_='qualifications'):
                        text = span.text.strip()
                        if 'Monthly' in text or 'Yearly' in text or '-' in text:
                            salary = text
                            break
                    
                    # Extract Experience
                    exp_elem = card.find('span', class_='experience')
                    experience = exp_elem.text.strip() if exp_elem else "Fresher"

                    # Extract Link
                    link_elem = card.find('a', href=True)
                    if link_elem and 'freshersworld.com/jobs/' in link_elem.get('href', ''):
                        job_link = link_elem.get('href', '')
                    else:
                        job_link = card.get('job_display_url', '')

                    if job_title:
                        all_jobs.append({
                            "Platform": "FreshersWorld",  # <--- ADDED COLUMN
                            "Job Title": job_title,
                            "Company": company,
                            "Location": location,
                            "Category": classify_job_category(job_title),
                            "Salary": salary,
                            "Experience": experience,
                            "Job link": job_link
                        })
                except Exception:
                    continue
            
            # Respectful delay
            time.sleep(1)
                
        except Exception as e:
            print(f"Error FW Page {page}: {e}")
            continue
        print(f"page {page} is scraped")    
    return pd.DataFrame(all_jobs)

def scrape_internshala_jobs(num_pages=5):
    """
    Scrape jobs from Internshala
    """
    all_jobs = []
    print("Starting Internshala Scraper...")
    
    for i in range(1, num_pages + 1):
        try:
            url = f"https://internshala.com/jobs/information-technology-jobs/page-{i}"
            response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
            
            if response.status_code != 200:
                continue
                
            soup = BeautifulSoup(response.text, 'html.parser')
            cards = soup.find_all('div', class_='individual_internship')
            
            if not cards:
                break
            
            for card in cards:
                title = card.find('a', class_='job-title-href')
                company = card.find('p', class_='company-name')
                location = card.find('div', class_='locations')
                salary = card.find('span', class_="mobile")
                experience_element = card.select('.row-1-item span')
                
                job_title = title.text.strip() if title else ""
                
                all_jobs.append({
                    "Platform": "Internshala", # <--- ADDED COLUMN
                    "Job Title": job_title,
                    "Job link": f"https://internshala.com{title['href']}" if title and title.has_attr('href') else "",
                    "Company": company.text.strip() if company else "",
                    "Location": location.text.strip() if location else "",
                    "Category": classify_job_category(job_title),
                    "Salary": salary.text.strip() if salary else "Not disclosed",
                    "Experience": experience_element[-1].text.strip() if experience_element else "Fresher"
                })
                
        except Exception as e:
            print(f"Error Internshala page {i}: {e}")
            continue
        print(f"page {i} is scraped")
    return pd.DataFrame(all_jobs)

def should_refresh_data(csv_path, hours=24):
    if not os.path.exists(csv_path):
        return True
    file_time = datetime.fromtimestamp(os.path.getmtime(csv_path))
    return (datetime.now() - file_time) > timedelta(hours=hours)

def load_or_scrape_jobs(csv_path="data/cleaned_job_data.csv", force_refresh=False):
    """
    Orchestrates scraping from BOTH platforms and merging them.
    """
    needs_refresh = force_refresh or should_refresh_data(csv_path)
    
    if needs_refresh:
        status_box = st.empty()
        status_box.info("🔄 Scraping new jobs from Internshala & FreshersWorld...")
        
        # 1. Scrape Internshala
        df_internshala = scrape_internshala_jobs(num_pages=10)
        
        # 2. Scrape FreshersWorld
        df_freshers = scrape_freshersworld_jobs(num_pages=16)
        
        # 3. Combine
        frames = []
        if not df_internshala.empty: frames.append(df_internshala)
        if not df_freshers.empty: frames.append(df_freshers)
        
        if frames:
            df = pd.concat(frames, ignore_index=True)
            
            # Clean up column names (ensure consistency)
            if 'Job Link' in df.columns and 'Job link' in df.columns:
                df['Job link'] = df['Job link'].fillna(df['Job Link'])
                df = df.drop(columns=['Job Link'])
            
            os.makedirs(os.path.dirname(csv_path), exist_ok=True)
            df.to_csv(csv_path, index=False)
            status_box.success(f"✅ Updated! Found {len(df)} jobs.")
            return df
        else:
            status_box.error("❌ Scraping failed. Trying to load old data.")
            if os.path.exists(csv_path):
                return pd.read_csv(csv_path)
            return pd.DataFrame()
    else:
        if os.path.exists(csv_path):
            return pd.read_csv(csv_path)
        else:
            return load_or_scrape_jobs(csv_path, force_refresh=True)

# ==============================================================================
# --- SECTION 2: RESUME ANALYSIS FUNCTIONS ---
# ==============================================================================

def extract_text_from_pdf(file_obj):
    text = ""
    try:
        with fitz.open(stream=file_obj.read(), filetype="pdf") as doc:
            for page in doc:
                text += page.get_text()
    except Exception as e:
        st.error(f"Error reading PDF: {e}")
        return ""
    return text

def preprocess_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = unicodedata.normalize("NFKD", text)
    text = text.translate(str.maketrans("", "", string.punctuation))
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def extract_skills(text, keywords):
    text_processed = preprocess_text(text)
    matched = set()
    for word in keywords:
        clean_word = preprocess_text(word)
        if clean_word and re.search(r'\b' + re.escape(clean_word) + r'\b', text_processed):
            matched.add(word)
    return list(matched)

def load_skill_database(csv_path, role):
    try:
        df = pd.read_csv(csv_path)
        df['Role'] = df['Role'].str.lower()
        role = role.lower()

        filtered_df = df[df['Role'] == role]
        if filtered_df.empty:
            return set()

        keywords_series = pd.concat([
            filtered_df["ATS Keywords"].str.split(","),
            filtered_df["Skills"].str.split(",")
        ]).explode().str.strip().dropna()
        
        return set(keywords_series)
    except Exception:
        return set()

def evaluate_resume(extracted_skills, expected_keywords, role):
    extracted_set = set(extracted_skills)
    expected_set = set(expected_keywords)
    matched = extracted_set & expected_set
    suggestions = expected_set - extracted_set
    match_score = 0.0
    if expected_set:
        match_score = round((len(matched) / len(expected_set)) * 10, 2)

    return {
        "Role": role,
        "Score": match_score,
        "Matched Keywords": list(matched),
        "Suggested Improvements": list(suggestions)
    }

def resume_feedback(resume_text, expected, role):
    try:
        load_dotenv(dotenv_path="data/keys.env")
        groq_api_key = os.getenv('GROQ_API_KEY')
        
        if not groq_api_key:
            return ["Error: API Key not configured in data/keys.env"]

        llm = ChatGroq(
            model="meta-llama/llama-4-scout-17b-16e-instruct", 
            temperature=0.2,
            max_retries=2,
            api_key=groq_api_key
        )
        prompt = (
            f"You are a helpful career coach. Analyze the following resume content and suggest improvements.\n"
            f"**Resume Content:**\n{resume_text[:3000]}\n\n" # Limit text length
            f"**Target Role:** {role}\n"
            f"**Missing Skills:** {', '.join(expected)}\n\n"
            f"Provide constructive feedback. Suggest skills to acquire and resources. "
            f"Format the output clearly with Markdown bullet points."
        )
        
        response = llm.invoke(prompt)
        feedback_text = response.content if hasattr(response, 'content') else str(response)
        return feedback_text.strip().split('\n')
        
    except Exception as e:
        return [f"AI Feedback unavailable: {e}"]

def find_best_role(resume_text, skill_db_path="data/skills_data.csv"):
    try:
        df_skills = pd.read_csv(skill_db_path)
    except Exception:
        return None
        
    all_roles = df_skills['Role'].unique()
    best_score = -1
    best_role_report = None
    
    progress_text = st.empty()
    my_bar = st.progress(0)
    
    for i, role in enumerate(all_roles):
        role_skills = load_skill_database(skill_db_path, role)
        if not role_skills: continue
            
        resume_skills = extract_skills(resume_text, role_skills)
        report = evaluate_resume(resume_skills, role_skills, role)
        
        if report['Score'] > best_score:
            best_score = report['Score']
            best_role_report = report
        
        my_bar.progress((i + 1) / len(all_roles))
        progress_text.text(f"Analyzing suitability for: {role}")
    
    my_bar.empty()
    progress_text.empty()
    return best_role_report

# ==============================================================================
# --- SECTION 3: STREAMLIT APP ---
# ==============================================================================

st.set_page_config(page_title="RoleFit & Job Finder", layout="wide")

st.markdown("""
    <style>
    .analyzer-header {
        text-align: center; padding: 30px 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 15px; margin-bottom: 30px; color: white;
    }
    .job-card {
        border: 1px solid #e0e0e0; border-radius: 10px; padding: 15px; margin: 10px 0;
        background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        transition: transform 0.2s;
    }
    .job-card:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
    .platform-badge {
        padding: 2px 8px; border-radius: 12px; font-size: 0.75em; font-weight: bold; color: white;
    }
    .internshala { background-color: #00A5EC; }
    .freshersworld { background-color: #F15B2A; }
    </style>
""", unsafe_allow_html=True)

# Header
st.markdown("""
    <div class='analyzer-header'>
        <h1 style='margin:0;'>📄 RoleFit Analyzer & Job Finder 🚀</h1>
        <p style='margin:5px 0 0 0;'>Upload your resume to find your best role and see matching jobs!</p>
    </div>
""", unsafe_allow_html=True)

# --- Load Data ---
SKILL_DB_PATH = "data/skills_data.csv"
JOB_DB_PATH = "data/cleaned_job_data.csv"

# Load jobs (Scrape if needed)
df_jobs = load_or_scrape_jobs(csv_path=JOB_DB_PATH)

# Sidebar controls
with st.sidebar:
    st.header("⚙️ Controls")
    if st.button("🔄 Force Refresh Jobs"):
        df_jobs = load_or_scrape_jobs(csv_path=JOB_DB_PATH, force_refresh=True)
        st.rerun()
    
    st.divider()
    if not df_jobs.empty:
        st.info(f"Database contains {len(df_jobs)} active listings.")
        if 'Platform' in df_jobs.columns:
            st.write("Sources:", df_jobs['Platform'].unique())

# --- Step 1: Resume Upload ---
st.markdown("### 1. Upload Your Resume")
uploaded_file = st.file_uploader("Choose your resume (PDF)", type=["pdf"])

# --- Step 2: Analysis & Job Matching ---
if uploaded_file:
    uploaded_file.seek(0)
    resume_text = extract_text_from_pdf(uploaded_file)
    
    if resume_text:
        best_role_report = find_best_role(resume_text, SKILL_DB_PATH)
        
        if best_role_report and best_role_report['Score'] > 0:
            selected_role = best_role_report['Role']
            report = best_role_report
            
            st.success(f"✅ Best Match: **{selected_role}** (Match Score: {report['Score']*10:.0f}%)")
            
            # Display Matched Skills
            st.markdown("#### 🎯 Matched Skills")
            st.write(", ".join(report['Matched Keywords']) if report['Matched Keywords'] else "No specific keywords matched.")
            
            # AI Feedback
            st.markdown("#### 💡 AI Improvement Plan")
            with st.spinner("Generating feedback..."):
                uploaded_file.seek(0)
                feedback = resume_feedback(extract_text_from_pdf(uploaded_file), report['Suggested Improvements'], selected_role)
                for line in feedback:
                    st.markdown(line)

            # --- JOB LISTINGS ---
            st.markdown("---")
            st.header(f"🚀 Recommended Jobs for {selected_role}")
            
            if not df_jobs.empty:
                # Filter logic
                filtered_df = df_jobs[df_jobs['Category'].str.lower() == selected_role.lower()]
                
                if filtered_df.empty:
                    st.warning(f"No exact matches found for '{selected_role}'. Showing all IT jobs:")
                    filtered_df = df_jobs.head(10)
                
                # Display Jobs
                for index, row in filtered_df.iterrows():
                    # Determine Platform Badge Color
                    platform = row.get('Platform', 'Unknown')
                    badge_class = 'internshala' if platform == 'Internshala' else 'freshersworld'
                    
                    st.markdown(
                        f"""
                        <div class='job-card'>
                            <div style='display:flex; justify-content:space-between; align-items:start;'>
                                <h4 style='margin:0; color:#333;'>{row['Job Title']}</h4>
                                <span class='platform-badge {badge_class}'>{platform}</span>
                            </div>
                            <p style='margin: 5px 0; color: #666;'><strong>🏢 {row['Company']}</strong> | 📍 {row['Location']}</p>
                            <div style='display:flex; gap:15px; font-size:0.9em; color:#555;'>
                                <span>💰 {row['Salary']}</span>
                                <span>📅 {row['Experience']}</span>
                            </div>
                            <div style='margin-top:10px;'>
                                <a href="{row['Job link']}" target="_blank" style='text-decoration:none; background:#667eea; color:white; padding:5px 15px; border-radius:5px; font-size:0.9em;'>Apply Now 🔗</a>
                            </div>
                        </div>
                        """,
                        unsafe_allow_html=True
                    )
            else:
                st.error("No job data available.")
        else:
            st.warning("Could not determine a suitable role based on the resume.")