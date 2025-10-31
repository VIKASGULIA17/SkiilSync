import streamlit as st

st.set_page_config(
    page_title="SkillSync - Your Career Companion",
    page_icon="🎯",
    layout="wide"
)

# Custom CSS for better styling
st.markdown("""
    <style>
    .main-header {
        text-align: center;
        padding: 40px 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 20px;
        margin-bottom: 40px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    .main-title {
        font-size: 3.5em;
        font-weight: bold;
        color: white;
        margin-bottom: 10px;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    .main-subtitle {
        font-size: 1.3em;
        color: #f0f0f0;
        margin-top: 10px;
    }
    .feature-card {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
        margin: 20px 0;
        height: 100%;
    }
    .feature-icon {
        font-size: 3em;
        margin-bottom: 15px;
    }
    .feature-title {
        font-size: 1.8em;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 15px;
    }
    .feature-description {
        font-size: 1.1em;
        color: #34495e;
        line-height: 1.6;
    }
    .cta-button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px 30px;
        border-radius: 25px;
        text-decoration: none;
        font-weight: bold;
        display: inline-block;
        margin-top: 15px;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }
    .stats-container {
        background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        margin: 30px 0;
    }
    .stat-item {
        display: inline-block;
        margin: 0 30px;
    }
    .stat-number {
        font-size: 2.5em;
        font-weight: bold;
        color: #2c3e50;
    }
    .stat-label {
        font-size: 1.1em;
        color: #555;
    }
    </style>
""", unsafe_allow_html=True)

# Hero Section
st.markdown("""
    <div class='main-header'>
        <div class='main-title'>🎯 SkillSync</div>
        <div class='main-subtitle'>Your AI-Powered Career Companion</div>
        <p style='color: #e0e0e0; font-size: 1.1em; margin-top: 15px;'>
            Navigate your career journey with intelligent tools designed to help you succeed
        </p>
    </div>
""", unsafe_allow_html=True)

# Welcome message
st.markdown("""
    <div style='text-align: center; margin-bottom: 40px;'>
        <h2 style='color:Violet;'>Welcome to Your Career Hub! 👋</h2>
        <p style='font-size: 1.2em; color: white; max-width: 800px; margin: 20px auto;'>
            Whether you're searching for your dream job or optimizing your resume for success, 
            SkillSync provides the tools you need to stand out in today's competitive job market.
        </p>
    </div>
""", unsafe_allow_html=True)

# Feature Cards
col1, col2 = st.columns(2, gap="large")

with col1:
    st.markdown("""
        <div class='feature-card'>
            <div class='feature-icon'>🔍</div>
            <div class='feature-title'>Job Opportunities Portal</div>
            <div class='feature-description'>
                Discover thousands of job opportunities from top tech companies. Filter by category, 
                experience level, and find your perfect role. Get instant access to apply directly 
                to positions that match your skills and career goals.
                <br><br>
                <strong>Features:</strong>
                <ul style='margin-top: 10px;'>
                    <li>Browse jobs from leading tech companies</li>
                    <li>Filter by category and experience</li>
                    <li>Direct application links</li>
                    <li>Salary information included</li>
                </ul>
            </div>
        </div>
    """, unsafe_allow_html=True)

with col2:
    st.markdown("""
        <div class='feature-card'>
            <div class='feature-icon'>📄</div>
            <div class='feature-title'>RoleFit Analyzer</div>
            <div class='feature-description'>
                Get AI-powered insights on your resume. Our intelligent analyzer evaluates your skills 
                against specific job roles, identifies gaps, and provides personalized recommendations 
                to improve your chances of landing interviews.
                <br><br>
                <strong>Features:</strong>
                <ul style='margin-top: 10px;'>
                    <li>Upload and analyze your resume</li>
                    <li>Match skills to target roles</li>
                    <li>Get AI-powered feedback</li>
                    <li>Identify skill gaps</li>
                </ul>
            </div>
        </div>
    """, unsafe_allow_html=True)

# Call to Action
st.markdown("<br>", unsafe_allow_html=True)

col1, col2, col3 = st.columns([1, 2, 1])

with col2:
    st.markdown("""
        <div style='text-align: center; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); 
                    padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);'>
            <h2 style='color: white; margin-bottom: 20px;'>Ready to Accelerate Your Career? 🚀</h2>
            <p style='color: #fff; font-size: 1.1em; margin-bottom: 25px;'>
                Choose a tool from the sidebar to get started on your journey!
            </p>
        </div>
    """, unsafe_allow_html=True)

# How it works section
st.markdown("<br><br>", unsafe_allow_html=True)
st.markdown("""
    <div style='text-align: center; margin: 50px 0;'>
        <h2 style='color: white; margin-bottom: 30px;'>How It Works</h2>
    </div>
""", unsafe_allow_html=True)

col1, col2, col3 = st.columns(3)

with col1:
    st.markdown("""
        <div style='text-align: center; padding: 20px;'>
            <div style='font-size: 3em; margin-bottom: 15px;'>1️⃣</div>
            <h3 style='color: #667eea;'>Choose Your Tool</h3>
            <p style='color: ;'>Select from Job Search or Resume Analyzer in the sidebar</p>
        </div>
    """, unsafe_allow_html=True)

with col2:
    st.markdown("""
        <div style='text-align: center; padding: 20px;'>
            <div style='font-size: 3em; margin-bottom: 15px;'>2️⃣</div>
            <h3 style='color: #667eea;'>Input Your Details</h3>
            <p style='color: ;'>Upload your resume or select job preferences</p>
        </div>
    """, unsafe_allow_html=True)

with col3:
    st.markdown("""
        <div style='text-align: center; padding: 20px;'>
            <div style='font-size: 3em; margin-bottom: 15px;'>3️⃣</div>
            <h3 style='color: #667eea;'>Get Results</h3>
            <p style='color: ;'>Receive personalized insights and opportunities</p>
        </div>
    """, unsafe_allow_html=True)

# Footer
st.markdown("<br><br>", unsafe_allow_html=True)
st.markdown("""
    <div style='text-align: center; padding: 30px; background-color: #f8f9fa; 
                border-radius: 10px; margin-top: 50px;'>
        <p style='color: #777; font-size: 0.9em;'>
            💡 <strong>Pro Tip:</strong> Use the sidebar navigation to switch between tools seamlessly!
        </p>
        <p style='color: #999; font-size: 0.85em; margin-top: 10px;'>
            © 2025 SkillSync - Empowering Your Career Journey
        </p>
    </div>
""", unsafe_allow_html=True)