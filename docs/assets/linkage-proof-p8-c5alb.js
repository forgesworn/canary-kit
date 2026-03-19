import{n as e}from"./state-D7iyORQz.js";import{t}from"./secp256k1-C_bO5q2F.js";import{c as n,d as r,i,o as a,s as o}from"./persona-Dsq2HFSt.js";import{u as s}from"./persona-B_7_cCZw.js";import{t as c}from"./persona-tree-PFALM7An.js";import{n as l}from"./nip19-CMkgf31k.js";import{t as u}from"./escape-DpAnlPWD.js";import{n as d}from"./persona-picker-DYYVlJCI.js";var f=new TextEncoder,p=/^[0-9a-f]{64}$/,m=/^[0-9a-f]{128}$/;function h(e,t){return`nsec-tree:own:${e}:${t}`}function g(e,t,n,r){return`nsec-tree:link:${e}:${t}:${n}:${r}`}function _(e,n){let i=r(e),a=o(t.getPublicKey(i)),s=o(n.publicKey),c=h(a,s),l=f.encode(c);return{masterPubkey:a,childPubkey:s,attestation:c,signature:o(t.sign(l,i))}}function v(e,n){let i=r(e),a=o(t.getPublicKey(i)),s=o(n.publicKey),c=g(a,s,n.purpose,n.index),l=f.encode(c),u=o(t.sign(l,i));return{masterPubkey:a,childPubkey:s,purpose:n.purpose,index:n.index,attestation:c,signature:u}}function y(e){if(!p.test(e.masterPubkey)||!p.test(e.childPubkey))return null;let t=e.purpose!==void 0;if(t!==(e.index!==void 0))return null;if(!t)return h(e.masterPubkey,e.childPubkey);let n=e.purpose,r=e.index;if(n===void 0||r===void 0||!Number.isInteger(r)||r<0||r>4294967295)return null;try{i(n)}catch{return null}return g(e.masterPubkey,e.childPubkey,n,r)}function b(e){try{let r=y(e);if(!r||e.attestation!==r||!m.test(e.signature))return!1;let i=f.encode(e.attestation),a=n(e.signature),o=n(e.masterPubkey);return t.verify(a,i,o)}catch{return!1}}var x=`linkage-prove-dialog`,S=`linkage-verify-dialog`;function C(e){let t=document.getElementById(e);return t||(t=document.createElement(`dialog`),t.id=e,t.className=`modal`,document.body.appendChild(t)),t}function w(e){e.addEventListener(`click`,t=>{t.target===e&&e.close()}),e.querySelector(`[data-close]`)?.addEventListener(`click`,()=>e.close())}function T(e,t){let n=new Blob([t],{type:`application/json`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=e,document.body.appendChild(i),i.click(),setTimeout(()=>{document.body.removeChild(i),URL.revokeObjectURL(r)},100)}function E(e){return`<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${d(e)};margin-right:4px;vertical-align:middle;"></span>`}function D(e){try{return l(e)}catch{return e}}function O(t){let{personas:n,identity:r}=e(),i=c(n,t);if(!i){alert(`Persona not found.`);return}if(!r?.privkey){alert(`No master key available.`);return}let{persona:o,ancestors:l}=i,d=o.name,f=u([...l.map(e=>e.name),d].join(` / `)),p=E(d),m=u(d),h=C(x);h.innerHTML=`
    <div class="modal__form" style="max-width:32rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
        <h2 style="margin:0;font-size:1.125rem;">Prove Ownership</h2>
        <button data-close style="background:none;border:none;cursor:pointer;font-size:1.25rem;color:var(--text,#e0e0e0);">&times;</button>
      </div>

      <p style="margin:0 0 1rem;color:var(--text-secondary,#aaa);font-size:0.875rem;">
        Prove ${p}<strong>${m}</strong> derives from your master key.
      </p>

      <div style="margin-bottom:1rem;font-family:var(--font-mono,monospace);font-size:0.75rem;color:var(--text-muted,#999);">
        Path: ${f}
      </div>

      <fieldset style="border:1px solid var(--border,#444);border-radius:6px;padding:0.75rem;margin-bottom:1rem;">
        <legend style="font-size:0.8125rem;color:var(--text-secondary,#aaa);padding:0 0.25rem;">Proof type</legend>
        <label style="display:block;margin-bottom:0.5rem;cursor:pointer;">
          <input type="radio" name="lp-type" value="blind" checked />
          <strong>Blind</strong>
          <span style="display:block;margin-left:1.25rem;font-size:0.75rem;color:var(--text-secondary,#aaa);">Proves ownership without revealing your master identity.</span>
        </label>
        <label style="display:block;cursor:pointer;">
          <input type="radio" name="lp-type" value="full" />
          <strong>Full</strong>
          <span style="display:block;margin-left:1.25rem;font-size:0.75rem;color:var(--text-secondary,#aaa);">Reveals your master identity and derivation path. For legal/compliance only.</span>
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
  `,w(h);let g=``,y=``;h.querySelector(`#lp-generate`)?.addEventListener(`click`,()=>{let e=h.querySelector(`input[name="lp-type"]:checked`)?.value===`full`?`full`:`blind`,t=s(o,l),n=a(new Uint8Array((r.privkey.match(/.{2}/g)??[]).map(e=>parseInt(e,16))));try{let r=e===`blind`?_(n,t):v(n,t);g=JSON.stringify(r,null,2);let i=Math.floor(Date.now()/1e3);y=`proof-${u(d)}-${i}.json`;let a=h.querySelector(`#lp-json`);a&&(a.textContent=g);let o=h.querySelector(`#lp-result`);o&&(o.style.display=`block`)}finally{n.destroy()}}),h.querySelector(`#lp-copy`)?.addEventListener(`click`,()=>{g&&navigator.clipboard.writeText(g).catch(()=>{})}),h.querySelector(`#lp-download`)?.addEventListener(`click`,()=>{g&&y&&T(y,g)}),h.showModal()}function k(){let e=C(S);e.innerHTML=`
    <div class="modal__form" style="max-width:32rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
        <h2 style="margin:0;font-size:1.125rem;">Verify Linkage Proof</h2>
        <button data-close style="background:none;border:none;cursor:pointer;font-size:1.25rem;color:var(--text,#e0e0e0);">&times;</button>
      </div>

      <label style="display:block;margin-bottom:0.75rem;">
        <span style="font-size:0.8125rem;color:var(--text-secondary,#aaa);">Paste a linkage proof JSON</span>
        <textarea id="vp-input" rows="8" style="display:block;width:100%;margin-top:0.25rem;padding:0.5rem;border-radius:6px;border:1px solid var(--border,#444);background:var(--surface,#1e1e2e);color:var(--text,#e0e0e0);font-family:monospace;font-size:0.75rem;resize:vertical;" placeholder='{"masterPubkey":"...","childPubkey":"...","attestation":"...","signature":"..."}'></textarea>
      </label>

      <button id="vp-verify" class="btn btn--primary" style="width:100%;margin-bottom:1rem;">Verify</button>

      <div id="vp-result" style="display:none;padding:0.75rem;border-radius:6px;border:1px solid var(--border,#444);font-size:0.875rem;"></div>
    </div>
  `,w(e),e.querySelector(`#vp-verify`)?.addEventListener(`click`,()=>{let t=e.querySelector(`#vp-input`),n=e.querySelector(`#vp-result`);if(!t||!n)return;let r=t.value.trim();if(!r){A(n,`error`,`Please paste a proof JSON.`);return}let i;try{i=JSON.parse(r)}catch{A(n,`error`,`Invalid JSON.`);return}try{b(i)?A(n,`success`,``,i):A(n,`error`,`Invalid proof — signature verification failed.`)}catch(e){A(n,`error`,e instanceof Error?e.message:String(e))}}),e.showModal()}function A(e,t,n,r){if(e.style.display=`block`,e.textContent=``,t===`error`){e.style.borderColor=`var(--clr-danger, #e74c3c)`;let t=document.createElement(`span`);t.style.color=`var(--clr-danger, #e74c3c)`,t.textContent=`\u2717 ${n}`,e.appendChild(t);return}e.style.borderColor=`var(--clr-success, #27ae60)`;let i=document.createElement(`div`);if(i.style.cssText=`color:var(--clr-success, #27ae60);font-weight:600;margin-bottom:0.5rem;`,i.textContent=`✓ Valid proof`,e.appendChild(i),r){let t=document.createElement(`div`);t.style.cssText=`font-size:0.75rem;color:var(--text-secondary,#aaa);`;let n=D(r.masterPubkey),i=D(r.childPubkey),a=document.createElement(`div`);a.style.marginBottom=`0.25rem`;let o=document.createElement(`strong`);o.textContent=`Master: `;let s=document.createElement(`code`);s.style.wordBreak=`break-all`,s.textContent=n,a.appendChild(o),a.appendChild(s);let c=document.createElement(`div`),l=document.createElement(`strong`);l.textContent=`Persona: `;let u=document.createElement(`code`);u.style.wordBreak=`break-all`,u.textContent=i,c.appendChild(l),c.appendChild(u),t.appendChild(a),t.appendChild(c),e.appendChild(t)}}export{O as showProveOwnershipModal,k as showVerifyProofModal};