import test from 'node:test';
import assert from 'node:assert/strict';
import { waitForPublicDns } from '../../scripts/wait-for-dns.ts';

test('first deployment tolerates a transient DNS record propagation error',async()=>{
  let requests=0;let pauses=0;
  const response=await waitForPublicDns('https://aimansour.com/',{
    request:async()=>{if(++requests===1)throw new TypeError('fetch failed',{cause:{code:'ENOTFOUND'}});return new Response(null,{status:200});},
    pause:async()=>{pauses++;},attempts:3,
  });
  assert.equal(response.status,200);assert.equal(requests,2);assert.equal(pauses,1);
});

test('deployment readiness stays bounded and does not retry HTTP or certificate failures',async()=>{
  let calls=0;const dns=new TypeError('fetch failed',{cause:{code:'EAI_AGAIN'}});
  await assert.rejects(waitForPublicDns('https://aimansour.com/',{request:async()=>{calls++;throw dns;},pause:async()=>{},attempts:2}),error=>error===dns);
  assert.equal(calls,2);calls=0;
  const certificate=new TypeError('fetch failed',{cause:{code:'CERT_HAS_EXPIRED'}});
  await assert.rejects(waitForPublicDns('https://aimansour.com/',{request:async()=>{calls++;throw certificate;},pause:async()=>{},attempts:3}),error=>error===certificate);
  assert.equal(calls,1);
  const response=await waitForPublicDns('https://aimansour.com/',{request:async()=>new Response(null,{status:404}),pause:async()=>assert.fail('HTTP failures must reach the smoke assertion'),attempts:3});
  assert.equal(response.status,404);
});
