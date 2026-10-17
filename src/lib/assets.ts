import type { ImageMetadata } from 'astro';
import type { Evidence } from '../content/contracts.ts';
import { evidenceImages } from '../../.generated/evidence-imports.ts';

export function getEvidenceImage(evidence: Evidence): ImageMetadata {
  const image = evidenceImages[evidence.source];
  if (!image) throw new Error(`Missing image import: ${evidence.id}`);
  return image;
}
