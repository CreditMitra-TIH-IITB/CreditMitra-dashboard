import React, { useEffect, useState } from 'react';
import { fetchEngineStats, fetchTaskStatus, fetchTaskReport } from '../../services/api';
import type { EngineStatsResponse, StatementSummaryItem, Transaction, CreditRiskReport } from '../../types/transaction';
import { Database, FileCheck, Clock, Zap, ArrowRight, RotateCw } from 'lucide-react';

interface StatementHistoryProps {
  onLoadStatement?: (transactions: Transaction[], report: CreditRiskReport | null, name: string) => void;
}

export const StatementHistory: React.FC<StatementHistoryProps> = ({ onLoadStatement }) => {
  const [stats, setStats] = useState<EngineStatsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await fetchEngineStats();
      setStats(data);
    } catch (e) {
      console.warn('Failed to fetch engine stats:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleOpenPrevious = async (item: StatementSummaryItem) => {
    if (!onLoadStatement) return;
    try {
      const statusData = await fetchTaskStatus(item.task_id);
      let reportData = statusData.report;
      if (!reportData) {
        try {
          const reportResp = await fetchTaskReport(item.task_id);
          reportData = reportResp.report;
        } catch {
          // ignore
        }
      }
      onLoadStatement(
        statusData.transactions || [],
        reportData || null,
        item.filename || `Statement ${item.task_id.slice(0, 8)}`,
      );
    } catch (err) {
      console.error('Error loading previous statement:', err);
    }
  };

  if (!stats || stats.total_statements_processed === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/70">
            <Database size={16} />
          </div>
          <div>
            <h4 className="font-serif text-lg font-semibold text-slate-900 leading-tight">
              Underwriting History & Engine Telemetry
            </h4>
            <p className="text-xs text-slate-500">
              Verified on-device statement throughput and completed runs
            </p>
          </div>
        </div>

        <button
          onClick={loadStats}
          disabled={loading}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          title="Refresh engine telemetry"
        >
          <RotateCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0">
            <FileCheck size={18} />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Total Statements Done</span>
            <span className="font-serif text-xl font-bold text-slate-900 font-mono">
              {stats.total_statements_processed} statements
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200 shrink-0">
            <Zap size={18} />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Transactions Analyzed</span>
            <span className="font-serif text-xl font-bold text-slate-900 font-mono">
              {stats.total_transactions_analyzed.toLocaleString('en-IN')} rows
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 shrink-0">
            <Clock size={18} />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Average Processing Turnaround</span>
            <span className="font-serif text-xl font-bold text-slate-900 font-mono">
              {stats.avg_processing_time_seconds > 0 ? `${stats.avg_processing_time_seconds}s` : '~22s'}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Statements Table List */}
      {stats.recent_statements && stats.recent_statements.length > 0 && (
        <div className="space-y-2 pt-2">
          <span className="text-[0.6875rem] uppercase tracking-wider text-slate-400 font-semibold block">
            Previously Processed Statements
          </span>
          <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden bg-slate-50/50">
            {stats.recent_statements.slice(0, 5).map((item) => (
              <div
                key={item.task_id}
                className="p-3.5 flex items-center justify-between hover:bg-amber-50/40 transition-colors text-xs gap-3"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <div className="truncate">
                    <span className="font-semibold text-slate-900 block truncate">
                      {item.filename || `Statement ${item.task_id.slice(0, 8)}.pdf`}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.transaction_count} rows extracted ·{' '}
                      {item.processing_time_seconds ? `${item.processing_time_seconds}s turnaround` : 'completed'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {item.score && (
                    <span className="font-mono font-bold text-amber-900 bg-amber-100/80 border border-amber-200 px-2 py-0.5 rounded-lg text-xs">
                      {item.score} ({item.band})
                    </span>
                  )}
                  {onLoadStatement && (
                    <button
                      onClick={() => handleOpenPrevious(item)}
                      className="flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50 text-slate-700 hover:text-amber-900 rounded-xl transition-all shadow-2xs font-medium"
                    >
                      <span>View</span>
                      <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
