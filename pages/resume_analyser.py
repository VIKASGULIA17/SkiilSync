import streamlit as st
from module.resume_parser import extract_text_from_pdf, extract_skills
from module.gap_analyzer import evaluate_resume
from module.load_dataset import load_skill_database
from module.gpt_feedback import resume_feedback
# from module.pdf_generator import generate_pdf
import pandas as pd

st.set_page_config(page_title="SkillSync", layout="wide")

# Custom CSS styling
st.markdown("""
    <style>
    /* Main header styling */
    .analyzer-header {
        text-align: center;
        padding: 30px 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 15px;
        margin-bottom: 30px;
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }
    .analyzer-title {
        font-size: 2.8em;
        font-weight: bold;
        color: white;
        margin: 0;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }
    .analyzer-subtitle {
        font-size: 1.2em;
        color: #f0f0f0;
        margin-top: 10px;
    }
    
    /* Upload section styling */
    .upload-container {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        padding: 25px;
        border-radius: 12px;
        margin: 20px 0;
            
        color:black;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    /* Score card styling */
    .score-card {
        background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
        padding: 25px;
        border-radius: 15px;
        margin: 20px 0;
        box-shadow: 0 6px 15px rgba(0,0,0,0.15);
        text-align: center;
    }
    
    /* Matched skills styling */
    .skills-container {
        background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
        padding: 20px;
        border-radius: 12px;
        margin: 15px 0;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    
    /* Feedback section styling */
    .feedback-header {
        background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
        padding: 15px 25px;
        border-radius: 10px;
        margin: 20px 0 10px 0;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    
    /* Info box styling */
    .info-box {
        background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
        padding: 20px;
        border-radius: 10px;
        border-left: 5px solid #667eea;
        margin: 15px 0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    
    /* Progress bar container */
    .stProgress > div > div > div > div {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    }
    
    /* File uploader styling */
    [data-testid="stFileUploader"] {
        padding: 20px;
        border-radius: 10px;
        border: 2px dashed #667eea;
    }
    
    /* Select box styling */
    [data-baseweb="select"] {
        background: white;
        border-radius: 8px;
    }
    </style>
""", unsafe_allow_html=True)

# Header
st.markdown("""
    <div class='analyzer-header'>
        <h1 class='analyzer-title'>📄 RoleFit Analyzer</h1>
        <p class='analyzer-subtitle'>Get AI-Powered Insights on Your Resume</p>
    </div>
""", unsafe_allow_html=True)

# Instructions
st.markdown("""
    <div class='info-box'>
        <h4 style='margin-top: 0; color: #2c3e50;'>📋 How It Works</h4>
        <p style='color: #555; margin-bottom: 0;'>
            <strong>Step 1:</strong> Upload your resume in PDF format<br>
            <strong>Step 2:</strong> Select the job role you're targeting<br>
            <strong>Step 3:</strong> Get instant AI analysis with personalized feedback
        </p>
    </div>
""", unsafe_allow_html=True)

# Create two columns for upload and role selection
col1, col2 = st.columns(2, gap="large")

with col1:
    st.markdown("### 📤 Upload Resume")
    uploaded_file = st.file_uploader(
        "Choose your resume file", 
        type=["pdf"],
        help="Upload a PDF version of your resume"
    )

with col2:
    st.markdown("### 🎯 Target Role")
    skills_df = pd.read_csv("data/skills_data.csv")
    roles = skills_df['Role'].unique() 
    roles = ["-- Select Job role --"] + list(roles)
    selected_role = st.selectbox(
        "Select a job role you're targeting:", 
        roles,
        help="Choose the role you want to analyze your resume against"
    )

