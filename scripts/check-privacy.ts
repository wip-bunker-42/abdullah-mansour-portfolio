import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve, relative } from 'node:path';
import { parse, type DefaultTreeAdapterMap } from 'parse5';
import { pdfPhoneDigits } from './verify-pdf.ts';
import { walkFiles } from './files.ts';
const root=resolve('.');const digits=await pdfPhoneDigits('public/files/abdullah-mansour-cv.pdf');
const extensions=/\.(astro|css|js|mjs|cjs|ts|tsx|html|jsonc?|md|txt|xml|svg|ya?ml|toml)$/;
const tracked=execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{encoding:'utf8'}).split('\0').filter(Boolean).filter(p=>extensions.test(p)).map(p=>resolve(p));
const publicFiles=(await walkFiles('dist')).filter(p=>extensions.test(p));
function decoded(node:DefaultTreeAdapterMap['node']):string {return ('value'in node?node.value:'')+('attrs'in node?node.attrs.map(a=>a.value).join(' '):'')+('childNodes'in node?node.childNodes.map(decoded).join(' '):'');}
let scanned=0;
for(const path of new Set([...tracked,...publicFiles])) {
  let body=await readFile(path,'utf8');
  body+='\n'+body.replace(/\\u([a-fA-F0-9]{4})|\\x([a-fA-F0-9]{2})/g,(_all,u:string,x:string)=>String.fromCodePoint(parseInt(u??x,16)));
  if(path.endsWith('.html')||path.endsWith('.astro')||path.endsWith('.svg'))body+='\n'+decoded(parse(body));
  const candidates=body.match(/\+?\d[\d\s().-]{8,}\d/g)??[];
  if(candidates.some(candidate=>candidate.replace(/\D/g,'').includes(digits)))throw Error(`Private CV contact number found outside PDF: ${relative(root,path)} (value redacted).`);
  scanned++;
}
console.log(`Privacy check passed: ${scanned} source/public text artifacts; the CV contact number remains confined to the PDF.`);
