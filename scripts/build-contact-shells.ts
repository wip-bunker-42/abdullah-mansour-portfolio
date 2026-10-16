import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { Locale } from '../src/content/contracts.ts';
import type { ContactShell } from '../src/contact/contract.ts';
export async function buildContactShells(distDir: string): Promise<Record<Locale,ContactShell>> {
  const shells = {} as Record<Locale,ContactShell>;
  for (const locale of ['en','ar'] as const) {
    const html = await readFile(join(distDir,locale==='ar'?'ar/contact/index.html':'contact/index.html'),'utf8');
    const start='<!-- contact-form:start -->',end='<!-- contact-form:end -->';
    if (html.split(start).length!==2 || html.split(end).length!==2) throw Error(`Contact form markers missing or repeated: ${locale}`);
    shells[locale]={beforeForm:html.slice(0,html.indexOf(start)).replace('<head>','<head><meta name="robots" content="noindex">'),afterForm:html.slice(html.indexOf(end)+end.length)};
  }
  return shells;
}
if (process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  await mkdir('.generated',{recursive:true}); await writeFile('.generated/contact-shells.json',JSON.stringify(await buildContactShells('dist'))+'\n');
}
