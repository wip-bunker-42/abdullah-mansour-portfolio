import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteContent } from '../../src/content/read.ts';
import { splitNarrative } from '../../src/lib/narrative.ts';

test('narrative evidence keeps its place without duplicating its caption', async () => {
  const content = await loadSiteContent();
  const html = '<p>Decision before the evidence.</p><p><img src="/media/evidence/zone10/01-desktop-hero.png" alt="Page"></p><p><em>Existing image caption.</em></p><p>Decision after the evidence.</p>';
  const blocks = splitNarrative(html, content.evidence);
  assert.deepEqual(blocks.map(b => b.kind), ['html','evidence','html']);
  assert.equal(blocks[1]?.kind === 'evidence' && blocks[1].evidence.id, 'zone-desktop');
  assert.ok(blocks[2]?.kind === 'html' && blocks[2].html.includes('Decision after'));
  assert.ok(!blocks.some(b => b.kind === 'html' && b.html.includes('Existing image caption')));
  assert.throws(() => splitNarrative('<p><img src="/private.png"></p>', content.evidence), /Unknown evidence/);
});
test('Markdown table alignment survives without CSP-blocked inline styles',()=>{
  const blocks=splitNarrative('<table><thead><tr><th style="text-align: right">Value</th></tr></thead></table>',{},'en');
  const html=blocks.filter(b=>b.kind==='html').map(b=>b.html).join('');
  assert.ok(!html.includes('style='));assert.match(html,/class="align-right"/);
});
