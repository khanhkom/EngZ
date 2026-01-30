// API Client
export { apiClient, initializeApiClient } from './client.js';
export type { ApiClientConfig } from './client.js';

// Error handling
export { ApiClientError, isApiError, getErrorMessage } from './errors.js';

// Endpoint APIs
export { authApi } from './endpoints/auth.js';
export { notebookApi } from './endpoints/notebook.js';
export { historyApi } from './endpoints/history.js';

// Types
export type {
  // Base types
  ApiMetadata,
  ApiResponse,
  PaginatedMetadata,
  PaginatedResponse,
  ApiErrorResponse,
  // Auth types
  TokenPair,
  UserPhoto,
  UserRole,
  ApiUser,
  SignUpRequest,
  SignUpResponse,
  LoginRequest,
  UpdateProfileRequest,
  UpdateProfileResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  // Notebook types
  NotebookEntryStatus,
  ApiNotebookEntry,
  CreateNotebookEntryRequest,
  UpdateNotebookEntryRequest,
  BulkCreateNotebookRequest,
  BulkCreateNotebookResponse,
  NotebookSyncParams,
  DeleteNotebookEntryResponse,
  RestoreNotebookEntryResponse,
  // History types
  HistoryProvider,
  ApiHistoryEntry,
  LogHistoryRequest,
  ClearHistoryResponse,
  DeleteHistoryResponse,
  HistoryListParams,
} from './types.js';
