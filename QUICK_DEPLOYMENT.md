# Quick Deployment Checklist

## Choose Your Platform (5-15 minutes)

Pick ONE based on your preference:

**EASIEST** → Railway or Vercel (GitHub integration, auto-deploy)
**CHEAPEST** → DigitalOcean or AWS EC2
**BALANCED** → Heroku (classic, reliable, free tier)

---

## Platform-Specific Quick Steps

### Railway (⭐ RECOMMENDED)

```bash
# 1. Push code to GitHub
git push origin main

# 2. Go to railway.app
# 3. Click "New Project" → "Deploy from GitHub"
# 4. Select repository
# 5. Set environment variables in Railway dashboard:
#    - DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
#    - JWT_SECRET (generate random: openssl rand -hex 32)
#    - CORS_ORIGIN (your domain)

# 6. Add PostgreSQL service in Railway
# 7. Deploy frontend service
# 8. Done! ✓
```

**Time: 15 minutes**
**Cost: ~$5-10/month**

---

### Heroku

```bash
# 1. Install Heroku CLI
# 2. Login
heroku login

# 3. Create apps
heroku create your-app-backend
heroku create your-app-frontend

# 4. Add database
heroku addons:create heroku-postgresql:hobby-dev

# 5. Set variables
heroku config:set JWT_SECRET="your_random_secret" -a your-app-backend
heroku config:set REACT_APP_API_URL="https://your-app-backend.herokuapp.com" -a your-app-frontend

# 6. Deploy
cd backend && git push heroku main
cd ../frontend && git push heroku main

# 7. Initialize database
heroku run npm run db:init -a your-app-backend

# Done! ✓
```

**Time: 20 minutes**
**Cost: $7-50/month**

---

### DigitalOcean App Platform

```bash
# 1. Create .do/app.yaml in root
# 2. Go to cloud.digitalocean.com/apps
# 3. Click "Create App"
# 4. Connect GitHub repo
# 5. Select .do/app.yaml
# 6. Add environment variables
# 7. Click "Deploy"
# 8. Done! ✓
```

**Time: 15 minutes**
**Cost: $5-100/month**

---

### Self-Hosted VPS (AWS/DigitalOcean Droplet)

```bash
# 1. Create Ubuntu 22.04 instance
# 2. SSH into server
# 3. Install dependencies
sudo apt update
sudo apt install -y nodejs npm postgresql nginx git

# 4. Clone repo
git clone https://github.com/you/ndis-app.git
cd ndis-app

# 5. Install and build
cd backend && npm install
cd ../frontend && npm install && npm run build

# 6. Setup PostgreSQL
sudo -u postgres createdb ndis_app

# 7. Setup environment files
cp backend/.env.example backend/.env
# Edit with your values

# 8. Install PM2
sudo npm install -g pm2
cd backend
pm2 start npm --name "backend" -- start

# 9. Setup Nginx
# Copy config from DEPLOYMENT_GUIDE.md
# Enable and restart

# 10. Install SSL
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com

# Done! ✓
```

**Time: 45 minutes - 1 hour**
**Cost: $3-20/month**

---

## Universal Pre-Deployment Steps

### Step 1: Prepare Environment File

Backend `.env` template:
```env
NODE_ENV=production
PORT=5000

DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=ndis_app
DB_USER=postgres
DB_PASSWORD=your_secure_password

JWT_SECRET=generate_with_openssl_rand_hex_32
JWT_EXPIRY=7d

CORS_ORIGIN=https://yourdomain.com
```

Frontend `.env` template:
```env
REACT_APP_API_URL=https://your-backend-url.com
NODE_ENV=production
```

### Step 2: Generate JWT Secret

```bash
# On Mac/Linux:
openssl rand -hex 32

# On Windows (PowerShell):
[Convert]::ToHexString([Random]::new().GetBytes(32))
```

Copy the output to `JWT_SECRET` in your `.env`

### Step 3: Update Configuration Files

Edit these files before deployment:

**frontend/.env:**
```env
REACT_APP_API_URL=https://your-production-api-url.com
```

**backend/.env:**
- All database credentials
- JWT_SECRET (from step 2)
- CORS_ORIGIN (your frontend URL)

