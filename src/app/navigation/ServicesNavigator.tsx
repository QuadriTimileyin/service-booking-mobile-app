import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BookingSuccessScreen } from '../../pages/booking-success';
import { BookingScreen } from '../../pages/create-booking';
import { ServiceDetailsScreen } from '../../pages/service-details';
import { ServicesScreen } from '../../pages/services';
import { screenOptions } from './screenOptions';
import type { ServicesStackParamList } from './types';

const Stack = createNativeStackNavigator<ServicesStackParamList>();

export function ServicesNavigator() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
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
      <Stack.Screen
        name="BookingSuccess"
        component={BookingSuccessScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}
