# PuffZero — Project Guide

A Spanish-language React Native (Expo) app that helps users quit vaping. Tracks daily puffs, builds a personalized reduction plan, motivates with an AI chatbot ("Zuffy"), and monetizes through a RevenueCat subscription paywall.

- Bundle ID (iOS & Android): `com.codeharbor.puffzero`
- App display name: `PuffZero`
- Marketing site domains: `puffzero.lat`, `reset.puffzero.lat`, `verify.puffzero.lat`
- EAS project ID: `ee2fd140-1596-4f87-82ac-08df585aed49`

---

## 1. Tech stack

| Layer | Tech |
| --- | --- |
| Framework | Expo SDK 54, React Native 0.81, React 19 |
| Router | `expo-router` v6 (file-based, typed routes ON) |
| Language | TypeScript |
| State | React Context (auth, onboarding, theme) + AsyncStorage for persistence |
| Backend | Supabase (Postgres + Auth + Edge Functions) |
| Subscriptions | RevenueCat (`react-native-purchases`) |
| AI | Google Gemini `gemini-2.5-flash-lite` free tier (called from Supabase edge functions, never client) |
| Email | Resend (called from Supabase edge functions) |
| Auth providers | Email/password, Sign in with Apple, Google OAuth |
| Notifications | `expo-notifications` (local only — no push token / FCM / APNs server) |
| Build/Release | EAS Build + EAS Submit |
| New Architecture | ENABLED (`newArchEnabled: true`, `RCTNewArchEnabled` in Info.plist) |
| React Compiler | ENABLED (experimental) |

`app.json` is the source of truth for Expo config. `ios/` and `android/` directories are prebuilt native projects (so this is a "bare" / "prebuild" workflow, not pure managed). Changes to `app.json` may require `npx expo prebuild --clean` to regenerate.

---

## 2. Directory map

```
app/                          # expo-router file routes
  _layout.tsx                 # Root: fonts, providers, AuthGuard
  index.tsx                   # Empty redirect — AuthGuard decides
  privacy-policy.tsx          # Public
  terms-of-use.tsx            # Public
  reset-password.tsx          # Public deep-link target
  verify-email.tsx            # Public deep-link target
  verify-required.tsx
  (auth)/                     # Login / Register / Forgot password
  (onboarding)/               # 12+ pre-signup onboarding screens
    onboarding.tsx            # First screen of the funnel
    post-signup/              # After account creation, BEFORE paywall
      step-review.tsx
      step-percentage.tsx
      step-personalized-plan.tsx
      step-facts.tsx
      step-notifications.tsx  # Asks for notification permission
      step-paywall.tsx        # Same UX as main paywall, in funnel
  (paywall)/paywall.tsx       # Hard paywall — RevenueCat purchase
  (app)/                      # Authenticated tab bar
    _layout.tsx               # Custom pill tab bar (home/progress/zuffy/settings)
    home.tsx                  # Daily puff log + progress circle
    progress.tsx              # Charts
    zuffy.tsx                 # AI chat
    settings.tsx              # Profile, theme, account deletion, etc.

src/
  guards/AuthGuard.tsx        # ⭐ The brain of routing — read this first
  providers/
    auth-provider.tsx         # Supabase session + RevenueCat premium state
    onboarding-provider.tsx   # Onboarding form data + hydration from profile
    theme-provider.tsx        # light/dark/system + AsyncStorage persistence
  lib/
    supabase.ts               # Supabase client (URL + anon key HARDCODED here)
    revenue-cat.ts            # RevenueCat init + premium check
    database.ts               # Generated DB types (Tables: profiles, puffs)
    profile.ts                # createProfile / getProfileByUserId / updateProfile
  services/
    auth-services.ts          # Edge-function calls for reset/verify/delete
    zuffy-ai-service.ts       # Calls zuffy-chat edge function
    ai-quotes-service.ts      # Calls generate-quote edge function + caches 23.5h
    notifications/            # 12 local-notification modules (welcome, daily, milestones…)
    verification/             # Pending email verification AsyncStorage layer
  viewmodels/                 # Per-screen logic hooks (MVVM-ish)
    app/  auth/  onboarding/
  components/                 # Pure UI components, grouped by feature
  hooks/                      # useUserData, useZuffyChat, usePendingVerification, …
  config/
    dev.ts                    # ⚠️ Dev-only flags: ENABLED, BYPASS_PAYWALL, DIRECT_SCREEN
    debug.ts                  # simulateUserState
  constants/                  # routes.ts, theme.ts, currency.ts
  styles/                     # layout.ts, components.ts

supabase/
  config.toml                 # Supabase project config
  migrations/                 # SQL migrations (currently only puffs table)
  functions/                  # Edge functions (Deno)
    zuffy-chat/               # OpenAI proxy for AI chat
    generate-quote/           # OpenAI daily motivational quote (cached 23.5h)
    delete-account/           # Admin-deletes auth user + profile + puffs
    send-email-verification/  # Custom verification email via Resend
    send-reset-password/      # Custom password-reset email via Resend
    send-email-change-verification/
    send-support-email/       # User support form → felipefumerom@gmail.com

ios/                          # Prebuilt iOS project (Xcode)
android/                      # Prebuilt Android project (Gradle)
assets/                       # Images, fonts, icons
```

