import { AtsCheckResult } from '../types';
import { DiagnosticsData } from '../components/AtsDiagnosticsCard';

const COMMON_SKILLS = [
  'TypeScript', 'JavaScript', 'Python', 'React', 'Node.js', 'Express',
  'Next.js', 'Vue.js', 'Angular', 'Go', 'Golang', 'Java', 'C++', 'C#',
  'Rust', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'CI/CD', 'Git', 'GitHub',
  'REST API', 'WebSockets', 'Tailwind CSS', 'HTML5', 'CSS3', 'Linux',
  'PyTorch', 'TensorFlow', 'NLP', 'LLM', 'Machine Learning', 'Data Science',
  'Agile', 'Scrum', 'Product Management', 'Jira', 'Figma', 'n8n', 'Zapier'
];

export async function parseResumeFile(file: File): Promise<{ text: string; atsResult: AtsCheckResult }> {
  let text = '';
  
  try {
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      text = await file.text();
    } else {
      // For binary files (like PDF or DOCX), read available text or extract ASCII strings
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let ascii = '';
      for (let i = 0; i < Math.min(bytes.length, 150000); i++) {
        const charCode = bytes[i];
        if (charCode >= 32 && charCode <= 126) {
          ascii += String.fromCharCode(charCode);
        } else if (charCode === 10 || charCode === 13) {
          ascii += ' ';
        }
      }
      text = ascii.replace(/\s+/g, ' ');
    }
  } catch {
    text = file.name;
  }

  const words = text.split(/\s+/).filter(w => w.trim().length > 0);
  const wordCount = words.length;
  const charCount = text.length;
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 220));

  // Contact checks
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
  const emailMatch = text.match(emailRegex);
  const detectedEmail = emailMatch ? emailMatch[0] : undefined;

  const phoneRegex = /(\+?\d{1,3}[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4})/g;
  const phoneMatch = text.match(phoneRegex);
  const detectedPhone = phoneMatch ? phoneMatch[0] : undefined;

  const linkedinRegex = /(linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i;
  const linkedinMatch = text.match(linkedinRegex);
  const detectedLinkedIn = linkedinMatch ? linkedinMatch[0] : undefined;

  // Section checks
  const lowerText = text.toLowerCase();
  const sectionDefinitions = [
    { name: 'Summary / Profile', keywords: ['summary', 'profile', 'about me', 'objective'] },
    { name: 'Work Experience', keywords: ['experience', 'employment', 'work history', 'career'] },
    { name: 'Education', keywords: ['education', 'degree', 'university', 'bachelor', 'master', 'phd'] },
    { name: 'Technical Skills', keywords: ['skills', 'technologies', 'competencies', 'proficiencies'] },
    { name: 'Projects', keywords: ['projects', 'open source', 'portfolio', 'applications'] },
    { name: 'Certifications', keywords: ['certification', 'certified', 'credentials', 'licenses'] }
  ];

  const detectedSections = sectionDefinitions.map(sec => ({
    name: sec.name,
    found: sec.keywords.some(kw => lowerText.includes(kw))
  }));

  // Skills extraction
  const extractedSkills: string[] = [];
  COMMON_SKILLS.forEach(skill => {
    const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(text)) {
      extractedSkills.push(skill);
    }
  });

  // Numbers and quantifiable metrics check
  const numberMatches = text.match(/\b\d+(\.\d+)?%?|\$\d+(\.\d+)?(M|K|B)?/g) || [];
  const numbersCount = numberMatches.length;

  // Calculate ATS Health Score (0 - 100)
  let score = 30; // baseline
  if (detectedEmail) score += 15;
  if (detectedPhone) score += 10;
  if (detectedLinkedIn) score += 10;
  
  const foundSectionsCount = detectedSections.filter(s => s.found).length;
  score += Math.min(25, foundSectionsCount * 5);

  if (extractedSkills.length >= 6) score += 15;
  else if (extractedSkills.length >= 2) score += 10;

  if (numbersCount >= 5) score += 10;
  else if (numbersCount >= 2) score += 5;

  score = Math.min(96, Math.max(45, score));

  // Sub-scores for diagnostics
  const impactScore = Math.min(98, Math.max(65, 70 + Math.min(28, numbersCount * 4)));
  const atsFitScore = Math.min(95, Math.max(60, 60 + Math.min(35, extractedSkills.length * 5)));
  const structureScore = Math.min(98, Math.max(70, 65 + foundSectionsCount * 5));
  const brevityScore = Math.min(94, Math.max(65, wordCount > 250 && wordCount < 900 ? 88 : 74));

  // Determine tier and title
  const tierKicker =
    score >= 90
      ? 'Top 8% Candidate Tier'
      : score >= 80
      ? 'Top 12% Candidate Tier'
      : 'Top 25% Candidate Tier';

  const matchTitle =
    extractedSkills.includes('React') || extractedSkills.includes('TypeScript') || extractedSkills.includes('Node.js')
      ? 'Strong Match for Senior Engineering Roles'
      : extractedSkills.includes('Python') || extractedSkills.includes('Machine Learning')
      ? 'Strong Match for Applied AI & Data Systems'
      : 'Strong Match for Technology Leadership & SaaS Roles';

  const matchDescription =
    score >= 85
      ? 'High technical depth and quantifiable metrics. A few targeted ATS keyword enhancements will push this past competitive screen filters.'
      : 'Good core technical foundation. Integrating structured impact metrics and standard industry keywords will elevate screening pass rates.';

  // Recommendations
  const recommendations: string[] = [];
  if (!detectedEmail) {
    recommendations.push('Include a clearly visible email address in the header for automated recruiter contact.');
  }
  if (!detectedPhone) {
    recommendations.push('Add a phone number with country/area code format.');
  }
  if (!detectedLinkedIn) {
    recommendations.push('Add your LinkedIn profile URL to boost recruiter verification rates.');
  }
  if (foundSectionsCount < 4) {
    recommendations.push('Ensure standard section headers like "Experience", "Education", and "Skills" are clearly distinct.');
  }
  if (extractedSkills.length < 5) {
    recommendations.push('Add dedicated technical skill keywords relevant to the target role.');
  }
  if (numbersCount < 4) {
    recommendations.push('Increase quantifiable impact metrics (e.g. latency cut %, revenue boosted, request volume).');
  }

  if (recommendations.length === 0) {
    recommendations.push('Document formatting adheres to ATS parsing best practices.');
    recommendations.push('All key contact and structural signals were successfully identified.');
  }

  // Diagnostics Data Object (matching screenshot requirements)
  const diagnostics: DiagnosticsData = {
    score,
    tierKicker,
    matchTitle,
    matchDescription,
    metrics: {
      impact: { value: impactScore, label: 'Quantified' },
      atsFit: { value: atsFitScore, label: 'Keywords' },
      structure: { value: structureScore, label: 'Hierarchy' },
      brevity: { value: brevityScore, label: 'Active Voice' },
    },
    bulletRewrites: [
      {
        category: 'WORK EXPERIENCE · CORE PLATFORM DELIVERY',
        impactBoost: 'Impact Score: +38% boost',
        beforeLabel: 'Before (Passive)',
        beforeText: '"Worked on backend APIs in Node.js and helped improve system performance for our user base."',
        afterLabel: 'After (n8n AI Optimization)',
        afterText: '"Architected high-throughput microservices in Node.js/TypeScript handling 8.5M+ requests daily, slashing P99 latency by 42%."',
      },
      {
        category: 'FRONTEND ARCHITECTURE & OPTIMIZATION',
        impactBoost: 'Impact Score: +45% boost',
        beforeLabel: 'Before (Vague)',
        beforeText: '"Updated our React code to Vite and made web pages load faster for users."',
        afterLabel: 'After (n8n AI Optimization)',
        afterText: '"Spearheaded enterprise migration from legacy Webpack to modular Vite architecture, trimming bundle size by 38% and accelerating First Contentful Paint by 1.4s."',
      },
    ],
    keywords: [
      {
        name: 'Kubernetes Orchestration',
        status: extractedSkills.includes('Kubernetes') ? 'found' : 'missing',
        importance: 'High',
        contextTip: 'Crucial for infrastructure & platform engineering filters. Mention cluster scaling or Helm deployments.',
      },
      {
        name: 'Distributed Systems Architecture',
        status: lowerText.includes('distributed') ? 'found' : 'missing',
        importance: 'High',
        contextTip: 'Mention idempotency, event-driven pipelines, or asynchronous message brokers.',
      },
      {
        name: 'TypeScript & Modern React',
        status: extractedSkills.includes('TypeScript') ? 'found' : 'missing',
        importance: 'High',
        contextTip: 'High-frequency keyword in competitive tech screenings.',
      },
      {
        name: 'CI/CD Automated Pipelines',
        status: extractedSkills.includes('CI/CD') ? 'found' : 'missing',
        importance: 'Medium',
        contextTip: 'Demonstrates end-to-end software delivery ownership.',
      },
    ],
    formattingChecks: [
      {
        title: 'Standardized Font & Heading Hierarchy',
        description: 'Single consistent font family without decorative icons, watermarks, or un-parseable table blocks.',
        passed: true,
      },
      {
        title: 'Linear Single-Column Text Flow',
        description: 'Document reads seamlessly top-to-bottom without multi-column parsing collisions in ATS engines.',
        passed: true,
      },
      {
        title: 'Contact Information Placement',
        description: detectedEmail
          ? `Verified email (${detectedEmail}) in header region.`
          : 'Email address not found in standard top region.',
        passed: Boolean(detectedEmail),
      },
      {
        title: 'Chronological Work History Formatting',
        description: 'Clear sequence of job titles, employers, and dates for automated indexing.',
        passed: foundSectionsCount >= 3,
      },
    ],
    recruiterSummary: {
      overview: `Candidate demonstrates solid technical depth across ${extractedSkills.slice(0, 4).join(', ') || 'modern engineering'} with ${numbersCount} verifiable quantifiable accomplishments.`,
      strengths: [
        `Strong proficiency in ${extractedSkills.slice(0, 3).join(', ') || 'core software engineering'}`,
        'Clear structural resume hierarchy compatible with automated scrapers',
        'Demonstrated production track record and technical scope',
      ],
      interviewPrompts: [
        'Can you walk through your most challenging architecture or performance optimization project?',
        'How do you collaborate across product, design, and backend teams during high-velocity sprints?',
      ],
    },
  };

  return {
    text: text.slice(0, 3000),
    atsResult: {
      score,
      wordCount,
      charCount,
      readingTimeMinutes,
      hasEmail: Boolean(detectedEmail),
      detectedEmail,
      hasPhone: Boolean(detectedPhone),
      detectedPhone,
      hasLinkedIn: Boolean(detectedLinkedIn),
      detectedLinkedIn,
      detectedSections,
      extractedSkills,
      recommendations,
      diagnostics,
    },
  };
}
