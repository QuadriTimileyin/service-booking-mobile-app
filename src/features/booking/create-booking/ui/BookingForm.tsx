import { zodResolver } from '@hookform/resolvers/zod';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Text, View } from 'react-native';

import type { ServiceProvider } from '../../../../entities/service';
import {
  fromDateValue,
  fromTimeValue,
  startOfToday,
  toDateValue,
  toTimeValue,
} from '../../../../shared/lib/dates';
import {
  Badge,
  Button,
  Card,
  DateStrip,
  Input,
  NativePickerSheet,
  TimeSlots,
} from '../../../../shared/ui';
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

function FieldLabel({ children, error }: { children: string; error?: string }) {
  return (
    <View className="mb-2 flex-row items-baseline justify-between">
      <Text className="text-sm font-medium text-ink">{children}</Text>
      {error ? (
        <Text accessibilityLiveRegion="polite" className="text-sm text-danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

export function BookingForm({ provider, onBooked }: BookingFormProps) {
  const createBooking = useCreateBooking();
  const [picker, setPicker] = useState<{ mode: 'date' | 'time'; value: Date } | null>(
    null,
  );

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { date: '', time: '', notes: '' },
    mode: 'onSubmit',
  });

  const openDatePicker = () =>
    setPicker({ mode: 'date', value: fromDateValue(getValues('date')) ?? new Date() });

  const openTimePicker = () =>
    setPicker({ mode: 'time', value: fromTimeValue(getValues('time')) ?? new Date() });

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
    <View className="gap-6">
      {/* The service is picked on the previous screen, so it is read-only here. */}
      <Card tone="soft" className="mx-4">
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
          <Badge label={provider.category} tone="surface" />
        </View>
      </Card>

      <View>
        <View className="px-4">
          <FieldLabel error={errors.date?.message}>Choose a date</FieldLabel>
        </View>
        <Controller
          control={control}
          name="date"
          render={({ field: { onChange, value } }) => (
            <DateStrip value={value} onChange={onChange} onPickAnother={openDatePicker} />
          )}
        />
      </View>

      <View className="px-4">
        <FieldLabel error={errors.time?.message}>Choose a time</FieldLabel>
        <Controller
          control={control}
          name="time"
          render={({ field: { onChange, value } }) => (
            <TimeSlots value={value} onChange={onChange} onPickAnother={openTimePicker} />
          )}
        />
      </View>

      <View className="px-4">
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
      </View>

      <View className="px-4">
        <Button
          label="Confirm Booking"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          testID="booking-submit"
        />
      </View>

      <NativePickerSheet
        open={picker !== null}
        mode={picker?.mode ?? 'date'}
        title={picker?.mode === 'time' ? 'Choose a time' : 'Choose a date'}
        value={picker?.value ?? new Date()}
        minimumDate={picker?.mode === 'date' ? startOfToday() : undefined}
        onConfirm={(picked) => {
          if (picker?.mode === 'time') {
            setValue('time', toTimeValue(picked));
          } else {
            setValue('date', toDateValue(picked));
          }
          setPicker(null);
        }}
        onDismiss={() => setPicker(null)}
      />
    </View>
  );
}
