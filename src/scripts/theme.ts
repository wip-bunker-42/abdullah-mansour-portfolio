export const themeBootstrap = "document.documentElement.classList.add('js');try{var t=localStorage.getItem('aimansour-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}";

export function initializeTheme(): void {
  const root = document.documentElement;
  const control = document.querySelector<HTMLButtonElement>('[data-theme-control]');
  if (!control) return;
  const update = () => {
    const light = root.dataset.theme === 'light';
    control.setAttribute('aria-label', (light ? control.dataset.darkLabel : control.dataset.lightLabel) || 'Change theme');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#F7F8FA' : '#0B0D10');
  };
  update();
  control.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('aimansour-theme', next); } catch { /* The in-page choice remains usable. */ }
    update();
  });
}
