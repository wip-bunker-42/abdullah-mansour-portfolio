# Portfolio acceptance evidence

Evidence is recorded for the actual implementation. Live-domain and field performance results are added only after they have been measured.

## Independent English CV

- Deliberately written and designed as a two-page English document; white single-column layout, IBM Plex typography, natural text order, ten working link annotations and embedded Regular/Medium/SemiBold fonts.
- Both pages rendered with bundled Poppler and inspected after the final export. Private authoring source and page images remain in ignored `.local/cv/`.
- `pnpm verify:pdf` validates a real PDF and sufficient selectable text on every page. It does not compare or synchronize its prose with website content.
- SHA-256 at publication: `416afa0f6da63ef6850fd64f7216ba322bfebc88a9a6e2374a39c1acdf969c3b`.
- The isolated publication fixture rebuilt after changing only a shared metric. HTML and Markdown changed; the copied CV hash did not.
- A temporary local Wrangler fixture served a replacement at the same path with a different ETag/hash. The old conditional request returned 200 and the new conditional request 304. Revalidation and the attachment filename were preserved. The production asset was not changed by this experiment.
- `pnpm check:privacy` extracts the contact number in memory and scans source/public text; no extracted value is printed or stored. The number appears publicly only inside the CV.
- Stable path: `/files/abdullah-mansour-cv.pdf`. Both languages download that one English asset.

## Initial visual checkpoints

The eight agreed checkpoints were inspected as shared-layout representatives, not a manual combination matrix:

| Checkpoint | Private capture |
| --- | --- |
| Home, English, dark, desktop | `.local/home-en-dark.png` |
| Home, Arabic, light, mobile | `.local/home-ar-light.png` |
| Zone10, English, light, desktop | `.local/case-zone10-light.png` |
| Elkhabar's production and audience composition | `.local/case-elkhabar.png` |
| Sorouh's selected-page architecture | `.local/case-sorouh.png` |
| Shared AI environment | `.local/case-ai.png` |
| Youssef's team and delivery process | `.local/case-youssef.png` |
| Contact, Arabic, dark, mobile | `.local/contact-ar-dark.png` |

An additional desktop capture checked the distinct Work-row composition. Existing portrait, brand assets and project evidence were reused; no raster regeneration was necessary.

## Automated release checks

- 31 unit tests cover content contracts, publication state, structured exports, data-only frontmatter, request validation/delivery boundaries, native form recovery, private shell generation, imported JavaScript and inline CSS budgets, exact separate script/style CSP hashes, bounded first-deployment DNS recovery and base/versioned Analytics deduplication.
- 27 browser checks pass against local Wrangler. They cover the recruiting journey, theme/language persistence, no-JavaScript navigation and forms, evidence modal/Escape/focus restoration, concurrent-submit prevention, copy denial, errors, downloads, real HTTP semantics and hidden-work rebuilds. Controlled builds also run the actual Work/recruiting journeys with every case hidden and the unit gate with edited facts and an empty public selection.
- Four representative axe audits (Home EN/dark, About AR/light, Zone10 EN/light and Contact AR/dark) report no WCAG A/AA violations. Keyboard, skip link, mobile menu, form error recovery and reduced-motion section navigation pass.
- Representative templates reflow at 320, 768 and 1440 CSS pixels. Contact also passes 200% text resizing. The discovered header overflow was repaired with wrapping; the repaired composition was inspected in `.local/contact-text-zoom-repair.png`.
- Success is announced through the form's live region; focus returns to the submitting control only when disabling that control displaced it. A deliberate move elsewhere is preserved. Failure focuses the error summary.
- All 24 primary routes pass static contracts for one H1, self-canonical, reciprocal language links, stable Person identity, valid internal links/fragments/assets, no manual Analytics snippet, Markdown alternates and sitemap membership. The production gate separately verifies one edge-injected beacon for browser HTML requests.
- Both locale 404s return real HTTP 404. Known `/en/` aliases return 301; unknown aliases remain 404. JSON/Markdown GET and HEAD agree, CORS/MIME are correct and conditional requests return 304.
- Per-page own-code budget: maximum 3,549 compressed JavaScript bytes and 7,415 initial CSS bytes, below 20/30 KiB. Imported enhancement chunks and embedded styles are included; the provider beacon is excluded.

## Independent final review

One fresh whole-branch reviewer found five Important issues, resolved in one regression-driven pass: clean-checkout fixture setup, executable frontmatter, repeated mutable facts, links to withdrawn cases, and tests tied to the current publication counts. Tests first reproduced the failures, then passed. YAML is data-only; shared metrics feed prose, metadata and the team visual; hidden links become readable historical mentions. Real rebuilds verify both languages and Markdown and keep the independently authored PDF byte-identical. Original report amounts remain independent from unrelated shared operating costs.
- Worker types/TypeScript and Astro diagnostics pass. Source/public privacy scan passes. No drafts, original private source, credentials, private form shells or source maps are shipped.

## Mobile lab performance

Measured locally with Lighthouse **13.5.0**, Chrome **155**, default mobile emulation and simulated throttling: 150 ms RTT, 1,638.4 Kbps throughput, 4× CPU slowdown. Reports remain in ignored `.local/lighthouse-*.json`.

