import { mkdir, writeFile } from 'node:fs/promises';
import { loadSiteContent } from '../src/content/read.ts';
const content=await loadSiteContent();
const ids=[...new Set(content.projects.filter(p=>p.published).flatMap(p=>[...p.evidenceIds,...(p.coverEvidenceId?[p.coverEvidenceId]:[])]))];
const assets=ids.map(id=>content.evidence[id]!);
const imports=assets.map((asset,index)=>`import image${index} from ${JSON.stringify('../'+asset.source)};`);
await mkdir('.generated',{recursive:true});
await writeFile('.generated/evidence-imports.ts',`import type { ImageMetadata } from 'astro';\n${imports.join('\n')}\nexport const evidenceImages: Record<string,ImageMetadata> = {\n${assets.map((asset,index)=>`${JSON.stringify(asset.source)}: image${index}`).join(',\n')}\n};\n`);
