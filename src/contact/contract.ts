import type { Locale } from '../content/contracts.ts';
export type ContactValues = { name: string; email: string; company: string; topic: 'role' | 'project' | 'other'; message: string; locale: Locale; website: string };
export type ContactErrors = Partial<Record<keyof ContactValues | 'form', string>>;
export type ContactCode = 'validation' | 'origin' | 'method' | 'too_large' | 'content_type' | 'rate_limited' | 'internal' | 'delivery';
export type ContactResult = { ok: true } | { ok: false; code: ContactCode; fieldErrors?: ContactErrors };
export type ContactShell = { beforeForm: string; afterForm: string };
export const emptyValues = (locale: Locale): ContactValues => ({ name: '', email: '', company: '', topic: 'role', message: '', locale, website: '' });
