import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    await new Promise((res) => setTimeout(res, 600));
    if (!email || !password) {
      set({ isLoading: false, error: 'Email and password are required' });
      return false;
    }
    const role = 'User';
    set({
      isLoading: false,
      isAuthenticated: true,
      user: {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        fullName: email.split('@')[0],
        email,
        role,
        avatarUrl: '',
        company: '',
        createdAt: new Date().toISOString(),
        token: 'jwt_mock_' + Date.now()
      }
    });
    return true;
  },

  register: async (fullName, email, password) => {
    set({ isLoading: true, error: null });
    await new Promise((res) => setTimeout(res, 600));
    set({
      isLoading: false,
      isAuthenticated: true,
      user: {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        fullName,
        email,
        role: 'User',
        avatarUrl: '',
        company: '',
        createdAt: new Date().toISOString(),
        token: 'jwt_mock_' + Date.now()
      }
    });
    return true;
  },

  logout: () => {
    set({ isAuthenticated: false, user: null });
  },

  forgotPassword: async (email) => {
    set({ isLoading: true });
    await new Promise((res) => setTimeout(res, 500));
    set({ isLoading: false });
    return true;
  },

  resetPassword: async (token, newPassword) => {
    set({ isLoading: true });
    await new Promise((res) => setTimeout(res, 500));
    set({ isLoading: false });
    return true;
  },

  changePassword: async (oldPassword, newPassword) => {
    set({ isLoading: true });
    await new Promise((res) => setTimeout(res, 500));
    set({ isLoading: false });
    return true;
  },

  updateProfile: async (data) => {
    set((state) => ({
      user: { ...state.user, ...data }
    }));
    return true;
  },

}), {
  name: 'arena-auth-storage', // key for localStorage
  partialize: (state) => ({ 
    user: state.user,
    isAuthenticated: state.isAuthenticated
  }), // Only persist these fields
}));
