import { z } from 'zod';
import { ProfileSchema, ExperienceSchema, type SiteContent } from '../content/contracts.ts';
import { getRoute } from '../i18n/routes.ts';
import { getPublishedProjects } from '../content/publication.ts';
const localized = z.strictObject({en:z.string(),ar:z.string()});
export const PublicProfileSchema = ProfileSchema.extend({
  schemaVersion:z.literal(1), id:z.literal('https://aimansour.com/#person'),
  experience:ExperienceSchema.shape.positions, capabilities:ExperienceSchema.shape.capabilities,
  education:ExperienceSchema.shape.education, credentials:ExperienceSchema.shape.credentials,
  selectedWork:z.array(z.strictObject({id:z.string(),name:localized,summary:localized,urls:z.strictObject({en:z.url(),ar:z.url()}),metrics:z.array(z.strictObject({id:z.string(),value:z.union([z.number(),z.string()]),display:localized,label:localized}))})),
  resume:z.strictObject({url:z.url(),language:z.literal('en'),updatedAt:z.string()}),
  contentLanguages:z.tuple([z.literal('en'),z.literal('ar')]),
});
export type PublicProfileV1 = z.infer<typeof PublicProfileSchema>;
export function buildPublicProfile(content:SiteContent):PublicProfileV1 {
  return PublicProfileSchema.parse({
    ...content.profile,schemaVersion:1,id:'https://aimansour.com/#person',
    resume:{...content.profile.resume,url:new URL(content.profile.resume.url,content.profile.url).href},
    experience:content.experience.positions,capabilities:content.experience.capabilities,education:content.experience.education,credentials:content.experience.credentials,
    selectedWork:getPublishedProjects(content).filter(p=>p.featured).map(p=>({id:p.id,name:p.name,summary:p.summary,urls:{en:new URL(getRoute(`case:${p.id}`,'en').path,content.profile.url).href,ar:new URL(getRoute(`case:${p.id}`,'ar').path,content.profile.url).href},metrics:p.metricIds.map(id=>{const {period,...metric}=content.metrics[id]!;return metric;})})),contentLanguages:['en','ar'],
  });
}
