import requests 
import pandas as pd
from bs4 import BeautifulSoup
import streamlit as st
from datetime import datetime, timedelta
import os

def classify_job_category(job_title):
    """
    Classify job into categories based on title keywords
    
    Args:
        job_title: The job title string
    
    Returns:
        Category string
    """
    title_lower = job_title.lower()
    
    # Define category keywords
    categories = {
        "Software Development": ["software", "developer", "programming", "coding", "backend", "frontend", "full stack", "fullstack"],
        "Data Science": ["data scientist", "data analyst", "machine learning", "ml engineer", "ai engineer", "data engineer"],
        "Web Development": ["web developer", "web designer", "react", "angular", "vue", "node.js", "django", "flask"],
        "Mobile Development": ["android", "ios", "mobile developer", "app developer", "flutter", "react native"],
        "DevOps": ["devops", "cloud engineer", "aws", "azure", "kubernetes", "docker", "infrastructure"],
        "Cybersecurity": ["security", "cybersecurity", "penetration", "ethical hacker", "security analyst"],
        "UI/UX Design": ["ui/ux", "ui designer", "ux designer", "product designer", "graphic designer"],
        "Quality Assurance": ["qa", "testing", "test engineer", "automation testing", "quality assurance"],
        "Database": ["database", "dba", "sql", "mongodb", "postgresql", "database administrator"],
        "Project Management": ["project manager", "scrum master", "product manager", "agile"],
        "Business Analyst": ["business analyst", "ba", "functional analyst", "system analyst"],
        "Digital Marketing": ["digital marketing", "seo", "sem", "social media", "marketing analyst"]
    }
    
    # Check each category
    for category, keywords in categories.items():
        for keyword in keywords:
            if keyword in title_lower:
                return category
    
    # Default category
    return "Information Technology"

def scrape_internshala_jobs(num_pages=1):
    """
    Scrape jobs from Internshala
    
    Args:
        num_pages: Number of pages to scrape (default: 1)
    
    Returns:
        DataFrame with scraped job data
    """
    all_jobs = []
    
    for i in range(1, num_pages + 1):
        try:
            url = f"https://internshala.com/jobs/information-technology-jobs/page-{i}"
            response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
            
            if response.status_code != 200:
                st.warning(f"Page {i}: Unable to fetch data (Status: {response.status_code})")
                continue
                
            soup = BeautifulSoup(response.text, 'html.parser')
            cards = soup.find_all('div', class_='individual_internship')
            
            if not cards:
                st.warning(f"No job cards found on page {i}")
                break
            
            for card in cards:
                title = card.find('a', class_='job-title-href')
                company = card.find('p', class_='company-name')
                location = card.find('div', class_='locations')
                salary = card.find('span', class_="mobile")
                experience_element = card.select('.row-1-item span')
                
                job_title = title.text.strip() if title else ""
                
                all_jobs.append({
                    "Job Title": job_title,
                    "Job link": f"https://internshala.com{title['href']}" if title and title.has_attr('href') else "",
                    "Company": company.text.strip() if company else "",
                    "Location": location.text.strip() if location else "",
                    "Category": classify_job_category(job_title),
                    "Salary": salary.text.strip() if salary else "Not disclosed",
                    "Experience": experience_element[-1].text.strip() if experience_element else "Fresher"
                })
                
        except requests.exceptions.RequestException as e:
            st.error(f"Error fetching page {i}: {str(e)}")
            break
        except Exception as e:
            st.error(f"Error parsing page {i}: {str(e)}")
            continue
    
    if all_jobs:
        df = pd.DataFrame(all_jobs)
        return df
    else:
        return pd.DataFrame()

def should_refresh_data(csv_path, hours=24):
    """
    Check if data should be refreshed based on file age
    
    Args:
        csv_path: Path to the CSV file
        hours: Number of hours before refresh (default: 24)
    
    Returns:
        Boolean indicating if refresh is needed
    """
    if not os.path.exists(csv_path):
        return True
    
    file_time = datetime.fromtimestamp(os.path.getmtime(csv_path))
    current_time = datetime.now()
    
    return (current_time - file_time) > timedelta(hours=hours)

def recategorize_existing_data(df):
    """
    Re-categorize existing job data based on job titles
    
    Args:
        df: DataFrame with job data
    
    Returns:
        DataFrame with updated categories
    """
    if 'Job Title' in df.columns:
        df['Category'] = df['Job Title'].apply(classify_job_category)
    return df

def load_or_scrape_jobs(csv_path="data/cleaned_job_data.csv", force_refresh=False, num_pages=1):
    """
    Load jobs from CSV or scrape if needed
    
    Args:
        csv_path: Path to the CSV file
        force_refresh: Force scraping even if file exists
        num_pages: Number of pages to scrape
    
    Returns:
        DataFrame with job data
    """
    # Check if we need to refresh data
    needs_refresh = force_refresh or should_refresh_data(csv_path)
    
    if needs_refresh:
        with st.spinner("🔄 Fetching latest job listings from Internshala..."):
            df = scrape_internshala_jobs(num_pages)
            
            if not df.empty:
                # Create directory if it doesn't exist
                os.makedirs(os.path.dirname(csv_path), exist_ok=True)
                
                # Save to CSV
                df.to_csv(csv_path, index=False)
                st.success(f"✅ Successfully scraped {len(df)} jobs!")
                return df
            else:
                st.error("❌ Failed to scrape jobs. Loading from existing file if available.")
                
                # Try to load existing file
                if os.path.exists(csv_path):
                    df = pd.read_csv(csv_path)
                    # Re-categorize existing data
                    df = recategorize_existing_data(df)
                    return df
                else:
                    return pd.DataFrame()
    else:
        # Load from existing file
        if os.path.exists(csv_path):
            df = pd.read_csv(csv_path)
            
            # Check if all categories are the same (needs re-categorization)
            if 'Category' in df.columns and df['Category'].nunique() == 1:
                with st.spinner("🔄 Re-categorizing jobs..."):
                    df = recategorize_existing_data(df)
                    # Save updated categorization
                    df.to_csv(csv_path, index=False)
                    st.success("✅ Jobs re-categorized!")
            
            return df
        else:
            st.warning("No existing data found. Attempting to scrape...")
            return load_or_scrape_jobs(csv_path, force_refresh=True, num_pages=num_pages)