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

bmdu-ems/
├── server/ # Express REST API
│ ├── config/db.js # MongoDB connection
│ ├── controllers/ # Request handlers (business logic)
│ │ └── employeeController.js
│ ├── middleware/ # Request validation
│ │ └── employeeValidation.js
│ ├── models/ # Mongoose schemas
│ │ └── Employee.js
│ ├── routes/ # URL -> controller mapping
│ │ └── employeeRoutes.js
│ ├── utils/asyncHandler.js # Async error handling helper
│ └── server.js # App entry and error handling
└── client/ # React frontend (Vite)
└── src/
├── api.js # API client
├── App.jsx
└── components/ # Table, form and details modal
