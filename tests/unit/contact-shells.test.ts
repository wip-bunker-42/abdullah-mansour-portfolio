import test from 'node:test';
import assert from 'node:assert/strict';
import { buildContactShells } from '../../scripts/build-contact-shells.ts';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, basename } from 'node:path';

test('private error shells preserve full localized documents and reject ambiguous markers', async () => {
  const root = await mkdtemp(join(tmpdir(),'aimansour-shell-test-'));
  try {
    for (const locale of ['en','ar']) {
      const dir=join(root,locale==='ar'?'ar/contact':'contact');await mkdir(dir,{recursive:true});
      await writeFile(join(dir,'index.html'),`<!doctype html><html lang="${locale}"><head><link href="/style.css" rel="stylesheet"></head><body><main><!-- contact-form:start --><form>old form</form><!-- contact-form:end --></main><footer>footer</footer></body></html>`);
    }
    const shells=await buildContactShells(root);
    assert.match(shells.ar.beforeForm,/lang="ar"/);assert.match(shells.en.beforeForm,/name="robots" content="noindex"/);
    assert.match(shells.ar.afterForm,/<footer>footer<\/footer>/);assert.ok(!JSON.stringify(shells).includes('old form'));
    await writeFile(join(root,'contact/index.html'),'<html>missing markers</html>');
    await assert.rejects(buildContactShells(root),/markers/);
  } finally {if(basename(root).startsWith('aimansour-shell-test-'))await rm(root,{recursive:true,force:true});}
});
