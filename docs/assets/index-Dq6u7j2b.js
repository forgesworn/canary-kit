const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./maplibre-gl-DwUhsmFz.css"])))=>i.map(i=>d[i]);
(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();const Ju="modulepreload",Yu=function(e,t){return new URL(e,t).href},Qi={},ce=function(t,n,r){let o=Promise.resolve();if(n&&n.length>0){let l=function(d){return Promise.all(d.map(u=>Promise.resolve(u).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};const i=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),c=a?.nonce||a?.getAttribute("nonce");o=l(n.map(d=>{if(d=Yu(d,r),d in Qi)return;Qi[d]=!0;const u=d.endsWith(".css"),f=u?'[rel="stylesheet"]':"";if(r)for(let p=i.length-1;p>=0;p--){const m=i[p];if(m.href===d&&(!u||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${f}`))return;const h=document.createElement("link");if(h.rel=u?"stylesheet":Ju,u||(h.as="script"),h.crossOrigin="",h.href=d,c&&h.setAttribute("nonce",c),document.head.appendChild(h),u)return new Promise((p,m)=>{h.addEventListener("load",p),h.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${d}`)))})}))}function s(i){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=i,window.dispatchEvent(a),!a.defaultPrevented)throw i}return o.then(i=>{for(const a of i||[])a.status==="rejected"&&s(a.reason);return t().catch(s)})},ot=["wss://relay.damus.io","wss://nos.lol","wss://relay.nostr.band"],Ge="wss://relay.trotters.cc";function zn(e){return e.readRelays?.length>0||e.writeRelays?.length>0||e.relays?.length>0?"online":"offline"}function Zu(e){try{const t=new URL(e);return t.pathname=t.pathname.replace(/\/+$/,""),t.toString()}catch{return e.replace(/\/+$/,"")}}function Se(e){const t=new Set,n=[];for(const r of e){const o=Zu(r);t.has(o)||(t.add(o),n.push(o))}return n}function Xu(e){return Se([...e.readRelays??[],...e.writeRelays??[],...e.relays??[]])}const Qu={view:"groups",groups:{},activeGroupId:null,identity:null,settings:{theme:"dark",pinEnabled:!1,autoLockMinutes:5,defaultRelays:[Ge],defaultReadRelays:[...ot,Ge],defaultWriteRelays:[Ge]}};let He=structuredClone(Qu);const cs=new Set;function io(){for(const e of cs)try{e()}catch(t){console.error("[canary:state] subscriber threw:",t)}}function x(){return He}function te(e){He={...He,...e},io()}function J(e,t){const n=He.groups[e];if(!n){console.warn(`[canary:state] updateGroup: unknown group id "${e}"`);return}He={...He,groups:{...He.groups,[e]:{...n,...t}}},io()}function Or(e){return cs.add(e),()=>{cs.delete(e)}}function mc(e){He=e,io()}function ef(){const e={...He};e.identity&&(e.identity={...e.identity,privkey:"",mnemonic:void 0,nsec:void 0});const t={};for(const[n,r]of Object.entries(e.groups))t[n]={...r,seed:""};e.groups=t,He=e,io()}const tf=6e5,nf=16,ls=12;async function yc(e,t){const n=await crypto.subtle.importKey("raw",new TextEncoder().encode(e),"PBKDF2",!1,["deriveKey"]);return crypto.subtle.deriveKey({name:"PBKDF2",salt:t,iterations:tf,hash:"SHA-256"},n,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}async function gc(e,t){const n=crypto.getRandomValues(new Uint8Array(ls)),r=await crypto.subtle.encrypt({name:"AES-GCM",iv:n},t,new TextEncoder().encode(e)),o=new Uint8Array(n.length+new Uint8Array(r).length);o.set(n),o.set(new Uint8Array(r),n.length);let s="";for(let i=0;i<o.length;i++)s+=String.fromCharCode(o[i]);return btoa(s)}async function ao(e,t){const n=Uint8Array.from(atob(e),i=>i.charCodeAt(0)),r=n.slice(0,ls),o=n.slice(ls),s=await crypto.subtle.decrypt({name:"AES-GCM",iv:r},t,o);return new TextDecoder().decode(s)}function rf(){return crypto.getRandomValues(new Uint8Array(nf))}function of(e){return btoa(String.fromCharCode(...e))}function bc(e){return Uint8Array.from(atob(e),t=>t.charCodeAt(0))}function Fs(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array"}function Ae(e,t=""){if(!Number.isSafeInteger(e)||e<0){const n=t&&`"${t}" `;throw new Error(`${n}expected integer >= 0, got ${e}`)}}function G(e,t,n=""){const r=Fs(e),o=e?.length,s=t!==void 0;if(!r||s&&o!==t){const i=n&&`"${n}" `,a=s?` of length ${t}`:"",c=r?`length=${o}`:`type=${typeof e}`;throw new Error(i+"expected Uint8Array"+a+", got "+c)}return e}function Jn(e){if(typeof e!="function"||typeof e.create!="function")throw new Error("Hash must wrapped by utils.createHasher");Ae(e.outputLen),Ae(e.blockLen)}function Br(e,t=!0){if(e.destroyed)throw new Error("Hash instance has been destroyed");if(t&&e.finished)throw new Error("Hash#digest() has already been called")}function sf(e,t){G(e,void 0,"digestInto() output");const n=t.outputLen;if(e.length<n)throw new Error('"digestInto() output" expected to be of length >='+n)}function Ve(...e){for(let t=0;t<e.length;t++)e[t].fill(0)}function Mt(e){return new DataView(e.buffer,e.byteOffset,e.byteLength)}function Be(e,t){return e<<32-t|e>>>t}function rr(e,t){return e<<t|e>>>32-t>>>0}const vc=typeof Uint8Array.from([]).toHex=="function"&&typeof Uint8Array.fromHex=="function",af=Array.from({length:256},(e,t)=>t.toString(16).padStart(2,"0"));function q(e){if(G(e),vc)return e.toHex();let t="";for(let n=0;n<e.length;n++)t+=af[e[n]];return t}const Ye={_0:48,_9:57,A:65,F:70,a:97,f:102};function ea(e){if(e>=Ye._0&&e<=Ye._9)return e-Ye._0;if(e>=Ye.A&&e<=Ye.F)return e-(Ye.A-10);if(e>=Ye.a&&e<=Ye.f)return e-(Ye.a-10)}function z(e){if(typeof e!="string")throw new Error("hex string expected, got "+typeof e);if(vc)return Uint8Array.fromHex(e);const t=e.length,n=t/2;if(t%2)throw new Error("hex string expected, got unpadded hex of length "+t);const r=new Uint8Array(n);for(let o=0,s=0;o<n;o++,s+=2){const i=ea(e.charCodeAt(s)),a=ea(e.charCodeAt(s+1));if(i===void 0||a===void 0){const c=e[s]+e[s+1];throw new Error('hex string expected, got non-hex character "'+c+'" at index '+s)}r[o]=i*16+a}return r}function cf(e){if(typeof e!="string")throw new Error("string expected");return new Uint8Array(new TextEncoder().encode(e))}function ta(e,t=""){return typeof e=="string"?cf(e):G(e,void 0,t)}function oe(...e){let t=0;for(let r=0;r<e.length;r++){const o=e[r];G(o),t+=o.length}const n=new Uint8Array(t);for(let r=0,o=0;r<e.length;r++){const s=e[r];n.set(s,o),o+=s.length}return n}function lf(e,t){if(t!==void 0&&{}.toString.call(t)!=="[object Object]")throw new Error("options must be object or undefined");return Object.assign(e,t)}function Gs(e,t={}){const n=(o,s)=>e(s).update(o).digest(),r=e(void 0);return n.outputLen=r.outputLen,n.blockLen=r.blockLen,n.create=o=>e(o),Object.assign(n,t),Object.freeze(n)}function Et(e=32){const t=typeof globalThis=="object"?globalThis.crypto:null;if(typeof t?.getRandomValues!="function")throw new Error("crypto.getRandomValues must be defined");return t.getRandomValues(new Uint8Array(e))}const wc=e=>({oid:Uint8Array.from([6,9,96,134,72,1,101,3,4,2,e])});class Ec{oHash;iHash;blockLen;outputLen;finished=!1;destroyed=!1;constructor(t,n){if(Jn(t),G(n,void 0,"key"),this.iHash=t.create(),typeof this.iHash.update!="function")throw new Error("Expected instance of class which extends utils.Hash");this.blockLen=this.iHash.blockLen,this.outputLen=this.iHash.outputLen;const r=this.blockLen,o=new Uint8Array(r);o.set(n.length>r?t.create().update(n).digest():n);for(let s=0;s<o.length;s++)o[s]^=54;this.iHash.update(o),this.oHash=t.create();for(let s=0;s<o.length;s++)o[s]^=106;this.oHash.update(o),Ve(o)}update(t){return Br(this),this.iHash.update(t),this}digestInto(t){Br(this),G(t,this.outputLen,"output"),this.finished=!0,this.iHash.digestInto(t),this.oHash.update(t),this.oHash.digestInto(t),this.destroy()}digest(){const t=new Uint8Array(this.oHash.outputLen);return this.digestInto(t),t}_cloneInto(t){t||=Object.create(Object.getPrototypeOf(this),{});const{oHash:n,iHash:r,finished:o,destroyed:s,blockLen:i,outputLen:a}=this;return t=t,t.finished=o,t.destroyed=s,t.blockLen=i,t.outputLen=a,t.oHash=n._cloneInto(t.oHash),t.iHash=r._cloneInto(t.iHash),t}clone(){return this._cloneInto()}destroy(){this.destroyed=!0,this.oHash.destroy(),this.iHash.destroy()}}const st=(e,t,n)=>new Ec(e,t).update(n).digest();st.create=(e,t)=>new Ec(e,t);function df(e,t,n,r){Jn(e);const o=lf({dkLen:32,asyncTick:10},r),{c:s,dkLen:i,asyncTick:a}=o;if(Ae(s,"c"),Ae(i,"dkLen"),Ae(a,"asyncTick"),s<1)throw new Error("iterations (c) must be >= 1");const c=ta(t,"password"),l=ta(n,"salt"),d=new Uint8Array(i),u=st.create(e,c),f=u._cloneInto().update(l);return{c:s,dkLen:i,asyncTick:a,DK:d,PRF:u,PRFSalt:f}}function uf(e,t,n,r,o){return e.destroy(),t.destroy(),r&&r.destroy(),Ve(o),n}function ff(e,t,n,r){const{c:o,dkLen:s,DK:i,PRF:a,PRFSalt:c}=df(e,t,n,r);let l;const d=new Uint8Array(4),u=Mt(d),f=new Uint8Array(a.outputLen);for(let h=1,p=0;p<s;h++,p+=a.outputLen){const m=i.subarray(p,p+a.outputLen);u.setInt32(0,h,!1),(l=c._cloneInto(l)).update(d).digestInto(f),m.set(f.subarray(0,m.length));for(let y=1;y<o;y++){a._cloneInto(l).update(f).digestInto(f);for(let b=0;b<m.length;b++)m[b]^=f[b]}}return uf(a,c,i,l,f)}function hf(e,t,n){return e&t^~e&n}function pf(e,t,n){return e&t^e&n^t&n}class Vs{blockLen;outputLen;padOffset;isLE;buffer;view;finished=!1;length=0;pos=0;destroyed=!1;constructor(t,n,r,o){this.blockLen=t,this.outputLen=n,this.padOffset=r,this.isLE=o,this.buffer=new Uint8Array(t),this.view=Mt(this.buffer)}update(t){Br(this),G(t);const{view:n,buffer:r,blockLen:o}=this,s=t.length;for(let i=0;i<s;){const a=Math.min(o-this.pos,s-i);if(a===o){const c=Mt(t);for(;o<=s-i;i+=o)this.process(c,i);continue}r.set(t.subarray(i,i+a),this.pos),this.pos+=a,i+=a,this.pos===o&&(this.process(n,0),this.pos=0)}return this.length+=t.length,this.roundClean(),this}digestInto(t){Br(this),sf(t,this),this.finished=!0;const{buffer:n,view:r,blockLen:o,isLE:s}=this;let{pos:i}=this;n[i++]=128,Ve(this.buffer.subarray(i)),this.padOffset>o-i&&(this.process(r,0),i=0);for(let u=i;u<o;u++)n[u]=0;r.setBigUint64(o-8,BigInt(this.length*8),s),this.process(r,0);const a=Mt(t),c=this.outputLen;if(c%4)throw new Error("_sha2: outputLen must be aligned to 32bit");const l=c/4,d=this.get();if(l>d.length)throw new Error("_sha2: outputLen bigger than state");for(let u=0;u<l;u++)a.setUint32(4*u,d[u],s)}digest(){const{buffer:t,outputLen:n}=this;this.digestInto(t);const r=t.slice(0,n);return this.destroy(),r}_cloneInto(t){t||=new this.constructor,t.set(...this.get());const{blockLen:n,buffer:r,length:o,finished:s,destroyed:i,pos:a}=this;return t.destroyed=i,t.finished=s,t.length=o,t.pos=a,o%n&&t.buffer.set(r),t}clone(){return this._cloneInto()}}const ct=Uint32Array.from([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),ue=Uint32Array.from([1779033703,4089235720,3144134277,2227873595,1013904242,4271175723,2773480762,1595750129,1359893119,2917565137,2600822924,725511199,528734635,4215389547,1541459225,327033209]),or=BigInt(2**32-1),na=BigInt(32);function mf(e,t=!1){return t?{h:Number(e&or),l:Number(e>>na&or)}:{h:Number(e>>na&or)|0,l:Number(e&or)|0}}function yf(e,t=!1){const n=e.length;let r=new Uint32Array(n),o=new Uint32Array(n);for(let s=0;s<n;s++){const{h:i,l:a}=mf(e[s],t);[r[s],o[s]]=[i,a]}return[r,o]}const ra=(e,t,n)=>e>>>n,oa=(e,t,n)=>e<<32-n|t>>>n,Gt=(e,t,n)=>e>>>n|t<<32-n,Vt=(e,t,n)=>e<<32-n|t>>>n,sr=(e,t,n)=>e<<64-n|t>>>n-32,ir=(e,t,n)=>e>>>n-32|t<<64-n;function Ze(e,t,n,r){const o=(t>>>0)+(r>>>0);return{h:e+n+(o/2**32|0)|0,l:o|0}}const gf=(e,t,n)=>(e>>>0)+(t>>>0)+(n>>>0),bf=(e,t,n,r)=>t+n+r+(e/2**32|0)|0,vf=(e,t,n,r)=>(e>>>0)+(t>>>0)+(n>>>0)+(r>>>0),wf=(e,t,n,r,o)=>t+n+r+o+(e/2**32|0)|0,Ef=(e,t,n,r,o)=>(e>>>0)+(t>>>0)+(n>>>0)+(r>>>0)+(o>>>0),kf=(e,t,n,r,o,s)=>t+n+r+o+s+(e/2**32|0)|0,_f=Uint32Array.from([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),lt=new Uint32Array(64);class xf extends Vs{constructor(t){super(64,t,8,!1)}get(){const{A:t,B:n,C:r,D:o,E:s,F:i,G:a,H:c}=this;return[t,n,r,o,s,i,a,c]}set(t,n,r,o,s,i,a,c){this.A=t|0,this.B=n|0,this.C=r|0,this.D=o|0,this.E=s|0,this.F=i|0,this.G=a|0,this.H=c|0}process(t,n){for(let u=0;u<16;u++,n+=4)lt[u]=t.getUint32(n,!1);for(let u=16;u<64;u++){const f=lt[u-15],h=lt[u-2],p=Be(f,7)^Be(f,18)^f>>>3,m=Be(h,17)^Be(h,19)^h>>>10;lt[u]=m+lt[u-7]+p+lt[u-16]|0}let{A:r,B:o,C:s,D:i,E:a,F:c,G:l,H:d}=this;for(let u=0;u<64;u++){const f=Be(a,6)^Be(a,11)^Be(a,25),h=d+f+hf(a,c,l)+_f[u]+lt[u]|0,m=(Be(r,2)^Be(r,13)^Be(r,22))+pf(r,o,s)|0;d=l,l=c,c=a,a=i+h|0,i=s,s=o,o=r,r=h+m|0}r=r+this.A|0,o=o+this.B|0,s=s+this.C|0,i=i+this.D|0,a=a+this.E|0,c=c+this.F|0,l=l+this.G|0,d=d+this.H|0,this.set(r,o,s,i,a,c,l,d)}roundClean(){Ve(lt)}destroy(){this.set(0,0,0,0,0,0,0,0),Ve(this.buffer)}}class Sf extends xf{A=ct[0]|0;B=ct[1]|0;C=ct[2]|0;D=ct[3]|0;E=ct[4]|0;F=ct[5]|0;G=ct[6]|0;H=ct[7]|0;constructor(){super(32)}}const kc=yf(["0x428a2f98d728ae22","0x7137449123ef65cd","0xb5c0fbcfec4d3b2f","0xe9b5dba58189dbbc","0x3956c25bf348b538","0x59f111f1b605d019","0x923f82a4af194f9b","0xab1c5ed5da6d8118","0xd807aa98a3030242","0x12835b0145706fbe","0x243185be4ee4b28c","0x550c7dc3d5ffb4e2","0x72be5d74f27b896f","0x80deb1fe3b1696b1","0x9bdc06a725c71235","0xc19bf174cf692694","0xe49b69c19ef14ad2","0xefbe4786384f25e3","0x0fc19dc68b8cd5b5","0x240ca1cc77ac9c65","0x2de92c6f592b0275","0x4a7484aa6ea6e483","0x5cb0a9dcbd41fbd4","0x76f988da831153b5","0x983e5152ee66dfab","0xa831c66d2db43210","0xb00327c898fb213f","0xbf597fc7beef0ee4","0xc6e00bf33da88fc2","0xd5a79147930aa725","0x06ca6351e003826f","0x142929670a0e6e70","0x27b70a8546d22ffc","0x2e1b21385c26c926","0x4d2c6dfc5ac42aed","0x53380d139d95b3df","0x650a73548baf63de","0x766a0abb3c77b2a8","0x81c2c92e47edaee6","0x92722c851482353b","0xa2bfe8a14cf10364","0xa81a664bbc423001","0xc24b8b70d0f89791","0xc76c51a30654be30","0xd192e819d6ef5218","0xd69906245565a910","0xf40e35855771202a","0x106aa07032bbd1b8","0x19a4c116b8d2d0c8","0x1e376c085141ab53","0x2748774cdf8eeb99","0x34b0bcb5e19b48a8","0x391c0cb3c5c95a63","0x4ed8aa4ae3418acb","0x5b9cca4f7763e373","0x682e6ff3d6b2b8a3","0x748f82ee5defb2fc","0x78a5636f43172f60","0x84c87814a1f0ab72","0x8cc702081a6439ec","0x90befffa23631e28","0xa4506cebde82bde9","0xbef9a3f7b2c67915","0xc67178f2e372532b","0xca273eceea26619c","0xd186b8c721c0c207","0xeada7dd6cde0eb1e","0xf57d4f7fee6ed178","0x06f067aa72176fba","0x0a637dc5a2c898a6","0x113f9804bef90dae","0x1b710b35131c471b","0x28db77f523047d84","0x32caab7b40c72493","0x3c9ebe0a15c9bebc","0x431d67c49c100d4c","0x4cc5d4becb3e42b6","0x597f299cfc657e2a","0x5fcb6fab3ad6faec","0x6c44198c4a475817"].map(e=>BigInt(e))),If=kc[0],Af=kc[1],dt=new Uint32Array(80),ut=new Uint32Array(80);class Rf extends Vs{constructor(t){super(128,t,16,!1)}get(){const{Ah:t,Al:n,Bh:r,Bl:o,Ch:s,Cl:i,Dh:a,Dl:c,Eh:l,El:d,Fh:u,Fl:f,Gh:h,Gl:p,Hh:m,Hl:y}=this;return[t,n,r,o,s,i,a,c,l,d,u,f,h,p,m,y]}set(t,n,r,o,s,i,a,c,l,d,u,f,h,p,m,y){this.Ah=t|0,this.Al=n|0,this.Bh=r|0,this.Bl=o|0,this.Ch=s|0,this.Cl=i|0,this.Dh=a|0,this.Dl=c|0,this.Eh=l|0,this.El=d|0,this.Fh=u|0,this.Fl=f|0,this.Gh=h|0,this.Gl=p|0,this.Hh=m|0,this.Hl=y|0}process(t,n){for(let T=0;T<16;T++,n+=4)dt[T]=t.getUint32(n),ut[T]=t.getUint32(n+=4);for(let T=16;T<80;T++){const O=dt[T-15]|0,N=ut[T-15]|0,$=Gt(O,N,1)^Gt(O,N,8)^ra(O,N,7),w=Vt(O,N,1)^Vt(O,N,8)^oa(O,N,7),v=dt[T-2]|0,g=ut[T-2]|0,_=Gt(v,g,19)^sr(v,g,61)^ra(v,g,6),S=Vt(v,g,19)^ir(v,g,61)^oa(v,g,6),R=vf(w,S,ut[T-7],ut[T-16]),k=wf(R,$,_,dt[T-7],dt[T-16]);dt[T]=k|0,ut[T]=R|0}let{Ah:r,Al:o,Bh:s,Bl:i,Ch:a,Cl:c,Dh:l,Dl:d,Eh:u,El:f,Fh:h,Fl:p,Gh:m,Gl:y,Hh:b,Hl:E}=this;for(let T=0;T<80;T++){const O=Gt(u,f,14)^Gt(u,f,18)^sr(u,f,41),N=Vt(u,f,14)^Vt(u,f,18)^ir(u,f,41),$=u&h^~u&m,w=f&p^~f&y,v=Ef(E,N,w,Af[T],ut[T]),g=kf(v,b,O,$,If[T],dt[T]),_=v|0,S=Gt(r,o,28)^sr(r,o,34)^sr(r,o,39),R=Vt(r,o,28)^ir(r,o,34)^ir(r,o,39),k=r&s^r&a^s&a,A=o&i^o&c^i&c;b=m|0,E=y|0,m=h|0,y=p|0,h=u|0,p=f|0,{h:u,l:f}=Ze(l|0,d|0,g|0,_|0),l=a|0,d=c|0,a=s|0,c=i|0,s=r|0,i=o|0;const I=gf(_,R,A);r=bf(I,g,S,k),o=I|0}({h:r,l:o}=Ze(this.Ah|0,this.Al|0,r|0,o|0)),{h:s,l:i}=Ze(this.Bh|0,this.Bl|0,s|0,i|0),{h:a,l:c}=Ze(this.Ch|0,this.Cl|0,a|0,c|0),{h:l,l:d}=Ze(this.Dh|0,this.Dl|0,l|0,d|0),{h:u,l:f}=Ze(this.Eh|0,this.El|0,u|0,f|0),{h,l:p}=Ze(this.Fh|0,this.Fl|0,h|0,p|0),{h:m,l:y}=Ze(this.Gh|0,this.Gl|0,m|0,y|0),{h:b,l:E}=Ze(this.Hh|0,this.Hl|0,b|0,E|0),this.set(r,o,s,i,a,c,l,d,u,f,h,p,m,y,b,E)}roundClean(){Ve(dt,ut)}destroy(){Ve(this.buffer),this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)}}class Cf extends Rf{Ah=ue[0]|0;Al=ue[1]|0;Bh=ue[2]|0;Bl=ue[3]|0;Ch=ue[4]|0;Cl=ue[5]|0;Dh=ue[6]|0;Dl=ue[7]|0;Eh=ue[8]|0;El=ue[9]|0;Fh=ue[10]|0;Fl=ue[11]|0;Gh=ue[12]|0;Gl=ue[13]|0;Hh=ue[14]|0;Hl=ue[15]|0;constructor(){super(64)}}const ie=Gs(()=>new Sf,wc(1)),ds=Gs(()=>new Cf,wc(3));function sn(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array"}function Tf(e){if(!sn(e))throw new Error("Uint8Array expected")}function _c(e,t){return Array.isArray(t)?t.length===0?!0:e?t.every(n=>typeof n=="string"):t.every(n=>Number.isSafeInteger(n)):!1}function xc(e){if(typeof e!="function")throw new Error("function expected");return!0}function Pt(e,t){if(typeof t!="string")throw new Error(`${e}: string expected`);return!0}function pn(e){if(!Number.isSafeInteger(e))throw new Error(`invalid integer: ${e}`)}function Pr(e){if(!Array.isArray(e))throw new Error("array expected")}function Ur(e,t){if(!_c(!0,t))throw new Error(`${e}: array of strings expected`)}function Ks(e,t){if(!_c(!1,t))throw new Error(`${e}: array of numbers expected`)}function Yn(...e){const t=s=>s,n=(s,i)=>a=>s(i(a)),r=e.map(s=>s.encode).reduceRight(n,t),o=e.map(s=>s.decode).reduce(n,t);return{encode:r,decode:o}}function co(e){const t=typeof e=="string"?e.split(""):e,n=t.length;Ur("alphabet",t);const r=new Map(t.map((o,s)=>[o,s]));return{encode:o=>(Pr(o),o.map(s=>{if(!Number.isSafeInteger(s)||s<0||s>=n)throw new Error(`alphabet.encode: digit index outside alphabet "${s}". Allowed: ${e}`);return t[s]})),decode:o=>(Pr(o),o.map(s=>{Pt("alphabet.decode",s);const i=r.get(s);if(i===void 0)throw new Error(`Unknown letter: "${s}". Allowed: ${e}`);return i}))}}function lo(e=""){return Pt("join",e),{encode:t=>(Ur("join.decode",t),t.join(e)),decode:t=>(Pt("join.decode",t),t.split(e))}}function Sc(e,t="="){return pn(e),Pt("padding",t),{encode(n){for(Ur("padding.encode",n);n.length*e%8;)n.push(t);return n},decode(n){Ur("padding.decode",n);let r=n.length;if(r*e%8)throw new Error("padding: invalid, string should have whole number of bytes");for(;r>0&&n[r-1]===t;r--)if((r-1)*e%8===0)throw new Error("padding: invalid, string has too much padding");return n.slice(0,r)}}}function us(e,t,n){if(t<2)throw new Error(`convertRadix: invalid from=${t}, base cannot be less than 2`);if(n<2)throw new Error(`convertRadix: invalid to=${n}, base cannot be less than 2`);if(Pr(e),!e.length)return[];let r=0;const o=[],s=Array.from(e,a=>{if(pn(a),a<0||a>=t)throw new Error(`invalid integer: ${a}`);return a}),i=s.length;for(;;){let a=0,c=!0;for(let l=r;l<i;l++){const d=s[l],u=t*a,f=u+d;if(!Number.isSafeInteger(f)||u/t!==a||f-d!==u)throw new Error("convertRadix: carry overflow");const h=f/n;a=f%n;const p=Math.floor(h);if(s[l]=p,!Number.isSafeInteger(p)||p*n+a!==f)throw new Error("convertRadix: carry overflow");if(c)p?c=!1:r=l;else continue}if(o.push(a),c)break}for(let a=0;a<e.length-1&&e[a]===0;a++)o.push(0);return o.reverse()}const Ic=(e,t)=>t===0?e:Ic(t,e%t),Dr=(e,t)=>e+(t-Ic(e,t)),_r=(()=>{let e=[];for(let t=0;t<40;t++)e.push(2**t);return e})();function jr(e,t,n,r){if(Pr(e),t<=0||t>32)throw new Error(`convertRadix2: wrong from=${t}`);if(n<=0||n>32)throw new Error(`convertRadix2: wrong to=${n}`);if(Dr(t,n)>32)throw new Error(`convertRadix2: carry overflow from=${t} to=${n} carryBits=${Dr(t,n)}`);let o=0,s=0;const i=_r[t],a=_r[n]-1,c=[];for(const l of e){if(pn(l),l>=i)throw new Error(`convertRadix2: invalid data word=${l} from=${t}`);if(o=o<<t|l,s+t>32)throw new Error(`convertRadix2: carry overflow pos=${s} from=${t}`);for(s+=t;s>=n;s-=n)c.push((o>>s-n&a)>>>0);const d=_r[s];if(d===void 0)throw new Error("invalid carry");o&=d-1}if(o=o<<n-s&a,!r&&s>=t)throw new Error("Excess padding");if(!r&&o>0)throw new Error(`Non-zero padding: ${o}`);return r&&s>0&&c.push(o>>>0),c}function Ac(e){pn(e);const t=2**8;return{encode:n=>{if(!sn(n))throw new Error("radix.encode input should be Uint8Array");return us(Array.from(n),t,e)},decode:n=>(Ks("radix.decode",n),Uint8Array.from(us(n,e,t)))}}function Ws(e,t=!1){if(pn(e),e<=0||e>32)throw new Error("radix2: bits should be in (0..32]");if(Dr(8,e)>32||Dr(e,8)>32)throw new Error("radix2: carry overflow");return{encode:n=>{if(!sn(n))throw new Error("radix2.encode input should be Uint8Array");return jr(Array.from(n),8,e,!t)},decode:n=>(Ks("radix2.decode",n),Uint8Array.from(jr(n,e,8,t)))}}function sa(e){return xc(e),function(...t){try{return e.apply(null,t)}catch{}}}function Rc(e,t){return pn(e),xc(t),{encode(n){if(!sn(n))throw new Error("checksum.encode: input should be Uint8Array");const r=t(n).slice(0,e),o=new Uint8Array(n.length+e);return o.set(n),o.set(r,n.length),o},decode(n){if(!sn(n))throw new Error("checksum.decode: input should be Uint8Array");const r=n.slice(0,-e),o=n.slice(-e),s=t(r).slice(0,e);for(let i=0;i<e;i++)if(s[i]!==o[i])throw new Error("Invalid checksum");return r}}}const ar={alphabet:co,chain:Yn,checksum:Rc,convertRadix:us,convertRadix2:jr,radix:Ac,radix2:Ws,join:lo,padding:Sc},Lf=typeof Uint8Array.from([]).toBase64=="function"&&typeof Uint8Array.fromBase64=="function",Nf=(e,t)=>{Pt("base64",e);const n=/^[A-Za-z0-9=+/]+$/,r="base64";if(e.length>0&&!n.test(e))throw new Error("invalid base64");return Uint8Array.fromBase64(e,{alphabet:r,lastChunkHandling:"strict"})},Ke=Lf?{encode(e){return Tf(e),e.toBase64()},decode(e){return Nf(e)}}:Yn(Ws(6),co("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"),Sc(6),lo("")),$f=e=>Yn(Ac(58),co(e),lo("")),Mf=$f("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"),Of=e=>Yn(Rc(4,t=>e(e(t))),Mf),fs=Yn(co("qpzry9x8gf2tvdw0s3jn54khce6mua7l"),lo("")),ia=[996825010,642813549,513874426,1027748829,705979059];function En(e){const t=e>>25;let n=(e&33554431)<<5;for(let r=0;r<ia.length;r++)(t>>r&1)===1&&(n^=ia[r]);return n}function aa(e,t,n=1){const r=e.length;let o=1;for(let s=0;s<r;s++){const i=e.charCodeAt(s);if(i<33||i>126)throw new Error(`Invalid prefix (${e})`);o=En(o)^i>>5}o=En(o);for(let s=0;s<r;s++)o=En(o)^e.charCodeAt(s)&31;for(let s of t)o=En(o)^s;for(let s=0;s<6;s++)o=En(o);return o^=n,fs.encode(jr([o%_r[30]],30,5,!1))}function Bf(e){const t=e==="bech32"?1:734539939,n=Ws(5),r=n.decode,o=n.encode,s=sa(r);function i(u,f,h=90){Pt("bech32.encode prefix",u),sn(f)&&(f=Array.from(f)),Ks("bech32.encode",f);const p=u.length;if(p===0)throw new TypeError(`Invalid prefix length ${p}`);const m=p+7+f.length;if(h!==!1&&m>h)throw new TypeError(`Length ${m} exceeds limit ${h}`);const y=u.toLowerCase(),b=aa(y,f,t);return`${y}1${fs.encode(f)}${b}`}function a(u,f=90){Pt("bech32.decode input",u);const h=u.length;if(h<8||f!==!1&&h>f)throw new TypeError(`invalid string length: ${h} (${u}). Expected (8..${f})`);const p=u.toLowerCase();if(u!==p&&u!==u.toUpperCase())throw new Error("String must be lowercase or uppercase");const m=p.lastIndexOf("1");if(m===0||m===-1)throw new Error('Letter "1" must be present between prefix and data only');const y=p.slice(0,m),b=p.slice(m+1);if(b.length<6)throw new Error("Data must be at least 6 characters long");const E=fs.decode(b).slice(0,-6),T=aa(y,E,t);if(!b.endsWith(T))throw new Error(`Invalid checksum in ${u}: expected "${T}"`);return{prefix:y,words:E}}const c=sa(a);function l(u){const{prefix:f,words:h}=a(u,!1);return{prefix:f,words:h,bytes:r(h)}}function d(u,f){return i(u,o(f))}return{encode:i,decode:a,encodeFromBytes:d,decodeToBytes:l,decodeUnsafe:c,fromWords:r,fromWordsUnsafe:s,toWords:o}}const We=Bf("bech32");const Pf=e=>e[0]==="あいこくしん";function Cc(e){if(typeof e!="string")throw new TypeError("invalid mnemonic type: "+typeof e);return e.normalize("NFKD")}function Tc(e){const t=Cc(e),n=t.split(" ");if(![12,15,18,21,24].includes(n.length))throw new Error("Invalid mnemonic");return{nfkd:t,words:n}}function Lc(e){if(G(e),![16,20,24,28,32].includes(e.length))throw new Error("invalid entropy length")}function Uf(e,t=128){if(Ae(t),t%32!==0||t>256)throw new TypeError("Invalid entropy");return qf(Et(t/8),e)}const Df=e=>{const t=8-e.length/4;return new Uint8Array([ie(e)[0]>>t<<t])};function Nc(e){if(!Array.isArray(e)||e.length!==2048||typeof e[0]!="string")throw new Error("Wordlist: expected array of 2048 strings");return e.forEach(t=>{if(typeof t!="string")throw new Error("wordlist: non-string element: "+t)}),ar.chain(ar.checksum(1,Df),ar.radix2(11,!0),ar.alphabet(e))}function jf(e,t){const{words:n}=Tc(e),r=Nc(t).decode(n);return Lc(r),r}function qf(e,t){return Lc(e),Nc(t).encode(e).join(Pf(t)?"　":" ")}function Hf(e,t){try{jf(e,t)}catch{return!1}return!0}const Ff=e=>Cc("mnemonic"+e);function Gf(e,t=""){return ff(ds,Tc(e).nfkd,Ff(t),{c:2048,dkLen:64})}const $c=`abandon
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
`);const zs=BigInt(0),hs=BigInt(1);function qr(e,t=""){if(typeof e!="boolean"){const n=t&&`"${t}" `;throw new Error(n+"expected boolean, got type="+typeof e)}return e}function Mc(e){if(typeof e=="bigint"){if(!xr(e))throw new Error("positive bigint expected, got "+e)}else Ae(e);return e}function cr(e){const t=Mc(e).toString(16);return t.length&1?"0"+t:t}function Oc(e){if(typeof e!="string")throw new Error("hex string expected, got "+typeof e);return e===""?zs:BigInt("0x"+e)}function Zn(e){return Oc(q(e))}function Bc(e){return Oc(q(Vf(G(e)).reverse()))}function Js(e,t){Ae(t),e=Mc(e);const n=z(e.toString(16).padStart(t*2,"0"));if(n.length!==t)throw new Error("number too large");return n}function Pc(e,t){return Js(e,t).reverse()}function Vf(e){return Uint8Array.from(e)}function Kf(e){return Uint8Array.from(e,(t,n)=>{const r=t.charCodeAt(0);if(t.length!==1||r>127)throw new Error(`string contains non-ASCII character "${e[n]}" with code ${r} at position ${n}`);return r})}const xr=e=>typeof e=="bigint"&&zs<=e;function Wf(e,t,n){return xr(e)&&xr(t)&&xr(n)&&t<=e&&e<n}function zf(e,t,n,r){if(!Wf(t,n,r))throw new Error("expected valid "+e+": "+n+" <= n < "+r+", got "+t)}function Jf(e){let t;for(t=0;e>zs;e>>=hs,t+=1);return t}const Ys=e=>(hs<<BigInt(e))-hs;function Yf(e,t,n){if(Ae(e,"hashLen"),Ae(t,"qByteLen"),typeof n!="function")throw new Error("hmacFn must be a function");const r=y=>new Uint8Array(y),o=Uint8Array.of(),s=Uint8Array.of(0),i=Uint8Array.of(1),a=1e3;let c=r(e),l=r(e),d=0;const u=()=>{c.fill(1),l.fill(0),d=0},f=(...y)=>n(l,oe(c,...y)),h=(y=o)=>{l=f(s,y),c=f(),y.length!==0&&(l=f(i,y),c=f())},p=()=>{if(d++>=a)throw new Error("drbg: tried max amount of iterations");let y=0;const b=[];for(;y<t;){c=f();const E=c.slice();b.push(E),y+=c.length}return oe(...b)};return(y,b)=>{u(),h(y);let E;for(;!(E=b(p()));)h();return u(),E}}function Zs(e,t={},n={}){if(!e||typeof e!="object")throw new Error("expected valid options object");function r(s,i,a){const c=e[s];if(a&&c===void 0)return;const l=typeof c;if(l!==i||c===null)throw new Error(`param "${s}" is invalid: expected ${i}, got ${l}`)}const o=(s,i)=>Object.entries(s).forEach(([a,c])=>r(a,c,i));o(t,!1),o(n,!0)}function ca(e){const t=new WeakMap;return(n,...r)=>{const o=t.get(n);if(o!==void 0)return o;const s=e(n,...r);return t.set(n,s),s}}const ve=BigInt(0),ye=BigInt(1),Rt=BigInt(2),Uc=BigInt(3),Dc=BigInt(4),jc=BigInt(5),Zf=BigInt(7),qc=BigInt(8),Xf=BigInt(9),Hc=BigInt(16);function Ce(e,t){const n=e%t;return n>=ve?n:t+n}function _e(e,t,n){let r=e;for(;t-- >ve;)r*=r,r%=n;return r}function la(e,t){if(e===ve)throw new Error("invert: expected non-zero number");if(t<=ve)throw new Error("invert: expected positive modulus, got "+t);let n=Ce(e,t),r=t,o=ve,s=ye;for(;n!==ve;){const a=r/n,c=r%n,l=o-s*a;r=n,n=c,o=s,s=l}if(r!==ye)throw new Error("invert: does not exist");return Ce(o,t)}function Xs(e,t,n){if(!e.eql(e.sqr(t),n))throw new Error("Cannot find square root")}function Fc(e,t){const n=(e.ORDER+ye)/Dc,r=e.pow(t,n);return Xs(e,r,t),r}function Qf(e,t){const n=(e.ORDER-jc)/qc,r=e.mul(t,Rt),o=e.pow(r,n),s=e.mul(t,o),i=e.mul(e.mul(s,Rt),o),a=e.mul(s,e.sub(i,e.ONE));return Xs(e,a,t),a}function eh(e){const t=uo(e),n=Gc(e),r=n(t,t.neg(t.ONE)),o=n(t,r),s=n(t,t.neg(r)),i=(e+Zf)/Hc;return(a,c)=>{let l=a.pow(c,i),d=a.mul(l,r);const u=a.mul(l,o),f=a.mul(l,s),h=a.eql(a.sqr(d),c),p=a.eql(a.sqr(u),c);l=a.cmov(l,d,h),d=a.cmov(f,u,p);const m=a.eql(a.sqr(d),c),y=a.cmov(l,d,m);return Xs(a,y,c),y}}function Gc(e){if(e<Uc)throw new Error("sqrt is not defined for small field");let t=e-ye,n=0;for(;t%Rt===ve;)t/=Rt,n++;let r=Rt;const o=uo(e);for(;da(o,r)===1;)if(r++>1e3)throw new Error("Cannot find square root: probably non-prime P");if(n===1)return Fc;let s=o.pow(r,t);const i=(t+ye)/Rt;return function(c,l){if(c.is0(l))return l;if(da(c,l)!==1)throw new Error("Cannot find square root");let d=n,u=c.mul(c.ONE,s),f=c.pow(l,t),h=c.pow(l,i);for(;!c.eql(f,c.ONE);){if(c.is0(f))return c.ZERO;let p=1,m=c.sqr(f);for(;!c.eql(m,c.ONE);)if(p++,m=c.sqr(m),p===d)throw new Error("Cannot find square root");const y=ye<<BigInt(d-p-1),b=c.pow(u,y);d=p,u=c.sqr(b),f=c.mul(f,u),h=c.mul(h,b)}return h}}function th(e){return e%Dc===Uc?Fc:e%qc===jc?Qf:e%Hc===Xf?eh(e):Gc(e)}const nh=["create","isValid","is0","neg","inv","sqrt","sqr","eql","add","sub","mul","pow","div","addN","subN","mulN","sqrN"];function rh(e){const t={ORDER:"bigint",BYTES:"number",BITS:"number"},n=nh.reduce((r,o)=>(r[o]="function",r),t);return Zs(e,n),e}function oh(e,t,n){if(n<ve)throw new Error("invalid exponent, negatives unsupported");if(n===ve)return e.ONE;if(n===ye)return t;let r=e.ONE,o=t;for(;n>ve;)n&ye&&(r=e.mul(r,o)),o=e.sqr(o),n>>=ye;return r}function Vc(e,t,n=!1){const r=new Array(t.length).fill(n?e.ZERO:void 0),o=t.reduce((i,a,c)=>e.is0(a)?i:(r[c]=i,e.mul(i,a)),e.ONE),s=e.inv(o);return t.reduceRight((i,a,c)=>e.is0(a)?i:(r[c]=e.mul(i,r[c]),e.mul(i,a)),s),r}function da(e,t){const n=(e.ORDER-ye)/Rt,r=e.pow(t,n),o=e.eql(r,e.ONE),s=e.eql(r,e.ZERO),i=e.eql(r,e.neg(e.ONE));if(!o&&!s&&!i)throw new Error("invalid Legendre symbol result");return o?1:s?0:-1}function sh(e,t){t!==void 0&&Ae(t);const n=t!==void 0?t:e.toString(2).length,r=Math.ceil(n/8);return{nBitLength:n,nByteLength:r}}class ih{ORDER;BITS;BYTES;isLE;ZERO=ve;ONE=ye;_lengths;_sqrt;_mod;constructor(t,n={}){if(t<=ve)throw new Error("invalid field: expected ORDER > 0, got "+t);let r;this.isLE=!1,n!=null&&typeof n=="object"&&(typeof n.BITS=="number"&&(r=n.BITS),typeof n.sqrt=="function"&&(this.sqrt=n.sqrt),typeof n.isLE=="boolean"&&(this.isLE=n.isLE),n.allowedLengths&&(this._lengths=n.allowedLengths?.slice()),typeof n.modFromBytes=="boolean"&&(this._mod=n.modFromBytes));const{nBitLength:o,nByteLength:s}=sh(t,r);if(s>2048)throw new Error("invalid field: expected ORDER of <= 2048 bytes");this.ORDER=t,this.BITS=o,this.BYTES=s,this._sqrt=void 0,Object.preventExtensions(this)}create(t){return Ce(t,this.ORDER)}isValid(t){if(typeof t!="bigint")throw new Error("invalid field element: expected bigint, got "+typeof t);return ve<=t&&t<this.ORDER}is0(t){return t===ve}isValidNot0(t){return!this.is0(t)&&this.isValid(t)}isOdd(t){return(t&ye)===ye}neg(t){return Ce(-t,this.ORDER)}eql(t,n){return t===n}sqr(t){return Ce(t*t,this.ORDER)}add(t,n){return Ce(t+n,this.ORDER)}sub(t,n){return Ce(t-n,this.ORDER)}mul(t,n){return Ce(t*n,this.ORDER)}pow(t,n){return oh(this,t,n)}div(t,n){return Ce(t*la(n,this.ORDER),this.ORDER)}sqrN(t){return t*t}addN(t,n){return t+n}subN(t,n){return t-n}mulN(t,n){return t*n}inv(t){return la(t,this.ORDER)}sqrt(t){return this._sqrt||(this._sqrt=th(this.ORDER)),this._sqrt(this,t)}toBytes(t){return this.isLE?Pc(t,this.BYTES):Js(t,this.BYTES)}fromBytes(t,n=!1){G(t);const{_lengths:r,BYTES:o,isLE:s,ORDER:i,_mod:a}=this;if(r){if(!r.includes(t.length)||t.length>o)throw new Error("Field.fromBytes: expected "+r+" bytes, got "+t.length);const l=new Uint8Array(o);l.set(t,s?0:l.length-t.length),t=l}if(t.length!==o)throw new Error("Field.fromBytes: expected "+o+" bytes, got "+t.length);let c=s?Bc(t):Zn(t);if(a&&(c=Ce(c,i)),!n&&!this.isValid(c))throw new Error("invalid field element: outside of range 0..ORDER");return c}invertBatch(t){return Vc(this,t)}cmov(t,n,r){return r?n:t}}function uo(e,t={}){return new ih(e,t)}function Kc(e){if(typeof e!="bigint")throw new Error("field order must be bigint");const t=e.toString(2).length;return Math.ceil(t/8)}function Wc(e){const t=Kc(e);return t+Math.ceil(t/2)}function zc(e,t,n=!1){G(e);const r=e.length,o=Kc(t),s=Wc(t);if(r<16||r<s||r>1024)throw new Error("expected "+s+"-1024 bytes of input, got "+r);const i=n?Bc(e):Zn(e),a=Ce(i,t-ye)+ye;return n?Pc(a,o):Js(a,o)}const an=BigInt(0),Ct=BigInt(1);function Hr(e,t){const n=t.negate();return e?n:t}function ua(e,t){const n=Vc(e.Fp,t.map(r=>r.Z));return t.map((r,o)=>e.fromAffine(r.toAffine(n[o])))}function Jc(e,t){if(!Number.isSafeInteger(e)||e<=0||e>t)throw new Error("invalid window size, expected [1.."+t+"], got W="+e)}function Bo(e,t){Jc(e,t);const n=Math.ceil(t/e)+1,r=2**(e-1),o=2**e,s=Ys(e),i=BigInt(e);return{windows:n,windowSize:r,mask:s,maxNumber:o,shiftBy:i}}function fa(e,t,n){const{windowSize:r,mask:o,maxNumber:s,shiftBy:i}=n;let a=Number(e&o),c=e>>i;a>r&&(a-=s,c+=Ct);const l=t*r,d=l+Math.abs(a)-1,u=a===0,f=a<0,h=t%2!==0;return{nextN:c,offset:d,isZero:u,isNeg:f,isNegF:h,offsetF:l}}const Po=new WeakMap,Yc=new WeakMap;function Uo(e){return Yc.get(e)||1}function ha(e){if(e!==an)throw new Error("invalid wNAF")}class ah{BASE;ZERO;Fn;bits;constructor(t,n){this.BASE=t.BASE,this.ZERO=t.ZERO,this.Fn=t.Fn,this.bits=n}_unsafeLadder(t,n,r=this.ZERO){let o=t;for(;n>an;)n&Ct&&(r=r.add(o)),o=o.double(),n>>=Ct;return r}precomputeWindow(t,n){const{windows:r,windowSize:o}=Bo(n,this.bits),s=[];let i=t,a=i;for(let c=0;c<r;c++){a=i,s.push(a);for(let l=1;l<o;l++)a=a.add(i),s.push(a);i=a.double()}return s}wNAF(t,n,r){if(!this.Fn.isValid(r))throw new Error("invalid scalar");let o=this.ZERO,s=this.BASE;const i=Bo(t,this.bits);for(let a=0;a<i.windows;a++){const{nextN:c,offset:l,isZero:d,isNeg:u,isNegF:f,offsetF:h}=fa(r,a,i);r=c,d?s=s.add(Hr(f,n[h])):o=o.add(Hr(u,n[l]))}return ha(r),{p:o,f:s}}wNAFUnsafe(t,n,r,o=this.ZERO){const s=Bo(t,this.bits);for(let i=0;i<s.windows&&r!==an;i++){const{nextN:a,offset:c,isZero:l,isNeg:d}=fa(r,i,s);if(r=a,!l){const u=n[c];o=o.add(d?u.negate():u)}}return ha(r),o}getPrecomputes(t,n,r){let o=Po.get(n);return o||(o=this.precomputeWindow(n,t),t!==1&&(typeof r=="function"&&(o=r(o)),Po.set(n,o))),o}cached(t,n,r){const o=Uo(t);return this.wNAF(o,this.getPrecomputes(o,t,r),n)}unsafe(t,n,r,o){const s=Uo(t);return s===1?this._unsafeLadder(t,n,o):this.wNAFUnsafe(s,this.getPrecomputes(s,t,r),n,o)}createCache(t,n){Jc(n,this.bits),Yc.set(t,n),Po.delete(t)}hasCache(t){return Uo(t)!==1}}function ch(e,t,n,r){let o=t,s=e.ZERO,i=e.ZERO;for(;n>an||r>an;)n&Ct&&(s=s.add(o)),r&Ct&&(i=i.add(o)),o=o.double(),n>>=Ct,r>>=Ct;return{p1:s,p2:i}}function pa(e,t,n){if(t){if(t.ORDER!==e)throw new Error("Field.ORDER must match order: Fp == p, Fn == n");return rh(t),t}else return uo(e,{isLE:n})}function lh(e,t,n={},r){if(r===void 0&&(r=e==="edwards"),!t||typeof t!="object")throw new Error(`expected valid ${e} CURVE object`);for(const c of["p","n","h"]){const l=t[c];if(!(typeof l=="bigint"&&l>an))throw new Error(`CURVE.${c} must be positive bigint`)}const o=pa(t.p,n.Fp,r),s=pa(t.n,n.Fn,r),a=["Gx","Gy","a","b"];for(const c of a)if(!o.isValid(t[c]))throw new Error(`CURVE.${c} must be valid field element of CURVE.Fp`);return t=Object.freeze(Object.assign({},t)),{CURVE:t,Fp:o,Fn:s}}function Zc(e,t){return function(r){const o=e(r);return{secretKey:o,publicKey:t(o)}}}const ma=(e,t)=>(e+(e>=0?t:-t)/Xc)/t;function dh(e,t,n){const[[r,o],[s,i]]=t,a=ma(i*e,n),c=ma(-o*e,n);let l=e-a*r-c*s,d=-a*o-c*i;const u=l<tt,f=d<tt;u&&(l=-l),f&&(d=-d);const h=Ys(Math.ceil(Jf(n)/2))+en;if(l<tt||l>=h||d<tt||d>=h)throw new Error("splitScalar (endomorphism): failed, k="+e);return{k1neg:u,k1:l,k2neg:f,k2:d}}function ps(e){if(!["compact","recovered","der"].includes(e))throw new Error('Signature format must be "compact", "recovered", or "der"');return e}function Do(e,t){const n={};for(let r of Object.keys(t))n[r]=e[r]===void 0?t[r]:e[r];return qr(n.lowS,"lowS"),qr(n.prehash,"prehash"),n.format!==void 0&&ps(n.format),n}class uh extends Error{constructor(t=""){super(t)}}const yt={Err:uh,_tlv:{encode:(e,t)=>{const{Err:n}=yt;if(e<0||e>256)throw new n("tlv.encode: wrong tag");if(t.length&1)throw new n("tlv.encode: unpadded data");const r=t.length/2,o=cr(r);if(o.length/2&128)throw new n("tlv.encode: long form length too big");const s=r>127?cr(o.length/2|128):"";return cr(e)+s+o+t},decode(e,t){const{Err:n}=yt;let r=0;if(e<0||e>256)throw new n("tlv.encode: wrong tag");if(t.length<2||t[r++]!==e)throw new n("tlv.decode: wrong tlv");const o=t[r++],s=!!(o&128);let i=0;if(!s)i=o;else{const c=o&127;if(!c)throw new n("tlv.decode(long): indefinite length not supported");if(c>4)throw new n("tlv.decode(long): byte length is too big");const l=t.subarray(r,r+c);if(l.length!==c)throw new n("tlv.decode: length bytes not complete");if(l[0]===0)throw new n("tlv.decode(long): zero leftmost byte");for(const d of l)i=i<<8|d;if(r+=c,i<128)throw new n("tlv.decode(long): not minimal encoding")}const a=t.subarray(r,r+i);if(a.length!==i)throw new n("tlv.decode: wrong value length");return{v:a,l:t.subarray(r+i)}}},_int:{encode(e){const{Err:t}=yt;if(e<tt)throw new t("integer: negative integers are not allowed");let n=cr(e);if(Number.parseInt(n[0],16)&8&&(n="00"+n),n.length&1)throw new t("unexpected DER parsing assertion: unpadded hex");return n},decode(e){const{Err:t}=yt;if(e[0]&128)throw new t("invalid signature integer: negative");if(e[0]===0&&!(e[1]&128))throw new t("invalid signature integer: unnecessary leading zero");return Zn(e)}},toSig(e){const{Err:t,_int:n,_tlv:r}=yt,o=G(e,void 0,"signature"),{v:s,l:i}=r.decode(48,o);if(i.length)throw new t("invalid signature: left bytes after parsing");const{v:a,l:c}=r.decode(2,s),{v:l,l:d}=r.decode(2,c);if(d.length)throw new t("invalid signature: left bytes after parsing");return{r:n.decode(a),s:n.decode(l)}},hexFromSig(e){const{_tlv:t,_int:n}=yt,r=t.encode(2,n.encode(e.r)),o=t.encode(2,n.encode(e.s)),s=r+o;return t.encode(48,s)}},tt=BigInt(0),en=BigInt(1),Xc=BigInt(2),lr=BigInt(3),fh=BigInt(4);function hh(e,t={}){const n=lh("weierstrass",e,t),{Fp:r,Fn:o}=n;let s=n.CURVE;const{h:i,n:a}=s;Zs(t,{},{allowInfinityPoint:"boolean",clearCofactor:"function",isTorsionFree:"function",fromBytes:"function",toBytes:"function",endo:"object"});const{endo:c}=t;if(c&&(!r.is0(s.a)||typeof c.beta!="bigint"||!Array.isArray(c.basises)))throw new Error('invalid endo: expected "beta": bigint and "basises": array');const l=el(r,o);function d(){if(!r.isOdd)throw new Error("compression is not supported: Field does not have .isOdd()")}function u(R,k,A){const{x:I,y:L}=k.toAffine(),C=r.toBytes(I);if(qr(A,"isCompressed"),A){d();const M=!r.isOdd(L);return oe(Qc(M),C)}else return oe(Uint8Array.of(4),C,r.toBytes(L))}function f(R){G(R,void 0,"Point");const{publicKey:k,publicKeyUncompressed:A}=l,I=R.length,L=R[0],C=R.subarray(1);if(I===k&&(L===2||L===3)){const M=r.fromBytes(C);if(!r.isValid(M))throw new Error("bad point: is not on curve, wrong x");const B=m(M);let P;try{P=r.sqrt(B)}catch(V){const Y=V instanceof Error?": "+V.message:"";throw new Error("bad point: is not on curve, sqrt error"+Y)}d();const U=r.isOdd(P);return(L&1)===1!==U&&(P=r.neg(P)),{x:M,y:P}}else if(I===A&&L===4){const M=r.BYTES,B=r.fromBytes(C.subarray(0,M)),P=r.fromBytes(C.subarray(M,M*2));if(!y(B,P))throw new Error("bad point: is not on curve");return{x:B,y:P}}else throw new Error(`bad point: got length ${I}, expected compressed=${k} or uncompressed=${A}`)}const h=t.toBytes||u,p=t.fromBytes||f;function m(R){const k=r.sqr(R),A=r.mul(k,R);return r.add(r.add(A,r.mul(R,s.a)),s.b)}function y(R,k){const A=r.sqr(k),I=m(R);return r.eql(A,I)}if(!y(s.Gx,s.Gy))throw new Error("bad curve params: generator point");const b=r.mul(r.pow(s.a,lr),fh),E=r.mul(r.sqr(s.b),BigInt(27));if(r.is0(r.add(b,E)))throw new Error("bad curve params: a or b");function T(R,k,A=!1){if(!r.isValid(k)||A&&r.is0(k))throw new Error(`bad point coordinate ${R}`);return k}function O(R){if(!(R instanceof g))throw new Error("Weierstrass Point expected")}function N(R){if(!c||!c.basises)throw new Error("no endo");return dh(R,c.basises,o.ORDER)}const $=ca((R,k)=>{const{X:A,Y:I,Z:L}=R;if(r.eql(L,r.ONE))return{x:A,y:I};const C=R.is0();k==null&&(k=C?r.ONE:r.inv(L));const M=r.mul(A,k),B=r.mul(I,k),P=r.mul(L,k);if(C)return{x:r.ZERO,y:r.ZERO};if(!r.eql(P,r.ONE))throw new Error("invZ was invalid");return{x:M,y:B}}),w=ca(R=>{if(R.is0()){if(t.allowInfinityPoint&&!r.is0(R.Y))return;throw new Error("bad point: ZERO")}const{x:k,y:A}=R.toAffine();if(!r.isValid(k)||!r.isValid(A))throw new Error("bad point: x or y not field elements");if(!y(k,A))throw new Error("bad point: equation left != right");if(!R.isTorsionFree())throw new Error("bad point: not in prime-order subgroup");return!0});function v(R,k,A,I,L){return A=new g(r.mul(A.X,R),A.Y,A.Z),k=Hr(I,k),A=Hr(L,A),k.add(A)}class g{static BASE=new g(s.Gx,s.Gy,r.ONE);static ZERO=new g(r.ZERO,r.ONE,r.ZERO);static Fp=r;static Fn=o;X;Y;Z;constructor(k,A,I){this.X=T("x",k),this.Y=T("y",A,!0),this.Z=T("z",I),Object.freeze(this)}static CURVE(){return s}static fromAffine(k){const{x:A,y:I}=k||{};if(!k||!r.isValid(A)||!r.isValid(I))throw new Error("invalid affine point");if(k instanceof g)throw new Error("projective point not allowed");return r.is0(A)&&r.is0(I)?g.ZERO:new g(A,I,r.ONE)}static fromBytes(k){const A=g.fromAffine(p(G(k,void 0,"point")));return A.assertValidity(),A}static fromHex(k){return g.fromBytes(z(k))}get x(){return this.toAffine().x}get y(){return this.toAffine().y}precompute(k=8,A=!0){return S.createCache(this,k),A||this.multiply(lr),this}assertValidity(){w(this)}hasEvenY(){const{y:k}=this.toAffine();if(!r.isOdd)throw new Error("Field doesn't support isOdd");return!r.isOdd(k)}equals(k){O(k);const{X:A,Y:I,Z:L}=this,{X:C,Y:M,Z:B}=k,P=r.eql(r.mul(A,B),r.mul(C,L)),U=r.eql(r.mul(I,B),r.mul(M,L));return P&&U}negate(){return new g(this.X,r.neg(this.Y),this.Z)}double(){const{a:k,b:A}=s,I=r.mul(A,lr),{X:L,Y:C,Z:M}=this;let B=r.ZERO,P=r.ZERO,U=r.ZERO,D=r.mul(L,L),V=r.mul(C,C),Y=r.mul(M,M),K=r.mul(L,C);return K=r.add(K,K),U=r.mul(L,M),U=r.add(U,U),B=r.mul(k,U),P=r.mul(I,Y),P=r.add(B,P),B=r.sub(V,P),P=r.add(V,P),P=r.mul(B,P),B=r.mul(K,B),U=r.mul(I,U),Y=r.mul(k,Y),K=r.sub(D,Y),K=r.mul(k,K),K=r.add(K,U),U=r.add(D,D),D=r.add(U,D),D=r.add(D,Y),D=r.mul(D,K),P=r.add(P,D),Y=r.mul(C,M),Y=r.add(Y,Y),D=r.mul(Y,K),B=r.sub(B,D),U=r.mul(Y,V),U=r.add(U,U),U=r.add(U,U),new g(B,P,U)}add(k){O(k);const{X:A,Y:I,Z:L}=this,{X:C,Y:M,Z:B}=k;let P=r.ZERO,U=r.ZERO,D=r.ZERO;const V=s.a,Y=r.mul(s.b,lr);let K=r.mul(A,C),ne=r.mul(I,M),ae=r.mul(L,B),Oe=r.add(A,I),re=r.add(C,M);Oe=r.mul(Oe,re),re=r.add(K,ne),Oe=r.sub(Oe,re),re=r.add(A,L);let de=r.add(C,B);return re=r.mul(re,de),de=r.add(K,ae),re=r.sub(re,de),de=r.add(I,L),P=r.add(M,B),de=r.mul(de,P),P=r.add(ne,ae),de=r.sub(de,P),D=r.mul(V,re),P=r.mul(Y,ae),D=r.add(P,D),P=r.sub(ne,D),D=r.add(ne,D),U=r.mul(P,D),ne=r.add(K,K),ne=r.add(ne,K),ae=r.mul(V,ae),re=r.mul(Y,re),ne=r.add(ne,ae),ae=r.sub(K,ae),ae=r.mul(V,ae),re=r.add(re,ae),K=r.mul(ne,re),U=r.add(U,K),K=r.mul(de,re),P=r.mul(Oe,P),P=r.sub(P,K),K=r.mul(Oe,ne),D=r.mul(de,D),D=r.add(D,K),new g(P,U,D)}subtract(k){return this.add(k.negate())}is0(){return this.equals(g.ZERO)}multiply(k){const{endo:A}=t;if(!o.isValidNot0(k))throw new Error("invalid scalar: out of range");let I,L;const C=M=>S.cached(this,M,B=>ua(g,B));if(A){const{k1neg:M,k1:B,k2neg:P,k2:U}=N(k),{p:D,f:V}=C(B),{p:Y,f:K}=C(U);L=V.add(K),I=v(A.beta,D,Y,M,P)}else{const{p:M,f:B}=C(k);I=M,L=B}return ua(g,[I,L])[0]}multiplyUnsafe(k){const{endo:A}=t,I=this;if(!o.isValid(k))throw new Error("invalid scalar: out of range");if(k===tt||I.is0())return g.ZERO;if(k===en)return I;if(S.hasCache(this))return this.multiply(k);if(A){const{k1neg:L,k1:C,k2neg:M,k2:B}=N(k),{p1:P,p2:U}=ch(g,I,C,B);return v(A.beta,P,U,L,M)}else return S.unsafe(I,k)}toAffine(k){return $(this,k)}isTorsionFree(){const{isTorsionFree:k}=t;return i===en?!0:k?k(g,this):S.unsafe(this,a).is0()}clearCofactor(){const{clearCofactor:k}=t;return i===en?this:k?k(g,this):this.multiplyUnsafe(i)}isSmallOrder(){return this.multiplyUnsafe(i).is0()}toBytes(k=!0){return qr(k,"isCompressed"),this.assertValidity(),h(g,this,k)}toHex(k=!0){return q(this.toBytes(k))}toString(){return`<Point ${this.is0()?"ZERO":this.toHex()}>`}}const _=o.BITS,S=new ah(g,t.endo?Math.ceil(_/2):_);return g.BASE.precompute(8),g}function Qc(e){return Uint8Array.of(e?2:3)}function el(e,t){return{secretKey:t.BYTES,publicKey:1+e.BYTES,publicKeyUncompressed:1+2*e.BYTES,publicKeyHasPrefix:!0,signature:2*t.BYTES}}function ph(e,t={}){const{Fn:n}=e,r=t.randomBytes||Et,o=Object.assign(el(e.Fp,n),{seed:Wc(n.ORDER)});function s(h){try{const p=n.fromBytes(h);return n.isValidNot0(p)}catch{return!1}}function i(h,p){const{publicKey:m,publicKeyUncompressed:y}=o;try{const b=h.length;return p===!0&&b!==m||p===!1&&b!==y?!1:!!e.fromBytes(h)}catch{return!1}}function a(h=r(o.seed)){return zc(G(h,o.seed,"seed"),n.ORDER)}function c(h,p=!0){return e.BASE.multiply(n.fromBytes(h)).toBytes(p)}function l(h){const{secretKey:p,publicKey:m,publicKeyUncompressed:y}=o;if(!Fs(h)||"_lengths"in n&&n._lengths||p===m)return;const b=G(h,void 0,"key").length;return b===m||b===y}function d(h,p,m=!0){if(l(h)===!0)throw new Error("first arg must be private key");if(l(p)===!1)throw new Error("second arg must be public key");const y=n.fromBytes(h);return e.fromBytes(p).multiply(y).toBytes(m)}const u={isValidSecretKey:s,isValidPublicKey:i,randomSecretKey:a},f=Zc(a,c);return Object.freeze({getPublicKey:c,getSharedSecret:d,keygen:f,Point:e,utils:u,lengths:o})}function mh(e,t,n={}){Jn(t),Zs(n,{},{hmac:"function",lowS:"boolean",randomBytes:"function",bits2int:"function",bits2int_modN:"function"}),n=Object.assign({},n);const r=n.randomBytes||Et,o=n.hmac||((A,I)=>st(t,A,I)),{Fp:s,Fn:i}=e,{ORDER:a,BITS:c}=i,{keygen:l,getPublicKey:d,getSharedSecret:u,utils:f,lengths:h}=ph(e,n),p={prehash:!0,lowS:typeof n.lowS=="boolean"?n.lowS:!0,format:"compact",extraEntropy:!1},m=a*Xc<s.ORDER;function y(A){const I=a>>en;return A>I}function b(A,I){if(!i.isValidNot0(I))throw new Error(`invalid signature ${A}: out of range 1..Point.Fn.ORDER`);return I}function E(){if(m)throw new Error('"recovered" sig type is not supported for cofactor >2 curves')}function T(A,I){ps(I);const L=h.signature,C=I==="compact"?L:I==="recovered"?L+1:void 0;return G(A,C)}class O{r;s;recovery;constructor(I,L,C){if(this.r=b("r",I),this.s=b("s",L),C!=null){if(E(),![0,1,2,3].includes(C))throw new Error("invalid recovery id");this.recovery=C}Object.freeze(this)}static fromBytes(I,L=p.format){T(I,L);let C;if(L==="der"){const{r:U,s:D}=yt.toSig(G(I));return new O(U,D)}L==="recovered"&&(C=I[0],L="compact",I=I.subarray(1));const M=h.signature/2,B=I.subarray(0,M),P=I.subarray(M,M*2);return new O(i.fromBytes(B),i.fromBytes(P),C)}static fromHex(I,L){return this.fromBytes(z(I),L)}assertRecovery(){const{recovery:I}=this;if(I==null)throw new Error("invalid recovery id: must be present");return I}addRecoveryBit(I){return new O(this.r,this.s,I)}recoverPublicKey(I){const{r:L,s:C}=this,M=this.assertRecovery(),B=M===2||M===3?L+a:L;if(!s.isValid(B))throw new Error("invalid recovery id: sig.r+curve.n != R.x");const P=s.toBytes(B),U=e.fromBytes(oe(Qc((M&1)===0),P)),D=i.inv(B),V=$(G(I,void 0,"msgHash")),Y=i.create(-V*D),K=i.create(C*D),ne=e.BASE.multiplyUnsafe(Y).add(U.multiplyUnsafe(K));if(ne.is0())throw new Error("invalid recovery: point at infinify");return ne.assertValidity(),ne}hasHighS(){return y(this.s)}toBytes(I=p.format){if(ps(I),I==="der")return z(yt.hexFromSig(this));const{r:L,s:C}=this,M=i.toBytes(L),B=i.toBytes(C);return I==="recovered"?(E(),oe(Uint8Array.of(this.assertRecovery()),M,B)):oe(M,B)}toHex(I){return q(this.toBytes(I))}}const N=n.bits2int||function(I){if(I.length>8192)throw new Error("input is too large");const L=Zn(I),C=I.length*8-c;return C>0?L>>BigInt(C):L},$=n.bits2int_modN||function(I){return i.create(N(I))},w=Ys(c);function v(A){return zf("num < 2^"+c,A,tt,w),i.toBytes(A)}function g(A,I){return G(A,void 0,"message"),I?G(t(A),void 0,"prehashed message"):A}function _(A,I,L){const{lowS:C,prehash:M,extraEntropy:B}=Do(L,p);A=g(A,M);const P=$(A),U=i.fromBytes(I);if(!i.isValidNot0(U))throw new Error("invalid private key");const D=[v(U),v(P)];if(B!=null&&B!==!1){const ne=B===!0?r(h.secretKey):B;D.push(G(ne,void 0,"extraEntropy"))}const V=oe(...D),Y=P;function K(ne){const ae=N(ne);if(!i.isValidNot0(ae))return;const Oe=i.inv(ae),re=e.BASE.multiply(ae).toAffine(),de=i.create(re.x);if(de===tt)return;const nr=i.create(Oe*i.create(Y+de*U));if(nr===tt)return;let Zi=(re.x===de?0:2)|Number(re.y&en),Xi=nr;return C&&y(nr)&&(Xi=i.neg(nr),Zi^=1),new O(de,Xi,m?void 0:Zi)}return{seed:V,k2sig:K}}function S(A,I,L={}){const{seed:C,k2sig:M}=_(A,I,L);return Yf(t.outputLen,i.BYTES,o)(C,M).toBytes(L.format)}function R(A,I,L,C={}){const{lowS:M,prehash:B,format:P}=Do(C,p);if(L=G(L,void 0,"publicKey"),I=g(I,B),!Fs(A)){const U=A instanceof O?", use sig.toBytes()":"";throw new Error("verify expects Uint8Array signature"+U)}T(A,P);try{const U=O.fromBytes(A,P),D=e.fromBytes(L);if(M&&U.hasHighS())return!1;const{r:V,s:Y}=U,K=$(I),ne=i.inv(Y),ae=i.create(K*ne),Oe=i.create(V*ne),re=e.BASE.multiplyUnsafe(ae).add(D.multiplyUnsafe(Oe));return re.is0()?!1:i.create(re.x)===V}catch{return!1}}function k(A,I,L={}){const{prehash:C}=Do(L,p);return I=g(I,C),O.fromBytes(A,"recovered").recoverPublicKey(I).toBytes()}return Object.freeze({keygen:l,getPublicKey:d,getSharedSecret:u,utils:f,lengths:h,Point:e,sign:S,verify:R,recoverPublicKey:k,Signature:O,hash:t})}const fo={p:BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),n:BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),h:BigInt(1),a:BigInt(0),b:BigInt(7),Gx:BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),Gy:BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")},yh={beta:BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),basises:[[BigInt("0x3086d221a7d46bcde86c90e49284eb15"),-BigInt("0xe4437ed6010e88286f547fa90abfe4c3")],[BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"),BigInt("0x3086d221a7d46bcde86c90e49284eb15")]]},gh=BigInt(0),ms=BigInt(2);function bh(e){const t=fo.p,n=BigInt(3),r=BigInt(6),o=BigInt(11),s=BigInt(22),i=BigInt(23),a=BigInt(44),c=BigInt(88),l=e*e*e%t,d=l*l*e%t,u=_e(d,n,t)*d%t,f=_e(u,n,t)*d%t,h=_e(f,ms,t)*l%t,p=_e(h,o,t)*h%t,m=_e(p,s,t)*p%t,y=_e(m,a,t)*m%t,b=_e(y,c,t)*y%t,E=_e(b,a,t)*m%t,T=_e(E,n,t)*d%t,O=_e(T,i,t)*p%t,N=_e(O,r,t)*l%t,$=_e(N,ms,t);if(!Fr.eql(Fr.sqr($),e))throw new Error("Cannot find square root");return $}const Fr=uo(fo.p,{sqrt:bh}),Ht=hh(fo,{Fp:Fr,endo:yh}),je=mh(Ht,ie),ya={};function Gr(e,...t){let n=ya[e];if(n===void 0){const r=ie(Kf(e));n=oe(r,r),ya[e]=n}return ie(oe(n,...t))}const Qs=e=>e.toBytes(!0).slice(1),ei=e=>e%ms===gh;function ys(e){const{Fn:t,BASE:n}=Ht,r=t.fromBytes(e),o=n.multiply(r);return{scalar:ei(o.y)?r:t.neg(r),bytes:Qs(o)}}function tl(e){const t=Fr;if(!t.isValidNot0(e))throw new Error("invalid x: Fail if x ≥ p");const n=t.create(e*e),r=t.create(n*e+BigInt(7));let o=t.sqrt(r);ei(o)||(o=t.neg(o));const s=Ht.fromAffine({x:e,y:o});return s.assertValidity(),s}const On=Zn;function nl(...e){return Ht.Fn.create(On(Gr("BIP0340/challenge",...e)))}function ga(e){return ys(e).bytes}function vh(e,t,n=Et(32)){const{Fn:r}=Ht,o=G(e,void 0,"message"),{bytes:s,scalar:i}=ys(t),a=G(n,32,"auxRand"),c=r.toBytes(i^On(Gr("BIP0340/aux",a))),l=Gr("BIP0340/nonce",c,s,o),{bytes:d,scalar:u}=ys(l),f=nl(d,s,o),h=new Uint8Array(64);if(h.set(d,0),h.set(r.toBytes(r.create(u+f*i)),32),!rl(h,o,s))throw new Error("sign: Invalid signature produced");return h}function rl(e,t,n){const{Fp:r,Fn:o,BASE:s}=Ht,i=G(e,64,"signature"),a=G(t,void 0,"message"),c=G(n,32,"publicKey");try{const l=tl(On(c)),d=On(i.subarray(0,32));if(!r.isValidNot0(d))return!1;const u=On(i.subarray(32,64));if(!o.isValidNot0(u))return!1;const f=nl(o.toBytes(d),Qs(l),a),h=s.multiplyUnsafe(u).add(l.multiplyUnsafe(o.neg(f))),{x:p,y:m}=h.toAffine();return!(h.is0()||!ei(m)||p!==d)}catch{return!1}}const ee=(()=>{const n=(r=Et(48))=>zc(r,fo.n);return{keygen:Zc(n,ga),getPublicKey:ga,sign:vh,verify:rl,Point:Ht,utils:{randomSecretKey:n,taggedHash:Gr,lift_x:tl,pointToBytes:Qs},lengths:{secretKey:32,publicKey:32,publicKeyHasPrefix:!1,signature:64,seed:48}}})(),wh=Uint8Array.from([7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8]),ol=Uint8Array.from(new Array(16).fill(0).map((e,t)=>t)),Eh=ol.map(e=>(9*e+5)%16),sl=(()=>{const n=[[ol],[Eh]];for(let r=0;r<4;r++)for(let o of n)o.push(o[r].map(s=>wh[s]));return n})(),il=sl[0],al=sl[1],cl=[[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8],[12,13,11,15,6,9,9,7,12,15,11,13,7,8,7,7],[13,15,14,11,7,7,6,8,13,14,13,12,5,5,6,9],[14,11,12,14,8,6,5,5,15,12,15,14,9,9,8,6],[15,12,13,13,9,5,8,6,14,11,12,11,8,6,5,5]].map(e=>Uint8Array.from(e)),kh=il.map((e,t)=>e.map(n=>cl[t][n])),_h=al.map((e,t)=>e.map(n=>cl[t][n])),xh=Uint32Array.from([0,1518500249,1859775393,2400959708,2840853838]),Sh=Uint32Array.from([1352829926,1548603684,1836072691,2053994217,0]);function ba(e,t,n,r){return e===0?t^n^r:e===1?t&n|~t&r:e===2?(t|~n)^r:e===3?t&r|n&~r:t^(n|~r)}const dr=new Uint32Array(16);class Ih extends Vs{h0=1732584193;h1=-271733879;h2=-1732584194;h3=271733878;h4=-1009589776;constructor(){super(64,20,8,!0)}get(){const{h0:t,h1:n,h2:r,h3:o,h4:s}=this;return[t,n,r,o,s]}set(t,n,r,o,s){this.h0=t|0,this.h1=n|0,this.h2=r|0,this.h3=o|0,this.h4=s|0}process(t,n){for(let h=0;h<16;h++,n+=4)dr[h]=t.getUint32(n,!0);let r=this.h0|0,o=r,s=this.h1|0,i=s,a=this.h2|0,c=a,l=this.h3|0,d=l,u=this.h4|0,f=u;for(let h=0;h<5;h++){const p=4-h,m=xh[h],y=Sh[h],b=il[h],E=al[h],T=kh[h],O=_h[h];for(let N=0;N<16;N++){const $=rr(r+ba(h,s,a,l)+dr[b[N]]+m,T[N])+u|0;r=u,u=l,l=rr(a,10)|0,a=s,s=$}for(let N=0;N<16;N++){const $=rr(o+ba(p,i,c,d)+dr[E[N]]+y,O[N])+f|0;o=f,f=d,d=rr(c,10)|0,c=i,i=$}}this.set(this.h1+a+d|0,this.h2+l+f|0,this.h3+u+o|0,this.h4+r+i|0,this.h0+s+c|0)}roundClean(){Ve(dr)}destroy(){this.destroyed=!0,Ve(this.buffer),this.set(0,0,0,0,0)}}const Ah=Gs(()=>new Ih);const Rn=je.Point,{Fn:kn}=Rn,jo=Of(ie),Rh=Uint8Array.from("Bitcoin seed".split(""),e=>e.charCodeAt(0)),qo={private:76066276,public:76067358},Ho=2147483648,Ch=e=>Ah(ie(e)),Th=e=>Mt(e).getUint32(0,!1),ur=e=>{if(!Number.isSafeInteger(e)||e<0||e>2**32-1)throw new Error("invalid number, should be from 0 to 2**32-1, got "+e);const t=new Uint8Array(4);return Mt(t).setUint32(0,e,!1),t};class At{get fingerprint(){if(!this.pubHash)throw new Error("No publicKey set!");return Th(this.pubHash)}get identifier(){return this.pubHash}get pubKeyHash(){return this.pubHash}get privateKey(){return this._privateKey||null}get publicKey(){return this._publicKey||null}get privateExtendedKey(){const t=this._privateKey;if(!t)throw new Error("No private key");return jo.encode(this.serialize(this.versions.private,oe(Uint8Array.of(0),t)))}get publicExtendedKey(){if(!this._publicKey)throw new Error("No public key");return jo.encode(this.serialize(this.versions.public,this._publicKey))}static fromMasterSeed(t,n=qo){if(G(t),8*t.length<128||8*t.length>512)throw new Error("HDKey: seed length must be between 128 and 512 bits; 256 bits is advised, got "+t.length);const r=st(ds,Rh,t),o=r.slice(0,32),s=r.slice(32);return new At({versions:n,chainCode:s,privateKey:o})}static fromExtendedKey(t,n=qo){const r=jo.decode(t),o=Mt(r),s=o.getUint32(0,!1),i={versions:n,depth:r[4],parentFingerprint:o.getUint32(5,!1),index:o.getUint32(9,!1),chainCode:r.slice(13,45)},a=r.slice(45),c=a[0]===0;if(s!==n[c?"private":"public"])throw new Error("Version mismatch");return c?new At({...i,privateKey:a.slice(1)}):new At({...i,publicKey:a})}static fromJSON(t){return At.fromExtendedKey(t.xpriv)}versions;depth=0;index=0;chainCode=null;parentFingerprint=0;_privateKey;_publicKey;pubHash;constructor(t){if(!t||typeof t!="object")throw new Error("HDKey.constructor must not be called directly");if(this.versions=t.versions||qo,this.depth=t.depth||0,this.chainCode=t.chainCode||null,this.index=t.index||0,this.parentFingerprint=t.parentFingerprint||0,!this.depth&&(this.parentFingerprint||this.index))throw new Error("HDKey: zero depth with non-zero index/parent fingerprint");if(this.depth>255)throw new Error("HDKey: depth exceeds the serializable value 255");if(t.publicKey&&t.privateKey)throw new Error("HDKey: publicKey and privateKey at same time.");if(t.privateKey){if(!je.utils.isValidSecretKey(t.privateKey))throw new Error("Invalid private key");this._privateKey=t.privateKey,this._publicKey=je.getPublicKey(t.privateKey,!0)}else if(t.publicKey)this._publicKey=Rn.fromBytes(t.publicKey).toBytes(!0);else throw new Error("HDKey: no public or private key provided");this.pubHash=Ch(this._publicKey)}derive(t){if(!/^[mM]'?/.test(t))throw new Error('Path must start with "m" or "M"');if(/^[mM]'?$/.test(t))return this;const n=t.replace(/^[mM]'?\//,"").split("/");let r=this;for(const o of n){const s=/^(\d+)('?)$/.exec(o),i=s&&s[1];if(!s||s.length!==3||typeof i!="string")throw new Error("invalid child index: "+o);let a=+i;if(!Number.isSafeInteger(a)||a>=Ho)throw new Error("Invalid index");s[2]==="'"&&(a+=Ho),r=r.deriveChild(a)}return r}deriveChild(t){if(!this._publicKey||!this.chainCode)throw new Error("No publicKey or chainCode set");let n=ur(t);if(t>=Ho){const c=this._privateKey;if(!c)throw new Error("Could not derive hardened child key");n=oe(Uint8Array.of(0),c,n)}else n=oe(this._publicKey,n);const r=st(ds,this.chainCode,n),o=r.slice(0,32),s=r.slice(32);if(!je.utils.isValidSecretKey(o))throw new Error("Tweak bigger than curve order");const i={versions:this.versions,chainCode:s,depth:this.depth+1,parentFingerprint:this.fingerprint,index:t},a=kn.fromBytes(o);try{if(this._privateKey){const c=kn.create(kn.fromBytes(this._privateKey)+a);if(!kn.isValidNot0(c))throw new Error("The tweak was out of range or the resulted private key is invalid");i.privateKey=kn.toBytes(c)}else{const c=Rn.fromBytes(this._publicKey).add(Rn.BASE.multiply(a));if(c.equals(Rn.ZERO))throw new Error("The tweak was equal to negative P, which made the result key invalid");i.publicKey=c.toBytes(!0)}return new At(i)}catch{return this.deriveChild(t+1)}}sign(t){if(!this._privateKey)throw new Error("No privateKey set!");return G(t,32),je.sign(t,this._privateKey,{prehash:!1})}verify(t,n){if(G(t,32),G(n,64),!this._publicKey)throw new Error("No publicKey set!");return je.verify(n,t,this._publicKey,{prehash:!1})}wipePrivateData(){return this._privateKey&&(this._privateKey.fill(0),this._privateKey=void 0),this}toJSON(){return{xpriv:this.privateExtendedKey,xpub:this.publicExtendedKey}}serialize(t,n){if(!this.chainCode)throw new Error("No chainCode set");return G(n,33),oe(ur(t),new Uint8Array([this.depth]),ur(this.parentFingerprint),ur(this.index),this.chainCode,n)}}function Lh(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array"}function va(e){if(typeof e!="boolean")throw new Error(`boolean expected, not ${e}`)}function Fo(e){if(!Number.isSafeInteger(e)||e<0)throw new Error("positive integer expected, got "+e)}function ge(e,t,n=""){const r=Lh(e),o=e?.length,s=t!==void 0;if(!r||s&&o!==t){const i=n&&`"${n}" `,a=s?` of length ${t}`:"",c=r?`length=${o}`:`type=${typeof e}`;throw new Error(i+"expected Uint8Array"+a+", got "+c)}return e}function pe(e){return new Uint32Array(e.buffer,e.byteOffset,Math.floor(e.byteLength/4))}function cn(...e){for(let t=0;t<e.length;t++)e[t].fill(0)}const Nh=new Uint8Array(new Uint32Array([287454020]).buffer)[0]===68;function $h(e,t){return e.buffer===t.buffer&&e.byteOffset<t.byteOffset+t.byteLength&&t.byteOffset<e.byteOffset+e.byteLength}function ll(e,t){if($h(e,t)&&e.byteOffset<t.byteOffset)throw new Error("complex overlap of input and output is not supported")}function Mh(e,t){if(t==null||typeof t!="object")throw new Error("options must be defined");return Object.assign(e,t)}function dl(e,t){if(e.length!==t.length)return!1;let n=0;for(let r=0;r<e.length;r++)n|=e[r]^t[r];return n===0}const Oh=(e,t)=>{function n(r,...o){if(ge(r,void 0,"key"),!Nh)throw new Error("Non little-endian hardware is not yet supported");if(e.nonceLength!==void 0){const d=o[0];ge(d,e.varSizeNonce?void 0:e.nonceLength,"nonce")}const s=e.tagLength;s&&o[1]!==void 0&&ge(o[1],void 0,"AAD");const i=t(r,...o),a=(d,u)=>{if(u!==void 0){if(d!==2)throw new Error("cipher output not supported");ge(u,void 0,"output")}};let c=!1;return{encrypt(d,u){if(c)throw new Error("cannot encrypt() twice with same key + nonce");return c=!0,ge(d),a(i.encrypt.length,u),i.encrypt(d,u)},decrypt(d,u){if(ge(d),s&&d.length<s)throw new Error('"ciphertext" expected length bigger than tagLength='+s);return a(i.decrypt.length,u),i.decrypt(d,u)}}}return Object.assign(n,e),n};function ul(e,t,n=!0){if(t===void 0)return new Uint8Array(e);if(t.length!==e)throw new Error('"output" expected Uint8Array of length '+e+", got: "+t.length);if(n&&!tn(t))throw new Error("invalid output, must be aligned");return t}function tn(e){return e.byteOffset%4===0}function Ot(e){return Uint8Array.from(e)}const bt=16,Bh=283;function Ph(e){if(![16,24,32].includes(e.length))throw new Error('"aes key" expected Uint8Array of length 16/24/32, got length='+e.length)}function ti(e){return e<<1^Bh&-(e>>7)}function Xt(e,t){let n=0;for(;t>0;t>>=1)n^=e&-(t&1),e=ti(e);return n}const gs=(()=>{const e=new Uint8Array(256);for(let n=0,r=1;n<256;n++,r^=ti(r))e[n]=r;const t=new Uint8Array(256);t[0]=99;for(let n=0;n<255;n++){let r=e[255-n];r|=r<<8,t[e[n]]=(r^r>>4^r>>5^r>>6^r>>7^99)&255}return cn(e),t})(),Uh=gs.map((e,t)=>gs.indexOf(t)),Dh=e=>e<<24|e>>>8,Go=e=>e<<8|e>>>24;function fl(e,t){if(e.length!==256)throw new Error("Wrong sbox length");const n=new Uint32Array(256).map((l,d)=>t(e[d])),r=n.map(Go),o=r.map(Go),s=o.map(Go),i=new Uint32Array(256*256),a=new Uint32Array(256*256),c=new Uint16Array(256*256);for(let l=0;l<256;l++)for(let d=0;d<256;d++){const u=l*256+d;i[u]=n[l]^r[d],a[u]=o[l]^s[d],c[u]=e[l]<<8|e[d]}return{sbox:e,sbox2:c,T0:n,T1:r,T2:o,T3:s,T01:i,T23:a}}const ni=fl(gs,e=>Xt(e,3)<<24|e<<16|e<<8|Xt(e,2)),hl=fl(Uh,e=>Xt(e,11)<<24|Xt(e,13)<<16|Xt(e,9)<<8|Xt(e,14)),jh=(()=>{const e=new Uint8Array(16);for(let t=0,n=1;t<16;t++,n=ti(n))e[t]=n;return e})();function pl(e){ge(e);const t=e.length;Ph(e);const{sbox2:n}=ni,r=[];tn(e)||r.push(e=Ot(e));const o=pe(e),s=o.length,i=c=>Fe(n,c,c,c,c),a=new Uint32Array(t+28);a.set(o);for(let c=s;c<a.length;c++){let l=a[c-1];c%s===0?l=i(Dh(l))^jh[c/s-1]:s>6&&c%s===4&&(l=i(l)),a[c]=a[c-s]^l}return cn(...r),a}function qh(e){const t=pl(e),n=t.slice(),r=t.length,{sbox2:o}=ni,{T0:s,T1:i,T2:a,T3:c}=hl;for(let l=0;l<r;l+=4)for(let d=0;d<4;d++)n[l+d]=t[r-l-4+d];cn(t);for(let l=4;l<r-4;l++){const d=n[l],u=Fe(o,d,d,d,d);n[l]=s[u&255]^i[u>>>8&255]^a[u>>>16&255]^c[u>>>24]}return n}function gt(e,t,n,r,o,s){return e[n<<8&65280|r>>>8&255]^t[o>>>8&65280|s>>>24&255]}function Fe(e,t,n,r,o){return e[t&255|n&65280]|e[r>>>16&255|o>>>16&65280]<<16}function wa(e,t,n,r,o){const{sbox2:s,T01:i,T23:a}=ni;let c=0;t^=e[c++],n^=e[c++],r^=e[c++],o^=e[c++];const l=e.length/4-2;for(let p=0;p<l;p++){const m=e[c++]^gt(i,a,t,n,r,o),y=e[c++]^gt(i,a,n,r,o,t),b=e[c++]^gt(i,a,r,o,t,n),E=e[c++]^gt(i,a,o,t,n,r);t=m,n=y,r=b,o=E}const d=e[c++]^Fe(s,t,n,r,o),u=e[c++]^Fe(s,n,r,o,t),f=e[c++]^Fe(s,r,o,t,n),h=e[c++]^Fe(s,o,t,n,r);return{s0:d,s1:u,s2:f,s3:h}}function Hh(e,t,n,r,o){const{sbox2:s,T01:i,T23:a}=hl;let c=0;t^=e[c++],n^=e[c++],r^=e[c++],o^=e[c++];const l=e.length/4-2;for(let p=0;p<l;p++){const m=e[c++]^gt(i,a,t,o,r,n),y=e[c++]^gt(i,a,n,t,o,r),b=e[c++]^gt(i,a,r,n,t,o),E=e[c++]^gt(i,a,o,r,n,t);t=m,n=y,r=b,o=E}const d=e[c++]^Fe(s,t,o,r,n),u=e[c++]^Fe(s,n,t,o,r),f=e[c++]^Fe(s,r,n,t,o),h=e[c++]^Fe(s,o,r,n,t);return{s0:d,s1:u,s2:f,s3:h}}function Fh(e){if(ge(e),e.length%bt!==0)throw new Error("aes-(cbc/ecb).decrypt ciphertext should consist of blocks with size "+bt)}function Gh(e,t,n){ge(e);let r=e.length;const o=r%bt;if(!t&&o!==0)throw new Error("aec/(cbc-ecb): unpadded plaintext with disabled padding");tn(e)||(e=Ot(e));const s=pe(e);if(t){let a=bt-o;a||(a=bt),r=r+a}n=ul(r,n),ll(e,n);const i=pe(n);return{b:s,o:i,out:n}}function Vh(e,t){if(!t)return e;const n=e.length;if(!n)throw new Error("aes/pcks5: empty ciphertext not allowed");const r=e[n-1];if(r<=0||r>16)throw new Error("aes/pcks5: wrong padding");const o=e.subarray(0,-r);for(let s=0;s<r;s++)if(e[n-s-1]!==r)throw new Error("aes/pcks5: wrong padding");return o}function Kh(e){const t=new Uint8Array(16),n=pe(t);t.set(e);const r=bt-e.length;for(let o=bt-r;o<bt;o++)t[o]=r;return n}const ml=Oh({blockSize:16,nonceLength:16},function(t,n,r={}){const o=!r.disablePadding;return{encrypt(s,i){const a=pl(t),{b:c,o:l,out:d}=Gh(s,o,i);let u=n;const f=[a];tn(u)||f.push(u=Ot(u));const h=pe(u);let p=h[0],m=h[1],y=h[2],b=h[3],E=0;for(;E+4<=c.length;)p^=c[E+0],m^=c[E+1],y^=c[E+2],b^=c[E+3],{s0:p,s1:m,s2:y,s3:b}=wa(a,p,m,y,b),l[E++]=p,l[E++]=m,l[E++]=y,l[E++]=b;if(o){const T=Kh(s.subarray(E*4));p^=T[0],m^=T[1],y^=T[2],b^=T[3],{s0:p,s1:m,s2:y,s3:b}=wa(a,p,m,y,b),l[E++]=p,l[E++]=m,l[E++]=y,l[E++]=b}return cn(...f),d},decrypt(s,i){Fh(s);const a=qh(t);let c=n;const l=[a];tn(c)||l.push(c=Ot(c));const d=pe(c);i=ul(s.length,i),tn(s)||l.push(s=Ot(s)),ll(s,i);const u=pe(s),f=pe(i);let h=d[0],p=d[1],m=d[2],y=d[3];for(let b=0;b+4<=u.length;){const E=h,T=p,O=m,N=y;h=u[b+0],p=u[b+1],m=u[b+2],y=u[b+3];const{s0:$,s1:w,s2:v,s3:g}=Hh(a,h,p,m,y);f[b++]=$^E,f[b++]=w^T,f[b++]=v^O,f[b++]=g^N}return cn(...l),Vh(i,o)}}}),yl=e=>Uint8Array.from(e.split(""),t=>t.charCodeAt(0)),Wh=yl("expand 16-byte k"),zh=yl("expand 32-byte k"),Jh=pe(Wh),Yh=pe(zh);function W(e,t){return e<<t|e>>>32-t}function bs(e){return e.byteOffset%4===0}const fr=64,Zh=16,gl=2**32-1,Ea=Uint32Array.of();function Xh(e,t,n,r,o,s,i,a){const c=o.length,l=new Uint8Array(fr),d=pe(l),u=bs(o)&&bs(s),f=u?pe(o):Ea,h=u?pe(s):Ea;for(let p=0;p<c;i++){if(e(t,n,r,d,i,a),i>=gl)throw new Error("arx: counter overflow");const m=Math.min(fr,c-p);if(u&&m===fr){const y=p/4;if(p%4!==0)throw new Error("arx: invalid block position");for(let b=0,E;b<Zh;b++)E=y+b,h[E]=f[E]^d[b];p+=fr;continue}for(let y=0,b;y<m;y++)b=p+y,s[b]=o[b]^l[y];p+=m}}function Qh(e,t){const{allowShortKeys:n,extendNonceFn:r,counterLength:o,counterRight:s,rounds:i}=Mh({allowShortKeys:!1,counterLength:8,counterRight:!1,rounds:20},t);if(typeof e!="function")throw new Error("core must be a function");return Fo(o),Fo(i),va(s),va(n),(a,c,l,d,u=0)=>{ge(a,void 0,"key"),ge(c,void 0,"nonce"),ge(l,void 0,"data");const f=l.length;if(d===void 0&&(d=new Uint8Array(f)),ge(d,void 0,"output"),Fo(u),u<0||u>=gl)throw new Error("arx: counter overflow");if(d.length<f)throw new Error(`arx: output (${d.length}) is shorter than data (${f})`);const h=[];let p=a.length,m,y;if(p===32)h.push(m=Ot(a)),y=Yh;else if(p===16&&n)m=new Uint8Array(32),m.set(a),m.set(a,16),y=Jh,h.push(m);else throw ge(a,32,"arx key"),new Error("invalid key size");bs(c)||h.push(c=Ot(c));const b=pe(m);if(r){if(c.length!==24)throw new Error("arx: extended nonce must be 24 bytes");r(y,b,pe(c.subarray(0,16)),b),c=c.subarray(16)}const E=16-o;if(E!==c.length)throw new Error(`arx: nonce must be ${E} or 16 bytes`);if(E!==12){const O=new Uint8Array(12);O.set(c,s?0:12-c.length),c=O,h.push(c)}const T=pe(c);return Xh(e,y,b,T,l,d,u,i),cn(...h),d}}function ep(e,t,n,r,o,s=20){let i=e[0],a=e[1],c=e[2],l=e[3],d=t[0],u=t[1],f=t[2],h=t[3],p=t[4],m=t[5],y=t[6],b=t[7],E=o,T=n[0],O=n[1],N=n[2],$=i,w=a,v=c,g=l,_=d,S=u,R=f,k=h,A=p,I=m,L=y,C=b,M=E,B=T,P=O,U=N;for(let V=0;V<s;V+=2)$=$+_|0,M=W(M^$,16),A=A+M|0,_=W(_^A,12),$=$+_|0,M=W(M^$,8),A=A+M|0,_=W(_^A,7),w=w+S|0,B=W(B^w,16),I=I+B|0,S=W(S^I,12),w=w+S|0,B=W(B^w,8),I=I+B|0,S=W(S^I,7),v=v+R|0,P=W(P^v,16),L=L+P|0,R=W(R^L,12),v=v+R|0,P=W(P^v,8),L=L+P|0,R=W(R^L,7),g=g+k|0,U=W(U^g,16),C=C+U|0,k=W(k^C,12),g=g+k|0,U=W(U^g,8),C=C+U|0,k=W(k^C,7),$=$+S|0,U=W(U^$,16),L=L+U|0,S=W(S^L,12),$=$+S|0,U=W(U^$,8),L=L+U|0,S=W(S^L,7),w=w+R|0,M=W(M^w,16),C=C+M|0,R=W(R^C,12),w=w+R|0,M=W(M^w,8),C=C+M|0,R=W(R^C,7),v=v+k|0,B=W(B^v,16),A=A+B|0,k=W(k^A,12),v=v+k|0,B=W(B^v,8),A=A+B|0,k=W(k^A,7),g=g+_|0,P=W(P^g,16),I=I+P|0,_=W(_^I,12),g=g+_|0,P=W(P^g,8),I=I+P|0,_=W(_^I,7);let D=0;r[D++]=i+$|0,r[D++]=a+w|0,r[D++]=c+v|0,r[D++]=l+g|0,r[D++]=d+_|0,r[D++]=u+S|0,r[D++]=f+R|0,r[D++]=h+k|0,r[D++]=p+A|0,r[D++]=m+I|0,r[D++]=y+L|0,r[D++]=b+C|0,r[D++]=E+M|0,r[D++]=T+B|0,r[D++]=O+P|0,r[D++]=N+U|0}const ho=Qh(ep,{counterRight:!1,counterLength:4,allowShortKeys:!1});function bl(e,t,n){return Jn(e),n===void 0&&(n=new Uint8Array(e.outputLen)),st(e,n,t)}const Vo=Uint8Array.of(0),ka=Uint8Array.of();function vl(e,t,n,r=32){Jn(e),Ae(r,"length");const o=e.outputLen;if(r>255*o)throw new Error("Length must be <= 255*HashLen");const s=Math.ceil(r/o);n===void 0?n=ka:G(n,void 0,"info");const i=new Uint8Array(s*o),a=st.create(e,t),c=a._cloneInto(),l=new Uint8Array(a.outputLen);for(let d=0;d<s;d++)Vo[0]=d+1,c.update(d===0?ka:l).update(n).update(Vo).digestInto(l),i.set(l,o*d),a._cloneInto(c);return a.destroy(),c.destroy(),Ve(l,Vo),i.slice(0,r)}var tp=Object.defineProperty,X=(e,t)=>{for(var n in t)tp(e,n,{get:t[n],enumerable:!0})},Kt=Symbol("verified"),np=e=>e instanceof Object;function ri(e){if(!np(e)||typeof e.kind!="number"||typeof e.content!="string"||typeof e.created_at!="number"||typeof e.pubkey!="string"||!e.pubkey.match(/^[a-f0-9]{64}$/)||!Array.isArray(e.tags))return!1;for(let t=0;t<e.tags.length;t++){let n=e.tags[t];if(!Array.isArray(n))return!1;for(let r=0;r<n.length;r++)if(typeof n[r]!="string")return!1}return!0}var rp={};X(rp,{binarySearch:()=>oi,bytesToHex:()=>q,hexToBytes:()=>z,insertEventIntoAscendingList:()=>ip,insertEventIntoDescendingList:()=>sp,mergeReverseSortedLists:()=>ap,normalizeURL:()=>op,utf8Decoder:()=>nt,utf8Encoder:()=>Re});var nt=new TextDecoder("utf-8"),Re=new TextEncoder;function op(e){try{e.indexOf("://")===-1&&(e="wss://"+e);let t=new URL(e);return t.protocol==="http:"?t.protocol="ws:":t.protocol==="https:"&&(t.protocol="wss:"),t.pathname=t.pathname.replace(/\/+/g,"/"),t.pathname.endsWith("/")&&(t.pathname=t.pathname.slice(0,-1)),(t.port==="80"&&t.protocol==="ws:"||t.port==="443"&&t.protocol==="wss:")&&(t.port=""),t.searchParams.sort(),t.hash="",t.toString()}catch{throw new Error(`Invalid URL: ${e}`)}}function sp(e,t){const[n,r]=oi(e,o=>t.id===o.id?0:t.created_at===o.created_at?-1:o.created_at-t.created_at);return r||e.splice(n,0,t),e}function ip(e,t){const[n,r]=oi(e,o=>t.id===o.id?0:t.created_at===o.created_at?-1:t.created_at-o.created_at);return r||e.splice(n,0,t),e}function oi(e,t){let n=0,r=e.length-1;for(;n<=r;){const o=Math.floor((n+r)/2),s=t(e[o]);if(s===0)return[o,!0];s<0?r=o-1:n=o+1}return[n,!1]}function ap(e,t){const n=new Array(e.length+t.length);n.length=0;let r=0,o=0,s=[];for(;r<e.length&&o<t.length;){let i;if(e[r]?.created_at>t[o]?.created_at?(i=e[r],r++):(i=t[o],o++),n.length>0&&n[n.length-1].created_at===i.created_at){if(s.includes(i.id))continue}else s.length=0;n.push(i),s.push(i.id)}for(;r<e.length;){const i=e[r];if(r++,n.length>0&&n[n.length-1].created_at===i.created_at){if(s.includes(i.id))continue}else s.length=0;n.push(i),s.push(i.id)}for(;o<t.length;){const i=t[o];if(o++,n.length>0&&n[n.length-1].created_at===i.created_at){if(s.includes(i.id))continue}else s.length=0;n.push(i),s.push(i.id)}return n}var cp=class{generateSecretKey(){return ee.utils.randomSecretKey()}getPublicKey(t){return q(ee.getPublicKey(t))}finalizeEvent(t,n){const r=t;return r.pubkey=q(ee.getPublicKey(n)),r.id=Sr(r),r.sig=q(ee.sign(z(Sr(r)),n)),r[Kt]=!0,r}verifyEvent(t){if(typeof t[Kt]=="boolean")return t[Kt];try{const n=Sr(t);if(n!==t.id)return t[Kt]=!1,!1;const r=ee.verify(z(t.sig),z(n),z(t.pubkey));return t[Kt]=r,r}catch{return t[Kt]=!1,!1}}};function lp(e){if(!ri(e))throw new Error("can't serialize event with wrong or missing properties");return JSON.stringify([0,e.pubkey,e.created_at,e.kind,e.tags,e.content])}function Sr(e){let t=ie(Re.encode(lp(e)));return q(t)}var po=new cp,dp=po.generateSecretKey,mo=po.getPublicKey,Je=po.finalizeEvent,si=po.verifyEvent,up={};X(up,{Application:()=>_m,BadgeAward:()=>vp,BadgeDefinition:()=>ym,BlockedRelaysList:()=>Xp,BlossomServerList:()=>sm,BookmarkList:()=>Jp,Bookmarksets:()=>hm,Calendar:()=>Tm,CalendarEventRSVP:()=>Lm,ChannelCreation:()=>Sl,ChannelHideMessage:()=>Rl,ChannelMessage:()=>Al,ChannelMetadata:()=>Il,ChannelMuteUser:()=>Cl,ChatMessage:()=>wp,ClassifiedListing:()=>Im,ClientAuth:()=>Ll,Comment:()=>Cp,CommunitiesList:()=>Yp,CommunityDefinition:()=>Om,CommunityPostApproval:()=>Pp,Contacts:()=>yp,CreateOrUpdateProduct:()=>vm,CreateOrUpdateStall:()=>bm,Curationsets:()=>pm,Date:()=>Rm,DirectMessageRelaysList:()=>rm,DraftClassifiedListing:()=>Am,DraftLong:()=>Em,Emojisets:()=>km,EncryptedDirectMessage:()=>gp,EventDeletion:()=>bp,FavoriteRelays:()=>em,FileMessage:()=>kp,FileMetadata:()=>Rp,FileServerPreference:()=>om,Followsets:()=>dm,ForumThread:()=>Ep,GenericRepost:()=>di,Genericlists:()=>um,GiftWrap:()=>Tl,GroupMetadata:()=>Bm,HTTPAuth:()=>ui,Handlerinformation:()=>Mm,Handlerrecommendation:()=>$m,Highlights:()=>Gp,InterestsList:()=>tm,Interestsets:()=>gm,JobFeedback:()=>jp,JobRequest:()=>Up,JobResult:()=>Dp,Label:()=>Bp,LightningPubRPC:()=>am,LiveChatMessage:()=>Tp,LiveEvent:()=>xm,LongFormArticle:()=>wm,Metadata:()=>pp,Mutelist:()=>Kp,NWCWalletInfo:()=>im,NWCWalletRequest:()=>Nl,NWCWalletResponse:()=>cm,NormalVideo:()=>xp,NostrConnect:()=>lm,OpenTimestamps:()=>Ip,Photo:()=>_p,Pinlist:()=>Wp,Poll:()=>Ap,PollResponse:()=>Vp,PrivateDirectMessage:()=>xl,ProblemTracker:()=>$p,ProfileBadges:()=>mm,PublicChatsList:()=>Zp,Reaction:()=>li,RecommendRelay:()=>mp,RelayList:()=>zp,RelayReview:()=>Nm,Relaysets:()=>fm,Report:()=>Mp,Reporting:()=>Op,Repost:()=>ci,Seal:()=>_l,SearchRelaysList:()=>Qp,ShortTextNote:()=>kl,ShortVideo:()=>Sp,Time:()=>Cm,UserEmojiList:()=>nm,UserStatuses:()=>Sm,Voice:()=>Lp,VoiceComment:()=>Np,Zap:()=>Fp,ZapGoal:()=>qp,ZapRequest:()=>Hp,classifyKind:()=>fp,isAddressableKind:()=>ai,isEphemeralKind:()=>El,isKind:()=>hp,isRegularKind:()=>wl,isReplaceableKind:()=>ii});function wl(e){return e<1e4&&e!==0&&e!==3}function ii(e){return e===0||e===3||1e4<=e&&e<2e4}function El(e){return 2e4<=e&&e<3e4}function ai(e){return 3e4<=e&&e<4e4}function fp(e){return wl(e)?"regular":ii(e)?"replaceable":El(e)?"ephemeral":ai(e)?"parameterized":"unknown"}function hp(e,t){const n=t instanceof Array?t:[t];return ri(e)&&n.includes(e.kind)||!1}var pp=0,kl=1,mp=2,yp=3,gp=4,bp=5,ci=6,li=7,vp=8,wp=9,Ep=11,_l=13,xl=14,kp=15,di=16,_p=20,xp=21,Sp=22,Sl=40,Il=41,Al=42,Rl=43,Cl=44,Ip=1040,Tl=1059,Ap=1068,Rp=1063,Cp=1111,Tp=1311,Lp=1222,Np=1244,$p=1971,Mp=1984,Op=1984,Bp=1985,Pp=4550,Up=5999,Dp=6999,jp=7e3,qp=9041,Hp=9734,Fp=9735,Gp=9802,Vp=1018,Kp=1e4,Wp=10001,zp=10002,Jp=10003,Yp=10004,Zp=10005,Xp=10006,Qp=10007,em=10012,tm=10015,nm=10030,rm=10050,om=10096,sm=10063,im=13194,am=21e3,Ll=22242,Nl=23194,cm=23195,lm=24133,ui=27235,dm=3e4,um=30001,fm=30002,hm=30003,pm=30004,mm=30008,ym=30009,gm=30015,bm=30017,vm=30018,wm=30023,Em=30024,km=30030,_m=30078,xm=30311,Sm=30315,Im=30402,Am=30403,Rm=31922,Cm=31923,Tm=31924,Lm=31925,Nm=31987,$m=31989,Mm=31990,Om=34550,Bm=39e3,Pm={};X(Pm,{getHex64:()=>fi,getInt:()=>$l,getSubscriptionId:()=>Um,matchEventId:()=>Dm,matchEventKind:()=>qm,matchEventPubkey:()=>jm});function fi(e,t){let n=t.length+3,r=e.indexOf(`"${t}":`)+n,o=e.slice(r).indexOf('"')+r+1;return e.slice(o,o+64)}function $l(e,t){let n=t.length,r=e.indexOf(`"${t}":`)+n+3,o=e.slice(r),s=Math.min(o.indexOf(","),o.indexOf("}"));return parseInt(o.slice(0,s),10)}function Um(e){let t=e.slice(0,22).indexOf('"EVENT"');if(t===-1)return null;let n=e.slice(t+7+1).indexOf('"');if(n===-1)return null;let r=t+7+1+n,o=e.slice(r+1,80).indexOf('"');if(o===-1)return null;let s=r+1+o;return e.slice(r+1,s)}function Dm(e,t){return t===fi(e,"id")}function jm(e,t){return t===fi(e,"pubkey")}function qm(e,t){return t===$l(e,"kind")}var Hm={};X(Hm,{makeAuthEvent:()=>Fm});function Fm(e,t){return{kind:Ll,created_at:Math.floor(Date.now()/1e3),tags:[["relay",e],["challenge",t]],content:""}}var Gm;try{Gm=WebSocket}catch{}var Vm;try{Vm=WebSocket}catch{}var Km={};X(Km,{BECH32_REGEX:()=>Ml,Bech32MaxSize:()=>hi,NostrTypeGuard:()=>Wm,decode:()=>yo,decodeNostrURI:()=>Jm,encodeBytes:()=>bo,naddrEncode:()=>ty,neventEncode:()=>ey,noteEncode:()=>Xm,nprofileEncode:()=>Qm,npubEncode:()=>Zm,nsecEncode:()=>Ym});var Wm={isNProfile:e=>/^nprofile1[a-z\d]+$/.test(e||""),isNEvent:e=>/^nevent1[a-z\d]+$/.test(e||""),isNAddr:e=>/^naddr1[a-z\d]+$/.test(e||""),isNSec:e=>/^nsec1[a-z\d]{58}$/.test(e||""),isNPub:e=>/^npub1[a-z\d]{58}$/.test(e||""),isNote:e=>/^note1[a-z\d]+$/.test(e||""),isNcryptsec:e=>/^ncryptsec1[a-z\d]+$/.test(e||"")},hi=5e3,Ml=/[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;function zm(e){const t=new Uint8Array(4);return t[0]=e>>24&255,t[1]=e>>16&255,t[2]=e>>8&255,t[3]=e&255,t}function Jm(e){try{return e.startsWith("nostr:")&&(e=e.substring(6)),yo(e)}catch{return{type:"invalid",data:null}}}function yo(e){let{prefix:t,words:n}=We.decode(e,hi),r=new Uint8Array(We.fromWords(n));switch(t){case"nprofile":{let o=Ko(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for nprofile");if(o[0][0].length!==32)throw new Error("TLV 0 should be 32 bytes");return{type:"nprofile",data:{pubkey:q(o[0][0]),relays:o[1]?o[1].map(s=>nt.decode(s)):[]}}}case"nevent":{let o=Ko(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for nevent");if(o[0][0].length!==32)throw new Error("TLV 0 should be 32 bytes");if(o[2]&&o[2][0].length!==32)throw new Error("TLV 2 should be 32 bytes");if(o[3]&&o[3][0].length!==4)throw new Error("TLV 3 should be 4 bytes");return{type:"nevent",data:{id:q(o[0][0]),relays:o[1]?o[1].map(s=>nt.decode(s)):[],author:o[2]?.[0]?q(o[2][0]):void 0,kind:o[3]?.[0]?parseInt(q(o[3][0]),16):void 0}}}case"naddr":{let o=Ko(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for naddr");if(!o[2]?.[0])throw new Error("missing TLV 2 for naddr");if(o[2][0].length!==32)throw new Error("TLV 2 should be 32 bytes");if(!o[3]?.[0])throw new Error("missing TLV 3 for naddr");if(o[3][0].length!==4)throw new Error("TLV 3 should be 4 bytes");return{type:"naddr",data:{identifier:nt.decode(o[0][0]),pubkey:q(o[2][0]),kind:parseInt(q(o[3][0]),16),relays:o[1]?o[1].map(s=>nt.decode(s)):[]}}}case"nsec":return{type:t,data:r};case"npub":case"note":return{type:t,data:q(r)};default:throw new Error(`unknown prefix ${t}`)}}function Ko(e){let t={},n=e;for(;n.length>0;){let r=n[0],o=n[1],s=n.slice(2,2+o);if(n=n.slice(2+o),s.length<o)throw new Error(`not enough data to read on TLV ${r}`);t[r]=t[r]||[],t[r].push(s)}return t}function Ym(e){return bo("nsec",e)}function Zm(e){return bo("npub",z(e))}function Xm(e){return bo("note",z(e))}function go(e,t){let n=We.toWords(t);return We.encode(e,n,hi)}function bo(e,t){return go(e,t)}function Qm(e){let t=pi({0:[z(e.pubkey)],1:(e.relays||[]).map(n=>Re.encode(n))});return go("nprofile",t)}function ey(e){let t;e.kind!==void 0&&(t=zm(e.kind));let n=pi({0:[z(e.id)],1:(e.relays||[]).map(r=>Re.encode(r)),2:e.author?[z(e.author)]:[],3:t?[new Uint8Array(t)]:[]});return go("nevent",n)}function ty(e){let t=new ArrayBuffer(4);new DataView(t).setUint32(0,e.kind,!1);let n=pi({0:[Re.encode(e.identifier)],1:(e.relays||[]).map(r=>Re.encode(r)),2:[z(e.pubkey)],3:[new Uint8Array(t)]});return go("naddr",n)}function pi(e){let t=[];return Object.entries(e).reverse().forEach(([n,r])=>{r.forEach(o=>{let s=new Uint8Array(o.length+2);s.set([parseInt(n)],0),s.set([o.length],1),s.set(o,2),t.push(s)})}),oe(...t)}var ny={};X(ny,{decrypt:()=>ry,encrypt:()=>Ol});function Ol(e,t,n){const r=e instanceof Uint8Array?e:z(e),o=je.getSharedSecret(r,z("02"+t)),s=Bl(o);let i=Uint8Array.from(Et(16)),a=Re.encode(n),c=ml(s,i).encrypt(a),l=Ke.encode(new Uint8Array(c)),d=Ke.encode(new Uint8Array(i.buffer));return`${l}?iv=${d}`}function ry(e,t,n){const r=e instanceof Uint8Array?e:z(e);let[o,s]=n.split("?iv="),i=je.getSharedSecret(r,z("02"+t)),a=Bl(i),c=Ke.decode(s),l=Ke.decode(o),d=ml(a,c).decrypt(l);return nt.decode(d)}function Bl(e){return e.slice(1,33)}var oy={};X(oy,{NIP05_REGEX:()=>mi,isNip05:()=>sy,isValid:()=>cy,queryProfile:()=>Pl,searchDomain:()=>ay,useFetchImplementation:()=>iy});var mi=/^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/,sy=e=>mi.test(e||""),vo;try{vo=fetch}catch{}function iy(e){vo=e}async function ay(e,t=""){try{const n=`https://${e}/.well-known/nostr.json?name=${t}`,r=await vo(n,{redirect:"manual"});if(r.status!==200)throw Error("Wrong response code");return(await r.json()).names}catch{return{}}}async function Pl(e){const t=e.match(mi);if(!t)return null;const[,n="_",r]=t;try{const o=`https://${r}/.well-known/nostr.json?name=${n}`,s=await vo(o,{redirect:"manual"});if(s.status!==200)throw Error("Wrong response code");const i=await s.json(),a=i.names[n];return a?{pubkey:a,relays:i.relays?.[a]}:null}catch{return null}}async function cy(e,t){const n=await Pl(t);return n?n.pubkey===e:!1}var ly={};X(ly,{parse:()=>dy});function dy(e){const t={reply:void 0,root:void 0,mentions:[],profiles:[],quotes:[]};let n,r;for(let o=e.tags.length-1;o>=0;o--){const s=e.tags[o];if(s[0]==="e"&&s[1]){const[i,a,c,l,d]=s,u={id:a,relays:c?[c]:[],author:d};if(l==="root"){t.root=u;continue}if(l==="reply"){t.reply=u;continue}if(l==="mention"){t.mentions.push(u);continue}n?r=u:n=u,t.mentions.push(u);continue}if(s[0]==="q"&&s[1]){const[i,a,c]=s;t.quotes.push({id:a,relays:c?[c]:[]})}if(s[0]==="p"&&s[1]){t.profiles.push({pubkey:s[1],relays:s[2]?[s[2]]:[]});continue}}return t.root||(t.root=r||n||t.reply),t.reply||(t.reply=n||t.root),[t.reply,t.root].forEach(o=>{if(!o)return;let s=t.mentions.indexOf(o);if(s!==-1&&t.mentions.splice(s,1),o.author){let i=t.profiles.find(a=>a.pubkey===o.author);i&&i.relays&&(o.relays||(o.relays=[]),i.relays.forEach(a=>{o.relays?.indexOf(a)===-1&&o.relays.push(a)}),i.relays=o.relays)}}),t.mentions.forEach(o=>{if(o.author){let s=t.profiles.find(i=>i.pubkey===o.author);s&&s.relays&&(o.relays||(o.relays=[]),s.relays.forEach(i=>{o.relays.indexOf(i)===-1&&o.relays.push(i)}),s.relays=o.relays)}}),t}var uy={};X(uy,{fetchRelayInformation:()=>hy,useFetchImplementation:()=>fy});var Ul;try{Ul=fetch}catch{}function fy(e){Ul=e}async function hy(e){return await(await fetch(e.replace("ws://","http://").replace("wss://","https://"),{headers:{Accept:"application/nostr+json"}})).json()}var py={};X(py,{getPow:()=>my,minePow:()=>gy});function my(e){let t=0;for(let n=0;n<64;n+=8){const r=parseInt(e.substring(n,n+8),16);if(r===0)t+=32;else{t+=Math.clz32(r);break}}return t}function yy(e){let t=0;for(let n=0;n<e.length;n++){const r=e[n];if(r===0)t+=8;else{t+=Math.clz32(r)-24;break}}return t}function gy(e,t){let n=0;const r=e,o=["nonce",n.toString(),t.toString()];for(r.tags.push(o);;){const s=Math.floor(new Date().getTime()/1e3);s!==r.created_at&&(n=0,r.created_at=s),o[1]=(++n).toString();const i=ie(Re.encode(JSON.stringify([0,r.pubkey,r.created_at,r.kind,r.tags,r.content])));if(yy(i)>=t){r.id=q(i);break}}return r}var by={};X(by,{unwrapEvent:()=>Ty,unwrapManyEvents:()=>Ly,wrapEvent:()=>Zl,wrapManyEvents:()=>Cy});var vy={};X(vy,{createRumor:()=>Wl,createSeal:()=>zl,createWrap:()=>Jl,unwrapEvent:()=>wi,unwrapManyEvents:()=>Yl,wrapEvent:()=>Vr,wrapManyEvents:()=>Ay});var wy={};X(wy,{decrypt:()=>vi,encrypt:()=>bi,getConversationKey:()=>yi,v2:()=>Sy});var Dl=1,jl=65535;function yi(e,t){const n=je.getSharedSecret(e,z("02"+t)).subarray(1,33);return bl(ie,n,Re.encode("nip44-v2"))}function ql(e,t){const n=vl(ie,e,t,76);return{chacha_key:n.subarray(0,32),chacha_nonce:n.subarray(32,44),hmac_key:n.subarray(44,76)}}function gi(e){if(!Number.isSafeInteger(e)||e<1)throw new Error("expected positive integer");if(e<=32)return 32;const t=1<<Math.floor(Math.log2(e-1))+1,n=t<=256?32:t/8;return n*(Math.floor((e-1)/n)+1)}function Ey(e){if(!Number.isSafeInteger(e)||e<Dl||e>jl)throw new Error("invalid plaintext size: must be between 1 and 65535 bytes");const t=new Uint8Array(2);return new DataView(t.buffer).setUint16(0,e,!1),t}function ky(e){const t=Re.encode(e),n=t.length,r=Ey(n),o=new Uint8Array(gi(n)-n);return oe(r,t,o)}function _y(e){const t=new DataView(e.buffer).getUint16(0),n=e.subarray(2,2+t);if(t<Dl||t>jl||n.length!==t||e.length!==2+gi(t))throw new Error("invalid padding");return nt.decode(n)}function Hl(e,t,n){if(n.length!==32)throw new Error("AAD associated data must be 32 bytes");const r=oe(n,t);return st(ie,e,r)}function xy(e){if(typeof e!="string")throw new Error("payload must be a valid string");const t=e.length;if(t<132||t>87472)throw new Error("invalid payload length: "+t);if(e[0]==="#")throw new Error("unknown encryption version");let n;try{n=Ke.decode(e)}catch(s){throw new Error("invalid base64: "+s.message)}const r=n.length;if(r<99||r>65603)throw new Error("invalid data length: "+r);const o=n[0];if(o!==2)throw new Error("unknown encryption version "+o);return{nonce:n.subarray(1,33),ciphertext:n.subarray(33,-32),mac:n.subarray(-32)}}function bi(e,t,n=Et(32)){const{chacha_key:r,chacha_nonce:o,hmac_key:s}=ql(t,n),i=ky(e),a=ho(r,o,i),c=Hl(s,a,n);return Ke.encode(oe(new Uint8Array([2]),n,a,c))}function vi(e,t){const{nonce:n,ciphertext:r,mac:o}=xy(e),{chacha_key:s,chacha_nonce:i,hmac_key:a}=ql(t,n),c=Hl(a,r,n);if(!dl(c,o))throw new Error("invalid MAC");const l=ho(s,i,r);return _y(l)}var Sy={utils:{getConversationKey:yi,calcPaddedLen:gi},encrypt:bi,decrypt:vi},Iy=2880*60,Fl=()=>Math.round(Date.now()/1e3),Gl=()=>Math.round(Fl()-Math.random()*Iy),Vl=(e,t)=>yi(e,t),Kl=(e,t,n)=>bi(JSON.stringify(e),Vl(t,n)),_a=(e,t)=>JSON.parse(vi(e.content,Vl(t,e.pubkey)));function Wl(e,t){const n={created_at:Fl(),content:"",tags:[],...e,pubkey:mo(t)};return n.id=Sr(n),n}function zl(e,t,n){return Je({kind:_l,content:Kl(e,t,n),created_at:Gl(),tags:[]},t)}function Jl(e,t){const n=dp();return Je({kind:Tl,content:Kl(e,n,t),created_at:Gl(),tags:[["p",t]]},n)}function Vr(e,t,n){const r=Wl(e,t),o=zl(r,t,n);return Jl(o,n)}function Ay(e,t,n){if(!n||n.length===0)throw new Error("At least one recipient is required.");const r=mo(t),o=[Vr(e,t,r)];return n.forEach(s=>{o.push(Vr(e,t,s))}),o}function wi(e,t){const n=_a(e,t);return _a(n,t)}function Yl(e,t){let n=[];return e.forEach(r=>{n.push(wi(r,t))}),n.sort((r,o)=>r.created_at-o.created_at),n}function Ry(e,t,n,r){const o={created_at:Math.ceil(Date.now()/1e3),kind:xl,tags:[],content:t};return(Array.isArray(e)?e:[e]).forEach(({publicKey:i,relayUrl:a})=>{o.tags.push(a?["p",i,a]:["p",i])}),r&&o.tags.push(["e",r.eventId,r.relayUrl||"","reply"]),n&&o.tags.push(["subject",n]),o}function Zl(e,t,n,r,o){const s=Ry(t,n,r,o);return Vr(s,e,t.publicKey)}function Cy(e,t,n,r,o){if(!t||t.length===0)throw new Error("At least one recipient is required.");return[{publicKey:mo(e)},...t].map(i=>Zl(e,i,n,r,o))}var Ty=wi,Ly=Yl,Ny={};X(Ny,{finishRepostEvent:()=>$y,getRepostedEvent:()=>My,getRepostedEventPointer:()=>Xl});function $y(e,t,n,r){let o;const s=[...e.tags??[],["e",t.id,n],["p",t.pubkey]];return t.kind===kl?o=ci:(o=di,s.push(["k",String(t.kind)])),Je({kind:o,tags:s,content:e.content===""||t.tags?.find(i=>i[0]==="-")?"":JSON.stringify(t),created_at:e.created_at},r)}function Xl(e){if(![ci,di].includes(e.kind))return;let t,n;for(let r=e.tags.length-1;r>=0&&(t===void 0||n===void 0);r--){const o=e.tags[r];o.length>=2&&(o[0]==="e"&&t===void 0?t=o:o[0]==="p"&&n===void 0&&(n=o))}if(t!==void 0)return{id:t[1],relays:[t[2],n?.[2]].filter(r=>typeof r=="string"),author:n?.[1]}}function My(e,{skipVerification:t}={}){const n=Xl(e);if(n===void 0||e.content==="")return;let r;try{r=JSON.parse(e.content)}catch{return}if(r.id===n.id&&!(!t&&!si(r)))return r}var Oy={};X(Oy,{NOSTR_URI_REGEX:()=>Ei,parse:()=>Py,test:()=>By});var Ei=new RegExp(`nostr:(${Ml.source})`);function By(e){return typeof e=="string"&&new RegExp(`^${Ei.source}$`).test(e)}function Py(e){const t=e.match(new RegExp(`^${Ei.source}$`));if(!t)throw new Error(`Invalid Nostr URI: ${e}`);return{uri:t[0],value:t[1],decoded:yo(t[1])}}var Uy={};X(Uy,{finishReactionEvent:()=>Dy,getReactedEventPointer:()=>jy});function Dy(e,t,n){const r=t.tags.filter(o=>o.length>=2&&(o[0]==="e"||o[0]==="p"));return Je({...e,kind:li,tags:[...e.tags??[],...r,["e",t.id],["p",t.pubkey]],content:e.content??"+"},n)}function jy(e){if(e.kind!==li)return;let t,n;for(let r=e.tags.length-1;r>=0&&(t===void 0||n===void 0);r--){const o=e.tags[r];o.length>=2&&(o[0]==="e"&&t===void 0?t=o:o[0]==="p"&&n===void 0&&(n=o))}if(!(t===void 0||n===void 0))return{id:t[1],relays:[t[2],n[2]].filter(r=>r!==void 0),author:n[1]}}var qy={};X(qy,{parse:()=>Fy});var Wo=/\W/m,xa=/[^\w\/] |[^\w\/]$|$|,| /m,Hy=42;function*Fy(e){let t=[];if(typeof e!="string"){for(let s=0;s<e.tags.length;s++){const i=e.tags[s];i[0]==="emoji"&&i.length>=3&&t.push({type:"emoji",shortcode:i[1],url:i[2]})}e=e.content}const n=e.length;let r=0,o=0;e:for(;o<n;){const s=e.indexOf(":",o),i=e.indexOf("#",o);if(s===-1&&i===-1)break e;if(s===-1||i>=0&&i<s){if(i===0||e[i-1].match(Wo)){const a=e.slice(i+1,i+Hy).match(Wo),c=a?i+1+a.index:n;yield{type:"text",text:e.slice(r,i)},yield{type:"hashtag",value:e.slice(i+1,c)},o=c,r=o;continue e}o=i+1;continue e}if(e.slice(s-5,s)==="nostr"){const a=e.slice(s+60).match(Wo),c=a?s+60+a.index:n;try{let l,{data:d,type:u}=yo(e.slice(s+1,c));switch(u){case"npub":l={pubkey:d};break;case"note":l={id:d};break;case"nsec":o=c+1;continue;default:l=d}r!==s-5&&(yield{type:"text",text:e.slice(r,s-5)}),yield{type:"reference",pointer:l},o=c,r=o;continue e}catch{o=s+1;continue e}}else if(e.slice(s-5,s)==="https"||e.slice(s-4,s)==="http"){const a=e.slice(s+4).match(xa),c=a?s+4+a.index:n,l=e[s-1]==="s"?5:4;try{let d=new URL(e.slice(s-l,c));if(d.hostname.indexOf(".")===-1)throw new Error("invalid url");if(r!==s-l&&(yield{type:"text",text:e.slice(r,s-l)}),/\.(png|jpe?g|gif|webp|heic|svg)$/i.test(d.pathname)){yield{type:"image",url:d.toString()},o=c,r=o;continue e}if(/\.(mp4|avi|webm|mkv|mov)$/i.test(d.pathname)){yield{type:"video",url:d.toString()},o=c,r=o;continue e}if(/\.(mp3|aac|ogg|opus|wav|flac)$/i.test(d.pathname)){yield{type:"audio",url:d.toString()},o=c,r=o;continue e}yield{type:"url",url:d.toString()},o=c,r=o;continue e}catch{o=c+1;continue e}}else if(e.slice(s-3,s)==="wss"||e.slice(s-2,s)==="ws"){const a=e.slice(s+4).match(xa),c=a?s+4+a.index:n,l=e[s-1]==="s"?3:2;try{let d=new URL(e.slice(s-l,c));if(d.hostname.indexOf(".")===-1)throw new Error("invalid ws url");r!==s-l&&(yield{type:"text",text:e.slice(r,s-l)}),yield{type:"relay",url:d.toString()},o=c,r=o;continue e}catch{o=c+1;continue e}}else{for(let a=0;a<t.length;a++){const c=t[a];if(e[s+c.shortcode.length+1]===":"&&e.slice(s+1,s+c.shortcode.length+1)===c.shortcode){r!==s&&(yield{type:"text",text:e.slice(r,s)}),yield c,o=s+c.shortcode.length+2,r=o;continue e}}o=s+1;continue e}}r!==n&&(yield{type:"text",text:e.slice(r)})}var Gy={};X(Gy,{channelCreateEvent:()=>Vy,channelHideMessageEvent:()=>zy,channelMessageEvent:()=>Wy,channelMetadataEvent:()=>Ky,channelMuteUserEvent:()=>Jy});var Vy=(e,t)=>{let n;if(typeof e.content=="object")n=JSON.stringify(e.content);else if(typeof e.content=="string")n=e.content;else return;return Je({kind:Sl,tags:[...e.tags??[]],content:n,created_at:e.created_at},t)},Ky=(e,t)=>{let n;if(typeof e.content=="object")n=JSON.stringify(e.content);else if(typeof e.content=="string")n=e.content;else return;return Je({kind:Il,tags:[["e",e.channel_create_event_id],...e.tags??[]],content:n,created_at:e.created_at},t)},Wy=(e,t)=>{const n=[["e",e.channel_create_event_id,e.relay_url,"root"]];return e.reply_to_channel_message_event_id&&n.push(["e",e.reply_to_channel_message_event_id,e.relay_url,"reply"]),Je({kind:Al,tags:[...n,...e.tags??[]],content:e.content,created_at:e.created_at},t)},zy=(e,t)=>{let n;if(typeof e.content=="object")n=JSON.stringify(e.content);else if(typeof e.content=="string")n=e.content;else return;return Je({kind:Rl,tags:[["e",e.channel_message_event_id],...e.tags??[]],content:n,created_at:e.created_at},t)},Jy=(e,t)=>{let n;if(typeof e.content=="object")n=JSON.stringify(e.content);else if(typeof e.content=="string")n=e.content;else return;return Je({kind:Cl,tags:[["p",e.pubkey_to_mute],...e.tags??[]],content:n,created_at:e.created_at},t)},Yy={};X(Yy,{EMOJI_SHORTCODE_REGEX:()=>Ql,matchAll:()=>Zy,regex:()=>ki,replaceAll:()=>Xy});var Ql=/:(\w+):/,ki=()=>new RegExp(`\\B${Ql.source}\\B`,"g");function*Zy(e){const t=e.matchAll(ki());for(const n of t)try{const[r,o]=n;yield{shortcode:r,name:o,start:n.index,end:n.index+r.length}}catch{}}function Xy(e,t){return e.replaceAll(ki(),(n,r)=>t({shortcode:n,name:r}))}var Qy={};X(Qy,{useFetchImplementation:()=>eg,validateGithub:()=>tg});var _i;try{_i=fetch}catch{}function eg(e){_i=e}async function tg(e,t,n){try{return await(await _i(`https://gist.github.com/${t}/${n}/raw`)).text()===`Verifying that I control the following Nostr public key: ${e}`}catch{return!1}}var ng={};X(ng,{makeNwcRequestEvent:()=>og,parseConnectionString:()=>rg});function rg(e){const{host:t,pathname:n,searchParams:r}=new URL(e),o=n||t,s=r.get("relay"),i=r.get("secret");if(!o||!s||!i)throw new Error("invalid connection string");return{pubkey:o,relay:s,secret:i}}async function og(e,t,n){const o=Ol(t,e,JSON.stringify({method:"pay_invoice",params:{invoice:n}})),s={kind:Nl,created_at:Math.round(Date.now()/1e3),content:o,tags:[["p",e]]};return Je(s,t)}var sg={};X(sg,{normalizeIdentifier:()=>ig});function ig(e){return e=e.trim().toLowerCase(),e=e.normalize("NFKC"),Array.from(e).map(t=>new RegExp("\\p{Letter}","u").test(t)||new RegExp("\\p{Number}","u").test(t)?t:"-").join("")}var ag={};X(ag,{getSatoshisAmountFromBolt11:()=>hg,getZapEndpoint:()=>lg,makeZapReceipt:()=>fg,makeZapRequest:()=>dg,useFetchImplementation:()=>cg,validateZapRequest:()=>ug});var xi;try{xi=fetch}catch{}function cg(e){xi=e}async function lg(e){try{let t="",{lud06:n,lud16:r}=JSON.parse(e.content);if(r){let[i,a]=r.split("@");t=new URL(`/.well-known/lnurlp/${i}`,`https://${a}`).toString()}else if(n){let{words:i}=We.decode(n,1e3),a=We.fromWords(i);t=nt.decode(a)}else return null;let s=await(await xi(t)).json();if(s.allowsNostr&&s.nostrPubkey)return s.callback}catch{}return null}function dg(e){let t={kind:9734,created_at:Math.round(Date.now()/1e3),content:e.comment||"",tags:[["p","pubkey"in e?e.pubkey:e.event.pubkey],["amount",e.amount.toString()],["relays",...e.relays]]};if("event"in e){if(t.tags.push(["e",e.event.id]),ii(e.event.kind)){const n=["a",`${e.event.kind}:${e.event.pubkey}:`];t.tags.push(n)}else if(ai(e.event.kind)){let n=e.event.tags.find(([o,s])=>o==="d"&&s);if(!n)throw new Error("d tag not found or is empty");const r=["a",`${e.event.kind}:${e.event.pubkey}:${n[1]}`];t.tags.push(r)}t.tags.push(["k",e.event.kind.toString()])}return t}function ug(e){let t;try{t=JSON.parse(e)}catch{return"Invalid zap request JSON."}if(!ri(t))return"Zap request is not a valid Nostr event.";if(!si(t))return"Invalid signature on zap request.";let n=t.tags.find(([s,i])=>s==="p"&&i);if(!n)return"Zap request doesn't have a 'p' tag.";if(!n[1].match(/^[a-f0-9]{64}$/))return"Zap request 'p' tag is not valid hex.";let r=t.tags.find(([s,i])=>s==="e"&&i);return r&&!r[1].match(/^[a-f0-9]{64}$/)?"Zap request 'e' tag is not valid hex.":t.tags.find(([s,i])=>s==="relays"&&i)?null:"Zap request doesn't have a 'relays' tag."}function fg({zapRequest:e,preimage:t,bolt11:n,paidAt:r}){let o=JSON.parse(e),s=o.tags.filter(([a])=>a==="e"||a==="p"||a==="a"),i={kind:9735,created_at:Math.round(r.getTime()/1e3),content:"",tags:[...s,["P",o.pubkey],["bolt11",n],["description",e]]};return t&&i.tags.push(["preimage",t]),i}function hg(e){if(e.length<50)return 0;e=e.substring(0,50);const t=e.lastIndexOf("1");if(t===-1)return 0;const n=e.substring(0,t);if(!n.startsWith("lnbc"))return 0;const r=n.substring(4);if(r.length<1)return 0;const o=r[r.length-1],s=o.charCodeAt(0)-48,i=s>=0&&s<=9;let a=r.length-1;if(i&&a++,a<1)return 0;const c=parseInt(r.substring(0,a));switch(o){case"m":return c*1e5;case"u":return c*100;case"n":return c/10;case"p":return c/1e4;default:return c*1e8}}var pg={};X(pg,{Negentropy:()=>td,NegentropyStorageVector:()=>gg,NegentropySync:()=>bg});var zo=97,nn=32,ed=16,kt={Skip:0,Fingerprint:1,IdList:2},Qe=class{_raw;length;constructor(e){typeof e=="number"?(this._raw=new Uint8Array(e),this.length=0):e instanceof Uint8Array?(this._raw=new Uint8Array(e),this.length=e.length):(this._raw=new Uint8Array(512),this.length=0)}unwrap(){return this._raw.subarray(0,this.length)}get capacity(){return this._raw.byteLength}extend(e){if(e instanceof Qe&&(e=e.unwrap()),typeof e.length!="number")throw Error("bad length");const t=e.length+this.length;if(this.capacity<t){const n=this._raw,r=Math.max(this.capacity*2,t);this._raw=new Uint8Array(r),this._raw.set(n)}this._raw.set(e,this.length),this.length+=e.length}shift(){const e=this._raw[0];return this._raw=this._raw.subarray(1),this.length--,e}shiftN(e=1){const t=this._raw.subarray(0,e);return this._raw=this._raw.subarray(e),this.length-=e,t}};function hr(e){let t=0;for(;;){if(e.length===0)throw Error("parse ends prematurely");let n=e.shift();if(t=t<<7|n&127,(n&128)===0)break}return t}function Xe(e){if(e===0)return new Qe(new Uint8Array([0]));let t=[];for(;e!==0;)t.push(e&127),e>>>=7;t.reverse();for(let n=0;n<t.length-1;n++)t[n]|=128;return new Qe(new Uint8Array(t))}function mg(e){return Ir(e,1)[0]}function Ir(e,t){if(e.length<t)throw Error("parse ends prematurely");return e.shiftN(t)}var yg=class{buf;constructor(){this.setToZero()}setToZero(){this.buf=new Uint8Array(nn)}add(e){let t=0,n=0,r=new DataView(this.buf.buffer),o=new DataView(e.buffer);for(let s=0;s<8;s++){let i=s*4,a=r.getUint32(i,!0),c=o.getUint32(i,!0),l=a;l+=t,l+=c,l>4294967295&&(n=1),r.setUint32(i,l&4294967295,!0),t=n,n=0}}negate(){let e=new DataView(this.buf.buffer);for(let n=0;n<8;n++){let r=n*4;e.setUint32(r,~e.getUint32(r,!0))}let t=new Uint8Array(nn);t[0]=1,this.add(t)}getFingerprint(e){let t=new Qe;return t.extend(this.buf),t.extend(Xe(e)),ie(t.unwrap()).subarray(0,ed)}},gg=class{items;sealed;constructor(){this.items=[],this.sealed=!1}insert(e,t){if(this.sealed)throw Error("already sealed");const n=z(t);if(n.byteLength!==nn)throw Error("bad id size for added item");this.items.push({timestamp:e,id:n})}seal(){if(this.sealed)throw Error("already sealed");this.sealed=!0,this.items.sort(Jo);for(let e=1;e<this.items.length;e++)if(Jo(this.items[e-1],this.items[e])===0)throw Error("duplicate item inserted")}unseal(){this.sealed=!1}size(){return this._checkSealed(),this.items.length}getItem(e){if(this._checkSealed(),e>=this.items.length)throw Error("out of range");return this.items[e]}iterate(e,t,n){this._checkSealed(),this._checkBounds(e,t);for(let r=e;r<t&&n(this.items[r],r);++r);}findLowerBound(e,t,n){return this._checkSealed(),this._checkBounds(e,t),this._binarySearch(this.items,e,t,r=>Jo(r,n)<0)}fingerprint(e,t){let n=new yg;return n.setToZero(),this.iterate(e,t,r=>(n.add(r.id),!0)),n.getFingerprint(t-e)}_checkSealed(){if(!this.sealed)throw Error("not sealed")}_checkBounds(e,t){if(e>t||t>this.items.length)throw Error("bad range")}_binarySearch(e,t,n,r){let o=n-t;for(;o>0;){let s=t,i=Math.floor(o/2);s+=i,r(e[s])?(t=++s,o-=i+1):o=i}return t}},td=class{storage;frameSizeLimit;lastTimestampIn;lastTimestampOut;constructor(e,t=6e4){if(t<4096)throw Error("frameSizeLimit too small");this.storage=e,this.frameSizeLimit=t,this.lastTimestampIn=0,this.lastTimestampOut=0}_bound(e,t){return{timestamp:e,id:t||new Uint8Array(0)}}initiate(){let e=new Qe;return e.extend(new Uint8Array([zo])),this.splitRange(0,this.storage.size(),this._bound(Number.MAX_VALUE),e),q(e.unwrap())}reconcile(e,t,n){const r=new Qe(z(e));this.lastTimestampIn=this.lastTimestampOut=0;let o=new Qe;o.extend(new Uint8Array([zo]));let s=mg(r);if(s<96||s>111)throw Error("invalid negentropy protocol version byte");if(s!==zo)throw Error("unsupported negentropy protocol version requested: "+(s-96));let i=this.storage.size(),a=this._bound(0),c=0,l=!1;for(;r.length!==0;){let d=new Qe,u=()=>{l&&(l=!1,d.extend(this.encodeBound(a)),d.extend(Xe(kt.Skip)))},f=this.decodeBound(r),h=hr(r),p=c,m=this.storage.findLowerBound(c,i,f);if(h===kt.Skip)l=!0;else if(h===kt.Fingerprint){let y=Ir(r,ed),b=this.storage.fingerprint(p,m);nd(y,b)!==0?(u(),this.splitRange(p,m,f,d)):l=!0}else if(h===kt.IdList){let y=hr(r),b={};for(let E=0;E<y;E++){let T=Ir(r,nn);b[q(T)]=T}if(l=!0,this.storage.iterate(p,m,E=>{let T=E.id;const O=q(T);return b[O]?delete b[q(T)]:t?.(O),!0}),n)for(let E of Object.values(b))n(q(E))}else throw Error("unexpected mode");if(this.exceededFrameSizeLimit(o.length+d.length)){let y=this.storage.fingerprint(m,i);o.extend(this.encodeBound(this._bound(Number.MAX_VALUE))),o.extend(Xe(kt.Fingerprint)),o.extend(y);break}else o.extend(d);c=m,a=f}return o.length===1?null:q(o.unwrap())}splitRange(e,t,n,r){let o=t-e,s=16;if(o<s*2)r.extend(this.encodeBound(n)),r.extend(Xe(kt.IdList)),r.extend(Xe(o)),this.storage.iterate(e,t,i=>(r.extend(i.id),!0));else{let i=Math.floor(o/s),a=o%s,c=e;for(let l=0;l<s;l++){let d=i+(l<a?1:0),u=this.storage.fingerprint(c,c+d);c+=d;let f;if(c===t)f=n;else{let h,p;this.storage.iterate(c-1,c+1,(m,y)=>(y===c-1?h=m:p=m,!0)),f=this.getMinimalBound(h,p)}r.extend(this.encodeBound(f)),r.extend(Xe(kt.Fingerprint)),r.extend(u)}}}exceededFrameSizeLimit(e){return e>this.frameSizeLimit-200}decodeTimestampIn(e){let t=hr(e);return t=t===0?Number.MAX_VALUE:t-1,this.lastTimestampIn===Number.MAX_VALUE||t===Number.MAX_VALUE?(this.lastTimestampIn=Number.MAX_VALUE,Number.MAX_VALUE):(t+=this.lastTimestampIn,this.lastTimestampIn=t,t)}decodeBound(e){let t=this.decodeTimestampIn(e),n=hr(e);if(n>nn)throw Error("bound key too long");let r=Ir(e,n);return{timestamp:t,id:r}}encodeTimestampOut(e){if(e===Number.MAX_VALUE)return this.lastTimestampOut=Number.MAX_VALUE,Xe(0);let t=e;return e-=this.lastTimestampOut,this.lastTimestampOut=t,Xe(e+1)}encodeBound(e){let t=new Qe;return t.extend(this.encodeTimestampOut(e.timestamp)),t.extend(Xe(e.id.length)),t.extend(e.id),t}getMinimalBound(e,t){if(t.timestamp!==e.timestamp)return this._bound(t.timestamp);{let n=0,r=t.id,o=e.id;for(let s=0;s<nn&&r[s]===o[s];s++)n++;return this._bound(t.timestamp,t.id.subarray(0,n+1))}}};function nd(e,t){for(let n=0;n<e.byteLength;n++){if(e[n]<t[n])return-1;if(e[n]>t[n])return 1}return e.byteLength>t.byteLength?1:e.byteLength<t.byteLength?-1:0}function Jo(e,t){return e.timestamp===t.timestamp?nd(e.id,t.id):e.timestamp-t.timestamp}var bg=class{relay;storage;neg;filter;subscription;onhave;onneed;constructor(e,t,n,r={}){this.relay=e,this.storage=t,this.neg=new td(t),this.onhave=r.onhave,this.onneed=r.onneed,this.filter=n,this.subscription=this.relay.prepareSubscription([{}],{label:r.label||"negentropy"}),this.subscription.oncustom=o=>{switch(o[0]){case"NEG-MSG":{o.length<3&&console.warn(`got invalid NEG-MSG from ${this.relay.url}: ${o}`);try{const s=this.neg.reconcile(o[2],this.onhave,this.onneed);s?this.relay.send(`["NEG-MSG", "${this.subscription.id}", "${s}"]`):(this.close(),r.onclose?.())}catch(s){console.error("negentropy reconcile error:",s),r?.onclose?.(`reconcile error: ${s}`)}break}case"NEG-CLOSE":{const s=o[2];console.warn("negentropy error:",s),r.onclose?.(s);break}case"NEG-ERR":r.onclose?.()}}}async start(){const e=this.neg.initiate();this.relay.send(`["NEG-OPEN","${this.subscription.id}",${JSON.stringify(this.filter)},"${e}"]`)}close(){this.relay.send(`["NEG-CLOSE","${this.subscription.id}"]`),this.subscription.close()}},vg={};X(vg,{getToken:()=>wg,hashPayload:()=>Si,unpackEventFromToken:()=>od,validateEvent:()=>dd,validateEventKind:()=>id,validateEventMethodTag:()=>cd,validateEventPayloadTag:()=>ld,validateEventTimestamp:()=>sd,validateEventUrlTag:()=>ad,validateToken:()=>Eg});var rd="Nostr ";async function wg(e,t,n,r=!1,o){const s={kind:ui,tags:[["u",e],["method",t]],created_at:Math.round(new Date().getTime()/1e3),content:""};o&&s.tags.push(["payload",Si(o)]);const i=await n(s);return(r?rd:"")+Ke.encode(Re.encode(JSON.stringify(i)))}async function Eg(e,t,n){const r=await od(e).catch(s=>{throw s});return await dd(r,t,n).catch(s=>{throw s})}async function od(e){if(!e)throw new Error("Missing token");e=e.replace(rd,"");const t=nt.decode(Ke.decode(e));if(!t||t.length===0||!t.startsWith("{"))throw new Error("Invalid token");return JSON.parse(t)}function sd(e){return e.created_at?Math.round(new Date().getTime()/1e3)-e.created_at<60:!1}function id(e){return e.kind===ui}function ad(e,t){const n=e.tags.find(r=>r[0]==="u");return n?n.length>0&&n[1]===t:!1}function cd(e,t){const n=e.tags.find(r=>r[0]==="method");return n?n.length>0&&n[1].toLowerCase()===t.toLowerCase():!1}function Si(e){const t=ie(Re.encode(JSON.stringify(e)));return q(t)}function ld(e,t){const n=e.tags.find(o=>o[0]==="payload");if(!n)return!1;const r=Si(t);return n.length>0&&n[1]===r}async function dd(e,t,n,r){if(!si(e))throw new Error("Invalid nostr event, signature invalid");if(!id(e))throw new Error("Invalid nostr event, kind invalid");if(!sd(e))throw new Error("Invalid nostr event, created_at timestamp invalid");if(!ad(e,t))throw new Error("Invalid nostr event, url tag invalid");if(!cd(e,n))throw new Error("Invalid nostr event, method tag invalid");if(r&&typeof r=="object"&&Object.keys(r).length>0&&!ld(e,r))throw new Error("Invalid nostr event, payload tag does not match request body hash");return!0}function kg(e){return Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}const _g="m/44'/1237'/0'/0/0";function xg(){return Uf($c,128)}function ud(e){return Hf(e,$c)}function fd(e){const t=Gf(e),r=At.fromMasterSeed(t).derive(_g);if(!r.privateKey)throw new Error("Failed to derive private key");const o=kg(r.privateKey);return{pubkey:mo(r.privateKey),privkey:o}}const Sa=Object.freeze(Object.defineProperty({__proto__:null,generateMnemonic:xg,mnemonicToKeypair:fd,validateMnemonic:ud},Symbol.toStringTag,{value:"Module"})),vs="canary:duress-queue";let ws=null,Es=null,jn=null;function Sg(e){ws=e.encrypt,Es=e.decrypt,jn=e.getPinKey}function Yo(e){return Array.isArray(e)?e.every(t=>t!=null&&typeof t=="object"&&typeof t.groupId=="string"&&t.message!=null):!1}async function Ig(){try{const e=localStorage.getItem(vs);if(!e)return[];const t=JSON.parse(e);if(Yo(t))return t;if(t&&typeof t=="object"&&typeof t.entries=="string"){if(t.encrypted&&Es&&jn){const r=jn();if(!r)return[];const o=await Es(t.entries,r),s=JSON.parse(o);return Yo(s)?s:[]}const n=JSON.parse(t.entries);return Yo(n)?n:[]}return[]}catch{return[]}}async function Ag(e){try{const t=JSON.stringify(e);if(ws&&jn){const n=jn();if(n){const r=await ws(t,n);localStorage.setItem(vs,JSON.stringify({encrypted:!0,entries:r}));return}}localStorage.setItem(vs,JSON.stringify({entries:t}))}catch{}}async function Rg(e){const t=await Ig(),n=t.filter(o=>o.groupId===e),r=t.filter(o=>o.groupId!==e);return await Ag(r),n.map(o=>o.message)}const Kr="canary:groups",Wr="canary:identity",wo="canary:settings",Eo="canary:pin-salt",Bn="canary:active-group",ks="canary:mnemonic";let rn=null;function hd(e){rn=e}function ko(){rn=null}const pr={theme:"dark",pinEnabled:!0,autoLockMinutes:5,defaultRelays:[Ge],defaultReadRelays:[...ot,Ge],defaultWriteRelays:[Ge]};function at(e){try{const t=localStorage.getItem(e);return t===null?null:JSON.parse(t)}catch{return null}}function _t(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch{}}function Te(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function mn(e){return Te(e)&&e._encrypted===!0&&typeof e.ciphertext=="string"}async function Zo(e,t){return{_encrypted:!0,ciphertext:await gc(JSON.stringify(e),t)}}async function Ii(e,t){return JSON.parse(await ao(e.ciphertext,t))}function pd(e){return Te(e)?Object.values(e).some(t=>Te(t)&&t._seedEncrypted===!0):!1}function md(e){return Te(e)&&e._privkeyEncrypted===!0}function yd(){return localStorage.getItem(Eo)}function Cg(){const e=rf(),t=of(e);return localStorage.setItem(Eo,t),t}function gd(){localStorage.removeItem(Eo)}async function Tg(e,t){const n={};for(const[r,o]of Object.entries(e)){const{_seedEncrypted:s,...i}=o;n[r]={...i,seed:s?await ao(o.seed,t):o.seed}}return n}function Lg(e){if(e.readRelays?.length||e.writeRelays?.length)return{readRelays:e.readRelays??[],writeRelays:e.writeRelays??[]};const t=e.relays??[],n=t.length>0?t:[Ge],r=new Set([...ot,...n]);return{readRelays:Array.from(r),writeRelays:n}}function Ai(e){const t={...pr,...e??{}};return t.defaultRelays?.length||(t.defaultRelays=[...pr.defaultRelays]),t.defaultReadRelays?.length||(t.defaultReadRelays=[...pr.defaultReadRelays]),t.defaultWriteRelays?.length||(t.defaultWriteRelays=[...pr.defaultWriteRelays]),t}function Ar(e){if(!Te(e))return{};const t={};for(const[n,r]of Object.entries(e)){if(!Te(r)||typeof r.name!="string")continue;const o=Lg(r);t[n]={...r,id:n,usedInvites:Array.isArray(r.usedInvites)?r.usedInvites.filter(s=>typeof s=="string"):[],latestInviteIssuedAt:typeof r.latestInviteIssuedAt=="number"?r.latestInviteIssuedAt:0,tolerance:typeof r.tolerance=="number"?r.tolerance:1,livenessInterval:typeof r.livenessInterval=="number"?r.livenessInterval:typeof r.rotationInterval=="number"?r.rotationInterval:604800,livenessCheckins:Te(r.livenessCheckins)?Object.fromEntries(Object.entries(r.livenessCheckins).filter(([,s])=>typeof s=="number").map(([s,i])=>[s,i])):{},memberNames:Te(r.memberNames)?Object.fromEntries(Object.entries(r.memberNames).filter(([,s])=>typeof s=="string").map(([s,i])=>[s,i])):void 0,lastPositions:Te(r.lastPositions)?Object.fromEntries(Object.entries(r.lastPositions).filter(([,s])=>Te(s)).map(([s,i])=>[s,i])):void 0,beaconPrecision:typeof r.beaconPrecision=="number"?r.beaconPrecision:5,duressPrecision:typeof r.duressPrecision=="number"?r.duressPrecision:9,nostrEnabled:typeof r.nostrEnabled=="boolean"?r.nostrEnabled:o.writeRelays.length>0||o.readRelays.length>0,...o}}return t}function _s(e){return!Te(e)||typeof e.pubkey!="string"?null:{pubkey:e.pubkey,privkey:typeof e.privkey=="string"?e.privkey:void 0,nsec:typeof e.nsec=="string"?e.nsec:void 0,mnemonic:typeof e.mnemonic=="string"?e.mnemonic:void 0,displayName:typeof e.displayName=="string"?e.displayName:void 0,picture:typeof e.picture=="string"?e.picture:void 0,signerType:e.signerType==="nip07"?"nip07":"local"}}function Pn(e){const t=localStorage.getItem(ks);if(!t)return{identity:e,migrated:!1};let n=e;const r=t.trim().replace(/\s+/g," ");try{if(n&&ud(r)){const{pubkey:o}=fd(r);o===n.pubkey&&(n={...n,mnemonic:r})}}catch{}return localStorage.removeItem(ks),{identity:n,migrated:!0}}function bd(e,t){if(typeof e=="string"&&e in t)return e;const n=Object.keys(t);return n.length>0?n[0]:null}async function Ng(e){const t=at(Kr);if(t===null)return{groups:{},migrated:!1};if(mn(t)){if(!e)throw new Error("Encrypted groups require PIN unlock");const n=await Ii(t,e);return{groups:Ar(n),migrated:!1}}if(pd(t)){if(!e)throw new Error("Encrypted groups require PIN unlock");const n=await Tg(t,e);return{groups:Ar(n),migrated:!0}}return{groups:Ar(t),migrated:e!==void 0}}function $g(){const e=at(Kr);return e===null||mn(e)||pd(e)?{groups:{},migrated:!1}:{groups:Ar(e),migrated:!1}}async function Mg(e){const t=at(Wr);if(t===null)return Pn(null);if(mn(t)){if(!e)throw new Error("Encrypted identity requires PIN unlock");const s=await Ii(t,e);return Pn(_s(s))}let n=t,r=e!==void 0;if(md(t)){if(!e)throw new Error("Encrypted identity requires PIN unlock");const s=t.privkey?await ao(t.privkey,e):void 0,{_privkeyEncrypted:i,...a}=t;n={...a,privkey:s},r=!0}const o=Pn(_s(n));return{identity:o.identity,migrated:r||o.migrated}}function Og(){const e=at(Wr);return e===null||mn(e)||md(e)?Pn(null):Pn(_s(e))}async function Bg(e){const t=at(Bn);if(t===null)return{activeGroupId:null,migrated:!1};if(mn(t)){if(!e)throw new Error("Encrypted active group requires PIN unlock");const n=await Ii(t,e);return{activeGroupId:typeof n=="string"?n:null,migrated:!1}}return{activeGroupId:typeof t=="string"?t:null,migrated:e!==void 0}}function Pg(){const e=at(Bn);return e===null||mn(e)?{activeGroupId:null,migrated:!1}:{activeGroupId:typeof e=="string"?e:null,migrated:!1}}async function _o(e,t){if(t){const[n,r,o]=await Promise.all([Zo(e.groups,t),Zo(e.identity,t),Zo(e.activeGroupId,t)]);_t(Kr,n),_t(Wr,r),_t(Bn,o)}else _t(Kr,e.groups),_t(Wr,e.identity),e.activeGroupId===null?localStorage.removeItem(Bn):_t(Bn,e.activeGroupId);_t(wo,e.settings),localStorage.removeItem(ks)}async function Ri(){const e=x(),t=!!yd();if(e.settings.pinEnabled&&t&&rn===null){console.error("[canary:storage] PIN enabled but key not loaded — state NOT persisted.");return}try{await _o(e,e.settings.pinEnabled&&rn!==null?rn:void 0)}catch(n){console.error("[canary:storage] Persistence failed — state NOT persisted:",n)}}function vd(){return localStorage.getItem(Eo)!==null}function Ug(){const e=at(wo);return Ai(e)}async function Dg(e){const t=yd();if(!t)throw new Error("No PIN salt found");const n=bc(t),r=await yc(e,n),o=at(wo),s=Ai(o),[i,a,c]=await Promise.all([Ng(r),Mg(r),Bg(r)]),l={view:"groups",groups:i.groups,activeGroupId:bd(c.activeGroupId,i.groups),identity:a.identity,settings:s};hd(r),mc(l),(i.migrated||a.migrated||c.migrated)&&await _o(l,r)}function jg(){const e=at(wo),t=Ai(e),n=$g(),r=Og(),o=Pg(),s={view:"groups",groups:n.groups,activeGroupId:bd(o.activeGroupId,n.groups),identity:r.identity,settings:t};mc(s),(n.migrated||r.migrated||o.migrated)&&Ri()}let xs=0,Ss,Ia=Promise.resolve();const qg=100;function Hg(){Sg({encrypt:gc,decrypt:ao,getPinKey:()=>rn}),Or(()=>{const e=++xs;clearTimeout(Ss),Ss=setTimeout(()=>{Ia=Ia.then(async()=>{e===xs&&await Ri()}).catch(t=>{console.error("[canary:storage] Serialised write failed:",t)})},qg)}),window.addEventListener("pagehide",()=>xo())}function xo(){clearTimeout(Ss),xs++,Ri().catch(()=>{})}async function Fg(e){const t=Cg(),n=bc(t),r=await yc(e,n);hd(r);try{const o=x();await _o({...o,settings:{...o.settings,pinEnabled:!0}},r)}catch(o){throw ko(),gd(),o}}async function Gg(){const e=x();await _o({...e,settings:{...e.settings,pinEnabled:!1}}),ko(),gd()}const Vg=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],Kg=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]);function Pe(e,t){return(e>>>t|e<<32-t)>>>0}function we(e){const t=e.length*8,n=new Uint8Array(Math.ceil((e.length+9)/64)*64);n.set(e),n[e.length]=128;const r=new DataView(n.buffer);r.setUint32(n.length-8,Math.floor(t/4294967296),!1),r.setUint32(n.length-4,t>>>0,!1);let[o,s,i,a,c,l,d,u]=Vg;const f=new Uint32Array(64);for(let m=0;m<n.length;m+=64){for(let v=0;v<16;v++)f[v]=r.getUint32(m+v*4,!1);for(let v=16;v<64;v++){const g=f[v-15],_=f[v-2],S=Pe(g,7)^Pe(g,18)^g>>>3,R=Pe(_,17)^Pe(_,19)^_>>>10;f[v]=f[v-16]+S+f[v-7]+R>>>0}let y=o,b=s,E=i,T=a,O=c,N=l,$=d,w=u;for(let v=0;v<64;v++){const g=Pe(O,6)^Pe(O,11)^Pe(O,25),_=O&N^~O&$,S=w+g+_+Kg[v]+f[v]>>>0,R=Pe(y,2)^Pe(y,13)^Pe(y,22),k=y&b^y&E^b&E,A=R+k>>>0;w=$,$=N,N=O,O=T+S>>>0,T=E,E=b,b=y,y=S+A>>>0}o=o+y>>>0,s=s+b>>>0,i=i+E>>>0,a=a+T>>>0,c=c+O>>>0,l=l+N>>>0,d=d+$>>>0,u=u+w>>>0}const h=new Uint8Array(32),p=new DataView(h.buffer);return p.setUint32(0,o,!1),p.setUint32(4,s,!1),p.setUint32(8,i,!1),p.setUint32(12,a,!1),p.setUint32(16,c,!1),p.setUint32(20,l,!1),p.setUint32(24,d,!1),p.setUint32(28,u,!1),h}const _n=64;function Ne(e,t){const n=e.length>_n?we(e):e,r=new Uint8Array(_n);r.set(n);const o=new Uint8Array(_n),s=new Uint8Array(_n);for(let d=0;d<_n;d++)o[d]=r[d]^54,s[d]=r[d]^92;const i=$e(o,t),a=we(i),c=$e(s,a),l=we(c);return r.fill(0),o.fill(0),s.fill(0),a.fill(0),i.fill(0),c.fill(0),n!==e&&n.fill(0),l}function wd(){const e=new Uint8Array(32);crypto.getRandomValues(e);const t=ze(e);return e.fill(0),t}function F(e){if(e.length%2!==0)throw new Error(`hexToBytes: odd-length hex string (${e.length} chars)`);const t=new Uint8Array(e.length/2);for(let n=0;n<t.length;n++){const r=e.slice(n*2,n*2+2);if(!/^[0-9a-fA-F]{2}$/.test(r))throw new TypeError(`Invalid hex character at position ${n*2}`);t[n]=parseInt(r,16)}return t}function ze(e){let t="";for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,"0");return t}function Wg(e,t){if(!Number.isInteger(t)||t<0||t+2>e.length)throw new RangeError(`readUint16BE: offset ${t} out of bounds for length ${e.length}`);return(e[t]<<8|e[t+1])>>>0}function $e(...e){const t=e.reduce((o,s)=>o+s.length,0),n=new Uint8Array(t);let r=0;for(const o of e)n.set(o,r),r+=o.length;return n}function Ed(e){let t="";for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return btoa(t)}function zg(e){const t=atob(e),n=new Uint8Array(t.length);for(let r=0;r<t.length;r++)n[r]=t.charCodeAt(r);return n}function Jg(e,t){const n=Math.max(e.length,t.length),r=new Uint8Array(n),o=new Uint8Array(n);r.set(e),o.set(t);let s=e.length^t.length;for(let i=0;i<n;i++)s|=r[i]^o[i];return s===0}const Aa=new TextEncoder;function Qt(e,t){return Jg(Aa.encode(e),Aa.encode(t))}const qn=["ability","able","about","above","absent","absorb","abstract","absurd","access","accident","account","accuse","achieve","acid","acorn","acoustic","acquire","across","act","action","actor","actress","actual","adapt","add","addict","address","adjust","admiral","admit","adult","advance","advice","aerobic","affair","afford","afraid","again","age","agent","agree","ahead","aim","air","airport","aisle","alarm","album","alcohol","alert","alien","all","alley","allow","almost","alone","alpha","alpine","already","also","always","amateur","amazing","amber","among","amount","amused","analyst","anchor","ancient","anger","angle","animal","ankle","announce","annual","another","answer","antenna","antique","anvil","anxiety","any","apart","apology","appear","apple","approve","april","apron","arch","arctic","area","arena","argue","arm","armed","armor","army","around","arrange","arrive","arrow","art","artefact","artist","artwork","ask","aspect","asset","assist","assume","asthma","athlete","atom","attack","attend","attitude","attract","auction","audit","august","aunt","author","auto","autumn","average","avocado","avoid","awake","aware","away","awesome","awful","awkward","axis","baby","bachelor","bacon","badge","badger","bag","bakery","balance","balcony","ball","balm","bamboo","banana","banjo","banner","bar","barely","bargain","barrel","base","basic","basil","basket","battle","beach","beacon","bean","beauty","because","become","beef","beetle","before","begin","behave","behind","belfry","believe","below","belt","bench","benefit","berry","best","better","between","beyond","bicycle","bid","bike","bind","biology","birch","bird","birth","bishop","bitter","black","blame","blanket","bleak","bless","bloom","blossom","blouse","blue","blur","blush","board","boat","bobcat","body","boil","bone","bonfire","bonus","book","boost","border","boring","borrow","boss","bottom","bounce","bouquet","box","boy","bracket","brain","branch","brand","brass","brave","bread","breaker","breeze","brick","bridge","brief","bright","bring","brisk","broccoli","bronze","brook","broom","brother","brown","brush","bubble","buckle","buddy","budget","buffalo","bugle","build","bulb","bulk","bumble","bundle","bunker","burger","burrow","burst","bus","bushel","business","busy","butter","buyer","buzz","cabbage","cabin","cable","cactus","cage","cairn","cake","call","calm","camel","camera","camp","can","canal","cancel","candy","canoe","canopy","canvas","canyon","capable","cape","capital","captain","car","caravan","carbon","card","cargo","carpet","carry","cart","case","cash","casino","castle","casual","cat","catalog","catch","category","cattle","caught","cause","caution","cave","cedar","ceiling","celery","cellar","cement","census","century","cereal","certain","chair","chalk","champion","change","chapter","charge","charter","chase","chat","cheap","check","cheese","chef","cherry","chest","chestnut","chicken","chief","child","chimney","choice","choose","chuckle","chunk","churn","cider","cigar","cinnamon","circle","citizen","city","civil","claim","clam","clap","clarify","claw","clay","clean","clerk","clever","click","client","cliff","climb","clinic","clip","cloak","clock","clog","close","cloth","cloud","clown","club","clump","cluster","clutch","coach","coast","cobalt","cocoa","coconut","code","codex","coffee","coil","coin","collect","color","column","combine","come","comet","comfort","comic","common","company","concert","condor","conduct","confirm","congress","connect","consider","consul","control","convince","cook","cool","copper","copy","coral","core","cork","corn","cornet","correct","cosmos","cost","cotton","couch","cougar","country","couple","course","cousin","cover","coyote","crack","cradle","craft","cram","crane","crater","crawl","cream","credit","creek","crew","cricket","crisp","critic","croft","crop","cross","crouch","crowd","crown","crucial","cruise","crumble","crunch","cry","crystal","cube","culture","cup","cupboard","curious","current","curtain","curve","cushion","custom","cute","cycle","cypress","dad","dagger","dahlia","damp","damsel","dance","danger","dapple","daring","dash","daughter","dawn","day","deal","debate","decade","december","decide","decline","decorate","decrease","defense","define","defy","degree","delay","deliver","delta","demand","demise","denial","denim","dentist","depart","depend","deposit","depot","depth","deputy","derive","describe","desert","design","desk","detail","detect","develop","device","devote","diagram","dial","diamond","diary","dice","diesel","diet","differ","digital","dignity","dilemma","dinner","dinosaur","direct","dirt","disagree","discover","dish","display","distance","divert","divide","divorce","dizzy","doctor","document","dog","doll","dolphin","domain","donate","donkey","donor","door","dorsal","double","dove","draft","drafter","dragon","drake","drama","drastic","draw","dream","dress","drift","drifter","drill","drink","drive","drop","droplet","drum","drummer","dry","duck","dulcet","dune","dungeon","during","dusk","dust","dutch","duty","dwarf","dynamic","eager","eagle","early","earn","earth","easily","east","easy","echo","ecology","economy","edge","edgeway","edit","educate","effort","egg","eight","either","elbow","elder","electric","elegant","element","elephant","elevator","elite","elm","else","embark","ember","embody","embrace","emerald","emerge","emotion","employ","empower","empty","enable","enact","end","endless","endorse","enemy","energy","enforce","engage","engine","enhance","enjoy","enlist","enough","enrich","enroll","ensign","ensure","enter","entire","entry","envelope","episode","epoch","equal","equip","era","erase","erode","erosion","error","escape","essay","essence","estate","estuary","eternal","ether","ethics","everest","evidence","evil","evolve","exact","example","exchange","excite","exclude","excuse","execute","exercise","exhaust","exhibit","exist","exit","exotic","expand","expect","explain","express","extend","extra","eye","eyebrow","fabric","face","faculty","fade","faint","faith","falcon","fall","fallow","false","fame","family","famous","fancy","fantasy","farm","fashion","fat","father","fathom","fatigue","favorite","feature","february","federal","fee","feed","feel","female","fence","fennel","fern","festival","fetch","fever","fiber","fiction","fiddle","field","figure","file","film","filter","final","finch","find","finger","finish","fire","firm","first","fiscal","fish","fit","fitness","fix","fjord","flag","flagon","flame","flannel","flash","flat","flavor","flicker","flight","flint","flip","float","flock","floor","floret","fluid","flush","flutter","fly","foal","foam","focus","fog","foil","fold","follow","food","foot","force","forest","forge","forget","fork","fortune","forum","forward","fossil","foster","found","foundry","fox","foxglove","fragile","frame","frequent","fresco","fresh","friend","fringe","frog","front","frost","frown","frozen","fruit","fuel","fun","funny","furnace","furrow","future","gadget","gain","galaxy","gallery","galley","game","gap","garage","garbage","garden","garland","garlic","garment","garnet","gas","gasp","gate","gather","gauge","gaze","gazelle","general","genius","genre","gentle","genuine","gesture","geyser","giant","gibbon","gift","giggle","ginger","giraffe","girl","give","glacier","glad","glance","glare","glass","glen","glide","glimpse","globe","gloom","glory","glove","glow","glue","goat","goblet","goddess","gold","golden","good","goose","gopher","gorge","gorilla","gospel","gossip","govern","gown","grab","grace","grain","granite","grant","grape","grass","gravity","great","green","grid","grocery","group","grow","grunt","guard","guess","guide","guilt","guitar","guppy","gust","gym","habit","half","hamlet","hammer","hammock","hamster","hand","happy","harbor","hard","harness","harvest","hat","have","hawk","hawthorn","head","health","heart","hearth","heavy","hedgehog","height","hello","helmet","help","hen","herald","hermit","hero","heron","hickory","hidden","high","hill","hint","hip","hire","history","hobby","hockey","hold","hole","holiday","hollow","home","homeward","honey","hood","hope","horizon","horn","hornet","horse","hospital","host","hotel","hour","hover","howler","hub","huge","human","humble","humor","hundred","hungry","hunt","hunter","hurdle","hurry","husband","hybrid","ice","icon","idea","identify","idle","igloo","ignore","ill","image","imitate","immune","impact","improve","inch","include","income","increase","index","indicate","indigo","indoor","industry","infant","inflict","inform","inhale","inherit","initial","inject","inkwell","inlet","inmate","inner","innocent","input","inquiry","insect","inside","inspire","install","intact","interest","into","invest","invite","involve","inward","iris","iron","island","issue","item","ivory","jacket","jade","jaguar","jar","jasmine","javelin","jazz","jeans","jelly","jersey","jewel","job","join","joke","jostle","journal","journey","joy","jubilee","judge","juice","jumble","jump","junco","jungle","junior","juniper","just","kangaroo","kayak","keen","keep","keeper","kelp","kennel","kernel","kestrel","ketchup","kettle","key","kick","kid","kidney","kind","kindle","kingdom","kinglet","kipper","kiss","kit","kitchen","kite","kitten","kiwi","knapsack","knee","knife","knock","lab","label","labor","ladder","lady","lake","lamp","language","lantern","lapis","laptop","larch","large","later","latin","laugh","laundry","laurel","lava","lavender","law","lawn","layer","lazy","leader","leaf","learn","leave","lecture","left","leg","legal","legend","leisure","lemon","lend","length","lens","leopard","lesson","letter","level","liar","liberty","library","license","lichen","life","lift","light","like","limit","linden","link","linnet","lion","liquid","list","little","live","lizard","llama","load","loan","lobster","local","lock","locust","lodge","logic","long","loom","loop","lottery","lotus","loud","lounge","love","loyal","lucky","luggage","lumber","lumen","lunar","lunch","luxury","machine","mackerel","magic","magnet","main","major","make","mammal","man","manage","mandate","mango","mansion","mantis","manual","maple","marble","march","margin","marine","market","marriage","marsh","marten","mask","masonry","mass","master","match","material","math","matrix","matter","maximum","maze","meadow","mean","measure","mechanic","medal","media","melody","melt","member","memory","mention","menu","mercy","merge","merit","merlin","merry","mesa","mesh","message","metal","method","micron","middle","midnight","milk","millet","million","mimic","mind","minimum","minnow","minor","minute","miracle","mirage","mirror","miss","mistake","mix","mixed","mixture","moat","mobile","model","modify","mohawk","mom","moment","monarch","mongrel","monitor","monkey","month","moon","moose","moral","more","morning","mortar","mosaic","mosquito","mother","motion","motor","mountain","mouse","move","movie","much","muffin","mullet","multiply","muscle","museum","mushroom","music","muslin","mussel","must","mustang","mutual","myrtle","myself","mystery","myth","naive","name","napkin","narrow","narwhal","nation","nature","near","neck","nectar","need","negative","neither","nephew","nest","nester","net","nettle","network","neutral","never","news","newt","next","nice","nimble","noble","noggin","noise","nomad","nominee","noodle","normal","north","nose","notable","note","nothing","notice","novel","now","nuclear","number","nurse","nut","nutmeg","oak","oakmoss","oasis","obey","object","oblige","observe","obsidian","obtain","ocean","octave","october","odor","off","offer","office","often","oil","okay","old","olive","olympic","omit","once","onion","online","only","onyx","opal","open","opera","opinion","oppose","option","orange","orbit","orchard","orchid","order","ordinary","organ","orient","original","oriole","orphan","osprey","ostrich","other","otter","outdoor","outer","outpost","output","outside","oval","oven","over","own","owner","oxygen","oyster","ozone","pact","paddle","page","pagoda","palace","palm","panda","panel","panther","paper","parade","parent","park","parrot","party","pass","patch","path","patient","patrol","pattern","pause","pave","payment","peanut","peasant","pelican","pen","pencil","people","pepper","perfect","permit","person","phone","photo","phrase","physical","piano","picnic","picture","pigeon","pill","pilot","pink","pioneer","pipe","pitch","pizza","place","planet","plastic","plate","play","please","pledge","pluck","plug","poem","poet","point","polar","pole","police","pond","pony","pool","popular","portion","position","possible","post","potato","pottery","powder","power","practice","praise","predict","prefer","prepare","present","pretty","prevent","price","pride","primary","print","priority","private","prize","process","produce","profit","program","project","promote","proof","property","prosper","protect","proud","provide","public","pudding","pull","pulp","pulse","pumpkin","puppy","purchase","purity","purpose","purse","push","put","puzzle","pyramid","quality","quantum","quarter","question","quick","quiz","quote","rabbit","race","rack","radar","radio","rail","rain","raise","rally","ramp","ranch","random","range","rapid","rare","rate","rather","raven","raw","razor","ready","real","reason","rebuild","recall","receive","recipe","record","recycle","reduce","reflect","reform","refuse","region","regular","relax","release","relief","rely","remain","remember","remove","render","renew","rent","reopen","repair","repeat","replace","report","require","rescue","resource","response","result","retire","retreat","return","reunion","reveal","review","reward","rhythm","rib","ribbon","rice","rich","ride","ridge","rifle","ring","ripple","risk","ritual","rival","river","road","roast","robot","robust","rocket","romance","roof","rookie","room","rose","rotate","round","route","royal","rubber","rug","rule","run","runway","rural","saddle","sadness","safe","salad","salmon","salon","salt","salute","same","sample","sand","satisfy","satoshi","sauce","sausage","save","say","scale","scan","school","science","scorpion","scout","screen","script","scrub","search","season","seat","second","secret","section","security","seed","seek","segment","select","sell","seminar","senior","sense","sentence","service","session","settle","setup","seven","shadow","shallow","share","shed","shell","sheriff","shield","shift","shine","shoe","shoot","shop","short","shoulder","shove","shrimp","shuffle","shy","sibling","sick","side","sight","sign","silent","silk","silly","silver","similar","simple","since","sister","situate","six","size","skate","sketch","ski","skill","skin","skirt","slab","slam","sleep","slice","slide","slight","slim","small","smart","smile","smooth","snack","snake","snow","soap","soccer","social","sock","soda","soft","solar","soldier","solid","solution","solve","someone","song","soon","sort","soul","sound","soup","source","south","space","spare","spatial","speak","special","speed","spell","spend","sphere","spice","spider","spike","spin","spirit","spoil","sponsor","spoon","sport","spot","spray","spread","spring","spy","square","squirrel","stable","stadium","staff","stage","stairs","stamp","stand","start","state","stay","steak","stem","step","stereo","stick","still","stock","stomach","stone","stool","story","stove","strategy","street","strong","student","style","subject","submit","subway","success","such","sudden","sugar","suggest","suit","summer","sunny","sunset","super","supply","supreme","sure","surface","surge","surprise","surround","survey","sustain","swap","swarm","sweet","swift","swim","swing","switch","sword","symbol","syrup","system","table","tackle","tag","talent","talk","tape","task","taste","taxi","teach","team","tell","tennis","term","test","text","thank","theme","then","theory","they","this","thought","thrive","throw","thumb","thunder","ticket","tide","tiger","tilt","timber","time","tiny","tip","tired","tissue","title","toast","today","toddler","together","toilet","token","tomato","tomorrow","tone","tonight","tool","tooth","top","topic","topple","torch","tortoise","toss","total","tourist","tower","town","toy","track","trade","traffic","train","transfer","trap","travel","tray","treat","trend","tribe","trick","trigger","trim","trip","trophy","truck","true","trumpet","truth","try","tuition","tunnel","turkey","turn","turtle","twelve","twenty","twice","twin","twist","two","type","typical","umbrella","unable","unaware","uncle","uncover","under","undo","unfair","unfold","uniform","unique","unit","universe","unknown","unlock","until","unusual","update","upgrade","uphold","upon","upper","upset","urban","urge","usage","use","used","useful","useless","usual","utility","vague","valid","valley","valve","vapor","various","vast","vehicle","velvet","vendor","venue","verb","verify","version","very","vessel","veteran","viable","vibrant","vicious","victory","video","village","vintage","violin","virtual","visa","visit","visual","vital","vivid","vocal","voice","volcano","vote","voyage","wagon","walk","wall","walnut","want","warm","warrior","wash","wasp","water","wave","way","wealth","weasel","web","wedding","weekend","welcome","west","wet","whale","what","wheat","wheel","when","whip","whisper","wide","width","wife","wild","will","win","window","wine","wing","wink","winner","winter","wire","wisdom","wise","wish","witness","wolf","woman","wonder","wool","word","work","world","worry","worth","wreck","wrestle","yard","year","yellow","you","young","youth","zebra","zero","zone","zoo"];Object.freeze(qn);const Is=2048,Yg=new Map;for(let e=0;e<qn.length;e++)Yg.set(qn[e],e);function Rr(e){if(e<0||e>=Is)throw new RangeError(`Wordlist index out of range: ${e} (must be 0-${Is-1})`);return qn[e]}const Xn={format:"words",count:1};function Zg(e,t=1,n=qn){if(n.length!==2048)throw new RangeError("Wordlist must contain exactly 2048 entries");if(!Number.isInteger(t)||t<1||t>16)throw new RangeError("Word count must be an integer 1–16");if(e.length<t*2)throw new RangeError("Not enough bytes for requested word count");const r=[];for(let o=0;o<t;o++){const s=Wg(e,o*2)%n.length;r.push(n[s])}return r}const Xg=[0,2,2,3,3,3,4,4,5,5,6];function Qg(e,t=4){if(!Number.isInteger(t)||t<1||t>10)throw new RangeError("PIN digits must be an integer 1–10");if(e.length===0)throw new RangeError("Cannot encode empty byte array as PIN");const n=Xg[t];if(e.length<n)throw new RangeError(`Not enough bytes for ${t}-digit PIN: need ${n}, got ${e.length}`);const r=Math.pow(10,t);if(n>4){let s=0n;for(let i=0;i<n;i++)s=s*256n+BigInt(e[i]);return Number(s%BigInt(r)).toString().padStart(t,"0")}let o=0;for(let s=0;s<n;s++)o=o*256+e[s]>>>0;return(o%r).toString().padStart(t,"0")}function eb(e,t=8){if(!Number.isInteger(t)||t<1||t>64)throw new RangeError("Hex length must be an integer 1–64");const n=Math.ceil(t/2);if(e.length<n)throw new RangeError(`Not enough bytes: need ${n}, got ${e.length}`);let r="";for(let o=0;o<n&&o<e.length;o++)r+=e[o].toString(16).padStart(2,"0");return r.slice(0,t)}function Ut(e,t=Xn){switch(t.format){case"words":return Zg(e,t.count??1,t.wordlist).join(" ");case"pin":return Qg(e,t.digits??4);case"hex":return eb(e,t.length??8);default:throw new Error(`Unsupported encoding format: ${t.format}`)}}const tb=new TextEncoder;function Xo(e){return tb.encode(e)}function Ra(e){if(!Number.isInteger(e)||e<0||e>4294967295)throw new RangeError(`Counter must be an integer 0–${4294967295}, got ${e}`);const t=new Uint8Array(4);return new DataView(t.buffer).setUint32(0,e,!1),t}const Ca=16;function nb(e){const t=typeof e=="string"?F(e):e;if(t.length<Ca)throw new RangeError(`Secret must be at least ${Ca} bytes, got ${t.length}`);return t}function As(e,t,n,r){if(!t||!t.trim())throw new Error("context must be a non-empty string");if(r!==void 0&&r==="")throw new Error("identity must be non-empty when provided");if(r!==void 0&&r.includes("\0"))throw new Error("identity must not contain null bytes");const o=nb(e),s=r?$e(Xo(t),new Uint8Array([0]),Xo(r),Ra(n)):$e(Xo(t),Ra(n));return Ne(o,s)}function rb(e,t,n,r){if(t.includes("\0"))throw new Error("context must not contain null bytes");return As(e,t,n,r)}function rt(e,t,n,r=Xn,o){if(t.includes("\0"))throw new Error("context must not contain null bytes");if(o!==void 0&&o.includes("\0"))throw new Error("identity must not contain null bytes");const s=rb(e,t,n,o);return Ut(s,r)}function xn(e,t,n,r,o=Xn){if(!t||!t.trim())throw new Error("namespace must be a non-empty string");if(t.includes("\0"))throw new Error("namespace must not contain null bytes");if(!n[0]||!n[1]||!n[0].trim()||!n[1].trim())throw new Error("Both roles must be non-empty strings");if(n[0].includes("\0")||n[1].includes("\0"))throw new Error("Roles must not contain null bytes");if(n[0]===n[1])throw new Error(`Roles must be distinct, got ["${n[0]}", "${n[1]}"]`);return{[n[0]]:Ut(As(e,`pair\0${t}\0${n[0]}`,r),o),[n[1]]:Ut(As(e,`pair\0${t}\0${n[1]}`,r),o)}}const zr=10,Ci=604800,Ta=100;function vt(e,t=Ci){if(!Number.isFinite(e)||e<0)throw new RangeError(`timestampSec must be a non-negative finite number, got ${e}`);if(!Number.isFinite(t)||t<=0)throw new RangeError(`rotationIntervalSec must be a positive finite number, got ${t}`);const n=Math.floor(e/t);if(n>4294967295)throw new RangeError(`Counter exceeds uint32 range (${n}). Use a larger rotation interval.`);return n}function So(e){return new TextEncoder().encode(e)}const ob=/^[0-9a-f]{64}$/;function kd(e){if(!ob.test(e))throw new Error("seedHex must be a 64-character lowercase hex string (32 bytes)")}function _d(e){if(e.length!==32)throw new Error("AES-256-GCM requires a 32-byte key")}function xd(e){return kd(e),Ne(F(e),So("canary:sync:key"))}async function Sd(e,t){_d(e);const n=crypto.getRandomValues(new Uint8Array(12)),r=await crypto.subtle.importKey("raw",e,{name:"AES-GCM"},!1,["encrypt"]),o=await crypto.subtle.encrypt({name:"AES-GCM",iv:n},r,So(t)),s=$e(n,new Uint8Array(o));return Ed(s)}async function Id(e,t){_d(e);const n=zg(t);if(n.length<28)throw new Error("decryptEnvelope: encoded data too short (minimum 28 bytes: 12-byte IV + 16-byte GCM tag)");const r=n.slice(0,12),o=n.slice(12),s=await crypto.subtle.importKey("raw",e,{name:"AES-GCM"},!1,["decrypt"]);let i;try{i=await crypto.subtle.decrypt({name:"AES-GCM",iv:r},s,o)}catch{throw new Error("decryptEnvelope: decryption failed — wrong key or tampered data")}return new TextDecoder().decode(i)}function Ad(e,t){if(kd(e),!/^[0-9a-f]{64}$/.test(t))throw new Error("personalPrivkeyHex must be a 64-character lowercase hex string (32 bytes)");const n=F(e),r=$e(So("canary:sync:sign:"),F(t)),o=Ne(n,r);return n.fill(0),r.fill(0),o}function Rd(e){return ze(we(So(e)))}const sb=new TextEncoder;function Jr(e){return sb.encode(e)}function Cd(e){if(!Number.isInteger(e)||e<0||e>4294967295)throw new RangeError(`Counter must be an integer 0–${4294967295}, got ${e}`);const t=new Uint8Array(4);return new DataView(t.buffer).setUint32(0,e,!1),t}const La=16,Na=100;function Td(e){const t=typeof e=="string"?F(e):e;if(t.length<La)throw new RangeError(`Secret must be at least ${La} bytes, got ${t.length}`);return t}function Io(e,t,n,r,o=Xn,s,i){if(!Number.isInteger(s)||s<0)throw new RangeError("maxTolerance must be a non-negative integer");if(s>10)throw new RangeError(`maxTolerance must be <= 10, got ${s}`);const c=new Set,l=2*s,d=Math.max(0,r-l),u=Math.min(4294967295,r+l);for(let b=d;b<=u;b++)if(c.add(rt(e,t,b,o)),i)for(const E of i)c.add(rt(e,t,b,o,E));const f=Td(e),h=$e(Jr(t+":duress"),new Uint8Array([0]),Jr(n),Cd(r));let p=Ne(f,h),m=Ut(p,o),y=1;for(;c.has(m)&&y<=255;)p=Ne(f,$e(h,new Uint8Array([y]))),m=Ut(p,o),y++;if(c.has(m))throw new Error("Duress token collision unresolvable after 255 retries");return m}function $a(e,t,n,r,o,s){const a=s?.encoding??Xn,c=s?.tolerance??0;if(!Number.isInteger(c)||c<0)throw new RangeError("Tolerance must be a non-negative integer");if(c>10)throw new RangeError(`Tolerance must be <= 10, got ${c}`);if(o.length>Na)throw new RangeError(`identities array must not exceed ${Na} entries, got ${o.length}`);const l=r.toLowerCase().trim().replace(/\s+/g," "),d=Math.max(0,n-c),u=Math.min(4294967295,n+c);let f=null;for(const y of o)Qt(l,rt(e,t,n,a,y))&&(f=y);const h=[];for(const y of o){let b=!1;for(let E=d;E<=u;E++)Qt(l,Io(e,t,y,E,a,c,o))&&(b=!0);b&&h.push(y)}let p=null;for(const y of o)for(let b=d;b<=u;b++)b!==n&&Qt(l,rt(e,t,b,a,y))&&(p=y);let m=!1;for(let y=d;y<=u;y++)Qt(l,rt(e,t,y,a))&&(m=!0);return h.length>0?{status:"duress",identities:h}:f?{status:"valid",identities:[f]}:p?{status:"valid",identities:[p]}:m?{status:"valid"}:{status:"invalid"}}function ib(e,t,n,r){const o=Td(e),s=$e(Jr(t+":alive"),new Uint8Array([0]),Jr(n),Cd(r));return Ne(o,s)}const Qo=Object.freeze({family:Object.freeze({wordCount:1,rotationInterval:Ci,description:"Casual verification for family and friends. Single word, weekly rotation. Adequate for live voice/video calls where the attacker gets one attempt. NOT suitable for text-based verification — 11 bits of entropy is trivially brute-forceable without rate limiting."}),"field-ops":Object.freeze({wordCount:2,rotationInterval:86400,description:"High-security preset for journalism, activism, and field operations. Two-word phrases (~22 bits) with daily rotation. Use burn-after-use for maximum protection."}),enterprise:Object.freeze({wordCount:2,rotationInterval:172800,description:"Enterprise incident response. Two-word phrases with 48-hour rotation. Balances security with operational convenience for larger teams."}),event:Object.freeze({wordCount:1,rotationInterval:14400,description:"Temporary groups for conferences, festivals, and meetups. Single word with 4-hour rotation. Fast setup, easy to share at the door."})}),ab=/^[0-9a-f]{64}$/,Ma=100;function Yr(e){if(!ab.test(e))throw new Error(`Invalid member pubkey: expected 64 hex characters, got ${e.length} chars`)}function cb(e){if(typeof e.name!="string"||e.name.length===0)throw new Error("name must be a non-empty string");if(e.name.length>256)throw new Error("name must be at most 256 characters");if(e.preset!==void 0&&(typeof e.preset!="string"||!Object.hasOwn(Qo,e.preset)))throw new Error(`Unknown preset: "${e.preset}". Valid presets: ${Object.keys(Qo).join(", ")}`);const t=Math.floor(Date.now()/1e3),n=e.preset!==void 0?Qo[e.preset]:void 0,r=e.rotationInterval??n?.rotationInterval??Ci,o=e.wordCount??n?.wordCount??1,s=e.tolerance??1;if(!Number.isInteger(r)||r<=0)throw new Error(`rotationInterval must be a positive integer, got ${r}`);if(o!==1&&o!==2&&o!==3)throw new Error(`wordCount must be 1, 2, or 3, got ${o}`);if(!Number.isInteger(s)||s<0||s>zr)throw new RangeError(`tolerance must be an integer 0–${zr}, got ${s}`);if(e.beaconInterval!==void 0&&(!Number.isInteger(e.beaconInterval)||e.beaconInterval<=0))throw new Error(`beaconInterval must be a positive integer, got ${e.beaconInterval}`);if(e.beaconPrecision!==void 0&&(!Number.isInteger(e.beaconPrecision)||e.beaconPrecision<1||e.beaconPrecision>11))throw new Error(`beaconPrecision must be an integer between 1 and 11, got ${e.beaconPrecision}`);for(const a of e.members)Yr(a);if(new Set(e.members).size!==e.members.length)throw new Error("Duplicate pubkeys in members array");if(e.creator!==void 0&&(Yr(e.creator),!e.members.includes(e.creator)))throw new Error("creator must be in members");return o===1&&e.members.length>=10&&console.warn(`[canary-kit] Group has ${e.members.length} members with 1-word encoding. CANARY spec recommends 2+ words for groups of 10+ members to avoid duress collision (~2.2% at 10 members).`),{name:e.name,seed:wd(),members:[...e.members],rotationInterval:r,wordCount:o,tolerance:s,wordlist:e.wordlist??"en-v1",counter:vt(t,r),usageOffset:0,createdAt:t,beaconInterval:e.beaconInterval??300,beaconPrecision:e.beaconPrecision??6,admins:e.creator?[e.creator]:[],epoch:0,consumedOps:[]}}function lb(e){const t=vt(Math.floor(Date.now()/1e3),e.rotationInterval),n=e.counter+e.usageOffset+1;if(n>t+Ta)throw new RangeError(`Cannot advance counter: effective counter ${n} would exceed time-based counter ${t} + MAX_COUNTER_OFFSET (${Ta})`);return{...e,usageOffset:e.usageOffset+1}}function Ti(e){return{...e,seed:wd(),usageOffset:0}}function Ld(e,t){if(Yr(t),e.members.includes(t))return e;if(e.members.length>=Ma)throw new Error(`Cannot add member: group has reached the maximum of ${Ma} members`);return{...e,members:[...e.members,t]}}function Nd(e,t){return Yr(t),{...e,members:e.members.filter(n=>n!==t)}}function db(e,t=Math.floor(Date.now()/1e3)){const n=vt(t,e.rotationInterval);return n<=e.counter?e:{...e,counter:n,usageOffset:0}}const ub=new Set(["member-join","member-leave","counter-advance","reseed","beacon","duress-alert","duress-clear","liveness-checkin","state-snapshot"]),$d=new Set(["member-join","member-leave","counter-advance","reseed","state-snapshot","duress-alert","duress-clear"]),Ue=/^[0-9a-f]{64}$/,Zr=100,ft=100,fb=2e7,mr=256,Hn=300,Xr=60,Oa=1e3;function yr(e,t,n,r){const o=[...e,t];return o.length>Oa?{consumedOps:o.slice(-Oa),consumedOpsFloor:Math.max(r??0,n)}:{consumedOps:o,consumedOpsFloor:r}}const se=2;function Yt(e){return typeof e=="number"&&Number.isFinite(e)}function De(e){return Yt(e)&&Number.isInteger(e)&&e>=0}function Rs(e){const t={...e,protocolVersion:se};if(e.type==="reseed"){const{seed:n,...r}=t;return JSON.stringify({...r,seed:ze(e.seed)})}return JSON.stringify(t)}function Fn(e){if(e==null)return"null";if(typeof e=="number"){if(!Number.isFinite(e))throw new Error("stableStringify: NaN/Infinity not allowed in canonical signing");return JSON.stringify(e)}if(typeof e=="boolean"||typeof e=="string")return JSON.stringify(e);if(Array.isArray(e))return"["+e.map(Fn).join(",")+"]";if(e instanceof Uint8Array)throw new Error("stableStringify: Uint8Array must be hex-encoded before serialisation");if(typeof e=="object"){const t=e;return"{"+Object.keys(t).sort().filter(o=>t[o]!==void 0).map(o=>JSON.stringify(o)+":"+Fn(t[o])).join(",")+"}"}throw new Error(`stableStringify: unsupported type ${typeof e}`)}function Cn(e){if(e.type==="reseed"){const{seed:t,...n}=e;return Fn({...n,seed:ze(t)})}return Fn(e)}function Cs(e){let t;try{t=JSON.parse(e)}catch{throw new Error("Invalid sync message: not valid JSON")}const n=t.type;if(typeof n!="string"||!ub.has(n))throw new Error(`Invalid sync message type: ${String(n)}`);const r=t.timestamp;if(!De(r))throw new Error("Invalid sync message: missing or invalid timestamp");const o=t.protocolVersion;if(o==null)throw new Error("Invalid sync message: protocolVersion is required");if(o!==se)throw new Error(`Unsupported protocol version: ${JSON.stringify(o)} (expected: ${se})`);switch(n){case"member-join":if(typeof t.pubkey!="string"||!Ue.test(t.pubkey))throw new Error("Invalid sync message: member-join requires a 64-char hex pubkey");if(!De(t.epoch))throw new Error("Invalid sync message: member-join requires a non-negative epoch");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: member-join requires a non-empty opId (max 128 chars)");if(t.displayName!==void 0&&(typeof t.displayName!="string"||t.displayName.length>256))throw new Error("Invalid sync message: member-join displayName must be a string of at most 256 characters");return{type:n,pubkey:t.pubkey,timestamp:r,epoch:t.epoch,opId:t.opId,...t.displayName!==void 0?{displayName:t.displayName}:{},protocolVersion:se};case"member-leave":if(typeof t.pubkey!="string"||!Ue.test(t.pubkey))throw new Error("Invalid sync message: member-leave requires a 64-char hex pubkey");if(!De(t.epoch))throw new Error("Invalid sync message: member-leave requires a non-negative epoch");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: member-leave requires a non-empty opId (max 128 chars)");return{type:n,pubkey:t.pubkey,timestamp:r,epoch:t.epoch,opId:t.opId,protocolVersion:se};case"liveness-checkin":if(typeof t.pubkey!="string"||!Ue.test(t.pubkey))throw new Error("Invalid sync message: liveness-checkin requires a 64-char hex pubkey");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: liveness-checkin requires a non-empty opId (max 128 chars)");return{type:n,pubkey:t.pubkey,timestamp:r,opId:t.opId,protocolVersion:se};case"counter-advance":if(!De(t.counter)||t.counter>4294967295)throw new Error("Invalid sync message: counter-advance requires a non-negative counter within uint32 range");if(!De(t.usageOffset))throw new Error("Invalid sync message: counter-advance requires a non-negative usageOffset");if(t.usageOffset>Zr)throw new Error(`Invalid sync message: counter-advance usageOffset exceeds maximum of ${Zr}`);return{type:n,counter:t.counter,usageOffset:t.usageOffset,timestamp:r,protocolVersion:se};case"reseed":if(typeof t.seed!="string"||!Ue.test(t.seed))throw new Error("Invalid sync message: reseed.seed must be a 64-char hex string");if(!De(t.counter))throw new Error("Invalid sync message: reseed requires a non-negative counter");if(!De(t.epoch))throw new Error("Invalid sync message: reseed requires a non-negative epoch");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: reseed requires a non-empty opId (max 128 chars)");if(!Array.isArray(t.admins)||!t.admins.every(s=>typeof s=="string"&&Ue.test(s)))throw new Error("Invalid sync message: reseed.admins must be 64-char hex pubkeys");if(!Array.isArray(t.members)||!t.members.every(s=>typeof s=="string"&&Ue.test(s)))throw new Error("Invalid sync message: reseed.members must be 64-char hex pubkeys");if(t.members.length>ft)throw new Error(`Invalid sync message: reseed.members exceeds maximum of ${ft}`);if(t.admins.length>ft)throw new Error(`Invalid sync message: reseed.admins exceeds maximum of ${ft}`);return{type:n,seed:F(t.seed),counter:t.counter,timestamp:r,epoch:t.epoch,opId:t.opId,admins:[...t.admins],members:[...t.members],protocolVersion:se};case"beacon":if(!Yt(t.lat)||!Yt(t.lon))throw new Error("Invalid sync message: beacon requires numeric lat and lon");if(t.lat<-90||t.lat>90||t.lon<-180||t.lon>180)throw new Error("Invalid sync message: beacon lat/lon out of range");if(!Yt(t.accuracy)||t.accuracy<0||t.accuracy>fb)throw new Error("Invalid sync message: beacon requires a non-negative accuracy");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: beacon requires a non-empty opId (max 128 chars)");return{type:n,lat:t.lat,lon:t.lon,accuracy:t.accuracy,timestamp:r,opId:t.opId,protocolVersion:se};case"duress-alert":if(!Yt(t.lat)||!Yt(t.lon))throw new Error("Invalid sync message: duress-alert requires numeric lat and lon");if(t.lat<-90||t.lat>90||t.lon<-180||t.lon>180)throw new Error("Invalid sync message: duress-alert lat/lon out of range");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: duress-alert requires a non-empty opId (max 128 chars)");if(t.subject!==void 0&&(typeof t.subject!="string"||t.subject.length>mr))throw new Error(`Invalid sync message: duress-alert subject must be a string of at most ${mr} characters`);return{type:n,lat:t.lat,lon:t.lon,timestamp:r,opId:t.opId,...t.subject!==void 0?{subject:t.subject}:{},protocolVersion:se};case"duress-clear":if(typeof t.subject!="string"||t.subject.length===0)throw new Error("Invalid sync message: duress-clear requires a non-empty subject");if(t.subject.length>mr)throw new Error(`Invalid sync message: duress-clear subject exceeds maximum length of ${mr} characters`);if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: duress-clear requires a non-empty opId (max 128 chars)");return{type:n,subject:t.subject,timestamp:r,opId:t.opId,protocolVersion:se};case"state-snapshot":if(typeof t.seed!="string"||!Ue.test(t.seed))throw new Error("Invalid sync message: state-snapshot requires a 64-char hex seed");if(!De(t.counter))throw new Error("Invalid sync message: state-snapshot requires a non-negative counter");if(!De(t.usageOffset))throw new Error("Invalid sync message: state-snapshot requires a non-negative usageOffset");if(!Array.isArray(t.members)||!t.members.every(s=>typeof s=="string"&&Ue.test(s)))throw new Error("Invalid sync message: state-snapshot members must be 64-char hex pubkeys");if(!Array.isArray(t.admins)||!t.admins.every(s=>typeof s=="string"&&Ue.test(s)))throw new Error("Invalid sync message: state-snapshot admins must be 64-char hex pubkeys");if(t.members.length>ft)throw new Error(`Invalid sync message: state-snapshot members exceeds maximum of ${ft}`);if(t.admins.length>ft)throw new Error(`Invalid sync message: state-snapshot admins exceeds maximum of ${ft}`);if(!De(t.epoch))throw new Error("Invalid sync message: state-snapshot requires a non-negative epoch");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: state-snapshot requires a non-empty opId (max 128 chars)");if(t.prevEpochSeed!==void 0&&(typeof t.prevEpochSeed!="string"||!Ue.test(t.prevEpochSeed)))throw new Error("Invalid sync message: state-snapshot.prevEpochSeed must be a 64-char hex string");return{type:n,seed:t.seed,counter:t.counter,usageOffset:t.usageOffset,members:[...t.members],admins:[...t.admins],epoch:t.epoch,opId:t.opId,timestamp:r,...t.prevEpochSeed!==void 0?{prevEpochSeed:t.prevEpochSeed}:{},protocolVersion:se}}throw new Error(`Invalid sync message type: ${n}`)}function Ba(e,t){return e.type==="reseed"||e.type==="state-snapshot"||e.type==="member-join"&&e.pubkey!==t||e.type==="member-leave"&&e.pubkey!==t}function Ao(e,t,n=Math.floor(Date.now()/1e3),r){if(Ba(t,r)){if(!r||!e.admins.includes(r))return e;const o=t.epoch,s=t.opId;if(o===void 0||s===void 0||o<e.epoch)return e;if(t.type==="reseed"){if(o!==e.epoch+1)return e;const i=t;if(!i.admins||!i.members)return e;const a=new Set(i.members);if(!i.admins.every(c=>a.has(c)))return e}else if(t.type==="state-snapshot"){if(o<e.epoch)return e;const i=t;if(!i.admins||!i.members)return e;const a=new Set(i.members);if(!i.admins.every(c=>a.has(c)))return e}else if(o!==e.epoch)return e;if(t.type!=="reseed"&&!(t.type==="state-snapshot"&&o>e.epoch)&&(new Set(e.consumedOps).has(s)||e.consumedOpsFloor!==void 0&&t.timestamp<=e.consumedOpsFloor))return e}if(t.type==="duress-alert"||t.type==="duress-clear"||t.type==="beacon"||t.type==="liveness-checkin"){const o=n-t.timestamp;if(o>Hn||o<-Xr)return e}if($d.has(t.type)&&t.timestamp>n+Xr||t.type==="liveness-checkin"&&r&&t.pubkey!==r||(t.type==="member-leave"||t.type==="member-join"||t.type==="duress-clear")&&!Ba(t,r)&&(new Set(e.consumedOps).has(t.opId)||e.consumedOpsFloor!==void 0&&t.timestamp<=e.consumedOpsFloor))return e;switch(t.type){case"member-join":{let o;try{o=Ld(e,t.pubkey)}catch{return e}const s=yr(o.consumedOps,t.opId,t.timestamp,e.consumedOpsFloor),i=t.displayName?{memberNames:{...o.memberNames,[t.pubkey]:t.displayName}}:{};return{...o,...s,...i}}case"member-leave":if(!e.members.includes(t.pubkey))return e;{const o=Nd(e,t.pubkey),s=yr(o.consumedOps,t.opId,t.timestamp,e.consumedOpsFloor);return{...o,...s}}case"counter-advance":{if(!r||!e.members.includes(r)||t.usageOffset>Zr)return e;const o=e.counter+e.usageOffset,s=t.counter+t.usageOffset;if(s<=o)return e;const a=Math.floor(n/e.rotationInterval)+Zr;return s>a?e:{...e,counter:t.counter,usageOffset:t.usageOffset}}case"reseed":return{...e,seed:ze(t.seed),counter:t.counter,usageOffset:0,members:[...t.members],admins:[...t.admins],epoch:t.epoch,consumedOps:[t.opId]};case"state-snapshot":{if(t.epoch===e.epoch){if(t.seed!==e.seed)return e;const o=e.counter+e.usageOffset;if(t.counter+t.usageOffset<o||!e.members.every(a=>t.members.includes(a))||!e.admins.every(a=>t.admins.includes(a)))return e;const i=yr(e.consumedOps,t.opId,t.timestamp,e.consumedOpsFloor);return{...e,counter:t.counter,usageOffset:t.usageOffset,members:[...t.members],admins:[...t.admins],...i}}return e}case"duress-clear":{const o=yr(e.consumedOps,t.opId,t.timestamp,e.consumedOpsFloor);return{...e,...o}}case"beacon":case"duress-alert":case"liveness-checkin":return e;default:return e}}function hb(e,t,n=Math.floor(Date.now()/1e3),r){const o=Ao(e,t,n,r);if(t.type==="beacon"||t.type==="duress-alert"||t.type==="liveness-checkin"){const s=n-t.timestamp,i=s<=Hn&&s>=-Xr,a=t.type!=="liveness-checkin"||!r||t.pubkey===r;return{state:o,applied:i&&a}}return{state:o,applied:o!==e}}const Li=Object.freeze(Object.defineProperty({__proto__:null,FIRE_AND_FORGET_FRESHNESS_SEC:Hn,MAX_FUTURE_SKEW_SEC:Xr,PROTOCOL_VERSION:se,STORED_MESSAGE_TYPES:$d,applySyncMessage:Ao,applySyncMessageWithResult:hb,canonicaliseSyncMessage:Cn,decodeSyncMessage:Cs,decryptEnvelope:Id,deriveGroupKey:xd,deriveGroupSigningKey:Ad,encodeSyncMessage:Rs,encryptEnvelope:Sd,hashGroupTag:Rd,stableStringify:Fn},Symbol.toStringTag,{value:"Module"}));var Wt=Symbol("verified"),pb=e=>e instanceof Object;function mb(e){if(!pb(e)||typeof e.kind!="number"||typeof e.content!="string"||typeof e.created_at!="number"||typeof e.pubkey!="string"||!e.pubkey.match(/^[a-f0-9]{64}$/)||!Array.isArray(e.tags))return!1;for(let t=0;t<e.tags.length;t++){let n=e.tags[t];if(!Array.isArray(n))return!1;for(let r=0;r<n.length;r++)if(typeof n[r]!="string")return!1}return!0}new TextDecoder("utf-8");var yb=new TextEncoder,gb=class{generateSecretKey(){return ee.utils.randomSecretKey()}getPublicKey(t){return q(ee.getPublicKey(t))}finalizeEvent(t,n){const r=t;return r.pubkey=q(ee.getPublicKey(n)),r.id=es(r),r.sig=q(ee.sign(z(es(r)),n)),r[Wt]=!0,r}verifyEvent(t){if(typeof t[Wt]=="boolean")return t[Wt];try{const n=es(t);if(n!==t.id)return t[Wt]=!1,!1;const r=ee.verify(z(t.sig),z(n),z(t.pubkey));return t[Wt]=r,r}catch{return t[Wt]=!1,!1}}};function bb(e){if(!mb(e))throw new Error("can't serialize event with wrong or missing properties");return JSON.stringify([0,e.pubkey,e.created_at,e.kind,e.tags,e.content])}function es(e){let t=ie(yb.encode(bb(e)));return q(t)}var Ro=new gb,vb=Ro.generateSecretKey,Co=Ro.getPublicKey,it=Ro.finalizeEvent,wt=Ro.verifyEvent,wb=new TextDecoder("utf-8"),Md=new TextEncoder,Od=1,Bd=65535;function Ee(e,t){const n=je.getSharedSecret(e,z("02"+t)).subarray(1,33);return bl(ie,n,Md.encode("nip44-v2"))}function Pd(e,t){const n=vl(ie,e,t,76);return{chacha_key:n.subarray(0,32),chacha_nonce:n.subarray(32,44),hmac_key:n.subarray(44,76)}}function Ud(e){if(!Number.isSafeInteger(e)||e<1)throw new Error("expected positive integer");if(e<=32)return 32;const t=1<<Math.floor(Math.log2(e-1))+1,n=t<=256?32:t/8;return n*(Math.floor((e-1)/n)+1)}function Eb(e){if(!Number.isSafeInteger(e)||e<Od||e>Bd)throw new Error("invalid plaintext size: must be between 1 and 65535 bytes");const t=new Uint8Array(2);return new DataView(t.buffer).setUint16(0,e,!1),t}function kb(e){const t=Md.encode(e),n=t.length,r=Eb(n),o=new Uint8Array(Ud(n)-n);return oe(r,t,o)}function _b(e){const t=new DataView(e.buffer).getUint16(0),n=e.subarray(2,2+t);if(t<Od||t>Bd||n.length!==t||e.length!==2+Ud(t))throw new Error("invalid padding");return wb.decode(n)}function Dd(e,t,n){if(n.length!==32)throw new Error("AAD associated data must be 32 bytes");const r=oe(n,t);return st(ie,e,r)}function xb(e){if(typeof e!="string")throw new Error("payload must be a valid string");const t=e.length;if(t<132||t>87472)throw new Error("invalid payload length: "+t);if(e[0]==="#")throw new Error("unknown encryption version");let n;try{n=Ke.decode(e)}catch(s){throw new Error("invalid base64: "+s.message)}const r=n.length;if(r<99||r>65603)throw new Error("invalid data length: "+r);const o=n[0];if(o!==2)throw new Error("unknown encryption version "+o);return{nonce:n.subarray(1,33),ciphertext:n.subarray(33,-32),mac:n.subarray(-32)}}function Dt(e,t,n=Et(32)){const{chacha_key:r,chacha_nonce:o,hmac_key:s}=Pd(t,n),i=kb(e),a=ho(r,o,i),c=Dd(s,a,n);return Ke.encode(oe(new Uint8Array([2]),n,a,c))}function jt(e,t){const{nonce:n,ciphertext:r,mac:o}=xb(e),{chacha_key:s,chacha_nonce:i,hmac_key:a}=Pd(t,n),c=Dd(a,r,n);if(!dl(c,o))throw new Error("invalid MAC");const l=ho(s,i,r);return _b(l)}function ts(e){if(!/^[0-9a-f]*$/i.test(e)||e.length%2!==0)throw new Error(`Invalid hex string: "${e.slice(0,20)}${e.length>20?"…":""}"`);const t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function Sb(e){return Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}class Pa{constructor(t,n){this.pubkey=t,this.privkeyHex=n}async sign(t){const n=ts(this.privkeyHex);return it(t,n)}async encrypt(t,n){const r=ts(this.privkeyHex),o=Ee(r,n);return Dt(t,o)}async decrypt(t,n){const r=ts(this.privkeyHex),o=Ee(r,n);return jt(t,o)}}class jd{pubkey;signingKey;constructor(t,n){this.signingKey=Ad(t,n),this.pubkey=Co(this.signingKey)}async sign(t){return it(t,this.signingKey)}}function qd(){return typeof window.nostr?.signEvent=="function"}async function Ib(e){if(e.privkey&&e.pubkey)return{signer:new Pa(e.pubkey,e.privkey),signerType:"local",pubkey:e.pubkey,privkey:e.privkey};const t=vb(),n=Co(t),r=Sb(t);return{signer:new Pa(n,r),signerType:"local",pubkey:n,privkey:r}}var It=Symbol("verified"),Ab=e=>e instanceof Object;function Rb(e){if(!Ab(e)||typeof e.kind!="number"||typeof e.content!="string"||typeof e.created_at!="number"||typeof e.pubkey!="string"||!e.pubkey.match(/^[a-f0-9]{64}$/)||!Array.isArray(e.tags))return!1;for(let t=0;t<e.tags.length;t++){let n=e.tags[t];if(!Array.isArray(n))return!1;for(let r=0;r<n.length;r++)if(typeof n[r]!="string")return!1}return!0}new TextDecoder("utf-8");var Cb=new TextEncoder;function Tn(e){try{e.indexOf("://")===-1&&(e="wss://"+e);let t=new URL(e);return t.protocol==="http:"?t.protocol="ws:":t.protocol==="https:"&&(t.protocol="wss:"),t.pathname=t.pathname.replace(/\/+/g,"/"),t.pathname.endsWith("/")&&(t.pathname=t.pathname.slice(0,-1)),(t.port==="80"&&t.protocol==="ws:"||t.port==="443"&&t.protocol==="wss:")&&(t.port=""),t.searchParams.sort(),t.hash="",t.toString()}catch{throw new Error(`Invalid URL: ${e}`)}}var Tb=class{generateSecretKey(){return ee.utils.randomSecretKey()}getPublicKey(e){return q(ee.getPublicKey(e))}finalizeEvent(e,t){const n=e;return n.pubkey=q(ee.getPublicKey(t)),n.id=ns(n),n.sig=q(ee.sign(z(ns(n)),t)),n[It]=!0,n}verifyEvent(e){if(typeof e[It]=="boolean")return e[It];try{const t=ns(e);if(t!==e.id)return e[It]=!1,!1;const n=ee.verify(z(e.sig),z(t),z(e.pubkey));return e[It]=n,n}catch{return e[It]=!1,!1}}};function Lb(e){if(!Rb(e))throw new Error("can't serialize event with wrong or missing properties");return JSON.stringify([0,e.pubkey,e.created_at,e.kind,e.tags,e.content])}function ns(e){let t=ie(Cb.encode(Lb(e)));return q(t)}var To=new Tb;To.generateSecretKey;To.getPublicKey;To.finalizeEvent;var Nb=To.verifyEvent,$b=22242;function Mb(e,t){if(e.ids&&e.ids.indexOf(t.id)===-1||e.kinds&&e.kinds.indexOf(t.kind)===-1||e.authors&&e.authors.indexOf(t.pubkey)===-1)return!1;for(let n in e)if(n[0]==="#"){let r=n.slice(1),o=e[`#${r}`];if(o&&!t.tags.find(([s,i])=>s===n.slice(1)&&o.indexOf(i)!==-1))return!1}return!(e.since&&t.created_at<e.since||e.until&&t.created_at>e.until)}function Ob(e,t){for(let n=0;n<e.length;n++)if(Mb(e[n],t))return!0;return!1}function Bb(e,t){let n=t.length+3,r=e.indexOf(`"${t}":`)+n,o=e.slice(r).indexOf('"')+r+1;return e.slice(o,o+64)}function Pb(e){let t=e.slice(0,22).indexOf('"EVENT"');if(t===-1)return null;let n=e.slice(t+7+1).indexOf('"');if(n===-1)return null;let r=t+7+1+n,o=e.slice(r+1,80).indexOf('"');if(o===-1)return null;let s=r+1+o;return e.slice(r+1,s)}function Ub(e,t){return{kind:$b,created_at:Math.floor(Date.now()/1e3),tags:[["relay",e],["challenge",t]],content:""}}var Hd=class extends Error{constructor(e,t){super(`Tried to send message '${e} on a closed connection to ${t}.`),this.name="SendingOnClosedConnection"}},Fd=class{url;_connected=!1;onclose=null;onnotice=e=>console.debug(`NOTICE from ${this.url}: ${e}`);onauth;baseEoseTimeout=4400;publishTimeout=4400;pingFrequency=29e3;pingTimeout=2e4;resubscribeBackoff=[1e4,1e4,1e4,2e4,2e4,3e4,6e4];openSubs=new Map;enablePing;enableReconnect;idleSince=Date.now();ongoingOperations=0;reconnectTimeoutHandle;pingIntervalHandle;reconnectAttempts=0;skipReconnection=!1;connectionPromise;openCountRequests=new Map;openEventPublishes=new Map;ws;challenge;authPromise;serial=0;verifyEvent;_WebSocket;constructor(e,t){this.url=Tn(e),this.verifyEvent=t.verifyEvent,this._WebSocket=t.websocketImplementation||WebSocket,this.enablePing=t.enablePing,this.enableReconnect=t.enableReconnect||!1}static async connect(e,t){const n=new Fd(e,t);return await n.connect(t),n}closeAllSubscriptions(e){for(let[t,n]of this.openSubs)n.close(e);this.openSubs.clear();for(let[t,n]of this.openEventPublishes)n.reject(new Error(e));this.openEventPublishes.clear();for(let[t,n]of this.openCountRequests)n.reject(new Error(e));this.openCountRequests.clear()}get connected(){return this._connected}async reconnect(){const e=this.resubscribeBackoff[Math.min(this.reconnectAttempts,this.resubscribeBackoff.length-1)];this.reconnectAttempts++,this.reconnectTimeoutHandle=setTimeout(async()=>{try{await this.connect()}catch{}},e)}handleHardClose(e){this.pingIntervalHandle&&(clearInterval(this.pingIntervalHandle),this.pingIntervalHandle=void 0),this._connected=!1,this.connectionPromise=void 0,this.idleSince=void 0,this.enableReconnect&&!this.skipReconnection?this.reconnect():(this.onclose?.(),this.closeAllSubscriptions(e))}async connect(e){let t;return this.connectionPromise?this.connectionPromise:(this.challenge=void 0,this.authPromise=void 0,this.skipReconnection=!1,this.connectionPromise=new Promise((n,r)=>{e?.timeout&&(t=setTimeout(()=>{r("connection timed out"),this.connectionPromise=void 0,this.skipReconnection=!0,this.onclose?.(),this.handleHardClose("relay connection timed out")},e.timeout)),e?.abort&&(e.abort.onabort=r);try{this.ws=new this._WebSocket(this.url)}catch(o){clearTimeout(t),r(o);return}this.ws.onopen=()=>{this.reconnectTimeoutHandle&&(clearTimeout(this.reconnectTimeoutHandle),this.reconnectTimeoutHandle=void 0),clearTimeout(t),this._connected=!0;const o=this.reconnectAttempts>0;this.reconnectAttempts=0;for(const s of this.openSubs.values()){if(s.eosed=!1,o)for(let i=0;i<s.filters.length;i++)s.lastEmitted&&(s.filters[i].since=s.lastEmitted+1);s.fire()}this.enablePing&&(this.pingIntervalHandle=setInterval(()=>this.pingpong(),this.pingFrequency)),n()},this.ws.onerror=()=>{clearTimeout(t),r("connection failed"),this.connectionPromise=void 0,this.skipReconnection=!0,this.onclose?.(),this.handleHardClose("relay connection failed")},this.ws.onclose=o=>{clearTimeout(t),r(o.message||"websocket closed"),this.handleHardClose("relay connection closed")},this.ws.onmessage=this._onmessage.bind(this)}),this.connectionPromise)}waitForPingPong(){return new Promise(e=>{this.ws.once("pong",()=>e(!0)),this.ws.ping()})}waitForDummyReq(){return new Promise((e,t)=>{if(!this.connectionPromise)return t(new Error(`no connection to ${this.url}, can't ping`));try{const n=this.subscribe([{ids:["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"],limit:0}],{label:"<forced-ping>",oneose:()=>{e(!0),n.close()},onclose(){e(!0)},eoseTimeout:this.pingTimeout+1e3})}catch(n){t(n)}})}async pingpong(){this.ws?.readyState===1&&(await Promise.any([this.ws&&this.ws.ping&&this.ws.once?this.waitForPingPong():this.waitForDummyReq(),new Promise(t=>setTimeout(()=>t(!1),this.pingTimeout))])||this.ws?.readyState===this._WebSocket.OPEN&&this.ws?.close())}async send(e){if(!this.connectionPromise)throw new Hd(e,this.url);this.connectionPromise.then(()=>{this.ws?.send(e)})}async auth(e){const t=this.challenge;if(!t)throw new Error("can't perform auth, no challenge was received");return this.authPromise?this.authPromise:(this.authPromise=new Promise(async(n,r)=>{try{let o=await e(Ub(this.url,t)),s=setTimeout(()=>{let i=this.openEventPublishes.get(o.id);i&&(i.reject(new Error("auth timed out")),this.openEventPublishes.delete(o.id))},this.publishTimeout);this.openEventPublishes.set(o.id,{resolve:n,reject:r,timeout:s}),this.send('["AUTH",'+JSON.stringify(o)+"]")}catch(o){console.warn("subscribe auth function failed:",o)}}),this.authPromise)}async publish(e){this.idleSince=void 0,this.ongoingOperations++;const t=new Promise((n,r)=>{const o=setTimeout(()=>{const s=this.openEventPublishes.get(e.id);s&&(s.reject(new Error("publish timed out")),this.openEventPublishes.delete(e.id))},this.publishTimeout);this.openEventPublishes.set(e.id,{resolve:n,reject:r,timeout:o})});return this.send('["EVENT",'+JSON.stringify(e)+"]"),this.ongoingOperations--,this.ongoingOperations===0&&(this.idleSince=Date.now()),t}async count(e,t){this.serial++;const n=t?.id||"count:"+this.serial,r=new Promise((o,s)=>{this.openCountRequests.set(n,{resolve:o,reject:s})});return this.send('["COUNT","'+n+'",'+JSON.stringify(e).substring(1)),r}subscribe(e,t){t.label!=="<forced-ping>"&&(this.idleSince=void 0,this.ongoingOperations++);const n=this.prepareSubscription(e,t);return n.fire(),t.abort&&(t.abort.onabort=()=>n.close(String(t.abort.reason||"<aborted>"))),n}prepareSubscription(e,t){this.serial++;const n=t.id||(t.label?t.label+":":"sub:")+this.serial,r=new Db(this,n,e,t);return this.openSubs.set(n,r),r}close(){this.skipReconnection=!0,this.reconnectTimeoutHandle&&(clearTimeout(this.reconnectTimeoutHandle),this.reconnectTimeoutHandle=void 0),this.pingIntervalHandle&&(clearInterval(this.pingIntervalHandle),this.pingIntervalHandle=void 0),this.closeAllSubscriptions("relay connection closed by us"),this._connected=!1,this.idleSince=void 0,this.onclose?.(),this.ws?.readyState===this._WebSocket.OPEN&&this.ws?.close()}_onmessage(e){const t=e.data;if(!t)return;const n=Pb(t);if(n){const r=this.openSubs.get(n);if(!r)return;const o=Bb(t,"id"),s=r.alreadyHaveEvent?.(o);if(r.receivedEvent?.(this,o),s)return}try{let r=JSON.parse(t);switch(r[0]){case"EVENT":{const o=this.openSubs.get(r[1]),s=r[2];this.verifyEvent(s)&&Ob(o.filters,s)?o.onevent(s):o.oninvalidevent?.(s),(!o.lastEmitted||o.lastEmitted<s.created_at)&&(o.lastEmitted=s.created_at);return}case"COUNT":{const o=r[1],s=r[2],i=this.openCountRequests.get(o);i&&(i.resolve(s.count),this.openCountRequests.delete(o));return}case"EOSE":{const o=this.openSubs.get(r[1]);if(!o)return;o.receivedEose();return}case"OK":{const o=r[1],s=r[2],i=r[3],a=this.openEventPublishes.get(o);a&&(clearTimeout(a.timeout),s?a.resolve(i):a.reject(new Error(i)),this.openEventPublishes.delete(o));return}case"CLOSED":{const o=r[1],s=this.openSubs.get(o);if(!s)return;s.closed=!0,s.close(r[2]);return}case"NOTICE":{this.onnotice(r[1]);return}case"AUTH":{this.challenge=r[1],this.onauth&&this.auth(this.onauth);return}default:{this.openSubs.get(r[1])?.oncustom?.(r);return}}}catch(r){try{const[o,s,i]=JSON.parse(t);console.warn(`[nostr] relay ${this.url} error processing message:`,r,i)}catch{console.warn(`[nostr] relay ${this.url} error processing message:`,r)}return}}},Db=class{relay;id;lastEmitted;closed=!1;eosed=!1;filters;alreadyHaveEvent;receivedEvent;onevent;oninvalidevent;oneose;onclose;oncustom;eoseTimeout;eoseTimeoutHandle;constructor(e,t,n,r){if(n.length===0)throw new Error("subscription can't be created with zero filters");this.relay=e,this.filters=n,this.id=t,this.alreadyHaveEvent=r.alreadyHaveEvent,this.receivedEvent=r.receivedEvent,this.eoseTimeout=r.eoseTimeout||e.baseEoseTimeout,this.oneose=r.oneose,this.onclose=r.onclose,this.oninvalidevent=r.oninvalidevent,this.onevent=r.onevent||(o=>{console.warn(`onevent() callback not defined for subscription '${this.id}' in relay ${this.relay.url}. event received:`,o)})}fire(){this.relay.send('["REQ","'+this.id+'",'+JSON.stringify(this.filters).substring(1)),this.eoseTimeoutHandle=setTimeout(this.receivedEose.bind(this),this.eoseTimeout)}receivedEose(){this.eosed||(clearTimeout(this.eoseTimeoutHandle),this.eosed=!0,this.oneose?.())}close(e="closed by caller"){if(!this.closed&&this.relay.connected){try{this.relay.send('["CLOSE",'+JSON.stringify(this.id)+"]")}catch(t){if(!(t instanceof Hd))throw t}this.closed=!0}this.relay.openSubs.delete(this.id),this.relay.ongoingOperations--,this.relay.ongoingOperations===0&&(this.relay.idleSince=Date.now()),this.onclose?.(e)}},jb=e=>(e[It]=!0,!0),qb=class{relays=new Map;seenOn=new Map;trackRelays=!1;verifyEvent;enablePing;enableReconnect;automaticallyAuth;trustedRelayURLs=new Set;onRelayConnectionFailure;onRelayConnectionSuccess;allowConnectingToRelay;maxWaitForConnection;_WebSocket;constructor(e){this.verifyEvent=e.verifyEvent,this._WebSocket=e.websocketImplementation,this.enablePing=e.enablePing,this.enableReconnect=e.enableReconnect||!1,this.automaticallyAuth=e.automaticallyAuth,this.onRelayConnectionFailure=e.onRelayConnectionFailure,this.onRelayConnectionSuccess=e.onRelayConnectionSuccess,this.allowConnectingToRelay=e.allowConnectingToRelay,this.maxWaitForConnection=e.maxWaitForConnection||3e3}async ensureRelay(e,t){e=Tn(e);let n=this.relays.get(e);if(n||(n=new Fd(e,{verifyEvent:this.trustedRelayURLs.has(e)?jb:this.verifyEvent,websocketImplementation:this._WebSocket,enablePing:this.enablePing,enableReconnect:this.enableReconnect}),n.onclose=()=>{this.relays.delete(e)},this.relays.set(e,n)),this.automaticallyAuth){const r=this.automaticallyAuth(e);r&&(n.onauth=r)}try{await n.connect({timeout:t?.connectionTimeout,abort:t?.abort})}catch(r){throw this.relays.delete(e),r}return n}close(e){e.map(Tn).forEach(t=>{this.relays.get(t)?.close(),this.relays.delete(t)})}subscribe(e,t,n){const r=[],o=[];for(let s=0;s<e.length;s++){const i=Tn(e[s]);r.find(a=>a.url===i)||o.indexOf(i)===-1&&(o.push(i),r.push({url:i,filter:t}))}return this.subscribeMap(r,n)}subscribeMany(e,t,n){return this.subscribe(e,t,n)}subscribeMap(e,t){const n=new Map;for(const f of e){const{url:h,filter:p}=f;n.has(h)||n.set(h,[]),n.get(h).push(p)}const r=Array.from(n.entries()).map(([f,h])=>({url:f,filters:h}));this.trackRelays&&(t.receivedEvent=(f,h)=>{let p=this.seenOn.get(h);p||(p=new Set,this.seenOn.set(h,p)),p.add(f)});const o=new Set,s=[],i=[];let a=f=>{i[f]||(i[f]=!0,i.filter(h=>h).length===r.length&&(t.oneose?.(),a=()=>{}))};const c=[];let l=(f,h)=>{c[f]||(a(f),c[f]=h,c.filter(p=>p).length===r.length&&(t.onclose?.(c),l=()=>{}))};const d=f=>{if(t.alreadyHaveEvent?.(f))return!0;const h=o.has(f);return o.add(f),h},u=Promise.all(r.map(async({url:f,filters:h},p)=>{if(this.allowConnectingToRelay?.(f,["read",h])===!1){l(p,"connection skipped by allowConnectingToRelay");return}let m;try{m=await this.ensureRelay(f,{connectionTimeout:this.maxWaitForConnection<(t.maxWait||0)?Math.max(t.maxWait*.8,t.maxWait-1e3):this.maxWaitForConnection,abort:t.abort})}catch(b){this.onRelayConnectionFailure?.(f),l(p,b?.message||String(b));return}this.onRelayConnectionSuccess?.(f);let y=m.subscribe(h,{...t,oneose:()=>a(p),onclose:b=>{b.startsWith("auth-required: ")&&t.onauth?m.auth(t.onauth).then(()=>{m.subscribe(h,{...t,oneose:()=>a(p),onclose:E=>{l(p,E)},alreadyHaveEvent:d,eoseTimeout:t.maxWait,abort:t.abort})}).catch(E=>{l(p,`auth was required and attempted, but failed with: ${E}`)}):l(p,b)},alreadyHaveEvent:d,eoseTimeout:t.maxWait,abort:t.abort});s.push(y)}));return{async close(f){await u,s.forEach(h=>{h.close(f)})}}}subscribeEose(e,t,n){let r;return r=this.subscribe(e,t,{...n,oneose(){const o="closed automatically on eose";r?r.close(o):n.onclose?.(e.map(s=>o))}}),r}subscribeManyEose(e,t,n){return this.subscribeEose(e,t,n)}async querySync(e,t,n){return new Promise(async r=>{const o=[];this.subscribeEose(e,t,{...n,onevent(s){o.push(s)},onclose(s){r(o)}})})}async get(e,t,n){t.limit=1;const r=await this.querySync(e,t,n);return r.sort((o,s)=>s.created_at-o.created_at),r[0]||null}publish(e,t,n){return e.map(Tn).map(async(r,o,s)=>{if(s.indexOf(r)!==o)return Promise.reject("duplicate url");if(this.allowConnectingToRelay?.(r,["write",t])===!1)return Promise.reject("connection skipped by allowConnectingToRelay");let i;try{i=await this.ensureRelay(r,{connectionTimeout:this.maxWaitForConnection<(n?.maxWait||0)?Math.max(n.maxWait*.8,n.maxWait-1e3):this.maxWaitForConnection,abort:n?.abort})}catch(a){return this.onRelayConnectionFailure?.(r),"connection failure: "+String(a)}return i.publish(t).catch(async a=>{if(a instanceof Error&&a.message.startsWith("auth-required: ")&&n?.onauth)return await i.auth(n.onauth),i.publish(t);throw a}).then(a=>{if(this.trackRelays){let c=this.seenOn.get(t.id);c||(c=new Set,this.seenOn.set(t.id,c)),c.add(i)}return a})})}listConnectionStatus(){const e=new Map;return this.relays.forEach((t,n)=>e.set(n,t.connected)),e}destroy(){this.relays.forEach(e=>e.close()),this.relays=new Map}pruneIdleRelays(e=1e4){const t=[];for(const[n,r]of this.relays)r.idleSince&&Date.now()-r.idleSince>=e&&(this.relays.delete(n),t.push(n),r.close());return t}},Gd;try{Gd=WebSocket}catch{}var Hb=class extends qb{constructor(e){super({verifyEvent:Nb,websocketImplementation:Gd,maxWaitForConnection:3e3,...e})}};let Ie=null,ln=!1,Lo=0,Tt=[],Lt=[];function Qr(){const e=new Set([...Tt,...Lt]);return Array.from(e)}let Vd=Promise.resolve();function Ni(e,t){const n=Se(e),r=t?Se(t):[...n];Ie&&n.length===Tt.length&&n.every(s=>Tt.includes(s))&&r.length===Lt.length&&r.every(s=>Lt.includes(s))||(Ie&&(Ie.close(Qr()),Ie=null,ln=!1,Lo=0,Tt=[],Lt=[]),Tt=n,Lt=r,Qr().length===0)||(Ie=new Hb,ln=!1,Vd=Fb())}function No(){return Vd}async function Fb(){if(!Ie)return;const e=Ie,t=Qr();if(t.length===0)return;let n=0;for(const r of t)try{await e.ensureRelay(r,{connectionTimeout:5e3}),n++}catch(o){console.warn(`[canary:relay] Failed to connect to ${r}:`,o)}Ie===e&&(ln=n>0,Lo=n,ln?console.info(`[canary:relay] Connected to ${n}/${t.length} relay(s)`):console.error("[canary:relay] Could not connect to any relay:",t))}function Kd(){Ie&&Ie.close(Qr()),Ie=null,ln=!1,Lo=0,Tt=[],Lt=[]}function he(){return Ie}function Ft(){return ln}function qt(){return Lo}function Wd(){return[...Tt]}function zd(){return[...Lt]}const Jd=Object.freeze(Object.defineProperty({__proto__:null,connectRelays:Ni,disconnectRelays:Kd,getPool:he,getReadRelayUrls:Wd,getRelayCount:qt,getWriteRelayUrls:zd,isConnected:Ft,waitForConnection:No},Symbol.toStringTag,{value:"Module"})),xt={groupState:30078,signal:20078,giftWrap:1059},Ua=new Set(["member-join","member-leave","counter-advance","reseed","state-snapshot","duress-alert","duress-clear"]),gr=/^[0-9a-f]{64}$/,Da=/^[0-9a-f]{128}$/,br=new TextEncoder,Gb=3,Vb=6e4;class Kb{constructor(t){this.capacity=t}order=[];items=new Set;has(t){return this.items.has(t)}add(t){if(!this.items.has(t)){if(this.order.length>=this.capacity){const n=this.order.shift();this.items.delete(n)}this.order.push(t),this.items.add(t)}}}class eo{constructor(t,n,r,o){this.personalPubkey=r,this.personalPrivkey=o,this.readRelays=Se(t),this.writeRelays=Se(n)}subs=new Map;groupKeys=new Map;tagHashToGroupId=new Map;seenEventIds=new Kb(1e3);decryptFailures=new Map;recoveryPending=new Map;recoverySub=null;readRelays;writeRelays;updateRelays(t,n){this.readRelays=Se(t),this.writeRelays=n?Se(n):[...this.readRelays]}get allRelays(){return Se([...this.readRelays,...this.writeRelays])}registerGroup(t,n,r,o,s){const i=Rd(t);console.info("[canary:sync] registerGroup",t.slice(0,8),"→ tagHash",i.slice(0,12),"members:",o.length),this.groupKeys.set(t,{key:xd(n),signer:r,tagHash:i,members:new Set(o),admins:new Set(s?.admins??[]),onRecoveryRequest:s?.onRecoveryRequest,onRecoveryResponse:s?.onRecoveryResponse}),this.tagHashToGroupId.set(i,t)}unregisterGroup(t){const n=this.groupKeys.get(t);n&&(n.key.fill(0),this.tagHashToGroupId.delete(n.tagHash)),this.groupKeys.delete(t),this.decryptFailures.delete(t),this.recoveryPending.delete(t)}async send(t,n,r){Ft()||Ni(this.readRelays,this.writeRelays);const o=he();if(!o)return;const s=this.groupKeys.get(t);if(!s){console.warn("[canary:sync] No group key registered for",t);return}const i=Rs(n),a={...n,protocolVersion:se},c=Cn(a),l=we(br.encode(c)),d=ze(ee.sign(l,F(this.personalPrivkey))),u=JSON.stringify({s:this.personalPubkey,sig:d,p:i}),f=await Sd(s.key,u),h=Ua.has(n.type),p=h?xt.groupState:xt.signal,y=[["d",h?`ssg/${s.tagHash}:${n.type}`:`ssg/${s.tagHash}`]];h?y.push(["expiration",String(Math.floor(Date.now()/1e3)+10080*60)]):y.push(["t",n.type]);const b={kind:p,content:f,tags:y,created_at:Math.floor(Date.now()/1e3)};try{const E=await s.signer.sign(b);typeof E.id=="string"&&this.seenEventIds.add(E.id),console.info("[canary:sync] Publishing",n.type,"to",t.slice(0,8),"→ d-tag:",s.tagHash.slice(0,12),"(write relays only)"),await o.publish(this.writeRelays,E),console.info("[canary:sync] Published OK")}catch(E){console.error("[canary:sync] Publish failed:",E)}}subscribe(t,n){const r=he();if(!r)return()=>{};const o=this.groupKeys.get(t);if(!o)return console.warn("[canary:sync] No group key registered for",t),()=>{};this._ensureRecoverySub();const s=Array.from(Ua).map(c=>`ssg/${o.tagHash}:${c}`),i={kinds:[xt.groupState,xt.signal],"#d":[`ssg/${o.tagHash}`,...s],since:Math.floor(Date.now()/1e3)-10080*60};console.info("[canary:sync] Subscribing to",t.slice(0,8),"→ filter:",JSON.stringify(i));const a=r.subscribeMany(this.allRelays,i,{onevent:async c=>{try{if(!c||typeof c!="object"||typeof c.pubkey!="string"||typeof c.content!="string")return;console.info("[canary:sync] Received event",c.id?.slice(0,12),"kind:",c.kind,"from pubkey:",c.pubkey?.slice(0,12));const l=this.groupKeys.get(t);if(!l)return;if(!wt(c)){console.warn("[canary:sync] Rejected event with invalid signature");return}if(typeof c.id=="string"&&this.seenEventIds.has(c.id))return;if(typeof c.content=="string"&&c.content.length>65536){console.warn("[canary:sync] Rejected oversized event content");return}let d;try{d=await Id(l.key,c.content)}catch{this._trackDecryptFailure(t);return}this.decryptFailures.delete(t);let u;try{u=JSON.parse(d)}catch{console.warn("[canary:sync] Rejected malformed envelope");return}if(!u||typeof u!="object"){console.warn("[canary:sync] Rejected malformed envelope");return}const f=u.s,h=u.sig,p=u.p;if(typeof f!="string"||typeof h!="string"||typeof p!="string"){console.warn("[canary:sync] Rejected envelope with missing sender proof fields");return}if(!gr.test(f)||!Da.test(h)){console.warn("[canary:sync] Rejected envelope with invalid sender proof encoding");return}const m=Cs(p),y={...m,protocolVersion:se},b=Cn(y),E=we(br.encode(b));if(!ee.verify(F(h),E,F(f))){console.warn("[canary:sync] Rejected envelope with invalid sender proof");return}if(m.type!=="member-join"&&!l.members.has(f)){console.warn("[canary:sync] Rejected message from non-member pubkey");return}if(m.type==="liveness-checkin"&&m.pubkey!==f){console.warn("[canary:sync] Rejected liveness-checkin with mismatched sender");return}console.info("[canary:sync] Dispatching",m.type,"from sender",f.slice(0,8)),n(m,f),typeof c.id=="string"&&this.seenEventIds.add(c.id)}catch(l){console.warn("[canary:sync] Failed to process event:",l)}}});return this.subs.set(t,a),()=>{a.close(),this.subs.delete(t)}}async requestRecovery(t,n,r){const o=he();if(!o)return;const s=this.groupKeys.get(t);if(!s)return;this.recoveryPending.set(t,Date.now());const i=F(this.personalPrivkey);for(const a of s.admins)if(a!==this.personalPubkey)try{const c=JSON.stringify({groupTag:s.tagHash,epoch:n,counter:r}),l=Ee(i,a),d=Dt(c,l),u={kind:xt.signal,content:d,tags:[["p",a],["t","ssg:recovery-request"]],created_at:Math.floor(Date.now()/1e3)},f=it(u,i);await o.publish(this.writeRelays,f)}catch(c){console.warn("[canary:sync] Recovery request to",a.slice(0,8),"failed:",c)}}_ensureRecoverySub(){if(this.recoverySub)return;const t=he();if(!t)return;const n={kinds:[xt.signal],"#p":[this.personalPubkey],"#t":["ssg:recovery-request","ssg:recovery-response"],since:Math.floor(Date.now()/1e3)-300};this.recoverySub=t.subscribeMany(this.allRelays,n,{onevent:async r=>{try{if(!r||typeof r!="object"||!wt(r))return;const o=(r.tags||[]).filter(s=>s[0]==="t").map(s=>s[1]);o.includes("ssg:recovery-request")?await this._handleRecoveryRequest(r):o.includes("ssg:recovery-response")&&await this._handleRecoveryResponse(r)}catch(o){console.warn("[canary:sync] Recovery event processing failed:",o)}}})}async _handleRecoveryRequest(t){const n=he();if(!n)return;const r=t.pubkey;if(!gr.test(r))return;const o=F(this.personalPrivkey),s=Ee(o,r),i=jt(t.content,s);let a;try{a=JSON.parse(i)}catch{return}const c=a.groupTag,l=a.epoch,d=a.counter;if(typeof c!="string"||typeof l!="number"||typeof d!="number")return;const u=this.tagHashToGroupId.get(c);if(!u)return;const f=this.groupKeys.get(u);if(!f)return;if(!f.members.has(r)){console.warn("[canary:sync] Recovery request from non-member",r.slice(0,8));return}if(!f.onRecoveryRequest)return;const h=f.onRecoveryRequest(r,l,d);if(!h)return;const p=Rs(h),m={...h,protocolVersion:se},y=Cn(m),b=we(br.encode(y)),E=ze(ee.sign(b,o)),T=JSON.stringify({s:this.personalPubkey,sig:E,groupTag:c,p}),O=Ee(o,r),N=Dt(T,O),$={kind:xt.signal,content:N,tags:[["p",r],["t","ssg:recovery-response"]],created_at:Math.floor(Date.now()/1e3)},w=it($,o);await n.publish(this.writeRelays,w),console.info("[canary:sync] Sent recovery response to",r.slice(0,8))}async _handleRecoveryResponse(t){const n=t.pubkey;if(!gr.test(n))return;const r=F(this.personalPrivkey),o=Ee(r,n),s=jt(t.content,o);let i;try{i=JSON.parse(s)}catch{return}const a=i.s,c=i.sig,l=i.groupTag,d=i.p;if(typeof a!="string"||typeof c!="string"||typeof l!="string"||typeof d!="string"||!gr.test(a)||!Da.test(c)||a!==n)return;const u=this.tagHashToGroupId.get(l);if(!u)return;const f=this.groupKeys.get(u);if(!f)return;if(!f.admins.has(n)){console.warn("[canary:sync] Recovery response from non-admin",n.slice(0,8));return}const h=Cs(d),p={...h,protocolVersion:se},m=Cn(p),y=we(br.encode(m));if(!ee.verify(F(c),y,F(n))){console.warn("[canary:sync] Recovery response with invalid signature");return}if(h.type!=="state-snapshot"){console.warn("[canary:sync] Recovery response contains non-snapshot type:",h.type);return}if(!h.admins.includes(n)){console.warn("[canary:sync] Recovery response sender not in snapshot admins");return}this.decryptFailures.delete(u),this.recoveryPending.delete(u),f.onRecoveryResponse&&f.onRecoveryResponse(h,n),console.info("[canary:sync] Applied recovery response from",n.slice(0,8))}_trackDecryptFailure(t){const n=(this.decryptFailures.get(t)??0)+1;if(this.decryptFailures.set(t,n),n<Gb)return;const r=this.recoveryPending.get(t);if(r!==void 0&&Date.now()-r<Vb)return;this.recoveryPending.delete(t);const o=this.groupKeys.get(t);o&&o.admins.size>0&&o.onRecoveryResponse&&(console.warn(`[canary:sync] ${n} decrypt failures for group — requesting recovery`),this.requestRecovery(t,0,0).catch(s=>{console.warn("[canary:sync] Auto-recovery request failed:",s)}))}disconnect(){for(const[,t]of this.subs)t.close();this.subs.clear(),this.recoverySub&&(this.recoverySub.close(),this.recoverySub=null)}}function H(e,t="info",n=4e3){const r=document.getElementById("toast-container")??Wb(),o=document.createElement("div");o.className=`toast toast--${t}`,o.textContent=e,r.appendChild(o),requestAnimationFrame(()=>o.classList.add("toast--visible")),setTimeout(()=>{o.classList.remove("toast--visible"),setTimeout(()=>o.remove(),300)},n)}function Wb(){const e=document.createElement("div");return e.id="toast-container",e.className="toast-container",document.body.appendChild(e),e}const zb=Object.freeze(Object.defineProperty({__proto__:null,showToast:H},Symbol.toStringTag,{value:"Module"}));let Un=null;function Jb(e=6e4){Un||(ja(),Un=setInterval(ja,e))}function Yd(){Un&&(clearInterval(Un),Un=null)}function ja(){const{groups:e,identity:t}=x();if(!t)return;const n=Math.floor(Date.now()/1e3);for(const[r,o]of Object.entries(e)){ke(r,{type:"liveness-checkin",pubkey:t.pubkey,timestamp:n,opId:crypto.randomUUID()});const s={...o.livenessCheckins,[t.pubkey]:n};J(r,{livenessCheckins:s})}}const Yb=60;function Zd(e,t,n){const r=x().groups[e];if(!r)return;const o=Math.floor(Date.now()/1e3);if(n>o+Yb)return;const s=r.livenessCheckins[t]??0;if(n<=s)return;const i={...r.livenessCheckins,[t]:n};J(e,{livenessCheckins:i})}const Zb=Object.freeze(Object.defineProperty({__proto__:null,recordCheckin:Zd,startLivenessHeartbeat:Jb,stopLivenessHeartbeat:Yd},Symbol.toStringTag,{value:"Module"}));let me=null;const to=new Map,Xb=500,Ts=new Map;function qa(e,t){const n=Ts.get(e);return n?n.includes(t):!1}function Ha(e,t){let n=Ts.get(e);n||(n=[],Ts.set(e,n)),n.length>=Xb&&n.shift(),n.push(t)}function Qb(e){me=e}async function Me(e,t,n){const{identity:r}=x(),o=t??e;if(!(!r||!r.privkey||e.length===0&&o.length===0))try{Ni(e,o),me?me instanceof eo&&me.updateRelays(e,o):Qb(new eo(e,o,r.pubkey,r.privkey)),n&&Qd(n),n&&Rg(n).then(s=>{for(const i of s)ke(n,i)}),No().then(()=>Gn(Ft(),qt()))}catch(s){console.warn("[canary:sync] ensureTransport failed:",s),Gn(!1,0)}}function ke(e,t){!me||!x().groups[e]||me.send(e,t).catch(r=>{console.warn("[canary:sync] broadcast failed:",r)})}function yn(e){if(!(me instanceof eo))return;const{identity:t,groups:n}=x(),r=n[e];if(!t?.privkey||!r?.seed)return;me.unregisterGroup(e);const o=new jd(r.seed,t.privkey);me.registerGroup(e,r.seed,o,r.members,Xd(e))}function Xd(e){return{admins:x().groups[e]?.admins??[],onRecoveryRequest:(t,n,r)=>{const{groups:o}=x(),s=o[e];return!s||!s.members.includes(t)?null:{type:"state-snapshot",seed:s.seed,counter:s.counter,usageOffset:s.usageOffset,members:s.members,admins:s.admins,epoch:s.epoch,opId:crypto.randomUUID(),timestamp:Math.floor(Date.now()/1e3)}},onRecoveryResponse:(t,n)=>{const{groups:r}=x(),o=r[e];if(!o)return;const s=Ao(o,t,void 0,n);s!==o&&(J(e,s),yn(e),H("Group state recovered from admin","success"))}}}function ev(e,t,n,r=Math.floor(Date.now()/1e3),o=tv){if(t.type==="liveness-checkin"){if(!n)return;const s=r-t.timestamp;s<=Hn&&s>=-60&&(qa(e,t.opId)||(Ha(e,t.opId),Zd(e,n,t.timestamp)));return}if(t.type==="beacon"||t.type==="duress-alert"||t.type==="duress-clear"){const s=r-t.timestamp;if(s>Hn||s<-60||qa(e,t.opId))return;Ha(e,t.opId),o(e,t,n)}}function tv(e,t,n){document.dispatchEvent(new CustomEvent("canary:sync-message",{detail:{groupId:e,message:t,sender:n}}))}function Qd(e){if(!me)return;if(to.get(e)?.(),me instanceof eo){const{identity:n,groups:r}=x(),o=r[e];if(n?.privkey&&o?.seed){const s=new jd(o.seed,n.privkey);me.registerGroup(e,o.seed,s,o.members,Xd(e))}}const t=me.subscribe(e,(n,r)=>{const{groups:o}=x(),s=o[e];if(!s)return;const i=Ao(s,n,void 0,r);if(i!==s&&J(e,i),(n.type==="member-join"||n.type==="member-leave"||n.type==="reseed"||n.type==="state-snapshot")&&yn(e),n.type==="member-join"&&i!==s){const a=n.pubkey?i.memberNames?.[n.pubkey]??r?.slice(0,8)??"Someone":"Someone";document.dispatchEvent(new CustomEvent("canary:member-joined",{detail:{groupId:e,pubkey:n.pubkey,name:a}}))}if(n.type==="member-join"&&i!==s){const a=n.pubkey?i.memberNames?.[n.pubkey]??r?.slice(0,8)??"Someone":"Someone";H(`${a} joined the group`,"success")}else n.type==="reseed"?H("Group secret was rotated","warning"):n.type==="state-snapshot"&&H("Group state recovered","success");ev(e,n,r),cv(),setTimeout(()=>Gn(Ft(),qt()),1500)});to.set(e,t)}function nv(){const{groups:e}=x();for(const t of Object.keys(e))Qd(t)}function dn(){Yd();for(const e of to.values())e();to.clear(),me?.disconnect(),me=null}var vr=new TextDecoder("utf-8");new TextEncoder;var eu=5e3;function tu(e){let{prefix:t,words:n}=We.decode(e,eu),r=new Uint8Array(We.fromWords(n));switch(t){case"nprofile":{let o=rs(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for nprofile");if(o[0][0].length!==32)throw new Error("TLV 0 should be 32 bytes");return{type:"nprofile",data:{pubkey:q(o[0][0]),relays:o[1]?o[1].map(s=>vr.decode(s)):[]}}}case"nevent":{let o=rs(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for nevent");if(o[0][0].length!==32)throw new Error("TLV 0 should be 32 bytes");if(o[2]&&o[2][0].length!==32)throw new Error("TLV 2 should be 32 bytes");if(o[3]&&o[3][0].length!==4)throw new Error("TLV 3 should be 4 bytes");return{type:"nevent",data:{id:q(o[0][0]),relays:o[1]?o[1].map(s=>vr.decode(s)):[],author:o[2]?.[0]?q(o[2][0]):void 0,kind:o[3]?.[0]?parseInt(q(o[3][0]),16):void 0}}}case"naddr":{let o=rs(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for naddr");if(!o[2]?.[0])throw new Error("missing TLV 2 for naddr");if(o[2][0].length!==32)throw new Error("TLV 2 should be 32 bytes");if(!o[3]?.[0])throw new Error("missing TLV 3 for naddr");if(o[3][0].length!==4)throw new Error("TLV 3 should be 4 bytes");return{type:"naddr",data:{identifier:vr.decode(o[0][0]),pubkey:q(o[2][0]),kind:parseInt(q(o[3][0]),16),relays:o[1]?o[1].map(s=>vr.decode(s)):[]}}}case"nsec":return{type:t,data:r};case"npub":case"note":return{type:t,data:q(r)};default:throw new Error(`unknown prefix ${t}`)}}function rs(e){let t={},n=e;for(;n.length>0;){let r=n[0],o=n[1],s=n.slice(2,2+o);if(n=n.slice(2+o),s.length<o)throw new Error(`not enough data to read on TLV ${r}`);t[r]=t[r]||[],t[r].push(s)}return t}function rv(e){return sv("nsec",e)}function ov(e,t){let n=We.toWords(t);return We.encode(e,n,eu)}function sv(e,t){return ov(e,t)}function j(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function nu(){return document.documentElement.getAttribute("data-theme")==="light"?"light":"dark"}function iv(e){e==="light"?document.documentElement.setAttribute("data-theme","light"):document.documentElement.removeAttribute("data-theme")}function ru(e){const t=nu();e.setAttribute("aria-label",t==="dark"?"Switch to light mode":"Switch to dark mode"),e.textContent="◐"}function av(e){const t=nu()==="dark"?"light":"dark";iv(t),te({settings:{...x().settings,theme:t}}),ru(e)}function $i(e){const t=x().view;e.innerHTML=`
    <button class="header__hamburger" id="hamburger" aria-label="Toggle menu">&#9776;</button>
    <div class="header__brand">CANARY <span class="header__version">v1.0.1</span></div>
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
  `;const n=e.querySelector("#theme-toggle");n&&(ru(n),n.addEventListener("click",()=>av(n)));const r=e.querySelector("#reset-btn");r&&r.addEventListener("click",()=>{confirm("Clear all data and reset the demo?")&&(localStorage.clear(),window.location.reload())}),Mi();const o=e.querySelector("#identity-btn");o?.addEventListener("click",()=>uv(o)),Ft()&&Gn(!0,qt()),document.addEventListener("canary:vault-synced",()=>{const i=document.getElementById("vault-sync-status");i&&(i.hidden=!1,i.textContent="☁",setTimeout(()=>{i.hidden=!0},3e3))}),e.querySelector("#header-nav")?.addEventListener("click",i=>{const a=i.target.closest("[data-view]");if(!a)return;const c=a.dataset.view;if(c){if(c==="groups"&&window.innerWidth<=768){const l=document.getElementById("sidebar"),d=document.getElementById("sidebar-overlay");if(l&&d){const u=l.classList.contains("sidebar--open");l.classList.toggle("sidebar--open",!u),d.classList.toggle("sidebar-overlay--visible",!u)}}c!==x().view&&te({view:c})}})}function Gn(e,t){const n=document.getElementById("relay-status");if(!n)return;const r=n.querySelector(".relay-dot"),o=n.querySelector(".relay-label");!e||t===0?(n.removeAttribute("hidden"),r?.setAttribute("class","relay-dot relay-dot--offline"),o&&(o.textContent="Offline"),n.title="Not connected to any relay"):(n.removeAttribute("hidden"),r?.setAttribute("class","relay-dot relay-dot--synced"),o&&(o.textContent=`Synced · ${t} relay${t===1?"":"s"}`),n.title=`Connected to ${t} relay${t===1?"":"s"}`)}function cv(){const e=document.getElementById("relay-status");if(!e)return;const t=e.querySelector(".relay-dot"),n=e.querySelector(".relay-label");e.removeAttribute("hidden"),t?.setAttribute("class","relay-dot relay-dot--syncing"),n&&(n.textContent="Syncing...")}function Mi(){const e=document.getElementById("identity-dot"),t=document.getElementById("identity-label"),n=document.getElementById("identity-avatar");if(!e||!t)return;const{identity:r}=x();if(!r?.pubkey){t.textContent="No identity",e.className="header__identity-dot header__identity-dot--none",n&&(n.hidden=!0);return}const o=`${r.pubkey.slice(0,6)}…${r.pubkey.slice(-4)}`,s=r.displayName&&r.displayName!=="You"?r.displayName:o;t.textContent=s,n&&r.picture?(n.src=r.picture,n.hidden=!1,e.hidden=!0):(n&&(n.hidden=!0),e.hidden=!1,e.className=r.signerType==="nip07"?"header__identity-dot header__identity-dot--extension":"header__identity-dot header__identity-dot--local")}function lv(e){return Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}function ou(e,t){return t?.pubkey===e.pubkey&&t.mnemonic?{...e,mnemonic:t.mnemonic}:e}function dv(e,t){try{const n=x().identity,r=tu(e.trim());if(r.type!=="nsec")return alert('Not a valid nsec. Expected a bech32-encoded private key starting with "nsec1".'),!1;const o=r.data,s=lv(o),i=Co(o),a=ou({pubkey:i,privkey:s,signerType:"local",displayName:t??"You"},n);return dn(),te({identity:a,groups:{},activeGroupId:null}),Mi(),document.dispatchEvent(new CustomEvent("canary:resync")),!0}catch{return alert("Invalid nsec format."),!1}}function uv(e){document.getElementById("identity-popover")?.remove();const{identity:t}=x(),n=t?.pubkey??"",r=n?`${n.slice(0,8)}…${n.slice(-8)}`:"None",o=t?.signerType==="nip07"?"Extension (NIP-07)":"Local key",s=document.createElement("div");s.id="identity-popover",s.className="identity-popover",s.innerHTML=`
    <div class="identity-popover__row">
      <span class="identity-popover__label">Pubkey</span>
      <span class="identity-popover__value" title="${j(n)}">${j(r)}</span>
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
  `,e.parentElement?.appendChild(s),s.querySelector("#identity-logout-btn")?.addEventListener("click",()=>{dn(),te({identity:null,groups:{},activeGroupId:null}),s.remove(),window.location.reload()}),s.querySelector("#recovery-reveal-btn")?.addEventListener("click",()=>{const a=s.querySelector("#recovery-reveal-area");if(!a)return;const c=x().identity?.mnemonic;if(!c){a.textContent="";const f=document.createElement("p");f.style.cssText="font-size:0.75rem;color:var(--text-muted);",f.textContent="No recovery phrase stored (key was imported via nsec).",a.appendChild(f);return}const l=c.split(" ");a.textContent="";const d=document.createElement("div");d.style.cssText="display:grid;grid-template-columns:repeat(3,1fr);gap:0.375rem;margin:0.375rem 0;",l.forEach((f,h)=>{const p=document.createElement("div");p.style.cssText="border:1px solid var(--border);border-radius:3px;padding:0.25rem;text-align:center;font-family:var(--font-mono,monospace);font-size:0.7rem;";const m=document.createElement("span");m.style.color="var(--text-muted)",m.textContent=`${h+1}. `;const y=document.createElement("span");y.textContent=f,p.append(m,y),d.appendChild(p)}),a.appendChild(d);const u=document.createElement("button");u.className="btn btn--sm",u.type="button",u.style.cssText="width:100%;margin-top:0.375rem;",u.textContent="Copy words",u.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(c),u.textContent="Copied!",setTimeout(()=>{u.textContent="Copy words"},2e3),setTimeout(()=>{navigator.clipboard.writeText("").catch(()=>{})},3e4)}catch{}}),a.appendChild(u)}),s.querySelector("#nsec-reveal-btn")?.addEventListener("click",()=>{const a=s.querySelector("#nsec-reveal-area");if(!a||!t?.privkey)return;const c=rv(F(t.privkey));a.innerHTML=`
      <code style="font-size: 0.65rem; word-break: break-all; display: block; background: var(--bg); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border); user-select: all;">${j(c)}</code>
      <button class="btn btn--sm" id="nsec-copy-btn" type="button" style="width: 100%; margin-top: 0.375rem;">Copy nsec</button>
    `,a.querySelector("#nsec-copy-btn")?.addEventListener("click",async l=>{const d=l.currentTarget;try{await navigator.clipboard.writeText(c),d.textContent="Copied!",setTimeout(()=>{d.textContent="Copy nsec"},2e3),setTimeout(()=>{navigator.clipboard.writeText("").catch(()=>{})},3e4)}catch{}})}),s.querySelector("#nsec-login-form")?.addEventListener("submit",a=>{a.preventDefault();const c=s.querySelector("#nsec-input");c?.value.trim()&&dv(c.value)&&s.remove()}),s.querySelector("#nip07-connect-btn")?.addEventListener("click",async()=>{if(!qd()){alert("No Nostr extension found. Install Alby, nos2x, or another NIP-07 extension and reload.");return}try{dn();const a=await window.nostr.getPublicKey(),c=ou({pubkey:a,signerType:"nip07",displayName:t?.displayName??"You"},t);te({identity:c,groups:{},activeGroupId:null}),Mi(),document.dispatchEvent(new CustomEvent("canary:resync")),s.remove()}catch{alert("Extension rejected the request.")}});const i=a=>{!s.contains(a.target)&&a.target!==e&&(s.remove(),document.removeEventListener("click",i))};requestAnimationFrame(()=>document.addEventListener("click",i))}function Fa(e){const t=Math.floor(e/86400);if(t>=1)return`${t}d`;const n=Math.floor(e/3600);return n>=1?`${n}h`:`${Math.floor(e/60)}m`}function fv(e){if(!e)return"";const t=e.displayName??`${e.pubkey.slice(0,8)}…`;return`
    <div class="identity-badge">
      <span class="identity-badge__name">${j(t)}</span>
    </div>
  `}function hv(e,t){const n=Object.values(e);return n.length===0?'<div class="group-list__empty">No groups yet</div>':n.map(r=>{const o=r.id===t,s=o?" group-list__item--active":"",i=Fa(r.livenessInterval),a=Fa(r.livenessInterval);return`
        <button
          class="group-list__item${s}"
          data-group-id="${j(r.id)}"
          aria-current="${o?"true":"false"}"
        >
          <span class="group-list__name">${j(r.name)}</span>
          <span class="group-list__preset">${j(i)} · ${j(a)}</span>
        </button>
      `}).join("")}function pv(e){const{identity:t,groups:n,activeGroupId:r}=x();e.innerHTML=`
    <div class="sidebar__tagline">spoken-word verification</div>
    ${fv(t)}
    <nav class="group-list" aria-label="Groups">
      ${hv(n,r)}
    </nav>
    <button class="btn btn--primary" id="create-group-btn">+ New Group</button>
  `,e.querySelector(".group-list")?.addEventListener("click",i=>{const a=i.target.closest("[data-group-id]");if(!a)return;const c=a.dataset.groupId;c&&te({activeGroupId:c})}),e.querySelector("#create-group-btn")?.addEventListener("click",()=>{e.dispatchEvent(new CustomEvent("canary:create-group",{bubbles:!0}))})}const Ls="app-modal";function Oi(e,t){let n=document.getElementById(Ls);if(n||(n=document.createElement("dialog"),n.id=Ls,n.className="modal",document.body.appendChild(n)),n.innerHTML=`
    <form class="modal__form" method="dialog" id="modal-form">
      ${e}
    </form>
  `,t){const r=n.querySelector("#modal-form");r?.addEventListener("submit",o=>{o.preventDefault();const s=new FormData(r);t(s),Ga()})}n.addEventListener("click",r=>{r.target===n&&Ga()}),n.showModal()}function Ga(){document.getElementById(Ls)?.close()}const su=/^[0-9a-f]{64}$/,mv=/^[0-9b-hjkmnp-z]+$/,yv=new TextEncoder().encode("canary:beacon:key"),gv=new TextEncoder().encode("canary:duress:key");function iu(e){if(!su.test(e))throw new Error("seedHex must be a 64-character lowercase hex string (32 bytes)")}function bv(e){if(e.length!==32)throw new Error("AES-256-GCM requires a 32-byte key")}function au(e){return iu(e),Ne(F(e),yv)}function vv(e){return iu(e),Ne(F(e),gv)}async function cu(e,t){bv(e);const n=crypto.getRandomValues(new Uint8Array(12)),r=await crypto.subtle.importKey("raw",e,{name:"AES-GCM"},!1,["encrypt"]),o=new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM",iv:n},r,t)),s=new Uint8Array(12+o.length);return s.set(n),s.set(o,12),Ed(s)}async function lu(e,t,n){if(typeof t!="string"||t.length===0||t.length>11)throw new Error("geohash must be a non-empty string of at most 11 characters");if(!mv.test(t))throw new Error("geohash contains invalid characters (valid: 0-9, b-h, j-k, m-n, p-z)");if(!Number.isInteger(n)||n<1||n>11)throw new Error("precision must be an integer between 1 and 11");const r={geohash:t,precision:n,timestamp:Math.floor(Date.now()/1e3)};return cu(e,new TextEncoder().encode(JSON.stringify(r)))}function wv(e,t){if(!su.test(e))throw new Error(`Invalid member pubkey: expected 64 lowercase hex characters, got ${e.length} chars`);return{type:"duress",member:e,geohash:"",precision:0,locationSource:"none",timestamp:Math.floor(Date.now()/1e3)}}async function Ev(e,t){return cu(e,new TextEncoder().encode(JSON.stringify(t)))}function du(){const{identity:e}=x();if(!e?.pubkey)throw new Error("No local identity — cannot perform privileged action.");return e.pubkey}function $o(e){const t=du();if(!e.admins.includes(t))throw new Error(`Not authorised — you are not an admin of "${e.name}".`)}function kv(e){const t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function _v(e,t,n){const r=crypto.randomUUID(),s=cb({name:e,members:n?[n]:[],preset:t,creator:n}),i=x().settings,a=[...i.defaultReadRelays??i.defaultRelays],c=[...i.defaultWriteRelays??i.defaultRelays],l={family:"words","field-ops":"words",enterprise:"words",event:"pin"},d={...s,id:r,nostrEnabled:c.length>0||a.length>0,relays:c,readRelays:a,writeRelays:c,encodingFormat:l[t]??"words",usedInvites:[],latestInviteIssuedAt:0,livenessInterval:s.rotationInterval,livenessCheckins:{},tolerance:1,memberNames:{},duressMode:"immediate"},{groups:u}=x();return te({groups:{...u,[r]:d},activeGroupId:r}),n&&ke(r,{type:"member-join",pubkey:n,timestamp:Math.floor(Date.now()/1e3),epoch:0,opId:crypto.randomUUID()}),r}function xv(e){const{groups:t,activeGroupId:n}=x(),r={...t};delete r[e],te({groups:r,activeGroupId:n===e?null:n})}function Sv(e){const{groups:t}=x(),n=t[e];if(!n){console.warn(`[canary:actions] reseedGroup: unknown group id "${e}"`);return}$o(n);const r=Ti(n),o=(n.epoch??0)+1,s=crypto.randomUUID(),i=[...n.admins??[]];ke(e,{type:"reseed",seed:kv(r.seed),counter:r.counter,timestamp:Math.floor(Date.now()/1e3),epoch:o,opId:s,admins:i,members:[...n.members]}),J(e,{...r,epoch:o,consumedOps:[s],admins:i}),yn(e)}function Iv(e){const{groups:t}=x(),n=t[e];if(!n){console.warn(`[canary:actions] compromiseReseed: unknown group id "${e}"`);return}$o(n);const r=Ti(n),o=(n.epoch??0)+1;J(e,{...r,epoch:o,consumedOps:[],admins:[...n.admins??[]]}),yn(e)}function Ns(e,t,n){const{groups:r}=x(),o=r[e];if(!o){console.warn(`[canary:actions] addGroupMember: unknown group id "${e}"`);return}$o(o);const s=crypto.randomUUID(),i=Ld(o,t);J(e,{...i,consumedOps:[...o.consumedOps??[],s]}),yn(e),ke(e,{type:"member-join",pubkey:t,displayName:n||void 0,timestamp:Math.floor(Date.now()/1e3),epoch:o.epoch??0,opId:s})}function Av(e,t){const{groups:n}=x(),r=n[e];if(!r){console.warn(`[canary:actions] removeGroupMember: unknown group id "${e}"`);return}const o=du();if(t!==o&&$o(r),!r.members.includes(t))return;const s=Nd(r,t),i=Ti(s),a=(r.epoch??0)+1,c={...r.memberNames??{}};delete c[t];const l={...r.livenessCheckins??{}};delete l[t];const d=(r.admins??[]).filter(u=>u!==t);J(e,{...i,memberNames:c,livenessCheckins:l,admins:d,epoch:a,consumedOps:[]}),yn(e)}function Rv(e){const{groups:t}=x(),n=t[e];if(!n){console.warn(`[canary:actions] burnWord: unknown group id "${e}"`);return}const r=lb(n);J(e,r),ke(e,{type:"counter-advance",counter:r.counter,usageOffset:r.usageOffset,timestamp:Math.floor(Date.now()/1e3)})}const os=/^[0-9a-f]{64}$/;function Cv(e){if(!e||typeof e!="object")throw new Error("Import failed — expected a JSON object.");const t=e;if(typeof t.name!="string"||t.name.trim().length===0)throw new Error("Import failed — name is required.");if(typeof t.seed!="string"||!os.test(t.seed))throw new Error("Import failed — seed must be a 64-character lowercase hex string.");if(!Array.isArray(t.members)||t.members.length===0)throw new Error("Import failed — members must be a non-empty array.");for(const n of t.members)if(typeof n!="string"||!os.test(n))throw new Error(`Import failed — invalid member pubkey: "${String(n)}".`);if(Array.isArray(t.admins)){for(const r of t.admins)if(typeof r!="string"||!os.test(r))throw new Error(`Import failed — invalid admin pubkey: "${String(r)}".`);const n=new Set(t.members);for(const r of t.admins)if(!n.has(r))throw new Error(`Import failed — admin "${r}" is not in the members list.`)}if(t.rotationInterval!==void 0&&(typeof t.rotationInterval!="number"||!Number.isInteger(t.rotationInterval)||t.rotationInterval<=0))throw new Error("Import failed — rotationInterval must be a positive integer.");if(t.wordCount!==void 0&&t.wordCount!==1&&t.wordCount!==2&&t.wordCount!==3)throw new Error("Import failed — wordCount must be 1, 2, or 3.");if(t.encodingFormat!==void 0&&t.encodingFormat!=="words"&&t.encodingFormat!=="pin"&&t.encodingFormat!=="hex")throw new Error("Import failed — encodingFormat must be words, pin, or hex.");if(t.epoch!==void 0&&(typeof t.epoch!="number"||!Number.isInteger(t.epoch)||t.epoch<0))throw new Error("Import failed — epoch must be a non-negative integer.");if(t.consumedOps!==void 0&&(!Array.isArray(t.consumedOps)||!t.consumedOps.every(n=>typeof n=="string")))throw new Error("Import failed — consumedOps must be an array of strings.")}function Tv(e){const{groups:t}=x();if(Object.keys(t).length>0){e.hidden=!0;return}e.hidden=!1,e.innerHTML=`
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
  `,document.getElementById("welcome-create").addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("canary:create-group"))}),document.getElementById("welcome-join").addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("canary:join-group"))})}const Nt="canary:group";function Bt(e){switch(e.encodingFormat){case"pin":return{format:"pin",digits:6};case"hex":return{format:"hex",length:8};default:return{format:"words",count:e.wordCount}}}function $s(e,t){return t==="pin"&&e.length===6?`${e.slice(0,3)}-${e.slice(3)}`:t==="hex"&&e.length===8?`${e.slice(0,4)}-${e.slice(4)}`:e}function Lv(e,t){const{identity:n}=x();if(n?.pubkey===e)return"You";const r=t.memberNames?.[e];return r||e.slice(0,8)+"…"}let Cr=null;function ss(){Cr!==null&&(clearInterval(Cr),Cr=null)}function Nv(e=new Date){return e.toISOString().slice(11,19)+" UTC"}function $v(e){return e.replace(/[a-zA-Z0-9]/g,"•")}const Va="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789•·∘◦○●◈◆▪▫";function Mv(e,t,n=600){const r=t.length,o=30,s=Math.ceil(n/o),i=l=>Math.floor(l/r*s*.7)+Math.floor(s*.3);let a=0;const c=setInterval(()=>{a++;let l="";for(let d=0;d<r;d++)a>=i(d)?l+=t[d]:l+=Va[Math.floor(Math.random()*Va.length)];e.textContent=l,a>=s&&(clearInterval(c),e.textContent=t)},o)}function Ka(e){if(e<=0)return"0s";const t=Math.floor(e/86400),n=Math.floor(e%86400/3600),r=Math.floor(e%3600/60),o=Math.floor(e%60);return t>=1?n>0?`${t}d ${n}h`:`${t}d`:n>=1?r>0?`${n}h ${r}m`:`${n}h`:r>=1?o>0?`${r}m ${o}s`:`${r}m`:`${o}s`}function Wa(e){const t=Math.floor(Date.now()/1e3),r=(vt(t,e.rotationInterval)+1)*e.rotationInterval;return Math.max(0,r-t)}const Ov=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],Bv=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function za(e,t){if(t>=86400){const n=new Date(Date.now()+e*1e3),r=Ov[n.getUTCDay()],o=n.getUTCDate(),s=Bv[n.getUTCMonth()],i=String(n.getUTCHours()).padStart(2,"0"),a=String(n.getUTCMinutes()).padStart(2,"0");return`rotates ${r} ${o} ${s} at ${i}:${a} UTC (${Ka(e)})`}return`rotates in ${Ka(e)} · ${Nv()}`}function Pv(e){const{identity:t}=x(),n=e.counter+e.usageOffset;return rt(e.seed,Nt,n,Bt(e),t?.pubkey)}function Uv(e){const{identity:t}=x();if(!t?.pubkey)return null;const n=e.counter+e.usageOffset;return Io(e.seed,Nt,t.pubkey,n,Bt(e),e.tolerance)}function uu(e){ss();const{groups:t,activeGroupId:n}=x();if(!n){e.innerHTML="";return}const r=t[n];if(!r){e.innerHTML="";return}const o=db(r);if(o!==r){J(n,o);return}const s=Pv(r),i=$s(s,r.encodingFormat),a=Uv(r),c=a?$s(a,r.encodingFormat):null,l=$v(i),d=Wa(r),u=Math.min(100,Math.max(0,(r.rotationInterval-d)/r.rotationInterval*100));e.innerHTML=`
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
        <span class="hero__countdown-label" id="hero-countdown-label">${za(d,r.rotationInterval)}</span>
      </div>

      <p class="hero__hint">Press and hold to reveal. Tap the right side for your alternate word.</p>

      <button class="btn btn--ghost" id="burn-btn" type="button" title="Rotate to a new word now. All group members will get a new word too.">I used this word</button>
      <button class="btn btn--outline" id="hero-invite-btn" type="button" title="Share group access with someone new">Invite Someone</button>
      ${r.members.length>=2?'<button class="btn btn--outline" id="hero-call-btn" type="button" title="Start a phone call verification">Verify Call</button>':""}

    </section>
  `;const f=e.querySelector("#hero-word"),h=e.querySelector("#hero-reveal-btn");function p(N){f&&(f.textContent=N&&c?c:i,f.classList.remove("hero__word--masked"),f.classList.add("hero__word--revealed"))}function m(){f&&(f.textContent=l,f.classList.remove("hero__word--revealed"),f.classList.add("hero__word--masked"))}h&&(h.addEventListener("pointerdown",N=>{N.preventDefault();const $=h.getBoundingClientRect(),v=N.clientX-$.left>$.width/2;p(v)}),h.addEventListener("pointerup",m),h.addEventListener("pointerleave",m),h.addEventListener("pointercancel",m)),e.querySelector("#burn-btn")?.addEventListener("click",()=>{try{Rv(n);const N=zn(x().groups[n]??r)==="online";H(N?"Word rotated — syncing to group":"Word rotated","success",2e3),document.dispatchEvent(new CustomEvent("canary:vault-publish-now")),requestAnimationFrame(()=>{const $=document.getElementById("hero-word");if($){const w=$.textContent??"••••••••";Mv($,w)}})}catch(N){H(N instanceof Error?N.message:"Failed to rotate word","error")}}),e.querySelector("#hero-invite-btn")?.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("canary:show-invite",{detail:{groupId:n}}))}),e.querySelector("#hero-call-btn")?.addEventListener("click",()=>{const{identity:N}=x(),$=r.members.filter(g=>g!==N?.pubkey);if($.length===0)return;if($.length===1){document.dispatchEvent(new CustomEvent("canary:verify-call",{detail:{groupId:n,pubkey:$[0]}}));return}const w=$.map(g=>`
      <button class="btn btn--outline member-pick-btn" data-pubkey="${j(g)}" type="button" style="width:100%;text-align:left;margin-bottom:0.5rem;">
        ${j(Lv(g,r))}
      </button>
    `).join("");let v=document.getElementById("member-picker");v||(v=document.createElement("dialog"),v.id="member-picker",v.className="modal",document.body.appendChild(v)),v.innerHTML=`
      <div class="modal__form" style="min-width:240px;">
        <h2 class="modal__title">Who are you calling?</h2>
        ${w}
        <div class="modal__actions">
          <button class="btn" id="picker-cancel" type="button">Cancel</button>
        </div>
      </div>
    `,v.querySelector("#picker-cancel")?.addEventListener("click",()=>v.close()),v.addEventListener("click",g=>{g.target===v&&v.close()}),v.querySelectorAll(".member-pick-btn").forEach(g=>{g.addEventListener("click",()=>{const _=g.dataset.pubkey;v.close(),_&&document.dispatchEvent(new CustomEvent("canary:verify-call",{detail:{groupId:n,pubkey:_}}))})}),v.showModal()});const T=e.querySelector("#hero-progress-bar"),O=e.querySelector("#hero-countdown-label");Cr=setInterval(()=>{const{groups:N}=x(),$=N[n];if(!$){ss();return}const w=Wa($),v=Math.min(100,Math.max(0,($.rotationInterval-w)/$.rotationInterval*100));T&&(T.style.width=`${v}%`),O&&(O.textContent=za(w,$.rotationInterval)),w===0&&(ss(),uu(e))},1e3)}const Bi="canary:duress-dismissed";function Pi(){try{const e=localStorage.getItem(Bi);return e?new Set(JSON.parse(e)):new Set}catch{return new Set}}function Ja(e){const t=Pi();t.add(e),localStorage.setItem(Bi,JSON.stringify([...t]))}function Dv(e){const t=Pi();t.delete(e),localStorage.setItem(Bi,JSON.stringify([...t]))}function no(e,t){const n=x().groups[t];if(!n)return e.slice(0,8);const{identity:r}=x();if(r?.pubkey===e)return"You";const o=n.memberNames?.[e];return o||`${e.slice(0,8)}…${e.slice(-4)}`}function jv(e){const n=Math.floor(Date.now()/1e3)-e;if(n<30)return"just now";if(n<60)return`${n}s ago`;const r=Math.floor(n/60);return r<60?`${r} min ago`:new Date(e*1e3).toLocaleTimeString()}function fu(e,t,n,r,o){if(!o&&Pi().has(e))return;const s=document.querySelector(".duress-overlay");s&&s.remove();const i=no(e,t),a=r?jv(r):new Date().toLocaleTimeString(),c=document.createElement("div");c.className="duress-overlay",c.dataset.subject=e,c.dataset.groupId=t,c.setAttribute("role","alertdialog"),c.setAttribute("aria-label",`${i} needs help`);const l=document.createElement("div");l.className="duress-overlay__content";const d=document.createElement("div");d.className="duress-overlay__icon",d.setAttribute("aria-hidden","true"),d.textContent="!",l.appendChild(d);const u=document.createElement("h1");u.className="duress-overlay__title",u.textContent=i,l.appendChild(u);const f=document.createElement("h2");if(f.className="duress-overlay__subtitle",f.textContent="NEEDS HELP",l.appendChild(f),n&&(n.lat!==0||n.lon!==0)){const b=document.createElement("p");b.className="duress-overlay__location",b.textContent=`Last known: ${n.lat.toFixed(4)}, ${n.lon.toFixed(4)}`,l.appendChild(b)}const h=document.createElement("p");h.className="duress-overlay__time",h.textContent=a,l.appendChild(h);const p=document.createElement("button");p.className="btn btn--lg duress-overlay__dismiss",p.textContent="I'm Responding",p.title="Dismiss this alert on your screen only — does not clear the duress for others",p.addEventListener("click",()=>{Ja(e),c.classList.remove("duress-overlay--visible"),setTimeout(()=>c.remove(),300)}),l.appendChild(p);const m=document.createElement("button");m.className="btn btn--lg duress-overlay__stand-down",m.textContent="Stand Down — Person is Safe",m.title="Broadcast to all group members that this person has been confirmed safe",m.addEventListener("click",()=>{Ja(e),ke(t,{type:"duress-clear",subject:e,timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID()}),c.classList.remove("duress-overlay--visible"),setTimeout(()=>c.remove(),300);const{identity:b}=x(),E=b?.pubkey===e?"Self":no(b?.pubkey??"",t);H(`Duress stood down for ${i} by ${E}`,"success")}),l.appendChild(m),c.appendChild(l),document.body.appendChild(c),requestAnimationFrame(()=>c.classList.add("duress-overlay--visible"));function y(b){b.key==="Escape"&&(c.classList.remove("duress-overlay--visible"),setTimeout(()=>c.remove(),300),document.removeEventListener("keydown",y))}document.addEventListener("keydown",y)}document.addEventListener("canary:duress-clear",(e=>{const{subject:t,clearedBy:n}=e.detail;Dv(t);const r=Array.from(document.querySelectorAll(".duress-overlay")).find(c=>c.dataset.subject===t);r&&(r.classList.remove("duress-overlay--visible"),setTimeout(()=>r.remove(),300));const o=e.detail.groupId,s=no(t,o),i=no(n,o);H(t===n?`${s} self-cleared their duress`:`${i} confirmed ${s} is safe`,"success")}));function hu(e){const t=new Uint32Array(1);return crypto.getRandomValues(t),t[0]%e}function is(e){const{groups:t,activeGroupId:n,identity:r}=x();if(r?.pubkey===e)return"You";if(!n)return e.slice(0,8)+"…";const o=t[n];if(!o)return e.slice(0,8)+"…";const s=o.memberNames?.[e];return s||e.slice(0,8)+"…"}function qv(e,t){const n=[],r=new Set(t);for(;n.length<e;){const o=hu(Is),s=Rr(o).toLowerCase();r.has(s)||(r.add(s),n.push(s))}return n}function Hv(e){for(let t=e.length-1;t>0;t--){const n=hu(t+1);[e[t],e[n]]=[e[n],e[t]]}return e}function Ya(e,t){for(const s of e)fu(s,t,void 0,Math.floor(Date.now()/1e3),!0);document.dispatchEvent(new CustomEvent("canary:duress",{detail:{members:e},bubbles:!0}));const{groups:n}=x(),r=n[t];if(!r)return;const o=vv(r.seed);for(const s of e){const i=wv(s);Ev(o,i),ke(t,{type:"duress-alert",lat:0,lon:0,timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID(),subject:s})}}function Fv(e){const{groups:t,activeGroupId:n}=x();if(!n){e.innerHTML="";return}const r=t[n];if(!r){e.innerHTML="";return}const{identity:o}=x(),s=r.members.filter(E=>E!==o?.pubkey);if(s.length===0){e.innerHTML=`
      <section class="panel verify-panel">
        <h2 class="panel__title">Verify Someone</h2>
        <p class="settings-hint">No other members to verify yet. Invite someone first.</p>
      </section>
    `;return}const i=s.map(E=>`<button class="verify-member-btn btn btn--outline" data-pubkey="${j(E)}" type="button">${j(is(E))}</button>`).join("");e.innerHTML=`
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
  `;const a=e.querySelector("#verify-member-list"),c=e.querySelector("#verify-choices-area"),l=e.querySelector("#verify-choices"),d=e.querySelector("#verify-prompt"),u=e.querySelector("#verify-result"),f=e.querySelector("#verify-back");function h(E){const{groups:T,activeGroupId:O}=x();if(!O)return;const N=T[O];if(!N)return;const $=Math.floor(Date.now()/1e3),w=vt($,N.rotationInterval)+N.usageOffset,v=Bt(N),g=rt(N.seed,Nt,w,v,E).toLowerCase(),_=Io(N.seed,Nt,E,w,v,N.tolerance)?.toLowerCase(),S=new Set([g]);_&&S.add(_);const k=qv(_?2:3,S),A=Hv([g,..._?[_]:[],...k]),I=is(E);d.textContent=`Tap the word ${I} just said:`,u.hidden=!0,l.innerHTML=A.map(L=>`<button class="verify-choice" data-word="${j(L)}" type="button">${j($s(L,N.encodingFormat))}</button>`).join(""),a.hidden=!0,c.hidden=!1,l.querySelectorAll(".verify-choice").forEach(L=>{L.addEventListener("click",()=>p(L.dataset.word??"",L,E))})}function p(E,T,O){const{groups:N,activeGroupId:$}=x();if(!$)return;const w=N[$];if(!w)return;const v=vt(Math.floor(Date.now()/1e3),w.rotationInterval)+w.usageOffset,g=$a(w.seed,Nt,v,E,w.members,{encoding:Bt(w),tolerance:w.tolerance}),_=g.status==="valid",S=is(O);l.querySelectorAll(".verify-choice").forEach(R=>R.classList.remove("verify-choice--correct","verify-choice--wrong")),T.classList.add(_?"verify-choice--correct":"verify-choice--wrong"),u.hidden=!1,u.className=`verify-result verify-result--${_?"valid":"invalid"}`,u.textContent=_?`${S} is verified.`:`${S} gave the wrong word.`,f.hidden=!1,g.status==="duress"&&Ya(g.identities??[],$)}e.querySelectorAll(".verify-member-btn").forEach(E=>{E.addEventListener("click",()=>{const T=E.dataset.pubkey;T&&h(T)})}),f.addEventListener("click",()=>{a.hidden=!1,c.hidden=!0,u.hidden=!0,f.hidden=!0});const m=e.querySelector("#verify-input"),y=e.querySelector("#verify-btn");function b(){const E=m?.value.trim().toLowerCase().replace(/-/g,"")??"";if(!E)return;const{groups:T,activeGroupId:O}=x();if(!O)return;const N=T[O];if(!N)return;const $=vt(Math.floor(Date.now()/1e3),N.rotationInterval)+N.usageOffset,w=$a(N.seed,Nt,$,E,N.members,{encoding:Bt(N),tolerance:N.tolerance}),v=w.status==="valid";u.hidden=!1,u.className=`verify-result verify-result--${v?"valid":"invalid"}`,u.textContent=v?"Verified.":"Wrong word.",f.hidden=!1,w.status==="duress"&&Ya(w.identities??[],O)}y?.addEventListener("click",b),m?.addEventListener("keydown",E=>{E.key==="Enter"&&b()})}function pu(e){const t=JSON.stringify(e),n=new TextEncoder().encode(t);let r="";for(let o=0;o<n.length;o++)r+=String.fromCharCode(n[o]);return btoa(r)}function Mo(e){const t=atob(e),n=new Uint8Array(t.length);for(let r=0;r<t.length;r++)n[r]=t.charCodeAt(r);return JSON.parse(new TextDecoder().decode(n))}function Gv(e){return pu(e).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function mu(e){let t=e.replace(/-/g,"+").replace(/_/g,"/");const n=t.length%4;return n===2?t+="==":n===3&&(t+="="),Mo(t)}function Vv(e){let t="";for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function Kv(e){let t=e.replace(/-/g,"+").replace(/_/g,"/");const n=t.length%4;n===2?t+="==":n===3&&(t+="=");const r=atob(t),o=new Uint8Array(r.length);for(let s=0;s<r.length;s++)o[s]=r.charCodeAt(s);return o}const yu=/^[0-9a-f]{64}$/,Wv=/^[0-9a-f]{128}$/,gu=/^[0-9a-f]{32}$/;function bu(e){const{adminSig:t,...n}=e,r=Object.keys(n).sort().reduce((o,s)=>(o[s]=n[s],o),{});return new TextEncoder().encode(JSON.stringify(r))}function zv(e){const{groupName:t,groupId:n,adminPubkey:r,adminPrivkey:o,relays:s,expiresInSec:i=86400}=e,a=new Uint8Array(16);crypto.getRandomValues(a);const c=ze(a),l={groupName:t,groupId:n,adminPubkey:r,inviteId:c,expiresAt:Math.floor(Date.now()/1e3)+i,relays:[...s],adminSig:""},d=we(bu(l));return l.adminSig=ze(ee.sign(d,F(o))),l}function vu(e){if(e==null||typeof e!="object")throw new Error("Remote invite token must be a non-null object");const t=e;if(typeof t.groupName!="string"||t.groupName.length===0)throw new Error("groupName must be a non-empty string");if(typeof t.groupId!="string"||t.groupId.length===0)throw new Error("groupId must be a non-empty string");if(typeof t.adminPubkey!="string"||!yu.test(t.adminPubkey))throw new Error("adminPubkey must be a 64-character hex string");if(typeof t.inviteId!="string"||!gu.test(t.inviteId))throw new Error("inviteId must be a 32-character hex string");if(typeof t.adminSig!="string"||!Wv.test(t.adminSig))throw new Error("adminSig must be a 128-character hex string");if(!Array.isArray(t.relays)||!t.relays.every(i=>typeof i=="string"))throw new Error("relays must be an array of strings");if(typeof t.expiresAt!="number"||!Number.isFinite(t.expiresAt))throw new Error("expiresAt must be a finite number");const n=Math.floor(Date.now()/1e3);if(t.expiresAt<=n)throw new Error("Remote invite token has expired");const r=e,o=we(bu(r));if(!ee.verify(F(r.adminSig),o,F(r.adminPubkey)))throw new Error("Remote invite token signature is invalid")}function Jv(e){const{welcome:t,adminPrivkey:n,joinerPubkey:r}=e,o=JSON.stringify(t),s=Ee(F(n),r);return Dt(o,s)}function Yv(e){const{envelope:t,joinerPrivkey:n,adminPubkey:r,expectedInviteId:o}=e,s=Ee(F(n),r),i=jt(t,s),a=JSON.parse(i);if(typeof a.inviteId!="string"||!gu.test(a.inviteId))throw new Error("Welcome payload must include a valid inviteId");if(a.inviteId!==o)throw new Error("Welcome payload inviteId does not match the pending invite");if(typeof a.seed!="string"||!yu.test(a.seed))throw new Error("Welcome payload seed must be a 64-character hex string");if(typeof a.groupId!="string"||a.groupId.length===0)throw new Error("Welcome payload must include a non-empty groupId");return a}function Zv(e){if(e.startsWith("wss://"))return!0;if(e.startsWith("ws://"))try{const t=new URL(e);return t.hostname==="localhost"||t.hostname==="127.0.0.1"||t.hostname==="[::1]"}catch{return!1}return!1}const Ln=/^[0-9a-f]{64}$/,wu=/^[0-9a-f]{128}$/,Xv=/^[0-9a-f]{32}$/,Qv=10080*60,Eu=300;function zt(e){return typeof e=="number"&&Number.isInteger(e)&&e>=0}function e0(){const e=new Uint8Array(16);return crypto.getRandomValues(e),Array.from(e).map(t=>t.toString(16).padStart(2,"0")).join("")}function t0(e){const t=e;if(!t||typeof t!="object")throw new Error("Invalid invite payload — expected an object.");if(typeof t.groupId!="string"||t.groupId.length===0)throw new Error("Invalid invite payload — groupId is required.");if(typeof t.seed!="string"||!Ln.test(t.seed))throw new Error("Invalid invite payload — seed must be 64-char hex.");if(typeof t.groupName!="string"||t.groupName.trim().length===0)throw new Error("Invalid invite payload — groupName is required.");if(!Number.isInteger(t.rotationInterval)||t.rotationInterval<=0)throw new Error("Invalid invite payload — rotationInterval must be > 0.");if(t.wordCount!==1&&t.wordCount!==2&&t.wordCount!==3)throw new Error("Invalid invite payload — wordCount must be 1, 2, or 3.");if(typeof t.wordlist!="string"||t.wordlist.length===0)throw new Error("Invalid invite payload — wordlist is required.");if(!zt(t.counter)||!zt(t.usageOffset))throw new Error("Invalid invite payload — counter and usageOffset must be non-negative integers.");if(typeof t.nonce!="string"||!Xv.test(t.nonce))throw new Error("Invalid invite payload — nonce must be 32-char hex.");if(!Number.isInteger(t.beaconInterval)||t.beaconInterval<=0)throw new Error("Invalid invite payload — beaconInterval must be > 0.");if(!Number.isInteger(t.beaconPrecision)||t.beaconPrecision<1||t.beaconPrecision>11)throw new Error("Invalid invite payload — beaconPrecision must be 1..11.");if(!Array.isArray(t.members)||!t.members.every(r=>typeof r=="string"&&Ln.test(r)))throw new Error("Invalid invite payload — members must be 64-char hex pubkeys.");if(!Array.isArray(t.relays)||!t.relays.every(r=>typeof r=="string"&&Zv(r)))throw new Error("Invalid invite payload — relays must be wss:// URLs (or ws:// for localhost).");if(t.encodingFormat!=="words"&&t.encodingFormat!=="pin"&&t.encodingFormat!=="hex")throw new Error("Invalid invite payload — encodingFormat must be words|pin|hex.");if(!zt(t.tolerance))throw new Error("Invalid invite payload — tolerance must be a non-negative integer.");if(t.tolerance>10)throw new Error("Invalid invite payload — tolerance must be <= 10.");if(!zt(t.issuedAt)||!zt(t.expiresAt))throw new Error("Invalid invite payload — issuedAt/expiresAt must be unix seconds.");if(t.expiresAt<=t.issuedAt)throw new Error("Invalid invite payload — expiresAt must be after issuedAt.");if(!zt(t.epoch))throw new Error("Invalid invite payload — epoch must be a non-negative integer.");if(!Array.isArray(t.admins)||!t.admins.every(r=>typeof r=="string"&&Ln.test(r)))throw new Error("Invalid invite payload — admins must be 64-char hex pubkeys.");const n=new Set(t.members);if(!t.admins.every(r=>n.has(r)))throw new Error("Invalid invite payload — all admins must be in members.");if(t.protocolVersion===void 0||t.protocolVersion===null)throw new Error("Invalid invite payload — protocolVersion is required.");if(t.protocolVersion!==se)throw new Error(`Unsupported invite protocol version: ${t.protocolVersion} (expected: ${se})`);if(typeof t.inviterPubkey!="string"||!Ln.test(t.inviterPubkey))throw new Error("Invalid invite payload — inviterPubkey must be a 64-char hex pubkey.");if(!t.admins.includes(t.inviterPubkey))throw new Error("Invalid invite payload — inviterPubkey must be in admins.");if(typeof t.inviterSig!="string"||!wu.test(t.inviterSig))throw new Error("Invalid invite payload — inviterSig must be a 128-char hex Schnorr signature.")}function ku(e){const{inviterSig:t,memberNames:n,relays:r,...o}=e,s=Object.keys(o).sort().reduce((i,a)=>(i[a]=o[a],i),{});return new TextEncoder().encode(JSON.stringify(s))}function n0(e,t){const n=ku(e),r=we(n);return ze(ee.sign(r,F(t)))}function r0(e){const t=ku(e),n=we(t);return ee.verify(F(e.inviterSig),n,F(e.inviterPubkey))}function _u(e){const{nonce:t,relays:n,memberNames:r,...o}=e,s=JSON.stringify(o),i=new TextEncoder,a=Ne(F(t),i.encode(s)),c=a[0]<<25|a[1]<<17|a[2]<<9|a[3]<<1|a[4]>>7,l=c>>>22&2047,d=c>>>11&2047,u=c&2047;return`${Rr(l)} ${Rr(d)} ${Rr(u)}`}function o0(e){const{identity:t}=x();if(!t?.pubkey)throw new Error("No identity — sign in first.");if(!t.privkey)throw new Error("Invite creation requires a local key (nsec). NIP-07 extensions cannot sign invites.");if(!e.admins.includes(t.pubkey))throw new Error(`Not authorised — you are not an admin of "${e.name}".`);const n=e0(),r=Math.floor(Date.now()/1e3),o={groupId:e.id,seed:e.seed,groupName:e.name,rotationInterval:e.rotationInterval,wordCount:e.wordCount,wordlist:e.wordlist,counter:e.counter,usageOffset:e.usageOffset,nonce:n,beaconInterval:e.beaconInterval,beaconPrecision:e.beaconPrecision,members:[...e.members],relays:[...e.writeRelays??e.relays??[]],encodingFormat:e.encodingFormat??"words",tolerance:e.tolerance??1,issuedAt:r,expiresAt:r+Qv,epoch:e.epoch??0,admins:[...e.admins??[]],protocolVersion:se,inviterPubkey:t.pubkey,inviterSig:"",memberNames:{...e.memberNames}};o.inviterSig=n0(o,t.privkey);const s=_u(o);return{payload:o,confirmCode:s}}function s0(e,t){let n;try{n=Mo(e)}catch{throw new Error("Invalid invite payload — could not decode.")}t0(n);const r={groupId:n.groupId,seed:n.seed,groupName:n.groupName,rotationInterval:n.rotationInterval,wordCount:n.wordCount,wordlist:n.wordlist,counter:n.counter,usageOffset:n.usageOffset,nonce:n.nonce,beaconInterval:n.beaconInterval,beaconPrecision:n.beaconPrecision,members:[...n.members],relays:[...n.relays],encodingFormat:n.encodingFormat,tolerance:n.tolerance,issuedAt:n.issuedAt,expiresAt:n.expiresAt,epoch:n.epoch,admins:[...n.admins],protocolVersion:n.protocolVersion,inviterPubkey:n.inviterPubkey,inviterSig:n.inviterSig,memberNames:n.memberNames&&typeof n.memberNames=="object"?{...n.memberNames}:void 0};if(!r0(r))throw new Error("Invite signature is invalid — the inviter could not prove control of the admin key.");if(!t?.trim())throw new Error("Confirmation code is required — ask the sender to read it to you.");const o=_u(r),s=t.trim().replace(/[-\s]+/g," ").toLowerCase(),i=o.toLowerCase();if(s!==i)throw new Error("Confirmation words do not match — invite may have been tampered with.");const a=Math.floor(Date.now()/1e3);if(r.expiresAt<=a)throw new Error("Invite has expired. Ask for a new invite.");if(r.issuedAt>a+Eu)throw new Error("Invite timestamp is too far in the future — check your device clock.");return r}function i0(e,t){const{groups:n}=x(),r=n[e];return r?Array.isArray(r.usedInvites)&&r.usedInvites.includes(t):!1}function a0(e,t){const{groups:n}=x(),r=n[e];if(!r){console.warn(`[canary:invite] consumeInvite: unknown group id "${e}"`);return}J(e,{usedInvites:Array.from(new Set([...r.usedInvites,t]))})}const c0=10080*60;function l0(e){const t=Object.keys(e).sort().reduce((n,r)=>(n[r]=e[r],n),{});return new TextEncoder().encode(JSON.stringify(t))}function d0(e,t){let n;try{n=Mo(e)}catch{return{valid:!1,error:"Invalid join token — could not decode."}}if(n.g!==t.groupId)return{valid:!1,error:"Join token is for a different group."};if(typeof n.p!="string"||!Ln.test(n.p))return{valid:!1,error:"Join token has invalid pubkey."};if(typeof n.s!="string"||!wu.test(n.s))return{valid:!1,error:"Join token has invalid signature."};const r=Math.floor(Date.now()/1e3);if(typeof n.t!="number"||n.t<r-c0)return{valid:!1,error:"Join token has expired or is stale."};if(n.t>r+Eu)return{valid:!1,error:"Join token timestamp is too far in the future."};const{s:o,...s}=n,i=we(l0(s));try{if(!ee.verify(F(n.s),i,F(n.p)))return{valid:!1,error:"Join token signature is invalid."}}catch{return{valid:!1,error:"Join token signature verification failed."}}const a=(n.w||"").toLowerCase(),c=t.tolerance??1;let l=!1;for(let d=t.counter-c;d<=t.counter+c;d++)if(!(d<0)&&a===rt(t.groupSeed,t.context,d,t.encoding).toLowerCase()){l=!0;break}return l?{valid:!0,pubkey:n.p,displayName:n.n||"",word:n.w||""}:{valid:!1,error:"Join token word does not match — seed possession not proven."}}let Vn=null;function u0(e){const{identity:t}=x();if(!t?.pubkey)throw new Error("No identity — sign in first.");if(!t.privkey)throw new Error("Invite creation requires a local key (nsec). NIP-07 extensions cannot sign invites.");if(!e.admins.includes(t.pubkey))throw new Error(`Not authorised — you are not an admin of "${e.name}".`);const n=e.writeRelays?.length?[...e.writeRelays]:[...x().settings.defaultWriteRelays??x().settings.defaultRelays],r=zv({groupName:e.name,groupId:e.id,adminPubkey:t.pubkey,adminPrivkey:t.privkey,relays:n}),o=Gv(r);return Vn={groupId:e.id,tokenPayload:o,inviteId:r.inviteId},Vn}function Za(e,t){const{identity:n}=x();if(!n?.privkey)throw new Error("No local identity — cannot create welcome envelope.");if(!Vn)throw new Error("No active remote invite session — cannot create welcome envelope.");const r={inviteId:Vn.inviteId,seed:e.seed,counter:e.counter,usageOffset:e.usageOffset,epoch:e.epoch??0,wordCount:e.wordCount,rotationInterval:e.rotationInterval,groupId:e.id,groupName:e.name,wordlist:e.wordlist,beaconInterval:e.beaconInterval,beaconPrecision:e.beaconPrecision,encodingFormat:e.encodingFormat??"words",tolerance:e.tolerance??1,members:[...e.members],admins:[...e.admins??[]],relays:[...e.writeRelays??e.relays??[]],memberNames:e.memberNames?{...e.memberNames}:void 0};return Jv({welcome:r,adminPrivkey:n.privkey,joinerPubkey:t})}function Sn(){Vn=null}function In(e){const t=new Uint8Array(e.length/2);for(let n=0;n<t.length;n++)t[n]=parseInt(e.substring(n*2,n*2+2),16);return t}function An(e){let t="";for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,"0");return t}const f0={words:0,pin:1,hex:2},h0={0:"words",1:"pin",2:"hex"},p0={"en-v1":0},m0={0:"en-v1"},xu=1,Xa=new TextEncoder,Qa=new TextDecoder;function y0(e){const t=Xa.encode(e.groupId),n=Xa.encode(e.groupName),r=e.admins.map(d=>{const u=e.members.indexOf(d);if(u===-1)throw new Error(`Admin ${d} not found in members array`);return u}),s=177+1+e.members.length*32+1+r.length+1+t.length+1+n.length,i=new ArrayBuffer(s),a=new DataView(i),c=new Uint8Array(i);let l=0;a.setUint8(l,xu),l+=1,c.set(In(e.seed),l),l+=32,c.set(In(e.inviterPubkey),l),l+=32,c.set(In(e.inviterSig),l),l+=64,c.set(In(e.nonce),l),l+=16,a.setUint32(l,e.counter),l+=4,a.setUint16(l,e.usageOffset),l+=2,a.setUint32(l,e.epoch),l+=4,a.setUint32(l,e.rotationInterval),l+=4,a.setUint32(l,e.beaconInterval),l+=4,a.setUint8(l,e.beaconPrecision),l+=1,a.setUint8(l,e.wordCount),l+=1,a.setUint8(l,e.tolerance),l+=1,a.setUint8(l,f0[e.encodingFormat]??0),l+=1,a.setUint8(l,p0[e.wordlist]??0),l+=1,a.setUint32(l,e.issuedAt),l+=4,a.setUint32(l,e.expiresAt),l+=4,a.setUint8(l,e.protocolVersion),l+=1,a.setUint8(l,e.members.length),l+=1;for(const d of e.members)c.set(In(d),l),l+=32;a.setUint8(l,r.length),l+=1;for(const d of r)a.setUint8(l,d),l+=1;return a.setUint8(l,t.length),l+=1,c.set(t,l),l+=t.length,a.setUint8(l,n.length),l+=1,c.set(n,l),l+=n.length,c}function g0(e){const t=new DataView(e.buffer,e.byteOffset,e.byteLength);let n=0;const r=t.getUint8(n);if(n+=1,r!==xu)throw new Error(`Unsupported binary invite version: ${r}`);const o=An(e.slice(n,n+32));n+=32;const s=An(e.slice(n,n+32));n+=32;const i=An(e.slice(n,n+64));n+=64;const a=An(e.slice(n,n+16));n+=16;const c=t.getUint32(n);n+=4;const l=t.getUint16(n);n+=2;const d=t.getUint32(n);n+=4;const u=t.getUint32(n);n+=4;const f=t.getUint32(n);n+=4;const h=t.getUint8(n);n+=1;const p=t.getUint8(n);n+=1;const m=t.getUint8(n);n+=1;const y=h0[t.getUint8(n)]??"words";n+=1;const b=m0[t.getUint8(n)]??"en-v1";n+=1;const E=t.getUint32(n);n+=4;const T=t.getUint32(n);n+=4;const O=t.getUint8(n);n+=1;const N=t.getUint8(n);n+=1;const $=[];for(let k=0;k<N;k++)$.push(An(e.slice(n,n+32))),n+=32;const w=t.getUint8(n);n+=1;const v=[];for(let k=0;k<w;k++){const A=t.getUint8(n);if(n+=1,A>=$.length)throw new Error(`Invalid admin index ${A} in binary invite (${$.length} members)`);v.push($[A])}const g=t.getUint8(n);n+=1;const _=Qa.decode(e.slice(n,n+g));n+=g;const S=t.getUint8(n);n+=1;const R=Qa.decode(e.slice(n,n+S));return n+=S,{groupId:_,seed:o,groupName:R,rotationInterval:u,wordCount:p,wordlist:b,counter:c,usageOffset:l,nonce:a,beaconInterval:f,beaconPrecision:h,members:$,relays:[],encodingFormat:y,tolerance:m,issuedAt:E,expiresAt:T,epoch:d,admins:v,protocolVersion:O,inviterPubkey:s,inviterSig:i}}const gn=function(e,t){let o=e;const s=Nn[t];let i=null,a=0,c=null;const l=[],d={},u=function(w,v){a=o*4+17,i=(function(g){const _=new Array(g);for(let S=0;S<g;S+=1){_[S]=new Array(g);for(let R=0;R<g;R+=1)_[S][R]=null}return _})(a),f(0,0),f(a-7,0),f(0,a-7),m(),p(),b(w,v),o>=7&&y(w),c==null&&(c=O(o,s,l)),E(c,v)},f=function(w,v){for(let g=-1;g<=7;g+=1)if(!(w+g<=-1||a<=w+g))for(let _=-1;_<=7;_+=1)v+_<=-1||a<=v+_||(0<=g&&g<=6&&(_==0||_==6)||0<=_&&_<=6&&(g==0||g==6)||2<=g&&g<=4&&2<=_&&_<=4?i[w+g][v+_]=!0:i[w+g][v+_]=!1)},h=function(){let w=0,v=0;for(let g=0;g<8;g+=1){u(!0,g);const _=pt.getLostPoint(d);(g==0||w>_)&&(w=_,v=g)}return v},p=function(){for(let w=8;w<a-8;w+=1)i[w][6]==null&&(i[w][6]=w%2==0);for(let w=8;w<a-8;w+=1)i[6][w]==null&&(i[6][w]=w%2==0)},m=function(){const w=pt.getPatternPosition(o);for(let v=0;v<w.length;v+=1)for(let g=0;g<w.length;g+=1){const _=w[v],S=w[g];if(i[_][S]==null)for(let R=-2;R<=2;R+=1)for(let k=-2;k<=2;k+=1)R==-2||R==2||k==-2||k==2||R==0&&k==0?i[_+R][S+k]=!0:i[_+R][S+k]=!1}},y=function(w){const v=pt.getBCHTypeNumber(o);for(let g=0;g<18;g+=1){const _=!w&&(v>>g&1)==1;i[Math.floor(g/3)][g%3+a-8-3]=_}for(let g=0;g<18;g+=1){const _=!w&&(v>>g&1)==1;i[g%3+a-8-3][Math.floor(g/3)]=_}},b=function(w,v){const g=s<<3|v,_=pt.getBCHTypeInfo(g);for(let S=0;S<15;S+=1){const R=!w&&(_>>S&1)==1;S<6?i[S][8]=R:S<8?i[S+1][8]=R:i[a-15+S][8]=R}for(let S=0;S<15;S+=1){const R=!w&&(_>>S&1)==1;S<8?i[8][a-S-1]=R:S<9?i[8][15-S-1+1]=R:i[8][15-S-1]=R}i[a-8][8]=!w},E=function(w,v){let g=-1,_=a-1,S=7,R=0;const k=pt.getMaskFunction(v);for(let A=a-1;A>0;A-=2)for(A==6&&(A-=1);;){for(let I=0;I<2;I+=1)if(i[_][A-I]==null){let L=!1;R<w.length&&(L=(w[R]>>>S&1)==1),k(_,A-I)&&(L=!L),i[_][A-I]=L,S-=1,S==-1&&(R+=1,S=7)}if(_+=g,_<0||a<=_){_-=g,g=-g;break}}},T=function(w,v){let g=0,_=0,S=0;const R=new Array(v.length),k=new Array(v.length);for(let C=0;C<v.length;C+=1){const M=v[C].dataCount,B=v[C].totalCount-M;_=Math.max(_,M),S=Math.max(S,B),R[C]=new Array(M);for(let V=0;V<R[C].length;V+=1)R[C][V]=255&w.getBuffer()[V+g];g+=M;const P=pt.getErrorCorrectPolynomial(B),D=Kn(R[C],P.getLength()-1).mod(P);k[C]=new Array(P.getLength()-1);for(let V=0;V<k[C].length;V+=1){const Y=V+D.getLength()-k[C].length;k[C][V]=Y>=0?D.getAt(Y):0}}let A=0;for(let C=0;C<v.length;C+=1)A+=v[C].totalCount;const I=new Array(A);let L=0;for(let C=0;C<_;C+=1)for(let M=0;M<v.length;M+=1)C<R[M].length&&(I[L]=R[M][C],L+=1);for(let C=0;C<S;C+=1)for(let M=0;M<v.length;M+=1)C<k[M].length&&(I[L]=k[M][C],L+=1);return I},O=function(w,v,g){const _=ec.getRSBlocks(w,v),S=tc();for(let k=0;k<g.length;k+=1){const A=g[k];S.put(A.getMode(),4),S.put(A.getLength(),pt.getLengthInBits(A.getMode(),w)),A.write(S)}let R=0;for(let k=0;k<_.length;k+=1)R+=_[k].dataCount;if(S.getLengthInBits()>R*8)throw"code length overflow. ("+S.getLengthInBits()+">"+R*8+")";for(S.getLengthInBits()+4<=R*8&&S.put(0,4);S.getLengthInBits()%8!=0;)S.putBit(!1);for(;!(S.getLengthInBits()>=R*8||(S.put(236,8),S.getLengthInBits()>=R*8));)S.put(17,8);return T(S,_)};d.addData=function(w,v){v=v||"Byte";let g=null;switch(v){case"Numeric":g=b0(w);break;case"Alphanumeric":g=v0(w);break;case"Byte":g=w0(w);break;case"Kanji":g=E0(w);break;default:throw"mode:"+v}l.push(g),c=null},d.isDark=function(w,v){if(w<0||a<=w||v<0||a<=v)throw w+","+v;return i[w][v]},d.getModuleCount=function(){return a},d.make=function(){if(o<1){let w=1;for(;w<40;w++){const v=ec.getRSBlocks(w,s),g=tc();for(let S=0;S<l.length;S++){const R=l[S];g.put(R.getMode(),4),g.put(R.getLength(),pt.getLengthInBits(R.getMode(),w)),R.write(g)}let _=0;for(let S=0;S<v.length;S++)_+=v[S].dataCount;if(g.getLengthInBits()<=_*8)break}o=w}u(!1,h())},d.createTableTag=function(w,v){w=w||2,v=typeof v>"u"?w*4:v;let g="";g+='<table style="',g+=" border-width: 0px; border-style: none;",g+=" border-collapse: collapse;",g+=" padding: 0px; margin: "+v+"px;",g+='">',g+="<tbody>";for(let _=0;_<d.getModuleCount();_+=1){g+="<tr>";for(let S=0;S<d.getModuleCount();S+=1)g+='<td style="',g+=" border-width: 0px; border-style: none;",g+=" border-collapse: collapse;",g+=" padding: 0px; margin: 0px;",g+=" width: "+w+"px;",g+=" height: "+w+"px;",g+=" background-color: ",g+=d.isDark(_,S)?"#000000":"#ffffff",g+=";",g+='"/>';g+="</tr>"}return g+="</tbody>",g+="</table>",g},d.createSvgTag=function(w,v,g,_){let S={};typeof arguments[0]=="object"&&(S=arguments[0],w=S.cellSize,v=S.margin,g=S.alt,_=S.title),w=w||2,v=typeof v>"u"?w*4:v,g=typeof g=="string"?{text:g}:g||{},g.text=g.text||null,g.id=g.text?g.id||"qrcode-description":null,_=typeof _=="string"?{text:_}:_||{},_.text=_.text||null,_.id=_.text?_.id||"qrcode-title":null;const R=d.getModuleCount()*w+v*2;let k,A,I,L,C="",M;for(M="l"+w+",0 0,"+w+" -"+w+",0 0,-"+w+"z ",C+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',C+=S.scalable?"":' width="'+R+'px" height="'+R+'px"',C+=' viewBox="0 0 '+R+" "+R+'" ',C+=' preserveAspectRatio="xMinYMin meet"',C+=_.text||g.text?' role="img" aria-labelledby="'+N([_.id,g.id].join(" ").trim())+'"':"",C+=">",C+=_.text?'<title id="'+N(_.id)+'">'+N(_.text)+"</title>":"",C+=g.text?'<description id="'+N(g.id)+'">'+N(g.text)+"</description>":"",C+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',C+='<path d="',I=0;I<d.getModuleCount();I+=1)for(L=I*w+v,k=0;k<d.getModuleCount();k+=1)d.isDark(I,k)&&(A=k*w+v,C+="M"+A+","+L+M);return C+='" stroke="transparent" fill="black"/>',C+="</svg>",C},d.createDataURL=function(w,v){w=w||2,v=typeof v>"u"?w*4:v;const g=d.getModuleCount()*w+v*2,_=v,S=g-v;return S0(g,g,function(R,k){if(_<=R&&R<S&&_<=k&&k<S){const A=Math.floor((R-_)/w),I=Math.floor((k-_)/w);return d.isDark(I,A)?0:1}else return 1})},d.createImgTag=function(w,v,g){w=w||2,v=typeof v>"u"?w*4:v;const _=d.getModuleCount()*w+v*2;let S="";return S+="<img",S+=' src="',S+=d.createDataURL(w,v),S+='"',S+=' width="',S+=_,S+='"',S+=' height="',S+=_,S+='"',g&&(S+=' alt="',S+=N(g),S+='"'),S+="/>",S};const N=function(w){let v="";for(let g=0;g<w.length;g+=1){const _=w.charAt(g);switch(_){case"<":v+="&lt;";break;case">":v+="&gt;";break;case"&":v+="&amp;";break;case'"':v+="&quot;";break;default:v+=_;break}}return v},$=function(w){w=typeof w>"u"?2:w;const g=d.getModuleCount()*1+w*2,_=w,S=g-w;let R,k,A,I,L;const C={"██":"█","█ ":"▀"," █":"▄","  ":" "},M={"██":"▀","█ ":"▀"," █":" ","  ":" "};let B="";for(R=0;R<g;R+=2){for(A=Math.floor((R-_)/1),I=Math.floor((R+1-_)/1),k=0;k<g;k+=1)L="█",_<=k&&k<S&&_<=R&&R<S&&d.isDark(A,Math.floor((k-_)/1))&&(L=" "),_<=k&&k<S&&_<=R+1&&R+1<S&&d.isDark(I,Math.floor((k-_)/1))?L+=" ":L+="█",B+=w<1&&R+1>=S?M[L]:C[L];B+=`
`}return g%2&&w>0?B.substring(0,B.length-g-1)+Array(g+1).join("▀"):B.substring(0,B.length-1)};return d.createASCII=function(w,v){if(w=w||1,w<2)return $(v);w-=1,v=typeof v>"u"?w*2:v;const g=d.getModuleCount()*w+v*2,_=v,S=g-v;let R,k,A,I;const L=Array(w+1).join("██"),C=Array(w+1).join("  ");let M="",B="";for(R=0;R<g;R+=1){for(A=Math.floor((R-_)/w),B="",k=0;k<g;k+=1)I=1,_<=k&&k<S&&_<=R&&R<S&&d.isDark(A,Math.floor((k-_)/w))&&(I=0),B+=I?L:C;for(A=0;A<w;A+=1)M+=B+`
`}return M.substring(0,M.length-1)},d.renderTo2dContext=function(w,v){v=v||2;const g=d.getModuleCount();for(let _=0;_<g;_++)for(let S=0;S<g;S++)w.fillStyle=d.isDark(_,S)?"black":"white",w.fillRect(S*v,_*v,v,v)},d};gn.stringToBytes=function(e){const t=[];for(let n=0;n<e.length;n+=1){const r=e.charCodeAt(n);t.push(r&255)}return t};gn.createStringToBytes=function(e,t){const n=(function(){const o=_0(e),s=function(){const c=o.read();if(c==-1)throw"eof";return c};let i=0;const a={};for(;;){const c=o.read();if(c==-1)break;const l=s(),d=s(),u=s(),f=String.fromCharCode(c<<8|l),h=d<<8|u;a[f]=h,i+=1}if(i!=t)throw i+" != "+t;return a})(),r=63;return function(o){const s=[];for(let i=0;i<o.length;i+=1){const a=o.charCodeAt(i);if(a<128)s.push(a);else{const c=n[o.charAt(i)];typeof c=="number"?(c&255)==c?s.push(c):(s.push(c>>>8),s.push(c&255)):s.push(r)}}return s}};const fe={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},Nn={L:1,M:0,Q:3,H:2},ht={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},pt=(function(){const e=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],t=1335,n=7973,r=21522,o={},s=function(i){let a=0;for(;i!=0;)a+=1,i>>>=1;return a};return o.getBCHTypeInfo=function(i){let a=i<<10;for(;s(a)-s(t)>=0;)a^=t<<s(a)-s(t);return(i<<10|a)^r},o.getBCHTypeNumber=function(i){let a=i<<12;for(;s(a)-s(n)>=0;)a^=n<<s(a)-s(n);return i<<12|a},o.getPatternPosition=function(i){return e[i-1]},o.getMaskFunction=function(i){switch(i){case ht.PATTERN000:return function(a,c){return(a+c)%2==0};case ht.PATTERN001:return function(a,c){return a%2==0};case ht.PATTERN010:return function(a,c){return c%3==0};case ht.PATTERN011:return function(a,c){return(a+c)%3==0};case ht.PATTERN100:return function(a,c){return(Math.floor(a/2)+Math.floor(c/3))%2==0};case ht.PATTERN101:return function(a,c){return a*c%2+a*c%3==0};case ht.PATTERN110:return function(a,c){return(a*c%2+a*c%3)%2==0};case ht.PATTERN111:return function(a,c){return(a*c%3+(a+c)%2)%2==0};default:throw"bad maskPattern:"+i}},o.getErrorCorrectPolynomial=function(i){let a=Kn([1],0);for(let c=0;c<i;c+=1)a=a.multiply(Kn([1,mt.gexp(c)],0));return a},o.getLengthInBits=function(i,a){if(1<=a&&a<10)switch(i){case fe.MODE_NUMBER:return 10;case fe.MODE_ALPHA_NUM:return 9;case fe.MODE_8BIT_BYTE:return 8;case fe.MODE_KANJI:return 8;default:throw"mode:"+i}else if(a<27)switch(i){case fe.MODE_NUMBER:return 12;case fe.MODE_ALPHA_NUM:return 11;case fe.MODE_8BIT_BYTE:return 16;case fe.MODE_KANJI:return 10;default:throw"mode:"+i}else if(a<41)switch(i){case fe.MODE_NUMBER:return 14;case fe.MODE_ALPHA_NUM:return 13;case fe.MODE_8BIT_BYTE:return 16;case fe.MODE_KANJI:return 12;default:throw"mode:"+i}else throw"type:"+a},o.getLostPoint=function(i){const a=i.getModuleCount();let c=0;for(let u=0;u<a;u+=1)for(let f=0;f<a;f+=1){let h=0;const p=i.isDark(u,f);for(let m=-1;m<=1;m+=1)if(!(u+m<0||a<=u+m))for(let y=-1;y<=1;y+=1)f+y<0||a<=f+y||m==0&&y==0||p==i.isDark(u+m,f+y)&&(h+=1);h>5&&(c+=3+h-5)}for(let u=0;u<a-1;u+=1)for(let f=0;f<a-1;f+=1){let h=0;i.isDark(u,f)&&(h+=1),i.isDark(u+1,f)&&(h+=1),i.isDark(u,f+1)&&(h+=1),i.isDark(u+1,f+1)&&(h+=1),(h==0||h==4)&&(c+=3)}for(let u=0;u<a;u+=1)for(let f=0;f<a-6;f+=1)i.isDark(u,f)&&!i.isDark(u,f+1)&&i.isDark(u,f+2)&&i.isDark(u,f+3)&&i.isDark(u,f+4)&&!i.isDark(u,f+5)&&i.isDark(u,f+6)&&(c+=40);for(let u=0;u<a;u+=1)for(let f=0;f<a-6;f+=1)i.isDark(f,u)&&!i.isDark(f+1,u)&&i.isDark(f+2,u)&&i.isDark(f+3,u)&&i.isDark(f+4,u)&&!i.isDark(f+5,u)&&i.isDark(f+6,u)&&(c+=40);let l=0;for(let u=0;u<a;u+=1)for(let f=0;f<a;f+=1)i.isDark(f,u)&&(l+=1);const d=Math.abs(100*l/a/a-50)/5;return c+=d*10,c},o})(),mt=(function(){const e=new Array(256),t=new Array(256);for(let r=0;r<8;r+=1)e[r]=1<<r;for(let r=8;r<256;r+=1)e[r]=e[r-4]^e[r-5]^e[r-6]^e[r-8];for(let r=0;r<255;r+=1)t[e[r]]=r;const n={};return n.glog=function(r){if(r<1)throw"glog("+r+")";return t[r]},n.gexp=function(r){for(;r<0;)r+=255;for(;r>=256;)r-=255;return e[r]},n})(),Kn=function(e,t){if(typeof e.length>"u")throw e.length+"/"+t;const n=(function(){let o=0;for(;o<e.length&&e[o]==0;)o+=1;const s=new Array(e.length-o+t);for(let i=0;i<e.length-o;i+=1)s[i]=e[i+o];return s})(),r={};return r.getAt=function(o){return n[o]},r.getLength=function(){return n.length},r.multiply=function(o){const s=new Array(r.getLength()+o.getLength()-1);for(let i=0;i<r.getLength();i+=1)for(let a=0;a<o.getLength();a+=1)s[i+a]^=mt.gexp(mt.glog(r.getAt(i))+mt.glog(o.getAt(a)));return Kn(s,0)},r.mod=function(o){if(r.getLength()-o.getLength()<0)return r;const s=mt.glog(r.getAt(0))-mt.glog(o.getAt(0)),i=new Array(r.getLength());for(let a=0;a<r.getLength();a+=1)i[a]=r.getAt(a);for(let a=0;a<o.getLength();a+=1)i[a]^=mt.gexp(mt.glog(o.getAt(a))+s);return Kn(i,0).mod(o)},r},ec=(function(){const e=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(o,s){const i={};return i.totalCount=o,i.dataCount=s,i},n={},r=function(o,s){switch(s){case Nn.L:return e[(o-1)*4+0];case Nn.M:return e[(o-1)*4+1];case Nn.Q:return e[(o-1)*4+2];case Nn.H:return e[(o-1)*4+3];default:return}};return n.getRSBlocks=function(o,s){const i=r(o,s);if(typeof i>"u")throw"bad rs block @ typeNumber:"+o+"/errorCorrectionLevel:"+s;const a=i.length/3,c=[];for(let l=0;l<a;l+=1){const d=i[l*3+0],u=i[l*3+1],f=i[l*3+2];for(let h=0;h<d;h+=1)c.push(t(u,f))}return c},n})(),tc=function(){const e=[];let t=0;const n={};return n.getBuffer=function(){return e},n.getAt=function(r){const o=Math.floor(r/8);return(e[o]>>>7-r%8&1)==1},n.put=function(r,o){for(let s=0;s<o;s+=1)n.putBit((r>>>o-s-1&1)==1)},n.getLengthInBits=function(){return t},n.putBit=function(r){const o=Math.floor(t/8);e.length<=o&&e.push(0),r&&(e[o]|=128>>>t%8),t+=1},n},b0=function(e){const t=fe.MODE_NUMBER,n=e,r={};r.getMode=function(){return t},r.getLength=function(i){return n.length},r.write=function(i){const a=n;let c=0;for(;c+2<a.length;)i.put(o(a.substring(c,c+3)),10),c+=3;c<a.length&&(a.length-c==1?i.put(o(a.substring(c,c+1)),4):a.length-c==2&&i.put(o(a.substring(c,c+2)),7))};const o=function(i){let a=0;for(let c=0;c<i.length;c+=1)a=a*10+s(i.charAt(c));return a},s=function(i){if("0"<=i&&i<="9")return i.charCodeAt(0)-48;throw"illegal char :"+i};return r},v0=function(e){const t=fe.MODE_ALPHA_NUM,n=e,r={};r.getMode=function(){return t},r.getLength=function(s){return n.length},r.write=function(s){const i=n;let a=0;for(;a+1<i.length;)s.put(o(i.charAt(a))*45+o(i.charAt(a+1)),11),a+=2;a<i.length&&s.put(o(i.charAt(a)),6)};const o=function(s){if("0"<=s&&s<="9")return s.charCodeAt(0)-48;if("A"<=s&&s<="Z")return s.charCodeAt(0)-65+10;switch(s){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+s}};return r},w0=function(e){const t=fe.MODE_8BIT_BYTE,n=gn.stringToBytes(e),r={};return r.getMode=function(){return t},r.getLength=function(o){return n.length},r.write=function(o){for(let s=0;s<n.length;s+=1)o.put(n[s],8)},r},E0=function(e){const t=fe.MODE_KANJI,n=gn.stringToBytes;(function(s,i){const a=n(s);if(a.length!=2||(a[0]<<8|a[1])!=i)throw"sjis not supported."})("友",38726);const r=n(e),o={};return o.getMode=function(){return t},o.getLength=function(s){return~~(r.length/2)},o.write=function(s){const i=r;let a=0;for(;a+1<i.length;){let c=(255&i[a])<<8|255&i[a+1];if(33088<=c&&c<=40956)c-=33088;else if(57408<=c&&c<=60351)c-=49472;else throw"illegal char at "+(a+1)+"/"+c;c=(c>>>8&255)*192+(c&255),s.put(c,13),a+=2}if(a<i.length)throw"illegal char at "+(a+1)},o},Su=function(){const e=[],t={};return t.writeByte=function(n){e.push(n&255)},t.writeShort=function(n){t.writeByte(n),t.writeByte(n>>>8)},t.writeBytes=function(n,r,o){r=r||0,o=o||n.length;for(let s=0;s<o;s+=1)t.writeByte(n[s+r])},t.writeString=function(n){for(let r=0;r<n.length;r+=1)t.writeByte(n.charCodeAt(r))},t.toByteArray=function(){return e},t.toString=function(){let n="";n+="[";for(let r=0;r<e.length;r+=1)r>0&&(n+=","),n+=e[r];return n+="]",n},t},k0=function(){let e=0,t=0,n=0,r="";const o={},s=function(a){r+=String.fromCharCode(i(a&63))},i=function(a){if(a<0)throw"n:"+a;if(a<26)return 65+a;if(a<52)return 97+(a-26);if(a<62)return 48+(a-52);if(a==62)return 43;if(a==63)return 47;throw"n:"+a};return o.writeByte=function(a){for(e=e<<8|a&255,t+=8,n+=1;t>=6;)s(e>>>t-6),t-=6},o.flush=function(){if(t>0&&(s(e<<6-t),e=0,t=0),n%3!=0){const a=3-n%3;for(let c=0;c<a;c+=1)r+="="}},o.toString=function(){return r},o},_0=function(e){const t=e;let n=0,r=0,o=0;const s={};s.read=function(){for(;o<8;){if(n>=t.length){if(o==0)return-1;throw"unexpected end of file./"+o}const c=t.charAt(n);if(n+=1,c=="=")return o=0,-1;if(c.match(/^\s$/))continue;r=r<<6|i(c.charCodeAt(0)),o+=6}const a=r>>>o-8&255;return o-=8,a};const i=function(a){if(65<=a&&a<=90)return a-65;if(97<=a&&a<=122)return a-97+26;if(48<=a&&a<=57)return a-48+52;if(a==43)return 62;if(a==47)return 63;throw"c:"+a};return s},x0=function(e,t){const n=e,r=t,o=new Array(e*t),s={};s.setPixel=function(l,d,u){o[d*n+l]=u},s.write=function(l){l.writeString("GIF87a"),l.writeShort(n),l.writeShort(r),l.writeByte(128),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(255),l.writeByte(255),l.writeByte(255),l.writeString(","),l.writeShort(0),l.writeShort(0),l.writeShort(n),l.writeShort(r),l.writeByte(0);const d=2,u=a(d);l.writeByte(d);let f=0;for(;u.length-f>255;)l.writeByte(255),l.writeBytes(u,f,255),f+=255;l.writeByte(u.length-f),l.writeBytes(u,f,u.length-f),l.writeByte(0),l.writeString(";")};const i=function(l){const d=l;let u=0,f=0;const h={};return h.write=function(p,m){if(p>>>m)throw"length over";for(;u+m>=8;)d.writeByte(255&(p<<u|f)),m-=8-u,p>>>=8-u,f=0,u=0;f=p<<u|f,u=u+m},h.flush=function(){u>0&&d.writeByte(f)},h},a=function(l){const d=1<<l,u=(1<<l)+1;let f=l+1;const h=c();for(let E=0;E<d;E+=1)h.add(String.fromCharCode(E));h.add(String.fromCharCode(d)),h.add(String.fromCharCode(u));const p=Su(),m=i(p);m.write(d,f);let y=0,b=String.fromCharCode(o[y]);for(y+=1;y<o.length;){const E=String.fromCharCode(o[y]);y+=1,h.contains(b+E)?b=b+E:(m.write(h.indexOf(b),f),h.size()<4095&&(h.size()==1<<f&&(f+=1),h.add(b+E)),b=E)}return m.write(h.indexOf(b),f),m.write(u,f),m.flush(),p.toByteArray()},c=function(){const l={};let d=0;const u={};return u.add=function(f){if(u.contains(f))throw"dup key:"+f;l[f]=d,d+=1},u.size=function(){return d},u.indexOf=function(f){return l[f]},u.contains=function(f){return typeof l[f]<"u"},u};return s},S0=function(e,t,n){const r=x0(e,t);for(let a=0;a<t;a+=1)for(let c=0;c<e;c+=1)r.setPixel(c,a,n(c,a));const o=Su();r.write(o);const s=k0(),i=o.toByteArray();for(let a=0;a<i.length;a+=1)s.writeByte(i[a]);return s.flush(),"data:image/gif;base64,"+s};gn.stringToBytes;function I0(e,t=4){const n=gn(0,"L");return n.addData(e),n.make(),n.createSvgTag({cellSize:t,margin:2,scalable:!0})}const ro=25519;function Iu(e){const t=he(),{identity:n}=x();if(!t||!n?.pubkey||!n?.privkey)return e.onError("No relay pool or identity available."),()=>{};const{inviteId:r,adminPubkey:o,readRelays:s,writeRelays:i,onWelcome:a,onError:c}=e,l=n.privkey;n.pubkey;const d=Array.from(new Set([...s,...i])),u=Ee(F(l),o),f=JSON.stringify({type:"join-request",inviteId:r}),h=Dt(f,u),p=it({kind:ro,created_at:Math.floor(Date.now()/1e3),tags:[["d",r],["p",o]],content:h},F(l));Promise.allSettled(t.publish(i,p)).catch(()=>{});const m=t.subscribeMany(d,{kinds:[ro],"#d":[r],authors:[o]},{onevent(b){if(wt(b)&&!(typeof b.content=="string"&&b.content.length>65536))try{const E=jt(b.content,u),T=JSON.parse(E);T.type==="welcome"&&T.inviteId===r&&T.envelope&&(a(T.envelope),m.close())}catch{}},oneose(){}}),y=setTimeout(()=>{m.close(),c("Timed out waiting for welcome message from admin.")},12e4);return()=>{clearTimeout(y),m.close()}}function A0(e){const t=he(),{identity:n}=x();if(!t||!n?.pubkey||!n?.privkey)return e.onError("No relay pool or identity available."),()=>{};const{inviteId:r,readRelays:o,writeRelays:s,onJoinRequest:i,onError:a}=e,c=n.privkey,l=Array.from(new Set([...o,...s])),d=t.subscribeMany(l,{kinds:[ro],"#d":[r],"#p":[n.pubkey]},{onevent(f){if(wt(f)&&!(typeof f.content=="string"&&f.content.length>65536))try{const h=Ee(F(c),f.pubkey),p=jt(f.content,h),m=JSON.parse(p);m.type==="join-request"&&m.inviteId===r&&i(f.pubkey)}catch{}},oneose(){}}),u=setTimeout(()=>{d.close(),a("Timed out waiting for join request.")},3e5);return()=>{clearTimeout(u),d.close()}}function R0(e){const t=he(),{identity:n}=x();if(!t||!n?.privkey)return;const{inviteId:r,joinerPubkey:o,envelope:s,writeRelays:i}=e,a=Ee(F(n.privkey),o),c=JSON.stringify({type:"welcome",inviteId:r,envelope:s}),l=Dt(c,a),d=it({kind:ro,created_at:Math.floor(Date.now()/1e3),tags:[["d",r],["p",o]],content:l},F(n.privkey));Promise.allSettled(t.publish(i,d)).catch(()=>{})}const Au=35520;function C0(e){const t=he(),{identity:n}=x();if(!t||!n?.privkey)return;const{token:r,writeRelays:o}=e,s=JSON.stringify(r),i=String(Math.floor(Date.now()/1e3)+10080*60),a=it({kind:Au,created_at:Math.floor(Date.now()/1e3),tags:[["d",r.inviteId],["expiration",i]],content:s},F(n.privkey));Promise.allSettled(t.publish(o,a)).catch(()=>{})}function T0(e){const t=he();if(!t)return e.onError("No relay pool available."),()=>{};const{inviteId:n,readRelays:r,onToken:o,onError:s}=e;let i=!1;const a=t.subscribeMany(r,{kinds:[Au],"#d":[n]},{onevent(l){if(wt(l)&&!(typeof l.content=="string"&&l.content.length>65536)&&!i)try{const d=JSON.parse(l.content);d.inviteId===n&&(i=!0,o(d),a.close())}catch{}},oneose(){i||(a.close(),s("Invite not found on relay — it may have expired."))}}),c=setTimeout(()=>{i||(a.close(),s("Timed out looking for invite on relay."))},15e3);return()=>{clearTimeout(c),a.close()}}function Ru(e){if(!e||typeof e!="object")return{};const t=e;return{...typeof t.name=="string"?{name:t.name}:{},...typeof t.display_name=="string"?{display_name:t.display_name}:{},...typeof t.picture=="string"?{picture:t.picture}:{},...typeof t.about=="string"?{about:t.about}:{},...typeof t.nip05=="string"?{nip05:t.nip05}:{},...typeof t.lud16=="string"?{lud16:t.lud16}:{},...typeof t.lud06=="string"?{lud06:t.lud06}:{},...typeof t.website=="string"?{website:t.website}:{},...typeof t.banner=="string"?{banner:t.banner}:{}}}const et=new Map,Tr=new Map,L0=6e4,xe=new Set;function Ui(e){const t=et.get(e);if(t)return t.display_name||t.name||void 0}function bn(e){return et.get(e)}function Cu(e,t){const n=he();if(!n){console.warn("[profiles] no pool — skipping");return}const r=Date.now(),o=e.filter(c=>{if(et.has(c)||xe.has(c))return!1;const l=Tr.get(c);return!(l&&r-l<L0)});if(o.length===0){console.warn("[profiles] all cached/pending — nothing to fetch");return}for(const c of o)xe.add(c);const s=$0(t),i=[...new Set([...s,...Tu])];if(console.warn("[profiles] fetching",o.length,"profiles from",i,"for group",t?.slice(0,8)),i.length===0){for(const c of o)xe.delete(c);return}const a=n.subscribeMany(i,{kinds:[0],authors:o},{onevent(c){if(wt(c)&&!(typeof c.content=="string"&&c.content.length>65536))try{const l=Ru(JSON.parse(c.content));console.warn("[profiles] got profile for",c.pubkey.slice(0,8),l.display_name||l.name||"(no name)"),et.set(c.pubkey,l),xe.delete(c.pubkey);const d=l.display_name||l.name;if(d&&t){const u=x().groups[t];u&&u.memberNames?.[c.pubkey]!==d&&J(t,{memberNames:{...u.memberNames,[c.pubkey]:d}})}}catch{Tr.set(c.pubkey,Date.now()),xe.delete(c.pubkey)}},oneose(){console.warn("[profiles] EOSE — found:",o.filter(c=>et.has(c)).length,"missing:",o.filter(c=>!et.has(c)).length);for(const c of o)et.has(c)||Tr.set(c,Date.now()),xe.delete(c);a.close()}})}const Di=["wss://purplepag.es","wss://relay.damus.io","wss://nos.lol"],Tu=Di;async function N0(){await No();const e=he(),{identity:t,settings:n}=x();if(!e||!t?.pubkey)return;const r=t.pubkey;if(xe.has(r))return;et.delete(r),Tr.delete(r),xe.add(r);const o=n?.defaultRelays?.length?n.defaultRelays:[],s=[...new Set([...o,...Tu])];if(s.length===0){xe.delete(r);return}console.warn("[profiles] fetching own kind 0 from",s);const i=e.subscribeMany(s,{kinds:[0],authors:[r]},{onevent(a){if(wt(a)&&!(typeof a.content=="string"&&a.content.length>65536))try{const c=Ru(JSON.parse(a.content));console.warn("[profiles] got own profile from relay:",c.display_name||c.name||"(no name)"),et.set(a.pubkey,c),xe.delete(a.pubkey);const l=c.display_name||c.name,d=c.picture,{identity:u}=x();if(u&&u.pubkey===a.pubkey){const f={};l&&u.displayName!==l&&(f.displayName=l),d&&u.picture!==d&&(f.picture=d),Object.keys(f).length>0&&te({identity:{...u,...f}})}}catch{xe.delete(a.pubkey)}},oneose(){xe.delete(r),i.close()}})}function $0(e){if(e){const n=x().groups[e];if(n?.relays?.length)return n.relays}const t=x().settings;return t?.defaultRelays?.length?t.defaultRelays:[]}function M0(e){const t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function O0(e,t){setTimeout(async()=>{try{const n=he();if(!n){console.warn("[profiles] no pool — skipping kind 0 publish");return}await No();const r=JSON.stringify({name:e}),o={kind:0,created_at:Math.floor(Date.now()/1e3),tags:[],content:r},s=M0(t),i=it(o,s),{settings:a}=x(),c=a?.defaultWriteRelays?.length?a.defaultWriteRelays:a?.defaultRelays?.length?a.defaultRelays:[],l=Se([...Di,...c]);console.warn("[profiles] publishing kind 0 to",l);const d=n.publish(l,i),f=(await Promise.allSettled(d)).filter(h=>h.status==="fulfilled").length;console.warn(`[profiles] kind 0 published to ${f}/${l.length} relay(s)`)}catch(n){console.warn("[profiles] kind 0 publish failed:",n)}},2e3)}const Lu=Object.freeze(Object.defineProperty({__proto__:null,PROFILE_RELAYS:Di,fetchOwnProfile:N0,fetchProfiles:Cu,getCachedName:Ui,getCachedProfile:bn,publishKind0:O0},Symbol.toStringTag,{value:"Module"})),nc=[210,140,30,280,60,330,170,0];function B0(e,t){const n=t.indexOf(e);return nc[(n>=0?n:0)%nc.length]}function P0(e,t,n,r){const o=B0(e,t),s=n[e]??0;if(s===0)return`hsl(${o}, 55%, 55%)`;const i=Math.floor(Date.now()/1e3)-s;return i<=r?`hsl(${o}, 70%, 55%)`:i<=r*1.25?`hsl(${o}, 40%, 50%)`:"#94a3b8"}function Ms(e,t,n){const{identity:r,groups:o}=x(),s=r?.pubkey===e;let i;if(n){const c=o[n]?.memberNames?.[e];c&&c!=="You"&&(i=c)}return i||(i=Ui(e)),s?i?`${i} (you)`:"You":i||`${e.slice(0,8)}…${e.slice(-4)}`}function Oo(e,t){const n=t?.title??"Invite to Group",r=t?.scanHint??"Scan with your phone camera to join";t?.showConfirmMemberNote,zn(e);let o=document.getElementById("invite-modal");o||(o=document.createElement("dialog"),o.id="invite-modal",o.className="modal",document.body.appendChild(o),o.addEventListener("click",u=>{u.target===o&&(Sn(),o.close())}));const s=o;function i(){s.innerHTML=`
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
    `,s.querySelector("#invite-qr-path")?.addEventListener("click",l),s.querySelector("#invite-link-path")?.addEventListener("click",d),s.querySelector("#invite-close-btn")?.addEventListener("click",()=>{Sn(),s.close()})}function a(u){s.innerHTML=`
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
    `,s.querySelector("#remote-back-2")?.addEventListener("click",u),s.querySelector("#remote-next-2")?.addEventListener("click",()=>{const f=s.querySelector("#remote-joincode-input"),h=s.querySelector("#remote-joincode-error"),p=f?.value.trim()??"";if(!/^[0-9a-f]{64}$/.test(p)){h&&(h.textContent="Invalid join code — must be a 64-character hex public key.",h.style.display="");return}try{const m=x().groups[e.id];if(!m)throw new Error("Group not found.");const y=Za(m,p);c(y,p)}catch(m){h&&(h.textContent=m instanceof Error?m.message:"Failed to create welcome envelope.",h.style.display="")}})}function c(u,f){s.innerHTML=`
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
    `,s.querySelector("#remote-copy-welcome")?.addEventListener("click",async h=>{const p=h.currentTarget;try{await navigator.clipboard.writeText(u),p.textContent="Copied!",p.classList.add("btn--copied"),setTimeout(()=>{p.textContent="Copy Welcome Message",p.classList.remove("btn--copied")},2e3)}catch{}}),s.querySelector("#remote-done")?.addEventListener("click",()=>{try{const h=x().groups[e.id];if(h&&!h.members.includes(f)){const p=s.querySelector("#remote-joiner-name")?.value.trim()??"";Ns(e.id,f,p),H(p?`${p} added to group`:"Member added to group","success")}}catch(h){H(h instanceof Error?h.message:"Failed to add member","error")}Sn(),s.close()})}function l(){let u,f,h;try{const b=o0(e);u=b.payload,f=b.confirmCode,h=y0(u)}catch(b){H(b instanceof Error?b.message:"Failed to create invite.","error");return}const m=`${window.location.href.split("#")[0]}#inv/${Vv(h)}`,y=I0(m);s.innerHTML=`
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
    `,s.querySelector("#invite-back-btn")?.addEventListener("click",()=>{i()}),s.querySelector("#invite-done-btn")?.addEventListener("click",()=>{s.close()})}function d(){let u;try{u=u0(e)}catch(b){H(b instanceof Error?b.message:"Failed to create remote invite.","error");return}const h=`${window.location.href.split("#")[0]}#j/${u.inviteId}`,p=e.readRelays?.length?e.readRelays:x().settings.defaultReadRelays,m=e.writeRelays?.length?e.writeRelays:x().settings.defaultWriteRelays;Me(p,m).then(()=>{C0({token:mu(u.tokenPayload),writeRelays:m})});let y=()=>{};s.innerHTML=`
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
    `,s.querySelector("#remote-copy-link")?.addEventListener("click",async b=>{const E=b.currentTarget;try{await navigator.clipboard.writeText(h),E.textContent="Copied!",E.classList.add("btn--copied"),setTimeout(()=>{E.textContent="Copy Link",E.classList.remove("btn--copied")},2e3)}catch{}}),Me(p,m).then(()=>{y=A0({inviteId:u.inviteId,readRelays:p,writeRelays:m,onJoinRequest(b){y();try{const E=x().groups[e.id];if(!E)return;const T=Za(E,b);R0({inviteId:u.inviteId,joinerPubkey:b,envelope:T,writeRelays:m}),E.members.includes(b)||Ns(e.id,b),Sn(),s.close(),H("Member joined via relay","success")}catch(E){H(E instanceof Error?E.message:"Failed to send welcome","error")}},onError(b){const E=s.querySelector("#remote-relay-status");E&&(E.textContent=b||"Relay unavailable — use manual fallback below.")}})}),s.querySelector("#remote-manual-fallback")?.addEventListener("click",()=>{y(),a(()=>{y=()=>{},d()})}),s.querySelector("#remote-back-btn")?.addEventListener("click",()=>{y(),Sn(),i()})}i(),o.showModal()}function Os(e){Oo(e,{title:"Share Group State",scanHint:"Share with existing members to sync the latest group state.",showConfirmMemberNote:!1})}function U0(e,t){const{identity:n,groups:r}=x(),o=r[t],s=n?.pubkey===e,i=o?.admins.includes(e)??!1,a=Ms(e,o?.members??[],t),c=bn(e),l=o?.memberNames?.[e],d=o?.livenessCheckins?.[e];let u="Never checked in";if(d){const b=Math.floor(Date.now()/1e3)-d;b<60?u="Active now":b<3600?u=`${Math.floor(b/60)}m ago`:u=`${Math.floor(b/3600)}h ago`}const f=[s?'<span class="member-detail__badge">You</span>':"",i?'<span class="member-detail__badge member-detail__badge--admin">Admin</span>':""].filter(Boolean).join(" "),h=c?.display_name||c?.name,p=(b,E)=>`<div class="member-detail__row"><span class="member-detail__label">${b}</span><span class="member-detail__value">${j(E)}</span></div>`,m=[p("Pubkey",`${e.slice(0,16)}…${e.slice(-8)}`)];h&&m.push(p("Nostr name",h)),c?.nip05&&m.push(p("NIP-05",c.nip05)),c?.about&&m.push(p("About",c.about.length>80?c.about.slice(0,80)+"…":c.about)),c?.lud16&&m.push(p("Lightning",c.lud16)),c?.website&&m.push(p("Website",c.website)),l&&l!=="You"&&l!==h&&m.push(p("Display name",l)),m.push(p("Liveness",u)),c||m.push('<div class="member-detail__row"><span class="member-detail__label" style="color: var(--text-muted); font-style: italic;">No Nostr profile found on relay</span></div>');const y=c?.picture?`<img class="member-detail__avatar" src="${j(c.picture)}" alt="" />`:"";Oi(`
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
  `,()=>{}),requestAnimationFrame(()=>{document.getElementById("member-detail-copy")?.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(e);const b=document.getElementById("member-detail-copy");b.textContent="Copied!",setTimeout(()=>{b.textContent="Copy Pubkey"},1500)}catch{}}),document.getElementById("modal-cancel-btn")?.addEventListener("click",()=>{document.getElementById("app-modal")?.close()})})}function Nu(e){const{groups:t,activeGroupId:n}=x();if(!n){e.innerHTML="";return}const r=t[n];if(!r){e.innerHTML="";return}const{identity:o}=x(),s=!!o?.pubkey&&r.admins.includes(o.pubkey);Cu(r.members,n);const i=r.members.length>0?r.members.map(a=>{const c=P0(a,r.members,r.livenessCheckins??{},r.livenessInterval),l=bn(a),d=l?.picture?`<img src="${j(l.picture)}" alt="" style="width:24px;height:24px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid ${c};box-shadow:0 0 6px ${c}80;" />`:`<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${c};flex-shrink:0;box-shadow:0 0 6px ${c}80;"></span>`;return`
          <li class="member-item" data-pubkey="${j(a)}">
            ${d}
            <button class="member-item__name-btn" data-pubkey="${j(a)}" type="button">${j(Ms(a,r.members,n))}</button>
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
  `,e.querySelectorAll(".member-item__name-btn").forEach(a=>{a.addEventListener("click",()=>{const c=a.dataset.pubkey;c&&U0(c,n)})}),e.querySelector(".member-list")?.addEventListener("click",a=>{const c=a.target.closest(".member-item__remove");if(!c)return;const l=c.dataset.pubkey;if(!l)return;const{groups:d}=x(),u=d[n]?.members??[];if(!confirm(`Remove ${Ms(l,u,n)} from the group?

This rotates the group secret immediately. Remaining members must re-join using a fresh invite.`))return;const{activeGroupId:f}=x();if(!f)return;Av(f,l);const{groups:h}=x(),p=h[f];p&&p.members.length>0&&Os(p)}),e.querySelector("#invite-btn")?.addEventListener("click",()=>{const{groups:a,activeGroupId:c}=x();if(!c)return;const l=a[c];l&&Oo(l)}),e.querySelector("#share-state-btn")?.addEventListener("click",()=>{const{groups:a,activeGroupId:c}=x();if(!c)return;const l=a[c];l&&Os(l)}),e.querySelector("#confirm-member-btn")?.addEventListener("click",()=>{$u()})}function rc(e,t,n){const{groups:r,identity:o}=x(),s=r[e];if(!s||!o?.pubkey||!s.admins.includes(o.pubkey))return!1;s.members.includes(t)||Ns(e,t,n);const i=x().groups[e];return i&&n&&J(e,{memberNames:{...i.memberNames,[t]:n}}),!0}function $u(e){const{groups:t,activeGroupId:n}=x();!n||!t[n]||(Oi(`
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
  `,o=>{try{const s=o.get("ackToken")?.trim(),i=o.get("word")?.trim().toLowerCase(),a=o.get("memberName")?.trim(),{activeGroupId:c}=x();if(!c)throw new Error("No active group.");const{groups:l}=x(),d=l[c];if(!d)throw new Error("Group not found.");if(s){const u=s.includes("#ack/")?decodeURIComponent(s.split("#ack/")[1]):s,f=d0(u,{groupId:c,groupSeed:d.seed,counter:d.counter+(d.usageOffset??0),context:"canary:group",encoding:Bt(d),tolerance:d.tolerance??1});if(!f.valid)throw new Error(f.error??"Invalid join token.");if(!rc(c,f.pubkey,f.displayName||a||""))throw new Error("Member could not be added — they may already be in the group or you are not an admin.");H(`${f.displayName||"Member"} has joined the group`,"success")}else if(i){if(!a)throw new Error("Please enter the member name.");const u=d.counter+(d.usageOffset??0),f=rt(d.seed,Nt,u,Bt(d)).toLowerCase();if(i!==f)throw new Error("Word does not match — the member may not have the current group key.");const h=new Uint8Array(32);crypto.getRandomValues(h);const p=Array.from(h,m=>m.toString(16).padStart(2,"0")).join("");if(!rc(c,p,a))throw new Error("Member could not be added — you may not be an admin of this group.");H(`${a} has joined the group`,"success")}else throw new Error("Provide either an ack token or a verification word.")}catch(s){throw alert(s instanceof Error?s.message:"Confirmation failed."),s}}),requestAnimationFrame(()=>{document.getElementById("modal-cancel-btn")?.addEventListener("click",()=>{document.getElementById("app-modal")?.close()})}))}const D0=Object.freeze(Object.defineProperty({__proto__:null,renderMembers:Nu,showConfirmMemberModal:$u,showInviteModal:Oo,showShareStateModal:Os},Symbol.toStringTag,{value:"Module"})),Bs="0123456789bcdefghjkmnpqrstuvwxyz",ji={};for(let e=0;e<Bs.length;e++)ji[Bs[e]]=e;function j0(e){for(const t of e)if(!(t in ji))throw new TypeError(`Invalid geohash character: '${t}' in "${e}"`)}function qi(e,t,n=5){if(!Number.isFinite(e)||e<-90||e>90)throw new RangeError(`Invalid latitude: ${e}`);if(!Number.isFinite(t)||t<-180||t>180)throw new RangeError(`Invalid longitude: ${t}`);if(!Number.isFinite(n))throw new RangeError(`Invalid precision: ${n}`);if(n=Math.round(n),n<1)throw new RangeError(`Invalid precision: ${n}`);n=Math.min(12,n);let r=-90,o=90,s=-180,i=180,a="",c=0,l=0,d=!0;for(;a.length<n;){if(d){const u=(s+i)/2;t>=u?(l|=1<<4-c,s=u):i=u}else{const u=(r+o)/2;e>=u?(l|=1<<4-c,r=u):o=u}d=!d,c++,c===5&&(a+=Bs[l],c=0,l=0)}return a}function Mu(e){if(e.length===0)throw new TypeError("Cannot decode an empty geohash");const t=q0(e);return{lat:(t.minLat+t.maxLat)/2,lon:(t.minLon+t.maxLon)/2,error:{lat:(t.maxLat-t.minLat)/2,lon:(t.maxLon-t.minLon)/2}}}function q0(e){j0(e);let t=-90,n=90,r=-180,o=180,s=!0;for(const i of e){const a=ji[i];for(let c=4;c>=0;c--){if(s){const l=(r+o)/2;a>>c&1?r=l:o=l}else{const l=(t+n)/2;a>>c&1?t=l:n=l}s=!s}}return{minLat:t,maxLat:n,minLon:r,maxLon:o}}const H0=[0,25e5,63e4,78e3,2e4,2400,610,76,19,2.4];function Hi(e){if(!Number.isFinite(e))throw new RangeError(`Invalid precision: ${e}`);const t=Math.max(1,Math.min(9,Math.round(e)));return H0[t]}let Z=null,qe=null,Le={},le={},Qn={},be=null,vn=new Set,er=!1,Ps=null;const F0=[{label:"City",value:4,hint:"~20 km"},{label:"Neighbourhood",value:5,hint:"~2.4 km"},{label:"Street",value:6,hint:"~610 m"},{label:"Exact",value:9,hint:"~2 m"}],oc=6371e3;function G0(e,t,n,r=48){const o=[];for(let s=0;s<=r;s++){const i=s/r*2*Math.PI,a=n/oc*Math.cos(i)*(180/Math.PI),c=n/(oc*Math.cos(e*Math.PI/180))*Math.sin(i)*(180/Math.PI);o.push([t+c,e+a])}return o}const sc=[210,140,30,280,60,330,170,0];function wr(e){const{groups:t,activeGroupId:n}=x(),s=((n?t[n]:null)?.members??[]).indexOf(e);return sc[(s>=0?s:0)%sc.length]}function Fi(e){if(vn.has(e))return"#f87171";const{groups:t,activeGroupId:n}=x(),r=n?t[n]:null;if(!r)return`hsl(${wr(e)}, 70%, 55%)`;const o=r.livenessCheckins[e]??0;if(o===0)return`hsl(${wr(e)}, 20%, 50%)`;const s=Math.floor(Date.now()/1e3)-o,i=r.livenessInterval;return s<=i?`hsl(${wr(e)}, 70%, 55%)`:s<=i*1.25?`hsl(${wr(e)}, 40%, 50%)`:"#94a3b8"}function Ou(){return{type:"FeatureCollection",features:Object.entries(le).map(([e,t])=>({type:"Feature",properties:{pubkey:e,duress:vn.has(e),colour:Fi(e)},geometry:{type:"Polygon",coordinates:[G0(t.lat,t.lon,Hi(t.precision))]}}))}}const Bu="5.19.0",V0=`https://unpkg.com/maplibre-gl@${Bu}/dist/maplibre-gl.js`,K0=`https://unpkg.com/maplibre-gl@${Bu}/dist/maplibre-gl.css`,W0="sha384-pEfbADcwebVj4NNOvWFLUkm+FiGTICE5bChpV647czG7OpSqcHNgxM8QawfAkbRO",z0="sha384-MGCxhspF/+ufueUgol3FDkiAYQbpSNRhBT0VWHJt64U8qIy9qlnXWx8LAbj6niPH";async function J0(){if(qe)return qe;try{const[t]=await Promise.all([ce(()=>import("./maplibre-gl-DFGd9893.js").then(n=>n.m),[],import.meta.url),ce(()=>Promise.resolve({}),__vite__mapDeps([0]),import.meta.url)]);return qe=t,t}catch{}const e=document.createElement("link");return e.rel="stylesheet",e.href=K0,e.integrity=z0,e.crossOrigin="anonymous",document.head.appendChild(e),await new Promise((t,n)=>{const r=document.createElement("script");r.src=V0,r.integrity=W0,r.crossOrigin="anonymous",r.onload=()=>t(),r.onerror=n,document.head.appendChild(r)}),qe=window.maplibregl,qe}async function Pu(e){const{groups:t,activeGroupId:n}=x();if(!n||!t[n]){Z&&(Z.remove(),Z=null,er=!1),e.innerHTML="";return}const r=t[n],o=r.beaconPrecision??5;if(Ps!==n){le={},Qn={},vn.clear();for(const[s,i]of Object.entries(Le))i.remove(),delete Le[s];if(Ps=n,r.lastPositions)for(const[s,i]of Object.entries(r.lastPositions))le[s]=i}if(Z&&document.getElementById("beacon-map")){wn();for(const[s,i]of Object.entries(le))tr(s,i.lat,i.lon);fn(),Object.keys(le).length>0&&un();return}queueMicrotask(()=>fn()),e.innerHTML=`
    <section class="panel beacon-panel">
      <h3 class="panel__title">Location</h3>
      <p class="settings-hint" style="margin-bottom: 0.5rem;">Approximate location of group members. Circles show the geohash area — your exact position is never shared. In an emergency, full GPS precision is used so your group can help. Circles turn <span style="color: #f87171; font-weight: 500;">red</span> when an emergency signal is active.</p>
      <div class="beacon-map" id="beacon-map" style="height: 500px; border-radius: 8px;"></div>
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-top: 0.5rem; flex-wrap: wrap;">
        <button class="btn ${be!==null?"btn--primary":""}" id="beacon-toggle-btn" type="button">
          ${be!==null?"Sharing Location":"Share Location"}
        </button>
        <button class="btn btn--ghost" id="beacon-fit-btn" type="button" title="Zoom to fit all group members on the map">Fit All</button>
        ${be!==null?'<span class="settings-hint" style="margin: 0;">Your approximate area is visible to group members</span>':""}
      </div>
      <div style="margin-top: 0.75rem;">
        <span class="input-label">"I'm Alive" precision</span>
        <div class="segmented" id="beacon-precision-picker">
          ${F0.map(s=>`<button class="segmented__btn ${o===s.value?"segmented__btn--active":""}" data-beacon-precision="${s.value}" title="${s.hint}">${s.label}</button>`).join("")}
        </div>
        <p class="settings-hint">How precisely your location is shared in routine check-ins</p>
      </div>
      <p class="settings-hint" style="margin-top: 0.5rem; color: var(--duress);">Emergency signals always share your exact GPS so your group can find you.</p>
      <div class="beacon-list" id="beacon-list"></div>
    </section>
  `,e.querySelectorAll("[data-beacon-precision]").forEach(s=>{s.addEventListener("click",()=>{const i=Number(s.dataset.beaconPrecision),{activeGroupId:a}=x();a&&(J(a,{beaconPrecision:i}),be!==null&&(ic(),Us()),e.querySelectorAll("[data-beacon-precision]").forEach(c=>{c.classList.toggle("segmented__btn--active",Number(c.dataset.beaconPrecision)===i)}))})}),e.querySelector("#beacon-toggle-btn")?.addEventListener("click",()=>{be!==null?ic():Us(),Pu(e)}),e.querySelector("#beacon-fit-btn")?.addEventListener("click",()=>{un()});try{await J0(),Y0()}catch{e.querySelector(".beacon-map").innerHTML='<p style="color: var(--text-muted); text-align: center; padding: 2rem;">Map unavailable offline</p>'}}function Y0(){const e=document.getElementById("beacon-map");if(!e||Z||!qe)return;const n=document.documentElement.dataset.theme!=="light"?"https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json":"https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";Z=new qe.Map({container:e,style:n,center:[-.1278,51.5074],zoom:12}),Z.on("load",()=>{er=!0,console.info("[canary:beacon] map loaded, positions to catch up:",Object.keys(le).length),Z.addSource("geohash-circles",{type:"geojson",data:Ou()}),Z.addLayer({id:"geohash-fill",type:"fill",source:"geohash-circles",paint:{"fill-color":["get","colour"],"fill-opacity":["case",["get","duress"],.35,.2]}}),Z.addLayer({id:"geohash-stroke",type:"line",source:"geohash-circles",paint:{"line-color":["get","colour"],"line-width":2.5,"line-opacity":["case",["get","duress"],.9,.6]}});for(const[r,o]of Object.entries(le))tr(r,o.lat,o.lon);Object.keys(le).length>0&&un()})}function Gi(){const{activeGroupId:e}=x();e&&J(e,{lastPositions:{...le}})}function wn(){if(!Z||!er)return;const e=Z.getSource("geohash-circles");e&&e.setData(Ou())}function ic(){be!==null&&(navigator.geolocation.clearWatch(be),be=null);const{identity:e}=x();e?.pubkey&&(delete le[e.pubkey],delete Qn[e.pubkey],Le[e.pubkey]&&(Le[e.pubkey].remove(),delete Le[e.pubkey]),wn(),fn())}function Us(){if(be!==null||!("geolocation"in navigator))return;const{groups:e,activeGroupId:t,identity:n}=x();if(!t||!e[t]||!n?.pubkey)return;const r=e[t],o=au(r.seed),s=r.beaconPrecision||5;be=navigator.geolocation.watchPosition(async i=>{const a=qi(i.coords.latitude,i.coords.longitude,s),c=Mu(a),l=c.lat,d=c.lon,u=await lu(o,a,s);n?.pubkey&&(Qn[n.pubkey]=u,le[n.pubkey]={lat:l,lon:d,geohash:a,precision:s,timestamp:Math.floor(Date.now()/1e3)},tr(n.pubkey,l,d),wn(),un(),fn(),Gi(),t&&ke(t,{type:"beacon",lat:l,lon:d,accuracy:Hi(s),timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID()}))},i=>{console.warn("[canary:beacon] watchPosition error",i.code,i.message)},{enableHighAccuracy:!1,maximumAge:6e4,timeout:15e3})}function tr(e,t,n){if(!Z||!qe){console.warn("[canary:beacon] updateMapMarker skipped — map not ready",{map:!!Z,maplibregl:!!qe,pubkey:e.slice(0,8)});return}const r=Fi(e),o=vn.has(e),s=Uu(e),i=bn(e),a=!!i?.picture,c=o?40:32;if(Le[e]){Le[e].setLngLat([n,t]);const l=Le[e].getElement(),d=l.querySelector(".beacon-dot");d&&(a||(d.style.background=r),d.style.width=`${c}px`,d.style.height=`${c}px`,d.style.borderColor=r,d.style.boxShadow=`0 0 10px ${r}80`,d.style.animation=o?"beacon-pulse 1s ease-in-out infinite":"none");const u=l.querySelector(".beacon-label");u&&(u.textContent=s)}else{const l=document.createElement("div");l.style.display="flex",l.style.flexDirection="column",l.style.alignItems="center",l.style.pointerEvents="none";let d;a?(d=document.createElement("img"),d.src=i.picture,d.style.objectFit="cover"):(d=document.createElement("div"),d.style.background=r),d.className="beacon-dot",d.style.width=`${c}px`,d.style.height=`${c}px`,d.style.borderRadius="50%",d.style.border=`3px solid ${r}`,d.style.boxShadow=`0 0 10px ${r}80`,d.style.zIndex="2",o&&(d.style.animation="beacon-pulse 1s ease-in-out infinite"),l.appendChild(d);const u=document.createElement("div");u.className="beacon-label",u.textContent=s,u.style.fontSize="11px",u.style.fontWeight="600",u.style.color="#fff",u.style.textShadow="0 1px 3px rgba(0,0,0,0.8)",u.style.marginTop="2px",u.style.whiteSpace="nowrap",l.appendChild(u),Le[e]=new qe.Marker({element:l,anchor:"center"}).setLngLat([n,t]).addTo(Z)}}function un(){if(!Z)return;const e=Object.values(le);if(e.length===0)return;if(e.length===1){Z.flyTo({center:[e[0].lon,e[0].lat],zoom:13});return}const t=e.map(r=>r.lon),n=e.map(r=>r.lat);Z.fitBounds([[Math.min(...t),Math.min(...n)],[Math.max(...t),Math.max(...n)]],{padding:60,maxZoom:14})}function Uu(e){const{groups:t,activeGroupId:n,identity:r}=x(),o=n?t[n]:null,s=r?.pubkey===e;let i;const a=o?.memberNames?.[e];return a&&a!=="You"&&(i=a),i||(i=Ui(e)),s?i?`${i} (you)`:"You":i||`${e.slice(0,8)}…`}function fn(){const e=document.getElementById("beacon-list");if(!e)return;const t=Object.entries(le).map(([n,r])=>{const o=Fi(n),s=Uu(n),i=bn(n),a=Math.floor(Date.now()/1e3)-r.timestamp,c=a<60?"just now":a<3600?`${Math.floor(a/60)}m ago`:`${Math.floor(a/3600)}h ago`;return`
      <div class="beacon-entry" style="display:flex;align-items:center;gap:0.5rem;padding:0.25rem 0;">
        ${i?.picture?`<img src="${j(i.picture)}" alt="" style="width:20px;height:20px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid ${o};" />`:`<span style="width:8px;height:8px;border-radius:50%;background:${o};flex-shrink:0;"></span>`}
        <span class="beacon-member" style="font-weight:500;">${j(s)}</span>
        <span class="beacon-geohash" style="color:var(--text-muted);font-size:0.8rem;">${j(r.geohash)}</span>
        <span style="color:var(--text-muted);font-size:0.75rem;margin-left:auto;">${j(c)}</span>
      </div>
    `}).join("");e.innerHTML=t||'<p class="settings-hint">No beacons yet — enable location to start</p>'}document.addEventListener("canary:duress",(e=>{const{members:t}=e.detail;if(!t?.length)return;for(const r of t)vn.add(r),Z0(r);wn();const n=t.map(r=>le[r]).filter(Boolean);if(Z&&n.length===1)Z.flyTo({center:[n[0].lon,n[0].lat],zoom:14});else if(Z&&n.length>1){const r=n.map(s=>s.lon),o=n.map(s=>s.lat);Z.fitBounds([[Math.min(...r),Math.min(...o)],[Math.max(...r),Math.max(...o)]],{padding:60})}}));function Z0(e){const t=Le[e];if(!t)return;const n=t.getElement();n.style.background="#f87171",n.style.width="14px",n.style.height="14px",n.style.boxShadow="0 0 12px rgba(248, 113, 113, 0.6)"}function X0(){if(console.info("[canary:beacon] sendLocationPing called",{hasGeo:"geolocation"in navigator,map:!!Z,mapReady:er}),!("geolocation"in navigator))return;const{groups:e,activeGroupId:t,identity:n}=x();if(!t||!e[t]||!n?.pubkey){console.warn("[canary:beacon] sendLocationPing: missing state",{activeGroupId:t,hasPubkey:!!n?.pubkey});return}if(be!==null){console.info("[canary:beacon] watch already active, skipping getCurrentPosition");return}Us();const r=e[t],o=au(r.seed),s=r.beaconPrecision||5;navigator.geolocation.getCurrentPosition(async i=>{const a=qi(i.coords.latitude,i.coords.longitude,s),c=Mu(a),l=c.lat,d=c.lon,u=await lu(o,a,s);n?.pubkey&&(Qn[n.pubkey]=u,le[n.pubkey]={lat:l,lon:d,geohash:a,precision:s,timestamp:Math.floor(Date.now()/1e3)},tr(n.pubkey,l,d),wn(),un(),fn(),Gi(),t&&ke(t,{type:"beacon",lat:l,lon:d,accuracy:Hi(s),timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID()}))},i=>{console.warn("[canary:beacon] getCurrentPosition FAILED",i.code,i.message),ce(async()=>{const{showToast:a}=await Promise.resolve().then(()=>zb);return{showToast:a}},void 0,import.meta.url).then(({showToast:a})=>{i.code===1?a("Location permission denied","error",3e3):i.code===3?a("Location request timed out","error",3e3):a("Could not get location","error",3e3)})},{enableHighAccuracy:!1,maximumAge:3e4,timeout:1e4})}function Q0(e,t,n,r,o){const{groups:s,activeGroupId:i}=x(),a=i?s[i]:null;if(!a||!a.members.includes(e))return;const c=ew(r),l=qi(t,n,c);le[e]={lat:t,lon:n,geohash:l,precision:c,timestamp:o},tr(e,t,n),wn(),un(),fn(),Gi()}function ew(e){return e<=3?9:e<=20?8:e<=80?7:e<=620?6:e<=2500?5:e<=2e4?4:e<=8e4?3:e<=63e4?2:1}function tw(){be!==null&&navigator.geolocation.clearWatch(be),be=null,er=!1,Z&&(Z.remove(),Z=null),Le={},le={},Qn={},vn.clear(),Ps=null}function nw(e){return new Date(e*1e3).toISOString().slice(11,19)+" UTC"}function rw(e,t){return e<=t?"green":e<=t*1.25?"amber":"red"}function ow(e,t){return e<60?nw(t):e<3600?`${Math.floor(e/60)}m ago`:e<86400?`${Math.floor(e/3600)}h ago`:`${Math.floor(e/86400)}d ago`}const sw=[{label:"1m",value:60},{label:"2m",value:120},{label:"5m",value:300},{label:"15m",value:900},{label:"1h",value:3600},{label:"4h",value:14400},{label:"24h",value:86400},{label:"7d",value:604800}];function iw(e){const{groups:t,activeGroupId:n,identity:r}=x();if(!n||!t[n]){e.innerHTML="";return}const o=t[n],s=Math.floor(Date.now()/1e3),i=o.livenessInterval,a=o.members.map(d=>{const u=o.livenessCheckins[d]??0,f=u>0,h=f?s-u:1/0,p=f?rw(h,i):"grey",m=f?Math.max(0,Math.min(100,(1-h/i)*100)):0,y=r?.pubkey===d,b=o.memberNames?.[d],E=y?"You":b??`${d.slice(0,8)}…`;return`
      <li class="liveness-item liveness-item--${p}">
        <span class="liveness-dot liveness-dot--${p}"></span>
        <span class="liveness-name">${j(E)}</span>
        <span class="liveness-time">${f?ow(h,u):"awaiting first check-in"}</span>
        <div class="liveness-bar">
          <div class="liveness-bar__fill liveness-bar__fill--${p}" style="width: ${m}%"></div>
        </div>
      </li>
    `}).join(""),c=r?.pubkey!=null&&o.members.includes(r.pubkey),l=sw.map(d=>`<button class="segmented__btn ${i===d.value?"segmented__btn--active":""}" data-liveness-interval="${d.value}">${d.label}</button>`).join("");e.innerHTML=`
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
  `,e.querySelectorAll("[data-liveness-interval]").forEach(d=>{d.addEventListener("click",()=>{const u=Number(d.dataset.livenessInterval);J(n,{livenessInterval:u})})}),document.getElementById("checkin-btn")?.addEventListener("click",()=>{try{const{identity:d,activeGroupId:u,groups:f}=x();if(!d?.pubkey||!u){console.warn("[canary:liveness] No identity or activeGroupId",{pubkey:d?.pubkey,gid:u});return}const h=f[u];if(!h){console.warn("[canary:liveness] Group not found",u);return}const p=Math.floor(Date.now()/1e3),m=vt(p,h.rotationInterval);ib(h.seed,"canary:liveness",d.pubkey,m);const y={...h.livenessCheckins,[d.pubkey]:p};J(u,{livenessCheckins:y}),ke(u,{type:"liveness-checkin",pubkey:d.pubkey,timestamp:p,opId:crypto.randomUUID()}),Promise.all([ce(()=>import("./push-Bmopmp70.js"),[],import.meta.url),ce(()=>Promise.resolve().then(()=>Li),void 0,import.meta.url)]).then(([{notifyCheckin:b},{hashGroupTag:E}])=>{b(E(u))}).catch(()=>{}),X0(),setTimeout(()=>{document.getElementById("beacon-container")?.scrollIntoView({behavior:"smooth",block:"center"})},300),H("Check-in sent — location updated","success",2e3)}catch(d){console.error("[canary:liveness] Check-in failed:",d),H("Check-in failed","error",3e3)}})}function ac(e){if(e.startsWith("wss://"))return!0;if(e.startsWith("ws://"))try{const t=new URL(e);return t.hostname==="localhost"||t.hostname==="127.0.0.1"||t.hostname==="[::1]"}catch{return!1}return!1}let Jt=!1;function aw(e){const{groups:t,activeGroupId:n}=x();if(!n||!t[n]){e.innerHTML="";return}const r=t[n],{identity:o}=x(),s=!!o?.pubkey&&r.admins.includes(o.pubkey);e.innerHTML=`
    <div class="settings-drawer" id="settings-drawer">
      <button class="settings-toggle" id="settings-toggle">
        <span>Group Settings</span>
        <span class="settings-chevron" style="${Jt?"transform: rotate(90deg);":""}">&#9658;</span>
      </button>

      <div class="settings-body" id="settings-body"${Jt?"":" hidden"}>
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
                ${Ft()?`Connected to ${qt()} relay${qt()===1?"":"s"}`:"Not connected"}
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
  `,document.getElementById("settings-toggle").addEventListener("click",()=>{Jt=!Jt;const a=document.getElementById("settings-body"),c=e.querySelector(".settings-chevron");a.hidden=!Jt,c.style.transform=Jt?"rotate(90deg)":""}),document.getElementById("settings-name").addEventListener("change",a=>{const c=a.target.value.trim();c&&J(n,{name:c})}),e.querySelectorAll("[data-interval]").forEach(a=>{a.addEventListener("click",()=>{J(n,{rotationInterval:Number(a.dataset.interval)})})}),e.querySelectorAll("[data-words]").forEach(a=>{a.addEventListener("click",()=>{J(n,{wordCount:Number(a.dataset.words)})})}),e.querySelectorAll("[data-enc]").forEach(a=>{a.addEventListener("click",()=>{J(n,{encodingFormat:a.dataset.enc})})}),e.querySelectorAll("[data-tolerance]").forEach(a=>{a.addEventListener("click",()=>{J(n,{tolerance:Number(a.dataset.tolerance)})})}),e.querySelectorAll("[data-duress-mode]").forEach(a=>{a.addEventListener("click",()=>{J(n,{duressMode:a.dataset.duressMode})})}),document.getElementById("nostr-toggle").addEventListener("change",a=>{const c=a.target.checked;J(n,{nostrEnabled:c});const l=document.getElementById("nostr-settings");if(l.hidden=!c,c){const d=x().groups[n],u=d?.readRelays??[],f=d?.writeRelays??[];Me(u,f,n).then(()=>{lc()}),cc()}else dn(),Kd(),Gn(!1,0),lc()});function i(){const a=x().groups[n];a?.nostrEnabled&&Me(a.readRelays??[],a.writeRelays??[],n)}e.querySelectorAll(".write-relay-remove").forEach(a=>{a.addEventListener("click",()=>{const c=Number(a.dataset.relayIndex),l=[...x().groups[n]?.writeRelays??[]];l.splice(c,1),J(n,{writeRelays:l}),i()})}),e.querySelectorAll(".read-relay-remove").forEach(a=>{a.addEventListener("click",()=>{const c=Number(a.dataset.relayIndex),l=[...x().groups[n]?.readRelays??[]];l.splice(c,1),J(n,{readRelays:l}),i()})}),document.getElementById("write-relay-add-btn").addEventListener("click",()=>{const a=document.getElementById("write-relay-add-input"),c=a.value.trim();if(!ac(c)){a.focus();return}const l=[...x().groups[n]?.writeRelays??[]];l.includes(c)?a.value="":(l.push(c),J(n,{writeRelays:l}),a.value="",i())}),document.getElementById("read-relay-add-btn").addEventListener("click",()=>{const a=document.getElementById("read-relay-add-input"),c=a.value.trim();if(!ac(c)){a.focus();return}const l=[...x().groups[n]?.readRelays??[]];l.includes(c)?a.value="":(l.push(c),J(n,{readRelays:l}),a.value="",i())}),document.getElementById("write-relay-add-input").addEventListener("keydown",a=>{a.key==="Enter"&&document.getElementById("write-relay-add-btn").click()}),document.getElementById("read-relay-add-input").addEventListener("keydown",a=>{a.key==="Enter"&&document.getElementById("read-relay-add-btn").click()}),r.nostrEnabled&&cc(),document.getElementById("reseed-btn")?.addEventListener("click",()=>{const{groups:a}=x(),c=a[n],d=(c?zn(c)==="online":!1)?"Rotate the group key? This broadcasts the new key to all members via the relay.":"Rotate the group key? Remaining members will need to re-sync via Share State.";confirm(d)&&(Sv(n),H("Key rotated. New verification words are active.","warning",6e3))}),document.getElementById("compromise-reseed-btn")?.addEventListener("click",()=>{confirm("Compromise reseed? This generates a new key WITHOUT broadcasting. All members will need new invites.")&&(Iv(n),H("Emergency reseed complete. No broadcast sent — share new invites with all members.","warning",8e3))}),document.getElementById("dissolve-btn").addEventListener("click",()=>{confirm(`Dissolve "${r.name}"? This cannot be undone.`)&&xv(n)}),document.getElementById("export-btn").addEventListener("click",()=>{if(!confirm("This exports the group secret in cleartext. Treat the file like a password."))return;const a=new Blob([JSON.stringify(r,null,2)],{type:"application/json"}),c=URL.createObjectURL(a),l=document.createElement("a");l.href=c,l.download=`canary-${r.name.toLowerCase().replace(/\s+/g,"-")}.json`,l.click(),URL.revokeObjectURL(c)}),document.getElementById("import-btn").addEventListener("click",()=>{if(!confirm("Only import files from trusted sources — the file contains the group secret."))return;const a=document.createElement("input");a.type="file",a.accept=".json",a.addEventListener("change",async()=>{const c=a.files?.[0];if(c)try{const l=await c.text(),d=JSON.parse(l);Cv(d);const u=crypto.randomUUID(),f={id:u,name:String(d.name),seed:String(d.seed),members:d.members.filter(p=>typeof p=="string"),memberNames:{},nostrEnabled:!1,relays:[],wordlist:typeof d.wordlist=="string"?d.wordlist:"en-v1",wordCount:[1,2,3].includes(d.wordCount)?d.wordCount:2,counter:typeof d.counter=="number"&&d.counter>=0?d.counter:0,usageOffset:typeof d.usageOffset=="number"&&d.usageOffset>=0?d.usageOffset:0,rotationInterval:typeof d.rotationInterval=="number"&&d.rotationInterval>0?d.rotationInterval:86400,encodingFormat:["words","pin","hex"].includes(d.encodingFormat)?d.encodingFormat:"words",usedInvites:[],latestInviteIssuedAt:0,livenessInterval:typeof d.rotationInterval=="number"&&d.rotationInterval>0?d.rotationInterval:86400,livenessCheckins:{},tolerance:typeof d.tolerance=="number"&&d.tolerance>=0&&d.tolerance<=10?d.tolerance:1,beaconInterval:typeof d.beaconInterval=="number"&&d.beaconInterval>0?d.beaconInterval:60,beaconPrecision:typeof d.beaconPrecision=="number"&&d.beaconPrecision>0?d.beaconPrecision:5,duressPrecision:typeof d.duressPrecision=="number"&&d.duressPrecision>0?d.duressPrecision:9,duressMode:["immediate","dead-drop","both"].includes(d.duressMode)?d.duressMode:"immediate",createdAt:typeof d.createdAt=="number"?d.createdAt:Math.floor(Date.now()/1e3),admins:Array.isArray(d.admins)?d.admins.filter(p=>typeof p=="string"):[],epoch:typeof d.epoch=="number"&&d.epoch>=0?d.epoch:0,consumedOps:Array.isArray(d.consumedOps)?d.consumedOps.filter(p=>typeof p=="string"):[]},{groups:h}=x();te({groups:{...h,[u]:f},activeGroupId:u})}catch{alert("Could not import group file. Check the file format.")}}),a.click()})}function cc(){const e=document.getElementById("nostr-identity");if(!e)return;const{identity:t}=x();if(!t?.pubkey){e.innerHTML='<span class="settings-hint">No identity available.</span>';return}const n=`${t.pubkey.slice(0,8)}…${t.pubkey.slice(-8)}`;e.innerHTML=`
    <div class="nostr-identity-row">
      <span class="input-label">Identity (Local key)</span>
      <span class="relay-url nostr-pubkey" title="${j(t.pubkey)}">${j(n)}</span>
    </div>
    <p class="settings-hint">Your identity is stored locally on this device.</p>
  `}function lc(){const e=document.getElementById("nostr-conn-status");if(!e)return;const t=qt();e.textContent=Ft()?`Connected to ${t} relay${t===1?"":"s"}`:"Not connected"}const dc=new TextEncoder;function cw(e){const t=new Uint8Array(4);return new DataView(t.buffer).setUint32(0,e,!1),t}function Du(){const e=new Uint8Array(32);return crypto.getRandomValues(e),e}const Wn=Object.freeze({call:Object.freeze({wordCount:1,rotationSeconds:30,tolerance:1,directional:!0,description:"Phone verification for insurance, banking, and call centres. Single word with 30-second rotation. Deepfake-proof — cloning a voice does not help derive the current word."}),handoff:Object.freeze({wordCount:1,rotationSeconds:0,tolerance:0,directional:!0,description:"Physical handoff verification for rideshare, delivery, and task completion. Single-use token per event. No time dependency — counter is the task/event ID."})});function Ds(e){const t=e.preset?Wn[e.preset]:void 0,n=e.rotationSeconds??t?.rotationSeconds??30,r=e.tolerance??t?.tolerance??0,o=t?.wordCount??1,s=e.encoding??{format:"words",count:o};if(!e.namespace)throw new Error("namespace must be a non-empty string");if(e.namespace.includes("\0"))throw new Error("namespace must not contain null bytes");if(!e.roles[0]||!e.roles[1])throw new Error("Both roles must be non-empty strings");if(e.roles[0].includes("\0")||e.roles[1].includes("\0"))throw new Error("Roles must not contain null bytes");if(e.roles[0]===e.roles[1])throw new Error(`Roles must be distinct, got ["${e.roles[0]}", "${e.roles[1]}"]`);if(e.myRole!==e.roles[0]&&e.myRole!==e.roles[1])throw new Error(`myRole "${e.myRole}" is not one of the configured roles ["${e.roles[0]}", "${e.roles[1]}"]`);if(!Number.isInteger(n)||n<0)throw new RangeError(`rotationSeconds must be a non-negative integer, got ${n}`);if(!Number.isInteger(r)||r<0)throw new RangeError(`tolerance must be a non-negative integer, got ${r}`);if(r>zr)throw new RangeError(`tolerance must be <= ${zr}, got ${r}`);if(n===0&&e.counter===void 0)throw new Error("Fixed counter mode (rotationSeconds=0) requires config.counter");if(n===0&&e.counter!==void 0&&(!Number.isInteger(e.counter)||e.counter<0||e.counter>4294967295))throw new RangeError(`counter must be an integer 0–${4294967295}, got ${e.counter}`);if(n>0&&e.counter!==void 0)throw new Error("counter must not be set when rotationSeconds > 0 (counter is derived from time)");const i=typeof e.secret=="string"?F(e.secret):e.secret,a=e.roles[0]===e.myRole?e.roles[1]:e.roles[0],c=`pair:${e.namespace}:${a}`,l=n===0;function d(u){if(l){if(e.counter===void 0)throw new Error("Fixed counter mode (rotationSeconds=0) requires config.counter");return e.counter}const f=u??Math.floor(Date.now()/1e3);return Math.floor(f/n)}return{counter:d,myToken(u){return xn(i,e.namespace,e.roles,d(u),s)[e.myRole]},theirToken(u){return xn(i,e.namespace,e.roles,d(u),s)[a]},verify(u,f){const h=u.toLowerCase().trim().replace(/\s+/g," "),p=d(f),m=Math.max(0,p-r),y=Math.min(4294967295,p+r);let b=!1;for(let T=m;T<=y;T++){const O=xn(i,e.namespace,e.roles,T,s);Qt(h,O[a])&&(b=!0)}const E=[];if(e.theirIdentity){const T=new Set,O=2*r,N=Math.max(0,p-O),$=Math.min(4294967295,p+O);for(let w=N;w<=$;w++){const v=xn(i,e.namespace,e.roles,w,s);T.add(v[a])}for(let w=m;w<=y;w++){const v=$e(dc.encode(c+":duress"),new Uint8Array([0]),dc.encode(e.theirIdentity),cw(w));let g=Ne(i,v),_=Ut(g,s),S=1;for(;T.has(_)&&S<=255;)g=Ne(i,$e(v,new Uint8Array([S]))),_=Ut(g,s),S++;Qt(h,_)&&E.push(e.theirIdentity)}}return E.length>0?{status:"duress",identities:E}:b?{status:"valid"}:{status:"invalid"}},pair(u){return xn(i,e.namespace,e.roles,d(u),s)}}}const $n={insurance:{label:"Insurance",namespace:"aviva",roles:["caller","agent"],preset:"call"},pickup:{label:"Pickup",namespace:"family",roles:["child","adult"],preset:"handoff"},rideshare:{label:"Rideshare",namespace:"dispatch",roles:["requester","driver"],preset:"handoff",encoding:"pin"}};let Vi=Du(),Q=$n.insurance,Zt,Lr,Nr=null,Ki=1;function js(){const e=Q.preset==="handoff",t=Q.encoding==="pin"?{format:"pin",digits:4}:void 0,n={secret:Vi,namespace:Q.namespace,roles:Q.roles,preset:Q.preset,...e?{counter:Ki}:{},...t?{encoding:t}:{}};Zt=Ds({...n,myRole:Q.roles[0],theirIdentity:Q.roles[1]}),Lr=Ds({...n,myRole:Q.roles[1],theirIdentity:Q.roles[0]})}js();function Er(e,t){const n=Q.preset==="handoff",r=Wn[Q.preset],o=n?Ki:Math.floor((t??Math.floor(Date.now()/1e3))/r.rotationSeconds),s=`pair:${Q.namespace}:${e}`,i=Q.encoding==="pin"?{format:"pin",digits:4}:{format:"words",count:1};return Io(Vi,s,e,o,i,r.tolerance)}function $r(){Nr!==null&&(clearInterval(Nr),Nr=null)}function kr(e){if(e<=0)return"0s";const t=Math.floor(e/60),n=Math.floor(e%60);return t>0?`${t}m ${n}s`:`${n}s`}function uc(e){if(e===0)return 0;const t=Math.floor(Date.now()/1e3),r=(Math.floor(t/e)+1)*e;return Math.max(0,r-t)}function Mr(e){$r();const t=Math.floor(Date.now()/1e3),n=Q.preset==="handoff",r=n?0:Wn[Q.preset].rotationSeconds,o=uc(r),s=r>0?Math.min(100,(r-o)/r*100):100,i=Q.roles[0],a=Q.roles[1];e.innerHTML=`
    <div class="call-sim">
      <div class="call-sim__header">
        <h2 class="call-sim__title">CANARY Call Verification Demo</h2>
        <div class="call-sim__scenarios" id="call-scenarios">
          ${Object.entries($n).map(([m,y])=>`<button class="btn call-sim__scenario-btn${Q===y?" call-sim__scenario-btn--active":""}" data-scenario="${m}">${y.label}</button>`).join("")}
        </div>
      </div>

      <div class="call-sim__panels">
        <div class="call-sim__panel call-sim__panel--caller">
          <h3 class="call-sim__role">${i.toUpperCase()}</h3>
          <div class="call-sim__token-group">
            <span class="call-sim__label">Your code — tap to reveal:</span>
            <div class="call-sim__token call-sim__token--reveal" id="caller-reveal" data-real="${Zt.myToken(t)}" data-alt="${Er(i,t)}">••••••••</div>
          </div>
          ${n?'<span class="call-sim__countdown">Single-use</span>':`
          <div class="call-sim__progress"><div class="call-sim__progress-bar" id="caller-progress" style="width: ${s}%"></div></div>
          <span class="call-sim__countdown" id="caller-countdown">${kr(o)}</span>
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
            <div class="call-sim__token call-sim__token--reveal" id="agent-reveal" data-real="${Lr.myToken(t)}" data-alt="${Er(a,t)}">••••••••</div>
          </div>
          ${n?'<span class="call-sim__countdown">Single-use</span>':`
          <div class="call-sim__progress"><div class="call-sim__progress-bar" id="agent-progress" style="width: ${s}%"></div></div>
          <span class="call-sim__countdown" id="agent-countdown">${kr(o)}</span>
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
        <span class="call-sim__meta">Tolerance: <strong>+/-${n?"0":Wn[Q.preset].tolerance}</strong></span>
        <button class="btn" id="call-reset-seed">Reset seed</button>
      </div>

      <div class="call-sim__pair" id="call-pair">
        <span class="call-sim__meta">Pair: <code id="pair-display"></code></span>
      </div>
    </div>
  `,e.querySelector("#call-scenarios")?.addEventListener("click",m=>{const y=m.target.closest("[data-scenario]");if(!y)return;const b=y.dataset.scenario;$n[b]&&$n[b]!==Q&&(Q=$n[b],js(),Mr(e))}),e.querySelector("#call-reset-seed")?.addEventListener("click",()=>{Vi=Du(),Q.preset==="handoff"&&Ki++,js(),Mr(e)});let c=!1,l=!1,d=!1;function u(){if(!d&&c&&l){$r();const m=e.querySelector("#call-verified-banner");m&&(m.hidden=!1,m.textContent="Call Verified — both parties authenticated"),e.querySelectorAll(".call-sim__progress, .call-sim__countdown").forEach(y=>{y.hidden=!0})}}function f(m,y,b,E,T){const O=e.querySelector(`#${m}`),N=e.querySelector(`#${y}`),$=e.querySelector(`#${b}`);if(!O||!N||!$)return;function w(){const v=O.value.trim();if(!v)return;const g=E.verify(v);$.hidden=!1,$.className="call-sim__result",g.status==="valid"?($.classList.add("call-sim__result--valid"),$.textContent="Verified ✓",T==="caller"?c=!0:l=!0,u()):g.status==="duress"?($.classList.add("call-sim__result--invalid"),$.textContent="Failed ✗",d=!0):($.classList.add("call-sim__result--invalid"),$.textContent="Failed ✗")}N.addEventListener("click",w),O.addEventListener("keydown",v=>{v.key==="Enter"&&w()})}f("caller-verify-input","caller-verify-btn","caller-result",Zt,"caller"),f("agent-verify-input","agent-verify-btn","agent-result",Lr,"agent");function h(m){const y=e.querySelector(`#${m}`);if(!y)return;function b(T){T.preventDefault();const O=y.getBoundingClientRect(),N=T.clientX-O.left;y.textContent=N<O.width/2?y.dataset.real:y.dataset.alt}function E(){y.textContent="••••••••"}y.addEventListener("pointerdown",b),y.addEventListener("pointerup",E),y.addEventListener("pointerleave",E),y.addEventListener("pointercancel",E)}h("caller-reveal"),h("agent-reveal");const p=e.querySelector("#pair-display");if(p){const m=Zt.pair(t),y=Object.entries(m).map(([b,E])=>`${b}: ${E}`).join(" | ");p.textContent=y}!n&&r>0&&(Nr=setInterval(()=>{const m=uc(r),y=Math.min(100,(r-m)/r*100),b=e.querySelector("#caller-progress"),E=e.querySelector("#agent-progress"),T=e.querySelector("#caller-countdown"),O=e.querySelector("#agent-countdown"),N=Math.max(0,100-y),$=N>50?`hsl(${Math.round(120*(N/100))}, 70%, 45%)`:`hsl(${Math.round(120*(N/100))}, 80%, 45%)`;b&&(b.style.width=`${y}%`,b.style.background=$),E&&(E.style.width=`${y}%`,E.style.background=$),T&&(T.textContent=kr(m)),O&&(O.textContent=kr(m));const w=Math.floor(Date.now()/1e3),v=e.querySelector("#caller-reveal"),g=e.querySelector("#agent-reveal"),_=Zt.myToken(w),S=v&&v.dataset.real!==_;if(v&&(v.dataset.real=_,v.dataset.alt=Er(i,w)),g&&(g.dataset.real=Lr.myToken(w),g.dataset.alt=Er(a,w)),S){c=!1,l=!1,d=!1;const k=e.querySelector("#caller-result"),A=e.querySelector("#agent-result");k&&(k.hidden=!0,k.className="call-sim__result"),A&&(A.hidden=!0,A.className="call-sim__result");const I=e.querySelector("#caller-verify-input"),L=e.querySelector("#agent-verify-input");I&&(I.value=""),L&&(L.value="");const C=e.querySelector("#call-verified-banner");C&&(C.hidden=!0),e.querySelectorAll(".call-sim__progress, .call-sim__countdown").forEach(M=>{M.hidden=!1})}const R=e.querySelector("#pair-display");if(R){const k=Zt.pair(),A=Object.entries(k).map(([I,L])=>`${I}: ${L}`).join(" | ");R.textContent=A}m===0&&($r(),Mr(e))},1e3))}function lw(){$r()}let St=null;function dw(e,t){const n=x().groups[t];if(!n)return e.slice(0,8);const{identity:r}=x();if(r?.pubkey===e)return"You";const o=n.memberNames?.[e];return o||`${e.slice(0,8)}…${e.slice(-4)}`}function uw(e,t){St&&(St(),St=null),document.querySelector(".call-verify")?.remove();const{groups:n,identity:r}=x(),o=n[e];if(!o||!r)return;const s=r.pubkey,i=dw(t,e),a=bn(t),c=s<t?[s,t]:[t,s],l=Ds({secret:o.seed,namespace:"canary:call",roles:c,myRole:s,preset:"call"}),d=Wn.call.rotationSeconds,u=Math.floor(Date.now()/1e3),f=l.myToken(u),h=l.theirToken(u),p=document.createElement("div");p.className="call-verify",p.innerHTML=`
    <div class="call-verify__content">
      ${a?.picture?`<img class="call-verify__avatar" src="${j(a.picture)}" alt="" />`:""}
      <h2 class="call-verify__title">Call with ${j(i)}</h2>
      <p class="call-verify__instruction">Speak your word. Listen for theirs. If it matches, the call is verified.</p>

      <div class="call-verify__section call-verify__section--say">
        <span class="call-verify__label">Say this:</span>
        <span class="call-verify__word call-verify__word--mine" id="cv-word-mine">${j(f)}</span>
      </div>

      <div class="call-verify__divider"></div>

      <div class="call-verify__section call-verify__section--hear">
        <span class="call-verify__label">They should say:</span>
        <span class="call-verify__word call-verify__word--theirs" id="cv-word-theirs">${j(h)}</span>
      </div>

      <p class="call-verify__timer">Words change in <span id="cv-countdown">${d}</span>s</p>

      <p class="call-verify__instruction" style="margin-top: 1.5rem; font-size: 0.75rem;">In a real call, if they say the wrong word, it could be an emergency signal. A production app would automatically check and silently alert the group.</p>
      <div class="call-verify__actions">
        <button class="btn btn--primary call-verify__btn" id="cv-match">Match</button>
        <button class="btn call-verify__btn call-verify__btn--danger" id="cv-mismatch">Wrong Word</button>
        <button class="btn call-verify__btn" id="cv-close">Close</button>
      </div>
    </div>
  `;let m=null;function y(){const O=Math.floor(Date.now()/1e3),N=p.querySelector("#cv-word-mine"),$=p.querySelector("#cv-word-theirs"),w=p.querySelector("#cv-countdown");if(N&&(N.textContent=l.myToken(O)),$&&($.textContent=l.theirToken(O)),w){const v=O%d;w.textContent=String(d-v)}}m=setInterval(y,1e3);function b(){m!==null&&(clearInterval(m),m=null)}function E(){St&&(St(),St=null),p.classList.remove("call-verify--visible"),setTimeout(()=>p.remove(),300)}function T(O){O.key==="Escape"&&E()}St=()=>{b(),document.removeEventListener("keydown",T)},document.body.appendChild(p),requestAnimationFrame(()=>p.classList.add("call-verify--visible")),document.addEventListener("keydown",T),p.querySelector("#cv-match")?.addEventListener("click",()=>{b(),p.innerHTML=`
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
    `,p.querySelector("#cv-dismiss-fail")?.addEventListener("click",E)})}const ju=30078,qu="canary:vault",fw=2160*60*60;function Wi(e){const t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function hw(e){const t={};for(const[r,o]of Object.entries(e)){const{lastPositions:s,...i}=o;t[r]={...i,livenessCheckins:{}}}return JSON.stringify({version:1,groups:t})}function fc(e){try{const t=JSON.parse(e);return!t||typeof t!="object"||typeof t.groups!="object"||t.groups===null?{}:t.groups}catch{return{}}}function pw(e,t,n){const r=Wi(t),o=Ee(r,n);return Dt(e,o)}function hc(e,t,n){try{const r=Wi(t),o=Ee(r,n);return jt(e,o)}catch{return null}}function mw(e,t){const n=Wi(t),r=Math.floor(Date.now()/1e3),o={kind:ju,created_at:r,tags:[["d",qu],["expiration",String(r+fw)]],content:e};return it(o,n)}async function Hu(e,t,n){const r=he();if(!r)throw new Error("No relay pool — connect first");const o=zd();if(o.length===0)throw new Error("No write relays configured");const s=hw(e),i=pw(s,t,n),a=mw(i,t);document.dispatchEvent(new CustomEvent("canary:vault-syncing")),await Promise.allSettled(r.publish(o,a)),document.dispatchEvent(new CustomEvent("canary:vault-synced",{detail:{timestamp:Math.floor(Date.now()/1e3)}}))}async function yw(e,t){const n=he();if(!n)return null;const r=Wd();return r.length===0?null:new Promise(o=>{let s=!1,i=null;const a=setTimeout(()=>{if(!s){if(s=!0,c.close(),i){const l=hc(i.content,e,t);if(l){o(fc(l));return}}o(null)}},1e4),c=n.subscribeMany(r,{kinds:[ju],authors:[t],"#d":[qu],limit:1},{onevent(l){wt(l)&&(typeof l.content=="string"&&l.content.length>262144||(!i||l.created_at>i.created_at)&&(i=l))},oneose(){if(!s){if(s=!0,clearTimeout(a),c.close(),i){const l=hc(i.content,e,t);if(l){o(fc(l));return}}o(null)}}})})}function gw(e,t){const n={...e};for(const[r,o]of Object.entries(t)){const s=e[r];if(!s){n[r]=o;continue}const i=s.epoch??0,a=o.epoch??0;if(a>i)n[r]=o;else if(a===i){const c=s.counter??0;(o.counter??0)>c&&(n[r]=o)}}return n}function bw(e){if(e.startsWith("wss://"))return!0;if(e.startsWith("ws://"))try{const t=new URL(e);return t.hostname==="localhost"||t.hostname==="127.0.0.1"||t.hostname==="[::1]"}catch{return!1}return!1}function qs(e,t){return t?.pubkey===e.pubkey&&t.mnemonic?{...e,mnemonic:t.mnemonic}:e}function Fu(e,t){return e?typeof t.epoch=="number"&&t.epoch<e.epoch?"This invite is older than the group state already stored on this device.":typeof t.latestInviteIssuedAt=="number"&&e.latestInviteIssuedAt>0&&t.latestInviteIssuedAt<e.latestInviteIssuedAt?"A newer invite has already been accepted for this group on this device.":typeof t.epoch=="number"&&t.epoch===e.epoch&&typeof t.counter=="number"&&t.counter<e.counter?"This invite would roll the group back to an older counter.":null:null}Hg();const vw=Ug();vw.theme==="light"?document.documentElement.setAttribute("data-theme","light"):document.documentElement.removeAttribute("data-theme");let $t=null;function Dn(){$t!==null&&(clearTimeout($t),$t=null);const{settings:e}=x();!e.pinEnabled||e.autoLockMinutes<=0||!vd()||($t=setTimeout(async()=>{await xo(),ko(),ef(),zi()},e.autoLockMinutes*60*1e3))}function Gu(){document.addEventListener("pointerdown",Dn,{passive:!0}),document.addEventListener("keydown",Dn,{passive:!0}),Dn()}function Vu(){document.removeEventListener("pointerdown",Dn),document.removeEventListener("keydown",Dn),$t!==null&&(clearTimeout($t),$t=null)}function zi(){Vu(),dn();const e=document.getElementById("app");e.innerHTML=`
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
  `;const t=document.getElementById("pin-input"),n=document.getElementById("pin-error"),r=document.getElementById("pin-submit");let o=0;const s=[0,1e3,2e3,5e3,15e3,3e4];async function i(){const a=t.value.trim();if(a.length<6){n.textContent="PIN must be at least 6 digits.",n.hidden=!1,t.focus();return}r.disabled=!0,r.textContent="Unlocking…",n.hidden=!0;try{await Dg(a),await xw(),Ku();const c=document.getElementById("header");c&&$i(c),Wu(),Yi(),Or(Ji),Gu(),zu(),oo(),window.addEventListener("hashchange",()=>oo()),so()}catch{o++;const c=s[Math.min(o,s.length-1)];n.textContent=c>0?`Incorrect PIN. Wait ${c/1e3}s before retrying.`:"Incorrect PIN. Try again.",n.hidden=!1,t.value="",r.disabled=!0,r.textContent="Unlock",c>0?setTimeout(()=>{r.disabled=!1,t.focus()},c):(r.disabled=!1,t.focus())}}r.addEventListener("click",()=>{i()}),t.addEventListener("keydown",a=>{a.key==="Enter"&&i()}),requestAnimationFrame(()=>t.focus())}function Ku(){const e=document.getElementById("app");if(!e)throw new Error("Missing #app mount point");e.innerHTML=`
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
  `}function Wu(){const e=document.getElementById("hamburger"),t=document.getElementById("sidebar"),n=document.getElementById("sidebar-overlay");if(!e||!t||!n)return;function r(){t.classList.add("sidebar--open"),n.classList.add("sidebar-overlay--visible"),e.setAttribute("aria-expanded","true")}function o(){t.classList.remove("sidebar--open"),n.classList.remove("sidebar-overlay--visible"),e.setAttribute("aria-expanded","false")}e.setAttribute("aria-expanded","false"),e.addEventListener("click",()=>{t.classList.contains("sidebar--open")?o():r()}),n.addEventListener("click",()=>{o()}),t.addEventListener("click",s=>{s.target.closest("[data-group-id]")&&o()})}let as=!1;function Ji(){as||(as=!0,requestAnimationFrame(()=>{as=!1,Yi()}))}function Yi(){const{view:e}=x(),t=document.getElementById("groups-view"),n=document.getElementById("call-demo-view");t&&(t.hidden=e!=="groups"),n&&(n.hidden=e!=="call-demo");const r=document.getElementById("header");if(r&&$i(r),e==="groups"){lw();const o=document.getElementById("welcome-container");o&&Tv(o);const s=document.getElementById("sidebar");s&&pv(s);const i=document.getElementById("hero-container");i&&uu(i);const a=document.getElementById("verify-container");a&&Fv(a);const c=document.getElementById("members-container");c&&Nu(c);const l=x().groups[x().activeGroupId??""],d=l?zn(l)==="online":!1,u=document.getElementById("beacon-container");u&&(d?(u.hidden=!1,Pu(u)):(tw(),u.hidden=!0,u.innerHTML=""));const f=document.getElementById("liveness-container");f&&(d?(f.hidden=!1,iw(f)):(f.hidden=!0,f.innerHTML=""));const h=document.getElementById("settings-container");h&&aw(h)}else if(e==="call-demo"){const o=document.getElementById("call-simulation-container");o&&Mr(o)}}function ww(){const{identity:e}=x(),t=e?.displayName&&e.displayName!=="You"?e.displayName:"";Oi(`
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
  `,r=>{const o=r.get("name")?.trim()??"";if(!o)return;const s=t||r.get("myname")?.trim()||"",a=document.querySelector(".segmented__btn.segmented__btn--active[data-preset]")?.dataset.preset??"family",c=_v(o,a,e?.pubkey);if(s&&e?.pubkey){const d=x().groups[c];d&&J(c,{memberNames:{...d.memberNames,[e.pubkey]:s}})}const l=x().groups[c];l&&zn(l)==="online"&&Xu(l).length>0&&Me(l.readRelays??[],l.writeRelays??[],c),hn(),ce(async()=>{const{shouldPromptForNotifications:d,subscribeToPush:u,registerWithPushServer:f}=await import("./push-Bmopmp70.js");return{shouldPromptForNotifications:d,subscribeToPush:u,registerWithPushServer:f}},[],import.meta.url).then(({shouldPromptForNotifications:d,subscribeToPush:u,registerWithPushServer:f})=>{d()&&setTimeout(()=>{confirm("Enable notifications? We'll alert you in emergencies and remind you to check in.")&&u().then(async h=>{if(!h)return;const{hashGroupTag:p}=await ce(async()=>{const{hashGroupTag:b}=await Promise.resolve().then(()=>Li);return{hashGroupTag:b}},void 0,import.meta.url),{groups:m}=x(),y=Object.values(m).map(b=>({tagHash:p(b.id),livenessInterval:b.livenessInterval}));await f(h,y),H("Notifications enabled","success")})},1e3)}).catch(()=>{})}),requestAnimationFrame(()=>{document.getElementById("modal-cancel-btn")?.addEventListener("click",()=>{document.getElementById("app-modal")?.close()}),document.querySelectorAll(".segmented__btn[data-preset]").forEach(r=>{r.addEventListener("click",()=>{document.querySelectorAll(".segmented__btn[data-preset]").forEach(o=>o.classList.remove("segmented__btn--active")),r.classList.add("segmented__btn--active")})})})}function oo(){const e=window.location.hash;if(e.startsWith("#ack/")){let t;try{t=decodeURIComponent(e.slice(5))}catch{console.warn("[canary] Malformed ack fragment — ignoring."),window.location.hash="";return}window.location.hash="",document.dispatchEvent(new CustomEvent("canary:confirm-member",{detail:{token:t}}))}else if(e.startsWith("#inv/")){const t=e.slice(5);window.location.hash="",Ew(t)}else if(e.startsWith("#j/")){const t=e.slice(3);window.location.hash="",/^[0-9a-f]{32}$/.test(t)?kw(t):H("Invalid invite link.","error")}else if(e.startsWith("#remote/")){let t=e.slice(8);try{t=decodeURIComponent(t)}catch{}window.location.hash="",_w(t)}}function Ew(e){try{const t=Kv(e),n=g0(t),{identity:r}=x();if(!r?.pubkey){H("No local identity — create or import one first.","error");return}let o=document.getElementById("binary-join-modal");o||(o=document.createElement("dialog"),o.id="binary-join-modal",o.className="modal",document.body.appendChild(o),o.addEventListener("click",i=>{i.target===o&&o.close()}));const s=o;s.innerHTML=`
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
    `,s.querySelector("#binary-join-cancel")?.addEventListener("click",()=>s.close()),s.querySelector("#binary-join-accept")?.addEventListener("click",()=>{const i=s.querySelector("#binary-join-confirm"),a=s.querySelector("#binary-join-error"),c=i?.value.trim()??"";if(!c){a&&(a.textContent="Please enter the confirmation words.",a.style.display="");return}try{const l=pu(n),d=s0(l,c);if(i0(d.groupId,d.nonce))throw new Error("This invite has already been used.");const u=d.groupId,{groups:f}=x(),h=Fu(f[u],{epoch:d.epoch,counter:d.counter,latestInviteIssuedAt:d.issuedAt});if(h)throw new Error(h);const p=new Set(d.members);p.add(r.pubkey);const m=x().settings,y=d.relays.length>0?d.relays:m.defaultWriteRelays?.length?[...m.defaultWriteRelays]:[Ge],b=Array.from(new Set([...m.defaultReadRelays?.length?m.defaultReadRelays:ot,...y])),E=y.length>0,T={id:u,name:d.groupName,seed:d.seed,members:Array.from(p),memberNames:d.memberNames??{},nostrEnabled:E,relays:d.relays,readRelays:b,writeRelays:y,wordlist:d.wordlist,wordCount:d.wordCount,counter:d.counter,usageOffset:d.usageOffset,rotationInterval:d.rotationInterval,encodingFormat:d.encodingFormat,usedInvites:[d.nonce],latestInviteIssuedAt:d.issuedAt,beaconInterval:d.beaconInterval,beaconPrecision:d.beaconPrecision,duressMode:"immediate",livenessInterval:d.rotationInterval,livenessCheckins:{},tolerance:d.tolerance,createdAt:Math.floor(Date.now()/1e3),admins:[...d.admins],epoch:d.epoch,consumedOps:[]},O={...f,[u]:T};te({groups:O,activeGroupId:u}),a0(u,d.nonce),xo(),hn(),E&&r&&Me(b,y,u).then(()=>{ke(u,{type:"member-join",pubkey:r.pubkey,displayName:r.displayName&&r.displayName!=="You"?r.displayName:void 0,timestamp:Math.floor(Date.now()/1e3),epoch:d.epoch,opId:crypto.randomUUID()})}),s.close(),H(`Joined ${d.groupName}`,"success")}catch(l){a&&(a.textContent=l instanceof Error?l.message:"Failed to join group.",a.style.display="")}}),s.showModal()}catch(t){H(t instanceof Error?t.message:"Invalid QR invite.","error")}}function Hs(e,t,n){const{identity:r}=x();if(!r?.pubkey||!r?.privkey)return;const o=Yv({envelope:e,joinerPrivkey:r.privkey,adminPubkey:t.adminPubkey,expectedInviteId:t.inviteId}),s=o.groupId,{groups:i}=x(),a=Fu(i[s],{epoch:o.epoch,counter:o.counter});if(a)throw new Error(a);const c=new Set(o.members);c.add(r.pubkey);const l={...o.memberNames??{}};r.displayName&&r.displayName!=="You"&&(l[r.pubkey]=r.displayName);const d=[...o.relays??[]],u=d.length>0?d:[Ge],f=Array.from(new Set([...ot,...u])),h=u.length>0,p={id:s,name:o.groupName,seed:o.seed,members:Array.from(c),memberNames:l,nostrEnabled:h,relays:d,readRelays:f,writeRelays:u,wordlist:o.wordlist,wordCount:o.wordCount,counter:o.counter,usageOffset:o.usageOffset,rotationInterval:o.rotationInterval,encodingFormat:o.encodingFormat,usedInvites:[],latestInviteIssuedAt:0,beaconInterval:o.beaconInterval,beaconPrecision:o.beaconPrecision,duressMode:"immediate",livenessInterval:o.rotationInterval,livenessCheckins:{},tolerance:o.tolerance,createdAt:Math.floor(Date.now()/1e3),admins:[...o.admins],epoch:o.epoch,consumedOps:[]},m={...i,[s]:p};te({groups:m,activeGroupId:s}),xo(),hn(),h&&r&&Me(f,u,s).then(()=>{ke(s,{type:"member-join",pubkey:r.pubkey,displayName:r.displayName&&r.displayName!=="You"?r.displayName:void 0,timestamp:Math.floor(Date.now()/1e3),epoch:o.epoch,opId:crypto.randomUUID()})}),n.close(),H(`Joined ${o.groupName}`,"success")}function kw(e){const{identity:t,settings:n}=x();if(!t?.pubkey||!t?.privkey){H("No local identity — create or import one first.","error");return}const r=Array.from(new Set([...ot,...n.defaultWriteRelays??[]])),o=n.defaultWriteRelays??[Ge];let s=document.getElementById("relay-join-modal");s||(s=document.createElement("dialog"),s.id="relay-join-modal",s.className="modal",document.body.appendChild(s),s.addEventListener("click",l=>{l.target===s&&s.close()}));const i=s;i.innerHTML=`
    <div class="modal__form invite-share">
      <h2 class="modal__title">Joining...</h2>
      <p class="invite-hint" id="relay-join-status">Looking for invite on relay...</p>
      <div class="modal__actions">
        <button class="btn" id="relay-join-cancel" type="button">Cancel</button>
      </div>
    </div>
  `;let a=()=>{},c=()=>{};i.querySelector("#relay-join-cancel")?.addEventListener("click",()=>{a(),c(),i.close()}),i.showModal(),Me(r,o).then(()=>{a=T0({inviteId:e,readRelays:r,onToken(l){try{vu(l)}catch(p){const m=i.querySelector("#relay-join-status");m&&(m.textContent=p instanceof Error?p.message:"Invalid invite token.",m.style.color="var(--duress)");return}const d=l.relays?.length?l.relays:o,u=d,f=Array.from(new Set([...ot,...d])),h=i.querySelector("#relay-join-status");h&&(h.textContent=`Joining ${l.groupName}...`),Me(f,u).then(()=>{c=Iu({inviteId:l.inviteId,adminPubkey:l.adminPubkey,readRelays:f,writeRelays:u,onWelcome(p){try{Hs(p,l,i)}catch{h&&(h.textContent="Failed to join — welcome message could not be decrypted.",h.style.color="var(--duress)")}},onError(p){h&&(h.textContent=p,h.style.color="var(--duress)")}})})},onError(l){const d=i.querySelector("#relay-join-status");d&&(d.textContent=l,d.style.color="var(--duress)")}})})}function _w(e){try{let t;try{t=mu(e)}catch{try{t=Mo(e)}catch{throw new Error("Invalid invite — could not decode token.")}}vu(t);const n=t,{identity:r,settings:o}=x();if(!r?.pubkey||!r?.privkey){H("No local identity — create or import one first.","error");return}const s=`${n.adminPubkey.slice(0,8)}…${n.adminPubkey.slice(-4)}`,i=n.relays?.length?n.relays:o.defaultWriteRelays,a=i,c=Array.from(new Set([...ot,...i])),l=Array.from(new Set([...c,...a]));let d=document.getElementById("remote-join-modal");d||(d=document.createElement("dialog"),d.id="remote-join-modal",d.className="modal",document.body.appendChild(d),d.addEventListener("click",h=>{h.target===d&&d.close()}));const u=d;let f=()=>{};u.innerHTML=`
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
    `,l.length>0&&Me(c,a).then(()=>{const h=u.querySelector("#remote-join-relay-status");h&&(h.textContent="Waiting for admin to send group key..."),f=Iu({inviteId:n.inviteId,adminPubkey:n.adminPubkey,readRelays:c,writeRelays:a,onWelcome(p){try{Hs(p,n,u)}catch{h&&(h.textContent="Auto-join failed — paste welcome message manually.",h.style.color="var(--duress)")}},onError(p){h&&(h.textContent=p,h.style.color="var(--duress)")}})}),u.querySelector("#remote-join-copy-pubkey")?.addEventListener("click",async h=>{const p=h.currentTarget;try{await navigator.clipboard.writeText(r.pubkey),p.textContent="Copied!",setTimeout(()=>{p.textContent="Copy"},1500)}catch{}}),u.querySelector("#remote-join-cancel")?.addEventListener("click",()=>{f(),u.close()}),u.querySelector("#remote-join-accept")?.addEventListener("click",async()=>{const h=u.querySelector("#remote-join-welcome-input"),p=u.querySelector("#remote-join-error"),m=(h?.value??"").replace(/[^A-Za-z0-9=+/]/g,"");if(!m){p&&(p.textContent="Please paste the welcome message.",p.style.display="");return}try{f(),Hs(m,n,u)}catch(y){p&&(p.textContent=y instanceof Error?y.message:"Failed to decrypt welcome message.",p.style.display="")}}),u.showModal()}catch(t){H(t instanceof Error?t.message:"Invalid remote invite.","error")}}function zu(){document.addEventListener("canary:create-group",()=>{ww()}),document.addEventListener("canary:show-invite",e=>{const{groupId:t}=e.detail,{groups:n}=x(),r=n[t];r&&Oo(r)}),document.addEventListener("canary:confirm-member",e=>{const{identity:t,groups:n,activeGroupId:r}=x();if(!r||!t?.pubkey)return;const o=n[r];if(!o||!o.admins.includes(t.pubkey))return;const s=e.detail?.token??"";ce(async()=>{const{showConfirmMemberModal:i}=await Promise.resolve().then(()=>D0);return{showConfirmMemberModal:i}},void 0,import.meta.url).then(({showConfirmMemberModal:i})=>{i(s)})}),document.addEventListener("canary:verify-call",e=>{const{groupId:t,pubkey:n}=e.detail;uw(t,n)}),document.addEventListener("canary:pin-enable",e=>{const t=e.detail?.pin;!t||t.length<6||Fg(t).then(()=>{te({settings:{...x().settings,pinEnabled:!0}}),Gu()})}),document.addEventListener("canary:pin-disable",()=>{Gg().then(()=>{te({settings:{...x().settings,pinEnabled:!1}}),Vu()})}),document.addEventListener("canary:lock",()=>{ko(),zi()}),document.addEventListener("canary:sync-message",e=>{const{groupId:t,message:n,sender:r}=e.detail,{activeGroupId:o}=x();if(n.type==="beacon"){if(t!==o)return;Q0(r,n.lat,n.lon,n.accuracy??2e4,n.timestamp)}else if(n.type==="duress-alert"){const s=n.subject||r,{identity:i}=x();if(i?.pubkey===s)return;fu(s,t,n.lat!=null?{lat:n.lat,lon:n.lon}:void 0,n.timestamp)}else n.type==="duress-clear"&&document.dispatchEvent(new CustomEvent("canary:duress-clear",{detail:{subject:n.subject,clearedBy:r,groupId:t}}))}),document.addEventListener("canary:resync",()=>{so()}),document.addEventListener("canary:vault-publish-now",()=>hn()),document.addEventListener("visibilitychange",()=>{if(document.hidden){hn();return}console.info("[canary:boot] App foregrounded — reconnecting and syncing vault"),dn(),ce(async()=>{const{disconnectRelays:e}=await Promise.resolve().then(()=>Jd);return{disconnectRelays:e}},void 0,import.meta.url).then(({disconnectRelays:e})=>{e(),so()})})}async function xw(){let{identity:e}=x();const t=await Ib({pubkey:e?.pubkey??"",privkey:e?.privkey}),n={pubkey:t.pubkey,privkey:t.privkey,displayName:e?.displayName??"You",signerType:"local"};(!e||e.pubkey!==n.pubkey)&&te({identity:qs(n,e)})}async function so(){const{groups:e,identity:t,settings:n}=x(),r=Object.keys(e).length,o=!!t?.privkey,s=[],i=[];for(const u of Object.values(e))s.push(...u.readRelays??[]),i.push(...u.writeRelays??[]),s.push(...u.relays??[]),i.push(...u.relays??[]);s.push(...n.defaultReadRelays??n.defaultRelays),i.push(...n.defaultWriteRelays??n.defaultRelays);const a=Se(s),c=Se(i),l=Se([...a,...c]).length;if(l===0){console.warn("[canary:boot] No relays found — sync disabled"),r>0&&H(`Sync disabled — ${r} group(s), no relays configured`,"warning",5e3);return}if(!o&&t?.signerType!=="nip07"){console.warn("[canary:boot] No privkey and no NIP-07 — sync disabled"),H("Sync disabled — no private key","warning",5e3);return}if(console.warn("[canary:boot] Read relays:",a,"Write relays:",c),o){await Me(a,c);try{const u=await yw(t.privkey,t.pubkey);if(u&&Object.keys(u).length>0){const{groups:f}=x(),h=gw(f,u),p=Object.keys(f).sort().join(","),m=Object.keys(h).sort().join(",");if(p!==m||Object.entries(h).some(([b,E])=>{const T=f[b];return T?E.epoch!==T.epoch||E.counter!==T.counter||E.usageOffset!==T.usageOffset||E.members.length!==T.members.length:!0})){te({groups:h});const b=Object.keys(h).length-Object.keys(f).length;b>0?H(`Restored ${b} group(s) from vault`,"success"):H("Synced from vault","success",1500)}}}catch(u){console.warn("[canary:vault] Vault fetch failed:",u)}nv(),H(`Syncing via ${l} relay(s)`,"success",2e3),typeof Notification<"u"&&Notification.permission==="granted"&&ce(()=>import("./push-Bmopmp70.js"),[],import.meta.url).then(async({getExistingSubscription:u,registerWithPushServer:f})=>{const h=await u();if(h){const{hashGroupTag:p}=await ce(async()=>{const{hashGroupTag:y}=await Promise.resolve().then(()=>Li);return{hashGroupTag:y}},void 0,import.meta.url),m=Object.values(e).map(y=>({tagHash:p(y.id),livenessInterval:y.livenessInterval}));await f(h,m)}}).catch(()=>{})}else{const{connectRelays:u}=await ce(async()=>{const{connectRelays:f}=await Promise.resolve().then(()=>Jd);return{connectRelays:f}},void 0,import.meta.url);u(a,c),H(`Connected to ${l} relay(s)`,"success",2e3)}const{fetchOwnProfile:d}=await ce(async()=>{const{fetchOwnProfile:u}=await Promise.resolve().then(()=>Lu);return{fetchOwnProfile:u}},void 0,import.meta.url);if(d(),Ji(),o){const{startLivenessHeartbeat:u}=await ce(async()=>{const{startLivenessHeartbeat:f}=await Promise.resolve().then(()=>Zb);return{startLivenessHeartbeat:f}},void 0,import.meta.url);u()}}function Sw(e){return Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}function Iw(e){const t=e.split(" ");let n=document.getElementById("recovery-phrase-modal");n||(n=document.createElement("dialog"),n.id="recovery-phrase-modal",n.className="modal",document.body.appendChild(n));const r=n;r.textContent="";const o=document.createElement("div");o.className="modal__form",o.style.maxWidth="420px";const s=document.createElement("h2");s.className="modal__title",s.textContent="Back up your recovery phrase",o.appendChild(s);const i=document.createElement("p");i.className="invite-hint",i.textContent="Write these words down in order. They're the only way to recover your account.",o.appendChild(i);const a=document.createElement("div");a.className="recovery-grid",a.style.cssText="display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin:1rem 0;",t.forEach((f,h)=>{const p=document.createElement("div");p.style.cssText="border:1px solid var(--border);border-radius:4px;padding:0.5rem;text-align:center;font-family:var(--font-mono,monospace);font-size:0.8rem;";const m=document.createElement("span");m.style.cssText="color:var(--text-muted);font-size:0.7rem;",m.textContent=`${h+1}. `;const y=document.createElement("span");y.style.fontWeight="500",y.textContent=f,p.append(m,y),a.appendChild(p)}),o.appendChild(a);const c=document.createElement("p");c.className="invite-hint",c.style.cssText="color:var(--duress);font-weight:500;",c.textContent="Do not share these words with anyone.",o.appendChild(c);const l=document.createElement("div");l.className="modal__actions",l.style.gap="0.5rem";const d=document.createElement("button");d.id="recovery-phrase-copy",d.className="btn btn--primary",d.type="button",d.textContent="Copy words",d.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(e),d.textContent="Copied!",setTimeout(()=>{d.textContent="Copy words"},2e3),setTimeout(()=>{navigator.clipboard.writeText("").catch(()=>{})},3e4)}catch{}});const u=document.createElement("button");u.id="recovery-phrase-skip",u.className="btn",u.type="button",u.textContent="Skip for now",u.addEventListener("click",()=>r.close()),l.append(d,u),o.appendChild(l),r.appendChild(o),r.showModal()}function Aw(){const e=document.getElementById("app");e.innerHTML=`
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
                ${(x().settings.defaultWriteRelays??x().settings.defaultRelays).map((r,o)=>`
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
              <p class="settings-hint" style="font-size: 0.7rem; margin: 0.5rem 0 0 0;">Read relays: ${ot.map(r=>j(r.replace("wss://",""))).join(", ")} + write relay(s)</p>
            </div>
          </details>
        </div>

      </div>
    </div>
  `,e.querySelector("#offline-form")?.addEventListener("submit",async r=>{r.preventDefault();const o=e.querySelector("#offline-name"),s=o?.value.trim();if(!s){o?.focus();return}const{generateMnemonic:i,mnemonicToKeypair:a}=await ce(async()=>{const{generateMnemonic:f,mnemonicToKeypair:h}=await Promise.resolve().then(()=>Sa);return{generateMnemonic:f,mnemonicToKeypair:h}},void 0,import.meta.url),c=i(),{pubkey:l,privkey:d}=a(c);te({identity:{pubkey:l,privkey:d,mnemonic:c,signerType:"local",displayName:s}}),await Mn();const{publishKind0:u}=await ce(async()=>{const{publishKind0:f}=await Promise.resolve().then(()=>Lu);return{publishKind0:f}},void 0,import.meta.url);u(s,d),Iw(c)}),e.querySelector("#mnemonic-login-form")?.addEventListener("submit",async r=>{r.preventDefault();const s=e.querySelector("#login-mnemonic")?.value.trim();if(!s)return;if(s.split(/\s+/).length!==12){alert("Recovery phrase must be exactly 12 words.");return}try{const{validateMnemonic:a,mnemonicToKeypair:c}=await ce(async()=>{const{validateMnemonic:u,mnemonicToKeypair:f}=await Promise.resolve().then(()=>Sa);return{validateMnemonic:u,mnemonicToKeypair:f}},void 0,import.meta.url);if(!a(s)){alert("Invalid recovery phrase. Please check your words and try again.");return}const{pubkey:l,privkey:d}=c(s);te({identity:{pubkey:l,privkey:d,mnemonic:s,signerType:"local",displayName:"You"}}),await Mn()}catch{alert("Invalid recovery phrase.")}}),e.querySelector("#nsec-login-form")?.addEventListener("submit",async r=>{r.preventDefault();const s=e.querySelector("#login-nsec")?.value.trim();if(s)try{const i=x().identity,a=tu(s);if(a.type!=="nsec"){alert("Not a valid nsec.");return}const c=a.data,l=Sw(c),d=Co(c);te({identity:qs({pubkey:d,privkey:l,signerType:"local",displayName:"You"},i)}),await Mn()}catch(i){alert(i instanceof Error?i.message:"Invalid nsec format.")}}),e.querySelector("#login-nip07")?.addEventListener("click",async()=>{if(!qd()){alert("No Nostr extension found. Install Alby, nos2x, or another NIP-07 extension and reload.");return}try{const r=x().identity,o=await window.nostr.getPublicKey();te({identity:qs({pubkey:o,signerType:"nip07",displayName:"You"},r)}),await Mn()}catch{alert("Extension rejected the request.")}});function t(){const r=e.querySelector("#login-relay-list");if(!r)return;const o=x().settings.defaultWriteRelays??x().settings.defaultRelays;r.innerHTML=o.map((s,i)=>`
      <li style="display: flex; align-items: center; gap: 0.25rem; margin-bottom: 0.25rem;">
        <span class="settings-hint" style="flex: 1; font-size: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0;">${j(s)}</span>
        <button class="btn btn--ghost btn--sm login-relay-remove" data-relay-index="${i}" type="button" style="padding: 0 0.25rem; font-size: 0.7rem;">✕</button>
      </li>
    `).join(""),n()}function n(){e.querySelectorAll(".login-relay-remove").forEach(r=>{r.addEventListener("click",()=>{const o=Number(r.dataset.relayIndex),s=[...x().settings.defaultWriteRelays??x().settings.defaultRelays];s.splice(o,1),te({settings:{...x().settings,defaultWriteRelays:s,defaultRelays:s}}),t()})})}n(),e.querySelector("#login-relay-add")?.addEventListener("click",()=>{const r=e.querySelector("#login-relay-input"),o=r?.value.trim();if(!o||!bw(o))return;const s=[...x().settings.defaultWriteRelays??x().settings.defaultRelays];s.includes(o)||(s.push(o),te({settings:{...x().settings,defaultWriteRelays:s,defaultRelays:s}}),t()),r&&(r.value="")}),e.querySelector("#login-relay-input")?.addEventListener("keydown",r=>{r.key==="Enter"&&(r.preventDefault(),e.querySelector("#login-relay-add")?.click())})}async function Mn(){Ku(),window.location.hash==="#call"&&te({view:"call-demo"});const e=document.getElementById("header");e&&$i(e),Wu(),Yi(),Or(Ji),Or(Cw),zu(),oo(),window.addEventListener("hashchange",()=>oo()),so()}let on=null;const Rw=3e4;function Cw(){const{identity:e,groups:t}=x();!e?.privkey||!e?.pubkey||Object.keys(t).length!==0&&(on&&clearTimeout(on),on=setTimeout(()=>{const{identity:n,groups:r}=x();n?.privkey&&n?.pubkey&&Object.keys(r).length>0&&Hu(r,n.privkey,n.pubkey)},Rw))}function hn(){on&&clearTimeout(on);const{identity:e,groups:t}=x();e?.privkey&&e?.pubkey&&Object.keys(t).length>0&&Hu(t,e.privkey,e.pubkey).then(()=>console.info("[canary:vault] Vault published OK")).catch(n=>{console.error("[canary:vault] Vault publish FAILED:",n),H(`Vault publish failed: ${n instanceof Error?n.message:n}`,"error")})}window.addEventListener("pagehide",()=>{on&&hn()});async function pc(){if(vd())zi();else{jg();const{identity:e}=x();e?.pubkey?await Mn():Aw()}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{pc()}):pc();
