# AIMansour Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, review and publish Abdullah Mansour's permanent premium bilingual portfolio at https://aimansour.com, with persuasive case studies, an independent English CV and accessible public content for people, search engines and agents.

**Architecture:** Astro produces complete static HTML from validated shared facts and localized Markdown. One small Cloudflare Worker handles contact submissions; Workers Static Assets serves the pages and public data. The English CV is a deliberately authored, replaceable PDF, independent of website generation.

**Tech Stack:** Astro 7.4 baseline from verified research; strict TypeScript; Node 24.21.0; pnpm 12.8.1; custom CSS; self-hosted IBM Plex; Astro content loaders and image processing; Zod; Node's test runner through tsx; Playwright and axe; current stable Wrangler and Cloudflare Email Routing. Verify compatible stable versions and pin them with the lockfile during Task 1.

**Spec:** [Approved design specification](../specs/2026-10-16-aimansour-portfolio-design.md). Read it alongside this plan; its exact copy, palette and scope apply to every task. Research and official references are in [discovery](../../research/2026-10-16-discovery.md).

## Global Constraints

- English is default at `/`; Arabic uses `/ar/`, `lang=ar`, `dir=rtl`; language switching preserves the equivalent page. No browser-language redirects.
- Umbrella role: **Digital Marketing & Growth Specialist**; recruitment is the primary journey. Explain AI + Mansour in About.
- Publish 12 primary page pairs: Home, Work, five cases, About, Resume, Contact, Privacy and Accessibility. No blog, CMS, visitor accounts or database.
- Five stable project IDs: `zone10`, `elkhabar-bewodooh`, `sorouh`, `ai-operations`, `youssef-el-sherif`; the first three are the homepage selection.
- Owner-supplied outcomes are approved publication content. Preserve Zone10's **350+ people contacted the company**, existing report definitions and dates; add no skepticism, confidence fields or invented achievements.
- Education: **Al-Azhar University — Faculty of Islamic Da‘wah / جامعة الأزهر — كلية الدعوة الإسلامية**, without degree, status or date.
- Public name variants include `Abdullah Mansour`, `Abdallah Mansour`, `عبد الله منصور`, `عبدالله منصور`, `AIMansour`.
- Location: Cairo, Egypt; timezone `Africa/Cairo`; email `abdullahmansour.marketing@gmail.com`.
- Response promise: **“I’ll reply within hours.” / «سأرد عليك خلال ساعات.»**, including the success state.
- Visible social account actions: LinkedIn and GitHub only, using the exact URLs in spec §9. All eight approved profiles belong in structured data. No `tel:` or WhatsApp actions for Abdullah.
- The owner's phone is public **only inside the English CV PDF**. Do not write its literal value into tracked text, tests, data, source maps, HTML, JSON, Markdown or image metadata.
- Publish one static CV at `/files/abdullah-mansour-cv.pdf`; both locales download it. Arabic label: **«تنزيل السيرة بالإنجليزية — PDF»**. No build-time or request-time CV generation, no Arabic PDF and no CI content synchronization with site data.
- Reuse supplied portraits, brand assets, evidence and social cards. Generate or replace only an asset with a recorded, concrete quality or missing-content reason; use HTML/SVG composition when sufficient.
- IBM Plex Sans for English, IBM Plex Sans Arabic for Arabic, IBM Plex Mono only for metrics/numbers/technical details; headings 500–600, body 400. Self-host WOFF2 and retain licenses.
- Dark default tokens: background `#0B0D10`, surface `#11151A`, elevated `#171C22`, text `#F5F7FA`, secondary `#A6AFBD`, border `#2A313A`, control border `#657184`, accent `#8098FF`, accent soft `#18234A`, success `#52D6A1`, warning `#F6C85F`, error `#FF7B7B`.
- Light tokens: background `#F7F8FA`, surface `#FFFFFF`, secondary surface `#EEF1F5`, text `#0F1217`, secondary `#4B5665`, border `#D8DEE7`, control border `#7B8798`, accent `#3157E0`, accent soft `#E9EEFF`, success `#137A54`, warning `#8A5B00`, error `#B4232D`.
- Filled accent button text is dark in Dark and white in Light. Borders 1px; radii 10–14px; purposeful motion 180–240ms with reduced-motion support; no neon, rainbow, glow, excessive glass or scroll hijacking.
- Apply the installed official Anthropic frontend-design skill. Follow spec §4's portrait/editorial composition, varied open work rows and distinct case modules; no generic repeated card grid or arbitrary project numbering.
- Target WCAG 2.2 AA, complete keyboard access, visible focus, semantic HTML, 44×44px primary targets and readable reflow. Core reading/navigation/forms work without JavaScript.
- Public profile `schemaVersion: 1`, stable ID `https://aimansour.com/#person`; `/api/profile` GET/HEAD has the same payload as `/profile.json` and remains a static asset.
- Publish explicit Markdown equivalents, `/llms.txt`, `/llms-full.txt`, `/profile.schema.json`, `/openapi.json`; no content negotiation, user-agent cloaking, draft exports or CV text extraction into these resources.
- Allow every crawler via `User-agent: *`, `Allow: /`, with no edge AI-bot block added. Crawler Hints is already enabled by the owner and is the **only automatic IndexNow path**; no custom sender, key, endpoint or GitHub IndexNow job.
- Contact limits: actual request body ≤32KiB; name 1–100, email ≤254, optional company ≤160, message 1–6000 characters; topics `role|project|other`, default `role`; locales `en|ar`; empty honeypot. Reject header injection.
- Contact uses a fixed domain From and verified Gmail destination, visitor Reply-To, server validation and a dedicated native rate-limit binding: **3 attempts/IP/60 seconds**. No visitor auto-reply, message database or PII logging.
- API codes: 200 provider acceptance, 400 invalid data, 403 browser origin, 405 method, 413 size, 415 content type, 429 rate limit with Retry-After, 500 internal, 502 email provider. Native form success is 303 to localized thanks.
- Workers Static Assets uses `404-page`, real closest-locale 404, selective worker-first contact routing and no SSR adapter or `nodejs_compat` without a demonstrated need. Preserve unrelated subdomains.
- Reuse the existing enabled Cloudflare Analytics record and public beacon exactly once; no form fields in telemetry. Credential values stay in local ignored env or secret stores.
- Field goals when data exists: p75 LCP ≤2.5s, INP ≤200ms, CLS ≤0.1. Lab target: mobile Lighthouse performance ≥95 and applicable SEO/accessibility 100 on representative Home/case/Contact, including Arabic. Own JS ≤20KiB gzip/page; initial CSS ≤30KiB gzip, excluding the provider beacon.
- Automated route/content checks cover all primary pages; manual visual QA starts with about eight meaningful checkpoints in spec §13, not a Cartesian matrix. Expand only for a distinct risk or fix.
- Branch prefix `abdo/`; passing `main` deploys automatically. Pin Actions, use least privilege and reviewed grouped dependency updates; never expose secrets to untrusted PRs. Keep `التفاصيل/`, local env and private CV authoring files out of Git and public outputs.

