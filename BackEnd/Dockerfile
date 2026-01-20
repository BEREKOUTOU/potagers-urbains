# Use Node.js 18 LTS Alpine for smaller image size
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install system dependencies for native modules and security
RUN apk add --no-cache \
    postgresql-client \
    clamav \
    clamav-daemon \
    && rm -rf /var/cache/apk/*

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy package files
COPY package*.json ./

# Install dependencies
# Use `npm install` here so the build doesn't fail if lockfile is out of sync
# and to avoid `npm ci` errors during CI/docker builds. Using Node 20 satisfies
# package engine requirements from newer packages.
RUN npm install --no-audit --no-fund && npm cache clean --force

# Copy source code
COPY --chown=nextjs:nodejs . .

# Build the application
RUN npm run build

# Create uploads directory with proper permissions
RUN mkdir -p uploads/photos uploads/events uploads/temp && \
    chown -R nextjs:nodejs uploads

# Update ClamAV database
RUN freshclam

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]
