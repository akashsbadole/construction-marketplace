# Use Ubuntu 22.04 as base image
FROM ubuntu:22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_VERSION=20.x
ENV PNPM_VERSION=8.15.0

# Set working directory
WORKDIR /app

# Update package list and install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    gnupg \
    lsb-release \
    ca-certificates \
    software-properties-common \
    build-essential \
    python3 \
    python3-pip \
    git \
    vim \
    nano \
    htop \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 20.x
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install pnpm globally
RUN npm install -g pnpm@${PNPM_VERSION}

# Install PM2 for process management
RUN npm install -g pm2

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p data logs

# Set permissions
RUN chmod -R 755 /app

# Build the application
RUN pnpm build

# Create a non-root user
RUN useradd -m -s /bin/bash buildconnect && \
    chown -R buildconnect:buildconnect /app

# Switch to non-root user
USER buildconnect

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application with PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
