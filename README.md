# Franchise Brand Management System

FBMS is a full stack franchise brand operations dashboard built with React, Vite, Tailwind CSS, Express, JWT authentication, Multer uploads, and MySQL.

## Demo Accounts

| Role | Email | Password |
| --- | --- | --- |
| Super Admin | `admin@fbms.com` | `Admin123` |
| Brand Manager | `manager@fbms.com` | `Manager123` |
| Marketing Executive | `marketing@fbms.com` | `Marketing123` |
| Graphic Designer | `designer@fbms.com` | `Designer123` |
| Branch Manager | `branch@fbms.com` | `Branch123` |

## Local Setup

1. Start MySQL with Docker:
   ```bash
   docker compose up -d mysql
   ```

2. Configure backend:
   ```bash
   cd backend
   cp .env.example .env
   npm install
   npm run seed
   npm run dev
   ```

3. Configure frontend:
   ```bash
   cd frontend
   cp .env.example .env
   npm install
   npm run dev
   ```

4. Open `http://localhost:5173`.

Backend health check: `http://localhost:4000/api/health`.

## Project Structure

```text
backend/
  src/config
  src/controllers
  src/middleware
  src/models
  src/routes
  src/validations
  src/database
  src/seeders
frontend/
  src/components
  src/context
  src/hooks
  src/layouts
  src/pages
  src/routes
  src/services
```

## Deployment Prep

- Frontend: deploy the `frontend` directory to Vercel or Netlify and set `VITE_API_URL` to the backend API URL.
- Backend: deploy the `backend` directory as a Node service or Docker service and set the `.env` variables from `backend/.env.example`.
- Database: create a MySQL 8 database, run `backend/src/database/schema.sql`, then run `backend/src/database/seed.sql` if demo data is needed.
- CORS: set `CLIENT_URL` on the backend to the deployed frontend URL.

## Useful Scripts

```bash
npm run install:all
npm run seed
npm run dev:backend
npm run dev:frontend
npm run build
```
