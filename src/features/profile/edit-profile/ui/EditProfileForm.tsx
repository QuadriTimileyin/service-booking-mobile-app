import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TextInput, View } from 'react-native';

import { useUserStore, type UserProfile } from '../../../../entities/user';
import { Button, Input } from '../../../../shared/ui';
import { profileSchema, type ProfileFormValues } from '../model';

interface EditProfileFormProps {
  profile: UserProfile;
  onSaved: () => void;
}

export function EditProfileForm({ profile, onSaved }: EditProfileFormProps) {
  const updateProfile = useUserStore((state) => state.updateProfile);
  const emailRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: profile.name, email: profile.email },
    mode: 'onSubmit',
  });

  const onSubmit = (values: ProfileFormValues) => {
    updateProfile({ name: values.name.trim(), email: values.email.trim() });
    onSaved();
  };

  return (
    <View className="gap-4">
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Full name"
            placeholder="Your name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name?.message}
            autoCapitalize="words"
            autoComplete="name"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
            testID="profile-name"
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            ref={emailRef}
            label="Email"
            placeholder="you@example.com"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onSubmit)}
            testID="profile-email"
          />
        )}
      />

      <Button
        label="Save changes"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        className="mt-2"
        testID="profile-save"
      />
    </View>
  );
}
