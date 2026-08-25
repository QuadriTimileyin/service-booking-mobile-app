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

## Product Polish

Beyond the required assessment scope, the app completes the product lifecycle:

- First-launch onboarding, remembered on the device
- A Profile tab with the signed-in user, edit profile and logout
- A booking confirmation screen after a successful save
- A home screen with a compact hero and icon based category tiles
- Search, category filters and pull-to-refresh on both lists
- Loading skeletons, empty and error states
- Responsive layout and accessibility work

These are lifecycle gaps rather than new business scope. Authentication with no
account surface and no way to sign out is incomplete, and a state-changing action
like booking deserves clear confirmation. Nothing here invents data the API does
not provide: no prices, ratings, reviews or verification badges.

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

## Design and theming

The visual direction was drafted in [Stitch](https://stitch.withgoogle.com) and
then rebuilt properly in React Native with NativeWind. The generated screens were
a reference for hierarchy, spacing and component treatment, not code to paste in.

The design system is small on purpose: one green primary, a neutral grey ramp,
one card treatment, one button component with four variants, and a 4/8px spacing
scale.

**Every colour and radius lives in one file, `src/shared/config/tokens.js`.**
`tailwind.config.js` reads it for the utility classes, and
`src/shared/config/theme.ts` re-exports it for the few APIs that cannot take a
class name (the navigation theme, vector icons, the refresh spinner). Rebranding
the app means editing that single file. No component hardcodes a colour.

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
├── pages/        onboarding, login, services, service-details, create-booking,
│                 booking-success, bookings, profile, edit-profile
├── widgets/      service-card, booking-card, services-search, category-filter,
│                 screen-header, profile-header, onboarding-slide
├── features/     auth/login, auth/logout, services/filter-services,
│                 booking/create-booking, booking/delete-booking,
│                 profile/edit-profile
├── entities/     service, booking, user, preferences
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
- **Zustand** owns application state: the mock session and profile
  (`entities/user`), device settings such as the onboarding flag
  (`entities/preferences`), and the booking collection (`entities/booking`).
- **AsyncStorage** backs those stores through Zustand's `persist` middleware. Each
  store exposes `hasHydrated`, so the UI shows a skeleton instead of briefly
  flashing an incorrect empty state while storage is being read. Startup waits for
  both the session and the preferences before deciding between onboarding, login
  and the main app.

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

Authentication is mocked, as permitted by the brief. The login form validates with
Zod (email required and well formed, password required). A successful validation
sets `isAuthenticated` and saves a profile built from the email address, so
`john.doe@example.com` is greeted as John Doe until the name is edited.

There is no backend, no registration and no password reset. Logging out lives on
the Profile tab behind a confirmation. It clears the session but keeps saved
bookings and the onboarding flag, because those belong to the device.

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
- Onboarding is shown once per install and is remembered separately from the
  session, so it does not reappear after logging out.
- The display name is derived from the email on first sign-in and can then be
  edited on the Profile tab.

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
- `deriveNameFromEmail` — display names built from an address, with a fallback.

Screen tests (React Native Testing Library) cover the flows a reviewer would
click through:

- `LoginForm` — validation messages, malformed email, successful sign-in.
- `ServicesScreen` — skeleton loading, rendered provider cards, search
  filtering, the "no services found" empty state and the retryable error state.
- `BookingsScreen` — empty state, a persisted booking, the rehydration guard,
  pull-to-refresh showing skeletons, and delete-with-confirmation.
- `OnboardingScreen` — first slide, skip persists completion, next does not.
- `ProfileScreen` and `EditProfileForm` — user details, logout confirmation,
  saving a valid change, rejecting an invalid email or empty name.
- `BookingSuccessScreen` — confirmation details and navigation back to services.

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
