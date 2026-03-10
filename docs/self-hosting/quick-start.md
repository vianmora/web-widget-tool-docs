---
sidebar_position: 3
title: Quick Start
---

# Quick Start

Deploy WebWidgetTool in under 5 minutes using pre-built Docker images. No build step required.

## Step 1 — Create your environment file

Create a file named `.env` with the following content. This is the **minimum configuration** for self-hosted mode.

```bash
APP_MODE=selfhosted

# Admin credentials
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=a-strong-password

# Generate with: openssl rand -hex 32
JWT_SECRET=replace-with-a-random-32-char-string

# Google Maps API key (required for Google Reviews and Maps widgets)
GOOGLE_MAPS_API_KEY=AIzaSy...

# URLs — replace with your actual domain or IP
FRONTEND_URL=https://your-app.com
APP_URL=https://your-app.com

# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=a-strong-db-password
```

:::danger Change default values
Never use the example values in production. Generate a strong `JWT_SECRET` with:
```bash
openssl rand -hex 32
```
:::

## Step 2 — Create your Docker Compose file

Create a file named `docker-compose.yml`:

```yaml
services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: webwidgettool
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    image: vianmora/web-widget-tool-backend:latest
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "${PORT:-4000}:4000"
    env_file: .env
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/webwidgettool

volumes:
  pgdata:
```

:::tip Already have a compose file?
You can also use the files from the repository directly:
```bash
git clone https://github.com/vianmora/web-widget-tool.git
docker compose -f docker/compose.prod.hub.yml --env-file .env up -d
```
:::

## Step 3 — Start the application

```bash
docker compose up -d
```

Docker will:
1. Pull the latest image from Docker Hub
2. Start a PostgreSQL database
3. Run database migrations automatically
4. Start the application on port 4000

## Step 4 — Open the dashboard

Navigate to `http://localhost:4000` (or your server's IP/domain).

<!-- screenshot: login page -->
:::info Screenshot placeholder
*Login page screenshot will appear here.*
:::

Log in with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you set in your `.env` file.

<!-- screenshot: dashboard -->
:::info Screenshot placeholder
*Dashboard screenshot will appear here.*
:::

## Step 5 — Create your first widget

1. Click **New Widget** in the dashboard
2. Choose a widget type (e.g. Google Reviews)
3. Configure it and click **Save**
4. Copy the embed snippet and paste it into your website

<!-- screenshot: widget creation -->
:::info Screenshot placeholder
*Widget creation flow screenshot will appear here.*
:::

## Next steps

- [Configuration](./configuration) — full reference of all environment variables
- [Reverse Proxy](./deployment/reverse-proxy) — set up HTTPS with Nginx or Caddy
- [Coolify](./deployment/coolify) — one-click deployment on Coolify
