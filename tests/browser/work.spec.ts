import { test, expect } from '@playwright/test';

test('work exposes five useful case destinations', async ({ page }) => {
  await page.goto('/work/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('main article.work-row')).toHaveCount(5);
  await page.locator('article.work-row').first().getByRole('link', { name: /inside the project/i }).click();
  await expect(page).toHaveURL('/work/zone10/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Zone10');
});

test('evidence dialog closes with Escape and restores its opener', async ({ page }) => {
  await page.goto('/work/zone10/');
  const trigger = page.locator('[data-evidence-trigger]').first();
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('button', { name: /close/i })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('evidence has a direct-image fallback without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/ar/work/zone10/');
  const link = page.locator('[data-evidence-trigger]').first();
  await expect(link).toHaveAttribute('href', /\/media\/evidence\/zone10\/.+\.png$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await context.close();
});