## Review Focus

1. A metric changes while its Markdown file does not: the content cache, HTML, captions, structured data and Markdown must all use the new value (Tasks 1 and 6).
2. Storage is denied, JavaScript is disabled, or Arabic text mixes with Latin email/tool names: the page remains usable, coherent and correctly directed (Tasks 2 and 5).
3. Every project is unpublished in a future edit: no draft leaks into exports; Work gives useful next actions and Home omits selected work (Tasks 3 and 6).
4. A chunked request omits Content-Length, or a failed Arabic form contains hostile markup: enforce the actual byte cap, escape retained values and keep a usable localized error form (Task 5).
5. A replacement PDF changes its phone/layout while website facts stay unchanged: download the new file at the stable URL, keep the PDF independent and prevent its phone escaping into other public files (Tasks 7 and 8).

---

## File Structure and Shared Interfaces

This is one integrated site, delivered in nine reviewable tasks. Execute in order; Task 7 can be authored once Task 1's factual import is available, but publish and verify it before Task 8. No separate approval project per page.

| Paths | Responsibility / owning task |
| --- | --- |
| `package.json`, `pnpm-lock.yaml`, `.node-version`, `astro.config.mjs`, `tsconfig.json`, `tsconfig.worker.json`, `.gitignore` | Reproducible toolchain, static build and exclusion of local materials — 1 |
| `src/data/profile.json`, `experience.json`, `projects.json`, `metrics.json`, `evidence.json` | Shared public facts, publication flags and asset references — 1 |
| `src/content/pages/en/`, `src/content/pages/ar/` | Localized `home.md`, `work.md`, `about.md`, `resume.md`, `contact.md`, `privacy.md`, `accessibility.md` — 1, 2, 3, 4, 5 |
| `src/content/cases/en/`, `src/content/cases/ar/` | One `.md` per exact project ID — import 1, case composition 3 |
| `src/content/contracts.ts`, `read.ts`, `references.ts`, `loader.ts`, `documents.ts`, `src/content.config.ts` | Schemas, local reading, safe reference expansion and Astro-rendered narratives — 1 |
| `src/i18n/routes.ts`, `messages.ts` | One localized route map and interface/error copy — 1, 2, 5 |
| `src/assets/portrait/`, `src/assets/evidence/`, `public/brand/`, `public/social/`, `public/fonts/` | Selected existing assets, responsive source images, approved social cards and licensed fonts — 1, 2, 3 |
| `src/layouts/SiteLayout.astro`, `src/components/{Header,Footer,ThemeControl,LanguageLink,CvLink}.astro` | Shared semantic shell, navigation and controls — 2 |
| `src/styles/{tokens,global,layout}.css`, `src/scripts/{theme,navigation}.ts` | Theme system, typography, reflow and progressive enhancement — 2 |
| `src/pages/[...path].astro`, `src/views/HomePage.astro` | Static route generation and composed Home — 2; dispatch expands in 3–5 |
| `src/views/{WorkPage,CasePage}.astro`, `src/components/{WorkRow,EvidenceFigure,EvidenceDialog,Metric}.astro`, `src/scripts/evidence.ts`, `src/lib/assets.ts`, `scripts/publish-assets.ts` | Work presentation, evidence and shared factual rendering — 3 |
| `src/components/cases/{Zone10Visual,ElkhabarVisual,SorouhVisual,AiOperationsVisual,YoussefVisual}.astro` | Five purpose-specific case compositions — 3 |
| `src/views/{AboutPage,ResumePage,InformationPage,ErrorPage}.astro`, `src/pages/404.astro`, `src/pages/ar/404.astro` | Biography, experience, policies and error documents — 4 |
| `src/views/ContactPage.astro`, `src/components/ContactForm.astro`, `src/scripts/contact.ts`, `src/contact/{contract,form}.ts` | Contact presentation, shared form markup and response contract — 5 |
| `worker/{index,contact,delivery,security}.ts`, `scripts/build-contact-shells.ts`, `wrangler.jsonc` | Bounded request handling, native mail and runtime headers — 5 |
| `src/lib/{seo,public-profile,public-markdown}.ts`, `src/components/SeoHead.astro`, `scripts/{publish-exports,write-headers,check-site}.ts` | Canonical metadata, machine-readable outputs, discovery, headers and complete artifact validation — 6 |
| `public/files/abdullah-mansour-cv.pdf` | One intentionally authored English PDF — 7; private authoring source remains ignored |
| `tests/unit/`, `tests/browser/`, `playwright.config.ts`, `scripts/{check-budgets,verify-pdf,smoke-live}.ts` | Meaningful contracts, representative browser checks, PDF and live checks — 1–9 |
| `.github/workflows/site.yml`, `.github/dependabot.yml`, `.github/pull_request_template.md`, `AGENTS.md`, `README.md`, `docs/{editing,operations}.md` | Useful CI/deployment, updates and agent maintenance — 9 |
| `docs/quality/{asset-decisions,acceptance}.md` | Reasons for any asset replacement; actual verification evidence and remaining issues — 3, 7, 8, 9 |

