# BuildConnect Docker Deployment Guide

This guide explains how to deploy the BuildConnect marketplace application using Docker on Ubuntu.

## 🚀 Quick Start

### Prerequisites

1. **Ubuntu Server** (20.04 LTS or later)
2. **Docker** (20.10 or later)
3. **Docker Compose** (2.0 or later)
4. **Git** (for cloning the repository)

### Installation Steps

1. **Install Docker on Ubuntu:**
```bash
# Update package index
sudo apt update

# Install required packages
sudo apt install apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

2. **Clone and Deploy:**
```bash
# Clone the repository
git clone <your-repo-url>
cd construction_marketplace

# Make deployment script executable
chmod +x deploy.sh

# Deploy the application
./deploy.sh
```

## 📁 Project Structure

```
construction_marketplace/
├── Dockerfile                 # Main application container
├── docker-compose.yml        # Multi-container orchestration
├── nginx.conf                # Nginx reverse proxy config
├── ecosystem.config.js       # PM2 process management
├── deploy.sh                 # Deployment script
├── .env.production           # Production environment variables
├── .dockerignore             # Docker ignore file
├── app/                      # Next.js application
├── components/               # React components
├── lib/                      # Utilities and contexts
├── public/                   # Static files including pincode data
├── data/                     # SQLite database (created on first run)
└── logs/                     # Application logs
```

## 🔧 Configuration

### Environment Variables

Edit `.env.production` to configure your deployment:

```bash
# Application
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Database
DATABASE_URL=file:./data/buildconnect.db

# Security
NEXTAUTH_SECRET=your-super-secret-key-here

# Optional integrations
RAZORPAY_KEY_ID=your-payment-gateway-key
SMTP_HOST=your-email-server
```

### SSL Configuration (Production)

1. **Obtain SSL certificates:**
```bash
# Using Let's Encrypt (recommended)
sudo apt install certbot
sudo certbot certonly --standalone -d your-domain.com
```

2. **Copy certificates:**
```bash
mkdir ssl
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/key.pem
sudo chown $USER:$USER ssl/*
```

3. **Update nginx.conf:**
   - Uncomment the HTTPS server block
   - Update `server_name` with your domain

## 🚀 Deployment Commands

### Basic Deployment
```bash
./deploy.sh
```

### Clean Deployment (removes old images)
```bash
./deploy.sh --clean
```

### Manual Commands
```bash
# Build and start
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart specific service
docker-compose restart buildconnect-app

# Update application
git pull
docker-compose up --build -d
```

## 📊 Monitoring

### Health Checks
- **Application Health:** `http://your-domain.com/api/health`
- **Nginx Health:** `http://your-domain.com/health`

### Logs
```bash
# Application logs
docker-compose logs buildconnect-app

# Nginx logs
docker-compose logs nginx

# All logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f
```

### System Monitoring
```bash
# Container status
docker-compose ps

# Resource usage
docker stats

# Disk usage
docker system df
```

## 🔧 Maintenance

### Database Backup
```bash
# Backup SQLite database
cp data/buildconnect.db data/backup-$(date +%Y%m%d-%H%M%S).db

# Automated backup script
echo "0 2 * * * cp /path/to/app/data/buildconnect.db /path/to/backups/backup-\$(date +\%Y\%m\%d).db" | crontab -
```

### Log Rotation
```bash
# Configure logrotate
sudo nano /etc/logrotate.d/buildconnect

# Add configuration:
/path/to/app/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    copytruncate
}
```

### Updates
```bash
# Update application
git pull
docker-compose up --build -d

# Update system packages
sudo apt update && sudo apt upgrade

# Update Docker images
docker-compose pull
docker-compose up -d
```

## 🛡️ Security

### Firewall Configuration
```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP/HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Check status
sudo ufw status
```

### Security Headers
The nginx configuration includes security headers:
- X-Frame-Options
- X-XSS-Protection
- X-Content-Type-Options
- Content-Security-Policy
- Strict-Transport-Security (HTTPS only)

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use:**
```bash
sudo lsof -i :3000
sudo kill -9 <PID>
```

2. **Permission denied:**
```bash
sudo chown -R $USER:$USER /path/to/app
chmod -R 755 /path/to/app
```

3. **Database locked:**
```bash
# Stop application
docker-compose down
# Check for lock files
ls -la data/
# Remove lock files if safe
rm data/*.db-wal data/*.db-shm
```

4. **Out of disk space:**
```bash
# Clean Docker system
docker system prune -a
# Clean logs
sudo journalctl --vacuum-time=7d
```

### Performance Tuning

1. **Increase memory limits:**
   - Edit `ecosystem.config.js`
   - Adjust `max_memory_restart`

2. **Optimize database:**
```bash
# SQLite optimization
sqlite3 data/buildconnect.db "VACUUM; ANALYZE;"
```

3. **Monitor resources:**
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs
```

## 📞 Support

For deployment issues:
1. Check logs: `docker-compose logs`
2. Verify configuration: `docker-compose config`
3. Test connectivity: `curl http://localhost:3000/api/health`
4. Check system resources: `htop` and `df -h`

## 🎯 Production Checklist

- [ ] SSL certificates configured
- [ ] Environment variables set
- [ ] Database backups scheduled
- [ ] Log rotation configured
- [ ] Firewall rules applied
- [ ] Monitoring setup
- [ ] Health checks working
- [ ] Performance testing completed
- [ ] Security headers verified
- [ ] Domain DNS configured
