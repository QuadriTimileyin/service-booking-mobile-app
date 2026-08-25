import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute, type RouteProp } from '@react-navigation/native';

import { BookingsScreen } from '../../pages/bookings';
import { colors } from '../../shared/config/theme';
import { ProfileNavigator } from './ProfileNavigator';
import { ServicesNavigator } from './ServicesNavigator';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

/** Screens that take over the whole page, so the tab bar steps out of the way. */
const FULL_SCREEN_ROUTES = ['ServiceDetails', 'Booking', 'BookingSuccess', 'EditProfile'];

const hideTabBarOnNestedScreens = ({ route }: { route: RouteProp<MainTabParamList> }) => {
  const focused = getFocusedRouteNameFromRoute(route);
  return focused && FULL_SCREEN_ROUTES.includes(focused)
    ? ({ tabBarStyle: { display: 'none' } } as const)
    : undefined;
};

export function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inkMuted,
        tabBarStyle: { borderTopColor: colors.line, backgroundColor: colors.surface },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
      }}
    >
      <Tab.Screen
        name="ServicesTab"
        component={ServicesNavigator}
        options={({ route }) => ({
          ...hideTabBarOnNestedScreens({ route }),
          title: 'Services',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              size={size}
              color={color}
            />
          ),
        })}
      />
      <Tab.Screen
        name="BookingsTab"
        component={BookingsScreen}
        options={{
          title: 'My Bookings',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={({ route }) => ({
          ...hideTabBarOnNestedScreens({ route }),
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={size}
              color={color}
            />
          ),
        })}
      />
    </Tab.Navigator>
  );
}
