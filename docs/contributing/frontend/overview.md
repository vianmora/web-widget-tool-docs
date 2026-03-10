---
sidebar_position: 1
title: Overview
---

# Frontend Overview

The frontend is a **React 18 + Vite 5** single-page application written in TypeScript, located in `apps/frontend/`.

## Stack

| Technology | Role |
|---|---|
| React 18 | UI framework |
| Vite 5 | Build tool + dev server |
| TypeScript | Language |
| Tailwind CSS 3 | Styling |
| React Router 6 | Client-side routing |
| Axios | HTTP client |

## Folder structure

```
apps/frontend/src/
├── App.tsx                  # React Router setup, PrivateRoute guard
├── main.tsx                 # React entry point
├── pages/
│   ├── Login.tsx            # Email/password login
│   ├── Register.tsx         # User signup (SaaS mode)
│   ├── Dashboard.tsx        # Widget list — create, edit, delete
│   ├── NewWidget.tsx        # Widget creation form (step 1: type selection)
│   ├── WidgetDetail.tsx     # Widget config editor + live preview + embed snippet
│   ├── Billing.tsx          # Plan details + Stripe checkout (SaaS)
│   ├── Admin.tsx            # Superadmin user management (SaaS)
│   ├── Settings.tsx         # Profile + password change
│   ├── ForgotPassword.tsx   # Password reset request
│   └── ResetPassword.tsx    # Password reset form
├── components/
│   ├── Navbar.tsx           # Top navigation bar
│   └── WidgetLivePreview.tsx # iframe preview of the widget
├── context/
│   └── UserContext.tsx      # Global user state — plan, email (SaaS)
├── data/
│   └── widgetCatalog.ts     # 17+ widget type definitions + form fields
└── lib/
    └── api.ts               # Axios instance with JWT interceptor + 401 redirect
```

## Routing

`App.tsx` defines all routes with a `PrivateRoute` guard that checks `localStorage.token`. If the token is absent, the user is redirected to `/login`.

```
/login                → Login.tsx
/register             → Register.tsx (SaaS)
/                     → Dashboard.tsx (protected)
/widgets/new          → NewWidget.tsx (protected)
/widgets/:id          → WidgetDetail.tsx (protected)
/billing              → Billing.tsx (protected, SaaS)
/admin                → Admin.tsx (protected, superadmin)
/settings             → Settings.tsx (protected)
/forgot-password      → ForgotPassword.tsx
/reset-password       → ResetPassword.tsx
```

## API client

`lib/api.ts` exports an Axios instance that:
- Sets `baseURL` to `VITE_API_URL` (dev) or same origin (prod)
- Attaches `Authorization: Bearer <token>` from `localStorage.token` on every request
- Intercepts 401 responses and redirects to `/login`

## Authentication state

In **selfhosted mode**, auth state is just `localStorage.token` (JWT string).

In **SaaS mode**, `UserContext` holds the full user object (plan, email, image) and is fetched from `/api/auth/me` on app load.

## Widget live preview

`WidgetDetail.tsx` includes `WidgetLivePreview` — an `<iframe>` that loads a minimal HTML page calling `widget.js` with the current widget ID. It re-renders whenever the config is saved.

## Running the frontend standalone

```bash
cd apps/frontend

# Dev server (proxies /api and /widget to localhost:4000)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

In dev mode, Vite proxies `/api/*` and `/widget/*` to `http://localhost:4000` automatically.
