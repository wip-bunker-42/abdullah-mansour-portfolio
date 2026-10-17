import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
export async function verifyPdf(pdfPath:string):Promise<{pages:number;sha256:string}> {
  const bytes=await readFile(pdfPath);if(bytes.subarray(0,5).toString()!=='%PDF-')throw Error('CV file is not a PDF.');
  const task=getDocument({data:Uint8Array.from(bytes),useSystemFonts:false,disableFontFace:true});
  try {
    const document=await task.promise;if(!document.numPages)throw Error('CV has no pages.');
    for(let index=1;index<=document.numPages;index++) {const page=await document.getPage(index);const text=(await page.getTextContent()).items.map(item=>'str'in item?item.str:'').join(' ');if(text.trim().length<100)throw Error(`CV page ${index} lacks sufficient selectable text.`);}
    return {pages:document.numPages,sha256:createHash('sha256').update(bytes).digest('hex')};
  } finally {await task.destroy();}
}
export async function pdfPhoneDigits(pdfPath:string):Promise<string> {
  const task=getDocument({data:Uint8Array.from(await readFile(pdfPath)),useSystemFonts:false,disableFontFace:true});
  try {
    const document=await task.promise;let text='';
    for(let index=1;index<=document.numPages;index++)text+=(await(await document.getPage(index)).getTextContent()).items.map(item=>'str'in item?item.str:'').join(' ')+'\n';
    const candidates=text.match(/\+\d[\d ()-]{7,}\d/g)??[];
    if(candidates.length!==1)throw Error('CV should contain one international contact number for the privacy check.');
    return candidates[0]!.replace(/\D/g,'');
  } finally {await task.destroy();}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {const result=await verifyPdf(process.argv[2]??'public/files/abdullah-mansour-cv.pdf');console.log(`CV structural check passed: ${result.pages} pages; selectable text; SHA-256 ${result.sha256}.`);}
