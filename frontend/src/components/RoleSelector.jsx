export default function RoleSelector({
  currentRole,
  rolesScores,
  onRoleChange,
  isLoading,
}) {
  const roleList = rolesScores || [];
  const sortedRoles = [...roleList].sort((a, b) => b.score - a.score);

  function handleChange(e) {
    if (onRoleChange) {
      onRoleChange(e.target.value);
    }
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-2 p-4 text-sm text-text-tertiary">
          <svg className="animate-spin text-text-tertiary w-[18px] h-[18px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Switching role...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-2" htmlFor="role-select">
        <span>🎯</span>
        Switch Target Role
      </label>
      <div className="relative w-full">
        <select
          id="role-select"
          className="w-full py-3 pl-4 pr-10 text-sm font-medium bg-bg-input border border-border rounded-sm text-text-primary cursor-pointer transition-all duration-300 outline-none focus:border-primary hover:border-border-hover hover:bg-bg-input-focus appearance-none bg-[url('data:image/svg+xml,%3Csvg_xmlns=%22http://www.w3.org/2000/svg%22_width=%2210%22_height=%2210%22_fill=%22%23707070%22_viewBox=%220_0_16_16%22%3E%3Cpath_d=%22M8_11L3_6h10l-5_5z%22/%3E%3C/svg%3E')] bg-[no-repeat] bg-[right_12px_center]"
          value={currentRole}
          onChange={handleChange}
          disabled={isLoading}
        >
          {sortedRoles.length > 0 ? (
            sortedRoles.map(({ role, score }) => (
              <option key={role} value={role} className="bg-bg-secondary text-text-primary">
                {role} — {Math.round(score * 10)}% match
              </option>
            ))
          ) : (
            <option value={currentRole} className="bg-bg-secondary text-text-primary">{currentRole}</option>
          )}
        </select>
      </div>
      <p className="text-[11px] text-text-tertiary mt-1">
        Select a different role to see how your resume matches
      </p>
    </div>
  );
}
