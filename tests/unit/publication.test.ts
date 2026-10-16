import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteContent } from '../../src/content/read.ts';
import { getPublishedProjects } from '../../src/content/publication.ts';
import { getPublishedRoutes } from '../../src/i18n/routes.ts';

test('unpublished projects disappear from sorted work and public routes', async () => {
  const content = await loadSiteContent();
  const hidden = structuredClone(content);
  hidden.projects.forEach(p => { p.published = false; });
  assert.equal(getPublishedProjects(hidden).length, 0);
  assert.ok(!getPublishedRoutes(hidden).some(r => r.key.startsWith('case:')));
  content.projects.reverse();
  assert.deepEqual(getPublishedProjects(content).map(p => p.id), ['zone10','elkhabar-bewodooh','sorouh','ai-operations','youssef-el-sherif']);
});
