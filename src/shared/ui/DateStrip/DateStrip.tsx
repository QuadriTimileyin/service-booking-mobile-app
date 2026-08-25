import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { colors } from '../../config/theme';
import { fromDateValue, toDateValue } from '../../lib/dates';

interface DateStripProps {
  /** `YYYY-MM-DD`, or empty when nothing is chosen yet. */
  value: string;
  onChange: (value: string) => void;
  /** How many days from today to offer as quick picks. */
  days?: number;
  onPickAnother: () => void;
}

const WEEKDAY = new Intl.DateTimeFormat(undefined, { weekday: 'short' });

/** Quick day picker for the next couple of weeks, with a way out to the calendar. */
export function DateStrip({ value, onChange, days = 14, onPickAnother }: DateStripProps) {
  const options = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Array.from({ length: days }, (_, offset) => {
      const date = new Date(today);
      date.setDate(today.getDate() + offset);
      return {
        key: toDateValue(date),
        weekday: offset === 0 ? 'Today' : WEEKDAY.format(date),
        day: `${date.getDate()}`,
      };
    });
  }, [days]);

  // A date outside the strip still needs to show somewhere.
  const outsideStrip =
    value.length > 0 && !options.some((option) => option.key === value)
      ? fromDateValue(value)
      : null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 px-4"
    >
      {options.map((option) => {
        const selected = option.key === value;
        return (
          <Pressable
            key={option.key}
            accessibilityRole="button"
            accessibilityLabel={`${option.weekday} ${option.day}`}
            accessibilityState={{ selected }}
            onPress={() => onChange(option.key)}
            className={`h-[68px] w-[60px] items-center justify-center rounded-control border ${
              selected ? 'border-primary bg-primary' : 'border-line bg-surface'
            }`}
            testID={`date-${option.key}`}
          >
            <Text
              className={`text-xs font-medium ${selected ? 'text-white' : 'text-ink-muted'}`}
            >
              {option.weekday}
            </Text>
            <Text
              className={`mt-1 text-lg font-bold ${selected ? 'text-white' : 'text-ink'}`}
            >
              {option.day}
            </Text>
          </Pressable>
        );
      })}

      {outsideStrip ? (
        <View className="h-[68px] w-[60px] items-center justify-center rounded-control border border-primary bg-primary">
          <Text className="text-xs font-medium text-white">
            {WEEKDAY.format(outsideStrip)}
          </Text>
          <Text className="mt-1 text-lg font-bold text-white">
            {outsideStrip.getDate()}
          </Text>
        </View>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Pick another date"
        onPress={onPickAnother}
        className="h-[68px] w-[60px] items-center justify-center rounded-control border border-line bg-surface active:bg-surface-muted"
        testID="date-other"
      >
        <Ionicons name="calendar-outline" size={20} color={colors.inkMuted} />
        <Text className="mt-1 text-xs font-medium text-ink-muted">More</Text>
      </Pressable>
    </ScrollView>
  );
}
