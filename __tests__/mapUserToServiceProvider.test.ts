import {
  mapUserToServiceProvider,
  resolveCategory,
  SERVICE_CATEGORIES,
  type JsonPlaceholderUser,
} from '../src/entities/service';

const user: JsonPlaceholderUser = {
  id: 1,
  name: 'Leanne Graham',
  username: 'Bret',
  email: 'Sincere@april.biz',
  phone: '1-770-736-8031 x56442',
  website: 'hildegard.org',
  address: {
    street: 'Kulas Light',
    suite: 'Apt. 556',
    city: 'Gwenborough',
    zipcode: '92998-3874',
  },
  company: {
    name: 'Romaguera-Crona',
    catchPhrase: 'Multi-layered client-server neural-net',
    bs: 'harness real-time e-markets',
  },
};

describe('mapUserToServiceProvider', () => {
  it('maps every required provider field', () => {
    const provider = mapUserToServiceProvider(user);

    expect(provider).toMatchObject({
      id: 1,
      name: 'Leanne Graham',
      companyName: 'Romaguera-Crona',
      city: 'Gwenborough',
      phone: '1-770-736-8031 x56442',
      email: 'Sincere@april.biz',
    });
  });

  it('builds the address as "street, suite, city"', () => {
    expect(mapUserToServiceProvider(user).address).toBe(
      'Kulas Light, Apt. 556, Gwenborough',
    );
  });

  it('generates a description from the category, company and city', () => {
    expect(mapUserToServiceProvider(user).description).toBe(
      'Professional car wash services provided by Romaguera-Crona in Gwenborough. ' +
        'Book an appointment at a convenient time.',
    );
  });

  it('assigns categories deterministically from the id', () => {
    const first = mapUserToServiceProvider(user).category;
    const second = mapUserToServiceProvider(user).category;

    expect(first).toBe(second);
    expect(first).toBe('Car Wash');
    expect(resolveCategory(6)).toBe('Car Wash');
    expect(resolveCategory(3)).toBe('Plumbing');
  });

  it('cycles through every category', () => {
    const categories = [1, 2, 3, 4, 5].map(resolveCategory);
    expect(categories).toEqual([...SERVICE_CATEGORIES]);
  });

  it('falls back to readable placeholders for malformed data', () => {
    const malformed = {
      id: 42,
      name: '   ',
      email: '',
      phone: '',
      address: { street: '', suite: '', city: '' },
      company: { name: '' },
    } as unknown as JsonPlaceholderUser;

    const provider = mapUserToServiceProvider(malformed);

    expect(provider.name).toBe('Unnamed provider');
    expect(provider.companyName).toBe('Independent provider');
    expect(provider.city).toBe('Unknown city');
    expect(provider.phone).toBe('Not provided');
    expect(provider.address).toBe('Address not provided');
  });
});
