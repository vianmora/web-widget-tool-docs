---
sidebar_position: 1
title: Docker Compose
---

# Docker Compose

WebWidgetTool ships three production Docker Compose files. Choose the one that fits your setup.

## Which file to use?

| File | When to use |
|---|---|
| `compose.prod.hub.yml` | **Recommended** — uses pre-built images from Docker Hub, no build step |
| `compose.prod.yml` | Build the image locally from source |
| `compose.coolify.yml` | Coolify managed deployment — see [Coolify guide](./coolify) |

---

## Option A — Docker Hub image (recommended)

No build required. Pulls `vianmora/web-widget-tool:latest` directly.

### 1. Create your `.env` file

```bash
cp .env.example .env.prod
# Edit .env.prod with your values
```

Minimum required variables:

```bash
APP_MODE=selfhosted
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=a-strong-password
JWT_SECRET=           # openssl rand -hex 32
GOOGLE_MAPS_API_KEY=AIzaSy...
APP_URL=https://your-app.com
POSTGRES_USER=postgres
POSTGRES_PASSWORD=a-strong-db-password
```

### 2. Start

```bash
docker compose -f docker/compose.prod.hub.yml --env-file .env.prod up -d
```

### 3. Check it's running

```bash
docker compose -f docker/compose.prod.hub.yml ps
curl http://localhost:4000/health
# → {"status":"ok"}
```

The app is available on port `4000` (or whatever `PORT` is set to). Put a [reverse proxy](./reverse-proxy) in front for HTTPS.

---

## Option B — Build from source

Use this if you've made local changes to the code and want to build your own image.

```bash
cp .env.example .env.prod
# Edit .env.prod

docker compose -f docker/compose.prod.yml --env-file .env.prod up --build -d
```

The multi-stage `Dockerfile` at the repo root:
1. Builds the React frontend
2. Compiles the TypeScript backend and bundles `widget.js`
3. Embeds the frontend build into the backend image (`public/app/`)
4. Runs `prisma migrate deploy` on startup, then starts Node.js

---

## Useful commands

```bash
# View logs
docker compose -f docker/compose.prod.hub.yml logs -f app

# Restart the app only (not the database)
docker compose -f docker/compose.prod.hub.yml restart app

# Stop everything
docker compose -f docker/compose.prod.hub.yml down

# Stop and remove volumes (⚠️ deletes database data)
docker compose -f docker/compose.prod.hub.yml down -v

# Pull latest image and restart
docker compose -f docker/compose.prod.hub.yml pull
docker compose -f docker/compose.prod.hub.yml up -d
```

## Data persistence

The PostgreSQL data is stored in a named Docker volume `postgres_data`. It persists across container restarts and image updates. Back it up before any destructive operation:

```bash
docker exec <postgres-container-id> pg_dump -U postgres widgets > backup.sql
```
