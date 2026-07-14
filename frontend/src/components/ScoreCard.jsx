import { useEffect, useState } from 'react';

export default function ScoreCard({ score, roleName }) {
  const [animatedOffset, setAnimatedOffset] = useState(null);
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score * 10)));
  const targetOffset = circumference - (normalizedScore / 100) * circumference;

  function getColorClass() {
    if (normalizedScore < 40) return 'red';
    if (normalizedScore <= 70) return 'orange';
    return 'green';
  }

  const status = getColorClass();

  const strokeColor = status === 'red' 
    ? 'stroke-error' 
    : status === 'orange' 
    ? 'stroke-warning' 
    : 'stroke-success';

  const textColor = status === 'red' 
    ? 'text-error' 
    : status === 'orange' 
    ? 'text-warning' 
    : 'text-success';

  useEffect(() => {
    setAnimatedOffset(circumference);
    const timer = setTimeout(() => {
      setAnimatedOffset(targetOffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [targetOffset, circumference]);

  return (
    <div className="p-8 text-center bg-bg-secondary border border-border rounded-md w-full animate-[scaleIn_0.85s_cubic-bezier(0.22,1,0.36,1)_forwards]">
      <div className="relative w-[160px] h-[160px] mx-auto mb-6 max-sm:w-[140px] max-sm:h-[140px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          <circle
            className="fill-none stroke-border"
            strokeWidth="8"
            cx="80"
            cy="80"
            r={radius}
          />
          <circle
            className={`fill-none transition-[stroke-dashoffset] duration-[1200ms] cubic-bezier(0.16,1,0.3,1) ${strokeColor}`}
            strokeWidth="8"
            strokeLinecap="round"
            cx="80"
            cy="80"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={animatedOffset !== null ? animatedOffset : circumference}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-headings text-4xl font-extrabold tracking-tight leading-none max-sm:text-3xl ${textColor}`}>
            {normalizedScore}%
          </span>
          <span className="text-[10px] text-text-tertiary font-semibold uppercase tracking-widest mt-1">Match</span>
        </div>
      </div>
      <h3 className="font-headings text-xl font-bold text-text-primary mb-1">{roleName}</h3>
      <p className="text-sm text-text-tertiary m-0">Best matching role for your resume</p>
    </div>
  );
}
