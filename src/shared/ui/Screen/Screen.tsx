import { View, type ViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

interface ScreenProps extends ViewProps {
  /** Which safe-area insets to apply; screens inside a tab bar skip the bottom. */
  edges?: readonly Edge[];
  className?: string;
}

/** Consistent page background, safe-area handling and horizontal rhythm. */
export function Screen({
  edges = ['top'],
  className = '',
  children,
  ...rest
}: ScreenProps) {
  return (
    <SafeAreaView edges={edges} className="flex-1 bg-surface-page">
      <View className={`flex-1 ${className}`} {...rest}>
        {children}
      </View>
    </SafeAreaView>
  );
}
