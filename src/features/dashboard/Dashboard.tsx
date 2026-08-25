import React, { useState } from 'react';
import { UploadDropzone } from '../ingest/UploadDropzone';
import { ProcessingStatus } from '../ingest/ProcessingStatus';
import { StatsOverview } from '../results/StatsOverview';
import { TransactionTable } from '../results/TransactionTable';
import { LifestyleReport } from '../risk/LifestyleReport';
import { CategoryBreakdown } from '../results/CategoryBreakdown';
import { CashFlow } from '../results/CashFlow';
import { useProcessStatement } from '../ingest/hooks/useProcessStatement';
import { Award, PieChart, Table, FileText, AlertCircle } from 'lucide-react';
import { MOCK_REPORT } from '../../services/mockData';

export const Dashboard: React.FC = () => {
  const { file, setFile, isProcessing, progress, step, error, transactions, report, processFile } =
    useProcessStatement();

  const [activeTab, setActiveTab] = useState<'report' | 'analytics' | 'ledger'>('report');

  const displayReport = report || (transactions && transactions.length > 0 ? MOCK_REPORT : null);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 md:py-12 flex flex-col gap-8 flex-1">
      {/* Upload Section */}
      {!transactions && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-[0.65rem] tracking-[0.2em] uppercase text-slate-500 font-medium mb-3">
            Statement Ingestion
          </div>
          <UploadDropzone
            file={file}
            onFileSelect={setFile}
            onProcess={processFile}
            isProcessing={isProcessing}
          />
        </section>
      )}

      {/* Processing Status */}
      <ProcessingStatus isProcessing={isProcessing} step={step} progress={progress} error={error} />

      {/* Results Navigation & Tab Content */}
      {transactions && transactions.length > 0 && (
        <section className="mt-2 space-y-6">
          <StatsOverview transactions={transactions} />

          {/* Navigation Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('report')}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all border-b-2 ${
                  activeTab === 'report'
                    ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Award className="w-4 h-4" />
                Lifestyle Credit Report
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all border-b-2 ${
                  activeTab === 'analytics'
                    ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <PieChart className="w-4 h-4" />
                Spend Analytics
              </button>

              <button
                onClick={() => setActiveTab('ledger')}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all border-b-2 ${
                  activeTab === 'ledger'
                    ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Table className="w-4 h-4" />
                Transaction Ledger ({transactions.length})
              </button>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-amber-400 border border-white/10 rounded-lg hover:border-amber-500/30 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              Upload New Statement
            </button>
          </div>

          {/* Active Tab Views */}
          {activeTab === 'report' && displayReport && (
            <div className="space-y-4">
              {!report && (
                <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span>
                    Showing sample report format (scoring was computed for recent transactions).
                  </span>
                </div>
              )}
              <LifestyleReport report={displayReport} />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
              <CashFlow transactions={transactions} />
              <CategoryBreakdown transactions={transactions} />
            </div>
          )}

          {activeTab === 'ledger' && <TransactionTable transactions={transactions} />}

          <div className="mt-8 flex justify-center sm:hidden">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Upload another statement
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
