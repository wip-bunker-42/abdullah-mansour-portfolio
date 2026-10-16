# AIMansour. portfolio: discovery and research

Date: 16 October 2026 (Africa/Cairo).

Status: discovery completed. The owner approved the proposed direction in conversation on 16 October 2026. This is a research record, not the approved architectural specification or implementation plan. No application has been scaffolded, product dependencies installed, or Cloudflare resources changed.

Revision: the owner's subsequent instructions are incorporated below. The downloadable CV is a bespoke, independent English PDF; the phone is public only inside that PDF. The supplied professional copy and results are accepted content, without the reservations added during the initial audit. Response wording promises a reply within hours. The owner's alternative spelling `Abdallah Mansour` is included.

## Intended outcome

Build Abdullah Mansour's permanent professional home at `https://aimansour.com`, primarily helping recruiters and hiring managers understand his value, assess relevant evidence, download a useful CV, and start a conversation. Clients and professional contacts are secondary audiences.

The user explicitly requires English as the default, complete Arabic support, dark and light themes, responsive and accessible layouts, distinctive home/case/contact pages, Cloudflare Workers hosting, Cloudflare Web Analytics, a native contact-email route, IndexNow, public structured profile data, and Markdown for agents. GitHub and understandable local content files are the management system. There is no blog or administration dashboard in scope.

The umbrella role is **Digital Marketing & Growth Specialist**. The supplied brand guide positions AI as practical capacity within that marketing practice. It explains the name **AIMansour.** in About rather than making AI infrastructure the first impression.

## Repository and supplied material

- The repository initially contains a tracked README and no application implementation. The active branch is `main`.
- The supplied `التفاصيل/` package contains 20 localized pages: Home, About, Work, Resume, Contact, and five cases in both English and Arabic.
- Shared files provide brand guidance, microcopy, page metadata, an asset registry, image captions, and alternative text.
- Assets include the transparent portrait, dark/light wordmarks, favicon variants, project evidence, and localized social cards.
- There is no supplied résumé PDF. A tailored English CV will be written, designed and exported as a separate document, then published as a replaceable static file. It is not a build output of the website's profile data. No Arabic PDF is required.
- The existing untracked `.gitignore` already excludes `التفاصيل/`, `تفاصيل/`, `env`, and local environment files. Preserve that exclusion and the original material. Intentionally selected public copy and approved assets can later be incorporated into the application.
- The asset registry reuses `favicon` as an ID for both ICO and SVG. These need distinct keys when imported into a keyed content model.
- The source metadata uses `/en/` routes. The recommended public English URLs are rooted at `/`, with Arabic at `/ar/`; generate all links and metadata consistently from one route map.

## Account discovery

These are read-only observations, not deployment claims.

- `aimansour.com` is active on Cloudflare's Free Website plan.
- The apex is not currently attached to a Worker in the returned custom-domain list. Existing applications use other subdomains; portfolio work should stay scoped to the apex and its intended `www` alias.
- Email Routing is enabled and ready. `abdullahmansour.marketing@gmail.com` is already a verified destination.
- Existing MX records use Cloudflare Email Routing. No mail-provider migration is indicated by this inventory.
- Bot Fight Mode, AI-bot blocking, and crawler protection are disabled in the returned bot configuration. The production verification still needs to inspect the actual robots response and test public routes with representative crawler user agents.
- Cloudflare Web Analytics already has an enabled record for `aimansour.com`, with manual installation selected and an existing public beacon token. Reuse this record and include the beacon once.
- The owner has enabled Crawler Hints on this zone. The updated design uses it as the sole automatic IndexNow notification path. No browser inspection or change to that activation was needed. The generic settings API did not expose this flag; the activation record here is the owner's explicit confirmation.
- Two Cloudflare tool connections point to different accounts. `mcp__codex_apps__cloudflare_*` reaches the intended account. The other Cloudflare MCP connection did not list this zone.
- The local Cloudflare token can read the zone, DNS, Workers, Email Routing and bot settings. It receives 403 on Web Analytics configuration. This does **not** block reuse of the enabled Analytics record because the correct MCP connection can read it.
- GitHub access to the existing repository includes push and administrative permissions. No remote mutation was performed.
- Installed Node is `24.21.0`; installed pnpm is `12.8.1`. Both are newer than the current Astro minimum, subject to exact dependency-engine checks during setup.

