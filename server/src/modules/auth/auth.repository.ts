import { getPrisma } from '../../config/database.js';
import type { User, RefreshToken, Prisma } from '@prisma/client';

// ──────────────────────────────────────────────
// Auth Repository — Data Access Layer
// ──────────────────────────────────────────────

export interface SessionInfo {
  id: string;
  deviceName: string | null;
  deviceType: string | null;
  browserName: string | null;
  osName: string | null;
  ipAddress: string | null;
  lastUsedAt: Date;
  createdAt: Date;
  current: boolean;
}

export class AuthRepository {
  private get db() {
    return getPrisma();
  }

  // ── User Queries ──────────────────────────────

  async findByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { id } });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { googleId } });
  }

  async findByAppleId(appleId: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { appleId } });
  }

  async linkGoogleAccount(userId: string, googleId: string, avatar?: string): Promise<User> {
    return this.db.user.update({
      where: { id: userId },
      data: {
        googleId,
        provider: 'GOOGLE',
        ...(avatar ? { avatar } : {}),
        emailVerified: true,
      },
    });
  }

  async linkAppleAccount(userId: string, appleId: string): Promise<User> {
    return this.db.user.update({
      where: { id: userId },
      data: {
        appleId,
        provider: 'APPLE',
        emailVerified: true,
      },
    });
  }

  async createOAuthUser(data: {
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    provider: 'GOOGLE' | 'APPLE';
    googleId?: string;
    appleId?: string;
  }): Promise<User> {
    return this.db.user.create({
      data: {
        email: data.email,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        avatar: data.avatar || null,
        provider: data.provider,
        googleId: data.googleId || null,
        appleId: data.appleId || null,
        emailVerified: true,
      },
    });
  }

  async create(data: {
    email: string;
    passwordHash: string;
    firstName?: string;
    lastName?: string;
    verifyToken?: string;
  }): Promise<User> {
    return this.db.user.create({ data });
  }

  async updatePassword(userId: string, passwordHash: string): Promise<User> {
    return this.db.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        resetToken: null,
        resetExpires: null,
      },
    });
  }

  // ── Account Lockout ───────────────────────────

  async incrementLoginAttempts(userId: string): Promise<User> {
    return this.db.user.update({
      where: { id: userId },
      data: { loginAttempts: { increment: 1 } },
    });
  }

  async lockAccount(userId: string, lockedUntil: Date): Promise<User> {
    return this.db.user.update({
      where: { id: userId },
      data: { lockedUntil, loginAttempts: 0 },
    });
  }

  async resetLoginAttempts(userId: string, ip?: string): Promise<User> {
    return this.db.user.update({
      where: { id: userId },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: ip || null,
      },
    });
  }

  // ── Password Reset Tokens ─────────────────────

  async setResetToken(
    userId: string,
    resetToken: string,
    resetExpires: Date,
  ): Promise<User> {
    return this.db.user.update({
      where: { id: userId },
      data: { resetToken, resetExpires },
    });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.db.user.findFirst({
      where: {
        resetToken: token,
        resetExpires: { gte: new Date() },
      },
    });
  }

  // ── Email Verification ────────────────────────

  async markEmailVerified(userId: string): Promise<User> {
    return this.db.user.update({
      where: { id: userId },
      data: {
        emailVerified: true,
        verifyToken: null,
      },
    });
  }

  async findByVerifyToken(token: string): Promise<User | null> {
    return this.db.user.findFirst({
      where: { verifyToken: token },
    });
  }

  async setVerifyToken(userId: string, verifyToken: string): Promise<User> {
    return this.db.user.update({
      where: { id: userId },
      data: { verifyToken },
    });
  }

  // ── Delete Account ────────────────────────────

  async deleteUser(userId: string): Promise<void> {
    await this.db.user.delete({ where: { id: userId } });
  }

  // ── Refresh Token / Session Management ────────

  async createRefreshSession(data: {
    token: string;
    userId: string;
    expiresAt: Date;
    deviceName?: string;
    deviceType?: string;
    browserName?: string;
    osName?: string;
    ipAddress?: string;
  }): Promise<RefreshToken> {
    return this.db.refreshToken.create({ data });
  }

  async findRefreshToken(token: string): Promise<(RefreshToken & { user: User }) | null> {
    return this.db.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async revokeRefreshToken(tokenId: string): Promise<void> {
    await this.db.refreshToken.update({
      where: { id: tokenId },
      data: { revoked: true, revokedAt: new Date() },
    });
  }

  async revokeRefreshTokenByValue(token: string): Promise<void> {
    await this.db.refreshToken.updateMany({
      where: { token },
      data: { revoked: true, revokedAt: new Date() },
    });
  }

  async revokeAllUserSessions(userId: string): Promise<Prisma.BatchPayload> {
    return this.db.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true, revokedAt: new Date() },
    });
  }

  async revokeSessionById(sessionId: string, userId: string): Promise<void> {
    await this.db.refreshToken.updateMany({
      where: { id: sessionId, userId, revoked: false },
      data: { revoked: true, revokedAt: new Date() },
    });
  }

  async touchSession(tokenId: string): Promise<void> {
    await this.db.refreshToken.update({
      where: { id: tokenId },
      data: { lastUsedAt: new Date() },
    });
  }

  async getActiveSessions(
    userId: string,
    currentTokenId?: string,
  ): Promise<SessionInfo[]> {
    const sessions = await this.db.refreshToken.findMany({
      where: {
        userId,
        revoked: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { lastUsedAt: 'desc' },
      select: {
        id: true,
        deviceName: true,
        deviceType: true,
        browserName: true,
        osName: true,
        ipAddress: true,
        lastUsedAt: true,
        createdAt: true,
      },
    });

    return sessions.map((s) => ({
      ...s,
      current: s.id === currentTokenId,
    }));
  }

  async countActiveSessions(userId: string): Promise<number> {
    return this.db.refreshToken.count({
      where: {
        userId,
        revoked: false,
        expiresAt: { gte: new Date() },
      },
    });
  }

  async deleteExpiredTokens(): Promise<Prisma.BatchPayload> {
    return this.db.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}