Build-only `.generated/`, `dist/`, browser reports, `.local/cv/` authoring files and local visual captures are ignored. They are not content sources. `dist/` contains only intentional public artifacts; Worker-only contact shells stay in `.generated/`. Add each package command when its owning feature lands; Task 8 verifies the complete aggregate. After Task 5, build before the full type check on a fresh checkout so the imported private contact-shell module exists. Test snippets use local fixture helpers declared in their owning test file, not additional production APIs.

Common types below are exported by `src/content/contracts.ts`; schemas own the remaining fact fields from spec §5 and §9. Keep these names stable across tasks:

```ts
type Locale = 'en' | 'ar';
type Localized<T> = Record<Locale, T>;
type PageId = 'home' | 'work' | 'about' | 'resume' | 'contact' | 'privacy' | 'accessibility';
type ProjectId = 'zone10' | 'elkhabar-bewodooh' | 'sorouh' | 'ai-operations' | 'youssef-el-sherif';
type ContentKey = PageId | `case:${ProjectId}`;
type RouteKey = ContentKey | 'contact-thanks' | 'error';
type Route = { key: RouteKey; locale: Locale; path: string; markdownPath: string | null; indexable: boolean };
type NarrativeSection = { id: string; heading: string; markdown: string };
type LocalizedDocument = { key: ContentKey; locale: Locale; title: string; description: string; heading: string; lead: string; updatedAt: string; draft: boolean; sections: NarrativeSection[]; markdown: string };
type RenderedDocument = Omit<LocalizedDocument, 'sections'> & { sections: (NarrativeSection & { html: string })[] };
type SiteContent = { profile: ProfileData; experience: ExperienceData; projects: Project[]; metrics: Record<string, Metric>; evidence: Record<string, Evidence>; documents: LocalizedDocument[] };
```

`ProfileData`, `ExperienceData`, `Project`, `Metric` and `Evidence` are inferred from Zod schemas. Required project properties include `id`, `published`, `featured`, `order`, `metricIds`, `evidenceIds`, `relatedIds` and localized period/market/responsibility/delivery. A metric has `id`, `value`, localized `display` and `label`, and optional localized `period`. An evidence record has `id`, `source`, `publicPath`, `width`, `height`, localized `alt` and `caption`, and optional report period. No owner-phone field or confidence classification exists.

Narrative files use frontmatter for `key`, `locale`, metadata, `heading`, `lead`, `updatedAt`, `draft`. H2 sections have stable author-readable IDs such as `## The opportunity {#opportunity}`. The reader separates these into sections, removes the ID suffix from visible headings, and retains normal Markdown for exports. Templates choose section IDs, not paragraph positions. Unknown metric references such as `{{metric:zone10.contacts}}` fail the build. This small convention enables deliberate page composition without MDX or duplicated facts. Use Astro's documented [content loader rendering API](https://docs.astro.build/en/reference/content-loader-reference/) to compile the resolved section Markdown.

## Task 1: Import a Validated, Agent-Editable Content Model

**Files:** Toolchain, data, content, loader and route-map paths above; `tests/unit/content.test.ts`, `tests/unit/routes.test.ts`, `tests/fixtures/content.ts`.

**Interfaces:** Produce `loadSiteContent(rootDir?: string): Promise<SiteContent>`, `validateSiteContent(input: unknown): SiteContent`, `resolveReferences(text: string, locale: Locale, content: SiteContent): string`, `createNarrativeLoader(): Loader`, `getDocument(key: ContentKey, locale: Locale): Promise<RenderedDocument>`, `getRoute(key: RouteKey, locale: Locale): Route`, `getPublishedRoutes(content: SiteContent): Route[]`. `Loader` is Astro's public loader type. Only published, non-draft primary routes are returned by `getPublishedRoutes`.

- [x] **Step 1: Set up the pinned runtime and test runner.** Verify current stable package engines against Node 24.21.0, pin compatible Astro/TypeScript/build dependencies and pnpm 12.8.1, enable strict checking, and preserve/extend the existing untracked ignore file deliberately. This setup belongs to the content deliverable; install no UI framework or SSR adapter.
- [x] **Step 2: Write the failing content/route contracts.** Add fixture-driven tests before production readers, including `test('published bilingual content resolves shared facts and rejects broken references', ...)` with these assertions:

```ts
assert.equal(getRoute('home', 'en').path, '/');
assert.equal(getRoute('case:zone10', 'ar').path, '/ar/work/zone10/');
assert.equal(getPublishedRoutes(content).length, 24);
assert.throws(() => validateSiteContent(missingArabicCase), /locale/i);
assert.throws(() => resolveReferences('{{metric:missing}}', 'en', content), /missing/);
assert.equal(resolveReferences('{{metric:zone10.contacts}}', 'en', changedMetric), '351+');
assert.ok(!('phone' in content.profile));
```

- [x] **Step 3: Run `pnpm exec tsx --test tests/unit/content.test.ts tests/unit/routes.test.ts`.** Confirm failure concerns absent readers/contracts, not a broken test command.
- [x] **Step 4: Implement schemas, readers, route map and loader.** Import supplied facts and both languages, retain the approved meaning and dates, centralize repeated facts, and deduplicate favicon IDs. Copy only chosen public assets into controlled paths; reject path traversal, broken references, duplicate IDs, invalid publication pairs and unexpected source folders. Digest resolved content and shared metric/evidence dependencies, so changing JSON invalidates rendered collection entries even if Markdown is untouched. Watch those inputs in local development. Exclude drafts before public rendering.
- [x] **Step 5: Run the two test files and `pnpm check`.** Pass schema/route contracts and type checks. Inspect the imported Zone10 350+ wording, education and alternate names against the approved source; do not add a re-verification editorial layer.
- [x] **Step 6: Commit.** `git add package.json pnpm-lock.yaml .node-version .gitignore astro.config.mjs tsconfig.json tsconfig.worker.json src tests` then `git commit -m "feat: add validated bilingual portfolio content"`.