---

## 3. Third-party services (everything that needs a dashboard)

This is the **complete list** of external systems the app depends on. If you open any of these dashboards, you can break the app.

### 3.1 Supabase
- Project URL: `https://ifjbatvmxeujewbrfjzg.supabase.co`
- Anon key is **hardcoded** in `src/lib/supabase.ts:5` (also in `.env`)
- DB password (from README): `PuffZero2025!`
- Tables: `profiles`, `puffs`, `daily_quotes` (only `puffs` has a checked-in migration; the others exist in the live DB)
- Auth providers enabled: Email/password, Apple, Google
- Custom SMTP is replaced by **Resend** via edge functions (the built-in Supabase email is bypassed by `send-email-verification` and `send-reset-password`)
- Required edge function secrets (in Supabase → Edge Functions → Secrets):
  - `GEMINI_API_KEY` — for `zuffy-chat`, `generate-quote` (free tier from aistudio.google.com)
  - `OPENAI_API_KEY` — legacy, kept as a rollback safety net but not used by the deployed code
  - `RESEND_API_KEY` — for all email edge functions
  - `INTERNAL_SECRET` — must match `EXPO_PUBLIC_INTERNAL_SECRET` in app `.env`
  - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — auto-provided by Supabase
- Redirect URLs configured in Supabase Auth:
  - `puffzero://reset-password` (declared in `app.json` extra)
  - `puffzero://auth/callback` (Google OAuth callback, in `app.json` extra)
  - `https://reset.puffzero.lat` (password reset web page)
  - `https://verify.puffzero.lat` (email verify web page — they redirect back into the app)

### 3.2 RevenueCat
- iOS API key: `appl_KZEHQlsbsknNgXLadldfkxeKxPR` (hardcoded in `src/lib/revenue-cat.ts:11`)
- Android API key: `goog_xmBwpiqGHthzimpuLzgvhjrpQDq` (same file)
- **Entitlement ID:** `PuffZero Pro` (literal string match — checked in `revenue-cat.ts:48`, `auth-provider.tsx:174`, and `paywall.tsx:174`. Renaming in dashboard would break premium detection)
- Offerings: `current` offering must expose `monthly` and `annual` packages (read in `paywall.tsx:69-75`)
- Apple App Store Connect: requires StoreKit products linked, agreements signed, banking + tax info. Subscription group must contain both monthly and annual products.
- Google Play Console: equivalent setup.

