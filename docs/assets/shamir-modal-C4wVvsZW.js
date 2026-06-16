import{n as e}from"./state-bZTa5D05.js";import{t}from"./escape-B_Hg2WOy.js";import{t as n}from"./index-Cx73zMQe.js";import{shareToWords as r,t as i}from"./dist-NiQ6rhS-.js";var a=3e4,o=`shamir-modal`,s=`shamir-modal-styles`,c=2,l=5,u=3,d=2,f=`
  .shamir-modal::backdrop { background: rgba(0, 0, 0, 0.72); }
  .shamir-modal {
    width: min(42rem, calc(100vw - 2rem));
    max-width: 42rem;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--bg-surface);
    color: var(--text-primary);
    padding: 0;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
  }
  .shamir-modal__content { padding: 1rem; display: grid; gap: 0.875rem; }
  .shamir-modal__close {
    justify-self: end; background: none; border: none; color: var(--text-muted);
    font-size: 1.5rem; cursor: pointer; line-height: 1; padding: 0;
  }
  .shamir-modal__title { margin: 0; font-size: 1.1rem; color: var(--text-bright); }
  .shamir-modal__field { display: grid; gap: 0.35rem; }
  .shamir-modal__field label { font-size: 0.75rem; color: var(--text-muted); }
  .shamir-modal__field input {
    width: 100%; font: inherit; padding: 0.55rem 0.7rem; border-radius: 6px;
    border: 1px solid var(--border); background: var(--bg-deep); color: var(--text-primary);
  }
  .shamir-modal__explain, .shamir-modal__hint {
    margin: 0; font-size: 0.78rem; line-height: 1.55; color: var(--text-secondary);
  }
  .shamir-modal__actions, .shamir-modal__nav { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .shamir-modal__wordlist {
    margin: 0; padding: 0.875rem 1rem 0.875rem 2.25rem; border: 1px solid var(--border);
    border-radius: 8px; background: var(--bg-deep); max-height: 18rem; overflow: auto;
    font-family: var(--font-mono); font-size: 0.77rem; line-height: 1.6;
  }
  .shamir-modal__share-box {
    border: 1px solid var(--border); border-radius: 8px; background: var(--bg-deep);
    padding: 0.875rem; font-family: var(--font-mono); font-size: 0.75rem;
    line-height: 1.55; word-break: break-word; max-height: 8rem; overflow: auto;
  }
  .shamir-modal__qr { border: 1px solid var(--border); border-radius: 8px; padding: 0.75rem; background: #fff; justify-self: center; }
  .shamir-modal__confirm-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; }
`;function p(){document.getElementById(o)?.remove(),y();let t=e().identity?.mnemonic;if(!t){alert(`No recovery phrase available. Generate or import an identity first.`);return}let n=document.createElement(`dialog`);n.id=o,n.className=`modal shamir-modal`,document.body.appendChild(n),n.addEventListener(`click`,e=>{e.target===n&&_(n)}),n.addEventListener(`cancel`,e=>{e.preventDefault()}),m(n,t),n.showModal()}function m(e,t){e.innerHTML=`
    <div class="shamir-modal__content">
      <button class="shamir-modal__close" type="button" aria-label="Close">&times;</button>
      <h2 class="shamir-modal__title">Split your recovery phrase into shares</h2>

      <div class="shamir-modal__field">
        <label for="shamir-total">Total shares</label>
        <input type="number" id="shamir-total" min="${c}" max="${l}" value="${u}" />
      </div>

      <div class="shamir-modal__field">
        <label for="shamir-threshold">Threshold</label>
        <input type="number" id="shamir-threshold" min="${c}" max="${u}" value="${d}" />
      </div>

      <p class="shamir-modal__explain" id="shamir-explain">
        You'll need any <strong>${d}</strong> of <strong>${u}</strong> shares to recover.
        Distribute them to trusted people or locations.
      </p>

      <div class="shamir-modal__actions">
        <button class="btn btn--primary" id="shamir-split-btn" type="button">Split</button>
      </div>
    </div>
  `,e.querySelector(`.shamir-modal__close`)?.addEventListener(`click`,()=>_(e));let n=e.querySelector(`#shamir-total`),a=e.querySelector(`#shamir-threshold`),o=e.querySelector(`#shamir-explain`),s=()=>{let e=v(n.value,c,l);o.innerHTML=`
      You'll need any <strong>${v(a.value,c,e)}</strong> of <strong>${e}</strong> shares to recover.
      Distribute them to trusted people or locations.
    `};n.addEventListener(`input`,()=>{let e=v(n.value,c,l);a.max=String(e),parseInt(a.value,10)>e&&(a.value=String(e)),s()}),a.addEventListener(`input`,s),e.querySelector(`#shamir-split-btn`).addEventListener(`click`,()=>{let o=v(n.value,c,l),s=v(a.value,c,o);try{h(e,i(new TextEncoder().encode(t),s,o).map(e=>r(e)),0)}catch(e){alert(e instanceof Error?e.message:`Unable to split recovery phrase.`)}})}function h(e,r,i){let o=r.length,s=r[i],c=`Share ${i+1} of ${o}`,l=s.map((e,n)=>`<li>${n+1}. ${t(e)}</li>`).join(``),u=s.join(` `);e.innerHTML=`
    <div class="shamir-modal__content">
      <button class="shamir-modal__close" type="button" aria-label="Close">&times;</button>
      <h2 class="shamir-modal__title">${t(c)}</h2>
      <p class="shamir-modal__hint">Keep each share separate. Any threshold-sized subset can restore your recovery phrase.</p>

      <ol class="shamir-modal__wordlist">${l}</ol>
      <div class="shamir-modal__share-box">${t(u)}</div>

      <div class="shamir-modal__actions">
        <button class="btn btn--sm" id="shamir-copy" type="button">Copy</button>
        <button class="btn btn--sm" id="shamir-qr-toggle" type="button">Show QR</button>
      </div>

      <div class="shamir-modal__qr" id="shamir-qr-area" hidden></div>

      <div class="shamir-modal__nav">
        <button class="btn btn--sm" id="shamir-prev" type="button" ${i===0?`disabled`:``}>Previous</button>
        ${i<o-1?`<button class="btn btn--sm btn--primary" id="shamir-next" type="button">Next</button>`:`<button class="btn btn--sm btn--primary" id="shamir-done" type="button">Done</button>`}
      </div>
    </div>
  `,e.querySelector(`.shamir-modal__close`)?.addEventListener(`click`,()=>_(e));let d=e.querySelector(`#shamir-copy`);d.addEventListener(`click`,async()=>{try{await navigator.clipboard.writeText(u),d.textContent=`✓ Copied!`,setTimeout(()=>{d.textContent=`Copy`},2e3),setTimeout(()=>{navigator.clipboard.writeText(``).catch(()=>{})},a)}catch{}});let f=e.querySelector(`#shamir-qr-toggle`),p=e.querySelector(`#shamir-qr-area`),m=!1;f.addEventListener(`click`,()=>{m=!m,m?(p.innerHTML=n(u),p.hidden=!1,f.textContent=`Hide QR`):(p.hidden=!0,p.textContent=``,f.textContent=`Show QR`)});let v=e.querySelector(`#shamir-prev`),y=e.querySelector(`#shamir-next`),b=e.querySelector(`#shamir-done`);v?.addEventListener(`click`,()=>{i>0&&h(e,r,i-1)}),y?.addEventListener(`click`,()=>{i<o-1&&h(e,r,i+1)}),b?.addEventListener(`click`,()=>{g(e)})}function g(e){e.innerHTML=`
    <div class="shamir-modal__content">
      <button class="shamir-modal__close" type="button" aria-label="Close">&times;</button>
      <h2 class="shamir-modal__title">Confirm backup</h2>

      <label class="shamir-modal__confirm-label">
        <input type="checkbox" id="shamir-confirm-check" />
        I've saved all shares
      </label>

      <div class="shamir-modal__actions">
        <button class="btn btn--primary" id="shamir-close-btn" type="button" disabled>Close</button>
      </div>
    </div>
  `,e.querySelector(`.shamir-modal__close`)?.addEventListener(`click`,()=>_(e));let t=e.querySelector(`#shamir-confirm-check`),n=e.querySelector(`#shamir-close-btn`);t.addEventListener(`change`,()=>{n.disabled=!t.checked}),n.addEventListener(`click`,()=>_(e))}function _(e){e.close(),e.remove()}function v(e,t,n){let r=parseInt(e,10);return isNaN(r)?t:Math.max(t,Math.min(n,r))}function y(){if(document.getElementById(s))return;let e=document.createElement(`style`);e.id=s,e.textContent=f,document.head.appendChild(e)}export{p as showShamirModal};