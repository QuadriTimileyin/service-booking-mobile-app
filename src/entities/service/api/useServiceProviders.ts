import { useQuery } from '@tanstack/react-query';

import type { ServiceProvider } from '../types';
import { fetchServiceProviders, serviceQueryKeys } from './serviceProvidersApi';

/** The provider list. TanStack Query owns this one. */
export function useServiceProviders() {
  return useQuery({
    queryKey: serviceQueryKeys.all,
    queryFn: ({ signal }) => fetchServiceProviders(signal),
  });
}

/**
 * Picks one provider out of the cached list, so navigation only carries an id.
 * Fetches first when the cache is empty.
 */
export function useServiceProvider(id: number) {
  return useQuery({
    queryKey: serviceQueryKeys.all,
    queryFn: ({ signal }) => fetchServiceProviders(signal),
    select: (providers: ServiceProvider[]) =>
      providers.find((provider) => provider.id === id),
  });
}
