# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this repository.

## What this project is

Documentation site for **WebWidgetTool** — an open-source, self-hostable SaaS platform for creating and managing 17+ embeddable widgets. This repo contains only the documentation, built with **Docusaurus v3** (React/TypeScript), deployed at **doc.webwidgettool.com**.

The main project lives at `../web-widget-tool/` (sibling repo). Always refer to it as the source of truth for technical details.

## Dev commands

```bash
npm run start    # Docusaurus dev server on http://localhost:3001 (hot reload)
npm run build    # Static build → build/
npm run serve    # Preview production build locally
npm run clear    # Clear Docusaurus cache (if hot reload breaks)
```

## Architecture

```
web-widget-tool-docs/
├── docs/
│   ├── self-hosting/       # Guide pour les personnes qui déploient elles-mêmes
│   └── contributing/       # Guide pour les contributeurs
├── src/
│   └── components/         # Composants MDX custom si besoin
├── static/
│   └── img/                # Screenshots, logos, diagrammes
├── docusaurus.config.ts
├── sidebars.ts
└── CLAUDE.md               # Ce fichier
```

## Source de vérité

Le repo principal est `C:/Users/vianm/Documents/Documents/git_projects/web-widget-tool/`.

Fichiers clés à consulter pour rédiger la doc :

| Info à documenter | Source |
|---|---|
| Variables d'env | `web-widget-tool/.env.example` |
| Docker / déploiement | `web-widget-tool/docker/` + `web-widget-tool/Dockerfile` |
| Architecture backend | `web-widget-tool/apps/backend/src/` |
| Architecture frontend | `web-widget-tool/apps/frontend/src/` |
| Widget.js / renderers | `web-widget-tool/apps/backend/src/widget/` |
| Catalogue de widgets | `web-widget-tool/apps/frontend/src/data/widgetCatalog.ts` |
| Modes self-hosted vs SaaS | `web-widget-tool/apps/backend/src/lib/mode.ts` |
| Schéma DB | `web-widget-tool/apps/backend/prisma/schema.prisma` |
| CI/CD | `web-widget-tool/.github/workflows/` |
| Doc self-hosting existante | `web-widget-tool/docs/SELF_HOSTING.md` |

## Plan de documentation

### Section 1 — Self-Hosting (`docs/self-hosting/`)

Pages à créer, par ordre de priorité :

| Fichier | Titre | Priorité | Contenu clé |
|---|---|---|---|
| `introduction.md` | Introduction | P0 | Qu'est-ce que WebWidgetTool, les 2 modes (self-hosted / SaaS) |
| `requirements.md` | Prérequis | P0 | Docker, ports, RAM recommandée |
| `quick-start.md` | Quick Start | P0 | Docker Hub en 5 min, `.env` minimum, login |
| `configuration.md` | Configuration | P0 | Tableau complet des variables d'env (required / optional / SaaS only) |
| `deployment/docker.md` | Docker Compose | P1 | compose.prod.yml vs compose.prod.hub.yml |
| `deployment/coolify.md` | Coolify | P1 | compose.coolify.hub.yml, variables SERVICE_FQDN |
| `deployment/vps-manual.md` | VPS (sans Docker) | P2 | Node.js + PostgreSQL + PM2 |
| `deployment/reverse-proxy.md` | Reverse Proxy | P1 | Nginx, Caddy, Traefik — config HTTPS |
| `upgrades.md` | Mises à jour | P2 | Pull nouvelle image, prisma migrate deploy |
| `troubleshooting.md` | Dépannage | P2 | Problèmes courants + solutions |

### Section 2 — Contributing (`docs/contributing/`)

| Fichier | Titre | Priorité | Contenu clé |
|---|---|---|---|
| `introduction.md` | Introduction | P0 | Philosophie, comment contribuer, conventions |
| `architecture.md` | Architecture | P0 | Vue d'ensemble du projet, modes, flux de données |
| `local-setup.md` | Setup local | P0 | Prérequis, clone, `.env`, `compose.dev.yml`, premiers pas |
| `backend/overview.md` | Backend | P1 | Express, Prisma, structure des routes, middleware |
| `backend/routes.md` | API Routes | P1 | Tableau de toutes les routes, auth, CORS |
| `backend/database.md` | Base de données | P2 | Schema Prisma, migrations, modèles |
| `frontend/overview.md` | Frontend | P1 | React, Vite, Tailwind, pages, context |
| `frontend/widget-catalog.md` | Widget Catalog | P1 | Comment ajouter un widget dans le catalogue |
| `widget-js/overview.md` | Widget.js | P1 | Architecture du script embarqué, renderers |
| `widget-js/add-renderer.md` | Ajouter un renderer | P1 | Guide étape par étape |
| `saas-mode.md` | Mode SaaS | P2 | Better Auth, Stripe, plans, limites |
| `pr-guidelines.md` | Branches & PR | P0 | Convention de branches, versioning, messages de commit |

### Section 3 — Référence widgets (`docs/widgets/`)

Une page par widget avec : description, config JSON, exemple embed HTML. À faire en dernier.

---

## Comment travailler ensemble

1. Notre discussion est en français, le contenu de la doc est en **anglais** (sauf mention contraire)
2. Toujours lire la source dans `../web-widget-tool/` avant de rédiger une page — ne jamais inventer de détails techniques
3. Les modifications de fix se font dans la branche `developp`
4. Les ajouts de section/page se font dans une branche dédiée ; je te le dirai
5. Quand je te dis de commit : commit dans `developp` si c'est un fix, dans la branche de feature si on travaille sur une feature
6. Quand je te dis de merge la branche de feature : merge dans `developp`, puis `developp` dans `main`
7. Quand tu as fini une instruction :
   - Mettre à jour ce fichier CLAUDE.md si tu trouves quelque chose d'utile à retenir
   - Ajouter une entrée dans `CLAUDE_HISTORIQUE.md` (format : `| date | demande résumée | action effectuée |`)
8. Si tu veux que je relance quelque chose, donne-moi la commande explicite

## Ce qu'il me manque pour travailler

> Section mise à jour au fil des sessions

- [ ] **Screenshots** : des captures de l'interface (dashboard, éditeur de widget, aperçu live) pour illustrer la doc self-hosting. Je peux rédiger les pages sans, mais ce serait mieux avec.
- [ ] **Domaine** : confirmation que `doc.webwidgettool.com` est prêt à pointer vers Vercel/Netlify quand on déploiera.
- [ ] **Langue** : confirmer si la doc est 100% anglais ou si certaines sections sont en français.
- [ ] **Branding** : logo WebWidgetTool en SVG/PNG pour le header Docusaurus.
