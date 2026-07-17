import { useState, useEffect } from 'react';

export default function LearningRoadmap({ missingSkills = [] }) {
  const [timeline, setTimeline] = useState([]);

  // Curated database of resources for popular skills
  const resourceDb = {
    'docker': {
      title: 'Docker Complete Course',
      platform: 'freeCodeCamp (YouTube)',
      url: 'https://www.youtube.com/watch?v=pg19Z840I4c',
      duration: '3 hours',
      desc: 'Learn containerization basics, writing Dockerfiles, and managing Docker Compose.'
    },
    'react': {
      title: 'React for Beginners Course',
      platform: 'Scrimba / freeCodeCamp',
      url: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
      duration: '5 hours',
      desc: 'Master state, hooks, props, component life cycle, and dynamic JSX rendering.'
    },
    'mongodb': {
      title: 'MongoDB Basics Certification',
      platform: 'MongoDB University',
      url: 'https://learn.mongodb.com/',
      duration: '8 hours',
      desc: 'Learn NoSQL basics, document schemas, CRUD operations, and aggregation queries.'
    },
    'sql': {
      title: 'SQL Tutorial for Beginners',
      platform: 'Programming with Mosh (YouTube)',
      url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
      duration: '3 hours',
      desc: 'Learn database queries, complex joins, primary/foreign keys, and database design.'
    },
    'node.js': {
      title: 'Node.js & Express Complete Guide',
      platform: 'freeCodeCamp (YouTube)',
      url: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
      duration: '8 hours',
      desc: 'Build scalable REST APIs, learn middleware, routing, and database integrations.'
    },
    'api design': {
      title: 'RESTful API Design Principles',
      platform: 'roadmap.sh',
      url: 'https://roadmap.sh/api',
      duration: '2 hours',
      desc: 'Learn standard status codes, endpoint structures, authentication, and headers.'
    },
    'kubernetes': {
      title: 'Kubernetes Tutorial for Beginners',
      platform: 'TechWorld with Nana (YouTube)',
      url: 'https://www.youtube.com/watch?v=X48VuDVv0do',
      duration: '4 hours',
      desc: 'Master pods, deployments, services, namespaces, and configMaps.'
    },
    'git': {
      title: 'Git & GitHub Tutorial for Beginners',
      platform: 'Amigoscode (YouTube)',
      url: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
      duration: '2 hours',
      desc: 'Learn version control, commit trees, branching, merges, and resolving conflicts.'
    },
    'aws': {
      title: 'AWS Certified Cloud Practitioner',
      platform: 'freeCodeCamp (YouTube)',
      url: 'https://www.youtube.com/watch?v=SOTamWGuDKc',
      duration: '13 hours',
      desc: 'Understand core cloud services: EC2, S3, RDS, IAM, Lambda, and cost models.'
    },
    'machine learning': {
      title: 'Machine Learning for Everybody',
      platform: 'freeCodeCamp (YouTube)',
      url: 'https://www.youtube.com/watch?v=i_LwzRVP7bg',
      duration: '4 hours',
      desc: 'Learn basic ML algorithms: linear regression, classification, clustering, and decision trees.'
    }
  };

  useEffect(() => {
    if (missingSkills.length === 0) {
      setTimeline([]);
      return;
    }

    // Limit roadmap to first 4 missing skills
    const skillsToMap = missingSkills.slice(0, 4);

    const generatedTimeline = skillsToMap.map((skill, index) => {
      const normalizedSkill = skill.toLowerCase().trim();
      
      // Look up curated resource or generate a mock fallback
      let resource = resourceDb[normalizedSkill];

      if (!resource) {
        // Search for partial match
        const matchedKey = Object.keys(resourceDb).find(k => normalizedSkill.includes(k));
        if (matchedKey) {
          resource = resourceDb[matchedKey];
        } else {
          // Generate realistic default fallback
          resource = {
            title: `${skill} Complete Masterclass`,
            platform: 'Udemy / YouTube free tutorial',
            url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' tutorial')}`,
            duration: '4-6 hours',
            desc: `Learn the fundamentals, core concepts, syntax, and project integrations for ${skill}.`
          };
        }
      }

      return {
        week: index + 1,
        skill: skill,
        ...resource,
        completed: false
      };
    });

    setTimeline(generatedTimeline);
  }, [missingSkills]);

  if (timeline.length === 0) {
    return null;
  }

  return (
    <div className="p-8 flex flex-col gap-4 mt-8 w-full bg-bg-secondary border border-border rounded-md animate-[fadeIn_0.8s_cubic-bezier(0.22,1,0.36,1)_forwards]">
      <h3 className="m-0 text-2xl font-extrabold text-text-primary">🎯 Structured Learning Roadmap</h3>
      <p className="text-sm text-text-secondary mb-4">Follow this week-by-week curriculum to bridge your skill gaps:</p>

      <div className="flex flex-col relative pl-1">
        {timeline.map((step) => (
          <div key={step.week} className="grid grid-cols-[80px_1fr] gap-6 relative mb-6 last:mb-0">
            <div className="flex flex-col items-center">
              <div className="w-[76px] h-7 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-[11px] font-bold flex items-center justify-center shadow-[0_0_10px_rgba(102,126,234,0.3)] z-[2]">
                Week {step.week}
              </div>
              <div className="grow w-[2px] bg-white/10 mt-1 z-[1]"></div>
            </div>
            
            <div className="p-6 flex flex-col gap-2 rounded-md bg-bg-secondary border border-border transition-all duration-300 hover:translate-x-1 hover:border-primary">
              <div className="flex justify-between items-center w-full">
                <span className="bg-[#764ba2]/15 text-[#c084fc] border border-[#764ba2]/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                  {step.skill}
                </span>
                <span className="text-[11px] text-text-secondary font-medium">⏱️ {step.duration}</span>
              </div>
              
              <h4 className="text-base font-bold text-text-primary m-0">{step.title}</h4>
              <p className="text-xs text-text-secondary m-0">Platform: <strong>{step.platform}</strong></p>
              <p className="text-sm text-text-secondary m-0 leading-relaxed">{step.desc}</p>
              
              <div className="mt-1 flex justify-between items-center">
                <a 
                  href={step.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-secondary px-3 py-1.5 text-[11px]"
                >
                  Start Course ↗
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
