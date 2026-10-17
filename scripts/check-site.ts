import { readFile, access } from 'node:fs/promises';
import { resolve, join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { parse, type DefaultTreeAdapterMap } from 'parse5';
import { loadSiteContent } from '../src/content/read.ts';
import { getPublishedRoutes, getRoute } from '../src/i18n/routes.ts';
import { PublicProfileSchema } from '../src/lib/public-profile.ts';
import { walkFiles } from './files.ts';
type Element=DefaultTreeAdapterMap['element'];
function elements(node:DefaultTreeAdapterMap['node']):Element[] {return [('tagName'in node?[node]:[]),...('childNodes'in node?node.childNodes.map(elements):[])].flat();}
const attr=(node:Element,key:string)=>node.attrs.find(a=>a.name===key)?.value;
const expect=(condition:unknown,message:string)=>{if(!condition)throw Error(message);};
export async function checkSite(distDir:string,{allowMissingCv=false}:{allowMissingCv?:boolean}={}):Promise<void> {
  const root=resolve(distDir);const content=await loadSiteContent();const routes=getPublishedRoutes(content);const files=await walkFiles(root);const titleSet=new Set<string>();const descriptionSet=new Set<string>();const inlineStyles=new Set<string>();
  const headers=await readFile(join(root,'_headers'),'utf8');expect(!headers.includes('unsafe-eval')&&!headers.includes('unsafe-inline'),'CSP contains unsafe script/style authorization');
  const robots=await readFile(join(root,'robots.txt'),'utf8');expect(robots.includes('User-agent: *\nAllow: /'),'Robots does not allow all crawlers');expect(!/^Disallow:\s*\//m.test(robots),'Robots includes a crawl block');
  const sitemap=await readFile(join(root,'sitemap.xml'),'utf8');
  const artifact=(url:URL)=>resolve(root,`.${decodeURIComponent(url.pathname)}`,url.pathname.endsWith('/')?'index.html':'');
  for(const route of routes) {
    const path=join(root,route.path,'index.html');const html=await readFile(path,'utf8');const nodes=elements(parse(html));const find=(tag:string)=>nodes.filter(n=>n.tagName===tag);
    expect(find('h1').length===1,`${route.path}: expected one H1`);
    expect(!nodes.some(node=>attr(node,'style')),`${route.path}: inline styles would be blocked by CSP`);
    expect(attr(find('html')[0]!,'lang')===route.locale&&attr(find('html')[0]!,'dir')===(route.locale==='ar'?'rtl':'ltr'),`${route.path}: wrong language/direction`);
    const canonical=find('link').find(n=>attr(n,'rel')==='canonical');expect(canonical&&attr(canonical,'href')===content.profile.url.replace(/\/$/,'')+route.path,`${route.path}: canonical mismatch`);
    for(const language of ['en','ar','x-default']as const)expect(find('link').some(n=>attr(n,'hreflang')===language&&attr(n,'href')===new URL(getRoute(route.key,language==='ar'?'ar':'en').path,content.profile.url).href),`${route.path}: missing reciprocal ${language}`);
    const title=html.match(/<title>(.*?)<\/title>/)?.[1];const description=find('meta').find(n=>attr(n,'name')==='description');
    expect(title&&!titleSet.has(title),`${route.path}: missing/duplicate title`);titleSet.add(title!);const desc=description&&attr(description,'content');expect(desc&&!descriptionSet.has(desc),`${route.path}: missing/duplicate description`);descriptionSet.add(desc!);
    expect(sitemap.includes(`<loc>${new URL(route.path,content.profile.url).href}</loc>`),`${route.path}: absent from sitemap`);
    expect(find('link').some(n=>attr(n,'type')==='text/markdown'&&attr(n,'href')===new URL(route.markdownPath!,content.profile.url).href),`${route.path}: missing Markdown alternate`);
    expect(find('script').filter(n=>attr(n,'src')?.includes('static.cloudflareinsights.com')).length===1,`${route.path}: Analytics must occur once`);
    const ld=find('script').find(n=>attr(n,'type')==='application/ld+json');expect(ld,`${route.path}: missing JSON-LD`);
    const graph=JSON.parse(ld!.childNodes.map(n=>'value'in n?n.value:'').join(''))['@graph'] as Array<Record<string,unknown>>;
    expect(graph.some(n=>n['@type']==='Person'&&n['@id']==='https://aimansour.com/#person'),`${route.path}: unstable person identity`);
    for(const script of find('script').filter(n=>!attr(n,'src'))) {const source=script.childNodes.map(n=>'value'in n?n.value:'').join('');expect(headers.includes(createHash('sha256').update(source).digest('base64')),`${route.path}: inline script missing CSP hash`);}
    for(const style of find('style')) {const source=style.childNodes.map(n=>'value'in n?n.value:'').join('');inlineStyles.add(source);expect(headers.includes(createHash('sha256').update(source).digest('base64')),`${route.path}: inline stylesheet missing CSP hash`);}
    const forbidden=content.profile.profiles.filter(p=>!p.visible).map(p=>p.url);
    for(const link of find('a')) {const href=attr(link,'href')??'';expect(!forbidden.includes(href),`${route.path}: hidden profile action is visible`);expect(!/^(tel:|https?:\/\/(wa\.me|api\.whatsapp\.com))/.test(href),`${route.path}: disallowed contact action`);}
    const urls=[...find('a').map(n=>attr(n,'href')),...find('img').map(n=>attr(n,'src')),...find('script').map(n=>attr(n,'src')),...find('link').filter(n=>['stylesheet','icon','preload'].includes(attr(n,'rel')??'')).map(n=>attr(n,'href')),...find('meta').filter(n=>attr(n,'property')==='og:image').map(n=>attr(n,'content'))].filter((url):url is string=>Boolean(url));
    for(const href of urls) {
      const url=new URL(href,new URL(route.path,content.profile.url));if(url.origin!==new URL(content.profile.url).origin)continue;
      if(url.pathname===content.profile.resume.url&&allowMissingCv)continue;
      const target=artifact(url);expect(!relative(root,target).startsWith('..'),`${route.path}: asset escapes build`);
      try{await access(target);}catch{throw Error(`${route.path}: missing local link/asset ${url.pathname}`);}
      if(url.hash&&target.endsWith('.html')) {const targetHtml=target===path?html:await readFile(target,'utf8');expect(elements(parse(targetHtml)).some(n=>attr(n,'id')===decodeURIComponent(url.hash.slice(1))),`${route.path}: missing fragment ${url.pathname}${url.hash}`);}
    }
  }
  expect((sitemap.match(/<url>/g)??[]).length===routes.length,'Sitemap includes extra/missing pages');expect(!/contact\/thanks|\/error\//.test(sitemap),'Utility pages leaked into sitemap');
  const profile=await readFile(join(root,'profile.json'),'utf8');PublicProfileSchema.parse(JSON.parse(profile));expect(await readFile(join(root,'api/profile'),'utf8')===profile,'Profile representations differ');
  for(const path of files.filter(p=>/\.(html|json|md|txt|js|css|xml)$/.test(p))) {
    const body=await readFile(path,'utf8');expect(!/\{\{(?:metric|profile|experience|evidence):/.test(body),`${relative(root,path)}: unresolved content reference`);
    expect(!/CLOUDFLARE_API_TOKEN|BEGIN (RSA |OPENSSH )?PRIVATE KEY|DRAFT_ONLY_SENTINEL|beforeForm|afterForm/.test(body),`${relative(root,path)}: private material in public output`);
  }
  for(const path of [join(root,'404.html'),join(root,'ar/404.html')]) {const html=await readFile(path,'utf8');expect(/name="robots" content="noindex"/.test(html),'404 document lacks noindex');}
  if(!allowMissingCv)await access(join(root,content.profile.resume.url));
  const css=files.filter(p=>p.endsWith('.css'));const js=files.filter(p=>p.endsWith('.js'));let cssBytes=0,jsBytes=0;
  for(const path of css)cssBytes+=gzipSync(await readFile(path)).length;for(const path of js)jsBytes+=gzipSync(await readFile(path)).length;
  for(const source of inlineStyles)cssBytes+=gzipSync(source).length;
  expect(cssBytes<=30*1024,`Own CSS budget exceeded: ${cssBytes} gzip bytes`);expect(jsBytes<=20*1024,`Own JS budget exceeded: ${jsBytes} gzip bytes`);
  console.log(`Artifact contracts pass: ${routes.length} primary pages; CSS ${cssBytes} / JS ${jsBytes} gzip bytes${allowMissingCv?' (CV existence deferred until authoring)':''}.`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)await checkSite('dist',{allowMissingCv:process.argv.includes('--allow-missing-cv')});
