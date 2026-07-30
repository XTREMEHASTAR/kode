export type UserRole = 'USER' | 'PRO' | 'ADMIN' | 'SUPER_ADMIN' | 'INTERNAL';

export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  plan?: 'free' | 'pro';
  role?: UserRole;
  createdAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: number;
}

export interface AuthState {
  user: User | null;
  userId: string | null;
  email: string | null;
  displayName: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
