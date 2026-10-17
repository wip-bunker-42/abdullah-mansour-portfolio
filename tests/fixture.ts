import { mkdir, mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';

export async function createFixtureDirectory(root: string, prefix: string): Promise<string> {
  const parent = join(root, '.local');
  await mkdir(parent, { recursive: true });
  return mkdtemp(join(parent, prefix));
}
