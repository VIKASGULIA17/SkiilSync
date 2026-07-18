import { useState } from 'react';

// Preloaded mock data for Jobs
const initialJobs = [
  { id: 1, title: "React Developer", company: "Razorpay", location: "Bengaluru", category: "React Developer", salary: "₹8L - ₹12L", experience: "1-3 Years", platform: "LinkedIn", link: "https://linkedin.com", scraped_at: "2026-07-18T18:30:00Z" },
  { id: 2, title: "Frontend Engineer", company: "Swiggy", location: "Remote", category: "Frontend Developer", salary: "₹12L - ₹16L", experience: "Fresher", platform: "Indeed", link: "https://indeed.com", scraped_at: "2026-07-18T17:45:00Z" },
  { id: 3, title: "Full Stack Developer", company: "Zomato", location: "Gurugram", category: "Full Stack Developer", salary: "₹15L - ₹20L", experience: "3-5 Years", platform: "LinkedIn", link: "https://linkedin.com", scraped_at: "2026-07-18T15:20:00Z" },
  { id: 4, title: "Software Engineer - React", company: "Paytm", location: "Noida", category: "React Developer", salary: "₹10L - ₹14L", experience: "1-3 Years", platform: "Internshala", link: "https://internshala.com", scraped_at: "2026-07-18T12:10:00Z" },
  { id: 5, title: "Data Analyst Intern", company: "Reliance", location: "Mumbai", category: "Data Analyst", salary: "₹30k - ₹40k/mo", experience: "Fresher", platform: "TimesJobs", link: "https://timesjobs.com", scraped_at: "2026-07-17T09:00:00Z" },
  { id: 6, title: "Machine Learning Engineer", company: "TCS", location: "Remote", category: "Data Scientist", salary: "₹9L - ₹13L", experience: "1-3 Years", platform: "Indeed", link: "https://indeed.com", scraped_at: "2026-07-17T08:30:00Z" },
  { id: 7, title: "Senior Frontend Lead", company: "Infosys", location: "Bengaluru", category: "Frontend Developer", salary: "₹18L - ₹24L", experience: "5+ Years", platform: "LinkedIn", link: "https://linkedin.com", scraped_at: "2026-07-16T14:15:00Z" },
  { id: 8, title: "React Native Specialist", company: "Flipkart", location: "Bengaluru", category: "React Developer", salary: "₹14L - ₹18L", experience: "3-5 Years", platform: "LinkedIn", link: "https://linkedin.com", scraped_at: "2026-07-16T10:00:00Z" }
];

// Preloaded mock data for Users
const initialUsers = [
  { id: 101, full_name: "Amit Sharma", email: "amit.sharma@example.com", role: "user", match_score: 78, resume_analysed: 3, target_role: "Frontend Developer", location: "Bengaluru, India", description: "Passionate React enthusiast building highly interactive UI interfaces.", github: "https://github.com", linkedin: "https://linkedin.com", portfolio: "https://portfolio.dev", skills: ["React", "JavaScript", "TypeScript", "Tailwind CSS", "HTML5", "CSS3", "Git"] },
  { id: 102, full_name: "Neha Patel", email: "neha.patel@example.com", role: "admin", match_score: 88, resume_analysed: 5, target_role: "Lead React Architect", location: "Mumbai, India", description: "Senior Engineer focusing on micro-frontends and performant web modules.", github: "https://github.com", linkedin: "https://linkedin.com", portfolio: "https://portfolio.dev", skills: ["React", "Redux Toolkit", "Next.js", "GraphQL", "Docker", "CI/CD", "TypeScript"] },
  { id: 103, full_name: "Rohan Verma", email: "rohan.v@example.com", role: "user", match_score: 62, resume_analysed: 1, target_role: "Full Stack Developer", location: "Gurugram, India", description: "Aspiring software dev exploring both backend REST architectures and modern layouts.", github: "https://github.com", linkedin: "https://linkedin.com", portfolio: "https://portfolio.dev", skills: ["JavaScript", "React", "Node.js", "Express", "MongoDB", "SQL", "Git"] },
  { id: 104, full_name: "Pooja Roy", email: "pooja.roy@example.com", role: "user", match_score: 75, resume_analysed: 4, target_role: "Data Analyst", location: "Noida, India", description: "Data explorer who loves turning complex query numbers into stunning visual stories.", github: "https://github.com", linkedin: "https://linkedin.com", portfolio: "https://portfolio.dev", skills: ["Python", "SQL", "Excel", "Tableau", "Power BI", "Pandas", "Matplotlib"] },
  { id: 105, full_name: "Vikram Das", email: "vikram.d@example.com", role: "user", match_score: 55, resume_analysed: 2, target_role: "Data Scientist", location: "Pune, India", description: "Curious about machine learning, model tuning, and statistics pipelines.", github: "https://github.com", linkedin: "https://linkedin.com", portfolio: "https://portfolio.dev", skills: ["Python", "Numpy", "Pandas", "Scikit-Learn", "Machine Learning", "SQL"] }
];

