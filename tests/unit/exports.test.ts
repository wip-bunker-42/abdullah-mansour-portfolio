import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { tmpdir } from 'node:os';
import { loadSiteContent } from '../../src/content/read.ts';
import { buildPublicProfile, PublicProfileSchema } from '../../src/lib/public-profile.ts';
import { renderPublicMarkdown, publishExports } from '../../scripts/build-exports.ts';
import { getRoute } from '../../src/i18n/routes.ts';

test('public education preserves approved qualifications and accepts institution-only records', async () => {
  const content=await loadSiteContent();
  const institution=content.experience.education[0]!.institution;
  const approved={institution,qualification:{en:'Bachelor’s Degree',ar:'درجة البكالوريوس'}};
  const qualified={...content,experience:{...content.experience,education:[approved]}};
  assert.deepEqual(buildPublicProfile(qualified).education,[approved]);
  const institutionOnly={...content,experience:{...content.experience,education:[{institution}]}};
  assert.deepEqual(buildPublicProfile(institutionOnly).education,[{institution}]);
});

test('public exports share identity, locale routing and publication state', async () => {
  const content=await loadSiteContent(); const root=await mkdtemp(join(tmpdir(),'aimansour-exports-'));
  try {
    await publishExports(content,root);
    const bytes=await readFile(join(root,'profile.json'),'utf8');
    assert.equal(await readFile(join(root,'api/profile'),'utf8'),bytes);
    const profile=PublicProfileSchema.parse(JSON.parse(bytes));
    assert.equal(profile.schemaVersion,1); assert.ok(profile.alternateNames.includes('Abdallah Mansour'));
    assert.equal(profile.resume.language,'en');assert.equal(profile.resume.url,'https://aimansour.com/files/abdullah-mansour-cv.pdf');
    assert.ok(!('phone' in profile.contact));assert.equal(profile.id,'https://aimansour.com/#person');
    const changed=structuredClone(content);changed.metrics['zone10.contacts']!.display.en='351+';
    changed.projects.find(p=>p.id==='zone10')!.published=true;
    assert.match(renderPublicMarkdown(changed,getRoute('case:zone10','en')),/351\+/);
    const hidden=structuredClone(content);hidden.projects.forEach(p=>{p.published=false; p.summary.en='DRAFT_ONLY_SENTINEL';});
    hidden.documents.filter(d=>d.key.startsWith('case:')).forEach(d=>{d.draft=true;d.markdown='DRAFT_ONLY_SENTINEL';});
    await publishExports(hidden,root);
    assert.equal(buildPublicProfile(hidden).selectedWork.length,0);
    assert.ok(!(await readFile(join(root,'llms-full.txt'),'utf8')).includes('DRAFT_ONLY_SENTINEL'));
    assert.equal((await readdir(join(root,'work'))).filter(p=>p.endsWith('.md')).length,1);
    assert.equal(getRoute('work','ar').markdownPath,'/ar/work/index.md');
    assert.ok(!(await readFile(join(root,'sitemap.xml'),'utf8')).includes('/work/zone10/'));
  } finally {if(basename(root).startsWith('aimansour-exports-'))await rm(root,{recursive:true,force:true});}
});
