import { Pressable } from 'react-native';

interface IconButtonProps {
  /** Required. Without it a screen reader cannot announce an icon-only button. */
  accessibilityLabel: string;
  onPress: () => void;
  children: React.ReactNode;
  className?: string;
}

export function IconButton({
  accessibilityLabel,
  onPress,
  children,
  className = '',
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      onPress={onPress}
      className={`h-11 w-11 items-center justify-center rounded-full active:bg-surface-muted ${className}`}
    >
      {children}
    </Pressable>
  );
}
