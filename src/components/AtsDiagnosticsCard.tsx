import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, Copy, Check, ArrowRight, Lightbulb, FileSearch, UserCheck } from 'lucide-react';

export interface BulletRewrite {
  category: string;
  impactBoost: string;
  beforeLabel: string;
  beforeText: string;
  afterLabel: string;
  afterText: string;
}

export interface KeywordCategory {
  name: string;
  status: 'missing' | 'found' | 'recommended';
  frequency?: number;
  importance: 'High' | 'Medium' | 'Low';
  contextTip: string;
}

export interface DiagnosticsData {
  score: number;
  tierKicker: string;
  matchTitle: string;
  matchDescription: string;
  metrics: {
    impact: { value: number; label: string };
    atsFit: { value: number; label: string };
    structure: { value: number; label: string };
    brevity: { value: number; label: string };
  };
  bulletRewrites: BulletRewrite[];
  keywords: KeywordCategory[];
  formattingChecks: {
    title: string;
    description: string;
    passed: boolean;
  }[];
  recruiterSummary: {
    overview: string;
    strengths: string[];
    interviewPrompts: string[];
  };
}

interface AtsDiagnosticsCardProps {
  data: DiagnosticsData;
  candidateName?: string;
}

export const AtsDiagnosticsCard: React.FC<AtsDiagnosticsCardProps> = ({
  data,
  candidateName,
}) => {
  const [activeTab, setActiveTab] = useState<
    'rewrites' | 'keywords' | 'formatting' | 'recruiter'
  >('rewrites');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyRewrite = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // SVG Circular progress math
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (data.score / 100) * circumference;

  return (
    <div className="w-full rounded-2xl border border-neutral-800/90 bg-[#0d1117] p-6 lg:p-8 shadow-2xl space-y-6">
      
      {/* Top Section: Radial Score + Headline + Metric Cards */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-neutral-800/80">
        
        {/* Left: Score Gauge + Diagnosis Headline */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Circular Score Gauge */}
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-neutral-800"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Progress ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-rose-500 transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black font-mono tracking-tight text-white tabular-nums">
                {data.score}
              </span>
              <span className="text-[10px] font-mono text-neutral-400">/100</span>
            </div>
          </div>

          {/* Diagnosis Headline & Kicker */}
          <div className="space-y-1.5 max-w-xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wider uppercase">
              <span className="text-neutral-400">AUDIT STATUS</span>
              <span className="text-neutral-600">·</span>
              <span className="text-emerald-400">{data.tierKicker}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
              {data.matchTitle}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              {data.matchDescription}
            </p>
          </div>
        </div>

        {/* Right: 4 Metrics Badges in a Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 xl:shrink-0">
          
          {/* IMPACT */}
          <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-3 text-center min-w-[90px]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              IMPACT
            </div>
            <div className="text-lg font-bold font-mono text-rose-500 tabular-nums mt-0.5">
              {data.metrics.impact.value}%
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5">
              {data.metrics.impact.label}
            </div>
          </div>

          {/* ATS FIT */}
          <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-3 text-center min-w-[90px]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              ATS FIT
            </div>
            <div className="text-lg font-bold font-mono text-amber-400 tabular-nums mt-0.5">
              {data.metrics.atsFit.value}%
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5">
              {data.metrics.atsFit.label}
            </div>
          </div>

          {/* STRUCTURE */}
          <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-3 text-center min-w-[90px]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              STRUCTURE
            </div>
            <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums mt-0.5">
              {data.metrics.structure.value}%
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5">
              {data.metrics.structure.label}
            </div>
          </div>

          {/* BREVITY */}
          <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-3 text-center min-w-[90px]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              BREVITY
            </div>
            <div className="text-lg font-bold font-mono text-amber-300 tabular-nums mt-0.5">
              {data.metrics.brevity.value}%
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5">
              {data.metrics.brevity.label}
            </div>
          </div>

        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-neutral-800">
        <nav className="flex space-x-6 sm:space-x-8 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('rewrites')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer relative ${
              activeTab === 'rewrites'
                ? 'text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Actionable Bullet Rewrites
            {activeTab === 'rewrites' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('keywords')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer relative ${
              activeTab === 'keywords'
                ? 'text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Missing ATS Keywords
            {activeTab === 'keywords' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('formatting')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer relative ${
              activeTab === 'formatting'
                ? 'text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Parser Formatting Audit
            {activeTab === 'formatting' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('recruiter')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer relative ${
              activeTab === 'recruiter'
                ? 'text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Recruiter Summary
            {activeTab === 'recruiter' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />
            )}
          </button>
        </nav>
      </div>

      {/* Tab 1: Actionable Bullet Rewrites */}
      {activeTab === 'rewrites' && (
        <div className="space-y-4 pt-1">
          <p className="text-xs text-neutral-400 leading-relaxed">
            The n8n workflow identifies passive or weak phrasing and rewrites bullets using the Google XYZ formula: <span className="font-semibold text-neutral-200">"Accomplished [X] as measured by [Y] by doing [Z]"</span>.
          </p>

          <div className="space-y-4">
            {data.bulletRewrites.map((rewrite, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-4 sm:p-5 space-y-3"
              >
                {/* Header with Category & Boost Tag */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                    {rewrite.category}
                  </span>
                  <span className="text-[11px] font-bold font-mono text-amber-400/90 bg-amber-950/30 border border-amber-800/50 px-2 py-0.5 rounded">
                    {rewrite.impactBoost}
                  </span>
                </div>

                {/* 2 Columns: Before vs After */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* Before (Passive/Vague) */}
                  <div className="rounded-lg border border-rose-900/30 bg-rose-950/15 p-3.5 space-y-1.5">
                    <span className="text-[11px] font-semibold text-rose-400/90 block">
                      {rewrite.beforeLabel}
                    </span>
                    <p className="text-xs text-neutral-300 italic leading-relaxed">
                      {rewrite.beforeText}
                    </p>
                  </div>

                  {/* After (n8n AI Optimization) */}
                  <div className="relative rounded-lg border border-emerald-900/40 bg-emerald-950/20 p-3.5 space-y-1.5 group">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-emerald-400 block">
                        {rewrite.afterLabel}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyRewrite(rewrite.afterText, idx)}
                        className="text-[11px] text-neutral-400 hover:text-emerald-300 inline-flex items-center gap-1 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                      {rewrite.afterText}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Missing ATS Keywords */}
      {activeTab === 'keywords' && (
        <div className="space-y-4 pt-1">
          <p className="text-xs text-neutral-400 leading-relaxed">
            Keywords extracted from top 1,000 engineering job descriptions matching this seniority tier. Missing high-frequency terms can trigger automated screening rejections.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.keywords.map((kw, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-white">
                      {kw.name}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        kw.status === 'missing'
                          ? 'bg-rose-950/30 text-rose-400 border-rose-800/40'
                          : 'bg-emerald-950/30 text-emerald-400 border-emerald-800/40'
                      }`}
                    >
                      {kw.status === 'missing' ? 'Missing from Resume' : 'Found in Resume'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500">
                    {kw.importance} Priority
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {kw.contextTip}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Parser Formatting Audit */}
      {activeTab === 'formatting' && (
        <div className="space-y-4 pt-1">
          <p className="text-xs text-neutral-400 leading-relaxed">
            Technical structural audit verifying how Applicant Tracking Systems (Workday, Greenhouse, Lever, Taleo) ingest this document's text flow.
          </p>

          <div className="divide-y divide-neutral-800/80 rounded-xl border border-neutral-800 bg-neutral-950/60">
            {data.formattingChecks.map((check, idx) => (
              <div key={idx} className="p-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {check.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                    )}
                    <span className="text-xs font-semibold text-white">
                      {check.title}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed pl-6">
                    {check.description}
                  </p>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${
                    check.passed
                      ? 'bg-emerald-950/30 text-emerald-400 border-emerald-800/40'
                      : 'bg-amber-950/30 text-amber-400 border-amber-800/40'
                  }`}
                >
                  {check.passed ? 'PASSED' : 'ACTION REQUIRED'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Recruiter Summary */}
      {activeTab === 'recruiter' && (
        <div className="space-y-4 pt-1">
          <p className="text-xs text-neutral-400 leading-relaxed">
            30-second automated executive brief generated by the n8n AI engine for the hiring manager and interview panel.
          </p>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Executive Briefing
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {data.recruiterSummary.overview}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 space-y-2.5">
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Top Standout Strengths
              </h4>
              <ul className="space-y-1.5 text-xs text-neutral-300">
                {data.recruiterSummary.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 space-y-2.5">
              <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Target Interview Validation Prompts
              </h4>
              <ul className="space-y-1.5 text-xs text-neutral-300">
                {data.recruiterSummary.interviewPrompts.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400">›</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
