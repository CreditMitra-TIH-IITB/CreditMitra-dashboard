import React, { useState } from 'react';
import { UploadDropzone } from '../ingest/UploadDropzone';
import { ProcessingStatus } from '../ingest/ProcessingStatus';
import { StatsOverview } from '../results/StatsOverview';
import { TransactionTable } from '../results/TransactionTable';
import { LifestyleReport } from '../risk/LifestyleReport';
import { CategoryBreakdown } from '../results/CategoryBreakdown';
import { CashFlow } from '../results/CashFlow';
import { useProcessStatement } from '../ingest/hooks/useProcessStatement';
import { StatementHistory } from '../ingest/StatementHistory';
import { Award, PieChart, Table, FileUp, AlertCircle, Sparkles } from 'lucide-react';
import { DEMO_PERSONAS } from '../../services/mockData';

export const Dashboard: React.FC = () => {
  const {
    file,
    setFile,
    isProcessing,
    progress,
    step,
    error,
    transactions,
    report,
    telemetry,
    processFile,
    reset,
    loadPreset,
  } = useProcessStatement();

  const [activeTab, setActiveTab] = useState<'report' | 'analytics' | 'ledger'>('report');
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);

  const handleSelectPersona = (personaId: string) => {
    const target = DEMO_PERSONAS.find((p) => p.id === personaId);
    if (target) {
      setSelectedPersonaId(personaId);
      loadPreset(target.transactions, target.report);
      setActiveTab('report');
    }
  };

  const handleReset = () => {
    setSelectedPersonaId(null);
    reset();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 md:py-12 flex flex-col gap-8 flex-1">
      {/* Upload Section */}
      {!transactions && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          <div className="text-[0.65rem] tracking-[0.2em] uppercase text-slate-500 font-semibold mb-3">
            Statement Ingestion Hub
          </div>
          <UploadDropzone
            file={file}
            onFileSelect={setFile}
            onProcess={processFile}
            isProcessing={isProcessing}
            onSelectPersona={handleSelectPersona}
          />
          {/* Engine History & Stats */}
          {!isProcessing && (
            <StatementHistory
              onLoadStatement={(txns, rep, name) => {
                setSelectedPersonaId(name);
                loadPreset(txns, rep);
                setActiveTab('report');
              }}
            />
          )}
        </section>
      )}

      {/* Processing Pipeline Stepper HUD with Real Telemetry & ETA */}
      <ProcessingStatus
        isProcessing={isProcessing}
        step={step}
        progress={progress}
        error={error}
        telemetry={telemetry}
      />

      {/* Results Navigation & Tab Content */}
      {transactions && transactions.length > 0 && (
        <section className="mt-2 space-y-6">
          {/* Persona Switcher Banner if in Demo mode */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-xs font-semibold text-slate-800">
                {selectedPersonaId
                  ? `Active Profile: ${DEMO_PERSONAS.find((p) => p.id === selectedPersonaId)?.name}`
                  : 'Custom Statement Ingested'}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-slate-400 hidden lg:inline">Switch profile:</span>
              {DEMO_PERSONAS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPersona(p.id)}
                  className={`px-3 py-1 text-xs rounded-xl transition-all ${
                    selectedPersonaId === p.id
                      ? 'bg-amber-100/90 text-amber-900 border border-amber-300 font-semibold shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                  }`}
                >
                  <Sparkles size={11} className="inline mr-1 text-amber-600" />
                  {p.name.split(' (')[0]}
                </button>
              ))}

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:text-amber-800 hover:border-amber-300 hover:bg-amber-50 transition-all shadow-2xs ml-auto sm:ml-2"
              >
                <FileUp size={13} className="text-slate-500" />
                Upload New Statement
              </button>
            </div>
          </div>

          {/* Key KPI Metric Cards */}
          <StatsOverview transactions={transactions} />

          {/* Navigation Tabs Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar">
              <button
                onClick={() => setActiveTab('report')}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                  activeTab === 'report'
                    ? 'border-amber-600 text-amber-900 bg-amber-50/80 font-semibold shadow-2xs'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 font-medium'
                }`}
              >
                <Award className="w-4 h-4 text-amber-600" />
                Lifestyle Credit Report
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'border-amber-600 text-amber-900 bg-amber-50/80 font-semibold shadow-2xs'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 font-medium'
                }`}
              >
                <PieChart className="w-4 h-4 text-amber-600" />
                Spend Analytics
              </button>

              <button
                onClick={() => setActiveTab('ledger')}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                  activeTab === 'ledger'
                    ? 'border-amber-600 text-amber-900 bg-amber-50/80 font-semibold shadow-2xs'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 font-medium'
                }`}
              >
                <Table className="w-4 h-4 text-amber-600" />
                Transaction Ledger ({transactions.length})
              </button>
            </div>
          </div>

          {/* Active Tab Views */}
          {activeTab === 'report' &&
            (report ? (
              <LifestyleReport report={report} />
            ) : (
              <div className="flex items-start gap-3 text-sm text-amber-900 bg-amber-50 border border-amber-200/90 px-4 py-3.5 rounded-xl shadow-2xs">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-700" />
                <div>
                  <p className="font-semibold">Credit report unavailable for this statement</p>
                  <p className="text-xs text-amber-800/80 mt-1 leading-relaxed">
                    Transactions were extracted, but the statement did not carry enough parsed data
                    to compute a score. The ledger and analytics tabs are still accurate.
                  </p>
                </div>
              </div>
            ))}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
              <CashFlow transactions={transactions} />
              <CategoryBreakdown transactions={transactions} />
            </div>
          )}

          {activeTab === 'ledger' && <TransactionTable transactions={transactions} />}

          <div className="mt-8 flex justify-center sm:hidden">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl shadow-xs transition-colors"
            >
              Upload another statement
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
