import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { selectProfile, useUserStore } from '../../../entities/user';
import { EditProfileForm } from '../../../features/profile/edit-profile';
import type { ProfileStackParamList } from '../../../shared/types';
import { EmptyState, Screen } from '../../../shared/ui';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

export function EditProfileScreen({ navigation }: Props) {
  const profile = useUserStore(selectProfile);

  if (!profile) {
    return (
      <Screen edges={[]}>
        <EmptyState
          icon="person-outline"
          title="No profile yet"
          description="Sign in again to edit your details."
          actionLabel="Go back"
          onAction={() => navigation.goBack()}
        />
      </Screen>
    );
  }

  return (
    <Screen edges={[]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 96 : 0}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="px-4 pb-10 pt-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <EditProfileForm profile={profile} onSaved={() => navigation.goBack()} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
