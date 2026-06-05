const rawApiUrl = import.meta.env.VITE_API_URL?.trim();

const API_URL = rawApiUrl
  ? rawApiUrl.endsWith('/api')
    ? rawApiUrl.replace(/\/$/, '')
    : `${rawApiUrl.replace(/\/$/, '')}/api`
  : '/api';

export const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDesc = response.statusText;
    try {
      const errorData = await response.json();
      errorDesc = errorData.message || errorData.error || errorDesc;
    } catch(e) {}
    const error = new Error(`${response.status} ${errorDesc}`);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }
  
  // Some endpoints might return text instead of JSON
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    return response.text();
  }
};

export const api = {
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  
  getMe: () => request('/users/me'),
  updateProfile: (data) => request('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
  setPin: (pin) => request('/users/set-pin', { method: 'PATCH', body: JSON.stringify({ pin }) }),
  getPinStatus: () => request('/users/pin-status'),
  verifyPin: (pin) => request('/users/verify-pin', { method: 'POST', body: JSON.stringify({ pin }) }),
  
  getAccounts: () => request('/accounts'),
  getAccount: (id) => request(`/accounts/${id}`),
  createAccount: () => request('/accounts/open-new', { method: 'POST', body: '"SAVINGS"' }),
  deleteAccount: (id) => request(`/accounts/${id}`, { method: 'DELETE' }),
  
  deposit: (id, amount, pin) => request(`/accounts/${id}/deposit`, { method: 'PUT', body: JSON.stringify({ amount, pin }) }),
  withdraw: (id, amount, pin) => request(`/accounts/${id}/withdraw`, { method: 'PUT', body: JSON.stringify({ amount, pin }) }),
  transfer: (data) => request(`/accounts/transfer`, { method: 'POST', body: JSON.stringify(data) }),
  
  getTransactions: (id) => request(`/accounts/${id}/transactions`),
  
  getMyFDs: () => request('/fd/my-fds'),
  getFDDetails: (id) => request(`/fd/${id}`),
  
  createFD: (data) => request('/fd/create', { method: 'POST', body: JSON.stringify(data) }),

  getLoans: () => request('/loans/my-loans'),
  applyLoan: (data) => request('/loans/apply', { method: 'POST', body: JSON.stringify(data) }),
  repayLoan: (id, amount, pin) => request(`/loans/${id}/repay`, { method: 'POST', body: JSON.stringify({ amount, pin }) })
};
