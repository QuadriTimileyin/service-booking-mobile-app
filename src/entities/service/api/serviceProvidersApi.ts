import { apiGet } from '../../../shared/api';
import { mapUserToServiceProvider } from '../lib/mapUserToServiceProvider';
import type { ServiceProvider } from '../types';
import type { JsonPlaceholderUser } from './types';

export const serviceQueryKeys = {
  all: ['service-providers'] as const,
};

/** Fetches the remote users and normalises them into service providers. */
export async function fetchServiceProviders(
  signal?: AbortSignal,
): Promise<ServiceProvider[]> {
  const users = await apiGet<JsonPlaceholderUser[]>('/users', signal);
  if (!Array.isArray(users)) return [];
  return users.map(mapUserToServiceProvider);
}