| Page | Performance | Accessibility | SEO | FCP | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home, English | 99 | 100 | 100 | 0.9 s | 2.1 s | 0 ms | 0 |
| Zone10, English | 100 | 100 | 100 | 1.1 s | 1.7 s | 0 ms | 0 |
| Contact, Arabic | 99 | 100 | 100 | 1.3 s | 1.8 s | 0 ms | 0 |

The first Home measurement identified an oversized responsive portrait candidate. Adding a 740-pixel candidate reduced the measured mobile LCP from 2.4 to 2.1 seconds while preserving the original image. Local Best Practices scored 96 because the real Analytics provider rejected the localhost origin's beacon preflight; production acceptance is checked separately on the authorized domain.

Chrome DevTools MCP is unavailable in this session, so the official Lighthouse CLI provided the lab measurements. These are lab results, not real-user p75 Core Web Vitals. Field INP and p75 LCP/CLS require real traffic after launch.

## Live publication — October 17, 2026

- PR #1 passed the complete quality job on a clean GitHub Linux runner and merged as `641ad0cdd97046c96b3e59c8acbb22c26121031c`. The main quality job passed. The initial deployment created the dedicated Worker/custom domain; its immediate DNS read failed before propagation. The failed-job rerun completed successfully, including all live read checks. Launch version: `f9b69cf7-6360-419b-92b0-a92ee682cc11`.
- The production read-only smoke script passed all 24 primary pages, localized Markdown, profile/schema/OpenAPI resources, GET/HEAD/304, MIME/CORS/cache/CSP, permissive crawlers, English aliases, real localized 404s, CV download headers and path/query-preserving HTTPS/www redirects.
- A fresh production browser visit visually matched the approved Home composition and reported no page errors. Its HAR recorded two Analytics POSTs, both accepted with HTTP 204. A later browser-source audit found a manual base URL and an automatically injected versioned URL together; the original exact-base-URL check missed the second script. The manual tag is removed. The strengthened check counts both URL forms and sends browser `Accept` headers, reproducing the actual duplicate before the fix. The existing enabled Cloudflare record supplies the sole production snippet.
- One clearly labelled launch contact message (`AIM-LAUNCH-20261017`) was accepted by the live endpoint with HTTP 200 after awaiting the native email service. No recurring mail check is configured. Provider acceptance is confirmed; the owner was asked to confirm inbox arrival.
- The first production Home Lighthouse sample scored 91 performance (LCP 3.2 seconds), with 100 accessibility, SEO and Best Practices. Its trace showed blocking CSS requests and competing portrait delivery before the heading rendered. The follow-up embeds the small stylesheets under exact CSP hashes and serves the original portrait through responsive AVIF with a WebP fallback, allowing the browser to schedule it after critical text resources. Original photography is retained. The follow-up release measurement is recorded with its PR/deployment evidence, separately from the historical local baseline above.

## Accepted implementation release

PR #3 merged as `134289d2999e310af7355f91793e5d508cad2b0c`; its Quality and production deployment passed. Worker version `5f8eac62-873a-461f-8076-11d37d05a13d` serves the accepted implementation. Documentation-only follow-ups preserve this runtime behavior; the latest source revision/version remains visible in the deployment log.

The existing Analytics record was reconciled to automatic installation after its legacy false flag left the first-party collector returning 404. Following propagation, a new HAR recorded two browser-generated `/cdn-cgi/rum` POSTs accepted with 204 over two page visits. The DOM contained one versioned script and no page errors. The same record/token is reused.

Three predefined consecutive mobile Lighthouse samples on this implementation scored **95, 95, 95** for performance. Median LCP was **2.66 s**, median FCP **1.74 s**, median TBT **0 ms**, and median CLS **0.04**. Accessibility and SEO were **100** throughout. Best Practices was 96 while the collector configuration propagated; those failed requests are retained in the historical reports rather than discarded.

The final acceptance sample, after successful ingestion, scored **96 performance / 100 accessibility / 100 Best Practices / 100 SEO**, with **1.7 s FCP, 2.6 s LCP, 0 ms TBT and 0 CLS**. Same Lighthouse 13.5 / Chrome 155 default mobile simulation settings as the baseline. Reports are retained in ignored `.local/lighthouse-release-{1,2,3}.json` and `.local/lighthouse-accepted-release.json`. These laboratory results do not establish real-user p75 CWV or field INP; the live Analytics record supplies that evidence once traffic exists.

All 24 public page/interface checks pass with browser HTML headers and the strengthened Analytics count. The intentionally authored English PDF remains byte-identical with SHA-256 `416afa0f6da63ef6850fd64f7216ba322bfebc88a9a6e2374a39c1acdf969c3b`. No additional launch email was sent during the follow-ups.

## Owner acceptance

- The short real screen-reader journey is carried into live acceptance with the owner. NVDA is already active in the desktop session; this harness has no native accessibility-control surface, and the owner's assistive session was not restarted or instrumented. Axe, semantic markup, language/direction, keyboard and reflow were verified independently.
- Inbox arrival remains pending the owner's answer to the launch-message confirmation. No inbox connector is available in this session.
