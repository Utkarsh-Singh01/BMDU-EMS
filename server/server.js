require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/employees', employeeRoutes);

// 404 for unknown API routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// centralized error handler
app.use((err, req, res, next) => {
  console.error(err);

  let status = err.statusCode || err.status || 500;
  let message = err.message || 'Internal server error';
  let errors;

  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation failed';
    errors = {};
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });
  } else if (err.code === 11000) {
    status = 409;
    message = 'An employee with this email already exists';
  } else if (err.name === 'CastError') {
    status = 400;
    message = `Invalid value for ${err.path}`;
  }

  if (status >= 500 && process.env.NODE_ENV !== 'test') {
    message = 'Internal server error';
  }

  res.status(status).json(errors ? { message, errors } : { message });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;
