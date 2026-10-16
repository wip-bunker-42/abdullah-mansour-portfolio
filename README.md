# AIMansour. — Abdullah Mansour

A bilingual portfolio for a Digital Marketing & Growth Specialist, built with Astro and TypeScript and delivered through Cloudflare Workers Static Assets. English is the default; Arabic has equivalent pages. The site uses a shared design system, self-hosted IBM Plex fonts, dark/light themes and progressive contact delivery.

## Local work

Use Node `24.21.0` and the pinned `pnpm@12.14.0`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

For production routing, form handling and headers:

```sh
pnpm build
pnpm preview:worker
```

The Astro development server is at `http://127.0.0.1:4321`; Workers preview is at `http://127.0.0.1:8787`. Restart development after adding assets or changing project publication state, so the published-image manifest is rebuilt. Normal narrative/shared-fact edits update in development.

## Release checks

```sh
pnpm test:unit
pnpm build
pnpm check
pnpm check:worker
pnpm check:site
pnpm verify:pdf
pnpm check:budgets
pnpm check:privacy
```

Run `pnpm test:browser` against a running Workers preview by setting `TEST_BASE_URL=http://127.0.0.1:8787`. Otherwise Playwright starts/reuses the Astro server for development checks; the HTTP suite requires Workers. Linux/CI installs Chromium with `pnpm exec playwright install --with-deps chromium`. Routine form tests intercept delivery and never send real mail.

## Management and public interfaces

- [Editing guide](docs/editing.md): facts, English/Arabic text, cases, evidence and PDF replacement.
- [Operations guide](docs/operations.md): Cloudflare, secrets, verified deployment and rollback.
- [Quality evidence](docs/quality/acceptance.md): measured checks, representative visuals and acceptance status.
- [Approved design](docs/superpowers/specs/2026-10-16-aimansour-portfolio-design.md): scope and owner decisions.

Public reads: `/profile.json`, `/api/profile`, `/profile.schema.json`, `/openapi.json`, explicit `.md` counterparts, `/llms.txt` and `/llms-full.txt`. They need no account, key or content negotiation. The downloadable CV remains a replaceable, independent English PDF at `/files/abdullah-mansour-cv.pdf`.
