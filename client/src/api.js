const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // response was not JSON
  }

  if (!res.ok) {
    const error = new Error(data?.message || `Request failed (${res.status})`);
    error.status = res.status;
    error.errors = data?.errors;
    throw error;
  }
  return data;
}

export function listEmployees(params = {}) {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  if (params.status) qs.set('status', params.status);
  const query = qs.toString();
  return request(`/employees${query ? `?${query}` : ''}`);
}

export function getEmployee(id) {
  return request(`/employees/${id}`);
}

export function createEmployee(data) {
  return request('/employees', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function updateEmployee(id, data) {
  return request(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export function deleteEmployee(id) {
  return request(`/employees/${id}`, { method: 'DELETE' });
}
