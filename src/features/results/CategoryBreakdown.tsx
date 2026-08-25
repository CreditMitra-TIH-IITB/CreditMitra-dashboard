import React from 'react';
import type { Transaction } from '../../types/transaction';
import { PieChart as PieIcon } from 'lucide-react';

interface CategoryBreakdownProps {
  transactions: Transaction[];
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ transactions }) => {
  if (!transactions || transactions.length === 0) return null;

  // Calculate total spend per category (for debit transactions with valid category)
  const categoryTotals: Record<string, number> = {};
  let totalDebitSpend = 0;

  transactions.forEach((t) => {
    if (
      t.direction === 'debit' ||
      (t.withdrawals && parseFloat(t.withdrawals.replace(/,/g, '')) > 0)
    ) {
      const amt = (t.amount ?? parseFloat((t.withdrawals || '0').replace(/,/g, ''))) || 0;
      const cat = t.category || 'other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;
      totalDebitSpend += amt;
    }
  });

  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8); // Top 8 categories

  const categoryColors: Record<string, string> = {
    food_delivery: '#f59e0b', // amber
    shopping: '#ec4899', // pink
    groceries: '#10b981', // emerald
    telecom: '#06b6d4', // cyan
    fuel: '#8b5cf6', // purple
    investments: '#3b82f6', // blue
    bnpl_lending: '#f97316', // orange
    gambling: '#ef4444', // red
    crypto: '#eab308', // yellow
    other: '#64748b', // slate
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="font-serif text-lg font-medium text-white flex items-center gap-2">
          <PieIcon className="w-5 h-5 text-amber-400" />
          Spend by Category
        </h3>
        <span className="text-xs text-slate-400">
          Total Debits: ₹
          {totalDebitSpend ? Math.round(totalDebitSpend).toLocaleString('en-IN') : '0'}
        </span>
      </div>

      <div className="space-y-3">
        {sortedCategories.map(([cat, amount]) => {
          const share = totalDebitSpend > 0 ? (amount / totalDebitSpend) * 100 : 0;
          const color = categoryColors[cat] || '#94a3b8';

          return (
            <div key={cat} className="space-y-1 text-xs">
              <div className="flex justify-between items-center text-slate-300 font-medium">
                <span className="capitalize">{cat.replace(/_/g, ' ')}</span>
                <span>
                  ₹{Math.round(amount).toLocaleString('en-IN')}{' '}
                  <span className="text-slate-500 font-normal">({share.toFixed(1)}%)</span>
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-950/80 overflow-hidden border border-white/5">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(4, share)}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
