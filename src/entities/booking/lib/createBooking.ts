import type { Booking, BookingDraft } from '../types';

/**
 * Collision-resistant enough for a device-local list, without pulling in a uuid
 * dependency (react-native lacks `crypto.randomUUID` on older runtimes).
 */
const generateId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const createBooking = (draft: BookingDraft): Booking => ({
  ...draft,
  id: generateId(),
  createdAt: new Date().toISOString(),
});
