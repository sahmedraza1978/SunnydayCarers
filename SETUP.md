# NDIS Service Provider App - Setup Guide

## Prerequisites

- Node.js 16+ and npm 8+
- PostgreSQL 12+
- Git (optional)

## Installation Steps

### 1. Database Setup

First, create a PostgreSQL database:

```bash
# Using psql command line
createdb ndis_service_provider
```

Or use pgAdmin GUI to create a new database named `ndis_service_provider`.

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and update database credentials
# Required variables:
# - DB_HOST (usually localhost)
# - DB_PORT (usually 5432)
# - DB_USER (postgres username)
# - DB_PASSWORD (postgres password)
# - JWT_SECRET (generate a random string)

# Initialize database with tables
npm run db:init

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (usually defaults are fine)
cp .env.example .env

# Start frontend dev server
npm start
```

Frontend will open at `http://localhost:3000`

## First Use

1. **Register Admin User**
   - Go to http://localhost:3000/login
   - Look for "Register here" link
   - Or use API directly:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@example.com",
       "password": "SecurePassword123",
       "first_name": "John",
       "last_name": "Doe",
       "role": "admin"
     }'
   ```

2. **Login**
   - Use credentials from registration
   - Dashboard will show participant list

3. **Add Participants**
   - Click "Add Participant" button
   - Fill in participant details
   - Save

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Express server setup
│   ├── database/
│   │   ├── init.ts          # Database connection & tables
│   │   └── migrations.ts    # Additional migrations
│   ├── routes/
│   │   ├── auth.ts          # Login/register
│   │   ├── participants.ts  # Participant CRUD
│   │   ├── agreements.ts    # Service agreements
│   │   └── users.ts         # User management
│   ├── middleware/
│   │   ├── auth.ts          # JWT authentication
│   │   ├── errorHandler.ts  # Error handling
│   │   └── requestLogger.ts # Request logging
│   └── types/
│       └── index.ts         # TypeScript interfaces
├── .env.example
├── package.json
└── tsconfig.json

frontend/
├── src/
│   ├── index.tsx            # React entry point
│   ├── App.tsx              # Main app with routing
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── NewParticipantPage.tsx
│   ├── hooks/
│   │   └── useAuth.tsx      # Auth context hook
│   ├── services/
│   │   └── api.ts           # API client
│   ├── types/
│   │   └── index.ts         # TypeScript interfaces
│   ├── index.css            # Tailwind CSS
│   └── index.tsx
├── public/
│   └── index.html
├── .env.example
├── package.json
└── tsconfig.json
```

## Database Schema

### Users Table
```sql
- id (UUID, primary key)
- email (unique)
- password_hash
- first_name, last_name
- role (admin | support_worker)
- is_active
- created_at, updated_at
```

### Participants Table
```sql
- id (UUID, primary key)
- ndis_number (unique)
- first_name, last_name
- date_of_birth
- email, phone_number
- address fields (street, suburb, state, postcode)
- emergency_contact_name, phone, relationship
- status (active | inactive | suspended)
- notes
- created_at, updated_at
- created_by (user ID)
```

### Service Agreements Table
```sql
- id (UUID, primary key)
- participant_id (foreign key)
- template_id (foreign key)
- status (draft | pending_review | approved | executed | archived)
- start_date, end_date
- approval_date, approved_by
- document_path
- notes
- created_at, updated_at
- created_by (user ID)
```

### Agreement Templates Table
```sql
- id (UUID, primary key)
- name, description
- content (JSON)
- version
- is_active
- created_at, updated_at
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Participants
- `GET /api/participants` - List all
- `GET /api/participants/:id` - Get one
- `POST /api/participants` - Create
- `PUT /api/participants/:id` - Update

### Agreements
- `GET /api/agreements` - List all
- `GET /api/agreements/:id` - Get one
- `POST /api/agreements` - Create
- `PATCH /api/agreements/:id/status` - Update status

### Users (Admin only)
- `GET /api/users` - List all
- `GET /api/users/me` - Current user
- `PUT /api/users/:id` - Update user

## Common Issues

### Database Connection Error
- Check PostgreSQL is running: `psql -U postgres`
- Verify credentials in .env file
- Ensure database exists: `createdb ndis_service_provider`

### Port Already in Use
- Backend uses 5000, frontend uses 3000
- To use different ports, update .env files

### CORS Errors
- Ensure frontend and backend URLs match in .env
- Backend CORS_ORIGIN should be `http://localhost:3000`

### JWT Token Expired
- Default expiry is 7 days
- Change `JWT_EXPIRY` in backend .env
- User will need to login again after expiry

## Next Steps

1. **Add Service Agreement Templates**
   - Create template management UI
   - Design template structure for your agreements
   - Store custom agreement fields

2. **Document Generation**
   - Integrate PDFKit for PDF export
   - Create agreement preview
   - Download as PDF

3. **Compliance & Reporting**
   - Add activity logging
   - Create compliance reports
   - Export functionality

4. **Advanced Features**
   - Bulk import participants
   - Support worker assignment
   - Participant communication tools
   - Billing integration

## Support

For issues or questions, check:
- Backend logs: `npm run dev` output
- Frontend console: Browser DevTools
- Database: `psql -U postgres ndis_service_provider`

## Deployment

### Backend (Heroku, AWS, DigitalOcean, etc.)
```bash
npm run build
npm start
```

### Frontend (Netlify, Vercel, GitHub Pages)
```bash
npm run build
# Upload dist folder or connect Git repository
```

Remember to update environment variables for production!
