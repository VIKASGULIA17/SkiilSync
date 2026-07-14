const API_BASE = '/api';

async function request(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE}${url}`, config);

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorData.error || errorMessage;
      } catch {
        // response wasn't JSON
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the server. Please make sure the backend is running.');
    }
    throw error;
  }
}

export async function analyzeResume(file) {
  const formData = new FormData();
  formData.append('file', file);
  return request('/analyze', {
    method: 'POST',
    body: formData,
  });
}

export async function analyzeLinkedinProfile(url) {
  return request('/analyze/linkedin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
}

export async function getAnalysisFeedback(resumeText, role, missingSkills) {
  return request('/analyze/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      resume_text: resumeText,
      role,
      missing_skills: missingSkills,
    }),
  });
}

export async function analyzeForRole(resumeText, role) {
  return request('/analyze/role', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      resume_text: resumeText,
      role,
    }),
  });
}

export async function getJobs(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.experience) params.set('experience', filters.experience);
  if (filters.search) params.set('search', filters.search);
  if (filters.platform) params.set('platform', filters.platform);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.per_page) params.set('per_page', String(filters.per_page));
  const query = params.toString();
  return request(`/jobs${query ? `?${query}` : ''}`);
}

export async function refreshJobs() {
  return request('/jobs/refresh', { method: 'POST' });
}

export async function getJobStatus() {
  return request('/jobs/status');
}

export async function getRoles() {
  return request('/roles');
}

export async function setApiKey(apiKey) {
  return request('/settings/api-key', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: apiKey }),
  });
}

export async function getApiKeyStatus() {
  return request('/settings/api-key/status');
}

export async function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export async function signup(email, password, fullName) {
  return request('/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, full_name: fullName }),
  });
}

export async function getMe() {
  return request('/auth/me');
}
