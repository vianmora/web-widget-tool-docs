---
sidebar_position: 6
title: Troubleshooting
---

# Troubleshooting

## Checking logs

The first step is always to check the container logs:

```bash
# All services
docker compose -f docker/compose.prod.hub.yml logs -f

# App only
docker compose -f docker/compose.prod.hub.yml logs -f app

# Database only
docker compose -f docker/compose.prod.hub.yml logs -f postgres
```

---

## Common issues

### The app is not reachable

**Symptoms:** `ERR_CONNECTION_REFUSED`, blank page, or timeout.

**Checks:**
```bash
# Is the container running?
docker compose -f docker/compose.prod.hub.yml ps

# Is the health check passing?
curl http://localhost:4000/health
# Expected: {"status":"ok"}

# Is the port open?
ss -tlnp | grep 4000
```

**Common causes:**
- Container is starting up — wait 10–30 seconds and retry
- Port conflict — another process is using port 4000. Change `PORT` in `.env`.
- The database health check failed and the app won't start — check postgres logs

---

### Login fails with "Invalid credentials"

**Check your `.env`:**
```bash
# Make sure these match exactly what you type in the login form
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-password
```

Changes to `ADMIN_EMAIL` or `ADMIN_PASSWORD` require a container restart:
```bash
docker compose -f docker/compose.prod.hub.yml restart app
```

---

### Google Reviews widget shows no reviews

**1. Check your API key:**
```bash
# Is it set?
docker compose -f docker/compose.prod.hub.yml exec app printenv GOOGLE_MAPS_API_KEY
```

**2. Check for API errors in the logs:**
```bash
docker compose -f docker/compose.prod.hub.yml logs app | grep -i google
```

**3. Verify the Places API is enabled** on your [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services.

**4. Check the cache** — if reviews loaded before and stopped, the cache might hold stale empty data. Trigger a cache invalidation by updating the widget (change any field and save).

---

### Widget shows "Widget not found"

- Verify the widget ID in `data-ww-id` matches an existing widget in the dashboard
- Check that the widget is **active** (not deleted)
- Make sure `widget.js` is loaded from the correct domain — the URL in `<script src="...">` must match your `APP_URL`

---

### CORS errors in the browser console

**Symptoms:** `Access-Control-Allow-Origin` errors when the dashboard tries to reach the API.

**Fix:** Make sure `FRONTEND_URL` exactly matches the origin of your dashboard (including protocol and port):

```bash
# Correct — matches the browser URL exactly
FRONTEND_URL=https://your-app.com

# Wrong — missing trailing slash or wrong protocol
FRONTEND_URL=https://your-app.com/   # trailing slash
FRONTEND_URL=http://your-app.com     # wrong protocol
```

Restart the app after changing this value.

---

### Database migration fails on startup

**Symptoms:** App crashes on startup with a Prisma migration error.

```bash
# Check the error
docker compose -f docker/compose.prod.hub.yml logs app | grep -i migration

# Run migrations manually
docker compose -f docker/compose.prod.hub.yml exec app npx prisma migrate deploy
```

If the database is unreachable, the postgres container may not be ready yet. Check its health:
```bash
docker compose -f docker/compose.prod.hub.yml ps postgres
```

---

### `widget.js` loads but renders nothing

**Check the browser console** for JavaScript errors. Common causes:

- The `data-ww-id` attribute is missing or misspelled
- The widget ID doesn't exist on the server
- `widget.js` can't reach the API — check the script `src` URL

**Test the API directly:**
```bash
curl https://your-app.com/widget/<YOUR_WIDGET_ID>/data
```

---

### High memory usage

The app caches Google review photos in memory (no size limit). If you embed many widgets with large photo sets, memory usage can grow. Restart the container periodically or set up a cron job:

```bash
docker compose -f docker/compose.prod.hub.yml restart app
```

---

## Getting help

If you can't resolve the issue, [open a GitHub issue](https://github.com/vianmora/web-widget-tool/issues) with:
- Your Docker Compose file (remove sensitive values)
- The relevant log output
- Your WebWidgetTool version (`docker inspect vianmora/web-widget-tool:latest | grep -i version`)
