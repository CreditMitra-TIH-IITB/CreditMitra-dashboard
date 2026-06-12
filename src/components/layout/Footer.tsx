import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 py-6 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[0.6875rem] tracking-[0.1em] uppercase text-slate-500 font-medium">
        <span>IITB Chanakya Fellowship</span>
        <span>Docling · Stateless inference</span>
      </div>
    </footer>
  );
};
