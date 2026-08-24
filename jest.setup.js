// React 19 requires this flag for `act()` support outside react-dom's test env.
global.IS_REACT_ACT_ENVIRONMENT = true;

// AsyncStorage has no native module under Jest; use the library's official mock.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Haptics are a no-op outside a device runtime.
jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  NotificationFeedbackType: { Success: 'success' },
  ImpactFeedbackStyle: { Medium: 'medium' },
}));

/**
 * Reanimated's own mock still boots the native worklets runtime, which does not
 * exist under Jest. This stand-in covers the surface the app actually uses:
 * animated views render as plain views and animations resolve to their target.
 */
jest.mock('react-native-reanimated', () => {
  const RN = require('react-native');

  // Entering/exiting/layout builders are chainable: FadeInDown.delay(x).duration(y).
  const builder = new Proxy(() => builder, {
    get: () => builder,
    apply: () => builder,
  });

  const Animated = {
    View: RN.View,
    Text: RN.Text,
    ScrollView: RN.ScrollView,
    FlatList: RN.FlatList,
    createAnimatedComponent: (component) => component,
  };

  return {
    __esModule: true,
    default: Animated,
    ...Animated,
    FadeIn: builder,
    FadeInDown: builder,
    FadeOut: builder,
    LinearTransition: builder,
    Easing: new Proxy({}, { get: () => () => undefined }),
    useSharedValue: (initial) => ({ value: initial }),
    useAnimatedStyle: (factory) => factory(),
    withTiming: (value) => value,
    withRepeat: (value) => value,
    withSpring: (value) => value,
  };
});

// Safe-area insets have no native provider under Jest.
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);
