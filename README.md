# Employee Tracker Backend

Node.js + Express + MongoDB API for managing Employees and Tasks.

## Features

- Employees: CRUD (`/employees`) with search, sort, pagination
- Tasks: CRUD (`/tasks`) with filters (status, assignedTo), search, sort, pagination
- Tasks for an employee: `GET /employees/:id/tasks`
- Validation with `express-validator`
- Centralized JSON error handling

## Repository

- GitHub: https://github.com/nikhileshwar-perumalla/Employee_Tracker_backend

## Quick Start

1. Copy env file and set Mongo URI

```bash
cp .env.example .env
# edit .env to set MONGODB_URI and PORT (optional)
```

2. Install dependencies

```bash
npm install
```

3. Run in dev mode

```bash
npm run dev
```

Health check: `GET http://localhost:4000/health`

### Scripts

- `npm run dev`: start with nodemon (auto-restart on changes)
- `npm start`: start with node (production)

### Environment Variables

- `MONGODB_URI` (required): MongoDB connection string (e.g., local or Atlas)
- `PORT` (optional): API port (default `4000`)

## API Overview

### Employees

- `GET /employees` — list with `page`, `limit`, `sort`, `search`
- `GET /employees/:id` — get by id
- `POST /employees` — create `{ name, email, role, department }`
- `PUT|PATCH /employees/:id` — update any of the above
- `DELETE /employees/:id` — delete
- `GET /employees/:id/tasks` — list tasks; supports `status`, `search`, `page`, `limit`, `sort`

### Tasks

- `GET /tasks` — list with `status`, `assignedTo`, `search`, `page`, `limit`, `sort`
- `GET /tasks/:id` — get by id
- `POST /tasks` — create `{ title, description?, assignedTo, status?, priority?, dueDate? }`
- `PUT|PATCH /tasks/:id` — update
- `DELETE /tasks/:id` — delete

### Query Parameters

- `search`: partial match (case-insensitive) on employees: name/email/role/department; tasks: title/description
- `sort`: comma-separated fields (prefix with `-` for descending). Examples: `sort=-createdAt,name` or `sort=status,-dueDate`
- `page`: page number (1+), `limit`: items per page (1-100)

### Status & Priority

- Task `status`: `Pending | In Progress | Completed`
- Task `priority`: `Low | Medium | High` (optional)

## Notes

- Requires MongoDB; set `MONGODB_URI` in `.env`
- All errors are JSON with HTTP status codes
- IDs must be valid Mongo ObjectIds

