import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const { user, logout } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  function handleLinkClick() {
    setMenuOpen(false);
  }

  function handleLogout() {
    logout();
    handleLinkClick();
  }

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

  return (
    <nav className="fixed top-0 left-0 right-0 h-[64px] bg-bg-secondary border-b border-border z-[1000] flex items-center transition-colors duration-500">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 w-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline text-xl font-extrabold tracking-tight" onClick={handleLinkClick}>
          <div className="w-8 h-8 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="origin-[12px_12px] animate-[spin_12s_linear_infinite]" d="M12 3a9 9 0 0 1 9 9 9 9 0 0 1-9 9" stroke="url(#nav-grad-1)" strokeWidth="2.5" strokeLinecap="round" />
              <path className="origin-[12px_12px] animate-[spin_8s_linear_infinite_reverse]" d="M12 21a9 9 0 0 1-9-9 9 9 0 0 1 9-9" stroke="url(#nav-grad-2)" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="12" cy="12" r="2.5" fill="currentColor" style={{ color: 'var(--color-primary)' }} />
              <defs>
                <linearGradient id="nav-grad-1" x1="12" y1="3" x2="21" y2="12" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3ecf8e" />
                  <stop offset="100%" stopColor="#04b275" />
                </linearGradient>
                <linearGradient id="nav-grad-2" x1="12" y1="21" x2="3" y2="12" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#2e2e2e" />
                  <stop offset="100%" stopColor="#3ecf8e" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="font-headings font-bold text-text-primary tracking-tight transition-colors duration-500">SkillSync</span>
        </Link>

        <button
          className="hidden max-md:flex flex-col justify-center gap-[5px] w-9 h-9 p-1.5 bg-transparent border-none cursor-pointer rounded-sm transition-colors duration-300 hover:bg-bg-tertiary z-[1001]"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className={`block w-full h-[2px] bg-text-secondary rounded-sm transition-all duration-300 ${menuOpen ? 'rotate-45 translate-x-[5px] translate-y-[5px] !bg-text-primary' : ''}`} />
          <span className={`block w-full h-[2px] bg-text-secondary rounded-sm transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-full h-[2px] bg-text-secondary rounded-sm transition-all duration-300 ${menuOpen ? '-rotate-45 translate-x-[5px] -translate-y-[5px] !bg-text-primary' : ''}`} />
        </button>

        <div className={`flex items-center gap-1 transition-transform duration-500 max-md:fixed max-md:top-0 max-md:right-0 max-md:bottom-0 max-md:w-[280px] max-md:h-screen max-md:flex-col max-md:bg-bg-secondary max-md:border-l max-md:border-border max-md:pt-[104px] max-md:px-6 max-md:pb-6 max-md:gap-2 max-md:z-[1000] max-md:shadow-2xl max-md:items-stretch ${menuOpen ? 'max-md:translate-x-0' : 'max-md:translate-x-full'}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all duration-300 relative ${isActive ? 'text-text-primary bg-bg-tertiary border-b-2 border-primary md:rounded-b-none max-md:border-b-0 max-md:border-l-2 max-md:rounded-l-none' : ''}`}
            onClick={handleLinkClick}
          >
            <span className="text-sm leading-none">🏠</span>
            Home
          </NavLink>
          <NavLink
            to="/analyze"
            className={({ isActive }) => `flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all duration-300 relative ${isActive ? 'text-text-primary bg-bg-tertiary border-b-2 border-primary md:rounded-b-none max-md:border-b-0 max-md:border-l-2 max-md:rounded-l-none' : ''}`}
            onClick={handleLinkClick}
          >
            <span className="text-sm leading-none">🔍</span>
            Analyze
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all duration-300 relative ${isActive ? 'text-text-primary bg-bg-tertiary border-b-2 border-primary md:rounded-b-none max-md:border-b-0 max-md:border-l-2 max-md:rounded-l-none' : ''}`}
            onClick={handleLinkClick}
          >
            <span className="text-sm leading-none">📈</span>
            Dashboard
          </NavLink>
          <NavLink
            to="/tracker"
            className={({ isActive }) => `flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all duration-300 relative ${isActive ? 'text-text-primary bg-bg-tertiary border-b-2 border-primary md:rounded-b-none max-md:border-b-0 max-md:border-l-2 max-md:rounded-l-none' : ''}`}
            onClick={handleLinkClick}
          >
            <span className="text-sm leading-none">📋</span>
            Tracker
          </NavLink>
          <NavLink
            to="/jobs"
            className={({ isActive }) => `flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all duration-300 relative ${isActive ? 'text-text-primary bg-bg-tertiary border-b-2 border-primary md:rounded-b-none max-md:border-b-0 max-md:border-l-2 max-md:rounded-l-none' : ''}`}
            onClick={handleLinkClick}
          >
            <span className="text-sm leading-none">💼</span>
            Jobs
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) => `flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all duration-300 relative ${isActive ? 'text-text-primary bg-bg-tertiary border-b-2 border-primary md:rounded-b-none max-md:border-b-0 max-md:border-l-2 max-md:rounded-l-none' : ''}`}
            onClick={handleLinkClick}
          >
            <span className="text-sm leading-none">⚙️</span>
            Settings
          </NavLink>

          {user ? (
            <>
              <Link 
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 border-l border-border max-md:border-l-0 max-md:border-t max-md:pt-4 max-md:mt-2 hover:bg-bg-tertiary rounded-sm transition-all duration-300 no-underline cursor-pointer"
                onClick={handleLinkClick}
              >
                <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                  {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
                </div>
                <span className="text-sm font-medium text-text-primary truncate max-w-[120px] max-md:max-w-none">
                  {user.full_name}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-medium text-error hover:bg-error-bg transition-all duration-300 border border-transparent cursor-pointer"
              >
                <span className="text-sm leading-none">🚪</span>
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary btn-sm ml-2 max-md:ml-0 max-md:mt-4 text-center cursor-pointer"
              onClick={handleLinkClick}
            >
              Sign In
            </Link>
          )}

          <button
            className="w-9 h-9 rounded-sm bg-transparent text-text-secondary flex items-center justify-center transition-all duration-300 border border-transparent hover:text-text-primary hover:bg-bg-tertiary hover:border-border max-md:ml-0 max-md:mt-2 max-md:w-full max-md:h-[42px] max-md:border-border max-md:bg-bg-tertiary"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
            ) : (
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
              </svg>
            )}
          </button>
        </div>
      </div>
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] transition-opacity duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setMenuOpen(false)} />
    </nav>
  );
}
