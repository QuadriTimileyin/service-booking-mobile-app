import type { Booking, BookingDraft } from '../types';

/** Good enough id for a list kept on one device, so no uuid package is needed. */
const generateId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const createBooking = (draft: BookingDraft): Booking => ({
  ...draft,
  id: generateId(),
  createdAt: new Date().toISOString(),
});
