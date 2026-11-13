import React from 'react';
import type { Transaction } from '../../types/transaction';
import { BarChart3 } from 'lucide-react';

interface CashFlowProps {
  transactions: Transaction[];
}

export const CashFlow: React.FC<CashFlowProps> = ({ transactions }) => {
  if (!transactions || transactions.length === 0) return null;

  let totalCredits = 0;
  let totalDebits = 0;

  transactions.forEach((t) => {
    const creditVal = t.deposits ? parseFloat(t.deposits.replace(/,/g, '')) || 0 : 0;
    const debitVal = t.withdrawals ? parseFloat(t.withdrawals.replace(/,/g, '')) || 0 : 0;

    totalCredits += creditVal;
    totalDebits += debitVal;
  });

  const maxVal = Math.max(totalCredits, totalDebits, 1);
  const creditHeight = Math.round((totalCredits / maxVal) * 100);
  const debitHeight = Math.round((totalDebits / maxVal) * 100);
  const netFlow = totalCredits - totalDebits;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-serif text-lg font-medium text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-600" />
          Cash-Flow Balance
        </h3>
        <span
          className={`text-xs font-semibold font-mono px-2.5 py-0.5 rounded-full border shadow-2xs ${
            netFlow >= 0
              ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
              : 'text-rose-800 bg-rose-50 border-rose-200'
          }`}
        >
          Net Flow: {netFlow >= 0 ? '+' : ''}₹{Math.round(netFlow).toLocaleString('en-IN')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 items-end pt-4 h-48">
        {/* Total Inflow (Credits) Bar */}
        <div className="flex flex-col items-center gap-2 h-full justify-end">
          <span className="text-xs font-bold text-emerald-700 font-mono">
            ₹{Math.round(totalCredits).toLocaleString('en-IN')}
          </span>
          <div className="w-full bg-slate-100 rounded-xl p-1 border border-slate-200/70 h-36 flex items-end shadow-inner">
            <div
              className="w-full bg-gradient-to-t from-emerald-600 to-emerald-500 rounded-lg transition-all duration-700 shadow-2xs"
              style={{ height: `${Math.max(8, creditHeight)}%` }}
            />
          </div>
          <span className="text-xs text-slate-600 font-medium">Inflow (Credits)</span>
        </div>

        {/* Total Outflow (Debits) Bar */}
        <div className="flex flex-col items-center gap-2 h-full justify-end">
          <span className="text-xs font-bold text-rose-700 font-mono">
            ₹{Math.round(totalDebits).toLocaleString('en-IN')}
          </span>
          <div className="w-full bg-slate-100 rounded-xl p-1 border border-slate-200/70 h-36 flex items-end shadow-inner">
            <div
              className="w-full bg-gradient-to-t from-rose-600 to-rose-500 rounded-lg transition-all duration-700 shadow-2xs"
              style={{ height: `${Math.max(8, debitHeight)}%` }}
            />
          </div>
          <span className="text-xs text-slate-600 font-medium">Outflow (Debits)</span>
        </div>
      </div>
    </div>
  );
};
