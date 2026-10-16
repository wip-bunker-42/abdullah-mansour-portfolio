import { mkdir, writeFile, rm } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { z } from 'zod';
import type { SiteContent, Route } from '../src/content/contracts.ts';
import { projectIds } from '../src/content/contracts.ts';
import { getPublishedRoutes, getRoute } from '../src/i18n/routes.ts';
import { buildPublicProfile, PublicProfileSchema } from '../src/lib/public-profile.ts';
import { resolveReferences } from '../src/content/references.ts';
const origin='https://aimansour.com';
const absolute=(path:string)=>new URL(path,origin).href;
function absoluteMarkdown(markdown:string,canonical:string):string {return markdown.replace(/(!?\[[^\]]*\]\()([^\s)]+)([^)]*\))/g,(_all,prefix:string,url:string,suffix:string)=>`${prefix}${url.startsWith('/')||url.startsWith('#')?new URL(url,canonical).href:url}${suffix}`);}
export function renderPublicMarkdown(content:SiteContent,route:Route):string {
  const doc=content.documents.find(d=>d.key===route.key&&d.locale===route.locale&&!d.draft);if(!doc||!route.indexable)throw Error('Cannot export unpublished document');
  const ar=route.locale==='ar';const locale=route.locale;
  const project=content.projects.find(p=>`case:${p.id}`===route.key&&p.published);
  let body=doc.markdown;
  const heading=(text:string)=>`\n\n## ${text}\n\n`;
  if(route.key==='home'||route.key==='work') body+=heading(ar?'الأعمال المنشورة':'Published work')+content.projects.filter(p=>p.published).sort((a,b)=>a.order-b.order).map(p=>`### [${p.name[locale]}](${absolute(getRoute(`case:${p.id}`,locale).path)})\n\n${p.summary[locale]}\n`).join('\n');
  if(route.key==='resume') body+=heading(ar?'الخبرة المهنية':'Professional experience')+content.experience.positions.map(p=>`### ${p.organization[locale]}\n\n${p.title[locale]}\n\n${p.period[locale]} · ${p.type[locale]}${p.location[locale]?` · ${p.location[locale]}`:''}\n\n${p.details[locale].map(text=>`- ${text}`).join('\n')}\n`).join('\n')+heading(ar?'المهارات':'Capabilities')+content.experience.capabilities.map(c=>`- **${c.name[locale]}:** ${c.scope[locale]}`).join('\n')+heading(ar?'شهادات مختارة':'Selected credentials')+content.experience.credentials.map(c=>`- ${c.name[locale]} — ${c.issuer}${c.date?` (${c.date})`:''}`).join('\n');
  if(project) body+=heading(ar?'المشروع في لمحة':'At a glance')+project.facts[locale].map(f=>`- **${f.label}:** ${f.value}`).join('\n')+heading(ar?'النتائج':'Results')+project.metricIds.map(id=>{const metric=content.metrics[id]!;return `- **${metric.display[locale]}:** ${metric.label[locale]}${metric.period?` (${metric.period[locale]})`:''}`;}).join('\n');
  if(route.key==='contact') body+=heading(ar?'التواصل':'Contact')+`${content.profile.contact.email}\n\n${content.profile.contact.responseTime[locale]}\n\n[LinkedIn](https://www.linkedin.com/in/aimansour/)\n`;
  if(['home','about','resume'].includes(route.key)) body+=`\n\n[${ar?'تنزيل السيرة بالإنجليزية — PDF':'Download English CV — PDF'}](${absolute(content.profile.resume.url)})\n`;
  return `${ar?'> اللغة: العربية':'> Language: English'}\n> Canonical: ${absolute(route.path)}\n> Updated: ${doc.updatedAt}\n\n${absoluteMarkdown(resolveReferences(body,locale,content),absolute(route.path))}\n`;
}
const xml=(text:string)=>text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
export async function publishExports(content:SiteContent,distDir:string):Promise<void> {
  const root=resolve(distDir); const write=async(path:string,value:string)=>{const target=resolve(root,`.${path}`);if(!target.startsWith(root))throw Error('Export outside output');await mkdir(dirname(target),{recursive:true});await writeFile(target,value);};
  // Remove previously generated case Markdown when called against an existing build.
  for(const id of projectIds)for(const locale of ['en','ar']as const)await rm(resolve(root,`.${getRoute(`case:${id}`,locale).markdownPath!}`),{force:true});
  const profile=JSON.stringify(buildPublicProfile(content),null,2)+'\n';
  await write('/profile.json',profile);await write('/api/profile',profile);
  const schema={...z.toJSONSchema(PublicProfileSchema),$id:absolute('/profile.schema.json'),title:'Abdullah Mansour public profile — version 1'};
  await write('/profile.schema.json',JSON.stringify(schema,null,2)+'\n');
  const routes=getPublishedRoutes(content);
  const entries=routes.map(route=>({route,doc:content.documents.find(d=>d.key===route.key&&d.locale===route.locale)!}));
  for(const {route}of entries)await write(route.markdownPath!,renderPublicMarkdown(content,route));
  const discovery='# Abdullah Mansour — AIMansour.\n\n> Digital Marketing & Growth Specialist based in Cairo, Egypt. English is the default language; Arabic is available for every primary page.\n\n## Public data\n\n- [Structured profile]('+absolute('/profile.json')+')\n- [Profile API]('+absolute('/api/profile')+')\n- [JSON Schema]('+absolute('/profile.schema.json')+')\n- [API description]('+absolute('/openapi.json')+')\n- [English CV — PDF]('+absolute(content.profile.resume.url)+')\n\n## Pages\n\n'+entries.map(({route,doc})=>`- [${doc.title} (${route.locale})](${absolute(route.markdownPath!)}): HTML ${absolute(route.path)}`).join('\n')+'\n';
  await write('/llms.txt',discovery);await write('/llms-full.txt',discovery+'\n\n'+entries.map(({route})=>'---\n\n'+renderPublicMarkdown(content,route)).join('\n\n'));
  await write('/robots.txt','User-agent: *\nAllow: /\n\nSitemap: '+absolute('/sitemap.xml')+'\n');
  await write('/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'+entries.map(({route,doc})=>`<url><loc>${xml(absolute(route.path))}</loc><lastmod>${doc.updatedAt}</lastmod>${(['en','ar','x-default']as const).map(locale=>`<xhtml:link rel="alternate" hreflang="${locale}" href="${xml(absolute(getRoute(route.key,locale==='ar'?'ar':'en').path))}"/>`).join('')}</url>`).join('\n')+'\n</urlset>\n');
  const statuses={'200':{description:'Accepted by the email service'},'400':{description:'Invalid form fields'},'403':{description:'Browser origin rejected'},'405':{description:'Use POST'},'413':{description:'Body exceeds 32768 bytes'},'415':{description:'Unsupported content type'},'429':{description:'Rate limited; Retry-After: 60'},'500':{description:'Internal error'},'502':{description:'Email service did not accept the message'}};
  const fields={name:{type:'string',minLength:1,maxLength:100},email:{type:'string',format:'email',maxLength:254},company:{type:'string',maxLength:160},topic:{type:'string',enum:['role','project','other'],default:'role'},message:{type:'string',minLength:1,maxLength:6000},locale:{type:'string',enum:['en','ar']},website:{type:'string',maxLength:0}};
  const contactSchema={type:'object',additionalProperties:false,required:['name','email','message','locale'],properties:fields};
  const responseProfile={description:'Public profile version 1',content:{'application/json':{schema:{$ref:absolute('/profile.schema.json')}}}};
  await write('/openapi.json',JSON.stringify({openapi:'3.1.0',info:{title:'AIMansour public interfaces',version:'1.0.0',description:'Public read resources and a contact form. No administrative API or authentication is provided.'},servers:[{url:origin}],paths:{'/profile.json':{get:{summary:'Read the public profile',responses:{'200':responseProfile}},head:{summary:'Read profile headers',responses:{'200':{description:'Same metadata as GET, without a body'}}}},'/api/profile':{get:{summary:'Read the same public profile',responses:{'200':responseProfile}},head:{summary:'Read profile headers',responses:{'200':{description:'Same metadata as GET, without a body'}}}},'/api/contact':{post:{summary:'Contact Abdullah Mansour',description:'Maximum body 32768 bytes. Three attempts per IP per 60 seconds at a Cloudflare location. No authentication. Browser origins must match the site. Native forms redirect 303 on acceptance. No visitor auto-reply.',requestBody:{required:true,content:{'application/json':{schema:contactSchema},'application/x-www-form-urlencoded':{schema:contactSchema}}},responses:{...statuses,'303':{description:'Native form accepted; localized thank-you redirect'}}}}}},null,2)+'\n');
  await write('/_redirects',routes.filter(r=>r.locale==='en').flatMap(r=>{const alias='/en'+r.path;return [`${alias} ${r.path} 301`,...(alias.endsWith('/')&&alias!=='/en/'?[`${alias.slice(0,-1)} ${r.path} 301`]:[])];}).join('\n')+'\n/en / 301\n');
}
