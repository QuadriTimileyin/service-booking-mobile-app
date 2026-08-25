import type { NavigatorScreenParams } from '@react-navigation/native';

/**
 * Param lists sit in shared so pages can type their props without importing app,
 * which would break the layer rule. Screens carry ids only. The entity itself is
 * read from the query cache or the store.
 */
export type ServicesStackParamList = {
  Services: undefined;
  ServiceDetails: { serviceId: number };
  Booking: { serviceId: number };
  BookingSuccess: { bookingId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
};

export type MainTabParamList = {
  ServicesTab: NavigatorScreenParams<ServicesStackParamList>;
  BookingsTab: undefined;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type OnboardingStackParamList = {
  Onboarding: undefined;
};

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends MainTabParamList {}
  }
}
