import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteContent } from '../../src/content/read.ts';
import { getPublishedRoutes, getRoute } from '../../src/i18n/routes.ts';
import { buildSeo } from '../../src/lib/seo.ts';

test('all primary pages have reciprocal locale metadata and stable person identity', async () => {
  const content=await loadSiteContent(); const titles=new Set(); const descriptions=new Set();
  for(const route of getPublishedRoutes(content)) {
    const document=content.documents.find(d=>d.key===route.key&&d.locale===route.locale)!;
    const seo=buildSeo(content,route,document);
    assert.equal(seo.canonical,'https://aimansour.com'+route.path);
    assert.equal(seo.alternates.en,'https://aimansour.com'+getRoute(route.key,'en').path);
    assert.equal(seo.alternates.ar,'https://aimansour.com'+getRoute(route.key,'ar').path);
    assert.equal(seo.alternates['x-default'],seo.alternates.en);
    const person=seo.jsonLd['@graph'].find(item=>item['@type']==='Person')!;
    assert.equal(person['@id'],'https://aimansour.com/#person');assert.ok(!('telephone' in person));
    assert.match(seo.og.image,/^https:\/\/aimansour.com\/social\/.+\.png$/);
    titles.add(seo.title);descriptions.add(seo.description);
  }
  assert.equal(titles.size,24);assert.equal(descriptions.size,24);
});
