import React from 'react';
import { AtsCheckResult } from '../types';
import { CheckCircle2, AlertTriangle, FileText, Mail, Phone, Globe, Layers, Sparkles } from 'lucide-react';

interface ResumePreviewCardProps {
  fileName: string;
  fileSizeBytes: number;
  atsResult: AtsCheckResult | null;
  extractedSnippet?: string;
}

export const ResumePreviewCard: React.FC<ResumePreviewCardProps> = ({
  fileName,
  fileSizeBytes,
  atsResult,
  extractedSnippet,
}) => {
  const formattedSize =
    fileSizeBytes > 1024 * 1024
      ? `${(fileSizeBytes / (1024 * 1024)).toFixed(2)} MB`
      : `${Math.round(fileSizeBytes / 1024)} KB`;

  if (!atsResult) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 text-center">
        <FileText className="mx-auto h-8 w-8 text-neutral-600 mb-2" />
        <h3 className="text-sm font-semibold text-neutral-300">No Resume Loaded</h3>
        <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
          Upload a resume or load one of the candidate samples to view live ATS parsing, section detection, and skill extraction.
        </p>
      </div>
    );
  }

  return (
    <div id="preflight" className="rounded-xl border border-neutral-800 bg-neutral-900/90 p-5 lg:p-6 shadow-sm">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-rose-400">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white truncate max-w-md" title={fileName}>
              {fileName}
            </h3>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5 font-mono">
              <span className="tabular-nums">{formattedSize}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{atsResult.wordCount} words</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">~{atsResult.readingTimeMinutes} min read</span>
            </div>
          </div>
        </div>

        {/* ATS Readiness metric */}
        <div className="flex items-center gap-3 self-start sm:self-auto bg-neutral-950/80 px-3.5 py-1.5 rounded-lg border border-neutral-800">
          <span className="text-xs text-neutral-400 font-medium">ATS Readiness</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold font-mono tabular-nums text-white">
              {atsResult.score}
            </span>
            <span className="text-xs font-mono text-neutral-500">/100</span>
          </div>
        </div>
      </div>

      {/* Grid of details */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Contact info checks */}
        <div className="rounded-lg bg-neutral-950/60 p-4 border border-neutral-800/80">
          <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-3">
            Contact Identifiers
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-neutral-400">
                <Mail className="h-3.5 w-3.5" />
                Email
              </span>
              {atsResult.hasEmail ? (
                <span className="font-mono text-emerald-400 truncate max-w-[190px]">
                  {atsResult.detectedEmail}
                </span>
              ) : (
                <span className="text-neutral-500">Not detected</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-neutral-400">
                <Phone className="h-3.5 w-3.5" />
                Phone
              </span>
              {atsResult.hasPhone ? (
                <span className="font-mono text-neutral-200">
                  {atsResult.detectedPhone}
                </span>
              ) : (
                <span className="text-neutral-500">Not detected</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-neutral-400">
                <Globe className="h-3.5 w-3.5" />
                LinkedIn
              </span>
              {atsResult.hasLinkedIn ? (
                <span className="font-mono text-rose-400 truncate max-w-[190px]">
                  {atsResult.detectedLinkedIn}
                </span>
              ) : (
                <span className="text-neutral-500">Not detected</span>
              )}
            </div>
          </div>
        </div>

        {/* Core sections detected */}
        <div className="rounded-lg bg-neutral-950/60 p-4 border border-neutral-800/80">
          <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-3">
            Section Architecture
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {atsResult.detectedSections.map((sec) => (
              <div key={sec.name} className="flex items-center gap-1.5">
                {sec.found ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5 text-neutral-600 shrink-0" />
                )}
                <span className={sec.found ? 'text-neutral-200' : 'text-neutral-500'}>
                  {sec.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Extracted skills */}
      {atsResult.extractedSkills.length > 0 && (
        <div className="mt-4 rounded-lg bg-neutral-950/60 p-4 border border-neutral-800/80">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              Extracted Keywords & Technologies
            </h4>
            <span className="text-xs font-mono tabular-nums text-neutral-500">
              {atsResult.extractedSkills.length} matches
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {atsResult.extractedSkills.map((skill) => (
              <span
                key={skill}
                className="font-mono text-xs text-neutral-300 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Extracted snippet */}
      {extractedSnippet && (
        <div className="mt-4 rounded-lg bg-neutral-950/60 p-4 border border-neutral-800/80">
          <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            Document Text Sample
          </h4>
          <pre className="font-mono text-xs text-neutral-400 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all bg-neutral-900/90 p-3 rounded border border-neutral-800">
            {extractedSnippet}
          </pre>
        </div>
      )}

      {/* Recommendations */}
      <div className="mt-4 rounded-lg bg-neutral-950/40 p-4 border border-neutral-800/80">
        <h4 className="text-xs font-semibold text-neutral-300 mb-2">
          ATS Evaluation Notes
        </h4>
        <ul className="space-y-1.5 text-xs text-neutral-400">
          {atsResult.recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-rose-400 select-none">›</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
