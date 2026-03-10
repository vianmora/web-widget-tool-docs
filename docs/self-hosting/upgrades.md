---
sidebar_position: 5
title: Upgrades
---

# Upgrades

## Checking the current version

WebWidgetTool follows `vMajor.Minor.Fix` versioning. Releases are tagged on the `main` branch and published as Docker images on Docker Hub.

Check the [GitHub releases](https://github.com/vianmora/web-widget-tool/releases) page to see what's new before upgrading.

---

## Upgrading with Docker Hub (recommended)

If you're using `compose.prod.hub.yml` or `compose.coolify.yml`, upgrading is a two-step process:

```bash
# 1. Pull the latest image
docker compose -f docker/compose.prod.hub.yml --env-file .env.prod pull

# 2. Recreate the container (runs migrations automatically on startup)
docker compose -f docker/compose.prod.hub.yml --env-file .env.prod up -d
```

That's it. The backend runs `prisma migrate deploy` automatically on startup, so database migrations are applied without manual intervention.

---

## Upgrading from source

If you built from source (`compose.prod.yml`):

```bash
# 1. Pull latest code
git pull origin main

# 2. Rebuild and restart
docker compose -f docker/compose.prod.yml --env-file .env.prod up --build -d
```

---

## Before upgrading

### 1. Back up your database

Always back up before upgrading, especially for minor and major version bumps which may include database migrations.

```bash
# Find your postgres container ID
docker ps

# Dump the database
docker exec <postgres-container-id> pg_dump -U postgres widgets > backup-$(date +%Y%m%d).sql
```

### 2. Read the release notes

Check the [CHANGELOG](https://github.com/vianmora/web-widget-tool/blob/main/CHANGELOG.md) for breaking changes, new environment variables, or migration notes.

---

## Version types

| Version bump | What changed | Action required |
|---|---|---|
| Fix (`v0.2.15` → `v0.2.16`) | Bug fix, no schema changes | Pull + restart |
| Minor (`v0.2.x` → `v0.3.0`) | New feature or widget, possible migrations | Back up + pull + restart |
| Major (`v0.x` → `v1.0`) | Breaking changes | Read migration guide carefully |

---

## Rolling back

If something goes wrong, roll back to the previous image:

```bash
# Use a specific version tag instead of latest
docker compose -f docker/compose.prod.hub.yml --env-file .env.prod pull vianmora/web-widget-tool:v0.2.14

# Or restore from backup
docker exec -i <postgres-container-id> psql -U postgres widgets < backup-20260310.sql
```

:::warning Downgrading with migrations
If the new version ran database migrations, restoring from a backup is the safest way to downgrade. Reverting migrations manually is error-prone.
:::
