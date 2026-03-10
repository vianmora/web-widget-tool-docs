---
sidebar_position: 1
title: Introduction
---

# Contributing to WebWidgetTool

Thank you for your interest in contributing! WebWidgetTool is open source and welcomes contributions of all kinds — bug fixes, new widgets, documentation improvements, and feature requests.

## Ways to contribute

- **Report a bug** — open an issue on [GitHub](https://github.com/vianmora/web-widget-tool/issues)
- **Fix a bug** — pick an open issue, fork the repo, and open a pull request
- **Add a widget** — new widget types are always welcome (see [Adding a Renderer](./widget-js/add-renderer))
- **Improve the docs** — this very site is open source, contributions welcome
- **Share feedback** — open a GitHub discussion or issue

## Before you start

1. **Read the architecture overview** — understanding how the project is structured will save you a lot of time. Start with [Architecture](./architecture).
2. **Set up your local environment** — follow the [Local Setup](./local-setup) guide to get the full stack running on your machine.
3. **Check open issues** — your idea might already be tracked or discussed.

## Code conventions

- **Language**: code and comments in English; commit messages in English
- **TypeScript** everywhere — no `any` unless absolutely necessary
- **Prisma** for all database access — never write raw SQL queries
- **No test suite yet** — we're working on it. For now, manually test your changes.

## Branching model

| Branch | Purpose |
|---|---|
| `main` | Production — stable releases only, tagged with version |
| `developp` | Integration branch — all fixes merge here first |
| `feature/*` | Feature branches — one per feature, branched from `developp` |

See [Branches & PR Guidelines](./pr-guidelines) for the full workflow.

## Project structure at a glance

```
web-widget-tool/
├── apps/
│   ├── backend/     # Node.js + Express + Prisma
│   └── frontend/    # React + Vite + Tailwind
├── docker/          # Docker Compose files
└── Dockerfile       # Multi-stage build
```

Full details in [Architecture](./architecture).
