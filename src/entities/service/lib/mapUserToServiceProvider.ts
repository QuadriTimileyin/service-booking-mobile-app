import type { JsonPlaceholderUser } from '../api/types';
import { SERVICE_CATEGORIES, type ServiceCategory, type ServiceProvider } from '../types';

/** Category comes from the id, not random, so a provider keeps the same service. */
export const resolveCategory = (id: number): ServiceCategory =>
  SERVICE_CATEGORIES[Math.abs(id - 1) % SERVICE_CATEGORIES.length];

const buildDescription = (
  category: ServiceCategory,
  companyName: string,
  city: string,
): string =>
  `Professional ${category.toLowerCase()} services provided by ${companyName} in ${city}. ` +
  'Book an appointment at a convenient time.';

const fallback = (value: string | undefined | null, placeholder: string): string => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : placeholder;
};

/**
 * Turns a JSONPlaceholder user into a service provider.
 * Missing fields fall back to readable text instead of showing "undefined".
 */
export function mapUserToServiceProvider(user: JsonPlaceholderUser): ServiceProvider {
  const category = resolveCategory(user.id);
  const city = fallback(user.address?.city, 'Unknown city');
  const companyName = fallback(user.company?.name, 'Independent provider');

  const address = [user.address?.street, user.address?.suite, user.address?.city]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join(', ');

  return {
    id: user.id,
    name: fallback(user.name, 'Unnamed provider'),
    companyName,
    category,
    city,
    phone: fallback(user.phone, 'Not provided'),
    address: fallback(address, 'Address not provided'),
    email: fallback(user.email, 'Not provided'),
    description: buildDescription(category, companyName, city),
  };
}
