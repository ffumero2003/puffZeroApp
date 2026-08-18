# PuffZero

A Spanish-language React Native (Expo) app that helps users quit vaping. Tracks daily puffs, builds a personalized reduction plan, motivates with an AI chatbot ("Zuffy"), and monetizes through a RevenueCat subscription paywall.

See [CLAUDE.md](./CLAUDE.md) for the full architecture, data model, and third-party service reference.

- Bundle ID (iOS & Android): `com.codeharbor.puffzero`
- Supabase project URL: `https://ifjbatvmxeujewbrfjzg.supabase.co`

## Stack

Expo SDK 54, React Native 0.81, React 19, `expo-router`, TypeScript, Supabase (Postgres + Auth + Edge Functions), RevenueCat, Google Gemini (via Supabase edge functions).

## Setup

```bash
npm install
```

Create a `.env` file (not committed) with:

```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_INTERNAL_SECRET=
```

Get the Supabase anon key and DB credentials from the Supabase dashboard (project `ifjbatvmxeujewbrfjzg`) — never hardcode or commit them.

## Development

```bash
npx expo start        # Metro bundler
npm run ios           # expo run:ios (uses prebuilt project)
npm run android       # expo run:android
```

## Release

```bash
# iOS
eas build --platform ios --profile production
eas submit --platform ios --latest

# Android
eas build --platform android --profile production
eas submit --platform android --latest
```

## Assets

App icon source: https://www.flaticon.com/free-icon/cloud_11310456
