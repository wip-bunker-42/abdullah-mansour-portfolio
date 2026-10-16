import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://aimansour.com',
  output: 'static',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'never' },
  vite: { build: { sourcemap: false } },
});
