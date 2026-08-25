import { View, type ViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

interface ScreenProps extends ViewProps {
  edges?: readonly Edge[];
  className?: string;
}

/** Page background and safe area handling, same on every screen. */
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
