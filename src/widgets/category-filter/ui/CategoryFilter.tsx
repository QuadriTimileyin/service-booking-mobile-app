import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { SERVICE_CATEGORIES } from '../../../entities/service';
import {
  ALL_CATEGORIES,
  type CategoryFilterValue,
} from '../../../features/services/filter-services';
import { colors } from '../../../shared/config/theme';

interface CategoryFilterProps {
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
}

const ICONS: Record<CategoryFilterValue, keyof typeof Ionicons.glyphMap> = {
  All: 'apps-outline',
  'Car Wash': 'car-sport-outline',
  Cleaning: 'sparkles-outline',
  Plumbing: 'water-outline',
  Laundry: 'shirt-outline',
  Electrician: 'flash-outline',
};

const OPTIONS: CategoryFilterValue[] = [ALL_CATEGORIES, ...SERVICE_CATEGORIES];

/**
 * Icon tiles, so the categories read at a glance instead of as a row of words.
 * Keep press styling on the Pressable. An active: class on a plain View makes
 * NativeWind look for press state it cannot find, and the render throws.
 */
export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-3 px-4 py-1"
    >
      {OPTIONS.map((option) => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityLabel={`Filter by ${option}`}
            accessibilityState={{ selected }}
            onPress={() => onChange(option)}
            className="w-[76px] items-center gap-2 active:opacity-60"
            testID={`category-${option}`}
          >
            <View
              className={`h-[62px] w-[62px] items-center justify-center rounded-[20px] border ${
                selected ? 'border-primary bg-primary' : 'border-line bg-surface'
              }`}
            >
              <Ionicons
                name={ICONS[option]}
                size={26}
                color={selected ? colors.surface : colors.primary}
              />
            </View>

            <Text
              numberOfLines={1}
              className={`text-xs ${
                selected ? 'font-semibold text-ink' : 'font-medium text-ink-muted'
              }`}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
