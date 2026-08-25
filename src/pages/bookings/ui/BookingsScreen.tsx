import { Ionicons } from '@expo/vector-icons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useCallback } from 'react';
import { FlatList, Text, View } from 'react-native';
import { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';

import {
  selectBookings,
  selectHasHydrated,
  useBookingStore,
  type Booking,
} from '../../../entities/booking';
import { useDeleteBooking } from '../../../features/booking/delete-booking';
import { colors } from '../../../shared/config/theme';
import type { MainTabParamList } from '../../../shared/types';
import {
  Animated,
  EmptyState,
  IconButton,
  Screen,
  ServiceCardSkeleton,
} from '../../../shared/ui';
import { BookingCard } from '../../../widgets/booking-card';
import { ScreenHeader } from '../../../widgets/screen-header';

type Props = BottomTabScreenProps<MainTabParamList, 'BookingsTab'>;

export function BookingsScreen({ navigation }: Props) {
  const bookings = useBookingStore(selectBookings);
  const hasHydrated = useBookingStore(selectHasHydrated);
  const storageError = useBookingStore((state) => state.storageError);
  const clearStorageError = useBookingStore((state) => state.clearStorageError);
  const confirmDelete = useDeleteBooking();

  const browseServices = useCallback(
    () => navigation.navigate('ServicesTab', { screen: 'Services' }),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Booking; index: number }) => (
      <Animated.View
        entering={FadeInDown.delay(Math.min(index, 6) * 40).duration(220)}
        exiting={FadeOut.duration(150)}
        layout={LinearTransition.duration(200)}
      >
        <BookingCard booking={item} onDelete={confirmDelete} />
      </Animated.View>
    ),
    [confirmDelete],
  );

  return (
    <Screen>
      <ScreenHeader
        title="My Bookings"
        subtitle={
          hasHydrated && bookings.length > 0
            ? `${bookings.length} appointment${bookings.length === 1 ? '' : 's'} scheduled`
            : undefined
        }
      />

      {storageError ? (
        <View className="mx-4 mb-2 flex-row items-center gap-2 rounded-control border border-danger/30 bg-danger/5 py-2 pl-3">
          <Ionicons name="warning-outline" size={18} color={colors.danger} />
          <Text className="flex-1 text-sm text-danger">{storageError}</Text>
          <IconButton
            accessibilityLabel="Dismiss storage warning"
            onPress={clearStorageError}
          >
            <Ionicons name="close" size={18} color={colors.danger} />
          </IconButton>
        </View>
      ) : null}

      {/* Wait for storage first, else a saved booking flashes as "no bookings". */}
      {!hasHydrated ? (
        <View className="gap-3 px-4 pt-2">
          <ServiceCardSkeleton />
          <ServiceCardSkeleton />
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(booking) => booking.id}
          renderItem={renderItem}
          contentContainerClassName="gap-3 px-4 pb-8 pt-1"
          contentContainerStyle={bookings.length === 0 ? { flexGrow: 1 } : undefined}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon="calendar-outline"
              title="No bookings yet"
              description="Browse services and schedule your first appointment."
              actionLabel="Browse Services"
              onAction={browseServices}
            />
          }
          testID="bookings-list"
        />
      )}
    </Screen>
  );
}
