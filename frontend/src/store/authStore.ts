import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Role } from '../types';
import { mockUsers } from '../mocks/data';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: Role) => void;
}

// Local credentials: the account email determines the seeded user.
const emailToUser: Record<string, User> = Object.fromEntries(
  mockUsers.map((u) => [u.email, u])
);

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, _password) => {
        await new Promise((r) => setTimeout(r, 600));
        const user = emailToUser[email.toLowerCase().trim()];
        if (user) {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      switchRole: (role) =>
        set((state) => {
          const newUser = mockUsers.find((u) => u.role === role);
          return newUser ? { user: newUser } : state;
        }),
    }),
    { name: 'aicte-auth' }
  )
);
