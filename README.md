# SecureLife Insurance PLC — CRM System & Public Portal

A modern, full-stack PERN (PostgreSQL, Express, React, Node.js) application built for SecureLife Insurance PLC. The system integrates a public customer portal with an internal staff CRM for lead management, advisor workload tracking, insurance plan administration, and smart plan recommendation matching.

---

## 🌟 Key Features

### 1. Public Customer Website
- **Landing Page**: Modern hero section highlighting insurance products and assurance details.
- **Insurance Plans Showcase**: Display active policy tiers (Basic, Gold, Premium) with age limits, coverage limits, policy terms, and benefits.
- **Lead Generation Quote Form**: "Get a Free Quote & Talk to an Advisor" form submitting directly to the CRM PostgreSQL database.

### 2. Internal Staff CRM
- **Dashboard & Analytics**: Visual layout matching modern CRM design with KPI cards (Total leads, Unassigned, Converted, Active plans), pipeline stage progress bars, recent activity log feed, and advisor workload leaderboard.
- **Lead Management Pipeline**: Interactive lead sheet supporting status progression (`NEW` → `CONTACTED` → `QUALIFIED` → `PLAN_RECOMMENDED` → `PROPOSAL` → `CONVERTED` / `LOST`), keyword search, and status/advisor filters.
- **Smart Plan Recommendation Engine**: Deterministic matching algorithm evaluating applicant age, coverage limit, policy term, and monthly budget against policy limits, generating match percentage scores and eligibility checklists.
- **Lead Activity & Audit Log**: Tracks lead state changes, advisor assignments, and timestamped internal notes.
- **Role-Based Access Control**:
  - `ADMIN`: Full access (system dashboard, lead sheet, advisor assignment, insurance plan creation/editing, staff account registration).
  - `ADVISOR`: Assigned lead workspace, lead status updates, lead notes, and profile view.
- **Security & Input Validation**: JWT authentication, `bcrypt` password hashing, `express-validator` input validation & HTML escaping, and parameterized SQL queries preventing SQL injection.

---

## 🛠️ Technology Stack

- **Frontend**: React (Create-React-App), React Router v7, Bootstrap 5, Lucide React Icons, Native Fetch API.
- **Backend**: Node.js, Express, `jsonwebtoken`, `bcrypt`, `express-validator`, `helmet`, `cors`.
- **Database**: PostgreSQL (`pg` connection pool, ENUM types, CHECK constraints, foreign key cascades).

---

## 🚀 Setup & Installation Instructions

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+) installed and running locally.

---

### Step 1: Configure Environment Variables

Navigate to the `server/` directory and check `.env`:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=securelife_crm
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=securelife_jwt_super_secret_key_2026
JWT_EXPIRES_IN=7d
```

---

### Step 2: Initialize & Seed the Database

Run the automated seed script to create the `securelife_crm` database, set up tables/ENUMs, and seed initial roles, staff accounts, insurance plans, and sample CRM leads:

```bash
cd server
npm run db:seed
```

---

### Step 3: Start Backend API Server

```bash
cd server
npm start
```
The server will start listening at `http://localhost:5000`.

---

### Step 4: Start Frontend React App

In a new terminal window:

```bash
cd client
npm start
```
The browser will open `http://localhost:3000`.

---

## 🔑 Demo Account Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@securelife.com` | `Password123!` | Full Admin CRM Management |
| **Advisor** | `advisor.david@securelife.com` | `Password123!` | Advisor Lead Workspace |
| **Advisor** | `advisor.john@securelife.com` | `Password123!` | Advisor Lead Workspace |

---

## 📁 AI Prompt Documentation

All prompt steps used during development are documented in [`PROMPT_DOCUMENTATION.md`](PROMPT_DOCUMENTATION.md).
