import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteContent, validateSiteContent } from '../../src/content/read.ts';
import { resolveReferences } from '../../src/content/references.ts';

test('approved content loads with five published bilingual cases', async () => {
  const content = await loadSiteContent();
  assert.equal(content.projects.filter(p => p.published).length, 5);
  assert.equal(content.documents.length, 24);
  assert.ok(content.profile.alternateNames.includes('Abdallah Mansour'));
  assert.ok(!('phone' in content.profile));
  assert.equal(content.profile.contact.responseTime.en, 'I’ll reply within hours.');
});

test('a published case cannot lose its Arabic counterpart', async () => {
  const content = await loadSiteContent();
  const broken = structuredClone(content);
  broken.documents = broken.documents.filter(d => !(d.key === 'case:zone10' && d.locale === 'ar'));
  assert.throws(() => validateSiteContent(broken), /locale|Arabic|ar/i);
});

test('shared references resolve changed metrics without editing narrative', async () => {
  const content = await loadSiteContent();
  assert.equal(resolveReferences('{{metric:zone10.contacts}}', 'en', content), '350+');
  const changed = structuredClone(content);
  changed.metrics['zone10.contacts']!.display.en = '351+';
  assert.equal(resolveReferences('{{metric:zone10.contacts}}', 'en', changed), '351+');
  assert.throws(() => resolveReferences('{{metric:missing}}', 'en', content), /missing/);
});

test('content rejects duplicate IDs, unknown references and unsafe asset paths', async () => {
  const content = await loadSiteContent();
  const duplicate = structuredClone(content);
  duplicate.projects.push(duplicate.projects[0]!);
  assert.throws(() => validateSiteContent(duplicate), /duplicate/i);
  const unsafe = structuredClone(content);
  unsafe.evidence['zone-desktop']!.source = '../env';
  assert.throws(() => validateSiteContent(unsafe), /path|source/i);
  const missing = structuredClone(content);
  missing.projects[0]!.metricIds.push('missing');
  assert.throws(() => validateSiteContent(missing), /missing/i);
});

test('private or unsupported person properties cannot enter public facts', async () => {
  const content = await loadSiteContent();
  const privateProfile = { ...content, profile: { ...content.profile, phone: 'PRIVATE_SENTINEL' } };
  assert.throws(() => validateSiteContent(privateProfile), /phone|Unrecognized/i);
});
