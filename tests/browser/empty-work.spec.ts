import { test, expect } from '@playwright/test';
import { mkdtemp, cp, readFile, writeFile, rm } from 'node:fs/promises';
import { resolve, join, sep } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createServer, type Server } from 'node:http';
import { fileURLToPath } from 'node:url';
import { walkFiles } from '../../scripts/files.ts';

let fixture: string;
let server: Server;
let origin: string;
const root = fileURLToPath(new URL('../..', import.meta.url));

test.beforeAll(async () => {
  fixture = await mkdtemp(join(root, '.local/empty-work-'));
  for (const name of ['src', 'public', 'scripts', 'astro.config.mjs', 'tsconfig.json', 'package.json']) {
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
      response.setHeader('Content-Type', path.endsWith('.css') ? 'text/css' : path.endsWith('.js') ? 'text/javascript' : 'text/html');
      response.end(await readFile(path));
    } catch { response.writeHead(404).end(); }
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
  // A second real build edits only shared facts, keeping narrative source intact.
  const narrativePath=join(fixture,'src/content/cases/en/zone10.md');
  const narrative=await readFile(narrativePath,'utf8');
  const projectPath=join(fixture,'src/data/projects.json');const projects=JSON.parse(await readFile(projectPath,'utf8'));
  projects.find((p:{id:string})=>p.id==='zone10').published=true;await writeFile(projectPath,JSON.stringify(projects));
  const metricPath=join(fixture,'src/data/metrics.json');const metrics=JSON.parse(await readFile(metricPath,'utf8'));
  metrics['zone10.contacts'].value=351;metrics['zone10.contacts'].display.en='351+';await writeFile(metricPath,JSON.stringify(metrics));
  execFileSync(process.execPath,[join(root,'node_modules/tsx/dist/cli.mjs'),join(fixture,'scripts/prepare-assets.ts')],{cwd:fixture,stdio:'pipe',timeout:60_000});
  execFileSync(process.execPath,[join(root,'node_modules/astro/bin/astro.mjs'),'build'],{cwd:fixture,stdio:'pipe',timeout:60_000});
  execFileSync(process.execPath,[join(root,'node_modules/tsx/dist/cli.mjs'),join(fixture,'scripts/finalize-build.ts')],{cwd:fixture,stdio:'pipe',timeout:60_000});
  expect(await readFile(narrativePath,'utf8')).toBe(narrative);
  expect(await readFile(join(fixture,'dist/work/zone10/index.html'),'utf8')).toContain('351+');
  expect(await readFile(join(fixture,'dist/work/zone10.md'),'utf8')).toContain('351+');
});
