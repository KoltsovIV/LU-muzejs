# Interactive Hotspots

Single-page React application that visualises workplace risk areas as interactive hotspots. The UI is mobile‑first, powered by styled-components for theming, and all hotspot metadata lives in versioned JSON files with validation tooling.

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs on [http://localhost:5173](http://localhost:5173).

## Available Scripts

| Command                                   | Description                                            |
| ----------------------------------------- | ------------------------------------------------------ |
| `npm run dev`                             | Start Vite dev server with HMR                         |
| `npm run build`                           | Type-check and create a production build in `dist`     |
| `npm run preview`                         | Preview the production build locally                   |
| `npm run lint` / `npm run lint:fix`       | Run ESLint (flat config)                               |
| `npm run format` / `npm run format:check` | Format code with Prettier                              |
| `npm run test` / `npm run test:watch`     | Run Vitest unit tests (JSDOM)                          |
| `npm run validate:data`                   | Validate hotspot JSON files with the Zod schema        |
| `npm run storybook`                       | Launch Storybook (Vite builder) on port 6006           |
| `npm run build-storybook`                 | Build static Storybook output                          |
| `npm run check`                           | Run lint, unit tests, and data validation sequentially |

### Storybook + Browser Tests

Unit tests run purely in JSDOM. To enable Storybook/Vitest browser integration you can opt in during CI or locally:

```bash
RUN_STORYBOOK_TESTS=true npx playwright install
RUN_STORYBOOK_TESTS=true npm run test
```

By default these browser tests are skipped to avoid bundling Playwright on every run.

## Project Structure

```
src/
  components/         Core UI components (HotspotImage, HotspotMarker, HotspotModal, etc.)
  contexts/           React contexts (i18n and hotspot data loading)
  hooks/              Reusable hooks (touch detection, element size)
  i18n/               Translation dictionaries
  pages/              Page-level layouts (SPA entry point)
  stories/            Storybook stories & decorators
  styles/             GlobalStyle definition
  testing/            Fixtures + render helpers for tests
  theme/              Theme tokens (colors, spacing, typography, shadows, breakpoints)
  types/              Shared TypeScript types
  utils/              Utility helpers (coordinates math, logging)
public/
  assets/hotspots/    Workspace illustration + hotspot icons
  data/               Localised hotspot JSON datasets (`hotspots.xx.json`)
scripts/
  validate-data.ts    CLI validator used by `npm run validate:data`
```

## Hotspot Data Model

Hotspots are stored per locale in `public/data/hotspots.<lang>.json`. Each file must contain **exactly 12** entries with matching IDs across languages. Key fields include:

- `id`, `title`, `description`, `ariaLabel`
- `coords`: percentages with optional breakpoint overrides (`default`, `sm`, `md`, etc.)
- `shape`: circle, rectangle, or polygon for marker masking
- `categories`, `severity`, optional `links`, optional `media`

The Zod schema (`src/schemas/hotspot-schema.ts`) enforces the structure. Run `npm run validate:data` after editing JSON to catch mistakes (duplicate IDs, mismatched coordinates, invalid links, etc.).

### Updating Content

1. Edit the relevant JSON files under `public/data/`.
2. Add or update hotspot imagery in `public/assets/hotspots/` (WebP/PNG recommended).
3. Run `npm run validate:data`.
4. Restart the dev server (or refresh the page) to pull the new dataset.

For localisation, add new `hotspots.<lang>.json` files and localisation strings inside `src/i18n/translations.ts`. The i18n context automatically persists the language choice and falls back to Latvian when the browser language is unsupported.

## Theming & Styling

- Theme tokens live in `src/theme/`. Swap palettes or typography by editing the constants (`colors.ts`, `typography.ts`, etc.).
- `GlobalStyle` establishes the mobile-first layout baseline and typography reset.
- Use `styled-components` with the provided `DefaultTheme` typings (`src/theme/styled.d.ts`).

## Logging

`src/utils/logger.ts` provides lightweight logging with environment control:

- `VITE_LOG_TARGET=console` (default) routes to `console.*`
- `VITE_LOG_TARGET=silent` disables logs

Extend `createLogger` if you need to forward messages to an external telemetry vendor.

## Testing

- Component tests use Vitest + Testing Library (`src/components/__tests__`).
- `renderWithProviders` wraps stories/components with theme, i18n, and preloaded hotspot data.
- Playwright integration is optional (see “Storybook + Browser Tests” above).

## Performance & Accessibility Targets

- Lighthouse (mobile) goal: **Performance ≥ 90**, **Accessibility ≥ 90**
- Skeleton overlay and progress indicator prevent a flash of unstyled content while the illustration and data load.
- Hotspot markers support keyboard navigation (`Tab`, `Enter`, `Space`) and maintain focus visibility.
- The modal traps focus, closes on `Escape`, and announces status updates via `aria-live`.

## Deployment Notes

1. Run `npm run check` to lint, test, and validate JSON.
2. Build with `npm run build`. The output in `dist/` can be uploaded to static hosting (e.g., LU infrastructure, GitHub Pages, Netlify).
3. Include `/public` assets when deploying so hotspot images and JSON files remain accessible.

### GitHub Pages

- Production builds use the `/LU-muzejs/` base path (configured in `vite.config.ts`) so assets resolve correctly on GitHub Pages.
- The workflow at `.github/workflows/deploy.yml` automatically lints, tests, builds, and publishes the `dist/` folder to GitHub Pages whenever changes land on `main`.
- After the first successful run, the site will be available at `https://koltsoviv.github.io/LU-muzejs/`.

If you deploy elsewhere, adjust the `base` value or set `NODE_ENV` appropriately before running `vite build`.

## Storybook Usage

Run `npm run storybook` to explore individual components and page states. Stories wrap components with context providers (`src/stories/decorators.tsx`) and use fixtures from `src/testing/fixtures`. Static docs can be generated with `npm run build-storybook`.

---

Feel free to extend the plan with additional hotspots, analytics, or richer media. Keep the validator, tests, and documentation updated whenever the schema or design tokens evolve.
