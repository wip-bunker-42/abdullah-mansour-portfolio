import { getEntry } from 'astro:content';
import type { ContentKey, Locale, RenderedDocument } from './contracts.ts';

export async function getDocument(key: ContentKey, locale: Locale): Promise<RenderedDocument> {
  const entry = await getEntry('documents', `${locale}/${key}`);
  if (!entry) throw new Error(`Missing document: ${locale}/${key}`);
  return entry.data;
}
