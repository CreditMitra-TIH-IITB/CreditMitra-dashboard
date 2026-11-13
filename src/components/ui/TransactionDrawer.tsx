import React from 'react';
import type { Transaction } from '../../types/transaction';
import { X, Store, User, ArrowDownLeft, ArrowUpRight, ShieldCheck, Tag, Calendar, Wallet } from 'lucide-react';

interface TransactionDrawerProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const TransactionDrawer: React.FC<TransactionDrawerProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const isCredit =
    transaction.direction === 'credit' ||
    Boolean(transaction.deposits && parseFloat(transaction.deposits.replace(/,/g, '')) > 0);

  const amountDisplay = isCredit
    ? `+₹${transaction.deposits || transaction.amount?.toLocaleString('en-IN') || '0.00'}`
    : `-₹${transaction.withdrawals || transaction.amount?.toLocaleString('en-IN') || '0.00'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.15)] overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-full shadow-2xs">
              Transaction Inspection
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Main Amount & Payee Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs text-slate-500 block mb-1">Transaction Value</span>
              <h2
                className={`font-mono text-3xl font-bold tracking-tight ${
                  isCredit ? 'text-emerald-700' : 'text-slate-900'
                }`}
              >
                {amountDisplay}
              </h2>
            </div>

            <div
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-semibold ${
                isCredit
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
              <span className="capitalize">{transaction.direction || (isCredit ? 'Credit (Inflow)' : 'Debit (Outflow)')}</span>
            </div>
          </div>

          {/* Payee Entity Extraction Details */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Resolved Entity Metadata
            </span>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Normalized Payee:</span>
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 text-sm">
                  {transaction.payee_type === 'merchant' ? (
                    <Store className="w-4 h-4 text-amber-600" />
                  ) : (
                    <User className="w-4 h-4 text-teal-600" />
                  )}
                  <span>{transaction.payee || 'Unresolved Entity'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Classification:</span>
                <span className="font-medium text-slate-800 capitalize bg-white px-2 py-0.5 rounded border border-slate-200">
                  {transaction.payee_type || 'Unknown'} (P2{transaction.payee_type === 'merchant' ? 'M' : 'P'})
                </span>
              </div>

              {transaction.payee_confidence !== undefined && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Model Confidence:</span>
                  <div className="flex items-center gap-1 text-emerald-700 font-semibold font-mono">
                    <ShieldCheck size={14} />
                    <span>{Math.round((transaction.payee_confidence || 0.95) * 100)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Raw Bank Narration */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Raw Bank Statement Narration
            </span>
            <div className="p-3.5 bg-slate-100/70 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 break-all select-all leading-relaxed">
              {transaction.particulars}
            </div>
          </div>

          {/* Underwriting Taxonomies & Tags */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
              <span className="text-slate-500 text-[11px] flex items-center gap-1">
                <Tag size={12} className="text-slate-400" /> Category
              </span>
              <p className="font-semibold text-slate-800 capitalize">
                {transaction.category?.replace(/_/g, ' ') || 'Other / General'}
              </p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
              <span className="text-slate-500 text-[11px] flex items-center gap-1">
                <Calendar size={12} className="text-slate-400" /> Transaction Date
              </span>
              <p className="font-semibold text-slate-800 font-mono">
                {transaction.date || transaction.txn_date || 'N/A'}
              </p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
              <span className="text-slate-500 text-[11px] flex items-center gap-1">
                <Wallet size={12} className="text-slate-400" /> Account Balance
              </span>
              <p className="font-semibold text-slate-800 font-mono">
                {transaction.balance ? `₹${transaction.balance}` : 'N/A'}
              </p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
              <span className="text-slate-500 text-[11px]">Lifestyle Dimension</span>
              <p className="font-semibold text-slate-800 capitalize">
                {transaction.lifestyle_dim || 'Standard'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
