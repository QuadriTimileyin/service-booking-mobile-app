import { Text, View } from 'react-native';

type BadgeTone = 'primary' | 'neutral' | 'success' | 'surface';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
}

const TONE: Record<BadgeTone, { container: string; text: string }> = {
  primary: { container: 'bg-primary-soft', text: 'text-primary-dark' },
  neutral: { container: 'bg-surface-muted', text: 'text-ink-muted' },
  success: { container: 'bg-success/10', text: 'text-success' },
  // For use on a tinted card, where the soft tone would disappear.
  surface: { container: 'bg-surface', text: 'text-primary-dark' },
};

export function Badge({ label, tone = 'primary' }: BadgeProps) {
  return (
    <View className={`self-start rounded-full px-3 py-1 ${TONE[tone].container}`}>
      <Text className={`text-xs font-semibold ${TONE[tone].text}`}>{label}</Text>
    </View>
  );
}
