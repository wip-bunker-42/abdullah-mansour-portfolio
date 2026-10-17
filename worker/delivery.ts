import profile from '../src/data/profile.json';
import type { ContactValues } from '../src/contact/contract.ts';
import { escapeHtml } from '../src/contact/view.ts';
export function createContactEmail(values: ContactValues) {
  const text = `Name: ${values.name}\nEmail: ${values.email}\nCompany: ${values.company || '—'}\nTopic: ${values.topic}\nLanguage: ${values.locale}\n\n${values.message}`;
  return { from: { email:'contact@aimansour.com', name:'AIMansour website' }, to:profile.contact.email, replyTo:values.email, subject:`Portfolio inquiry — ${values.topic}`, text, html:`<pre style="white-space:pre-wrap;font-family:Arial,sans-serif">${escapeHtml(text)}</pre>` };
}
