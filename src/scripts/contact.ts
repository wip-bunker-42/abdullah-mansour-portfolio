import { contactCopy } from '../contact/messages.ts';
import { renderErrorSummary } from '../contact/view.ts';
import { validateContact } from '../contact/validation.ts';
import type { ContactErrors, ContactResult, ContactValues } from '../contact/contract.ts';
export function initializeContact(): void {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]'); if (!form) return;
  const locale = form.dataset.locale === 'ar' ? 'ar' : 'en'; const copy = contactCopy(locale);
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const summary = form.querySelector<HTMLElement>('[data-error-summary]')!;
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  let pending = false; form.noValidate = true;
  const showErrors = (errors: ContactErrors): void => {
    form.querySelectorAll('.field-error').forEach(node=>node.remove());
    form.querySelectorAll('[aria-invalid]').forEach(node=>{node.removeAttribute('aria-invalid');node.removeAttribute('aria-describedby');});
    summary.innerHTML = renderErrorSummary(locale,errors);
    for (const [key,message] of Object.entries(errors)) {
      const input = form.elements.namedItem(key);
      if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement || input instanceof HTMLTextAreaElement) {
        const error = document.createElement('p');error.className='field-error';error.id=`${key}-error`;error.textContent=message!;input.setAttribute('aria-invalid','true');input.setAttribute('aria-describedby',error.id);input.after(error);
      }
    }
    document.getElementById('contact-errors')?.focus();
  };
  if (summary.textContent?.trim()) document.getElementById('contact-errors')?.focus();
  form.addEventListener('submit',async event=>{
    event.preventDefault(); if (pending) return;
    const data = new FormData(form); const text = (key:string)=>String(data.get(key)??'').trim();
    const values: ContactValues = {name:text('name'),email:text('email'),company:text('company'),topic:text('topic') as ContactValues['topic'],message:text('message'),locale,website:text('website')};
    const errors = validateContact(values); status.textContent='';
    if (Object.keys(errors).length) {showErrors(errors);return;}
    const restoreSubmitFocus=document.activeElement===submit;
    pending=true;submit.disabled=true;submit.textContent=copy.sending;summary.innerHTML='';
    try {
      const response=await fetch(form.action,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(values)});
      const result: ContactResult=await response.json();
      if (!response.ok || !result.ok) {
        if (!result.ok) showErrors({...result.fieldErrors,form:copy.codes[result.code]??copy.codes.internal});
        else showErrors({form:copy.codes.internal});
      } else {form.reset();showErrors({});status.textContent=copy.sent;}
    } catch {showErrors({form:copy.codes.delivery});}
    finally {pending=false;submit.disabled=false;submit.textContent=copy.send;if(restoreSubmitFocus&&document.activeElement===document.body)submit.focus();}
  });
  const copyButton=document.querySelector<HTMLButtonElement>('[data-copy-email]');
  const copyStatus=document.querySelector<HTMLElement>('[data-copy-status]');
  copyButton?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(copyButton.dataset.copyEmail!);if(copyStatus)copyStatus.textContent=copy.copied;}catch{if(copyStatus)copyStatus.textContent=copy.copyFailed;}});
}
