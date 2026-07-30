import { z } from 'zod';

// ──────────────────────────────────────────────
// Auth Validation Schemas
// ──────────────────────────────────────────────

const passwordRule = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  );

const emailRule = z
  .string()
  .email('Invalid email address')
  .max(255)
  .transform((v) => v.toLowerCase().trim());

// ── Public Endpoints ─────────────────────────

export const registerSchema = z.object({
  email: emailRule,
  password: passwordRule,
  firstName: z.string().min(1).max(100).trim().optional(),
  lastName: z.string().min(1).max(100).trim().optional(),
});

export const loginSchema = z.object({
  email: emailRule,
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required').optional(),
});

export const forgotPasswordSchema = z.object({
  email: emailRule,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordRule,
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

// ── Protected Endpoints ──────────────────────

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordRule,
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required to delete account'),
  confirmation: z.literal('DELETE MY ACCOUNT', {
    errorMap: () => ({ message: 'You must type "DELETE MY ACCOUNT" to confirm' }),
  }),
});

export const revokeSessionSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1).optional(),
  allDevices: z.boolean().optional().default(false),
});

// ── Type Exports ─────────────────────────────

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
export type RevokeSessionInput = z.infer<typeof revokeSessionSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
