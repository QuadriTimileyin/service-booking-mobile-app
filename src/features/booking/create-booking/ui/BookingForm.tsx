import { zodResolver } from '@hookform/resolvers/zod';
import * as Haptics from 'expo-haptics';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Text, View } from 'react-native';

import type { ServiceProvider } from '../../../../entities/service';
import { startOfToday } from '../../../../shared/lib/dates';
import { Badge, Button, Card, DateTimeField, Input } from '../../../../shared/ui';
import {
  NOTES_MAX_LENGTH,
  bookingSchema,
  useCreateBooking,
  type BookingFormValues,
} from '../model';

interface BookingFormProps {
  provider: ServiceProvider;
  onBooked: (bookingId: string) => void;
}

export function BookingForm({ provider, onBooked }: BookingFormProps) {
  const createBooking = useCreateBooking();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { date: '', time: '', notes: '' },
    mode: 'onSubmit',
  });

  const onSubmit = (values: BookingFormValues) => {
    let bookingId: string;

    try {
      bookingId = createBooking(provider, values).id;
    } catch {
      Alert.alert(
        'Booking failed',
        'We could not save this booking on your device. Please try again.',
      );
      return;
    }

    // Haptics are optional. A phone without them should not fail a saved booking.
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {},
    );

    onBooked(bookingId);
  };

  return (
    <View className="gap-5">
      {/* The service is picked on the previous screen, so it is read-only here. */}
      <Card className="border-primary/20 bg-primary-soft">
        <Text className="text-xs font-semibold uppercase tracking-wide text-primary-dark">
          Selected service
        </Text>
        <Text className="mt-2 text-lg font-semibold text-ink">
          {provider.companyName}
        </Text>
        <Text className="mt-0.5 text-sm text-ink-muted">
          {provider.name} · {provider.city}
        </Text>
        <View className="mt-3">
          <Badge label={provider.category} />
        </View>
      </Card>

      <Controller
        control={control}
        name="date"
        render={({ field: { onChange, value } }) => (
          <DateTimeField
            label="Date"
            mode="date"
            value={value}
            onChange={onChange}
            placeholder="Select a date"
            minimumDate={startOfToday()}
            error={errors.date?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="time"
        render={({ field: { onChange, value } }) => (
          <DateTimeField
            label="Time"
            mode="time"
            value={value}
            onChange={onChange}
            placeholder="Select a time"
            error={errors.time?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Additional notes (optional)"
            placeholder="Anything the provider should know?"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.notes?.message}
            hint={`${value.length}/${NOTES_MAX_LENGTH}`}
            multiline
            numberOfLines={4}
            maxLength={NOTES_MAX_LENGTH}
            inputClassName="min-h-[104px]"
            style={{ textAlignVertical: 'top' }}
            testID="booking-notes"
          />
        )}
      />

      <Button
        label="Confirm Booking"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        testID="booking-submit"
      />
    </View>
  );
}
