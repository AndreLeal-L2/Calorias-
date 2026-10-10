# Calorias

Personal app for logging meals, calories, training, body weight, and weight-loss progress. It was designed for mobile use and deployment on Vercel.

## Features

- Login by secret code through `APP_SECRET`.
- HTTP-only cookie session.
- Meal logging with calories, time, and notes.
- Daily history and consumption chart.
- Editable goals for calories, gym, and cardio.
- Gym, cycling, treadmill, and body-weight logging.
- Persistence in Postgres through `DATABASE_URL`.
- Local fallback in `.data/calorias.json` when `DATABASE_URL` is not available.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Zod
- postgres.js
- Vitest

## Development

Requirements:

- Node.js 20 or higher.
- npm.

Create `.env.local`:

```env
APP_SECRET=a-strong-code-only-you-know
DATABASE_URL=postgres://user:password@host:5432/database?sslmode=require
```

Install dependencies and start the app:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

To test without local Postgres:

```bash
APP_SECRET=dummy npm run dev
```

In this mode, the app stores data in `.data/calorias.json`.

## Database

Use Neon, Vercel Postgres, or another managed Postgres service. After configuring `DATABASE_URL`, apply the schema:

```bash
npm run db:migrate
```

The schema creates:

- `meals`
- `training_sessions`
- `body_weights`
- `settings`

## Verification

```bash
npm run lint
npm run typecheck
npm test -- --run
npm run build
```

## Deploy on Vercel

1. Push to `AndreLeal-L2/Calorias-.git`.
2. Import the repository into Vercel.
3. Configure `APP_SECRET` and `DATABASE_URL`.
4. Run `npm run db:migrate` against the production database.
5. Deploy.

## Note

Calorie goals are configurable and are intended for personal tracking. The app does not replace medical or nutritional advice.
