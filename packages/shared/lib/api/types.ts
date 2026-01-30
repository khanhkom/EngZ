// ============ Base Response Types ============

export interface ApiMetadata {
  language: string;
  timestamp: number;
  timezone: string;
  path: string;
  version: string;
  repoVersion: string;
  requestId: string;
  correlationId: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  metadata: ApiMetadata;
  data: T;
}

export interface PaginatedMetadata extends ApiMetadata {
  type: 'offset';
  page: number;
  perPage: number;
  totalPage: number;
  count: number;
  hasNext: boolean;
  hasPrevious: boolean;
  nextPage: number | null;
  orderBy: string;
  orderDirection: 'asc' | 'desc';
  availableSearch: string[];
  availableOrderBy: string[];
}

export interface PaginatedResponse<T> {
  statusCode: number;
  message: string;
  metadata: PaginatedMetadata;
  data: T[];
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  metadata: ApiMetadata;
}

// ============ Auth Types ============

export interface TokenPair {
  tokenType: 'Bearer';
  roleType: string;
  expiresIn: number;
  accessToken: string;
  refreshToken: string;
}

export interface UserPhoto {
  path: string;
  pathWithFilename: string;
  filename: string;
  completedUrl: string;
  baseUrl: string;
}

export interface UserRole {
  id: string;
  name: string;
  type: string;
}

export interface ApiUser {
  id: string;
  name: string;
  username: string;
  email: string;
  isVerified: boolean;
  verifiedAt: string | null;
  roleId: string;
  passwordExpired: string;
  passwordCreated: string;
  passwordAttempt: number;
  signUpAt: string;
  signUpFrom: string;
  signUpWith: 'credential' | 'google' | 'facebook';
  status: 'active' | 'inactive' | 'blocked';
  gender: string | null;
  countryId: string;
  lastLoginAt: string;
  lastIpAddress: string;
  lastLoginFrom: string;
  lastLoginWith: string;
  termPolicy: {
    cookies: boolean;
    privacy: boolean;
    marketing: boolean;
    termsOfService: boolean;
  };
  photo: UserPhoto | null;
  role: UserRole;
  country: {
    id: string;
    name: string;
    alpha2Code: string;
    alpha3Code: string;
    phoneCode: string[];
    continent: string;
    timezone: string;
    createdAt: string;
    createdBy: string | null;
    updatedAt: string;
    updatedBy: string | null;
  };
  twoFactor: {
    id: string;
    userId: string;
    enabled: boolean;
    requiredSetup: boolean;
    confirmedAt: string | null;
    attempt: number;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string | null;
  };
  mobileNumbers: string[];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  mobileNumber?: string;
}

export interface SignUpResponse {
  id: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  isTwoFactorEnable: boolean;
  tokens: TokenPair;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
}

export interface UpdateProfileResponse {
  id: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

// ============ Notebook Types ============

export type NotebookEntryStatus = 'new' | 'learning' | 'mastered';

export interface ApiNotebookEntry {
  id: string;
  word: string;
  translation: string;
  context: string | null;
  source: string | null;
  status: NotebookEntryStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateNotebookEntryRequest {
  word: string;
  translation: string;
  context?: string;
  source?: string;
  status?: NotebookEntryStatus;
}

export interface UpdateNotebookEntryRequest {
  translation?: string;
  context?: string;
  source?: string;
  status?: NotebookEntryStatus;
}

export interface BulkCreateNotebookRequest {
  entries: CreateNotebookEntryRequest[];
}

export interface BulkCreateNotebookResponse {
  created: number;
  skipped: number;
  entries: Array<{
    id: string;
    word: string;
    status: 'created' | 'skipped';
  }>;
}

export interface NotebookSyncParams {
  page?: number;
  perPage?: number;
  search?: string;
  orderBy?: 'createdAt' | 'updatedAt' | 'word';
  orderDirection?: 'asc' | 'desc';
  status?: NotebookEntryStatus;
  since?: string;
  includeDeleted?: boolean;
}

export interface DeleteNotebookEntryResponse {
  id: string;
  deletedAt: string;
}

export interface RestoreNotebookEntryResponse {
  id: string;
  word: string;
  deletedAt: null;
}

// ============ History Types ============

export type HistoryProvider = 'cambridge' | 'oxford' | 'google' | 'extension';

export interface ApiHistoryEntry {
  id: string;
  query: string;
  provider: HistoryProvider;
  createdAt: string;
}

export interface LogHistoryRequest {
  query: string;
  provider: HistoryProvider;
}

export interface ClearHistoryResponse {
  deletedCount: number;
}

export interface DeleteHistoryResponse {
  id: string;
}

export interface HistoryListParams {
  page?: number;
  perPage?: number;
  orderBy?: 'createdAt';
  orderDirection?: 'asc' | 'desc';
  provider?: HistoryProvider;
  startDate?: string;
  endDate?: string;
}
