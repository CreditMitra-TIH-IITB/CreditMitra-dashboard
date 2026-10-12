import React from 'react';
import { Loader2, AlertCircle, CheckCircle2, FileSpreadsheet, Bot, Cpu, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ProcessingStatusProps {
  isProcessing: boolean;
  step: number;
  progress: number;
  error: string | null;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  isProcessing,
  step,
  progress,
  error,
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
    error ? 0 : progress >= 100 ? 4 : Math.max(step, progress > 65 ? 4 : progress > 40 ? 3 : progress > 15 ? 2 : 1);

  return (
    <div className="w-full mt-6 bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-[0_2px_16px_rgba(15,23,42,0.04)] animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[0.65rem] tracking-[0.2em] uppercase text-amber-700 font-bold block mb-1">
            Automated Pipeline
          </span>
          <h3 className="font-serif text-2xl font-semibold text-slate-900">
            {error ? 'Extraction Pipeline Interrupted' : 'Statement Processing Pipeline'}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {!error && isProcessing && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900 shadow-2xs">
              <Loader2 size={14} className="animate-spin text-amber-600" />
              <span>Inference in Progress</span>
            </div>
          )}
          {!error && !isProcessing && progress === 100 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-2xs">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>Underwriting Complete</span>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 shadow-2xs">
              <AlertCircle size={14} className="text-rose-600" />
              <span>Error Encountered</span>
            </div>
          )}
        </div>
      </div>

      {/* Modern Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-500 font-mono">
          <span>Overall Pipeline Progress</span>
          <span className="font-bold text-slate-800">{Math.round(Math.min(progress, 100))}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/60">
          <div
            className={cn(
              'absolute top-0 left-0 h-full transition-all duration-700 ease-out rounded-full',
              error ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-500 to-amber-600 shadow-2xs',
            )}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* 4-Stage Stepper Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        {pipelineStages.map((stage) => {
          const isDone = !error && (progress === 100 || stage.id < activeStage);
          const isCurrent = !error && isProcessing && stage.id === activeStage;
          const StageIcon = stage.icon;

          return (
            <div
              key={stage.id}
              className={cn(
                'p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-2',
                isCurrent
                  ? 'bg-amber-50/70 border-amber-300 shadow-xs ring-2 ring-amber-400/20'
                  : isDone
                  ? 'bg-slate-50/80 border-slate-200'
                  : 'bg-white/50 border-slate-100 opacity-60',
              )}
            >
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border',
                    isCurrent
                      ? 'bg-amber-100 border-amber-300 text-amber-700'
                      : isDone
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                      : 'bg-slate-100 border-slate-200 text-slate-400',
                  )}
                >
                  {isDone ? <CheckCircle2 size={16} /> : isCurrent ? <Loader2 size={16} className="animate-spin" /> : <StageIcon size={16} />}
                </div>

                <span className="text-[0.625rem] font-bold uppercase tracking-wider text-slate-400">
                  Step 0{stage.id}
                </span>
              </div>

              <div>
                <span className="font-semibold text-slate-900 text-xs block leading-tight">
                  {stage.title}
                </span>
                <span className="text-[10px] text-amber-700 font-medium block mt-0.5 font-mono">
                  {stage.engine}
                </span>
                <span className="text-[11px] text-slate-500 leading-tight block mt-1">
                  {stage.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Error Callout */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
          <AlertCircle size={18} className="shrink-0 text-rose-600 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Execution Diagnostics:</span>
            <p className="leading-relaxed">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};
