import { useState } from 'react';

export default function ErrorBanner({ message, onRetry, onDismiss }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !message) return null;

  function handleDismiss() {
    setDismissed(true);
    if (onDismiss) onDismiss();
  }

  return (
    <div className="flex items-start gap-4 p-4 bg-error-bg border border-error-border rounded-sm animate-[slideDown_0.3s_ease_forwards] mb-6">
      <span className="text-lg shrink-0 leading-[1.4]">⚠️</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-error font-medium m-0 break-words leading-6">{message}</p>
        {onRetry && (
          <div className="flex gap-2 mt-2">
            <button
              className="bg-error/15 text-error border border-error-border px-3 py-1 rounded-sm text-xs font-semibold cursor-pointer transition-all duration-150 hover:bg-error/25"
              onClick={onRetry}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
      <button
        className="shrink-0 w-7 h-7 flex items-center justify-center bg-transparent text-error border-none rounded-sm cursor-pointer text-base opacity-70 transition-all duration-150 hover:opacity-100 hover:bg-error/15"
        onClick={handleDismiss}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
