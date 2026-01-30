import { createStorage, StorageEnum } from '../base/index.js';
import type { BaseStorageType } from '../base/index.js';

interface User {
  id: string;
  name: string;
  email: string;
  photo?: {
    completedUrl: string;
  };
  status: 'active' | 'inactive' | 'blocked';
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: number | null;
  isAuthenticated: boolean;
  lastSyncAt: string | null;
}

type AuthStorageType = BaseStorageType<AuthState> & {
  /**
   * Store user and tokens after successful login
   */
  login: (user: User, accessToken: string, refreshToken: string, expiresIn: number) => Promise<void>;

  /**
   * Clear all auth state on logout
   */
  logout: () => Promise<void>;

  /**
   * Update tokens after refresh (keeps user data intact)
   */
  setTokens: (accessToken: string, refreshToken: string, expiresIn: number) => Promise<void>;

  /**
   * Update user profile data
   */
  updateUser: (updates: Partial<User>) => Promise<void>;

  /**
   * Set the last notebook sync timestamp
   */
  setLastSyncAt: (timestamp: string) => Promise<void>;

  /**
   * Get the last notebook sync timestamp
   */
  getLastSyncAt: () => Promise<string | null>;

  /**
   * Get auth state for API client (minimal interface)
   */
  getAuthStateForClient: () => Promise<{
    accessToken: string | null;
    refreshToken: string | null;
    tokenExpiresAt: number | null;
  }>;
};

const DEFAULT_AUTH_STATE: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  tokenExpiresAt: null,
  isAuthenticated: false,
  lastSyncAt: null,
};

const storage = createStorage<AuthState>('engz-auth', DEFAULT_AUTH_STATE, {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

export const authStorage: AuthStorageType = {
  ...storage,

  login: async (user: User, accessToken: string, refreshToken: string, expiresIn: number) => {
    const tokenExpiresAt = Date.now() + expiresIn * 1000;
    await storage.set({
      user,
      accessToken,
      refreshToken,
      tokenExpiresAt,
      isAuthenticated: true,
      lastSyncAt: null, // Reset sync timestamp on new login
    });
  },

  logout: async () => {
    await storage.set(DEFAULT_AUTH_STATE);
  },

  setTokens: async (accessToken: string, refreshToken: string, expiresIn: number) => {
    const tokenExpiresAt = Date.now() + expiresIn * 1000;
    await storage.set(state => ({
      ...state,
      accessToken,
      refreshToken,
      tokenExpiresAt,
    }));
  },

  updateUser: async (updates: Partial<User>) => {
    await storage.set(state => ({
      ...state,
      user: state.user ? { ...state.user, ...updates } : null,
    }));
  },

  setLastSyncAt: async (timestamp: string) => {
    await storage.set(state => ({
      ...state,
      lastSyncAt: timestamp,
    }));
  },

  getLastSyncAt: async () => {
    const state = await storage.get();
    return state.lastSyncAt;
  },

  getAuthStateForClient: async () => {
    const state = await storage.get();
    return {
      accessToken: state.accessToken,
      refreshToken: state.refreshToken,
      tokenExpiresAt: state.tokenExpiresAt,
    };
  },
};

export type { AuthStorageType, User, AuthState };
