import type { Locale, SiteContent } from './contracts.ts';

export function resolveReferences(text: string, locale: Locale, content: SiteContent): string {
  return text.replace(/\{\{(metric|evidence|profile|experience):([^{}]+)\}\}/g, (_token, kind: string, key: string) => {
    let result: string | number | undefined;
    if (kind === 'metric') {
      result = content.metrics[key]?.display[locale];
      if (result === undefined && key.endsWith('.value')) result = content.metrics[key.slice(0, -6)]?.value;
    } else if (kind === 'evidence') {
      const match = key.match(/^(.+)\.(alt|caption|url)$/);
      const item = match ? content.evidence[match[1]!] : undefined;
      if (item && match) result = match[2] === 'url' ? item.publicPath : item[match[2] as 'alt' | 'caption'][locale];
    } else if (kind === 'profile') {
      if (key === 'name' || key === 'professionalTitle' || key === 'summary') result = content.profile[key][locale];
      if (key === 'email') result = content.profile.contact.email;
      if (key === 'responseTime') result = content.profile.contact.responseTime[locale];
    } else {
      const match = key.match(/^([^.]+)\.(organization|title|period|type|location)$/);
      const position = content.experience.positions.find(p => p.id === match?.[1]);
      if (position && match) result = position[match[2] as 'organization' | 'title' | 'period' | 'type' | 'location'][locale];
    }
    if (result === undefined) throw new Error(`Unknown ${kind} reference: ${key}`);
    return String(result);
  });
}
