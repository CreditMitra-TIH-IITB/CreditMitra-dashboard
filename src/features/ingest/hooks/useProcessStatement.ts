import { useState, useCallback, useRef } from 'react';
import { uploadStatementPdf, fetchTaskStatus, fetchTaskReport } from '../../../services/api';
import type { Transaction, CreditRiskReport } from '../../../types/transaction';

export function useProcessStatement() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [report, setReport] = useState<CreditRiskReport | null>(null);

  const pollIntervalRef = useRef<number | null>(null);

  const reset = () => {
    setFile(null);
    setIsProcessing(false);
    setProgress(0);
    setStep(0);
    setError(null);
    setTransactions(null);
    setReport(null);
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
  };

  const pollTaskStatus = useCallback(async (taskId: string) => {
    try {
      const data = await fetchTaskStatus(taskId);

      if (data.status === 'completed') {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        setProgress(100);
        setStep(2);
        setTransactions(data.transactions || []);

        let currentReport = data.report || null;
        if (!currentReport) {
          try {
            const reportResp = await fetchTaskReport(taskId);
            currentReport = reportResp.report || null;
          } catch (e) {
            console.warn('Report fetch warning:', e);
          }
        }
        setReport(currentReport);
        setIsProcessing(false);
      } else if (data.status === 'failed') {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        setProgress(100);
        setError(data.error || 'Task failed during processing.');
        setIsProcessing(false);
      } else {
        // Still processing
        setProgress((prev) => {
          if (prev < 50) return prev + Math.random() * 5;
          if (prev === 50) setStep(2);
          if (prev < 90) return prev + Math.random() * 2;
          return prev;
        });
      }
    } catch (err: unknown) {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      const e = err as { response?: { data?: { detail?: string } }; message?: string };
      setError(e.response?.data?.detail || e.message || 'Error checking status.');
      setIsProcessing(false);
    }
  }, []);

  const processFile = useCallback(async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setStep(1);
    setProgress(10);
    setTransactions(null);
    setReport(null);

    try {
      // 1. Dispatch background task
      const response = await uploadStatementPdf(file);
      const taskId = response.task_id;

      // 2. Poll for status every 1.5 seconds
      pollIntervalRef.current = window.setInterval(() => {
        pollTaskStatus(taskId);
      }, 1500);
    } catch (err: unknown) {
      setProgress(100);
      const e = err as { response?: { data?: { detail?: string } }; message?: string };
      setError(
        e.response?.data?.detail || e.message || 'An error occurred uploading the statement.',
      );
      setIsProcessing(false);
    }
  }, [file, pollTaskStatus]);

  return {
    file,
    setFile,
    isProcessing,
    progress,
    step,
    error,
    transactions,
    report,
    processFile,
    reset,
  };
}
