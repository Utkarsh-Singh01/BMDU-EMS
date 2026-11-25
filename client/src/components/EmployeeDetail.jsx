import React from 'react';

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function Row({ label, value }) {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span>{value}</span>
    </div>
  );
}

export default function EmployeeDetail({ employee, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{employee.name}</h2>
          <button type="button" className="link" onClick={onClose}>Close</button>
        </div>
        <div className="detail-body">
          <Row label="Email" value={employee.email} />
          <Row label="Phone" value={employee.phone} />
          <Row label="Department" value={employee.department} />
          <Row label="Designation" value={employee.designation} />
          <Row label="Joining Date" value={formatDate(employee.joiningDate)} />
          <Row
            label="Status"
            value={
              <span className={`badge ${employee.status === 'Active' ? 'active' : 'inactive'}`}>
                {employee.status}
              </span>
            }
          />
          <Row label="Added On" value={formatDate(employee.createdAt)} />
        </div>
      </div>
    </div>
  );
}
