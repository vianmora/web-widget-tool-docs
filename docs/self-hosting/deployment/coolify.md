---
sidebar_position: 2
title: Coolify
---

# Coolify

[Coolify](https://coolify.io) is a self-hostable PaaS that manages TLS certificates, domains, and deployments automatically. WebWidgetTool ships a ready-to-use Compose file for it.

## Steps

### 1. Create a new resource in Coolify

In your Coolify dashboard:
- Click **New Resource → Docker Compose**
- Choose **From URL** and point to your fork, or paste the compose content directly

### 2. Use `docker/compose.coolify.yml`

The content of `docker/compose.coolify.yml`:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER:?postgres}
      POSTGRES_PASSWORD: ${SERVICE_PASSWORD_POSTGRES}
      POSTGRES_DB: widgets
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  app:
    image: vianmora/web-widget-tool:latest
    expose:
      - "4000"
    environment:
      SERVICE_FQDN_APP_4000: ""
      DATABASE_URL: postgresql://${POSTGRES_USER}:${SERVICE_PASSWORD_POSTGRES}@postgres:5432/widgets
      ADMIN_EMAIL: ${ADMIN_EMAIL:?}
      ADMIN_PASSWORD: ${SERVICE_PASSWORD_ADMIN}
      JWT_SECRET: ${SERVICE_PASSWORD_64_JWT}
      APP_MODE: ${APP_MODE:-selfhosted}
      GOOGLE_MAPS_API_KEY: ${GOOGLE_MAPS_API_KEY}
      FRONTEND_URL: ${SERVICE_URL_APP_4000}
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

volumes:
  postgres_data:
```

### 3. Set environment variables in Coolify

Coolify auto-generates `SERVICE_PASSWORD_*` variables. You only need to set:

| Variable | Value |
|---|---|
| `POSTGRES_USER` | `postgres` (or any username) |
| `ADMIN_EMAIL` | Your admin email |
| `GOOGLE_MAPS_API_KEY` | Your Google Maps API key |
| `APP_MODE` | `selfhosted` |
| `APIFY_TOKEN` | Optional — for >5 Google reviews |

Variables prefixed with `SERVICE_PASSWORD_` and `SERVICE_URL_` are **automatically generated and injected by Coolify**:
- `SERVICE_PASSWORD_POSTGRES` — database password
- `SERVICE_PASSWORD_ADMIN` — admin password (shown in Coolify UI)
- `SERVICE_PASSWORD_64_JWT` — JWT secret (64-char random string)
- `SERVICE_URL_APP_4000` — public URL of the app (used for CORS)

### 4. Set the domain

In Coolify, assign your domain (e.g. `app.yourdomain.com`) to the `app` service. Coolify handles TLS automatically via Let's Encrypt.

### 5. Deploy

Click **Deploy**. Coolify will:
1. Pull the image from Docker Hub
2. Start the database with a health check
3. Run database migrations
4. Start the app and configure the reverse proxy

<!-- screenshot: Coolify deployment UI -->
:::info Screenshot placeholder
*Coolify deployment UI screenshot will appear here.*
:::

## Updating

To deploy a new version:

```bash
# In the Coolify UI: click "Redeploy" or "Pull latest & redeploy"
```

Or via Coolify's webhook/API for automated deployments.
