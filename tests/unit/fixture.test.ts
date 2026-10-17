import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createFixtureDirectory } from '../fixture.ts';

test('isolated builds work in a clean checkout without an ignored .local directory', async () => {
  const checkout = await mkdtemp(join(tmpdir(), 'portfolio-clean-'));
  try {
    await assert.rejects(stat(join(checkout, '.local')), { code: 'ENOENT' });
    const fixture = await createFixtureDirectory(checkout, 'empty-work-');
    assert.ok((await stat(fixture)).isDirectory());
    assert.ok(fixture.startsWith(join(checkout, '.local', 'empty-work-')));
  } finally { await rm(checkout, { recursive: true, force: true }); }
});
