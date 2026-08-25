import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, Text, View } from 'react-native';

import { selectProfile, useUserStore } from '../../../entities/user';
import { useLogout } from '../../../features/auth/logout';
import { APP_VERSION } from '../../../shared/config/env';
import type { MainTabParamList, ProfileStackParamList } from '../../../shared/types';
import { Card, ListRow, Screen } from '../../../shared/ui';
import { ProfileHeader } from '../../../widgets/profile-header';
import { ScreenHeader } from '../../../widgets/screen-header';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, 'Profile'>,
  BottomTabScreenProps<MainTabParamList>
>;

function SectionLabel({ children }: { children: string }) {
  return (
    <Text className="mb-2 mt-5 px-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
      {children}
    </Text>
  );
}

export function ProfileScreen({ navigation }: Props) {
  const profile = useUserStore(selectProfile);
  const confirmLogout = useLogout();

  return (
    <Screen>
      <ScreenHeader title="Profile" />

      <ScrollView
        contentContainerClassName="px-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        {profile ? <ProfileHeader profile={profile} /> : null}

        <SectionLabel>Account</SectionLabel>
        <Card className="overflow-hidden p-0">
          <ListRow
            icon="person-outline"
            label="Edit profile"
            onPress={() => navigation.navigate('EditProfile')}
          />
        </Card>

        <SectionLabel>App</SectionLabel>
        <Card className="overflow-hidden p-0">
          <ListRow
            icon="calendar-outline"
            label="My bookings"
            onPress={() => navigation.navigate('BookingsTab')}
          />
          <View className="h-px bg-line" />
          <ListRow
            icon="information-circle-outline"
            label="App version"
            value={APP_VERSION}
          />
        </Card>

        <SectionLabel>Session</SectionLabel>
        <Card className="overflow-hidden p-0">
          <ListRow
            icon="log-out-outline"
            label="Log out"
            onPress={confirmLogout}
            destructive
          />
        </Card>
      </ScrollView>
    </Screen>
  );
}
