import { useCallback } from 'react';
import { Alert } from 'react-native';

import { useUserStore } from '../../../../entities/user';

/**
 * Signs the user out after a confirmation.
 * Bookings and the onboarding flag are kept, they belong to the device.
 */
export function useLogout() {
  const signOut = useUserStore((state) => state.signOut);

  return useCallback(() => {
    Alert.alert('Log out?', 'You will need to sign in again to book a service.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: signOut },
    ]);
  }, [signOut]);
}
