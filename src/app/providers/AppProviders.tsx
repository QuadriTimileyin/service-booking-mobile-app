import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LEGACY_USER_STORAGE_KEYS } from '../../entities/user';
import { removeStoredKeys } from '../../shared/lib/storage';
import { QueryProvider } from './QueryProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  // Clears keys from older builds once per launch. The stores never read them.
  useEffect(() => {
    void removeStoredKeys(LEGACY_USER_STORAGE_KEYS);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryProvider>{children}</QueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
