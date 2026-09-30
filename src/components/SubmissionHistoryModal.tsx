import React, { useState } from 'react';
import { SubmissionRecord } from '../types';
import { clearSubmissionHistory } from '../services/n8nService';
import { X, Trash2, CheckCircle2, AlertCircle, FileText, ChevronRight, Download } from 'lucide-react';

interface SubmissionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: SubmissionRecord[];
  onHistoryUpdated: () => void;
}

export const SubmissionHistoryModal: React.FC<SubmissionHistoryModalProps> = ({
  isOpen,
  onClose,
  records,
  onHistoryUpdated,
}) => {
  const [selectedRecord, setSelectedRecord] = useState<SubmissionRecord | null>(null);

  if (!isOpen) return null;

  const handleClear = () => {
    if (confirm('Clear all submission records from local storage?')) {
      clearSubmissionHistory();
      onHistoryUpdated();
      setSelectedRecord(null);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `resume_submissions_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-white">Submission Audit Log</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              History of resumes dispatched to the n8n Resume Analyzer webhook
            </p>
          </div>
          <div className="flex items-center gap-2">
            {records.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                  title="Export JSON"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-rose-400 transition-colors"
                  title="Clear history"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors ml-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-3 min-h-0 pr-1">
          {records.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto h-8 w-8 text-neutral-600 mb-2" />
              <p className="text-sm font-semibold text-neutral-400">No submissions recorded yet</p>
              <p className="text-xs text-neutral-500 mt-1">
                Submissions dispatched through this portal will appear here with timestamps and server responses.
              </p>
            </div>
          ) : (
            records.map((rec) => (
              <div
                key={rec.id}
                className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4 hover:border-neutral-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {rec.status === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{rec.name}</span>
                        <span className="font-mono text-[11px] text-neutral-400">· {rec.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono mt-0.5">
                        <span>{new Date(rec.timestamp).toLocaleString()}</span>
                        <span>·</span>
                        <span className="capitalize">{rec.mode} Webhook</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-neutral-400 truncate max-w-[150px]">
                      {rec.fileName}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedRecord(selectedRecord?.id === rec.id ? null : rec)
                      }
                      className="rounded bg-neutral-800 hover:bg-neutral-700 px-2 py-1 text-[11px] text-neutral-300"
                    >
                      {selectedRecord?.id === rec.id ? 'Hide Details' : 'Details'}
                    </button>
                  </div>
                </div>

                {/* Expanded record details */}
                {selectedRecord?.id === rec.id && (
                  <div className="mt-3 pt-3 border-t border-neutral-800/80 text-xs space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-neutral-400">
                      <div>
                        <span className="text-neutral-500">Endpoint:</span>{' '}
                        <span className="font-mono text-neutral-300 break-all">{rec.endpointUrl}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500">File Size:</span>{' '}
                        <span className="font-mono text-neutral-300">
                          {Math.round(rec.fileSizeBytes / 1024)} KB
                        </span>
                      </div>
                    </div>
                    {rec.rawResponse && (
                      <div>
                        <span className="text-neutral-500 block mb-1">Server Response:</span>
                        <pre className="p-2.5 rounded bg-neutral-900 border border-neutral-800 font-mono text-[11px] text-neutral-300 overflow-x-auto whitespace-pre-wrap max-h-32">
                          {rec.rawResponse}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-neutral-800 flex justify-end shrink-0">
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
