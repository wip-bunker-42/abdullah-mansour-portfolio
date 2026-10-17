type Options={request?:typeof fetch;pause?:(milliseconds:number)=>Promise<void>;attempts?:number};

// A new custom domain can be deployed before a recursive resolver sees its record.
// Only DNS propagation errors are retryable; HTTP/TLS failures reach the release gate.
export async function waitForPublicDns(url:string,{request=fetch,pause=milliseconds=>new Promise(resolve=>setTimeout(resolve,milliseconds)),attempts=31}:Options={}):Promise<Response> {
  for(let attempt=1;attempt<=attempts;attempt++) {
    try {return await request(url,{method:'HEAD',signal:AbortSignal.timeout(10_000)});}
    catch(error) {
      const code=(error as {cause?:{code?:string}}).cause?.code;
      if(!['ENOTFOUND','EAI_AGAIN'].includes(code??'')||attempt===attempts)throw error;
      await pause(10_000);
    }
  }
  throw new Error('DNS readiness needs at least one attempt');
}