### Step 4: Ensure All Dependencies Installed

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
npm install chart.js react-chartjs-2
```

### Step 5: Build Frontend

```bash
cd frontend
npm run build
```

Check that `frontend/build` folder exists and contains `index.html`

---

## Deployment Day Checklist

- [ ] Environment variables ready (.env files)
- [ ] JWT_SECRET generated and saved securely
- [ ] Database credentials prepared
- [ ] Frontend built successfully (`npm run build`)
- [ ] All environment files populated
- [ ] GitHub repo pushed with latest code
- [ ] SSL certificate ready (if using own domain)
- [ ] Domain DNS configured (if applicable)

---

## After Deployment: Critical First Steps

### 1. Test API Health

```bash
curl https://your-backend-url.com/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

### 2. Test Frontend Loading

Open `https://your-frontend-url.com` in browser
- Should load login page
- No console errors

### 3. Create Admin User

```bash
# Connect to production database
psql -h your-db-host -U postgres -d ndis_app

# Create admin (you'll need to generate a bcrypt hash)
# Use an online tool or:
INSERT INTO users (email, password_hash, first_name, last_name, role)
VALUES ('admin@yourdomain.com', '$2b$10$...hash...', 'Admin', 'User', 'admin');
```

### 4. Initialize Database

```bash
# Backend deployment should run this automatically
npm run db:init
```

### 5. Test Login

1. Navigate to `https://your-frontend-url.com`
2. Login with admin credentials
3. Create test participant
4. Complete onboarding
5. Generate test document
6. Verify everything works

### 6. Enable Backups

Set up automatic daily backups:

```bash
# Create backup script
0 2 * * * pg_dump -h your-host -U postgres ndis_app > /backups/ndis_$(date +\%Y\%m\%d).sql
```

---

## Common Deployment Issues & Fixes

### "Cannot connect to database"
```bash
# Check credentials
psql -h $DB_HOST -U $DB_USER -d $DB_NAME

# Verify variables are set
echo $DB_HOST
echo $DB_NAME
```

### "CORS error" in browser
```
Update backend/.env:
CORS_ORIGIN=https://your-exact-frontend-url.com
```

### "API not found" (404)
```bash
# Verify backend is running
curl https://your-backend-url.com/api/health

# Check API URL in frontend/.env:
REACT_APP_API_URL=https://your-backend-url.com
```

### "Document generation fails"
```
Check backend:
- jszip installed: npm list jszip
- Template file exists in backend/templates/
- Correct path configured
```

### "CSS/styling broken"
```
Check frontend:
- npm run build completed
- build/ folder exists
- build/index.html present
- build/static/ folder populated
```

---

## Security Checklist

BEFORE going live, verify:

- [ ] Changed PostgreSQL default password
- [ ] JWT_SECRET is long and random (32+ chars)
- [ ] CORS_ORIGIN set to your domain only
- [ ] HTTPS enabled (SSL certificate)
- [ ] Database password NOT in code
- [ ] .env files in .gitignore
- [ ] NODE_ENV=production
- [ ] Admin user created
- [ ] Firewall configured (if using VPS)
- [ ] Backups enabled

---

## Estimated Time & Cost by Platform

| Platform | Setup Time | Monthly Cost | Difficulty |
|----------|-----------|--------------|-----------|
| Railway | 15 min | $5-10 | ⭐ Easy |
| Vercel+Backend | 20 min | $10-20 | ⭐ Easy |
| Heroku | 20 min | $7-50 | ⭐⭐ Medium |
| DigitalOcean App | 15 min | $5-100 | ⭐⭐ Medium |
| AWS EC2 | 1 hour | $3-20 | ⭐⭐⭐ Hard |
| Docker | 30 min | $5-50 | ⭐⭐ Medium |
| Localhost | 0 min | $0 | ⭐ Easy |

---

## Recommended Path

### For Testing/Development:
→ Localhost (`npm run dev` / `npm start`)

### For Small Teams (< 50 users):
→ **Railway** or **Vercel + Backend**

### For Growing Organization (50-500 users):
→ **DigitalOcean App Platform**

### For Large Scale (500+ users):
→ **AWS** with load balancing & CDN

---

## Need Help?

Detailed instructions in: **DEPLOYMENT_GUIDE.md**

Choose your platform and follow the step-by-step guide.

Good luck! 🚀
