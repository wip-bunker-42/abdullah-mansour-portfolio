import {createHash} from 'node:crypto';
import {PublicProfileSchema} from '../src/lib/public-profile.ts';

type Options = {
  request?: typeof fetch;
  pause?: (milliseconds: number) => Promise<void>;
  now?: () => number;
  timeoutMs?: number;
};

const paths = ['/profile.json', '/api/profile'];
const sha256 = (body: string) => createHash('sha256').update(body).digest('hex');

function validateProfile(body: string, label: string): void {
  let value: unknown;
  try {value = JSON.parse(body);} catch {throw Error(`${label}: invalid public profile JSON`);}
  if (!PublicProfileSchema.safeParse(value).success) throw Error(`${label}: invalid public profile JSON`);
}

// A completed upload can briefly expose different asset revisions at the two paths.
// Retry only valid 200 profiles that have not reached the verified build's bytes.
export async function waitForProfileRelease(baseUrl: string, expectedProfile: string, {
  request = fetch,
  pause = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds)),
  now = () => performance.now(),
  timeoutMs = 60_000,
}: Options = {}): Promise<void> {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw Error('Profile readiness requires a positive finite wait budget');
  validateProfile(expectedProfile, 'Verified release');
  const deadline = now() + timeoutMs;
  let observed: {path: string; body: string}[] = [];
  let waitingReported = false;
  while (true) {
    const remaining = deadline - now();
    if (remaining <= 0) break;
    const requestTimeout = Math.max(1, Math.ceil(Math.min(10_000, remaining)));
    observed = await Promise.all(paths.map(async path => {
      const response = await request(new URL(path, baseUrl), {cache: 'no-cache', signal: AbortSignal.timeout(requestTimeout)});
      if (response.status !== 200) throw Error(`${path}: HTTP ${response.status}; expected 200`);
      const body = await response.text();
      validateProfile(body, path);
      return {path, body};
    }));
    if (now() >= deadline) break;
    if (observed.every(({body}) => body === expectedProfile)) return;
    if (!waitingReported) {
      console.log(`Public profiles have not reached the verified release; allowing up to ${timeoutMs / 1_000}s for rollout convergence.`);
      waitingReported = true;
    }
    await pause(Math.min(5_000, Math.max(0, deadline - now())));
  }
  throw Error(`Public profiles did not converge within ${timeoutMs / 1_000}s; expected SHA-256 ${sha256(expectedProfile)}; ${observed.map(({path, body}) => `${path} SHA-256 ${sha256(body)}`).join('; ')}`);
}
