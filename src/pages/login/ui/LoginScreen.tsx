import { Ionicons } from '@expo/vector-icons';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';

import { LoginForm } from '../../../features/auth/login';
import { colors } from '../../../shared/config/theme';
import { Screen } from '../../../shared/ui';

export function LoginScreen() {
  return (
    <Screen edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="grow justify-center px-6 py-10"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-8">
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary">
              <Ionicons name="sparkles" size={26} color={colors.surface} />
            </View>
            <Text
              accessibilityRole="header"
              className="mt-6 text-3xl font-bold leading-9 text-ink"
            >
              Welcome back
            </Text>
            <Text className="mt-2 text-base leading-6 text-ink-muted">
              Sign in to continue booking trusted services.
            </Text>
          </View>

          <LoginForm />

          <Text className="mt-8 text-center text-xs leading-5 text-ink-muted">
            Demo build — any valid email and password signs you in.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
