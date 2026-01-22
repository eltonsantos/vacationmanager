// ================================
// Enums
// ================================

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  COLLABORATOR = 'COLLABORATOR',
}

export enum VacationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

// ================================
// Auth Types
// ================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  fullName: string;
  email: string;
  password: string;
  role: 'MANAGER' | 'COLLABORATOR';
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: string;
  email: string;
  role: Role;
}

export interface User {
  id: string;
  email: string;
  role: Role;
  employeeId?: string;
  createdAt: string;
  updatedAt: string;
}

// ================================
// Employee Types
// ================================

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  managerId: string | null;
  managerEmail: string | null;
  userId: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeRequest {
  fullName: string;
  email: string;
  managerId?: string;
  userId?: string;
}

// ================================
// Vacation Types
// ================================

export interface VacationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  status: VacationStatus;
  requestedAt: string;
  createdAt: string;
  decisionAt: string | null;
  decidedByUserId: string | null;
  decidedByEmail: string | null;
  reason: string | null;
  managerComment: string | null;
}

export interface VacationRequestDto {
  employeeId: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface VacationDecisionRequest {
  comment?: string;
}

// ================================
// Balance Types
// ================================

export interface VacationBalance {
  id: string;
  employeeId: string;
  employeeName: string;
  year: number;
  entitledDays: number;
  usedDays: number;
  remainingDays: number;
}

// ================================
// Audit Types
// ================================

export interface AuditLog {
  id: string;
  actorUserId: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

// ================================
// Pagination Types
// ================================

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// ================================
// Error Types
// ================================

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
}

export interface ValidationError extends ApiError {
  fieldErrors: Record<string, string>;
}
