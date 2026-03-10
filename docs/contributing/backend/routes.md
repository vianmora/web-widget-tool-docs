---
sidebar_position: 2
title: API Routes
---

# API Routes

## Authentication — `/api/auth`

Rate limited: 30 requests / 15 minutes.

| Method | Path | Mode | Auth | Description |
|---|---|---|---|---|
| `POST` | `/api/auth/login` | Both | — | Login with email + password. Returns JWT (selfhosted) or session cookie (SaaS) |
| `POST` | `/api/auth/logout` | Both | — | Logout / invalidate session |
| `POST` | `/api/auth/register` | SaaS | — | Create a new user account |
| `POST` | `/api/auth/forgot-password` | SaaS | — | Send password reset email |
| `POST` | `/api/auth/reset-password` | SaaS | — | Reset password with token |
| `*` | `/api/auth/*` | SaaS | — | Better Auth dynamic routes (OAuth, session, etc.) |

**Login response (selfhosted):**
```json
{ "token": "eyJhbGciOi..." }
```

---

## Widgets — `/api/widgets`

All routes require authentication. In SaaS mode, each route is scoped to the authenticated user.

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/widgets` | List all widgets (SaaS: current user only) |
| `POST` | `/api/widgets` | Create a widget. Checks plan limit in SaaS mode |
| `GET` | `/api/widgets/:id` | Get a single widget |
| `PATCH` | `/api/widgets/:id` | Update name and/or config. Invalidates cache |
| `DELETE` | `/api/widgets/:id` | Delete a widget |
| `GET` | `/api/widgets/:id/stats` | View stats (views this month + total) |

**Create widget body:**
```json
{
  "name": "My Google Reviews",
  "type": "google_reviews",
  "config": {
    "placeId": "ChIJ...",
    "maxReviews": 10,
    "minRating": 4,
    "theme": "light",
    "accentColor": "#7c3aed",
    "layout": "carousel",
    "language": "en"
  }
}
```

**Plan limit error (SaaS, HTTP 403):**
```json
{
  "error": "Limit reached: your plan allows 3 widget(s). Upgrade your plan.",
  "code": "WIDGET_LIMIT_REACHED"
}
```

---

## Places — `/api/places`

Requires authentication. Used by the dashboard's Google Reviews widget editor.

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/places/search?q=...` | Search Google Places by name (min 2 chars). Returns place suggestions |
| `GET` | `/api/places/reviews?placeId=...` | Fetch reviews for a place ID. Cached 7 days |

---

## Public widget routes — `/widget`

**Open CORS** — no authentication. Called by `widget.js` from any domain.

| Method | Path | Description |
|---|---|---|
| `GET` | `/widget/:id/data` | Main endpoint. Returns widget config + data (reviews, etc.). Tracks view analytics. Checks SaaS view quota |
| `GET` | `/widget/:id/reviews` | Legacy alias — redirects (307) to `/:id/data` |
| `GET` | `/widget/image?url=...` | Image proxy for Google CDN photos. Whitelists `*.googleusercontent.com` and `*.googleapis.com` |

**Widget data response:**
```json
{
  "widget": {
    "id": "abc123",
    "name": "My Reviews",
    "type": "google_reviews",
    "config": { "theme": "light", "accentColor": "#7c3aed", ... }
  },
  "data": {
    "reviews": [...],
    "averageRating": 4.8,
    "totalReviews": 127
  },
  "_poweredBy": false,
  "_quotaExceeded": false
}
```

`_poweredBy: true` means "show the Powered by WebWidgetTool badge" (free plan in SaaS mode).
`_quotaExceeded: true` means the user has hit their monthly view limit.

---

## Billing — `/api/billing`

SaaS mode only. Requires authentication except the webhook.

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/billing/webhook` | Stripe signature | Stripe webhook — updates plan on subscription events |
| `GET` | `/api/billing/subscription` | JWT / session | Current plan + subscription details |
| `POST` | `/api/billing/checkout` | JWT / session | Create a Stripe Checkout session for plan upgrade |

---

## Admin — `/api/admin`

SaaS mode only. Requires `SUPERADMIN_EMAIL`.

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/admin/users` | List all users with plan and widget count |
| `PATCH` | `/api/admin/users/:id/plan` | Override a user's plan |

---

## Health check

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Returns `{"status":"ok"}`. Used by Docker health checks |
