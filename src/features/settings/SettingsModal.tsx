import React, { useState } from 'react';
import { useSystemSettings } from './SettingsContext';
import { testNodeConnection } from '../../services/api';
import type { ConnectionTestResponse } from '../../types/settings';
import {
  X,
  Server,
  Cpu,
  Store,
  Layers,
  Lock,
  Activity,
  CheckCircle2,
  XCircle,
  Loader2,
  RotateCcw,
  Wifi,
  Shield,
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    closeSettings,
    settings,
    updateSettings,
    resetSettings,
    activeTab,
    setActiveTab,
    nodes,
    refreshNodes,
    isLoadingNodes,
  } = useSystemSettings();

  const [testResults, setTestResults] = useState<Record<string, ConnectionTestResponse | null>>({});
  const [testingComponent, setTestingComponent] = useState<string | null>(null);

  if (!isSettingsOpen) return null;

  const handleTestConnection = async (component: 'engine' | 'ollama' | 'merchant', url: string, apiKey?: string) => {
    try {
      setTestingComponent(component);
      const res = await testNodeConnection({
        component,
        url,
        api_key: apiKey,
      });
      setTestResults((prev) => ({ ...prev, [component]: res }));
    } catch (err: any) {
      setTestResults((prev) => ({
        ...prev,
        [component]: {
          success: false,
          component,
          url,
          latency_ms: 0,
          details: err?.message || 'Connection test failed',
        },
      }));
    } finally {
      setTestingComponent(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white border border-slate-200 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center shadow-xs">
              <Server size={20} />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-slate-900 leading-tight">
                System & Inference Node Settings
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure on-device and remote inference endpoints, hardware acceleration, and privacy
              </p>
            </div>
          </div>

          <button
            onClick={closeSettings}
            className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200/80 bg-white flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'nodes', label: 'Inference Nodes', icon: Cpu },
            { id: 'precision', label: 'Enrichment & Precision', icon: Layers },
            { id: 'privacy', label: 'Privacy & Storage', icon: Lock },
            { id: 'diagnostics', label: 'Node Health', icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-amber-600 text-amber-900 bg-amber-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-amber-600' : 'text-slate-400'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm">
          {/* TAB 1: INFERENCE NODES */}
          {activeTab === 'nodes' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* SECTION: Engine Node & Offload */}
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-emerald-600" />
                      <h4 className="font-semibold text-slate-900 text-sm">CreditMitra Engine Node</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        Pipeline Orchestrator
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Configure execution target. Choose between local on-device processing or offloading heavy extraction workloads.
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={settings.remoteEngineOffload}
                      onChange={(e) => updateSettings({ remoteEngineOffload: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                    <span>Engine Inference Link</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {settings.remoteEngineOffload ? 'Dedicated Remote Node' : 'Local On-Device Engine'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={settings.engineUrl}
                      onChange={(e) => updateSettings({ engineUrl: e.target.value })}
                      placeholder="http://localhost:8000/api/v1"
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                    <button
                      onClick={() => handleTestConnection('engine', settings.engineUrl)}
                      disabled={testingComponent === 'engine'}
                      className="px-3.5 py-2 bg-white border border-slate-300 hover:border-amber-400 hover:bg-amber-50 text-slate-700 hover:text-amber-900 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      {testingComponent === 'engine' ? (
                        <Loader2 size={13} className="animate-spin text-amber-600" />
                      ) : (
                        <Wifi size={13} className="text-slate-500" />
                      )}
                      <span>Test Ping</span>
                    </button>
                  </div>

                  {testResults['engine'] && (
                    <div
                      className={`p-2.5 rounded-xl text-xs flex items-center justify-between border ${
                        testResults['engine']?.success
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {testResults['engine']?.success ? (
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle size={14} className="text-rose-600 shrink-0" />
                        )}
                        <span className="truncate">{testResults['engine']?.details}</span>
                      </div>
                      <span className="font-mono text-[11px] font-semibold shrink-0">
                        {testResults['engine']?.latency_ms}ms
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION: Ollama Inference Node */}
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Cpu size={16} className="text-amber-600" />
                      <h4 className="font-semibold text-slate-900 text-sm">Ollama LLM Inference Host</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                        payee-lora
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Endpoint for local LLM payee normalization, transaction span resolution, and narration decomposition.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 block">Ollama Server URL</label>
                    <input
                      type="text"
                      value={settings.ollamaUrl}
                      onChange={(e) => updateSettings({ ollamaUrl: e.target.value })}
                      placeholder="http://localhost:11434"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 block">Payee Model Tag</label>
                    <input
                      type="text"
                      value={settings.ollamaModel}
                      onChange={(e) => updateSettings({ ollamaModel: e.target.value })}
                      placeholder="payee-lora:latest"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.useGpuAcceleration}
                        onChange={(e) => updateSettings({ useGpuAcceleration: e.target.checked })}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span>GPU / Metal Acceleration</span>
                    </label>

                    <div className="flex items-center gap-1.5 text-slate-500">
                      <span>Keep Alive:</span>
                      <select
                        value={settings.ollamaKeepAlive}
                        onChange={(e) => updateSettings({ ollamaKeepAlive: e.target.value })}
                        className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-xs text-slate-700"
                      >
                        <option value="15m">15 min</option>
                        <option value="30m">30 min (default)</option>
                        <option value="60m">60 min</option>
                        <option value="-1">Indefinite</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTestConnection('ollama', settings.ollamaUrl)}
                    disabled={testingComponent === 'ollama'}
                    className="px-3.5 py-1.5 bg-white border border-slate-300 hover:border-amber-400 hover:bg-amber-50 text-slate-700 hover:text-amber-900 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    {testingComponent === 'ollama' ? (
                      <Loader2 size={13} className="animate-spin text-amber-600" />
                    ) : (
                      <Wifi size={13} className="text-slate-500" />
                    )}
                    <span>Test Ollama</span>
                  </button>
                </div>

                {testResults['ollama'] && (
                  <div
                    className={`p-2.5 rounded-xl text-xs flex items-center justify-between border ${
                      testResults['ollama']?.success
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {testResults['ollama']?.success ? (
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle size={14} className="text-rose-600 shrink-0" />
                      )}
                      <span className="truncate">{testResults['ollama']?.details}</span>
                    </div>
                    <span className="font-mono text-[11px] font-semibold shrink-0">
                      {testResults['ollama']?.latency_ms}ms
                    </span>
                  </div>
                )}
              </div>

              {/* SECTION: Merchant Intelligence Server */}
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Store size={16} className="text-indigo-600" />
                      <h4 className="font-semibold text-slate-900 text-sm">Merchant Intelligence Server</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 font-bold">
                        Standalone Node
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Centralized curation microservice hosting canonical Indian merchant registry, GST validation, and alias ledger.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 block">Server URL</label>
                    <input
                      type="text"
                      value={settings.merchantServerUrl}
                      onChange={(e) => updateSettings({ merchantServerUrl: e.target.value })}
                      placeholder="http://localhost:8001"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 block">API Shared Secret Key</label>
                    <input
                      type="password"
                      value={settings.merchantApiKey}
                      onChange={(e) => updateSettings({ merchantApiKey: e.target.value })}
                      placeholder="Bearer token or leave empty for local"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() =>
                      handleTestConnection('merchant', settings.merchantServerUrl, settings.merchantApiKey)
                    }
                    disabled={testingComponent === 'merchant'}
                    className="px-3.5 py-1.5 bg-white border border-slate-300 hover:border-amber-400 hover:bg-amber-50 text-slate-700 hover:text-amber-900 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    {testingComponent === 'merchant' ? (
                      <Loader2 size={13} className="animate-spin text-amber-600" />
                    ) : (
                      <Wifi size={13} className="text-slate-500" />
                    )}
                    <span>Test Merchant Server</span>
                  </button>
                </div>

                {testResults['merchant'] && (
                  <div
                    className={`p-2.5 rounded-xl text-xs flex items-center justify-between border ${
                      testResults['merchant']?.success
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {testResults['merchant']?.success ? (
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle size={14} className="text-rose-600 shrink-0" />
                      )}
                      <span className="truncate">{testResults['merchant']?.details}</span>
                    </div>
                    <span className="font-mono text-[11px] font-semibold shrink-0">
                      {testResults['merchant']?.latency_ms}ms
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ENRICHMENT & PRECISION */}
          {activeTab === 'precision' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Docling Table Parser Settings */}
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Docling PDF Table Extraction Engine</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Controls table boundary detection for borderless, multi-line Indian bank statements.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => updateSettings({ extractionPrecision: 'high_precision' })}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      settings.extractionPrecision === 'high_precision'
                        ? 'bg-amber-50/90 border-amber-300 text-amber-950 shadow-2xs font-medium'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-semibold block text-xs">High-Precision Visual Hybrid</span>
                    <span className="text-[11px] text-slate-500 block mt-1 leading-snug">
                      Docling Table Transformer + OCR recovery for borderless and handwritten statements.
                    </span>
                  </button>

                  <button
                    onClick={() => updateSettings({ extractionPrecision: 'fast' })}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      settings.extractionPrecision === 'fast'
                        ? 'bg-amber-50/90 border-amber-300 text-amber-950 shadow-2xs font-medium'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-semibold block text-xs">Fast Native Stream Extraction</span>
                    <span className="text-[11px] text-slate-500 block mt-1 leading-snug">
                      Optimized for native digital PDF statements with structured PDF text streams.
                    </span>
                  </button>
                </div>
              </div>

              {/* Enrichment Tiers */}
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-4">
                <h4 className="font-semibold text-slate-900 text-sm">Merchant Enrichment Pipeline Tiers</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block">Tier 1: Canonical Alias Registry</span>
                      <span className="text-[11px] text-slate-500">
                        Exact matching against 490+ curated Indian merchant and utility brands.
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                      Always Active
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block">Tier 2: Vector Embedding Proximity</span>
                      <span className="text-[11px] text-slate-500">
                        Qwen3 ONNX embedding cosine similarity (Threshold: {settings.vectorThreshold})
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.enableVectorSimilarity}
                        onChange={(e) => updateSettings({ enableVectorSimilarity: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block">Tier 3: Contextual LLM Disambiguation</span>
                      <span className="text-[11px] text-slate-500">
                        Evaluates ambiguous UPI handles and transaction context using local LLM.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.enableLlmDisambiguation}
                        onChange={(e) => updateSettings({ enableLlmDisambiguation: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block">Tier 4: External Web Search Verification</span>
                      <span className="text-[11px] text-slate-500">
                        Queries GST / web registries for unknown merchants (Off by default for zero cloud leakage).
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.enableWebSearchVerification}
                        onChange={(e) => updateSettings({ enableWebSearchVerification: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRIVACY & STORAGE */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-4">
                <h4 className="font-semibold text-slate-900 text-sm">Data Confidentiality & Retention Policies</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200">
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block">Encrypt Results at Rest</span>
                      <span className="text-[11px] text-slate-500">
                        Encrypt all parsed ledger and underwriting reports using Fernet AES-128 key.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.encryptAtRest}
                        onChange={(e) => updateSettings({ encryptAtRest: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200">
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block">Strict Zero Cloud Leakage</span>
                      <span className="text-[11px] text-slate-500">
                        Assures bank statement data and borrower PII never leave the local machine or VPC.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.zeroCloudLeakage}
                        onChange={(e) => updateSettings({ zeroCloudLeakage: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200">
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block">Statement Retention Window</span>
                      <span className="text-[11px] text-slate-500">
                        Automatically delete past statement files older than the retention period.
                      </span>
                    </div>
                    <select
                      value={settings.retentionDays}
                      onChange={(e) => updateSettings({ retentionDays: Number(e.target.value) })}
                      className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800"
                    >
                      <option value="7">7 Days</option>
                      <option value="30">30 Days (Default)</option>
                      <option value="90">90 Days</option>
                      <option value="0">Keep Indefinitely</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DIAGNOSTICS & NODE HEALTH */}
          {activeTab === 'diagnostics' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Cluster Health & Node Telemetry</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live hardware and process heartbeat across all engine microservices
                  </p>
                </div>
                <button
                  onClick={refreshNodes}
                  disabled={isLoadingNodes}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:border-amber-400 text-slate-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <Activity size={13} className={isLoadingNodes ? 'animate-spin text-amber-600' : 'text-slate-500'} />
                  <span>Ping All Nodes</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {[
                  nodes?.engine,
                  nodes?.ollama,
                  nodes?.merchant_server,
                  nodes?.docling,
                  nodes?.classifier,
                ]
                  .filter(Boolean)
                  .map((node, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-semibold text-slate-900">{node?.name}</span>
                          <span className="font-mono text-[11px] text-slate-400">({node?.host})</span>
                        </div>
                        <p className="text-[11px] text-slate-500 pl-4">{node?.details}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        {node?.latency_ms !== null && node?.latency_ms !== undefined && (
                          <span className="font-mono text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-lg">
                            {node.latency_ms}ms
                          </span>
                        )}
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                          {node?.status?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <button
            onClick={resetSettings}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-700 transition-colors"
          >
            <RotateCcw size={13} />
            <span>Reset to Factory Defaults</span>
          </button>

          <button
            onClick={closeSettings}
            className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
