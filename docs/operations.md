# Portfolio operations

## Cloudflare resources

The dedicated Worker is `aimansour-portfolio`, serving the canonical HTTPS apex `aimansour.com`. Static Assets handle ordinary reads, published profile/Markdown resources and closest-locale 404s. Only `/api/contact` runs the Worker first. `wrangler.jsonc` is the non-secret configuration.

`CONTACT_EMAIL` is restricted to the owner's verified Gmail destination. The sender is fixed under `aimansour.com`; the visitor is Reply-To. Sending to a verified destination is free with Email Routing; arbitrary visitor auto-replies are outside this setup. `CONTACT_RATE_LIMITER` allows three accepted attempts per IP per 60 seconds at a Cloudflare location. There is no message database or logging of form fields.

The existing Cloudflare Web Analytics beacon is included once. The beacon token is public configuration. Its account record is reused. Crawler Hints, enabled by the owner, is the only automatic IndexNow mechanism; its cache-miss signals are not a per-commit webhook. Keep robots permissive, useful sitemap updates and correct 301/404 behavior.

## Credentials and deployment

GitHub Actions requires repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. Keep tokens in local ignored environment files or secret stores, never source code, process arguments or output. Give the deploy token only the account/zone access needed for this Worker and its custom domain. Analytics management does not belong in the runtime Worker.

The `Portfolio` workflow performs a frozen install, unit/build/type/artifact/PDF/privacy/budget checks and representative Workers browser/axe tests. Only a passing trusted push to `main` publishes. Production runs are serialized and the job checks current `main` immediately before deploying its verified artifact; an older revision is skipped. PR jobs have read-only repository permissions and no deployment secrets. Dependency updates open reviewed PRs; there is no automatic breaking merge. TypeScript majors are deferred while the Astro checker supports versions 5/6, and Node declaration majors follow the deliberate Node 24 runtime.

Local explicit deployment, when authorized, uses the same verified build:

```sh
pnpm build
pnpm check:site
pnpm check:worker
pnpm exec wrangler deploy --dry-run
pnpm exec wrangler deploy
pnpm exec tsx scripts/smoke-live.ts https://aimansour.com
```

No scheduled job sends test mail. Launch verification sends one clearly labelled message and separately confirms inbox arrival.

## Headers and caching

Generated `_headers` covers static responses. Exact inline-script hashes authorize theme initialization and JSON-LD; no unsafe inline/eval permissions are used. Worker form errors receive equivalent security/noindex/no-store headers. Hashed Astro assets are immutable. HTML, profile exports and the CV revalidate. JSON/Markdown have explicit MIME and public read CORS; GET and HEAD share ETags. The CV is served as an attachment with a useful filename.

Private contact shells and generated Worker/security types live under `.generated/`, outside `dist`. Never copy them into public assets. Do not add a service worker or User-Agent-dependent content variants.

## Canonical redirects and DNS scope

Only apex HTTPS and `www` canonicalization are managed for this project. Preserve path/query when redirecting `www` to the apex. The generated `_redirects` contains exact known `/en/` aliases; do not add a wildcard that turns unknown URLs into soft 404s. Keep unrelated subdomains and all existing MX/DKIM/SPF records intact.

## Rollback

Before replacing a deployed Worker, record its current version using `pnpm exec wrangler versions list`. Roll back a bad release with `pnpm exec wrangler rollback <version-id>` and rerun the read-only smoke check. Then revert/fix the corresponding source revision through a PR so the next passing `main` does not restore the faulty version. Reverting a PDF uses the same path and revalidation; it does not require content generation.

The first portfolio deployment has no prior portfolio Worker version. Subsequent release IDs and launch evidence are recorded in `docs/quality/acceptance.md`. Do not roll back or modify the unrelated services already using other subdomains.
