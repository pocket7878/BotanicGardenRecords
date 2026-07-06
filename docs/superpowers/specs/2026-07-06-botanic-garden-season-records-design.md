# Botanic Garden Season Records Design

## Goal

Build a low-cost GitHub Pages site for recording seasonal visits to major botanical gardens across Japan.

## Scope

The site is a static, single-page application. It lets a user mark whether they have visited each botanical garden in spring, summer, autumn, and winter. The record stays in the user's browser and can be backed up or restored with a JSON file.

The initial dataset should include representative large or public botanical gardens, large conservatories, flower parks, and wetland gardens across Japan. The initial list must include:

- Sakuya Konohana Kan
- Kyoto Botanical Gardens
- Jindai Botanical Garden
- Hakone Botanical Garden of Wetlands
- Odawara Flower Garden

## Non-Goals

- No login
- No server-side database
- No hosted API
- No cross-device sync
- No paid asset dependency
- No copying of the referenced PONKAN implementation or copyrighted botanical artwork

## Hosting

The site is designed for GitHub Pages. All runtime files must work under a repository subpath such as `https://<user>.github.io/<repo>/`, so asset references should be relative.

## UX

The first screen is the usable tracking interface, not a landing page.

The page contains:

- A header with the product name and progress summary
- Search by garden name, prefecture, region, or tag
- Region filter
- Status filter for all, incomplete, completed, or any visited
- Sort controls
- A grid of garden records
- Four seasonal toggle buttons per garden: spring, summer, autumn, winter
- JSON export, JSON import, and reset controls

Each garden card shows:

- Garden name
- Region and prefecture
- Type or tag labels
- Seasonal completion state
- Per-garden progress count

## Data Model

Garden data is static and separated from UI code.

Each garden has:

- `id`: stable ASCII identifier
- `name`: Japanese display name
- `prefecture`: Japanese prefecture name
- `region`: Japanese region name
- `type`: short Japanese category
- `tags`: short Japanese labels
- `url`: official or stable reference URL when known

Visit records are stored in `localStorage` as:

```json
{
  "version": 1,
  "visited": {
    "garden-id": {
      "spring": true,
      "summer": false,
      "autumn": true,
      "winter": false
    }
  },
  "updatedAt": "2026-07-06T00:00:00.000Z"
}
```

Unknown or missing seasonal values are treated as `false`.

## Visual Direction

Use a specimen-book style inspired by precise botanical illustration and archival herbarium labels. The design should feel botanical and beautiful without relying on generated images or paid assets.

The visual system uses:

- Warm paper background
- Fine green and brown linework
- Serif display typography for headings
- Clear sans-serif UI labels for controls
- Thin ruled borders
- Subtle botanical line decorations made with CSS
- Seasonal colors that remain readable

The interface must stay practical and readable on mobile and desktop.

## Implementation Structure

- `index.html`: static entry point and semantic layout shell
- `styles.css`: complete responsive visual design
- `src/data/gardens.js`: static garden dataset
- `src/storage.js`: localStorage load, save, export, import, and reset helpers
- `src/app.js`: UI rendering, filtering, sorting, and event handling
- `scripts/check-data.mjs`: dataset and storage-shape sanity checks
- `package.json`: local verification commands

## Testing

Use lightweight checks because the site has no build system.

Verification must cover:

- Garden IDs are unique
- Required example gardens are present
- Each garden has required fields
- Storage import rejects malformed payloads
- The page can be served locally and opened in a browser

## Acceptance Criteria

- The site opens from static files and from a local server.
- It is ready for GitHub Pages under a repository subpath.
- A user can mark any garden as visited in each of the four seasons.
- Progress updates immediately after toggling a season.
- Records persist after reload.
- JSON export downloads the current record.
- JSON import restores a valid exported record.
- Reset clears local records only after confirmation.
- The visual design reads as a botanical specimen book.
