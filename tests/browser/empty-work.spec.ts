import { test, expect } from '@playwright/test';
import { cp, readFile, writeFile, rm } from 'node:fs/promises';
import { resolve, join, sep } from 'node:path';
import { execFileSync, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createServer, type Server } from 'node:http';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { walkFiles } from '../../scripts/files.ts';
import { createFixtureDirectory } from '../fixture.ts';

let fixture: string;
let server: Server;
let origin: string;
const root = fileURLToPath(new URL('../..', import.meta.url));
test.describe.configure({mode:'default'});

test.beforeAll(async () => {
  fixture = await createFixtureDirectory(root, 'empty-work-');
  for (const name of ['src', 'public', 'scripts', 'tests', 'worker', 'astro.config.mjs', 'tsconfig.json', 'package.json', 'playwright.config.ts']) {
    await cp(join(root, name), join(fixture, name), { recursive: true, filter: path => !path.includes(`${sep}media`) });
  }
  const dataPath = join(fixture, 'src/data/projects.json');
  const projects = JSON.parse(await readFile(dataPath, 'utf8'));
  projects.forEach((project: { published: boolean }) => { project.published = false; });
  await writeFile(dataPath, JSON.stringify(projects));
  execFileSync(process.execPath,[join(root,'node_modules/tsx/dist/cli.mjs'),join(fixture,'scripts/prepare-assets.ts')],{cwd:fixture,stdio:'pipe',timeout:60_000});
  execFileSync(process.execPath, [join(root, 'node_modules/astro/bin/astro.mjs'), 'build'], { cwd: fixture, stdio: 'pipe', timeout: 60_000 });
  execFileSync(process.execPath, [join(root,'node_modules/tsx/dist/cli.mjs'),join(fixture,'scripts/finalize-build.ts')],{cwd:fixture,stdio:'pipe',timeout:60_000});
  server = createServer(async (request, response) => {
    const url = new URL(request.url ?? '/', 'http://localhost');
    const path = resolve(fixture, 'dist', `.${url.pathname}`, url.pathname.endsWith('/') ? 'index.html' : '');
    if (!path.startsWith(resolve(fixture, 'dist') + sep)) { response.writeHead(404).end(); return; }
    try {
      const types:Record<string,string>={css:'text/css',js:'text/javascript',png:'image/png',webp:'image/webp',svg:'image/svg+xml',woff2:'font/woff2',pdf:'application/pdf'};
      response.setHeader('Content-Type',types[path.split('.').at(-1)!]??'text/html');
      response.end(await readFile(path));
    } catch { response.writeHead(404,{'Content-Type':'text/html'}).end(await readFile(join(fixture,'dist',url.pathname.startsWith('/ar/')?'ar/404.html':'404.html'))); }
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
});

test.afterAll(async () => {
  if (server) await new Promise<void>(resolve => server.close(() => resolve()));
  if (fixture?.startsWith(join(root, '.local/empty-work-'))) await rm(fixture, { recursive: true, force: true });
});

test('unpublished projects leave useful Work actions and no empty Home gallery', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto(`${origin}/work/`);
  await expect(page.getByRole('heading', { name: 'An updated selection of work is on its way.' })).toBeVisible();
  await expect(page.locator('.empty-work').getByRole('link', { name: /contact/i })).toBeVisible();
  await expect(page.locator('.empty-work').getByRole('link', { name: /PDF/i })).toBeVisible();
  await page.goto(origin);
  await expect(page.locator('[data-selected-work]')).toHaveCount(0);
  const outputs=await walkFiles(join(fixture,'dist'));
  expect(outputs.filter(path=>path.includes(`${sep}media${sep}evidence${sep}`))).toHaveLength(0);
  expect(outputs.filter(path=>path.includes('social-zone10'))).toHaveLength(0);
  expect(outputs.filter(path=>path.includes('01-desktop-hero')||path.includes('01-riyadh-performance'))).toHaveLength(0);
  execFileSync(process.execPath,[join(root,'node_modules/tsx/dist/cli.mjs'),join(fixture,'scripts/check-site.ts')],{cwd:fixture,stdio:'pipe',timeout:60_000});
  // Exercise the actual live-journey tests against an empty selection, rather than just deriving counts.
  try {await promisify(execFile)(process.execPath,[join(root,'node_modules/@playwright/test/cli.js'),'test','tests/browser/work.spec.ts','tests/browser/journey.spec.ts','--workers=1'],{cwd:fixture,env:{...process.env,TEST_BASE_URL:origin},timeout:45_000});}
  catch(error){throw new Error(`Hidden work journeys failed:\n${(error as {stdout:Buffer}).stdout.toString()}`);}
});

test('shared metrics update prose, metadata, visuals and exports without narrative or CV edits', async ({page, browser}) => {
  test.setTimeout(90_000);
  // A second real build edits only shared facts, keeping narrative source intact.
  const narrativePath=join(fixture,'src/content/cases/en/zone10.md');
  const narrative=await readFile(narrativePath,'utf8');
  const cvPath=join(fixture,'dist/files/abdullah-mansour-cv.pdf');
  const cvHash=createHash('sha256').update(await readFile(cvPath)).digest('hex');
  const projectPath=join(fixture,'src/data/projects.json');const projects=JSON.parse(await readFile(projectPath,'utf8'));
  projects.forEach((p:{id:string,published:boolean})=>{p.published=['zone10','youssef-el-sherif','elkhabar-bewodooh'].includes(p.id);});await writeFile(projectPath,JSON.stringify(projects));
  const metricPath=join(fixture,'src/data/metrics.json');const metrics=JSON.parse(await readFile(metricPath,'utf8'));
  metrics['zone10.contacts'].value=351;metrics['zone10.contacts'].display.en='351+';
  metrics['youssef.team'].value=7;metrics['youssef.team'].display={en:'7',ar:'7'};
  metrics['elkhabar.views'].value=4000000;metrics['elkhabar.views'].display={en:'4M+',ar:'4M+'};
  await writeFile(metricPath,JSON.stringify(metrics));
  execFileSync(process.execPath,[join(root,'node_modules/tsx/dist/cli.mjs'),join(fixture,'scripts/prepare-assets.ts')],{cwd:fixture,stdio:'pipe',timeout:60_000});
  execFileSync(process.execPath,[join(root,'node_modules/astro/bin/astro.mjs'),'build'],{cwd:fixture,stdio:'pipe',timeout:60_000});
  execFileSync(process.execPath,[join(root,'node_modules/tsx/dist/cli.mjs'),join(fixture,'scripts/finalize-build.ts')],{cwd:fixture,stdio:'pipe',timeout:60_000});
  expect(await readFile(narrativePath,'utf8')).toBe(narrative);
  expect(await readFile(join(fixture,'dist/work/zone10/index.html'),'utf8')).toContain('351+');
  expect(await readFile(join(fixture,'dist/work/zone10.md'),'utf8')).toContain('351+');
  for(const [path,obsolete]of [['work/youssef-el-sherif/index.html',/five-person|five people|Five people/],['ar/work/youssef-el-sherif/index.html',/خمسة أشخاص/],['resume/index.html',/three million|seventeen thousand/],['ar/resume/index.html',/ثلاثة ملايين/],['work/youssef-el-sherif.md',/five-person|five people/],['ar/work/youssef-el-sherif.md',/خمسة أشخاص/]] as const) {
    expect(await readFile(join(fixture,'dist',path!),'utf8')).not.toMatch(obsolete as RegExp);
  }
  await page.goto(`${origin}/work/youssef-el-sherif/`);
  await expect(page.locator('.team-people svg')).toHaveCount(7);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',/7 people/);
  // Fixed-case interaction coverage uses this controlled published fixture, even when the live registry hides all cases.
  await page.goto(`${origin}/work/zone10/`);const trigger=page.locator('[data-evidence-trigger]').first();await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
  await page.emulateMedia({reducedMotion:'reduce'});const section=page.locator('.case-contents a').first();const href=await section.getAttribute('href');await section.click();
  expect(await page.locator(href!).evaluate(element=>element.getBoundingClientRect().top)).toBeGreaterThanOrEqual(0);
  const noJs=await browser.newContext({javaScriptEnabled:false});const fallback=await noJs.newPage();
  await fallback.goto(`${origin}/ar/work/zone10/`);await expect(fallback.locator('[data-evidence-trigger]').first()).toHaveAttribute('href',/\/media\/evidence\/zone10\/.+\.png$/);await noJs.close();
  expect(createHash('sha256').update(await readFile(cvPath)).digest('hex')).toBe(cvHash);
});

test('the unit quality gate permits a fully hidden registry with edited facts', async () => {
  test.setTimeout(60_000);
  const projectPath=join(fixture,'src/data/projects.json');const projects=JSON.parse(await readFile(projectPath,'utf8'));
  projects.forEach((p:{published:boolean})=>{p.published=false;});await writeFile(projectPath,JSON.stringify(projects));
  const metricPath=join(fixture,'src/data/metrics.json');const metrics=JSON.parse(await readFile(metricPath,'utf8'));metrics['zone10.contacts'].value=777;metrics['zone10.contacts'].display={en:'777+',ar:'777+'};await writeFile(metricPath,JSON.stringify(metrics));
  try { execFileSync(process.execPath,[join(root,'node_modules/tsx/dist/cli.mjs'),'--test','tests/unit/*.test.ts'],{cwd:fixture,stdio:'pipe',timeout:60_000}); }
  catch(error){throw new Error(`Fixture unit gate failed:\n${(error as {stdout:Buffer}).stdout.toString()}`);}
});
