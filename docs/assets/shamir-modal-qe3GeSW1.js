import{n as e}from"./state-D7iyORQz.js";import{t}from"./escape-DpAnlPWD.js";import{t as n}from"./index-DalFSyIH.js";import{shareToWords as r,splitSecret as i}from"./dist-Duc3fc8-.js";var a=3e4,o=`shamir-modal`,s=2,c=5,l=3,u=2;function d(){document.getElementById(o)?.remove();let t=e().identity?.mnemonic;if(!t){alert(`No recovery phrase available. Generate or import an identity first.`);return}let n=document.createElement(`dialog`);n.id=o,n.className=`modal shamir-modal`,document.body.appendChild(n),n.addEventListener(`click`,e=>{e.target===n&&h(n)}),n.addEventListener(`cancel`,e=>{e.preventDefault()}),f(n,t),n.showModal()}function f(e,t){e.innerHTML=`
    <div class="shamir-modal__content">
      <button class="shamir-modal__close" type="button" aria-label="Close">&times;</button>
      <h2 class="shamir-modal__title">Split your recovery phrase into shares</h2>

      <div class="shamir-modal__field">
        <label for="shamir-total">Total shares</label>
        <input type="number" id="shamir-total" min="${s}" max="${c}" value="${l}" />
      </div>

      <div class="shamir-modal__field">
        <label for="shamir-threshold">Threshold</label>
        <input type="number" id="shamir-threshold" min="${s}" max="${l}" value="${u}" />
      </div>

      <p class="shamir-modal__explain" id="shamir-explain">
        You'll need any <strong>${u}</strong> of <strong>${l}</strong> shares to recover.
        Distribute them to trusted people or locations.
      </p>

      <div class="shamir-modal__actions">
        <button class="btn btn--primary" id="shamir-split-btn" type="button">Split</button>
      </div>
    </div>
  `,e.querySelector(`.shamir-modal__close`)?.addEventListener(`click`,()=>h(e));let n=e.querySelector(`#shamir-total`),a=e.querySelector(`#shamir-threshold`),o=e.querySelector(`#shamir-explain`),d=()=>{let e=g(n.value,s,c);o.innerHTML=`
      You'll need any <strong>${g(a.value,s,e)}</strong> of <strong>${e}</strong> shares to recover.
      Distribute them to trusted people or locations.
    `};n.addEventListener(`input`,()=>{let e=g(n.value,s,c);a.max=String(e),parseInt(a.value,10)>e&&(a.value=String(e)),d()}),a.addEventListener(`input`,d),e.querySelector(`#shamir-split-btn`).addEventListener(`click`,()=>{let o=g(n.value,s,c),l=g(a.value,s,o);p(e,i(new TextEncoder().encode(t),l,o).map(e=>r(e)),0)})}function p(e,r,i){let o=r.length,s=r[i],c=`Share ${i+1} of ${o}`,l=s.map((e,n)=>`<li>${n+1}. ${t(e)}</li>`).join(``),u=s.join(` `);e.innerHTML=`
    <div class="shamir-modal__content">
      <h2 class="shamir-modal__title">${t(c)}</h2>

      <ol class="shamir-modal__wordlist">${l}</ol>

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
  `;let d=e.querySelector(`#shamir-copy`);d.addEventListener(`click`,async()=>{try{await navigator.clipboard.writeText(u),d.textContent=`✓ Copied!`,setTimeout(()=>{d.textContent=`Copy`},2e3),setTimeout(()=>{navigator.clipboard.writeText(``).catch(()=>{})},a)}catch{}});let f=e.querySelector(`#shamir-qr-toggle`),h=e.querySelector(`#shamir-qr-area`),g=!1;f.addEventListener(`click`,()=>{g=!g,g?(h.innerHTML=n(u),h.hidden=!1,f.textContent=`Hide QR`):(h.hidden=!0,h.textContent=``,f.textContent=`Show QR`)});let _=e.querySelector(`#shamir-prev`),v=e.querySelector(`#shamir-next`),y=e.querySelector(`#shamir-done`);_?.addEventListener(`click`,()=>{i>0&&p(e,r,i-1)}),v?.addEventListener(`click`,()=>{i<o-1&&p(e,r,i+1)}),y?.addEventListener(`click`,()=>{m(e)})}function m(e){e.innerHTML=`
    <div class="shamir-modal__content">
      <h2 class="shamir-modal__title">Confirm backup</h2>

      <label class="shamir-modal__confirm-label">
        <input type="checkbox" id="shamir-confirm-check" />
        I've saved all shares
      </label>

      <div class="shamir-modal__actions">
        <button class="btn btn--primary" id="shamir-close-btn" type="button" disabled>Close</button>
      </div>
    </div>
  `;let t=e.querySelector(`#shamir-confirm-check`),n=e.querySelector(`#shamir-close-btn`);t.addEventListener(`change`,()=>{n.disabled=!t.checked}),n.addEventListener(`click`,()=>h(e))}function h(e){e.close(),e.remove()}function g(e,t,n){let r=parseInt(e,10);return isNaN(r)?t:Math.max(t,Math.min(n,r))}export{d as showShamirModal};