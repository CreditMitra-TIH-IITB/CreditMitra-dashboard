import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-white font-serif">
            Credit <span className="text-amber-500 italic font-medium">Mitra</span>
          </div>
          <div className="text-[0.65rem] tracking-[0.2em] uppercase text-slate-500 font-semibold">
            Statement Intelligence
          </div>
        </div>

        <div className="flex-1 md:text-center text-sm text-slate-400 max-w-lg mx-auto">
          Structured extraction from bank statement PDFs, with intelligent payee resolution on
          transaction narrations.
        </div>

        <div className="flex flex-col md:items-end text-xs text-slate-500 tracking-wider uppercase font-medium">
          <div className="flex items-center gap-1.5 mb-1">
            <ShieldCheck size={14} className="text-amber-500" />
            Inference Engine
          </div>
          <strong className="text-amber-400 tracking-normal text-sm normal-case font-semibold">
            payee-lora · Ollama
          </strong>
        </div>
      </div>
    </header>
  );
};
