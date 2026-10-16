export function initializeEvidence(): void {
  const dialog = document.querySelector<HTMLDialogElement>('#evidence-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const image = dialog.querySelector<HTMLImageElement>('[data-evidence-full]')!;
  const caption = dialog.querySelector<HTMLElement>('#evidence-caption')!;
  const original = dialog.querySelector<HTMLAnchorElement>('[data-evidence-original]')!;
  const close = dialog.querySelector<HTMLButtonElement>('[data-evidence-close]')!;
  let opener: HTMLAnchorElement | null = null;
  for (const trigger of document.querySelectorAll<HTMLAnchorElement>('[data-evidence-trigger]')) {
    trigger.setAttribute('aria-haspopup','dialog');
    trigger.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); opener = trigger;
      image.src = trigger.href; image.alt = trigger.dataset.evidenceAlt || '';
      image.width = Number(trigger.dataset.evidenceWidth); image.height = Number(trigger.dataset.evidenceHeight);
      caption.textContent = trigger.dataset.evidenceCaption || '';
      original.href = trigger.href;
      dialog.showModal(); document.documentElement.classList.add('dialog-open'); close.focus();
    });
  }
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { document.documentElement.classList.remove('dialog-open'); opener?.focus(); });
}
