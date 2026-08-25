import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createAsyncStorage } from '../../../shared/lib/storage';

export const PREFERENCES_STORAGE_KEY = 'service-booking/preferences';

interface PreferencesState {
  onboardingComplete: boolean;
  /** False until storage has been read, so onboarding does not flash on relaunch. */
  hasHydrated: boolean;
  completeOnboarding: () => void;
}

/** Device level settings. These survive logout, unlike the session. */
export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set): PreferencesState => ({
      onboardingComplete: false,
      hasHydrated: false,
      completeOnboarding: () => set({ onboardingComplete: true }),
    }),
    {
      name: PREFERENCES_STORAGE_KEY,
      storage: createJSONStorage(() => createAsyncStorage()),
      partialize: (state) => ({ onboardingComplete: state.onboardingComplete }),
      onRehydrateStorage: () => () =>
        usePreferencesStore.setState({ hasHydrated: true }),
    },
  ),
);
