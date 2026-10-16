import { parseFragment, serializeOuter, type DefaultTreeAdapterMap } from 'parse5';
import type { Evidence, Locale } from '../content/contracts.ts';

export type NarrativeBlock = { kind: 'html'; html: string } | { kind: 'evidence'; evidence: Evidence };
type Element = DefaultTreeAdapterMap['element'];
function element(node: DefaultTreeAdapterMap['childNode']): node is Element { return 'tagName' in node; }

export function splitNarrative(html: string, evidence: Record<string, Evidence>, locale: Locale = 'en'): NarrativeBlock[] {
  const children = parseFragment(html).childNodes.filter(n => n.nodeName !== '#text' || 'value' in n && n.value.trim());
  const blocks: NarrativeBlock[] = [];
  let pending = '';
  const flush = () => { if (pending.trim()) blocks.push({ kind: 'html', html: pending }); pending = ''; };
  for (let i = 0; i < children.length; i++) {
    const node = children[i]!;
    const image = element(node) && node.tagName === 'p' ? node.childNodes.find(n => element(n) && n.tagName === 'img') : undefined;
    if (image && element(image)) {
      const path = image.attrs.find(a => a.name === 'src')?.value;
      const asset = Object.values(evidence).find(e => e.publicPath === path);
      if (!asset) throw new Error(`Unknown evidence image: ${path}`);
      flush(); blocks.push({ kind: 'evidence', evidence: asset });
      const caption = children[i + 1];
      if (caption && element(caption) && caption.tagName === 'p' && caption.childNodes.length === 1 && element(caption.childNodes[0]!) && (caption.childNodes[0] as Element).tagName === 'em') i++;
    } else if (element(node) && node.tagName === 'table') {
      pending += `<div class="table-scroll" role="region" tabindex="0" aria-label="${locale === 'ar' ? 'جدول بيانات، يمكن تمريره أفقيًا عند الحاجة' : 'Data table, scroll horizontally if needed'}">${serializeOuter(node)}</div>`;
    } else pending += serializeOuter(node);
  }
  flush(); return blocks;
}