### 3.3 Google Gemini (AI Studio)
- Used only server-side from Supabase edge functions (`zuffy-chat`, `generate-quote`)
- Model: `gemini-2.5-flash-lite` (free tier — switched from OpenAI `gpt-4o-mini` because the OpenAI account was cancelled)
- Key from https://aistudio.google.com/apikey, stored as `GEMINI_API_KEY` secret in Supabase
- Free tier limits (as of switch): ~15 RPM / 1,500 requests/day / 1M tokens/min — plenty for current scale
- ⚠️ Don't switch to `gemini-2.0-flash` — it's no longer on the free tier (returns 429 with `limit: 0`)
- Old `OPENAI_API_KEY` secret is still in Supabase as a rollback option but no code references it anymore

### 3.4 Resend (transactional email)
- Sender: `Soporte PuffZero <soporte@puffzero.lat>` — domain `puffzero.lat` must be verified in Resend
- Support inbox: `felipefumerom@gmail.com` (`send-support-email/index.ts:36`)
- Key stored as `RESEND_API_KEY` secret in Supabase

### 3.5 Apple Developer / App Store Connect
- Team & cert managed via EAS Credentials
- Bundle ID `com.codeharbor.puffzero`
- Capabilities enabled in `ios/PuffZero/PuffZero.entitlements`:
  - `aps-environment` = `development` ← ⚠️ See "Known issues" §10
  - `com.apple.developer.applesignin` = `Default`
- App Privacy answers must declare: Email, Name, User ID, Purchase History (RevenueCat), Usage Data, Diagnostics (if any).
- "Sign in with Apple" is **required** by Apple guideline 4.8 because the app offers Google sign-in. Already implemented.

### 3.6 Google Cloud (OAuth)
- OAuth client for Google sign-in is configured in **Supabase** (Auth → Providers → Google), not in the app itself.
- Redirect: `puffzero://auth/callback` (handled by `expo-web-browser` in `GoogleButton.tsx:52`)

### 3.7 EAS (Expo Application Services)
- Project ID: `ee2fd140-1596-4f87-82ac-08df585aed49`
- App version source: `remote` (managed by EAS, not the local `version` field)
- Build profiles in `eas.json`: `development`, `preview`, `production`
- `production` has `autoIncrement: true` → build number bumps automatically

### 3.8 Custom domains / DNS
- `puffzero.lat` — **Cloudflare Pages** project (`wispy-darkness-bfab`) serving static HTML from `web/` in this repo. Hosts:
  - `/` — landing page
  - `/privacy-policy` — **the URL submitted to App Store Connect**
  - `/terms-of-use` — **the URL submitted as EULA in App Store Connect**
  - `/logo-puff-zero.png` — logo used in transactional emails
- `reset.puffzero.lat` — **Vercel-hosted** page that catches Supabase password-recovery deep links. **Do not touch DNS for this subdomain** — emails depend on it.
- `verify.puffzero.lat` — **Vercel-hosted** page that catches Supabase email-verify deep links. Same warning.
- Email infrastructure on `puffzero.lat`: MX records → PrivateEmail (Namecheap) for receiving; TXT records (`v=spf1`, `resend._domainkey`) for Resend to send. Never delete these.
- An old broken Cloudflare Worker `puffzero-logo` (`puffzero-logo.felipefumerom.workers.dev`) still exists but is no longer referenced — safe to leave or delete.

### 3.9 Expo Notifications
- **Local notifications only.** No push notification server, no Expo push tokens. Everything is scheduled via `Notifications.scheduleNotificationAsync` on the device.
- Channels created for Android: `inactivity`, `weekly-summary`, `achievements`.

---

## 4. App flow & routing

`useAuthGuard()` in `src/guards/AuthGuard.tsx` is the only thing deciding which segment the user sees. It runs on every segment change.

