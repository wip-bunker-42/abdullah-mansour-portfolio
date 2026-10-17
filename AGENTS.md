# Working on AIMansour

This repository is the management interface for Abdullah Mansour's portfolio. Read `docs/editing.md` for content and `docs/operations.md` for delivery. No CMS or administrative endpoint is needed.

- English is the default at `/`; Arabic lives under `/ar/`. Preserve equivalent routes, RTL, dark default and explicit theme preference.
- Keep the owner-approved positioning and outcomes. Do not add confidence labels, skepticism or new biographical claims. Zone10's 350+ means people contacted the business; preserve the original report-specific definitions separately.
- Shared facts live in `src/data/`; localized narratives in `src/content/`. Use the existing references for repeated metrics. Do not execute Markdown or add MDX.
- The downloadable CV is one independently authored English PDF. A build copies it; it never writes it. Replace `public/files/abdullah-mansour-cv.pdf` deliberately and verify it. Never put the owner's phone in text sources, HTML, JSON, images, alt text, logs or generated agent exports. Its only public location is the PDF.
- Visible profile actions are LinkedIn and GitHub. Other accounts belong in structured identity data only. Education has no invented status, date or degree. The contact reply promise is within hours.
- Preserve the design system and IBM Plex families. Prefer original evidence and semantic compositions. Generate a raster only for an identified missing or inadequate asset; document why.
- New functionality and bug fixes follow meaningful RED/GREEN tests. Do not add tests for reversible cosmetic changes or every repeated template combination. Keep the relevant browser/axe and structural checks.
- Use `pnpm build` before Worker checks on a clean checkout; `.generated/` is private build output. Local Wrangler (`pnpm preview:worker`) is the authority for headers, API and 404 behavior.
- Never commit `env`, `.env*`, `.dev.vars*`, `التفاصيل/`, `.local/`, private shells, credentials or reports. Never print secrets or extracted CV text/contact details.
- Cloudflare Crawler Hints is the single automatic IndexNow mechanism. Do not add a second sender, key, endpoint or notification workflow without a new justified decision.
- Work on a branch and use a reviewable PR. Passing `main` publishes through the verified GitHub workflow. Keep changes to this site's apex/www; unrelated subdomains and email DNS are out of scope.
