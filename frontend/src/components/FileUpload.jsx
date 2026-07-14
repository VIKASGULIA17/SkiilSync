import { useState, useRef } from 'react';

export default function FileUpload({ onAnalyze, isAnalyzing }) {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  function validateFile(f) {
    if (!f) return false;
    const ext = f.name.split('.').pop().toLowerCase();
    
    if (!['pdf', 'docx', 'doc', 'txt'].includes(ext)) {
      setError('Please upload a PDF, DOCX, DOC, or TXT file only.');
      setFile(null);
      return false;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB.');
      setFile(null);
      return false;
    }
    setError('');
    return true;
  }

  function handleFileChange(e) {
    const f = e.target.files[0];
    if (f && validateFile(f)) {
      setFile(f);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && validateFile(f)) {
      setFile(f);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setDragOver(false);
  }

  function handleAnalyzeFile() {
    if (file && onAnalyze) {
      onAnalyze(file);
    }
  }

  function handleClear(e) {
    e.stopPropagation();
    setFile(null);
    setError('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }

  // Compile zone classes for drag-drop
  let zoneClasses = "relative border border-border rounded-md py-12 px-6 text-center cursor-pointer transition-all duration-500 bg-bg-secondary overflow-hidden hover:border-primary hover:bg-bg-card-hover";
  if (dragOver) zoneClasses += " !border-primary !bg-bg-input-focus";
  if (file) zoneClasses += " !border-success !bg-success-bg";
  if (error) zoneClasses += " !border-error !bg-error-bg";

  return (
    <div className="mb-6 w-full flex flex-col">
      <div
        className={zoneClasses}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
          onChange={handleFileChange}
          disabled={isAnalyzing}
        />
        <div className="relative z-0 pointer-events-none flex flex-col items-center">
          {file ? (
            <>
              <span className="text-4xl mb-2 block">📄</span>
              <p className="text-base font-semibold font-headings text-text-primary mb-1">Document Selected</p>
              <div className="inline-flex items-center gap-2 py-2 px-4 bg-success-bg border border-success-border rounded-full text-sm font-medium text-success mt-4">
                📎 {file.name}
              </div>
              <div className="mt-3">
                <button
                  className="px-3 py-1 text-xs font-semibold rounded-sm bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-secondary border border-transparent transition-all duration-300 pointer-events-auto relative z-20"
                  onClick={handleClear}
                  disabled={isAnalyzing}
                >
                  Change file
                </button>
              </div>
            </>
          ) : (
            <>
              <span className="text-4xl mb-2 block">☁️</span>
              <p className="text-base font-semibold font-headings text-text-primary mb-1">
                {dragOver ? 'Drop your file here' : 'Upload Resume Document'}
              </p>
              <p className="text-sm text-text-tertiary m-0">
                Drag & drop a PDF, DOCX, DOC, or TXT file here, or click to browse
              </p>
            </>
          )}
          {error && <p className="text-sm text-error mt-2 font-medium">{error}</p>}
        </div>
      </div>

      {file && (
        <div className="mt-6 flex justify-center animate-[slideUp_0.95s_cubic-bezier(0.22,1,0.36,1)_forwards]">
          <button
            className="px-10 py-3 text-base min-w-[200px] btn btn-primary"
            onClick={handleAnalyzeFile}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                Analyzing
                <span className="inline-flex gap-1 ml-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-text-inverse animate-[pulse_1.4s_ease-in-out_infinite]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-text-inverse animate-[pulse_1.4s_ease-in-out_infinite] [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-text-inverse animate-[pulse_1.4s_ease-in-out_infinite] [animation-delay:0.4s]" />
                </span>
              </>
            ) : (
              <>🔍 Analyze Document</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
