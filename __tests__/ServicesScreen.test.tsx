import { userEvent, waitFor } from '@testing-library/react-native';

import type { JsonPlaceholderUser } from '../src/entities/service';
import { ServicesScreen } from '../src/pages/services';
import { useUserStore } from '../src/entities/user';
import { createNavigationMock, renderWithProviders } from './helpers/renderWithProviders';

const user = (
  id: number,
  name: string,
  company: string,
  city: string,
): JsonPlaceholderUser => ({
  id,
  name,
  username: name,
  email: `${name}@example.com`,
  phone: '555-0100',
  website: 'example.com',
  address: { street: 'Main St', suite: 'Apt 1', city, zipcode: '00000' },
  company: { name: company, catchPhrase: '', bs: '' },
});

const USERS = [
  user(1, 'Leanne Graham', 'Romaguera-Crona', 'Gwenborough'),
  user(2, 'Ervin Howell', 'Deckow-Crist', 'Wisokyburgh'),
];

const mockFetchOnce = (payload: unknown, ok = true) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok, status: ok ? 200 : 500, json: () => Promise.resolve(payload) }),
  ) as unknown as typeof fetch;
};

const renderScreen = () =>
  renderWithProviders(
    <ServicesScreen navigation={createNavigationMock()} route={createNavigationMock()} />,
  );

describe('ServicesScreen', () => {
  beforeEach(() => {
    useUserStore.setState({
      isAuthenticated: true,
      profile: { name: 'Timmy Quadri', email: 'timmy@example.com' },
    });
  });

  it('shows the loading skeleton before data arrives', async () => {
    // Keep the response open so we can see the loading state.
    let release: () => void = () => {};
    const pending = new Promise<void>((resolve) => {
      release = resolve;
    });
    global.fetch = jest.fn(() =>
      pending.then(() => ({ ok: true, status: 200, json: () => Promise.resolve(USERS) })),
    ) as unknown as typeof fetch;

    const screen = await renderScreen();

    expect(screen.getByLabelText('Loading services')).toBeTruthy();

    release();
    expect(await screen.findByText('Leanne Graham')).toBeTruthy();
  });

  it('renders a card per provider once loaded', async () => {
    mockFetchOnce(USERS);
    const screen = await renderScreen();

    expect(await screen.findByText('Leanne Graham')).toBeTruthy();
    expect(screen.getByText('Romaguera-Crona')).toBeTruthy();
    expect(screen.getByText('Ervin Howell')).toBeTruthy();
    expect(screen.getAllByText('View Details')).toHaveLength(2);
  });

  it('filters the list by search term', async () => {
    mockFetchOnce(USERS);
    const input = userEvent.setup();
    const screen = await renderScreen();

    await screen.findByText('Leanne Graham');
    await input.type(screen.getByTestId('services-search'), 'wisoky');

    await waitFor(() => expect(screen.queryByText('Leanne Graham')).toBeNull());
    expect(screen.getByText('Ervin Howell')).toBeTruthy();
  });

  it('shows an empty state when no provider matches', async () => {
    mockFetchOnce(USERS);
    const input = userEvent.setup();
    const screen = await renderScreen();

    await screen.findByText('Leanne Graham');
    await input.type(screen.getByTestId('services-search'), 'zzzzz');

    expect(await screen.findByText('No services found')).toBeTruthy();
    expect(screen.getByText('Clear filters')).toBeTruthy();
  });

  it('shows a retryable error state when the request fails', async () => {
    mockFetchOnce(null, false);
    const screen = await renderScreen();

    expect(await screen.findByText('Something went wrong')).toBeTruthy();
    expect(screen.getByText('Try again')).toBeTruthy();
  });
});
