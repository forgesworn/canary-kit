const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./maplibre-gl-B2k4QVOw.css","./toast-BS4TNeor.js","./toast-B9jcl4rH.js","./sync-BpNoyLp8.js","./sync-DxEsw67f.js","./persona-1wVNXLV9.js","./secp256k1-C_bO5q2F.js","./sha2-CYoIH8nM.js","./hmac-DQiyGg8T.js","./connect-BbpgMgeq.js","./connect-1y3Pv6Z6.js","./profiles-T9Dne5zk.js","./profiles-XX2gcpN-.js","./nip19-Dhf5mHg-.js","./base-Ed-gKsml.js","./pure-DPIhlgK_.js","./liveness-Bi7vNZvh.js","./header-Dy8HAhFh.js","./nip44-BYfilQ3Z.js","./bip39-DvIKHvPh.js","./bip39-DavBqmoH.js","./english-DbZVR_DO.js","./english-mdr-mXCq.js","./mnemonic-CHsUp9IV.js","./mnemonic-yY5VDvYy.js","./dist-CC8yZlqR.js"])))=>i.map(i=>d[i]);
import{a as e,d as t,f as n,i as r,m as i,n as a,o,p as s,r as c,s as l,u}from"./connect-1y3Pv6Z6.js";import{c as d,f,i as p,l as m,m as h,p as g,r as _,s as v,t as y,u as b}from"./nip19-Dhf5mHg-.js";import{C as ee,S as x,T as te,_ as ne,a as re,b as S,c as C,d as ie,g as ae,h as oe,i as se,l as ce,n as le,o as w,r as T,s as E,t as ue,u as de,v as fe,w as pe,x as me,y as he}from"./header-Dy8HAhFh.js";import{t as ge}from"./secp256k1-C_bO5q2F.js";import{i as D,r as _e,t as ve}from"./pure-DPIhlgK_.js";import{n as ye,r as O,t as be}from"./nip44-BYfilQ3Z.js";import{A as xe,D as Se,E as Ce,F as we,I as Te,L as Ee,M as De,N as Oe,O as ke,P as k,T as Ae,_ as je,d as Me,f as Ne,g as Pe,h as Fe,j as Ie,k as Le,m as Re,p as ze,v as Be,y as Ve}from"./sync-DxEsw67f.js";import{t as A}from"./toast-B9jcl4rH.js";import{a as He,c as Ue,i as We,o as Ge,r as Ke}from"./profiles-XX2gcpN-.js";var qe=Object.create,Je=Object.defineProperty,Ye=Object.getOwnPropertyDescriptor,Xe=Object.getOwnPropertyNames,Ze=Object.getPrototypeOf,Qe=Object.prototype.hasOwnProperty,$e=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),et=(e,t)=>{let n={};for(var r in e)Je(n,r,{get:e[r],enumerable:!0});return t||Je(n,Symbol.toStringTag,{value:`Module`}),n},tt=(e,t,n,r)=>{if(t&&typeof t==`object`||typeof t==`function`)for(var i=Xe(t),a=0,o=i.length,s;a<o;a++)s=i[a],!Qe.call(e,s)&&s!==n&&Je(e,s,{get:(e=>t[e]).bind(null,s),enumerable:!(r=Ye(t,s))||r.enumerable});return e},nt=(e,t,n)=>(n=e==null?{}:qe(Ze(e)),tt(t||!e||!e.__esModule?Je(n,`default`,{value:e,enumerable:!0}):n,e));(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function rt(e){let t=Math.floor(e/86400);if(t>=1)return`${t}d`;let n=Math.floor(e/3600);return n>=1?`${n}h`:`${Math.floor(e/60)}m`}function it(e){return e?`
    <div class="identity-badge">
      <span class="identity-badge__name">${w(e.displayName??`${e.pubkey.slice(0,8)}…`)}</span>
    </div>
  `:``}function at(e,t){let n=Object.values(e);if(n.length===0)return`<div class="group-list__empty">No groups yet</div>`;let{activePersonaName:r,personas:i}=b();return n.map(e=>{let n=e.id===t,a=n?` group-list__item--active`:``,o=rt(e.livenessInterval),s=rt(e.livenessInterval),c=e.personaName?se(e.personaName):``,l=i[e.personaName]?.archived||r&&e.personaName!==r?` hidden`:``;return`
        <button
          class="group-list__item${a}"
          data-group-id="${w(e.id)}"
          aria-current="${n?`true`:`false`}"
          ${l}
        >
          ${c}<span class="group-list__name">${w(e.name)}</span>
          <span class="group-list__preset">${w(o)} · ${w(s)}</span>
        </button>
      `}).join(``)}function ot(e){let{identity:t,groups:n,activeGroupId:r}=b();e.innerHTML=`
    <div class="sidebar__tagline">spoken-word verification</div>
    ${it(t)}
    <nav class="group-list" aria-label="Groups">
      ${at(n,r)}
    </nav>
    <button class="btn btn--primary" id="create-group-btn">+ New Group</button>
    <button class="btn btn--sm sidebar__sync-btn" id="sync-groups-btn" title="Sync groups from other devices">Sync Groups</button>
  `,e.querySelector(`.group-list`)?.addEventListener(`click`,e=>{let t=e.target.closest(`[data-group-id]`);if(!t)return;let n=t.dataset.groupId;n&&g({activeGroupId:n})}),e.querySelector(`#create-group-btn`)?.addEventListener(`click`,()=>{e.dispatchEvent(new CustomEvent(`canary:create-group`,{bubbles:!0}))}),e.querySelector(`#sync-groups-btn`)?.addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:sync-vault`))})}var st=`app-modal`;function ct(e,t){let n=document.getElementById(st);if(n||(n=document.createElement(`dialog`),n.id=st,n.className=`modal`,document.body.appendChild(n)),n.innerHTML=`
    <form class="modal__form" method="dialog" id="modal-form">
      ${e}
    </form>
  `,t){let e=n.querySelector(`#modal-form`);e?.addEventListener(`submit`,n=>{n.preventDefault(),t(new FormData(e)),lt()})}n.addEventListener(`click`,e=>{e.target===n&&lt()}),n.showModal()}function lt(){document.getElementById(st)?.close()}var ut=/^[0-9a-f]{64}$/,dt=/^[0-9b-hjkmnp-z]+$/,ft=new TextEncoder().encode(`canary:beacon:key`),pt=new TextEncoder().encode(`canary:duress:key`);function mt(e){if(!ut.test(e))throw Error(`seedHex must be a 64-character lowercase hex string (32 bytes)`)}function ht(e){if(e.length!==32)throw Error(`AES-256-GCM requires a 32-byte key`)}function gt(e){return mt(e),we(k(e),ft)}function _t(e){return mt(e),we(k(e),pt)}async function vt(e,t){ht(e);let n=crypto.getRandomValues(new Uint8Array(12)),r=await crypto.subtle.importKey(`raw`,e,{name:`AES-GCM`},!1,[`encrypt`]),i=new Uint8Array(await crypto.subtle.encrypt({name:`AES-GCM`,iv:n},r,t)),a=new Uint8Array(12+i.length);return a.set(n),a.set(i,12),Ie(a)}async function yt(e,t,n){if(typeof t!=`string`||t.length===0||t.length>11)throw Error(`geohash must be a non-empty string of at most 11 characters`);if(!dt.test(t))throw Error(`geohash contains invalid characters (valid: 0-9, b-h, j-k, m-n, p-z)`);if(!Number.isInteger(n)||n<1||n>11)throw Error(`precision must be an integer between 1 and 11`);let r={geohash:t,precision:n,timestamp:Math.floor(Date.now()/1e3)};return vt(e,new TextEncoder().encode(JSON.stringify(r)))}function bt(e,t,n){if(!ut.test(e))throw Error(`Invalid member pubkey: expected 64 lowercase hex characters, got ${e.length} chars`);if(t){if(typeof t.geohash!=`string`||t.geohash.length===0||t.geohash.length>11)throw Error(`location.geohash must be a non-empty string of at most 11 characters`);if(!dt.test(t.geohash))throw Error(`location.geohash contains invalid characters (valid: 0-9, b-h, j-k, m-n, p-z)`);if(!Number.isInteger(t.precision)||t.precision<1||t.precision>11)throw Error(`location.precision must be an integer between 1 and 11`);return{type:`duress`,member:e,geohash:t.geohash,precision:t.precision,locationSource:t.locationSource,timestamp:Math.floor(Date.now()/1e3),scope:n?.scope??`group`,...n?.originGroupId!==void 0&&{originGroupId:n.originGroupId}}}return{type:`duress`,member:e,geohash:``,precision:0,locationSource:`none`,timestamp:Math.floor(Date.now()/1e3),scope:n?.scope??`group`,...n?.originGroupId!==void 0&&{originGroupId:n.originGroupId}}}async function xt(e,t){return vt(e,new TextEncoder().encode(JSON.stringify(t)))}function St(){let{identity:e}=b();if(!e?.pubkey)throw Error(`No local identity — cannot perform privileged action.`);return e.pubkey}function Ct(e){let t=St();if(!e.admins.includes(t))throw Error(`Not authorised — you are not an admin of "${e.name}".`)}function wt(e){let t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function Tt(e,t,n,r){let i=crypto.randomUUID(),a=ze({name:e,members:n?[n]:[],preset:t,creator:n}),o=b().settings,s=[...o.defaultReadRelays??o.defaultRelays],c=[...o.defaultWriteRelays??o.defaultRelays],l={family:`words`,"field-ops":`words`,enterprise:`words`,event:`pin`},u={...a,id:i,nostrEnabled:c.length>0||s.length>0,relays:c,readRelays:s,writeRelays:c,encodingFormat:l[t]??`words`,usedInvites:[],latestInviteIssuedAt:0,livenessInterval:a.rotationInterval,livenessCheckins:{},tolerance:1,memberNames:{},duressMode:`immediate`,personaName:r??`personal`},{groups:d}=b();return g({groups:{...d,[i]:u},activeGroupId:i}),n&&E(i,{type:`member-join`,pubkey:n,timestamp:Math.floor(Date.now()/1e3),epoch:0,opId:crypto.randomUUID()}),i}function Et(e){let{groups:t,activeGroupId:n,deletedGroupIds:r}=b(),i={...t};delete i[e];let a=r.includes(e)?r:[...r,e];g({groups:i,activeGroupId:n===e?null:n,deletedGroupIds:a}),document.dispatchEvent(new CustomEvent(`canary:vault-publish-now`))}function Dt(e){let{groups:t}=b(),n=t[e];if(!n){console.warn(`[canary:actions] reseedGroup: unknown group id "${e}"`);return}Ct(n);let r=Fe(n),i=(n.epoch??0)+1,a=crypto.randomUUID(),o=[...n.admins??[]];E(e,{type:`reseed`,seed:wt(r.seed),counter:r.counter,timestamp:Math.floor(Date.now()/1e3),epoch:i,opId:a,admins:o,members:[...n.members]}),h(e,{...r,epoch:i,consumedOps:[a],admins:o}),ce(e)}function Ot(e){let{groups:t}=b(),n=t[e];if(!n){console.warn(`[canary:actions] compromiseReseed: unknown group id "${e}"`);return}Ct(n);let r=Fe(n),i=(n.epoch??0)+1;h(e,{...r,epoch:i,consumedOps:[],admins:[...n.admins??[]]}),ce(e)}function kt(e,t,n){let{groups:r}=b(),i=r[e];if(!i){console.warn(`[canary:actions] addGroupMember: unknown group id "${e}"`);return}Ct(i);let a=crypto.randomUUID();h(e,{...Me(i,t),consumedOps:[...i.consumedOps??[],a]}),ce(e),E(e,{type:`member-join`,pubkey:t,displayName:n||void 0,timestamp:Math.floor(Date.now()/1e3),epoch:i.epoch??0,opId:a})}function At(e,t){let{groups:n}=b(),r=n[e];if(!r){console.warn(`[canary:actions] removeGroupMember: unknown group id "${e}"`);return}if(t!==St()&&Ct(r),!r.members.includes(t))return;let i=Fe(Re(r,t)),a=(r.epoch??0)+1,o={...r.memberNames??{}};delete o[t];let s={...r.livenessCheckins??{}};delete s[t];let c=(r.admins??[]).filter(e=>e!==t);h(e,{...i,memberNames:o,livenessCheckins:s,admins:c,epoch:a,consumedOps:[]}),ce(e)}function jt(e){let{groups:t}=b(),n=t[e];if(!n){console.warn(`[canary:actions] burnWord: unknown group id "${e}"`);return}let r=Ne(n);h(e,r),E(e,{type:`counter-advance`,counter:r.counter,usageOffset:r.usageOffset,timestamp:Math.floor(Date.now()/1e3)})}var Mt=/^[0-9a-f]{64}$/;function Nt(e){if(!e||typeof e!=`object`)throw Error(`Import failed — expected a JSON object.`);let t=e;if(typeof t.name!=`string`||t.name.trim().length===0)throw Error(`Import failed — name is required.`);if(typeof t.seed!=`string`||!Mt.test(t.seed))throw Error(`Import failed — seed must be a 64-character lowercase hex string.`);if(!Array.isArray(t.members)||t.members.length===0)throw Error(`Import failed — members must be a non-empty array.`);for(let e of t.members)if(typeof e!=`string`||!Mt.test(e))throw Error(`Import failed — invalid member pubkey: "${String(e)}".`);if(Array.isArray(t.admins)){for(let e of t.admins)if(typeof e!=`string`||!Mt.test(e))throw Error(`Import failed — invalid admin pubkey: "${String(e)}".`);let e=new Set(t.members);for(let n of t.admins)if(!e.has(n))throw Error(`Import failed — admin "${n}" is not in the members list.`)}if(t.rotationInterval!==void 0&&(typeof t.rotationInterval!=`number`||!Number.isInteger(t.rotationInterval)||t.rotationInterval<=0))throw Error(`Import failed — rotationInterval must be a positive integer.`);if(t.wordCount!==void 0&&t.wordCount!==1&&t.wordCount!==2&&t.wordCount!==3)throw Error(`Import failed — wordCount must be 1, 2, or 3.`);if(t.encodingFormat!==void 0&&t.encodingFormat!==`words`&&t.encodingFormat!==`pin`&&t.encodingFormat!==`hex`)throw Error(`Import failed — encodingFormat must be words, pin, or hex.`);if(t.epoch!==void 0&&(typeof t.epoch!=`number`||!Number.isInteger(t.epoch)||t.epoch<0))throw Error(`Import failed — epoch must be a non-negative integer.`);if(t.consumedOps!==void 0&&(!Array.isArray(t.consumedOps)||!t.consumedOps.every(e=>typeof e==`string`)))throw Error(`Import failed — consumedOps must be an array of strings.`)}function Pt(e){let{groups:t}=b();if(Object.keys(t).length>0){e.hidden=!0;return}e.hidden=!1,e.innerHTML=`
    <section class="welcome">
      <h1 class="welcome__title">CANARY</h1>
      <p class="welcome__subtitle">Protect your people with rotating verification words</p>

      <div class="welcome__steps">
        <div class="welcome__step">
          <span class="welcome__step-num">01</span>
          <span class="welcome__step-text">Create a group with your family or team</span>
        </div>
        <div class="welcome__step">
          <span class="welcome__step-num">02</span>
          <span class="welcome__step-text">Share the invite — in person or via paste code</span>
        </div>
        <div class="welcome__step">
          <span class="welcome__step-num">03</span>
          <span class="welcome__step-text">Everyone derives the same word from the shared seed</span>
        </div>
        <div class="welcome__step">
          <span class="welcome__step-num">04</span>
          <span class="welcome__step-text">Words rotate automatically. Emergency words signal danger.</span>
        </div>
      </div>

      <div class="welcome__actions">
        <button class="btn btn--primary btn--lg" id="welcome-create">Create Group</button>
        <button class="btn btn--ghost btn--lg" id="welcome-join">Join with Invite</button>
      </div>
    </section>
  `,document.getElementById(`welcome-create`).addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:create-group`))}),document.getElementById(`welcome-join`).addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:join-group`))})}var j=`canary:group`;function M(e){switch(e.encodingFormat){case`pin`:return{format:`pin`,digits:6};case`hex`:return{format:`hex`,length:8};default:return{format:`words`,count:e.wordCount}}}function Ft(e,t){return t===`pin`&&e.length===6?`${e.slice(0,3)}-${e.slice(3)}`:t===`hex`&&e.length===8?`${e.slice(0,4)}-${e.slice(4)}`:e}function It(e,t){let{identity:n}=b();return n?.pubkey===e?`You`:t.memberNames?.[e]||e.slice(0,8)+`…`}var Lt=null;function Rt(){Lt!==null&&(clearInterval(Lt),Lt=null)}function zt(e=new Date){return e.toISOString().slice(11,19)+` UTC`}function Bt(e){return e.replace(/[a-zA-Z0-9]/g,`•`)}var Vt=`ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789•·∘◦○●◈◆▪▫`;function Ht(e,t,n=600){let r=t.length,i=Math.ceil(n/30),a=e=>Math.floor(e/r*i*.7)+Math.floor(i*.3),o=0,s=setInterval(()=>{o++;let n=``;for(let e=0;e<r;e++)o>=a(e)?n+=t[e]:n+=Vt[Math.floor(Math.random()*65)];e.textContent=n,o>=i&&(clearInterval(s),e.textContent=t)},30)}function Ut(e){if(e<=0)return`0s`;let t=Math.floor(e/86400),n=Math.floor(e%86400/3600),r=Math.floor(e%3600/60),i=Math.floor(e%60);return t>=1?n>0?`${t}d ${n}h`:`${t}d`:n>=1?r>0?`${n}h ${r}m`:`${n}h`:r>=1?i>0?`${r}m ${i}s`:`${r}m`:`${i}s`}function Wt(e){let t=Math.floor(Date.now()/1e3),n=(Ae(t,e.rotationInterval)+1)*e.rotationInterval;return Math.max(0,n-t)}var Gt=[`Sun`,`Mon`,`Tue`,`Wed`,`Thu`,`Fri`,`Sat`],Kt=[`Jan`,`Feb`,`Mar`,`Apr`,`May`,`Jun`,`Jul`,`Aug`,`Sep`,`Oct`,`Nov`,`Dec`];function qt(e,t){if(t>=86400){let t=new Date(Date.now()+e*1e3);return`rotates ${Gt[t.getUTCDay()]} ${t.getUTCDate()} ${Kt[t.getUTCMonth()]} at ${String(t.getUTCHours()).padStart(2,`0`)}:${String(t.getUTCMinutes()).padStart(2,`0`)} UTC (${Ut(e)})`}return`rotates in ${Ut(e)} · ${zt()}`}function Jt(e){let{identity:t}=b(),n=e.counter+e.usageOffset;return Se(e.seed,j,n,M(e),t?.pubkey)}function Yt(e){let{identity:t}=b();if(!t?.pubkey)return null;let n=e.counter+e.usageOffset;return je(e.seed,j,t.pubkey,n,M(e),e.tolerance)}function Xt(e){Rt();let{groups:t,activeGroupId:n}=b();if(!n){e.innerHTML=``;return}let r=t[n];if(!r){e.innerHTML=``;return}let a=Pe(r);if(a!==r){h(n,a);return}let o=Ft(Jt(r),r.encodingFormat),s=Yt(r),c=s?Ft(s,r.encodingFormat):null,l=Bt(o),u=Wt(r);e.innerHTML=`
    <section class="hero">

      <div class="hero__word-container">
        <div class="hero__word hero__word--masked" id="hero-word">${l}</div>
        <button
          class="hero__reveal-btn btn"
          id="hero-reveal-btn"
          type="button"
          aria-label="Hold to reveal verification word"
        >Hold to Reveal</button>
      </div>

      <div class="hero__countdown">
        <div class="hero__progress">
          <div class="hero__progress-bar" id="hero-progress-bar" style="width: ${Math.min(100,Math.max(0,(r.rotationInterval-u)/r.rotationInterval*100))}%"></div>
        </div>
        <span class="hero__countdown-label" id="hero-countdown-label">${qt(u,r.rotationInterval)}</span>
      </div>

      <p class="hero__hint">Press and hold to reveal. Tap the right side for your alternate word.</p>

      <button class="btn btn--ghost" id="burn-btn" type="button" title="Rotate to a new word now. All group members will get a new word too.">I used this word</button>
      <button class="btn btn--outline" id="hero-invite-btn" type="button" title="Share group access with someone new">Invite Someone</button>
      ${r.members.length>=2?`<button class="btn btn--outline" id="hero-call-btn" type="button" title="Start a phone call verification">Verify Call</button>`:``}

    </section>
  `;let d=e.querySelector(`#hero-word`),f=e.querySelector(`#hero-reveal-btn`);function p(e){d&&(d.textContent=e&&c?c:o,d.classList.remove(`hero__word--masked`),d.classList.add(`hero__word--revealed`))}function m(){d&&(d.textContent=l,d.classList.remove(`hero__word--revealed`),d.classList.add(`hero__word--masked`))}f&&(f.addEventListener(`pointerdown`,e=>{e.preventDefault();let t=f.getBoundingClientRect();p(e.clientX-t.left>t.width/2)}),f.addEventListener(`pointerup`,m),f.addEventListener(`pointerleave`,m),f.addEventListener(`pointercancel`,m)),e.querySelector(`#burn-btn`)?.addEventListener(`click`,()=>{try{jt(n),A(i(b().groups[n]??r)===`online`?`Word rotated — syncing to group`:`Word rotated`,`success`,2e3),document.dispatchEvent(new CustomEvent(`canary:vault-publish-now`)),requestAnimationFrame(()=>{let e=document.getElementById(`hero-word`);e&&Ht(e,e.textContent??`••••••••`)})}catch(e){A(e instanceof Error?e.message:`Failed to rotate word`,`error`)}}),e.querySelector(`#hero-invite-btn`)?.addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:show-invite`,{detail:{groupId:n}}))}),e.querySelector(`#hero-call-btn`)?.addEventListener(`click`,()=>{let{identity:e}=b(),t=r.members.filter(t=>t!==e?.pubkey);if(t.length===0)return;if(t.length===1){document.dispatchEvent(new CustomEvent(`canary:verify-call`,{detail:{groupId:n,pubkey:t[0]}}));return}let i=t.map(e=>`
      <button class="btn btn--outline member-pick-btn" data-pubkey="${w(e)}" type="button" style="width:100%;text-align:left;margin-bottom:0.5rem;">
        ${w(It(e,r))}
      </button>
    `).join(``),a=document.getElementById(`member-picker`);a||(a=document.createElement(`dialog`),a.id=`member-picker`,a.className=`modal`,document.body.appendChild(a)),a.innerHTML=`
      <div class="modal__form" style="min-width:240px;">
        <h2 class="modal__title">Who are you calling?</h2>
        ${i}
        <div class="modal__actions">
          <button class="btn" id="picker-cancel" type="button">Cancel</button>
        </div>
      </div>
    `,a.querySelector(`#picker-cancel`)?.addEventListener(`click`,()=>a.close()),a.addEventListener(`click`,e=>{e.target===a&&a.close()}),a.querySelectorAll(`.member-pick-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.pubkey;a.close(),t&&document.dispatchEvent(new CustomEvent(`canary:verify-call`,{detail:{groupId:n,pubkey:t}}))})}),a.showModal()});let g=e.querySelector(`#hero-progress-bar`),_=e.querySelector(`#hero-countdown-label`);Lt=setInterval(()=>{let{groups:t}=b(),r=t[n];if(!r){Rt();return}let i=Wt(r),a=Math.min(100,Math.max(0,(r.rotationInterval-i)/r.rotationInterval*100));g&&(g.style.width=`${a}%`),_&&(_.textContent=qt(i,r.rotationInterval)),i===0&&(Rt(),Xt(e))},1e3)}var Zt=`canary:duress-dismissed`;function Qt(){try{let e=localStorage.getItem(Zt);return e?new Set(JSON.parse(e)):new Set}catch{return new Set}}function $t(e){let t=Qt();t.add(e),localStorage.setItem(Zt,JSON.stringify([...t]))}function en(e){let t=Qt();t.delete(e),localStorage.setItem(Zt,JSON.stringify([...t]))}function tn(e,t){let n=b().groups[t];if(!n)return e.slice(0,8);let{identity:r}=b();return r?.pubkey===e?`You`:n.memberNames?.[e]||`${e.slice(0,8)}\u2026${e.slice(-4)}`}function nn(e){let t=Math.floor(Date.now()/1e3)-e;if(t<30)return`just now`;if(t<60)return`${t}s ago`;let n=Math.floor(t/60);return n<60?`${n} min ago`:new Date(e*1e3).toLocaleTimeString()}function rn(e,t,n,r,i){if(!i&&Qt().has(e))return;let a=document.querySelector(`.duress-overlay`);a&&a.remove();let o=tn(e,t),s=r?nn(r):new Date().toLocaleTimeString(),c=document.createElement(`div`);c.className=`duress-overlay`,c.dataset.subject=e,c.dataset.groupId=t,c.setAttribute(`role`,`alertdialog`),c.setAttribute(`aria-label`,`${o} needs help`);let l=document.createElement(`div`);l.className=`duress-overlay__content`;let u=document.createElement(`div`);u.className=`duress-overlay__icon`,u.setAttribute(`aria-hidden`,`true`),u.textContent=`!`,l.appendChild(u);let d=document.createElement(`h1`);d.className=`duress-overlay__title`,d.textContent=o,l.appendChild(d);let f=document.createElement(`h2`);if(f.className=`duress-overlay__subtitle`,f.textContent=`NEEDS HELP`,l.appendChild(f),n&&(n.lat!==0||n.lon!==0)){let e=document.createElement(`p`);e.className=`duress-overlay__location`,e.textContent=`Last known: ${n.lat.toFixed(4)}, ${n.lon.toFixed(4)}`,l.appendChild(e)}let p=document.createElement(`p`);p.className=`duress-overlay__time`,p.textContent=s,l.appendChild(p);let m=document.createElement(`button`);m.className=`btn btn--lg duress-overlay__dismiss`,m.textContent=`I'm Responding`,m.title=`Dismiss this alert on your screen only — does not clear the duress for others`,m.addEventListener(`click`,()=>{$t(e),c.classList.remove(`duress-overlay--visible`),setTimeout(()=>c.remove(),300)}),l.appendChild(m);let h=document.createElement(`button`);h.className=`btn btn--lg duress-overlay__stand-down`,h.textContent=`Stand Down — Person is Safe`,h.title=`Broadcast to all group members that this person has been confirmed safe`,h.addEventListener(`click`,()=>{$t(e),E(t,{type:`duress-clear`,subject:e,timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID()}),c.classList.remove(`duress-overlay--visible`),setTimeout(()=>c.remove(),300);let{identity:n}=b();A(`Duress stood down for ${o} by ${n?.pubkey===e?`Self`:tn(n?.pubkey??``,t)}`,`success`)}),l.appendChild(h),c.appendChild(l),document.body.appendChild(c),requestAnimationFrame(()=>c.classList.add(`duress-overlay--visible`));function g(e){e.key===`Escape`&&(c.classList.remove(`duress-overlay--visible`),setTimeout(()=>c.remove(),300),document.removeEventListener(`keydown`,g))}document.addEventListener(`keydown`,g)}document.addEventListener(`canary:duress-clear`,(e=>{let{subject:t,clearedBy:n}=e.detail;en(t);let r=Array.from(document.querySelectorAll(`.duress-overlay`)).find(e=>e.dataset.subject===t);r&&(r.classList.remove(`duress-overlay--visible`),setTimeout(()=>r.remove(),300));let i=e.detail.groupId,a=tn(t,i),o=tn(n,i);A(t===n?`${a} self-cleared their duress`:`${o} confirmed ${a} is safe`,`success`)}));function an(e){let t=new Uint32Array(1);return crypto.getRandomValues(t),t[0]%e}function on(e){let{groups:t,activeGroupId:n,identity:r}=b();if(r?.pubkey===e)return`You`;if(!n)return e.slice(0,8)+`…`;let i=t[n];return i&&i.memberNames?.[e]||e.slice(0,8)+`…`}function sn(e,t){let n=[],r=new Set(t);for(;n.length<e;){let e=xe(an(Le)).toLowerCase();r.has(e)||(r.add(e),n.push(e))}return n}function cn(e){for(let t=e.length-1;t>0;t--){let n=an(t+1);[e[t],e[n]]=[e[n],e[t]]}return e}function ln(e,t){for(let n of e)rn(n,t,void 0,Math.floor(Date.now()/1e3),!0);document.dispatchEvent(new CustomEvent(`canary:duress`,{detail:{members:e},bubbles:!0}));let{groups:n}=b(),r=n[t];if(!r)return;let i=_t(r.seed);for(let n of e)xt(i,bt(n,null)),E(t,{type:`duress-alert`,lat:0,lon:0,timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID(),subject:n})}function un(e){let{groups:t,activeGroupId:n}=b();if(!n){e.innerHTML=``;return}let r=t[n];if(!r){e.innerHTML=``;return}let{identity:i}=b(),a=r.members.filter(e=>e!==i?.pubkey);if(a.length===0){e.innerHTML=`
      <section class="panel verify-panel">
        <h2 class="panel__title">Verify Someone</h2>
        <p class="settings-hint">No other members to verify yet. Invite someone first.</p>
      </section>
    `;return}e.innerHTML=`
    <section class="panel verify-panel">
      <h2 class="panel__title">Verify Someone</h2>
      <p class="settings-hint">Who are you verifying?</p>

      <div class="verify-member-list" id="verify-member-list">
        ${a.map(e=>`<button class="verify-member-btn btn btn--outline" data-pubkey="${w(e)}" type="button">${w(on(e))}</button>`).join(``)}
      </div>

      <div id="verify-choices-area" hidden>
        <p class="settings-hint" id="verify-prompt"></p>
        <div class="verify-choices" id="verify-choices"></div>
      </div>

      <details class="verify-fallback" style="margin-top: 0.75rem;">
        <summary class="settings-hint" style="cursor: pointer;">Type manually</summary>
        <div class="verify-form" style="margin-top: 0.5rem;">
          <input class="input" id="verify-input" type="text" placeholder="${r.encodingFormat===`pin`?`Enter PIN`:`Enter word`}" autocomplete="off" spellcheck="false" />
          <button class="btn btn--primary" id="verify-btn" type="button">Verify</button>
        </div>
      </details>

      <div id="verify-result" class="verify-result" hidden></div>
      <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
        <button class="btn btn--ghost" id="verify-back" type="button" hidden>Verify another</button>
      </div>
    </section>
  `;let o=e.querySelector(`#verify-member-list`),s=e.querySelector(`#verify-choices-area`),c=e.querySelector(`#verify-choices`),l=e.querySelector(`#verify-prompt`),u=e.querySelector(`#verify-result`),d=e.querySelector(`#verify-back`);function f(e){let{groups:t,activeGroupId:n}=b();if(!n)return;let r=t[n];if(!r)return;let i=Ae(Math.floor(Date.now()/1e3),r.rotationInterval)+r.usageOffset,a=M(r),d=Se(r.seed,j,i,a,e).toLowerCase(),f=je(r.seed,j,e,i,a,r.tolerance)?.toLowerCase(),m=new Set([d]);f&&m.add(f);let h=sn(f?2:3,m),g=cn([d,...f?[f]:[],...h]);l.textContent=`Tap the word ${on(e)} just said:`,u.hidden=!0,c.innerHTML=g.map(e=>`<button class="verify-choice" data-word="${w(e)}" type="button">${w(Ft(e,r.encodingFormat))}</button>`).join(``),o.hidden=!0,s.hidden=!1,c.querySelectorAll(`.verify-choice`).forEach(t=>{t.addEventListener(`click`,()=>p(t.dataset.word??``,t,e))})}function p(e,t,n){let{groups:r,activeGroupId:i}=b();if(!i)return;let a=r[i];if(!a)return;let o=Ae(Math.floor(Date.now()/1e3),a.rotationInterval)+a.usageOffset,s=Ve(a.seed,j,o,e,a.members,{encoding:M(a),tolerance:a.tolerance}),l=s.status===`valid`,f=on(n);c.querySelectorAll(`.verify-choice`).forEach(e=>e.classList.remove(`verify-choice--correct`,`verify-choice--wrong`)),t.classList.add(l?`verify-choice--correct`:`verify-choice--wrong`),u.hidden=!1,u.className=`verify-result verify-result--${l?`valid`:`invalid`}`,u.textContent=l?`${f} is verified.`:`${f} gave the wrong word.`,d.hidden=!1,s.status===`duress`&&ln(s.identities??[],i)}e.querySelectorAll(`.verify-member-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.pubkey;t&&f(t)})}),d.addEventListener(`click`,()=>{o.hidden=!1,s.hidden=!0,u.hidden=!0,d.hidden=!0});let m=e.querySelector(`#verify-input`),h=e.querySelector(`#verify-btn`);function g(){let e=m?.value.trim().toLowerCase().replace(/-/g,``)??``;if(!e)return;let{groups:t,activeGroupId:n}=b();if(!n)return;let r=t[n];if(!r)return;let i=Ae(Math.floor(Date.now()/1e3),r.rotationInterval)+r.usageOffset,a=Ve(r.seed,j,i,e,r.members,{encoding:M(r),tolerance:r.tolerance}),o=a.status===`valid`;u.hidden=!1,u.className=`verify-result verify-result--${o?`valid`:`invalid`}`,u.textContent=o?`Verified.`:`Wrong word.`,d.hidden=!1,a.status===`duress`&&ln(a.identities??[],n)}h?.addEventListener(`click`,g),m?.addEventListener(`keydown`,e=>{e.key===`Enter`&&g()})}function dn(e){let t=JSON.stringify(e),n=new TextEncoder().encode(t),r=``;for(let e=0;e<n.length;e++)r+=String.fromCharCode(n[e]);return btoa(r)}function fn(e){let t=atob(e),n=new Uint8Array(t.length);for(let e=0;e<t.length;e++)n[e]=t.charCodeAt(e);return JSON.parse(new TextDecoder().decode(n))}function pn(e){return dn(e).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=+$/,``)}function mn(e){let t=e.replace(/-/g,`+`).replace(/_/g,`/`),n=t.length%4;return n===2?t+=`==`:n===3&&(t+=`=`),fn(t)}function hn(e){let t=``;for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return btoa(t).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=+$/,``)}function gn(e){let t=e.replace(/-/g,`+`).replace(/_/g,`/`),n=t.length%4;n===2?t+=`==`:n===3&&(t+=`=`);let r=atob(t),i=new Uint8Array(r.length);for(let e=0;e<r.length;e++)i[e]=r.charCodeAt(e);return i}var _n=/^[0-9a-f]{64}$/,vn=/^[0-9a-f]{128}$/,yn=/^[0-9a-f]{32}$/;function bn(e){let{adminSig:t,...n}=e,r=Object.keys(n).sort().reduce((e,t)=>(e[t]=n[t],e),{});return new TextEncoder().encode(JSON.stringify(r))}function xn(e){let{groupName:t,groupId:n,adminPubkey:r,adminPrivkey:i,relays:a,expiresInSec:o=86400}=e,s=new Uint8Array(16);crypto.getRandomValues(s);let c={groupName:t,groupId:n,adminPubkey:r,inviteId:De(s),expiresAt:Math.floor(Date.now()/1e3)+o,relays:[...a],adminSig:``},l=Te(bn(c));return c.adminSig=De(ge.sign(l,k(i))),c}function Sn(e){if(typeof e!=`object`||!e)throw Error(`Remote invite token must be a non-null object`);let t=e;if(typeof t.groupName!=`string`||t.groupName.length===0)throw Error(`groupName must be a non-empty string`);if(typeof t.groupId!=`string`||t.groupId.length===0)throw Error(`groupId must be a non-empty string`);if(typeof t.adminPubkey!=`string`||!_n.test(t.adminPubkey))throw Error(`adminPubkey must be a 64-character hex string`);if(typeof t.inviteId!=`string`||!yn.test(t.inviteId))throw Error(`inviteId must be a 32-character hex string`);if(typeof t.adminSig!=`string`||!vn.test(t.adminSig))throw Error(`adminSig must be a 128-character hex string`);if(!Array.isArray(t.relays)||!t.relays.every(e=>typeof e==`string`))throw Error(`relays must be an array of strings`);if(typeof t.expiresAt!=`number`||!Number.isFinite(t.expiresAt))throw Error(`expiresAt must be a finite number`);let n=Math.floor(Date.now()/1e3);if(t.expiresAt<=n)throw Error(`Remote invite token has expired`);let r=e,i=Te(bn(r));if(!ge.verify(k(r.adminSig),i,k(r.adminPubkey)))throw Error(`Remote invite token signature is invalid`)}function Cn(e){let{welcome:t,adminPrivkey:n,joinerPubkey:r}=e;return ye(JSON.stringify(t),O(k(n),r))}function wn(e){let{envelope:t,joinerPrivkey:n,adminPubkey:r,expectedInviteId:i}=e,a=be(t,O(k(n),r)),o=JSON.parse(a);if(typeof o.inviteId!=`string`||!yn.test(o.inviteId))throw Error(`Welcome payload must include a valid inviteId`);if(o.inviteId!==i)throw Error(`Welcome payload inviteId does not match the pending invite`);if(typeof o.seed!=`string`||!_n.test(o.seed))throw Error(`Welcome payload seed must be a 64-character hex string`);if(typeof o.groupId!=`string`||o.groupId.length===0)throw Error(`Welcome payload must include a non-empty groupId`);return o}function Tn(e){if(e.startsWith(`wss://`))return!0;if(e.startsWith(`ws://`))try{let t=new URL(e);return t.hostname===`localhost`||t.hostname===`127.0.0.1`||t.hostname===`[::1]`}catch{return!1}return!1}var En=/^[0-9a-f]{64}$/,Dn=/^[0-9a-f]{128}$/,On=/^[0-9a-f]{32}$/,kn=10080*60,An=300;function N(e){return typeof e==`number`&&Number.isInteger(e)&&e>=0}function jn(){let e=new Uint8Array(16);return crypto.getRandomValues(e),Array.from(e).map(e=>e.toString(16).padStart(2,`0`)).join(``)}function Mn(e){let t=e;if(!t||typeof t!=`object`)throw Error(`Invalid invite payload — expected an object.`);if(typeof t.groupId!=`string`||t.groupId.length===0)throw Error(`Invalid invite payload — groupId is required.`);if(typeof t.seed!=`string`||!En.test(t.seed))throw Error(`Invalid invite payload — seed must be 64-char hex.`);if(typeof t.groupName!=`string`||t.groupName.trim().length===0)throw Error(`Invalid invite payload — groupName is required.`);if(!Number.isInteger(t.rotationInterval)||t.rotationInterval<=0)throw Error(`Invalid invite payload — rotationInterval must be > 0.`);if(t.wordCount!==1&&t.wordCount!==2&&t.wordCount!==3)throw Error(`Invalid invite payload — wordCount must be 1, 2, or 3.`);if(typeof t.wordlist!=`string`||t.wordlist.length===0)throw Error(`Invalid invite payload — wordlist is required.`);if(!N(t.counter)||!N(t.usageOffset))throw Error(`Invalid invite payload — counter and usageOffset must be non-negative integers.`);if(typeof t.nonce!=`string`||!On.test(t.nonce))throw Error(`Invalid invite payload — nonce must be 32-char hex.`);if(!Number.isInteger(t.beaconInterval)||t.beaconInterval<=0)throw Error(`Invalid invite payload — beaconInterval must be > 0.`);if(!Number.isInteger(t.beaconPrecision)||t.beaconPrecision<1||t.beaconPrecision>11)throw Error(`Invalid invite payload — beaconPrecision must be 1..11.`);if(!Array.isArray(t.members)||!t.members.every(e=>typeof e==`string`&&En.test(e)))throw Error(`Invalid invite payload — members must be 64-char hex pubkeys.`);if(!Array.isArray(t.relays)||!t.relays.every(e=>typeof e==`string`&&Tn(e)))throw Error(`Invalid invite payload — relays must be wss:// URLs (or ws:// for localhost).`);if(t.encodingFormat!==`words`&&t.encodingFormat!==`pin`&&t.encodingFormat!==`hex`)throw Error(`Invalid invite payload — encodingFormat must be words|pin|hex.`);if(!N(t.tolerance))throw Error(`Invalid invite payload — tolerance must be a non-negative integer.`);if(t.tolerance>10)throw Error(`Invalid invite payload — tolerance must be <= 10.`);if(!N(t.issuedAt)||!N(t.expiresAt))throw Error(`Invalid invite payload — issuedAt/expiresAt must be unix seconds.`);if(t.expiresAt<=t.issuedAt)throw Error(`Invalid invite payload — expiresAt must be after issuedAt.`);if(!N(t.epoch))throw Error(`Invalid invite payload — epoch must be a non-negative integer.`);if(!Array.isArray(t.admins)||!t.admins.every(e=>typeof e==`string`&&En.test(e)))throw Error(`Invalid invite payload — admins must be 64-char hex pubkeys.`);let n=new Set(t.members);if(!t.admins.every(e=>n.has(e)))throw Error(`Invalid invite payload — all admins must be in members.`);if(t.protocolVersion===void 0||t.protocolVersion===null)throw Error(`Invalid invite payload — protocolVersion is required.`);if(t.protocolVersion!==2)throw Error(`Unsupported invite protocol version: ${t.protocolVersion} (expected: 2)`);if(typeof t.inviterPubkey!=`string`||!En.test(t.inviterPubkey))throw Error(`Invalid invite payload — inviterPubkey must be a 64-char hex pubkey.`);if(!t.admins.includes(t.inviterPubkey))throw Error(`Invalid invite payload — inviterPubkey must be in admins.`);if(typeof t.inviterSig!=`string`||!Dn.test(t.inviterSig))throw Error(`Invalid invite payload — inviterSig must be a 128-char hex Schnorr signature.`)}function Nn(e){let{inviterSig:t,memberNames:n,relays:r,...i}=e,a=Object.keys(i).sort().reduce((e,t)=>(e[t]=i[t],e),{});return new TextEncoder().encode(JSON.stringify(a))}function Pn(e,t){let n=Te(Nn(e));return De(ge.sign(n,k(t)))}function Fn(e){let t=Te(Nn(e));return ge.verify(k(e.inviterSig),t,k(e.inviterPubkey))}function In(e){let{nonce:t,relays:n,memberNames:r,...i}=e,a=JSON.stringify(i),o=new TextEncoder,s=we(k(t),o.encode(a)),c=s[0]<<25|s[1]<<17|s[2]<<9|s[3]<<1|s[4]>>7,l=c>>>22&2047,u=c>>>11&2047,d=c&2047;return`${xe(l)} ${xe(u)} ${xe(d)}`}function Ln(e){let{identity:t}=b();if(!t?.pubkey)throw Error(`No identity — sign in first.`);if(!t.privkey)throw Error(`Invite creation requires a local key (nsec). NIP-07 extensions cannot sign invites.`);if(!e.admins.includes(t.pubkey))throw Error(`Not authorised — you are not an admin of "${e.name}".`);let n=jn(),r=Math.floor(Date.now()/1e3),i={groupId:e.id,seed:e.seed,groupName:e.name,rotationInterval:e.rotationInterval,wordCount:e.wordCount,wordlist:e.wordlist,counter:e.counter,usageOffset:e.usageOffset,nonce:n,beaconInterval:e.beaconInterval,beaconPrecision:e.beaconPrecision,members:[...e.members],relays:[...e.writeRelays??e.relays??[]],encodingFormat:e.encodingFormat??`words`,tolerance:e.tolerance??1,issuedAt:r,expiresAt:r+kn,epoch:e.epoch??0,admins:[...e.admins??[]],protocolVersion:2,inviterPubkey:t.pubkey,inviterSig:``,memberNames:{...e.memberNames}};return i.inviterSig=Pn(i,t.privkey),{payload:i,confirmCode:In(i)}}function Rn(e,t){let n;try{n=fn(e)}catch{throw Error(`Invalid invite payload — could not decode.`)}Mn(n);let r={groupId:n.groupId,seed:n.seed,groupName:n.groupName,rotationInterval:n.rotationInterval,wordCount:n.wordCount,wordlist:n.wordlist,counter:n.counter,usageOffset:n.usageOffset,nonce:n.nonce,beaconInterval:n.beaconInterval,beaconPrecision:n.beaconPrecision,members:[...n.members],relays:[...n.relays],encodingFormat:n.encodingFormat,tolerance:n.tolerance,issuedAt:n.issuedAt,expiresAt:n.expiresAt,epoch:n.epoch,admins:[...n.admins],protocolVersion:n.protocolVersion,inviterPubkey:n.inviterPubkey,inviterSig:n.inviterSig,memberNames:n.memberNames&&typeof n.memberNames==`object`?{...n.memberNames}:void 0};if(!Fn(r))throw Error(`Invite signature is invalid — the inviter could not prove control of the admin key.`);if(!t?.trim())throw Error(`Confirmation code is required — ask the sender to read it to you.`);let i=In(r);if(t.trim().replace(/[-\s]+/g,` `).toLowerCase()!==i.toLowerCase())throw Error(`Confirmation words do not match — invite may have been tampered with.`);let a=Math.floor(Date.now()/1e3);if(r.expiresAt<=a)throw Error(`Invite has expired. Ask for a new invite.`);if(r.issuedAt>a+An)throw Error(`Invite timestamp is too far in the future — check your device clock.`);return r}function zn(e,t){let{groups:n}=b(),r=n[e];return r?Array.isArray(r.usedInvites)&&r.usedInvites.includes(t):!1}function Bn(e,t){let{groups:n}=b(),r=n[e];if(!r){console.warn(`[canary:invite] consumeInvite: unknown group id "${e}"`);return}h(e,{usedInvites:Array.from(new Set([...r.usedInvites,t]))})}var Vn=10080*60;function Hn(e){let t=Object.keys(e).sort().reduce((t,n)=>(t[n]=e[n],t),{});return new TextEncoder().encode(JSON.stringify(t))}function Un(e,t){let n;try{n=fn(e)}catch{return{valid:!1,error:`Invalid join token — could not decode.`}}if(n.g!==t.groupId)return{valid:!1,error:`Join token is for a different group.`};if(typeof n.p!=`string`||!En.test(n.p))return{valid:!1,error:`Join token has invalid pubkey.`};if(typeof n.s!=`string`||!Dn.test(n.s))return{valid:!1,error:`Join token has invalid signature.`};let r=Math.floor(Date.now()/1e3);if(typeof n.t!=`number`||n.t<r-Vn)return{valid:!1,error:`Join token has expired or is stale.`};if(n.t>r+An)return{valid:!1,error:`Join token timestamp is too far in the future.`};let{s:i,...a}=n,o=Te(Hn(a));try{if(!ge.verify(k(n.s),o,k(n.p)))return{valid:!1,error:`Join token signature is invalid.`}}catch{return{valid:!1,error:`Join token signature verification failed.`}}let s=(n.w||``).toLowerCase(),c=t.tolerance??1,l=!1;for(let e=t.counter-c;e<=t.counter+c;e++)if(!(e<0)&&s===Se(t.groupSeed,t.context,e,t.encoding).toLowerCase()){l=!0;break}return l?{valid:!0,pubkey:n.p,displayName:n.n||``,word:n.w||``}:{valid:!1,error:`Join token word does not match — seed possession not proven.`}}var Wn=null;function Gn(e){let{identity:t}=b();if(!t?.pubkey)throw Error(`No identity — sign in first.`);if(!t.privkey)throw Error(`Invite creation requires a local key (nsec). NIP-07 extensions cannot sign invites.`);if(!e.admins.includes(t.pubkey))throw Error(`Not authorised — you are not an admin of "${e.name}".`);let n=e.writeRelays?.length?[...e.writeRelays]:[...b().settings.defaultWriteRelays??b().settings.defaultRelays],r=xn({groupName:e.name,groupId:e.id,adminPubkey:t.pubkey,adminPrivkey:t.privkey,relays:n}),i=pn(r);return Wn={groupId:e.id,tokenPayload:i,inviteId:r.inviteId},Wn}function Kn(e,t){let{identity:n}=b();if(!n?.privkey)throw Error(`No local identity — cannot create welcome envelope.`);if(!Wn)throw Error(`No active remote invite session — cannot create welcome envelope.`);return Cn({welcome:{inviteId:Wn.inviteId,seed:e.seed,counter:e.counter,usageOffset:e.usageOffset,epoch:e.epoch??0,wordCount:e.wordCount,rotationInterval:e.rotationInterval,groupId:e.id,groupName:e.name,wordlist:e.wordlist,beaconInterval:e.beaconInterval,beaconPrecision:e.beaconPrecision,encodingFormat:e.encodingFormat??`words`,tolerance:e.tolerance??1,members:[...e.members],admins:[...e.admins??[]],relays:[...e.writeRelays??e.relays??[]],memberNames:e.memberNames?{...e.memberNames}:void 0},adminPrivkey:n.privkey,joinerPubkey:t})}function qn(){Wn=null}function Jn(e){let t=new Uint8Array(e.length/2);for(let n=0;n<t.length;n++)t[n]=parseInt(e.substring(n*2,n*2+2),16);return t}function Yn(e){let t=``;for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,`0`);return t}var Xn={words:0,pin:1,hex:2},Zn={0:`words`,1:`pin`,2:`hex`},Qn={"en-v1":0},$n={0:`en-v1`},er=1,tr=new TextEncoder,nr=new TextDecoder;function rr(e){let t=tr.encode(e.groupId),n=tr.encode(e.groupName),r=e.admins.map(t=>{let n=e.members.indexOf(t);if(n===-1)throw Error(`Admin ${t} not found in members array`);return n}),i=178+e.members.length*32+1+r.length+1+t.length+1+n.length,a=new ArrayBuffer(i),o=new DataView(a),s=new Uint8Array(a),c=0;o.setUint8(c,er),c+=1,s.set(Jn(e.seed),c),c+=32,s.set(Jn(e.inviterPubkey),c),c+=32,s.set(Jn(e.inviterSig),c),c+=64,s.set(Jn(e.nonce),c),c+=16,o.setUint32(c,e.counter),c+=4,o.setUint16(c,e.usageOffset),c+=2,o.setUint32(c,e.epoch),c+=4,o.setUint32(c,e.rotationInterval),c+=4,o.setUint32(c,e.beaconInterval),c+=4,o.setUint8(c,e.beaconPrecision),c+=1,o.setUint8(c,e.wordCount),c+=1,o.setUint8(c,e.tolerance),c+=1,o.setUint8(c,Xn[e.encodingFormat]??0),c+=1,o.setUint8(c,Qn[e.wordlist]??0),c+=1,o.setUint32(c,e.issuedAt),c+=4,o.setUint32(c,e.expiresAt),c+=4,o.setUint8(c,e.protocolVersion),c+=1,o.setUint8(c,e.members.length),c+=1;for(let t of e.members)s.set(Jn(t),c),c+=32;o.setUint8(c,r.length),c+=1;for(let e of r)o.setUint8(c,e),c+=1;return o.setUint8(c,t.length),c+=1,s.set(t,c),c+=t.length,o.setUint8(c,n.length),c+=1,s.set(n,c),c+=n.length,s}function ir(e){let t=new DataView(e.buffer,e.byteOffset,e.byteLength),n=0,r=t.getUint8(n);if(n+=1,r!==er)throw Error(`Unsupported binary invite version: ${r}`);let i=Yn(e.slice(n,n+32));n+=32;let a=Yn(e.slice(n,n+32));n+=32;let o=Yn(e.slice(n,n+64));n+=64;let s=Yn(e.slice(n,n+16));n+=16;let c=t.getUint32(n);n+=4;let l=t.getUint16(n);n+=2;let u=t.getUint32(n);n+=4;let d=t.getUint32(n);n+=4;let f=t.getUint32(n);n+=4;let p=t.getUint8(n);n+=1;let m=t.getUint8(n);n+=1;let h=t.getUint8(n);n+=1;let g=Zn[t.getUint8(n)]??`words`;n+=1;let _=$n[t.getUint8(n)]??`en-v1`;n+=1;let v=t.getUint32(n);n+=4;let y=t.getUint32(n);n+=4;let b=t.getUint8(n);n+=1;let ee=t.getUint8(n);n+=1;let x=[];for(let t=0;t<ee;t++)x.push(Yn(e.slice(n,n+32))),n+=32;let te=t.getUint8(n);n+=1;let ne=[];for(let e=0;e<te;e++){let e=t.getUint8(n);if(n+=1,e>=x.length)throw Error(`Invalid admin index ${e} in binary invite (${x.length} members)`);ne.push(x[e])}let re=t.getUint8(n);n+=1;let S=nr.decode(e.slice(n,n+re));n+=re;let C=t.getUint8(n);n+=1;let ie=nr.decode(e.slice(n,n+C));return n+=C,{groupId:S,seed:i,groupName:ie,rotationInterval:d,wordCount:m,wordlist:_,counter:c,usageOffset:l,nonce:s,beaconInterval:f,beaconPrecision:p,members:x,relays:[],encodingFormat:g,tolerance:h,issuedAt:v,expiresAt:y,epoch:u,admins:ne,protocolVersion:b,inviterPubkey:a,inviterSig:o}}var P=function(e,t){let n=e,r=ar[t],i=null,a=0,o=null,s=[],c={},l=function(e,t){a=n*4+17,i=function(e){let t=Array(e);for(let n=0;n<e;n+=1){t[n]=Array(e);for(let r=0;r<e;r+=1)t[n][r]=null}return t}(a),u(0,0),u(a-7,0),u(0,a-7),p(),f(),h(e,t),n>=7&&m(e),o??=v(n,r,s),g(o,t)},u=function(e,t){for(let n=-1;n<=7;n+=1)if(!(e+n<=-1||a<=e+n))for(let r=-1;r<=7;r+=1)t+r<=-1||a<=t+r||(0<=n&&n<=6&&(r==0||r==6)||0<=r&&r<=6&&(n==0||n==6)||2<=n&&n<=4&&2<=r&&r<=4?i[e+n][t+r]=!0:i[e+n][t+r]=!1)},d=function(){let e=0,t=0;for(let n=0;n<8;n+=1){l(!0,n);let r=L.getLostPoint(c);(n==0||e>r)&&(e=r,t=n)}return t},f=function(){for(let e=8;e<a-8;e+=1)i[e][6]??(i[e][6]=e%2==0);for(let e=8;e<a-8;e+=1)i[6][e]??(i[6][e]=e%2==0)},p=function(){let e=L.getPatternPosition(n);for(let t=0;t<e.length;t+=1)for(let n=0;n<e.length;n+=1){let r=e[t],a=e[n];if(i[r][a]==null)for(let e=-2;e<=2;e+=1)for(let t=-2;t<=2;t+=1)e==-2||e==2||t==-2||t==2||e==0&&t==0?i[r+e][a+t]=!0:i[r+e][a+t]=!1}},m=function(e){let t=L.getBCHTypeNumber(n);for(let n=0;n<18;n+=1){let r=!e&&(t>>n&1)==1;i[Math.floor(n/3)][n%3+a-8-3]=r}for(let n=0;n<18;n+=1){let r=!e&&(t>>n&1)==1;i[n%3+a-8-3][Math.floor(n/3)]=r}},h=function(e,t){let n=r<<3|t,o=L.getBCHTypeInfo(n);for(let t=0;t<15;t+=1){let n=!e&&(o>>t&1)==1;t<6?i[t][8]=n:t<8?i[t+1][8]=n:i[a-15+t][8]=n}for(let t=0;t<15;t+=1){let n=!e&&(o>>t&1)==1;t<8?i[8][a-t-1]=n:t<9?i[8][15-t-1+1]=n:i[8][15-t-1]=n}i[a-8][8]=!e},g=function(e,t){let n=-1,r=a-1,o=7,s=0,c=L.getMaskFunction(t);for(let t=a-1;t>0;t-=2)for(t==6&&--t;;){for(let n=0;n<2;n+=1)if(i[r][t-n]==null){let a=!1;s<e.length&&(a=(e[s]>>>o&1)==1),c(r,t-n)&&(a=!a),i[r][t-n]=a,--o,o==-1&&(s+=1,o=7)}if(r+=n,r<0||a<=r){r-=n,n=-n;break}}},_=function(e,t){let n=0,r=0,i=0,a=Array(t.length),o=Array(t.length);for(let s=0;s<t.length;s+=1){let c=t[s].dataCount,l=t[s].totalCount-c;r=Math.max(r,c),i=Math.max(i,l),a[s]=Array(c);for(let t=0;t<a[s].length;t+=1)a[s][t]=255&e.getBuffer()[t+n];n+=c;let u=L.getErrorCorrectPolynomial(l),d=or(a[s],u.getLength()-1).mod(u);o[s]=Array(u.getLength()-1);for(let e=0;e<o[s].length;e+=1){let t=e+d.getLength()-o[s].length;o[s][e]=t>=0?d.getAt(t):0}}let s=0;for(let e=0;e<t.length;e+=1)s+=t[e].totalCount;let c=Array(s),l=0;for(let e=0;e<r;e+=1)for(let n=0;n<t.length;n+=1)e<a[n].length&&(c[l]=a[n][e],l+=1);for(let e=0;e<i;e+=1)for(let n=0;n<t.length;n+=1)e<o[n].length&&(c[l]=o[n][e],l+=1);return c},v=function(e,t,n){let r=sr.getRSBlocks(e,t),i=cr();for(let t=0;t<n.length;t+=1){let r=n[t];i.put(r.getMode(),4),i.put(r.getLength(),L.getLengthInBits(r.getMode(),e)),r.write(i)}let a=0;for(let e=0;e<r.length;e+=1)a+=r[e].dataCount;if(i.getLengthInBits()>a*8)throw`code length overflow. (`+i.getLengthInBits()+`>`+a*8+`)`;for(i.getLengthInBits()+4<=a*8&&i.put(0,4);i.getLengthInBits()%8!=0;)i.putBit(!1);for(;!(i.getLengthInBits()>=a*8||(i.put(236,8),i.getLengthInBits()>=a*8));)i.put(17,8);return _(i,r)};c.addData=function(e,t){t||=`Byte`;let n=null;switch(t){case`Numeric`:n=lr(e);break;case`Alphanumeric`:n=ur(e);break;case`Byte`:n=dr(e);break;case`Kanji`:n=fr(e);break;default:throw`mode:`+t}s.push(n),o=null},c.isDark=function(e,t){if(e<0||a<=e||t<0||a<=t)throw e+`,`+t;return i[e][t]},c.getModuleCount=function(){return a},c.make=function(){if(n<1){let e=1;for(;e<40;e++){let t=sr.getRSBlocks(e,r),n=cr();for(let t=0;t<s.length;t++){let r=s[t];n.put(r.getMode(),4),n.put(r.getLength(),L.getLengthInBits(r.getMode(),e)),r.write(n)}let i=0;for(let e=0;e<t.length;e++)i+=t[e].dataCount;if(n.getLengthInBits()<=i*8)break}n=e}l(!1,d())},c.createTableTag=function(e,t){e||=2,t=t===void 0?e*4:t;let n=``;n+=`<table style="`,n+=` border-width: 0px; border-style: none;`,n+=` border-collapse: collapse;`,n+=` padding: 0px; margin: `+t+`px;`,n+=`">`,n+=`<tbody>`;for(let t=0;t<c.getModuleCount();t+=1){n+=`<tr>`;for(let r=0;r<c.getModuleCount();r+=1)n+=`<td style="`,n+=` border-width: 0px; border-style: none;`,n+=` border-collapse: collapse;`,n+=` padding: 0px; margin: 0px;`,n+=` width: `+e+`px;`,n+=` height: `+e+`px;`,n+=` background-color: `,n+=c.isDark(t,r)?`#000000`:`#ffffff`,n+=`;`,n+=`"/>`;n+=`</tr>`}return n+=`</tbody>`,n+=`</table>`,n},c.createSvgTag=function(e,t,n,r){let i={};typeof arguments[0]==`object`&&(i=arguments[0],e=i.cellSize,t=i.margin,n=i.alt,r=i.title),e||=2,t=t===void 0?e*4:t,n=typeof n==`string`?{text:n}:n||{},n.text=n.text||null,n.id=n.text?n.id||`qrcode-description`:null,r=typeof r==`string`?{text:r}:r||{},r.text=r.text||null,r.id=r.text?r.id||`qrcode-title`:null;let a=c.getModuleCount()*e+t*2,o,s,l,u,d=``,f;for(f=`l`+e+`,0 0,`+e+` -`+e+`,0 0,-`+e+`z `,d+=`<svg version="1.1" xmlns="http://www.w3.org/2000/svg"`,d+=i.scalable?``:` width="`+a+`px" height="`+a+`px"`,d+=` viewBox="0 0 `+a+` `+a+`" `,d+=` preserveAspectRatio="xMinYMin meet"`,d+=r.text||n.text?` role="img" aria-labelledby="`+y([r.id,n.id].join(` `).trim())+`"`:``,d+=`>`,d+=r.text?`<title id="`+y(r.id)+`">`+y(r.text)+`</title>`:``,d+=n.text?`<description id="`+y(n.id)+`">`+y(n.text)+`</description>`:``,d+=`<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>`,d+=`<path d="`,l=0;l<c.getModuleCount();l+=1)for(u=l*e+t,o=0;o<c.getModuleCount();o+=1)c.isDark(l,o)&&(s=o*e+t,d+=`M`+s+`,`+u+f);return d+=`" stroke="transparent" fill="black"/>`,d+=`</svg>`,d},c.createDataURL=function(e,t){e||=2,t=t===void 0?e*4:t;let n=c.getModuleCount()*e+t*2,r=t,i=n-t;return _r(n,n,function(t,n){if(r<=t&&t<i&&r<=n&&n<i){let i=Math.floor((t-r)/e),a=Math.floor((n-r)/e);return c.isDark(a,i)?0:1}else return 1})},c.createImgTag=function(e,t,n){e||=2,t=t===void 0?e*4:t;let r=c.getModuleCount()*e+t*2,i=``;return i+=`<img`,i+=` src="`,i+=c.createDataURL(e,t),i+=`"`,i+=` width="`,i+=r,i+=`"`,i+=` height="`,i+=r,i+=`"`,n&&(i+=` alt="`,i+=y(n),i+=`"`),i+=`/>`,i};let y=function(e){let t=``;for(let n=0;n<e.length;n+=1){let r=e.charAt(n);switch(r){case`<`:t+=`&lt;`;break;case`>`:t+=`&gt;`;break;case`&`:t+=`&amp;`;break;case`"`:t+=`&quot;`;break;default:t+=r;break}}return t},b=function(e){e=e===void 0?2:e;let t=c.getModuleCount()*1+e*2,n=e,r=t-e,i,a,o,s,l,u={"██":`█`,"█ ":`▀`," █":`▄`,"  ":` `},d={"██":`▀`,"█ ":`▀`," █":` `,"  ":` `},f=``;for(i=0;i<t;i+=2){for(o=Math.floor((i-n)/1),s=Math.floor((i+1-n)/1),a=0;a<t;a+=1)l=`█`,n<=a&&a<r&&n<=i&&i<r&&c.isDark(o,Math.floor((a-n)/1))&&(l=` `),n<=a&&a<r&&n<=i+1&&i+1<r&&c.isDark(s,Math.floor((a-n)/1))?l+=` `:l+=`█`,f+=e<1&&i+1>=r?d[l]:u[l];f+=`
