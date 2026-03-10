---
sidebar_position: 3
title: Database
---

# Database

WebWidgetTool uses **PostgreSQL 16** with **Prisma** as the ORM. The schema lives in `apps/backend/prisma/schema.prisma`.

## Models

### Widget

The core model. Stores all widget configuration as a flexible JSONB field.

```prisma
model Widget {
  id        String   @id @default(uuid())
  name      String
  type      String   @default("google_reviews")
  config    Json                              // JSONB — flexible per widget type
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  userId    String?                           // null in selfhosted mode
  user      User?    @relation(...)

  views     WidgetView[]
}
```

The `config` field is JSONB — there is no per-type schema validation at the database level. The structure of `config` is defined by the widget catalog's `defaultConfig` in the frontend, and consumed by the renderers in `widget.js`.

**Example `config` for `google_reviews`:**
```json
{
  "placeId": "ChIJ...",
  "maxReviews": 10,
  "minRating": 4,
  "theme": "light",
  "accentColor": "#7c3aed",
  "layout": "carousel",
  "language": "en"
}
```

### WidgetView

Daily analytics — one row per widget per day.

```prisma
model WidgetView {
  id       String   @id @default(uuid())
  widgetId String
  widget   Widget   @relation(...)
  date     DateTime @db.Date        // date only, no time
  count    Int      @default(1)

  @@unique([widgetId, date])        // upserted each time a widget loads
}
```

View counts are incremented with an `upsert` every time `GET /widget/:id/data` is called:

```typescript
await prisma.widgetView.upsert({
  where: { widgetId_date: { widgetId: id, date: today } },
  create: { widgetId: id, date: today, count: 1 },
  update: { count: { increment: 1 } },
});
```

### User *(SaaS mode only)*

```prisma
model User {
  id                   String   @id @default(uuid())
  name                 String?
  email                String   @unique
  emailVerified        Boolean  @default(false)
  image                String?
  plan                 String   @default("free") // free | starter | pro | agency | admin
  stripeCustomerId     String?
  stripeSubscriptionId String?
  monthlyViewCount     Int      @default(0)
  monthlyViewResetAt   DateTime @default(now())
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  widgets  Widget[]
  sessions Session[]
  accounts Account[]
}
```

**Better Auth tables** (`Session`, `Account`, `Verification`) are also in the schema — managed automatically by Better Auth, do not modify them manually.

---

## Plan limits

Defined in `apps/backend/src/lib/planLimits.ts`:

| Plan | Max widgets | Monthly views |
|---|---|---|
| `free` | 1 | 500 |
| `starter` | 5 | 10,000 |
| `pro` | 20 | 100,000 |
| `agency` | Unlimited | Unlimited |
| `admin` | Unlimited | Unlimited |

---

## Migrations

### Creating a new migration (development)

```bash
# From apps/backend/ (or inside the container)
npx prisma migrate dev --name describe-your-change
```

This creates a new timestamped SQL file in `apps/backend/prisma/migrations/`.

### Applying migrations in production

Migrations run automatically on container startup via the `Dockerfile` entrypoint. To run manually:

```bash
docker compose -f docker/compose.prod.hub.yml exec app npx prisma migrate deploy
```

:::warning Never use `migrate dev` in production
`migrate dev` can reset the database. Always use `migrate deploy` in production environments.
:::

### Regenerating the Prisma client

After any schema change, regenerate the client:

```bash
npx prisma generate
```

This is also done automatically as part of `npm run build`.

---

## Prisma Studio (DB GUI)

```bash
cd apps/backend
npx prisma studio
# Opens http://localhost:5555
```

Or inside the dev container:

```bash
docker compose -f docker/compose.dev.yml exec backend npx prisma studio --hostname 0.0.0.0
```
