const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./maplibre-gl-B2k4QVOw.css","./toast-C4N9aZta.js","./toast-CgbN074q.js","./sync-CTwt-KD4.js","./sync-CwEABoV0.js","./persona-Dsq2HFSt.js","./secp256k1-C_bO5q2F.js","./sha2-CYoIH8nM.js","./hmac-DQiyGg8T.js","./shamir-modal-nyv63WjC.js","./state-D7iyORQz.js","./types-BsOkdGB8.js","./escape-DpAnlPWD.js","./dist-Duc3fc8-.js","./english-mdr-mXCq.js","./linkage-proof-B1oYePWy.js","./persona-picker-ppgx_T96.js","./persona-Bwl3GD8v.js","./persona-tree-PFALM7An.js","./nip19-CMkgf31k.js","./base-Ed-gKsml.js","./export-modal-CtEny-xS.js","./persona-nfV62C_m.js","./connect-d0leYJBp.js","./connect-CMA3ZAWA.js","./profiles-Dv5SK7vr.js","./profiles-feOnOjJ_.js","./pure-DPIhlgK_.js","./liveness-CLvN1rM_.js","./header-CZwC5Pzq.js","./nip44-BYfilQ3Z.js","./bip39-DvIKHvPh.js","./bip39-DavBqmoH.js","./english-DbZVR_DO.js","./mnemonic-BvFL4mtR.js","./mnemonic-BV7pFTpA.js"])))=>i.map(i=>d[i]);
import{a as e,i as t,n,r,t as i}from"./types-BsOkdGB8.js";import{a,i as o,n as s,o as c,t as l}from"./state-D7iyORQz.js";import{S as u,_ as d,a as f,b as p,c as m,f as h,g,h as _,i as v,m as y,n as b,o as x,p as S,r as C,s as ee,t as te,v as ne,x as re,y as ie}from"./header-CZwC5Pzq.js";import{t as ae}from"./secp256k1-C_bO5q2F.js";import{i as oe,r as se,t as ce}from"./pure-DPIhlgK_.js";import{n as le,r as w,t as ue}from"./nip44-BYfilQ3Z.js";import{A as de,D as fe,E as pe,F as me,I as he,L as ge,M as _e,N as ve,O as ye,P as T,T as be,_ as xe,d as Se,f as Ce,g as we,h as Te,j as Ee,k as De,m as Oe,p as ke,v as Ae,y as je}from"./sync-CwEABoV0.js";import{c as Me,l as Ne,n as Pe,r as Fe,s as Ie,t as Le}from"./persona-Bwl3GD8v.js";import{i as Re,r as ze,t as E}from"./persona-tree-PFALM7An.js";import{a as Be,i as Ve,n as He,o as Ue,r as D,s as We}from"./connect-CMA3ZAWA.js";import{t as O}from"./toast-CgbN074q.js";import{t as Ge}from"./nip19-CMkgf31k.js";import{t as k}from"./escape-DpAnlPWD.js";import{n as Ke,t as qe}from"./persona-picker-ppgx_T96.js";import{a as Je,c as Ye,i as Xe,o as Ze,r as Qe}from"./profiles-feOnOjJ_.js";var $e=Object.create,et=Object.defineProperty,tt=Object.getOwnPropertyDescriptor,nt=Object.getOwnPropertyNames,rt=Object.getPrototypeOf,it=Object.prototype.hasOwnProperty,at=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),ot=(e,t)=>{let n={};for(var r in e)et(n,r,{get:e[r],enumerable:!0});return t||et(n,Symbol.toStringTag,{value:`Module`}),n},st=(e,t,n,r)=>{if(t&&typeof t==`object`||typeof t==`function`)for(var i=nt(t),a=0,o=i.length,s;a<o;a++)s=i[a],!it.call(e,s)&&s!==n&&et(e,s,{get:(e=>t[e]).bind(null,s),enumerable:!(r=tt(t,s))||r.enumerable});return e},ct=(e,t,n)=>(n=e==null?{}:$e(rt(e)),st(t||!e||!e.__esModule?et(n,`default`,{value:e,enumerable:!0}):n,e));(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function lt(e){let t=Math.floor(e/86400);if(t>=1)return`${t}d`;let n=Math.floor(e/3600);return n>=1?`${n}h`:`${Math.floor(e/60)}m`}function ut(e){return e?`
    <div class="identity-badge">
      <span class="identity-badge__name">${k(e.displayName??`${e.pubkey.slice(0,8)}…`)}</span>
    </div>
  `:``}function dt(e,t){let n=Object.values(e);if(n.length===0)return`<div class="group-list__empty">No groups yet</div>`;let{activePersonaId:r,personas:i}=s();return n.map(e=>{let n=e.id===t,a=n?` group-list__item--active`:``,o=lt(e.livenessInterval),s=lt(e.livenessInterval),c=e.personaId?Object.values(i).find(t=>t.id===e.personaId):void 0,l=c?qe(c.name):``,u=c?.archived||r&&e.personaId!==r?` hidden`:``;return`
        <button
          class="group-list__item${a}"
          data-group-id="${k(e.id)}"
          aria-current="${n?`true`:`false`}"
          ${u}
        >
          ${l}<span class="group-list__name">${k(e.name)}</span>
          <span class="group-list__preset">${k(o)} · ${k(s)}</span>
        </button>
      `}).join(``)}function ft(e){let{identity:t,groups:n,activeGroupId:r}=s();e.innerHTML=`
    <div class="sidebar__tagline">spoken-word verification</div>
    ${ut(t)}
    <nav class="group-list" aria-label="Groups">
      ${dt(n,r)}
    </nav>
    <button class="btn btn--primary" id="create-group-btn">+ New Group</button>
    <button class="btn btn--sm sidebar__sync-btn" id="sync-groups-btn" title="Sync groups from other devices">Sync Groups</button>
  `,e.querySelector(`.group-list`)?.addEventListener(`click`,e=>{let t=e.target.closest(`[data-group-id]`);if(!t)return;let n=t.dataset.groupId;n&&a({activeGroupId:n})}),e.querySelector(`#create-group-btn`)?.addEventListener(`click`,()=>{e.dispatchEvent(new CustomEvent(`canary:create-group`,{bubbles:!0}))}),e.querySelector(`#sync-groups-btn`)?.addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:sync-vault`))})}var pt=`app-modal`;function mt(e,t){let n=document.getElementById(pt);if(n||(n=document.createElement(`dialog`),n.id=pt,n.className=`modal`,document.body.appendChild(n)),n.innerHTML=`
    <form class="modal__form" method="dialog" id="modal-form">
      ${e}
    </form>
  `,t){let e=n.querySelector(`#modal-form`);e?.addEventListener(`submit`,n=>{n.preventDefault(),t(new FormData(e)),ht()})}n.addEventListener(`click`,e=>{e.target===n&&ht()}),n.showModal()}function ht(){document.getElementById(pt)?.close()}var gt=/^[0-9a-f]{64}$/,_t=/^[0-9b-hjkmnp-z]+$/,vt=new TextEncoder().encode(`canary:beacon:key`),yt=new TextEncoder().encode(`canary:duress:key`);function bt(e){if(!gt.test(e))throw Error(`seedHex must be a 64-character lowercase hex string (32 bytes)`)}function xt(e){if(e.length!==32)throw Error(`AES-256-GCM requires a 32-byte key`)}function St(e){return bt(e),me(T(e),vt)}function Ct(e){return bt(e),me(T(e),yt)}async function wt(e,t){xt(e);let n=crypto.getRandomValues(new Uint8Array(12)),r=await crypto.subtle.importKey(`raw`,e,{name:`AES-GCM`},!1,[`encrypt`]),i=new Uint8Array(await crypto.subtle.encrypt({name:`AES-GCM`,iv:n},r,t)),a=new Uint8Array(12+i.length);return a.set(n),a.set(i,12),Ee(a)}async function Tt(e,t,n){if(typeof t!=`string`||t.length===0||t.length>11)throw Error(`geohash must be a non-empty string of at most 11 characters`);if(!_t.test(t))throw Error(`geohash contains invalid characters (valid: 0-9, b-h, j-k, m-n, p-z)`);if(!Number.isInteger(n)||n<1||n>11)throw Error(`precision must be an integer between 1 and 11`);let r={geohash:t,precision:n,timestamp:Math.floor(Date.now()/1e3)};return wt(e,new TextEncoder().encode(JSON.stringify(r)))}function Et(e,t,n){if(!gt.test(e))throw Error(`Invalid member pubkey: expected 64 lowercase hex characters, got ${e.length} chars`);if(t){if(typeof t.geohash!=`string`||t.geohash.length===0||t.geohash.length>11)throw Error(`location.geohash must be a non-empty string of at most 11 characters`);if(!_t.test(t.geohash))throw Error(`location.geohash contains invalid characters (valid: 0-9, b-h, j-k, m-n, p-z)`);if(!Number.isInteger(t.precision)||t.precision<1||t.precision>11)throw Error(`location.precision must be an integer between 1 and 11`);return{type:`duress`,member:e,geohash:t.geohash,precision:t.precision,locationSource:t.locationSource,timestamp:Math.floor(Date.now()/1e3),scope:n?.scope??`group`,...n?.originGroupId!==void 0&&{originGroupId:n.originGroupId}}}return{type:`duress`,member:e,geohash:``,precision:0,locationSource:`none`,timestamp:Math.floor(Date.now()/1e3),scope:n?.scope??`group`,...n?.originGroupId!==void 0&&{originGroupId:n.originGroupId}}}async function Dt(e,t){return wt(e,new TextEncoder().encode(JSON.stringify(t)))}function Ot(){let{identity:e}=s();if(!e?.pubkey)throw Error(`No local identity — cannot perform privileged action.`);return e.pubkey}function kt(e){let t=Ot();if(!e.admins.includes(t))throw Error(`Not authorised — you are not an admin of "${e.name}".`)}function At(e){let t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function jt(e,t,n,r){let i=crypto.randomUUID(),o=ke({name:e,members:n?[n]:[],preset:t,creator:n}),c=s().settings,l=[...c.defaultReadRelays??c.defaultRelays],u=[...c.defaultWriteRelays??c.defaultRelays],d={family:`words`,"field-ops":`words`,enterprise:`words`,event:`pin`},f={...o,id:i,nostrEnabled:u.length>0||l.length>0,relays:u,readRelays:l,writeRelays:u,encodingFormat:d[t]??`words`,usedInvites:[],latestInviteIssuedAt:0,livenessInterval:o.rotationInterval,livenessCheckins:{},tolerance:1,memberNames:{},duressMode:`immediate`,personaId:r??``},{groups:p}=s();return a({groups:{...p,[i]:f},activeGroupId:i}),n&&v(i,{type:`member-join`,pubkey:n,timestamp:Math.floor(Date.now()/1e3),epoch:0,opId:crypto.randomUUID()}),i}function Mt(e){let{groups:t,activeGroupId:n,deletedGroupIds:r}=s(),i={...t};delete i[e];let o=r.includes(e)?r:[...r,e];a({groups:i,activeGroupId:n===e?null:n,deletedGroupIds:o}),document.dispatchEvent(new CustomEvent(`canary:vault-publish-now`))}function Nt(e){let{groups:t}=s(),n=t[e];if(!n){console.warn(`[canary:actions] reseedGroup: unknown group id "${e}"`);return}kt(n);let r=Te(n),i=(n.epoch??0)+1,a=crypto.randomUUID(),o=[...n.admins??[]];v(e,{type:`reseed`,seed:At(r.seed),counter:r.counter,timestamp:Math.floor(Date.now()/1e3),epoch:i,opId:a,admins:o,members:[...n.members]}),c(e,{...r,epoch:i,consumedOps:[a],admins:o}),x(e)}function Pt(e){let{groups:t}=s(),n=t[e];if(!n){console.warn(`[canary:actions] compromiseReseed: unknown group id "${e}"`);return}kt(n);let r=Te(n),i=(n.epoch??0)+1;c(e,{...r,epoch:i,consumedOps:[],admins:[...n.admins??[]]}),x(e)}function Ft(e,t,n){let{groups:r}=s(),i=r[e];if(!i){console.warn(`[canary:actions] addGroupMember: unknown group id "${e}"`);return}kt(i);let a=crypto.randomUUID();c(e,{...Se(i,t),consumedOps:[...i.consumedOps??[],a]}),x(e),v(e,{type:`member-join`,pubkey:t,displayName:n||void 0,timestamp:Math.floor(Date.now()/1e3),epoch:i.epoch??0,opId:a})}function It(e,t){let{groups:n}=s(),r=n[e];if(!r){console.warn(`[canary:actions] removeGroupMember: unknown group id "${e}"`);return}if(t!==Ot()&&kt(r),!r.members.includes(t))return;let i=Te(Oe(r,t)),a=(r.epoch??0)+1,o={...r.memberNames??{}};delete o[t];let l={...r.livenessCheckins??{}};delete l[t];let u=(r.admins??[]).filter(e=>e!==t);c(e,{...i,memberNames:o,livenessCheckins:l,admins:u,epoch:a,consumedOps:[]}),x(e)}function Lt(e){let{groups:t}=s(),n=t[e];if(!n){console.warn(`[canary:actions] burnWord: unknown group id "${e}"`);return}let r=Ce(n);c(e,r),v(e,{type:`counter-advance`,counter:r.counter,usageOffset:r.usageOffset,timestamp:Math.floor(Date.now()/1e3)})}var Rt=/^[0-9a-f]{64}$/;function zt(e){if(!e||typeof e!=`object`)throw Error(`Import failed — expected a JSON object.`);let t=e;if(typeof t.name!=`string`||t.name.trim().length===0)throw Error(`Import failed — name is required.`);if(typeof t.seed!=`string`||!Rt.test(t.seed))throw Error(`Import failed — seed must be a 64-character lowercase hex string.`);if(!Array.isArray(t.members)||t.members.length===0)throw Error(`Import failed — members must be a non-empty array.`);for(let e of t.members)if(typeof e!=`string`||!Rt.test(e))throw Error(`Import failed — invalid member pubkey: "${String(e)}".`);if(Array.isArray(t.admins)){for(let e of t.admins)if(typeof e!=`string`||!Rt.test(e))throw Error(`Import failed — invalid admin pubkey: "${String(e)}".`);let e=new Set(t.members);for(let n of t.admins)if(!e.has(n))throw Error(`Import failed — admin "${n}" is not in the members list.`)}if(t.rotationInterval!==void 0&&(typeof t.rotationInterval!=`number`||!Number.isInteger(t.rotationInterval)||t.rotationInterval<=0))throw Error(`Import failed — rotationInterval must be a positive integer.`);if(t.wordCount!==void 0&&t.wordCount!==1&&t.wordCount!==2&&t.wordCount!==3)throw Error(`Import failed — wordCount must be 1, 2, or 3.`);if(t.encodingFormat!==void 0&&t.encodingFormat!==`words`&&t.encodingFormat!==`pin`&&t.encodingFormat!==`hex`)throw Error(`Import failed — encodingFormat must be words, pin, or hex.`);if(t.epoch!==void 0&&(typeof t.epoch!=`number`||!Number.isInteger(t.epoch)||t.epoch<0))throw Error(`Import failed — epoch must be a non-negative integer.`);if(t.consumedOps!==void 0&&(!Array.isArray(t.consumedOps)||!t.consumedOps.every(e=>typeof e==`string`)))throw Error(`Import failed — consumedOps must be an array of strings.`)}function Bt(e){let{groups:t}=s();if(Object.keys(t).length>0){e.hidden=!0;return}e.hidden=!1,e.innerHTML=`
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
  `,document.getElementById(`welcome-create`).addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:create-group`))}),document.getElementById(`welcome-join`).addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:join-group`))})}var A=`canary:group`;function j(e){switch(e.encodingFormat){case`pin`:return{format:`pin`,digits:6};case`hex`:return{format:`hex`,length:8};default:return{format:`words`,count:e.wordCount}}}function Vt(e,t){return t===`pin`&&e.length===6?`${e.slice(0,3)}-${e.slice(3)}`:t===`hex`&&e.length===8?`${e.slice(0,4)}-${e.slice(4)}`:e}function Ht(e,t){let{identity:n}=s();return n?.pubkey===e?`You`:t.memberNames?.[e]||e.slice(0,8)+`…`}var Ut=null;function Wt(){Ut!==null&&(clearInterval(Ut),Ut=null)}function Gt(e=new Date){return e.toISOString().slice(11,19)+` UTC`}function Kt(e){return e.replace(/[a-zA-Z0-9]/g,`•`)}var qt=`ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789•·∘◦○●◈◆▪▫`;function Jt(e,t,n=600){let r=t.length,i=Math.ceil(n/30),a=e=>Math.floor(e/r*i*.7)+Math.floor(i*.3),o=0,s=setInterval(()=>{o++;let n=``;for(let e=0;e<r;e++)o>=a(e)?n+=t[e]:n+=qt[Math.floor(Math.random()*65)];e.textContent=n,o>=i&&(clearInterval(s),e.textContent=t)},30)}function Yt(e){if(e<=0)return`0s`;let t=Math.floor(e/86400),n=Math.floor(e%86400/3600),r=Math.floor(e%3600/60),i=Math.floor(e%60);return t>=1?n>0?`${t}d ${n}h`:`${t}d`:n>=1?r>0?`${n}h ${r}m`:`${n}h`:r>=1?i>0?`${r}m ${i}s`:`${r}m`:`${i}s`}function Xt(e){let t=Math.floor(Date.now()/1e3),n=(be(t,e.rotationInterval)+1)*e.rotationInterval;return Math.max(0,n-t)}var Zt=[`Sun`,`Mon`,`Tue`,`Wed`,`Thu`,`Fri`,`Sat`],Qt=[`Jan`,`Feb`,`Mar`,`Apr`,`May`,`Jun`,`Jul`,`Aug`,`Sep`,`Oct`,`Nov`,`Dec`];function $t(e,t){if(t>=86400){let t=new Date(Date.now()+e*1e3);return`rotates ${Zt[t.getUTCDay()]} ${t.getUTCDate()} ${Qt[t.getUTCMonth()]} at ${String(t.getUTCHours()).padStart(2,`0`)}:${String(t.getUTCMinutes()).padStart(2,`0`)} UTC (${Yt(e)})`}return`rotates in ${Yt(e)} · ${Gt()}`}function en(e){let{identity:t}=s(),n=e.counter+e.usageOffset;return fe(e.seed,A,n,j(e),t?.pubkey)}function tn(e){let{identity:t}=s();if(!t?.pubkey)return null;let n=e.counter+e.usageOffset;return xe(e.seed,A,t.pubkey,n,j(e),e.tolerance)}function nn(t){Wt();let{groups:n,activeGroupId:r}=s();if(!r){t.innerHTML=``;return}let i=n[r];if(!i){t.innerHTML=``;return}let a=we(i);if(a!==i){c(r,a);return}let o=Vt(en(i),i.encodingFormat),l=tn(i),u=l?Vt(l,i.encodingFormat):null,d=Kt(o),f=Xt(i);t.innerHTML=`
    <section class="hero">

      <div class="hero__word-container">
        <div class="hero__word hero__word--masked" id="hero-word">${d}</div>
        <button
          class="hero__reveal-btn btn"
          id="hero-reveal-btn"
          type="button"
          aria-label="Hold to reveal verification word"
        >Hold to Reveal</button>
      </div>

      <div class="hero__countdown">
        <div class="hero__progress">
          <div class="hero__progress-bar" id="hero-progress-bar" style="width: ${Math.min(100,Math.max(0,(i.rotationInterval-f)/i.rotationInterval*100))}%"></div>
        </div>
        <span class="hero__countdown-label" id="hero-countdown-label">${$t(f,i.rotationInterval)}</span>
      </div>

      <p class="hero__hint">Press and hold to reveal. Tap the right side for your alternate word.</p>

      <button class="btn btn--ghost" id="burn-btn" type="button" title="Rotate to a new word now. All group members will get a new word too.">I used this word</button>
      <button class="btn btn--outline" id="hero-invite-btn" type="button" title="Share group access with someone new">Invite Someone</button>
      ${i.members.length>=2?`<button class="btn btn--outline" id="hero-call-btn" type="button" title="Start a phone call verification">Verify Call</button>`:``}

    </section>
  `;let p=t.querySelector(`#hero-word`),m=t.querySelector(`#hero-reveal-btn`);function h(e){p&&(p.textContent=e&&u?u:o,p.classList.remove(`hero__word--masked`),p.classList.add(`hero__word--revealed`))}function g(){p&&(p.textContent=d,p.classList.remove(`hero__word--revealed`),p.classList.add(`hero__word--masked`))}m&&(m.addEventListener(`pointerdown`,e=>{e.preventDefault();let t=m.getBoundingClientRect();h(e.clientX-t.left>t.width/2)}),m.addEventListener(`pointerup`,g),m.addEventListener(`pointerleave`,g),m.addEventListener(`pointercancel`,g)),t.querySelector(`#burn-btn`)?.addEventListener(`click`,()=>{try{Lt(r),O(e(s().groups[r]??i)===`online`?`Word rotated — syncing to group`:`Word rotated`,`success`,2e3),document.dispatchEvent(new CustomEvent(`canary:vault-publish-now`)),requestAnimationFrame(()=>{let e=document.getElementById(`hero-word`);e&&Jt(e,e.textContent??`••••••••`)})}catch(e){O(e instanceof Error?e.message:`Failed to rotate word`,`error`)}}),t.querySelector(`#hero-invite-btn`)?.addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:show-invite`,{detail:{groupId:r}}))}),t.querySelector(`#hero-call-btn`)?.addEventListener(`click`,()=>{let{identity:e}=s(),t=i.members.filter(t=>t!==e?.pubkey);if(t.length===0)return;if(t.length===1){document.dispatchEvent(new CustomEvent(`canary:verify-call`,{detail:{groupId:r,pubkey:t[0]}}));return}let n=t.map(e=>`
      <button class="btn btn--outline member-pick-btn" data-pubkey="${k(e)}" type="button" style="width:100%;text-align:left;margin-bottom:0.5rem;">
        ${k(Ht(e,i))}
      </button>
    `).join(``),a=document.getElementById(`member-picker`);a||(a=document.createElement(`dialog`),a.id=`member-picker`,a.className=`modal`,document.body.appendChild(a)),a.innerHTML=`
      <div class="modal__form" style="min-width:240px;">
        <h2 class="modal__title">Who are you calling?</h2>
        ${n}
        <div class="modal__actions">
          <button class="btn" id="picker-cancel" type="button">Cancel</button>
        </div>
      </div>
    `,a.querySelector(`#picker-cancel`)?.addEventListener(`click`,()=>a.close()),a.addEventListener(`click`,e=>{e.target===a&&a.close()}),a.querySelectorAll(`.member-pick-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.pubkey;a.close(),t&&document.dispatchEvent(new CustomEvent(`canary:verify-call`,{detail:{groupId:r,pubkey:t}}))})}),a.showModal()});let _=t.querySelector(`#hero-progress-bar`),v=t.querySelector(`#hero-countdown-label`);Ut=setInterval(()=>{let{groups:e}=s(),n=e[r];if(!n){Wt();return}let i=Xt(n),a=Math.min(100,Math.max(0,(n.rotationInterval-i)/n.rotationInterval*100));_&&(_.style.width=`${a}%`),v&&(v.textContent=$t(i,n.rotationInterval)),i===0&&(Wt(),nn(t))},1e3)}var rn=`canary:duress-dismissed`;function an(){try{let e=localStorage.getItem(rn);return e?new Set(JSON.parse(e)):new Set}catch{return new Set}}function on(e){let t=an();t.add(e),localStorage.setItem(rn,JSON.stringify([...t]))}function sn(e){let t=an();t.delete(e),localStorage.setItem(rn,JSON.stringify([...t]))}function cn(e,t){let n=s().groups[t];if(!n)return e.slice(0,8);let{identity:r}=s();return r?.pubkey===e?`You`:n.memberNames?.[e]||`${e.slice(0,8)}\u2026${e.slice(-4)}`}function ln(e){let t=Math.floor(Date.now()/1e3)-e;if(t<30)return`just now`;if(t<60)return`${t}s ago`;let n=Math.floor(t/60);return n<60?`${n} min ago`:new Date(e*1e3).toLocaleTimeString()}function un(e,t,n,r,i){if(!i&&an().has(e))return;let a=document.querySelector(`.duress-overlay`);a&&a.remove();let o=cn(e,t),c=r?ln(r):new Date().toLocaleTimeString(),l=document.createElement(`div`);l.className=`duress-overlay`,l.dataset.subject=e,l.dataset.groupId=t,l.setAttribute(`role`,`alertdialog`),l.setAttribute(`aria-label`,`${o} needs help`);let u=document.createElement(`div`);u.className=`duress-overlay__content`;let d=document.createElement(`div`);d.className=`duress-overlay__icon`,d.setAttribute(`aria-hidden`,`true`),d.textContent=`!`,u.appendChild(d);let f=document.createElement(`h1`);f.className=`duress-overlay__title`,f.textContent=o,u.appendChild(f);let p=document.createElement(`h2`);if(p.className=`duress-overlay__subtitle`,p.textContent=`NEEDS HELP`,u.appendChild(p),n&&(n.lat!==0||n.lon!==0)){let e=document.createElement(`p`);e.className=`duress-overlay__location`,e.textContent=`Last known: ${n.lat.toFixed(4)}, ${n.lon.toFixed(4)}`,u.appendChild(e)}let m=document.createElement(`p`);m.className=`duress-overlay__time`,m.textContent=c,u.appendChild(m);let h=document.createElement(`button`);h.className=`btn btn--lg duress-overlay__dismiss`,h.textContent=`I'm Responding`,h.title=`Dismiss this alert on your screen only — does not clear the duress for others`,h.addEventListener(`click`,()=>{on(e),l.classList.remove(`duress-overlay--visible`),setTimeout(()=>l.remove(),300)}),u.appendChild(h);let g=document.createElement(`button`);g.className=`btn btn--lg duress-overlay__stand-down`,g.textContent=`Stand Down — Person is Safe`,g.title=`Broadcast to all group members that this person has been confirmed safe`,g.addEventListener(`click`,()=>{on(e),v(t,{type:`duress-clear`,subject:e,timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID()}),l.classList.remove(`duress-overlay--visible`),setTimeout(()=>l.remove(),300);let{identity:n}=s();O(`Duress stood down for ${o} by ${n?.pubkey===e?`Self`:cn(n?.pubkey??``,t)}`,`success`)}),u.appendChild(g),l.appendChild(u),document.body.appendChild(l),requestAnimationFrame(()=>l.classList.add(`duress-overlay--visible`));function _(e){e.key===`Escape`&&(l.classList.remove(`duress-overlay--visible`),setTimeout(()=>l.remove(),300),document.removeEventListener(`keydown`,_))}document.addEventListener(`keydown`,_)}document.addEventListener(`canary:duress-clear`,(e=>{let{subject:t,clearedBy:n}=e.detail;sn(t);let r=Array.from(document.querySelectorAll(`.duress-overlay`)).find(e=>e.dataset.subject===t);r&&(r.classList.remove(`duress-overlay--visible`),setTimeout(()=>r.remove(),300));let i=e.detail.groupId,a=cn(t,i),o=cn(n,i);O(t===n?`${a} self-cleared their duress`:`${o} confirmed ${a} is safe`,`success`)}));function dn(e){let t=new Uint32Array(1);return crypto.getRandomValues(t),t[0]%e}function fn(e){let{groups:t,activeGroupId:n,identity:r}=s();if(r?.pubkey===e)return`You`;if(!n)return e.slice(0,8)+`…`;let i=t[n];return i&&i.memberNames?.[e]||e.slice(0,8)+`…`}function pn(e,t){let n=[],r=new Set(t);for(;n.length<e;){let e=de(dn(De)).toLowerCase();r.has(e)||(r.add(e),n.push(e))}return n}function mn(e){for(let t=e.length-1;t>0;t--){let n=dn(t+1);[e[t],e[n]]=[e[n],e[t]]}return e}function hn(e,t){for(let n of e)un(n,t,void 0,Math.floor(Date.now()/1e3),!0);document.dispatchEvent(new CustomEvent(`canary:duress`,{detail:{members:e},bubbles:!0}));let{groups:n}=s(),r=n[t];if(!r)return;let i=Ct(r.seed);for(let n of e)Dt(i,Et(n,null)),v(t,{type:`duress-alert`,lat:0,lon:0,timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID(),subject:n})}function gn(e){let{groups:t,activeGroupId:n}=s();if(!n){e.innerHTML=``;return}let r=t[n];if(!r){e.innerHTML=``;return}let{identity:i}=s(),a=r.members.filter(e=>e!==i?.pubkey);if(a.length===0){e.innerHTML=`
      <section class="panel verify-panel">
        <h2 class="panel__title">Verify Someone</h2>
        <p class="settings-hint">No other members to verify yet. Invite someone first.</p>
      </section>
    `;return}e.innerHTML=`
    <section class="panel verify-panel">
      <h2 class="panel__title">Verify Someone</h2>
      <p class="settings-hint">Who are you verifying?</p>

      <div class="verify-member-list" id="verify-member-list">
        ${a.map(e=>`<button class="verify-member-btn btn btn--outline" data-pubkey="${k(e)}" type="button">${k(fn(e))}</button>`).join(``)}
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
  `;let o=e.querySelector(`#verify-member-list`),c=e.querySelector(`#verify-choices-area`),l=e.querySelector(`#verify-choices`),u=e.querySelector(`#verify-prompt`),d=e.querySelector(`#verify-result`),f=e.querySelector(`#verify-back`);function p(e){let{groups:t,activeGroupId:n}=s();if(!n)return;let r=t[n];if(!r)return;let i=be(Math.floor(Date.now()/1e3),r.rotationInterval)+r.usageOffset,a=j(r),f=fe(r.seed,A,i,a,e).toLowerCase(),p=xe(r.seed,A,e,i,a,r.tolerance)?.toLowerCase(),h=new Set([f]);p&&h.add(p);let g=pn(p?2:3,h),_=mn([f,...p?[p]:[],...g]);u.textContent=`Tap the word ${fn(e)} just said:`,d.hidden=!0,l.innerHTML=_.map(e=>`<button class="verify-choice" data-word="${k(e)}" type="button">${k(Vt(e,r.encodingFormat))}</button>`).join(``),o.hidden=!0,c.hidden=!1,l.querySelectorAll(`.verify-choice`).forEach(t=>{t.addEventListener(`click`,()=>m(t.dataset.word??``,t,e))})}function m(e,t,n){let{groups:r,activeGroupId:i}=s();if(!i)return;let a=r[i];if(!a)return;let o=be(Math.floor(Date.now()/1e3),a.rotationInterval)+a.usageOffset,c=je(a.seed,A,o,e,a.members,{encoding:j(a),tolerance:a.tolerance}),u=c.status===`valid`,p=fn(n);l.querySelectorAll(`.verify-choice`).forEach(e=>e.classList.remove(`verify-choice--correct`,`verify-choice--wrong`)),t.classList.add(u?`verify-choice--correct`:`verify-choice--wrong`),d.hidden=!1,d.className=`verify-result verify-result--${u?`valid`:`invalid`}`,d.textContent=u?`${p} is verified.`:`${p} gave the wrong word.`,f.hidden=!1,c.status===`duress`&&hn(c.identities??[],i)}e.querySelectorAll(`.verify-member-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.pubkey;t&&p(t)})}),f.addEventListener(`click`,()=>{o.hidden=!1,c.hidden=!0,d.hidden=!0,f.hidden=!0});let h=e.querySelector(`#verify-input`),g=e.querySelector(`#verify-btn`);function _(){let e=h?.value.trim().toLowerCase().replace(/-/g,``)??``;if(!e)return;let{groups:t,activeGroupId:n}=s();if(!n)return;let r=t[n];if(!r)return;let i=be(Math.floor(Date.now()/1e3),r.rotationInterval)+r.usageOffset,a=je(r.seed,A,i,e,r.members,{encoding:j(r),tolerance:r.tolerance}),o=a.status===`valid`;d.hidden=!1,d.className=`verify-result verify-result--${o?`valid`:`invalid`}`,d.textContent=o?`Verified.`:`Wrong word.`,f.hidden=!1,a.status===`duress`&&hn(a.identities??[],n)}g?.addEventListener(`click`,_),h?.addEventListener(`keydown`,e=>{e.key===`Enter`&&_()})}function _n(e){let t=JSON.stringify(e),n=new TextEncoder().encode(t),r=``;for(let e=0;e<n.length;e++)r+=String.fromCharCode(n[e]);return btoa(r)}function vn(e){let t=atob(e),n=new Uint8Array(t.length);for(let e=0;e<t.length;e++)n[e]=t.charCodeAt(e);return JSON.parse(new TextDecoder().decode(n))}function yn(e){return _n(e).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=+$/,``)}function bn(e){let t=e.replace(/-/g,`+`).replace(/_/g,`/`),n=t.length%4;return n===2?t+=`==`:n===3&&(t+=`=`),vn(t)}function xn(e){let t=``;for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return btoa(t).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=+$/,``)}function Sn(e){let t=e.replace(/-/g,`+`).replace(/_/g,`/`),n=t.length%4;n===2?t+=`==`:n===3&&(t+=`=`);let r=atob(t),i=new Uint8Array(r.length);for(let e=0;e<r.length;e++)i[e]=r.charCodeAt(e);return i}var Cn=/^[0-9a-f]{64}$/,wn=/^[0-9a-f]{128}$/,Tn=/^[0-9a-f]{32}$/;function En(e){let{adminSig:t,...n}=e,r=Object.keys(n).sort().reduce((e,t)=>(e[t]=n[t],e),{});return new TextEncoder().encode(JSON.stringify(r))}function Dn(e){let{groupName:t,groupId:n,adminPubkey:r,adminPrivkey:i,relays:a,expiresInSec:o=86400}=e,s=new Uint8Array(16);crypto.getRandomValues(s);let c={groupName:t,groupId:n,adminPubkey:r,inviteId:_e(s),expiresAt:Math.floor(Date.now()/1e3)+o,relays:[...a],adminSig:``},l=he(En(c));return c.adminSig=_e(ae.sign(l,T(i))),c}function On(e){if(typeof e!=`object`||!e)throw Error(`Remote invite token must be a non-null object`);let t=e;if(typeof t.groupName!=`string`||t.groupName.length===0)throw Error(`groupName must be a non-empty string`);if(typeof t.groupId!=`string`||t.groupId.length===0)throw Error(`groupId must be a non-empty string`);if(typeof t.adminPubkey!=`string`||!Cn.test(t.adminPubkey))throw Error(`adminPubkey must be a 64-character hex string`);if(typeof t.inviteId!=`string`||!Tn.test(t.inviteId))throw Error(`inviteId must be a 32-character hex string`);if(typeof t.adminSig!=`string`||!wn.test(t.adminSig))throw Error(`adminSig must be a 128-character hex string`);if(!Array.isArray(t.relays)||!t.relays.every(e=>typeof e==`string`))throw Error(`relays must be an array of strings`);if(typeof t.expiresAt!=`number`||!Number.isFinite(t.expiresAt))throw Error(`expiresAt must be a finite number`);let n=Math.floor(Date.now()/1e3);if(t.expiresAt<=n)throw Error(`Remote invite token has expired`);let r=e,i=he(En(r));if(!ae.verify(T(r.adminSig),i,T(r.adminPubkey)))throw Error(`Remote invite token signature is invalid`)}function kn(e){let{welcome:t,adminPrivkey:n,joinerPubkey:r}=e;return le(JSON.stringify(t),w(T(n),r))}function An(e){let{envelope:t,joinerPrivkey:n,adminPubkey:r,expectedInviteId:i}=e,a=ue(t,w(T(n),r)),o=JSON.parse(a);if(typeof o.inviteId!=`string`||!Tn.test(o.inviteId))throw Error(`Welcome payload must include a valid inviteId`);if(o.inviteId!==i)throw Error(`Welcome payload inviteId does not match the pending invite`);if(typeof o.seed!=`string`||!Cn.test(o.seed))throw Error(`Welcome payload seed must be a 64-character hex string`);if(typeof o.groupId!=`string`||o.groupId.length===0)throw Error(`Welcome payload must include a non-empty groupId`);return o}function jn(e){if(e.startsWith(`wss://`))return!0;if(e.startsWith(`ws://`))try{let t=new URL(e);return t.hostname===`localhost`||t.hostname===`127.0.0.1`||t.hostname===`[::1]`}catch{return!1}return!1}var Mn=/^[0-9a-f]{64}$/,Nn=/^[0-9a-f]{128}$/,Pn=/^[0-9a-f]{32}$/,Fn=10080*60,In=300;function M(e){return typeof e==`number`&&Number.isInteger(e)&&e>=0}function Ln(){let e=new Uint8Array(16);return crypto.getRandomValues(e),Array.from(e).map(e=>e.toString(16).padStart(2,`0`)).join(``)}function Rn(e){let t=e;if(!t||typeof t!=`object`)throw Error(`Invalid invite payload — expected an object.`);if(typeof t.groupId!=`string`||t.groupId.length===0)throw Error(`Invalid invite payload — groupId is required.`);if(typeof t.seed!=`string`||!Mn.test(t.seed))throw Error(`Invalid invite payload — seed must be 64-char hex.`);if(typeof t.groupName!=`string`||t.groupName.trim().length===0)throw Error(`Invalid invite payload — groupName is required.`);if(!Number.isInteger(t.rotationInterval)||t.rotationInterval<=0)throw Error(`Invalid invite payload — rotationInterval must be > 0.`);if(t.wordCount!==1&&t.wordCount!==2&&t.wordCount!==3)throw Error(`Invalid invite payload — wordCount must be 1, 2, or 3.`);if(typeof t.wordlist!=`string`||t.wordlist.length===0)throw Error(`Invalid invite payload — wordlist is required.`);if(!M(t.counter)||!M(t.usageOffset))throw Error(`Invalid invite payload — counter and usageOffset must be non-negative integers.`);if(typeof t.nonce!=`string`||!Pn.test(t.nonce))throw Error(`Invalid invite payload — nonce must be 32-char hex.`);if(!Number.isInteger(t.beaconInterval)||t.beaconInterval<=0)throw Error(`Invalid invite payload — beaconInterval must be > 0.`);if(!Number.isInteger(t.beaconPrecision)||t.beaconPrecision<1||t.beaconPrecision>11)throw Error(`Invalid invite payload — beaconPrecision must be 1..11.`);if(!Array.isArray(t.members)||!t.members.every(e=>typeof e==`string`&&Mn.test(e)))throw Error(`Invalid invite payload — members must be 64-char hex pubkeys.`);if(!Array.isArray(t.relays)||!t.relays.every(e=>typeof e==`string`&&jn(e)))throw Error(`Invalid invite payload — relays must be wss:// URLs (or ws:// for localhost).`);if(t.encodingFormat!==`words`&&t.encodingFormat!==`pin`&&t.encodingFormat!==`hex`)throw Error(`Invalid invite payload — encodingFormat must be words|pin|hex.`);if(!M(t.tolerance))throw Error(`Invalid invite payload — tolerance must be a non-negative integer.`);if(t.tolerance>10)throw Error(`Invalid invite payload — tolerance must be <= 10.`);if(!M(t.issuedAt)||!M(t.expiresAt))throw Error(`Invalid invite payload — issuedAt/expiresAt must be unix seconds.`);if(t.expiresAt<=t.issuedAt)throw Error(`Invalid invite payload — expiresAt must be after issuedAt.`);if(!M(t.epoch))throw Error(`Invalid invite payload — epoch must be a non-negative integer.`);if(!Array.isArray(t.admins)||!t.admins.every(e=>typeof e==`string`&&Mn.test(e)))throw Error(`Invalid invite payload — admins must be 64-char hex pubkeys.`);let n=new Set(t.members);if(!t.admins.every(e=>n.has(e)))throw Error(`Invalid invite payload — all admins must be in members.`);if(t.protocolVersion===void 0||t.protocolVersion===null)throw Error(`Invalid invite payload — protocolVersion is required.`);if(t.protocolVersion!==2)throw Error(`Unsupported invite protocol version: ${t.protocolVersion} (expected: 2)`);if(typeof t.inviterPubkey!=`string`||!Mn.test(t.inviterPubkey))throw Error(`Invalid invite payload — inviterPubkey must be a 64-char hex pubkey.`);if(!t.admins.includes(t.inviterPubkey))throw Error(`Invalid invite payload — inviterPubkey must be in admins.`);if(typeof t.inviterSig!=`string`||!Nn.test(t.inviterSig))throw Error(`Invalid invite payload — inviterSig must be a 128-char hex Schnorr signature.`)}function zn(e){let{inviterSig:t,memberNames:n,relays:r,...i}=e,a=Object.keys(i).sort().reduce((e,t)=>(e[t]=i[t],e),{});return new TextEncoder().encode(JSON.stringify(a))}function Bn(e,t){let n=he(zn(e));return _e(ae.sign(n,T(t)))}function Vn(e){let t=he(zn(e));return ae.verify(T(e.inviterSig),t,T(e.inviterPubkey))}function Hn(e){let{nonce:t,relays:n,memberNames:r,...i}=e,a=JSON.stringify(i),o=new TextEncoder,s=me(T(t),o.encode(a)),c=s[0]<<25|s[1]<<17|s[2]<<9|s[3]<<1|s[4]>>7,l=c>>>22&2047,u=c>>>11&2047,d=c&2047;return`${de(l)} ${de(u)} ${de(d)}`}function Un(e){let{identity:t}=s();if(!t?.pubkey)throw Error(`No identity — sign in first.`);if(!t.privkey)throw Error(`Invite creation requires a local key (nsec). NIP-07 extensions cannot sign invites.`);if(!e.admins.includes(t.pubkey))throw Error(`Not authorised — you are not an admin of "${e.name}".`);let n=Ln(),r=Math.floor(Date.now()/1e3),i={groupId:e.id,seed:e.seed,groupName:e.name,rotationInterval:e.rotationInterval,wordCount:e.wordCount,wordlist:e.wordlist,counter:e.counter,usageOffset:e.usageOffset,nonce:n,beaconInterval:e.beaconInterval,beaconPrecision:e.beaconPrecision,members:[...e.members],relays:[...e.writeRelays??e.relays??[]],encodingFormat:e.encodingFormat??`words`,tolerance:e.tolerance??1,issuedAt:r,expiresAt:r+Fn,epoch:e.epoch??0,admins:[...e.admins??[]],protocolVersion:2,inviterPubkey:t.pubkey,inviterSig:``,memberNames:{...e.memberNames}};return i.inviterSig=Bn(i,t.privkey),{payload:i,confirmCode:Hn(i)}}function Wn(e,t){let n;try{n=vn(e)}catch{throw Error(`Invalid invite payload — could not decode.`)}Rn(n);let r={groupId:n.groupId,seed:n.seed,groupName:n.groupName,rotationInterval:n.rotationInterval,wordCount:n.wordCount,wordlist:n.wordlist,counter:n.counter,usageOffset:n.usageOffset,nonce:n.nonce,beaconInterval:n.beaconInterval,beaconPrecision:n.beaconPrecision,members:[...n.members],relays:[...n.relays],encodingFormat:n.encodingFormat,tolerance:n.tolerance,issuedAt:n.issuedAt,expiresAt:n.expiresAt,epoch:n.epoch,admins:[...n.admins],protocolVersion:n.protocolVersion,inviterPubkey:n.inviterPubkey,inviterSig:n.inviterSig,memberNames:n.memberNames&&typeof n.memberNames==`object`?{...n.memberNames}:void 0};if(!Vn(r))throw Error(`Invite signature is invalid — the inviter could not prove control of the admin key.`);if(!t?.trim())throw Error(`Confirmation code is required — ask the sender to read it to you.`);let i=Hn(r);if(t.trim().replace(/[-\s]+/g,` `).toLowerCase()!==i.toLowerCase())throw Error(`Confirmation words do not match — invite may have been tampered with.`);let a=Math.floor(Date.now()/1e3);if(r.expiresAt<=a)throw Error(`Invite has expired. Ask for a new invite.`);if(r.issuedAt>a+In)throw Error(`Invite timestamp is too far in the future — check your device clock.`);return r}function Gn(e,t){let{groups:n}=s(),r=n[e];return r?Array.isArray(r.usedInvites)&&r.usedInvites.includes(t):!1}function Kn(e,t){let{groups:n}=s(),r=n[e];if(!r){console.warn(`[canary:invite] consumeInvite: unknown group id "${e}"`);return}c(e,{usedInvites:Array.from(new Set([...r.usedInvites,t]))})}var qn=10080*60;function Jn(e){let t=Object.keys(e).sort().reduce((t,n)=>(t[n]=e[n],t),{});return new TextEncoder().encode(JSON.stringify(t))}function Yn(e,t){let n;try{n=vn(e)}catch{return{valid:!1,error:`Invalid join token — could not decode.`}}if(n.g!==t.groupId)return{valid:!1,error:`Join token is for a different group.`};if(typeof n.p!=`string`||!Mn.test(n.p))return{valid:!1,error:`Join token has invalid pubkey.`};if(typeof n.s!=`string`||!Nn.test(n.s))return{valid:!1,error:`Join token has invalid signature.`};let r=Math.floor(Date.now()/1e3);if(typeof n.t!=`number`||n.t<r-qn)return{valid:!1,error:`Join token has expired or is stale.`};if(n.t>r+In)return{valid:!1,error:`Join token timestamp is too far in the future.`};let{s:i,...a}=n,o=he(Jn(a));try{if(!ae.verify(T(n.s),o,T(n.p)))return{valid:!1,error:`Join token signature is invalid.`}}catch{return{valid:!1,error:`Join token signature verification failed.`}}let s=(n.w||``).toLowerCase(),c=t.tolerance??1,l=!1;for(let e=t.counter-c;e<=t.counter+c;e++)if(!(e<0)&&s===fe(t.groupSeed,t.context,e,t.encoding).toLowerCase()){l=!0;break}return l?{valid:!0,pubkey:n.p,displayName:n.n||``,word:n.w||``}:{valid:!1,error:`Join token word does not match — seed possession not proven.`}}var Xn=null;function Zn(e){let{identity:t}=s();if(!t?.pubkey)throw Error(`No identity — sign in first.`);if(!t.privkey)throw Error(`Invite creation requires a local key (nsec). NIP-07 extensions cannot sign invites.`);if(!e.admins.includes(t.pubkey))throw Error(`Not authorised — you are not an admin of "${e.name}".`);let n=e.writeRelays?.length?[...e.writeRelays]:[...s().settings.defaultWriteRelays??s().settings.defaultRelays],r=Dn({groupName:e.name,groupId:e.id,adminPubkey:t.pubkey,adminPrivkey:t.privkey,relays:n}),i=yn(r);return Xn={groupId:e.id,tokenPayload:i,inviteId:r.inviteId},Xn}function Qn(e,t){let{identity:n}=s();if(!n?.privkey)throw Error(`No local identity — cannot create welcome envelope.`);if(!Xn)throw Error(`No active remote invite session — cannot create welcome envelope.`);return kn({welcome:{inviteId:Xn.inviteId,seed:e.seed,counter:e.counter,usageOffset:e.usageOffset,epoch:e.epoch??0,wordCount:e.wordCount,rotationInterval:e.rotationInterval,groupId:e.id,groupName:e.name,wordlist:e.wordlist,beaconInterval:e.beaconInterval,beaconPrecision:e.beaconPrecision,encodingFormat:e.encodingFormat??`words`,tolerance:e.tolerance??1,members:[...e.members],admins:[...e.admins??[]],relays:[...e.writeRelays??e.relays??[]],memberNames:e.memberNames?{...e.memberNames}:void 0},adminPrivkey:n.privkey,joinerPubkey:t})}function $n(){Xn=null}function er(e){let t=new Uint8Array(e.length/2);for(let n=0;n<t.length;n++)t[n]=parseInt(e.substring(n*2,n*2+2),16);return t}function tr(e){let t=``;for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,`0`);return t}var nr={words:0,pin:1,hex:2},rr={0:`words`,1:`pin`,2:`hex`},ir={"en-v1":0},ar={0:`en-v1`},or=1,sr=new TextEncoder,cr=new TextDecoder;function lr(e){let t=sr.encode(e.groupId),n=sr.encode(e.groupName),r=e.admins.map(t=>{let n=e.members.indexOf(t);if(n===-1)throw Error(`Admin ${t} not found in members array`);return n}),i=178+e.members.length*32+1+r.length+1+t.length+1+n.length,a=new ArrayBuffer(i),o=new DataView(a),s=new Uint8Array(a),c=0;o.setUint8(c,or),c+=1,s.set(er(e.seed),c),c+=32,s.set(er(e.inviterPubkey),c),c+=32,s.set(er(e.inviterSig),c),c+=64,s.set(er(e.nonce),c),c+=16,o.setUint32(c,e.counter),c+=4,o.setUint16(c,e.usageOffset),c+=2,o.setUint32(c,e.epoch),c+=4,o.setUint32(c,e.rotationInterval),c+=4,o.setUint32(c,e.beaconInterval),c+=4,o.setUint8(c,e.beaconPrecision),c+=1,o.setUint8(c,e.wordCount),c+=1,o.setUint8(c,e.tolerance),c+=1,o.setUint8(c,nr[e.encodingFormat]??0),c+=1,o.setUint8(c,ir[e.wordlist]??0),c+=1,o.setUint32(c,e.issuedAt),c+=4,o.setUint32(c,e.expiresAt),c+=4,o.setUint8(c,e.protocolVersion),c+=1,o.setUint8(c,e.members.length),c+=1;for(let t of e.members)s.set(er(t),c),c+=32;o.setUint8(c,r.length),c+=1;for(let e of r)o.setUint8(c,e),c+=1;return o.setUint8(c,t.length),c+=1,s.set(t,c),c+=t.length,o.setUint8(c,n.length),c+=1,s.set(n,c),c+=n.length,s}function ur(e){let t=new DataView(e.buffer,e.byteOffset,e.byteLength),n=0,r=t.getUint8(n);if(n+=1,r!==or)throw Error(`Unsupported binary invite version: ${r}`);let i=tr(e.slice(n,n+32));n+=32;let a=tr(e.slice(n,n+32));n+=32;let o=tr(e.slice(n,n+64));n+=64;let s=tr(e.slice(n,n+16));n+=16;let c=t.getUint32(n);n+=4;let l=t.getUint16(n);n+=2;let u=t.getUint32(n);n+=4;let d=t.getUint32(n);n+=4;let f=t.getUint32(n);n+=4;let p=t.getUint8(n);n+=1;let m=t.getUint8(n);n+=1;let h=t.getUint8(n);n+=1;let g=rr[t.getUint8(n)]??`words`;n+=1;let _=ar[t.getUint8(n)]??`en-v1`;n+=1;let v=t.getUint32(n);n+=4;let y=t.getUint32(n);n+=4;let b=t.getUint8(n);n+=1;let x=t.getUint8(n);n+=1;let S=[];for(let t=0;t<x;t++)S.push(tr(e.slice(n,n+32))),n+=32;let C=t.getUint8(n);n+=1;let ee=[];for(let e=0;e<C;e++){let e=t.getUint8(n);if(n+=1,e>=S.length)throw Error(`Invalid admin index ${e} in binary invite (${S.length} members)`);ee.push(S[e])}let te=t.getUint8(n);n+=1;let ne=cr.decode(e.slice(n,n+te));n+=te;let re=t.getUint8(n);n+=1;let ie=cr.decode(e.slice(n,n+re));return n+=re,{groupId:ne,seed:i,groupName:ie,rotationInterval:d,wordCount:m,wordlist:_,counter:c,usageOffset:l,nonce:s,beaconInterval:f,beaconPrecision:p,members:S,relays:[],encodingFormat:g,tolerance:h,issuedAt:v,expiresAt:y,epoch:u,admins:ee,protocolVersion:b,inviterPubkey:a,inviterSig:o}}var N=function(e,t){let n=e,r=dr[t],i=null,a=0,o=null,s=[],c={},l=function(e,t){a=n*4+17,i=function(e){let t=Array(e);for(let n=0;n<e;n+=1){t[n]=Array(e);for(let r=0;r<e;r+=1)t[n][r]=null}return t}(a),u(0,0),u(a-7,0),u(0,a-7),p(),f(),h(e,t),n>=7&&m(e),o??=v(n,r,s),g(o,t)},u=function(e,t){for(let n=-1;n<=7;n+=1)if(!(e+n<=-1||a<=e+n))for(let r=-1;r<=7;r+=1)t+r<=-1||a<=t+r||(0<=n&&n<=6&&(r==0||r==6)||0<=r&&r<=6&&(n==0||n==6)||2<=n&&n<=4&&2<=r&&r<=4?i[e+n][t+r]=!0:i[e+n][t+r]=!1)},d=function(){let e=0,t=0;for(let n=0;n<8;n+=1){l(!0,n);let r=I.getLostPoint(c);(n==0||e>r)&&(e=r,t=n)}return t},f=function(){for(let e=8;e<a-8;e+=1)i[e][6]??(i[e][6]=e%2==0);for(let e=8;e<a-8;e+=1)i[6][e]??(i[6][e]=e%2==0)},p=function(){let e=I.getPatternPosition(n);for(let t=0;t<e.length;t+=1)for(let n=0;n<e.length;n+=1){let r=e[t],a=e[n];if(i[r][a]==null)for(let e=-2;e<=2;e+=1)for(let t=-2;t<=2;t+=1)e==-2||e==2||t==-2||t==2||e==0&&t==0?i[r+e][a+t]=!0:i[r+e][a+t]=!1}},m=function(e){let t=I.getBCHTypeNumber(n);for(let n=0;n<18;n+=1){let r=!e&&(t>>n&1)==1;i[Math.floor(n/3)][n%3+a-8-3]=r}for(let n=0;n<18;n+=1){let r=!e&&(t>>n&1)==1;i[n%3+a-8-3][Math.floor(n/3)]=r}},h=function(e,t){let n=r<<3|t,o=I.getBCHTypeInfo(n);for(let t=0;t<15;t+=1){let n=!e&&(o>>t&1)==1;t<6?i[t][8]=n:t<8?i[t+1][8]=n:i[a-15+t][8]=n}for(let t=0;t<15;t+=1){let n=!e&&(o>>t&1)==1;t<8?i[8][a-t-1]=n:t<9?i[8][15-t-1+1]=n:i[8][15-t-1]=n}i[a-8][8]=!e},g=function(e,t){let n=-1,r=a-1,o=7,s=0,c=I.getMaskFunction(t);for(let t=a-1;t>0;t-=2)for(t==6&&--t;;){for(let n=0;n<2;n+=1)if(i[r][t-n]==null){let a=!1;s<e.length&&(a=(e[s]>>>o&1)==1),c(r,t-n)&&(a=!a),i[r][t-n]=a,--o,o==-1&&(s+=1,o=7)}if(r+=n,r<0||a<=r){r-=n,n=-n;break}}},_=function(e,t){let n=0,r=0,i=0,a=Array(t.length),o=Array(t.length);for(let s=0;s<t.length;s+=1){let c=t[s].dataCount,l=t[s].totalCount-c;r=Math.max(r,c),i=Math.max(i,l),a[s]=Array(c);for(let t=0;t<a[s].length;t+=1)a[s][t]=255&e.getBuffer()[t+n];n+=c;let u=I.getErrorCorrectPolynomial(l),d=fr(a[s],u.getLength()-1).mod(u);o[s]=Array(u.getLength()-1);for(let e=0;e<o[s].length;e+=1){let t=e+d.getLength()-o[s].length;o[s][e]=t>=0?d.getAt(t):0}}let s=0;for(let e=0;e<t.length;e+=1)s+=t[e].totalCount;let c=Array(s),l=0;for(let e=0;e<r;e+=1)for(let n=0;n<t.length;n+=1)e<a[n].length&&(c[l]=a[n][e],l+=1);for(let e=0;e<i;e+=1)for(let n=0;n<t.length;n+=1)e<o[n].length&&(c[l]=o[n][e],l+=1);return c},v=function(e,t,n){let r=pr.getRSBlocks(e,t),i=mr();for(let t=0;t<n.length;t+=1){let r=n[t];i.put(r.getMode(),4),i.put(r.getLength(),I.getLengthInBits(r.getMode(),e)),r.write(i)}let a=0;for(let e=0;e<r.length;e+=1)a+=r[e].dataCount;if(i.getLengthInBits()>a*8)throw`code length overflow. (`+i.getLengthInBits()+`>`+a*8+`)`;for(i.getLengthInBits()+4<=a*8&&i.put(0,4);i.getLengthInBits()%8!=0;)i.putBit(!1);for(;!(i.getLengthInBits()>=a*8||(i.put(236,8),i.getLengthInBits()>=a*8));)i.put(17,8);return _(i,r)};c.addData=function(e,t){t||=`Byte`;let n=null;switch(t){case`Numeric`:n=hr(e);break;case`Alphanumeric`:n=gr(e);break;case`Byte`:n=_r(e);break;case`Kanji`:n=vr(e);break;default:throw`mode:`+t}s.push(n),o=null},c.isDark=function(e,t){if(e<0||a<=e||t<0||a<=t)throw e+`,`+t;return i[e][t]},c.getModuleCount=function(){return a},c.make=function(){if(n<1){let e=1;for(;e<40;e++){let t=pr.getRSBlocks(e,r),n=mr();for(let t=0;t<s.length;t++){let r=s[t];n.put(r.getMode(),4),n.put(r.getLength(),I.getLengthInBits(r.getMode(),e)),r.write(n)}let i=0;for(let e=0;e<t.length;e++)i+=t[e].dataCount;if(n.getLengthInBits()<=i*8)break}n=e}l(!1,d())},c.createTableTag=function(e,t){e||=2,t=t===void 0?e*4:t;let n=``;n+=`<table style="`,n+=` border-width: 0px; border-style: none;`,n+=` border-collapse: collapse;`,n+=` padding: 0px; margin: `+t+`px;`,n+=`">`,n+=`<tbody>`;for(let t=0;t<c.getModuleCount();t+=1){n+=`<tr>`;for(let r=0;r<c.getModuleCount();r+=1)n+=`<td style="`,n+=` border-width: 0px; border-style: none;`,n+=` border-collapse: collapse;`,n+=` padding: 0px; margin: 0px;`,n+=` width: `+e+`px;`,n+=` height: `+e+`px;`,n+=` background-color: `,n+=c.isDark(t,r)?`#000000`:`#ffffff`,n+=`;`,n+=`"/>`;n+=`</tr>`}return n+=`</tbody>`,n+=`</table>`,n},c.createSvgTag=function(e,t,n,r){let i={};typeof arguments[0]==`object`&&(i=arguments[0],e=i.cellSize,t=i.margin,n=i.alt,r=i.title),e||=2,t=t===void 0?e*4:t,n=typeof n==`string`?{text:n}:n||{},n.text=n.text||null,n.id=n.text?n.id||`qrcode-description`:null,r=typeof r==`string`?{text:r}:r||{},r.text=r.text||null,r.id=r.text?r.id||`qrcode-title`:null;let a=c.getModuleCount()*e+t*2,o,s,l,u,d=``,f;for(f=`l`+e+`,0 0,`+e+` -`+e+`,0 0,-`+e+`z `,d+=`<svg version="1.1" xmlns="http://www.w3.org/2000/svg"`,d+=i.scalable?``:` width="`+a+`px" height="`+a+`px"`,d+=` viewBox="0 0 `+a+` `+a+`" `,d+=` preserveAspectRatio="xMinYMin meet"`,d+=r.text||n.text?` role="img" aria-labelledby="`+y([r.id,n.id].join(` `).trim())+`"`:``,d+=`>`,d+=r.text?`<title id="`+y(r.id)+`">`+y(r.text)+`</title>`:``,d+=n.text?`<description id="`+y(n.id)+`">`+y(n.text)+`</description>`:``,d+=`<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>`,d+=`<path d="`,l=0;l<c.getModuleCount();l+=1)for(u=l*e+t,o=0;o<c.getModuleCount();o+=1)c.isDark(l,o)&&(s=o*e+t,d+=`M`+s+`,`+u+f);return d+=`" stroke="transparent" fill="black"/>`,d+=`</svg>`,d},c.createDataURL=function(e,t){e||=2,t=t===void 0?e*4:t;let n=c.getModuleCount()*e+t*2,r=t,i=n-t;return Cr(n,n,function(t,n){if(r<=t&&t<i&&r<=n&&n<i){let i=Math.floor((t-r)/e),a=Math.floor((n-r)/e);return c.isDark(a,i)?0:1}else return 1})},c.createImgTag=function(e,t,n){e||=2,t=t===void 0?e*4:t;let r=c.getModuleCount()*e+t*2,i=``;return i+=`<img`,i+=` src="`,i+=c.createDataURL(e,t),i+=`"`,i+=` width="`,i+=r,i+=`"`,i+=` height="`,i+=r,i+=`"`,n&&(i+=` alt="`,i+=y(n),i+=`"`),i+=`/>`,i};let y=function(e){let t=``;for(let n=0;n<e.length;n+=1){let r=e.charAt(n);switch(r){case`<`:t+=`&lt;`;break;case`>`:t+=`&gt;`;break;case`&`:t+=`&amp;`;break;case`"`:t+=`&quot;`;break;default:t+=r;break}}return t},b=function(e){e=e===void 0?2:e;let t=c.getModuleCount()*1+e*2,n=e,r=t-e,i,a,o,s,l,u={"██":`█`,"█ ":`▀`," █":`▄`,"  ":` `},d={"██":`▀`,"█ ":`▀`," █":` `,"  ":` `},f=``;for(i=0;i<t;i+=2){for(o=Math.floor((i-n)/1),s=Math.floor((i+1-n)/1),a=0;a<t;a+=1)l=`█`,n<=a&&a<r&&n<=i&&i<r&&c.isDark(o,Math.floor((a-n)/1))&&(l=` `),n<=a&&a<r&&n<=i+1&&i+1<r&&c.isDark(s,Math.floor((a-n)/1))?l+=` `:l+=`█`,f+=e<1&&i+1>=r?d[l]:u[l];f+=`
