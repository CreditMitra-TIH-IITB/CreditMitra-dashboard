import React from 'react';
import type { Transaction } from '../../types/transaction';

interface StatsOverviewProps {
  transactions: Transaction[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ transactions }) => {
  if (!transactions || transactions.length === 0) return null;

  let deposits = 0;
  let withdrawals = 0;
  let payeeCount = 0;

  transactions.forEach((t) => {
    deposits += parseFloat((t.deposits || '').replace(/,/g, '')) || 0;
    withdrawals += parseFloat((t.withdrawals || '').replace(/,/g, '')) || 0;
    if (t.payee) payeeCount++;
  });

  const formatINR = (n: number) => {
    return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const stats = [
    { label: 'Transactions', value: transactions.length, className: 'text-amber-400' },
    { label: 'Credits', value: formatINR(deposits), className: 'text-emerald-400' },
    { label: 'Debits', value: formatINR(withdrawals), className: 'text-rose-400' },
    { label: 'Payees Resolved', value: payeeCount, className: 'text-white' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-xl overflow-hidden mb-8">
      {stats.map((stat, i) => (
        <div key={i} className="bg-slate-900/80 p-5 md:p-6 backdrop-blur-md">
          <div className="text-[0.65rem] tracking-[0.15em] uppercase text-slate-500 mb-2 font-medium">
            {stat.label}
          </div>
          <div
            className={`font-serif text-2xl md:text-3xl font-medium tabular-nums ${stat.className}`}
          >
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
};
