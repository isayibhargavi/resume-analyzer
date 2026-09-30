import React from 'react';
import { CheckCircle2, X, FileText, ArrowRight, Download, Calendar, Mail, User } from 'lucide-react';
import { SubmitResult } from '../services/n8nService';

interface SubmissionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: {
    name: string;
    email: string;
    fileName: string;
    fileSizeBytes: number;
    submitResult: SubmitResult;
    targetRole?: string;
  } | null;
  onViewHistory: () => void;
}

export const SubmissionSuccessModal: React.FC<SubmissionSuccessModalProps> = ({
  isOpen,
  onClose,
  candidate,
  onViewHistory,
}) => {
  if (!isOpen || !candidate) return null;

  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-xl border border-neutral-800 bg-neutral-900 p-6 sm:p-7 shadow-2xl">
        
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Success header */}
        <div className="flex items-center gap-3 pb-4 border-b border-neutral-800">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-950/60 border border-emerald-800/80 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              Resume Dispatched Successfully
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Received and acknowledged by n8n workflow pipeline
            </p>
          </div>
        </div>

        {/* Content details */}
        <div className="mt-5 space-y-4">
          <div className="rounded-lg bg-neutral-950/80 p-4 border border-neutral-800/80 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-neutral-400">
                <User className="h-3.5 w-3.5" />
                Candidate Name
              </span>
              <span className="font-semibold text-white">{candidate.name}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-neutral-400">
                <Mail className="h-3.5 w-3.5" />
                Email Address
              </span>
              <span className="font-mono text-neutral-300">{candidate.email}</span>
            </div>

            {candidate.targetRole && (
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Target Role</span>
                <span className="text-neutral-300">{candidate.targetRole}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-neutral-400">
                <FileText className="h-3.5 w-3.5" />
                Attached Resume
              </span>
              <span className="font-mono text-rose-400 truncate max-w-[200px]" title={candidate.fileName}>
                {candidate.fileName}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60">
              <span className="flex items-center gap-2 text-neutral-500">
                <Calendar className="h-3.5 w-3.5" />
                Dispatch Time
              </span>
              <span className="font-mono text-neutral-400 tabular-nums">{now}</span>
            </div>
          </div>

          {/* n8n Status feedback */}
          <div className="rounded-lg border border-emerald-800/40 bg-emerald-950/20 p-3 text-xs text-emerald-300">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Workflow Status</span>
              <span className="font-mono text-[11px] text-emerald-400">HTTP 200 OK</span>
            </div>
            <p className="mt-1 text-[11px] text-neutral-300 leading-relaxed">
              {candidate.submitResult.message || 'Your response has been recorded and scheduled for evaluation.'}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-neutral-800">
          <button
            type="button"
            onClick={() => {
              onClose();
              onViewHistory();
            }}
            className="w-full sm:w-auto text-xs text-neutral-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 py-2"
          >
            <span>View Audit Log</span>
            <ArrowRight className="h-3 w-3" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto rounded-lg bg-neutral-800 hover:bg-neutral-700 px-5 py-2 text-xs font-semibold text-white transition-colors"
          >
            Submit Another Candidate
          </button>
        </div>
      </div>
    </div>
  );
};
