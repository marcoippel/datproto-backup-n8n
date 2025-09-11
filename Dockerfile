# Dockerfile for N8N Workflow Management
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    bash

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S n8nuser && \
    adduser -S n8nuser -u 1001

# Set ownership
RUN chown -R n8nuser:n8nuser /app

# Switch to non-root user
USER n8nuser

# Expose port (if needed for health checks)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node scripts/health-check.js || exit 1

# Default command
CMD ["npm", "run", "health-check"]