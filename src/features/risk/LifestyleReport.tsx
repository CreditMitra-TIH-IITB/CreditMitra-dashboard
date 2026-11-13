import React from 'react';
import type { CreditRiskReport } from '../../types/transaction';
import { ScoreGauge } from '../../components/ui/ScoreGauge';
import { RadarChart } from '../../components/ui/RadarChart';
import { MetalCreditCard } from '../../components/ui/MetalCreditCard';
import {
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Award,
  Activity,
  Zap,
  Layers,
} from 'lucide-react';

interface LifestyleReportProps {
  report: CreditRiskReport;
}

export const LifestyleReport: React.FC<LifestyleReportProps> = ({ report }) => {
  if (!report) return null;

  const cashflowFactors = report.factors.filter((f) => f.block === 'cashflow');
  const lifestyleFactors = report.factors.filter((f) => f.block === 'lifestyle');

  const lifestyleIndices = [
    {
      code: 'L1',
      label: 'Essential Stability',
      value: report.lifestyle.l1_essential_stability || 0,
      desc: 'Predictability of nondiscretionary groceries & utilities',
      color: 'bg-emerald-500',
    },
    {
      code: 'L2',
      label: 'Aspirational Spend',
      value: report.lifestyle.l2_aspirational || 0,
      desc: 'Discretionary dining, travel, and leisure lifestyle ratio',
      color: 'bg-pink-500',
    },
    {
      code: 'L3',
      label: 'Digital Maturity',
      value: report.lifestyle.l3_digital_maturity || 0,
      desc: 'Cashless UPI adoption & digital merchant engagement',
      color: 'bg-cyan-500',
    },
    {
      code: 'L4',
      label: 'Commitment Index',
      value: report.lifestyle.l4_commitment || 0,
      desc: 'Regularity of recurring SIPs, insurance, and mandates',
      color: 'bg-indigo-500',
    },
    {
      code: 'L5',
      label: 'Leverage Index',
      value: report.lifestyle.l5_leverage || 0,
      desc: 'Insulation against BNPL loans & consumer debt exposure',
      color: 'bg-amber-500',
    },
    {
      code: 'L6',
      label: 'Risk Appetite',
      value: report.lifestyle.l6_risk_appetite || 0,
      desc: 'Distance from high-volatility gambling & crypto outlays',
      color: 'bg-violet-500',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* 1. Executive Top Deck: Metal Card + Underwriting Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Embossed Titanium Credit Card Presentation */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <MetalCreditCard
            score={report.score}
            band={report.band}
            archetype={report.archetype}
            statementId="CM-TRL4-ATTESTED"
          />
        </div>

        {/* Right: Underwriting Narrative & Score Summary Card */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-300 bg-amber-50 text-amber-900 text-xs font-semibold uppercase tracking-wider shadow-2xs">
                <Award className="w-3.5 h-3.5 text-amber-700" />
                Underwriting Attestation
              </div>

              <span className="text-xs text-slate-400 font-mono">
                Model: lifestyle-v1.0 · TRL 4
              </span>
            </div>

            <h2 className="font-serif text-3xl font-bold text-slate-900 tracking-tight">
              {report.archetype}
            </h2>

            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              {report.narrative ||
                'Alternative-data lifestyle risk assessment synthesized from transaction narrations and behavioral cash flows.'}
            </p>
          </div>

          {/* Score Gauge & Quick Benchmark Callouts */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-4 border-t border-slate-100">
            <div className="sm:col-span-6 flex justify-center">
              <ScoreGauge score={report.score} band={report.band} />
            </div>

            <div className="sm:col-span-6 space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="text-slate-500 block mb-0.5">Rating Classification</span>
                <span className="font-semibold text-slate-900 text-sm block">
                  {report.band} Credit Tier
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  300–900 alternative data scale
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/60">
                <span className="text-emerald-800 font-semibold block">
                  ✓ Fair Lending Compliant
                </span>
                <span className="text-[11px] text-emerald-700/80 block mt-0.5">
                  Healthcare & protected categories excluded from credit scoring penalties.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Middle Deck: Multi-Dimensional Lifestyle Matrix (Radar + 6 L-Indices) */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[0.65rem] tracking-[0.2em] uppercase text-slate-500 font-bold block mb-1">
              Alternative Dimension Analysis
            </span>
            <h3 className="font-serif text-2xl font-semibold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              Lifestyle Profile Indices (L1–L6)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Standardized 0–100 behavioral indices
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Radar Chart */}
          <div className="lg:col-span-5 flex justify-center py-2">
            <RadarChart lifestyle={report.lifestyle} />
          </div>

          {/* 6 Individual Interactive Index Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {lifestyleIndices.map((idx) => (
              <div
                key={idx.code}
                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-amber-300 hover:bg-amber-50/20 transition-all duration-200 space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black font-mono text-amber-800 bg-amber-100/70 border border-amber-300/60 px-1.5 py-0.5 rounded">
                      {idx.code}
                    </span>
                    <span className="font-semibold text-slate-900 text-xs">
                      {idx.label}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {idx.value}
                    <span className="text-slate-400 text-xs font-normal">/100</span>
                  </span>
                </div>

                {/* Micro Progress Bar */}
                <div className="h-1.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${idx.color}`}
                    style={{ width: `${Math.min(idx.value, 100)}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-500 leading-tight">
                  {idx.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Cash-Flow & Financial Behavioral Signals Matrix */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-[0.65rem] tracking-[0.2em] uppercase text-slate-500 font-bold block mb-1">
              Deterministic Inflows & Debts
            </span>
            <h3 className="font-serif text-2xl font-semibold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-600" />
              Cash-Flow & Financial Solvency Signals
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium font-mono">
            {report.features.months_covered} Months Evaluated
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Monthly Net Inflow</span>
            <p className="font-bold text-2xl text-slate-900 font-mono">
              ₹
              {report.features.monthly_income
                ? report.features.monthly_income.toLocaleString('en-IN')
                : '0'}
            </p>
            <span className="text-[11px] text-emerald-700 font-semibold block pt-1">
              {report.features.salary_detected ? '✓ Verified Monthly Salary' : 'Gig / Multi-Source'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Debt Service Ratio (FOIR)</span>
            <p className="font-bold text-2xl text-slate-900 font-mono">
              {Math.round((report.features.foir || 0) * 100)}%
            </p>
            <span className="text-[11px] text-slate-500 block pt-1">
              Fixed obligations / Inflow
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Liquidity Buffer Cushion</span>
            <p className="font-bold text-2xl text-slate-900 font-mono">
              {report.features.balance_buffer_days} Days
            </p>
            <span className="text-[11px] text-slate-500 block pt-1">
              Average liquidity reserve
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Cheque / NACH Bounces</span>
            <p
              className={`font-bold text-2xl font-mono ${
                report.features.bounce_count > 0 ? 'text-rose-700' : 'text-emerald-700'
              }`}
            >
              {report.features.bounce_count}
            </p>
            <span className="text-[11px] text-slate-500 block pt-1">
              Failed debit instructions
            </span>
          </div>
        </div>

        {/* Secondary Behavioral KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50/70 border border-slate-200/60">
            <span className="text-slate-500">Merchant Resolution Rate:</span>
            <span className="font-semibold text-slate-900 font-mono">
              {Math.round((report.features.merchant_resolution_rate || 0) * 100)}%
            </span>
          </div>

          <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50/70 border border-slate-200/60">
            <span className="text-slate-500">BNPL Providers Detected:</span>
            <span className="font-semibold text-slate-900 font-mono">
              {report.features.bnpl_merchant_count || 0} active
            </span>
          </div>

          <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50/70 border border-slate-200/60">
            <span className="text-slate-500">Merchant Loyalty Index:</span>
            <span className="font-semibold text-slate-900 font-mono">
              {Math.round((report.lifestyle.merchant_loyalty || 0) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Dual-Column Factors Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lifestyle Factors Block */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              <h3 className="font-serif text-xl font-medium text-slate-900">Lifestyle Drivers</h3>
            </div>
            <span className="text-xs text-slate-400">Score adjustment</span>
          </div>

          <div className="space-y-2.5">
            {lifestyleFactors.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No lifestyle drivers registered.</p>
            ) : (
              lifestyleFactors.map((f, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:border-slate-300 hover:bg-slate-50 transition-all"
                >
                  <div className="flex items-start gap-2.5">
                    {f.impact >= 0 ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                    )}
                    <span className="text-xs text-slate-800 leading-snug font-medium">{f.factor}</span>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg shrink-0 border ${
                      f.impact >= 0
                        ? 'text-emerald-800 border-emerald-200 bg-emerald-50'
                        : 'text-rose-800 border-rose-200 bg-rose-50'
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
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              <h3 className="font-serif text-xl font-medium text-slate-900">Cash-Flow Drivers</h3>
            </div>
            <span className="text-xs text-slate-400">Score adjustment</span>
          </div>

          <div className="space-y-2.5">
            {cashflowFactors.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No cash-flow drivers registered.</p>
            ) : (
              cashflowFactors.map((f, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:border-slate-300 hover:bg-slate-50 transition-all"
                >
                  <div className="flex items-start gap-2.5">
                    {f.impact >= 0 ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                    )}
                    <span className="text-xs text-slate-800 leading-snug font-medium">{f.factor}</span>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg shrink-0 border ${
                      f.impact >= 0
                        ? 'text-emerald-800 border-emerald-200 bg-emerald-50'
                        : 'text-rose-800 border-rose-200 bg-rose-50'
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
