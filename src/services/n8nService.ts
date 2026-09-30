import { N8nConfig, SubmissionRecord } from '../types';

export const DEFAULT_N8N_CONFIG: N8nConfig = {
  mode: 'production',
  url: 'https://isayibhargavi.app.n8n.cloud/form/ae91d15e-0d5f-4b62-a977-1dbc56c94beb',
  testUrl: 'https://isayibhargavi.app.n8n.cloud/form-test/ae91d15e-0d5f-4b62-a977-1dbc56c94beb',
  prodUrl: 'https://isayibhargavi.app.n8n.cloud/form/ae91d15e-0d5f-4b62-a977-1dbc56c94beb',
};

const STORAGE_KEY_CONFIG = 'resume_analyzer_n8n_config';
const STORAGE_KEY_HISTORY = 'resume_analyzer_submission_history';

export function loadStoredConfig(): N8nConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_N8N_CONFIG, ...parsed };
    }
  } catch {
    // fallback to default
  }
  return DEFAULT_N8N_CONFIG;
}

export function saveStoredConfig(config: N8nConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function loadSubmissionHistory(): SubmissionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return [];
}

export function saveSubmissionRecord(record: SubmissionRecord): void {
  try {
    const history = loadSubmissionHistory();
    const updated = [record, ...history].slice(0, 50);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function clearSubmissionHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  } catch {
    // ignore
  }
}

export interface PingResult {
  ok: boolean;
  status: number;
  message: string;
  isListening: boolean;
  requiresExecuteStep: boolean;
  isProductionReady: boolean;
}

export async function pingN8nEndpoint(url: string): Promise<PingResult> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/json,*/*'
      }
    });

    const text = await response.text();

    if (text.includes("Form Trigger isn't listening yet")) {
      return {
        ok: false,
        status: response.status,
        message: 'n8n test trigger is idle. Open your n8n editor and click "Execute step" or switch to Production mode.',
        isListening: false,
        requiresExecuteStep: true,
        isProductionReady: false
      };
    }

    if (response.ok || text.includes('resume Analyzer') || text.includes('n8n-form')) {
      return {
        ok: true,
        status: response.status,
        message: 'Endpoint is active and accepting resume submissions.',
        isListening: true,
        requiresExecuteStep: false,
        isProductionReady: url.includes('/form/') && !url.includes('/form-test/')
      };
    }

    return {
      ok: response.status < 400,
      status: response.status,
      message: `Endpoint responded with status ${response.status}.`,
      isListening: true,
      requiresExecuteStep: false,
      isProductionReady: false
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Network unreachable';
    return {
      ok: false,
      status: 0,
      message: `Could not connect to endpoint: ${errorMsg}`,
      isListening: false,
      requiresExecuteStep: false,
      isProductionReady: false
    };
  }
}

export interface SubmitToN8nParams {
  endpointUrl: string;
  name: string;
  email: string;
  files: File[];
  targetRole?: string;
  notes?: string;
}

export interface SubmitResult {
  success: boolean;
  httpStatus: number;
  message: string;
  rawResponse: string;
  needsExecuteStep?: boolean;
}

export async function submitResumeToN8n(params: SubmitToN8nParams): Promise<SubmitResult> {
  const { endpointUrl, name, email, files } = params;

  // Build FormData matching n8n form schema:
  // field-0: Name
  // field-1: Email
  // field-2: Resume (file)
  const formData = new FormData();
  formData.append('field-0', name);
  formData.append('field-1', email);

  if (files && files.length > 0) {
    for (const file of files) {
      formData.append('field-2', file, file.name);
    }
  }

  try {
    const response = await fetch(endpointUrl, {
      method: 'POST',
      body: formData,
    });

    const responseText = await response.text();

    if (responseText.includes("Form Trigger isn't listening yet")) {
      return {
        success: false,
        httpStatus: response.status,
        message: 'n8n test trigger is not listening. Please click "Execute step" in your n8n editor, or switch to the Production endpoint.',
        rawResponse: responseText,
        needsExecuteStep: true,
      };
    }

    let parsedJson: { status?: number; formSubmittedText?: string } | null = null;
    try {
      parsedJson = JSON.parse(responseText);
    } catch {
      // not JSON
    }

    if (response.ok || (parsedJson && parsedJson.status === 200)) {
      const message = parsedJson?.formSubmittedText || 'Resume successfully submitted and queued in n8n workflow.';
      return {
        success: true,
        httpStatus: response.status,
        message,
        rawResponse: responseText,
      };
    }

    return {
      success: false,
      httpStatus: response.status,
      message: response.status === 413
        ? 'Uploaded resume file exceeds size limits. Please upload a smaller file.'
        : `Submission returned status ${response.status}.`,
      rawResponse: responseText,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown network failure';
    return {
      success: false,
      httpStatus: 0,
      message: `Failed to submit to n8n: ${errorMsg}. Please check endpoint URL and network access.`,
      rawResponse: errorMsg,
    };
  }
}
