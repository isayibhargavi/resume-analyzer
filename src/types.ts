export type N8nMode = 'production' | 'test' | 'custom';

export interface N8nConfig {
  mode: N8nMode;
  url: string;
  testUrl: string;
  prodUrl: string;
}

export interface CandidateFormState {
  name: string;
  email: string;
  targetRole: string;
  jobDescription: string;
  files: File[];
}

export interface AtsCheckResult {
  score: number;
  wordCount: number;
  charCount: number;
  readingTimeMinutes: number;
  hasEmail: boolean;
  detectedEmail?: string;
  hasPhone: boolean;
  detectedPhone?: string;
  hasLinkedIn: boolean;
  detectedLinkedIn?: string;
  detectedSections: {
    name: string;
    found: boolean;
  }[];
  extractedSkills: string[];
  recommendations: string[];
}

export interface SubmissionRecord {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  targetRole?: string;
  fileName: string;
  fileSizeBytes: number;
  endpointUrl: string;
  mode: N8nMode;
  status: 'success' | 'failed' | 'listening-required';
  rawResponse?: string;
  httpStatus?: number;
}
