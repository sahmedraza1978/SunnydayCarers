# NDIS Service Provider - Frontend

React + TypeScript frontend for NDIS participant management and service agreements.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create .env file** (from .env.example)
   ```bash
   cp .env.example .env
   ```

3. **Start development server**
   ```bash
   npm start
   ```

The app will open at `http://localhost:3000`

## Features

- **Login/Authentication** - JWT-based authentication
- **Dashboard** - Overview of participants and agreements
- **Participant Management** - Add, view, and edit participant details
- **Service Agreements** - Create and manage service agreements (coming soon)
- **User Management** - Admin controls for users (coming soon)

## Pages

- `/login` - Login page
- `/dashboard` - Main dashboard with participant list
- `/participants/new` - Add new participant
- `/participants/:id` - View/edit participant (coming soon)
- `/agreements/:id` - Create/view service agreement (coming soon)
