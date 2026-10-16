import { defineCollection } from 'astro:content';
import { createNarrativeLoader } from './content/loader.ts';
import { RenderedDocumentSchema } from './content/contracts.ts';

export const collections = { documents: defineCollection({ loader: createNarrativeLoader(), schema: RenderedDocumentSchema }) };
