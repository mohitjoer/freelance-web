# Multi-stage Dockerfile for Freelance Web Application

# Stage 1: Base image with Bun
FROM oven/bun:1.1.34-alpine AS base
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    curl \
    git \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Stage 2: Dependencies installation
FROM base AS deps
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile --production=false

# Stage 3: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js application
RUN bun run build

# Stage 4: Production image
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy server files
COPY --from=builder --chown=nextjs:nodejs /app/server ./server
COPY --from=builder --chown=nextjs:nodejs /app/src ./src

# Copy package.json for runtime dependencies
COPY --from=builder /app/package.json ./package.json

# Install only production dependencies
COPY --from=deps /app/node_modules ./node_modules

USER nextjs

# Expose ports
EXPOSE 3000 4000

# Environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV SOCKET_PORT=4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start both services using concurrently
CMD ["bun", "run", "dev"]