State inputs:
- `user` (Supabase session)
- `postSignupCompleted` (AsyncStorage flag, set to `false` on signUp, to `true` after paywall purchase or normal login)
- `isPremium` (RevenueCat entitlement)
- `isRevenueCatReady` (gate to avoid paywall flash for paying users)
- `authInProgress` (suppresses redirects mid OAuth)

Decision tree:
1. Public routes (`privacy-policy`, `terms-of-use`, `reset-password`, `verify-email`) — never redirect.
2. **No user** → force `(onboarding)/onboarding`.
3. **User but `!postSignupCompleted`** → force `(onboarding)/post-signup/step-review`.
4. Wait until `isRevenueCatReady`.
5. **User + completed + premium** → `(app)/home`.
6. **User + completed + NOT premium** → `(paywall)/paywall`. They cannot escape the paywall except by restoring or buying.

Sign-up sets `postSignupCompleted = false`. The post-signup funnel ends at `step-paywall.tsx` which, on successful purchase, calls `completeOnboarding()` → `setIsPremium(true)` → routes to home.

---

## 5. Data model

### `profiles` (1 row per user)
| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | PK |
| `user_id` | uuid | FK to `auth.users` (1:1) |
| `full_name` | text | Required. Source of truth for first name in notifications/UI. |
| `puffs_per_day` | int | User's starting daily puffs (onboarding answer) |
| `money_per_month` | numeric | Self-reported vape spend |
| `currency` | text | "CRC", "USD", "EUR", "MXN" |
| `goal` | text | Free text reason |
| `goal_speed` | text | Plan length in days |
| `why_stopped` | text[] | Multi-select of motivations |
| `worries` | text[] | Multi-select |
| `plan_started_at` | timestamptz | When current reduction plan started |
| `created_at` / `updated_at` | timestamptz | |

### `puffs` (one row per logged puff event)
| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | PK |
| `user_id` | uuid | FK with `ON DELETE CASCADE` |
| `timestamp` | timestamptz | When the puff happened |
| `count` | int | Almost always 1 |
| `created_at` | timestamptz | |

RLS enabled. Policies: `auth.uid() = user_id` for SELECT, INSERT, DELETE.

### `daily_quotes` (shared across all users)
Holds the latest AI-generated motivational quote so the edge function doesn't re-call OpenAI more than once per ~23.5 hours. Schema inferred from `generate-quote/index.ts` (no migration file).

---

## 6. Authentication

Three sign-in paths, all converge on the same Supabase session:

1. **Email/password** (`(auth)/login.tsx`, `(auth)/registrarse.tsx`)
   - `signUp` triggers email verification via `send-email-verification` edge function (custom, via Resend).
2. **Sign in with Apple** (`AppleButton.tsx`)
   - Uses native `expo-apple-authentication` → `supabase.auth.signInWithIdToken`.
   - Apple only provides the user's name on **first** sign-in — code falls back to `Alert.prompt` if missing.
   - Has a profile-migration path: if a profile exists under an older `user_id` linked to the same identity, it gets reassigned to the new `user_id`.
3. **Google OAuth** (`GoogleButton.tsx`)
   - Uses `WebBrowser.openAuthSessionAsync` to open the OAuth URL, extracts `access_token` and `refresh_token` from the redirect, and calls `supabase.auth.setSession`.
   - Same profile-migration path as Apple.

