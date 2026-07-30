import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthSession } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  userId: string | null;
  email: string | null;
  displayName: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<User>;
  signUp: (name: string, email: string, password: string) => Promise<User>;
  signOut: () => void;
  socialAuth: (provider: string) => Promise<User>;
  signInWithGoogle: (idToken: string) => Promise<User>;
  signInWithApple: (idToken: string, userPayload?: any) => Promise<User>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (password: string) => Promise<{ success: boolean }>;
  updateProfile: (updates: { name?: string }) => Promise<User>;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  userId: null,
  email: null,
  displayName: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => { throw new Error('AuthContext not ready'); },
  signUp: async () => { throw new Error('AuthContext not ready'); },
  signOut: () => {},
  socialAuth: async () => { throw new Error('AuthContext not ready'); },
  signInWithGoogle: async () => { throw new Error('AuthContext not ready'); },
  signInWithApple: async () => { throw new Error('AuthContext not ready'); },
  requestPasswordReset: async () => ({ success: false, message: '' }),
  resetPassword: async () => ({ success: false }),
  updateProfile: async () => { throw new Error('AuthContext not ready'); },
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state from stored session on mount
  useEffect(() => {
    try {
      const session = authService.getCurrentSession();
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to restore auth session:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string, rememberMe: boolean = true) => {
    setIsLoading(true);
    try {
      const res = await authService.signIn({ email, password, rememberMe });
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authService.signUp({ name, email, password });
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const socialAuth = useCallback(async (provider: string) => {
    setIsLoading(true);
    try {
      const res = await authService.socialAuth(provider);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInWithGoogle = useCallback(async (idToken: string) => {
    setIsLoading(true);
    try {
      const res = await authService.signInWithGoogle(idToken);
      setUser(res.user);
      console.log('📌 [Step 7: AuthContext] login success | authenticated = true | user:', res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInWithApple = useCallback(async (idToken: string, userPayload?: any) => {
    setIsLoading(true);
    try {
      const res = await authService.signInWithApple(idToken, userPayload);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    authService.signOut();
    setUser(null);
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    return await authService.requestPasswordReset(email);
  }, []);

  const resetPassword = useCallback(async (password: string) => {
    return await authService.resetPassword({ password });
  }, []);

  const updateProfile = useCallback(async (updates: { name?: string }) => {
    const updated = await authService.updateProfile(updates);
    setUser(updated);
    return updated;
  }, []);

  const userId = user ? user.id : null;
  const email = user ? user.email : null;
  const displayName = user ? user.name : null;
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        userId,
        email,
        displayName,
        isAuthenticated,
        isLoading,
        signIn,
        signUp,
        signOut,
        socialAuth,
        signInWithGoogle,
        signInWithApple,
        requestPasswordReset,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context || defaultAuthContext;
};
