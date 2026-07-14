export default function SkillChips({ matchedSkills, missingSkills }) {
  const matched = matchedSkills || [];
  const missing = missingSkills || [];

  return (
    <div className="bg-bg-secondary border border-border rounded-md p-6 animate-[slideUp_0.95s_cubic-bezier(0.22,1,0.36,1)_forwards]">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span style={{ fontSize: '18px' }}>✅</span>
          <h4 className="font-headings text-base font-semibold text-text-primary">Matched Skills</h4>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-success-bg text-success border-success-border">
            {matched.length}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {matched.length > 0 ? (
            matched.map((skill) => (
              <span key={skill} className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-sm font-medium transition-all duration-300 cursor-default border bg-success-bg text-success border-success-border hover:bg-success/12 hover:border-success">
                <span className="text-[10px] leading-none">✓</span>
                {skill}
              </span>
            ))
          ) : (
            <span className="text-sm text-text-tertiary italic">No matched skills found</span>
          )}
        </div>
      </div>

      <div className="mb-0">
        <div className="flex items-center gap-2 mb-4">
          <span style={{ fontSize: '18px' }}>📌</span>
          <h4 className="font-headings text-base font-semibold text-text-primary">Missing Skills</h4>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-error-bg text-error border-error-border">
            {missing.length}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {missing.length > 0 ? (
            missing.map((skill) => (
              <span key={skill} className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-sm font-medium transition-all duration-300 cursor-default border bg-error-bg text-error border-error-border hover:bg-error/12 hover:border-error">
                <span className="text-[10px] leading-none">✕</span>
                {skill}
              </span>
            ))
          ) : (
            <span className="text-sm text-text-tertiary italic">No missing skills — great job!</span>
          )}
        </div>
      </div>
    </div>
  );
}
