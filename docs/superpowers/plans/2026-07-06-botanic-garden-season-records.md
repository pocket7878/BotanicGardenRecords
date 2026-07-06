# Botanic Garden Season Records Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a GitHub Pages-ready static site for tracking seasonal visits to major botanical gardens in Japan.

**Architecture:** The app is a no-build static site. Garden data, storage logic, and UI rendering are split into focused JavaScript modules, with all user records stored in `localStorage` and portable through JSON export/import.

**Tech Stack:** HTML, CSS, vanilla JavaScript ES modules, Node.js for lightweight data checks.

---

## File Structure

- `index.html`: semantic page shell and controls.
- `styles.css`: responsive botanical specimen-book visual system.
- `src/data/gardens.js`: static garden dataset.
- `src/storage.js`: localStorage and JSON import/export helpers.
- `src/app.js`: rendering, filtering, sorting, and event binding.
- `scripts/check-data.mjs`: dataset and storage validation.
- `package.json`: verification command.

### Task 1: Static Shell

**Files:**
- Create: `index.html`
- Create: `package.json`

- [x] **Step 1: Create the HTML entry point**

Create `index.html` with relative module and stylesheet references:

```html
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>植物園四季採集帖</title>
    <link rel="stylesheet" href="./styles.css">
  </head>
  <body>
    <div class="page-shell">
      <header class="hero">
        <div class="hero__text">
          <p class="eyebrow">Botanic Garden Season Records</p>
          <h1>植物園四季採集帖</h1>
          <p class="lead">日本各地の主要な植物園を、春・夏・秋・冬の季節ごとに記録する標本帳です。</p>
        </div>
        <section class="summary" aria-label="進捗">
          <div><span id="summaryGardens">0</span><small>植物園</small></div>
          <div><span id="summarySeasons">0</span><small>季節記録</small></div>
          <div><span id="summaryComplete">0</span><small>四季制覇</small></div>
        </section>
      </header>

      <main>
        <section class="toolbar" aria-label="絞り込み">
          <label>
            <span>検索</span>
            <input id="searchInput" type="search" placeholder="植物園名・都道府県・タグ">
          </label>
          <label>
            <span>地域</span>
            <select id="regionFilter"></select>
          </label>
          <label>
            <span>状態</span>
            <select id="statusFilter">
              <option value="all">すべて</option>
              <option value="incomplete">未完了</option>
              <option value="visited">訪問あり</option>
              <option value="complete">四季制覇</option>
            </select>
          </label>
          <label>
            <span>並び順</span>
            <select id="sortSelect">
              <option value="region">地域順</option>
              <option value="progress">進捗順</option>
              <option value="name">名前順</option>
            </select>
          </label>
        </section>

        <section class="actions" aria-label="バックアップ">
          <button id="exportButton" type="button">JSONを書き出す</button>
          <label class="import-button">
            JSONを読み込む
            <input id="importInput" type="file" accept="application/json,.json">
          </label>
          <button id="resetButton" type="button">記録をリセット</button>
        </section>

        <p id="resultCount" class="result-count"></p>
        <section id="gardenGrid" class="garden-grid" aria-live="polite"></section>
      </main>
    </div>
    <script type="module" src="./src/app.js"></script>
  </body>
</html>
```

- [x] **Step 2: Create package metadata**

Create `package.json`:

```json
{
  "scripts": {
    "check": "node scripts/check-data.mjs",
    "serve": "python3 -m http.server 4173"
  },
  "devDependencies": {}
}
```

### Task 2: Garden Dataset

**Files:**
- Create: `src/data/gardens.js`
- Create: `scripts/check-data.mjs`

- [x] **Step 1: Create garden data**

Create `src/data/gardens.js` exporting `SEASONS` and `GARDENS`, with at least 40 nationally distributed gardens and the five required examples.

- [x] **Step 2: Create validation script**

Create `scripts/check-data.mjs` that imports the dataset and verifies unique IDs, required fields, season keys, and required examples.

- [x] **Step 3: Run validation**

Run: `npm run check`

Expected: PASS with a count of validated gardens.

### Task 3: Storage Helpers

**Files:**
- Create: `src/storage.js`
- Modify: `scripts/check-data.mjs`

- [x] **Step 1: Implement storage helpers**

Create helpers for `createEmptyState`, `normalizeState`, `loadState`, `saveState`, `serializeState`, `parseImportedState`, and `clearState`.

- [x] **Step 2: Extend validation**

Import `parseImportedState` in `scripts/check-data.mjs` and assert that malformed payloads throw while valid payloads normalize.

- [x] **Step 3: Run validation**

Run: `npm run check`

Expected: PASS.

### Task 4: UI Rendering

**Files:**
- Create: `src/app.js`

- [x] **Step 1: Render filters and garden cards**

Implement region options, search, status filter, sort, and card rendering.

- [x] **Step 2: Implement season toggles**

Each seasonal button toggles the matching stored value, persists state, and re-renders summaries.

- [x] **Step 3: Implement backup controls**

Export downloads JSON. Import reads a JSON file and restores valid records. Reset clears state after confirmation.

### Task 5: Visual Design

**Files:**
- Create: `styles.css`

- [x] **Step 1: Build specimen-book style**

Create responsive CSS with paper background, ruled borders, botanical linework, accessible controls, and mobile-safe card layout.

- [x] **Step 2: Check layout manually**

Run: `npm run serve`

Open `http://127.0.0.1:4173/` and verify that the page renders, toggles persist after reload, and JSON export/import works.

### Task 6: Final Verification

**Files:**
- Modify only if verification finds defects.

- [x] **Step 1: Run data checks**

Run: `npm run check`

Expected: PASS.

- [x] **Step 2: Inspect git diff**

Run: `git diff --check`

Expected: no whitespace errors.
