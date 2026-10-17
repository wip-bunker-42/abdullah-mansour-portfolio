import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteContent } from '../../src/content/read.ts';
import { publicationAwareMarkdown } from '../../src/content/publication.ts';

test('hidden case links become readable mentions in both languages and public Markdown', async () => {
  const content = await loadSiteContent();
  content.projects.forEach(p => { p.published = false; });
  for (const prefix of ['', '/ar']) {
    const source = `[Project](${prefix}/work/zone10/#results) · [Contact](${prefix}/contact/) · [Public export](https://aimansour.com${prefix}/work/zone10.md)`;
    assert.equal(publicationAwareMarkdown(source, content), `Project · [Contact](${prefix}/contact/) · Public export`);
  }
  content.projects.find(p => p.id === 'zone10')!.published = true;
  assert.equal(publicationAwareMarkdown('[Project](/work/zone10/)', content), '[Project](/work/zone10/)');
});
