import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Platform, Pressable, Text, View } from 'react-native';

import { colors } from '../../config/theme';
import {
  formatDateLabel,
  formatTimeLabel,
  fromDateValue,
  fromTimeValue,
  toDateValue,
  toTimeValue,
} from '../../lib/dates';

interface DateTimeFieldProps {
  label: string;
  mode: 'date' | 'time';
  /** `YYYY-MM-DD` for date mode, `HH:mm` for time mode. */
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  minimumDate?: Date;
}

const parse = (mode: 'date' | 'time', value: string): Date | null =>
  mode === 'date' ? fromDateValue(value) : fromTimeValue(value);

const serialise = (mode: 'date' | 'time', date: Date): string =>
  mode === 'date' ? toDateValue(date) : toTimeValue(date);

const display = (mode: 'date' | 'time', value: string): string =>
  mode === 'date' ? formatDateLabel(value) : formatTimeLabel(value);

/**
 * Native date/time picker presented as a form field.
 *
 * Android shows the platform dialog directly; iOS embeds the spinner in a sheet
 * with an explicit confirm action, which is the platform-expected behaviour.
 */
export function DateTimeField({
  label,
  mode,
  value,
  onChange,
  placeholder,
  error,
  minimumDate,
}: DateTimeFieldProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Date>(() => parse(mode, value) ?? new Date());

  const openPicker = () => {
    setDraft(parse(mode, value) ?? new Date());
    setOpen(true);
  };

  const handleAndroidChange = (event: DateTimePickerEvent, date?: Date) => {
    setOpen(false);
    if (event.type === 'set' && date) onChange(serialise(mode, date));
  };

  const confirmIos = () => {
    setOpen(false);
    onChange(serialise(mode, draft));
  };

  const picker = (
    <DateTimePicker
      value={draft}
      mode={mode}
      minimumDate={minimumDate}
      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      onChange={
        Platform.OS === 'ios'
          ? (_event, date) => date && setDraft(date)
          : handleAndroidChange
      }
    />
  );

  return (
    <View>
      <Text className="mb-2 text-sm font-medium text-ink">{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{ text: value ? display(mode, value) : placeholder }}
        onPress={openPicker}
        className={`min-h-[52px] flex-row items-center justify-between rounded-control border bg-surface px-4 py-3 active:bg-surface-muted ${
          error ? 'border-danger' : 'border-line'
        }`}
      >
        <Text className={`text-base ${value ? 'text-ink' : 'text-ink-muted'}`}>
          {value ? display(mode, value) : placeholder}
        </Text>
        <Ionicons
          name={mode === 'date' ? 'calendar-outline' : 'time-outline'}
          size={20}
          color={colors.inkMuted}
        />
      </Pressable>
      {error ? (
        <Text accessibilityLiveRegion="polite" className="mt-1.5 text-sm text-danger">
          {error}
        </Text>
      ) : null}

      {open && Platform.OS === 'android' ? picker : null}

      {Platform.OS === 'ios' ? (
        <Modal visible={open} transparent animationType="slide">
          <Pressable
            accessibilityLabel="Dismiss picker"
            onPress={() => setOpen(false)}
            className="flex-1 bg-black/40"
          />
          <View className="bg-surface pb-8">
            <View className="flex-row items-center justify-between border-b border-line px-4 py-3">
              <Pressable accessibilityRole="button" onPress={() => setOpen(false)}>
                <Text className="text-base text-ink-muted">Cancel</Text>
              </Pressable>
              <Text className="text-base font-semibold text-ink">{label}</Text>
              <Pressable accessibilityRole="button" onPress={confirmIos}>
                <Text className="text-base font-semibold text-primary">Done</Text>
              </Pressable>
            </View>
            {open ? picker : null}
          </View>
        </Modal>
      ) : null}
    </View>
  );
}
