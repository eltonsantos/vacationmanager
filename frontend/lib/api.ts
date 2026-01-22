import {
  AuthResponse,
  LoginRequest,
  SignUpRequest,
  User,
  Employee,
  EmployeeRequest,
  VacationRequest,
  VacationRequestDto,
  VacationDecisionRequest,
  VacationBalance,
  AuditLog,
  PageResponse,
  ApiError,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

// ================================
// Token Management
// ================================

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }
};

export const getAuthToken = (): string | null => {
  if (authToken) return authToken;
  if (typeof window !== 'undefined') {
    authToken = localStorage.getItem('auth_token');
  }
  return authToken;
};

export const clearAuthToken = () => {
  authToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

// ================================
// Base Fetch Wrapper
// ================================

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;

  let url = `${API_BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({
      timestamp: new Date().toISOString(),
      status: response.status,
      error: response.statusText,
      message: 'An unexpected error occurred',
    }));

    if (response.status === 401) {
      clearAuthToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    throw errorData;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// ================================
// Auth API
// ================================

export const authApi = {
  login: (data: LoginRequest) =>
    apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  signUp: (data: SignUpRequest) =>
    apiFetch<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: () => apiFetch<User>('/auth/me'),

  getProfile: () => apiFetch<{ id: string; email: string; role: string; fullName: string }>('/auth/profile'),

  updateProfile: (data: { fullName: string }) =>
    apiFetch<{ id: string; email: string; role: string; fullName: string }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiFetch<void>('/auth/me/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ================================
// Employees API
// ================================

export const employeesApi = {
  list: (page = 0, size = 10) =>
    apiFetch<PageResponse<Employee>>('/employees', {
      params: { page, size },
    }),

  get: (id: string) => apiFetch<Employee>(`/employees/${id}`),

  create: (data: EmployeeRequest) =>
    apiFetch<Employee>('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: EmployeeRequest) =>
    apiFetch<Employee>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/employees/${id}`, {
      method: 'DELETE',
    }),
};

// ================================
// Vacations API
// ================================

export const vacationsApi = {
  list: (page = 0, size = 10) =>
    apiFetch<PageResponse<VacationRequest>>('/vacations', {
      params: { page, size },
    }),

  get: (id: string) => apiFetch<VacationRequest>(`/vacations/${id}`),

  getForCalendar: (startDate: string, endDate: string) =>
    apiFetch<VacationRequest[]>('/vacations/calendar', {
      params: { startDate, endDate },
    }),

  create: (data: VacationRequestDto) =>
    apiFetch<VacationRequest>('/vacations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: VacationRequestDto) =>
    apiFetch<VacationRequest>(`/vacations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  cancel: (id: string) =>
    apiFetch<VacationRequest>(`/vacations/${id}/cancel`, {
      method: 'POST',
    }),

  approve: (id: string, data?: VacationDecisionRequest) =>
    apiFetch<VacationRequest>(`/vacations/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    }),

  reject: (id: string, data?: VacationDecisionRequest) =>
    apiFetch<VacationRequest>(`/vacations/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    }),
};

// ================================
// Balances API
// ================================

export const balancesApi = {
  list: (year?: number, page = 0, size = 20) =>
    apiFetch<PageResponse<VacationBalance>>('/balances', {
      params: { year, page, size },
    }),

  getByEmployee: (employeeId: string, year?: number) =>
    apiFetch<VacationBalance>(`/balances/employee/${employeeId}`, {
      params: { year },
    }),
};

// ================================
// Audit API
// ================================

export const auditApi = {
  list: (page = 0, size = 20) =>
    apiFetch<PageResponse<AuditLog>>('/audit-logs', {
      params: { page, size },
    }),

  listByEntityType: (entityType: string, page = 0, size = 20) =>
    apiFetch<PageResponse<AuditLog>>(`/audit-logs/entity/${entityType}`, {
      params: { page, size },
    }),
};

// ================================
// Users API (Admin only)
// ================================

export interface CreateUserRequest {
  email: string;
  password: string;
  role: 'ADMIN' | 'MANAGER' | 'COLLABORATOR';
  fullName: string;
  managerId?: string; // Required for COLLABORATOR role
}

export interface UpdateUserRequest {
  email: string;
  password?: string;
  role: 'ADMIN' | 'MANAGER' | 'COLLABORATOR';
}

export const usersApi = {
  list: (page = 0, size = 10) =>
    apiFetch<PageResponse<User>>('/users', {
      params: { page, size },
    }),

  listManagers: () => apiFetch<User[]>('/users/managers'),

  get: (id: string) => apiFetch<User>(`/users/${id}`),

  create: (data: CreateUserRequest) =>
    apiFetch<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateUserRequest) =>
    apiFetch<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/users/${id}`, {
      method: 'DELETE',
    }),
};
