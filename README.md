# Calorias

App pessoal para registar refeicoes, calorias, treino, peso corporal e progresso de perda de peso. Foi pensada para uso no telemovel e deploy na Vercel.

## Funcionalidades

- Login por codigo secreto via `APP_SECRET`.
- Sessao em cookie HTTP-only.
- Registo de refeicoes com calorias, hora e notas.
- Historico diario e grafico de consumo.
- Metas editaveis de calorias, ginasio e cardio.
- Registo de ginasio, bicicleta, esteira e peso corporal.
- Persistencia em Postgres via `DATABASE_URL`.
- Fallback local em `.data/calorias.json` quando nao existe `DATABASE_URL`.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Zod
- postgres.js
- Vitest

## Desenvolvimento

Requisitos:

- Node.js 20 ou superior.
- npm.

Crie `.env.local`:

```env
APP_SECRET=um-codigo-forte-so-teu
DATABASE_URL=postgres://user:password@host:5432/database?sslmode=require
```

Instale dependencias e inicie a app:

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

Para testar sem Postgres local:

```bash
APP_SECRET=dummy npm run dev
```

Nesse modo, a app guarda dados em `.data/calorias.json`.

## Base de Dados

Use Neon, Vercel Postgres ou outro Postgres gerido. Depois de configurar `DATABASE_URL`, aplique o schema:

```bash
npm run db:migrate
```

O schema cria:

- `meals`
- `training_sessions`
- `body_weights`
- `settings`

## Verificacao

```bash
npm run lint
npm run typecheck
npm test -- --run
npm run build
```

## Deploy na Vercel

1. Faca push para `AndreLeal-L2/Calorias-.git`.
2. Importe o repositorio na Vercel.
3. Configure `APP_SECRET` e `DATABASE_URL`.
4. Execute `npm run db:migrate` apontando para a base de dados de producao.
5. Faca deploy.

## Nota

As metas caloricas sao configuraveis e servem para acompanhamento pessoal. A app nao substitui aconselhamento medico ou nutricional.
