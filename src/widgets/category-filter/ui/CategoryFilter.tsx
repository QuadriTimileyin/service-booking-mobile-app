import { Pressable, ScrollView, Text } from 'react-native';

import { SERVICE_CATEGORIES } from '../../../entities/service';
import {
  ALL_CATEGORIES,
  type CategoryFilterValue,
} from '../../../features/services/filter-services';

interface CategoryFilterProps {
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
}

const OPTIONS: CategoryFilterValue[] = [ALL_CATEGORIES, ...SERVICE_CATEGORIES];

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 px-4 py-3"
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
            className={`h-11 justify-center rounded-full border px-4 ${
              selected
                ? 'border-primary bg-primary'
                : 'border-line bg-surface active:bg-surface-muted'
            }`}
            testID={`category-${option}`}
          >
            <Text
              className={`text-sm font-medium ${selected ? 'text-white' : 'text-ink-muted'}`}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
