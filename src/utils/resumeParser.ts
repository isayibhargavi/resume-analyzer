import { AtsCheckResult } from '../types';

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

  // Calculate ATS Health Score (0 - 100)
  let score = 20; // baseline for valid file
  if (detectedEmail) score += 15;
  if (detectedPhone) score += 10;
  if (detectedLinkedIn) score += 10;
  
  const foundSectionsCount = detectedSections.filter(s => s.found).length;
  score += Math.min(30, foundSectionsCount * 6);

  if (extractedSkills.length >= 5) score += 15;
  else if (extractedSkills.length >= 2) score += 10;

  if (wordCount >= 250 && wordCount <= 1200) score += 10;
  else if (wordCount > 100) score += 5;

  score = Math.min(100, Math.max(30, score));

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
  if (wordCount < 250) {
    recommendations.push('The resume length is relatively concise; consider elaborating on quantifiable accomplishments.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Document formatting adheres to ATS parsing best practices.');
    recommendations.push('All key contact and structural signals were successfully identified.');
  }

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
      recommendations
    }
  };
}
