import type { Request, Response, NextFunction } from 'express';
import { AuthService, type DeviceInfo } from './auth.service.js';
import { generateCsrfToken, setCsrfCookie } from '../../middleware/csrf.js';
import { config, isProd } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { parseExpiryToMs } from '../../utils/jwt.js';
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
  ChangePasswordInput,
  DeleteAccountInput,
  RevokeSessionInput,
  LogoutInput,
} from './auth.validation.js';

// ──────────────────────────────────────────────
// Auth Controller — HTTP layer only
// ──────────────────────────────────────────────

const REFRESH_COOKIE_NAME = 'kontagi_refresh';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ── Register ──────────────────────────────────

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = req.body as RegisterInput;
      const device = this.extractDeviceInfo(req);

      const result = await this.authService.register(input, device);

      this.setRefreshCookie(res, result.tokens.refreshToken);
      this.setNewCsrfToken(res);

      res.status(201).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken,
          expiresIn: result.tokens.expiresIn,
        },
        message: 'Account created. Please verify your email.',
      });
    } catch (error) {
      next(error);
    }
  };

  // ── Login ─────────────────────────────────────

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = req.body as LoginInput;
      const device = this.extractDeviceInfo(req);

      const result = await this.authService.login(input, device);

      this.setRefreshCookie(res, result.tokens.refreshToken);
      this.setNewCsrfToken(res);

      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken,
          expiresIn: result.tokens.expiresIn,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // ── Refresh Tokens ────────────────────────────

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get refresh token from cookie first, then body fallback
      const refreshToken =
        req.cookies?.[REFRESH_COOKIE_NAME] ||
        req.body?.refreshToken;

      if (!refreshToken) {
        res.status(401).json({
          success: false,
          message: 'No refresh token provided',
        });
        return;
      }

      const device = this.extractDeviceInfo(req);
      const result = await this.authService.refreshTokens(refreshToken, device);

      this.setRefreshCookie(res, result.tokens.refreshToken);

      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken,
          expiresIn: result.tokens.expiresIn,
        },
      });
    } catch (error) {
      // Clear the cookie on refresh failure
      this.clearRefreshCookie(res);
      next(error);
    }
  };

  // ── Logout ────────────────────────────────────

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = req.body as LogoutInput;
      const refreshToken =
        req.cookies?.[REFRESH_COOKIE_NAME] ||
        input.refreshToken;

      await this.authService.logout(
        req.user!.userId,
        refreshToken,
        input.allDevices,
      );

      this.clearRefreshCookie(res);
      this.clearCsrfCookie(res);

      res.status(200).json({
        success: true,
        data: null,
        message: input.allDevices
          ? 'Logged out from all devices'
          : 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // ── Forgot Password ───────────────────────────

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body as ForgotPasswordInput;
      await this.authService.forgotPassword(email);

      // Always return success to prevent email enumeration
      res.status(200).json({
        success: true,
        data: null,
        message: 'If an account with that email exists, a reset link has been sent',
      });
    } catch (error) {
      next(error);
    }
  };

  // ── Reset Password ────────────────────────────

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = req.body as ResetPasswordInput;
      await this.authService.resetPassword(input.token, input.password);

      res.status(200).json({
        success: true,
        data: null,
        message: 'Password reset successfully. Please log in with your new password.',
      });
    } catch (error) {
      next(error);
    }
  };

  // ── Verify Email ──────────────────────────────

  verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.body as VerifyEmailInput;
      await this.authService.verifyEmail(token);

      res.status(200).json({
        success: true,
        data: null,
        message: 'Email verified successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // ── Resend Verification ───────────────────────

  resendVerification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.authService.resendVerificationEmail(req.user!.userId);

      res.status(200).json({
        success: true,
        data: null,
        message: 'Verification email sent',
      });
    } catch (error) {
      next(error);
    }
  };

  // ── Change Password ───────────────────────────

  changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = req.body as ChangePasswordInput;
      const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

      await this.authService.changePassword(
        req.user!.userId,
        input.currentPassword,
        input.newPassword,
        refreshToken,
      );

      res.status(200).json({
        success: true,
        data: null,
        message: 'Password changed. Other sessions have been revoked.',
      });
    } catch (error) {
      next(error);
    }
  };

  // ── Delete Account ────────────────────────────

  deleteAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = req.body as DeleteAccountInput;

      await this.authService.deleteAccount(req.user!.userId, input.password);

      this.clearRefreshCookie(res);
      this.clearCsrfCookie(res);

      res.status(200).json({
        success: true,
        data: null,
        message: 'Account deleted permanently',
      });
    } catch (error) {
      next(error);
    }
  };

  // ── Session Management ────────────────────────

  listSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
      let currentTokenId: string | undefined;

      if (refreshToken) {
        // We need the token ID from the session, not the token value
        // Look up the current session to find its ID
        const authRepo = new (await import('./auth.repository.js')).AuthRepository();
        const session = await authRepo.findRefreshToken(refreshToken);
        if (session && !session.revoked) {
          currentTokenId = session.id;
        }
      }

      const sessions = await this.authService.getActiveSessions(
        req.user!.userId,
        currentTokenId,
      );

      res.status(200).json({
        success: true,
        data: sessions,
      });
    } catch (error) {
      next(error);
    }
  };

  revokeSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { sessionId } = req.body as RevokeSessionInput;

      await this.authService.revokeSession(sessionId, req.user!.userId);

      res.status(200).json({
        success: true,
        data: null,
        message: 'Session revoked',
      });
    } catch (error) {
      next(error);
    }
  };

  // ── Get Current User ──────────────────────────

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.authService.getCurrentUser(req.user!.userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  // ── Cookie Helpers ────────────────────────────

  private setRefreshCookie(res: Response, token: string): void {
    const maxAge = parseExpiryToMs(config.JWT_REFRESH_EXPIRES_IN);

    res.cookie(REFRESH_COOKIE_NAME, token, {
      httpOnly: true,       // Not accessible via JS — XSS protection
      secure: isProd || config.COOKIE_SECURE,
      sameSite: config.COOKIE_SAME_SITE,
      domain: config.COOKIE_DOMAIN || undefined,
      path: '/api/auth',    // Only sent to auth endpoints
      maxAge,
    });
  }

  private clearRefreshCookie(res: Response): void {
    res.clearCookie(REFRESH_COOKIE_NAME, {
      httpOnly: true,
      secure: isProd || config.COOKIE_SECURE,
      sameSite: config.COOKIE_SAME_SITE,
      domain: config.COOKIE_DOMAIN || undefined,
      path: '/api/auth',
    });
  }

  private setNewCsrfToken(res: Response): void {
    const csrfToken = generateCsrfToken();
    setCsrfCookie(res, csrfToken);
  }

  private clearCsrfCookie(res: Response): void {
    res.clearCookie('csrf_token', {
      httpOnly: false,
      secure: isProd || config.COOKIE_SECURE,
      sameSite: config.COOKIE_SAME_SITE,
      domain: config.COOKIE_DOMAIN || undefined,
      path: '/',
    });
  }

  // ── Google Login ──────────────────────────────

  googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bodyKeys = Object.keys(req.body || {});
      const credential = req.body?.credential || req.body?.idToken || req.body?.token || req.body?.access_token;
      const credentialLength = typeof credential === 'string' ? credential.length : 0;

      logger.info({
        step: 'Step 4: Backend Request Body Received',
        bodyKeys,
        credentialExists: !!credential,
        credentialLength,
      }, 'POST /api/auth/google request body received');

      if (!credential) {
        logger.warn({
          step: 'Step 4 Error: Missing Credential',
          expectedProperty: 'credential',
          receivedKeys: bodyKeys,
        }, 'Google OAuth failed due to missing credential field in request body');

        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_CREDENTIAL',
            message: `Missing required Google credential property. Expected 'credential', received keys: [${bodyKeys.join(', ')}]`,
            expectedProperty: 'credential',
            receivedKeys: bodyKeys,
          },
        });
        return;
      }

      const device = this.extractDeviceInfo(req);
      const result = await this.authService.googleLogin(credential, device);

      this.setRefreshCookie(res, result.tokens.refreshToken);
      this.setNewCsrfToken(res);

      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken,
          expiresIn: result.tokens.expiresIn,
        },
        message: 'Signed in with Google successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  // ── Apple Login ───────────────────────────────

  appleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { idToken, user: userPayload } = req.body;
      const device = this.extractDeviceInfo(req);

      const result = await this.authService.appleLogin(idToken, userPayload, device);

      this.setRefreshCookie(res, result.tokens.refreshToken);
      this.setNewCsrfToken(res);

      res.json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken,
          expiresIn: result.tokens.expiresIn,
        },
        message: 'Signed in with Apple successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  // ── Device Detection ──────────────────────────

  private extractDeviceInfo(req: Request): DeviceInfo {
    const ua = req.headers['user-agent'] || '';
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      'unknown';

    return {
      deviceName: this.parseDeviceName(ua),
      deviceType: this.parseDeviceType(ua),
      browserName: this.parseBrowserName(ua),
      osName: this.parseOsName(ua),
      ipAddress: ip,
    };
  }

  private parseDeviceName(ua: string): string {
    if (/iPhone/i.test(ua)) return 'iPhone';
    if (/iPad/i.test(ua)) return 'iPad';
    if (/Macintosh/i.test(ua)) return 'Mac';
    if (/Windows/i.test(ua)) return 'Windows PC';
    if (/Android/i.test(ua)) return 'Android Device';
    if (/Linux/i.test(ua)) return 'Linux PC';
    return 'Unknown Device';
  }

  private parseDeviceType(ua: string): string {
    if (/Mobile|Android.*Mobile|iPhone/i.test(ua)) return 'mobile';
    if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua)) return 'tablet';
    return 'desktop';
  }

  private parseBrowserName(ua: string): string {
    if (/Edg\//i.test(ua)) return 'Edge';
    if (/OPR\//i.test(ua) || /Opera/i.test(ua)) return 'Opera';
    if (/Chrome\//i.test(ua) && !/Edg/i.test(ua)) return 'Chrome';
    if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) return 'Safari';
    if (/Firefox\//i.test(ua)) return 'Firefox';
    return 'Unknown Browser';
  }

  private parseOsName(ua: string): string {
    if (/Windows NT 10/i.test(ua)) return 'Windows 10/11';
    if (/Windows/i.test(ua)) return 'Windows';
    if (/Mac OS X/i.test(ua)) return 'macOS';
    if (/iPhone OS/i.test(ua)) return 'iOS';
    if (/Android/i.test(ua)) return 'Android';
    if (/Linux/i.test(ua)) return 'Linux';
    return 'Unknown OS';
  }
}
