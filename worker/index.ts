import { handleContact } from './contact.ts';
import { createContactEmail } from './delivery.ts';
import shells from '../.generated/contact-shells.json';
export default {
  async fetch(request, env): Promise<Response> {
    if (new URL(request.url).pathname === '/api/contact') {
      return handleContact(request, {
        allowedOrigins:['https://aimansour.com','http://127.0.0.1:8787','http://localhost:8787'],
        checkRateLimit:async key=>(await env.CONTACT_RATE_LIMITER.limit({key})).success,
        send:async values=>{await env.CONTACT_EMAIL.send(createContactEmail(values));}, shells,
      });
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
