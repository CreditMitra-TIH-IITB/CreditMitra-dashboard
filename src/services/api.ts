import axios from 'axios';
import type { ProcessResponse, TaskStatusResponse, ReportResponse } from '../types/transaction';
import { MOCK_REPORT, MOCK_TRANSACTIONS } from './mockData';

const isMock = import.meta.env.VITE_USE_MOCK === '1' || import.meta.env.VITE_USE_MOCK === 'true';

const defaultBaseUrl = import.meta.env.DEV ? '/api/v1' : 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || defaultBaseUrl,
});

export async function uploadStatementPdf(file: File): Promise<ProcessResponse> {
  if (isMock) {
    return {
      task_id: 'mock-task-12345',
      status: 'completed',
      message: 'Mock processing completed immediately.',
    };
  }

  const formData = new FormData();
  formData.append('pdf', file);

  const response = await api.post<ProcessResponse>('/statements/process', formData);
  return response.data;
}

export async function fetchTaskStatus(taskId: string): Promise<TaskStatusResponse> {
  if (isMock || taskId.startsWith('mock-')) {
    return {
      task_id: taskId,
      status: 'completed',
      transactions: MOCK_TRANSACTIONS,
      report: MOCK_REPORT,
    };
  }

  const response = await api.get<TaskStatusResponse>(`/statements/status/${taskId}`);
  return response.data;
}

export async function fetchTaskReport(taskId: string): Promise<ReportResponse> {
  if (isMock || taskId.startsWith('mock-')) {
    return {
      task_id: taskId,
      status: 'completed',
      report: MOCK_REPORT,
    };
  }

  const response = await api.get<ReportResponse>(`/statements/report/${taskId}`);
  return response.data;
}

export async function fetchEngineStats(): Promise<import('../types/transaction').EngineStatsResponse> {
  if (isMock) {
    return {
      total_statements_processed: 3,
      total_transactions_analyzed: 45,
      avg_processing_time_seconds: 18.4,
      recent_statements: [],
    };
  }

  const response = await api.get<import('../types/transaction').EngineStatsResponse>('/statements/stats');
  return response.data;
}

export default api;
