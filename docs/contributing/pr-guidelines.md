---
sidebar_position: 4
title: Branches & PR Guidelines
---

# Branches & PR Guidelines

## Branching model

| Branch | Purpose |
|---|---|
| `main` | Production — stable releases only. Every commit on `main` is tagged with a version. |
| `developp` | Integration branch — all fixes and feature merges land here before going to `main`. |
| `feature/*` | One branch per feature, created from `developp`. |

## Workflow

### For a bug fix

```bash
git checkout developp
git pull origin developp
# ... make your changes ...
git commit -m "fix: description of the fix"
git push origin developp
# open a PR: developp → developp (or maintainer merges directly)
```

### For a new feature

```bash
git checkout developp
git pull origin developp
git checkout -b feature/my-feature-name
# ... make your changes ...
git commit -m "feat: description of the feature"
git push origin feature/my-feature-name
# open a PR: feature/my-feature-name → developp
```

When a feature is ready, the maintainer merges:
1. `feature/my-feature-name` → `developp`
2. `developp` → `main`
3. Tags `main` with a new version

## Versioning

WebWidgetTool uses **semantic versioning**: `vMajor.Minor.Fix`

| Change | Bump |
|---|---|
| Bug fix / patch | Fix: `v0.2.15` → `v0.2.16` |
| New feature / new widget | Minor: `v0.2.x` → `v0.3.0` |
| Breaking change | Major: `v0.x.x` → `v1.0.0` |

Tags are applied on `main` only:

```bash
git tag v0.3.0
git push origin v0.3.0
```

## Commit message format

Use the conventional commits style:

```
type: short description (max 72 chars)

Optional longer description.
```

| Type | When to use |
|---|---|
| `feat` | New feature or widget |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `refactor` | Refactoring with no behavior change |
| `chore` | Build, CI, dependencies |

Examples:
```
feat: add countdown timer widget renderer
fix: google reviews image proxy returning 403
docs: add coolify deployment guide
chore: bump prisma to 5.x
```

## Pull request checklist

Before opening a PR:

- [ ] The feature works locally with `docker compose -f docker/compose.dev.yml up`
- [ ] No TypeScript errors (`npx tsc --noEmit` in the relevant app)
- [ ] Existing functionality is not broken
- [ ] If you added a new widget: it's registered in `widgetCatalog.ts` and has a renderer in `apps/backend/src/widget/renderers/`
- [ ] PR description explains what changed and why

## CI / Docker Hub

On every push to `main`, a GitHub Actions workflow builds and pushes a multi-arch Docker image (`linux/amd64`, `linux/arm64`) to Docker Hub. The push is skipped if the existing `latest` tag was pushed less than 24 hours ago (to avoid redundant builds). A manual `workflow_dispatch` bypasses this check.

Required GitHub repository secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`.
