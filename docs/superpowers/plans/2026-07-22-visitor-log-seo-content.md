# Visitor Log SEO Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the landing page communicate that the app is a private botanical-garden visit log, while preserving its seasonal collection experience.

**Architecture:** Keep the current static single-page application. Add semantic, indexable copy to `index.html`, narrow CSS in `styles.css`, and render a 1200×630px OGP PNG from the existing botanical background; no routes, data model, or runtime behavior change.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node.js validation script.

## Global Constraints

- Preserve the approved Japanese copy in `docs/superpowers/specs/2026-07-22-visitor-log-seo-content-design.md`.
- Do not add external services, login, analytics, or ads.
- Do not create a commit or push changes.

---

### Task 1: Add approved landing-page SEO content

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `scripts/check-data.mjs`

**Interfaces:**
- Consumes: existing semantic document structure and the approved copy.
- Produces: an indexable title, description, explanatory section, and FAQ without changing application behavior.

- [ ] **Step 1: Write the failing test**

Add assertions that `index.html` contains the approved title, meta description, the `訪れた季節を、あなたの標本帳に。` heading, and the three FAQ questions.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run check`

Expected: FAIL because the approved title and content do not exist yet.

- [ ] **Step 3: Write minimal implementation**

Add the approved metadata and semantic content to `index.html`. Add focused CSS that matches the existing paper-and-botanical visual language while preserving readable mobile layout.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run check && git diff --check`

Expected: the data and content checks pass with no whitespace errors.

- [ ] **Step 5: Inspect the rendered landing page**

Run: `npm run serve`

Expected: the new text is visible, readable, and does not displace the primary garden-list interaction excessively on desktop or mobile.

- [ ] **Step 6: Present local diff for review**

Run: `git diff -- index.html styles.css scripts/check-data.mjs`

Expected: only the approved SEO content and its validation are changed; do not commit or push.

### Task 2: Add a botanical-plate OGP image

**Files:**
- Create: `assets/ogp.png`
- Modify: `index.html`
- Modify: `scripts/check-data.mjs`

**Interfaces:**
- Consumes: `assets/botanical-background.png` and approved product copy.
- Produces: a 1200×630px PNG referenced by absolute OGP meta tags.

- [ ] **Step 1: Write the failing test**

Add assertions that `index.html` references `assets/ogp.png` in `og:image`, includes `og:title`, `og:description`, and `og:url`, and that `assets/ogp.png` exists.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run check`

Expected: FAIL because no OGP meta tags or OGP PNG exist yet.

- [ ] **Step 3: Write minimal implementation**

Create a temporary HTML renderer using the existing botanical background and the approved title. Capture it at 1200×630px as `assets/ogp.png`, then add the OGP meta tags to `index.html`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run check && git diff --check`

Expected: all content and OGP assertions pass with no whitespace errors.

- [ ] **Step 5: Inspect the output image**

Open: `assets/ogp.png`

Expected: the existing botanical-plate style is visible and the Japanese title is readable.

- [ ] **Step 6: Present local diff for review**

Run: `git diff --stat && git diff -- index.html styles.css scripts/check-data.mjs`

Expected: no commit or push; include the generated OGP image in the review summary.
