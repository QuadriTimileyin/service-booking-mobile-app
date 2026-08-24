import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '../../config/theme';
import { Button } from '../Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retrying?: boolean;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  retrying = false,
}: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-danger/10">
        <Ionicons name="cloud-offline-outline" size={28} color={colors.danger} />
      </View>
      <Text className="mt-4 text-center text-lg font-semibold text-ink">{title}</Text>
      <Text className="mt-2 text-center text-sm leading-5 text-ink-muted">{message}</Text>
      {onRetry ? (
        <View className="mt-6 w-full max-w-xs">
          <Button label="Try again" onPress={onRetry} loading={retrying} />
        </View>
      ) : null}
    </View>
  );
}
