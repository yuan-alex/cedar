# =============================================================================
# Base stage - shared dependencies and setup
# =============================================================================
FROM oven/bun:1-alpine AS base

# Install system dependencies required for Prisma and native modules
RUN apk add --no-cache \
  ca-certificates \
  openssl \
  && rm -rf /var/cache/apk/*

WORKDIR /app

# Copy package files for dependency resolution
COPY package.json bun.lock ./

# =============================================================================
# Dependencies stage - install all dependencies
# =============================================================================
FROM base AS deps

# Install all dependencies (including devDependencies for Prisma generation)
RUN bun install --frozen-lockfile

# =============================================================================
# Builder stage - generate Prisma client and build application
# =============================================================================
FROM deps AS builder

# Copy source code
COPY . .

RUN bunx prisma generate

# Build the frontend application
RUN bun run build

# =============================================================================
# Production dependencies stage - install only production dependencies
# =============================================================================
FROM base AS prod-deps

# Install only production dependencies
RUN bun install --frozen-lockfile --production

# =============================================================================
# Runtime stage - final optimized image
# =============================================================================
FROM oven/bun:1-alpine AS runtime

# Use existing bun user from base image
RUN addgroup -g 1001 -S nodejs || true

# Install minimal runtime dependencies
RUN apk add --no-cache \
  ca-certificates \
  openssl \
  && rm -rf /var/cache/apk/*

WORKDIR /app

# Copy production dependencies
COPY --from=prod-deps --chown=bun:nodejs /app/node_modules ./node_modules

# Copy only the files needed at runtime
COPY --from=builder --chown=bun:nodejs /app/server ./server
COPY --from=builder --chown=bun:nodejs /app/src ./src
COPY --from=builder --chown=bun:nodejs /app/dist ./dist
COPY --from=builder --chown=bun:nodejs /app/prisma ./prisma
COPY --from=builder --chown=bun:nodejs /app/package.json ./
COPY --from=builder --chown=bun:nodejs /app/bun.lock ./
COPY --from=builder --chown=bun:nodejs /app/tsconfig.json ./
COPY --from=builder --chown=bun:nodejs /app/bunfig.toml ./

# Switch to non-root user
USER bun

# Expose the port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun --version || exit 1

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["bun", "run", "./server/bun.ts"]
