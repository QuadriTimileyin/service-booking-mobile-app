import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createAsyncStorage } from '../../../shared/lib/storage';

export const AUTH_STORAGE_KEY = 'service-booking/auth';

interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
  /** False until AsyncStorage has been read, so we don't flash the login screen. */
  hasHydrated: boolean;
  signIn: (email: string) => void;
  signOut: () => void;
}

/**
 * Mock session state. There is no backend: a valid email plus a non-empty
 * password is treated as a successful sign-in (see README assumptions).
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set): AuthState => ({
      isAuthenticated: false,
      email: null,
      hasHydrated: false,
      signIn: (email) => set({ isAuthenticated: true, email }),
      signOut: () => set({ isAuthenticated: false, email: null }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => createAsyncStorage()),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        email: state.email,
      }),
      onRehydrateStorage: () => () => useAuthStore.setState({ hasHydrated: true }),
    },
  ),
);
