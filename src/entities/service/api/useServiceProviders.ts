import { useQuery } from '@tanstack/react-query';

import type { ServiceProvider } from '../types';
import { fetchServiceProviders, serviceQueryKeys } from './serviceProvidersApi';

/** Server state for the provider collection. Owned by TanStack Query. */
export function useServiceProviders() {
  return useQuery({
    queryKey: serviceQueryKeys.all,
    queryFn: ({ signal }) => fetchServiceProviders(signal),
  });
}

/**
 * Resolves a single provider from the cached collection, so navigation only has
 * to carry an id. Falls back to fetching when the cache is cold (deep link,
 * app resumed on the details screen).
 */
export function useServiceProvider(id: number) {
  return useQuery({
    queryKey: serviceQueryKeys.all,
    queryFn: ({ signal }) => fetchServiceProviders(signal),
    select: (providers: ServiceProvider[]) =>
      providers.find((provider) => provider.id === id),
  });
}
