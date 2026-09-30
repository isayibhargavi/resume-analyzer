import React, { useState, useEffect } from 'react';
import heroBanner from './assets/images/hero_resume_analytics_1790762407610.jpg';
import { N8nConfig, SubmissionRecord, AtsCheckResult } from './types';
import {
  DEFAULT_N8N_CONFIG,
  loadStoredConfig,
  saveStoredConfig,
  loadSubmissionHistory,
  saveSubmissionRecord,
  pingN8nEndpoint,
  SubmitResult,
} from './services/n8nService';
import { Navbar } from './components/Navbar';
import { ResumeForm } from './components/ResumeForm';
import { ResumePreviewCard } from './components/ResumePreviewCard';
import { EndpointSettingsModal } from './components/EndpointSettingsModal';
import { SubmissionSuccessModal } from './components/SubmissionSuccessModal';
import { SubmissionHistoryModal } from './components/SubmissionHistoryModal';
import { WorkflowDocsModal } from './components/WorkflowDocsModal';
import {
  CheckCircle2,
  Workflow,
  Sparkles,
  Zap,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  FileCheck2,
  Cpu,
  MailCheck,
} from 'lucide-react';

export default function App() {
  const [n8nConfig, setN8nConfig] = useState<N8nConfig>(loadStoredConfig());
  const [history, setHistory] = useState<SubmissionRecord[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [atsResult, setAtsResult] = useState<AtsCheckResult | null>(null);
  const [extractedSnippet, setExtractedSnippet] = useState<string>('');
  
  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);
  const [successCandidate, setSuccessCandidate] = useState<{
    name: string;
    email: string;
    fileName: string;
    fileSizeBytes: number;
    submitResult: SubmitResult;
    targetRole?: string;
  } | null>(null);

  // Status check indicator
  const [endpointStatus, setEndpointStatus] = useState<'checking' | 'ready' | 'idle-test' | 'error'>('ready');

  useEffect(() => {
    setHistory(loadSubmissionHistory());
    // Auto-check endpoint status once on mount
    pingN8nEndpoint(n8nConfig.url).then((res) => {
      if (res.ok) setEndpointStatus('ready');
      else if (res.requiresExecuteStep) setEndpointStatus('idle-test');
      else setEndpointStatus('error');
    });
  }, [n8nConfig.url]);

  const handleSaveConfig = (newConfig: N8nConfig) => {
    setN8nConfig(newConfig);
    saveStoredConfig(newConfig);
    pingN8nEndpoint(newConfig.url).then((res) => {
      if (res.ok) setEndpointStatus('ready');
      else if (res.requiresExecuteStep) setEndpointStatus('idle-test');
      else setEndpointStatus('error');
    });
  };

  const handleSwitchToProd = () => {
    const updated: N8nConfig = {
      ...n8nConfig,
      mode: 'production',
      url: n8nConfig.prodUrl,
    };
    handleSaveConfig(updated);
  };

  const handleFileParsed = (file: File, ats: AtsCheckResult, snippet: string) => {
    setSelectedFile(file);
    setAtsResult(ats);
    setExtractedSnippet(snippet);
  };

  const handleSubmissionComplete = (result: {
    name: string;
    email: string;
    fileName: string;
    fileSizeBytes: number;
    submitResult: SubmitResult;
    targetRole?: string;
  }) => {
    const record: SubmissionRecord = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
      name: result.name,
      email: result.email,
      targetRole: result.targetRole,
      fileName: result.fileName,
      fileSizeBytes: result.fileSizeBytes,
      endpointUrl: n8nConfig.url,
      mode: n8nConfig.mode,
      status: result.submitResult.success ? 'success' : 'failed',
      rawResponse: result.submitResult.rawResponse,
      httpStatus: result.submitResult.httpStatus,
    };

    saveSubmissionRecord(record);
    setHistory(loadSubmissionHistory());
    setSuccessCandidate(result);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Navigation */}
      <Navbar
        n8nConfig={n8nConfig}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Hero Section */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <span>Integrated n8n Webhook Pipeline</span>
                <span aria-hidden="true">·</span>
                <span className="text-neutral-500">Live Intake</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white text-balance">
                Automated Resume Analysis &amp; Talent Pipeline
              </h1>
              <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
                Ingest applicant documents, run instant ATS pre-flight checks, and dispatch real-time payloads straight to your configured n8n Form Trigger.
              </p>
            </div>

            {/* Webhook Status Widget */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/90 p-3 sm:p-3.5 flex items-center justify-between sm:justify-start gap-3.5 self-start shrink-0">
              <div className="flex items-center gap-2.5">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    endpointStatus === 'ready'
                      ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                      : endpointStatus === 'idle-test'
                      ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                      : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                  }`}
                />
                <div className="text-xs">
                  <div className="font-semibold text-white capitalize">
                    {n8nConfig.mode} Mode
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {endpointStatus === 'ready'
                      ? 'Webhook listening & responsive'
                      : endpointStatus === 'idle-test'
                      ? 'Awaiting Execute step in n8n'
                      : 'Endpoint offline'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="rounded-lg bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 text-[11px] font-medium text-neutral-200 transition-colors whitespace-nowrap"
              >
                Change
              </button>
            </div>
          </div>
        </section>

        {/* Two-Column Interactive Workspace */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Submission Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <ResumeForm
              n8nConfig={n8nConfig}
              onSubmissionComplete={handleSubmissionComplete}
              onFileParsed={handleFileParsed}
              onSwitchToProd={handleSwitchToProd}
            />
          </div>

          {/* Right Column: Visual Preview & Pre-Flight Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Visual Hero Banner with styled fallback container */}
            <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-sm aspect-video">
              <img
                src={heroBanner}
                alt="Resume evaluation and analytical pipeline"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-opacity duration-300"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent flex flex-col justify-end p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Workflow className="h-4 w-4 text-rose-400" />
                  <span>Resume Analyzer Workflow Engine</span>
                </div>
                <p className="text-[11px] text-neutral-300 mt-0.5">
                  Direct webhook dispatch to <code className="font-mono text-rose-300">isayibhargavi.app.n8n.cloud</code>
                </p>
              </div>
            </div>

            {/* Instant ATS Pre-Flight Card */}
            <ResumePreviewCard
              fileName={selectedFile?.name || ''}
              fileSizeBytes={selectedFile?.size || 0}
              atsResult={atsResult}
              extractedSnippet={extractedSnippet}
            />
          </div>
        </section>

        {/* Feature / Architecture Showcase Section */}
        <section className="pt-8 border-t border-neutral-800">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">
                How Your n8n Automation Operates
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Mechanism-to-outcome pipeline connecting this UI with downstream services
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsDocsOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:underline self-start sm:self-auto"
            >
              <span>Inspect Raw Schema</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Step 1 */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 text-rose-400">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">
                1. Webhook Multipart Intake
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                The portal builds a standard <code className="font-mono text-neutral-300">FormData</code> payload with candidate parameters <code className="font-mono text-rose-300">field-0</code>, <code className="font-mono text-rose-300">field-1</code>, and the binary file <code className="font-mono text-rose-300">field-2</code>.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 text-rose-400">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">
                2. Automated AI Extraction
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                n8n passes the binary document to language models (e.g. OpenAI or Gemini) to extract experience timelines, technical proficiencies, and candidate scorecards.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 text-rose-400">
                <MailCheck className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">
                3. Database &amp; Email Dispatch
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Results append seamlessly into Google Sheets, Notion, or Airtable while triggering customized automated acknowledgment emails to the applicant.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-neutral-800 bg-neutral-950 py-8 text-xs text-neutral-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-300">Resume Analyzer</span>
            <span>·</span>
            <span>Connected to n8n Cloud Pipeline</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsDocsOpen(true)}
              className="hover:text-neutral-300 transition-colors"
            >
              Workflow Docs
            </button>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-neutral-300 transition-colors"
            >
              Webhook Config
            </button>
            <a
              href="https://n8n.io"
              target="_blank"
              rel="noreferrer"
              className="hover:text-neutral-300 transition-colors inline-flex items-center gap-1"
            >
              <span>n8n.io</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <EndpointSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={n8nConfig}
        onSaveConfig={handleSaveConfig}
      />

      <SubmissionSuccessModal
        isOpen={Boolean(successCandidate)}
        onClose={() => setSuccessCandidate(null)}
        candidate={successCandidate}
        onViewHistory={() => {
          setSuccessCandidate(null);
          setIsHistoryOpen(true);
        }}
      />

      <SubmissionHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        records={history}
        onHistoryUpdated={() => setHistory(loadSubmissionHistory())}
      />

      <WorkflowDocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
        config={n8nConfig}
      />
    </div>
  );
}
