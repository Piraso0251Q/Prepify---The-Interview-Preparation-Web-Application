// ── Base URL of our backend ────────────────────────────────
const BASE_URL = "http://localhost:5000/api";

// ── Core fetch wrapper ─────────────────────────────────────
// Automatically attaches the access token to every request
const apiFetch = async (endpoint, options = {}) => {
  // Get token from memory (stored in localStorage temporarily)
  const token = localStorage.getItem("accessToken");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: "include", // sends cookies (for refresh token)
    ...options,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();

  // If token expired, try to refresh it automatically
  if (response.status === 401 && data.message?.includes("expired")) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Retry the original request with new token
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

// ── Auth API calls ─────────────────────────────────────────
export const authAPI = {
  signup: (name, email, password) =>
    apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email, password) =>
    apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiFetch("/auth/logout", { method: "POST" }),

  getMe: () =>
    apiFetch("/auth/me"),
};
