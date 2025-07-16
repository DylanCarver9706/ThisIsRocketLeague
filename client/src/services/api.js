import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_SERVER_URL
    : process.env.REACT_APP_DEV_SERVER_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

// Terms API
export const termsAPI = {
  getAll: (params = {}) => api.get("/terms", { params }),
  getById: (id) => api.get(`/terms/${id}`),
  create: (data) => api.post("/terms", data),
  like: (id) => api.post(`/terms/${id}/like`),
  getTrending: (limit = 10) => api.get(`/terms/trending/limit?limit=${limit}`),
  getCategories: () => api.get("/terms/categories/list"),
};

// Records API
export const recordsAPI = {
  getAll: (params = {}) => api.get("/records", { params }),
  getById: (id) => api.get(`/records/${id}`),
  create: (data) => api.post("/records", data),
  like: (id) => api.post(`/records/${id}/like`),
  getTrending: (limit = 10) =>
    api.get(`/records/trending/limit?limit=${limit}`),
  getCategories: () => api.get("/records/categories/list"),
};

// Plugins API
export const pluginsAPI = {
  getAll: (params = {}) => api.get("/plugins", { params }),
  getTrending: (limit = 10) => api.get(`/plugins/trending?limit=${limit}`),
  search: (query) => api.get(`/plugins/search?q=${encodeURIComponent(query)}`),
};

// Health check
export const healthAPI = {
  check: () => api.get("/health"),
};

export default api;
