# ──────────────────────────────────────────────
# Kontagi Backend — Multi-stage Production Docker Build
# ──────────────────────────────────────────────

# ── Stage 1: Dependencies ────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

# Install system dependencies for Argon2 native build
RUN apk add --no-cache python3 make g++ linux-headers

COPY package.json package-lock.json ./
RUN npm ci --include=dev

# ── Stage 2: Build ───────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Compile TypeScript
RUN npm run build

# Remove dev dependencies
RUN npm prune --omit=dev

# Re-generate Prisma client in production node_modules
RUN npx prisma generate

# ── Stage 3: Production ─────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

# Security: non-root user
RUN addgroup --system --gid 1001 kontagi && \
    adduser --system --uid 1001 kontagi

# Runtime dependencies for Argon2
RUN apk add --no-cache dumb-init

# Copy built artifacts
COPY --from=builder --chown=kontagi:kontagi /app/dist ./dist
COPY --from=builder --chown=kontagi:kontagi /app/node_modules ./node_modules
COPY --from=builder --chown=kontagi:kontagi /app/prisma ./prisma
COPY --from=builder --chown=kontagi:kontagi /app/package.json ./

# Create uploads directory
RUN mkdir -p /app/uploads && chown kontagi:kontagi /app/uploads

# Environment
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/healthz || exit 1

# Run as non-root
USER kontagi

EXPOSE 3000

# Use dumb-init to handle signals properly (PID 1 problem)
ENTRYPOINT ["dumb-init", "--"]

# Run migrations then start
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
