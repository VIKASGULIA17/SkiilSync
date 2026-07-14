import { useState, useEffect } from 'react';
import { getApiKeyStatus, setApiKey } from '../api/client';
import ErrorBanner from '../components/ErrorBanner';

export default function SettingsPage() {
  const [apiKey, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    loadApiKeyStatus();
  }, []);

  const loadApiKeyStatus = async () => {
    setLoading(true);
    try {
      const data = await getApiKeyStatus();
      setIsConfigured(data.configured || false);
    } catch (err) {
      setError('Could not connect to backend server. Make sure FastAPI is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('API key cannot be empty.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await setApiKey(apiKey.trim());
      if (result.valid) {
        setIsConfigured(true);
        setSuccessMessage('Groq API Key configured and validated successfully!');
        setApiKeyInput('');
      } else {
        setError(result.message || 'API key validation failed. Please check the key.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while validating the API key.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 page-wrapper mx-auto max-w-[760px] w-full px-6 md:px-8">
      {error && <ErrorBanner message={error} onClose={() => setError(null)} />}
      
      {successMessage && (
        <div className="p-4 bg-success-bg border border-success-border rounded-sm mb-2 text-success font-medium text-sm animate-[slideUp_0.95s_cubic-bezier(0.22,1,0.36,1)_forwards]">
          <p className="m-0">✅ {successMessage}</p>
        </div>
      )}

      <div className="border-b border-border pb-4 mb-4">
        <h1 className="text-3xl font-bold font-headings">Settings</h1>
        <p className="text-text-secondary text-sm">Configure external API integrations and parameters</p>
      </div>

      <div className="p-8 flex flex-col gap-4 mb-6 bg-bg-secondary border border-border rounded-md animate-[scaleIn_0.85s_cubic-bezier(0.22,1,0.36,1)_forwards]">
        <div className="flex justify-between items-center border-b border-border pb-4">
          <span className="font-bold text-lg font-headings text-text-primary">Groq AI Integration</span>
          
          {loading ? (
            <span className="badge badge-info">Checking...</span>
          ) : isConfigured ? (
            <span className="badge badge-success">● API Key Configured</span>
          ) : (
            <span className="badge badge-warning">● API Key Required</span>
          )}
        </div>

        <p className="text-sm text-text-secondary leading-relaxed">
          SkillSync uses the <strong className="text-text-primary">Groq API</strong> with the <strong className="text-text-primary">Llama 4 Scout</strong> model to generate 
          personalized, high-quality skill-gap feedback and career study paths.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="api-key-input" className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Enter Groq API Key
            </label>
            <div className="flex gap-4">
              <input
                id="api-key-input"
                type={showKey ? 'text' : 'password'}
                placeholder={isConfigured ? '••••••••••••••••••••••••••••••••' : 'gsk_...'}
                value={apiKey}
                onChange={(e) => setApiKeyInput(e.target.value)}
                disabled={saving}
                className="grow"
              />
              <button
                type="button"
                className="whitespace-nowrap btn btn-secondary"
                onClick={() => setShowKey(!showKey)}
                tabIndex="-1"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-[11px] text-text-tertiary mt-1">
              Key is validated directly with Groq on save, and held securely in server memory. It is never stored permanently.
            </p>
          </div>

          <button
            type="submit"
            className="self-start btn btn-primary"
            disabled={saving || !apiKey}
          >
            {saving ? 'Validating Key...' : 'Test & Save Config'}
          </button>
        </form>
      </div>

      <div className="p-8 bg-bg-secondary border border-border rounded-md stagger-1">
        <h3 className="text-lg font-bold mb-4 font-headings">How to get a free Groq API Key</h3>
        <ol className="pl-6 text-text-secondary flex flex-col gap-2 text-sm list-decimal">
          <li>
            Go to the official <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Groq Developer Console</a>.
          </li>
          <li>Log in or sign up for a free developer account.</li>
          <li>Click on the <strong>"Create API Key"</strong> button.</li>
          <li>Name the key (e.g. "SkillSync") and copy it.</li>
          <li>Paste the key in the input form above and click Save.</li>
        </ol>
      </div>
    </div>
  );
}
