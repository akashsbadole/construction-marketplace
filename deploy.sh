#!/bin/bash

# BuildConnect Deployment Script
# This script builds and deploys the BuildConnect marketplace application

set -e

echo "🚀 Starting BuildConnect deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p data logs ssl

# Set permissions
chmod 755 data logs
if [ -d ssl ]; then
    chmod 600 ssl/*
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down --remove-orphans || true

# Remove old images (optional)
if [ "$1" = "--clean" ]; then
    print_status "Cleaning up old Docker images..."
    docker system prune -f
    docker image prune -f
fi

# Build and start containers
print_status "Building and starting containers..."
docker-compose up --build -d

# Wait for services to be ready
print_status "Waiting for services to start..."
sleep 30

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    print_success "Services are running!"
    
    # Show running containers
    print_status "Running containers:"
    docker-compose ps
    
    # Show logs
    print_status "Recent logs:"
    docker-compose logs --tail=20
    
    print_success "🎉 BuildConnect deployment completed successfully!"
    print_status "Application is available at: http://localhost:3000"
    print_status "Health check: http://localhost:3000/api/health"
    
else
    print_error "❌ Deployment failed. Check logs for details:"
    docker-compose logs
    exit 1
fi

# Optional: Show useful commands
echo ""
print_status "Useful commands:"
echo "  View logs:           docker-compose logs -f"
echo "  Stop services:       docker-compose down"
echo "  Restart services:    docker-compose restart"
echo "  Update application:  ./deploy.sh"
echo "  Clean deployment:    ./deploy.sh --clean"
