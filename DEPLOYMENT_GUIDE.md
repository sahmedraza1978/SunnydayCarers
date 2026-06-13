# NDIS Service Provider App - Deployment Guide

## Quick Start Deployment Options

Choose one of these deployment options based on your needs:

| Option | Cost | Difficulty | Scalability | Setup Time |
|--------|------|-----------|-------------|-----------|
| **Heroku** | $7-50/mo | Easy | Medium | 15 mins |
| **Railway** | $5-100/mo | Easy | Medium | 15 mins |
| **Vercel + Backend** | Free-50/mo | Easy | High | 20 mins |
| **AWS** | $10-200/mo | Hard | Very High | 1-2 hours |
| **DigitalOcean** | $5-100/mo | Medium | High | 30 mins |
| **Docker** | Free | Medium | High | 45 mins |
| **Self-Hosted VPS** | $3-20/mo | Hard | Medium | 1 hour |

---

## Option 1: Railway (Recommended for Beginners) ⭐

Railway is the easiest option with Git integration and automatic deployments.

### Prerequisites
- GitHub account with your code pushed
- Railway account (free at railway.app)
- PostgreSQL database access

### Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Connect your GitHub account
6. Select your NDIS app repository

### Step 2: Configure Backend

1. In Railway dashboard, click "New Service"
2. Select your repository
3. Set root directory to `backend`
4. Add environment variables:

```env
DB_HOST=your_postgres_host
DB_PORT=5432
DB_NAME=ndis_app
DB_USER=postgres
DB_PASSWORD=your_secure_password
JWT_SECRET=your_very_long_random_secret_key_here
JWT_EXPIRY=7d
CORS_ORIGIN=https://yourdomain.com
NODE_ENV=production
PORT=5000
```

5. Add PostgreSQL service:
   - Click "New Service" → "Database" → "PostgreSQL"
   - Railway auto-populates DB_HOST and credentials

### Step 3: Configure Frontend

1. Click "New Service" → "GitHub repo"
2. Set root directory to `frontend`
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add environment variables:

```env
REACT_APP_API_URL=https://your-backend-url.railway.app
NODE_ENV=production
```

6. Add domain (Railway provides .railway.app URL)

### Step 4: Deploy

1. Commit and push changes to GitHub
2. Railway auto-deploys within 2-3 minutes
3. Check deployment logs in Railway dashboard
4. Visit your app URL

### Step 5: Initialize Database

1. Connect to Railway PostgreSQL (use provided credentials)
2. Run migrations:
   ```bash
   npm run db:init
   ```

---

## Option 2: Heroku (Classic Deployment)

### Prerequisites
- Heroku account (free tier available)
- Heroku CLI installed
- GitHub repo

### Step 1: Create Heroku Apps

```bash
# Create backend app
heroku create your-app-backend

# Create frontend app
heroku create your-app-frontend

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev -a your-app-backend
```

### Step 2: Set Environment Variables

```bash
# Backend
heroku config:set \
  JWT_SECRET="your_secret_key" \
  CORS_ORIGIN="https://your-app-frontend.herokuapp.com" \
  -a your-app-backend

# Frontend
heroku config:set \
  REACT_APP_API_URL="https://your-app-backend.herokuapp.com" \
  -a your-app-frontend
```

### Step 3: Deploy Backend

```bash
cd backend
heroku login
git push heroku main
```

### Step 4: Deploy Frontend

```bash
cd frontend
npm run build
git push heroku main
```

---

## Option 3: DigitalOcean App Platform

### Step 1: Prepare Your Project

1. Create a `.do/app.yaml` file:

```yaml
name: ndis-app
services:
- name: backend
  github:
    repo: your-username/ndis-app
    branch: main
  source_dir: backend
  envs:
  - key: DATABASE_URL
    scope: RUN_AND_BUILD_TIME
    value: ${db.connection_string}
  - key: JWT_SECRET
    scope: RUN_AND_BUILD_TIME
    value: ${JWT_SECRET}
  http_port: 5000
  
- name: frontend
  github:
    repo: your-username/ndis-app
    branch: main
  source_dir: frontend
  build_command: npm run build
  envs:
  - key: REACT_APP_API_URL
    scope: BUILD_TIME
    value: https://backend.ondigitalocean.app

databases:
- name: db
  engine: PG
  version: "12"
```

