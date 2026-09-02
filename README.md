# FBMS — Franchise Brand Management System

A full-stack platform that lets a franchise headquarters manage branding, marketing campaigns, and brand assets across multiple branches — while giving each branch a controlled way to request local customizations, track their status, and stay in sync with what HQ is running.

Built as a team project for **CSE470 — Software Engineering** at BRAC University.

---

## What it does

FBMS has two sides of the same system:

- **Headquarters** manages branches, users & roles, brand assets, campaigns, branding guidelines, and customization requests — with full visibility into what's happening across the whole franchise.
- **Branches** access approved resources, view campaigns relevant to them, and submit customization requests when they need something adapted locally — then track that request through review, approval, or revision.

Rather than one generic admin panel, every user sees a dashboard built around their actual role: a Marketing Executive sees the campaign currently running, a Graphic Designer sees the design work assigned to them, a Branch Manager sees their branch's own numbers, and HQ roles see franchise-wide statistics.

## Core features

**Authentication & Access Control**
- JWT-based auth (Bearer token + httpOnly cookie), bcrypt password hashing
- 5 distinct roles, each with different permissions enforced on both the API and the UI — the interface never shows an action a role isn't actually allowed to perform

**Role-based Dashboard**
- Super Admin / Brand Manager — franchise-wide stats with real week-over-week trends, recent activity feed
- Marketing Executive — the currently running (or next scheduled) campaign front and center
- Graphic Designer — their open design tasks, synced with a personal to-do list
- Branch Manager — their branch's own campaigns, requests, and team

**User & Role Management** — create, edit, activate/deactivate users; assign roles and branches

**Branch Management** — manage locations, assign branch managers, track per-branch activity

**Brand Asset Management** — upload, version, categorize, and approve brand assets; branch-scoped or global visibility

**Campaign Management** — create campaigns, assign them to branches, attach brand assets, track status through draft → scheduled → active → completed

**Branding Guidelines** — draft and publish official brand guidelines for designers, marketing, and branch managers

**Customization Requests** — branches submit requests, HQ assigns a designer, reviews, and approves/rejects/requests revision — with the full status history tracked

**Notifications** — real, event-driven notifications (not decorative): campaign launches, asset status changes, request assignment/approval/rejection, branch manager reassignment, account status changes, and more — each sent only to the people it's actually relevant to

**Activity Log** — a real audit trail of meaningful actions across the system, visible to management-tier roles

**Personal To-Do List** — per-account task list that also auto-syncs with any customization request assigned to a designer

**Reports** — grouped breakdowns of request status, campaign status, asset categories, and branch activity

## Roles

| Role | Can do |
|---|---|
| **Super Admin** | Full system access |
| **Brand Manager** | Owns brand governance, users, branches, campaigns, guidelines |
| **Marketing Executive** | Plans campaigns, monitors brand asset usage |
| **Graphic Designer** | Uploads assets, fulfills assigned customization requests |
| **Branch Manager** | Submits requests, manages branch-level campaign execution |

## Tech stack

**Frontend** — React, Vite, Tailwind CSS, React Router, Axios, React Context API

**Backend** — Node.js, Express, JWT, bcrypt, express-validator, Multer

**Database** — MySQL (raw SQL via `mysql2/promise` — no ORM)

**Architecture** — MVC: Routes → Controllers → Models → MySQL, with a thin service layer for cross-cutting concerns (notifications, request/task syncing)

```
React (View)
     ↓
Express Route → Middleware (auth/validation) → Controller → Model → MySQL
     ↓
JSON API Response
```

## Project structure

```
FBMS/
├── backend/
│   ├── src/
│   │   ├── config/        # DB connection, env loading
│   │   ├── controllers/   # Request handling per module
│   │   ├── middleware/    # Auth, validation, error handling
│   │   ├── models/        # SQL queries per entity
│   │   ├── routes/        # Endpoint definitions
│   │   ├── services/      # Notification service, request-todo sync
│   │   ├── seeders/       # Demo data seed script
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Shared UI (tables, cards, forms)
│   │   ├── context/       # Auth, toast
│   │   ├── layouts/
│   │   ├── pages/         # One folder per module (dashboard, users, branches, ...)
│   │   ├── services/      # Axios client
│   │   └── utils/         # Formatters, permission matrix
│   └── package.json
│
├── database/
│   ├── schema.sql         # Full schema for a fresh install
│   ├── seed.sql           # Demo data
│   └── migrations/        # Incremental, additive schema changes
│
├── docker-compose.yml      # MySQL container for local dev
└── package.json            # Root scripts (installs/runs both apps)
```

## Getting started

### Prerequisites
- Node.js 18+
- MySQL 8 (or use the included `docker-compose.yml`)
- npm

### 1. Clone and install
```bash
git clone https://github.com/kaziabidoff-gif/franchise-brand-management-system
cd FBMS
npm run install:all
```

### 2. Set up the database
```bash
# Option A: local MySQL
mysql -u root -p -e "CREATE DATABASE fbms"
mysql -u root -p fbms < database/schema.sql
mysql -u root -p fbms < database/seed.sql

# Option B: Docker
docker-compose up -d
mysql -h 127.0.0.1 -u root -proot fbms < database/schema.sql
mysql -h 127.0.0.1 -u root -proot fbms < database/seed.sql
```

Then apply any migrations in `database/migrations/`, in order, if you're setting up against an older schema dump.

### 3. Configure environment variables

`backend/.env`
```
NODE_ENV=development
PORT=4000
CLIENT_URL=http://localhost:5173

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=fbms

JWT_SECRET=replace-this-with-a-long-random-secret
JWT_EXPIRES_IN=1d
JWT_COOKIE_NAME=fbms_token
```

`frontend/.env`
```
VITE_API_URL=http://127.0.0.1:4000/api
```

### 4. Run it
```bash
npm run dev:backend   # http://127.0.0.1:4000
npm run dev:frontend  # http://localhost:5173
```

## Demo accounts

All seeded accounts use the password `Admin123`.

| Email | Role |
|---|---|
| admin@fbms.com | Super Admin |
| manager@fbms.com | Brand Manager |
| marketing@fbms.com | Marketing Executive |
| designer@fbms.com | Graphic Designer |
| branch@fbms.com | Branch Manager |

## API overview

All endpoints are under `/api`, JWT-protected except `/auth/login` and `/health`.

```
/auth            login, logout, current session
/users           user & role management
/branches        branch management
/assets          brand asset management
/campaigns       campaign management
/guidelines      branding guidelines
/requests        customization requests (submit, assign, approve, reject, revise)
/notifications   per-user notifications
/todos           personal to-do list
/reports         aggregated reporting data
/dashboard       role-aware dashboard payload
/profile         current user's profile
```

## Team

Built by a 4-person team for CSE470:

- **Kazi Abiduzzaman** — Team lead. System architecture, authentication, user & role management, the role-based dashboard, the notification and activity-log system, and integrating every teammate's feature branch into one working system.
- **Branch & Brand Asset Management** — Arfin Zaman
- **Campaign Management** — Labiba Rahman
- **Customization Requests** — Mir Masoor Ahmed

## License

Academic project — built for coursework, not licensed for production use.
