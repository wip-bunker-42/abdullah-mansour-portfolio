import { emptyValues, type ContactCode, type ContactErrors, type ContactShell, type ContactValues } from '../src/contact/contract.ts';
import type { Locale } from '../src/content/contracts.ts';
import { contactCopy } from '../src/contact/messages.ts';
import { validateContact } from '../src/contact/validation.ts';
import { renderContactForm } from '../src/contact/view.ts';
export interface ContactDependencies {
  allowedOrigins: readonly string[];
  checkRateLimit(key: string): Promise<boolean>;
  send(values: ContactValues): Promise<void>;
  shells: Record<Locale, ContactShell>;
}
const statuses: Record<ContactCode,number> = { validation:400,origin:403,method:405,too_large:413,content_type:415,rate_limited:429,internal:500,delivery:502 };
const MAX_BYTES = 32768;
class TooLarge extends Error {}
async function boundedBody(request: Request): Promise<string> {
  if (Number(request.headers.get('Content-Length')) > MAX_BYTES) throw new TooLarge();
  const reader = request.body?.getReader(); if (!reader) return '';
  const chunks: Uint8Array[] = []; let length = 0;
  try {
    while (true) { const { done, value } = await reader.read(); if (done) break; length += value.byteLength; if (length > MAX_BYTES) { await reader.cancel(); throw new TooLarge(); } chunks.push(value); }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length); let offset = 0; for (const chunk of chunks) { bytes.set(chunk,offset); offset += chunk.byteLength; }
  return new TextDecoder('utf-8', { fatal: true, ignoreBOM: false }).decode(bytes);
}
function scalarInput(body: string, json: boolean): Record<string,string> {
  const keys = ['name','email','company','topic','message','locale','website'];
  if (!json) {
    const params = new URLSearchParams(body); const result: Record<string,string> = {};
    for (const [key,value] of params) { if (!keys.includes(key) || Object.hasOwn(result,key)) throw Error('Invalid scalar fields'); result[key] = value; }
    return result;
  }
  const parsed: unknown = JSON.parse(body);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed) || Object.entries(parsed).some(([key,value]) => !keys.includes(key) || typeof value !== 'string')) throw Error('Invalid scalar fields');
  // With a flat string-only object, alternating string tokens are keys/values.
  // Decode escaped key names before checking duplicates (e.g. n\u0061me).
  const strings = body.match(/"(?:\\.|[^"\\])*"/g) ?? [];
  const seen = new Set<string>();
  for (let i=0;i<strings.length;i+=2) { const key: string = JSON.parse(strings[i]!); if (seen.has(key)) throw Error('Repeated field'); seen.add(key); }
  return parsed as Record<string,string>;
}
export async function handleContact(request: Request, deps: ContactDependencies): Promise<Response> {
  const type = request.headers.get('Content-Type')?.split(';')[0]?.trim().toLowerCase();
  const isJson = type === 'application/json' || request.headers.get('Accept')?.includes('application/json') === true;
  let values = emptyValues('en');
  const fail = (code: ContactCode, fieldErrors?: ContactErrors): Response => {
    const headers = new Headers({ 'Cache-Control':'no-store', 'X-Robots-Tag':'noindex', 'X-Content-Type-Options':'nosniff' });
    if (code === 'rate_limited') headers.set('Retry-After','60');
    if (code === 'method') headers.set('Allow','POST');
    if (isJson) { headers.set('Content-Type','application/json; charset=utf-8'); return new Response(JSON.stringify({ok:false,code,fieldErrors}),{status:statuses[code],headers}); }
    headers.set('Content-Type','text/html; charset=utf-8');
    const shell = deps.shells[values.locale];
    return new Response(shell.beforeForm+renderContactForm(values.locale,values,{ ...fieldErrors,form:contactCopy(values.locale).codes[code] })+shell.afterForm,{status:statuses[code],headers});
  };
  try {
    if (request.method !== 'POST') return fail('method');
    const origin = request.headers.get('Origin');
    if ((origin !== null && !deps.allowedOrigins.includes(origin)) || request.headers.get('Sec-Fetch-Site') === 'cross-site') return fail('origin');
    if (type !== 'application/json' && type !== 'application/x-www-form-urlencoded') return fail('content_type');
    let input: Record<string,string>;
    try { input = scalarInput(await boundedBody(request),type === 'application/json'); }
    catch(error) { return fail(error instanceof TooLarge ? 'too_large' : 'validation'); }
    const locale: Locale = input.locale === 'ar' ? 'ar' : 'en';
    values = { name:(input.name??'').trim(), email:(input.email??'').trim(), company:(input.company??'').trim(), message:(input.message??'').trim(), topic:(input.topic??'role') as ContactValues['topic'], locale, website:input.website??'' };
    const errors = validateContact(values);
    if (input.locale !== undefined && !['en','ar'].includes(input.locale)) errors.locale = contactCopy(locale).fields.locale;
    // Validate raw email too: trimming must never conceal a header injection.
    if (/[\r\n\x00-\x1f\x7f]/.test(input.email??'')) errors.email = contactCopy(locale).fields.email;
    if (Object.keys(errors).length) return fail('validation',errors);
    if (!await deps.checkRateLimit(request.headers.get('CF-Connecting-IP') ?? 'local-preview')) return fail('rate_limited');
    try { await deps.send(values); } catch { return fail('delivery'); }
    if (isJson) return Response.json({ok:true},{headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex'}});
    return new Response(null,{status:303,headers:{Location:locale==='ar'?'/ar/contact/thanks/':'/contact/thanks/','Cache-Control':'no-store','X-Robots-Tag':'noindex'}});
  } catch { return fail('internal'); }
}
