/** Bookings keep date and time as plain strings, so storage stays simple. */

export const toDateValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const toTimeValue = (date: Date): string => {
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${hours}:${minutes}`;
};

/** Parses `YYYY-MM-DD` into a local-midnight Date, avoiding UTC drift. */
export const fromDateValue = (value: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(date.getTime()) ? null : date;
};

export const fromTimeValue = (value: string, base = new Date()): Date | null => {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const [, hours, minutes] = match;
  const date = new Date(base);
  date.setHours(Number(hours), Number(minutes), 0, 0);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const startOfToday = (): Date => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

export const isPastDate = (value: string): boolean => {
  const date = fromDateValue(value);
  if (!date) return false;
  return date.getTime() < startOfToday().getTime();
};

/** "Mon, 3 Feb 2025", readable without depending on a date library. */
export const formatDateLabel = (value: string): string => {
  const date = fromDateValue(value);
  if (!date) return value;
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatTimeLabel = (value: string): string => {
  const date = fromTimeValue(value);
  if (!date) return value;
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
};
