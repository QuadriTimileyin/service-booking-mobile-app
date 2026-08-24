import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '../../config/theme';
import { Button } from '../Button';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = 'search-outline',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-soft">
        <Ionicons name={icon} size={28} color={colors.primary} />
      </View>
      <Text className="mt-4 text-center text-lg font-semibold text-ink">{title}</Text>
      {description ? (
        <Text className="mt-2 text-center text-sm leading-5 text-ink-muted">
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <View className="mt-6 w-full max-w-xs">
          <Button label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}
