import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {loadSiteContent} from '../../src/content/read.ts';
import {getPublishedProjects} from '../../src/content/publication.ts';
const firstCase=getPublishedProjects(await loadSiteContent())[0];
const sampleCase=firstCase?`/work/${firstCase.id}/`:'/work/';

for(const sample of [{path:'/',theme:'dark',width:1440},{path:'/ar/about/',theme:'light',width:390},{path:sampleCase,theme:'light',width:1440},{path:'/ar/contact/',theme:'dark',width:390}]) {
  test(`accessible representative: ${sample.path} ${sample.theme}`,async({page})=>{
    await page.setViewportSize({width:sample.width,height:1000});
    await page.addInitScript(theme=>localStorage.setItem('aimansour-theme',theme),sample.theme);
    await page.goto(sample.path);await page.evaluate(()=>document.fonts.ready);
    const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
    expect(result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  });
}
test('representative templates reflow at narrow, tablet and desktop widths',async({page})=>{
  for(const path of ['/','/ar/about/','/resume/',sampleCase,'/ar/contact/'])for(const width of [320,768,1440]) {
    await page.setViewportSize({width,height:1000});await page.goto(path);await page.evaluate(()=>document.fonts.ready);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${path} at ${width}px`).toBe(true);
  }
  await page.setViewportSize({width:768,height:1000});await page.goto('/ar/contact/');
  await page.evaluate(()=>document.documentElement.style.fontSize='200%');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Contact at 200% text size').toBe(true);
});
test('keyboard users reach main content and Arabic form errors have linked recovery',async({page})=>{
  await page.setViewportSize({width:390,height:1000});await page.goto('/ar/contact/');
  await page.keyboard.press('Tab');await expect(page.locator('.skip-link')).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('main')).toBeFocused();
  const menu=page.locator('.mobile-menu summary');await menu.focus();await page.keyboard.press('Enter');await expect(page.locator('.mobile-menu')).toHaveAttribute('open','');await page.keyboard.press('Escape');await expect(menu).toBeFocused();
  await page.getByRole('button',{name:'إرسال الرسالة'}).click();await expect(page.locator('#contact-errors')).toBeFocused();
  await page.locator('#contact-errors a[href="#email"]').click();await expect(page.locator('#email')).toBeFocused();await expect(page.locator('#email')).toHaveAttribute('aria-describedby','email-error');
});
test('reduced-motion readers reach a case section without animated scrolling',async({page})=>{
  test.skip(!firstCase,'The controlled published fixture retains case navigation coverage.');
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto(sampleCase);
  const link=page.locator('.case-contents a').first();const href=await link.getAttribute('href');await link.click();
  const top=await page.locator(href!).evaluate(element=>element.getBoundingClientRect().top);
  expect(top).toBeGreaterThanOrEqual(0);expect(top).toBeLessThan((await page.evaluate(()=>innerHeight))/2);
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  expect(await page.locator(href!).evaluate(element=>element.getBoundingClientRect().top)).toBeCloseTo(top,0);
});
