---
sidebar_position: 2
title: Add a Renderer
---

# Adding a Widget Renderer

This guide walks you through adding a new widget type end-to-end. We'll create a fictional `announcement_bar` widget as an example.

## Overview of what to touch

| File | What to do |
|---|---|
| `apps/backend/src/widget/renderers/announcement_bar.ts` | **Create** the renderer |
| `apps/backend/src/widget/index.ts` | **Register** the renderer |
| `apps/backend/src/routes/public.ts` | **Add** the type to the switch (if it has live data) |
| `apps/frontend/src/data/widgetCatalog.ts` | **Add** the widget definition |

---

## Step 1 — Create the renderer

Create `apps/backend/src/widget/renderers/announcement_bar.ts`.

A renderer is a single exported function with this signature:

```typescript
export function render(container: HTMLElement, config: any, data?: any): void
```

- `container` — the `<div data-ww-id="...">` element on the user's page
- `config` — the widget's config object from the database (same as `defaultConfig` in the catalog)
- `data` — live data from the backend (only for `apiWidget` types)

Example renderer:

```typescript
import { injectStyles } from '../core/styles';

const CSS = `
.ww-announcement {
  background: var(--ww-accent, #7c3aed);
  color: #fff;
  text-align: center;
  padding: 12px 20px;
  font-family: sans-serif;
  font-size: 14px;
  font-weight: 500;
}
.ww-announcement a {
  color: #fff;
  text-decoration: underline;
}
`;

export function render(container: HTMLElement, config: any): void {
  injectStyles(CSS, 'announcement-bar');

  const { message = '', linkText = '', linkUrl = '', accentColor = '#7c3aed' } = config;

  container.style.setProperty('--ww-accent', accentColor);
  container.innerHTML = `
    <div class="ww-announcement">
      ${message}
      ${linkUrl ? `<a href="${linkUrl}" target="_blank" rel="noopener">${linkText || 'Learn more'}</a>` : ''}
    </div>
  `;
}
```

**Guidelines:**
- Scope all CSS class names with `ww-` prefix to avoid conflicts with the host page
- Use `injectStyles(css, uniqueId)` — it injects the `<style>` tag only once per page
- Never use `document.querySelector` on elements outside `container` (except floating widgets that go on `body`)
- For floating widgets, append directly to `document.body` instead of rendering into `container`

---

## Step 2 — Register the renderer in `index.ts`

Open `apps/backend/src/widget/index.ts` and add:

```typescript
// 1. Import
import { render as renderAnnouncementBar } from './renderers/announcement_bar';

// 2. Add to RENDERERS map
const RENDERERS: Record<string, RendererFn> = {
  // ... existing renderers ...
  announcement_bar: (c, cfg) => renderAnnouncementBar(c, cfg),
};
```

If your widget is floating (appends to `<body>`), also add it to `BODY_WIDGETS`:

```typescript
const BODY_WIDGETS = new Set([
  'whatsapp_button', 'telegram_button', 'back_to_top', 'cookie_banner',
  'announcement_bar', // add here if floating
]);
```

---

## Step 3 — Handle backend data (optional)

If your widget needs **live data from the server** (like Google Reviews does), add a case in `apps/backend/src/routes/public.ts` inside the `getWidgetData` switch:

```typescript
case 'announcement_bar':
  // This widget is config-only, no live data needed
  return {};
```

For config-only widgets, returning `{}` is sufficient — `widget.js` will pass the config directly to the renderer.

For widgets with live data, fetch and return it here. The `data` object is passed as the third argument to the renderer.

---

## Step 4 — Add to the frontend catalog

Open `apps/frontend/src/data/widgetCatalog.ts` and add the definition:

```typescript
{
  type: 'announcement_bar',      // must match the RENDERERS key exactly
  name: 'Announcement Bar',
  description: 'Display a banner message at the top of your page.',
  category: 'Conversion & Engagement',
  icon: '📢',
  status: 'available',           // set to 'soon' while in development
  defaultConfig: {
    message: 'Free shipping on orders over $50!',
    linkText: 'Shop now',
    linkUrl: '',
    accentColor: '#7c3aed',
  },
  fields: [
    { key: 'message', label: 'Message', type: 'textarea', required: true },
    { key: 'linkText', label: 'Link text', type: 'text', placeholder: 'Shop now' },
    { key: 'linkUrl', label: 'Link URL', type: 'url', placeholder: 'https://...' },
    { key: 'accentColor', label: 'Background color', type: 'color' },
  ],
},
```

---

## Step 5 — Test

1. Start the dev stack: `docker compose -f docker/compose.dev.yml up -d`
2. Open the dashboard at `http://localhost:3000`
3. Create a new widget of type **Announcement Bar**
4. Check the live preview in the editor
5. Copy the embed snippet and paste it into a test HTML page

---

## Checklist

- [ ] Renderer file created in `renderers/`
- [ ] Renderer imported and added to `RENDERERS` in `index.ts`
- [ ] Case added to `getWidgetData` switch in `routes/public.ts`
- [ ] Widget definition added to `WIDGET_CATALOG` in `widgetCatalog.ts`
- [ ] `status: 'available'` set once the renderer is ready
- [ ] CSS classes prefixed with `ww-`
- [ ] Tested locally with the dev stack
