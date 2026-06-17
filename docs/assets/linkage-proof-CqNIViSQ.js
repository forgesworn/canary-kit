import{o as e}from"./types-C4CFP7V4.js";import{n as t}from"./state-bZTa5D05.js";import{c as n,d as r,f as i,i as a,o,s}from"./persona--Nt5lgWe.js";import{d as c}from"./persona-BPEQFwWF.js";import{t as l}from"./persona-tree-Bj_vowVF.js";import{t as u}from"./escape-B_Hg2WOy.js";import{n as d,r as f}from"./index-gjL0x6IW.js";var p=new TextEncoder,m=/^[0-9a-f]{64}$/,h=/^[0-9a-f]{128}$/;function g(e,t){return`nsec-tree:own|${e}|${t}`}function _(e,t,n,r){return`nsec-tree:link|${e}|${t}|${n}|${r}`}function v(e,t){let n=r(e),a=s(i.getPublicKey(n)),o=s(t.publicKey),c=g(a,o),l=p.encode(c);return{masterPubkey:a,childPubkey:o,attestation:c,signature:s(i.sign(l,n))}}function y(e,t){a(t.purpose);let n=r(e),o=s(i.getPublicKey(n)),c=s(t.publicKey),l=_(o,c,t.purpose,t.index),u=p.encode(l),d=s(i.sign(u,n));return{masterPubkey:o,childPubkey:c,purpose:t.purpose,index:t.index,attestation:l,signature:d}}function b(e){if(typeof e.masterPubkey!=`string`||typeof e.childPubkey!=`string`||!m.test(e.masterPubkey)||!m.test(e.childPubkey))return null;let t=e.purpose!==void 0;if(t!==(e.index!==void 0))return null;if(!t)return g(e.masterPubkey,e.childPubkey);let n=e.purpose,r=e.index;if(n===void 0||r===void 0||typeof r!=`number`||!Number.isInteger(r)||r<0||r>4294967295)return null;try{a(n)}catch{return null}return _(e.masterPubkey,e.childPubkey,n,r)}function x(e){try{if(typeof e!=`object`||!e)return!1;let t=b(e);if(!t||e.attestation!==t||typeof e.signature!=`string`||!h.test(e.signature))return!1;let r=p.encode(t),a=n(e.signature),o=n(e.masterPubkey);return i.verify(a,r,o)}catch{return!1}}var S=`linkage-prove-dialog`,C=`linkage-verify-dialog`;function w(e){let t=document.getElementById(e);return t||(t=document.createElement(`dialog`),t.id=e,t.className=`modal`,document.body.appendChild(t)),t}function T(e){e.addEventListener(`click`,t=>{t.target===e&&e.close()}),e.querySelector(`[data-close]`)?.addEventListener(`click`,()=>e.close())}function E(e,t){let n=new Blob([t],{type:`application/json`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=e,document.body.appendChild(i),i.click(),setTimeout(()=>{document.body.removeChild(i),URL.revokeObjectURL(r)},100)}function D(e){return`<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${d(e)};margin-right:4px;vertical-align:middle;"></span>`}function O(e){try{return f(e)}catch{return e}}function k(n){let{personas:r,identity:i}=t(),a=l(r,n);if(!a){alert(`Persona not found.`);return}if(!i?.privkey){alert(`No master key available.`);return}let{persona:s,ancestors:d}=a,f=s.name,p=e(s).toLowerCase(),m=u([...d.map(e=>e.name),f].join(` / `)),h=D(f),g=u(f),_=w(S);_.innerHTML=`
    <div class="modal__form" style="max-width:32rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
        <h2 style="margin:0;font-size:1.125rem;">Prove continuity</h2>
        <button data-close style="background:none;border:none;cursor:pointer;font-size:1.25rem;color:var(--text,#e0e0e0);">&times;</button>
      </div>

      <p style="margin:0 0 1rem;color:var(--text-secondary,#aaa);font-size:0.875rem;">
        Show that ${h}<strong>${g}</strong> comes from the same root as your master identity.
      </p>

      <p style="margin:0 0 1rem;color:var(--text-secondary,#aaa);font-size:0.8125rem;line-height:1.5;">
        Use this when you want to prove a ${u(p)} is yours without handing over your seed phrase or raw master key.
      </p>

      <div style="margin-bottom:1rem;font-family:var(--font-mono,monospace);font-size:0.75rem;color:var(--text-muted,#999);">
        Path: ${m}
      </div>

      <fieldset style="border:1px solid var(--border,#444);border-radius:6px;padding:0.75rem;margin-bottom:1rem;">
        <legend style="font-size:0.8125rem;color:var(--text-secondary,#aaa);padding:0 0.25rem;">How much should the proof reveal?</legend>
        <label style="display:block;margin-bottom:0.5rem;cursor:pointer;">
          <input type="radio" name="lp-type" value="blind" checked />
          <strong>Private proof (recommended)</strong>
          <span style="display:block;margin-left:1.25rem;font-size:0.75rem;color:var(--text-secondary,#aaa);">Proves both identities share a root, while keeping derivation details hidden.</span>
        </label>
        <label style="display:block;cursor:pointer;">
          <input type="radio" name="lp-type" value="full" />
          <strong>Debug / compliance proof</strong>
          <span style="display:block;margin-left:1.25rem;font-size:0.75rem;color:var(--text-secondary,#aaa);">Also reveals the exact derivation context. Useful for audits, recovery debugging, or compliance workflows.</span>
        </label>
      </fieldset>

      <button id="lp-generate" class="btn btn--primary" style="width:100%;margin-bottom:1rem;">Generate proof</button>

      <div id="lp-result" style="display:none;">
        <pre id="lp-json" style="background:var(--surface,#1e1e2e);border:1px solid var(--border,#444);border-radius:6px;padding:0.75rem;overflow-x:auto;font-size:0.75rem;max-height:16rem;overflow-y:auto;white-space:pre-wrap;word-break:break-all;"></pre>
        <div style="display:flex;gap:0.5rem;margin-top:0.5rem;">
          <button id="lp-copy" class="btn" style="flex:1;">Copy</button>
          <button id="lp-download" class="btn" style="flex:1;">Download .json</button>
        </div>
      </div>
    </div>
  `,T(_);let b=``,x=``;_.querySelector(`#lp-generate`)?.addEventListener(`click`,()=>{let e=_.querySelector(`input[name="lp-type"]:checked`)?.value===`full`?`full`:`blind`,t=c(s,d),n=o(new Uint8Array((i.privkey.match(/.{2}/g)??[]).map(e=>parseInt(e,16))));try{let r=e===`blind`?v(n,t):y(n,t);b=JSON.stringify(r,null,2);let i=Math.floor(Date.now()/1e3);x=`proof-${u(f)}-${i}.json`;let a=_.querySelector(`#lp-json`);a&&(a.textContent=b);let o=_.querySelector(`#lp-result`);o&&(o.style.display=`block`)}finally{n.destroy()}}),_.querySelector(`#lp-copy`)?.addEventListener(`click`,()=>{b&&navigator.clipboard.writeText(b).catch(()=>{})}),_.querySelector(`#lp-download`)?.addEventListener(`click`,()=>{b&&x&&E(x,b)}),_.showModal()}function A(){let e=w(C);e.innerHTML=`
    <div class="modal__form" style="max-width:32rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
        <h2 style="margin:0;font-size:1.125rem;">Verify continuity proof</h2>
        <button data-close style="background:none;border:none;cursor:pointer;font-size:1.25rem;color:var(--text,#e0e0e0);">&times;</button>
      </div>

      <label style="display:block;margin-bottom:0.75rem;">
        <span style="font-size:0.8125rem;color:var(--text-secondary,#aaa);">Paste a proof JSON to confirm two identities share the same root.</span>
        <textarea id="vp-input" rows="8" style="display:block;width:100%;margin-top:0.25rem;padding:0.5rem;border-radius:6px;border:1px solid var(--border,#444);background:var(--surface,#1e1e2e);color:var(--text,#e0e0e0);font-family:monospace;font-size:0.75rem;resize:vertical;" placeholder='{"masterPubkey":"...","childPubkey":"...","attestation":"...","signature":"..."}'></textarea>
      </label>

      <button id="vp-verify" class="btn btn--primary" style="width:100%;margin-bottom:1rem;">Verify</button>

      <div id="vp-result" style="display:none;padding:0.75rem;border-radius:6px;border:1px solid var(--border,#444);font-size:0.875rem;"></div>
    </div>
  `,T(e),e.querySelector(`#vp-verify`)?.addEventListener(`click`,()=>{let t=e.querySelector(`#vp-input`),n=e.querySelector(`#vp-result`);if(!t||!n)return;let r=t.value.trim();if(!r){j(n,`error`,`Please paste a proof JSON.`);return}let i;try{i=JSON.parse(r)}catch{j(n,`error`,`Invalid JSON.`);return}try{x(i)?j(n,`success`,``,i):j(n,`error`,`Invalid proof — signature verification failed.`)}catch(e){j(n,`error`,e instanceof Error?e.message:String(e))}}),e.showModal()}function j(e,t,n,r){if(e.style.display=`block`,e.textContent=``,t===`error`){e.style.borderColor=`var(--clr-danger, #e74c3c)`;let t=document.createElement(`span`);t.style.color=`var(--clr-danger, #e74c3c)`,t.textContent=`\u2717 ${n}`,e.appendChild(t);return}e.style.borderColor=`var(--clr-success, #27ae60)`;let i=document.createElement(`div`);if(i.style.cssText=`color:var(--clr-success, #27ae60);font-weight:600;margin-bottom:0.5rem;`,i.textContent=`✓ Valid proof`,e.appendChild(i),r){let t=document.createElement(`div`);t.style.cssText=`font-size:0.75rem;color:var(--text-secondary,#aaa);`;let n=O(r.masterPubkey),i=O(r.childPubkey),a=document.createElement(`div`);a.style.marginBottom=`0.25rem`;let o=document.createElement(`strong`);o.textContent=`Master: `;let s=document.createElement(`code`);s.style.wordBreak=`break-all`,s.textContent=n,a.appendChild(o),a.appendChild(s);let c=document.createElement(`div`),l=document.createElement(`strong`);l.textContent=`Persona: `;let u=document.createElement(`code`);u.style.wordBreak=`break-all`,u.textContent=i,c.appendChild(l),c.appendChild(u),t.appendChild(a),t.appendChild(c),e.appendChild(t)}}export{k as showProveOwnershipModal,A as showVerifyProofModal};