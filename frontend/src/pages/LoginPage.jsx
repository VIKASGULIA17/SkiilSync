import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect path after logging in
  const from = location.state?.from?.pathname || "/";

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError('');

    if (!email.trim() || !password) {
      setLocalError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setLocalError(err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] page-wrapper px-4 bg-gradient-to-b from-bg-primary via-bg-primary to-bg-secondary">
      <div className="w-full max-w-[420px] bg-bg-secondary border border-border p-8 rounded-lg shadow-2xl relative overflow-hidden animate-[scaleIn_0.85s_cubic-bezier(0.22,1,0.36,1)_forwards]">
        {/* Colorful gradient strip at the top */}
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-primary to-secondary"></div>

        <div className="text-center mb-8">
          {/* Small decorative logo icon */}
          <div className="w-12 h-12 mx-auto mb-4 bg-success-bg border border-success-border rounded-full flex items-center justify-center text-xl">
            🔑
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary mb-2">Welcome Back</h2>
          <p className="text-sm text-text-secondary">Sign in to resume analysis & job matching</p>
        </div>

        {localError && (
          <div className="mb-6 p-4 bg-error-bg border border-error-border rounded-md text-error text-xs font-medium flex items-center gap-2 animate-[slideDown_0.3s_ease-out]">
            <span>⚠️</span>
            <span className="flex-1">{localError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-secondary" htmlFor="email-input">
              Email Address
            </label>
            <input
              id="email-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-secondary" htmlFor="password-input">
              Password
            </label>
            <input
              id="password-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full py-3 mt-2 text-sm shadow-md shadow-success/15"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-text-inverse border-t-transparent rounded-full animate-spin"></span>
                Signing In...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-text-secondary m-0">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline font-semibold transition-colors duration-300">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
