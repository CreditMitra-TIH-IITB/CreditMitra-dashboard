import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  // If using cookies for auth with FastAPI, ensure credentials are sent
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // For Desktop (Tauri/Electron), we might need to attach the token via headers
    // For Web, HttpOnly cookies are preferred so this might be empty
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors (e.g., token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Implement token refresh logic here
        // const refreshResponse = await axios.post('/api/v1/auth/refresh');
        // const newToken = refreshResponse.data.access_token;
        // localStorage.setItem('access_token', newToken);
        // api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        // return api(originalRequest);
      } catch {
        // Handle refresh failure (e.g., logout user)
      }
    }
    return Promise.reject(error);
  },
);

export default api;
