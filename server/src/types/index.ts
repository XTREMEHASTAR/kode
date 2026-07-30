// ──────────────────────────────────────────────
// Shared Types
// ──────────────────────────────────────────────

/** Standard paginated response envelope */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/** Standard API success response */
export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

/** Standard API error response */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

/** Sort direction */
export type SortOrder = 'asc' | 'desc';
