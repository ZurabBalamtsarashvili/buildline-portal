import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post('/api/auth/login', {
            username: email, // FastAPI OAuth2 expects 'username'
            password,
          });

          const { access_token } = response.data;

          // Set auth token in axios defaults
          axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

          // Get user profile
          const userResponse = await axios.get('/api/auth/me');

          set({
            token: access_token,
            user: userResponse.data,
            isAuthenticated: true,
            isLoading: false,
          });

          return true;
        } catch (error) {
          set({
            error: error.response?.data?.detail || 'Login failed',
            isLoading: false,
          });
          return false;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          await axios.post('/api/auth/register', userData);
          
          // Auto-login after successful registration
          return await get().login(userData.email, userData.password);
        } catch (error) {
          set({
            error: error.response?.data?.detail || 'Registration failed',
            isLoading: false,
          });
          return false;
        }
      },

      logout: async () => {
        try {
          // Call logout endpoint if needed
          await axios.post('/api/auth/logout');
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear auth token from axios defaults
          delete axios.defaults.headers.common['Authorization'];

          // Clear auth state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });

          // Clear persisted state
          localStorage.removeItem('auth-storage');
        }
      },

      checkAuth: async () => {
        const token = get().token;
        if (!token) {
          return false;
        }

        try {
          // Set token in axios defaults
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Verify token by fetching user profile
          const response = await axios.get('/api/auth/me');
          
          set({
            user: response.data,
            isAuthenticated: true,
          });

          return true;
        } catch (error) {
          // Token is invalid - clear auth state
          get().logout();
          return false;
        }
      },

      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.put('/api/auth/profile', profileData);
          set({
            user: response.data,
            isLoading: false,
          });
          return true;
        } catch (error) {
          set({
            error: error.response?.data?.detail || 'Profile update failed',
            isLoading: false,
          });
          return false;
        }
      },

      changePassword: async (oldPassword, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          await axios.post('/api/auth/change-password', {
            old_password: oldPassword,
            new_password: newPassword,
          });
          set({ isLoading: false });
          return true;
        } catch (error) {
          set({
            error: error.response?.data?.detail || 'Password change failed',
            isLoading: false,
          });
          return false;
        }
      },

      resetPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          await axios.post('/api/auth/reset-password-request', { email });
          set({ isLoading: false });
          return true;
        } catch (error) {
          set({
            error: error.response?.data?.detail || 'Password reset request failed',
            isLoading: false,
          });
          return false;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);

// Initialize axios defaults on app load if token exists
const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Hook wrapper for the store
export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
    updateProfile,
    changePassword,
    resetPassword,
    clearError,
  } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
    updateProfile,
    changePassword,
    resetPassword,
    clearError,
  };
};
