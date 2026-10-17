import { copyFile, mkdir, rm } from 'node:fs/promises';
import { resolve, dirname, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadSiteContent } from '../src/content/read.ts';
import type { SiteContent } from '../src/content/contracts.ts';

export async function publishAssets(content: SiteContent, distDir: string): Promise<void> {
  const root = resolve(distDir);
  const output = resolve(root, 'media/evidence');
  if (relative(root, output).startsWith('..')) throw new Error('Asset output must stay in the build root');
  await rm(output, { recursive: true, force: true });
  const ids = new Set(content.projects.filter(p => p.published).flatMap(p => p.evidenceIds));
  for (const id of ids) {
    const item = content.evidence[id]!;
    if (!/^\/media\/evidence\/[a-z0-9-]+\/[a-z0-9._-]+\.(png|jpe?g|webp|avif)$/.test(item.publicPath)) throw new Error(`Unsafe public asset: ${id}`);
    const path = resolve(root, `.${item.publicPath}`);
    if (relative(output, path).startsWith('..')) throw new Error(`Asset escapes output: ${id}`);
    await mkdir(dirname(path), { recursive: true });
    await copyFile(resolve(item.source), path);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await publishAssets(await loadSiteContent(), process.argv.includes('--dev') ? 'public' : 'dist');
}
