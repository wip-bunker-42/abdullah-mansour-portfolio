import { test, expect } from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

test('recruiter journey and localized recovery lead to useful destinations', async ({ page }) => {
  await page.goto('/');
  const selected=page.locator('[data-selected-work] article');
  if(await selected.count())await selected.first().getByRole('link', { name: /inside the project/i }).click();
  await page.locator('.desktop-nav').getByRole('link', { name: 'Experience' }).click();
  await expect(page).toHaveURL('/resume/');
  await expect(page.locator('main').getByRole('link', { name: /download english cv/i })).toHaveAttribute('href', '/files/abdullah-mansour-cv.pdf');
  await expect(page.locator('main a[href="/contact/"]').first()).toBeVisible();
  await page.locator('main a[href="/contact/"]').first().click();
  await expect(page.locator('[data-contact-form]')).toBeVisible();
  await page.goto('/ar/resume/');
  await expect(page.locator('main').getByRole('link', { name: 'تنزيل السيرة بالإنجليزية — PDF' })).toHaveAttribute('href', '/files/abdullah-mansour-cv.pdf');
  // Astro reserves the root 404.html; the Arabic source route is materialized
  // as ar/404.html for closest-locale Workers routing by the export step.
  for (const path of ['/error/', '/ar/error/', '/contact/thanks/', '/ar/contact/thanks/', '/404.html', '/ar/404/']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    const prefix = path.startsWith('/ar/') ? '/ar' : '';
    await expect(page.locator(`main a[href="${prefix}/work/"]`)).toBeVisible();
    await expect(page.locator(`main a[href="${prefix}/contact/"]`)).toBeVisible();
  }
});
test('both languages download the same replaceable English CV',async({page})=>{
  const expected=createHash('sha256').update(await readFile('public/files/abdullah-mansour-cv.pdf')).digest('hex');
  for(const path of ['/resume/','/ar/resume/']) {
    await page.goto(path);const wait=page.waitForEvent('download');
    await page.locator('main a[href="/files/abdullah-mansour-cv.pdf"]').click();const download=await wait;
    expect(download.suggestedFilename()).toBe('Abdullah-Mansour-CV.pdf');
    expect(createHash('sha256').update(await readFile((await download.path())!)).digest('hex')).toBe(expected);
  }
});
