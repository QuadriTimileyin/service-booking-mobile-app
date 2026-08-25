import { NavigationContainer, type Theme } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';

import { useAuthStore } from '../../entities/user';
import { colors } from '../../shared/config/theme';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

const navigationTheme: Theme = {
  dark: false,
  colors: {
    primary: colors.primary,
    background: colors.page,
    card: colors.surface,
    text: colors.ink,
    border: colors.line,
    notification: colors.danger,
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: '600' },
    heavy: { fontFamily: 'System', fontWeight: '700' },
  },
};

export function RootNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  // Wait for the saved session before choosing a stack.
  if (!hasHydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-page">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
