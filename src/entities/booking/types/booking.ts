import type { ServiceCategory } from '../../service';

export interface Booking {
  id: string;
  serviceProviderId: number;
  /** Human-readable service name, e.g. "Plumbing with Deckow-Crist". */
  serviceName: string;
  providerName: string;
  companyName: string;
  category: ServiceCategory;
  /** `YYYY-MM-DD` */
  date: string;
  /** `HH:mm` */
  time: string;
  notes: string;
  /** ISO timestamp of when the booking was created. */
  createdAt: string;
}

/** Everything needed to create a booking except the generated fields. */
export type BookingDraft = Omit<Booking, 'id' | 'createdAt'>;
