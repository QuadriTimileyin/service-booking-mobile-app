import { userEvent, waitFor } from '@testing-library/react-native';

import { useUserStore } from '../src/entities/user';
import { LoginForm } from '../src/features/auth/login';
import { renderWithProviders } from './helpers/renderWithProviders';

describe('LoginForm', () => {
  beforeEach(() => {
    useUserStore.setState({ isAuthenticated: false, profile: null });
  });

  it('shows validation messages when the form is empty', async () => {
    const user = userEvent.setup();
    const screen = await renderWithProviders(<LoginForm />);

    await user.press(screen.getByTestId('login-submit'));

    expect(await screen.findByText('Email is required')).toBeTruthy();
    expect(screen.getByText('Password is required')).toBeTruthy();
    expect(useUserStore.getState().isAuthenticated).toBe(false);
  });

  it('rejects a malformed email address', async () => {
    const user = userEvent.setup();
    const screen = await renderWithProviders(<LoginForm />);

    await user.type(screen.getByTestId('login-email'), 'not-an-email');
    await user.type(screen.getByTestId('login-password'), 'password123');
    await user.press(screen.getByTestId('login-submit'));

    expect(await screen.findByText('Enter a valid email address')).toBeTruthy();
    expect(useUserStore.getState().isAuthenticated).toBe(false);
  });

  it('signs the user in with valid credentials', async () => {
    const user = userEvent.setup();
    const screen = await renderWithProviders(<LoginForm />);

    await user.type(screen.getByTestId('login-email'), 'timmy@example.com');
    await user.type(screen.getByTestId('login-password'), 'password123');
    await user.press(screen.getByTestId('login-submit'));

    await waitFor(() => expect(useUserStore.getState().isAuthenticated).toBe(true));
    expect(useUserStore.getState().profile).toEqual({
      name: 'Timmy',
      email: 'timmy@example.com',
    });
  });
});
