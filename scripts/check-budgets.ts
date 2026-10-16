import {readFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {gzipSync} from 'node:zlib';
import {loadSiteContent} from '../src/content/read.ts';
import {getPublishedRoutes} from '../src/i18n/routes.ts';
export async function checkBudgets(distDir:string):Promise<void> {
  const content=await loadSiteContent();let maxJs=0,maxCss=0;
  for(const route of getPublishedRoutes(content)) {
    const html=await readFile(join(distDir,route.path,'index.html'),'utf8');
    const sources=new Set([...html.matchAll(/<script\b[^>]*\bsrc="(\/_astro\/[^"]+)"/g)].map(m=>m[1]!));
    const styles=new Set([...html.matchAll(/<link\b[^>]*href="(\/_astro\/[^"\s]+\.css)"/g)].map(m=>m[1]!));
    let js=0,css=0;
    for(const source of sources) {
      const code=await readFile(join(distDir,source),'utf8');js+=gzipSync(code).length;
      const imports=[...code.matchAll(/\b(?:import|export)\s*(?:[^'";]*?\s*from\s*)?['"]([^'"]+)['"]/g)].map(m=>m[1]!);
      imports.push(...[...code.matchAll(/\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g)].map(m=>m[1]!));
      for(const specifier of imports)if(specifier.startsWith('.')||specifier.startsWith('/'))sources.add(new URL(specifier,`https://aimansour.com${source}`).pathname);
    }
    for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g))if(!/\bsrc=|application\/ld\+json/.test(match[1]!))js+=gzipSync(match[2]!).length;
    for(const source of styles)css+=gzipSync(await readFile(join(distDir,source))).length;
    if(js>20*1024||css>30*1024)throw Error(`${route.path}: own JavaScript ${js} / CSS ${css} gzip bytes exceeds budget.`);
    maxJs=Math.max(maxJs,js);maxCss=Math.max(maxCss,css);
  }
  console.log(`Per-page budgets pass: max own JS ${maxJs} / initial CSS ${maxCss} gzip bytes (limits 20480 / 30720; provider beacon excluded).`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)await checkBudgets('dist');
