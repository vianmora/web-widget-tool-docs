---
sidebar_position: 9
title: SaaS Mode
---

# SaaS Mode

SaaS mode (`APP_MODE=saas`) turns WebWidgetTool into a multi-user platform with authentication, billing, and plan-based limits.

## Enabling SaaS mode

Set `APP_MODE=saas` in your `.env` and configure the required variables:

```bash
APP_MODE=saas

# Better Auth
BETTER_AUTH_SECRET=          # openssl rand -hex 32
BETTER_AUTH_URL=             # public backend URL, e.g. https://api.yourdomain.com

# SMTP (required — for email verification and password reset)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=smtp-password
SMTP_FROM="WebWidgetTool <noreply@yourdomain.com>"

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_AGENCY=price_...

# Superadmin
SUPERADMIN_EMAIL=admin@yourdomain.com
```

---

## Authentication — Better Auth

In SaaS mode, authentication is handled by [Better Auth](https://www.better-auth.com/), configured in `apps/backend/src/lib/auth.ts`.

### What's enabled

- **Email + password** with mandatory email verification
- **OAuth** — Google, Facebook, GitHub (enabled automatically if the corresponding env vars are set)
- **Session-based auth** — sessions stored in the `Session` table via Prisma

### Email flows

| Event | Email sent |
|---|---|
| User registers | Email verification link |
| Email verified | Welcome email |
| Password reset requested | Reset link |

All email templates are in `apps/backend/src/lib/mailer.ts`.

### Adding an OAuth provider

Set the corresponding environment variables — Better Auth activates the provider automatically:

```bash
# Google
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# GitHub
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# Facebook
FACEBOOK_CLIENT_ID=...
FACEBOOK_CLIENT_SECRET=...
```

---

## Plans and limits

Plans are defined in `apps/backend/src/lib/planLimits.ts`:

| Plan | Widgets | Monthly views | Powered by badge |
|---|---|---|---|
| `free` | 1 | 500 | Yes |
| `starter` | 5 | 10,000 | No |
| `pro` | 20 | 100,000 | No |
| `agency` | Unlimited | Unlimited | No |

### Widget limit enforcement

Checked in `POST /api/widgets` before creating a widget:

```typescript
if (hasReachedWidgetLimit(req.user!.plan, currentCount)) {
  return res.status(403).json({ code: 'WIDGET_LIMIT_REACHED', ... });
}
```

### Monthly view limit enforcement

Checked in `GET /widget/:id/data` on every widget load. When the limit is reached:
- The widget still renders (no hard block for end-users)
- The response includes `_quotaExceeded: true`
- `widget.js` shows a "quota exceeded" banner inside the widget

The monthly counter resets automatically at the start of each calendar month.

---

## Stripe integration

### Webhooks

Configure a Stripe webhook pointing to `https://your-backend.com/api/billing/webhook`. Listen for these events:

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

On each event, the backend updates the user's `plan` field in the database.

### Creating Stripe products

Create three products in your Stripe dashboard (Starter, Pro, Agency) and copy their price IDs into:

```bash
STRIPE_PRICE_STARTER=price_xxx
STRIPE_PRICE_PRO=price_xxx
STRIPE_PRICE_AGENCY=price_xxx
```

### Checkout flow

1. Authenticated user clicks **Upgrade** in the dashboard
2. Frontend calls `POST /api/billing/checkout` with the desired plan
3. Backend creates a Stripe Checkout session and returns the URL
4. User is redirected to Stripe to complete payment
5. On success, Stripe sends a `customer.subscription.created` webhook
6. Backend updates the user's plan

---

## Superadmin

Set `SUPERADMIN_EMAIL` to grant access to the admin backoffice (`/admin` in the dashboard).

The superadmin can:
- View all users and their plans
- Override a user's plan manually (without Stripe)

The superadmin check is done in `apps/backend/src/routes/admin.ts` by comparing `req.user.email` to `process.env.SUPERADMIN_EMAIL`.

---

## Differences from self-hosted mode

| Feature | Self-hosted | SaaS |
|---|---|---|
| Users | Single admin (env vars) | Multi-user (Better Auth) |
| Auth | JWT | Better Auth sessions |
| Widget ownership | No `userId` on widgets | Widgets scoped to user |
| Plan limits | None | Enforced per plan |
| Stripe | Not used | Required |
| SMTP | Optional | Required |
| `/admin` route | Not active | Superadmin only |