`}return t%2&&e>0?f.substring(0,f.length-t-1)+Array(t+1).join(`▀`):f.substring(0,f.length-1)};return c.createASCII=function(e,t){if(e||=1,e<2)return b(t);--e,t=t===void 0?e*2:t;let n=c.getModuleCount()*e+t*2,r=t,i=n-t,a,o,s,l,u=Array(e+1).join(`██`),d=Array(e+1).join(`  `),f=``,p=``;for(a=0;a<n;a+=1){for(s=Math.floor((a-r)/e),p=``,o=0;o<n;o+=1)l=1,r<=o&&o<i&&r<=a&&a<i&&c.isDark(s,Math.floor((o-r)/e))&&(l=0),p+=l?u:d;for(s=0;s<e;s+=1)f+=p+`
`}return f.substring(0,f.length-1)},c.renderTo2dContext=function(e,t){t||=2;let n=c.getModuleCount();for(let r=0;r<n;r++)for(let i=0;i<n;i++)e.fillStyle=c.isDark(r,i)?`black`:`white`,e.fillRect(i*t,r*t,t,t)},c};P.stringToBytes=function(e){let t=[];for(let n=0;n<e.length;n+=1){let r=e.charCodeAt(n);t.push(r&255)}return t},P.createStringToBytes=function(e,t){let n=function(){let n=hr(e),r=function(){let e=n.read();if(e==-1)throw`eof`;return e},i=0,a={};for(;;){let e=n.read();if(e==-1)break;let t=r(),o=r(),s=r(),c=String.fromCharCode(e<<8|t);a[c]=o<<8|s,i+=1}if(i!=t)throw i+` != `+t;return a}();return function(e){let t=[];for(let r=0;r<e.length;r+=1){let i=e.charCodeAt(r);if(i<128)t.push(i);else{let i=n[e.charAt(r)];typeof i==`number`?(i&255)==i?t.push(i):(t.push(i>>>8),t.push(i&255)):t.push(63)}}return t}};var F={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},ar={L:1,M:0,Q:3,H:2},I={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},L=function(){let e=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],t=1335,n=7973,r={},i=function(e){let t=0;for(;e!=0;)t+=1,e>>>=1;return t};return r.getBCHTypeInfo=function(e){let n=e<<10;for(;i(n)-i(t)>=0;)n^=t<<i(n)-i(t);return(e<<10|n)^21522},r.getBCHTypeNumber=function(e){let t=e<<12;for(;i(t)-i(n)>=0;)t^=n<<i(t)-i(n);return e<<12|t},r.getPatternPosition=function(t){return e[t-1]},r.getMaskFunction=function(e){switch(e){case I.PATTERN000:return function(e,t){return(e+t)%2==0};case I.PATTERN001:return function(e,t){return e%2==0};case I.PATTERN010:return function(e,t){return t%3==0};case I.PATTERN011:return function(e,t){return(e+t)%3==0};case I.PATTERN100:return function(e,t){return(Math.floor(e/2)+Math.floor(t/3))%2==0};case I.PATTERN101:return function(e,t){return e*t%2+e*t%3==0};case I.PATTERN110:return function(e,t){return(e*t%2+e*t%3)%2==0};case I.PATTERN111:return function(e,t){return(e*t%3+(e+t)%2)%2==0};default:throw`bad maskPattern:`+e}},r.getErrorCorrectPolynomial=function(e){let t=or([1],0);for(let n=0;n<e;n+=1)t=t.multiply(or([1,R.gexp(n)],0));return t},r.getLengthInBits=function(e,t){if(1<=t&&t<10)switch(e){case F.MODE_NUMBER:return 10;case F.MODE_ALPHA_NUM:return 9;case F.MODE_8BIT_BYTE:return 8;case F.MODE_KANJI:return 8;default:throw`mode:`+e}else if(t<27)switch(e){case F.MODE_NUMBER:return 12;case F.MODE_ALPHA_NUM:return 11;case F.MODE_8BIT_BYTE:return 16;case F.MODE_KANJI:return 10;default:throw`mode:`+e}else if(t<41)switch(e){case F.MODE_NUMBER:return 14;case F.MODE_ALPHA_NUM:return 13;case F.MODE_8BIT_BYTE:return 16;case F.MODE_KANJI:return 12;default:throw`mode:`+e}else throw`type:`+t},r.getLostPoint=function(e){let t=e.getModuleCount(),n=0;for(let r=0;r<t;r+=1)for(let i=0;i<t;i+=1){let a=0,o=e.isDark(r,i);for(let n=-1;n<=1;n+=1)if(!(r+n<0||t<=r+n))for(let s=-1;s<=1;s+=1)i+s<0||t<=i+s||n==0&&s==0||o==e.isDark(r+n,i+s)&&(a+=1);a>5&&(n+=3+a-5)}for(let r=0;r<t-1;r+=1)for(let i=0;i<t-1;i+=1){let t=0;e.isDark(r,i)&&(t+=1),e.isDark(r+1,i)&&(t+=1),e.isDark(r,i+1)&&(t+=1),e.isDark(r+1,i+1)&&(t+=1),(t==0||t==4)&&(n+=3)}for(let r=0;r<t;r+=1)for(let i=0;i<t-6;i+=1)e.isDark(r,i)&&!e.isDark(r,i+1)&&e.isDark(r,i+2)&&e.isDark(r,i+3)&&e.isDark(r,i+4)&&!e.isDark(r,i+5)&&e.isDark(r,i+6)&&(n+=40);for(let r=0;r<t;r+=1)for(let i=0;i<t-6;i+=1)e.isDark(i,r)&&!e.isDark(i+1,r)&&e.isDark(i+2,r)&&e.isDark(i+3,r)&&e.isDark(i+4,r)&&!e.isDark(i+5,r)&&e.isDark(i+6,r)&&(n+=40);let r=0;for(let n=0;n<t;n+=1)for(let i=0;i<t;i+=1)e.isDark(i,n)&&(r+=1);let i=Math.abs(100*r/t/t-50)/5;return n+=i*10,n},r}(),R=function(){let e=Array(256),t=Array(256);for(let t=0;t<8;t+=1)e[t]=1<<t;for(let t=8;t<256;t+=1)e[t]=e[t-4]^e[t-5]^e[t-6]^e[t-8];for(let n=0;n<255;n+=1)t[e[n]]=n;let n={};return n.glog=function(e){if(e<1)throw`glog(`+e+`)`;return t[e]},n.gexp=function(t){for(;t<0;)t+=255;for(;t>=256;)t-=255;return e[t]},n}(),or=function(e,t){if(e.length===void 0)throw e.length+`/`+t;let n=function(){let n=0;for(;n<e.length&&e[n]==0;)n+=1;let r=Array(e.length-n+t);for(let t=0;t<e.length-n;t+=1)r[t]=e[t+n];return r}(),r={};return r.getAt=function(e){return n[e]},r.getLength=function(){return n.length},r.multiply=function(e){let t=Array(r.getLength()+e.getLength()-1);for(let n=0;n<r.getLength();n+=1)for(let i=0;i<e.getLength();i+=1)t[n+i]^=R.gexp(R.glog(r.getAt(n))+R.glog(e.getAt(i)));return or(t,0)},r.mod=function(e){if(r.getLength()-e.getLength()<0)return r;let t=R.glog(r.getAt(0))-R.glog(e.getAt(0)),n=Array(r.getLength());for(let e=0;e<r.getLength();e+=1)n[e]=r.getAt(e);for(let r=0;r<e.getLength();r+=1)n[r]^=R.gexp(R.glog(e.getAt(r))+t);return or(n,0).mod(e)},r},sr=function(){let e=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(e,t){let n={};return n.totalCount=e,n.dataCount=t,n},n={},r=function(t,n){switch(n){case ar.L:return e[(t-1)*4+0];case ar.M:return e[(t-1)*4+1];case ar.Q:return e[(t-1)*4+2];case ar.H:return e[(t-1)*4+3];default:return}};return n.getRSBlocks=function(e,n){let i=r(e,n);if(i===void 0)throw`bad rs block @ typeNumber:`+e+`/errorCorrectionLevel:`+n;let a=i.length/3,o=[];for(let e=0;e<a;e+=1){let n=i[e*3+0],r=i[e*3+1],a=i[e*3+2];for(let e=0;e<n;e+=1)o.push(t(r,a))}return o},n}(),cr=function(){let e=[],t=0,n={};return n.getBuffer=function(){return e},n.getAt=function(t){return(e[Math.floor(t/8)]>>>7-t%8&1)==1},n.put=function(e,t){for(let r=0;r<t;r+=1)n.putBit((e>>>t-r-1&1)==1)},n.getLengthInBits=function(){return t},n.putBit=function(n){let r=Math.floor(t/8);e.length<=r&&e.push(0),n&&(e[r]|=128>>>t%8),t+=1},n},lr=function(e){let t=F.MODE_NUMBER,n=e,r={};r.getMode=function(){return t},r.getLength=function(e){return n.length},r.write=function(e){let t=n,r=0;for(;r+2<t.length;)e.put(i(t.substring(r,r+3)),10),r+=3;r<t.length&&(t.length-r==1?e.put(i(t.substring(r,r+1)),4):t.length-r==2&&e.put(i(t.substring(r,r+2)),7))};let i=function(e){let t=0;for(let n=0;n<e.length;n+=1)t=t*10+a(e.charAt(n));return t},a=function(e){if(`0`<=e&&e<=`9`)return e.charCodeAt(0)-48;throw`illegal char :`+e};return r},ur=function(e){let t=F.MODE_ALPHA_NUM,n=e,r={};r.getMode=function(){return t},r.getLength=function(e){return n.length},r.write=function(e){let t=n,r=0;for(;r+1<t.length;)e.put(i(t.charAt(r))*45+i(t.charAt(r+1)),11),r+=2;r<t.length&&e.put(i(t.charAt(r)),6)};let i=function(e){if(`0`<=e&&e<=`9`)return e.charCodeAt(0)-48;if(`A`<=e&&e<=`Z`)return e.charCodeAt(0)-65+10;switch(e){case` `:return 36;case`$`:return 37;case`%`:return 38;case`*`:return 39;case`+`:return 40;case`-`:return 41;case`.`:return 42;case`/`:return 43;case`:`:return 44;default:throw`illegal char :`+e}};return r},dr=function(e){let t=F.MODE_8BIT_BYTE,n=P.stringToBytes(e),r={};return r.getMode=function(){return t},r.getLength=function(e){return n.length},r.write=function(e){for(let t=0;t<n.length;t+=1)e.put(n[t],8)},r},fr=function(e){let t=F.MODE_KANJI,n=P.stringToBytes;(function(e,t){let r=n(e);if(r.length!=2||(r[0]<<8|r[1])!=t)throw`sjis not supported.`})(`友`,38726);let r=n(e),i={};return i.getMode=function(){return t},i.getLength=function(e){return~~(r.length/2)},i.write=function(e){let t=r,n=0;for(;n+1<t.length;){let r=(255&t[n])<<8|255&t[n+1];if(33088<=r&&r<=40956)r-=33088;else if(57408<=r&&r<=60351)r-=49472;else throw`illegal char at `+(n+1)+`/`+r;r=(r>>>8&255)*192+(r&255),e.put(r,13),n+=2}if(n<t.length)throw`illegal char at `+(n+1)},i},pr=function(){let e=[],t={};return t.writeByte=function(t){e.push(t&255)},t.writeShort=function(e){t.writeByte(e),t.writeByte(e>>>8)},t.writeBytes=function(e,n,r){n||=0,r||=e.length;for(let i=0;i<r;i+=1)t.writeByte(e[i+n])},t.writeString=function(e){for(let n=0;n<e.length;n+=1)t.writeByte(e.charCodeAt(n))},t.toByteArray=function(){return e},t.toString=function(){let t=``;t+=`[`;for(let n=0;n<e.length;n+=1)n>0&&(t+=`,`),t+=e[n];return t+=`]`,t},t},mr=function(){let e=0,t=0,n=0,r=``,i={},a=function(e){r+=String.fromCharCode(o(e&63))},o=function(e){if(e<0)throw`n:`+e;if(e<26)return 65+e;if(e<52)return 97+(e-26);if(e<62)return 48+(e-52);if(e==62)return 43;if(e==63)return 47;throw`n:`+e};return i.writeByte=function(r){for(e=e<<8|r&255,t+=8,n+=1;t>=6;)a(e>>>t-6),t-=6},i.flush=function(){if(t>0&&(a(e<<6-t),e=0,t=0),n%3!=0){let e=3-n%3;for(let t=0;t<e;t+=1)r+=`=`}},i.toString=function(){return r},i},hr=function(e){let t=e,n=0,r=0,i=0,a={};a.read=function(){for(;i<8;){if(n>=t.length){if(i==0)return-1;throw`unexpected end of file./`+i}let e=t.charAt(n);if(n+=1,e==`=`)return i=0,-1;e.match(/^\s$/)||(r=r<<6|o(e.charCodeAt(0)),i+=6)}let e=r>>>i-8&255;return i-=8,e};let o=function(e){if(65<=e&&e<=90)return e-65;if(97<=e&&e<=122)return e-97+26;if(48<=e&&e<=57)return e-48+52;if(e==43)return 62;if(e==47)return 63;throw`c:`+e};return a},gr=function(e,t){let n=e,r=t,i=Array(e*t),a={};a.setPixel=function(e,t,r){i[t*n+e]=r},a.write=function(e){e.writeString(`GIF87a`),e.writeShort(n),e.writeShort(r),e.writeByte(128),e.writeByte(0),e.writeByte(0),e.writeByte(0),e.writeByte(0),e.writeByte(0),e.writeByte(255),e.writeByte(255),e.writeByte(255),e.writeString(`,`),e.writeShort(0),e.writeShort(0),e.writeShort(n),e.writeShort(r),e.writeByte(0);let t=s(2);e.writeByte(2);let i=0;for(;t.length-i>255;)e.writeByte(255),e.writeBytes(t,i,255),i+=255;e.writeByte(t.length-i),e.writeBytes(t,i,t.length-i),e.writeByte(0),e.writeString(`;`)};let o=function(e){let t=e,n=0,r=0,i={};return i.write=function(e,i){if(e>>>i)throw`length over`;for(;n+i>=8;)t.writeByte(255&(e<<n|r)),i-=8-n,e>>>=8-n,r=0,n=0;r=e<<n|r,n+=i},i.flush=function(){n>0&&t.writeByte(r)},i},s=function(e){let t=1<<e,n=(1<<e)+1,r=e+1,a=c();for(let e=0;e<t;e+=1)a.add(String.fromCharCode(e));a.add(String.fromCharCode(t)),a.add(String.fromCharCode(n));let s=pr(),l=o(s);l.write(t,r);let u=0,d=String.fromCharCode(i[u]);for(u+=1;u<i.length;){let e=String.fromCharCode(i[u]);u+=1,a.contains(d+e)?d+=e:(l.write(a.indexOf(d),r),a.size()<4095&&(a.size()==1<<r&&(r+=1),a.add(d+e)),d=e)}return l.write(a.indexOf(d),r),l.write(n,r),l.flush(),s.toByteArray()},c=function(){let e={},t=0,n={};return n.add=function(r){if(n.contains(r))throw`dup key:`+r;e[r]=t,t+=1},n.size=function(){return t},n.indexOf=function(t){return e[t]},n.contains=function(t){return e[t]!==void 0},n};return a},_r=function(e,t,n){let r=gr(e,t);for(let i=0;i<t;i+=1)for(let t=0;t<e;t+=1)r.setPixel(t,i,n(t,i));let i=pr();r.write(i);let a=mr(),o=i.toByteArray();for(let e=0;e<o.length;e+=1)a.writeByte(o[e]);return a.flush(),`data:image/gif;base64,`+a};P.stringToBytes;function vr(e,t=4){let n=P(0,`L`);return n.addData(e),n.make(),n.createSvgTag({cellSize:t,margin:2,scalable:!0})}var yr=25519;function br(e){let t=c(),{identity:n}=b();if(!t||!n?.pubkey||!n?.privkey)return e.onError(`No relay pool or identity available.`),()=>{};let{inviteId:r,adminPubkey:i,readRelays:a,writeRelays:o,onWelcome:s,onError:l}=e,u=n.privkey;n.pubkey;let d=Array.from(new Set([...a,...o])),f=O(k(u),i),p=ye(JSON.stringify({type:`join-request`,inviteId:r}),f),m=ve({kind:yr,created_at:Math.floor(Date.now()/1e3),tags:[[`d`,r],[`p`,i]],content:p},k(u));Promise.allSettled(t.publish(o,m)).catch(()=>{});let h=t.subscribeMany(d,{kinds:[yr],"#d":[r],authors:[i]},{onevent(e){if(D(e)&&!(typeof e.content==`string`&&e.content.length>65536))try{let t=be(e.content,f),n=JSON.parse(t);n.type===`welcome`&&n.inviteId===r&&n.envelope&&(s(n.envelope),h.close())}catch{}},oneose(){}}),g=setTimeout(()=>{h.close(),l(`Timed out waiting for welcome message from admin.`)},12e4);return()=>{clearTimeout(g),h.close()}}function xr(e){let t=c(),{identity:n}=b();if(!t||!n?.pubkey||!n?.privkey)return e.onError(`No relay pool or identity available.`),()=>{};let{inviteId:r,readRelays:i,writeRelays:a,onJoinRequest:o,onError:s}=e,l=n.privkey,u=Array.from(new Set([...i,...a])),d=t.subscribeMany(u,{kinds:[yr],"#d":[r],"#p":[n.pubkey]},{onevent(e){if(D(e)&&!(typeof e.content==`string`&&e.content.length>65536))try{let t=O(k(l),e.pubkey),n=be(e.content,t),i=JSON.parse(n);i.type===`join-request`&&i.inviteId===r&&o(e.pubkey)}catch{}},oneose(){}}),f=setTimeout(()=>{d.close(),s(`Timed out waiting for join request.`)},3e5);return()=>{clearTimeout(f),d.close()}}function Sr(e){let t=c(),{identity:n}=b();if(!t||!n?.privkey)return;let{inviteId:r,joinerPubkey:i,envelope:a,writeRelays:o}=e,s=O(k(n.privkey),i),l=ye(JSON.stringify({type:`welcome`,inviteId:r,envelope:a}),s),u=ve({kind:yr,created_at:Math.floor(Date.now()/1e3),tags:[[`d`,r],[`p`,i]],content:l},k(n.privkey));Promise.allSettled(t.publish(o,u)).catch(()=>{})}var Cr=35520;function wr(e){let t=c(),{identity:n}=b();if(!t||!n?.privkey)return;let{token:r,writeRelays:i}=e,a=JSON.stringify(r),o=String(Math.floor(Date.now()/1e3)+10080*60),s=ve({kind:Cr,created_at:Math.floor(Date.now()/1e3),tags:[[`d`,r.inviteId],[`expiration`,o]],content:a},k(n.privkey));Promise.allSettled(t.publish(i,s)).catch(()=>{})}function Tr(e){let t=c();if(!t)return e.onError(`No relay pool available.`),()=>{};let{inviteId:n,readRelays:r,onToken:i,onError:a}=e,o=!1,s=t.subscribeMany(r,{kinds:[Cr],"#d":[n]},{onevent(e){if(D(e)&&!(typeof e.content==`string`&&e.content.length>65536)&&!o)try{let t=JSON.parse(e.content);t.inviteId===n&&(o=!0,i(t),s.close())}catch{}},oneose(){o||(s.close(),a(`Invite not found on relay — it may have expired.`))}}),l=setTimeout(()=>{o||(s.close(),a(`Timed out looking for invite on relay.`))},15e3);return()=>{clearTimeout(l),s.close()}}var Er=et({renderMembers:()=>Pr,showConfirmMemberModal:()=>Ir,showInviteModal:()=>jr,showShareStateModal:()=>Mr}),Dr=[210,140,30,280,60,330,170,0];function Or(e,t){let n=t.indexOf(e);return Dr[(n>=0?n:0)%Dr.length]}function kr(e,t,n,r){let i=Or(e,t),a=n[e]??0;if(a===0)return`hsl(${i}, 55%, 55%)`;let o=Math.floor(Date.now()/1e3)-a;return o<=r?`hsl(${i}, 70%, 55%)`:o<=r*1.25?`hsl(${i}, 40%, 50%)`:`#94a3b8`}function Ar(e,t,n){let{identity:r,groups:i}=b(),a=r?.pubkey===e,o;if(n){let t=i[n]?.memberNames?.[e];t&&t!==`You`&&(o=t)}return o||=He(e),a?o?`${o} (you)`:`You`:o||`${e.slice(0,8)}\u2026${e.slice(-4)}`}function jr(e,t){let n=t?.title??`Invite to Group`,r=t?.scanHint??`Scan with your phone camera to join`;t?.showConfirmMemberNote,i(e);let a=document.getElementById(`invite-modal`);a||(a=document.createElement(`dialog`),a.id=`invite-modal`,a.className=`modal`,document.body.appendChild(a),a.addEventListener(`click`,e=>{e.target===a&&(qn(),a.close())}));let o=a;function s(){o.innerHTML=`
      <div class="modal__form invite-share">
        <h2 class="modal__title">${w(n)}</h2>
        <p class="invite-hint">How are you sharing this?</p>

        <div class="invite-share__actions" style="flex-direction: column; gap: 0.75rem;">
          <button class="btn btn--primary" id="invite-qr-path" type="button">Scan QR &mdash; they're with me</button>
          <button class="btn btn--primary" id="invite-link-path" type="button">Secure Channel &mdash; Signal, WhatsApp, etc.</button>
        </div>

        <div class="modal__actions">
          <button class="btn" id="invite-close-btn" type="button">Cancel</button>
        </div>
      </div>
    `,o.querySelector(`#invite-qr-path`)?.addEventListener(`click`,u),o.querySelector(`#invite-link-path`)?.addEventListener(`click`,d),o.querySelector(`#invite-close-btn`)?.addEventListener(`click`,()=>{qn(),o.close()})}function c(t){o.innerHTML=`
      <div class="modal__form invite-share">
        <h2 class="modal__title">Step 2 of 3: Paste Join Code</h2>
        <p class="invite-hint">Ask them to open the invite and send you their join code.</p>
        <input class="input" id="remote-joincode-input" type="text" placeholder="Paste their join code here..." autocomplete="off" style="font-family: monospace; font-size: 0.85rem;">
        <p class="invite-hint" id="remote-joincode-error" style="color: var(--duress); display: none;"></p>
        <div class="modal__actions" style="gap: 0.5rem;">
          <button class="btn" id="remote-back-2" type="button">Back</button>
          <button class="btn btn--primary" id="remote-next-2" type="button">Generate Welcome</button>
        </div>
      </div>
    `,o.querySelector(`#remote-back-2`)?.addEventListener(`click`,t),o.querySelector(`#remote-next-2`)?.addEventListener(`click`,()=>{let t=o.querySelector(`#remote-joincode-input`),n=o.querySelector(`#remote-joincode-error`),r=t?.value.trim()??``;if(!/^[0-9a-f]{64}$/.test(r)){n&&(n.textContent=`Invalid join code — must be a 64-character hex public key.`,n.style.display=``);return}try{let t=b().groups[e.id];if(!t)throw Error(`Group not found.`);l(Kn(t,r),r)}catch(e){n&&(n.textContent=e instanceof Error?e.message:`Failed to create welcome envelope.`,n.style.display=``)}})}function l(t,n){o.innerHTML=`
      <div class="modal__form invite-share">
        <h2 class="modal__title">Step 3 of 3: Send Welcome</h2>
        <p class="invite-hint">Copy this encrypted message and send it back to them.</p>
        <p class="invite-hint" style="color: var(--success); font-weight: 500;">This is encrypted — only they can read it.</p>
        <div class="invite-share__actions" style="flex-direction: column; gap: 0.5rem;">
          <button class="btn btn--primary" id="remote-copy-welcome" type="button">Copy Welcome Message</button>
        </div>
        <label class="input-label" style="margin-top: 0.5rem;">Member name (optional)
          <input class="input" id="remote-joiner-name" type="text" placeholder="e.g. Alice" autocomplete="off">
        </label>
        <div class="modal__actions" style="gap: 0.5rem;">
          <button class="btn btn--primary" id="remote-done" type="button">Done</button>
        </div>
      </div>
    `,o.querySelector(`#remote-copy-welcome`)?.addEventListener(`click`,async e=>{let n=e.currentTarget;try{await navigator.clipboard.writeText(t),n.textContent=`Copied!`,n.classList.add(`btn--copied`),setTimeout(()=>{n.textContent=`Copy Welcome Message`,n.classList.remove(`btn--copied`)},2e3)}catch{}}),o.querySelector(`#remote-done`)?.addEventListener(`click`,()=>{try{let t=b().groups[e.id];if(t&&!t.members.includes(n)){let t=o.querySelector(`#remote-joiner-name`)?.value.trim()??``;kt(e.id,n,t),A(t?`${t} added to group`:`Member added to group`,`success`)}}catch(e){A(e instanceof Error?e.message:`Failed to add member`,`error`)}qn(),o.close()})}function u(){let t,i,a;try{let n=Ln(e);t=n.payload,i=n.confirmCode,a=rr(t)}catch(e){A(e instanceof Error?e.message:`Failed to create invite.`,`error`);return}let c=`${window.location.href.split(`#`)[0]}#inv/${hn(a)}`,l=vr(c);o.innerHTML=`
      <div class="modal__form invite-share">
        <h2 class="modal__title">${w(n)}</h2>

        <div class="qr-container" data-url="${w(c)}">${l}</div>
        <p class="invite-hint">${w(r)}</p>
        <p class="invite-hint" style="color: var(--duress); font-weight: 500;">Contains the group key &mdash; only share in person.</p>

        <div style="margin: 1rem 0; padding: 0.75rem; border-radius: 0.5rem; background: var(--surface-alt, rgba(255,255,255,0.05));">
          <p class="invite-hint" style="font-weight: 600; margin-bottom: 0.25rem;">Read these words aloud:</p>
          <p style="font-size: 1.25rem; font-weight: 700; letter-spacing: 0.05em; text-align: center;">${w(i)}</p>
        </div>

        <div class="modal__actions" style="gap: 0.5rem;">
          <button class="btn" id="invite-back-btn" type="button">Back</button>
          <button class="btn" id="invite-done-btn" type="button">Done</button>
        </div>
      </div>
    `,o.querySelector(`#invite-back-btn`)?.addEventListener(`click`,()=>{s()}),o.querySelector(`#invite-done-btn`)?.addEventListener(`click`,()=>{o.close()})}function d(){let t;try{t=Gn(e)}catch(e){A(e instanceof Error?e.message:`Failed to create remote invite.`,`error`);return}let n=`${window.location.href.split(`#`)[0]}#j/${t.inviteId}`,r=e.readRelays?.length?e.readRelays:b().settings.defaultReadRelays,i=e.writeRelays?.length?e.writeRelays:b().settings.defaultWriteRelays;C(r,i).then(()=>{wr({token:mn(t.tokenPayload),writeRelays:i})});let a=()=>{};o.innerHTML=`
      <div class="modal__form invite-share">
        <h2 class="modal__title">Send Invite Link</h2>
        <p class="invite-hint">Copy this link and send it via Signal, WhatsApp, or any secure channel.</p>
        <p class="invite-hint" style="color: var(--duress); font-weight: 500;">This link does NOT contain the group secret — it's safe to send.</p>

        <div class="invite-share__actions" style="flex-direction: column; gap: 0.5rem;">
          <button class="btn btn--primary" id="remote-copy-link" type="button">Copy Link</button>
        </div>

        <p class="invite-hint" id="remote-relay-status" style="color: var(--text-muted); margin-top: 1rem;">Waiting for them to open the link...</p>

        <details style="margin-top: 1rem;">
          <summary class="invite-hint" style="cursor: pointer; color: var(--text-muted);">Manual fallback (if relay is unavailable)</summary>
          <div style="margin-top: 0.5rem;">
            <button class="btn btn--sm" id="remote-manual-fallback" type="button">Switch to manual steps</button>
          </div>
        </details>

        <div class="modal__actions" style="gap: 0.5rem;">
          <button class="btn" id="remote-back-btn" type="button">Back</button>
        </div>
      </div>
    `,o.querySelector(`#remote-copy-link`)?.addEventListener(`click`,async e=>{let t=e.currentTarget;try{await navigator.clipboard.writeText(n),t.textContent=`Copied!`,t.classList.add(`btn--copied`),setTimeout(()=>{t.textContent=`Copy Link`,t.classList.remove(`btn--copied`)},2e3)}catch{}}),C(r,i).then(()=>{a=xr({inviteId:t.inviteId,readRelays:r,writeRelays:i,onJoinRequest(n){a();try{let r=b().groups[e.id];if(!r)return;let a=Kn(r,n);Sr({inviteId:t.inviteId,joinerPubkey:n,envelope:a,writeRelays:i}),r.members.includes(n)||kt(e.id,n),qn(),o.close(),A(`Member joined via relay`,`success`)}catch(e){A(e instanceof Error?e.message:`Failed to send welcome`,`error`)}},onError(e){let t=o.querySelector(`#remote-relay-status`);t&&(t.textContent=e||`Relay unavailable — use manual fallback below.`)}})}),o.querySelector(`#remote-manual-fallback`)?.addEventListener(`click`,()=>{a(),c(()=>{a=()=>{},d()})}),o.querySelector(`#remote-back-btn`)?.addEventListener(`click`,()=>{a(),qn(),s()})}s(),a.showModal()}function Mr(e){jr(e,{title:`Share Group State`,scanHint:`Share with existing members to sync the latest group state.`,showConfirmMemberNote:!1})}function Nr(e,t){let{identity:n,groups:r}=b(),i=r[t],a=n?.pubkey===e,o=i?.admins.includes(e)??!1,s=Ar(e,i?.members??[],t),c=Ge(e),l=i?.memberNames?.[e],u=i?.livenessCheckins?.[e],d=`Never checked in`;if(u){let e=Math.floor(Date.now()/1e3)-u;d=e<60?`Active now`:e<3600?`${Math.floor(e/60)}m ago`:`${Math.floor(e/3600)}h ago`}let f=[a?`<span class="member-detail__badge">You</span>`:``,o?`<span class="member-detail__badge member-detail__badge--admin">Admin</span>`:``].filter(Boolean).join(` `),p=c?.display_name||c?.name,m=(e,t)=>`<div class="member-detail__row"><span class="member-detail__label">${e}</span><span class="member-detail__value">${w(t)}</span></div>`,h=[m(`Pubkey`,`${e.slice(0,16)}…${e.slice(-8)}`)];p&&h.push(m(`Nostr name`,p)),c?.nip05&&h.push(m(`NIP-05`,c.nip05)),c?.about&&h.push(m(`About`,c.about.length>80?c.about.slice(0,80)+`…`:c.about)),c?.lud16&&h.push(m(`Lightning`,c.lud16)),c?.website&&h.push(m(`Website`,c.website)),l&&l!==`You`&&l!==p&&h.push(m(`Display name`,l)),h.push(m(`Liveness`,d)),c||h.push(`<div class="member-detail__row"><span class="member-detail__label" style="color: var(--text-muted); font-style: italic;">No Nostr profile found on relay</span></div>`),ct(`
    <div class="member-detail__header">
      ${c?.picture?`<img class="member-detail__avatar" src="${w(c.picture)}" alt="" />`:``}
      <div>
        <h2 class="modal__title" style="margin:0;">${w(s)} ${f}</h2>
      </div>
    </div>
    <div class="member-detail__rows">${h.join(``)}</div>
    <div class="modal__actions">
      <button class="btn btn--sm" id="member-detail-copy" type="button">Copy Pubkey</button>
      <button class="btn" id="modal-cancel-btn" type="button">Close</button>
    </div>
  `,()=>{}),requestAnimationFrame(()=>{document.getElementById(`member-detail-copy`)?.addEventListener(`click`,async()=>{try{await navigator.clipboard.writeText(e);let t=document.getElementById(`member-detail-copy`);t.textContent=`Copied!`,setTimeout(()=>{t.textContent=`Copy Pubkey`},1500)}catch{}}),document.getElementById(`modal-cancel-btn`)?.addEventListener(`click`,()=>{document.getElementById(`app-modal`)?.close()})})}function Pr(e){let{groups:t,activeGroupId:n}=b();if(!n){e.innerHTML=``;return}let r=t[n];if(!r){e.innerHTML=``;return}let{identity:i}=b(),a=!!i?.pubkey&&r.admins.includes(i.pubkey);We(r.members,n),e.innerHTML=`
    <section class="panel members-panel">
      <h2 class="panel__title">Members</h2>
      <ul class="member-list">
        ${r.members.length>0?r.members.map(e=>{let t=kr(e,r.members,r.livenessCheckins??{},r.livenessInterval),i=Ge(e),o=i?.picture?`<img src="${w(i.picture)}" alt="" style="width:24px;height:24px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid ${t};box-shadow:0 0 6px ${t}80;" />`:`<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${t};flex-shrink:0;box-shadow:0 0 6px ${t}80;"></span>`;return`
          <li class="member-item" data-pubkey="${w(e)}">
            ${o}
            <button class="member-item__name-btn" data-pubkey="${w(e)}" type="button">${w(Ar(e,r.members,n))}</button>
            ${a?`<button
              class="btn btn--sm member-item__remove"
              data-pubkey="${w(e)}"
              type="button"
              aria-label="Remove member"
            >\u2715</button>`:``}
          </li>`}).join(``):`<li class="member-item member-item--empty">No members yet.</li>`}
      </ul>
      ${a?`<div class="members-actions">
        <button class="btn btn--sm" id="invite-btn" type="button" title="Invite a new person to join this group">+ Invite</button>
        <button class="btn btn--sm" id="share-state-btn" type="button" title="Share the latest group state with existing members after changes">Share State</button>
        <button class="btn btn--sm" id="confirm-member-btn" type="button" title="Verify and add a member using their acknowledgement token or verification word">Confirm Member</button>
      </div>`:``}
    </section>
  `,e.querySelectorAll(`.member-item__name-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.pubkey;t&&Nr(t,n)})}),e.querySelector(`.member-list`)?.addEventListener(`click`,e=>{let t=e.target.closest(`.member-item__remove`);if(!t)return;let r=t.dataset.pubkey;if(!r)return;let{groups:i}=b(),a=i[n]?.members??[];if(!confirm(`Remove ${Ar(r,a,n)} from the group?\n\nThis rotates the group secret immediately. Remaining members must re-join using a fresh invite.`))return;let{activeGroupId:o}=b();if(!o)return;At(o,r);let{groups:s}=b(),c=s[o];c&&c.members.length>0&&Mr(c)}),e.querySelector(`#invite-btn`)?.addEventListener(`click`,()=>{let{groups:e,activeGroupId:t}=b();if(!t)return;let n=e[t];n&&jr(n)}),e.querySelector(`#share-state-btn`)?.addEventListener(`click`,()=>{let{groups:e,activeGroupId:t}=b();if(!t)return;let n=e[t];n&&Mr(n)}),e.querySelector(`#confirm-member-btn`)?.addEventListener(`click`,()=>{Ir()})}function Fr(e,t,n){let{groups:r,identity:i}=b(),a=r[e];if(!a||!i?.pubkey||!a.admins.includes(i.pubkey))return!1;a.members.includes(t)||kt(e,t,n);let o=b().groups[e];return o&&n&&h(e,{memberNames:{...o.memberNames,[t]:n}}),!0}function Ir(e){let{groups:t,activeGroupId:n}=b();n&&t[n]&&(ct(`
    <h2 class="modal__title">Confirm Member</h2>

    <label class="input-label">Acknowledgement link or token
      <textarea name="ackToken" class="input" rows="2" placeholder="Paste #ack/... link or token">${w(e??``)}</textarea>
    </label>

    <div class="confirm-member__divider">
      <span>— or verify by word —</span>
    </div>

    <label class="input-label">Verification word
      <input name="word" class="input" placeholder="e.g. sparrow">
    </label>
    <label class="input-label">Member name
      <input name="memberName" class="input" placeholder="e.g. Alice">
    </label>

    <div class="modal__actions">
      <button type="button" class="btn" id="modal-cancel-btn">Cancel</button>
      <button type="submit" class="btn btn--primary">Confirm</button>
    </div>
  `,e=>{try{let t=e.get(`ackToken`)?.trim(),n=e.get(`word`)?.trim().toLowerCase(),r=e.get(`memberName`)?.trim(),{activeGroupId:i}=b();if(!i)throw Error(`No active group.`);let{groups:a}=b(),o=a[i];if(!o)throw Error(`Group not found.`);if(t){let e=Un(t.includes(`#ack/`)?decodeURIComponent(t.split(`#ack/`)[1]):t,{groupId:i,groupSeed:o.seed,counter:o.counter+(o.usageOffset??0),context:`canary:group`,encoding:M(o),tolerance:o.tolerance??1});if(!e.valid)throw Error(e.error??`Invalid join token.`);if(!Fr(i,e.pubkey,e.displayName||r||``))throw Error(`Member could not be added — they may already be in the group or you are not an admin.`);A(`${e.displayName||`Member`} has joined the group`,`success`)}else if(n){if(!r)throw Error(`Please enter the member name.`);let e=o.counter+(o.usageOffset??0);if(n!==Se(o.seed,`canary:group`,e,M(o)).toLowerCase())throw Error(`Word does not match — the member may not have the current group key.`);let t=new Uint8Array(32);if(crypto.getRandomValues(t),!Fr(i,Array.from(t,e=>e.toString(16).padStart(2,`0`)).join(``),r))throw Error(`Member could not be added — you may not be an admin of this group.`);A(`${r} has joined the group`,`success`)}else throw Error(`Provide either an ack token or a verification word.`)}catch(e){throw alert(e instanceof Error?e.message:`Confirmation failed.`),e}}),requestAnimationFrame(()=>{document.getElementById(`modal-cancel-btn`)?.addEventListener(`click`,()=>{document.getElementById(`app-modal`)?.close()})}))}var Lr=`0123456789bcdefghjkmnpqrstuvwxyz`,Rr=Object.create(null);for(let e=0;e<32;e++)Rr[Lr[e]]=e;function zr(e){for(let t of e)if(!(t in Rr))throw TypeError(`Invalid geohash character: '${t}' in "${e}"`)}function Br(e,t,n=5){if(!Number.isFinite(e)||e<-90||e>90)throw RangeError(`Invalid latitude: ${e}`);if(!Number.isFinite(t)||t<-180||t>180)throw RangeError(`Invalid longitude: ${t}`);if(!Number.isFinite(n)||(n=Math.round(n),n<1))throw RangeError(`Invalid precision: ${n}`);n=Math.min(12,n);let r=-90,i=90,a=-180,o=180,s=``,c=0,l=0,u=!0;for(;s.length<n;){if(u){let e=(a+o)/2;t>=e?(l|=1<<4-c,a=e):o=e}else{let t=(r+i)/2;e>=t?(l|=1<<4-c,r=t):i=t}u=!u,c++,c===5&&(s+=Lr[l],c=0,l=0)}return s}function Vr(e){if(e.length===0)throw TypeError(`Cannot decode an empty geohash`);let t=Hr(e);return{lat:(t.minLat+t.maxLat)/2,lon:(t.minLon+t.maxLon)/2,error:{lat:(t.maxLat-t.minLat)/2,lon:(t.maxLon-t.minLon)/2}}}function Hr(e){zr(e);let t=-90,n=90,r=-180,i=180,a=!0;for(let o of e){let e=Rr[o];for(let o=4;o>=0;o--){if(a){let t=(r+i)/2;e>>o&1?r=t:i=t}else{let r=(t+n)/2;e>>o&1?t=r:n=r}a=!a}}return{minLat:t,maxLat:n,minLon:r,maxLon:i}}var Ur=[0,25e5,63e4,78e3,2e4,2400,610,76,19,2.4];function Wr(e){if(!Number.isFinite(e))throw RangeError(`Invalid precision: ${e}`);return Ur[Math.max(1,Math.min(9,Math.round(e)))]}var z=null,B=null,V={},H={},Gr={},U=null,W=new Set,Kr=!1,qr=null,Jr=[{label:`City`,value:4,hint:`~20 km`},{label:`Neighbourhood`,value:5,hint:`~2.4 km`},{label:`Street`,value:6,hint:`~610 m`},{label:`Exact`,value:9,hint:`~2 m`}],Yr=6371e3;function Xr(e,t,n,r=48){let i=[];for(let a=0;a<=r;a++){let o=a/r*2*Math.PI,s=n/Yr*Math.cos(o)*(180/Math.PI),c=n/(Yr*Math.cos(e*Math.PI/180))*Math.sin(o)*(180/Math.PI);i.push([t+c,e+s])}return i}var Zr=[210,140,30,280,60,330,170,0];function Qr(e){let{groups:t,activeGroupId:n}=b(),r=((n?t[n]:null)?.members??[]).indexOf(e);return Zr[(r>=0?r:0)%Zr.length]}function $r(e){if(W.has(e))return`#f87171`;let{groups:t,activeGroupId:n}=b(),r=n?t[n]:null;if(!r)return`hsl(${Qr(e)}, 70%, 55%)`;let i=r.livenessCheckins[e]??0;if(i===0)return`hsl(${Qr(e)}, 20%, 50%)`;let a=Math.floor(Date.now()/1e3)-i,o=r.livenessInterval;return a<=o?`hsl(${Qr(e)}, 70%, 55%)`:a<=o*1.25?`hsl(${Qr(e)}, 40%, 50%)`:`#94a3b8`}function ei(){return{type:`FeatureCollection`,features:Object.entries(H).map(([e,t])=>({type:`Feature`,properties:{pubkey:e,duress:W.has(e),colour:$r(e)},geometry:{type:`Polygon`,coordinates:[Xr(t.lat,t.lon,Wr(t.precision))]}}))}}var ti=`5.19.0`,ni=`https://unpkg.com/maplibre-gl@${ti}/dist/maplibre-gl.js`,ri=`https://unpkg.com/maplibre-gl@${ti}/dist/maplibre-gl.css`,ii=`sha384-pEfbADcwebVj4NNOvWFLUkm+FiGTICE5bChpV647czG7OpSqcHNgxM8QawfAkbRO`,ai=`sha384-MGCxhspF/+ufueUgol3FDkiAYQbpSNRhBT0VWHJt64U8qIy9qlnXWx8LAbj6niPH`;async function oi(){if(B)return B;try{let[e]=await Promise.all([T(()=>import(`./maplibre-gl-CfZCVKms.js`).then(e=>nt(e.default,1)),[],import.meta.url),T(()=>Promise.resolve({}),__vite__mapDeps([0]),import.meta.url)]);return B=e,e}catch{}let e=document.createElement(`link`);return e.rel=`stylesheet`,e.href=ri,e.integrity=ai,e.crossOrigin=`anonymous`,document.head.appendChild(e),await new Promise((e,t)=>{let n=document.createElement(`script`);n.src=ni,n.integrity=ii,n.crossOrigin=`anonymous`,n.onload=()=>e(),n.onerror=t,document.head.appendChild(n)}),B=window.maplibregl,B}async function si(e){let{groups:t,activeGroupId:n}=b();if(!n||!t[n]){z&&(z.remove(),z=null,Kr=!1),e.innerHTML=``;return}let r=t[n],i=r.beaconPrecision??5;if(qr!==n){H={},Gr={},W.clear();for(let[e,t]of Object.entries(V))t.remove(),delete V[e];if(qr=n,r.lastPositions)for(let[e,t]of Object.entries(r.lastPositions))H[e]=t}if(z&&document.getElementById(`beacon-map`)){G();for(let[e,t]of Object.entries(H))fi(e,t.lat,t.lon);q(),Object.keys(H).length>0&&K();return}queueMicrotask(()=>q()),e.innerHTML=`
    <section class="panel beacon-panel">
      <h3 class="panel__title">Location</h3>
      <p class="settings-hint" style="margin-bottom: 0.5rem;">Approximate location of group members. Circles show the geohash area — your exact position is never shared. In an emergency, full GPS precision is used so your group can help. Circles turn <span style="color: #f87171; font-weight: 500;">red</span> when an emergency signal is active.</p>
      <div class="beacon-map" id="beacon-map" style="height: 500px; border-radius: 8px;"></div>
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-top: 0.5rem; flex-wrap: wrap;">
        <button class="btn ${U===null?``:`btn--primary`}" id="beacon-toggle-btn" type="button">
          ${U===null?`Share Location`:`Sharing Location`}
        </button>
        <button class="btn btn--ghost" id="beacon-fit-btn" type="button" title="Zoom to fit all group members on the map">Fit All</button>
        ${U===null?``:`<span class="settings-hint" style="margin: 0;">Your approximate area is visible to group members</span>`}
      </div>
      <div style="margin-top: 0.75rem;">
        <span class="input-label">"I'm Alive" precision</span>
        <div class="segmented" id="beacon-precision-picker">
          ${Jr.map(e=>`<button class="segmented__btn ${i===e.value?`segmented__btn--active`:``}" data-beacon-precision="${e.value}" title="${e.hint}">${e.label}</button>`).join(``)}
        </div>
        <p class="settings-hint">How precisely your location is shared in routine check-ins</p>
      </div>
      <p class="settings-hint" style="margin-top: 0.5rem; color: var(--duress);">Emergency signals always share your exact GPS so your group can find you.</p>
      <div class="beacon-list" id="beacon-list"></div>
    </section>
  `,e.querySelectorAll(`[data-beacon-precision]`).forEach(t=>{t.addEventListener(`click`,()=>{let n=Number(t.dataset.beaconPrecision),{activeGroupId:r}=b();r&&(h(r,{beaconPrecision:n}),U!==null&&(ui(),di()),e.querySelectorAll(`[data-beacon-precision]`).forEach(e=>{e.classList.toggle(`segmented__btn--active`,Number(e.dataset.beaconPrecision)===n)}))})}),e.querySelector(`#beacon-toggle-btn`)?.addEventListener(`click`,()=>{U===null?di():ui(),si(e)}),e.querySelector(`#beacon-fit-btn`)?.addEventListener(`click`,()=>{K()});try{await oi(),ci()}catch{e.querySelector(`.beacon-map`).innerHTML=`<p style="color: var(--text-muted); text-align: center; padding: 2rem;">Map unavailable offline</p>`}}function ci(){let e=document.getElementById(`beacon-map`);if(!e||z||!B)return;let t=document.documentElement.dataset.theme===`light`?`https://basemaps.cartocdn.com/gl/positron-gl-style/style.json`:`https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`;z=new B.Map({container:e,style:t,center:[-.1278,51.5074],zoom:12}),z.on(`load`,()=>{Kr=!0,console.info(`[canary:beacon] map loaded, positions to catch up:`,Object.keys(H).length),z.addSource(`geohash-circles`,{type:`geojson`,data:ei()}),z.addLayer({id:`geohash-fill`,type:`fill`,source:`geohash-circles`,paint:{"fill-color":[`get`,`colour`],"fill-opacity":[`case`,[`get`,`duress`],.35,.2]}}),z.addLayer({id:`geohash-stroke`,type:`line`,source:`geohash-circles`,paint:{"line-color":[`get`,`colour`],"line-width":2.5,"line-opacity":[`case`,[`get`,`duress`],.9,.6]}});for(let[e,t]of Object.entries(H))fi(e,t.lat,t.lon);Object.keys(H).length>0&&K()})}function li(){let{activeGroupId:e}=b();e&&h(e,{lastPositions:{...H}})}function G(){if(!z||!Kr)return;let e=z.getSource(`geohash-circles`);e&&e.setData(ei())}function ui(){U!==null&&(navigator.geolocation.clearWatch(U),U=null);let{identity:e}=b();e?.pubkey&&(delete H[e.pubkey],delete Gr[e.pubkey],V[e.pubkey]&&(V[e.pubkey].remove(),delete V[e.pubkey]),G(),q())}function di(){if(U!==null||!(`geolocation`in navigator))return;let{groups:e,activeGroupId:t,identity:n}=b();if(!t||!e[t]||!n?.pubkey)return;let r=e[t],i=gt(r.seed),a=r.beaconPrecision||5;U=navigator.geolocation.watchPosition(async e=>{let r=Br(e.coords.latitude,e.coords.longitude,a),o=Vr(r),s=o.lat,c=o.lon,l=await yt(i,r,a);n?.pubkey&&(Gr[n.pubkey]=l,H[n.pubkey]={lat:s,lon:c,geohash:r,precision:a,timestamp:Math.floor(Date.now()/1e3)},fi(n.pubkey,s,c),G(),K(),q(),li(),t&&E(t,{type:`beacon`,lat:s,lon:c,accuracy:Wr(a),timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID()}))},e=>{console.warn(`[canary:beacon] watchPosition error`,e.code,e.message)},{enableHighAccuracy:!1,maximumAge:6e4,timeout:15e3})}function fi(e,t,n){if(!z||!B){console.warn(`[canary:beacon] updateMapMarker skipped — map not ready`,{map:!!z,maplibregl:!!B,pubkey:e.slice(0,8)});return}let r=$r(e),i=W.has(e),a=pi(e),o=Ge(e),s=!!o?.picture,c=i?40:32;if(V[e]){V[e].setLngLat([n,t]);let o=V[e].getElement(),l=o.querySelector(`.beacon-dot`);l&&(s||(l.style.background=r),l.style.width=`${c}px`,l.style.height=`${c}px`,l.style.borderColor=r,l.style.boxShadow=`0 0 10px ${r}80`,l.style.animation=i?`beacon-pulse 1s ease-in-out infinite`:`none`);let u=o.querySelector(`.beacon-label`);u&&(u.textContent=a)}else{let l=document.createElement(`div`);l.style.display=`flex`,l.style.flexDirection=`column`,l.style.alignItems=`center`,l.style.pointerEvents=`none`;let u;s?(u=document.createElement(`img`),u.src=o.picture,u.style.objectFit=`cover`):(u=document.createElement(`div`),u.style.background=r),u.className=`beacon-dot`,u.style.width=`${c}px`,u.style.height=`${c}px`,u.style.borderRadius=`50%`,u.style.border=`3px solid ${r}`,u.style.boxShadow=`0 0 10px ${r}80`,u.style.zIndex=`2`,i&&(u.style.animation=`beacon-pulse 1s ease-in-out infinite`),l.appendChild(u);let d=document.createElement(`div`);d.className=`beacon-label`,d.textContent=a,d.style.fontSize=`11px`,d.style.fontWeight=`600`,d.style.color=`#fff`,d.style.textShadow=`0 1px 3px rgba(0,0,0,0.8)`,d.style.marginTop=`2px`,d.style.whiteSpace=`nowrap`,l.appendChild(d),V[e]=new B.Marker({element:l,anchor:`center`}).setLngLat([n,t]).addTo(z)}}function K(){if(!z)return;let e=Object.values(H);if(e.length===0)return;if(e.length===1){z.flyTo({center:[e[0].lon,e[0].lat],zoom:13});return}let t=e.map(e=>e.lon),n=e.map(e=>e.lat);z.fitBounds([[Math.min(...t),Math.min(...n)],[Math.max(...t),Math.max(...n)]],{padding:60,maxZoom:14})}function pi(e){let{groups:t,activeGroupId:n,identity:r}=b(),i=n?t[n]:null,a=r?.pubkey===e,o,s=i?.memberNames?.[e];return s&&s!==`You`&&(o=s),o||=He(e),a?o?`${o} (you)`:`You`:o||`${e.slice(0,8)}\u2026`}function q(){let e=document.getElementById(`beacon-list`);e&&(e.innerHTML=Object.entries(H).map(([e,t])=>{let n=$r(e),r=pi(e),i=Ge(e),a=Math.floor(Date.now()/1e3)-t.timestamp,o=a<60?`just now`:a<3600?`${Math.floor(a/60)}m ago`:`${Math.floor(a/3600)}h ago`;return`
      <div class="beacon-entry" style="display:flex;align-items:center;gap:0.5rem;padding:0.25rem 0;">
        ${i?.picture?`<img src="${w(i.picture)}" alt="" style="width:20px;height:20px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid ${n};" />`:`<span style="width:8px;height:8px;border-radius:50%;background:${n};flex-shrink:0;"></span>`}
        <span class="beacon-member" style="font-weight:500;">${w(r)}</span>
        <span class="beacon-geohash" style="color:var(--text-muted);font-size:0.8rem;">${w(t.geohash)}</span>
        <span style="color:var(--text-muted);font-size:0.75rem;margin-left:auto;">${w(o)}</span>
      </div>
    `}).join(``)||`<p class="settings-hint">No beacons yet — enable location to start</p>`)}document.addEventListener(`canary:duress`,(e=>{let{members:t}=e.detail;if(!t?.length)return;for(let e of t)W.add(e),mi(e);G();let n=t.map(e=>H[e]).filter(Boolean);if(z&&n.length===1)z.flyTo({center:[n[0].lon,n[0].lat],zoom:14});else if(z&&n.length>1){let e=n.map(e=>e.lon),t=n.map(e=>e.lat);z.fitBounds([[Math.min(...e),Math.min(...t)],[Math.max(...e),Math.max(...t)]],{padding:60})}}));function mi(e){let t=V[e];if(!t)return;let n=t.getElement();n.style.background=`#f87171`,n.style.width=`14px`,n.style.height=`14px`,n.style.boxShadow=`0 0 12px rgba(248, 113, 113, 0.6)`}function hi(){if(console.info(`[canary:beacon] sendLocationPing called`,{hasGeo:`geolocation`in navigator,map:!!z,mapReady:Kr}),!(`geolocation`in navigator))return;let{groups:e,activeGroupId:t,identity:n}=b();if(!t||!e[t]||!n?.pubkey){console.warn(`[canary:beacon] sendLocationPing: missing state`,{activeGroupId:t,hasPubkey:!!n?.pubkey});return}if(U!==null){console.info(`[canary:beacon] watch already active, skipping getCurrentPosition`);return}di();let r=e[t],i=gt(r.seed),a=r.beaconPrecision||5;navigator.geolocation.getCurrentPosition(async e=>{let r=Br(e.coords.latitude,e.coords.longitude,a),o=Vr(r),s=o.lat,c=o.lon,l=await yt(i,r,a);n?.pubkey&&(Gr[n.pubkey]=l,H[n.pubkey]={lat:s,lon:c,geohash:r,precision:a,timestamp:Math.floor(Date.now()/1e3)},fi(n.pubkey,s,c),G(),K(),q(),li(),t&&E(t,{type:`beacon`,lat:s,lon:c,accuracy:Wr(a),timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID()}))},e=>{console.warn(`[canary:beacon] getCurrentPosition FAILED`,e.code,e.message),T(async()=>{let{showToast:e}=await import(`./toast-BS4TNeor.js`);return{showToast:e}},__vite__mapDeps([1,2]),import.meta.url).then(({showToast:t})=>{e.code===1?t(`Location permission denied`,`error`,3e3):e.code===3?t(`Location request timed out`,`error`,3e3):t(`Could not get location`,`error`,3e3)})},{enableHighAccuracy:!1,maximumAge:3e4,timeout:1e4})}function gi(e,t,n,r,i){let{groups:a,activeGroupId:o}=b(),s=o?a[o]:null;if(!s||!s.members.includes(e))return;let c=_i(r),l=Br(t,n,c);H[e]={lat:t,lon:n,geohash:l,precision:c,timestamp:i},fi(e,t,n),G(),K(),q(),li()}function _i(e){return e<=3?9:e<=20?8:e<=80?7:e<=620?6:e<=2500?5:e<=2e4?4:e<=8e4?3:e<=63e4?2:1}function vi(){U!==null&&navigator.geolocation.clearWatch(U),U=null,Kr=!1,z&&=(z.remove(),null),V={},H={},Gr={},W.clear(),qr=null}function yi(e){return new Date(e*1e3).toISOString().slice(11,19)+` UTC`}function bi(e,t){return e<=t?`green`:e<=t*1.25?`amber`:`red`}function xi(e,t){return e<60?yi(t):e<3600?`${Math.floor(e/60)}m ago`:e<86400?`${Math.floor(e/3600)}h ago`:`${Math.floor(e/86400)}d ago`}var Si=[{label:`1m`,value:60},{label:`2m`,value:120},{label:`5m`,value:300},{label:`15m`,value:900},{label:`1h`,value:3600},{label:`4h`,value:14400},{label:`24h`,value:86400},{label:`7d`,value:604800}];function Ci(e){let{groups:t,activeGroupId:n,identity:r}=b();if(!n||!t[n]){e.innerHTML=``;return}let i=t[n],a=Math.floor(Date.now()/1e3),o=i.livenessInterval,s=i.members.map(e=>{let t=i.livenessCheckins[e]??0,n=t>0,s=n?a-t:1/0,c=n?bi(s,o):`grey`,l=n?Math.max(0,Math.min(100,(1-s/o)*100)):0,u=r?.pubkey===e,d=i.memberNames?.[e];return`
      <li class="liveness-item liveness-item--${c}">
        <span class="liveness-dot liveness-dot--${c}"></span>
        <span class="liveness-name">${w(u?`You`:d??`${e.slice(0,8)}\u2026`)}</span>
        <span class="liveness-time">${n?xi(s,t):`awaiting first check-in`}</span>
        <div class="liveness-bar">
          <div class="liveness-bar__fill liveness-bar__fill--${c}" style="width: ${l}%"></div>
        </div>
      </li>
    `}).join(``),c=r?.pubkey!=null&&i.members.includes(r.pubkey);e.innerHTML=`
    <section class="panel liveness-panel">
      <h3 class="panel__title">Liveness</h3>

      <div class="settings-section">
        <span class="input-label">Check-in interval</span>
        <div class="segmented" id="liveness-interval-picker">
          ${Si.map(e=>`<button class="segmented__btn ${o===e.value?`segmented__btn--active`:``}" data-liveness-interval="${e.value}">${e.label}</button>`).join(``)}
        </div>
        <p class="settings-hint">How often members must check in</p>
      </div>

      <ul class="liveness-list" id="liveness-list">
        ${s}
      </ul>
      ${c?`
        <button class="btn btn--primary" id="checkin-btn" type="button" title="Check in with your group and share your approximate location">I'm Alive</button>
      `:``}
    </section>
  `,e.querySelectorAll(`[data-liveness-interval]`).forEach(e=>{e.addEventListener(`click`,()=>{h(n,{livenessInterval:Number(e.dataset.livenessInterval)})})}),document.getElementById(`checkin-btn`)?.addEventListener(`click`,()=>{try{let{identity:e,activeGroupId:t,groups:n}=b();if(!e?.pubkey||!t){console.warn(`[canary:liveness] No identity or activeGroupId`,{pubkey:e?.pubkey,gid:t});return}let r=n[t];if(!r){console.warn(`[canary:liveness] Group not found`,t);return}let i=Math.floor(Date.now()/1e3),a=Ae(i,r.rotationInterval);Be(r.seed,`canary:liveness`,e.pubkey,a),h(t,{livenessCheckins:{...r.livenessCheckins,[e.pubkey]:i}}),E(t,{type:`liveness-checkin`,pubkey:e.pubkey,timestamp:i,opId:crypto.randomUUID()}),Promise.all([T(()=>import(`./push-D63Y9M1I.js`),[],import.meta.url),T(()=>import(`./sync-BpNoyLp8.js`),__vite__mapDeps([3,4,5,6,7,8]),import.meta.url)]).then(([{notifyCheckin:e},{hashGroupTag:n}])=>{e(n(t))}).catch(()=>{}),hi(),setTimeout(()=>{document.getElementById(`beacon-container`)?.scrollIntoView({behavior:`smooth`,block:`center`})},300),A(`Check-in sent — location updated`,`success`,2e3)}catch(e){console.error(`[canary:liveness] Check-in failed:`,e),A(`Check-in failed`,`error`,3e3)}})}function wi(e){if(e.startsWith(`wss://`))return!0;if(e.startsWith(`ws://`))try{let t=new URL(e);return t.hostname===`localhost`||t.hostname===`127.0.0.1`||t.hostname===`[::1]`}catch{return!1}return!1}var J=!1;function Ti(){let{personas:e}=b(),t=Object.values(e);return t.length===0?`<li class="relay-item"><span class="settings-hint">No personas yet</span></li>`:t.map(e=>{let t=e.npub.length>16?`${e.npub.slice(0,8)}\u2026${e.npub.slice(-4)}`:e.npub;return`
      <li class="relay-item">
        ${se(e.name)}
        <span class="relay-url">${w(e.displayName??e.name)}</span>
        <span class="settings-hint" style="margin-left: 0.25rem;">${w(t)}</span>
        <button class="btn btn--ghost btn--sm persona-publish-btn" data-persona-name="${w(e.name)}" title="Publish profile">Publish</button>
      </li>
    `}).join(``)}function Ei(t){let{groups:n,activeGroupId:r}=b();if(!r||!n[r]){t.innerHTML=``;return}let o=n[r],{identity:s}=b(),c=!!s?.pubkey&&o.admins.includes(s.pubkey);t.innerHTML=`
    <div class="settings-drawer" id="settings-drawer">
      <button class="settings-toggle" id="settings-toggle">
        <span>Group Settings</span>
        <span class="settings-chevron" style="${J?`transform: rotate(90deg);`:``}">&#9658;</span>
      </button>

      <div class="settings-body" id="settings-body"${J?``:` hidden`}>
        <!-- Group Name -->
        <label class="input-label">Name
          <input class="input" id="settings-name" value="${w(o.name)}">
        </label>

        <!-- Rotation Interval -->
        <div class="settings-section">
          <span class="input-label">Rotation</span>
          <div class="segmented">
            <button class="segmented__btn ${o.rotationInterval===30?`segmented__btn--active`:``}" data-interval="30">30s</button>
            <button class="segmented__btn ${o.rotationInterval===86400?`segmented__btn--active`:``}" data-interval="86400">24h</button>
            <button class="segmented__btn ${o.rotationInterval===604800?`segmented__btn--active`:``}" data-interval="604800">7d</button>
            <button class="segmented__btn ${o.rotationInterval===2592e3?`segmented__btn--active`:``}" data-interval="2592000">30d</button>
          </div>
          <p class="settings-hint">How often the verification word changes</p>
        </div>

        ${o.encodingFormat===`words`?`
        <!-- Word Count -->
        <div class="settings-section">
          <span class="input-label">Words</span>
          <div class="segmented">
            <button class="segmented__btn ${o.wordCount===1?`segmented__btn--active`:``}" data-words="1">1</button>
            <button class="segmented__btn ${o.wordCount===2?`segmented__btn--active`:``}" data-words="2">2</button>
            <button class="segmented__btn ${o.wordCount===3?`segmented__btn--active`:``}" data-words="3">3</button>
          </div>
          <p class="settings-hint">More words = stronger security</p>
        </div>
        `:``}

        <!-- Encoding Format -->
        <div class="settings-section">
          <span class="input-label">Display Format</span>
          <div class="segmented">
            <button class="segmented__btn ${o.encodingFormat===`words`?`segmented__btn--active`:``}" data-enc="words">Word</button>
            <button class="segmented__btn ${o.encodingFormat===`pin`?`segmented__btn--active`:``}" data-enc="pin">PIN</button>
            <button class="segmented__btn ${o.encodingFormat===`hex`?`segmented__btn--active`:``}" data-enc="hex">Hex</button>
          </div>
          <p class="settings-hint">Words for voice, PINs for digital input, Hex for machine-to-machine</p>
        </div>

        <!-- Tolerance Window -->
        <div class="settings-section">
          <span class="input-label">Tolerance</span>
          <div class="segmented">
            <button class="segmented__btn ${o.tolerance===0?`segmented__btn--active`:``}" data-tolerance="0">0</button>
            <button class="segmented__btn ${o.tolerance===1?`segmented__btn--active`:``}" data-tolerance="1">+/-1</button>
            <button class="segmented__btn ${o.tolerance===2?`segmented__btn--active`:``}" data-tolerance="2">+/-2</button>
            <button class="segmented__btn ${o.tolerance===3?`segmented__btn--active`:``}" data-tolerance="3">+/-3</button>
          </div>
          <p class="settings-hint">Accept words from neighbouring time windows (higher = more forgiving, less secure)</p>
        </div>

        <!-- Duress Mode -->
        <div class="settings-section">
          <span class="input-label">Emergency Alert Mode</span>
          <div class="segmented">
            <button class="segmented__btn ${o.duressMode===`immediate`||!o.duressMode?`segmented__btn--active`:``}" data-duress-mode="immediate">Immediate</button>
            <button class="segmented__btn ${o.duressMode===`dead-drop`?`segmented__btn--active`:``}" data-duress-mode="dead-drop">Dead Drop</button>
            <button class="segmented__btn ${o.duressMode===`both`?`segmented__btn--active`:``}" data-duress-mode="both">Both</button>
          </div>
          <p class="settings-hint">Immediate alerts members now. Dead drop records silently for later retrieval.</p>
        </div>

        <!-- Nostr Sync Toggle -->
        <div class="settings-section">
          <label class="toggle-label">
            <input type="checkbox" id="nostr-toggle" ${o.nostrEnabled?`checked`:``}>
            <span>Nostr Sync</span>
          </label>
          <div class="nostr-settings" id="nostr-settings"${o.nostrEnabled?``:` hidden`}>
            <!-- Identity -->
            <div class="nostr-identity" id="nostr-identity">
              <span class="settings-hint">Loading identity…</span>
            </div>

            <!-- Write relays (publishing) -->
            <div class="nostr-relays">
              <span class="input-label">Write Relays <span class="settings-hint" style="font-weight:normal;">(publishing)</span></span>
              <ul class="relay-list" id="write-relay-list">
                ${(o.writeRelays??[]).map((e,t)=>`
                  <li class="relay-item">
                    <span class="relay-url">${w(e)}</span>
                    <button class="btn btn--ghost btn--sm write-relay-remove" data-relay-index="${t}" aria-label="Remove write relay">✕</button>
                  </li>
                `).join(``)}
              </ul>
              <div class="relay-add-row">
                <input
                  class="input relay-add-input"
                  id="write-relay-add-input"
                  type="url"
                  placeholder="wss://relay.example.com"
                >
                <button class="btn btn--ghost btn--sm" id="write-relay-add-btn">Add</button>
              </div>
            </div>

            <!-- Read relays (subscriptions/discovery) -->
            <div class="nostr-relays" style="margin-top: 0.5rem;">
              <span class="input-label">Read Relays <span class="settings-hint" style="font-weight:normal;">(subscriptions)</span></span>
              <ul class="relay-list" id="read-relay-list">
                ${(o.readRelays??[]).map((e,t)=>`
                  <li class="relay-item">
                    <span class="relay-url">${w(e)}</span>
                    <button class="btn btn--ghost btn--sm read-relay-remove" data-relay-index="${t}" aria-label="Remove read relay">✕</button>
                  </li>
                `).join(``)}
              </ul>
              <div class="relay-add-row">
                <input
                  class="input relay-add-input"
                  id="read-relay-add-input"
                  type="url"
                  placeholder="wss://relay.example.com"
                >
                <button class="btn btn--ghost btn--sm" id="read-relay-add-btn">Add</button>
              </div>
            </div>

            <!-- Connection status -->
            <div class="nostr-connection-status">
              <span id="nostr-conn-status" class="settings-hint">
                ${l()?`Connected to ${e()} relay${e()===1?``:`s`}`:`Not connected`}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="settings-actions">
          <button class="btn btn--ghost" id="export-btn">Export Group</button>
          <button class="btn btn--ghost" id="import-btn">Import Group</button>
          ${c?`<button class="btn btn--warning" id="reseed-btn">Rotate Key</button>`:``}
          ${c?`<button class="btn btn--danger" id="compromise-reseed-btn">Compromise Reseed</button>`:``}
          <button class="btn btn--danger" id="dissolve-btn">Dissolve Group</button>
        </div>

        <!-- Personas -->
        <div class="settings-section">
          <span class="input-label">Personas</span>
          <ul class="relay-list" id="persona-list">
            ${Ti()}
          </ul>
          <div class="relay-add-row" style="margin-top: 0.5rem;">
            <input class="input relay-add-input" id="persona-name-input" type="text" placeholder="New persona name">
            <button class="btn btn--ghost btn--sm" id="persona-create-btn">Create</button>
          </div>
        </div>
      </div>
    </div>
  `,document.getElementById(`settings-toggle`).addEventListener(`click`,()=>{J=!J;let e=document.getElementById(`settings-body`),n=t.querySelector(`.settings-chevron`);e.hidden=!J,n.style.transform=J?`rotate(90deg)`:``}),document.getElementById(`settings-name`).addEventListener(`change`,e=>{let t=e.target.value.trim();t&&h(r,{name:t})}),t.querySelectorAll(`[data-interval]`).forEach(e=>{e.addEventListener(`click`,()=>{h(r,{rotationInterval:Number(e.dataset.interval)})})}),t.querySelectorAll(`[data-words]`).forEach(e=>{e.addEventListener(`click`,()=>{h(r,{wordCount:Number(e.dataset.words)})})}),t.querySelectorAll(`[data-enc]`).forEach(e=>{e.addEventListener(`click`,()=>{h(r,{encodingFormat:e.dataset.enc})})}),t.querySelectorAll(`[data-tolerance]`).forEach(e=>{e.addEventListener(`click`,()=>{h(r,{tolerance:Number(e.dataset.tolerance)})})}),t.querySelectorAll(`[data-duress-mode]`).forEach(e=>{e.addEventListener(`click`,()=>{h(r,{duressMode:e.dataset.duressMode})})}),document.getElementById(`nostr-toggle`).addEventListener(`change`,e=>{let t=e.target.checked;h(r,{nostrEnabled:t});let n=document.getElementById(`nostr-settings`);if(n.hidden=!t,t){let e=b().groups[r];C(e?.readRelays??[],e?.writeRelays??[],r).then(()=>{Oi()}),Di()}else ie(),a(),le(!1,0),Oi()});function u(){let e=b().groups[r];e?.nostrEnabled&&C(e.readRelays??[],e.writeRelays??[],r)}t.querySelectorAll(`.write-relay-remove`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Number(e.dataset.relayIndex),n=[...b().groups[r]?.writeRelays??[]];n.splice(t,1),h(r,{writeRelays:n}),u()})}),t.querySelectorAll(`.read-relay-remove`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Number(e.dataset.relayIndex),n=[...b().groups[r]?.readRelays??[]];n.splice(t,1),h(r,{readRelays:n}),u()})}),document.getElementById(`write-relay-add-btn`).addEventListener(`click`,()=>{let e=document.getElementById(`write-relay-add-input`),t=e.value.trim();if(!wi(t)){e.focus();return}let n=[...b().groups[r]?.writeRelays??[]];n.includes(t)?e.value=``:(n.push(t),h(r,{writeRelays:n}),e.value=``,u())}),document.getElementById(`read-relay-add-btn`).addEventListener(`click`,()=>{let e=document.getElementById(`read-relay-add-input`),t=e.value.trim();if(!wi(t)){e.focus();return}let n=[...b().groups[r]?.readRelays??[]];n.includes(t)?e.value=``:(n.push(t),h(r,{readRelays:n}),e.value=``,u())}),document.getElementById(`write-relay-add-input`).addEventListener(`keydown`,e=>{e.key===`Enter`&&document.getElementById(`write-relay-add-btn`).click()}),document.getElementById(`read-relay-add-input`).addEventListener(`keydown`,e=>{e.key===`Enter`&&document.getElementById(`read-relay-add-btn`).click()}),o.nostrEnabled&&Di(),document.getElementById(`reseed-btn`)?.addEventListener(`click`,()=>{let{groups:e}=b(),t=e[r],n=t&&i(t)===`online`?`Rotate the group key? This broadcasts the new key to all members via the relay.`:`Rotate the group key? Remaining members will need to re-sync via Share State.`;confirm(n)&&(Dt(r),A(`Key rotated. New verification words are active.`,`warning`,6e3))}),document.getElementById(`compromise-reseed-btn`)?.addEventListener(`click`,()=>{confirm(`Compromise reseed? This generates a new key WITHOUT broadcasting. All members will need new invites.`)&&(Ot(r),A(`Emergency reseed complete. No broadcast sent — share new invites with all members.`,`warning`,8e3))}),document.getElementById(`dissolve-btn`).addEventListener(`click`,()=>{confirm(`Dissolve "${o.name}"? This cannot be undone.`)&&Et(r)}),document.getElementById(`export-btn`).addEventListener(`click`,()=>{if(!confirm(`This exports the group secret in cleartext. Treat the file like a password.`))return;let e=new Blob([JSON.stringify(o,null,2)],{type:`application/json`}),t=URL.createObjectURL(e),n=document.createElement(`a`);n.href=t,n.download=`canary-${o.name.toLowerCase().replace(/\s+/g,`-`)}.json`,n.click(),URL.revokeObjectURL(t)}),document.getElementById(`import-btn`).addEventListener(`click`,()=>{if(!confirm(`Only import files from trusted sources — the file contains the group secret.`))return;let e=document.createElement(`input`);e.type=`file`,e.accept=`.json`,e.addEventListener(`change`,async()=>{let t=e.files?.[0];if(t)try{let e=await t.text(),n=JSON.parse(e);Nt(n);let r=crypto.randomUUID(),i={id:r,name:String(n.name),seed:String(n.seed),members:n.members.filter(e=>typeof e==`string`),memberNames:{},nostrEnabled:!1,relays:[],wordlist:typeof n.wordlist==`string`?n.wordlist:`en-v1`,wordCount:[1,2,3].includes(n.wordCount)?n.wordCount:2,counter:typeof n.counter==`number`&&n.counter>=0?n.counter:0,usageOffset:typeof n.usageOffset==`number`&&n.usageOffset>=0?n.usageOffset:0,rotationInterval:typeof n.rotationInterval==`number`&&n.rotationInterval>0?n.rotationInterval:86400,encodingFormat:[`words`,`pin`,`hex`].includes(n.encodingFormat)?n.encodingFormat:`words`,usedInvites:[],latestInviteIssuedAt:0,livenessInterval:typeof n.rotationInterval==`number`&&n.rotationInterval>0?n.rotationInterval:86400,livenessCheckins:{},tolerance:typeof n.tolerance==`number`&&n.tolerance>=0&&n.tolerance<=10?n.tolerance:1,beaconInterval:typeof n.beaconInterval==`number`&&n.beaconInterval>0?n.beaconInterval:60,beaconPrecision:typeof n.beaconPrecision==`number`&&n.beaconPrecision>0?n.beaconPrecision:5,duressPrecision:typeof n.duressPrecision==`number`&&n.duressPrecision>0?n.duressPrecision:9,duressMode:[`immediate`,`dead-drop`,`both`].includes(n.duressMode)?n.duressMode:`immediate`,createdAt:typeof n.createdAt==`number`?n.createdAt:Math.floor(Date.now()/1e3),admins:Array.isArray(n.admins)?n.admins.filter(e=>typeof e==`string`):[],epoch:typeof n.epoch==`number`&&n.epoch>=0?n.epoch:0,consumedOps:Array.isArray(n.consumedOps)?n.consumedOps.filter(e=>typeof e==`string`):[]},{groups:a}=b();g({groups:{...a,[r]:i},activeGroupId:r})}catch{alert(`Could not import group file. Check the file format.`)}}),e.click()}),document.getElementById(`persona-create-btn`)?.addEventListener(`click`,()=>{let e=document.getElementById(`persona-name-input`),t=e?.value.trim();if(!t){e?.focus();return}try{let n=_(t),{personas:r}=b();g({personas:{...r,[t]:n}}),e&&(e.value=``),A(`Persona "${t}" created`,`success`)}catch(e){A(e instanceof Error?e.message:`Failed to create persona.`,`error`)}}),document.getElementById(`persona-name-input`)?.addEventListener(`keydown`,e=>{e.key===`Enter`&&document.getElementById(`persona-create-btn`)?.click()}),t.querySelectorAll(`.persona-publish-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.personaName;t&&(document.dispatchEvent(new CustomEvent(`canary:publish-persona-profile`,{detail:{personaName:t}})),A(`Publishing profile for "${t}"…`,`info`))})})}function Di(){let e=document.getElementById(`nostr-identity`);if(!e)return;let{identity:t}=b();if(!t?.pubkey){e.innerHTML=`<span class="settings-hint">No identity available.</span>`;return}let n=`${t.pubkey.slice(0,8)}…${t.pubkey.slice(-8)}`;e.innerHTML=`
    <div class="nostr-identity-row">
      <span class="input-label">Identity (Local key)</span>
      <span class="relay-url nostr-pubkey" title="${w(t.pubkey)}">${w(n)}</span>
    </div>
    <p class="settings-hint">Your identity is stored locally on this device.</p>
  `}function Oi(){let t=document.getElementById(`nostr-conn-status`);if(!t)return;let n=e();t.textContent=l()?`Connected to ${n} relay${n===1?``:`s`}`:`Not connected`}var ki=new TextEncoder;function Ai(e){let t=new Uint8Array(4);return new DataView(t.buffer).setUint32(0,e,!1),t}function ji(){let e=new Uint8Array(32);return crypto.getRandomValues(e),e}var Mi=Object.freeze({call:Object.freeze({wordCount:1,rotationSeconds:30,tolerance:1,directional:!0,description:`Phone verification for insurance, banking, and call centres. Single word with 30-second rotation. Deepfake-proof — cloning a voice does not help derive the current word.`}),handoff:Object.freeze({wordCount:1,rotationSeconds:0,tolerance:0,directional:!0,description:`Physical handoff verification for rideshare, delivery, and task completion. Single-use token per event. No time dependency — counter is the task/event ID.`})});function Ni(e){let t=e.preset?Mi[e.preset]:void 0,n=e.rotationSeconds??t?.rotationSeconds??30,r=e.tolerance??t?.tolerance??0,i=t?.wordCount??1,a=e.encoding??{format:`words`,count:i};if(!e.namespace)throw Error(`namespace must be a non-empty string`);if(e.namespace.includes(`\0`))throw Error(`namespace must not contain null bytes`);if(!e.roles[0]||!e.roles[1])throw Error(`Both roles must be non-empty strings`);if(e.roles[0].includes(`\0`)||e.roles[1].includes(`\0`))throw Error(`Roles must not contain null bytes`);if(e.roles[0]===e.roles[1])throw Error(`Roles must be distinct, got ["${e.roles[0]}", "${e.roles[1]}"]`);if(e.myRole!==e.roles[0]&&e.myRole!==e.roles[1])throw Error(`myRole "${e.myRole}" is not one of the configured roles ["${e.roles[0]}", "${e.roles[1]}"]`);if(!Number.isInteger(n)||n<0)throw RangeError(`rotationSeconds must be a non-negative integer, got ${n}`);if(!Number.isInteger(r)||r<0)throw RangeError(`tolerance must be a non-negative integer, got ${r}`);if(r>10)throw RangeError(`tolerance must be <= 10, got ${r}`);if(n===0&&e.counter===void 0)throw Error(`Fixed counter mode (rotationSeconds=0) requires config.counter`);if(n===0&&e.counter!==void 0&&(!Number.isInteger(e.counter)||e.counter<0||e.counter>4294967295))throw RangeError(`counter must be an integer 0–4294967295, got ${e.counter}`);if(n>0&&e.counter!==void 0)throw Error(`counter must not be set when rotationSeconds > 0 (counter is derived from time)`);let o=typeof e.secret==`string`?k(e.secret):e.secret,s=e.roles[0]===e.myRole?e.roles[1]:e.roles[0],c=`pair:${e.namespace}:${s}`,l=n===0;function u(t){if(l){if(e.counter===void 0)throw Error(`Fixed counter mode (rotationSeconds=0) requires config.counter`);return e.counter}let r=t??Math.floor(Date.now()/1e3);return Math.floor(r/n)}return{counter:u,myToken(t){return Ce(o,e.namespace,e.roles,u(t),a)[e.myRole]},theirToken(t){return Ce(o,e.namespace,e.roles,u(t),a)[s]},verify(t,n){let i=t.toLowerCase().trim().replace(/\s+/g,` `),l=u(n),d=Math.max(0,l-r),f=Math.min(4294967295,l+r),p=!1;for(let t=d;t<=f;t++)Ee(i,Ce(o,e.namespace,e.roles,t,a)[s])&&(p=!0);let m=[];if(e.theirIdentity){let t=new Set,n=2*r,u=Math.max(0,l-n),p=Math.min(4294967295,l+n);for(let n=u;n<=p;n++){let r=Ce(o,e.namespace,e.roles,n,a);t.add(r[s])}for(let n=d;n<=f;n++){let r=Oe(ki.encode(c+`:duress`),new Uint8Array([0]),ki.encode(e.theirIdentity),Ai(n)),s=we(o,r),l=ke(s,a),u=1;for(;t.has(l)&&u<=255;)s=we(o,Oe(r,new Uint8Array([u]))),l=ke(s,a),u++;Ee(i,l)&&m.push(e.theirIdentity)}}return m.length>0?{status:`duress`,identities:m}:p?{status:`valid`}:{status:`invalid`}},pair(t){return Ce(o,e.namespace,e.roles,u(t),a)}}}var Pi={insurance:{label:`Insurance`,namespace:`aviva`,roles:[`caller`,`agent`],preset:`call`},pickup:{label:`Pickup`,namespace:`family`,roles:[`child`,`adult`],preset:`handoff`},rideshare:{label:`Rideshare`,namespace:`dispatch`,roles:[`requester`,`driver`],preset:`handoff`,encoding:`pin`}},Fi=ji(),Y=Pi.insurance,Ii,Li,Ri=null,zi=1;function Bi(){let e=Y.preset===`handoff`,t=Y.encoding===`pin`?{format:`pin`,digits:4}:void 0,n={secret:Fi,namespace:Y.namespace,roles:Y.roles,preset:Y.preset,...e?{counter:zi}:{},...t?{encoding:t}:{}};Ii=Ni({...n,myRole:Y.roles[0],theirIdentity:Y.roles[1]}),Li=Ni({...n,myRole:Y.roles[1],theirIdentity:Y.roles[0]})}Bi();function Vi(e,t){let n=Y.preset===`handoff`,r=Mi[Y.preset],i=n?zi:Math.floor((t??Math.floor(Date.now()/1e3))/r.rotationSeconds),a=`pair:${Y.namespace}:${e}`,o=Y.encoding===`pin`?{format:`pin`,digits:4}:{format:`words`,count:1};return je(Fi,a,e,i,o,r.tolerance)}function Hi(){Ri!==null&&(clearInterval(Ri),Ri=null)}function Ui(e){if(e<=0)return`0s`;let t=Math.floor(e/60),n=Math.floor(e%60);return t>0?`${t}m ${n}s`:`${n}s`}function Wi(e){if(e===0)return 0;let t=Math.floor(Date.now()/1e3),n=(Math.floor(t/e)+1)*e;return Math.max(0,n-t)}function Gi(e){Hi();let t=Math.floor(Date.now()/1e3),n=Y.preset===`handoff`,r=n?0:Mi[Y.preset].rotationSeconds,i=Wi(r),a=r>0?Math.min(100,(r-i)/r*100):100,o=Y.roles[0],s=Y.roles[1];e.innerHTML=`
    <div class="call-sim">
      <div class="call-sim__header">
        <h2 class="call-sim__title">CANARY Call Verification Demo</h2>
        <div class="call-sim__scenarios" id="call-scenarios">
          ${Object.entries(Pi).map(([e,t])=>`<button class="btn call-sim__scenario-btn${Y===t?` call-sim__scenario-btn--active`:``}" data-scenario="${e}">${t.label}</button>`).join(``)}
        </div>
      </div>

      <div class="call-sim__panels">
        <div class="call-sim__panel call-sim__panel--caller">
          <h3 class="call-sim__role">${o.toUpperCase()}</h3>
          <div class="call-sim__token-group">
            <span class="call-sim__label">Your code — tap to reveal:</span>
            <div class="call-sim__token call-sim__token--reveal" id="caller-reveal" data-real="${Ii.myToken(t)}" data-alt="${Vi(o,t)}">••••••••</div>
          </div>
          ${n?`<span class="call-sim__countdown">Single-use</span>`:`
          <div class="call-sim__progress"><div class="call-sim__progress-bar" id="caller-progress" style="width: ${a}%"></div></div>
          <span class="call-sim__countdown" id="caller-countdown">${Ui(i)}</span>
          `}
          <div class="call-sim__verify">
            <input type="text" class="input call-sim__input" id="caller-verify-input" placeholder="Type ${s}'s word..." autocomplete="off" />
            <button class="btn btn--primary call-sim__verify-btn" id="caller-verify-btn">Verify</button>
          </div>
          <div class="call-sim__result" id="caller-result" hidden></div>
        </div>

        <div class="call-sim__divider"></div>

        <div class="call-sim__panel call-sim__panel--agent">
          <h3 class="call-sim__role">${s.toUpperCase()}</h3>
          <div class="call-sim__token-group">
            <span class="call-sim__label">Your code — tap to reveal:</span>
            <div class="call-sim__token call-sim__token--reveal" id="agent-reveal" data-real="${Li.myToken(t)}" data-alt="${Vi(s,t)}">••••••••</div>
          </div>
          ${n?`<span class="call-sim__countdown">Single-use</span>`:`
          <div class="call-sim__progress"><div class="call-sim__progress-bar" id="agent-progress" style="width: ${a}%"></div></div>
          <span class="call-sim__countdown" id="agent-countdown">${Ui(i)}</span>
          `}
          <div class="call-sim__verify">
            <input type="text" class="input call-sim__input" id="agent-verify-input" placeholder="Type ${o}'s word..." autocomplete="off" />
            <button class="btn btn--primary call-sim__verify-btn" id="agent-verify-btn">Verify</button>
          </div>
          <div class="call-sim__result" id="agent-result" hidden></div>
        </div>
      </div>

      <div class="call-sim__banner call-sim__banner--valid" id="call-verified-banner" hidden></div>

      <div class="call-sim__footer">
        <span class="call-sim__meta">Namespace: <strong>${Y.namespace}</strong></span>
        <span class="call-sim__meta">Rotation: <strong>${n?`single-use`:r+`s`}</strong></span>
        <span class="call-sim__meta">Encoding: <strong>${Y.encoding??`words`}</strong></span>
        <span class="call-sim__meta">Tolerance: <strong>+/-${n?`0`:Mi[Y.preset].tolerance}</strong></span>
        <button class="btn" id="call-reset-seed">Reset seed</button>
      </div>

      <div class="call-sim__pair" id="call-pair">
        <span class="call-sim__meta">Pair: <code id="pair-display"></code></span>
      </div>
    </div>
  `,e.querySelector(`#call-scenarios`)?.addEventListener(`click`,t=>{let n=t.target.closest(`[data-scenario]`);if(!n)return;let r=n.dataset.scenario;Pi[r]&&Pi[r]!==Y&&(Y=Pi[r],Bi(),Gi(e))}),e.querySelector(`#call-reset-seed`)?.addEventListener(`click`,()=>{Fi=ji(),Y.preset===`handoff`&&zi++,Bi(),Gi(e)});let c=!1,l=!1,u=!1;function d(){if(!u&&c&&l){Hi();let t=e.querySelector(`#call-verified-banner`);t&&(t.hidden=!1,t.textContent=`Call Verified — both parties authenticated`),e.querySelectorAll(`.call-sim__progress, .call-sim__countdown`).forEach(e=>{e.hidden=!0})}}function f(t,n,r,i,a){let o=e.querySelector(`#${t}`),s=e.querySelector(`#${n}`),f=e.querySelector(`#${r}`);if(!o||!s||!f)return;function p(){let e=o.value.trim();if(!e)return;let t=i.verify(e);f.hidden=!1,f.className=`call-sim__result`,t.status===`valid`?(f.classList.add(`call-sim__result--valid`),f.textContent=`Verified ✓`,a===`caller`?c=!0:l=!0,d()):t.status===`duress`?(f.classList.add(`call-sim__result--invalid`),f.textContent=`Failed ✗`,u=!0):(f.classList.add(`call-sim__result--invalid`),f.textContent=`Failed ✗`)}s.addEventListener(`click`,p),o.addEventListener(`keydown`,e=>{e.key===`Enter`&&p()})}f(`caller-verify-input`,`caller-verify-btn`,`caller-result`,Ii,`caller`),f(`agent-verify-input`,`agent-verify-btn`,`agent-result`,Li,`agent`);function p(t){let n=e.querySelector(`#${t}`);if(!n)return;function r(e){e.preventDefault();let t=n.getBoundingClientRect();n.textContent=e.clientX-t.left<t.width/2?n.dataset.real:n.dataset.alt}function i(){n.textContent=`••••••••`}n.addEventListener(`pointerdown`,r),n.addEventListener(`pointerup`,i),n.addEventListener(`pointerleave`,i),n.addEventListener(`pointercancel`,i)}p(`caller-reveal`),p(`agent-reveal`);let m=e.querySelector(`#pair-display`);if(m){let e=Ii.pair(t);m.textContent=Object.entries(e).map(([e,t])=>`${e}: ${t}`).join(` | `)}!n&&r>0&&(Ri=setInterval(()=>{let t=Wi(r),n=Math.min(100,(r-t)/r*100),i=e.querySelector(`#caller-progress`),a=e.querySelector(`#agent-progress`),d=e.querySelector(`#caller-countdown`),f=e.querySelector(`#agent-countdown`),p=Math.max(0,100-n),m=p>50?`hsl(${Math.round(p/100*120)}, 70%, 45%)`:`hsl(${Math.round(p/100*120)}, 80%, 45%)`;i&&(i.style.width=`${n}%`,i.style.background=m),a&&(a.style.width=`${n}%`,a.style.background=m),d&&(d.textContent=Ui(t)),f&&(f.textContent=Ui(t));let h=Math.floor(Date.now()/1e3),g=e.querySelector(`#caller-reveal`),_=e.querySelector(`#agent-reveal`),v=Ii.myToken(h),y=g&&g.dataset.real!==v;if(g&&(g.dataset.real=v,g.dataset.alt=Vi(o,h)),_&&(_.dataset.real=Li.myToken(h),_.dataset.alt=Vi(s,h)),y){c=!1,l=!1,u=!1;let t=e.querySelector(`#caller-result`),n=e.querySelector(`#agent-result`);t&&(t.hidden=!0,t.className=`call-sim__result`),n&&(n.hidden=!0,n.className=`call-sim__result`);let r=e.querySelector(`#caller-verify-input`),i=e.querySelector(`#agent-verify-input`);r&&(r.value=``),i&&(i.value=``);let a=e.querySelector(`#call-verified-banner`);a&&(a.hidden=!0),e.querySelectorAll(`.call-sim__progress, .call-sim__countdown`).forEach(e=>{e.hidden=!1})}let b=e.querySelector(`#pair-display`);if(b){let e=Ii.pair();b.textContent=Object.entries(e).map(([e,t])=>`${e}: ${t}`).join(` | `)}t===0&&(Hi(),Gi(e))},1e3))}function Ki(){Hi()}var qi=new Set,X=new Set,Ji=new Set,Yi=new Set;function Xi(e){return e.length<=16?e:`${e.slice(0,8)}\u2026${e.slice(-4)}`}function Zi(e,t){return t.filter(t=>t.personaName===e).length}function Qi(e,t){let n=t.querySelector(`[data-field="displayName"]`),r=t.querySelector(`[data-field="about"]`),i=t.querySelector(`[data-field="picture"]`);return!n&&!r&&!i?!1:(n?.value??``)!==(e.displayName??``)||(r?.value??``)!==(e.about??``)||(i?.value??``)!==(e.picture??``)}function $i(e,t){let n=re(e.name),r=w(e.name.slice(0,1).toUpperCase()),i=qi.has(e.name)?`▼`:`▶`,a=e.displayName?`Profile published`:`No profile`;return`
    <div class="persona-card__header" data-persona-toggle="${w(e.name)}">
      <span class="persona-card__badge" style="background-color:${n}">${r}</span>
      <div class="persona-card__info">
        <span class="persona-card__name">${w(e.name)}</span>
        ${e.displayName?`<span class="persona-card__display-name">${w(e.displayName)}</span>`:``}
        <span class="persona-card__meta">${t} group${t===1?``:`s`} \u00B7 ${a}</span>
      </div>
      <span class="persona-card__chevron">${i}</span>
    </div>
  `}function ea(e){return`
    <div class="persona-card__section">
      <h4 class="persona-card__section-title">Profile</h4>
      <label class="persona-card__field">
        <span class="persona-card__field-label">Display name</span>
        <input class="input persona-card__input" type="text" data-field="displayName"
          value="${w(e.displayName??``)}" placeholder="Display name" />
      </label>
      <label class="persona-card__field">
        <span class="persona-card__field-label">About</span>
        <input class="input persona-card__input" type="text" data-field="about"
          value="${w(e.about??``)}" placeholder="Short bio" />
      </label>
      <label class="persona-card__field">
        <span class="persona-card__field-label">Picture URL</span>
        <input class="input persona-card__input" type="url" data-field="picture"
          value="${w(e.picture??``)}" placeholder="https://..." />
      </label>
      <button class="btn btn--sm btn--primary persona-card__publish-btn" data-persona-publish="${w(e.name)}" hidden>
        Publish
      </button>
    </div>
  `}function ta(e){let{settings:t}=b(),n=e.readRelays&&e.readRelays.length>0||e.writeRelays&&e.writeRelays.length>0,r=Yi.has(e.name);if(!n&&!r)return`
      <div class="persona-card__section">
        <h4 class="persona-card__section-title">Relays</h4>
        <span class="persona-card__relay-default">Using default relays</span>
        <a href="#" class="persona-card__customise-link" data-persona-customise-relays="${w(e.name)}">Customise</a>
      </div>
    `;let i=e.readRelays??t.defaultReadRelays??[],a=e.writeRelays??t.defaultWriteRelays??[];return`
    <div class="persona-card__section">
      <h4 class="persona-card__section-title">Relays</h4>
      <label class="persona-card__field">
        <span class="persona-card__field-label">Read relays</span>
        <input class="input persona-card__input" type="text" data-relay-field="read"
          data-persona-relay="${w(e.name)}"
          value="${w(i.join(`, `))}" placeholder="wss://relay.example.com" />
      </label>
      <label class="persona-card__field">
        <span class="persona-card__field-label">Write relays</span>
        <input class="input persona-card__input" type="text" data-relay-field="write"
          data-persona-relay="${w(e.name)}"
          value="${w(a.join(`, `))}" placeholder="wss://relay.example.com" />
      </label>
      <button class="btn btn--sm btn--primary" data-persona-save-relays="${w(e.name)}">Save relays</button>
    </div>
  `}function na(e,t){let n=t.filter(t=>t.personaName===e.name);return n.length===0?`
      <div class="persona-card__section">
        <h4 class="persona-card__section-title">Groups</h4>
        <span class="persona-card__meta">No groups assigned</span>
      </div>
    `:`
    <div class="persona-card__section">
      <h4 class="persona-card__section-title">Groups</h4>
      <div class="persona-card__group-chips">${n.map(e=>`
    <button class="persona-card__group-chip" data-navigate-group="${w(e.id)}">${w(e.name)}</button>
  `).join(``)}</div>
    </div>
  `}function ra(e){let t=X.has(e.name),n=Ji.has(e.name);return`
    <div class="persona-card__actions">
      <button class="btn btn--sm" data-persona-export="${w(e.name)}">Export nsec</button>
      <div class="persona-card__more">
        <button class="btn btn--sm persona-card__more-btn" data-persona-menu="${w(e.name)}"
          aria-label="More actions" title="More actions">\u22EF</button>
        ${t?`
          <div class="persona-card__menu" data-persona-menu-panel="${w(e.name)}">
            <button class="persona-card__menu-item" data-persona-copy-npub="${w(e.name)}">Copy npub</button>
            <button class="persona-card__menu-item" data-persona-show-qr="${w(e.name)}">
              ${n?`Hide QR`:`Show QR`}
            </button>
            <button class="persona-card__menu-item" data-persona-rotate="${w(e.name)}">Rotate</button>
            <button class="persona-card__menu-item" data-persona-prove="${w(e.name)}">Prove ownership</button>
            <button class="persona-card__menu-item persona-card__menu-item--danger" data-persona-archive="${w(e.name)}">Archive</button>
          </div>
        `:``}
      </div>
    </div>
    ${n?`
      <div class="persona-card__qr" data-persona-qr="${w(e.name)}">
        ${vr(e.npub,3)}
        <span class="persona-card__qr-label">${w(Xi(e.npub))}</span>
      </div>
    `:``}
  `}function ia(e,t){let n=qi.has(e.name),r=Zi(e.name,t);return`
    <div class="persona-card${n?` persona-card--expanded`:``}"
         id="persona-card-${w(e.name)}"
         data-persona-name="${w(e.name)}">
      ${$i(e,r)}
      ${n?`
        <div class="persona-card__body">
          <div class="persona-card__npub">${w(Xi(e.npub))}</div>
          ${ea(e)}
          ${ta(e)}
          ${na(e,t)}
          ${ra(e)}
        </div>
      `:``}
    </div>
  `}function aa(e){e.addEventListener(`click`,t=>{let n=t.target.closest(`[data-persona-toggle]`);if(n){let e=n.dataset.personaToggle;qi.has(e)?qi.delete(e):qi.add(e),g({view:b().view});return}let r=t.target.closest(`[data-navigate-group]`);if(r){let e=r.dataset.navigateGroup;g({view:`groups`,activeGroupId:e});return}let i=t.target.closest(`[data-persona-export]`);if(i){let t=i.dataset.personaExport;e.dispatchEvent(new CustomEvent(`canary:export-persona`,{bubbles:!0,detail:{personaName:t}}));return}let a=t.target.closest(`[data-persona-menu]`);if(a){let e=a.dataset.personaMenu;X.has(e)?X.delete(e):(X.clear(),X.add(e)),g({view:b().view});return}let o=t.target.closest(`[data-persona-copy-npub]`);if(o){let e=o.dataset.personaCopyNpub,{personas:t}=b(),n=t[e];n&&navigator.clipboard.writeText(n.npub).then(()=>{o.textContent=`Copied!`,setTimeout(()=>{o.textContent=`Copy npub`},2e3)}).catch(()=>{});return}let s=t.target.closest(`[data-persona-show-qr]`);if(s){let e=s.dataset.personaShowQr;Ji.has(e)?Ji.delete(e):Ji.add(e),X.delete(e),g({view:b().view});return}let c=t.target.closest(`[data-persona-rotate]`);if(c){let t=c.dataset.personaRotate;X.delete(t),e.dispatchEvent(new CustomEvent(`canary:rotate-persona`,{bubbles:!0,detail:{personaName:t}}));return}let l=t.target.closest(`[data-persona-archive]`);if(l){let t=l.dataset.personaArchive;X.delete(t),e.dispatchEvent(new CustomEvent(`canary:archive-persona`,{bubbles:!0,detail:{personaName:t}}));return}let u=t.target.closest(`[data-persona-prove]`);if(u){let t=u.dataset.personaProve;X.delete(t),e.dispatchEvent(new CustomEvent(`canary:prove-ownership`,{bubbles:!0,detail:{personaName:t}}));return}let d=t.target.closest(`[data-persona-customise-relays]`);if(d){t.preventDefault();let e=d.dataset.personaCustomiseRelays;Yi.add(e),g({view:b().view});return}let f=t.target.closest(`[data-persona-save-relays]`);if(f){let t=f.dataset.personaSaveRelays,n=e.querySelector(`#persona-card-${CSS.escape(t)}`);if(!n)return;let r=n.querySelector(`[data-relay-field="read"]`),i=n.querySelector(`[data-relay-field="write"]`),a=(r?.value??``).split(`,`).map(e=>e.trim()).filter(Boolean),o=(i?.value??``).split(`,`).map(e=>e.trim()).filter(Boolean),{personas:s}=b(),c={...s[t],readRelays:a,writeRelays:o};g({personas:{...s,[t]:c}}),Yi.delete(t);return}X.size>0&&(t.target.closest(`[data-persona-menu-panel]`)||(X.clear(),g({view:b().view})))}),e.addEventListener(`input`,e=>{let t=e.target;if(!t.classList.contains(`persona-card__input`)||!t.dataset.field)return;let n=t.closest(`.persona-card`);if(!n)return;let r=n.dataset.personaName;if(!r)return;let{personas:i}=b(),a=i[r];if(!a)return;let o=n.querySelector(`[data-persona-publish]`);o&&(o.hidden=!Qi(a,n))}),e.addEventListener(`click`,t=>{let n=t.target.closest(`[data-persona-publish]`);if(!n)return;let r=n.dataset.personaPublish,i=e.querySelector(`#persona-card-${CSS.escape(r)}`);if(!i)return;let a=i.querySelector(`[data-field="displayName"]`),o=i.querySelector(`[data-field="about"]`),s=i.querySelector(`[data-field="picture"]`),{personas:c}=b(),l=c[r];if(!l)return;let u={...l,displayName:a?.value||void 0,about:o?.value||void 0,picture:s?.value||void 0};g({personas:{...c,[r]:u}});let d=i.querySelector(`[data-persona-publish]`);d&&(d.hidden=!0)})}function oa(e){return e.length<=16?e:`${e.slice(0,8)}\u2026${e.slice(-4)}`}var sa=[`overflow: hidden`,`transition: max-height 0.3s ease-out`,`max-height: 0`].join(`; `),ca=[`display: flex`,`align-items: center`,`justify-content: center`,`gap: 0.5rem`,`padding: 0.625rem 1rem`,`background: var(--surface, #1e1e2e)`,`border: 2px solid var(--accent, #7c3aed)`,`border-radius: 8px`,`font-weight: 600`,`font-size: 0.875rem`,`color: var(--text, #e0e0e0)`,`width: fit-content`,`margin: 0 auto`].join(`; `),la=[`width: 2px`,`height: 1.25rem`,`background: var(--border, #444)`,`margin: 0 auto`].join(`; `),ua=[`display: flex`,`justify-content: center`,`gap: 0`,`position: relative`].join(`; `);function da(e,t){return`
    <div
      class="identity-tree__group"
      data-tree-group="${w(e)}"
      style="
        padding: 0.25rem 0.5rem;
        font-size: 0.6875rem;
        color: var(--text-muted, #999);
        background: var(--surface, #1e1e2e);
        border: 1px solid var(--border, #444);
        border-radius: 4px;
        cursor: pointer;
        white-space: nowrap;
        text-align: center;
      "
      role="button"
      tabindex="0"
    >${w(t)}</div>
  `}function fa(e,t,n,r){let i=re(e),a=n?`opacity: 0.4;`:``,o=n?`border-style: dashed;`:``,s=n?`background: repeating-linear-gradient(to bottom, var(--border, #444) 0 4px, transparent 4px 8px);`:`background: var(--border, #444);`,c=r.length>0?r.map(e=>`<div style="width: 2px; height: 0.75rem; margin: 0 auto; ${s}"></div>`+da(e.id,e.name)).join(``):``;return`
    <div class="identity-tree__persona-col" style="display: flex; flex-direction: column; align-items: center; ${a}">
      <div style="width: 2px; height: 1.25rem; margin: 0 auto; ${s}"></div>
      <div
        class="identity-tree__persona"
        data-tree-persona="${w(e)}"
        style="
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          background: var(--surface, #1e1e2e);
          border: 2px solid ${i};
          ${o}
          border-radius: 6px;
          cursor: pointer;
          white-space: nowrap;
        "
        role="button"
        tabindex="0"
      >
        <span style="
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 50%;
          background: ${i};
          color: #fff;
          font-size: 0.6875rem;
          font-weight: 600;
        ">${w(e.slice(0,1).toUpperCase())}</span>
        <span style="font-size: 0.8125rem; color: var(--text, #e0e0e0);">${w(e)}</span>
        <span style="font-size: 0.6875rem; color: var(--text-muted, #999);">${w(oa(t))}</span>
      </div>
      ${c}
    </div>
  `}function pa(e){return e<=1?``:`
    <div style="
      position: absolute;
      top: 0;
      left: calc(50% / ${e});
      right: calc(50% / ${e});
      height: 0;
      border-top: 2px solid var(--border, #444);
    "></div>
  `}function ma(){let{identity:e,personas:t,groups:n}=b();if(!e)return`<div class="identity-tree" style="`+sa+`"></div>`;let r=Object.values(t),i={};for(let e of r)i[e.name]=[];for(let[e,t]of Object.entries(n)){let n=t.personaName;n&&i[n]&&i[n].push({id:e,name:t.name})}let a=r.map(e=>fa(e.name,e.npub,e.archived===!0,i[e.name]??[])).join(``);return`<div class="identity-tree" style="${sa}">${`
    <div style="padding: 1rem 0.5rem;">
      <div style="${ca}">
        <span style="font-size: 1rem;">&#128273;</span>
        <span>${e.displayName&&e.displayName!==`You`?w(e.displayName):`Master Identity`}</span>
      </div>
      ${r.length>0?`
        <div style="${la}"></div>
        <div style="${ua}; padding: 0 1rem; gap: 1.5rem;">
          ${pa(r.length)}
          ${a}
        </div>
      `:``}
    </div>
  `}</div>`}function ha(e){let t=e.querySelector(`.identity-tree`);t&&(t.classList.contains(`expanded`)&&(t.style.maxHeight=t.scrollHeight+`px`),t.addEventListener(`click`,e=>{let t=e.target.closest(`[data-tree-persona]`);if(t){let e=t.dataset.treePersona;e&&document.getElementById(`persona-card-${e}`)?.scrollIntoView({behavior:`smooth`});return}let n=e.target.closest(`[data-tree-group]`);if(n){let e=n.dataset.treeGroup;e&&g({view:`groups`,activeGroupId:e})}}),t.addEventListener(`keydown`,e=>{let t=e.target;(e.key===`Enter`||e.key===` `)&&t.matches(`[data-tree-persona], [data-tree-group]`)&&(e.preventDefault(),t.click())}))}var ga=!1,_a=!1,Z=!1;function va(e){return e.length<=16?e:`${e.slice(0,8)}\u2026${e.slice(-4)}`}function ya(e){return!(e.length===0||e.length>32||e!==e.toLowerCase()||/\s/.test(e))}function ba(){return`
    <div class="identities__fallback" style="
      padding: 2rem;
      text-align: center;
      color: var(--text-muted, #999);
    ">
      <p style="font-size: 1rem; margin: 0;">
        Identity management requires a local key. Switch to a local account to manage personas.
      </p>
    </div>
  `}function xa(){let{identity:e,personas:t,groups:n}=b();if(!e)return``;let r=Object.values(t).filter(e=>!e.archived).length,i=Object.keys(n).length,a=!!e.mnemonic,o=a?`Mnemonic available`:`No backup phrase`,s=a?`
      <div class="identities__backup" style="margin-top: 0.75rem;">
        <div class="identities__mnemonic${Z?``:` identities__mnemonic--blurred`}"
             id="identities-mnemonic"
             style="
               font-family: monospace;
               font-size: 0.8125rem;
               padding: 0.5rem 0.75rem;
               background: var(--surface, #1e1e2e);
               border: 1px solid var(--border, #444);
               border-radius: 6px;
               cursor: pointer;
               user-select: ${Z?`text`:`none`};
               filter: ${Z?`none`:`blur(5px)`};
               transition: filter 0.2s ease;
               color: var(--text, #e0e0e0);
             ">${w(e.mnemonic??``)}</div>
        <span style="font-size: 0.6875rem; color: var(--text-muted, #999); margin-top: 0.25rem; display: block;">
          ${Z?`Click to hide`:`Click to reveal recovery phrase`}
        </span>
      </div>
    `:``;return`
    <div class="identities__master-card" style="
      background: linear-gradient(135deg, hsl(260, 50%, 20%) 0%, hsl(220, 40%, 15%) 100%);
      border: 2px solid var(--accent, #7c3aed);
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
    ">
      <h2 style="
        margin: 0 0 0.75rem;
        font-size: 1.25rem;
        color: var(--text, #e0e0e0);
      ">Your Identity Tree</h2>

      <div style="
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        font-size: 0.8125rem;
        color: var(--text-muted, #999);
        margin-bottom: 1rem;
      ">
        <span>${r} persona${r===1?``:`s`}</span>
        <span>\u00B7</span>
        <span>${i} group${i===1?``:`s`}</span>
        <span>\u00B7</span>
        <span>${o}</span>
      </div>

      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button class="btn btn--sm" id="identities-toggle-tree">
          ${ga?`Hide Tree`:`Show Tree`}
        </button>
        ${a?`<button class="btn btn--sm" id="identities-backup-btn">Backup</button>`:``}
        <button class="btn btn--sm" id="identities-shamir-btn">Shamir Split</button>
        <button class="btn btn--sm" id="identities-verify-proof-btn">Verify Proof</button>
      </div>

      ${s}
    </div>
  `}function Sa(){let e=ma();return ga?e.replace(`max-height: 0`,`max-height: 2000px`).replace(`class="identity-tree"`,`class="identity-tree expanded"`):e}function Ca(){let{personas:e,groups:t}=b(),n=Object.values(t),r=Object.values(e).filter(e=>!e.archived);return r.length===0?`
      <div style="
        padding: 1rem;
        text-align: center;
        color: var(--text-muted, #999);
        font-size: 0.875rem;
      ">No personas yet. Create one below.</div>
    `:r.map(e=>ia(e,n)).join(``)}function wa(){return`
    <div class="identities__create" style="
      margin-top: 1rem;
      display: flex;
      gap: 0.5rem;
      align-items: center;
    ">
      <input
        class="input"
        type="text"
        id="identities-new-name"
        placeholder="New persona name"
        maxlength="32"
        autocomplete="off"
        style="flex: 1; min-width: 0;"
      />
      <button class="btn btn--primary btn--sm" id="identities-create-btn">Create</button>
    </div>
    <div id="identities-create-error" style="
      color: var(--danger, #ef4444);
      font-size: 0.75rem;
      margin-top: 0.25rem;
      min-height: 1rem;
    "></div>
  `}function Ta(){let{personas:e}=b(),t=Object.values(e).filter(e=>e.archived);if(t.length===0)return``;let n=t.map(e=>`
      <div class="identities__archived-row" style="
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.375rem 0.5rem;
        border-bottom: 1px solid var(--border, #333);
      ">
        <span style="
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          background: ${re(e.name)};
          color: #fff;
          font-size: 0.6875rem;
          font-weight: 600;
          opacity: 0.6;
        ">${w(e.name.slice(0,1).toUpperCase())}</span>
        <span style="font-size: 0.8125rem; color: var(--text-muted, #999);">${w(e.name)}</span>
        <span style="font-size: 0.6875rem; color: var(--text-muted, #666); flex: 1;">${w(va(e.npub))}</span>
        <button class="btn btn--sm" data-restore-persona="${w(e.name)}">Restore</button>
      </div>
    `).join(``);return`
    <div class="identities__archived" style="margin-top: 1.5rem;">
      <button class="identities__archived-header" id="identities-archived-toggle" style="
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem 0;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-muted, #999);
        text-align: left;
      ">
        <span>${_a?`▼`:`▶`}</span>
        <span>Archived (${t.length})</span>
      </button>
      <div id="identities-archived-list" style="
        overflow: hidden;
        max-height: ${_a?`1000px`:`0`};
        transition: max-height 0.3s ease-out;
      ">${n}</div>
    </div>
  `}function Ea(e){if(e.textContent=``,!d()){let t=document.createElement(`div`);t.innerHTML=ba(),e.appendChild(t);return}let t=document.createElement(`div`);t.className=`identities`,t.style.cssText=`padding: 1rem; max-width: 640px; margin: 0 auto;`,t.innerHTML=[xa(),Sa(),`<div class="identities__persona-list">`,Ca(),`</div>`,wa(),Ta()].join(``),e.appendChild(t),aa(e),e.querySelector(`.identity-tree`)&&ha(e);let n=e.querySelector(`#identities-toggle-tree`);n&&n.addEventListener(`click`,()=>{ga=!ga;let t=e.querySelector(`.identity-tree`);t&&(ga?(t.classList.add(`expanded`),t.style.maxHeight=t.scrollHeight+`px`):(t.classList.remove(`expanded`),t.style.maxHeight=`0`)),n.textContent=ga?`Hide Tree`:`Show Tree`});let r=e.querySelector(`#identities-backup-btn`),i=e.querySelector(`#identities-mnemonic`);r&&i&&r.addEventListener(`click`,()=>{Z=!Z,i.style.filter=Z?`none`:`blur(5px)`,i.style.userSelect=Z?`text`:`none`;let e=i.nextElementSibling;e&&(e.textContent=Z?`Click to hide`:`Click to reveal recovery phrase`)}),i&&i.addEventListener(`click`,()=>{Z=!Z,i.style.filter=Z?`none`:`blur(5px)`,i.style.userSelect=Z?`text`:`none`;let e=i.nextElementSibling;e&&(e.textContent=Z?`Click to hide`:`Click to reveal recovery phrase`)});let a=e.querySelector(`#identities-shamir-btn`);a&&a.addEventListener(`click`,()=>{e.dispatchEvent(new CustomEvent(`canary:shamir-split`,{bubbles:!0}))});let o=e.querySelector(`#identities-verify-proof-btn`);o&&o.addEventListener(`click`,()=>{e.dispatchEvent(new CustomEvent(`canary:verify-proof`,{bubbles:!0}))});let s=e.querySelector(`#identities-new-name`),c=e.querySelector(`#identities-create-btn`),l=e.querySelector(`#identities-create-error`);function u(){if(!s||!l)return;let e=s.value.trim();if(!ya(e)){l.textContent=`Name must be lowercase, no spaces, max 32 characters.`;return}let{personas:t}=b();if(t[e]){l.textContent=`A persona with that name already exists.`;return}try{let n=_(e);g({personas:{...t,[e]:n}})}catch(e){l.textContent=e instanceof Error?e.message:`Failed to create persona.`}}c&&c.addEventListener(`click`,u),s&&s.addEventListener(`keydown`,e=>{e.key===`Enter`&&u()});let f=e.querySelector(`#identities-archived-toggle`),p=e.querySelector(`#identities-archived-list`);f&&p&&f.addEventListener(`click`,()=>{_a=!_a,p.style.maxHeight=_a?p.scrollHeight+`px`:`0`;let e=f.querySelector(`span`);e&&(e.textContent=_a?`▼`:`▶`)}),e.addEventListener(`click`,e=>{let t=e.target.closest(`[data-restore-persona]`);if(!t)return;let n=t.dataset.restorePersona,{personas:r}=b(),i=r[n];if(!i)return;let a={...i,archived:!1};g({personas:{...r,[n]:a}})})}var Da=null;function Oa(e,t){let n=b().groups[t];if(!n)return e.slice(0,8);let{identity:r}=b();return r?.pubkey===e?`You`:n.memberNames?.[e]||`${e.slice(0,8)}\u2026${e.slice(-4)}`}function ka(e,t){Da&&=(Da(),null),document.querySelector(`.call-verify`)?.remove();let{groups:n,identity:r}=b(),i=n[e];if(!i||!r)return;let a=r.pubkey,o=Oa(t,e),s=Ge(t),c=a<t?[a,t]:[t,a],l=Ni({secret:i.seed,namespace:`canary:call`,roles:c,myRole:a,preset:`call`}),u=Mi.call.rotationSeconds,d=Math.floor(Date.now()/1e3),f=l.myToken(d),p=l.theirToken(d),m=document.createElement(`div`);m.className=`call-verify`,m.innerHTML=`
    <div class="call-verify__content">
      ${s?.picture?`<img class="call-verify__avatar" src="${w(s.picture)}" alt="" />`:``}
      <h2 class="call-verify__title">Call with ${w(o)}</h2>
      <p class="call-verify__instruction">Speak your word. Listen for theirs. If it matches, the call is verified.</p>

      <div class="call-verify__section call-verify__section--say">
        <span class="call-verify__label">Say this:</span>
        <span class="call-verify__word call-verify__word--mine" id="cv-word-mine">${w(f)}</span>
      </div>

      <div class="call-verify__divider"></div>

      <div class="call-verify__section call-verify__section--hear">
        <span class="call-verify__label">They should say:</span>
        <span class="call-verify__word call-verify__word--theirs" id="cv-word-theirs">${w(p)}</span>
      </div>

      <p class="call-verify__timer">Words change in <span id="cv-countdown">${u}</span>s</p>

      <p class="call-verify__instruction" style="margin-top: 1.5rem; font-size: 0.75rem;">In a real call, if they say the wrong word, it could be an emergency signal. A production app would automatically check and silently alert the group.</p>
      <div class="call-verify__actions">
        <button class="btn btn--primary call-verify__btn" id="cv-match">Match</button>
        <button class="btn call-verify__btn call-verify__btn--danger" id="cv-mismatch">Wrong Word</button>
        <button class="btn call-verify__btn" id="cv-close">Close</button>
      </div>
    </div>
  `;let h=null;function g(){let e=Math.floor(Date.now()/1e3),t=m.querySelector(`#cv-word-mine`),n=m.querySelector(`#cv-word-theirs`),r=m.querySelector(`#cv-countdown`);if(t&&(t.textContent=l.myToken(e)),n&&(n.textContent=l.theirToken(e)),r){let t=e%u;r.textContent=String(u-t)}}h=setInterval(g,1e3);function _(){h!==null&&(clearInterval(h),h=null)}function v(){Da&&=(Da(),null),m.classList.remove(`call-verify--visible`),setTimeout(()=>m.remove(),300)}function y(e){e.key===`Escape`&&v()}Da=()=>{_(),document.removeEventListener(`keydown`,y)},document.body.appendChild(m),requestAnimationFrame(()=>m.classList.add(`call-verify--visible`)),document.addEventListener(`keydown`,y),m.querySelector(`#cv-match`)?.addEventListener(`click`,()=>{_(),m.innerHTML=`
      <div class="call-verify__content">
        <h2 class="call-verify__title" style="color: var(--clr-success, #27ae60);">Call Verified</h2>
        <p class="call-verify__warning" style="color: var(--text-secondary);">${w(o)} is who they say they are. The call is authenticated.</p>
        <div class="call-verify__actions">
          <button class="btn btn--primary call-verify__btn" id="cv-dismiss-ok">Done</button>
        </div>
      </div>
    `,m.querySelector(`#cv-dismiss-ok`)?.addEventListener(`click`,v)}),m.querySelector(`#cv-close`)?.addEventListener(`click`,v),m.querySelector(`#cv-mismatch`)?.addEventListener(`click`,()=>{_(),m.innerHTML=`
      <div class="call-verify__content">
        <h2 class="call-verify__title" style="color: var(--clr-danger, #e74c3c);">Verification Failed</h2>
        <p class="call-verify__warning">The word didn't match. This person may not be who they claim to be.</p>
        <div class="call-verify__actions">
          <button class="btn call-verify__btn" id="cv-dismiss-fail">Dismiss</button>
        </div>
      </div>
    `,m.querySelector(`#cv-dismiss-fail`)?.addEventListener(`click`,v)})}var Aa=et({VAULT_D_TAG:()=>Ma,VAULT_KIND:()=>ja,buildVaultEvent:()=>za,decryptVault:()=>Ra,deserialiseVault:()=>Ia,encryptVault:()=>La,fetchVault:()=>Va,fetchVaultNip07:()=>Wa,mergeVaultGroups:()=>Ya,publishVault:()=>Ba,publishVaultNip07:()=>Ua,serialiseVault:()=>Fa,subscribeToVault:()=>qa,unsubscribeFromVault:()=>Ja}),ja=30078,Ma=`canary:vault`,Na=2160*60*60;function Pa(e){let t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function Fa(e,t=[],n=[]){let r={};for(let[t,n]of Object.entries(e)){let{lastPositions:e,...i}=n;r[t]={...i,livenessCheckins:{}}}let i={version:2,groups:r,personas:t,deletedGroupIds:n};return JSON.stringify(i)}function Ia(e){try{let t=JSON.parse(e);if(!t||typeof t!=`object`||typeof t.groups!=`object`||t.groups===null)return{groups:{},personas:[],deletedGroupIds:[]};if(t.version===2)return{groups:t.groups,personas:Array.isArray(t.personas)?t.personas:[],deletedGroupIds:Array.isArray(t.deletedGroupIds)?t.deletedGroupIds:[]};let n=t.groups;for(let e of Object.values(n))e.personaName||=`personal`;return{groups:n,personas:[],deletedGroupIds:[]}}catch{return{groups:{},personas:[],deletedGroupIds:[]}}}function La(e,t,n){return ye(e,O(Pa(t),n))}function Ra(e,t,n){try{return be(e,O(Pa(t),n))}catch{return null}}function za(e,t){let n=Pa(t),r=Math.floor(Date.now()/1e3);return ve({kind:ja,created_at:r,tags:[[`d`,Ma],[`expiration`,String(r+Na)]],content:e},n)}async function Ba(e,t,n,r=[],i=[]){let a=c();if(!a)throw Error(`No relay pool — connect first`);let s=o();if(s.length===0)throw Error(`No write relays configured`);let l=za(La(Fa(e,r,i),t,n),t);console.info(`[canary:vault] Publishing vault (${Object.keys(e).length} groups) to`,s),document.dispatchEvent(new CustomEvent(`canary:vault-syncing`));let u=await Promise.allSettled(a.publish(s,l)),d=u.filter(e=>e.status===`fulfilled`).length,f=u.filter(e=>e.status===`rejected`).length;console.info(`[canary:vault] Publish results: ${d} OK, ${f} failed`),f>0&&u.forEach((e,t)=>{e.status===`rejected`&&console.warn(`[canary:vault] Relay ${s[t]} rejected:`,e.reason)}),document.dispatchEvent(new CustomEvent(`canary:vault-synced`,{detail:{timestamp:Math.floor(Date.now()/1e3)}}))}async function Va(e,t){let n=c();if(!n)return console.warn(`[canary:vault] fetchVault: no pool`),null;let i=r();return i.length===0?(console.warn(`[canary:vault] fetchVault: no read relays`),null):(console.info(`[canary:vault] Fetching vault from`,i,`for`,t.slice(0,8)),new Promise(r=>{let a=!1,o=null,s=setTimeout(()=>{if(!a){if(a=!0,c.close(),console.warn(`[canary:vault] fetchVault timed out after 10s`),o){let n=Ra(o.content,e,t);if(n){let e=Ia(n);if(Object.keys(e.groups).length>0){r(e);return}}}r(null)}},1e4),c=n.subscribeMany(i,{kinds:[ja],authors:[t],"#d":[Ma],limit:1},{onevent(e){D(e)&&(typeof e.content==`string`&&e.content.length>262144||(console.info(`[canary:vault] Received vault event created_at=${e.created_at}`),(!o||e.created_at>o.created_at)&&(o=e)))},oneose(){if(!a){if(a=!0,clearTimeout(s),c.close(),o){console.info(`[canary:vault] EOSE — decrypting vault event`);let n=Ra(o.content,e,t);if(n){let e=Ia(n);if(Object.keys(e.groups).length>0){r(e);return}}console.warn(`[canary:vault] Vault decryption failed`)}else console.info(`[canary:vault] EOSE — no vault event found`);r(null)}}})}))}function Ha(){return!!window.nostr?.nip44?.encrypt&&!!window.nostr?.nip44?.decrypt}async function Ua(e,t,n=[],r=[]){let i=c();if(!i)throw Error(`No relay pool — connect first`);if(!Ha())throw Error(`NIP-07 extension does not support NIP-44`);let a=o();if(a.length===0)throw Error(`No write relays configured`);let s=Fa(e,n,r),l=await window.nostr.nip44.encrypt(t,s),u=Math.floor(Date.now()/1e3),d={kind:ja,created_at:u,tags:[[`d`,Ma],[`expiration`,String(u+Na)]],content:l},f=await window.nostr.signEvent(d);console.info(`[canary:vault] Publishing vault via NIP-07 (${Object.keys(e).length} groups) to`,a),document.dispatchEvent(new CustomEvent(`canary:vault-syncing`));let p=await Promise.allSettled(i.publish(a,f)),m=p.filter(e=>e.status===`fulfilled`).length,h=p.filter(e=>e.status===`rejected`).length;console.info(`[canary:vault] NIP-07 publish results: ${m} OK, ${h} failed`),document.dispatchEvent(new CustomEvent(`canary:vault-synced`,{detail:{timestamp:u}}))}async function Wa(e){let t=c();if(!t)return console.warn(`[canary:vault] fetchVaultNip07: no pool`),null;if(!Ha())return console.warn(`[canary:vault] fetchVaultNip07: extension lacks NIP-44`),null;let n=r();return n.length===0?(console.warn(`[canary:vault] fetchVaultNip07: no read relays`),null):(console.info(`[canary:vault] Fetching vault via NIP-07 from`,n,`for`,e.slice(0,8)),new Promise(r=>{let i=!1,a=null,o=setTimeout(async()=>{if(!i){if(i=!0,s.close(),console.warn(`[canary:vault] fetchVaultNip07 timed out after 10s`),a)try{let t=Ia(await window.nostr.nip44.decrypt(e,a.content));if(Object.keys(t.groups).length>0){r(t);return}}catch{}r(null)}},1e4),s=t.subscribeMany(n,{kinds:[ja],authors:[e],"#d":[Ma],limit:1},{onevent(e){D(e)&&(typeof e.content==`string`&&e.content.length>262144||(console.info(`[canary:vault] NIP-07 received vault event created_at=${e.created_at}`),(!a||e.created_at>a.created_at)&&(a=e)))},async oneose(){if(!i){if(i=!0,clearTimeout(o),s.close(),a){console.info(`[canary:vault] NIP-07 EOSE — decrypting vault event`);try{let t=Ia(await window.nostr.nip44.decrypt(e,a.content));if(Object.keys(t.groups).length>0){r(t);return}}catch(e){console.warn(`[canary:vault] NIP-07 vault decryption failed:`,e)}}else console.info(`[canary:vault] NIP-07 EOSE — no vault event found`);r(null)}}})}))}var Ga=null,Ka=0;function qa(e,t,n){Ja();let i=c();if(!i)return;let a=r();if(a.length===0)return;Ka=Math.floor(Date.now()/1e3),console.info(`[canary:vault] Subscribing to live vault updates for`,e.slice(0,8));let o=i.subscribeMany(a,{kinds:[ja],authors:[e],"#d":[Ma],since:Ka},{async onevent(e){if(D(e)&&!(e.created_at<=Ka)&&!(typeof e.content==`string`&&e.content.length>262144)){console.info(`[canary:vault] Live vault update received created_at=${e.created_at}`),Ka=e.created_at;try{let r=await t(e.content);if(!r)return;let{groups:i,personas:a}=Ia(r);if(Object.keys(i).length===0)return;n(i,Object.keys(i).length,a)}catch(e){console.warn(`[canary:vault] Live vault decrypt failed:`,e)}}},oneose(){console.info(`[canary:vault] Live vault subscription EOSE — watching for updates`)}});Ga=()=>o.close()}function Ja(){Ga?.(),Ga=null}function Ya(e,t,n=[]){let r={...e},i=new Set(n);for(let[n,a]of Object.entries(t)){if(i.has(n))continue;let t=e[n];if(!t){r[n]=a;continue}let o=t.epoch??0,s=a.epoch??0;if(s>o)r[n]=a;else if(s===o){let e=t.counter??0;(a.counter??0)>e&&(r[n]=a)}}return r}function Xa(e){if(e.startsWith(`wss://`))return!0;if(e.startsWith(`ws://`))try{let t=new URL(e);return t.hostname===`localhost`||t.hostname===`127.0.0.1`||t.hostname===`[::1]`}catch{return!1}return!1}function Za(e,t){return t?.pubkey===e.pubkey&&t.mnemonic?{...e,mnemonic:t.mnemonic}:e}function Qa(e,t){return e?typeof t.epoch==`number`&&t.epoch<e.epoch?`This invite is older than the group state already stored on this device.`:typeof t.latestInviteIssuedAt==`number`&&e.latestInviteIssuedAt>0&&t.latestInviteIssuedAt<e.latestInviteIssuedAt?`A newer invite has already been accepted for this group on this device.`:typeof t.epoch==`number`&&t.epoch===e.epoch&&typeof t.counter==`number`&&t.counter<e.counter?`This invite would roll the group back to an older counter.`:null:null}x(),ee().theme===`light`?document.documentElement.setAttribute(`data-theme`,`light`):document.documentElement.removeAttribute(`data-theme`);var Q=null;function $a(){Q!==null&&(clearTimeout(Q),Q=null);let{settings:e}=b();!e.pinEnabled||e.autoLockMinutes<=0||!me()||(Q=setTimeout(async()=>{await S(),p(),ne(),m(),no()},e.autoLockMinutes*60*1e3))}function eo(){document.addEventListener(`pointerdown`,$a,{passive:!0}),document.addEventListener(`keydown`,$a,{passive:!0}),$a()}function to(){document.removeEventListener(`pointerdown`,$a),document.removeEventListener(`keydown`,$a),Q!==null&&(clearTimeout(Q),Q=null)}function no(){to(),ie();let e=document.getElementById(`app`);e.innerHTML=`
    <div class="lock-screen">
      <h1 class="lock-screen__brand">CANARY</h1>
      <p class="lock-screen__hint">Enter your PIN to unlock</p>
      <input
        type="password"
        class="input lock-screen__input"
        id="pin-input"
        inputmode="numeric"
        maxlength="8"
        autofocus
        autocomplete="off"
        placeholder="••••••"
      >
      <p class="lock-screen__error" id="pin-error" hidden>Incorrect PIN. Try again.</p>
      <button class="btn btn--primary lock-screen__btn" id="pin-submit">Unlock</button>
    </div>
  `;let t=document.getElementById(`pin-input`),n=document.getElementById(`pin-error`),r=document.getElementById(`pin-submit`),i=0,a=[0,1e3,2e3,5e3,15e3,3e4];async function o(){let e=t.value.trim();if(e.length<6){n.textContent=`PIN must be at least 6 digits.`,n.hidden=!1,t.focus();return}r.disabled=!0,r.textContent=`Unlocking…`,n.hidden=!0;try{await te(e),await go();{let{identity:e,personas:t}=b();if(e?.privkey){let n=Object.keys(t).filter(e=>![`personal`,`bitcoiner`,`work`,`social`,`anonymous`].includes(e)),r=v(e,n.length>0?n:void 0);for(let[e,n]of Object.entries(t))r[e]&&(r[e]={...r[e],...n,npub:r[e].npub});g({personas:r})}}ro();let t=document.getElementById(`header`);t&&ue(t),io(),so(),f(oo),eo(),ho(),lo(),window.addEventListener(`hashchange`,()=>lo()),vo(),Ke().catch(()=>{})}catch{i++;let e=a[Math.min(i,a.length-1)];n.textContent=e>0?`Incorrect PIN. Wait ${e/1e3}s before retrying.`:`Incorrect PIN. Try again.`,n.hidden=!1,t.value=``,r.disabled=!0,r.textContent=`Unlock`,e>0?setTimeout(()=>{r.disabled=!1,t.focus()},e):(r.disabled=!1,t.focus())}}r.addEventListener(`click`,()=>{o()}),t.addEventListener(`keydown`,e=>{e.key===`Enter`&&o()}),requestAnimationFrame(()=>t.focus())}function ro(){let e=document.getElementById(`app`);if(!e)throw Error(`Missing #app mount point`);e.innerHTML=`
    <header class="header" id="header"></header>

    <div class="sidebar-overlay" id="sidebar-overlay"></div>

    <div class="layout" id="groups-view">
      <aside class="sidebar" id="sidebar"></aside>

      <main class="content" id="content">
        <div id="welcome-container"></div>
        <div id="hero-container"></div>
        <div id="duress-alert-banner" hidden></div>
        <div id="members-container"></div>
        <div id="verify-container"></div>
        <div id="beacon-container"></div>
        <div id="liveness-container"></div>
        <div id="settings-container"></div>
      </main>
    </div>

    <div id="call-demo-view" hidden>
      <main class="content" style="max-width: 100%;">
        <div id="call-simulation-container"></div>
      </main>
    </div>

    <div id="identities-view" style="display:none"></div>

    <footer class="app-footer" id="app-footer">
      <button class="app-footer__sync" id="footer-sync-btn">Sync Groups</button>
      <span class="app-footer__sep">&middot;</span>
      <span class="app-footer__version">CANARY v1.4.0</span>
    </footer>
  `}function io(){let e=document.getElementById(`hamburger`),t=document.getElementById(`sidebar`),n=document.getElementById(`sidebar-overlay`);if(!e||!t||!n)return;function r(){t.classList.add(`sidebar--open`),n.classList.add(`sidebar-overlay--visible`),e.setAttribute(`aria-expanded`,`true`)}function i(){t.classList.remove(`sidebar--open`),n.classList.remove(`sidebar-overlay--visible`),e.setAttribute(`aria-expanded`,`false`)}e.setAttribute(`aria-expanded`,`false`),e.addEventListener(`click`,()=>{t.classList.contains(`sidebar--open`)?i():r()}),n.addEventListener(`click`,()=>{i()}),t.addEventListener(`click`,e=>{e.target.closest(`[data-group-id]`)&&i()})}var ao=!1;function oo(){ao||(ao=!0,requestAnimationFrame(()=>{ao=!1,so()}))}function so(){let{view:e}=b(),t=document.getElementById(`groups-view`),n=document.getElementById(`call-demo-view`),r=document.getElementById(`identities-view`);t&&(t.hidden=e!==`groups`),n&&(n.hidden=e!==`call-demo`),r&&(r.style.display=e===`identities`?``:`none`);let a=document.getElementById(`header`);if(a&&ue(a),e===`groups`){Ki();let e=document.getElementById(`welcome-container`);e&&Pt(e);let t=document.getElementById(`sidebar`);t&&ot(t);let n=document.getElementById(`hero-container`);n&&Xt(n);let r=document.getElementById(`verify-container`);r&&un(r);let a=document.getElementById(`members-container`);a&&Pr(a);let o=b().groups[b().activeGroupId??``],s=o?i(o)===`online`:!1,c=document.getElementById(`beacon-container`);c&&(s?(c.hidden=!1,si(c)):(vi(),c.hidden=!0,c.innerHTML=``));let l=document.getElementById(`liveness-container`);l&&(s?(l.hidden=!1,Ci(l)):(l.hidden=!0,l.innerHTML=``));let u=document.getElementById(`settings-container`);u&&Ei(u)}else if(e===`call-demo`){let e=document.getElementById(`call-simulation-container`);e&&Gi(e)}else if(e===`identities`){Ki();let e=document.getElementById(`identities-view`);e&&Ea(e)}}function co(){let{identity:e,personas:t,activePersonaName:r}=b(),a=e?.displayName&&e.displayName!==`You`?e.displayName:``,o=Object.keys(t),s=o.length>0?o.map(e=>{let t=e===(r??`personal`)?` selected`:``;return`<option value="${w(e)}"${t}>${w(e)}</option>`}).join(``):`<option value="personal">personal</option>`;ct(`
    <h2 class="modal__title">New Group</h2>
    <label class="input-label">
      <span>What's your group called?</span>
      <input
        class="input"
        type="text"
        name="name"
        placeholder="e.g. Family, Field Team"
        required
        autofocus
      />
    </label>
    ${a?``:`
    <label class="input-label">
      <span>Your name</span>
      <input
        class="input"
        type="text"
        name="myname"
        placeholder="e.g. Alice"
      />
    </label>
    `}
    <label class="input-label" style="margin-top: 0.5rem;">
      <span>Persona</span>
      <select class="input" name="persona">${s}</select>
    </label>
    <fieldset class="segmented" style="margin-top: 0.5rem;">
      <legend class="input-label__text" style="margin-bottom: 0.25rem;">Preset</legend>
      <button type="button" class="segmented__btn segmented__btn--active" data-preset="family">Family</button>
      <button type="button" class="segmented__btn" data-preset="field-ops">Field Ops</button>
      <button type="button" class="segmented__btn" data-preset="enterprise">Enterprise</button>
      <button type="button" class="segmented__btn" data-preset="event">Event</button>
    </fieldset>
    <div class="modal__actions">
      <button type="button" class="btn" id="modal-cancel-btn">Cancel</button>
      <button type="submit" class="btn btn--primary">Create</button>
    </div>
  `,t=>{let r=t.get(`name`)?.trim()??``;if(!r)return;let o=a||t.get(`myname`)?.trim()||``,s=t.get(`persona`)?.trim()||`personal`,c=Tt(r,document.querySelector(`.segmented__btn.segmented__btn--active[data-preset]`)?.dataset.preset??`family`,e?.pubkey,s);if(o&&e?.pubkey){let t=b().groups[c];t&&h(c,{memberNames:{...t.memberNames,[e.pubkey]:o}})}let l=b().groups[c];l&&i(l)===`online`&&n(l).length>0&&C(l.readRelays??[],l.writeRelays??[],c),$(),T(async()=>{let{shouldPromptForNotifications:e,shouldPromptAddToHomeScreen:t,isMacSafari:n,subscribeToPush:r,registerWithPushServer:i}=await import(`./push-D63Y9M1I.js`);return{shouldPromptForNotifications:e,shouldPromptAddToHomeScreen:t,isMacSafari:n,subscribeToPush:r,registerWithPushServer:i}},[],import.meta.url).then(({shouldPromptForNotifications:e,shouldPromptAddToHomeScreen:t,isMacSafari:n,subscribeToPush:r,registerWithPushServer:i})=>{if(t()){setTimeout(()=>{wo()},1500);return}if(n()&&!(`Notification`in window)){console.info(`[canary:push] Mac Safari without notification support — skipping prompt`);return}e()&&setTimeout(()=>{Co(async()=>{try{let e=await r();if(!e){console.warn(`[canary:push] subscribeToPush returned null — permission denied or unavailable`);return}let{hashGroupTag:t}=await T(async()=>{let{hashGroupTag:e}=await import(`./sync-BpNoyLp8.js`);return{hashGroupTag:e}},__vite__mapDeps([3,4,5,6,7,8]),import.meta.url),{groups:n}=b(),a=Object.values(n).map(e=>({tagHash:t(e.id),livenessInterval:e.livenessInterval}));await i(e,a),console.info(`[canary:push] Registered with push server, groups:`,a.length),A(`Notifications enabled`,`success`)}catch(e){console.error(`[canary:push] Registration failed:`,e),A(`Failed to enable notifications`,`error`)}})},1500)}).catch(e=>console.error(`[canary:push] Import failed:`,e))}),requestAnimationFrame(()=>{document.getElementById(`modal-cancel-btn`)?.addEventListener(`click`,()=>{document.getElementById(`app-modal`)?.close()}),document.querySelectorAll(`.segmented__btn[data-preset]`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.segmented__btn[data-preset]`).forEach(e=>e.classList.remove(`segmented__btn--active`)),e.classList.add(`segmented__btn--active`)})})})}function lo(){let e=window.location.hash;if(e.startsWith(`#ack/`)){let t;try{t=decodeURIComponent(e.slice(5))}catch{console.warn(`[canary] Malformed ack fragment — ignoring.`),window.location.hash=``;return}window.location.hash=``,document.dispatchEvent(new CustomEvent(`canary:confirm-member`,{detail:{token:t}}))}else if(e.startsWith(`#inv/`)){let t=e.slice(5);window.location.hash=``,uo(t)}else if(e.startsWith(`#j/`)){let t=e.slice(3);window.location.hash=``,/^[0-9a-f]{32}$/.test(t)?po(t):A(`Invalid invite link.`,`error`)}else if(e.startsWith(`#remote/`)){let t=e.slice(8);try{t=decodeURIComponent(t)}catch{}window.location.hash=``,mo(t)}}function uo(e){try{let n=ir(gn(e)),{identity:r}=b();if(!r?.pubkey){A(`No local identity — create or import one first.`,`error`);return}let i=document.getElementById(`binary-join-modal`);i||(i=document.createElement(`dialog`),i.id=`binary-join-modal`,i.className=`modal`,document.body.appendChild(i),i.addEventListener(`click`,e=>{e.target===i&&i.close()}));let a=i;a.innerHTML=`
      <div class="modal__form invite-share">
        <h2 class="modal__title">Join ${w(n.groupName)}</h2>
        <p class="invite-hint">Invited by <code>${w(n.inviterPubkey.slice(0,8))}\u2026</code></p>
        <p class="invite-hint">Ask the admin to read you the 3 confirmation words.</p>

        <label class="input-label">Confirmation words
          <input class="input" id="binary-join-confirm" type="text" placeholder="e.g. apple river castle" autocomplete="off">
        </label>
        <p class="invite-hint" id="binary-join-error" style="color: var(--duress); display: none;"></p>

        <div class="modal__actions" style="gap: 0.5rem;">
          <button class="btn" id="binary-join-cancel" type="button">Cancel</button>
          <button class="btn btn--primary" id="binary-join-accept" type="button">Join</button>
        </div>
      </div>
    `,a.querySelector(`#binary-join-cancel`)?.addEventListener(`click`,()=>a.close()),a.querySelector(`#binary-join-accept`)?.addEventListener(`click`,()=>{let e=a.querySelector(`#binary-join-confirm`),i=a.querySelector(`#binary-join-error`),o=e?.value.trim()??``;if(!o){i&&(i.textContent=`Please enter the confirmation words.`,i.style.display=``);return}try{let e=Rn(dn(n),o);if(zn(e.groupId,e.nonce))throw Error(`This invite has already been used.`);let i=e.groupId,{groups:s}=b(),c=Qa(s[i],{epoch:e.epoch,counter:e.counter,latestInviteIssuedAt:e.issuedAt});if(c)throw Error(c);let l=new Set(e.members);l.add(r.pubkey);let d=b().settings,f=e.relays.length>0?e.relays:d.defaultWriteRelays?.length?[...d.defaultWriteRelays]:[u],p=Array.from(new Set([...d.defaultReadRelays?.length?d.defaultReadRelays:t,...f])),m=f.length>0,h={id:i,name:e.groupName,seed:e.seed,members:Array.from(l),memberNames:e.memberNames??{},nostrEnabled:m,relays:e.relays,readRelays:p,writeRelays:f,wordlist:e.wordlist,wordCount:e.wordCount,counter:e.counter,usageOffset:e.usageOffset,rotationInterval:e.rotationInterval,encodingFormat:e.encodingFormat,usedInvites:[e.nonce],latestInviteIssuedAt:e.issuedAt,beaconInterval:e.beaconInterval,beaconPrecision:e.beaconPrecision,duressMode:`immediate`,livenessInterval:e.rotationInterval,livenessCheckins:{},tolerance:e.tolerance,personaName:b().activePersonaName??`personal`,createdAt:Math.floor(Date.now()/1e3),admins:[...e.admins],epoch:e.epoch,consumedOps:[]};g({groups:{...s,[i]:h},activeGroupId:i}),Bn(i,e.nonce),S(),$(),m&&r&&C(p,f,i).then(()=>{E(i,{type:`member-join`,pubkey:r.pubkey,displayName:r.displayName&&r.displayName!==`You`?r.displayName:void 0,timestamp:Math.floor(Date.now()/1e3),epoch:e.epoch,opId:crypto.randomUUID()})}),a.close(),A(`Joined ${e.groupName}`,`success`)}catch(e){i&&(i.textContent=e instanceof Error?e.message:`Failed to join group.`,i.style.display=``)}}),a.showModal()}catch(e){A(e instanceof Error?e.message:`Invalid QR invite.`,`error`)}}function fo(e,n,r){let{identity:i}=b();if(!i?.pubkey||!i?.privkey)return;let a=wn({envelope:e,joinerPrivkey:i.privkey,adminPubkey:n.adminPubkey,expectedInviteId:n.inviteId}),o=a.groupId,{groups:s}=b(),c=Qa(s[o],{epoch:a.epoch,counter:a.counter});if(c)throw Error(c);let l=new Set(a.members);l.add(i.pubkey);let d={...a.memberNames??{}};i.displayName&&i.displayName!==`You`&&(d[i.pubkey]=i.displayName);let f=[...a.relays??[]],p=f.length>0?f:[u],m=Array.from(new Set([...t,...p])),h=p.length>0,_={id:o,name:a.groupName,seed:a.seed,members:Array.from(l),memberNames:d,nostrEnabled:h,relays:f,readRelays:m,writeRelays:p,wordlist:a.wordlist,wordCount:a.wordCount,counter:a.counter,usageOffset:a.usageOffset,rotationInterval:a.rotationInterval,encodingFormat:a.encodingFormat,usedInvites:[],latestInviteIssuedAt:0,beaconInterval:a.beaconInterval,beaconPrecision:a.beaconPrecision,duressMode:`immediate`,livenessInterval:a.rotationInterval,livenessCheckins:{},tolerance:a.tolerance,personaName:b().activePersonaName??`personal`,createdAt:Math.floor(Date.now()/1e3),admins:[...a.admins],epoch:a.epoch,consumedOps:[]};g({groups:{...s,[o]:_},activeGroupId:o}),S(),$(),h&&i&&C(m,p,o).then(()=>{E(o,{type:`member-join`,pubkey:i.pubkey,displayName:i.displayName&&i.displayName!==`You`?i.displayName:void 0,timestamp:Math.floor(Date.now()/1e3),epoch:a.epoch,opId:crypto.randomUUID()})}),r.close(),A(`Joined ${a.groupName}`,`success`)}function po(e){let{identity:n,settings:r}=b();if(!n?.pubkey||!n?.privkey){A(`No local identity — create or import one first.`,`error`);return}let i=Array.from(new Set([...t,...r.defaultWriteRelays??[]])),a=r.defaultWriteRelays??[`wss://relay.trotters.cc`],o=document.getElementById(`relay-join-modal`);o||(o=document.createElement(`dialog`),o.id=`relay-join-modal`,o.className=`modal`,document.body.appendChild(o),o.addEventListener(`click`,e=>{e.target===o&&o.close()}));let s=o;s.innerHTML=`
    <div class="modal__form invite-share">
      <h2 class="modal__title">Joining...</h2>
      <p class="invite-hint" id="relay-join-status">Looking for invite on relay...</p>
      <div class="modal__actions">
        <button class="btn" id="relay-join-cancel" type="button">Cancel</button>
      </div>
    </div>
  `;let c=()=>{},l=()=>{};s.querySelector(`#relay-join-cancel`)?.addEventListener(`click`,()=>{c(),l(),s.close()}),s.showModal(),C(i,a).then(()=>{c=Tr({inviteId:e,readRelays:i,onToken(e){try{Sn(e)}catch(e){let t=s.querySelector(`#relay-join-status`);t&&(t.textContent=e instanceof Error?e.message:`Invalid invite token.`,t.style.color=`var(--duress)`);return}let n=e.relays?.length?e.relays:a,r=n,i=Array.from(new Set([...t,...n])),o=s.querySelector(`#relay-join-status`);o&&(o.textContent=`Joining ${e.groupName}...`),C(i,r).then(()=>{l=br({inviteId:e.inviteId,adminPubkey:e.adminPubkey,readRelays:i,writeRelays:r,onWelcome(t){try{fo(t,e,s)}catch{o&&(o.textContent=`Failed to join — welcome message could not be decrypted.`,o.style.color=`var(--duress)`)}},onError(e){o&&(o.textContent=e,o.style.color=`var(--duress)`)}})})},onError(e){let t=s.querySelector(`#relay-join-status`);t&&(t.textContent=e,t.style.color=`var(--duress)`)}})})}function mo(e){try{let n;try{n=mn(e)}catch{try{n=fn(e)}catch{throw Error(`Invalid invite — could not decode token.`)}}Sn(n);let r=n,{identity:i,settings:a}=b();if(!i?.pubkey||!i?.privkey){A(`No local identity — create or import one first.`,`error`);return}let o=`${r.adminPubkey.slice(0,8)}\u2026${r.adminPubkey.slice(-4)}`,s=r.relays?.length?r.relays:a.defaultWriteRelays,c=s,l=Array.from(new Set([...t,...s])),u=Array.from(new Set([...l,...c])),d=document.getElementById(`remote-join-modal`);d||(d=document.createElement(`dialog`),d.id=`remote-join-modal`,d.className=`modal`,document.body.appendChild(d),d.addEventListener(`click`,e=>{e.target===d&&d.close()}));let f=d,p=()=>{};f.innerHTML=`
      <div class="modal__form invite-share">
        <h2 class="modal__title">Remote Invite</h2>
        <p class="invite-hint">You've been invited to <strong>${w(r.groupName)}</strong> by <code>${w(o)}</code></p>

        <p class="invite-hint" id="remote-join-relay-status" style="color: var(--verified); font-weight: 500;">${u.length>0?`Connecting to relay...`:``}</p>

        <div style="margin: 1rem 0;">
          <p class="invite-hint" style="font-weight: 500;">Or send this join code manually:</p>
          <div style="display: flex; align-items: center; gap: 0.5rem; justify-content: center; margin: 0.5rem 0;">
            <code style="font-size: 0.75rem; word-break: break-all; max-width: 80%;">${w(i.pubkey)}</code>
            <button class="btn btn--sm" id="remote-join-copy-pubkey" type="button">Copy</button>
          </div>
        </div>

        <div style="margin: 1rem 0;">
          <p class="invite-hint">Paste the welcome message they send you:</p>
          <input class="input" id="remote-join-welcome-input" type="text" placeholder="Paste welcome message here..." autocomplete="off" style="font-family: monospace; font-size: 0.85rem;">
          <p class="invite-hint" id="remote-join-error" style="color: var(--duress); display: none;"></p>
        </div>

        <div class="modal__actions" style="gap: 0.5rem;">
          <button class="btn" id="remote-join-cancel" type="button">Cancel</button>
          <button class="btn btn--primary" id="remote-join-accept" type="button">Join</button>
        </div>
      </div>
    `,u.length>0&&C(l,c).then(()=>{let e=f.querySelector(`#remote-join-relay-status`);e&&(e.textContent=`Waiting for admin to send group key...`),p=br({inviteId:r.inviteId,adminPubkey:r.adminPubkey,readRelays:l,writeRelays:c,onWelcome(t){try{fo(t,r,f)}catch{e&&(e.textContent=`Auto-join failed — paste welcome message manually.`,e.style.color=`var(--duress)`)}},onError(t){e&&(e.textContent=t,e.style.color=`var(--duress)`)}})}),f.querySelector(`#remote-join-copy-pubkey`)?.addEventListener(`click`,async e=>{let t=e.currentTarget;try{await navigator.clipboard.writeText(i.pubkey),t.textContent=`Copied!`,setTimeout(()=>{t.textContent=`Copy`},1500)}catch{}}),f.querySelector(`#remote-join-cancel`)?.addEventListener(`click`,()=>{p(),f.close()}),f.querySelector(`#remote-join-accept`)?.addEventListener(`click`,async()=>{let e=f.querySelector(`#remote-join-welcome-input`),t=f.querySelector(`#remote-join-error`),n=(e?.value??``).replace(/[^A-Za-z0-9=+/]/g,``);if(!n){t&&(t.textContent=`Please paste the welcome message.`,t.style.display=``);return}try{p(),fo(n,r,f)}catch(e){t&&(t.textContent=e instanceof Error?e.message:`Failed to decrypt welcome message.`,t.style.display=``)}}),f.showModal()}catch(e){A(e instanceof Error?e.message:`Invalid remote invite.`,`error`)}}function ho(){document.addEventListener(`canary:create-group`,()=>{co()}),document.addEventListener(`canary:show-invite`,e=>{let{groupId:t}=e.detail,{groups:n}=b(),r=n[t];r&&jr(r)}),document.addEventListener(`canary:confirm-member`,e=>{let{identity:t,groups:n,activeGroupId:r}=b();if(!r||!t?.pubkey)return;let i=n[r];if(!i||!i.admins.includes(t.pubkey))return;let a=e.detail?.token??``;T(async()=>{let{showConfirmMemberModal:e}=await Promise.resolve().then(()=>Er);return{showConfirmMemberModal:e}},void 0,import.meta.url).then(({showConfirmMemberModal:e})=>{e(a)})}),document.addEventListener(`canary:verify-call`,e=>{let{groupId:t,pubkey:n}=e.detail;ka(t,n)}),document.addEventListener(`canary:pin-enable`,e=>{let t=e.detail?.pin;!t||t.length<6||he(t).then(()=>{g({settings:{...b().settings,pinEnabled:!0}}),eo()})}),document.addEventListener(`canary:pin-disable`,()=>{fe().then(()=>{g({settings:{...b().settings,pinEnabled:!1}}),to()})}),document.addEventListener(`canary:lock`,()=>{p(),ne(),no()}),document.addEventListener(`canary:sync-message`,e=>{let{groupId:t,message:n,sender:r}=e.detail,{activeGroupId:i}=b();if(n.type===`beacon`){if(t!==i)return;gi(r,n.lat,n.lon,n.accuracy??2e4,n.timestamp)}else if(n.type===`duress-alert`){let e=n.subject||r,{identity:i}=b();if(i?.pubkey===e)return;rn(e,t,n.lat==null?void 0:{lat:n.lat,lon:n.lon},n.timestamp)}else n.type===`duress-clear`&&document.dispatchEvent(new CustomEvent(`canary:duress-clear`,{detail:{subject:n.subject,clearedBy:r,groupId:t}}))}),document.addEventListener(`canary:resync`,()=>void vo()),document.addEventListener(`canary:publish-persona-profile`,async e=>{let{personaName:t}=e.detail,n=b().personas[t];n&&await Ue(n)}),document.addEventListener(`canary:vault-publish-now`,()=>$()),document.addEventListener(`canary:sync-vault`,()=>void Oo()),document.addEventListener(`visibilitychange`,()=>{if(document.hidden){S(),$();return}console.info(`[canary:boot] App foregrounded — reconnecting and syncing vault`),Ja(),ie(),T(async()=>{let{disconnectRelays:e}=await import(`./connect-BbpgMgeq.js`);return{disconnectRelays:e}},__vite__mapDeps([9,10,6,7,8]),import.meta.url).then(({disconnectRelays:e})=>{e(),vo()})})}async function go(){let{identity:e}=b(),t=await ae({pubkey:e?.pubkey??``,privkey:e?.privkey}),n={pubkey:t.pubkey,privkey:t.privkey,displayName:e?.displayName??`You`,signerType:`local`};(!e||e.pubkey!==n.pubkey)&&g({identity:Za(n,e)})}function _o(){let{identity:e}=b();if(!e?.pubkey)return;let t=e.privkey?async t=>{let{decryptVault:n}=await T(async()=>{let{decryptVault:e}=await Promise.resolve().then(()=>Aa);return{decryptVault:e}},void 0,import.meta.url);return n(t,e.privkey,e.pubkey)}:e.signerType===`nip07`?async t=>{try{return await window.nostr.nip44.decrypt(e.pubkey,t)}catch{return null}}:null;t&&qa(e.pubkey,t,(e,t)=>{let{groups:n}=b(),r=Ya(n,e,b().deletedGroupIds),i=Object.keys(r).length-Object.keys(n).length;(i>0||Object.entries(r).some(([e,t])=>{let r=n[e];return r?t.epoch!==r.epoch||t.counter!==r.counter:!0}))&&(g({groups:r}),S(),i>0?A(`${i} new group(s) synced from another device`,`success`):A(`Groups updated from another device`,`success`,2e3))})}async function vo(){let{groups:e,identity:t,settings:n}=b(),r=Object.keys(e).length,i=!!t?.privkey,a=[],o=[];for(let t of Object.values(e))a.push(...t.readRelays??[]),o.push(...t.writeRelays??[]),a.push(...t.relays??[]),o.push(...t.relays??[]);a.push(...n.defaultReadRelays??n.defaultRelays),o.push(...n.defaultWriteRelays??n.defaultRelays);let c=s(a),l=s(o),u=s([...c,...l]).length;if(u===0){console.warn(`[canary:boot] No relays found — sync disabled`),r>0&&A(`Sync disabled — ${r} group(s), no relays configured`,`warning`,5e3);return}if(!i&&t?.signerType!==`nip07`){console.warn(`[canary:boot] No privkey and no NIP-07 — sync disabled`),A(`Sync disabled — no private key`,`warning`,5e3);return}if(console.warn(`[canary:boot] Read relays:`,c,`Write relays:`,l),i){await C(c,l);let{waitForConnection:n}=await T(async()=>{let{waitForConnection:e}=await import(`./connect-BbpgMgeq.js`);return{waitForConnection:e}},__vite__mapDeps([9,10,6,7,8]),import.meta.url);await n(),console.info(`[canary:vault] Relay connections ready, fetching vault...`);try{let e=await Va(t.privkey,t.pubkey),n=e?.groups;if(console.info(`[canary:vault] Vault fetch result:`,n?`${Object.keys(n).length} group(s)`:`null`),n&&Object.keys(n).length>0){let{groups:e}=b(),t=Ya(e,n,b().deletedGroupIds);if(Object.keys(e).sort().join(`,`)!==Object.keys(t).sort().join(`,`)||Object.entries(t).some(([t,n])=>{let r=e[t];return r?n.epoch!==r.epoch||n.counter!==r.counter||n.usageOffset!==r.usageOffset||n.members.length!==r.members.length:!0})){g({groups:t});let n=Object.keys(t).length-Object.keys(e).length;n>0?A(`Restored ${n} group(s) from vault`,`success`):A(`Synced from vault`,`success`,1500)}}if(e?.personas&&e.personas.length>0){let{personas:t}=b(),n={...t};for(let t of e.personas)n[t.name]&&(n[t.name]={...n[t.name],...t,npub:n[t.name].npub});g({personas:n})}}catch(e){console.warn(`[canary:vault] Vault fetch failed:`,e)}de(),_o(),A(`Syncing via ${u} relay(s)`,`success`,2e3),typeof Notification<`u`&&Notification.permission===`granted`&&T(async()=>{let{getExistingSubscription:e,registerWithPushServer:t}=await import(`./push-D63Y9M1I.js`);return{getExistingSubscription:e,registerWithPushServer:t}},[],import.meta.url).then(async({getExistingSubscription:t,registerWithPushServer:n})=>{let r=await t();if(r){let{hashGroupTag:t}=await T(async()=>{let{hashGroupTag:e}=await import(`./sync-BpNoyLp8.js`);return{hashGroupTag:e}},__vite__mapDeps([3,4,5,6,7,8]),import.meta.url),i=Object.values(e).map(e=>({tagHash:t(e.id),livenessInterval:e.livenessInterval}));await n(r,i),console.info(`[canary:push] Re-registered with push server, groups:`,i.length)}else console.warn(`[canary:push] Permission granted but no existing subscription found`)}).catch(e=>console.error(`[canary:push] Re-registration failed:`,e))}else if(t?.signerType===`nip07`){let{connectRelays:e,waitForConnection:n}=await T(async()=>{let{connectRelays:e,waitForConnection:t}=await import(`./connect-BbpgMgeq.js`);return{connectRelays:e,waitForConnection:t}},__vite__mapDeps([9,10,6,7,8]),import.meta.url);e(c,l);try{await n(),console.info(`[canary:vault] NIP-07 vault sync starting...`);let e=await Wa(t.pubkey),r=e?.groups;if(console.info(`[canary:vault] NIP-07 vault result:`,r?`${Object.keys(r).length} group(s)`:`null`),r&&Object.keys(r).length>0){let{groups:e}=b(),t=Ya(e,r,b().deletedGroupIds);if(Object.keys(t).length!==Object.keys(e).length||Object.entries(t).some(([t,n])=>{let r=e[t];return r?n.epoch!==r.epoch||n.counter!==r.counter:!0})){g({groups:t});let n=Object.keys(t).length-Object.keys(e).length;n>0?A(`Restored ${n} group(s) from vault`,`success`):A(`Synced from vault`,`success`,1500)}}if(e?.personas&&e.personas.length>0){let{personas:t}=b(),n={...t};for(let t of e.personas)n[t.name]&&(n[t.name]={...n[t.name],...t,npub:n[t.name].npub});g({personas:n})}}catch(e){console.warn(`[canary:vault] NIP-07 vault sync failed:`,e)}_o(),A(`Connected to ${u} relay(s)`,`success`,2e3)}else{let{connectRelays:e}=await T(async()=>{let{connectRelays:e}=await import(`./connect-BbpgMgeq.js`);return{connectRelays:e}},__vite__mapDeps([9,10,6,7,8]),import.meta.url);e(c,l),A(`Connected to ${u} relay(s)`,`success`,2e3)}let{fetchOwnProfile:d}=await T(async()=>{let{fetchOwnProfile:e}=await import(`./profiles-T9Dne5zk.js`);return{fetchOwnProfile:e}},__vite__mapDeps([11,12,10,6,7,8,13,14,5,15]),import.meta.url);if(d(),oo(),i){let{startLivenessHeartbeat:e}=await T(async()=>{let{startLivenessHeartbeat:e}=await import(`./liveness-Bi7vNZvh.js`);return{startLivenessHeartbeat:e}},__vite__mapDeps([16,17,2,10,6,7,8,13,14,5,18,19,15,4]),import.meta.url);e()}}function yo(e){return Array.from(e,e=>e.toString(16).padStart(2,`0`)).join(``)}function bo(e){let t=e.split(` `),n=document.getElementById(`recovery-phrase-modal`);n||(n=document.createElement(`dialog`),n.id=`recovery-phrase-modal`,n.className=`modal`,document.body.appendChild(n));let r=n;r.textContent=``;let i=document.createElement(`div`);i.className=`modal__form`,i.style.maxWidth=`420px`;let a=document.createElement(`h2`);a.className=`modal__title`,a.textContent=`Back up your recovery phrase`,i.appendChild(a);let o=document.createElement(`p`);o.className=`invite-hint`,o.textContent=`Write these words down in order. They're the only way to recover your account.`,i.appendChild(o);let s=document.createElement(`div`);s.className=`recovery-grid`,s.style.cssText=`display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin:1rem 0;`,t.forEach((e,t)=>{let n=document.createElement(`div`);n.style.cssText=`border:1px solid var(--border);border-radius:4px;padding:0.5rem;text-align:center;font-family:var(--font-mono,monospace);font-size:0.8rem;`;let r=document.createElement(`span`);r.style.cssText=`color:var(--text-muted);font-size:0.7rem;`,r.textContent=`${t+1}. `;let i=document.createElement(`span`);i.style.fontWeight=`500`,i.textContent=e,n.append(r,i),s.appendChild(n)}),i.appendChild(s);let c=document.createElement(`p`);c.className=`invite-hint`,c.style.cssText=`color:var(--duress);font-weight:500;`,c.textContent=`Do not share these words with anyone.`,i.appendChild(c);let l=document.createElement(`div`);l.className=`modal__actions`,l.style.gap=`0.5rem`;let u=document.createElement(`button`);u.id=`recovery-phrase-copy`,u.className=`btn btn--primary`,u.type=`button`,u.textContent=`Copy words`,u.addEventListener(`click`,async()=>{try{await navigator.clipboard.writeText(e),u.textContent=`Copied!`,setTimeout(()=>{u.textContent=`Copy words`},2e3),setTimeout(()=>{navigator.clipboard.writeText(``).catch(()=>{})},3e4)}catch{}});let d=document.createElement(`button`);d.id=`recovery-phrase-skip`,d.className=`btn`,d.type=`button`,d.textContent=`Skip for now`,d.addEventListener(`click`,()=>r.close()),l.append(u,d),i.appendChild(l),r.appendChild(i),r.showModal()}function xo(){let e=document.getElementById(`app`);e.innerHTML=`
    <div class="lock-screen">
      <h1 class="lock-screen__brand">CANARY</h1>
      <p class="lock-screen__hint">Deepfake-proof identity verification</p>

      <div style="width: 100%; max-width: 360px; margin-top: 1.5rem;">

        <div style="background: var(--bg-raised); border: 1px solid var(--border); border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
          <p class="input-label__text" style="margin-bottom: 0.5rem;">Quick Start</p>
          <p class="settings-hint" style="margin-bottom: 0.5rem;">No Nostr account needed. Enter your name to get started.</p>
          <form id="offline-form" autocomplete="off" style="display: flex; gap: 0.375rem;">
            <input class="input" type="text" id="offline-name" placeholder="Enter your name" required style="flex: 1; font-size: 0.875rem; padding: 0.5rem;" />
            <button class="btn btn--primary" type="submit">Go</button>
          </form>
        </div>

        <div style="background: var(--bg-raised); border: 1px solid var(--border); border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
          <p class="input-label__text" style="margin-bottom: 0.5rem;">Recover Account</p>

          <div style="display: flex; gap: 0; margin-bottom: 0.75rem; border-bottom: 1px solid var(--border);">
            <button id="tab-recovery-phrase" type="button" class="btn btn--ghost btn--sm" style="border-bottom: 2px solid var(--accent); border-radius: 0; padding: 0.375rem 0.75rem; font-size: 0.75rem; opacity: 1;">Recovery Phrase</button>
            <button id="tab-shamir-shares" type="button" class="btn btn--ghost btn--sm" style="border-bottom: 2px solid transparent; border-radius: 0; padding: 0.375rem 0.75rem; font-size: 0.75rem; opacity: 0.6;">Shamir Shares</button>
          </div>

          <div id="panel-recovery-phrase">
            <p class="settings-hint" style="margin-bottom: 0.5rem;">Paste your 12-word recovery phrase to restore your account.</p>
            <form id="mnemonic-login-form" autocomplete="off" style="display: flex; flex-direction: column; gap: 0.375rem;">
              <textarea class="input" id="login-mnemonic" placeholder="Enter your 12 recovery words..." rows="3" style="width: 100%; font-size: 0.8rem; resize: none; padding: 0.5rem; font-family: var(--font-mono, monospace);"></textarea>
              <button class="btn btn--primary" type="submit">Recover account</button>
            </form>
          </div>

          <div id="panel-shamir-shares" style="display: none;">
            <p class="settings-hint" style="margin-bottom: 0.5rem;">Paste Shamir shares one at a time to reconstruct your recovery phrase.</p>
            <div style="display: flex; flex-direction: column; gap: 0.375rem;">
              <textarea class="input" id="shamir-share-input" placeholder="Paste a Shamir share (word list)..." rows="3" style="width: 100%; font-size: 0.8rem; resize: none; padding: 0.5rem; font-family: var(--font-mono, monospace);"></textarea>
              <button class="btn btn--primary" id="shamir-add-share" type="button">Add share</button>
              <p class="settings-hint" id="shamir-status" style="margin: 0; font-size: 0.75rem;"></p>
              <ul id="shamir-share-list" style="list-style: none; padding: 0; margin: 0;"></ul>
              <button class="btn btn--primary" id="shamir-recover" type="button" disabled style="margin-top: 0.25rem;">Recover</button>
            </div>
          </div>
        </div>

        <div style="background: var(--bg-raised); border: 1px solid var(--border); border-radius: 6px; padding: 1rem;">
          <p class="input-label__text" style="margin-bottom: 0.5rem;">Connect with Nostr</p>
          <p class="settings-hint" style="margin-bottom: 0.5rem;">Sync groups across devices via relays.</p>

          <form id="nsec-login-form" autocomplete="off" style="display: flex; flex-direction: column; gap: 0.375rem;">
            <input class="input" type="password" id="login-nsec" placeholder="nsec1..." autocomplete="off" style="width: 100%; font-size: 0.875rem; padding: 0.5rem;" />
            <button class="btn btn--primary" type="submit">Login with nsec</button>
          </form>

          <button class="btn" id="login-nip07" type="button" style="width: 100%; margin-top: 0.5rem;">Use Browser Extension (NIP-07)</button>

          <details style="margin-top: 0.75rem;">
            <summary class="settings-hint" style="cursor: pointer; user-select: none;">Relays</summary>
            <div style="margin-top: 0.375rem;">
              <p class="settings-hint" style="font-size: 0.7rem; margin: 0 0 0.25rem 0;">Write relay (publishing)</p>
              <ul id="login-relay-list" style="list-style: none; padding: 0; margin: 0 0 0.375rem 0;">
                ${(b().settings.defaultWriteRelays??b().settings.defaultRelays).map((e,t)=>`
                  <li style="display: flex; align-items: center; gap: 0.25rem; margin-bottom: 0.25rem;">
                    <span class="settings-hint" style="flex: 1; font-size: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0;">${w(e)}</span>
                    <button class="btn btn--ghost btn--sm login-relay-remove" data-relay-index="${t}" type="button" style="padding: 0 0.25rem; font-size: 0.7rem;">✕</button>
                  </li>
                `).join(``)}
              </ul>
              <div style="display: flex; gap: 0.25rem;">
                <input class="input" type="url" id="login-relay-input" placeholder="wss://relay.example.com" style="flex: 1; font-size: 0.75rem; padding: 0.375rem;" />
                <button class="btn btn--ghost btn--sm" id="login-relay-add" type="button">Add</button>
              </div>
              <p class="settings-hint" style="font-size: 0.7rem; margin: 0.5rem 0 0 0;">Read relays: ${t.map(e=>w(e.replace(`wss://`,``))).join(`, `)} + write relay(s)</p>
            </div>
          </details>
        </div>

      </div>
    </div>
  `,e.querySelector(`#offline-form`)?.addEventListener(`submit`,async t=>{t.preventDefault();let n=e.querySelector(`#offline-name`),r=n?.value.trim();if(!r){n?.focus();return}let{generateMnemonic:i}=await T(async()=>{let{generateMnemonic:e}=await import(`./bip39-DavBqmoH.js`);return{generateMnemonic:e}},__vite__mapDeps([20,19,7,8,14]),import.meta.url),{wordlist:a}=await T(async()=>{let{wordlist:e}=await import(`./english-DbZVR_DO.js`);return{wordlist:e}},__vite__mapDeps([21,22]),import.meta.url),{restoreFromMnemonic:o}=await T(async()=>{let{restoreFromMnemonic:e}=await import(`./mnemonic-CHsUp9IV.js`);return{restoreFromMnemonic:e}},__vite__mapDeps([23,24,6,7,8,19,14,22,5]),import.meta.url),s=i(a),{root:c,defaultPersona:l}=o(s),u=Array.from(l.identity.privateKey,e=>e.toString(16).padStart(2,`0`)).join(``),d=Array.from(l.identity.publicKey,e=>e.toString(16).padStart(2,`0`)).join(``);c.destroy(),g({identity:{pubkey:d,privkey:u,mnemonic:s,signerType:`local`,displayName:r}}),await So();let{publishKind0:f}=await T(async()=>{let{publishKind0:e}=await import(`./profiles-T9Dne5zk.js`);return{publishKind0:e}},__vite__mapDeps([11,12,10,6,7,8,13,14,5,15]),import.meta.url);f(r,u),bo(s)}),e.querySelector(`#mnemonic-login-form`)?.addEventListener(`submit`,async t=>{t.preventDefault();let n=e.querySelector(`#login-mnemonic`)?.value.trim();if(n){if(n.split(/\s+/).length!==12){alert(`Recovery phrase must be exactly 12 words.`);return}try{let{validateMnemonic:e,restoreFromMnemonic:t}=await T(async()=>{let{validateMnemonic:e,restoreFromMnemonic:t}=await import(`./mnemonic-CHsUp9IV.js`);return{validateMnemonic:e,restoreFromMnemonic:t}},__vite__mapDeps([23,24,6,7,8,19,14,22,5]),import.meta.url),{wordlist:r}=await T(async()=>{let{wordlist:e}=await import(`./english-DbZVR_DO.js`);return{wordlist:e}},__vite__mapDeps([21,22]),import.meta.url);if(!e(n,r)){alert(`Invalid recovery phrase. Please check your words and try again.`);return}let{root:i,defaultPersona:a}=t(n),o=Array.from(a.identity.privateKey,e=>e.toString(16).padStart(2,`0`)).join(``),s=Array.from(a.identity.publicKey,e=>e.toString(16).padStart(2,`0`)).join(``);i.destroy(),g({identity:{pubkey:s,privkey:o,mnemonic:n,signerType:`local`,displayName:`You`}}),await So()}catch{alert(`Invalid recovery phrase.`)}}});let n=e.querySelector(`#tab-recovery-phrase`),r=e.querySelector(`#tab-shamir-shares`),i=e.querySelector(`#panel-recovery-phrase`),a=e.querySelector(`#panel-shamir-shares`);n.addEventListener(`click`,()=>{i.style.display=``,a.style.display=`none`,n.style.borderBottomColor=`var(--accent)`,n.style.opacity=`1`,r.style.borderBottomColor=`transparent`,r.style.opacity=`0.6`}),r.addEventListener(`click`,()=>{i.style.display=`none`,a.style.display=``,r.style.borderBottomColor=`var(--accent)`,r.style.opacity=`1`,n.style.borderBottomColor=`transparent`,n.style.opacity=`0.6`});let o=[],s=0;function c(){let t=e.querySelector(`#shamir-status`),n=e.querySelector(`#shamir-share-list`),r=e.querySelector(`#shamir-recover`);n.textContent=``;for(let e=0;e<o.length;e++){let t=document.createElement(`li`);t.className=`settings-hint`,t.style.cssText=`font-size: 0.75rem; padding: 0.125rem 0;`,t.textContent=`Share ${e+1} added`,n.appendChild(t)}if(o.length===0)t.textContent=``,r.disabled=!0;else if(o.length<s){let e=s-o.length;t.textContent=`Share ${o.length} added. Need ${e} more.`,r.disabled=!0}else t.textContent=`Ready to recover!`,r.disabled=!1}e.querySelector(`#shamir-add-share`)?.addEventListener(`click`,async()=>{let t=e.querySelector(`#shamir-share-input`),n=t.value.trim();if(n)try{let{wordsToShare:e}=await T(async()=>{let{wordsToShare:e}=await import(`./dist-CC8yZlqR.js`);return{wordsToShare:e}},__vite__mapDeps([25,7,22]),import.meta.url),r=e(n.split(/\s+/));if(o.some(e=>e.id===r.id)){alert(`Share ${r.id} has already been added.`);return}if(o.length===0)s=r.threshold;else if(r.threshold!==s){alert(`Threshold mismatch: expected ${s}, got ${r.threshold}. Shares must be from the same set.`);return}o.push(r),t.value=``,c()}catch(e){alert(e instanceof Error?e.message:`Invalid share. Please check the words and try again.`)}}),e.querySelector(`#shamir-recover`)?.addEventListener(`click`,async()=>{if(!(o.length<s))try{let{reconstructSecret:e}=await T(async()=>{let{reconstructSecret:e}=await import(`./dist-CC8yZlqR.js`);return{reconstructSecret:e}},__vite__mapDeps([25,7,22]),import.meta.url),t=e(o,s),n=new TextDecoder().decode(t),{validateMnemonic:r,restoreFromMnemonic:i}=await T(async()=>{let{validateMnemonic:e,restoreFromMnemonic:t}=await import(`./mnemonic-CHsUp9IV.js`);return{validateMnemonic:e,restoreFromMnemonic:t}},__vite__mapDeps([23,24,6,7,8,19,14,22,5]),import.meta.url),{wordlist:a}=await T(async()=>{let{wordlist:e}=await import(`./english-DbZVR_DO.js`);return{wordlist:e}},__vite__mapDeps([21,22]),import.meta.url);if(!r(n,a)){alert(`Reconstructed phrase is not a valid mnemonic. Please check your shares.`);return}let{root:c,defaultPersona:l}=i(n),u=Array.from(l.identity.privateKey,e=>e.toString(16).padStart(2,`0`)).join(``),d=Array.from(l.identity.publicKey,e=>e.toString(16).padStart(2,`0`)).join(``);c.destroy(),g({identity:{pubkey:d,privkey:u,mnemonic:n,signerType:`local`,displayName:`You`}}),await So()}catch(e){alert(e instanceof Error?e.message:`Failed to reconstruct secret from shares.`)}}),e.querySelector(`#nsec-login-form`)?.addEventListener(`submit`,async t=>{t.preventDefault();let n=e.querySelector(`#login-nsec`)?.value.trim();if(n)try{let e=b().identity,t=y(n);if(t.type!==`nsec`){alert(`Not a valid nsec.`);return}let r=t.data,i=yo(r);g({identity:Za({pubkey:_e(r),privkey:i,signerType:`local`,displayName:`You`},e)}),await So()}catch(e){alert(e instanceof Error?e.message:`Invalid nsec format.`)}}),e.querySelector(`#login-nip07`)?.addEventListener(`click`,async()=>{if(!oe()){alert(`No Nostr extension found. Install Alby, nos2x, or another NIP-07 extension and reload.`);return}try{let e=b().identity;g({identity:Za({pubkey:await window.nostr.getPublicKey(),signerType:`nip07`,displayName:`You`},e)}),await So()}catch{alert(`Extension rejected the request.`)}});function l(){let t=e.querySelector(`#login-relay-list`);t&&(t.innerHTML=(b().settings.defaultWriteRelays??b().settings.defaultRelays).map((e,t)=>`
      <li style="display: flex; align-items: center; gap: 0.25rem; margin-bottom: 0.25rem;">
        <span class="settings-hint" style="flex: 1; font-size: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0;">${w(e)}</span>
        <button class="btn btn--ghost btn--sm login-relay-remove" data-relay-index="${t}" type="button" style="padding: 0 0.25rem; font-size: 0.7rem;">✕</button>
      </li>
    `).join(``),u())}function u(){e.querySelectorAll(`.login-relay-remove`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Number(e.dataset.relayIndex),n=[...b().settings.defaultWriteRelays??b().settings.defaultRelays];n.splice(t,1),g({settings:{...b().settings,defaultWriteRelays:n,defaultRelays:n}}),l()})})}u(),e.querySelector(`#login-relay-add`)?.addEventListener(`click`,()=>{let t=e.querySelector(`#login-relay-input`),n=t?.value.trim();if(!n||!Xa(n))return;let r=[...b().settings.defaultWriteRelays??b().settings.defaultRelays];r.includes(n)||(r.push(n),g({settings:{...b().settings,defaultWriteRelays:r,defaultRelays:r}}),l()),t&&(t.value=``)}),e.querySelector(`#login-relay-input`)?.addEventListener(`keydown`,t=>{t.key===`Enter`&&(t.preventDefault(),e.querySelector(`#login-relay-add`)?.click())})}async function So(){{let{identity:e,personas:t}=b();if(e?.privkey){let n=Object.keys(t).filter(e=>![`personal`,`bitcoiner`,`work`,`social`,`anonymous`].includes(e)),r=v(e,n.length>0?n:void 0);for(let[e,n]of Object.entries(t))r[e]&&(r[e]={...r[e],...n,npub:r[e].npub});g({personas:r})}}ro(),window.location.hash===`#call`&&g({view:`call-demo`});let e=document.getElementById(`header`);e&&ue(e),io(),document.getElementById(`footer-sync-btn`)?.addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:sync-vault`))}),so(),f(oo),f(Do),ho(),lo(),window.addEventListener(`hashchange`,()=>lo()),vo(),Ke().catch(()=>{})}function Co(e){let t=document.getElementById(`notification-prompt`);t&&t.remove();let n=document.createElement(`div`);n.id=`notification-prompt`,n.className=`notification-prompt`;let r=document.createElement(`div`);r.className=`notification-prompt__text`;let i=document.createElement(`strong`);i.textContent=`Enable notifications?`;let a=document.createElement(`span`);a.textContent=`We’ll alert you in emergencies and remind you to check in.`,r.append(i,a);let o=document.createElement(`div`);o.className=`notification-prompt__actions`;let s=document.createElement(`button`);s.className=`btn btn--sm btn--primary`,s.textContent=`Enable`;let c=document.createElement(`button`);c.className=`btn btn--sm`,c.textContent=`Not now`,o.append(s,c),n.append(r,o),document.getElementById(`app`)?.appendChild(n),s.addEventListener(`click`,()=>{n.remove(),e()}),c.addEventListener(`click`,()=>n.remove())}function wo(){let e=document.getElementById(`notification-prompt`);e&&e.remove();let t=document.createElement(`div`);t.id=`notification-prompt`,t.className=`notification-prompt`;let n=document.createElement(`div`);n.className=`notification-prompt__text`;let r=document.createElement(`strong`);r.textContent=`Add to Home Screen`;let i=document.createElement(`span`);i.textContent=`To receive emergency alerts and liveness reminders, add CANARY to your home screen. Tap the share button, then "Add to Home Screen".`,n.append(r,i);let a=document.createElement(`div`);a.className=`notification-prompt__actions`;let o=document.createElement(`button`);o.className=`btn btn--sm`,o.textContent=`Got it`,a.append(o),t.append(n,a),document.getElementById(`app`)?.appendChild(t),o.addEventListener(`click`,()=>t.remove())}var To=null,Eo=3e4;function Do(){let{identity:e,groups:t}=b();e?.pubkey&&(!e.privkey&&e.signerType!==`nip07`||Object.keys(t).length!==0&&(To&&clearTimeout(To),To=setTimeout(()=>{let{identity:e,groups:t,personas:n,deletedGroupIds:r}=b();if(!e?.pubkey||Object.keys(t).length===0)return;let i=Object.values(n);e.privkey?Ba(t,e.privkey,e.pubkey,i,r):e.signerType===`nip07`&&Ua(t,e.pubkey,i,r)},Eo)))}function $(){To&&clearTimeout(To);let{identity:e,groups:t,personas:n,deletedGroupIds:r}=b();if(!e?.pubkey||Object.keys(t).length===0)return;let i=Object.values(n);(e.privkey?Ba(t,e.privkey,e.pubkey,i,r):e.signerType===`nip07`?Ua(t,e.pubkey,i,r):null)?.then(()=>console.info(`[canary:vault] Vault published OK`)).catch(e=>{console.error(`[canary:vault] Vault publish FAILED:`,e),A(`Vault publish failed: ${e instanceof Error?e.message:e}`,`error`)})}async function Oo(){let{identity:e,groups:t,personas:n}=b();if(!e?.pubkey){A(`No identity — cannot sync`,`error`);return}if(!e.privkey&&e.signerType!==`nip07`){A(`No private key or extension — cannot sync`,`error`);return}let r=!e.privkey&&e.signerType===`nip07`,i=e.pubkey.slice(0,8);A(`Syncing as ${i}\u2026${r?` (NIP-07)`:``}`,`info`,3e3),console.info(`[canary:vault] Manual sync for pubkey ${i} (${r?`NIP-07`:`local key`})`);try{let a=Object.values(n),{deletedGroupIds:o}=b();Object.keys(t).length>0&&(r?await Ua(t,e.pubkey,a,o):await Ba(t,e.privkey,e.pubkey,a,o));let{waitForConnection:s}=await T(async()=>{let{waitForConnection:e}=await import(`./connect-BbpgMgeq.js`);return{waitForConnection:e}},__vite__mapDeps([9,10,6,7,8]),import.meta.url);await s();let c=r?await Wa(e.pubkey):await Va(e.privkey,e.pubkey),l=c?.groups;if(l&&Object.keys(l).length>0){let{groups:e}=b(),t=Ya(e,l,b().deletedGroupIds),n=Object.keys(t).length-Object.keys(e).length;g({groups:t}),S(),n>0?A(`Synced — ${n} new group(s) restored`,`success`):A(`Groups are in sync`,`success`,2e3)}else A(`No vault found for ${i}\u2026 — are both devices using the same identity?`,`warning`,5e3);if(c?.personas&&c.personas.length>0){let{personas:e}=b(),t={...e};for(let e of c.personas)t[e.name]&&(t[e.name]={...t[e.name],...e,npub:t[e.name].npub});g({personas:t})}}catch(e){console.error(`[canary:vault] Manual sync failed:`,e),A(`Sync failed: ${e instanceof Error?e.message:e}`,`error`)}}window.addEventListener(`pagehide`,()=>{To&&$()});async function ko(){if(me())no();else{pe();let{identity:e}=b();e?.pubkey?await So():xo()}}document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,()=>{ko()}):ko();export{$e as t};