import React from 'react';
import type { Transaction } from '../../types/transaction';
import { Receipt, ArrowDownLeft, ArrowUpRight, Store, Users } from 'lucide-react';
import { AnimatedCounter } from '../../components/bits/AnimatedCounter';

interface StatsOverviewProps {
  transactions: Transaction[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ transactions }) => {
  if (!transactions || transactions.length === 0) return null;

  let deposits = 0;
  let withdrawals = 0;
  let merchantCount = 0;
  let personCount = 0;

  transactions.forEach((t) => {
    deposits += parseFloat((t.deposits || '').replace(/,/g, '')) || 0;
    withdrawals += parseFloat((t.withdrawals || '').replace(/,/g, '')) || 0;
    if (t.payee_type === 'merchant') merchantCount++;
    if (t.payee_type === 'person') personCount++;
  });

  const formatINR = (n: number) => {
    return '₹' + Math.round(n).toLocaleString('en-IN');
  };

  const stats = [
    {
      label: 'Transactions',
      numeric: transactions.length,
      formatted: null,
      icon: Receipt,
      iconColor: 'text-slate-600 bg-slate-100 border-slate-200',
      valueColor: 'text-slate-900',
    },
    {
      label: 'Total Credits',
      numeric: null,
      formatted: formatINR(deposits),
      icon: ArrowDownLeft,
      iconColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      valueColor: 'text-emerald-700',
    },
    {
      label: 'Total Debits',
      numeric: null,
      formatted: formatINR(withdrawals),
      icon: ArrowUpRight,
      iconColor: 'text-rose-700 bg-rose-50 border-rose-200',
      valueColor: 'text-rose-700',
    },
    {
      label: 'Merchant (P2M)',
      numeric: merchantCount,
      formatted: null,
      icon: Store,
      iconColor: 'text-amber-700 bg-amber-50 border-amber-200',
      valueColor: 'text-amber-900',
    },
    {
      label: 'Person (P2P)',
      numeric: personCount,
      formatted: null,
      icon: Users,
      iconColor: 'text-teal-700 bg-teal-50 border-teal-200',
      valueColor: 'text-teal-900',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
      {stats.map((stat, i) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={i}
            className="group bg-white border border-slate-200/90 rounded-2xl p-5 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_16px_-4px_rgba(15,23,42,0.04)] hover:shadow-md hover:border-slate-300 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[0.6875rem] tracking-[0.14em] uppercase text-slate-500 font-semibold truncate">
                {stat.label}
              </span>
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${stat.iconColor} transition-transform group-hover:scale-110 duration-200`}
              >
                <IconComponent size={14} />
              </div>
            </div>
            <div
              className={`font-serif text-2xl md:text-3xl font-semibold tabular-nums tracking-tight ${stat.valueColor}`}
            >
              {stat.numeric !== null ? (
                <AnimatedCounter value={stat.numeric} duration={700} />
              ) : (
                stat.formatted
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
