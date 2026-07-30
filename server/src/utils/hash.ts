import argon2 from 'argon2';

// ──────────────────────────────────────────────
// Password Hashing — Argon2id (OWASP recommended)
// ──────────────────────────────────────────────

const ARGON2_OPTIONS: argon2.Options = {
  type: argon2.argon2id,
  memoryCost: 65_536,  // 64 MB
  timeCost: 3,
  parallelism: 4,
};

/**
 * Hash a plaintext password using Argon2id.
 */
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, ARGON2_OPTIONS);
}

/**
 * Verify a plaintext password against an Argon2id hash.
 */
export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  return argon2.verify(hash, password);
}
