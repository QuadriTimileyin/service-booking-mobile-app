import { createBooking, useBookingStore } from '../src/entities/booking';
import type { BookingDraft } from '../src/entities/booking';

const draft: BookingDraft = {
  serviceProviderId: 1,
  serviceName: 'Car Wash with Romaguera-Crona',
  providerName: 'Leanne Graham',
  companyName: 'Romaguera-Crona',
  category: 'Car Wash',
  date: '2030-01-15',
  time: '10:00',
  notes: 'Ring the bell',
};

describe('bookingStore', () => {
  beforeEach(() => {
    useBookingStore.setState({ bookings: [], storageError: null });
  });

  it('adds a booking to the top of the list', () => {
    const first = createBooking(draft);
    const second = createBooking({ ...draft, time: '12:00' });

    useBookingStore.getState().addBooking(first);
    useBookingStore.getState().addBooking(second);

    const { bookings } = useBookingStore.getState();
    expect(bookings).toHaveLength(2);
    expect(bookings[0].id).toBe(second.id);
  });

  it('deletes only the requested booking', () => {
    const kept = createBooking(draft);
    const removed = createBooking({ ...draft, time: '16:00' });

    useBookingStore.getState().addBooking(kept);
    useBookingStore.getState().addBooking(removed);
    useBookingStore.getState().deleteBooking(removed.id);

    const { bookings } = useBookingStore.getState();
    expect(bookings).toHaveLength(1);
    expect(bookings[0].id).toBe(kept.id);
  });

  it('ignores a delete for an unknown id', () => {
    useBookingStore.getState().addBooking(createBooking(draft));
    useBookingStore.getState().deleteBooking('does-not-exist');

    expect(useBookingStore.getState().bookings).toHaveLength(1);
  });

  it('stamps each booking with a unique id and creation timestamp', () => {
    const booking = createBooking(draft);

    expect(booking.id).toEqual(expect.any(String));
    expect(Number.isNaN(Date.parse(booking.createdAt))).toBe(false);
    expect(createBooking(draft).id).not.toBe(booking.id);
  });
});
