import React from 'react';
import { CreditMitraLogo } from '../ui/CreditMitraLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 bg-white/60 py-6 px-6 mt-auto backdrop-blur-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[0.6875rem] tracking-[0.15em] uppercase text-slate-500 font-medium">
        <div className="flex items-center gap-3">
          <CreditMitraLogo size="sm" showTagline={false} />
          <span className="text-slate-300">|</span>
          <span>TIH-IoT IIT Bombay · Chanakya Fellowship</span>
        </div>
        <span>Docling · Stateless On-Device Inference</span>
      </div>
    </footer>
  );
};
