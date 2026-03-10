---
sidebar_position: 4
title: Configuration
---

# Configuration

All configuration is done through environment variables. Copy `.env.example` to `.env` and edit the values.

## Core settings

| Variable | Required | Default | Description |
|---|---|---|---|
| `APP_MODE` | Yes | — | `selfhosted` or `saas` |
| `PORT` | No | `4000` | Port the backend listens on |
| `FRONTEND_URL` | Yes | — | URL of your frontend — used for CORS on `/api/*` routes |
| `APP_URL` | Yes (prod) | — | Public URL of the app — used in widget embed snippets |

## Self-hosted mode

These variables are only used when `APP_MODE=selfhosted`.

| Variable | Required | Description |
|---|---|---|
| `ADMIN_EMAIL` | Yes | Email address for the single admin account |
| `ADMIN_PASSWORD` | Yes | Password for the admin account |

## Security

| Variable | Required | Description |
|---|---|---|
| `JWT_SECRET` | Yes | Secret used to sign JWT tokens. Generate with `openssl rand -hex 32` |

## Database

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string: `postgresql://user:pass@host:5432/dbname` |
| `POSTGRES_USER` | Yes (Docker) | PostgreSQL username (used in Docker Compose) |
| `POSTGRES_PASSWORD` | Yes (Docker) | PostgreSQL password (used in Docker Compose) |

## Google integrations

| Variable | Required | Description |
|---|---|---|
| `GOOGLE_MAPS_API_KEY` | Yes* | Google Maps API key with Places API enabled. Required for Google Reviews and Maps widgets. |
| `GOOGLE_REVIEWS_CACHE_TTL` | No | Cache duration for Google reviews in seconds. Default: `604800` (7 days) |
| `APIFY_TOKEN` | No | Apify API token. If set, uses Apify scraper to fetch more than 5 reviews with photos. Get it at [console.apify.com](https://console.apify.com/account/integrations) |

*Not required if you don't use Google Reviews or Maps widgets.

## SMTP (email)

Required if `APP_MODE=saas`. Optional otherwise.

| Variable | Required | Default | Description |
|---|---|---|---|
| `SMTP_HOST` | SaaS only | — | SMTP server hostname |
| `SMTP_PORT` | No | `587` | SMTP port |
| `SMTP_SECURE` | No | `false` | Set to `true` for port 465 (SSL) |
| `SMTP_USER` | SaaS only | — | SMTP username |
| `SMTP_PASS` | SaaS only | — | SMTP password |
| `SMTP_FROM` | No | — | Sender address, e.g. `WebWidget <noreply@yourdomain.com>` |

## SaaS mode

These variables are only used when `APP_MODE=saas`.

### Better Auth

| Variable | Required | Description |
|---|---|---|
| `BETTER_AUTH_SECRET` | Yes | Auth secret. Generate with `openssl rand -hex 32` |
| `BETTER_AUTH_URL` | Yes | Public URL of the backend, e.g. `https://api.yourdomain.com` |

### OAuth providers (optional)

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `FACEBOOK_CLIENT_ID` / `FACEBOOK_CLIENT_SECRET` | Facebook OAuth |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth |

### Superadmin

| Variable | Description |
|---|---|
| `SUPERADMIN_EMAIL` | Email of the account that has access to the `/admin` backoffice |

### Stripe

| Variable | Required | Description |
|---|---|---|
| `STRIPE_SECRET_KEY` | SaaS only | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | SaaS only | Stripe webhook signing secret |
| `STRIPE_PRICE_STARTER` | SaaS only | Stripe price ID for the Starter plan |
| `STRIPE_PRICE_PRO` | SaaS only | Stripe price ID for the Pro plan |
| `STRIPE_PRICE_AGENCY` | SaaS only | Stripe price ID for the Agency plan |

## Development only

These variables are used during local development and baked into the frontend build.

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend URL for the Vite dev server. Usually `http://localhost:4000` |
| `FRONTEND_PORT` | Port for the frontend dev server. Default: `3000` |

## Full `.env` example

```bash
# ── Core ──────────────────────────────────────────
APP_MODE=selfhosted
PORT=4000
FRONTEND_URL=https://your-app.com
APP_URL=https://your-app.com

# ── Admin (selfhosted only) ───────────────────────
ADMIN_EMAIL=admin@your-domain.com
ADMIN_PASSWORD=a-strong-password

# ── Security ──────────────────────────────────────
JWT_SECRET=generate-with-openssl-rand-hex-32

# ── Database ──────────────────────────────────────
POSTGRES_USER=postgres
POSTGRES_PASSWORD=a-strong-db-password
# DATABASE_URL is constructed automatically in Docker Compose
# For manual installs: DATABASE_URL=postgresql://postgres:password@localhost:5432/webwidgettool

# ── Google ────────────────────────────────────────
GOOGLE_MAPS_API_KEY=AIzaSy...
GOOGLE_REVIEWS_CACHE_TTL=604800
APIFY_TOKEN=                    # optional

# ── SMTP (saas only) ──────────────────────────────
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=user@example.com
SMTP_PASS=smtp-password
SMTP_FROM="WebWidget <noreply@your-domain.com>"
```
