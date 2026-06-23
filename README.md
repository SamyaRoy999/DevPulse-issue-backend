# DevPulse

A collaborative issue tracking platform for software teams to report bugs, suggest features, and coordinate resolutions.

**Live URL:** https://devpulse-nine-black.vercel.app

---

## Features

- User registration and login with JWT authentication
- Role-based access control (contributor & maintainer)
- Create, view, update, and delete issues
- Filter issues by type and status
- Sort issues by newest or oldest
- Secure password hashing with bcrypt
- Serverless PostgreSQL via Neon

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js (LTS) | Runtime environment |
| TypeScript | Type-safe development |
| Express.js | Web framework |
| PostgreSQL (Neon) | Relational database |
| Raw SQL | Direct pool.query() — no ORM |
| bcrypt | Password hashing |
| jsonwebtoken | JWT auth tokens |
| tsup | TypeScript bundler |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/SamyaRoy999/DevPulse-issue-backend.git
cd assinment_2
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file in the project root

```env
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_jwt_secret
PORT=5000
REFRESH_SECRET="superman"
```
## API Endpoints

### Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT token |

### Issues

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/issues` | Authenticated | Create a new issue |
| GET | `/api/issues` | Public | Get all issues (with filters) |
| GET | `/api/issues/:id` | Public | Get a single issue by ID |
| PATCH | `/api/issues/:id` | Authenticated | Update an issue |
| DELETE | `/api/issues/:id` | Maintainer only | Delete an issue |

### Query Parameters for `GET /api/issues`

| Param | Values | Default |
|-------|--------|---------|
| `sort` | `newest`, `oldest` | `newest` |
| `type` | `bug`, `feature_request` | none |
| `status` | `open`, `in_progress`, `resolved` | none |

**Example:**
```
GET /api/issues?sort=oldest&type=bug&status=open
```

### Authorization Header Format

```
Authorization: <jwt_token>
```

---

## Database Schema

### `users` table

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PRIMARY KEY | Auto-increment unique ID |
| name | VARCHAR(100) | Full name of the user |
| email | VARCHAR(255) UNIQUE | Login email address |
| password | TEXT | Bcrypt hashed password |
| role | VARCHAR(20) | `contributor` or `maintainer` (default: `contributor`) |
| created_at | TIMESTAMP | Account creation time |
| updated_at | TIMESTAMP | Last update time |

### `issues` table

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PRIMARY KEY | Auto-increment unique ID |
| title | VARCHAR(150) | Short issue headline |
| description | TEXT | Detailed explanation (min 20 chars) |
| type | VARCHAR(20) | `bug` or `feature_request` |
| status | VARCHAR(20) | `open`, `in_progress`, `resolved` (default: `open`) |
| reporter_id | INT | ID of the user who created the issue |
| created_at | TIMESTAMP | Issue creation time |
| updated_at | TIMESTAMP | Last update time |

---

## User Roles & Permissions

| Permission | Contributor | Maintainer |
|------------|-------------|------------|
| Register & Login | ✅ | ✅ |
| Create issues | ✅ | ✅ |
| View all issues | ✅ | ✅ |
| Update own issue (status must be `open`) | ✅ | ✅ |
| Update any issue | ❌ | ✅ |
| Delete any issue | ❌ | ✅ |
| Change issue status | ❌ | ✅ |
