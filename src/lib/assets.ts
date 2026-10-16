import type { ImageMetadata } from 'astro';
import type { Evidence } from '../content/contracts.ts';

const images = import.meta.glob<{ default: ImageMetadata }>('/src/assets/evidence/**/*.{png,jpg,jpeg,webp}', { eager: true });
export function getEvidenceImage(evidence: Evidence): ImageMetadata {
  const image = images[`/${evidence.source}`]?.default;
  if (!image) throw new Error(`Missing image import: ${evidence.id}`);
  return image;
}
