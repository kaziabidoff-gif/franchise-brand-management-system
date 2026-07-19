# 🏢 Franchise Brand Management System (FBMS)

> A centralized web-based platform for managing franchise branding, marketing campaigns, brand assets, branch customization requests, and brand consistency across multiple franchise locations.

---

## 📌 Project Overview

The **Franchise Brand Management System (FBMS)** is a centralized platform designed to help franchise headquarters manage and maintain consistent branding across all franchise branches.

The system allows headquarters to manage:

- Brand assets
- Marketing campaigns
- Branding guidelines
- Franchise branches
- Customization requests
- Approved promotional materials
- Branch-level branding activities

Franchise branches can access approved brand materials, submit customization requests, and follow official branding guidelines provided by headquarters.

The main goal of FBMS is to ensure that every franchise branch maintains a consistent and professional brand identity while allowing controlled customization where necessary.

---

## 🎯 Project Goals

- Centralize franchise branding resources.
- Maintain consistent brand identity across branches.
- Provide controlled access to approved brand assets.
- Manage marketing campaigns from headquarters.
- Allow branches to request customized branding materials.
- Track branch requests and approval status.
- Provide a centralized dashboard for monitoring franchise activities.
- Reduce communication gaps between headquarters and franchise branches.

---

## ✨ Main Features

### 🔐 Authentication & User Management

- Secure user login.
- Role-based access control.
- User profiles.
- Multiple user roles.
- JWT-based authentication.
- Protected routes.

### 🏢 Franchise Branch Management

- View franchise branches.
- Manage branch information.
- Assign branch users.
- Monitor branch activities.

### 🎨 Brand Asset Management

- Upload brand assets.
- Organize assets by category.
- Download approved brand materials.
- Manage asset versions.
- Control asset visibility.

### 📢 Marketing Campaign Management

- Create marketing campaigns.
- Assign campaigns to branches.
- Set campaign dates.
- Track campaign status.
- Manage campaign materials.

### 📖 Branding Guidelines

- Centralized brand guidelines.
- Logo usage rules.
- Color guidelines.
- Typography guidelines.
- Marketing usage guidelines.

### 📝 Customization Requests

- Branches can submit branding customization requests.
- Headquarters can review requests.
- Requests can be approved or rejected.
- Track request status.
- Add feedback and comments.

### 📊 Dashboard

- Summary statistics.
- Branch overview.
- Campaign overview.
- Pending requests.
- Recent activities.

---

# 🛠️ Technology Stack

## Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router

## Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt
- REST API

## Database

- MySQL

## Development Tools

- Git
- GitHub
- VS Code
- Postman / cURL
- MySQL Workbench or MySQL CLI

---

# 📂 Project Structure

