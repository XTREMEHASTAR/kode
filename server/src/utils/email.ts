import { createTransport, type Transporter } from 'nodemailer';
import { config } from '../config/index.js';
import { logger } from './logger.js';

// ──────────────────────────────────────────────
// Email Service — SMTP Transport
// ──────────────────────────────────────────────

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_SECURE,
      auth:
        config.SMTP_USER && config.SMTP_PASS
          ? { user: config.SMTP_USER, pass: config.SMTP_PASS }
          : undefined,
    });
  }
  return transporter;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

async function sendEmail(options: EmailOptions): Promise<void> {
  const transport = getTransporter();

  try {
    await transport.sendMail({
      from: `"${config.SMTP_FROM_NAME}" <${config.SMTP_FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    logger.info({ to: options.to, subject: options.subject }, 'Email sent');
  } catch (error) {
    logger.error({ err: error, to: options.to }, 'Failed to send email');
    throw error;
  }
}

// ── Email Templates ─────────────────────────

export async function sendVerificationEmail(
  email: string,
  token: string,
  firstName?: string | null,
): Promise<void> {
  const verifyUrl = `${config.APP_URL}/verify-email?token=${token}`;
  const name = firstName || 'there';

  await sendEmail({
    to: email,
    subject: `Verify your ${config.APP_NAME} email`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #162A3B; margin-bottom: 24px;">Welcome to ${config.APP_NAME}</h2>
        <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">Hey ${name},</p>
        <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">Please verify your email address to get started.</p>
        <a href="${verifyUrl}" style="display: inline-block; background: #FF6B3D; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0;">Verify Email</a>
        <p style="color: #718096; font-size: 14px;">This link expires in ${config.VERIFY_TOKEN_EXPIRES_HOURS} hours.</p>
        <p style="color: #718096; font-size: 14px;">If you didn't create an account, ignore this email.</p>
      </div>
    `,
    text: `Welcome to ${config.APP_NAME}! Verify your email: ${verifyUrl}`,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  firstName?: string | null,
): Promise<void> {
  const resetUrl = `${config.APP_URL}/reset-password?token=${token}`;
  const name = firstName || 'there';

  await sendEmail({
    to: email,
    subject: `Reset your ${config.APP_NAME} password`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #162A3B; margin-bottom: 24px;">Password Reset</h2>
        <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">Hey ${name},</p>
        <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">We received a request to reset your password. Click below to choose a new one.</p>
        <a href="${resetUrl}" style="display: inline-block; background: #FF6B3D; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0;">Reset Password</a>
        <p style="color: #718096; font-size: 14px;">This link expires in ${config.RESET_TOKEN_EXPIRES_MINUTES} minutes.</p>
        <p style="color: #718096; font-size: 14px;">If you didn't request this, you can safely ignore this email. Your password will not change.</p>
      </div>
    `,
    text: `Reset your password: ${resetUrl}`,
  });
}

export async function sendAccountLockedEmail(
  email: string,
  lockDuration: number,
  firstName?: string | null,
): Promise<void> {
  const name = firstName || 'there';

  await sendEmail({
    to: email,
    subject: `${config.APP_NAME} — Account Temporarily Locked`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #162A3B; margin-bottom: 24px;">Account Locked</h2>
        <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">Hey ${name},</p>
        <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">Your account has been temporarily locked due to too many failed login attempts.</p>
        <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">It will unlock automatically in <strong>${lockDuration} minutes</strong>.</p>
        <p style="color: #718096; font-size: 14px;">If you didn't attempt to log in, please reset your password immediately.</p>
      </div>
    `,
    text: `Your account has been locked for ${lockDuration} minutes due to too many failed login attempts.`,
  });
}

export async function sendPasswordChangedEmail(
  email: string,
  firstName?: string | null,
): Promise<void> {
  const name = firstName || 'there';

  await sendEmail({
    to: email,
    subject: `${config.APP_NAME} — Password Changed`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #162A3B; margin-bottom: 24px;">Password Changed</h2>
        <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">Hey ${name},</p>
        <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">Your password was successfully changed.</p>
        <p style="color: #718096; font-size: 14px;">If you didn't make this change, please reset your password immediately or contact support.</p>
      </div>
    `,
    text: `Your password has been changed. If you didn't do this, reset your password immediately.`,
  });
}
