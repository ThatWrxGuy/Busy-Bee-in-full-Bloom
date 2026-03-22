import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', new URLSearchParams({ username: email, password })),

  signup: (email, password, fullName) =>
    api.post('/auth/signup', { email, password, full_name: fullName }),

  logout: () => api.post('/auth/logout'),

  getMe: () => api.get('/auth/me'),

  verifyEmail: (token) => api.post('/auth/verify', { token }),

  resetPassword: (email) => api.post('/auth/password-reset-request', { email }),

  resetPasswordConfirm: (token, newPassword) =>
    api.post('/auth/password-reset-confirm', { token, new_password: newPassword }),

  oauth: (provider) => api.get(`/auth/oauth/${provider}`),
};

// Dashboard API
export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard'),
  getOverview: () => api.get('/dashboard/overview'),
  getGoals: () => api.get('/dashboard/goals'),
  createGoal: (title, description) =>
    api.post('/dashboard/goals', null, { params: { title, description } }),
  updateGoal: (id, progress, status) =>
    api.patch(`/dashboard/goals/${id}`, null, { params: { progress, status } }),
  getTasks: (filter) => api.get('/dashboard/tasks', { params: { filter } }),
  createTask: (title, description, priority, dueDate) =>
    api.post('/dashboard/tasks', null, {
      params: { title, description, priority, due_date: dueDate },
    }),
  toggleTask: (id) => api.patch(`/dashboard/tasks/${id}/toggle`),
  getRecommendations: () => api.get('/dashboard/recommendations'),
  completeRecommendation: (id) => api.post(`/dashboard/recommendations/${id}/complete`),
  getDomainScores: () => api.get('/dashboard/domain-scores'),
  getMood: () => api.get('/dashboard/mood'),
  logMood: (mood, note) => api.post('/dashboard/mood', { mood, note }),
  getCalendar: () => api.get('/dashboard/calendar'),
  getCharts: () => api.get('/dashboard/charts'),
  getNotifications: () => api.get('/dashboard/notifications'),
  getQuickActions: () => api.get('/dashboard/quick-actions'),
};

// Finance API
export const financeAPI = {
  getAccounts: () => api.get('/finance/accounts'),
  linkAccount: (publicToken) => api.post('/finance/plaid/link', { public_token: publicToken }),
  getTransactions: (params) => api.get('/finance/transactions', { params }),
  getInsights: (days) => api.get('/finance/insights', { params: { days } }),
  getNetWorth: () => api.get('/finance/net-worth'),
  getMonthly: (months) => api.get('/finance/monthly', { params: { months } }),
  unlinkAccount: (id) => api.delete(`/finance/accounts/${id}`),
};

// Profile API
export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.patch('/profile', data),
  getSettings: () => api.get('/profile/settings'),
  updateSettings: (data) => api.patch('/profile/settings', data),
  changePassword: (currentPassword, newPassword) =>
    api.post('/profile/password', { current_password: currentPassword, new_password: newPassword }),
  getTwoFactorStatus: () => api.get('/profile/two-factor/status'),
  setupTwoFactor: () => api.get('/profile/two-factor/setup'),
  enableTwoFactor: (code) => api.post('/profile/two-factor/enable', { code }),
  disableTwoFactor: () => api.post('/profile/two-factor/disable'),
  getSessions: () => api.get('/profile/sessions'),
  revokeSession: (id) => api.delete(`/profile/sessions/${id}`),
  requestExport: () => api.post('/profile/export'),
  getExportStatus: (id) => api.get(`/profile/export/${id}`),
  deleteAccount: () => api.delete('/profile/account'),
};

// Billing API
export const billingAPI = {
  getPrices: () => api.get('/billing/prices'),
  createCheckout: (priceId) => api.post('/billing/checkout', { price_id: priceId }),
  getPortal: () => api.get('/billing/portal'),
  getSubscription: () => api.get('/billing/subscription'),
  cancelSubscription: () => api.post('/billing/subscription/cancel'),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserDetails: (id) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id, status) => api.patch(`/admin/users/${id}/status`, { status }),
  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
  getRevenueMetrics: () => api.get('/admin/metrics/revenue'),
  getTransactions: (params) => api.get('/admin/transactions', { params }),
  getSystemHealth: () => api.get('/admin/health'),
  getFeatureUsage: () => api.get('/admin/features/usage'),
  getAnalytics: (days) => api.get('/admin/analytics', { params: { days } }),
  getWebhooks: () => api.get('/admin/webhooks'),
  createWebhook: (url, events) => api.post('/admin/webhooks', { url, events }),
  deleteWebhook: (id) => api.delete(`/admin/webhooks/${id}`),
};

// Demo API - disabled
// export const demoAPI = {
//   startDemo: () => api.post('/demo/start'),
//   getFeatures: () => api.get('/demo/features'),
//   getStatus: (token) => api.get('/demo/status', { params: { demo_token: token } }),
//   endDemo: (token) => api.post('/demo/end', { demo_token: token }),
// }

// Upload API
export const uploadAPI = {
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type || 'image/jpeg',
      name: file.name || 'avatar.jpg',
    });
    return api.post('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteAvatar: () => api.delete('/upload/avatar'),

  uploadFile: async (file, category) => {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type || 'application/octet-stream',
      name: file.name || 'file',
    });
    if (category) formData.append('category', category);
    return api.post('/upload/file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  listFiles: (category) => api.get('/upload/files', { params: { category } }),

  deleteFile: (fileId) => api.delete(`/upload/files/${fileId}`),
};

