import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { listEmployees, createEmployee, updateEmployee, deleteEmployee } from './api';
import EmployeeTable from './components/EmployeeTable';
import EmployeeForm from './components/EmployeeForm';
import EmployeeDetail from './components/EmployeeDetail';

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detail, setDetail] = useState(null);
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listEmployees({ search, status });
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  // debounce so typing in search does not fire a request per keystroke
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 3000);
    return () => clearTimeout(t);
  }, [notice]);

  const stats = useMemo(() => ({
    total: employees.length,
    active: employees.filter((e) => e.status === 'Active').length,
    inactive: employees.filter((e) => e.status === 'Inactive').length
  }), [employees]);

  async function handleSave(values) {
    if (editing) {
      await updateEmployee(editing._id, values);
      setNotice('Employee updated');
    } else {
      await createEmployee(values);
      setNotice('Employee added');
    }
    setFormOpen(false);
    setEditing(null);
    await load();
  }

  async function handleDelete(emp) {
    if (!window.confirm(`Delete "${emp.name}"? This cannot be undone.`)) return;
    try {
      await deleteEmployee(emp._id);
      setNotice('Employee deleted');
      if (detail && detail._id === emp._id) setDetail(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h1>Employee Management</h1>
          <p className="sub">Manage employee records</p>
        </div>
        <button
          className="btn primary"
          onClick={() => { setEditing(null); setFormOpen(true); }}
        >
          + Add Employee
        </button>
      </header>

      <section className="stats">
        <div className="stat">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat">
          <span className="stat-value">{stats.active}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat">
          <span className="stat-value">{stats.inactive}</span>
          <span className="stat-label">Inactive</span>
        </div>
      </section>

      <section className="toolbar">
        <input
          className="search"
          placeholder="Search by name, email, phone, department or designation"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        {(search || status) && (
          <button
            className="btn"
            onClick={() => { setSearch(''); setStatus(''); }}
          >
            Clear
          </button>
        )}
      </section>

      {error && (
        <div className="alert error">
          <span>{error}</span>
          <button className="btn small" onClick={load}>Retry</button>
        </div>
      )}
      {notice && <div className="alert success">{notice}</div>}

      <EmployeeTable
        employees={employees}
        loading={loading}
        onView={setDetail}
        onEdit={(emp) => { setEditing(emp); setFormOpen(true); }}
        onDelete={handleDelete}
      />

      {formOpen && (
        <EmployeeForm
          initial={editing}
          onCancel={() => { setFormOpen(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}

      {detail && (
        <EmployeeDetail
          employee={detail}
          onClose={() => setDetail(null)}
        />
      )}
    </div>
  );
}
