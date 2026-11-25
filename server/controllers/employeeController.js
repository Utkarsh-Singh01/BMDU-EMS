const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const asyncHandler = require('../utils/asyncHandler');
const { escapeRegex, STATUS_VALUES } = require('../middleware/employeeValidation');

// GET /api/employees?search=&status=
exports.listEmployees = asyncHandler(async (req, res) => {
  const { search, status } = req.query;
  const query = {};

  if (status) {
    if (!STATUS_VALUES.includes(status)) {
      return res.status(400).json({ message: 'status must be Active or Inactive' });
    }
    query.status = status;
  }
  if (search && String(search).trim()) {
    const rx = new RegExp(escapeRegex(String(search).trim()), 'i');
    query.$or = [
      { name: rx },
      { email: rx },
      { phone: rx },
      { department: rx },
      { designation: rx }
    ];
  }

  const employees = await Employee.find(query).sort({ createdAt: -1 });
  res.json(employees);
});

// POST /api/employees
exports.createEmployee = asyncHandler(async (req, res) => {
  const email = String(req.body.email).trim().toLowerCase();

  const existing = await Employee.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'An employee with this email already exists' });
  }

  const employee = await Employee.create({ ...req.body, email });
  res.status(201).json(employee);
});

// GET /api/employees/:id
exports.getEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid employee id' });
  }
  const employee = await Employee.findById(id);
  if (!employee) {
    return res.status(404).json({ message: 'Employee not found' });
  }
  res.json(employee);
});

// PUT /api/employees/:id
exports.updateEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid employee id' });
  }

  if (req.body.email !== undefined) {
    const email = String(req.body.email).trim().toLowerCase();
    const existing = await Employee.findOne({ email, _id: { $ne: id } });
    if (existing) {
      return res.status(409).json({ message: 'An employee with this email already exists' });
    }
  }

  const updates = { ...req.body };
  if (updates.email) updates.email = String(updates.email).trim().toLowerCase();
  if (updates.name) updates.name = String(updates.name).trim();
  if (updates.phone) updates.phone = String(updates.phone).trim();
  if (updates.designation) updates.designation = String(updates.designation).trim();

  const employee = await Employee.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true
  });
  if (!employee) {
    return res.status(404).json({ message: 'Employee not found' });
  }
  res.json(employee);
});

// DELETE /api/employees/:id
exports.deleteEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid employee id' });
  }
  const employee = await Employee.findByIdAndDelete(id);
  if (!employee) {
    return res.status(404).json({ message: 'Employee not found' });
  }
  res.json({ message: 'Employee deleted', id });
});
