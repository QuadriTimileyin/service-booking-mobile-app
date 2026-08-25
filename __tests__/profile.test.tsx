import { act, userEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { deriveNameFromEmail, useUserStore } from '../src/entities/user';
import { EditProfileForm } from '../src/features/profile/edit-profile';
import { ProfileScreen } from '../src/pages/profile';
import { createNavigationMock, renderWithProviders } from './helpers/renderWithProviders';

const PROFILE = { name: 'Timmy Quadri', email: 'timmy@example.com' };

describe('deriveNameFromEmail', () => {
  it('builds a display name from the address', () => {
    expect(deriveNameFromEmail('timmy@example.com')).toBe('Timmy');
    expect(deriveNameFromEmail('john.doe@example.com')).toBe('John Doe');
    expect(deriveNameFromEmail('ADA_LOVELACE@example.com')).toBe('Ada Lovelace');
  });

  it('falls back when there is nothing to work with', () => {
    expect(deriveNameFromEmail('@example.com')).toBe('Guest');
  });
});

describe('ProfileScreen', () => {
  beforeEach(() => {
    useUserStore.setState({ isAuthenticated: true, profile: PROFILE });
  });

  it('shows the signed in user', async () => {
    const screen = await renderWithProviders(
      <ProfileScreen
        navigation={createNavigationMock()}
        route={createNavigationMock()}
      />,
    );

    expect(screen.getByText('Timmy Quadri')).toBeTruthy();
    expect(screen.getByText('timmy@example.com')).toBeTruthy();
    expect(screen.getByText('Edit profile')).toBeTruthy();
    expect(screen.getByText('Log out')).toBeTruthy();
  });

  it('asks for confirmation before logging out', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const user = userEvent.setup();
    const screen = await renderWithProviders(
      <ProfileScreen
        navigation={createNavigationMock()}
        route={createNavigationMock()}
      />,
    );

    await user.press(screen.getByText('Log out'));

    expect(alertSpy).toHaveBeenCalled();
    expect(useUserStore.getState().isAuthenticated).toBe(true);

    const actions = alertSpy.mock.calls[0][2] as { text: string; onPress?: () => void }[];
    await act(async () => {
      actions.find((action) => action.text === 'Log out')?.onPress?.();
    });

    expect(useUserStore.getState().isAuthenticated).toBe(false);
    expect(useUserStore.getState().profile).toBeNull();

    alertSpy.mockRestore();
  });
});

describe('EditProfileForm', () => {
  beforeEach(() => {
    useUserStore.setState({ isAuthenticated: true, profile: PROFILE });
  });

  it('saves a valid change and reports back', async () => {
    const onSaved = jest.fn();
    const user = userEvent.setup();
    const screen = await renderWithProviders(
      <EditProfileForm profile={PROFILE} onSaved={onSaved} />,
    );

    await user.clear(screen.getByTestId('profile-name'));
    await user.type(screen.getByTestId('profile-name'), 'Ada Lovelace');
    await user.press(screen.getByTestId('profile-save'));

    await waitFor(() =>
      expect(useUserStore.getState().profile?.name).toBe('Ada Lovelace'),
    );
    expect(onSaved).toHaveBeenCalled();
  });

  it('rejects an invalid email', async () => {
    const onSaved = jest.fn();
    const user = userEvent.setup();
    const screen = await renderWithProviders(
      <EditProfileForm profile={PROFILE} onSaved={onSaved} />,
    );

    await user.clear(screen.getByTestId('profile-email'));
    await user.type(screen.getByTestId('profile-email'), 'not-an-email');
    await user.press(screen.getByTestId('profile-save'));

    expect(await screen.findByText('Enter a valid email address')).toBeTruthy();
    expect(onSaved).not.toHaveBeenCalled();
    expect(useUserStore.getState().profile?.email).toBe('timmy@example.com');
  });

  it('rejects an empty name', async () => {
    const user = userEvent.setup();
    const screen = await renderWithProviders(
      <EditProfileForm profile={PROFILE} onSaved={jest.fn()} />,
    );

    await user.clear(screen.getByTestId('profile-name'));
    await user.press(screen.getByTestId('profile-save'));

    expect(await screen.findByText('Name is required')).toBeTruthy();
  });
});
