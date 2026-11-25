import React from 'react';

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

// data-label attributes power the mobile card layout in index.css
export default function EmployeeTable({ employees, loading, onView, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="table-card">
        <p className="muted pad">Loading employees...</p>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="table-card">
        <p className="muted pad">
          No employees found. Add your first employee to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="table-card">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Joining Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td className="strong" data-label="Name">{emp.name}</td>
              <td data-label="Email">{emp.email}</td>
              <td data-label="Phone">{emp.phone}</td>
              <td data-label="Department">{emp.department}</td>
              <td data-label="Designation">{emp.designation}</td>
              <td data-label="Joined">{formatDate(emp.joiningDate)}</td>
              <td data-label="Status">
                <span className={`badge ${emp.status === 'Active' ? 'active' : 'inactive'}`}>
                  {emp.status}
                </span>
              </td>
              <td className="actions" data-label="Actions">
                <button className="link" onClick={() => onView(emp)}>View</button>
                <button className="link" onClick={() => onEdit(emp)}>Edit</button>
                <button className="link danger" onClick={() => onDelete(emp)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
