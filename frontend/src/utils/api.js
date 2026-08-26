// ── Base URL of our backend ────────────────────────────────
const BASE_URL = "http://localhost:5000/api";

// ── Core fetch wrapper ─────────────────────────────────────
const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("accessToken");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: "include",
    ...options,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();

  // If token expired, try to refresh automatically
  if (response.status === 401 && data.message?.includes("expired")) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      config.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`;
      const retryRes = await fetch(`${BASE_URL}${endpoint}`, config);
      return retryRes.json();
    }
  }

  return data;
};

// ── Refresh the access token using the httpOnly cookie ─────
const refreshAccessToken = async () => {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem("accessToken", data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

// ── Auth API ───────────────────────────────────────────────
export const authAPI = {
  signup: (name, email, password) =>
    apiFetch("/auth/signup", { method: "POST", body: JSON.stringify({ name, email, password }) }),

  login: (email, password) =>
    apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  logout: () =>
    apiFetch("/auth/logout", { method: "POST" }),

  getMe: () =>
    apiFetch("/auth/me"),
};

// ── Questions API ──────────────────────────────────────────
export const questionsAPI = {
  // Get all questions — supports ?role=&difficulty=&topic=&search=
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.role)       params.append("role", filters.role);
    if (filters.difficulty) params.append("difficulty", filters.difficulty);
    if (filters.topic)      params.append("topic", filters.topic);
    if (filters.search)     params.append("search", filters.search);
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiFetch(`/questions${query}`);
  },

  // Get a single question by its MongoDB ID
  getById: (id) => apiFetch(`/questions/${id}`),

  // Generate 5 unique AI questions (and save to DB silently)
  generate: (role) => apiFetch(`/questions/generate?role=${encodeURIComponent(role)}`),

  // Admin: add a question
  create: (questionData) =>
    apiFetch("/questions/admin", { method: "POST", body: JSON.stringify(questionData) }),

  // Admin: update a question
  update: (id, questionData) =>
    apiFetch(`/questions/admin/${id}`, { method: "PUT", body: JSON.stringify(questionData) }),

  // Admin: delete a question
  delete: (id) =>
    apiFetch(`/questions/admin/${id}`, { method: "DELETE" }),
};

// ── History API ────────────────────────────────────────────
export const historyAPI = {
  // Save a completed interview session
  save: (sessionData) =>
    apiFetch("/history", { method: "POST", body: JSON.stringify(sessionData) }),

  // Get all sessions for the logged-in user
  getAll: () => apiFetch("/history"),

  // Get a single session by ID
  getById: (id) => apiFetch(`/history/${id}`),

  // Clear all history
  clear: () => apiFetch("/history", { method: "DELETE" }),
};

// ── Bookmarks API ──────────────────────────────────────────
export const bookmarksAPI = {
  // Get all bookmarked question IDs
  getAll: () => apiFetch("/bookmarks"),

  // Add a bookmark
  add: (questionId) =>
    apiFetch(`/bookmarks/${questionId}`, { method: "POST" }),

  // Remove a bookmark
  remove: (questionId) =>
    apiFetch(`/bookmarks/${questionId}`, { method: "DELETE" }),
};
