import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {inlineResourceHashes} from '../../scripts/csp-hashes.ts';
import {contentSecurityPolicy} from '../../src/lib/security.ts';

test('critical inline styles have exact, separate CSP hashes without unsafe permissions',()=>{
  const css='body{color:#fff;background:#0B0D10}';const script='document.documentElement.dataset.theme="dark"';
  const hashes=inlineResourceHashes(`<style>${css}</style><script>${script}</script><script src="/external.js"></script>`);
  assert.deepEqual(hashes.styles,[createHash('sha256').update(css).digest('base64')]);
  assert.deepEqual(hashes.scripts,[createHash('sha256').update(script).digest('base64')]);
  const policy=contentSecurityPolicy(hashes.scripts,hashes.styles);
  assert.ok(policy.includes(`style-src 'self' 'sha256-${hashes.styles[0]}'`));
  assert.ok(!policy.includes('unsafe-'));
  const scripts=policy.split(';').find(part=>part.trim().startsWith('script-src'))!;
  assert.ok(scripts.includes(hashes.scripts[0]!));assert.ok(!scripts.includes(hashes.styles[0]!));
});
