# Service Booking Mobile App

A production-quality React Native (Expo) app for discovering local service
providers — cleaners, plumbers, electricians, laundry services and car washes —
and booking appointments that persist on the device.

Built for the Sage Grey Technologies Mobile Developer practical assessment.

## Features

| Requirement                                                                | Status |
| -------------------------------------------------------------------------- | ------ |
| Mock authentication with email + password validation                       | ✅     |
| Service list fetched from JSONPlaceholder and rendered in a `FlatList`     | ✅     |
| Loading and error states with retry                                        | ✅     |
| Service details (provider, phone, address, company, category, description) | ✅     |
| Booking screen with date, time and notes                                   | ✅     |
| Bookings persisted locally with AsyncStorage                               | ✅     |
| My Bookings list with delete + confirmation                                | ✅     |
| NativeWind styling, responsive and consistent layout                       | ✅     |
| **Bonus:** search services                                                 | ✅     |
| **Bonus:** filter by category                                              | ✅     |
| **Bonus:** pull to refresh                                                 | ✅     |
| **Bonus:** Zod form validation                                             | ✅     |
| **Bonus:** animations, empty states, skeleton loading UI                   | ✅     |

## Tech Stack

| Concern      | Choice                                            |
| ------------ | ------------------------------------------------- |
| Runtime      | Expo (SDK 57) + React Native 0.86                 |
| Language     | TypeScript (strict)                               |
| Styling      | NativeWind (Tailwind CSS)                         |
| Navigation   | React Navigation (native stack + bottom tabs)     |
| Client state | Zustand (+ `persist` middleware)                  |
| Server state | TanStack Query                                    |
| Persistence  | AsyncStorage                                      |
| Forms        | React Hook Form + Zod                             |
| Icons        | `@expo/vector-icons` (Ionicons)                   |
| Date/time    | `@react-native-community/datetimepicker`          |
| Testing      | Jest (`jest-expo`) + React Native Testing Library |

## Getting Started

**Requirements:** Node.js 20+, npm, and either Xcode (iOS Simulator) or Android
Studio (emulator). Expo Go on a physical device also works.

```bash
npm install
npm start        # start the Metro dev server
npm run ios      # open in the iOS Simulator
npm run android  # open in the Android emulator
```

Sign in with any valid email address and any non-empty password, for example
`timmy@example.com` / `password123`.

### Quality gates

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm test            # jest
npx expo-doctor     # expo project health
```

## Architecture

The project uses **Feature-Sliced Design (FSD)**: the codebase is split into
layers that may only depend downwards.

```
app       → providers, navigators, root shell
pages     → one screen per route, orchestration only
widgets   → composite UI blocks (service card, booking card, filters)
features  → user-facing capabilities (login, filter services, create/delete booking)
entities  → domain models, API access and stores (service provider, booking, user)
shared    → design system, utilities, api client, config — no domain knowledge
```

```
src/
├── app/          navigation/, providers/
├── pages/        login, services, service-details, create-booking, bookings
├── widgets/      service-card, booking-card, services-search, category-filter, screen-header
├── features/     auth/login, services/filter-services, booking/create-booking, booking/delete-booking
├── entities/     service, booking, user
└── shared/       api, config, lib (dates, formatting, storage), types, ui
```

**Why FSD?** It keeps ownership obvious (a change to booking rules has exactly
one home), prevents circular dependencies through the layer rule, keeps screens
thin enough to read at a glance, and makes the business logic testable without
rendering a single component.

Each slice exposes a small public API through its `index.ts`; other slices import
from that barrel rather than reaching into internal files.

## State Management

Client state and server state are deliberately kept apart:

- **TanStack Query** owns the remote provider collection — caching, loading and
  error flags, retries and pull-to-refresh. `useServiceProvider(id)` reads a
  single provider out of that same cache, so navigation only carries an id.
- **Zustand** owns application state: the mock session (`entities/user`) and the
  booking collection (`entities/booking`).
- **AsyncStorage** backs both stores through Zustand's `persist` middleware. Each
  store exposes `hasHydrated`, so the UI shows a skeleton instead of briefly
  flashing an incorrect empty state while storage is being read.

## API

`GET https://jsonplaceholder.typicode.com/users` returns users, which the app
maps into its own `ServiceProvider` entity in
`entities/service/lib/mapUserToServiceProvider.ts`:

- `category` is derived from the provider id (`(id - 1) % 5`), so the same
  provider always offers the same service — across renders and app restarts.
- `address` is composed as `street, suite, city`.
- `description` is generated from the category, company and city.
- Missing or malformed fields degrade to readable placeholders instead of
  rendering `undefined`.

Network access goes through `shared/api/apiClient.ts`, which adds a request
timeout and normalises failures into a single `ApiError` type. Screens never call
`fetch` directly.

## Authentication

Authentication is mocked, as permitted by the brief. The login form validates
with Zod (email required + valid format, password required); a successful
validation sets `isAuthenticated` and stores the email in the persisted auth
store. There is no backend, no registration and no password reset. Logging out is
available from the Services header.

## Assumptions

- Any valid email address plus any non-empty password is accepted as a sign-in.
- JSONPlaceholder users represent service providers; service categories are
  generated by the app because the API has no such field.
- Categories are assigned deterministically rather than randomly, so the data is
  stable across sessions.
- Bookings are stored on the device only — there is no booking API to sync with.
- Dates and times are captured and displayed in the device's local timezone, and
  persisted as plain `YYYY-MM-DD` / `HH:mm` strings rather than `Date` objects.
- A booking may be made for today or any future date; past dates are rejected.
- The mock session is persisted, so a signed-in user stays signed in after a
  restart until they log out.

## Testing

```bash
npm test
```

Focused unit tests cover the logic that carries risk:

- `mapUserToServiceProvider` — field mapping, deterministic categories, address
  construction, description generation and malformed-data fallbacks.
- `loginSchema` — missing email, invalid email format, missing password, valid
  credentials.
- `bookingSchema` — valid booking, today allowed, past date rejected, missing
  date/time, notes length limit.
- `bookingStore` — add, delete, unknown-id delete, unique ids and timestamps.
- `filterServiceProviders` — case-insensitive search across name/company/
  category/city, category filtering, combined filters and the empty result.

## Known Limitations

- Authentication is mocked; there is no real identity provider or token refresh.
- Bookings live only on the device. Reinstalling the app clears them, and they do
  not sync between devices.
- Provider availability is not modelled, so any date/time in the future can be
  booked and double-booking is possible.
- Service categories are generated client-side because the API does not provide
  them, so they are not "real" business data.

## Future Improvements

- Real authentication with a backend and secure token storage.
- A booking API with server-side persistence and conflict handling.
- Provider availability and time-slot selection.
- Push notifications and calendar sync for upcoming appointments.
- Payment integration.
- Provider ratings and reviews.
