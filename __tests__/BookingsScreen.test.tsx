import { act, userEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { createBooking, useBookingStore } from '../src/entities/booking';
import { BookingsScreen } from '../src/pages/bookings';
import { createNavigationMock, renderWithProviders } from './helpers/renderWithProviders';

const booking = createBooking({
  serviceProviderId: 1,
  serviceName: 'Car Wash with Romaguera-Crona',
  providerName: 'Leanne Graham',
  companyName: 'Romaguera-Crona',
  category: 'Car Wash',
  date: '2030-01-15',
  time: '10:00',
  notes: 'Ring the bell',
});

const renderScreen = () =>
  renderWithProviders(
    <BookingsScreen navigation={createNavigationMock()} route={createNavigationMock()} />,
  );

describe('BookingsScreen', () => {
  beforeEach(() => {
    useBookingStore.setState({ bookings: [], hasHydrated: true, storageError: null });
  });

  it('shows the empty state when there are no bookings', async () => {
    const screen = await renderScreen();

    expect(screen.getByText('No bookings yet')).toBeTruthy();
    expect(
      screen.getByText('Find a service and schedule your first appointment.'),
    ).toBeTruthy();
    expect(screen.getByText('Browse Services')).toBeTruthy();
  });

  it('renders a persisted booking with its details', async () => {
    useBookingStore.setState({ bookings: [booking], hasHydrated: true });
    const screen = await renderScreen();

    expect(screen.getByText('Romaguera-Crona')).toBeTruthy();
    expect(screen.getByText('Leanne Graham')).toBeTruthy();
    expect(screen.getByText('Car Wash')).toBeTruthy();
    expect(screen.getByText('Ring the bell')).toBeTruthy();
    expect(screen.queryByText('No bookings yet')).toBeNull();
  });

  it('waits for storage to rehydrate before deciding the list is empty', async () => {
    useBookingStore.setState({ bookings: [], hasHydrated: false });
    const screen = await renderScreen();

    expect(screen.queryByText('No bookings yet')).toBeNull();
  });

  it('shows the skeleton while refreshing, then the list again', async () => {
    useBookingStore.setState({ bookings: [booking], hasHydrated: true });
    const screen = await renderScreen();

    const list = screen.getByTestId('bookings-list');

    await act(async () => {
      list.props.refreshControl.props.onRefresh();
    });

    // The list stays mounted so the pull spinner keeps running.
    expect(screen.getByLabelText('Loading bookings')).toBeTruthy();
    expect(screen.getByTestId('bookings-list')).toBeTruthy();
    expect(screen.queryByText('Romaguera-Crona')).toBeNull();

    await waitFor(() => expect(screen.queryByLabelText('Loading bookings')).toBeNull(), {
      timeout: 3000,
    });
    expect(screen.getByText('Romaguera-Crona')).toBeTruthy();
  });

  it('asks for confirmation before deleting a booking', async () => {
    useBookingStore.setState({ bookings: [booking], hasHydrated: true });
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const user = userEvent.setup();
    const screen = await renderScreen();

    await user.press(screen.getByLabelText(`Delete booking for ${booking.serviceName}`));

    expect(alertSpy).toHaveBeenCalledWith(
      'Delete this booking?',
      expect.stringContaining(booking.serviceName),
      expect.any(Array),
    );
    expect(useBookingStore.getState().bookings).toHaveLength(1);

    // Confirming the dialog should remove the booking.
    const actions = alertSpy.mock.calls[0][2] as { text: string; onPress?: () => void }[];
    await act(async () => {
      actions.find((action) => action.text === 'Delete')?.onPress?.();
    });
    expect(useBookingStore.getState().bookings).toHaveLength(0);

    alertSpy.mockRestore();
  });
});
