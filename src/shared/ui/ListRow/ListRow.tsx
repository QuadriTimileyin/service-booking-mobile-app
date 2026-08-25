import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '../../config/theme';

interface ListRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  /** Right hand text, for rows that show a value instead of a chevron. */
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
}

/** A settings style row. Static when there is no onPress. */
export function ListRow({ icon, label, value, onPress, destructive }: ListRowProps) {
  const tint = destructive ? colors.danger : colors.inkMuted;

  const content = (
    <View className="min-h-[56px] flex-row items-center gap-3 px-4 py-3">
      <View
        className={`h-9 w-9 items-center justify-center rounded-full ${
          destructive ? 'bg-danger/10' : 'bg-surface-muted'
        }`}
      >
        <Ionicons name={icon} size={18} color={tint} />
      </View>

      <Text
        className={`flex-1 text-base ${destructive ? 'font-medium text-danger' : 'text-ink'}`}
      >
        {label}
      </Text>

      {value ? <Text className="text-sm text-ink-muted">{value}</Text> : null}
      {onPress && !value ? (
        <Ionicons name="chevron-forward" size={18} color={colors.inkMuted} />
      ) : null}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="active:bg-surface-muted"
    >
      {content}
    </Pressable>
  );
}
