import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { selectBookings, useBookingStore } from '../../../entities/booking';
import { colors } from '../../../shared/config/theme';
import { formatDateLabel, formatTimeLabel } from '../../../shared/lib/dates';
import type { ServicesStackParamList } from '../../../shared/types';
import { Animated, Button, Card, EmptyState, Screen } from '../../../shared/ui';

type Props = NativeStackScreenProps<ServicesStackParamList, 'BookingSuccess'>;

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between py-2.5">
      <Text className="text-sm text-ink-muted">{label}</Text>
      <Text className="flex-1 text-right text-sm font-medium text-ink" numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

export function BookingSuccessScreen({ route, navigation }: Props) {
  const { bookingId } = route.params;
  const booking = useBookingStore(selectBookings).find((item) => item.id === bookingId);

  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12 });
    opacity.value = withTiming(1, { duration: 260 });
  }, [scale, opacity]);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const backToServices = () => navigation.popTo('Services');

  const viewBookings = () => {
    navigation.popTo('Services');
    navigation.getParent()?.navigate('BookingsTab');
  };

  if (!booking) {
    return (
      <Screen edges={[]}>
        <EmptyState
          icon="alert-circle-outline"
          title="Booking not found"
          description="It may have been deleted from this device."
          actionLabel="Back to services"
          onAction={backToServices}
        />
      </Screen>
    );
  }

  return (
    <Screen edges={['bottom']}>
      <View className="flex-1 items-center justify-center px-6">
        <Animated.View
          style={badgeStyle}
          className="h-24 w-24 items-center justify-center rounded-full bg-primary-soft"
        >
          <Ionicons name="checkmark-circle" size={64} color={colors.primary} />
        </Animated.View>

        <Text
          accessibilityRole="header"
          className="mt-6 text-center text-2xl font-bold text-ink"
        >
          Booking confirmed
        </Text>
        <Text className="mt-2 text-center text-base leading-6 text-ink-muted">
          {booking.companyName} has been scheduled. You can find it under My Bookings.
        </Text>

        <Card className="mt-8 w-full">
          <DetailRow label="Service" value={booking.serviceName} />
          <View className="h-px bg-line" />
          <DetailRow label="Provider" value={booking.providerName} />
          <View className="h-px bg-line" />
          <DetailRow label="Date" value={formatDateLabel(booking.date)} />
          <View className="h-px bg-line" />
          <DetailRow label="Time" value={formatTimeLabel(booking.time)} />
        </Card>
      </View>

      <View className="gap-3 px-6 pb-4">
        <Button
          label="View My Bookings"
          onPress={viewBookings}
          testID="success-view-bookings"
        />
        <Button label="Back to Services" variant="secondary" onPress={backToServices} />
      </View>
    </Screen>
  );
}
