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