## Task 2: Build the Premium Home and Shared Bilingual Shell

**Files:** Shared layout/components/styles/scripts, Home view, route entry, fonts and Home content paths in the map; `tests/browser/shell.spec.ts`, `playwright.config.ts`.

**Interfaces:** Consume Task 1's readers and routes. Produce `SiteLayout.astro` props `{route: Route; title: string; description: string; noindex?: boolean}`, `HomePage.astro` props `{content: SiteContent; document: RenderedDocument; locale: Locale}`, and `CvLink.astro` props `{locale: Locale; class?: string}`. Route generation uses known routes only; do not emit placeholders for not-yet-implemented views. `CvLink` always targets the fixed PDF path.

- [x] **Step 1: Write failing browser behavior tests.** In `test('language navigation and themes survive denied storage', ...)`, assert equivalent-language navigation, the default Dark state, a persisted Light choice, keyboard-operated mobile navigation, and a context where storage APIs throw:

```ts
await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
await expect(page.getByRole('link', { name: 'English', exact: true })).toHaveAttribute('href', '/');
await expect(storageDenied.locator('html')).toHaveAttribute('data-theme', 'dark');
await storageDenied.getByRole('button', { name: /light mode/i }).click();
await expect(storageDenied.locator('html')).toHaveAttribute('data-theme', 'light');
```

- [x] **Step 2: Run `pnpm exec playwright test tests/browser/shell.spec.ts`.** Confirm missing UI behavior is the failure. Configure the test server as part of this task, not a separate test-infrastructure project.
- [x] **Step 3: Implement the shell and actual Home composition.** Use the approved 7/5-column portrait arrangement, natural portrait at roughly 400–440px desktop, 72–84px English desktop heading and 38–44px mobile heading with independent Arabic tuning. Establish tokens, generous spacing, readable line lengths, licensed locale-specific font loading, SVG outline icons and logical CSS. Compose results, selected work, approach, experience and closing from real content; no placeholder copy, random embellishments or floating statistic cards. Provide semantic navigation, skip link, explicit active page, theme control with safe storage, details-based no-JS mobile navigation and focused enhancement scripts. Keep the wordmark LTR and mixed-direction content isolated.
- [x] **Step 4: Review Home EN/Dark at 1440px and AR/Light at 390px with agent-browser.** Use the installed frontend-design skill's critique: identity, type hierarchy, spacing, portrait crop, wrapping, action prominence and calm rhythm. Revise weak composition before extending it. These are the first two visual checkpoints, retained for Task 8 rather than captured again without a change.
- [x] **Step 5: Run `pnpm check`, `pnpm build` and the shell browser tests.** Inspect the no-JS Home and mobile navigation once. Appearance is judged visually; do not add CSS snapshots or tests asserting arbitrary pixel values.
- [x] **Step 6: Commit.** Stage this task's paths explicitly, then `git commit -m "feat: compose premium bilingual home and design system"`.

## Task 3: Publish Five Distinct Case Studies and the Work Journey

**Files:** Work/Case views, five case modules, WorkRow/evidence/metric components, asset helper and publication script, Work and ten case Markdown files; `docs/quality/asset-decisions.md`, `tests/unit/publication.test.ts`, `tests/browser/work.spec.ts`.

**Interfaces:** Consume Task 1's `SiteContent`, `getDocument`, `getRoute`. Produce `WorkPage.astro` with the Home view's props; `CasePage.astro` props `{content: SiteContent; document: RenderedDocument; locale: Locale; project: Project}`; `EvidenceFigure.astro` props `{evidence: Evidence; locale: Locale; priority?: boolean}`; `getPublishedProjects(content: SiteContent): Project[]`; `publishAssets(content: SiteContent, distDir: string): Promise<void>`. Full-resolution evidence has the stable `Evidence.publicPath`; thumbnails use Astro build-time responsive transforms.

- [ ] **Step 1: Write failing publication and evidence behavior tests.** Use `test('unpublished projects disappear and Work keeps useful next actions', ...)` and `test('evidence dialog closes with Escape and restores focus', ...)`, with these assertions rather than five copies of the same component test:

```ts
assert.equal(getPublishedProjects(allUnpublished).length, 0);
assert.equal(getPublishedRoutes(allUnpublished).some(r => r.key.startsWith('case:')), false);
await expect(emptyWork.getByRole('link', { name: /contact/i })).toBeVisible();
await expect(emptyHome.locator('[data-selected-work]')).toHaveCount(0);
await evidenceTrigger.click();
await expect(page.getByRole('dialog')).toBeVisible();
await page.keyboard.press('Escape');
await expect(evidenceTrigger).toBeFocused();
```

- [ ] **Step 2: Run `pnpm exec tsx --test tests/unit/publication.test.ts` and `pnpm exec playwright test tests/browser/work.spec.ts`.** Confirm failures correspond to absent publication/layout/dialog behavior.
- [ ] **Step 3: Implement the Work journey and case composition.** Provide executive summaries, exact role/period/market facts, meaningful section IDs, breadcrumbs, readable evidence captions, related work and a contact next step. Use wide varied Work rows. Build Zone10's desktop/mobile page composition and acquisition flow; Elkhabar's editorial/production/retention story; Sorouh's 170 possibilities →16 selected local pages alongside the 71-page total; AI operations' shared environment and real contribution evidence; Youssef's five-person team and distribution process. Each has a distinct substantial visual module and appropriate narrative rhythm. Native SVG/HTML diagrams are semantic, responsive and based on supplied work.
- [ ] **Step 4: Inspect selected source evidence and publish useful image sizes.** Preserve report pixels/meaning; use responsive images with dimensions, eager priority only for actual LCP, lazy lower evidence and a clear direct-image fallback. The native dialog traps focus only while modal and restores its opener. Record any genuinely necessary new/replacement asset and reason before using ImageGen; otherwise reuse originals. Add no generation task per project.
- [ ] **Step 5: Review Zone10 EN/Light desktop and each other case's unique visual module once.** These are five additional checkpoints; inspect related links, evidence readability and distinguishing layout. Run the two test files, `pnpm check` and `pnpm build`; direct evidence links must resolve in the built preview.
- [ ] **Step 6: Commit.** Stage Work/case/assets/test paths explicitly, then `git commit -m "feat: publish five distinctive evidence-rich case studies"`.

