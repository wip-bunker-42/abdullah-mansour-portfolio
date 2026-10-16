# Editing the portfolio

GitHub and comprehensible source files are the management system. Any coding agent can edit the same files, run checks and open a PR. No application admin, proprietary content service or database is involved.

## Where each kind of content belongs

| Source | Owns |
| --- | --- |
| `src/data/profile.json` | Name/aliases, umbrella role, summary, location, email, reply promise, account identities, CV descriptor and meaningful update date |
| `src/data/experience.json` | Positions, periods, engagement type, capabilities, general education, credentials and contribution links |
| `src/data/projects.json` | Project IDs, publication/feature flags, ordering, responsibility/facts, related projects, evidence/metric IDs and social images |
| `src/data/metrics.json` | Shared values and their local display/labels/report periods |
| `src/data/evidence.json` | Original source path, stable public path, dimensions and localized alt/caption |
| `src/content/pages/{en,ar}/*.md` | Page titles/descriptions, headline, lead and narrative |
| `src/content/cases/{en,ar}/*.md` | Full case narratives |
| `src/i18n/messages.ts`, `src/contact/messages.ts` | Navigation, interface, utility and form messages |
| `src/components/cases/` | The five distinctive semantic project compositions and their presentation copy |
| `public/files/abdullah-mansour-cv.pdf` | Independent, deliberately authored English CV |

Use actual content changes to update `updatedAt`. A routine build does not change it. Keep both languages complete; no automatic language redirect or automatic prose translation is used at runtime.

## Markdown and shared references

Keep the frontmatter contract. Every H2 needs a stable ASCII ID, for example `## The decision {#decision}`. Keep IDs stable in both languages so links remain useful. No MDX, executable code or instructions are exported.

Use references rather than copying a repeated fact:

```text
{{metric:zone10.contacts}}
{{metric:zone10.contacts.value}}
{{profile:name}}
{{profile:professionalTitle}}
{{profile:email}}
{{profile:responseTime}}
{{experience:tahliq.organization}}
{{evidence:zone-desktop.caption}}
{{evidence:zone-desktop.url}}
```

The normal metric reference uses its local display (e.g. `350+`); `.value` supplies the raw value for a sentence. Supported reference fields are defined in `src/content/references.ts`. Unknown references fail the build. Update all relevant local display/label fields when editing a metric. The original report's dates/definitions remain attached to that report. If a supplied raster social image has a changed fact baked into its pixels, update that affected asset deliberately; rebuilding the website does not redraw images.

## Cases and evidence

To add a case, add its ID to `projectIds` in `src/content/contracts.ts`, its registry entry, both Markdown documents and any evidence/metrics. For a distinct executive visual, add a semantic module and register it in `CasePage.astro`; do not repeat a generic case-card template. Use a supplied suitable 1200×630 social image or deliberately author only the missing asset.

To hide a case, set `published: false` in the registry. Build from source. It disappears from the Work/Home selection, routes, profile selection, Markdown discovery, sitemap and published evidence/social assets. The Work page keeps useful Contact/CV actions if all cases are hidden. Historical links correctly return 404; do not redirect every missing address to Home. Review other narrative mentions separately if the intention is to remove the subject entirely.

Put new original evidence in `src/assets/evidence/<project>/`, register correct dimensions and supply useful English/Arabic alt text and captions. Narrative evidence uses its stable `/media/evidence/...` URL. The build makes responsive thumbnails; the original remains a direct-link fallback and modal resource. Keep private information out of images before registering them.

## Replace the CV

1. Prepare a deliberately written English PDF with selectable text and a sensible reading order. The existing CV's local editable authoring source, when available on the owner's machine, is in ignored `.local/cv/`.
2. Replace `public/files/abdullah-mansour-cv.pdf` with the new file. Keep the filename/path. Do not add an Arabic PDF or connect generation to `pnpm build`.
3. Update only the CV descriptor's `updatedAt` in `src/data/profile.json`. The website's biography and CV prose can evolve independently.
4. Run `pnpm verify:pdf`, render/inspect its pages, then `pnpm build`, `pnpm check:site` and `pnpm check:privacy`. Never save extracted CV text or a contact number to tracked files or logs. The privacy checker reads the international contact number in memory.
5. Open a PR. Once the passing revision is on `main`, deployment copies the ready PDF and revalidation exposes the new ETag at the same download URL.

## Career or positioning changes

Start with the role/summary in `profile.json`, then revise capabilities, positions, narratives and localized interface copy. Preserve the stable person ID, aliases and existing useful permalinks. Review supplied social/brand assets if their embedded words no longer match the new positioning. Run the same proportionate checks; no CMS migration is necessary.
