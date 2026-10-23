import assert from 'node:assert/strict'
import {readFile,writeFile} from 'node:fs/promises'
import {createHash} from 'node:crypto'
import {chromium} from 'playwright'
const url=process.env.CANARY_PUBLIC_URL||'https://vouch.mysignet.app/'
const version=Number(process.env.CANARY_PUBLIC_VERSION)
assert.ok(Number.isSafeInteger(version)&&version>0,'Set CANARY_PUBLIC_VERSION to the deployed Vouch web version.')
const publicUrl=new URL(url)
assert.ok(publicUrl.protocol==='https:'&&!publicUrl.username&&!publicUrl.password&&!publicUrl.search&&!publicUrl.hash,'Anonymous public readback needs a plain HTTPS URL without credentials or access parameters.')
const resolverOverride=process.env.CANARY_CHROMIUM_HOST_RULES
// Optional DNS mapping for a cached NXDOMAIN; TLS hostname validation stays on.
const browser=await chromium.launch({headless:true,executablePath:process.env.CANARY_CHROMIUM_EXECUTABLE,args:resolverOverride?['--host-resolver-rules='+resolverOverride]:[]})
try{
 const context=await browser.newContext({serviceWorkers:'block'}),page=await context.newPage()
 await page.goto(url);await page.locator('#optical-read-welcome').waitFor()
 const records=[]
 for(const name of ['index.html','sw.js','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png']){
  const response=await page.evaluate(async path=>{
   const r=await fetch(path,{cache:'no-store'}),bytes=new Uint8Array(await r.arrayBuffer());let binary=''
   for(let offset=0;offset<bytes.length;offset+=32768)binary+=String.fromCharCode(...bytes.subarray(offset,offset+32768))
   return{status:r.status,headers:Object.fromEntries(r.headers),base64:btoa(binary)}
  },name==='index.html'?'./':name)
  assert.equal(response.status,200,name)
  const data=Buffer.from(response.base64,'base64');assert.deepEqual(data,await readFile('local-site/'+name),name)
  if(name==='index.html'){
   assert.equal(response.headers['referrer-policy'],'no-referrer')
   assert.equal(response.headers['x-content-type-options'],'nosniff')
   assert.ok(response.headers['content-security-policy'].includes("frame-ancestors 'none'"))
   assert.ok(response.headers['cache-control'].includes('no-transform'))
  }
  records.push({file:name,sha256:createHash('sha256').update(data).digest('hex'),matches:true})
 }
 await writeFile(`local/evidence/v${version}-${publicUrl.hostname}-public-readback.json`,JSON.stringify({verified:new Date().toISOString(),url,version,...(resolverOverride?{resolverOverride,tlsHostnameValidation:true}:{}),exactPublicFiles:records,securityHeaders:true,anonymousBrowser:true,noBypassToken:true,noPrivatePayloadInRequest:true},null,2)+'\n')
 console.log('Six public files match byte-for-byte through an anonymous browser; restrictive security headers verified.')
}finally{await browser.close()}
