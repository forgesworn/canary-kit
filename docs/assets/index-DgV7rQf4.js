const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./maplibre-gl-DwUhsmFz.css"])))=>i.map(i=>d[i]);
(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();const qu="modulepreload",Hu=function(e,t){return new URL(e,t).href},Zi={},ae=function(t,n,r){let o=Promise.resolve();if(n&&n.length>0){let l=function(d){return Promise.all(d.map(u=>Promise.resolve(u).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};const i=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),c=a?.nonce||a?.getAttribute("nonce");o=l(n.map(d=>{if(d=Hu(d,r),d in Zi)return;Zi[d]=!0;const u=d.endsWith(".css"),f=u?'[rel="stylesheet"]':"";if(r)for(let p=i.length-1;p>=0;p--){const m=i[p];if(m.href===d&&(!u||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${f}`))return;const h=document.createElement("link");if(h.rel=u?"stylesheet":qu,u||(h.as="script"),h.crossOrigin="",h.href=d,c&&h.setAttribute("nonce",c),document.head.appendChild(h),u)return new Promise((p,m)=>{h.addEventListener("load",p),h.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${d}`)))})}))}function s(i){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=i,window.dispatchEvent(a),!a.defaultPrevented)throw i}return o.then(i=>{for(const a of i||[])a.status==="rejected"&&s(a.reason);return t().catch(s)})},tt=["wss://relay.damus.io","wss://nos.lol","wss://relay.nostr.band"],He="wss://relay.trotters.cc";function Hn(e){return e.readRelays?.length>0||e.writeRelays?.length>0||e.relays?.length>0?"online":"offline"}function Fu(e){try{const t=new URL(e);return t.pathname=t.pathname.replace(/\/+$/,""),t.toString()}catch{return e.replace(/\/+$/,"")}}function Se(e){const t=new Set,n=[];for(const r of e){const o=Fu(r);t.has(o)||(t.add(o),n.push(o))}return n}function Gu(e){return Se([...e.readRelays??[],...e.writeRelays??[],...e.relays??[]])}const Ku={view:"groups",groups:{},activeGroupId:null,identity:null,settings:{theme:"dark",pinEnabled:!1,autoLockMinutes:5,defaultRelays:[He],defaultReadRelays:[...tt,He],defaultWriteRelays:[He]}};let mt=structuredClone(Ku);const ts=new Set;function Ps(){for(const e of ts)try{e()}catch(t){console.error("[canary:state] subscriber threw:",t)}}function _(){return mt}function te(e){mt={...mt,...e},Ps()}function J(e,t){const n=mt.groups[e];if(!n){console.warn(`[canary:state] updateGroup: unknown group id "${e}"`);return}mt={...mt,groups:{...mt.groups,[e]:{...n,...t}}},Ps()}function Tr(e){return ts.add(e),()=>{ts.delete(e)}}function fc(e){mt=e,Ps()}const Vu=6e5,Wu=16,ns=12;async function hc(e,t){const n=await crypto.subtle.importKey("raw",new TextEncoder().encode(e),"PBKDF2",!1,["deriveKey"]);return crypto.subtle.deriveKey({name:"PBKDF2",salt:t,iterations:Vu,hash:"SHA-256"},n,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}async function pc(e,t){const n=crypto.getRandomValues(new Uint8Array(ns)),r=await crypto.subtle.encrypt({name:"AES-GCM",iv:n},t,new TextEncoder().encode(e)),o=new Uint8Array(n.length+new Uint8Array(r).length);o.set(n),o.set(new Uint8Array(r),n.length);let s="";for(let i=0;i<o.length;i++)s+=String.fromCharCode(o[i]);return btoa(s)}async function Qr(e,t){const n=Uint8Array.from(atob(e),i=>i.charCodeAt(0)),r=n.slice(0,ns),o=n.slice(ns),s=await crypto.subtle.decrypt({name:"AES-GCM",iv:r},t,o);return new TextDecoder().decode(s)}function zu(){return crypto.getRandomValues(new Uint8Array(Wu))}function Ju(e){return btoa(String.fromCharCode(...e))}function mc(e){return Uint8Array.from(atob(e),t=>t.charCodeAt(0))}function Us(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array"}function Ae(e,t=""){if(!Number.isSafeInteger(e)||e<0){const n=t&&`"${t}" `;throw new Error(`${n}expected integer >= 0, got ${e}`)}}function G(e,t,n=""){const r=Us(e),o=e?.length,s=t!==void 0;if(!r||s&&o!==t){const i=n&&`"${n}" `,a=s?` of length ${t}`:"",c=r?`length=${o}`:`type=${typeof e}`;throw new Error(i+"expected Uint8Array"+a+", got "+c)}return e}function Fn(e){if(typeof e!="function"||typeof e.create!="function")throw new Error("Hash must wrapped by utils.createHasher");Ae(e.outputLen),Ae(e.blockLen)}function Lr(e,t=!0){if(e.destroyed)throw new Error("Hash instance has been destroyed");if(t&&e.finished)throw new Error("Hash#digest() has already been called")}function Yu(e,t){G(e,void 0,"digestInto() output");const n=t.outputLen;if(e.length<n)throw new Error('"digestInto() output" expected to be of length >='+n)}function Fe(...e){for(let t=0;t<e.length;t++)e[t].fill(0)}function Nt(e){return new DataView(e.buffer,e.byteOffset,e.byteLength)}function Oe(e,t){return e<<32-t|e>>>t}function Xn(e,t){return e<<t|e>>>32-t>>>0}const yc=typeof Uint8Array.from([]).toHex=="function"&&typeof Uint8Array.fromHex=="function",Zu=Array.from({length:256},(e,t)=>t.toString(16).padStart(2,"0"));function q(e){if(G(e),yc)return e.toHex();let t="";for(let n=0;n<e.length;n++)t+=Zu[e[n]];return t}const ze={_0:48,_9:57,A:65,F:70,a:97,f:102};function Xi(e){if(e>=ze._0&&e<=ze._9)return e-ze._0;if(e>=ze.A&&e<=ze.F)return e-(ze.A-10);if(e>=ze.a&&e<=ze.f)return e-(ze.a-10)}function z(e){if(typeof e!="string")throw new Error("hex string expected, got "+typeof e);if(yc)return Uint8Array.fromHex(e);const t=e.length,n=t/2;if(t%2)throw new Error("hex string expected, got unpadded hex of length "+t);const r=new Uint8Array(n);for(let o=0,s=0;o<n;o++,s+=2){const i=Xi(e.charCodeAt(s)),a=Xi(e.charCodeAt(s+1));if(i===void 0||a===void 0){const c=e[s]+e[s+1];throw new Error('hex string expected, got non-hex character "'+c+'" at index '+s)}r[o]=i*16+a}return r}function Xu(e){if(typeof e!="string")throw new Error("string expected");return new Uint8Array(new TextEncoder().encode(e))}function Qi(e,t=""){return typeof e=="string"?Xu(e):G(e,void 0,t)}function oe(...e){let t=0;for(let r=0;r<e.length;r++){const o=e[r];G(o),t+=o.length}const n=new Uint8Array(t);for(let r=0,o=0;r<e.length;r++){const s=e[r];n.set(s,o),o+=s.length}return n}function Qu(e,t){if(t!==void 0&&{}.toString.call(t)!=="[object Object]")throw new Error("options must be object or undefined");return Object.assign(e,t)}function Ds(e,t={}){const n=(o,s)=>e(s).update(o).digest(),r=e(void 0);return n.outputLen=r.outputLen,n.blockLen=r.blockLen,n.create=o=>e(o),Object.assign(n,t),Object.freeze(n)}function wt(e=32){const t=typeof globalThis=="object"?globalThis.crypto:null;if(typeof t?.getRandomValues!="function")throw new Error("crypto.getRandomValues must be defined");return t.getRandomValues(new Uint8Array(e))}const gc=e=>({oid:Uint8Array.from([6,9,96,134,72,1,101,3,4,2,e])});class bc{oHash;iHash;blockLen;outputLen;finished=!1;destroyed=!1;constructor(t,n){if(Fn(t),G(n,void 0,"key"),this.iHash=t.create(),typeof this.iHash.update!="function")throw new Error("Expected instance of class which extends utils.Hash");this.blockLen=this.iHash.blockLen,this.outputLen=this.iHash.outputLen;const r=this.blockLen,o=new Uint8Array(r);o.set(n.length>r?t.create().update(n).digest():n);for(let s=0;s<o.length;s++)o[s]^=54;this.iHash.update(o),this.oHash=t.create();for(let s=0;s<o.length;s++)o[s]^=106;this.oHash.update(o),Fe(o)}update(t){return Lr(this),this.iHash.update(t),this}digestInto(t){Lr(this),G(t,this.outputLen,"output"),this.finished=!0,this.iHash.digestInto(t),this.oHash.update(t),this.oHash.digestInto(t),this.destroy()}digest(){const t=new Uint8Array(this.oHash.outputLen);return this.digestInto(t),t}_cloneInto(t){t||=Object.create(Object.getPrototypeOf(this),{});const{oHash:n,iHash:r,finished:o,destroyed:s,blockLen:i,outputLen:a}=this;return t=t,t.finished=o,t.destroyed=s,t.blockLen=i,t.outputLen=a,t.oHash=n._cloneInto(t.oHash),t.iHash=r._cloneInto(t.iHash),t}clone(){return this._cloneInto()}destroy(){this.destroyed=!0,this.oHash.destroy(),this.iHash.destroy()}}const nt=(e,t,n)=>new bc(e,t).update(n).digest();nt.create=(e,t)=>new bc(e,t);function ef(e,t,n,r){Fn(e);const o=Qu({dkLen:32,asyncTick:10},r),{c:s,dkLen:i,asyncTick:a}=o;if(Ae(s,"c"),Ae(i,"dkLen"),Ae(a,"asyncTick"),s<1)throw new Error("iterations (c) must be >= 1");const c=Qi(t,"password"),l=Qi(n,"salt"),d=new Uint8Array(i),u=nt.create(e,c),f=u._cloneInto().update(l);return{c:s,dkLen:i,asyncTick:a,DK:d,PRF:u,PRFSalt:f}}function tf(e,t,n,r,o){return e.destroy(),t.destroy(),r&&r.destroy(),Fe(o),n}function nf(e,t,n,r){const{c:o,dkLen:s,DK:i,PRF:a,PRFSalt:c}=ef(e,t,n,r);let l;const d=new Uint8Array(4),u=Nt(d),f=new Uint8Array(a.outputLen);for(let h=1,p=0;p<s;h++,p+=a.outputLen){const m=i.subarray(p,p+a.outputLen);u.setInt32(0,h,!1),(l=c._cloneInto(l)).update(d).digestInto(f),m.set(f.subarray(0,m.length));for(let y=1;y<o;y++){a._cloneInto(l).update(f).digestInto(f);for(let b=0;b<m.length;b++)m[b]^=f[b]}}return tf(a,c,i,l,f)}function rf(e,t,n){return e&t^~e&n}function of(e,t,n){return e&t^e&n^t&n}class js{blockLen;outputLen;padOffset;isLE;buffer;view;finished=!1;length=0;pos=0;destroyed=!1;constructor(t,n,r,o){this.blockLen=t,this.outputLen=n,this.padOffset=r,this.isLE=o,this.buffer=new Uint8Array(t),this.view=Nt(this.buffer)}update(t){Lr(this),G(t);const{view:n,buffer:r,blockLen:o}=this,s=t.length;for(let i=0;i<s;){const a=Math.min(o-this.pos,s-i);if(a===o){const c=Nt(t);for(;o<=s-i;i+=o)this.process(c,i);continue}r.set(t.subarray(i,i+a),this.pos),this.pos+=a,i+=a,this.pos===o&&(this.process(n,0),this.pos=0)}return this.length+=t.length,this.roundClean(),this}digestInto(t){Lr(this),Yu(t,this),this.finished=!0;const{buffer:n,view:r,blockLen:o,isLE:s}=this;let{pos:i}=this;n[i++]=128,Fe(this.buffer.subarray(i)),this.padOffset>o-i&&(this.process(r,0),i=0);for(let u=i;u<o;u++)n[u]=0;r.setBigUint64(o-8,BigInt(this.length*8),s),this.process(r,0);const a=Nt(t),c=this.outputLen;if(c%4)throw new Error("_sha2: outputLen must be aligned to 32bit");const l=c/4,d=this.get();if(l>d.length)throw new Error("_sha2: outputLen bigger than state");for(let u=0;u<l;u++)a.setUint32(4*u,d[u],s)}digest(){const{buffer:t,outputLen:n}=this;this.digestInto(t);const r=t.slice(0,n);return this.destroy(),r}_cloneInto(t){t||=new this.constructor,t.set(...this.get());const{blockLen:n,buffer:r,length:o,finished:s,destroyed:i,pos:a}=this;return t.destroyed=i,t.finished=s,t.length=o,t.pos=a,o%n&&t.buffer.set(r),t}clone(){return this._cloneInto()}}const at=Uint32Array.from([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),de=Uint32Array.from([1779033703,4089235720,3144134277,2227873595,1013904242,4271175723,2773480762,1595750129,1359893119,2917565137,2600822924,725511199,528734635,4215389547,1541459225,327033209]),Qn=BigInt(2**32-1),ea=BigInt(32);function sf(e,t=!1){return t?{h:Number(e&Qn),l:Number(e>>ea&Qn)}:{h:Number(e>>ea&Qn)|0,l:Number(e&Qn)|0}}function af(e,t=!1){const n=e.length;let r=new Uint32Array(n),o=new Uint32Array(n);for(let s=0;s<n;s++){const{h:i,l:a}=sf(e[s],t);[r[s],o[s]]=[i,a]}return[r,o]}const ta=(e,t,n)=>e>>>n,na=(e,t,n)=>e<<32-n|t>>>n,Ht=(e,t,n)=>e>>>n|t<<32-n,Ft=(e,t,n)=>e<<32-n|t>>>n,er=(e,t,n)=>e<<64-n|t>>>n-32,tr=(e,t,n)=>e>>>n-32|t<<64-n;function Je(e,t,n,r){const o=(t>>>0)+(r>>>0);return{h:e+n+(o/2**32|0)|0,l:o|0}}const cf=(e,t,n)=>(e>>>0)+(t>>>0)+(n>>>0),lf=(e,t,n,r)=>t+n+r+(e/2**32|0)|0,df=(e,t,n,r)=>(e>>>0)+(t>>>0)+(n>>>0)+(r>>>0),uf=(e,t,n,r,o)=>t+n+r+o+(e/2**32|0)|0,ff=(e,t,n,r,o)=>(e>>>0)+(t>>>0)+(n>>>0)+(r>>>0)+(o>>>0),hf=(e,t,n,r,o,s)=>t+n+r+o+s+(e/2**32|0)|0,pf=Uint32Array.from([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),ct=new Uint32Array(64);class mf extends js{constructor(t){super(64,t,8,!1)}get(){const{A:t,B:n,C:r,D:o,E:s,F:i,G:a,H:c}=this;return[t,n,r,o,s,i,a,c]}set(t,n,r,o,s,i,a,c){this.A=t|0,this.B=n|0,this.C=r|0,this.D=o|0,this.E=s|0,this.F=i|0,this.G=a|0,this.H=c|0}process(t,n){for(let u=0;u<16;u++,n+=4)ct[u]=t.getUint32(n,!1);for(let u=16;u<64;u++){const f=ct[u-15],h=ct[u-2],p=Oe(f,7)^Oe(f,18)^f>>>3,m=Oe(h,17)^Oe(h,19)^h>>>10;ct[u]=m+ct[u-7]+p+ct[u-16]|0}let{A:r,B:o,C:s,D:i,E:a,F:c,G:l,H:d}=this;for(let u=0;u<64;u++){const f=Oe(a,6)^Oe(a,11)^Oe(a,25),h=d+f+rf(a,c,l)+pf[u]+ct[u]|0,m=(Oe(r,2)^Oe(r,13)^Oe(r,22))+of(r,o,s)|0;d=l,l=c,c=a,a=i+h|0,i=s,s=o,o=r,r=h+m|0}r=r+this.A|0,o=o+this.B|0,s=s+this.C|0,i=i+this.D|0,a=a+this.E|0,c=c+this.F|0,l=l+this.G|0,d=d+this.H|0,this.set(r,o,s,i,a,c,l,d)}roundClean(){Fe(ct)}destroy(){this.set(0,0,0,0,0,0,0,0),Fe(this.buffer)}}class yf extends mf{A=at[0]|0;B=at[1]|0;C=at[2]|0;D=at[3]|0;E=at[4]|0;F=at[5]|0;G=at[6]|0;H=at[7]|0;constructor(){super(32)}}const vc=af(["0x428a2f98d728ae22","0x7137449123ef65cd","0xb5c0fbcfec4d3b2f","0xe9b5dba58189dbbc","0x3956c25bf348b538","0x59f111f1b605d019","0x923f82a4af194f9b","0xab1c5ed5da6d8118","0xd807aa98a3030242","0x12835b0145706fbe","0x243185be4ee4b28c","0x550c7dc3d5ffb4e2","0x72be5d74f27b896f","0x80deb1fe3b1696b1","0x9bdc06a725c71235","0xc19bf174cf692694","0xe49b69c19ef14ad2","0xefbe4786384f25e3","0x0fc19dc68b8cd5b5","0x240ca1cc77ac9c65","0x2de92c6f592b0275","0x4a7484aa6ea6e483","0x5cb0a9dcbd41fbd4","0x76f988da831153b5","0x983e5152ee66dfab","0xa831c66d2db43210","0xb00327c898fb213f","0xbf597fc7beef0ee4","0xc6e00bf33da88fc2","0xd5a79147930aa725","0x06ca6351e003826f","0x142929670a0e6e70","0x27b70a8546d22ffc","0x2e1b21385c26c926","0x4d2c6dfc5ac42aed","0x53380d139d95b3df","0x650a73548baf63de","0x766a0abb3c77b2a8","0x81c2c92e47edaee6","0x92722c851482353b","0xa2bfe8a14cf10364","0xa81a664bbc423001","0xc24b8b70d0f89791","0xc76c51a30654be30","0xd192e819d6ef5218","0xd69906245565a910","0xf40e35855771202a","0x106aa07032bbd1b8","0x19a4c116b8d2d0c8","0x1e376c085141ab53","0x2748774cdf8eeb99","0x34b0bcb5e19b48a8","0x391c0cb3c5c95a63","0x4ed8aa4ae3418acb","0x5b9cca4f7763e373","0x682e6ff3d6b2b8a3","0x748f82ee5defb2fc","0x78a5636f43172f60","0x84c87814a1f0ab72","0x8cc702081a6439ec","0x90befffa23631e28","0xa4506cebde82bde9","0xbef9a3f7b2c67915","0xc67178f2e372532b","0xca273eceea26619c","0xd186b8c721c0c207","0xeada7dd6cde0eb1e","0xf57d4f7fee6ed178","0x06f067aa72176fba","0x0a637dc5a2c898a6","0x113f9804bef90dae","0x1b710b35131c471b","0x28db77f523047d84","0x32caab7b40c72493","0x3c9ebe0a15c9bebc","0x431d67c49c100d4c","0x4cc5d4becb3e42b6","0x597f299cfc657e2a","0x5fcb6fab3ad6faec","0x6c44198c4a475817"].map(e=>BigInt(e))),gf=vc[0],bf=vc[1],lt=new Uint32Array(80),dt=new Uint32Array(80);class vf extends js{constructor(t){super(128,t,16,!1)}get(){const{Ah:t,Al:n,Bh:r,Bl:o,Ch:s,Cl:i,Dh:a,Dl:c,Eh:l,El:d,Fh:u,Fl:f,Gh:h,Gl:p,Hh:m,Hl:y}=this;return[t,n,r,o,s,i,a,c,l,d,u,f,h,p,m,y]}set(t,n,r,o,s,i,a,c,l,d,u,f,h,p,m,y){this.Ah=t|0,this.Al=n|0,this.Bh=r|0,this.Bl=o|0,this.Ch=s|0,this.Cl=i|0,this.Dh=a|0,this.Dl=c|0,this.Eh=l|0,this.El=d|0,this.Fh=u|0,this.Fl=f|0,this.Gh=h|0,this.Gl=p|0,this.Hh=m|0,this.Hl=y|0}process(t,n){for(let L=0;L<16;L++,n+=4)lt[L]=t.getUint32(n),dt[L]=t.getUint32(n+=4);for(let L=16;L<80;L++){const O=lt[L-15]|0,N=dt[L-15]|0,$=Ht(O,N,1)^Ht(O,N,8)^ta(O,N,7),w=Ft(O,N,1)^Ft(O,N,8)^na(O,N,7),v=lt[L-2]|0,g=dt[L-2]|0,x=Ht(v,g,19)^er(v,g,61)^ta(v,g,6),S=Ft(v,g,19)^tr(v,g,61)^na(v,g,6),A=df(w,S,dt[L-7],dt[L-16]),k=uf(A,$,x,lt[L-7],lt[L-16]);lt[L]=k|0,dt[L]=A|0}let{Ah:r,Al:o,Bh:s,Bl:i,Ch:a,Cl:c,Dh:l,Dl:d,Eh:u,El:f,Fh:h,Fl:p,Gh:m,Gl:y,Hh:b,Hl:E}=this;for(let L=0;L<80;L++){const O=Ht(u,f,14)^Ht(u,f,18)^er(u,f,41),N=Ft(u,f,14)^Ft(u,f,18)^tr(u,f,41),$=u&h^~u&m,w=f&p^~f&y,v=ff(E,N,w,bf[L],dt[L]),g=hf(v,b,O,$,gf[L],lt[L]),x=v|0,S=Ht(r,o,28)^er(r,o,34)^er(r,o,39),A=Ft(r,o,28)^tr(r,o,34)^tr(r,o,39),k=r&s^r&a^s&a,R=o&i^o&c^i&c;b=m|0,E=y|0,m=h|0,y=p|0,h=u|0,p=f|0,{h:u,l:f}=Je(l|0,d|0,g|0,x|0),l=a|0,d=c|0,a=s|0,c=i|0,s=r|0,i=o|0;const I=cf(x,A,R);r=lf(I,g,S,k),o=I|0}({h:r,l:o}=Je(this.Ah|0,this.Al|0,r|0,o|0)),{h:s,l:i}=Je(this.Bh|0,this.Bl|0,s|0,i|0),{h:a,l:c}=Je(this.Ch|0,this.Cl|0,a|0,c|0),{h:l,l:d}=Je(this.Dh|0,this.Dl|0,l|0,d|0),{h:u,l:f}=Je(this.Eh|0,this.El|0,u|0,f|0),{h,l:p}=Je(this.Fh|0,this.Fl|0,h|0,p|0),{h:m,l:y}=Je(this.Gh|0,this.Gl|0,m|0,y|0),{h:b,l:E}=Je(this.Hh|0,this.Hl|0,b|0,E|0),this.set(r,o,s,i,a,c,l,d,u,f,h,p,m,y,b,E)}roundClean(){Fe(lt,dt)}destroy(){Fe(this.buffer),this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)}}class wf extends vf{Ah=de[0]|0;Al=de[1]|0;Bh=de[2]|0;Bl=de[3]|0;Ch=de[4]|0;Cl=de[5]|0;Dh=de[6]|0;Dl=de[7]|0;Eh=de[8]|0;El=de[9]|0;Fh=de[10]|0;Fl=de[11]|0;Gh=de[12]|0;Gl=de[13]|0;Hh=de[14]|0;Hl=de[15]|0;constructor(){super(64)}}const se=Ds(()=>new yf,gc(1)),rs=Ds(()=>new wf,gc(3));function nn(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array"}function Ef(e){if(!nn(e))throw new Error("Uint8Array expected")}function wc(e,t){return Array.isArray(t)?t.length===0?!0:e?t.every(n=>typeof n=="string"):t.every(n=>Number.isSafeInteger(n)):!1}function Ec(e){if(typeof e!="function")throw new Error("function expected");return!0}function Bt(e,t){if(typeof t!="string")throw new Error(`${e}: string expected`);return!0}function dn(e){if(!Number.isSafeInteger(e))throw new Error(`invalid integer: ${e}`)}function Nr(e){if(!Array.isArray(e))throw new Error("array expected")}function $r(e,t){if(!wc(!0,t))throw new Error(`${e}: array of strings expected`)}function qs(e,t){if(!wc(!1,t))throw new Error(`${e}: array of numbers expected`)}function Gn(...e){const t=s=>s,n=(s,i)=>a=>s(i(a)),r=e.map(s=>s.encode).reduceRight(n,t),o=e.map(s=>s.decode).reduce(n,t);return{encode:r,decode:o}}function eo(e){const t=typeof e=="string"?e.split(""):e,n=t.length;$r("alphabet",t);const r=new Map(t.map((o,s)=>[o,s]));return{encode:o=>(Nr(o),o.map(s=>{if(!Number.isSafeInteger(s)||s<0||s>=n)throw new Error(`alphabet.encode: digit index outside alphabet "${s}". Allowed: ${e}`);return t[s]})),decode:o=>(Nr(o),o.map(s=>{Bt("alphabet.decode",s);const i=r.get(s);if(i===void 0)throw new Error(`Unknown letter: "${s}". Allowed: ${e}`);return i}))}}function to(e=""){return Bt("join",e),{encode:t=>($r("join.decode",t),t.join(e)),decode:t=>(Bt("join.decode",t),t.split(e))}}function kc(e,t="="){return dn(e),Bt("padding",t),{encode(n){for($r("padding.encode",n);n.length*e%8;)n.push(t);return n},decode(n){$r("padding.decode",n);let r=n.length;if(r*e%8)throw new Error("padding: invalid, string should have whole number of bytes");for(;r>0&&n[r-1]===t;r--)if((r-1)*e%8===0)throw new Error("padding: invalid, string has too much padding");return n.slice(0,r)}}}function os(e,t,n){if(t<2)throw new Error(`convertRadix: invalid from=${t}, base cannot be less than 2`);if(n<2)throw new Error(`convertRadix: invalid to=${n}, base cannot be less than 2`);if(Nr(e),!e.length)return[];let r=0;const o=[],s=Array.from(e,a=>{if(dn(a),a<0||a>=t)throw new Error(`invalid integer: ${a}`);return a}),i=s.length;for(;;){let a=0,c=!0;for(let l=r;l<i;l++){const d=s[l],u=t*a,f=u+d;if(!Number.isSafeInteger(f)||u/t!==a||f-d!==u)throw new Error("convertRadix: carry overflow");const h=f/n;a=f%n;const p=Math.floor(h);if(s[l]=p,!Number.isSafeInteger(p)||p*n+a!==f)throw new Error("convertRadix: carry overflow");if(c)p?c=!1:r=l;else continue}if(o.push(a),c)break}for(let a=0;a<e.length-1&&e[a]===0;a++)o.push(0);return o.reverse()}const _c=(e,t)=>t===0?e:_c(t,e%t),Mr=(e,t)=>e+(t-_c(e,t)),br=(()=>{let e=[];for(let t=0;t<40;t++)e.push(2**t);return e})();function Or(e,t,n,r){if(Nr(e),t<=0||t>32)throw new Error(`convertRadix2: wrong from=${t}`);if(n<=0||n>32)throw new Error(`convertRadix2: wrong to=${n}`);if(Mr(t,n)>32)throw new Error(`convertRadix2: carry overflow from=${t} to=${n} carryBits=${Mr(t,n)}`);let o=0,s=0;const i=br[t],a=br[n]-1,c=[];for(const l of e){if(dn(l),l>=i)throw new Error(`convertRadix2: invalid data word=${l} from=${t}`);if(o=o<<t|l,s+t>32)throw new Error(`convertRadix2: carry overflow pos=${s} from=${t}`);for(s+=t;s>=n;s-=n)c.push((o>>s-n&a)>>>0);const d=br[s];if(d===void 0)throw new Error("invalid carry");o&=d-1}if(o=o<<n-s&a,!r&&s>=t)throw new Error("Excess padding");if(!r&&o>0)throw new Error(`Non-zero padding: ${o}`);return r&&s>0&&c.push(o>>>0),c}function xc(e){dn(e);const t=2**8;return{encode:n=>{if(!nn(n))throw new Error("radix.encode input should be Uint8Array");return os(Array.from(n),t,e)},decode:n=>(qs("radix.decode",n),Uint8Array.from(os(n,e,t)))}}function Hs(e,t=!1){if(dn(e),e<=0||e>32)throw new Error("radix2: bits should be in (0..32]");if(Mr(8,e)>32||Mr(e,8)>32)throw new Error("radix2: carry overflow");return{encode:n=>{if(!nn(n))throw new Error("radix2.encode input should be Uint8Array");return Or(Array.from(n),8,e,!t)},decode:n=>(qs("radix2.decode",n),Uint8Array.from(Or(n,e,8,t)))}}function ra(e){return Ec(e),function(...t){try{return e.apply(null,t)}catch{}}}function Sc(e,t){return dn(e),Ec(t),{encode(n){if(!nn(n))throw new Error("checksum.encode: input should be Uint8Array");const r=t(n).slice(0,e),o=new Uint8Array(n.length+e);return o.set(n),o.set(r,n.length),o},decode(n){if(!nn(n))throw new Error("checksum.decode: input should be Uint8Array");const r=n.slice(0,-e),o=n.slice(-e),s=t(r).slice(0,e);for(let i=0;i<e;i++)if(s[i]!==o[i])throw new Error("Invalid checksum");return r}}}const nr={alphabet:eo,chain:Gn,checksum:Sc,convertRadix:os,convertRadix2:Or,radix:xc,radix2:Hs,join:to,padding:kc},kf=typeof Uint8Array.from([]).toBase64=="function"&&typeof Uint8Array.fromBase64=="function",_f=(e,t)=>{Bt("base64",e);const n=/^[A-Za-z0-9=+/]+$/,r="base64";if(e.length>0&&!n.test(e))throw new Error("invalid base64");return Uint8Array.fromBase64(e,{alphabet:r,lastChunkHandling:"strict"})},Ge=kf?{encode(e){return Ef(e),e.toBase64()},decode(e){return _f(e)}}:Gn(Hs(6),eo("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"),kc(6),to("")),xf=e=>Gn(xc(58),eo(e),to("")),Sf=xf("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"),If=e=>Gn(Sc(4,t=>e(e(t))),Sf),ss=Gn(eo("qpzry9x8gf2tvdw0s3jn54khce6mua7l"),to("")),oa=[996825010,642813549,513874426,1027748829,705979059];function gn(e){const t=e>>25;let n=(e&33554431)<<5;for(let r=0;r<oa.length;r++)(t>>r&1)===1&&(n^=oa[r]);return n}function sa(e,t,n=1){const r=e.length;let o=1;for(let s=0;s<r;s++){const i=e.charCodeAt(s);if(i<33||i>126)throw new Error(`Invalid prefix (${e})`);o=gn(o)^i>>5}o=gn(o);for(let s=0;s<r;s++)o=gn(o)^e.charCodeAt(s)&31;for(let s of t)o=gn(o)^s;for(let s=0;s<6;s++)o=gn(o);return o^=n,ss.encode(Or([o%br[30]],30,5,!1))}function Rf(e){const t=e==="bech32"?1:734539939,n=Hs(5),r=n.decode,o=n.encode,s=ra(r);function i(u,f,h=90){Bt("bech32.encode prefix",u),nn(f)&&(f=Array.from(f)),qs("bech32.encode",f);const p=u.length;if(p===0)throw new TypeError(`Invalid prefix length ${p}`);const m=p+7+f.length;if(h!==!1&&m>h)throw new TypeError(`Length ${m} exceeds limit ${h}`);const y=u.toLowerCase(),b=sa(y,f,t);return`${y}1${ss.encode(f)}${b}`}function a(u,f=90){Bt("bech32.decode input",u);const h=u.length;if(h<8||f!==!1&&h>f)throw new TypeError(`invalid string length: ${h} (${u}). Expected (8..${f})`);const p=u.toLowerCase();if(u!==p&&u!==u.toUpperCase())throw new Error("String must be lowercase or uppercase");const m=p.lastIndexOf("1");if(m===0||m===-1)throw new Error('Letter "1" must be present between prefix and data only');const y=p.slice(0,m),b=p.slice(m+1);if(b.length<6)throw new Error("Data must be at least 6 characters long");const E=ss.decode(b).slice(0,-6),L=sa(y,E,t);if(!b.endsWith(L))throw new Error(`Invalid checksum in ${u}: expected "${L}"`);return{prefix:y,words:E}}const c=ra(a);function l(u){const{prefix:f,words:h}=a(u,!1);return{prefix:f,words:h,bytes:r(h)}}function d(u,f){return i(u,o(f))}return{encode:i,decode:a,encodeFromBytes:d,decodeToBytes:l,decodeUnsafe:c,fromWords:r,fromWordsUnsafe:s,toWords:o}}const Ke=Rf("bech32");const Af=e=>e[0]==="あいこくしん";function Ic(e){if(typeof e!="string")throw new TypeError("invalid mnemonic type: "+typeof e);return e.normalize("NFKD")}function Rc(e){const t=Ic(e),n=t.split(" ");if(![12,15,18,21,24].includes(n.length))throw new Error("Invalid mnemonic");return{nfkd:t,words:n}}function Ac(e){if(G(e),![16,20,24,28,32].includes(e.length))throw new Error("invalid entropy length")}function Cf(e,t=128){if(Ae(t),t%32!==0||t>256)throw new TypeError("Invalid entropy");return Nf(wt(t/8),e)}const Tf=e=>{const t=8-e.length/4;return new Uint8Array([se(e)[0]>>t<<t])};function Cc(e){if(!Array.isArray(e)||e.length!==2048||typeof e[0]!="string")throw new Error("Wordlist: expected array of 2048 strings");return e.forEach(t=>{if(typeof t!="string")throw new Error("wordlist: non-string element: "+t)}),nr.chain(nr.checksum(1,Tf),nr.radix2(11,!0),nr.alphabet(e))}function Lf(e,t){const{words:n}=Rc(e),r=Cc(t).decode(n);return Ac(r),r}function Nf(e,t){return Ac(e),Cc(t).encode(e).join(Af(t)?"　":" ")}function $f(e,t){try{Lf(e,t)}catch{return!1}return!0}const Mf=e=>Ic("mnemonic"+e);function Of(e,t=""){return nf(rs,Rc(e).nfkd,Mf(t),{c:2048,dkLen:64})}const Tc=`abandon
ability
able
about
above
absent
absorb
abstract
absurd
abuse
access
accident
account
accuse
achieve
acid
acoustic
acquire
across
act
action
actor
actress
actual
adapt
add
addict
address
adjust
admit
adult
advance
advice
aerobic
affair
afford
afraid
again
age
agent
agree
ahead
aim
air
airport
aisle
alarm
album
alcohol
alert
alien
all
alley
allow
almost
alone
alpha
already
also
alter
always
amateur
amazing
among
amount
amused
analyst
anchor
ancient
anger
angle
angry
animal
ankle
announce
annual
another
answer
antenna
antique
anxiety
any
apart
apology
appear
apple
approve
april
arch
arctic
area
arena
argue
arm
armed
armor
army
around
arrange
arrest
arrive
arrow
art
artefact
artist
artwork
ask
aspect
assault
asset
assist
assume
asthma
athlete
atom
attack
attend
attitude
attract
auction
audit
august
aunt
author
auto
autumn
average
avocado
avoid
awake
aware
away
awesome
awful
awkward
axis
baby
bachelor
bacon
badge
bag
balance
balcony
ball
bamboo
banana
banner
bar
barely
bargain
barrel
base
basic
basket
battle
beach
bean
beauty
because
become
beef
before
begin
behave
behind
believe
below
belt
bench
benefit
best
betray
better
between
beyond
bicycle
bid
bike
bind
biology
bird
birth
bitter
black
blade
blame
blanket
blast
bleak
bless
blind
blood
blossom
blouse
blue
blur
blush
board
boat
body
boil
bomb
bone
bonus
book
boost
border
boring
borrow
boss
bottom
bounce
box
boy
bracket
brain
brand
brass
brave
bread
breeze
brick
bridge
brief
bright
bring
brisk
broccoli
broken
bronze
broom
brother
brown
brush
bubble
buddy
budget
buffalo
build
bulb
bulk
bullet
bundle
bunker
burden
burger
burst
bus
business
busy
butter
buyer
buzz
cabbage
cabin
cable
cactus
cage
cake
call
calm
camera
camp
can
canal
cancel
candy
cannon
canoe
canvas
canyon
capable
capital
captain
car
carbon
card
cargo
carpet
carry
cart
case
cash
casino
castle
casual
cat
catalog
catch
category
cattle
caught
cause
caution
cave
ceiling
celery
cement
census
century
cereal
certain
chair
chalk
champion
change
chaos
chapter
charge
chase
chat
cheap
check
cheese
chef
cherry
chest
chicken
chief
child
chimney
choice
choose
chronic
chuckle
chunk
churn
cigar
cinnamon
circle
citizen
city
civil
claim
clap
clarify
claw
clay
clean
clerk
clever
click
client
cliff
climb
clinic
clip
clock
clog
close
cloth
cloud
clown
club
clump
cluster
clutch
coach
coast
coconut
code
coffee
coil
coin
collect
color
column
combine
come
comfort
comic
common
company
concert
conduct
confirm
congress
connect
consider
control
convince
cook
cool
copper
copy
coral
core
corn
correct
cost
cotton
couch
country
couple
course
cousin
cover
coyote
crack
cradle
craft
cram
crane
crash
crater
crawl
crazy
cream
credit
creek
crew
cricket
crime
crisp
critic
crop
cross
crouch
crowd
crucial
cruel
cruise
crumble
crunch
crush
cry
crystal
cube
culture
cup
cupboard
curious
current
curtain
curve
cushion
custom
cute
cycle
dad
damage
damp
dance
danger
daring
dash
daughter
dawn
day
deal
debate
debris
decade
december
decide
decline
decorate
decrease
deer
defense
define
defy
degree
delay
deliver
demand
demise
denial
dentist
deny
depart
depend
deposit
depth
deputy
derive
describe
desert
design
desk
despair
destroy
detail
detect
develop
device
devote
diagram
dial
diamond
diary
dice
diesel
diet
differ
digital
dignity
dilemma
dinner
dinosaur
direct
dirt
disagree
discover
disease
dish
dismiss
disorder
display
distance
divert
divide
divorce
dizzy
doctor
document
dog
doll
dolphin
domain
donate
donkey
donor
door
dose
double
dove
draft
dragon
drama
drastic
draw
dream
dress
drift
drill
drink
drip
drive
drop
drum
dry
duck
dumb
dune
during
dust
dutch
duty
dwarf
dynamic
eager
eagle
early
earn
earth
easily
east
easy
echo
ecology
economy
edge
edit
educate
effort
egg
eight
either
elbow
elder
electric
elegant
element
elephant
elevator
elite
else
embark
embody
embrace
emerge
emotion
employ
empower
empty
enable
enact
end
endless
endorse
enemy
energy
enforce
engage
engine
enhance
enjoy
enlist
enough
enrich
enroll
ensure
enter
entire
entry
envelope
episode
equal
equip
era
erase
erode
erosion
error
erupt
escape
essay
essence
estate
eternal
ethics
evidence
evil
evoke
evolve
exact
example
excess
exchange
excite
exclude
excuse
execute
exercise
exhaust
exhibit
exile
exist
exit
exotic
expand
expect
expire
explain
expose
express
extend
extra
eye
eyebrow
fabric
face
faculty
fade
faint
faith
fall
false
fame
family
famous
fan
fancy
fantasy
farm
fashion
fat
fatal
father
fatigue
fault
favorite
feature
february
federal
fee
feed
feel
female
fence
festival
fetch
fever
few
fiber
fiction
field
figure
file
film
filter
final
find
fine
finger
finish
fire
firm
first
fiscal
fish
fit
fitness
fix
flag
flame
flash
flat
flavor
flee
flight
flip
float
flock
floor
flower
fluid
flush
fly
foam
focus
fog
foil
fold
follow
food
foot
force
forest
forget
fork
fortune
forum
forward
fossil
foster
found
fox
fragile
frame
frequent
fresh
friend
fringe
frog
front
frost
frown
frozen
fruit
fuel
fun
funny
furnace
fury
future
gadget
gain
galaxy
gallery
game
gap
garage
garbage
garden
garlic
garment
gas
gasp
gate
gather
gauge
gaze
general
genius
genre
gentle
genuine
gesture
ghost
giant
gift
giggle
ginger
giraffe
girl
give
glad
glance
glare
glass
glide
glimpse
globe
gloom
glory
glove
glow
glue
goat
goddess
gold
good
goose
gorilla
gospel
gossip
govern
gown
grab
grace
grain
grant
grape
grass
gravity
great
green
grid
grief
grit
grocery
group
grow
grunt
guard
guess
guide
guilt
guitar
gun
gym
habit
hair
half
hammer
hamster
hand
happy
harbor
hard
harsh
harvest
hat
have
hawk
hazard
head
health
heart
heavy
hedgehog
height
hello
helmet
help
hen
hero
hidden
high
hill
hint
hip
hire
history
hobby
hockey
hold
hole
holiday
hollow
home
honey
hood
hope
horn
horror
horse
hospital
host
hotel
hour
hover
hub
huge
human
humble
humor
hundred
hungry
hunt
hurdle
hurry
hurt
husband
hybrid
ice
icon
idea
identify
idle
ignore
ill
illegal
illness
image
imitate
immense
immune
impact
impose
improve
impulse
inch
include
income
increase
index
indicate
indoor
industry
infant
inflict
inform
inhale
inherit
initial
inject
injury
inmate
inner
innocent
input
inquiry
insane
insect
inside
inspire
install
intact
interest
into
invest
invite
involve
iron
island
isolate
issue
item
ivory
jacket
jaguar
jar
jazz
jealous
jeans
jelly
jewel
job
join
joke
journey
joy
judge
juice
jump
jungle
junior
junk
just
kangaroo
keen
keep
ketchup
key
kick
kid
kidney
kind
kingdom
kiss
kit
kitchen
kite
kitten
kiwi
knee
knife
knock
know
lab
label
labor
ladder
lady
lake
lamp
language
laptop
large
later
latin
laugh
laundry
lava
law
lawn
lawsuit
layer
lazy
leader
leaf
learn
leave
lecture
left
leg
legal
legend
leisure
lemon
lend
length
lens
leopard
lesson
letter
level
liar
liberty
library
license
life
lift
light
like
limb
limit
link
lion
liquid
list
little
live
lizard
load
loan
lobster
local
lock
logic
lonely
long
loop
lottery
loud
lounge
love
loyal
lucky
luggage
lumber
lunar
lunch
luxury
lyrics
machine
mad
magic
magnet
maid
mail
main
major
make
mammal
man
manage
mandate
mango
mansion
manual
maple
marble
march
margin
marine
market
marriage
mask
mass
master
match
material
math
matrix
matter
maximum
maze
meadow
mean
measure
meat
mechanic
medal
media
melody
melt
member
memory
mention
menu
mercy
merge
merit
merry
mesh
message
metal
method
middle
midnight
milk
million
mimic
mind
minimum
minor
minute
miracle
mirror
misery
miss
mistake
mix
mixed
mixture
mobile
model
modify
mom
moment
monitor
monkey
monster
month
moon
moral
more
morning
mosquito
mother
motion
motor
mountain
mouse
move
movie
much
muffin
mule
multiply
muscle
museum
mushroom
music
must
mutual
myself
mystery
myth
naive
name
napkin
narrow
nasty
nation
nature
near
neck
need
negative
neglect
neither
nephew
nerve
nest
net
network
neutral
never
news
next
nice
night
noble
noise
nominee
noodle
normal
north
nose
notable
note
nothing
notice
novel
now
nuclear
number
nurse
nut
oak
obey
object
oblige
obscure
observe
obtain
obvious
occur
ocean
october
odor
off
offer
office
often
oil
okay
old
olive
olympic
omit
once
one
onion
online
only
open
opera
opinion
oppose
option
orange
orbit
orchard
order
ordinary
organ
orient
original
orphan
ostrich
other
outdoor
outer
output
outside
oval
oven
over
own
owner
oxygen
oyster
ozone
pact
paddle
page
pair
palace
palm
panda
panel
panic
panther
paper
parade
parent
park
parrot
party
pass
patch
path
patient
patrol
pattern
pause
pave
payment
peace
peanut
pear
peasant
pelican
pen
penalty
pencil
people
pepper
perfect
permit
person
pet
phone
photo
phrase
physical
piano
picnic
picture
piece
pig
pigeon
pill
pilot
pink
pioneer
pipe
pistol
pitch
pizza
place
planet
plastic
plate
play
please
pledge
pluck
plug
plunge
poem
poet
point
polar
pole
police
pond
pony
pool
popular
portion
position
possible
post
potato
pottery
poverty
powder
power
practice
praise
predict
prefer
prepare
present
pretty
prevent
price
pride
primary
print
priority
prison
private
prize
problem
process
produce
profit
program
project
promote
proof
property
prosper
protect
proud
provide
public
pudding
pull
pulp
pulse
pumpkin
punch
pupil
puppy
purchase
purity
purpose
purse
push
put
puzzle
pyramid
quality
quantum
quarter
question
quick
quit
quiz
quote
rabbit
raccoon
race
rack
radar
radio
rail
rain
raise
rally
ramp
ranch
random
range
rapid
rare
rate
rather
raven
raw
razor
ready
real
reason
rebel
rebuild
recall
receive
recipe
record
recycle
reduce
reflect
reform
refuse
region
regret
regular
reject
relax
release
relief
rely
remain
remember
remind
remove
render
renew
rent
reopen
repair
repeat
replace
report
require
rescue
resemble
resist
resource
response
result
retire
retreat
return
reunion
reveal
review
reward
rhythm
rib
ribbon
rice
rich
ride
ridge
rifle
right
rigid
ring
riot
ripple
risk
ritual
rival
river
road
roast
robot
robust
rocket
romance
roof
rookie
room
rose
rotate
rough
round
route
royal
rubber
rude
rug
rule
run
runway
rural
sad
saddle
sadness
safe
sail
salad
salmon
salon
salt
salute
same
sample
sand
satisfy
satoshi
sauce
sausage
save
say
scale
scan
scare
scatter
scene
scheme
school
science
scissors
scorpion
scout
scrap
screen
script
scrub
sea
search
season
seat
second
secret
section
security
seed
seek
segment
select
sell
seminar
senior
sense
sentence
series
service
session
settle
setup
seven
shadow
shaft
shallow
share
shed
shell
sheriff
shield
shift
shine
ship
shiver
shock
shoe
shoot
shop
short
shoulder
shove
shrimp
shrug
shuffle
shy
sibling
sick
side
siege
sight
sign
silent
silk
silly
silver
similar
simple
since
sing
siren
sister
situate
six
size
skate
sketch
ski
skill
skin
skirt
skull
slab
slam
sleep
slender
slice
slide
slight
slim
slogan
slot
slow
slush
small
smart
smile
smoke
smooth
snack
snake
snap
sniff
snow
soap
soccer
social
sock
soda
soft
solar
soldier
solid
solution
solve
someone
song
soon
sorry
sort
soul
sound
soup
source
south
space
spare
spatial
spawn
speak
special
speed
spell
spend
sphere
spice
spider
spike
spin
spirit
split
spoil
sponsor
spoon
sport
spot
spray
spread
spring
spy
square
squeeze
squirrel
stable
stadium
staff
stage
stairs
stamp
stand
start
state
stay
steak
steel
stem
step
stereo
stick
still
sting
stock
stomach
stone
stool
story
stove
strategy
street
strike
strong
struggle
student
stuff
stumble
style
subject
submit
subway
success
such
sudden
suffer
sugar
suggest
suit
summer
sun
sunny
sunset
super
supply
supreme
sure
surface
surge
surprise
surround
survey
suspect
sustain
swallow
swamp
swap
swarm
swear
sweet
swift
swim
swing
switch
sword
symbol
symptom
syrup
system
table
tackle
tag
tail
talent
talk
tank
tape
target
task
taste
tattoo
taxi
teach
team
tell
ten
tenant
tennis
tent
term
test
text
thank
that
theme
then
theory
there
they
thing
this
thought
three
thrive
throw
thumb
thunder
ticket
tide
tiger
tilt
timber
time
tiny
tip
tired
tissue
title
toast
tobacco
today
toddler
toe
together
toilet
token
tomato
tomorrow
tone
tongue
tonight
tool
tooth
top
topic
topple
torch
tornado
tortoise
toss
total
tourist
toward
tower
town
toy
track
trade
traffic
tragic
train
transfer
trap
trash
travel
tray
treat
tree
trend
trial
tribe
trick
trigger
trim
trip
trophy
trouble
truck
true
truly
trumpet
trust
truth
try
tube
tuition
tumble
tuna
tunnel
turkey
turn
turtle
twelve
twenty
twice
twin
twist
two
type
typical
ugly
umbrella
unable
unaware
uncle
uncover
under
undo
unfair
unfold
unhappy
uniform
unique
unit
universe
unknown
unlock
until
unusual
unveil
update
upgrade
uphold
upon
upper
upset
urban
urge
usage
use
used
useful
useless
usual
utility
vacant
vacuum
vague
valid
valley
valve
van
vanish
vapor
various
vast
vault
vehicle
velvet
vendor
venture
venue
verb
verify
version
very
vessel
veteran
viable
vibrant
vicious
victory
video
view
village
vintage
violin
virtual
virus
visa
visit
visual
vital
vivid
vocal
voice
void
volcano
volume
vote
voyage
wage
wagon
wait
walk
wall
walnut
want
warfare
warm
warrior
wash
wasp
waste
water
wave
way
wealth
weapon
wear
weasel
weather
web
wedding
weekend
weird
welcome
west
wet
whale
what
wheat
wheel
when
where
whip
whisper
wide
width
wife
wild
will
win
window
wine
wing
wink
winner
winter
wire
wisdom
wise
wish
witness
wolf
woman
wonder
wood
wool
word
work
world
worry
worth
wrap
wreck
wrestle
wrist
write
wrong
yard
year
yellow
you
young
youth
zebra
zero
zone
zoo`.split(`
`);const Fs=BigInt(0),is=BigInt(1);function Br(e,t=""){if(typeof e!="boolean"){const n=t&&`"${t}" `;throw new Error(n+"expected boolean, got type="+typeof e)}return e}function Lc(e){if(typeof e=="bigint"){if(!vr(e))throw new Error("positive bigint expected, got "+e)}else Ae(e);return e}function rr(e){const t=Lc(e).toString(16);return t.length&1?"0"+t:t}function Nc(e){if(typeof e!="string")throw new Error("hex string expected, got "+typeof e);return e===""?Fs:BigInt("0x"+e)}function Kn(e){return Nc(q(e))}function $c(e){return Nc(q(Bf(G(e)).reverse()))}function Gs(e,t){Ae(t),e=Lc(e);const n=z(e.toString(16).padStart(t*2,"0"));if(n.length!==t)throw new Error("number too large");return n}function Mc(e,t){return Gs(e,t).reverse()}function Bf(e){return Uint8Array.from(e)}function Pf(e){return Uint8Array.from(e,(t,n)=>{const r=t.charCodeAt(0);if(t.length!==1||r>127)throw new Error(`string contains non-ASCII character "${e[n]}" with code ${r} at position ${n}`);return r})}const vr=e=>typeof e=="bigint"&&Fs<=e;function Uf(e,t,n){return vr(e)&&vr(t)&&vr(n)&&t<=e&&e<n}function Df(e,t,n,r){if(!Uf(t,n,r))throw new Error("expected valid "+e+": "+n+" <= n < "+r+", got "+t)}function jf(e){let t;for(t=0;e>Fs;e>>=is,t+=1);return t}const Ks=e=>(is<<BigInt(e))-is;function qf(e,t,n){if(Ae(e,"hashLen"),Ae(t,"qByteLen"),typeof n!="function")throw new Error("hmacFn must be a function");const r=y=>new Uint8Array(y),o=Uint8Array.of(),s=Uint8Array.of(0),i=Uint8Array.of(1),a=1e3;let c=r(e),l=r(e),d=0;const u=()=>{c.fill(1),l.fill(0),d=0},f=(...y)=>n(l,oe(c,...y)),h=(y=o)=>{l=f(s,y),c=f(),y.length!==0&&(l=f(i,y),c=f())},p=()=>{if(d++>=a)throw new Error("drbg: tried max amount of iterations");let y=0;const b=[];for(;y<t;){c=f();const E=c.slice();b.push(E),y+=c.length}return oe(...b)};return(y,b)=>{u(),h(y);let E;for(;!(E=b(p()));)h();return u(),E}}function Vs(e,t={},n={}){if(!e||typeof e!="object")throw new Error("expected valid options object");function r(s,i,a){const c=e[s];if(a&&c===void 0)return;const l=typeof c;if(l!==i||c===null)throw new Error(`param "${s}" is invalid: expected ${i}, got ${l}`)}const o=(s,i)=>Object.entries(s).forEach(([a,c])=>r(a,c,i));o(t,!1),o(n,!0)}function ia(e){const t=new WeakMap;return(n,...r)=>{const o=t.get(n);if(o!==void 0)return o;const s=e(n,...r);return t.set(n,s),s}}const be=BigInt(0),me=BigInt(1),It=BigInt(2),Oc=BigInt(3),Bc=BigInt(4),Pc=BigInt(5),Hf=BigInt(7),Uc=BigInt(8),Ff=BigInt(9),Dc=BigInt(16);function Te(e,t){const n=e%t;return n>=be?n:t+n}function _e(e,t,n){let r=e;for(;t-- >be;)r*=r,r%=n;return r}function aa(e,t){if(e===be)throw new Error("invert: expected non-zero number");if(t<=be)throw new Error("invert: expected positive modulus, got "+t);let n=Te(e,t),r=t,o=be,s=me;for(;n!==be;){const a=r/n,c=r%n,l=o-s*a;r=n,n=c,o=s,s=l}if(r!==me)throw new Error("invert: does not exist");return Te(o,t)}function Ws(e,t,n){if(!e.eql(e.sqr(t),n))throw new Error("Cannot find square root")}function jc(e,t){const n=(e.ORDER+me)/Bc,r=e.pow(t,n);return Ws(e,r,t),r}function Gf(e,t){const n=(e.ORDER-Pc)/Uc,r=e.mul(t,It),o=e.pow(r,n),s=e.mul(t,o),i=e.mul(e.mul(s,It),o),a=e.mul(s,e.sub(i,e.ONE));return Ws(e,a,t),a}function Kf(e){const t=no(e),n=qc(e),r=n(t,t.neg(t.ONE)),o=n(t,r),s=n(t,t.neg(r)),i=(e+Hf)/Dc;return(a,c)=>{let l=a.pow(c,i),d=a.mul(l,r);const u=a.mul(l,o),f=a.mul(l,s),h=a.eql(a.sqr(d),c),p=a.eql(a.sqr(u),c);l=a.cmov(l,d,h),d=a.cmov(f,u,p);const m=a.eql(a.sqr(d),c),y=a.cmov(l,d,m);return Ws(a,y,c),y}}function qc(e){if(e<Oc)throw new Error("sqrt is not defined for small field");let t=e-me,n=0;for(;t%It===be;)t/=It,n++;let r=It;const o=no(e);for(;ca(o,r)===1;)if(r++>1e3)throw new Error("Cannot find square root: probably non-prime P");if(n===1)return jc;let s=o.pow(r,t);const i=(t+me)/It;return function(c,l){if(c.is0(l))return l;if(ca(c,l)!==1)throw new Error("Cannot find square root");let d=n,u=c.mul(c.ONE,s),f=c.pow(l,t),h=c.pow(l,i);for(;!c.eql(f,c.ONE);){if(c.is0(f))return c.ZERO;let p=1,m=c.sqr(f);for(;!c.eql(m,c.ONE);)if(p++,m=c.sqr(m),p===d)throw new Error("Cannot find square root");const y=me<<BigInt(d-p-1),b=c.pow(u,y);d=p,u=c.sqr(b),f=c.mul(f,u),h=c.mul(h,b)}return h}}function Vf(e){return e%Bc===Oc?jc:e%Uc===Pc?Gf:e%Dc===Ff?Kf(e):qc(e)}const Wf=["create","isValid","is0","neg","inv","sqrt","sqr","eql","add","sub","mul","pow","div","addN","subN","mulN","sqrN"];function zf(e){const t={ORDER:"bigint",BYTES:"number",BITS:"number"},n=Wf.reduce((r,o)=>(r[o]="function",r),t);return Vs(e,n),e}function Jf(e,t,n){if(n<be)throw new Error("invalid exponent, negatives unsupported");if(n===be)return e.ONE;if(n===me)return t;let r=e.ONE,o=t;for(;n>be;)n&me&&(r=e.mul(r,o)),o=e.sqr(o),n>>=me;return r}function Hc(e,t,n=!1){const r=new Array(t.length).fill(n?e.ZERO:void 0),o=t.reduce((i,a,c)=>e.is0(a)?i:(r[c]=i,e.mul(i,a)),e.ONE),s=e.inv(o);return t.reduceRight((i,a,c)=>e.is0(a)?i:(r[c]=e.mul(i,r[c]),e.mul(i,a)),s),r}function ca(e,t){const n=(e.ORDER-me)/It,r=e.pow(t,n),o=e.eql(r,e.ONE),s=e.eql(r,e.ZERO),i=e.eql(r,e.neg(e.ONE));if(!o&&!s&&!i)throw new Error("invalid Legendre symbol result");return o?1:s?0:-1}function Yf(e,t){t!==void 0&&Ae(t);const n=t!==void 0?t:e.toString(2).length,r=Math.ceil(n/8);return{nBitLength:n,nByteLength:r}}class Zf{ORDER;BITS;BYTES;isLE;ZERO=be;ONE=me;_lengths;_sqrt;_mod;constructor(t,n={}){if(t<=be)throw new Error("invalid field: expected ORDER > 0, got "+t);let r;this.isLE=!1,n!=null&&typeof n=="object"&&(typeof n.BITS=="number"&&(r=n.BITS),typeof n.sqrt=="function"&&(this.sqrt=n.sqrt),typeof n.isLE=="boolean"&&(this.isLE=n.isLE),n.allowedLengths&&(this._lengths=n.allowedLengths?.slice()),typeof n.modFromBytes=="boolean"&&(this._mod=n.modFromBytes));const{nBitLength:o,nByteLength:s}=Yf(t,r);if(s>2048)throw new Error("invalid field: expected ORDER of <= 2048 bytes");this.ORDER=t,this.BITS=o,this.BYTES=s,this._sqrt=void 0,Object.preventExtensions(this)}create(t){return Te(t,this.ORDER)}isValid(t){if(typeof t!="bigint")throw new Error("invalid field element: expected bigint, got "+typeof t);return be<=t&&t<this.ORDER}is0(t){return t===be}isValidNot0(t){return!this.is0(t)&&this.isValid(t)}isOdd(t){return(t&me)===me}neg(t){return Te(-t,this.ORDER)}eql(t,n){return t===n}sqr(t){return Te(t*t,this.ORDER)}add(t,n){return Te(t+n,this.ORDER)}sub(t,n){return Te(t-n,this.ORDER)}mul(t,n){return Te(t*n,this.ORDER)}pow(t,n){return Jf(this,t,n)}div(t,n){return Te(t*aa(n,this.ORDER),this.ORDER)}sqrN(t){return t*t}addN(t,n){return t+n}subN(t,n){return t-n}mulN(t,n){return t*n}inv(t){return aa(t,this.ORDER)}sqrt(t){return this._sqrt||(this._sqrt=Vf(this.ORDER)),this._sqrt(this,t)}toBytes(t){return this.isLE?Mc(t,this.BYTES):Gs(t,this.BYTES)}fromBytes(t,n=!1){G(t);const{_lengths:r,BYTES:o,isLE:s,ORDER:i,_mod:a}=this;if(r){if(!r.includes(t.length)||t.length>o)throw new Error("Field.fromBytes: expected "+r+" bytes, got "+t.length);const l=new Uint8Array(o);l.set(t,s?0:l.length-t.length),t=l}if(t.length!==o)throw new Error("Field.fromBytes: expected "+o+" bytes, got "+t.length);let c=s?$c(t):Kn(t);if(a&&(c=Te(c,i)),!n&&!this.isValid(c))throw new Error("invalid field element: outside of range 0..ORDER");return c}invertBatch(t){return Hc(this,t)}cmov(t,n,r){return r?n:t}}function no(e,t={}){return new Zf(e,t)}function Fc(e){if(typeof e!="bigint")throw new Error("field order must be bigint");const t=e.toString(2).length;return Math.ceil(t/8)}function Gc(e){const t=Fc(e);return t+Math.ceil(t/2)}function Kc(e,t,n=!1){G(e);const r=e.length,o=Fc(t),s=Gc(t);if(r<16||r<s||r>1024)throw new Error("expected "+s+"-1024 bytes of input, got "+r);const i=n?$c(e):Kn(e),a=Te(i,t-me)+me;return n?Mc(a,o):Gs(a,o)}const rn=BigInt(0),Rt=BigInt(1);function Pr(e,t){const n=t.negate();return e?n:t}function la(e,t){const n=Hc(e.Fp,t.map(r=>r.Z));return t.map((r,o)=>e.fromAffine(r.toAffine(n[o])))}function Vc(e,t){if(!Number.isSafeInteger(e)||e<=0||e>t)throw new Error("invalid window size, expected [1.."+t+"], got W="+e)}function Ro(e,t){Vc(e,t);const n=Math.ceil(t/e)+1,r=2**(e-1),o=2**e,s=Ks(e),i=BigInt(e);return{windows:n,windowSize:r,mask:s,maxNumber:o,shiftBy:i}}function da(e,t,n){const{windowSize:r,mask:o,maxNumber:s,shiftBy:i}=n;let a=Number(e&o),c=e>>i;a>r&&(a-=s,c+=Rt);const l=t*r,d=l+Math.abs(a)-1,u=a===0,f=a<0,h=t%2!==0;return{nextN:c,offset:d,isZero:u,isNeg:f,isNegF:h,offsetF:l}}const Ao=new WeakMap,Wc=new WeakMap;function Co(e){return Wc.get(e)||1}function ua(e){if(e!==rn)throw new Error("invalid wNAF")}class Xf{BASE;ZERO;Fn;bits;constructor(t,n){this.BASE=t.BASE,this.ZERO=t.ZERO,this.Fn=t.Fn,this.bits=n}_unsafeLadder(t,n,r=this.ZERO){let o=t;for(;n>rn;)n&Rt&&(r=r.add(o)),o=o.double(),n>>=Rt;return r}precomputeWindow(t,n){const{windows:r,windowSize:o}=Ro(n,this.bits),s=[];let i=t,a=i;for(let c=0;c<r;c++){a=i,s.push(a);for(let l=1;l<o;l++)a=a.add(i),s.push(a);i=a.double()}return s}wNAF(t,n,r){if(!this.Fn.isValid(r))throw new Error("invalid scalar");let o=this.ZERO,s=this.BASE;const i=Ro(t,this.bits);for(let a=0;a<i.windows;a++){const{nextN:c,offset:l,isZero:d,isNeg:u,isNegF:f,offsetF:h}=da(r,a,i);r=c,d?s=s.add(Pr(f,n[h])):o=o.add(Pr(u,n[l]))}return ua(r),{p:o,f:s}}wNAFUnsafe(t,n,r,o=this.ZERO){const s=Ro(t,this.bits);for(let i=0;i<s.windows&&r!==rn;i++){const{nextN:a,offset:c,isZero:l,isNeg:d}=da(r,i,s);if(r=a,!l){const u=n[c];o=o.add(d?u.negate():u)}}return ua(r),o}getPrecomputes(t,n,r){let o=Ao.get(n);return o||(o=this.precomputeWindow(n,t),t!==1&&(typeof r=="function"&&(o=r(o)),Ao.set(n,o))),o}cached(t,n,r){const o=Co(t);return this.wNAF(o,this.getPrecomputes(o,t,r),n)}unsafe(t,n,r,o){const s=Co(t);return s===1?this._unsafeLadder(t,n,o):this.wNAFUnsafe(s,this.getPrecomputes(s,t,r),n,o)}createCache(t,n){Vc(n,this.bits),Wc.set(t,n),Ao.delete(t)}hasCache(t){return Co(t)!==1}}function Qf(e,t,n,r){let o=t,s=e.ZERO,i=e.ZERO;for(;n>rn||r>rn;)n&Rt&&(s=s.add(o)),r&Rt&&(i=i.add(o)),o=o.double(),n>>=Rt,r>>=Rt;return{p1:s,p2:i}}function fa(e,t,n){if(t){if(t.ORDER!==e)throw new Error("Field.ORDER must match order: Fp == p, Fn == n");return zf(t),t}else return no(e,{isLE:n})}function eh(e,t,n={},r){if(r===void 0&&(r=e==="edwards"),!t||typeof t!="object")throw new Error(`expected valid ${e} CURVE object`);for(const c of["p","n","h"]){const l=t[c];if(!(typeof l=="bigint"&&l>rn))throw new Error(`CURVE.${c} must be positive bigint`)}const o=fa(t.p,n.Fp,r),s=fa(t.n,n.Fn,r),a=["Gx","Gy","a","b"];for(const c of a)if(!o.isValid(t[c]))throw new Error(`CURVE.${c} must be valid field element of CURVE.Fp`);return t=Object.freeze(Object.assign({},t)),{CURVE:t,Fp:o,Fn:s}}function zc(e,t){return function(r){const o=e(r);return{secretKey:o,publicKey:t(o)}}}const ha=(e,t)=>(e+(e>=0?t:-t)/Jc)/t;function th(e,t,n){const[[r,o],[s,i]]=t,a=ha(i*e,n),c=ha(-o*e,n);let l=e-a*r-c*s,d=-a*o-c*i;const u=l<Qe,f=d<Qe;u&&(l=-l),f&&(d=-d);const h=Ks(Math.ceil(jf(n)/2))+Zt;if(l<Qe||l>=h||d<Qe||d>=h)throw new Error("splitScalar (endomorphism): failed, k="+e);return{k1neg:u,k1:l,k2neg:f,k2:d}}function as(e){if(!["compact","recovered","der"].includes(e))throw new Error('Signature format must be "compact", "recovered", or "der"');return e}function To(e,t){const n={};for(let r of Object.keys(t))n[r]=e[r]===void 0?t[r]:e[r];return Br(n.lowS,"lowS"),Br(n.prehash,"prehash"),n.format!==void 0&&as(n.format),n}class nh extends Error{constructor(t=""){super(t)}}const pt={Err:nh,_tlv:{encode:(e,t)=>{const{Err:n}=pt;if(e<0||e>256)throw new n("tlv.encode: wrong tag");if(t.length&1)throw new n("tlv.encode: unpadded data");const r=t.length/2,o=rr(r);if(o.length/2&128)throw new n("tlv.encode: long form length too big");const s=r>127?rr(o.length/2|128):"";return rr(e)+s+o+t},decode(e,t){const{Err:n}=pt;let r=0;if(e<0||e>256)throw new n("tlv.encode: wrong tag");if(t.length<2||t[r++]!==e)throw new n("tlv.decode: wrong tlv");const o=t[r++],s=!!(o&128);let i=0;if(!s)i=o;else{const c=o&127;if(!c)throw new n("tlv.decode(long): indefinite length not supported");if(c>4)throw new n("tlv.decode(long): byte length is too big");const l=t.subarray(r,r+c);if(l.length!==c)throw new n("tlv.decode: length bytes not complete");if(l[0]===0)throw new n("tlv.decode(long): zero leftmost byte");for(const d of l)i=i<<8|d;if(r+=c,i<128)throw new n("tlv.decode(long): not minimal encoding")}const a=t.subarray(r,r+i);if(a.length!==i)throw new n("tlv.decode: wrong value length");return{v:a,l:t.subarray(r+i)}}},_int:{encode(e){const{Err:t}=pt;if(e<Qe)throw new t("integer: negative integers are not allowed");let n=rr(e);if(Number.parseInt(n[0],16)&8&&(n="00"+n),n.length&1)throw new t("unexpected DER parsing assertion: unpadded hex");return n},decode(e){const{Err:t}=pt;if(e[0]&128)throw new t("invalid signature integer: negative");if(e[0]===0&&!(e[1]&128))throw new t("invalid signature integer: unnecessary leading zero");return Kn(e)}},toSig(e){const{Err:t,_int:n,_tlv:r}=pt,o=G(e,void 0,"signature"),{v:s,l:i}=r.decode(48,o);if(i.length)throw new t("invalid signature: left bytes after parsing");const{v:a,l:c}=r.decode(2,s),{v:l,l:d}=r.decode(2,c);if(d.length)throw new t("invalid signature: left bytes after parsing");return{r:n.decode(a),s:n.decode(l)}},hexFromSig(e){const{_tlv:t,_int:n}=pt,r=t.encode(2,n.encode(e.r)),o=t.encode(2,n.encode(e.s)),s=r+o;return t.encode(48,s)}},Qe=BigInt(0),Zt=BigInt(1),Jc=BigInt(2),or=BigInt(3),rh=BigInt(4);function oh(e,t={}){const n=eh("weierstrass",e,t),{Fp:r,Fn:o}=n;let s=n.CURVE;const{h:i,n:a}=s;Vs(t,{},{allowInfinityPoint:"boolean",clearCofactor:"function",isTorsionFree:"function",fromBytes:"function",toBytes:"function",endo:"object"});const{endo:c}=t;if(c&&(!r.is0(s.a)||typeof c.beta!="bigint"||!Array.isArray(c.basises)))throw new Error('invalid endo: expected "beta": bigint and "basises": array');const l=Zc(r,o);function d(){if(!r.isOdd)throw new Error("compression is not supported: Field does not have .isOdd()")}function u(A,k,R){const{x:I,y:T}=k.toAffine(),C=r.toBytes(I);if(Br(R,"isCompressed"),R){d();const M=!r.isOdd(T);return oe(Yc(M),C)}else return oe(Uint8Array.of(4),C,r.toBytes(T))}function f(A){G(A,void 0,"Point");const{publicKey:k,publicKeyUncompressed:R}=l,I=A.length,T=A[0],C=A.subarray(1);if(I===k&&(T===2||T===3)){const M=r.fromBytes(C);if(!r.isValid(M))throw new Error("bad point: is not on curve, wrong x");const B=m(M);let P;try{P=r.sqrt(B)}catch(K){const Y=K instanceof Error?": "+K.message:"";throw new Error("bad point: is not on curve, sqrt error"+Y)}d();const U=r.isOdd(P);return(T&1)===1!==U&&(P=r.neg(P)),{x:M,y:P}}else if(I===R&&T===4){const M=r.BYTES,B=r.fromBytes(C.subarray(0,M)),P=r.fromBytes(C.subarray(M,M*2));if(!y(B,P))throw new Error("bad point: is not on curve");return{x:B,y:P}}else throw new Error(`bad point: got length ${I}, expected compressed=${k} or uncompressed=${R}`)}const h=t.toBytes||u,p=t.fromBytes||f;function m(A){const k=r.sqr(A),R=r.mul(k,A);return r.add(r.add(R,r.mul(A,s.a)),s.b)}function y(A,k){const R=r.sqr(k),I=m(A);return r.eql(R,I)}if(!y(s.Gx,s.Gy))throw new Error("bad curve params: generator point");const b=r.mul(r.pow(s.a,or),rh),E=r.mul(r.sqr(s.b),BigInt(27));if(r.is0(r.add(b,E)))throw new Error("bad curve params: a or b");function L(A,k,R=!1){if(!r.isValid(k)||R&&r.is0(k))throw new Error(`bad point coordinate ${A}`);return k}function O(A){if(!(A instanceof g))throw new Error("Weierstrass Point expected")}function N(A){if(!c||!c.basises)throw new Error("no endo");return th(A,c.basises,o.ORDER)}const $=ia((A,k)=>{const{X:R,Y:I,Z:T}=A;if(r.eql(T,r.ONE))return{x:R,y:I};const C=A.is0();k==null&&(k=C?r.ONE:r.inv(T));const M=r.mul(R,k),B=r.mul(I,k),P=r.mul(T,k);if(C)return{x:r.ZERO,y:r.ZERO};if(!r.eql(P,r.ONE))throw new Error("invZ was invalid");return{x:M,y:B}}),w=ia(A=>{if(A.is0()){if(t.allowInfinityPoint&&!r.is0(A.Y))return;throw new Error("bad point: ZERO")}const{x:k,y:R}=A.toAffine();if(!r.isValid(k)||!r.isValid(R))throw new Error("bad point: x or y not field elements");if(!y(k,R))throw new Error("bad point: equation left != right");if(!A.isTorsionFree())throw new Error("bad point: not in prime-order subgroup");return!0});function v(A,k,R,I,T){return R=new g(r.mul(R.X,A),R.Y,R.Z),k=Pr(I,k),R=Pr(T,R),k.add(R)}class g{static BASE=new g(s.Gx,s.Gy,r.ONE);static ZERO=new g(r.ZERO,r.ONE,r.ZERO);static Fp=r;static Fn=o;X;Y;Z;constructor(k,R,I){this.X=L("x",k),this.Y=L("y",R,!0),this.Z=L("z",I),Object.freeze(this)}static CURVE(){return s}static fromAffine(k){const{x:R,y:I}=k||{};if(!k||!r.isValid(R)||!r.isValid(I))throw new Error("invalid affine point");if(k instanceof g)throw new Error("projective point not allowed");return r.is0(R)&&r.is0(I)?g.ZERO:new g(R,I,r.ONE)}static fromBytes(k){const R=g.fromAffine(p(G(k,void 0,"point")));return R.assertValidity(),R}static fromHex(k){return g.fromBytes(z(k))}get x(){return this.toAffine().x}get y(){return this.toAffine().y}precompute(k=8,R=!0){return S.createCache(this,k),R||this.multiply(or),this}assertValidity(){w(this)}hasEvenY(){const{y:k}=this.toAffine();if(!r.isOdd)throw new Error("Field doesn't support isOdd");return!r.isOdd(k)}equals(k){O(k);const{X:R,Y:I,Z:T}=this,{X:C,Y:M,Z:B}=k,P=r.eql(r.mul(R,B),r.mul(C,T)),U=r.eql(r.mul(I,B),r.mul(M,T));return P&&U}negate(){return new g(this.X,r.neg(this.Y),this.Z)}double(){const{a:k,b:R}=s,I=r.mul(R,or),{X:T,Y:C,Z:M}=this;let B=r.ZERO,P=r.ZERO,U=r.ZERO,D=r.mul(T,T),K=r.mul(C,C),Y=r.mul(M,M),V=r.mul(T,C);return V=r.add(V,V),U=r.mul(T,M),U=r.add(U,U),B=r.mul(k,U),P=r.mul(I,Y),P=r.add(B,P),B=r.sub(K,P),P=r.add(K,P),P=r.mul(B,P),B=r.mul(V,B),U=r.mul(I,U),Y=r.mul(k,Y),V=r.sub(D,Y),V=r.mul(k,V),V=r.add(V,U),U=r.add(D,D),D=r.add(U,D),D=r.add(D,Y),D=r.mul(D,V),P=r.add(P,D),Y=r.mul(C,M),Y=r.add(Y,Y),D=r.mul(Y,V),B=r.sub(B,D),U=r.mul(Y,K),U=r.add(U,U),U=r.add(U,U),new g(B,P,U)}add(k){O(k);const{X:R,Y:I,Z:T}=this,{X:C,Y:M,Z:B}=k;let P=r.ZERO,U=r.ZERO,D=r.ZERO;const K=s.a,Y=r.mul(s.b,or);let V=r.mul(R,C),ne=r.mul(I,M),ie=r.mul(T,B),Me=r.add(R,I),re=r.add(C,M);Me=r.mul(Me,re),re=r.add(V,ne),Me=r.sub(Me,re),re=r.add(R,T);let le=r.add(C,B);return re=r.mul(re,le),le=r.add(V,ie),re=r.sub(re,le),le=r.add(I,T),P=r.add(M,B),le=r.mul(le,P),P=r.add(ne,ie),le=r.sub(le,P),D=r.mul(K,re),P=r.mul(Y,ie),D=r.add(P,D),P=r.sub(ne,D),D=r.add(ne,D),U=r.mul(P,D),ne=r.add(V,V),ne=r.add(ne,V),ie=r.mul(K,ie),re=r.mul(Y,re),ne=r.add(ne,ie),ie=r.sub(V,ie),ie=r.mul(K,ie),re=r.add(re,ie),V=r.mul(ne,re),U=r.add(U,V),V=r.mul(le,re),P=r.mul(Me,P),P=r.sub(P,V),V=r.mul(Me,ne),D=r.mul(le,D),D=r.add(D,V),new g(P,U,D)}subtract(k){return this.add(k.negate())}is0(){return this.equals(g.ZERO)}multiply(k){const{endo:R}=t;if(!o.isValidNot0(k))throw new Error("invalid scalar: out of range");let I,T;const C=M=>S.cached(this,M,B=>la(g,B));if(R){const{k1neg:M,k1:B,k2neg:P,k2:U}=N(k),{p:D,f:K}=C(B),{p:Y,f:V}=C(U);T=K.add(V),I=v(R.beta,D,Y,M,P)}else{const{p:M,f:B}=C(k);I=M,T=B}return la(g,[I,T])[0]}multiplyUnsafe(k){const{endo:R}=t,I=this;if(!o.isValid(k))throw new Error("invalid scalar: out of range");if(k===Qe||I.is0())return g.ZERO;if(k===Zt)return I;if(S.hasCache(this))return this.multiply(k);if(R){const{k1neg:T,k1:C,k2neg:M,k2:B}=N(k),{p1:P,p2:U}=Qf(g,I,C,B);return v(R.beta,P,U,T,M)}else return S.unsafe(I,k)}toAffine(k){return $(this,k)}isTorsionFree(){const{isTorsionFree:k}=t;return i===Zt?!0:k?k(g,this):S.unsafe(this,a).is0()}clearCofactor(){const{clearCofactor:k}=t;return i===Zt?this:k?k(g,this):this.multiplyUnsafe(i)}isSmallOrder(){return this.multiplyUnsafe(i).is0()}toBytes(k=!0){return Br(k,"isCompressed"),this.assertValidity(),h(g,this,k)}toHex(k=!0){return q(this.toBytes(k))}toString(){return`<Point ${this.is0()?"ZERO":this.toHex()}>`}}const x=o.BITS,S=new Xf(g,t.endo?Math.ceil(x/2):x);return g.BASE.precompute(8),g}function Yc(e){return Uint8Array.of(e?2:3)}function Zc(e,t){return{secretKey:t.BYTES,publicKey:1+e.BYTES,publicKeyUncompressed:1+2*e.BYTES,publicKeyHasPrefix:!0,signature:2*t.BYTES}}function sh(e,t={}){const{Fn:n}=e,r=t.randomBytes||wt,o=Object.assign(Zc(e.Fp,n),{seed:Gc(n.ORDER)});function s(h){try{const p=n.fromBytes(h);return n.isValidNot0(p)}catch{return!1}}function i(h,p){const{publicKey:m,publicKeyUncompressed:y}=o;try{const b=h.length;return p===!0&&b!==m||p===!1&&b!==y?!1:!!e.fromBytes(h)}catch{return!1}}function a(h=r(o.seed)){return Kc(G(h,o.seed,"seed"),n.ORDER)}function c(h,p=!0){return e.BASE.multiply(n.fromBytes(h)).toBytes(p)}function l(h){const{secretKey:p,publicKey:m,publicKeyUncompressed:y}=o;if(!Us(h)||"_lengths"in n&&n._lengths||p===m)return;const b=G(h,void 0,"key").length;return b===m||b===y}function d(h,p,m=!0){if(l(h)===!0)throw new Error("first arg must be private key");if(l(p)===!1)throw new Error("second arg must be public key");const y=n.fromBytes(h);return e.fromBytes(p).multiply(y).toBytes(m)}const u={isValidSecretKey:s,isValidPublicKey:i,randomSecretKey:a},f=zc(a,c);return Object.freeze({getPublicKey:c,getSharedSecret:d,keygen:f,Point:e,utils:u,lengths:o})}function ih(e,t,n={}){Fn(t),Vs(n,{},{hmac:"function",lowS:"boolean",randomBytes:"function",bits2int:"function",bits2int_modN:"function"}),n=Object.assign({},n);const r=n.randomBytes||wt,o=n.hmac||((R,I)=>nt(t,R,I)),{Fp:s,Fn:i}=e,{ORDER:a,BITS:c}=i,{keygen:l,getPublicKey:d,getSharedSecret:u,utils:f,lengths:h}=sh(e,n),p={prehash:!0,lowS:typeof n.lowS=="boolean"?n.lowS:!0,format:"compact",extraEntropy:!1},m=a*Jc<s.ORDER;function y(R){const I=a>>Zt;return R>I}function b(R,I){if(!i.isValidNot0(I))throw new Error(`invalid signature ${R}: out of range 1..Point.Fn.ORDER`);return I}function E(){if(m)throw new Error('"recovered" sig type is not supported for cofactor >2 curves')}function L(R,I){as(I);const T=h.signature,C=I==="compact"?T:I==="recovered"?T+1:void 0;return G(R,C)}class O{r;s;recovery;constructor(I,T,C){if(this.r=b("r",I),this.s=b("s",T),C!=null){if(E(),![0,1,2,3].includes(C))throw new Error("invalid recovery id");this.recovery=C}Object.freeze(this)}static fromBytes(I,T=p.format){L(I,T);let C;if(T==="der"){const{r:U,s:D}=pt.toSig(G(I));return new O(U,D)}T==="recovered"&&(C=I[0],T="compact",I=I.subarray(1));const M=h.signature/2,B=I.subarray(0,M),P=I.subarray(M,M*2);return new O(i.fromBytes(B),i.fromBytes(P),C)}static fromHex(I,T){return this.fromBytes(z(I),T)}assertRecovery(){const{recovery:I}=this;if(I==null)throw new Error("invalid recovery id: must be present");return I}addRecoveryBit(I){return new O(this.r,this.s,I)}recoverPublicKey(I){const{r:T,s:C}=this,M=this.assertRecovery(),B=M===2||M===3?T+a:T;if(!s.isValid(B))throw new Error("invalid recovery id: sig.r+curve.n != R.x");const P=s.toBytes(B),U=e.fromBytes(oe(Yc((M&1)===0),P)),D=i.inv(B),K=$(G(I,void 0,"msgHash")),Y=i.create(-K*D),V=i.create(C*D),ne=e.BASE.multiplyUnsafe(Y).add(U.multiplyUnsafe(V));if(ne.is0())throw new Error("invalid recovery: point at infinify");return ne.assertValidity(),ne}hasHighS(){return y(this.s)}toBytes(I=p.format){if(as(I),I==="der")return z(pt.hexFromSig(this));const{r:T,s:C}=this,M=i.toBytes(T),B=i.toBytes(C);return I==="recovered"?(E(),oe(Uint8Array.of(this.assertRecovery()),M,B)):oe(M,B)}toHex(I){return q(this.toBytes(I))}}const N=n.bits2int||function(I){if(I.length>8192)throw new Error("input is too large");const T=Kn(I),C=I.length*8-c;return C>0?T>>BigInt(C):T},$=n.bits2int_modN||function(I){return i.create(N(I))},w=Ks(c);function v(R){return Df("num < 2^"+c,R,Qe,w),i.toBytes(R)}function g(R,I){return G(R,void 0,"message"),I?G(t(R),void 0,"prehashed message"):R}function x(R,I,T){const{lowS:C,prehash:M,extraEntropy:B}=To(T,p);R=g(R,M);const P=$(R),U=i.fromBytes(I);if(!i.isValidNot0(U))throw new Error("invalid private key");const D=[v(U),v(P)];if(B!=null&&B!==!1){const ne=B===!0?r(h.secretKey):B;D.push(G(ne,void 0,"extraEntropy"))}const K=oe(...D),Y=P;function V(ne){const ie=N(ne);if(!i.isValidNot0(ie))return;const Me=i.inv(ie),re=e.BASE.multiply(ie).toAffine(),le=i.create(re.x);if(le===Qe)return;const Zn=i.create(Me*i.create(Y+le*U));if(Zn===Qe)return;let Ji=(re.x===le?0:2)|Number(re.y&Zt),Yi=Zn;return C&&y(Zn)&&(Yi=i.neg(Zn),Ji^=1),new O(le,Yi,m?void 0:Ji)}return{seed:K,k2sig:V}}function S(R,I,T={}){const{seed:C,k2sig:M}=x(R,I,T);return qf(t.outputLen,i.BYTES,o)(C,M).toBytes(T.format)}function A(R,I,T,C={}){const{lowS:M,prehash:B,format:P}=To(C,p);if(T=G(T,void 0,"publicKey"),I=g(I,B),!Us(R)){const U=R instanceof O?", use sig.toBytes()":"";throw new Error("verify expects Uint8Array signature"+U)}L(R,P);try{const U=O.fromBytes(R,P),D=e.fromBytes(T);if(M&&U.hasHighS())return!1;const{r:K,s:Y}=U,V=$(I),ne=i.inv(Y),ie=i.create(V*ne),Me=i.create(K*ne),re=e.BASE.multiplyUnsafe(ie).add(D.multiplyUnsafe(Me));return re.is0()?!1:i.create(re.x)===K}catch{return!1}}function k(R,I,T={}){const{prehash:C}=To(T,p);return I=g(I,C),O.fromBytes(R,"recovered").recoverPublicKey(I).toBytes()}return Object.freeze({keygen:l,getPublicKey:d,getSharedSecret:u,utils:f,lengths:h,Point:e,sign:S,verify:A,recoverPublicKey:k,Signature:O,hash:t})}const ro={p:BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),n:BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),h:BigInt(1),a:BigInt(0),b:BigInt(7),Gx:BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),Gy:BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")},ah={beta:BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),basises:[[BigInt("0x3086d221a7d46bcde86c90e49284eb15"),-BigInt("0xe4437ed6010e88286f547fa90abfe4c3")],[BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"),BigInt("0x3086d221a7d46bcde86c90e49284eb15")]]},ch=BigInt(0),cs=BigInt(2);function lh(e){const t=ro.p,n=BigInt(3),r=BigInt(6),o=BigInt(11),s=BigInt(22),i=BigInt(23),a=BigInt(44),c=BigInt(88),l=e*e*e%t,d=l*l*e%t,u=_e(d,n,t)*d%t,f=_e(u,n,t)*d%t,h=_e(f,cs,t)*l%t,p=_e(h,o,t)*h%t,m=_e(p,s,t)*p%t,y=_e(m,a,t)*m%t,b=_e(y,c,t)*y%t,E=_e(b,a,t)*m%t,L=_e(E,n,t)*d%t,O=_e(L,i,t)*p%t,N=_e(O,r,t)*l%t,$=_e(N,cs,t);if(!Ur.eql(Ur.sqr($),e))throw new Error("Cannot find square root");return $}const Ur=no(ro.p,{sqrt:lh}),jt=oh(ro,{Fp:Ur,endo:ah}),De=ih(jt,se),pa={};function Dr(e,...t){let n=pa[e];if(n===void 0){const r=se(Pf(e));n=oe(r,r),pa[e]=n}return se(oe(n,...t))}const zs=e=>e.toBytes(!0).slice(1),Js=e=>e%cs===ch;function ls(e){const{Fn:t,BASE:n}=jt,r=t.fromBytes(e),o=n.multiply(r);return{scalar:Js(o.y)?r:t.neg(r),bytes:zs(o)}}function Xc(e){const t=Ur;if(!t.isValidNot0(e))throw new Error("invalid x: Fail if x ≥ p");const n=t.create(e*e),r=t.create(n*e+BigInt(7));let o=t.sqrt(r);Js(o)||(o=t.neg(o));const s=jt.fromAffine({x:e,y:o});return s.assertValidity(),s}const Tn=Kn;function Qc(...e){return jt.Fn.create(Tn(Dr("BIP0340/challenge",...e)))}function ma(e){return ls(e).bytes}function dh(e,t,n=wt(32)){const{Fn:r}=jt,o=G(e,void 0,"message"),{bytes:s,scalar:i}=ls(t),a=G(n,32,"auxRand"),c=r.toBytes(i^Tn(Dr("BIP0340/aux",a))),l=Dr("BIP0340/nonce",c,s,o),{bytes:d,scalar:u}=ls(l),f=Qc(d,s,o),h=new Uint8Array(64);if(h.set(d,0),h.set(r.toBytes(r.create(u+f*i)),32),!el(h,o,s))throw new Error("sign: Invalid signature produced");return h}function el(e,t,n){const{Fp:r,Fn:o,BASE:s}=jt,i=G(e,64,"signature"),a=G(t,void 0,"message"),c=G(n,32,"publicKey");try{const l=Xc(Tn(c)),d=Tn(i.subarray(0,32));if(!r.isValidNot0(d))return!1;const u=Tn(i.subarray(32,64));if(!o.isValidNot0(u))return!1;const f=Qc(o.toBytes(d),zs(l),a),h=s.multiplyUnsafe(u).add(l.multiplyUnsafe(o.neg(f))),{x:p,y:m}=h.toAffine();return!(h.is0()||!Js(m)||p!==d)}catch{return!1}}const ee=(()=>{const n=(r=wt(48))=>Kc(r,ro.n);return{keygen:zc(n,ma),getPublicKey:ma,sign:dh,verify:el,Point:jt,utils:{randomSecretKey:n,taggedHash:Dr,lift_x:Xc,pointToBytes:zs},lengths:{secretKey:32,publicKey:32,publicKeyHasPrefix:!1,signature:64,seed:48}}})(),uh=Uint8Array.from([7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8]),tl=Uint8Array.from(new Array(16).fill(0).map((e,t)=>t)),fh=tl.map(e=>(9*e+5)%16),nl=(()=>{const n=[[tl],[fh]];for(let r=0;r<4;r++)for(let o of n)o.push(o[r].map(s=>uh[s]));return n})(),rl=nl[0],ol=nl[1],sl=[[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8],[12,13,11,15,6,9,9,7,12,15,11,13,7,8,7,7],[13,15,14,11,7,7,6,8,13,14,13,12,5,5,6,9],[14,11,12,14,8,6,5,5,15,12,15,14,9,9,8,6],[15,12,13,13,9,5,8,6,14,11,12,11,8,6,5,5]].map(e=>Uint8Array.from(e)),hh=rl.map((e,t)=>e.map(n=>sl[t][n])),ph=ol.map((e,t)=>e.map(n=>sl[t][n])),mh=Uint32Array.from([0,1518500249,1859775393,2400959708,2840853838]),yh=Uint32Array.from([1352829926,1548603684,1836072691,2053994217,0]);function ya(e,t,n,r){return e===0?t^n^r:e===1?t&n|~t&r:e===2?(t|~n)^r:e===3?t&r|n&~r:t^(n|~r)}const sr=new Uint32Array(16);class gh extends js{h0=1732584193;h1=-271733879;h2=-1732584194;h3=271733878;h4=-1009589776;constructor(){super(64,20,8,!0)}get(){const{h0:t,h1:n,h2:r,h3:o,h4:s}=this;return[t,n,r,o,s]}set(t,n,r,o,s){this.h0=t|0,this.h1=n|0,this.h2=r|0,this.h3=o|0,this.h4=s|0}process(t,n){for(let h=0;h<16;h++,n+=4)sr[h]=t.getUint32(n,!0);let r=this.h0|0,o=r,s=this.h1|0,i=s,a=this.h2|0,c=a,l=this.h3|0,d=l,u=this.h4|0,f=u;for(let h=0;h<5;h++){const p=4-h,m=mh[h],y=yh[h],b=rl[h],E=ol[h],L=hh[h],O=ph[h];for(let N=0;N<16;N++){const $=Xn(r+ya(h,s,a,l)+sr[b[N]]+m,L[N])+u|0;r=u,u=l,l=Xn(a,10)|0,a=s,s=$}for(let N=0;N<16;N++){const $=Xn(o+ya(p,i,c,d)+sr[E[N]]+y,O[N])+f|0;o=f,f=d,d=Xn(c,10)|0,c=i,i=$}}this.set(this.h1+a+d|0,this.h2+l+f|0,this.h3+u+o|0,this.h4+r+i|0,this.h0+s+c|0)}roundClean(){Fe(sr)}destroy(){this.destroyed=!0,Fe(this.buffer),this.set(0,0,0,0,0)}}const bh=Ds(()=>new gh);const _n=De.Point,{Fn:bn}=_n,Lo=If(se),vh=Uint8Array.from("Bitcoin seed".split(""),e=>e.charCodeAt(0)),No={private:76066276,public:76067358},$o=2147483648,wh=e=>bh(se(e)),Eh=e=>Nt(e).getUint32(0,!1),ir=e=>{if(!Number.isSafeInteger(e)||e<0||e>2**32-1)throw new Error("invalid number, should be from 0 to 2**32-1, got "+e);const t=new Uint8Array(4);return Nt(t).setUint32(0,e,!1),t};class St{get fingerprint(){if(!this.pubHash)throw new Error("No publicKey set!");return Eh(this.pubHash)}get identifier(){return this.pubHash}get pubKeyHash(){return this.pubHash}get privateKey(){return this._privateKey||null}get publicKey(){return this._publicKey||null}get privateExtendedKey(){const t=this._privateKey;if(!t)throw new Error("No private key");return Lo.encode(this.serialize(this.versions.private,oe(Uint8Array.of(0),t)))}get publicExtendedKey(){if(!this._publicKey)throw new Error("No public key");return Lo.encode(this.serialize(this.versions.public,this._publicKey))}static fromMasterSeed(t,n=No){if(G(t),8*t.length<128||8*t.length>512)throw new Error("HDKey: seed length must be between 128 and 512 bits; 256 bits is advised, got "+t.length);const r=nt(rs,vh,t),o=r.slice(0,32),s=r.slice(32);return new St({versions:n,chainCode:s,privateKey:o})}static fromExtendedKey(t,n=No){const r=Lo.decode(t),o=Nt(r),s=o.getUint32(0,!1),i={versions:n,depth:r[4],parentFingerprint:o.getUint32(5,!1),index:o.getUint32(9,!1),chainCode:r.slice(13,45)},a=r.slice(45),c=a[0]===0;if(s!==n[c?"private":"public"])throw new Error("Version mismatch");return c?new St({...i,privateKey:a.slice(1)}):new St({...i,publicKey:a})}static fromJSON(t){return St.fromExtendedKey(t.xpriv)}versions;depth=0;index=0;chainCode=null;parentFingerprint=0;_privateKey;_publicKey;pubHash;constructor(t){if(!t||typeof t!="object")throw new Error("HDKey.constructor must not be called directly");if(this.versions=t.versions||No,this.depth=t.depth||0,this.chainCode=t.chainCode||null,this.index=t.index||0,this.parentFingerprint=t.parentFingerprint||0,!this.depth&&(this.parentFingerprint||this.index))throw new Error("HDKey: zero depth with non-zero index/parent fingerprint");if(this.depth>255)throw new Error("HDKey: depth exceeds the serializable value 255");if(t.publicKey&&t.privateKey)throw new Error("HDKey: publicKey and privateKey at same time.");if(t.privateKey){if(!De.utils.isValidSecretKey(t.privateKey))throw new Error("Invalid private key");this._privateKey=t.privateKey,this._publicKey=De.getPublicKey(t.privateKey,!0)}else if(t.publicKey)this._publicKey=_n.fromBytes(t.publicKey).toBytes(!0);else throw new Error("HDKey: no public or private key provided");this.pubHash=wh(this._publicKey)}derive(t){if(!/^[mM]'?/.test(t))throw new Error('Path must start with "m" or "M"');if(/^[mM]'?$/.test(t))return this;const n=t.replace(/^[mM]'?\//,"").split("/");let r=this;for(const o of n){const s=/^(\d+)('?)$/.exec(o),i=s&&s[1];if(!s||s.length!==3||typeof i!="string")throw new Error("invalid child index: "+o);let a=+i;if(!Number.isSafeInteger(a)||a>=$o)throw new Error("Invalid index");s[2]==="'"&&(a+=$o),r=r.deriveChild(a)}return r}deriveChild(t){if(!this._publicKey||!this.chainCode)throw new Error("No publicKey or chainCode set");let n=ir(t);if(t>=$o){const c=this._privateKey;if(!c)throw new Error("Could not derive hardened child key");n=oe(Uint8Array.of(0),c,n)}else n=oe(this._publicKey,n);const r=nt(rs,this.chainCode,n),o=r.slice(0,32),s=r.slice(32);if(!De.utils.isValidSecretKey(o))throw new Error("Tweak bigger than curve order");const i={versions:this.versions,chainCode:s,depth:this.depth+1,parentFingerprint:this.fingerprint,index:t},a=bn.fromBytes(o);try{if(this._privateKey){const c=bn.create(bn.fromBytes(this._privateKey)+a);if(!bn.isValidNot0(c))throw new Error("The tweak was out of range or the resulted private key is invalid");i.privateKey=bn.toBytes(c)}else{const c=_n.fromBytes(this._publicKey).add(_n.BASE.multiply(a));if(c.equals(_n.ZERO))throw new Error("The tweak was equal to negative P, which made the result key invalid");i.publicKey=c.toBytes(!0)}return new St(i)}catch{return this.deriveChild(t+1)}}sign(t){if(!this._privateKey)throw new Error("No privateKey set!");return G(t,32),De.sign(t,this._privateKey,{prehash:!1})}verify(t,n){if(G(t,32),G(n,64),!this._publicKey)throw new Error("No publicKey set!");return De.verify(n,t,this._publicKey,{prehash:!1})}wipePrivateData(){return this._privateKey&&(this._privateKey.fill(0),this._privateKey=void 0),this}toJSON(){return{xpriv:this.privateExtendedKey,xpub:this.publicExtendedKey}}serialize(t,n){if(!this.chainCode)throw new Error("No chainCode set");return G(n,33),oe(ir(t),new Uint8Array([this.depth]),ir(this.parentFingerprint),ir(this.index),this.chainCode,n)}}function kh(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array"}function ga(e){if(typeof e!="boolean")throw new Error(`boolean expected, not ${e}`)}function Mo(e){if(!Number.isSafeInteger(e)||e<0)throw new Error("positive integer expected, got "+e)}function ye(e,t,n=""){const r=kh(e),o=e?.length,s=t!==void 0;if(!r||s&&o!==t){const i=n&&`"${n}" `,a=s?` of length ${t}`:"",c=r?`length=${o}`:`type=${typeof e}`;throw new Error(i+"expected Uint8Array"+a+", got "+c)}return e}function he(e){return new Uint32Array(e.buffer,e.byteOffset,Math.floor(e.byteLength/4))}function on(...e){for(let t=0;t<e.length;t++)e[t].fill(0)}const _h=new Uint8Array(new Uint32Array([287454020]).buffer)[0]===68;function xh(e,t){return e.buffer===t.buffer&&e.byteOffset<t.byteOffset+t.byteLength&&t.byteOffset<e.byteOffset+e.byteLength}function il(e,t){if(xh(e,t)&&e.byteOffset<t.byteOffset)throw new Error("complex overlap of input and output is not supported")}function Sh(e,t){if(t==null||typeof t!="object")throw new Error("options must be defined");return Object.assign(e,t)}function al(e,t){if(e.length!==t.length)return!1;let n=0;for(let r=0;r<e.length;r++)n|=e[r]^t[r];return n===0}const Ih=(e,t)=>{function n(r,...o){if(ye(r,void 0,"key"),!_h)throw new Error("Non little-endian hardware is not yet supported");if(e.nonceLength!==void 0){const d=o[0];ye(d,e.varSizeNonce?void 0:e.nonceLength,"nonce")}const s=e.tagLength;s&&o[1]!==void 0&&ye(o[1],void 0,"AAD");const i=t(r,...o),a=(d,u)=>{if(u!==void 0){if(d!==2)throw new Error("cipher output not supported");ye(u,void 0,"output")}};let c=!1;return{encrypt(d,u){if(c)throw new Error("cannot encrypt() twice with same key + nonce");return c=!0,ye(d),a(i.encrypt.length,u),i.encrypt(d,u)},decrypt(d,u){if(ye(d),s&&d.length<s)throw new Error('"ciphertext" expected length bigger than tagLength='+s);return a(i.decrypt.length,u),i.decrypt(d,u)}}}return Object.assign(n,e),n};function cl(e,t,n=!0){if(t===void 0)return new Uint8Array(e);if(t.length!==e)throw new Error('"output" expected Uint8Array of length '+e+", got: "+t.length);if(n&&!Xt(t))throw new Error("invalid output, must be aligned");return t}function Xt(e){return e.byteOffset%4===0}function $t(e){return Uint8Array.from(e)}const gt=16,Rh=283;function Ah(e){if(![16,24,32].includes(e.length))throw new Error('"aes key" expected Uint8Array of length 16/24/32, got length='+e.length)}function Ys(e){return e<<1^Rh&-(e>>7)}function Yt(e,t){let n=0;for(;t>0;t>>=1)n^=e&-(t&1),e=Ys(e);return n}const ds=(()=>{const e=new Uint8Array(256);for(let n=0,r=1;n<256;n++,r^=Ys(r))e[n]=r;const t=new Uint8Array(256);t[0]=99;for(let n=0;n<255;n++){let r=e[255-n];r|=r<<8,t[e[n]]=(r^r>>4^r>>5^r>>6^r>>7^99)&255}return on(e),t})(),Ch=ds.map((e,t)=>ds.indexOf(t)),Th=e=>e<<24|e>>>8,Oo=e=>e<<8|e>>>24;function ll(e,t){if(e.length!==256)throw new Error("Wrong sbox length");const n=new Uint32Array(256).map((l,d)=>t(e[d])),r=n.map(Oo),o=r.map(Oo),s=o.map(Oo),i=new Uint32Array(256*256),a=new Uint32Array(256*256),c=new Uint16Array(256*256);for(let l=0;l<256;l++)for(let d=0;d<256;d++){const u=l*256+d;i[u]=n[l]^r[d],a[u]=o[l]^s[d],c[u]=e[l]<<8|e[d]}return{sbox:e,sbox2:c,T0:n,T1:r,T2:o,T3:s,T01:i,T23:a}}const Zs=ll(ds,e=>Yt(e,3)<<24|e<<16|e<<8|Yt(e,2)),dl=ll(Ch,e=>Yt(e,11)<<24|Yt(e,13)<<16|Yt(e,9)<<8|Yt(e,14)),Lh=(()=>{const e=new Uint8Array(16);for(let t=0,n=1;t<16;t++,n=Ys(n))e[t]=n;return e})();function ul(e){ye(e);const t=e.length;Ah(e);const{sbox2:n}=Zs,r=[];Xt(e)||r.push(e=$t(e));const o=he(e),s=o.length,i=c=>qe(n,c,c,c,c),a=new Uint32Array(t+28);a.set(o);for(let c=s;c<a.length;c++){let l=a[c-1];c%s===0?l=i(Th(l))^Lh[c/s-1]:s>6&&c%s===4&&(l=i(l)),a[c]=a[c-s]^l}return on(...r),a}function Nh(e){const t=ul(e),n=t.slice(),r=t.length,{sbox2:o}=Zs,{T0:s,T1:i,T2:a,T3:c}=dl;for(let l=0;l<r;l+=4)for(let d=0;d<4;d++)n[l+d]=t[r-l-4+d];on(t);for(let l=4;l<r-4;l++){const d=n[l],u=qe(o,d,d,d,d);n[l]=s[u&255]^i[u>>>8&255]^a[u>>>16&255]^c[u>>>24]}return n}function yt(e,t,n,r,o,s){return e[n<<8&65280|r>>>8&255]^t[o>>>8&65280|s>>>24&255]}function qe(e,t,n,r,o){return e[t&255|n&65280]|e[r>>>16&255|o>>>16&65280]<<16}function ba(e,t,n,r,o){const{sbox2:s,T01:i,T23:a}=Zs;let c=0;t^=e[c++],n^=e[c++],r^=e[c++],o^=e[c++];const l=e.length/4-2;for(let p=0;p<l;p++){const m=e[c++]^yt(i,a,t,n,r,o),y=e[c++]^yt(i,a,n,r,o,t),b=e[c++]^yt(i,a,r,o,t,n),E=e[c++]^yt(i,a,o,t,n,r);t=m,n=y,r=b,o=E}const d=e[c++]^qe(s,t,n,r,o),u=e[c++]^qe(s,n,r,o,t),f=e[c++]^qe(s,r,o,t,n),h=e[c++]^qe(s,o,t,n,r);return{s0:d,s1:u,s2:f,s3:h}}function $h(e,t,n,r,o){const{sbox2:s,T01:i,T23:a}=dl;let c=0;t^=e[c++],n^=e[c++],r^=e[c++],o^=e[c++];const l=e.length/4-2;for(let p=0;p<l;p++){const m=e[c++]^yt(i,a,t,o,r,n),y=e[c++]^yt(i,a,n,t,o,r),b=e[c++]^yt(i,a,r,n,t,o),E=e[c++]^yt(i,a,o,r,n,t);t=m,n=y,r=b,o=E}const d=e[c++]^qe(s,t,o,r,n),u=e[c++]^qe(s,n,t,o,r),f=e[c++]^qe(s,r,n,t,o),h=e[c++]^qe(s,o,r,n,t);return{s0:d,s1:u,s2:f,s3:h}}function Mh(e){if(ye(e),e.length%gt!==0)throw new Error("aes-(cbc/ecb).decrypt ciphertext should consist of blocks with size "+gt)}function Oh(e,t,n){ye(e);let r=e.length;const o=r%gt;if(!t&&o!==0)throw new Error("aec/(cbc-ecb): unpadded plaintext with disabled padding");Xt(e)||(e=$t(e));const s=he(e);if(t){let a=gt-o;a||(a=gt),r=r+a}n=cl(r,n),il(e,n);const i=he(n);return{b:s,o:i,out:n}}function Bh(e,t){if(!t)return e;const n=e.length;if(!n)throw new Error("aes/pcks5: empty ciphertext not allowed");const r=e[n-1];if(r<=0||r>16)throw new Error("aes/pcks5: wrong padding");const o=e.subarray(0,-r);for(let s=0;s<r;s++)if(e[n-s-1]!==r)throw new Error("aes/pcks5: wrong padding");return o}function Ph(e){const t=new Uint8Array(16),n=he(t);t.set(e);const r=gt-e.length;for(let o=gt-r;o<gt;o++)t[o]=r;return n}const fl=Ih({blockSize:16,nonceLength:16},function(t,n,r={}){const o=!r.disablePadding;return{encrypt(s,i){const a=ul(t),{b:c,o:l,out:d}=Oh(s,o,i);let u=n;const f=[a];Xt(u)||f.push(u=$t(u));const h=he(u);let p=h[0],m=h[1],y=h[2],b=h[3],E=0;for(;E+4<=c.length;)p^=c[E+0],m^=c[E+1],y^=c[E+2],b^=c[E+3],{s0:p,s1:m,s2:y,s3:b}=ba(a,p,m,y,b),l[E++]=p,l[E++]=m,l[E++]=y,l[E++]=b;if(o){const L=Ph(s.subarray(E*4));p^=L[0],m^=L[1],y^=L[2],b^=L[3],{s0:p,s1:m,s2:y,s3:b}=ba(a,p,m,y,b),l[E++]=p,l[E++]=m,l[E++]=y,l[E++]=b}return on(...f),d},decrypt(s,i){Mh(s);const a=Nh(t);let c=n;const l=[a];Xt(c)||l.push(c=$t(c));const d=he(c);i=cl(s.length,i),Xt(s)||l.push(s=$t(s)),il(s,i);const u=he(s),f=he(i);let h=d[0],p=d[1],m=d[2],y=d[3];for(let b=0;b+4<=u.length;){const E=h,L=p,O=m,N=y;h=u[b+0],p=u[b+1],m=u[b+2],y=u[b+3];const{s0:$,s1:w,s2:v,s3:g}=$h(a,h,p,m,y);f[b++]=$^E,f[b++]=w^L,f[b++]=v^O,f[b++]=g^N}return on(...l),Bh(i,o)}}}),hl=e=>Uint8Array.from(e.split(""),t=>t.charCodeAt(0)),Uh=hl("expand 16-byte k"),Dh=hl("expand 32-byte k"),jh=he(Uh),qh=he(Dh);function W(e,t){return e<<t|e>>>32-t}function us(e){return e.byteOffset%4===0}const ar=64,Hh=16,pl=2**32-1,va=Uint32Array.of();function Fh(e,t,n,r,o,s,i,a){const c=o.length,l=new Uint8Array(ar),d=he(l),u=us(o)&&us(s),f=u?he(o):va,h=u?he(s):va;for(let p=0;p<c;i++){if(e(t,n,r,d,i,a),i>=pl)throw new Error("arx: counter overflow");const m=Math.min(ar,c-p);if(u&&m===ar){const y=p/4;if(p%4!==0)throw new Error("arx: invalid block position");for(let b=0,E;b<Hh;b++)E=y+b,h[E]=f[E]^d[b];p+=ar;continue}for(let y=0,b;y<m;y++)b=p+y,s[b]=o[b]^l[y];p+=m}}function Gh(e,t){const{allowShortKeys:n,extendNonceFn:r,counterLength:o,counterRight:s,rounds:i}=Sh({allowShortKeys:!1,counterLength:8,counterRight:!1,rounds:20},t);if(typeof e!="function")throw new Error("core must be a function");return Mo(o),Mo(i),ga(s),ga(n),(a,c,l,d,u=0)=>{ye(a,void 0,"key"),ye(c,void 0,"nonce"),ye(l,void 0,"data");const f=l.length;if(d===void 0&&(d=new Uint8Array(f)),ye(d,void 0,"output"),Mo(u),u<0||u>=pl)throw new Error("arx: counter overflow");if(d.length<f)throw new Error(`arx: output (${d.length}) is shorter than data (${f})`);const h=[];let p=a.length,m,y;if(p===32)h.push(m=$t(a)),y=qh;else if(p===16&&n)m=new Uint8Array(32),m.set(a),m.set(a,16),y=jh,h.push(m);else throw ye(a,32,"arx key"),new Error("invalid key size");us(c)||h.push(c=$t(c));const b=he(m);if(r){if(c.length!==24)throw new Error("arx: extended nonce must be 24 bytes");r(y,b,he(c.subarray(0,16)),b),c=c.subarray(16)}const E=16-o;if(E!==c.length)throw new Error(`arx: nonce must be ${E} or 16 bytes`);if(E!==12){const O=new Uint8Array(12);O.set(c,s?0:12-c.length),c=O,h.push(c)}const L=he(c);return Fh(e,y,b,L,l,d,u,i),on(...h),d}}function Kh(e,t,n,r,o,s=20){let i=e[0],a=e[1],c=e[2],l=e[3],d=t[0],u=t[1],f=t[2],h=t[3],p=t[4],m=t[5],y=t[6],b=t[7],E=o,L=n[0],O=n[1],N=n[2],$=i,w=a,v=c,g=l,x=d,S=u,A=f,k=h,R=p,I=m,T=y,C=b,M=E,B=L,P=O,U=N;for(let K=0;K<s;K+=2)$=$+x|0,M=W(M^$,16),R=R+M|0,x=W(x^R,12),$=$+x|0,M=W(M^$,8),R=R+M|0,x=W(x^R,7),w=w+S|0,B=W(B^w,16),I=I+B|0,S=W(S^I,12),w=w+S|0,B=W(B^w,8),I=I+B|0,S=W(S^I,7),v=v+A|0,P=W(P^v,16),T=T+P|0,A=W(A^T,12),v=v+A|0,P=W(P^v,8),T=T+P|0,A=W(A^T,7),g=g+k|0,U=W(U^g,16),C=C+U|0,k=W(k^C,12),g=g+k|0,U=W(U^g,8),C=C+U|0,k=W(k^C,7),$=$+S|0,U=W(U^$,16),T=T+U|0,S=W(S^T,12),$=$+S|0,U=W(U^$,8),T=T+U|0,S=W(S^T,7),w=w+A|0,M=W(M^w,16),C=C+M|0,A=W(A^C,12),w=w+A|0,M=W(M^w,8),C=C+M|0,A=W(A^C,7),v=v+k|0,B=W(B^v,16),R=R+B|0,k=W(k^R,12),v=v+k|0,B=W(B^v,8),R=R+B|0,k=W(k^R,7),g=g+x|0,P=W(P^g,16),I=I+P|0,x=W(x^I,12),g=g+x|0,P=W(P^g,8),I=I+P|0,x=W(x^I,7);let D=0;r[D++]=i+$|0,r[D++]=a+w|0,r[D++]=c+v|0,r[D++]=l+g|0,r[D++]=d+x|0,r[D++]=u+S|0,r[D++]=f+A|0,r[D++]=h+k|0,r[D++]=p+R|0,r[D++]=m+I|0,r[D++]=y+T|0,r[D++]=b+C|0,r[D++]=E+M|0,r[D++]=L+B|0,r[D++]=O+P|0,r[D++]=N+U|0}const oo=Gh(Kh,{counterRight:!1,counterLength:4,allowShortKeys:!1});function ml(e,t,n){return Fn(e),n===void 0&&(n=new Uint8Array(e.outputLen)),nt(e,n,t)}const Bo=Uint8Array.of(0),wa=Uint8Array.of();function yl(e,t,n,r=32){Fn(e),Ae(r,"length");const o=e.outputLen;if(r>255*o)throw new Error("Length must be <= 255*HashLen");const s=Math.ceil(r/o);n===void 0?n=wa:G(n,void 0,"info");const i=new Uint8Array(s*o),a=nt.create(e,t),c=a._cloneInto(),l=new Uint8Array(a.outputLen);for(let d=0;d<s;d++)Bo[0]=d+1,c.update(d===0?wa:l).update(n).update(Bo).digestInto(l),i.set(l,o*d),a._cloneInto(c);return a.destroy(),c.destroy(),Fe(l,Bo),i.slice(0,r)}var Vh=Object.defineProperty,X=(e,t)=>{for(var n in t)Vh(e,n,{get:t[n],enumerable:!0})},Gt=Symbol("verified"),Wh=e=>e instanceof Object;function Xs(e){if(!Wh(e)||typeof e.kind!="number"||typeof e.content!="string"||typeof e.created_at!="number"||typeof e.pubkey!="string"||!e.pubkey.match(/^[a-f0-9]{64}$/)||!Array.isArray(e.tags))return!1;for(let t=0;t<e.tags.length;t++){let n=e.tags[t];if(!Array.isArray(n))return!1;for(let r=0;r<n.length;r++)if(typeof n[r]!="string")return!1}return!0}var zh={};X(zh,{binarySearch:()=>Qs,bytesToHex:()=>q,hexToBytes:()=>z,insertEventIntoAscendingList:()=>Zh,insertEventIntoDescendingList:()=>Yh,mergeReverseSortedLists:()=>Xh,normalizeURL:()=>Jh,utf8Decoder:()=>et,utf8Encoder:()=>Ce});var et=new TextDecoder("utf-8"),Ce=new TextEncoder;function Jh(e){try{e.indexOf("://")===-1&&(e="wss://"+e);let t=new URL(e);return t.protocol==="http:"?t.protocol="ws:":t.protocol==="https:"&&(t.protocol="wss:"),t.pathname=t.pathname.replace(/\/+/g,"/"),t.pathname.endsWith("/")&&(t.pathname=t.pathname.slice(0,-1)),(t.port==="80"&&t.protocol==="ws:"||t.port==="443"&&t.protocol==="wss:")&&(t.port=""),t.searchParams.sort(),t.hash="",t.toString()}catch{throw new Error(`Invalid URL: ${e}`)}}function Yh(e,t){const[n,r]=Qs(e,o=>t.id===o.id?0:t.created_at===o.created_at?-1:o.created_at-t.created_at);return r||e.splice(n,0,t),e}function Zh(e,t){const[n,r]=Qs(e,o=>t.id===o.id?0:t.created_at===o.created_at?-1:t.created_at-o.created_at);return r||e.splice(n,0,t),e}function Qs(e,t){let n=0,r=e.length-1;for(;n<=r;){const o=Math.floor((n+r)/2),s=t(e[o]);if(s===0)return[o,!0];s<0?r=o-1:n=o+1}return[n,!1]}function Xh(e,t){const n=new Array(e.length+t.length);n.length=0;let r=0,o=0,s=[];for(;r<e.length&&o<t.length;){let i;if(e[r]?.created_at>t[o]?.created_at?(i=e[r],r++):(i=t[o],o++),n.length>0&&n[n.length-1].created_at===i.created_at){if(s.includes(i.id))continue}else s.length=0;n.push(i),s.push(i.id)}for(;r<e.length;){const i=e[r];if(r++,n.length>0&&n[n.length-1].created_at===i.created_at){if(s.includes(i.id))continue}else s.length=0;n.push(i),s.push(i.id)}for(;o<t.length;){const i=t[o];if(o++,n.length>0&&n[n.length-1].created_at===i.created_at){if(s.includes(i.id))continue}else s.length=0;n.push(i),s.push(i.id)}return n}var Qh=class{generateSecretKey(){return ee.utils.randomSecretKey()}getPublicKey(t){return q(ee.getPublicKey(t))}finalizeEvent(t,n){const r=t;return r.pubkey=q(ee.getPublicKey(n)),r.id=wr(r),r.sig=q(ee.sign(z(wr(r)),n)),r[Gt]=!0,r}verifyEvent(t){if(typeof t[Gt]=="boolean")return t[Gt];try{const n=wr(t);if(n!==t.id)return t[Gt]=!1,!1;const r=ee.verify(z(t.sig),z(n),z(t.pubkey));return t[Gt]=r,r}catch{return t[Gt]=!1,!1}}};function ep(e){if(!Xs(e))throw new Error("can't serialize event with wrong or missing properties");return JSON.stringify([0,e.pubkey,e.created_at,e.kind,e.tags,e.content])}function wr(e){let t=se(Ce.encode(ep(e)));return q(t)}var so=new Qh,tp=so.generateSecretKey,io=so.getPublicKey,We=so.finalizeEvent,ei=so.verifyEvent,np={};X(np,{Application:()=>pm,BadgeAward:()=>dp,BadgeDefinition:()=>am,BlockedRelaysList:()=>Fp,BlossomServerList:()=>Yp,BookmarkList:()=>jp,Bookmarksets:()=>om,Calendar:()=>Em,CalendarEventRSVP:()=>km,ChannelCreation:()=>kl,ChannelHideMessage:()=>Sl,ChannelMessage:()=>xl,ChannelMetadata:()=>_l,ChannelMuteUser:()=>Il,ChatMessage:()=>up,ClassifiedListing:()=>gm,ClientAuth:()=>Al,Comment:()=>wp,CommunitiesList:()=>qp,CommunityDefinition:()=>Im,CommunityPostApproval:()=>Ap,Contacts:()=>ap,CreateOrUpdateProduct:()=>dm,CreateOrUpdateStall:()=>lm,Curationsets:()=>sm,Date:()=>vm,DirectMessageRelaysList:()=>zp,DraftClassifiedListing:()=>bm,DraftLong:()=>fm,Emojisets:()=>hm,EncryptedDirectMessage:()=>cp,EventDeletion:()=>lp,FavoriteRelays:()=>Kp,FileMessage:()=>hp,FileMetadata:()=>vp,FileServerPreference:()=>Jp,Followsets:()=>tm,ForumThread:()=>fp,GenericRepost:()=>si,Genericlists:()=>nm,GiftWrap:()=>Rl,GroupMetadata:()=>Rm,HTTPAuth:()=>ii,Handlerinformation:()=>Sm,Handlerrecommendation:()=>xm,Highlights:()=>Op,InterestsList:()=>Vp,Interestsets:()=>cm,JobFeedback:()=>Lp,JobRequest:()=>Cp,JobResult:()=>Tp,Label:()=>Rp,LightningPubRPC:()=>Xp,LiveChatMessage:()=>Ep,LiveEvent:()=>mm,LongFormArticle:()=>um,Metadata:()=>sp,Mutelist:()=>Pp,NWCWalletInfo:()=>Zp,NWCWalletRequest:()=>Cl,NWCWalletResponse:()=>Qp,NormalVideo:()=>mp,NostrConnect:()=>em,OpenTimestamps:()=>gp,Photo:()=>pp,Pinlist:()=>Up,Poll:()=>bp,PollResponse:()=>Bp,PrivateDirectMessage:()=>El,ProblemTracker:()=>xp,ProfileBadges:()=>im,PublicChatsList:()=>Hp,Reaction:()=>oi,RecommendRelay:()=>ip,RelayList:()=>Dp,RelayReview:()=>_m,Relaysets:()=>rm,Report:()=>Sp,Reporting:()=>Ip,Repost:()=>ri,Seal:()=>wl,SearchRelaysList:()=>Gp,ShortTextNote:()=>vl,ShortVideo:()=>yp,Time:()=>wm,UserEmojiList:()=>Wp,UserStatuses:()=>ym,Voice:()=>kp,VoiceComment:()=>_p,Zap:()=>Mp,ZapGoal:()=>Np,ZapRequest:()=>$p,classifyKind:()=>rp,isAddressableKind:()=>ni,isEphemeralKind:()=>bl,isKind:()=>op,isRegularKind:()=>gl,isReplaceableKind:()=>ti});function gl(e){return e<1e4&&e!==0&&e!==3}function ti(e){return e===0||e===3||1e4<=e&&e<2e4}function bl(e){return 2e4<=e&&e<3e4}function ni(e){return 3e4<=e&&e<4e4}function rp(e){return gl(e)?"regular":ti(e)?"replaceable":bl(e)?"ephemeral":ni(e)?"parameterized":"unknown"}function op(e,t){const n=t instanceof Array?t:[t];return Xs(e)&&n.includes(e.kind)||!1}var sp=0,vl=1,ip=2,ap=3,cp=4,lp=5,ri=6,oi=7,dp=8,up=9,fp=11,wl=13,El=14,hp=15,si=16,pp=20,mp=21,yp=22,kl=40,_l=41,xl=42,Sl=43,Il=44,gp=1040,Rl=1059,bp=1068,vp=1063,wp=1111,Ep=1311,kp=1222,_p=1244,xp=1971,Sp=1984,Ip=1984,Rp=1985,Ap=4550,Cp=5999,Tp=6999,Lp=7e3,Np=9041,$p=9734,Mp=9735,Op=9802,Bp=1018,Pp=1e4,Up=10001,Dp=10002,jp=10003,qp=10004,Hp=10005,Fp=10006,Gp=10007,Kp=10012,Vp=10015,Wp=10030,zp=10050,Jp=10096,Yp=10063,Zp=13194,Xp=21e3,Al=22242,Cl=23194,Qp=23195,em=24133,ii=27235,tm=3e4,nm=30001,rm=30002,om=30003,sm=30004,im=30008,am=30009,cm=30015,lm=30017,dm=30018,um=30023,fm=30024,hm=30030,pm=30078,mm=30311,ym=30315,gm=30402,bm=30403,vm=31922,wm=31923,Em=31924,km=31925,_m=31987,xm=31989,Sm=31990,Im=34550,Rm=39e3,Am={};X(Am,{getHex64:()=>ai,getInt:()=>Tl,getSubscriptionId:()=>Cm,matchEventId:()=>Tm,matchEventKind:()=>Nm,matchEventPubkey:()=>Lm});function ai(e,t){let n=t.length+3,r=e.indexOf(`"${t}":`)+n,o=e.slice(r).indexOf('"')+r+1;return e.slice(o,o+64)}function Tl(e,t){let n=t.length,r=e.indexOf(`"${t}":`)+n+3,o=e.slice(r),s=Math.min(o.indexOf(","),o.indexOf("}"));return parseInt(o.slice(0,s),10)}function Cm(e){let t=e.slice(0,22).indexOf('"EVENT"');if(t===-1)return null;let n=e.slice(t+7+1).indexOf('"');if(n===-1)return null;let r=t+7+1+n,o=e.slice(r+1,80).indexOf('"');if(o===-1)return null;let s=r+1+o;return e.slice(r+1,s)}function Tm(e,t){return t===ai(e,"id")}function Lm(e,t){return t===ai(e,"pubkey")}function Nm(e,t){return t===Tl(e,"kind")}var $m={};X($m,{makeAuthEvent:()=>Mm});function Mm(e,t){return{kind:Al,created_at:Math.floor(Date.now()/1e3),tags:[["relay",e],["challenge",t]],content:""}}var Om;try{Om=WebSocket}catch{}var Bm;try{Bm=WebSocket}catch{}var Pm={};X(Pm,{BECH32_REGEX:()=>Ll,Bech32MaxSize:()=>ci,NostrTypeGuard:()=>Um,decode:()=>ao,decodeNostrURI:()=>jm,encodeBytes:()=>lo,naddrEncode:()=>Vm,neventEncode:()=>Km,noteEncode:()=>Fm,nprofileEncode:()=>Gm,npubEncode:()=>Hm,nsecEncode:()=>qm});var Um={isNProfile:e=>/^nprofile1[a-z\d]+$/.test(e||""),isNEvent:e=>/^nevent1[a-z\d]+$/.test(e||""),isNAddr:e=>/^naddr1[a-z\d]+$/.test(e||""),isNSec:e=>/^nsec1[a-z\d]{58}$/.test(e||""),isNPub:e=>/^npub1[a-z\d]{58}$/.test(e||""),isNote:e=>/^note1[a-z\d]+$/.test(e||""),isNcryptsec:e=>/^ncryptsec1[a-z\d]+$/.test(e||"")},ci=5e3,Ll=/[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;function Dm(e){const t=new Uint8Array(4);return t[0]=e>>24&255,t[1]=e>>16&255,t[2]=e>>8&255,t[3]=e&255,t}function jm(e){try{return e.startsWith("nostr:")&&(e=e.substring(6)),ao(e)}catch{return{type:"invalid",data:null}}}function ao(e){let{prefix:t,words:n}=Ke.decode(e,ci),r=new Uint8Array(Ke.fromWords(n));switch(t){case"nprofile":{let o=Po(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for nprofile");if(o[0][0].length!==32)throw new Error("TLV 0 should be 32 bytes");return{type:"nprofile",data:{pubkey:q(o[0][0]),relays:o[1]?o[1].map(s=>et.decode(s)):[]}}}case"nevent":{let o=Po(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for nevent");if(o[0][0].length!==32)throw new Error("TLV 0 should be 32 bytes");if(o[2]&&o[2][0].length!==32)throw new Error("TLV 2 should be 32 bytes");if(o[3]&&o[3][0].length!==4)throw new Error("TLV 3 should be 4 bytes");return{type:"nevent",data:{id:q(o[0][0]),relays:o[1]?o[1].map(s=>et.decode(s)):[],author:o[2]?.[0]?q(o[2][0]):void 0,kind:o[3]?.[0]?parseInt(q(o[3][0]),16):void 0}}}case"naddr":{let o=Po(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for naddr");if(!o[2]?.[0])throw new Error("missing TLV 2 for naddr");if(o[2][0].length!==32)throw new Error("TLV 2 should be 32 bytes");if(!o[3]?.[0])throw new Error("missing TLV 3 for naddr");if(o[3][0].length!==4)throw new Error("TLV 3 should be 4 bytes");return{type:"naddr",data:{identifier:et.decode(o[0][0]),pubkey:q(o[2][0]),kind:parseInt(q(o[3][0]),16),relays:o[1]?o[1].map(s=>et.decode(s)):[]}}}case"nsec":return{type:t,data:r};case"npub":case"note":return{type:t,data:q(r)};default:throw new Error(`unknown prefix ${t}`)}}function Po(e){let t={},n=e;for(;n.length>0;){let r=n[0],o=n[1],s=n.slice(2,2+o);if(n=n.slice(2+o),s.length<o)throw new Error(`not enough data to read on TLV ${r}`);t[r]=t[r]||[],t[r].push(s)}return t}function qm(e){return lo("nsec",e)}function Hm(e){return lo("npub",z(e))}function Fm(e){return lo("note",z(e))}function co(e,t){let n=Ke.toWords(t);return Ke.encode(e,n,ci)}function lo(e,t){return co(e,t)}function Gm(e){let t=li({0:[z(e.pubkey)],1:(e.relays||[]).map(n=>Ce.encode(n))});return co("nprofile",t)}function Km(e){let t;e.kind!==void 0&&(t=Dm(e.kind));let n=li({0:[z(e.id)],1:(e.relays||[]).map(r=>Ce.encode(r)),2:e.author?[z(e.author)]:[],3:t?[new Uint8Array(t)]:[]});return co("nevent",n)}function Vm(e){let t=new ArrayBuffer(4);new DataView(t).setUint32(0,e.kind,!1);let n=li({0:[Ce.encode(e.identifier)],1:(e.relays||[]).map(r=>Ce.encode(r)),2:[z(e.pubkey)],3:[new Uint8Array(t)]});return co("naddr",n)}function li(e){let t=[];return Object.entries(e).reverse().forEach(([n,r])=>{r.forEach(o=>{let s=new Uint8Array(o.length+2);s.set([parseInt(n)],0),s.set([o.length],1),s.set(o,2),t.push(s)})}),oe(...t)}var Wm={};X(Wm,{decrypt:()=>zm,encrypt:()=>Nl});function Nl(e,t,n){const r=e instanceof Uint8Array?e:z(e),o=De.getSharedSecret(r,z("02"+t)),s=$l(o);let i=Uint8Array.from(wt(16)),a=Ce.encode(n),c=fl(s,i).encrypt(a),l=Ge.encode(new Uint8Array(c)),d=Ge.encode(new Uint8Array(i.buffer));return`${l}?iv=${d}`}function zm(e,t,n){const r=e instanceof Uint8Array?e:z(e);let[o,s]=n.split("?iv="),i=De.getSharedSecret(r,z("02"+t)),a=$l(i),c=Ge.decode(s),l=Ge.decode(o),d=fl(a,c).decrypt(l);return et.decode(d)}function $l(e){return e.slice(1,33)}var Jm={};X(Jm,{NIP05_REGEX:()=>di,isNip05:()=>Ym,isValid:()=>Qm,queryProfile:()=>Ml,searchDomain:()=>Xm,useFetchImplementation:()=>Zm});var di=/^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/,Ym=e=>di.test(e||""),uo;try{uo=fetch}catch{}function Zm(e){uo=e}async function Xm(e,t=""){try{const n=`https://${e}/.well-known/nostr.json?name=${t}`,r=await uo(n,{redirect:"manual"});if(r.status!==200)throw Error("Wrong response code");return(await r.json()).names}catch{return{}}}async function Ml(e){const t=e.match(di);if(!t)return null;const[,n="_",r]=t;try{const o=`https://${r}/.well-known/nostr.json?name=${n}`,s=await uo(o,{redirect:"manual"});if(s.status!==200)throw Error("Wrong response code");const i=await s.json(),a=i.names[n];return a?{pubkey:a,relays:i.relays?.[a]}:null}catch{return null}}async function Qm(e,t){const n=await Ml(t);return n?n.pubkey===e:!1}var ey={};X(ey,{parse:()=>ty});function ty(e){const t={reply:void 0,root:void 0,mentions:[],profiles:[],quotes:[]};let n,r;for(let o=e.tags.length-1;o>=0;o--){const s=e.tags[o];if(s[0]==="e"&&s[1]){const[i,a,c,l,d]=s,u={id:a,relays:c?[c]:[],author:d};if(l==="root"){t.root=u;continue}if(l==="reply"){t.reply=u;continue}if(l==="mention"){t.mentions.push(u);continue}n?r=u:n=u,t.mentions.push(u);continue}if(s[0]==="q"&&s[1]){const[i,a,c]=s;t.quotes.push({id:a,relays:c?[c]:[]})}if(s[0]==="p"&&s[1]){t.profiles.push({pubkey:s[1],relays:s[2]?[s[2]]:[]});continue}}return t.root||(t.root=r||n||t.reply),t.reply||(t.reply=n||t.root),[t.reply,t.root].forEach(o=>{if(!o)return;let s=t.mentions.indexOf(o);if(s!==-1&&t.mentions.splice(s,1),o.author){let i=t.profiles.find(a=>a.pubkey===o.author);i&&i.relays&&(o.relays||(o.relays=[]),i.relays.forEach(a=>{o.relays?.indexOf(a)===-1&&o.relays.push(a)}),i.relays=o.relays)}}),t.mentions.forEach(o=>{if(o.author){let s=t.profiles.find(i=>i.pubkey===o.author);s&&s.relays&&(o.relays||(o.relays=[]),s.relays.forEach(i=>{o.relays.indexOf(i)===-1&&o.relays.push(i)}),s.relays=o.relays)}}),t}var ny={};X(ny,{fetchRelayInformation:()=>oy,useFetchImplementation:()=>ry});var Ol;try{Ol=fetch}catch{}function ry(e){Ol=e}async function oy(e){return await(await fetch(e.replace("ws://","http://").replace("wss://","https://"),{headers:{Accept:"application/nostr+json"}})).json()}var sy={};X(sy,{getPow:()=>iy,minePow:()=>cy});function iy(e){let t=0;for(let n=0;n<64;n+=8){const r=parseInt(e.substring(n,n+8),16);if(r===0)t+=32;else{t+=Math.clz32(r);break}}return t}function ay(e){let t=0;for(let n=0;n<e.length;n++){const r=e[n];if(r===0)t+=8;else{t+=Math.clz32(r)-24;break}}return t}function cy(e,t){let n=0;const r=e,o=["nonce",n.toString(),t.toString()];for(r.tags.push(o);;){const s=Math.floor(new Date().getTime()/1e3);s!==r.created_at&&(n=0,r.created_at=s),o[1]=(++n).toString();const i=se(Ce.encode(JSON.stringify([0,r.pubkey,r.created_at,r.kind,r.tags,r.content])));if(ay(i)>=t){r.id=q(i);break}}return r}var ly={};X(ly,{unwrapEvent:()=>Ey,unwrapManyEvents:()=>ky,wrapEvent:()=>zl,wrapManyEvents:()=>wy});var dy={};X(dy,{createRumor:()=>Gl,createSeal:()=>Kl,createWrap:()=>Vl,unwrapEvent:()=>mi,unwrapManyEvents:()=>Wl,wrapEvent:()=>jr,wrapManyEvents:()=>by});var uy={};X(uy,{decrypt:()=>pi,encrypt:()=>hi,getConversationKey:()=>ui,v2:()=>yy});var Bl=1,Pl=65535;function ui(e,t){const n=De.getSharedSecret(e,z("02"+t)).subarray(1,33);return ml(se,n,Ce.encode("nip44-v2"))}function Ul(e,t){const n=yl(se,e,t,76);return{chacha_key:n.subarray(0,32),chacha_nonce:n.subarray(32,44),hmac_key:n.subarray(44,76)}}function fi(e){if(!Number.isSafeInteger(e)||e<1)throw new Error("expected positive integer");if(e<=32)return 32;const t=1<<Math.floor(Math.log2(e-1))+1,n=t<=256?32:t/8;return n*(Math.floor((e-1)/n)+1)}function fy(e){if(!Number.isSafeInteger(e)||e<Bl||e>Pl)throw new Error("invalid plaintext size: must be between 1 and 65535 bytes");const t=new Uint8Array(2);return new DataView(t.buffer).setUint16(0,e,!1),t}function hy(e){const t=Ce.encode(e),n=t.length,r=fy(n),o=new Uint8Array(fi(n)-n);return oe(r,t,o)}function py(e){const t=new DataView(e.buffer).getUint16(0),n=e.subarray(2,2+t);if(t<Bl||t>Pl||n.length!==t||e.length!==2+fi(t))throw new Error("invalid padding");return et.decode(n)}function Dl(e,t,n){if(n.length!==32)throw new Error("AAD associated data must be 32 bytes");const r=oe(n,t);return nt(se,e,r)}function my(e){if(typeof e!="string")throw new Error("payload must be a valid string");const t=e.length;if(t<132||t>87472)throw new Error("invalid payload length: "+t);if(e[0]==="#")throw new Error("unknown encryption version");let n;try{n=Ge.decode(e)}catch(s){throw new Error("invalid base64: "+s.message)}const r=n.length;if(r<99||r>65603)throw new Error("invalid data length: "+r);const o=n[0];if(o!==2)throw new Error("unknown encryption version "+o);return{nonce:n.subarray(1,33),ciphertext:n.subarray(33,-32),mac:n.subarray(-32)}}function hi(e,t,n=wt(32)){const{chacha_key:r,chacha_nonce:o,hmac_key:s}=Ul(t,n),i=hy(e),a=oo(r,o,i),c=Dl(s,a,n);return Ge.encode(oe(new Uint8Array([2]),n,a,c))}function pi(e,t){const{nonce:n,ciphertext:r,mac:o}=my(e),{chacha_key:s,chacha_nonce:i,hmac_key:a}=Ul(t,n),c=Dl(a,r,n);if(!al(c,o))throw new Error("invalid MAC");const l=oo(s,i,r);return py(l)}var yy={utils:{getConversationKey:ui,calcPaddedLen:fi},encrypt:hi,decrypt:pi},gy=2880*60,jl=()=>Math.round(Date.now()/1e3),ql=()=>Math.round(jl()-Math.random()*gy),Hl=(e,t)=>ui(e,t),Fl=(e,t,n)=>hi(JSON.stringify(e),Hl(t,n)),Ea=(e,t)=>JSON.parse(pi(e.content,Hl(t,e.pubkey)));function Gl(e,t){const n={created_at:jl(),content:"",tags:[],...e,pubkey:io(t)};return n.id=wr(n),n}function Kl(e,t,n){return We({kind:wl,content:Fl(e,t,n),created_at:ql(),tags:[]},t)}function Vl(e,t){const n=tp();return We({kind:Rl,content:Fl(e,n,t),created_at:ql(),tags:[["p",t]]},n)}function jr(e,t,n){const r=Gl(e,t),o=Kl(r,t,n);return Vl(o,n)}function by(e,t,n){if(!n||n.length===0)throw new Error("At least one recipient is required.");const r=io(t),o=[jr(e,t,r)];return n.forEach(s=>{o.push(jr(e,t,s))}),o}function mi(e,t){const n=Ea(e,t);return Ea(n,t)}function Wl(e,t){let n=[];return e.forEach(r=>{n.push(mi(r,t))}),n.sort((r,o)=>r.created_at-o.created_at),n}function vy(e,t,n,r){const o={created_at:Math.ceil(Date.now()/1e3),kind:El,tags:[],content:t};return(Array.isArray(e)?e:[e]).forEach(({publicKey:i,relayUrl:a})=>{o.tags.push(a?["p",i,a]:["p",i])}),r&&o.tags.push(["e",r.eventId,r.relayUrl||"","reply"]),n&&o.tags.push(["subject",n]),o}function zl(e,t,n,r,o){const s=vy(t,n,r,o);return jr(s,e,t.publicKey)}function wy(e,t,n,r,o){if(!t||t.length===0)throw new Error("At least one recipient is required.");return[{publicKey:io(e)},...t].map(i=>zl(e,i,n,r,o))}var Ey=mi,ky=Wl,_y={};X(_y,{finishRepostEvent:()=>xy,getRepostedEvent:()=>Sy,getRepostedEventPointer:()=>Jl});function xy(e,t,n,r){let o;const s=[...e.tags??[],["e",t.id,n],["p",t.pubkey]];return t.kind===vl?o=ri:(o=si,s.push(["k",String(t.kind)])),We({kind:o,tags:s,content:e.content===""||t.tags?.find(i=>i[0]==="-")?"":JSON.stringify(t),created_at:e.created_at},r)}function Jl(e){if(![ri,si].includes(e.kind))return;let t,n;for(let r=e.tags.length-1;r>=0&&(t===void 0||n===void 0);r--){const o=e.tags[r];o.length>=2&&(o[0]==="e"&&t===void 0?t=o:o[0]==="p"&&n===void 0&&(n=o))}if(t!==void 0)return{id:t[1],relays:[t[2],n?.[2]].filter(r=>typeof r=="string"),author:n?.[1]}}function Sy(e,{skipVerification:t}={}){const n=Jl(e);if(n===void 0||e.content==="")return;let r;try{r=JSON.parse(e.content)}catch{return}if(r.id===n.id&&!(!t&&!ei(r)))return r}var Iy={};X(Iy,{NOSTR_URI_REGEX:()=>yi,parse:()=>Ay,test:()=>Ry});var yi=new RegExp(`nostr:(${Ll.source})`);function Ry(e){return typeof e=="string"&&new RegExp(`^${yi.source}$`).test(e)}function Ay(e){const t=e.match(new RegExp(`^${yi.source}$`));if(!t)throw new Error(`Invalid Nostr URI: ${e}`);return{uri:t[0],value:t[1],decoded:ao(t[1])}}var Cy={};X(Cy,{finishReactionEvent:()=>Ty,getReactedEventPointer:()=>Ly});function Ty(e,t,n){const r=t.tags.filter(o=>o.length>=2&&(o[0]==="e"||o[0]==="p"));return We({...e,kind:oi,tags:[...e.tags??[],...r,["e",t.id],["p",t.pubkey]],content:e.content??"+"},n)}function Ly(e){if(e.kind!==oi)return;let t,n;for(let r=e.tags.length-1;r>=0&&(t===void 0||n===void 0);r--){const o=e.tags[r];o.length>=2&&(o[0]==="e"&&t===void 0?t=o:o[0]==="p"&&n===void 0&&(n=o))}if(!(t===void 0||n===void 0))return{id:t[1],relays:[t[2],n[2]].filter(r=>r!==void 0),author:n[1]}}var Ny={};X(Ny,{parse:()=>My});var Uo=/\W/m,ka=/[^\w\/] |[^\w\/]$|$|,| /m,$y=42;function*My(e){let t=[];if(typeof e!="string"){for(let s=0;s<e.tags.length;s++){const i=e.tags[s];i[0]==="emoji"&&i.length>=3&&t.push({type:"emoji",shortcode:i[1],url:i[2]})}e=e.content}const n=e.length;let r=0,o=0;e:for(;o<n;){const s=e.indexOf(":",o),i=e.indexOf("#",o);if(s===-1&&i===-1)break e;if(s===-1||i>=0&&i<s){if(i===0||e[i-1].match(Uo)){const a=e.slice(i+1,i+$y).match(Uo),c=a?i+1+a.index:n;yield{type:"text",text:e.slice(r,i)},yield{type:"hashtag",value:e.slice(i+1,c)},o=c,r=o;continue e}o=i+1;continue e}if(e.slice(s-5,s)==="nostr"){const a=e.slice(s+60).match(Uo),c=a?s+60+a.index:n;try{let l,{data:d,type:u}=ao(e.slice(s+1,c));switch(u){case"npub":l={pubkey:d};break;case"note":l={id:d};break;case"nsec":o=c+1;continue;default:l=d}r!==s-5&&(yield{type:"text",text:e.slice(r,s-5)}),yield{type:"reference",pointer:l},o=c,r=o;continue e}catch{o=s+1;continue e}}else if(e.slice(s-5,s)==="https"||e.slice(s-4,s)==="http"){const a=e.slice(s+4).match(ka),c=a?s+4+a.index:n,l=e[s-1]==="s"?5:4;try{let d=new URL(e.slice(s-l,c));if(d.hostname.indexOf(".")===-1)throw new Error("invalid url");if(r!==s-l&&(yield{type:"text",text:e.slice(r,s-l)}),/\.(png|jpe?g|gif|webp|heic|svg)$/i.test(d.pathname)){yield{type:"image",url:d.toString()},o=c,r=o;continue e}if(/\.(mp4|avi|webm|mkv|mov)$/i.test(d.pathname)){yield{type:"video",url:d.toString()},o=c,r=o;continue e}if(/\.(mp3|aac|ogg|opus|wav|flac)$/i.test(d.pathname)){yield{type:"audio",url:d.toString()},o=c,r=o;continue e}yield{type:"url",url:d.toString()},o=c,r=o;continue e}catch{o=c+1;continue e}}else if(e.slice(s-3,s)==="wss"||e.slice(s-2,s)==="ws"){const a=e.slice(s+4).match(ka),c=a?s+4+a.index:n,l=e[s-1]==="s"?3:2;try{let d=new URL(e.slice(s-l,c));if(d.hostname.indexOf(".")===-1)throw new Error("invalid ws url");r!==s-l&&(yield{type:"text",text:e.slice(r,s-l)}),yield{type:"relay",url:d.toString()},o=c,r=o;continue e}catch{o=c+1;continue e}}else{for(let a=0;a<t.length;a++){const c=t[a];if(e[s+c.shortcode.length+1]===":"&&e.slice(s+1,s+c.shortcode.length+1)===c.shortcode){r!==s&&(yield{type:"text",text:e.slice(r,s)}),yield c,o=s+c.shortcode.length+2,r=o;continue e}}o=s+1;continue e}}r!==n&&(yield{type:"text",text:e.slice(r)})}var Oy={};X(Oy,{channelCreateEvent:()=>By,channelHideMessageEvent:()=>Dy,channelMessageEvent:()=>Uy,channelMetadataEvent:()=>Py,channelMuteUserEvent:()=>jy});var By=(e,t)=>{let n;if(typeof e.content=="object")n=JSON.stringify(e.content);else if(typeof e.content=="string")n=e.content;else return;return We({kind:kl,tags:[...e.tags??[]],content:n,created_at:e.created_at},t)},Py=(e,t)=>{let n;if(typeof e.content=="object")n=JSON.stringify(e.content);else if(typeof e.content=="string")n=e.content;else return;return We({kind:_l,tags:[["e",e.channel_create_event_id],...e.tags??[]],content:n,created_at:e.created_at},t)},Uy=(e,t)=>{const n=[["e",e.channel_create_event_id,e.relay_url,"root"]];return e.reply_to_channel_message_event_id&&n.push(["e",e.reply_to_channel_message_event_id,e.relay_url,"reply"]),We({kind:xl,tags:[...n,...e.tags??[]],content:e.content,created_at:e.created_at},t)},Dy=(e,t)=>{let n;if(typeof e.content=="object")n=JSON.stringify(e.content);else if(typeof e.content=="string")n=e.content;else return;return We({kind:Sl,tags:[["e",e.channel_message_event_id],...e.tags??[]],content:n,created_at:e.created_at},t)},jy=(e,t)=>{let n;if(typeof e.content=="object")n=JSON.stringify(e.content);else if(typeof e.content=="string")n=e.content;else return;return We({kind:Il,tags:[["p",e.pubkey_to_mute],...e.tags??[]],content:n,created_at:e.created_at},t)},qy={};X(qy,{EMOJI_SHORTCODE_REGEX:()=>Yl,matchAll:()=>Hy,regex:()=>gi,replaceAll:()=>Fy});var Yl=/:(\w+):/,gi=()=>new RegExp(`\\B${Yl.source}\\B`,"g");function*Hy(e){const t=e.matchAll(gi());for(const n of t)try{const[r,o]=n;yield{shortcode:r,name:o,start:n.index,end:n.index+r.length}}catch{}}function Fy(e,t){return e.replaceAll(gi(),(n,r)=>t({shortcode:n,name:r}))}var Gy={};X(Gy,{useFetchImplementation:()=>Ky,validateGithub:()=>Vy});var bi;try{bi=fetch}catch{}function Ky(e){bi=e}async function Vy(e,t,n){try{return await(await bi(`https://gist.github.com/${t}/${n}/raw`)).text()===`Verifying that I control the following Nostr public key: ${e}`}catch{return!1}}var Wy={};X(Wy,{makeNwcRequestEvent:()=>Jy,parseConnectionString:()=>zy});function zy(e){const{host:t,pathname:n,searchParams:r}=new URL(e),o=n||t,s=r.get("relay"),i=r.get("secret");if(!o||!s||!i)throw new Error("invalid connection string");return{pubkey:o,relay:s,secret:i}}async function Jy(e,t,n){const o=Nl(t,e,JSON.stringify({method:"pay_invoice",params:{invoice:n}})),s={kind:Cl,created_at:Math.round(Date.now()/1e3),content:o,tags:[["p",e]]};return We(s,t)}var Yy={};X(Yy,{normalizeIdentifier:()=>Zy});function Zy(e){return e=e.trim().toLowerCase(),e=e.normalize("NFKC"),Array.from(e).map(t=>new RegExp("\\p{Letter}","u").test(t)||new RegExp("\\p{Number}","u").test(t)?t:"-").join("")}var Xy={};X(Xy,{getSatoshisAmountFromBolt11:()=>og,getZapEndpoint:()=>eg,makeZapReceipt:()=>rg,makeZapRequest:()=>tg,useFetchImplementation:()=>Qy,validateZapRequest:()=>ng});var vi;try{vi=fetch}catch{}function Qy(e){vi=e}async function eg(e){try{let t="",{lud06:n,lud16:r}=JSON.parse(e.content);if(r){let[i,a]=r.split("@");t=new URL(`/.well-known/lnurlp/${i}`,`https://${a}`).toString()}else if(n){let{words:i}=Ke.decode(n,1e3),a=Ke.fromWords(i);t=et.decode(a)}else return null;let s=await(await vi(t)).json();if(s.allowsNostr&&s.nostrPubkey)return s.callback}catch{}return null}function tg(e){let t={kind:9734,created_at:Math.round(Date.now()/1e3),content:e.comment||"",tags:[["p","pubkey"in e?e.pubkey:e.event.pubkey],["amount",e.amount.toString()],["relays",...e.relays]]};if("event"in e){if(t.tags.push(["e",e.event.id]),ti(e.event.kind)){const n=["a",`${e.event.kind}:${e.event.pubkey}:`];t.tags.push(n)}else if(ni(e.event.kind)){let n=e.event.tags.find(([o,s])=>o==="d"&&s);if(!n)throw new Error("d tag not found or is empty");const r=["a",`${e.event.kind}:${e.event.pubkey}:${n[1]}`];t.tags.push(r)}t.tags.push(["k",e.event.kind.toString()])}return t}function ng(e){let t;try{t=JSON.parse(e)}catch{return"Invalid zap request JSON."}if(!Xs(t))return"Zap request is not a valid Nostr event.";if(!ei(t))return"Invalid signature on zap request.";let n=t.tags.find(([s,i])=>s==="p"&&i);if(!n)return"Zap request doesn't have a 'p' tag.";if(!n[1].match(/^[a-f0-9]{64}$/))return"Zap request 'p' tag is not valid hex.";let r=t.tags.find(([s,i])=>s==="e"&&i);return r&&!r[1].match(/^[a-f0-9]{64}$/)?"Zap request 'e' tag is not valid hex.":t.tags.find(([s,i])=>s==="relays"&&i)?null:"Zap request doesn't have a 'relays' tag."}function rg({zapRequest:e,preimage:t,bolt11:n,paidAt:r}){let o=JSON.parse(e),s=o.tags.filter(([a])=>a==="e"||a==="p"||a==="a"),i={kind:9735,created_at:Math.round(r.getTime()/1e3),content:"",tags:[...s,["P",o.pubkey],["bolt11",n],["description",e]]};return t&&i.tags.push(["preimage",t]),i}function og(e){if(e.length<50)return 0;e=e.substring(0,50);const t=e.lastIndexOf("1");if(t===-1)return 0;const n=e.substring(0,t);if(!n.startsWith("lnbc"))return 0;const r=n.substring(4);if(r.length<1)return 0;const o=r[r.length-1],s=o.charCodeAt(0)-48,i=s>=0&&s<=9;let a=r.length-1;if(i&&a++,a<1)return 0;const c=parseInt(r.substring(0,a));switch(o){case"m":return c*1e5;case"u":return c*100;case"n":return c/10;case"p":return c/1e4;default:return c*1e8}}var sg={};X(sg,{Negentropy:()=>Xl,NegentropyStorageVector:()=>cg,NegentropySync:()=>lg});var Do=97,Qt=32,Zl=16,Et={Skip:0,Fingerprint:1,IdList:2},Ze=class{_raw;length;constructor(e){typeof e=="number"?(this._raw=new Uint8Array(e),this.length=0):e instanceof Uint8Array?(this._raw=new Uint8Array(e),this.length=e.length):(this._raw=new Uint8Array(512),this.length=0)}unwrap(){return this._raw.subarray(0,this.length)}get capacity(){return this._raw.byteLength}extend(e){if(e instanceof Ze&&(e=e.unwrap()),typeof e.length!="number")throw Error("bad length");const t=e.length+this.length;if(this.capacity<t){const n=this._raw,r=Math.max(this.capacity*2,t);this._raw=new Uint8Array(r),this._raw.set(n)}this._raw.set(e,this.length),this.length+=e.length}shift(){const e=this._raw[0];return this._raw=this._raw.subarray(1),this.length--,e}shiftN(e=1){const t=this._raw.subarray(0,e);return this._raw=this._raw.subarray(e),this.length-=e,t}};function cr(e){let t=0;for(;;){if(e.length===0)throw Error("parse ends prematurely");let n=e.shift();if(t=t<<7|n&127,(n&128)===0)break}return t}function Ye(e){if(e===0)return new Ze(new Uint8Array([0]));let t=[];for(;e!==0;)t.push(e&127),e>>>=7;t.reverse();for(let n=0;n<t.length-1;n++)t[n]|=128;return new Ze(new Uint8Array(t))}function ig(e){return Er(e,1)[0]}function Er(e,t){if(e.length<t)throw Error("parse ends prematurely");return e.shiftN(t)}var ag=class{buf;constructor(){this.setToZero()}setToZero(){this.buf=new Uint8Array(Qt)}add(e){let t=0,n=0,r=new DataView(this.buf.buffer),o=new DataView(e.buffer);for(let s=0;s<8;s++){let i=s*4,a=r.getUint32(i,!0),c=o.getUint32(i,!0),l=a;l+=t,l+=c,l>4294967295&&(n=1),r.setUint32(i,l&4294967295,!0),t=n,n=0}}negate(){let e=new DataView(this.buf.buffer);for(let n=0;n<8;n++){let r=n*4;e.setUint32(r,~e.getUint32(r,!0))}let t=new Uint8Array(Qt);t[0]=1,this.add(t)}getFingerprint(e){let t=new Ze;return t.extend(this.buf),t.extend(Ye(e)),se(t.unwrap()).subarray(0,Zl)}},cg=class{items;sealed;constructor(){this.items=[],this.sealed=!1}insert(e,t){if(this.sealed)throw Error("already sealed");const n=z(t);if(n.byteLength!==Qt)throw Error("bad id size for added item");this.items.push({timestamp:e,id:n})}seal(){if(this.sealed)throw Error("already sealed");this.sealed=!0,this.items.sort(jo);for(let e=1;e<this.items.length;e++)if(jo(this.items[e-1],this.items[e])===0)throw Error("duplicate item inserted")}unseal(){this.sealed=!1}size(){return this._checkSealed(),this.items.length}getItem(e){if(this._checkSealed(),e>=this.items.length)throw Error("out of range");return this.items[e]}iterate(e,t,n){this._checkSealed(),this._checkBounds(e,t);for(let r=e;r<t&&n(this.items[r],r);++r);}findLowerBound(e,t,n){return this._checkSealed(),this._checkBounds(e,t),this._binarySearch(this.items,e,t,r=>jo(r,n)<0)}fingerprint(e,t){let n=new ag;return n.setToZero(),this.iterate(e,t,r=>(n.add(r.id),!0)),n.getFingerprint(t-e)}_checkSealed(){if(!this.sealed)throw Error("not sealed")}_checkBounds(e,t){if(e>t||t>this.items.length)throw Error("bad range")}_binarySearch(e,t,n,r){let o=n-t;for(;o>0;){let s=t,i=Math.floor(o/2);s+=i,r(e[s])?(t=++s,o-=i+1):o=i}return t}},Xl=class{storage;frameSizeLimit;lastTimestampIn;lastTimestampOut;constructor(e,t=6e4){if(t<4096)throw Error("frameSizeLimit too small");this.storage=e,this.frameSizeLimit=t,this.lastTimestampIn=0,this.lastTimestampOut=0}_bound(e,t){return{timestamp:e,id:t||new Uint8Array(0)}}initiate(){let e=new Ze;return e.extend(new Uint8Array([Do])),this.splitRange(0,this.storage.size(),this._bound(Number.MAX_VALUE),e),q(e.unwrap())}reconcile(e,t,n){const r=new Ze(z(e));this.lastTimestampIn=this.lastTimestampOut=0;let o=new Ze;o.extend(new Uint8Array([Do]));let s=ig(r);if(s<96||s>111)throw Error("invalid negentropy protocol version byte");if(s!==Do)throw Error("unsupported negentropy protocol version requested: "+(s-96));let i=this.storage.size(),a=this._bound(0),c=0,l=!1;for(;r.length!==0;){let d=new Ze,u=()=>{l&&(l=!1,d.extend(this.encodeBound(a)),d.extend(Ye(Et.Skip)))},f=this.decodeBound(r),h=cr(r),p=c,m=this.storage.findLowerBound(c,i,f);if(h===Et.Skip)l=!0;else if(h===Et.Fingerprint){let y=Er(r,Zl),b=this.storage.fingerprint(p,m);Ql(y,b)!==0?(u(),this.splitRange(p,m,f,d)):l=!0}else if(h===Et.IdList){let y=cr(r),b={};for(let E=0;E<y;E++){let L=Er(r,Qt);b[q(L)]=L}if(l=!0,this.storage.iterate(p,m,E=>{let L=E.id;const O=q(L);return b[O]?delete b[q(L)]:t?.(O),!0}),n)for(let E of Object.values(b))n(q(E))}else throw Error("unexpected mode");if(this.exceededFrameSizeLimit(o.length+d.length)){let y=this.storage.fingerprint(m,i);o.extend(this.encodeBound(this._bound(Number.MAX_VALUE))),o.extend(Ye(Et.Fingerprint)),o.extend(y);break}else o.extend(d);c=m,a=f}return o.length===1?null:q(o.unwrap())}splitRange(e,t,n,r){let o=t-e,s=16;if(o<s*2)r.extend(this.encodeBound(n)),r.extend(Ye(Et.IdList)),r.extend(Ye(o)),this.storage.iterate(e,t,i=>(r.extend(i.id),!0));else{let i=Math.floor(o/s),a=o%s,c=e;for(let l=0;l<s;l++){let d=i+(l<a?1:0),u=this.storage.fingerprint(c,c+d);c+=d;let f;if(c===t)f=n;else{let h,p;this.storage.iterate(c-1,c+1,(m,y)=>(y===c-1?h=m:p=m,!0)),f=this.getMinimalBound(h,p)}r.extend(this.encodeBound(f)),r.extend(Ye(Et.Fingerprint)),r.extend(u)}}}exceededFrameSizeLimit(e){return e>this.frameSizeLimit-200}decodeTimestampIn(e){let t=cr(e);return t=t===0?Number.MAX_VALUE:t-1,this.lastTimestampIn===Number.MAX_VALUE||t===Number.MAX_VALUE?(this.lastTimestampIn=Number.MAX_VALUE,Number.MAX_VALUE):(t+=this.lastTimestampIn,this.lastTimestampIn=t,t)}decodeBound(e){let t=this.decodeTimestampIn(e),n=cr(e);if(n>Qt)throw Error("bound key too long");let r=Er(e,n);return{timestamp:t,id:r}}encodeTimestampOut(e){if(e===Number.MAX_VALUE)return this.lastTimestampOut=Number.MAX_VALUE,Ye(0);let t=e;return e-=this.lastTimestampOut,this.lastTimestampOut=t,Ye(e+1)}encodeBound(e){let t=new Ze;return t.extend(this.encodeTimestampOut(e.timestamp)),t.extend(Ye(e.id.length)),t.extend(e.id),t}getMinimalBound(e,t){if(t.timestamp!==e.timestamp)return this._bound(t.timestamp);{let n=0,r=t.id,o=e.id;for(let s=0;s<Qt&&r[s]===o[s];s++)n++;return this._bound(t.timestamp,t.id.subarray(0,n+1))}}};function Ql(e,t){for(let n=0;n<e.byteLength;n++){if(e[n]<t[n])return-1;if(e[n]>t[n])return 1}return e.byteLength>t.byteLength?1:e.byteLength<t.byteLength?-1:0}function jo(e,t){return e.timestamp===t.timestamp?Ql(e.id,t.id):e.timestamp-t.timestamp}var lg=class{relay;storage;neg;filter;subscription;onhave;onneed;constructor(e,t,n,r={}){this.relay=e,this.storage=t,this.neg=new Xl(t),this.onhave=r.onhave,this.onneed=r.onneed,this.filter=n,this.subscription=this.relay.prepareSubscription([{}],{label:r.label||"negentropy"}),this.subscription.oncustom=o=>{switch(o[0]){case"NEG-MSG":{o.length<3&&console.warn(`got invalid NEG-MSG from ${this.relay.url}: ${o}`);try{const s=this.neg.reconcile(o[2],this.onhave,this.onneed);s?this.relay.send(`["NEG-MSG", "${this.subscription.id}", "${s}"]`):(this.close(),r.onclose?.())}catch(s){console.error("negentropy reconcile error:",s),r?.onclose?.(`reconcile error: ${s}`)}break}case"NEG-CLOSE":{const s=o[2];console.warn("negentropy error:",s),r.onclose?.(s);break}case"NEG-ERR":r.onclose?.()}}}async start(){const e=this.neg.initiate();this.relay.send(`["NEG-OPEN","${this.subscription.id}",${JSON.stringify(this.filter)},"${e}"]`)}close(){this.relay.send(`["NEG-CLOSE","${this.subscription.id}"]`),this.subscription.close()}},dg={};X(dg,{getToken:()=>ug,hashPayload:()=>wi,unpackEventFromToken:()=>td,validateEvent:()=>ad,validateEventKind:()=>rd,validateEventMethodTag:()=>sd,validateEventPayloadTag:()=>id,validateEventTimestamp:()=>nd,validateEventUrlTag:()=>od,validateToken:()=>fg});var ed="Nostr ";async function ug(e,t,n,r=!1,o){const s={kind:ii,tags:[["u",e],["method",t]],created_at:Math.round(new Date().getTime()/1e3),content:""};o&&s.tags.push(["payload",wi(o)]);const i=await n(s);return(r?ed:"")+Ge.encode(Ce.encode(JSON.stringify(i)))}async function fg(e,t,n){const r=await td(e).catch(s=>{throw s});return await ad(r,t,n).catch(s=>{throw s})}async function td(e){if(!e)throw new Error("Missing token");e=e.replace(ed,"");const t=et.decode(Ge.decode(e));if(!t||t.length===0||!t.startsWith("{"))throw new Error("Invalid token");return JSON.parse(t)}function nd(e){return e.created_at?Math.round(new Date().getTime()/1e3)-e.created_at<60:!1}function rd(e){return e.kind===ii}function od(e,t){const n=e.tags.find(r=>r[0]==="u");return n?n.length>0&&n[1]===t:!1}function sd(e,t){const n=e.tags.find(r=>r[0]==="method");return n?n.length>0&&n[1].toLowerCase()===t.toLowerCase():!1}function wi(e){const t=se(Ce.encode(JSON.stringify(e)));return q(t)}function id(e,t){const n=e.tags.find(o=>o[0]==="payload");if(!n)return!1;const r=wi(t);return n.length>0&&n[1]===r}async function ad(e,t,n,r){if(!ei(e))throw new Error("Invalid nostr event, signature invalid");if(!rd(e))throw new Error("Invalid nostr event, kind invalid");if(!nd(e))throw new Error("Invalid nostr event, created_at timestamp invalid");if(!od(e,t))throw new Error("Invalid nostr event, url tag invalid");if(!sd(e,n))throw new Error("Invalid nostr event, method tag invalid");if(r&&typeof r=="object"&&Object.keys(r).length>0&&!id(e,r))throw new Error("Invalid nostr event, payload tag does not match request body hash");return!0}function hg(e){return Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}const pg="m/44'/1237'/0'/0/0";function mg(){return Cf(Tc,128)}function cd(e){return $f(e,Tc)}function ld(e){const t=Of(e),r=St.fromMasterSeed(t).derive(pg);if(!r.privateKey)throw new Error("Failed to derive private key");const o=hg(r.privateKey);return{pubkey:io(r.privateKey),privkey:o}}const _a=Object.freeze(Object.defineProperty({__proto__:null,generateMnemonic:mg,mnemonicToKeypair:ld,validateMnemonic:cd},Symbol.toStringTag,{value:"Module"})),fs="canary:duress-queue";let hs=null,ps=null,On=null;function yg(e){hs=e.encrypt,ps=e.decrypt,On=e.getPinKey}function qo(e){return Array.isArray(e)?e.every(t=>t!=null&&typeof t=="object"&&typeof t.groupId=="string"&&t.message!=null):!1}async function gg(){try{const e=localStorage.getItem(fs);if(!e)return[];const t=JSON.parse(e);if(qo(t))return t;if(t&&typeof t=="object"&&typeof t.entries=="string"){if(t.encrypted&&ps&&On){const r=On();if(!r)return[];const o=await ps(t.entries,r),s=JSON.parse(o);return qo(s)?s:[]}const n=JSON.parse(t.entries);return qo(n)?n:[]}return[]}catch{return[]}}async function bg(e){try{const t=JSON.stringify(e);if(hs&&On){const n=On();if(n){const r=await hs(t,n);localStorage.setItem(fs,JSON.stringify({encrypted:!0,entries:r}));return}}localStorage.setItem(fs,JSON.stringify({entries:t}))}catch{}}async function vg(e){const t=await gg(),n=t.filter(o=>o.groupId===e),r=t.filter(o=>o.groupId!==e);return await bg(r),n.map(o=>o.message)}const qr="canary:groups",Hr="canary:identity",fo="canary:settings",ho="canary:pin-salt",Ln="canary:active-group",ms="canary:mnemonic";let en=null;function dd(e){en=e}function po(){en=null}const lr={theme:"dark",pinEnabled:!0,autoLockMinutes:5,defaultRelays:[He],defaultReadRelays:[...tt,He],defaultWriteRelays:[He]};function it(e){try{const t=localStorage.getItem(e);return t===null?null:JSON.parse(t)}catch{return null}}function kt(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch{}}function Le(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function un(e){return Le(e)&&e._encrypted===!0&&typeof e.ciphertext=="string"}async function Ho(e,t){return{_encrypted:!0,ciphertext:await pc(JSON.stringify(e),t)}}async function Ei(e,t){return JSON.parse(await Qr(e.ciphertext,t))}function ud(e){return Le(e)?Object.values(e).some(t=>Le(t)&&t._seedEncrypted===!0):!1}function fd(e){return Le(e)&&e._privkeyEncrypted===!0}function hd(){return localStorage.getItem(ho)}function wg(){const e=zu(),t=Ju(e);return localStorage.setItem(ho,t),t}function pd(){localStorage.removeItem(ho)}async function Eg(e,t){const n={};for(const[r,o]of Object.entries(e)){const{_seedEncrypted:s,...i}=o;n[r]={...i,seed:s?await Qr(o.seed,t):o.seed}}return n}function kg(e){if(e.readRelays?.length||e.writeRelays?.length)return{readRelays:e.readRelays??[],writeRelays:e.writeRelays??[]};const t=e.relays??[],n=t.length>0?t:[He],r=new Set([...tt,...n]);return{readRelays:Array.from(r),writeRelays:n}}function ki(e){const t={...lr,...e??{}};return t.defaultRelays?.length||(t.defaultRelays=[...lr.defaultRelays]),t.defaultReadRelays?.length||(t.defaultReadRelays=[...lr.defaultReadRelays]),t.defaultWriteRelays?.length||(t.defaultWriteRelays=[...lr.defaultWriteRelays]),t}function kr(e){if(!Le(e))return{};const t={};for(const[n,r]of Object.entries(e)){if(!Le(r)||typeof r.name!="string")continue;const o=kg(r);t[n]={...r,id:n,usedInvites:Array.isArray(r.usedInvites)?r.usedInvites.filter(s=>typeof s=="string"):[],latestInviteIssuedAt:typeof r.latestInviteIssuedAt=="number"?r.latestInviteIssuedAt:0,tolerance:typeof r.tolerance=="number"?r.tolerance:1,livenessInterval:typeof r.livenessInterval=="number"?r.livenessInterval:typeof r.rotationInterval=="number"?r.rotationInterval:604800,livenessCheckins:Le(r.livenessCheckins)?Object.fromEntries(Object.entries(r.livenessCheckins).filter(([,s])=>typeof s=="number").map(([s,i])=>[s,i])):{},memberNames:Le(r.memberNames)?Object.fromEntries(Object.entries(r.memberNames).filter(([,s])=>typeof s=="string").map(([s,i])=>[s,i])):void 0,lastPositions:Le(r.lastPositions)?Object.fromEntries(Object.entries(r.lastPositions).filter(([,s])=>Le(s)).map(([s,i])=>[s,i])):void 0,beaconPrecision:typeof r.beaconPrecision=="number"?r.beaconPrecision:5,duressPrecision:typeof r.duressPrecision=="number"?r.duressPrecision:9,nostrEnabled:typeof r.nostrEnabled=="boolean"?r.nostrEnabled:o.writeRelays.length>0||o.readRelays.length>0,...o}}return t}function ys(e){return!Le(e)||typeof e.pubkey!="string"?null:{pubkey:e.pubkey,privkey:typeof e.privkey=="string"?e.privkey:void 0,nsec:typeof e.nsec=="string"?e.nsec:void 0,mnemonic:typeof e.mnemonic=="string"?e.mnemonic:void 0,displayName:typeof e.displayName=="string"?e.displayName:void 0,picture:typeof e.picture=="string"?e.picture:void 0,signerType:e.signerType==="nip07"?"nip07":"local"}}function Nn(e){const t=localStorage.getItem(ms);if(!t)return{identity:e,migrated:!1};let n=e;const r=t.trim().replace(/\s+/g," ");try{if(n&&cd(r)){const{pubkey:o}=ld(r);o===n.pubkey&&(n={...n,mnemonic:r})}}catch{}return localStorage.removeItem(ms),{identity:n,migrated:!0}}function md(e,t){if(typeof e=="string"&&e in t)return e;const n=Object.keys(t);return n.length>0?n[0]:null}async function _g(e){const t=it(qr);if(t===null)return{groups:{},migrated:!1};if(un(t)){if(!e)throw new Error("Encrypted groups require PIN unlock");const n=await Ei(t,e);return{groups:kr(n),migrated:!1}}if(ud(t)){if(!e)throw new Error("Encrypted groups require PIN unlock");const n=await Eg(t,e);return{groups:kr(n),migrated:!0}}return{groups:kr(t),migrated:e!==void 0}}function xg(){const e=it(qr);return e===null||un(e)||ud(e)?{groups:{},migrated:!1}:{groups:kr(e),migrated:!1}}async function Sg(e){const t=it(Hr);if(t===null)return Nn(null);if(un(t)){if(!e)throw new Error("Encrypted identity requires PIN unlock");const s=await Ei(t,e);return Nn(ys(s))}let n=t,r=e!==void 0;if(fd(t)){if(!e)throw new Error("Encrypted identity requires PIN unlock");const s=t.privkey?await Qr(t.privkey,e):void 0,{_privkeyEncrypted:i,...a}=t;n={...a,privkey:s},r=!0}const o=Nn(ys(n));return{identity:o.identity,migrated:r||o.migrated}}function Ig(){const e=it(Hr);return e===null||un(e)||fd(e)?Nn(null):Nn(ys(e))}async function Rg(e){const t=it(Ln);if(t===null)return{activeGroupId:null,migrated:!1};if(un(t)){if(!e)throw new Error("Encrypted active group requires PIN unlock");const n=await Ei(t,e);return{activeGroupId:typeof n=="string"?n:null,migrated:!1}}return{activeGroupId:typeof t=="string"?t:null,migrated:e!==void 0}}function Ag(){const e=it(Ln);return e===null||un(e)?{activeGroupId:null,migrated:!1}:{activeGroupId:typeof e=="string"?e:null,migrated:!1}}async function mo(e,t){if(t){const[n,r,o]=await Promise.all([Ho(e.groups,t),Ho(e.identity,t),Ho(e.activeGroupId,t)]);kt(qr,n),kt(Hr,r),kt(Ln,o)}else kt(qr,e.groups),kt(Hr,e.identity),e.activeGroupId===null?localStorage.removeItem(Ln):kt(Ln,e.activeGroupId);kt(fo,e.settings),localStorage.removeItem(ms)}async function _i(){const e=_(),t=!!hd();if(e.settings.pinEnabled&&t&&en===null){console.error("[canary:storage] PIN enabled but key not loaded — state NOT persisted.");return}try{await mo(e,e.settings.pinEnabled&&en!==null?en:void 0)}catch(n){console.error("[canary:storage] Persistence failed — state NOT persisted:",n)}}function yd(){return localStorage.getItem(ho)!==null}function Cg(){const e=it(fo);return ki(e)}async function Tg(e){const t=hd();if(!t)throw new Error("No PIN salt found");const n=mc(t),r=await hc(e,n),o=it(fo),s=ki(o),[i,a,c]=await Promise.all([_g(r),Sg(r),Rg(r)]),l={view:"groups",groups:i.groups,activeGroupId:md(c.activeGroupId,i.groups),identity:a.identity,settings:s};dd(r),fc(l),(i.migrated||a.migrated||c.migrated)&&await mo(l,r)}function Lg(){const e=it(fo),t=ki(e),n=xg(),r=Ig(),o=Ag(),s={view:"groups",groups:n.groups,activeGroupId:md(o.activeGroupId,n.groups),identity:r.identity,settings:t};fc(s),(n.migrated||r.migrated||o.migrated)&&_i()}let gs=0,bs,xa=Promise.resolve();const Ng=100;function $g(){yg({encrypt:pc,decrypt:Qr,getPinKey:()=>en}),Tr(()=>{const e=++gs;clearTimeout(bs),bs=setTimeout(()=>{xa=xa.then(async()=>{e===gs&&await _i()}).catch(t=>{console.error("[canary:storage] Serialised write failed:",t)})},Ng)}),window.addEventListener("pagehide",()=>xi())}function xi(){clearTimeout(bs),gs++,_i().catch(()=>{})}async function Mg(e){const t=wg(),n=mc(t),r=await hc(e,n);dd(r);try{const o=_();await mo({...o,settings:{...o.settings,pinEnabled:!0}},r)}catch(o){throw po(),pd(),o}}async function Og(){const e=_();await mo({...e,settings:{...e.settings,pinEnabled:!1}}),po(),pd()}const Bg=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],Pg=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]);function Be(e,t){return(e>>>t|e<<32-t)>>>0}function ve(e){const t=e.length*8,n=new Uint8Array(Math.ceil((e.length+9)/64)*64);n.set(e),n[e.length]=128;const r=new DataView(n.buffer);r.setUint32(n.length-8,Math.floor(t/4294967296),!1),r.setUint32(n.length-4,t>>>0,!1);let[o,s,i,a,c,l,d,u]=Bg;const f=new Uint32Array(64);for(let m=0;m<n.length;m+=64){for(let v=0;v<16;v++)f[v]=r.getUint32(m+v*4,!1);for(let v=16;v<64;v++){const g=f[v-15],x=f[v-2],S=Be(g,7)^Be(g,18)^g>>>3,A=Be(x,17)^Be(x,19)^x>>>10;f[v]=f[v-16]+S+f[v-7]+A>>>0}let y=o,b=s,E=i,L=a,O=c,N=l,$=d,w=u;for(let v=0;v<64;v++){const g=Be(O,6)^Be(O,11)^Be(O,25),x=O&N^~O&$,S=w+g+x+Pg[v]+f[v]>>>0,A=Be(y,2)^Be(y,13)^Be(y,22),k=y&b^y&E^b&E,R=A+k>>>0;w=$,$=N,N=O,O=L+S>>>0,L=E,E=b,b=y,y=S+R>>>0}o=o+y>>>0,s=s+b>>>0,i=i+E>>>0,a=a+L>>>0,c=c+O>>>0,l=l+N>>>0,d=d+$>>>0,u=u+w>>>0}const h=new Uint8Array(32),p=new DataView(h.buffer);return p.setUint32(0,o,!1),p.setUint32(4,s,!1),p.setUint32(8,i,!1),p.setUint32(12,a,!1),p.setUint32(16,c,!1),p.setUint32(20,l,!1),p.setUint32(24,d,!1),p.setUint32(28,u,!1),h}const vn=64;function rt(e,t){const n=e.length>vn?ve(e):e,r=new Uint8Array(vn);r.set(n);const o=new Uint8Array(vn),s=new Uint8Array(vn);for(let c=0;c<vn;c++)o[c]=r[c]^54,s[c]=r[c]^92;const i=ve(ot(o,t)),a=ve(ot(s,i));return r.fill(0),o.fill(0),s.fill(0),i.fill(0),a}function gd(){const e=new Uint8Array(32);return crypto.getRandomValues(e),Ve(e)}function F(e){if(e.length%2!==0)throw new Error(`hexToBytes: odd-length hex string (${e.length} chars)`);const t=new Uint8Array(e.length/2);for(let n=0;n<t.length;n++){const r=e.slice(n*2,n*2+2);if(!/^[0-9a-fA-F]{2}$/.test(r))throw new TypeError(`Invalid hex character at position ${n*2}`);t[n]=parseInt(r,16)}return t}function Ve(e){let t="";for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,"0");return t}function Ug(e,t){if(t<0||t+1>=e.length)throw new RangeError(`readUint16BE: offset ${t} out of bounds for length ${e.length}`);return(e[t]<<8|e[t+1])>>>0}function ot(...e){const t=e.reduce((o,s)=>o+s.length,0),n=new Uint8Array(t);let r=0;for(const o of e)n.set(o,r),r+=o.length;return n}function bd(e){let t="";for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return btoa(t)}function Dg(e){const t=atob(e),n=new Uint8Array(t.length);for(let r=0;r<t.length;r++)n[r]=t.charCodeAt(r);return n}function jg(e,t){const n=Math.max(e.length,t.length),r=new Uint8Array(n),o=new Uint8Array(n);r.set(e),o.set(t);let s=e.length^t.length;for(let i=0;i<n;i++)s|=r[i]^o[i];return s===0}const Sa=new TextEncoder;function dr(e,t){return jg(Sa.encode(e),Sa.encode(t))}function yo(e){return new TextEncoder().encode(e)}const qg=/^[0-9a-f]{64}$/;function vd(e){if(!qg.test(e))throw new Error("seedHex must be a 64-character lowercase hex string (32 bytes)")}function wd(e){if(e.length!==32)throw new Error("AES-256-GCM requires a 32-byte key")}function Ed(e){return vd(e),rt(F(e),yo("canary:sync:key"))}async function kd(e,t){wd(e);const n=crypto.getRandomValues(new Uint8Array(12)),r=await crypto.subtle.importKey("raw",e,{name:"AES-GCM"},!1,["encrypt"]),o=await crypto.subtle.encrypt({name:"AES-GCM",iv:n},r,yo(t)),s=ot(n,new Uint8Array(o));return bd(s)}async function _d(e,t){wd(e);const n=Dg(t);if(n.length<28)throw new Error("decryptEnvelope: encoded data too short (minimum 28 bytes: 12-byte IV + 16-byte GCM tag)");const r=n.slice(0,12),o=n.slice(12),s=await crypto.subtle.importKey("raw",e,{name:"AES-GCM"},!1,["decrypt"]);let i;try{i=await crypto.subtle.decrypt({name:"AES-GCM",iv:r},s,o)}catch{throw new Error("decryptEnvelope: decryption failed — wrong key or tampered data")}return new TextDecoder().decode(i)}function xd(e,t){if(vd(e),!/^[0-9a-f]{64}$/.test(t))throw new Error("personalPrivkeyHex must be a 64-character lowercase hex string (32 bytes)");const n=ot(yo("canary:sync:sign:"),F(t));return rt(F(e),n)}function Sd(e){return Ve(ve(yo(e)))}const Si=604800,Ia=100;function bt(e,t=Si){if(!Number.isFinite(e)||e<0)throw new RangeError(`timestampSec must be a non-negative finite number, got ${e}`);if(!Number.isFinite(t)||t<=0)throw new RangeError(`rotationIntervalSec must be a positive finite number, got ${t}`);const n=Math.floor(e/t);if(n>4294967295)throw new RangeError(`Counter exceeds uint32 range (${n}). Use a larger rotation interval.`);return n}const Fr=["ability","able","about","above","absent","absorb","abstract","absurd","access","accident","account","accuse","achieve","acid","acorn","acoustic","acquire","across","act","action","actor","actress","actual","adapt","add","addict","address","adjust","admiral","admit","adult","advance","advice","aerobic","affair","afford","afraid","again","age","agent","agree","ahead","aim","air","airport","aisle","alarm","album","alcohol","alert","alien","all","alley","allow","almost","alone","alpha","alpine","already","also","always","amateur","amazing","amber","among","amount","amused","analyst","anchor","ancient","anger","angle","animal","ankle","announce","annual","another","answer","antenna","antique","anvil","anxiety","any","apart","apology","appear","apple","approve","april","apron","arch","arctic","area","arena","argue","arm","armed","armor","army","around","arrange","arrive","arrow","art","artefact","artist","artwork","ask","aspect","asset","assist","assume","asthma","athlete","atom","attack","attend","attitude","attract","auction","audit","august","aunt","author","auto","autumn","average","avocado","avoid","awake","aware","away","awesome","awful","awkward","axis","baby","bachelor","bacon","badge","badger","bag","bakery","balance","balcony","ball","balm","bamboo","banana","banjo","banner","bar","barely","bargain","barrel","base","basic","basil","basket","battle","beach","beacon","bean","beauty","because","become","beef","beetle","before","begin","behave","behind","belfry","believe","below","belt","bench","benefit","berry","best","better","between","beyond","bicycle","bid","bike","bind","biology","birch","bird","birth","bishop","bitter","black","blame","blanket","bleak","bless","bloom","blossom","blouse","blue","blur","blush","board","boat","bobcat","body","boil","bone","bonfire","bonus","book","boost","border","boring","borrow","boss","bottom","bounce","bouquet","box","boy","bracket","brain","branch","brand","brass","brave","bread","breaker","breeze","brick","bridge","brief","bright","bring","brisk","broccoli","bronze","brook","broom","brother","brown","brush","bubble","buckle","buddy","budget","buffalo","bugle","build","bulb","bulk","bumble","bundle","bunker","burger","burrow","burst","bus","bushel","business","busy","butter","buyer","buzz","cabbage","cabin","cable","cactus","cage","cairn","cake","call","calm","camel","camera","camp","can","canal","cancel","candy","canoe","canopy","canvas","canyon","capable","cape","capital","captain","car","caravan","carbon","card","cargo","carpet","carry","cart","case","cash","casino","castle","casual","cat","catalog","catch","category","cattle","caught","cause","caution","cave","cedar","ceiling","celery","cellar","cement","census","century","cereal","certain","chair","chalk","champion","change","chapter","charge","charter","chase","chat","cheap","check","cheese","chef","cherry","chest","chestnut","chicken","chief","child","chimney","choice","choose","chuckle","chunk","churn","cider","cigar","cinnamon","circle","citizen","city","civil","claim","clam","clap","clarify","claw","clay","clean","clerk","clever","click","client","cliff","climb","clinic","clip","cloak","clock","clog","close","cloth","cloud","clown","club","clump","cluster","clutch","coach","coast","cobalt","cocoa","coconut","code","codex","coffee","coil","coin","collect","color","column","combine","come","comet","comfort","comic","common","company","concert","condor","conduct","confirm","congress","connect","consider","consul","control","convince","cook","cool","copper","copy","coral","core","cork","corn","cornet","correct","cosmos","cost","cotton","couch","cougar","country","couple","course","cousin","cover","coyote","crack","cradle","craft","cram","crane","crater","crawl","cream","credit","creek","crew","cricket","crisp","critic","croft","crop","cross","crouch","crowd","crown","crucial","cruise","crumble","crunch","cry","crystal","cube","culture","cup","cupboard","curious","current","curtain","curve","cushion","custom","cute","cycle","cypress","dad","dagger","dahlia","damp","damsel","dance","danger","dapple","daring","dash","daughter","dawn","day","deal","debate","decade","december","decide","decline","decorate","decrease","defense","define","defy","degree","delay","deliver","delta","demand","demise","denial","denim","dentist","depart","depend","deposit","depot","depth","deputy","derive","describe","desert","design","desk","detail","detect","develop","device","devote","diagram","dial","diamond","diary","dice","diesel","diet","differ","digital","dignity","dilemma","dinner","dinosaur","direct","dirt","disagree","discover","dish","display","distance","divert","divide","divorce","dizzy","doctor","document","dog","doll","dolphin","domain","donate","donkey","donor","door","dorsal","double","dove","draft","drafter","dragon","drake","drama","drastic","draw","dream","dress","drift","drifter","drill","drink","drive","drop","droplet","drum","drummer","dry","duck","dulcet","dune","dungeon","during","dusk","dust","dutch","duty","dwarf","dynamic","eager","eagle","early","earn","earth","easily","east","easy","echo","ecology","economy","edge","edgeway","edit","educate","effort","egg","eight","either","elbow","elder","electric","elegant","element","elephant","elevator","elite","elm","else","embark","ember","embody","embrace","emerald","emerge","emotion","employ","empower","empty","enable","enact","end","endless","endorse","enemy","energy","enforce","engage","engine","enhance","enjoy","enlist","enough","enrich","enroll","ensign","ensure","enter","entire","entry","envelope","episode","epoch","equal","equip","era","erase","erode","erosion","error","escape","essay","essence","estate","estuary","eternal","ether","ethics","everest","evidence","evil","evolve","exact","example","exchange","excite","exclude","excuse","execute","exercise","exhaust","exhibit","exist","exit","exotic","expand","expect","explain","express","extend","extra","eye","eyebrow","fabric","face","faculty","fade","faint","faith","falcon","fall","fallow","false","fame","family","famous","fancy","fantasy","farm","fashion","fat","father","fathom","fatigue","favorite","feature","february","federal","fee","feed","feel","female","fence","fennel","fern","festival","fetch","fever","fiber","fiction","fiddle","field","figure","file","film","filter","final","finch","find","finger","finish","fire","firm","first","fiscal","fish","fit","fitness","fix","fjord","flag","flagon","flame","flannel","flash","flat","flavor","flicker","flight","flint","flip","float","flock","floor","floret","fluid","flush","flutter","fly","foal","foam","focus","fog","foil","fold","follow","food","foot","force","forest","forge","forget","fork","fortune","forum","forward","fossil","foster","found","foundry","fox","foxglove","fragile","frame","frequent","fresco","fresh","friend","fringe","frog","front","frost","frown","frozen","fruit","fuel","fun","funny","furnace","furrow","future","gadget","gain","galaxy","gallery","galley","game","gap","garage","garbage","garden","garland","garlic","garment","garnet","gas","gasp","gate","gather","gauge","gaze","gazelle","general","genius","genre","gentle","genuine","gesture","geyser","giant","gibbon","gift","giggle","ginger","giraffe","girl","give","glacier","glad","glance","glare","glass","glen","glide","glimpse","globe","gloom","glory","glove","glow","glue","goat","goblet","goddess","gold","golden","good","goose","gopher","gorge","gorilla","gospel","gossip","govern","gown","grab","grace","grain","granite","grant","grape","grass","gravity","great","green","grid","grocery","group","grow","grunt","guard","guess","guide","guilt","guitar","guppy","gust","gym","habit","half","hamlet","hammer","hammock","hamster","hand","happy","harbor","hard","harness","harvest","hat","have","hawk","hawthorn","head","health","heart","hearth","heavy","hedgehog","height","hello","helmet","help","hen","herald","hermit","hero","heron","hickory","hidden","high","hill","hint","hip","hire","history","hobby","hockey","hold","hole","holiday","hollow","home","homeward","honey","hood","hope","horizon","horn","hornet","horse","hospital","host","hotel","hour","hover","howler","hub","huge","human","humble","humor","hundred","hungry","hunt","hunter","hurdle","hurry","husband","hybrid","ice","icon","idea","identify","idle","igloo","ignore","ill","image","imitate","immune","impact","improve","inch","include","income","increase","index","indicate","indigo","indoor","industry","infant","inflict","inform","inhale","inherit","initial","inject","inkwell","inlet","inmate","inner","innocent","input","inquiry","insect","inside","inspire","install","intact","interest","into","invest","invite","involve","inward","iris","iron","island","issue","item","ivory","jacket","jade","jaguar","jar","jasmine","javelin","jazz","jeans","jelly","jersey","jewel","job","join","joke","jostle","journal","journey","joy","jubilee","judge","juice","jumble","jump","junco","jungle","junior","juniper","just","kangaroo","kayak","keen","keep","keeper","kelp","kennel","kernel","kestrel","ketchup","kettle","key","kick","kid","kidney","kind","kindle","kingdom","kinglet","kipper","kiss","kit","kitchen","kite","kitten","kiwi","knapsack","knee","knife","knock","lab","label","labor","ladder","lady","lake","lamp","language","lantern","lapis","laptop","larch","large","later","latin","laugh","laundry","laurel","lava","lavender","law","lawn","layer","lazy","leader","leaf","learn","leave","lecture","left","leg","legal","legend","leisure","lemon","lend","length","lens","leopard","lesson","letter","level","liar","liberty","library","license","lichen","life","lift","light","like","limit","linden","link","linnet","lion","liquid","list","little","live","lizard","llama","load","loan","lobster","local","lock","locust","lodge","logic","long","loom","loop","lottery","lotus","loud","lounge","love","loyal","lucky","luggage","lumber","lumen","lunar","lunch","luxury","machine","mackerel","magic","magnet","main","major","make","mammal","man","manage","mandate","mango","mansion","mantis","manual","maple","marble","march","margin","marine","market","marriage","marsh","marten","mask","masonry","mass","master","match","material","math","matrix","matter","maximum","maze","meadow","mean","measure","mechanic","medal","media","melody","melt","member","memory","mention","menu","mercy","merge","merit","merlin","merry","mesa","mesh","message","metal","method","micron","middle","midnight","milk","millet","million","mimic","mind","minimum","minnow","minor","minute","miracle","mirage","mirror","miss","mistake","mix","mixed","mixture","moat","mobile","model","modify","mohawk","mom","moment","monarch","mongrel","monitor","monkey","month","moon","moose","moral","more","morning","mortar","mosaic","mosquito","mother","motion","motor","mountain","mouse","move","movie","much","muffin","mullet","multiply","muscle","museum","mushroom","music","muslin","mussel","must","mustang","mutual","myrtle","myself","mystery","myth","naive","name","napkin","narrow","narwhal","nation","nature","near","neck","nectar","need","negative","neither","nephew","nest","nester","net","nettle","network","neutral","never","news","newt","next","nice","nimble","noble","noggin","noise","nomad","nominee","noodle","normal","north","nose","notable","note","nothing","notice","novel","now","nuclear","number","nurse","nut","nutmeg","oak","oakmoss","oasis","obey","object","oblige","observe","obsidian","obtain","ocean","octave","october","odor","off","offer","office","often","oil","okay","old","olive","olympic","omit","once","onion","online","only","onyx","opal","open","opera","opinion","oppose","option","orange","orbit","orchard","orchid","order","ordinary","organ","orient","original","oriole","orphan","osprey","ostrich","other","otter","outdoor","outer","outpost","output","outside","oval","oven","over","own","owner","oxygen","oyster","ozone","pact","paddle","page","pagoda","palace","palm","panda","panel","panther","paper","parade","parent","park","parrot","party","pass","patch","path","patient","patrol","pattern","pause","pave","payment","peanut","peasant","pelican","pen","pencil","people","pepper","perfect","permit","person","phone","photo","phrase","physical","piano","picnic","picture","pigeon","pill","pilot","pink","pioneer","pipe","pitch","pizza","place","planet","plastic","plate","play","please","pledge","pluck","plug","poem","poet","point","polar","pole","police","pond","pony","pool","popular","portion","position","possible","post","potato","pottery","powder","power","practice","praise","predict","prefer","prepare","present","pretty","prevent","price","pride","primary","print","priority","private","prize","process","produce","profit","program","project","promote","proof","property","prosper","protect","proud","provide","public","pudding","pull","pulp","pulse","pumpkin","puppy","purchase","purity","purpose","purse","push","put","puzzle","pyramid","quality","quantum","quarter","question","quick","quiz","quote","rabbit","race","rack","radar","radio","rail","rain","raise","rally","ramp","ranch","random","range","rapid","rare","rate","rather","raven","raw","razor","ready","real","reason","rebuild","recall","receive","recipe","record","recycle","reduce","reflect","reform","refuse","region","regular","relax","release","relief","rely","remain","remember","remove","render","renew","rent","reopen","repair","repeat","replace","report","require","rescue","resource","response","result","retire","retreat","return","reunion","reveal","review","reward","rhythm","rib","ribbon","rice","rich","ride","ridge","rifle","ring","ripple","risk","ritual","rival","river","road","roast","robot","robust","rocket","romance","roof","rookie","room","rose","rotate","round","route","royal","rubber","rug","rule","run","runway","rural","saddle","sadness","safe","salad","salmon","salon","salt","salute","same","sample","sand","satisfy","satoshi","sauce","sausage","save","say","scale","scan","school","science","scorpion","scout","screen","script","scrub","search","season","seat","second","secret","section","security","seed","seek","segment","select","sell","seminar","senior","sense","sentence","service","session","settle","setup","seven","shadow","shallow","share","shed","shell","sheriff","shield","shift","shine","shoe","shoot","shop","short","shoulder","shove","shrimp","shuffle","shy","sibling","sick","side","sight","sign","silent","silk","silly","silver","similar","simple","since","sister","situate","six","size","skate","sketch","ski","skill","skin","skirt","slab","slam","sleep","slice","slide","slight","slim","small","smart","smile","smooth","snack","snake","snow","soap","soccer","social","sock","soda","soft","solar","soldier","solid","solution","solve","someone","song","soon","sort","soul","sound","soup","source","south","space","spare","spatial","speak","special","speed","spell","spend","sphere","spice","spider","spike","spin","spirit","spoil","sponsor","spoon","sport","spot","spray","spread","spring","spy","square","squirrel","stable","stadium","staff","stage","stairs","stamp","stand","start","state","stay","steak","stem","step","stereo","stick","still","stock","stomach","stone","stool","story","stove","strategy","street","strong","student","style","subject","submit","subway","success","such","sudden","sugar","suggest","suit","summer","sunny","sunset","super","supply","supreme","sure","surface","surge","surprise","surround","survey","sustain","swap","swarm","sweet","swift","swim","swing","switch","sword","symbol","syrup","system","table","tackle","tag","talent","talk","tape","task","taste","taxi","teach","team","tell","tennis","term","test","text","thank","theme","then","theory","they","this","thought","thrive","throw","thumb","thunder","ticket","tide","tiger","tilt","timber","time","tiny","tip","tired","tissue","title","toast","today","toddler","together","toilet","token","tomato","tomorrow","tone","tonight","tool","tooth","top","topic","topple","torch","tortoise","toss","total","tourist","tower","town","toy","track","trade","traffic","train","transfer","trap","travel","tray","treat","trend","tribe","trick","trigger","trim","trip","trophy","truck","true","trumpet","truth","try","tuition","tunnel","turkey","turn","turtle","twelve","twenty","twice","twin","twist","two","type","typical","umbrella","unable","unaware","uncle","uncover","under","undo","unfair","unfold","uniform","unique","unit","universe","unknown","unlock","until","unusual","update","upgrade","uphold","upon","upper","upset","urban","urge","usage","use","used","useful","useless","usual","utility","vague","valid","valley","valve","vapor","various","vast","vehicle","velvet","vendor","venue","verb","verify","version","very","vessel","veteran","viable","vibrant","vicious","victory","video","village","vintage","violin","virtual","visa","visit","visual","vital","vivid","vocal","voice","volcano","vote","voyage","wagon","walk","wall","walnut","want","warm","warrior","wash","wasp","water","wave","way","wealth","weasel","web","wedding","weekend","welcome","west","wet","whale","what","wheat","wheel","when","whip","whisper","wide","width","wife","wild","will","win","window","wine","wing","wink","winner","winter","wire","wisdom","wise","wish","witness","wolf","woman","wonder","wool","word","work","world","worry","worth","wreck","wrestle","yard","year","yellow","you","young","youth","zebra","zero","zone","zoo"],vs=2048,Hg=new Map;for(let e=0;e<Fr.length;e++)Hg.set(Fr[e],e);function _r(e){if(e<0||e>=vs)throw new RangeError(`Wordlist index out of range: ${e} (must be 0-${vs-1})`);return Fr[e]}const Vn={format:"words",count:1};function Fg(e,t=1,n=Fr){if(n.length!==2048)throw new RangeError("Wordlist must contain exactly 2048 entries");if(t<1||t>16)throw new RangeError("Word count must be 1–16");if(e.length<t*2)throw new RangeError("Not enough bytes for requested word count");const r=[];for(let o=0;o<t;o++){const s=Ug(e,o*2)%n.length;r.push(n[s])}return r}function Gg(e,t=4){if(t<1||t>10)throw new RangeError("PIN digits must be 1–10");const n=Math.min(Math.ceil(t*.415),e.length),r=Math.pow(10,t);if(t>=9){let s=0n;for(let i=0;i<n;i++)s=s*256n+BigInt(e[i]);return Number(s%BigInt(r)).toString().padStart(t,"0")}let o=0;for(let s=0;s<n;s++)o=o*256+e[s]>>>0;return(o%r).toString().padStart(t,"0")}function Kg(e,t=8){if(t<1||t>64)throw new RangeError("Hex length must be 1–64");const n=Math.ceil(t/2);let r="";for(let o=0;o<n&&o<e.length;o++)r+=e[o].toString(16).padStart(2,"0");return r.slice(0,t)}function ws(e,t=Vn){switch(t.format){case"words":return Fg(e,t.count??1,t.wordlist).join(" ");case"pin":return Gg(e,t.digits??4);case"hex":return Kg(e,t.length??8)}}const vt=10,Vg=new TextEncoder;function Mt(e){return Vg.encode(e)}function Gr(e){if(!Number.isInteger(e)||e<0||e>4294967295)throw new RangeError(`Counter must be an integer 0–${4294967295}, got ${e}`);const t=new Uint8Array(4);return new DataView(t.buffer).setUint32(0,e,!1),t}const Ra=16;function Ii(e){const t=typeof e=="string"?F(e):e;if(t.length<Ra)throw new RangeError(`Secret must be at least ${Ra} bytes, got ${t.length}`);return t}function Wg(e,t,n,r){if(r!==void 0&&r==="")throw new Error("identity must be non-empty when provided");const o=Ii(e),s=r?ot(Mt(t),new Uint8Array([0]),Mt(r),Gr(n)):ot(Mt(t),Gr(n));return rt(o,s)}function Ee(e,t,n,r=Vn,o){const s=Wg(e,t,n,o);return ws(s,r)}function go(e,t,n,r,o=Vn,s,i){if(!Number.isInteger(s)||s<0)throw new RangeError("maxTolerance must be a non-negative integer");if(s>vt)throw new RangeError(`maxTolerance must be <= ${vt}, got ${s}`);const a=new Set,c=2*s,l=Math.max(0,r-c),d=Math.min(4294967295,r+c);for(let y=l;y<=d;y++)if(a.add(Ee(e,t,y,o)),i)for(const b of i)a.add(Ee(e,t,y,o,b));const u=Ii(e),f=ot(Mt(t+":duress"),new Uint8Array([0]),Mt(n),Gr(r));let h=rt(u,f),p=ws(h,o),m=1;for(;a.has(p)&&m<=255;)h=rt(u,ot(f,new Uint8Array([m]))),p=ws(h,o),m++;if(a.has(p))throw new Error("Duress token collision unresolvable after 255 retries");return p}function Es(e,t,n,r,o,s){const i=s?.encoding??Vn,a=s?.tolerance??0;if(!Number.isInteger(a)||a<0)throw new RangeError("Tolerance must be a non-negative integer");if(a>vt)throw new RangeError(`Tolerance must be <= ${vt}, got ${a}`);const c=r.toLowerCase().trim().replace(/\s+/g," "),l=Math.max(0,n-a),d=Math.min(4294967295,n+a);let u=null;for(const m of o)dr(c,Ee(e,t,n,i,m))&&(u=m);const f=[];for(const m of o){let y=!1;for(let b=l;b<=d;b++)dr(c,go(e,t,m,b,i,a,o))&&(y=!0);y&&f.push(m)}let h=null;for(const m of o)for(let y=l;y<=d;y++)y!==n&&dr(c,Ee(e,t,y,i,m))&&(h=m);let p=!1;for(let m=l;m<=d;m++)dr(c,Ee(e,t,m,i))&&(p=!0);return f.length>0?{status:"duress",identities:f}:u?{status:"valid",identities:[u]}:h?{status:"valid",identities:[h]}:p?{status:"valid"}:{status:"invalid"}}function zg(e,t,n,r){const o=Ii(e),s=ot(Mt(t+":alive"),new Uint8Array([0]),Mt(n),Gr(r));return rt(o,s)}function Jg(e,t,n,r,o=Vn){if(!t)throw new Error("namespace must be a non-empty string");if(t.includes("\0"))throw new Error("namespace must not contain null bytes");if(!n[0]||!n[1])throw new Error("Both roles must be non-empty strings");if(n[0].includes("\0")||n[1].includes("\0"))throw new Error("Roles must not contain null bytes");if(n[0]===n[1])throw new Error(`Roles must be distinct, got ["${n[0]}", "${n[1]}"]`);return{[n[0]]:Ee(e,`${t}\0${n[0]}`,r,o),[n[1]]:Ee(e,`${t}\0${n[1]}`,r,o)}}const Fo=Object.freeze({family:Object.freeze({wordCount:1,rotationInterval:Si,description:"Casual verification for family and friends. Single word, weekly rotation. Adequate for live voice/video calls where the attacker gets one attempt. NOT suitable for text-based verification — 11 bits of entropy is trivially brute-forceable without rate limiting."}),"field-ops":Object.freeze({wordCount:2,rotationInterval:86400,description:"High-security preset for journalism, activism, and field operations. Two-word phrases (~22 bits) with daily rotation. Use burn-after-use for maximum protection."}),enterprise:Object.freeze({wordCount:2,rotationInterval:172800,description:"Enterprise incident response. Two-word phrases with 48-hour rotation. Balances security with operational convenience for larger teams."}),event:Object.freeze({wordCount:1,rotationInterval:14400,description:"Temporary groups for conferences, festivals, and meetups. Single word with 4-hour rotation. Fast setup, easy to share at the door."})}),Yg=/^[0-9a-f]{64}$/,Aa=100;function Kr(e){if(!Yg.test(e))throw new Error(`Invalid member pubkey: expected 64 hex characters, got ${e.length} chars`)}function Zg(e){if(e.preset!==void 0&&(typeof e.preset!="string"||!Object.hasOwn(Fo,e.preset)))throw new Error(`Unknown preset: "${e.preset}". Valid presets: ${Object.keys(Fo).join(", ")}`);const t=Math.floor(Date.now()/1e3),n=e.preset!==void 0?Fo[e.preset]:void 0,r=e.rotationInterval??n?.rotationInterval??Si,o=e.wordCount??n?.wordCount??1,s=e.tolerance??1;if(!Number.isInteger(r)||r<=0)throw new Error(`rotationInterval must be a positive integer, got ${r}`);if(o!==1&&o!==2&&o!==3)throw new Error(`wordCount must be 1, 2, or 3, got ${o}`);if(!Number.isInteger(s)||s<0||s>vt)throw new RangeError(`tolerance must be an integer 0–${vt}, got ${s}`);if(e.beaconInterval!==void 0&&(!Number.isInteger(e.beaconInterval)||e.beaconInterval<=0))throw new Error(`beaconInterval must be a positive integer, got ${e.beaconInterval}`);if(e.beaconPrecision!==void 0&&(!Number.isInteger(e.beaconPrecision)||e.beaconPrecision<1||e.beaconPrecision>11))throw new Error(`beaconPrecision must be an integer between 1 and 11, got ${e.beaconPrecision}`);for(const a of e.members)Kr(a);if(new Set(e.members).size!==e.members.length)throw new Error("Duplicate pubkeys in members array");if(e.creator!==void 0&&(Kr(e.creator),!e.members.includes(e.creator)))throw new Error("creator must be in members");return o===1&&e.members.length>=10&&console.warn(`[canary-kit] Group "${e.name}" has ${e.members.length} members with 1-word encoding. CANARY spec recommends 2+ words for groups of 10+ members to avoid duress collision (~2.2% at 10 members).`),{name:e.name,seed:gd(),members:[...e.members],rotationInterval:r,wordCount:o,tolerance:s,wordlist:e.wordlist??"en-v1",counter:bt(t,r),usageOffset:0,createdAt:t,beaconInterval:e.beaconInterval??300,beaconPrecision:e.beaconPrecision??6,admins:e.creator?[e.creator]:[],epoch:0,consumedOps:[]}}function Xg(e){const t=bt(Math.floor(Date.now()/1e3),e.rotationInterval),n=e.counter+e.usageOffset+1;if(n>t+Ia)throw new RangeError(`Cannot advance counter: effective counter ${n} would exceed time-based counter ${t} + MAX_COUNTER_OFFSET (${Ia})`);return{...e,usageOffset:e.usageOffset+1}}function Ri(e){return{...e,seed:gd(),usageOffset:0}}function Id(e,t){if(Kr(t),e.members.includes(t))return e;if(e.members.length>=Aa)throw new Error(`Cannot add member: group has reached the maximum of ${Aa} members`);return{...e,members:[...e.members,t]}}function Rd(e,t){return Kr(t),{...e,members:e.members.filter(n=>n!==t)}}function Qg(e,t=Math.floor(Date.now()/1e3)){const n=bt(t,e.rotationInterval);return n<=e.counter?e:{...e,counter:n,usageOffset:0}}const eb=new Set(["member-join","member-leave","counter-advance","reseed","beacon","duress-alert","duress-clear","liveness-checkin","state-snapshot"]),tb=new Set(["member-join","member-leave","counter-advance","reseed","state-snapshot","duress-alert","duress-clear"]),Pe=/^[0-9a-f]{64}$/,Ca=100,nb=2e7,ur=256,Bn=300,Ai=60,Ta=1e3;function Go(e,t,n,r){const o=[...e,t];return o.length>Ta?{consumedOps:o.slice(-Ta),consumedOpsFloor:Math.max(r??0,n)}:{consumedOps:o,consumedOpsFloor:r}}const Re=2;function zt(e){return typeof e=="number"&&Number.isFinite(e)}function Ue(e){return zt(e)&&Number.isInteger(e)&&e>=0}function ks(e){const t={...e,protocolVersion:Re};if(e.type==="reseed"){const{seed:n,...r}=t;return JSON.stringify({...r,seed:Ve(e.seed)})}return JSON.stringify(t)}function Pn(e){if(e==null)return"null";if(typeof e=="boolean"||typeof e=="number"||typeof e=="string")return JSON.stringify(e);if(Array.isArray(e))return"["+e.map(Pn).join(",")+"]";if(e instanceof Uint8Array)throw new Error("stableStringify: Uint8Array must be hex-encoded before serialisation");if(typeof e=="object"){const t=e;return"{"+Object.keys(t).sort().filter(o=>t[o]!==void 0).map(o=>JSON.stringify(o)+":"+Pn(t[o])).join(",")+"}"}throw new Error(`stableStringify: unsupported type ${typeof e}`)}function xn(e){if(e.type==="reseed"){const{seed:t,...n}=e;return Pn({...n,seed:Ve(t)})}return Pn(e)}function _s(e){let t;try{t=JSON.parse(e)}catch{throw new Error("Invalid sync message: not valid JSON")}const n=t.type;if(typeof n!="string"||!eb.has(n))throw new Error(`Invalid sync message type: ${String(n)}`);const r=t.timestamp;if(!Ue(r))throw new Error("Invalid sync message: missing or invalid timestamp");const o=t.protocolVersion;if(o==null)throw new Error("Invalid sync message: protocolVersion is required");if(o!==Re)throw new Error(`Unsupported protocol version: ${o} (expected: ${Re})`);switch(n){case"member-join":if(typeof t.pubkey!="string"||!Pe.test(t.pubkey))throw new Error("Invalid sync message: member-join requires a 64-char hex pubkey");if(!Ue(t.epoch))throw new Error("Invalid sync message: member-join requires a non-negative epoch");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: member-join requires a non-empty opId (max 128 chars)");break;case"member-leave":if(typeof t.pubkey!="string"||!Pe.test(t.pubkey))throw new Error("Invalid sync message: member-leave requires a 64-char hex pubkey");if(!Ue(t.epoch))throw new Error("Invalid sync message: member-leave requires a non-negative epoch");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: member-leave requires a non-empty opId (max 128 chars)");break;case"liveness-checkin":if(typeof t.pubkey!="string"||!Pe.test(t.pubkey))throw new Error("Invalid sync message: liveness-checkin requires a 64-char hex pubkey");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: liveness-checkin requires a non-empty opId (max 128 chars)");break;case"counter-advance":if(!Ue(t.counter))throw new Error("Invalid sync message: counter-advance requires a non-negative counter");if(!Ue(t.usageOffset))throw new Error("Invalid sync message: counter-advance requires a non-negative usageOffset");break;case"reseed":if(typeof t.seed!="string"||!Pe.test(t.seed))throw new Error("Invalid sync message: reseed.seed must be a 64-char hex string");if(!Ue(t.counter))throw new Error("Invalid sync message: reseed requires a non-negative counter");if(!Ue(t.epoch))throw new Error("Invalid sync message: reseed requires a non-negative epoch");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: reseed requires a non-empty opId (max 128 chars)");if(!Array.isArray(t.admins)||!t.admins.every(s=>typeof s=="string"&&Pe.test(s)))throw new Error("Invalid sync message: reseed.admins must be 64-char hex pubkeys");if(!Array.isArray(t.members)||!t.members.every(s=>typeof s=="string"&&Pe.test(s)))throw new Error("Invalid sync message: reseed.members must be 64-char hex pubkeys");return{type:n,seed:F(t.seed),counter:t.counter,timestamp:r,epoch:t.epoch,opId:t.opId,admins:[...t.admins],members:[...t.members],protocolVersion:Re};case"beacon":if(!zt(t.lat)||!zt(t.lon))throw new Error("Invalid sync message: beacon requires numeric lat and lon");if(t.lat<-90||t.lat>90||t.lon<-180||t.lon>180)throw new Error("Invalid sync message: beacon lat/lon out of range");if(!zt(t.accuracy)||t.accuracy<0||t.accuracy>nb)throw new Error("Invalid sync message: beacon requires a non-negative accuracy");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: beacon requires a non-empty opId (max 128 chars)");break;case"duress-alert":if(!zt(t.lat)||!zt(t.lon))throw new Error("Invalid sync message: duress-alert requires numeric lat and lon");if(t.lat<-90||t.lat>90||t.lon<-180||t.lon>180)throw new Error("Invalid sync message: duress-alert lat/lon out of range");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: duress-alert requires a non-empty opId (max 128 chars)");if(t.subject!==void 0&&(typeof t.subject!="string"||t.subject.length>ur))throw new Error(`Invalid sync message: duress-alert subject must be a string of at most ${ur} characters`);break;case"duress-clear":if(typeof t.subject!="string"||t.subject.length===0)throw new Error("Invalid sync message: duress-clear requires a non-empty subject");if(t.subject.length>ur)throw new Error(`Invalid sync message: duress-clear subject exceeds maximum length of ${ur} characters`);if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: duress-clear requires a non-empty opId (max 128 chars)");break;case"state-snapshot":if(typeof t.seed!="string"||!Pe.test(t.seed))throw new Error("Invalid sync message: state-snapshot requires a 64-char hex seed");if(!Ue(t.counter))throw new Error("Invalid sync message: state-snapshot requires a non-negative counter");if(!Ue(t.usageOffset))throw new Error("Invalid sync message: state-snapshot requires a non-negative usageOffset");if(!Array.isArray(t.members)||!t.members.every(s=>typeof s=="string"&&Pe.test(s)))throw new Error("Invalid sync message: state-snapshot members must be 64-char hex pubkeys");if(!Array.isArray(t.admins)||!t.admins.every(s=>typeof s=="string"&&Pe.test(s)))throw new Error("Invalid sync message: state-snapshot admins must be 64-char hex pubkeys");if(!Ue(t.epoch))throw new Error("Invalid sync message: state-snapshot requires a non-negative epoch");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: state-snapshot requires a non-empty opId (max 128 chars)");if(t.prevEpochSeed!==void 0&&(typeof t.prevEpochSeed!="string"||!Pe.test(t.prevEpochSeed)))throw new Error("Invalid sync message: state-snapshot.prevEpochSeed must be a 64-char hex string");break}return t}function La(e,t){return e.type==="reseed"||e.type==="state-snapshot"||e.type==="member-join"&&e.pubkey!==t||e.type==="member-leave"&&e.pubkey!==t}function bo(e,t,n=Math.floor(Date.now()/1e3),r){if(La(t,r)){if(!r||!e.admins.includes(r))return e;const o=t.epoch,s=t.opId;if(o===void 0||s===void 0||o<e.epoch)return e;if(t.type==="reseed"){if(o!==e.epoch+1)return e;const i=t;if(!i.admins||!i.members)return e;const a=new Set(i.members);if(!i.admins.every(c=>a.has(c)))return e}else if(t.type==="state-snapshot"){if(o<e.epoch)return e;const i=t;if(!i.admins||!i.members)return e;const a=new Set(i.members);if(!i.admins.every(c=>a.has(c)))return e}else if(o!==e.epoch)return e;if(t.type!=="reseed"&&!(t.type==="state-snapshot"&&o>e.epoch)&&(new Set(e.consumedOps).has(s)||e.consumedOpsFloor!==void 0&&t.timestamp<=e.consumedOpsFloor))return e}if(t.type==="duress-alert"||t.type==="beacon"||t.type==="liveness-checkin"){const o=n-t.timestamp;if(o>Bn||o<-Ai)return e}if(t.type==="liveness-checkin"&&r&&t.pubkey!==r||t.type==="member-leave"&&!La(t,r)&&(new Set(e.consumedOps).has(t.opId)||e.consumedOpsFloor!==void 0&&t.timestamp<=e.consumedOpsFloor))return e;switch(t.type){case"member-join":{let o;try{o=Id(e,t.pubkey)}catch{return e}const s=Go(o.consumedOps,t.opId,t.timestamp,e.consumedOpsFloor),i=t.displayName?{memberNames:{...o.memberNames,[t.pubkey]:t.displayName}}:{};return{...o,...s,...i}}case"member-leave":if(!e.members.includes(t.pubkey))return e;{const o=Rd(e,t.pubkey),s=Go(o.consumedOps,t.opId,t.timestamp,e.consumedOpsFloor);return{...o,...s}}case"counter-advance":{if(!r||!e.members.includes(r)||t.usageOffset>Ca)return e;const o=e.counter+e.usageOffset,s=t.counter+t.usageOffset;if(s<=o)return e;const a=Math.floor(n/e.rotationInterval)+Ca;return s>a?e:{...e,counter:t.counter,usageOffset:t.usageOffset}}case"reseed":return{...e,seed:Ve(t.seed),counter:t.counter,usageOffset:0,members:[...t.members],admins:[...t.admins],epoch:t.epoch,consumedOps:[t.opId]};case"state-snapshot":{if(t.epoch===e.epoch){if(t.seed!==e.seed)return e;const o=e.counter+e.usageOffset;if(t.counter+t.usageOffset<o||!e.members.every(a=>t.members.includes(a))||!e.admins.every(a=>t.admins.includes(a)))return e;const i=Go(e.consumedOps,t.opId,t.timestamp,e.consumedOpsFloor);return{...e,counter:t.counter,usageOffset:t.usageOffset,members:[...t.members],admins:[...t.admins],...i}}return e}case"beacon":case"duress-alert":case"liveness-checkin":return e;default:return e}}function rb(e,t,n=Math.floor(Date.now()/1e3),r){const o=bo(e,t,n,r);if(t.type==="beacon"||t.type==="duress-alert"||t.type==="liveness-checkin"){const s=n-t.timestamp,i=s<=Bn&&s>=-Ai,a=t.type!=="liveness-checkin"||!r||t.pubkey===r;return{state:o,applied:i&&a}}return{state:o,applied:o!==e}}const Ci=Object.freeze(Object.defineProperty({__proto__:null,FIRE_AND_FORGET_FRESHNESS_SEC:Bn,MAX_FUTURE_SKEW_SEC:Ai,PROTOCOL_VERSION:Re,STORED_MESSAGE_TYPES:tb,applySyncMessage:bo,applySyncMessageWithResult:rb,canonicaliseSyncMessage:xn,decodeSyncMessage:_s,decryptEnvelope:_d,deriveGroupKey:Ed,deriveGroupSigningKey:xd,encodeSyncMessage:ks,encryptEnvelope:kd,hashGroupTag:Sd,stableStringify:Pn},Symbol.toStringTag,{value:"Module"}));var Kt=Symbol("verified"),ob=e=>e instanceof Object;function sb(e){if(!ob(e)||typeof e.kind!="number"||typeof e.content!="string"||typeof e.created_at!="number"||typeof e.pubkey!="string"||!e.pubkey.match(/^[a-f0-9]{64}$/)||!Array.isArray(e.tags))return!1;for(let t=0;t<e.tags.length;t++){let n=e.tags[t];if(!Array.isArray(n))return!1;for(let r=0;r<n.length;r++)if(typeof n[r]!="string")return!1}return!0}new TextDecoder("utf-8");var ib=new TextEncoder,ab=class{generateSecretKey(){return ee.utils.randomSecretKey()}getPublicKey(t){return q(ee.getPublicKey(t))}finalizeEvent(t,n){const r=t;return r.pubkey=q(ee.getPublicKey(n)),r.id=Ko(r),r.sig=q(ee.sign(z(Ko(r)),n)),r[Kt]=!0,r}verifyEvent(t){if(typeof t[Kt]=="boolean")return t[Kt];try{const n=Ko(t);if(n!==t.id)return t[Kt]=!1,!1;const r=ee.verify(z(t.sig),z(n),z(t.pubkey));return t[Kt]=r,r}catch{return t[Kt]=!1,!1}}};function cb(e){if(!sb(e))throw new Error("can't serialize event with wrong or missing properties");return JSON.stringify([0,e.pubkey,e.created_at,e.kind,e.tags,e.content])}function Ko(e){let t=se(ib.encode(cb(e)));return q(t)}var vo=new ab,lb=vo.generateSecretKey,wo=vo.getPublicKey,st=vo.finalizeEvent,Na=vo.verifyEvent,db=new TextDecoder("utf-8"),Ad=new TextEncoder,Cd=1,Td=65535;function we(e,t){const n=De.getSharedSecret(e,z("02"+t)).subarray(1,33);return ml(se,n,Ad.encode("nip44-v2"))}function Ld(e,t){const n=yl(se,e,t,76);return{chacha_key:n.subarray(0,32),chacha_nonce:n.subarray(32,44),hmac_key:n.subarray(44,76)}}function Nd(e){if(!Number.isSafeInteger(e)||e<1)throw new Error("expected positive integer");if(e<=32)return 32;const t=1<<Math.floor(Math.log2(e-1))+1,n=t<=256?32:t/8;return n*(Math.floor((e-1)/n)+1)}function ub(e){if(!Number.isSafeInteger(e)||e<Cd||e>Td)throw new Error("invalid plaintext size: must be between 1 and 65535 bytes");const t=new Uint8Array(2);return new DataView(t.buffer).setUint16(0,e,!1),t}function fb(e){const t=Ad.encode(e),n=t.length,r=ub(n),o=new Uint8Array(Nd(n)-n);return oe(r,t,o)}function hb(e){const t=new DataView(e.buffer).getUint16(0),n=e.subarray(2,2+t);if(t<Cd||t>Td||n.length!==t||e.length!==2+Nd(t))throw new Error("invalid padding");return db.decode(n)}function $d(e,t,n){if(n.length!==32)throw new Error("AAD associated data must be 32 bytes");const r=oe(n,t);return nt(se,e,r)}function pb(e){if(typeof e!="string")throw new Error("payload must be a valid string");const t=e.length;if(t<132||t>87472)throw new Error("invalid payload length: "+t);if(e[0]==="#")throw new Error("unknown encryption version");let n;try{n=Ge.decode(e)}catch(s){throw new Error("invalid base64: "+s.message)}const r=n.length;if(r<99||r>65603)throw new Error("invalid data length: "+r);const o=n[0];if(o!==2)throw new Error("unknown encryption version "+o);return{nonce:n.subarray(1,33),ciphertext:n.subarray(33,-32),mac:n.subarray(-32)}}function Pt(e,t,n=wt(32)){const{chacha_key:r,chacha_nonce:o,hmac_key:s}=Ld(t,n),i=fb(e),a=oo(r,o,i),c=$d(s,a,n);return Ge.encode(oe(new Uint8Array([2]),n,a,c))}function Ut(e,t){const{nonce:n,ciphertext:r,mac:o}=pb(e),{chacha_key:s,chacha_nonce:i,hmac_key:a}=Ld(t,n),c=$d(a,r,n);if(!al(c,o))throw new Error("invalid MAC");const l=oo(s,i,r);return hb(l)}function Vo(e){if(!/^[0-9a-f]*$/i.test(e)||e.length%2!==0)throw new Error(`Invalid hex string: "${e.slice(0,20)}${e.length>20?"…":""}"`);const t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function mb(e){return Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}class $a{constructor(t,n){this.pubkey=t,this.privkeyHex=n}async sign(t){const n=Vo(this.privkeyHex);return st(t,n)}async encrypt(t,n){const r=Vo(this.privkeyHex),o=we(r,n);return Pt(t,o)}async decrypt(t,n){const r=Vo(this.privkeyHex),o=we(r,n);return Ut(t,o)}}class Md{pubkey;signingKey;constructor(t,n){this.signingKey=xd(t,n),this.pubkey=wo(this.signingKey)}async sign(t){return st(t,this.signingKey)}}function Od(){return typeof window.nostr?.signEvent=="function"}async function yb(e){if(e.privkey&&e.pubkey)return{signer:new $a(e.pubkey,e.privkey),signerType:"local",pubkey:e.pubkey,privkey:e.privkey};const t=lb(),n=wo(t),r=mb(t);return{signer:new $a(n,r),signerType:"local",pubkey:n,privkey:r}}var xt=Symbol("verified"),gb=e=>e instanceof Object;function bb(e){if(!gb(e)||typeof e.kind!="number"||typeof e.content!="string"||typeof e.created_at!="number"||typeof e.pubkey!="string"||!e.pubkey.match(/^[a-f0-9]{64}$/)||!Array.isArray(e.tags))return!1;for(let t=0;t<e.tags.length;t++){let n=e.tags[t];if(!Array.isArray(n))return!1;for(let r=0;r<n.length;r++)if(typeof n[r]!="string")return!1}return!0}new TextDecoder("utf-8");var vb=new TextEncoder;function Sn(e){try{e.indexOf("://")===-1&&(e="wss://"+e);let t=new URL(e);return t.protocol==="http:"?t.protocol="ws:":t.protocol==="https:"&&(t.protocol="wss:"),t.pathname=t.pathname.replace(/\/+/g,"/"),t.pathname.endsWith("/")&&(t.pathname=t.pathname.slice(0,-1)),(t.port==="80"&&t.protocol==="ws:"||t.port==="443"&&t.protocol==="wss:")&&(t.port=""),t.searchParams.sort(),t.hash="",t.toString()}catch{throw new Error(`Invalid URL: ${e}`)}}var wb=class{generateSecretKey(){return ee.utils.randomSecretKey()}getPublicKey(e){return q(ee.getPublicKey(e))}finalizeEvent(e,t){const n=e;return n.pubkey=q(ee.getPublicKey(t)),n.id=Wo(n),n.sig=q(ee.sign(z(Wo(n)),t)),n[xt]=!0,n}verifyEvent(e){if(typeof e[xt]=="boolean")return e[xt];try{const t=Wo(e);if(t!==e.id)return e[xt]=!1,!1;const n=ee.verify(z(e.sig),z(t),z(e.pubkey));return e[xt]=n,n}catch{return e[xt]=!1,!1}}};function Eb(e){if(!bb(e))throw new Error("can't serialize event with wrong or missing properties");return JSON.stringify([0,e.pubkey,e.created_at,e.kind,e.tags,e.content])}function Wo(e){let t=se(vb.encode(Eb(e)));return q(t)}var Eo=new wb;Eo.generateSecretKey;Eo.getPublicKey;Eo.finalizeEvent;var kb=Eo.verifyEvent,_b=22242;function xb(e,t){if(e.ids&&e.ids.indexOf(t.id)===-1||e.kinds&&e.kinds.indexOf(t.kind)===-1||e.authors&&e.authors.indexOf(t.pubkey)===-1)return!1;for(let n in e)if(n[0]==="#"){let r=n.slice(1),o=e[`#${r}`];if(o&&!t.tags.find(([s,i])=>s===n.slice(1)&&o.indexOf(i)!==-1))return!1}return!(e.since&&t.created_at<e.since||e.until&&t.created_at>e.until)}function Sb(e,t){for(let n=0;n<e.length;n++)if(xb(e[n],t))return!0;return!1}function Ib(e,t){let n=t.length+3,r=e.indexOf(`"${t}":`)+n,o=e.slice(r).indexOf('"')+r+1;return e.slice(o,o+64)}function Rb(e){let t=e.slice(0,22).indexOf('"EVENT"');if(t===-1)return null;let n=e.slice(t+7+1).indexOf('"');if(n===-1)return null;let r=t+7+1+n,o=e.slice(r+1,80).indexOf('"');if(o===-1)return null;let s=r+1+o;return e.slice(r+1,s)}function Ab(e,t){return{kind:_b,created_at:Math.floor(Date.now()/1e3),tags:[["relay",e],["challenge",t]],content:""}}var Bd=class extends Error{constructor(e,t){super(`Tried to send message '${e} on a closed connection to ${t}.`),this.name="SendingOnClosedConnection"}},Pd=class{url;_connected=!1;onclose=null;onnotice=e=>console.debug(`NOTICE from ${this.url}: ${e}`);onauth;baseEoseTimeout=4400;publishTimeout=4400;pingFrequency=29e3;pingTimeout=2e4;resubscribeBackoff=[1e4,1e4,1e4,2e4,2e4,3e4,6e4];openSubs=new Map;enablePing;enableReconnect;idleSince=Date.now();ongoingOperations=0;reconnectTimeoutHandle;pingIntervalHandle;reconnectAttempts=0;skipReconnection=!1;connectionPromise;openCountRequests=new Map;openEventPublishes=new Map;ws;challenge;authPromise;serial=0;verifyEvent;_WebSocket;constructor(e,t){this.url=Sn(e),this.verifyEvent=t.verifyEvent,this._WebSocket=t.websocketImplementation||WebSocket,this.enablePing=t.enablePing,this.enableReconnect=t.enableReconnect||!1}static async connect(e,t){const n=new Pd(e,t);return await n.connect(t),n}closeAllSubscriptions(e){for(let[t,n]of this.openSubs)n.close(e);this.openSubs.clear();for(let[t,n]of this.openEventPublishes)n.reject(new Error(e));this.openEventPublishes.clear();for(let[t,n]of this.openCountRequests)n.reject(new Error(e));this.openCountRequests.clear()}get connected(){return this._connected}async reconnect(){const e=this.resubscribeBackoff[Math.min(this.reconnectAttempts,this.resubscribeBackoff.length-1)];this.reconnectAttempts++,this.reconnectTimeoutHandle=setTimeout(async()=>{try{await this.connect()}catch{}},e)}handleHardClose(e){this.pingIntervalHandle&&(clearInterval(this.pingIntervalHandle),this.pingIntervalHandle=void 0),this._connected=!1,this.connectionPromise=void 0,this.idleSince=void 0,this.enableReconnect&&!this.skipReconnection?this.reconnect():(this.onclose?.(),this.closeAllSubscriptions(e))}async connect(e){let t;return this.connectionPromise?this.connectionPromise:(this.challenge=void 0,this.authPromise=void 0,this.skipReconnection=!1,this.connectionPromise=new Promise((n,r)=>{e?.timeout&&(t=setTimeout(()=>{r("connection timed out"),this.connectionPromise=void 0,this.skipReconnection=!0,this.onclose?.(),this.handleHardClose("relay connection timed out")},e.timeout)),e?.abort&&(e.abort.onabort=r);try{this.ws=new this._WebSocket(this.url)}catch(o){clearTimeout(t),r(o);return}this.ws.onopen=()=>{this.reconnectTimeoutHandle&&(clearTimeout(this.reconnectTimeoutHandle),this.reconnectTimeoutHandle=void 0),clearTimeout(t),this._connected=!0;const o=this.reconnectAttempts>0;this.reconnectAttempts=0;for(const s of this.openSubs.values()){if(s.eosed=!1,o)for(let i=0;i<s.filters.length;i++)s.lastEmitted&&(s.filters[i].since=s.lastEmitted+1);s.fire()}this.enablePing&&(this.pingIntervalHandle=setInterval(()=>this.pingpong(),this.pingFrequency)),n()},this.ws.onerror=()=>{clearTimeout(t),r("connection failed"),this.connectionPromise=void 0,this.skipReconnection=!0,this.onclose?.(),this.handleHardClose("relay connection failed")},this.ws.onclose=o=>{clearTimeout(t),r(o.message||"websocket closed"),this.handleHardClose("relay connection closed")},this.ws.onmessage=this._onmessage.bind(this)}),this.connectionPromise)}waitForPingPong(){return new Promise(e=>{this.ws.once("pong",()=>e(!0)),this.ws.ping()})}waitForDummyReq(){return new Promise((e,t)=>{if(!this.connectionPromise)return t(new Error(`no connection to ${this.url}, can't ping`));try{const n=this.subscribe([{ids:["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"],limit:0}],{label:"<forced-ping>",oneose:()=>{e(!0),n.close()},onclose(){e(!0)},eoseTimeout:this.pingTimeout+1e3})}catch(n){t(n)}})}async pingpong(){this.ws?.readyState===1&&(await Promise.any([this.ws&&this.ws.ping&&this.ws.once?this.waitForPingPong():this.waitForDummyReq(),new Promise(t=>setTimeout(()=>t(!1),this.pingTimeout))])||this.ws?.readyState===this._WebSocket.OPEN&&this.ws?.close())}async send(e){if(!this.connectionPromise)throw new Bd(e,this.url);this.connectionPromise.then(()=>{this.ws?.send(e)})}async auth(e){const t=this.challenge;if(!t)throw new Error("can't perform auth, no challenge was received");return this.authPromise?this.authPromise:(this.authPromise=new Promise(async(n,r)=>{try{let o=await e(Ab(this.url,t)),s=setTimeout(()=>{let i=this.openEventPublishes.get(o.id);i&&(i.reject(new Error("auth timed out")),this.openEventPublishes.delete(o.id))},this.publishTimeout);this.openEventPublishes.set(o.id,{resolve:n,reject:r,timeout:s}),this.send('["AUTH",'+JSON.stringify(o)+"]")}catch(o){console.warn("subscribe auth function failed:",o)}}),this.authPromise)}async publish(e){this.idleSince=void 0,this.ongoingOperations++;const t=new Promise((n,r)=>{const o=setTimeout(()=>{const s=this.openEventPublishes.get(e.id);s&&(s.reject(new Error("publish timed out")),this.openEventPublishes.delete(e.id))},this.publishTimeout);this.openEventPublishes.set(e.id,{resolve:n,reject:r,timeout:o})});return this.send('["EVENT",'+JSON.stringify(e)+"]"),this.ongoingOperations--,this.ongoingOperations===0&&(this.idleSince=Date.now()),t}async count(e,t){this.serial++;const n=t?.id||"count:"+this.serial,r=new Promise((o,s)=>{this.openCountRequests.set(n,{resolve:o,reject:s})});return this.send('["COUNT","'+n+'",'+JSON.stringify(e).substring(1)),r}subscribe(e,t){t.label!=="<forced-ping>"&&(this.idleSince=void 0,this.ongoingOperations++);const n=this.prepareSubscription(e,t);return n.fire(),t.abort&&(t.abort.onabort=()=>n.close(String(t.abort.reason||"<aborted>"))),n}prepareSubscription(e,t){this.serial++;const n=t.id||(t.label?t.label+":":"sub:")+this.serial,r=new Cb(this,n,e,t);return this.openSubs.set(n,r),r}close(){this.skipReconnection=!0,this.reconnectTimeoutHandle&&(clearTimeout(this.reconnectTimeoutHandle),this.reconnectTimeoutHandle=void 0),this.pingIntervalHandle&&(clearInterval(this.pingIntervalHandle),this.pingIntervalHandle=void 0),this.closeAllSubscriptions("relay connection closed by us"),this._connected=!1,this.idleSince=void 0,this.onclose?.(),this.ws?.readyState===this._WebSocket.OPEN&&this.ws?.close()}_onmessage(e){const t=e.data;if(!t)return;const n=Rb(t);if(n){const r=this.openSubs.get(n);if(!r)return;const o=Ib(t,"id"),s=r.alreadyHaveEvent?.(o);if(r.receivedEvent?.(this,o),s)return}try{let r=JSON.parse(t);switch(r[0]){case"EVENT":{const o=this.openSubs.get(r[1]),s=r[2];this.verifyEvent(s)&&Sb(o.filters,s)?o.onevent(s):o.oninvalidevent?.(s),(!o.lastEmitted||o.lastEmitted<s.created_at)&&(o.lastEmitted=s.created_at);return}case"COUNT":{const o=r[1],s=r[2],i=this.openCountRequests.get(o);i&&(i.resolve(s.count),this.openCountRequests.delete(o));return}case"EOSE":{const o=this.openSubs.get(r[1]);if(!o)return;o.receivedEose();return}case"OK":{const o=r[1],s=r[2],i=r[3],a=this.openEventPublishes.get(o);a&&(clearTimeout(a.timeout),s?a.resolve(i):a.reject(new Error(i)),this.openEventPublishes.delete(o));return}case"CLOSED":{const o=r[1],s=this.openSubs.get(o);if(!s)return;s.closed=!0,s.close(r[2]);return}case"NOTICE":{this.onnotice(r[1]);return}case"AUTH":{this.challenge=r[1],this.onauth&&this.auth(this.onauth);return}default:{this.openSubs.get(r[1])?.oncustom?.(r);return}}}catch(r){try{const[o,s,i]=JSON.parse(t);console.warn(`[nostr] relay ${this.url} error processing message:`,r,i)}catch{console.warn(`[nostr] relay ${this.url} error processing message:`,r)}return}}},Cb=class{relay;id;lastEmitted;closed=!1;eosed=!1;filters;alreadyHaveEvent;receivedEvent;onevent;oninvalidevent;oneose;onclose;oncustom;eoseTimeout;eoseTimeoutHandle;constructor(e,t,n,r){if(n.length===0)throw new Error("subscription can't be created with zero filters");this.relay=e,this.filters=n,this.id=t,this.alreadyHaveEvent=r.alreadyHaveEvent,this.receivedEvent=r.receivedEvent,this.eoseTimeout=r.eoseTimeout||e.baseEoseTimeout,this.oneose=r.oneose,this.onclose=r.onclose,this.oninvalidevent=r.oninvalidevent,this.onevent=r.onevent||(o=>{console.warn(`onevent() callback not defined for subscription '${this.id}' in relay ${this.relay.url}. event received:`,o)})}fire(){this.relay.send('["REQ","'+this.id+'",'+JSON.stringify(this.filters).substring(1)),this.eoseTimeoutHandle=setTimeout(this.receivedEose.bind(this),this.eoseTimeout)}receivedEose(){this.eosed||(clearTimeout(this.eoseTimeoutHandle),this.eosed=!0,this.oneose?.())}close(e="closed by caller"){if(!this.closed&&this.relay.connected){try{this.relay.send('["CLOSE",'+JSON.stringify(this.id)+"]")}catch(t){if(!(t instanceof Bd))throw t}this.closed=!0}this.relay.openSubs.delete(this.id),this.relay.ongoingOperations--,this.relay.ongoingOperations===0&&(this.relay.idleSince=Date.now()),this.onclose?.(e)}},Tb=e=>(e[xt]=!0,!0),Lb=class{relays=new Map;seenOn=new Map;trackRelays=!1;verifyEvent;enablePing;enableReconnect;automaticallyAuth;trustedRelayURLs=new Set;onRelayConnectionFailure;onRelayConnectionSuccess;allowConnectingToRelay;maxWaitForConnection;_WebSocket;constructor(e){this.verifyEvent=e.verifyEvent,this._WebSocket=e.websocketImplementation,this.enablePing=e.enablePing,this.enableReconnect=e.enableReconnect||!1,this.automaticallyAuth=e.automaticallyAuth,this.onRelayConnectionFailure=e.onRelayConnectionFailure,this.onRelayConnectionSuccess=e.onRelayConnectionSuccess,this.allowConnectingToRelay=e.allowConnectingToRelay,this.maxWaitForConnection=e.maxWaitForConnection||3e3}async ensureRelay(e,t){e=Sn(e);let n=this.relays.get(e);if(n||(n=new Pd(e,{verifyEvent:this.trustedRelayURLs.has(e)?Tb:this.verifyEvent,websocketImplementation:this._WebSocket,enablePing:this.enablePing,enableReconnect:this.enableReconnect}),n.onclose=()=>{this.relays.delete(e)},this.relays.set(e,n)),this.automaticallyAuth){const r=this.automaticallyAuth(e);r&&(n.onauth=r)}try{await n.connect({timeout:t?.connectionTimeout,abort:t?.abort})}catch(r){throw this.relays.delete(e),r}return n}close(e){e.map(Sn).forEach(t=>{this.relays.get(t)?.close(),this.relays.delete(t)})}subscribe(e,t,n){const r=[],o=[];for(let s=0;s<e.length;s++){const i=Sn(e[s]);r.find(a=>a.url===i)||o.indexOf(i)===-1&&(o.push(i),r.push({url:i,filter:t}))}return this.subscribeMap(r,n)}subscribeMany(e,t,n){return this.subscribe(e,t,n)}subscribeMap(e,t){const n=new Map;for(const f of e){const{url:h,filter:p}=f;n.has(h)||n.set(h,[]),n.get(h).push(p)}const r=Array.from(n.entries()).map(([f,h])=>({url:f,filters:h}));this.trackRelays&&(t.receivedEvent=(f,h)=>{let p=this.seenOn.get(h);p||(p=new Set,this.seenOn.set(h,p)),p.add(f)});const o=new Set,s=[],i=[];let a=f=>{i[f]||(i[f]=!0,i.filter(h=>h).length===r.length&&(t.oneose?.(),a=()=>{}))};const c=[];let l=(f,h)=>{c[f]||(a(f),c[f]=h,c.filter(p=>p).length===r.length&&(t.onclose?.(c),l=()=>{}))};const d=f=>{if(t.alreadyHaveEvent?.(f))return!0;const h=o.has(f);return o.add(f),h},u=Promise.all(r.map(async({url:f,filters:h},p)=>{if(this.allowConnectingToRelay?.(f,["read",h])===!1){l(p,"connection skipped by allowConnectingToRelay");return}let m;try{m=await this.ensureRelay(f,{connectionTimeout:this.maxWaitForConnection<(t.maxWait||0)?Math.max(t.maxWait*.8,t.maxWait-1e3):this.maxWaitForConnection,abort:t.abort})}catch(b){this.onRelayConnectionFailure?.(f),l(p,b?.message||String(b));return}this.onRelayConnectionSuccess?.(f);let y=m.subscribe(h,{...t,oneose:()=>a(p),onclose:b=>{b.startsWith("auth-required: ")&&t.onauth?m.auth(t.onauth).then(()=>{m.subscribe(h,{...t,oneose:()=>a(p),onclose:E=>{l(p,E)},alreadyHaveEvent:d,eoseTimeout:t.maxWait,abort:t.abort})}).catch(E=>{l(p,`auth was required and attempted, but failed with: ${E}`)}):l(p,b)},alreadyHaveEvent:d,eoseTimeout:t.maxWait,abort:t.abort});s.push(y)}));return{async close(f){await u,s.forEach(h=>{h.close(f)})}}}subscribeEose(e,t,n){let r;return r=this.subscribe(e,t,{...n,oneose(){const o="closed automatically on eose";r?r.close(o):n.onclose?.(e.map(s=>o))}}),r}subscribeManyEose(e,t,n){return this.subscribeEose(e,t,n)}async querySync(e,t,n){return new Promise(async r=>{const o=[];this.subscribeEose(e,t,{...n,onevent(s){o.push(s)},onclose(s){r(o)}})})}async get(e,t,n){t.limit=1;const r=await this.querySync(e,t,n);return r.sort((o,s)=>s.created_at-o.created_at),r[0]||null}publish(e,t,n){return e.map(Sn).map(async(r,o,s)=>{if(s.indexOf(r)!==o)return Promise.reject("duplicate url");if(this.allowConnectingToRelay?.(r,["write",t])===!1)return Promise.reject("connection skipped by allowConnectingToRelay");let i;try{i=await this.ensureRelay(r,{connectionTimeout:this.maxWaitForConnection<(n?.maxWait||0)?Math.max(n.maxWait*.8,n.maxWait-1e3):this.maxWaitForConnection,abort:n?.abort})}catch(a){return this.onRelayConnectionFailure?.(r),"connection failure: "+String(a)}return i.publish(t).catch(async a=>{if(a instanceof Error&&a.message.startsWith("auth-required: ")&&n?.onauth)return await i.auth(n.onauth),i.publish(t);throw a}).then(a=>{if(this.trackRelays){let c=this.seenOn.get(t.id);c||(c=new Set,this.seenOn.set(t.id,c)),c.add(i)}return a})})}listConnectionStatus(){const e=new Map;return this.relays.forEach((t,n)=>e.set(n,t.connected)),e}destroy(){this.relays.forEach(e=>e.close()),this.relays=new Map}pruneIdleRelays(e=1e4){const t=[];for(const[n,r]of this.relays)r.idleSince&&Date.now()-r.idleSince>=e&&(this.relays.delete(n),t.push(n),r.close());return t}},Ud;try{Ud=WebSocket}catch{}var Nb=class extends Lb{constructor(e){super({verifyEvent:kb,websocketImplementation:Ud,maxWaitForConnection:3e3,...e})}};let Ie=null,sn=!1,ko=0,At=[],Ct=[];function Vr(){const e=new Set([...At,...Ct]);return Array.from(e)}let Dd=Promise.resolve();function Ti(e,t){const n=Se(e),r=t?Se(t):[...n];Ie&&n.length===At.length&&n.every(s=>At.includes(s))&&r.length===Ct.length&&r.every(s=>Ct.includes(s))||(Ie&&(Ie.close(Vr()),Ie=null,sn=!1,ko=0,At=[],Ct=[]),At=n,Ct=r,Vr().length===0)||(Ie=new Nb,sn=!1,Dd=$b())}function _o(){return Dd}async function $b(){if(!Ie)return;const e=Ie,t=Vr();if(t.length===0)return;let n=0;for(const r of t)try{await e.ensureRelay(r,{connectionTimeout:5e3}),n++}catch(o){console.warn(`[canary:relay] Failed to connect to ${r}:`,o)}Ie===e&&(sn=n>0,ko=n,sn?console.info(`[canary:relay] Connected to ${n}/${t.length} relay(s)`):console.error("[canary:relay] Could not connect to any relay:",t))}function jd(){Ie&&Ie.close(Vr()),Ie=null,sn=!1,ko=0,At=[],Ct=[]}function fe(){return Ie}function qt(){return sn}function Dt(){return ko}function qd(){return[...At]}function Hd(){return[...Ct]}const Fd=Object.freeze(Object.defineProperty({__proto__:null,connectRelays:Ti,disconnectRelays:jd,getPool:fe,getReadRelayUrls:qd,getRelayCount:Dt,getWriteRelayUrls:Hd,isConnected:qt,waitForConnection:_o},Symbol.toStringTag,{value:"Module"})),Ma=new Set(["member-join","member-leave","counter-advance","reseed","state-snapshot","duress-alert","duress-clear"]),Oa=29111,Ba=39111,zo=29112,Jo=29113,fr=/^[0-9a-f]{64}$/,Pa=/^[0-9a-f]{128}$/,hr=new TextEncoder,Mb=3,Ob=6e4;class Bb{constructor(t){this.capacity=t}items=[];has(t){return this.items.includes(t)}add(t){this.has(t)||(this.items.length>=this.capacity&&this.items.shift(),this.items.push(t))}}class Wr{constructor(t,n,r,o){this.personalPubkey=r,this.personalPrivkey=o,this.readRelays=Se(t),this.writeRelays=Se(n)}subs=new Map;groupKeys=new Map;tagHashToGroupId=new Map;seenEventIds=new Bb(1e3);decryptFailures=new Map;recoveryPending=new Map;recoverySub=null;readRelays;writeRelays;updateRelays(t,n){this.readRelays=Se(t),this.writeRelays=n?Se(n):[...this.readRelays]}get allRelays(){return Se([...this.readRelays,...this.writeRelays])}registerGroup(t,n,r,o,s){const i=Sd(t);console.info("[canary:sync] registerGroup",t.slice(0,8),"→ tagHash",i.slice(0,12),"members:",o.length),this.groupKeys.set(t,{key:Ed(n),signer:r,tagHash:i,members:new Set(o),admins:new Set(s?.admins??[]),onRecoveryRequest:s?.onRecoveryRequest,onRecoveryResponse:s?.onRecoveryResponse}),this.tagHashToGroupId.set(i,t)}unregisterGroup(t){const n=this.groupKeys.get(t);n&&this.tagHashToGroupId.delete(n.tagHash),this.groupKeys.delete(t),this.decryptFailures.delete(t),this.recoveryPending.delete(t)}async send(t,n,r){qt()||Ti(this.readRelays,this.writeRelays);const o=fe();if(!o)return;const s=this.groupKeys.get(t);if(!s){console.warn("[canary:sync] No group key registered for",t);return}const i=ks(n),a={...n,protocolVersion:Re},c=xn(a),l=ve(hr.encode(c)),d=Ve(ee.sign(l,F(this.personalPrivkey))),u=JSON.stringify({s:this.personalPubkey,sig:d,p:i}),f=await kd(s.key,u),h=Ma.has(n.type),p=h?Ba:Oa,y=[["d",h?`${s.tagHash}:${n.type}`:s.tagHash]];h&&y.push(["expiration",String(Math.floor(Date.now()/1e3)+10080*60)]);const b={kind:p,content:f,tags:y,created_at:Math.floor(Date.now()/1e3)};try{const E=await s.signer.sign(b);typeof E.id=="string"&&this.seenEventIds.add(E.id),console.info("[canary:sync] Publishing",n.type,"to",t.slice(0,8),"→ d-tag:",s.tagHash.slice(0,12),"(write relays only)"),await o.publish(this.writeRelays,E),console.info("[canary:sync] Published OK")}catch(E){console.error("[canary:sync] Publish failed:",E)}}subscribe(t,n){const r=fe();if(!r)return()=>{};const o=this.groupKeys.get(t);if(!o)return console.warn("[canary:sync] No group key registered for",t),()=>{};this._ensureRecoverySub();const s=Array.from(Ma).map(c=>`${o.tagHash}:${c}`),i={kinds:[Ba,Oa],"#d":[o.tagHash,...s],since:Math.floor(Date.now()/1e3)-10080*60};console.info("[canary:sync] Subscribing to",t.slice(0,8),"→ filter:",JSON.stringify(i));const a=r.subscribeMany(this.allRelays,i,{onevent:async c=>{try{if(!c||typeof c!="object"||typeof c.pubkey!="string"||typeof c.content!="string")return;console.info("[canary:sync] Received event",c.id?.slice(0,12),"kind:",c.kind,"from pubkey:",c.pubkey?.slice(0,12));const l=this.groupKeys.get(t);if(!l)return;if(!Na(c)){console.warn("[canary:sync] Rejected event with invalid signature");return}if(typeof c.id=="string"&&this.seenEventIds.has(c.id))return;let d;try{d=await _d(l.key,c.content)}catch{this._trackDecryptFailure(t);return}this.decryptFailures.delete(t);const u=JSON.parse(d);if(!u||typeof u!="object"){console.warn("[canary:sync] Rejected malformed envelope");return}const f=u.s,h=u.sig,p=u.p;if(typeof f!="string"||typeof h!="string"||typeof p!="string"){console.warn("[canary:sync] Rejected envelope with missing sender proof fields");return}if(!fr.test(f)||!Pa.test(h)){console.warn("[canary:sync] Rejected envelope with invalid sender proof encoding");return}const m=_s(p),y={...m,protocolVersion:Re},b=xn(y),E=ve(hr.encode(b));if(!ee.verify(F(h),E,F(f))){console.warn("[canary:sync] Rejected envelope with invalid sender proof");return}if(m.type!=="member-join"&&!l.members.has(f)){console.warn("[canary:sync] Rejected message from non-member pubkey");return}if(m.type==="liveness-checkin"&&m.pubkey!==f){console.warn("[canary:sync] Rejected liveness-checkin with mismatched sender");return}console.info("[canary:sync] Dispatching",m.type,"from sender",f.slice(0,8)),n(m,f),typeof c.id=="string"&&this.seenEventIds.add(c.id)}catch(l){console.warn("[canary:sync] Failed to process event:",l)}}});return this.subs.set(t,a),()=>{a.close(),this.subs.delete(t)}}async requestRecovery(t,n,r){const o=fe();if(!o)return;const s=this.groupKeys.get(t);if(!s)return;this.recoveryPending.set(t,Date.now());const i=F(this.personalPrivkey);for(const a of s.admins)if(a!==this.personalPubkey)try{const c=JSON.stringify({groupTag:s.tagHash,epoch:n,counter:r}),l=we(i,a),d=Pt(c,l),u={kind:zo,content:d,tags:[["p",a]],created_at:Math.floor(Date.now()/1e3)},f=st(u,i);await o.publish(this.writeRelays,f)}catch(c){console.warn("[canary:sync] Recovery request to",a.slice(0,8),"failed:",c)}}_ensureRecoverySub(){if(this.recoverySub)return;const t=fe();if(!t)return;const n={kinds:[zo,Jo],"#p":[this.personalPubkey],since:Math.floor(Date.now()/1e3)-300};this.recoverySub=t.subscribeMany(this.allRelays,n,{onevent:async r=>{try{if(!r||typeof r!="object"||!Na(r))return;r.kind===zo?await this._handleRecoveryRequest(r):r.kind===Jo&&await this._handleRecoveryResponse(r)}catch(o){console.warn("[canary:sync] Recovery event processing failed:",o)}}})}async _handleRecoveryRequest(t){const n=fe();if(!n)return;const r=t.pubkey;if(!fr.test(r))return;const o=F(this.personalPrivkey),s=we(o,r),i=Ut(t.content,s),a=JSON.parse(i),c=a.groupTag,l=a.epoch,d=a.counter;if(typeof c!="string"||typeof l!="number"||typeof d!="number")return;const u=this.tagHashToGroupId.get(c);if(!u)return;const f=this.groupKeys.get(u);if(!f)return;if(!f.members.has(r)){console.warn("[canary:sync] Recovery request from non-member",r.slice(0,8));return}if(!f.onRecoveryRequest)return;const h=f.onRecoveryRequest(r,l,d);if(!h)return;const p=ks(h),m={...h,protocolVersion:Re},y=xn(m),b=ve(hr.encode(y)),E=Ve(ee.sign(b,o)),L=JSON.stringify({s:this.personalPubkey,sig:E,groupTag:c,p}),O=we(o,r),N=Pt(L,O),$={kind:Jo,content:N,tags:[["p",r]],created_at:Math.floor(Date.now()/1e3)},w=st($,o);await n.publish(this.writeRelays,w),console.info("[canary:sync] Sent recovery response to",r.slice(0,8))}async _handleRecoveryResponse(t){const n=t.pubkey;if(!fr.test(n))return;const r=F(this.personalPrivkey),o=we(r,n),s=Ut(t.content,o),i=JSON.parse(s),a=i.s,c=i.sig,l=i.groupTag,d=i.p;if(typeof a!="string"||typeof c!="string"||typeof l!="string"||typeof d!="string"||!fr.test(a)||!Pa.test(c)||a!==n)return;const u=this.tagHashToGroupId.get(l);if(!u)return;const f=this.groupKeys.get(u);if(!f)return;if(!f.admins.has(n)){console.warn("[canary:sync] Recovery response from non-admin",n.slice(0,8));return}const h=_s(d),p={...h,protocolVersion:Re},m=xn(p),y=ve(hr.encode(m));if(!ee.verify(F(c),y,F(n))){console.warn("[canary:sync] Recovery response with invalid signature");return}if(h.type!=="state-snapshot"){console.warn("[canary:sync] Recovery response contains non-snapshot type:",h.type);return}if(!h.admins.includes(n)){console.warn("[canary:sync] Recovery response sender not in snapshot admins");return}this.decryptFailures.delete(u),this.recoveryPending.delete(u),f.onRecoveryResponse&&f.onRecoveryResponse(h,n),console.info("[canary:sync] Applied recovery response from",n.slice(0,8))}_trackDecryptFailure(t){const n=(this.decryptFailures.get(t)??0)+1;if(this.decryptFailures.set(t,n),n<Mb)return;const r=this.recoveryPending.get(t);if(r!==void 0&&Date.now()-r<Ob)return;this.recoveryPending.delete(t);const o=this.groupKeys.get(t);o&&o.admins.size>0&&o.onRecoveryResponse&&(console.warn(`[canary:sync] ${n} decrypt failures for group — requesting recovery`),this.requestRecovery(t,0,0).catch(s=>{console.warn("[canary:sync] Auto-recovery request failed:",s)}))}disconnect(){for(const[,t]of this.subs)t.close();this.subs.clear(),this.recoverySub&&(this.recoverySub.close(),this.recoverySub=null)}}function H(e,t="info",n=4e3){const r=document.getElementById("toast-container")??Pb(),o=document.createElement("div");o.className=`toast toast--${t}`,o.textContent=e,r.appendChild(o),requestAnimationFrame(()=>o.classList.add("toast--visible")),setTimeout(()=>{o.classList.remove("toast--visible"),setTimeout(()=>o.remove(),300)},n)}function Pb(){const e=document.createElement("div");return e.id="toast-container",e.className="toast-container",document.body.appendChild(e),e}const Ub=Object.freeze(Object.defineProperty({__proto__:null,showToast:H},Symbol.toStringTag,{value:"Module"}));let $n=null;function Db(e=6e4){$n||(Ua(),$n=setInterval(Ua,e))}function Gd(){$n&&(clearInterval($n),$n=null)}function Ua(){const{groups:e,identity:t}=_();if(!t)return;const n=Math.floor(Date.now()/1e3);for(const[r,o]of Object.entries(e)){ke(r,{type:"liveness-checkin",pubkey:t.pubkey,timestamp:n,opId:crypto.randomUUID()});const s={...o.livenessCheckins,[t.pubkey]:n};J(r,{livenessCheckins:s})}}const jb=60;function Kd(e,t,n){const r=_().groups[e];if(!r)return;const o=Math.floor(Date.now()/1e3);if(n>o+jb)return;const s=r.livenessCheckins[t]??0;if(n<=s)return;const i={...r.livenessCheckins,[t]:n};J(e,{livenessCheckins:i})}const qb=Object.freeze(Object.defineProperty({__proto__:null,recordCheckin:Kd,startLivenessHeartbeat:Db,stopLivenessHeartbeat:Gd},Symbol.toStringTag,{value:"Module"}));let pe=null;const zr=new Map,Hb=500,xs=new Map;function Da(e,t){const n=xs.get(e);return n?n.includes(t):!1}function ja(e,t){let n=xs.get(e);n||(n=[],xs.set(e,n)),n.length>=Hb&&n.shift(),n.push(t)}function Fb(e){pe=e}async function $e(e,t,n){const{identity:r}=_(),o=t??e;if(!(!r||!r.privkey||e.length===0&&o.length===0))try{Ti(e,o),pe?pe instanceof Wr&&pe.updateRelays(e,o):Fb(new Wr(e,o,r.pubkey,r.privkey)),n&&Wd(n),n&&vg(n).then(s=>{for(const i of s)ke(n,i)}),_o().then(()=>Un(qt(),Dt()))}catch(s){console.warn("[canary:sync] ensureTransport failed:",s),Un(!1,0)}}function ke(e,t){!pe||!_().groups[e]||pe.send(e,t).catch(r=>{console.warn("[canary:sync] broadcast failed:",r)})}function fn(e){if(!(pe instanceof Wr))return;const{identity:t,groups:n}=_(),r=n[e];if(!t?.privkey||!r?.seed)return;pe.unregisterGroup(e);const o=new Md(r.seed,t.privkey);pe.registerGroup(e,r.seed,o,r.members,Vd(e))}function Vd(e){return{admins:_().groups[e]?.admins??[],onRecoveryRequest:(t,n,r)=>{const{groups:o}=_(),s=o[e];return!s||!s.members.includes(t)?null:{type:"state-snapshot",seed:s.seed,counter:s.counter,usageOffset:s.usageOffset,members:s.members,admins:s.admins,epoch:s.epoch,opId:`recovery-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,timestamp:Math.floor(Date.now()/1e3)}},onRecoveryResponse:(t,n)=>{const{groups:r}=_(),o=r[e];if(!o)return;const s=bo(o,t,void 0,n);s!==o&&(J(e,s),fn(e),H("Group state recovered from admin","success"))}}}function Gb(e,t,n,r=Math.floor(Date.now()/1e3),o=Kb){if(t.type==="liveness-checkin"){if(!n)return;const s=r-t.timestamp;s<=Bn&&s>=-60&&(Da(e,t.opId)||(ja(e,t.opId),Kd(e,n,t.timestamp)));return}if(t.type==="beacon"||t.type==="duress-alert"||t.type==="duress-clear"){const s=r-t.timestamp;if(s>Bn||s<-60||Da(e,t.opId))return;ja(e,t.opId),o(e,t,n)}}function Kb(e,t,n){document.dispatchEvent(new CustomEvent("canary:sync-message",{detail:{groupId:e,message:t,sender:n}}))}function Wd(e){if(!pe)return;if(zr.get(e)?.(),pe instanceof Wr){const{identity:n,groups:r}=_(),o=r[e];if(n?.privkey&&o?.seed){const s=new Md(o.seed,n.privkey);pe.registerGroup(e,o.seed,s,o.members,Vd(e))}}const t=pe.subscribe(e,(n,r)=>{const{groups:o}=_(),s=o[e];if(!s)return;const i=bo(s,n,void 0,r);if(i!==s&&J(e,i),(n.type==="member-join"||n.type==="member-leave"||n.type==="reseed"||n.type==="state-snapshot")&&fn(e),n.type==="member-join"&&i!==s){const a=n.pubkey?i.memberNames?.[n.pubkey]??r?.slice(0,8)??"Someone":"Someone";document.dispatchEvent(new CustomEvent("canary:member-joined",{detail:{groupId:e,pubkey:n.pubkey,name:a}}))}if(n.type==="member-join"&&i!==s){const a=n.pubkey?i.memberNames?.[n.pubkey]??r?.slice(0,8)??"Someone":"Someone";H(`${a} joined the group`,"success")}else n.type==="reseed"?H("Group secret was rotated","warning"):n.type==="state-snapshot"&&H("Group state recovered","success");Gb(e,n,r),Xb(),setTimeout(()=>Un(qt(),Dt()),1500)});zr.set(e,t)}function Vb(){const{groups:e}=_();for(const t of Object.keys(e))Wd(t)}function an(){Gd();for(const e of zr.values())e();zr.clear(),pe?.disconnect(),pe=null}var pr=new TextDecoder("utf-8");new TextEncoder;var zd=5e3;function Jd(e){let{prefix:t,words:n}=Ke.decode(e,zd),r=new Uint8Array(Ke.fromWords(n));switch(t){case"nprofile":{let o=Yo(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for nprofile");if(o[0][0].length!==32)throw new Error("TLV 0 should be 32 bytes");return{type:"nprofile",data:{pubkey:q(o[0][0]),relays:o[1]?o[1].map(s=>pr.decode(s)):[]}}}case"nevent":{let o=Yo(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for nevent");if(o[0][0].length!==32)throw new Error("TLV 0 should be 32 bytes");if(o[2]&&o[2][0].length!==32)throw new Error("TLV 2 should be 32 bytes");if(o[3]&&o[3][0].length!==4)throw new Error("TLV 3 should be 4 bytes");return{type:"nevent",data:{id:q(o[0][0]),relays:o[1]?o[1].map(s=>pr.decode(s)):[],author:o[2]?.[0]?q(o[2][0]):void 0,kind:o[3]?.[0]?parseInt(q(o[3][0]),16):void 0}}}case"naddr":{let o=Yo(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for naddr");if(!o[2]?.[0])throw new Error("missing TLV 2 for naddr");if(o[2][0].length!==32)throw new Error("TLV 2 should be 32 bytes");if(!o[3]?.[0])throw new Error("missing TLV 3 for naddr");if(o[3][0].length!==4)throw new Error("TLV 3 should be 4 bytes");return{type:"naddr",data:{identifier:pr.decode(o[0][0]),pubkey:q(o[2][0]),kind:parseInt(q(o[3][0]),16),relays:o[1]?o[1].map(s=>pr.decode(s)):[]}}}case"nsec":return{type:t,data:r};case"npub":case"note":return{type:t,data:q(r)};default:throw new Error(`unknown prefix ${t}`)}}function Yo(e){let t={},n=e;for(;n.length>0;){let r=n[0],o=n[1],s=n.slice(2,2+o);if(n=n.slice(2+o),s.length<o)throw new Error(`not enough data to read on TLV ${r}`);t[r]=t[r]||[],t[r].push(s)}return t}function Wb(e){return Jb("nsec",e)}function zb(e,t){let n=Ke.toWords(t);return Ke.encode(e,n,zd)}function Jb(e,t){return zb(e,t)}function Yd(){return document.documentElement.getAttribute("data-theme")==="light"?"light":"dark"}function Yb(e){e==="light"?document.documentElement.setAttribute("data-theme","light"):document.documentElement.removeAttribute("data-theme")}function Zd(e){const t=Yd();e.setAttribute("aria-label",t==="dark"?"Switch to light mode":"Switch to dark mode"),e.textContent="◐"}function Zb(e){const t=Yd()==="dark"?"light":"dark";Yb(t),te({settings:{..._().settings,theme:t}}),Zd(e)}function Li(e){const t=_().view;e.innerHTML=`
    <button class="header__hamburger" id="hamburger" aria-label="Toggle menu">&#9776;</button>
    <div class="header__brand">CANARY</div>
    <nav class="header__nav" id="header-nav">
      <button class="header__nav-tab${t==="groups"?" header__nav-tab--active":""}" data-view="groups">Groups</button>
      <button class="header__nav-tab${t==="call-demo"?" header__nav-tab--active":""}" data-view="call-demo">Call Demo</button>
    </nav>
    <div class="header__actions">
      <button class="header__identity-btn" id="identity-btn" title="Identity">
        <img class="header__identity-avatar" id="identity-avatar" alt="" hidden>
        <span class="header__identity-dot" id="identity-dot"></span>
        <span class="header__identity-label" id="identity-label">...</span>
      </button>
      <span id="relay-status" hidden>
        <span class="relay-dot"></span>
        <span class="relay-label"></span>
      </span>
      <span id="vault-sync-status" class="vault-sync-indicator" hidden title="Vault synced"></span>
      <button class="theme-toggle" id="theme-toggle" aria-label="Switch to light mode">&#9680;</button>
      <button class="theme-toggle" id="reset-btn" aria-label="Reset demo" title="Clear all data and reset">&#8634;</button>
    </div>
  `;const n=e.querySelector("#theme-toggle");n&&(Zd(n),n.addEventListener("click",()=>Zb(n)));const r=e.querySelector("#reset-btn");r&&r.addEventListener("click",()=>{confirm("Clear all data and reset the demo?")&&(localStorage.clear(),window.location.reload())}),Ni();const o=e.querySelector("#identity-btn");o?.addEventListener("click",()=>tv(o)),qt()&&Un(!0,Dt()),document.addEventListener("canary:vault-synced",()=>{const i=document.getElementById("vault-sync-status");i&&(i.hidden=!1,i.textContent="☁",setTimeout(()=>{i.hidden=!0},3e3))}),e.querySelector("#header-nav")?.addEventListener("click",i=>{const a=i.target.closest("[data-view]");if(!a)return;const c=a.dataset.view;if(c){if(c==="groups"&&window.innerWidth<=768){const l=document.getElementById("sidebar"),d=document.getElementById("sidebar-overlay");if(l&&d){const u=l.classList.contains("sidebar--open");l.classList.toggle("sidebar--open",!u),d.classList.toggle("sidebar-overlay--visible",!u)}}c!==_().view&&te({view:c})}})}function Un(e,t){const n=document.getElementById("relay-status");if(!n)return;const r=n.querySelector(".relay-dot"),o=n.querySelector(".relay-label");!e||t===0?(n.removeAttribute("hidden"),r?.setAttribute("class","relay-dot relay-dot--offline"),o&&(o.textContent="Offline"),n.title="Not connected to any relay"):(n.removeAttribute("hidden"),r?.setAttribute("class","relay-dot relay-dot--synced"),o&&(o.textContent=`Synced · ${t} relay${t===1?"":"s"}`),n.title=`Connected to ${t} relay${t===1?"":"s"}`)}function Xb(){const e=document.getElementById("relay-status");if(!e)return;const t=e.querySelector(".relay-dot"),n=e.querySelector(".relay-label");e.removeAttribute("hidden"),t?.setAttribute("class","relay-dot relay-dot--syncing"),n&&(n.textContent="Syncing...")}function Ni(){const e=document.getElementById("identity-dot"),t=document.getElementById("identity-label"),n=document.getElementById("identity-avatar");if(!e||!t)return;const{identity:r}=_();if(!r?.pubkey){t.textContent="No identity",e.className="header__identity-dot header__identity-dot--none",n&&(n.hidden=!0);return}const o=`${r.pubkey.slice(0,6)}…${r.pubkey.slice(-4)}`,s=r.displayName&&r.displayName!=="You"?r.displayName:o;t.textContent=s,n&&r.picture?(n.src=r.picture,n.hidden=!1,e.hidden=!0):(n&&(n.hidden=!0),e.hidden=!1,e.className=r.signerType==="nip07"?"header__identity-dot header__identity-dot--extension":"header__identity-dot header__identity-dot--local")}function Qb(e){return Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}function Xd(e,t){return t?.pubkey===e.pubkey&&t.mnemonic?{...e,mnemonic:t.mnemonic}:e}function ev(e,t){try{const n=_().identity,r=Jd(e.trim());if(r.type!=="nsec")return alert('Not a valid nsec. Expected a bech32-encoded private key starting with "nsec1".'),!1;const o=r.data,s=Qb(o),i=wo(o),a=Xd({pubkey:i,privkey:s,signerType:"local",displayName:t??"You"},n);return an(),te({identity:a,groups:{},activeGroupId:null}),Ni(),document.dispatchEvent(new CustomEvent("canary:resync")),!0}catch{return alert("Invalid nsec format."),!1}}function tv(e){document.getElementById("identity-popover")?.remove();const{identity:t}=_(),n=t?.pubkey??"",r=n?`${n.slice(0,8)}…${n.slice(-8)}`:"None",o=t?.signerType==="nip07"?"Extension (NIP-07)":"Local key",s=document.createElement("div");s.id="identity-popover",s.className="identity-popover",s.innerHTML=`
    <div class="identity-popover__row">
      <span class="identity-popover__label">Pubkey</span>
      <span class="identity-popover__value" title="${n}">${r}</span>
    </div>
    <div class="identity-popover__row">
      <span class="identity-popover__label">Signer</span>
      <span class="identity-popover__value">${o}</span>
    </div>

    ${t?.mnemonic||t?.privkey?`
      <div class="identity-popover__divider"></div>
      <div class="identity-popover__section">
        <span class="identity-popover__label">Recovery phrase</span>
        <p style="font-size: 0.6875rem; color: var(--text-muted); margin: 0.25rem 0;">Back this up — it's the only way to recover your account.</p>
        <div id="recovery-reveal-area" style="margin-top: 0.375rem;">
          <button class="btn btn--sm" id="recovery-reveal-btn" type="button" style="width: 100%;">Show recovery phrase</button>
        </div>
      </div>
    `:""}
    ${t?.privkey?`
      <div class="identity-popover__section" style="padding-top: 0;">
        <details style="font-size: 0.75rem;">
          <summary style="cursor: pointer; color: var(--text-muted);">Advanced: show nsec</summary>
          <div id="nsec-reveal-area" style="margin-top: 0.375rem;">
            <button class="btn btn--sm" id="nsec-reveal-btn" type="button" style="width: 100%;">Show nsec</button>
          </div>
        </details>
      </div>
    `:""}

    <div class="identity-popover__divider"></div>
    <button class="btn btn--sm" id="identity-logout-btn" type="button" style="width: 100%; color: var(--failed);">Logout</button>

    <details style="margin-top: 0.25rem;">
      <summary class="btn btn--sm" style="width: 100%; text-align: center; cursor: pointer; list-style: none;">Switch account</summary>

      <div style="margin-top: 0.5rem;">
        <div class="identity-popover__section">
          <span class="identity-popover__label">Login with nsec</span>
          <form id="nsec-login-form" autocomplete="off" style="display: flex; flex-direction: column; gap: 0.375rem; margin-top: 0.375rem;">
            <input class="input" type="password" id="nsec-input" placeholder="nsec1..." autocomplete="off" style="width: 100%; font-size: 0.8125rem; padding: 0.5rem;" />
            <button class="btn btn--sm btn--primary" type="submit" style="width: 100%;">Login</button>
          </form>
        </div>

        <button class="btn btn--sm" id="nip07-connect-btn" type="button" style="width: 100%;">Use Browser Extension (NIP-07)</button>
      </div>
    </details>
  `,e.parentElement?.appendChild(s),s.querySelector("#identity-logout-btn")?.addEventListener("click",()=>{an(),te({identity:null,groups:{},activeGroupId:null}),s.remove(),window.location.reload()}),s.querySelector("#recovery-reveal-btn")?.addEventListener("click",()=>{const a=s.querySelector("#recovery-reveal-area");if(!a)return;const c=_().identity?.mnemonic;if(!c){a.textContent="";const f=document.createElement("p");f.style.cssText="font-size:0.75rem;color:var(--text-muted);",f.textContent="No recovery phrase stored (key was imported via nsec).",a.appendChild(f);return}const l=c.split(" ");a.textContent="";const d=document.createElement("div");d.style.cssText="display:grid;grid-template-columns:repeat(3,1fr);gap:0.375rem;margin:0.375rem 0;",l.forEach((f,h)=>{const p=document.createElement("div");p.style.cssText="border:1px solid var(--border);border-radius:3px;padding:0.25rem;text-align:center;font-family:var(--font-mono,monospace);font-size:0.7rem;";const m=document.createElement("span");m.style.color="var(--text-muted)",m.textContent=`${h+1}. `;const y=document.createElement("span");y.textContent=f,p.append(m,y),d.appendChild(p)}),a.appendChild(d);const u=document.createElement("button");u.className="btn btn--sm",u.type="button",u.style.cssText="width:100%;margin-top:0.375rem;",u.textContent="Copy words",u.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(c),u.textContent="Copied!",setTimeout(()=>{u.textContent="Copy words"},2e3)}catch{}}),a.appendChild(u)}),s.querySelector("#nsec-reveal-btn")?.addEventListener("click",()=>{const a=s.querySelector("#nsec-reveal-area");if(!a||!t?.privkey)return;const c=Wb(F(t.privkey));a.innerHTML=`
      <code style="font-size: 0.65rem; word-break: break-all; display: block; background: var(--bg); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border); user-select: all;">${c}</code>
      <button class="btn btn--sm" id="nsec-copy-btn" type="button" style="width: 100%; margin-top: 0.375rem;">Copy nsec</button>
    `,a.querySelector("#nsec-copy-btn")?.addEventListener("click",async l=>{const d=l.currentTarget;try{await navigator.clipboard.writeText(c),d.textContent="Copied!",setTimeout(()=>{d.textContent="Copy nsec"},2e3)}catch{}})}),s.querySelector("#nsec-login-form")?.addEventListener("submit",a=>{a.preventDefault();const c=s.querySelector("#nsec-input");c?.value.trim()&&ev(c.value)&&s.remove()}),s.querySelector("#nip07-connect-btn")?.addEventListener("click",async()=>{if(!Od()){alert("No Nostr extension found. Install Alby, nos2x, or another NIP-07 extension and reload.");return}try{an();const a=await window.nostr.getPublicKey(),c=Xd({pubkey:a,signerType:"nip07",displayName:t?.displayName??"You"},t);te({identity:c,groups:{},activeGroupId:null}),Ni(),document.dispatchEvent(new CustomEvent("canary:resync")),s.remove()}catch{alert("Extension rejected the request.")}});const i=a=>{!s.contains(a.target)&&a.target!==e&&(s.remove(),document.removeEventListener("click",i))};requestAnimationFrame(()=>document.addEventListener("click",i))}function j(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function qa(e){const t=Math.floor(e/86400);if(t>=1)return`${t}d`;const n=Math.floor(e/3600);return n>=1?`${n}h`:`${Math.floor(e/60)}m`}function nv(e){if(!e)return"";const t=e.displayName??`${e.pubkey.slice(0,8)}…`;return`
    <div class="identity-badge">
      <span class="identity-badge__name">${j(t)}</span>
    </div>
  `}function rv(e,t){const n=Object.values(e);return n.length===0?'<div class="group-list__empty">No groups yet</div>':n.map(r=>{const o=r.id===t,s=o?" group-list__item--active":"",i=qa(r.livenessInterval),a=qa(r.livenessInterval);return`
        <button
          class="group-list__item${s}"
          data-group-id="${j(r.id)}"
          aria-current="${o?"true":"false"}"
        >
          <span class="group-list__name">${j(r.name)}</span>
          <span class="group-list__preset">${j(i)} · ${j(a)}</span>
        </button>
      `}).join("")}function ov(e){const{identity:t,groups:n,activeGroupId:r}=_();e.innerHTML=`
    <div class="sidebar__tagline">spoken-word verification</div>
    ${nv(t)}
    <nav class="group-list" aria-label="Groups">
      ${rv(n,r)}
    </nav>
    <button class="btn btn--primary" id="create-group-btn">+ New Group</button>
  `,e.querySelector(".group-list")?.addEventListener("click",i=>{const a=i.target.closest("[data-group-id]");if(!a)return;const c=a.dataset.groupId;c&&te({activeGroupId:c})}),e.querySelector("#create-group-btn")?.addEventListener("click",()=>{e.dispatchEvent(new CustomEvent("canary:create-group",{bubbles:!0}))})}const Ss="app-modal";function $i(e,t){let n=document.getElementById(Ss);if(n||(n=document.createElement("dialog"),n.id=Ss,n.className="modal",document.body.appendChild(n)),n.innerHTML=`
    <form class="modal__form" method="dialog" id="modal-form">
      ${e}
    </form>
  `,t){const r=n.querySelector("#modal-form");r?.addEventListener("submit",o=>{o.preventDefault();const s=new FormData(r);t(s),Ha()})}n.addEventListener("click",r=>{r.target===n&&Ha()}),n.showModal()}function Ha(){document.getElementById(Ss)?.close()}const Qd=/^[0-9a-f]{64}$/,sv=new TextEncoder().encode("canary:beacon:key"),iv=new TextEncoder().encode("canary:duress:key");function eu(e){if(!Qd.test(e))throw new Error("seedHex must be a 64-character lowercase hex string (32 bytes)")}function av(e){if(e.length!==32)throw new Error("AES-256-GCM requires a 32-byte key")}function tu(e){return eu(e),rt(F(e),sv)}function cv(e){return eu(e),rt(F(e),iv)}async function nu(e,t){av(e);const n=crypto.getRandomValues(new Uint8Array(12)),r=await crypto.subtle.importKey("raw",e,{name:"AES-GCM"},!1,["encrypt"]),o=new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM",iv:n},r,t)),s=new Uint8Array(12+o.length);return s.set(n),s.set(o,12),bd(s)}async function ru(e,t,n){const r={geohash:t,precision:n,timestamp:Math.floor(Date.now()/1e3)};return nu(e,new TextEncoder().encode(JSON.stringify(r)))}function lv(e,t){if(!Qd.test(e))throw new Error(`Invalid member pubkey: expected 64 lowercase hex characters, got ${e.length} chars`);return{type:"duress",member:e,geohash:"",precision:0,locationSource:"none",timestamp:Math.floor(Date.now()/1e3)}}async function dv(e,t){return nu(e,new TextEncoder().encode(JSON.stringify(t)))}function ou(){const{identity:e}=_();if(!e?.pubkey)throw new Error("No local identity — cannot perform privileged action.");return e.pubkey}function xo(e){const t=ou();if(!e.admins.includes(t))throw new Error(`Not authorised — you are not an admin of "${e.name}".`)}function uv(e){const t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function fv(e,t,n){const r=crypto.randomUUID(),s=Zg({name:e,members:n?[n]:[],preset:t,creator:n}),i=_().settings,a=[...i.defaultReadRelays??i.defaultRelays],c=[...i.defaultWriteRelays??i.defaultRelays],l={family:"words","field-ops":"words",enterprise:"words",event:"pin"},d={...s,id:r,nostrEnabled:c.length>0||a.length>0,relays:c,readRelays:a,writeRelays:c,encodingFormat:l[t]??"words",usedInvites:[],latestInviteIssuedAt:0,livenessInterval:s.rotationInterval,livenessCheckins:{},tolerance:1,memberNames:{},duressMode:"immediate"},{groups:u}=_();return te({groups:{...u,[r]:d},activeGroupId:r}),n&&ke(r,{type:"member-join",pubkey:n,timestamp:Math.floor(Date.now()/1e3),epoch:0,opId:crypto.randomUUID()}),r}function hv(e){const{groups:t,activeGroupId:n}=_(),r={...t};delete r[e],te({groups:r,activeGroupId:n===e?null:n})}function pv(e){const{groups:t}=_(),n=t[e];if(!n){console.warn(`[canary:actions] reseedGroup: unknown group id "${e}"`);return}xo(n);const r=Ri(n),o=(n.epoch??0)+1,s=crypto.randomUUID(),i=[...n.admins??[]];ke(e,{type:"reseed",seed:uv(r.seed),counter:r.counter,timestamp:Math.floor(Date.now()/1e3),epoch:o,opId:s,admins:i,members:[...n.members]}),J(e,{...r,epoch:o,consumedOps:[s],admins:i}),fn(e)}function mv(e){const{groups:t}=_(),n=t[e];if(!n){console.warn(`[canary:actions] compromiseReseed: unknown group id "${e}"`);return}xo(n);const r=Ri(n),o=(n.epoch??0)+1;J(e,{...r,epoch:o,consumedOps:[],admins:[...n.admins??[]]}),fn(e)}function Is(e,t,n){const{groups:r}=_(),o=r[e];if(!o){console.warn(`[canary:actions] addGroupMember: unknown group id "${e}"`);return}xo(o);const s=crypto.randomUUID(),i=Id(o,t);J(e,{...i,consumedOps:[...o.consumedOps??[],s]}),fn(e),ke(e,{type:"member-join",pubkey:t,displayName:n||void 0,timestamp:Math.floor(Date.now()/1e3),epoch:o.epoch??0,opId:s})}function yv(e,t){const{groups:n}=_(),r=n[e];if(!r){console.warn(`[canary:actions] removeGroupMember: unknown group id "${e}"`);return}const o=ou();if(t!==o&&xo(r),!r.members.includes(t))return;const s=Rd(r,t),i=Ri(s),a=(r.epoch??0)+1,c={...r.memberNames??{}};delete c[t];const l={...r.livenessCheckins??{}};delete l[t];const d=(r.admins??[]).filter(u=>u!==t);J(e,{...i,memberNames:c,livenessCheckins:l,admins:d,epoch:a,consumedOps:[]}),fn(e)}function gv(e){const{groups:t}=_(),n=t[e];if(!n){console.warn(`[canary:actions] burnWord: unknown group id "${e}"`);return}const r=Xg(n);J(e,r),ke(e,{type:"counter-advance",counter:r.counter,usageOffset:r.usageOffset,timestamp:Math.floor(Date.now()/1e3)})}const Zo=/^[0-9a-f]{64}$/;function bv(e){if(!e||typeof e!="object")throw new Error("Import failed — expected a JSON object.");const t=e;if(typeof t.name!="string"||t.name.trim().length===0)throw new Error("Import failed — name is required.");if(typeof t.seed!="string"||!Zo.test(t.seed))throw new Error("Import failed — seed must be a 64-character lowercase hex string.");if(!Array.isArray(t.members)||t.members.length===0)throw new Error("Import failed — members must be a non-empty array.");for(const n of t.members)if(typeof n!="string"||!Zo.test(n))throw new Error(`Import failed — invalid member pubkey: "${String(n)}".`);if(Array.isArray(t.admins)){for(const r of t.admins)if(typeof r!="string"||!Zo.test(r))throw new Error(`Import failed — invalid admin pubkey: "${String(r)}".`);const n=new Set(t.members);for(const r of t.admins)if(!n.has(r))throw new Error(`Import failed — admin "${r}" is not in the members list.`)}if(t.rotationInterval!==void 0&&(typeof t.rotationInterval!="number"||!Number.isInteger(t.rotationInterval)||t.rotationInterval<=0))throw new Error("Import failed — rotationInterval must be a positive integer.");if(t.wordCount!==void 0&&t.wordCount!==1&&t.wordCount!==2&&t.wordCount!==3)throw new Error("Import failed — wordCount must be 1, 2, or 3.");if(t.encodingFormat!==void 0&&t.encodingFormat!=="words"&&t.encodingFormat!=="pin"&&t.encodingFormat!=="hex")throw new Error("Import failed — encodingFormat must be words, pin, or hex.");if(t.epoch!==void 0&&(typeof t.epoch!="number"||!Number.isInteger(t.epoch)||t.epoch<0))throw new Error("Import failed — epoch must be a non-negative integer.");if(t.consumedOps!==void 0&&(!Array.isArray(t.consumedOps)||!t.consumedOps.every(n=>typeof n=="string")))throw new Error("Import failed — consumedOps must be an array of strings.")}function vv(e){const{groups:t}=_();if(Object.keys(t).length>0){e.hidden=!0;return}e.hidden=!1,e.innerHTML=`
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
  `,document.getElementById("welcome-create").addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("canary:create-group"))}),document.getElementById("welcome-join").addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("canary:join-group"))})}const Tt="canary:group";function Ot(e){switch(e.encodingFormat){case"pin":return{format:"pin",digits:6};case"hex":return{format:"hex",length:8};default:return{format:"words",count:e.wordCount}}}function Rs(e,t){return t==="pin"&&e.length===6?`${e.slice(0,3)}-${e.slice(3)}`:t==="hex"&&e.length===8?`${e.slice(0,4)}-${e.slice(4)}`:e}function wv(e,t){const{identity:n}=_();if(n?.pubkey===e)return"You";const r=t.memberNames?.[e];return r||e.slice(0,8)+"…"}let xr=null;function Xo(){xr!==null&&(clearInterval(xr),xr=null)}function Ev(e=new Date){return e.toISOString().slice(11,19)+" UTC"}function kv(e){return e.replace(/[a-zA-Z0-9]/g,"•")}const Fa="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789•·∘◦○●◈◆▪▫";function _v(e,t,n=600){const r=t.length,o=30,s=Math.ceil(n/o),i=l=>Math.floor(l/r*s*.7)+Math.floor(s*.3);let a=0;const c=setInterval(()=>{a++;let l="";for(let d=0;d<r;d++)a>=i(d)?l+=t[d]:l+=Fa[Math.floor(Math.random()*Fa.length)];e.textContent=l,a>=s&&(clearInterval(c),e.textContent=t)},o)}function Ga(e){if(e<=0)return"0s";const t=Math.floor(e/86400),n=Math.floor(e%86400/3600),r=Math.floor(e%3600/60),o=Math.floor(e%60);return t>=1?n>0?`${t}d ${n}h`:`${t}d`:n>=1?r>0?`${n}h ${r}m`:`${n}h`:r>=1?o>0?`${r}m ${o}s`:`${r}m`:`${o}s`}function Ka(e){const t=Math.floor(Date.now()/1e3),r=(bt(t,e.rotationInterval)+1)*e.rotationInterval;return Math.max(0,r-t)}const xv=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],Sv=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function Va(e,t){if(t>=86400){const n=new Date(Date.now()+e*1e3),r=xv[n.getUTCDay()],o=n.getUTCDate(),s=Sv[n.getUTCMonth()],i=String(n.getUTCHours()).padStart(2,"0"),a=String(n.getUTCMinutes()).padStart(2,"0");return`rotates ${r} ${o} ${s} at ${i}:${a} UTC (${Ga(e)})`}return`rotates in ${Ga(e)} · ${Ev()}`}function Iv(e){const{identity:t}=_(),n=e.counter+e.usageOffset;return Ee(e.seed,Tt,n,Ot(e),t?.pubkey)}function Rv(e){const{identity:t}=_();if(!t?.pubkey)return null;const n=e.counter+e.usageOffset;return go(e.seed,Tt,t.pubkey,n,Ot(e),e.tolerance)}function su(e){Xo();const{groups:t,activeGroupId:n}=_();if(!n){e.innerHTML="";return}const r=t[n];if(!r){e.innerHTML="";return}const o=Qg(r);if(o!==r){J(n,o);return}const s=Iv(r),i=Rs(s,r.encodingFormat),a=Rv(r),c=a?Rs(a,r.encodingFormat):null,l=kv(i),d=Ka(r),u=Math.min(100,Math.max(0,(r.rotationInterval-d)/r.rotationInterval*100));e.innerHTML=`
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
          <div class="hero__progress-bar" id="hero-progress-bar" style="width: ${u}%"></div>
        </div>
        <span class="hero__countdown-label" id="hero-countdown-label">${Va(d,r.rotationInterval)}</span>
      </div>

      <p class="hero__hint">Press and hold to reveal. Tap the right side for your alternate word.</p>

      <button class="btn btn--ghost" id="burn-btn" type="button" title="Rotate to a new word now. All group members will get a new word too.">I used this word</button>
      <button class="btn btn--outline" id="hero-invite-btn" type="button" title="Share group access with someone new">Invite Someone</button>
      ${r.members.length>=2?'<button class="btn btn--outline" id="hero-call-btn" type="button" title="Start a phone call verification">Verify Call</button>':""}

    </section>
  `;const f=e.querySelector("#hero-word"),h=e.querySelector("#hero-reveal-btn");function p(N){f&&(f.textContent=N&&c?c:i,f.classList.remove("hero__word--masked"),f.classList.add("hero__word--revealed"))}function m(){f&&(f.textContent=l,f.classList.remove("hero__word--revealed"),f.classList.add("hero__word--masked"))}h&&(h.addEventListener("pointerdown",N=>{N.preventDefault();const $=h.getBoundingClientRect(),v=N.clientX-$.left>$.width/2;p(v)}),h.addEventListener("pointerup",m),h.addEventListener("pointerleave",m),h.addEventListener("pointercancel",m)),e.querySelector("#burn-btn")?.addEventListener("click",()=>{try{gv(n);const N=Hn(_().groups[n]??r)==="online";H(N?"Word rotated — syncing to group":"Word rotated","success",2e3),document.dispatchEvent(new CustomEvent("canary:vault-publish-now")),requestAnimationFrame(()=>{const $=document.getElementById("hero-word");if($){const w=$.textContent??"••••••••";_v($,w)}})}catch(N){H(N instanceof Error?N.message:"Failed to rotate word","error")}}),e.querySelector("#hero-invite-btn")?.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("canary:show-invite",{detail:{groupId:n}}))}),e.querySelector("#hero-call-btn")?.addEventListener("click",()=>{const{identity:N}=_(),$=r.members.filter(g=>g!==N?.pubkey);if($.length===0)return;if($.length===1){document.dispatchEvent(new CustomEvent("canary:verify-call",{detail:{groupId:n,pubkey:$[0]}}));return}const w=$.map(g=>`
      <button class="btn btn--outline member-pick-btn" data-pubkey="${j(g)}" type="button" style="width:100%;text-align:left;margin-bottom:0.5rem;">
        ${j(wv(g,r))}
      </button>
    `).join("");let v=document.getElementById("member-picker");v||(v=document.createElement("dialog"),v.id="member-picker",v.className="modal",document.body.appendChild(v)),v.innerHTML=`
      <div class="modal__form" style="min-width:240px;">
        <h2 class="modal__title">Who are you calling?</h2>
        ${w}
        <div class="modal__actions">
          <button class="btn" id="picker-cancel" type="button">Cancel</button>
        </div>
      </div>
    `,v.querySelector("#picker-cancel")?.addEventListener("click",()=>v.close()),v.addEventListener("click",g=>{g.target===v&&v.close()}),v.querySelectorAll(".member-pick-btn").forEach(g=>{g.addEventListener("click",()=>{const x=g.dataset.pubkey;v.close(),x&&document.dispatchEvent(new CustomEvent("canary:verify-call",{detail:{groupId:n,pubkey:x}}))})}),v.showModal()});const L=e.querySelector("#hero-progress-bar"),O=e.querySelector("#hero-countdown-label");xr=setInterval(()=>{const{groups:N}=_(),$=N[n];if(!$){Xo();return}const w=Ka($),v=Math.min(100,Math.max(0,($.rotationInterval-w)/$.rotationInterval*100));L&&(L.style.width=`${v}%`),O&&(O.textContent=Va(w,$.rotationInterval)),w===0&&(Xo(),su(e))},1e3)}const Mi="canary:duress-dismissed";function Oi(){try{const e=localStorage.getItem(Mi);return e?new Set(JSON.parse(e)):new Set}catch{return new Set}}function Wa(e){const t=Oi();t.add(e),localStorage.setItem(Mi,JSON.stringify([...t]))}function Av(e){const t=Oi();t.delete(e),localStorage.setItem(Mi,JSON.stringify([...t]))}function Jr(e,t){const n=_().groups[t];if(!n)return e.slice(0,8);const{identity:r}=_();if(r?.pubkey===e)return"You";const o=n.memberNames?.[e];return o||`${e.slice(0,8)}…${e.slice(-4)}`}function Cv(e){const n=Math.floor(Date.now()/1e3)-e;if(n<30)return"just now";if(n<60)return`${n}s ago`;const r=Math.floor(n/60);return r<60?`${r} min ago`:new Date(e*1e3).toLocaleTimeString()}function iu(e,t,n,r,o){if(!o&&Oi().has(e))return;const s=document.querySelector(".duress-overlay");s&&s.remove();const i=Jr(e,t),a=r?Cv(r):new Date().toLocaleTimeString(),c=document.createElement("div");c.className="duress-overlay",c.dataset.subject=e,c.dataset.groupId=t,c.setAttribute("role","alertdialog"),c.setAttribute("aria-label",`${i} needs help`);const l=document.createElement("div");l.className="duress-overlay__content";const d=document.createElement("div");d.className="duress-overlay__icon",d.setAttribute("aria-hidden","true"),d.textContent="!",l.appendChild(d);const u=document.createElement("h1");u.className="duress-overlay__title",u.textContent=i,l.appendChild(u);const f=document.createElement("h2");if(f.className="duress-overlay__subtitle",f.textContent="NEEDS HELP",l.appendChild(f),n&&(n.lat!==0||n.lon!==0)){const b=document.createElement("p");b.className="duress-overlay__location",b.textContent=`Last known: ${n.lat.toFixed(4)}, ${n.lon.toFixed(4)}`,l.appendChild(b)}const h=document.createElement("p");h.className="duress-overlay__time",h.textContent=a,l.appendChild(h);const p=document.createElement("button");p.className="btn btn--lg duress-overlay__dismiss",p.textContent="I'm Responding",p.title="Dismiss this alert on your screen only — does not clear the duress for others",p.addEventListener("click",()=>{Wa(e),c.classList.remove("duress-overlay--visible"),setTimeout(()=>c.remove(),300)}),l.appendChild(p);const m=document.createElement("button");m.className="btn btn--lg duress-overlay__stand-down",m.textContent="Stand Down — Person is Safe",m.title="Broadcast to all group members that this person has been confirmed safe",m.addEventListener("click",()=>{Wa(e),ke(t,{type:"duress-clear",subject:e,timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID()}),c.classList.remove("duress-overlay--visible"),setTimeout(()=>c.remove(),300);const{identity:b}=_(),E=b?.pubkey===e?"Self":Jr(b?.pubkey??"",t);H(`Duress stood down for ${i} by ${E}`,"success")}),l.appendChild(m),c.appendChild(l),document.body.appendChild(c),requestAnimationFrame(()=>c.classList.add("duress-overlay--visible"));function y(b){b.key==="Escape"&&(c.classList.remove("duress-overlay--visible"),setTimeout(()=>c.remove(),300),document.removeEventListener("keydown",y))}document.addEventListener("keydown",y)}document.addEventListener("canary:duress-clear",(e=>{const{subject:t,clearedBy:n}=e.detail;Av(t);const r=Array.from(document.querySelectorAll(".duress-overlay")).find(c=>c.dataset.subject===t);r&&(r.classList.remove("duress-overlay--visible"),setTimeout(()=>r.remove(),300));const o=e.detail.groupId,s=Jr(t,o),i=Jr(n,o);H(t===n?`${s} self-cleared their duress`:`${i} confirmed ${s} is safe`,"success")}));function Qo(e){const{groups:t,activeGroupId:n,identity:r}=_();if(r?.pubkey===e)return"You";if(!n)return e.slice(0,8)+"…";const o=t[n];if(!o)return e.slice(0,8)+"…";const s=o.memberNames?.[e];return s||e.slice(0,8)+"…"}function Tv(e,t){const n=[],r=new Set(t);for(;n.length<e;){const o=Math.floor(Math.random()*vs),s=_r(o).toLowerCase();r.has(s)||(r.add(s),n.push(s))}return n}function Lv(e){for(let t=e.length-1;t>0;t--){const n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}return e}function za(e,t){for(const s of e)iu(s,t,void 0,Math.floor(Date.now()/1e3),!0);document.dispatchEvent(new CustomEvent("canary:duress",{detail:{members:e},bubbles:!0}));const{groups:n}=_(),r=n[t];if(!r)return;const o=cv(r.seed);for(const s of e){const i=lv(s);dv(o,i).then(a=>{console.info("[canary] Duress alert encrypted:",a.slice(0,32)+"…")}),ke(t,{type:"duress-alert",lat:0,lon:0,timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID(),subject:s})}}function Nv(e){const{groups:t,activeGroupId:n}=_();if(!n){e.innerHTML="";return}const r=t[n];if(!r){e.innerHTML="";return}const{identity:o}=_(),s=r.members.filter(E=>E!==o?.pubkey);if(s.length===0){e.innerHTML=`
      <section class="panel verify-panel">
        <h2 class="panel__title">Verify Someone</h2>
        <p class="settings-hint">No other members to verify yet. Invite someone first.</p>
      </section>
    `;return}const i=s.map(E=>`<button class="verify-member-btn btn btn--outline" data-pubkey="${j(E)}" type="button">${j(Qo(E))}</button>`).join("");e.innerHTML=`
    <section class="panel verify-panel">
      <h2 class="panel__title">Verify Someone</h2>
      <p class="settings-hint">Who are you verifying?</p>

      <div class="verify-member-list" id="verify-member-list">
        ${i}
      </div>

      <div id="verify-choices-area" hidden>
        <p class="settings-hint" id="verify-prompt"></p>
        <div class="verify-choices" id="verify-choices"></div>
      </div>

      <details class="verify-fallback" style="margin-top: 0.75rem;">
        <summary class="settings-hint" style="cursor: pointer;">Type manually</summary>
        <div class="verify-form" style="margin-top: 0.5rem;">
          <input class="input" id="verify-input" type="text" placeholder="${r.encodingFormat==="pin"?"Enter PIN":"Enter word"}" autocomplete="off" spellcheck="false" />
          <button class="btn btn--primary" id="verify-btn" type="button">Verify</button>
        </div>
      </details>

      <div id="verify-result" class="verify-result" hidden></div>
      <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
        <button class="btn btn--ghost" id="verify-back" type="button" hidden>Verify another</button>
      </div>
    </section>
  `;const a=e.querySelector("#verify-member-list"),c=e.querySelector("#verify-choices-area"),l=e.querySelector("#verify-choices"),d=e.querySelector("#verify-prompt"),u=e.querySelector("#verify-result"),f=e.querySelector("#verify-back");function h(E){const{groups:L,activeGroupId:O}=_();if(!O)return;const N=L[O];if(!N)return;const $=Math.floor(Date.now()/1e3),w=bt($,N.rotationInterval)+N.usageOffset,v=Ot(N),g=Ee(N.seed,Tt,w,v,E).toLowerCase(),x=go(N.seed,Tt,E,w,v,N.tolerance)?.toLowerCase(),S=new Set([g]);x&&S.add(x);const k=Tv(x?2:3,S),R=Lv([g,...x?[x]:[],...k]),I=Qo(E);d.textContent=`Tap the word ${I} just said:`,u.hidden=!0,l.innerHTML=R.map(T=>`<button class="verify-choice" data-word="${j(T)}" type="button">${j(Rs(T,N.encodingFormat))}</button>`).join(""),a.hidden=!0,c.hidden=!1,l.querySelectorAll(".verify-choice").forEach(T=>{T.addEventListener("click",()=>p(T.dataset.word??"",T,E))})}function p(E,L,O){const{groups:N,activeGroupId:$}=_();if(!$)return;const w=N[$];if(!w)return;const v=bt(Math.floor(Date.now()/1e3),w.rotationInterval)+w.usageOffset,g=Es(w.seed,Tt,v,E,w.members,{encoding:Ot(w),tolerance:w.tolerance}),x=g.status==="valid",S=Qo(O);l.querySelectorAll(".verify-choice").forEach(A=>A.classList.remove("verify-choice--correct","verify-choice--wrong")),L.classList.add(x?"verify-choice--correct":"verify-choice--wrong"),u.hidden=!1,u.className=`verify-result verify-result--${x?"valid":"invalid"}`,u.textContent=x?`${S} is verified.`:`${S} gave the wrong word.`,f.hidden=!1,g.status==="duress"&&za(g.identities??[],$)}e.querySelectorAll(".verify-member-btn").forEach(E=>{E.addEventListener("click",()=>{const L=E.dataset.pubkey;L&&h(L)})}),f.addEventListener("click",()=>{a.hidden=!1,c.hidden=!0,u.hidden=!0,f.hidden=!0});const m=e.querySelector("#verify-input"),y=e.querySelector("#verify-btn");function b(){const E=m?.value.trim().toLowerCase().replace(/-/g,"")??"";if(!E)return;const{groups:L,activeGroupId:O}=_();if(!O)return;const N=L[O];if(!N)return;const $=bt(Math.floor(Date.now()/1e3),N.rotationInterval)+N.usageOffset,w=Es(N.seed,Tt,$,E,N.members,{encoding:Ot(N),tolerance:N.tolerance}),v=w.status==="valid";u.hidden=!1,u.className=`verify-result verify-result--${v?"valid":"invalid"}`,u.textContent=v?"Verified.":"Wrong word.",f.hidden=!1,w.status==="duress"&&za(w.identities??[],O)}y?.addEventListener("click",b),m?.addEventListener("keydown",E=>{E.key==="Enter"&&b()})}function au(e){const t=JSON.stringify(e),n=new TextEncoder().encode(t);let r="";for(let o=0;o<n.length;o++)r+=String.fromCharCode(n[o]);return btoa(r)}function So(e){const t=atob(e),n=new Uint8Array(t.length);for(let r=0;r<t.length;r++)n[r]=t.charCodeAt(r);return JSON.parse(new TextDecoder().decode(n))}function $v(e){return au(e).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function cu(e){let t=e.replace(/-/g,"+").replace(/_/g,"/");const n=t.length%4;return n===2?t+="==":n===3&&(t+="="),So(t)}function Mv(e){let t="";for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function Ov(e){let t=e.replace(/-/g,"+").replace(/_/g,"/");const n=t.length%4;n===2?t+="==":n===3&&(t+="=");const r=atob(t),o=new Uint8Array(r.length);for(let s=0;s<r.length;s++)o[s]=r.charCodeAt(s);return o}const lu=/^[0-9a-f]{64}$/,Bv=/^[0-9a-f]{128}$/,du=/^[0-9a-f]{32}$/;function uu(e){const{adminSig:t,...n}=e,r=Object.keys(n).sort().reduce((o,s)=>(o[s]=n[s],o),{});return new TextEncoder().encode(JSON.stringify(r))}function Pv(e){const{groupName:t,groupId:n,adminPubkey:r,adminPrivkey:o,relays:s,expiresInSec:i=86400}=e,a=new Uint8Array(16);crypto.getRandomValues(a);const c=Ve(a),l={groupName:t,groupId:n,adminPubkey:r,inviteId:c,expiresAt:Math.floor(Date.now()/1e3)+i,relays:[...s],adminSig:""},d=ve(uu(l));return l.adminSig=Ve(ee.sign(d,F(o))),l}function fu(e){if(e==null||typeof e!="object")throw new Error("Remote invite token must be a non-null object");const t=e;if(typeof t.groupName!="string"||t.groupName.length===0)throw new Error("groupName must be a non-empty string");if(typeof t.groupId!="string"||t.groupId.length===0)throw new Error("groupId must be a non-empty string");if(typeof t.adminPubkey!="string"||!lu.test(t.adminPubkey))throw new Error("adminPubkey must be a 64-character hex string");if(typeof t.inviteId!="string"||!du.test(t.inviteId))throw new Error("inviteId must be a 32-character hex string");if(typeof t.adminSig!="string"||!Bv.test(t.adminSig))throw new Error("adminSig must be a 128-character hex string");if(!Array.isArray(t.relays)||!t.relays.every(i=>typeof i=="string"))throw new Error("relays must be an array of strings");if(typeof t.expiresAt!="number"||!Number.isFinite(t.expiresAt))throw new Error("expiresAt must be a finite number");const n=Math.floor(Date.now()/1e3);if(t.expiresAt<=n)throw new Error("Remote invite token has expired");const r=e,o=ve(uu(r));if(!ee.verify(F(r.adminSig),o,F(r.adminPubkey)))throw new Error("Remote invite token signature is invalid")}function Uv(e){const{welcome:t,adminPrivkey:n,joinerPubkey:r}=e,o=JSON.stringify(t),s=we(F(n),r);return Pt(o,s)}function Dv(e){const{envelope:t,joinerPrivkey:n,adminPubkey:r,expectedInviteId:o}=e,s=we(F(n),r),i=Ut(t,s),a=JSON.parse(i);if(typeof a.inviteId!="string"||!du.test(a.inviteId))throw new Error("Welcome payload must include a valid inviteId");if(a.inviteId!==o)throw new Error("Welcome payload inviteId does not match the pending invite");if(typeof a.seed!="string"||!lu.test(a.seed))throw new Error("Welcome payload seed must be a 64-character hex string");if(typeof a.groupId!="string"||a.groupId.length===0)throw new Error("Welcome payload must include a non-empty groupId");return a}function jv(e){if(e.startsWith("wss://"))return!0;if(e.startsWith("ws://"))try{const t=new URL(e);return t.hostname==="localhost"||t.hostname==="127.0.0.1"||t.hostname==="[::1]"}catch{return!1}return!1}const In=/^[0-9a-f]{64}$/,hu=/^[0-9a-f]{128}$/,qv=/^[0-9a-f]{32}$/,Hv=10080*60,pu=300;function Vt(e){return typeof e=="number"&&Number.isInteger(e)&&e>=0}function Fv(){const e=new Uint8Array(16);return crypto.getRandomValues(e),Array.from(e).map(t=>t.toString(16).padStart(2,"0")).join("")}function Gv(e){const t=e;if(!t||typeof t!="object")throw new Error("Invalid invite payload — expected an object.");if(typeof t.groupId!="string"||t.groupId.length===0)throw new Error("Invalid invite payload — groupId is required.");if(typeof t.seed!="string"||!In.test(t.seed))throw new Error("Invalid invite payload — seed must be 64-char hex.");if(typeof t.groupName!="string"||t.groupName.trim().length===0)throw new Error("Invalid invite payload — groupName is required.");if(!Number.isInteger(t.rotationInterval)||t.rotationInterval<=0)throw new Error("Invalid invite payload — rotationInterval must be > 0.");if(t.wordCount!==1&&t.wordCount!==2&&t.wordCount!==3)throw new Error("Invalid invite payload — wordCount must be 1, 2, or 3.");if(typeof t.wordlist!="string"||t.wordlist.length===0)throw new Error("Invalid invite payload — wordlist is required.");if(!Vt(t.counter)||!Vt(t.usageOffset))throw new Error("Invalid invite payload — counter and usageOffset must be non-negative integers.");if(typeof t.nonce!="string"||!qv.test(t.nonce))throw new Error("Invalid invite payload — nonce must be 32-char hex.");if(!Number.isInteger(t.beaconInterval)||t.beaconInterval<=0)throw new Error("Invalid invite payload — beaconInterval must be > 0.");if(!Number.isInteger(t.beaconPrecision)||t.beaconPrecision<1||t.beaconPrecision>11)throw new Error("Invalid invite payload — beaconPrecision must be 1..11.");if(!Array.isArray(t.members)||!t.members.every(r=>typeof r=="string"&&In.test(r)))throw new Error("Invalid invite payload — members must be 64-char hex pubkeys.");if(!Array.isArray(t.relays)||!t.relays.every(r=>typeof r=="string"&&jv(r)))throw new Error("Invalid invite payload — relays must be wss:// URLs (or ws:// for localhost).");if(t.encodingFormat!=="words"&&t.encodingFormat!=="pin"&&t.encodingFormat!=="hex")throw new Error("Invalid invite payload — encodingFormat must be words|pin|hex.");if(!Vt(t.tolerance))throw new Error("Invalid invite payload — tolerance must be a non-negative integer.");if(t.tolerance>10)throw new Error("Invalid invite payload — tolerance must be <= 10.");if(!Vt(t.issuedAt)||!Vt(t.expiresAt))throw new Error("Invalid invite payload — issuedAt/expiresAt must be unix seconds.");if(t.expiresAt<=t.issuedAt)throw new Error("Invalid invite payload — expiresAt must be after issuedAt.");if(!Vt(t.epoch))throw new Error("Invalid invite payload — epoch must be a non-negative integer.");if(!Array.isArray(t.admins)||!t.admins.every(r=>typeof r=="string"&&In.test(r)))throw new Error("Invalid invite payload — admins must be 64-char hex pubkeys.");const n=new Set(t.members);if(!t.admins.every(r=>n.has(r)))throw new Error("Invalid invite payload — all admins must be in members.");if(t.protocolVersion===void 0||t.protocolVersion===null)throw new Error("Invalid invite payload — protocolVersion is required.");if(t.protocolVersion!==Re)throw new Error(`Unsupported invite protocol version: ${t.protocolVersion} (expected: ${Re})`);if(typeof t.inviterPubkey!="string"||!In.test(t.inviterPubkey))throw new Error("Invalid invite payload — inviterPubkey must be a 64-char hex pubkey.");if(!t.admins.includes(t.inviterPubkey))throw new Error("Invalid invite payload — inviterPubkey must be in admins.");if(typeof t.inviterSig!="string"||!hu.test(t.inviterSig))throw new Error("Invalid invite payload — inviterSig must be a 128-char hex Schnorr signature.")}function mu(e){const{inviterSig:t,memberNames:n,relays:r,...o}=e,s=Object.keys(o).sort().reduce((i,a)=>(i[a]=o[a],i),{});return new TextEncoder().encode(JSON.stringify(s))}function Kv(e,t){const n=mu(e),r=ve(n);return Ve(ee.sign(r,F(t)))}function Vv(e){const t=mu(e),n=ve(t);return ee.verify(F(e.inviterSig),n,F(e.inviterPubkey))}function yu(e){const{nonce:t,relays:n,memberNames:r,...o}=e,s=JSON.stringify(o),i=new TextEncoder,a=rt(F(t),i.encode(s)),c=a[0]<<25|a[1]<<17|a[2]<<9|a[3]<<1|a[4]>>7,l=c>>>22&2047,d=c>>>11&2047,u=c&2047;return`${_r(l)} ${_r(d)} ${_r(u)}`}function Wv(e){const{identity:t}=_();if(!t?.pubkey)throw new Error("No identity — sign in first.");if(!t.privkey)throw new Error("Invite creation requires a local key (nsec). NIP-07 extensions cannot sign invites.");if(!e.admins.includes(t.pubkey))throw new Error(`Not authorised — you are not an admin of "${e.name}".`);const n=Fv(),r=Math.floor(Date.now()/1e3),o={groupId:e.id,seed:e.seed,groupName:e.name,rotationInterval:e.rotationInterval,wordCount:e.wordCount,wordlist:e.wordlist,counter:e.counter,usageOffset:e.usageOffset,nonce:n,beaconInterval:e.beaconInterval,beaconPrecision:e.beaconPrecision,members:[...e.members],relays:[...e.writeRelays??e.relays??[]],encodingFormat:e.encodingFormat??"words",tolerance:e.tolerance??1,issuedAt:r,expiresAt:r+Hv,epoch:e.epoch??0,admins:[...e.admins??[]],protocolVersion:Re,inviterPubkey:t.pubkey,inviterSig:"",memberNames:{...e.memberNames}};o.inviterSig=Kv(o,t.privkey);const s=yu(o);return{payload:o,confirmCode:s}}function zv(e,t){let n;try{n=So(e)}catch{throw new Error("Invalid invite payload — could not decode.")}Gv(n);const r={groupId:n.groupId,seed:n.seed,groupName:n.groupName,rotationInterval:n.rotationInterval,wordCount:n.wordCount,wordlist:n.wordlist,counter:n.counter,usageOffset:n.usageOffset,nonce:n.nonce,beaconInterval:n.beaconInterval,beaconPrecision:n.beaconPrecision,members:[...n.members],relays:[...n.relays],encodingFormat:n.encodingFormat,tolerance:n.tolerance,issuedAt:n.issuedAt,expiresAt:n.expiresAt,epoch:n.epoch,admins:[...n.admins],protocolVersion:n.protocolVersion,inviterPubkey:n.inviterPubkey,inviterSig:n.inviterSig,memberNames:n.memberNames&&typeof n.memberNames=="object"?{...n.memberNames}:void 0};if(!Vv(r))throw new Error("Invite signature is invalid — the inviter could not prove control of the admin key.");if(!t?.trim())throw new Error("Confirmation code is required — ask the sender to read it to you.");const o=yu(r),s=t.trim().replace(/[-\s]+/g," ").toLowerCase(),i=o.toLowerCase();if(s!==i)throw new Error("Confirmation words do not match — invite may have been tampered with.");const a=Math.floor(Date.now()/1e3);if(r.expiresAt<=a)throw new Error("Invite has expired. Ask for a new invite.");if(r.issuedAt>a+pu)throw new Error("Invite timestamp is too far in the future — check your device clock.");return r}function Jv(e,t){const{groups:n}=_(),r=n[e];return r?Array.isArray(r.usedInvites)&&r.usedInvites.includes(t):!1}function Yv(e,t){const{groups:n}=_(),r=n[e];if(!r){console.warn(`[canary:invite] consumeInvite: unknown group id "${e}"`);return}J(e,{usedInvites:Array.from(new Set([...r.usedInvites,t]))})}const Zv=10080*60;function Xv(e){const t=Object.keys(e).sort().reduce((n,r)=>(n[r]=e[r],n),{});return new TextEncoder().encode(JSON.stringify(t))}function Qv(e,t){let n;try{n=So(e)}catch{return{valid:!1,error:"Invalid join token — could not decode."}}if(n.g!==t.groupId)return{valid:!1,error:"Join token is for a different group."};if(typeof n.p!="string"||!In.test(n.p))return{valid:!1,error:"Join token has invalid pubkey."};if(typeof n.s!="string"||!hu.test(n.s))return{valid:!1,error:"Join token has invalid signature."};const r=Math.floor(Date.now()/1e3);if(typeof n.t!="number"||n.t<r-Zv)return{valid:!1,error:"Join token has expired or is stale."};if(n.t>r+pu)return{valid:!1,error:"Join token timestamp is too far in the future."};const{s:o,...s}=n,i=ve(Xv(s));try{if(!ee.verify(F(n.s),i,F(n.p)))return{valid:!1,error:"Join token signature is invalid."}}catch{return{valid:!1,error:"Join token signature verification failed."}}const a=(n.w||"").toLowerCase(),c=t.tolerance??1;let l=!1;for(let d=t.counter-c;d<=t.counter+c;d++)if(!(d<0)&&a===Ee(t.groupSeed,t.context,d,t.encoding).toLowerCase()){l=!0;break}return l?{valid:!0,pubkey:n.p,displayName:n.n||"",word:n.w||""}:{valid:!1,error:"Join token word does not match — seed possession not proven."}}let Dn=null;function ew(e){const{identity:t}=_();if(!t?.pubkey)throw new Error("No identity — sign in first.");if(!t.privkey)throw new Error("Invite creation requires a local key (nsec). NIP-07 extensions cannot sign invites.");if(!e.admins.includes(t.pubkey))throw new Error(`Not authorised — you are not an admin of "${e.name}".`);const n=e.writeRelays?.length?[...e.writeRelays]:[..._().settings.defaultWriteRelays??_().settings.defaultRelays],r=Pv({groupName:e.name,groupId:e.id,adminPubkey:t.pubkey,adminPrivkey:t.privkey,relays:n}),o=$v(r);return Dn={groupId:e.id,tokenPayload:o,inviteId:r.inviteId},Dn}function Ja(e,t){const{identity:n}=_();if(!n?.privkey)throw new Error("No local identity — cannot create welcome envelope.");if(!Dn)throw new Error("No active remote invite session — cannot create welcome envelope.");const r={inviteId:Dn.inviteId,seed:e.seed,counter:e.counter,usageOffset:e.usageOffset,epoch:e.epoch??0,wordCount:e.wordCount,rotationInterval:e.rotationInterval,groupId:e.id,groupName:e.name,wordlist:e.wordlist,beaconInterval:e.beaconInterval,beaconPrecision:e.beaconPrecision,encodingFormat:e.encodingFormat??"words",tolerance:e.tolerance??1,members:[...e.members],admins:[...e.admins??[]],relays:[...e.writeRelays??e.relays??[]],memberNames:e.memberNames?{...e.memberNames}:void 0};return Uv({welcome:r,adminPrivkey:n.privkey,joinerPubkey:t})}function wn(){Dn=null}function En(e){const t=new Uint8Array(e.length/2);for(let n=0;n<t.length;n++)t[n]=parseInt(e.substring(n*2,n*2+2),16);return t}function kn(e){let t="";for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,"0");return t}const tw={words:0,pin:1,hex:2},nw={0:"words",1:"pin",2:"hex"},rw={"en-v1":0},ow={0:"en-v1"},gu=1,Ya=new TextEncoder,Za=new TextDecoder;function sw(e){const t=Ya.encode(e.groupId),n=Ya.encode(e.groupName),r=e.admins.map(d=>{const u=e.members.indexOf(d);if(u===-1)throw new Error(`Admin ${d} not found in members array`);return u}),s=177+1+e.members.length*32+1+r.length+1+t.length+1+n.length,i=new ArrayBuffer(s),a=new DataView(i),c=new Uint8Array(i);let l=0;a.setUint8(l,gu),l+=1,c.set(En(e.seed),l),l+=32,c.set(En(e.inviterPubkey),l),l+=32,c.set(En(e.inviterSig),l),l+=64,c.set(En(e.nonce),l),l+=16,a.setUint32(l,e.counter),l+=4,a.setUint16(l,e.usageOffset),l+=2,a.setUint32(l,e.epoch),l+=4,a.setUint32(l,e.rotationInterval),l+=4,a.setUint32(l,e.beaconInterval),l+=4,a.setUint8(l,e.beaconPrecision),l+=1,a.setUint8(l,e.wordCount),l+=1,a.setUint8(l,e.tolerance),l+=1,a.setUint8(l,tw[e.encodingFormat]??0),l+=1,a.setUint8(l,rw[e.wordlist]??0),l+=1,a.setUint32(l,e.issuedAt),l+=4,a.setUint32(l,e.expiresAt),l+=4,a.setUint8(l,e.protocolVersion),l+=1,a.setUint8(l,e.members.length),l+=1;for(const d of e.members)c.set(En(d),l),l+=32;a.setUint8(l,r.length),l+=1;for(const d of r)a.setUint8(l,d),l+=1;return a.setUint8(l,t.length),l+=1,c.set(t,l),l+=t.length,a.setUint8(l,n.length),l+=1,c.set(n,l),l+=n.length,c}function iw(e){const t=new DataView(e.buffer,e.byteOffset,e.byteLength);let n=0;const r=t.getUint8(n);if(n+=1,r!==gu)throw new Error(`Unsupported binary invite version: ${r}`);const o=kn(e.slice(n,n+32));n+=32;const s=kn(e.slice(n,n+32));n+=32;const i=kn(e.slice(n,n+64));n+=64;const a=kn(e.slice(n,n+16));n+=16;const c=t.getUint32(n);n+=4;const l=t.getUint16(n);n+=2;const d=t.getUint32(n);n+=4;const u=t.getUint32(n);n+=4;const f=t.getUint32(n);n+=4;const h=t.getUint8(n);n+=1;const p=t.getUint8(n);n+=1;const m=t.getUint8(n);n+=1;const y=nw[t.getUint8(n)]??"words";n+=1;const b=ow[t.getUint8(n)]??"en-v1";n+=1;const E=t.getUint32(n);n+=4;const L=t.getUint32(n);n+=4;const O=t.getUint8(n);n+=1;const N=t.getUint8(n);n+=1;const $=[];for(let k=0;k<N;k++)$.push(kn(e.slice(n,n+32))),n+=32;const w=t.getUint8(n);n+=1;const v=[];for(let k=0;k<w;k++){const R=t.getUint8(n);if(n+=1,R>=$.length)throw new Error(`Invalid admin index ${R} in binary invite (${$.length} members)`);v.push($[R])}const g=t.getUint8(n);n+=1;const x=Za.decode(e.slice(n,n+g));n+=g;const S=t.getUint8(n);n+=1;const A=Za.decode(e.slice(n,n+S));return n+=S,{groupId:x,seed:o,groupName:A,rotationInterval:u,wordCount:p,wordlist:b,counter:c,usageOffset:l,nonce:a,beaconInterval:f,beaconPrecision:h,members:$,relays:[],encodingFormat:y,tolerance:m,issuedAt:E,expiresAt:L,epoch:d,admins:v,protocolVersion:O,inviterPubkey:s,inviterSig:i}}const hn=function(e,t){let o=e;const s=Rn[t];let i=null,a=0,c=null;const l=[],d={},u=function(w,v){a=o*4+17,i=(function(g){const x=new Array(g);for(let S=0;S<g;S+=1){x[S]=new Array(g);for(let A=0;A<g;A+=1)x[S][A]=null}return x})(a),f(0,0),f(a-7,0),f(0,a-7),m(),p(),b(w,v),o>=7&&y(w),c==null&&(c=O(o,s,l)),E(c,v)},f=function(w,v){for(let g=-1;g<=7;g+=1)if(!(w+g<=-1||a<=w+g))for(let x=-1;x<=7;x+=1)v+x<=-1||a<=v+x||(0<=g&&g<=6&&(x==0||x==6)||0<=x&&x<=6&&(g==0||g==6)||2<=g&&g<=4&&2<=x&&x<=4?i[w+g][v+x]=!0:i[w+g][v+x]=!1)},h=function(){let w=0,v=0;for(let g=0;g<8;g+=1){u(!0,g);const x=ft.getLostPoint(d);(g==0||w>x)&&(w=x,v=g)}return v},p=function(){for(let w=8;w<a-8;w+=1)i[w][6]==null&&(i[w][6]=w%2==0);for(let w=8;w<a-8;w+=1)i[6][w]==null&&(i[6][w]=w%2==0)},m=function(){const w=ft.getPatternPosition(o);for(let v=0;v<w.length;v+=1)for(let g=0;g<w.length;g+=1){const x=w[v],S=w[g];if(i[x][S]==null)for(let A=-2;A<=2;A+=1)for(let k=-2;k<=2;k+=1)A==-2||A==2||k==-2||k==2||A==0&&k==0?i[x+A][S+k]=!0:i[x+A][S+k]=!1}},y=function(w){const v=ft.getBCHTypeNumber(o);for(let g=0;g<18;g+=1){const x=!w&&(v>>g&1)==1;i[Math.floor(g/3)][g%3+a-8-3]=x}for(let g=0;g<18;g+=1){const x=!w&&(v>>g&1)==1;i[g%3+a-8-3][Math.floor(g/3)]=x}},b=function(w,v){const g=s<<3|v,x=ft.getBCHTypeInfo(g);for(let S=0;S<15;S+=1){const A=!w&&(x>>S&1)==1;S<6?i[S][8]=A:S<8?i[S+1][8]=A:i[a-15+S][8]=A}for(let S=0;S<15;S+=1){const A=!w&&(x>>S&1)==1;S<8?i[8][a-S-1]=A:S<9?i[8][15-S-1+1]=A:i[8][15-S-1]=A}i[a-8][8]=!w},E=function(w,v){let g=-1,x=a-1,S=7,A=0;const k=ft.getMaskFunction(v);for(let R=a-1;R>0;R-=2)for(R==6&&(R-=1);;){for(let I=0;I<2;I+=1)if(i[x][R-I]==null){let T=!1;A<w.length&&(T=(w[A]>>>S&1)==1),k(x,R-I)&&(T=!T),i[x][R-I]=T,S-=1,S==-1&&(A+=1,S=7)}if(x+=g,x<0||a<=x){x-=g,g=-g;break}}},L=function(w,v){let g=0,x=0,S=0;const A=new Array(v.length),k=new Array(v.length);for(let C=0;C<v.length;C+=1){const M=v[C].dataCount,B=v[C].totalCount-M;x=Math.max(x,M),S=Math.max(S,B),A[C]=new Array(M);for(let K=0;K<A[C].length;K+=1)A[C][K]=255&w.getBuffer()[K+g];g+=M;const P=ft.getErrorCorrectPolynomial(B),D=jn(A[C],P.getLength()-1).mod(P);k[C]=new Array(P.getLength()-1);for(let K=0;K<k[C].length;K+=1){const Y=K+D.getLength()-k[C].length;k[C][K]=Y>=0?D.getAt(Y):0}}let R=0;for(let C=0;C<v.length;C+=1)R+=v[C].totalCount;const I=new Array(R);let T=0;for(let C=0;C<x;C+=1)for(let M=0;M<v.length;M+=1)C<A[M].length&&(I[T]=A[M][C],T+=1);for(let C=0;C<S;C+=1)for(let M=0;M<v.length;M+=1)C<k[M].length&&(I[T]=k[M][C],T+=1);return I},O=function(w,v,g){const x=Xa.getRSBlocks(w,v),S=Qa();for(let k=0;k<g.length;k+=1){const R=g[k];S.put(R.getMode(),4),S.put(R.getLength(),ft.getLengthInBits(R.getMode(),w)),R.write(S)}let A=0;for(let k=0;k<x.length;k+=1)A+=x[k].dataCount;if(S.getLengthInBits()>A*8)throw"code length overflow. ("+S.getLengthInBits()+">"+A*8+")";for(S.getLengthInBits()+4<=A*8&&S.put(0,4);S.getLengthInBits()%8!=0;)S.putBit(!1);for(;!(S.getLengthInBits()>=A*8||(S.put(236,8),S.getLengthInBits()>=A*8));)S.put(17,8);return L(S,x)};d.addData=function(w,v){v=v||"Byte";let g=null;switch(v){case"Numeric":g=aw(w);break;case"Alphanumeric":g=cw(w);break;case"Byte":g=lw(w);break;case"Kanji":g=dw(w);break;default:throw"mode:"+v}l.push(g),c=null},d.isDark=function(w,v){if(w<0||a<=w||v<0||a<=v)throw w+","+v;return i[w][v]},d.getModuleCount=function(){return a},d.make=function(){if(o<1){let w=1;for(;w<40;w++){const v=Xa.getRSBlocks(w,s),g=Qa();for(let S=0;S<l.length;S++){const A=l[S];g.put(A.getMode(),4),g.put(A.getLength(),ft.getLengthInBits(A.getMode(),w)),A.write(g)}let x=0;for(let S=0;S<v.length;S++)x+=v[S].dataCount;if(g.getLengthInBits()<=x*8)break}o=w}u(!1,h())},d.createTableTag=function(w,v){w=w||2,v=typeof v>"u"?w*4:v;let g="";g+='<table style="',g+=" border-width: 0px; border-style: none;",g+=" border-collapse: collapse;",g+=" padding: 0px; margin: "+v+"px;",g+='">',g+="<tbody>";for(let x=0;x<d.getModuleCount();x+=1){g+="<tr>";for(let S=0;S<d.getModuleCount();S+=1)g+='<td style="',g+=" border-width: 0px; border-style: none;",g+=" border-collapse: collapse;",g+=" padding: 0px; margin: 0px;",g+=" width: "+w+"px;",g+=" height: "+w+"px;",g+=" background-color: ",g+=d.isDark(x,S)?"#000000":"#ffffff",g+=";",g+='"/>';g+="</tr>"}return g+="</tbody>",g+="</table>",g},d.createSvgTag=function(w,v,g,x){let S={};typeof arguments[0]=="object"&&(S=arguments[0],w=S.cellSize,v=S.margin,g=S.alt,x=S.title),w=w||2,v=typeof v>"u"?w*4:v,g=typeof g=="string"?{text:g}:g||{},g.text=g.text||null,g.id=g.text?g.id||"qrcode-description":null,x=typeof x=="string"?{text:x}:x||{},x.text=x.text||null,x.id=x.text?x.id||"qrcode-title":null;const A=d.getModuleCount()*w+v*2;let k,R,I,T,C="",M;for(M="l"+w+",0 0,"+w+" -"+w+",0 0,-"+w+"z ",C+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',C+=S.scalable?"":' width="'+A+'px" height="'+A+'px"',C+=' viewBox="0 0 '+A+" "+A+'" ',C+=' preserveAspectRatio="xMinYMin meet"',C+=x.text||g.text?' role="img" aria-labelledby="'+N([x.id,g.id].join(" ").trim())+'"':"",C+=">",C+=x.text?'<title id="'+N(x.id)+'">'+N(x.text)+"</title>":"",C+=g.text?'<description id="'+N(g.id)+'">'+N(g.text)+"</description>":"",C+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',C+='<path d="',I=0;I<d.getModuleCount();I+=1)for(T=I*w+v,k=0;k<d.getModuleCount();k+=1)d.isDark(I,k)&&(R=k*w+v,C+="M"+R+","+T+M);return C+='" stroke="transparent" fill="black"/>',C+="</svg>",C},d.createDataURL=function(w,v){w=w||2,v=typeof v>"u"?w*4:v;const g=d.getModuleCount()*w+v*2,x=v,S=g-v;return pw(g,g,function(A,k){if(x<=A&&A<S&&x<=k&&k<S){const R=Math.floor((A-x)/w),I=Math.floor((k-x)/w);return d.isDark(I,R)?0:1}else return 1})},d.createImgTag=function(w,v,g){w=w||2,v=typeof v>"u"?w*4:v;const x=d.getModuleCount()*w+v*2;let S="";return S+="<img",S+=' src="',S+=d.createDataURL(w,v),S+='"',S+=' width="',S+=x,S+='"',S+=' height="',S+=x,S+='"',g&&(S+=' alt="',S+=N(g),S+='"'),S+="/>",S};const N=function(w){let v="";for(let g=0;g<w.length;g+=1){const x=w.charAt(g);switch(x){case"<":v+="&lt;";break;case">":v+="&gt;";break;case"&":v+="&amp;";break;case'"':v+="&quot;";break;default:v+=x;break}}return v},$=function(w){w=typeof w>"u"?2:w;const g=d.getModuleCount()*1+w*2,x=w,S=g-w;let A,k,R,I,T;const C={"██":"█","█ ":"▀"," █":"▄","  ":" "},M={"██":"▀","█ ":"▀"," █":" ","  ":" "};let B="";for(A=0;A<g;A+=2){for(R=Math.floor((A-x)/1),I=Math.floor((A+1-x)/1),k=0;k<g;k+=1)T="█",x<=k&&k<S&&x<=A&&A<S&&d.isDark(R,Math.floor((k-x)/1))&&(T=" "),x<=k&&k<S&&x<=A+1&&A+1<S&&d.isDark(I,Math.floor((k-x)/1))?T+=" ":T+="█",B+=w<1&&A+1>=S?M[T]:C[T];B+=`
`}return g%2&&w>0?B.substring(0,B.length-g-1)+Array(g+1).join("▀"):B.substring(0,B.length-1)};return d.createASCII=function(w,v){if(w=w||1,w<2)return $(v);w-=1,v=typeof v>"u"?w*2:v;const g=d.getModuleCount()*w+v*2,x=v,S=g-v;let A,k,R,I;const T=Array(w+1).join("██"),C=Array(w+1).join("  ");let M="",B="";for(A=0;A<g;A+=1){for(R=Math.floor((A-x)/w),B="",k=0;k<g;k+=1)I=1,x<=k&&k<S&&x<=A&&A<S&&d.isDark(R,Math.floor((k-x)/w))&&(I=0),B+=I?T:C;for(R=0;R<w;R+=1)M+=B+`
`}return M.substring(0,M.length-1)},d.renderTo2dContext=function(w,v){v=v||2;const g=d.getModuleCount();for(let x=0;x<g;x++)for(let S=0;S<g;S++)w.fillStyle=d.isDark(x,S)?"black":"white",w.fillRect(S*v,x*v,v,v)},d};hn.stringToBytes=function(e){const t=[];for(let n=0;n<e.length;n+=1){const r=e.charCodeAt(n);t.push(r&255)}return t};hn.createStringToBytes=function(e,t){const n=(function(){const o=fw(e),s=function(){const c=o.read();if(c==-1)throw"eof";return c};let i=0;const a={};for(;;){const c=o.read();if(c==-1)break;const l=s(),d=s(),u=s(),f=String.fromCharCode(c<<8|l),h=d<<8|u;a[f]=h,i+=1}if(i!=t)throw i+" != "+t;return a})(),r=63;return function(o){const s=[];for(let i=0;i<o.length;i+=1){const a=o.charCodeAt(i);if(a<128)s.push(a);else{const c=n[o.charAt(i)];typeof c=="number"?(c&255)==c?s.push(c):(s.push(c>>>8),s.push(c&255)):s.push(r)}}return s}};const ue={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},Rn={L:1,M:0,Q:3,H:2},ut={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},ft=(function(){const e=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],t=1335,n=7973,r=21522,o={},s=function(i){let a=0;for(;i!=0;)a+=1,i>>>=1;return a};return o.getBCHTypeInfo=function(i){let a=i<<10;for(;s(a)-s(t)>=0;)a^=t<<s(a)-s(t);return(i<<10|a)^r},o.getBCHTypeNumber=function(i){let a=i<<12;for(;s(a)-s(n)>=0;)a^=n<<s(a)-s(n);return i<<12|a},o.getPatternPosition=function(i){return e[i-1]},o.getMaskFunction=function(i){switch(i){case ut.PATTERN000:return function(a,c){return(a+c)%2==0};case ut.PATTERN001:return function(a,c){return a%2==0};case ut.PATTERN010:return function(a,c){return c%3==0};case ut.PATTERN011:return function(a,c){return(a+c)%3==0};case ut.PATTERN100:return function(a,c){return(Math.floor(a/2)+Math.floor(c/3))%2==0};case ut.PATTERN101:return function(a,c){return a*c%2+a*c%3==0};case ut.PATTERN110:return function(a,c){return(a*c%2+a*c%3)%2==0};case ut.PATTERN111:return function(a,c){return(a*c%3+(a+c)%2)%2==0};default:throw"bad maskPattern:"+i}},o.getErrorCorrectPolynomial=function(i){let a=jn([1],0);for(let c=0;c<i;c+=1)a=a.multiply(jn([1,ht.gexp(c)],0));return a},o.getLengthInBits=function(i,a){if(1<=a&&a<10)switch(i){case ue.MODE_NUMBER:return 10;case ue.MODE_ALPHA_NUM:return 9;case ue.MODE_8BIT_BYTE:return 8;case ue.MODE_KANJI:return 8;default:throw"mode:"+i}else if(a<27)switch(i){case ue.MODE_NUMBER:return 12;case ue.MODE_ALPHA_NUM:return 11;case ue.MODE_8BIT_BYTE:return 16;case ue.MODE_KANJI:return 10;default:throw"mode:"+i}else if(a<41)switch(i){case ue.MODE_NUMBER:return 14;case ue.MODE_ALPHA_NUM:return 13;case ue.MODE_8BIT_BYTE:return 16;case ue.MODE_KANJI:return 12;default:throw"mode:"+i}else throw"type:"+a},o.getLostPoint=function(i){const a=i.getModuleCount();let c=0;for(let u=0;u<a;u+=1)for(let f=0;f<a;f+=1){let h=0;const p=i.isDark(u,f);for(let m=-1;m<=1;m+=1)if(!(u+m<0||a<=u+m))for(let y=-1;y<=1;y+=1)f+y<0||a<=f+y||m==0&&y==0||p==i.isDark(u+m,f+y)&&(h+=1);h>5&&(c+=3+h-5)}for(let u=0;u<a-1;u+=1)for(let f=0;f<a-1;f+=1){let h=0;i.isDark(u,f)&&(h+=1),i.isDark(u+1,f)&&(h+=1),i.isDark(u,f+1)&&(h+=1),i.isDark(u+1,f+1)&&(h+=1),(h==0||h==4)&&(c+=3)}for(let u=0;u<a;u+=1)for(let f=0;f<a-6;f+=1)i.isDark(u,f)&&!i.isDark(u,f+1)&&i.isDark(u,f+2)&&i.isDark(u,f+3)&&i.isDark(u,f+4)&&!i.isDark(u,f+5)&&i.isDark(u,f+6)&&(c+=40);for(let u=0;u<a;u+=1)for(let f=0;f<a-6;f+=1)i.isDark(f,u)&&!i.isDark(f+1,u)&&i.isDark(f+2,u)&&i.isDark(f+3,u)&&i.isDark(f+4,u)&&!i.isDark(f+5,u)&&i.isDark(f+6,u)&&(c+=40);let l=0;for(let u=0;u<a;u+=1)for(let f=0;f<a;f+=1)i.isDark(f,u)&&(l+=1);const d=Math.abs(100*l/a/a-50)/5;return c+=d*10,c},o})(),ht=(function(){const e=new Array(256),t=new Array(256);for(let r=0;r<8;r+=1)e[r]=1<<r;for(let r=8;r<256;r+=1)e[r]=e[r-4]^e[r-5]^e[r-6]^e[r-8];for(let r=0;r<255;r+=1)t[e[r]]=r;const n={};return n.glog=function(r){if(r<1)throw"glog("+r+")";return t[r]},n.gexp=function(r){for(;r<0;)r+=255;for(;r>=256;)r-=255;return e[r]},n})(),jn=function(e,t){if(typeof e.length>"u")throw e.length+"/"+t;const n=(function(){let o=0;for(;o<e.length&&e[o]==0;)o+=1;const s=new Array(e.length-o+t);for(let i=0;i<e.length-o;i+=1)s[i]=e[i+o];return s})(),r={};return r.getAt=function(o){return n[o]},r.getLength=function(){return n.length},r.multiply=function(o){const s=new Array(r.getLength()+o.getLength()-1);for(let i=0;i<r.getLength();i+=1)for(let a=0;a<o.getLength();a+=1)s[i+a]^=ht.gexp(ht.glog(r.getAt(i))+ht.glog(o.getAt(a)));return jn(s,0)},r.mod=function(o){if(r.getLength()-o.getLength()<0)return r;const s=ht.glog(r.getAt(0))-ht.glog(o.getAt(0)),i=new Array(r.getLength());for(let a=0;a<r.getLength();a+=1)i[a]=r.getAt(a);for(let a=0;a<o.getLength();a+=1)i[a]^=ht.gexp(ht.glog(o.getAt(a))+s);return jn(i,0).mod(o)},r},Xa=(function(){const e=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(o,s){const i={};return i.totalCount=o,i.dataCount=s,i},n={},r=function(o,s){switch(s){case Rn.L:return e[(o-1)*4+0];case Rn.M:return e[(o-1)*4+1];case Rn.Q:return e[(o-1)*4+2];case Rn.H:return e[(o-1)*4+3];default:return}};return n.getRSBlocks=function(o,s){const i=r(o,s);if(typeof i>"u")throw"bad rs block @ typeNumber:"+o+"/errorCorrectionLevel:"+s;const a=i.length/3,c=[];for(let l=0;l<a;l+=1){const d=i[l*3+0],u=i[l*3+1],f=i[l*3+2];for(let h=0;h<d;h+=1)c.push(t(u,f))}return c},n})(),Qa=function(){const e=[];let t=0;const n={};return n.getBuffer=function(){return e},n.getAt=function(r){const o=Math.floor(r/8);return(e[o]>>>7-r%8&1)==1},n.put=function(r,o){for(let s=0;s<o;s+=1)n.putBit((r>>>o-s-1&1)==1)},n.getLengthInBits=function(){return t},n.putBit=function(r){const o=Math.floor(t/8);e.length<=o&&e.push(0),r&&(e[o]|=128>>>t%8),t+=1},n},aw=function(e){const t=ue.MODE_NUMBER,n=e,r={};r.getMode=function(){return t},r.getLength=function(i){return n.length},r.write=function(i){const a=n;let c=0;for(;c+2<a.length;)i.put(o(a.substring(c,c+3)),10),c+=3;c<a.length&&(a.length-c==1?i.put(o(a.substring(c,c+1)),4):a.length-c==2&&i.put(o(a.substring(c,c+2)),7))};const o=function(i){let a=0;for(let c=0;c<i.length;c+=1)a=a*10+s(i.charAt(c));return a},s=function(i){if("0"<=i&&i<="9")return i.charCodeAt(0)-48;throw"illegal char :"+i};return r},cw=function(e){const t=ue.MODE_ALPHA_NUM,n=e,r={};r.getMode=function(){return t},r.getLength=function(s){return n.length},r.write=function(s){const i=n;let a=0;for(;a+1<i.length;)s.put(o(i.charAt(a))*45+o(i.charAt(a+1)),11),a+=2;a<i.length&&s.put(o(i.charAt(a)),6)};const o=function(s){if("0"<=s&&s<="9")return s.charCodeAt(0)-48;if("A"<=s&&s<="Z")return s.charCodeAt(0)-65+10;switch(s){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+s}};return r},lw=function(e){const t=ue.MODE_8BIT_BYTE,n=hn.stringToBytes(e),r={};return r.getMode=function(){return t},r.getLength=function(o){return n.length},r.write=function(o){for(let s=0;s<n.length;s+=1)o.put(n[s],8)},r},dw=function(e){const t=ue.MODE_KANJI,n=hn.stringToBytes;(function(s,i){const a=n(s);if(a.length!=2||(a[0]<<8|a[1])!=i)throw"sjis not supported."})("友",38726);const r=n(e),o={};return o.getMode=function(){return t},o.getLength=function(s){return~~(r.length/2)},o.write=function(s){const i=r;let a=0;for(;a+1<i.length;){let c=(255&i[a])<<8|255&i[a+1];if(33088<=c&&c<=40956)c-=33088;else if(57408<=c&&c<=60351)c-=49472;else throw"illegal char at "+(a+1)+"/"+c;c=(c>>>8&255)*192+(c&255),s.put(c,13),a+=2}if(a<i.length)throw"illegal char at "+(a+1)},o},bu=function(){const e=[],t={};return t.writeByte=function(n){e.push(n&255)},t.writeShort=function(n){t.writeByte(n),t.writeByte(n>>>8)},t.writeBytes=function(n,r,o){r=r||0,o=o||n.length;for(let s=0;s<o;s+=1)t.writeByte(n[s+r])},t.writeString=function(n){for(let r=0;r<n.length;r+=1)t.writeByte(n.charCodeAt(r))},t.toByteArray=function(){return e},t.toString=function(){let n="";n+="[";for(let r=0;r<e.length;r+=1)r>0&&(n+=","),n+=e[r];return n+="]",n},t},uw=function(){let e=0,t=0,n=0,r="";const o={},s=function(a){r+=String.fromCharCode(i(a&63))},i=function(a){if(a<0)throw"n:"+a;if(a<26)return 65+a;if(a<52)return 97+(a-26);if(a<62)return 48+(a-52);if(a==62)return 43;if(a==63)return 47;throw"n:"+a};return o.writeByte=function(a){for(e=e<<8|a&255,t+=8,n+=1;t>=6;)s(e>>>t-6),t-=6},o.flush=function(){if(t>0&&(s(e<<6-t),e=0,t=0),n%3!=0){const a=3-n%3;for(let c=0;c<a;c+=1)r+="="}},o.toString=function(){return r},o},fw=function(e){const t=e;let n=0,r=0,o=0;const s={};s.read=function(){for(;o<8;){if(n>=t.length){if(o==0)return-1;throw"unexpected end of file./"+o}const c=t.charAt(n);if(n+=1,c=="=")return o=0,-1;if(c.match(/^\s$/))continue;r=r<<6|i(c.charCodeAt(0)),o+=6}const a=r>>>o-8&255;return o-=8,a};const i=function(a){if(65<=a&&a<=90)return a-65;if(97<=a&&a<=122)return a-97+26;if(48<=a&&a<=57)return a-48+52;if(a==43)return 62;if(a==47)return 63;throw"c:"+a};return s},hw=function(e,t){const n=e,r=t,o=new Array(e*t),s={};s.setPixel=function(l,d,u){o[d*n+l]=u},s.write=function(l){l.writeString("GIF87a"),l.writeShort(n),l.writeShort(r),l.writeByte(128),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(255),l.writeByte(255),l.writeByte(255),l.writeString(","),l.writeShort(0),l.writeShort(0),l.writeShort(n),l.writeShort(r),l.writeByte(0);const d=2,u=a(d);l.writeByte(d);let f=0;for(;u.length-f>255;)l.writeByte(255),l.writeBytes(u,f,255),f+=255;l.writeByte(u.length-f),l.writeBytes(u,f,u.length-f),l.writeByte(0),l.writeString(";")};const i=function(l){const d=l;let u=0,f=0;const h={};return h.write=function(p,m){if(p>>>m)throw"length over";for(;u+m>=8;)d.writeByte(255&(p<<u|f)),m-=8-u,p>>>=8-u,f=0,u=0;f=p<<u|f,u=u+m},h.flush=function(){u>0&&d.writeByte(f)},h},a=function(l){const d=1<<l,u=(1<<l)+1;let f=l+1;const h=c();for(let E=0;E<d;E+=1)h.add(String.fromCharCode(E));h.add(String.fromCharCode(d)),h.add(String.fromCharCode(u));const p=bu(),m=i(p);m.write(d,f);let y=0,b=String.fromCharCode(o[y]);for(y+=1;y<o.length;){const E=String.fromCharCode(o[y]);y+=1,h.contains(b+E)?b=b+E:(m.write(h.indexOf(b),f),h.size()<4095&&(h.size()==1<<f&&(f+=1),h.add(b+E)),b=E)}return m.write(h.indexOf(b),f),m.write(u,f),m.flush(),p.toByteArray()},c=function(){const l={};let d=0;const u={};return u.add=function(f){if(u.contains(f))throw"dup key:"+f;l[f]=d,d+=1},u.size=function(){return d},u.indexOf=function(f){return l[f]},u.contains=function(f){return typeof l[f]<"u"},u};return s},pw=function(e,t,n){const r=hw(e,t);for(let a=0;a<t;a+=1)for(let c=0;c<e;c+=1)r.setPixel(c,a,n(c,a));const o=bu();r.write(o);const s=uw(),i=o.toByteArray();for(let a=0;a<i.length;a+=1)s.writeByte(i[a]);return s.flush(),"data:image/gif;base64,"+s};hn.stringToBytes;function mw(e,t=4){const n=hn(0,"L");return n.addData(e),n.make(),n.createSvgTag({cellSize:t,margin:2,scalable:!0})}const Yr=25519;function vu(e){const t=fe(),{identity:n}=_();if(!t||!n?.pubkey||!n?.privkey)return e.onError("No relay pool or identity available."),()=>{};const{inviteId:r,adminPubkey:o,readRelays:s,writeRelays:i,onWelcome:a,onError:c}=e,l=n.privkey;n.pubkey;const d=Array.from(new Set([...s,...i])),u=we(F(l),o),f=JSON.stringify({type:"join-request",inviteId:r}),h=Pt(f,u),p=st({kind:Yr,created_at:Math.floor(Date.now()/1e3),tags:[["d",r],["p",o]],content:h},F(l));Promise.allSettled(t.publish(i,p)).catch(()=>{});const m=t.subscribeMany(d,{kinds:[Yr],"#d":[r],authors:[o]},{onevent(b){try{const E=Ut(b.content,u),L=JSON.parse(E);L.type==="welcome"&&L.inviteId===r&&L.envelope&&(a(L.envelope),m.close())}catch{}},oneose(){}}),y=setTimeout(()=>{m.close(),c("Timed out waiting for welcome message from admin.")},12e4);return()=>{clearTimeout(y),m.close()}}function yw(e){const t=fe(),{identity:n}=_();if(!t||!n?.pubkey||!n?.privkey)return e.onError("No relay pool or identity available."),()=>{};const{inviteId:r,readRelays:o,writeRelays:s,onJoinRequest:i,onError:a}=e,c=n.privkey,l=Array.from(new Set([...o,...s])),d=t.subscribeMany(l,{kinds:[Yr],"#d":[r],"#p":[n.pubkey]},{onevent(f){try{const h=we(F(c),f.pubkey),p=Ut(f.content,h),m=JSON.parse(p);m.type==="join-request"&&m.inviteId===r&&i(f.pubkey)}catch{}},oneose(){}}),u=setTimeout(()=>{d.close(),a("Timed out waiting for join request.")},3e5);return()=>{clearTimeout(u),d.close()}}function gw(e){const t=fe(),{identity:n}=_();if(!t||!n?.privkey)return;const{inviteId:r,joinerPubkey:o,envelope:s,writeRelays:i}=e,a=we(F(n.privkey),o),c=JSON.stringify({type:"welcome",inviteId:r,envelope:s}),l=Pt(c,a),d=st({kind:Yr,created_at:Math.floor(Date.now()/1e3),tags:[["d",r],["p",o]],content:l},F(n.privkey));Promise.allSettled(t.publish(i,d)).catch(()=>{})}const wu=35520;function bw(e){const t=fe(),{identity:n}=_();if(!t||!n?.privkey)return;const{token:r,writeRelays:o}=e,s=JSON.stringify(r),i=String(Math.floor(Date.now()/1e3)+10080*60),a=st({kind:wu,created_at:Math.floor(Date.now()/1e3),tags:[["d",r.inviteId],["expiration",i]],content:s},F(n.privkey));Promise.allSettled(t.publish(o,a)).catch(()=>{})}function vw(e){const t=fe();if(!t)return e.onError("No relay pool available."),()=>{};const{inviteId:n,readRelays:r,onToken:o,onError:s}=e;let i=!1;const a=t.subscribeMany(r,{kinds:[wu],"#d":[n]},{onevent(l){if(!i)try{const d=JSON.parse(l.content);d.inviteId===n&&(i=!0,o(d),a.close())}catch{}},oneose(){i||(a.close(),s("Invite not found on relay — it may have expired."))}}),c=setTimeout(()=>{i||(a.close(),s("Timed out looking for invite on relay."))},15e3);return()=>{clearTimeout(c),a.close()}}const Xe=new Map,Sr=new Map,ww=6e4,xe=new Set;function Bi(e){const t=Xe.get(e);if(t)return t.display_name||t.name||void 0}function pn(e){return Xe.get(e)}function Eu(e,t){const n=fe();if(!n){console.warn("[profiles] no pool — skipping");return}const r=Date.now(),o=e.filter(c=>{if(Xe.has(c)||xe.has(c))return!1;const l=Sr.get(c);return!(l&&r-l<ww)});if(o.length===0){console.warn("[profiles] all cached/pending — nothing to fetch");return}for(const c of o)xe.add(c);const s=kw(t),i=[...new Set([...s,...ku])];if(console.warn("[profiles] fetching",o.length,"profiles from",i,"for group",t?.slice(0,8)),i.length===0){for(const c of o)xe.delete(c);return}const a=n.subscribeMany(i,{kinds:[0],authors:o},{onevent(c){try{const l=JSON.parse(c.content);console.warn("[profiles] got profile for",c.pubkey.slice(0,8),l.display_name||l.name||"(no name)"),Xe.set(c.pubkey,l),xe.delete(c.pubkey);const d=l.display_name||l.name;if(d&&t){const u=_().groups[t];u&&u.memberNames?.[c.pubkey]!==d&&J(t,{memberNames:{...u.memberNames,[c.pubkey]:d}})}}catch{Sr.set(c.pubkey,Date.now()),xe.delete(c.pubkey)}},oneose(){console.warn("[profiles] EOSE — found:",o.filter(c=>Xe.has(c)).length,"missing:",o.filter(c=>!Xe.has(c)).length);for(const c of o)Xe.has(c)||Sr.set(c,Date.now()),xe.delete(c);a.close()}})}const Pi=["wss://purplepag.es","wss://relay.damus.io","wss://nos.lol"],ku=Pi;async function Ew(){await _o();const e=fe(),{identity:t,settings:n}=_();if(!e||!t?.pubkey)return;const r=t.pubkey;if(xe.has(r))return;Xe.delete(r),Sr.delete(r),xe.add(r);const o=n?.defaultRelays?.length?n.defaultRelays:[],s=[...new Set([...o,...ku])];if(s.length===0){xe.delete(r);return}console.warn("[profiles] fetching own kind 0 from",s);const i=e.subscribeMany(s,{kinds:[0],authors:[r]},{onevent(a){try{const c=JSON.parse(a.content);console.warn("[profiles] got own profile from relay:",c.display_name||c.name||"(no name)"),Xe.set(a.pubkey,c),xe.delete(a.pubkey);const l=c.display_name||c.name,d=c.picture,{identity:u}=_();if(u&&u.pubkey===a.pubkey){const f={};l&&u.displayName!==l&&(f.displayName=l),d&&u.picture!==d&&(f.picture=d),Object.keys(f).length>0&&te({identity:{...u,...f}})}}catch{xe.delete(a.pubkey)}},oneose(){xe.delete(r),i.close()}})}function kw(e){if(e){const n=_().groups[e];if(n?.relays?.length)return n.relays}const t=_().settings;return t?.defaultRelays?.length?t.defaultRelays:[]}function _w(e){const t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function xw(e,t){setTimeout(async()=>{try{const n=fe();if(!n){console.warn("[profiles] no pool — skipping kind 0 publish");return}await _o();const r=JSON.stringify({name:e}),o={kind:0,created_at:Math.floor(Date.now()/1e3),tags:[],content:r},s=_w(t),i=st(o,s),{settings:a}=_(),c=a?.defaultWriteRelays?.length?a.defaultWriteRelays:a?.defaultRelays?.length?a.defaultRelays:[],l=Se([...Pi,...c]);console.warn("[profiles] publishing kind 0 to",l);const d=n.publish(l,i),f=(await Promise.allSettled(d)).filter(h=>h.status==="fulfilled").length;console.warn(`[profiles] kind 0 published to ${f}/${l.length} relay(s)`)}catch(n){console.warn("[profiles] kind 0 publish failed:",n)}},2e3)}const _u=Object.freeze(Object.defineProperty({__proto__:null,PROFILE_RELAYS:Pi,fetchOwnProfile:Ew,fetchProfiles:Eu,getCachedName:Bi,getCachedProfile:pn,publishKind0:xw},Symbol.toStringTag,{value:"Module"})),ec=[210,140,30,280,60,330,170,0];function Sw(e,t){const n=t.indexOf(e);return ec[(n>=0?n:0)%ec.length]}function Iw(e,t,n,r){const o=Sw(e,t),s=n[e]??0;if(s===0)return`hsl(${o}, 55%, 55%)`;const i=Math.floor(Date.now()/1e3)-s;return i<=r?`hsl(${o}, 70%, 55%)`:i<=r*1.25?`hsl(${o}, 40%, 50%)`:"#94a3b8"}function As(e,t,n){const{identity:r,groups:o}=_(),s=r?.pubkey===e;let i;if(n){const c=o[n]?.memberNames?.[e];c&&c!=="You"&&(i=c)}return i||(i=Bi(e)),s?i?`${i} (you)`:"You":i||`${e.slice(0,8)}…${e.slice(-4)}`}function Io(e,t){const n=t?.title??"Invite to Group",r=t?.scanHint??"Scan with your phone camera to join";t?.showConfirmMemberNote,Hn(e);let o=document.getElementById("invite-modal");o||(o=document.createElement("dialog"),o.id="invite-modal",o.className="modal",document.body.appendChild(o),o.addEventListener("click",u=>{u.target===o&&(wn(),o.close())}));const s=o;function i(){s.innerHTML=`
      <div class="modal__form invite-share">
        <h2 class="modal__title">${j(n)}</h2>
        <p class="invite-hint">How are you sharing this?</p>

        <div class="invite-share__actions" style="flex-direction: column; gap: 0.75rem;">
          <button class="btn btn--primary" id="invite-qr-path" type="button">Scan QR &mdash; they're with me</button>
          <button class="btn btn--primary" id="invite-link-path" type="button">Secure Channel &mdash; Signal, WhatsApp, etc.</button>
        </div>

        <div class="modal__actions">
          <button class="btn" id="invite-close-btn" type="button">Cancel</button>
        </div>
      </div>
    `,s.querySelector("#invite-qr-path")?.addEventListener("click",l),s.querySelector("#invite-link-path")?.addEventListener("click",d),s.querySelector("#invite-close-btn")?.addEventListener("click",()=>{wn(),s.close()})}function a(u){s.innerHTML=`
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
    `,s.querySelector("#remote-back-2")?.addEventListener("click",u),s.querySelector("#remote-next-2")?.addEventListener("click",()=>{const f=s.querySelector("#remote-joincode-input"),h=s.querySelector("#remote-joincode-error"),p=f?.value.trim()??"";if(!/^[0-9a-f]{64}$/.test(p)){h&&(h.textContent="Invalid join code — must be a 64-character hex public key.",h.style.display="");return}try{const m=_().groups[e.id];if(!m)throw new Error("Group not found.");const y=Ja(m,p);c(y,p)}catch(m){h&&(h.textContent=m instanceof Error?m.message:"Failed to create welcome envelope.",h.style.display="")}})}function c(u,f){s.innerHTML=`
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
    `,s.querySelector("#remote-copy-welcome")?.addEventListener("click",async h=>{const p=h.currentTarget;try{await navigator.clipboard.writeText(u),p.textContent="Copied!",p.classList.add("btn--copied"),setTimeout(()=>{p.textContent="Copy Welcome Message",p.classList.remove("btn--copied")},2e3)}catch{}}),s.querySelector("#remote-done")?.addEventListener("click",()=>{try{const h=_().groups[e.id];if(h&&!h.members.includes(f)){const p=s.querySelector("#remote-joiner-name")?.value.trim()??"";Is(e.id,f,p),H(p?`${p} added to group`:"Member added to group","success")}}catch(h){H(h instanceof Error?h.message:"Failed to add member","error")}wn(),s.close()})}function l(){let u,f,h;try{const b=Wv(e);u=b.payload,f=b.confirmCode,h=sw(u)}catch(b){H(b instanceof Error?b.message:"Failed to create invite.","error");return}const m=`${window.location.href.split("#")[0]}#inv/${Mv(h)}`,y=mw(m);s.innerHTML=`
      <div class="modal__form invite-share">
        <h2 class="modal__title">${j(n)}</h2>

        <div class="qr-container" data-url="${j(m)}">${y}</div>
        <p class="invite-hint">${j(r)}</p>
        <p class="invite-hint" style="color: var(--duress); font-weight: 500;">Contains the group key &mdash; only share in person.</p>

        <div style="margin: 1rem 0; padding: 0.75rem; border-radius: 0.5rem; background: var(--surface-alt, rgba(255,255,255,0.05));">
          <p class="invite-hint" style="font-weight: 600; margin-bottom: 0.25rem;">Read these words aloud:</p>
          <p style="font-size: 1.25rem; font-weight: 700; letter-spacing: 0.05em; text-align: center;">${j(f)}</p>
        </div>

        <div class="modal__actions" style="gap: 0.5rem;">
          <button class="btn" id="invite-back-btn" type="button">Back</button>
          <button class="btn" id="invite-done-btn" type="button">Done</button>
        </div>
      </div>
    `,s.querySelector("#invite-back-btn")?.addEventListener("click",()=>{i()}),s.querySelector("#invite-done-btn")?.addEventListener("click",()=>{s.close()})}function d(){let u;try{u=ew(e)}catch(b){H(b instanceof Error?b.message:"Failed to create remote invite.","error");return}const h=`${window.location.href.split("#")[0]}#j/${u.inviteId}`,p=e.readRelays?.length?e.readRelays:_().settings.defaultReadRelays,m=e.writeRelays?.length?e.writeRelays:_().settings.defaultWriteRelays;$e(p,m).then(()=>{bw({token:cu(u.tokenPayload),writeRelays:m})});let y=()=>{};s.innerHTML=`
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
    `,s.querySelector("#remote-copy-link")?.addEventListener("click",async b=>{const E=b.currentTarget;try{await navigator.clipboard.writeText(h),E.textContent="Copied!",E.classList.add("btn--copied"),setTimeout(()=>{E.textContent="Copy Link",E.classList.remove("btn--copied")},2e3)}catch{}}),$e(p,m).then(()=>{y=yw({inviteId:u.inviteId,readRelays:p,writeRelays:m,onJoinRequest(b){y();try{const E=_().groups[e.id];if(!E)return;const L=Ja(E,b);gw({inviteId:u.inviteId,joinerPubkey:b,envelope:L,writeRelays:m}),E.members.includes(b)||Is(e.id,b),wn(),s.close(),H("Member joined via relay","success")}catch(E){H(E instanceof Error?E.message:"Failed to send welcome","error")}},onError(b){const E=s.querySelector("#remote-relay-status");E&&(E.textContent=b||"Relay unavailable — use manual fallback below.")}})}),s.querySelector("#remote-manual-fallback")?.addEventListener("click",()=>{y(),a(()=>{y=()=>{},d()})}),s.querySelector("#remote-back-btn")?.addEventListener("click",()=>{y(),wn(),i()})}i(),o.showModal()}function Cs(e){Io(e,{title:"Share Group State",scanHint:"Share with existing members to sync the latest group state.",showConfirmMemberNote:!1})}function Rw(e,t){const{identity:n,groups:r}=_(),o=r[t],s=n?.pubkey===e,i=o?.admins.includes(e)??!1,a=As(e,o?.members??[],t),c=pn(e),l=o?.memberNames?.[e],d=o?.livenessCheckins?.[e];let u="Never checked in";if(d){const b=Math.floor(Date.now()/1e3)-d;b<60?u="Active now":b<3600?u=`${Math.floor(b/60)}m ago`:u=`${Math.floor(b/3600)}h ago`}const f=[s?'<span class="member-detail__badge">You</span>':"",i?'<span class="member-detail__badge member-detail__badge--admin">Admin</span>':""].filter(Boolean).join(" "),h=c?.display_name||c?.name,p=(b,E)=>`<div class="member-detail__row"><span class="member-detail__label">${b}</span><span class="member-detail__value">${j(E)}</span></div>`,m=[p("Pubkey",`${e.slice(0,16)}…${e.slice(-8)}`)];h&&m.push(p("Nostr name",h)),c?.nip05&&m.push(p("NIP-05",c.nip05)),c?.about&&m.push(p("About",c.about.length>80?c.about.slice(0,80)+"…":c.about)),c?.lud16&&m.push(p("Lightning",c.lud16)),c?.website&&m.push(p("Website",c.website)),l&&l!=="You"&&l!==h&&m.push(p("Display name",l)),m.push(p("Liveness",u)),c||m.push('<div class="member-detail__row"><span class="member-detail__label" style="color: var(--text-muted); font-style: italic;">No Nostr profile found on relay</span></div>');const y=c?.picture?`<img class="member-detail__avatar" src="${j(c.picture)}" alt="" />`:"";$i(`
    <div class="member-detail__header">
      ${y}
      <div>
        <h2 class="modal__title" style="margin:0;">${j(a)} ${f}</h2>
      </div>
    </div>
    <div class="member-detail__rows">${m.join("")}</div>
    <div class="modal__actions">
      <button class="btn btn--sm" id="member-detail-copy" type="button">Copy Pubkey</button>
      <button class="btn" id="modal-cancel-btn" type="button">Close</button>
    </div>
  `,()=>{}),requestAnimationFrame(()=>{document.getElementById("member-detail-copy")?.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(e);const b=document.getElementById("member-detail-copy");b.textContent="Copied!",setTimeout(()=>{b.textContent="Copy Pubkey"},1500)}catch{}}),document.getElementById("modal-cancel-btn")?.addEventListener("click",()=>{document.getElementById("app-modal")?.close()})})}function xu(e){const{groups:t,activeGroupId:n}=_();if(!n){e.innerHTML="";return}const r=t[n];if(!r){e.innerHTML="";return}const{identity:o}=_(),s=!!o?.pubkey&&r.admins.includes(o.pubkey);Eu(r.members,n);const i=r.members.length>0?r.members.map(a=>{const c=Iw(a,r.members,r.livenessCheckins??{},r.livenessInterval),l=pn(a),d=l?.picture?`<img src="${j(l.picture)}" alt="" style="width:24px;height:24px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid ${c};box-shadow:0 0 6px ${c}80;" />`:`<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${c};flex-shrink:0;box-shadow:0 0 6px ${c}80;"></span>`;return`
          <li class="member-item" data-pubkey="${j(a)}">
            ${d}
            <button class="member-item__name-btn" data-pubkey="${j(a)}" type="button">${j(As(a,r.members,n))}</button>
            ${s?`<button
              class="btn btn--sm member-item__remove"
              data-pubkey="${j(a)}"
              type="button"
              aria-label="Remove member"
            >✕</button>`:""}
          </li>`}).join(""):'<li class="member-item member-item--empty">No members yet.</li>';e.innerHTML=`
    <section class="panel members-panel">
      <h2 class="panel__title">Members</h2>
      <ul class="member-list">
        ${i}
      </ul>
      ${s?`<div class="members-actions">
        <button class="btn btn--sm" id="invite-btn" type="button" title="Invite a new person to join this group">+ Invite</button>
        <button class="btn btn--sm" id="share-state-btn" type="button" title="Share the latest group state with existing members after changes">Share State</button>
        <button class="btn btn--sm" id="confirm-member-btn" type="button" title="Verify and add a member using their acknowledgement token or verification word">Confirm Member</button>
      </div>`:""}
    </section>
  `,e.querySelectorAll(".member-item__name-btn").forEach(a=>{a.addEventListener("click",()=>{const c=a.dataset.pubkey;c&&Rw(c,n)})}),e.querySelector(".member-list")?.addEventListener("click",a=>{const c=a.target.closest(".member-item__remove");if(!c)return;const l=c.dataset.pubkey;if(!l)return;const{groups:d}=_(),u=d[n]?.members??[];if(!confirm(`Remove ${As(l,u,n)} from the group?

This rotates the group secret immediately. Remaining members must re-join using a fresh invite.`))return;const{activeGroupId:f}=_();if(!f)return;yv(f,l);const{groups:h}=_(),p=h[f];p&&p.members.length>0&&Cs(p)}),e.querySelector("#invite-btn")?.addEventListener("click",()=>{const{groups:a,activeGroupId:c}=_();if(!c)return;const l=a[c];l&&Io(l)}),e.querySelector("#share-state-btn")?.addEventListener("click",()=>{const{groups:a,activeGroupId:c}=_();if(!c)return;const l=a[c];l&&Cs(l)}),e.querySelector("#confirm-member-btn")?.addEventListener("click",()=>{Su()})}function tc(e,t,n){const{groups:r,identity:o}=_(),s=r[e];if(!s||!o?.pubkey||!s.admins.includes(o.pubkey))return!1;s.members.includes(t)||Is(e,t,n);const i=_().groups[e];return i&&n&&J(e,{memberNames:{...i.memberNames,[t]:n}}),!0}function Su(e){const{groups:t,activeGroupId:n}=_();!n||!t[n]||($i(`
    <h2 class="modal__title">Confirm Member</h2>

    <label class="input-label">Acknowledgement link or token
      <textarea name="ackToken" class="input" rows="2" placeholder="Paste #ack/... link or token">${j(e??"")}</textarea>
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
  `,o=>{try{const s=o.get("ackToken")?.trim(),i=o.get("word")?.trim().toLowerCase(),a=o.get("memberName")?.trim(),{activeGroupId:c}=_();if(!c)throw new Error("No active group.");const{groups:l}=_(),d=l[c];if(!d)throw new Error("Group not found.");if(s){const u=s.includes("#ack/")?decodeURIComponent(s.split("#ack/")[1]):s,f=Qv(u,{groupId:c,groupSeed:d.seed,counter:d.counter+(d.usageOffset??0),context:"canary:group",encoding:Ot(d),tolerance:d.tolerance??1});if(!f.valid)throw new Error(f.error??"Invalid join token.");if(!tc(c,f.pubkey,f.displayName||a||""))throw new Error("Member could not be added — they may already be in the group or you are not an admin.");H(`${f.displayName||"Member"} has joined the group`,"success")}else if(i){if(!a)throw new Error("Please enter the member name.");const u=d.counter+(d.usageOffset??0),f=Ee(d.seed,Tt,u,Ot(d)).toLowerCase();if(i!==f)throw new Error("Word does not match — the member may not have the current group key.");const h=new Uint8Array(32);crypto.getRandomValues(h);const p=Array.from(h,m=>m.toString(16).padStart(2,"0")).join("");if(!tc(c,p,a))throw new Error("Member could not be added — you may not be an admin of this group.");H(`${a} has joined the group`,"success")}else throw new Error("Provide either an ack token or a verification word.")}catch(s){throw alert(s instanceof Error?s.message:"Confirmation failed."),s}}),requestAnimationFrame(()=>{document.getElementById("modal-cancel-btn")?.addEventListener("click",()=>{document.getElementById("app-modal")?.close()})}))}const Aw=Object.freeze(Object.defineProperty({__proto__:null,renderMembers:xu,showConfirmMemberModal:Su,showInviteModal:Io,showShareStateModal:Cs},Symbol.toStringTag,{value:"Module"})),Ts="0123456789bcdefghjkmnpqrstuvwxyz",Ui={};for(let e=0;e<Ts.length;e++)Ui[Ts[e]]=e;function Cw(e){for(const t of e)if(!(t in Ui))throw new TypeError(`Invalid geohash character: '${t}' in "${e}"`)}function Di(e,t,n=5){if(!Number.isFinite(e)||e<-90||e>90)throw new RangeError(`Invalid latitude: ${e}`);if(!Number.isFinite(t)||t<-180||t>180)throw new RangeError(`Invalid longitude: ${t}`);if(!Number.isFinite(n))throw new RangeError(`Invalid precision: ${n}`);if(n=Math.round(n),n<1)throw new RangeError(`Invalid precision: ${n}`);n=Math.min(12,n);let r=-90,o=90,s=-180,i=180,a="",c=0,l=0,d=!0;for(;a.length<n;){if(d){const u=(s+i)/2;t>=u?(l|=1<<4-c,s=u):i=u}else{const u=(r+o)/2;e>=u?(l|=1<<4-c,r=u):o=u}d=!d,c++,c===5&&(a+=Ts[l],c=0,l=0)}return a}function Iu(e){if(e.length===0)throw new TypeError("Cannot decode an empty geohash");const t=Tw(e);return{lat:(t.minLat+t.maxLat)/2,lon:(t.minLon+t.maxLon)/2,error:{lat:(t.maxLat-t.minLat)/2,lon:(t.maxLon-t.minLon)/2}}}function Tw(e){Cw(e);let t=-90,n=90,r=-180,o=180,s=!0;for(const i of e){const a=Ui[i];for(let c=4;c>=0;c--){if(s){const l=(r+o)/2;a>>c&1?r=l:o=l}else{const l=(t+n)/2;a>>c&1?t=l:n=l}s=!s}}return{minLat:t,maxLat:n,minLon:r,maxLon:o}}const Lw=[0,25e5,63e4,78e3,2e4,2400,610,76,19,2.4];function ji(e){if(!Number.isFinite(e))throw new RangeError(`Invalid precision: ${e}`);const t=Math.max(1,Math.min(9,Math.round(e)));return Lw[t]}let Z=null,je=null,Ne={},ce={},Wn={},ge=null,mn=new Set,zn=!1,Ls=null;const Nw=[{label:"City",value:4,hint:"~20 km"},{label:"Neighbourhood",value:5,hint:"~2.4 km"},{label:"Street",value:6,hint:"~610 m"},{label:"Exact",value:9,hint:"~2 m"}],nc=6371e3;function $w(e,t,n,r=48){const o=[];for(let s=0;s<=r;s++){const i=s/r*2*Math.PI,a=n/nc*Math.cos(i)*(180/Math.PI),c=n/(nc*Math.cos(e*Math.PI/180))*Math.sin(i)*(180/Math.PI);o.push([t+c,e+a])}return o}const rc=[210,140,30,280,60,330,170,0];function mr(e){const{groups:t,activeGroupId:n}=_(),s=((n?t[n]:null)?.members??[]).indexOf(e);return rc[(s>=0?s:0)%rc.length]}function qi(e){if(mn.has(e))return"#f87171";const{groups:t,activeGroupId:n}=_(),r=n?t[n]:null;if(!r)return`hsl(${mr(e)}, 70%, 55%)`;const o=r.livenessCheckins[e]??0;if(o===0)return`hsl(${mr(e)}, 20%, 50%)`;const s=Math.floor(Date.now()/1e3)-o,i=r.livenessInterval;return s<=i?`hsl(${mr(e)}, 70%, 55%)`:s<=i*1.25?`hsl(${mr(e)}, 40%, 50%)`:"#94a3b8"}function Ru(){return{type:"FeatureCollection",features:Object.entries(ce).map(([e,t])=>({type:"Feature",properties:{pubkey:e,duress:mn.has(e),colour:qi(e)},geometry:{type:"Polygon",coordinates:[$w(t.lat,t.lon,ji(t.precision))]}}))}}const Au="5.19.0",Mw=`https://unpkg.com/maplibre-gl@${Au}/dist/maplibre-gl.js`,Ow=`https://unpkg.com/maplibre-gl@${Au}/dist/maplibre-gl.css`,Bw="sha384-pEfbADcwebVj4NNOvWFLUkm+FiGTICE5bChpV647czG7OpSqcHNgxM8QawfAkbRO",Pw="sha384-MGCxhspF/+ufueUgol3FDkiAYQbpSNRhBT0VWHJt64U8qIy9qlnXWx8LAbj6niPH";async function Uw(){if(je)return je;try{const[t]=await Promise.all([ae(()=>import("./maplibre-gl-DFGd9893.js").then(n=>n.m),[],import.meta.url),ae(()=>Promise.resolve({}),__vite__mapDeps([0]),import.meta.url)]);return je=t,t}catch{}const e=document.createElement("link");return e.rel="stylesheet",e.href=Ow,e.integrity=Pw,e.crossOrigin="anonymous",document.head.appendChild(e),await new Promise((t,n)=>{const r=document.createElement("script");r.src=Mw,r.integrity=Bw,r.crossOrigin="anonymous",r.onload=()=>t(),r.onerror=n,document.head.appendChild(r)}),je=window.maplibregl,je}async function Cu(e){const{groups:t,activeGroupId:n}=_();if(!n||!t[n]){Z&&(Z.remove(),Z=null,zn=!1),e.innerHTML="";return}const r=t[n],o=r.beaconPrecision??5;if(Ls!==n){ce={},Wn={},mn.clear();for(const[s,i]of Object.entries(Ne))i.remove(),delete Ne[s];if(Ls=n,r.lastPositions)for(const[s,i]of Object.entries(r.lastPositions))ce[s]=i}if(Z&&document.getElementById("beacon-map")){yn();for(const[s,i]of Object.entries(ce))Jn(s,i.lat,i.lon);ln(),Object.keys(ce).length>0&&cn();return}queueMicrotask(()=>ln()),e.innerHTML=`
    <section class="panel beacon-panel">
      <h3 class="panel__title">Location</h3>
      <p class="settings-hint" style="margin-bottom: 0.5rem;">Approximate location of group members. Circles show the geohash area — your exact position is never shared. In an emergency, full GPS precision is used so your group can help. Circles turn <span style="color: #f87171; font-weight: 500;">red</span> when an emergency signal is active.</p>
      <div class="beacon-map" id="beacon-map" style="height: 500px; border-radius: 8px;"></div>
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-top: 0.5rem; flex-wrap: wrap;">
        <button class="btn ${ge!==null?"btn--primary":""}" id="beacon-toggle-btn" type="button">
          ${ge!==null?"Sharing Location":"Share Location"}
        </button>
        <button class="btn btn--ghost" id="beacon-fit-btn" type="button" title="Zoom to fit all group members on the map">Fit All</button>
        ${ge!==null?'<span class="settings-hint" style="margin: 0;">Your approximate area is visible to group members</span>':""}
      </div>
      <div style="margin-top: 0.75rem;">
        <span class="input-label">"I'm Alive" precision</span>
        <div class="segmented" id="beacon-precision-picker">
          ${Nw.map(s=>`<button class="segmented__btn ${o===s.value?"segmented__btn--active":""}" data-beacon-precision="${s.value}" title="${s.hint}">${s.label}</button>`).join("")}
        </div>
        <p class="settings-hint">How precisely your location is shared in routine check-ins</p>
      </div>
      <p class="settings-hint" style="margin-top: 0.5rem; color: var(--duress);">Emergency signals always share your exact GPS so your group can find you.</p>
      <div class="beacon-list" id="beacon-list"></div>
    </section>
  `,e.querySelectorAll("[data-beacon-precision]").forEach(s=>{s.addEventListener("click",()=>{const i=Number(s.dataset.beaconPrecision),{activeGroupId:a}=_();a&&(J(a,{beaconPrecision:i}),ge!==null&&(oc(),Ns()),e.querySelectorAll("[data-beacon-precision]").forEach(c=>{c.classList.toggle("segmented__btn--active",Number(c.dataset.beaconPrecision)===i)}))})}),e.querySelector("#beacon-toggle-btn")?.addEventListener("click",()=>{ge!==null?oc():Ns(),Cu(e)}),e.querySelector("#beacon-fit-btn")?.addEventListener("click",()=>{cn()});try{await Uw(),Dw()}catch{e.querySelector(".beacon-map").innerHTML='<p style="color: var(--text-muted); text-align: center; padding: 2rem;">Map unavailable offline</p>'}}function Dw(){const e=document.getElementById("beacon-map");if(!e||Z||!je)return;const n=document.documentElement.dataset.theme!=="light"?"https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json":"https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";Z=new je.Map({container:e,style:n,center:[-.1278,51.5074],zoom:12}),Z.on("load",()=>{zn=!0,console.info("[canary:beacon] map loaded, positions to catch up:",Object.keys(ce).length),Z.addSource("geohash-circles",{type:"geojson",data:Ru()}),Z.addLayer({id:"geohash-fill",type:"fill",source:"geohash-circles",paint:{"fill-color":["get","colour"],"fill-opacity":["case",["get","duress"],.35,.2]}}),Z.addLayer({id:"geohash-stroke",type:"line",source:"geohash-circles",paint:{"line-color":["get","colour"],"line-width":2.5,"line-opacity":["case",["get","duress"],.9,.6]}});for(const[r,o]of Object.entries(ce))Jn(r,o.lat,o.lon);Object.keys(ce).length>0&&cn()})}function Hi(){const{activeGroupId:e}=_();e&&J(e,{lastPositions:{...ce}})}function yn(){if(!Z||!zn)return;const e=Z.getSource("geohash-circles");e&&e.setData(Ru())}function oc(){ge!==null&&(navigator.geolocation.clearWatch(ge),ge=null);const{identity:e}=_();e?.pubkey&&(delete ce[e.pubkey],delete Wn[e.pubkey],Ne[e.pubkey]&&(Ne[e.pubkey].remove(),delete Ne[e.pubkey]),yn(),ln())}function Ns(){if(ge!==null||!("geolocation"in navigator))return;const{groups:e,activeGroupId:t,identity:n}=_();if(!t||!e[t]||!n?.pubkey)return;const r=e[t],o=tu(r.seed),s=r.beaconPrecision||5;ge=navigator.geolocation.watchPosition(async i=>{const a=Di(i.coords.latitude,i.coords.longitude,s),c=Iu(a),l=c.lat,d=c.lon,u=await ru(o,a,s);n?.pubkey&&(Wn[n.pubkey]=u,ce[n.pubkey]={lat:l,lon:d,geohash:a,precision:s,timestamp:Math.floor(Date.now()/1e3)},Jn(n.pubkey,l,d),yn(),cn(),ln(),Hi(),t&&ke(t,{type:"beacon",lat:l,lon:d,accuracy:ji(s),timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID()}))},i=>{console.warn("[canary:beacon] watchPosition error",i.code,i.message)},{enableHighAccuracy:!1,maximumAge:6e4,timeout:15e3})}function Jn(e,t,n){if(!Z||!je){console.warn("[canary:beacon] updateMapMarker skipped — map not ready",{map:!!Z,maplibregl:!!je,pubkey:e.slice(0,8)});return}const r=qi(e),o=mn.has(e),s=Tu(e),i=pn(e),a=!!i?.picture,c=o?40:32;if(Ne[e]){Ne[e].setLngLat([n,t]);const l=Ne[e].getElement(),d=l.querySelector(".beacon-dot");d&&(a||(d.style.background=r),d.style.width=`${c}px`,d.style.height=`${c}px`,d.style.borderColor=r,d.style.boxShadow=`0 0 10px ${r}80`,d.style.animation=o?"beacon-pulse 1s ease-in-out infinite":"none");const u=l.querySelector(".beacon-label");u&&(u.textContent=s)}else{const l=document.createElement("div");l.style.display="flex",l.style.flexDirection="column",l.style.alignItems="center",l.style.pointerEvents="none";let d;a?(d=document.createElement("img"),d.src=i.picture,d.style.objectFit="cover"):(d=document.createElement("div"),d.style.background=r),d.className="beacon-dot",d.style.width=`${c}px`,d.style.height=`${c}px`,d.style.borderRadius="50%",d.style.border=`3px solid ${r}`,d.style.boxShadow=`0 0 10px ${r}80`,d.style.zIndex="2",o&&(d.style.animation="beacon-pulse 1s ease-in-out infinite"),l.appendChild(d);const u=document.createElement("div");u.className="beacon-label",u.textContent=s,u.style.fontSize="11px",u.style.fontWeight="600",u.style.color="#fff",u.style.textShadow="0 1px 3px rgba(0,0,0,0.8)",u.style.marginTop="2px",u.style.whiteSpace="nowrap",l.appendChild(u),Ne[e]=new je.Marker({element:l,anchor:"center"}).setLngLat([n,t]).addTo(Z)}}function cn(){if(!Z)return;const e=Object.values(ce);if(e.length===0)return;if(e.length===1){Z.flyTo({center:[e[0].lon,e[0].lat],zoom:13});return}const t=e.map(r=>r.lon),n=e.map(r=>r.lat);Z.fitBounds([[Math.min(...t),Math.min(...n)],[Math.max(...t),Math.max(...n)]],{padding:60,maxZoom:14})}function Tu(e){const{groups:t,activeGroupId:n,identity:r}=_(),o=n?t[n]:null,s=r?.pubkey===e;let i;const a=o?.memberNames?.[e];return a&&a!=="You"&&(i=a),i||(i=Bi(e)),s?i?`${i} (you)`:"You":i||`${e.slice(0,8)}…`}function ln(){const e=document.getElementById("beacon-list");if(!e)return;const t=Object.entries(ce).map(([n,r])=>{const o=qi(n),s=Tu(n),i=pn(n),a=Math.floor(Date.now()/1e3)-r.timestamp,c=a<60?"just now":a<3600?`${Math.floor(a/60)}m ago`:`${Math.floor(a/3600)}h ago`;return`
      <div class="beacon-entry" style="display:flex;align-items:center;gap:0.5rem;padding:0.25rem 0;">
        ${i?.picture?`<img src="${j(i.picture)}" alt="" style="width:20px;height:20px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid ${o};" />`:`<span style="width:8px;height:8px;border-radius:50%;background:${o};flex-shrink:0;"></span>`}
        <span class="beacon-member" style="font-weight:500;">${j(s)}</span>
        <span class="beacon-geohash" style="color:var(--text-muted);font-size:0.8rem;">${j(r.geohash)}</span>
        <span style="color:var(--text-muted);font-size:0.75rem;margin-left:auto;">${j(c)}</span>
      </div>
    `}).join("");e.innerHTML=t||'<p class="settings-hint">No beacons yet — enable location to start</p>'}document.addEventListener("canary:duress",(e=>{const{members:t}=e.detail;if(!t?.length)return;for(const r of t)mn.add(r),jw(r);yn();const n=t.map(r=>ce[r]).filter(Boolean);if(Z&&n.length===1)Z.flyTo({center:[n[0].lon,n[0].lat],zoom:14});else if(Z&&n.length>1){const r=n.map(s=>s.lon),o=n.map(s=>s.lat);Z.fitBounds([[Math.min(...r),Math.min(...o)],[Math.max(...r),Math.max(...o)]],{padding:60})}}));function jw(e){const t=Ne[e];if(!t)return;const n=t.getElement();n.style.background="#f87171",n.style.width="14px",n.style.height="14px",n.style.boxShadow="0 0 12px rgba(248, 113, 113, 0.6)"}function qw(){if(console.info("[canary:beacon] sendLocationPing called",{hasGeo:"geolocation"in navigator,map:!!Z,mapReady:zn}),!("geolocation"in navigator))return;const{groups:e,activeGroupId:t,identity:n}=_();if(!t||!e[t]||!n?.pubkey){console.warn("[canary:beacon] sendLocationPing: missing state",{activeGroupId:t,hasPubkey:!!n?.pubkey});return}if(ge!==null){console.info("[canary:beacon] watch already active, skipping getCurrentPosition");return}Ns();const r=e[t],o=tu(r.seed),s=r.beaconPrecision||5;navigator.geolocation.getCurrentPosition(async i=>{const a=Di(i.coords.latitude,i.coords.longitude,s),c=Iu(a),l=c.lat,d=c.lon,u=await ru(o,a,s);n?.pubkey&&(Wn[n.pubkey]=u,ce[n.pubkey]={lat:l,lon:d,geohash:a,precision:s,timestamp:Math.floor(Date.now()/1e3)},Jn(n.pubkey,l,d),yn(),cn(),ln(),Hi(),t&&ke(t,{type:"beacon",lat:l,lon:d,accuracy:ji(s),timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID()}))},i=>{console.warn("[canary:beacon] getCurrentPosition FAILED",i.code,i.message),ae(async()=>{const{showToast:a}=await Promise.resolve().then(()=>Ub);return{showToast:a}},void 0,import.meta.url).then(({showToast:a})=>{i.code===1?a("Location permission denied","error",3e3):i.code===3?a("Location request timed out","error",3e3):a("Could not get location","error",3e3)})},{enableHighAccuracy:!1,maximumAge:3e4,timeout:1e4})}function Hw(e,t,n,r,o){const{groups:s,activeGroupId:i}=_(),a=i?s[i]:null;if(!a||!a.members.includes(e))return;const c=Fw(r),l=Di(t,n,c);ce[e]={lat:t,lon:n,geohash:l,precision:c,timestamp:o},Jn(e,t,n),yn(),cn(),ln(),Hi()}function Fw(e){return e<=3?9:e<=20?8:e<=80?7:e<=620?6:e<=2500?5:e<=2e4?4:e<=8e4?3:e<=63e4?2:1}function Gw(){ge!==null&&navigator.geolocation.clearWatch(ge),ge=null,zn=!1,Z&&(Z.remove(),Z=null),Ne={},ce={},Wn={},mn.clear(),Ls=null}function Kw(e){return new Date(e*1e3).toISOString().slice(11,19)+" UTC"}function Vw(e,t){return e<=t?"green":e<=t*1.25?"amber":"red"}function Ww(e,t){return e<60?Kw(t):e<3600?`${Math.floor(e/60)}m ago`:e<86400?`${Math.floor(e/3600)}h ago`:`${Math.floor(e/86400)}d ago`}const zw=[{label:"1m",value:60},{label:"2m",value:120},{label:"5m",value:300},{label:"15m",value:900},{label:"1h",value:3600},{label:"4h",value:14400},{label:"24h",value:86400},{label:"7d",value:604800}];function Jw(e){const{groups:t,activeGroupId:n,identity:r}=_();if(!n||!t[n]){e.innerHTML="";return}const o=t[n],s=Math.floor(Date.now()/1e3),i=o.livenessInterval,a=o.members.map(d=>{const u=o.livenessCheckins[d]??0,f=u>0,h=f?s-u:1/0,p=f?Vw(h,i):"grey",m=f?Math.max(0,Math.min(100,(1-h/i)*100)):0,y=r?.pubkey===d,b=o.memberNames?.[d],E=y?"You":b??`${d.slice(0,8)}…`;return`
      <li class="liveness-item liveness-item--${p}">
        <span class="liveness-dot liveness-dot--${p}"></span>
        <span class="liveness-name">${j(E)}</span>
        <span class="liveness-time">${f?Ww(h,u):"awaiting first check-in"}</span>
        <div class="liveness-bar">
          <div class="liveness-bar__fill liveness-bar__fill--${p}" style="width: ${m}%"></div>
        </div>
      </li>
    `}).join(""),c=r?.pubkey!=null&&o.members.includes(r.pubkey),l=zw.map(d=>`<button class="segmented__btn ${i===d.value?"segmented__btn--active":""}" data-liveness-interval="${d.value}">${d.label}</button>`).join("");e.innerHTML=`
    <section class="panel liveness-panel">
      <h3 class="panel__title">Liveness</h3>

      <div class="settings-section">
        <span class="input-label">Check-in interval</span>
        <div class="segmented" id="liveness-interval-picker">
          ${l}
        </div>
        <p class="settings-hint">How often members must check in</p>
      </div>

      <ul class="liveness-list" id="liveness-list">
        ${a}
      </ul>
      ${c?`
        <button class="btn btn--primary" id="checkin-btn" type="button" title="Check in with your group and share your approximate location">I'm Alive</button>
      `:""}
    </section>
  `,e.querySelectorAll("[data-liveness-interval]").forEach(d=>{d.addEventListener("click",()=>{const u=Number(d.dataset.livenessInterval);J(n,{livenessInterval:u})})}),document.getElementById("checkin-btn")?.addEventListener("click",()=>{try{const{identity:d,activeGroupId:u,groups:f}=_();if(!d?.pubkey||!u){console.warn("[canary:liveness] No identity or activeGroupId",{pubkey:d?.pubkey,gid:u});return}const h=f[u];if(!h){console.warn("[canary:liveness] Group not found",u);return}const p=Math.floor(Date.now()/1e3),m=bt(p,h.rotationInterval);zg(h.seed,"canary:liveness",d.pubkey,m);const y={...h.livenessCheckins,[d.pubkey]:p};J(u,{livenessCheckins:y}),ke(u,{type:"liveness-checkin",pubkey:d.pubkey,timestamp:p,opId:crypto.randomUUID()}),Promise.all([ae(()=>import("./push-Bmopmp70.js"),[],import.meta.url),ae(()=>Promise.resolve().then(()=>Ci),void 0,import.meta.url)]).then(([{notifyCheckin:b},{hashGroupTag:E}])=>{b(E(u))}).catch(()=>{}),qw(),setTimeout(()=>{document.getElementById("beacon-container")?.scrollIntoView({behavior:"smooth",block:"center"})},300),H("Check-in sent — location updated","success",2e3)}catch(d){console.error("[canary:liveness] Check-in failed:",d),H("Check-in failed","error",3e3)}})}function sc(e){if(e.startsWith("wss://"))return!0;if(e.startsWith("ws://"))try{const t=new URL(e);return t.hostname==="localhost"||t.hostname==="127.0.0.1"||t.hostname==="[::1]"}catch{return!1}return!1}let Wt=!1;function Yw(e){const{groups:t,activeGroupId:n}=_();if(!n||!t[n]){e.innerHTML="";return}const r=t[n],{identity:o}=_(),s=!!o?.pubkey&&r.admins.includes(o.pubkey);e.innerHTML=`
    <div class="settings-drawer" id="settings-drawer">
      <button class="settings-toggle" id="settings-toggle">
        <span>Group Settings</span>
        <span class="settings-chevron" style="${Wt?"transform: rotate(90deg);":""}">&#9658;</span>
      </button>

      <div class="settings-body" id="settings-body"${Wt?"":" hidden"}>
        <!-- Group Name -->
        <label class="input-label">Name
          <input class="input" id="settings-name" value="${j(r.name)}">
        </label>

        <!-- Rotation Interval -->
        <div class="settings-section">
          <span class="input-label">Rotation</span>
          <div class="segmented">
            <button class="segmented__btn ${r.rotationInterval===30?"segmented__btn--active":""}" data-interval="30">30s</button>
            <button class="segmented__btn ${r.rotationInterval===86400?"segmented__btn--active":""}" data-interval="86400">24h</button>
            <button class="segmented__btn ${r.rotationInterval===604800?"segmented__btn--active":""}" data-interval="604800">7d</button>
            <button class="segmented__btn ${r.rotationInterval===2592e3?"segmented__btn--active":""}" data-interval="2592000">30d</button>
          </div>
          <p class="settings-hint">How often the verification word changes</p>
        </div>

        ${r.encodingFormat==="words"?`
        <!-- Word Count -->
        <div class="settings-section">
          <span class="input-label">Words</span>
          <div class="segmented">
            <button class="segmented__btn ${r.wordCount===1?"segmented__btn--active":""}" data-words="1">1</button>
            <button class="segmented__btn ${r.wordCount===2?"segmented__btn--active":""}" data-words="2">2</button>
            <button class="segmented__btn ${r.wordCount===3?"segmented__btn--active":""}" data-words="3">3</button>
          </div>
          <p class="settings-hint">More words = stronger security</p>
        </div>
        `:""}

        <!-- Encoding Format -->
        <div class="settings-section">
          <span class="input-label">Display Format</span>
          <div class="segmented">
            <button class="segmented__btn ${r.encodingFormat==="words"?"segmented__btn--active":""}" data-enc="words">Word</button>
            <button class="segmented__btn ${r.encodingFormat==="pin"?"segmented__btn--active":""}" data-enc="pin">PIN</button>
            <button class="segmented__btn ${r.encodingFormat==="hex"?"segmented__btn--active":""}" data-enc="hex">Hex</button>
          </div>
          <p class="settings-hint">Words for voice, PINs for digital input, Hex for machine-to-machine</p>
        </div>

        <!-- Tolerance Window -->
        <div class="settings-section">
          <span class="input-label">Tolerance</span>
          <div class="segmented">
            <button class="segmented__btn ${r.tolerance===0?"segmented__btn--active":""}" data-tolerance="0">0</button>
            <button class="segmented__btn ${r.tolerance===1?"segmented__btn--active":""}" data-tolerance="1">+/-1</button>
            <button class="segmented__btn ${r.tolerance===2?"segmented__btn--active":""}" data-tolerance="2">+/-2</button>
            <button class="segmented__btn ${r.tolerance===3?"segmented__btn--active":""}" data-tolerance="3">+/-3</button>
          </div>
          <p class="settings-hint">Accept words from neighbouring time windows (higher = more forgiving, less secure)</p>
        </div>

        <!-- Duress Mode -->
        <div class="settings-section">
          <span class="input-label">Emergency Alert Mode</span>
          <div class="segmented">
            <button class="segmented__btn ${r.duressMode==="immediate"||!r.duressMode?"segmented__btn--active":""}" data-duress-mode="immediate">Immediate</button>
            <button class="segmented__btn ${r.duressMode==="dead-drop"?"segmented__btn--active":""}" data-duress-mode="dead-drop">Dead Drop</button>
            <button class="segmented__btn ${r.duressMode==="both"?"segmented__btn--active":""}" data-duress-mode="both">Both</button>
          </div>
          <p class="settings-hint">Immediate alerts members now. Dead drop records silently for later retrieval.</p>
        </div>

        <!-- Nostr Sync Toggle -->
        <div class="settings-section">
          <label class="toggle-label">
            <input type="checkbox" id="nostr-toggle" ${r.nostrEnabled?"checked":""}>
            <span>Nostr Sync</span>
          </label>
          <div class="nostr-settings" id="nostr-settings"${r.nostrEnabled?"":" hidden"}>
            <!-- Identity -->
            <div class="nostr-identity" id="nostr-identity">
              <span class="settings-hint">Loading identity…</span>
            </div>

            <!-- Write relays (publishing) -->
            <div class="nostr-relays">
              <span class="input-label">Write Relays <span class="settings-hint" style="font-weight:normal;">(publishing)</span></span>
              <ul class="relay-list" id="write-relay-list">
                ${(r.writeRelays??[]).map((a,c)=>`
                  <li class="relay-item">
                    <span class="relay-url">${j(a)}</span>
                    <button class="btn btn--ghost btn--sm write-relay-remove" data-relay-index="${c}" aria-label="Remove write relay">✕</button>
                  </li>
                `).join("")}
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
                ${(r.readRelays??[]).map((a,c)=>`
                  <li class="relay-item">
                    <span class="relay-url">${j(a)}</span>
                    <button class="btn btn--ghost btn--sm read-relay-remove" data-relay-index="${c}" aria-label="Remove read relay">✕</button>
                  </li>
                `).join("")}
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
                ${qt()?`Connected to ${Dt()} relay${Dt()===1?"":"s"}`:"Not connected"}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="settings-actions">
          <button class="btn btn--ghost" id="export-btn">Export Group</button>
          <button class="btn btn--ghost" id="import-btn">Import Group</button>
          ${s?'<button class="btn btn--warning" id="reseed-btn">Rotate Key</button>':""}
          ${s?'<button class="btn btn--danger" id="compromise-reseed-btn">Compromise Reseed</button>':""}
          <button class="btn btn--danger" id="dissolve-btn">Dissolve Group</button>
        </div>
      </div>
    </div>
  `,document.getElementById("settings-toggle").addEventListener("click",()=>{Wt=!Wt;const a=document.getElementById("settings-body"),c=e.querySelector(".settings-chevron");a.hidden=!Wt,c.style.transform=Wt?"rotate(90deg)":""}),document.getElementById("settings-name").addEventListener("change",a=>{const c=a.target.value.trim();c&&J(n,{name:c})}),e.querySelectorAll("[data-interval]").forEach(a=>{a.addEventListener("click",()=>{J(n,{rotationInterval:Number(a.dataset.interval)})})}),e.querySelectorAll("[data-words]").forEach(a=>{a.addEventListener("click",()=>{J(n,{wordCount:Number(a.dataset.words)})})}),e.querySelectorAll("[data-enc]").forEach(a=>{a.addEventListener("click",()=>{J(n,{encodingFormat:a.dataset.enc})})}),e.querySelectorAll("[data-tolerance]").forEach(a=>{a.addEventListener("click",()=>{J(n,{tolerance:Number(a.dataset.tolerance)})})}),e.querySelectorAll("[data-duress-mode]").forEach(a=>{a.addEventListener("click",()=>{J(n,{duressMode:a.dataset.duressMode})})}),document.getElementById("nostr-toggle").addEventListener("change",a=>{const c=a.target.checked;J(n,{nostrEnabled:c});const l=document.getElementById("nostr-settings");if(l.hidden=!c,c){const d=_().groups[n],u=d?.readRelays??[],f=d?.writeRelays??[];$e(u,f,n).then(()=>{ac()}),ic()}else an(),jd(),Un(!1,0),ac()});function i(){const a=_().groups[n];a?.nostrEnabled&&$e(a.readRelays??[],a.writeRelays??[],n)}e.querySelectorAll(".write-relay-remove").forEach(a=>{a.addEventListener("click",()=>{const c=Number(a.dataset.relayIndex),l=[..._().groups[n]?.writeRelays??[]];l.splice(c,1),J(n,{writeRelays:l}),i()})}),e.querySelectorAll(".read-relay-remove").forEach(a=>{a.addEventListener("click",()=>{const c=Number(a.dataset.relayIndex),l=[..._().groups[n]?.readRelays??[]];l.splice(c,1),J(n,{readRelays:l}),i()})}),document.getElementById("write-relay-add-btn").addEventListener("click",()=>{const a=document.getElementById("write-relay-add-input"),c=a.value.trim();if(!sc(c)){a.focus();return}const l=[..._().groups[n]?.writeRelays??[]];l.includes(c)?a.value="":(l.push(c),J(n,{writeRelays:l}),a.value="",i())}),document.getElementById("read-relay-add-btn").addEventListener("click",()=>{const a=document.getElementById("read-relay-add-input"),c=a.value.trim();if(!sc(c)){a.focus();return}const l=[..._().groups[n]?.readRelays??[]];l.includes(c)?a.value="":(l.push(c),J(n,{readRelays:l}),a.value="",i())}),document.getElementById("write-relay-add-input").addEventListener("keydown",a=>{a.key==="Enter"&&document.getElementById("write-relay-add-btn").click()}),document.getElementById("read-relay-add-input").addEventListener("keydown",a=>{a.key==="Enter"&&document.getElementById("read-relay-add-btn").click()}),r.nostrEnabled&&ic(),document.getElementById("reseed-btn")?.addEventListener("click",()=>{const{groups:a}=_(),c=a[n],d=(c?Hn(c)==="online":!1)?"Rotate the group key? This broadcasts the new key to all members via the relay.":"Rotate the group key? Remaining members will need to re-sync via Share State.";confirm(d)&&(pv(n),H("Key rotated. New verification words are active.","warning",6e3))}),document.getElementById("compromise-reseed-btn")?.addEventListener("click",()=>{confirm("Compromise reseed? This generates a new key WITHOUT broadcasting. All members will need new invites.")&&(mv(n),H("Emergency reseed complete. No broadcast sent — share new invites with all members.","warning",8e3))}),document.getElementById("dissolve-btn").addEventListener("click",()=>{confirm(`Dissolve "${r.name}"? This cannot be undone.`)&&hv(n)}),document.getElementById("export-btn").addEventListener("click",()=>{if(!confirm("This exports the group secret in cleartext. Treat the file like a password."))return;const a=new Blob([JSON.stringify(r,null,2)],{type:"application/json"}),c=URL.createObjectURL(a),l=document.createElement("a");l.href=c,l.download=`canary-${r.name.toLowerCase().replace(/\s+/g,"-")}.json`,l.click(),URL.revokeObjectURL(c)}),document.getElementById("import-btn").addEventListener("click",()=>{if(!confirm("Only import files from trusted sources — the file contains the group secret."))return;const a=document.createElement("input");a.type="file",a.accept=".json",a.addEventListener("change",async()=>{const c=a.files?.[0];if(c)try{const l=await c.text(),d=JSON.parse(l);bv(d);const u=crypto.randomUUID(),f={id:u,name:String(d.name),seed:String(d.seed),members:d.members.filter(p=>typeof p=="string"),memberNames:{},nostrEnabled:!1,relays:[],wordlist:typeof d.wordlist=="string"?d.wordlist:"en-v1",wordCount:[1,2,3].includes(d.wordCount)?d.wordCount:2,counter:typeof d.counter=="number"&&d.counter>=0?d.counter:0,usageOffset:typeof d.usageOffset=="number"&&d.usageOffset>=0?d.usageOffset:0,rotationInterval:typeof d.rotationInterval=="number"&&d.rotationInterval>0?d.rotationInterval:86400,encodingFormat:["words","pin","hex"].includes(d.encodingFormat)?d.encodingFormat:"words",usedInvites:[],latestInviteIssuedAt:0,livenessInterval:typeof d.rotationInterval=="number"&&d.rotationInterval>0?d.rotationInterval:86400,livenessCheckins:{},tolerance:typeof d.tolerance=="number"&&d.tolerance>=0&&d.tolerance<=10?d.tolerance:1,beaconInterval:typeof d.beaconInterval=="number"&&d.beaconInterval>0?d.beaconInterval:60,beaconPrecision:typeof d.beaconPrecision=="number"&&d.beaconPrecision>0?d.beaconPrecision:5,duressPrecision:typeof d.duressPrecision=="number"&&d.duressPrecision>0?d.duressPrecision:9,duressMode:["immediate","dead-drop","both"].includes(d.duressMode)?d.duressMode:"immediate",createdAt:typeof d.createdAt=="number"?d.createdAt:Math.floor(Date.now()/1e3),admins:Array.isArray(d.admins)?d.admins.filter(p=>typeof p=="string"):[],epoch:typeof d.epoch=="number"&&d.epoch>=0?d.epoch:0,consumedOps:Array.isArray(d.consumedOps)?d.consumedOps.filter(p=>typeof p=="string"):[]},{groups:h}=_();te({groups:{...h,[u]:f},activeGroupId:u})}catch{alert("Could not import group file. Check the file format.")}}),a.click()})}function ic(){const e=document.getElementById("nostr-identity");if(!e)return;const{identity:t}=_();if(!t?.pubkey){e.innerHTML='<span class="settings-hint">No identity available.</span>';return}const n=`${t.pubkey.slice(0,8)}…${t.pubkey.slice(-8)}`;e.innerHTML=`
    <div class="nostr-identity-row">
      <span class="input-label">Identity (Local key)</span>
      <span class="relay-url nostr-pubkey" title="${j(t.pubkey)}">${j(n)}</span>
    </div>
    <p class="settings-hint">Your identity is stored locally on this device.</p>
  `}function ac(){const e=document.getElementById("nostr-conn-status");if(!e)return;const t=Dt();e.textContent=qt()?`Connected to ${t} relay${t===1?"":"s"}`:"Not connected"}new TextEncoder;function Lu(){const e=new Uint8Array(32);return crypto.getRandomValues(e),e}const qn=Object.freeze({call:Object.freeze({wordCount:1,rotationSeconds:30,tolerance:1,directional:!0,description:"Phone verification for insurance, banking, and call centres. Single word with 30-second rotation. Deepfake-proof — cloning a voice does not help derive the current word."}),handoff:Object.freeze({wordCount:1,rotationSeconds:0,tolerance:0,directional:!0,description:"Physical handoff verification for rideshare, delivery, and task completion. Single-use token per event. No time dependency — counter is the task/event ID."})});function $s(e){const t=e.preset?qn[e.preset]:void 0,n=e.rotationSeconds??t?.rotationSeconds??30,r=e.tolerance??t?.tolerance??0,o=t?.wordCount??1,s=e.encoding??{format:"words",count:o};if(!e.namespace)throw new Error("namespace must be a non-empty string");if(e.namespace.includes("\0"))throw new Error("namespace must not contain null bytes");if(!e.roles[0]||!e.roles[1])throw new Error("Both roles must be non-empty strings");if(e.roles[0].includes("\0")||e.roles[1].includes("\0"))throw new Error("Roles must not contain null bytes");if(e.roles[0]===e.roles[1])throw new Error(`Roles must be distinct, got ["${e.roles[0]}", "${e.roles[1]}"]`);if(e.myRole!==e.roles[0]&&e.myRole!==e.roles[1])throw new Error(`myRole "${e.myRole}" is not one of the configured roles ["${e.roles[0]}", "${e.roles[1]}"]`);if(!Number.isInteger(n)||n<0)throw new RangeError(`rotationSeconds must be a non-negative integer, got ${n}`);if(!Number.isInteger(r)||r<0)throw new RangeError(`tolerance must be a non-negative integer, got ${r}`);if(r>vt)throw new RangeError(`tolerance must be <= ${vt}, got ${r}`);if(n===0&&e.counter===void 0)throw new Error("Fixed counter mode (rotationSeconds=0) requires config.counter");if(n===0&&e.counter!==void 0&&(!Number.isInteger(e.counter)||e.counter<0||e.counter>4294967295))throw new RangeError(`counter must be an integer 0–${4294967295}, got ${e.counter}`);if(n>0&&e.counter!==void 0)throw new Error("counter must not be set when rotationSeconds > 0 (counter is derived from time)");const i=typeof e.secret=="string"?F(e.secret):e.secret,a=e.roles[0]===e.myRole?e.roles[1]:e.roles[0],c=`${e.namespace}\0${e.myRole}`,l=`${e.namespace}\0${a}`,d=n===0;function u(f){if(d){if(e.counter===void 0)throw new Error("Fixed counter mode (rotationSeconds=0) requires config.counter");return e.counter}const h=f??Math.floor(Date.now()/1e3);return Math.floor(h/n)}return{counter:u,myToken(f){return Ee(i,c,u(f),s)},theirToken(f){return Ee(i,l,u(f),s)},verify(f,h){const p=[];return e.theirIdentity&&p.push(e.theirIdentity),Es(i,l,u(h),f,p,{encoding:s,tolerance:r})},pair(f){return Jg(i,e.namespace,e.roles,u(f),s)}}}const An={insurance:{label:"Insurance",namespace:"aviva",roles:["caller","agent"],preset:"call"},pickup:{label:"Pickup",namespace:"family",roles:["child","adult"],preset:"handoff"},rideshare:{label:"Rideshare",namespace:"dispatch",roles:["requester","driver"],preset:"handoff",encoding:"pin"}};let Fi=Lu(),Q=An.insurance,Jt,Ir,Rr=null,Gi=1;function Ms(){const e=Q.preset==="handoff",t=Q.encoding==="pin"?{format:"pin",digits:4}:void 0,n={secret:Fi,namespace:Q.namespace,roles:Q.roles,preset:Q.preset,...e?{counter:Gi}:{},...t?{encoding:t}:{}};Jt=$s({...n,myRole:Q.roles[0],theirIdentity:Q.roles[1]}),Ir=$s({...n,myRole:Q.roles[1],theirIdentity:Q.roles[0]})}Ms();function yr(e,t){const n=Q.preset==="handoff",r=qn[Q.preset],o=n?Gi:Math.floor((t??Math.floor(Date.now()/1e3))/r.rotationSeconds),s=`${Q.namespace}\0${e}`,i=Q.encoding==="pin"?{format:"pin",digits:4}:{format:"words",count:1};return go(Fi,s,e,o,i,r.tolerance)}function Ar(){Rr!==null&&(clearInterval(Rr),Rr=null)}function gr(e){if(e<=0)return"0s";const t=Math.floor(e/60),n=Math.floor(e%60);return t>0?`${t}m ${n}s`:`${n}s`}function cc(e){if(e===0)return 0;const t=Math.floor(Date.now()/1e3),r=(Math.floor(t/e)+1)*e;return Math.max(0,r-t)}function Cr(e){Ar();const t=Math.floor(Date.now()/1e3),n=Q.preset==="handoff",r=n?0:qn[Q.preset].rotationSeconds,o=cc(r),s=r>0?Math.min(100,(r-o)/r*100):100,i=Q.roles[0],a=Q.roles[1];e.innerHTML=`
    <div class="call-sim">
      <div class="call-sim__header">
        <h2 class="call-sim__title">CANARY Call Verification Demo</h2>
        <div class="call-sim__scenarios" id="call-scenarios">
          ${Object.entries(An).map(([m,y])=>`<button class="btn call-sim__scenario-btn${Q===y?" call-sim__scenario-btn--active":""}" data-scenario="${m}">${y.label}</button>`).join("")}
        </div>
      </div>

      <div class="call-sim__panels">
        <div class="call-sim__panel call-sim__panel--caller">
          <h3 class="call-sim__role">${i.toUpperCase()}</h3>
          <div class="call-sim__token-group">
            <span class="call-sim__label">Your code — tap to reveal:</span>
            <div class="call-sim__token call-sim__token--reveal" id="caller-reveal" data-real="${Jt.myToken(t)}" data-alt="${yr(i,t)}">••••••••</div>
          </div>
          ${n?'<span class="call-sim__countdown">Single-use</span>':`
          <div class="call-sim__progress"><div class="call-sim__progress-bar" id="caller-progress" style="width: ${s}%"></div></div>
          <span class="call-sim__countdown" id="caller-countdown">${gr(o)}</span>
          `}
          <div class="call-sim__verify">
            <input type="text" class="input call-sim__input" id="caller-verify-input" placeholder="Type ${a}'s word..." autocomplete="off" />
            <button class="btn btn--primary call-sim__verify-btn" id="caller-verify-btn">Verify</button>
          </div>
          <div class="call-sim__result" id="caller-result" hidden></div>
        </div>

        <div class="call-sim__divider"></div>

        <div class="call-sim__panel call-sim__panel--agent">
          <h3 class="call-sim__role">${a.toUpperCase()}</h3>
          <div class="call-sim__token-group">
            <span class="call-sim__label">Your code — tap to reveal:</span>
            <div class="call-sim__token call-sim__token--reveal" id="agent-reveal" data-real="${Ir.myToken(t)}" data-alt="${yr(a,t)}">••••••••</div>
          </div>
          ${n?'<span class="call-sim__countdown">Single-use</span>':`
          <div class="call-sim__progress"><div class="call-sim__progress-bar" id="agent-progress" style="width: ${s}%"></div></div>
          <span class="call-sim__countdown" id="agent-countdown">${gr(o)}</span>
          `}
          <div class="call-sim__verify">
            <input type="text" class="input call-sim__input" id="agent-verify-input" placeholder="Type ${i}'s word..." autocomplete="off" />
            <button class="btn btn--primary call-sim__verify-btn" id="agent-verify-btn">Verify</button>
          </div>
          <div class="call-sim__result" id="agent-result" hidden></div>
        </div>
      </div>

      <div class="call-sim__banner call-sim__banner--valid" id="call-verified-banner" hidden></div>

      <div class="call-sim__footer">
        <span class="call-sim__meta">Namespace: <strong>${Q.namespace}</strong></span>
        <span class="call-sim__meta">Rotation: <strong>${n?"single-use":r+"s"}</strong></span>
        <span class="call-sim__meta">Encoding: <strong>${Q.encoding??"words"}</strong></span>
        <span class="call-sim__meta">Tolerance: <strong>+/-${n?"0":qn[Q.preset].tolerance}</strong></span>
        <button class="btn" id="call-reset-seed">Reset seed</button>
      </div>

      <div class="call-sim__pair" id="call-pair">
        <span class="call-sim__meta">Pair: <code id="pair-display"></code></span>
      </div>
    </div>
  `,e.querySelector("#call-scenarios")?.addEventListener("click",m=>{const y=m.target.closest("[data-scenario]");if(!y)return;const b=y.dataset.scenario;An[b]&&An[b]!==Q&&(Q=An[b],Ms(),Cr(e))}),e.querySelector("#call-reset-seed")?.addEventListener("click",()=>{Fi=Lu(),Q.preset==="handoff"&&Gi++,Ms(),Cr(e)});let c=!1,l=!1,d=!1;function u(){if(!d&&c&&l){Ar();const m=e.querySelector("#call-verified-banner");m&&(m.hidden=!1,m.textContent="Call Verified — both parties authenticated"),e.querySelectorAll(".call-sim__progress, .call-sim__countdown").forEach(y=>{y.hidden=!0})}}function f(m,y,b,E,L){const O=e.querySelector(`#${m}`),N=e.querySelector(`#${y}`),$=e.querySelector(`#${b}`);if(!O||!N||!$)return;function w(){const v=O.value.trim();if(!v)return;const g=E.verify(v);$.hidden=!1,$.className="call-sim__result",g.status==="valid"?($.classList.add("call-sim__result--valid"),$.textContent="Verified ✓",L==="caller"?c=!0:l=!0,u()):g.status==="duress"?($.classList.add("call-sim__result--invalid"),$.textContent="Failed ✗",d=!0):($.classList.add("call-sim__result--invalid"),$.textContent="Failed ✗")}N.addEventListener("click",w),O.addEventListener("keydown",v=>{v.key==="Enter"&&w()})}f("caller-verify-input","caller-verify-btn","caller-result",Jt,"caller"),f("agent-verify-input","agent-verify-btn","agent-result",Ir,"agent");function h(m){const y=e.querySelector(`#${m}`);if(!y)return;function b(L){L.preventDefault();const O=y.getBoundingClientRect(),N=L.clientX-O.left;y.textContent=N<O.width/2?y.dataset.real:y.dataset.alt}function E(){y.textContent="••••••••"}y.addEventListener("pointerdown",b),y.addEventListener("pointerup",E),y.addEventListener("pointerleave",E),y.addEventListener("pointercancel",E)}h("caller-reveal"),h("agent-reveal");const p=e.querySelector("#pair-display");if(p){const m=Jt.pair(t),y=Object.entries(m).map(([b,E])=>`${b}: ${E}`).join(" | ");p.textContent=y}!n&&r>0&&(Rr=setInterval(()=>{const m=cc(r),y=Math.min(100,(r-m)/r*100),b=e.querySelector("#caller-progress"),E=e.querySelector("#agent-progress"),L=e.querySelector("#caller-countdown"),O=e.querySelector("#agent-countdown"),N=Math.max(0,100-y),$=N>50?`hsl(${Math.round(120*(N/100))}, 70%, 45%)`:`hsl(${Math.round(120*(N/100))}, 80%, 45%)`;b&&(b.style.width=`${y}%`,b.style.background=$),E&&(E.style.width=`${y}%`,E.style.background=$),L&&(L.textContent=gr(m)),O&&(O.textContent=gr(m));const w=Math.floor(Date.now()/1e3),v=e.querySelector("#caller-reveal"),g=e.querySelector("#agent-reveal"),x=Jt.myToken(w),S=v&&v.dataset.real!==x;if(v&&(v.dataset.real=x,v.dataset.alt=yr(i,w)),g&&(g.dataset.real=Ir.myToken(w),g.dataset.alt=yr(a,w)),S){c=!1,l=!1,d=!1;const k=e.querySelector("#caller-result"),R=e.querySelector("#agent-result");k&&(k.hidden=!0,k.className="call-sim__result"),R&&(R.hidden=!0,R.className="call-sim__result");const I=e.querySelector("#caller-verify-input"),T=e.querySelector("#agent-verify-input");I&&(I.value=""),T&&(T.value="");const C=e.querySelector("#call-verified-banner");C&&(C.hidden=!0),e.querySelectorAll(".call-sim__progress, .call-sim__countdown").forEach(M=>{M.hidden=!1})}const A=e.querySelector("#pair-display");if(A){const k=Jt.pair(),R=Object.entries(k).map(([I,T])=>`${I}: ${T}`).join(" | ");A.textContent=R}m===0&&(Ar(),Cr(e))},1e3))}function Zw(){Ar()}let _t=null;function Xw(e,t){const n=_().groups[t];if(!n)return e.slice(0,8);const{identity:r}=_();if(r?.pubkey===e)return"You";const o=n.memberNames?.[e];return o||`${e.slice(0,8)}…${e.slice(-4)}`}function Qw(e,t){_t&&(_t(),_t=null),document.querySelector(".call-verify")?.remove();const{groups:n,identity:r}=_(),o=n[e];if(!o||!r)return;const s=r.pubkey,i=Xw(t,e),a=pn(t),c=s<t?[s,t]:[t,s],l=$s({secret:o.seed,namespace:"canary:call",roles:c,myRole:s,preset:"call"}),d=qn.call.rotationSeconds,u=Math.floor(Date.now()/1e3),f=l.myToken(u),h=l.theirToken(u),p=document.createElement("div");p.className="call-verify",p.innerHTML=`
    <div class="call-verify__content">
      ${a?.picture?`<img class="call-verify__avatar" src="${j(a.picture)}" alt="" />`:""}
      <h2 class="call-verify__title">Call with ${j(i)}</h2>
      <p class="call-verify__instruction">Speak your word. Listen for theirs. If it matches, the call is verified.</p>

      <div class="call-verify__section call-verify__section--say">
        <span class="call-verify__label">Say this:</span>
        <span class="call-verify__word call-verify__word--mine" id="cv-word-mine">${f}</span>
      </div>

      <div class="call-verify__divider"></div>

      <div class="call-verify__section call-verify__section--hear">
        <span class="call-verify__label">They should say:</span>
        <span class="call-verify__word call-verify__word--theirs" id="cv-word-theirs">${h}</span>
      </div>

      <p class="call-verify__timer">Words change in <span id="cv-countdown">${d}</span>s</p>

      <p class="call-verify__instruction" style="margin-top: 1.5rem; font-size: 0.75rem;">In a real call, if they say the wrong word, it could be an emergency signal. A production app would automatically check and silently alert the group.</p>
      <div class="call-verify__actions">
        <button class="btn btn--primary call-verify__btn" id="cv-match">Match</button>
        <button class="btn call-verify__btn call-verify__btn--danger" id="cv-mismatch">Wrong Word</button>
        <button class="btn call-verify__btn" id="cv-close">Close</button>
      </div>
    </div>
  `;let m=null;function y(){const O=Math.floor(Date.now()/1e3),N=p.querySelector("#cv-word-mine"),$=p.querySelector("#cv-word-theirs"),w=p.querySelector("#cv-countdown");if(N&&(N.textContent=l.myToken(O)),$&&($.textContent=l.theirToken(O)),w){const v=O%d;w.textContent=String(d-v)}}m=setInterval(y,1e3);function b(){m!==null&&(clearInterval(m),m=null)}function E(){_t&&(_t(),_t=null),p.classList.remove("call-verify--visible"),setTimeout(()=>p.remove(),300)}function L(O){O.key==="Escape"&&E()}_t=()=>{b(),document.removeEventListener("keydown",L)},document.body.appendChild(p),requestAnimationFrame(()=>p.classList.add("call-verify--visible")),document.addEventListener("keydown",L),p.querySelector("#cv-match")?.addEventListener("click",()=>{b(),p.innerHTML=`
      <div class="call-verify__content">
        <h2 class="call-verify__title" style="color: var(--clr-success, #27ae60);">Call Verified</h2>
        <p class="call-verify__warning" style="color: var(--text-secondary);">${j(i)} is who they say they are. The call is authenticated.</p>
        <div class="call-verify__actions">
          <button class="btn btn--primary call-verify__btn" id="cv-dismiss-ok">Done</button>
        </div>
      </div>
    `,p.querySelector("#cv-dismiss-ok")?.addEventListener("click",E)}),p.querySelector("#cv-close")?.addEventListener("click",E),p.querySelector("#cv-mismatch")?.addEventListener("click",()=>{b(),p.innerHTML=`
      <div class="call-verify__content">
        <h2 class="call-verify__title" style="color: var(--clr-danger, #e74c3c);">Verification Failed</h2>
        <p class="call-verify__warning">The word didn't match. This person may not be who they claim to be.</p>
        <div class="call-verify__actions">
          <button class="btn call-verify__btn" id="cv-dismiss-fail">Dismiss</button>
        </div>
      </div>
    `,p.querySelector("#cv-dismiss-fail")?.addEventListener("click",E)})}const Nu=30078,$u="canary:vault",e0=2160*60*60;function Ki(e){const t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function t0(e){const t={};for(const[r,o]of Object.entries(e)){const{lastPositions:s,...i}=o;t[r]={...i,livenessCheckins:{}}}return JSON.stringify({version:1,groups:t})}function lc(e){try{const t=JSON.parse(e);return!t||typeof t!="object"||typeof t.groups!="object"||t.groups===null?{}:t.groups}catch{return{}}}function n0(e,t,n){const r=Ki(t),o=we(r,n);return Pt(e,o)}function dc(e,t,n){try{const r=Ki(t),o=we(r,n);return Ut(e,o)}catch{return null}}function r0(e,t){const n=Ki(t),r=Math.floor(Date.now()/1e3),o={kind:Nu,created_at:r,tags:[["d",$u],["expiration",String(r+e0)]],content:e};return st(o,n)}async function Mu(e,t,n){const r=fe();if(!r)throw new Error("No relay pool — connect first");const o=Hd();if(o.length===0)throw new Error("No write relays configured");const s=t0(e),i=n0(s,t,n),a=r0(i,t);document.dispatchEvent(new CustomEvent("canary:vault-syncing")),await Promise.allSettled(r.publish(o,a)),document.dispatchEvent(new CustomEvent("canary:vault-synced",{detail:{timestamp:Math.floor(Date.now()/1e3)}}))}async function o0(e,t){const n=fe();if(!n)return null;const r=qd();return r.length===0?null:new Promise(o=>{let s=!1,i=null;const a=setTimeout(()=>{if(!s){if(s=!0,c.close(),i){const l=dc(i.content,e,t);if(l){o(lc(l));return}}o(null)}},1e4),c=n.subscribeMany(r,{kinds:[Nu],authors:[t],"#d":[$u],limit:1},{onevent(l){(!i||l.created_at>i.created_at)&&(i=l)},oneose(){if(!s){if(s=!0,clearTimeout(a),c.close(),i){const l=dc(i.content,e,t);if(l){o(lc(l));return}}o(null)}}})})}function s0(e,t){const n={...e};for(const[r,o]of Object.entries(t)){const s=e[r];if(!s){n[r]=o;continue}const i=s.epoch??0,a=o.epoch??0;if(a>i)n[r]=o;else if(a===i){const c=s.counter??0;(o.counter??0)>c&&(n[r]=o)}}return n}function i0(e){if(e.startsWith("wss://"))return!0;if(e.startsWith("ws://"))try{const t=new URL(e);return t.hostname==="localhost"||t.hostname==="127.0.0.1"||t.hostname==="[::1]"}catch{return!1}return!1}function Os(e,t){return t?.pubkey===e.pubkey&&t.mnemonic?{...e,mnemonic:t.mnemonic}:e}function Ou(e,t){return e?typeof t.epoch=="number"&&t.epoch<e.epoch?"This invite is older than the group state already stored on this device.":typeof t.latestInviteIssuedAt=="number"&&e.latestInviteIssuedAt>0&&t.latestInviteIssuedAt<e.latestInviteIssuedAt?"A newer invite has already been accepted for this group on this device.":typeof t.epoch=="number"&&t.epoch===e.epoch&&typeof t.counter=="number"&&t.counter<e.counter?"This invite would roll the group back to an older counter.":null:null}$g();const a0=Cg();a0.theme==="light"?document.documentElement.setAttribute("data-theme","light"):document.documentElement.removeAttribute("data-theme");let Lt=null;function Mn(){Lt!==null&&(clearTimeout(Lt),Lt=null);const{settings:e}=_();!e.pinEnabled||e.autoLockMinutes<=0||!yd()||(Lt=setTimeout(()=>{po(),Vi()},e.autoLockMinutes*60*1e3))}function Bu(){document.addEventListener("pointerdown",Mn,{passive:!0}),document.addEventListener("keydown",Mn,{passive:!0}),Mn()}function Pu(){document.removeEventListener("pointerdown",Mn),document.removeEventListener("keydown",Mn),Lt!==null&&(clearTimeout(Lt),Lt=null)}function Vi(){Pu(),an();const e=document.getElementById("app");e.innerHTML=`
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
  `;const t=document.getElementById("pin-input"),n=document.getElementById("pin-error"),r=document.getElementById("pin-submit");let o=0;const s=[0,1e3,2e3,5e3,15e3,3e4];async function i(){const a=t.value.trim();if(a.length<6){n.textContent="PIN must be at least 6 digits.",n.hidden=!1,t.focus();return}r.disabled=!0,r.textContent="Unlocking…",n.hidden=!0;try{await Tg(a),await f0(),Uu();const c=document.getElementById("header");c&&Li(c),Du(),zi(),Tr(Wi),Bu(),ju(),Zr(),window.addEventListener("hashchange",()=>Zr()),Xr()}catch{o++;const c=s[Math.min(o,s.length-1)];n.textContent=c>0?`Incorrect PIN. Wait ${c/1e3}s before retrying.`:"Incorrect PIN. Try again.",n.hidden=!1,t.value="",r.disabled=!0,r.textContent="Unlock",c>0?setTimeout(()=>{r.disabled=!1,t.focus()},c):(r.disabled=!1,t.focus())}}r.addEventListener("click",()=>{i()}),t.addEventListener("keydown",a=>{a.key==="Enter"&&i()}),requestAnimationFrame(()=>t.focus())}function Uu(){const e=document.getElementById("app");if(!e)throw new Error("Missing #app mount point");e.innerHTML=`
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
  `}function Du(){const e=document.getElementById("hamburger"),t=document.getElementById("sidebar"),n=document.getElementById("sidebar-overlay");if(!e||!t||!n)return;function r(){t.classList.add("sidebar--open"),n.classList.add("sidebar-overlay--visible"),e.setAttribute("aria-expanded","true")}function o(){t.classList.remove("sidebar--open"),n.classList.remove("sidebar-overlay--visible"),e.setAttribute("aria-expanded","false")}e.setAttribute("aria-expanded","false"),e.addEventListener("click",()=>{t.classList.contains("sidebar--open")?o():r()}),n.addEventListener("click",()=>{o()}),t.addEventListener("click",s=>{s.target.closest("[data-group-id]")&&o()})}let es=!1;function Wi(){es||(es=!0,requestAnimationFrame(()=>{es=!1,zi()}))}function zi(){const{view:e}=_(),t=document.getElementById("groups-view"),n=document.getElementById("call-demo-view");t&&(t.hidden=e!=="groups"),n&&(n.hidden=e!=="call-demo");const r=document.getElementById("header");if(r&&Li(r),e==="groups"){Zw();const o=document.getElementById("welcome-container");o&&vv(o);const s=document.getElementById("sidebar");s&&ov(s);const i=document.getElementById("hero-container");i&&su(i);const a=document.getElementById("verify-container");a&&Nv(a);const c=document.getElementById("members-container");c&&xu(c);const l=_().groups[_().activeGroupId??""],d=l?Hn(l)==="online":!1,u=document.getElementById("beacon-container");u&&(d?(u.hidden=!1,Cu(u)):(Gw(),u.hidden=!0,u.innerHTML=""));const f=document.getElementById("liveness-container");f&&(d?(f.hidden=!1,Jw(f)):(f.hidden=!0,f.innerHTML=""));const h=document.getElementById("settings-container");h&&Yw(h)}else if(e==="call-demo"){const o=document.getElementById("call-simulation-container");o&&Cr(o)}}function c0(){const{identity:e}=_(),t=e?.displayName&&e.displayName!=="You"?e.displayName:"";$i(`
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
    ${t?"":`
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
  `,r=>{const o=r.get("name")?.trim()??"";if(!o)return;const s=t||r.get("myname")?.trim()||"",a=document.querySelector(".segmented__btn.segmented__btn--active[data-preset]")?.dataset.preset??"family",c=fv(o,a,e?.pubkey);if(s&&e?.pubkey){const d=_().groups[c];d&&J(c,{memberNames:{...d.memberNames,[e.pubkey]:s}})}const l=_().groups[c];l&&Hn(l)==="online"&&Gu(l).length>0&&$e(l.readRelays??[],l.writeRelays??[],c),Yn(),ae(async()=>{const{shouldPromptForNotifications:d,subscribeToPush:u,registerWithPushServer:f}=await import("./push-Bmopmp70.js");return{shouldPromptForNotifications:d,subscribeToPush:u,registerWithPushServer:f}},[],import.meta.url).then(({shouldPromptForNotifications:d,subscribeToPush:u,registerWithPushServer:f})=>{d()&&setTimeout(()=>{confirm("Enable notifications? We'll alert you in emergencies and remind you to check in.")&&u().then(async h=>{if(!h)return;const{hashGroupTag:p}=await ae(async()=>{const{hashGroupTag:b}=await Promise.resolve().then(()=>Ci);return{hashGroupTag:b}},void 0,import.meta.url),{groups:m}=_(),y=Object.values(m).map(b=>({tagHash:p(b.id),livenessInterval:b.livenessInterval}));await f(h,y),H("Notifications enabled","success")})},1e3)}).catch(()=>{})}),requestAnimationFrame(()=>{document.getElementById("modal-cancel-btn")?.addEventListener("click",()=>{document.getElementById("app-modal")?.close()}),document.querySelectorAll(".segmented__btn[data-preset]").forEach(r=>{r.addEventListener("click",()=>{document.querySelectorAll(".segmented__btn[data-preset]").forEach(o=>o.classList.remove("segmented__btn--active")),r.classList.add("segmented__btn--active")})})})}function Zr(){const e=window.location.hash;if(e.startsWith("#ack/")){let t;try{t=decodeURIComponent(e.slice(5))}catch{console.warn("[canary] Malformed ack fragment — ignoring."),window.location.hash="";return}window.location.hash="",document.dispatchEvent(new CustomEvent("canary:confirm-member",{detail:{token:t}}))}else if(e.startsWith("#inv/")){const t=e.slice(5);window.location.hash="",l0(t)}else if(e.startsWith("#j/")){const t=e.slice(3);window.location.hash="",/^[0-9a-f]{32}$/.test(t)?d0(t):H("Invalid invite link.","error")}else if(e.startsWith("#remote/")){let t=e.slice(8);try{t=decodeURIComponent(t)}catch{}window.location.hash="",u0(t)}}function l0(e){try{const t=Ov(e),n=iw(t),{identity:r}=_();if(!r?.pubkey){H("No local identity — create or import one first.","error");return}let o=document.getElementById("binary-join-modal");o||(o=document.createElement("dialog"),o.id="binary-join-modal",o.className="modal",document.body.appendChild(o),o.addEventListener("click",i=>{i.target===o&&o.close()}));const s=o;s.innerHTML=`
      <div class="modal__form invite-share">
        <h2 class="modal__title">Join ${j(n.groupName)}</h2>
        <p class="invite-hint">Invited by <code>${j(n.inviterPubkey.slice(0,8))}…</code></p>
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
    `,s.querySelector("#binary-join-cancel")?.addEventListener("click",()=>s.close()),s.querySelector("#binary-join-accept")?.addEventListener("click",()=>{const i=s.querySelector("#binary-join-confirm"),a=s.querySelector("#binary-join-error"),c=i?.value.trim()??"";if(!c){a&&(a.textContent="Please enter the confirmation words.",a.style.display="");return}try{const l=au(n),d=zv(l,c);if(Jv(d.groupId,d.nonce))throw new Error("This invite has already been used.");const u=d.groupId,{groups:f}=_(),h=Ou(f[u],{epoch:d.epoch,counter:d.counter,latestInviteIssuedAt:d.issuedAt});if(h)throw new Error(h);const p=new Set(d.members);p.add(r.pubkey);const m=_().settings,y=d.relays.length>0?d.relays:m.defaultWriteRelays?.length?[...m.defaultWriteRelays]:[He],b=Array.from(new Set([...m.defaultReadRelays?.length?m.defaultReadRelays:tt,...y])),E=y.length>0,L={id:u,name:d.groupName,seed:d.seed,members:Array.from(p),memberNames:d.memberNames??{},nostrEnabled:E,relays:d.relays,readRelays:b,writeRelays:y,wordlist:d.wordlist,wordCount:d.wordCount,counter:d.counter,usageOffset:d.usageOffset,rotationInterval:d.rotationInterval,encodingFormat:d.encodingFormat,usedInvites:[d.nonce],latestInviteIssuedAt:d.issuedAt,beaconInterval:d.beaconInterval,beaconPrecision:d.beaconPrecision,duressMode:"immediate",livenessInterval:d.rotationInterval,livenessCheckins:{},tolerance:d.tolerance,createdAt:Math.floor(Date.now()/1e3),admins:[...d.admins],epoch:d.epoch,consumedOps:[]},O={...f,[u]:L};te({groups:O,activeGroupId:u}),Yv(u,d.nonce),xi(),Yn(),E&&r&&$e(b,y,u).then(()=>{ke(u,{type:"member-join",pubkey:r.pubkey,displayName:r.displayName&&r.displayName!=="You"?r.displayName:void 0,timestamp:Math.floor(Date.now()/1e3),epoch:d.epoch,opId:crypto.randomUUID()})}),s.close(),H(`Joined ${d.groupName}`,"success")}catch(l){a&&(a.textContent=l instanceof Error?l.message:"Failed to join group.",a.style.display="")}}),s.showModal()}catch(t){H(t instanceof Error?t.message:"Invalid QR invite.","error")}}function Bs(e,t,n){const{identity:r}=_();if(!r?.pubkey||!r?.privkey)return;const o=Dv({envelope:e,joinerPrivkey:r.privkey,adminPubkey:t.adminPubkey,expectedInviteId:t.inviteId}),s=o.groupId,{groups:i}=_(),a=Ou(i[s],{epoch:o.epoch,counter:o.counter});if(a)throw new Error(a);const c=new Set(o.members);c.add(r.pubkey);const l={...o.memberNames??{}};r.displayName&&r.displayName!=="You"&&(l[r.pubkey]=r.displayName);const d=[...o.relays??[]],u=d.length>0?d:[He],f=Array.from(new Set([...tt,...u])),h=u.length>0,p={id:s,name:o.groupName,seed:o.seed,members:Array.from(c),memberNames:l,nostrEnabled:h,relays:d,readRelays:f,writeRelays:u,wordlist:o.wordlist,wordCount:o.wordCount,counter:o.counter,usageOffset:o.usageOffset,rotationInterval:o.rotationInterval,encodingFormat:o.encodingFormat,usedInvites:[],latestInviteIssuedAt:0,beaconInterval:o.beaconInterval,beaconPrecision:o.beaconPrecision,duressMode:"immediate",livenessInterval:o.rotationInterval,livenessCheckins:{},tolerance:o.tolerance,createdAt:Math.floor(Date.now()/1e3),admins:[...o.admins],epoch:o.epoch,consumedOps:[]},m={...i,[s]:p};te({groups:m,activeGroupId:s}),xi(),Yn(),h&&r&&$e(f,u,s).then(()=>{ke(s,{type:"member-join",pubkey:r.pubkey,displayName:r.displayName&&r.displayName!=="You"?r.displayName:void 0,timestamp:Math.floor(Date.now()/1e3),epoch:o.epoch,opId:crypto.randomUUID()})}),n.close(),H(`Joined ${o.groupName}`,"success")}function d0(e){const{identity:t,settings:n}=_();if(!t?.pubkey||!t?.privkey){H("No local identity — create or import one first.","error");return}const r=Array.from(new Set([...tt,...n.defaultWriteRelays??[]])),o=n.defaultWriteRelays??[He];let s=document.getElementById("relay-join-modal");s||(s=document.createElement("dialog"),s.id="relay-join-modal",s.className="modal",document.body.appendChild(s),s.addEventListener("click",l=>{l.target===s&&s.close()}));const i=s;i.innerHTML=`
    <div class="modal__form invite-share">
      <h2 class="modal__title">Joining...</h2>
      <p class="invite-hint" id="relay-join-status">Looking for invite on relay...</p>
      <div class="modal__actions">
        <button class="btn" id="relay-join-cancel" type="button">Cancel</button>
      </div>
    </div>
  `;let a=()=>{},c=()=>{};i.querySelector("#relay-join-cancel")?.addEventListener("click",()=>{a(),c(),i.close()}),i.showModal(),$e(r,o).then(()=>{a=vw({inviteId:e,readRelays:r,onToken(l){try{fu(l)}catch(p){const m=i.querySelector("#relay-join-status");m&&(m.textContent=p instanceof Error?p.message:"Invalid invite token.",m.style.color="var(--duress)");return}const d=l.relays?.length?l.relays:o,u=d,f=Array.from(new Set([...tt,...d])),h=i.querySelector("#relay-join-status");h&&(h.textContent=`Joining ${l.groupName}...`),$e(f,u).then(()=>{c=vu({inviteId:l.inviteId,adminPubkey:l.adminPubkey,readRelays:f,writeRelays:u,onWelcome(p){try{Bs(p,l,i)}catch{h&&(h.textContent="Failed to join — welcome message could not be decrypted.",h.style.color="var(--duress)")}},onError(p){h&&(h.textContent=p,h.style.color="var(--duress)")}})})},onError(l){const d=i.querySelector("#relay-join-status");d&&(d.textContent=l,d.style.color="var(--duress)")}})})}function u0(e){try{let t;try{t=cu(e)}catch{try{t=So(e)}catch{throw new Error("Invalid invite — could not decode token.")}}fu(t);const n=t,{identity:r,settings:o}=_();if(!r?.pubkey||!r?.privkey){H("No local identity — create or import one first.","error");return}const s=`${n.adminPubkey.slice(0,8)}…${n.adminPubkey.slice(-4)}`,i=n.relays?.length?n.relays:o.defaultWriteRelays,a=i,c=Array.from(new Set([...tt,...i])),l=Array.from(new Set([...c,...a]));let d=document.getElementById("remote-join-modal");d||(d=document.createElement("dialog"),d.id="remote-join-modal",d.className="modal",document.body.appendChild(d),d.addEventListener("click",h=>{h.target===d&&d.close()}));const u=d;let f=()=>{};u.innerHTML=`
      <div class="modal__form invite-share">
        <h2 class="modal__title">Remote Invite</h2>
        <p class="invite-hint">You've been invited to <strong>${j(n.groupName)}</strong> by <code>${j(s)}</code></p>

        <p class="invite-hint" id="remote-join-relay-status" style="color: var(--verified); font-weight: 500;">${l.length>0?"Connecting to relay...":""}</p>

        <div style="margin: 1rem 0;">
          <p class="invite-hint" style="font-weight: 500;">Or send this join code manually:</p>
          <div style="display: flex; align-items: center; gap: 0.5rem; justify-content: center; margin: 0.5rem 0;">
            <code style="font-size: 0.75rem; word-break: break-all; max-width: 80%;">${j(r.pubkey)}</code>
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
    `,l.length>0&&$e(c,a).then(()=>{const h=u.querySelector("#remote-join-relay-status");h&&(h.textContent="Waiting for admin to send group key..."),f=vu({inviteId:n.inviteId,adminPubkey:n.adminPubkey,readRelays:c,writeRelays:a,onWelcome(p){try{Bs(p,n,u)}catch{h&&(h.textContent="Auto-join failed — paste welcome message manually.",h.style.color="var(--duress)")}},onError(p){h&&(h.textContent=p,h.style.color="var(--duress)")}})}),u.querySelector("#remote-join-copy-pubkey")?.addEventListener("click",async h=>{const p=h.currentTarget;try{await navigator.clipboard.writeText(r.pubkey),p.textContent="Copied!",setTimeout(()=>{p.textContent="Copy"},1500)}catch{}}),u.querySelector("#remote-join-cancel")?.addEventListener("click",()=>{f(),u.close()}),u.querySelector("#remote-join-accept")?.addEventListener("click",async()=>{const h=u.querySelector("#remote-join-welcome-input"),p=u.querySelector("#remote-join-error"),m=(h?.value??"").replace(/[^A-Za-z0-9=+/]/g,"");if(!m){p&&(p.textContent="Please paste the welcome message.",p.style.display="");return}try{f(),Bs(m,n,u)}catch(y){p&&(p.textContent=y instanceof Error?y.message:"Failed to decrypt welcome message.",p.style.display="")}}),u.showModal()}catch(t){H(t instanceof Error?t.message:"Invalid remote invite.","error")}}function ju(){document.addEventListener("canary:create-group",()=>{c0()}),document.addEventListener("canary:show-invite",e=>{const{groupId:t}=e.detail,{groups:n}=_(),r=n[t];r&&Io(r)}),document.addEventListener("canary:confirm-member",e=>{const{identity:t,groups:n,activeGroupId:r}=_();if(!r||!t?.pubkey)return;const o=n[r];if(!o||!o.admins.includes(t.pubkey))return;const s=e.detail?.token??"";ae(async()=>{const{showConfirmMemberModal:i}=await Promise.resolve().then(()=>Aw);return{showConfirmMemberModal:i}},void 0,import.meta.url).then(({showConfirmMemberModal:i})=>{i(s)})}),document.addEventListener("canary:verify-call",e=>{const{groupId:t,pubkey:n}=e.detail;Qw(t,n)}),document.addEventListener("canary:pin-enable",e=>{const t=e.detail?.pin;!t||t.length<6||Mg(t).then(()=>{te({settings:{..._().settings,pinEnabled:!0}}),Bu()})}),document.addEventListener("canary:pin-disable",()=>{Og().then(()=>{te({settings:{..._().settings,pinEnabled:!1}}),Pu()})}),document.addEventListener("canary:lock",()=>{po(),Vi()}),document.addEventListener("canary:sync-message",e=>{const{groupId:t,message:n,sender:r}=e.detail,{activeGroupId:o}=_();if(n.type==="beacon"){if(t!==o)return;Hw(r,n.lat,n.lon,n.accuracy??2e4,n.timestamp)}else if(n.type==="duress-alert"){const s=n.subject||r,{identity:i}=_();if(i?.pubkey===s)return;iu(s,t,n.lat!=null?{lat:n.lat,lon:n.lon}:void 0,n.timestamp)}else n.type==="duress-clear"&&document.dispatchEvent(new CustomEvent("canary:duress-clear",{detail:{subject:n.subject,clearedBy:r,groupId:t}}))}),document.addEventListener("canary:resync",()=>{Xr()}),document.addEventListener("canary:vault-publish-now",()=>Yn()),document.addEventListener("visibilitychange",()=>{document.hidden||(console.info("[canary:boot] App foregrounded — reconnecting and syncing vault"),an(),ae(async()=>{const{disconnectRelays:e}=await Promise.resolve().then(()=>Fd);return{disconnectRelays:e}},void 0,import.meta.url).then(({disconnectRelays:e})=>{e(),Xr()}))})}async function f0(){let{identity:e}=_();const t=await yb({pubkey:e?.pubkey??"",privkey:e?.privkey}),n={pubkey:t.pubkey,privkey:t.privkey,displayName:e?.displayName??"You",signerType:"local"};(!e||e.pubkey!==n.pubkey)&&te({identity:Os(n,e)})}async function Xr(){const{groups:e,identity:t,settings:n}=_(),r=Object.keys(e).length,o=!!t?.privkey,s=[],i=[];for(const u of Object.values(e))s.push(...u.readRelays??[]),i.push(...u.writeRelays??[]),s.push(...u.relays??[]),i.push(...u.relays??[]);s.push(...n.defaultReadRelays??n.defaultRelays),i.push(...n.defaultWriteRelays??n.defaultRelays);const a=Se(s),c=Se(i),l=Se([...a,...c]).length;if(l===0){console.warn("[canary:boot] No relays found — sync disabled"),r>0&&H(`Sync disabled — ${r} group(s), no relays configured`,"warning",5e3);return}if(!o&&t?.signerType!=="nip07"){console.warn("[canary:boot] No privkey and no NIP-07 — sync disabled"),H("Sync disabled — no private key","warning",5e3);return}if(console.warn("[canary:boot] Read relays:",a,"Write relays:",c),o){await $e(a,c);try{const u=await o0(t.privkey,t.pubkey);if(u&&Object.keys(u).length>0){const{groups:f}=_(),h=s0(f,u),p=Object.keys(f).sort().join(","),m=Object.keys(h).sort().join(",");if(p!==m||Object.entries(h).some(([b,E])=>{const L=f[b];return L?E.epoch!==L.epoch||E.counter!==L.counter||E.usageOffset!==L.usageOffset||E.members.length!==L.members.length:!0})){te({groups:h});const b=Object.keys(h).length-Object.keys(f).length;b>0?H(`Restored ${b} group(s) from vault`,"success"):H("Synced from vault","success",1500)}}}catch(u){console.warn("[canary:vault] Vault fetch failed:",u)}Vb(),H(`Syncing via ${l} relay(s)`,"success",2e3),typeof Notification<"u"&&Notification.permission==="granted"&&ae(()=>import("./push-Bmopmp70.js"),[],import.meta.url).then(async({getExistingSubscription:u,registerWithPushServer:f})=>{const h=await u();if(h){const{hashGroupTag:p}=await ae(async()=>{const{hashGroupTag:y}=await Promise.resolve().then(()=>Ci);return{hashGroupTag:y}},void 0,import.meta.url),m=Object.values(e).map(y=>({tagHash:p(y.id),livenessInterval:y.livenessInterval}));await f(h,m)}}).catch(()=>{})}else{const{connectRelays:u}=await ae(async()=>{const{connectRelays:f}=await Promise.resolve().then(()=>Fd);return{connectRelays:f}},void 0,import.meta.url);u(a,c),H(`Connected to ${l} relay(s)`,"success",2e3)}const{fetchOwnProfile:d}=await ae(async()=>{const{fetchOwnProfile:u}=await Promise.resolve().then(()=>_u);return{fetchOwnProfile:u}},void 0,import.meta.url);if(d(),Wi(),o){const{startLivenessHeartbeat:u}=await ae(async()=>{const{startLivenessHeartbeat:f}=await Promise.resolve().then(()=>qb);return{startLivenessHeartbeat:f}},void 0,import.meta.url);u()}}function h0(e){return Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}function p0(e){const t=e.split(" ");let n=document.getElementById("recovery-phrase-modal");n||(n=document.createElement("dialog"),n.id="recovery-phrase-modal",n.className="modal",document.body.appendChild(n));const r=n;r.textContent="";const o=document.createElement("div");o.className="modal__form",o.style.maxWidth="420px";const s=document.createElement("h2");s.className="modal__title",s.textContent="Back up your recovery phrase",o.appendChild(s);const i=document.createElement("p");i.className="invite-hint",i.textContent="Write these words down in order. They're the only way to recover your account.",o.appendChild(i);const a=document.createElement("div");a.className="recovery-grid",a.style.cssText="display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin:1rem 0;",t.forEach((f,h)=>{const p=document.createElement("div");p.style.cssText="border:1px solid var(--border);border-radius:4px;padding:0.5rem;text-align:center;font-family:var(--font-mono,monospace);font-size:0.8rem;";const m=document.createElement("span");m.style.cssText="color:var(--text-muted);font-size:0.7rem;",m.textContent=`${h+1}. `;const y=document.createElement("span");y.style.fontWeight="500",y.textContent=f,p.append(m,y),a.appendChild(p)}),o.appendChild(a);const c=document.createElement("p");c.className="invite-hint",c.style.cssText="color:var(--duress);font-weight:500;",c.textContent="Do not share these words with anyone.",o.appendChild(c);const l=document.createElement("div");l.className="modal__actions",l.style.gap="0.5rem";const d=document.createElement("button");d.id="recovery-phrase-copy",d.className="btn btn--primary",d.type="button",d.textContent="Copy words",d.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(e),d.textContent="Copied!",setTimeout(()=>{d.textContent="Copy words"},2e3)}catch{}});const u=document.createElement("button");u.id="recovery-phrase-skip",u.className="btn",u.type="button",u.textContent="Skip for now",u.addEventListener("click",()=>r.close()),l.append(d,u),o.appendChild(l),r.appendChild(o),r.showModal()}function m0(){const e=document.getElementById("app");e.innerHTML=`
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
          <p class="settings-hint" style="margin-bottom: 0.5rem;">Paste your 12-word recovery phrase to restore your account.</p>
          <form id="mnemonic-login-form" autocomplete="off" style="display: flex; flex-direction: column; gap: 0.375rem;">
            <textarea class="input" id="login-mnemonic" placeholder="Enter your 12 recovery words..." rows="3" style="width: 100%; font-size: 0.8rem; resize: none; padding: 0.5rem; font-family: var(--font-mono, monospace);"></textarea>
            <button class="btn btn--primary" type="submit">Recover account</button>
          </form>
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
                ${(_().settings.defaultWriteRelays??_().settings.defaultRelays).map((r,o)=>`
                  <li style="display: flex; align-items: center; gap: 0.25rem; margin-bottom: 0.25rem;">
                    <span class="settings-hint" style="flex: 1; font-size: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0;">${j(r)}</span>
                    <button class="btn btn--ghost btn--sm login-relay-remove" data-relay-index="${o}" type="button" style="padding: 0 0.25rem; font-size: 0.7rem;">✕</button>
                  </li>
                `).join("")}
              </ul>
              <div style="display: flex; gap: 0.25rem;">
                <input class="input" type="url" id="login-relay-input" placeholder="wss://relay.example.com" style="flex: 1; font-size: 0.75rem; padding: 0.375rem;" />
                <button class="btn btn--ghost btn--sm" id="login-relay-add" type="button">Add</button>
              </div>
              <p class="settings-hint" style="font-size: 0.7rem; margin: 0.5rem 0 0 0;">Read relays: ${tt.map(r=>j(r.replace("wss://",""))).join(", ")} + write relay(s)</p>
            </div>
          </details>
        </div>

      </div>
    </div>
  `,e.querySelector("#offline-form")?.addEventListener("submit",async r=>{r.preventDefault();const o=e.querySelector("#offline-name"),s=o?.value.trim();if(!s){o?.focus();return}const{generateMnemonic:i,mnemonicToKeypair:a}=await ae(async()=>{const{generateMnemonic:f,mnemonicToKeypair:h}=await Promise.resolve().then(()=>_a);return{generateMnemonic:f,mnemonicToKeypair:h}},void 0,import.meta.url),c=i(),{pubkey:l,privkey:d}=a(c);te({identity:{pubkey:l,privkey:d,mnemonic:c,signerType:"local",displayName:s}}),await Cn();const{publishKind0:u}=await ae(async()=>{const{publishKind0:f}=await Promise.resolve().then(()=>_u);return{publishKind0:f}},void 0,import.meta.url);u(s,d),p0(c)}),e.querySelector("#mnemonic-login-form")?.addEventListener("submit",async r=>{r.preventDefault();const s=e.querySelector("#login-mnemonic")?.value.trim();if(!s)return;if(s.split(/\s+/).length!==12){alert("Recovery phrase must be exactly 12 words.");return}try{const{validateMnemonic:a,mnemonicToKeypair:c}=await ae(async()=>{const{validateMnemonic:u,mnemonicToKeypair:f}=await Promise.resolve().then(()=>_a);return{validateMnemonic:u,mnemonicToKeypair:f}},void 0,import.meta.url);if(!a(s)){alert("Invalid recovery phrase. Please check your words and try again.");return}const{pubkey:l,privkey:d}=c(s);te({identity:{pubkey:l,privkey:d,mnemonic:s,signerType:"local",displayName:"You"}}),await Cn()}catch{alert("Invalid recovery phrase.")}}),e.querySelector("#nsec-login-form")?.addEventListener("submit",async r=>{r.preventDefault();const s=e.querySelector("#login-nsec")?.value.trim();if(s)try{const i=_().identity,a=Jd(s);if(a.type!=="nsec"){alert("Not a valid nsec.");return}const c=a.data,l=h0(c),d=wo(c);te({identity:Os({pubkey:d,privkey:l,signerType:"local",displayName:"You"},i)}),await Cn()}catch(i){alert(i instanceof Error?i.message:"Invalid nsec format.")}}),e.querySelector("#login-nip07")?.addEventListener("click",async()=>{if(!Od()){alert("No Nostr extension found. Install Alby, nos2x, or another NIP-07 extension and reload.");return}try{const r=_().identity,o=await window.nostr.getPublicKey();te({identity:Os({pubkey:o,signerType:"nip07",displayName:"You"},r)}),await Cn()}catch{alert("Extension rejected the request.")}});function t(){const r=e.querySelector("#login-relay-list");if(!r)return;const o=_().settings.defaultWriteRelays??_().settings.defaultRelays;r.innerHTML=o.map((s,i)=>`
      <li style="display: flex; align-items: center; gap: 0.25rem; margin-bottom: 0.25rem;">
        <span class="settings-hint" style="flex: 1; font-size: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0;">${j(s)}</span>
        <button class="btn btn--ghost btn--sm login-relay-remove" data-relay-index="${i}" type="button" style="padding: 0 0.25rem; font-size: 0.7rem;">✕</button>
      </li>
    `).join(""),n()}function n(){e.querySelectorAll(".login-relay-remove").forEach(r=>{r.addEventListener("click",()=>{const o=Number(r.dataset.relayIndex),s=[..._().settings.defaultWriteRelays??_().settings.defaultRelays];s.splice(o,1),te({settings:{..._().settings,defaultWriteRelays:s,defaultRelays:s}}),t()})})}n(),e.querySelector("#login-relay-add")?.addEventListener("click",()=>{const r=e.querySelector("#login-relay-input"),o=r?.value.trim();if(!o||!i0(o))return;const s=[..._().settings.defaultWriteRelays??_().settings.defaultRelays];s.includes(o)||(s.push(o),te({settings:{..._().settings,defaultWriteRelays:s,defaultRelays:s}}),t()),r&&(r.value="")}),e.querySelector("#login-relay-input")?.addEventListener("keydown",r=>{r.key==="Enter"&&(r.preventDefault(),e.querySelector("#login-relay-add")?.click())})}async function Cn(){Uu(),window.location.hash==="#call"&&te({view:"call-demo"});const e=document.getElementById("header");e&&Li(e),Du(),zi(),Tr(Wi),Tr(g0),ju(),Zr(),window.addEventListener("hashchange",()=>Zr()),Xr()}let tn=null;const y0=3e4;function g0(){const{identity:e,groups:t}=_();!e?.privkey||!e?.pubkey||Object.keys(t).length!==0&&(tn&&clearTimeout(tn),tn=setTimeout(()=>{const{identity:n,groups:r}=_();n?.privkey&&n?.pubkey&&Object.keys(r).length>0&&Mu(r,n.privkey,n.pubkey)},y0))}function Yn(){tn&&clearTimeout(tn);const{identity:e,groups:t}=_();e?.privkey&&e?.pubkey&&Object.keys(t).length>0&&Mu(t,e.privkey,e.pubkey).then(()=>console.info("[canary:vault] Vault published OK")).catch(n=>{console.error("[canary:vault] Vault publish FAILED:",n),H(`Vault publish failed: ${n instanceof Error?n.message:n}`,"error")})}window.addEventListener("beforeunload",()=>{tn&&Yn()});async function uc(){if(yd())Vi();else{Lg();const{identity:e}=_();e?.pubkey?await Cn():m0()}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{uc()}):uc();