## Task 4: Complete About, Experience, Policies and Error Documents

**Files:** About/Resume/Information/Error views; four biography/policy page pairs; `src/pages/404.astro`, `src/pages/ar/404.astro`; route dispatch and localized interface messages; `tests/browser/journey.spec.ts`.

**Interfaces:** Consume `SiteContent`, `RenderedDocument`, `Locale`, `Route`, `getRoute` and `CvLink`. About/Resume/Information views use `{content: SiteContent; document: RenderedDocument; locale: Locale}`. Produce `ErrorPage.astro` props `{locale: Locale; kind: 'not-found' | 'unexpected'}` and localized thanks documents through the common shell; utility routes have no Markdown equivalent and are not indexable.

- [ ] **Step 1: Write failing journey assertions.** In `test('recruiter journey and localized recovery lead to useful destinations', ...)`, follow Home→case→experience and assert the next Contact link targets `/contact/`; assert both locale CV links target `/files/abdullah-mansour-cv.pdf` and the Arabic link reads `تنزيل السيرة بالإنجليزية — PDF`. Assert error and thanks documents have useful Work/Contact links. The Contact destination is implemented in Task 5; this test initially checks that link's URL, then the full landing page after Task 5. Do not assert narrative paragraphs word for word or create tests for every simple text edit.
- [ ] **Step 2: Run `pnpm exec playwright test tests/browser/journey.spec.ts`.** Confirm the missing views/routes cause the expected failure.
- [ ] **Step 3: Implement the four content views and error/thanks documents.** Give About a personal narrative and AI + Mansour explanation; show accurate project-based/full-time overlaps in Experience and general education wording. Write concise Privacy and Accessibility content describing the actual email, analytics, local preference and accessibility behavior. Avoid new biographical claims. Compose purposeful 404/error recovery with Work/Contact actions, and thanks with the exact reply promise. Set noindex for utilities; primary pages retain their own language metadata.
- [ ] **Step 4: Verify navigation, source consistency and fallback content.** Run the journey browser test, `pnpm check` and `pnpm build`. Check real HTTP 404 behavior later under Workers preview in Task 6; existence of an error-looking HTML document alone does not prove the HTTP status.
- [ ] **Step 5: Commit.** Stage this task's views/content/routes/tests explicitly, then `git commit -m "feat: complete professional journey and utility pages"`.

## Task 5: Deliver a Native Cloudflare Contact Form with Accessible Recovery

**Files:** Contact paths, Worker paths, private-shell builder and Wrangler config from the map; `tests/unit/contact.test.ts`, `tests/unit/contact-view.test.ts`, `tests/browser/contact.spec.ts`.

**Interfaces:** `src/contact/contract.ts` exports `ContactValues = {name:string; email:string; company:string; topic:'role'|'project'|'other'; message:string; locale:Locale; website:string}`, `ContactErrors = Partial<Record<keyof ContactValues | 'form', string>>`, and `ContactResult = {ok:true} | {ok:false; code:ContactCode; fieldErrors?:ContactErrors}`. `ContactCode` is `validation|origin|method|too_large|content_type|rate_limited|internal|delivery`. Produce `handleContact(request: Request, deps: ContactDependencies): Promise<Response>`, where dependencies are `allowedOrigins: readonly string[]`, `checkRateLimit(key: string): Promise<boolean>`, `send(values: ContactValues): Promise<void>`, and `shells: Record<Locale, ContactShell>`. `ContactShell = {beforeForm:string; afterForm:string}`. Produce `renderContactForm(locale:Locale, values:ContactValues, errors:ContactErrors):string` and `buildContactShells(distDir:string):Promise<Record<Locale,ContactShell>>`. Wrangler bindings: `ASSETS`, `CONTACT_EMAIL`, `CONTACT_RATE_LIMITER`; the Worker adapter wires them into dependencies.

- [ ] **Step 1: Write failing table-driven contract and form-recovery tests.** Cover 200/400/403/405/413/415/429/500/502, JSON and URL-encoded native forms, all exact field limits, malformed JSON, unsupported types, duplicate scalar fields, CR/LF email injection, empty honeypot, accepted absent-Origin programmatic requests, rejected cross-site browser requests, no provider call after rejection, and one awaited provider call after acceptance. Include `test('chunked Unicode requests obey the byte cap and Arabic errors escape retained input', ...)`; the local `postChunked*` helpers construct real streamed Request bodies and invoke `handleContact` with injected dependencies:

```ts
assert.equal((await postChunked(32769, { contentLength: undefined })).status, 413);
assert.equal((await postChunkedArabic(32769)).status, 413); // bytes, not JS string length
assert.equal((await postWithOrigin('https://other.example')).status, 403);
assert.equal((await postWithFetchSite('cross-site')).status, 403);
assert.equal((await postWhenLimited()).headers.get('Retry-After'), '60');
assert.equal((await nativeSuccess('ar')).headers.get('Location'), '/ar/contact/thanks/');
assert.ok((await nativeFailureWithMarkup('ar')).includes('&lt;script&gt;'));
assert.equal((await nativeFailureWithMarkup('ar')).includes('<script>alert('), false);
```

