import requests
import pandas as pd
from bs4 import BeautifulSoup
import streamlit as st
from datetime import datetime, timedelta
import os
import time
import re

# ==========================================
# 1. CLASSIFICATION LOGIC
# ==========================================

def classify_job_category(job_title):
    """
    Classify job into categories based on title keywords
    """
    title_lower = job_title.lower()
    
    # Define category keywords
    categories = {
        "Software Development": ["software", "developer", "programmer", "sde", "coding"],
        "Data Science": ["data scientist", "data analyst", "machine learning", "ml engineer", "ai engineer", "data engineer", "analytics"],
        "Web Development": ["web developer", "web designer", "react", "angular", "vue", "node", "django", "flask", "full stack", "fullstack", "frontend", "backend"],
        "Mobile Development": ["android", "ios", "mobile", "flutter", "react native"],
        "DevOps": ["devops", "cloud", "aws", "azure", "kubernetes", "docker", "infrastructure"],
        "Cybersecurity": ["security", "cyber", "infosec", "ethical hacker"],
        "UI/UX Design": ["ui/ux", "ui designer", "ux designer", "product designer"],
        "Quality Assurance": ["qa", "testing", "test", "automation"],
        "Database": ["database", "sql", "mongodb", "dba"],
        "Project Management": ["project manager", "product manager", "scrum"],
        "Business Analyst": ["business analyst", "ba", "system analyst"],
        "Digital Marketing": ["digital marketing", "seo", "sem", "social media"]
    }
    
    for category, keywords in categories.items():
        if any(keyword in title_lower for keyword in keywords):
            return category
    
    return "Other"

# ==========================================
# 2. FRESHERSWORLD SCRAPER
# ==========================================

def scrape_freshersworld_jobs(num_pages=1, delay=1):
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
            # Calculate offset for pagination
            if page == 1:
                url = base_url
            else:
                offset = (page - 1) * 20
                url = f"{base_url}?&limit=20&offset={offset}"
            
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code != 200:
                print(f"FW Page {page}: Status {response.status_code}")
                continue
            
            soup = BeautifulSoup(response.text, 'html.parser')
            job_cards = soup.find_all('div', class_='job-container')
            
            if not job_cards:
                # Fallback selector
                job_cards = soup.find_all('div', {'job_id': True})
            
            if not job_cards:
                break
                
            for card in job_cards:
                try:
                    job_data = {}
                    
                    # --- Platform Identifier ---
                    job_data['Platform'] = 'FreshersWorld'
                    
                    # Title
                    title_elem = card.find('span', class_='wrap-title') or card.find('span', class_='seo_title')
                    job_data['Job Title'] = title_elem.text.strip() if title_elem else ""
                    
                    # Company
                    company_elem = card.find('h3', class_='latest-jobs-title')
                    job_data['Company'] = company_elem.text.strip() if company_elem else ""
                    
                    # Location
                    location_elem = card.find('span', class_='job-location')
                    if location_elem:
                        loc_link = location_elem.find('a')
                        job_data['Location'] = loc_link.text.strip() if loc_link else location_elem.text.strip()
                    else:
                        job_data['Location'] = "Not specified"
                    
                    # Experience
                    exp_elem = card.find('span', class_='experience')
                    job_data['Experience'] = exp_elem.text.strip() if exp_elem else "Not specified"
                    
                    # Salary
                    salary_elem = None
                    for span in card.find_all('span', class_='qualifications'):
                        if 'Monthly' in span.text or 'Yearly' in span.text or '-' in span.text:
                            salary_elem = span
                            break
                    job_data['Salary'] = salary_elem.text.strip() if salary_elem else "Not disclosed"
                    
                    # Link
                    link_elem = card.find('a', href=True)
                    if link_elem and 'freshersworld.com/jobs/' in link_elem.get('href', ''):
                        job_data['Job Link'] = link_elem.get('href', '')
                    else:
                        job_data['Job Link'] = card.get('job_display_url', '')
                    
                    # Category
                    job_data['Category'] = classify_job_category(job_data['Job Title'])
                    
                    if job_data['Job Title']:
                        all_jobs.append(job_data)
                        
                except Exception:
                    continue
            
            # Delay to be polite
            if page < num_pages:
                time.sleep(delay)
                
        except Exception as e:
            print(f"Error on FW page {page}: {e}")
            continue
            
    return pd.DataFrame(all_jobs)

# ==========================================
# 3. INTERNSHALA SCRAPER
# ==========================================

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
                    "Platform": "Internshala",  # --- Platform Identifier ---
                    "Job Title": job_title,
                    "Job Link": f"https://internshala.com{title['href']}" if title and title.has_attr('href') else "",
                    "Company": company.text.strip() if company else "",
                    "Location": location.text.strip() if location else "",
                    "Category": classify_job_category(job_title),
                    "Salary": salary.text.strip() if salary else "Not disclosed",
                    "Experience": experience_element[-1].text.strip() if experience_element else "Fresher"
                })
                
        except Exception as e:
            print(f"Error Internshala page {i}: {e}")
            continue
    
    return pd.DataFrame(all_jobs)

# ==========================================
# 4. DATA MANAGEMENT
# ==========================================

def should_refresh_data(csv_path, hours=24):
    if not os.path.exists(csv_path):
        return True
    file_time = datetime.fromtimestamp(os.path.getmtime(csv_path))
    return (datetime.now() - file_time) > timedelta(hours=hours)

def load_or_scrape_jobs(csv_path="data/cleaned_job_data.csv", force_refresh=False, num_pages_internshala=5, num_pages_fw=3):
    """
    Orchestrates scraping from BOTH platforms and merging them.
    """
    needs_refresh = force_refresh or should_refresh_data(csv_path)
    
    if needs_refresh:
        status_text = st.empty()
        status_text.info("🔄 Scraping data from Internshala and FreshersWorld...")
        
        # 1. Scrape Internshala
        df_internshala = scrape_internshala_jobs(num_pages=num_pages_internshala)
        
        # 2. Scrape FreshersWorld
        df_freshers = scrape_freshersworld_jobs(num_pages=num_pages_fw)
        
        # 3. Combine DataFrames
        frames = []
        if not df_internshala.empty:
            frames.append(df_internshala)
        if not df_freshers.empty:
            frames.append(df_freshers)
            
        if frames:
            # Merge and ignore index to create a clean continuous index
            df_combined = pd.concat(frames, ignore_index=True)
            
            # Create directory and save
            os.makedirs(os.path.dirname(csv_path), exist_ok=True)
            df_combined.to_csv(csv_path, index=False)
            
            status_text.success(f"✅ Data Updated! Total Jobs: {len(df_combined)} (Internshala: {len(df_internshala)}, FreshersWorld: {len(df_freshers)})")
            return df_combined
        else:
            status_text.error("❌ Failed to scrape jobs from both sources.")
            if os.path.exists(csv_path):
                return pd.read_csv(csv_path)
            return pd.DataFrame()
            
    else:
        # Load existing
        if os.path.exists(csv_path):
            df = pd.read_csv(csv_path)
            
            # Simple check to see if we need to recategorize on load
            if 'Category' not in df.columns:
                df['Category'] = df['Job Title'].apply(classify_job_category)
                
            return df
        else:
            return load_or_scrape_jobs(csv_path, force_refresh=True)