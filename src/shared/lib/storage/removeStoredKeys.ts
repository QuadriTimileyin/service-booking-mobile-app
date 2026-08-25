import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Drops keys the app no longer reads.
 * Failing here is not worth surfacing, leftover keys are harmless.
 */
export async function removeStoredKeys(keys: readonly string[]): Promise<void> {
  if (keys.length === 0) return;

  try {
    await AsyncStorage.multiRemove([...keys]);
  } catch {
    // Nothing the user can act on, so stay quiet.
  }
}
