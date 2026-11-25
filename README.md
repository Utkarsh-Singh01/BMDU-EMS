# Employee Management System

A full-stack MERN application for managing employee records through a responsive admin dashboard.

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)

## Features

- Responsive dashboard with summary cards (total, active, inactive employees)
- Employee table with search and status filters
- Add, edit and delete employee records
- Employee details view
- Validation on both client and server side
- Loading states and API error handling
- Responsive layout — the employee table adapts to a card view on mobile

## Project Structure

```
bmdu-ems/
├── server/                      # Express REST API
│   ├── config/db.js             # MongoDB connection
│   ├── controllers/             # Request handlers (business logic)
│   │   └── employeeController.js
│   ├── middleware/              # Request validation
│   │   └── employeeValidation.js
│   ├── models/                  # Mongoose schemas
│   │   └── Employee.js
│   ├── routes/                  # URL -> controller mapping
│   │   └── employeeRoutes.js
│   ├── utils/asyncHandler.js    # Async error handling helper
│   └── server.js                # App entry and error handling
└── client/                      # React frontend (Vite)
    └── src/
        ├── api.js               # API client
        ├── App.jsx
        └── components/          # Table, form and details modal
```

## Prerequisites

- Node.js 18 or later
- MongoDB — either a local instance or a free MongoDB Atlas cluster

## Setup

### 1. Database

Use a local MongoDB instance, or create a free cluster on
[MongoDB Atlas](https://www.mongodb.com/atlas) and copy the connection string.

### 2. Server

```bash
cd server
npm install
cp .env.example .env       # Windows: copy .env.example .env
```

Edit `.env` and set `MONGODB_URI`:

```
MONGODB_URI=mongodb://127.0.0.1:27017/bmdu_ems
# or your MongoDB Atlas connection string
```

Start the API:

```bash
npm run dev        # development (auto-restart)
# or
npm start
```

The API runs on http://localhost:5000.

### 3. Client

```bash
cd client
npm install
npm run dev
```

The app runs on http://localhost:5173 and proxies `/api` requests to the server,
so no CORS configuration is needed in development.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/employees | List employees (supports `?search=` and `?status=`) |
| GET | /api/employees/:id | Get a single employee |
| POST | /api/employees | Create an employee |
| PUT | /api/employees/:id | Update an employee |
| DELETE | /api/employees/:id | Delete an employee |

All endpoints return JSON. Validation failures return `400` with field-level
errors, duplicate emails return `409`, and missing records return `404`.

## Testing Checklist

- [x] Create employee
- [x] Search by name / email / phone
- [x] Filter by status (Active / Inactive)
- [x] Update employee
- [x] Delete employee
- [x] Invalid form data shows validation errors
- [x] Duplicate email is rejected
