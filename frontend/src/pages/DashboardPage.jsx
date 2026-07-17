import { useState, useEffect } from 'react';
import ErrorBanner from '../components/ErrorBanner';
import { getRoles } from '../api/client';

export default function DashboardPage() {
  const [history, setHistory] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [error, setError] = useState(null);

  // Resume Comparison states
  const [targetRole, setTargetRole] = useState('');
  const [resumeA, setResumeA] = useState('');
  const [resumeB, setResumeB] = useState('');
  const [compResults, setCompResults] = useState(null);
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // 1. Roles list for dropdown
      const rolesData = await getRoles();
      setRolesList(rolesData.roles || []);
      if (rolesData.roles && rolesData.roles.length > 0) {
        setTargetRole(rolesData.roles[0]);
      }

      // 2. Score History (pre-populate mock history if empty)
      const savedHistory = localStorage.getItem('skillsync_score_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      } else {
        const mockHistory = [
          { date: '2026-06-15', score: 3.5, role: 'Frontend Developer' },
          { date: '2026-06-28', score: 4.8, role: 'Frontend Developer' },
          { date: '2026-07-05', score: 6.2, role: 'Full Stack Developer' },
          { date: '2026-07-13', score: 7.5, role: 'Full Stack Developer' }
        ];
        localStorage.setItem('skillsync_score_history', JSON.stringify(mockHistory));
        setHistory(mockHistory);
      }
    } catch (err) {
      console.error('Failed to initialize dashboard:', err);
      setError('Could not establish contact with backend. Running on local cached state.');
    }
  };

  // Run the side-by-side comparison (Client-side mock calculations based on standard keywords)
  const handleCompare = (e) => {
    e.preventDefault();
    if (!resumeA.trim() || !resumeB.trim() || !targetRole) {
      setError('Please fill in both resumes and select a target role.');
      return;
    }

    setIsComparing(true);
    setError(null);

    setTimeout(() => {
      // Simulating realistic keyword overlaps based on target role name
      const roleKeywords = {
        'Frontend Developer': ['javascript', 'react', 'css', 'html', 'tailwind', 'typescript', 'git', 'responsive design'],
        'Full Stack Developer': ['javascript', 'react', 'node.js', 'mongodb', 'sql', 'express', 'git', 'rest apis'],
        'Data Scientist': ['python', 'pandas', 'numpy', 'scikit-learn', 'machine learning', 'sql', 'statistics', 'matplotlib'],
        'Data Analyst': ['sql', 'excel', 'tableau', 'power bi', 'python', 'pandas', 'numpy', 'matplotlib']
      };

      const keywords = roleKeywords[targetRole] || ['javascript', 'python', 'git', 'sql', 'agile', 'docker', 'apis', 'testing'];

      // Simple keyword detection
      const testResume = (text) => {
        const processed = text.toLowerCase();
        const matched = keywords.filter(kw => processed.includes(kw));
        const missing = keywords.filter(kw => !processed.includes(kw));
        const score = keywords.length > 0 ? (matched.length / keywords.length) * 10 : 0;
        return { matched, missing, score };
      };

      const resultA = testResume(resumeA);
      const resultB = testResume(resumeB);

      setCompResults({
        role: targetRole,
        resA: {
          score: resultA.score,
          matched: resultA.matched,
          missing: resultA.missing
        },
        resB: {
          score: resultB.score,
          matched: resultB.matched,
          missing: resultB.missing
        }
      });
      setIsComparing(false);
    }, 1200);
  };

  // SVG drawing dimensions for Growth chart
  const chartWidth = 500;
  const chartHeight = 150;
  const padding = 20;

  const points = history.map((h, index) => {
    if (history.length <= 1) return { x: chartWidth / 2, y: chartHeight / 2 };
    const x = padding + (index / (history.length - 1)) * (chartWidth - padding * 2);
    // score is out of 10, so convert to percentage y-coord
    const y = chartHeight - padding - (h.score / 10) * (chartHeight - padding * 2);
    return { x, y, ...h };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="flex flex-col gap-8 page-wrapper mx-auto max-w-[1200px] w-full px-6 md:px-8">
      {error && <ErrorBanner message={error} onClose={() => setError(null)} />}

      <div className="border-b border-border pb-4 mb-4">
        <h1 className="text-3xl font-bold font-headings text-text-primary">Growth Dashboard</h1>
        <p className="text-text-secondary text-sm">Track your score history, achievements, and compare resume profiles</p>
      </div>

      <div className="grid grid-cols-[1.8fr_1fr] gap-8 max-lg:grid-cols-1">
        {/* Left Card: Score line chart */}
        <div className="p-8 bg-bg-secondary border border-border rounded-md">
          <h3 className="text-lg font-bold mb-1">📈 Score Growth Tracking</h3>
          <p className="text-sm text-text-secondary mb-6">Track your match scores progression over time</p>
          
          {history.length > 0 ? (
            <div className="w-full pt-4">
              <svg className="w-full h-auto overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                {/* Horizontal grid lines */}
                {[0, 0.25, 0.5, 0.75, 1.0].map((ratio, idx) => {
                  const y = chartHeight - padding - ratio * (chartHeight - padding * 2);
                  return (
                    <g key={idx}>
                      <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} className="stroke-white/5 stroke-[1px]" />
                      <text x={padding - 5} y={y + 3} className="fill-current text-text-tertiary text-[8px] font-medium font-sans" textAnchor="end">
                        {ratio * 100}%
                      </text>
                    </g>
                  );
                })}

                {/* Growth line */}
                <path d={linePath} className="fill-none stroke-primary stroke-[2.5px] stroke-round stroke-linejoin" />

                {/* Interactive Points */}
                {points.map((p, idx) => (
                  <g key={idx} className="cursor-pointer">
                    <circle cx={p.x} cy={p.y} r="5" className="fill-primary stroke-bg-primary stroke-2" />
                    <circle cx={p.x} cy={p.y} r="8" className="fill-primary opacity-15 animate-ping" style={{ animationDuration: '3s' }} />
                    <text x={p.x} y={p.y - 12} className="fill-current text-text-primary text-[8px] font-bold font-sans" textAnchor="middle">
                      {Math.round(p.score * 10)}%
                    </text>
                    <text x={p.x} y={chartHeight - 4} className="fill-current text-text-secondary text-[7px] font-semibold font-sans" textAnchor="middle">
                      {p.date.substr(5)}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          ) : (
            <p className="text-text-tertiary text-sm text-center py-8">No scans logged yet. Upload your resume on the Home page to start tracking.</p>
          )}
        </div>

        {/* Right Card: Achievements & Streaks */}
        <div className="p-8 bg-bg-secondary border border-border rounded-md flex flex-col gap-6">
          <h3 className="text-lg font-bold m-0">🏆 Achievements & Stats</h3>
          <div className="flex flex-col gap-3">
            <div className="bg-bg-tertiary border border-border p-4 rounded-md flex justify-start items-center gap-4">
              <span className="text-2xl">🔥</span>
              <div>
                <h4 className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold m-0">Streak</h4>
                <p className="text-sm text-text-primary font-bold m-0">3 Weeks Active</p>
              </div>
            </div>
            <div className="bg-bg-tertiary border border-border p-4 rounded-md flex justify-start items-center gap-4">
              <span className="text-2xl">🎓</span>
              <div>
                <h4 className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold m-0">Target Match</h4>
                <p className="text-sm text-text-primary font-bold m-0">75% Peak Score</p>
              </div>
            </div>
          </div>
          
          <h4 className="text-[10px] uppercase text-text-tertiary tracking-wider font-bold mt-2">Unlocked Badges</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-bg-card border border-border px-2 py-3 rounded-sm flex flex-col items-center text-center gap-0.5" title="Scored over 70% in any tech role">
              <span className="text-lg">🎖️</span>
              <span className="text-[8px] font-bold text-text-secondary">ATS Warrior</span>
            </div>
            <div className="bg-bg-card border border-border px-2 py-3 rounded-sm flex flex-col items-center text-center gap-0.5" title="Added 5 items to your Job Tracker Wishlist">
              <span className="text-lg">📁</span>
              <span className="text-[8px] font-bold text-text-secondary">Organiser</span>
            </div>
            <div className="bg-bg-card border border-border px-2 py-3 rounded-sm flex flex-col items-center text-center gap-0.5 opacity-40 border-dashed" title="Locked: Complete 3 learning courses to unlock">
              <span className="text-lg">🔒</span>
              <span className="text-[8px] font-bold text-text-secondary">Dev Master</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison section */}
      <div className="p-8 bg-bg-secondary border border-border rounded-md flex flex-col gap-4">
        <h3 className="text-lg font-bold m-0">⚖️ Side-by-Side Resume Comparison</h3>
        <p className="text-sm text-text-secondary mb-2">Compare two different resume versions against a target role to find the best match</p>

        <form onSubmit={handleCompare} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 max-w-[250px]">
            <label htmlFor="compare-role" className="text-xs font-semibold text-text-secondary">Select Target Role</label>
            <select
              id="compare-role"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full p-2 bg-bg-input border border-border rounded-sm text-sm text-text-primary focus:border-primary outline-none cursor-pointer"
            >
              {rolesList.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-8 my-4 max-lg:grid-cols-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary">Resume Draft A</label>
              <textarea
                placeholder="Paste the plain text of Resume version A here..."
                value={resumeA}
                onChange={(e) => setResumeA(e.target.value)}
                rows="6"
                className="w-full p-3 bg-bg-input border border-border rounded-sm text-sm text-text-primary focus:border-primary outline-none font-sans"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary">Resume Draft B</label>
              <textarea
                placeholder="Paste the plain text of Resume version B here..."
                value={resumeB}
                onChange={(e) => setResumeB(e.target.value)}
                rows="6"
                className="w-full p-3 bg-bg-input border border-border rounded-sm text-sm text-text-primary focus:border-primary outline-none font-sans"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary self-start" disabled={isComparing}>
            {isComparing ? 'Running Overlap Scan...' : 'Compare Resumes'}
          </button>
        </form>

        {isComparing && (
          <div className="mt-8 text-center flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <p className="text-sm text-text-secondary m-0">Analyzing keyword density and matching index scores...</p>
          </div>
        )}

        {compResults && !isComparing && (
          <div className="mt-8 border-t border-border pt-8 animate-[fadeIn_0.5s_ease-out_forwards]">
            <h4 className="text-lg font-bold mb-6">Comparison Results for: {compResults.role}</h4>
            
            <div className="grid grid-cols-2 gap-8 mb-6 max-lg:grid-cols-1">
              {/* Resume A Column */}
              <div className="p-6 bg-bg-secondary border border-border rounded-md flex flex-col gap-4">
                <div className="flex justify-between items-center w-full">
                  <h4 className="text-base font-bold m-0">Resume Draft A</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                    compResults.resA.score >= 7 
                      ? 'bg-success-bg text-success border-success-border' 
                      : 'bg-warning-bg text-warning border-warning-border'
                  }`}>
                    {Math.round(compResults.resA.score * 10)}% match
                  </span>
                </div>
                
                <div className="mt-2">
                  <h5 className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold mb-2">Matched Skills ({compResults.resA.matched.length})</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {compResults.resA.matched.map(s => (
                      <span key={s} className="bg-success-bg text-success border border-success-border px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-2">
                  <h5 className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold mb-2">Missing Gaps ({compResults.resA.missing.length})</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {compResults.resA.missing.map(s => (
                      <span key={s} className="bg-error-bg text-error border border-error-border px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Resume B Column */}
              <div className="p-6 bg-bg-secondary border border-border rounded-md flex flex-col gap-4">
                <div className="flex justify-between items-center w-full">
                  <h4 className="text-base font-bold m-0">Resume Draft B</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                    compResults.resB.score >= 7 
                      ? 'bg-success-bg text-success border-success-border' 
                      : 'bg-warning-bg text-warning border-warning-border'
                  }`}>
                    {Math.round(compResults.resB.score * 10)}% match
                  </span>
                </div>

                <div className="mt-2">
                  <h5 className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold mb-2">Matched Skills ({compResults.resB.matched.length})</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {compResults.resB.matched.map(s => (
                      <span key={s} className="bg-success-bg text-success border border-success-border px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-2">
                  <h5 className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold mb-2">Missing Gaps ({compResults.resB.missing.length})</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {compResults.resB.missing.map(s => (
                      <span key={s} className="bg-error-bg text-error border border-error-border px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-bg-secondary border border-border border-l-4 border-l-[#3b82f6] rounded-md flex items-center justify-center gap-4 text-sm text-text-primary">
              <span className="text-xl">💡</span>
              <p className="m-0 text-left">
                <strong>Verdict: </strong> 
                {compResults.resA.score > compResults.resB.score 
                  ? 'Draft A is more highly optimized for this role due to higher keyword matches.' 
                  : compResults.resB.score > compResults.resA.score
                  ? 'Draft B contains better keyword integration and has a higher compatibility rating.'
                  : 'Both drafts score identically. Try adding more missing skills to stand out.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
