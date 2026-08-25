const { colors } = require('./src/shared/config/tokens');

/**
 * Reads the same tokens as the app, so a rebrand does not leave the splash and
 * icon backgrounds on the old colour.
 */
module.exports = {
  expo: {
    name: 'Service Booking',
    slug: 'service-booking-mobile-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    scheme: 'servicebooking',
    userInterfaceStyle: 'light',
    backgroundColor: colors.surface.page,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.timileyinquadri.servicebooking',
    },
    android: {
      package: 'com.timileyinquadri.servicebooking',
      adaptiveIcon: {
        backgroundColor: colors.primary.soft,
        foregroundImage: './assets/android-icon-foreground.png',
        backgroundImage: './assets/android-icon-background.png',
        monochromeImage: './assets/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: ['expo-asset', 'expo-font', '@react-native-community/datetimepicker'],
  },
};