- [ ] **Step 2: Run `pnpm exec tsx --test tests/unit/contact.test.ts tests/unit/contact-view.test.ts`.** Verify real contract failures before implementation; use injected fake delivery and rate-limiting dependencies, not production emails.
- [ ] **Step 3: Implement request handling and restricted native delivery.** Read bounded body bytes even without Content-Length; trim and validate scalar fields; reject repeated fields and header controls; escape all retained form values. Use exact origin allowlists for production/local preview, native rate limiting 3/60 per-IP with a dedicated namespace, fixed From/destination and visitor Reply-To. Await delivery acceptance; redact provider/internal errors, never log message fields and never put them into a URL. Read current email/Workers/Wrangler skills before writing bindings. Keep compute limited to contact/API errors; send other requests to Assets when invoked.
- [ ] **Step 4: Implement the designed contact page and progressive form.** Show the complete email, accessible copy enhancement, LinkedIn, location and reply promise beside the form. Use one framework-independent escaped form renderer from both Astro and Worker error views. Build private localized error shells from the final static Contact documents around a marked form region, preserving the real design/assets; do not serve template files publicly. JSON responses enhance the page with focusable errors, linked messages, disabled concurrent submit, retained values on failure and announced success. With JS absent, failures return the complete localized form document with the proper error status and noindex header; success redirects 303. Require neither Turnstile nor a database.
- [ ] **Step 5: Test enhanced and native form journeys and inspect Contact AR/Dark at 390px.** Browser assertions cover focus summary, retained Arabic input after 502, duplicate-submit prevention, exact success promise, and a JavaScript-disabled valid submission. Check bidi email isolation and copy failure fallback. This is the eighth planned visual checkpoint. Run `pnpm build` to produce the private shells, unit tests, `pnpm check`, and `pnpm exec playwright test tests/browser/contact.spec.ts` against local Wrangler with mocked delivery where appropriate. Do not send real email from routine tests.
- [ ] **Step 6: Commit.** Stage Contact/Worker/config/test paths explicitly, then `git commit -m "feat: add accessible Cloudflare contact delivery"`.

## Task 6: Publish Search, Agent Interfaces, Correct Routing and Headers

**Files:** SEO/export/header/check scripts and libraries, SeoHead, public schema definitions and finalized Wrangler asset configuration; `tests/unit/exports.test.ts`, `tests/unit/seo.test.ts`, `tests/browser/http.spec.ts`.

**Interfaces:** Consume `loadSiteContent`, `getPublishedRoutes`, `getRoute`, `publishAssets` and `buildContactShells`. Produce `buildPublicProfile(content:SiteContent):PublicProfileV1`, `renderPublicMarkdown(content:SiteContent, route:Route):string`, `publishExports(content:SiteContent, distDir:string):Promise<void>`, `buildSeo(content:SiteContent, route:Route, document:LocalizedDocument):SeoMetadata`, `writeHeaders(distDir:string):Promise<void>`, `checkSite(distDir:string):Promise<void>`. Export `PublicProfileSchema` and its inferred `PublicProfileV1` from `src/lib/public-profile.ts`; its generated JSON Schema implements spec §9's exact fields. `SeoMetadata`, exported by `src/lib/seo.ts`, owns title/description/canonical/alternates/OG/JSON-LD. Use the same Zod contract rather than a separately edited duplicate. `checkSite` returns normally only when artifact contracts pass; failures have actionable, redacted messages. Before Task 7, its only deferred check is existence of the not-yet-authored PDF; the final/default mode requires the file.

- [ ] **Step 1: Write failing public-output tests.** Verify all 24 primary pages' reciprocal alternates, self-canonicals, unique titles/descriptions, one H1, Person ID, allowed visible profile actions, evidence/OG paths and sitemap membership. Add `test('public exports share identity, locale routing and publication state', ...)` with these assertions. `allPublicExports` is a local fixture helper which reads the outputs of `publishExports` in a temporary directory:

```ts
assert.equal(apiProfileBytes, profileBytes); // exact same serialized payload
assert.equal(profile.schemaVersion, 1);
assert.ok(profile.alternateNames.includes('Abdallah Mansour'));
assert.equal(profile.resume.language, 'en');
assert.equal(profile.resume.url, 'https://aimansour.com/files/abdullah-mansour-cv.pdf');
assert.ok(!('phone' in profile.contact));
assert.ok(!(await allPublicExports(allUnpublished)).includes('DRAFT_ONLY_SENTINEL'));
assert.ok(renderPublicMarkdown(changedMetric, zoneRoute).includes('351+'));
assert.equal(getRoute('work', 'ar').markdownPath, '/ar/work/index.md');
```

- [ ] **Step 2: Run `pnpm exec tsx --test tests/unit/exports.test.ts tests/unit/seo.test.ts`.** Confirm missing outputs/contracts fail before implementing them.
- [ ] **Step 3: Implement explicit static exports and shared SEO.** Write byte-equivalent `dist/profile.json` and extensionless `dist/api/profile`, JSON Schema, small OpenAPI, all primary Markdown paths, `llms.txt`, `llms-full.txt`, sitemap and permissive robots. Assemble Markdown from the same resolved sections and facts used on-screen, with absolute valid links and full evidence URLs; include only a link to the PDF. Exclude utility pages, drafts, source instructions and private data. Preserve meaningful content `updatedAt`; a rebuild alone must not change it. Render Person/WebSite/ProfilePage/BreadcrumbList as appropriate, safely escape serialized JSON-LD, and include a text/markdown alternate in HTML. Test a shared-metric change through a second build with unchanged Markdown, then restore the fixture.
- [ ] **Step 4: Finalize routing, caching, CSP and Analytics.** Set selective contact worker-first, `404-page` and correct MIME/CORS for JSON/Markdown. Ensure exact root and Arabic `404.html` artifacts even if Astro's localized output needs relocation. Generate only known `/en/` 301 aliases and preserve unknown 404s. Give fingerprinted assets immutable long caching and HTML/profile/CV revalidation. Hash the exact inline theme bootstrap and any required inline content; authorize only required local resources and the existing beacon. Include that Analytics snippet once; no credential or PII enters it. Apply equivalent security/noindex headers on Worker-rendered errors. No service worker, unsafe-eval or duplicate IndexNow sender.
- [ ] **Step 5: Run built-artifact and local HTTP verification.** `pnpm build`, `pnpm check:site`, unit tests, then `pnpm exec playwright test tests/browser/http.spec.ts` against Wrangler: GET/HEAD equality, correct MIME/CORS/ETag/conditional requests, unknown English/Arabic URLs 404, known `/en/` 301, utility noindex, missing API status, CSP without blocked essentials, and crawler-UA reads. Confirm no hidden project appears anywhere public and no private contact shell is served.
- [ ] **Step 6: Commit.** Stage discovery/SEO/export/routing/header tests explicitly, then `git commit -m "feat: publish crawler and agent content interfaces"`.

