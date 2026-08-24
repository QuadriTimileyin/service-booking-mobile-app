export const SERVICE_CATEGORIES = [
  'Car Wash',
  'Cleaning',
  'Plumbing',
  'Laundry',
  'Electrician',
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

/** The normalised domain object the whole app works with. */
export interface ServiceProvider {
  id: number;
  name: string;
  companyName: string;
  category: ServiceCategory;
  city: string;
  phone: string;
  address: string;
  email: string;
  description: string;
}
