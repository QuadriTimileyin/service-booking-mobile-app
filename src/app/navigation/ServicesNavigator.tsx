import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BookingScreen } from '../../pages/create-booking';
import { ServiceDetailsScreen } from '../../pages/service-details';
import { ServicesScreen } from '../../pages/services';
import { colors } from '../../shared/config/theme';
import type { ServicesStackParamList } from './types';

const Stack = createNativeStackNavigator<ServicesStackParamList>();

export function ServicesNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: { color: colors.ink, fontSize: 17, fontWeight: '600' },
        headerTintColor: colors.primary,
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.page },
      }}
    >
      <Stack.Screen
        name="Services"
        component={ServicesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ServiceDetails"
        component={ServiceDetailsScreen}
        options={{ title: 'Service details' }}
      />
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{ title: 'Book service' }}
      />
    </Stack.Navigator>
  );
}
