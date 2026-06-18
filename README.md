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

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Zod
- postgres.js
- Vitest

## Variaveis de ambiente

Cria `.env.local` para desenvolvimento:

```bash
APP_SECRET=um-codigo-forte-so-teu
DATABASE_URL=postgres://user:password@host:5432/database?sslmode=require
```

Na Vercel, adiciona as mesmas variaveis em **Project Settings > Environment Variables**.

## Base de dados

Usa Neon, Vercel Postgres ou outro Postgres gerido. Depois de configurar `DATABASE_URL`, aplica o schema:

```bash
npm run db:migrate
```

O schema cria:

- `meals`
- `training_sessions`
- `body_weights`
- `settings`

## Desenvolvimento local

Requer Node 20+.

```bash
npm install
npm run db:migrate
npm run dev
```

Abre `http://localhost:3000`.

## Verificacao

```bash
npm run lint
npm run typecheck
npm test -- --run
npm run build
```

## Deploy na Vercel

1. Faz push para `AndreLeal-L2/Calorias-.git`.
2. Importa o repositorio na Vercel.
3. Configura `APP_SECRET` e `DATABASE_URL`.
4. Corre `npm run db:migrate` localmente apontando para a base de dados de producao, ou usa uma job/manual command equivalente.
5. Faz deploy.

## Nota

As metas caloricas sao configuraveis e servem para acompanhamento pessoal. A app nao substitui aconselhamento medico ou nutricional.
