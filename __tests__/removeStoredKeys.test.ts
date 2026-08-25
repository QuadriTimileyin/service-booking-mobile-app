import AsyncStorage from '@react-native-async-storage/async-storage';

import { LEGACY_USER_STORAGE_KEYS } from '../src/entities/user';
import { removeStoredKeys } from '../src/shared/lib/storage';

describe('removeStoredKeys', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('drops the keys older builds left behind', async () => {
    await AsyncStorage.setItem('service-booking/auth', '{"state":{}}');

    await removeStoredKeys(LEGACY_USER_STORAGE_KEYS);

    expect(await AsyncStorage.getItem('service-booking/auth')).toBeNull();
  });

  it('leaves the keys still in use alone', async () => {
    await AsyncStorage.setItem('service-booking/user', '{"state":{}}');
    await AsyncStorage.setItem('service-booking/bookings', '{"state":{}}');

    await removeStoredKeys(LEGACY_USER_STORAGE_KEYS);

    expect(await AsyncStorage.getItem('service-booking/user')).not.toBeNull();
    expect(await AsyncStorage.getItem('service-booking/bookings')).not.toBeNull();
  });

  it('does nothing when there is nothing to remove', async () => {
    const spy = jest.spyOn(AsyncStorage, 'multiRemove');

    await removeStoredKeys([]);

    expect(spy).not.toHaveBeenCalled();
  });

  it('stays quiet when storage refuses', async () => {
    jest.spyOn(AsyncStorage, 'multiRemove').mockRejectedValueOnce(new Error('disk full'));

    await expect(removeStoredKeys(LEGACY_USER_STORAGE_KEYS)).resolves.toBeUndefined();
  });
});
