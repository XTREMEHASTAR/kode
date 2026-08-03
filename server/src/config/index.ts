import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// ──────────────────────────────────────────────
// Environment Schema — fail fast on invalid config
// ──────────────────────────────────────────────

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  API_PREFIX: z.string().default('/api'),

  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid connection string'),

  // Redis
  REDIS_URL: z.string().default('redis://localhost:6379'),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Cookies
  COOKIE_DOMAIN: z.string().optional(),
  COOKIE_SECURE: z.coerce.boolean().default(process.env.NODE_ENV === 'production'),
  COOKIE_SAME_SITE: z.enum(['strict', 'lax', 'none']).default('lax'),

  // CSRF
  CSRF_SECRET: z.string().min(32, 'CSRF_SECRET must be at least 32 characters'),

  // Billing & Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // OAuth Credentials
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  APPLE_CLIENT_ID: z.string().optional(),
  APPLE_TEAM_ID: z.string().optional(),
  APPLE_KEY_ID: z.string().optional(),
  APPLE_PRIVATE_KEY: z.string().optional(),
  APPLE_REDIRECT_URI: z.string().optional(),

  // Account Lockout
  MAX_LOGIN_ATTEMPTS: z.coerce.number().int().positive().default(5),
  LOCKOUT_DURATION_MINUTES: z.coerce.number().int().positive().default(15),

  // Email Verification & Password Reset Token Expiry
  VERIFY_TOKEN_EXPIRES_HOURS: z.coerce.number().int().positive().default(24),
  RESET_TOKEN_EXPIRES_MINUTES: z.coerce.number().int().positive().default(60),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),

  // AI Gateway
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default('gemini-2.0-flash'),
  OLLAMA_BASE_URL: z.string().default('http://127.0.0.1:11434'),
  OLLAMA_MODEL: z.string().default('qwen2.5:1.5b'),
  OLLAMA_FALLBACK_MODEL: z.string().default('llama3.2:1b'),
  AI_PROVIDER: z.enum(['auto', 'gemini', 'ollama']).default('auto'),
  AI_REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(180_000),
  AI_STREAM_TIMEOUT_MS: z.coerce.number().int().positive().default(300_000),
  AI_MAX_RETRIES: z.coerce.number().int().nonnegative().default(2),
  AI_QUEUE_CONCURRENCY: z.coerce.number().int().positive().default(3),

  // Sentry
  SENTRY_DSN: z.string().optional(),
  SENTRY_ENVIRONMENT: z.string().default('development'),

  // Uploads
  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_FILE_SIZE_MB: z.coerce.number().int().positive().default(500),

  // Email (SMTP)
  SMTP_HOST: z.string().default('localhost'),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: z.coerce.boolean().default(false),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM_NAME: z.string().default('Kontagi'),
  SMTP_FROM_EMAIL: z.string().email().default('noreply@kontagi.com'),

  // App
  APP_URL: z.string().default('http://localhost:5173'),
  APP_NAME: z.string().default('Kontagi'),

  // Feature Flags (Free Tier Lockdown Defaults)
  ENABLE_PRO: z.coerce.boolean().default(false),
  ENABLE_ADMIN: z.coerce.boolean().default(false),
  ENABLE_ENTERPRISE: z.coerce.boolean().default(false),
  ENABLE_CREATOR_TWIN: z.coerce.boolean().default(false),
  ENABLE_SIMULATION: z.coerce.boolean().default(false),
  ENABLE_BILLING: z.coerce.boolean().default(false),
  ENABLE_COUNTERFACTUAL: z.coerce.boolean().default(false),
  ENABLE_OPTIMIZATION: z.coerce.boolean().default(false),
  ENABLE_REPORTS: z.coerce.boolean().default(false),
  ENABLE_INTERNAL_DASHBOARD: z.coerce.boolean().default(false),
});

// ──────────────────────────────────────────────
// Parse & export typed config
// ──────────────────────────────────────────────

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment configuration:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = Object.freeze(parsed.data);

export type Config = z.infer<typeof envSchema>;

export const isDev = config.NODE_ENV === 'development';
export const isProd = config.NODE_ENV === 'production';
export const isTest = config.NODE_ENV === 'test';
