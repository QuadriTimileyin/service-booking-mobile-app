import { useCallback } from 'react';

import {
  createBooking,
  useBookingStore,
  type Booking,
} from '../../../../entities/booking';
import type { ServiceProvider } from '../../../../entities/service';
import type { BookingFormValues } from './bookingSchema';

/** Takes a valid form plus a provider and saves the booking. */
export function useCreateBooking() {
  const addBooking = useBookingStore((state) => state.addBooking);

  return useCallback(
    (provider: ServiceProvider, values: BookingFormValues): Booking => {
      const booking = createBooking({
        serviceProviderId: provider.id,
        serviceName: `${provider.category} with ${provider.companyName}`,
        providerName: provider.name,
        companyName: provider.companyName,
        category: provider.category,
        date: values.date,
        time: values.time,
        notes: values.notes.trim(),
      });

      addBooking(booking);
      return booking;
    },
    [addBooking],
  );
}
