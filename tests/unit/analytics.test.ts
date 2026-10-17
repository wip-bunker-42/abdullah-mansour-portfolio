import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyAnalyticsInstallation} from '../../scripts/analytics.ts';
const manual='<script src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon="{}"></script>';
const automatic='<script defer src="https://static.cloudflareinsights.com/beacon.min.js/vversioned-beacon" data-cf-beacon="{}"></script>';

test('live Analytics checks count both manual and versioned edge snippets',()=>{
  assert.throws(()=>verifyAnalyticsInstallation(manual+automatic,'production'),/duplicated|expected 1/i);
  assert.doesNotThrow(()=>verifyAnalyticsInstallation(automatic,'production'));
  assert.throws(()=>verifyAnalyticsInstallation('','production'),/missing|expected 1/i);
});

test('static artifacts leave Analytics injection to the existing Cloudflare setup',()=>{
  assert.doesNotThrow(()=>verifyAnalyticsInstallation('<h1>Portfolio</h1>','artifact'));
  assert.throws(()=>verifyAnalyticsInstallation(manual,'artifact'),/manual|expected 0/i);
});
