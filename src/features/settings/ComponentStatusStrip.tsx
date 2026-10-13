import React from 'react';
import { useSystemSettings } from './SettingsContext';
import { ShieldCheck, Cpu, Store, FileSpreadsheet, SlidersHorizontal, RefreshCw, Server } from 'lucide-react';

export const ComponentStatusStrip: React.FC = () => {
  const { nodes, openSettings, isLoadingNodes, refreshNodes, settings } = useSystemSettings();

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'online':
      case 'ready':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        );
      case 'degraded':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Degraded
          </span>
        );
      case 'offline':
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Standby
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-3">
      {/* Top Banner Row */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/60">
            <Server size={13} />
          </div>
          <span className="text-xs font-semibold text-slate-900 tracking-tight">
            Infrastructure & Inference Nodes
          </span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
            {settings.remoteEngineOffload ? 'Hybrid Cloud Offload' : '100% On-Device'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshNodes}
            disabled={isLoadingNodes}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            title="Refresh node health status"
          >
            <RefreshCw size={12} className={isLoadingNodes ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => openSettings('nodes')}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-amber-900 bg-slate-50 hover:bg-amber-50/70 border border-slate-200/80 hover:border-amber-200 rounded-xl transition-all shadow-2xs"
          >
            <SlidersHorizontal size={12} className="text-amber-600" />
            <span>Configure Nodes</span>
          </button>
        </div>
      </div>

      {/* Node Status Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
        {/* 1. Engine Orchestrator */}
        <div
          onClick={() => openSettings('nodes')}
          className="p-2.5 rounded-xl bg-slate-50/70 hover:bg-amber-50/30 border border-slate-200/80 hover:border-amber-300/80 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span className="font-semibold text-slate-900 truncate">
                {settings.remoteEngineOffload ? 'Remote Engine' : 'Core Engine'}
              </span>
            </div>
            {getStatusBadge(nodes?.engine?.status || 'online')}
          </div>
          <div className="text-[11px] text-slate-500 truncate flex items-center justify-between">
            <span className="truncate font-mono">
              {settings.remoteEngineOffload ? 'Remote Node' : 'Port :8000'}
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-medium">
              {nodes?.engine?.latency_ms ? `${nodes.engine.latency_ms}ms` : '1ms'}
            </span>
          </div>
        </div>

        {/* 2. Ollama LLM Inference */}
        <div
          onClick={() => openSettings('nodes')}
          className="p-2.5 rounded-xl bg-slate-50/70 hover:bg-amber-50/30 border border-slate-200/80 hover:border-amber-300/80 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Cpu size={14} className="text-amber-600" />
              <span className="font-semibold text-slate-900 truncate">Ollama LLM</span>
            </div>
            {getStatusBadge(nodes?.ollama?.status || 'online')}
          </div>
          <div className="text-[11px] text-slate-500 truncate flex items-center justify-between">
            <span className="truncate font-mono">{settings.ollamaModel}</span>
            <span className="text-[10px] font-mono text-slate-400 font-medium">
              {nodes?.ollama?.latency_ms ? `${nodes.ollama.latency_ms}ms` : '12ms'}
            </span>
          </div>
        </div>

        {/* 3. Merchant Intelligence */}
        <div
          onClick={() => openSettings('nodes')}
          className="p-2.5 rounded-xl bg-slate-50/70 hover:bg-amber-50/30 border border-slate-200/80 hover:border-amber-300/80 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Store size={14} className="text-indigo-600" />
              <span className="font-semibold text-slate-900 truncate">Merchant Node</span>
            </div>
            {getStatusBadge(nodes?.merchant_server?.status || 'online')}
          </div>
          <div className="text-[11px] text-slate-500 truncate flex items-center justify-between">
            <span className="truncate font-mono">490 Aliases</span>
            <span className="text-[10px] font-mono text-slate-400 font-medium">
              {nodes?.merchant_server?.latency_ms ? `${nodes.merchant_server.latency_ms}ms` : '4ms'}
            </span>
          </div>
        </div>

        {/* 4. Docling Table Parser */}
        <div
          onClick={() => openSettings('precision')}
          className="p-2.5 rounded-xl bg-slate-50/70 hover:bg-amber-50/30 border border-slate-200/80 hover:border-amber-300/80 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <FileSpreadsheet size={14} className="text-teal-600" />
              <span className="font-semibold text-slate-900 truncate">Docling Parser</span>
            </div>
            {getStatusBadge(nodes?.docling?.status || 'ready')}
          </div>
          <div className="text-[11px] text-slate-500 truncate flex items-center justify-between">
            <span className="truncate font-mono">
              {settings.extractionPrecision === 'high_precision' ? 'Visual Hybrid' : 'Fast Native'}
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-medium">Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
