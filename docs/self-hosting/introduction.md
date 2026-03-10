---
sidebar_position: 1
title: Introduction
slug: /
---

# Self-Hosting WebWidgetTool

WebWidgetTool is an **open-source, self-hostable** platform for creating and managing embeddable widgets. You install it on your own server, keep full control of your data, and embed widgets on any website with a single `<script>` tag.

## What you get

- **17+ widget types** — Google Reviews, WhatsApp button, FAQ, Countdown, Pricing Table, Cookie Banner, Maps, and more
- **Dashboard** — create, configure, and preview widgets without writing code
- **widget.js** — a single 35 KB script that renders all your widgets on any website
- **Analytics** — daily view counts per widget

## Two deployment modes

WebWidgetTool supports two modes, set via the `APP_MODE` environment variable.

### Self-Hosted mode (`APP_MODE=selfhosted`)

Best for individuals and small teams.

- Single admin account configured via environment variables (`ADMIN_EMAIL` / `ADMIN_PASSWORD`)
- JWT authentication — no external auth service required
- No Stripe, no SMTP required (both optional)
- Unlimited widgets

### SaaS mode (`APP_MODE=saas`)

Best if you want to offer the platform to multiple users.

- Multi-user with email/password and OAuth (Google, GitHub, Facebook)
- Better Auth for user management
- Stripe integration with plan limits (Starter, Pro, Agency)
- SMTP for transactional emails
- Superadmin backoffice

:::tip Just getting started?
If you're deploying for yourself or your team, use **self-hosted mode**. It's simpler and has no external dependencies.
:::

## How widgets work

1. You create a widget in the dashboard and configure it
2. WebWidgetTool gives you an embed snippet — a `<div>` with a unique ID
3. You paste that snippet and the `<script src="/widget.js">` tag into your website's HTML
4. `widget.js` fetches the widget config from your server and renders it in place

```html
<!-- Place this where you want the widget to appear -->
<div data-ww-id="YOUR_WIDGET_ID"></div>

<!-- Place this before </body> -->
<script src="https://your-app.com/widget.js" async></script>
```

No npm, no build step, no framework required — it works on any HTML page.

## Next steps

- [Requirements](/self-hosting/requirements) — check what you need before installing
- [Quick Start](/self-hosting/quick-start) — deploy with Docker in under 5 minutes
- [Configuration](/self-hosting/configuration) — full list of environment variables
