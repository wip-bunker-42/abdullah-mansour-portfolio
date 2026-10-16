import { test, expect } from '@playwright/test';
import { mkdtemp, cp, readFile, writeFile, rm } from 'node:fs/promises';
import { resolve, join, sep } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createServer, type Server } from 'node:http';
import { fileURLToPath } from 'node:url';

let fixture: string;
let server: Server;
let origin: string;
const root = fileURLToPath(new URL('../..', import.meta.url));

test.beforeAll(async () => {
  fixture = await mkdtemp(join(root, '.local/empty-work-'));
  for (const name of ['src', 'public', 'astro.config.mjs', 'tsconfig.json', 'package.json']) {
    await cp(join(root, name), join(fixture, name), { recursive: true, filter: path => !path.includes(`${sep}media`) });
  }
  const dataPath = join(fixture, 'src/data/projects.json');
  const projects = JSON.parse(await readFile(dataPath, 'utf8'));
  projects.forEach((project: { published: boolean }) => { project.published = false; });
  await writeFile(dataPath, JSON.stringify(projects));
  execFileSync(process.execPath, [join(root, 'node_modules/astro/bin/astro.mjs'), 'build'], { cwd: fixture, stdio: 'pipe', timeout: 60_000 });
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
  await page.goto(`${origin}/work/`);
  await expect(page.getByRole('heading', { name: 'An updated selection of work is on its way.' })).toBeVisible();
  await expect(page.locator('.empty-work').getByRole('link', { name: /contact/i })).toBeVisible();
  await expect(page.locator('.empty-work').getByRole('link', { name: /PDF/i })).toBeVisible();
  await page.goto(origin);
  await expect(page.locator('[data-selected-work]')).toHaveCount(0);
});
