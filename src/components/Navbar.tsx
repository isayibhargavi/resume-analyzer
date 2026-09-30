import React from 'react';
import { N8nConfig } from '../types';
import { Settings, ShieldCheck, Activity, Terminal } from 'lucide-react';

interface NavbarProps {
  n8nConfig: N8nConfig;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenDocs: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  n8nConfig,
  onOpenSettings,
  onOpenHistory,
  onOpenDocs,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single Text Wordmark */}
        <a href="#portal" className="text-lg font-bold tracking-tight text-white hover:text-rose-400 transition-colors">
          Resume Analyzer
        </a>

        {/* Zone 2: Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-400">
          <a href="#portal" className="hover:text-white transition-colors">
            Submission Portal
          </a>
          <a href="#preflight" className="hover:text-white transition-colors">
            ATS Pre-Flight
          </a>
          <button 
            type="button" 
            onClick={onOpenDocs} 
            className="hover:text-white transition-colors cursor-pointer text-left"
          >
            n8n Pipeline
          </button>
          <button 
            type="button" 
            onClick={onOpenHistory} 
            className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Submissions</span>
            {historyCount > 0 && (
              <span className="font-mono text-xs tabular-nums text-neutral-300">
                ({historyCount})
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSettings}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/90 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:border-neutral-700 hover:text-white transition-all whitespace-nowrap"
            title="Configure n8n Webhook Endpoint"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                n8nConfig.mode === 'production'
                  ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                  : n8nConfig.mode === 'test'
                  ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                  : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
              }`}
            />
            <span className="capitalize">{n8nConfig.mode} Webhook</span>
            <Settings className="h-3.5 w-3.5 text-neutral-400" />
          </button>

          <button
            type="button"
            onClick={onOpenDocs}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-200 transition-colors whitespace-nowrap"
          >
            <Terminal className="h-3.5 w-3.5 text-rose-400" />
            <span>Workflow Schema</span>
          </button>
        </div>
      </div>
    </header>
  );
};
