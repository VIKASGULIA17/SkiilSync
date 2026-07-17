import { useEffect, useState } from 'react';

export default function SkillRadar({ matchedSkills = [], missingSkills = [] }) {
  const [points, setPoints] = useState({ matchPoints: '', expectedPoints: '' });
  
  // Categorise skills dynamically to calculate axis values
  const categories = [
    { name: 'Languages', keywords: ['python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'swift', 'kotlin', 'php', 'ruby', 'html', 'css', 'solidity'] },
    { name: 'Frameworks', keywords: ['react', 'vue', 'angular', 'node', 'django', 'flask', 'spring', 'express', 'nextjs', 'svelte', 'laravel', 'flutter', 'uikit', 'swiftui', 'tensorflow', 'pytorch', 'scikit-learn'] },
    { name: 'Databases', keywords: ['sql', 'mysql', 'postgresql', 'mongodb', 'sqlite', 'redis', 'snowflake', 'bigquery', 'database', 'dba', 'nosql', 'dynamodb'] },
    { name: 'Tools & DevOps', keywords: ['git', 'docker', 'kubernetes', 'jenkins', 'terraform', 'aws', 'gcp', 'azure', 'ci/cd', 'github actions', 'jira', 'figma', 'postman', 'selenium', 'npm', 'pip'] },
    { name: 'Architecture', keywords: ['rest apis', 'api design', 'microservices', 'etl', 'big data', 'stream processing', 'schema design', 'data warehousing', 'data modeling', 'mvc', 'mvvm'] },
    { name: 'Engineering principles', keywords: ['testing', 'debugging', 'agile', 'scrum', 'seo', 'pen testing', 'secops', 'data cleaning', 'machine learning', 'nlp', 'computer vision', 'deep learning'] }
  ];

  const center = 100;
  const maxRadius = 70;
  const numAxes = categories.length;

  useEffect(() => {
    // Calculate matched and expected scores (out of 100) for each axis
    const axisValues = categories.map((cat) => {
      const catMatched = matchedSkills.filter(skill => 
        cat.keywords.some(kw => skill.toLowerCase().includes(kw))
      ).length;
      
      const catMissing = missingSkills.filter(skill => 
        cat.keywords.some(kw => skill.toLowerCase().includes(kw))
      ).length;

      const total = catMatched + catMissing;
      
      // Calculate a realistic matched percentage, with a fallback minimum
      let matchedPct = total > 0 ? (catMatched / total) * 100 : 0;
      
      // If no skills are defined in the category, give a realistic baseline based on overall score
      if (total === 0) {
        const totalExpected = matchedSkills.length + missingSkills.length;
        matchedPct = totalExpected > 0 ? (matchedSkills.length / totalExpected) * 100 : 20;
        // add slight noise for visual variety
        matchedPct = Math.max(15, Math.min(90, matchedPct + (Math.random() * 20 - 10)));
      }

      // Expected is always near peak (e.g. 85-95%)
      const expectedPct = 90;

      return {
        matched: matchedPct,
        expected: expectedPct
      };
    });

    // Convert percentages to SVG points string
    const matchPointsArr = [];
    const expectedPointsArr = [];

    axisValues.forEach((val, i) => {
      const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2; // offset by 90deg to start top
      
      // Match coordinate
      const matchRad = (val.matched / 100) * maxRadius;
      const mx = center + matchRad * Math.cos(angle);
      const my = center + matchRad * Math.sin(angle);
      matchPointsArr.push(`${mx},${my}`);

      // Expected coordinate
      const expRad = (val.expected / 100) * maxRadius;
      const ex = center + expRad * Math.cos(angle);
      const ey = center + expRad * Math.sin(angle);
      expectedPointsArr.push(`${ex},${ey}`);
    });

    setPoints({
      matchPoints: matchPointsArr.join(' '),
      expectedPoints: expectedPointsArr.join(' ')
    });
  }, [matchedSkills, missingSkills]);

  // Generate web background grid rings
  const grids = [0.2, 0.4, 0.6, 0.8, 1.0].map((ratio) => {
    const r = ratio * maxRadius;
    const gridPointsArr = [];
    for (let i = 0; i < numAxes; i++) {
      const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      gridPointsArr.push(`${x},${y}`);
    }
    return gridPointsArr.join(' ');
  });

  return (
    <div className="flex flex-col items-center gap-4 w-full p-6 bg-bg-secondary border border-border rounded-md">
      <h4 className="text-base font-bold text-text-primary mb-1 text-center self-start">Skill Dimension Fit</h4>
      
      <div className="w-full max-w-[250px] flex justify-center">
        <svg className="overflow-visible" viewBox="0 0 200 200">
          {/* Background grid lines */}
          {grids.map((gridPoints, index) => (
            <polygon
              key={index}
              className="fill-none stroke-border/30 stroke-[1px]"
              points={gridPoints}
            />
          ))}

          {/* Axis lines and labels */}
          {categories.map((cat, i) => {
            const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
            const x1 = center;
            const y1 = center;
            const x2 = center + maxRadius * Math.cos(angle);
            const y2 = center + maxRadius * Math.sin(angle);
            
            // Label offset placement
            const labelDist = maxRadius + 18;
            const lx = center + labelDist * Math.cos(angle);
            const ly = center + labelDist * Math.sin(angle) + 4; // slight vertical adjustment
            
            // Text alignment calculations
            let textAnchor = 'middle';
            if (Math.cos(angle) > 0.1) textAnchor = 'start';
            else if (Math.cos(angle) < -0.1) textAnchor = 'end';

            return (
              <g key={cat.name}>
                <line className="stroke-border/40 stroke-[1px]" x1={x1} y1={y1} x2={x2} y2={y2} />
                <text
                  className="fill-current text-text-secondary text-[8px] font-semibold tracking-wider font-sans"
                  x={lx}
                  y={ly}
                  textAnchor={textAnchor}
                >
                  {cat.name}
                </text>
              </g>
            );
          })}

          {/* Expected Skill Polygon (Background) */}
          <polygon
            className="fill-primary/5 stroke-primary/30 stroke-[1.5px] [stroke-dasharray:2_2] transition-all duration-700"
            points={points.expectedPoints}
          />

          {/* Match Skill Polygon (Foreground) */}
          <polygon
            className="fill-[#764ba2]/20 stroke-primary stroke-[2px] transition-all duration-700"
            points={points.matchPoints}
          />
        </svg>
      </div>

      <div className="mt-2 flex justify-center gap-6">
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]"></span>
          <span>Your Match</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <span className="w-2.5 h-2.5 rounded-full border border-dashed border-primary/60 bg-primary/10"></span>
          <span>Expected Target</span>
        </div>
      </div>
    </div>
  );
}
