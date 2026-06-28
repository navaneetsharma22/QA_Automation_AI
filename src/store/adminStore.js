import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAdminStore = create(
  persist(
    (set) => ({
      isAdminAuthenticated: false,
      adminUser: null,
      login: (username, password) => {
        // Hardcoded admin login for now. Can be replaced with API call later.
        if (username === 'navaneet@gmail.com' && password === '9305307550') {
          set({ isAdminAuthenticated: true, adminUser: { username: 'navaneet@gmail.com', role: 'Super Admin' } });
          return true;
        }
        return false;
      },
      logout: () => set({ isAdminAuthenticated: false, adminUser: null }),
    }),
    {
      name: 'admin-storage',
    }
  )
);
