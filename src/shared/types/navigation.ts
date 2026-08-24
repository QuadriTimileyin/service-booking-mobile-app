import type { NavigatorScreenParams } from '@react-navigation/native';

/**
 * Navigation param lists live in `shared` so that page components can type their
 * props without importing from the `app` layer, which would invert the
 * Feature-Sliced dependency direction.
 *
 * Screens receive ids only; the corresponding entity is resolved from the query
 * cache or the store.
 */
export type ServicesStackParamList = {
  Services: undefined;
  ServiceDetails: { serviceId: number };
  Booking: { serviceId: number };
};

export type MainTabParamList = {
  ServicesTab: NavigatorScreenParams<ServicesStackParamList>;
  BookingsTab: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends MainTabParamList {}
  }
}
