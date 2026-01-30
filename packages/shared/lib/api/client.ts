import { ApiClientError } from './errors.js';
import type { ApiErrorResponse, ApiResponse, TokenPair } from './types.js';

// API Configuration - set via initializeApiClient or use defaults
let BASE_URL = 'https://api.engz.io.vn';
const API_PREFIX = '/api/v1';
let API_KEY = 'local_fyFGb7ywyM37TqDY8nuhAmGW5:qbp7LmCxYUTHFwKvHnxGW1aTyjSNU6ytN21etK89MaP2Dj2KZP';

// Token refresh state to prevent concurrent refresh requests
let isRefreshing = false;
let refreshPromise: Promise<TokenPair | null> | null = null;

// Auth state getter/setter - will be injected from auth-storage
let getAuthState: (() => Promise<AuthStateForClient>) | null = null;
let setAuthTokens: ((accessToken: string, refreshToken: string, expiresIn: number) => Promise<void>) | null = null;
let clearAuth: (() => Promise<void>) | null = null;

interface AuthStateForClient {
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: number | null;
}

interface ApiClientConfig {
  getAuthState: () => Promise<AuthStateForClient>;
  setAuthTokens: (accessToken: string, refreshToken: string, expiresIn: number) => Promise<void>;
  clearAuth: () => Promise<void>;
  baseUrl?: string;
  apiKey?: string;
}

/**
 * Initialize the API client with auth storage functions and optional configuration
 * This should be called once during app initialization
 */
const initializeApiClient = (config: ApiClientConfig): void => {
  getAuthState = config.getAuthState;
  setAuthTokens = config.setAuthTokens;
  clearAuth = config.clearAuth;

  if (config.baseUrl) {
    BASE_URL = config.baseUrl;
  }
  if (config.apiKey) {
    API_KEY = config.apiKey;
  }
};

interface RequestConfig extends RequestInit {
  /** Whether this request requires authentication (default: true) */
  requiresAuth?: boolean;
  /** Skip token refresh check (used internally for refresh endpoint) */
  skipRefresh?: boolean;
}

const isTokenExpired = (expiresAt: number | null): boolean => {
  if (!expiresAt) return true;
  // Consider expired if less than 5 minutes remaining
  return Date.now() >= expiresAt - 5 * 60 * 1000;
};

const doRefreshToken = async (refreshToken: string): Promise<TokenPair | null> => {
  try {
    const response = await fetch(`${BASE_URL}${API_PREFIX}/shared/user/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data: ApiResponse<TokenPair> = await response.json();
    return data.data;
  } catch {
    return null;
  }
};

const refreshTokenIfNeeded = async (): Promise<boolean> => {
  if (!getAuthState || !setAuthTokens || !clearAuth) {
    console.warn('[ApiClient] Auth storage not initialized');
    return false;
  }

  const state = await getAuthState();

  if (!state.refreshToken) {
    return false;
  }

  if (!isTokenExpired(state.tokenExpiresAt)) {
    return true;
  }

  // Prevent concurrent refresh requests using mutex pattern
  if (isRefreshing && refreshPromise) {
    const result = await refreshPromise;
    return result !== null;
  }

  isRefreshing = true;
  refreshPromise = doRefreshToken(state.refreshToken);

  try {
    const tokens = await refreshPromise;
    if (tokens) {
      await setAuthTokens(tokens.accessToken, tokens.refreshToken, tokens.expiresIn);
      return true;
    }
    // Refresh failed - clear auth state
    await clearAuth();
    return false;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
};

const getHeaders = async (requiresAuth: boolean): Promise<HeadersInit> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add API key for all requests
  if (API_KEY) {
    headers['x-api-key'] = API_KEY;
  }

  // Add Authorization header for authenticated requests
  if (requiresAuth && getAuthState) {
    const state = await getAuthState();
    if (state.accessToken) {
      headers['Authorization'] = `Bearer ${state.accessToken}`;
    }
  }

  return headers;
};

/**
 * Main request function for API calls
 */
const request = async <T>(endpoint: string, config: RequestConfig = {}): Promise<T> => {
  const { requiresAuth = true, skipRefresh = false, ...fetchConfig } = config;

  // Token refresh for authenticated requests
  if (requiresAuth && !skipRefresh) {
    const isValid = await refreshTokenIfNeeded();
    if (!isValid && getAuthState) {
      const state = await getAuthState();
      // Only throw if we actually need auth and don't have a valid token
      if (!state.accessToken) {
        throw new ApiClientError('Authentication required', 401);
      }
    }
  }

  const headers = await getHeaders(requiresAuth);
  const url = `${BASE_URL}${API_PREFIX}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...fetchConfig,
      headers: {
        ...headers,
        ...fetchConfig.headers,
      },
    });

    // Handle non-OK responses
    if (!response.ok) {
      let errorData: ApiErrorResponse | undefined;
      try {
        errorData = await response.json();
      } catch {
        // Response body is not JSON
      }

      throw new ApiClientError(
        errorData?.message || `Request failed with status ${response.status}`,
        response.status,
        errorData,
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  } catch (error) {
    // Re-throw ApiClientError as-is
    if (error instanceof ApiClientError) {
      throw error;
    }

    // Network errors or other fetch failures
    throw new ApiClientError(error instanceof Error ? error.message : 'Network request failed', 0);
  }
};

export const apiClient = {
  /**
   * GET request
   */
  get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return request<T>(endpoint, { ...config, method: 'GET' });
  },

  /**
   * POST request
   */
  post<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * PUT request
   */
  put<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * PATCH request
   */
  patch<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * DELETE request
   */
  delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return request<T>(endpoint, { ...config, method: 'DELETE' });
  },
};

export type { ApiClientConfig };
export { initializeApiClient };
