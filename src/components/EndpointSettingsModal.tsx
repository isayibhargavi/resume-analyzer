import React, { useState } from 'react';
import { N8nConfig, N8nMode } from '../types';
import { pingN8nEndpoint, PingResult } from '../services/n8nService';
import { X, Check, AlertCircle, RefreshCw, ExternalLink, Zap, HelpCircle } from 'lucide-react';

interface EndpointSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: N8nConfig;
  onSaveConfig: (newConfig: N8nConfig) => void;
}

export const EndpointSettingsModal: React.FC<EndpointSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [selectedMode, setSelectedMode] = useState<N8nMode>(config.mode);
  const [customUrl, setCustomUrl] = useState<string>(
    config.mode === 'custom' ? config.url : ''
  );
  const [pingResult, setPingResult] = useState<PingResult | null>(null);
  const [isPinging, setIsPinging] = useState<boolean>(false);

  if (!isOpen) return null;

  const getEffectiveUrl = (mode: N8nMode): string => {
    if (mode === 'production') return config.prodUrl;
    if (mode === 'test') return config.testUrl;
    return customUrl.trim() || config.prodUrl;
  };

  const handleTestConnection = async () => {
    setIsPinging(true);
    setPingResult(null);
    try {
      const targetUrl = getEffectiveUrl(selectedMode);
      const res = await pingN8nEndpoint(targetUrl);
      setPingResult(res);
    } catch {
      setPingResult({
        ok: false,
        status: 0,
        message: 'Network request failed. Verify endpoint URL.',
        isListening: false,
        requiresExecuteStep: false,
        isProductionReady: false,
      });
    } finally {
      setIsPinging(false);
    }
  };

  const handleSave = () => {
    const targetUrl = getEffectiveUrl(selectedMode);
    onSaveConfig({
      ...config,
      mode: selectedMode,
      url: targetUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div>
            <h2 className="text-base font-semibold text-white">n8n Webhook Configuration</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Select or customize the target n8n Form Trigger endpoint
            </p>
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
        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
              Select Endpoint Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Production option */}
              <button
                type="button"
                onClick={() => {
                  setSelectedMode('production');
                  setPingResult(null);
                }}
                className={`flex flex-col text-left p-3 rounded-lg border text-xs transition-all ${
                  selectedMode === 'production'
                    ? 'border-emerald-500/60 bg-emerald-950/20 text-white'
                    : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-emerald-400">Production</span>
                  {selectedMode === 'production' && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                </div>
                <span className="text-[11px] text-neutral-400 mt-1">
                  Active 24/7 workflow trigger
                </span>
                <span className="font-mono text-[10px] text-neutral-500 truncate mt-2">
                  /form/...
                </span>
              </button>

              {/* Test option */}
              <button
                type="button"
                onClick={() => {
                  setSelectedMode('test');
                  setPingResult(null);
                }}
                className={`flex flex-col text-left p-3 rounded-lg border text-xs transition-all ${
                  selectedMode === 'test'
                    ? 'border-amber-500/60 bg-amber-950/20 text-white'
                    : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-amber-400">Test Mode</span>
                  {selectedMode === 'test' && <Check className="h-3.5 w-3.5 text-amber-400" />}
                </div>
                <span className="text-[11px] text-neutral-400 mt-1">
                  n8n Canvas listening
                </span>
                <span className="font-mono text-[10px] text-neutral-500 truncate mt-2">
                  /form-test/...
                </span>
              </button>

              {/* Custom option */}
              <button
                type="button"
                onClick={() => {
                  setSelectedMode('custom');
                  setPingResult(null);
                }}
                className={`flex flex-col text-left p-3 rounded-lg border text-xs transition-all ${
                  selectedMode === 'custom'
                    ? 'border-rose-500/60 bg-rose-950/20 text-white'
                    : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-rose-400">Custom URL</span>
                  {selectedMode === 'custom' && <Check className="h-3.5 w-3.5 text-rose-400" />}
                </div>
                <span className="text-[11px] text-neutral-400 mt-1">
                  Custom webhook endpoint
                </span>
                <span className="font-mono text-[10px] text-neutral-500 truncate mt-2">
                  User defined
                </span>
              </button>
            </div>
          </div>

          {/* Active URL display or input */}
          <div className="rounded-lg bg-neutral-950 p-3.5 border border-neutral-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-neutral-300">Target Webhook URL</span>
              <a
                href={getEffectiveUrl(selectedMode)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 hover:underline"
              >
                <span>Open in n8n</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {selectedMode === 'custom' ? (
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://your-n8n.cloud/form/..."
                className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs font-mono text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none"
              />
            ) : (
              <div className="rounded bg-neutral-900/90 px-3 py-2 font-mono text-xs text-neutral-300 break-all border border-neutral-800">
                {getEffectiveUrl(selectedMode)}
              </div>
            )}
          </div>

          {/* Connection Test Box */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-950/40 p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-rose-400" />
                <span className="text-xs font-medium text-white">Endpoint Health Check</span>
              </div>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isPinging}
                className="inline-flex items-center gap-1.5 rounded bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 text-xs text-neutral-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 ${isPinging ? 'animate-spin' : ''}`} />
                <span>{isPinging ? 'Testing...' : 'Test Connection'}</span>
              </button>
            </div>

            {pingResult && (
              <div
                className={`mt-3 rounded p-2.5 text-xs flex items-start gap-2 ${
                  pingResult.ok
                    ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-800/60'
                    : pingResult.requiresExecuteStep
                    ? 'bg-amber-950/30 text-amber-300 border border-amber-800/60'
                    : 'bg-rose-950/30 text-rose-300 border border-rose-800/60'
                }`}
              >
                {pingResult.ok ? (
                  <Check className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">{pingResult.message}</p>
                  {pingResult.requiresExecuteStep && (
                    <div className="mt-1.5 text-[11px] text-amber-400/90 space-y-1">
                      <p>
                        💡 <strong>Quick Fix:</strong> In n8n, click <strong>Execute step</strong> on your Form Trigger node, OR switch to <strong>Production</strong> mode above which is already active!
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMode('production');
                          setPingResult(null);
                        }}
                        className="underline font-semibold hover:text-white"
                      >
                        Switch to Production Mode now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-semibold text-white transition-colors"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};
