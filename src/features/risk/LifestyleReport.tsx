import React from 'react';
import type { CreditRiskReport } from '../../types/transaction';
import { ScoreGauge } from '../../components/ui/ScoreGauge';
import { RadarChart } from '../../components/ui/RadarChart';
import { ShieldAlert, ShieldCheck, Sparkles, TrendingUp, Award, Activity, Zap } from 'lucide-react';

interface LifestyleReportProps {
  report: CreditRiskReport;
}

export const LifestyleReport: React.FC<LifestyleReportProps> = ({ report }) => {
  if (!report) return null;

  const cashflowFactors = report.factors.filter((f) => f.block === 'cashflow');
  const lifestyleFactors = report.factors.filter((f) => f.block === 'lifestyle');

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* 1. Header Archetype Card */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-900/90 via-slate-950 to-amber-950/20 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Sparkles className="w-48 h-48 text-amber-400" />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              Borrower Persona Archetype
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white tracking-tight">
              {report.archetype}
            </h2>
            <p className="text-slate-300 text-base leading-relaxed font-light">
              {report.narrative || 'Alternative-data lifestyle risk assessment computed from statement transactions.'}
            </p>
          </div>

          <div className="flex items-center justify-center border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8 w-full md:w-auto">
            <ScoreGauge score={report.score} band={report.band} />
          </div>
        </div>
      </div>

      {/* 2. Middle Grid: Radar Chart + Key Feature Metrics */}
      <div className="grid grid-[#121827] grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart */}
        <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif text-xl font-medium text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                Lifestyle Indices (L1–L6)
              </h3>
              <span className="text-xs text-slate-400">0–100 scale</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Multi-dimensional spending behavior profile evaluated against the 6 core lifestyle indices.
            </p>
          </div>

          <div className="py-2 flex justify-center">
            <RadarChart lifestyle={report.lifestyle} />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-center text-xs">
            <div className="p-2 rounded-lg bg-slate-950/40 border border-white/5">
              <span className="text-slate-400 block">Digital Maturity</span>
              <span className="font-semibold text-white">{report.lifestyle.l3_digital_maturity}/100</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/40 border border-white/5">
              <span className="text-slate-400 block">Commitment</span>
              <span className="font-semibold text-white">{report.lifestyle.l4_commitment}/100</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/40 border border-white/5">
              <span className="text-slate-400 block">Risk Appetite</span>
              <span className="font-semibold text-white">{report.lifestyle.l6_risk_appetite}/100</span>
            </div>
          </div>
        </div>

        {/* Feature Vector Overview */}
        <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-serif text-xl font-medium text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              Cash-Flow & Behavioral Signals
            </h3>
            <span className="text-xs text-slate-400">{report.features.months_covered} Months Evaluated</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
              <span className="text-xs text-slate-400">Monthly Net Income</span>
              <p className="font-bold text-lg text-white">
                ₹{report.features.monthly_income ? report.features.monthly_income.toLocaleString('en-IN') : '0'}
              </p>
              <span className="text-[10px] text-emerald-400">
                {report.features.salary_detected ? '✓ Salary Detected' : 'Gig / Irregular Credits'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
              <span className="text-xs text-slate-400">Fixed Obligations Ratio (FOIR)</span>
              <p className="font-bold text-lg text-white">
                {Math.round((report.features.foir || 0) * 100)}%
              </p>
              <span className="text-[10px] text-slate-400">Fixed debts / Net Income</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
              <span className="text-xs text-slate-400">Balance Buffer</span>
              <p className="font-bold text-lg text-white">
                {report.features.balance_buffer_days} Days
              </p>
              <span className="text-[10px] text-slate-400">Avg liquidity cushion</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
              <span className="text-xs text-slate-400">Cheque / NACH Bounces</span>
              <p className={`font-bold text-lg ${report.features.bounce_count > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {report.features.bounce_count}
              </p>
              <span className="text-[10px] text-slate-400">Returned transactions</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 text-xs space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span>Merchant Resolution Rate:</span>
              <span className="font-semibold text-white">{Math.round((report.features.merchant_resolution_rate || 0) * 100)}%</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>BNPL Merchants Count:</span>
              <span className="font-semibold text-white">{report.features.bnpl_merchant_count || 0}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Merchant Loyalty Index:</span>
              <span className="font-semibold text-white">{Math.round((report.lifestyle.merchant_loyalty || 0) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Dual-Column Factors Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lifestyle Factors Block */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-lg font-medium text-white">Lifestyle Block Factors</h3>
          </div>

          <div className="space-y-3">
            {lifestyleFactors.length === 0 ? (
              <p className="text-xs text-slate-400">No specific lifestyle factors reported.</p>
            ) : (
              lifestyleFactors.map((f, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-950/40 border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-start gap-2.5">
                    {f.impact >= 0 ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                    )}
                    <span className="text-xs text-slate-200 leading-snug">{f.factor}</span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md shrink-0 border ${
                      f.impact >= 0
                        ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                        : 'text-rose-400 border-rose-500/30 bg-rose-500/10'
                    }`}
                  >
                    {f.impact >= 0 ? `+${f.impact}` : f.impact}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Cash-Flow Factors Block */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="font-serif text-lg font-medium text-white">Cash-Flow Block Factors</h3>
          </div>

          <div className="space-y-3">
            {cashflowFactors.length === 0 ? (
              <p className="text-xs text-slate-400">No specific cash-flow factors reported.</p>
            ) : (
              cashflowFactors.map((f, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-950/40 border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-start gap-2.5">
                    {f.impact >= 0 ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                    )}
                    <span className="text-xs text-slate-200 leading-snug">{f.factor}</span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md shrink-0 border ${
                      f.impact >= 0
                        ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                        : 'text-rose-400 border-rose-500/30 bg-rose-500/10'
                    }`}
                  >
                    {f.impact >= 0 ? `+${f.impact}` : f.impact}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
