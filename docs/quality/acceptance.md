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

- 25 unit tests cover content contracts, publication state, structured exports, data-only frontmatter, request validation/delivery boundaries, native form recovery, private shell generation and imported JavaScript budgets.
- 27 browser checks pass against local Wrangler. They cover the recruiting journey, theme/language persistence, no-JavaScript navigation and forms, evidence modal/Escape/focus restoration, concurrent-submit prevention, copy denial, errors, downloads, real HTTP semantics and hidden-work rebuilds. Controlled builds also run the actual Work/recruiting journeys with every case hidden and the unit gate with edited facts and an empty public selection.
- Four representative axe audits (Home EN/dark, About AR/light, Zone10 EN/light and Contact AR/dark) report no WCAG A/AA violations. Keyboard, skip link, mobile menu, form error recovery and reduced-motion section navigation pass.
- Representative templates reflow at 320, 768 and 1440 CSS pixels. Contact also passes 200% text resizing. The discovered header overflow was repaired with wrapping; the repaired composition was inspected in `.local/contact-text-zoom-repair.png`.
- Success is announced through the form's live region; focus returns to the submitting control only when disabling that control displaced it. A deliberate move elsewhere is preserved. Failure focuses the error summary.
- All 24 primary routes pass static contracts for one H1, self-canonical, reciprocal language links, stable Person identity, valid internal links/fragments/assets, one Analytics beacon, Markdown alternates and sitemap membership.
- Both locale 404s return real HTTP 404. Known `/en/` aliases return 301; unknown aliases remain 404. JSON/Markdown GET and HEAD agree, CORS/MIME are correct and conditional requests return 304.
- Per-page own-code budget: maximum 3,549 compressed JavaScript bytes and 8,136 initial CSS bytes, below 20/30 KiB. Imported enhancement chunks are included; the provider beacon is excluded.

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

## Remaining live acceptance

- The short real screen-reader journey is carried into live acceptance with the owner. NVDA is already active in the desktop session; this harness has no native accessibility-control surface, and the owner's assistive session was not restarted or instrumented. Axe, semantic markup, language/direction, keyboard and reflow were verified independently.
- Live domain, HTTPS/www redirects, beacon provider acceptance and one clearly labelled mail delivery are verified during deployment. Inbox arrival requires confirmation from the owner when no inbox connector is available.
