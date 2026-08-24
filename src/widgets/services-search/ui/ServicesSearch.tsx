import { Ionicons } from '@expo/vector-icons';
import { Pressable, TextInput, View } from 'react-native';

import { colors } from '../../../shared/config/theme';

interface ServicesSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ServicesSearch({ value, onChange }: ServicesSearchProps) {
  return (
    <View className="mx-4 flex-row items-center rounded-control border border-line bg-surface px-3">
      <Ionicons name="search" size={18} color={colors.inkMuted} />
      <TextInput
        accessibilityLabel="Search services"
        placeholder="Search by provider, company or city"
        placeholderTextColor={colors.inkMuted}
        value={value}
        onChangeText={onChange}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="never"
        className="h-12 flex-1 px-2 text-base text-ink"
        testID="services-search"
      />
      {value.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={8}
          onPress={() => onChange('')}
        >
          <Ionicons name="close-circle" size={18} color={colors.inkMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}
