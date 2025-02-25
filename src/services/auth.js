import api from './api';

export const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Store token
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return user;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Login failed. Please check your credentials and try again.'
      );
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      // Store token
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return user;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Registration failed. Please try again.'
      );
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return null;
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        authService.logout();
        return null;
      }
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch user data.'
      );
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};
