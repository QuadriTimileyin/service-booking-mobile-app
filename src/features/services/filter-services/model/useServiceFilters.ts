import { useCallback, useMemo, useState } from 'react';

import type { ServiceProvider } from '../../../../entities/service';
import { ALL_CATEGORIES, filterServiceProviders, type CategoryFilterValue } from '../lib';

/** Holds the search text and category filter for the services list. */
export function useServiceFilters(providers: ServiceProvider[] | undefined) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilterValue>(ALL_CATEGORIES);

  const results = useMemo(
    () => filterServiceProviders(providers ?? [], { query, category }),
    [providers, query, category],
  );

  const isFiltering = query.trim().length > 0 || category !== ALL_CATEGORIES;

  const clearFilters = useCallback(() => {
    setQuery('');
    setCategory(ALL_CATEGORIES);
  }, []);

  return { query, setQuery, category, setCategory, results, isFiltering, clearFilters };
}
