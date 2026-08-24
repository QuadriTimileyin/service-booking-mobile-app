import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateStorage } from 'zustand/middleware';

type StorageErrorHandler = (
  operation: 'read' | 'write' | 'remove',
  error: unknown,
) => void;

/**
 * AsyncStorage adapter for Zustand's `persist` middleware.
 *
 * Storage failures are surfaced through `onError` instead of rejecting, so a
 * device that cannot write to disk degrades to an in-memory session rather than
 * crashing the app with an unhandled rejection.
 */
export const createAsyncStorage = (onError?: StorageErrorHandler): StateStorage => ({
  getItem: async (name) => {
    try {
      return await AsyncStorage.getItem(name);
    } catch (error) {
      onError?.('read', error);
      return null;
    }
  },
  setItem: async (name, value) => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch (error) {
      onError?.('write', error);
    }
  },
  removeItem: async (name) => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (error) {
      onError?.('remove', error);
    }
  },
});
