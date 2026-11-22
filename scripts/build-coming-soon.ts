import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { contentSecurityPolicy, securityHeaders } from '../src/lib/security.ts';

const output = '.generated/coming-soon';
const assets = join(output, 'coming-soon-assets');
const files = [
  'coming-soon/page.css',
  'public/brand/favicon.svg',
  'public/brand/wordmark.svg',
  'public/fonts/ibm-plex-sans-arabic-arabic-400-normal.woff2',
  'public/fonts/ibm-plex-sans-arabic-arabic-600-normal.woff2',
  'public/fonts/ibm-plex-sans-latin-400-normal.woff2',
  'public/fonts/ibm-plex-sans-arabic-LICENSE.txt',
  'public/fonts/ibm-plex-sans-LICENSE.txt',
];

await mkdir(assets, { recursive: true });
await Promise.all([
  ...files.map(file => copyFile(file, join(assets, file.split('/').at(-1)!))),
  copyFile('coming-soon/index.html', join(output, 'index.html')),
  writeFile(join(output, 'robots.txt'), 'User-agent: *\nAllow: /\n'),
  writeFile(join(output, '_headers'), [
    '/*',
    ...Object.entries(securityHeaders).map(([name, value]) => `  ${name}: ${value}`),
    `  Content-Security-Policy: ${contentSecurityPolicy([])}`,
    '  Cache-Control: no-store',
    '  X-Robots-Tag: noindex, follow',
    '',
  ].join('\n')),
]);
