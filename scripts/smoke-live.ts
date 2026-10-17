import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {loadSiteContent} from '../src/content/read.ts';
import {getPublishedRoutes} from '../src/i18n/routes.ts';
import {PublicProfileSchema} from '../src/lib/public-profile.ts';
import {waitForPublicDns} from './wait-for-dns.ts';
import {verifyAnalyticsInstallation} from './analytics.ts';
const requireValue=(condition:unknown,message:string)=>{if(!condition)throw Error(message);};
export async function smokeLive(baseUrl:string):Promise<void> {
  const base=new URL(baseUrl);const content=await loadSiteContent();const routes=getPublishedRoutes(content);
  requireValue((await waitForPublicDns(new URL('/',base).href)).status===200,'Published homepage is unavailable');
  const get=(path:string,init:RequestInit={})=>fetch(new URL(path,base),{...init,signal:AbortSignal.timeout(20_000)});
  for(const route of routes) {
    const response=await get(route.path,{headers:{Accept:'text/html','User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/155.0.0.0 Safari/537.36'}});requireValue(response.status===200,`${route.path}: expected 200, got ${response.status}`);
    const html=await response.text();requireValue(html.includes(`lang="${route.locale}"`),`${route.path}: incorrect language`);
    requireValue(html.includes(`rel="canonical" href="https://aimansour.com${route.path}"`),`${route.path}: incorrect canonical`);
    verifyAnalyticsInstallation(html,base.hostname==='aimansour.com'?'production':'artifact');
    requireValue(!response.headers.get('content-security-policy')?.includes('unsafe-'),`${route.path}: unsafe CSP authorization`);
    requireValue(response.headers.get('content-security-policy')?.includes("object-src 'none'"),`${route.path}: CSP missing`);
    requireValue(response.headers.get('cache-control')?.includes('must-revalidate'),`${route.path}: expected revalidation`);
    const md=await get(route.markdownPath!);requireValue(md.status===200&&md.headers.get('content-type')?.includes('text/markdown'),`${route.path}: Markdown representation unavailable`);
  }
  const profile=await get('/profile.json');const profileBytes=await profile.text();const api=await get('/api/profile');
  requireValue(profile.status===200&&api.status===200&&await api.text()===profileBytes,'Public profile representations differ');PublicProfileSchema.parse(JSON.parse(profileBytes));
  for(const path of ['/profile.json','/api/profile','/profile.schema.json','/openapi.json','/ar/work/index.md','/llms.txt','/llms-full.txt']) {
    const response=await get(path);const head=await get(path,{method:'HEAD'});
    requireValue(response.status===200&&head.status===200,`${path}: GET/HEAD unavailable`);
    requireValue(response.headers.get('access-control-allow-origin')==='*',`${path}: missing read CORS`);
    requireValue(response.headers.get('etag')&&response.headers.get('etag')===head.headers.get('etag'),`${path}: GET/HEAD ETag mismatch`);
    requireValue((await get(path,{headers:{'If-None-Match':response.headers.get('etag')!}})).status===304,`${path}: conditional GET must return 304`);
  }
  for(const [path,locale]of [['/__missing-portfolio-check__/','en'],['/ar/__missing-portfolio-check__/','ar'],['/en/__missing-portfolio-check__/','en'],['/api/__missing-portfolio-check__','en'],['/.generated/contact-shells.json','en']]) {
    const response=await get(path!);requireValue(response.status===404,`${path}: expected real 404`);requireValue((await response.text()).includes(`lang="${locale}"`),`${path}: incorrect recovery language`);
  }
  const alias=await get('/en/work/',{redirect:'manual'});requireValue(alias.status===301&&new URL(alias.headers.get('location')!,base).pathname==='/work/','Known English alias must return 301');
  for(const path of ['/error/','/ar/contact/thanks/'])requireValue((await get(path)).headers.get('x-robots-tag')?.includes('noindex'),`${path}: missing utility noindex`);
  const robots=await(await get('/robots.txt')).text();requireValue(robots.includes('User-agent: *')&&robots.includes('Allow: /')&&!/Disallow:\s*\/|ai-train=no/i.test(robots),'Crawler access is restricted');
  const sitemap=await(await get('/sitemap.xml')).text();requireValue((sitemap.match(/<url>/g)??[]).length===routes.length,'Sitemap publication count mismatch');
  for(const agent of ['Googlebot','GPTBot','ClaudeBot','OAI-SearchBot'])requireValue((await get('/about/',{headers:{'User-Agent':agent}})).status===200,`${agent}: public read blocked`);
  const cv=await get('/files/abdullah-mansour-cv.pdf',{method:'HEAD'});requireValue(cv.status===200&&cv.headers.get('content-type')?.includes('application/pdf')&&cv.headers.get('content-disposition')?.includes('Abdullah-Mansour-CV.pdf'),'CV download headers invalid');
  if(base.hostname==='aimansour.com') {
    requireValue(base.protocol==='https:','Production must use HTTPS');
    const www=await fetch('https://www.aimansour.com/ar/work/zone10/?ref=launch-check',{redirect:'manual',signal:AbortSignal.timeout(20_000)});
    requireValue([301,308].includes(www.status)&&www.headers.get('location')==='https://aimansour.com/ar/work/zone10/?ref=launch-check','www redirect must preserve path and query');
    const http=await fetch('http://aimansour.com/about/?ref=launch-check',{redirect:'manual',signal:AbortSignal.timeout(20_000)});
    requireValue([301,308].includes(http.status)&&http.headers.get('location')==='https://aimansour.com/about/?ref=launch-check','HTTP must redirect to the HTTPS apex');
  }
  console.log(`Read-only smoke checks passed on ${base.origin}: ${routes.length} primary pages, Markdown, profile/schema, headers, crawlers, downloads and localized recovery${base.hostname==='aimansour.com'?', HTTPS/www canonicalization':''}.`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)await smokeLive(process.argv[2]??'https://aimansour.com');
