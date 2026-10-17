import {createHash} from 'node:crypto';

export function inlineResourceHashes(html:string):{scripts:string[];styles:string[]} {
  const hash=(text:string)=>createHash('sha256').update(text).digest('base64');
  return {
    scripts:[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].filter(match=>!/\bsrc\s*=/.test(match[1]!)).map(match=>hash(match[2]!)),
    styles:[...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map(match=>hash(match[1]!)),
  };
}
