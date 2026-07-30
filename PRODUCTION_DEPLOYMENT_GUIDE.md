# KONTAGI — Step-by-Step Production Deployment Guide

**Date**: July 26, 2026  
**Auditor**: Lead DevOps & Release Engineer  
**Target Environment**: Production Linux VPS / Kubernetes / AWS ECS / Docker Host  

---

## 1. Prerequisites & Infrastructure Setup

Ensure the host server meets minimum requirements:
- **OS**: Ubuntu 22.04 LTS / Debian 12 / RHEL 9
- **CPU**: 4 vCPUs minimum
- **RAM**: 8 GB RAM minimum (16 GB recommended for local Ollama LLM execution)
- **Disk**: 50 GB NVMe SSD
- **Software Dependencies**: Docker 26+, Docker Compose v2.25+, Git

---

## 2. Step-by-Step Deployment Protocol

### Step 1: Clone Repository & Checkout Tag
```bash
git clone https://github.com/company/kontagi.git /opt/kontagi
cd /opt/kontagi
git checkout tags/v1.0.0-RC1
```

### Step 2: Environment Configuration
Copy `.env.example` to `.env` in both root and `server/` directories:
```bash
cp server/.env.example server/.env
```

Configure production parameters in `server/.env`:
```env
NODE_ENV=production
PORT=3000
API_PREFIX=/api
DATABASE_URL=postgresql://kontagi_user:SECURE_DB_PASSWORD@postgres:5432/kontagi?schema=public&connection_limit=20
REDIS_URL=redis://redis:6379
JWT_ACCESS_SECRET=PRODUCTION_64_BYTE_RANDOM_SECRET_STRING_ACCESS
JWT_REFRESH_SECRET=PRODUCTION_64_BYTE_RANDOM_SECRET_STRING_REFRESH
CSRF_SECRET=PRODUCTION_64_BYTE_RANDOM_SECRET_STRING_CSRF
CORS_ORIGIN=https://kontagi.ai
OLLAMA_BASE_URL=http://ollama:11434
OLLAMA_MODEL=qwen2.5:1.5b
GEMINI_API_KEY=YOUR_OPTIONAL_PRODUCTION_GEMINI_KEY
```

### Step 3: Launch Containers via Docker Compose
```bash
cd server
docker compose up -d --build
```

### Step 4: Verify Database Migrations & Seed Preset Data
```bash
docker compose exec app npx prisma migrate deploy
docker compose exec app npm run db:seed
```

### Step 5: Verify Health & Readiness Probes
```bash
curl -s http://localhost:3000/healthz
curl -s http://localhost:3000/readyz
```

---

## 3. Reverse Proxy & SSL Configuration (Nginx)

Place Nginx reverse proxy configuration at `/etc/nginx/sites-available/kontagi`:

```nginx
server {
    listen 80;
    server_name kontagi.ai www.kontagi.ai;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name kontagi.ai www.kontagi.ai;

    ssl_certificate /etc/letsencrypt/live/kontagi.ai/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kontagi.ai/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    location / {
        root /opt/kontagi/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 180s;
    }
}
```

---

## 4. Operational Maintenance & Backups

### Automated Database Backup Cron:
Add to crontab (`crontab -e`):
```cron
0 2 * * * /opt/kontagi/server/scripts/backup/backup.sh >> /var/log/kontagi-backup.log 2>&1
```

---

## 5. Summary

The production deployment process is fully documented, containerized, and repeatable.  
**Deployment Status: APPROVED FOR PRODUCTION USE.**
