import React from 'react';
import { Wifi, ShieldCheck } from 'lucide-react';
import { AnimatedCounter } from '../bits/AnimatedCounter';
import { CreditMitraLogo } from './CreditMitraLogo';

interface MetalCreditCardProps {
  score: number;
  band: string;
  archetype: string;
  statementId?: string;
}

export const MetalCreditCard: React.FC<MetalCreditCardProps> = ({
  score,
  band,
  archetype,
  statementId = 'CM-89241-TITANIUM',
}) => {
  const getBandStyles = (b: string) => {
    switch (b.toLowerCase()) {
      case 'excellent':
        return {
          gradient: 'from-slate-900 via-slate-800 to-emerald-950',
          accent: 'text-emerald-400',
          border: 'border-emerald-500/30',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
        };
      case 'very good':
        return {
          gradient: 'from-slate-900 via-slate-800 to-amber-950/60',
          accent: 'text-amber-400',
          border: 'border-amber-500/30',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
        };
      case 'good':
        return {
          gradient: 'from-slate-900 via-slate-850 to-amber-900/40',
          accent: 'text-amber-300',
          border: 'border-amber-400/30',
          badge: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
        };
      case 'fair':
        return {
          gradient: 'from-slate-900 via-slate-850 to-orange-950',
          accent: 'text-orange-400',
          border: 'border-orange-500/30',
          badge: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
        };
      case 'poor':
      default:
        return {
          gradient: 'from-slate-950 via-slate-900 to-rose-950',
          accent: 'text-rose-400',
          border: 'border-rose-500/30',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
        };
    }
  };

  const styles = getBandStyles(band);

  return (
    <div className="relative group w-full max-w-md mx-auto perspective-1000">
      {/* Outer ambient glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-600/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-700" />

      {/* Titanium Card Body */}
      <div
        className={`relative aspect-[1.586/1] w-full rounded-2xl p-6 md:p-7 flex flex-col justify-between overflow-hidden shadow-2xl border ${styles.border} bg-gradient-to-br ${styles.gradient} transition-transform duration-500 group-hover:scale-[1.02]`}
      >
        {/* Subtle Brushed Metal Texture Lines */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 8px)',
          }}
        />

        {/* Specular sheen beam across card */}
        <div className="absolute -top-1/2 -left-1/2 w-full h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 pointer-events-none group-hover:translate-x-full transition-transform duration-1000" />

        {/* Top Header: Brand + Contactless + EMV Chip */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            {/* Metallic Gold EMV Chip */}
            <div className="w-11 h-8 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-1 flex flex-col justify-between shadow-md border border-amber-300/60">
              <div className="w-full h-px bg-amber-700/40" />
              <div className="w-full h-px bg-amber-700/40" />
              <div className="w-full h-px bg-amber-700/40" />
            </div>
            <Wifi className="w-5 h-5 text-slate-400 rotate-90" />
          </div>

          <div className="flex items-center gap-2.5">
            <CreditMitraLogo size="sm" iconOnly={true} />
            <div className="flex flex-col items-end">
              <span className="font-serif text-base font-bold text-white tracking-wider">
                CREDIT<span className="text-amber-400 italic">MITRA</span>
              </span>
              <span className="text-[0.55rem] tracking-[0.25em] uppercase text-slate-400 font-mono">
                TITANIUM UNDERWRITING
              </span>
            </div>
          </div>
        </div>

        {/* Center: Large Embossed Score & Archetype */}
        <div className="my-auto py-2 relative z-10">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[0.6rem] tracking-[0.2em] uppercase text-slate-400 font-semibold block mb-0.5">
                Calculated Score
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-4xl md:text-5xl font-black text-white tracking-tight">
                  <AnimatedCounter value={score} duration={1200} />
                </span>
                <span className="text-xs text-slate-400 font-mono">/ 900</span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span
                className={`text-[0.65rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-sm ${styles.badge}`}
              >
                {band} Tier
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer: Archetype Title & Security Hash */}
        <div className="flex items-end justify-between relative z-10 pt-2 border-t border-white/10">
          <div>
            <span className="text-[0.55rem] tracking-[0.2em] uppercase text-slate-400 font-semibold block mb-0.5">
              Borrower Persona
            </span>
            <span className="font-serif text-base md:text-lg font-bold text-amber-200 tracking-wide block">
              {archetype}
            </span>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 text-[0.6rem] text-slate-400 font-mono justify-end">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>{statementId.slice(0, 14)}</span>
            </div>
            <span className="text-[0.5rem] tracking-wider text-slate-500 uppercase block">
              ON-DEVICE ATTESTATION
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
