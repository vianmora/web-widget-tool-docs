---
sidebar_position: 2
title: Requirements
---

# Requirements

## Recommended approach: Docker

The easiest and recommended way to run WebWidgetTool is with **Docker Compose**. It handles the database, migrations, and all dependencies automatically.

### What you need

| Requirement | Minimum version | Notes |
|---|---|---|
| Docker | 20+ | [Install Docker](https://docs.docker.com/get-docker/) |
| Docker Compose | v2 (`docker compose`) | Included with Docker Desktop |
| RAM | 512 MB | 1 GB recommended |
| Disk | 2 GB free | For images, DB data, and logs |

:::info Windows / macOS
Use **Docker Desktop**. It includes both Docker Engine and Docker Compose.
:::

### Ports

By default, WebWidgetTool runs on port **4000**. You can change this with the `PORT` environment variable. In production you'll typically put a reverse proxy (Nginx, Caddy, Traefik) in front.

### External services

| Service | Required? | Purpose |
|---|---|---|
| **Google Maps API** (Places API enabled) | Yes | Google Reviews widget, Maps widget |
| **Apify** | No | Unlocks >5 Google reviews + photos |
| **SMTP server** | SaaS mode only | Email verification, password reset |
| **Stripe** | SaaS mode only | Billing and plan management |

#### Getting a Google Maps API key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or select an existing one)
3. Enable the **Places API**
4. Create an API key under **APIs & Services → Credentials**
5. Restrict the key to your server IP in production

:::tip Without a Google Maps key
You can still use all non-Google widgets (WhatsApp, FAQ, Countdown, Cookie Banner, etc.) — `GOOGLE_MAPS_API_KEY` is only needed for the Google Reviews and Maps widgets.
:::

## Alternative: manual installation (no Docker)

If you prefer to run without Docker, you need:

- **Node.js** 20+
- **PostgreSQL** 16+
- **npm** 10+

See the [VPS Manual Installation](./deployment/vps-manual) guide for step-by-step instructions.
