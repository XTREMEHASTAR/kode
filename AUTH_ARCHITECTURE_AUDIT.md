# KONTAGI Authentication & Security Audit

## Overview
This document audits the current state of authentication, session management, route protection, and user data isolation across the KONTAGI web application and Express backend (`server.js`).

---

## 1. Audit Breakdown

| Component | Current Implementation | Status / Gaps Identified |
| :--- | :--- | :--- |
| **Auth Provider** | `@supabase/supabase-js` (in `package.json` & `server.js`). | Configured for Supabase, but UI auth currently uses simulated `localStorage` state (`kontagi_auth = true`). |
| **Login Page** | `src/pages/Login.tsx` | UI is fully designed in approved KONTAGI Blue theme, but submit handler only sets `localStorage` items. |
| **Signup Page** | `src/pages/Signup.tsx` | UI exists with name, email, password fields, but does not execute real backend account creation. |
| **Forgot Password** | `src/pages/ForgotPassword.tsx` | UI exists, but simulates email dispatch with `setTimeout`. |
| **Reset Password** | `src/pages/ResetPassword.tsx` | UI exists, but simulates password update with `setTimeout`. |
| **Email Verification**| `src/pages/VerifyEmail.tsx` | UI exists, but validates arbitrary simulated code. |
| **Frontend Auth State**| Ad-hoc `localStorage` values (`kontagi_auth`, `kontagi_user_email`). | No centralized `AuthContext` or `useAuth()` hook. Session restoration during loading is unhandled. |
| **Protected Routes** | `AppShell.tsx` checks auth for workspace routes, but Free Tier routes (`/script-intelligence`, `/script-library`, `/script-intelligence/:analysisId/results`) are UNPROTECTED. | Unauthenticated users can access script intelligence, results, and library directly via URL. |
| **User Data Isolation**| Scripts in `freeTierService.ts` stored in `localStorage` without a `userId` field. | Any user on the machine sees all stored scripts. No per-user isolation exists. |
| **Backend Verification**| Express routes in `server.js` have zero authentication middleware. | `/api/ai/hook/improve` and `/api/ai/script/improve` accept requests without user token/session verification. |
| **Data Migration** | Historical local scripts lack an owner `userId`. | Requires tagging legacy local scripts with `legacyLocal: true` or attaching to newly authenticated user explicitly. |

---

## 2. Target Phase 1 Architecture

To achieve **Session Safety, Production Authentication, and Per-User Data Isolation**:

1. **Canonical Auth System**:
   - Create a unified `authService.ts` and `AuthContext.tsx` providing `useAuth()` (`user`, `userId`, `email`, `displayName`, `isAuthenticated`, `isLoading`, `signIn`, `signUp`, `signOut`, `resetPassword`).
   - Support real Supabase Auth when configured via `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), with a deterministic local auth service when running in standalone mode.

2. **Frontend Protection & Session Restoration**:
   - Protect all product routes (`/script-intelligence`, `/script-library`, `/script-intelligence/:analysisId/results`, `/script-intelligence/:analysisId/review`, `/settings`, `/dashboard`, etc.) using a `<ProtectedRoute>` component.
   - Show an authentication loading spinner during session restoration to prevent flash redirects.

3. **Per-User Data Isolation**:
   - Add `userId` to `FreeTierScript` interface in `src/types/freeTier.ts`.
   - Update `freeTierService.ts` so all CRUD operations (fetch, create, update, delete, favorite, search) filter strictly by `userId`.
   - Block cross-user URL access (User B cannot view User A's `analysisId`).

4. **Backend Route Authorization**:
   - Implement authorization headers/tokens (`Authorization: Bearer <token>`) or session identity for AI endpoints (`/api/ai/hook/improve`, `/api/ai/script/improve`).
   - Validate ownership server-side.

5. **Legacy Data Handling**:
   - Flag unowned local scripts as `legacyLocal: true` so they don't leak between accounts on shared machines.

---

## 3. Mandatory Multi-Account Verification Criteria
- **User A** creates Script A -> **User B** logs in -> User B cannot see Script A in library or via direct `/results` URL.
- **TypeScript & Build**: `npx tsc --noEmit` must return 0 errors.
