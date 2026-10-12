import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { CreditMitraLogo } from '../ui/CreditMitraLogo';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-[0_1px_3px_rgba(15,23,42,0.02)]">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Brand Logo */}
        <CreditMitraLogo size="md" />

        {/* Center Subtext */}
        <div className="hidden lg:block text-xs text-slate-500 max-w-md text-center leading-relaxed">
          Structured bank statement extraction with intelligent payee resolution & alternative-data lifestyle credit scoring.
        </div>

        {/* Right Status Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50/90 border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[0.6875rem] tracking-wider uppercase text-slate-500 font-medium flex items-center gap-1">
              <ShieldCheck size={12} className="text-emerald-600" />
              Engine
            </span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-amber-700 font-semibold text-xs tracking-tight">
            payee-lora · Ollama
          </span>
        </div>
      </div>
    </header>
  );
};
