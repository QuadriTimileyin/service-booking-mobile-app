import type { JsonPlaceholderUser } from '../api/types';
import { SERVICE_CATEGORIES, type ServiceCategory, type ServiceProvider } from '../types';

/**
 * Categories are derived from the provider id rather than randomised, so the
 * same provider always offers the same service across renders and app restarts.
 */
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
 * Maps a JSONPlaceholder user onto a service provider. Missing or malformed
 * fields degrade to readable placeholders instead of rendering "undefined".
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
