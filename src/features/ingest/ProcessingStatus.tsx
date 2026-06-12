import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
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

  return (
    <div className="w-full mt-8 bg-slate-900/40 border border-white/5 rounded-xl p-6 md:p-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-baseline justify-between mb-5">
        <h3 className="font-serif text-xl md:text-2xl font-medium text-white">
          {error ? 'Processing Failed' : 'Processing Statement'}
        </h3>
        {!error && step > 0 && (
          <span className="text-[0.65rem] tracking-[0.15em] uppercase text-amber-500 font-semibold">
            Step {step} of 2
          </span>
        )}
      </div>

      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-4 relative">
        <div
          className={cn(
            'absolute top-0 left-0 h-full transition-all duration-700 ease-out rounded-full',
            error ? 'bg-red-500' : 'bg-amber-500',
          )}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-400">
        {isProcessing && <Loader2 size={16} className="animate-spin text-amber-500" />}
        {error && <AlertCircle size={16} className="text-red-500" />}

        {error ? (
          <span className="text-red-400">{error}</span>
        ) : step === 1 ? (
          <span>Parsing document structure and extracting tables...</span>
        ) : step === 2 ? (
          <span>Resolving payees from narrations using Ollama...</span>
        ) : progress === 100 ? (
          <span className="text-amber-400">Complete! Rendered results below.</span>
        ) : null}
      </div>
    </div>
  );
};