// Analytics API
export const analyticsAPI = {
  trackEvent: (eventType, eventName, eventData) =>
    api.post('/analytics/track', {
      event_type: eventType,
      event_name: eventName,
      event_data: eventData,
    }),

  getUserStats: () => api.get('/analytics/users/stats'),
  getUserActivity: (days) => api.get('/analytics/users/activity', { params: { days } }),

  getDashboard: () => api.get('/analytics/dashboard'),
  getRevenue: () => api.get('/analytics/revenue'),
  getUsage: (days) => api.get('/analytics/usage', { params: { days } }),
  getRetention: () => api.get('/analytics/retention'),
  getEvents: (eventType, limit) =>
    api.get('/analytics/events', { params: { event_type: eventType, limit } }),
  getFunnels: () => api.get('/analytics/funnels'),
  getCohorts: () => api.get('/analytics/cohorts'),
  exportAnalytics: (format, days) => api.get('/analytics/export', { params: { format, days } }),
};

// User Analytics API
export const userAnalyticsAPI = {
  getActivity: (days) => api.get('/user-analytics/activity', { params: { days } }),
  getProgress: () => api.get('/user-analytics/progress'),
  getStreaks: () => api.get('/user-analytics/streaks'),
  getAchievements: () => api.get('/user-analytics/achievements'),
  getWeeklyReport: () => api.get('/user-analytics/weekly-report'),
  getInsights: () => api.get('/user-analytics/insights'),
  getBenchmark: () => api.get('/user-analytics/benchmark'),
  getSummary: () => api.get('/user-analytics/summary'),
};

// Life Domains API
export const domainsAPI = {
  // ── existing ──────────────────────────────────────────────────────────────
  getDomains: () => api.get('/domains'),
  getDomain: (id) => api.get(`/domains/${id}`),
  getDomainGoals: (id) => api.get(`/domains/${id}/goals`),
  getDomainProgress: (id) => api.get(`/domains/${id}/progress`),
  getDomainStats: (id) => api.get(`/domains/${id}/stats`),
  getDomainCheckins: (id, days) => api.get(`/domains/${id}/checkins`, { params: { days } }),
  createCheckin: (id, status, notes) => api.post(`/domains/${id}/checkin`, { status, notes }),

  // ── v2: goal CRUD + sparklines ─────────────────────────────────────────────
  getAllProgress: () => api.get('/domains/progress/all'),

  createGoal: (domainId, title, description, category, targetDate) =>
    api.post(`/domains/${domainId}/goals`, {
      title,
      description: description || null,
      category: category || null,
      target_date: targetDate || null,
    }),

  updateGoal: (goalId, progress) => api.patch(`/domains/goals/${goalId}`, { progress }),
  updateGoalStatus: (goalId, status) => api.patch(`/domains/goals/${goalId}`, { status }),
  deleteGoal: (goalId) => api.delete(`/domains/goals/${goalId}`),
  getGoalHistory: (goalId, limit = 30) =>
    api.get(`/domains/goals/${goalId}/history`, { params: { limit } }),

  // ── v3: weekly snapshots + radar ───────────────────────────────────────────
  getRadarData: (weeks = 8) => api.get('/domains/snapshots/radar', { params: { weeks } }),
  getSnapshotHistory: (domainId, weeks = 8) =>
    api.get('/domains/snapshots/history', { params: { domain_id: domainId, weeks } }),
  triggerSnapshot: () => api.post('/domains/snapshot'),

  // ── v4: goal detail drawer — field editing ─────────────────────────────────
  // Sends title, description, category, target_date in a single PATCH
  updateGoalFields: (goalId, fields) =>
    api.patch(`/domains/goals/${goalId}`, {
      ...(fields.title !== undefined && { title: fields.title }),
      ...(fields.description !== undefined && { description: fields.description }),
      ...(fields.category !== undefined && { category: fields.category }),
      ...(fields.target_date !== undefined && { target_date: fields.target_date }),
    }),

  // ── v5: AI suggestions ─────────────────────────────────────────────────────
  getSuggestions: () => api.get('/suggestions'),
  generateSuggestions: () => api.post('/suggestions/generate'),
  acceptSuggestion: (id, accepted) => api.post(`/suggestions/${id}/accept`, { accepted }),
};

// ─── Push notification API ────────────────────────────────────────────────────

export const pushAPI = {
  subscribe: (subscription) => api.post('/push/subscribe', subscription),
  unsubscribe: (endpoint) => api.post('/push/unsubscribe', { endpoint }),
  status: () => api.get('/push/status'),
  test: () => api.post('/push/test'),
};

// ─── Executive Brief API ────────────────────────────────────────────────────

export const briefAPI = {
  getLatest: () => api.get('/briefs/latest'),
  generate: (period) => api.post('/briefs/generate', { period }),
};

// ─── Tree of Life API ────────────────────────────────────────────────────

export const treeAPI = {
  health: () => api.get('/tree/health'),
  run: (input, domain) => api.post('/tree/run', { input, domain }),
};

// ─── Metatron Cube API ────────────────────────────────────────────────────

export const metatronAPI = {
  health: () => api.get('/metatron/health'),
  topology: () => api.get('/metatron/topology'),
  run: (input, domain) => api.post('/metatron/run', { input, domain }),
};

export default api;
