import tokens from './tokens';

/**
 * Flat colour list for the places that cannot take a Tailwind class: the
 * navigation theme, vector icons and the pull-to-refresh spinner.
 * The values come from tokens.js, so there is only one place to edit.
 */
export const colors = {
  primary: tokens.colors.primary.DEFAULT,
  primaryDark: tokens.colors.primary.dark,
  primarySoft: tokens.colors.primary.soft,
  ink: tokens.colors.ink.DEFAULT,
  inkMuted: tokens.colors.ink.muted,
  surface: tokens.colors.surface.DEFAULT,
  surfaceMuted: tokens.colors.surface.muted,
  page: tokens.colors.surface.page,
  line: tokens.colors.line,
  success: tokens.colors.success,
  warning: tokens.colors.warning,
  danger: tokens.colors.danger,
} as const;

/** Smallest tap target Apple and Google both recommend. */
export const MIN_TOUCH_TARGET = 44;
