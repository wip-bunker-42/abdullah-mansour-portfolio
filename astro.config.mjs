import { defineConfig } from 'astro/config';
import profile from './src/data/profile.json' with { type: 'json' };

export default defineConfig({
  site: profile.url,
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'always' },
  vite: {
    build: { sourcemap: false },
    server: { watch: { ignored: ['**/.local/**', '**/.superpowers/**', '**/test-results/**', '**/playwright-report/**'] } },
  },
});
