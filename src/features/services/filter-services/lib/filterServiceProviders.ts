import type { ServiceCategory, ServiceProvider } from '../../../../entities/service';

export const ALL_CATEGORIES = 'All' as const;
export type CategoryFilterValue = ServiceCategory | typeof ALL_CATEGORIES;

interface FilterOptions {
  query: string;
  category: CategoryFilterValue;
}

/** Searches name, company, category and city. Case does not matter. */
export function filterServiceProviders(
  providers: ServiceProvider[],
  { query, category }: FilterOptions,
): ServiceProvider[] {
  const normalisedQuery = query.trim().toLowerCase();

  return providers.filter((provider) => {
    if (category !== ALL_CATEGORIES && provider.category !== category) return false;
    if (!normalisedQuery) return true;

    return [provider.name, provider.companyName, provider.category, provider.city].some(
      (field) => field.toLowerCase().includes(normalisedQuery),
    );
  });
}
