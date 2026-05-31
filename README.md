# FIT.AI — Train Smarter

FIT.AI is an AI-powered fitness platform built for the US market. Users chat with **Coach AI**, a virtual personal trainer that collects profile data, understands goals, and builds personalized weekly workout plans. The web app tracks consistency, workout sessions, and progress over time.

![Home screen](./public/tela-inicial.png)

## Features

### Authentication & onboarding

- **Google OAuth** via Better Auth
- **Conversational onboarding** — Coach AI collects weight, height, age, and body fat % through chat
- Guided flow until the user has a training profile and an active plan

### Workout plans

- **AI-generated plans** tailored to goals, available days, and physical limitations
- **7-day structure** (Monday–Sunday) with rest days and training days
- **Per-day details** — exercises, sets, reps, rest times, and estimated duration
- **Cover images** per training day (upper vs lower body focus)
- **In-app adjustments** — swap exercises, change sets/reps, or request a new plan via Coach AI

### Training sessions

- **Start / complete workouts** with session tracking
- **Today's workout** shortcut on the home screen
- **Exercise help** — open Coach AI with a pre-filled question about form

### Progress & stats

- **Weekly consistency tracker** on the home dashboard
- **Workout streak** (flame badge)
- **Stats page** — completion rate, total training time, heatmap history (3 months)
- **Profile** — body metrics and account management

### Coach AI chat

