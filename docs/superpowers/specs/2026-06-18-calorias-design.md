# Calorias Personal App Design

## Context

The repository starts empty. The target is a personal, mobile-first web app for tracking meals, calories, weight-loss progress, and training habits. The app should be deployable to Vercel and usable from a phone during the day.

Personal baseline:

- Age: 21
- Weight: 100 kg
- Height: 1.80 m
- Goal: aggressive weight loss
- Training availability: gym 3 times per week, home cardio available daily through bike and treadmill

This app is not medical advice. It should help track behavior and progress while keeping calorie and training targets adjustable.

## Product Scope

The first version will provide:

- Secret-code login for one personal user.
- Daily meal logging with meal name, calories, meal time, and optional notes.
- Daily calorie summary with consumed calories, target calories, and remaining calories.
- Meal history grouped by day.
- Weekly and monthly statistics for calories and consistency.
- Training tracker for gym sessions and home cardio.
- Personal dashboard focused on losing weight while preserving gym consistency.
- Mobile-first interface with modern visual design, subtle animations, and scroll-triggered reveal effects.

Out of scope for the first version:

- Public user registration.
- Multi-user accounts.
- Food database/barcode scanning.
- Payment, social features, or coach workflows.
- Wearable integrations.

## Recommended Approach

Use Next.js on Vercel with a managed Postgres database, preferably Neon or Vercel Postgres. This fits the target deployment model, keeps persistence online, and avoids locking the data to one browser.

Authentication will use a single secret code configured through environment variables. The code is never stored in client-side source. Login creates a secure HTTP-only session cookie. Server-side routes and mutations require that session before reading or writing personal data.

## Architecture

The app will be a Next.js App Router project with TypeScript.

Core modules:

- `app`: routes, layouts, dashboard pages, and server actions.
- `components`: reusable UI components such as cards, charts, forms, stats, and navigation.
- `lib/auth`: secret-code verification and session handling.
- `lib/db`: database connection and query helpers.
- `lib/metrics`: calorie targets, summaries, weekly stats, and training calculations.
- `db`: schema and migration files.

The first screen is the login page. After login, the user lands on today's dashboard.

## Data Model

Minimum tables:

- `meals`
  - `id`
  - `name`
  - `calories`
  - `eaten_at`
  - `notes`
  - `created_at`
  - `updated_at`

- `training_sessions`
  - `id`
  - `type`: `gym`, `bike`, or `treadmill`
  - `duration_minutes`
  - `intensity`: optional text value
  - `performed_at`
  - `notes`
  - `created_at`
  - `updated_at`

- `body_weights`
  - `id`
  - `weight_kg`
  - `measured_at`
  - `notes`
  - `created_at`

- `settings`
  - `id`
  - `daily_calorie_target`
  - `weekly_gym_target`
  - `daily_cardio_target_minutes`
  - `created_at`
  - `updated_at`

The app can start with one implicit personal profile instead of a `users` table because access is protected by the secret session.

## Calorie And Training Logic

The app will ship with editable defaults:

- Daily calorie target: aggressive but adjustable.
- Weekly gym target: 3 sessions.
- Home cardio target: optional daily habit, tracked in minutes.

Dashboard calculations:

- Today's consumed calories.
- Calories remaining against the daily target.
- 7-day average calories.
- Gym sessions completed this week.
- Cardio minutes completed this week.
- Streak-like consistency indicators for logging meals and training.

The app should avoid presenting calorie targets as clinical advice. It should frame them as configurable tracking targets.

## User Experience

The UI should feel like a personal control panel, not a marketing landing page.

Primary screens:

- Login
- Today dashboard
- Add meal
- History
- Stats
- Training
- Settings

Design direction:

- Mobile-first layout, with desktop enhancements.
- Compact cards for repeated data, not nested cards.
- Clear contrast and readable typography.
- Fast meal entry from the dashboard.
- Charts for weekly and monthly trends.
- Subtle motion for state changes and scroll reveals.
- No decorative clutter that gets in the way of repeated daily use.

## Security

Security requirements:

- `APP_SECRET` is configured only as an environment variable.
- Secret verification happens on the server.
- Auth session is stored in an HTTP-only cookie.
- Database credentials are only server-side.
- Mutations validate input on the server.
- The app should not expose raw database errors to the UI.
- Vercel environment variables must be documented in the README.

## Testing And Verification

Verification should include:

- Lint and typecheck.
- Unit tests for calorie summary and training calculations.
- Server-side validation tests where practical.
- Manual browser check for login, meal creation, history, stats, and responsive mobile layout.
- Production-readiness check for required environment variables.

## Deployment

The app will be pushed to GitHub at `AndreLeal-L2/Calorias-.git`.

Vercel deployment requirements:

- Connect the GitHub repository to Vercel.
- Configure `APP_SECRET`.
- Configure `DATABASE_URL`.
- Run database migration during setup.

The final README should include setup, local development, database setup, environment variables, and deployment steps.
