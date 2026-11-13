import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X, Sparkles, Shield, Cpu, Activity } from 'lucide-react';
import { cn } from '../../utils/cn';
import { SpotlightCard } from '../../components/bits/SpotlightCard';
import { DEMO_PERSONAS } from '../../services/mockData';

interface UploadDropzoneProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onProcess: () => void;
  isProcessing: boolean;
  onSelectPersona?: (personaId: string) => void;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  file,
  onFileSelect,
  onProcess,
  isProcessing,
  onSelectPersona,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.toLowerCase().endsWith('.pdf')) {
        onFileSelect(droppedFile);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Value Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <Shield size={14} />
          </div>
          <div>
            <span className="font-semibold text-slate-800 block">100% On-Device</span>
            <span className="text-[11px] text-slate-400">Zero cloud leakage</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <Cpu size={14} />
          </div>
          <div>
            <span className="font-semibold text-slate-800 block">Docling Parser</span>
            <span className="text-[11px] text-slate-400">Heterogeneous PDFs</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
            <Sparkles size={14} />
          </div>
          <div>
            <span className="font-semibold text-slate-800 block">payee-lora LLM</span>
            <span className="text-[11px] text-slate-400">Local span resolution</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <Activity size={14} />
          </div>
          <div>
            <span className="font-semibold text-slate-800 block">300–900 Score</span>
            <span className="text-[11px] text-slate-400">Alternative risk engine</span>
          </div>
        </div>
      </div>

      {/* Main Upload Spotlight Card */}
      <SpotlightCard className="p-8 md:p-12 text-center transition-all duration-300 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_12px_32px_-4px_rgba(15,23,42,0.05)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-4 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Automated Credit Underwriting
        </div>

        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-slate-900 mb-3 tracking-tight">
          Bank Statement Ingestion Hub
        </h2>
        <p className="text-slate-500 text-sm md:text-base mb-8 max-w-xl mx-auto leading-relaxed">
          Upload any Indian retail or business bank statement in native PDF format. Tables are extracted, payees normalized, and lifestyle risk computed completely on-device.
        </p>

        {/* Drop Zone Box */}
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'border-2 border-dashed rounded-2xl p-10 mb-6 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3',
            isDragOver
              ? 'border-amber-500 bg-amber-50/70 shadow-inner scale-[1.005]'
              : 'border-slate-200/90 bg-slate-50/60 hover:border-amber-400/80 hover:bg-amber-50/20 hover:shadow-xs',
          )}
        >
          <div className="p-4 bg-amber-50 border border-amber-200/70 rounded-2xl text-amber-600 mb-1 shadow-xs group-hover:scale-105 transition-transform duration-300">
            <UploadCloud size={36} />
          </div>
          <div className="text-sm text-slate-600">
            Drag and drop your PDF bank statement here <br />
            <strong className="text-slate-900 font-semibold mt-1 inline-block">or click to browse local filesystem</strong>
          </div>
          <span className="text-[0.6875rem] uppercase tracking-wider text-slate-400 font-medium">
            Supports HDFC · SBI · ICICI · Axis · Canara · Kotak
          </span>
        </div>

        <input
          type="file"
          accept=".pdf"
          className="hidden"
          ref={inputRef}
          onChange={handleChange}
        />

        {/* Selected File Card */}
        {file && (
          <div className="flex items-center justify-between gap-3 text-sm text-amber-900 mb-8 bg-amber-50/90 py-2.5 px-5 rounded-2xl max-w-md mx-auto border border-amber-200 shadow-2xs">
            <div className="flex items-center gap-2.5 truncate">
              <FileText size={18} className="text-amber-600 shrink-0" />
              <div className="text-left truncate">
                <span className="font-semibold block truncate">{file.name}</span>
                <span className="text-[11px] text-amber-700/80 font-mono">
                  {(file.size / 1024).toFixed(1)} KB · Ready for extraction
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (inputRef.current) inputRef.current.value = '';
                // Trigger parent reset if available
              }}
              className="p-1 rounded-full text-amber-700/60 hover:text-amber-900 hover:bg-amber-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-6 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 shadow-xs w-full sm:w-auto"
          >
            Select PDF File
          </button>

          <button
            type="button"
            disabled={!file || isProcessing}
            onClick={onProcess}
            className="px-7 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:from-amber-600 hover:to-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 w-full sm:w-auto shadow-[0_2px_12px_rgba(217,119,6,0.25)] hover:shadow-[0_4px_18px_rgba(217,119,6,0.35)] active:scale-[0.98]"
          >
            {isProcessing ? 'Executing Pipeline...' : 'Run Extraction & Score'}
          </button>
        </div>

        {/* 1-Click Interactive Demo Persona Badges */}
        {onSelectPersona && (
          <div className="mt-10 pt-6 border-t border-slate-100">
            <span className="text-[0.6875rem] uppercase tracking-wider text-slate-400 font-semibold block mb-3">
              Don't have a statement handy? Try an interactive demo profile:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {DEMO_PERSONAS.map((persona) => (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => onSelectPersona(persona.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-900 text-xs font-medium transition-all shadow-2xs active:scale-[0.98]"
                >
                  <span className="text-amber-600 font-semibold mr-1">✦</span>
                  {persona.name.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>
        )}
      </SpotlightCard>
    </div>
  );
};
