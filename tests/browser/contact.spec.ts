import { test, expect } from '@playwright/test';

test('copy denial keeps a selectable direct email link and useful fallback', async ({page}) => {
  await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw Error('denied');}}}));
  await page.goto('/contact/');
  await page.getByRole('button',{name:'Copy email',exact:true}).click();
  await expect(page.locator('[data-copy-status]')).toContainText('Select the email address');
  await expect(page.locator('.contact-email a')).toHaveAttribute('href','mailto:abdullahmansour.marketing@gmail.com');
});

test('Arabic delivery failure retains input, focuses recovery and prevents concurrent sends', async ({ page }) => {
  let submissions = 0;
  let finish: (() => void) | undefined;
  await page.route('**/api/contact', async route => {
    submissions++;
    await new Promise<void>(resolve => { finish = resolve; });
    await route.fulfill({ status:502, contentType:'application/json', body:JSON.stringify({ok:false,code:'delivery'}) });
  });
  await page.goto('/ar/contact/');
  await page.getByLabel('اسمك', { exact:true }).fill('متخصص توظيف');
  await page.getByLabel('البريد الإلكتروني', { exact:true }).fill('recruiter@example.com');
  await page.getByLabel('رسالتك', { exact:true }).fill('نود مناقشة فرصة في التسويق.');
  const send = page.getByRole('button', { name:'إرسال الرسالة' });
  await send.click();
  await expect(page.getByRole('button', { name:'جارٍ الإرسال…' })).toBeDisabled();
  await expect.poll(() => submissions).toBe(1);
  finish!();
  await expect(page.locator('#contact-errors')).toBeFocused();
  await expect(page.getByLabel('رسالتك', { exact:true })).toHaveValue('نود مناقشة فرصة في التسويق.');
  await page.unroute('**/api/contact');
  await page.route('**/api/contact', route => route.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'}));
  await send.click();
  await expect(page.getByRole('status').filter({hasText:'سأرد عليك خلال ساعات.'})).toBeVisible();
});

test('form submits a valid native request without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({javaScriptEnabled:false});
  const page = await context.newPage();
  let body = '';
  await page.route('**/api/contact', async route => {
    body = route.request().postData() ?? '';
    await route.fulfill({status:303,headers:{Location:'/contact/thanks/'}});
  });
  await page.goto('/contact/');
  await page.getByLabel('Your name', {exact:true}).fill('A recruiter');
  await page.getByLabel('Email address', {exact:true}).fill('recruiter@example.com');
  await page.getByLabel('Your message', {exact:true}).fill('Let’s discuss a role.');
  await page.getByRole('button', {name:'Send message'}).click();
  await expect(page).toHaveURL('/contact/thanks/');
  await expect(page.locator('main')).toContainText('I’ll reply within hours.');
  expect(new URLSearchParams(body).get('locale')).toBe('en');
  await context.close();
});
