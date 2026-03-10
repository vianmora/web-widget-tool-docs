---
sidebar_position: 2
title: Widget Catalog
---

# Widget Catalog

The widget catalog (`apps/frontend/src/data/widgetCatalog.ts`) is the **single source of truth** for what widgets exist in the UI — their names, categories, configuration fields, and default values.

When you add a new widget type, you must register it here **and** create a backend renderer. This page covers the frontend side; see [Adding a Renderer](../widget-js/add-renderer) for the backend side.

## Structure

Each widget is defined as a `WidgetDefinition` object:

```typescript
interface WidgetDefinition {
  type: string;              // unique identifier, snake_case — matches the renderer key
  name: string;              // display name in the UI
  description: string;       // short description shown on the catalog card
  category: string;          // groups widgets in the "New Widget" page
  icon: string;              // emoji icon
  status: 'available' | 'soon'; // 'soon' hides the widget from creation (grayed out)
  defaultConfig: Record<string, any>; // initial config values when creating
  fields: FieldDefinition[];  // form fields shown in the editor
  apiWidget?: boolean;        // true if the widget fetches live data (e.g. Google Reviews)
  templates?: WidgetTemplate[]; // optional layout presets
}
```

## Field types

The `fields` array drives the config editor form automatically. Supported field types:

| Type | Renders as |
|---|---|
| `text` | Text input |
| `textarea` | Multiline text area |
| `number` | Number input (with optional `min` / `max`) |
| `select` | Dropdown (requires `options: [{value, label}]`) |
| `color` | Color picker |
| `url` | URL input |
| `email` | Email input |
| `phone` | Phone number input |
| `toggle` | On/Off switch |
| `array` | Repeatable list of items |
| `date` | Date/time picker |

## Adding a widget to the catalog

### 1. Define the widget

Add a new entry to the `WIDGET_CATALOG` array in `widgetCatalog.ts`:

```typescript
{
  type: 'my_widget',
  name: 'My Widget',
  description: 'A brief description of what it does.',
  category: 'Conversion & Engagement', // use an existing category or create a new one
  icon: '🎯',
  status: 'available',
  defaultConfig: {
    title: 'Hello',
    accentColor: '#7c3aed',
    theme: 'light',
  },
  fields: [
    {
      key: 'title',
      label: 'Title',
      type: 'text',
      placeholder: 'Enter a title',
      required: true,
    },
    {
      key: 'accentColor',
      label: 'Accent color',
      type: 'color',
    },
    {
      key: 'theme',
      label: 'Theme',
      type: 'select',
      options: [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
      ],
    },
  ],
},
```

### 2. Common config fields

Most widgets share these standard fields — reuse them for consistency:

```typescript
{ key: 'theme', label: 'Theme', type: 'select', options: [{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }] },
{ key: 'accentColor', label: 'Accent color', type: 'color' },
```

### 3. Set `status: 'available'`

Widgets with `status: 'soon'` appear grayed out in the catalog and cannot be created. Set it to `'available'` once the renderer is ready.

### 4. Create the backend renderer

The `type` value must exactly match the key in the backend `RENDERERS` map. See [Adding a Renderer](../widget-js/add-renderer).

## Existing categories

| Category | Examples |
|---|---|
| `Avis & Témoignages` | Google Reviews, Testimonials, Rating Badge |
| `Boutons sociaux` | WhatsApp, Telegram, Social Icons, Social Share |
| `Médias & Contenu` | Logo Carousel, Image Gallery, PDF Viewer |
| `Conversion & Engagement` | Countdown, Cookie Banner, Back to Top |
| `Informations pratiques` | Business Hours, Google Maps, FAQ, Pricing, Team |
