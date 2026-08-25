import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateStorage } from 'zustand/middleware';

type StorageErrorHandler = (
  operation: 'read' | 'write' | 'remove',
  error: unknown,
) => void;

/**
 * AsyncStorage adapter for Zustand persist.
 * Failures go to onError instead of throwing, so a phone that cannot write to
 * disk still works for the session.
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
