import { useState, useCallback, useRef, useEffect } from 'react';
import { uploadStatementPdf, fetchTaskStatus, fetchTaskReport } from '../../../services/api';
import type { Transaction, CreditRiskReport } from '../../../types/transaction';

const POLL_INTERVAL_MS = 1500;
// Consecutive failed polls tolerated before giving up. Processing a statement
// takes minutes, so one dropped request (engine busy, network blip) must not
// surface as an error while the task is still running fine on the server.
const MAX_CONSECUTIVE_POLL_FAILURES = 5;

type ApiError = { response?: { status?: number; data?: { detail?: string } }; message?: string };

export function useProcessStatement() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [report, setReport] = useState<CreditRiskReport | null>(null);

  const pollIntervalRef = useRef<number | null>(null);
  const pollInFlightRef = useRef(false);
  const pollFailuresRef = useRef(0);

  const stopPolling = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    pollIntervalRef.current = null;
  };

  // Stop polling if the component unmounts mid-task.
  useEffect(() => stopPolling, []);

  const reset = () => {
    stopPolling();
    setFile(null);
    setIsProcessing(false);
    setProgress(0);
    setStep(0);
    setError(null);
    setTransactions(null);
    setReport(null);
  };

  const pollTaskStatus = useCallback(async (taskId: string) => {
    // Skip a tick rather than stack requests when the engine is slow to answer.
    if (pollInFlightRef.current) return;
    pollInFlightRef.current = true;

    try {
      const data = await fetchTaskStatus(taskId);
      pollFailuresRef.current = 0;

      if (data.status === 'completed') {
        stopPolling();
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
        stopPolling();
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
      const e = err as ApiError;
      // A 404 means the task is gone — retrying cannot fix that.
      const fatal = e.response?.status === 404;
      pollFailuresRef.current += 1;
      if (fatal || pollFailuresRef.current >= MAX_CONSECUTIVE_POLL_FAILURES) {
        stopPolling();
        setError(e.response?.data?.detail || e.message || 'Error checking status.');
        setIsProcessing(false);
      } else {
        console.warn(
          `Status poll failed (${pollFailuresRef.current}/${MAX_CONSECUTIVE_POLL_FAILURES}), retrying:`,
          e.message,
        );
      }
    } finally {
      pollInFlightRef.current = false;
    }
  }, []);

  const processFile = useCallback(async () => {
    if (!file) return;

    stopPolling();
    pollFailuresRef.current = 0;
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

      // 2. Poll for status
      pollIntervalRef.current = window.setInterval(() => {
        pollTaskStatus(taskId);
      }, POLL_INTERVAL_MS);
    } catch (err: unknown) {
      setProgress(100);
      const e = err as ApiError;
      setError(
        e.response?.data?.detail || e.message || 'An error occurred uploading the statement.',
      );
      setIsProcessing(false);
    }
  }, [file, pollTaskStatus]);

  const loadPreset = useCallback(
    (presetTransactions: Transaction[], presetReport: CreditRiskReport | null) => {
      stopPolling();
      setFile(null);
      setIsProcessing(false);
      setProgress(100);
      setStep(2);
      setError(null);
      setTransactions(presetTransactions);
      setReport(presetReport);
    },
    [],
  );

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
    loadPreset,
  };
}
