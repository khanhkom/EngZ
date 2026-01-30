import { apiClient } from '../client.js';
import type {
  ApiResponse,
  PaginatedResponse,
  ApiNotebookEntry,
  CreateNotebookEntryRequest,
  UpdateNotebookEntryRequest,
  BulkCreateNotebookRequest,
  BulkCreateNotebookResponse,
  NotebookSyncParams,
  DeleteNotebookEntryResponse,
  RestoreNotebookEntryResponse,
} from '../types.js';

const buildQueryString = (params: NotebookSyncParams): string => {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) searchParams.set('page', String(params.page));
  if (params.perPage !== undefined) searchParams.set('perPage', String(params.perPage));
  if (params.search) searchParams.set('search', params.search);
  if (params.orderBy) searchParams.set('orderBy', params.orderBy);
  if (params.orderDirection) searchParams.set('orderDirection', params.orderDirection);
  if (params.status) searchParams.set('status', params.status);
  if (params.since) searchParams.set('since', params.since);
  if (params.includeDeleted) searchParams.set('includeDeleted', 'true');

  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

const notebookApi = {
  /**
   * List notebook entries with pagination and filtering
   * GET /shared/notebook
   */
  list: (params: NotebookSyncParams = {}) =>
    apiClient.get<PaginatedResponse<ApiNotebookEntry>>(`/shared/notebook${buildQueryString(params)}`),

  /**
   * Get a single notebook entry by ID
   * GET /shared/notebook/:id
   */
  get: (id: string) => apiClient.get<ApiResponse<ApiNotebookEntry>>(`/shared/notebook/${id}`),

  /**
   * Create a new notebook entry
   * POST /shared/notebook
   */
  create: (data: CreateNotebookEntryRequest) => apiClient.post<ApiResponse<ApiNotebookEntry>>('/shared/notebook', data),

  /**
   * Create multiple notebook entries at once
   * POST /shared/notebook/bulk
   */
  bulkCreate: (data: BulkCreateNotebookRequest) =>
    apiClient.post<ApiResponse<BulkCreateNotebookResponse>>('/shared/notebook/bulk', data),

  /**
   * Update an existing notebook entry
   * PATCH /shared/notebook/:id
   */
  update: (id: string, data: UpdateNotebookEntryRequest) =>
    apiClient.patch<ApiResponse<ApiNotebookEntry>>(`/shared/notebook/${id}`, data),

  /**
   * Soft delete a notebook entry
   * DELETE /shared/notebook/:id
   */
  delete: (id: string) => apiClient.delete<ApiResponse<DeleteNotebookEntryResponse>>(`/shared/notebook/${id}`),

  /**
   * Restore a soft-deleted notebook entry
   * POST /shared/notebook/:id/restore
   */
  restore: (id: string) => apiClient.post<ApiResponse<RestoreNotebookEntryResponse>>(`/shared/notebook/${id}/restore`),
};

export { notebookApi };
