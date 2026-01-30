import { authApi, initializeApiClient, isApiError, getErrorMessage } from '../api/index.js';
import { authStorage } from '@extension/storage';
import { create } from 'zustand';
import type { ApiUser } from '../api/index.js';
import type { User } from '@extension/storage';

// Initialize API client with auth storage functions
initializeApiClient({
  getAuthState: authStorage.getAuthStateForClient,
  setAuthTokens: authStorage.setTokens,
  clearAuth: authStorage.logout,
});

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthStoreState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  init: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: { firstName?: string; lastName?: string }) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

/**
 * Convert API user to storage user format
 */
const apiUserToStorageUser = (apiUser: ApiUser): User => ({
  id: apiUser.id,
  name: apiUser.name,
  email: apiUser.email,
  photo: apiUser.photo ? { completedUrl: apiUser.photo.completedUrl } : undefined,
  status: apiUser.status,
});

export const useAuthStore = create<AuthStoreState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,

  init: async () => {
    set({ loading: true, error: null });
    try {
      const state = await authStorage.get();
      if (state.isAuthenticated && state.user) {
        set({
          user: state.user,
          isAuthenticated: true,
          loading: false,
        });
        // Optionally refresh profile in background to get latest data
        get().refreshProfile().catch(console.error);
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error('Failed to init auth:', error);
      set({ loading: false });
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true, error: null });
    try {
      // Call login API
      const response = await authApi.login({ email, password });
      const { accessToken, refreshToken, expiresIn } = response.data.tokens;

      // Store tokens first so API client can use them for subsequent requests
      await authStorage.setTokens(accessToken, refreshToken, expiresIn);

      // Fetch user profile (now with valid token)
      const profileResponse = await authApi.getProfile();
      const user = apiUserToStorageUser(profileResponse.data);

      // Complete login by storing user info
      await authStorage.login(user, accessToken, refreshToken, expiresIn);

      set({
        user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, loading: false });
      throw error;
    }
  },

  signUp: async ({ email, password, firstName, lastName }) => {
    set({ loading: true, error: null });
    try {
      // Register user
      await authApi.signUp({ email, password, firstName, lastName });

      // Auto-login after successful registration
      await get().login({ email, password });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, loading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true });
    await authStorage.logout();
    set({
      user: null,
      isAuthenticated: false,
      loading: false,
    });
  },

  refreshProfile: async () => {
    try {
      const response = await authApi.getProfile();
      const user = apiUserToStorageUser(response.data);
      await authStorage.updateUser(user);
      set({ user });
    } catch (error) {
      // If 401, token might be expired and couldn't refresh
      if (isApiError(error) && error.isUnauthorized) {
        await get().logout();
      }
    }
  },

  updateProfile: async data => {
    set({ loading: true, error: null });
    try {
      await authApi.updateProfile(data);
      // Refresh profile to get updated data
      await get().refreshProfile();
      set({ loading: false });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, loading: false });
      throw error;
    }
  },

  changePassword: async (oldPassword, newPassword) => {
    set({ loading: true, error: null });
    try {
      await authApi.changePassword({ oldPassword, newPassword });
      set({ loading: false });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, loading: false });
      throw error;
    }
  },

  forgotPassword: async email => {
    set({ loading: true, error: null });
    try {
      await authApi.forgotPassword({ email });
      set({ loading: false });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
