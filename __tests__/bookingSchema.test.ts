import { bookingSchema, NOTES_MAX_LENGTH } from '../src/features/booking/create-booking';
import { toDateValue } from '../src/shared/lib/dates';

const messageFor = (result: ReturnType<typeof bookingSchema.safeParse>, field: string) =>
  result.success
    ? undefined
    : result.error.issues.find((issue) => issue.path[0] === field)?.message;

const inDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toDateValue(date);
};

describe('bookingSchema', () => {
  it('accepts a valid booking', () => {
    const result = bookingSchema.safeParse({
      date: inDays(1),
      time: '14:30',
      notes: 'Gate code is 1234',
    });

    expect(result.success).toBe(true);
  });

  it('accepts today as the booking date', () => {
    const result = bookingSchema.safeParse({ date: inDays(0), time: '09:00', notes: '' });

    expect(result.success).toBe(true);
  });

  it('rejects a missing date', () => {
    const result = bookingSchema.safeParse({ date: '', time: '09:00', notes: '' });

    expect(messageFor(result, 'date')).toBe('Please choose a date');
  });

  it('rejects a date in the past', () => {
    const result = bookingSchema.safeParse({
      date: inDays(-1),
      time: '09:00',
      notes: '',
    });

    expect(messageFor(result, 'date')).toBe('The date cannot be in the past');
  });

  it('rejects a missing time', () => {
    const result = bookingSchema.safeParse({ date: inDays(1), time: '', notes: '' });

    expect(messageFor(result, 'time')).toBe('Please choose a time');
  });

  it('rejects notes longer than the limit', () => {
    const result = bookingSchema.safeParse({
      date: inDays(1),
      time: '09:00',
      notes: 'x'.repeat(NOTES_MAX_LENGTH + 1),
    });

    expect(messageFor(result, 'notes')).toContain(String(NOTES_MAX_LENGTH));
  });
});
