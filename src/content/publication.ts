import type { Project, SiteContent } from './contracts.ts';
import { fromMarkdown } from 'mdast-util-from-markdown';
import type { RootContent } from 'mdast';
import { getRoute } from '../i18n/routes.ts';

export function getPublishedProjects(content: SiteContent): Project[] {
  return content.projects.filter(p => p.published).sort((a,b) => a.order - b.order);
}

// Keep historical mentions readable when a case is withdrawn, without linking to a 404.
// Source positions preserve the author's formatting, tables and evidence exactly.
export function publicationAwareMarkdown(markdown: string, content: SiteContent): string {
  const hidden = new Set(content.projects.filter(p => !p.published).flatMap(p => (['en', 'ar'] as const).flatMap(locale => {
    const route = getRoute(`case:${p.id}`, locale);
    return [route.path, route.path.slice(0, -1), route.markdownPath!];
  })));
  const tree = fromMarkdown(markdown);
  const definitions = new Map<string, string>();
  for (const node of tree.children) if (node.type === 'definition') definitions.set(node.identifier, node.url);
  const edits: { start: number; end: number; text: string }[] = [];
  function visit(node: RootContent): void {
    const url = node.type === 'link' ? node.url : node.type === 'linkReference' ? definitions.get(node.identifier) : undefined;
    if (url) {
      const target = new URL(url, content.profile.url);
      if (target.origin === new URL(content.profile.url).origin && hidden.has(target.pathname)) {
        const children = (node as Extract<RootContent, { type: 'link' | 'linkReference' }>).children;
        const start = node.position?.start.offset; const end = node.position?.end.offset;
        if (start !== undefined && end !== undefined) {
          const first = children[0]?.position?.start.offset; const last = children.at(-1)?.position?.end.offset;
          edits.push({ start, end, text: first !== undefined && last !== undefined ? markdown.slice(first, last) : '' });
        }
        return;
      }
    }
    if ('children' in node) for (const child of node.children) visit(child as RootContent);
  }
  for (const node of tree.children) visit(node);
  for (const edit of edits.sort((a, b) => b.start - a.start)) markdown = markdown.slice(0, edit.start) + edit.text + markdown.slice(edit.end);
  return markdown;
}
