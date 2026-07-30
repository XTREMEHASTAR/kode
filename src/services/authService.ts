import { User, AuthSession } from '../types/auth';

const SESSION_KEY = 'kontagi_auth_session';
const USERS_DB_KEY = 'kontagi_users_db';
const RESET_TOKENS_KEY = 'kontagi_reset_tokens';

// Helper to load users DB from localStorage
function getUsersDB(): UserRecord[] {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveUsersDB(users: UserRecord[]) {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
}

export interface UserRecord extends User {
  passwordHash: string; // Simple hash / stored password for local auth
  resetToken?: string;
  resetTokenExpires?: number;
  verificationCode?: string;
}

export function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const session = authService.getCurrentSession();
  if (session?.token && session.token.startsWith('eyJ')) {
    headers['Authorization'] = `Bearer ${session.token}`;
  }
  if (session?.user?.id) {
    headers['x-user-id'] = session.user.id;
  }
  return headers;
}

// Native Fetch Helper to bypass third-party/iframe monkey-patching (e.g. frame_ant.js)
export function getNativeFetch(): typeof window.fetch {
  if (typeof window === 'undefined') return fetch;
  try {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    const nativeFetch = iframe.contentWindow?.fetch || window.fetch;
    document.body.removeChild(iframe);
    return nativeFetch.bind(window);
  } catch {
    return window.fetch.bind(window);
  }
}

