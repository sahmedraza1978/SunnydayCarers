# NDIS Service Provider App

Complete web application for NDIS Service Providers to manage participants and create service agreements.

## Project Structure

```
.
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── index.ts     # Main server entry
│   │   ├── database/    # Database init & migrations
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth, error handling
│   │   ├── types/       # TypeScript types
│   │   └── services/    # Business logic
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/             # React SPA
    ├── src/
    │   ├── App.tsx      # Main app component
    │   ├── pages/       # Page components
    │   ├── components/  # Reusable components
    │   ├── hooks/       # Custom hooks
    │   ├── services/    # API client
    │   └── types/       # TypeScript types
    ├── public/
    └── package.json
```

## Quick Start

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your database credentials
npm run db:init
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Document Generation**: PDFKit (coming soon)

## Features

### MVP (Phase 1)
- ✅ User authentication (Admin, Support Workers)
- ✅ Participant registration & management
- ⏳ Service Agreement creation (in progress)
- ⏳ Document generation & export (coming soon)

### Future Enhancements
- PDF template management
- Document workflow approval system
- Activity logging & audit trail
- Role-based access control
- Bulk operations
- Advanced search & filters
- Mobile app

## Default Test Credentials

After running `npm run db:init` in backend, you can register new users via the registration endpoint:

```bash
POST http://localhost:5000/api/auth/register
{
  "email": "admin@example.com",
  "password": "password123",
  "first_name": "Admin",
  "last_name": "User",
  "role": "admin"
}
```

## API Documentation

See `backend/README.md` for detailed API endpoint documentation.

## Development

Both frontend and backend are written in TypeScript with strict type checking enabled.

### Running Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Building for Production

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## Environment Variables

See `.env.example` files in both `backend/` and `frontend/` directories.

## License

Proprietary - NDIS Service Provider App
