import React from 'react';
import { ShieldCheck, SlidersHorizontal, Cpu } from 'lucide-react';
import { CreditMitraLogo } from '../ui/CreditMitraLogo';
import { useSystemSettings } from '../../features/settings/SettingsContext';

export const Header: React.FC = () => {
  const { openSettings, settings } = useSystemSettings();

  return (
    <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-[0_1px_3px_rgba(15,23,42,0.02)]">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Brand Logo */}
        <CreditMitraLogo size="md" />

        {/* Center Subtext */}
        <div className="hidden lg:block text-xs text-slate-500 max-w-md text-center leading-relaxed">
          Structured bank statement extraction with intelligent payee resolution & alternative-data lifestyle credit scoring.
        </div>

        {/* Right Controls: Node Status Pill + Settings Button */}
        <div className="flex items-center gap-2.5">
          {/* Interactive Node Health Pill */}
          <button
            onClick={() => openSettings('diagnostics')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50/90 hover:bg-amber-50/50 border border-slate-200/90 hover:border-amber-200/80 shadow-2xs transition-all cursor-pointer text-left"
            title="Click to view live node health diagnostics"
          >
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[0.6875rem] tracking-wider uppercase text-slate-500 font-medium flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-600" />
                {settings.remoteEngineOffload ? 'Remote Node' : 'Engine'}
              </span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-amber-700 font-semibold text-xs tracking-tight flex items-center gap-1">
              <Cpu size={11} className="text-amber-600" />
              {settings.ollamaModel.split(':')[0]}
            </span>
          </button>

          {/* Dedicated Settings Button */}
          <button
            onClick={() => openSettings('nodes')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-900 shadow-2xs text-xs font-medium transition-all"
            title="Configure custom inference links and system settings"
          >
            <SlidersHorizontal size={13} className="text-amber-600" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