Verification flow:
- After signup, a "pending_verification" record is written to AsyncStorage (`verification-service.ts`).
- A modal appears on Home after 1 day, becomes **mandatory** at 7 days (can't dismiss).
- "Ya verifiqué" button calls `supabase.auth.refreshSession()` to pick up `email_confirmed_at`.

Account deletion (`settings.tsx` → `deleteAccount`) calls `delete-account` edge function which uses the service role to wipe profile, puffs, and the auth user.

---

## 7. Subscriptions & paywall

Source of truth: RevenueCat dashboard. The app never talks to App Store / Play Billing directly.

Flow:
1. On user login, `auth-provider.tsx:154-187` calls `initRevenueCat(user.id)` then `checkPremiumEntitlement()`.
2. `isRevenueCatReady` flips to true; `isPremium` reflects entitlement state.
3. `Purchases.addCustomerInfoUpdateListener` keeps `isPremium` synced when subscriptions renew/expire across devices.
4. Paywall (`(paywall)/paywall.tsx`) loads offerings → user taps plan → `Purchases.purchasePackage(pkg)` shows Apple/Google native sheet → entitlement check → route to home.
5. **Apple-required disclosures live inside the paywall ScrollView** (added to fix Guideline 3.1.2(c) rejection):
   - "Restaurar compras" button
   - Auto-renew subscription disclosure paragraph
   - Tappable links to `/privacy-policy` and `/terms-of-use` (in-app screens)
6. Both paywalls (`(paywall)/paywall.tsx` and `(onboarding)/post-signup/step-paywall.tsx`) use a **scrollable layout** where everything except the bottom Continue button lives inside a `ScrollView` with `contentContainerStyle: { flexGrow: 1 }`. This is what fixes the iPad-compat-mode clipping that caused Guideline 4 rejections. **Do not regress this** — if you ever pin the Restaurar/Privacy/Terms outside the ScrollView, iPad review will fail again.

Dev bypass: `BYPASS_PAYWALL = true` in `src/config/dev.ts` skips the paywall in `__DEV__` only.

---

## 8. AI features (Zuffy + daily quote)

Both run through Supabase edge functions to keep the Gemini API key off-device. Both use `gemini-2.5-flash-lite` (free tier).

- **Zuffy chat** (`(app)/zuffy.tsx` → `zuffy-ai-service.ts` → `zuffy-chat` edge fn): sends user context (puffs, money saved, streak, motivations, etc.) as the system prompt. Spanish, friendly, max 300 tokens. Conversation history is mapped from OpenAI-style `user`/`assistant` to Gemini-style `user`/`model` inside the edge function.
- **Daily quote** (`home.tsx` → `ai-quotes-service.ts` → `generate-quote` edge fn): cached client-side for 23.5 h and server-side in `daily_quotes`. Has a hardcoded fallback list if Gemini fails. **Important:** the fallback is written to the `daily_quotes` table on failure, so if Gemini is misconfigured you'll see the fallback string cached for 23.5h. To force a refresh: `DELETE FROM daily_quotes;` in the SQL editor.

---

## 9. Notifications

All **local** (scheduled on-device). Files in `src/services/notifications/`:

| File | Trigger |
| --- | --- |
| `welcome-back-notification.ts` | Sent on successful login |
| `welcome-notification.ts` | First sign-up |
| `daily-quote-notification.ts` | Daily scheduled — pulls cached AI quote |
| `daily-reminder-notification.ts` | "Remember to log your puffs" daily |
| `daily-achievement-notification.ts` | Triggered when checking the app, if eligible |
| `weekly-summary-notification.ts` | Sunday scheduled |
| `inactivity-notification.ts` | If no activity for N days |
| `milestone-notification.ts` | When user hits puff/streak milestones |
| `money-saved-milestone-notification.ts` | Saved $X milestones |
| `goal-completed-notification.ts` | Plan finished |
| `first-puff-free-day-notification.ts` | First fully clean day |
| `verification-notification.ts` | "Verify your email" reminder |

The `auth-provider.tsx` AppState listener resets the inactivity timer every time the app comes to foreground.

---

## 10. Build & release

### Local dev
```bash
npm install
npx expo start                 # Metro bundler
npm run ios                    # expo run:ios (uses prebuilt project)
npm run android                # expo run:android
```
The `.env` file MUST contain `EXPO_PUBLIC_INTERNAL_SECRET`. Without it, password reset / email verify / account deletion silently 401.

### Production builds
```bash
# iOS
eas build --platform ios --profile production
eas submit --platform ios --latest

# Android
eas build --platform android --profile production
eas submit --platform android --latest
```

### Things that bump the build number
- `eas.json` `production.autoIncrement: true` → EAS bumps build automatically.
- `appVersionSource: remote` → the `version` in `app.json` is ignored; EAS owns it.

### Common pre-flight checks before submission
- App Privacy answers in App Store Connect are filled and match the SDKs used (RevenueCat collects Purchase History, Supabase collects User ID + email).
- TestFlight build has been internally tested with a real Apple ID purchase (sandbox or production).
- "Restore purchases" works.
- "Delete account" works (Apple guideline 5.1.1(v) — required).
- Privacy policy and Terms of Use URLs reachable.

---

## 11. Known issues / gotchas

1. **iOS `aps-environment` is set to `development`** (`ios/PuffZero/PuffZero.entitlements`). EAS may override this at build time based on the profile, but if a custom prebuild config baked it in, an App Store build can be rejected for "missing entitlement" or it will work in TestFlight but not in production push. Since the app uses only **local** notifications, push entitlement is technically not needed at all — consider removing the `aps-environment` key entirely.
2. **`EXPO_PUBLIC_INTERNAL_SECRET` is shipped to the client.** Anything prefixed `EXPO_PUBLIC_` is bundled into the JS, so the "internal" secret is reverse-engineerable. The edge function check is more obscurity than security. The user is aware of this — don't refactor without a plan.
3. **Supabase anon key + URL are hardcoded** in `src/lib/supabase.ts` *in addition to* `.env`. Changing only `.env` will not change the runtime config — edit both.
4. **`newArchEnabled: true` and `reactCompiler: true`** are both experimental Expo flags. Many libraries (especially older RN ones) have edge-case crashes under these. If you see weird native errors, try disabling one at a time.
5. **`src/config/dev.ts` MUST be checked before release.** If `DEV_CONFIG.ENABLED` is `true`, even production builds will navigate straight to `DIRECT_SCREEN`. (It's gated by `__DEV__` so prod is safe, but be aware.)
6. **OAuth identity merging is non-trivial.** Both `GoogleButton` and `AppleButton` implement an "old user_id → new user_id" profile migration. If you see ghost profiles, look there.
7. **`daily_quotes` table has no migration file.** Live Supabase has the table; `supabase db push` would not recreate it on a fresh project.
8. **`react-native-purchases-ui` is installed** but not used anywhere in `app/`. If you don't plan to use the prebuilt paywall UI, you can remove it — it adds ~1.5MB.
9. **A reset-all block exists** in `app/_layout.tsx:39-49`, commented out. Uncommenting wipes the user's session and AsyncStorage on every launch — never ship that.
10. **README password is committed.** `PuffZero2025!` is in `README.md`. The DB is public-facing (Supabase). Rotate before shipping if it hasn't been already.

---

## 12. Quick reference: env vars

`.env` (client — all prefixed `EXPO_PUBLIC_` so they're in the JS bundle):
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_INTERNAL_SECRET`

Supabase Edge Functions secrets (server-side, set via `supabase secrets set`):
- `GEMINI_API_KEY` (active — used by `zuffy-chat` and `generate-quote`)
- `OPENAI_API_KEY` (legacy, kept for rollback, not currently used by deployed code)
- `RESEND_API_KEY`
- `INTERNAL_SECRET` (must equal the one in `.env`)
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-provided.

---

## 13. Useful commands

```bash
# Reset Metro cache
npx expo start -c

# Regenerate native iOS/Android folders from app.json
npx expo prebuild --clean

# Deploy a single edge function
npx supabase functions deploy zuffy-chat

# Set an edge function secret
npx supabase secrets set OPENAI_API_KEY=sk-...

# Check what's in the Supabase project
npx supabase status

# Tail edge function logs
npx supabase functions logs zuffy-chat --tail
```
