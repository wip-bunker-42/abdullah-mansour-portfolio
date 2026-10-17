import test from 'node:test';
import assert from 'node:assert/strict';
import { handleContact, type ContactDependencies } from '../../worker/contact.ts';
import { createContactEmail } from '../../worker/delivery.ts';

const valid = { name: 'A recruiter', email: 'recruiter@example.com', company: '', topic: 'role', message: 'Let’s discuss a role.', locale: 'en', website: '' };
function setup(overrides: Partial<ContactDependencies> = {}) {
  const sent: unknown[] = [];
  const deps: ContactDependencies = { allowedOrigins: ['https://aimansour.com'], checkRateLimit: async () => true, send: async values => { sent.push(values); }, shells: { en: { beforeForm: '<!doctype html><html lang="en"><body><main>', afterForm: '</main></body></html>' }, ar: { beforeForm: '<!doctype html><html lang="ar" dir="rtl"><body><main>', afterForm: '</main></body></html>' } }, ...overrides };
  return { deps, sent };
}
function json(values: unknown = valid, headers: HeadersInit = {}) { return new Request('https://aimansour.com/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(values) }); }

test('accepted JSON waits for one delivery and trims values', async () => {
  let complete = false;
  const { deps, sent } = setup();
  const send = deps.send;
  deps.send = async values => { await new Promise(resolve => setTimeout(resolve, 5)); await send(values); complete = true; };
  const response = await handleContact(json({ ...valid, name: ' A recruiter ' }), deps);
  assert.equal(response.status, 200); assert.equal(complete, true); assert.equal(sent.length, 1);
  assert.equal((sent[0] as { name: string }).name, 'A recruiter');
  assert.equal((await response.json()).ok, true);
});

test('delivery uses a fixed sender and recipient with the visitor as Reply-To', () => {
  const message = createContactEmail({...valid,topic:'role',locale:'en',message:'<script>visitor content</script>'});
  assert.equal(message.from.email,'contact@aimansour.com');
  assert.equal(message.to,'abdullahmansour.marketing@gmail.com');
  assert.equal(message.replyTo,'recruiter@example.com');
  assert.ok(message.text.includes('<script>visitor content</script>'));
  assert.ok(!message.html.includes('<script>')); assert.match(message.html,/&lt;script&gt;/);
});

test('exact input boundaries reject invalid submissions before delivery', async () => {
  const cases: Array<[string, unknown, number]> = [
    ['name', '', 400], ['name', 'x'.repeat(101), 400], ['name', 'x'.repeat(100), 200],
    ['email', 'bad', 400], ['email', 'a@example.com\r\nBcc:other@example.com', 400],
    ['email', 'a'.repeat(243)+'@example.com', 400], ['email', 'a'.repeat(242)+'@example.com', 200],
    ['company', 'x'.repeat(161), 400], ['company', 'x'.repeat(160), 200],
    ['message', ' ', 400], ['message', 'x'.repeat(6001), 400], ['message', 'x'.repeat(6000), 200],
    ['topic', 'newsletter', 400], ['locale', 'fr', 400], ['website', 'bot.example', 400], ['name', ['array'], 400],
  ];
  for (const [field, value, expected] of cases) {
    const { deps, sent } = setup();
    const response = await handleContact(json({ ...valid, [field]: value }), deps);
    assert.equal(response.status, expected, `${field} boundary`); assert.equal(sent.length, expected === 200 ? 1 : 0);
  }
  const { deps, sent } = setup();
  const { topic, ...withoutTopic } = valid;
  assert.equal((await handleContact(json(withoutTopic), deps)).status, 200);
  assert.equal((sent[0] as { topic: string }).topic, 'role');
});

test('request rejection, rate limiting and provider errors have distinct status codes', async () => {
  const rejectedHeaders: HeadersInit[] = [{ Origin: 'https://other.example' }, { Origin: 'null' }, { 'Sec-Fetch-Site': 'cross-site' }];
  for (const headers of rejectedHeaders) {
    const { deps, sent } = setup();
    assert.equal((await handleContact(json(valid, headers), deps)).status, 403); assert.equal(sent.length, 0);
  }
  const { deps, sent } = setup();
  assert.equal((await handleContact(new Request('https://aimansour.com/api/contact', { method: 'PUT' }), deps)).status, 405);
  assert.equal((await handleContact(new Request('https://aimansour.com/api/contact', { method: 'POST', body: 'text' }), deps)).status, 415);
  assert.equal((await handleContact(new Request('https://aimansour.com/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{bad' }), deps)).status, 400);
  assert.equal((await handleContact(new Request('https://aimansour.com/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(Object.entries(valid)).toString()+'&name=duplicate' }), deps)).status, 400);
  assert.equal(sent.length, 0);
  const limited = await handleContact(json(), setup({ checkRateLimit: async () => false }).deps);
  assert.equal(limited.status, 429); assert.equal(limited.headers.get('Retry-After'), '60');
  assert.equal((await handleContact(json(), setup({ checkRateLimit: async () => { throw Error('private'); } }).deps)).status, 500);
  const failed = await handleContact(json(), setup({ send: async () => { throw Error('secret-provider-error'); } }).deps);
  assert.equal(failed.status, 502); assert.ok(!(await failed.text()).includes('secret-provider-error'));
});

test('chunked Unicode requests obey the byte cap and Arabic errors escape retained input', async () => {
  for (const body of ['x'.repeat(32769), 'ع'.repeat(16385)]) {
    const stream = new ReadableStream({ start(controller) { const bytes = new TextEncoder().encode(body); controller.enqueue(bytes.subarray(0,100)); controller.enqueue(bytes.subarray(100)); controller.close(); } });
    const request = new Request('https://aimansour.com/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: stream, duplex: 'half' } as RequestInit);
    assert.equal((await handleContact(request, setup().deps)).status, 413);
  }
  const values = { ...valid, locale: 'ar', name: '<script>alert(1)</script>', message: '</textarea><img src=x onerror=alert(1)>' };
  const request = new Request('https://aimansour.com/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(values) });
  const failure = await handleContact(request, setup({ send: async () => { throw Error('delivery'); } }).deps);
  assert.equal(failure.status, 502); assert.match(failure.headers.get('X-Robots-Tag')!, /noindex/);
  const html = await failure.text(); assert.match(html, /lang="ar"/); assert.match(html, /&lt;script&gt;/); assert.ok(!html.includes('<script>alert(')); assert.ok(!html.includes('</textarea><img'));
  const success = await handleContact(new Request('https://aimansour.com/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ ...valid, locale: 'ar' }) }), setup().deps);
  assert.equal(success.status, 303); assert.equal(success.headers.get('Location'), '/ar/contact/thanks/');
});
