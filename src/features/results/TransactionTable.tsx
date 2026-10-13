import React, { useState, useMemo } from 'react';
import type { Transaction } from '../../types/transaction';
import {
  Store,
  User,
  Filter,
  Search,
  AlertTriangle,
  FileSpreadsheet,
  FileJson,
  X,
  ArrowDownLeft,
  ArrowUpRight,
  Maximize2,
} from 'lucide-react';
import { TransactionDrawer } from '../../components/ui/TransactionDrawer';

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [directionFilter, setDirectionFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  // Guard: Every hook must run before empty-list checks
  const rows = useMemo(() => transactions ?? [], [transactions]);

  // Extract unique categories for filter dropdown
  const categories = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set).sort();
  }, [rows]);

  // Filter transactions by category, direction, & search query
  const filteredTransactions = useMemo(() => {
    return rows.filter((t) => {
      const isCredit =
        t.direction === 'credit' ||
        Boolean(t.deposits && parseFloat(t.deposits.replace(/,/g, '')) > 0);
      const isDebit =
        t.direction === 'debit' ||
        Boolean(t.withdrawals && parseFloat(t.withdrawals.replace(/,/g, '')) > 0);

      const matchesDirection =
        directionFilter === 'all' ||
        (directionFilter === 'credit' && isCredit) ||
        (directionFilter === 'debit' && isDebit);

      const matchesCategory =
        selectedCategory === 'all' || t.category === selectedCategory;

      const matchesSearch =
        !searchQuery ||
        t.particulars.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.payee && t.payee.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesDirection && matchesCategory && matchesSearch;
    });
  }, [rows, selectedCategory, directionFilter, searchQuery]);

  if (rows.length === 0) return null;

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credit_mitra_ledger_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    const headers = ['Date', 'Particulars', 'Payee', 'Payee Type', 'Category', 'Withdrawals', 'Deposits', 'Balance', 'Is Essential', 'Risk Flag'];
    const csvRows = rows.map((t) => [
      `"${t.date || ''}"`,
      `"${(t.particulars || '').replace(/"/g, '""')}"`,
      `"${(t.payee || '').replace(/"/g, '""')}"`,
      `"${t.payee_type || ''}"`,
      `"${t.category || ''}"`,
      `"${t.withdrawals || ''}"`,
      `"${t.deposits || ''}"`,
      `"${t.balance || ''}"`,
      `"${t.is_essential !== undefined ? t.is_essential : ''}"`,
      `"${t.risk_flag || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...csvRows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credit_mitra_ledger_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const payeeCount = rows.filter((t) => t.payee).length;
  const coverage = Math.round((payeeCount / rows.length) * 100);

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both space-y-4">
      {/* Detail Slideover Modal */}
      <TransactionDrawer transaction={selectedTxn} onClose={() => setSelectedTxn(null)} />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-2xl font-semibold text-slate-900 tracking-tight">
              Transaction Ledger
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium bg-amber-50 text-amber-900 border border-amber-200/80">
              {coverage}% Payee Resolved
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Displaying {filteredTransactions.length} of {rows.length} total extracted lines &middot; Click any row to inspect metadata
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:text-emerald-800 hover:border-emerald-300 hover:bg-emerald-50/50 shadow-2xs transition-all"
            title="Download formatted CSV spreadsheet"
          >
            <FileSpreadsheet size={14} className="text-emerald-600" />
            Export CSV
          </button>
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:text-amber-800 hover:border-amber-300 hover:bg-amber-50/50 shadow-2xs transition-all"
            title="Download full JSON with payee-lora tokens"
          >
            <FileJson size={14} className="text-amber-600" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        {/* Search Input */}
        <div className="flex items-center gap-2 flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 ml-1.5 shrink-0" />
          <input
            type="text"
            placeholder="Search particulars, payee, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none w-full pr-7"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-start md:justify-end">
          {/* Flow Direction Segmented Pill */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 text-xs font-medium">
            <button
              onClick={() => setDirectionFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                directionFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All Flows
            </button>
            <button
              onClick={() => setDirectionFilter('credit')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                directionFilter === 'credit'
                  ? 'bg-emerald-50 text-emerald-800 shadow-2xs font-semibold border border-emerald-200'
                  : 'text-slate-500 hover:text-emerald-700'
              }`}
            >
              <ArrowDownLeft size={12} />
              Credits
            </button>
            <button
              onClick={() => setDirectionFilter('debit')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                directionFilter === 'debit'
                  ? 'bg-rose-50 text-rose-800 shadow-2xs font-semibold border border-rose-200'
                  : 'text-slate-500 hover:text-rose-700'
              }`}
            >
              <ArrowUpRight size={12} />
              Debits
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 text-xs text-slate-700 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-500 shadow-2xs font-medium cursor-pointer"
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
      </div>

      {/* Main Ledger Table */}
      <div className="border border-slate-200/90 bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(15,23,42,0.03),0_8px_24px_-4px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto max-h-[640px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50/95 sticky top-0 z-10 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5 text-[0.6875rem] font-semibold tracking-wider text-slate-500 uppercase w-12 text-center">
                  #
                </th>
                <th className="px-4 py-3.5 text-[0.6875rem] font-semibold tracking-wider text-slate-500 uppercase whitespace-nowrap">
                  Date
                </th>
                <th className="px-4 py-3.5 text-[0.6875rem] font-semibold tracking-wider text-slate-500 uppercase min-w-[220px]">
                  Particulars / Narration
                </th>
                <th className="px-4 py-3.5 text-[0.6875rem] font-semibold tracking-wider text-slate-500 uppercase">
                  Payee & Categorization
                </th>
                <th className="px-4 py-3.5 text-[0.6875rem] font-semibold tracking-wider text-slate-500 uppercase text-right">
                  Withdrawal
                </th>
                <th className="px-4 py-3.5 text-[0.6875rem] font-semibold tracking-wider text-slate-500 uppercase text-right">
                  Deposit
                </th>
                <th className="px-4 py-3.5 text-[0.6875rem] font-semibold tracking-wider text-slate-500 uppercase text-right">
                  Balance
                </th>
                <th className="px-3 py-3.5 text-[0.6875rem] font-semibold tracking-wider text-slate-500 uppercase text-center w-10">
                  <span className="sr-only">Inspect</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-500 text-xs">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="w-6 h-6 text-slate-300" />
                      <p className="font-medium text-slate-600">No transactions match the selected filter.</p>
                      {(searchQuery || selectedCategory !== 'all' || directionFilter !== 'all') && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('all');
                            setDirectionFilter('all');
                          }}
                          className="mt-2 text-xs text-amber-700 hover:text-amber-800 font-semibold underline underline-offset-2"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t, idx) => (
                  <tr
                    key={idx}
                    onClick={() => setSelectedTxn(t)}
                    className="hover:bg-amber-50/30 transition-colors group cursor-pointer"
                  >
                    <td className="px-4 py-3 text-xs text-slate-400 text-center font-mono">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-700 font-mono whitespace-nowrap">
                      {t.date}
                    </td>
                    <td
                      className="px-4 py-3 text-xs text-slate-800 max-w-sm font-mono truncate"
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
                              <Store className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            ) : (
                              <User className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            )}
                            <span className="font-semibold text-slate-900 group-hover:text-amber-900 transition-colors">
                              {t.payee}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {t.category && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/80 capitalize font-medium">
                                {t.category.replace(/_/g, ' ')}
                              </span>
                            )}

                            {t.is_essential !== undefined && t.is_essential !== null && (
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                                  t.is_essential
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}
                              >
                                {t.is_essential ? 'Essential' : 'Aspirational'}
                              </span>
                            )}

                            {t.risk_flag && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-semibold flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-rose-600" />
                                {t.risk_flag}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Unresolved</span>
                      )}
                    </td>

                    {/* Withdrawals */}
                    <td className="px-4 py-3 text-xs text-right font-mono font-semibold text-rose-700 whitespace-nowrap">
                      {t.withdrawals ? `₹${t.withdrawals}` : '-'}
                    </td>

                    {/* Deposits */}
                    <td className="px-4 py-3 text-xs text-right font-mono font-semibold text-emerald-700 whitespace-nowrap">
                      {t.deposits ? `₹${t.deposits}` : '-'}
                    </td>

                    {/* Balance */}
                    <td className="px-4 py-3 text-xs text-right font-mono font-medium text-slate-900 whitespace-nowrap">
                      {t.balance ? `₹${t.balance}` : '-'}
                    </td>

                    {/* Inspect button affordance */}
                    <td className="px-3 py-3 text-center">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-300 group-hover:text-amber-700 group-hover:bg-amber-100/60 transition-all mx-auto">
                        <Maximize2 size={13} />
                      </div>
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
