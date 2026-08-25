// React 19 needs this flag for act() outside the react-dom test environment.
global.IS_REACT_ACT_ENVIRONMENT = true;

// AsyncStorage has no native module under Jest, so use the official mock.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Haptics do nothing outside a real device.
jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  NotificationFeedbackType: { Success: 'success' },
  ImpactFeedbackStyle: { Medium: 'medium' },
}));

/**
 * Reanimated's own mock still starts the native worklets runtime, which Jest
 * does not have. This stand-in covers what the app uses: animated views render
 * as plain views and animations settle on their target value.
 */
jest.mock('react-native-reanimated', () => {
  const RN = require('react-native');

  // Entering and layout builders chain, like FadeInDown.delay(x).duration(y).
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

// Safe area insets have no native provider under Jest.
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);
