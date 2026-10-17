import { handleContact } from './contact.ts';
import { createContactEmail } from './delivery.ts';
import shells from '../.generated/contact-shells.json';
import securityHeaders from '../.generated/security-headers.json';
export default {
  async fetch(request, env): Promise<Response> {
    const url=new URL(request.url);
    if (url.pathname === '/api/contact') {
      const local=url.hostname==='127.0.0.1'||url.hostname==='localhost';
      const response=await handleContact(request, {
        allowedOrigins:local?['http://127.0.0.1:8787','http://localhost:8787']:['https://aimansour.com'],
        checkRateLimit:async key=>(await env.CONTACT_RATE_LIMITER.limit({key})).success,
        send:async values=>{await env.CONTACT_EMAIL.send(createContactEmail(values));}, shells,
      });
      for(const [name,value]of Object.entries(securityHeaders))response.headers.set(name,value);
      return response;
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
