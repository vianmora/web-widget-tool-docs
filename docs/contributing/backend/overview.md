---
sidebar_position: 1
title: Overview
---

# Backend Overview

The backend is a **Node.js + Express** API written in TypeScript, located in `apps/backend/`.

## Stack

| Technology | Role |
|---|---|
| Node.js 20 | Runtime |
| Express 4 | HTTP framework |
| TypeScript | Language |
| Prisma | ORM + migrations |
| PostgreSQL 16 | Database |
| node-cache | In-memory cache (Google reviews) |
| Better Auth | Auth in SaaS mode |
| Stripe | Payments in SaaS mode |

## Entry point

`apps/backend/src/index.ts` is the Express app. It:

1. Configures CORS — **split policy**: `/api/*` routes accept only `FRONTEND_URL`, while `/widget/*` and `/widget.js` are fully open
2. Mounts all route groups
3. In production, detects `public/app/` (compiled React SPA) and serves it statically — this is the all-in-one mode

## Folder structure

```
apps/backend/src/
├── index.ts           # Express app, CORS, route registration, SPA serving
├── middleware/
│   ├── auth.ts        # JWT middleware (selfhosted)
│   └── authUnified.ts # Unified middleware (works in both modes)
├── routes/
│   ├── auth.ts        # Login/logout — JWT (selfhosted)
│   ├── widgets.ts     # Widget CRUD
│   ├── public.ts      # Public widget data + image proxy (open CORS)
│   ├── places.ts      # Google Places search + review fetch
│   ├── billing.ts     # Stripe webhook + subscription info
│   └── admin.ts       # Superadmin (SaaS only)
└── lib/
    ├── mode.ts        # isSaaS() — switches behavior at runtime
    ├── auth.ts        # Better Auth setup (SaaS)
    ├── prisma.ts      # Prisma client singleton
    ├── cache.ts       # node-cache singleton (default 7-day TTL)
    ├── google.ts      # Google Places API: searchPlaces, fetchGoogleReviewsWithPhotos
    ├── apify.ts       # Apify scraper for Google reviews (>5 + photos)
    ├── stripe.ts      # Stripe client
    └── planLimits.ts  # Widget/view quotas per plan
```

## Mode switching

The `isSaaS()` helper (`lib/mode.ts`) reads `process.env.APP_MODE` and returns `true` when it equals `saas`. It is used throughout routes and middleware to branch behavior:

```typescript
// In routes/widgets.ts
const where = isSaaS() ? { userId: req.user!.id } : {};
const widgets = await prisma.widget.findMany({ where });
```

In **selfhosted** mode, `userId` is always `null` on widgets, and there is no plan enforcement.

## Authentication flow

### Self-hosted mode

- `POST /api/auth/login` validates `ADMIN_EMAIL` / `ADMIN_PASSWORD` from env
- Returns a signed JWT
- `requireAuth` middleware verifies the JWT on protected routes

### SaaS mode

- Better Auth handles all auth routes under `/api/auth/*`
- `requireAuth` validates the Better Auth session token
- The `AuthRequest` type extends Express `Request` with `req.user`

## Google Reviews data flow

1. Widget.js calls `GET /widget/:id/data` (public, no auth)
2. Backend checks node-cache for a `apify:{placeId}:{maxReviews}:{language}` key
3. On cache miss:
   - If `APIFY_TOKEN` is set → calls Apify scraper (returns >5 reviews + photos)
   - Otherwise → calls Google Places API (max 5 reviews, no photos)
4. Results are cached for `GOOGLE_REVIEWS_CACHE_TTL` seconds (default 7 days)
5. Google photo URLs are rewritten to go through `/widget/image?url=…` (image proxy) to avoid browser CORS issues
6. Cache is invalidated when the widget config is updated via `PATCH /api/widgets/:id`

## Running the backend standalone

```bash
cd apps/backend

# Dev with hot reload
npm run dev

# Build
npm run build   # runs tsc + esbuild (widget.js)

# Production
npm start
```
