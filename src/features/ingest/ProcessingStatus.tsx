import React from 'react';
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Bot,
  Cpu,
  Sparkles,
  Clock,
  Activity,
  Layers,
  Terminal,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import type { TaskTelemetry } from '../../types/transaction';

interface ProcessingStatusProps {
  isProcessing: boolean;
  step: number;
  progress: number;
  error: string | null;
  telemetry?: TaskTelemetry | null;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  isProcessing,
  step,
  progress,
  error,
  telemetry,
}) => {
  if (!isProcessing && !error && progress === 0) return null;

  const pipelineStages = [
    {
      id: 1,
      title: 'PDF Table Extraction',
      engine: 'Docling Visual Engine',
      desc: 'Reconstructing transaction rows from native & borderless tables',
      icon: FileSpreadsheet,
    },
    {
      id: 2,
      title: 'Payee Normalization',
      engine: 'payee-lora (Ollama)',
      desc: 'Extracting canonical merchant & individual names from raw narrations',
      icon: Bot,
    },
    {
      id: 3,
      title: 'Entity Classification',
      engine: 'ONNX Qwen3 Embedding',
      desc: 'Separating individuals (P2P) from registered commercial merchants (P2M)',
      icon: Cpu,
    },
    {
      id: 4,
      title: 'Lifestyle Risk Scoring',
      engine: 'CreditMitra Risk Brain',
      desc: 'Evaluating L1–L6 dimensions, archetype matching & 300–900 score',
      icon: Sparkles,
    },
  ];

  // Map progress & step to active stage (1 to 4)
  const activeStage =
    error ? 0 : progress >= 100 ? 4 : Math.max(step, telemetry?.stage_index || (progress > 65 ? 4 : progress > 30 ? 2 : 1));

  const totalRows = telemetry?.total_rows || 0;
  const processedRows = telemetry?.processed_rows || 0;
  const elapsed = telemetry?.elapsed_seconds ?? 0;
  const eta = telemetry?.eta_seconds;

  return (
    <div className="w-full mt-6 bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-[0_2px_16px_rgba(15,23,42,0.04)] animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div>
          <span className="text-[0.65rem] tracking-[0.2em] uppercase text-amber-700 font-bold block mb-1">
            Real-Time Engine Pipeline
          </span>
          <h3 className="font-serif text-2xl font-semibold text-slate-900">
            {error ? 'Extraction Pipeline Interrupted' : 'Statement Processing Pipeline'}
          </h3>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {!error && isProcessing && (
            <>
              {eta !== undefined && eta !== null && eta > 0 ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-300 text-xs font-semibold text-amber-900 shadow-2xs font-mono">
                  <Clock size={13} className="text-amber-600" />
                  <span>ETA: ~{Math.ceil(eta)}s remaining</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800 shadow-2xs font-mono">
                  <Clock size={13} className="text-amber-600" />
                  <span>Estimating ETA...</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 font-mono">
                <Activity size={13} className="text-slate-500" />
                <span>Elapsed: {elapsed}s</span>
              </div>
            </>
          )}

          {!error && !isProcessing && progress === 100 && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-2xs">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>Underwriting Complete {elapsed > 0 ? `(${elapsed}s)` : ''}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 shadow-2xs">
              <AlertCircle size={14} className="text-rose-600" />
              <span>Error Encountered</span>
            </div>
          )}
        </div>
      </div>

      {/* Real Live Metrics Strip */}
      {isProcessing && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block mb-0.5 font-medium">Statements / Rows</span>
            <span className="font-semibold text-slate-900 font-mono text-sm">
              {totalRows > 0 ? `${processedRows} / ${totalRows} rows` : 'Scanning layout...'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block mb-0.5 font-medium">Estimated Time Remaining</span>
            <span className="font-semibold text-amber-700 font-mono text-sm">
              {eta !== undefined && eta !== null && eta > 0 ? `~${Math.ceil(eta)} seconds` : 'Calculating...'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block mb-0.5 font-medium">Elapsed Runtime</span>
            <span className="font-semibold text-slate-900 font-mono text-sm">
              {elapsed}s total
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block mb-0.5 font-medium">Active Engine Stage</span>
            <span className="font-semibold text-indigo-700 truncate block text-sm">
              {telemetry?.stage_name?.split(' (')[0] || 'Docling Ingestion'}
            </span>
          </div>
        </div>
      )}

      {/* Live Activity Terminal Message */}
      {telemetry?.message && (
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-900 text-slate-100 rounded-2xl text-xs font-mono shadow-inner border border-slate-800">
          <Terminal size={14} className="text-amber-400 shrink-0" />
          <div className="truncate flex-1">
            <span className="text-amber-300 font-semibold mr-1.5">[engine]</span>
            <span className="text-slate-200">{telemetry.message}</span>
            {telemetry.current_narration && (
              <span className="text-slate-400 text-[11px] block truncate mt-0.5">
                Line: &quot;{telemetry.current_narration}&quot;
              </span>
            )}
          </div>
        </div>
      )}

      {/* Modern Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-500 font-mono">
          <span className="flex items-center gap-1.5">
            <Layers size={13} className="text-slate-400" />
            <span>True Verified Progress</span>
          </span>
          <span className="font-bold text-slate-800 tabular-nums">
            {Math.round(Math.min(progress, 100))}%
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/60">
          <div
            className={cn(
              'absolute top-0 left-0 h-full transition-all duration-500 ease-out rounded-full',
              error ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-500 to-amber-600 shadow-2xs',
            )}
            style={{ width: `${Math.max(progress, error ? 100 : 3)}%` }}
          />
        </div>
      </div>

      {/* Interactive 4-Stage Stepper Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        {pipelineStages.map((stage) => {
          const Icon = stage.icon;
          const isDone = !error && activeStage > stage.id;
          const isCurrent = !error && isProcessing && activeStage === stage.id;
          const isPending = !error && activeStage < stage.id;

          return (
            <div
              key={stage.id}
              className={cn(
                'relative rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between gap-3',
                isCurrent &&
                  'bg-amber-50/70 border-amber-300/90 shadow-[0_4px_16px_rgba(245,158,11,0.12)] scale-[1.01]',
                isDone && 'bg-white border-emerald-200/80 shadow-2xs',
                isPending && 'bg-slate-50/60 border-slate-200/60 opacity-65',
                error && activeStage === stage.id && 'bg-rose-50 border-rose-300 shadow-2xs',
              )}
            >
              {/* Top Row: Icon + State Badge */}
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    'w-8 h-8 rounded-xl flex items-center justify-center border transition-colors',
                    isCurrent && 'bg-amber-100 border-amber-300 text-amber-700',
                    isDone && 'bg-emerald-100 border-emerald-300 text-emerald-700',
                    isPending && 'bg-slate-100 border-slate-200 text-slate-400',
                    error && activeStage === stage.id && 'bg-rose-100 border-rose-300 text-rose-700',
                  )}
                >
                  {isCurrent ? (
                    <Loader2 size={16} className="animate-spin text-amber-700" />
                  ) : isDone ? (
                    <CheckCircle2 size={16} className="text-emerald-700" />
                  ) : (
                    <Icon size={16} />
                  )}
                </div>

                <span
                  className={cn(
                    'text-[0.625rem] font-bold tracking-wider uppercase font-mono px-2 py-0.5 rounded-full border',
                    isCurrent && 'bg-amber-200/60 text-amber-900 border-amber-300',
                    isDone && 'bg-emerald-100/70 text-emerald-800 border-emerald-200',
                    isPending && 'bg-slate-100 text-slate-400 border-slate-200',
                    error && activeStage === stage.id && 'bg-rose-100 text-rose-800 border-rose-200',
                  )}
                >
                  {isDone ? 'Completed' : isCurrent ? 'Active Engine' : `Step 0${stage.id}`}
                </span>
              </div>

              {/* Text Info */}
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-slate-900 leading-snug">{stage.title}</h4>
                <p className="text-[11px] font-mono text-amber-800/90 font-medium">{stage.engine}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{stage.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