## Task 7: Author and Publish the Independent English CV

**Files:** `public/files/abdullah-mansour-cv.pdf`, the non-phone resume descriptor in `src/data/profile.json`, `scripts/verify-pdf.ts`, `package.json`, `pnpm-lock.yaml`, `docs/quality/acceptance.md`; private authoring source in ignored `.local/cv/`.

**Interfaces:** `CvLink` consumes only the fixed path and locale. Produce `verifyPdf(pdfPath:string):Promise<{pages:number;sha256:string}>` to check a readable PDF and selectable text without publishing its extracted contents. The PDF is committed as an asset; `pnpm build` only copies it and must not author it.

- [ ] **Step 1: Read the PDF skill and author a tailored English CV from the approved material.** Use the workspace dependency helper for document tools. Deliberately select and write the professional summary, experience, relevant achievements, capabilities, work highlights, general education and links. Include the supplied phone inside this document only. Use a clean white single-column document with embedded fonts and a natural reading order, targeting two pages without compression. Save the editable authoring source privately and export the ready PDF once; no website generator is involved.
- [ ] **Step 2: Render and inspect every PDF page.** Check hierarchy, margins, breaks, text density, clickable links, contact details, selected achievements, text extraction/reading order and embedded fonts. Revise the document if needed. This is document QA once, independent of site language/theme. Do not dump extracted text or the phone into tool logs, screenshots committed to Git, or the acceptance report.
- [ ] **Step 3: Publish the PDF at the fixed path and verify its independence.** Add a small structural file check using a pinned current `pdfjs-dist` dev dependency for portable text/page inspection, not tests asserting its full prose or matching it to website data. Change a metric only in a temporary test copy, rebuild and assert the PDF SHA-256 is unchanged; replace a temporary PDF at the same path and assert the served ETag/hash changes. Both locale buttons must download the English PDF with a useful filename. Do not repeat this replacement experiment again in Task 8 unless its code or caching behavior changed.
- [ ] **Step 4: Run `pnpm verify:pdf` and `pnpm build`.** Confirm a valid PDF, searchable text, functioning links and stable copied bytes. Run a privacy scan using the phone extracted into memory from the PDF, checking decoded text artifacts and tracked non-PDF text for that value; redact matches and never persist the extracted number. This privacy check does not compare CV wording/facts against site sources.
- [ ] **Step 5: Commit.** `git add public/files/abdullah-mansour-cv.pdf src/data/profile.json scripts/verify-pdf.ts package.json pnpm-lock.yaml docs/quality/acceptance.md` then `git commit -m "feat: publish tailored English CV as replaceable PDF"`.

## Task 8: Pass the Visual, Accessibility, Performance and Content Gates

**Files:** `tests/browser/accessibility.spec.ts`, `scripts/check-budgets.ts`, remaining browser assertions where needed, implementation files only for demonstrated fixes, and `docs/quality/acceptance.md`.

**Interfaces:** Consume the complete built site and Task 6's `checkSite`. Produce `checkBudgets(distDir:string):Promise<void>` and verify the complete package commands `check:site`, `check:budgets`, `verify:pdf`, `test:unit`, `test:browser`, `check`, `build` as introduced by their owning tasks. `pnpm build` performs content validation → Astro build → evidence/exports → header generation → private contact shells; it never generates a PDF. The ordinary dev server updates shared content; Wrangler preview verifies real routing/runtime behavior.

- [ ] **Step 1: Run the complete meaningful automated checks.** `pnpm test:unit`, `pnpm build`, `pnpm check`, `pnpm check:site`, `pnpm verify:pdf`, `pnpm check:budgets`, `pnpm test:browser`. Build before checking the Worker on a clean checkout because its private shells are generated artifacts. Check all published routes/links/data automatically. Count per-page compressed own JS and initial CSS against 20KiB/30KiB; exclude the provider beacon, not first-party enhancements. Do not add tests that merely restate CSS declarations.
- [ ] **Step 2: Complete representative accessibility and reflow checks.** axe on Home, one narrative page, a case and Contact with no unresolved serious/critical findings; include RTL. Check overflow at 320/768/1440px on representative templates, keyboard navigation/dialog/form/focus, text zoom, reduced motion, JS-disabled access and a short real screen-reader journey. Reuse shared-component tests; add a new test only when a real distinct failure is found.
- [ ] **Step 3: Review the eight recorded visual checkpoints as one system.** Reuse Task 2/3/5 captures unless their layout changed. Critique typography, hierarchy, image clarity/crop, whitespace, theme contrast, RTL, field states and distinct case composition with frontend-design. Fix any generic-looking or weak section. Add a capture only for a new composition or an actual repair; do not take every page × language × theme × viewport.
- [ ] **Step 4: Measure representative mobile lab performance.** Use current web-perf guidance; record tool/device/throttling and results for Home, Zone10 and Arabic Contact. Target performance ≥95 and applicable SEO/accessibility 100. Resolve LCP discovery, oversized images/fonts, CLS and blocking requests revealed by the measurements; rerun affected samples only after changes. Report real lab results separately from future field Core Web Vitals.
- [ ] **Step 5: Verify public privacy and replacement behavior.** Scan tracked non-PDF text and final decoded public artifacts against the in-memory PDF phone, excluding the PDF itself; no extracted phone is stored. Confirm no env/private materials/source maps/drafts/private shells are published. Confirm Task 7's unchanged-build/replacement result remains valid; rerun it only if the file pipeline or caching changed. Update acceptance evidence with actual commands/results, eight checkpoint locations and specific limitations, without claiming unmeasured field scores.
- [ ] **Step 6: Commit verified fixes and evidence.** Stage only actual changed files after a diff review, then `git commit -m "test: verify portfolio quality and production readiness"`. If a functional bug appears, use systematic-debugging and add its meaningful regression before fixing it; avoid repeating unrelated passing suites without a change.

