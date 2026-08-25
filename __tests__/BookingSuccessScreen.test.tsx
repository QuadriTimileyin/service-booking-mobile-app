import { userEvent } from '@testing-library/react-native';

import { createBooking, useBookingStore } from '../src/entities/booking';
import { BookingSuccessScreen } from '../src/pages/booking-success';
import { renderWithProviders } from './helpers/renderWithProviders';

const booking = createBooking({
  serviceProviderId: 3,
  serviceName: 'Plumbing with Romaguera-Jacobson',
  providerName: 'Clementine Bauch',
  companyName: 'Romaguera-Jacobson',
  category: 'Plumbing',
  date: '2030-01-15',
  time: '10:00',
  notes: '',
});

const navigation = {
  popTo: jest.fn(),
  goBack: jest.fn(),
  getParent: jest.fn(() => ({ navigate: jest.fn() })),
};

const renderScreen = (bookingId: string) =>
  renderWithProviders(
    <BookingSuccessScreen
      navigation={navigation as never}
      route={{ key: 'success', name: 'BookingSuccess', params: { bookingId } } as never}
    />,
  );

describe('BookingSuccessScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useBookingStore.setState({ bookings: [booking], hasHydrated: true });
  });

  it('confirms the booking that was just saved', async () => {
    const screen = await renderScreen(booking.id);

    expect(screen.getByText('Booking confirmed')).toBeTruthy();
    expect(screen.getByText('Plumbing with Romaguera-Jacobson')).toBeTruthy();
    expect(screen.getByText('Clementine Bauch')).toBeTruthy();
    expect(screen.getByText('10:00 AM')).toBeTruthy();
  });

  it('sends the user back to the services list', async () => {
    const user = userEvent.setup();
    const screen = await renderScreen(booking.id);

    await user.press(screen.getByText('Back to Services'));

    expect(navigation.popTo).toHaveBeenCalledWith('Services');
  });

  it('handles a booking that is no longer there', async () => {
    const screen = await renderScreen('deleted-id');

    expect(screen.getByText('Booking not found')).toBeTruthy();
  });
});