- Available on **every screen** (slide-over panel on mobile, sidebar on desktop)
- **Streaming responses** with markdown rendering
- **Quick suggestions** (e.g. “Build my workout plan”, “Adjust today's workout”)
- **Conversation history** persisted per user
- **English-only** UX and AI responses (US audience)

![Main app](./public/tela-main.png)

![Onboarding chat](./public/tela-chat1.png)

![Coach AI with plan](./public/tela-chat2.png)

## Tech stack

### Frontend (this repository)

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI | [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/) |
| Components | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| Auth | [Better Auth](https://www.better-auth.com/) (Google OAuth) |
| AI client | [Vercel AI SDK](https://sdk.vercel.ai/) (`useChat`, streaming) |
| API client | [Orval](https://orval.dev/) — types & fetch helpers from OpenAPI |
| Forms | React Hook Form + Zod |
| URL state | [nuqs](https://nuqs.47ng.com/) |
| Dates | [dayjs](https://day.js.org/) |

### Backend ([treinos-api](https://github.com/MAGAIVERH/treinos-api))

| Layer | Technology |
| --- | --- |
| HTTP | [Fastify 5](https://fastify.dev/) |
| Database | [Prisma 7](https://www.prisma.io/) + [Neon](https://neon.tech/) (PostgreSQL) |
| Auth | Better Auth (sessions, OAuth) |
| AI | AI SDK + **Google Gemini 2.5 Flash** |
| Validation | Zod + fastify-type-provider-zod |
| API docs | OpenAPI / Scalar |

## Architecture

The platform is split into **two deployable apps** (frontend + API), both typically hosted on Vercel.

Cross-origin cookies are avoided by proxying **auth** and **AI** through the frontend domain so the browser only talks to one origin for session cookies.

```
Browser
  └── your-frontend.vercel.app
        ├── /api/auth/*     →  proxy  →  your-api.vercel.app/api/auth/*
        ├── /api/ai/*       →  proxy  →  your-api.vercel.app/ai/*
        └── other API calls →  direct →  your-api.vercel.app/*  (credentials: include)
```

### Main routes (frontend)

| Route | Description |
| --- | --- |
| `/auth` | Sign in with Google |
| `/onboarding` | Full-screen Coach AI onboarding |
| `/` | Home — today's workout, consistency, streak |
| `/workout-plans/[id]` | Weekly plan overview |
| `/workout-plans/[id]/days/[dayId]` | Day detail, start/complete session |
| `/stats` | Streak banner, heatmap, metrics |
| `/profile` | User metrics and sign out |

### Coach AI tools (backend)

The assistant can call tools to:

- `getUserTrainData` / `updateUserTrainData` — profile (weight in grams, height, age, body fat %)
- `getWorkoutPlans` — list plans (filter active)
- `createWorkoutPlan` — full 7-day plan (deactivates previous active plan)
- `updateWorkoutPlan` — partial day/exercise updates

System instructions require **English** responses and English plan/exercise naming.

## Prerequisites

- **Node.js 22+**
- **pnpm** (recommended; both repos use pnpm)
- **Google Cloud** project with OAuth 2.0 (Web client)
- **PostgreSQL** database ([Neon](https://neon.tech) recommended)
- **Google AI** API key (Gemini) for Coach AI

## Local development

Run **both** the API and the frontend. The frontend expects the API at `http://localhost:8081` by default.

### 1. Backend (treinos-api)

```bash
git clone https://github.com/MAGAIVERH/treinos-api.git
cd treinos-api
pnpm install
```

Create `.env`:

```env
PORT=8081
DATABASE_URL=postgresql://user:password@host/db?sslmode=require
BETTER_AUTH_SECRET=your-long-random-secret
API_BASE_URL=http://localhost:3000
WEB_APP_BASE_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key
NODE_ENV=development
```

Apply migrations and start:

```bash
pnpm exec prisma migrate deploy
pnpm dev
```

API runs at `http://localhost:8081`. OpenAPI docs are served by the API (see repo for the `/docs` path if enabled).

> **Important:** `API_BASE_URL` and `WEB_APP_BASE_URL` must point to the **frontend** URL (`http://localhost:3000` locally), not the API port. Better Auth uses this for OAuth callback URLs.

### 2. Frontend (this repo)

```bash
git clone https://github.com/MAGAIVERH/treinos-frontend.git
cd treinos-frontend
pnpm install
```

Create `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8081
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Start the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Regenerating API types (optional)

When the backend OpenAPI spec changes:

```bash
pnpm exec orval
```

Config lives in `orval.config.ts`; generated client is under `app/_lib/api/fetch-generated/`.

## Google OAuth setup

In [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → OAuth 2.0 Client (Web):

**Authorized JavaScript origins**

```
http://localhost:3000
http://localhost:8081
https://your-frontend.vercel.app
https://your-api.vercel.app
```

**Authorized redirect URIs**

```
http://localhost:3000/api/auth/callback/google
https://your-frontend.vercel.app/api/auth/callback/google
https://your-api.vercel.app/api/auth/callback/google
```

Use the frontend callback URL as the primary entry point when signing in through the web app.

## Deployment (Vercel)

Create **two** Vercel projects: one for `treinos-frontend`, one for `treinos-api`.

### Frontend environment variables

| Variable | Example / notes |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | `https://your-api.vercel.app` |
| `NEXT_PUBLIC_BASE_URL` | `https://your-frontend.vercel.app` |

### Backend environment variables

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Neon (or Postgres) connection string |
| `BETTER_AUTH_SECRET` | Strong random secret for sessions |
| `API_BASE_URL` | **Frontend** URL (not the API URL) |
| `WEB_APP_BASE_URL` | Frontend URL |
| `GOOGLE_CLIENT_ID` | OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini API key |
| `NODE_ENV` | `production` |

The API build runs `prisma migrate deploy` on Vercel via the `vercel-build` script.

## Project structure (frontend)

```
app/
  (app)/              # Authenticated shell (home, stats, profile, workout plans)
  auth/               # Login page
  onboarding/         # Embedded Coach AI onboarding
  api/
    auth/[...all]/    # Better Auth proxy
    ai/               # AI chat + conversation proxy
  _components/        # Shared UI (chat, nav, cards, headers)
  _hooks/             # Client hooks (chat suggestions, history)
  _lib/               # API client, auth, weekday labels, utilities
components/ui/        # shadcn primitives
public/               # Images, logos, marketing screenshots
```

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Production build |
| `pnpm start` | Run production server locally |
| `pnpm lint` | ESLint |

## Language & locale

The product UI and Coach AI are **English-only**, targeting US users. Workout day names, exercise labels, and chat copy are not localized to other languages in this version.

## License

MIT
