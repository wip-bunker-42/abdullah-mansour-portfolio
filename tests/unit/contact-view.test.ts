import test from 'node:test';
import assert from 'node:assert/strict';
import { renderContactForm } from '../../src/contact/view.ts';

test('native recovery retains escaped values and links field errors to their inputs', () => {
  const html = renderContactForm('ar', { name: 'عبد الله <test>', email: 'person@example.com', company: 'A" & B', topic: 'project', message: '</textarea><script>x</script>', locale: 'ar', website: '' }, { email: 'البريد غير صحيح' });
  assert.match(html, /dir="ltr"[^>]*name="email"|name="email"[^>]*dir="ltr"/);
  assert.match(html, /aria-describedby="email-error"/); assert.match(html, /href="#email"/);
  assert.match(html, /role="alert"/); assert.match(html, /tabindex="-1"/);
  assert.match(html, /&lt;\/textarea&gt;&lt;script&gt;/); assert.ok(!html.includes('<script>x'));
  assert.match(html, /value="project" selected/); assert.match(html, /name="locale" value="ar"/);
});
