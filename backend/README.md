# NDIS Service Provider - Backend

Node.js/Express backend API for NDIS participant management and service agreements.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create .env file** (from .env.example)
   ```bash
   cp .env.example .env
   ```

3. **Update database credentials** in .env

4. **Initialize database**
   ```bash
   npm run db:init
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Participants
- `GET /api/participants` - Get all participants
- `GET /api/participants/:id` - Get participant details
- `POST /api/participants` - Create new participant
- `PUT /api/participants/:id` - Update participant

### Service Agreements
- `GET /api/agreements` - Get all agreements
- `GET /api/agreements/:id` - Get agreement details
- `POST /api/agreements` - Create new agreement
- `PATCH /api/agreements/:id/status` - Update agreement status

### Users (Admin)
- `GET /api/users` - Get all users
- `GET /api/users/me` - Get current user
- `PUT /api/users/:id` - Update user

## Database

PostgreSQL with tables:
- users
- participants
- agreement_templates
- service_agreements
- agreement_items
- activity_logs
