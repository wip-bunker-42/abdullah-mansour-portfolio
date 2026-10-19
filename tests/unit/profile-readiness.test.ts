import test from 'node:test';
import assert from 'node:assert/strict';
import {waitForProfileRelease} from '../../scripts/wait-for-profile.ts';
import type {PublicProfileV1} from '../../src/lib/public-profile.ts';

const localized = (value: string) => ({en: value, ar: value});
const fixture: PublicProfileV1 = {
  schemaVersion: 1, id: 'https://aimansour.com/#person',
  name: localized('Release fixture'), professionalTitle: localized('Specialist'),
  summary: localized('Current release'), alternateNames: ['One', 'Two', 'Three', 'Four', 'Five'],
  url: 'https://aimansour.com',
  location: {city: localized('Cairo'), country: localized('Egypt'), countryCode: 'EG', timezone: 'Africa/Cairo'},
  contact: {email: 'release@example.test', responseTime: localized('Within hours')},
  profiles: [], resume: {url: 'https://aimansour.com/files/abdullah-mansour-cv.pdf', language: 'en', updatedAt: '2026-10-19'},
  updatedAt: '2026-10-19', experience: [], capabilities: [], education: [], credentials: [], selectedWork: [], contentLanguages: ['en', 'ar'],
};
const current = JSON.stringify(fixture) + '\n';
// A same-day edit must be recognized by its content, not just updatedAt.
const previous = JSON.stringify({...fixture, summary: localized('Previous release')}) + '\n';
const origin = 'https://aimansour.com';
const profilePaths = ['/profile.json', '/api/profile'];

function clock() {
  let elapsed = 0;
  return {now: () => elapsed, pause: async (milliseconds: number) => {elapsed += milliseconds;}, timeoutMs: 10_000};
}

test('post-deploy reads recover when the two profile paths initially serve different releases', async () => {
  let requests = 0;
  await waitForProfileRelease(origin, current, {
    ...clock(),
    request: async (input, init) => {
      const index = requests++;
      const url = new URL(String(input));
      assert.equal(url.pathname, profilePaths[index % 2]);
      assert.equal(url.search, '', 'readiness must check canonical cache keys');
      assert.equal(init?.cache, 'no-cache', 'readiness must request revalidation');
      assert.ok(init?.signal instanceof AbortSignal);
      return new Response(index === 0 ? previous : current);
    },
  });
  assert.equal(requests, 4, 'both paths must be checked again after the mixed release');
});

test('matching stale profiles cannot pass the deployment gate before the verified release arrives', async () => {
  let requests = 0;
  await waitForProfileRelease(origin, current, {
    ...clock(), request: async () => new Response(requests++ < 2 ? previous : current),
  });
  assert.equal(requests, 4, 'identical old profiles must not count as a successful deployment');
});

test('the current release passes immediately even when profile paths have different ETags', async () => {
  await waitForProfileRelease(origin, current, {
    request: async input => new Response(current, {headers: {ETag: new URL(String(input)).pathname === '/profile.json' ? '"static"' : '"api"'}}),
    pause: async () => assert.fail('a ready release must not wait'),
  });
});

test('persistent profile drift exhausts the wait budget with hashes instead of response contents', async () => {
  let requests = 0;
  await assert.rejects(waitForProfileRelease(origin, current, {
    ...clock(), request: async () => new Response(requests++ % 2 === 0 ? previous : current),
  }), error => {
    assert.ok(error instanceof Error);
    assert.match(error.message, /did not converge/);
    assert.match(error.message, /expected SHA-256 [a-f0-9]{64}/);
    for (const path of profilePaths) assert.ok(error.message.includes(path));
    assert.ok(!error.message.includes('release@example.test'));
    assert.ok(!error.message.includes('Previous release'));
    return true;
  });
  assert.equal(requests, 4, 'no request may start after the wait budget expires');
});

test('profile request time counts toward the deadline and the last pause uses only the remaining budget', async () => {
  let elapsed = 0;
  let requests = 0;
  const pauses: number[] = [];
  await assert.rejects(waitForProfileRelease(origin, current, {
    now: () => elapsed, timeoutMs: 10_000,
    request: async () => {requests++; elapsed += 4_500; return new Response(previous);},
    pause: async milliseconds => {pauses.push(milliseconds); elapsed += milliseconds;},
  }), /did not converge/);
  assert.equal(requests, 2);
  assert.deepEqual(pauses, [1_000]);
  assert.equal(elapsed, 10_000);
});

test('profile readiness fails immediately on HTTP errors instead of retrying a broken endpoint', async () => {
  for (const status of [404, 500]) {
    await assert.rejects(waitForProfileRelease(origin, current, {
      request: async input => new Response(current, {status: new URL(String(input)).pathname === '/api/profile' ? status : 200}),
      pause: async () => assert.fail('HTTP errors must not be retried'),
    }), new RegExp(`/api/profile: HTTP ${status}`));
  }
});

test('profile readiness does not hide malformed JSON or invalid schema behind rollout retries', async () => {
  for (const body of ['{broken', '{"schemaVersion":999}']) {
    await assert.rejects(waitForProfileRelease(origin, current, {
      request: async input => new Response(new URL(String(input)).pathname === '/api/profile' ? body : current),
      pause: async () => assert.fail('invalid profiles must not be retried'),
    }), /\/api\/profile: invalid public profile JSON/);
  }
});

test('profile readiness preserves network and certificate errors without retrying', async () => {
  for (const code of ['CERT_HAS_EXPIRED', 'ECONNRESET', 'ETIMEDOUT']) {
    const failure = new TypeError('fetch failed', {cause: {code}});
    await assert.rejects(waitForProfileRelease(origin, current, {
      request: async () => {throw failure;},
      pause: async () => assert.fail('network errors must not be retried'),
    }), error => error === failure);
  }
});

test('an invalid verified artifact or wait budget fails before any live request', async () => {
  const request = async () => {assert.fail('invalid local inputs must not make live requests');};
  await assert.rejects(waitForProfileRelease(origin, '{}', {request}), /Verified release: invalid public profile JSON/);
  for (const timeoutMs of [0, -1, Infinity, NaN]) {
    await assert.rejects(waitForProfileRelease(origin, current, {request, timeoutMs}), /positive finite wait budget/);
  }
});
