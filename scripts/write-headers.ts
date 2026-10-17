import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { inlineResourceHashes } from './csp-hashes.ts';
import { walkFiles } from './files.ts';
import { securityHeaders, contentSecurityPolicy } from '../src/lib/security.ts';
export async function writeHeaders(distDir:string):Promise<void> {
  const hashes=new Set<string>();const styles=new Set<string>();
  for(const path of (await walkFiles(distDir)).filter(p=>p.endsWith('.html'))) {
    const html=await readFile(path,'utf8');
    const inline=inlineResourceHashes(html);inline.scripts.forEach(hash=>hashes.add(hash));inline.styles.forEach(hash=>styles.add(hash));
  }
  const csp=contentSecurityPolicy([...hashes],[...styles]);
  const lines=['/*',...Object.entries({...securityHeaders,'Content-Security-Policy':csp,'Cache-Control':'public, max-age=0, must-revalidate'}).map(([key,value])=>`  ${key}: ${value}`),'','/_astro/*','  ! Cache-Control','  Cache-Control: public, max-age=31536000, immutable','','/fonts/*','  ! Cache-Control','  Cache-Control: public, max-age=31536000, immutable'];
  const rule=(path:string,headers:Record<string,string>)=>{lines.push('',path,...Object.entries(headers).map(([key,value])=>`  ${key}: ${value}`));};
  for(const path of ['/*.json','/api/profile'])rule(path,{'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET, HEAD','Access-Control-Expose-Headers':'ETag, Last-Modified'});
  rule('/*.md',{'Content-Type':'text/markdown; charset=utf-8','Access-Control-Allow-Origin':'*','Access-Control-Expose-Headers':'ETag, Last-Modified'});
  for(const path of ['/llms.txt','/llms-full.txt'])rule(path,{'Content-Type':'text/plain; charset=utf-8','Access-Control-Allow-Origin':'*'});
  rule('/sitemap.xml',{'Content-Type':'application/xml; charset=utf-8'});
  rule('/files/abdullah-mansour-cv.pdf',{'Content-Type':'application/pdf','Content-Disposition':'attachment; filename="Abdullah-Mansour-CV.pdf"'});
  for(const path of ['/404.html','/ar/404.html','/error/','/ar/error/','/contact/thanks/','/ar/contact/thanks/'])rule(path,{'X-Robots-Tag':'noindex'});
  if(lines.some(line=>line.length>2000))throw Error('A generated Cloudflare header exceeds the 2000-character limit; split the CSP rules before publishing.');
  await writeFile(join(distDir,'_headers'),lines.join('\n')+'\n');
  await mkdir('.generated',{recursive:true});await writeFile('.generated/security-headers.json',JSON.stringify({...securityHeaders,'Content-Security-Policy':csp}));
}
