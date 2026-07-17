import { useState } from 'react';
import { Link } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import ScoreCard from '../components/ScoreCard';
import SkillChips from '../components/SkillChips';
import RoleSelector from '../components/RoleSelector';
import FeedbackPanel from '../components/FeedbackPanel';
import SkillRadar from '../components/SkillRadar';
import LearningRoadmap from '../components/LearningRoadmap';
import JobCard from '../components/JobCard';
import ErrorBanner from '../components/ErrorBanner';
import LoadingSpinner from '../components/LoadingSpinner';
import { analyzeResume, getAnalysisFeedback, analyzeForRole, getJobs } from '../api/client';

export default function AnalyzePage() {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [analysisResult, setAnalysisResult] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const handleUpload = async (uploadedFile) => {
    setFile(uploadedFile);
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    setFeedback('');
    setJobs([]);

    try {
      const result = await analyzeResume(uploadedFile);
      setAnalysisResult(result);
      setIsAnalyzing(false);

      // Save scan to growth history
      try {
        const savedHistory = localStorage.getItem('skillsync_score_history') || '[]';
        const historyList = JSON.parse(savedHistory);
        const newEntry = {
          date: new Date().toISOString().split('T')[0],
          score: result.score,
          role: result.best_role
        };
        historyList.push(newEntry);
        if (historyList.length > 10) historyList.shift();
        localStorage.setItem('skillsync_score_history', JSON.stringify(historyList));
      } catch (e) {
        console.error('Failed to save to history:', e);
      }

      fetchFeedback(result.resume_text, result.best_role, result.missing_skills);
      fetchRecommendedJobs(result.best_role);
    } catch (err) {
      setError(err.message || 'An error occurred during resume analysis. Please try again.');
      setIsAnalyzing(false);
    }
  };

  const fetchFeedback = async (resumeText, role, missingSkills) => {
    setIsFeedbackLoading(true);
    setFeedback('');
    try {
      const data = await getAnalysisFeedback(resumeText, role, missingSkills);
      setFeedback(data.feedback);
    } catch (err) {
      setFeedback(`### AI Feedback Unavailable\n\n${err.message || 'Could not fetch career feedback at this time.'}`);
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  const fetchRecommendedJobs = async (role) => {
    setLoadingJobs(true);
    try {
      const data = await getJobs({ category: role, per_page: 3 });
      if (data.jobs && data.jobs.length > 0) {
        setJobs(data.jobs);
      } else {
        const fallbackData = await getJobs({ per_page: 3 });
        setJobs(fallbackData.jobs || []);
      }
    } catch (err) {
      console.error('Failed to load recommended jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleRoleChange = async (selectedRole) => {
    if (!analysisResult) return;
    
    setIsAnalyzing(true);
    setError(null);
    setFeedback('');
    setJobs([]);

    try {
      const result = await analyzeForRole(analysisResult.resume_text, selectedRole);
      
      const updatedResult = {
        ...analysisResult,
        best_role: result.best_role,
        score: result.score,
        matched_skills: result.matched_skills,
        missing_skills: result.missing_skills
      };
      
      setAnalysisResult(updatedResult);
      setIsAnalyzing(false);

      // Save scan to growth history
      try {
        const savedHistory = localStorage.getItem('skillsync_score_history') || '[]';
        const historyList = JSON.parse(savedHistory);
        const newEntry = {
          date: new Date().toISOString().split('T')[0],
          score: result.score,
          role: result.best_role
        };
        historyList.push(newEntry);
        if (historyList.length > 10) historyList.shift();
        localStorage.setItem('skillsync_score_history', JSON.stringify(historyList));
      } catch (e) {
        console.error('Failed to save to history:', e);
      }

      fetchFeedback(updatedResult.resume_text, selectedRole, updatedResult.missing_skills);
      fetchRecommendedJobs(selectedRole);
    } catch (err) {
      setError(err.message || 'Failed to analyze resume for the selected role.');
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setAnalysisResult(null);
    setFeedback('');
    setJobs([]);
    setError(null);
  };

  const handleDownloadReport = () => {
    if (!analysisResult) return;
    
    const reportContent = `
# SkillSync Resume Analysis Report

**File Name**: ${file?.name || 'Uploaded Document'}
**Target Role**: ${analysisResult.best_role}
**Match Score**: ${Math.round(analysisResult.score * 10)}%

## Matched Skills
${analysisResult.matched_skills.length > 0 ? analysisResult.matched_skills.map(s => `- ${s}`).join('\n') : 'None detected.'}

## Missing Skills / Gaps
${analysisResult.missing_skills.length > 0 ? analysisResult.missing_skills.map(s => `- ${s}`).join('\n') : 'None detected.'}

## AI Career Coach Feedback
${feedback || 'AI Feedback not loaded.'}

---
Generated by SkillSync.
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `skillsync_${analysisResult.best_role.toLowerCase().replace(/\s+/g, '_')}_report.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col min-h-screen page-wrapper mx-auto max-w-[1200px] w-full px-6 md:px-8">
      {error && <ErrorBanner message={error} onClose={() => setError(null)} />}

      {!analysisResult && !isAnalyzing && (
        <div className="text-center max-w-[760px] mx-auto mt-16 flex flex-col items-center gap-6 animate-[slideUp_0.95s_cubic-bezier(0.22,1,0.36,1)_forwards]">
          <h1 className="text-5xl max-sm:text-4xl max-xs:text-3xl font-extrabold tracking-tight leading-[1.15] text-text-primary">
            Analyze Your <span className="text-primary">Resume</span>
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed max-w-[60ch] m-0">
            Upload your resume document (PDF, DOCX, DOC, or TXT) to instantly calculate your compatibility score, identify missing skills, and get personalized career guidance.
          </p>

          <div className="w-full max-w-[540px] mt-8">
            <FileUpload onAnalyze={handleUpload} isAnalyzing={isAnalyzing} />
          </div>
        </div>
      )}

      {isAnalyzing && (
        <div className="flex justify-center items-center mt-16 min-h-[300px] animate-[fadeIn_0.8s_cubic-bezier(0.22,1,0.36,1)_forwards]">
          <LoadingSpinner text="Analyzing your resume. Scanning skill databases and matching roles..." />
        </div>
      )}

      {analysisResult && !isAnalyzing && (
        <div className="flex flex-col gap-6 mt-4 animate-[fadeIn_0.8s_cubic-bezier(0.22,1,0.36,1)_forwards]">
          <div className="flex justify-between items-center border-b border-border pb-4 max-sm:flex-col max-sm:items-start max-sm:gap-4">
            <div>
              <h2 className="text-2xl font-bold font-headings">Analysis Report</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-text-secondary text-sm mt-0.5">
                <span>Source: <strong className="text-text-primary">{file?.name || 'Document'}</strong></span>
                <span className="text-border max-sm:hidden">|</span>
                <span>Role detected: <strong className="text-text-primary">{analysisResult.best_role}</strong></span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary btn-sm" onClick={handleDownloadReport}>
                Download Report 📥
              </button>
              <button className="btn btn-secondary btn-sm" onClick={handleReset}>
                Upload Another Resume ↺
              </button>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_1.8fr] gap-6 items-start max-lg:grid-cols-1">
            {/* Left Column: Score, Selector, Skills */}
            <div className="flex flex-col gap-6 lg:sticky lg:top-[88px]">
              <div className="p-6 flex flex-col items-center text-center gap-6 bg-bg-secondary border border-border rounded-md">
                <ScoreCard score={analysisResult.score} roleName={analysisResult.best_role} />
                
                <div className="w-full border-t border-border pt-6 flex flex-col gap-1 text-left">
                  <p className="text-[11px] text-text-secondary font-medium mb-2">Not targeting this role?</p>
                  <RoleSelector
                    currentRole={analysisResult.best_role}
                    rolesScores={analysisResult.all_roles_scores || []}
                    onRoleChange={handleRoleChange}
                  />
                </div>
              </div>

              <SkillRadar 
                matchedSkills={analysisResult.matched_skills} 
                missingSkills={analysisResult.missing_skills} 
              />

              <SkillChips
                matchedSkills={analysisResult.matched_skills}
                missingSkills={analysisResult.missing_skills}
              />
            </div>

            {/* Right Column: AI Guidance & Jobs */}
            <div className="flex flex-col gap-12">
              <FeedbackPanel feedback={feedback} isLoading={isFeedbackLoading} />

              <LearningRoadmap missingSkills={analysisResult.missing_skills} />

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold font-headings">Recommended Jobs</h3>
                  <Link to="/jobs" className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors duration-300">
                    View All Jobs →
                  </Link>
                </div>

                {loadingJobs ? (
                  <LoadingSpinner text="Finding top match job openings..." />
                ) : jobs.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {jobs.map((job, idx) => (
                      <JobCard key={idx} job={job} />
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-text-secondary flex flex-col items-center gap-4 bg-bg-secondary border border-border rounded-md">
                    <p className="m-0">No immediate jobs matching this role. Check our jobs board for options.</p>
                    <Link to="/jobs" className="btn btn-secondary btn-sm">Browse All Openings</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
