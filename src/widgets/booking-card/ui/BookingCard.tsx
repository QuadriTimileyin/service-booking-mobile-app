import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Text, View } from 'react-native';

import type { Booking } from '../../../entities/booking';
import { colors } from '../../../shared/config/theme';
import { formatDateLabel, formatTimeLabel } from '../../../shared/lib/dates';
import { Badge, Card, IconButton } from '../../../shared/ui';

interface BookingCardProps {
  booking: Booking;
  onDelete: (booking: Booking) => void;
}

function BookingCardComponent({ booking, onDelete }: BookingCardProps) {
  return (
    <Card testID={`booking-card-${booking.id}`}>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Badge label={booking.category} />
          <Text className="mt-2 text-base font-semibold text-ink">
            {booking.companyName}
          </Text>
          <Text className="mt-0.5 text-sm text-ink-muted">{booking.providerName}</Text>
        </View>

        <IconButton
          accessibilityLabel={`Delete booking for ${booking.serviceName}`}
          onPress={() => onDelete(booking)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        </IconButton>
      </View>

      <View className="mt-3 flex-row flex-wrap gap-x-4 gap-y-2 border-t border-line pt-3">
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="calendar-outline" size={16} color={colors.inkMuted} />
          <Text className="text-sm text-ink">{formatDateLabel(booking.date)}</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="time-outline" size={16} color={colors.inkMuted} />
          <Text className="text-sm text-ink">{formatTimeLabel(booking.time)}</Text>
        </View>
      </View>

      {booking.notes ? (
        <View className="mt-3 rounded-xl bg-surface-muted p-3">
          <Text className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Notes
          </Text>
          <Text className="mt-1 text-sm leading-5 text-ink">{booking.notes}</Text>
        </View>
      ) : null}
    </Card>
  );
}

export const BookingCard = memo(BookingCardComponent);
