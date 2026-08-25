import axios from 'axios';
import type { ProcessResponse, TaskStatusResponse, ReportResponse } from '../types/transaction';
import { MOCK_REPORT, MOCK_TRANSACTIONS } from './mockData';

const isMock = import.meta.env.VITE_USE_MOCK === '1' || import.meta.env.VITE_USE_MOCK === 'true';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1',
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

export default api;
