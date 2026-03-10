---
sidebar_position: 2
title: Architecture
---

# Architecture

## Overview

WebWidgetTool is a monorepo with two apps: a **backend** (Node.js + Express) and a **frontend** (React + Vite). In production they are bundled into a single Docker image — the backend serves both the API and the compiled React SPA.

```
┌─ Frontend (React SPA) ──────────────┐
│  Dashboard, Widget Editor, Billing   │
│  Vite dev server / compiled build    │
└──────────────────┬───────────────────┘
                   │ /api/* (CORS: FRONTEND_URL)
┌──────────────────▼───────────────────┐
│   Backend (Express + Node.js)         │
│  ├─ /api/auth/*    → Auth routes      │
│  ├─ /api/widgets/* → CRUD widgets     │
│  ├─ /api/places/*  → Google API       │
│  ├─ /api/billing/* → Stripe           │
│  ├─ /widget/*      → Public endpoints │
│  └─ /widget.js     → Embed script     │
└──────────────────┬───────────────────┘
                   │
     ┌─────────────┼────────────┬──────────────┐
     ▼             ▼            ▼              ▼
 PostgreSQL    Google API    Stripe        node-cache
 (Prisma ORM)  (reviews)    (payments)   (7-day TTL)
```

## Deployment modes

The `APP_MODE` environment variable switches between two modes at runtime. A single codebase handles both.

| Mode | Auth | Users | Stripe | SMTP |
|---|---|---|---|---|
| `selfhosted` | JWT (env vars) | Single admin | No | No |
| `saas` | Better Auth | Multi-user | Yes | Yes |

The helper `isSaaS()` in `apps/backend/src/lib/mode.ts` is used throughout the codebase to branch behavior.

## Request routing & CORS

| Path | CORS | Auth required |
|---|---|---|
| `/api/auth/*` | `FRONTEND_URL` only | No |
| `/api/widgets/*` | `FRONTEND_URL` only | JWT / session |
| `/api/places/*` | `FRONTEND_URL` only | JWT / session |
| `/api/billing/*` | `FRONTEND_URL` only | JWT / session |
| `/widget/*` | Open (`*`) | No |
| `/widget.js` | Open (`*`) | No |

The `/widget/*` and `/widget.js` routes are fully public — they're called from your visitors' browsers on any domain.

## Backend structure

```
apps/backend/src/
├── index.ts          # Express app, CORS, route registration, SPA serving
├── middleware/        # JWT & unified auth middleware
├── routes/
│   ├── auth.ts        # Login/logout (selfhosted JWT)
│   ├── widgets.ts     # Widget CRUD + plan enforcement
│   ├── public.ts      # Public widget data, image proxy
│   ├── places.ts      # Google Places search and reviews
│   ├── billing.ts     # Stripe webhook + subscription
│   └── admin.ts       # Superadmin (SaaS)
├── lib/
│   ├── mode.ts        # isSaaS() helper
│   ├── auth.ts        # Better Auth setup (SaaS)
│   ├── prisma.ts      # Prisma client singleton
│   ├── cache.ts       # node-cache singleton (7-day TTL)
│   ├── google.ts      # Google Places API calls
│   ├── apify.ts       # Apify scraper (>5 reviews + photos)
│   ├── stripe.ts      # Stripe client
│   └── planLimits.ts  # Widget/view quotas per Stripe plan
└── widget/
    ├── index.ts       # widget.js entry point (bundled by esbuild)
    └── renderers/     # One file per widget type
```

## Frontend structure

```
apps/frontend/src/
├── App.tsx            # React Router, PrivateRoute guard
├── pages/             # One component per page
├── components/        # Shared components (Navbar, WidgetLivePreview)
├── context/
│   └── UserContext.tsx # Global user state (SaaS mode)
├── data/
│   └── widgetCatalog.ts # Widget type definitions + config forms
└── lib/
    └── api.ts         # Axios instance with JWT interceptor
```

## Widget.js

`widget.js` is a **standalone vanilla JS script** (35 KB minified, zero dependencies) bundled by esbuild from `apps/backend/src/widget/`.

It works like this:
1. On load, it reads the API base URL from the `src` attribute of the `<script>` tag
2. It scans the DOM for `<div data-ww-id="...">` elements
3. For each element, it fetches the widget config from `/widget/:id/data`
4. It calls the appropriate renderer (one per widget type)
5. Floating widgets (WhatsApp, Back-to-Top, Cookie) are appended to `document.body`

## Database schema

Three core Prisma models:

**Widget** — stores widget config as JSONB
```prisma
model Widget {
  id        String   @id @default(cuid())
  name      String
  type      String
  config    Json
  isActive  Boolean  @default(true)
  userId    String?  // null in selfhosted mode
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  views     WidgetView[]
}
```

**WidgetView** — daily analytics
```prisma
model WidgetView {
  id       String   @id @default(cuid())
  widgetId String
  date     DateTime
  count    Int      @default(0)
  @@unique([widgetId, date])
}
```

**User** — SaaS mode only (Better Auth also creates Session, Account, Verification tables)

## Key design decisions

- **JSONB config** — the `config` field on `Widget` is flexible JSON, no schema per widget type. This allows adding new widget types without database migrations.
- **node-cache** — Google reviews are cached for 7 days (configurable) to avoid rate limits. Cache is invalidated on widget update.
- **Image proxy** — Google photo URLs are proxied through `/widget/image?url=…` to avoid CORS issues in browsers.
- **Single Docker image** — in production, the React build is embedded in the backend image (`public/app/`). The backend detects this folder and serves the SPA statically.
