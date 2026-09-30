import React, { useState } from 'react';
import { N8nConfig } from '../types';
import { X, Copy, Check, Terminal, ExternalLink, Workflow, ArrowRight } from 'lucide-react';

interface WorkflowDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: N8nConfig;
}

export const WorkflowDocsModal: React.FC<WorkflowDocsModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const curlCommand = `curl -X POST "${config.url}" \\
  -F "field-0=Jane Doe" \\
  -F "field-1=jane.doe@example.com" \\
  -F "field-2=@/path/to/resume.pdf"`;

  const handleCopy = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800 text-rose-400">
              <Workflow className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">n8n Resume Analyzer Architecture</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Technical specification & payload schema for your n8n workflow
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-5 min-h-0 pr-1 text-xs">
          
          {/* Schema Table */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider mb-2">
              Form Trigger Input Schema
            </h3>
            <div className="rounded-lg border border-neutral-800 overflow-hidden">
              <table className="w-full text-left font-mono">
                <thead className="bg-neutral-950 text-neutral-400 text-[11px] border-b border-neutral-800">
                  <tr>
                    <th className="py-2 px-3">Field Key</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Required</th>
                    <th className="py-2 px-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80 bg-neutral-900/60 text-neutral-300 text-[11px]">
                  <tr>
                    <td className="py-2 px-3 text-rose-400 font-semibold">field-0</td>
                    <td className="py-2 px-3 text-neutral-400">String</td>
                    <td className="py-2 px-3 text-emerald-400">Yes</td>
                    <td className="py-2 px-3 font-sans">Candidate Full Name</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-rose-400 font-semibold">field-1</td>
                    <td className="py-2 px-3 text-neutral-400">String (Email)</td>
                    <td className="py-2 px-3 text-emerald-400">Yes</td>
                    <td className="py-2 px-3 font-sans">Candidate Contact Email</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-rose-400 font-semibold">field-2</td>
                    <td className="py-2 px-3 text-neutral-400">Binary (File)</td>
                    <td className="py-2 px-3 text-emerald-400">Yes</td>
                    <td className="py-2 px-3 font-sans">Uploaded Resume (PDF/DOCX/TXT)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Test vs Production Explainer */}
          <div className="rounded-lg bg-neutral-950 p-4 border border-neutral-800 space-y-2">
            <h4 className="text-xs font-semibold text-white">
              Understanding n8n Endpoint Modes
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded border border-neutral-800/80 bg-neutral-900/60">
                <span className="font-semibold text-emerald-400 block mb-1">
                  Production Mode (/form/...)
                </span>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                  The workflow is published and permanently active in n8n. Submissions are processed immediately 24/7 without needing user interaction in the n8n canvas.
                </p>
              </div>

              <div className="p-3 rounded border border-neutral-800/80 bg-neutral-900/60">
                <span className="font-semibold text-amber-400 block mb-1">
                  Test Mode (/form-test/...)
                </span>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                  Used while building your workflow in the n8n editor. Requires clicking the "Execute step" button on the Form Trigger node before sending a request.
                </p>
              </div>
            </div>
          </div>

          {/* cURL snippet */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider">
                Direct cURL Terminal Command
              </h3>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copied' : 'Copy cURL'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-[11px] text-neutral-300 overflow-x-auto whitespace-pre leading-relaxed select-all">
              {curlCommand}
            </pre>
          </div>

          {/* Suggested Downstream Nodes */}
          <div className="rounded-lg bg-neutral-950/60 p-4 border border-neutral-800">
            <h4 className="text-xs font-semibold text-white mb-2">
              Recommended n8n Pipeline Steps
            </h4>
            <div className="space-y-2 text-[11px] text-neutral-400 font-sans">
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded bg-neutral-800 text-rose-400 font-mono flex items-center justify-center shrink-0">1</span>
                <span><strong>Form Trigger:</strong> Ingests Name, Email, and Binary Resume</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded bg-neutral-800 text-rose-400 font-mono flex items-center justify-center shrink-0">2</span>
                <span><strong>AI / LLM Node:</strong> Reads PDF binary &amp; scores ATS suitability, skills, and culture fit</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded bg-neutral-800 text-rose-400 font-mono flex items-center justify-center shrink-0">3</span>
                <span><strong>Google Sheets / Airtable:</strong> Records candidate record and analysis summary</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded bg-neutral-800 text-rose-400 font-mono flex items-center justify-center shrink-0">4</span>
                <span><strong>Gmail / Slack:</strong> Automatically sends feedback to candidate or alerts recruitment team</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-neutral-800 flex justify-between items-center shrink-0">
          <a
            href={config.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300"
          >
            <span>Open n8n Form Trigger</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-neutral-800 hover:bg-neutral-700 px-4 py-1.5 text-xs font-semibold text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
