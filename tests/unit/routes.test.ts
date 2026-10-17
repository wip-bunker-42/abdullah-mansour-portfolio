import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteContent } from '../../src/content/read.ts';
import { getRoute, getPublishedRoutes } from '../../src/i18n/routes.ts';
import { pageIds, locales } from '../../src/content/contracts.ts';

test('default English and equivalent Arabic routes have explicit Markdown paths', () => {
  assert.equal(getRoute('home', 'en').path, '/');
  assert.equal(getRoute('home', 'ar').path, '/ar/');
  assert.equal(getRoute('case:zone10', 'ar').path, '/ar/work/zone10/');
  assert.equal(getRoute('work', 'ar').markdownPath, '/ar/work/index.md');
  assert.equal(getRoute('case:zone10', 'en').markdownPath, '/work/zone10.md');
  assert.equal(getRoute('contact-thanks', 'ar').indexable, false);
});

test('only complete published primary routes enter public discovery', async () => {
  const content = await loadSiteContent();
  assert.equal(getPublishedRoutes(content).length, (pageIds.length+content.projects.filter(p=>p.published).length)*locales.length);
  const hidden = structuredClone(content);
  hidden.projects.forEach(p => { p.published = false; });
  assert.equal(getPublishedRoutes(hidden).length, pageIds.length*locales.length);
  assert.ok(!getPublishedRoutes(hidden).some(r => r.key.startsWith('case:')));
});
