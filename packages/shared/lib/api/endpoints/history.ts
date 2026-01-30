import { apiClient } from '../client.js';
import type {
  ApiResponse,
  PaginatedResponse,
  ApiHistoryEntry,
  LogHistoryRequest,
  ClearHistoryResponse,
  DeleteHistoryResponse,
  HistoryListParams,
} from '../types.js';

const buildQueryString = (params: HistoryListParams): string => {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) searchParams.set('page', String(params.page));
  if (params.perPage !== undefined) searchParams.set('perPage', String(params.perPage));
  if (params.orderBy) searchParams.set('orderBy', params.orderBy);
  if (params.orderDirection) searchParams.set('orderDirection', params.orderDirection);
  if (params.provider) searchParams.set('provider', params.provider);
  if (params.startDate) searchParams.set('startDate', params.startDate);
  if (params.endDate) searchParams.set('endDate', params.endDate);

  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

const historyApi = {
  /**
   * List search history with pagination and filtering
   * GET /shared/history
   */
  list: (params: HistoryListParams = {}) =>
    apiClient.get<PaginatedResponse<ApiHistoryEntry>>(`/history/list${buildQueryString(params)}`),

  /**
   * Log a search query to history
   * POST /shared/history
   * Note: This is designed for fire-and-forget usage
   */
  log: (data: LogHistoryRequest) => apiClient.post<ApiResponse<ApiHistoryEntry>>('/history/create', data),

  /**
   * Clear all history entries
   * DELETE /shared/history
   */
  clear: () => apiClient.delete<ApiResponse<ClearHistoryResponse>>('/history'),

  /**
   * Delete a single history entry
   * DELETE /shared/history/:id
   */
  delete: (id: string) => apiClient.delete<ApiResponse<DeleteHistoryResponse>>(`/history/delete/${id}`),
};

export { historyApi };
