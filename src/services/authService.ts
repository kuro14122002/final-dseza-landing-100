import axios from 'axios';

const API_BASE_URL = window.location.origin.includes('8080') 
  ? 'http://localhost/final-dseza-landing-85/api'
  : 'http://localhost/final-dseza-landing-85/api';

// Token management
export const TOKEN_KEY = 'adminUserToken';
export const USER_KEY = 'adminUser';

export const authService = {
  // Get auth token
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Set auth token
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Remove auth token
  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Get user info
  getUser: () => {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Set user info
  setUser: (user: any): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = authService.getToken();
    const user = authService.getUser();
    return !!(token && user);
  },

  // Check if user is super admin (username = 'admin')
  isSuperAdmin: (): boolean => {
    const user = authService.getUser();
    return !!(user && user.username === 'admin' && user.role === 'admin');
  },

  // Check if user is admin (any admin role)
  isAdmin: (): boolean => {
    const user = authService.getUser();
    return !!(user && user.role === 'admin');
  },

  // Create axios instance with auth headers
  createAuthenticatedApi: () => {
    const api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth interceptor
    api.interceptors.request.use((config) => {
      const token = authService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor for handling 401
    api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          authService.removeToken();
          window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      }
    );

    return api;
  },

  // Login
  login: async (email: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    });

    if (response.data.status === 'success' && response.data.data.token) {
      authService.setToken(response.data.data.token);
      authService.setUser(response.data.data.user);
      return response.data.data;
    }

    throw new Error(response.data.message || 'Login failed');
  },

  // Logout
  logout: async () => {
    try {
      const api = authService.createAuthenticatedApi();
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error);
    } finally {
      authService.removeToken();
    }
  },

  // Verify token
  verifyToken: async () => {
    const token = authService.getToken();
    if (!token) return false;

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify`, { token });
      return response.data.status === 'success' && response.data.data.valid;
    } catch (error) {
      return false;
    }
  }
};

export default authService; 