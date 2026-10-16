import { locales, pageIds, type RouteKey, type Locale, type Route, type SiteContent } from '../content/contracts.ts';

export function getRoute(key: RouteKey, locale: Locale): Route {
  const prefix = locale === 'ar' ? '/ar' : '';
  const tail = key.startsWith('case:') ? `work/${key.slice(5)}` : key === 'home' ? '' : key === 'contact-thanks' ? 'contact/thanks' : key;
  const path = `${prefix}/${tail}${tail ? '/' : ''}`;
  const indexable = key !== 'contact-thanks' && key !== 'error';
  const markdownTail = key === 'home' ? 'index' : key === 'work' ? 'work/index' : tail;
  return { key, locale, path, markdownPath: indexable ? `${prefix}/${markdownTail}.md` : null, indexable };
}

export function getPublishedRoutes(content: SiteContent): Route[] {
  const keys: RouteKey[] = [...pageIds, ...content.projects.filter(p => p.published).map(p => `case:${p.id}` as const)];
  return keys.flatMap(key => locales.flatMap(locale => {
    const document = content.documents.find(d => d.key === key && d.locale === locale);
    return document && !document.draft ? [getRoute(key, locale)] : [];
  }));
}
