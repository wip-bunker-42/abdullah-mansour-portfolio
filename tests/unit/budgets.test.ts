import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {join,basename} from 'node:path';
import {tmpdir} from 'node:os';
import {randomBytes} from 'node:crypto';
import {getPublishedRoutes} from '../../src/i18n/routes.ts';
import {loadSiteContent} from '../../src/content/read.ts';
import {checkBudgets} from '../../scripts/check-budgets.ts';
test('page budgets include imported enhancement chunks',async()=>{
  const root=await mkdtemp(join(tmpdir(),'aimansour-budget-'));
  try {
    await mkdir(join(root,'_astro'),{recursive:true});await writeFile(join(root,'_astro/entry.js'),'import "./shared.js";');
    await writeFile(join(root,'_astro/shared.js'),'export const message="small enhancement";');
    for(const route of getPublishedRoutes(await loadSiteContent())) {const dir=join(root,route.path);await mkdir(dir,{recursive:true});await writeFile(join(dir,'index.html'),'<script type="module" src="/_astro/entry.js"></script>');}
    await checkBudgets(root);
    await writeFile(join(root,'_astro/shared.js'),`export const oversized="${randomBytes(40000).toString('base64')}";`);
    await assert.rejects(checkBudgets(root),/JavaScript.*exceeds budget/);
  } finally {if(basename(root).startsWith('aimansour-budget-'))await rm(root,{recursive:true,force:true});}
});

test('page budgets include critical CSS embedded in the document',async()=>{
  const root=await mkdtemp(join(tmpdir(),'aimansour-budget-'));
  try {
    for(const route of getPublishedRoutes(await loadSiteContent())){const dir=join(root,route.path);await mkdir(dir,{recursive:true});await writeFile(join(dir,'index.html'),`<style>body{--oversized:"${randomBytes(40000).toString('base64')}"}</style>`);}
    await assert.rejects(checkBudgets(root),/CSS.*exceeds budget/);
  } finally {if(basename(root).startsWith('aimansour-budget-'))await rm(root,{recursive:true,force:true});}
});