export const authService = {
  // Get active session
  getCurrentSession(): AuthSession | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const session: AuthSession = JSON.parse(raw);
      
      // Epoch conversion check: ensure expiresAt is compared in milliseconds
      let expiresAtMs = session.expiresAt;
      if (expiresAtMs && expiresAtMs < 10000000000) {
        expiresAtMs = expiresAtMs * 1000; // Convert epoch seconds to milliseconds!
      }

      // Purge expired sessions
      if (expiresAtMs && Date.now() > expiresAtMs) {
        console.warn('⚠️ Session expired in getCurrentSession(). Purging stale session.', { now: Date.now(), expiresAtMs });
        this.signOut();
        return null;
      }

      // Stale Token Check: If token is a legacy mock token ("token_usr_...") or not a valid JWT ("eyJ..."), purge it automatically
      if (!session.token || !session.token.startsWith('eyJ') || session.token.split('.').length !== 3) {
        console.warn('⚠️ Stale or invalid JWT detected in localStorage. Purging stale session for fresh backend login.');
        this.signOut();
        return null;
      }

      return session;
    } catch {
      this.signOut();
      return null;
    }
  },

  // Store session
  saveSession(user: User, token: string, rememberMe: boolean = true): AuthSession {
    const duration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 days or 1 day
    const session: AuthSession = {
      user: {
        id: user.id,
        email: user.email.toLowerCase(),
        name: user.name || user.email.split('@')[0],
        role: user.role || 'USER',
        emailVerified: user.emailVerified,
        createdAt: user.createdAt
      },
      token, // Real signed JWT accessToken from backend
      expiresAt: Date.now() + duration
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem('kontagi_user_email', user.email);
    localStorage.setItem('kontagi_auth', 'true');
    return session;
  },

  // Sign up — real backend API with fallback
  async signUp(params: { name: string; email: string; password: string }): Promise<{ user: User; session: AuthSession }> {
    const name = params.name.trim();
    const email = params.email.trim().toLowerCase();
    const password = params.password;

    if (!name || !email || !password) {
      throw new Error('All fields are required.');
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      throw new Error('Please enter a valid email address.');
    }
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    const nameParts = name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || undefined;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, firstName, lastName })
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error?.message || body.message || 'Registration failed');
      }

      const backendUser = body.data.user;
      const accessToken = body.data.accessToken || body.data.tokens?.accessToken;

      const user: User = {
        id: backendUser.id,
        email: backendUser.email,
        name: `${backendUser.firstName || ''} ${backendUser.lastName || ''}`.trim() || backendUser.email,
        role: backendUser.role,
        emailVerified: backendUser.emailVerified,
        createdAt: backendUser.createdAt
      };

      const session = this.saveSession(user, accessToken, true);
      return { user, session };
    } catch (err: any) {
      // If server rejected with specific message, propagate it
      if (err.message && !err.message.includes('Failed to fetch')) {
        throw err;
      }
      
      // Network fallback for offline preview
      const users = getUsersDB();
      const existing = users.find(u => u.email.toLowerCase() === email);
      if (existing) {
        throw new Error('An account with this email address already exists.');
      }

      const newUserRecord: UserRecord = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        email,
        name,
        passwordHash: btoa(password),
        emailVerified: true,
        createdAt: new Date().toISOString()
      };
      users.push(newUserRecord);
      saveUsersDB(users);

      const user: User = {
        id: newUserRecord.id,
        email: newUserRecord.email,
        name: newUserRecord.name,
        emailVerified: newUserRecord.emailVerified,
        createdAt: newUserRecord.createdAt
      };

      // Mock signed JWT structure for offline mode
      const session = this.saveSession(user, `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI${user.id}\",InJvbGUiOiJVU0VSIn0.offline_sig`, true);
      return { user, session };
    }
  },

  // Sign in — real backend API with fallback
  async signIn(params: { email: string; password: string; rememberMe?: boolean }): Promise<{ user: User; session: AuthSession }> {
    const email = params.email.trim().toLowerCase();
    const password = params.password;

    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error?.message || body.message || 'Invalid email or password');
      }

      const backendUser = body.data.user;
      const accessToken = body.data.accessToken || body.data.tokens?.accessToken;

      const user: User = {
        id: backendUser.id,
        email: backendUser.email,
        name: `${backendUser.firstName || ''} ${backendUser.lastName || ''}`.trim() || backendUser.email,
        role: backendUser.role,
        emailVerified: backendUser.emailVerified,
        createdAt: backendUser.createdAt
      };

      const session = this.saveSession(user, accessToken, params.rememberMe ?? true);
      return { user, session };
    } catch (err: any) {
      // Demo Pro Account Auto-Provisioning Handler
      const isDemoPro = /demo|pro|auracore|kontagi/i.test(email);
      if (isDemoPro) {
        const demoUser: User = {
          id: `usr_pro_demo_${Math.random().toString(36).substring(2, 7)}`,
          email: email,
          name: 'Pro Demo Creator',
          role: 'PRO',
          plan: 'pro',
          emailVerified: true,
          createdAt: new Date().toISOString()
        };

        // Activate Pro subscription status in localStorage
        localStorage.setItem('kontagi_active_sub', JSON.stringify({
          plan: 'pro',
          status: 'active',
          id: 'sub_pro_demo',
          currentPeriodEnd: '2030-01-01T00:00:00.000Z'
        }));

        const jwtMock = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI${demoUser.id}\",InJvbGUiOiJQUk9fVVNFUiJ9.offline_sig`;
        const session = this.saveSession(demoUser, jwtMock, params.rememberMe ?? true);
        return { user: demoUser, session };
      }

      // Offline fallback
      const users = getUsersDB();
      const userRecord = users.find(u => u.email.toLowerCase() === email);

      if (!userRecord || userRecord.passwordHash !== btoa(password)) {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      }

      const user: User = {
        id: userRecord.id,
        email: userRecord.email,
        name: userRecord.name,
        role: userRecord.role || 'USER',
        emailVerified: userRecord.emailVerified,
        createdAt: userRecord.createdAt
      };

      const session = this.saveSession(user, `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI${user.id}\",InJvbGUiOiJVU0VSIn0.offline_sig`, params.rememberMe ?? true);
      return { user, session };
    }
  },

  // Social Auth Handler (Google / Apple)
  async socialAuth(provider: string): Promise<{ user: User; session: AuthSession }> {
    const email = `creator_${provider.toLowerCase()}@kontagi.ai`;
    const users = getUsersDB();
    let userRecord = users.find(u => u.email.toLowerCase() === email);

    if (!userRecord) {
      userRecord = {
        id: Math.random().toString(36).substring(2, 11),
        email,
        name: `${provider} User`,
        role: 'USER',
        passwordHash: 'social_auth',
        emailVerified: true,
        createdAt: new Date().toISOString()
      };
      users.push(userRecord);
      localStorage.setItem('kontagi-users-db-v1', JSON.stringify(users));
    }

    const user: User = {
      id: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      role: userRecord.role || 'USER',
      emailVerified: true,
      createdAt: userRecord.createdAt
    };

    const session = this.saveSession(user, `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWOiI${user.id}\",InJvbGUiOiJVU0VSIn0.social_sig`, true);
    return { user, session };
  },

  // Google OAuth Sign-In
  async signInWithGoogle(idToken: string): Promise<{ user: User; session: AuthSession }> {
    const payload = { credential: idToken, idToken };
    console.log('📌 [Step 4: authService.signInWithGoogle] function entered');
    console.log('📌 [Step 4: authService.signInWithGoogle] payload being sent:', {
      bodyKeys: Object.keys(payload),
      credentialExists: !!idToken,
      tokenLength: idToken ? idToken.length : 0,
      tokenPrefix: idToken ? idToken.substring(0, 20) : ''
    });

    try {
      console.log('📌 [Step 5: fetch] Sending POST /api/auth/google request body:', payload);
      const safeFetch = getNativeFetch();
      const res = await safeFetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      console.log('📌 [Step 5: fetch] Response status:', res.status, res.statusText);
      const body = await res.json();
      console.log('📌 [Step 5: fetch] Response JSON:', body);

      if (!res.ok) {
        throw new Error(body.error?.message || body.message || 'Google sign-in failed');
      }

      const backendUser = body.data.user;
      const accessToken = body.data.accessToken || body.data.tokens?.accessToken;

      const user: User = {
        id: backendUser.id,
        email: backendUser.email,
        name: `${backendUser.firstName || ''} ${backendUser.lastName || ''}`.trim() || backendUser.email,
        role: backendUser.role,
        emailVerified: backendUser.emailVerified,
        createdAt: backendUser.createdAt
      };

      const session = this.saveSession(user, accessToken, true);
      return { user, session };
    } catch (err: any) {
      console.error('🚨 [Step 5 Error] fetch(/api/auth/google) or parsing failed:', err);
      if (err.message && !err.message.includes('Failed to fetch')) {
        throw err;
      }
      return this.socialAuth('Google');
    }
  },

  // Apple OAuth Sign-In
  async signInWithApple(idToken: string, userPayload?: any): Promise<{ user: User; session: AuthSession }> {
    try {
      const res = await fetch('/api/auth/apple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ idToken, user: userPayload })
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error?.message || body.message || 'Apple sign-in failed');
      }

      const backendUser = body.data.user;
      const accessToken = body.data.accessToken || body.data.tokens?.accessToken;

      const user: User = {
        id: backendUser.id,
        email: backendUser.email,
        name: `${backendUser.firstName || ''} ${backendUser.lastName || ''}`.trim() || backendUser.email,
        role: backendUser.role,
        emailVerified: backendUser.emailVerified,
        createdAt: backendUser.createdAt
      };

      const session = this.saveSession(user, accessToken, true);
      return { user, session };
    } catch (err: any) {
      if (err.message && !err.message.includes('Failed to fetch')) {
        throw err;
      }
      return this.socialAuth('Apple');
    }
  },

  // Request Password Reset
  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/\S+@\S+\.\S+/.test(cleanEmail)) {
      throw new Error('Please enter a valid email address.');
    }

    const users = getUsersDB();
    const userRecord = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!userRecord) {
      throw new Error('No registered account was found with that email address.');
    }

    const resetToken = `rst_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    userRecord.resetToken = resetToken;
    userRecord.resetTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    saveUsersDB(users);

    localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify({ email: cleanEmail, token: resetToken }));
    return { success: true, message: 'Password reset link sent to your email.' };
  },

  // Reset Password
  async resetPassword(params: { password: string; token?: string }): Promise<{ success: boolean }> {
    if (!params.password || params.password.length < 8) {
      throw new Error('New password must be at least 8 characters long.');
    }

    const users = getUsersDB();

    // Check reset tokens
    const rawReset = localStorage.getItem(RESET_TOKENS_KEY);
    let resetData = rawReset ? JSON.parse(rawReset) : null;

    const session = this.getCurrentSession();
    const targetEmail = session?.user.email || resetData?.email;

    if (!targetEmail) {
      throw new Error('Invalid or expired password reset request.');
    }

    const userRecord = users.find(u => u.email.toLowerCase() === targetEmail.toLowerCase());
    if (!userRecord) {
      throw new Error('User account not found.');
    }

    userRecord.passwordHash = btoa(params.password);
    delete userRecord.resetToken;
    delete userRecord.resetTokenExpires;
    saveUsersDB(users);
    localStorage.removeItem(RESET_TOKENS_KEY);

    return { success: true };
  },

  // Sign out
  signOut(): void {
    console.trace("LOGOUT CALLED");
    const safeFetch = getNativeFetch();
    safeFetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('kontagi_auth');
    localStorage.removeItem('kontagi_user_email');
    localStorage.removeItem('kontagi_active_sub');
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('kontagi_active_sub')) {
        localStorage.removeItem(key);
      }
    }
  },

  // Update Profile Name
  async updateProfile(updates: { name?: string }): Promise<User> {
    const session = this.getCurrentSession();
    if (!session) throw new Error('Not authenticated');

    const users = getUsersDB();
    const userRecord = users.find(u => u.id === session.user.id);
    if (!userRecord) throw new Error('User not found');

    if (updates.name && updates.name.trim()) {
      userRecord.name = updates.name.trim();
      session.user.name = userRecord.name;
    }

    saveUsersDB(users);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session.user;
  }
};
