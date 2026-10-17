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
  hidden.projects[0]!.published=true;hidden.projects[0]!.order=20;
  hidden.projects[1]!.published=true;hidden.projects[1]!.order=10;
  assert.deepEqual(getPublishedProjects(hidden).map(p => p.id), [hidden.projects[1]!.id,hidden.projects[0]!.id]);
});
