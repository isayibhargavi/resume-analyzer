import React from 'react';
import { N8nConfig } from '../types';
import { FileText, Cpu, ExternalLink, Settings, Terminal, History } from 'lucide-react';

interface NavbarProps {
  n8nConfig: N8nConfig;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenDocs: () => void;
  historyCount: number;
  endpointStatus: 'checking' | 'ready' | 'idle-test' | 'error';
}

export const Navbar: React.FC<NavbarProps> = ({
  n8nConfig,
  onOpenSettings,
  onOpenHistory,
  onOpenDocs,
  historyCount,
  endpointStatus,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Area */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-rose-500/50 bg-rose-950/20 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.15)]">
            <FileText className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <a href="#" className="flex items-baseline text-lg font-bold tracking-tight">
                <span className="text-white">Resume</span>
                <span className="text-[#ea4b71]">Analyser</span>
              </a>
              <span className="rounded bg-rose-950/40 border border-rose-800/50 px-1.5 py-0.5 text-[10px] font-mono font-semibold tracking-wider text-rose-300">
                N8N CLOUD
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-medium">
              Automated Workflow &amp; ATS Diagnostics
            </p>
          </div>
        </div>

        {/* Right Navigation & Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Submissions count (quick link) */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="hidden lg:flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <History className="h-3.5 w-3.5 text-neutral-500" />
            <span>Submissions</span>
            {historyCount > 0 && (
              <span className="font-mono text-[11px] text-neutral-400 tabular-nums">
                ({historyCount})
              </span>
            )}
          </button>

          {/* Workflow Live status pill */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/80 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors cursor-pointer"
            title="Configure n8n Webhook Endpoint"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                endpointStatus === 'ready'
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)] animate-pulse'
                  : endpointStatus === 'idle-test'
                  ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]'
                  : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]'
              }`}
            />
            <span className="text-neutral-200">
              {endpointStatus === 'ready'
                ? 'Workflow Live'
                : endpointStatus === 'idle-test'
                ? 'Test Mode Waiting'
                : 'Webhook Offline'}
            </span>
            <Cpu className="h-3.5 w-3.5 text-neutral-500" />
          </button>

          {/* Raw n8n Form link */}
          <a
            href={n8nConfig.url}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <span>Raw n8n Form</span>
            <ExternalLink className="h-3.5 w-3.5 text-neutral-500" />
          </a>

          {/* Workflow Config CTA Button */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#ea4b71] hover:bg-[#d63d60] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Workflow Config</span>
          </button>

        </div>
      </div>
    </header>
  );
};
