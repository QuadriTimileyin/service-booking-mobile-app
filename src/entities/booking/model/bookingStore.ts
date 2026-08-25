import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createAsyncStorage } from '../../../shared/lib/storage';
import type { Booking } from '../types';

export const BOOKINGS_STORAGE_KEY = 'service-booking/bookings';

interface BookingState {
  bookings: Booking[];
  /** False until storage has been read, so the UI never flashes "empty". */
  hasHydrated: boolean;
  /** Set when the phone refused a read or write. Shown as a banner. */
  storageError: string | null;
  addBooking: (booking: Booking) => void;
  deleteBooking: (id: string) => void;
  clearStorageError: () => void;
}

const STORAGE_ERROR_MESSAGE =
  'Your bookings could not be saved to this device. They will be lost when the app closes.';

export const useBookingStore = create<BookingState>()(
  persist(
    (set): BookingState => ({
      bookings: [],
      hasHydrated: false,
      storageError: null,
      addBooking: (booking) =>
        set((state) => ({ bookings: [booking, ...state.bookings] })),
      deleteBooking: (id) =>
        set((state) => ({
          bookings: state.bookings.filter((booking) => booking.id !== id),
        })),
      clearStorageError: () => set({ storageError: null }),
    }),
    {
      name: BOOKINGS_STORAGE_KEY,
      storage: createJSONStorage(() =>
        createAsyncStorage(() => {
          useBookingStore.setState({ storageError: STORAGE_ERROR_MESSAGE });
        }),
      ),
      partialize: (state) => ({ bookings: state.bookings }),
      onRehydrateStorage: () => (_state, error) =>
        useBookingStore.setState({
          hasHydrated: true,
          storageError: error ? STORAGE_ERROR_MESSAGE : null,
        }),
    },
  ),
);

/** Selectors keep each screen subscribed to only what it needs. */
export const selectBookings = (state: BookingState) => state.bookings;
export const selectHasHydrated = (state: BookingState) => state.hasHydrated;