```text
franchise-brand-management-system/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   │
│   │   ├── controllers/
│   │   │   └── auth.controller.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── error.middleware.js
│   │   │
│   │   ├── models/
│   │   │   └── user.model.js
│   │   │
│   │   ├── routes/
│   │   │   └── auth.routes.js
│   │   │
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   └── asyncHandler.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
├── .gitignore
├── README.md
├── docker-compose.yml
└── package.json

⚙️ Prerequisites

Before installing FBMS, install the following:

Required

* Node.js
* npm
* MySQL
* Git

Check whether they are installed:

node -v
npm -v
mysql --version
git --version

Recommended:

Node.js: 18+
npm: 9+
MySQL: 8+

⸻

📥 1. Clone the Repository

Clone the project:

git clone https://github.com/kaziabidoff-gif/franchise-brand-management-system.git

Navigate into the project:

cd franchise-brand-management-system

⸻

📦 2. Install Dependencies

Install root dependencies:

npm install

Install backend dependencies:

cd backend
npm install

Install frontend dependencies:

cd ../frontend
npm install

Return to the project root:

cd ..

⸻

🗄️ 3. Create the MySQL Database

Make sure your MySQL server is running.

You can check MySQL:

mysql -u root -p

⸻

Create the Database Using schema.sql

From the project root, run:

mysql -u root -p < database/schema.sql

Enter your MySQL password when prompted.

The schema file is responsible for creating the database structure, including tables, relationships, constraints, and other database objects.

⸻

Insert Initial Data Using seed.sql

After the database has been created, run:

mysql -u root -p fbms < database/seed.sql

The seed file inserts initial data required for development and testing.

This may include:

* Roles
* Permissions
* Users
* Branches
* Sample campaigns
* Sample brand assets
* Other development data

⸻

Alternative: Using MySQL CLI

You can also enter MySQL:

mysql -u root -p

Then run:

SOURCE database/schema.sql;
SOURCE database/seed.sql;

If the files are located outside the current directory, provide their full path.

Example:

SOURCE /Users/yourname/path/to/FBMS/database/schema.sql;
SOURCE /Users/yourname/path/to/FBMS/database/seed.sql;

⸻

🔐 4. Create the Backend .env File

The actual .env file is intentionally not included in GitHub because it may contain passwords and secret keys.

Navigate to the backend:

cd backend

Create a new .env file:

touch .env

Add the required environment variables.

Example:

NODE_ENV=development
PORT=4000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=0000
DB_NAME=fbms
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=1d
JWT_COOKIE_NAME=fbms_token

Important

Change:

DB_PASSWORD=0000

to your own MySQL password.

Also use your own secure JWT secret:

JWT_SECRET=your_secret_key_here

Do not commit the actual .env file to GitHub.

⸻

🌐 5. Create the Frontend .env File

Navigate to the frontend:

cd ../frontend

Create the file:

touch .env

Add:

VITE_API_URL=http://localhost:4000/api

The frontend uses this URL to communicate with the backend API.

⸻

🚀 6. Start the Backend

Open a terminal and navigate to the backend:

cd backend

Start the development server:

npm run dev

The backend should run at:

http://localhost:4000

Test the API:

curl http://localhost:4000/api/health

Expected response:

{
  "status": "ok"
}

⸻

💻 7. Start the Frontend

Open a second terminal.

Navigate to the frontend:

cd frontend

Start Vite:

npm run dev

The frontend should be available at:

http://localhost:5173

Open the URL in your browser.

⸻

🔑 8. Test Login

The seed data should provide development accounts.

Example:

Email: admin@fbms.com
Password: Admin123

If the seed file uses different credentials, use the credentials defined in database/seed.sql.

⸻

🔄 Running the Full Application

You need two terminals.

Terminal 1 — Backend

cd backend
npm run dev

Terminal 2 — Frontend

cd frontend
npm run dev

Then open:

http://localhost:5173

⸻

🔌 API Structure

The backend API is available at:

http://localhost:4000/api

Example endpoints:

POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
GET  /api/health

Authentication uses JWT.

After login, the frontend stores the authentication token and sends it with API requests using the Authorization header:

Authorization: Bearer <token>

⸻

🧪 Development Workflow

Before starting work:

git checkout main
git pull origin main

Create a feature branch:

git checkout -b feature/your-feature-name

Example:

git checkout -b feature/campaign-management

Work on your assigned feature.

Check your changes:

git status

Commit:

git add .
git commit -m "feat: add campaign management"

Push your branch:

git push origin feature/campaign-management

Then create a Pull Request on GitHub.

⸻

⚠️ Important Git Rules

Do not work directly on the main branch for feature development.

Before starting new work:

git checkout main
git pull origin main

Always create a feature branch.

Do not commit:

.env
node_modules/
dist/

Never commit:

* Database passwords
* JWT secrets
* API keys
* Personal credentials

⸻

👥 Team Workflow Documentation

The complete team workflow and feature distribution can be found here:

FBMS Team Workflow Document

⸻

📚 Team Development Context

The following documents contain the development context and responsibilities for individual team members.

Kazi Abiduzzaman

Open Kazi’s Development Context

Labiba Rahman

Open Labiba’s Development Context

Arfin Zaman

Open Arfin’s Development Context

Mir Masoor Ahmed

Open Mir Masoor’s Development Context

⸻

🏃 Scrum Sprint Plan

Sprint 1

Completed.

Deliverable:

* Software Requirements Specification (SRS)

Sprint 2

Deadline:

24 July

Goal:

* Complete approximately half of the website
* Complete assigned core features
* Ensure major features are functional and showcaseable

Sprint 3

Goal:

* Complete remaining features
* Integrate all modules
* Fix bugs
* Improve UI and functionality

Sprint 4

Goal:

* Final testing
* System integration
* Documentation
* Final presentation and showcase

⸻

🐛 Troubleshooting

Backend Does Not Start

Check:

node -v
npm install

Check whether port 4000 is already being used:

lsof -i :4000

Kill a process if necessary:

kill -9 PROCESS_ID

Replace PROCESS_ID with the actual number.

⸻

Frontend Uses the Wrong Port

Check whether port 5173 is already being used:

lsof -i :5173

Kill the process:

kill -9 PROCESS_ID

Then restart:

npm run dev

⸻

Database Connection Error

Verify:

1. MySQL is running.
2. Database fbms exists.
3. The credentials in backend/.env are correct.
4. The MySQL port is correct.

Test:

mysql -u root -p

⸻

CORS Error

Make sure the frontend URL matches the backend CORS configuration.

The default development frontend URL is:

http://localhost:5173

The backend API is:

http://localhost:4000

⸻

📄 License

This project is developed for academic and educational purposes.
