import { Text, View } from 'react-native';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function ScreenHeader({ title, subtitle, action }: ScreenHeaderProps) {
  return (
    <View className="flex-row items-start justify-between gap-3 px-4 pb-3 pt-2">
      <View className="flex-1">
        <Text
          accessibilityRole="header"
          className="text-2xl font-bold leading-8 text-ink"
        >
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-1 text-sm text-ink-muted">{subtitle}</Text>
        ) : null}
      </View>
      {action}
    </View>
  );
}
