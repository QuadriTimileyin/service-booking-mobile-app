import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { colors } from '../../shared/config/theme';

/** One header treatment for every stack in the app. */
export const screenOptions: NativeStackNavigationOptions = {
  headerTitleStyle: { color: colors.ink, fontSize: 17, fontWeight: '600' },
  headerTintColor: colors.primary,
  headerStyle: { backgroundColor: colors.surface },
  headerShadowVisible: false,
  headerBackButtonDisplayMode: 'minimal',
  contentStyle: { backgroundColor: colors.page },
};
