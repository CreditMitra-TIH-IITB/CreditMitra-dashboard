import { useState, useCallback, useRef, useEffect } from 'react';
import { uploadStatementPdf, fetchTaskStatus, fetchTaskReport } from '../../../services/api';
import type { Transaction, CreditRiskReport, TaskTelemetry } from '../../../types/transaction';

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
  const [telemetry, setTelemetry] = useState<TaskTelemetry | null>(null);

  const pollIntervalRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pollInFlightRef = useRef(false);
  const pollFailuresRef = useRef(0);

  const stopPolling = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    pollIntervalRef.current = null;
    timerIntervalRef.current = null;
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
    setTelemetry(null);
  };

  const pollTaskStatus = useCallback(async (taskId: string) => {
    // Skip a tick rather than stack requests when the engine is slow to answer.
    if (pollInFlightRef.current) return;
    pollInFlightRef.current = true;

    try {
      const data = await fetchTaskStatus(taskId);
      pollFailuresRef.current = 0;

      // Update telemetry directly from real backend engine data
      setTelemetry((prev) => ({
        ...prev,
        ...data,
        elapsed_seconds:
          data.elapsed_seconds ??
          (startTimeRef.current ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0),
      }));

      if (data.status === 'completed') {
        stopPolling();
        setProgress(100);
        setStep(4);
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
        // Still processing: strictly use backend progress, stage, and ETA
        if (typeof data.progress === 'number') {
          setProgress(data.progress);
        } else {
          // If backend hasn't reported percentage yet, set base extraction mark
          setProgress((prev) => Math.max(prev, 15));
        }

        if (typeof data.stage_index === 'number') {
          setStep(data.stage_index);
        }
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
    startTimeRef.current = Date.now();

    setTelemetry({
      stage: 'extracting',
      stage_index: 1,
      stage_name: 'PDF Table Extraction (Docling)',
      progress: 10,
      message: 'Extracting tabular records from statement PDF...',
      elapsed_seconds: 0,
      eta_seconds: 25,
      total_rows: 0,
      processed_rows: 0,
    });

    // Start local 1-second elapsed ticker for ultra-smooth UI
    timerIntervalRef.current = window.setInterval(() => {
      setTelemetry((prev) => {
        if (!prev) return null;
        const currentElapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
        return {
          ...prev,
          elapsed_seconds: currentElapsed,
        };
      });
    }, 1000);

    try {
      // 1. Dispatch background task
      const response = await uploadStatementPdf(file);
      const taskId = response.task_id;

      // 2. Poll for status with true telemetry
      pollIntervalRef.current = window.setInterval(() => {
        pollTaskStatus(taskId);
      }, POLL_INTERVAL_MS);
    } catch (err: unknown) {
      stopPolling();
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
      setStep(4);
      setError(null);
      setTransactions(presetTransactions);
      setReport(presetReport);
      setTelemetry({
        stage: 'completed',
        stage_index: 4,
        stage_name: 'Underwriting Complete',
        progress: 100,
        message: `Loaded ${presetTransactions.length} transactions from verified profile`,
        total_rows: presetTransactions.length,
        processed_rows: presetTransactions.length,
        elapsed_seconds: 0,
        eta_seconds: 0,
      });
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
    telemetry,
    processFile,
    reset,
    loadPreset,
  };
}
