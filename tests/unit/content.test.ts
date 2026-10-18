import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteContent, parseDocument, validateSiteContent } from '../../src/content/read.ts';
import { readFile } from 'node:fs/promises';
import { resolveReferences } from '../../src/content/references.ts';
import { pageIds, locales } from '../../src/content/contracts.ts';

test('approved identity and every published document have their bilingual counterparts', async () => {
  const content = await loadSiteContent();
  for(const key of [...pageIds,...content.projects.filter(p=>p.published).map(p=>`case:${p.id}`)])for(const locale of locales)assert.ok(content.documents.some(d=>d.key===key&&d.locale===locale&&!d.draft));
  assert.ok(content.profile.alternateNames.includes('Abdallah Mansour'));
  assert.ok(!('phone' in content.profile));
  assert.equal(content.profile.contact.responseTime.en, 'I’ll reply within hours.');
});

test('a published case cannot lose its Arabic counterpart', async () => {
  const content = await loadSiteContent();
  const broken = structuredClone(content);
  broken.projects.find(p=>p.id==='zone10')!.published=true;
  broken.documents = broken.documents.filter(d => !(d.key === 'case:zone10' && d.locale === 'ar'));
  assert.throws(() => validateSiteContent(broken), /locale|Arabic|ar/i);
});

test('shared references resolve changed metrics without editing narrative', async () => {
  const content = await loadSiteContent();
  assert.equal(resolveReferences('{{metric:zone10.contacts}}', 'en', content), content.metrics['zone10.contacts']!.display.en);
  const changed = structuredClone(content);
  changed.metrics['zone10.contacts']!.display.en = '351+';
  assert.equal(resolveReferences('{{metric:zone10.contacts}}', 'en', changed), '351+');
  changed.metrics['elkhabar.views']!.value=4000000;
  assert.equal(resolveReferences('{{metric:elkhabar.views.number}}','en',changed),'4,000,000');
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

test('editing a shared operating cost preserves unrelated original report amounts', async () => {
  const content=await loadSiteContent();content.metrics['ai.cost']!.value=9;
  const report=parseDocument(await readFile('src/content/cases/en/zone10.md','utf8'));
  assert.ok(resolveReferences(report.markdown,'en',content).includes('SAR31.95 (US$8.52)'));
});
