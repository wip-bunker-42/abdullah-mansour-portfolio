import type { SiteContent, Route, LocalizedDocument } from '../content/contracts.ts';
import { getRoute } from '../i18n/routes.ts';
type JsonLdNode = Record<string,unknown> & {'@id'?:string;'@type':string};
export interface SeoMetadata {
  title:string;description:string;canonical:string;alternates:Record<'en'|'ar'|'x-default',string>;
  og:{image:string;alt:string;locale:string};jsonLd:{'@context':string;'@graph':JsonLdNode[]};
}
export function buildSeo(content:SiteContent,route:Route,document:Pick<LocalizedDocument,'title'|'description'|'heading'|'updatedAt'>):SeoMetadata {
  const base=content.profile.url;const absolute=(path:string)=>new URL(path,base).href;const canonical=absolute(route.path);
  const project=content.projects.find(p=>`case:${p.id}`===route.key);
  const person:JsonLdNode={'@type':'Person','@id':absolute('/#person'),name:content.profile.name.en,alternateName:content.profile.alternateNames,url:base,jobTitle:content.profile.professionalTitle.en,description:content.profile.summary.en,email:content.profile.contact.email,image:absolute('/social/social-en.png'),address:{'@type':'PostalAddress',addressLocality:content.profile.location.city.en,addressCountry:content.profile.location.countryCode},sameAs:content.profile.profiles.map(p=>p.url)};
  const website:JsonLdNode={'@type':'WebSite','@id':absolute('/#website'),url:base,name:'AIMansour. — Abdullah Mansour',inLanguage:['en','ar'],publisher:{'@id':person['@id']}};
  const page:JsonLdNode={'@type':route.key==='home'||route.key==='about'?'ProfilePage':route.key.startsWith('case:')?'Article':'WebPage','@id':`${canonical}#page`,url:canonical,name:document.title,description:document.description,inLanguage:route.locale,dateModified:document.updatedAt,isPartOf:{'@id':website['@id']},author:{'@id':person['@id']},...(route.key==='home'||route.key==='about'?{mainEntity:{'@id':person['@id']}}:{about:{'@id':person['@id']}})};
  const graph=[person,website,page];
  if(route.key!=='home') {
    const items=[{name:route.locale==='ar'?'الرئيسية':'Home',item:absolute(getRoute('home',route.locale).path)},...(project?[{name:route.locale==='ar'?'الأعمال':'Work',item:absolute(getRoute('work',route.locale).path)}]:[]),{name:project?.name[route.locale]??document.heading,item:canonical}];
    graph.push({'@type':'BreadcrumbList',itemListElement:items.map((item,index)=>({'@type':'ListItem',position:index+1,...item}))});
  }
  return {title:document.title,description:document.description,canonical,alternates:{en:absolute(getRoute(route.key,'en').path),ar:absolute(getRoute(route.key,'ar').path),'x-default':absolute(getRoute(route.key,'en').path)},og:{image:absolute(project?.og[route.locale]??`/social/social-${route.locale}.png`),alt:project?.headline[route.locale]??content.profile.name[route.locale],locale:route.locale==='ar'?'ar_EG':'en_US'},jsonLd:{'@context':'https://schema.org','@graph':graph}};
}
export function serializeJsonLd(value:unknown):string {return JSON.stringify(value).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');}
