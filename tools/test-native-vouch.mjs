import assert from 'node:assert/strict'
import {chromium} from 'playwright'
import {readFile,writeFile,mkdir} from 'node:fs/promises'
import {randomBytes} from 'node:crypto'
const address='https://vouch.native.test/',html=await readFile('native/web/index.html','utf8')
const browser=await chromium.launch({headless:true,executablePath:process.env.CANARY_CHROMIUM_EXECUTABLE})
const devices=[],errors=[],requests=[]
try{
 async function device(platform){
  const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});context.on('request',r=>requests.push(r.url()))
  await context.route(address+'**',route=>route.fulfill({contentType:'text/html',body:html}))
  const d={context,keys:new Map(),calls:[],radio:null,files:[],hold:false,held:[],ready:false}
  const page=await context.newPage();d.page=page;devices.push(d);page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message))
  await page.exposeBinding('nativeHost',async(_,message)=>{
   d.calls.push(message);let result={}
   switch(message.op){
    case 'ready':d.ready=message.args.cryptoAvailable;break
    case 'vaultCreate':{const credential=randomBytes(16).toString('base64'),secret=randomBytes(32).toString('base64');d.keys.set(credential,secret);result={credential,secret};break}
    case 'vaultRead':if(d.hold){d.held.push(message);return;}result={secret:d.keys.get(message.args.credential)};break
    case 'radioStart':d.radio={...message.args};result={nfc:true,ble:true};break
    case 'radioUpdate':if(d.radio?.session!==message.args.session)throw new Error('Stale native radio update');d.radio.code=message.args.code;d.radio.complete=message.args.complete;break
    case 'radioStop':if(d.radio?.session===message.args.session)d.radio=null;break
    case 'nfcRead':assert.equal(message.args.session,d.radio.session);break
    case 'shareFile':d.files.push(message.args);break
    case 'shareText':d.files.push({publicLink:message.args.text});break
    default:throw new Error('Unknown native operation')
   }
   await page.evaluate(({id,result})=>window.__vouchNativeReceive({v:1,id,result}),{id:message.id,result})
  })
  await page.addInitScript(platform=>{
   const endpoint={postMessage:raw=>{void window.nativeHost(JSON.parse(raw))}}
   if(platform==='ios')Object.defineProperty(window,'webkit',{value:{messageHandlers:{Vouch:endpoint}}})
   else window.VouchNative=endpoint
  },platform)
  await page.clock.install({time:new Date('2026-10-23T12:00:05Z')});await page.goto(address);await page.clock.setFixedTime(new Date('2026-10-23T12:00:05Z'))
  await page.waitForFunction(()=>!!window.__vouchNativeReceive);assert.equal(await page.locator('#install-welcome').isVisible(),false)
  return d
 }
 async function waitRadio(d){await d.page.waitForFunction(()=>!!document.querySelector('#meet-native-state'));for(let n=0;n<100&&!d.radio;n++)await new Promise(r=>setTimeout(r,20));assert.ok(d.radio)}
 async function feed(to,from){const value={v:1,event:'peer',session:to.radio.session,code:from.radio.code,via:'nfc'};await to.page.evaluate(value=>window.__vouchNativeReceive(value),value);await to.page.clock.runFor(150)}
 async function settle(){await new Promise(r=>setTimeout(r,150))}
 const android=await device('android'),iphone=await device('ios')
 for(const d of [android,iphone]){await d.page.locator('#create').click();await waitRadio(d)}
 const original=android.radio.code
 // Pausing the radio is independent of the encrypted meeting's lifetime.
 await android.page.evaluate(session=>window.__vouchNativeReceive({v:1,event:'paused',session,message:'Nearby paused. Your setup is saved.'}),android.radio.session)
 await android.page.locator('#meet-native-again').click();await waitRadio(android);assert.equal(android.radio.code,original)
 // Failed persistence cannot release a nonce through the native adapter.
 await android.page.evaluate(()=>{window.restoreStorage=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw new Error('Native save failed')}})
 await feed(android,iphone);await android.page.locator('#error').filter({hasText:'Native save failed'}).waitFor();assert.equal(android.radio.code,original)
 await android.page.evaluate(()=>Storage.prototype.setItem=window.restoreStorage)
 await iphone.page.locator('#meet-nfc').click();assert.ok(iphone.calls.some(c=>c.op==='nfcRead'))
 await feed(android,iphone);await android.page.locator('#meet-qr').waitFor({state:'attached'});await settle();assert.ok(android.radio.code.startsWith(original+':'))
 await feed(iphone,android);await iphone.page.locator('#meet-words').waitFor();await settle();await feed(android,iphone);await android.page.locator('#meet-words').waitFor()
 const words=await android.page.locator('#meet-words').innerText();assert.equal(await iphone.page.locator('#meet-words').innerText(),words)
 await mkdir('native/evidence',{recursive:true})
 for(const [d,name]of [[android,'android'],[iphone,'iphone']]){
  assert.equal(await d.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true)
  await d.page.locator('#meet-words').evaluate(el=>el.textContent='copper lantern meadow river');await d.page.screenshot({path:`native/evidence/${name}-connect.png`,fullPage:true})
 }
 await android.page.locator('#lock').click();await android.page.locator('#locked').waitFor();assert.equal(await android.page.locator('#meet').textContent(),'');await settle();assert.equal(android.radio,null)
 await android.page.locator('#unlock-device').click();await android.page.locator('#people').waitFor();await android.page.locator('.person-card').filter({hasText:'New person'}).click();await waitRadio(android);assert.equal(await android.page.locator('#meet-words').innerText(),words)
 for(const [d,name]of [[android,'iPhone friend'],[iphone,'Android friend']]){await d.page.locator('#meet-name').fill(name);await d.page.locator('#meet-save').click();await d.page.locator('#paired').waitFor()}
 assert.equal(await android.page.locator('#say').innerText(),await iphone.page.locator('#hear').innerText())
 await iphone.page.evaluate(()=>{document.getElementById('hear').textContent='copper dawn';document.getElementById('hear-signal').textContent='meadow river'})
 await iphone.page.screenshot({path:'native/evidence/listen.png',fullPage:true})
 await iphone.page.locator('#call-speak').click()
 await iphone.page.waitForFunction(()=>!document.body.hasAttribute('aria-busy'))
 await iphone.page.evaluate(()=>{document.getElementById('say').textContent='gentle river';document.getElementById('signal').textContent='copper meadow'})
 await iphone.page.screenshot({path:'native/evidence/speak.png',fullPage:true})
 await iphone.page.locator('#open-check').click()
 // The receiver can recognise normal/duress words without typing. A duress
 // result remains distinct after rotation and never goes to the sender/radio.
 assert.equal(await android.page.locator('#call-speak').count(),1)
 assert.equal(await android.page.locator('#check-choice-duress').isVisible(),true)
 assert.equal(await android.page.locator('#say').isVisible(),false)
 await android.page.locator('#call-speak').click();await android.page.clock.runFor(250)
 assert.equal(await android.page.locator('#signal').isVisible(),true)
 const alternative=await android.page.locator('#signal').innerText()
 await iphone.page.locator('#open-check').click()
 assert.equal(await iphone.page.locator('#check-choice-duress').count(),1)
 assert.equal(await iphone.page.locator('#check-choice-duress .choice-words').innerText(),alternative)
 assert.equal(await iphone.page.locator('#heard-input').isVisible(),false)
 const sentBefore=iphone.calls.filter(c=>['radioStart','radioUpdate','shareFile'].includes(c.op)).length
 await iphone.page.locator('#check-choice-duress').click()
 assert.equal(await iphone.page.locator('#check-result').getAttribute('role'),'alert')
 assert.match(await iphone.page.locator('#check-result').innerText(),/Duress signal/)
 await iphone.page.clock.setFixedTime(new Date('2026-10-23T12:01:05Z'));await iphone.page.clock.runFor(250)
 assert.match(await iphone.page.locator('#check-result').innerText(),/Duress signal/)
 assert.equal(iphone.calls.filter(c=>['radioStart','radioUpdate','shareFile'].includes(c.op)).length,sentBefore)
 await iphone.page.evaluate(()=>{for(const [id,value]of [['say','gentle river'],['hear','copper dawn'],['signal','—']])document.getElementById(id).textContent=value})
 await iphone.page.screenshot({path:'native/evidence/receiver-duress.png',fullPage:true})
 await iphone.page.locator('#lock').click();await iphone.page.locator('#locked').waitFor()
 assert.equal(await iphone.page.locator('#check-result').innerText(),'')
 assert.deepEqual(await iphone.page.locator('.choice-words').allTextContents(),['—','—'])
 await iphone.page.locator('#unlock-device').click();await iphone.page.locator('#people').waitFor()
 await iphone.page.locator('.person-card').filter({hasText:'Android friend'}).click();await iphone.page.locator('#open-check').click()
 await iphone.page.locator('#check-choice-normal').click();await settle()
 assert.equal(await iphone.page.locator('#check-result').getAttribute('data-result'),'match')
 assert.ok(await iphone.page.locator('#hear').evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=36))
 await iphone.page.clock.setFixedTime(new Date('2026-10-23T12:01:36Z'));await iphone.page.clock.runFor(250)
 assert.equal(await iphone.page.locator('#check-result').getAttribute('data-result'),null)
 assert.equal(await iphone.page.locator('#check-choices').isVisible(),true)
 await iphone.page.locator('#check-neither').click()
 assert.equal(await iphone.page.locator('#check-result').getAttribute('data-result'),'different')
 // Device-only keys never enter portable backup; the existing passphrase slot does.
 await android.page.locator('.brand').click();await android.page.locator('#recovery-start').click();await android.page.locator('#new-password').fill('random native recovery fixture words');await android.page.locator('#confirm-password').fill('random native recovery fixture words');await android.page.locator('#vault-create-form button[type=submit]').click();await android.page.locator('#people').waitFor();await android.page.locator('#vault-settings').evaluate(el=>el.open=true);await android.page.locator('#backup').click();await settle()
 const file=android.files.at(-1);assert.ok(file);const backup=JSON.parse(file.contents);assert.equal(backup.device,undefined)
 const restored=await device('ios');await restored.page.locator('#restore-file').setInputFiles({name:'recovery.json',mimeType:'application/json',buffer:Buffer.from(file.contents)});await restored.page.locator('#unlock-password').fill('random native recovery fixture words');await restored.page.locator('#unlock-form button').click();await restored.page.locator('.person-card').filter({hasText:'iPhone friend'}).waitFor()
 // A late system-unlock result cannot reopen a backgrounded app.
 await android.page.locator('#lock').click();android.hold=true;await android.page.locator('#unlock-device').click();await settle();assert.equal(android.held.length,1)
 await android.page.evaluate(()=>window.__vouchNativeReceive({v:1,event:'background'}));await android.page.locator('#locked').waitFor();const held=android.held[0];await android.page.evaluate(({id,result})=>window.__vouchNativeReceive({v:1,id,result}),{id:held.id,result:{secret:android.keys.get(held.args.credential)}});assert.equal(await android.page.locator('#locked').isVisible(),true)
 for(const d of devices)for(const call of d.calls)if(['radioStart','radioUpdate'].includes(call.op)){assert.match(call.args.code,/^CANARY-MEET:1:[A-Za-z0-9_-]{107}(?::[A-Za-z0-9_-]{64})?$/);assert.ok(call.args.code.length<=186)}
 assert.ok(devices.every(d=>d.ready));assert.deepEqual(errors,[]);assert.deepEqual(requests.filter(url=>url!==address),[])
 await writeFile('native/evidence/browser.json',JSON.stringify({verified:new Date().toISOString(),nativeProviders:'iOS and Android bridge stubs',realLocalCrypto:true,publicRadioCodesOnly:true,encryptedPinBeforeReveal:true,sameFixedWords:true,radioPauseResumesSameSession:true,lockResume:true,reciprocalCallWords:true,noTypingListenerCheck:true,distinctPersistentDuress:true,normalResultExpires:true,lockClearsDuressAndChoices:true,portableEncryptedRecovery:true,lateUnlockCannotReopen:true,noNetworkAfterBundledShell:true,physicalNfc:false,physicalBluetooth:false,physicalBiometrics:false,browserErrors:errors},null,2)+'\n')
 console.log('Native bridge journey passed: public exchange, persist-before-reveal, fixed comparison, lock/resume, native key wrapping, portable recovery and stopped late unlock. Radio/device providers are stubs.')
}finally{await Promise.allSettled(devices.map(d=>d.context.close()));await browser.close()}
