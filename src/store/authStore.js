import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const useAuthStore = create(
  persist(
    (set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  checkSessionExpiry: () => {
    const { user, isAuthenticated } = get();
    if (isAuthenticated && user?.expiresAt && Date.now() > user.expiresAt) {
      set({ isAuthenticated: false, user: null });
      toast.error('Your session has expired. Please log in again.');
      return true; // expired
    }
    return false;
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    if (!email || !password) {
      set({ isLoading: false, error: 'Email and password are required' });
      return false;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const res = await fetch(`${apiUrl}/v1/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      set({
        isLoading: false,
        isAuthenticated: true,
        user: data.user
      });
      return true;
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return false;
    }
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
  name: 'arena-auth-storage',
  partialize: (state) => ({ 
    user: state.user,
    isAuthenticated: state.isAuthenticated
  }),
}));
