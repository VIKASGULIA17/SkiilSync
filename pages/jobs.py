import streamlit as st
import pandas as pd
import os
from web_scraping.web_scraping_jobs import load_or_scrape_jobs

st.set_page_config(page_title="Job Opportunities Portal", layout="wide")

st.markdown(
    """
    <div style='text-align: center; padding: 10px; margin-bottom : 30px; background: linear-gradient(135deg, #f4eaff, #e9dfff); border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);'>
        <h1 style='font-family: "Segoe UI", sans-serif; color: #2c3e50;'>
            🌟 Find Job Opportunities
        </h1>
        <p style='font-size: 16px; color: #34495e;'>
            Explore roles in top tech companies!
        </p>
    </div>
    """,
    unsafe_allow_html=True
)

# Add refresh button and data info
col1, col2, col3 = st.columns([2, 1, 1])

with col2:
    if st.button("🔄 Refresh Jobs", help="Scrape latest jobs from Internshala"):
        df = load_or_scrape_jobs(force_refresh=True, num_pages=21)
        st.rerun()

with col3:
    csv_path = "data/cleaned_job_data.csv"
    if os.path.exists(csv_path):
        from datetime import datetime
        file_time = datetime.fromtimestamp(os.path.getmtime(csv_path))
        st.caption(f"📅 Last updated: {file_time.strftime('%Y-%m-%d %H:%M')}")

# Load jobs (auto-scrape if missing/old)
df = load_or_scrape_jobs(csv_path="data/cleaned_job_data.csv")

if df.empty:
    st.error("❌ Unable to load job data. Please try refreshing.")
    st.stop()

# Extract unique categories and experience levels
cat_choices = df['Category'].unique()
exp_choices = df['Experience'].unique() if 'Experience' in df.columns else []

# Create filters
selected_category = st.selectbox("Select Job Category", options=['--Select Category--'] + list(cat_choices))
selected_experience = st.selectbox("Select Job Experience", options=['--Select your Experience--'] + sorted(list(exp_choices)))

# Filter logic
if selected_category == '--Select Category--' and selected_experience == '--Select your Experience--':
    filtered_df = df[['Job Title', 'Company', 'Salary', 'Experience', 'Job link']]
    st.subheader(f"📄 All Job Listings ({len(filtered_df)} jobs)")

elif selected_category != '--Select Category--' and selected_experience != '--Select your Experience--':
    filtered_df = df[(df['Category'] == selected_category) & (df['Experience'] == selected_experience)][['Job Title', 'Company', 'Salary', 'Experience', 'Job link']]
    st.subheader(f"📄 Job Listings for {selected_category} - {selected_experience} ({len(filtered_df)} jobs)")

elif selected_category != '--Select Category--':
    filtered_df = df[df['Category'] == selected_category][['Job Title', 'Company', 'Salary', 'Experience', 'Job link']]
    st.subheader(f"📄 Job Listings for {selected_category} ({len(filtered_df)} jobs)")

elif selected_experience != '--Select your Experience--':
    filtered_df = df[df['Experience'] == selected_experience][['Job Title', 'Company', 'Salary', 'Experience', 'Job link']]
    st.subheader(f"📄 Job Listings for {selected_experience} level ({len(filtered_df)} jobs)")

# Footer stats
st.markdown("---")
col1, col2, col3 = st.columns(3)

with col1:
    st.metric("Total Jobs", len(df))
with col2:
    st.metric("Categories", len(df['Category'].unique()))
with col3:
    st.metric("Companies", len(df['Company'].unique()))

# Display results
if filtered_df.empty:
    st.markdown(
        "<div style='text-align:center;margin-top:30px;color:grey;text-shadow: 0 0.5px 1.2px grey'>"
        "<h4>No jobs found for the selected filters. Try different criteria or refresh the data.</h4></div>",
        unsafe_allow_html=True
    )

else:
    for index, row in filtered_df.iterrows():
        with st.container():
            st.markdown(
                f"""
                <div style='border: 1px solid #e0e0e0; border-radius: 10px; padding: 15px; margin: 10px 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); box-shadow: 0 1px 5px rgba(200, 150, 255, 0.3);'>
                    <h4 style='margin-bottom: 5px; color: #2c3e50;'>{row['Job Title']}</h4>
                    <p style='margin: 2px 0;'><strong>🏢 Company:</strong> {row['Company']}</p>
                    <p style='margin: 2px 0;'><strong>💰 Salary:</strong> {row['Salary']}</p>
                    <p style='margin: 2px 0;'><strong>📊 Experience:</strong> {row['Experience']}</p>
                    <a href="{row['Job link']}" target="_blank" style='color: #90EE90; text-decoration: none; font-weight: bold;'>🔗 Apply Now</a>
                </div>
                """,
                unsafe_allow_html=True
            )
