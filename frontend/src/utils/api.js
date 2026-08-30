//  Base URL of our backend 

const BASE_URL = "https://api-prepify.onrender.com/api";

//  Core fetch wrapper 
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

//  Refresh the access token using the httpOnly cookie 
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

//  Auth API 
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

//  Questions API 
export const questionsAPI = {
  
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.role)       params.append("role", filters.role);
    if (filters.difficulty) params.append("difficulty", filters.difficulty);
    if (filters.topic)      params.append("topic", filters.topic);
    if (filters.search)     params.append("search", filters.search);
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiFetch(`/questions${query}`);
  },

  
  getById: (id) => apiFetch(`/questions/${id}`),

 
  generate: (role) => apiFetch(`/questions/generate?role=${encodeURIComponent(role)}`),

  
  create: (questionData) =>
    apiFetch("/questions/admin", { method: "POST", body: JSON.stringify(questionData) }),

  
  update: (id, questionData) =>
    apiFetch(`/questions/admin/${id}`, { method: "PUT", body: JSON.stringify(questionData) }),

 
  delete: (id) =>
    apiFetch(`/questions/admin/${id}`, { method: "DELETE" }),
};

//  History API 
export const historyAPI = {
 
  save: (sessionData) =>
    apiFetch("/history", { method: "POST", body: JSON.stringify(sessionData) }),

 
  getAll: () => apiFetch("/history"),

 
  getById: (id) => apiFetch(`/history/${id}`),

 
  clear: () => apiFetch("/history", { method: "DELETE" }),
};

//  Bookmarks API 
export const bookmarksAPI = {
  
  getAll: () => apiFetch("/bookmarks"),

  
  add: (questionId) =>
    apiFetch(`/bookmarks/${questionId}`, { method: "POST" }),

  
  remove: (questionId) =>
    apiFetch(`/bookmarks/${questionId}`, { method: "DELETE" }),
};