# Analysis section
if uploaded_file and selected_role != "-- Select Job role --":
    
    with st.spinner("🔄 Analyzing your resume... This may take a moment."):
        resume_text = extract_text_from_pdf(uploaded_file)
        role_skills = load_skill_database("data/skills_data.csv", selected_role)
        resume_skills = extract_skills(resume_text, role_skills)
        report = evaluate_resume(resume_skills, role_skills, selected_role)
        feedback = resume_feedback(resume_text, role_skills, selected_role)

    # Success message
    st.success("✅ Analysis Complete!")
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Score Section
    st.markdown("""
        <div class='score-card'>
            <h3 style='color: #2c3e50; margin-top: 0;'>✅ Skill Match Score</h3>
        </div>
    """, unsafe_allow_html=True)
    
    # Progress bar with score
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        st.progress(report['Score'] / 10)
        score_percentage = (report['Score'] / 10) * 100
        st.markdown(f"<h2 style='text-align: center; color: #667eea;'>{score_percentage:.0f}%</h2>", unsafe_allow_html=True)
    
    # Matched Skills
    st.markdown("""
        <div class='skills-container'>
            <h4 style='color: #2c3e50; margin-top: 0;'>🎯 Matched Skills</h4>
        </div>
    """, unsafe_allow_html=True)
    
    if report['Matched Keywords']:
        matched = report['Matched Keywords']
        
        # Display skills as chips using columns
        cols = st.columns(min(len(matched), 5))
        for idx, skill in enumerate(matched):
            with cols[idx % 5]:
                st.markdown(
                    f"""<div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                   color: white; padding: 8px 16px; border-radius: 20px; 
                                   font-weight: 500; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                                   text-align: center; margin: 5px 0; white-space: nowrap;'>
                        {skill}
                    </div>""",
                    unsafe_allow_html=True
                )
    else:
        st.warning("🔍 No relevant skills found matching the selected role. Consider adding more role-specific skills to your resume.")
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Feedback Section
    st.markdown("""
        <div class='feedback-header'>
            <h3 style='color: #2c3e50; margin: 0;'>💡 AI-Powered Feedback & Recommendations</h3>
        </div>
    """, unsafe_allow_html=True)
    
    # Create a nice container for feedback
    st.markdown("""
        <div style=' padding: 5px; margin-top: 10px;'>
    """, unsafe_allow_html=True)
    
    # Parse and display feedback with better formatting
    for line in feedback:
        if line.strip():
            # Check for section headers (lines with **)
            if line.strip().startswith('**') and line.strip().endswith('**'):
                # Section header
                header_text = line.strip().replace('**', '')
                st.markdown(f"### {header_text}")
            elif line.strip().startswith('*') or line.strip().startswith('→'):
                # Bullet point
                bullet_text = line.strip().lstrip('*→ +').strip()
                st.markdown(f"- {bullet_text}")
            elif ':' in line and not line.strip().startswith('http'):
                # Key-value pair (like "Node.js: description")
                st.markdown(f"**{line.strip()}**")
            else:
                # Regular text
                st.markdown(line.strip())
        else:
            # Empty line for spacing
            st.markdown("")
    
    st.markdown("</div>", unsafe_allow_html=True)
    
    # Download button (uncomment when pdf_generator is ready)
    # st.markdown("<br>", unsafe_allow_html=True)
    # col1, col2, col3 = st.columns([1, 1, 1])
    # with col2:
    #     pdf_bytes = generate_pdf(feedback)
    #     st.download_button(
    #         "📥 Download Feedback Report",
    #         data=pdf_bytes, 
    #         file_name="career_feedback.pdf",
    #         mime="application/pdf",
    #         use_container_width=True
    #     )

elif uploaded_file or selected_role != "-- Select Job role --":
    st.info("👆 Please complete both steps above to analyze your resume")

# Footer tips
st.markdown("<br><br>", unsafe_allow_html=True)
st.markdown("""
    <div style='background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); 
                padding: 20px; border-radius: 10px; text-align: center;'>
        <h4 style='color: #2c3e50; margin-top: 0;'>💡 Pro Tips</h4>
        <p style='color: #555; margin-bottom: 0;'>
            ✓ Ensure your resume clearly lists your technical skills<br>
            ✓ Include relevant keywords from the job description<br>
            ✓ Quantify your achievements with metrics and numbers<br>
            ✓ Keep your resume updated with your latest projects and certifications
        </p>
    </div>
""", unsafe_allow_html=True)