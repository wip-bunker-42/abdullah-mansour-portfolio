import type { Locale } from '../content/contracts.ts';
import type { ContactValues, ContactErrors } from './contract.ts';
import { contactCopy } from './messages.ts';
export function escapeHtml(value: string): string { return value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!); }
export function renderErrorSummary(locale: Locale, errors: ContactErrors): string {
  if (!Object.keys(errors).length) return '';
  return `<div class="form-errors" id="contact-errors" role="alert" tabindex="-1"><p>${contactCopy(locale).summary}</p><ul>${Object.entries(errors).map(([key,value]) => `<li>${key === 'form' || key === 'website' || key === 'locale' ? escapeHtml(value!) : `<a href="#${key}">${escapeHtml(value!)}</a>`}</li>`).join('')}</ul></div>`;
}
export function renderContactForm(locale: Locale, values: ContactValues, errors: ContactErrors): string {
  const m = contactCopy(locale);
  const field = (key: 'name'|'email'|'company'|'message', label: string, attributes: string) => {
    const attrs = `id="${key}" name="${key}" ${attributes}${errors[key] ? ` aria-invalid="true" aria-describedby="${key}-error"` : ''}`;
    return `<div class="form-field"><label for="${key}">${label}</label>${key === 'message' ? `<textarea ${attrs}>${escapeHtml(values[key])}</textarea>` : `<input ${attrs} value="${escapeHtml(values[key])}"/>`}${errors[key] ? `<p class="field-error" id="${key}-error">${escapeHtml(errors[key]!)}</p>` : ''}</div>`;
  };
  return `<form method="post" action="/api/contact" data-contact-form data-locale="${locale}"><div data-error-summary>${renderErrorSummary(locale,errors)}</div><input type="hidden" name="locale" value="${locale}"/><div class="form-pair">${field('name',m.name,'type="text" autocomplete="name" maxlength="100" required')}${field('email',m.email,'type="email" dir="ltr" autocomplete="email" maxlength="254" required')}</div>${field('company',m.company,'type="text" autocomplete="organization" maxlength="160"')}<div class="form-field"><label for="topic">${m.topic}</label><select id="topic" name="topic"${errors.topic ? ' aria-invalid="true" aria-describedby="topic-error"' : ''}>${(['role','project','other'] as const).map(topic => `<option value="${topic}"${values.topic === topic ? ' selected' : ''}>${m[topic]}</option>`).join('')}</select>${errors.topic ? `<p class="field-error" id="topic-error">${escapeHtml(errors.topic)}</p>` : ''}</div>${field('message',m.message,'rows="6" maxlength="6000" required')}<div class="form-trap" aria-hidden="true"><label for="website">${m.website}</label><input id="website" name="website" type="text" tabindex="-1" autocomplete="off" value=""/></div><p class="form-privacy"><a href="${locale === 'ar' ? '/ar' : ''}/privacy/">${m.privacy}</a></p><button class="button button--primary" type="submit">${m.send}</button><p class="form-status" data-form-status role="status" aria-live="polite"></p></form>`;
}
