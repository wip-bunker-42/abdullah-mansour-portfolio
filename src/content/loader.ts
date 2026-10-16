import type { Loader } from 'astro/loaders';
import { fileURLToPath } from 'node:url';
import { loadSiteContent } from './read.ts';

export function createNarrativeLoader(): Loader {
  return {
    name: 'aimansour-local-narratives',
    async load({ config, store, parseData, renderMarkdown, generateDigest, watcher }) {
      const root = fileURLToPath(config.root);
      const sync = async () => {
        const content = await loadSiteContent(root);
        store.clear();
        for (const document of content.documents.filter(d => !d.draft && (!d.key.startsWith('case:') || content.projects.some(p => `case:${p.id}` === d.key && p.published)))) {
          const sections = await Promise.all(document.sections.map(async section => ({ ...section, html: (await renderMarkdown(section.markdown)).html })));
          const id = `${document.locale}/${document.key}`;
          const data = await parseData({ id, data: { ...document, sections } });
          store.set({ id, data, body: document.markdown, digest: generateDigest(JSON.stringify({ document, profile: content.profile, projects: content.projects, metrics: content.metrics, evidence: content.evidence })) });
        }
      };
      await sync();
      if (watcher) {
        watcher.add([`${root}/src/data`, `${root}/src/content/pages`, `${root}/src/content/cases`]);
        watcher.on('all', async (_event, path) => {
          if (/[/\\]src[/\\](data|content[/\\](pages|cases))[/\\]/.test(path)) await sync();
        });
      }
    },
  };
}
