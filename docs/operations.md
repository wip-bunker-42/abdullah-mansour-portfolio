# Portfolio operations

## Cloudflare resources

The dedicated Worker is `aimansour-portfolio`, serving the canonical HTTPS apex `aimansour.com`. Static Assets handle ordinary reads, published profile/Markdown resources and closest-locale 404s. Only `/api/contact` runs the Worker first. `wrangler.jsonc` is the non-secret configuration.

`CONTACT_EMAIL` is restricted to the owner's verified Gmail destination. The sender is fixed under `aimansour.com`; the visitor is Reply-To. Sending to a verified destination is free with Email Routing; arbitrary visitor auto-replies are outside this setup. `CONTACT_RATE_LIMITER` allows three accepted attempts per IP per 60 seconds at a Cloudflare location. There is no message database or logging of form fields.

The existing Cloudflare Web Analytics configuration injects the beacon at the edge. Do not add a manual snippet to the source layout: it would load the same script again for browsers. Local artifacts contain zero beacons; production HTML requested as a browser contains exactly one versioned edge snippet. The live gate sends `Accept: text/html` and counts both base/versioned URLs, and browser acceptance checks real ingestion. The existing account record is reused. Crawler Hints, enabled by the owner, is the only automatic IndexNow mechanism; its cache-miss signals are not a per-commit webhook. Keep robots permissive, useful sitemap updates and correct 301/404 behavior.

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

Generated `_headers` covers static responses. Exact hashes authorize theme initialization, JSON-LD and the critical styles embedded in HTML; no unsafe inline/eval permissions are used. Embedding the small stylesheets removes render-blocking CSS requests on a first visit. Both inline and external CSS count toward the compressed budget. Worker form errors receive equivalent security/noindex/no-store headers. Hashed Astro assets are immutable. HTML, profile exports and the CV revalidate. JSON/Markdown have explicit MIME and public read CORS; GET and HEAD share ETags. The CV is served as an attachment with a useful filename.

Private contact shells and generated Worker/security types live under `.generated/`, outside `dist`. Never copy them into public assets. Do not add a service worker or User-Agent-dependent content variants.

## Canonical redirects and DNS scope

Only apex HTTPS and `www` canonicalization are managed for this project. Preserve path/query when redirecting `www` to the apex. The generated `_redirects` contains exact known `/en/` aliases; do not add a wildcard that turns unknown URLs into soft 404s. Keep unrelated subdomains and all existing MX/DKIM/SPF records intact.

## Rollback

Before replacing a deployed Worker, record its current version using `pnpm exec wrangler versions list`. Roll back a bad release with `pnpm exec wrangler rollback <version-id>` and rerun the read-only smoke check. Then revert/fix the corresponding source revision through a PR so the next passing `main` does not restore the faulty version. Reverting a PDF uses the same path and revalidation; it does not require content generation.

The first portfolio deployment has no prior portfolio Worker version. Subsequent release IDs and launch evidence are recorded in `docs/quality/acceptance.md`. Do not roll back or modify the unrelated services already using other subdomains.

## Launch baseline — October 17, 2026

PR #1 merged as `641ad0cdd97046c96b3e59c8acbb22c26121031c`. Its verified release is available at `https://aimansour.com`; the successful deployment rerun produced version `f9b69cf7-6360-419b-92b0-a92ee682cc11`. The first upload was `2b0e3ebb-3e34-468d-ba6e-ce1e84291017`. These record the launch baseline; use the current CI deployment log and `wrangler versions list` for later release IDs.

The apex custom domain belongs to `aimansour-portfolio`. The proxied `www` CNAME points to the apex. Zone redirect ruleset `7eec0168d24f466788a422e9505490a9` contains the single scoped rule `783d50cf395e4bd19e2574598601d474` (`portfolio_https_apex`). Its condition is `(http.host eq "www.aimansour.com") or ((http.host eq "aimansour.com") and (not ssl))`; the target is `concat("https://aimansour.com", http.request.uri.path)`, status 301, preserving the query string. Existing mail records and other services were preserved.

The initial post-deploy read happened before the brand-new apex record had reached the runner's DNS resolver. The failed-job rerun passed after propagation. The smoke entry point now waits only for transient `ENOTFOUND`/`EAI_AGAIN` results, up to 31 attempts spaced ten seconds apart. HTTP and certificate errors fail immediately; assertions are never retried or weakened. Tests cover successful recovery, exhaustion and permanent failures.

The implementation follow-ups merged through PR #2 (`e7bed5878a2af0f83c88ee12301f4945d1496520`) and PR #3 (`134289d2999e310af7355f91793e5d508cad2b0c`). The accepted implementation release is Worker version `5f8eac62-873a-461f-8076-11d37d05a13d`, with a green Quality/deployment run at [GitHub Actions](https://github.com/wip-bunker-42/abdullah-mansour-portfolio/actions/runs/38992926464).

The reused Analytics site is `afbe0c83d2624032aba2e8726f22ac63`. Its legacy state exposed automatic injection while `auto_install` was false; the first-party collector returned 404 when the manual tag was removed. Reconcile this existing record to `auto_install: true`, `enabled: true`, `lite: false` for the same zone. After propagation, browser-generated POSTs to the site's `/cdn-cgi/rum` returned 204 with one script. No forwarding endpoint, second record or extra runtime service is needed. Do not disable this automatic installation without deliberately changing the installation mode.

`main` requires the `Quality checks` context and an up-to-date PR, blocks force pushes/deletion and requires resolved conversations. Approval count stays zero so an individual owner and their agents can maintain the site through passing PRs. Administrators retain their recovery capability. Native vulnerability alerts and automated security fixes are enabled; ordinary compatible updates remain grouped, reviewed PRs.
