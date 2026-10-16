import type { Project, SiteContent } from './contracts.ts';

export function getPublishedProjects(content: SiteContent): Project[] {
  return content.projects.filter(p => p.published).sort((a,b) => a.order - b.order);
}
