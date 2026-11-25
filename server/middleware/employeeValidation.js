const STATUS_VALUES = ['Active', 'Inactive'];

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function collectErrors(data, { partial = false } = {}) {
  const errors = {};
  const provided = (key) => data[key] !== undefined;

  if (!partial || provided('name')) {
    if (!data.name || !String(data.name).trim()) {
      errors.name = 'Name is required';
    } else if (String(data.name).trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
  }
  if (!partial || provided('email')) {
    const email = data.email ? String(data.email).trim().toLowerCase() : '';
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email format';
    }
  }
  if (!partial || provided('phone')) {
    const phone = data.phone ? String(data.phone).trim() : '';
    if (!phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s]{8,15}$/.test(phone)) {
      errors.phone = 'Phone number must be 8-15 digits';
    }
  }
  if (!partial || provided('department')) {
    if (!data.department || !String(data.department).trim()) {
      errors.department = 'Department is required';
    }
  }
  if (!partial || provided('designation')) {
    if (!data.designation || !String(data.designation).trim()) {
      errors.designation = 'Designation is required';
    }
  }
  if (!partial || provided('joiningDate')) {
    if (!data.joiningDate) {
      errors.joiningDate = 'Joining date is required';
    } else if (Number.isNaN(Date.parse(data.joiningDate))) {
      errors.joiningDate = 'Invalid joining date';
    }
  }
  if (data.status !== undefined && data.status !== null && data.status !== '') {
    if (!STATUS_VALUES.includes(data.status)) {
      errors.status = 'Status must be Active or Inactive';
    }
  }
  return errors;
}

// Full validation for POST /api/employees
function validateCreate(req, res, next) {
  const errors = collectErrors(req.body);
  if (Object.keys(errors).length) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  next();
}

// Partial validation for PUT /api/employees/:id
function validateUpdate(req, res, next) {
  const errors = collectErrors(req.body, { partial: true });
  if (Object.keys(errors).length) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  next();
}

module.exports = { validateCreate, validateUpdate, escapeRegex, STATUS_VALUES };
