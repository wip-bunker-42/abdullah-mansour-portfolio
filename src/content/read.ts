import { readFile, readdir, access } from 'node:fs/promises';
import { resolve, join, relative } from 'node:path';
import { parseDocument as parseYaml } from 'yaml';
import { SiteContentSchema, DocumentMetaSchema, pageIds, locales, type SiteContent, type LocalizedDocument, type NarrativeSection } from './contracts.ts';
import { resolveReferences } from './references.ts';

function unique(ids: string[], kind: string): void {
  if (new Set(ids).size !== ids.length) throw new Error(`Duplicate ${kind} ID`);
}

export function validateSiteContent(input: unknown): SiteContent {
  const content = SiteContentSchema.parse(input);
  unique(content.projects.map(p => p.id), 'project');
  unique(content.documents.map(d => `${d.locale}/${d.key}`), 'document');
  for (const [key, item] of Object.entries(content.evidence)) {
    if (item.id !== key) throw new Error(`Evidence ID mismatch: ${key}`);
    if (!item.source.startsWith('src/assets/') || item.source.includes('..') || item.source.includes('\\') || !item.publicPath.startsWith('/media/evidence/')) throw new Error(`Unsafe evidence source/path: ${key}`);
  }
  for (const [key, item] of Object.entries(content.metrics)) if (item.id !== key) throw new Error(`Metric ID mismatch: ${key}`);
  for (const project of content.projects) {
    for (const id of project.metricIds) if (!content.metrics[id]) throw new Error(`Missing metric: ${id}`);
    for (const id of [...project.evidenceIds, ...(project.coverEvidenceId ? [project.coverEvidenceId] : [])]) if (!content.evidence[id]) throw new Error(`Missing evidence: ${id}`);
    for (const id of project.relatedIds) if (!content.projects.some(p => p.id === id)) throw new Error(`Missing related project: ${id}`);
  }
  const required = [...pageIds, ...content.projects.filter(p => p.published).map(p => `case:${p.id}`)];
  for (const key of required) for (const locale of locales) {
    if (!content.documents.some(d => d.key === key && d.locale === locale && !d.draft)) throw new Error(`Missing published locale ${locale} for ${key}`);
  }
  for (const document of content.documents) unique(document.sections.map(s => s.id), `section in ${document.key}/${document.locale}`);
  return content;
}

export function parseDocument(source: string): LocalizedDocument {
  const match = source.match(/^\uFEFF?---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)([\s\S]*)$/);
  if (!match) throw new Error('Documents require data-only YAML frontmatter delimited by ---');
  const yaml = parseYaml(match[1]!, { schema: 'core', uniqueKeys: true });
  if (yaml.errors.length || yaml.warnings.length) throw new Error('Invalid data-only YAML frontmatter');
  const parsed = { data: yaml.toJS({ maxAliasCount: 0 }), content: match[2]! };
  const metadata = DocumentMetaSchema.parse(parsed.data);
  const sections: NarrativeSection[] = [];
  let current: NarrativeSection = { id: 'intro', heading: '', markdown: '' };
  let fence = '';
  for (const line of parsed.content.split('\n')) {
    const delimiter = line.match(/^\s*(`{3,}|~{3,})/);
    if (delimiter) { if (!fence) fence = delimiter[1]![0]!; else if (fence === delimiter[1]![0]) fence = ''; }
    const heading = !fence && line.match(/^## (.+?)\s+\{#([a-z0-9-]+)\}\s*$/);
    if (heading) {
      if (current.markdown.trim() || current.heading) sections.push({ ...current, markdown: current.markdown.trim() });
      current = { id: heading[2]!, heading: heading[1]!, markdown: '' };
    } else {
      if (!fence && /^## /.test(line)) throw new Error(`H2 needs a stable section ID: ${metadata.key}/${metadata.locale}`);
      current.markdown += `${line}\n`;
    }
  }
  if (current.markdown.trim() || current.heading) sections.push({ ...current, markdown: current.markdown.trim() });
  const body = parsed.content.replace(/\s+\{#[a-z0-9-]+\}(?=\s*$)/gm, '').trim();
  return { ...metadata, sections, markdown: `# ${metadata.heading}\n\n${metadata.lead}\n\n${body}\n` };
}

async function markdownFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? markdownFiles(join(directory, entry.name)) : entry.name.endsWith('.md') ? [join(directory, entry.name)] : []))).flat();
}

export async function loadSiteContent(rootDir = process.cwd()): Promise<SiteContent> {
  const root = resolve(rootDir);
  const names = ['profile', 'experience', 'projects', 'metrics', 'evidence'] as const;
  const values = await Promise.all(names.map(async name => [name, JSON.parse(await readFile(join(root, 'src/data', `${name}.json`), 'utf8'))] as const));
  const files = [...await markdownFiles(join(root, 'src/content/pages')), ...await markdownFiles(join(root, 'src/content/cases'))];
  const documents = await Promise.all(files.sort().map(async path => parseDocument(await readFile(path, 'utf8'))));
  const content = validateSiteContent({ ...Object.fromEntries(values), documents });
  for (const evidence of Object.values(content.evidence)) {
    const source = resolve(root, evidence.source);
    if (relative(root, source).startsWith('..')) throw new Error(`Unsafe source path: ${evidence.id}`);
    await access(source);
  }
  // Materialize a new object; references never execute code or mutate source files.
  function materialize(value: unknown, locale?: 'en' | 'ar'): unknown {
    if (typeof value === 'string') return locale ? resolveReferences(value, locale, content) : value;
    if (Array.isArray(value)) return value.map(v => materialize(v, typeof v === 'object' && v !== null && 'locale' in v ? (v as {locale:'en'|'ar'}).locale : locale));
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, materialize(item, key === 'en' || key === 'ar' ? key : locale)]));
    return value;
  }
  return validateSiteContent(materialize(content));
}
