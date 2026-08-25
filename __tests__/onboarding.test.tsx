import { userEvent, waitFor } from '@testing-library/react-native';

import { usePreferencesStore } from '../src/entities/preferences';
import { OnboardingScreen } from '../src/pages/onboarding';
import { renderWithProviders } from './helpers/renderWithProviders';

describe('onboarding', () => {
  beforeEach(() => {
    usePreferencesStore.setState({ onboardingComplete: false, hasHydrated: true });
  });

  it('starts on the first slide', async () => {
    const screen = await renderWithProviders(<OnboardingScreen />);

    expect(
      screen.getByText('Trusted services, right when you need them'),
    ).toBeTruthy();
    expect(screen.getByText('Skip')).toBeTruthy();
    expect(screen.getByTestId('onboarding-next')).toBeTruthy();
  });

  it('marks onboarding complete when skipped', async () => {
    const user = userEvent.setup();
    const screen = await renderWithProviders(<OnboardingScreen />);

    await user.press(screen.getByText('Skip'));

    await waitFor(() =>
      expect(usePreferencesStore.getState().onboardingComplete).toBe(true),
    );
  });

  it('does not complete onboarding while slides remain', async () => {
    const user = userEvent.setup();
    const screen = await renderWithProviders(<OnboardingScreen />);

    await user.press(screen.getByTestId('onboarding-next'));

    expect(usePreferencesStore.getState().onboardingComplete).toBe(false);
  });
});
