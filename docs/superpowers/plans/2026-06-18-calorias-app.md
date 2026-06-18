# Calorias App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready personal calorie and training tracker deployable to Vercel with online Postgres persistence and secret-code access.

**Architecture:** Use Next.js App Router with server actions for all mutations, HTTP-only cookie auth, and a Postgres query layer isolated in `src/lib/db.ts`. Keep calculation logic pure in `src/lib/metrics.ts` so it can be unit tested without a database.

**Tech Stack:** Next.js, TypeScript, React, Tailwind CSS, Framer Motion, Recharts, Zod, postgres.js, Vitest.

---

## File Structure

- `package.json`: project scripts and dependencies.
- `src/app`: Next.js routes, layouts, server actions, and pages.
- `src/components`: dashboard, forms, charts, and navigation components.
- `src/lib/auth.ts`: secret-code validation and session cookie helpers.
- `src/lib/db.ts`: Postgres connection and typed query helpers.
- `src/lib/metrics.ts`: calorie, training, and stats calculations.
- `src/lib/validation.ts`: Zod schemas for submitted forms.
- `src/styles/globals.css`: Tailwind theme and app-wide styles.
- `db/schema.sql`: production database schema.
- `src/**/*.test.ts`: unit tests for pure logic and validation.
- `README.md`: local setup, Vercel setup, and database instructions.

## Tasks

### Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `vitest.config.ts`
- Create: `src/styles/globals.css`
- Create: `src/app/layout.tsx`

- [ ] Create the project config files with scripts for `dev`, `build`, `lint`, `test`, and `typecheck`.
- [ ] Install Next.js, React, Tailwind, TypeScript, Vitest, Framer Motion, Recharts, Zod, and postgres.js.
- [ ] Add the global app shell and metadata.
- [ ] Run `npm run typecheck` and confirm TypeScript can parse the scaffold.

### Task 2: Pure Metrics And Validation

**Files:**
- Create: `src/lib/metrics.ts`
- Create: `src/lib/metrics.test.ts`
- Create: `src/lib/validation.ts`
- Create: `src/lib/validation.test.ts`

- [ ] Write tests for daily calorie totals, remaining calories, weekly averages, gym target completion, and cardio totals.
- [ ] Implement pure metrics functions to pass those tests.
- [ ] Write tests for meal, training, weight, and settings schemas.
- [ ] Implement Zod validation schemas.
- [ ] Run `npm test -- --run src/lib`.

### Task 3: Auth And Database Layer

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/lib/db.ts`
- Create: `db/schema.sql`
- Create: `src/app/login/actions.ts`
- Create: `src/app/login/page.tsx`
- Create: `src/app/logout/route.ts`

- [ ] Implement `APP_SECRET` login validation on the server.
- [ ] Store session state in an HTTP-only, same-site cookie.
- [ ] Add schema SQL for `meals`, `training_sessions`, `body_weights`, and `settings`.
- [ ] Implement typed database helpers for reading dashboard data and inserting records.
- [ ] Add login page and logout route.

### Task 4: Dashboard, Meal History, And Stats

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/app/actions.ts`
- Create: `src/components/app-shell.tsx`
- Create: `src/components/meal-form.tsx`
- Create: `src/components/dashboard-cards.tsx`
- Create: `src/components/history-list.tsx`
- Create: `src/components/stats-chart.tsx`

- [ ] Require auth for the dashboard.
- [ ] Add fast meal entry with server-side validation.
- [ ] Show daily total, calorie target, remaining calories, 7-day average, and grouped history.
- [ ] Add animated dashboard sections with Framer Motion.
- [ ] Add charts for calorie trend.

### Task 5: Training, Weight, And Settings

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/actions.ts`
- Create: `src/components/training-form.tsx`
- Create: `src/components/weight-form.tsx`
- Create: `src/components/settings-form.tsx`
- Create: `src/components/training-summary.tsx`

- [ ] Add gym, bike, and treadmill session logging.
- [ ] Add body weight logging.
- [ ] Add editable daily calorie target, weekly gym target, and cardio target.
- [ ] Show weekly gym and cardio progress on the dashboard.

### Task 6: Polish, Documentation, And Deployment Prep

**Files:**
- Create: `.env.example`
- Create: `README.md`
- Modify: `src/styles/globals.css`
- Modify: `package.json`

- [ ] Document `APP_SECRET` and `DATABASE_URL`.
- [ ] Document local database setup and Vercel deploy steps.
- [ ] Add a migration command that runs `db/schema.sql`.
- [ ] Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.
- [ ] Initialize the GitHub remote `git@github.com:AndreLeal-L2/Calorias-.git` or HTTPS equivalent.
- [ ] Commit and push the finished app.

## Self-Review

- Spec coverage: login, Postgres persistence, meal logging, training, stats, mobile UI, security, tests, docs, and Vercel deploy are covered.
- Placeholder scan: no implementation placeholder tasks remain.
- Type consistency: meal, training, weight, and settings concepts are consistent across tasks.
