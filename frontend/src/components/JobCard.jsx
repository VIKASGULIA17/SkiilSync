export default function JobCard({ job }) {
  const {
    title,
    company,
    location,
    salary,
    experience,
    link,
    platform,
  } = job;

  const isInternshala = platform?.toLowerCase() === 'internshala';
  const platformClass = isInternshala 
    ? 'bg-info/10 text-info border-info/20' 
    : 'bg-warning/10 text-warning border-warning/20';

  return (
    <div className="flex flex-col h-full p-6 bg-bg-secondary border border-border rounded-md relative overflow-hidden transition-all duration-650 hover:border-primary hover:bg-bg-card-hover animate-[scaleIn_0.85s_cubic-bezier(0.22,1,0.36,1)_forwards]">
      <div className="flex justify-between items-start gap-4 mb-4">
        <h4 className="font-headings text-base font-bold text-text-primary m-0 line-clamp-2 h-[2.6em] leading-snug" title={title}>
          {title}
        </h4>
        <span className={`shrink-0 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${platformClass}`}>
          {platform}
        </span>
      </div>
      
      <div className="grow flex flex-col gap-1 mb-6">
        <p className="font-semibold text-text-primary m-0 text-sm">🏢 {company}</p>
        <p className="text-text-secondary text-sm m-0">📍 {location || 'Remote / Not specified'}</p>
        
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] text-text-tertiary uppercase tracking-wider font-semibold">Salary</span>
            <span className="text-sm text-text-secondary font-medium overflow-hidden text-ellipsis whitespace-nowrap" title={salary || 'Not disclosed'}>
              {salary || 'Not disclosed'}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] text-text-tertiary uppercase tracking-wider font-semibold">Experience</span>
            <span className="text-sm text-text-secondary font-medium overflow-hidden text-ellipsis whitespace-nowrap" title={experience || 'Fresher'}>
              {experience || 'Fresher'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <a href={link} target="_blank" rel="noopener noreferrer" className="w-full btn btn-primary text-center">
          Apply Now 🔗
        </a>
      </div>
    </div>
  );
}
