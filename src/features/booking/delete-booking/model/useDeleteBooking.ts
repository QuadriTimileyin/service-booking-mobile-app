import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { Alert } from 'react-native';

import { useBookingStore, type Booking } from '../../../../entities/booking';

/** Delete with a confirmation first. Shared by anywhere that removes a booking. */
export function useDeleteBooking() {
  const deleteBooking = useBookingStore((state) => state.deleteBooking);

  return useCallback(
    (booking: Booking) => {
      Alert.alert(
        'Delete booking?',
        `${booking.serviceName} will be removed from your bookings.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              deleteBooking(booking.id);
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(
                () => {},
              );
            },
          },
        ],
      );
    },
    [deleteBooking],
  );
}
