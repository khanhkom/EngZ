import { apiClient } from '../client.js';
import type {
  ApiResponse,
  ApiUser,
  TokenPair,
  SignUpRequest,
  SignUpResponse,
  LoginRequest,
  LoginResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
} from '../types.js';

export const authApi = {
  /**
   * Register a new user
   * POST /public/user/sign-up
   */
  signUp: (data: SignUpRequest) =>
    apiClient.post<ApiResponse<SignUpResponse>>('/public/user/sign-up', data, { requiresAuth: false }),

  /**
   * Login with email and password
   * POST /public/user/login/credential
   */
  login: (data: LoginRequest) =>
    apiClient.post<ApiResponse<LoginResponse>>(
      '/public/user/login/credential',
      { ...data, from: 'website' },
      { requiresAuth: false },
    ),

  /**
   * Refresh access token using refresh token
   * POST /shared/user/refresh
   * Note: Authorization header should contain the refresh token
   */
  refresh: (refreshToken: string) =>
    apiClient.post<ApiResponse<TokenPair>>('/shared/user/refresh', undefined, {
      requiresAuth: false,
      skipRefresh: true,
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }),

  /**
   * Get current user profile
   * GET /shared/user/profile
   */
  getProfile: () => apiClient.get<ApiResponse<ApiUser>>('/shared/user/profile'),

  /**
   * Update user profile
   * PUT /shared/user/profile/update
   */
  updateProfile: (data: UpdateProfileRequest) =>
    apiClient.put<ApiResponse<UpdateProfileResponse>>('/shared/user/profile/update', data),

  /**
   * Change password
   * PATCH /shared/user/change-password
   */
  changePassword: (data: ChangePasswordRequest) =>
    apiClient.patch<ApiResponse<null>>('/shared/user/change-password', data),

  /**
   * Request password reset email
   * POST /public/user/password/forgot
   */
  forgotPassword: (data: ForgotPasswordRequest) =>
    apiClient.post<ApiResponse<null>>('/public/user/password/forgot', data, { requiresAuth: false }),
};
