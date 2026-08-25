import { NavigationContainer, type Theme } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';

import { usePreferencesStore } from '../../entities/preferences';
import { useUserStore } from '../../entities/user';
import { colors } from '../../shared/config/theme';
import { OnboardingScreen } from '../../pages/onboarding';
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

/**
 * Onboarding first, then login, then the app.
 * Nothing renders until both stores have read from storage, so the wrong screen
 * never flashes on launch.
 */
export function RootNavigator() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const userReady = useUserStore((state) => state.hasHydrated);
  const onboardingComplete = usePreferencesStore((state) => state.onboardingComplete);
  const preferencesReady = usePreferencesStore((state) => state.hasHydrated);

  if (!userReady || !preferencesReady) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-page">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {!onboardingComplete ? (
        <OnboardingScreen />
      ) : isAuthenticated ? (
        <MainNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
