import { loginSchema } from '../src/features/auth/login';

const firstError = (result: ReturnType<typeof loginSchema.safeParse>, field: string) =>
  result.success
    ? undefined
    : result.error.issues.find((issue) => issue.path[0] === field)?.message;

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({
      email: 'timmy@example.com',
      password: 'password123',
    });

    expect(result.success).toBe(true);
  });

  it('rejects a missing email', () => {
    const result = loginSchema.safeParse({ email: '', password: 'password123' });

    expect(result.success).toBe(false);
    expect(firstError(result, 'email')).toBe('Email is required');
  });

  it('rejects an invalid email format', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'pw' });

    expect(result.success).toBe(false);
    expect(firstError(result, 'email')).toBe('Enter a valid email address');
  });

  it('rejects a missing password', () => {
    const result = loginSchema.safeParse({ email: 'timmy@example.com', password: '' });

    expect(result.success).toBe(false);
    expect(firstError(result, 'password')).toBe('Password is required');
  });
});
