import React, { useState, useMemo } from 'react';
import type { Transaction } from '../../types/transaction';
import { Download, Store, User, Filter, Search, AlertTriangle } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Every hook has to run before the empty-list guard below. The list goes
  // from empty to populated when a statement finishes processing, so an early
  // return above these would change the hook count between renders and crash.
  const rows = useMemo(() => transactions ?? [], [transactions]);

  // Extract unique categories for filter dropdown
  const categories = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set).sort();
  }, [rows]);

  // Filter transactions by category & search query
  const filteredTransactions = useMemo(() => {
    return rows.filter((t) => {
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        t.particulars.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.payee && t.payee.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [rows, selectedCategory, searchQuery]);

  if (rows.length === 0) return null;

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'credit_mitra_transactions.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const payeeCount = rows.filter((t) => t.payee).length;
  const coverage = Math.round((payeeCount / rows.length) * 100);

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h3 className="font-serif text-2xl font-medium text-white">Transaction Ledger</h3>
          <p className="text-sm text-slate-400 mt-1">
            {rows.length} total rows &middot; {coverage}% payee coverage
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

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            placeholder="Search particulars or payee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none w-full sm:w-64"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 text-xs text-slate-300 border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Categories ({rows.length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="border border-white/10 bg-slate-900/40 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-950/80 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-4 py-3.5 text-[0.65rem] font-semibold tracking-widest text-slate-500 uppercase border-b border-white/10 w-12 text-center">
                  #
                </th>
                <th className="px-4 py-3.5 text-[0.65rem] font-semibold tracking-widest text-slate-500 uppercase border-b border-white/10 whitespace-nowrap">
                  Date
                </th>
                <th className="px-4 py-3.5 text-[0.65rem] font-semibold tracking-widest text-slate-500 uppercase border-b border-white/10">
                  Particulars
                </th>
                <th className="px-4 py-3.5 text-[0.65rem] font-semibold tracking-widest text-slate-500 uppercase border-b border-white/10">
                  Payee / Category
                </th>
                <th className="px-4 py-3.5 text-[0.65rem] font-semibold tracking-widest text-slate-500 uppercase border-b border-white/10 text-right">
                  Withdrawal
                </th>
                <th className="px-4 py-3.5 text-[0.65rem] font-semibold tracking-widest text-slate-500 uppercase border-b border-white/10 text-right">
                  Deposit
                </th>
                <th className="px-4 py-3.5 text-[0.65rem] font-semibold tracking-widest text-slate-500 uppercase border-b border-white/10 text-right">
                  Balance
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500 text-xs">
                    No transactions match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-4 py-3 text-xs text-slate-500 text-center font-mono">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-300 font-mono whitespace-nowrap">
                      {t.date}
                    </td>
                    <td
                      className="px-4 py-3 text-xs text-slate-300 max-w-xs font-mono truncate"
                      title={t.particulars}
                    >
                      {t.particulars}
                    </td>

                    {/* Payee + Category + Risk Badges */}
                    <td className="px-4 py-3 text-xs">
                      {t.payee ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            {t.payee_type === 'merchant' ? (
                              <Store className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            ) : (
                              <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            )}
                            <span className="font-semibold text-white">{t.payee}</span>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {t.category && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10 capitalize">
                                {t.category.replace(/_/g, ' ')}
                              </span>
                            )}

                            {t.is_essential !== undefined && t.is_essential !== null && (
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                                  t.is_essential
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {t.is_essential ? 'Essential' : 'Aspirational'}
                              </span>
                            )}

                            {t.risk_flag && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                {t.risk_flag}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">Unresolved</span>
                      )}
                    </td>

                    {/* Withdrawals */}
                    <td className="px-4 py-3 text-xs text-right font-mono font-medium text-rose-400">
                      {t.withdrawals ? `₹${t.withdrawals}` : '-'}
                    </td>

                    {/* Deposits */}
                    <td className="px-4 py-3 text-xs text-right font-mono font-medium text-emerald-400">
                      {t.deposits ? `₹${t.deposits}` : '-'}
                    </td>

                    {/* Balance */}
                    <td className="px-4 py-3 text-xs text-right font-mono text-slate-300">
                      {t.balance ? `₹${t.balance}` : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
