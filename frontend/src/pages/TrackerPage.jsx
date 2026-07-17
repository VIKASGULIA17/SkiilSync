import { useState, useEffect } from 'react';
import ErrorBanner from '../components/ErrorBanner';

export default function TrackerPage() {
  const [applications, setApplications] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('wishlist');
  const [error, setError] = useState(null);

  // Form states for manual additions
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newSalary, setNewSalary] = useState('');
  const [newLink, setNewLink] = useState('');

  const columns = [
    { 
      id: 'wishlist', 
      title: 'Wishlist', 
      color: 'border-t-[#a855f7]/60',
      icon: (
        <svg className="w-3.5 h-3.5 text-[#a855f7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
    },
    { 
      id: 'applied', 
      title: 'Applied', 
      color: 'border-t-[#3b82f6]/60',
      icon: (
        <svg className="w-3.5 h-3.5 text-[#3b82f6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      )
    },
    { 
      id: 'interviewing', 
      title: 'Interview', 
      color: 'border-t-[#eab308]/60',
      icon: (
        <svg className="w-3.5 h-3.5 text-[#eab308]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
    { 
      id: 'offered', 
      title: 'Offered', 
      color: 'border-t-[#22c55e]/60',
      icon: (
        <svg className="w-3.5 h-3.5 text-[#22c55e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      )
    },
    { 
      id: 'rejected', 
      title: 'Archive', 
      color: 'border-t-[#ef4444]/60',
      icon: (
        <svg className="w-3.5 h-3.5 text-[#ef4444]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      )
    }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('tracked_applications');
    if (saved) {
      setApplications(JSON.parse(saved));
    }
  }, []);

  const saveApplications = (updated) => {
    setApplications(updated);
    localStorage.setItem('tracked_applications', JSON.stringify(updated));
  };

  const moveApp = (id, newStatus) => {
    const updated = applications.map(app => {
      if (app.id === id) {
        return { ...app, status: newStatus };
      }
      return app;
    });
    saveApplications(updated);
  };

  const deleteApp = (id) => {
    const updated = applications.filter(app => app.id !== id);
    saveApplications(updated);
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    moveApp(id, targetStatus);
  };

  const handleAddApp = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCompany.trim()) {
      setError('Job Title and Company are required.');
      return;
    }

    const newApp = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      title: newTitle.trim(),
      company: newCompany.trim(),
      location: newLocation.trim(),
      salary: newSalary.trim(),
      link: newLink.trim(),
      platform: 'Manual Input',
      status: 'wishlist',
      date: new Date().toISOString()
    };

    saveApplications([...applications, newApp]);

    setNewTitle('');
    setNewCompany('');
    setNewLocation('');
    setNewSalary('');
    setNewLink('');
    setShowAddForm(false);
    setError(null);
  };

  // Monogram color builder based on company name
  const getInitialsColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      'bg-purple-900/20 text-purple-300 border-purple-800/40',
      'bg-blue-900/20 text-blue-300 border-blue-800/40',
      'bg-emerald-900/20 text-emerald-300 border-emerald-800/40',
      'bg-amber-900/20 text-amber-300 border-amber-800/40',
      'bg-indigo-900/20 text-indigo-300 border-indigo-800/40',
      'bg-rose-900/20 text-rose-300 border-rose-800/40'
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  // Card component renderer
  const renderCard = (app) => (
    <div 
      key={app.id} 
      className="p-3.5 rounded bg-white/[0.02] border border-white/[0.06] hover:border-primary/40 hover:bg-white/[0.04] transition-all duration-300 flex flex-col gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:cursor-grabbing cursor-grab relative group"
      draggable
      onDragStart={(e) => handleDragStart(e, app.id)}
    >
      {/* Top row: Monogram, Title, Company and Delete */}
      <div className="flex justify-between items-start gap-2 w-full">
        <div className="flex items-center gap-2 overflow-hidden grow">
          <div className={`w-6 h-6 rounded border flex items-center justify-center text-[10px] font-bold font-mono uppercase shrink-0 ${getInitialsColor(app.company)}`}>
            {app.company.slice(0, 2)}
          </div>
          <div className="overflow-hidden grow">
            <h3 className="text-xs font-bold text-text-primary m-0 leading-tight truncate" title={app.title}>{app.title}</h3>
            <p className="text-[10px] text-text-secondary font-medium m-0 truncate mt-0.5">{app.company}</p>
          </div>
        </div>
        <button 
          className="bg-transparent text-text-tertiary hover:text-error cursor-pointer border-none p-0 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" 
          onClick={() => deleteApp(app.id)}
          title="Delete application record"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Middle row: Compact inline metadata text */}
      {(app.location || app.salary) && (
        <div className="text-[9px] font-mono text-text-tertiary truncate w-full" title={`${app.location || ''} ${app.salary ? '· ' + app.salary : ''}`}>
          {app.location && <span>{app.location}</span>}
          {app.location && app.salary && <span className="mx-1">·</span>}
          {app.salary && <span>{app.salary}</span>}
        </div>
      )}

      {/* Footer row: compact Details link and Move dropdown */}
      <div className="mt-1 pt-2 border-t border-white/[0.04] flex justify-between items-center w-full">
        <span className="text-[8px] font-mono text-text-tertiary uppercase tracking-wider bg-white/[0.03] px-1 rounded truncate max-w-[70px]" title={app.platform}>
          {app.platform}
        </span>
        
        <div className="flex items-center gap-2">
          {app.link && (
            <a 
              href={app.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[9px] text-primary hover:text-primary-hover font-bold flex items-center gap-0.5 no-underline shrink-0"
            >
              Details ↗
            </a>
          )}
          <select 
            value={app.status} 
            onChange={(e) => moveApp(app.id, e.target.value)}
            className="px-1 py-0.2 rounded text-[8px] bg-bg-tertiary border border-border outline-none text-text-secondary cursor-pointer hover:border-primary transition-colors font-mono max-w-[85px]"
          >
            <option value="wishlist">Wishlist</option>
            <option value="applied">Applied</option>
            <option value="interviewing">Interview</option>
            <option value="offered">Offered</option>
            <option value="rejected">Archive</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 page-wrapper mx-auto max-w-[1200px] w-full px-6 md:px-8">
      {error && <ErrorBanner message={error} onClose={() => setError(null)} />}

      {/* Header section */}
      <div className="border-b border-border/80 pb-6 flex justify-between items-end max-md:flex-col max-md:items-start max-md:gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-widest font-bold text-primary font-mono">Workflow Management</span>
          <h1 className="text-3xl font-extrabold font-headings text-text-primary tracking-tight m-0 leading-none">Application Tracker</h1>
          <p className="text-text-secondary text-sm m-0 max-w-[60ch]">Organise your job search funnel. Drag cards or select options to update statuses.</p>
        </div>
        
        <button 
          className="btn btn-secondary text-sm font-sans flex items-center gap-2 border border-border hover:border-primary transition-all duration-300 max-md:w-full"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Close Funnel Form' : '+ Add Custom Application'}
        </button>
      </div>

      {/* Form */}
      {showAddForm && (
        <form onSubmit={handleAddApp} className="p-8 bg-bg-secondary border border-border rounded-md animate-[slideUp_0.25s_cubic-bezier(0.22,1,0.36,1)_forwards]">
          <h3 className="text-base font-bold text-text-primary mb-6">New Application Record</h3>
          <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider font-mono">Job Title *</label>
              <input 
                type="text" 
                placeholder="e.g. Lead Software Engineer" 
                value={newTitle} 
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full p-2.5 bg-bg-input border border-border rounded-sm text-sm text-text-primary focus:border-primary outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider font-mono">Company *</label>
              <input 
                type="text" 
                placeholder="e.g. Anthropic" 
                value={newCompany} 
                onChange={(e) => setNewCompany(e.target.value)}
                required
                className="w-full p-2.5 bg-bg-input border border-border rounded-sm text-sm text-text-primary focus:border-primary outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider font-mono">Location</label>
              <input 
                type="text" 
                placeholder="e.g. London / Remote" 
                value={newLocation} 
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full p-2.5 bg-bg-input border border-border rounded-sm text-sm text-text-primary focus:border-primary outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider font-mono">Compensation / Salary</label>
              <input 
                type="text" 
                placeholder="e.g. £90,000 /year" 
                value={newSalary} 
                onChange={(e) => setNewSalary(e.target.value)}
                className="w-full p-2.5 bg-bg-input border border-border rounded-sm text-sm text-text-primary focus:border-primary outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2 col-span-2 max-sm:col-span-1">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider font-mono">Listing Link / URL</label>
              <input 
                type="url" 
                placeholder="https://..." 
                value={newLink} 
                onChange={(e) => setNewLink(e.target.value)}
                className="w-full p-2.5 bg-bg-input border border-border rounded-sm text-sm text-text-primary focus:border-primary outline-none transition-colors"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-6">Create Record</button>
        </form>
      )}

      {/* Mobile/Tablet Tab Selector: Shows only on width < 1024px */}
      <div className="hidden max-lg:flex justify-between items-center bg-bg-secondary border border-border p-1.5 rounded-md overflow-x-auto gap-1">
        {columns.map((col) => {
          const colApps = applications.filter(app => app.status === col.id);
          const isActive = activeTab === col.id;
          return (
            <button
              key={col.id}
              onClick={() => setActiveTab(col.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-sm text-xs font-semibold whitespace-nowrap grow justify-center transition-all cursor-pointer ${
                isActive 
                  ? 'bg-bg-tertiary text-text-primary border-b-2 border-primary' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/50'
              }`}
            >
              {col.icon}
              <span className="font-mono uppercase text-[10px] tracking-wider">{col.title}</span>
              <span className="text-[10px] bg-white/5 text-text-secondary px-1.5 py-0.2 rounded-full font-mono">{colApps.length}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop Kanban Board: Shows on width >= 1024px */}
      <div className="grid grid-cols-5 gap-5 items-start min-h-[520px] pb-6 max-lg:hidden">
        {columns.map((col) => {
          const colApps = applications.filter(app => app.status === col.id);
          
          return (
            <div 
              key={col.id} 
              className={`min-h-[480px] p-4 rounded-md bg-bg-secondary border border-border flex flex-col gap-4 border-t-4 ${col.color}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className="flex justify-between items-center w-full border-b border-border/40 pb-2">
                <div className="flex items-center gap-2">
                  {col.icon}
                  <h3 className="text-xs font-bold text-text-primary tracking-wider uppercase font-mono">{col.title}</h3>
                </div>
                <span className="text-[10px] font-bold bg-bg-tertiary text-text-secondary px-2.5 py-0.5 rounded-full font-mono">{colApps.length}</span>
              </div>

              <div className="flex flex-col gap-3 grow">
                {colApps.length > 0 ? (
                  colApps.map(renderCard)
                ) : (
                  <div className="flex items-center justify-center grow text-[10px] font-mono tracking-wider text-text-tertiary border border-dashed border-white/5 rounded-md min-h-[100px]">
                    Drag cards here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile/Tablet Single Column: Shows only on width < 1024px */}
      <div className="lg:hidden flex flex-col gap-4 min-h-[400px]">
        {columns.filter(col => col.id === activeTab).map((col) => {
          const colApps = applications.filter(app => app.status === col.id);
          
          return (
            <div 
              key={col.id} 
              className={`p-5 rounded-md bg-bg-secondary border border-border flex flex-col gap-4 border-t-4 w-full ${col.color}`}
            >
              <div className="flex justify-between items-center w-full border-b border-border/40 pb-2">
                <div className="flex items-center gap-2">
                  {col.icon}
                  <h3 className="text-xs font-bold text-text-primary tracking-wider uppercase font-mono">{col.title}</h3>
                </div>
                <span className="text-[10px] font-bold bg-bg-tertiary text-text-secondary px-2.5 py-0.5 rounded-full font-mono">{colApps.length}</span>
              </div>

              <div className="flex flex-col gap-3 w-full">
                {colApps.length > 0 ? (
                  colApps.map(renderCard)
                ) : (
                  <div className="flex items-center justify-center py-16 text-[11px] font-mono tracking-wider text-text-tertiary border border-dashed border-white/5 rounded-md">
                    No records in this stage.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
