import{o as e,s as t}from"./types-CD6bIACn.js";import{n}from"./state-JOArEur-.js";import{o as r}from"./persona-C_DFzBe9.js";import{t as i}from"./escape-B_Hg2WOy.js";import{n as a,t as o}from"./index-CXi9-TRv.js";var s=3e4,c=`export-modal`,l=`export-modal-styles`,u=`
  .export-modal::backdrop { background: rgba(0, 0, 0, 0.72); }
  .export-modal {
    width: min(42rem, calc(100vw - 2rem));
    max-width: 42rem;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--bg-surface);
    color: var(--text-primary);
    padding: 0;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
  }
  .export-modal__content { padding: 1rem; display: grid; gap: 0.875rem; }
  .export-modal__close {
    justify-self: end; background: none; border: none; color: var(--text-muted);
    font-size: 1.5rem; cursor: pointer; line-height: 1; padding: 0;
  }
  .export-modal__title { margin: 0; font-size: 1.1rem; color: var(--text-bright); line-height: 1.4; }
  .export-modal__badge {
    display: inline-flex; width: 1.5rem; height: 1.5rem; border-radius: 999px;
    align-items: center; justify-content: center; color: #fff; font-size: 0.75rem; margin: 0 0.35rem;
  }
  .export-modal__context { display: grid; gap: 0.45rem; }
  .export-modal__context p, .export-modal__relays {
    margin: 0; font-size: 0.78rem; color: var(--text-secondary); line-height: 1.55;
  }
  .export-modal__nsec-wrap {
    position: relative; border: 1px solid var(--border); border-radius: 8px;
    background: var(--bg-deep); padding: 0.9rem; overflow: hidden;
  }
  .export-modal__label {
    display: block; font-size: 0.68rem; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 0.5rem;
  }
  .export-modal__nsec {
    display: block; font-family: var(--font-mono); font-size: 0.75rem; line-height: 1.55;
    word-break: break-all; white-space: pre-wrap; padding-right: 0.25rem;
  }
  .export-modal__reveal-overlay {
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
    background: rgba(10, 13, 18, 0.72); color: var(--text-bright); font-size: 0.82rem; cursor: pointer;
  }
  .export-modal__actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .export-modal__qr { border: 1px solid var(--border); border-radius: 8px; padding: 0.75rem; background: #fff; justify-self: center; }
`;function d(s){document.getElementById(c)?.remove(),m();let l=a(s.name),u=s.displayName??s.name,d=n().settings,h=e(s).toLowerCase(),g=t(s)===`account`,_=r(s.name,s.index),v=_.identity.nsec,y=_.identity.npub,b=s.writeRelays?.length?s.writeRelays:d.defaultWriteRelays,x=document.createElement(`dialog`);x.id=c,x.className=`modal export-modal`,x.innerHTML=`
    <div class="export-modal__content">
      <button class="export-modal__close" type="button" aria-label="Close">&times;</button>
      <h2 class="export-modal__title">
        Export nsec for
        <span class="export-modal__badge" style="background-color:${l}">${i(u.slice(0,1).toUpperCase())}</span>
        ${i(u)}
      </h2>
      <div class="export-modal__context">
        <p>This key gives full control of this ${i(h)}. Only paste it into Nostr clients you trust.</p>
        <p>${g?`Anonymous accounts are unlinkable by default unless you later choose to generate a proof.`:`If this key is compromised, you can rotate this persona without affecting your other branches.`}</p>
        <p>Clipboard auto-clears after 30 seconds.</p>
      </div>
      <div class="export-modal__nsec-wrap" id="export-nsec-wrap">
        <span class="export-modal__label">${i(h)} nsec</span>
        <code class="export-modal__nsec" id="export-nsec-code" style="filter:blur(5px);user-select:none;">${i(v)}</code>
        <div class="export-modal__reveal-overlay" id="export-reveal-overlay">Click to reveal</div>
      </div>
      <div class="export-modal__actions">
        <button class="btn btn--sm" id="export-copy-nsec" type="button">Copy nsec</button>
        <button class="btn btn--sm" id="export-copy-npub" type="button">Copy npub</button>
        <button class="btn btn--sm" id="export-toggle-qr" type="button">Show QR</button>
      </div>
      <div class="export-modal__qr" id="export-qr-area" hidden></div>
      <div class="export-modal__relays">
        This ${i(h)} publishes to: ${b.map(e=>`<code>${i(e)}</code>`).join(`, `)||`<em>default relays</em>`}
      </div>
    </div>
  `,document.body.appendChild(x),x.querySelector(`.export-modal__close`)?.addEventListener(`click`,()=>p(x)),x.addEventListener(`click`,e=>{e.target===x&&p(x)}),x.addEventListener(`cancel`,()=>p(x));let S=x.querySelector(`#export-nsec-wrap`),C=x.querySelector(`#export-nsec-code`),w=x.querySelector(`#export-reveal-overlay`);S?.addEventListener(`click`,()=>{!C||!w||(C.style.filter=`none`,C.style.userSelect=`all`,w.hidden=!0)}),f(x,`#export-copy-nsec`,v,`Copy nsec`),f(x,`#export-copy-npub`,y,`Copy npub`);let T=x.querySelector(`#export-toggle-qr`),E=x.querySelector(`#export-qr-area`),D=!1;T?.addEventListener(`click`,()=>{!E||!T||(D=!D,D?(E.innerHTML=o(y),E.hidden=!1,T.textContent=`Hide QR`):(E.hidden=!0,E.textContent=``,T.textContent=`Show QR`))}),x.showModal()}function f(e,t,n,r){let i=e.querySelector(t);i?.addEventListener(`click`,async()=>{try{await navigator.clipboard.writeText(n),i.textContent=`✓ Copied!`,setTimeout(()=>{i.textContent=r},2e3),setTimeout(()=>{navigator.clipboard.writeText(``).catch(()=>{})},s)}catch{}})}function p(e){e.close(),e.remove()}function m(){if(document.getElementById(l))return;let e=document.createElement(`style`);e.id=l,e.textContent=u,document.head.appendChild(e)}export{d as showExportModal};