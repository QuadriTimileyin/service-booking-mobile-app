/**
 * The one place to change how the app looks.
 *
 * tailwind.config.js reads this file, and shared/config/theme.ts re-exports it
 * for the few APIs that cannot take Tailwind classes. Change a value here and it
 * updates everywhere, both the classes and the JavaScript side.
 */
const colors = {
  primary: {
    DEFAULT: '#0F8A5F',
    dark: '#08734F',
    soft: '#E8F5EF',
  },
  ink: {
    DEFAULT: '#111827',
    muted: '#6B7280',
  },
  surface: {
    DEFAULT: '#FFFFFF',
    muted: '#F3F4F6',
    page: '#F7FAF8',
  },
  line: '#E5E7EB',
  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
};

/** Named radii, so a card and a button never drift apart. */
const radius = {
  control: '14px',
  card: '20px',
};

module.exports = { colors, radius };
