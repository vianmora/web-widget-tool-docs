---
sidebar_position: 1
title: Overview
---

# Widget.js Overview

`widget.js` is the **embed script** that end-users paste on their websites. It's a self-contained vanilla JavaScript bundle — no dependencies, no framework, ~35 KB minified.

## Source

The source lives in `apps/backend/src/widget/` and is bundled by **esbuild** into `apps/backend/public/widget.js` at build time.

```
apps/backend/src/widget/
├── index.ts           # Entry point — loader, renderer dispatcher
├── core/
│   ├── styles.ts      # CSS injection helper
│   └── badge.ts       # "Powered by" + quota exceeded banners
└── renderers/
    ├── google_reviews.ts
    ├── whatsapp_button.ts
    ├── faq.ts
    └── ...            # one file per widget type (18 total)
```

## How it works

### 1. API base URL detection

On load, `widget.js` resolves the backend URL using this priority order:

1. `window.__WW_API_BASE__` — explicit override (useful for advanced setups)
2. The `src` attribute of the `<script>` tag that loaded `widget.js` — extracts the origin
3. Empty string — falls back to same-origin requests

```html
<!-- Standard usage — auto-detects https://your-app.com -->
<script src="https://your-app.com/widget.js" async></script>

<!-- Manual override -->
<script>window.__WW_API_BASE__ = 'https://your-app.com'</script>
<script src="https://your-app.com/widget.js" async></script>
```

### 2. DOM scanning

On `DOMContentLoaded` (or immediately if the DOM is already ready), `initAll()` scans for all elements with `data-ww-id`:

```javascript
document.querySelectorAll('[data-ww-id]').forEach(initWidget);
```

### 3. Per-widget initialization

For each container element, `initWidget()`:

1. Reads the widget ID from `data-ww-id`
2. Sets `data-ww-init="1"` to prevent double initialization
3. Fetches `GET /widget/{id}/data` from the backend
4. Looks up the renderer in the `RENDERERS` map by `widget.type`
5. Calls `renderer(container, config, data)`

### 4. Floating vs. inline widgets

Some widgets are **floating** (fixed position, appended to `<body>`):
- `whatsapp_button`
- `telegram_button`
- `back_to_top`
- `cookie_banner`

These use `<div data-ww-id="...">` as an anchor only. The actual element is appended to `document.body`.

All other widgets render inside their container `<div>`.

### 5. CSS injection

Each renderer injects its own scoped CSS via `injectStyles(css, id)` from `core/styles.ts`. The style tag is only injected once per `id` (idempotent).

## Dynamic usage

`widget.js` exposes a global `WebWidgetTool` object for programmatic control:

```javascript
// Init a specific container (e.g. dynamically added to the DOM)
WebWidgetTool.init(document.querySelector('[data-ww-id="abc123"]'));

// Re-init all containers on the page
WebWidgetTool.initAll();
```

## Building widget.js

```bash
cd apps/backend
npm run build
# → runs tsc + esbuild, outputs to public/widget.js
```

In dev mode (`npm run dev`), the bundle is rebuilt automatically on changes.