`}return t%2&&e>0?f.substring(0,f.length-t-1)+Array(t+1).join(`▀`):f.substring(0,f.length-1)};return c.createASCII=function(e,t){if(e||=1,e<2)return b(t);--e,t=t===void 0?e*2:t;let n=c.getModuleCount()*e+t*2,r=t,i=n-t,a,o,s,l,u=Array(e+1).join(`██`),d=Array(e+1).join(`  `),f=``,p=``;for(a=0;a<n;a+=1){for(s=Math.floor((a-r)/e),p=``,o=0;o<n;o+=1)l=1,r<=o&&o<i&&r<=a&&a<i&&c.isDark(s,Math.floor((o-r)/e))&&(l=0),p+=l?u:d;for(s=0;s<e;s+=1)f+=p+`
`}return f.substring(0,f.length-1)},c.renderTo2dContext=function(e,t){t||=2;let n=c.getModuleCount();for(let r=0;r<n;r++)for(let i=0;i<n;i++)e.fillStyle=c.isDark(r,i)?`black`:`white`,e.fillRect(i*t,r*t,t,t)},c};N.stringToBytes=function(e){let t=[];for(let n=0;n<e.length;n+=1){let r=e.charCodeAt(n);t.push(r&255)}return t},N.createStringToBytes=function(e,t){let n=function(){let n=xr(e),r=function(){let e=n.read();if(e==-1)throw`eof`;return e},i=0,a={};for(;;){let e=n.read();if(e==-1)break;let t=r(),o=r(),s=r(),c=String.fromCharCode(e<<8|t);a[c]=o<<8|s,i+=1}if(i!=t)throw i+` != `+t;return a}();return function(e){let t=[];for(let r=0;r<e.length;r+=1){let i=e.charCodeAt(r);if(i<128)t.push(i);else{let i=n[e.charAt(r)];typeof i==`number`?(i&255)==i?t.push(i):(t.push(i>>>8),t.push(i&255)):t.push(63)}}return t}};var P={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},dr={L:1,M:0,Q:3,H:2},F={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},I=function(){let e=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],t=1335,n=7973,r={},i=function(e){let t=0;for(;e!=0;)t+=1,e>>>=1;return t};return r.getBCHTypeInfo=function(e){let n=e<<10;for(;i(n)-i(t)>=0;)n^=t<<i(n)-i(t);return(e<<10|n)^21522},r.getBCHTypeNumber=function(e){let t=e<<12;for(;i(t)-i(n)>=0;)t^=n<<i(t)-i(n);return e<<12|t},r.getPatternPosition=function(t){return e[t-1]},r.getMaskFunction=function(e){switch(e){case F.PATTERN000:return function(e,t){return(e+t)%2==0};case F.PATTERN001:return function(e,t){return e%2==0};case F.PATTERN010:return function(e,t){return t%3==0};case F.PATTERN011:return function(e,t){return(e+t)%3==0};case F.PATTERN100:return function(e,t){return(Math.floor(e/2)+Math.floor(t/3))%2==0};case F.PATTERN101:return function(e,t){return e*t%2+e*t%3==0};case F.PATTERN110:return function(e,t){return(e*t%2+e*t%3)%2==0};case F.PATTERN111:return function(e,t){return(e*t%3+(e+t)%2)%2==0};default:throw`bad maskPattern:`+e}},r.getErrorCorrectPolynomial=function(e){let t=fr([1],0);for(let n=0;n<e;n+=1)t=t.multiply(fr([1,L.gexp(n)],0));return t},r.getLengthInBits=function(e,t){if(1<=t&&t<10)switch(e){case P.MODE_NUMBER:return 10;case P.MODE_ALPHA_NUM:return 9;case P.MODE_8BIT_BYTE:return 8;case P.MODE_KANJI:return 8;default:throw`mode:`+e}else if(t<27)switch(e){case P.MODE_NUMBER:return 12;case P.MODE_ALPHA_NUM:return 11;case P.MODE_8BIT_BYTE:return 16;case P.MODE_KANJI:return 10;default:throw`mode:`+e}else if(t<41)switch(e){case P.MODE_NUMBER:return 14;case P.MODE_ALPHA_NUM:return 13;case P.MODE_8BIT_BYTE:return 16;case P.MODE_KANJI:return 12;default:throw`mode:`+e}else throw`type:`+t},r.getLostPoint=function(e){let t=e.getModuleCount(),n=0;for(let r=0;r<t;r+=1)for(let i=0;i<t;i+=1){let a=0,o=e.isDark(r,i);for(let n=-1;n<=1;n+=1)if(!(r+n<0||t<=r+n))for(let s=-1;s<=1;s+=1)i+s<0||t<=i+s||n==0&&s==0||o==e.isDark(r+n,i+s)&&(a+=1);a>5&&(n+=3+a-5)}for(let r=0;r<t-1;r+=1)for(let i=0;i<t-1;i+=1){let t=0;e.isDark(r,i)&&(t+=1),e.isDark(r+1,i)&&(t+=1),e.isDark(r,i+1)&&(t+=1),e.isDark(r+1,i+1)&&(t+=1),(t==0||t==4)&&(n+=3)}for(let r=0;r<t;r+=1)for(let i=0;i<t-6;i+=1)e.isDark(r,i)&&!e.isDark(r,i+1)&&e.isDark(r,i+2)&&e.isDark(r,i+3)&&e.isDark(r,i+4)&&!e.isDark(r,i+5)&&e.isDark(r,i+6)&&(n+=40);for(let r=0;r<t;r+=1)for(let i=0;i<t-6;i+=1)e.isDark(i,r)&&!e.isDark(i+1,r)&&e.isDark(i+2,r)&&e.isDark(i+3,r)&&e.isDark(i+4,r)&&!e.isDark(i+5,r)&&e.isDark(i+6,r)&&(n+=40);let r=0;for(let n=0;n<t;n+=1)for(let i=0;i<t;i+=1)e.isDark(i,n)&&(r+=1);let i=Math.abs(100*r/t/t-50)/5;return n+=i*10,n},r}(),L=function(){let e=Array(256),t=Array(256);for(let t=0;t<8;t+=1)e[t]=1<<t;for(let t=8;t<256;t+=1)e[t]=e[t-4]^e[t-5]^e[t-6]^e[t-8];for(let n=0;n<255;n+=1)t[e[n]]=n;let n={};return n.glog=function(e){if(e<1)throw`glog(`+e+`)`;return t[e]},n.gexp=function(t){for(;t<0;)t+=255;for(;t>=256;)t-=255;return e[t]},n}(),fr=function(e,t){if(e.length===void 0)throw e.length+`/`+t;let n=function(){let n=0;for(;n<e.length&&e[n]==0;)n+=1;let r=Array(e.length-n+t);for(let t=0;t<e.length-n;t+=1)r[t]=e[t+n];return r}(),r={};return r.getAt=function(e){return n[e]},r.getLength=function(){return n.length},r.multiply=function(e){let t=Array(r.getLength()+e.getLength()-1);for(let n=0;n<r.getLength();n+=1)for(let i=0;i<e.getLength();i+=1)t[n+i]^=L.gexp(L.glog(r.getAt(n))+L.glog(e.getAt(i)));return fr(t,0)},r.mod=function(e){if(r.getLength()-e.getLength()<0)return r;let t=L.glog(r.getAt(0))-L.glog(e.getAt(0)),n=Array(r.getLength());for(let e=0;e<r.getLength();e+=1)n[e]=r.getAt(e);for(let r=0;r<e.getLength();r+=1)n[r]^=L.gexp(L.glog(e.getAt(r))+t);return fr(n,0).mod(e)},r},pr=function(){let e=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(e,t){let n={};return n.totalCount=e,n.dataCount=t,n},n={},r=function(t,n){switch(n){case dr.L:return e[(t-1)*4+0];case dr.M:return e[(t-1)*4+1];case dr.Q:return e[(t-1)*4+2];case dr.H:return e[(t-1)*4+3];default:return}};return n.getRSBlocks=function(e,n){let i=r(e,n);if(i===void 0)throw`bad rs block @ typeNumber:`+e+`/errorCorrectionLevel:`+n;let a=i.length/3,o=[];for(let e=0;e<a;e+=1){let n=i[e*3+0],r=i[e*3+1],a=i[e*3+2];for(let e=0;e<n;e+=1)o.push(t(r,a))}return o},n}(),mr=function(){let e=[],t=0,n={};return n.getBuffer=function(){return e},n.getAt=function(t){return(e[Math.floor(t/8)]>>>7-t%8&1)==1},n.put=function(e,t){for(let r=0;r<t;r+=1)n.putBit((e>>>t-r-1&1)==1)},n.getLengthInBits=function(){return t},n.putBit=function(n){let r=Math.floor(t/8);e.length<=r&&e.push(0),n&&(e[r]|=128>>>t%8),t+=1},n},hr=function(e){let t=P.MODE_NUMBER,n=e,r={};r.getMode=function(){return t},r.getLength=function(e){return n.length},r.write=function(e){let t=n,r=0;for(;r+2<t.length;)e.put(i(t.substring(r,r+3)),10),r+=3;r<t.length&&(t.length-r==1?e.put(i(t.substring(r,r+1)),4):t.length-r==2&&e.put(i(t.substring(r,r+2)),7))};let i=function(e){let t=0;for(let n=0;n<e.length;n+=1)t=t*10+a(e.charAt(n));return t},a=function(e){if(`0`<=e&&e<=`9`)return e.charCodeAt(0)-48;throw`illegal char :`+e};return r},gr=function(e){let t=P.MODE_ALPHA_NUM,n=e,r={};r.getMode=function(){return t},r.getLength=function(e){return n.length},r.write=function(e){let t=n,r=0;for(;r+1<t.length;)e.put(i(t.charAt(r))*45+i(t.charAt(r+1)),11),r+=2;r<t.length&&e.put(i(t.charAt(r)),6)};let i=function(e){if(`0`<=e&&e<=`9`)return e.charCodeAt(0)-48;if(`A`<=e&&e<=`Z`)return e.charCodeAt(0)-65+10;switch(e){case` `:return 36;case`$`:return 37;case`%`:return 38;case`*`:return 39;case`+`:return 40;case`-`:return 41;case`.`:return 42;case`/`:return 43;case`:`:return 44;default:throw`illegal char :`+e}};return r},_r=function(e){let t=P.MODE_8BIT_BYTE,n=N.stringToBytes(e),r={};return r.getMode=function(){return t},r.getLength=function(e){return n.length},r.write=function(e){for(let t=0;t<n.length;t+=1)e.put(n[t],8)},r},vr=function(e){let t=P.MODE_KANJI,n=N.stringToBytes;(function(e,t){let r=n(e);if(r.length!=2||(r[0]<<8|r[1])!=t)throw`sjis not supported.`})(`友`,38726);let r=n(e),i={};return i.getMode=function(){return t},i.getLength=function(e){return~~(r.length/2)},i.write=function(e){let t=r,n=0;for(;n+1<t.length;){let r=(255&t[n])<<8|255&t[n+1];if(33088<=r&&r<=40956)r-=33088;else if(57408<=r&&r<=60351)r-=49472;else throw`illegal char at `+(n+1)+`/`+r;r=(r>>>8&255)*192+(r&255),e.put(r,13),n+=2}if(n<t.length)throw`illegal char at `+(n+1)},i},yr=function(){let e=[],t={};return t.writeByte=function(t){e.push(t&255)},t.writeShort=function(e){t.writeByte(e),t.writeByte(e>>>8)},t.writeBytes=function(e,n,r){n||=0,r||=e.length;for(let i=0;i<r;i+=1)t.writeByte(e[i+n])},t.writeString=function(e){for(let n=0;n<e.length;n+=1)t.writeByte(e.charCodeAt(n))},t.toByteArray=function(){return e},t.toString=function(){let t=``;t+=`[`;for(let n=0;n<e.length;n+=1)n>0&&(t+=`,`),t+=e[n];return t+=`]`,t},t},br=function(){let e=0,t=0,n=0,r=``,i={},a=function(e){r+=String.fromCharCode(o(e&63))},o=function(e){if(e<0)throw`n:`+e;if(e<26)return 65+e;if(e<52)return 97+(e-26);if(e<62)return 48+(e-52);if(e==62)return 43;if(e==63)return 47;throw`n:`+e};return i.writeByte=function(r){for(e=e<<8|r&255,t+=8,n+=1;t>=6;)a(e>>>t-6),t-=6},i.flush=function(){if(t>0&&(a(e<<6-t),e=0,t=0),n%3!=0){let e=3-n%3;for(let t=0;t<e;t+=1)r+=`=`}},i.toString=function(){return r},i},xr=function(e){let t=e,n=0,r=0,i=0,a={};a.read=function(){for(;i<8;){if(n>=t.length){if(i==0)return-1;throw`unexpected end of file./`+i}let e=t.charAt(n);if(n+=1,e==`=`)return i=0,-1;e.match(/^\s$/)||(r=r<<6|o(e.charCodeAt(0)),i+=6)}let e=r>>>i-8&255;return i-=8,e};let o=function(e){if(65<=e&&e<=90)return e-65;if(97<=e&&e<=122)return e-97+26;if(48<=e&&e<=57)return e-48+52;if(e==43)return 62;if(e==47)return 63;throw`c:`+e};return a},Sr=function(e,t){let n=e,r=t,i=Array(e*t),a={};a.setPixel=function(e,t,r){i[t*n+e]=r},a.write=function(e){e.writeString(`GIF87a`),e.writeShort(n),e.writeShort(r),e.writeByte(128),e.writeByte(0),e.writeByte(0),e.writeByte(0),e.writeByte(0),e.writeByte(0),e.writeByte(255),e.writeByte(255),e.writeByte(255),e.writeString(`,`),e.writeShort(0),e.writeShort(0),e.writeShort(n),e.writeShort(r),e.writeByte(0);let t=s(2);e.writeByte(2);let i=0;for(;t.length-i>255;)e.writeByte(255),e.writeBytes(t,i,255),i+=255;e.writeByte(t.length-i),e.writeBytes(t,i,t.length-i),e.writeByte(0),e.writeString(`;`)};let o=function(e){let t=e,n=0,r=0,i={};return i.write=function(e,i){if(e>>>i)throw`length over`;for(;n+i>=8;)t.writeByte(255&(e<<n|r)),i-=8-n,e>>>=8-n,r=0,n=0;r=e<<n|r,n+=i},i.flush=function(){n>0&&t.writeByte(r)},i},s=function(e){let t=1<<e,n=(1<<e)+1,r=e+1,a=c();for(let e=0;e<t;e+=1)a.add(String.fromCharCode(e));a.add(String.fromCharCode(t)),a.add(String.fromCharCode(n));let s=yr(),l=o(s);l.write(t,r);let u=0,d=String.fromCharCode(i[u]);for(u+=1;u<i.length;){let e=String.fromCharCode(i[u]);u+=1,a.contains(d+e)?d+=e:(l.write(a.indexOf(d),r),a.size()<4095&&(a.size()==1<<r&&(r+=1),a.add(d+e)),d=e)}return l.write(a.indexOf(d),r),l.write(n,r),l.flush(),s.toByteArray()},c=function(){let e={},t=0,n={};return n.add=function(r){if(n.contains(r))throw`dup key:`+r;e[r]=t,t+=1},n.size=function(){return t},n.indexOf=function(t){return e[t]},n.contains=function(t){return e[t]!==void 0},n};return a},Cr=function(e,t,n){let r=Sr(e,t);for(let i=0;i<t;i+=1)for(let t=0;t<e;t+=1)r.setPixel(t,i,n(t,i));let i=yr();r.write(i);let a=br(),o=i.toByteArray();for(let e=0;e<o.length;e+=1)a.writeByte(o[e]);return a.flush(),`data:image/gif;base64,`+a};N.stringToBytes;function wr(e,t=4){let n=N(0,`L`);return n.addData(e),n.make(),n.createSvgTag({cellSize:t,margin:2,scalable:!0})}var Tr=25519;function Er(e){let t=D(),{identity:n}=s();if(!t||!n?.pubkey||!n?.privkey)return e.onError(`No relay pool or identity available.`),()=>{};let{inviteId:r,adminPubkey:i,readRelays:a,writeRelays:o,onWelcome:c,onError:l}=e,u=n.privkey;n.pubkey;let d=Array.from(new Set([...a,...o])),f=w(T(u),i),p=le(JSON.stringify({type:`join-request`,inviteId:r}),f),m=ce({kind:Tr,created_at:Math.floor(Date.now()/1e3),tags:[[`d`,r],[`p`,i]],content:p},T(u));Promise.allSettled(t.publish(o,m)).catch(()=>{});let h=t.subscribeMany(d,{kinds:[Tr],"#d":[r],authors:[i]},{onevent(e){if(oe(e)&&!(typeof e.content==`string`&&e.content.length>65536))try{let t=ue(e.content,f),n=JSON.parse(t);n.type===`welcome`&&n.inviteId===r&&n.envelope&&(c(n.envelope),h.close())}catch{}},oneose(){}}),g=setTimeout(()=>{h.close(),l(`Timed out waiting for welcome message from admin.`)},12e4);return()=>{clearTimeout(g),h.close()}}function Dr(e){let t=D(),{identity:n}=s();if(!t||!n?.pubkey||!n?.privkey)return e.onError(`No relay pool or identity available.`),()=>{};let{inviteId:r,readRelays:i,writeRelays:a,onJoinRequest:o,onError:c}=e,l=n.privkey,u=Array.from(new Set([...i,...a])),d=t.subscribeMany(u,{kinds:[Tr],"#d":[r],"#p":[n.pubkey]},{onevent(e){if(oe(e)&&!(typeof e.content==`string`&&e.content.length>65536))try{let t=w(T(l),e.pubkey),n=ue(e.content,t),i=JSON.parse(n);i.type===`join-request`&&i.inviteId===r&&o(e.pubkey)}catch{}},oneose(){}}),f=setTimeout(()=>{d.close(),c(`Timed out waiting for join request.`)},3e5);return()=>{clearTimeout(f),d.close()}}function Or(e){let t=D(),{identity:n}=s();if(!t||!n?.privkey)return;let{inviteId:r,joinerPubkey:i,envelope:a,writeRelays:o}=e,c=w(T(n.privkey),i),l=le(JSON.stringify({type:`welcome`,inviteId:r,envelope:a}),c),u=ce({kind:Tr,created_at:Math.floor(Date.now()/1e3),tags:[[`d`,r],[`p`,i]],content:l},T(n.privkey));Promise.allSettled(t.publish(o,u)).catch(()=>{})}var kr=35520;function Ar(e){let t=D(),{identity:n}=s();if(!t||!n?.privkey)return;let{token:r,writeRelays:i}=e,a=JSON.stringify(r),o=String(Math.floor(Date.now()/1e3)+10080*60),c=ce({kind:kr,created_at:Math.floor(Date.now()/1e3),tags:[[`d`,r.inviteId],[`expiration`,o]],content:a},T(n.privkey));Promise.allSettled(t.publish(i,c)).catch(()=>{})}function jr(e){let t=D();if(!t)return e.onError(`No relay pool available.`),()=>{};let{inviteId:n,readRelays:r,onToken:i,onError:a}=e,o=!1,s=t.subscribeMany(r,{kinds:[kr],"#d":[n]},{onevent(e){if(oe(e)&&!(typeof e.content==`string`&&e.content.length>65536)&&!o)try{let t=JSON.parse(e.content);t.inviteId===n&&(o=!0,i(t),s.close())}catch{}},oneose(){o||(s.close(),a(`Invite not found on relay — it may have expired.`))}}),c=setTimeout(()=>{o||(s.close(),a(`Timed out looking for invite on relay.`))},15e3);return()=>{clearTimeout(c),s.close()}}var Mr=ot({renderMembers:()=>Br,showConfirmMemberModal:()=>Hr,showInviteModal:()=>Lr,showShareStateModal:()=>Rr}),Nr=[210,140,30,280,60,330,170,0];function Pr(e,t){let n=t.indexOf(e);return Nr[(n>=0?n:0)%Nr.length]}function Fr(e,t,n,r){let i=Pr(e,t),a=n[e]??0;if(a===0)return`hsl(${i}, 55%, 55%)`;let o=Math.floor(Date.now()/1e3)-a;return o<=r?`hsl(${i}, 70%, 55%)`:o<=r*1.25?`hsl(${i}, 40%, 50%)`:`#94a3b8`}function Ir(e,t,n){let{identity:r,groups:i}=s(),a=r?.pubkey===e,o;if(n){let t=i[n]?.memberNames?.[e];t&&t!==`You`&&(o=t)}return o||=Je(e),a?o?`${o} (you)`:`You`:o||`${e.slice(0,8)}\u2026${e.slice(-4)}`}function Lr(t,n){let r=n?.title??`Invite to Group`,i=n?.scanHint??`Scan with your phone camera to join`;n?.showConfirmMemberNote,e(t);let a=document.getElementById(`invite-modal`);a||(a=document.createElement(`dialog`),a.id=`invite-modal`,a.className=`modal`,document.body.appendChild(a),a.addEventListener(`click`,e=>{e.target===a&&($n(),a.close())}));let o=a;function c(){o.innerHTML=`
      <div class="modal__form invite-share">
        <h2 class="modal__title">${k(r)}</h2>
        <p class="invite-hint">How are you sharing this?</p>

        <div class="invite-share__actions" style="flex-direction: column; gap: 0.75rem;">
          <button class="btn btn--primary" id="invite-qr-path" type="button">Scan QR &mdash; they're with me</button>
          <button class="btn btn--primary" id="invite-link-path" type="button">Secure Channel &mdash; Signal, WhatsApp, etc.</button>
        </div>

        <div class="modal__actions">
          <button class="btn" id="invite-close-btn" type="button">Cancel</button>
        </div>
      </div>
    `,o.querySelector(`#invite-qr-path`)?.addEventListener(`click`,d),o.querySelector(`#invite-link-path`)?.addEventListener(`click`,p),o.querySelector(`#invite-close-btn`)?.addEventListener(`click`,()=>{$n(),o.close()})}function l(e){o.innerHTML=`
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
    `,o.querySelector(`#remote-back-2`)?.addEventListener(`click`,e),o.querySelector(`#remote-next-2`)?.addEventListener(`click`,()=>{let e=o.querySelector(`#remote-joincode-input`),n=o.querySelector(`#remote-joincode-error`),r=e?.value.trim()??``;if(!/^[0-9a-f]{64}$/.test(r)){n&&(n.textContent=`Invalid join code — must be a 64-character hex public key.`,n.style.display=``);return}try{let e=s().groups[t.id];if(!e)throw Error(`Group not found.`);u(Qn(e,r),r)}catch(e){n&&(n.textContent=e instanceof Error?e.message:`Failed to create welcome envelope.`,n.style.display=``)}})}function u(e,n){o.innerHTML=`
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
    `,o.querySelector(`#remote-copy-welcome`)?.addEventListener(`click`,async t=>{let n=t.currentTarget;try{await navigator.clipboard.writeText(e),n.textContent=`Copied!`,n.classList.add(`btn--copied`),setTimeout(()=>{n.textContent=`Copy Welcome Message`,n.classList.remove(`btn--copied`)},2e3)}catch{}}),o.querySelector(`#remote-done`)?.addEventListener(`click`,()=>{try{let e=s().groups[t.id];if(e&&!e.members.includes(n)){let e=o.querySelector(`#remote-joiner-name`)?.value.trim()??``;Ft(t.id,n,e),O(e?`${e} added to group`:`Member added to group`,`success`)}}catch(e){O(e instanceof Error?e.message:`Failed to add member`,`error`)}$n(),o.close()})}function d(){let e,n,a;try{let r=Un(t);e=r.payload,n=r.confirmCode,a=lr(e)}catch(e){O(e instanceof Error?e.message:`Failed to create invite.`,`error`);return}let s=`${window.location.href.split(`#`)[0]}#inv/${xn(a)}`,l=wr(s);o.innerHTML=`
      <div class="modal__form invite-share">
        <h2 class="modal__title">${k(r)}</h2>

        <div class="qr-container" data-url="${k(s)}">${l}</div>
        <p class="invite-hint">${k(i)}</p>
        <p class="invite-hint" style="color: var(--duress); font-weight: 500;">Contains the group key &mdash; only share in person.</p>

        <div style="margin: 1rem 0; padding: 0.75rem; border-radius: 0.5rem; background: var(--surface-alt, rgba(255,255,255,0.05));">
          <p class="invite-hint" style="font-weight: 600; margin-bottom: 0.25rem;">Read these words aloud:</p>
          <p style="font-size: 1.25rem; font-weight: 700; letter-spacing: 0.05em; text-align: center;">${k(n)}</p>
        </div>

        <div class="modal__actions" style="gap: 0.5rem;">
          <button class="btn" id="invite-back-btn" type="button">Back</button>
          <button class="btn" id="invite-done-btn" type="button">Done</button>
        </div>
      </div>
    `,o.querySelector(`#invite-back-btn`)?.addEventListener(`click`,()=>{c()}),o.querySelector(`#invite-done-btn`)?.addEventListener(`click`,()=>{o.close()})}function p(){let e;try{e=Zn(t)}catch(e){O(e instanceof Error?e.message:`Failed to create remote invite.`,`error`);return}let n=`${window.location.href.split(`#`)[0]}#j/${e.inviteId}`,r=t.readRelays?.length?t.readRelays:s().settings.defaultReadRelays,i=t.writeRelays?.length?t.writeRelays:s().settings.defaultWriteRelays;f(r,i).then(()=>{Ar({token:bn(e.tokenPayload),writeRelays:i})});let a=()=>{};o.innerHTML=`
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
    `,o.querySelector(`#remote-copy-link`)?.addEventListener(`click`,async e=>{let t=e.currentTarget;try{await navigator.clipboard.writeText(n),t.textContent=`Copied!`,t.classList.add(`btn--copied`),setTimeout(()=>{t.textContent=`Copy Link`,t.classList.remove(`btn--copied`)},2e3)}catch{}}),f(r,i).then(()=>{a=Dr({inviteId:e.inviteId,readRelays:r,writeRelays:i,onJoinRequest(n){a();try{let r=s().groups[t.id];if(!r)return;let a=Qn(r,n);Or({inviteId:e.inviteId,joinerPubkey:n,envelope:a,writeRelays:i}),r.members.includes(n)||Ft(t.id,n),$n(),o.close(),O(`Member joined via relay`,`success`)}catch(e){O(e instanceof Error?e.message:`Failed to send welcome`,`error`)}},onError(e){let t=o.querySelector(`#remote-relay-status`);t&&(t.textContent=e||`Relay unavailable — use manual fallback below.`)}})}),o.querySelector(`#remote-manual-fallback`)?.addEventListener(`click`,()=>{a(),l(()=>{a=()=>{},p()})}),o.querySelector(`#remote-back-btn`)?.addEventListener(`click`,()=>{a(),$n(),c()})}c(),a.showModal()}function Rr(e){Lr(e,{title:`Share Group State`,scanHint:`Share with existing members to sync the latest group state.`,showConfirmMemberNote:!1})}function zr(e,t){let{identity:n,groups:r}=s(),i=r[t],a=n?.pubkey===e,o=i?.admins.includes(e)??!1,c=Ir(e,i?.members??[],t),l=Ze(e),u=i?.memberNames?.[e],d=i?.livenessCheckins?.[e],f=`Never checked in`;if(d){let e=Math.floor(Date.now()/1e3)-d;f=e<60?`Active now`:e<3600?`${Math.floor(e/60)}m ago`:`${Math.floor(e/3600)}h ago`}let p=[a?`<span class="member-detail__badge">You</span>`:``,o?`<span class="member-detail__badge member-detail__badge--admin">Admin</span>`:``].filter(Boolean).join(` `),m=l?.display_name||l?.name,h=(e,t)=>`<div class="member-detail__row"><span class="member-detail__label">${e}</span><span class="member-detail__value">${k(t)}</span></div>`,g=[h(`Pubkey`,`${e.slice(0,16)}…${e.slice(-8)}`)];m&&g.push(h(`Nostr name`,m)),l?.nip05&&g.push(h(`NIP-05`,l.nip05)),l?.about&&g.push(h(`About`,l.about.length>80?l.about.slice(0,80)+`…`:l.about)),l?.lud16&&g.push(h(`Lightning`,l.lud16)),l?.website&&g.push(h(`Website`,l.website)),u&&u!==`You`&&u!==m&&g.push(h(`Display name`,u)),g.push(h(`Liveness`,f)),l||g.push(`<div class="member-detail__row"><span class="member-detail__label" style="color: var(--text-muted); font-style: italic;">No Nostr profile found on relay</span></div>`),mt(`
    <div class="member-detail__header">
      ${l?.picture?`<img class="member-detail__avatar" src="${k(l.picture)}" alt="" />`:``}
      <div>
        <h2 class="modal__title" style="margin:0;">${k(c)} ${p}</h2>
      </div>
    </div>
    <div class="member-detail__rows">${g.join(``)}</div>
    <div class="modal__actions">
      <button class="btn btn--sm" id="member-detail-copy" type="button">Copy Pubkey</button>
      <button class="btn" id="modal-cancel-btn" type="button">Close</button>
    </div>
  `,()=>{}),requestAnimationFrame(()=>{document.getElementById(`member-detail-copy`)?.addEventListener(`click`,async()=>{try{await navigator.clipboard.writeText(e);let t=document.getElementById(`member-detail-copy`);t.textContent=`Copied!`,setTimeout(()=>{t.textContent=`Copy Pubkey`},1500)}catch{}}),document.getElementById(`modal-cancel-btn`)?.addEventListener(`click`,()=>{document.getElementById(`app-modal`)?.close()})})}function Br(e){let{groups:t,activeGroupId:n}=s();if(!n){e.innerHTML=``;return}let r=t[n];if(!r){e.innerHTML=``;return}let{identity:i}=s(),a=!!i?.pubkey&&r.admins.includes(i.pubkey);Xe(r.members,n),e.innerHTML=`
    <section class="panel members-panel">
      <h2 class="panel__title">Members</h2>
      <ul class="member-list">
        ${r.members.length>0?r.members.map(e=>{let t=Fr(e,r.members,r.livenessCheckins??{},r.livenessInterval),i=Ze(e),o=i?.picture?`<img src="${k(i.picture)}" alt="" style="width:24px;height:24px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid ${t};box-shadow:0 0 6px ${t}80;" />`:`<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${t};flex-shrink:0;box-shadow:0 0 6px ${t}80;"></span>`;return`
          <li class="member-item" data-pubkey="${k(e)}">
            ${o}
            <button class="member-item__name-btn" data-pubkey="${k(e)}" type="button">${k(Ir(e,r.members,n))}</button>
            ${a?`<button
              class="btn btn--sm member-item__remove"
              data-pubkey="${k(e)}"
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
  `,e.querySelectorAll(`.member-item__name-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.pubkey;t&&zr(t,n)})}),e.querySelector(`.member-list`)?.addEventListener(`click`,e=>{let t=e.target.closest(`.member-item__remove`);if(!t)return;let r=t.dataset.pubkey;if(!r)return;let{groups:i}=s(),a=i[n]?.members??[];if(!confirm(`Remove ${Ir(r,a,n)} from the group?\n\nThis rotates the group secret immediately. Remaining members must re-join using a fresh invite.`))return;let{activeGroupId:o}=s();if(!o)return;It(o,r);let{groups:c}=s(),l=c[o];l&&l.members.length>0&&Rr(l)}),e.querySelector(`#invite-btn`)?.addEventListener(`click`,()=>{let{groups:e,activeGroupId:t}=s();if(!t)return;let n=e[t];n&&Lr(n)}),e.querySelector(`#share-state-btn`)?.addEventListener(`click`,()=>{let{groups:e,activeGroupId:t}=s();if(!t)return;let n=e[t];n&&Rr(n)}),e.querySelector(`#confirm-member-btn`)?.addEventListener(`click`,()=>{Hr()})}function Vr(e,t,n){let{groups:r,identity:i}=s(),a=r[e];if(!a||!i?.pubkey||!a.admins.includes(i.pubkey))return!1;a.members.includes(t)||Ft(e,t,n);let o=s().groups[e];return o&&n&&c(e,{memberNames:{...o.memberNames,[t]:n}}),!0}function Hr(e){let{groups:t,activeGroupId:n}=s();n&&t[n]&&(mt(`
    <h2 class="modal__title">Confirm Member</h2>

    <label class="input-label">Acknowledgement link or token
      <textarea name="ackToken" class="input" rows="2" placeholder="Paste #ack/... link or token">${k(e??``)}</textarea>
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
  `,e=>{try{let t=e.get(`ackToken`)?.trim(),n=e.get(`word`)?.trim().toLowerCase(),r=e.get(`memberName`)?.trim(),{activeGroupId:i}=s();if(!i)throw Error(`No active group.`);let{groups:a}=s(),o=a[i];if(!o)throw Error(`Group not found.`);if(t){let e=Yn(t.includes(`#ack/`)?decodeURIComponent(t.split(`#ack/`)[1]):t,{groupId:i,groupSeed:o.seed,counter:o.counter+(o.usageOffset??0),context:`canary:group`,encoding:j(o),tolerance:o.tolerance??1});if(!e.valid)throw Error(e.error??`Invalid join token.`);if(!Vr(i,e.pubkey,e.displayName||r||``))throw Error(`Member could not be added — they may already be in the group or you are not an admin.`);O(`${e.displayName||`Member`} has joined the group`,`success`)}else if(n){if(!r)throw Error(`Please enter the member name.`);let e=o.counter+(o.usageOffset??0);if(n!==fe(o.seed,`canary:group`,e,j(o)).toLowerCase())throw Error(`Word does not match — the member may not have the current group key.`);let t=new Uint8Array(32);if(crypto.getRandomValues(t),!Vr(i,Array.from(t,e=>e.toString(16).padStart(2,`0`)).join(``),r))throw Error(`Member could not be added — you may not be an admin of this group.`);O(`${r} has joined the group`,`success`)}else throw Error(`Provide either an ack token or a verification word.`)}catch(e){throw alert(e instanceof Error?e.message:`Confirmation failed.`),e}}),requestAnimationFrame(()=>{document.getElementById(`modal-cancel-btn`)?.addEventListener(`click`,()=>{document.getElementById(`app-modal`)?.close()})}))}var Ur=`0123456789bcdefghjkmnpqrstuvwxyz`,Wr=Object.create(null);for(let e=0;e<32;e++)Wr[Ur[e]]=e;function Gr(e){for(let t of e)if(!(t in Wr))throw TypeError(`Invalid geohash character: '${t}' in "${e}"`)}function Kr(e,t,n=5){if(!Number.isFinite(e)||e<-90||e>90)throw RangeError(`Invalid latitude: ${e}`);if(!Number.isFinite(t)||t<-180||t>180)throw RangeError(`Invalid longitude: ${t}`);if(!Number.isFinite(n)||(n=Math.round(n),n<1))throw RangeError(`Invalid precision: ${n}`);n=Math.min(12,n);let r=-90,i=90,a=-180,o=180,s=``,c=0,l=0,u=!0;for(;s.length<n;){if(u){let e=(a+o)/2;t>=e?(l|=1<<4-c,a=e):o=e}else{let t=(r+i)/2;e>=t?(l|=1<<4-c,r=t):i=t}u=!u,c++,c===5&&(s+=Ur[l],c=0,l=0)}return s}function qr(e){if(e.length===0)throw TypeError(`Cannot decode an empty geohash`);let t=Jr(e);return{lat:(t.minLat+t.maxLat)/2,lon:(t.minLon+t.maxLon)/2,error:{lat:(t.maxLat-t.minLat)/2,lon:(t.maxLon-t.minLon)/2}}}function Jr(e){Gr(e);let t=-90,n=90,r=-180,i=180,a=!0;for(let o of e){let e=Wr[o];for(let o=4;o>=0;o--){if(a){let t=(r+i)/2;e>>o&1?r=t:i=t}else{let r=(t+n)/2;e>>o&1?t=r:n=r}a=!a}}return{minLat:t,maxLat:n,minLon:r,maxLon:i}}var Yr=[0,25e5,63e4,78e3,2e4,2400,610,76,19,2.4];function Xr(e){if(!Number.isFinite(e))throw RangeError(`Invalid precision: ${e}`);return Yr[Math.max(1,Math.min(9,Math.round(e)))]}var R=null,z=null,B={},V={},Zr={},H=null,U=new Set,Qr=!1,$r=null,ei=[{label:`City`,value:4,hint:`~20 km`},{label:`Neighbourhood`,value:5,hint:`~2.4 km`},{label:`Street`,value:6,hint:`~610 m`},{label:`Exact`,value:9,hint:`~2 m`}],ti=6371e3;function ni(e,t,n,r=48){let i=[];for(let a=0;a<=r;a++){let o=a/r*2*Math.PI,s=n/ti*Math.cos(o)*(180/Math.PI),c=n/(ti*Math.cos(e*Math.PI/180))*Math.sin(o)*(180/Math.PI);i.push([t+c,e+s])}return i}var ri=[210,140,30,280,60,330,170,0];function ii(e){let{groups:t,activeGroupId:n}=s(),r=((n?t[n]:null)?.members??[]).indexOf(e);return ri[(r>=0?r:0)%ri.length]}function ai(e){if(U.has(e))return`#f87171`;let{groups:t,activeGroupId:n}=s(),r=n?t[n]:null;if(!r)return`hsl(${ii(e)}, 70%, 55%)`;let i=r.livenessCheckins[e]??0;if(i===0)return`hsl(${ii(e)}, 20%, 50%)`;let a=Math.floor(Date.now()/1e3)-i,o=r.livenessInterval;return a<=o?`hsl(${ii(e)}, 70%, 55%)`:a<=o*1.25?`hsl(${ii(e)}, 40%, 50%)`:`#94a3b8`}function oi(){return{type:`FeatureCollection`,features:Object.entries(V).map(([e,t])=>({type:`Feature`,properties:{pubkey:e,duress:U.has(e),colour:ai(e)},geometry:{type:`Polygon`,coordinates:[ni(t.lat,t.lon,Xr(t.precision))]}}))}}var si=`5.19.0`,ci=`https://unpkg.com/maplibre-gl@${si}/dist/maplibre-gl.js`,li=`https://unpkg.com/maplibre-gl@${si}/dist/maplibre-gl.css`,ui=`sha384-pEfbADcwebVj4NNOvWFLUkm+FiGTICE5bChpV647czG7OpSqcHNgxM8QawfAkbRO`,di=`sha384-MGCxhspF/+ufueUgol3FDkiAYQbpSNRhBT0VWHJt64U8qIy9qlnXWx8LAbj6niPH`;async function fi(){if(z)return z;try{let[e]=await Promise.all([C(()=>import(`./maplibre-gl-DCFmKnXf.js`).then(e=>ct(e.default,1)),[],import.meta.url),C(()=>Promise.resolve({}),__vite__mapDeps([0]),import.meta.url)]);return z=e,e}catch{}let e=document.createElement(`link`);return e.rel=`stylesheet`,e.href=li,e.integrity=di,e.crossOrigin=`anonymous`,document.head.appendChild(e),await new Promise((e,t)=>{let n=document.createElement(`script`);n.src=ci,n.integrity=ui,n.crossOrigin=`anonymous`,n.onload=()=>e(),n.onerror=t,document.head.appendChild(n)}),z=window.maplibregl,z}async function pi(e){let{groups:t,activeGroupId:n}=s();if(!n||!t[n]){R&&(R.remove(),R=null,Qr=!1),e.innerHTML=``;return}let r=t[n],i=r.beaconPrecision??5;if($r!==n){V={},Zr={},U.clear();for(let[e,t]of Object.entries(B))t.remove(),delete B[e];if($r=n,r.lastPositions)for(let[e,t]of Object.entries(r.lastPositions))V[e]=t}if(R&&document.getElementById(`beacon-map`)){W();for(let[e,t]of Object.entries(V))vi(e,t.lat,t.lon);K(),Object.keys(V).length>0&&G();return}queueMicrotask(()=>K()),e.innerHTML=`
    <section class="panel beacon-panel">
      <h3 class="panel__title">Location</h3>
      <p class="settings-hint" style="margin-bottom: 0.5rem;">Approximate location of group members. Circles show the geohash area — your exact position is never shared. In an emergency, full GPS precision is used so your group can help. Circles turn <span style="color: #f87171; font-weight: 500;">red</span> when an emergency signal is active.</p>
      <div class="beacon-map" id="beacon-map" style="height: 500px; border-radius: 8px;"></div>
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-top: 0.5rem; flex-wrap: wrap;">
        <button class="btn ${H===null?``:`btn--primary`}" id="beacon-toggle-btn" type="button">
          ${H===null?`Share Location`:`Sharing Location`}
        </button>
        <button class="btn btn--ghost" id="beacon-fit-btn" type="button" title="Zoom to fit all group members on the map">Fit All</button>
        ${H===null?``:`<span class="settings-hint" style="margin: 0;">Your approximate area is visible to group members</span>`}
      </div>
      <div style="margin-top: 0.75rem;">
        <span class="input-label">"I'm Alive" precision</span>
        <div class="segmented" id="beacon-precision-picker">
          ${ei.map(e=>`<button class="segmented__btn ${i===e.value?`segmented__btn--active`:``}" data-beacon-precision="${e.value}" title="${e.hint}">${e.label}</button>`).join(``)}
        </div>
        <p class="settings-hint">How precisely your location is shared in routine check-ins</p>
      </div>
      <p class="settings-hint" style="margin-top: 0.5rem; color: var(--duress);">Emergency signals always share your exact GPS so your group can find you.</p>
      <div class="beacon-list" id="beacon-list"></div>
    </section>
  `,e.querySelectorAll(`[data-beacon-precision]`).forEach(t=>{t.addEventListener(`click`,()=>{let n=Number(t.dataset.beaconPrecision),{activeGroupId:r}=s();r&&(c(r,{beaconPrecision:n}),H!==null&&(gi(),_i()),e.querySelectorAll(`[data-beacon-precision]`).forEach(e=>{e.classList.toggle(`segmented__btn--active`,Number(e.dataset.beaconPrecision)===n)}))})}),e.querySelector(`#beacon-toggle-btn`)?.addEventListener(`click`,()=>{H===null?_i():gi(),pi(e)}),e.querySelector(`#beacon-fit-btn`)?.addEventListener(`click`,()=>{G()});try{await fi(),mi()}catch{e.querySelector(`.beacon-map`).innerHTML=`<p style="color: var(--text-muted); text-align: center; padding: 2rem;">Map unavailable offline</p>`}}function mi(){let e=document.getElementById(`beacon-map`);if(!e||R||!z)return;let t=document.documentElement.dataset.theme===`light`?`https://basemaps.cartocdn.com/gl/positron-gl-style/style.json`:`https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`;R=new z.Map({container:e,style:t,center:[-.1278,51.5074],zoom:12}),R.on(`load`,()=>{Qr=!0,console.info(`[canary:beacon] map loaded, positions to catch up:`,Object.keys(V).length),R.addSource(`geohash-circles`,{type:`geojson`,data:oi()}),R.addLayer({id:`geohash-fill`,type:`fill`,source:`geohash-circles`,paint:{"fill-color":[`get`,`colour`],"fill-opacity":[`case`,[`get`,`duress`],.35,.2]}}),R.addLayer({id:`geohash-stroke`,type:`line`,source:`geohash-circles`,paint:{"line-color":[`get`,`colour`],"line-width":2.5,"line-opacity":[`case`,[`get`,`duress`],.9,.6]}});for(let[e,t]of Object.entries(V))vi(e,t.lat,t.lon);Object.keys(V).length>0&&G()})}function hi(){let{activeGroupId:e}=s();e&&c(e,{lastPositions:{...V}})}function W(){if(!R||!Qr)return;let e=R.getSource(`geohash-circles`);e&&e.setData(oi())}function gi(){H!==null&&(navigator.geolocation.clearWatch(H),H=null);let{identity:e}=s();e?.pubkey&&(delete V[e.pubkey],delete Zr[e.pubkey],B[e.pubkey]&&(B[e.pubkey].remove(),delete B[e.pubkey]),W(),K())}function _i(){if(H!==null||!(`geolocation`in navigator))return;let{groups:e,activeGroupId:t,identity:n}=s();if(!t||!e[t]||!n?.pubkey)return;let r=e[t],i=St(r.seed),a=r.beaconPrecision||5;H=navigator.geolocation.watchPosition(async e=>{let r=Kr(e.coords.latitude,e.coords.longitude,a),o=qr(r),s=o.lat,c=o.lon,l=await Tt(i,r,a);n?.pubkey&&(Zr[n.pubkey]=l,V[n.pubkey]={lat:s,lon:c,geohash:r,precision:a,timestamp:Math.floor(Date.now()/1e3)},vi(n.pubkey,s,c),W(),G(),K(),hi(),t&&v(t,{type:`beacon`,lat:s,lon:c,accuracy:Xr(a),timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID()}))},e=>{console.warn(`[canary:beacon] watchPosition error`,e.code,e.message)},{enableHighAccuracy:!1,maximumAge:6e4,timeout:15e3})}function vi(e,t,n){if(!R||!z){console.warn(`[canary:beacon] updateMapMarker skipped — map not ready`,{map:!!R,maplibregl:!!z,pubkey:e.slice(0,8)});return}let r=ai(e),i=U.has(e),a=yi(e),o=Ze(e),s=!!o?.picture,c=i?40:32;if(B[e]){B[e].setLngLat([n,t]);let o=B[e].getElement(),l=o.querySelector(`.beacon-dot`);l&&(s||(l.style.background=r),l.style.width=`${c}px`,l.style.height=`${c}px`,l.style.borderColor=r,l.style.boxShadow=`0 0 10px ${r}80`,l.style.animation=i?`beacon-pulse 1s ease-in-out infinite`:`none`);let u=o.querySelector(`.beacon-label`);u&&(u.textContent=a)}else{let l=document.createElement(`div`);l.style.display=`flex`,l.style.flexDirection=`column`,l.style.alignItems=`center`,l.style.pointerEvents=`none`;let u;s?(u=document.createElement(`img`),u.src=o.picture,u.style.objectFit=`cover`):(u=document.createElement(`div`),u.style.background=r),u.className=`beacon-dot`,u.style.width=`${c}px`,u.style.height=`${c}px`,u.style.borderRadius=`50%`,u.style.border=`3px solid ${r}`,u.style.boxShadow=`0 0 10px ${r}80`,u.style.zIndex=`2`,i&&(u.style.animation=`beacon-pulse 1s ease-in-out infinite`),l.appendChild(u);let d=document.createElement(`div`);d.className=`beacon-label`,d.textContent=a,d.style.fontSize=`11px`,d.style.fontWeight=`600`,d.style.color=`#fff`,d.style.textShadow=`0 1px 3px rgba(0,0,0,0.8)`,d.style.marginTop=`2px`,d.style.whiteSpace=`nowrap`,l.appendChild(d),B[e]=new z.Marker({element:l,anchor:`center`}).setLngLat([n,t]).addTo(R)}}function G(){if(!R)return;let e=Object.values(V);if(e.length===0)return;if(e.length===1){R.flyTo({center:[e[0].lon,e[0].lat],zoom:13});return}let t=e.map(e=>e.lon),n=e.map(e=>e.lat);R.fitBounds([[Math.min(...t),Math.min(...n)],[Math.max(...t),Math.max(...n)]],{padding:60,maxZoom:14})}function yi(e){let{groups:t,activeGroupId:n,identity:r}=s(),i=n?t[n]:null,a=r?.pubkey===e,o,c=i?.memberNames?.[e];return c&&c!==`You`&&(o=c),o||=Je(e),a?o?`${o} (you)`:`You`:o||`${e.slice(0,8)}\u2026`}function K(){let e=document.getElementById(`beacon-list`);e&&(e.innerHTML=Object.entries(V).map(([e,t])=>{let n=ai(e),r=yi(e),i=Ze(e),a=Math.floor(Date.now()/1e3)-t.timestamp,o=a<60?`just now`:a<3600?`${Math.floor(a/60)}m ago`:`${Math.floor(a/3600)}h ago`;return`
      <div class="beacon-entry" style="display:flex;align-items:center;gap:0.5rem;padding:0.25rem 0;">
        ${i?.picture?`<img src="${k(i.picture)}" alt="" style="width:20px;height:20px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid ${n};" />`:`<span style="width:8px;height:8px;border-radius:50%;background:${n};flex-shrink:0;"></span>`}
        <span class="beacon-member" style="font-weight:500;">${k(r)}</span>
        <span class="beacon-geohash" style="color:var(--text-muted);font-size:0.8rem;">${k(t.geohash)}</span>
        <span style="color:var(--text-muted);font-size:0.75rem;margin-left:auto;">${k(o)}</span>
      </div>
    `}).join(``)||`<p class="settings-hint">No beacons yet — enable location to start</p>`)}document.addEventListener(`canary:duress`,(e=>{let{members:t}=e.detail;if(!t?.length)return;for(let e of t)U.add(e),bi(e);W();let n=t.map(e=>V[e]).filter(Boolean);if(R&&n.length===1)R.flyTo({center:[n[0].lon,n[0].lat],zoom:14});else if(R&&n.length>1){let e=n.map(e=>e.lon),t=n.map(e=>e.lat);R.fitBounds([[Math.min(...e),Math.min(...t)],[Math.max(...e),Math.max(...t)]],{padding:60})}}));function bi(e){let t=B[e];if(!t)return;let n=t.getElement();n.style.background=`#f87171`,n.style.width=`14px`,n.style.height=`14px`,n.style.boxShadow=`0 0 12px rgba(248, 113, 113, 0.6)`}function xi(){if(console.info(`[canary:beacon] sendLocationPing called`,{hasGeo:`geolocation`in navigator,map:!!R,mapReady:Qr}),!(`geolocation`in navigator))return;let{groups:e,activeGroupId:t,identity:n}=s();if(!t||!e[t]||!n?.pubkey){console.warn(`[canary:beacon] sendLocationPing: missing state`,{activeGroupId:t,hasPubkey:!!n?.pubkey});return}if(H!==null){console.info(`[canary:beacon] watch already active, skipping getCurrentPosition`);return}_i();let r=e[t],i=St(r.seed),a=r.beaconPrecision||5;navigator.geolocation.getCurrentPosition(async e=>{let r=Kr(e.coords.latitude,e.coords.longitude,a),o=qr(r),s=o.lat,c=o.lon,l=await Tt(i,r,a);n?.pubkey&&(Zr[n.pubkey]=l,V[n.pubkey]={lat:s,lon:c,geohash:r,precision:a,timestamp:Math.floor(Date.now()/1e3)},vi(n.pubkey,s,c),W(),G(),K(),hi(),t&&v(t,{type:`beacon`,lat:s,lon:c,accuracy:Xr(a),timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID()}))},e=>{console.warn(`[canary:beacon] getCurrentPosition FAILED`,e.code,e.message),C(async()=>{let{showToast:e}=await import(`./toast-C4N9aZta.js`);return{showToast:e}},__vite__mapDeps([1,2]),import.meta.url).then(({showToast:t})=>{e.code===1?t(`Location permission denied`,`error`,3e3):e.code===3?t(`Location request timed out`,`error`,3e3):t(`Could not get location`,`error`,3e3)})},{enableHighAccuracy:!1,maximumAge:3e4,timeout:1e4})}function Si(e,t,n,r,i){let{groups:a,activeGroupId:o}=s(),c=o?a[o]:null;if(!c||!c.members.includes(e))return;let l=Ci(r),u=Kr(t,n,l);V[e]={lat:t,lon:n,geohash:u,precision:l,timestamp:i},vi(e,t,n),W(),G(),K(),hi()}function Ci(e){return e<=3?9:e<=20?8:e<=80?7:e<=620?6:e<=2500?5:e<=2e4?4:e<=8e4?3:e<=63e4?2:1}function wi(){H!==null&&navigator.geolocation.clearWatch(H),H=null,Qr=!1,R&&=(R.remove(),null),B={},V={},Zr={},U.clear(),$r=null}function Ti(e){return new Date(e*1e3).toISOString().slice(11,19)+` UTC`}function Ei(e,t){return e<=t?`green`:e<=t*1.25?`amber`:`red`}function Di(e,t){return e<60?Ti(t):e<3600?`${Math.floor(e/60)}m ago`:e<86400?`${Math.floor(e/3600)}h ago`:`${Math.floor(e/86400)}d ago`}var Oi=[{label:`1m`,value:60},{label:`2m`,value:120},{label:`5m`,value:300},{label:`15m`,value:900},{label:`1h`,value:3600},{label:`4h`,value:14400},{label:`24h`,value:86400},{label:`7d`,value:604800}];function ki(e){let{groups:t,activeGroupId:n,identity:r}=s();if(!n||!t[n]){e.innerHTML=``;return}let i=t[n],a=Math.floor(Date.now()/1e3),o=i.livenessInterval,l=i.members.map(e=>{let t=i.livenessCheckins[e]??0,n=t>0,s=n?a-t:1/0,c=n?Ei(s,o):`grey`,l=n?Math.max(0,Math.min(100,(1-s/o)*100)):0,u=r?.pubkey===e,d=i.memberNames?.[e];return`
      <li class="liveness-item liveness-item--${c}">
        <span class="liveness-dot liveness-dot--${c}"></span>
        <span class="liveness-name">${k(u?`You`:d??`${e.slice(0,8)}\u2026`)}</span>
        <span class="liveness-time">${n?Di(s,t):`awaiting first check-in`}</span>
        <div class="liveness-bar">
          <div class="liveness-bar__fill liveness-bar__fill--${c}" style="width: ${l}%"></div>
        </div>
      </li>
    `}).join(``),u=r?.pubkey!=null&&i.members.includes(r.pubkey);e.innerHTML=`
    <section class="panel liveness-panel">
      <h3 class="panel__title">Liveness</h3>

      <div class="settings-section">
        <span class="input-label">Check-in interval</span>
        <div class="segmented" id="liveness-interval-picker">
          ${Oi.map(e=>`<button class="segmented__btn ${o===e.value?`segmented__btn--active`:``}" data-liveness-interval="${e.value}">${e.label}</button>`).join(``)}
        </div>
        <p class="settings-hint">How often members must check in</p>
      </div>

      <ul class="liveness-list" id="liveness-list">
        ${l}
      </ul>
      ${u?`
        <button class="btn btn--primary" id="checkin-btn" type="button" title="Check in with your group and share your approximate location">I'm Alive</button>
      `:``}
    </section>
  `,e.querySelectorAll(`[data-liveness-interval]`).forEach(e=>{e.addEventListener(`click`,()=>{c(n,{livenessInterval:Number(e.dataset.livenessInterval)})})}),document.getElementById(`checkin-btn`)?.addEventListener(`click`,()=>{try{let{identity:e,activeGroupId:t,groups:n}=s();if(!e?.pubkey||!t){console.warn(`[canary:liveness] No identity or activeGroupId`,{pubkey:e?.pubkey,gid:t});return}let r=n[t];if(!r){console.warn(`[canary:liveness] Group not found`,t);return}let i=Math.floor(Date.now()/1e3),a=be(i,r.rotationInterval);Ae(r.seed,`canary:liveness`,e.pubkey,a),c(t,{livenessCheckins:{...r.livenessCheckins,[e.pubkey]:i}}),v(t,{type:`liveness-checkin`,pubkey:e.pubkey,timestamp:i,opId:crypto.randomUUID()}),Promise.all([C(()=>import(`./push-BPPbJwyP.js`),[],import.meta.url),C(()=>import(`./sync-CTwt-KD4.js`),__vite__mapDeps([3,4,5,6,7,8]),import.meta.url)]).then(([{notifyCheckin:e},{hashGroupTag:n}])=>{e(n(t))}).catch(()=>{}),xi(),setTimeout(()=>{document.getElementById(`beacon-container`)?.scrollIntoView({behavior:`smooth`,block:`center`})},300),O(`Check-in sent — location updated`,`success`,2e3)}catch(e){console.error(`[canary:liveness] Check-in failed:`,e),O(`Check-in failed`,`error`,3e3)}})}function Ai(e){if(e.startsWith(`wss://`))return!0;if(e.startsWith(`ws://`))try{let t=new URL(e);return t.hostname===`localhost`||t.hostname===`127.0.0.1`||t.hostname===`[::1]`}catch{return!1}return!1}var ji=!1;function Mi(){let{personas:e}=s(),t=Object.values(e);return t.length===0?`<li class="relay-item"><span class="settings-hint">No personas yet</span></li>`:t.map(e=>{let t=e.npub.length>16?`${e.npub.slice(0,8)}\u2026${e.npub.slice(-4)}`:e.npub;return`
      <li class="relay-item">
        ${qe(e.name)}
        <span class="relay-url">${k(e.displayName??e.name)}</span>
        <span class="settings-hint" style="margin-left: 0.25rem;">${k(t)}</span>
        <button class="btn btn--ghost btn--sm persona-publish-btn" data-persona-id="${k(e.id)}" title="Publish profile">Publish</button>
      </li>
    `}).join(``)}function Ni(t){let{groups:n,activeGroupId:r}=s();if(!r||!n[r]){t.innerHTML=``;return}let i=n[r],{identity:o}=s(),l=!!o?.pubkey&&i.admins.includes(o.pubkey);t.innerHTML=`
    <div class="settings-drawer" id="settings-drawer">
      <button class="settings-toggle" id="settings-toggle">
        <span>Group Settings</span>
        <span class="settings-chevron" style="${ji?`transform: rotate(90deg);`:``}">&#9658;</span>
      </button>

      <div class="settings-body" id="settings-body"${ji?``:` hidden`}>
        <!-- Group Name -->
        <label class="input-label">Name
          <input class="input" id="settings-name" value="${k(i.name)}">
        </label>

        <!-- Rotation Interval -->
        <div class="settings-section">
          <span class="input-label">Rotation</span>
          <div class="segmented">
            <button class="segmented__btn ${i.rotationInterval===30?`segmented__btn--active`:``}" data-interval="30">30s</button>
            <button class="segmented__btn ${i.rotationInterval===86400?`segmented__btn--active`:``}" data-interval="86400">24h</button>
            <button class="segmented__btn ${i.rotationInterval===604800?`segmented__btn--active`:``}" data-interval="604800">7d</button>
            <button class="segmented__btn ${i.rotationInterval===2592e3?`segmented__btn--active`:``}" data-interval="2592000">30d</button>
          </div>
          <p class="settings-hint">How often the verification word changes</p>
        </div>

        ${i.encodingFormat===`words`?`
        <!-- Word Count -->
        <div class="settings-section">
          <span class="input-label">Words</span>
          <div class="segmented">
            <button class="segmented__btn ${i.wordCount===1?`segmented__btn--active`:``}" data-words="1">1</button>
            <button class="segmented__btn ${i.wordCount===2?`segmented__btn--active`:``}" data-words="2">2</button>
            <button class="segmented__btn ${i.wordCount===3?`segmented__btn--active`:``}" data-words="3">3</button>
          </div>
          <p class="settings-hint">More words = stronger security</p>
        </div>
        `:``}

        <!-- Encoding Format -->
        <div class="settings-section">
          <span class="input-label">Display Format</span>
          <div class="segmented">
            <button class="segmented__btn ${i.encodingFormat===`words`?`segmented__btn--active`:``}" data-enc="words">Word</button>
            <button class="segmented__btn ${i.encodingFormat===`pin`?`segmented__btn--active`:``}" data-enc="pin">PIN</button>
            <button class="segmented__btn ${i.encodingFormat===`hex`?`segmented__btn--active`:``}" data-enc="hex">Hex</button>
          </div>
          <p class="settings-hint">Words for voice, PINs for digital input, Hex for machine-to-machine</p>
        </div>

        <!-- Tolerance Window -->
        <div class="settings-section">
          <span class="input-label">Tolerance</span>
          <div class="segmented">
            <button class="segmented__btn ${i.tolerance===0?`segmented__btn--active`:``}" data-tolerance="0">0</button>
            <button class="segmented__btn ${i.tolerance===1?`segmented__btn--active`:``}" data-tolerance="1">+/-1</button>
            <button class="segmented__btn ${i.tolerance===2?`segmented__btn--active`:``}" data-tolerance="2">+/-2</button>
            <button class="segmented__btn ${i.tolerance===3?`segmented__btn--active`:``}" data-tolerance="3">+/-3</button>
          </div>
          <p class="settings-hint">Accept words from neighbouring time windows (higher = more forgiving, less secure)</p>
        </div>

        <!-- Duress Mode -->
        <div class="settings-section">
          <span class="input-label">Emergency Alert Mode</span>
          <div class="segmented">
            <button class="segmented__btn ${i.duressMode===`immediate`||!i.duressMode?`segmented__btn--active`:``}" data-duress-mode="immediate">Immediate</button>
            <button class="segmented__btn ${i.duressMode===`dead-drop`?`segmented__btn--active`:``}" data-duress-mode="dead-drop">Dead Drop</button>
            <button class="segmented__btn ${i.duressMode===`both`?`segmented__btn--active`:``}" data-duress-mode="both">Both</button>
          </div>
          <p class="settings-hint">Immediate alerts members now. Dead drop records silently for later retrieval.</p>
        </div>

        <!-- Nostr Sync Toggle -->
        <div class="settings-section">
          <label class="toggle-label">
            <input type="checkbox" id="nostr-toggle" ${i.nostrEnabled?`checked`:``}>
            <span>Nostr Sync</span>
          </label>
          <div class="nostr-settings" id="nostr-settings"${i.nostrEnabled?``:` hidden`}>
            <!-- Identity -->
            <div class="nostr-identity" id="nostr-identity">
              <span class="settings-hint">Loading identity…</span>
            </div>

            <!-- Write relays (publishing) -->
            <div class="nostr-relays">
              <span class="input-label">Write Relays <span class="settings-hint" style="font-weight:normal;">(publishing)</span></span>
              <ul class="relay-list" id="write-relay-list">
                ${(i.writeRelays??[]).map((e,t)=>`
                  <li class="relay-item">
                    <span class="relay-url">${k(e)}</span>
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
                ${(i.readRelays??[]).map((e,t)=>`
                  <li class="relay-item">
                    <span class="relay-url">${k(e)}</span>
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
                ${We()?`Connected to ${Be()} relay${Be()===1?``:`s`}`:`Not connected`}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="settings-actions">
          <button class="btn btn--ghost" id="export-btn">Export Group</button>
          <button class="btn btn--ghost" id="import-btn">Import Group</button>
          ${l?`<button class="btn btn--warning" id="reseed-btn">Rotate Key</button>`:``}
          ${l?`<button class="btn btn--danger" id="compromise-reseed-btn">Compromise Reseed</button>`:``}
          <button class="btn btn--danger" id="dissolve-btn">Dissolve Group</button>
        </div>

        <!-- Personas -->
        <div class="settings-section">
          <span class="input-label">Personas</span>
          <ul class="relay-list" id="persona-list">
            ${Mi()}
          </ul>
          <div class="relay-add-row" style="margin-top: 0.5rem;">
            <input class="input relay-add-input" id="persona-name-input" type="text" placeholder="New persona name">
            <button class="btn btn--ghost btn--sm" id="persona-create-btn">Create</button>
          </div>
        </div>
      </div>
    </div>
  `,document.getElementById(`settings-toggle`).addEventListener(`click`,()=>{ji=!ji;let e=document.getElementById(`settings-body`),n=t.querySelector(`.settings-chevron`);e.hidden=!ji,n.style.transform=ji?`rotate(90deg)`:``}),document.getElementById(`settings-name`).addEventListener(`change`,e=>{let t=e.target.value.trim();t&&c(r,{name:t})}),t.querySelectorAll(`[data-interval]`).forEach(e=>{e.addEventListener(`click`,()=>{c(r,{rotationInterval:Number(e.dataset.interval)})})}),t.querySelectorAll(`[data-words]`).forEach(e=>{e.addEventListener(`click`,()=>{c(r,{wordCount:Number(e.dataset.words)})})}),t.querySelectorAll(`[data-enc]`).forEach(e=>{e.addEventListener(`click`,()=>{c(r,{encodingFormat:e.dataset.enc})})}),t.querySelectorAll(`[data-tolerance]`).forEach(e=>{e.addEventListener(`click`,()=>{c(r,{tolerance:Number(e.dataset.tolerance)})})}),t.querySelectorAll(`[data-duress-mode]`).forEach(e=>{e.addEventListener(`click`,()=>{c(r,{duressMode:e.dataset.duressMode})})}),document.getElementById(`nostr-toggle`).addEventListener(`change`,e=>{let t=e.target.checked;c(r,{nostrEnabled:t});let n=document.getElementById(`nostr-settings`);if(n.hidden=!t,t){let e=s().groups[r];f(e?.readRelays??[],e?.writeRelays??[],r).then(()=>{Fi()}),Pi()}else m(),He(),b(!1,0),Fi()});function u(){let e=s().groups[r];e?.nostrEnabled&&f(e.readRelays??[],e.writeRelays??[],r)}t.querySelectorAll(`.write-relay-remove`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Number(e.dataset.relayIndex),n=[...s().groups[r]?.writeRelays??[]];n.splice(t,1),c(r,{writeRelays:n}),u()})}),t.querySelectorAll(`.read-relay-remove`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Number(e.dataset.relayIndex),n=[...s().groups[r]?.readRelays??[]];n.splice(t,1),c(r,{readRelays:n}),u()})}),document.getElementById(`write-relay-add-btn`).addEventListener(`click`,()=>{let e=document.getElementById(`write-relay-add-input`),t=e.value.trim();if(!Ai(t)){e.focus();return}let n=[...s().groups[r]?.writeRelays??[]];n.includes(t)?e.value=``:(n.push(t),c(r,{writeRelays:n}),e.value=``,u())}),document.getElementById(`read-relay-add-btn`).addEventListener(`click`,()=>{let e=document.getElementById(`read-relay-add-input`),t=e.value.trim();if(!Ai(t)){e.focus();return}let n=[...s().groups[r]?.readRelays??[]];n.includes(t)?e.value=``:(n.push(t),c(r,{readRelays:n}),e.value=``,u())}),document.getElementById(`write-relay-add-input`).addEventListener(`keydown`,e=>{e.key===`Enter`&&document.getElementById(`write-relay-add-btn`).click()}),document.getElementById(`read-relay-add-input`).addEventListener(`keydown`,e=>{e.key===`Enter`&&document.getElementById(`read-relay-add-btn`).click()}),i.nostrEnabled&&Pi(),document.getElementById(`reseed-btn`)?.addEventListener(`click`,()=>{let{groups:t}=s(),n=t[r],i=n&&e(n)===`online`?`Rotate the group key? This broadcasts the new key to all members via the relay.`:`Rotate the group key? Remaining members will need to re-sync via Share State.`;confirm(i)&&(Nt(r),O(`Key rotated. New verification words are active.`,`warning`,6e3))}),document.getElementById(`compromise-reseed-btn`)?.addEventListener(`click`,()=>{confirm(`Compromise reseed? This generates a new key WITHOUT broadcasting. All members will need new invites.`)&&(Pt(r),O(`Emergency reseed complete. No broadcast sent — share new invites with all members.`,`warning`,8e3))}),document.getElementById(`dissolve-btn`).addEventListener(`click`,()=>{confirm(`Dissolve "${i.name}"? This cannot be undone.`)&&Mt(r)}),document.getElementById(`export-btn`).addEventListener(`click`,()=>{if(!confirm(`This exports the group secret in cleartext. Treat the file like a password.`))return;let e=new Blob([JSON.stringify(i,null,2)],{type:`application/json`}),t=URL.createObjectURL(e),n=document.createElement(`a`);n.href=t,n.download=`canary-${i.name.toLowerCase().replace(/\s+/g,`-`)}.json`,n.click(),URL.revokeObjectURL(t)}),document.getElementById(`import-btn`).addEventListener(`click`,()=>{if(!confirm(`Only import files from trusted sources — the file contains the group secret.`))return;let e=document.createElement(`input`);e.type=`file`,e.accept=`.json`,e.addEventListener(`change`,async()=>{let t=e.files?.[0];if(t)try{let e=await t.text(),n=JSON.parse(e);zt(n);let r=crypto.randomUUID(),i={id:r,name:String(n.name),seed:String(n.seed),members:n.members.filter(e=>typeof e==`string`),memberNames:{},nostrEnabled:!1,relays:[],wordlist:typeof n.wordlist==`string`?n.wordlist:`en-v1`,wordCount:[1,2,3].includes(n.wordCount)?n.wordCount:2,counter:typeof n.counter==`number`&&n.counter>=0?n.counter:0,usageOffset:typeof n.usageOffset==`number`&&n.usageOffset>=0?n.usageOffset:0,rotationInterval:typeof n.rotationInterval==`number`&&n.rotationInterval>0?n.rotationInterval:86400,encodingFormat:[`words`,`pin`,`hex`].includes(n.encodingFormat)?n.encodingFormat:`words`,usedInvites:[],latestInviteIssuedAt:0,livenessInterval:typeof n.rotationInterval==`number`&&n.rotationInterval>0?n.rotationInterval:86400,livenessCheckins:{},tolerance:typeof n.tolerance==`number`&&n.tolerance>=0&&n.tolerance<=10?n.tolerance:1,beaconInterval:typeof n.beaconInterval==`number`&&n.beaconInterval>0?n.beaconInterval:60,beaconPrecision:typeof n.beaconPrecision==`number`&&n.beaconPrecision>0?n.beaconPrecision:5,duressPrecision:typeof n.duressPrecision==`number`&&n.duressPrecision>0?n.duressPrecision:9,duressMode:[`immediate`,`dead-drop`,`both`].includes(n.duressMode)?n.duressMode:`immediate`,createdAt:typeof n.createdAt==`number`?n.createdAt:Math.floor(Date.now()/1e3),admins:Array.isArray(n.admins)?n.admins.filter(e=>typeof e==`string`):[],epoch:typeof n.epoch==`number`&&n.epoch>=0?n.epoch:0,consumedOps:Array.isArray(n.consumedOps)?n.consumedOps.filter(e=>typeof e==`string`):[]},{groups:o}=s();a({groups:{...o,[r]:i},activeGroupId:r})}catch{alert(`Could not import group file. Check the file format.`)}}),e.click()}),document.getElementById(`persona-create-btn`)?.addEventListener(`click`,()=>{let e=document.getElementById(`persona-name-input`),t=e?.value.trim();if(!t){e?.focus();return}try{let n=Pe(t),{personas:r}=s();a({personas:{...r,[t]:n}}),e&&(e.value=``),O(`Persona "${t}" created`,`success`)}catch(e){O(e instanceof Error?e.message:`Failed to create persona.`,`error`)}}),document.getElementById(`persona-name-input`)?.addEventListener(`keydown`,e=>{e.key===`Enter`&&document.getElementById(`persona-create-btn`)?.click()}),t.querySelectorAll(`.persona-publish-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.personaId;t&&(document.dispatchEvent(new CustomEvent(`canary:publish-persona-profile`,{detail:{personaId:t}})),O(`Publishing profile for "${Object.values(s().personas).find(e=>e.id===t)?.name??t}"…`,`info`))})})}function Pi(){let e=document.getElementById(`nostr-identity`);if(!e)return;let{identity:t}=s();if(!t?.pubkey){e.innerHTML=`<span class="settings-hint">No identity available.</span>`;return}let n=`${t.pubkey.slice(0,8)}…${t.pubkey.slice(-8)}`;e.innerHTML=`
    <div class="nostr-identity-row">
      <span class="input-label">Identity (Local key)</span>
      <span class="relay-url nostr-pubkey" title="${k(t.pubkey)}">${k(n)}</span>
    </div>
    <p class="settings-hint">Your identity is stored locally on this device.</p>
  `}function Fi(){let e=document.getElementById(`nostr-conn-status`);if(!e)return;let t=Be();e.textContent=We()?`Connected to ${t} relay${t===1?``:`s`}`:`Not connected`}var Ii=new TextEncoder;function Li(e){let t=new Uint8Array(4);return new DataView(t.buffer).setUint32(0,e,!1),t}function Ri(){let e=new Uint8Array(32);return crypto.getRandomValues(e),e}var zi=Object.freeze({call:Object.freeze({wordCount:1,rotationSeconds:30,tolerance:1,directional:!0,description:`Phone verification for insurance, banking, and call centres. Single word with 30-second rotation. Deepfake-proof — cloning a voice does not help derive the current word.`}),handoff:Object.freeze({wordCount:1,rotationSeconds:0,tolerance:0,directional:!0,description:`Physical handoff verification for rideshare, delivery, and task completion. Single-use token per event. No time dependency — counter is the task/event ID.`})});function Bi(e){let t=e.preset?zi[e.preset]:void 0,n=e.rotationSeconds??t?.rotationSeconds??30,r=e.tolerance??t?.tolerance??0,i=t?.wordCount??1,a=e.encoding??{format:`words`,count:i};if(!e.namespace)throw Error(`namespace must be a non-empty string`);if(e.namespace.includes(`\0`))throw Error(`namespace must not contain null bytes`);if(!e.roles[0]||!e.roles[1])throw Error(`Both roles must be non-empty strings`);if(e.roles[0].includes(`\0`)||e.roles[1].includes(`\0`))throw Error(`Roles must not contain null bytes`);if(e.roles[0]===e.roles[1])throw Error(`Roles must be distinct, got ["${e.roles[0]}", "${e.roles[1]}"]`);if(e.myRole!==e.roles[0]&&e.myRole!==e.roles[1])throw Error(`myRole "${e.myRole}" is not one of the configured roles ["${e.roles[0]}", "${e.roles[1]}"]`);if(!Number.isInteger(n)||n<0)throw RangeError(`rotationSeconds must be a non-negative integer, got ${n}`);if(!Number.isInteger(r)||r<0)throw RangeError(`tolerance must be a non-negative integer, got ${r}`);if(r>10)throw RangeError(`tolerance must be <= 10, got ${r}`);if(n===0&&e.counter===void 0)throw Error(`Fixed counter mode (rotationSeconds=0) requires config.counter`);if(n===0&&e.counter!==void 0&&(!Number.isInteger(e.counter)||e.counter<0||e.counter>4294967295))throw RangeError(`counter must be an integer 0–4294967295, got ${e.counter}`);if(n>0&&e.counter!==void 0)throw Error(`counter must not be set when rotationSeconds > 0 (counter is derived from time)`);let o=typeof e.secret==`string`?T(e.secret):e.secret,s=e.roles[0]===e.myRole?e.roles[1]:e.roles[0],c=`pair:${e.namespace}:${s}`,l=n===0;function u(t){if(l){if(e.counter===void 0)throw Error(`Fixed counter mode (rotationSeconds=0) requires config.counter`);return e.counter}let r=t??Math.floor(Date.now()/1e3);return Math.floor(r/n)}return{counter:u,myToken(t){return pe(o,e.namespace,e.roles,u(t),a)[e.myRole]},theirToken(t){return pe(o,e.namespace,e.roles,u(t),a)[s]},verify(t,n){let i=t.toLowerCase().trim().replace(/\s+/g,` `),l=u(n),d=Math.max(0,l-r),f=Math.min(4294967295,l+r),p=!1;for(let t=d;t<=f;t++)ge(i,pe(o,e.namespace,e.roles,t,a)[s])&&(p=!0);let m=[];if(e.theirIdentity){let t=new Set,n=2*r,u=Math.max(0,l-n),p=Math.min(4294967295,l+n);for(let n=u;n<=p;n++){let r=pe(o,e.namespace,e.roles,n,a);t.add(r[s])}for(let n=d;n<=f;n++){let r=ve(Ii.encode(c+`:duress`),new Uint8Array([0]),Ii.encode(e.theirIdentity),Li(n)),s=me(o,r),l=ye(s,a),u=1;for(;t.has(l)&&u<=255;)s=me(o,ve(r,new Uint8Array([u]))),l=ye(s,a),u++;ge(i,l)&&m.push(e.theirIdentity)}}return m.length>0?{status:`duress`,identities:m}:p?{status:`valid`}:{status:`invalid`}},pair(t){return pe(o,e.namespace,e.roles,u(t),a)}}}var Vi={insurance:{label:`Insurance`,namespace:`aviva`,roles:[`caller`,`agent`],preset:`call`},pickup:{label:`Pickup`,namespace:`family`,roles:[`child`,`adult`],preset:`handoff`},rideshare:{label:`Rideshare`,namespace:`dispatch`,roles:[`requester`,`driver`],preset:`handoff`,encoding:`pin`}},Hi=Ri(),q=Vi.insurance,Ui,Wi,Gi=null,Ki=1;function qi(){let e=q.preset===`handoff`,t=q.encoding===`pin`?{format:`pin`,digits:4}:void 0,n={secret:Hi,namespace:q.namespace,roles:q.roles,preset:q.preset,...e?{counter:Ki}:{},...t?{encoding:t}:{}};Ui=Bi({...n,myRole:q.roles[0],theirIdentity:q.roles[1]}),Wi=Bi({...n,myRole:q.roles[1],theirIdentity:q.roles[0]})}qi();function Ji(e,t){let n=q.preset===`handoff`,r=zi[q.preset],i=n?Ki:Math.floor((t??Math.floor(Date.now()/1e3))/r.rotationSeconds),a=`pair:${q.namespace}:${e}`,o=q.encoding===`pin`?{format:`pin`,digits:4}:{format:`words`,count:1};return xe(Hi,a,e,i,o,r.tolerance)}function Yi(){Gi!==null&&(clearInterval(Gi),Gi=null)}function Xi(e){if(e<=0)return`0s`;let t=Math.floor(e/60),n=Math.floor(e%60);return t>0?`${t}m ${n}s`:`${n}s`}function Zi(e){if(e===0)return 0;let t=Math.floor(Date.now()/1e3),n=(Math.floor(t/e)+1)*e;return Math.max(0,n-t)}function Qi(e){Yi();let t=Math.floor(Date.now()/1e3),n=q.preset===`handoff`,r=n?0:zi[q.preset].rotationSeconds,i=Zi(r),a=r>0?Math.min(100,(r-i)/r*100):100,o=q.roles[0],s=q.roles[1];e.innerHTML=`
    <div class="call-sim">
      <div class="call-sim__header">
        <h2 class="call-sim__title">CANARY Call Verification Demo</h2>
        <div class="call-sim__scenarios" id="call-scenarios">
          ${Object.entries(Vi).map(([e,t])=>`<button class="btn call-sim__scenario-btn${q===t?` call-sim__scenario-btn--active`:``}" data-scenario="${e}">${t.label}</button>`).join(``)}
        </div>
      </div>

      <div class="call-sim__panels">
        <div class="call-sim__panel call-sim__panel--caller">
          <h3 class="call-sim__role">${o.toUpperCase()}</h3>
          <div class="call-sim__token-group">
            <span class="call-sim__label">Your code — tap to reveal:</span>
            <div class="call-sim__token call-sim__token--reveal" id="caller-reveal" data-real="${Ui.myToken(t)}" data-alt="${Ji(o,t)}">••••••••</div>
          </div>
          ${n?`<span class="call-sim__countdown">Single-use</span>`:`
          <div class="call-sim__progress"><div class="call-sim__progress-bar" id="caller-progress" style="width: ${a}%"></div></div>
          <span class="call-sim__countdown" id="caller-countdown">${Xi(i)}</span>
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
            <div class="call-sim__token call-sim__token--reveal" id="agent-reveal" data-real="${Wi.myToken(t)}" data-alt="${Ji(s,t)}">••••••••</div>
          </div>
          ${n?`<span class="call-sim__countdown">Single-use</span>`:`
          <div class="call-sim__progress"><div class="call-sim__progress-bar" id="agent-progress" style="width: ${a}%"></div></div>
          <span class="call-sim__countdown" id="agent-countdown">${Xi(i)}</span>
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
        <span class="call-sim__meta">Namespace: <strong>${q.namespace}</strong></span>
        <span class="call-sim__meta">Rotation: <strong>${n?`single-use`:r+`s`}</strong></span>
        <span class="call-sim__meta">Encoding: <strong>${q.encoding??`words`}</strong></span>
        <span class="call-sim__meta">Tolerance: <strong>+/-${n?`0`:zi[q.preset].tolerance}</strong></span>
        <button class="btn" id="call-reset-seed">Reset seed</button>
      </div>

      <div class="call-sim__pair" id="call-pair">
        <span class="call-sim__meta">Pair: <code id="pair-display"></code></span>
      </div>
    </div>
  `,e.querySelector(`#call-scenarios`)?.addEventListener(`click`,t=>{let n=t.target.closest(`[data-scenario]`);if(!n)return;let r=n.dataset.scenario;Vi[r]&&Vi[r]!==q&&(q=Vi[r],qi(),Qi(e))}),e.querySelector(`#call-reset-seed`)?.addEventListener(`click`,()=>{Hi=Ri(),q.preset===`handoff`&&Ki++,qi(),Qi(e)});let c=!1,l=!1,u=!1;function d(){if(!u&&c&&l){Yi();let t=e.querySelector(`#call-verified-banner`);t&&(t.hidden=!1,t.textContent=`Call Verified — both parties authenticated`),e.querySelectorAll(`.call-sim__progress, .call-sim__countdown`).forEach(e=>{e.hidden=!0})}}function f(t,n,r,i,a){let o=e.querySelector(`#${t}`),s=e.querySelector(`#${n}`),f=e.querySelector(`#${r}`);if(!o||!s||!f)return;function p(){let e=o.value.trim();if(!e)return;let t=i.verify(e);f.hidden=!1,f.className=`call-sim__result`,t.status===`valid`?(f.classList.add(`call-sim__result--valid`),f.textContent=`Verified ✓`,a===`caller`?c=!0:l=!0,d()):t.status===`duress`?(f.classList.add(`call-sim__result--invalid`),f.textContent=`Failed ✗`,u=!0):(f.classList.add(`call-sim__result--invalid`),f.textContent=`Failed ✗`)}s.addEventListener(`click`,p),o.addEventListener(`keydown`,e=>{e.key===`Enter`&&p()})}f(`caller-verify-input`,`caller-verify-btn`,`caller-result`,Ui,`caller`),f(`agent-verify-input`,`agent-verify-btn`,`agent-result`,Wi,`agent`);function p(t){let n=e.querySelector(`#${t}`);if(!n)return;function r(e){e.preventDefault();let t=n.getBoundingClientRect();n.textContent=e.clientX-t.left<t.width/2?n.dataset.real:n.dataset.alt}function i(){n.textContent=`••••••••`}n.addEventListener(`pointerdown`,r),n.addEventListener(`pointerup`,i),n.addEventListener(`pointerleave`,i),n.addEventListener(`pointercancel`,i)}p(`caller-reveal`),p(`agent-reveal`);let m=e.querySelector(`#pair-display`);if(m){let e=Ui.pair(t);m.textContent=Object.entries(e).map(([e,t])=>`${e}: ${t}`).join(` | `)}!n&&r>0&&(Gi=setInterval(()=>{let t=Zi(r),n=Math.min(100,(r-t)/r*100),i=e.querySelector(`#caller-progress`),a=e.querySelector(`#agent-progress`),d=e.querySelector(`#caller-countdown`),f=e.querySelector(`#agent-countdown`),p=Math.max(0,100-n),m=p>50?`hsl(${Math.round(p/100*120)}, 70%, 45%)`:`hsl(${Math.round(p/100*120)}, 80%, 45%)`;i&&(i.style.width=`${n}%`,i.style.background=m),a&&(a.style.width=`${n}%`,a.style.background=m),d&&(d.textContent=Xi(t)),f&&(f.textContent=Xi(t));let h=Math.floor(Date.now()/1e3),g=e.querySelector(`#caller-reveal`),_=e.querySelector(`#agent-reveal`),v=Ui.myToken(h),y=g&&g.dataset.real!==v;if(g&&(g.dataset.real=v,g.dataset.alt=Ji(o,h)),_&&(_.dataset.real=Wi.myToken(h),_.dataset.alt=Ji(s,h)),y){c=!1,l=!1,u=!1;let t=e.querySelector(`#caller-result`),n=e.querySelector(`#agent-result`);t&&(t.hidden=!0,t.className=`call-sim__result`),n&&(n.hidden=!0,n.className=`call-sim__result`);let r=e.querySelector(`#caller-verify-input`),i=e.querySelector(`#agent-verify-input`);r&&(r.value=``),i&&(i.value=``);let a=e.querySelector(`#call-verified-banner`);a&&(a.hidden=!0),e.querySelectorAll(`.call-sim__progress, .call-sim__countdown`).forEach(e=>{e.hidden=!1})}let b=e.querySelector(`#pair-display`);if(b){let e=Ui.pair();b.textContent=Object.entries(e).map(([e,t])=>`${e}: ${t}`).join(` | `)}t===0&&(Yi(),Qi(e))},1e3))}function $i(){Yi()}var ea=`
  .id-tree {
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    margin-bottom: 1.25rem;
  }

  .id-tree__root {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    color: var(--text-primary);
    font-weight: 600;
  }

  .id-tree__root-icon {
    font-size: 1rem;
  }

  .id-tree__node {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0;
    cursor: pointer;
    transition: background 0.1s;
    border-radius: 3px;
  }

  .id-tree__node--selected {
    background: var(--bg-hover, rgba(255,255,255,0.04));
    border-left: 2px solid var(--amber-500);
  }

  .id-tree__node:hover {
    background: var(--bg-hover, rgba(255,255,255,0.04));
  }

  .id-tree__connector {
    color: var(--text-muted);
    white-space: pre;
    user-select: none;
    flex-shrink: 0;
  }

  .id-tree__badge {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.625rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .id-tree__name {
    color: var(--text-primary);
    font-weight: 500;
  }

  .id-tree__display-name {
    color: var(--text-muted);
    font-size: 0.75rem;
  }

  .id-tree__groups {
    margin-left: auto;
    font-size: 0.6875rem;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .id-tree__groups:hover {
    color: var(--amber-400);
  }

  .id-tree__add-btn {
    font-size: 0.75rem;
    color: var(--text-muted);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0 0.25rem;
    opacity: 0;
    transition: opacity 0.15s;
    flex-shrink: 0;
  }

  .id-tree__node:hover .id-tree__add-btn {
    opacity: 1;
  }

  .id-tree__add-btn:hover {
    color: var(--amber-400);
  }

  .id-tree__inline-input {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    background: var(--bg-deep);
    border: 1px solid var(--amber-500);
    border-radius: 3px;
    color: var(--text-primary);
    padding: 0.125rem 0.375rem;
    outline: none;
    width: 10rem;
  }

  .id-tree__inline-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0;
  }
`;function ta(e,t){let n=0;for(let r of Object.values(t))r.personaId===e&&n++;return n}function na(e,t){for(let[n,r]of Object.entries(t))if(r.personaId===e)return n;return null}function ra(e,t,n,r,i,a){if(e.archived)return``;let o=n===0?``:r?`└── `:`├── `,s=Ke(e.name),c=k(e.name.slice(0,1).toUpperCase()),l=ta(e.id,t),u=l>0?`${l} group${l===1?``:`s`}`:``,d=e.displayName&&e.displayName!==e.name?` <span class="id-tree__display-name">(${k(e.displayName)})</span>`:``,f=n*1.5,p=`
    <div class="id-tree__node${e.id===a?` id-tree__node--selected`:``}" data-tree-persona-id="${k(e.id)}" style="padding-left: ${f}rem;">
      <span class="id-tree__connector">${i}${o}</span>
      <span class="id-tree__badge" style="background: ${s};">${c}</span>
      <span class="id-tree__name">${k(e.name)}</span>${d}
      <button class="id-tree__add-btn" data-tree-add-child="${k(e.id)}" title="Add child persona">+</button>
      ${u?`<span class="id-tree__groups" data-tree-groups-persona="${k(e.id)}">${u}</span>`:``}
    </div>
  `,m=Object.values(e.children).filter(e=>!e.archived),h=n===0?``:i+(r?`    `:`│   `);return p+m.map((e,r)=>{let i=r===m.length-1;return ra(e,t,n+1,i,h,a)}).join(``)}function ia(e){let{identity:t,personas:n,groups:r}=s();if(!t)return`<div class="id-tree"></div>`;let i=`<style id="identity-tree-styles">${ea}</style>`,a=t.displayName&&t.displayName!==`You`?k(t.displayName):`Master Identity`,o=Object.values(n).filter(e=>!e.archived);return`
    ${i}
    <div class="id-tree">
      <div class="id-tree__root">
        <span class="id-tree__root-icon">&#128273;</span>
        <span>${a}</span>
      </div>
      ${o.map((t,n)=>ra(t,r,0,n===o.length-1,``,e)).join(``)}
    </div>
  `}function aa(e){let t=e.querySelector(`.id-tree`);t&&(t.addEventListener(`click`,e=>{let n=e.target,r=n.closest(`[data-tree-add-child]`);if(r){e.stopPropagation();let n=r.dataset.treeAddChild;oa(t,r,n);return}let i=n.closest(`[data-tree-groups-persona]`);if(i){e.stopPropagation();let t=i.dataset.treeGroupsPersona,{groups:n}=s(),r=na(t,n);a(r?{view:`groups`,activeGroupId:r}:{view:`groups`});return}let o=n.closest(`[data-tree-persona-id]`);if(o){let e=o.dataset.treePersonaId;e&&document.dispatchEvent(new CustomEvent(`canary:select-persona`,{detail:{personaId:e}}))}}),t.addEventListener(`keydown`,e=>{let t=e.target;(e.key===`Enter`||e.key===` `)&&t.matches(`[data-tree-persona-id]`)&&(e.preventDefault(),t.click())}))}function oa(e,t,n){if(e.querySelector(`.id-tree__inline-row`))return;let r=t.closest(`.id-tree__node`);if(!r)return;let i=parseFloat(r.style.paddingLeft||`0`)+1.5,o=document.createElement(`div`);o.className=`id-tree__inline-row`,o.style.paddingLeft=i+`rem`;let c=document.createElement(`input`);c.className=`id-tree__inline-input`,c.type=`text`,c.placeholder=`child name`,c.maxLength=32,c.autocomplete=`off`,o.appendChild(c),r.insertAdjacentElement(`afterend`,o),c.focus();function l(){o.remove()}function u(){let e=c.value.trim().toLowerCase();if(!e||e.length===0||e.length>32||e!==e.toLowerCase()||/\s/.test(e)){l();return}try{let t=Le(n,e),{personas:r}=s();E(r,n)&&(a({personas:sa(r,n,t)}),document.dispatchEvent(new CustomEvent(`canary:select-persona`,{detail:{personaId:t.id}})))}catch{}l()}c.addEventListener(`keydown`,e=>{e.key===`Enter`?(e.preventDefault(),u()):e.key===`Escape`&&(e.preventDefault(),l())}),c.addEventListener(`blur`,()=>{setTimeout(l,150)})}function sa(e,t,n){let r={};for(let[i,a]of Object.entries(e))i===t?r[i]={...a,children:{...a.children,[n.id]:n}}:a.children&&Object.keys(a.children).length>0?r[i]={...a,children:sa(a.children,t,n)}:r[i]=a;return r}var ca=!1,la=!1,J=null,Y=!1,ua=!1,da=!1,fa=null;function pa(e){return e.length<=16?e:`${e.slice(0,8)}\u2026${e.slice(-4)}`}function ma(e){return!(e.length===0||e.length>32||e!==e.toLowerCase()||/\s/.test(e))}function ha(e,t){let n=t.querySelector(`[data-field="displayName"]`),r=t.querySelector(`[data-field="about"]`),i=t.querySelector(`[data-field="picture"]`);return!n&&!r&&!i?!1:(n?.value??``)!==(e.displayName??``)||(r?.value??``)!==(e.about??``)||(i?.value??``)!==(e.picture??``)}var ga=`
  .id-hub { max-width: 600px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }

  .id-hub__heading {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 400;
    color: var(--text-bright);
    margin: 0 0 0.25rem;
    letter-spacing: 0.01em;
  }

  .id-hub__sub {
    font-size: 0.75rem;
    color: var(--text-muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
  }

  /* ── Master card ────────────────────────────────── */

  .id-master {
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-left: 3px solid var(--amber-500);
    border-radius: 6px;
    padding: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .id-master__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .id-master__stats {
    font-size: 0.8125rem;
    color: var(--text-secondary);
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .id-master__actions {
    display: flex;
    gap: 0.375rem;
    flex-wrap: wrap;
  }

  .id-master__mnemonic {
    margin-top: 1rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    padding: 0.625rem 0.75rem;
    background: var(--bg-deep);
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text-primary);
    cursor: pointer;
    user-select: none;
    filter: blur(5px);
    transition: filter 0.2s var(--ease-out);
    line-height: 1.6;
    word-spacing: 0.25em;
  }

  .id-master__mnemonic--revealed {
    filter: none;
    user-select: text;
  }

  .id-master__mnemonic-hint {
    font-size: 0.6875rem;
    color: var(--text-muted);
    margin-top: 0.25rem;
    display: block;
  }

  /* ── Empty state ────────────────────────────────── */

  .id-empty {
    text-align: center;
    padding: 3rem 1.5rem;
    border: 1px dashed var(--border);
    border-radius: 8px;
    margin-bottom: 1.5rem;
  }

  .id-empty__icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
    opacity: 0.4;
  }

  .id-empty__title {
    font-family: var(--font-display);
    font-size: 1.125rem;
    color: var(--text-primary);
    margin: 0 0 0.5rem;
  }

  .id-empty__text {
    font-size: 0.8125rem;
    color: var(--text-muted);
    line-height: 1.6;
    max-width: 380px;
    margin: 0 auto 1.25rem;
  }

  /* ── Create form ────────────────────────────────── */

  .id-create {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 0.25rem;
  }

  .id-create__error {
    font-size: 0.75rem;
    color: var(--failed);
    min-height: 1.125rem;
  }

  /* ── Section divider ────────────────────────────── */

  .id-divider {
    border: none;
    border-top: 1px solid var(--border);
    margin: 1.5rem 0;
  }

  /* ── Archived ───────────────────────────────────── */

  .id-archived__toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem 0;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    text-align: left;
  }

  .id-archived__toggle:hover { color: var(--text-secondary); }

  .id-archived__list {
    overflow: hidden;
    transition: max-height 0.3s var(--ease-out);
  }

  .id-archived__row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border);
    font-size: 0.8125rem;
  }

  .id-archived__badge {
    width: 1.375rem;
    height: 1.375rem;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.625rem;
    font-weight: 700;
    color: #fff;
    opacity: 0.5;
  }

  .id-archived__name { color: var(--text-muted); }
  .id-archived__npub { color: var(--text-muted); opacity: 0.5; font-size: 0.6875rem; flex: 1; }

  /* ── NIP-07 fallback ────────────────────────────── */

  .id-nip07 { padding: 2rem 1.5rem; }

  .id-nip07__card {
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 1.25rem;
    margin-bottom: 1rem;
  }

  .id-nip07__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .id-nip07__icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: var(--bg-hover);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }

  .id-nip07__why {
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 1.25rem;
  }

  .id-nip07__why h3 {
    font-family: var(--font-display);
    font-size: 0.9375rem;
    margin: 0 0 0.75rem;
    color: var(--text-primary);
  }

  .id-nip07__why p {
    font-size: 0.8125rem;
    color: var(--text-muted);
    line-height: 1.6;
    margin: 0 0 0.625rem;
  }

  .id-nip07__why details {
    font-size: 0.75rem;
    color: var(--text-muted);
    opacity: 0.7;
    margin-top: 0.75rem;
  }

  .id-nip07__why summary { cursor: pointer; }
  .id-nip07__why code { font-family: var(--font-mono); font-size: 0.6875rem; }

  /* ── Detail panel ────────────────────────────────── */

  .id-detail {
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-left: 3px solid var(--amber-500);
    border-radius: 6px;
    padding: 1rem 1.25rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  .id-detail__hint {
    font-size: 0.8125rem;
    color: var(--text-muted);
    text-align: center;
    padding: 1.5rem 0;
  }

  .id-detail__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .persona-card__badge {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .persona-card__breadcrumb {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    color: var(--text-muted);
    padding-top: 0.625rem;
    line-height: 1.4;
  }

  .persona-card__breadcrumb-sep {
    opacity: 0.4;
    margin: 0 0.125rem;
  }

  .persona-card__breadcrumb-current {
    color: var(--text-secondary);
  }

  .persona-card__npub {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    color: var(--text-muted);
    padding: 0.625rem 0;
    word-break: break-all;
  }

  .persona-card__section {
    padding: 0.5rem 0;
  }

  .persona-card__section-title {
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    margin: 0 0 0.5rem;
    font-weight: 600;
  }

  .persona-card__field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 0.5rem;
  }

  .persona-card__field-label {
    font-size: 0.6875rem;
    color: var(--text-muted);
  }

  .persona-card__input {
    font-size: 0.8125rem;
  }

  .persona-card__publish-btn {
    margin-top: 0.375rem;
  }

  .persona-card__relay-default {
    font-size: 0.8125rem;
    color: var(--text-muted);
  }

  .persona-card__customise-link {
    font-size: 0.75rem;
    color: var(--amber-400);
    margin-left: 0.5rem;
    text-decoration: none;
  }

  .persona-card__customise-link:hover {
    text-decoration: underline;
  }

  .persona-card__group-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  .persona-card__group-chip {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    background: var(--bg-deep);
    border: 1px solid var(--border);
    border-radius: 3px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: border-color 0.15s var(--ease-out);
  }

  .persona-card__group-chip:hover {
    border-color: var(--amber-400);
    color: var(--text-primary);
  }

  .persona-card__group-chip-wrap {
    display: inline-flex;
    align-items: center;
    gap: 0;
  }

  .persona-card__group-remove {
    font-size: 0.75rem;
    line-height: 1;
    padding: 0.25rem 0.25rem;
    background: none;
    border: 1px solid var(--border);
    border-left: none;
    border-radius: 0 3px 3px 0;
    color: var(--text-muted);
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s, color 0.15s;
  }

  .persona-card__group-chip-wrap:hover .persona-card__group-remove {
    opacity: 1;
  }

  .persona-card__group-remove:hover {
    color: var(--failed);
  }

  .persona-card__group-chip-wrap .persona-card__group-chip {
    border-radius: 3px 0 0 3px;
  }

  .persona-card__assign-select {
    margin-top: 0.375rem;
  }

  .persona-card__actions {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding-top: 0.75rem;
    flex-wrap: wrap;
  }

  .persona-card__more {
    position: relative;
    margin-left: auto;
  }

  .persona-card__more-btn {
    font-size: 1rem;
    padding: 0.25rem 0.5rem;
  }

  .persona-card__menu {
    position: absolute;
    right: 0;
    top: 100%;
    z-index: 10;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 4px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    min-width: 160px;
    padding: 0.25rem 0;
  }

  .persona-card__menu-item {
    display: block;
    width: 100%;
    padding: 0.5rem 0.75rem;
    text-align: left;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-primary);
    background: none;
    border: none;
    cursor: pointer;
    transition: background 0.1s;
  }

  .persona-card__menu-item:hover {
    background: var(--bg-hover);
  }

  .persona-card__menu-item--danger {
    color: var(--failed);
  }

  .persona-card__qr {
    text-align: center;
    padding: 0.75rem 0;
  }

  .persona-card__qr-label {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.625rem;
    color: var(--text-muted);
    margin-top: 0.375rem;
  }

  .persona-card__meta {
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  /* ── Mobile ─────────────────────────────────────── */

  @media (max-width: 480px) {
    .id-hub { padding: 1rem 0.75rem 2rem; }

    .id-master__row {
      flex-direction: column;
      align-items: flex-start;
    }

    .id-master__actions {
      width: 100%;
    }

    .id-master__actions .btn {
      flex: 1;
      min-width: 0;
      text-align: center;
    }

    .id-create {
      flex-direction: column;
    }

    .id-create .input {
      width: 100%;
    }

    .persona-card__actions {
      flex-direction: column;
      align-items: stretch;
    }

    .persona-card__more {
      margin-left: 0;
    }

    .persona-card__menu {
      position: fixed;
      left: 0.75rem;
      right: 0.75rem;
      bottom: 0.75rem;
      top: auto;
      border-radius: 8px;
    }

    .persona-card__menu-item {
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
    }
  }
`;function _a(){let{identity:e,groups:t}=s(),n=e?.pubkey??``,r=n?`${n.slice(0,8)}\u2026${n.slice(-4)}`:`unknown`,i=Object.keys(t).length;return`
    <div class="id-nip07">
      <div class="id-nip07__card">
        <div class="id-nip07__header">
          <div class="id-nip07__icon">\u{1F511}</div>
          <div>
            <div style="font-weight: 600; font-size: 0.9375rem;">Your Identity</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${k(r)} \u00B7 NIP-07 extension \u00B7 ${i} group${i===1?``:`s`}</div>
          </div>
        </div>
      </div>

      <div class="id-nip07__why">
        <h3>Why can\u2019t I manage personas?</h3>
        <p>Your NIP-07 browser extension keeps your private key secure by never exposing it to apps. This is good security \u2014 but it means canary-kit cannot derive sub-identities from your key.</p>
        <p>Personas, Shamir backup, nsec export, and linkage proofs all require the raw private key for cryptographic derivation. Your extension only allows signing and encryption.</p>
        <p>To use persona features, create a new account with a recovery phrase or import an existing one.</p>
        <details>
          <summary>Technical detail</summary>
          <p style="margin: 0.5rem 0 0; line-height: 1.5;">nsec-tree derives child keys via <code>HMAC-SHA256(master_key, purpose)</code>. NIP-07 extensions expose <code>signEvent()</code> and <code>nip44.encrypt()</code> but not the raw key bytes. A future NIP could add <code>deriveChild(purpose, index)</code> to bridge this gap.</p>
        </details>
      </div>
    </div>
  `}function va(){let{groups:e,personas:t}=s(),n=Object.values(e);if(n.length===0)return``;let r=new Map;for(let e of n){let t=e.personaId||`(unassigned)`,n=r.get(t)??[];n.push(e),r.set(t,n)}let i=[];for(let[e,n]of r){let r=e===`(unassigned)`,a=(r?null:E(t,e))?.persona,o=a?.archived,s=a?.name??e,c=r?`<span style="color:var(--text-muted);font-style:italic;">unassigned</span>`:`<span${o?` style="opacity:0.5;"`:``}>${k(s)}</span>`,l=n.map(e=>`<button class="persona-card__group-chip" data-navigate-group="${k(e.id)}">${k(e.name)}</button>`).join(` `);i.push(`<div style="display:flex;align-items:baseline;gap:0.5rem;margin-bottom:0.375rem;flex-wrap:wrap;">
      <span style="font-size:0.75rem;min-width:5rem;">${c}</span>${l}
    </div>`)}return`
    <div style="margin-top:0.75rem;padding-top:0.75rem;border-top:1px solid var(--border);">
      <h4 class="persona-card__section-title" style="margin-bottom:0.5rem;">Groups</h4>
      ${i.join(``)}
    </div>
  `}function ya(){let{identity:e,personas:t,groups:n}=s();if(!e)return``;let r=0;for(let{persona:e}of Re(t))e.archived||r++;let i=Object.keys(n).length,a=!!e.mnemonic;return`
    <div class="id-master">
      <div class="id-master__row">
        <div class="id-master__stats">
          <span>${r} persona${r===1?``:`s`}</span>
          <span>\u00B7</span>
          <span>${i} group${i===1?``:`s`}</span>
          <span>\u00B7</span>
          <span>${a?`Backed up`:`No backup`}</span>
        </div>
        <div class="id-master__actions">
          ${a?`<button class="btn btn--sm" id="id-backup-btn">Backup</button>`:``}
          <button class="btn btn--sm" id="id-shamir-btn">Shamir</button>
          <button class="btn btn--sm" id="id-verify-proof-btn">Verify proof</button>
        </div>
      </div>
      ${a?`
        <div id="id-mnemonic" class="id-master__mnemonic${la?` id-master__mnemonic--revealed`:``}">${k(e.mnemonic??``)}</div>
        <span class="id-master__mnemonic-hint">${la?`Click to hide`:`Click to reveal recovery phrase`}</span>
      `:``}
      ${va()}
    </div>
  `}function ba(e){return e.length===0?``:`<div class="persona-card__breadcrumb">${e.map((t,n)=>{let r=n===e.length-1,i=k(t.name);return r?`<span class="persona-card__breadcrumb-current">${i}</span>`:`<span>${i}</span>`}).join(` <span class="persona-card__breadcrumb-sep">/</span> `)}</div>`}function xa(e){return`
    <div class="persona-card__section">
      <h4 class="persona-card__section-title">Profile</h4>
      <label class="persona-card__field">
        <span class="persona-card__field-label">Display name</span>
        <input class="input persona-card__input" type="text" data-field="displayName"
          value="${k(e.displayName??``)}" placeholder="Display name" />
      </label>
      <label class="persona-card__field">
        <span class="persona-card__field-label">About</span>
        <input class="input persona-card__input" type="text" data-field="about"
          value="${k(e.about??``)}" placeholder="Short bio" />
      </label>
      <label class="persona-card__field">
        <span class="persona-card__field-label">Picture URL</span>
        <input class="input persona-card__input" type="url" data-field="picture"
          value="${k(e.picture??``)}" placeholder="https://..." />
      </label>
      <button class="btn btn--sm btn--primary persona-card__publish-btn" id="id-detail-publish" hidden>
        Publish
      </button>
    </div>
  `}function Sa(e){let{settings:t}=s();if(!(e.readRelays&&e.readRelays.length>0||e.writeRelays&&e.writeRelays.length>0)&&!da)return`
      <div class="persona-card__section">
        <h4 class="persona-card__section-title">Relays</h4>
        <span class="persona-card__relay-default">Using default relays</span>
        <a href="#" class="persona-card__customise-link" id="id-detail-customise-relays">Customise</a>
      </div>
    `;let n=e.readRelays??t.defaultReadRelays??[],r=e.writeRelays??t.defaultWriteRelays??[];return`
    <div class="persona-card__section">
      <h4 class="persona-card__section-title">Relays</h4>
      <label class="persona-card__field">
        <span class="persona-card__field-label">Read relays</span>
        <input class="input persona-card__input" type="text" data-relay-field="read"
          value="${k(n.join(`, `))}" placeholder="wss://relay.example.com" />
      </label>
      <label class="persona-card__field">
        <span class="persona-card__field-label">Write relays</span>
        <input class="input persona-card__input" type="text" data-relay-field="write"
          value="${k(r.join(`, `))}" placeholder="wss://relay.example.com" />
      </label>
      <button class="btn btn--sm btn--primary" id="id-detail-save-relays">Save relays</button>
    </div>
  `}function Ca(e){let{groups:t,personas:n}=s(),r=Object.values(t),i=r.filter(t=>t.personaId===e.id),a=r.filter(t=>t.personaId!==e.id),o=i.map(e=>`
    <span class="persona-card__group-chip-wrap">
      <button class="persona-card__group-chip" data-navigate-group="${k(e.id)}">${k(e.name)}</button>
      <button class="persona-card__group-remove" data-unassign-group="${k(e.id)}"
        title="Unassign from this persona" aria-label="Unassign ${k(e.name)}">\u00D7</button>
    </span>
  `).join(``);function c(e){if(!e.personaId)return``;for(let{persona:t}of Re(n))if(t.id===e.personaId)return t.name;return``}let l=a.length>0?`<select class="input persona-card__assign-select" id="id-detail-assign" style="font-size:0.75rem;padding:0.25rem 0.375rem;">
        <option value="">+ Assign group\u2026</option>
        ${a.map(e=>{let t=c(e),n=t?` (${k(t)})`:``;return`<option value="${k(e.id)}">${k(e.name)}${n}</option>`}).join(``)}
      </select>`:``;return`
    <div class="persona-card__section">
      <h4 class="persona-card__section-title">Groups</h4>
      ${i.length>0?`<div class="persona-card__group-chips">${o}</div>`:`<span class="persona-card__meta">No groups assigned</span>`}
      ${l}
    </div>
  `}function wa(e){return`
    <div class="persona-card__actions">
      <button class="btn btn--sm" id="id-detail-export">Export nsec</button>
      <div class="persona-card__more">
        <button class="btn btn--sm persona-card__more-btn" id="id-detail-menu-btn"
          aria-label="More actions" title="More actions">\u22EF</button>
        ${Y?`
          <div class="persona-card__menu" id="id-detail-menu-panel">
            <button class="persona-card__menu-item" id="id-detail-copy-npub">Copy npub</button>
            <button class="persona-card__menu-item" id="id-detail-show-qr">
              ${ua?`Hide QR`:`Show QR`}
            </button>
            <button class="persona-card__menu-item" id="id-detail-rotate">Rotate</button>
            <button class="persona-card__menu-item" id="id-detail-prove">Prove ownership</button>
            <button class="persona-card__menu-item persona-card__menu-item--danger" id="id-detail-archive">Archive</button>
          </div>
        `:``}
      </div>
    </div>
    ${ua?`
      <div class="persona-card__qr">
        ${wr(e.npub,3)}
        <span class="persona-card__qr-label">${k(pa(e.npub))}</span>
      </div>
    `:``}
  `}function Ta(){let{personas:e}=s(),t=[...Re(e)].filter(({persona:e})=>!e.archived);if(t.length>0?J&&t.some(({persona:e})=>e.id===J)||(J=t[0].persona.id):J=null,!J)return`
      <div class="id-detail" id="id-detail">
        <div class="id-detail__hint">Select a persona from the tree above</div>
      </div>
    `;let n=E(e,J);if(!n)return`
      <div class="id-detail" id="id-detail">
        <div class="id-detail__hint">Select a persona from the tree above</div>
      </div>
    `;let{persona:r,ancestors:i}=n,a=Ke(r.name),o=k(r.name.slice(0,1).toUpperCase());return`
    <div class="id-detail" id="id-detail" data-detail-persona-id="${k(r.id)}">
      <div class="id-detail__header">
        <span class="persona-card__badge" style="background-color:${a}">${o}</span>
        <div>
          <div style="font-weight:600;font-size:0.9375rem;color:var(--text-primary);">${k(r.name)}</div>
          ${r.displayName?`<div style="font-size:0.8125rem;color:var(--text-secondary);">${k(r.displayName)}</div>`:``}
        </div>
      </div>
      ${ba([...i,r])}
      <div class="persona-card__npub">${k(r.npub)}</div>
      ${xa(r)}
      ${Sa(r)}
      ${Ca(r)}
      ${wa(r)}
    </div>
  `}function Ea(){return`
    <div class="id-create">
      <input class="input" type="text" id="id-new-name" placeholder="persona name" maxlength="32" autocomplete="off" style="flex: 1; min-width: 0;" />
      <button class="btn btn--primary btn--sm" id="id-create-btn">+ Create persona</button>
    </div>
    <div class="id-create__error" id="id-create-error"></div>
  `}function Da(){let{personas:e}=s(),t=[...Re(e)].filter(({persona:e})=>e.archived).map(({persona:e})=>e);if(t.length===0)return``;let n=t.map(e=>`
      <div class="id-archived__row">
        <span class="id-archived__badge" style="background: var(--text-muted);">${k(e.name.slice(0,1).toUpperCase())}</span>
        <span class="id-archived__name">${k(e.name)}</span>
        <span class="id-archived__npub">${k(pa(e.npub))}</span>
        <button class="btn btn--sm" data-restore-persona="${k(e.id)}">Restore</button>
      </div>
    `).join(``);return`
    <hr class="id-divider" />
    <div>
      <button class="id-archived__toggle" id="id-archived-toggle">
        <span>${ca?`▼`:`▶`}</span>
        <span>Archived (${t.length})</span>
      </button>
      <div class="id-archived__list" id="id-archived-list" style="max-height: ${ca?`1000px`:`0`};">
        ${n}
      </div>
    </div>
  `}function X(e){fa?.abort(),fa=new AbortController;let{signal:t}=fa;if(e.textContent=``,!document.getElementById(`id-hub-styles`)){let e=document.createElement(`style`);e.id=`id-hub-styles`,e.textContent=ga,document.head.appendChild(e)}if(!Ne()){let t=document.createElement(`div`);t.className=`id-hub`,t.innerHTML=_a(),e.appendChild(t);return}let n=document.createElement(`div`);n.className=`id-hub`,n.innerHTML=[`<h1 class="id-hub__heading">Identities</h1>`,`<div class="id-hub__sub">Derived from your master key</div>`,ya(),ia(J),Ta(),Ea(),Da()].join(``),e.appendChild(n),aa(e),document.addEventListener(`canary:select-persona`,(t=>{let{personaId:n}=t.detail;n!==J&&(J=n,Y=!1,ua=!1,da=!1,X(e))}),{signal:t});let r=e.querySelector(`#id-backup-btn`),i=e.querySelector(`#id-mnemonic`),o=i?.nextElementSibling;function l(){i&&(la=!la,i.classList.toggle(`id-master__mnemonic--revealed`,la),o&&(o.textContent=la?`Click to hide`:`Click to reveal recovery phrase`))}r?.addEventListener(`click`,l,{signal:t}),i?.addEventListener(`click`,l,{signal:t}),e.querySelector(`#id-shamir-btn`)?.addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:shamir-split`,{bubbles:!0}))},{signal:t}),e.querySelector(`#id-verify-proof-btn`)?.addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:verify-proof`,{bubbles:!0}))},{signal:t});let u=e.querySelector(`#id-detail`);if(u&&J){let n=J;u.addEventListener(`input`,e=>{if(!e.target.dataset.field)return;let{personas:t}=s(),r=E(t,n);if(!r)return;let i=u.querySelector(`#id-detail-publish`);i&&(i.hidden=!ha(r.persona,u))},{signal:t}),u.querySelector(`#id-detail-publish`)?.addEventListener(`click`,()=>{let{personas:e}=s(),t=E(e,n);if(!t)return;let r=u.querySelector(`[data-field="displayName"]`),i=u.querySelector(`[data-field="about"]`),o=u.querySelector(`[data-field="picture"]`);a({personas:ka(e,n,{...t.persona,displayName:r?.value||void 0,about:i?.value||void 0,picture:o?.value||void 0})}),O(`Profile saved for "${t.persona.name}"`,`success`)},{signal:t}),u.querySelector(`#id-detail-customise-relays`)?.addEventListener(`click`,t=>{t.preventDefault(),da=!0,X(e)},{signal:t}),u.querySelector(`#id-detail-save-relays`)?.addEventListener(`click`,()=>{let e=u.querySelector(`[data-relay-field="read"]`),t=u.querySelector(`[data-relay-field="write"]`),r=(e?.value??``).split(`,`).map(e=>e.trim()).filter(Boolean),i=(t?.value??``).split(`,`).map(e=>e.trim()).filter(Boolean),{personas:o}=s(),c=E(o,n);c&&(a({personas:ka(o,n,{...c.persona,readRelays:r,writeRelays:i})}),da=!1,O(`Relays saved for "${c.persona.name}"`,`success`))},{signal:t}),u.addEventListener(`click`,t=>{let n=t.target.closest(`[data-navigate-group]`);if(n){let e=n.dataset.navigateGroup;a({view:`groups`,activeGroupId:e});return}let r=t.target.closest(`[data-unassign-group]`);if(r){t.stopPropagation();let e=r.dataset.unassignGroup,{groups:n}=s(),i=n[e];if(!i)return;c(e,{personaId:``}),O(`"${i.name}" unassigned`,`info`);return}if(Y){let n=t.target.closest(`#id-detail-menu-panel`),r=t.target.closest(`#id-detail-menu-btn`);!n&&!r&&(Y=!1,X(e))}},{signal:t}),u.querySelector(`#id-detail-assign`)?.addEventListener(`change`,e=>{let t=e.target,r=t.value;if(!r)return;let{groups:i,personas:a}=s(),o=i[r];if(!o)return;c(r,{personaId:n});let l=E(a,n);O(`"${o.name}" assigned to ${l?.persona.name??n}`,`success`),t.value=``},{signal:t}),u.querySelector(`#id-detail-export`)?.addEventListener(`click`,()=>{let{personas:t}=s();E(t,n)&&e.dispatchEvent(new CustomEvent(`canary:export-persona`,{bubbles:!0,detail:{personaId:n}}))},{signal:t}),u.querySelector(`#id-detail-menu-btn`)?.addEventListener(`click`,()=>{Y=!Y,X(e)},{signal:t}),u.querySelector(`#id-detail-copy-npub`)?.addEventListener(`click`,()=>{let{personas:t}=s(),r=E(t,n);r&&(navigator.clipboard.writeText(r.persona.npub).then(()=>{O(`npub copied`,`success`)}).catch(()=>{}),Y=!1,X(e))},{signal:t}),u.querySelector(`#id-detail-show-qr`)?.addEventListener(`click`,()=>{ua=!ua,Y=!1,X(e)},{signal:t}),u.querySelector(`#id-detail-rotate`)?.addEventListener(`click`,()=>{let{personas:t}=s();E(t,n)&&(Y=!1,e.dispatchEvent(new CustomEvent(`canary:rotate-persona`,{bubbles:!0,detail:{personaId:n}})))},{signal:t}),u.querySelector(`#id-detail-prove`)?.addEventListener(`click`,()=>{let{personas:t}=s();E(t,n)&&(Y=!1,e.dispatchEvent(new CustomEvent(`canary:prove-ownership`,{bubbles:!0,detail:{personaId:n}})))},{signal:t}),u.querySelector(`#id-detail-archive`)?.addEventListener(`click`,()=>{let{personas:t}=s();E(t,n)&&(Y=!1,e.dispatchEvent(new CustomEvent(`canary:archive-persona`,{bubbles:!0,detail:{personaId:n}})))},{signal:t})}e.querySelector(`.id-master`)?.addEventListener(`click`,e=>{let t=e.target.closest(`[data-navigate-group]`);if(t){let e=t.dataset.navigateGroup;a({view:`groups`,activeGroupId:e})}},{signal:t});let d=e.querySelector(`#id-new-name`),f=e.querySelector(`#id-create-btn`),p=e.querySelector(`#id-create-error`);function m(){if(!d||!p)return;let e=d.value.trim();if(!ma(e)){p.textContent=`Lowercase, no spaces, max 32 characters.`;return}let{personas:t}=s();if(Object.values(t).some(t=>t.name===e)){p.textContent=`That name is already taken.`;return}try{let n=Pe(e);a({personas:{...t,[n.id]:n}}),d.value=``,p.textContent=``,J=n.id,Y=!1,ua=!1,da=!1}catch(e){p.textContent=e instanceof Error?e.message:`Failed to create persona.`}}f?.addEventListener(`click`,m,{signal:t}),d?.addEventListener(`keydown`,e=>{e.key===`Enter`&&m()},{signal:t});let h=e.querySelector(`#id-archived-toggle`),g=e.querySelector(`#id-archived-list`);h&&g&&h.addEventListener(`click`,()=>{ca=!ca,g.style.maxHeight=ca?g.scrollHeight+`px`:`0`;let e=h.querySelector(`span`);e&&(e.textContent=ca?`▼`:`▶`)},{signal:t}),e.addEventListener(`click`,e=>{let t=e.target.closest(`[data-restore-persona]`);if(!t)return;let n=t.dataset.restorePersona,{personas:r}=s();E(r,n)&&a({personas:Oa(r,n,!1)})},{signal:t})}function Oa(e,t,n){let r={};for(let[i,a]of Object.entries(e))i===t?r[i]={...a,archived:n}:a.children&&Object.keys(a.children).length>0?r[i]={...a,children:Oa(a.children,t,n)}:r[i]=a;return r}function ka(e,t,n){let r={};for(let[i,a]of Object.entries(e))i===t?r[i]=n:a.children&&Object.keys(a.children).length>0?r[i]={...a,children:ka(a.children,t,n)}:r[i]=a;return r}var Aa=null;function ja(e,t){let n=s().groups[t];if(!n)return e.slice(0,8);let{identity:r}=s();return r?.pubkey===e?`You`:n.memberNames?.[e]||`${e.slice(0,8)}\u2026${e.slice(-4)}`}function Ma(e,t){Aa&&=(Aa(),null),document.querySelector(`.call-verify`)?.remove();let{groups:n,identity:r}=s(),i=n[e];if(!i||!r)return;let a=r.pubkey,o=ja(t,e),c=Ze(t),l=a<t?[a,t]:[t,a],u=Bi({secret:i.seed,namespace:`canary:call`,roles:l,myRole:a,preset:`call`}),d=zi.call.rotationSeconds,f=Math.floor(Date.now()/1e3),p=u.myToken(f),m=u.theirToken(f),h=document.createElement(`div`);h.className=`call-verify`,h.innerHTML=`
    <div class="call-verify__content">
      ${c?.picture?`<img class="call-verify__avatar" src="${k(c.picture)}" alt="" />`:``}
      <h2 class="call-verify__title">Call with ${k(o)}</h2>
      <p class="call-verify__instruction">Speak your word. Listen for theirs. If it matches, the call is verified.</p>

      <div class="call-verify__section call-verify__section--say">
        <span class="call-verify__label">Say this:</span>
        <span class="call-verify__word call-verify__word--mine" id="cv-word-mine">${k(p)}</span>
      </div>

      <div class="call-verify__divider"></div>

      <div class="call-verify__section call-verify__section--hear">
        <span class="call-verify__label">They should say:</span>
        <span class="call-verify__word call-verify__word--theirs" id="cv-word-theirs">${k(m)}</span>
      </div>

      <p class="call-verify__timer">Words change in <span id="cv-countdown">${d}</span>s</p>

      <p class="call-verify__instruction" style="margin-top: 1.5rem; font-size: 0.75rem;">In a real call, if they say the wrong word, it could be an emergency signal. A production app would automatically check and silently alert the group.</p>
      <div class="call-verify__actions">
        <button class="btn btn--primary call-verify__btn" id="cv-match">Match</button>
        <button class="btn call-verify__btn call-verify__btn--danger" id="cv-mismatch">Wrong Word</button>
        <button class="btn call-verify__btn" id="cv-close">Close</button>
      </div>
    </div>
  `;let g=null;function _(){let e=Math.floor(Date.now()/1e3),t=h.querySelector(`#cv-word-mine`),n=h.querySelector(`#cv-word-theirs`),r=h.querySelector(`#cv-countdown`);if(t&&(t.textContent=u.myToken(e)),n&&(n.textContent=u.theirToken(e)),r){let t=e%d;r.textContent=String(d-t)}}g=setInterval(_,1e3);function v(){g!==null&&(clearInterval(g),g=null)}function y(){Aa&&=(Aa(),null),h.classList.remove(`call-verify--visible`),setTimeout(()=>h.remove(),300)}function b(e){e.key===`Escape`&&y()}Aa=()=>{v(),document.removeEventListener(`keydown`,b)},document.body.appendChild(h),requestAnimationFrame(()=>h.classList.add(`call-verify--visible`)),document.addEventListener(`keydown`,b),h.querySelector(`#cv-match`)?.addEventListener(`click`,()=>{v(),h.innerHTML=`
      <div class="call-verify__content">
        <h2 class="call-verify__title" style="color: var(--clr-success, #27ae60);">Call Verified</h2>
        <p class="call-verify__warning" style="color: var(--text-secondary);">${k(o)} is who they say they are. The call is authenticated.</p>
        <div class="call-verify__actions">
          <button class="btn btn--primary call-verify__btn" id="cv-dismiss-ok">Done</button>
        </div>
      </div>
    `,h.querySelector(`#cv-dismiss-ok`)?.addEventListener(`click`,y)}),h.querySelector(`#cv-close`)?.addEventListener(`click`,y),h.querySelector(`#cv-mismatch`)?.addEventListener(`click`,()=>{v(),h.innerHTML=`
      <div class="call-verify__content">
        <h2 class="call-verify__title" style="color: var(--clr-danger, #e74c3c);">Verification Failed</h2>
        <p class="call-verify__warning">The word didn't match. This person may not be who they claim to be.</p>
        <div class="call-verify__actions">
          <button class="btn call-verify__btn" id="cv-dismiss-fail">Dismiss</button>
        </div>
      </div>
    `,h.querySelector(`#cv-dismiss-fail`)?.addEventListener(`click`,y)})}var Na=ot({VAULT_D_TAG:()=>Pa,VAULT_KIND:()=>Z,buildVaultEvent:()=>Va,decryptVault:()=>Ba,deserialiseVault:()=>Ra,encryptVault:()=>za,fetchVault:()=>Ua,fetchVaultNip07:()=>Ka,mergeVaultGroups:()=>Za,publishVault:()=>Ha,publishVaultNip07:()=>Ga,serialiseVault:()=>La,subscribeToVault:()=>Ya,unsubscribeFromVault:()=>Xa}),Z=30078,Pa=`canary:vault`,Fa=2160*60*60;function Ia(e){let t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function La(e,t={},n=[]){let r={};for(let[t,n]of Object.entries(e)){let{lastPositions:e,...i}=n;r[t]={...i,livenessCheckins:{}}}let i={version:3,groups:r,personas:t,deletedGroupIds:n};return JSON.stringify(i)}function Ra(e){try{let t=JSON.parse(e);if(!t||typeof t!=`object`||typeof t.groups!=`object`||t.groups===null)return{groups:{},personas:{},deletedGroupIds:[]};if(t.version===3)return{groups:t.groups,personas:t.personas&&typeof t.personas==`object`&&!Array.isArray(t.personas)?t.personas:{},deletedGroupIds:Array.isArray(t.deletedGroupIds)?t.deletedGroupIds:[]};console.info(`[canary:vault] Migrating vault from version`,t.version??1,`to v3`);let n=t.groups;for(let e of Object.values(n))!e.personaName&&!e.personaId&&(e.personaName=`personal`);let r=Array.isArray(t.personas)?t.personas:[],i={},a={};for(let e of r){let t=ze();a[e.name]=t,i[t]={...e,id:t,children:{}}}for(let e of Object.values(n)){let t=e.personaName??`personal`;if(!a[t]){let e=ze();a[t]=e,i[e]={name:t,id:e,index:0,npub:``,children:{}}}e.personaId||(e.personaId=a[t],delete e.personaName)}return{groups:n,personas:i,deletedGroupIds:Array.isArray(t.deletedGroupIds)?t.deletedGroupIds:[]}}catch{return{groups:{},personas:{},deletedGroupIds:[]}}}function za(e,t,n){return le(e,w(Ia(t),n))}function Ba(e,t,n){try{return ue(e,w(Ia(t),n))}catch{return null}}function Va(e,t){let n=Ia(t),r=Math.floor(Date.now()/1e3);return ce({kind:Z,created_at:r,tags:[[`d`,Pa],[`expiration`,String(r+Fa)]],content:e},n)}async function Ha(e,t,n,r={},i=[]){let a=D();if(!a)throw Error(`No relay pool — connect first`);let o=Ue();if(o.length===0)throw Error(`No write relays configured`);let s=Va(za(La(e,r,i),t,n),t);console.info(`[canary:vault] Publishing vault (${Object.keys(e).length} groups) to`,o),document.dispatchEvent(new CustomEvent(`canary:vault-syncing`));let c=await Promise.allSettled(a.publish(o,s)),l=c.filter(e=>e.status===`fulfilled`).length,u=c.filter(e=>e.status===`rejected`).length;console.info(`[canary:vault] Publish results: ${l} OK, ${u} failed`),u>0&&c.forEach((e,t)=>{e.status===`rejected`&&console.warn(`[canary:vault] Relay ${o[t]} rejected:`,e.reason)}),document.dispatchEvent(new CustomEvent(`canary:vault-synced`,{detail:{timestamp:Math.floor(Date.now()/1e3)}}))}async function Ua(e,t){let n=D();if(!n)return console.warn(`[canary:vault] fetchVault: no pool`),null;let r=Ve();return r.length===0?(console.warn(`[canary:vault] fetchVault: no read relays`),null):(console.info(`[canary:vault] Fetching vault from`,r,`for`,t.slice(0,8)),new Promise(i=>{let a=!1,o=null,s=setTimeout(()=>{if(!a){if(a=!0,c.close(),console.warn(`[canary:vault] fetchVault timed out after 10s`),o){let n=Ba(o.content,e,t);if(n){let e=Ra(n);if(Object.keys(e.groups).length>0){i(e);return}}}i(null)}},1e4),c=n.subscribeMany(r,{kinds:[Z],authors:[t],"#d":[Pa],limit:1},{onevent(e){oe(e)&&(typeof e.content==`string`&&e.content.length>262144||(console.info(`[canary:vault] Received vault event created_at=${e.created_at}`),(!o||e.created_at>o.created_at)&&(o=e)))},oneose(){if(!a){if(a=!0,clearTimeout(s),c.close(),o){console.info(`[canary:vault] EOSE — decrypting vault event`);let n=Ba(o.content,e,t);if(n){let e=Ra(n);if(Object.keys(e.groups).length>0){i(e);return}}console.warn(`[canary:vault] Vault decryption failed`)}else console.info(`[canary:vault] EOSE — no vault event found`);i(null)}}})}))}function Wa(){return!!window.nostr?.nip44?.encrypt&&!!window.nostr?.nip44?.decrypt}async function Ga(e,t,n={},r=[]){let i=D();if(!i)throw Error(`No relay pool — connect first`);if(!Wa())throw Error(`NIP-07 extension does not support NIP-44`);let a=Ue();if(a.length===0)throw Error(`No write relays configured`);let o=La(e,n,r),s=await window.nostr.nip44.encrypt(t,o),c=Math.floor(Date.now()/1e3),l={kind:Z,created_at:c,tags:[[`d`,Pa],[`expiration`,String(c+Fa)]],content:s},u=await window.nostr.signEvent(l);console.info(`[canary:vault] Publishing vault via NIP-07 (${Object.keys(e).length} groups) to`,a),document.dispatchEvent(new CustomEvent(`canary:vault-syncing`));let d=await Promise.allSettled(i.publish(a,u)),f=d.filter(e=>e.status===`fulfilled`).length,p=d.filter(e=>e.status===`rejected`).length;console.info(`[canary:vault] NIP-07 publish results: ${f} OK, ${p} failed`),document.dispatchEvent(new CustomEvent(`canary:vault-synced`,{detail:{timestamp:c}}))}async function Ka(e){let t=D();if(!t)return console.warn(`[canary:vault] fetchVaultNip07: no pool`),null;if(!Wa())return console.warn(`[canary:vault] fetchVaultNip07: extension lacks NIP-44`),null;let n=Ve();return n.length===0?(console.warn(`[canary:vault] fetchVaultNip07: no read relays`),null):(console.info(`[canary:vault] Fetching vault via NIP-07 from`,n,`for`,e.slice(0,8)),new Promise(r=>{let i=!1,a=null,o=setTimeout(async()=>{if(!i){if(i=!0,s.close(),console.warn(`[canary:vault] fetchVaultNip07 timed out after 10s`),a)try{let t=Ra(await window.nostr.nip44.decrypt(e,a.content));if(Object.keys(t.groups).length>0){r(t);return}}catch{}r(null)}},1e4),s=t.subscribeMany(n,{kinds:[Z],authors:[e],"#d":[Pa],limit:1},{onevent(e){oe(e)&&(typeof e.content==`string`&&e.content.length>262144||(console.info(`[canary:vault] NIP-07 received vault event created_at=${e.created_at}`),(!a||e.created_at>a.created_at)&&(a=e)))},async oneose(){if(!i){if(i=!0,clearTimeout(o),s.close(),a){console.info(`[canary:vault] NIP-07 EOSE — decrypting vault event`);try{let t=Ra(await window.nostr.nip44.decrypt(e,a.content));if(Object.keys(t.groups).length>0){r(t);return}}catch(e){console.warn(`[canary:vault] NIP-07 vault decryption failed:`,e)}}else console.info(`[canary:vault] NIP-07 EOSE — no vault event found`);r(null)}}})}))}var qa=null,Ja=0;function Ya(e,t,n){Xa();let r=D();if(!r)return;let i=Ve();if(i.length===0)return;Ja=Math.floor(Date.now()/1e3),console.info(`[canary:vault] Subscribing to live vault updates for`,e.slice(0,8));let a=r.subscribeMany(i,{kinds:[Z],authors:[e],"#d":[Pa],since:Ja},{async onevent(e){if(oe(e)&&!(e.created_at<=Ja)&&!(typeof e.content==`string`&&e.content.length>262144)){console.info(`[canary:vault] Live vault update received created_at=${e.created_at}`),Ja=e.created_at;try{let r=await t(e.content);if(!r)return;let{groups:i,personas:a}=Ra(r);if(Object.keys(i).length===0)return;n(i,Object.keys(i).length,a)}catch(e){console.warn(`[canary:vault] Live vault decrypt failed:`,e)}}},oneose(){console.info(`[canary:vault] Live vault subscription EOSE — watching for updates`)}});qa=()=>a.close()}function Xa(){qa?.(),qa=null}function Za(e,t,n=[]){let r={...e},i=new Set(n);for(let[n,a]of Object.entries(t)){if(i.has(n))continue;let t=e[n];if(!t){r[n]=a;continue}let o=t.epoch??0,s=a.epoch??0;if(s>o)r[n]=a;else if(s===o){let e=t.counter??0;(a.counter??0)>e&&(r[n]=a)}}return r}function Qa(e){if(e.startsWith(`wss://`))return!0;if(e.startsWith(`ws://`))try{let t=new URL(e);return t.hostname===`localhost`||t.hostname===`127.0.0.1`||t.hostname===`[::1]`}catch{return!1}return!1}function $a(e,t){return t?.pubkey===e.pubkey&&t.mnemonic?{...e,mnemonic:t.mnemonic}:e}function eo(e,t){return e?typeof t.epoch==`number`&&t.epoch<e.epoch?`This invite is older than the group state already stored on this device.`:typeof t.latestInviteIssuedAt==`number`&&e.latestInviteIssuedAt>0&&t.latestInviteIssuedAt<e.latestInviteIssuedAt?`A newer invite has already been accepted for this group on this device.`:typeof t.epoch==`number`&&t.epoch===e.epoch&&typeof t.counter==`number`&&t.counter<e.counter?`This invite would roll the group back to an older counter.`:null:null}ie(),p().theme===`light`?document.documentElement.setAttribute(`data-theme`,`light`):document.documentElement.removeAttribute(`data-theme`);var Q=null;function to(){Q!==null&&(clearTimeout(Q),Q=null);let{settings:e}=s();!e.pinEnabled||e.autoLockMinutes<=0||!ne()||(Q=setTimeout(async()=>{await d(),Fe(),y(),l(),io()},e.autoLockMinutes*60*1e3))}function no(){document.addEventListener(`pointerdown`,to,{passive:!0}),document.addEventListener(`keydown`,to,{passive:!0}),to()}function ro(){document.removeEventListener(`pointerdown`,to),document.removeEventListener(`keydown`,to),Q!==null&&(clearTimeout(Q),Q=null)}function io(){ro(),m();let e=document.getElementById(`app`);e.innerHTML=`
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
  `;let t=document.getElementById(`pin-input`),n=document.getElementById(`pin-error`),r=document.getElementById(`pin-submit`),i=0,a=[0,1e3,2e3,5e3,15e3,3e4];async function c(){let e=t.value.trim();if(e.length<6){n.textContent=`PIN must be at least 6 digits.`,n.hidden=!1,t.focus();return}r.disabled=!0,r.textContent=`Unlocking…`,n.hidden=!0;try{await u(e),await vo();{let{identity:e,personas:t}=s();e?.privkey&&(Object.keys(t).length>0?Me(e,t):Ie(e))}ao();let t=document.getElementById(`header`);t&&te(t),oo(),lo(),o(co),no(),_o(),fo(),window.addEventListener(`hashchange`,()=>fo()),bo(),Qe().catch(()=>{})}catch{i++;let e=a[Math.min(i,a.length-1)];n.textContent=e>0?`Incorrect PIN. Wait ${e/1e3}s before retrying.`:`Incorrect PIN. Try again.`,n.hidden=!1,t.value=``,r.disabled=!0,r.textContent=`Unlock`,e>0?setTimeout(()=>{r.disabled=!1,t.focus()},e):(r.disabled=!1,t.focus())}}r.addEventListener(`click`,()=>{c()}),t.addEventListener(`keydown`,e=>{e.key===`Enter`&&c()}),requestAnimationFrame(()=>t.focus())}function ao(){let e=document.getElementById(`app`);if(!e)throw Error(`Missing #app mount point`);e.innerHTML=`
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
      <span class="app-footer__version">CANARY v2.5.2</span>
    </footer>
  `}function oo(){let e=document.getElementById(`hamburger`),t=document.getElementById(`sidebar`),n=document.getElementById(`sidebar-overlay`);if(!e||!t||!n)return;function r(){t.classList.add(`sidebar--open`),n.classList.add(`sidebar-overlay--visible`),e.setAttribute(`aria-expanded`,`true`)}function i(){t.classList.remove(`sidebar--open`),n.classList.remove(`sidebar-overlay--visible`),e.setAttribute(`aria-expanded`,`false`)}e.setAttribute(`aria-expanded`,`false`),e.addEventListener(`click`,()=>{t.classList.contains(`sidebar--open`)?i():r()}),n.addEventListener(`click`,()=>{i()}),t.addEventListener(`click`,e=>{e.target.closest(`[data-group-id]`)&&i()})}var so=!1;function co(){so||(so=!0,requestAnimationFrame(()=>{so=!1,lo()}))}function lo(){let{view:t}=s(),n=document.getElementById(`groups-view`),r=document.getElementById(`call-demo-view`),i=document.getElementById(`identities-view`);n&&(n.hidden=t!==`groups`),r&&(r.hidden=t!==`call-demo`),i&&(i.style.display=t===`identities`?``:`none`);let a=document.getElementById(`header`);if(a&&te(a),t===`groups`){$i();let t=document.getElementById(`welcome-container`);t&&Bt(t);let n=document.getElementById(`sidebar`);n&&ft(n);let r=document.getElementById(`hero-container`);r&&nn(r);let i=document.getElementById(`verify-container`);i&&gn(i);let a=document.getElementById(`members-container`);a&&Br(a);let o=s().groups[s().activeGroupId??``],c=o?e(o)===`online`:!1,l=document.getElementById(`beacon-container`);l&&(c?(l.hidden=!1,pi(l)):(wi(),l.hidden=!0,l.innerHTML=``));let u=document.getElementById(`liveness-container`);u&&(c?(u.hidden=!1,ki(u)):(u.hidden=!0,u.innerHTML=``));let d=document.getElementById(`settings-container`);d&&Ni(d)}else if(t===`call-demo`){let e=document.getElementById(`call-simulation-container`);e&&Qi(e)}else if(t===`identities`){$i();let e=document.getElementById(`identities-view`);e&&X(e)}}function uo(){let{identity:t,personas:n,activePersonaId:i}=s(),a=t?.displayName&&t.displayName!==`You`?t.displayName:``,o=Object.values(n),l=o.length>0?o.map(e=>{let t=e.id===i?` selected`:``;return`<option value="${k(e.id)}"${t}>${k(e.name)}</option>`}).join(``):`<option value="">—</option>`;mt(`
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
      <select class="input" name="persona">${l}</select>
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
  `,n=>{let i=n.get(`name`)?.trim()??``;if(!i)return;let o=a||n.get(`myname`)?.trim()||``,l=n.get(`persona`)?.trim()||``,u=jt(i,document.querySelector(`.segmented__btn.segmented__btn--active[data-preset]`)?.dataset.preset??`family`,t?.pubkey,l);if(o&&t?.pubkey){let e=s().groups[u];e&&c(u,{memberNames:{...e.memberNames,[t.pubkey]:o}})}let d=s().groups[u];d&&e(d)===`online`&&r(d).length>0&&f(d.readRelays??[],d.writeRelays??[],u),$(),C(async()=>{let{shouldPromptForNotifications:e,shouldPromptAddToHomeScreen:t,isMacSafari:n,subscribeToPush:r,registerWithPushServer:i}=await import(`./push-BPPbJwyP.js`);return{shouldPromptForNotifications:e,shouldPromptAddToHomeScreen:t,isMacSafari:n,subscribeToPush:r,registerWithPushServer:i}},[],import.meta.url).then(({shouldPromptForNotifications:e,shouldPromptAddToHomeScreen:t,isMacSafari:n,subscribeToPush:r,registerWithPushServer:i})=>{if(t()){setTimeout(()=>{Eo()},1500);return}if(n()&&!(`Notification`in window)){console.info(`[canary:push] Mac Safari without notification support — skipping prompt`);return}e()&&setTimeout(()=>{To(async()=>{try{let e=await r();if(!e){console.warn(`[canary:push] subscribeToPush returned null — permission denied or unavailable`);return}let{hashGroupTag:t}=await C(async()=>{let{hashGroupTag:e}=await import(`./sync-CTwt-KD4.js`);return{hashGroupTag:e}},__vite__mapDeps([3,4,5,6,7,8]),import.meta.url),{groups:n}=s(),a=Object.values(n).map(e=>({tagHash:t(e.id),livenessInterval:e.livenessInterval}));await i(e,a),console.info(`[canary:push] Registered with push server, groups:`,a.length),O(`Notifications enabled`,`success`)}catch(e){console.error(`[canary:push] Registration failed:`,e),O(`Failed to enable notifications`,`error`)}})},1500)}).catch(e=>console.error(`[canary:push] Import failed:`,e))}),requestAnimationFrame(()=>{document.getElementById(`modal-cancel-btn`)?.addEventListener(`click`,()=>{document.getElementById(`app-modal`)?.close()}),document.querySelectorAll(`.segmented__btn[data-preset]`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.segmented__btn[data-preset]`).forEach(e=>e.classList.remove(`segmented__btn--active`)),e.classList.add(`segmented__btn--active`)})})})}function fo(){let e=window.location.hash;if(e.startsWith(`#ack/`)){let t;try{t=decodeURIComponent(e.slice(5))}catch{console.warn(`[canary] Malformed ack fragment — ignoring.`),window.location.hash=``;return}window.location.hash=``,document.dispatchEvent(new CustomEvent(`canary:confirm-member`,{detail:{token:t}}))}else if(e.startsWith(`#inv/`)){let t=e.slice(5);window.location.hash=``,po(t)}else if(e.startsWith(`#j/`)){let t=e.slice(3);window.location.hash=``,/^[0-9a-f]{32}$/.test(t)?ho(t):O(`Invalid invite link.`,`error`)}else if(e.startsWith(`#remote/`)){let t=e.slice(8);try{t=decodeURIComponent(t)}catch{}window.location.hash=``,go(t)}}function po(e){try{let t=ur(Sn(e)),{identity:r}=s();if(!r?.pubkey){O(`No local identity — create or import one first.`,`error`);return}let o=document.getElementById(`binary-join-modal`);o||(o=document.createElement(`dialog`),o.id=`binary-join-modal`,o.className=`modal`,document.body.appendChild(o),o.addEventListener(`click`,e=>{e.target===o&&o.close()}));let c=o;c.innerHTML=`
      <div class="modal__form invite-share">
        <h2 class="modal__title">Join ${k(t.groupName)}</h2>
        <p class="invite-hint">Invited by <code>${k(t.inviterPubkey.slice(0,8))}\u2026</code></p>
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
    `,c.querySelector(`#binary-join-cancel`)?.addEventListener(`click`,()=>c.close()),c.querySelector(`#binary-join-accept`)?.addEventListener(`click`,()=>{let e=c.querySelector(`#binary-join-confirm`),o=c.querySelector(`#binary-join-error`),l=e?.value.trim()??``;if(!l){o&&(o.textContent=`Please enter the confirmation words.`,o.style.display=``);return}try{let e=Wn(_n(t),l);if(Gn(e.groupId,e.nonce))throw Error(`This invite has already been used.`);let o=e.groupId,{groups:u}=s(),p=eo(u[o],{epoch:e.epoch,counter:e.counter,latestInviteIssuedAt:e.issuedAt});if(p)throw Error(p);let m=new Set(e.members);m.add(r.pubkey);let h=s().settings,g=e.relays.length>0?e.relays:h.defaultWriteRelays?.length?[...h.defaultWriteRelays]:[i],_=Array.from(new Set([...h.defaultReadRelays?.length?h.defaultReadRelays:n,...g])),y=g.length>0,b={id:o,name:e.groupName,seed:e.seed,members:Array.from(m),memberNames:e.memberNames??{},nostrEnabled:y,relays:e.relays,readRelays:_,writeRelays:g,wordlist:e.wordlist,wordCount:e.wordCount,counter:e.counter,usageOffset:e.usageOffset,rotationInterval:e.rotationInterval,encodingFormat:e.encodingFormat,usedInvites:[e.nonce],latestInviteIssuedAt:e.issuedAt,beaconInterval:e.beaconInterval,beaconPrecision:e.beaconPrecision,duressMode:`immediate`,livenessInterval:e.rotationInterval,livenessCheckins:{},tolerance:e.tolerance,personaId:s().activePersonaId??``,createdAt:Math.floor(Date.now()/1e3),admins:[...e.admins],epoch:e.epoch,consumedOps:[]};a({groups:{...u,[o]:b},activeGroupId:o}),Kn(o,e.nonce),d(),$(),y&&r&&f(_,g,o).then(()=>{v(o,{type:`member-join`,pubkey:r.pubkey,displayName:r.displayName&&r.displayName!==`You`?r.displayName:void 0,timestamp:Math.floor(Date.now()/1e3),epoch:e.epoch,opId:crypto.randomUUID()})}),c.close(),O(`Joined ${e.groupName}`,`success`)}catch(e){o&&(o.textContent=e instanceof Error?e.message:`Failed to join group.`,o.style.display=``)}}),c.showModal()}catch(e){O(e instanceof Error?e.message:`Invalid QR invite.`,`error`)}}function mo(e,t,r){let{identity:o}=s();if(!o?.pubkey||!o?.privkey)return;let c=An({envelope:e,joinerPrivkey:o.privkey,adminPubkey:t.adminPubkey,expectedInviteId:t.inviteId}),l=c.groupId,{groups:u}=s(),p=eo(u[l],{epoch:c.epoch,counter:c.counter});if(p)throw Error(p);let m=new Set(c.members);m.add(o.pubkey);let h={...c.memberNames??{}};o.displayName&&o.displayName!==`You`&&(h[o.pubkey]=o.displayName);let g=[...c.relays??[]],_=g.length>0?g:[i],y=Array.from(new Set([...n,..._])),b=_.length>0,x={id:l,name:c.groupName,seed:c.seed,members:Array.from(m),memberNames:h,nostrEnabled:b,relays:g,readRelays:y,writeRelays:_,wordlist:c.wordlist,wordCount:c.wordCount,counter:c.counter,usageOffset:c.usageOffset,rotationInterval:c.rotationInterval,encodingFormat:c.encodingFormat,usedInvites:[],latestInviteIssuedAt:0,beaconInterval:c.beaconInterval,beaconPrecision:c.beaconPrecision,duressMode:`immediate`,livenessInterval:c.rotationInterval,livenessCheckins:{},tolerance:c.tolerance,personaId:s().activePersonaId??``,createdAt:Math.floor(Date.now()/1e3),admins:[...c.admins],epoch:c.epoch,consumedOps:[]};a({groups:{...u,[l]:x},activeGroupId:l}),d(),$(),b&&o&&f(y,_,l).then(()=>{v(l,{type:`member-join`,pubkey:o.pubkey,displayName:o.displayName&&o.displayName!==`You`?o.displayName:void 0,timestamp:Math.floor(Date.now()/1e3),epoch:c.epoch,opId:crypto.randomUUID()})}),r.close(),O(`Joined ${c.groupName}`,`success`)}function ho(e){let{identity:t,settings:r}=s();if(!t?.pubkey||!t?.privkey){O(`No local identity — create or import one first.`,`error`);return}let i=Array.from(new Set([...n,...r.defaultWriteRelays??[]])),a=r.defaultWriteRelays??[`wss://relay.trotters.cc`],o=document.getElementById(`relay-join-modal`);o||(o=document.createElement(`dialog`),o.id=`relay-join-modal`,o.className=`modal`,document.body.appendChild(o),o.addEventListener(`click`,e=>{e.target===o&&o.close()}));let c=o;c.innerHTML=`
    <div class="modal__form invite-share">
      <h2 class="modal__title">Joining...</h2>
      <p class="invite-hint" id="relay-join-status">Looking for invite on relay...</p>
      <div class="modal__actions">
        <button class="btn" id="relay-join-cancel" type="button">Cancel</button>
      </div>
    </div>
  `;let l=()=>{},u=()=>{};c.querySelector(`#relay-join-cancel`)?.addEventListener(`click`,()=>{l(),u(),c.close()}),c.showModal(),f(i,a).then(()=>{l=jr({inviteId:e,readRelays:i,onToken(e){try{On(e)}catch(e){let t=c.querySelector(`#relay-join-status`);t&&(t.textContent=e instanceof Error?e.message:`Invalid invite token.`,t.style.color=`var(--duress)`);return}let t=e.relays?.length?e.relays:a,r=t,i=Array.from(new Set([...n,...t])),o=c.querySelector(`#relay-join-status`);o&&(o.textContent=`Joining ${e.groupName}...`),f(i,r).then(()=>{u=Er({inviteId:e.inviteId,adminPubkey:e.adminPubkey,readRelays:i,writeRelays:r,onWelcome(t){try{mo(t,e,c)}catch{o&&(o.textContent=`Failed to join — welcome message could not be decrypted.`,o.style.color=`var(--duress)`)}},onError(e){o&&(o.textContent=e,o.style.color=`var(--duress)`)}})})},onError(e){let t=c.querySelector(`#relay-join-status`);t&&(t.textContent=e,t.style.color=`var(--duress)`)}})})}function go(e){try{let t;try{t=bn(e)}catch{try{t=vn(e)}catch{throw Error(`Invalid invite — could not decode token.`)}}On(t);let r=t,{identity:i,settings:a}=s();if(!i?.pubkey||!i?.privkey){O(`No local identity — create or import one first.`,`error`);return}let o=`${r.adminPubkey.slice(0,8)}\u2026${r.adminPubkey.slice(-4)}`,c=r.relays?.length?r.relays:a.defaultWriteRelays,l=c,u=Array.from(new Set([...n,...c])),d=Array.from(new Set([...u,...l])),p=document.getElementById(`remote-join-modal`);p||(p=document.createElement(`dialog`),p.id=`remote-join-modal`,p.className=`modal`,document.body.appendChild(p),p.addEventListener(`click`,e=>{e.target===p&&p.close()}));let m=p,h=()=>{};m.innerHTML=`
      <div class="modal__form invite-share">
        <h2 class="modal__title">Remote Invite</h2>
        <p class="invite-hint">You've been invited to <strong>${k(r.groupName)}</strong> by <code>${k(o)}</code></p>

        <p class="invite-hint" id="remote-join-relay-status" style="color: var(--verified); font-weight: 500;">${d.length>0?`Connecting to relay...`:``}</p>

        <div style="margin: 1rem 0;">
          <p class="invite-hint" style="font-weight: 500;">Or send this join code manually:</p>
          <div style="display: flex; align-items: center; gap: 0.5rem; justify-content: center; margin: 0.5rem 0;">
            <code style="font-size: 0.75rem; word-break: break-all; max-width: 80%;">${k(i.pubkey)}</code>
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
    `,d.length>0&&f(u,l).then(()=>{let e=m.querySelector(`#remote-join-relay-status`);e&&(e.textContent=`Waiting for admin to send group key...`),h=Er({inviteId:r.inviteId,adminPubkey:r.adminPubkey,readRelays:u,writeRelays:l,onWelcome(t){try{mo(t,r,m)}catch{e&&(e.textContent=`Auto-join failed — paste welcome message manually.`,e.style.color=`var(--duress)`)}},onError(t){e&&(e.textContent=t,e.style.color=`var(--duress)`)}})}),m.querySelector(`#remote-join-copy-pubkey`)?.addEventListener(`click`,async e=>{let t=e.currentTarget;try{await navigator.clipboard.writeText(i.pubkey),t.textContent=`Copied!`,setTimeout(()=>{t.textContent=`Copy`},1500)}catch{}}),m.querySelector(`#remote-join-cancel`)?.addEventListener(`click`,()=>{h(),m.close()}),m.querySelector(`#remote-join-accept`)?.addEventListener(`click`,async()=>{let e=m.querySelector(`#remote-join-welcome-input`),t=m.querySelector(`#remote-join-error`),n=(e?.value??``).replace(/[^A-Za-z0-9=+/]/g,``);if(!n){t&&(t.textContent=`Please paste the welcome message.`,t.style.display=``);return}try{h(),mo(n,r,m)}catch(e){t&&(t.textContent=e instanceof Error?e.message:`Failed to decrypt welcome message.`,t.style.display=``)}}),m.showModal()}catch(e){O(e instanceof Error?e.message:`Invalid remote invite.`,`error`)}}function _o(){document.addEventListener(`canary:create-group`,()=>{uo()}),document.addEventListener(`canary:show-invite`,e=>{let{groupId:t}=e.detail,{groups:n}=s(),r=n[t];r&&Lr(r)}),document.addEventListener(`canary:confirm-member`,e=>{let{identity:t,groups:n,activeGroupId:r}=s();if(!r||!t?.pubkey)return;let i=n[r];if(!i||!i.admins.includes(t.pubkey))return;let a=e.detail?.token??``;C(async()=>{let{showConfirmMemberModal:e}=await Promise.resolve().then(()=>Mr);return{showConfirmMemberModal:e}},void 0,import.meta.url).then(({showConfirmMemberModal:e})=>{e(a)})}),document.addEventListener(`canary:verify-call`,e=>{let{groupId:t,pubkey:n}=e.detail;Ma(t,n)}),document.addEventListener(`canary:shamir-split`,()=>{C(async()=>{let{showShamirModal:e}=await import(`./shamir-modal-nyv63WjC.js`);return{showShamirModal:e}},__vite__mapDeps([9,10,11,12,13,7,14]),import.meta.url).then(({showShamirModal:e})=>{e()})}),document.addEventListener(`canary:verify-proof`,()=>{C(async()=>{let{showVerifyProofModal:e}=await import(`./linkage-proof-B1oYePWy.js`);return{showVerifyProofModal:e}},__vite__mapDeps([15,16,17,18,10,11,5,6,7,8,12,19,20]),import.meta.url).then(({showVerifyProofModal:e})=>{e()})}),document.addEventListener(`canary:export-persona`,e=>{let{personaId:t}=e.detail,{personas:n}=s(),r=E(n,t);r&&C(async()=>{let{showExportModal:e}=await import(`./export-modal-CtEny-xS.js`);return{showExportModal:e}},__vite__mapDeps([21,16,17,18,10,11,5,6,7,8,12]),import.meta.url).then(({showExportModal:e})=>{e(r.persona)})}),document.addEventListener(`canary:prove-ownership`,e=>{let{personaId:t}=e.detail;C(async()=>{let{showProveOwnershipModal:e}=await import(`./linkage-proof-B1oYePWy.js`);return{showProveOwnershipModal:e}},__vite__mapDeps([15,16,17,18,10,11,5,6,7,8,12,19,20]),import.meta.url).then(({showProveOwnershipModal:e})=>{e(t)})}),document.addEventListener(`canary:archive-persona`,e=>{let{personaId:t}=e.detail,{personas:n}=s(),r=E(n,t);if(!r)return;function i(e,t){let n={};for(let[r,a]of Object.entries(e))a.id===t?n[r]={...a,archived:!0}:a.children&&Object.keys(a.children).length>0?n[r]={...a,children:i(a.children,t)}:n[r]=a;return n}a({personas:i(n,t)}),O(`Archived "${r.persona.name}"`,`success`)}),document.addEventListener(`canary:rotate-persona`,e=>{let{personaId:t}=e.detail;C(async()=>{let{rotatePersona:e}=await import(`./persona-nfV62C_m.js`);return{rotatePersona:e}},__vite__mapDeps([22,17,18,10,11,5,6,7,8]),import.meta.url).then(({rotatePersona:e})=>{let{personas:n}=s(),r=E(n,t);if(!r)return;let i=e(t,r.persona.index);n[t]&&a({personas:{...n,[t]:i}}),O(`Rotated "${r.persona.name}" to index ${i.index}`,`success`)})}),document.addEventListener(`canary:pin-enable`,e=>{let t=e.detail?.pin;!t||t.length<6||g(t).then(()=>{a({settings:{...s().settings,pinEnabled:!0}}),no()})}),document.addEventListener(`canary:pin-disable`,()=>{_().then(()=>{a({settings:{...s().settings,pinEnabled:!1}}),ro()})}),document.addEventListener(`canary:lock`,()=>{Fe(),y(),io()}),document.addEventListener(`canary:sync-message`,e=>{let{groupId:t,message:n,sender:r}=e.detail,{activeGroupId:i}=s();if(n.type===`beacon`){if(t!==i)return;Si(r,n.lat,n.lon,n.accuracy??2e4,n.timestamp)}else if(n.type===`duress-alert`){let e=n.subject||r,{identity:i}=s();if(i?.pubkey===e)return;un(e,t,n.lat==null?void 0:{lat:n.lat,lon:n.lon},n.timestamp)}else n.type===`duress-clear`&&document.dispatchEvent(new CustomEvent(`canary:duress-clear`,{detail:{subject:n.subject,clearedBy:r,groupId:t}}))}),document.addEventListener(`canary:resync`,()=>void bo()),document.addEventListener(`canary:publish-persona-profile`,async e=>{let{personaId:t}=e.detail,n=s().personas[t];n&&await Ye(n)}),document.addEventListener(`canary:vault-publish-now`,()=>$()),document.addEventListener(`canary:sync-vault`,()=>void Ao()),document.addEventListener(`visibilitychange`,()=>{if(document.hidden){d(),$();return}console.info(`[canary:boot] App foregrounded — reconnecting and syncing vault`),Xa(),m(),C(async()=>{let{disconnectRelays:e}=await import(`./connect-d0leYJBp.js`);return{disconnectRelays:e}},__vite__mapDeps([23,24,11,6,7,8]),import.meta.url).then(({disconnectRelays:e})=>{e(),bo()})})}async function vo(){let{identity:e}=s(),t=await S({pubkey:e?.pubkey??``,privkey:e?.privkey}),n={pubkey:t.pubkey,privkey:t.privkey,displayName:e?.displayName??`You`,signerType:`local`};(!e||e.pubkey!==n.pubkey)&&a({identity:$a(n,e)})}function yo(){let{identity:e}=s();if(!e?.pubkey)return;let t=e.privkey?async t=>{let{decryptVault:n}=await C(async()=>{let{decryptVault:e}=await Promise.resolve().then(()=>Na);return{decryptVault:e}},void 0,import.meta.url);return n(t,e.privkey,e.pubkey)}:e.signerType===`nip07`?async t=>{try{return await window.nostr.nip44.decrypt(e.pubkey,t)}catch{return null}}:null;t&&Ya(e.pubkey,t,(e,t)=>{let{groups:n}=s(),r=Za(n,e,s().deletedGroupIds),i=Object.keys(r).length-Object.keys(n).length;(i>0||Object.entries(r).some(([e,t])=>{let r=n[e];return r?t.epoch!==r.epoch||t.counter!==r.counter:!0}))&&(a({groups:r}),d(),i>0?O(`${i} new group(s) synced from another device`,`success`):O(`Groups updated from another device`,`success`,2e3))})}async function bo(){let{groups:e,identity:n,settings:r}=s(),i=Object.keys(e).length,o=!!n?.privkey,c=[],l=[];for(let t of Object.values(e))c.push(...t.readRelays??[]),l.push(...t.writeRelays??[]),c.push(...t.relays??[]),l.push(...t.relays??[]);c.push(...r.defaultReadRelays??r.defaultRelays),l.push(...r.defaultWriteRelays??r.defaultRelays);let u=t(c),d=t(l),p=t([...u,...d]).length;if(p===0){console.warn(`[canary:boot] No relays found — sync disabled`),i>0&&O(`Sync disabled — ${i} group(s), no relays configured`,`warning`,5e3);return}if(!o&&n?.signerType!==`nip07`){console.warn(`[canary:boot] No privkey and no NIP-07 — sync disabled`),O(`Sync disabled — no private key`,`warning`,5e3);return}if(console.warn(`[canary:boot] Read relays:`,u,`Write relays:`,d),o){await f(u,d);let{waitForConnection:t}=await C(async()=>{let{waitForConnection:e}=await import(`./connect-d0leYJBp.js`);return{waitForConnection:e}},__vite__mapDeps([23,24,11,6,7,8]),import.meta.url);await t(),console.info(`[canary:vault] Relay connections ready, fetching vault...`);try{let e=await Ua(n.privkey,n.pubkey),t=e?.groups;if(console.info(`[canary:vault] Vault fetch result:`,t?`${Object.keys(t).length} group(s)`:`null`),t&&Object.keys(t).length>0){let{groups:e}=s(),n=Za(e,t,s().deletedGroupIds);if(Object.keys(e).sort().join(`,`)!==Object.keys(n).sort().join(`,`)||Object.entries(n).some(([t,n])=>{let r=e[t];return r?n.epoch!==r.epoch||n.counter!==r.counter||n.usageOffset!==r.usageOffset||n.members.length!==r.members.length:!0})){a({groups:n});let t=Object.keys(n).length-Object.keys(e).length;t>0?O(`Restored ${t} group(s) from vault`,`success`):O(`Synced from vault`,`success`,1500)}}if(e?.personas&&Object.keys(e.personas).length>0){let{personas:t}=s(),n={...t};for(let[t,r]of Object.entries(e.personas))n[t]?n[t]={...n[t],...r,npub:n[t].npub}:n[t]=r;a({personas:n})}}catch(e){console.warn(`[canary:vault] Vault fetch failed:`,e)}ee(),yo(),O(`Syncing via ${p} relay(s)`,`success`,2e3),typeof Notification<`u`&&Notification.permission===`granted`&&C(async()=>{let{getExistingSubscription:e,registerWithPushServer:t}=await import(`./push-BPPbJwyP.js`);return{getExistingSubscription:e,registerWithPushServer:t}},[],import.meta.url).then(async({getExistingSubscription:t,registerWithPushServer:n})=>{let r=await t();if(r){let{hashGroupTag:t}=await C(async()=>{let{hashGroupTag:e}=await import(`./sync-CTwt-KD4.js`);return{hashGroupTag:e}},__vite__mapDeps([3,4,5,6,7,8]),import.meta.url),i=Object.values(e).map(e=>({tagHash:t(e.id),livenessInterval:e.livenessInterval}));await n(r,i),console.info(`[canary:push] Re-registered with push server, groups:`,i.length)}else console.warn(`[canary:push] Permission granted but no existing subscription found`)}).catch(e=>console.error(`[canary:push] Re-registration failed:`,e))}else if(n?.signerType===`nip07`){let{connectRelays:e,waitForConnection:t}=await C(async()=>{let{connectRelays:e,waitForConnection:t}=await import(`./connect-d0leYJBp.js`);return{connectRelays:e,waitForConnection:t}},__vite__mapDeps([23,24,11,6,7,8]),import.meta.url);e(u,d);try{await t(),console.info(`[canary:vault] NIP-07 vault sync starting...`);let e=await Ka(n.pubkey),r=e?.groups;if(console.info(`[canary:vault] NIP-07 vault result:`,r?`${Object.keys(r).length} group(s)`:`null`),r&&Object.keys(r).length>0){let{groups:e}=s(),t=Za(e,r,s().deletedGroupIds);if(Object.keys(t).length!==Object.keys(e).length||Object.entries(t).some(([t,n])=>{let r=e[t];return r?n.epoch!==r.epoch||n.counter!==r.counter:!0})){a({groups:t});let n=Object.keys(t).length-Object.keys(e).length;n>0?O(`Restored ${n} group(s) from vault`,`success`):O(`Synced from vault`,`success`,1500)}}if(e?.personas&&Object.keys(e.personas).length>0){let{personas:t}=s(),n={...t};for(let[t,r]of Object.entries(e.personas))n[t]?n[t]={...n[t],...r,npub:n[t].npub}:n[t]=r;a({personas:n})}}catch(e){console.warn(`[canary:vault] NIP-07 vault sync failed:`,e)}yo(),O(`Connected to ${p} relay(s)`,`success`,2e3)}else{let{connectRelays:e}=await C(async()=>{let{connectRelays:e}=await import(`./connect-d0leYJBp.js`);return{connectRelays:e}},__vite__mapDeps([23,24,11,6,7,8]),import.meta.url);e(u,d),O(`Connected to ${p} relay(s)`,`success`,2e3)}let{fetchOwnProfile:m}=await C(async()=>{let{fetchOwnProfile:e}=await import(`./profiles-Dv5SK7vr.js`);return{fetchOwnProfile:e}},__vite__mapDeps([25,26,24,11,6,7,8,17,18,10,5,19,20,27]),import.meta.url);if(m(),co(),o){let{startLivenessHeartbeat:e}=await C(async()=>{let{startLivenessHeartbeat:e}=await import(`./liveness-CLvN1rM_.js`);return{startLivenessHeartbeat:e}},__vite__mapDeps([28,29,16,17,18,10,11,5,6,7,8,12,2,24,30,20,31,19,27,4]),import.meta.url);e()}}function xo(e){return Array.from(e,e=>e.toString(16).padStart(2,`0`)).join(``)}function So(e){let t=e.split(` `),n=document.getElementById(`recovery-phrase-modal`);n||(n=document.createElement(`dialog`),n.id=`recovery-phrase-modal`,n.className=`modal`,document.body.appendChild(n));let r=n;r.textContent=``;let i=document.createElement(`div`);i.className=`modal__form`,i.style.maxWidth=`420px`;let a=document.createElement(`h2`);a.className=`modal__title`,a.textContent=`Back up your recovery phrase`,i.appendChild(a);let o=document.createElement(`p`);o.className=`invite-hint`,o.textContent=`Write these words down in order. They're the only way to recover your account.`,i.appendChild(o);let s=document.createElement(`div`);s.className=`recovery-grid`,s.style.cssText=`display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin:1rem 0;`,t.forEach((e,t)=>{let n=document.createElement(`div`);n.style.cssText=`border:1px solid var(--border);border-radius:4px;padding:0.5rem;text-align:center;font-family:var(--font-mono,monospace);font-size:0.8rem;`;let r=document.createElement(`span`);r.style.cssText=`color:var(--text-muted);font-size:0.7rem;`,r.textContent=`${t+1}. `;let i=document.createElement(`span`);i.style.fontWeight=`500`,i.textContent=e,n.append(r,i),s.appendChild(n)}),i.appendChild(s);let c=document.createElement(`p`);c.className=`invite-hint`,c.style.cssText=`color:var(--duress);font-weight:500;`,c.textContent=`Do not share these words with anyone.`,i.appendChild(c);let l=document.createElement(`div`);l.className=`modal__actions`,l.style.gap=`0.5rem`;let u=document.createElement(`button`);u.id=`recovery-phrase-copy`,u.className=`btn btn--primary`,u.type=`button`,u.textContent=`Copy words`,u.addEventListener(`click`,async()=>{try{await navigator.clipboard.writeText(e),u.textContent=`Copied!`,setTimeout(()=>{u.textContent=`Copy words`},2e3),setTimeout(()=>{navigator.clipboard.writeText(``).catch(()=>{})},3e4)}catch{}});let d=document.createElement(`button`);d.id=`recovery-phrase-skip`,d.className=`btn`,d.type=`button`,d.textContent=`Skip for now`,d.addEventListener(`click`,()=>r.close()),l.append(u,d),i.appendChild(l),r.appendChild(i),r.showModal()}function Co(){let e=document.getElementById(`app`);e.innerHTML=`
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
                ${(s().settings.defaultWriteRelays??s().settings.defaultRelays).map((e,t)=>`
                  <li style="display: flex; align-items: center; gap: 0.25rem; margin-bottom: 0.25rem;">
                    <span class="settings-hint" style="flex: 1; font-size: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0;">${k(e)}</span>
                    <button class="btn btn--ghost btn--sm login-relay-remove" data-relay-index="${t}" type="button" style="padding: 0 0.25rem; font-size: 0.7rem;">✕</button>
                  </li>
                `).join(``)}
              </ul>
              <div style="display: flex; gap: 0.25rem;">
                <input class="input" type="url" id="login-relay-input" placeholder="wss://relay.example.com" style="flex: 1; font-size: 0.75rem; padding: 0.375rem;" />
                <button class="btn btn--ghost btn--sm" id="login-relay-add" type="button">Add</button>
              </div>
              <p class="settings-hint" style="font-size: 0.7rem; margin: 0.5rem 0 0 0;">Read relays: ${n.map(e=>k(e.replace(`wss://`,``))).join(`, `)} + write relay(s)</p>
            </div>
          </details>
        </div>

      </div>
    </div>
  `,e.querySelector(`#offline-form`)?.addEventListener(`submit`,async t=>{t.preventDefault();let n=e.querySelector(`#offline-name`),r=n?.value.trim();if(!r){n?.focus();return}let{generateMnemonic:i}=await C(async()=>{let{generateMnemonic:e}=await import(`./bip39-DavBqmoH.js`);return{generateMnemonic:e}},__vite__mapDeps([32,31,7,8,20]),import.meta.url),{wordlist:o}=await C(async()=>{let{wordlist:e}=await import(`./english-DbZVR_DO.js`);return{wordlist:e}},__vite__mapDeps([33,14]),import.meta.url),{restoreFromMnemonic:s}=await C(async()=>{let{restoreFromMnemonic:e}=await import(`./mnemonic-BvFL4mtR.js`);return{restoreFromMnemonic:e}},__vite__mapDeps([34,35,6,7,8,31,20,14,5]),import.meta.url),c=i(o),{root:l,defaultPersona:u}=s(c),d=Array.from(u.identity.privateKey,e=>e.toString(16).padStart(2,`0`)).join(``),f=Array.from(u.identity.publicKey,e=>e.toString(16).padStart(2,`0`)).join(``);l.destroy(),a({identity:{pubkey:f,privkey:d,mnemonic:c,signerType:`local`,displayName:r}}),await wo();let{publishKind0:p}=await C(async()=>{let{publishKind0:e}=await import(`./profiles-Dv5SK7vr.js`);return{publishKind0:e}},__vite__mapDeps([25,26,24,11,6,7,8,17,18,10,5,19,20,27]),import.meta.url);p(r,d),So(c)}),e.querySelector(`#mnemonic-login-form`)?.addEventListener(`submit`,async t=>{t.preventDefault();let n=e.querySelector(`#login-mnemonic`)?.value.trim();if(n){if(n.split(/\s+/).length!==12){alert(`Recovery phrase must be exactly 12 words.`);return}try{let{validateMnemonic:e,restoreFromMnemonic:t}=await C(async()=>{let{validateMnemonic:e,restoreFromMnemonic:t}=await import(`./mnemonic-BvFL4mtR.js`);return{validateMnemonic:e,restoreFromMnemonic:t}},__vite__mapDeps([34,35,6,7,8,31,20,14,5]),import.meta.url),{wordlist:r}=await C(async()=>{let{wordlist:e}=await import(`./english-DbZVR_DO.js`);return{wordlist:e}},__vite__mapDeps([33,14]),import.meta.url);if(!e(n,r)){alert(`Invalid recovery phrase. Please check your words and try again.`);return}let{root:i,defaultPersona:o}=t(n),s=Array.from(o.identity.privateKey,e=>e.toString(16).padStart(2,`0`)).join(``),c=Array.from(o.identity.publicKey,e=>e.toString(16).padStart(2,`0`)).join(``);i.destroy(),a({identity:{pubkey:c,privkey:s,mnemonic:n,signerType:`local`,displayName:`You`}}),await wo()}catch{alert(`Invalid recovery phrase.`)}}});let t=e.querySelector(`#tab-recovery-phrase`),r=e.querySelector(`#tab-shamir-shares`),i=e.querySelector(`#panel-recovery-phrase`),o=e.querySelector(`#panel-shamir-shares`);t.addEventListener(`click`,()=>{i.style.display=``,o.style.display=`none`,t.style.borderBottomColor=`var(--accent)`,t.style.opacity=`1`,r.style.borderBottomColor=`transparent`,r.style.opacity=`0.6`}),r.addEventListener(`click`,()=>{i.style.display=`none`,o.style.display=``,r.style.borderBottomColor=`var(--accent)`,r.style.opacity=`1`,t.style.borderBottomColor=`transparent`,t.style.opacity=`0.6`});let c=[],l=0;function u(){let t=e.querySelector(`#shamir-status`),n=e.querySelector(`#shamir-share-list`),r=e.querySelector(`#shamir-recover`);n.textContent=``;for(let e=0;e<c.length;e++){let t=document.createElement(`li`);t.className=`settings-hint`,t.style.cssText=`font-size: 0.75rem; padding: 0.125rem 0;`,t.textContent=`Share ${e+1} added`,n.appendChild(t)}if(c.length===0)t.textContent=``,r.disabled=!0;else if(c.length<l){let e=l-c.length;t.textContent=`Share ${c.length} added. Need ${e} more.`,r.disabled=!0}else t.textContent=`Ready to recover!`,r.disabled=!1}e.querySelector(`#shamir-add-share`)?.addEventListener(`click`,async()=>{let t=e.querySelector(`#shamir-share-input`),n=t.value.trim();if(n)try{let{wordsToShare:e}=await C(async()=>{let{wordsToShare:e}=await import(`./dist-Duc3fc8-.js`);return{wordsToShare:e}},__vite__mapDeps([13,7,14]),import.meta.url),r=e(n.split(/\s+/));if(c.some(e=>e.id===r.id)){alert(`Share ${r.id} has already been added.`);return}if(c.length===0)l=r.threshold;else if(r.threshold!==l){alert(`Threshold mismatch: expected ${l}, got ${r.threshold}. Shares must be from the same set.`);return}c.push(r),t.value=``,u()}catch(e){alert(e instanceof Error?e.message:`Invalid share. Please check the words and try again.`)}}),e.querySelector(`#shamir-recover`)?.addEventListener(`click`,async()=>{if(!(c.length<l))try{let{reconstructSecret:e}=await C(async()=>{let{reconstructSecret:e}=await import(`./dist-Duc3fc8-.js`);return{reconstructSecret:e}},__vite__mapDeps([13,7,14]),import.meta.url),t=e(c,l),n=new TextDecoder().decode(t),{validateMnemonic:r,restoreFromMnemonic:i}=await C(async()=>{let{validateMnemonic:e,restoreFromMnemonic:t}=await import(`./mnemonic-BvFL4mtR.js`);return{validateMnemonic:e,restoreFromMnemonic:t}},__vite__mapDeps([34,35,6,7,8,31,20,14,5]),import.meta.url),{wordlist:o}=await C(async()=>{let{wordlist:e}=await import(`./english-DbZVR_DO.js`);return{wordlist:e}},__vite__mapDeps([33,14]),import.meta.url);if(!r(n,o)){alert(`Reconstructed phrase is not a valid mnemonic. Please check your shares.`);return}let{root:s,defaultPersona:u}=i(n),d=Array.from(u.identity.privateKey,e=>e.toString(16).padStart(2,`0`)).join(``),f=Array.from(u.identity.publicKey,e=>e.toString(16).padStart(2,`0`)).join(``);s.destroy(),a({identity:{pubkey:f,privkey:d,mnemonic:n,signerType:`local`,displayName:`You`}}),await wo()}catch(e){alert(e instanceof Error?e.message:`Failed to reconstruct secret from shares.`)}}),e.querySelector(`#nsec-login-form`)?.addEventListener(`submit`,async t=>{t.preventDefault();let n=e.querySelector(`#login-nsec`)?.value.trim();if(n)try{let e=s().identity,t=Ge(n);if(t.type!==`nsec`){alert(`Not a valid nsec.`);return}let r=t.data,i=xo(r);a({identity:$a({pubkey:se(r),privkey:i,signerType:`local`,displayName:`You`},e)}),await wo()}catch(e){alert(e instanceof Error?e.message:`Invalid nsec format.`)}}),e.querySelector(`#login-nip07`)?.addEventListener(`click`,async()=>{if(!h()){alert(`No Nostr extension found. Install Alby, nos2x, or another NIP-07 extension and reload.`);return}try{let e=s().identity;a({identity:$a({pubkey:await window.nostr.getPublicKey(),signerType:`nip07`,displayName:`You`},e)}),await wo()}catch{alert(`Extension rejected the request.`)}});function d(){let t=e.querySelector(`#login-relay-list`);t&&(t.innerHTML=(s().settings.defaultWriteRelays??s().settings.defaultRelays).map((e,t)=>`
      <li style="display: flex; align-items: center; gap: 0.25rem; margin-bottom: 0.25rem;">
        <span class="settings-hint" style="flex: 1; font-size: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0;">${k(e)}</span>
        <button class="btn btn--ghost btn--sm login-relay-remove" data-relay-index="${t}" type="button" style="padding: 0 0.25rem; font-size: 0.7rem;">✕</button>
      </li>
    `).join(``),f())}function f(){e.querySelectorAll(`.login-relay-remove`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Number(e.dataset.relayIndex),n=[...s().settings.defaultWriteRelays??s().settings.defaultRelays];n.splice(t,1),a({settings:{...s().settings,defaultWriteRelays:n,defaultRelays:n}}),d()})})}f(),e.querySelector(`#login-relay-add`)?.addEventListener(`click`,()=>{let t=e.querySelector(`#login-relay-input`),n=t?.value.trim();if(!n||!Qa(n))return;let r=[...s().settings.defaultWriteRelays??s().settings.defaultRelays];r.includes(n)||(r.push(n),a({settings:{...s().settings,defaultWriteRelays:r,defaultRelays:r}}),d()),t&&(t.value=``)}),e.querySelector(`#login-relay-input`)?.addEventListener(`keydown`,t=>{t.key===`Enter`&&(t.preventDefault(),e.querySelector(`#login-relay-add`)?.click())})}async function wo(){{let{identity:e,personas:t}=s();e?.privkey&&(Object.keys(t).length>0?Me(e,t):Ie(e))}ao(),window.location.hash===`#call`&&a({view:`call-demo`});let e=document.getElementById(`header`);e&&te(e),oo(),document.getElementById(`footer-sync-btn`)?.addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:sync-vault`))}),lo(),o(co),o(ko),_o(),fo(),window.addEventListener(`hashchange`,()=>fo()),bo(),Qe().catch(()=>{})}function To(e){let t=document.getElementById(`notification-prompt`);t&&t.remove();let n=document.createElement(`div`);n.id=`notification-prompt`,n.className=`notification-prompt`;let r=document.createElement(`div`);r.className=`notification-prompt__text`;let i=document.createElement(`strong`);i.textContent=`Enable notifications?`;let a=document.createElement(`span`);a.textContent=`We’ll alert you in emergencies and remind you to check in.`,r.append(i,a);let o=document.createElement(`div`);o.className=`notification-prompt__actions`;let s=document.createElement(`button`);s.className=`btn btn--sm btn--primary`,s.textContent=`Enable`;let c=document.createElement(`button`);c.className=`btn btn--sm`,c.textContent=`Not now`,o.append(s,c),n.append(r,o),document.getElementById(`app`)?.appendChild(n),s.addEventListener(`click`,()=>{n.remove(),e()}),c.addEventListener(`click`,()=>n.remove())}function Eo(){let e=document.getElementById(`notification-prompt`);e&&e.remove();let t=document.createElement(`div`);t.id=`notification-prompt`,t.className=`notification-prompt`;let n=document.createElement(`div`);n.className=`notification-prompt__text`;let r=document.createElement(`strong`);r.textContent=`Add to Home Screen`;let i=document.createElement(`span`);i.textContent=`To receive emergency alerts and liveness reminders, add CANARY to your home screen. Tap the share button, then "Add to Home Screen".`,n.append(r,i);let a=document.createElement(`div`);a.className=`notification-prompt__actions`;let o=document.createElement(`button`);o.className=`btn btn--sm`,o.textContent=`Got it`,a.append(o),t.append(n,a),document.getElementById(`app`)?.appendChild(t),o.addEventListener(`click`,()=>t.remove())}var Do=null,Oo=3e4;function ko(){let{identity:e,groups:t}=s();e?.pubkey&&(!e.privkey&&e.signerType!==`nip07`||Object.keys(t).length!==0&&(Do&&clearTimeout(Do),Do=setTimeout(()=>{let{identity:e,groups:t,personas:n,deletedGroupIds:r}=s();!e?.pubkey||Object.keys(t).length===0||(e.privkey?Ha(t,e.privkey,e.pubkey,n,r):e.signerType===`nip07`&&Ga(t,e.pubkey,n,r))},Oo)))}function $(){Do&&clearTimeout(Do);let{identity:e,groups:t,personas:n,deletedGroupIds:r}=s();!e?.pubkey||Object.keys(t).length===0||(e.privkey?Ha(t,e.privkey,e.pubkey,n,r):e.signerType===`nip07`?Ga(t,e.pubkey,n,r):null)?.then(()=>console.info(`[canary:vault] Vault published OK`)).catch(e=>{console.error(`[canary:vault] Vault publish FAILED:`,e),O(`Vault publish failed: ${e instanceof Error?e.message:e}`,`error`)})}async function Ao(){let{identity:e,groups:t,personas:n}=s();if(!e?.pubkey){O(`No identity — cannot sync`,`error`);return}if(!e.privkey&&e.signerType!==`nip07`){O(`No private key or extension — cannot sync`,`error`);return}let r=!e.privkey&&e.signerType===`nip07`,i=e.pubkey.slice(0,8);O(`Syncing as ${i}\u2026${r?` (NIP-07)`:``}`,`info`,3e3),console.info(`[canary:vault] Manual sync for pubkey ${i} (${r?`NIP-07`:`local key`})`);try{let{deletedGroupIds:o}=s();Object.keys(t).length>0&&(r?await Ga(t,e.pubkey,n,o):await Ha(t,e.privkey,e.pubkey,n,o));let{waitForConnection:c}=await C(async()=>{let{waitForConnection:e}=await import(`./connect-d0leYJBp.js`);return{waitForConnection:e}},__vite__mapDeps([23,24,11,6,7,8]),import.meta.url);await c();let l=r?await Ka(e.pubkey):await Ua(e.privkey,e.pubkey),u=l?.groups;if(u&&Object.keys(u).length>0){let{groups:e}=s(),t=Za(e,u,s().deletedGroupIds),n=Object.keys(t).length-Object.keys(e).length;a({groups:t}),d(),n>0?O(`Synced — ${n} new group(s) restored`,`success`):O(`Groups are in sync`,`success`,2e3)}else O(`No vault found for ${i}\u2026 — are both devices using the same identity?`,`warning`,5e3);if(l?.personas&&Object.keys(l.personas).length>0){let{personas:e}=s(),t={...e};for(let[e,n]of Object.entries(l.personas))t[e]?t[e]={...t[e],...n,npub:t[e].npub}:t[e]=n;a({personas:t})}}catch(e){console.error(`[canary:vault] Manual sync failed:`,e),O(`Sync failed: ${e instanceof Error?e.message:e}`,`error`)}}window.addEventListener(`pagehide`,()=>{Do&&$()});async function jo(){if(ne())io();else{re();let{identity:e}=s();e?.pubkey?await wo():Co()}}document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,()=>{jo()}):jo();export{at as n,wr as t};