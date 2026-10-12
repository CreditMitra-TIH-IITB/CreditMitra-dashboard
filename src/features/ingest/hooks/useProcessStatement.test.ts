import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useProcessStatement } from './useProcessStatement';
import * as api from '../../../services/api';

vi.mock('../../../services/api', () => ({
  uploadStatementPdf: vi.fn(),
  fetchTaskStatus: vi.fn(),
  fetchTaskReport: vi.fn(),
}));

const mockedApi = vi.mocked(api);

async function startProcessing() {
  const hook = renderHook(() => useProcessStatement());
  act(() => hook.result.current.setFile(new File(['%PDF'], 'statement.pdf')));
  await act(async () => {
    await hook.result.current.processFile();
  });
  return hook;
}

async function tick() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(1500);
  });
}

describe('useProcessStatement polling', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockedApi.uploadStatementPdf.mockResolvedValue({
      task_id: 't1',
      status: 'pending',
      message: '',
    });
    mockedApi.fetchTaskReport.mockResolvedValue({
      task_id: 't1',
      status: 'completed',
      report: null,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  it('keeps polling through transient failures and completes', async () => {
    mockedApi.fetchTaskStatus
      .mockRejectedValueOnce(new Error('Network Error'))
      .mockRejectedValueOnce(new Error('Network Error'))
      .mockResolvedValueOnce({
        task_id: 't1',
        status: 'completed',
        transactions: [],
        report: null,
      });

    const { result } = await startProcessing();
    await tick();
    await tick();
    expect(result.current.error).toBeNull();
    expect(result.current.isProcessing).toBe(true);

    await tick();
    expect(result.current.error).toBeNull();
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.transactions).toEqual([]);
  });

  it('gives up after repeated consecutive failures', async () => {
    mockedApi.fetchTaskStatus.mockRejectedValue(new Error('Network Error'));

    const { result } = await startProcessing();
    for (let i = 0; i < 5; i++) await tick();

    expect(result.current.isProcessing).toBe(false);
    expect(result.current.error).toBe('Network Error');
  });

  it('stops immediately when the task no longer exists', async () => {
    mockedApi.fetchTaskStatus.mockRejectedValue({
      response: { status: 404, data: { detail: 'Task not found' } },
    });

    const { result } = await startProcessing();
    await tick();

    expect(result.current.isProcessing).toBe(false);
    expect(result.current.error).toBe('Task not found');
  });
});