### Step 2: Deploy

1. Go to [DigitalOcean Apps](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Connect GitHub repository
4. Select `.do/app.yaml`
5. Click "Deploy"

---

## Option 4: Docker + Any Cloud Provider

### Step 1: Create Dockerfile for Backend

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
```

### Step 2: Create Dockerfile for Frontend

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine

RUN npm install -g serve

WORKDIR /app

COPY --from=build /app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
```

### Step 3: Create docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: ndis_app
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_secure_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    environment:
      DB_HOST: db
      DB_PORT: 5432
      DB_NAME: ndis_app
      DB_USER: postgres
      DB_PASSWORD: your_secure_password
      JWT_SECRET: your_secret_key
      CORS_ORIGIN: http://localhost:3000
    ports:
      - "5000:5000"
    depends_on:
      - db

  frontend:
    build: ./frontend
    environment:
      REACT_APP_API_URL: http://localhost:5000
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Step 4: Deploy Docker Image

```bash
# Build and run locally first
docker-compose up -d

# Push to cloud:
docker build -t your-registry/ndis-backend:latest ./backend
docker push your-registry/ndis-backend:latest
```

---

## Option 5: AWS EC2 (Complete Control)

### Step 1: Launch EC2 Instance

```bash
# Instance type: t3.micro (free tier eligible)
# OS: Ubuntu 22.04 LTS
# Security group: Allow ports 22, 80, 443, 5000, 3000
```

### Step 2: Install Dependencies

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm postgresql postgresql-contrib nginx git

# Install Node.js LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### Step 3: Clone and Setup Application

```bash
cd /home/ubuntu
git clone https://github.com/your-username/ndis-app.git
cd ndis-app

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with production values

# Frontend setup
cd ../frontend
npm install
npm run build
```

### Step 4: Setup PostgreSQL

```bash
sudo -u postgres psql

CREATE DATABASE ndis_app;
CREATE USER postgres_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE ndis_app TO postgres_user;
```

### Step 5: Setup Nginx Reverse Proxy

Create `/etc/nginx/sites-available/ndis-app`:

```nginx
upstream backend {
    server localhost:5000;
}

server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        root /home/ubuntu/ndis-app/frontend/build;
        try_files $uri /index.html;
    }
}
```

Enable and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/ndis-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: Setup PM2 for Backend

```bash
sudo npm install -g pm2
cd /home/ubuntu/ndis-app/backend
pm2 start npm --name "ndis-backend" -- start
pm2 save
pm2 startup
```

### Step 7: Setup SSL Certificate

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Local Development Deployment

For testing before production:

### Backend

```bash
cd backend

# Install dependencies
npm install

# Initialize database
npm run db:init

# Start development server
npm run dev
```

Server runs at `http://localhost:5000`

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Install chart.js packages
npm install chart.js react-chartjs-2

# Start development server
npm start
```

App runs at `http://localhost:3000`

---

## Pre-Deployment Checklist

### Security
- [ ] Change default PostgreSQL password
- [ ] Generate strong JWT_SECRET
- [ ] Set CORS_ORIGIN to your domain only
- [ ] Use HTTPS in production
- [ ] Enable SSL certificate
- [ ] Hide sensitive data in environment variables
- [ ] Use .env files, not hardcoded values

### Configuration
- [ ] Set NODE_ENV=production
- [ ] Update API URLs in frontend
- [ ] Configure database connection strings
- [ ] Set JWT expiry appropriately
- [ ] Review and test all API endpoints

### Database
- [ ] Run database migrations (`npm run db:init`)
- [ ] Create admin user account
- [ ] Verify all tables created successfully
- [ ] Test database backups

### Frontend
- [ ] Test all pages load correctly
- [ ] Verify API integration works
- [ ] Check responsive design on mobile
- [ ] Test file uploads/downloads
- [ ] Verify authentication flow

### Backend
- [ ] Test all API endpoints
- [ ] Verify error handling
- [ ] Check logging is working
- [ ] Test file handling
- [ ] Verify JWT token generation

### Performance
- [ ] Test with multiple users
- [ ] Check database query performance
- [ ] Monitor memory usage
- [ ] Test file generation under load
- [ ] Check frontend build size

---

## Post-Deployment Steps

### 1. Initialize Admin User

```bash
# Connect to your production database
psql -h your-host -U postgres -d ndis_app

# Run SQL to create admin user
INSERT INTO users (email, password_hash, first_name, last_name, role)
VALUES ('admin@example.com', '$2b$10$...hashed_password...', 'Admin', 'User', 'admin');
```

### 2. Create Test Data

1. Log in with admin account
2. Create test participant
3. Complete onboarding
4. Generate test document
5. Verify all workflows

### 3. Setup Email (Optional)

For future email notifications, configure:

```env
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASSWORD=your-password
SMTP_FROM=noreply@yourdomain.com
```

### 4. Setup Backup Strategy

```bash
# Daily PostgreSQL backup
0 2 * * * pg_dump ndis_app > /backups/ndis_$(date +\%Y\%m\%d).sql
```

### 5. Monitor Logs

```bash
# Backend logs
tail -f /var/log/pm2/ndis-backend.log

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## Troubleshooting Deployment

### Backend Won't Start
```bash
# Check logs
npm run dev
# Look for error messages

# Verify database connection
psql -h $DB_HOST -U $DB_USER -d $DB_NAME

# Check environment variables
echo $DB_HOST
echo $JWT_SECRET
```

### Frontend Not Connecting to Backend
```bash
# Check REACT_APP_API_URL
cat frontend/.env

# Test API endpoint
curl https://your-backend-url/api/health

# Check CORS settings
# Verify CORS_ORIGIN matches frontend URL
```

### Database Connection Failed
```bash
# Verify PostgreSQL is running
sudo systemctl status postgresql

# Check credentials
psql -h localhost -U postgres

# Verify port 5432 is open
netstat -an | grep 5432
```

### SSL Certificate Issues
```bash
# Renew certificate
sudo certbot renew

# Check certificate
sudo certbot certificates
```

---

## Production Deployment Checklist

Before going live, ensure:

### Infrastructure
- [ ] Domain name registered and configured
- [ ] SSL certificate installed
- [ ] Database backup system active
- [ ] Monitoring/alerting setup
- [ ] Log collection configured
- [ ] CDN configured (optional)

### Security
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled

### Performance
- [ ] Database indexes created
- [ ] Frontend assets minified
- [ ] Caching configured
- [ ] Load balancing setup (if needed)
- [ ] CDN configured for static assets

### Operations
- [ ] Runbook documentation created
- [ ] Incident response plan ready
- [ ] On-call schedule established
- [ ] Backup verification tested
- [ ] Disaster recovery plan ready

---

## Recommended Production Setup

For small-to-medium NDIS organizations:

### Infrastructure
- **Railway or Heroku**: Easy deployment, good for starting
- **DigitalOcean**: Better control, affordable, scalable

### Database
- **AWS RDS PostgreSQL** or **DigitalOcean Managed Database**
- Daily automated backups
- Multi-region backup (optional)

### Storage
- **AWS S3** for document storage (future enhancement)
- Generated documents stored in cloud

### Monitoring
- **Datadog** or **New Relic** for application monitoring
- **PagerDuty** for alerting

### CDN
- **CloudFlare** for DNS and DDoS protection
- Caches static assets globally

---

## Cost Estimation

**Small Deployment (1-100 users):**
- Backend: $10-20/month
- Frontend: $0 (Vercel free tier)
- Database: $10-15/month
- Monitoring: $0-10/month
- **Total: $20-45/month**

**Medium Deployment (100-1000 users):**
- Backend: $30-50/month
- Frontend: $20/month (Vercel Pro)
- Database: $50-100/month
- Monitoring: $20-50/month
- **Total: $120-220/month**

**Large Deployment (1000+ users):**
- Backend: $100-300/month
- Frontend: $50/month
- Database: $300-1000/month
- Monitoring: $100-500/month
- **Total: $550-1850/month**

---

## Support & Documentation

- **Railway Docs**: https://docs.railway.app
- **Heroku Docs**: https://devcenter.heroku.com
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **React Docs**: https://react.dev

For deployment-specific issues, refer to your chosen platform's documentation.

---

## Next Steps

1. **Choose a platform** from the options above
2. **Follow the step-by-step guide** for your platform
3. **Test thoroughly** before giving users access
4. **Set up backups** immediately
5. **Monitor logs** for the first week
6. **Document your setup** for future reference

Good luck with your deployment! 🚀
