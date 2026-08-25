import { Pressable, Text, View } from 'react-native';

import { formatTimeLabel } from '../../lib/dates';

interface TimeSlotsProps {
  /** `HH:mm`, or empty when nothing is chosen yet. */
  value: string;
  onChange: (value: string) => void;
  onPickAnother: () => void;
}

/** Working hours, on the hour. Anything else goes through the clock picker. */
const SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

export function TimeSlots({ value, onChange, onPickAnother }: TimeSlotsProps) {
  const outsideSlots = value.length > 0 && !SLOTS.includes(value);

  return (
    <View className="flex-row flex-wrap gap-2">
      {SLOTS.map((slot) => {
        const selected = slot === value;
        return (
          <Pressable
            key={slot}
            accessibilityRole="button"
            accessibilityLabel={formatTimeLabel(slot)}
            accessibilityState={{ selected }}
            onPress={() => onChange(slot)}
            className={`h-11 justify-center rounded-full border px-4 ${
              selected ? 'border-primary bg-primary' : 'border-line bg-surface'
            }`}
            testID={`time-${slot}`}
          >
            <Text
              className={`text-sm font-medium ${selected ? 'text-white' : 'text-ink'}`}
            >
              {formatTimeLabel(slot)}
            </Text>
          </Pressable>
        );
      })}

      {outsideSlots ? (
        <View className="h-11 justify-center rounded-full border border-primary bg-primary px-4">
          <Text className="text-sm font-medium text-white">{formatTimeLabel(value)}</Text>
        </View>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Pick another time"
        onPress={onPickAnother}
        className="h-11 justify-center rounded-full border border-line bg-surface px-4 active:bg-surface-muted"
        testID="time-other"
      >
        <Text className="text-sm font-medium text-ink-muted">Other time</Text>
      </Pressable>
    </View>
  );
}
