# Use the official Bun image
FROM oven/bun:1 AS base

# Accept build arguments
ARG MONGO_DB_CHAT
ARG MONGO_DB
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY

# Set working directory
WORKDIR /app

# Copy package files (make bun.lockb optional)
COPY package.json ./
COPY bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Set environment variables for build
ENV MONGO_DB_CHAT=$MONGO_DB_CHAT
ENV MONGO_DB=$MONGO_DB
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY

# Build the Next.js application
RUN bun run build

# Production stage
FROM oven/bun:1-slim AS production

# Set working directory
WORKDIR /app

# Create a non-root user first
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy package files (make bun.lockb optional)
COPY package.json ./
COPY bun.lock* ./

# Install only production dependencies
RUN bun install --production --frozen-lockfile

# Copy built application from build stage and set ownership
COPY --from=base --chown=nextjs:nodejs /app/.next ./.next
COPY --from=base --chown=nextjs:nodejs /app/public ./public
COPY --from=base --chown=nextjs:nodejs /app/server ./server
COPY --from=base --chown=nextjs:nodejs /app/src ./src
COPY --from=base --chown=nextjs:nodejs /app/next.config.ts ./
COPY --from=base --chown=nextjs:nodejs /app/tailwind.config.ts ./
COPY --from=base --chown=nextjs:nodejs /app/postcss.config.mjs ./
COPY --from=base --chown=nextjs:nodejs /app/components.json ./

# Switch to non-root user
USER nextjs

# Expose ports
EXPOSE 3000 4000

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun --version || exit 1

# Start both the Next.js app and Socket.IO server
CMD ["bun", "run", "start"]
