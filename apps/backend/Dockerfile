# Use Bun official image
FROM oven/bun:1 as builder

WORKDIR /app

# Copy package files
COPY package.json ./
COPY bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Build application
RUN bun run build

# Production stage
FROM oven/bun:1-slim

WORKDIR /app

# Copy built files and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD bun run -e "await fetch('http://localhost:3001/health').then(r => r.ok ? process.exit(0) : process.exit(1))" || exit 1

# Start application
CMD ["bun", "run", "start"]
