# Service Booking

A mobile app for finding local service providers (cleaners, plumbers,
electricians, laundry, car wash) and booking an appointment with them. Bookings
are saved on the device, so they survive closing the app.

Built with Expo and React Native for the Sage Grey Technologies mobile developer
assessment.

## Demo



https://github.com/user-attachments/assets/1e985ef8-e318-4f5a-a5c8-937737195a92





## Running it

You need Node 20 or newer, npm, and either Xcode or Android Studio. Expo Go on a
real phone works too.

```bash
npm install
npm start        # then press i or a, or scan the QR code
npm run ios
npm run android
```

Sign in with any valid email and any password, for example
`timmy@example.com` / `password123`. There is no backend, so the login only
checks that the form is filled in properly.

Checks:

```bash
npm run typecheck
npm run lint
npm test
npx expo-doctor
```

## What it does

First launch shows a short onboarding, then the login screen. After signing in
you land on a list of providers pulled from JSONPlaceholder, with a search box
and category tiles at the top. Search covers provider name, company, category
and city, and works together with the selected category. Pull down to refetch.

Tapping a provider opens their details (phone, email, address, company, service
description) and a Book Service button. Booking is a day strip, a grid of time
slots, and an optional note. Confirming saves the booking and shows a
confirmation screen.

My Bookings lists everything saved on the device. Pull to refresh re-reads
storage, and deleting asks for confirmation first. Profile holds the signed in
user, a small edit form for the name and email, and logout.

The list has skeletons while loading, a retry screen if the request fails, and
an empty state when a search returns nothing.

## Architecture

The code follows Feature-Sliced Design. Layers only depend downwards:

```
app       providers, navigators, the root shell
pages     one screen per route, wiring only
widgets   composite blocks: service card, booking card, filters, profile header
features  what a user does: log in, filter, create a booking, delete one
entities  the domain: service provider, booking, user, preferences
shared    design system, api client, storage, date helpers
```

```
src/
├── app/          navigation/, providers/
├── pages/        onboarding, login, services, service-details, create-booking,
│                 booking-success, bookings, profile, edit-profile
├── widgets/      service-card, booking-card, services-search, category-filter,
│                 screen-header, profile-header, home-hero, onboarding-slide
├── features/     auth/login, auth/logout, services/filter-services,
│                 booking/create-booking, booking/delete-booking,
│                 profile/edit-profile
├── entities/     service, booking, user, preferences
└── shared/       api, config, lib, types, ui
```

I picked FSD because it keeps ownership obvious. Booking rules live in one place
instead of being spread across screens, the layer rule stops circular imports
before they start, and the screens stay thin enough to read in one go. It also
means most of the logic can be tested without rendering anything.

Each slice exports through its own `index.ts`. Other slices import from that,
not from files inside it.

## State

Server state and client state are kept apart.

TanStack Query owns the provider list: caching, loading and error flags, retry
and pull to refresh. A details screen only receives an id and reads the provider
back out of the same cache, so nothing large travels through navigation.

Zustand owns the rest. `entities/user` holds the mock session and profile,
`entities/preferences` holds the onboarding flag, `entities/booking` holds the
bookings. All three persist through AsyncStorage and expose `hasHydrated`, so
the app waits for storage before deciding between onboarding, login and the main
app. Without that guard you get a flash of the wrong screen on launch.

## The data

`GET https://jsonplaceholder.typicode.com/users` returns users, and the app maps
each one to a service provider in
`entities/service/lib/mapUserToServiceProvider.ts`.

The API has no service category, so the app derives one from the provider id
(`(id - 1) % 5`). Deriving it rather than randomising means a provider keeps the
same service between renders and app restarts. The address is joined as
`street, suite, city`, and the description is written from the category, company
and city. Missing fields fall back to readable text instead of `undefined`.

Names and cities are whatever the endpoint returns, so they read as foreign
rather than Nigerian. I left them untouched on purpose: the brief asks to map
these users as providers, and keeping the raw values means a reviewer can open
the endpoint and compare directly.

Network calls go through `shared/api/apiClient.ts`, which adds a timeout and
turns every failure into one `ApiError`. Screens never call `fetch`.

## Theming

Colours and radii live in `src/shared/config/tokens.js` and nowhere else.
`tailwind.config.js` reads it for the utility classes, `shared/config/theme.ts`
re-exports it for the few APIs that cannot take a class name (navigation theme,
icons, refresh spinner), and `app.config.js` reads it for the splash and icon
backgrounds. No component hardcodes a colour, so changing the brand is a one
file edit.

## Tests

```bash
npm test
```

Unit tests cover the parts that carry risk: the user to provider mapper, the
login and booking schemas, the booking store, the search and category filter,
and the display name helper. Screen tests use React Native Testing Library and
go through login validation, the services list in its loading, error, filtered
and empty states, the bookings list with refresh and delete, onboarding, profile
editing and the booking confirmation.

## Assumptions

- Any valid email with a non-empty password signs in. There is no backend.
- JSONPlaceholder users stand in for service providers, and categories are
  generated because the API has none.
- Bookings are stored on the device only. There is no booking API to sync with.
- Dates and times use the device timezone and are saved as `YYYY-MM-DD` and
  `HH:mm` strings rather than `Date` objects.
- A booking can be made for today or any day after it. Past dates are rejected.
- Onboarding is shown once per install. Logging out does not bring it back, and
  does not delete saved bookings, since both belong to the device.
- The display name comes from the email on first sign in and can be edited
  afterwards on the Profile tab.

## Known limitations

Authentication is mocked, so there is no token handling or refresh. Bookings do
not sync anywhere, and reinstalling the app clears them. Provider availability
is not modelled, so two bookings can land on the same slot.

## If this were going further

Real authentication, a booking API with proper conflict handling, provider
availability and real time slots, reminders before an appointment, and payment.
