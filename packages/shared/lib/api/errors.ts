import type { ApiErrorResponse } from './types.js';

export class ApiClientError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string | undefined;
  public readonly details: ApiErrorResponse | undefined;

  constructor(message: string, statusCode: number, details?: ApiErrorResponse) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.errorCode = details?.error;
    this.details = details;

    // Maintains proper stack trace for where error was thrown (only in V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiClientError);
    }
  }

  get isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  get isForbidden(): boolean {
    return this.statusCode === 403;
  }

  get isNotFound(): boolean {
    return this.statusCode === 404;
  }

  get isConflict(): boolean {
    return this.statusCode === 409;
  }

  get isValidationError(): boolean {
    return this.statusCode === 400 || this.statusCode === 422;
  }

  get isRateLimited(): boolean {
    return this.statusCode === 429;
  }

  get isServerError(): boolean {
    return this.statusCode >= 500;
  }

  get isNetworkError(): boolean {
    return this.statusCode === 0;
  }
}

/**
 * Type guard to check if an error is an ApiClientError
 */
export const isApiError = (error: unknown): error is ApiClientError => error instanceof ApiClientError;

/**
 * Extract a user-friendly error message from any error
 */
export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
