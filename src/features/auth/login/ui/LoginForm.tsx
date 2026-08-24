import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TextInput, View } from 'react-native';

import { useAuthStore } from '../../../../entities/user';
import { Button, Input } from '../../../../shared/ui';
import { loginSchema, type LoginFormValues } from '../model';

export function LoginForm() {
  const signIn = useAuthStore((state) => state.signIn);
  const passwordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  });

  /** Mock sign-in: validation passing is the only gate. */
  const onSubmit = ({ email }: LoginFormValues) => signIn(email.trim());

  return (
    <View className="gap-4">
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Email"
            placeholder="you@example.com"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            testID="login-email"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            ref={passwordRef}
            label="Password"
            placeholder="Enter your password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password?.message}
            secureTextEntry
            autoCapitalize="none"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={handleSubmit(onSubmit)}
            testID="login-password"
          />
        )}
      />

      <Button
        label="Sign in"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        className="mt-2"
        testID="login-submit"
      />
    </View>
  );
}