// Preloaded mock data for Scraper Runs
const initialLogs = [
  { id: 1, started_at: "2026-07-18T18:00:00Z", completed_at: "2026-07-18T18:04:12Z", job_count: 34, status: "completed", platform: "LinkedIn", duration: "4m 12s", error_message: null },
  { id: 2, started_at: "2026-07-18T14:30:00Z", completed_at: "2026-07-18T14:32:45Z", job_count: 21, status: "completed", platform: "Indeed", duration: "2m 45s", error_message: null },
  { id: 3, started_at: "2026-07-17T22:00:00Z", completed_at: "2026-07-17T22:01:15Z", job_count: 0, status: "failed", platform: "TimesJobs", duration: "1m 15s", error_message: "Network Timeout: Could not connect to TimesJobs portal." },
  { id: 4, started_at: "2026-07-17T11:00:00Z", completed_at: "2026-07-17T11:03:50Z", job_count: 18, status: "completed", platform: "Internshala", duration: "3m 50s", error_message: null },
  { id: 5, started_at: "2026-07-16T08:00:00Z", completed_at: "2026-07-16T08:05:33Z", job_count: 42, status: "completed", platform: "LinkedIn", duration: "5m 33s", error_message: null }
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, scraper, jobs, users, config

  // Dynamic States for interactive operations
  const [jobsList, setJobsList] = useState(initialJobs);
  const [usersList, setUsersList] = useState(initialUsers);
  const [logsList, setLogsList] = useState(initialLogs);

  // Scraper Manual Trigger Simulation State
  const [isScraping, setIsScraping] = useState(false);
  const [scraperProgress, setScraperProgress] = useState(0);
  const [scraperLogMsg, setScraperLogMsg] = useState('');
  const [activeScrapePlatform, setActiveScrapePlatform] = useState('LinkedIn');

  // Job Modal Control State
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null); // null for Add, job object for Edit
  const [jobForm, setJobForm] = useState({ title: '', company: '', location: '', category: 'React Developer', salary: '', experience: 'Fresher', platform: 'LinkedIn', link: '' });

  // User details Modal Control
  const [selectedUser, setSelectedUser] = useState(null);

  // Search & Filter state
  const [jobSearch, setJobSearch] = useState('');
  const [jobPlatformFilter, setJobPlatformFilter] = useState('All');
  const [userSearch, setUserSearch] = useState('');

  // Config States
  const [apiKey, setApiKey] = useState('gsk_••••••••••••••••••••••••••••••••');
  const [selectedModel, setSelectedModel] = useState('llama-3.1-70b-versatile');
  const [cronConfig, setCronConfig] = useState('0 */6 * * *');
  const [platformsConfig, setPlatformsConfig] = useState({ LinkedIn: true, Indeed: true, Internshala: true, TimesJobs: false });
  const [isKeyEditing, setIsKeyEditing] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // Show quick success messages
  const triggerToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Scraper Trigger Simulation
  const handleStartScrape = () => {
    if (isScraping) return;
    setIsScraping(true);
    setScraperProgress(10);
    setScraperLogMsg(`Initializing crawler connection to ${activeScrapePlatform}...`);

    let count = 10;
    const interval = setInterval(() => {
      count += 15;
      if (count >= 100) {
        clearInterval(interval);
        setScraperProgress(100);
        
        // Add a mock scraping run complete log
        const newJobsScraped = Math.floor(Math.random() * 25) + 5;
        const newRun = {
          id: logsList.length + 1,
          started_at: new Date().toISOString(),
          completed_at: new Date(Date.now() + 45000).toISOString(),
          job_count: newJobsScraped,
          status: 'completed',
          platform: activeScrapePlatform,
          duration: '45s',
          error_message: null
        };
        
        // Simulate prepending new jobs
        const simulatedJobs = Array.from({ length: 3 }).map((_, i) => ({
          id: jobsList.length + i + 1,
          title: `Scraped ${activeScrapePlatform} ${['Developer', 'Engineer', 'Intern'][i]}`,
          company: ['TCS', 'Capgemini', 'Airtel'][Math.floor(Math.random() * 3)],
          location: 'Remote',
          category: 'Frontend Developer',
          salary: '₹6L - ₹10L',
          experience: '1-3 Years',
          platform: activeScrapePlatform,
          link: 'https://skillsync.dev',
          scraped_at: new Date().toISOString()
        }));

        setJobsList(prev => [...simulatedJobs, ...prev]);
        setLogsList(prev => [newRun, ...prev]);
        setScraperLogMsg(`Scraping completed! Added ${newJobsScraped} jobs from ${activeScrapePlatform}.`);
        triggerToast(`Successfully scraped ${newJobsScraped} jobs!`);
        
        setTimeout(() => {
          setIsScraping(false);
          setScraperProgress(0);
          setScraperLogMsg('');
        }, 2000);
      } else {
        setScraperProgress(count);
        if (count === 40) {
          setScraperLogMsg(`Connection established. Navigating to search queries...`);
        } else if (count === 70) {
          setScraperLogMsg(`Extracting listing elements & payload structures...`);
        } else if (count === 85) {
          setScraperLogMsg(`De-duplicating records and matching ATS index mappings...`);
        }
      }
    }, 600);
  };

  // Job List Mutation (Simulated)
  const handleDeleteJob = (id) => {
    setJobsList(prev => prev.filter(job => job.id !== id));
    triggerToast("Job listing deleted successfully!");
  };

  const handleOpenAddJob = () => {
    setCurrentJob(null);
    setJobForm({ title: '', company: '', location: '', category: 'React Developer', salary: '', experience: 'Fresher', platform: 'LinkedIn', link: '' });
    setIsJobModalOpen(true);
  };

  const handleOpenEditJob = (job) => {
    setCurrentJob(job);
    setJobForm({ ...job });
    setIsJobModalOpen(true);
  };

  const handleSaveJob = (e) => {
    e.preventDefault();
    if (!jobForm.title.trim() || !jobForm.company.trim()) return;

    if (currentJob) {
      // Edit mode
      setJobsList(prev => prev.map(job => job.id === currentJob.id ? { ...jobForm } : job));
      triggerToast("Job listing updated successfully!");
    } else {
      // Add mode
      const newJob = {
        ...jobForm,
        id: jobsList.length + 1,
        scraped_at: new Date().toISOString()
      };
      setJobsList(prev => [newJob, ...prev]);
      triggerToast("New job added successfully!");
    }
    setIsJobModalOpen(false);
  };

  // User List Mutation (Simulated)
  const handleToggleUserRole = (id) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === id) {
        const nextRole = u.role === 'admin' ? 'user' : 'admin';
        return { ...u, role: nextRole };
      }
      return u;
    }));
    triggerToast("User role toggled successfully!");
  };

  const handleDeleteUser = (id) => {
    setUsersList(prev => prev.filter(u => u.id !== id));
    triggerToast("User account suspended/removed.");
  };

  // Filtered Job list
  const filteredJobs = jobsList.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(jobSearch.toLowerCase()) || 
                          job.company.toLowerCase().includes(jobSearch.toLowerCase()) ||
                          job.location.toLowerCase().includes(jobSearch.toLowerCase());
    const matchesPlatform = jobPlatformFilter === 'All' || job.platform === jobPlatformFilter;
    return matchesSearch && matchesPlatform;
  });

  // Filtered User list
  const filteredUsers = usersList.filter(user => 
    user.full_name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.target_role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 page-wrapper mx-auto max-w-[1200px] w-full px-6 md:px-8">
      
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed bottom-6 right-6 p-4 bg-success-bg border border-success-border rounded-sm text-success font-medium text-sm z-[2000] shadow-2xl flex items-center gap-2 animate-[slideUp_0.95s_cubic-bezier(0.22,1,0.36,1)_forwards]">
          <span>✨</span>
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative p-8 bg-bg-secondary border border-border rounded-md overflow-hidden animate-[scaleIn_0.85s_cubic-bezier(0.22,1,0.36,1)_forwards]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(62,207,142,0.06)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-primary to-secondary" />

        <div className="flex justify-between items-center max-md:flex-col max-md:gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1 max-md:justify-center">
              <span className="badge badge-success text-[10px] uppercase font-bold tracking-wider">Super Administrator</span>
              <span className="badge badge-info text-[10px] font-bold">Demo Mode</span>
            </div>
            <h1 className="text-3xl font-bold font-headings text-text-primary tracking-tight max-md:text-center">
              System Admin Control Center
            </h1>
            <p className="text-text-secondary text-sm m-0 max-md:text-center">
              Monitor job scraping status, manage jobs and users, and configure LLM API pipelines.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-xs bg-bg-tertiary px-3 py-1.5 border border-border rounded-sm text-text-secondary flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></span>
              API Gateway: Connected
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border gap-2 overflow-x-auto pb-px stagger-1">
        {[
          { id: 'overview', label: '📊 Dashboard Overview' },
          { id: 'scraper', label: '🕷️ Scraper Panel' },
          { id: 'jobs', label: '💼 Job Listings' },
          { id: 'users', label: '👥 User Base' },
          { id: 'config', label: '⚙️ System Config' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-semibold text-text-secondary border-b-2 bg-transparent border-transparent hover:text-text-primary cursor-pointer transition-all duration-300 whitespace-nowrap ${
              activeTab === tab.id ? '!border-primary !text-text-primary bg-bg-secondary rounded-t-sm' : ''
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      <div className="stagger-2">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-8 animate-[fadeIn_0.5s_ease-out_forwards]">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
              <div className="p-6 bg-bg-secondary border border-border rounded-md relative overflow-hidden group">
                <span className="text-xs text-text-secondary font-semibold uppercase tracking-wider mb-2 block">Total Jobs Scraped</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-primary font-headings">{jobsList.length + 1200}</span>
                  <span className="text-[10px] text-success font-bold">+24h Active</span>
                </div>
              </div>
              <div className="p-6 bg-bg-secondary border border-border rounded-md relative overflow-hidden group">
                <span className="text-xs text-text-secondary font-semibold uppercase tracking-wider mb-2 block">Active User Accounts</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-text-primary font-headings">{usersList.length + 477}</span>
                  <span className="text-[10px] text-success font-bold">+18% MoM</span>
                </div>
              </div>
              <div className="p-6 bg-bg-secondary border border-border rounded-md relative overflow-hidden group">
                <span className="text-xs text-text-secondary font-semibold uppercase tracking-wider mb-2 block">Avg. ATS Match Rate</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-text-primary font-headings">68.4%</span>
                  <span className="text-[10px] text-text-tertiary">Global Index</span>
                </div>
              </div>
              <div className="p-6 bg-bg-secondary border border-border rounded-md relative overflow-hidden group">
                <span className="text-xs text-text-secondary font-semibold uppercase tracking-wider mb-2 block">Scraper Status</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-warning font-headings">{isScraping ? 'Scraping' : 'Idle'}</span>
                  <span className="text-[10px] text-text-secondary">CRON setup: OK</span>
                </div>
              </div>
            </div>

            {/* Split Visual Section */}
            <div className="grid grid-cols-[1.5fr_1fr] gap-8 max-lg:grid-cols-1">
              
              {/* Scrape Statistics chart block */}
              <div className="p-8 bg-bg-secondary border border-border rounded-md flex flex-col gap-6">
                <div>
                  <h3 className="text-lg font-bold m-0 text-text-primary">🕷️ Scraped Jobs Distribution</h3>
                  <p className="text-xs text-text-secondary m-0">Percentage breakdown by crawled career platform</p>
                </div>
                
                <div className="flex flex-col gap-4">
                  {[
                    { platform: 'LinkedIn', count: 485, color: '#3ecf8e', percent: 45 },
                    { platform: 'Indeed', count: 320, color: '#3b82f6', percent: 30 },
                    { platform: 'Internshala', count: 160, color: '#f59e0b', percent: 15 },
                    { platform: 'TimesJobs', count: 110, color: '#ef4444', percent: 10 }
                  ].map(item => (
                    <div key={item.platform} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-text-primary flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          {item.platform}
                        </span>
                        <span className="text-text-secondary">{item.count} jobs ({item.percent}%)</span>
                      </div>
                      <div className="h-2 w-full bg-bg-tertiary rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.percent}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scraper Health Info */}
              <div className="p-8 bg-bg-secondary border border-border rounded-md flex flex-col gap-6">
                <div>
                  <h3 className="text-lg font-bold m-0 text-text-primary">🛡️ System Pulse</h3>
                  <p className="text-xs text-text-secondary m-0">Overall server diagnostic health checks</p>
                </div>

                <div className="flex flex-col gap-3.5">
                  <div className="flex justify-between items-center p-3.5 bg-bg-tertiary rounded-sm border border-border">
                    <span className="text-xs font-semibold text-text-primary">Database Sync</span>
                    <span className="badge badge-success text-[10px] font-bold">Healthy</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-bg-tertiary rounded-sm border border-border">
                    <span className="text-xs font-semibold text-text-primary">Groq LLM Pipeline</span>
                    <span className="badge badge-success text-[10px] font-bold">Online</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-bg-tertiary rounded-sm border border-border">
                    <span className="text-xs font-semibold text-text-primary">Scraper Proxy Latency</span>
                    <span className="text-xs font-bold text-primary">124ms</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-bg-tertiary rounded-sm border border-border">
                    <span className="text-xs font-semibold text-text-primary">Storage Quota</span>
                    <span className="text-xs font-bold text-text-secondary">4.2 GB / 20 GB</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: SCRAPER CONTROL & LOGS */}
        {activeTab === 'scraper' && (
          <div className="flex flex-col gap-8 animate-[fadeIn_0.5s_ease-out_forwards]">
            
            <div className="grid grid-cols-[1.2fr_1.8fr] gap-8 max-lg:grid-cols-1">
              {/* Scraper Trigger Card */}
              <div className="p-8 bg-bg-secondary border border-border rounded-md flex flex-col gap-6 h-fit">
                <div>
                  <h3 className="text-lg font-bold m-0 text-text-primary">Manual Scraper Trigger</h3>
                  <p className="text-xs text-text-secondary m-0">Trigger immediate crawler sync for jobs board updates</p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-text-secondary">Crawler Target Platform</label>
                    <select
                      value={activeScrapePlatform}
                      onChange={(e) => setActiveScrapePlatform(e.target.value)}
                      disabled={isScraping}
                      className="w-full cursor-pointer"
                    >
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Indeed">Indeed</option>
                      <option value="Internshala">Internshala</option>
                      <option value="TimesJobs">TimesJobs</option>
                    </select>
                  </div>

                  {isScraping ? (
                    <div className="flex flex-col gap-3 py-2">
                      <div className="flex justify-between text-xs font-semibold text-primary">
                        <span>Running Scrape Task...</span>
                        <span>{scraperProgress}%</span>
                      </div>
                      <div className="w-full bg-bg-tertiary h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full transition-all duration-300" style={{ width: `${scraperProgress}%` }} />
                      </div>
                      <span className="text-[10px] text-text-secondary italic font-mono truncate">{scraperLogMsg}</span>
                    </div>
                  ) : (
                    <button onClick={handleStartScrape} className="btn btn-primary w-full">
                      🚀 Start Scraping Session
                    </button>
                  )}
                </div>

                <hr className="border-border my-0" />

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-3">Target Cron Configuration</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={cronConfig}
                      onChange={(e) => setCronConfig(e.target.value)}
                      placeholder="e.g. 0 */6 * * *"
                      className="grow font-mono"
                    />
                    <button onClick={() => triggerToast("Cron configurations updated!")} className="btn btn-secondary text-xs">
                      Update
                    </button>
                  </div>
                  <span className="text-[10px] text-text-tertiary mt-1 block">Standard 5-field crontab. Current: Every 6 Hours</span>
                </div>
              </div>

              {/* Scraper Runs Log Table */}
              <div className="p-8 bg-bg-secondary border border-border rounded-md flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-bold m-0 text-text-primary">Scrape History Log</h3>
                  <p className="text-xs text-text-secondary m-0">Recent automated and manual scrape session outputs</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border text-text-secondary font-bold">
                        <th className="py-3 px-2">Platform</th>
                        <th className="py-3 px-2">Started At</th>
                        <th className="py-3 px-2">Duration</th>
                        <th className="py-3 px-2">Jobs Found</th>
                        <th className="py-3 px-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logsList.map(log => (
                        <tr key={log.id} className="border-b border-border hover:bg-bg-tertiary transition-colors">
                          <td className="py-3 px-2 font-semibold text-text-primary">{log.platform}</td>
                          <td className="py-3 px-2 text-text-secondary font-mono">{new Date(log.started_at).toLocaleString()}</td>
                          <td className="py-3 px-2 text-text-secondary">{log.duration}</td>
                          <td className="py-3 px-2 font-bold text-text-primary">{log.job_count}</td>
                          <td className="py-3 px-2">
                            <span className={`badge ${
                              log.status === 'completed' ? 'badge-success' : 'badge-error'
                            } text-[9px] font-bold uppercase`}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: JOB LISTINGS */}
        {activeTab === 'jobs' && (
          <div className="flex flex-col gap-6 animate-[fadeIn_0.5s_ease-out_forwards]">
            
            {/* Search & Action Bar */}
            <div className="flex justify-between items-center gap-4 max-md:flex-col max-md:items-stretch">
              <div className="flex gap-4 grow max-md:flex-col">
                <input
                  type="text"
                  placeholder="Search job title, company, or location..."
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  className="grow"
                />
                <select
                  value={jobPlatformFilter}
                  onChange={(e) => setJobPlatformFilter(e.target.value)}
                  className="max-w-[200px] max-md:max-w-none cursor-pointer"
                >
                  <option value="All">All Platforms</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Indeed">Indeed</option>
                  <option value="Internshala">Internshala</option>
                  <option value="TimesJobs">TimesJobs</option>
                </select>
              </div>
              <button onClick={handleOpenAddJob} className="btn btn-primary whitespace-nowrap">
                ➕ Add Job Manually
              </button>
            </div>

            {/* Jobs Management Table */}
            <div className="bg-bg-secondary border border-border rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border text-text-secondary font-bold bg-bg-tertiary">
                      <th className="py-3.5 px-4">Title & Company</th>
                      <th className="py-3.5 px-2">Location</th>
                      <th className="py-3.5 px-2">Experience</th>
                      <th className="py-3.5 px-2">Category</th>
                      <th className="py-3.5 px-2">Platform</th>
                      <th className="py-3.5 px-2">Scraped Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.length > 0 ? (
                      filteredJobs.map(job => (
                        <tr key={job.id} className="border-b border-border hover:bg-bg-tertiary transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-bold text-text-primary text-sm">{job.title}</span>
                              <span className="text-text-secondary text-[11px]">{job.company} • {job.salary}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-2 text-text-secondary">{job.location}</td>
                          <td className="py-3.5 px-2 text-text-secondary">{job.experience}</td>
                          <td className="py-3.5 px-2">
                            <span className="bg-bg-tertiary border border-border px-2 py-0.5 rounded-sm text-[10px] text-text-primary font-semibold">
                              {job.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-2">
                            <span className={`badge ${
                              job.platform === 'LinkedIn' ? 'badge-info' : 'badge-warning'
                            } text-[9px] font-bold uppercase`}>
                              {job.platform}
                            </span>
                          </td>
                          <td className="py-3.5 px-2 text-text-secondary font-mono">
                            {new Date(job.scraped_at).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => handleOpenEditJob(job)} className="p-1 text-primary hover:bg-success-bg border border-transparent hover:border-success-border rounded-sm transition-colors cursor-pointer">
                                ✏️
                              </button>
                              <button onClick={() => handleDeleteJob(job.id)} className="p-1 text-error hover:bg-error-bg border border-transparent hover:border-error-border rounded-sm transition-colors cursor-pointer">
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-8 text-text-tertiary">
                          No jobs match the current filter or search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: USER BASE */}
        {activeTab === 'users' && (
          <div className="flex flex-col gap-6 animate-[fadeIn_0.5s_ease-out_forwards]">
            
            {/* Search Bar */}
            <div className="flex gap-4 items-center">
              <input
                type="text"
                placeholder="Search user by name, email, or targeted role..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="grow"
              />
            </div>

            {/* Users Table */}
            <div className="bg-bg-secondary border border-border rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border text-text-secondary font-bold bg-bg-tertiary">
                      <th className="py-3.5 px-4">User Details</th>
                      <th className="py-3.5 px-2">Role</th>
                      <th className="py-3.5 px-2">Location</th>
                      <th className="py-3.5 px-2">Target Career Role</th>
                      <th className="py-3.5 px-2 text-center">Resumes Uploaded</th>
                      <th className="py-3.5 px-2 text-center">Peak ATS Score</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map(user => (
                        <tr key={user.id} className="border-b border-border hover:bg-bg-tertiary transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-bold text-text-primary text-sm">{user.full_name}</span>
                              <span className="text-text-secondary text-[11px] font-mono">{user.email}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-2">
                            <span className={`badge ${
                              user.role === 'admin' ? 'badge-error' : 'badge-info'
                            } text-[9px] font-bold uppercase`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-2 text-text-secondary">{user.location}</td>
                          <td className="py-3.5 px-2 text-text-secondary font-semibold">{user.target_role}</td>
                          <td className="py-3.5 px-2 text-center font-bold text-text-primary">{user.resume_analysed}</td>
                          <td className="py-3.5 px-2 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                              user.match_score >= 70 ? 'bg-success-bg text-success border-success-border' : 'bg-warning-bg text-warning border-warning-border'
                            }`}>
                              {user.match_score}%
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => setSelectedUser(user)} className="btn btn-secondary btn-sm px-2" title="View Full Details">
                                🔍 View
                              </button>
                              <button onClick={() => handleToggleUserRole(user.id)} className="btn btn-ghost btn-sm px-2 hover:text-warning" title="Toggle Role">
                                🛡️ Role
                              </button>
                              <button onClick={() => handleDeleteUser(user.id)} className="p-1 text-error hover:bg-error-bg border border-transparent hover:border-error-border rounded-sm transition-colors cursor-pointer" title="Delete User">
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-8 text-text-tertiary">
                          No users matching search filters found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: SYSTEM CONFIG */}
        {activeTab === 'config' && (
          <div className="grid grid-cols-2 gap-8 max-lg:grid-cols-1 animate-[fadeIn_0.5s_ease-out_forwards]">
            
            {/* LLM Engine Configurations */}
            <div className="p-8 bg-bg-secondary border border-border rounded-md flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-bold m-0 text-text-primary">LLM Reasoning API Configuration</h3>
                <p className="text-xs text-text-secondary m-0">Setup target models and API gateways for resumes parsing</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text-secondary">Model Endpoint Provider</label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="cursor-pointer"
                  >
                    <option value="llama-3.1-70b-versatile">Groq: Llama 3.1 70B (Versatile)</option>
                    <option value="llama-3.1-8b-instant">Groq: Llama 3.1 8B (Instant)</option>
                    <option value="gemini-1.5-pro">Google: Gemini 1.5 Pro</option>
                    <option value="gpt-4o">OpenAI: GPT-4o Engine</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text-secondary">API Authorization Key</label>
                  <div className="flex gap-2">
                    <input
                      type={isKeyEditing ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      disabled={!isKeyEditing}
                      className="grow font-mono"
                    />
                    {isKeyEditing ? (
                      <button onClick={() => { setIsKeyEditing(false); triggerToast("API Key updated locally!"); }} className="btn btn-primary text-xs">
                        Save
                      </button>
                    ) : (
                      <button onClick={() => setIsKeyEditing(true)} className="btn btn-secondary text-xs">
                        Change
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-text-tertiary">Required key to run backend keyword mapping extraction</span>
                </div>
              </div>
            </div>

            {/* Platform Crawlers Toggle */}
            <div className="p-8 bg-bg-secondary border border-border rounded-md flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-bold m-0 text-text-primary">Platforms Scraper Settings</h3>
                <p className="text-xs text-text-secondary m-0">Toggle which external job platforms are crawled by CRON tasks</p>
              </div>

              <div className="flex flex-col gap-3.5">
                {Object.keys(platformsConfig).map(platform => (
                  <label key={platform} className="flex justify-between items-center p-3 bg-bg-tertiary border border-border rounded-sm cursor-pointer hover:border-primary/20 transition-all select-none">
                    <span className="text-xs font-semibold text-text-primary">{platform}</span>
                    <input
                      type="checkbox"
                      checked={platformsConfig[platform]}
                      onChange={(e) => {
                        const updated = { ...platformsConfig, [platform]: e.target.checked };
                        setPlatformsConfig(updated);
                        triggerToast(`Scraper for ${platform} ${e.target.checked ? 'Enabled' : 'Disabled'}`);
                      }}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Quick Actions & Maintenance */}
            <div className="p-8 bg-bg-secondary border border-border rounded-md flex flex-col gap-4 col-span-2 max-lg:col-span-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary m-0">System Diagnostic Operations</h3>
              <div className="grid grid-cols-3 gap-4 mt-2 max-md:grid-cols-1">
                <button onClick={() => triggerToast("All temporary cache files cleared!")} className="btn btn-secondary py-3 text-xs flex items-center justify-center gap-1.5">
                  🧹 Clear System Cache
                </button>
                <button onClick={() => triggerToast("Mock database backup generated in backend/data/backups/ !")} className="btn btn-secondary py-3 text-xs flex items-center justify-center gap-1.5">
                  💾 Backup SQLite Database
                </button>
                <button onClick={() => triggerToast("Triggering full platform recrawl check...")} className="btn btn-primary py-3 text-xs flex items-center justify-center gap-1.5">
                  🔄 Recrawl Unmapped Jobs
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* MODAL 1: ADD/EDIT JOB */}
      {isJobModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex justify-center items-center p-6">
          <div className="bg-bg-secondary border border-border rounded-md max-w-[500px] w-full p-8 relative flex flex-col gap-6 animate-[scaleIn_0.25s_ease-out_forwards] max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-xl font-bold font-headings text-text-primary m-0">
                {currentJob ? '✏️ Edit Scraped Job listing' : '➕ Create Manual Job listing'}
              </h3>
              <p className="text-xs text-text-secondary m-0">Configure fields for rendering on user career portals</p>
            </div>

            <form onSubmit={handleSaveJob} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Job Title</label>
                <input
                  type="text"
                  required
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  placeholder="e.g. Lead React Developer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Company Name</label>
                  <input
                    type="text"
                    required
                    value={jobForm.company}
                    onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                    placeholder="e.g. Razorpay"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Location</label>
                  <input
                    type="text"
                    required
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    placeholder="e.g. Remote"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Category Group</label>
                  <select
                    value={jobForm.category}
                    onChange={(e) => setJobForm({ ...jobForm, category: e.target.value })}
                    className="cursor-pointer"
                  >
                    <option value="React Developer">React Developer</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="Data Scientist">Data Scientist</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Scraping Platform Source</label>
                  <select
                    value={jobForm.platform}
                    onChange={(e) => setJobForm({ ...jobForm, platform: e.target.value })}
                    className="cursor-pointer"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Indeed">Indeed</option>
                    <option value="Internshala">Internshala</option>
                    <option value="TimesJobs">TimesJobs</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Salary Range</label>
                  <input
                    type="text"
                    value={jobForm.salary}
                    onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                    placeholder="e.g. ₹8L - ₹12L"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Experience Requirement</label>
                  <select
                    value={jobForm.experience}
                    onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                    className="cursor-pointer"
                  >
                    <option value="Fresher">Fresher</option>
                    <option value="1-3 Years">1-3 Years</option>
                    <option value="3-5 Years">3-5 Years</option>
                    <option value="5+ Years">5+ Years</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Source Application URL</label>
                <input
                  type="url"
                  required
                  value={jobForm.link}
                  onChange={(e) => setJobForm({ ...jobForm, link: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsJobModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: USER PROFILE DETAILS */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex justify-center items-center p-6">
          <div className="bg-bg-secondary border border-border rounded-md max-w-[550px] w-full p-8 relative flex flex-col gap-6 animate-[scaleIn_0.25s_ease-out_forwards] max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-start border-b border-border pb-4">
              <div>
                <h3 className="text-xl font-bold font-headings text-text-primary m-0">{selectedUser.full_name}</h3>
                <span className="text-xs text-text-secondary font-mono">{selectedUser.email}</span>
              </div>
              <span className={`badge ${
                selectedUser.role === 'admin' ? 'badge-error' : 'badge-info'
              } text-[10px] font-bold uppercase`}>
                {selectedUser.role}
              </span>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-bg-tertiary p-3 rounded-sm border border-border">
                  <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider block mb-1">Target role</span>
                  <span className="text-text-primary font-bold">{selectedUser.target_role}</span>
                </div>
                <div className="bg-bg-tertiary p-3 rounded-sm border border-border">
                  <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider block mb-1">Location</span>
                  <span className="text-text-primary font-bold">{selectedUser.location}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider block mb-1.5">Profile Description</span>
                <p className="text-text-primary bg-bg-tertiary p-3 border border-border rounded-sm m-0 leading-relaxed">
                  {selectedUser.description}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider block mb-1.5">Skills Matrix ({selectedUser.skills.length})</span>
                <div className="flex flex-wrap gap-1.5 bg-bg-tertiary p-3 border border-border rounded-sm">
                  {selectedUser.skills.map(s => (
                    <span key={s} className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-sm font-bold uppercase text-[9px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-border pt-4 mt-2">
                <div className="flex gap-2">
                  <a href={selectedUser.github} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-bg-tertiary border border-border rounded-sm hover:border-primary/20 transition-all text-xs">
                    💻 GitHub
                  </a>
                  <a href={selectedUser.linkedin} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-bg-tertiary border border-border rounded-sm hover:border-primary/20 transition-all text-xs">
                    👔 LinkedIn
                  </a>
                </div>
                <button onClick={() => setSelectedUser(null)} className="btn btn-primary btn-sm px-4">
                  Close details
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