Do not put account credentials into source files, this report, generated public data, or command output. The Analytics beacon token is public configuration, not an account API credential.

## Content positioning and supplied work

The strongest story is an integrated marketing practitioner who connects demand, paid acquisition, content, landing pages, SEO, and measurement, and takes responsibility through delivery. The three strongest homepage cases are Zone10, Elkhabar Bewodooh, and Sorouh. Shared AI operations and Youssef El Sherif broaden the Work index with technical initiative and team leadership.

| Case | Supplied story and results to present |
| --- | --- |
| Zone10 | A complete Google Search acquisition setup: research, campaigns, four landing pages and tracking; 350+ people contacted the business and more than US$4,000 managed spend. Existing campaign, keyword, location and page reports support the visual narrative. |
| Elkhabar Bewodooh | An independently operated content venture: 3M+ cross-platform views, around 17K Facebook followers, and more than four hours saved per active publishing day through automation. Existing audience, retention and campaign imagery gives the story substance. |
| Sorouh | Local-search research and deliberate information architecture delivered as a 71-page indexable site, with a 100 Ahrefs Health Score, zero audit errors and initial organic activity. |
| Shared AI operations | A shared environment serving four people below US$8 during the working day, connected to agent workflows, plus merged LocalAI contributions. |
| Youssef El Sherif | Leading a five-person team, developing content and distribution, and doubling average YouTube views during the first six weeks. |

The supplied copy, numbers, reporting labels and project descriptions are accepted as the publication source. The earlier audit's reservations and downgrade recommendations are withdrawn. Do not add confidence labels, verification demands or author-reported disclaimers. Use the existing explanations and dates as written, and edit for reading rhythm and layout while preserving the owner's message.

Education retains its general wording: Al-Azhar University, Faculty of Islamic Da‘wah, without adding a degree, completion status or graduation date. Do not request those details again. Employment history and experience totals follow the supplied text.

## Research findings

### Hiring and presentation

