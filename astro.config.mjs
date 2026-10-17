import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://aimansour.com',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'always' },
  vite: {
    build: { sourcemap: false },
    server: { watch: { ignored: ['**/.local/**', '**/.superpowers/**', '**/test-results/**', '**/playwright-report/**'] } },
  },
});
