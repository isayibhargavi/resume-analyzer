import React, { useState, useRef } from 'react';
import { CandidateFormState, N8nConfig, AtsCheckResult } from '../types';
import { SAMPLE_RESUMES, SampleResume, createSampleFile } from '../utils/sampleResumes';
import { parseResumeFile } from '../utils/resumeParser';
import { submitResumeToN8n, SubmitResult } from '../services/n8nService';
import { UploadCloud, CheckCircle, FileText, Trash2, Send, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

interface ResumeFormProps {
  n8nConfig: N8nConfig;
  onSubmissionComplete: (result: {
    name: string;
    email: string;
    fileName: string;
    fileSizeBytes: number;
    submitResult: SubmitResult;
    targetRole?: string;
  }) => void;
  onFileParsed: (file: File, atsResult: AtsCheckResult, snippet: string) => void;
  onSwitchToProd: () => void;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({
  n8nConfig,
  onSubmissionComplete,
  onFileParsed,
  onSwitchToProd,
}) => {
  const [formState, setFormState] = useState<CandidateFormState>({
    name: SAMPLE_RESUMES[0].name,
    email: SAMPLE_RESUMES[0].email,
    targetRole: SAMPLE_RESUMES[0].targetRole,
    jobDescription: SAMPLE_RESUMES[0].jobDescription,
    files: [createSampleFile(SAMPLE_RESUMES[0])],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitErrorNotice, setSubmitErrorNotice] = useState<{
    message: string;
    needsExecuteStep?: boolean;
  } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formState.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formState.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formState.files || formState.files.length === 0) {
      newErrors.files = 'Please attach a resume file (PDF, DOCX, or TXT)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProcessFile = async (file: File, sampleOverride?: SampleResume) => {
    try {
      const { text, atsResult } = await parseResumeFile(file);
      const diagnostics = sampleOverride ? sampleOverride.diagnostics : atsResult.diagnostics;
      onFileParsed(file, { ...atsResult, diagnostics }, text.slice(0, 1500));

      // Auto-fill email or name if detected and currently empty
      if (!formState.email && atsResult.detectedEmail) {
        setFormState((prev) => ({ ...prev, email: atsResult.detectedEmail || '' }));
      }
    } catch {
      // ignore
    }
  };

  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const selected = Array.from(fileList);
    setFormState((prev) => ({ ...prev, files: selected }));
    setErrors((prev) => ({ ...prev, files: '' }));
    handleProcessFile(selected[0]);
  };

  const handleLoadSample = (sample: SampleResume) => {
    const file = createSampleFile(sample);
    setFormState({
      name: sample.name,
      email: sample.email,
      targetRole: sample.targetRole,
      jobDescription: sample.jobDescription,
      files: [file],
    });
    setErrors({});
    setSubmitErrorNotice(null);
    handleProcessFile(file, sample);
  };

  const handleRemoveFile = (index: number) => {
    setFormState((prev) => {
      const updated = prev.files.filter((_, i) => i !== index);
      return { ...prev, files: updated };
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitErrorNotice(null);

    if (!validate()) return;

    setIsSubmitting(true);
    const primaryFile = formState.files[0];

    try {
      const result = await submitResumeToN8n({
        endpointUrl: n8nConfig.url,
        name: formState.name.trim(),
        email: formState.email.trim(),
        files: formState.files,
        targetRole: formState.targetRole.trim(),
      });

      if (result.success) {
        onSubmissionComplete({
          name: formState.name,
          email: formState.email,
          fileName: primaryFile.name,
          fileSizeBytes: primaryFile.size,
          submitResult: result,
          targetRole: formState.targetRole,
        });
      } else {
        setSubmitErrorNotice({
          message: result.message,
          needsExecuteStep: result.needsExecuteStep,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed';
      setSubmitErrorNotice({ message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="portal" className="rounded-xl border border-neutral-800 bg-neutral-900/90 p-6 lg:p-8 shadow-sm">
      {/* Sample candidates selector */}
      <div className="mb-6 rounded-lg border border-neutral-800 bg-neutral-950/60 p-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-rose-400" />
            <span className="text-xs font-semibold text-neutral-200">
              Quick Test Profiles
            </span>
          </div>
          <span className="text-[11px] text-neutral-400">
            Click any profile to load pre-filled data and a sample resume file
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SAMPLE_RESUMES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleLoadSample(sample)}
              className="text-left p-2.5 rounded border border-neutral-800 bg-neutral-900 hover:border-neutral-700 hover:bg-neutral-850 transition-colors"
            >
              <div className="text-xs font-semibold text-white truncate">
                {sample.name}
              </div>
              <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                {sample.targetRole}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main submission form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Candidate Name (field-0) */}
          <div>
            <label htmlFor="field-0" className="block text-xs font-medium text-neutral-300 mb-1.5">
              Candidate Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="field-0"
              name="field-0"
              type="text"
              value={formState.name}
              onChange={(e) => {
                setFormState((prev) => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              placeholder="e.g. Maya Chen"
              className={`w-full rounded-lg border px-3 py-2 text-sm text-white placeholder-neutral-500 bg-neutral-950 focus:outline-none transition-colors ${
                errors.name
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-neutral-800 focus:border-rose-500'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-400">{errors.name}</p>
            )}
          </div>

          {/* Candidate Email (field-1) */}
          <div>
            <label htmlFor="field-1" className="block text-xs font-medium text-neutral-300 mb-1.5">
              Candidate Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              id="field-1"
              name="field-1"
              type="email"
              value={formState.email}
              onChange={(e) => {
                setFormState((prev) => ({ ...prev, email: e.target.value }));
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              placeholder="e.g. candidate@example.com"
              className={`w-full rounded-lg border px-3 py-2 text-sm text-white placeholder-neutral-500 bg-neutral-950 focus:outline-none transition-colors ${
                errors.email
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-neutral-800 focus:border-rose-500'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-rose-400">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Target Role & Focus Area (Optional metadata) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="target-role" className="block text-xs font-medium text-neutral-300 mb-1.5">
              Target Position / Role <span className="text-neutral-500 text-[11px]">(Optional)</span>
            </label>
            <input
              id="target-role"
              type="text"
              value={formState.targetRole}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, targetRole: e.target.value }))
              }
              placeholder="e.g. Senior Full-Stack Engineer"
              className="w-full rounded-lg border border-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-500 bg-neutral-950 focus:border-rose-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="job-desc" className="block text-xs font-medium text-neutral-300 mb-1.5">
              Target Key Skills / Description <span className="text-neutral-500 text-[11px]">(Optional)</span>
            </label>
            <input
              id="job-desc"
              type="text"
              value={formState.jobDescription}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, jobDescription: e.target.value }))
              }
              placeholder="e.g. React 19, TypeScript, PostgreSQL, Cloud Run"
              className="w-full rounded-lg border border-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-500 bg-neutral-950 focus:border-rose-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Resume File Upload (field-2) */}
        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1.5">
            Attach Resume Document <span className="text-rose-500">*</span>
          </label>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFilesSelected(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-rose-500 bg-rose-950/20'
                : errors.files
                ? 'border-rose-500/80 bg-rose-950/10'
                : 'border-neutral-800 bg-neutral-950/50 hover:border-neutral-700 hover:bg-neutral-950'
            }`}
          >
            <input
              ref={fileInputRef}
              id="field-2"
              name="field-2"
              type="file"
              accept=".pdf,.doc,.docx,.txt,.md"
              multiple
              className="hidden"
              onChange={(e) => handleFilesSelected(e.target.files)}
            />

            <UploadCloud className="h-8 w-8 text-neutral-500 group-hover:text-rose-400 transition-colors mb-2" />
            <p className="text-xs font-semibold text-neutral-200">
              Drop resume here, or <span className="text-rose-400 underline">browse files</span>
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">
              Supports PDF, DOCX, DOC, or TXT formats (up to 20MB)
            </p>
          </div>

          {errors.files && (
            <p className="mt-1 text-xs text-rose-400">{errors.files}</p>
          )}

          {/* Attached files list */}
          {formState.files.length > 0 && (
            <div className="mt-3 space-y-2">
              {formState.files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950/90 px-3.5 py-2.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="h-4 w-4 text-rose-400 shrink-0" />
                    <span className="text-xs font-medium text-white truncate max-w-sm">
                      {file.name}
                    </span>
                    <span className="font-mono text-[11px] text-neutral-500 tabular-nums">
                      ({Math.round(file.size / 1024)} KB)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(idx);
                    }}
                    className="p-1 text-neutral-500 hover:text-rose-400 transition-colors"
                    title="Remove file"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error notification banner */}
        {submitErrorNotice && (
          <div className="rounded-lg border border-amber-800/80 bg-amber-950/30 p-3.5 text-xs text-amber-200 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">{submitErrorNotice.message}</p>
              {submitErrorNotice.needsExecuteStep && (
                <div className="pt-1 flex flex-wrap items-center gap-2">
                  <span className="text-amber-300">
                    Switch to Production mode to run 24/7 without needing n8n test step clicks:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitErrorNotice(null);
                      onSwitchToProd();
                    }}
                    className="inline-flex items-center gap-1 font-semibold text-rose-300 underline hover:text-white"
                  >
                    <span>Switch to Production Webhook</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submit button bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-neutral-800">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>Target:</span>
            <span className="font-mono text-neutral-400 truncate max-w-[280px]">
              {n8nConfig.url}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 hover:bg-rose-500 px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Dispatching to n8n...</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Submit to Resume Analyzer</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
