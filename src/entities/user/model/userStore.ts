import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createAsyncStorage } from '../../../shared/lib/storage';
import { deriveNameFromEmail } from '../lib/deriveNameFromEmail';
import type { UserProfile } from '../types';

export const USER_STORAGE_KEY = 'service-booking/user';

interface UserState {
  isAuthenticated: boolean;
  profile: UserProfile | null;
  /** False until storage has been read, so we do not flash the login screen. */
  hasHydrated: boolean;
  signIn: (email: string) => void;
  updateProfile: (profile: UserProfile) => void;
  signOut: () => void;
}

/** Mock session. Any valid email with a password signs in. There is no backend. */
export const useUserStore = create<UserState>()(
  persist(
    (set): UserState => ({
      isAuthenticated: false,
      profile: null,
      hasHydrated: false,
      signIn: (email) =>
        set({
          isAuthenticated: true,
          profile: { email, name: deriveNameFromEmail(email) },
        }),
      updateProfile: (profile) => set({ profile }),
      signOut: () => set({ isAuthenticated: false, profile: null }),
    }),
    {
      name: USER_STORAGE_KEY,
      storage: createJSONStorage(() => createAsyncStorage()),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        profile: state.profile,
      }),
      onRehydrateStorage: () => () => useUserStore.setState({ hasHydrated: true }),
    },
  ),
);

export const selectProfile = (state: UserState) => state.profile;
export const selectIsAuthenticated = (state: UserState) => state.isAuthenticated;
