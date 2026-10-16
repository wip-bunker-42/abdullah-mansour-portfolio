import { test, expect } from '@playwright/test';

test('language navigation opens the same page with correct direction', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('link', { name: 'العربية', exact: true }).first().click();
  await expect(page).toHaveURL('/ar/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('link', { name: 'English', exact: true }).first()).toHaveAttribute('href', '/');
});

test('an explicit light preference survives a new page load', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /light mode/i }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('denied storage preserves the dark default and a working theme control', async ({ context, page }) => {
  await context.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('Storage unavailable'); };
    Storage.prototype.setItem = () => { throw new Error('Storage unavailable'); };
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: /light mode/i }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('mobile navigation works by keyboard without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/');
  const menu = page.getByText('Menu', { exact: true });
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Work', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await context.close();
});
