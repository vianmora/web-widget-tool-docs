---
sidebar_position: 3
title: Local Setup
---

# Local Setup

This guide sets up the full development stack on your machine with hot reload for both the frontend and backend.

## Prerequisites

- **Docker** and **Docker Compose** (v2)
- **Node.js** 20+ and **npm** (for running CLI tools outside Docker, e.g. Prisma)
- **Git**

## 1. Clone the repository

```bash
git clone https://github.com/vianmora/web-widget-tool.git
cd web-widget-tool
```

## 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` — the minimum you need for local dev:

```bash
APP_MODE=selfhosted

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=password

JWT_SECRET=any-random-string-for-dev

GOOGLE_MAPS_API_KEY=AIzaSy...   # needed for Google Reviews / Maps widgets

FRONTEND_URL=http://localhost:3000
APP_URL=http://localhost:4000
VITE_API_URL=http://localhost:4000

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

## 3. Start the dev stack

```bash
docker compose -f docker/compose.dev.yml up -d
```

This starts three containers:
- **backend** — Express + ts-node-dev on port 4000 (hot reload on file save)
- **frontend** — Vite dev server on port 3000 (HMR)
- **db** — PostgreSQL 16 on port 5432

Database migrations run automatically on backend startup.

## 4. Open the app

| URL | What |
|---|---|
| `http://localhost:3000` | Dashboard (Vite dev server) |
| `http://localhost:4000/api` | Backend API |
| `http://localhost:4000/widget.js` | Widget script |

Log in with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your `.env`.

## 5. View logs

```bash
# All services
docker compose -f docker/compose.dev.yml logs -f

# Backend only
docker compose -f docker/compose.dev.yml logs -f backend

# Frontend only
docker compose -f docker/compose.dev.yml logs -f frontend
```

## Useful commands

### Backend (`apps/backend/`)

```bash
# Inside the container
docker compose -f docker/compose.dev.yml exec backend sh

# Or from your local machine (requires Node.js 20)
cd apps/backend
npx prisma migrate dev --name my-migration   # create a new DB migration
npx prisma generate                          # regenerate Prisma client after schema changes
npx prisma studio                            # open DB GUI at http://localhost:5555
```

### Frontend (`apps/frontend/`)

The Vite dev server runs in Docker and proxies `/api/*` and `/widget/*` requests to the backend. No extra config needed.

```bash
# Build the frontend locally (optional)
cd apps/frontend
npm run build
```

### Widget.js

The widget bundle is rebuilt automatically in dev mode. To rebuild manually:

```bash
cd apps/backend
npm run build   # runs tsc + esbuild
```

## Stop the stack

```bash
docker compose -f docker/compose.dev.yml down
```

To also remove the database volume (fresh start):

```bash
docker compose -f docker/compose.dev.yml down -v
```

## Troubleshooting

**Port conflict**: if port 3000 or 4000 is already in use, stop the conflicting process or change `PORT` / `FRONTEND_PORT` in `.env`.

**Migration failed**: if the backend crashes on startup with a migration error, run:
```bash
docker compose -f docker/compose.dev.yml exec backend npx prisma migrate dev
```

**Google reviews not loading**: make sure `GOOGLE_MAPS_API_KEY` is set in `.env` and the Places API is enabled on your key.
