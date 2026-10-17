import { test, expect } from '@playwright/test';
import { loadSiteContent } from '../../src/content/read.ts';
import { getPublishedProjects } from '../../src/content/publication.ts';
const projects=getPublishedProjects(await loadSiteContent());
const evidenceCase=projects.find(p=>p.evidenceIds.length>0);

test('work exposes the published selection or useful empty-state actions', async ({ page }) => {
  await page.goto('/work/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('main article.work-row')).toHaveCount(projects.length);
  if(!projects.length){await expect(page.locator('.empty-work a[href="/contact/"]')).toBeVisible();return;}
  await page.locator('article.work-row').first().getByRole('link', { name: /inside the project/i }).click();
  await expect(page).toHaveURL(`/work/${projects[0]!.id}/`);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('evidence dialog closes with Escape and restores its opener', async ({ page }) => {
  test.skip(!evidenceCase,'No live case evidence; the controlled publication fixture covers this interaction.');
  await page.goto(`/work/${evidenceCase!.id}/`);
  const trigger = page.locator('[data-evidence-trigger]').first();
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('button', { name: /close/i })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('evidence has a direct-image fallback without JavaScript', async ({ browser }) => {
  test.skip(!evidenceCase,'No live case evidence; the controlled publication fixture covers the fallback.');
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`/ar/work/${evidenceCase!.id}/`);
  const link = page.locator('[data-evidence-trigger]').first();
  await expect(link).toHaveAttribute('href', /\/media\/evidence\/.+\.png$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await context.close();
});
