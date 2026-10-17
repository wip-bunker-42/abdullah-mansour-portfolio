import {test,expect} from '@playwright/test';
import {loadSiteContent} from '../../src/content/read.ts';
const evidenceCase=(await loadSiteContent()).projects.find(p=>p.published&&p.evidenceIds.length>0);
test('public profile and Markdown support consistent GET/HEAD and revalidation',async({request})=>{
  const profile=await request.get('/profile.json');const api=await request.get('/api/profile');expect(profile.status()).toBe(200);expect(api.status()).toBe(200);expect(await api.text()).toBe(await profile.text());
  for(const path of ['/profile.json','/api/profile','/profile.schema.json','/openapi.json','/ar/about.md','/llms.txt']) {
    const get=await request.get(path);const head=await request.head(path);expect(get.status()).toBe(200);expect(head.status()).toBe(200);expect(await head.body()).toHaveLength(0);
    expect(get.headers()['content-type']).toMatch(path.endsWith('.md')?/text\/markdown/:path.endsWith('.txt')?/text\/plain/:/application\/json/);
    expect(get.headers()['access-control-allow-origin']).toBe('*');expect(head.headers().etag).toBe(get.headers().etag);expect(get.headers().etag).toBeTruthy();
    expect((await request.get(path,{headers:{'If-None-Match':get.headers().etag!}})).status()).toBe(304);
  }
});
test('unknown addresses remain localized 404 and only known English aliases redirect',async({request})=>{
  for(const [path,lang]of [['/not-a-page/','en'],['/ar/not-a-page/','ar'],['/en/not-a-page/','en'],['/api/missing','en'],['/.generated/contact-shells.json','en']]) {
    const response=await request.get(path!);expect(response.status()).toBe(404);expect(await response.text()).toContain(`lang="${lang}"`);
  }
  const alias=await request.get('/en/work/',{maxRedirects:0});expect(alias.status()).toBe(301);expect(alias.headers().location).toBe('/work/');
  for(const path of ['/error/','/ar/contact/thanks/'])expect((await request.get(path)).headers()['x-robots-tag']).toContain('noindex');
  for(const userAgent of ['Googlebot','GPTBot','ClaudeBot','OAI-SearchBot'])expect((await request.get('/about/',{headers:{'User-Agent':userAgent}})).status()).toBe(200);
});
test('CSP permits theme, contact and evidence essentials without unsafe inline execution',async({page})=>{
  const violations:string[]=[];await page.exposeFunction('recordViolation',(directive:string)=>violations.push(directive));
  await page.addInitScript(()=>document.addEventListener('securitypolicyviolation',event=>(window as unknown as {recordViolation:(value:string)=>void}).recordViolation(event.violatedDirective)));
  await page.goto('/contact/');await page.getByRole('button',{name:/switch to light/i}).click();await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  if(evidenceCase){await page.goto(`/work/${evidenceCase.id}/`);await page.locator('[data-evidence-trigger]').first().click();await expect(page.getByRole('dialog')).toBeVisible();}expect(violations).toEqual([]);
});
test('native Worker errors preserve the full Arabic page with security headers',async({request})=>{
  const response=await request.post('/api/contact',{form:{locale:'ar',name:'<script>example</script>',email:'invalid',message:'رسالة تجريبية',website:'',topic:'role'}});
  expect(response.status()).toBe(400);expect(response.headers()['x-robots-tag']).toContain('noindex');expect(response.headers()['content-security-policy']).toContain("object-src 'none'");
  const html=await response.text();expect(html).toContain('lang="ar"');expect(html).toContain('&lt;script&gt;example');expect(html).toContain('data-contact-form');expect(html).toContain('site-footer');
});
test('the production hostname does not accept a local browser origin',async({request})=>{
  const response=await request.post('/api/contact',{headers:{Host:'aimansour.com',Origin:'http://localhost:8787'},data:{}});
  expect(response.status()).toBe(403);
});
