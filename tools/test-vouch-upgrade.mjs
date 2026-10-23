import assert from 'node:assert/strict'
import {execFileSync} from 'node:child_process'
import {readFile,writeFile} from 'node:fs/promises'
import {resolve,join} from 'node:path'
import {chromium} from 'playwright'
const root=resolve(import.meta.dirname,'..'),address='https://canary.upgrade.test/'
const previous='599058f'
const old=execFileSync('git',['show',previous+':canary-local.html'],{cwd:root,encoding:'utf8',maxBuffer:2_000_000})
let upgraded=false
const browser=await chromium.launch({headless:true,executablePath:process.env.CANARY_CHROMIUM_EXECUTABLE})
try{
 const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'})
 await context.route(address+'**',async route=>{
  const file=new URL(route.request().url()).pathname.slice(1)||'index.html'
  await route.fulfill({contentType:file.endsWith('.webmanifest')?'application/manifest+json':file.endsWith('.png')?'image/png':file.endsWith('.js')?'application/javascript':'text/html',body:!upgraded&&file==='index.html'?old:await readFile(join(root,'local-site',file))})
 })
 await context.addInitScript(()=>{
  const credential=()=>({rawId:new Uint8Array([1,7,9]).buffer,getClientExtensionResults:()=>({prf:{results:{first:new Uint8Array(32).fill(87).buffer}}})})
  Object.defineProperty(navigator.credentials,'create',{configurable:true,value:async()=>credential()});Object.defineProperty(navigator.credentials,'get',{configurable:true,value:async()=>credential()})
 })
 const page=await context.newPage();page.setDefaultTimeout(12000);const errors=[];page.on('pageerror',e=>errors.push(e.message))
 await page.clock.install({time:new Date('2026-10-23T12:00:05Z')});await page.goto(address);await page.clock.setFixedTime(new Date('2026-10-23T12:00:05Z'))
 await page.locator('#create').click();await page.locator('#pair-setup').waitFor();await page.locator('#finish-exchange').click();await page.locator('#quick-name').fill('Existing friend');await page.locator('#confirm-pair').click();const words=await page.locator('#say').innerText()
 await page.locator('.home').filter({visible:true}).click();await page.locator('#people-private-groups').evaluate(el=>{el.closest('details').open=true});await page.locator('#people-private-groups').click();await page.locator('#trust-group-name').fill('Existing private group');await page.locator('#trust-create-group').click();await page.locator('#trust-my-key').waitFor()
 const keeperCode=await page.locator('#private-trust .compare strong').innerText(),stored=await page.evaluate(()=>localStorage.getItem('canary.encrypted-vault.v1'))
 upgraded=true;await page.reload();assert.ok((await page.title()).startsWith('Signet Vouch'));await page.locator('#unlock-device').click();await page.locator('.person-card').filter({hasText:'Existing friend'}).click();assert.equal(await page.locator('#say').innerText(),words)
 await page.locator('.home').filter({visible:true}).click();await page.locator('#people-private-groups').click();await page.getByRole('button',{name:'Existing private group',exact:true}).click();assert.equal(await page.locator('#private-trust .compare strong').first().innerText(),keeperCode)
 assert.equal(await page.evaluate(()=>localStorage.getItem('canary.encrypted-vault.v1')),stored,'A UI upgrade must not rewrite credentials, IDs, keys or vault data')
 // The first deliberate save upgrades to v5. A real old build must refuse it without overwriting.
 await page.locator('.brand').click();await page.locator('.person-card').filter({hasText:'Existing friend'}).click();await page.locator('#person-details > summary').click();await page.locator('#person-name').fill('Existing friend renamed');await page.locator('#rename-form button').click();await page.locator('#pair-title').filter({hasText:'Existing friend renamed'}).waitFor()
 const savedV5=await page.evaluate(()=>localStorage.getItem('canary.encrypted-vault.v1'));assert.notEqual(savedV5,stored)
 upgraded=false;await page.reload();await page.locator('#unlock-device').click();await page.locator('#error').filter({hasText:'Unsupported encrypted vault payload'}).waitFor()
 assert.equal(await page.evaluate(()=>localStorage.getItem('canary.encrypted-vault.v1')),savedV5)
 upgraded=true;await page.reload();await page.locator('#unlock-device').click();await page.locator('.person-card').filter({hasText:'Existing friend renamed'}).click();assert.equal(await page.locator('#say').innerText(),words)
 assert.deepEqual(errors,[]);await writeFile(join(root,'local/evidence/vouch-upgrade.json'),JSON.stringify({verified:new Date().toISOString(),previousAppCommit:previous,sameOrigin:true,savedPairWordsPreserved:true,savedGroupKeeperPreserved:true,encryptedRecordByteForByteUnchanged:true,firstSaveUpgradePreservesWords:true,oldBuildRefusesNewPayloadWithoutOverwrite:true,credentialProvider:'PRF stub',physicalDeviceAcceptance:false,browserErrors:errors},null,2)+'\n')
 console.log('Upgrade passed: previous committed app vault reopens in Signet Vouch with identical words, group keeper and unchanged encrypted record/credentials.');await context.close()
}finally{await browser.close()}
