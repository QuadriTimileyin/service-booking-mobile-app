import type { ServiceProvider } from '../src/entities/service';
import {
  ALL_CATEGORIES,
  filterServiceProviders,
} from '../src/features/services/filter-services';

const provider = (overrides: Partial<ServiceProvider>): ServiceProvider => ({
  id: 1,
  name: 'Leanne Graham',
  companyName: 'Romaguera-Crona',
  category: 'Car Wash',
  city: 'Gwenborough',
  phone: '555',
  address: 'Kulas Light, Apt. 556, Gwenborough',
  email: 'a@b.c',
  description: '',
  ...overrides,
});

const providers = [
  provider({ id: 1 }),
  provider({
    id: 2,
    name: 'Ervin Howell',
    companyName: 'Deckow-Crist',
    category: 'Plumbing',
    city: 'Wisokyburgh',
  }),
  provider({
    id: 3,
    name: 'Clementine Bauch',
    companyName: 'Romaguera-Jacobson',
    category: 'Cleaning',
    city: 'McKenziehaven',
  }),
];

describe('filterServiceProviders', () => {
  it('returns everything when no filters are applied', () => {
    expect(
      filterServiceProviders(providers, { query: '', category: ALL_CATEGORIES }),
    ).toHaveLength(3);
  });

  it('matches provider name, company, category and city case-insensitively', () => {
    const byName = filterServiceProviders(providers, {
      query: 'ervin',
      category: ALL_CATEGORIES,
    });
    const byCompany = filterServiceProviders(providers, {
      query: 'DECKOW',
      category: ALL_CATEGORIES,
    });
    const byCategory = filterServiceProviders(providers, {
      query: 'cleaning',
      category: ALL_CATEGORIES,
    });
    const byCity = filterServiceProviders(providers, {
      query: 'wisoky',
      category: ALL_CATEGORIES,
    });

    expect(byName.map((item) => item.id)).toEqual([2]);
    expect(byCompany.map((item) => item.id)).toEqual([2]);
    expect(byCategory.map((item) => item.id)).toEqual([3]);
    expect(byCity.map((item) => item.id)).toEqual([2]);
  });

  it('filters by category', () => {
    expect(
      filterServiceProviders(providers, { query: '', category: 'Plumbing' }).map(
        (item) => item.id,
      ),
    ).toEqual([2]);
  });

  it('combines search and category', () => {
    expect(
      filterServiceProviders(providers, { query: 'romaguera', category: 'Cleaning' }).map(
        (item) => item.id,
      ),
    ).toEqual([3]);
  });

  it('returns an empty list when nothing matches', () => {
    expect(
      filterServiceProviders(providers, { query: 'nothing', category: ALL_CATEGORIES }),
    ).toEqual([]);
  });
});
