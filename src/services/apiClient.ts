import { getAuthHeaders, authService } from './authService';

const isLocalFile = typeof window !== 'undefined' && window.location.protocol === 'file:';
const apiBase = isLocalFile ? '' : `${window.location.protocol}//${window.location.host}`;

export interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export const apiClient = {
  async request<T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${apiBase}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(!options.skipAuth ? getAuthHeaders() : {}),
      ...(options.headers as Record<string, string> || {}),
    };

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401 && !options.skipAuth) {
        console.warn(`[apiClient] 401 Unauthorized encountered on ${endpoint}. Clearing stale session.`);
        authService.signOut();
      }

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status} ${response.statusText}`;
        try {
          const errorBody = await response.json();
          errorMessage = errorBody.message || errorBody.error?.message || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error: any) {
      console.error(`[apiClient] Request error on ${endpoint}:`, error.message);
      throw error;
    }
  },

  async get<T = any>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  async post<T = any>(endpoint: string, body?: any, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  async patch<T = any>(endpoint: string, body?: any, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  async delete<T = any>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};
