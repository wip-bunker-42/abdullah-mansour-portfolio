import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
export async function walkFiles(root:string):Promise<string[]> {
  const entries=await readdir(root,{withFileTypes:true});
  return (await Promise.all(entries.map(entry=>entry.isDirectory()?walkFiles(join(root,entry.name)):Promise.resolve([join(root,entry.name)])))).flat();
}
