import { Text, View } from 'react-native';

import type { UserProfile } from '../../../entities/user';
import { getInitials } from '../../../shared/lib/formatting';

interface ProfileHeaderProps {
  profile: UserProfile;
}

/** Identity card at the top of Profile. Initials stand in for an avatar. */
export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <View className="items-center rounded-card border border-line bg-surface px-4 py-6">
      <View className="h-20 w-20 items-center justify-center rounded-full bg-primary-soft">
        <Text className="text-2xl font-bold text-primary-dark">
          {getInitials(profile.name)}
        </Text>
      </View>

      <Text className="mt-4 text-xl font-bold text-ink">{profile.name}</Text>
      <Text className="mt-1 text-sm text-ink-muted">{profile.email}</Text>

      <View className="mt-3 rounded-full bg-primary-soft px-3 py-1">
        <Text className="text-xs font-semibold text-primary-dark">Customer</Text>
      </View>
    </View>
  );
}
