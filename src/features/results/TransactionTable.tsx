import React from 'react';
import type { Transaction } from '../../types/transaction';
import { Download, Store, User } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  if (!transactions || transactions.length === 0) return null;

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'credit_mitra_transactions.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const payeeCount = transactions.filter((t) => t.payee).length;
  const coverage = Math.round((payeeCount / transactions.length) * 100);

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6 pb-5 border-b border-white/10">
        <div>
          <h3 className="font-serif text-2xl font-medium text-white">Transaction Ledger</h3>
          <p className="text-sm text-slate-400 mt-1">
            {transactions.length} rows &middot; {coverage}% payee coverage
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 border border-white/10 rounded-lg hover:text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/10 transition-all"
        >
          <Download size={16} />
          Export JSON
        </button>
      </div>

      <div className="border border-white/10 bg-slate-900/40 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-950/80 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-4 py-4 text-[0.65rem] font-semibold tracking-widest text-slate-500 uppercase border-b border-white/10 w-12 text-center">
                  #
                </th>
                <th className="px-4 py-4 text-[0.65rem] font-semibold tracking-widest text-slate-500 uppercase border-b border-white/10 whitespace-nowrap">
                  Date
                </th>
                <th className="px-4 py-4 text-[0.65rem] font-semibold tracking-widest text-slate-500 uppercase border-b border-white/10">
                  Narration
                </th>
                <th className="px-4 py-4 text-[0.65rem] font-semibold tracking-widest text-slate-500 uppercase border-b border-white/10">
                  Type
                </th>
                <th className="px-4 py-4 text-[0.65rem] font-semibold tracking-widest text-slate-500 uppercase border-b border-white/10 text-right">
                  Amount
                </th>
                <th className="px-4 py-4 text-[0.65rem] font-semibold tracking-widest text-slate-500 uppercase border-b border-white/10 text-right">
                  Balance
                </th>
                <th className="px-4 py-4 text-[0.65rem] font-semibold tracking-widest text-amber-500 uppercase border-b border-white/10">
                  Payee
                </th>
                <th className="px-4 py-4 text-[0.65rem] font-semibold tracking-widest text-violet-400 uppercase border-b border-white/10 text-center">
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((t, i) => {
                const isDeposit =
                  !!t.deposits &&
                  t.deposits !== '' &&
                  t.deposits !== 'Opening Balance' &&
                  t.deposits !== 'Closing Balance';
                const isWithdraw = !!t.withdrawals && t.withdrawals !== '';
                const amount = isDeposit ? t.deposits : isWithdraw ? t.withdrawals : '';

                return (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-4 py-4 text-xs font-mono text-slate-600 text-center">
                      {String(i + 1).padStart(2, '0')}
                    </td>
                    <td className="px-4 py-4 text-slate-300 whitespace-nowrap">
                      {t.date || <span className="text-slate-700">&mdash;</span>}
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-slate-400 max-w-sm break-words">
                      {t.particulars || <span className="text-slate-700">&mdash;</span>}
                    </td>
                    <td className="px-4 py-4">
                      {isDeposit ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[0.6rem] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Credit
                        </span>
                      ) : isWithdraw ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[0.6rem] font-bold tracking-wider uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Debit
                        </span>
                      ) : (
                        <span className="text-slate-700">&mdash;</span>
                      )}
                    </td>
                    <td className="px-4 py-4 tabular-nums text-right font-medium text-slate-300">
                      {amount || <span className="text-slate-700">&mdash;</span>}
                    </td>
                    <td className="px-4 py-4 tabular-nums text-right font-medium text-slate-500">
                      {t.balance || <span className="text-slate-700">&mdash;</span>}
                    </td>
                    <td className="px-4 py-4 font-medium text-white max-w-[200px] truncate group-hover:text-amber-400 transition-colors">
                      {t.payee || <span className="text-slate-700 font-normal">&mdash;</span>}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {t.payee_type === 'merchant' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[0.6rem] font-bold tracking-wider uppercase bg-violet-500/10 text-violet-400 border border-violet-500/20">
                          <Store size={12} />
                          Merchant
                          {t.payee_confidence != null && (
                            <span className="text-violet-500/60 font-normal ml-0.5">
                              {Math.round(t.payee_confidence * 100)}%
                            </span>
                          )}
                        </span>
                      ) : t.payee_type === 'person' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[0.6rem] font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          <User size={12} />
                          Person
                          {t.payee_confidence != null && (
                            <span className="text-cyan-500/60 font-normal ml-0.5">
                              {Math.round(t.payee_confidence * 100)}%
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-slate-700">&mdash;</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
