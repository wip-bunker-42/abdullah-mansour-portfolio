import test from 'node:test';
import assert from 'node:assert/strict';
import { parseDocument } from '../../src/content/read.ts';

test('executable frontmatter is rejected before any expression can run', () => {
  const state = globalThis as typeof globalThis & { frontmatterProbe?: boolean };
  delete state.frontmatterProbe;
  assert.throws(() => parseDocument('---javascript\n(globalThis.frontmatterProbe = true, {})\n---\nA document.'));
  assert.equal(state.frontmatterProbe, undefined);
});

test('frontmatter accepts data-only YAML and rejects custom tags', () => {
  const metadata = 'key: about\nlocale: en\ntitle: About\ndescription: A description\nheading: About me\nlead: Hello\nupdatedAt: "2026-10-16"\ndraft: false';
  assert.equal(parseDocument(`---\n${metadata}\n---\n## Work {#work}\n\nA paragraph.`).sections[0]!.id, 'work');
  assert.throws(() => parseDocument(`---\n${metadata}\nextra: !!js/function "function () { return true; }"\n---\n`));
});
