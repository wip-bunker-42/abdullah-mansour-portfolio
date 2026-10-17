import type { ContactValues, ContactErrors } from './contract.ts';
import { contactCopy } from './messages.ts';
export function validateContact(values: ContactValues): ContactErrors {
  const copy = contactCopy(values.locale).fields;
  const errors: ContactErrors = {};
  if (!values.name || values.name.length > 100) errors.name = copy.name;
  if (values.email.length > 254 || /[\r\n\x00-\x1f\x7f]/.test(values.email) || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(values.email)) errors.email = copy.email;
  if (values.company.length > 160) errors.company = copy.company;
  if (!values.message || values.message.length > 6000) errors.message = copy.message;
  if (!['role','project','other'].includes(values.topic)) errors.topic = copy.topic;
  if (values.website !== '') errors.website = copy.website;
  return errors;
}