[NN/g's January 2026 recruiter interview](https://www.nngroup.com/articles/ux-hiring-insights/) describes the mismatch between portfolios made to impress peers and the needs of initial reviewers. Its context is design recruitment, so applying its lessons to a marketing portfolio is an inference, not a marketing-specific hiring statistic. Here, the practical lesson is immediate professional clarity, understandable ownership, accessible work evidence, and easy CV/contact access.

[A recent firsthand Reddit discussion](https://www.reddit.com/r/UXDesign/comments/1vygj4j/are_case_studies_still_what_hiring_managers_want/) supports concise problem, role, decision, and outcome summaries. Commenters disagree about process depth and visual emphasis. Treat the discussion as qualitative input; it does not establish an exact recruiter viewing time.

Primary portfolio references inspected included [Brittany Chiang](https://brittanychiang.com/) and [Keita Yamada](https://p5aholic.me/). Brittany's rendered document exposes clear professional identity, experience, projects, CV access and semantic navigation; the local screenshot did not resolve its opening visual state, so no visual-performance conclusion is drawn from it. Keita's visual composition demonstrates confident scale, framing and negative space. His graphics, interaction style and source are not proposed assets for this project. The relevant inference is to develop an original composition around Abdullah's own material.

### Frontend design skill and art direction

The owner requested Anthropic's official frontend-design skill. It was installed using the Codex skill-installer helper from `anthropics/skills`, `skills/frontend-design`, pinned to commit `dbd4588f9e1033efb41dad4bef2f7947c8993d44`, and its full SKILL.md was read. [Official skill source](https://github.com/anthropics/skills/tree/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/frontend-design).

Its principles are applied through a deliberate portrait-and-headline composition, strong Plex typography, subject-specific case imagery, varied open project rows and restrained motion. Arbitrary project numbering is removed because projects are not a sequence. The revised specification includes a chosen desktop/mobile composition, image use, spacing and hierarchy decisions, and a visual quality gate beyond automated scores. Existing supplied fonts and palette remain the brief's explicit choices.

Existing images and social cards are reused when suitable. New imagery or replacements need a concrete missing-asset or quality reason; optimizing dimensions or arranging a screenshot inside a layout does not imply regenerating it.

### Typography, language and accessibility

[IBM's official Plex repository](https://github.com/IBM/plex) provides the requested families. Self-host the required scripts and weights, keep Mono for appropriate numeric/technical details, and set Arabic copy in Plex Sans Arabic with its own line-height and wrapping checks.

[W3C direction guidance](https://www.w3.org/International/questions/qa-html-dir) supports document-level `lang` and `dir`, logical CSS, and deliberate isolation of email addresses, Latin product names and mixed-direction data. A language switch should preserve the equivalent current page or case.

The supplied palettes have strong text contrast. Calculated WCAG contrast examples are:

| Pair | Ratio | Design implication |
| --- | --- | --- |
| Dark primary text / dark background | 18.13:1 | Good starting point |
| Dark secondary text / dark surface | 8.28:1 | Good starting point |
| Light secondary text / white surface | 7.45:1 | Good starting point |
| White / dark-theme accent `#8098FF` | 2.67:1 | Use dark ink for text on a filled accent button |
| Dark ink / dark-theme accent | 7.28:1 | Suitable button pairing |
| White / light-theme accent `#3157E0` | 5.88:1 | Suitable button pairing |
| Dark subtle border / dark surface | 1.40:1 | Decorative separator, not sufficient alone to identify an input |
| Light subtle border / white surface | 1.35:1 | Decorative separator, not sufficient alone to identify an input |
| Proposed dark control border `#657184` / dark surface | 3.71:1 | Stronger interactive-boundary token |
| Proposed light control border `#7B8798` / white surface | 3.65:1 | Stronger interactive-boundary token |

Keep the quiet border tokens for decoration and introduce stronger tokens for controls/focus. [WCAG 2.2](https://www.w3.org/TR/WCAG22/) also requires evaluating semantics, labels, keyboard operation, focus, reflow, errors, and pointer targets. Automated scans alone do not establish full conformance. A 44px primary-control target is a design choice; the AA target-size criterion is 24px with specified exceptions.

### Architecture and performance

[Astro 7.4](https://astro.build/blog/astro-740/) was released on 15 October 2026. [Current installation documentation](https://docs.astro.build/en/install-and-setup/) requires Node 22.22.0 or newer in supported even majors. Pin verified stable dependencies and the build runtime during implementation.

Static Astro pages with strict TypeScript fit this content-led site. [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/) serves static requests without invoking the Worker; [selective Worker routing](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/) can reserve compute for the contact route. A small separate Worker avoids requiring whole-site SSR or the Cloudflare Astro adapter. Re-evaluate only if an actual runtime requirement appears.

Optimize images at build time and publish responsive formats. [Google's LCP guidance](https://web.dev/articles/optimize-lcp) advises early discovery of the actual LCP image and avoiding lazy-loading it. Lower-page case evidence can load lazily. Useful content should be available before animation completes.

The measurable field goals are good Core Web Vitals at the 75th percentile: LCP <=2.5 seconds, INP <=200ms, CLS <=0.1. Build-time/lab budgets can be stricter, but a newly deployed site cannot claim historical real-user results it has not collected.

### Native contact delivery

[Current Cloudflare Email limits](https://developers.cloudflare.com/email-service/platform/limits/) explicitly allow free sends to verified destination addresses on any plan. [Send bindings](https://developers.cloudflare.com/email-service/configuration/send-bindings/) can restrict the binding to the user's Gmail address. A site-domain From address and visitor Reply-To fit a contact form.

This does not imply free arbitrary-recipient confirmation emails: [current Email Service pricing](https://developers.cloudflare.com/email-service/platform/pricing/) distinguishes that capability. Keep the requested delivery path focused on the owner's verified inbox. Await actual provider acceptance, show accessible success/failure feedback, and validate the full live delivery path before calling the form complete.

### Search and agent discovery

[Google localized-version guidance](https://developers.google.com/search/docs/specialty/international/localized-versions) supports complete alternate-language HTML, reciprocal hreflang and self-canonicals. Avoid forcing visitors away from their requested language.

[Google's current AI optimization guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) says Google Search does not use llms.txt as a special ranking mechanism. Still provide explicit Markdown and structured profile resources for the agents and programs that benefit from them. These are public content interfaces, not promises of ranking or universal model ingestion.

[The llms.txt proposal](https://llmstxt.org/) provides a useful discovery format. Generate its index, Markdown equivalents and any full-text companion from the same content that renders the site. Keep contact messages, credentials and internal notes out of every public export.

[Crawler Hints](https://developers.cloudflare.com/cache/advanced-configuration/crawler-hints/) is available on Free and supports IndexNow using cache MISS signals. With the owner's activation and this portfolio's modest publishing frequency, use it as the only automatic notification mechanism. Remove the custom GitHub submission job and application-owned IndexNow key from scope. Retain an accurate sitemap and meaningful 301/404/410 behavior. Any later need for more deterministic publication notifications requires a separate justified decision rather than adding a second default sender.

[Google ProfilePage guidance](https://developers.google.com/search/docs/appearance/structured-data/profile-page) and Schema.org Person can describe the person with a stable identity and factual profile links. Visible social navigation uses only LinkedIn and GitHub. The other supplied accounts belong in `sameAs` and public structured profile data.

[Cloudflare's bot documentation](https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/) explains why robots.txt alone is not enough when edge blocking is enabled. Verify both the public file and the applicable edge configuration. Abuse controls for contact POSTs can be scoped separately from public reading.

## Directions to discuss

| Direction | Benefit | Tradeoff |
| --- | --- | --- |
| Editorial professional, with a carefully composed portrait and evidence-led case spreads | Strong fit for recruitment, a personal identity, readable depth, and long-term restraint | Demands precise typography, editing, imagery and spacing |
| Campaign archive, with large project imagery and structured evidence sheets | Makes varied marketing work coherent and gives case pages a distinctive rhythm | Can feel less personal if the work overwhelms the person |
| Boutique consultant, with services and commercial engagement framing | Stronger secondary-client positioning | Can weaken the primary employment journey |

Recommendation: combine the first direction with selected archive details. Preserve the supplied neutral colors and limited blue accent, 1px borders, 10–14px radii, 500–600 headings, 400 body text, and subtle purposeful motion with reduced-motion support.

Potential page set: Home, Work, five individual cases, About, Experience/CV, Contact, Privacy and Accessibility in both languages, with properly handled 404/error states. Place capabilities and working approach within Home/About rather than creating repetitive thin pages. Error states and any filtered-empty state should use the same design system.

Content contract: a central person/experience model, localized narrative Markdown, shared metric records preserving the supplied definitions, an asset registry, and one localized route map. Generate HTML, SEO data, `profile.json`, a public profile endpoint and Markdown from those sources. The English CV is a separate, deliberately authored PDF at a stable download URL, replaceable without regenerating it from website data. The phone remains inside that PDF only; public profile and Markdown do not include it.

Useful repository automation checks types/builds, content integrity, links, localized route pairs, public data consistency, representative browser/accessibility flows and performance budgets; deploys a passing revision; and proposes reviewed dependency updates. Crawler Hints handles automatic IndexNow notification. Static checks cover all routes; manual visual review covers distinct templates and components with a small meaningful sample across languages, themes and viewports. It does not repeat every combination or require dozens of duplicate screenshots. The English PDF receives one document-specific review.

## Next approval stages

Following the explicitly requested Superpowers brainstorming workflow:

1. Present the proposed visual direction, page journey, content model and technical approach for conversational approval.
2. After that approval, write the architectural specification in `docs/superpowers/specs/`, review it, commit it, and request written-spec review.
3. After written-spec approval, use writing-plans to produce the implementation plan and obtain the execution-method choice.
4. Implement, verify visually and technically, deploy, and complete live checks against the approved scope.

No missing deployment credential or Analytics token is currently established. The revised written specification is awaiting owner review. The owner's content, privacy, independent-CV and quality-review decisions above govern subsequent planning.
