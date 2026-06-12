import React from 'react';
import { UploadDropzone } from '../ingest/UploadDropzone';
import { ProcessingStatus } from '../ingest/ProcessingStatus';
import { StatsOverview } from '../results/StatsOverview';
import { TransactionTable } from '../results/TransactionTable';
import { useProcessStatement } from '../ingest/hooks/useProcessStatement';

export const Dashboard: React.FC = () => {
  const { file, setFile, isProcessing, progress, step, error, transactions, processFile } =
    useProcessStatement();

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 md:py-12 flex flex-col gap-8 flex-1">
      {/* Conditionally hide the upload area if we have successful results, 
          or maybe keep a smaller version. For now, keep it visible so they can upload again. */}
      {!transactions && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-[0.65rem] tracking-[0.2em] uppercase text-slate-500 font-medium mb-3">
            Ingest
          </div>
          <UploadDropzone
            file={file}
            onFileSelect={setFile}
            onProcess={processFile}
            isProcessing={isProcessing}
          />
        </section>
      )}

      {/* Status section shows while processing or if there's an error */}
      <ProcessingStatus isProcessing={isProcessing} step={step} progress={progress} error={error} />

      {/* Results Section */}
      {transactions && transactions.length > 0 && (
        <section className="mt-4">
          <StatsOverview transactions={transactions} />
          <TransactionTable transactions={transactions} />

          <div className="mt-8 flex justify-center">
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
