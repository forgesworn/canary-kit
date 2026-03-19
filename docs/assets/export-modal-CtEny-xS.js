import{n as e}from"./state-D7iyORQz.js";import{a as t}from"./persona-Bwl3GD8v.js";import{t as n}from"./escape-DpAnlPWD.js";import{n as r}from"./persona-picker-ppgx_T96.js";import{t as i}from"./index-BM9U8AXv.js";var a=3e4,o=`export-modal`;function s(a){document.getElementById(o)?.remove();let s=r(a.name),u=a.displayName??a.name,d=e().settings,f=t(a.name,a.index),p=f.identity.nsec,m=f.identity.npub,h=a.writeRelays?.length?a.writeRelays:d.defaultWriteRelays,g=document.createElement(`dialog`);g.id=o,g.className=`modal export-modal`,g.innerHTML=`
    <div class="export-modal__content">
      <button class="export-modal__close" type="button" aria-label="Close">&times;</button>

      <h2 class="export-modal__title">
        Export nsec for
        <span class="export-modal__badge" style="background-color:${s}">${n(u.slice(0,1).toUpperCase())}</span>
        ${n(u)}
      </h2>

      <div class="export-modal__context">
        <p>This key gives full control of this persona. Only paste it into Nostr clients you trust.</p>
        <p>If this key is compromised, you can rotate the persona from here &mdash; your other personas are unaffected.</p>
        <p>Clipboard auto-clears after 30 seconds.</p>
      </div>

      <div class="export-modal__nsec-wrap" id="export-nsec-wrap">
        <code class="export-modal__nsec" id="export-nsec-code" style="filter:blur(5px);user-select:none;">${n(p)}</code>
        <div class="export-modal__reveal-overlay" id="export-reveal-overlay">Click to reveal</div>
      </div>

      <div class="export-modal__actions">
        <button class="btn btn--sm" id="export-copy-nsec" type="button">Copy nsec</button>
        <button class="btn btn--sm" id="export-copy-npub" type="button">Copy npub</button>
        <button class="btn btn--sm" id="export-toggle-qr" type="button">Show QR</button>
      </div>

      <div class="export-modal__qr" id="export-qr-area" hidden></div>

      <div class="export-modal__relays">
        This persona publishes to: ${h.map(e=>`<code>${n(e)}</code>`).join(`, `)||`<em>default relays</em>`}
      </div>
    </div>
  `,document.body.appendChild(g),g.querySelector(`.export-modal__close`)?.addEventListener(`click`,()=>l(g)),g.addEventListener(`click`,e=>{e.target===g&&l(g)}),g.addEventListener(`cancel`,()=>l(g));let _=g.querySelector(`#export-nsec-wrap`),v=g.querySelector(`#export-nsec-code`),y=g.querySelector(`#export-reveal-overlay`);_?.addEventListener(`click`,()=>{!v||!y||(v.style.filter=`none`,v.style.userSelect=`all`,y.hidden=!0)}),c(g,`#export-copy-nsec`,p,`Copy nsec`),c(g,`#export-copy-npub`,m,`Copy npub`);let b=g.querySelector(`#export-toggle-qr`),x=g.querySelector(`#export-qr-area`),S=!1;b?.addEventListener(`click`,()=>{!x||!b||(S=!S,S?(x.innerHTML=i(m),x.hidden=!1,b.textContent=`Hide QR`):(x.hidden=!0,x.textContent=``,b.textContent=`Show QR`))}),g.showModal()}function c(e,t,n,r){let i=e.querySelector(t);i?.addEventListener(`click`,async()=>{try{await navigator.clipboard.writeText(n),i.textContent=`✓ Copied!`,setTimeout(()=>{i.textContent=r},2e3),setTimeout(()=>{navigator.clipboard.writeText(``).catch(()=>{})},a)}catch{}})}function l(e){e.close(),e.remove()}export{s as showExportModal};