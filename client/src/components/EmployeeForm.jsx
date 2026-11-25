import React, { useState } from 'react';

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  department: '',
  designation: '',
  joiningDate: '',
  status: 'Active'
};

const DEPARTMENTS = [
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'Finance',
  'HR',
  'Operations'
];

export default function EmployeeForm({ initial, onSave, onCancel }) {
  const editing = Boolean(initial);
  const [values, setValues] = useState(() =>
    initial
      ? { ...EMPTY, ...initial, joiningDate: initial.joiningDate ? String(initial.joiningDate).slice(0, 10) : '' }
      : EMPTY
  );
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  function set(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
    setFieldErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const errors = {};
    if (!values.name.trim()) errors.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      errors.email = 'Enter a valid email';
    }
    if (!/^[0-9+\-\s]{8,15}$/.test(values.phone.trim())) {
      errors.phone = 'Enter a valid phone number';
    }
    if (!values.department) errors.department = 'Department is required';
    if (!values.designation.trim()) errors.designation = 'Designation is required';
    if (!values.joiningDate) errors.joiningDate = 'Joining date is required';
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    const errors = validate();
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    setSaving(true);
    try {
      await onSave({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        phone: values.phone.trim(),
        department: values.department,
        designation: values.designation.trim(),
        joiningDate: values.joiningDate,
        status: values.status
      });
    } catch (err) {
      setFormError(err.message || 'Something went wrong');
      if (err.errors) setFieldErrors(err.errors);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-head">
          <h2>{editing ? 'Edit Employee' : 'Add Employee'}</h2>
          <button type="button" className="link" onClick={onCancel}>Close</button>
        </div>

        {formError && <div className="alert error pad-20">{formError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <Field label="Full Name" error={fieldErrors.name}>
              <input
                value={values.name}
                onChange={(e) => set('name', e.target.value)}
                autoFocus
              />
            </Field>

            <Field label="Email" error={fieldErrors.email}>
              <input
                type="email"
                value={values.email}
                onChange={(e) => set('email', e.target.value)}
              />
            </Field>

            <Field label="Phone Number" error={fieldErrors.phone}>
              <input
                type="tel"
                value={values.phone}
                onChange={(e) => set('phone', e.target.value)}
              />
            </Field>

            <Field label="Department" error={fieldErrors.department}>
              <select
                value={values.department}
                onChange={(e) => set('department', e.target.value)}
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </Field>

            <Field label="Designation" error={fieldErrors.designation}>
              <input
                value={values.designation}
                onChange={(e) => set('designation', e.target.value)}
              />
            </Field>

            <Field label="Joining Date" error={fieldErrors.joiningDate}>
              <input
                type="date"
                value={values.joiningDate}
                onChange={(e) => set('joiningDate', e.target.value)}
              />
            </Field>

            <Field label="Status" error={fieldErrors.status}>
              <select
                value={values.status}
                onChange={(e) => set('status', e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </Field>
          </div>

          <div className="modal-foot">
            <button type="button" className="btn" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn primary" disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}
