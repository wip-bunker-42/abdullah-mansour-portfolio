import { z } from 'zod';

export const locales = ['en', 'ar'] as const;
export const projectIds = ['zone10', 'elkhabar-bewodooh', 'sorouh', 'ai-operations', 'youssef-el-sherif'] as const;
export const pageIds = ['home', 'work', 'about', 'resume', 'contact', 'privacy', 'accessibility'] as const;
export type Locale = typeof locales[number];
export type Localized<T> = Record<Locale, T>;
export type ProjectId = typeof projectIds[number];
export type PageId = typeof pageIds[number];
export type ContentKey = PageId | `case:${ProjectId}`;
export type RouteKey = ContentKey | 'contact-thanks' | 'error';
export type Route = { key: RouteKey; locale: Locale; path: string; markdownPath: string | null; indexable: boolean };
const local = z.strictObject({ en: z.string(), ar: z.string() });
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const ProfileSchema = z.strictObject({
  name: local, professionalTitle: local, summary: local,
  alternateNames: z.array(z.string()).min(5),
  url: z.url(), location: z.strictObject({ city: local, country: local, countryCode: z.literal('EG'), timezone: z.literal('Africa/Cairo') }),
  contact: z.strictObject({ email: z.email(), responseTime: local }),
  profiles: z.array(z.strictObject({ name: z.string(), url: z.url(), visible: z.boolean() })),
  resume: z.strictObject({ url: z.literal('/files/abdullah-mansour-cv.pdf'), language: z.literal('en'), updatedAt: date }),
  updatedAt: date,
});
export const ExperienceSchema = z.strictObject({
  positions: z.array(z.strictObject({ id: z.string(), organization: local, title: local, period: local, type: local, location: local, details: z.strictObject({ en: z.array(z.string()), ar: z.array(z.string()) }) })),
  capabilities: z.array(z.strictObject({ id: z.string(), name: local, scope: local })),
  education: z.array(z.strictObject({ institution: local, qualification: local.optional() })),
  credentials: z.array(z.strictObject({ name: local, issuer: z.string(), date: z.string().optional() })),
  contributions: z.array(z.strictObject({ title: local, url: z.url() })),
});
export const MetricSchema = z.strictObject({ id: z.string(), value: z.union([z.number(), z.string()]), display: local, label: local, period: local.optional() });
export const EvidenceSchema = z.strictObject({ id: z.string(), source: z.string(), publicPath: z.string(), width: z.number().int().positive(), height: z.number().int().positive(), alt: local, caption: local, period: local.optional() });
export const ProjectSchema = z.strictObject({
  id: z.enum(projectIds), name: local, discipline: local, headline: local, summary: local,
  published: z.boolean(), featured: z.boolean(), order: z.number().int(),
  period: local, market: local, responsibility: local, delivery: local,
  facts: z.strictObject({ en: z.array(z.strictObject({ label: z.string(), value: z.string() })), ar: z.array(z.strictObject({ label: z.string(), value: z.string() })) }),
  metricIds: z.array(z.string()), evidenceIds: z.array(z.string()), relatedIds: z.array(z.enum(projectIds)),
  coverEvidenceId: z.string().optional(), og: local,
});
const ContentKeySchema = z.custom<ContentKey>(v => typeof v === 'string' && ([...pageIds, ...projectIds.map(p => `case:${p}`)] as string[]).includes(v));
export const DocumentMetaSchema = z.strictObject({ key: ContentKeySchema, locale: z.enum(locales), title: z.string().min(1), description: z.string().min(1), heading: z.string().min(1), lead: z.string(), updatedAt: date, draft: z.boolean() });
export const NarrativeSectionSchema = z.strictObject({ id: z.string().min(1), heading: z.string(), markdown: z.string() });
export const DocumentSchema = DocumentMetaSchema.extend({ sections: z.array(NarrativeSectionSchema), markdown: z.string() });
export const RenderedDocumentSchema = DocumentMetaSchema.extend({ sections: z.array(NarrativeSectionSchema.extend({ html: z.string() })), markdown: z.string() });
export const SiteContentSchema = z.strictObject({
  profile: ProfileSchema, experience: ExperienceSchema, projects: z.array(ProjectSchema),
  metrics: z.record(z.string(), MetricSchema), evidence: z.record(z.string(), EvidenceSchema), documents: z.array(DocumentSchema),
});
export type ProfileData = z.infer<typeof ProfileSchema>;
export type ExperienceData = z.infer<typeof ExperienceSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Metric = z.infer<typeof MetricSchema>;
export type Evidence = z.infer<typeof EvidenceSchema>;
export type NarrativeSection = z.infer<typeof NarrativeSectionSchema>;
export type LocalizedDocument = z.infer<typeof DocumentSchema>;
export type RenderedDocument = z.infer<typeof RenderedDocumentSchema>;
export type SiteContent = z.infer<typeof SiteContentSchema>;