## Task 9: Automate, Review, Deploy and Verify the Live Domain

**Files:** GitHub workflow/update/PR files, `AGENTS.md`, `README.md`, `docs/editing.md`, `docs/operations.md`, `scripts/smoke-live.ts`, final Wrangler settings and acceptance report.

**Interfaces:** Produce `smokeLive(baseUrl:string):Promise<void>` for public read-only HTTP/status/header/profile/Markdown checks. The CI workflow consumes the exact package commands from Task 8 and uploads only useful failure reports. A deployment job consumes the passing revision's artifact and Cloudflare secrets; it runs on trusted `push` to `main` after checks, never on an untrusted PR. Preview/domain/mail verification uses the Cloudflare account connection identified in discovery, not the unrelated MCP account.

- [ ] **Step 1: Implement and commit useful repository automation and agent documentation.** One clear workflow uses a frozen install, unit tests, build, type/content checks, PDF structure and budgets, then representative browser/axe checks. Pin official Actions to verified commit SHAs, minimal permissions and a fixed Node/pnpm runtime. Serialize production deployment; verify the commit is still current immediately before deploy so an old run cannot overwrite a newer release. Use reviewed, grouped compatible Dependabot PRs and a brief problem/change/validation PR template. Document exact content locations, section/reference conventions, adding/hiding projects in both languages, independent PDF replacement, asset reuse decisions, local preview, secret setup and rollback. Do not write the phone into these docs. No custom IndexNow automation. Commit the workflow, smoke script and maintenance docs as `ci: automate verified portfolio delivery` before opening the PR.
- [ ] **Step 2: Review the complete branch with the selected execution workflow.** Request an independent final code/spec review through the required Superpowers review skill, resolve actionable findings and rerun affected checks. Confirm a clean intended diff, no accidental inclusion of `التفاصيل/` or env, and no unsupported completion claims. Create the reviewable PR through the repository's allowed flow and attach its URL to this task using the Codex artifact tool.
- [ ] **Step 3: Prepare and publish the passing release.** Read current Cloudflare/Workers/Wrangler skills; refresh apex/www bindings and DNS inventory without modifying unrelated subdomains or MX. Configure the dedicated portfolio Worker, the restricted verified-destination email binding, rate limiter and canonical HTTPS apex; redirect www preserving path/query using an appropriate scoped rule. Store deployment credentials via secret stores without printing them. Use the already authorized hosting scope and the repository's allowed integration flow so passing `main` deploys. Keep the previous Worker version and rollback command recorded; do not enable new blocking/paid services.
- [ ] **Step 4: Run live smoke checks and one limited contact delivery.** `pnpm exec tsx scripts/smoke-live.ts https://aimansour.com` checks HTTPS, www redirect, representative English/Arabic routes, closest-locale real 404s, known aliases, profile GET/HEAD/equality, schema, Markdown, MIME/CORS/cache/CSP/robots/sitemap and representative crawler UAs. Verify the existing beacon is included once and accepted by its provider. Keep the owner's enabled Crawler Hints as the only automatic IndexNow mechanism; no browser reinspection of that setting is needed. Send one clearly labeled contact smoke message to the owner's inbox, confirm provider acceptance and actual receipt; do not schedule production test mail. Provider acceptance alone is not proof of inbox arrival: use authorized inbox access if available, otherwise ask the owner only to confirm that message's receipt.
- [ ] **Step 5: Record the final live evidence and hand over maintenance.** State the live domain, PR/revision, actual test/performance results, PDF path and simple agent editing/replacement commands. If a required action is blocked, state the exact missing permission/input and retain the prepared result; do not call the whole site complete before that required check. Commit final operations/evidence changes, ensure deployment matches the passing revision, and use the finishing-a-development-branch skill to close the chosen flow.

## Coverage and Plan Self-Review

| Approved spec | Owning tasks |
| --- | --- |
| §1 positioning, owner-approved claims, privacy and scope | 1, 2, 4, 6, 7 |
| §2 routes, language pairs, utilities and real 404 | 1, 2, 4, 6, 9 |
| §3 recruiter journey, bespoke cases, Contact and empty states | 2, 3, 4, 5 |
| §4 exact design system, art direction and visual gate | 2, 3, 5, 8 |
| §5 data ownership, references, update dates and drafts | 1, 6 |
| §6 existing assets, justified replacements and performance | 1, 3, 8 |
| §7 RTL, no-JS, keyboard and screen readers | 2, 3, 5, 8 |
| §8 native mail, bounded bodies, errors and rate limits | 5, 9 |
| §9 SEO, profile/schema, Markdown, robots and Crawler Hints | 6, 9 |
| §10 intentionally authored independent English CV | 7, 8 |
| §11 Workers/static routing, security, caching and Analytics | 5, 6, 9 |
| §12 GitHub automation, secrets and agent editing docs | 1, 9 |
| §13 proportional verification and actual acceptance evidence | 3, 5, 6, 7, 8, 9 |
| §14 preserved owner decisions and one integrated project | Global Constraints and all nine tasks |

Self-review completed against all spec sections: coverage mapped above; steps have checkable outputs; shared names/types align; all five Review Focus cases have named owning tests/checks; no implementation bodies, speculative services or duplicate manual QA were added. Design/layout/document work uses real visual/document review; tests focus on content/routing/runtime contracts instead of reversible cosmetic edits.

**Handoff status:** Owner approved the plan and native execution on October 16, 2026, and explicitly chose the current checkout on abdo/portfolio-design. Task checkboxes track implementation; the ignored plan ledger preserves verification and rulings. Deployment is claimed only after live checks.
