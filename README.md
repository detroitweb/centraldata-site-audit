# CentralData Site Audit — Visual Regression Testing

Automated visual regression tests for [centraldata.com](https://centraldata.com), maintained by [DetroitWeb.net](https://detroitweb.net). Captures pixel-accurate baseline screenshots of key pages and compares them after WordPress plugin updates to catch layout regressions before they reach real visitors.

**Repository:** [github.com/detroitweb/centraldata-site-audit](https://github.com/detroitweb/centraldata-site-audit)

---

## How It Works

1. **Baseline capture** — run the suite once to photograph every covered page at 1280×800. Images are stored in `cypress-image-diff-screenshots/baseline/`.
2. **Regression run** — run the suite again after any update. Each page is re-photographed and compared pixel-by-pixel against its baseline.
3. **Diff report** — any pixel that changed is painted red in a diff image saved to `cypress-image-diff-screenshots/diff/`. Side-by-side comparisons land in `cypress-image-diff-screenshots/comparison/`.
4. **Pass / fail** — the test fails if the percentage of changed pixels exceeds the configured threshold (default: 1%).

---

## Pages Covered

| Spec file | Pages tested |
|---|---|
| `homepage.cy.js` | Full page, hero section, footer |
| `navigation.cy.js` | Primary nav (desktop), mobile 375px, tablet 768px |
| `landing-pages.cy.js` | Infor CloudSuite Distribution, Analytics, Ecommerce, CD Marketplace, CD Ship, CD Rental, CD Report Pack |
| `product-pages.cy.js` | CD Marketplace, CD Audit, CD Rental |

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or v20
- npm v9+
- Chrome (for headed mode or CI runs)

---

## Setup

```bash
git clone https://github.com/detroitweb/centraldata-site-audit.git
cd centraldata-site-audit
npm install
```

Cypress downloads its binary on first install. This takes 1–2 minutes.

---

## Running Tests

### Capture baselines (first time, or after intentional design changes)

```bash
npm run test:update
```

This deletes the existing `baseline/` folder and runs the full suite. Every screenshot taken becomes the new baseline.

### Run regression checks

```bash
npm test
```

Compares live pages against baselines. Results are printed to the terminal. Images land in `cypress-image-diff-screenshots/`.

### Run a single spec

```bash
npx cypress run --spec "cypress/e2e/homepage.cy.js"
```

### Open the interactive Cypress UI

```bash
npm run test:headed
```

Lets you watch tests run in real time, inspect DOM elements, and debug failures.

### CI / headless Chrome

```bash
npm run test:ci
```

---

## Reading the Results

After a regression run, three folders are populated:

```
cypress-image-diff-screenshots/
  baseline/       ← reference images (committed to the repo)
  comparison/     ← what the page looks like right now
  diff/           ← red overlay showing what changed
```

### Interpreting diff images

| What you see | What it means |
|---|---|
| Diff image is all black / nearly black | No meaningful change — test passes |
| Small red clusters | Minor shift: padding, font rendering, button state |
| Large red regions | Significant layout change — investigate before approving |
| Entire page red | Page failed to load, wrong URL, or major structural change |

Open the diff and comparison images side-by-side to understand the nature of the change. The comparison image shows the current state; the diff image highlights exactly which pixels moved.

---

## Adjusting Thresholds

Thresholds live in `cypress.config.js` under `env.cypressImageDiff`:

```js
env: {
  cypressImageDiff: {
    threshold: 1,           // maximum allowed difference
    thresholdType: 'percent', // 'percent' or 'pixel'
  },
},
```

### `thresholdType: 'percent'`

The `threshold` value is a percentage of total pixels. `1` means up to 1% of pixels may differ before the test fails.

| Threshold | Sensitivity | Use case |
|---|---|---|
| `0` | Exact match | Zero tolerance — any pixel change fails |
| `0.1` | Very strict | Catch even small font-rendering shifts |
| `1` | Balanced (default) | Ignore minor anti-aliasing; catch real layout changes |
| `5` | Lenient | Useful for pages with dynamic content or ads |
| `10`+ | Very lenient | Not recommended for layout testing |

### `thresholdType: 'pixel'`

The `threshold` value is an absolute pixel count. Useful when a page has one known dynamic region (e.g. a timestamp or live ticker) and you want to permit exactly that area's worth of change.

```js
env: {
  cypressImageDiff: {
    threshold: 200,
    thresholdType: 'pixel',
  },
},
```

### Per-test overrides

You can override the threshold for a specific snapshot without changing the global config:

```js
cy.compareSnapshot('homepage-footer', { testThreshold: 0.05 });
```

---

## Updating Baselines

Run this any time you intentionally change the site design (theme update, new banner, layout change):

```bash
npm run test:update
```

Then commit the updated baseline images:

```bash
git add cypress-image-diff-screenshots/baseline/
git commit -m "Update baselines after [describe change]"
git push
```

To update baselines for a single page only:

```bash
rm cypress-image-diff-screenshots/baseline/homepage.cy-*
npx cypress run --spec "cypress/e2e/homepage.cy.js"
git add cypress-image-diff-screenshots/baseline/homepage.cy-*
git commit -m "Update homepage baselines"
```

---

## Adding a New Page

1. Add an entry to the relevant spec file (or create a new one in `cypress/e2e/`):

```js
it('matches my-new-page snapshot', () => {
  cy.visit('/my-new-page/');
  cy.waitForPageLoad();
  cy.snapshotPage('my-new-page-full');
});
```

2. Capture the baseline:

```bash
npx cypress run --spec "cypress/e2e/your-spec.cy.js"
```

3. Commit the new baseline image.

---

## GitHub Actions / CI

The workflow at `.github/workflows/cypress.yml` can be triggered two ways:

### Manually (via GitHub UI)

Go to **Actions → Cypress Snapshot Tests → Run workflow**. Set `update_snapshots` to `true` to regenerate baselines, or leave it `false` to run a regression check.

### Automatically after a plugin update

Fire a `repository_dispatch` event with type `plugin-updated` from your deployment pipeline:

```bash
curl -X POST \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/detroitweb/centraldata-site-audit/dispatches \
  -d '{"event_type":"plugin-updated"}'
```

On failure, diff images are uploaded as a GitHub Actions artifact (`snapshot-diffs`) and retained for 7 days.

---

## Project Structure

```
centraldata-site-audit/
├── cypress/
│   ├── e2e/
│   │   ├── homepage.cy.js
│   │   ├── navigation.cy.js
│   │   ├── landing-pages.cy.js
│   │   └── product-pages.cy.js
│   └── support/
│       ├── commands.js        ← custom commands (snapshotPage, dismissOverlays, waitForPageLoad)
│       └── e2e.js             ← support entry point
├── cypress-image-diff-screenshots/
│   ├── baseline/              ← committed reference images
│   ├── comparison/            ← current run images (gitignored)
│   └── diff/                  ← red diff overlays (gitignored)
├── .github/
│   └── workflows/
│       └── cypress.yml
├── cypress.config.js
└── package.json
```

---

## Custom Commands Reference

| Command | Description |
|---|---|
| `cy.snapshotPage(name)` | Dismiss overlays, wait for load, take full-page snapshot |
| `cy.dismissOverlays()` | Click cookie consent banners if present |
| `cy.waitForPageLoad()` | Wait for `document.readyState === 'complete'` + 500ms settle |
| `cy.compareSnapshot(name)` | Take and compare a snapshot (from `cypress-image-diff-js`) |
| `cy.compareSnapshot(name, { testThreshold })` | Same, with a per-test threshold override |

---

## Troubleshooting

**Cypress opens with a blank screen (macOS Sequoia)**
Electron 27+ has a GPU compatibility issue with macOS 15. Downgrade to Cypress 12:
```bash
# In package.json, set "cypress": "^12.17.4"
npm install && npx cypress cache clear && npx cypress install
```

**Tests fail on first run with "baseline not found"**
The baseline folder is empty. Run `npm run test:update` to generate baselines.

**Tests fail due to dynamic content (dates, carousels, live chat widgets)**
Increase the threshold for that page, or use `cy.hideElement()` to hide the dynamic element before snapshotting:
```js
cy.hideElement('.live-chat-widget');
cy.compareSnapshot('homepage-full');
```

**False positives from font rendering differences between machines**
Use `thresholdType: 'percent'` with a value of `0.5`–`1`. Sub-pixel font rendering differs across OS versions and hardware.

---

## Maintained by

[DetroitWeb.net](https://detroitweb.net) — WordPress development and managed hosting for [CentralData.com](https://centraldata.com).
