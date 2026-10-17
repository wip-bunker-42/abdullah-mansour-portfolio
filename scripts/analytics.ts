import {parse,type DefaultTreeAdapterMap} from 'parse5';

export function verifyAnalyticsInstallation(html:string,mode:'artifact'|'production'):void {
  let count=0;
  function visit(node:DefaultTreeAdapterMap['node']):void {
    if('tagName'in node&&node.tagName==='script') {
      const src=node.attrs.find(attribute=>attribute.name==='src')?.value;
      if(src){const url=new URL(src,'https://aimansour.com');if(url.hostname==='static.cloudflareinsights.com'&&url.pathname.startsWith('/beacon.min.js'))count++;}
    }
    if('childNodes'in node)node.childNodes.forEach(visit);
  }
  visit(parse(html));
  const expected=mode==='production'?1:0;
  if(count!==expected)throw new Error(`Analytics is missing, duplicated or manually embedded: expected ${expected}, got ${count} (${mode}).`);
}
