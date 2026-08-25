import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { EditProfileScreen } from '../../pages/edit-profile';
import { ProfileScreen } from '../../pages/profile';
import { screenOptions } from './screenOptions';
import type { ProfileStackParamList } from './types';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit profile' }}
      />
    </Stack.Navigator>
  );
}
