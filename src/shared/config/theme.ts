/**
 * Design tokens that must be available to JavaScript APIs which cannot consume
 * Tailwind classes (navigation themes, RefreshControl tint, vector icons).
 * Keep these values in sync with `tailwind.config.js`.
 */
export const colors = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primarySoft: '#EFF6FF',
  ink: '#0F172A',
  inkMuted: '#64748B',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F5F9',
  page: '#F8FAFC',
  line: '#E2E8F0',
  success: '#16A34A',
  danger: '#DC2626',
} as const;

/** Minimum touch target recommended by the iOS/Android accessibility guidelines. */
export const MIN_TOUCH_TARGET = 44;
