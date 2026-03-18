const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./maplibre-gl-DwUhsmFz.css"])))=>i.map(i=>d[i]);
(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();const nf="modulepreload",rf=function(e,t){return new URL(e,t).href},ca={},ie=function(t,n,r){let o=Promise.resolve();if(n&&n.length>0){let l=function(u){return Promise.all(u.map(d=>Promise.resolve(d).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};const i=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),c=a?.nonce||a?.getAttribute("nonce");o=l(n.map(u=>{if(u=rf(u,r),u in ca)return;ca[u]=!0;const d=u.endsWith(".css"),f=d?'[rel="stylesheet"]':"";if(r)for(let h=i.length-1;h>=0;h--){const m=i[h];if(m.href===u&&(!d||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${f}`))return;const p=document.createElement("link");if(p.rel=d?"stylesheet":nf,d||(p.as="script"),p.crossOrigin="",p.href=u,c&&p.setAttribute("nonce",c),document.head.appendChild(p),d)return new Promise((h,m)=>{p.addEventListener("load",h),p.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${u}`)))})}))}function s(i){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=i,window.dispatchEvent(a),!a.defaultPrevented)throw i}return o.then(i=>{for(const a of i||[])a.status==="rejected"&&s(a.reason);return t().catch(s)})},ot=["wss://relay.damus.io","wss://nos.lol","wss://relay.nostr.band"],Ge="wss://relay.trotters.cc";function Zn(e){return e.readRelays?.length>0||e.writeRelays?.length>0||e.relays?.length>0?"online":"offline"}function of(e){try{const t=new URL(e);return t.pathname=t.pathname.replace(/\/+$/,""),t.toString()}catch{return e.replace(/\/+$/,"")}}function Se(e){const t=new Set,n=[];for(const r of e){const o=of(r);t.has(o)||(t.add(o),n.push(o))}return n}function sf(e){return Se([...e.readRelays??[],...e.writeRelays??[],...e.relays??[]])}const af={view:"groups",groups:{},activeGroupId:null,identity:null,settings:{theme:"dark",pinEnabled:!1,autoLockMinutes:5,defaultRelays:[Ge],defaultReadRelays:[...ot,Ge],defaultWriteRelays:[Ge]}};let He=structuredClone(af);const fs=new Set;function lo(){for(const e of fs)try{e()}catch(t){console.error("[canary:state] subscriber threw:",t)}}function _(){return He}function X(e){He={...He,...e},lo()}function J(e,t){const n=He.groups[e];if(!n){console.warn(`[canary:state] updateGroup: unknown group id "${e}"`);return}He={...He,groups:{...He.groups,[e]:{...n,...t}}},lo()}function Ur(e){return fs.add(e),()=>{fs.delete(e)}}function _c(e){He=e,lo()}function cf(){const e={...He};e.identity&&(e.identity={...e.identity,privkey:"",mnemonic:void 0,nsec:void 0});const t={};for(const[n,r]of Object.entries(e.groups))t[n]={...r,seed:""};e.groups=t,He=e,lo()}const lf=6e5,uf=16,ps=12;async function xc(e,t){const n=await crypto.subtle.importKey("raw",new TextEncoder().encode(e),"PBKDF2",!1,["deriveKey"]);return crypto.subtle.deriveKey({name:"PBKDF2",salt:t,iterations:lf,hash:"SHA-256"},n,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}async function Sc(e,t){const n=crypto.getRandomValues(new Uint8Array(ps)),r=await crypto.subtle.encrypt({name:"AES-GCM",iv:n},t,new TextEncoder().encode(e)),o=new Uint8Array(n.length+new Uint8Array(r).length);o.set(n),o.set(new Uint8Array(r),n.length);let s="";for(let i=0;i<o.length;i++)s+=String.fromCharCode(o[i]);return btoa(s)}async function uo(e,t){const n=Uint8Array.from(atob(e),i=>i.charCodeAt(0)),r=n.slice(0,ps),o=n.slice(ps),s=await crypto.subtle.decrypt({name:"AES-GCM",iv:r},t,o);return new TextDecoder().decode(s)}function df(){return crypto.getRandomValues(new Uint8Array(uf))}function ff(e){return btoa(String.fromCharCode(...e))}function Ic(e){return Uint8Array.from(atob(e),t=>t.charCodeAt(0))}function zs(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array"}function Re(e,t=""){if(!Number.isSafeInteger(e)||e<0){const n=t&&`"${t}" `;throw new Error(`${n}expected integer >= 0, got ${e}`)}}function G(e,t,n=""){const r=zs(e),o=e?.length,s=t!==void 0;if(!r||s&&o!==t){const i=n&&`"${n}" `,a=s?` of length ${t}`:"",c=r?`length=${o}`:`type=${typeof e}`;throw new Error(i+"expected Uint8Array"+a+", got "+c)}return e}function Xn(e){if(typeof e!="function"||typeof e.create!="function")throw new Error("Hash must wrapped by utils.createHasher");Re(e.outputLen),Re(e.blockLen)}function Dr(e,t=!0){if(e.destroyed)throw new Error("Hash instance has been destroyed");if(t&&e.finished)throw new Error("Hash#digest() has already been called")}function pf(e,t){G(e,void 0,"digestInto() output");const n=t.outputLen;if(e.length<n)throw new Error('"digestInto() output" expected to be of length >='+n)}function Ve(...e){for(let t=0;t<e.length;t++)e[t].fill(0)}function Ot(e){return new DataView(e.buffer,e.byteOffset,e.byteLength)}function Be(e,t){return e<<32-t|e>>>t}function ir(e,t){return e<<t|e>>>32-t>>>0}const Rc=typeof Uint8Array.from([]).toHex=="function"&&typeof Uint8Array.fromHex=="function",hf=Array.from({length:256},(e,t)=>t.toString(16).padStart(2,"0"));function H(e){if(G(e),Rc)return e.toHex();let t="";for(let n=0;n<e.length;n++)t+=hf[e[n]];return t}const Ye={_0:48,_9:57,A:65,F:70,a:97,f:102};function la(e){if(e>=Ye._0&&e<=Ye._9)return e-Ye._0;if(e>=Ye.A&&e<=Ye.F)return e-(Ye.A-10);if(e>=Ye.a&&e<=Ye.f)return e-(Ye.a-10)}function z(e){if(typeof e!="string")throw new Error("hex string expected, got "+typeof e);if(Rc)return Uint8Array.fromHex(e);const t=e.length,n=t/2;if(t%2)throw new Error("hex string expected, got unpadded hex of length "+t);const r=new Uint8Array(n);for(let o=0,s=0;o<n;o++,s+=2){const i=la(e.charCodeAt(s)),a=la(e.charCodeAt(s+1));if(i===void 0||a===void 0){const c=e[s]+e[s+1];throw new Error('hex string expected, got non-hex character "'+c+'" at index '+s)}r[o]=i*16+a}return r}function mf(e){if(typeof e!="string")throw new Error("string expected");return new Uint8Array(new TextEncoder().encode(e))}function ua(e,t=""){return typeof e=="string"?mf(e):G(e,void 0,t)}function oe(...e){let t=0;for(let r=0;r<e.length;r++){const o=e[r];G(o),t+=o.length}const n=new Uint8Array(t);for(let r=0,o=0;r<e.length;r++){const s=e[r];n.set(s,o),o+=s.length}return n}function yf(e,t){if(t!==void 0&&{}.toString.call(t)!=="[object Object]")throw new Error("options must be object or undefined");return Object.assign(e,t)}function Js(e,t={}){const n=(o,s)=>e(s).update(o).digest(),r=e(void 0);return n.outputLen=r.outputLen,n.blockLen=r.blockLen,n.create=o=>e(o),Object.assign(n,t),Object.freeze(n)}function Et(e=32){const t=typeof globalThis=="object"?globalThis.crypto:null;if(typeof t?.getRandomValues!="function")throw new Error("crypto.getRandomValues must be defined");return t.getRandomValues(new Uint8Array(e))}const Ac=e=>({oid:Uint8Array.from([6,9,96,134,72,1,101,3,4,2,e])});class Cc{oHash;iHash;blockLen;outputLen;finished=!1;destroyed=!1;constructor(t,n){if(Xn(t),G(n,void 0,"key"),this.iHash=t.create(),typeof this.iHash.update!="function")throw new Error("Expected instance of class which extends utils.Hash");this.blockLen=this.iHash.blockLen,this.outputLen=this.iHash.outputLen;const r=this.blockLen,o=new Uint8Array(r);o.set(n.length>r?t.create().update(n).digest():n);for(let s=0;s<o.length;s++)o[s]^=54;this.iHash.update(o),this.oHash=t.create();for(let s=0;s<o.length;s++)o[s]^=106;this.oHash.update(o),Ve(o)}update(t){return Dr(this),this.iHash.update(t),this}digestInto(t){Dr(this),G(t,this.outputLen,"output"),this.finished=!0,this.iHash.digestInto(t),this.oHash.update(t),this.oHash.digestInto(t),this.destroy()}digest(){const t=new Uint8Array(this.oHash.outputLen);return this.digestInto(t),t}_cloneInto(t){t||=Object.create(Object.getPrototypeOf(this),{});const{oHash:n,iHash:r,finished:o,destroyed:s,blockLen:i,outputLen:a}=this;return t=t,t.finished=o,t.destroyed=s,t.blockLen=i,t.outputLen=a,t.oHash=n._cloneInto(t.oHash),t.iHash=r._cloneInto(t.iHash),t}clone(){return this._cloneInto()}destroy(){this.destroyed=!0,this.oHash.destroy(),this.iHash.destroy()}}const st=(e,t,n)=>new Cc(e,t).update(n).digest();st.create=(e,t)=>new Cc(e,t);function gf(e,t,n,r){Xn(e);const o=yf({dkLen:32,asyncTick:10},r),{c:s,dkLen:i,asyncTick:a}=o;if(Re(s,"c"),Re(i,"dkLen"),Re(a,"asyncTick"),s<1)throw new Error("iterations (c) must be >= 1");const c=ua(t,"password"),l=ua(n,"salt"),u=new Uint8Array(i),d=st.create(e,c),f=d._cloneInto().update(l);return{c:s,dkLen:i,asyncTick:a,DK:u,PRF:d,PRFSalt:f}}function bf(e,t,n,r,o){return e.destroy(),t.destroy(),r&&r.destroy(),Ve(o),n}function vf(e,t,n,r){const{c:o,dkLen:s,DK:i,PRF:a,PRFSalt:c}=gf(e,t,n,r);let l;const u=new Uint8Array(4),d=Ot(u),f=new Uint8Array(a.outputLen);for(let p=1,h=0;h<s;p++,h+=a.outputLen){const m=i.subarray(h,h+a.outputLen);d.setInt32(0,p,!1),(l=c._cloneInto(l)).update(u).digestInto(f),m.set(f.subarray(0,m.length));for(let y=1;y<o;y++){a._cloneInto(l).update(f).digestInto(f);for(let g=0;g<m.length;g++)m[g]^=f[g]}}return bf(a,c,i,l,f)}function wf(e,t,n){return e&t^~e&n}function Ef(e,t,n){return e&t^e&n^t&n}class Ys{blockLen;outputLen;padOffset;isLE;buffer;view;finished=!1;length=0;pos=0;destroyed=!1;constructor(t,n,r,o){this.blockLen=t,this.outputLen=n,this.padOffset=r,this.isLE=o,this.buffer=new Uint8Array(t),this.view=Ot(this.buffer)}update(t){Dr(this),G(t);const{view:n,buffer:r,blockLen:o}=this,s=t.length;for(let i=0;i<s;){const a=Math.min(o-this.pos,s-i);if(a===o){const c=Ot(t);for(;o<=s-i;i+=o)this.process(c,i);continue}r.set(t.subarray(i,i+a),this.pos),this.pos+=a,i+=a,this.pos===o&&(this.process(n,0),this.pos=0)}return this.length+=t.length,this.roundClean(),this}digestInto(t){Dr(this),pf(t,this),this.finished=!0;const{buffer:n,view:r,blockLen:o,isLE:s}=this;let{pos:i}=this;n[i++]=128,Ve(this.buffer.subarray(i)),this.padOffset>o-i&&(this.process(r,0),i=0);for(let d=i;d<o;d++)n[d]=0;r.setBigUint64(o-8,BigInt(this.length*8),s),this.process(r,0);const a=Ot(t),c=this.outputLen;if(c%4)throw new Error("_sha2: outputLen must be aligned to 32bit");const l=c/4,u=this.get();if(l>u.length)throw new Error("_sha2: outputLen bigger than state");for(let d=0;d<l;d++)a.setUint32(4*d,u[d],s)}digest(){const{buffer:t,outputLen:n}=this;this.digestInto(t);const r=t.slice(0,n);return this.destroy(),r}_cloneInto(t){t||=new this.constructor,t.set(...this.get());const{blockLen:n,buffer:r,length:o,finished:s,destroyed:i,pos:a}=this;return t.destroyed=i,t.finished=s,t.length=o,t.pos=a,o%n&&t.buffer.set(r),t}clone(){return this._cloneInto()}}const lt=Uint32Array.from([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),fe=Uint32Array.from([1779033703,4089235720,3144134277,2227873595,1013904242,4271175723,2773480762,1595750129,1359893119,2917565137,2600822924,725511199,528734635,4215389547,1541459225,327033209]),ar=BigInt(2**32-1),da=BigInt(32);function kf(e,t=!1){return t?{h:Number(e&ar),l:Number(e>>da&ar)}:{h:Number(e>>da&ar)|0,l:Number(e&ar)|0}}function _f(e,t=!1){const n=e.length;let r=new Uint32Array(n),o=new Uint32Array(n);for(let s=0;s<n;s++){const{h:i,l:a}=kf(e[s],t);[r[s],o[s]]=[i,a]}return[r,o]}const fa=(e,t,n)=>e>>>n,pa=(e,t,n)=>e<<32-n|t>>>n,Gt=(e,t,n)=>e>>>n|t<<32-n,Vt=(e,t,n)=>e<<32-n|t>>>n,cr=(e,t,n)=>e<<64-n|t>>>n-32,lr=(e,t,n)=>e>>>n-32|t<<64-n;function Ze(e,t,n,r){const o=(t>>>0)+(r>>>0);return{h:e+n+(o/2**32|0)|0,l:o|0}}const xf=(e,t,n)=>(e>>>0)+(t>>>0)+(n>>>0),Sf=(e,t,n,r)=>t+n+r+(e/2**32|0)|0,If=(e,t,n,r)=>(e>>>0)+(t>>>0)+(n>>>0)+(r>>>0),Rf=(e,t,n,r,o)=>t+n+r+o+(e/2**32|0)|0,Af=(e,t,n,r,o)=>(e>>>0)+(t>>>0)+(n>>>0)+(r>>>0)+(o>>>0),Cf=(e,t,n,r,o,s)=>t+n+r+o+s+(e/2**32|0)|0,Tf=Uint32Array.from([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),ut=new Uint32Array(64);class Nf extends Ys{constructor(t){super(64,t,8,!1)}get(){const{A:t,B:n,C:r,D:o,E:s,F:i,G:a,H:c}=this;return[t,n,r,o,s,i,a,c]}set(t,n,r,o,s,i,a,c){this.A=t|0,this.B=n|0,this.C=r|0,this.D=o|0,this.E=s|0,this.F=i|0,this.G=a|0,this.H=c|0}process(t,n){for(let d=0;d<16;d++,n+=4)ut[d]=t.getUint32(n,!1);for(let d=16;d<64;d++){const f=ut[d-15],p=ut[d-2],h=Be(f,7)^Be(f,18)^f>>>3,m=Be(p,17)^Be(p,19)^p>>>10;ut[d]=m+ut[d-7]+h+ut[d-16]|0}let{A:r,B:o,C:s,D:i,E:a,F:c,G:l,H:u}=this;for(let d=0;d<64;d++){const f=Be(a,6)^Be(a,11)^Be(a,25),p=u+f+wf(a,c,l)+Tf[d]+ut[d]|0,m=(Be(r,2)^Be(r,13)^Be(r,22))+Ef(r,o,s)|0;u=l,l=c,c=a,a=i+p|0,i=s,s=o,o=r,r=p+m|0}r=r+this.A|0,o=o+this.B|0,s=s+this.C|0,i=i+this.D|0,a=a+this.E|0,c=c+this.F|0,l=l+this.G|0,u=u+this.H|0,this.set(r,o,s,i,a,c,l,u)}roundClean(){Ve(ut)}destroy(){this.set(0,0,0,0,0,0,0,0),Ve(this.buffer)}}class Lf extends Nf{A=lt[0]|0;B=lt[1]|0;C=lt[2]|0;D=lt[3]|0;E=lt[4]|0;F=lt[5]|0;G=lt[6]|0;H=lt[7]|0;constructor(){super(32)}}const Tc=_f(["0x428a2f98d728ae22","0x7137449123ef65cd","0xb5c0fbcfec4d3b2f","0xe9b5dba58189dbbc","0x3956c25bf348b538","0x59f111f1b605d019","0x923f82a4af194f9b","0xab1c5ed5da6d8118","0xd807aa98a3030242","0x12835b0145706fbe","0x243185be4ee4b28c","0x550c7dc3d5ffb4e2","0x72be5d74f27b896f","0x80deb1fe3b1696b1","0x9bdc06a725c71235","0xc19bf174cf692694","0xe49b69c19ef14ad2","0xefbe4786384f25e3","0x0fc19dc68b8cd5b5","0x240ca1cc77ac9c65","0x2de92c6f592b0275","0x4a7484aa6ea6e483","0x5cb0a9dcbd41fbd4","0x76f988da831153b5","0x983e5152ee66dfab","0xa831c66d2db43210","0xb00327c898fb213f","0xbf597fc7beef0ee4","0xc6e00bf33da88fc2","0xd5a79147930aa725","0x06ca6351e003826f","0x142929670a0e6e70","0x27b70a8546d22ffc","0x2e1b21385c26c926","0x4d2c6dfc5ac42aed","0x53380d139d95b3df","0x650a73548baf63de","0x766a0abb3c77b2a8","0x81c2c92e47edaee6","0x92722c851482353b","0xa2bfe8a14cf10364","0xa81a664bbc423001","0xc24b8b70d0f89791","0xc76c51a30654be30","0xd192e819d6ef5218","0xd69906245565a910","0xf40e35855771202a","0x106aa07032bbd1b8","0x19a4c116b8d2d0c8","0x1e376c085141ab53","0x2748774cdf8eeb99","0x34b0bcb5e19b48a8","0x391c0cb3c5c95a63","0x4ed8aa4ae3418acb","0x5b9cca4f7763e373","0x682e6ff3d6b2b8a3","0x748f82ee5defb2fc","0x78a5636f43172f60","0x84c87814a1f0ab72","0x8cc702081a6439ec","0x90befffa23631e28","0xa4506cebde82bde9","0xbef9a3f7b2c67915","0xc67178f2e372532b","0xca273eceea26619c","0xd186b8c721c0c207","0xeada7dd6cde0eb1e","0xf57d4f7fee6ed178","0x06f067aa72176fba","0x0a637dc5a2c898a6","0x113f9804bef90dae","0x1b710b35131c471b","0x28db77f523047d84","0x32caab7b40c72493","0x3c9ebe0a15c9bebc","0x431d67c49c100d4c","0x4cc5d4becb3e42b6","0x597f299cfc657e2a","0x5fcb6fab3ad6faec","0x6c44198c4a475817"].map(e=>BigInt(e))),$f=Tc[0],Of=Tc[1],dt=new Uint32Array(80),ft=new Uint32Array(80);class Mf extends Ys{constructor(t){super(128,t,16,!1)}get(){const{Ah:t,Al:n,Bh:r,Bl:o,Ch:s,Cl:i,Dh:a,Dl:c,Eh:l,El:u,Fh:d,Fl:f,Gh:p,Gl:h,Hh:m,Hl:y}=this;return[t,n,r,o,s,i,a,c,l,u,d,f,p,h,m,y]}set(t,n,r,o,s,i,a,c,l,u,d,f,p,h,m,y){this.Ah=t|0,this.Al=n|0,this.Bh=r|0,this.Bl=o|0,this.Ch=s|0,this.Cl=i|0,this.Dh=a|0,this.Dl=c|0,this.Eh=l|0,this.El=u|0,this.Fh=d|0,this.Fl=f|0,this.Gh=p|0,this.Gl=h|0,this.Hh=m|0,this.Hl=y|0}process(t,n){for(let C=0;C<16;C++,n+=4)dt[C]=t.getUint32(n),ft[C]=t.getUint32(n+=4);for(let C=16;C<80;C++){const $=dt[C-15]|0,L=ft[C-15]|0,O=Gt($,L,1)^Gt($,L,8)^fa($,L,7),w=Vt($,L,1)^Vt($,L,8)^pa($,L,7),v=dt[C-2]|0,b=ft[C-2]|0,x=Gt(v,b,19)^cr(v,b,61)^fa(v,b,6),S=Vt(v,b,19)^lr(v,b,61)^pa(v,b,6),A=If(w,S,ft[C-7],ft[C-16]),k=Rf(A,O,x,dt[C-7],dt[C-16]);dt[C]=k|0,ft[C]=A|0}let{Ah:r,Al:o,Bh:s,Bl:i,Ch:a,Cl:c,Dh:l,Dl:u,Eh:d,El:f,Fh:p,Fl:h,Gh:m,Gl:y,Hh:g,Hl:E}=this;for(let C=0;C<80;C++){const $=Gt(d,f,14)^Gt(d,f,18)^cr(d,f,41),L=Vt(d,f,14)^Vt(d,f,18)^lr(d,f,41),O=d&p^~d&m,w=f&h^~f&y,v=Af(E,L,w,Of[C],ft[C]),b=Cf(v,g,$,O,$f[C],dt[C]),x=v|0,S=Gt(r,o,28)^cr(r,o,34)^cr(r,o,39),A=Vt(r,o,28)^lr(r,o,34)^lr(r,o,39),k=r&s^r&a^s&a,R=o&i^o&c^i&c;g=m|0,E=y|0,m=p|0,y=h|0,p=d|0,h=f|0,{h:d,l:f}=Ze(l|0,u|0,b|0,x|0),l=a|0,u=c|0,a=s|0,c=i|0,s=r|0,i=o|0;const I=xf(x,A,R);r=Sf(I,b,S,k),o=I|0}({h:r,l:o}=Ze(this.Ah|0,this.Al|0,r|0,o|0)),{h:s,l:i}=Ze(this.Bh|0,this.Bl|0,s|0,i|0),{h:a,l:c}=Ze(this.Ch|0,this.Cl|0,a|0,c|0),{h:l,l:u}=Ze(this.Dh|0,this.Dl|0,l|0,u|0),{h:d,l:f}=Ze(this.Eh|0,this.El|0,d|0,f|0),{h:p,l:h}=Ze(this.Fh|0,this.Fl|0,p|0,h|0),{h:m,l:y}=Ze(this.Gh|0,this.Gl|0,m|0,y|0),{h:g,l:E}=Ze(this.Hh|0,this.Hl|0,g|0,E|0),this.set(r,o,s,i,a,c,l,u,d,f,p,h,m,y,g,E)}roundClean(){Ve(dt,ft)}destroy(){Ve(this.buffer),this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)}}class Bf extends Mf{Ah=fe[0]|0;Al=fe[1]|0;Bh=fe[2]|0;Bl=fe[3]|0;Ch=fe[4]|0;Cl=fe[5]|0;Dh=fe[6]|0;Dl=fe[7]|0;Eh=fe[8]|0;El=fe[9]|0;Fh=fe[10]|0;Fl=fe[11]|0;Gh=fe[12]|0;Gl=fe[13]|0;Hh=fe[14]|0;Hl=fe[15]|0;constructor(){super(64)}}const ce=Js(()=>new Lf,Ac(1)),hs=Js(()=>new Bf,Ac(3));function sn(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array"}function Pf(e){if(!sn(e))throw new Error("Uint8Array expected")}function Nc(e,t){return Array.isArray(t)?t.length===0?!0:e?t.every(n=>typeof n=="string"):t.every(n=>Number.isSafeInteger(n)):!1}function Lc(e){if(typeof e!="function")throw new Error("function expected");return!0}function Pt(e,t){if(typeof t!="string")throw new Error(`${e}: string expected`);return!0}function hn(e){if(!Number.isSafeInteger(e))throw new Error(`invalid integer: ${e}`)}function jr(e){if(!Array.isArray(e))throw new Error("array expected")}function qr(e,t){if(!Nc(!0,t))throw new Error(`${e}: array of strings expected`)}function Zs(e,t){if(!Nc(!1,t))throw new Error(`${e}: array of numbers expected`)}function Qn(...e){const t=s=>s,n=(s,i)=>a=>s(i(a)),r=e.map(s=>s.encode).reduceRight(n,t),o=e.map(s=>s.decode).reduce(n,t);return{encode:r,decode:o}}function fo(e){const t=typeof e=="string"?e.split(""):e,n=t.length;qr("alphabet",t);const r=new Map(t.map((o,s)=>[o,s]));return{encode:o=>(jr(o),o.map(s=>{if(!Number.isSafeInteger(s)||s<0||s>=n)throw new Error(`alphabet.encode: digit index outside alphabet "${s}". Allowed: ${e}`);return t[s]})),decode:o=>(jr(o),o.map(s=>{Pt("alphabet.decode",s);const i=r.get(s);if(i===void 0)throw new Error(`Unknown letter: "${s}". Allowed: ${e}`);return i}))}}function po(e=""){return Pt("join",e),{encode:t=>(qr("join.decode",t),t.join(e)),decode:t=>(Pt("join.decode",t),t.split(e))}}function $c(e,t="="){return hn(e),Pt("padding",t),{encode(n){for(qr("padding.encode",n);n.length*e%8;)n.push(t);return n},decode(n){qr("padding.decode",n);let r=n.length;if(r*e%8)throw new Error("padding: invalid, string should have whole number of bytes");for(;r>0&&n[r-1]===t;r--)if((r-1)*e%8===0)throw new Error("padding: invalid, string has too much padding");return n.slice(0,r)}}}function ms(e,t,n){if(t<2)throw new Error(`convertRadix: invalid from=${t}, base cannot be less than 2`);if(n<2)throw new Error(`convertRadix: invalid to=${n}, base cannot be less than 2`);if(jr(e),!e.length)return[];let r=0;const o=[],s=Array.from(e,a=>{if(hn(a),a<0||a>=t)throw new Error(`invalid integer: ${a}`);return a}),i=s.length;for(;;){let a=0,c=!0;for(let l=r;l<i;l++){const u=s[l],d=t*a,f=d+u;if(!Number.isSafeInteger(f)||d/t!==a||f-u!==d)throw new Error("convertRadix: carry overflow");const p=f/n;a=f%n;const h=Math.floor(p);if(s[l]=h,!Number.isSafeInteger(h)||h*n+a!==f)throw new Error("convertRadix: carry overflow");if(c)h?c=!1:r=l;else continue}if(o.push(a),c)break}for(let a=0;a<e.length-1&&e[a]===0;a++)o.push(0);return o.reverse()}const Oc=(e,t)=>t===0?e:Oc(t,e%t),Hr=(e,t)=>e+(t-Oc(e,t)),Ir=(()=>{let e=[];for(let t=0;t<40;t++)e.push(2**t);return e})();function Fr(e,t,n,r){if(jr(e),t<=0||t>32)throw new Error(`convertRadix2: wrong from=${t}`);if(n<=0||n>32)throw new Error(`convertRadix2: wrong to=${n}`);if(Hr(t,n)>32)throw new Error(`convertRadix2: carry overflow from=${t} to=${n} carryBits=${Hr(t,n)}`);let o=0,s=0;const i=Ir[t],a=Ir[n]-1,c=[];for(const l of e){if(hn(l),l>=i)throw new Error(`convertRadix2: invalid data word=${l} from=${t}`);if(o=o<<t|l,s+t>32)throw new Error(`convertRadix2: carry overflow pos=${s} from=${t}`);for(s+=t;s>=n;s-=n)c.push((o>>s-n&a)>>>0);const u=Ir[s];if(u===void 0)throw new Error("invalid carry");o&=u-1}if(o=o<<n-s&a,!r&&s>=t)throw new Error("Excess padding");if(!r&&o>0)throw new Error(`Non-zero padding: ${o}`);return r&&s>0&&c.push(o>>>0),c}function Mc(e){hn(e);const t=2**8;return{encode:n=>{if(!sn(n))throw new Error("radix.encode input should be Uint8Array");return ms(Array.from(n),t,e)},decode:n=>(Zs("radix.decode",n),Uint8Array.from(ms(n,e,t)))}}function Xs(e,t=!1){if(hn(e),e<=0||e>32)throw new Error("radix2: bits should be in (0..32]");if(Hr(8,e)>32||Hr(e,8)>32)throw new Error("radix2: carry overflow");return{encode:n=>{if(!sn(n))throw new Error("radix2.encode input should be Uint8Array");return Fr(Array.from(n),8,e,!t)},decode:n=>(Zs("radix2.decode",n),Uint8Array.from(Fr(n,e,8,t)))}}function ha(e){return Lc(e),function(...t){try{return e.apply(null,t)}catch{}}}function Bc(e,t){return hn(e),Lc(t),{encode(n){if(!sn(n))throw new Error("checksum.encode: input should be Uint8Array");const r=t(n).slice(0,e),o=new Uint8Array(n.length+e);return o.set(n),o.set(r,n.length),o},decode(n){if(!sn(n))throw new Error("checksum.decode: input should be Uint8Array");const r=n.slice(0,-e),o=n.slice(-e),s=t(r).slice(0,e);for(let i=0;i<e;i++)if(s[i]!==o[i])throw new Error("Invalid checksum");return r}}}const ur={alphabet:fo,chain:Qn,checksum:Bc,convertRadix:ms,convertRadix2:Fr,radix:Mc,radix2:Xs,join:po,padding:$c},Uf=typeof Uint8Array.from([]).toBase64=="function"&&typeof Uint8Array.fromBase64=="function",Df=(e,t)=>{Pt("base64",e);const n=/^[A-Za-z0-9=+/]+$/,r="base64";if(e.length>0&&!n.test(e))throw new Error("invalid base64");return Uint8Array.fromBase64(e,{alphabet:r,lastChunkHandling:"strict"})},Ke=Uf?{encode(e){return Pf(e),e.toBase64()},decode(e){return Df(e)}}:Qn(Xs(6),fo("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"),$c(6),po("")),jf=e=>Qn(Mc(58),fo(e),po("")),qf=jf("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"),Hf=e=>Qn(Bc(4,t=>e(e(t))),qf),ys=Qn(fo("qpzry9x8gf2tvdw0s3jn54khce6mua7l"),po("")),ma=[996825010,642813549,513874426,1027748829,705979059];function kn(e){const t=e>>25;let n=(e&33554431)<<5;for(let r=0;r<ma.length;r++)(t>>r&1)===1&&(n^=ma[r]);return n}function ya(e,t,n=1){const r=e.length;let o=1;for(let s=0;s<r;s++){const i=e.charCodeAt(s);if(i<33||i>126)throw new Error(`Invalid prefix (${e})`);o=kn(o)^i>>5}o=kn(o);for(let s=0;s<r;s++)o=kn(o)^e.charCodeAt(s)&31;for(let s of t)o=kn(o)^s;for(let s=0;s<6;s++)o=kn(o);return o^=n,ys.encode(Fr([o%Ir[30]],30,5,!1))}function Ff(e){const t=e==="bech32"?1:734539939,n=Xs(5),r=n.decode,o=n.encode,s=ha(r);function i(d,f,p=90){Pt("bech32.encode prefix",d),sn(f)&&(f=Array.from(f)),Zs("bech32.encode",f);const h=d.length;if(h===0)throw new TypeError(`Invalid prefix length ${h}`);const m=h+7+f.length;if(p!==!1&&m>p)throw new TypeError(`Length ${m} exceeds limit ${p}`);const y=d.toLowerCase(),g=ya(y,f,t);return`${y}1${ys.encode(f)}${g}`}function a(d,f=90){Pt("bech32.decode input",d);const p=d.length;if(p<8||f!==!1&&p>f)throw new TypeError(`invalid string length: ${p} (${d}). Expected (8..${f})`);const h=d.toLowerCase();if(d!==h&&d!==d.toUpperCase())throw new Error("String must be lowercase or uppercase");const m=h.lastIndexOf("1");if(m===0||m===-1)throw new Error('Letter "1" must be present between prefix and data only');const y=h.slice(0,m),g=h.slice(m+1);if(g.length<6)throw new Error("Data must be at least 6 characters long");const E=ys.decode(g).slice(0,-6),C=ya(y,E,t);if(!g.endsWith(C))throw new Error(`Invalid checksum in ${d}: expected "${C}"`);return{prefix:y,words:E}}const c=ha(a);function l(d){const{prefix:f,words:p}=a(d,!1);return{prefix:f,words:p,bytes:r(p)}}function u(d,f){return i(d,o(f))}return{encode:i,decode:a,encodeFromBytes:u,decodeToBytes:l,decodeUnsafe:c,fromWords:r,fromWordsUnsafe:s,toWords:o}}const We=Ff("bech32");const Gf=e=>e[0]==="あいこくしん";function Pc(e){if(typeof e!="string")throw new TypeError("invalid mnemonic type: "+typeof e);return e.normalize("NFKD")}function Uc(e){const t=Pc(e),n=t.split(" ");if(![12,15,18,21,24].includes(n.length))throw new Error("Invalid mnemonic");return{nfkd:t,words:n}}function Dc(e){if(G(e),![16,20,24,28,32].includes(e.length))throw new Error("invalid entropy length")}function Vf(e,t=128){if(Re(t),t%32!==0||t>256)throw new TypeError("Invalid entropy");return zf(Et(t/8),e)}const Kf=e=>{const t=8-e.length/4;return new Uint8Array([ce(e)[0]>>t<<t])};function jc(e){if(!Array.isArray(e)||e.length!==2048||typeof e[0]!="string")throw new Error("Wordlist: expected array of 2048 strings");return e.forEach(t=>{if(typeof t!="string")throw new Error("wordlist: non-string element: "+t)}),ur.chain(ur.checksum(1,Kf),ur.radix2(11,!0),ur.alphabet(e))}function Wf(e,t){const{words:n}=Uc(e),r=jc(t).decode(n);return Dc(r),r}function zf(e,t){return Dc(e),jc(t).encode(e).join(Gf(t)?"　":" ")}function Jf(e,t){try{Wf(e,t)}catch{return!1}return!0}const Yf=e=>Pc("mnemonic"+e);function Zf(e,t=""){return vf(hs,Uc(e).nfkd,Yf(t),{c:2048,dkLen:64})}const qc=`abandon
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
`);const Qs=BigInt(0),gs=BigInt(1);function Gr(e,t=""){if(typeof e!="boolean"){const n=t&&`"${t}" `;throw new Error(n+"expected boolean, got type="+typeof e)}return e}function Hc(e){if(typeof e=="bigint"){if(!Rr(e))throw new Error("positive bigint expected, got "+e)}else Re(e);return e}function dr(e){const t=Hc(e).toString(16);return t.length&1?"0"+t:t}function Fc(e){if(typeof e!="string")throw new Error("hex string expected, got "+typeof e);return e===""?Qs:BigInt("0x"+e)}function er(e){return Fc(H(e))}function Gc(e){return Fc(H(Xf(G(e)).reverse()))}function ei(e,t){Re(t),e=Hc(e);const n=z(e.toString(16).padStart(t*2,"0"));if(n.length!==t)throw new Error("number too large");return n}function Vc(e,t){return ei(e,t).reverse()}function Xf(e){return Uint8Array.from(e)}function Qf(e){return Uint8Array.from(e,(t,n)=>{const r=t.charCodeAt(0);if(t.length!==1||r>127)throw new Error(`string contains non-ASCII character "${e[n]}" with code ${r} at position ${n}`);return r})}const Rr=e=>typeof e=="bigint"&&Qs<=e;function ep(e,t,n){return Rr(e)&&Rr(t)&&Rr(n)&&t<=e&&e<n}function tp(e,t,n,r){if(!ep(t,n,r))throw new Error("expected valid "+e+": "+n+" <= n < "+r+", got "+t)}function np(e){let t;for(t=0;e>Qs;e>>=gs,t+=1);return t}const ti=e=>(gs<<BigInt(e))-gs;function rp(e,t,n){if(Re(e,"hashLen"),Re(t,"qByteLen"),typeof n!="function")throw new Error("hmacFn must be a function");const r=y=>new Uint8Array(y),o=Uint8Array.of(),s=Uint8Array.of(0),i=Uint8Array.of(1),a=1e3;let c=r(e),l=r(e),u=0;const d=()=>{c.fill(1),l.fill(0),u=0},f=(...y)=>n(l,oe(c,...y)),p=(y=o)=>{l=f(s,y),c=f(),y.length!==0&&(l=f(i,y),c=f())},h=()=>{if(u++>=a)throw new Error("drbg: tried max amount of iterations");let y=0;const g=[];for(;y<t;){c=f();const E=c.slice();g.push(E),y+=c.length}return oe(...g)};return(y,g)=>{d(),p(y);let E;for(;!(E=g(h()));)p();return d(),E}}function ni(e,t={},n={}){if(!e||typeof e!="object")throw new Error("expected valid options object");function r(s,i,a){const c=e[s];if(a&&c===void 0)return;const l=typeof c;if(l!==i||c===null)throw new Error(`param "${s}" is invalid: expected ${i}, got ${l}`)}const o=(s,i)=>Object.entries(s).forEach(([a,c])=>r(a,c,i));o(t,!1),o(n,!0)}function ga(e){const t=new WeakMap;return(n,...r)=>{const o=t.get(n);if(o!==void 0)return o;const s=e(n,...r);return t.set(n,s),s}}const ve=BigInt(0),ye=BigInt(1),At=BigInt(2),Kc=BigInt(3),Wc=BigInt(4),zc=BigInt(5),op=BigInt(7),Jc=BigInt(8),sp=BigInt(9),Yc=BigInt(16);function Ce(e,t){const n=e%t;return n>=ve?n:t+n}function _e(e,t,n){let r=e;for(;t-- >ve;)r*=r,r%=n;return r}function ba(e,t){if(e===ve)throw new Error("invert: expected non-zero number");if(t<=ve)throw new Error("invert: expected positive modulus, got "+t);let n=Ce(e,t),r=t,o=ve,s=ye;for(;n!==ve;){const a=r/n,c=r%n,l=o-s*a;r=n,n=c,o=s,s=l}if(r!==ye)throw new Error("invert: does not exist");return Ce(o,t)}function ri(e,t,n){if(!e.eql(e.sqr(t),n))throw new Error("Cannot find square root")}function Zc(e,t){const n=(e.ORDER+ye)/Wc,r=e.pow(t,n);return ri(e,r,t),r}function ip(e,t){const n=(e.ORDER-zc)/Jc,r=e.mul(t,At),o=e.pow(r,n),s=e.mul(t,o),i=e.mul(e.mul(s,At),o),a=e.mul(s,e.sub(i,e.ONE));return ri(e,a,t),a}function ap(e){const t=ho(e),n=Xc(e),r=n(t,t.neg(t.ONE)),o=n(t,r),s=n(t,t.neg(r)),i=(e+op)/Yc;return(a,c)=>{let l=a.pow(c,i),u=a.mul(l,r);const d=a.mul(l,o),f=a.mul(l,s),p=a.eql(a.sqr(u),c),h=a.eql(a.sqr(d),c);l=a.cmov(l,u,p),u=a.cmov(f,d,h);const m=a.eql(a.sqr(u),c),y=a.cmov(l,u,m);return ri(a,y,c),y}}function Xc(e){if(e<Kc)throw new Error("sqrt is not defined for small field");let t=e-ye,n=0;for(;t%At===ve;)t/=At,n++;let r=At;const o=ho(e);for(;va(o,r)===1;)if(r++>1e3)throw new Error("Cannot find square root: probably non-prime P");if(n===1)return Zc;let s=o.pow(r,t);const i=(t+ye)/At;return function(c,l){if(c.is0(l))return l;if(va(c,l)!==1)throw new Error("Cannot find square root");let u=n,d=c.mul(c.ONE,s),f=c.pow(l,t),p=c.pow(l,i);for(;!c.eql(f,c.ONE);){if(c.is0(f))return c.ZERO;let h=1,m=c.sqr(f);for(;!c.eql(m,c.ONE);)if(h++,m=c.sqr(m),h===u)throw new Error("Cannot find square root");const y=ye<<BigInt(u-h-1),g=c.pow(d,y);u=h,d=c.sqr(g),f=c.mul(f,d),p=c.mul(p,g)}return p}}function cp(e){return e%Wc===Kc?Zc:e%Jc===zc?ip:e%Yc===sp?ap(e):Xc(e)}const lp=["create","isValid","is0","neg","inv","sqrt","sqr","eql","add","sub","mul","pow","div","addN","subN","mulN","sqrN"];function up(e){const t={ORDER:"bigint",BYTES:"number",BITS:"number"},n=lp.reduce((r,o)=>(r[o]="function",r),t);return ni(e,n),e}function dp(e,t,n){if(n<ve)throw new Error("invalid exponent, negatives unsupported");if(n===ve)return e.ONE;if(n===ye)return t;let r=e.ONE,o=t;for(;n>ve;)n&ye&&(r=e.mul(r,o)),o=e.sqr(o),n>>=ye;return r}function Qc(e,t,n=!1){const r=new Array(t.length).fill(n?e.ZERO:void 0),o=t.reduce((i,a,c)=>e.is0(a)?i:(r[c]=i,e.mul(i,a)),e.ONE),s=e.inv(o);return t.reduceRight((i,a,c)=>e.is0(a)?i:(r[c]=e.mul(i,r[c]),e.mul(i,a)),s),r}function va(e,t){const n=(e.ORDER-ye)/At,r=e.pow(t,n),o=e.eql(r,e.ONE),s=e.eql(r,e.ZERO),i=e.eql(r,e.neg(e.ONE));if(!o&&!s&&!i)throw new Error("invalid Legendre symbol result");return o?1:s?0:-1}function fp(e,t){t!==void 0&&Re(t);const n=t!==void 0?t:e.toString(2).length,r=Math.ceil(n/8);return{nBitLength:n,nByteLength:r}}class pp{ORDER;BITS;BYTES;isLE;ZERO=ve;ONE=ye;_lengths;_sqrt;_mod;constructor(t,n={}){if(t<=ve)throw new Error("invalid field: expected ORDER > 0, got "+t);let r;this.isLE=!1,n!=null&&typeof n=="object"&&(typeof n.BITS=="number"&&(r=n.BITS),typeof n.sqrt=="function"&&(this.sqrt=n.sqrt),typeof n.isLE=="boolean"&&(this.isLE=n.isLE),n.allowedLengths&&(this._lengths=n.allowedLengths?.slice()),typeof n.modFromBytes=="boolean"&&(this._mod=n.modFromBytes));const{nBitLength:o,nByteLength:s}=fp(t,r);if(s>2048)throw new Error("invalid field: expected ORDER of <= 2048 bytes");this.ORDER=t,this.BITS=o,this.BYTES=s,this._sqrt=void 0,Object.preventExtensions(this)}create(t){return Ce(t,this.ORDER)}isValid(t){if(typeof t!="bigint")throw new Error("invalid field element: expected bigint, got "+typeof t);return ve<=t&&t<this.ORDER}is0(t){return t===ve}isValidNot0(t){return!this.is0(t)&&this.isValid(t)}isOdd(t){return(t&ye)===ye}neg(t){return Ce(-t,this.ORDER)}eql(t,n){return t===n}sqr(t){return Ce(t*t,this.ORDER)}add(t,n){return Ce(t+n,this.ORDER)}sub(t,n){return Ce(t-n,this.ORDER)}mul(t,n){return Ce(t*n,this.ORDER)}pow(t,n){return dp(this,t,n)}div(t,n){return Ce(t*ba(n,this.ORDER),this.ORDER)}sqrN(t){return t*t}addN(t,n){return t+n}subN(t,n){return t-n}mulN(t,n){return t*n}inv(t){return ba(t,this.ORDER)}sqrt(t){return this._sqrt||(this._sqrt=cp(this.ORDER)),this._sqrt(this,t)}toBytes(t){return this.isLE?Vc(t,this.BYTES):ei(t,this.BYTES)}fromBytes(t,n=!1){G(t);const{_lengths:r,BYTES:o,isLE:s,ORDER:i,_mod:a}=this;if(r){if(!r.includes(t.length)||t.length>o)throw new Error("Field.fromBytes: expected "+r+" bytes, got "+t.length);const l=new Uint8Array(o);l.set(t,s?0:l.length-t.length),t=l}if(t.length!==o)throw new Error("Field.fromBytes: expected "+o+" bytes, got "+t.length);let c=s?Gc(t):er(t);if(a&&(c=Ce(c,i)),!n&&!this.isValid(c))throw new Error("invalid field element: outside of range 0..ORDER");return c}invertBatch(t){return Qc(this,t)}cmov(t,n,r){return r?n:t}}function ho(e,t={}){return new pp(e,t)}function el(e){if(typeof e!="bigint")throw new Error("field order must be bigint");const t=e.toString(2).length;return Math.ceil(t/8)}function tl(e){const t=el(e);return t+Math.ceil(t/2)}function nl(e,t,n=!1){G(e);const r=e.length,o=el(t),s=tl(t);if(r<16||r<s||r>1024)throw new Error("expected "+s+"-1024 bytes of input, got "+r);const i=n?Gc(e):er(e),a=Ce(i,t-ye)+ye;return n?Vc(a,o):ei(a,o)}const an=BigInt(0),Ct=BigInt(1);function Vr(e,t){const n=t.negate();return e?n:t}function wa(e,t){const n=Qc(e.Fp,t.map(r=>r.Z));return t.map((r,o)=>e.fromAffine(r.toAffine(n[o])))}function rl(e,t){if(!Number.isSafeInteger(e)||e<=0||e>t)throw new Error("invalid window size, expected [1.."+t+"], got W="+e)}function jo(e,t){rl(e,t);const n=Math.ceil(t/e)+1,r=2**(e-1),o=2**e,s=ti(e),i=BigInt(e);return{windows:n,windowSize:r,mask:s,maxNumber:o,shiftBy:i}}function Ea(e,t,n){const{windowSize:r,mask:o,maxNumber:s,shiftBy:i}=n;let a=Number(e&o),c=e>>i;a>r&&(a-=s,c+=Ct);const l=t*r,u=l+Math.abs(a)-1,d=a===0,f=a<0,p=t%2!==0;return{nextN:c,offset:u,isZero:d,isNeg:f,isNegF:p,offsetF:l}}const qo=new WeakMap,ol=new WeakMap;function Ho(e){return ol.get(e)||1}function ka(e){if(e!==an)throw new Error("invalid wNAF")}class hp{BASE;ZERO;Fn;bits;constructor(t,n){this.BASE=t.BASE,this.ZERO=t.ZERO,this.Fn=t.Fn,this.bits=n}_unsafeLadder(t,n,r=this.ZERO){let o=t;for(;n>an;)n&Ct&&(r=r.add(o)),o=o.double(),n>>=Ct;return r}precomputeWindow(t,n){const{windows:r,windowSize:o}=jo(n,this.bits),s=[];let i=t,a=i;for(let c=0;c<r;c++){a=i,s.push(a);for(let l=1;l<o;l++)a=a.add(i),s.push(a);i=a.double()}return s}wNAF(t,n,r){if(!this.Fn.isValid(r))throw new Error("invalid scalar");let o=this.ZERO,s=this.BASE;const i=jo(t,this.bits);for(let a=0;a<i.windows;a++){const{nextN:c,offset:l,isZero:u,isNeg:d,isNegF:f,offsetF:p}=Ea(r,a,i);r=c,u?s=s.add(Vr(f,n[p])):o=o.add(Vr(d,n[l]))}return ka(r),{p:o,f:s}}wNAFUnsafe(t,n,r,o=this.ZERO){const s=jo(t,this.bits);for(let i=0;i<s.windows&&r!==an;i++){const{nextN:a,offset:c,isZero:l,isNeg:u}=Ea(r,i,s);if(r=a,!l){const d=n[c];o=o.add(u?d.negate():d)}}return ka(r),o}getPrecomputes(t,n,r){let o=qo.get(n);return o||(o=this.precomputeWindow(n,t),t!==1&&(typeof r=="function"&&(o=r(o)),qo.set(n,o))),o}cached(t,n,r){const o=Ho(t);return this.wNAF(o,this.getPrecomputes(o,t,r),n)}unsafe(t,n,r,o){const s=Ho(t);return s===1?this._unsafeLadder(t,n,o):this.wNAFUnsafe(s,this.getPrecomputes(s,t,r),n,o)}createCache(t,n){rl(n,this.bits),ol.set(t,n),qo.delete(t)}hasCache(t){return Ho(t)!==1}}function mp(e,t,n,r){let o=t,s=e.ZERO,i=e.ZERO;for(;n>an||r>an;)n&Ct&&(s=s.add(o)),r&Ct&&(i=i.add(o)),o=o.double(),n>>=Ct,r>>=Ct;return{p1:s,p2:i}}function _a(e,t,n){if(t){if(t.ORDER!==e)throw new Error("Field.ORDER must match order: Fp == p, Fn == n");return up(t),t}else return ho(e,{isLE:n})}function yp(e,t,n={},r){if(r===void 0&&(r=e==="edwards"),!t||typeof t!="object")throw new Error(`expected valid ${e} CURVE object`);for(const c of["p","n","h"]){const l=t[c];if(!(typeof l=="bigint"&&l>an))throw new Error(`CURVE.${c} must be positive bigint`)}const o=_a(t.p,n.Fp,r),s=_a(t.n,n.Fn,r),a=["Gx","Gy","a","b"];for(const c of a)if(!o.isValid(t[c]))throw new Error(`CURVE.${c} must be valid field element of CURVE.Fp`);return t=Object.freeze(Object.assign({},t)),{CURVE:t,Fp:o,Fn:s}}function sl(e,t){return function(r){const o=e(r);return{secretKey:o,publicKey:t(o)}}}const xa=(e,t)=>(e+(e>=0?t:-t)/il)/t;function gp(e,t,n){const[[r,o],[s,i]]=t,a=xa(i*e,n),c=xa(-o*e,n);let l=e-a*r-c*s,u=-a*o-c*i;const d=l<tt,f=u<tt;d&&(l=-l),f&&(u=-u);const p=ti(Math.ceil(np(n)/2))+en;if(l<tt||l>=p||u<tt||u>=p)throw new Error("splitScalar (endomorphism): failed, k="+e);return{k1neg:d,k1:l,k2neg:f,k2:u}}function bs(e){if(!["compact","recovered","der"].includes(e))throw new Error('Signature format must be "compact", "recovered", or "der"');return e}function Fo(e,t){const n={};for(let r of Object.keys(t))n[r]=e[r]===void 0?t[r]:e[r];return Gr(n.lowS,"lowS"),Gr(n.prehash,"prehash"),n.format!==void 0&&bs(n.format),n}class bp extends Error{constructor(t=""){super(t)}}const gt={Err:bp,_tlv:{encode:(e,t)=>{const{Err:n}=gt;if(e<0||e>256)throw new n("tlv.encode: wrong tag");if(t.length&1)throw new n("tlv.encode: unpadded data");const r=t.length/2,o=dr(r);if(o.length/2&128)throw new n("tlv.encode: long form length too big");const s=r>127?dr(o.length/2|128):"";return dr(e)+s+o+t},decode(e,t){const{Err:n}=gt;let r=0;if(e<0||e>256)throw new n("tlv.encode: wrong tag");if(t.length<2||t[r++]!==e)throw new n("tlv.decode: wrong tlv");const o=t[r++],s=!!(o&128);let i=0;if(!s)i=o;else{const c=o&127;if(!c)throw new n("tlv.decode(long): indefinite length not supported");if(c>4)throw new n("tlv.decode(long): byte length is too big");const l=t.subarray(r,r+c);if(l.length!==c)throw new n("tlv.decode: length bytes not complete");if(l[0]===0)throw new n("tlv.decode(long): zero leftmost byte");for(const u of l)i=i<<8|u;if(r+=c,i<128)throw new n("tlv.decode(long): not minimal encoding")}const a=t.subarray(r,r+i);if(a.length!==i)throw new n("tlv.decode: wrong value length");return{v:a,l:t.subarray(r+i)}}},_int:{encode(e){const{Err:t}=gt;if(e<tt)throw new t("integer: negative integers are not allowed");let n=dr(e);if(Number.parseInt(n[0],16)&8&&(n="00"+n),n.length&1)throw new t("unexpected DER parsing assertion: unpadded hex");return n},decode(e){const{Err:t}=gt;if(e[0]&128)throw new t("invalid signature integer: negative");if(e[0]===0&&!(e[1]&128))throw new t("invalid signature integer: unnecessary leading zero");return er(e)}},toSig(e){const{Err:t,_int:n,_tlv:r}=gt,o=G(e,void 0,"signature"),{v:s,l:i}=r.decode(48,o);if(i.length)throw new t("invalid signature: left bytes after parsing");const{v:a,l:c}=r.decode(2,s),{v:l,l:u}=r.decode(2,c);if(u.length)throw new t("invalid signature: left bytes after parsing");return{r:n.decode(a),s:n.decode(l)}},hexFromSig(e){const{_tlv:t,_int:n}=gt,r=t.encode(2,n.encode(e.r)),o=t.encode(2,n.encode(e.s)),s=r+o;return t.encode(48,s)}},tt=BigInt(0),en=BigInt(1),il=BigInt(2),fr=BigInt(3),vp=BigInt(4);function wp(e,t={}){const n=yp("weierstrass",e,t),{Fp:r,Fn:o}=n;let s=n.CURVE;const{h:i,n:a}=s;ni(t,{},{allowInfinityPoint:"boolean",clearCofactor:"function",isTorsionFree:"function",fromBytes:"function",toBytes:"function",endo:"object"});const{endo:c}=t;if(c&&(!r.is0(s.a)||typeof c.beta!="bigint"||!Array.isArray(c.basises)))throw new Error('invalid endo: expected "beta": bigint and "basises": array');const l=cl(r,o);function u(){if(!r.isOdd)throw new Error("compression is not supported: Field does not have .isOdd()")}function d(A,k,R){const{x:I,y:N}=k.toAffine(),T=r.toBytes(I);if(Gr(R,"isCompressed"),R){u();const M=!r.isOdd(N);return oe(al(M),T)}else return oe(Uint8Array.of(4),T,r.toBytes(N))}function f(A){G(A,void 0,"Point");const{publicKey:k,publicKeyUncompressed:R}=l,I=A.length,N=A[0],T=A.subarray(1);if(I===k&&(N===2||N===3)){const M=r.fromBytes(T);if(!r.isValid(M))throw new Error("bad point: is not on curve, wrong x");const B=m(M);let P;try{P=r.sqrt(B)}catch(V){const Y=V instanceof Error?": "+V.message:"";throw new Error("bad point: is not on curve, sqrt error"+Y)}u();const U=r.isOdd(P);return(N&1)===1!==U&&(P=r.neg(P)),{x:M,y:P}}else if(I===R&&N===4){const M=r.BYTES,B=r.fromBytes(T.subarray(0,M)),P=r.fromBytes(T.subarray(M,M*2));if(!y(B,P))throw new Error("bad point: is not on curve");return{x:B,y:P}}else throw new Error(`bad point: got length ${I}, expected compressed=${k} or uncompressed=${R}`)}const p=t.toBytes||d,h=t.fromBytes||f;function m(A){const k=r.sqr(A),R=r.mul(k,A);return r.add(r.add(R,r.mul(A,s.a)),s.b)}function y(A,k){const R=r.sqr(k),I=m(A);return r.eql(R,I)}if(!y(s.Gx,s.Gy))throw new Error("bad curve params: generator point");const g=r.mul(r.pow(s.a,fr),vp),E=r.mul(r.sqr(s.b),BigInt(27));if(r.is0(r.add(g,E)))throw new Error("bad curve params: a or b");function C(A,k,R=!1){if(!r.isValid(k)||R&&r.is0(k))throw new Error(`bad point coordinate ${A}`);return k}function $(A){if(!(A instanceof b))throw new Error("Weierstrass Point expected")}function L(A){if(!c||!c.basises)throw new Error("no endo");return gp(A,c.basises,o.ORDER)}const O=ga((A,k)=>{const{X:R,Y:I,Z:N}=A;if(r.eql(N,r.ONE))return{x:R,y:I};const T=A.is0();k==null&&(k=T?r.ONE:r.inv(N));const M=r.mul(R,k),B=r.mul(I,k),P=r.mul(N,k);if(T)return{x:r.ZERO,y:r.ZERO};if(!r.eql(P,r.ONE))throw new Error("invZ was invalid");return{x:M,y:B}}),w=ga(A=>{if(A.is0()){if(t.allowInfinityPoint&&!r.is0(A.Y))return;throw new Error("bad point: ZERO")}const{x:k,y:R}=A.toAffine();if(!r.isValid(k)||!r.isValid(R))throw new Error("bad point: x or y not field elements");if(!y(k,R))throw new Error("bad point: equation left != right");if(!A.isTorsionFree())throw new Error("bad point: not in prime-order subgroup");return!0});function v(A,k,R,I,N){return R=new b(r.mul(R.X,A),R.Y,R.Z),k=Vr(I,k),R=Vr(N,R),k.add(R)}class b{static BASE=new b(s.Gx,s.Gy,r.ONE);static ZERO=new b(r.ZERO,r.ONE,r.ZERO);static Fp=r;static Fn=o;X;Y;Z;constructor(k,R,I){this.X=C("x",k),this.Y=C("y",R,!0),this.Z=C("z",I),Object.freeze(this)}static CURVE(){return s}static fromAffine(k){const{x:R,y:I}=k||{};if(!k||!r.isValid(R)||!r.isValid(I))throw new Error("invalid affine point");if(k instanceof b)throw new Error("projective point not allowed");return r.is0(R)&&r.is0(I)?b.ZERO:new b(R,I,r.ONE)}static fromBytes(k){const R=b.fromAffine(h(G(k,void 0,"point")));return R.assertValidity(),R}static fromHex(k){return b.fromBytes(z(k))}get x(){return this.toAffine().x}get y(){return this.toAffine().y}precompute(k=8,R=!0){return S.createCache(this,k),R||this.multiply(fr),this}assertValidity(){w(this)}hasEvenY(){const{y:k}=this.toAffine();if(!r.isOdd)throw new Error("Field doesn't support isOdd");return!r.isOdd(k)}equals(k){$(k);const{X:R,Y:I,Z:N}=this,{X:T,Y:M,Z:B}=k,P=r.eql(r.mul(R,B),r.mul(T,N)),U=r.eql(r.mul(I,B),r.mul(M,N));return P&&U}negate(){return new b(this.X,r.neg(this.Y),this.Z)}double(){const{a:k,b:R}=s,I=r.mul(R,fr),{X:N,Y:T,Z:M}=this;let B=r.ZERO,P=r.ZERO,U=r.ZERO,D=r.mul(N,N),V=r.mul(T,T),Y=r.mul(M,M),K=r.mul(N,T);return K=r.add(K,K),U=r.mul(N,M),U=r.add(U,U),B=r.mul(k,U),P=r.mul(I,Y),P=r.add(B,P),B=r.sub(V,P),P=r.add(V,P),P=r.mul(B,P),B=r.mul(K,B),U=r.mul(I,U),Y=r.mul(k,Y),K=r.sub(D,Y),K=r.mul(k,K),K=r.add(K,U),U=r.add(D,D),D=r.add(U,D),D=r.add(D,Y),D=r.mul(D,K),P=r.add(P,D),Y=r.mul(T,M),Y=r.add(Y,Y),D=r.mul(Y,K),B=r.sub(B,D),U=r.mul(Y,V),U=r.add(U,U),U=r.add(U,U),new b(B,P,U)}add(k){$(k);const{X:R,Y:I,Z:N}=this,{X:T,Y:M,Z:B}=k;let P=r.ZERO,U=r.ZERO,D=r.ZERO;const V=s.a,Y=r.mul(s.b,fr);let K=r.mul(R,T),ne=r.mul(I,M),le=r.mul(N,B),Me=r.add(R,I),re=r.add(T,M);Me=r.mul(Me,re),re=r.add(K,ne),Me=r.sub(Me,re),re=r.add(R,N);let de=r.add(T,B);return re=r.mul(re,de),de=r.add(K,le),re=r.sub(re,de),de=r.add(I,N),P=r.add(M,B),de=r.mul(de,P),P=r.add(ne,le),de=r.sub(de,P),D=r.mul(V,re),P=r.mul(Y,le),D=r.add(P,D),P=r.sub(ne,D),D=r.add(ne,D),U=r.mul(P,D),ne=r.add(K,K),ne=r.add(ne,K),le=r.mul(V,le),re=r.mul(Y,re),ne=r.add(ne,le),le=r.sub(K,le),le=r.mul(V,le),re=r.add(re,le),K=r.mul(ne,re),U=r.add(U,K),K=r.mul(de,re),P=r.mul(Me,P),P=r.sub(P,K),K=r.mul(Me,ne),D=r.mul(de,D),D=r.add(D,K),new b(P,U,D)}subtract(k){return this.add(k.negate())}is0(){return this.equals(b.ZERO)}multiply(k){const{endo:R}=t;if(!o.isValidNot0(k))throw new Error("invalid scalar: out of range");let I,N;const T=M=>S.cached(this,M,B=>wa(b,B));if(R){const{k1neg:M,k1:B,k2neg:P,k2:U}=L(k),{p:D,f:V}=T(B),{p:Y,f:K}=T(U);N=V.add(K),I=v(R.beta,D,Y,M,P)}else{const{p:M,f:B}=T(k);I=M,N=B}return wa(b,[I,N])[0]}multiplyUnsafe(k){const{endo:R}=t,I=this;if(!o.isValid(k))throw new Error("invalid scalar: out of range");if(k===tt||I.is0())return b.ZERO;if(k===en)return I;if(S.hasCache(this))return this.multiply(k);if(R){const{k1neg:N,k1:T,k2neg:M,k2:B}=L(k),{p1:P,p2:U}=mp(b,I,T,B);return v(R.beta,P,U,N,M)}else return S.unsafe(I,k)}toAffine(k){return O(this,k)}isTorsionFree(){const{isTorsionFree:k}=t;return i===en?!0:k?k(b,this):S.unsafe(this,a).is0()}clearCofactor(){const{clearCofactor:k}=t;return i===en?this:k?k(b,this):this.multiplyUnsafe(i)}isSmallOrder(){return this.multiplyUnsafe(i).is0()}toBytes(k=!0){return Gr(k,"isCompressed"),this.assertValidity(),p(b,this,k)}toHex(k=!0){return H(this.toBytes(k))}toString(){return`<Point ${this.is0()?"ZERO":this.toHex()}>`}}const x=o.BITS,S=new hp(b,t.endo?Math.ceil(x/2):x);return b.BASE.precompute(8),b}function al(e){return Uint8Array.of(e?2:3)}function cl(e,t){return{secretKey:t.BYTES,publicKey:1+e.BYTES,publicKeyUncompressed:1+2*e.BYTES,publicKeyHasPrefix:!0,signature:2*t.BYTES}}function Ep(e,t={}){const{Fn:n}=e,r=t.randomBytes||Et,o=Object.assign(cl(e.Fp,n),{seed:tl(n.ORDER)});function s(p){try{const h=n.fromBytes(p);return n.isValidNot0(h)}catch{return!1}}function i(p,h){const{publicKey:m,publicKeyUncompressed:y}=o;try{const g=p.length;return h===!0&&g!==m||h===!1&&g!==y?!1:!!e.fromBytes(p)}catch{return!1}}function a(p=r(o.seed)){return nl(G(p,o.seed,"seed"),n.ORDER)}function c(p,h=!0){return e.BASE.multiply(n.fromBytes(p)).toBytes(h)}function l(p){const{secretKey:h,publicKey:m,publicKeyUncompressed:y}=o;if(!zs(p)||"_lengths"in n&&n._lengths||h===m)return;const g=G(p,void 0,"key").length;return g===m||g===y}function u(p,h,m=!0){if(l(p)===!0)throw new Error("first arg must be private key");if(l(h)===!1)throw new Error("second arg must be public key");const y=n.fromBytes(p);return e.fromBytes(h).multiply(y).toBytes(m)}const d={isValidSecretKey:s,isValidPublicKey:i,randomSecretKey:a},f=sl(a,c);return Object.freeze({getPublicKey:c,getSharedSecret:u,keygen:f,Point:e,utils:d,lengths:o})}function kp(e,t,n={}){Xn(t),ni(n,{},{hmac:"function",lowS:"boolean",randomBytes:"function",bits2int:"function",bits2int_modN:"function"}),n=Object.assign({},n);const r=n.randomBytes||Et,o=n.hmac||((R,I)=>st(t,R,I)),{Fp:s,Fn:i}=e,{ORDER:a,BITS:c}=i,{keygen:l,getPublicKey:u,getSharedSecret:d,utils:f,lengths:p}=Ep(e,n),h={prehash:!0,lowS:typeof n.lowS=="boolean"?n.lowS:!0,format:"compact",extraEntropy:!1},m=a*il<s.ORDER;function y(R){const I=a>>en;return R>I}function g(R,I){if(!i.isValidNot0(I))throw new Error(`invalid signature ${R}: out of range 1..Point.Fn.ORDER`);return I}function E(){if(m)throw new Error('"recovered" sig type is not supported for cofactor >2 curves')}function C(R,I){bs(I);const N=p.signature,T=I==="compact"?N:I==="recovered"?N+1:void 0;return G(R,T)}class ${r;s;recovery;constructor(I,N,T){if(this.r=g("r",I),this.s=g("s",N),T!=null){if(E(),![0,1,2,3].includes(T))throw new Error("invalid recovery id");this.recovery=T}Object.freeze(this)}static fromBytes(I,N=h.format){C(I,N);let T;if(N==="der"){const{r:U,s:D}=gt.toSig(G(I));return new $(U,D)}N==="recovered"&&(T=I[0],N="compact",I=I.subarray(1));const M=p.signature/2,B=I.subarray(0,M),P=I.subarray(M,M*2);return new $(i.fromBytes(B),i.fromBytes(P),T)}static fromHex(I,N){return this.fromBytes(z(I),N)}assertRecovery(){const{recovery:I}=this;if(I==null)throw new Error("invalid recovery id: must be present");return I}addRecoveryBit(I){return new $(this.r,this.s,I)}recoverPublicKey(I){const{r:N,s:T}=this,M=this.assertRecovery(),B=M===2||M===3?N+a:N;if(!s.isValid(B))throw new Error("invalid recovery id: sig.r+curve.n != R.x");const P=s.toBytes(B),U=e.fromBytes(oe(al((M&1)===0),P)),D=i.inv(B),V=O(G(I,void 0,"msgHash")),Y=i.create(-V*D),K=i.create(T*D),ne=e.BASE.multiplyUnsafe(Y).add(U.multiplyUnsafe(K));if(ne.is0())throw new Error("invalid recovery: point at infinify");return ne.assertValidity(),ne}hasHighS(){return y(this.s)}toBytes(I=h.format){if(bs(I),I==="der")return z(gt.hexFromSig(this));const{r:N,s:T}=this,M=i.toBytes(N),B=i.toBytes(T);return I==="recovered"?(E(),oe(Uint8Array.of(this.assertRecovery()),M,B)):oe(M,B)}toHex(I){return H(this.toBytes(I))}}const L=n.bits2int||function(I){if(I.length>8192)throw new Error("input is too large");const N=er(I),T=I.length*8-c;return T>0?N>>BigInt(T):N},O=n.bits2int_modN||function(I){return i.create(L(I))},w=ti(c);function v(R){return tp("num < 2^"+c,R,tt,w),i.toBytes(R)}function b(R,I){return G(R,void 0,"message"),I?G(t(R),void 0,"prehashed message"):R}function x(R,I,N){const{lowS:T,prehash:M,extraEntropy:B}=Fo(N,h);R=b(R,M);const P=O(R),U=i.fromBytes(I);if(!i.isValidNot0(U))throw new Error("invalid private key");const D=[v(U),v(P)];if(B!=null&&B!==!1){const ne=B===!0?r(p.secretKey):B;D.push(G(ne,void 0,"extraEntropy"))}const V=oe(...D),Y=P;function K(ne){const le=L(ne);if(!i.isValidNot0(le))return;const Me=i.inv(le),re=e.BASE.multiply(le).toAffine(),de=i.create(re.x);if(de===tt)return;const sr=i.create(Me*i.create(Y+de*U));if(sr===tt)return;let ia=(re.x===de?0:2)|Number(re.y&en),aa=sr;return T&&y(sr)&&(aa=i.neg(sr),ia^=1),new $(de,aa,m?void 0:ia)}return{seed:V,k2sig:K}}function S(R,I,N={}){const{seed:T,k2sig:M}=x(R,I,N);return rp(t.outputLen,i.BYTES,o)(T,M).toBytes(N.format)}function A(R,I,N,T={}){const{lowS:M,prehash:B,format:P}=Fo(T,h);if(N=G(N,void 0,"publicKey"),I=b(I,B),!zs(R)){const U=R instanceof $?", use sig.toBytes()":"";throw new Error("verify expects Uint8Array signature"+U)}C(R,P);try{const U=$.fromBytes(R,P),D=e.fromBytes(N);if(M&&U.hasHighS())return!1;const{r:V,s:Y}=U,K=O(I),ne=i.inv(Y),le=i.create(K*ne),Me=i.create(V*ne),re=e.BASE.multiplyUnsafe(le).add(D.multiplyUnsafe(Me));return re.is0()?!1:i.create(re.x)===V}catch{return!1}}function k(R,I,N={}){const{prehash:T}=Fo(N,h);return I=b(I,T),$.fromBytes(R,"recovered").recoverPublicKey(I).toBytes()}return Object.freeze({keygen:l,getPublicKey:u,getSharedSecret:d,utils:f,lengths:p,Point:e,sign:S,verify:A,recoverPublicKey:k,Signature:$,hash:t})}const mo={p:BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),n:BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),h:BigInt(1),a:BigInt(0),b:BigInt(7),Gx:BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),Gy:BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")},_p={beta:BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),basises:[[BigInt("0x3086d221a7d46bcde86c90e49284eb15"),-BigInt("0xe4437ed6010e88286f547fa90abfe4c3")],[BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"),BigInt("0x3086d221a7d46bcde86c90e49284eb15")]]},xp=BigInt(0),vs=BigInt(2);function Sp(e){const t=mo.p,n=BigInt(3),r=BigInt(6),o=BigInt(11),s=BigInt(22),i=BigInt(23),a=BigInt(44),c=BigInt(88),l=e*e*e%t,u=l*l*e%t,d=_e(u,n,t)*u%t,f=_e(d,n,t)*u%t,p=_e(f,vs,t)*l%t,h=_e(p,o,t)*p%t,m=_e(h,s,t)*h%t,y=_e(m,a,t)*m%t,g=_e(y,c,t)*y%t,E=_e(g,a,t)*m%t,C=_e(E,n,t)*u%t,$=_e(C,i,t)*h%t,L=_e($,r,t)*l%t,O=_e(L,vs,t);if(!Kr.eql(Kr.sqr(O),e))throw new Error("Cannot find square root");return O}const Kr=ho(mo.p,{sqrt:Sp}),Ht=wp(mo,{Fp:Kr,endo:_p}),je=kp(Ht,ce),Sa={};function Wr(e,...t){let n=Sa[e];if(n===void 0){const r=ce(Qf(e));n=oe(r,r),Sa[e]=n}return ce(oe(n,...t))}const oi=e=>e.toBytes(!0).slice(1),si=e=>e%vs===xp;function ws(e){const{Fn:t,BASE:n}=Ht,r=t.fromBytes(e),o=n.multiply(r);return{scalar:si(o.y)?r:t.neg(r),bytes:oi(o)}}function ll(e){const t=Kr;if(!t.isValidNot0(e))throw new Error("invalid x: Fail if x ≥ p");const n=t.create(e*e),r=t.create(n*e+BigInt(7));let o=t.sqrt(r);si(o)||(o=t.neg(o));const s=Ht.fromAffine({x:e,y:o});return s.assertValidity(),s}const Bn=er;function ul(...e){return Ht.Fn.create(Bn(Wr("BIP0340/challenge",...e)))}function Ia(e){return ws(e).bytes}function Ip(e,t,n=Et(32)){const{Fn:r}=Ht,o=G(e,void 0,"message"),{bytes:s,scalar:i}=ws(t),a=G(n,32,"auxRand"),c=r.toBytes(i^Bn(Wr("BIP0340/aux",a))),l=Wr("BIP0340/nonce",c,s,o),{bytes:u,scalar:d}=ws(l),f=ul(u,s,o),p=new Uint8Array(64);if(p.set(u,0),p.set(r.toBytes(r.create(d+f*i)),32),!dl(p,o,s))throw new Error("sign: Invalid signature produced");return p}function dl(e,t,n){const{Fp:r,Fn:o,BASE:s}=Ht,i=G(e,64,"signature"),a=G(t,void 0,"message"),c=G(n,32,"publicKey");try{const l=ll(Bn(c)),u=Bn(i.subarray(0,32));if(!r.isValidNot0(u))return!1;const d=Bn(i.subarray(32,64));if(!o.isValidNot0(d))return!1;const f=ul(o.toBytes(u),oi(l),a),p=s.multiplyUnsafe(d).add(l.multiplyUnsafe(o.neg(f))),{x:h,y:m}=p.toAffine();return!(p.is0()||!si(m)||h!==u)}catch{return!1}}const te=(()=>{const n=(r=Et(48))=>nl(r,mo.n);return{keygen:sl(n,Ia),getPublicKey:Ia,sign:Ip,verify:dl,Point:Ht,utils:{randomSecretKey:n,taggedHash:Wr,lift_x:ll,pointToBytes:oi},lengths:{secretKey:32,publicKey:32,publicKeyHasPrefix:!1,signature:64,seed:48}}})(),Rp=Uint8Array.from([7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8]),fl=Uint8Array.from(new Array(16).fill(0).map((e,t)=>t)),Ap=fl.map(e=>(9*e+5)%16),pl=(()=>{const n=[[fl],[Ap]];for(let r=0;r<4;r++)for(let o of n)o.push(o[r].map(s=>Rp[s]));return n})(),hl=pl[0],ml=pl[1],yl=[[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8],[12,13,11,15,6,9,9,7,12,15,11,13,7,8,7,7],[13,15,14,11,7,7,6,8,13,14,13,12,5,5,6,9],[14,11,12,14,8,6,5,5,15,12,15,14,9,9,8,6],[15,12,13,13,9,5,8,6,14,11,12,11,8,6,5,5]].map(e=>Uint8Array.from(e)),Cp=hl.map((e,t)=>e.map(n=>yl[t][n])),Tp=ml.map((e,t)=>e.map(n=>yl[t][n])),Np=Uint32Array.from([0,1518500249,1859775393,2400959708,2840853838]),Lp=Uint32Array.from([1352829926,1548603684,1836072691,2053994217,0]);function Ra(e,t,n,r){return e===0?t^n^r:e===1?t&n|~t&r:e===2?(t|~n)^r:e===3?t&r|n&~r:t^(n|~r)}const pr=new Uint32Array(16);class $p extends Ys{h0=1732584193;h1=-271733879;h2=-1732584194;h3=271733878;h4=-1009589776;constructor(){super(64,20,8,!0)}get(){const{h0:t,h1:n,h2:r,h3:o,h4:s}=this;return[t,n,r,o,s]}set(t,n,r,o,s){this.h0=t|0,this.h1=n|0,this.h2=r|0,this.h3=o|0,this.h4=s|0}process(t,n){for(let p=0;p<16;p++,n+=4)pr[p]=t.getUint32(n,!0);let r=this.h0|0,o=r,s=this.h1|0,i=s,a=this.h2|0,c=a,l=this.h3|0,u=l,d=this.h4|0,f=d;for(let p=0;p<5;p++){const h=4-p,m=Np[p],y=Lp[p],g=hl[p],E=ml[p],C=Cp[p],$=Tp[p];for(let L=0;L<16;L++){const O=ir(r+Ra(p,s,a,l)+pr[g[L]]+m,C[L])+d|0;r=d,d=l,l=ir(a,10)|0,a=s,s=O}for(let L=0;L<16;L++){const O=ir(o+Ra(h,i,c,u)+pr[E[L]]+y,$[L])+f|0;o=f,f=u,u=ir(c,10)|0,c=i,i=O}}this.set(this.h1+a+u|0,this.h2+l+f|0,this.h3+d+o|0,this.h4+r+i|0,this.h0+s+c|0)}roundClean(){Ve(pr)}destroy(){this.destroyed=!0,Ve(this.buffer),this.set(0,0,0,0,0)}}const Op=Js(()=>new $p);const Cn=je.Point,{Fn:_n}=Cn,Go=Hf(ce),Mp=Uint8Array.from("Bitcoin seed".split(""),e=>e.charCodeAt(0)),Vo={private:76066276,public:76067358},Ko=2147483648,Bp=e=>Op(ce(e)),Pp=e=>Ot(e).getUint32(0,!1),hr=e=>{if(!Number.isSafeInteger(e)||e<0||e>2**32-1)throw new Error("invalid number, should be from 0 to 2**32-1, got "+e);const t=new Uint8Array(4);return Ot(t).setUint32(0,e,!1),t};class Rt{get fingerprint(){if(!this.pubHash)throw new Error("No publicKey set!");return Pp(this.pubHash)}get identifier(){return this.pubHash}get pubKeyHash(){return this.pubHash}get privateKey(){return this._privateKey||null}get publicKey(){return this._publicKey||null}get privateExtendedKey(){const t=this._privateKey;if(!t)throw new Error("No private key");return Go.encode(this.serialize(this.versions.private,oe(Uint8Array.of(0),t)))}get publicExtendedKey(){if(!this._publicKey)throw new Error("No public key");return Go.encode(this.serialize(this.versions.public,this._publicKey))}static fromMasterSeed(t,n=Vo){if(G(t),8*t.length<128||8*t.length>512)throw new Error("HDKey: seed length must be between 128 and 512 bits; 256 bits is advised, got "+t.length);const r=st(hs,Mp,t),o=r.slice(0,32),s=r.slice(32);return new Rt({versions:n,chainCode:s,privateKey:o})}static fromExtendedKey(t,n=Vo){const r=Go.decode(t),o=Ot(r),s=o.getUint32(0,!1),i={versions:n,depth:r[4],parentFingerprint:o.getUint32(5,!1),index:o.getUint32(9,!1),chainCode:r.slice(13,45)},a=r.slice(45),c=a[0]===0;if(s!==n[c?"private":"public"])throw new Error("Version mismatch");return c?new Rt({...i,privateKey:a.slice(1)}):new Rt({...i,publicKey:a})}static fromJSON(t){return Rt.fromExtendedKey(t.xpriv)}versions;depth=0;index=0;chainCode=null;parentFingerprint=0;_privateKey;_publicKey;pubHash;constructor(t){if(!t||typeof t!="object")throw new Error("HDKey.constructor must not be called directly");if(this.versions=t.versions||Vo,this.depth=t.depth||0,this.chainCode=t.chainCode||null,this.index=t.index||0,this.parentFingerprint=t.parentFingerprint||0,!this.depth&&(this.parentFingerprint||this.index))throw new Error("HDKey: zero depth with non-zero index/parent fingerprint");if(this.depth>255)throw new Error("HDKey: depth exceeds the serializable value 255");if(t.publicKey&&t.privateKey)throw new Error("HDKey: publicKey and privateKey at same time.");if(t.privateKey){if(!je.utils.isValidSecretKey(t.privateKey))throw new Error("Invalid private key");this._privateKey=t.privateKey,this._publicKey=je.getPublicKey(t.privateKey,!0)}else if(t.publicKey)this._publicKey=Cn.fromBytes(t.publicKey).toBytes(!0);else throw new Error("HDKey: no public or private key provided");this.pubHash=Bp(this._publicKey)}derive(t){if(!/^[mM]'?/.test(t))throw new Error('Path must start with "m" or "M"');if(/^[mM]'?$/.test(t))return this;const n=t.replace(/^[mM]'?\//,"").split("/");let r=this;for(const o of n){const s=/^(\d+)('?)$/.exec(o),i=s&&s[1];if(!s||s.length!==3||typeof i!="string")throw new Error("invalid child index: "+o);let a=+i;if(!Number.isSafeInteger(a)||a>=Ko)throw new Error("Invalid index");s[2]==="'"&&(a+=Ko),r=r.deriveChild(a)}return r}deriveChild(t){if(!this._publicKey||!this.chainCode)throw new Error("No publicKey or chainCode set");let n=hr(t);if(t>=Ko){const c=this._privateKey;if(!c)throw new Error("Could not derive hardened child key");n=oe(Uint8Array.of(0),c,n)}else n=oe(this._publicKey,n);const r=st(hs,this.chainCode,n),o=r.slice(0,32),s=r.slice(32);if(!je.utils.isValidSecretKey(o))throw new Error("Tweak bigger than curve order");const i={versions:this.versions,chainCode:s,depth:this.depth+1,parentFingerprint:this.fingerprint,index:t},a=_n.fromBytes(o);try{if(this._privateKey){const c=_n.create(_n.fromBytes(this._privateKey)+a);if(!_n.isValidNot0(c))throw new Error("The tweak was out of range or the resulted private key is invalid");i.privateKey=_n.toBytes(c)}else{const c=Cn.fromBytes(this._publicKey).add(Cn.BASE.multiply(a));if(c.equals(Cn.ZERO))throw new Error("The tweak was equal to negative P, which made the result key invalid");i.publicKey=c.toBytes(!0)}return new Rt(i)}catch{return this.deriveChild(t+1)}}sign(t){if(!this._privateKey)throw new Error("No privateKey set!");return G(t,32),je.sign(t,this._privateKey,{prehash:!1})}verify(t,n){if(G(t,32),G(n,64),!this._publicKey)throw new Error("No publicKey set!");return je.verify(n,t,this._publicKey,{prehash:!1})}wipePrivateData(){return this._privateKey&&(this._privateKey.fill(0),this._privateKey=void 0),this}toJSON(){return{xpriv:this.privateExtendedKey,xpub:this.publicExtendedKey}}serialize(t,n){if(!this.chainCode)throw new Error("No chainCode set");return G(n,33),oe(hr(t),new Uint8Array([this.depth]),hr(this.parentFingerprint),hr(this.index),this.chainCode,n)}}function Up(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array"}function Aa(e){if(typeof e!="boolean")throw new Error(`boolean expected, not ${e}`)}function Wo(e){if(!Number.isSafeInteger(e)||e<0)throw new Error("positive integer expected, got "+e)}function ge(e,t,n=""){const r=Up(e),o=e?.length,s=t!==void 0;if(!r||s&&o!==t){const i=n&&`"${n}" `,a=s?` of length ${t}`:"",c=r?`length=${o}`:`type=${typeof e}`;throw new Error(i+"expected Uint8Array"+a+", got "+c)}return e}function he(e){return new Uint32Array(e.buffer,e.byteOffset,Math.floor(e.byteLength/4))}function cn(...e){for(let t=0;t<e.length;t++)e[t].fill(0)}const Dp=new Uint8Array(new Uint32Array([287454020]).buffer)[0]===68;function jp(e,t){return e.buffer===t.buffer&&e.byteOffset<t.byteOffset+t.byteLength&&t.byteOffset<e.byteOffset+e.byteLength}function gl(e,t){if(jp(e,t)&&e.byteOffset<t.byteOffset)throw new Error("complex overlap of input and output is not supported")}function qp(e,t){if(t==null||typeof t!="object")throw new Error("options must be defined");return Object.assign(e,t)}function bl(e,t){if(e.length!==t.length)return!1;let n=0;for(let r=0;r<e.length;r++)n|=e[r]^t[r];return n===0}const Hp=(e,t)=>{function n(r,...o){if(ge(r,void 0,"key"),!Dp)throw new Error("Non little-endian hardware is not yet supported");if(e.nonceLength!==void 0){const u=o[0];ge(u,e.varSizeNonce?void 0:e.nonceLength,"nonce")}const s=e.tagLength;s&&o[1]!==void 0&&ge(o[1],void 0,"AAD");const i=t(r,...o),a=(u,d)=>{if(d!==void 0){if(u!==2)throw new Error("cipher output not supported");ge(d,void 0,"output")}};let c=!1;return{encrypt(u,d){if(c)throw new Error("cannot encrypt() twice with same key + nonce");return c=!0,ge(u),a(i.encrypt.length,d),i.encrypt(u,d)},decrypt(u,d){if(ge(u),s&&u.length<s)throw new Error('"ciphertext" expected length bigger than tagLength='+s);return a(i.decrypt.length,d),i.decrypt(u,d)}}}return Object.assign(n,e),n};function vl(e,t,n=!0){if(t===void 0)return new Uint8Array(e);if(t.length!==e)throw new Error('"output" expected Uint8Array of length '+e+", got: "+t.length);if(n&&!tn(t))throw new Error("invalid output, must be aligned");return t}function tn(e){return e.byteOffset%4===0}function Mt(e){return Uint8Array.from(e)}const vt=16,Fp=283;function Gp(e){if(![16,24,32].includes(e.length))throw new Error('"aes key" expected Uint8Array of length 16/24/32, got length='+e.length)}function ii(e){return e<<1^Fp&-(e>>7)}function Xt(e,t){let n=0;for(;t>0;t>>=1)n^=e&-(t&1),e=ii(e);return n}const Es=(()=>{const e=new Uint8Array(256);for(let n=0,r=1;n<256;n++,r^=ii(r))e[n]=r;const t=new Uint8Array(256);t[0]=99;for(let n=0;n<255;n++){let r=e[255-n];r|=r<<8,t[e[n]]=(r^r>>4^r>>5^r>>6^r>>7^99)&255}return cn(e),t})(),Vp=Es.map((e,t)=>Es.indexOf(t)),Kp=e=>e<<24|e>>>8,zo=e=>e<<8|e>>>24;function wl(e,t){if(e.length!==256)throw new Error("Wrong sbox length");const n=new Uint32Array(256).map((l,u)=>t(e[u])),r=n.map(zo),o=r.map(zo),s=o.map(zo),i=new Uint32Array(256*256),a=new Uint32Array(256*256),c=new Uint16Array(256*256);for(let l=0;l<256;l++)for(let u=0;u<256;u++){const d=l*256+u;i[d]=n[l]^r[u],a[d]=o[l]^s[u],c[d]=e[l]<<8|e[u]}return{sbox:e,sbox2:c,T0:n,T1:r,T2:o,T3:s,T01:i,T23:a}}const ai=wl(Es,e=>Xt(e,3)<<24|e<<16|e<<8|Xt(e,2)),El=wl(Vp,e=>Xt(e,11)<<24|Xt(e,13)<<16|Xt(e,9)<<8|Xt(e,14)),Wp=(()=>{const e=new Uint8Array(16);for(let t=0,n=1;t<16;t++,n=ii(n))e[t]=n;return e})();function kl(e){ge(e);const t=e.length;Gp(e);const{sbox2:n}=ai,r=[];tn(e)||r.push(e=Mt(e));const o=he(e),s=o.length,i=c=>Fe(n,c,c,c,c),a=new Uint32Array(t+28);a.set(o);for(let c=s;c<a.length;c++){let l=a[c-1];c%s===0?l=i(Kp(l))^Wp[c/s-1]:s>6&&c%s===4&&(l=i(l)),a[c]=a[c-s]^l}return cn(...r),a}function zp(e){const t=kl(e),n=t.slice(),r=t.length,{sbox2:o}=ai,{T0:s,T1:i,T2:a,T3:c}=El;for(let l=0;l<r;l+=4)for(let u=0;u<4;u++)n[l+u]=t[r-l-4+u];cn(t);for(let l=4;l<r-4;l++){const u=n[l],d=Fe(o,u,u,u,u);n[l]=s[d&255]^i[d>>>8&255]^a[d>>>16&255]^c[d>>>24]}return n}function bt(e,t,n,r,o,s){return e[n<<8&65280|r>>>8&255]^t[o>>>8&65280|s>>>24&255]}function Fe(e,t,n,r,o){return e[t&255|n&65280]|e[r>>>16&255|o>>>16&65280]<<16}function Ca(e,t,n,r,o){const{sbox2:s,T01:i,T23:a}=ai;let c=0;t^=e[c++],n^=e[c++],r^=e[c++],o^=e[c++];const l=e.length/4-2;for(let h=0;h<l;h++){const m=e[c++]^bt(i,a,t,n,r,o),y=e[c++]^bt(i,a,n,r,o,t),g=e[c++]^bt(i,a,r,o,t,n),E=e[c++]^bt(i,a,o,t,n,r);t=m,n=y,r=g,o=E}const u=e[c++]^Fe(s,t,n,r,o),d=e[c++]^Fe(s,n,r,o,t),f=e[c++]^Fe(s,r,o,t,n),p=e[c++]^Fe(s,o,t,n,r);return{s0:u,s1:d,s2:f,s3:p}}function Jp(e,t,n,r,o){const{sbox2:s,T01:i,T23:a}=El;let c=0;t^=e[c++],n^=e[c++],r^=e[c++],o^=e[c++];const l=e.length/4-2;for(let h=0;h<l;h++){const m=e[c++]^bt(i,a,t,o,r,n),y=e[c++]^bt(i,a,n,t,o,r),g=e[c++]^bt(i,a,r,n,t,o),E=e[c++]^bt(i,a,o,r,n,t);t=m,n=y,r=g,o=E}const u=e[c++]^Fe(s,t,o,r,n),d=e[c++]^Fe(s,n,t,o,r),f=e[c++]^Fe(s,r,n,t,o),p=e[c++]^Fe(s,o,r,n,t);return{s0:u,s1:d,s2:f,s3:p}}function Yp(e){if(ge(e),e.length%vt!==0)throw new Error("aes-(cbc/ecb).decrypt ciphertext should consist of blocks with size "+vt)}function Zp(e,t,n){ge(e);let r=e.length;const o=r%vt;if(!t&&o!==0)throw new Error("aec/(cbc-ecb): unpadded plaintext with disabled padding");tn(e)||(e=Mt(e));const s=he(e);if(t){let a=vt-o;a||(a=vt),r=r+a}n=vl(r,n),gl(e,n);const i=he(n);return{b:s,o:i,out:n}}function Xp(e,t){if(!t)return e;const n=e.length;if(!n)throw new Error("aes/pcks5: empty ciphertext not allowed");const r=e[n-1];if(r<=0||r>16)throw new Error("aes/pcks5: wrong padding");const o=e.subarray(0,-r);for(let s=0;s<r;s++)if(e[n-s-1]!==r)throw new Error("aes/pcks5: wrong padding");return o}function Qp(e){const t=new Uint8Array(16),n=he(t);t.set(e);const r=vt-e.length;for(let o=vt-r;o<vt;o++)t[o]=r;return n}const _l=Hp({blockSize:16,nonceLength:16},function(t,n,r={}){const o=!r.disablePadding;return{encrypt(s,i){const a=kl(t),{b:c,o:l,out:u}=Zp(s,o,i);let d=n;const f=[a];tn(d)||f.push(d=Mt(d));const p=he(d);let h=p[0],m=p[1],y=p[2],g=p[3],E=0;for(;E+4<=c.length;)h^=c[E+0],m^=c[E+1],y^=c[E+2],g^=c[E+3],{s0:h,s1:m,s2:y,s3:g}=Ca(a,h,m,y,g),l[E++]=h,l[E++]=m,l[E++]=y,l[E++]=g;if(o){const C=Qp(s.subarray(E*4));h^=C[0],m^=C[1],y^=C[2],g^=C[3],{s0:h,s1:m,s2:y,s3:g}=Ca(a,h,m,y,g),l[E++]=h,l[E++]=m,l[E++]=y,l[E++]=g}return cn(...f),u},decrypt(s,i){Yp(s);const a=zp(t);let c=n;const l=[a];tn(c)||l.push(c=Mt(c));const u=he(c);i=vl(s.length,i),tn(s)||l.push(s=Mt(s)),gl(s,i);const d=he(s),f=he(i);let p=u[0],h=u[1],m=u[2],y=u[3];for(let g=0;g+4<=d.length;){const E=p,C=h,$=m,L=y;p=d[g+0],h=d[g+1],m=d[g+2],y=d[g+3];const{s0:O,s1:w,s2:v,s3:b}=Jp(a,p,h,m,y);f[g++]=O^E,f[g++]=w^C,f[g++]=v^$,f[g++]=b^L}return cn(...l),Xp(i,o)}}}),xl=e=>Uint8Array.from(e.split(""),t=>t.charCodeAt(0)),eh=xl("expand 16-byte k"),th=xl("expand 32-byte k"),nh=he(eh),rh=he(th);function W(e,t){return e<<t|e>>>32-t}function ks(e){return e.byteOffset%4===0}const mr=64,oh=16,Sl=2**32-1,Ta=Uint32Array.of();function sh(e,t,n,r,o,s,i,a){const c=o.length,l=new Uint8Array(mr),u=he(l),d=ks(o)&&ks(s),f=d?he(o):Ta,p=d?he(s):Ta;for(let h=0;h<c;i++){if(e(t,n,r,u,i,a),i>=Sl)throw new Error("arx: counter overflow");const m=Math.min(mr,c-h);if(d&&m===mr){const y=h/4;if(h%4!==0)throw new Error("arx: invalid block position");for(let g=0,E;g<oh;g++)E=y+g,p[E]=f[E]^u[g];h+=mr;continue}for(let y=0,g;y<m;y++)g=h+y,s[g]=o[g]^l[y];h+=m}}function ih(e,t){const{allowShortKeys:n,extendNonceFn:r,counterLength:o,counterRight:s,rounds:i}=qp({allowShortKeys:!1,counterLength:8,counterRight:!1,rounds:20},t);if(typeof e!="function")throw new Error("core must be a function");return Wo(o),Wo(i),Aa(s),Aa(n),(a,c,l,u,d=0)=>{ge(a,void 0,"key"),ge(c,void 0,"nonce"),ge(l,void 0,"data");const f=l.length;if(u===void 0&&(u=new Uint8Array(f)),ge(u,void 0,"output"),Wo(d),d<0||d>=Sl)throw new Error("arx: counter overflow");if(u.length<f)throw new Error(`arx: output (${u.length}) is shorter than data (${f})`);const p=[];let h=a.length,m,y;if(h===32)p.push(m=Mt(a)),y=rh;else if(h===16&&n)m=new Uint8Array(32),m.set(a),m.set(a,16),y=nh,p.push(m);else throw ge(a,32,"arx key"),new Error("invalid key size");ks(c)||p.push(c=Mt(c));const g=he(m);if(r){if(c.length!==24)throw new Error("arx: extended nonce must be 24 bytes");r(y,g,he(c.subarray(0,16)),g),c=c.subarray(16)}const E=16-o;if(E!==c.length)throw new Error(`arx: nonce must be ${E} or 16 bytes`);if(E!==12){const $=new Uint8Array(12);$.set(c,s?0:12-c.length),c=$,p.push(c)}const C=he(c);return sh(e,y,g,C,l,u,d,i),cn(...p),u}}function ah(e,t,n,r,o,s=20){let i=e[0],a=e[1],c=e[2],l=e[3],u=t[0],d=t[1],f=t[2],p=t[3],h=t[4],m=t[5],y=t[6],g=t[7],E=o,C=n[0],$=n[1],L=n[2],O=i,w=a,v=c,b=l,x=u,S=d,A=f,k=p,R=h,I=m,N=y,T=g,M=E,B=C,P=$,U=L;for(let V=0;V<s;V+=2)O=O+x|0,M=W(M^O,16),R=R+M|0,x=W(x^R,12),O=O+x|0,M=W(M^O,8),R=R+M|0,x=W(x^R,7),w=w+S|0,B=W(B^w,16),I=I+B|0,S=W(S^I,12),w=w+S|0,B=W(B^w,8),I=I+B|0,S=W(S^I,7),v=v+A|0,P=W(P^v,16),N=N+P|0,A=W(A^N,12),v=v+A|0,P=W(P^v,8),N=N+P|0,A=W(A^N,7),b=b+k|0,U=W(U^b,16),T=T+U|0,k=W(k^T,12),b=b+k|0,U=W(U^b,8),T=T+U|0,k=W(k^T,7),O=O+S|0,U=W(U^O,16),N=N+U|0,S=W(S^N,12),O=O+S|0,U=W(U^O,8),N=N+U|0,S=W(S^N,7),w=w+A|0,M=W(M^w,16),T=T+M|0,A=W(A^T,12),w=w+A|0,M=W(M^w,8),T=T+M|0,A=W(A^T,7),v=v+k|0,B=W(B^v,16),R=R+B|0,k=W(k^R,12),v=v+k|0,B=W(B^v,8),R=R+B|0,k=W(k^R,7),b=b+x|0,P=W(P^b,16),I=I+P|0,x=W(x^I,12),b=b+x|0,P=W(P^b,8),I=I+P|0,x=W(x^I,7);let D=0;r[D++]=i+O|0,r[D++]=a+w|0,r[D++]=c+v|0,r[D++]=l+b|0,r[D++]=u+x|0,r[D++]=d+S|0,r[D++]=f+A|0,r[D++]=p+k|0,r[D++]=h+R|0,r[D++]=m+I|0,r[D++]=y+N|0,r[D++]=g+T|0,r[D++]=E+M|0,r[D++]=C+B|0,r[D++]=$+P|0,r[D++]=L+U|0}const yo=ih(ah,{counterRight:!1,counterLength:4,allowShortKeys:!1});function Il(e,t,n){return Xn(e),n===void 0&&(n=new Uint8Array(e.outputLen)),st(e,n,t)}const Jo=Uint8Array.of(0),Na=Uint8Array.of();function Rl(e,t,n,r=32){Xn(e),Re(r,"length");const o=e.outputLen;if(r>255*o)throw new Error("Length must be <= 255*HashLen");const s=Math.ceil(r/o);n===void 0?n=Na:G(n,void 0,"info");const i=new Uint8Array(s*o),a=st.create(e,t),c=a._cloneInto(),l=new Uint8Array(a.outputLen);for(let u=0;u<s;u++)Jo[0]=u+1,c.update(u===0?Na:l).update(n).update(Jo).digestInto(l),i.set(l,o*u),a._cloneInto(c);return a.destroy(),c.destroy(),Ve(l,Jo),i.slice(0,r)}var ch=Object.defineProperty,Q=(e,t)=>{for(var n in t)ch(e,n,{get:t[n],enumerable:!0})},Kt=Symbol("verified"),lh=e=>e instanceof Object;function ci(e){if(!lh(e)||typeof e.kind!="number"||typeof e.content!="string"||typeof e.created_at!="number"||typeof e.pubkey!="string"||!e.pubkey.match(/^[a-f0-9]{64}$/)||!Array.isArray(e.tags))return!1;for(let t=0;t<e.tags.length;t++){let n=e.tags[t];if(!Array.isArray(n))return!1;for(let r=0;r<n.length;r++)if(typeof n[r]!="string")return!1}return!0}var uh={};Q(uh,{binarySearch:()=>li,bytesToHex:()=>H,hexToBytes:()=>z,insertEventIntoAscendingList:()=>ph,insertEventIntoDescendingList:()=>fh,mergeReverseSortedLists:()=>hh,normalizeURL:()=>dh,utf8Decoder:()=>nt,utf8Encoder:()=>Ae});var nt=new TextDecoder("utf-8"),Ae=new TextEncoder;function dh(e){try{e.indexOf("://")===-1&&(e="wss://"+e);let t=new URL(e);return t.protocol==="http:"?t.protocol="ws:":t.protocol==="https:"&&(t.protocol="wss:"),t.pathname=t.pathname.replace(/\/+/g,"/"),t.pathname.endsWith("/")&&(t.pathname=t.pathname.slice(0,-1)),(t.port==="80"&&t.protocol==="ws:"||t.port==="443"&&t.protocol==="wss:")&&(t.port=""),t.searchParams.sort(),t.hash="",t.toString()}catch{throw new Error(`Invalid URL: ${e}`)}}function fh(e,t){const[n,r]=li(e,o=>t.id===o.id?0:t.created_at===o.created_at?-1:o.created_at-t.created_at);return r||e.splice(n,0,t),e}function ph(e,t){const[n,r]=li(e,o=>t.id===o.id?0:t.created_at===o.created_at?-1:t.created_at-o.created_at);return r||e.splice(n,0,t),e}function li(e,t){let n=0,r=e.length-1;for(;n<=r;){const o=Math.floor((n+r)/2),s=t(e[o]);if(s===0)return[o,!0];s<0?r=o-1:n=o+1}return[n,!1]}function hh(e,t){const n=new Array(e.length+t.length);n.length=0;let r=0,o=0,s=[];for(;r<e.length&&o<t.length;){let i;if(e[r]?.created_at>t[o]?.created_at?(i=e[r],r++):(i=t[o],o++),n.length>0&&n[n.length-1].created_at===i.created_at){if(s.includes(i.id))continue}else s.length=0;n.push(i),s.push(i.id)}for(;r<e.length;){const i=e[r];if(r++,n.length>0&&n[n.length-1].created_at===i.created_at){if(s.includes(i.id))continue}else s.length=0;n.push(i),s.push(i.id)}for(;o<t.length;){const i=t[o];if(o++,n.length>0&&n[n.length-1].created_at===i.created_at){if(s.includes(i.id))continue}else s.length=0;n.push(i),s.push(i.id)}return n}var mh=class{generateSecretKey(){return te.utils.randomSecretKey()}getPublicKey(t){return H(te.getPublicKey(t))}finalizeEvent(t,n){const r=t;return r.pubkey=H(te.getPublicKey(n)),r.id=Ar(r),r.sig=H(te.sign(z(Ar(r)),n)),r[Kt]=!0,r}verifyEvent(t){if(typeof t[Kt]=="boolean")return t[Kt];try{const n=Ar(t);if(n!==t.id)return t[Kt]=!1,!1;const r=te.verify(z(t.sig),z(n),z(t.pubkey));return t[Kt]=r,r}catch{return t[Kt]=!1,!1}}};function yh(e){if(!ci(e))throw new Error("can't serialize event with wrong or missing properties");return JSON.stringify([0,e.pubkey,e.created_at,e.kind,e.tags,e.content])}function Ar(e){let t=ce(Ae.encode(yh(e)));return H(t)}var go=new mh,gh=go.generateSecretKey,bo=go.getPublicKey,Je=go.finalizeEvent,ui=go.verifyEvent,bh={};Q(bh,{Application:()=>Tm,BadgeAward:()=>Ih,BadgeDefinition:()=>_m,BlockedRelaysList:()=>sm,BlossomServerList:()=>fm,BookmarkList:()=>nm,Bookmarksets:()=>wm,Calendar:()=>Pm,CalendarEventRSVP:()=>Um,ChannelCreation:()=>$l,ChannelHideMessage:()=>Bl,ChannelMessage:()=>Ml,ChannelMetadata:()=>Ol,ChannelMuteUser:()=>Pl,ChatMessage:()=>Rh,ClassifiedListing:()=>$m,ClientAuth:()=>Dl,Comment:()=>Bh,CommunitiesList:()=>rm,CommunityDefinition:()=>Hm,CommunityPostApproval:()=>Gh,Contacts:()=>_h,CreateOrUpdateProduct:()=>Im,CreateOrUpdateStall:()=>Sm,Curationsets:()=>Em,Date:()=>Mm,DirectMessageRelaysList:()=>um,DraftClassifiedListing:()=>Om,DraftLong:()=>Am,Emojisets:()=>Cm,EncryptedDirectMessage:()=>xh,EventDeletion:()=>Sh,FavoriteRelays:()=>am,FileMessage:()=>Ch,FileMetadata:()=>Mh,FileServerPreference:()=>dm,Followsets:()=>gm,ForumThread:()=>Ah,GenericRepost:()=>mi,Genericlists:()=>bm,GiftWrap:()=>Ul,GroupMetadata:()=>Fm,HTTPAuth:()=>yi,Handlerinformation:()=>qm,Handlerrecommendation:()=>jm,Highlights:()=>Zh,InterestsList:()=>cm,Interestsets:()=>xm,JobFeedback:()=>Wh,JobRequest:()=>Vh,JobResult:()=>Kh,Label:()=>Fh,LightningPubRPC:()=>hm,LiveChatMessage:()=>Ph,LiveEvent:()=>Nm,LongFormArticle:()=>Rm,Metadata:()=>Eh,Mutelist:()=>Qh,NWCWalletInfo:()=>pm,NWCWalletRequest:()=>jl,NWCWalletResponse:()=>mm,NormalVideo:()=>Nh,NostrConnect:()=>ym,OpenTimestamps:()=>$h,Photo:()=>Th,Pinlist:()=>em,Poll:()=>Oh,PollResponse:()=>Xh,PrivateDirectMessage:()=>Ll,ProblemTracker:()=>jh,ProfileBadges:()=>km,PublicChatsList:()=>om,Reaction:()=>hi,RecommendRelay:()=>kh,RelayList:()=>tm,RelayReview:()=>Dm,Relaysets:()=>vm,Report:()=>qh,Reporting:()=>Hh,Repost:()=>pi,Seal:()=>Nl,SearchRelaysList:()=>im,ShortTextNote:()=>Tl,ShortVideo:()=>Lh,Time:()=>Bm,UserEmojiList:()=>lm,UserStatuses:()=>Lm,Voice:()=>Uh,VoiceComment:()=>Dh,Zap:()=>Yh,ZapGoal:()=>zh,ZapRequest:()=>Jh,classifyKind:()=>vh,isAddressableKind:()=>fi,isEphemeralKind:()=>Cl,isKind:()=>wh,isRegularKind:()=>Al,isReplaceableKind:()=>di});function Al(e){return e<1e4&&e!==0&&e!==3}function di(e){return e===0||e===3||1e4<=e&&e<2e4}function Cl(e){return 2e4<=e&&e<3e4}function fi(e){return 3e4<=e&&e<4e4}function vh(e){return Al(e)?"regular":di(e)?"replaceable":Cl(e)?"ephemeral":fi(e)?"parameterized":"unknown"}function wh(e,t){const n=t instanceof Array?t:[t];return ci(e)&&n.includes(e.kind)||!1}var Eh=0,Tl=1,kh=2,_h=3,xh=4,Sh=5,pi=6,hi=7,Ih=8,Rh=9,Ah=11,Nl=13,Ll=14,Ch=15,mi=16,Th=20,Nh=21,Lh=22,$l=40,Ol=41,Ml=42,Bl=43,Pl=44,$h=1040,Ul=1059,Oh=1068,Mh=1063,Bh=1111,Ph=1311,Uh=1222,Dh=1244,jh=1971,qh=1984,Hh=1984,Fh=1985,Gh=4550,Vh=5999,Kh=6999,Wh=7e3,zh=9041,Jh=9734,Yh=9735,Zh=9802,Xh=1018,Qh=1e4,em=10001,tm=10002,nm=10003,rm=10004,om=10005,sm=10006,im=10007,am=10012,cm=10015,lm=10030,um=10050,dm=10096,fm=10063,pm=13194,hm=21e3,Dl=22242,jl=23194,mm=23195,ym=24133,yi=27235,gm=3e4,bm=30001,vm=30002,wm=30003,Em=30004,km=30008,_m=30009,xm=30015,Sm=30017,Im=30018,Rm=30023,Am=30024,Cm=30030,Tm=30078,Nm=30311,Lm=30315,$m=30402,Om=30403,Mm=31922,Bm=31923,Pm=31924,Um=31925,Dm=31987,jm=31989,qm=31990,Hm=34550,Fm=39e3,Gm={};Q(Gm,{getHex64:()=>gi,getInt:()=>ql,getSubscriptionId:()=>Vm,matchEventId:()=>Km,matchEventKind:()=>zm,matchEventPubkey:()=>Wm});function gi(e,t){let n=t.length+3,r=e.indexOf(`"${t}":`)+n,o=e.slice(r).indexOf('"')+r+1;return e.slice(o,o+64)}function ql(e,t){let n=t.length,r=e.indexOf(`"${t}":`)+n+3,o=e.slice(r),s=Math.min(o.indexOf(","),o.indexOf("}"));return parseInt(o.slice(0,s),10)}function Vm(e){let t=e.slice(0,22).indexOf('"EVENT"');if(t===-1)return null;let n=e.slice(t+7+1).indexOf('"');if(n===-1)return null;let r=t+7+1+n,o=e.slice(r+1,80).indexOf('"');if(o===-1)return null;let s=r+1+o;return e.slice(r+1,s)}function Km(e,t){return t===gi(e,"id")}function Wm(e,t){return t===gi(e,"pubkey")}function zm(e,t){return t===ql(e,"kind")}var Jm={};Q(Jm,{makeAuthEvent:()=>Ym});function Ym(e,t){return{kind:Dl,created_at:Math.floor(Date.now()/1e3),tags:[["relay",e],["challenge",t]],content:""}}var Zm;try{Zm=WebSocket}catch{}var Xm;try{Xm=WebSocket}catch{}var Qm={};Q(Qm,{BECH32_REGEX:()=>Hl,Bech32MaxSize:()=>bi,NostrTypeGuard:()=>ey,decode:()=>vo,decodeNostrURI:()=>ny,encodeBytes:()=>Eo,naddrEncode:()=>cy,neventEncode:()=>ay,noteEncode:()=>sy,nprofileEncode:()=>iy,npubEncode:()=>oy,nsecEncode:()=>ry});var ey={isNProfile:e=>/^nprofile1[a-z\d]+$/.test(e||""),isNEvent:e=>/^nevent1[a-z\d]+$/.test(e||""),isNAddr:e=>/^naddr1[a-z\d]+$/.test(e||""),isNSec:e=>/^nsec1[a-z\d]{58}$/.test(e||""),isNPub:e=>/^npub1[a-z\d]{58}$/.test(e||""),isNote:e=>/^note1[a-z\d]+$/.test(e||""),isNcryptsec:e=>/^ncryptsec1[a-z\d]+$/.test(e||"")},bi=5e3,Hl=/[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;function ty(e){const t=new Uint8Array(4);return t[0]=e>>24&255,t[1]=e>>16&255,t[2]=e>>8&255,t[3]=e&255,t}function ny(e){try{return e.startsWith("nostr:")&&(e=e.substring(6)),vo(e)}catch{return{type:"invalid",data:null}}}function vo(e){let{prefix:t,words:n}=We.decode(e,bi),r=new Uint8Array(We.fromWords(n));switch(t){case"nprofile":{let o=Yo(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for nprofile");if(o[0][0].length!==32)throw new Error("TLV 0 should be 32 bytes");return{type:"nprofile",data:{pubkey:H(o[0][0]),relays:o[1]?o[1].map(s=>nt.decode(s)):[]}}}case"nevent":{let o=Yo(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for nevent");if(o[0][0].length!==32)throw new Error("TLV 0 should be 32 bytes");if(o[2]&&o[2][0].length!==32)throw new Error("TLV 2 should be 32 bytes");if(o[3]&&o[3][0].length!==4)throw new Error("TLV 3 should be 4 bytes");return{type:"nevent",data:{id:H(o[0][0]),relays:o[1]?o[1].map(s=>nt.decode(s)):[],author:o[2]?.[0]?H(o[2][0]):void 0,kind:o[3]?.[0]?parseInt(H(o[3][0]),16):void 0}}}case"naddr":{let o=Yo(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for naddr");if(!o[2]?.[0])throw new Error("missing TLV 2 for naddr");if(o[2][0].length!==32)throw new Error("TLV 2 should be 32 bytes");if(!o[3]?.[0])throw new Error("missing TLV 3 for naddr");if(o[3][0].length!==4)throw new Error("TLV 3 should be 4 bytes");return{type:"naddr",data:{identifier:nt.decode(o[0][0]),pubkey:H(o[2][0]),kind:parseInt(H(o[3][0]),16),relays:o[1]?o[1].map(s=>nt.decode(s)):[]}}}case"nsec":return{type:t,data:r};case"npub":case"note":return{type:t,data:H(r)};default:throw new Error(`unknown prefix ${t}`)}}function Yo(e){let t={},n=e;for(;n.length>0;){let r=n[0],o=n[1],s=n.slice(2,2+o);if(n=n.slice(2+o),s.length<o)throw new Error(`not enough data to read on TLV ${r}`);t[r]=t[r]||[],t[r].push(s)}return t}function ry(e){return Eo("nsec",e)}function oy(e){return Eo("npub",z(e))}function sy(e){return Eo("note",z(e))}function wo(e,t){let n=We.toWords(t);return We.encode(e,n,bi)}function Eo(e,t){return wo(e,t)}function iy(e){let t=vi({0:[z(e.pubkey)],1:(e.relays||[]).map(n=>Ae.encode(n))});return wo("nprofile",t)}function ay(e){let t;e.kind!==void 0&&(t=ty(e.kind));let n=vi({0:[z(e.id)],1:(e.relays||[]).map(r=>Ae.encode(r)),2:e.author?[z(e.author)]:[],3:t?[new Uint8Array(t)]:[]});return wo("nevent",n)}function cy(e){let t=new ArrayBuffer(4);new DataView(t).setUint32(0,e.kind,!1);let n=vi({0:[Ae.encode(e.identifier)],1:(e.relays||[]).map(r=>Ae.encode(r)),2:[z(e.pubkey)],3:[new Uint8Array(t)]});return wo("naddr",n)}function vi(e){let t=[];return Object.entries(e).reverse().forEach(([n,r])=>{r.forEach(o=>{let s=new Uint8Array(o.length+2);s.set([parseInt(n)],0),s.set([o.length],1),s.set(o,2),t.push(s)})}),oe(...t)}var ly={};Q(ly,{decrypt:()=>uy,encrypt:()=>Fl});function Fl(e,t,n){const r=e instanceof Uint8Array?e:z(e),o=je.getSharedSecret(r,z("02"+t)),s=Gl(o);let i=Uint8Array.from(Et(16)),a=Ae.encode(n),c=_l(s,i).encrypt(a),l=Ke.encode(new Uint8Array(c)),u=Ke.encode(new Uint8Array(i.buffer));return`${l}?iv=${u}`}function uy(e,t,n){const r=e instanceof Uint8Array?e:z(e);let[o,s]=n.split("?iv="),i=je.getSharedSecret(r,z("02"+t)),a=Gl(i),c=Ke.decode(s),l=Ke.decode(o),u=_l(a,c).decrypt(l);return nt.decode(u)}function Gl(e){return e.slice(1,33)}var dy={};Q(dy,{NIP05_REGEX:()=>wi,isNip05:()=>fy,isValid:()=>my,queryProfile:()=>Vl,searchDomain:()=>hy,useFetchImplementation:()=>py});var wi=/^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/,fy=e=>wi.test(e||""),ko;try{ko=fetch}catch{}function py(e){ko=e}async function hy(e,t=""){try{const n=`https://${e}/.well-known/nostr.json?name=${t}`,r=await ko(n,{redirect:"manual"});if(r.status!==200)throw Error("Wrong response code");return(await r.json()).names}catch{return{}}}async function Vl(e){const t=e.match(wi);if(!t)return null;const[,n="_",r]=t;try{const o=`https://${r}/.well-known/nostr.json?name=${n}`,s=await ko(o,{redirect:"manual"});if(s.status!==200)throw Error("Wrong response code");const i=await s.json(),a=i.names[n];return a?{pubkey:a,relays:i.relays?.[a]}:null}catch{return null}}async function my(e,t){const n=await Vl(t);return n?n.pubkey===e:!1}var yy={};Q(yy,{parse:()=>gy});function gy(e){const t={reply:void 0,root:void 0,mentions:[],profiles:[],quotes:[]};let n,r;for(let o=e.tags.length-1;o>=0;o--){const s=e.tags[o];if(s[0]==="e"&&s[1]){const[i,a,c,l,u]=s,d={id:a,relays:c?[c]:[],author:u};if(l==="root"){t.root=d;continue}if(l==="reply"){t.reply=d;continue}if(l==="mention"){t.mentions.push(d);continue}n?r=d:n=d,t.mentions.push(d);continue}if(s[0]==="q"&&s[1]){const[i,a,c]=s;t.quotes.push({id:a,relays:c?[c]:[]})}if(s[0]==="p"&&s[1]){t.profiles.push({pubkey:s[1],relays:s[2]?[s[2]]:[]});continue}}return t.root||(t.root=r||n||t.reply),t.reply||(t.reply=n||t.root),[t.reply,t.root].forEach(o=>{if(!o)return;let s=t.mentions.indexOf(o);if(s!==-1&&t.mentions.splice(s,1),o.author){let i=t.profiles.find(a=>a.pubkey===o.author);i&&i.relays&&(o.relays||(o.relays=[]),i.relays.forEach(a=>{o.relays?.indexOf(a)===-1&&o.relays.push(a)}),i.relays=o.relays)}}),t.mentions.forEach(o=>{if(o.author){let s=t.profiles.find(i=>i.pubkey===o.author);s&&s.relays&&(o.relays||(o.relays=[]),s.relays.forEach(i=>{o.relays.indexOf(i)===-1&&o.relays.push(i)}),s.relays=o.relays)}}),t}var by={};Q(by,{fetchRelayInformation:()=>wy,useFetchImplementation:()=>vy});var Kl;try{Kl=fetch}catch{}function vy(e){Kl=e}async function wy(e){return await(await fetch(e.replace("ws://","http://").replace("wss://","https://"),{headers:{Accept:"application/nostr+json"}})).json()}var Ey={};Q(Ey,{getPow:()=>ky,minePow:()=>xy});function ky(e){let t=0;for(let n=0;n<64;n+=8){const r=parseInt(e.substring(n,n+8),16);if(r===0)t+=32;else{t+=Math.clz32(r);break}}return t}function _y(e){let t=0;for(let n=0;n<e.length;n++){const r=e[n];if(r===0)t+=8;else{t+=Math.clz32(r)-24;break}}return t}function xy(e,t){let n=0;const r=e,o=["nonce",n.toString(),t.toString()];for(r.tags.push(o);;){const s=Math.floor(new Date().getTime()/1e3);s!==r.created_at&&(n=0,r.created_at=s),o[1]=(++n).toString();const i=ce(Ae.encode(JSON.stringify([0,r.pubkey,r.created_at,r.kind,r.tags,r.content])));if(_y(i)>=t){r.id=H(i);break}}return r}var Sy={};Q(Sy,{unwrapEvent:()=>Py,unwrapManyEvents:()=>Uy,wrapEvent:()=>su,wrapManyEvents:()=>By});var Iy={};Q(Iy,{createRumor:()=>tu,createSeal:()=>nu,createWrap:()=>ru,unwrapEvent:()=>Si,unwrapManyEvents:()=>ou,wrapEvent:()=>zr,wrapManyEvents:()=>Oy});var Ry={};Q(Ry,{decrypt:()=>xi,encrypt:()=>_i,getConversationKey:()=>Ei,v2:()=>Ly});var Wl=1,zl=65535;function Ei(e,t){const n=je.getSharedSecret(e,z("02"+t)).subarray(1,33);return Il(ce,n,Ae.encode("nip44-v2"))}function Jl(e,t){const n=Rl(ce,e,t,76);return{chacha_key:n.subarray(0,32),chacha_nonce:n.subarray(32,44),hmac_key:n.subarray(44,76)}}function ki(e){if(!Number.isSafeInteger(e)||e<1)throw new Error("expected positive integer");if(e<=32)return 32;const t=1<<Math.floor(Math.log2(e-1))+1,n=t<=256?32:t/8;return n*(Math.floor((e-1)/n)+1)}function Ay(e){if(!Number.isSafeInteger(e)||e<Wl||e>zl)throw new Error("invalid plaintext size: must be between 1 and 65535 bytes");const t=new Uint8Array(2);return new DataView(t.buffer).setUint16(0,e,!1),t}function Cy(e){const t=Ae.encode(e),n=t.length,r=Ay(n),o=new Uint8Array(ki(n)-n);return oe(r,t,o)}function Ty(e){const t=new DataView(e.buffer).getUint16(0),n=e.subarray(2,2+t);if(t<Wl||t>zl||n.length!==t||e.length!==2+ki(t))throw new Error("invalid padding");return nt.decode(n)}function Yl(e,t,n){if(n.length!==32)throw new Error("AAD associated data must be 32 bytes");const r=oe(n,t);return st(ce,e,r)}function Ny(e){if(typeof e!="string")throw new Error("payload must be a valid string");const t=e.length;if(t<132||t>87472)throw new Error("invalid payload length: "+t);if(e[0]==="#")throw new Error("unknown encryption version");let n;try{n=Ke.decode(e)}catch(s){throw new Error("invalid base64: "+s.message)}const r=n.length;if(r<99||r>65603)throw new Error("invalid data length: "+r);const o=n[0];if(o!==2)throw new Error("unknown encryption version "+o);return{nonce:n.subarray(1,33),ciphertext:n.subarray(33,-32),mac:n.subarray(-32)}}function _i(e,t,n=Et(32)){const{chacha_key:r,chacha_nonce:o,hmac_key:s}=Jl(t,n),i=Cy(e),a=yo(r,o,i),c=Yl(s,a,n);return Ke.encode(oe(new Uint8Array([2]),n,a,c))}function xi(e,t){const{nonce:n,ciphertext:r,mac:o}=Ny(e),{chacha_key:s,chacha_nonce:i,hmac_key:a}=Jl(t,n),c=Yl(a,r,n);if(!bl(c,o))throw new Error("invalid MAC");const l=yo(s,i,r);return Ty(l)}var Ly={utils:{getConversationKey:Ei,calcPaddedLen:ki},encrypt:_i,decrypt:xi},$y=2880*60,Zl=()=>Math.round(Date.now()/1e3),Xl=()=>Math.round(Zl()-Math.random()*$y),Ql=(e,t)=>Ei(e,t),eu=(e,t,n)=>_i(JSON.stringify(e),Ql(t,n)),La=(e,t)=>JSON.parse(xi(e.content,Ql(t,e.pubkey)));function tu(e,t){const n={created_at:Zl(),content:"",tags:[],...e,pubkey:bo(t)};return n.id=Ar(n),n}function nu(e,t,n){return Je({kind:Nl,content:eu(e,t,n),created_at:Xl(),tags:[]},t)}function ru(e,t){const n=gh();return Je({kind:Ul,content:eu(e,n,t),created_at:Xl(),tags:[["p",t]]},n)}function zr(e,t,n){const r=tu(e,t),o=nu(r,t,n);return ru(o,n)}function Oy(e,t,n){if(!n||n.length===0)throw new Error("At least one recipient is required.");const r=bo(t),o=[zr(e,t,r)];return n.forEach(s=>{o.push(zr(e,t,s))}),o}function Si(e,t){const n=La(e,t);return La(n,t)}function ou(e,t){let n=[];return e.forEach(r=>{n.push(Si(r,t))}),n.sort((r,o)=>r.created_at-o.created_at),n}function My(e,t,n,r){const o={created_at:Math.ceil(Date.now()/1e3),kind:Ll,tags:[],content:t};return(Array.isArray(e)?e:[e]).forEach(({publicKey:i,relayUrl:a})=>{o.tags.push(a?["p",i,a]:["p",i])}),r&&o.tags.push(["e",r.eventId,r.relayUrl||"","reply"]),n&&o.tags.push(["subject",n]),o}function su(e,t,n,r,o){const s=My(t,n,r,o);return zr(s,e,t.publicKey)}function By(e,t,n,r,o){if(!t||t.length===0)throw new Error("At least one recipient is required.");return[{publicKey:bo(e)},...t].map(i=>su(e,i,n,r,o))}var Py=Si,Uy=ou,Dy={};Q(Dy,{finishRepostEvent:()=>jy,getRepostedEvent:()=>qy,getRepostedEventPointer:()=>iu});function jy(e,t,n,r){let o;const s=[...e.tags??[],["e",t.id,n],["p",t.pubkey]];return t.kind===Tl?o=pi:(o=mi,s.push(["k",String(t.kind)])),Je({kind:o,tags:s,content:e.content===""||t.tags?.find(i=>i[0]==="-")?"":JSON.stringify(t),created_at:e.created_at},r)}function iu(e){if(![pi,mi].includes(e.kind))return;let t,n;for(let r=e.tags.length-1;r>=0&&(t===void 0||n===void 0);r--){const o=e.tags[r];o.length>=2&&(o[0]==="e"&&t===void 0?t=o:o[0]==="p"&&n===void 0&&(n=o))}if(t!==void 0)return{id:t[1],relays:[t[2],n?.[2]].filter(r=>typeof r=="string"),author:n?.[1]}}function qy(e,{skipVerification:t}={}){const n=iu(e);if(n===void 0||e.content==="")return;let r;try{r=JSON.parse(e.content)}catch{return}if(r.id===n.id&&!(!t&&!ui(r)))return r}var Hy={};Q(Hy,{NOSTR_URI_REGEX:()=>Ii,parse:()=>Gy,test:()=>Fy});var Ii=new RegExp(`nostr:(${Hl.source})`);function Fy(e){return typeof e=="string"&&new RegExp(`^${Ii.source}$`).test(e)}function Gy(e){const t=e.match(new RegExp(`^${Ii.source}$`));if(!t)throw new Error(`Invalid Nostr URI: ${e}`);return{uri:t[0],value:t[1],decoded:vo(t[1])}}var Vy={};Q(Vy,{finishReactionEvent:()=>Ky,getReactedEventPointer:()=>Wy});function Ky(e,t,n){const r=t.tags.filter(o=>o.length>=2&&(o[0]==="e"||o[0]==="p"));return Je({...e,kind:hi,tags:[...e.tags??[],...r,["e",t.id],["p",t.pubkey]],content:e.content??"+"},n)}function Wy(e){if(e.kind!==hi)return;let t,n;for(let r=e.tags.length-1;r>=0&&(t===void 0||n===void 0);r--){const o=e.tags[r];o.length>=2&&(o[0]==="e"&&t===void 0?t=o:o[0]==="p"&&n===void 0&&(n=o))}if(!(t===void 0||n===void 0))return{id:t[1],relays:[t[2],n[2]].filter(r=>r!==void 0),author:n[1]}}var zy={};Q(zy,{parse:()=>Yy});var Zo=/\W/m,$a=/[^\w\/] |[^\w\/]$|$|,| /m,Jy=42;function*Yy(e){let t=[];if(typeof e!="string"){for(let s=0;s<e.tags.length;s++){const i=e.tags[s];i[0]==="emoji"&&i.length>=3&&t.push({type:"emoji",shortcode:i[1],url:i[2]})}e=e.content}const n=e.length;let r=0,o=0;e:for(;o<n;){const s=e.indexOf(":",o),i=e.indexOf("#",o);if(s===-1&&i===-1)break e;if(s===-1||i>=0&&i<s){if(i===0||e[i-1].match(Zo)){const a=e.slice(i+1,i+Jy).match(Zo),c=a?i+1+a.index:n;yield{type:"text",text:e.slice(r,i)},yield{type:"hashtag",value:e.slice(i+1,c)},o=c,r=o;continue e}o=i+1;continue e}if(e.slice(s-5,s)==="nostr"){const a=e.slice(s+60).match(Zo),c=a?s+60+a.index:n;try{let l,{data:u,type:d}=vo(e.slice(s+1,c));switch(d){case"npub":l={pubkey:u};break;case"note":l={id:u};break;case"nsec":o=c+1;continue;default:l=u}r!==s-5&&(yield{type:"text",text:e.slice(r,s-5)}),yield{type:"reference",pointer:l},o=c,r=o;continue e}catch{o=s+1;continue e}}else if(e.slice(s-5,s)==="https"||e.slice(s-4,s)==="http"){const a=e.slice(s+4).match($a),c=a?s+4+a.index:n,l=e[s-1]==="s"?5:4;try{let u=new URL(e.slice(s-l,c));if(u.hostname.indexOf(".")===-1)throw new Error("invalid url");if(r!==s-l&&(yield{type:"text",text:e.slice(r,s-l)}),/\.(png|jpe?g|gif|webp|heic|svg)$/i.test(u.pathname)){yield{type:"image",url:u.toString()},o=c,r=o;continue e}if(/\.(mp4|avi|webm|mkv|mov)$/i.test(u.pathname)){yield{type:"video",url:u.toString()},o=c,r=o;continue e}if(/\.(mp3|aac|ogg|opus|wav|flac)$/i.test(u.pathname)){yield{type:"audio",url:u.toString()},o=c,r=o;continue e}yield{type:"url",url:u.toString()},o=c,r=o;continue e}catch{o=c+1;continue e}}else if(e.slice(s-3,s)==="wss"||e.slice(s-2,s)==="ws"){const a=e.slice(s+4).match($a),c=a?s+4+a.index:n,l=e[s-1]==="s"?3:2;try{let u=new URL(e.slice(s-l,c));if(u.hostname.indexOf(".")===-1)throw new Error("invalid ws url");r!==s-l&&(yield{type:"text",text:e.slice(r,s-l)}),yield{type:"relay",url:u.toString()},o=c,r=o;continue e}catch{o=c+1;continue e}}else{for(let a=0;a<t.length;a++){const c=t[a];if(e[s+c.shortcode.length+1]===":"&&e.slice(s+1,s+c.shortcode.length+1)===c.shortcode){r!==s&&(yield{type:"text",text:e.slice(r,s)}),yield c,o=s+c.shortcode.length+2,r=o;continue e}}o=s+1;continue e}}r!==n&&(yield{type:"text",text:e.slice(r)})}var Zy={};Q(Zy,{channelCreateEvent:()=>Xy,channelHideMessageEvent:()=>tg,channelMessageEvent:()=>eg,channelMetadataEvent:()=>Qy,channelMuteUserEvent:()=>ng});var Xy=(e,t)=>{let n;if(typeof e.content=="object")n=JSON.stringify(e.content);else if(typeof e.content=="string")n=e.content;else return;return Je({kind:$l,tags:[...e.tags??[]],content:n,created_at:e.created_at},t)},Qy=(e,t)=>{let n;if(typeof e.content=="object")n=JSON.stringify(e.content);else if(typeof e.content=="string")n=e.content;else return;return Je({kind:Ol,tags:[["e",e.channel_create_event_id],...e.tags??[]],content:n,created_at:e.created_at},t)},eg=(e,t)=>{const n=[["e",e.channel_create_event_id,e.relay_url,"root"]];return e.reply_to_channel_message_event_id&&n.push(["e",e.reply_to_channel_message_event_id,e.relay_url,"reply"]),Je({kind:Ml,tags:[...n,...e.tags??[]],content:e.content,created_at:e.created_at},t)},tg=(e,t)=>{let n;if(typeof e.content=="object")n=JSON.stringify(e.content);else if(typeof e.content=="string")n=e.content;else return;return Je({kind:Bl,tags:[["e",e.channel_message_event_id],...e.tags??[]],content:n,created_at:e.created_at},t)},ng=(e,t)=>{let n;if(typeof e.content=="object")n=JSON.stringify(e.content);else if(typeof e.content=="string")n=e.content;else return;return Je({kind:Pl,tags:[["p",e.pubkey_to_mute],...e.tags??[]],content:n,created_at:e.created_at},t)},rg={};Q(rg,{EMOJI_SHORTCODE_REGEX:()=>au,matchAll:()=>og,regex:()=>Ri,replaceAll:()=>sg});var au=/:(\w+):/,Ri=()=>new RegExp(`\\B${au.source}\\B`,"g");function*og(e){const t=e.matchAll(Ri());for(const n of t)try{const[r,o]=n;yield{shortcode:r,name:o,start:n.index,end:n.index+r.length}}catch{}}function sg(e,t){return e.replaceAll(Ri(),(n,r)=>t({shortcode:n,name:r}))}var ig={};Q(ig,{useFetchImplementation:()=>ag,validateGithub:()=>cg});var Ai;try{Ai=fetch}catch{}function ag(e){Ai=e}async function cg(e,t,n){try{return await(await Ai(`https://gist.github.com/${t}/${n}/raw`)).text()===`Verifying that I control the following Nostr public key: ${e}`}catch{return!1}}var lg={};Q(lg,{makeNwcRequestEvent:()=>dg,parseConnectionString:()=>ug});function ug(e){const{host:t,pathname:n,searchParams:r}=new URL(e),o=n||t,s=r.get("relay"),i=r.get("secret");if(!o||!s||!i)throw new Error("invalid connection string");return{pubkey:o,relay:s,secret:i}}async function dg(e,t,n){const o=Fl(t,e,JSON.stringify({method:"pay_invoice",params:{invoice:n}})),s={kind:jl,created_at:Math.round(Date.now()/1e3),content:o,tags:[["p",e]]};return Je(s,t)}var fg={};Q(fg,{normalizeIdentifier:()=>pg});function pg(e){return e=e.trim().toLowerCase(),e=e.normalize("NFKC"),Array.from(e).map(t=>new RegExp("\\p{Letter}","u").test(t)||new RegExp("\\p{Number}","u").test(t)?t:"-").join("")}var hg={};Q(hg,{getSatoshisAmountFromBolt11:()=>wg,getZapEndpoint:()=>yg,makeZapReceipt:()=>vg,makeZapRequest:()=>gg,useFetchImplementation:()=>mg,validateZapRequest:()=>bg});var Ci;try{Ci=fetch}catch{}function mg(e){Ci=e}async function yg(e){try{let t="",{lud06:n,lud16:r}=JSON.parse(e.content);if(r){let[i,a]=r.split("@");t=new URL(`/.well-known/lnurlp/${i}`,`https://${a}`).toString()}else if(n){let{words:i}=We.decode(n,1e3),a=We.fromWords(i);t=nt.decode(a)}else return null;let s=await(await Ci(t)).json();if(s.allowsNostr&&s.nostrPubkey)return s.callback}catch{}return null}function gg(e){let t={kind:9734,created_at:Math.round(Date.now()/1e3),content:e.comment||"",tags:[["p","pubkey"in e?e.pubkey:e.event.pubkey],["amount",e.amount.toString()],["relays",...e.relays]]};if("event"in e){if(t.tags.push(["e",e.event.id]),di(e.event.kind)){const n=["a",`${e.event.kind}:${e.event.pubkey}:`];t.tags.push(n)}else if(fi(e.event.kind)){let n=e.event.tags.find(([o,s])=>o==="d"&&s);if(!n)throw new Error("d tag not found or is empty");const r=["a",`${e.event.kind}:${e.event.pubkey}:${n[1]}`];t.tags.push(r)}t.tags.push(["k",e.event.kind.toString()])}return t}function bg(e){let t;try{t=JSON.parse(e)}catch{return"Invalid zap request JSON."}if(!ci(t))return"Zap request is not a valid Nostr event.";if(!ui(t))return"Invalid signature on zap request.";let n=t.tags.find(([s,i])=>s==="p"&&i);if(!n)return"Zap request doesn't have a 'p' tag.";if(!n[1].match(/^[a-f0-9]{64}$/))return"Zap request 'p' tag is not valid hex.";let r=t.tags.find(([s,i])=>s==="e"&&i);return r&&!r[1].match(/^[a-f0-9]{64}$/)?"Zap request 'e' tag is not valid hex.":t.tags.find(([s,i])=>s==="relays"&&i)?null:"Zap request doesn't have a 'relays' tag."}function vg({zapRequest:e,preimage:t,bolt11:n,paidAt:r}){let o=JSON.parse(e),s=o.tags.filter(([a])=>a==="e"||a==="p"||a==="a"),i={kind:9735,created_at:Math.round(r.getTime()/1e3),content:"",tags:[...s,["P",o.pubkey],["bolt11",n],["description",e]]};return t&&i.tags.push(["preimage",t]),i}function wg(e){if(e.length<50)return 0;e=e.substring(0,50);const t=e.lastIndexOf("1");if(t===-1)return 0;const n=e.substring(0,t);if(!n.startsWith("lnbc"))return 0;const r=n.substring(4);if(r.length<1)return 0;const o=r[r.length-1],s=o.charCodeAt(0)-48,i=s>=0&&s<=9;let a=r.length-1;if(i&&a++,a<1)return 0;const c=parseInt(r.substring(0,a));switch(o){case"m":return c*1e5;case"u":return c*100;case"n":return c/10;case"p":return c/1e4;default:return c*1e8}}var Eg={};Q(Eg,{Negentropy:()=>lu,NegentropyStorageVector:()=>xg,NegentropySync:()=>Sg});var Xo=97,nn=32,cu=16,kt={Skip:0,Fingerprint:1,IdList:2},Qe=class{_raw;length;constructor(e){typeof e=="number"?(this._raw=new Uint8Array(e),this.length=0):e instanceof Uint8Array?(this._raw=new Uint8Array(e),this.length=e.length):(this._raw=new Uint8Array(512),this.length=0)}unwrap(){return this._raw.subarray(0,this.length)}get capacity(){return this._raw.byteLength}extend(e){if(e instanceof Qe&&(e=e.unwrap()),typeof e.length!="number")throw Error("bad length");const t=e.length+this.length;if(this.capacity<t){const n=this._raw,r=Math.max(this.capacity*2,t);this._raw=new Uint8Array(r),this._raw.set(n)}this._raw.set(e,this.length),this.length+=e.length}shift(){const e=this._raw[0];return this._raw=this._raw.subarray(1),this.length--,e}shiftN(e=1){const t=this._raw.subarray(0,e);return this._raw=this._raw.subarray(e),this.length-=e,t}};function yr(e){let t=0;for(;;){if(e.length===0)throw Error("parse ends prematurely");let n=e.shift();if(t=t<<7|n&127,(n&128)===0)break}return t}function Xe(e){if(e===0)return new Qe(new Uint8Array([0]));let t=[];for(;e!==0;)t.push(e&127),e>>>=7;t.reverse();for(let n=0;n<t.length-1;n++)t[n]|=128;return new Qe(new Uint8Array(t))}function kg(e){return Cr(e,1)[0]}function Cr(e,t){if(e.length<t)throw Error("parse ends prematurely");return e.shiftN(t)}var _g=class{buf;constructor(){this.setToZero()}setToZero(){this.buf=new Uint8Array(nn)}add(e){let t=0,n=0,r=new DataView(this.buf.buffer),o=new DataView(e.buffer);for(let s=0;s<8;s++){let i=s*4,a=r.getUint32(i,!0),c=o.getUint32(i,!0),l=a;l+=t,l+=c,l>4294967295&&(n=1),r.setUint32(i,l&4294967295,!0),t=n,n=0}}negate(){let e=new DataView(this.buf.buffer);for(let n=0;n<8;n++){let r=n*4;e.setUint32(r,~e.getUint32(r,!0))}let t=new Uint8Array(nn);t[0]=1,this.add(t)}getFingerprint(e){let t=new Qe;return t.extend(this.buf),t.extend(Xe(e)),ce(t.unwrap()).subarray(0,cu)}},xg=class{items;sealed;constructor(){this.items=[],this.sealed=!1}insert(e,t){if(this.sealed)throw Error("already sealed");const n=z(t);if(n.byteLength!==nn)throw Error("bad id size for added item");this.items.push({timestamp:e,id:n})}seal(){if(this.sealed)throw Error("already sealed");this.sealed=!0,this.items.sort(Qo);for(let e=1;e<this.items.length;e++)if(Qo(this.items[e-1],this.items[e])===0)throw Error("duplicate item inserted")}unseal(){this.sealed=!1}size(){return this._checkSealed(),this.items.length}getItem(e){if(this._checkSealed(),e>=this.items.length)throw Error("out of range");return this.items[e]}iterate(e,t,n){this._checkSealed(),this._checkBounds(e,t);for(let r=e;r<t&&n(this.items[r],r);++r);}findLowerBound(e,t,n){return this._checkSealed(),this._checkBounds(e,t),this._binarySearch(this.items,e,t,r=>Qo(r,n)<0)}fingerprint(e,t){let n=new _g;return n.setToZero(),this.iterate(e,t,r=>(n.add(r.id),!0)),n.getFingerprint(t-e)}_checkSealed(){if(!this.sealed)throw Error("not sealed")}_checkBounds(e,t){if(e>t||t>this.items.length)throw Error("bad range")}_binarySearch(e,t,n,r){let o=n-t;for(;o>0;){let s=t,i=Math.floor(o/2);s+=i,r(e[s])?(t=++s,o-=i+1):o=i}return t}},lu=class{storage;frameSizeLimit;lastTimestampIn;lastTimestampOut;constructor(e,t=6e4){if(t<4096)throw Error("frameSizeLimit too small");this.storage=e,this.frameSizeLimit=t,this.lastTimestampIn=0,this.lastTimestampOut=0}_bound(e,t){return{timestamp:e,id:t||new Uint8Array(0)}}initiate(){let e=new Qe;return e.extend(new Uint8Array([Xo])),this.splitRange(0,this.storage.size(),this._bound(Number.MAX_VALUE),e),H(e.unwrap())}reconcile(e,t,n){const r=new Qe(z(e));this.lastTimestampIn=this.lastTimestampOut=0;let o=new Qe;o.extend(new Uint8Array([Xo]));let s=kg(r);if(s<96||s>111)throw Error("invalid negentropy protocol version byte");if(s!==Xo)throw Error("unsupported negentropy protocol version requested: "+(s-96));let i=this.storage.size(),a=this._bound(0),c=0,l=!1;for(;r.length!==0;){let u=new Qe,d=()=>{l&&(l=!1,u.extend(this.encodeBound(a)),u.extend(Xe(kt.Skip)))},f=this.decodeBound(r),p=yr(r),h=c,m=this.storage.findLowerBound(c,i,f);if(p===kt.Skip)l=!0;else if(p===kt.Fingerprint){let y=Cr(r,cu),g=this.storage.fingerprint(h,m);uu(y,g)!==0?(d(),this.splitRange(h,m,f,u)):l=!0}else if(p===kt.IdList){let y=yr(r),g={};for(let E=0;E<y;E++){let C=Cr(r,nn);g[H(C)]=C}if(l=!0,this.storage.iterate(h,m,E=>{let C=E.id;const $=H(C);return g[$]?delete g[H(C)]:t?.($),!0}),n)for(let E of Object.values(g))n(H(E))}else throw Error("unexpected mode");if(this.exceededFrameSizeLimit(o.length+u.length)){let y=this.storage.fingerprint(m,i);o.extend(this.encodeBound(this._bound(Number.MAX_VALUE))),o.extend(Xe(kt.Fingerprint)),o.extend(y);break}else o.extend(u);c=m,a=f}return o.length===1?null:H(o.unwrap())}splitRange(e,t,n,r){let o=t-e,s=16;if(o<s*2)r.extend(this.encodeBound(n)),r.extend(Xe(kt.IdList)),r.extend(Xe(o)),this.storage.iterate(e,t,i=>(r.extend(i.id),!0));else{let i=Math.floor(o/s),a=o%s,c=e;for(let l=0;l<s;l++){let u=i+(l<a?1:0),d=this.storage.fingerprint(c,c+u);c+=u;let f;if(c===t)f=n;else{let p,h;this.storage.iterate(c-1,c+1,(m,y)=>(y===c-1?p=m:h=m,!0)),f=this.getMinimalBound(p,h)}r.extend(this.encodeBound(f)),r.extend(Xe(kt.Fingerprint)),r.extend(d)}}}exceededFrameSizeLimit(e){return e>this.frameSizeLimit-200}decodeTimestampIn(e){let t=yr(e);return t=t===0?Number.MAX_VALUE:t-1,this.lastTimestampIn===Number.MAX_VALUE||t===Number.MAX_VALUE?(this.lastTimestampIn=Number.MAX_VALUE,Number.MAX_VALUE):(t+=this.lastTimestampIn,this.lastTimestampIn=t,t)}decodeBound(e){let t=this.decodeTimestampIn(e),n=yr(e);if(n>nn)throw Error("bound key too long");let r=Cr(e,n);return{timestamp:t,id:r}}encodeTimestampOut(e){if(e===Number.MAX_VALUE)return this.lastTimestampOut=Number.MAX_VALUE,Xe(0);let t=e;return e-=this.lastTimestampOut,this.lastTimestampOut=t,Xe(e+1)}encodeBound(e){let t=new Qe;return t.extend(this.encodeTimestampOut(e.timestamp)),t.extend(Xe(e.id.length)),t.extend(e.id),t}getMinimalBound(e,t){if(t.timestamp!==e.timestamp)return this._bound(t.timestamp);{let n=0,r=t.id,o=e.id;for(let s=0;s<nn&&r[s]===o[s];s++)n++;return this._bound(t.timestamp,t.id.subarray(0,n+1))}}};function uu(e,t){for(let n=0;n<e.byteLength;n++){if(e[n]<t[n])return-1;if(e[n]>t[n])return 1}return e.byteLength>t.byteLength?1:e.byteLength<t.byteLength?-1:0}function Qo(e,t){return e.timestamp===t.timestamp?uu(e.id,t.id):e.timestamp-t.timestamp}var Sg=class{relay;storage;neg;filter;subscription;onhave;onneed;constructor(e,t,n,r={}){this.relay=e,this.storage=t,this.neg=new lu(t),this.onhave=r.onhave,this.onneed=r.onneed,this.filter=n,this.subscription=this.relay.prepareSubscription([{}],{label:r.label||"negentropy"}),this.subscription.oncustom=o=>{switch(o[0]){case"NEG-MSG":{o.length<3&&console.warn(`got invalid NEG-MSG from ${this.relay.url}: ${o}`);try{const s=this.neg.reconcile(o[2],this.onhave,this.onneed);s?this.relay.send(`["NEG-MSG", "${this.subscription.id}", "${s}"]`):(this.close(),r.onclose?.())}catch(s){console.error("negentropy reconcile error:",s),r?.onclose?.(`reconcile error: ${s}`)}break}case"NEG-CLOSE":{const s=o[2];console.warn("negentropy error:",s),r.onclose?.(s);break}case"NEG-ERR":r.onclose?.()}}}async start(){const e=this.neg.initiate();this.relay.send(`["NEG-OPEN","${this.subscription.id}",${JSON.stringify(this.filter)},"${e}"]`)}close(){this.relay.send(`["NEG-CLOSE","${this.subscription.id}"]`),this.subscription.close()}},Ig={};Q(Ig,{getToken:()=>Rg,hashPayload:()=>Ti,unpackEventFromToken:()=>fu,validateEvent:()=>bu,validateEventKind:()=>hu,validateEventMethodTag:()=>yu,validateEventPayloadTag:()=>gu,validateEventTimestamp:()=>pu,validateEventUrlTag:()=>mu,validateToken:()=>Ag});var du="Nostr ";async function Rg(e,t,n,r=!1,o){const s={kind:yi,tags:[["u",e],["method",t]],created_at:Math.round(new Date().getTime()/1e3),content:""};o&&s.tags.push(["payload",Ti(o)]);const i=await n(s);return(r?du:"")+Ke.encode(Ae.encode(JSON.stringify(i)))}async function Ag(e,t,n){const r=await fu(e).catch(s=>{throw s});return await bu(r,t,n).catch(s=>{throw s})}async function fu(e){if(!e)throw new Error("Missing token");e=e.replace(du,"");const t=nt.decode(Ke.decode(e));if(!t||t.length===0||!t.startsWith("{"))throw new Error("Invalid token");return JSON.parse(t)}function pu(e){return e.created_at?Math.round(new Date().getTime()/1e3)-e.created_at<60:!1}function hu(e){return e.kind===yi}function mu(e,t){const n=e.tags.find(r=>r[0]==="u");return n?n.length>0&&n[1]===t:!1}function yu(e,t){const n=e.tags.find(r=>r[0]==="method");return n?n.length>0&&n[1].toLowerCase()===t.toLowerCase():!1}function Ti(e){const t=ce(Ae.encode(JSON.stringify(e)));return H(t)}function gu(e,t){const n=e.tags.find(o=>o[0]==="payload");if(!n)return!1;const r=Ti(t);return n.length>0&&n[1]===r}async function bu(e,t,n,r){if(!ui(e))throw new Error("Invalid nostr event, signature invalid");if(!hu(e))throw new Error("Invalid nostr event, kind invalid");if(!pu(e))throw new Error("Invalid nostr event, created_at timestamp invalid");if(!mu(e,t))throw new Error("Invalid nostr event, url tag invalid");if(!yu(e,n))throw new Error("Invalid nostr event, method tag invalid");if(r&&typeof r=="object"&&Object.keys(r).length>0&&!gu(e,r))throw new Error("Invalid nostr event, payload tag does not match request body hash");return!0}function Cg(e){return Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}const Tg="m/44'/1237'/0'/0/0";function Ng(){return Vf(qc,128)}function vu(e){return Jf(e,qc)}function wu(e){const t=Zf(e),r=Rt.fromMasterSeed(t).derive(Tg);if(!r.privateKey)throw new Error("Failed to derive private key");const o=Cg(r.privateKey);return{pubkey:bo(r.privateKey),privkey:o}}const Oa=Object.freeze(Object.defineProperty({__proto__:null,generateMnemonic:Ng,mnemonicToKeypair:wu,validateMnemonic:vu},Symbol.toStringTag,{value:"Module"})),_s="canary:duress-queue";let xs=null,Ss=null,Hn=null;function Lg(e){xs=e.encrypt,Ss=e.decrypt,Hn=e.getPinKey}function es(e){return Array.isArray(e)?e.every(t=>t!=null&&typeof t=="object"&&typeof t.groupId=="string"&&t.message!=null):!1}async function $g(){try{const e=localStorage.getItem(_s);if(!e)return[];const t=JSON.parse(e);if(es(t))return t;if(t&&typeof t=="object"&&typeof t.entries=="string"){if(t.encrypted&&Ss&&Hn){const r=Hn();if(!r)return[];const o=await Ss(t.entries,r),s=JSON.parse(o);return es(s)?s:[]}const n=JSON.parse(t.entries);return es(n)?n:[]}return[]}catch{return[]}}async function Og(e){try{const t=JSON.stringify(e);if(xs&&Hn){const n=Hn();if(n){const r=await xs(t,n);localStorage.setItem(_s,JSON.stringify({encrypted:!0,entries:r}));return}}localStorage.setItem(_s,JSON.stringify({entries:t}))}catch{}}async function Mg(e){const t=await $g(),n=t.filter(o=>o.groupId===e),r=t.filter(o=>o.groupId!==e);return await Og(r),n.map(o=>o.message)}const Jr="canary:groups",Yr="canary:identity",_o="canary:settings",xo="canary:pin-salt",Pn="canary:active-group",Is="canary:mnemonic";let rn=null;function Eu(e){rn=e}function So(){rn=null}const gr={theme:"dark",pinEnabled:!0,autoLockMinutes:5,defaultRelays:[Ge],defaultReadRelays:[...ot,Ge],defaultWriteRelays:[Ge]};function ct(e){try{const t=localStorage.getItem(e);return t===null?null:JSON.parse(t)}catch{return null}}function _t(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch{}}function Te(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function mn(e){return Te(e)&&e._encrypted===!0&&typeof e.ciphertext=="string"}async function ts(e,t){return{_encrypted:!0,ciphertext:await Sc(JSON.stringify(e),t)}}async function Ni(e,t){return JSON.parse(await uo(e.ciphertext,t))}function ku(e){return Te(e)?Object.values(e).some(t=>Te(t)&&t._seedEncrypted===!0):!1}function _u(e){return Te(e)&&e._privkeyEncrypted===!0}function xu(){return localStorage.getItem(xo)}function Bg(){const e=df(),t=ff(e);return localStorage.setItem(xo,t),t}function Su(){localStorage.removeItem(xo)}async function Pg(e,t){const n={};for(const[r,o]of Object.entries(e)){const{_seedEncrypted:s,...i}=o;n[r]={...i,seed:s?await uo(o.seed,t):o.seed}}return n}function Ug(e){if(e.readRelays?.length||e.writeRelays?.length)return{readRelays:e.readRelays??[],writeRelays:e.writeRelays??[]};const t=e.relays??[],n=t.length>0?t:[Ge],r=new Set([...ot,...n]);return{readRelays:Array.from(r),writeRelays:n}}function Li(e){const t={...gr,...e??{}};return t.defaultRelays?.length||(t.defaultRelays=[...gr.defaultRelays]),t.defaultReadRelays?.length||(t.defaultReadRelays=[...gr.defaultReadRelays]),t.defaultWriteRelays?.length||(t.defaultWriteRelays=[...gr.defaultWriteRelays]),t}function Tr(e){if(!Te(e))return{};const t={};for(const[n,r]of Object.entries(e)){if(!Te(r)||typeof r.name!="string")continue;const o=Ug(r);t[n]={...r,id:n,usedInvites:Array.isArray(r.usedInvites)?r.usedInvites.filter(s=>typeof s=="string"):[],latestInviteIssuedAt:typeof r.latestInviteIssuedAt=="number"?r.latestInviteIssuedAt:0,tolerance:typeof r.tolerance=="number"?r.tolerance:1,livenessInterval:typeof r.livenessInterval=="number"?r.livenessInterval:typeof r.rotationInterval=="number"?r.rotationInterval:604800,livenessCheckins:Te(r.livenessCheckins)?Object.fromEntries(Object.entries(r.livenessCheckins).filter(([,s])=>typeof s=="number").map(([s,i])=>[s,i])):{},memberNames:Te(r.memberNames)?Object.fromEntries(Object.entries(r.memberNames).filter(([,s])=>typeof s=="string").map(([s,i])=>[s,i])):void 0,lastPositions:Te(r.lastPositions)?Object.fromEntries(Object.entries(r.lastPositions).filter(([,s])=>Te(s)).map(([s,i])=>[s,i])):void 0,beaconPrecision:typeof r.beaconPrecision=="number"?r.beaconPrecision:5,duressPrecision:typeof r.duressPrecision=="number"?r.duressPrecision:9,nostrEnabled:typeof r.nostrEnabled=="boolean"?r.nostrEnabled:o.writeRelays.length>0||o.readRelays.length>0,...o}}return t}function Rs(e){return!Te(e)||typeof e.pubkey!="string"?null:{pubkey:e.pubkey,privkey:typeof e.privkey=="string"?e.privkey:void 0,nsec:typeof e.nsec=="string"?e.nsec:void 0,mnemonic:typeof e.mnemonic=="string"?e.mnemonic:void 0,displayName:typeof e.displayName=="string"?e.displayName:void 0,picture:typeof e.picture=="string"?e.picture:void 0,signerType:e.signerType==="nip07"?"nip07":"local"}}function Un(e){const t=localStorage.getItem(Is);if(!t)return{identity:e,migrated:!1};let n=e;const r=t.trim().replace(/\s+/g," ");try{if(n&&vu(r)){const{pubkey:o}=wu(r);o===n.pubkey&&(n={...n,mnemonic:r})}}catch{}return localStorage.removeItem(Is),{identity:n,migrated:!0}}function Iu(e,t){if(typeof e=="string"&&e in t)return e;const n=Object.keys(t);return n.length>0?n[0]:null}async function Dg(e){const t=ct(Jr);if(t===null)return{groups:{},migrated:!1};if(mn(t)){if(!e)throw new Error("Encrypted groups require PIN unlock");const n=await Ni(t,e);return{groups:Tr(n),migrated:!1}}if(ku(t)){if(!e)throw new Error("Encrypted groups require PIN unlock");const n=await Pg(t,e);return{groups:Tr(n),migrated:!0}}return{groups:Tr(t),migrated:e!==void 0}}function jg(){const e=ct(Jr);return e===null||mn(e)||ku(e)?{groups:{},migrated:!1}:{groups:Tr(e),migrated:!1}}async function qg(e){const t=ct(Yr);if(t===null)return Un(null);if(mn(t)){if(!e)throw new Error("Encrypted identity requires PIN unlock");const s=await Ni(t,e);return Un(Rs(s))}let n=t,r=e!==void 0;if(_u(t)){if(!e)throw new Error("Encrypted identity requires PIN unlock");const s=t.privkey?await uo(t.privkey,e):void 0,{_privkeyEncrypted:i,...a}=t;n={...a,privkey:s},r=!0}const o=Un(Rs(n));return{identity:o.identity,migrated:r||o.migrated}}function Hg(){const e=ct(Yr);return e===null||mn(e)||_u(e)?Un(null):Un(Rs(e))}async function Fg(e){const t=ct(Pn);if(t===null)return{activeGroupId:null,migrated:!1};if(mn(t)){if(!e)throw new Error("Encrypted active group requires PIN unlock");const n=await Ni(t,e);return{activeGroupId:typeof n=="string"?n:null,migrated:!1}}return{activeGroupId:typeof t=="string"?t:null,migrated:e!==void 0}}function Gg(){const e=ct(Pn);return e===null||mn(e)?{activeGroupId:null,migrated:!1}:{activeGroupId:typeof e=="string"?e:null,migrated:!1}}async function Io(e,t){if(t){const[n,r,o]=await Promise.all([ts(e.groups,t),ts(e.identity,t),ts(e.activeGroupId,t)]);_t(Jr,n),_t(Yr,r),_t(Pn,o)}else _t(Jr,e.groups),_t(Yr,e.identity),e.activeGroupId===null?localStorage.removeItem(Pn):_t(Pn,e.activeGroupId);_t(_o,e.settings),localStorage.removeItem(Is)}async function $i(){const e=_(),t=!!xu();if(e.settings.pinEnabled&&t&&rn===null){console.error("[canary:storage] PIN enabled but key not loaded — state NOT persisted.");return}try{await Io(e,e.settings.pinEnabled&&rn!==null?rn:void 0)}catch(n){console.error("[canary:storage] Persistence failed — state NOT persisted:",n)}}function Ru(){return localStorage.getItem(xo)!==null}function Vg(){const e=ct(_o);return Li(e)}async function Kg(e){const t=xu();if(!t)throw new Error("No PIN salt found");const n=Ic(t),r=await xc(e,n),o=ct(_o),s=Li(o),[i,a,c]=await Promise.all([Dg(r),qg(r),Fg(r)]),l={view:"groups",groups:i.groups,activeGroupId:Iu(c.activeGroupId,i.groups),identity:a.identity,settings:s};Eu(r),_c(l),(i.migrated||a.migrated||c.migrated)&&await Io(l,r)}function Wg(){const e=ct(_o),t=Li(e),n=jg(),r=Hg(),o=Gg(),s={view:"groups",groups:n.groups,activeGroupId:Iu(o.activeGroupId,n.groups),identity:r.identity,settings:t};_c(s),(n.migrated||r.migrated||o.migrated)&&$i()}let As=0,Cs,Ma=Promise.resolve();const zg=100;function Jg(){Lg({encrypt:Sc,decrypt:uo,getPinKey:()=>rn}),Ur(()=>{const e=++As;clearTimeout(Cs),Cs=setTimeout(()=>{Ma=Ma.then(async()=>{e===As&&await $i()}).catch(t=>{console.error("[canary:storage] Serialised write failed:",t)})},zg)}),window.addEventListener("pagehide",()=>yn())}function yn(){clearTimeout(Cs),As++,$i().catch(()=>{})}async function Yg(e){const t=Bg(),n=Ic(t),r=await xc(e,n);Eu(r);try{const o=_();await Io({...o,settings:{...o.settings,pinEnabled:!0}},r)}catch(o){throw So(),Su(),o}}async function Zg(){const e=_();await Io({...e,settings:{...e.settings,pinEnabled:!1}}),So(),Su()}const Xg=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],Qg=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]);function Pe(e,t){return(e>>>t|e<<32-t)>>>0}function we(e){const t=e.length*8,n=new Uint8Array(Math.ceil((e.length+9)/64)*64);n.set(e),n[e.length]=128;const r=new DataView(n.buffer);r.setUint32(n.length-8,Math.floor(t/4294967296),!1),r.setUint32(n.length-4,t>>>0,!1);let[o,s,i,a,c,l,u,d]=Xg;const f=new Uint32Array(64);for(let m=0;m<n.length;m+=64){for(let v=0;v<16;v++)f[v]=r.getUint32(m+v*4,!1);for(let v=16;v<64;v++){const b=f[v-15],x=f[v-2],S=Pe(b,7)^Pe(b,18)^b>>>3,A=Pe(x,17)^Pe(x,19)^x>>>10;f[v]=f[v-16]+S+f[v-7]+A>>>0}let y=o,g=s,E=i,C=a,$=c,L=l,O=u,w=d;for(let v=0;v<64;v++){const b=Pe($,6)^Pe($,11)^Pe($,25),x=$&L^~$&O,S=w+b+x+Qg[v]+f[v]>>>0,A=Pe(y,2)^Pe(y,13)^Pe(y,22),k=y&g^y&E^g&E,R=A+k>>>0;w=O,O=L,L=$,$=C+S>>>0,C=E,E=g,g=y,y=S+R>>>0}o=o+y>>>0,s=s+g>>>0,i=i+E>>>0,a=a+C>>>0,c=c+$>>>0,l=l+L>>>0,u=u+O>>>0,d=d+w>>>0}const p=new Uint8Array(32),h=new DataView(p.buffer);return h.setUint32(0,o,!1),h.setUint32(4,s,!1),h.setUint32(8,i,!1),h.setUint32(12,a,!1),h.setUint32(16,c,!1),h.setUint32(20,l,!1),h.setUint32(24,u,!1),h.setUint32(28,d,!1),p}const xn=64;function Le(e,t){const n=e.length>xn?we(e):e,r=new Uint8Array(xn);r.set(n);const o=new Uint8Array(xn),s=new Uint8Array(xn);for(let u=0;u<xn;u++)o[u]=r[u]^54,s[u]=r[u]^92;const i=$e(o,t),a=we(i),c=$e(s,a),l=we(c);return r.fill(0),o.fill(0),s.fill(0),a.fill(0),i.fill(0),c.fill(0),n!==e&&n.fill(0),l}function Au(){const e=new Uint8Array(32);crypto.getRandomValues(e);const t=ze(e);return e.fill(0),t}function F(e){if(e.length%2!==0)throw new Error(`hexToBytes: odd-length hex string (${e.length} chars)`);const t=new Uint8Array(e.length/2);for(let n=0;n<t.length;n++){const r=e.slice(n*2,n*2+2);if(!/^[0-9a-fA-F]{2}$/.test(r))throw new TypeError(`Invalid hex character at position ${n*2}`);t[n]=parseInt(r,16)}return t}function ze(e){let t="";for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,"0");return t}function eb(e,t){if(!Number.isInteger(t)||t<0||t+2>e.length)throw new RangeError(`readUint16BE: offset ${t} out of bounds for length ${e.length}`);return(e[t]<<8|e[t+1])>>>0}function $e(...e){const t=e.reduce((o,s)=>o+s.length,0),n=new Uint8Array(t);let r=0;for(const o of e)n.set(o,r),r+=o.length;return n}function Cu(e){let t="";for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return btoa(t)}function tb(e){const t=atob(e),n=new Uint8Array(t.length);for(let r=0;r<t.length;r++)n[r]=t.charCodeAt(r);return n}function nb(e,t){const n=Math.max(e.length,t.length),r=new Uint8Array(n),o=new Uint8Array(n);r.set(e),o.set(t);let s=e.length^t.length;for(let i=0;i<n;i++)s|=r[i]^o[i];return s===0}const Ba=new TextEncoder;function Qt(e,t){return nb(Ba.encode(e),Ba.encode(t))}const Fn=["ability","able","about","above","absent","absorb","abstract","absurd","access","accident","account","accuse","achieve","acid","acorn","acoustic","acquire","across","act","action","actor","actress","actual","adapt","add","addict","address","adjust","admiral","admit","adult","advance","advice","aerobic","affair","afford","afraid","again","age","agent","agree","ahead","aim","air","airport","aisle","alarm","album","alcohol","alert","alien","all","alley","allow","almost","alone","alpha","alpine","already","also","always","amateur","amazing","amber","among","amount","amused","analyst","anchor","ancient","anger","angle","animal","ankle","announce","annual","another","answer","antenna","antique","anvil","anxiety","any","apart","apology","appear","apple","approve","april","apron","arch","arctic","area","arena","argue","arm","armed","armor","army","around","arrange","arrive","arrow","art","artefact","artist","artwork","ask","aspect","asset","assist","assume","asthma","athlete","atom","attack","attend","attitude","attract","auction","audit","august","aunt","author","auto","autumn","average","avocado","avoid","awake","aware","away","awesome","awful","awkward","axis","baby","bachelor","bacon","badge","badger","bag","bakery","balance","balcony","ball","balm","bamboo","banana","banjo","banner","bar","barely","bargain","barrel","base","basic","basil","basket","battle","beach","beacon","bean","beauty","because","become","beef","beetle","before","begin","behave","behind","belfry","believe","below","belt","bench","benefit","berry","best","better","between","beyond","bicycle","bid","bike","bind","biology","birch","bird","birth","bishop","bitter","black","blame","blanket","bleak","bless","bloom","blossom","blouse","blue","blur","blush","board","boat","bobcat","body","boil","bone","bonfire","bonus","book","boost","border","boring","borrow","boss","bottom","bounce","bouquet","box","boy","bracket","brain","branch","brand","brass","brave","bread","breaker","breeze","brick","bridge","brief","bright","bring","brisk","broccoli","bronze","brook","broom","brother","brown","brush","bubble","buckle","buddy","budget","buffalo","bugle","build","bulb","bulk","bumble","bundle","bunker","burger","burrow","burst","bus","bushel","business","busy","butter","buyer","buzz","cabbage","cabin","cable","cactus","cage","cairn","cake","call","calm","camel","camera","camp","can","canal","cancel","candy","canoe","canopy","canvas","canyon","capable","cape","capital","captain","car","caravan","carbon","card","cargo","carpet","carry","cart","case","cash","casino","castle","casual","cat","catalog","catch","category","cattle","caught","cause","caution","cave","cedar","ceiling","celery","cellar","cement","census","century","cereal","certain","chair","chalk","champion","change","chapter","charge","charter","chase","chat","cheap","check","cheese","chef","cherry","chest","chestnut","chicken","chief","child","chimney","choice","choose","chuckle","chunk","churn","cider","cigar","cinnamon","circle","citizen","city","civil","claim","clam","clap","clarify","claw","clay","clean","clerk","clever","click","client","cliff","climb","clinic","clip","cloak","clock","clog","close","cloth","cloud","clown","club","clump","cluster","clutch","coach","coast","cobalt","cocoa","coconut","code","codex","coffee","coil","coin","collect","color","column","combine","come","comet","comfort","comic","common","company","concert","condor","conduct","confirm","congress","connect","consider","consul","control","convince","cook","cool","copper","copy","coral","core","cork","corn","cornet","correct","cosmos","cost","cotton","couch","cougar","country","couple","course","cousin","cover","coyote","crack","cradle","craft","cram","crane","crater","crawl","cream","credit","creek","crew","cricket","crisp","critic","croft","crop","cross","crouch","crowd","crown","crucial","cruise","crumble","crunch","cry","crystal","cube","culture","cup","cupboard","curious","current","curtain","curve","cushion","custom","cute","cycle","cypress","dad","dagger","dahlia","damp","damsel","dance","danger","dapple","daring","dash","daughter","dawn","day","deal","debate","decade","december","decide","decline","decorate","decrease","defense","define","defy","degree","delay","deliver","delta","demand","demise","denial","denim","dentist","depart","depend","deposit","depot","depth","deputy","derive","describe","desert","design","desk","detail","detect","develop","device","devote","diagram","dial","diamond","diary","dice","diesel","diet","differ","digital","dignity","dilemma","dinner","dinosaur","direct","dirt","disagree","discover","dish","display","distance","divert","divide","divorce","dizzy","doctor","document","dog","doll","dolphin","domain","donate","donkey","donor","door","dorsal","double","dove","draft","drafter","dragon","drake","drama","drastic","draw","dream","dress","drift","drifter","drill","drink","drive","drop","droplet","drum","drummer","dry","duck","dulcet","dune","dungeon","during","dusk","dust","dutch","duty","dwarf","dynamic","eager","eagle","early","earn","earth","easily","east","easy","echo","ecology","economy","edge","edgeway","edit","educate","effort","egg","eight","either","elbow","elder","electric","elegant","element","elephant","elevator","elite","elm","else","embark","ember","embody","embrace","emerald","emerge","emotion","employ","empower","empty","enable","enact","end","endless","endorse","enemy","energy","enforce","engage","engine","enhance","enjoy","enlist","enough","enrich","enroll","ensign","ensure","enter","entire","entry","envelope","episode","epoch","equal","equip","era","erase","erode","erosion","error","escape","essay","essence","estate","estuary","eternal","ether","ethics","everest","evidence","evil","evolve","exact","example","exchange","excite","exclude","excuse","execute","exercise","exhaust","exhibit","exist","exit","exotic","expand","expect","explain","express","extend","extra","eye","eyebrow","fabric","face","faculty","fade","faint","faith","falcon","fall","fallow","false","fame","family","famous","fancy","fantasy","farm","fashion","fat","father","fathom","fatigue","favorite","feature","february","federal","fee","feed","feel","female","fence","fennel","fern","festival","fetch","fever","fiber","fiction","fiddle","field","figure","file","film","filter","final","finch","find","finger","finish","fire","firm","first","fiscal","fish","fit","fitness","fix","fjord","flag","flagon","flame","flannel","flash","flat","flavor","flicker","flight","flint","flip","float","flock","floor","floret","fluid","flush","flutter","fly","foal","foam","focus","fog","foil","fold","follow","food","foot","force","forest","forge","forget","fork","fortune","forum","forward","fossil","foster","found","foundry","fox","foxglove","fragile","frame","frequent","fresco","fresh","friend","fringe","frog","front","frost","frown","frozen","fruit","fuel","fun","funny","furnace","furrow","future","gadget","gain","galaxy","gallery","galley","game","gap","garage","garbage","garden","garland","garlic","garment","garnet","gas","gasp","gate","gather","gauge","gaze","gazelle","general","genius","genre","gentle","genuine","gesture","geyser","giant","gibbon","gift","giggle","ginger","giraffe","girl","give","glacier","glad","glance","glare","glass","glen","glide","glimpse","globe","gloom","glory","glove","glow","glue","goat","goblet","goddess","gold","golden","good","goose","gopher","gorge","gorilla","gospel","gossip","govern","gown","grab","grace","grain","granite","grant","grape","grass","gravity","great","green","grid","grocery","group","grow","grunt","guard","guess","guide","guilt","guitar","guppy","gust","gym","habit","half","hamlet","hammer","hammock","hamster","hand","happy","harbor","hard","harness","harvest","hat","have","hawk","hawthorn","head","health","heart","hearth","heavy","hedgehog","height","hello","helmet","help","hen","herald","hermit","hero","heron","hickory","hidden","high","hill","hint","hip","hire","history","hobby","hockey","hold","hole","holiday","hollow","home","homeward","honey","hood","hope","horizon","horn","hornet","horse","hospital","host","hotel","hour","hover","howler","hub","huge","human","humble","humor","hundred","hungry","hunt","hunter","hurdle","hurry","husband","hybrid","ice","icon","idea","identify","idle","igloo","ignore","ill","image","imitate","immune","impact","improve","inch","include","income","increase","index","indicate","indigo","indoor","industry","infant","inflict","inform","inhale","inherit","initial","inject","inkwell","inlet","inmate","inner","innocent","input","inquiry","insect","inside","inspire","install","intact","interest","into","invest","invite","involve","inward","iris","iron","island","issue","item","ivory","jacket","jade","jaguar","jar","jasmine","javelin","jazz","jeans","jelly","jersey","jewel","job","join","joke","jostle","journal","journey","joy","jubilee","judge","juice","jumble","jump","junco","jungle","junior","juniper","just","kangaroo","kayak","keen","keep","keeper","kelp","kennel","kernel","kestrel","ketchup","kettle","key","kick","kid","kidney","kind","kindle","kingdom","kinglet","kipper","kiss","kit","kitchen","kite","kitten","kiwi","knapsack","knee","knife","knock","lab","label","labor","ladder","lady","lake","lamp","language","lantern","lapis","laptop","larch","large","later","latin","laugh","laundry","laurel","lava","lavender","law","lawn","layer","lazy","leader","leaf","learn","leave","lecture","left","leg","legal","legend","leisure","lemon","lend","length","lens","leopard","lesson","letter","level","liar","liberty","library","license","lichen","life","lift","light","like","limit","linden","link","linnet","lion","liquid","list","little","live","lizard","llama","load","loan","lobster","local","lock","locust","lodge","logic","long","loom","loop","lottery","lotus","loud","lounge","love","loyal","lucky","luggage","lumber","lumen","lunar","lunch","luxury","machine","mackerel","magic","magnet","main","major","make","mammal","man","manage","mandate","mango","mansion","mantis","manual","maple","marble","march","margin","marine","market","marriage","marsh","marten","mask","masonry","mass","master","match","material","math","matrix","matter","maximum","maze","meadow","mean","measure","mechanic","medal","media","melody","melt","member","memory","mention","menu","mercy","merge","merit","merlin","merry","mesa","mesh","message","metal","method","micron","middle","midnight","milk","millet","million","mimic","mind","minimum","minnow","minor","minute","miracle","mirage","mirror","miss","mistake","mix","mixed","mixture","moat","mobile","model","modify","mohawk","mom","moment","monarch","mongrel","monitor","monkey","month","moon","moose","moral","more","morning","mortar","mosaic","mosquito","mother","motion","motor","mountain","mouse","move","movie","much","muffin","mullet","multiply","muscle","museum","mushroom","music","muslin","mussel","must","mustang","mutual","myrtle","myself","mystery","myth","naive","name","napkin","narrow","narwhal","nation","nature","near","neck","nectar","need","negative","neither","nephew","nest","nester","net","nettle","network","neutral","never","news","newt","next","nice","nimble","noble","noggin","noise","nomad","nominee","noodle","normal","north","nose","notable","note","nothing","notice","novel","now","nuclear","number","nurse","nut","nutmeg","oak","oakmoss","oasis","obey","object","oblige","observe","obsidian","obtain","ocean","octave","october","odor","off","offer","office","often","oil","okay","old","olive","olympic","omit","once","onion","online","only","onyx","opal","open","opera","opinion","oppose","option","orange","orbit","orchard","orchid","order","ordinary","organ","orient","original","oriole","orphan","osprey","ostrich","other","otter","outdoor","outer","outpost","output","outside","oval","oven","over","own","owner","oxygen","oyster","ozone","pact","paddle","page","pagoda","palace","palm","panda","panel","panther","paper","parade","parent","park","parrot","party","pass","patch","path","patient","patrol","pattern","pause","pave","payment","peanut","peasant","pelican","pen","pencil","people","pepper","perfect","permit","person","phone","photo","phrase","physical","piano","picnic","picture","pigeon","pill","pilot","pink","pioneer","pipe","pitch","pizza","place","planet","plastic","plate","play","please","pledge","pluck","plug","poem","poet","point","polar","pole","police","pond","pony","pool","popular","portion","position","possible","post","potato","pottery","powder","power","practice","praise","predict","prefer","prepare","present","pretty","prevent","price","pride","primary","print","priority","private","prize","process","produce","profit","program","project","promote","proof","property","prosper","protect","proud","provide","public","pudding","pull","pulp","pulse","pumpkin","puppy","purchase","purity","purpose","purse","push","put","puzzle","pyramid","quality","quantum","quarter","question","quick","quiz","quote","rabbit","race","rack","radar","radio","rail","rain","raise","rally","ramp","ranch","random","range","rapid","rare","rate","rather","raven","raw","razor","ready","real","reason","rebuild","recall","receive","recipe","record","recycle","reduce","reflect","reform","refuse","region","regular","relax","release","relief","rely","remain","remember","remove","render","renew","rent","reopen","repair","repeat","replace","report","require","rescue","resource","response","result","retire","retreat","return","reunion","reveal","review","reward","rhythm","rib","ribbon","rice","rich","ride","ridge","rifle","ring","ripple","risk","ritual","rival","river","road","roast","robot","robust","rocket","romance","roof","rookie","room","rose","rotate","round","route","royal","rubber","rug","rule","run","runway","rural","saddle","sadness","safe","salad","salmon","salon","salt","salute","same","sample","sand","satisfy","satoshi","sauce","sausage","save","say","scale","scan","school","science","scorpion","scout","screen","script","scrub","search","season","seat","second","secret","section","security","seed","seek","segment","select","sell","seminar","senior","sense","sentence","service","session","settle","setup","seven","shadow","shallow","share","shed","shell","sheriff","shield","shift","shine","shoe","shoot","shop","short","shoulder","shove","shrimp","shuffle","shy","sibling","sick","side","sight","sign","silent","silk","silly","silver","similar","simple","since","sister","situate","six","size","skate","sketch","ski","skill","skin","skirt","slab","slam","sleep","slice","slide","slight","slim","small","smart","smile","smooth","snack","snake","snow","soap","soccer","social","sock","soda","soft","solar","soldier","solid","solution","solve","someone","song","soon","sort","soul","sound","soup","source","south","space","spare","spatial","speak","special","speed","spell","spend","sphere","spice","spider","spike","spin","spirit","spoil","sponsor","spoon","sport","spot","spray","spread","spring","spy","square","squirrel","stable","stadium","staff","stage","stairs","stamp","stand","start","state","stay","steak","stem","step","stereo","stick","still","stock","stomach","stone","stool","story","stove","strategy","street","strong","student","style","subject","submit","subway","success","such","sudden","sugar","suggest","suit","summer","sunny","sunset","super","supply","supreme","sure","surface","surge","surprise","surround","survey","sustain","swap","swarm","sweet","swift","swim","swing","switch","sword","symbol","syrup","system","table","tackle","tag","talent","talk","tape","task","taste","taxi","teach","team","tell","tennis","term","test","text","thank","theme","then","theory","they","this","thought","thrive","throw","thumb","thunder","ticket","tide","tiger","tilt","timber","time","tiny","tip","tired","tissue","title","toast","today","toddler","together","toilet","token","tomato","tomorrow","tone","tonight","tool","tooth","top","topic","topple","torch","tortoise","toss","total","tourist","tower","town","toy","track","trade","traffic","train","transfer","trap","travel","tray","treat","trend","tribe","trick","trigger","trim","trip","trophy","truck","true","trumpet","truth","try","tuition","tunnel","turkey","turn","turtle","twelve","twenty","twice","twin","twist","two","type","typical","umbrella","unable","unaware","uncle","uncover","under","undo","unfair","unfold","uniform","unique","unit","universe","unknown","unlock","until","unusual","update","upgrade","uphold","upon","upper","upset","urban","urge","usage","use","used","useful","useless","usual","utility","vague","valid","valley","valve","vapor","various","vast","vehicle","velvet","vendor","venue","verb","verify","version","very","vessel","veteran","viable","vibrant","vicious","victory","video","village","vintage","violin","virtual","visa","visit","visual","vital","vivid","vocal","voice","volcano","vote","voyage","wagon","walk","wall","walnut","want","warm","warrior","wash","wasp","water","wave","way","wealth","weasel","web","wedding","weekend","welcome","west","wet","whale","what","wheat","wheel","when","whip","whisper","wide","width","wife","wild","will","win","window","wine","wing","wink","winner","winter","wire","wisdom","wise","wish","witness","wolf","woman","wonder","wool","word","work","world","worry","worth","wreck","wrestle","yard","year","yellow","you","young","youth","zebra","zero","zone","zoo"];Object.freeze(Fn);const Ts=2048,rb=new Map;for(let e=0;e<Fn.length;e++)rb.set(Fn[e],e);function Nr(e){if(e<0||e>=Ts)throw new RangeError(`Wordlist index out of range: ${e} (must be 0-${Ts-1})`);return Fn[e]}const tr={format:"words",count:1};function ob(e,t=1,n=Fn){if(n.length!==2048)throw new RangeError("Wordlist must contain exactly 2048 entries");if(!Number.isInteger(t)||t<1||t>16)throw new RangeError("Word count must be an integer 1–16");if(e.length<t*2)throw new RangeError("Not enough bytes for requested word count");const r=[];for(let o=0;o<t;o++){const s=eb(e,o*2)%n.length;r.push(n[s])}return r}const sb=[0,2,2,3,3,3,4,4,5,5,6];function ib(e,t=4){if(!Number.isInteger(t)||t<1||t>10)throw new RangeError("PIN digits must be an integer 1–10");if(e.length===0)throw new RangeError("Cannot encode empty byte array as PIN");const n=sb[t];if(e.length<n)throw new RangeError(`Not enough bytes for ${t}-digit PIN: need ${n}, got ${e.length}`);const r=Math.pow(10,t);if(n>4){let s=0n;for(let i=0;i<n;i++)s=s*256n+BigInt(e[i]);return Number(s%BigInt(r)).toString().padStart(t,"0")}let o=0;for(let s=0;s<n;s++)o=o*256+e[s]>>>0;return(o%r).toString().padStart(t,"0")}function ab(e,t=8){if(!Number.isInteger(t)||t<1||t>64)throw new RangeError("Hex length must be an integer 1–64");const n=Math.ceil(t/2);if(e.length<n)throw new RangeError(`Not enough bytes: need ${n}, got ${e.length}`);let r="";for(let o=0;o<n&&o<e.length;o++)r+=e[o].toString(16).padStart(2,"0");return r.slice(0,t)}function Ut(e,t=tr){switch(t.format){case"words":return ob(e,t.count??1,t.wordlist).join(" ");case"pin":return ib(e,t.digits??4);case"hex":return ab(e,t.length??8);default:throw new Error(`Unsupported encoding format: ${t.format}`)}}const cb=new TextEncoder;function ns(e){return cb.encode(e)}function Pa(e){if(!Number.isInteger(e)||e<0||e>4294967295)throw new RangeError(`Counter must be an integer 0–${4294967295}, got ${e}`);const t=new Uint8Array(4);return new DataView(t.buffer).setUint32(0,e,!1),t}const Ua=16;function lb(e){const t=typeof e=="string"?F(e):e;if(t.length<Ua)throw new RangeError(`Secret must be at least ${Ua} bytes, got ${t.length}`);return t}function Ns(e,t,n,r){if(!t||!t.trim())throw new Error("context must be a non-empty string");if(r!==void 0&&r==="")throw new Error("identity must be non-empty when provided");if(r!==void 0&&r.includes("\0"))throw new Error("identity must not contain null bytes");const o=lb(e),s=r?$e(ns(t),new Uint8Array([0]),ns(r),Pa(n)):$e(ns(t),Pa(n));return Le(o,s)}function ub(e,t,n,r){if(t.includes("\0"))throw new Error("context must not contain null bytes");return Ns(e,t,n,r)}function rt(e,t,n,r=tr,o){if(t.includes("\0"))throw new Error("context must not contain null bytes");if(o!==void 0&&o.includes("\0"))throw new Error("identity must not contain null bytes");const s=ub(e,t,n,o);return Ut(s,r)}function Sn(e,t,n,r,o=tr){if(!t||!t.trim())throw new Error("namespace must be a non-empty string");if(t.includes("\0"))throw new Error("namespace must not contain null bytes");if(!n[0]||!n[1]||!n[0].trim()||!n[1].trim())throw new Error("Both roles must be non-empty strings");if(n[0].includes("\0")||n[1].includes("\0"))throw new Error("Roles must not contain null bytes");if(n[0]===n[1])throw new Error(`Roles must be distinct, got ["${n[0]}", "${n[1]}"]`);return{[n[0]]:Ut(Ns(e,`pair\0${t}\0${n[0]}`,r),o),[n[1]]:Ut(Ns(e,`pair\0${t}\0${n[1]}`,r),o)}}const Zr=10,Oi=604800,Da=100;function wt(e,t=Oi){if(!Number.isFinite(e)||e<0)throw new RangeError(`timestampSec must be a non-negative finite number, got ${e}`);if(!Number.isFinite(t)||t<=0)throw new RangeError(`rotationIntervalSec must be a positive finite number, got ${t}`);const n=Math.floor(e/t);if(n>4294967295)throw new RangeError(`Counter exceeds uint32 range (${n}). Use a larger rotation interval.`);return n}function Ro(e){return new TextEncoder().encode(e)}const db=/^[0-9a-f]{64}$/;function Tu(e){if(!db.test(e))throw new Error("seedHex must be a 64-character lowercase hex string (32 bytes)")}function Nu(e){if(e.length!==32)throw new Error("AES-256-GCM requires a 32-byte key")}function Lu(e){return Tu(e),Le(F(e),Ro("canary:sync:key"))}async function $u(e,t){Nu(e);const n=crypto.getRandomValues(new Uint8Array(12)),r=await crypto.subtle.importKey("raw",e,{name:"AES-GCM"},!1,["encrypt"]),o=await crypto.subtle.encrypt({name:"AES-GCM",iv:n},r,Ro(t)),s=$e(n,new Uint8Array(o));return Cu(s)}async function Ou(e,t){Nu(e);const n=tb(t);if(n.length<28)throw new Error("decryptEnvelope: encoded data too short (minimum 28 bytes: 12-byte IV + 16-byte GCM tag)");const r=n.slice(0,12),o=n.slice(12),s=await crypto.subtle.importKey("raw",e,{name:"AES-GCM"},!1,["decrypt"]);let i;try{i=await crypto.subtle.decrypt({name:"AES-GCM",iv:r},s,o)}catch{throw new Error("decryptEnvelope: decryption failed — wrong key or tampered data")}return new TextDecoder().decode(i)}function Mu(e,t){if(Tu(e),!/^[0-9a-f]{64}$/.test(t))throw new Error("personalPrivkeyHex must be a 64-character lowercase hex string (32 bytes)");const n=F(e),r=$e(Ro("canary:sync:sign:"),F(t)),o=Le(n,r);return n.fill(0),r.fill(0),o}function Bu(e){return ze(we(Ro(e)))}const fb=new TextEncoder;function Xr(e){return fb.encode(e)}function Pu(e){if(!Number.isInteger(e)||e<0||e>4294967295)throw new RangeError(`Counter must be an integer 0–${4294967295}, got ${e}`);const t=new Uint8Array(4);return new DataView(t.buffer).setUint32(0,e,!1),t}const ja=16,qa=100;function Uu(e){const t=typeof e=="string"?F(e):e;if(t.length<ja)throw new RangeError(`Secret must be at least ${ja} bytes, got ${t.length}`);return t}function Ao(e,t,n,r,o=tr,s,i){if(!Number.isInteger(s)||s<0)throw new RangeError("maxTolerance must be a non-negative integer");if(s>10)throw new RangeError(`maxTolerance must be <= 10, got ${s}`);const c=new Set,l=2*s,u=Math.max(0,r-l),d=Math.min(4294967295,r+l);for(let g=u;g<=d;g++)if(c.add(rt(e,t,g,o)),i)for(const E of i)c.add(rt(e,t,g,o,E));const f=Uu(e),p=$e(Xr(t+":duress"),new Uint8Array([0]),Xr(n),Pu(r));let h=Le(f,p),m=Ut(h,o),y=1;for(;c.has(m)&&y<=255;)h=Le(f,$e(p,new Uint8Array([y]))),m=Ut(h,o),y++;if(c.has(m))throw new Error("Duress token collision unresolvable after 255 retries");return m}function Ha(e,t,n,r,o,s){const a=s?.encoding??tr,c=s?.tolerance??0;if(!Number.isInteger(c)||c<0)throw new RangeError("Tolerance must be a non-negative integer");if(c>10)throw new RangeError(`Tolerance must be <= 10, got ${c}`);if(o.length>qa)throw new RangeError(`identities array must not exceed ${qa} entries, got ${o.length}`);const l=r.toLowerCase().trim().replace(/\s+/g," "),u=Math.max(0,n-c),d=Math.min(4294967295,n+c);let f=null;for(const y of o)Qt(l,rt(e,t,n,a,y))&&(f=y);const p=[];for(const y of o){let g=!1;for(let E=u;E<=d;E++)Qt(l,Ao(e,t,y,E,a,c,o))&&(g=!0);g&&p.push(y)}let h=null;for(const y of o)for(let g=u;g<=d;g++)g!==n&&Qt(l,rt(e,t,g,a,y))&&(h=y);let m=!1;for(let y=u;y<=d;y++)Qt(l,rt(e,t,y,a))&&(m=!0);return p.length>0?{status:"duress",identities:p}:f?{status:"valid",identities:[f]}:h?{status:"valid",identities:[h]}:m?{status:"valid"}:{status:"invalid"}}function pb(e,t,n,r){const o=Uu(e),s=$e(Xr(t+":alive"),new Uint8Array([0]),Xr(n),Pu(r));return Le(o,s)}const rs=Object.freeze({family:Object.freeze({wordCount:1,rotationInterval:Oi,description:"Casual verification for family and friends. Single word, weekly rotation. Adequate for live voice/video calls where the attacker gets one attempt. NOT suitable for text-based verification — 11 bits of entropy is trivially brute-forceable without rate limiting."}),"field-ops":Object.freeze({wordCount:2,rotationInterval:86400,description:"High-security preset for journalism, activism, and field operations. Two-word phrases (~22 bits) with daily rotation. Use burn-after-use for maximum protection."}),enterprise:Object.freeze({wordCount:2,rotationInterval:172800,description:"Enterprise incident response. Two-word phrases with 48-hour rotation. Balances security with operational convenience for larger teams."}),event:Object.freeze({wordCount:1,rotationInterval:14400,description:"Temporary groups for conferences, festivals, and meetups. Single word with 4-hour rotation. Fast setup, easy to share at the door."})}),hb=/^[0-9a-f]{64}$/,Fa=100;function Qr(e){if(!hb.test(e))throw new Error(`Invalid member pubkey: expected 64 hex characters, got ${e.length} chars`)}function mb(e){if(typeof e.name!="string"||e.name.length===0)throw new Error("name must be a non-empty string");if(e.name.length>256)throw new Error("name must be at most 256 characters");if(e.preset!==void 0&&(typeof e.preset!="string"||!Object.hasOwn(rs,e.preset)))throw new Error(`Unknown preset: "${e.preset}". Valid presets: ${Object.keys(rs).join(", ")}`);const t=Math.floor(Date.now()/1e3),n=e.preset!==void 0?rs[e.preset]:void 0,r=e.rotationInterval??n?.rotationInterval??Oi,o=e.wordCount??n?.wordCount??1,s=e.tolerance??1;if(!Number.isInteger(r)||r<=0)throw new Error(`rotationInterval must be a positive integer, got ${r}`);if(o!==1&&o!==2&&o!==3)throw new Error(`wordCount must be 1, 2, or 3, got ${o}`);if(!Number.isInteger(s)||s<0||s>Zr)throw new RangeError(`tolerance must be an integer 0–${Zr}, got ${s}`);if(e.beaconInterval!==void 0&&(!Number.isInteger(e.beaconInterval)||e.beaconInterval<=0))throw new Error(`beaconInterval must be a positive integer, got ${e.beaconInterval}`);if(e.beaconPrecision!==void 0&&(!Number.isInteger(e.beaconPrecision)||e.beaconPrecision<1||e.beaconPrecision>11))throw new Error(`beaconPrecision must be an integer between 1 and 11, got ${e.beaconPrecision}`);for(const a of e.members)Qr(a);if(new Set(e.members).size!==e.members.length)throw new Error("Duplicate pubkeys in members array");if(e.creator!==void 0&&(Qr(e.creator),!e.members.includes(e.creator)))throw new Error("creator must be in members");return o===1&&e.members.length>=10&&console.warn(`[canary-kit] Group has ${e.members.length} members with 1-word encoding. CANARY spec recommends 2+ words for groups of 10+ members to avoid duress collision (~2.2% at 10 members).`),{name:e.name,seed:Au(),members:[...e.members],rotationInterval:r,wordCount:o,tolerance:s,wordlist:e.wordlist??"en-v1",counter:wt(t,r),usageOffset:0,createdAt:t,beaconInterval:e.beaconInterval??300,beaconPrecision:e.beaconPrecision??6,admins:e.creator?[e.creator]:[],epoch:0,consumedOps:[]}}function yb(e){const t=wt(Math.floor(Date.now()/1e3),e.rotationInterval),n=e.counter+e.usageOffset+1;if(n>t+Da)throw new RangeError(`Cannot advance counter: effective counter ${n} would exceed time-based counter ${t} + MAX_COUNTER_OFFSET (${Da})`);return{...e,usageOffset:e.usageOffset+1}}function Mi(e){return{...e,seed:Au(),usageOffset:0}}function Du(e,t){if(Qr(t),e.members.includes(t))return e;if(e.members.length>=Fa)throw new Error(`Cannot add member: group has reached the maximum of ${Fa} members`);return{...e,members:[...e.members,t]}}function ju(e,t){return Qr(t),{...e,members:e.members.filter(n=>n!==t)}}function gb(e,t=Math.floor(Date.now()/1e3)){const n=wt(t,e.rotationInterval);return n<=e.counter?e:{...e,counter:n,usageOffset:0}}const bb=new Set(["member-join","member-leave","counter-advance","reseed","beacon","duress-alert","duress-clear","liveness-checkin","state-snapshot"]),qu=new Set(["member-join","member-leave","counter-advance","reseed","state-snapshot","duress-alert","duress-clear"]),Ue=/^[0-9a-f]{64}$/,eo=100,pt=100,vb=2e7,br=256,Gn=300,to=60,Ga=1e3;function vr(e,t,n,r){const o=[...e,t];return o.length>Ga?{consumedOps:o.slice(-Ga),consumedOpsFloor:Math.max(r??0,n)}:{consumedOps:o,consumedOpsFloor:r}}const se=2;function Yt(e){return typeof e=="number"&&Number.isFinite(e)}function De(e){return Yt(e)&&Number.isInteger(e)&&e>=0}function Ls(e){const t={...e,protocolVersion:se};if(e.type==="reseed"){const{seed:n,...r}=t;return JSON.stringify({...r,seed:ze(e.seed)})}return JSON.stringify(t)}function Vn(e){if(e==null)return"null";if(typeof e=="number"){if(!Number.isFinite(e))throw new Error("stableStringify: NaN/Infinity not allowed in canonical signing");return JSON.stringify(e)}if(typeof e=="boolean"||typeof e=="string")return JSON.stringify(e);if(Array.isArray(e))return"["+e.map(Vn).join(",")+"]";if(e instanceof Uint8Array)throw new Error("stableStringify: Uint8Array must be hex-encoded before serialisation");if(typeof e=="object"){const t=e;return"{"+Object.keys(t).sort().filter(o=>t[o]!==void 0).map(o=>JSON.stringify(o)+":"+Vn(t[o])).join(",")+"}"}throw new Error(`stableStringify: unsupported type ${typeof e}`)}function Tn(e){if(e.type==="reseed"){const{seed:t,...n}=e;return Vn({...n,seed:ze(t)})}return Vn(e)}function $s(e){let t;try{t=JSON.parse(e)}catch{throw new Error("Invalid sync message: not valid JSON")}const n=t.type;if(typeof n!="string"||!bb.has(n))throw new Error(`Invalid sync message type: ${String(n)}`);const r=t.timestamp;if(!De(r))throw new Error("Invalid sync message: missing or invalid timestamp");const o=t.protocolVersion;if(o==null)throw new Error("Invalid sync message: protocolVersion is required");if(o!==se)throw new Error(`Unsupported protocol version: ${JSON.stringify(o)} (expected: ${se})`);switch(n){case"member-join":if(typeof t.pubkey!="string"||!Ue.test(t.pubkey))throw new Error("Invalid sync message: member-join requires a 64-char hex pubkey");if(!De(t.epoch))throw new Error("Invalid sync message: member-join requires a non-negative epoch");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: member-join requires a non-empty opId (max 128 chars)");if(t.displayName!==void 0&&(typeof t.displayName!="string"||t.displayName.length>256))throw new Error("Invalid sync message: member-join displayName must be a string of at most 256 characters");return{type:n,pubkey:t.pubkey,timestamp:r,epoch:t.epoch,opId:t.opId,...t.displayName!==void 0?{displayName:t.displayName}:{},protocolVersion:se};case"member-leave":if(typeof t.pubkey!="string"||!Ue.test(t.pubkey))throw new Error("Invalid sync message: member-leave requires a 64-char hex pubkey");if(!De(t.epoch))throw new Error("Invalid sync message: member-leave requires a non-negative epoch");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: member-leave requires a non-empty opId (max 128 chars)");return{type:n,pubkey:t.pubkey,timestamp:r,epoch:t.epoch,opId:t.opId,protocolVersion:se};case"liveness-checkin":if(typeof t.pubkey!="string"||!Ue.test(t.pubkey))throw new Error("Invalid sync message: liveness-checkin requires a 64-char hex pubkey");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: liveness-checkin requires a non-empty opId (max 128 chars)");return{type:n,pubkey:t.pubkey,timestamp:r,opId:t.opId,protocolVersion:se};case"counter-advance":if(!De(t.counter)||t.counter>4294967295)throw new Error("Invalid sync message: counter-advance requires a non-negative counter within uint32 range");if(!De(t.usageOffset))throw new Error("Invalid sync message: counter-advance requires a non-negative usageOffset");if(t.usageOffset>eo)throw new Error(`Invalid sync message: counter-advance usageOffset exceeds maximum of ${eo}`);return{type:n,counter:t.counter,usageOffset:t.usageOffset,timestamp:r,protocolVersion:se};case"reseed":if(typeof t.seed!="string"||!Ue.test(t.seed))throw new Error("Invalid sync message: reseed.seed must be a 64-char hex string");if(!De(t.counter))throw new Error("Invalid sync message: reseed requires a non-negative counter");if(!De(t.epoch))throw new Error("Invalid sync message: reseed requires a non-negative epoch");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: reseed requires a non-empty opId (max 128 chars)");if(!Array.isArray(t.admins)||!t.admins.every(s=>typeof s=="string"&&Ue.test(s)))throw new Error("Invalid sync message: reseed.admins must be 64-char hex pubkeys");if(!Array.isArray(t.members)||!t.members.every(s=>typeof s=="string"&&Ue.test(s)))throw new Error("Invalid sync message: reseed.members must be 64-char hex pubkeys");if(t.members.length>pt)throw new Error(`Invalid sync message: reseed.members exceeds maximum of ${pt}`);if(t.admins.length>pt)throw new Error(`Invalid sync message: reseed.admins exceeds maximum of ${pt}`);return{type:n,seed:F(t.seed),counter:t.counter,timestamp:r,epoch:t.epoch,opId:t.opId,admins:[...t.admins],members:[...t.members],protocolVersion:se};case"beacon":if(!Yt(t.lat)||!Yt(t.lon))throw new Error("Invalid sync message: beacon requires numeric lat and lon");if(t.lat<-90||t.lat>90||t.lon<-180||t.lon>180)throw new Error("Invalid sync message: beacon lat/lon out of range");if(!Yt(t.accuracy)||t.accuracy<0||t.accuracy>vb)throw new Error("Invalid sync message: beacon requires a non-negative accuracy");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: beacon requires a non-empty opId (max 128 chars)");return{type:n,lat:t.lat,lon:t.lon,accuracy:t.accuracy,timestamp:r,opId:t.opId,protocolVersion:se};case"duress-alert":if(!Yt(t.lat)||!Yt(t.lon))throw new Error("Invalid sync message: duress-alert requires numeric lat and lon");if(t.lat<-90||t.lat>90||t.lon<-180||t.lon>180)throw new Error("Invalid sync message: duress-alert lat/lon out of range");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: duress-alert requires a non-empty opId (max 128 chars)");if(t.subject!==void 0&&(typeof t.subject!="string"||t.subject.length>br))throw new Error(`Invalid sync message: duress-alert subject must be a string of at most ${br} characters`);return{type:n,lat:t.lat,lon:t.lon,timestamp:r,opId:t.opId,...t.subject!==void 0?{subject:t.subject}:{},protocolVersion:se};case"duress-clear":if(typeof t.subject!="string"||t.subject.length===0)throw new Error("Invalid sync message: duress-clear requires a non-empty subject");if(t.subject.length>br)throw new Error(`Invalid sync message: duress-clear subject exceeds maximum length of ${br} characters`);if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: duress-clear requires a non-empty opId (max 128 chars)");return{type:n,subject:t.subject,timestamp:r,opId:t.opId,protocolVersion:se};case"state-snapshot":if(typeof t.seed!="string"||!Ue.test(t.seed))throw new Error("Invalid sync message: state-snapshot requires a 64-char hex seed");if(!De(t.counter))throw new Error("Invalid sync message: state-snapshot requires a non-negative counter");if(!De(t.usageOffset))throw new Error("Invalid sync message: state-snapshot requires a non-negative usageOffset");if(!Array.isArray(t.members)||!t.members.every(s=>typeof s=="string"&&Ue.test(s)))throw new Error("Invalid sync message: state-snapshot members must be 64-char hex pubkeys");if(!Array.isArray(t.admins)||!t.admins.every(s=>typeof s=="string"&&Ue.test(s)))throw new Error("Invalid sync message: state-snapshot admins must be 64-char hex pubkeys");if(t.members.length>pt)throw new Error(`Invalid sync message: state-snapshot members exceeds maximum of ${pt}`);if(t.admins.length>pt)throw new Error(`Invalid sync message: state-snapshot admins exceeds maximum of ${pt}`);if(!De(t.epoch))throw new Error("Invalid sync message: state-snapshot requires a non-negative epoch");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: state-snapshot requires a non-empty opId (max 128 chars)");if(t.prevEpochSeed!==void 0&&(typeof t.prevEpochSeed!="string"||!Ue.test(t.prevEpochSeed)))throw new Error("Invalid sync message: state-snapshot.prevEpochSeed must be a 64-char hex string");return{type:n,seed:t.seed,counter:t.counter,usageOffset:t.usageOffset,members:[...t.members],admins:[...t.admins],epoch:t.epoch,opId:t.opId,timestamp:r,...t.prevEpochSeed!==void 0?{prevEpochSeed:t.prevEpochSeed}:{},protocolVersion:se}}throw new Error(`Invalid sync message type: ${n}`)}function Va(e,t){return e.type==="reseed"||e.type==="state-snapshot"||e.type==="member-join"&&e.pubkey!==t||e.type==="member-leave"&&e.pubkey!==t}function Co(e,t,n=Math.floor(Date.now()/1e3),r){if(Va(t,r)){if(!r||!e.admins.includes(r))return e;const o=t.epoch,s=t.opId;if(o===void 0||s===void 0||o<e.epoch)return e;if(t.type==="reseed"){if(o!==e.epoch+1)return e;const i=t;if(!i.admins||!i.members)return e;const a=new Set(i.members);if(!i.admins.every(c=>a.has(c)))return e}else if(t.type==="state-snapshot"){if(o<e.epoch)return e;const i=t;if(!i.admins||!i.members)return e;const a=new Set(i.members);if(!i.admins.every(c=>a.has(c)))return e}else if(o!==e.epoch)return e;if(t.type!=="reseed"&&!(t.type==="state-snapshot"&&o>e.epoch)&&(new Set(e.consumedOps).has(s)||e.consumedOpsFloor!==void 0&&t.timestamp<=e.consumedOpsFloor))return e}if(t.type==="duress-alert"||t.type==="duress-clear"||t.type==="beacon"||t.type==="liveness-checkin"){const o=n-t.timestamp;if(o>Gn||o<-to)return e}if(qu.has(t.type)&&t.timestamp>n+to||t.type==="liveness-checkin"&&r&&t.pubkey!==r||(t.type==="member-leave"||t.type==="member-join"||t.type==="duress-clear")&&!Va(t,r)&&(new Set(e.consumedOps).has(t.opId)||e.consumedOpsFloor!==void 0&&t.timestamp<=e.consumedOpsFloor))return e;switch(t.type){case"member-join":{let o;try{o=Du(e,t.pubkey)}catch{return e}const s=vr(o.consumedOps,t.opId,t.timestamp,e.consumedOpsFloor),i=t.displayName?{memberNames:{...o.memberNames,[t.pubkey]:t.displayName}}:{};return{...o,...s,...i}}case"member-leave":if(!e.members.includes(t.pubkey))return e;{const o=ju(e,t.pubkey),s=vr(o.consumedOps,t.opId,t.timestamp,e.consumedOpsFloor);return{...o,...s}}case"counter-advance":{if(!r||!e.members.includes(r)||t.usageOffset>eo)return e;const o=e.counter+e.usageOffset,s=t.counter+t.usageOffset;if(s<=o)return e;const a=Math.floor(n/e.rotationInterval)+eo;return s>a?e:{...e,counter:t.counter,usageOffset:t.usageOffset}}case"reseed":return{...e,seed:ze(t.seed),counter:t.counter,usageOffset:0,members:[...t.members],admins:[...t.admins],epoch:t.epoch,consumedOps:[t.opId]};case"state-snapshot":{if(t.epoch===e.epoch){if(t.seed!==e.seed)return e;const o=e.counter+e.usageOffset;if(t.counter+t.usageOffset<o||!e.members.every(a=>t.members.includes(a))||!e.admins.every(a=>t.admins.includes(a)))return e;const i=vr(e.consumedOps,t.opId,t.timestamp,e.consumedOpsFloor);return{...e,counter:t.counter,usageOffset:t.usageOffset,members:[...t.members],admins:[...t.admins],...i}}return e}case"duress-clear":{const o=vr(e.consumedOps,t.opId,t.timestamp,e.consumedOpsFloor);return{...e,...o}}case"beacon":case"duress-alert":case"liveness-checkin":return e;default:return e}}function wb(e,t,n=Math.floor(Date.now()/1e3),r){const o=Co(e,t,n,r);if(t.type==="beacon"||t.type==="duress-alert"||t.type==="liveness-checkin"){const s=n-t.timestamp,i=s<=Gn&&s>=-to,a=t.type!=="liveness-checkin"||!r||t.pubkey===r;return{state:o,applied:i&&a}}return{state:o,applied:o!==e}}const Bi=Object.freeze(Object.defineProperty({__proto__:null,FIRE_AND_FORGET_FRESHNESS_SEC:Gn,MAX_FUTURE_SKEW_SEC:to,PROTOCOL_VERSION:se,STORED_MESSAGE_TYPES:qu,applySyncMessage:Co,applySyncMessageWithResult:wb,canonicaliseSyncMessage:Tn,decodeSyncMessage:$s,decryptEnvelope:Ou,deriveGroupKey:Lu,deriveGroupSigningKey:Mu,encodeSyncMessage:Ls,encryptEnvelope:$u,hashGroupTag:Bu,stableStringify:Vn},Symbol.toStringTag,{value:"Module"}));var Wt=Symbol("verified"),Eb=e=>e instanceof Object;function kb(e){if(!Eb(e)||typeof e.kind!="number"||typeof e.content!="string"||typeof e.created_at!="number"||typeof e.pubkey!="string"||!e.pubkey.match(/^[a-f0-9]{64}$/)||!Array.isArray(e.tags))return!1;for(let t=0;t<e.tags.length;t++){let n=e.tags[t];if(!Array.isArray(n))return!1;for(let r=0;r<n.length;r++)if(typeof n[r]!="string")return!1}return!0}new TextDecoder("utf-8");var _b=new TextEncoder,xb=class{generateSecretKey(){return te.utils.randomSecretKey()}getPublicKey(t){return H(te.getPublicKey(t))}finalizeEvent(t,n){const r=t;return r.pubkey=H(te.getPublicKey(n)),r.id=os(r),r.sig=H(te.sign(z(os(r)),n)),r[Wt]=!0,r}verifyEvent(t){if(typeof t[Wt]=="boolean")return t[Wt];try{const n=os(t);if(n!==t.id)return t[Wt]=!1,!1;const r=te.verify(z(t.sig),z(n),z(t.pubkey));return t[Wt]=r,r}catch{return t[Wt]=!1,!1}}};function Sb(e){if(!kb(e))throw new Error("can't serialize event with wrong or missing properties");return JSON.stringify([0,e.pubkey,e.created_at,e.kind,e.tags,e.content])}function os(e){let t=ce(_b.encode(Sb(e)));return H(t)}var To=new xb,Ib=To.generateSecretKey,No=To.getPublicKey,it=To.finalizeEvent,at=To.verifyEvent,Rb=new TextDecoder("utf-8"),Hu=new TextEncoder,Fu=1,Gu=65535;function Ee(e,t){const n=je.getSharedSecret(e,z("02"+t)).subarray(1,33);return Il(ce,n,Hu.encode("nip44-v2"))}function Vu(e,t){const n=Rl(ce,e,t,76);return{chacha_key:n.subarray(0,32),chacha_nonce:n.subarray(32,44),hmac_key:n.subarray(44,76)}}function Ku(e){if(!Number.isSafeInteger(e)||e<1)throw new Error("expected positive integer");if(e<=32)return 32;const t=1<<Math.floor(Math.log2(e-1))+1,n=t<=256?32:t/8;return n*(Math.floor((e-1)/n)+1)}function Ab(e){if(!Number.isSafeInteger(e)||e<Fu||e>Gu)throw new Error("invalid plaintext size: must be between 1 and 65535 bytes");const t=new Uint8Array(2);return new DataView(t.buffer).setUint16(0,e,!1),t}function Cb(e){const t=Hu.encode(e),n=t.length,r=Ab(n),o=new Uint8Array(Ku(n)-n);return oe(r,t,o)}function Tb(e){const t=new DataView(e.buffer).getUint16(0),n=e.subarray(2,2+t);if(t<Fu||t>Gu||n.length!==t||e.length!==2+Ku(t))throw new Error("invalid padding");return Rb.decode(n)}function Wu(e,t,n){if(n.length!==32)throw new Error("AAD associated data must be 32 bytes");const r=oe(n,t);return st(ce,e,r)}function Nb(e){if(typeof e!="string")throw new Error("payload must be a valid string");const t=e.length;if(t<132||t>87472)throw new Error("invalid payload length: "+t);if(e[0]==="#")throw new Error("unknown encryption version");let n;try{n=Ke.decode(e)}catch(s){throw new Error("invalid base64: "+s.message)}const r=n.length;if(r<99||r>65603)throw new Error("invalid data length: "+r);const o=n[0];if(o!==2)throw new Error("unknown encryption version "+o);return{nonce:n.subarray(1,33),ciphertext:n.subarray(33,-32),mac:n.subarray(-32)}}function Dt(e,t,n=Et(32)){const{chacha_key:r,chacha_nonce:o,hmac_key:s}=Vu(t,n),i=Cb(e),a=yo(r,o,i),c=Wu(s,a,n);return Ke.encode(oe(new Uint8Array([2]),n,a,c))}function jt(e,t){const{nonce:n,ciphertext:r,mac:o}=Nb(e),{chacha_key:s,chacha_nonce:i,hmac_key:a}=Vu(t,n),c=Wu(a,r,n);if(!bl(c,o))throw new Error("invalid MAC");const l=yo(s,i,r);return Tb(l)}function ss(e){if(!/^[0-9a-f]*$/i.test(e)||e.length%2!==0)throw new Error(`Invalid hex string: "${e.slice(0,20)}${e.length>20?"…":""}"`);const t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function Lb(e){return Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}class Ka{constructor(t,n){this.pubkey=t,this.privkeyHex=n}async sign(t){const n=ss(this.privkeyHex);return it(t,n)}async encrypt(t,n){const r=ss(this.privkeyHex),o=Ee(r,n);return Dt(t,o)}async decrypt(t,n){const r=ss(this.privkeyHex),o=Ee(r,n);return jt(t,o)}}class zu{pubkey;signingKey;constructor(t,n){this.signingKey=Mu(t,n),this.pubkey=No(this.signingKey)}async sign(t){return it(t,this.signingKey)}}function Ju(){return typeof window.nostr?.signEvent=="function"}async function $b(e){if(e.privkey&&e.pubkey)return{signer:new Ka(e.pubkey,e.privkey),signerType:"local",pubkey:e.pubkey,privkey:e.privkey};const t=Ib(),n=No(t),r=Lb(t);return{signer:new Ka(n,r),signerType:"local",pubkey:n,privkey:r}}var It=Symbol("verified"),Ob=e=>e instanceof Object;function Mb(e){if(!Ob(e)||typeof e.kind!="number"||typeof e.content!="string"||typeof e.created_at!="number"||typeof e.pubkey!="string"||!e.pubkey.match(/^[a-f0-9]{64}$/)||!Array.isArray(e.tags))return!1;for(let t=0;t<e.tags.length;t++){let n=e.tags[t];if(!Array.isArray(n))return!1;for(let r=0;r<n.length;r++)if(typeof n[r]!="string")return!1}return!0}new TextDecoder("utf-8");var Bb=new TextEncoder;function Nn(e){try{e.indexOf("://")===-1&&(e="wss://"+e);let t=new URL(e);return t.protocol==="http:"?t.protocol="ws:":t.protocol==="https:"&&(t.protocol="wss:"),t.pathname=t.pathname.replace(/\/+/g,"/"),t.pathname.endsWith("/")&&(t.pathname=t.pathname.slice(0,-1)),(t.port==="80"&&t.protocol==="ws:"||t.port==="443"&&t.protocol==="wss:")&&(t.port=""),t.searchParams.sort(),t.hash="",t.toString()}catch{throw new Error(`Invalid URL: ${e}`)}}var Pb=class{generateSecretKey(){return te.utils.randomSecretKey()}getPublicKey(e){return H(te.getPublicKey(e))}finalizeEvent(e,t){const n=e;return n.pubkey=H(te.getPublicKey(t)),n.id=is(n),n.sig=H(te.sign(z(is(n)),t)),n[It]=!0,n}verifyEvent(e){if(typeof e[It]=="boolean")return e[It];try{const t=is(e);if(t!==e.id)return e[It]=!1,!1;const n=te.verify(z(e.sig),z(t),z(e.pubkey));return e[It]=n,n}catch{return e[It]=!1,!1}}};function Ub(e){if(!Mb(e))throw new Error("can't serialize event with wrong or missing properties");return JSON.stringify([0,e.pubkey,e.created_at,e.kind,e.tags,e.content])}function is(e){let t=ce(Bb.encode(Ub(e)));return H(t)}var Lo=new Pb;Lo.generateSecretKey;Lo.getPublicKey;Lo.finalizeEvent;var Db=Lo.verifyEvent,jb=22242;function qb(e,t){if(e.ids&&e.ids.indexOf(t.id)===-1||e.kinds&&e.kinds.indexOf(t.kind)===-1||e.authors&&e.authors.indexOf(t.pubkey)===-1)return!1;for(let n in e)if(n[0]==="#"){let r=n.slice(1),o=e[`#${r}`];if(o&&!t.tags.find(([s,i])=>s===n.slice(1)&&o.indexOf(i)!==-1))return!1}return!(e.since&&t.created_at<e.since||e.until&&t.created_at>e.until)}function Hb(e,t){for(let n=0;n<e.length;n++)if(qb(e[n],t))return!0;return!1}function Fb(e,t){let n=t.length+3,r=e.indexOf(`"${t}":`)+n,o=e.slice(r).indexOf('"')+r+1;return e.slice(o,o+64)}function Gb(e){let t=e.slice(0,22).indexOf('"EVENT"');if(t===-1)return null;let n=e.slice(t+7+1).indexOf('"');if(n===-1)return null;let r=t+7+1+n,o=e.slice(r+1,80).indexOf('"');if(o===-1)return null;let s=r+1+o;return e.slice(r+1,s)}function Vb(e,t){return{kind:jb,created_at:Math.floor(Date.now()/1e3),tags:[["relay",e],["challenge",t]],content:""}}var Yu=class extends Error{constructor(e,t){super(`Tried to send message '${e} on a closed connection to ${t}.`),this.name="SendingOnClosedConnection"}},Zu=class{url;_connected=!1;onclose=null;onnotice=e=>console.debug(`NOTICE from ${this.url}: ${e}`);onauth;baseEoseTimeout=4400;publishTimeout=4400;pingFrequency=29e3;pingTimeout=2e4;resubscribeBackoff=[1e4,1e4,1e4,2e4,2e4,3e4,6e4];openSubs=new Map;enablePing;enableReconnect;idleSince=Date.now();ongoingOperations=0;reconnectTimeoutHandle;pingIntervalHandle;reconnectAttempts=0;skipReconnection=!1;connectionPromise;openCountRequests=new Map;openEventPublishes=new Map;ws;challenge;authPromise;serial=0;verifyEvent;_WebSocket;constructor(e,t){this.url=Nn(e),this.verifyEvent=t.verifyEvent,this._WebSocket=t.websocketImplementation||WebSocket,this.enablePing=t.enablePing,this.enableReconnect=t.enableReconnect||!1}static async connect(e,t){const n=new Zu(e,t);return await n.connect(t),n}closeAllSubscriptions(e){for(let[t,n]of this.openSubs)n.close(e);this.openSubs.clear();for(let[t,n]of this.openEventPublishes)n.reject(new Error(e));this.openEventPublishes.clear();for(let[t,n]of this.openCountRequests)n.reject(new Error(e));this.openCountRequests.clear()}get connected(){return this._connected}async reconnect(){const e=this.resubscribeBackoff[Math.min(this.reconnectAttempts,this.resubscribeBackoff.length-1)];this.reconnectAttempts++,this.reconnectTimeoutHandle=setTimeout(async()=>{try{await this.connect()}catch{}},e)}handleHardClose(e){this.pingIntervalHandle&&(clearInterval(this.pingIntervalHandle),this.pingIntervalHandle=void 0),this._connected=!1,this.connectionPromise=void 0,this.idleSince=void 0,this.enableReconnect&&!this.skipReconnection?this.reconnect():(this.onclose?.(),this.closeAllSubscriptions(e))}async connect(e){let t;return this.connectionPromise?this.connectionPromise:(this.challenge=void 0,this.authPromise=void 0,this.skipReconnection=!1,this.connectionPromise=new Promise((n,r)=>{e?.timeout&&(t=setTimeout(()=>{r("connection timed out"),this.connectionPromise=void 0,this.skipReconnection=!0,this.onclose?.(),this.handleHardClose("relay connection timed out")},e.timeout)),e?.abort&&(e.abort.onabort=r);try{this.ws=new this._WebSocket(this.url)}catch(o){clearTimeout(t),r(o);return}this.ws.onopen=()=>{this.reconnectTimeoutHandle&&(clearTimeout(this.reconnectTimeoutHandle),this.reconnectTimeoutHandle=void 0),clearTimeout(t),this._connected=!0;const o=this.reconnectAttempts>0;this.reconnectAttempts=0;for(const s of this.openSubs.values()){if(s.eosed=!1,o)for(let i=0;i<s.filters.length;i++)s.lastEmitted&&(s.filters[i].since=s.lastEmitted+1);s.fire()}this.enablePing&&(this.pingIntervalHandle=setInterval(()=>this.pingpong(),this.pingFrequency)),n()},this.ws.onerror=()=>{clearTimeout(t),r("connection failed"),this.connectionPromise=void 0,this.skipReconnection=!0,this.onclose?.(),this.handleHardClose("relay connection failed")},this.ws.onclose=o=>{clearTimeout(t),r(o.message||"websocket closed"),this.handleHardClose("relay connection closed")},this.ws.onmessage=this._onmessage.bind(this)}),this.connectionPromise)}waitForPingPong(){return new Promise(e=>{this.ws.once("pong",()=>e(!0)),this.ws.ping()})}waitForDummyReq(){return new Promise((e,t)=>{if(!this.connectionPromise)return t(new Error(`no connection to ${this.url}, can't ping`));try{const n=this.subscribe([{ids:["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"],limit:0}],{label:"<forced-ping>",oneose:()=>{e(!0),n.close()},onclose(){e(!0)},eoseTimeout:this.pingTimeout+1e3})}catch(n){t(n)}})}async pingpong(){this.ws?.readyState===1&&(await Promise.any([this.ws&&this.ws.ping&&this.ws.once?this.waitForPingPong():this.waitForDummyReq(),new Promise(t=>setTimeout(()=>t(!1),this.pingTimeout))])||this.ws?.readyState===this._WebSocket.OPEN&&this.ws?.close())}async send(e){if(!this.connectionPromise)throw new Yu(e,this.url);this.connectionPromise.then(()=>{this.ws?.send(e)})}async auth(e){const t=this.challenge;if(!t)throw new Error("can't perform auth, no challenge was received");return this.authPromise?this.authPromise:(this.authPromise=new Promise(async(n,r)=>{try{let o=await e(Vb(this.url,t)),s=setTimeout(()=>{let i=this.openEventPublishes.get(o.id);i&&(i.reject(new Error("auth timed out")),this.openEventPublishes.delete(o.id))},this.publishTimeout);this.openEventPublishes.set(o.id,{resolve:n,reject:r,timeout:s}),this.send('["AUTH",'+JSON.stringify(o)+"]")}catch(o){console.warn("subscribe auth function failed:",o)}}),this.authPromise)}async publish(e){this.idleSince=void 0,this.ongoingOperations++;const t=new Promise((n,r)=>{const o=setTimeout(()=>{const s=this.openEventPublishes.get(e.id);s&&(s.reject(new Error("publish timed out")),this.openEventPublishes.delete(e.id))},this.publishTimeout);this.openEventPublishes.set(e.id,{resolve:n,reject:r,timeout:o})});return this.send('["EVENT",'+JSON.stringify(e)+"]"),this.ongoingOperations--,this.ongoingOperations===0&&(this.idleSince=Date.now()),t}async count(e,t){this.serial++;const n=t?.id||"count:"+this.serial,r=new Promise((o,s)=>{this.openCountRequests.set(n,{resolve:o,reject:s})});return this.send('["COUNT","'+n+'",'+JSON.stringify(e).substring(1)),r}subscribe(e,t){t.label!=="<forced-ping>"&&(this.idleSince=void 0,this.ongoingOperations++);const n=this.prepareSubscription(e,t);return n.fire(),t.abort&&(t.abort.onabort=()=>n.close(String(t.abort.reason||"<aborted>"))),n}prepareSubscription(e,t){this.serial++;const n=t.id||(t.label?t.label+":":"sub:")+this.serial,r=new Kb(this,n,e,t);return this.openSubs.set(n,r),r}close(){this.skipReconnection=!0,this.reconnectTimeoutHandle&&(clearTimeout(this.reconnectTimeoutHandle),this.reconnectTimeoutHandle=void 0),this.pingIntervalHandle&&(clearInterval(this.pingIntervalHandle),this.pingIntervalHandle=void 0),this.closeAllSubscriptions("relay connection closed by us"),this._connected=!1,this.idleSince=void 0,this.onclose?.(),this.ws?.readyState===this._WebSocket.OPEN&&this.ws?.close()}_onmessage(e){const t=e.data;if(!t)return;const n=Gb(t);if(n){const r=this.openSubs.get(n);if(!r)return;const o=Fb(t,"id"),s=r.alreadyHaveEvent?.(o);if(r.receivedEvent?.(this,o),s)return}try{let r=JSON.parse(t);switch(r[0]){case"EVENT":{const o=this.openSubs.get(r[1]),s=r[2];this.verifyEvent(s)&&Hb(o.filters,s)?o.onevent(s):o.oninvalidevent?.(s),(!o.lastEmitted||o.lastEmitted<s.created_at)&&(o.lastEmitted=s.created_at);return}case"COUNT":{const o=r[1],s=r[2],i=this.openCountRequests.get(o);i&&(i.resolve(s.count),this.openCountRequests.delete(o));return}case"EOSE":{const o=this.openSubs.get(r[1]);if(!o)return;o.receivedEose();return}case"OK":{const o=r[1],s=r[2],i=r[3],a=this.openEventPublishes.get(o);a&&(clearTimeout(a.timeout),s?a.resolve(i):a.reject(new Error(i)),this.openEventPublishes.delete(o));return}case"CLOSED":{const o=r[1],s=this.openSubs.get(o);if(!s)return;s.closed=!0,s.close(r[2]);return}case"NOTICE":{this.onnotice(r[1]);return}case"AUTH":{this.challenge=r[1],this.onauth&&this.auth(this.onauth);return}default:{this.openSubs.get(r[1])?.oncustom?.(r);return}}}catch(r){try{const[o,s,i]=JSON.parse(t);console.warn(`[nostr] relay ${this.url} error processing message:`,r,i)}catch{console.warn(`[nostr] relay ${this.url} error processing message:`,r)}return}}},Kb=class{relay;id;lastEmitted;closed=!1;eosed=!1;filters;alreadyHaveEvent;receivedEvent;onevent;oninvalidevent;oneose;onclose;oncustom;eoseTimeout;eoseTimeoutHandle;constructor(e,t,n,r){if(n.length===0)throw new Error("subscription can't be created with zero filters");this.relay=e,this.filters=n,this.id=t,this.alreadyHaveEvent=r.alreadyHaveEvent,this.receivedEvent=r.receivedEvent,this.eoseTimeout=r.eoseTimeout||e.baseEoseTimeout,this.oneose=r.oneose,this.onclose=r.onclose,this.oninvalidevent=r.oninvalidevent,this.onevent=r.onevent||(o=>{console.warn(`onevent() callback not defined for subscription '${this.id}' in relay ${this.relay.url}. event received:`,o)})}fire(){this.relay.send('["REQ","'+this.id+'",'+JSON.stringify(this.filters).substring(1)),this.eoseTimeoutHandle=setTimeout(this.receivedEose.bind(this),this.eoseTimeout)}receivedEose(){this.eosed||(clearTimeout(this.eoseTimeoutHandle),this.eosed=!0,this.oneose?.())}close(e="closed by caller"){if(!this.closed&&this.relay.connected){try{this.relay.send('["CLOSE",'+JSON.stringify(this.id)+"]")}catch(t){if(!(t instanceof Yu))throw t}this.closed=!0}this.relay.openSubs.delete(this.id),this.relay.ongoingOperations--,this.relay.ongoingOperations===0&&(this.relay.idleSince=Date.now()),this.onclose?.(e)}},Wb=e=>(e[It]=!0,!0),zb=class{relays=new Map;seenOn=new Map;trackRelays=!1;verifyEvent;enablePing;enableReconnect;automaticallyAuth;trustedRelayURLs=new Set;onRelayConnectionFailure;onRelayConnectionSuccess;allowConnectingToRelay;maxWaitForConnection;_WebSocket;constructor(e){this.verifyEvent=e.verifyEvent,this._WebSocket=e.websocketImplementation,this.enablePing=e.enablePing,this.enableReconnect=e.enableReconnect||!1,this.automaticallyAuth=e.automaticallyAuth,this.onRelayConnectionFailure=e.onRelayConnectionFailure,this.onRelayConnectionSuccess=e.onRelayConnectionSuccess,this.allowConnectingToRelay=e.allowConnectingToRelay,this.maxWaitForConnection=e.maxWaitForConnection||3e3}async ensureRelay(e,t){e=Nn(e);let n=this.relays.get(e);if(n||(n=new Zu(e,{verifyEvent:this.trustedRelayURLs.has(e)?Wb:this.verifyEvent,websocketImplementation:this._WebSocket,enablePing:this.enablePing,enableReconnect:this.enableReconnect}),n.onclose=()=>{this.relays.delete(e)},this.relays.set(e,n)),this.automaticallyAuth){const r=this.automaticallyAuth(e);r&&(n.onauth=r)}try{await n.connect({timeout:t?.connectionTimeout,abort:t?.abort})}catch(r){throw this.relays.delete(e),r}return n}close(e){e.map(Nn).forEach(t=>{this.relays.get(t)?.close(),this.relays.delete(t)})}subscribe(e,t,n){const r=[],o=[];for(let s=0;s<e.length;s++){const i=Nn(e[s]);r.find(a=>a.url===i)||o.indexOf(i)===-1&&(o.push(i),r.push({url:i,filter:t}))}return this.subscribeMap(r,n)}subscribeMany(e,t,n){return this.subscribe(e,t,n)}subscribeMap(e,t){const n=new Map;for(const f of e){const{url:p,filter:h}=f;n.has(p)||n.set(p,[]),n.get(p).push(h)}const r=Array.from(n.entries()).map(([f,p])=>({url:f,filters:p}));this.trackRelays&&(t.receivedEvent=(f,p)=>{let h=this.seenOn.get(p);h||(h=new Set,this.seenOn.set(p,h)),h.add(f)});const o=new Set,s=[],i=[];let a=f=>{i[f]||(i[f]=!0,i.filter(p=>p).length===r.length&&(t.oneose?.(),a=()=>{}))};const c=[];let l=(f,p)=>{c[f]||(a(f),c[f]=p,c.filter(h=>h).length===r.length&&(t.onclose?.(c),l=()=>{}))};const u=f=>{if(t.alreadyHaveEvent?.(f))return!0;const p=o.has(f);return o.add(f),p},d=Promise.all(r.map(async({url:f,filters:p},h)=>{if(this.allowConnectingToRelay?.(f,["read",p])===!1){l(h,"connection skipped by allowConnectingToRelay");return}let m;try{m=await this.ensureRelay(f,{connectionTimeout:this.maxWaitForConnection<(t.maxWait||0)?Math.max(t.maxWait*.8,t.maxWait-1e3):this.maxWaitForConnection,abort:t.abort})}catch(g){this.onRelayConnectionFailure?.(f),l(h,g?.message||String(g));return}this.onRelayConnectionSuccess?.(f);let y=m.subscribe(p,{...t,oneose:()=>a(h),onclose:g=>{g.startsWith("auth-required: ")&&t.onauth?m.auth(t.onauth).then(()=>{m.subscribe(p,{...t,oneose:()=>a(h),onclose:E=>{l(h,E)},alreadyHaveEvent:u,eoseTimeout:t.maxWait,abort:t.abort})}).catch(E=>{l(h,`auth was required and attempted, but failed with: ${E}`)}):l(h,g)},alreadyHaveEvent:u,eoseTimeout:t.maxWait,abort:t.abort});s.push(y)}));return{async close(f){await d,s.forEach(p=>{p.close(f)})}}}subscribeEose(e,t,n){let r;return r=this.subscribe(e,t,{...n,oneose(){const o="closed automatically on eose";r?r.close(o):n.onclose?.(e.map(s=>o))}}),r}subscribeManyEose(e,t,n){return this.subscribeEose(e,t,n)}async querySync(e,t,n){return new Promise(async r=>{const o=[];this.subscribeEose(e,t,{...n,onevent(s){o.push(s)},onclose(s){r(o)}})})}async get(e,t,n){t.limit=1;const r=await this.querySync(e,t,n);return r.sort((o,s)=>s.created_at-o.created_at),r[0]||null}publish(e,t,n){return e.map(Nn).map(async(r,o,s)=>{if(s.indexOf(r)!==o)return Promise.reject("duplicate url");if(this.allowConnectingToRelay?.(r,["write",t])===!1)return Promise.reject("connection skipped by allowConnectingToRelay");let i;try{i=await this.ensureRelay(r,{connectionTimeout:this.maxWaitForConnection<(n?.maxWait||0)?Math.max(n.maxWait*.8,n.maxWait-1e3):this.maxWaitForConnection,abort:n?.abort})}catch(a){return this.onRelayConnectionFailure?.(r),"connection failure: "+String(a)}return i.publish(t).catch(async a=>{if(a instanceof Error&&a.message.startsWith("auth-required: ")&&n?.onauth)return await i.auth(n.onauth),i.publish(t);throw a}).then(a=>{if(this.trackRelays){let c=this.seenOn.get(t.id);c||(c=new Set,this.seenOn.set(t.id,c)),c.add(i)}return a})})}listConnectionStatus(){const e=new Map;return this.relays.forEach((t,n)=>e.set(n,t.connected)),e}destroy(){this.relays.forEach(e=>e.close()),this.relays=new Map}pruneIdleRelays(e=1e4){const t=[];for(const[n,r]of this.relays)r.idleSince&&Date.now()-r.idleSince>=e&&(this.relays.delete(n),t.push(n),r.close());return t}},Xu;try{Xu=WebSocket}catch{}var Jb=class extends zb{constructor(e){super({verifyEvent:Db,websocketImplementation:Xu,maxWaitForConnection:3e3,...e})}};let Ie=null,ln=!1,$o=0,Tt=[],Nt=[];function Kn(){const e=new Set([...Tt,...Nt]);return Array.from(e)}let Qu=Promise.resolve();function Pi(e,t){const n=Se(e),r=t?Se(t):[...n];Ie&&n.length===Tt.length&&n.every(s=>Tt.includes(s))&&r.length===Nt.length&&r.every(s=>Nt.includes(s))||(Ie&&(Ie.close(Kn()),Ie=null,ln=!1,$o=0,Tt=[],Nt=[]),Tt=n,Nt=r,Kn().length===0)||(Ie=new Jb,ln=!1,Qu=Yb())}function Oo(){return Qu}async function Yb(){if(!Ie)return;const e=Ie,t=Kn();if(t.length===0)return;let n=0;for(const r of t)try{await e.ensureRelay(r,{connectionTimeout:5e3}),n++}catch(o){console.warn(`[canary:relay] Failed to connect to ${r}:`,o)}Ie===e&&(ln=n>0,$o=n,ln?console.info(`[canary:relay] Connected to ${n}/${t.length} relay(s)`):console.error("[canary:relay] Could not connect to any relay:",t))}function ed(){Ie&&Ie.close(Kn()),Ie=null,ln=!1,$o=0,Tt=[],Nt=[]}function ae(){return Ie}function Ft(){return ln}function qt(){return $o}function Zb(){return Kn()}function Ui(){return[...Tt]}function Di(){return[...Nt]}const Dn=Object.freeze(Object.defineProperty({__proto__:null,connectRelays:Pi,disconnectRelays:ed,getPool:ae,getReadRelayUrls:Ui,getRelayCount:qt,getRelayUrls:Zb,getWriteRelayUrls:Di,isConnected:Ft,waitForConnection:Oo},Symbol.toStringTag,{value:"Module"})),xt={groupState:30078,signal:20078,giftWrap:1059},Wa=new Set(["member-join","member-leave","counter-advance","reseed","state-snapshot","duress-alert","duress-clear"]),wr=/^[0-9a-f]{64}$/,za=/^[0-9a-f]{128}$/,Er=new TextEncoder,Xb=3,Qb=6e4;class ev{constructor(t){this.capacity=t}order=[];items=new Set;has(t){return this.items.has(t)}add(t){if(!this.items.has(t)){if(this.order.length>=this.capacity){const n=this.order.shift();this.items.delete(n)}this.order.push(t),this.items.add(t)}}}class no{constructor(t,n,r,o){this.personalPubkey=r,this.personalPrivkey=o,this.readRelays=Se(t),this.writeRelays=Se(n)}subs=new Map;groupKeys=new Map;tagHashToGroupId=new Map;seenEventIds=new ev(1e3);decryptFailures=new Map;recoveryPending=new Map;recoverySub=null;readRelays;writeRelays;updateRelays(t,n){this.readRelays=Se(t),this.writeRelays=n?Se(n):[...this.readRelays]}get allRelays(){return Se([...this.readRelays,...this.writeRelays])}registerGroup(t,n,r,o,s){const i=Bu(t);console.info("[canary:sync] registerGroup",t.slice(0,8),"→ tagHash",i.slice(0,12),"members:",o.length),this.groupKeys.set(t,{key:Lu(n),signer:r,tagHash:i,members:new Set(o),admins:new Set(s?.admins??[]),onRecoveryRequest:s?.onRecoveryRequest,onRecoveryResponse:s?.onRecoveryResponse}),this.tagHashToGroupId.set(i,t)}unregisterGroup(t){const n=this.groupKeys.get(t);n&&(n.key.fill(0),this.tagHashToGroupId.delete(n.tagHash)),this.groupKeys.delete(t),this.decryptFailures.delete(t),this.recoveryPending.delete(t)}async send(t,n,r){Ft()||Pi(this.readRelays,this.writeRelays);const o=ae();if(!o)return;const s=this.groupKeys.get(t);if(!s){console.warn("[canary:sync] No group key registered for",t);return}const i=Ls(n),a={...n,protocolVersion:se},c=Tn(a),l=we(Er.encode(c)),u=ze(te.sign(l,F(this.personalPrivkey))),d=JSON.stringify({s:this.personalPubkey,sig:u,p:i}),f=await $u(s.key,d),p=Wa.has(n.type),h=p?xt.groupState:xt.signal,y=[["d",p?`ssg/${s.tagHash}:${n.type}`:`ssg/${s.tagHash}`]];p?y.push(["expiration",String(Math.floor(Date.now()/1e3)+10080*60)]):y.push(["t",n.type]);const g={kind:h,content:f,tags:y,created_at:Math.floor(Date.now()/1e3)};try{const E=await s.signer.sign(g);typeof E.id=="string"&&this.seenEventIds.add(E.id),console.info("[canary:sync] Publishing",n.type,"to",t.slice(0,8),"→ d-tag:",s.tagHash.slice(0,12),"(write relays only)"),await o.publish(this.writeRelays,E),console.info("[canary:sync] Published OK")}catch(E){console.error("[canary:sync] Publish failed:",E)}}subscribe(t,n){const r=ae();if(!r)return()=>{};const o=this.groupKeys.get(t);if(!o)return console.warn("[canary:sync] No group key registered for",t),()=>{};this._ensureRecoverySub();const s=Array.from(Wa).map(c=>`ssg/${o.tagHash}:${c}`),i={kinds:[xt.groupState,xt.signal],"#d":[`ssg/${o.tagHash}`,...s],since:Math.floor(Date.now()/1e3)-10080*60};console.info("[canary:sync] Subscribing to",t.slice(0,8),"→ filter:",JSON.stringify(i));const a=r.subscribeMany(this.allRelays,i,{onevent:async c=>{try{if(!c||typeof c!="object"||typeof c.pubkey!="string"||typeof c.content!="string")return;console.info("[canary:sync] Received event",c.id?.slice(0,12),"kind:",c.kind,"from pubkey:",c.pubkey?.slice(0,12));const l=this.groupKeys.get(t);if(!l)return;if(!at(c)){console.warn("[canary:sync] Rejected event with invalid signature");return}if(typeof c.id=="string"&&this.seenEventIds.has(c.id))return;if(typeof c.content=="string"&&c.content.length>65536){console.warn("[canary:sync] Rejected oversized event content");return}let u;try{u=await Ou(l.key,c.content)}catch{this._trackDecryptFailure(t);return}this.decryptFailures.delete(t);let d;try{d=JSON.parse(u)}catch{console.warn("[canary:sync] Rejected malformed envelope");return}if(!d||typeof d!="object"){console.warn("[canary:sync] Rejected malformed envelope");return}const f=d.s,p=d.sig,h=d.p;if(typeof f!="string"||typeof p!="string"||typeof h!="string"){console.warn("[canary:sync] Rejected envelope with missing sender proof fields");return}if(!wr.test(f)||!za.test(p)){console.warn("[canary:sync] Rejected envelope with invalid sender proof encoding");return}const m=$s(h),y={...m,protocolVersion:se},g=Tn(y),E=we(Er.encode(g));if(!te.verify(F(p),E,F(f))){console.warn("[canary:sync] Rejected envelope with invalid sender proof");return}if(m.type!=="member-join"&&!l.members.has(f)){console.warn("[canary:sync] Rejected message from non-member pubkey");return}if(m.type==="liveness-checkin"&&m.pubkey!==f){console.warn("[canary:sync] Rejected liveness-checkin with mismatched sender");return}console.info("[canary:sync] Dispatching",m.type,"from sender",f.slice(0,8)),n(m,f),typeof c.id=="string"&&this.seenEventIds.add(c.id)}catch(l){console.warn("[canary:sync] Failed to process event:",l)}}});return this.subs.set(t,a),()=>{a.close(),this.subs.delete(t)}}async requestRecovery(t,n,r){const o=ae();if(!o)return;const s=this.groupKeys.get(t);if(!s)return;this.recoveryPending.set(t,Date.now());const i=F(this.personalPrivkey);for(const a of s.admins)if(a!==this.personalPubkey)try{const c=JSON.stringify({groupTag:s.tagHash,epoch:n,counter:r}),l=Ee(i,a),u=Dt(c,l),d={kind:xt.signal,content:u,tags:[["p",a],["t","ssg:recovery-request"]],created_at:Math.floor(Date.now()/1e3)},f=it(d,i);await o.publish(this.writeRelays,f)}catch(c){console.warn("[canary:sync] Recovery request to",a.slice(0,8),"failed:",c)}}_ensureRecoverySub(){if(this.recoverySub)return;const t=ae();if(!t)return;const n={kinds:[xt.signal],"#p":[this.personalPubkey],"#t":["ssg:recovery-request","ssg:recovery-response"],since:Math.floor(Date.now()/1e3)-300};this.recoverySub=t.subscribeMany(this.allRelays,n,{onevent:async r=>{try{if(!r||typeof r!="object"||!at(r))return;const o=(r.tags||[]).filter(s=>s[0]==="t").map(s=>s[1]);o.includes("ssg:recovery-request")?await this._handleRecoveryRequest(r):o.includes("ssg:recovery-response")&&await this._handleRecoveryResponse(r)}catch(o){console.warn("[canary:sync] Recovery event processing failed:",o)}}})}async _handleRecoveryRequest(t){const n=ae();if(!n)return;const r=t.pubkey;if(!wr.test(r))return;const o=F(this.personalPrivkey),s=Ee(o,r),i=jt(t.content,s);let a;try{a=JSON.parse(i)}catch{return}const c=a.groupTag,l=a.epoch,u=a.counter;if(typeof c!="string"||typeof l!="number"||typeof u!="number")return;const d=this.tagHashToGroupId.get(c);if(!d)return;const f=this.groupKeys.get(d);if(!f)return;if(!f.members.has(r)){console.warn("[canary:sync] Recovery request from non-member",r.slice(0,8));return}if(!f.onRecoveryRequest)return;const p=f.onRecoveryRequest(r,l,u);if(!p)return;const h=Ls(p),m={...p,protocolVersion:se},y=Tn(m),g=we(Er.encode(y)),E=ze(te.sign(g,o)),C=JSON.stringify({s:this.personalPubkey,sig:E,groupTag:c,p:h}),$=Ee(o,r),L=Dt(C,$),O={kind:xt.signal,content:L,tags:[["p",r],["t","ssg:recovery-response"]],created_at:Math.floor(Date.now()/1e3)},w=it(O,o);await n.publish(this.writeRelays,w),console.info("[canary:sync] Sent recovery response to",r.slice(0,8))}async _handleRecoveryResponse(t){const n=t.pubkey;if(!wr.test(n))return;const r=F(this.personalPrivkey),o=Ee(r,n),s=jt(t.content,o);let i;try{i=JSON.parse(s)}catch{return}const a=i.s,c=i.sig,l=i.groupTag,u=i.p;if(typeof a!="string"||typeof c!="string"||typeof l!="string"||typeof u!="string"||!wr.test(a)||!za.test(c)||a!==n)return;const d=this.tagHashToGroupId.get(l);if(!d)return;const f=this.groupKeys.get(d);if(!f)return;if(!f.admins.has(n)){console.warn("[canary:sync] Recovery response from non-admin",n.slice(0,8));return}const p=$s(u),h={...p,protocolVersion:se},m=Tn(h),y=we(Er.encode(m));if(!te.verify(F(c),y,F(n))){console.warn("[canary:sync] Recovery response with invalid signature");return}if(p.type!=="state-snapshot"){console.warn("[canary:sync] Recovery response contains non-snapshot type:",p.type);return}if(!p.admins.includes(n)){console.warn("[canary:sync] Recovery response sender not in snapshot admins");return}this.decryptFailures.delete(d),this.recoveryPending.delete(d),f.onRecoveryResponse&&f.onRecoveryResponse(p,n),console.info("[canary:sync] Applied recovery response from",n.slice(0,8))}_trackDecryptFailure(t){const n=(this.decryptFailures.get(t)??0)+1;if(this.decryptFailures.set(t,n),n<Xb)return;const r=this.recoveryPending.get(t);if(r!==void 0&&Date.now()-r<Qb)return;this.recoveryPending.delete(t);const o=this.groupKeys.get(t);o&&o.admins.size>0&&o.onRecoveryResponse&&(console.warn(`[canary:sync] ${n} decrypt failures for group — requesting recovery`),this.requestRecovery(t,0,0).catch(s=>{console.warn("[canary:sync] Auto-recovery request failed:",s)}))}disconnect(){for(const[,t]of this.subs)t.close();this.subs.clear(),this.recoverySub&&(this.recoverySub.close(),this.recoverySub=null)}}function q(e,t="info",n=4e3){const r=document.getElementById("toast-container")??tv(),o=document.createElement("div");o.className=`toast toast--${t}`,o.textContent=e,r.appendChild(o),requestAnimationFrame(()=>o.classList.add("toast--visible")),setTimeout(()=>{o.classList.remove("toast--visible"),setTimeout(()=>o.remove(),300)},n)}function tv(){const e=document.createElement("div");return e.id="toast-container",e.className="toast-container",document.body.appendChild(e),e}const nv=Object.freeze(Object.defineProperty({__proto__:null,showToast:q},Symbol.toStringTag,{value:"Module"}));let jn=null;function rv(e=6e4){jn||(Ja(),jn=setInterval(Ja,e))}function td(){jn&&(clearInterval(jn),jn=null)}function Ja(){const{groups:e,identity:t}=_();if(!t)return;const n=Math.floor(Date.now()/1e3);for(const[r,o]of Object.entries(e)){ke(r,{type:"liveness-checkin",pubkey:t.pubkey,timestamp:n,opId:crypto.randomUUID()});const s={...o.livenessCheckins,[t.pubkey]:n};J(r,{livenessCheckins:s})}}const ov=60;function nd(e,t,n){const r=_().groups[e];if(!r)return;const o=Math.floor(Date.now()/1e3);if(n>o+ov)return;const s=r.livenessCheckins[t]??0;if(n<=s)return;const i={...r.livenessCheckins,[t]:n};J(e,{livenessCheckins:i})}const sv=Object.freeze(Object.defineProperty({__proto__:null,recordCheckin:nd,startLivenessHeartbeat:rv,stopLivenessHeartbeat:td},Symbol.toStringTag,{value:"Module"}));let me=null;const ro=new Map,iv=500,Os=new Map;function Ya(e,t){const n=Os.get(e);return n?n.includes(t):!1}function Za(e,t){let n=Os.get(e);n||(n=[],Os.set(e,n)),n.length>=iv&&n.shift(),n.push(t)}function av(e){me=e}async function Oe(e,t,n){const{identity:r}=_(),o=t??e;if(!(!r||!r.privkey||e.length===0&&o.length===0))try{Pi(e,o),me?me instanceof no&&me.updateRelays(e,o):av(new no(e,o,r.pubkey,r.privkey)),n&&od(n),n&&Mg(n).then(s=>{for(const i of s)ke(n,i)}),Oo().then(()=>Wn(Ft(),qt()))}catch(s){console.warn("[canary:sync] ensureTransport failed:",s),Wn(!1,0)}}function ke(e,t){!me||!_().groups[e]||me.send(e,t).catch(r=>{console.warn("[canary:sync] broadcast failed:",r)})}function gn(e){if(!(me instanceof no))return;const{identity:t,groups:n}=_(),r=n[e];if(!t?.privkey||!r?.seed)return;me.unregisterGroup(e);const o=new zu(r.seed,t.privkey);me.registerGroup(e,r.seed,o,r.members,rd(e))}function rd(e){return{admins:_().groups[e]?.admins??[],onRecoveryRequest:(t,n,r)=>{const{groups:o}=_(),s=o[e];return!s||!s.members.includes(t)?null:{type:"state-snapshot",seed:s.seed,counter:s.counter,usageOffset:s.usageOffset,members:s.members,admins:s.admins,epoch:s.epoch,opId:crypto.randomUUID(),timestamp:Math.floor(Date.now()/1e3)}},onRecoveryResponse:(t,n)=>{const{groups:r}=_(),o=r[e];if(!o)return;const s=Co(o,t,void 0,n);s!==o&&(J(e,s),gn(e),q("Group state recovered from admin","success"))}}}function cv(e,t,n,r=Math.floor(Date.now()/1e3),o=lv){if(t.type==="liveness-checkin"){if(!n)return;const s=r-t.timestamp;s<=Gn&&s>=-60&&(Ya(e,t.opId)||(Za(e,t.opId),nd(e,n,t.timestamp)));return}if(t.type==="beacon"||t.type==="duress-alert"||t.type==="duress-clear"){const s=r-t.timestamp;if(s>Gn||s<-60||Ya(e,t.opId))return;Za(e,t.opId),o(e,t,n)}}function lv(e,t,n){document.dispatchEvent(new CustomEvent("canary:sync-message",{detail:{groupId:e,message:t,sender:n}}))}function od(e){if(!me)return;if(ro.get(e)?.(),me instanceof no){const{identity:n,groups:r}=_(),o=r[e];if(n?.privkey&&o?.seed){const s=new zu(o.seed,n.privkey);me.registerGroup(e,o.seed,s,o.members,rd(e))}}const t=me.subscribe(e,(n,r)=>{const{groups:o}=_(),s=o[e];if(!s)return;const i=Co(s,n,void 0,r);if(i!==s&&J(e,i),(n.type==="member-join"||n.type==="member-leave"||n.type==="reseed"||n.type==="state-snapshot")&&gn(e),n.type==="member-join"&&i!==s){const a=n.pubkey?i.memberNames?.[n.pubkey]??r?.slice(0,8)??"Someone":"Someone";document.dispatchEvent(new CustomEvent("canary:member-joined",{detail:{groupId:e,pubkey:n.pubkey,name:a}}))}if(n.type==="member-join"&&i!==s){const a=n.pubkey?i.memberNames?.[n.pubkey]??r?.slice(0,8)??"Someone":"Someone";q(`${a} joined the group`,"success")}else n.type==="reseed"?q("Group secret was rotated","warning"):n.type==="state-snapshot"&&q("Group state recovered","success");cv(e,n,r),yv(),setTimeout(()=>Wn(Ft(),qt()),1500)});ro.set(e,t)}function uv(){const{groups:e}=_();for(const t of Object.keys(e))od(t)}function un(){td();for(const e of ro.values())e();ro.clear(),me?.disconnect(),me=null}var kr=new TextDecoder("utf-8");new TextEncoder;var sd=5e3;function id(e){let{prefix:t,words:n}=We.decode(e,sd),r=new Uint8Array(We.fromWords(n));switch(t){case"nprofile":{let o=as(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for nprofile");if(o[0][0].length!==32)throw new Error("TLV 0 should be 32 bytes");return{type:"nprofile",data:{pubkey:H(o[0][0]),relays:o[1]?o[1].map(s=>kr.decode(s)):[]}}}case"nevent":{let o=as(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for nevent");if(o[0][0].length!==32)throw new Error("TLV 0 should be 32 bytes");if(o[2]&&o[2][0].length!==32)throw new Error("TLV 2 should be 32 bytes");if(o[3]&&o[3][0].length!==4)throw new Error("TLV 3 should be 4 bytes");return{type:"nevent",data:{id:H(o[0][0]),relays:o[1]?o[1].map(s=>kr.decode(s)):[],author:o[2]?.[0]?H(o[2][0]):void 0,kind:o[3]?.[0]?parseInt(H(o[3][0]),16):void 0}}}case"naddr":{let o=as(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for naddr");if(!o[2]?.[0])throw new Error("missing TLV 2 for naddr");if(o[2][0].length!==32)throw new Error("TLV 2 should be 32 bytes");if(!o[3]?.[0])throw new Error("missing TLV 3 for naddr");if(o[3][0].length!==4)throw new Error("TLV 3 should be 4 bytes");return{type:"naddr",data:{identifier:kr.decode(o[0][0]),pubkey:H(o[2][0]),kind:parseInt(H(o[3][0]),16),relays:o[1]?o[1].map(s=>kr.decode(s)):[]}}}case"nsec":return{type:t,data:r};case"npub":case"note":return{type:t,data:H(r)};default:throw new Error(`unknown prefix ${t}`)}}function as(e){let t={},n=e;for(;n.length>0;){let r=n[0],o=n[1],s=n.slice(2,2+o);if(n=n.slice(2+o),s.length<o)throw new Error(`not enough data to read on TLV ${r}`);t[r]=t[r]||[],t[r].push(s)}return t}function dv(e){return pv("nsec",e)}function fv(e,t){let n=We.toWords(t);return We.encode(e,n,sd)}function pv(e,t){return fv(e,t)}function j(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ad(){return document.documentElement.getAttribute("data-theme")==="light"?"light":"dark"}function hv(e){e==="light"?document.documentElement.setAttribute("data-theme","light"):document.documentElement.removeAttribute("data-theme")}function cd(e){const t=ad();e.setAttribute("aria-label",t==="dark"?"Switch to light mode":"Switch to dark mode"),e.textContent="◐"}function mv(e){const t=ad()==="dark"?"light":"dark";hv(t),X({settings:{..._().settings,theme:t}}),cd(e)}function ji(e){const t=_().view;e.innerHTML=`
    <button class="header__hamburger" id="hamburger" aria-label="Toggle menu">&#9776;</button>
    <div class="header__brand">CANARY <span class="header__version">v1.1.0</span></div>
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
  `;const n=e.querySelector("#theme-toggle");n&&(cd(n),n.addEventListener("click",()=>mv(n)));const r=e.querySelector("#reset-btn");r&&r.addEventListener("click",()=>{confirm("Clear all data and reset the demo?")&&(localStorage.clear(),window.location.reload())}),qi();const o=e.querySelector("#identity-btn");o?.addEventListener("click",()=>vv(o)),Ft()&&Wn(!0,qt()),document.addEventListener("canary:vault-synced",()=>{const i=document.getElementById("vault-sync-status");i&&(i.hidden=!1,i.textContent="☁",setTimeout(()=>{i.hidden=!0},3e3))}),e.querySelector("#header-nav")?.addEventListener("click",i=>{const a=i.target.closest("[data-view]");if(!a)return;const c=a.dataset.view;if(c){if(c==="groups"&&window.innerWidth<=768){const l=document.getElementById("sidebar"),u=document.getElementById("sidebar-overlay");if(l&&u){const d=l.classList.contains("sidebar--open");l.classList.toggle("sidebar--open",!d),u.classList.toggle("sidebar-overlay--visible",!d)}}c!==_().view&&X({view:c})}})}function Wn(e,t){const n=document.getElementById("relay-status");if(!n)return;const r=n.querySelector(".relay-dot"),o=n.querySelector(".relay-label");!e||t===0?(n.removeAttribute("hidden"),r?.setAttribute("class","relay-dot relay-dot--offline"),o&&(o.textContent="Offline"),n.title="Not connected to any relay"):(n.removeAttribute("hidden"),r?.setAttribute("class","relay-dot relay-dot--synced"),o&&(o.textContent=`Synced · ${t} relay${t===1?"":"s"}`),n.title=`Connected to ${t} relay${t===1?"":"s"}`)}function yv(){const e=document.getElementById("relay-status");if(!e)return;const t=e.querySelector(".relay-dot"),n=e.querySelector(".relay-label");e.removeAttribute("hidden"),t?.setAttribute("class","relay-dot relay-dot--syncing"),n&&(n.textContent="Syncing...")}function qi(){const e=document.getElementById("identity-dot"),t=document.getElementById("identity-label"),n=document.getElementById("identity-avatar");if(!e||!t)return;const{identity:r}=_();if(!r?.pubkey){t.textContent="No identity",e.className="header__identity-dot header__identity-dot--none",n&&(n.hidden=!0);return}const o=`${r.pubkey.slice(0,6)}…${r.pubkey.slice(-4)}`,s=r.displayName&&r.displayName!=="You"?r.displayName:o;t.textContent=s,n&&r.picture?(n.src=r.picture,n.hidden=!1,e.hidden=!0):(n&&(n.hidden=!0),e.hidden=!1,e.className=r.signerType==="nip07"?"header__identity-dot header__identity-dot--extension":"header__identity-dot header__identity-dot--local")}function gv(e){return Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}function ld(e,t){return t?.pubkey===e.pubkey&&t.mnemonic?{...e,mnemonic:t.mnemonic}:e}function bv(e,t){try{const n=_().identity,r=id(e.trim());if(r.type!=="nsec")return alert('Not a valid nsec. Expected a bech32-encoded private key starting with "nsec1".'),!1;const o=r.data,s=gv(o),i=No(o),a=ld({pubkey:i,privkey:s,signerType:"local",displayName:t??"You"},n);return un(),X({identity:a,groups:{},activeGroupId:null}),qi(),document.dispatchEvent(new CustomEvent("canary:resync")),!0}catch{return alert("Invalid nsec format."),!1}}function vv(e){document.getElementById("identity-popover")?.remove();const{identity:t}=_(),n=t?.pubkey??"",r=n?`${n.slice(0,8)}…${n.slice(-8)}`:"None",o=t?.signerType==="nip07"?"Extension (NIP-07)":"Local key",s=document.createElement("div");s.id="identity-popover",s.className="identity-popover",s.innerHTML=`
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
  `,e.parentElement?.appendChild(s),s.querySelector("#identity-logout-btn")?.addEventListener("click",()=>{un(),X({identity:null,groups:{},activeGroupId:null}),s.remove(),window.location.reload()}),s.querySelector("#recovery-reveal-btn")?.addEventListener("click",()=>{const a=s.querySelector("#recovery-reveal-area");if(!a)return;const c=_().identity?.mnemonic;if(!c){a.textContent="";const f=document.createElement("p");f.style.cssText="font-size:0.75rem;color:var(--text-muted);",f.textContent="No recovery phrase stored (key was imported via nsec).",a.appendChild(f);return}const l=c.split(" ");a.textContent="";const u=document.createElement("div");u.style.cssText="display:grid;grid-template-columns:repeat(3,1fr);gap:0.375rem;margin:0.375rem 0;",l.forEach((f,p)=>{const h=document.createElement("div");h.style.cssText="border:1px solid var(--border);border-radius:3px;padding:0.25rem;text-align:center;font-family:var(--font-mono,monospace);font-size:0.7rem;";const m=document.createElement("span");m.style.color="var(--text-muted)",m.textContent=`${p+1}. `;const y=document.createElement("span");y.textContent=f,h.append(m,y),u.appendChild(h)}),a.appendChild(u);const d=document.createElement("button");d.className="btn btn--sm",d.type="button",d.style.cssText="width:100%;margin-top:0.375rem;",d.textContent="Copy words",d.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(c),d.textContent="Copied!",setTimeout(()=>{d.textContent="Copy words"},2e3),setTimeout(()=>{navigator.clipboard.writeText("").catch(()=>{})},3e4)}catch{}}),a.appendChild(d)}),s.querySelector("#nsec-reveal-btn")?.addEventListener("click",()=>{const a=s.querySelector("#nsec-reveal-area");if(!a||!t?.privkey)return;const c=dv(F(t.privkey));a.innerHTML=`
      <code style="font-size: 0.65rem; word-break: break-all; display: block; background: var(--bg); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border); user-select: all;">${j(c)}</code>
      <button class="btn btn--sm" id="nsec-copy-btn" type="button" style="width: 100%; margin-top: 0.375rem;">Copy nsec</button>
    `,a.querySelector("#nsec-copy-btn")?.addEventListener("click",async l=>{const u=l.currentTarget;try{await navigator.clipboard.writeText(c),u.textContent="Copied!",setTimeout(()=>{u.textContent="Copy nsec"},2e3),setTimeout(()=>{navigator.clipboard.writeText("").catch(()=>{})},3e4)}catch{}})}),s.querySelector("#nsec-login-form")?.addEventListener("submit",a=>{a.preventDefault();const c=s.querySelector("#nsec-input");c?.value.trim()&&bv(c.value)&&s.remove()}),s.querySelector("#nip07-connect-btn")?.addEventListener("click",async()=>{if(!Ju()){alert("No Nostr extension found. Install Alby, nos2x, or another NIP-07 extension and reload.");return}try{un();const a=await window.nostr.getPublicKey(),c=ld({pubkey:a,signerType:"nip07",displayName:t?.displayName??"You"},t);X({identity:c,groups:{},activeGroupId:null}),qi(),document.dispatchEvent(new CustomEvent("canary:resync")),s.remove()}catch{alert("Extension rejected the request.")}});const i=a=>{!s.contains(a.target)&&a.target!==e&&(s.remove(),document.removeEventListener("click",i))};requestAnimationFrame(()=>document.addEventListener("click",i))}function Xa(e){const t=Math.floor(e/86400);if(t>=1)return`${t}d`;const n=Math.floor(e/3600);return n>=1?`${n}h`:`${Math.floor(e/60)}m`}function wv(e){if(!e)return"";const t=e.displayName??`${e.pubkey.slice(0,8)}…`;return`
    <div class="identity-badge">
      <span class="identity-badge__name">${j(t)}</span>
    </div>
  `}function Ev(e,t){const n=Object.values(e);return n.length===0?'<div class="group-list__empty">No groups yet</div>':n.map(r=>{const o=r.id===t,s=o?" group-list__item--active":"",i=Xa(r.livenessInterval),a=Xa(r.livenessInterval);return`
        <button
          class="group-list__item${s}"
          data-group-id="${j(r.id)}"
          aria-current="${o?"true":"false"}"
        >
          <span class="group-list__name">${j(r.name)}</span>
          <span class="group-list__preset">${j(i)} · ${j(a)}</span>
        </button>
      `}).join("")}function kv(e){const{identity:t,groups:n,activeGroupId:r}=_();e.innerHTML=`
    <div class="sidebar__tagline">spoken-word verification</div>
    ${wv(t)}
    <nav class="group-list" aria-label="Groups">
      ${Ev(n,r)}
    </nav>
    <button class="btn btn--primary" id="create-group-btn">+ New Group</button>
    <button class="btn btn--sm sidebar__sync-btn" id="sync-groups-btn" title="Sync groups from other devices">Sync Groups</button>
  `,e.querySelector(".group-list")?.addEventListener("click",a=>{const c=a.target.closest("[data-group-id]");if(!c)return;const l=c.dataset.groupId;l&&X({activeGroupId:l})}),e.querySelector("#create-group-btn")?.addEventListener("click",()=>{e.dispatchEvent(new CustomEvent("canary:create-group",{bubbles:!0}))}),e.querySelector("#sync-groups-btn")?.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("canary:sync-vault"))})}const Ms="app-modal";function Hi(e,t){let n=document.getElementById(Ms);if(n||(n=document.createElement("dialog"),n.id=Ms,n.className="modal",document.body.appendChild(n)),n.innerHTML=`
    <form class="modal__form" method="dialog" id="modal-form">
      ${e}
    </form>
  `,t){const r=n.querySelector("#modal-form");r?.addEventListener("submit",o=>{o.preventDefault();const s=new FormData(r);t(s),Qa()})}n.addEventListener("click",r=>{r.target===n&&Qa()}),n.showModal()}function Qa(){document.getElementById(Ms)?.close()}const ud=/^[0-9a-f]{64}$/,_v=/^[0-9b-hjkmnp-z]+$/,xv=new TextEncoder().encode("canary:beacon:key"),Sv=new TextEncoder().encode("canary:duress:key");function dd(e){if(!ud.test(e))throw new Error("seedHex must be a 64-character lowercase hex string (32 bytes)")}function Iv(e){if(e.length!==32)throw new Error("AES-256-GCM requires a 32-byte key")}function fd(e){return dd(e),Le(F(e),xv)}function Rv(e){return dd(e),Le(F(e),Sv)}async function pd(e,t){Iv(e);const n=crypto.getRandomValues(new Uint8Array(12)),r=await crypto.subtle.importKey("raw",e,{name:"AES-GCM"},!1,["encrypt"]),o=new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM",iv:n},r,t)),s=new Uint8Array(12+o.length);return s.set(n),s.set(o,12),Cu(s)}async function hd(e,t,n){if(typeof t!="string"||t.length===0||t.length>11)throw new Error("geohash must be a non-empty string of at most 11 characters");if(!_v.test(t))throw new Error("geohash contains invalid characters (valid: 0-9, b-h, j-k, m-n, p-z)");if(!Number.isInteger(n)||n<1||n>11)throw new Error("precision must be an integer between 1 and 11");const r={geohash:t,precision:n,timestamp:Math.floor(Date.now()/1e3)};return pd(e,new TextEncoder().encode(JSON.stringify(r)))}function Av(e,t){if(!ud.test(e))throw new Error(`Invalid member pubkey: expected 64 lowercase hex characters, got ${e.length} chars`);return{type:"duress",member:e,geohash:"",precision:0,locationSource:"none",timestamp:Math.floor(Date.now()/1e3)}}async function Cv(e,t){return pd(e,new TextEncoder().encode(JSON.stringify(t)))}function md(){const{identity:e}=_();if(!e?.pubkey)throw new Error("No local identity — cannot perform privileged action.");return e.pubkey}function Mo(e){const t=md();if(!e.admins.includes(t))throw new Error(`Not authorised — you are not an admin of "${e.name}".`)}function Tv(e){const t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function Nv(e,t,n){const r=crypto.randomUUID(),s=mb({name:e,members:n?[n]:[],preset:t,creator:n}),i=_().settings,a=[...i.defaultReadRelays??i.defaultRelays],c=[...i.defaultWriteRelays??i.defaultRelays],l={family:"words","field-ops":"words",enterprise:"words",event:"pin"},u={...s,id:r,nostrEnabled:c.length>0||a.length>0,relays:c,readRelays:a,writeRelays:c,encodingFormat:l[t]??"words",usedInvites:[],latestInviteIssuedAt:0,livenessInterval:s.rotationInterval,livenessCheckins:{},tolerance:1,memberNames:{},duressMode:"immediate"},{groups:d}=_();return X({groups:{...d,[r]:u},activeGroupId:r}),n&&ke(r,{type:"member-join",pubkey:n,timestamp:Math.floor(Date.now()/1e3),epoch:0,opId:crypto.randomUUID()}),r}function Lv(e){const{groups:t,activeGroupId:n}=_(),r={...t};delete r[e],X({groups:r,activeGroupId:n===e?null:n})}function $v(e){const{groups:t}=_(),n=t[e];if(!n){console.warn(`[canary:actions] reseedGroup: unknown group id "${e}"`);return}Mo(n);const r=Mi(n),o=(n.epoch??0)+1,s=crypto.randomUUID(),i=[...n.admins??[]];ke(e,{type:"reseed",seed:Tv(r.seed),counter:r.counter,timestamp:Math.floor(Date.now()/1e3),epoch:o,opId:s,admins:i,members:[...n.members]}),J(e,{...r,epoch:o,consumedOps:[s],admins:i}),gn(e)}function Ov(e){const{groups:t}=_(),n=t[e];if(!n){console.warn(`[canary:actions] compromiseReseed: unknown group id "${e}"`);return}Mo(n);const r=Mi(n),o=(n.epoch??0)+1;J(e,{...r,epoch:o,consumedOps:[],admins:[...n.admins??[]]}),gn(e)}function Bs(e,t,n){const{groups:r}=_(),o=r[e];if(!o){console.warn(`[canary:actions] addGroupMember: unknown group id "${e}"`);return}Mo(o);const s=crypto.randomUUID(),i=Du(o,t);J(e,{...i,consumedOps:[...o.consumedOps??[],s]}),gn(e),ke(e,{type:"member-join",pubkey:t,displayName:n||void 0,timestamp:Math.floor(Date.now()/1e3),epoch:o.epoch??0,opId:s})}function Mv(e,t){const{groups:n}=_(),r=n[e];if(!r){console.warn(`[canary:actions] removeGroupMember: unknown group id "${e}"`);return}const o=md();if(t!==o&&Mo(r),!r.members.includes(t))return;const s=ju(r,t),i=Mi(s),a=(r.epoch??0)+1,c={...r.memberNames??{}};delete c[t];const l={...r.livenessCheckins??{}};delete l[t];const u=(r.admins??[]).filter(d=>d!==t);J(e,{...i,memberNames:c,livenessCheckins:l,admins:u,epoch:a,consumedOps:[]}),gn(e)}function Bv(e){const{groups:t}=_(),n=t[e];if(!n){console.warn(`[canary:actions] burnWord: unknown group id "${e}"`);return}const r=yb(n);J(e,r),ke(e,{type:"counter-advance",counter:r.counter,usageOffset:r.usageOffset,timestamp:Math.floor(Date.now()/1e3)})}const cs=/^[0-9a-f]{64}$/;function Pv(e){if(!e||typeof e!="object")throw new Error("Import failed — expected a JSON object.");const t=e;if(typeof t.name!="string"||t.name.trim().length===0)throw new Error("Import failed — name is required.");if(typeof t.seed!="string"||!cs.test(t.seed))throw new Error("Import failed — seed must be a 64-character lowercase hex string.");if(!Array.isArray(t.members)||t.members.length===0)throw new Error("Import failed — members must be a non-empty array.");for(const n of t.members)if(typeof n!="string"||!cs.test(n))throw new Error(`Import failed — invalid member pubkey: "${String(n)}".`);if(Array.isArray(t.admins)){for(const r of t.admins)if(typeof r!="string"||!cs.test(r))throw new Error(`Import failed — invalid admin pubkey: "${String(r)}".`);const n=new Set(t.members);for(const r of t.admins)if(!n.has(r))throw new Error(`Import failed — admin "${r}" is not in the members list.`)}if(t.rotationInterval!==void 0&&(typeof t.rotationInterval!="number"||!Number.isInteger(t.rotationInterval)||t.rotationInterval<=0))throw new Error("Import failed — rotationInterval must be a positive integer.");if(t.wordCount!==void 0&&t.wordCount!==1&&t.wordCount!==2&&t.wordCount!==3)throw new Error("Import failed — wordCount must be 1, 2, or 3.");if(t.encodingFormat!==void 0&&t.encodingFormat!=="words"&&t.encodingFormat!=="pin"&&t.encodingFormat!=="hex")throw new Error("Import failed — encodingFormat must be words, pin, or hex.");if(t.epoch!==void 0&&(typeof t.epoch!="number"||!Number.isInteger(t.epoch)||t.epoch<0))throw new Error("Import failed — epoch must be a non-negative integer.");if(t.consumedOps!==void 0&&(!Array.isArray(t.consumedOps)||!t.consumedOps.every(n=>typeof n=="string")))throw new Error("Import failed — consumedOps must be an array of strings.")}function Uv(e){const{groups:t}=_();if(Object.keys(t).length>0){e.hidden=!0;return}e.hidden=!1,e.innerHTML=`
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
  `,document.getElementById("welcome-create").addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("canary:create-group"))}),document.getElementById("welcome-join").addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("canary:join-group"))})}const Lt="canary:group";function Bt(e){switch(e.encodingFormat){case"pin":return{format:"pin",digits:6};case"hex":return{format:"hex",length:8};default:return{format:"words",count:e.wordCount}}}function Ps(e,t){return t==="pin"&&e.length===6?`${e.slice(0,3)}-${e.slice(3)}`:t==="hex"&&e.length===8?`${e.slice(0,4)}-${e.slice(4)}`:e}function Dv(e,t){const{identity:n}=_();if(n?.pubkey===e)return"You";const r=t.memberNames?.[e];return r||e.slice(0,8)+"…"}let Lr=null;function ls(){Lr!==null&&(clearInterval(Lr),Lr=null)}function jv(e=new Date){return e.toISOString().slice(11,19)+" UTC"}function qv(e){return e.replace(/[a-zA-Z0-9]/g,"•")}const ec="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789•·∘◦○●◈◆▪▫";function Hv(e,t,n=600){const r=t.length,o=30,s=Math.ceil(n/o),i=l=>Math.floor(l/r*s*.7)+Math.floor(s*.3);let a=0;const c=setInterval(()=>{a++;let l="";for(let u=0;u<r;u++)a>=i(u)?l+=t[u]:l+=ec[Math.floor(Math.random()*ec.length)];e.textContent=l,a>=s&&(clearInterval(c),e.textContent=t)},o)}function tc(e){if(e<=0)return"0s";const t=Math.floor(e/86400),n=Math.floor(e%86400/3600),r=Math.floor(e%3600/60),o=Math.floor(e%60);return t>=1?n>0?`${t}d ${n}h`:`${t}d`:n>=1?r>0?`${n}h ${r}m`:`${n}h`:r>=1?o>0?`${r}m ${o}s`:`${r}m`:`${o}s`}function nc(e){const t=Math.floor(Date.now()/1e3),r=(wt(t,e.rotationInterval)+1)*e.rotationInterval;return Math.max(0,r-t)}const Fv=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],Gv=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function rc(e,t){if(t>=86400){const n=new Date(Date.now()+e*1e3),r=Fv[n.getUTCDay()],o=n.getUTCDate(),s=Gv[n.getUTCMonth()],i=String(n.getUTCHours()).padStart(2,"0"),a=String(n.getUTCMinutes()).padStart(2,"0");return`rotates ${r} ${o} ${s} at ${i}:${a} UTC (${tc(e)})`}return`rotates in ${tc(e)} · ${jv()}`}function Vv(e){const{identity:t}=_(),n=e.counter+e.usageOffset;return rt(e.seed,Lt,n,Bt(e),t?.pubkey)}function Kv(e){const{identity:t}=_();if(!t?.pubkey)return null;const n=e.counter+e.usageOffset;return Ao(e.seed,Lt,t.pubkey,n,Bt(e),e.tolerance)}function yd(e){ls();const{groups:t,activeGroupId:n}=_();if(!n){e.innerHTML="";return}const r=t[n];if(!r){e.innerHTML="";return}const o=gb(r);if(o!==r){J(n,o);return}const s=Vv(r),i=Ps(s,r.encodingFormat),a=Kv(r),c=a?Ps(a,r.encodingFormat):null,l=qv(i),u=nc(r),d=Math.min(100,Math.max(0,(r.rotationInterval-u)/r.rotationInterval*100));e.innerHTML=`
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
          <div class="hero__progress-bar" id="hero-progress-bar" style="width: ${d}%"></div>
        </div>
        <span class="hero__countdown-label" id="hero-countdown-label">${rc(u,r.rotationInterval)}</span>
      </div>

      <p class="hero__hint">Press and hold to reveal. Tap the right side for your alternate word.</p>

      <button class="btn btn--ghost" id="burn-btn" type="button" title="Rotate to a new word now. All group members will get a new word too.">I used this word</button>
      <button class="btn btn--outline" id="hero-invite-btn" type="button" title="Share group access with someone new">Invite Someone</button>
      ${r.members.length>=2?'<button class="btn btn--outline" id="hero-call-btn" type="button" title="Start a phone call verification">Verify Call</button>':""}

    </section>
  `;const f=e.querySelector("#hero-word"),p=e.querySelector("#hero-reveal-btn");function h(L){f&&(f.textContent=L&&c?c:i,f.classList.remove("hero__word--masked"),f.classList.add("hero__word--revealed"))}function m(){f&&(f.textContent=l,f.classList.remove("hero__word--revealed"),f.classList.add("hero__word--masked"))}p&&(p.addEventListener("pointerdown",L=>{L.preventDefault();const O=p.getBoundingClientRect(),v=L.clientX-O.left>O.width/2;h(v)}),p.addEventListener("pointerup",m),p.addEventListener("pointerleave",m),p.addEventListener("pointercancel",m)),e.querySelector("#burn-btn")?.addEventListener("click",()=>{try{Bv(n);const L=Zn(_().groups[n]??r)==="online";q(L?"Word rotated — syncing to group":"Word rotated","success",2e3),document.dispatchEvent(new CustomEvent("canary:vault-publish-now")),requestAnimationFrame(()=>{const O=document.getElementById("hero-word");if(O){const w=O.textContent??"••••••••";Hv(O,w)}})}catch(L){q(L instanceof Error?L.message:"Failed to rotate word","error")}}),e.querySelector("#hero-invite-btn")?.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("canary:show-invite",{detail:{groupId:n}}))}),e.querySelector("#hero-call-btn")?.addEventListener("click",()=>{const{identity:L}=_(),O=r.members.filter(b=>b!==L?.pubkey);if(O.length===0)return;if(O.length===1){document.dispatchEvent(new CustomEvent("canary:verify-call",{detail:{groupId:n,pubkey:O[0]}}));return}const w=O.map(b=>`
      <button class="btn btn--outline member-pick-btn" data-pubkey="${j(b)}" type="button" style="width:100%;text-align:left;margin-bottom:0.5rem;">
        ${j(Dv(b,r))}
      </button>
    `).join("");let v=document.getElementById("member-picker");v||(v=document.createElement("dialog"),v.id="member-picker",v.className="modal",document.body.appendChild(v)),v.innerHTML=`
      <div class="modal__form" style="min-width:240px;">
        <h2 class="modal__title">Who are you calling?</h2>
        ${w}
        <div class="modal__actions">
          <button class="btn" id="picker-cancel" type="button">Cancel</button>
        </div>
      </div>
    `,v.querySelector("#picker-cancel")?.addEventListener("click",()=>v.close()),v.addEventListener("click",b=>{b.target===v&&v.close()}),v.querySelectorAll(".member-pick-btn").forEach(b=>{b.addEventListener("click",()=>{const x=b.dataset.pubkey;v.close(),x&&document.dispatchEvent(new CustomEvent("canary:verify-call",{detail:{groupId:n,pubkey:x}}))})}),v.showModal()});const C=e.querySelector("#hero-progress-bar"),$=e.querySelector("#hero-countdown-label");Lr=setInterval(()=>{const{groups:L}=_(),O=L[n];if(!O){ls();return}const w=nc(O),v=Math.min(100,Math.max(0,(O.rotationInterval-w)/O.rotationInterval*100));C&&(C.style.width=`${v}%`),$&&($.textContent=rc(w,O.rotationInterval)),w===0&&(ls(),yd(e))},1e3)}const Fi="canary:duress-dismissed";function Gi(){try{const e=localStorage.getItem(Fi);return e?new Set(JSON.parse(e)):new Set}catch{return new Set}}function oc(e){const t=Gi();t.add(e),localStorage.setItem(Fi,JSON.stringify([...t]))}function Wv(e){const t=Gi();t.delete(e),localStorage.setItem(Fi,JSON.stringify([...t]))}function oo(e,t){const n=_().groups[t];if(!n)return e.slice(0,8);const{identity:r}=_();if(r?.pubkey===e)return"You";const o=n.memberNames?.[e];return o||`${e.slice(0,8)}…${e.slice(-4)}`}function zv(e){const n=Math.floor(Date.now()/1e3)-e;if(n<30)return"just now";if(n<60)return`${n}s ago`;const r=Math.floor(n/60);return r<60?`${r} min ago`:new Date(e*1e3).toLocaleTimeString()}function gd(e,t,n,r,o){if(!o&&Gi().has(e))return;const s=document.querySelector(".duress-overlay");s&&s.remove();const i=oo(e,t),a=r?zv(r):new Date().toLocaleTimeString(),c=document.createElement("div");c.className="duress-overlay",c.dataset.subject=e,c.dataset.groupId=t,c.setAttribute("role","alertdialog"),c.setAttribute("aria-label",`${i} needs help`);const l=document.createElement("div");l.className="duress-overlay__content";const u=document.createElement("div");u.className="duress-overlay__icon",u.setAttribute("aria-hidden","true"),u.textContent="!",l.appendChild(u);const d=document.createElement("h1");d.className="duress-overlay__title",d.textContent=i,l.appendChild(d);const f=document.createElement("h2");if(f.className="duress-overlay__subtitle",f.textContent="NEEDS HELP",l.appendChild(f),n&&(n.lat!==0||n.lon!==0)){const g=document.createElement("p");g.className="duress-overlay__location",g.textContent=`Last known: ${n.lat.toFixed(4)}, ${n.lon.toFixed(4)}`,l.appendChild(g)}const p=document.createElement("p");p.className="duress-overlay__time",p.textContent=a,l.appendChild(p);const h=document.createElement("button");h.className="btn btn--lg duress-overlay__dismiss",h.textContent="I'm Responding",h.title="Dismiss this alert on your screen only — does not clear the duress for others",h.addEventListener("click",()=>{oc(e),c.classList.remove("duress-overlay--visible"),setTimeout(()=>c.remove(),300)}),l.appendChild(h);const m=document.createElement("button");m.className="btn btn--lg duress-overlay__stand-down",m.textContent="Stand Down — Person is Safe",m.title="Broadcast to all group members that this person has been confirmed safe",m.addEventListener("click",()=>{oc(e),ke(t,{type:"duress-clear",subject:e,timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID()}),c.classList.remove("duress-overlay--visible"),setTimeout(()=>c.remove(),300);const{identity:g}=_(),E=g?.pubkey===e?"Self":oo(g?.pubkey??"",t);q(`Duress stood down for ${i} by ${E}`,"success")}),l.appendChild(m),c.appendChild(l),document.body.appendChild(c),requestAnimationFrame(()=>c.classList.add("duress-overlay--visible"));function y(g){g.key==="Escape"&&(c.classList.remove("duress-overlay--visible"),setTimeout(()=>c.remove(),300),document.removeEventListener("keydown",y))}document.addEventListener("keydown",y)}document.addEventListener("canary:duress-clear",(e=>{const{subject:t,clearedBy:n}=e.detail;Wv(t);const r=Array.from(document.querySelectorAll(".duress-overlay")).find(c=>c.dataset.subject===t);r&&(r.classList.remove("duress-overlay--visible"),setTimeout(()=>r.remove(),300));const o=e.detail.groupId,s=oo(t,o),i=oo(n,o);q(t===n?`${s} self-cleared their duress`:`${i} confirmed ${s} is safe`,"success")}));function bd(e){const t=new Uint32Array(1);return crypto.getRandomValues(t),t[0]%e}function us(e){const{groups:t,activeGroupId:n,identity:r}=_();if(r?.pubkey===e)return"You";if(!n)return e.slice(0,8)+"…";const o=t[n];if(!o)return e.slice(0,8)+"…";const s=o.memberNames?.[e];return s||e.slice(0,8)+"…"}function Jv(e,t){const n=[],r=new Set(t);for(;n.length<e;){const o=bd(Ts),s=Nr(o).toLowerCase();r.has(s)||(r.add(s),n.push(s))}return n}function Yv(e){for(let t=e.length-1;t>0;t--){const n=bd(t+1);[e[t],e[n]]=[e[n],e[t]]}return e}function sc(e,t){for(const s of e)gd(s,t,void 0,Math.floor(Date.now()/1e3),!0);document.dispatchEvent(new CustomEvent("canary:duress",{detail:{members:e},bubbles:!0}));const{groups:n}=_(),r=n[t];if(!r)return;const o=Rv(r.seed);for(const s of e){const i=Av(s);Cv(o,i),ke(t,{type:"duress-alert",lat:0,lon:0,timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID(),subject:s})}}function Zv(e){const{groups:t,activeGroupId:n}=_();if(!n){e.innerHTML="";return}const r=t[n];if(!r){e.innerHTML="";return}const{identity:o}=_(),s=r.members.filter(E=>E!==o?.pubkey);if(s.length===0){e.innerHTML=`
      <section class="panel verify-panel">
        <h2 class="panel__title">Verify Someone</h2>
        <p class="settings-hint">No other members to verify yet. Invite someone first.</p>
      </section>
    `;return}const i=s.map(E=>`<button class="verify-member-btn btn btn--outline" data-pubkey="${j(E)}" type="button">${j(us(E))}</button>`).join("");e.innerHTML=`
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
  `;const a=e.querySelector("#verify-member-list"),c=e.querySelector("#verify-choices-area"),l=e.querySelector("#verify-choices"),u=e.querySelector("#verify-prompt"),d=e.querySelector("#verify-result"),f=e.querySelector("#verify-back");function p(E){const{groups:C,activeGroupId:$}=_();if(!$)return;const L=C[$];if(!L)return;const O=Math.floor(Date.now()/1e3),w=wt(O,L.rotationInterval)+L.usageOffset,v=Bt(L),b=rt(L.seed,Lt,w,v,E).toLowerCase(),x=Ao(L.seed,Lt,E,w,v,L.tolerance)?.toLowerCase(),S=new Set([b]);x&&S.add(x);const k=Jv(x?2:3,S),R=Yv([b,...x?[x]:[],...k]),I=us(E);u.textContent=`Tap the word ${I} just said:`,d.hidden=!0,l.innerHTML=R.map(N=>`<button class="verify-choice" data-word="${j(N)}" type="button">${j(Ps(N,L.encodingFormat))}</button>`).join(""),a.hidden=!0,c.hidden=!1,l.querySelectorAll(".verify-choice").forEach(N=>{N.addEventListener("click",()=>h(N.dataset.word??"",N,E))})}function h(E,C,$){const{groups:L,activeGroupId:O}=_();if(!O)return;const w=L[O];if(!w)return;const v=wt(Math.floor(Date.now()/1e3),w.rotationInterval)+w.usageOffset,b=Ha(w.seed,Lt,v,E,w.members,{encoding:Bt(w),tolerance:w.tolerance}),x=b.status==="valid",S=us($);l.querySelectorAll(".verify-choice").forEach(A=>A.classList.remove("verify-choice--correct","verify-choice--wrong")),C.classList.add(x?"verify-choice--correct":"verify-choice--wrong"),d.hidden=!1,d.className=`verify-result verify-result--${x?"valid":"invalid"}`,d.textContent=x?`${S} is verified.`:`${S} gave the wrong word.`,f.hidden=!1,b.status==="duress"&&sc(b.identities??[],O)}e.querySelectorAll(".verify-member-btn").forEach(E=>{E.addEventListener("click",()=>{const C=E.dataset.pubkey;C&&p(C)})}),f.addEventListener("click",()=>{a.hidden=!1,c.hidden=!0,d.hidden=!0,f.hidden=!0});const m=e.querySelector("#verify-input"),y=e.querySelector("#verify-btn");function g(){const E=m?.value.trim().toLowerCase().replace(/-/g,"")??"";if(!E)return;const{groups:C,activeGroupId:$}=_();if(!$)return;const L=C[$];if(!L)return;const O=wt(Math.floor(Date.now()/1e3),L.rotationInterval)+L.usageOffset,w=Ha(L.seed,Lt,O,E,L.members,{encoding:Bt(L),tolerance:L.tolerance}),v=w.status==="valid";d.hidden=!1,d.className=`verify-result verify-result--${v?"valid":"invalid"}`,d.textContent=v?"Verified.":"Wrong word.",f.hidden=!1,w.status==="duress"&&sc(w.identities??[],$)}y?.addEventListener("click",g),m?.addEventListener("keydown",E=>{E.key==="Enter"&&g()})}function vd(e){const t=JSON.stringify(e),n=new TextEncoder().encode(t);let r="";for(let o=0;o<n.length;o++)r+=String.fromCharCode(n[o]);return btoa(r)}function Bo(e){const t=atob(e),n=new Uint8Array(t.length);for(let r=0;r<t.length;r++)n[r]=t.charCodeAt(r);return JSON.parse(new TextDecoder().decode(n))}function Xv(e){return vd(e).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function wd(e){let t=e.replace(/-/g,"+").replace(/_/g,"/");const n=t.length%4;return n===2?t+="==":n===3&&(t+="="),Bo(t)}function Qv(e){let t="";for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function ew(e){let t=e.replace(/-/g,"+").replace(/_/g,"/");const n=t.length%4;n===2?t+="==":n===3&&(t+="=");const r=atob(t),o=new Uint8Array(r.length);for(let s=0;s<r.length;s++)o[s]=r.charCodeAt(s);return o}const Ed=/^[0-9a-f]{64}$/,tw=/^[0-9a-f]{128}$/,kd=/^[0-9a-f]{32}$/;function _d(e){const{adminSig:t,...n}=e,r=Object.keys(n).sort().reduce((o,s)=>(o[s]=n[s],o),{});return new TextEncoder().encode(JSON.stringify(r))}function nw(e){const{groupName:t,groupId:n,adminPubkey:r,adminPrivkey:o,relays:s,expiresInSec:i=86400}=e,a=new Uint8Array(16);crypto.getRandomValues(a);const c=ze(a),l={groupName:t,groupId:n,adminPubkey:r,inviteId:c,expiresAt:Math.floor(Date.now()/1e3)+i,relays:[...s],adminSig:""},u=we(_d(l));return l.adminSig=ze(te.sign(u,F(o))),l}function xd(e){if(e==null||typeof e!="object")throw new Error("Remote invite token must be a non-null object");const t=e;if(typeof t.groupName!="string"||t.groupName.length===0)throw new Error("groupName must be a non-empty string");if(typeof t.groupId!="string"||t.groupId.length===0)throw new Error("groupId must be a non-empty string");if(typeof t.adminPubkey!="string"||!Ed.test(t.adminPubkey))throw new Error("adminPubkey must be a 64-character hex string");if(typeof t.inviteId!="string"||!kd.test(t.inviteId))throw new Error("inviteId must be a 32-character hex string");if(typeof t.adminSig!="string"||!tw.test(t.adminSig))throw new Error("adminSig must be a 128-character hex string");if(!Array.isArray(t.relays)||!t.relays.every(i=>typeof i=="string"))throw new Error("relays must be an array of strings");if(typeof t.expiresAt!="number"||!Number.isFinite(t.expiresAt))throw new Error("expiresAt must be a finite number");const n=Math.floor(Date.now()/1e3);if(t.expiresAt<=n)throw new Error("Remote invite token has expired");const r=e,o=we(_d(r));if(!te.verify(F(r.adminSig),o,F(r.adminPubkey)))throw new Error("Remote invite token signature is invalid")}function rw(e){const{welcome:t,adminPrivkey:n,joinerPubkey:r}=e,o=JSON.stringify(t),s=Ee(F(n),r);return Dt(o,s)}function ow(e){const{envelope:t,joinerPrivkey:n,adminPubkey:r,expectedInviteId:o}=e,s=Ee(F(n),r),i=jt(t,s),a=JSON.parse(i);if(typeof a.inviteId!="string"||!kd.test(a.inviteId))throw new Error("Welcome payload must include a valid inviteId");if(a.inviteId!==o)throw new Error("Welcome payload inviteId does not match the pending invite");if(typeof a.seed!="string"||!Ed.test(a.seed))throw new Error("Welcome payload seed must be a 64-character hex string");if(typeof a.groupId!="string"||a.groupId.length===0)throw new Error("Welcome payload must include a non-empty groupId");return a}function sw(e){if(e.startsWith("wss://"))return!0;if(e.startsWith("ws://"))try{const t=new URL(e);return t.hostname==="localhost"||t.hostname==="127.0.0.1"||t.hostname==="[::1]"}catch{return!1}return!1}const Ln=/^[0-9a-f]{64}$/,Sd=/^[0-9a-f]{128}$/,iw=/^[0-9a-f]{32}$/,aw=10080*60,Id=300;function zt(e){return typeof e=="number"&&Number.isInteger(e)&&e>=0}function cw(){const e=new Uint8Array(16);return crypto.getRandomValues(e),Array.from(e).map(t=>t.toString(16).padStart(2,"0")).join("")}function lw(e){const t=e;if(!t||typeof t!="object")throw new Error("Invalid invite payload — expected an object.");if(typeof t.groupId!="string"||t.groupId.length===0)throw new Error("Invalid invite payload — groupId is required.");if(typeof t.seed!="string"||!Ln.test(t.seed))throw new Error("Invalid invite payload — seed must be 64-char hex.");if(typeof t.groupName!="string"||t.groupName.trim().length===0)throw new Error("Invalid invite payload — groupName is required.");if(!Number.isInteger(t.rotationInterval)||t.rotationInterval<=0)throw new Error("Invalid invite payload — rotationInterval must be > 0.");if(t.wordCount!==1&&t.wordCount!==2&&t.wordCount!==3)throw new Error("Invalid invite payload — wordCount must be 1, 2, or 3.");if(typeof t.wordlist!="string"||t.wordlist.length===0)throw new Error("Invalid invite payload — wordlist is required.");if(!zt(t.counter)||!zt(t.usageOffset))throw new Error("Invalid invite payload — counter and usageOffset must be non-negative integers.");if(typeof t.nonce!="string"||!iw.test(t.nonce))throw new Error("Invalid invite payload — nonce must be 32-char hex.");if(!Number.isInteger(t.beaconInterval)||t.beaconInterval<=0)throw new Error("Invalid invite payload — beaconInterval must be > 0.");if(!Number.isInteger(t.beaconPrecision)||t.beaconPrecision<1||t.beaconPrecision>11)throw new Error("Invalid invite payload — beaconPrecision must be 1..11.");if(!Array.isArray(t.members)||!t.members.every(r=>typeof r=="string"&&Ln.test(r)))throw new Error("Invalid invite payload — members must be 64-char hex pubkeys.");if(!Array.isArray(t.relays)||!t.relays.every(r=>typeof r=="string"&&sw(r)))throw new Error("Invalid invite payload — relays must be wss:// URLs (or ws:// for localhost).");if(t.encodingFormat!=="words"&&t.encodingFormat!=="pin"&&t.encodingFormat!=="hex")throw new Error("Invalid invite payload — encodingFormat must be words|pin|hex.");if(!zt(t.tolerance))throw new Error("Invalid invite payload — tolerance must be a non-negative integer.");if(t.tolerance>10)throw new Error("Invalid invite payload — tolerance must be <= 10.");if(!zt(t.issuedAt)||!zt(t.expiresAt))throw new Error("Invalid invite payload — issuedAt/expiresAt must be unix seconds.");if(t.expiresAt<=t.issuedAt)throw new Error("Invalid invite payload — expiresAt must be after issuedAt.");if(!zt(t.epoch))throw new Error("Invalid invite payload — epoch must be a non-negative integer.");if(!Array.isArray(t.admins)||!t.admins.every(r=>typeof r=="string"&&Ln.test(r)))throw new Error("Invalid invite payload — admins must be 64-char hex pubkeys.");const n=new Set(t.members);if(!t.admins.every(r=>n.has(r)))throw new Error("Invalid invite payload — all admins must be in members.");if(t.protocolVersion===void 0||t.protocolVersion===null)throw new Error("Invalid invite payload — protocolVersion is required.");if(t.protocolVersion!==se)throw new Error(`Unsupported invite protocol version: ${t.protocolVersion} (expected: ${se})`);if(typeof t.inviterPubkey!="string"||!Ln.test(t.inviterPubkey))throw new Error("Invalid invite payload — inviterPubkey must be a 64-char hex pubkey.");if(!t.admins.includes(t.inviterPubkey))throw new Error("Invalid invite payload — inviterPubkey must be in admins.");if(typeof t.inviterSig!="string"||!Sd.test(t.inviterSig))throw new Error("Invalid invite payload — inviterSig must be a 128-char hex Schnorr signature.")}function Rd(e){const{inviterSig:t,memberNames:n,relays:r,...o}=e,s=Object.keys(o).sort().reduce((i,a)=>(i[a]=o[a],i),{});return new TextEncoder().encode(JSON.stringify(s))}function uw(e,t){const n=Rd(e),r=we(n);return ze(te.sign(r,F(t)))}function dw(e){const t=Rd(e),n=we(t);return te.verify(F(e.inviterSig),n,F(e.inviterPubkey))}function Ad(e){const{nonce:t,relays:n,memberNames:r,...o}=e,s=JSON.stringify(o),i=new TextEncoder,a=Le(F(t),i.encode(s)),c=a[0]<<25|a[1]<<17|a[2]<<9|a[3]<<1|a[4]>>7,l=c>>>22&2047,u=c>>>11&2047,d=c&2047;return`${Nr(l)} ${Nr(u)} ${Nr(d)}`}function fw(e){const{identity:t}=_();if(!t?.pubkey)throw new Error("No identity — sign in first.");if(!t.privkey)throw new Error("Invite creation requires a local key (nsec). NIP-07 extensions cannot sign invites.");if(!e.admins.includes(t.pubkey))throw new Error(`Not authorised — you are not an admin of "${e.name}".`);const n=cw(),r=Math.floor(Date.now()/1e3),o={groupId:e.id,seed:e.seed,groupName:e.name,rotationInterval:e.rotationInterval,wordCount:e.wordCount,wordlist:e.wordlist,counter:e.counter,usageOffset:e.usageOffset,nonce:n,beaconInterval:e.beaconInterval,beaconPrecision:e.beaconPrecision,members:[...e.members],relays:[...e.writeRelays??e.relays??[]],encodingFormat:e.encodingFormat??"words",tolerance:e.tolerance??1,issuedAt:r,expiresAt:r+aw,epoch:e.epoch??0,admins:[...e.admins??[]],protocolVersion:se,inviterPubkey:t.pubkey,inviterSig:"",memberNames:{...e.memberNames}};o.inviterSig=uw(o,t.privkey);const s=Ad(o);return{payload:o,confirmCode:s}}function pw(e,t){let n;try{n=Bo(e)}catch{throw new Error("Invalid invite payload — could not decode.")}lw(n);const r={groupId:n.groupId,seed:n.seed,groupName:n.groupName,rotationInterval:n.rotationInterval,wordCount:n.wordCount,wordlist:n.wordlist,counter:n.counter,usageOffset:n.usageOffset,nonce:n.nonce,beaconInterval:n.beaconInterval,beaconPrecision:n.beaconPrecision,members:[...n.members],relays:[...n.relays],encodingFormat:n.encodingFormat,tolerance:n.tolerance,issuedAt:n.issuedAt,expiresAt:n.expiresAt,epoch:n.epoch,admins:[...n.admins],protocolVersion:n.protocolVersion,inviterPubkey:n.inviterPubkey,inviterSig:n.inviterSig,memberNames:n.memberNames&&typeof n.memberNames=="object"?{...n.memberNames}:void 0};if(!dw(r))throw new Error("Invite signature is invalid — the inviter could not prove control of the admin key.");if(!t?.trim())throw new Error("Confirmation code is required — ask the sender to read it to you.");const o=Ad(r),s=t.trim().replace(/[-\s]+/g," ").toLowerCase(),i=o.toLowerCase();if(s!==i)throw new Error("Confirmation words do not match — invite may have been tampered with.");const a=Math.floor(Date.now()/1e3);if(r.expiresAt<=a)throw new Error("Invite has expired. Ask for a new invite.");if(r.issuedAt>a+Id)throw new Error("Invite timestamp is too far in the future — check your device clock.");return r}function hw(e,t){const{groups:n}=_(),r=n[e];return r?Array.isArray(r.usedInvites)&&r.usedInvites.includes(t):!1}function mw(e,t){const{groups:n}=_(),r=n[e];if(!r){console.warn(`[canary:invite] consumeInvite: unknown group id "${e}"`);return}J(e,{usedInvites:Array.from(new Set([...r.usedInvites,t]))})}const yw=10080*60;function gw(e){const t=Object.keys(e).sort().reduce((n,r)=>(n[r]=e[r],n),{});return new TextEncoder().encode(JSON.stringify(t))}function bw(e,t){let n;try{n=Bo(e)}catch{return{valid:!1,error:"Invalid join token — could not decode."}}if(n.g!==t.groupId)return{valid:!1,error:"Join token is for a different group."};if(typeof n.p!="string"||!Ln.test(n.p))return{valid:!1,error:"Join token has invalid pubkey."};if(typeof n.s!="string"||!Sd.test(n.s))return{valid:!1,error:"Join token has invalid signature."};const r=Math.floor(Date.now()/1e3);if(typeof n.t!="number"||n.t<r-yw)return{valid:!1,error:"Join token has expired or is stale."};if(n.t>r+Id)return{valid:!1,error:"Join token timestamp is too far in the future."};const{s:o,...s}=n,i=we(gw(s));try{if(!te.verify(F(n.s),i,F(n.p)))return{valid:!1,error:"Join token signature is invalid."}}catch{return{valid:!1,error:"Join token signature verification failed."}}const a=(n.w||"").toLowerCase(),c=t.tolerance??1;let l=!1;for(let u=t.counter-c;u<=t.counter+c;u++)if(!(u<0)&&a===rt(t.groupSeed,t.context,u,t.encoding).toLowerCase()){l=!0;break}return l?{valid:!0,pubkey:n.p,displayName:n.n||"",word:n.w||""}:{valid:!1,error:"Join token word does not match — seed possession not proven."}}let zn=null;function vw(e){const{identity:t}=_();if(!t?.pubkey)throw new Error("No identity — sign in first.");if(!t.privkey)throw new Error("Invite creation requires a local key (nsec). NIP-07 extensions cannot sign invites.");if(!e.admins.includes(t.pubkey))throw new Error(`Not authorised — you are not an admin of "${e.name}".`);const n=e.writeRelays?.length?[...e.writeRelays]:[..._().settings.defaultWriteRelays??_().settings.defaultRelays],r=nw({groupName:e.name,groupId:e.id,adminPubkey:t.pubkey,adminPrivkey:t.privkey,relays:n}),o=Xv(r);return zn={groupId:e.id,tokenPayload:o,inviteId:r.inviteId},zn}function ic(e,t){const{identity:n}=_();if(!n?.privkey)throw new Error("No local identity — cannot create welcome envelope.");if(!zn)throw new Error("No active remote invite session — cannot create welcome envelope.");const r={inviteId:zn.inviteId,seed:e.seed,counter:e.counter,usageOffset:e.usageOffset,epoch:e.epoch??0,wordCount:e.wordCount,rotationInterval:e.rotationInterval,groupId:e.id,groupName:e.name,wordlist:e.wordlist,beaconInterval:e.beaconInterval,beaconPrecision:e.beaconPrecision,encodingFormat:e.encodingFormat??"words",tolerance:e.tolerance??1,members:[...e.members],admins:[...e.admins??[]],relays:[...e.writeRelays??e.relays??[]],memberNames:e.memberNames?{...e.memberNames}:void 0};return rw({welcome:r,adminPrivkey:n.privkey,joinerPubkey:t})}function In(){zn=null}function Rn(e){const t=new Uint8Array(e.length/2);for(let n=0;n<t.length;n++)t[n]=parseInt(e.substring(n*2,n*2+2),16);return t}function An(e){let t="";for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,"0");return t}const ww={words:0,pin:1,hex:2},Ew={0:"words",1:"pin",2:"hex"},kw={"en-v1":0},_w={0:"en-v1"},Cd=1,ac=new TextEncoder,cc=new TextDecoder;function xw(e){const t=ac.encode(e.groupId),n=ac.encode(e.groupName),r=e.admins.map(u=>{const d=e.members.indexOf(u);if(d===-1)throw new Error(`Admin ${u} not found in members array`);return d}),s=177+1+e.members.length*32+1+r.length+1+t.length+1+n.length,i=new ArrayBuffer(s),a=new DataView(i),c=new Uint8Array(i);let l=0;a.setUint8(l,Cd),l+=1,c.set(Rn(e.seed),l),l+=32,c.set(Rn(e.inviterPubkey),l),l+=32,c.set(Rn(e.inviterSig),l),l+=64,c.set(Rn(e.nonce),l),l+=16,a.setUint32(l,e.counter),l+=4,a.setUint16(l,e.usageOffset),l+=2,a.setUint32(l,e.epoch),l+=4,a.setUint32(l,e.rotationInterval),l+=4,a.setUint32(l,e.beaconInterval),l+=4,a.setUint8(l,e.beaconPrecision),l+=1,a.setUint8(l,e.wordCount),l+=1,a.setUint8(l,e.tolerance),l+=1,a.setUint8(l,ww[e.encodingFormat]??0),l+=1,a.setUint8(l,kw[e.wordlist]??0),l+=1,a.setUint32(l,e.issuedAt),l+=4,a.setUint32(l,e.expiresAt),l+=4,a.setUint8(l,e.protocolVersion),l+=1,a.setUint8(l,e.members.length),l+=1;for(const u of e.members)c.set(Rn(u),l),l+=32;a.setUint8(l,r.length),l+=1;for(const u of r)a.setUint8(l,u),l+=1;return a.setUint8(l,t.length),l+=1,c.set(t,l),l+=t.length,a.setUint8(l,n.length),l+=1,c.set(n,l),l+=n.length,c}function Sw(e){const t=new DataView(e.buffer,e.byteOffset,e.byteLength);let n=0;const r=t.getUint8(n);if(n+=1,r!==Cd)throw new Error(`Unsupported binary invite version: ${r}`);const o=An(e.slice(n,n+32));n+=32;const s=An(e.slice(n,n+32));n+=32;const i=An(e.slice(n,n+64));n+=64;const a=An(e.slice(n,n+16));n+=16;const c=t.getUint32(n);n+=4;const l=t.getUint16(n);n+=2;const u=t.getUint32(n);n+=4;const d=t.getUint32(n);n+=4;const f=t.getUint32(n);n+=4;const p=t.getUint8(n);n+=1;const h=t.getUint8(n);n+=1;const m=t.getUint8(n);n+=1;const y=Ew[t.getUint8(n)]??"words";n+=1;const g=_w[t.getUint8(n)]??"en-v1";n+=1;const E=t.getUint32(n);n+=4;const C=t.getUint32(n);n+=4;const $=t.getUint8(n);n+=1;const L=t.getUint8(n);n+=1;const O=[];for(let k=0;k<L;k++)O.push(An(e.slice(n,n+32))),n+=32;const w=t.getUint8(n);n+=1;const v=[];for(let k=0;k<w;k++){const R=t.getUint8(n);if(n+=1,R>=O.length)throw new Error(`Invalid admin index ${R} in binary invite (${O.length} members)`);v.push(O[R])}const b=t.getUint8(n);n+=1;const x=cc.decode(e.slice(n,n+b));n+=b;const S=t.getUint8(n);n+=1;const A=cc.decode(e.slice(n,n+S));return n+=S,{groupId:x,seed:o,groupName:A,rotationInterval:d,wordCount:h,wordlist:g,counter:c,usageOffset:l,nonce:a,beaconInterval:f,beaconPrecision:p,members:O,relays:[],encodingFormat:y,tolerance:m,issuedAt:E,expiresAt:C,epoch:u,admins:v,protocolVersion:$,inviterPubkey:s,inviterSig:i}}const bn=function(e,t){let o=e;const s=$n[t];let i=null,a=0,c=null;const l=[],u={},d=function(w,v){a=o*4+17,i=(function(b){const x=new Array(b);for(let S=0;S<b;S+=1){x[S]=new Array(b);for(let A=0;A<b;A+=1)x[S][A]=null}return x})(a),f(0,0),f(a-7,0),f(0,a-7),m(),h(),g(w,v),o>=7&&y(w),c==null&&(c=$(o,s,l)),E(c,v)},f=function(w,v){for(let b=-1;b<=7;b+=1)if(!(w+b<=-1||a<=w+b))for(let x=-1;x<=7;x+=1)v+x<=-1||a<=v+x||(0<=b&&b<=6&&(x==0||x==6)||0<=x&&x<=6&&(b==0||b==6)||2<=b&&b<=4&&2<=x&&x<=4?i[w+b][v+x]=!0:i[w+b][v+x]=!1)},p=function(){let w=0,v=0;for(let b=0;b<8;b+=1){d(!0,b);const x=mt.getLostPoint(u);(b==0||w>x)&&(w=x,v=b)}return v},h=function(){for(let w=8;w<a-8;w+=1)i[w][6]==null&&(i[w][6]=w%2==0);for(let w=8;w<a-8;w+=1)i[6][w]==null&&(i[6][w]=w%2==0)},m=function(){const w=mt.getPatternPosition(o);for(let v=0;v<w.length;v+=1)for(let b=0;b<w.length;b+=1){const x=w[v],S=w[b];if(i[x][S]==null)for(let A=-2;A<=2;A+=1)for(let k=-2;k<=2;k+=1)A==-2||A==2||k==-2||k==2||A==0&&k==0?i[x+A][S+k]=!0:i[x+A][S+k]=!1}},y=function(w){const v=mt.getBCHTypeNumber(o);for(let b=0;b<18;b+=1){const x=!w&&(v>>b&1)==1;i[Math.floor(b/3)][b%3+a-8-3]=x}for(let b=0;b<18;b+=1){const x=!w&&(v>>b&1)==1;i[b%3+a-8-3][Math.floor(b/3)]=x}},g=function(w,v){const b=s<<3|v,x=mt.getBCHTypeInfo(b);for(let S=0;S<15;S+=1){const A=!w&&(x>>S&1)==1;S<6?i[S][8]=A:S<8?i[S+1][8]=A:i[a-15+S][8]=A}for(let S=0;S<15;S+=1){const A=!w&&(x>>S&1)==1;S<8?i[8][a-S-1]=A:S<9?i[8][15-S-1+1]=A:i[8][15-S-1]=A}i[a-8][8]=!w},E=function(w,v){let b=-1,x=a-1,S=7,A=0;const k=mt.getMaskFunction(v);for(let R=a-1;R>0;R-=2)for(R==6&&(R-=1);;){for(let I=0;I<2;I+=1)if(i[x][R-I]==null){let N=!1;A<w.length&&(N=(w[A]>>>S&1)==1),k(x,R-I)&&(N=!N),i[x][R-I]=N,S-=1,S==-1&&(A+=1,S=7)}if(x+=b,x<0||a<=x){x-=b,b=-b;break}}},C=function(w,v){let b=0,x=0,S=0;const A=new Array(v.length),k=new Array(v.length);for(let T=0;T<v.length;T+=1){const M=v[T].dataCount,B=v[T].totalCount-M;x=Math.max(x,M),S=Math.max(S,B),A[T]=new Array(M);for(let V=0;V<A[T].length;V+=1)A[T][V]=255&w.getBuffer()[V+b];b+=M;const P=mt.getErrorCorrectPolynomial(B),D=Jn(A[T],P.getLength()-1).mod(P);k[T]=new Array(P.getLength()-1);for(let V=0;V<k[T].length;V+=1){const Y=V+D.getLength()-k[T].length;k[T][V]=Y>=0?D.getAt(Y):0}}let R=0;for(let T=0;T<v.length;T+=1)R+=v[T].totalCount;const I=new Array(R);let N=0;for(let T=0;T<x;T+=1)for(let M=0;M<v.length;M+=1)T<A[M].length&&(I[N]=A[M][T],N+=1);for(let T=0;T<S;T+=1)for(let M=0;M<v.length;M+=1)T<k[M].length&&(I[N]=k[M][T],N+=1);return I},$=function(w,v,b){const x=lc.getRSBlocks(w,v),S=uc();for(let k=0;k<b.length;k+=1){const R=b[k];S.put(R.getMode(),4),S.put(R.getLength(),mt.getLengthInBits(R.getMode(),w)),R.write(S)}let A=0;for(let k=0;k<x.length;k+=1)A+=x[k].dataCount;if(S.getLengthInBits()>A*8)throw"code length overflow. ("+S.getLengthInBits()+">"+A*8+")";for(S.getLengthInBits()+4<=A*8&&S.put(0,4);S.getLengthInBits()%8!=0;)S.putBit(!1);for(;!(S.getLengthInBits()>=A*8||(S.put(236,8),S.getLengthInBits()>=A*8));)S.put(17,8);return C(S,x)};u.addData=function(w,v){v=v||"Byte";let b=null;switch(v){case"Numeric":b=Iw(w);break;case"Alphanumeric":b=Rw(w);break;case"Byte":b=Aw(w);break;case"Kanji":b=Cw(w);break;default:throw"mode:"+v}l.push(b),c=null},u.isDark=function(w,v){if(w<0||a<=w||v<0||a<=v)throw w+","+v;return i[w][v]},u.getModuleCount=function(){return a},u.make=function(){if(o<1){let w=1;for(;w<40;w++){const v=lc.getRSBlocks(w,s),b=uc();for(let S=0;S<l.length;S++){const A=l[S];b.put(A.getMode(),4),b.put(A.getLength(),mt.getLengthInBits(A.getMode(),w)),A.write(b)}let x=0;for(let S=0;S<v.length;S++)x+=v[S].dataCount;if(b.getLengthInBits()<=x*8)break}o=w}d(!1,p())},u.createTableTag=function(w,v){w=w||2,v=typeof v>"u"?w*4:v;let b="";b+='<table style="',b+=" border-width: 0px; border-style: none;",b+=" border-collapse: collapse;",b+=" padding: 0px; margin: "+v+"px;",b+='">',b+="<tbody>";for(let x=0;x<u.getModuleCount();x+=1){b+="<tr>";for(let S=0;S<u.getModuleCount();S+=1)b+='<td style="',b+=" border-width: 0px; border-style: none;",b+=" border-collapse: collapse;",b+=" padding: 0px; margin: 0px;",b+=" width: "+w+"px;",b+=" height: "+w+"px;",b+=" background-color: ",b+=u.isDark(x,S)?"#000000":"#ffffff",b+=";",b+='"/>';b+="</tr>"}return b+="</tbody>",b+="</table>",b},u.createSvgTag=function(w,v,b,x){let S={};typeof arguments[0]=="object"&&(S=arguments[0],w=S.cellSize,v=S.margin,b=S.alt,x=S.title),w=w||2,v=typeof v>"u"?w*4:v,b=typeof b=="string"?{text:b}:b||{},b.text=b.text||null,b.id=b.text?b.id||"qrcode-description":null,x=typeof x=="string"?{text:x}:x||{},x.text=x.text||null,x.id=x.text?x.id||"qrcode-title":null;const A=u.getModuleCount()*w+v*2;let k,R,I,N,T="",M;for(M="l"+w+",0 0,"+w+" -"+w+",0 0,-"+w+"z ",T+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',T+=S.scalable?"":' width="'+A+'px" height="'+A+'px"',T+=' viewBox="0 0 '+A+" "+A+'" ',T+=' preserveAspectRatio="xMinYMin meet"',T+=x.text||b.text?' role="img" aria-labelledby="'+L([x.id,b.id].join(" ").trim())+'"':"",T+=">",T+=x.text?'<title id="'+L(x.id)+'">'+L(x.text)+"</title>":"",T+=b.text?'<description id="'+L(b.id)+'">'+L(b.text)+"</description>":"",T+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',T+='<path d="',I=0;I<u.getModuleCount();I+=1)for(N=I*w+v,k=0;k<u.getModuleCount();k+=1)u.isDark(I,k)&&(R=k*w+v,T+="M"+R+","+N+M);return T+='" stroke="transparent" fill="black"/>',T+="</svg>",T},u.createDataURL=function(w,v){w=w||2,v=typeof v>"u"?w*4:v;const b=u.getModuleCount()*w+v*2,x=v,S=b-v;return $w(b,b,function(A,k){if(x<=A&&A<S&&x<=k&&k<S){const R=Math.floor((A-x)/w),I=Math.floor((k-x)/w);return u.isDark(I,R)?0:1}else return 1})},u.createImgTag=function(w,v,b){w=w||2,v=typeof v>"u"?w*4:v;const x=u.getModuleCount()*w+v*2;let S="";return S+="<img",S+=' src="',S+=u.createDataURL(w,v),S+='"',S+=' width="',S+=x,S+='"',S+=' height="',S+=x,S+='"',b&&(S+=' alt="',S+=L(b),S+='"'),S+="/>",S};const L=function(w){let v="";for(let b=0;b<w.length;b+=1){const x=w.charAt(b);switch(x){case"<":v+="&lt;";break;case">":v+="&gt;";break;case"&":v+="&amp;";break;case'"':v+="&quot;";break;default:v+=x;break}}return v},O=function(w){w=typeof w>"u"?2:w;const b=u.getModuleCount()*1+w*2,x=w,S=b-w;let A,k,R,I,N;const T={"██":"█","█ ":"▀"," █":"▄","  ":" "},M={"██":"▀","█ ":"▀"," █":" ","  ":" "};let B="";for(A=0;A<b;A+=2){for(R=Math.floor((A-x)/1),I=Math.floor((A+1-x)/1),k=0;k<b;k+=1)N="█",x<=k&&k<S&&x<=A&&A<S&&u.isDark(R,Math.floor((k-x)/1))&&(N=" "),x<=k&&k<S&&x<=A+1&&A+1<S&&u.isDark(I,Math.floor((k-x)/1))?N+=" ":N+="█",B+=w<1&&A+1>=S?M[N]:T[N];B+=`
`}return b%2&&w>0?B.substring(0,B.length-b-1)+Array(b+1).join("▀"):B.substring(0,B.length-1)};return u.createASCII=function(w,v){if(w=w||1,w<2)return O(v);w-=1,v=typeof v>"u"?w*2:v;const b=u.getModuleCount()*w+v*2,x=v,S=b-v;let A,k,R,I;const N=Array(w+1).join("██"),T=Array(w+1).join("  ");let M="",B="";for(A=0;A<b;A+=1){for(R=Math.floor((A-x)/w),B="",k=0;k<b;k+=1)I=1,x<=k&&k<S&&x<=A&&A<S&&u.isDark(R,Math.floor((k-x)/w))&&(I=0),B+=I?N:T;for(R=0;R<w;R+=1)M+=B+`
`}return M.substring(0,M.length-1)},u.renderTo2dContext=function(w,v){v=v||2;const b=u.getModuleCount();for(let x=0;x<b;x++)for(let S=0;S<b;S++)w.fillStyle=u.isDark(x,S)?"black":"white",w.fillRect(S*v,x*v,v,v)},u};bn.stringToBytes=function(e){const t=[];for(let n=0;n<e.length;n+=1){const r=e.charCodeAt(n);t.push(r&255)}return t};bn.createStringToBytes=function(e,t){const n=(function(){const o=Nw(e),s=function(){const c=o.read();if(c==-1)throw"eof";return c};let i=0;const a={};for(;;){const c=o.read();if(c==-1)break;const l=s(),u=s(),d=s(),f=String.fromCharCode(c<<8|l),p=u<<8|d;a[f]=p,i+=1}if(i!=t)throw i+" != "+t;return a})(),r=63;return function(o){const s=[];for(let i=0;i<o.length;i+=1){const a=o.charCodeAt(i);if(a<128)s.push(a);else{const c=n[o.charAt(i)];typeof c=="number"?(c&255)==c?s.push(c):(s.push(c>>>8),s.push(c&255)):s.push(r)}}return s}};const pe={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},$n={L:1,M:0,Q:3,H:2},ht={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},mt=(function(){const e=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],t=1335,n=7973,r=21522,o={},s=function(i){let a=0;for(;i!=0;)a+=1,i>>>=1;return a};return o.getBCHTypeInfo=function(i){let a=i<<10;for(;s(a)-s(t)>=0;)a^=t<<s(a)-s(t);return(i<<10|a)^r},o.getBCHTypeNumber=function(i){let a=i<<12;for(;s(a)-s(n)>=0;)a^=n<<s(a)-s(n);return i<<12|a},o.getPatternPosition=function(i){return e[i-1]},o.getMaskFunction=function(i){switch(i){case ht.PATTERN000:return function(a,c){return(a+c)%2==0};case ht.PATTERN001:return function(a,c){return a%2==0};case ht.PATTERN010:return function(a,c){return c%3==0};case ht.PATTERN011:return function(a,c){return(a+c)%3==0};case ht.PATTERN100:return function(a,c){return(Math.floor(a/2)+Math.floor(c/3))%2==0};case ht.PATTERN101:return function(a,c){return a*c%2+a*c%3==0};case ht.PATTERN110:return function(a,c){return(a*c%2+a*c%3)%2==0};case ht.PATTERN111:return function(a,c){return(a*c%3+(a+c)%2)%2==0};default:throw"bad maskPattern:"+i}},o.getErrorCorrectPolynomial=function(i){let a=Jn([1],0);for(let c=0;c<i;c+=1)a=a.multiply(Jn([1,yt.gexp(c)],0));return a},o.getLengthInBits=function(i,a){if(1<=a&&a<10)switch(i){case pe.MODE_NUMBER:return 10;case pe.MODE_ALPHA_NUM:return 9;case pe.MODE_8BIT_BYTE:return 8;case pe.MODE_KANJI:return 8;default:throw"mode:"+i}else if(a<27)switch(i){case pe.MODE_NUMBER:return 12;case pe.MODE_ALPHA_NUM:return 11;case pe.MODE_8BIT_BYTE:return 16;case pe.MODE_KANJI:return 10;default:throw"mode:"+i}else if(a<41)switch(i){case pe.MODE_NUMBER:return 14;case pe.MODE_ALPHA_NUM:return 13;case pe.MODE_8BIT_BYTE:return 16;case pe.MODE_KANJI:return 12;default:throw"mode:"+i}else throw"type:"+a},o.getLostPoint=function(i){const a=i.getModuleCount();let c=0;for(let d=0;d<a;d+=1)for(let f=0;f<a;f+=1){let p=0;const h=i.isDark(d,f);for(let m=-1;m<=1;m+=1)if(!(d+m<0||a<=d+m))for(let y=-1;y<=1;y+=1)f+y<0||a<=f+y||m==0&&y==0||h==i.isDark(d+m,f+y)&&(p+=1);p>5&&(c+=3+p-5)}for(let d=0;d<a-1;d+=1)for(let f=0;f<a-1;f+=1){let p=0;i.isDark(d,f)&&(p+=1),i.isDark(d+1,f)&&(p+=1),i.isDark(d,f+1)&&(p+=1),i.isDark(d+1,f+1)&&(p+=1),(p==0||p==4)&&(c+=3)}for(let d=0;d<a;d+=1)for(let f=0;f<a-6;f+=1)i.isDark(d,f)&&!i.isDark(d,f+1)&&i.isDark(d,f+2)&&i.isDark(d,f+3)&&i.isDark(d,f+4)&&!i.isDark(d,f+5)&&i.isDark(d,f+6)&&(c+=40);for(let d=0;d<a;d+=1)for(let f=0;f<a-6;f+=1)i.isDark(f,d)&&!i.isDark(f+1,d)&&i.isDark(f+2,d)&&i.isDark(f+3,d)&&i.isDark(f+4,d)&&!i.isDark(f+5,d)&&i.isDark(f+6,d)&&(c+=40);let l=0;for(let d=0;d<a;d+=1)for(let f=0;f<a;f+=1)i.isDark(f,d)&&(l+=1);const u=Math.abs(100*l/a/a-50)/5;return c+=u*10,c},o})(),yt=(function(){const e=new Array(256),t=new Array(256);for(let r=0;r<8;r+=1)e[r]=1<<r;for(let r=8;r<256;r+=1)e[r]=e[r-4]^e[r-5]^e[r-6]^e[r-8];for(let r=0;r<255;r+=1)t[e[r]]=r;const n={};return n.glog=function(r){if(r<1)throw"glog("+r+")";return t[r]},n.gexp=function(r){for(;r<0;)r+=255;for(;r>=256;)r-=255;return e[r]},n})(),Jn=function(e,t){if(typeof e.length>"u")throw e.length+"/"+t;const n=(function(){let o=0;for(;o<e.length&&e[o]==0;)o+=1;const s=new Array(e.length-o+t);for(let i=0;i<e.length-o;i+=1)s[i]=e[i+o];return s})(),r={};return r.getAt=function(o){return n[o]},r.getLength=function(){return n.length},r.multiply=function(o){const s=new Array(r.getLength()+o.getLength()-1);for(let i=0;i<r.getLength();i+=1)for(let a=0;a<o.getLength();a+=1)s[i+a]^=yt.gexp(yt.glog(r.getAt(i))+yt.glog(o.getAt(a)));return Jn(s,0)},r.mod=function(o){if(r.getLength()-o.getLength()<0)return r;const s=yt.glog(r.getAt(0))-yt.glog(o.getAt(0)),i=new Array(r.getLength());for(let a=0;a<r.getLength();a+=1)i[a]=r.getAt(a);for(let a=0;a<o.getLength();a+=1)i[a]^=yt.gexp(yt.glog(o.getAt(a))+s);return Jn(i,0).mod(o)},r},lc=(function(){const e=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(o,s){const i={};return i.totalCount=o,i.dataCount=s,i},n={},r=function(o,s){switch(s){case $n.L:return e[(o-1)*4+0];case $n.M:return e[(o-1)*4+1];case $n.Q:return e[(o-1)*4+2];case $n.H:return e[(o-1)*4+3];default:return}};return n.getRSBlocks=function(o,s){const i=r(o,s);if(typeof i>"u")throw"bad rs block @ typeNumber:"+o+"/errorCorrectionLevel:"+s;const a=i.length/3,c=[];for(let l=0;l<a;l+=1){const u=i[l*3+0],d=i[l*3+1],f=i[l*3+2];for(let p=0;p<u;p+=1)c.push(t(d,f))}return c},n})(),uc=function(){const e=[];let t=0;const n={};return n.getBuffer=function(){return e},n.getAt=function(r){const o=Math.floor(r/8);return(e[o]>>>7-r%8&1)==1},n.put=function(r,o){for(let s=0;s<o;s+=1)n.putBit((r>>>o-s-1&1)==1)},n.getLengthInBits=function(){return t},n.putBit=function(r){const o=Math.floor(t/8);e.length<=o&&e.push(0),r&&(e[o]|=128>>>t%8),t+=1},n},Iw=function(e){const t=pe.MODE_NUMBER,n=e,r={};r.getMode=function(){return t},r.getLength=function(i){return n.length},r.write=function(i){const a=n;let c=0;for(;c+2<a.length;)i.put(o(a.substring(c,c+3)),10),c+=3;c<a.length&&(a.length-c==1?i.put(o(a.substring(c,c+1)),4):a.length-c==2&&i.put(o(a.substring(c,c+2)),7))};const o=function(i){let a=0;for(let c=0;c<i.length;c+=1)a=a*10+s(i.charAt(c));return a},s=function(i){if("0"<=i&&i<="9")return i.charCodeAt(0)-48;throw"illegal char :"+i};return r},Rw=function(e){const t=pe.MODE_ALPHA_NUM,n=e,r={};r.getMode=function(){return t},r.getLength=function(s){return n.length},r.write=function(s){const i=n;let a=0;for(;a+1<i.length;)s.put(o(i.charAt(a))*45+o(i.charAt(a+1)),11),a+=2;a<i.length&&s.put(o(i.charAt(a)),6)};const o=function(s){if("0"<=s&&s<="9")return s.charCodeAt(0)-48;if("A"<=s&&s<="Z")return s.charCodeAt(0)-65+10;switch(s){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+s}};return r},Aw=function(e){const t=pe.MODE_8BIT_BYTE,n=bn.stringToBytes(e),r={};return r.getMode=function(){return t},r.getLength=function(o){return n.length},r.write=function(o){for(let s=0;s<n.length;s+=1)o.put(n[s],8)},r},Cw=function(e){const t=pe.MODE_KANJI,n=bn.stringToBytes;(function(s,i){const a=n(s);if(a.length!=2||(a[0]<<8|a[1])!=i)throw"sjis not supported."})("友",38726);const r=n(e),o={};return o.getMode=function(){return t},o.getLength=function(s){return~~(r.length/2)},o.write=function(s){const i=r;let a=0;for(;a+1<i.length;){let c=(255&i[a])<<8|255&i[a+1];if(33088<=c&&c<=40956)c-=33088;else if(57408<=c&&c<=60351)c-=49472;else throw"illegal char at "+(a+1)+"/"+c;c=(c>>>8&255)*192+(c&255),s.put(c,13),a+=2}if(a<i.length)throw"illegal char at "+(a+1)},o},Td=function(){const e=[],t={};return t.writeByte=function(n){e.push(n&255)},t.writeShort=function(n){t.writeByte(n),t.writeByte(n>>>8)},t.writeBytes=function(n,r,o){r=r||0,o=o||n.length;for(let s=0;s<o;s+=1)t.writeByte(n[s+r])},t.writeString=function(n){for(let r=0;r<n.length;r+=1)t.writeByte(n.charCodeAt(r))},t.toByteArray=function(){return e},t.toString=function(){let n="";n+="[";for(let r=0;r<e.length;r+=1)r>0&&(n+=","),n+=e[r];return n+="]",n},t},Tw=function(){let e=0,t=0,n=0,r="";const o={},s=function(a){r+=String.fromCharCode(i(a&63))},i=function(a){if(a<0)throw"n:"+a;if(a<26)return 65+a;if(a<52)return 97+(a-26);if(a<62)return 48+(a-52);if(a==62)return 43;if(a==63)return 47;throw"n:"+a};return o.writeByte=function(a){for(e=e<<8|a&255,t+=8,n+=1;t>=6;)s(e>>>t-6),t-=6},o.flush=function(){if(t>0&&(s(e<<6-t),e=0,t=0),n%3!=0){const a=3-n%3;for(let c=0;c<a;c+=1)r+="="}},o.toString=function(){return r},o},Nw=function(e){const t=e;let n=0,r=0,o=0;const s={};s.read=function(){for(;o<8;){if(n>=t.length){if(o==0)return-1;throw"unexpected end of file./"+o}const c=t.charAt(n);if(n+=1,c=="=")return o=0,-1;if(c.match(/^\s$/))continue;r=r<<6|i(c.charCodeAt(0)),o+=6}const a=r>>>o-8&255;return o-=8,a};const i=function(a){if(65<=a&&a<=90)return a-65;if(97<=a&&a<=122)return a-97+26;if(48<=a&&a<=57)return a-48+52;if(a==43)return 62;if(a==47)return 63;throw"c:"+a};return s},Lw=function(e,t){const n=e,r=t,o=new Array(e*t),s={};s.setPixel=function(l,u,d){o[u*n+l]=d},s.write=function(l){l.writeString("GIF87a"),l.writeShort(n),l.writeShort(r),l.writeByte(128),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(255),l.writeByte(255),l.writeByte(255),l.writeString(","),l.writeShort(0),l.writeShort(0),l.writeShort(n),l.writeShort(r),l.writeByte(0);const u=2,d=a(u);l.writeByte(u);let f=0;for(;d.length-f>255;)l.writeByte(255),l.writeBytes(d,f,255),f+=255;l.writeByte(d.length-f),l.writeBytes(d,f,d.length-f),l.writeByte(0),l.writeString(";")};const i=function(l){const u=l;let d=0,f=0;const p={};return p.write=function(h,m){if(h>>>m)throw"length over";for(;d+m>=8;)u.writeByte(255&(h<<d|f)),m-=8-d,h>>>=8-d,f=0,d=0;f=h<<d|f,d=d+m},p.flush=function(){d>0&&u.writeByte(f)},p},a=function(l){const u=1<<l,d=(1<<l)+1;let f=l+1;const p=c();for(let E=0;E<u;E+=1)p.add(String.fromCharCode(E));p.add(String.fromCharCode(u)),p.add(String.fromCharCode(d));const h=Td(),m=i(h);m.write(u,f);let y=0,g=String.fromCharCode(o[y]);for(y+=1;y<o.length;){const E=String.fromCharCode(o[y]);y+=1,p.contains(g+E)?g=g+E:(m.write(p.indexOf(g),f),p.size()<4095&&(p.size()==1<<f&&(f+=1),p.add(g+E)),g=E)}return m.write(p.indexOf(g),f),m.write(d,f),m.flush(),h.toByteArray()},c=function(){const l={};let u=0;const d={};return d.add=function(f){if(d.contains(f))throw"dup key:"+f;l[f]=u,u+=1},d.size=function(){return u},d.indexOf=function(f){return l[f]},d.contains=function(f){return typeof l[f]<"u"},d};return s},$w=function(e,t,n){const r=Lw(e,t);for(let a=0;a<t;a+=1)for(let c=0;c<e;c+=1)r.setPixel(c,a,n(c,a));const o=Td();r.write(o);const s=Tw(),i=o.toByteArray();for(let a=0;a<i.length;a+=1)s.writeByte(i[a]);return s.flush(),"data:image/gif;base64,"+s};bn.stringToBytes;function Ow(e,t=4){const n=bn(0,"L");return n.addData(e),n.make(),n.createSvgTag({cellSize:t,margin:2,scalable:!0})}const so=25519;function Nd(e){const t=ae(),{identity:n}=_();if(!t||!n?.pubkey||!n?.privkey)return e.onError("No relay pool or identity available."),()=>{};const{inviteId:r,adminPubkey:o,readRelays:s,writeRelays:i,onWelcome:a,onError:c}=e,l=n.privkey;n.pubkey;const u=Array.from(new Set([...s,...i])),d=Ee(F(l),o),f=JSON.stringify({type:"join-request",inviteId:r}),p=Dt(f,d),h=it({kind:so,created_at:Math.floor(Date.now()/1e3),tags:[["d",r],["p",o]],content:p},F(l));Promise.allSettled(t.publish(i,h)).catch(()=>{});const m=t.subscribeMany(u,{kinds:[so],"#d":[r],authors:[o]},{onevent(g){if(at(g)&&!(typeof g.content=="string"&&g.content.length>65536))try{const E=jt(g.content,d),C=JSON.parse(E);C.type==="welcome"&&C.inviteId===r&&C.envelope&&(a(C.envelope),m.close())}catch{}},oneose(){}}),y=setTimeout(()=>{m.close(),c("Timed out waiting for welcome message from admin.")},12e4);return()=>{clearTimeout(y),m.close()}}function Mw(e){const t=ae(),{identity:n}=_();if(!t||!n?.pubkey||!n?.privkey)return e.onError("No relay pool or identity available."),()=>{};const{inviteId:r,readRelays:o,writeRelays:s,onJoinRequest:i,onError:a}=e,c=n.privkey,l=Array.from(new Set([...o,...s])),u=t.subscribeMany(l,{kinds:[so],"#d":[r],"#p":[n.pubkey]},{onevent(f){if(at(f)&&!(typeof f.content=="string"&&f.content.length>65536))try{const p=Ee(F(c),f.pubkey),h=jt(f.content,p),m=JSON.parse(h);m.type==="join-request"&&m.inviteId===r&&i(f.pubkey)}catch{}},oneose(){}}),d=setTimeout(()=>{u.close(),a("Timed out waiting for join request.")},3e5);return()=>{clearTimeout(d),u.close()}}function Bw(e){const t=ae(),{identity:n}=_();if(!t||!n?.privkey)return;const{inviteId:r,joinerPubkey:o,envelope:s,writeRelays:i}=e,a=Ee(F(n.privkey),o),c=JSON.stringify({type:"welcome",inviteId:r,envelope:s}),l=Dt(c,a),u=it({kind:so,created_at:Math.floor(Date.now()/1e3),tags:[["d",r],["p",o]],content:l},F(n.privkey));Promise.allSettled(t.publish(i,u)).catch(()=>{})}const Ld=35520;function Pw(e){const t=ae(),{identity:n}=_();if(!t||!n?.privkey)return;const{token:r,writeRelays:o}=e,s=JSON.stringify(r),i=String(Math.floor(Date.now()/1e3)+10080*60),a=it({kind:Ld,created_at:Math.floor(Date.now()/1e3),tags:[["d",r.inviteId],["expiration",i]],content:s},F(n.privkey));Promise.allSettled(t.publish(o,a)).catch(()=>{})}function Uw(e){const t=ae();if(!t)return e.onError("No relay pool available."),()=>{};const{inviteId:n,readRelays:r,onToken:o,onError:s}=e;let i=!1;const a=t.subscribeMany(r,{kinds:[Ld],"#d":[n]},{onevent(l){if(at(l)&&!(typeof l.content=="string"&&l.content.length>65536)&&!i)try{const u=JSON.parse(l.content);u.inviteId===n&&(i=!0,o(u),a.close())}catch{}},oneose(){i||(a.close(),s("Invite not found on relay — it may have expired."))}}),c=setTimeout(()=>{i||(a.close(),s("Timed out looking for invite on relay."))},15e3);return()=>{clearTimeout(c),a.close()}}function $d(e){if(!e||typeof e!="object")return{};const t=e;return{...typeof t.name=="string"?{name:t.name}:{},...typeof t.display_name=="string"?{display_name:t.display_name}:{},...typeof t.picture=="string"?{picture:t.picture}:{},...typeof t.about=="string"?{about:t.about}:{},...typeof t.nip05=="string"?{nip05:t.nip05}:{},...typeof t.lud16=="string"?{lud16:t.lud16}:{},...typeof t.lud06=="string"?{lud06:t.lud06}:{},...typeof t.website=="string"?{website:t.website}:{},...typeof t.banner=="string"?{banner:t.banner}:{}}}const et=new Map,$r=new Map,Dw=6e4,xe=new Set;function Vi(e){const t=et.get(e);if(t)return t.display_name||t.name||void 0}function vn(e){return et.get(e)}function Od(e,t){const n=ae();if(!n){console.warn("[profiles] no pool — skipping");return}const r=Date.now(),o=e.filter(c=>{if(et.has(c)||xe.has(c))return!1;const l=$r.get(c);return!(l&&r-l<Dw)});if(o.length===0){console.warn("[profiles] all cached/pending — nothing to fetch");return}for(const c of o)xe.add(c);const s=qw(t),i=[...new Set([...s,...Md])];if(console.warn("[profiles] fetching",o.length,"profiles from",i,"for group",t?.slice(0,8)),i.length===0){for(const c of o)xe.delete(c);return}const a=n.subscribeMany(i,{kinds:[0],authors:o},{onevent(c){if(at(c)&&!(typeof c.content=="string"&&c.content.length>65536))try{const l=$d(JSON.parse(c.content));console.warn("[profiles] got profile for",c.pubkey.slice(0,8),l.display_name||l.name||"(no name)"),et.set(c.pubkey,l),xe.delete(c.pubkey);const u=l.display_name||l.name;if(u&&t){const d=_().groups[t];d&&d.memberNames?.[c.pubkey]!==u&&J(t,{memberNames:{...d.memberNames,[c.pubkey]:u}})}}catch{$r.set(c.pubkey,Date.now()),xe.delete(c.pubkey)}},oneose(){console.warn("[profiles] EOSE — found:",o.filter(c=>et.has(c)).length,"missing:",o.filter(c=>!et.has(c)).length);for(const c of o)et.has(c)||$r.set(c,Date.now()),xe.delete(c);a.close()}})}const Ki=["wss://purplepag.es","wss://relay.damus.io","wss://nos.lol"],Md=Ki;async function jw(){await Oo();const e=ae(),{identity:t,settings:n}=_();if(!e||!t?.pubkey)return;const r=t.pubkey;if(xe.has(r))return;et.delete(r),$r.delete(r),xe.add(r);const o=n?.defaultRelays?.length?n.defaultRelays:[],s=[...new Set([...o,...Md])];if(s.length===0){xe.delete(r);return}console.warn("[profiles] fetching own kind 0 from",s);const i=e.subscribeMany(s,{kinds:[0],authors:[r]},{onevent(a){if(at(a)&&!(typeof a.content=="string"&&a.content.length>65536))try{const c=$d(JSON.parse(a.content));console.warn("[profiles] got own profile from relay:",c.display_name||c.name||"(no name)"),et.set(a.pubkey,c),xe.delete(a.pubkey);const l=c.display_name||c.name,u=c.picture,{identity:d}=_();if(d&&d.pubkey===a.pubkey){const f={};l&&d.displayName!==l&&(f.displayName=l),u&&d.picture!==u&&(f.picture=u),Object.keys(f).length>0&&X({identity:{...d,...f}})}}catch{xe.delete(a.pubkey)}},oneose(){xe.delete(r),i.close()}})}function qw(e){if(e){const n=_().groups[e];if(n?.relays?.length)return n.relays}const t=_().settings;return t?.defaultRelays?.length?t.defaultRelays:[]}function Hw(e){const t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function Fw(e,t){setTimeout(async()=>{try{const n=ae();if(!n){console.warn("[profiles] no pool — skipping kind 0 publish");return}await Oo();const r=JSON.stringify({name:e}),o={kind:0,created_at:Math.floor(Date.now()/1e3),tags:[],content:r},s=Hw(t),i=it(o,s),{settings:a}=_(),c=a?.defaultWriteRelays?.length?a.defaultWriteRelays:a?.defaultRelays?.length?a.defaultRelays:[],l=Se([...Ki,...c]);console.warn("[profiles] publishing kind 0 to",l);const u=n.publish(l,i),f=(await Promise.allSettled(u)).filter(p=>p.status==="fulfilled").length;console.warn(`[profiles] kind 0 published to ${f}/${l.length} relay(s)`)}catch(n){console.warn("[profiles] kind 0 publish failed:",n)}},2e3)}const Bd=Object.freeze(Object.defineProperty({__proto__:null,PROFILE_RELAYS:Ki,fetchOwnProfile:jw,fetchProfiles:Od,getCachedName:Vi,getCachedProfile:vn,publishKind0:Fw},Symbol.toStringTag,{value:"Module"})),dc=[210,140,30,280,60,330,170,0];function Gw(e,t){const n=t.indexOf(e);return dc[(n>=0?n:0)%dc.length]}function Vw(e,t,n,r){const o=Gw(e,t),s=n[e]??0;if(s===0)return`hsl(${o}, 55%, 55%)`;const i=Math.floor(Date.now()/1e3)-s;return i<=r?`hsl(${o}, 70%, 55%)`:i<=r*1.25?`hsl(${o}, 40%, 50%)`:"#94a3b8"}function Us(e,t,n){const{identity:r,groups:o}=_(),s=r?.pubkey===e;let i;if(n){const c=o[n]?.memberNames?.[e];c&&c!=="You"&&(i=c)}return i||(i=Vi(e)),s?i?`${i} (you)`:"You":i||`${e.slice(0,8)}…${e.slice(-4)}`}function Po(e,t){const n=t?.title??"Invite to Group",r=t?.scanHint??"Scan with your phone camera to join";t?.showConfirmMemberNote,Zn(e);let o=document.getElementById("invite-modal");o||(o=document.createElement("dialog"),o.id="invite-modal",o.className="modal",document.body.appendChild(o),o.addEventListener("click",d=>{d.target===o&&(In(),o.close())}));const s=o;function i(){s.innerHTML=`
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
    `,s.querySelector("#invite-qr-path")?.addEventListener("click",l),s.querySelector("#invite-link-path")?.addEventListener("click",u),s.querySelector("#invite-close-btn")?.addEventListener("click",()=>{In(),s.close()})}function a(d){s.innerHTML=`
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
    `,s.querySelector("#remote-back-2")?.addEventListener("click",d),s.querySelector("#remote-next-2")?.addEventListener("click",()=>{const f=s.querySelector("#remote-joincode-input"),p=s.querySelector("#remote-joincode-error"),h=f?.value.trim()??"";if(!/^[0-9a-f]{64}$/.test(h)){p&&(p.textContent="Invalid join code — must be a 64-character hex public key.",p.style.display="");return}try{const m=_().groups[e.id];if(!m)throw new Error("Group not found.");const y=ic(m,h);c(y,h)}catch(m){p&&(p.textContent=m instanceof Error?m.message:"Failed to create welcome envelope.",p.style.display="")}})}function c(d,f){s.innerHTML=`
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
    `,s.querySelector("#remote-copy-welcome")?.addEventListener("click",async p=>{const h=p.currentTarget;try{await navigator.clipboard.writeText(d),h.textContent="Copied!",h.classList.add("btn--copied"),setTimeout(()=>{h.textContent="Copy Welcome Message",h.classList.remove("btn--copied")},2e3)}catch{}}),s.querySelector("#remote-done")?.addEventListener("click",()=>{try{const p=_().groups[e.id];if(p&&!p.members.includes(f)){const h=s.querySelector("#remote-joiner-name")?.value.trim()??"";Bs(e.id,f,h),q(h?`${h} added to group`:"Member added to group","success")}}catch(p){q(p instanceof Error?p.message:"Failed to add member","error")}In(),s.close()})}function l(){let d,f,p;try{const g=fw(e);d=g.payload,f=g.confirmCode,p=xw(d)}catch(g){q(g instanceof Error?g.message:"Failed to create invite.","error");return}const m=`${window.location.href.split("#")[0]}#inv/${Qv(p)}`,y=Ow(m);s.innerHTML=`
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
    `,s.querySelector("#invite-back-btn")?.addEventListener("click",()=>{i()}),s.querySelector("#invite-done-btn")?.addEventListener("click",()=>{s.close()})}function u(){let d;try{d=vw(e)}catch(g){q(g instanceof Error?g.message:"Failed to create remote invite.","error");return}const p=`${window.location.href.split("#")[0]}#j/${d.inviteId}`,h=e.readRelays?.length?e.readRelays:_().settings.defaultReadRelays,m=e.writeRelays?.length?e.writeRelays:_().settings.defaultWriteRelays;Oe(h,m).then(()=>{Pw({token:wd(d.tokenPayload),writeRelays:m})});let y=()=>{};s.innerHTML=`
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
    `,s.querySelector("#remote-copy-link")?.addEventListener("click",async g=>{const E=g.currentTarget;try{await navigator.clipboard.writeText(p),E.textContent="Copied!",E.classList.add("btn--copied"),setTimeout(()=>{E.textContent="Copy Link",E.classList.remove("btn--copied")},2e3)}catch{}}),Oe(h,m).then(()=>{y=Mw({inviteId:d.inviteId,readRelays:h,writeRelays:m,onJoinRequest(g){y();try{const E=_().groups[e.id];if(!E)return;const C=ic(E,g);Bw({inviteId:d.inviteId,joinerPubkey:g,envelope:C,writeRelays:m}),E.members.includes(g)||Bs(e.id,g),In(),s.close(),q("Member joined via relay","success")}catch(E){q(E instanceof Error?E.message:"Failed to send welcome","error")}},onError(g){const E=s.querySelector("#remote-relay-status");E&&(E.textContent=g||"Relay unavailable — use manual fallback below.")}})}),s.querySelector("#remote-manual-fallback")?.addEventListener("click",()=>{y(),a(()=>{y=()=>{},u()})}),s.querySelector("#remote-back-btn")?.addEventListener("click",()=>{y(),In(),i()})}i(),o.showModal()}function Ds(e){Po(e,{title:"Share Group State",scanHint:"Share with existing members to sync the latest group state.",showConfirmMemberNote:!1})}function Kw(e,t){const{identity:n,groups:r}=_(),o=r[t],s=n?.pubkey===e,i=o?.admins.includes(e)??!1,a=Us(e,o?.members??[],t),c=vn(e),l=o?.memberNames?.[e],u=o?.livenessCheckins?.[e];let d="Never checked in";if(u){const g=Math.floor(Date.now()/1e3)-u;g<60?d="Active now":g<3600?d=`${Math.floor(g/60)}m ago`:d=`${Math.floor(g/3600)}h ago`}const f=[s?'<span class="member-detail__badge">You</span>':"",i?'<span class="member-detail__badge member-detail__badge--admin">Admin</span>':""].filter(Boolean).join(" "),p=c?.display_name||c?.name,h=(g,E)=>`<div class="member-detail__row"><span class="member-detail__label">${g}</span><span class="member-detail__value">${j(E)}</span></div>`,m=[h("Pubkey",`${e.slice(0,16)}…${e.slice(-8)}`)];p&&m.push(h("Nostr name",p)),c?.nip05&&m.push(h("NIP-05",c.nip05)),c?.about&&m.push(h("About",c.about.length>80?c.about.slice(0,80)+"…":c.about)),c?.lud16&&m.push(h("Lightning",c.lud16)),c?.website&&m.push(h("Website",c.website)),l&&l!=="You"&&l!==p&&m.push(h("Display name",l)),m.push(h("Liveness",d)),c||m.push('<div class="member-detail__row"><span class="member-detail__label" style="color: var(--text-muted); font-style: italic;">No Nostr profile found on relay</span></div>');const y=c?.picture?`<img class="member-detail__avatar" src="${j(c.picture)}" alt="" />`:"";Hi(`
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
  `,()=>{}),requestAnimationFrame(()=>{document.getElementById("member-detail-copy")?.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(e);const g=document.getElementById("member-detail-copy");g.textContent="Copied!",setTimeout(()=>{g.textContent="Copy Pubkey"},1500)}catch{}}),document.getElementById("modal-cancel-btn")?.addEventListener("click",()=>{document.getElementById("app-modal")?.close()})})}function Pd(e){const{groups:t,activeGroupId:n}=_();if(!n){e.innerHTML="";return}const r=t[n];if(!r){e.innerHTML="";return}const{identity:o}=_(),s=!!o?.pubkey&&r.admins.includes(o.pubkey);Od(r.members,n);const i=r.members.length>0?r.members.map(a=>{const c=Vw(a,r.members,r.livenessCheckins??{},r.livenessInterval),l=vn(a),u=l?.picture?`<img src="${j(l.picture)}" alt="" style="width:24px;height:24px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid ${c};box-shadow:0 0 6px ${c}80;" />`:`<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${c};flex-shrink:0;box-shadow:0 0 6px ${c}80;"></span>`;return`
          <li class="member-item" data-pubkey="${j(a)}">
            ${u}
            <button class="member-item__name-btn" data-pubkey="${j(a)}" type="button">${j(Us(a,r.members,n))}</button>
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
  `,e.querySelectorAll(".member-item__name-btn").forEach(a=>{a.addEventListener("click",()=>{const c=a.dataset.pubkey;c&&Kw(c,n)})}),e.querySelector(".member-list")?.addEventListener("click",a=>{const c=a.target.closest(".member-item__remove");if(!c)return;const l=c.dataset.pubkey;if(!l)return;const{groups:u}=_(),d=u[n]?.members??[];if(!confirm(`Remove ${Us(l,d,n)} from the group?

This rotates the group secret immediately. Remaining members must re-join using a fresh invite.`))return;const{activeGroupId:f}=_();if(!f)return;Mv(f,l);const{groups:p}=_(),h=p[f];h&&h.members.length>0&&Ds(h)}),e.querySelector("#invite-btn")?.addEventListener("click",()=>{const{groups:a,activeGroupId:c}=_();if(!c)return;const l=a[c];l&&Po(l)}),e.querySelector("#share-state-btn")?.addEventListener("click",()=>{const{groups:a,activeGroupId:c}=_();if(!c)return;const l=a[c];l&&Ds(l)}),e.querySelector("#confirm-member-btn")?.addEventListener("click",()=>{Ud()})}function fc(e,t,n){const{groups:r,identity:o}=_(),s=r[e];if(!s||!o?.pubkey||!s.admins.includes(o.pubkey))return!1;s.members.includes(t)||Bs(e,t,n);const i=_().groups[e];return i&&n&&J(e,{memberNames:{...i.memberNames,[t]:n}}),!0}function Ud(e){const{groups:t,activeGroupId:n}=_();!n||!t[n]||(Hi(`
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
  `,o=>{try{const s=o.get("ackToken")?.trim(),i=o.get("word")?.trim().toLowerCase(),a=o.get("memberName")?.trim(),{activeGroupId:c}=_();if(!c)throw new Error("No active group.");const{groups:l}=_(),u=l[c];if(!u)throw new Error("Group not found.");if(s){const d=s.includes("#ack/")?decodeURIComponent(s.split("#ack/")[1]):s,f=bw(d,{groupId:c,groupSeed:u.seed,counter:u.counter+(u.usageOffset??0),context:"canary:group",encoding:Bt(u),tolerance:u.tolerance??1});if(!f.valid)throw new Error(f.error??"Invalid join token.");if(!fc(c,f.pubkey,f.displayName||a||""))throw new Error("Member could not be added — they may already be in the group or you are not an admin.");q(`${f.displayName||"Member"} has joined the group`,"success")}else if(i){if(!a)throw new Error("Please enter the member name.");const d=u.counter+(u.usageOffset??0),f=rt(u.seed,Lt,d,Bt(u)).toLowerCase();if(i!==f)throw new Error("Word does not match — the member may not have the current group key.");const p=new Uint8Array(32);crypto.getRandomValues(p);const h=Array.from(p,m=>m.toString(16).padStart(2,"0")).join("");if(!fc(c,h,a))throw new Error("Member could not be added — you may not be an admin of this group.");q(`${a} has joined the group`,"success")}else throw new Error("Provide either an ack token or a verification word.")}catch(s){throw alert(s instanceof Error?s.message:"Confirmation failed."),s}}),requestAnimationFrame(()=>{document.getElementById("modal-cancel-btn")?.addEventListener("click",()=>{document.getElementById("app-modal")?.close()})}))}const Ww=Object.freeze(Object.defineProperty({__proto__:null,renderMembers:Pd,showConfirmMemberModal:Ud,showInviteModal:Po,showShareStateModal:Ds},Symbol.toStringTag,{value:"Module"})),js="0123456789bcdefghjkmnpqrstuvwxyz",Wi={};for(let e=0;e<js.length;e++)Wi[js[e]]=e;function zw(e){for(const t of e)if(!(t in Wi))throw new TypeError(`Invalid geohash character: '${t}' in "${e}"`)}function zi(e,t,n=5){if(!Number.isFinite(e)||e<-90||e>90)throw new RangeError(`Invalid latitude: ${e}`);if(!Number.isFinite(t)||t<-180||t>180)throw new RangeError(`Invalid longitude: ${t}`);if(!Number.isFinite(n))throw new RangeError(`Invalid precision: ${n}`);if(n=Math.round(n),n<1)throw new RangeError(`Invalid precision: ${n}`);n=Math.min(12,n);let r=-90,o=90,s=-180,i=180,a="",c=0,l=0,u=!0;for(;a.length<n;){if(u){const d=(s+i)/2;t>=d?(l|=1<<4-c,s=d):i=d}else{const d=(r+o)/2;e>=d?(l|=1<<4-c,r=d):o=d}u=!u,c++,c===5&&(a+=js[l],c=0,l=0)}return a}function Dd(e){if(e.length===0)throw new TypeError("Cannot decode an empty geohash");const t=Jw(e);return{lat:(t.minLat+t.maxLat)/2,lon:(t.minLon+t.maxLon)/2,error:{lat:(t.maxLat-t.minLat)/2,lon:(t.maxLon-t.minLon)/2}}}function Jw(e){zw(e);let t=-90,n=90,r=-180,o=180,s=!0;for(const i of e){const a=Wi[i];for(let c=4;c>=0;c--){if(s){const l=(r+o)/2;a>>c&1?r=l:o=l}else{const l=(t+n)/2;a>>c&1?t=l:n=l}s=!s}}return{minLat:t,maxLat:n,minLon:r,maxLon:o}}const Yw=[0,25e5,63e4,78e3,2e4,2400,610,76,19,2.4];function Ji(e){if(!Number.isFinite(e))throw new RangeError(`Invalid precision: ${e}`);const t=Math.max(1,Math.min(9,Math.round(e)));return Yw[t]}let Z=null,qe=null,Ne={},ue={},nr={},be=null,wn=new Set,rr=!1,qs=null;const Zw=[{label:"City",value:4,hint:"~20 km"},{label:"Neighbourhood",value:5,hint:"~2.4 km"},{label:"Street",value:6,hint:"~610 m"},{label:"Exact",value:9,hint:"~2 m"}],pc=6371e3;function Xw(e,t,n,r=48){const o=[];for(let s=0;s<=r;s++){const i=s/r*2*Math.PI,a=n/pc*Math.cos(i)*(180/Math.PI),c=n/(pc*Math.cos(e*Math.PI/180))*Math.sin(i)*(180/Math.PI);o.push([t+c,e+a])}return o}const hc=[210,140,30,280,60,330,170,0];function _r(e){const{groups:t,activeGroupId:n}=_(),s=((n?t[n]:null)?.members??[]).indexOf(e);return hc[(s>=0?s:0)%hc.length]}function Yi(e){if(wn.has(e))return"#f87171";const{groups:t,activeGroupId:n}=_(),r=n?t[n]:null;if(!r)return`hsl(${_r(e)}, 70%, 55%)`;const o=r.livenessCheckins[e]??0;if(o===0)return`hsl(${_r(e)}, 20%, 50%)`;const s=Math.floor(Date.now()/1e3)-o,i=r.livenessInterval;return s<=i?`hsl(${_r(e)}, 70%, 55%)`:s<=i*1.25?`hsl(${_r(e)}, 40%, 50%)`:"#94a3b8"}function jd(){return{type:"FeatureCollection",features:Object.entries(ue).map(([e,t])=>({type:"Feature",properties:{pubkey:e,duress:wn.has(e),colour:Yi(e)},geometry:{type:"Polygon",coordinates:[Xw(t.lat,t.lon,Ji(t.precision))]}}))}}const qd="5.19.0",Qw=`https://unpkg.com/maplibre-gl@${qd}/dist/maplibre-gl.js`,e0=`https://unpkg.com/maplibre-gl@${qd}/dist/maplibre-gl.css`,t0="sha384-pEfbADcwebVj4NNOvWFLUkm+FiGTICE5bChpV647czG7OpSqcHNgxM8QawfAkbRO",n0="sha384-MGCxhspF/+ufueUgol3FDkiAYQbpSNRhBT0VWHJt64U8qIy9qlnXWx8LAbj6niPH";async function r0(){if(qe)return qe;try{const[t]=await Promise.all([ie(()=>import("./maplibre-gl-DFGd9893.js").then(n=>n.m),[],import.meta.url),ie(()=>Promise.resolve({}),__vite__mapDeps([0]),import.meta.url)]);return qe=t,t}catch{}const e=document.createElement("link");return e.rel="stylesheet",e.href=e0,e.integrity=n0,e.crossOrigin="anonymous",document.head.appendChild(e),await new Promise((t,n)=>{const r=document.createElement("script");r.src=Qw,r.integrity=t0,r.crossOrigin="anonymous",r.onload=()=>t(),r.onerror=n,document.head.appendChild(r)}),qe=window.maplibregl,qe}async function Hd(e){const{groups:t,activeGroupId:n}=_();if(!n||!t[n]){Z&&(Z.remove(),Z=null,rr=!1),e.innerHTML="";return}const r=t[n],o=r.beaconPrecision??5;if(qs!==n){ue={},nr={},wn.clear();for(const[s,i]of Object.entries(Ne))i.remove(),delete Ne[s];if(qs=n,r.lastPositions)for(const[s,i]of Object.entries(r.lastPositions))ue[s]=i}if(Z&&document.getElementById("beacon-map")){En();for(const[s,i]of Object.entries(ue))or(s,i.lat,i.lon);fn(),Object.keys(ue).length>0&&dn();return}queueMicrotask(()=>fn()),e.innerHTML=`
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
          ${Zw.map(s=>`<button class="segmented__btn ${o===s.value?"segmented__btn--active":""}" data-beacon-precision="${s.value}" title="${s.hint}">${s.label}</button>`).join("")}
        </div>
        <p class="settings-hint">How precisely your location is shared in routine check-ins</p>
      </div>
      <p class="settings-hint" style="margin-top: 0.5rem; color: var(--duress);">Emergency signals always share your exact GPS so your group can find you.</p>
      <div class="beacon-list" id="beacon-list"></div>
    </section>
  `,e.querySelectorAll("[data-beacon-precision]").forEach(s=>{s.addEventListener("click",()=>{const i=Number(s.dataset.beaconPrecision),{activeGroupId:a}=_();a&&(J(a,{beaconPrecision:i}),be!==null&&(mc(),Hs()),e.querySelectorAll("[data-beacon-precision]").forEach(c=>{c.classList.toggle("segmented__btn--active",Number(c.dataset.beaconPrecision)===i)}))})}),e.querySelector("#beacon-toggle-btn")?.addEventListener("click",()=>{be!==null?mc():Hs(),Hd(e)}),e.querySelector("#beacon-fit-btn")?.addEventListener("click",()=>{dn()});try{await r0(),o0()}catch{e.querySelector(".beacon-map").innerHTML='<p style="color: var(--text-muted); text-align: center; padding: 2rem;">Map unavailable offline</p>'}}function o0(){const e=document.getElementById("beacon-map");if(!e||Z||!qe)return;const n=document.documentElement.dataset.theme!=="light"?"https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json":"https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";Z=new qe.Map({container:e,style:n,center:[-.1278,51.5074],zoom:12}),Z.on("load",()=>{rr=!0,console.info("[canary:beacon] map loaded, positions to catch up:",Object.keys(ue).length),Z.addSource("geohash-circles",{type:"geojson",data:jd()}),Z.addLayer({id:"geohash-fill",type:"fill",source:"geohash-circles",paint:{"fill-color":["get","colour"],"fill-opacity":["case",["get","duress"],.35,.2]}}),Z.addLayer({id:"geohash-stroke",type:"line",source:"geohash-circles",paint:{"line-color":["get","colour"],"line-width":2.5,"line-opacity":["case",["get","duress"],.9,.6]}});for(const[r,o]of Object.entries(ue))or(r,o.lat,o.lon);Object.keys(ue).length>0&&dn()})}function Zi(){const{activeGroupId:e}=_();e&&J(e,{lastPositions:{...ue}})}function En(){if(!Z||!rr)return;const e=Z.getSource("geohash-circles");e&&e.setData(jd())}function mc(){be!==null&&(navigator.geolocation.clearWatch(be),be=null);const{identity:e}=_();e?.pubkey&&(delete ue[e.pubkey],delete nr[e.pubkey],Ne[e.pubkey]&&(Ne[e.pubkey].remove(),delete Ne[e.pubkey]),En(),fn())}function Hs(){if(be!==null||!("geolocation"in navigator))return;const{groups:e,activeGroupId:t,identity:n}=_();if(!t||!e[t]||!n?.pubkey)return;const r=e[t],o=fd(r.seed),s=r.beaconPrecision||5;be=navigator.geolocation.watchPosition(async i=>{const a=zi(i.coords.latitude,i.coords.longitude,s),c=Dd(a),l=c.lat,u=c.lon,d=await hd(o,a,s);n?.pubkey&&(nr[n.pubkey]=d,ue[n.pubkey]={lat:l,lon:u,geohash:a,precision:s,timestamp:Math.floor(Date.now()/1e3)},or(n.pubkey,l,u),En(),dn(),fn(),Zi(),t&&ke(t,{type:"beacon",lat:l,lon:u,accuracy:Ji(s),timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID()}))},i=>{console.warn("[canary:beacon] watchPosition error",i.code,i.message)},{enableHighAccuracy:!1,maximumAge:6e4,timeout:15e3})}function or(e,t,n){if(!Z||!qe){console.warn("[canary:beacon] updateMapMarker skipped — map not ready",{map:!!Z,maplibregl:!!qe,pubkey:e.slice(0,8)});return}const r=Yi(e),o=wn.has(e),s=Fd(e),i=vn(e),a=!!i?.picture,c=o?40:32;if(Ne[e]){Ne[e].setLngLat([n,t]);const l=Ne[e].getElement(),u=l.querySelector(".beacon-dot");u&&(a||(u.style.background=r),u.style.width=`${c}px`,u.style.height=`${c}px`,u.style.borderColor=r,u.style.boxShadow=`0 0 10px ${r}80`,u.style.animation=o?"beacon-pulse 1s ease-in-out infinite":"none");const d=l.querySelector(".beacon-label");d&&(d.textContent=s)}else{const l=document.createElement("div");l.style.display="flex",l.style.flexDirection="column",l.style.alignItems="center",l.style.pointerEvents="none";let u;a?(u=document.createElement("img"),u.src=i.picture,u.style.objectFit="cover"):(u=document.createElement("div"),u.style.background=r),u.className="beacon-dot",u.style.width=`${c}px`,u.style.height=`${c}px`,u.style.borderRadius="50%",u.style.border=`3px solid ${r}`,u.style.boxShadow=`0 0 10px ${r}80`,u.style.zIndex="2",o&&(u.style.animation="beacon-pulse 1s ease-in-out infinite"),l.appendChild(u);const d=document.createElement("div");d.className="beacon-label",d.textContent=s,d.style.fontSize="11px",d.style.fontWeight="600",d.style.color="#fff",d.style.textShadow="0 1px 3px rgba(0,0,0,0.8)",d.style.marginTop="2px",d.style.whiteSpace="nowrap",l.appendChild(d),Ne[e]=new qe.Marker({element:l,anchor:"center"}).setLngLat([n,t]).addTo(Z)}}function dn(){if(!Z)return;const e=Object.values(ue);if(e.length===0)return;if(e.length===1){Z.flyTo({center:[e[0].lon,e[0].lat],zoom:13});return}const t=e.map(r=>r.lon),n=e.map(r=>r.lat);Z.fitBounds([[Math.min(...t),Math.min(...n)],[Math.max(...t),Math.max(...n)]],{padding:60,maxZoom:14})}function Fd(e){const{groups:t,activeGroupId:n,identity:r}=_(),o=n?t[n]:null,s=r?.pubkey===e;let i;const a=o?.memberNames?.[e];return a&&a!=="You"&&(i=a),i||(i=Vi(e)),s?i?`${i} (you)`:"You":i||`${e.slice(0,8)}…`}function fn(){const e=document.getElementById("beacon-list");if(!e)return;const t=Object.entries(ue).map(([n,r])=>{const o=Yi(n),s=Fd(n),i=vn(n),a=Math.floor(Date.now()/1e3)-r.timestamp,c=a<60?"just now":a<3600?`${Math.floor(a/60)}m ago`:`${Math.floor(a/3600)}h ago`;return`
      <div class="beacon-entry" style="display:flex;align-items:center;gap:0.5rem;padding:0.25rem 0;">
        ${i?.picture?`<img src="${j(i.picture)}" alt="" style="width:20px;height:20px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid ${o};" />`:`<span style="width:8px;height:8px;border-radius:50%;background:${o};flex-shrink:0;"></span>`}
        <span class="beacon-member" style="font-weight:500;">${j(s)}</span>
        <span class="beacon-geohash" style="color:var(--text-muted);font-size:0.8rem;">${j(r.geohash)}</span>
        <span style="color:var(--text-muted);font-size:0.75rem;margin-left:auto;">${j(c)}</span>
      </div>
    `}).join("");e.innerHTML=t||'<p class="settings-hint">No beacons yet — enable location to start</p>'}document.addEventListener("canary:duress",(e=>{const{members:t}=e.detail;if(!t?.length)return;for(const r of t)wn.add(r),s0(r);En();const n=t.map(r=>ue[r]).filter(Boolean);if(Z&&n.length===1)Z.flyTo({center:[n[0].lon,n[0].lat],zoom:14});else if(Z&&n.length>1){const r=n.map(s=>s.lon),o=n.map(s=>s.lat);Z.fitBounds([[Math.min(...r),Math.min(...o)],[Math.max(...r),Math.max(...o)]],{padding:60})}}));function s0(e){const t=Ne[e];if(!t)return;const n=t.getElement();n.style.background="#f87171",n.style.width="14px",n.style.height="14px",n.style.boxShadow="0 0 12px rgba(248, 113, 113, 0.6)"}function i0(){if(console.info("[canary:beacon] sendLocationPing called",{hasGeo:"geolocation"in navigator,map:!!Z,mapReady:rr}),!("geolocation"in navigator))return;const{groups:e,activeGroupId:t,identity:n}=_();if(!t||!e[t]||!n?.pubkey){console.warn("[canary:beacon] sendLocationPing: missing state",{activeGroupId:t,hasPubkey:!!n?.pubkey});return}if(be!==null){console.info("[canary:beacon] watch already active, skipping getCurrentPosition");return}Hs();const r=e[t],o=fd(r.seed),s=r.beaconPrecision||5;navigator.geolocation.getCurrentPosition(async i=>{const a=zi(i.coords.latitude,i.coords.longitude,s),c=Dd(a),l=c.lat,u=c.lon,d=await hd(o,a,s);n?.pubkey&&(nr[n.pubkey]=d,ue[n.pubkey]={lat:l,lon:u,geohash:a,precision:s,timestamp:Math.floor(Date.now()/1e3)},or(n.pubkey,l,u),En(),dn(),fn(),Zi(),t&&ke(t,{type:"beacon",lat:l,lon:u,accuracy:Ji(s),timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID()}))},i=>{console.warn("[canary:beacon] getCurrentPosition FAILED",i.code,i.message),ie(async()=>{const{showToast:a}=await Promise.resolve().then(()=>nv);return{showToast:a}},void 0,import.meta.url).then(({showToast:a})=>{i.code===1?a("Location permission denied","error",3e3):i.code===3?a("Location request timed out","error",3e3):a("Could not get location","error",3e3)})},{enableHighAccuracy:!1,maximumAge:3e4,timeout:1e4})}function a0(e,t,n,r,o){const{groups:s,activeGroupId:i}=_(),a=i?s[i]:null;if(!a||!a.members.includes(e))return;const c=c0(r),l=zi(t,n,c);ue[e]={lat:t,lon:n,geohash:l,precision:c,timestamp:o},or(e,t,n),En(),dn(),fn(),Zi()}function c0(e){return e<=3?9:e<=20?8:e<=80?7:e<=620?6:e<=2500?5:e<=2e4?4:e<=8e4?3:e<=63e4?2:1}function l0(){be!==null&&navigator.geolocation.clearWatch(be),be=null,rr=!1,Z&&(Z.remove(),Z=null),Ne={},ue={},nr={},wn.clear(),qs=null}function u0(e){return new Date(e*1e3).toISOString().slice(11,19)+" UTC"}function d0(e,t){return e<=t?"green":e<=t*1.25?"amber":"red"}function f0(e,t){return e<60?u0(t):e<3600?`${Math.floor(e/60)}m ago`:e<86400?`${Math.floor(e/3600)}h ago`:`${Math.floor(e/86400)}d ago`}const p0=[{label:"1m",value:60},{label:"2m",value:120},{label:"5m",value:300},{label:"15m",value:900},{label:"1h",value:3600},{label:"4h",value:14400},{label:"24h",value:86400},{label:"7d",value:604800}];function h0(e){const{groups:t,activeGroupId:n,identity:r}=_();if(!n||!t[n]){e.innerHTML="";return}const o=t[n],s=Math.floor(Date.now()/1e3),i=o.livenessInterval,a=o.members.map(u=>{const d=o.livenessCheckins[u]??0,f=d>0,p=f?s-d:1/0,h=f?d0(p,i):"grey",m=f?Math.max(0,Math.min(100,(1-p/i)*100)):0,y=r?.pubkey===u,g=o.memberNames?.[u],E=y?"You":g??`${u.slice(0,8)}…`;return`
      <li class="liveness-item liveness-item--${h}">
        <span class="liveness-dot liveness-dot--${h}"></span>
        <span class="liveness-name">${j(E)}</span>
        <span class="liveness-time">${f?f0(p,d):"awaiting first check-in"}</span>
        <div class="liveness-bar">
          <div class="liveness-bar__fill liveness-bar__fill--${h}" style="width: ${m}%"></div>
        </div>
      </li>
    `}).join(""),c=r?.pubkey!=null&&o.members.includes(r.pubkey),l=p0.map(u=>`<button class="segmented__btn ${i===u.value?"segmented__btn--active":""}" data-liveness-interval="${u.value}">${u.label}</button>`).join("");e.innerHTML=`
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
  `,e.querySelectorAll("[data-liveness-interval]").forEach(u=>{u.addEventListener("click",()=>{const d=Number(u.dataset.livenessInterval);J(n,{livenessInterval:d})})}),document.getElementById("checkin-btn")?.addEventListener("click",()=>{try{const{identity:u,activeGroupId:d,groups:f}=_();if(!u?.pubkey||!d){console.warn("[canary:liveness] No identity or activeGroupId",{pubkey:u?.pubkey,gid:d});return}const p=f[d];if(!p){console.warn("[canary:liveness] Group not found",d);return}const h=Math.floor(Date.now()/1e3),m=wt(h,p.rotationInterval);pb(p.seed,"canary:liveness",u.pubkey,m);const y={...p.livenessCheckins,[u.pubkey]:h};J(d,{livenessCheckins:y}),ke(d,{type:"liveness-checkin",pubkey:u.pubkey,timestamp:h,opId:crypto.randomUUID()}),Promise.all([ie(()=>import("./push-O93_NOMB.js"),[],import.meta.url),ie(()=>Promise.resolve().then(()=>Bi),void 0,import.meta.url)]).then(([{notifyCheckin:g},{hashGroupTag:E}])=>{g(E(d))}).catch(()=>{}),i0(),setTimeout(()=>{document.getElementById("beacon-container")?.scrollIntoView({behavior:"smooth",block:"center"})},300),q("Check-in sent — location updated","success",2e3)}catch(u){console.error("[canary:liveness] Check-in failed:",u),q("Check-in failed","error",3e3)}})}function yc(e){if(e.startsWith("wss://"))return!0;if(e.startsWith("ws://"))try{const t=new URL(e);return t.hostname==="localhost"||t.hostname==="127.0.0.1"||t.hostname==="[::1]"}catch{return!1}return!1}let Jt=!1;function m0(e){const{groups:t,activeGroupId:n}=_();if(!n||!t[n]){e.innerHTML="";return}const r=t[n],{identity:o}=_(),s=!!o?.pubkey&&r.admins.includes(o.pubkey);e.innerHTML=`
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
  `,document.getElementById("settings-toggle").addEventListener("click",()=>{Jt=!Jt;const a=document.getElementById("settings-body"),c=e.querySelector(".settings-chevron");a.hidden=!Jt,c.style.transform=Jt?"rotate(90deg)":""}),document.getElementById("settings-name").addEventListener("change",a=>{const c=a.target.value.trim();c&&J(n,{name:c})}),e.querySelectorAll("[data-interval]").forEach(a=>{a.addEventListener("click",()=>{J(n,{rotationInterval:Number(a.dataset.interval)})})}),e.querySelectorAll("[data-words]").forEach(a=>{a.addEventListener("click",()=>{J(n,{wordCount:Number(a.dataset.words)})})}),e.querySelectorAll("[data-enc]").forEach(a=>{a.addEventListener("click",()=>{J(n,{encodingFormat:a.dataset.enc})})}),e.querySelectorAll("[data-tolerance]").forEach(a=>{a.addEventListener("click",()=>{J(n,{tolerance:Number(a.dataset.tolerance)})})}),e.querySelectorAll("[data-duress-mode]").forEach(a=>{a.addEventListener("click",()=>{J(n,{duressMode:a.dataset.duressMode})})}),document.getElementById("nostr-toggle").addEventListener("change",a=>{const c=a.target.checked;J(n,{nostrEnabled:c});const l=document.getElementById("nostr-settings");if(l.hidden=!c,c){const u=_().groups[n],d=u?.readRelays??[],f=u?.writeRelays??[];Oe(d,f,n).then(()=>{bc()}),gc()}else un(),ed(),Wn(!1,0),bc()});function i(){const a=_().groups[n];a?.nostrEnabled&&Oe(a.readRelays??[],a.writeRelays??[],n)}e.querySelectorAll(".write-relay-remove").forEach(a=>{a.addEventListener("click",()=>{const c=Number(a.dataset.relayIndex),l=[..._().groups[n]?.writeRelays??[]];l.splice(c,1),J(n,{writeRelays:l}),i()})}),e.querySelectorAll(".read-relay-remove").forEach(a=>{a.addEventListener("click",()=>{const c=Number(a.dataset.relayIndex),l=[..._().groups[n]?.readRelays??[]];l.splice(c,1),J(n,{readRelays:l}),i()})}),document.getElementById("write-relay-add-btn").addEventListener("click",()=>{const a=document.getElementById("write-relay-add-input"),c=a.value.trim();if(!yc(c)){a.focus();return}const l=[..._().groups[n]?.writeRelays??[]];l.includes(c)?a.value="":(l.push(c),J(n,{writeRelays:l}),a.value="",i())}),document.getElementById("read-relay-add-btn").addEventListener("click",()=>{const a=document.getElementById("read-relay-add-input"),c=a.value.trim();if(!yc(c)){a.focus();return}const l=[..._().groups[n]?.readRelays??[]];l.includes(c)?a.value="":(l.push(c),J(n,{readRelays:l}),a.value="",i())}),document.getElementById("write-relay-add-input").addEventListener("keydown",a=>{a.key==="Enter"&&document.getElementById("write-relay-add-btn").click()}),document.getElementById("read-relay-add-input").addEventListener("keydown",a=>{a.key==="Enter"&&document.getElementById("read-relay-add-btn").click()}),r.nostrEnabled&&gc(),document.getElementById("reseed-btn")?.addEventListener("click",()=>{const{groups:a}=_(),c=a[n],u=(c?Zn(c)==="online":!1)?"Rotate the group key? This broadcasts the new key to all members via the relay.":"Rotate the group key? Remaining members will need to re-sync via Share State.";confirm(u)&&($v(n),q("Key rotated. New verification words are active.","warning",6e3))}),document.getElementById("compromise-reseed-btn")?.addEventListener("click",()=>{confirm("Compromise reseed? This generates a new key WITHOUT broadcasting. All members will need new invites.")&&(Ov(n),q("Emergency reseed complete. No broadcast sent — share new invites with all members.","warning",8e3))}),document.getElementById("dissolve-btn").addEventListener("click",()=>{confirm(`Dissolve "${r.name}"? This cannot be undone.`)&&Lv(n)}),document.getElementById("export-btn").addEventListener("click",()=>{if(!confirm("This exports the group secret in cleartext. Treat the file like a password."))return;const a=new Blob([JSON.stringify(r,null,2)],{type:"application/json"}),c=URL.createObjectURL(a),l=document.createElement("a");l.href=c,l.download=`canary-${r.name.toLowerCase().replace(/\s+/g,"-")}.json`,l.click(),URL.revokeObjectURL(c)}),document.getElementById("import-btn").addEventListener("click",()=>{if(!confirm("Only import files from trusted sources — the file contains the group secret."))return;const a=document.createElement("input");a.type="file",a.accept=".json",a.addEventListener("change",async()=>{const c=a.files?.[0];if(c)try{const l=await c.text(),u=JSON.parse(l);Pv(u);const d=crypto.randomUUID(),f={id:d,name:String(u.name),seed:String(u.seed),members:u.members.filter(h=>typeof h=="string"),memberNames:{},nostrEnabled:!1,relays:[],wordlist:typeof u.wordlist=="string"?u.wordlist:"en-v1",wordCount:[1,2,3].includes(u.wordCount)?u.wordCount:2,counter:typeof u.counter=="number"&&u.counter>=0?u.counter:0,usageOffset:typeof u.usageOffset=="number"&&u.usageOffset>=0?u.usageOffset:0,rotationInterval:typeof u.rotationInterval=="number"&&u.rotationInterval>0?u.rotationInterval:86400,encodingFormat:["words","pin","hex"].includes(u.encodingFormat)?u.encodingFormat:"words",usedInvites:[],latestInviteIssuedAt:0,livenessInterval:typeof u.rotationInterval=="number"&&u.rotationInterval>0?u.rotationInterval:86400,livenessCheckins:{},tolerance:typeof u.tolerance=="number"&&u.tolerance>=0&&u.tolerance<=10?u.tolerance:1,beaconInterval:typeof u.beaconInterval=="number"&&u.beaconInterval>0?u.beaconInterval:60,beaconPrecision:typeof u.beaconPrecision=="number"&&u.beaconPrecision>0?u.beaconPrecision:5,duressPrecision:typeof u.duressPrecision=="number"&&u.duressPrecision>0?u.duressPrecision:9,duressMode:["immediate","dead-drop","both"].includes(u.duressMode)?u.duressMode:"immediate",createdAt:typeof u.createdAt=="number"?u.createdAt:Math.floor(Date.now()/1e3),admins:Array.isArray(u.admins)?u.admins.filter(h=>typeof h=="string"):[],epoch:typeof u.epoch=="number"&&u.epoch>=0?u.epoch:0,consumedOps:Array.isArray(u.consumedOps)?u.consumedOps.filter(h=>typeof h=="string"):[]},{groups:p}=_();X({groups:{...p,[d]:f},activeGroupId:d})}catch{alert("Could not import group file. Check the file format.")}}),a.click()})}function gc(){const e=document.getElementById("nostr-identity");if(!e)return;const{identity:t}=_();if(!t?.pubkey){e.innerHTML='<span class="settings-hint">No identity available.</span>';return}const n=`${t.pubkey.slice(0,8)}…${t.pubkey.slice(-8)}`;e.innerHTML=`
    <div class="nostr-identity-row">
      <span class="input-label">Identity (Local key)</span>
      <span class="relay-url nostr-pubkey" title="${j(t.pubkey)}">${j(n)}</span>
    </div>
    <p class="settings-hint">Your identity is stored locally on this device.</p>
  `}function bc(){const e=document.getElementById("nostr-conn-status");if(!e)return;const t=qt();e.textContent=Ft()?`Connected to ${t} relay${t===1?"":"s"}`:"Not connected"}const vc=new TextEncoder;function y0(e){const t=new Uint8Array(4);return new DataView(t.buffer).setUint32(0,e,!1),t}function Gd(){const e=new Uint8Array(32);return crypto.getRandomValues(e),e}const Yn=Object.freeze({call:Object.freeze({wordCount:1,rotationSeconds:30,tolerance:1,directional:!0,description:"Phone verification for insurance, banking, and call centres. Single word with 30-second rotation. Deepfake-proof — cloning a voice does not help derive the current word."}),handoff:Object.freeze({wordCount:1,rotationSeconds:0,tolerance:0,directional:!0,description:"Physical handoff verification for rideshare, delivery, and task completion. Single-use token per event. No time dependency — counter is the task/event ID."})});function Fs(e){const t=e.preset?Yn[e.preset]:void 0,n=e.rotationSeconds??t?.rotationSeconds??30,r=e.tolerance??t?.tolerance??0,o=t?.wordCount??1,s=e.encoding??{format:"words",count:o};if(!e.namespace)throw new Error("namespace must be a non-empty string");if(e.namespace.includes("\0"))throw new Error("namespace must not contain null bytes");if(!e.roles[0]||!e.roles[1])throw new Error("Both roles must be non-empty strings");if(e.roles[0].includes("\0")||e.roles[1].includes("\0"))throw new Error("Roles must not contain null bytes");if(e.roles[0]===e.roles[1])throw new Error(`Roles must be distinct, got ["${e.roles[0]}", "${e.roles[1]}"]`);if(e.myRole!==e.roles[0]&&e.myRole!==e.roles[1])throw new Error(`myRole "${e.myRole}" is not one of the configured roles ["${e.roles[0]}", "${e.roles[1]}"]`);if(!Number.isInteger(n)||n<0)throw new RangeError(`rotationSeconds must be a non-negative integer, got ${n}`);if(!Number.isInteger(r)||r<0)throw new RangeError(`tolerance must be a non-negative integer, got ${r}`);if(r>Zr)throw new RangeError(`tolerance must be <= ${Zr}, got ${r}`);if(n===0&&e.counter===void 0)throw new Error("Fixed counter mode (rotationSeconds=0) requires config.counter");if(n===0&&e.counter!==void 0&&(!Number.isInteger(e.counter)||e.counter<0||e.counter>4294967295))throw new RangeError(`counter must be an integer 0–${4294967295}, got ${e.counter}`);if(n>0&&e.counter!==void 0)throw new Error("counter must not be set when rotationSeconds > 0 (counter is derived from time)");const i=typeof e.secret=="string"?F(e.secret):e.secret,a=e.roles[0]===e.myRole?e.roles[1]:e.roles[0],c=`pair:${e.namespace}:${a}`,l=n===0;function u(d){if(l){if(e.counter===void 0)throw new Error("Fixed counter mode (rotationSeconds=0) requires config.counter");return e.counter}const f=d??Math.floor(Date.now()/1e3);return Math.floor(f/n)}return{counter:u,myToken(d){return Sn(i,e.namespace,e.roles,u(d),s)[e.myRole]},theirToken(d){return Sn(i,e.namespace,e.roles,u(d),s)[a]},verify(d,f){const p=d.toLowerCase().trim().replace(/\s+/g," "),h=u(f),m=Math.max(0,h-r),y=Math.min(4294967295,h+r);let g=!1;for(let C=m;C<=y;C++){const $=Sn(i,e.namespace,e.roles,C,s);Qt(p,$[a])&&(g=!0)}const E=[];if(e.theirIdentity){const C=new Set,$=2*r,L=Math.max(0,h-$),O=Math.min(4294967295,h+$);for(let w=L;w<=O;w++){const v=Sn(i,e.namespace,e.roles,w,s);C.add(v[a])}for(let w=m;w<=y;w++){const v=$e(vc.encode(c+":duress"),new Uint8Array([0]),vc.encode(e.theirIdentity),y0(w));let b=Le(i,v),x=Ut(b,s),S=1;for(;C.has(x)&&S<=255;)b=Le(i,$e(v,new Uint8Array([S]))),x=Ut(b,s),S++;Qt(p,x)&&E.push(e.theirIdentity)}}return E.length>0?{status:"duress",identities:E}:g?{status:"valid"}:{status:"invalid"}},pair(d){return Sn(i,e.namespace,e.roles,u(d),s)}}}const On={insurance:{label:"Insurance",namespace:"aviva",roles:["caller","agent"],preset:"call"},pickup:{label:"Pickup",namespace:"family",roles:["child","adult"],preset:"handoff"},rideshare:{label:"Rideshare",namespace:"dispatch",roles:["requester","driver"],preset:"handoff",encoding:"pin"}};let Xi=Gd(),ee=On.insurance,Zt,Or,Mr=null,Qi=1;function Gs(){const e=ee.preset==="handoff",t=ee.encoding==="pin"?{format:"pin",digits:4}:void 0,n={secret:Xi,namespace:ee.namespace,roles:ee.roles,preset:ee.preset,...e?{counter:Qi}:{},...t?{encoding:t}:{}};Zt=Fs({...n,myRole:ee.roles[0],theirIdentity:ee.roles[1]}),Or=Fs({...n,myRole:ee.roles[1],theirIdentity:ee.roles[0]})}Gs();function xr(e,t){const n=ee.preset==="handoff",r=Yn[ee.preset],o=n?Qi:Math.floor((t??Math.floor(Date.now()/1e3))/r.rotationSeconds),s=`pair:${ee.namespace}:${e}`,i=ee.encoding==="pin"?{format:"pin",digits:4}:{format:"words",count:1};return Ao(Xi,s,e,o,i,r.tolerance)}function Br(){Mr!==null&&(clearInterval(Mr),Mr=null)}function Sr(e){if(e<=0)return"0s";const t=Math.floor(e/60),n=Math.floor(e%60);return t>0?`${t}m ${n}s`:`${n}s`}function wc(e){if(e===0)return 0;const t=Math.floor(Date.now()/1e3),r=(Math.floor(t/e)+1)*e;return Math.max(0,r-t)}function Pr(e){Br();const t=Math.floor(Date.now()/1e3),n=ee.preset==="handoff",r=n?0:Yn[ee.preset].rotationSeconds,o=wc(r),s=r>0?Math.min(100,(r-o)/r*100):100,i=ee.roles[0],a=ee.roles[1];e.innerHTML=`
    <div class="call-sim">
      <div class="call-sim__header">
        <h2 class="call-sim__title">CANARY Call Verification Demo</h2>
        <div class="call-sim__scenarios" id="call-scenarios">
          ${Object.entries(On).map(([m,y])=>`<button class="btn call-sim__scenario-btn${ee===y?" call-sim__scenario-btn--active":""}" data-scenario="${m}">${y.label}</button>`).join("")}
        </div>
      </div>

      <div class="call-sim__panels">
        <div class="call-sim__panel call-sim__panel--caller">
          <h3 class="call-sim__role">${i.toUpperCase()}</h3>
          <div class="call-sim__token-group">
            <span class="call-sim__label">Your code — tap to reveal:</span>
            <div class="call-sim__token call-sim__token--reveal" id="caller-reveal" data-real="${Zt.myToken(t)}" data-alt="${xr(i,t)}">••••••••</div>
          </div>
          ${n?'<span class="call-sim__countdown">Single-use</span>':`
          <div class="call-sim__progress"><div class="call-sim__progress-bar" id="caller-progress" style="width: ${s}%"></div></div>
          <span class="call-sim__countdown" id="caller-countdown">${Sr(o)}</span>
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
            <div class="call-sim__token call-sim__token--reveal" id="agent-reveal" data-real="${Or.myToken(t)}" data-alt="${xr(a,t)}">••••••••</div>
          </div>
          ${n?'<span class="call-sim__countdown">Single-use</span>':`
          <div class="call-sim__progress"><div class="call-sim__progress-bar" id="agent-progress" style="width: ${s}%"></div></div>
          <span class="call-sim__countdown" id="agent-countdown">${Sr(o)}</span>
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
        <span class="call-sim__meta">Namespace: <strong>${ee.namespace}</strong></span>
        <span class="call-sim__meta">Rotation: <strong>${n?"single-use":r+"s"}</strong></span>
        <span class="call-sim__meta">Encoding: <strong>${ee.encoding??"words"}</strong></span>
        <span class="call-sim__meta">Tolerance: <strong>+/-${n?"0":Yn[ee.preset].tolerance}</strong></span>
        <button class="btn" id="call-reset-seed">Reset seed</button>
      </div>

      <div class="call-sim__pair" id="call-pair">
        <span class="call-sim__meta">Pair: <code id="pair-display"></code></span>
      </div>
    </div>
  `,e.querySelector("#call-scenarios")?.addEventListener("click",m=>{const y=m.target.closest("[data-scenario]");if(!y)return;const g=y.dataset.scenario;On[g]&&On[g]!==ee&&(ee=On[g],Gs(),Pr(e))}),e.querySelector("#call-reset-seed")?.addEventListener("click",()=>{Xi=Gd(),ee.preset==="handoff"&&Qi++,Gs(),Pr(e)});let c=!1,l=!1,u=!1;function d(){if(!u&&c&&l){Br();const m=e.querySelector("#call-verified-banner");m&&(m.hidden=!1,m.textContent="Call Verified — both parties authenticated"),e.querySelectorAll(".call-sim__progress, .call-sim__countdown").forEach(y=>{y.hidden=!0})}}function f(m,y,g,E,C){const $=e.querySelector(`#${m}`),L=e.querySelector(`#${y}`),O=e.querySelector(`#${g}`);if(!$||!L||!O)return;function w(){const v=$.value.trim();if(!v)return;const b=E.verify(v);O.hidden=!1,O.className="call-sim__result",b.status==="valid"?(O.classList.add("call-sim__result--valid"),O.textContent="Verified ✓",C==="caller"?c=!0:l=!0,d()):b.status==="duress"?(O.classList.add("call-sim__result--invalid"),O.textContent="Failed ✗",u=!0):(O.classList.add("call-sim__result--invalid"),O.textContent="Failed ✗")}L.addEventListener("click",w),$.addEventListener("keydown",v=>{v.key==="Enter"&&w()})}f("caller-verify-input","caller-verify-btn","caller-result",Zt,"caller"),f("agent-verify-input","agent-verify-btn","agent-result",Or,"agent");function p(m){const y=e.querySelector(`#${m}`);if(!y)return;function g(C){C.preventDefault();const $=y.getBoundingClientRect(),L=C.clientX-$.left;y.textContent=L<$.width/2?y.dataset.real:y.dataset.alt}function E(){y.textContent="••••••••"}y.addEventListener("pointerdown",g),y.addEventListener("pointerup",E),y.addEventListener("pointerleave",E),y.addEventListener("pointercancel",E)}p("caller-reveal"),p("agent-reveal");const h=e.querySelector("#pair-display");if(h){const m=Zt.pair(t),y=Object.entries(m).map(([g,E])=>`${g}: ${E}`).join(" | ");h.textContent=y}!n&&r>0&&(Mr=setInterval(()=>{const m=wc(r),y=Math.min(100,(r-m)/r*100),g=e.querySelector("#caller-progress"),E=e.querySelector("#agent-progress"),C=e.querySelector("#caller-countdown"),$=e.querySelector("#agent-countdown"),L=Math.max(0,100-y),O=L>50?`hsl(${Math.round(120*(L/100))}, 70%, 45%)`:`hsl(${Math.round(120*(L/100))}, 80%, 45%)`;g&&(g.style.width=`${y}%`,g.style.background=O),E&&(E.style.width=`${y}%`,E.style.background=O),C&&(C.textContent=Sr(m)),$&&($.textContent=Sr(m));const w=Math.floor(Date.now()/1e3),v=e.querySelector("#caller-reveal"),b=e.querySelector("#agent-reveal"),x=Zt.myToken(w),S=v&&v.dataset.real!==x;if(v&&(v.dataset.real=x,v.dataset.alt=xr(i,w)),b&&(b.dataset.real=Or.myToken(w),b.dataset.alt=xr(a,w)),S){c=!1,l=!1,u=!1;const k=e.querySelector("#caller-result"),R=e.querySelector("#agent-result");k&&(k.hidden=!0,k.className="call-sim__result"),R&&(R.hidden=!0,R.className="call-sim__result");const I=e.querySelector("#caller-verify-input"),N=e.querySelector("#agent-verify-input");I&&(I.value=""),N&&(N.value="");const T=e.querySelector("#call-verified-banner");T&&(T.hidden=!0),e.querySelectorAll(".call-sim__progress, .call-sim__countdown").forEach(M=>{M.hidden=!1})}const A=e.querySelector("#pair-display");if(A){const k=Zt.pair(),R=Object.entries(k).map(([I,N])=>`${I}: ${N}`).join(" | ");A.textContent=R}m===0&&(Br(),Pr(e))},1e3))}function g0(){Br()}let St=null;function b0(e,t){const n=_().groups[t];if(!n)return e.slice(0,8);const{identity:r}=_();if(r?.pubkey===e)return"You";const o=n.memberNames?.[e];return o||`${e.slice(0,8)}…${e.slice(-4)}`}function v0(e,t){St&&(St(),St=null),document.querySelector(".call-verify")?.remove();const{groups:n,identity:r}=_(),o=n[e];if(!o||!r)return;const s=r.pubkey,i=b0(t,e),a=vn(t),c=s<t?[s,t]:[t,s],l=Fs({secret:o.seed,namespace:"canary:call",roles:c,myRole:s,preset:"call"}),u=Yn.call.rotationSeconds,d=Math.floor(Date.now()/1e3),f=l.myToken(d),p=l.theirToken(d),h=document.createElement("div");h.className="call-verify",h.innerHTML=`
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
        <span class="call-verify__word call-verify__word--theirs" id="cv-word-theirs">${j(p)}</span>
      </div>

      <p class="call-verify__timer">Words change in <span id="cv-countdown">${u}</span>s</p>

      <p class="call-verify__instruction" style="margin-top: 1.5rem; font-size: 0.75rem;">In a real call, if they say the wrong word, it could be an emergency signal. A production app would automatically check and silently alert the group.</p>
      <div class="call-verify__actions">
        <button class="btn btn--primary call-verify__btn" id="cv-match">Match</button>
        <button class="btn call-verify__btn call-verify__btn--danger" id="cv-mismatch">Wrong Word</button>
        <button class="btn call-verify__btn" id="cv-close">Close</button>
      </div>
    </div>
  `;let m=null;function y(){const $=Math.floor(Date.now()/1e3),L=h.querySelector("#cv-word-mine"),O=h.querySelector("#cv-word-theirs"),w=h.querySelector("#cv-countdown");if(L&&(L.textContent=l.myToken($)),O&&(O.textContent=l.theirToken($)),w){const v=$%u;w.textContent=String(u-v)}}m=setInterval(y,1e3);function g(){m!==null&&(clearInterval(m),m=null)}function E(){St&&(St(),St=null),h.classList.remove("call-verify--visible"),setTimeout(()=>h.remove(),300)}function C($){$.key==="Escape"&&E()}St=()=>{g(),document.removeEventListener("keydown",C)},document.body.appendChild(h),requestAnimationFrame(()=>h.classList.add("call-verify--visible")),document.addEventListener("keydown",C),h.querySelector("#cv-match")?.addEventListener("click",()=>{g(),h.innerHTML=`
      <div class="call-verify__content">
        <h2 class="call-verify__title" style="color: var(--clr-success, #27ae60);">Call Verified</h2>
        <p class="call-verify__warning" style="color: var(--text-secondary);">${j(i)} is who they say they are. The call is authenticated.</p>
        <div class="call-verify__actions">
          <button class="btn btn--primary call-verify__btn" id="cv-dismiss-ok">Done</button>
        </div>
      </div>
    `,h.querySelector("#cv-dismiss-ok")?.addEventListener("click",E)}),h.querySelector("#cv-close")?.addEventListener("click",E),h.querySelector("#cv-mismatch")?.addEventListener("click",()=>{g(),h.innerHTML=`
      <div class="call-verify__content">
        <h2 class="call-verify__title" style="color: var(--clr-danger, #e74c3c);">Verification Failed</h2>
        <p class="call-verify__warning">The word didn't match. This person may not be who they claim to be.</p>
        <div class="call-verify__actions">
          <button class="btn call-verify__btn" id="cv-dismiss-fail">Dismiss</button>
        </div>
      </div>
    `,h.querySelector("#cv-dismiss-fail")?.addEventListener("click",E)})}const Uo=30078,Do="canary:vault",Vd=2160*60*60;function ea(e){const t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function Kd(e){const t={};for(const[r,o]of Object.entries(e)){const{lastPositions:s,...i}=o;t[r]={...i,livenessCheckins:{}}}return JSON.stringify({version:1,groups:t})}function io(e){try{const t=JSON.parse(e);return!t||typeof t!="object"||typeof t.groups!="object"||t.groups===null?{}:t.groups}catch{return{}}}function w0(e,t,n){const r=ea(t),o=Ee(r,n);return Dt(e,o)}function Ec(e,t,n){try{const r=ea(t),o=Ee(r,n);return jt(e,o)}catch{return null}}function E0(e,t){const n=ea(t),r=Math.floor(Date.now()/1e3),o={kind:Uo,created_at:r,tags:[["d",Do],["expiration",String(r+Vd)]],content:e};return it(o,n)}async function ta(e,t,n){const r=ae();if(!r)throw new Error("No relay pool — connect first");const o=Di();if(o.length===0)throw new Error("No write relays configured");const s=Kd(e),i=w0(s,t,n),a=E0(i,t);console.info(`[canary:vault] Publishing vault (${Object.keys(e).length} groups) to`,o),document.dispatchEvent(new CustomEvent("canary:vault-syncing"));const c=await Promise.allSettled(r.publish(o,a)),l=c.filter(d=>d.status==="fulfilled").length,u=c.filter(d=>d.status==="rejected").length;console.info(`[canary:vault] Publish results: ${l} OK, ${u} failed`),u>0&&c.forEach((d,f)=>{d.status==="rejected"&&console.warn(`[canary:vault] Relay ${o[f]} rejected:`,d.reason)}),document.dispatchEvent(new CustomEvent("canary:vault-synced",{detail:{timestamp:Math.floor(Date.now()/1e3)}}))}async function Wd(e,t){const n=ae();if(!n)return console.warn("[canary:vault] fetchVault: no pool"),null;const r=Ui();return r.length===0?(console.warn("[canary:vault] fetchVault: no read relays"),null):(console.info("[canary:vault] Fetching vault from",r,"for",t.slice(0,8)),new Promise(o=>{let s=!1,i=null;const a=setTimeout(()=>{if(!s){if(s=!0,c.close(),console.warn("[canary:vault] fetchVault timed out after 10s"),i){const l=Ec(i.content,e,t);if(l){o(io(l));return}}o(null)}},1e4),c=n.subscribeMany(r,{kinds:[Uo],authors:[t],"#d":[Do],limit:1},{onevent(l){at(l)&&(typeof l.content=="string"&&l.content.length>262144||(console.info(`[canary:vault] Received vault event created_at=${l.created_at}`),(!i||l.created_at>i.created_at)&&(i=l)))},oneose(){if(!s){if(s=!0,clearTimeout(a),c.close(),i){console.info("[canary:vault] EOSE — decrypting vault event");const l=Ec(i.content,e,t);if(l){o(io(l));return}console.warn("[canary:vault] Vault decryption failed")}else console.info("[canary:vault] EOSE — no vault event found");o(null)}}})}))}function zd(){return!!window.nostr?.nip44?.encrypt&&!!window.nostr?.nip44?.decrypt}async function na(e,t){const n=ae();if(!n)throw new Error("No relay pool — connect first");if(!zd())throw new Error("NIP-07 extension does not support NIP-44");const r=Di();if(r.length===0)throw new Error("No write relays configured");const o=Kd(e),s=await window.nostr.nip44.encrypt(t,o),i=Math.floor(Date.now()/1e3),a={kind:Uo,created_at:i,tags:[["d",Do],["expiration",String(i+Vd)]],content:s},c=await window.nostr.signEvent(a);console.info(`[canary:vault] Publishing vault via NIP-07 (${Object.keys(e).length} groups) to`,r),document.dispatchEvent(new CustomEvent("canary:vault-syncing"));const l=await Promise.allSettled(n.publish(r,c)),u=l.filter(f=>f.status==="fulfilled").length,d=l.filter(f=>f.status==="rejected").length;console.info(`[canary:vault] NIP-07 publish results: ${u} OK, ${d} failed`),document.dispatchEvent(new CustomEvent("canary:vault-synced",{detail:{timestamp:i}}))}async function Jd(e){const t=ae();if(!t)return console.warn("[canary:vault] fetchVaultNip07: no pool"),null;if(!zd())return console.warn("[canary:vault] fetchVaultNip07: extension lacks NIP-44"),null;const n=Ui();return n.length===0?(console.warn("[canary:vault] fetchVaultNip07: no read relays"),null):(console.info("[canary:vault] Fetching vault via NIP-07 from",n,"for",e.slice(0,8)),new Promise(r=>{let o=!1,s=null;const i=setTimeout(async()=>{if(!o)if(o=!0,a.close(),console.warn("[canary:vault] fetchVaultNip07 timed out after 10s"),s)try{const c=await window.nostr.nip44.decrypt(e,s.content);r(io(c))}catch{r(null)}else r(null)},1e4),a=t.subscribeMany(n,{kinds:[Uo],authors:[e],"#d":[Do],limit:1},{onevent(c){at(c)&&(typeof c.content=="string"&&c.content.length>262144||(console.info(`[canary:vault] NIP-07 received vault event created_at=${c.created_at}`),(!s||c.created_at>s.created_at)&&(s=c)))},async oneose(){if(!o)if(o=!0,clearTimeout(i),a.close(),s){console.info("[canary:vault] NIP-07 EOSE — decrypting vault event");try{const c=await window.nostr.nip44.decrypt(e,s.content);r(io(c))}catch(c){console.warn("[canary:vault] NIP-07 vault decryption failed:",c),r(null)}}else console.info("[canary:vault] NIP-07 EOSE — no vault event found"),r(null)}})}))}function Vs(e,t){const n={...e};for(const[r,o]of Object.entries(t)){const s=e[r];if(!s){n[r]=o;continue}const i=s.epoch??0,a=o.epoch??0;if(a>i)n[r]=o;else if(a===i){const c=s.counter??0;(o.counter??0)>c&&(n[r]=o)}}return n}function k0(e){if(e.startsWith("wss://"))return!0;if(e.startsWith("ws://"))try{const t=new URL(e);return t.hostname==="localhost"||t.hostname==="127.0.0.1"||t.hostname==="[::1]"}catch{return!1}return!1}function Ks(e,t){return t?.pubkey===e.pubkey&&t.mnemonic?{...e,mnemonic:t.mnemonic}:e}function Yd(e,t){return e?typeof t.epoch=="number"&&t.epoch<e.epoch?"This invite is older than the group state already stored on this device.":typeof t.latestInviteIssuedAt=="number"&&e.latestInviteIssuedAt>0&&t.latestInviteIssuedAt<e.latestInviteIssuedAt?"A newer invite has already been accepted for this group on this device.":typeof t.epoch=="number"&&t.epoch===e.epoch&&typeof t.counter=="number"&&t.counter<e.counter?"This invite would roll the group back to an older counter.":null:null}Jg();const _0=Vg();_0.theme==="light"?document.documentElement.setAttribute("data-theme","light"):document.documentElement.removeAttribute("data-theme");let $t=null;function qn(){$t!==null&&(clearTimeout($t),$t=null);const{settings:e}=_();!e.pinEnabled||e.autoLockMinutes<=0||!Ru()||($t=setTimeout(async()=>{await yn(),So(),cf(),ra()},e.autoLockMinutes*60*1e3))}function Zd(){document.addEventListener("pointerdown",qn,{passive:!0}),document.addEventListener("keydown",qn,{passive:!0}),qn()}function Xd(){document.removeEventListener("pointerdown",qn),document.removeEventListener("keydown",qn),$t!==null&&(clearTimeout($t),$t=null)}function ra(){Xd(),un();const e=document.getElementById("app");e.innerHTML=`
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
  `;const t=document.getElementById("pin-input"),n=document.getElementById("pin-error"),r=document.getElementById("pin-submit");let o=0;const s=[0,1e3,2e3,5e3,15e3,3e4];async function i(){const a=t.value.trim();if(a.length<6){n.textContent="PIN must be at least 6 digits.",n.hidden=!1,t.focus();return}r.disabled=!0,r.textContent="Unlocking…",n.hidden=!0;try{await Kg(a),await A0(),Qd();const c=document.getElementById("header");c&&ji(c),ef(),sa(),Ur(oa),Zd(),tf(),ao(),window.addEventListener("hashchange",()=>ao()),co()}catch{o++;const c=s[Math.min(o,s.length-1)];n.textContent=c>0?`Incorrect PIN. Wait ${c/1e3}s before retrying.`:"Incorrect PIN. Try again.",n.hidden=!1,t.value="",r.disabled=!0,r.textContent="Unlock",c>0?setTimeout(()=>{r.disabled=!1,t.focus()},c):(r.disabled=!1,t.focus())}}r.addEventListener("click",()=>{i()}),t.addEventListener("keydown",a=>{a.key==="Enter"&&i()}),requestAnimationFrame(()=>t.focus())}function Qd(){const e=document.getElementById("app");if(!e)throw new Error("Missing #app mount point");e.innerHTML=`
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

    <footer class="app-footer" id="app-footer">
      <button class="app-footer__sync" id="footer-sync-btn">Sync Groups</button>
      <span class="app-footer__sep">&middot;</span>
      <span class="app-footer__version">CANARY v1.1.0</span>
    </footer>
  `}function ef(){const e=document.getElementById("hamburger"),t=document.getElementById("sidebar"),n=document.getElementById("sidebar-overlay");if(!e||!t||!n)return;function r(){t.classList.add("sidebar--open"),n.classList.add("sidebar-overlay--visible"),e.setAttribute("aria-expanded","true")}function o(){t.classList.remove("sidebar--open"),n.classList.remove("sidebar-overlay--visible"),e.setAttribute("aria-expanded","false")}e.setAttribute("aria-expanded","false"),e.addEventListener("click",()=>{t.classList.contains("sidebar--open")?o():r()}),n.addEventListener("click",()=>{o()}),t.addEventListener("click",s=>{s.target.closest("[data-group-id]")&&o()})}let ds=!1;function oa(){ds||(ds=!0,requestAnimationFrame(()=>{ds=!1,sa()}))}function sa(){const{view:e}=_(),t=document.getElementById("groups-view"),n=document.getElementById("call-demo-view");t&&(t.hidden=e!=="groups"),n&&(n.hidden=e!=="call-demo");const r=document.getElementById("header");if(r&&ji(r),e==="groups"){g0();const o=document.getElementById("welcome-container");o&&Uv(o);const s=document.getElementById("sidebar");s&&kv(s);const i=document.getElementById("hero-container");i&&yd(i);const a=document.getElementById("verify-container");a&&Zv(a);const c=document.getElementById("members-container");c&&Pd(c);const l=_().groups[_().activeGroupId??""],u=l?Zn(l)==="online":!1,d=document.getElementById("beacon-container");d&&(u?(d.hidden=!1,Hd(d)):(l0(),d.hidden=!0,d.innerHTML=""));const f=document.getElementById("liveness-container");f&&(u?(f.hidden=!1,h0(f)):(f.hidden=!0,f.innerHTML=""));const p=document.getElementById("settings-container");p&&m0(p)}else if(e==="call-demo"){const o=document.getElementById("call-simulation-container");o&&Pr(o)}}function x0(){const{identity:e}=_(),t=e?.displayName&&e.displayName!=="You"?e.displayName:"";Hi(`
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
  `,r=>{const o=r.get("name")?.trim()??"";if(!o)return;const s=t||r.get("myname")?.trim()||"",a=document.querySelector(".segmented__btn.segmented__btn--active[data-preset]")?.dataset.preset??"family",c=Nv(o,a,e?.pubkey);if(s&&e?.pubkey){const u=_().groups[c];u&&J(c,{memberNames:{...u.memberNames,[e.pubkey]:s}})}const l=_().groups[c];l&&Zn(l)==="online"&&sf(l).length>0&&Oe(l.readRelays??[],l.writeRelays??[],c),pn(),ie(async()=>{const{shouldPromptForNotifications:u,shouldPromptAddToHomeScreen:d,isMacSafari:f,subscribeToPush:p,registerWithPushServer:h}=await import("./push-O93_NOMB.js");return{shouldPromptForNotifications:u,shouldPromptAddToHomeScreen:d,isMacSafari:f,subscribeToPush:p,registerWithPushServer:h}},[],import.meta.url).then(({shouldPromptForNotifications:u,shouldPromptAddToHomeScreen:d,isMacSafari:f,subscribeToPush:p,registerWithPushServer:h})=>{if(d()){setTimeout(()=>{$0()},1500);return}if(f()&&!("Notification"in window)){console.info("[canary:push] Mac Safari without notification support — skipping prompt");return}u()&&setTimeout(()=>{L0(async()=>{try{const m=await p();if(!m){console.warn("[canary:push] subscribeToPush returned null — permission denied or unavailable");return}const{hashGroupTag:y}=await ie(async()=>{const{hashGroupTag:C}=await Promise.resolve().then(()=>Bi);return{hashGroupTag:C}},void 0,import.meta.url),{groups:g}=_(),E=Object.values(g).map(C=>({tagHash:y(C.id),livenessInterval:C.livenessInterval}));await h(m,E),console.info("[canary:push] Registered with push server, groups:",E.length),q("Notifications enabled","success")}catch(m){console.error("[canary:push] Registration failed:",m),q("Failed to enable notifications","error")}})},1500)}).catch(u=>console.error("[canary:push] Import failed:",u))}),requestAnimationFrame(()=>{document.getElementById("modal-cancel-btn")?.addEventListener("click",()=>{document.getElementById("app-modal")?.close()}),document.querySelectorAll(".segmented__btn[data-preset]").forEach(r=>{r.addEventListener("click",()=>{document.querySelectorAll(".segmented__btn[data-preset]").forEach(o=>o.classList.remove("segmented__btn--active")),r.classList.add("segmented__btn--active")})})})}function ao(){const e=window.location.hash;if(e.startsWith("#ack/")){let t;try{t=decodeURIComponent(e.slice(5))}catch{console.warn("[canary] Malformed ack fragment — ignoring."),window.location.hash="";return}window.location.hash="",document.dispatchEvent(new CustomEvent("canary:confirm-member",{detail:{token:t}}))}else if(e.startsWith("#inv/")){const t=e.slice(5);window.location.hash="",S0(t)}else if(e.startsWith("#j/")){const t=e.slice(3);window.location.hash="",/^[0-9a-f]{32}$/.test(t)?I0(t):q("Invalid invite link.","error")}else if(e.startsWith("#remote/")){let t=e.slice(8);try{t=decodeURIComponent(t)}catch{}window.location.hash="",R0(t)}}function S0(e){try{const t=ew(e),n=Sw(t),{identity:r}=_();if(!r?.pubkey){q("No local identity — create or import one first.","error");return}let o=document.getElementById("binary-join-modal");o||(o=document.createElement("dialog"),o.id="binary-join-modal",o.className="modal",document.body.appendChild(o),o.addEventListener("click",i=>{i.target===o&&o.close()}));const s=o;s.innerHTML=`
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
    `,s.querySelector("#binary-join-cancel")?.addEventListener("click",()=>s.close()),s.querySelector("#binary-join-accept")?.addEventListener("click",()=>{const i=s.querySelector("#binary-join-confirm"),a=s.querySelector("#binary-join-error"),c=i?.value.trim()??"";if(!c){a&&(a.textContent="Please enter the confirmation words.",a.style.display="");return}try{const l=vd(n),u=pw(l,c);if(hw(u.groupId,u.nonce))throw new Error("This invite has already been used.");const d=u.groupId,{groups:f}=_(),p=Yd(f[d],{epoch:u.epoch,counter:u.counter,latestInviteIssuedAt:u.issuedAt});if(p)throw new Error(p);const h=new Set(u.members);h.add(r.pubkey);const m=_().settings,y=u.relays.length>0?u.relays:m.defaultWriteRelays?.length?[...m.defaultWriteRelays]:[Ge],g=Array.from(new Set([...m.defaultReadRelays?.length?m.defaultReadRelays:ot,...y])),E=y.length>0,C={id:d,name:u.groupName,seed:u.seed,members:Array.from(h),memberNames:u.memberNames??{},nostrEnabled:E,relays:u.relays,readRelays:g,writeRelays:y,wordlist:u.wordlist,wordCount:u.wordCount,counter:u.counter,usageOffset:u.usageOffset,rotationInterval:u.rotationInterval,encodingFormat:u.encodingFormat,usedInvites:[u.nonce],latestInviteIssuedAt:u.issuedAt,beaconInterval:u.beaconInterval,beaconPrecision:u.beaconPrecision,duressMode:"immediate",livenessInterval:u.rotationInterval,livenessCheckins:{},tolerance:u.tolerance,createdAt:Math.floor(Date.now()/1e3),admins:[...u.admins],epoch:u.epoch,consumedOps:[]},$={...f,[d]:C};X({groups:$,activeGroupId:d}),mw(d,u.nonce),yn(),pn(),E&&r&&Oe(g,y,d).then(()=>{ke(d,{type:"member-join",pubkey:r.pubkey,displayName:r.displayName&&r.displayName!=="You"?r.displayName:void 0,timestamp:Math.floor(Date.now()/1e3),epoch:u.epoch,opId:crypto.randomUUID()})}),s.close(),q(`Joined ${u.groupName}`,"success")}catch(l){a&&(a.textContent=l instanceof Error?l.message:"Failed to join group.",a.style.display="")}}),s.showModal()}catch(t){q(t instanceof Error?t.message:"Invalid QR invite.","error")}}function Ws(e,t,n){const{identity:r}=_();if(!r?.pubkey||!r?.privkey)return;const o=ow({envelope:e,joinerPrivkey:r.privkey,adminPubkey:t.adminPubkey,expectedInviteId:t.inviteId}),s=o.groupId,{groups:i}=_(),a=Yd(i[s],{epoch:o.epoch,counter:o.counter});if(a)throw new Error(a);const c=new Set(o.members);c.add(r.pubkey);const l={...o.memberNames??{}};r.displayName&&r.displayName!=="You"&&(l[r.pubkey]=r.displayName);const u=[...o.relays??[]],d=u.length>0?u:[Ge],f=Array.from(new Set([...ot,...d])),p=d.length>0,h={id:s,name:o.groupName,seed:o.seed,members:Array.from(c),memberNames:l,nostrEnabled:p,relays:u,readRelays:f,writeRelays:d,wordlist:o.wordlist,wordCount:o.wordCount,counter:o.counter,usageOffset:o.usageOffset,rotationInterval:o.rotationInterval,encodingFormat:o.encodingFormat,usedInvites:[],latestInviteIssuedAt:0,beaconInterval:o.beaconInterval,beaconPrecision:o.beaconPrecision,duressMode:"immediate",livenessInterval:o.rotationInterval,livenessCheckins:{},tolerance:o.tolerance,createdAt:Math.floor(Date.now()/1e3),admins:[...o.admins],epoch:o.epoch,consumedOps:[]},m={...i,[s]:h};X({groups:m,activeGroupId:s}),yn(),pn(),p&&r&&Oe(f,d,s).then(()=>{ke(s,{type:"member-join",pubkey:r.pubkey,displayName:r.displayName&&r.displayName!=="You"?r.displayName:void 0,timestamp:Math.floor(Date.now()/1e3),epoch:o.epoch,opId:crypto.randomUUID()})}),n.close(),q(`Joined ${o.groupName}`,"success")}function I0(e){const{identity:t,settings:n}=_();if(!t?.pubkey||!t?.privkey){q("No local identity — create or import one first.","error");return}const r=Array.from(new Set([...ot,...n.defaultWriteRelays??[]])),o=n.defaultWriteRelays??[Ge];let s=document.getElementById("relay-join-modal");s||(s=document.createElement("dialog"),s.id="relay-join-modal",s.className="modal",document.body.appendChild(s),s.addEventListener("click",l=>{l.target===s&&s.close()}));const i=s;i.innerHTML=`
    <div class="modal__form invite-share">
      <h2 class="modal__title">Joining...</h2>
      <p class="invite-hint" id="relay-join-status">Looking for invite on relay...</p>
      <div class="modal__actions">
        <button class="btn" id="relay-join-cancel" type="button">Cancel</button>
      </div>
    </div>
  `;let a=()=>{},c=()=>{};i.querySelector("#relay-join-cancel")?.addEventListener("click",()=>{a(),c(),i.close()}),i.showModal(),Oe(r,o).then(()=>{a=Uw({inviteId:e,readRelays:r,onToken(l){try{xd(l)}catch(h){const m=i.querySelector("#relay-join-status");m&&(m.textContent=h instanceof Error?h.message:"Invalid invite token.",m.style.color="var(--duress)");return}const u=l.relays?.length?l.relays:o,d=u,f=Array.from(new Set([...ot,...u])),p=i.querySelector("#relay-join-status");p&&(p.textContent=`Joining ${l.groupName}...`),Oe(f,d).then(()=>{c=Nd({inviteId:l.inviteId,adminPubkey:l.adminPubkey,readRelays:f,writeRelays:d,onWelcome(h){try{Ws(h,l,i)}catch{p&&(p.textContent="Failed to join — welcome message could not be decrypted.",p.style.color="var(--duress)")}},onError(h){p&&(p.textContent=h,p.style.color="var(--duress)")}})})},onError(l){const u=i.querySelector("#relay-join-status");u&&(u.textContent=l,u.style.color="var(--duress)")}})})}function R0(e){try{let t;try{t=wd(e)}catch{try{t=Bo(e)}catch{throw new Error("Invalid invite — could not decode token.")}}xd(t);const n=t,{identity:r,settings:o}=_();if(!r?.pubkey||!r?.privkey){q("No local identity — create or import one first.","error");return}const s=`${n.adminPubkey.slice(0,8)}…${n.adminPubkey.slice(-4)}`,i=n.relays?.length?n.relays:o.defaultWriteRelays,a=i,c=Array.from(new Set([...ot,...i])),l=Array.from(new Set([...c,...a]));let u=document.getElementById("remote-join-modal");u||(u=document.createElement("dialog"),u.id="remote-join-modal",u.className="modal",document.body.appendChild(u),u.addEventListener("click",p=>{p.target===u&&u.close()}));const d=u;let f=()=>{};d.innerHTML=`
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
    `,l.length>0&&Oe(c,a).then(()=>{const p=d.querySelector("#remote-join-relay-status");p&&(p.textContent="Waiting for admin to send group key..."),f=Nd({inviteId:n.inviteId,adminPubkey:n.adminPubkey,readRelays:c,writeRelays:a,onWelcome(h){try{Ws(h,n,d)}catch{p&&(p.textContent="Auto-join failed — paste welcome message manually.",p.style.color="var(--duress)")}},onError(h){p&&(p.textContent=h,p.style.color="var(--duress)")}})}),d.querySelector("#remote-join-copy-pubkey")?.addEventListener("click",async p=>{const h=p.currentTarget;try{await navigator.clipboard.writeText(r.pubkey),h.textContent="Copied!",setTimeout(()=>{h.textContent="Copy"},1500)}catch{}}),d.querySelector("#remote-join-cancel")?.addEventListener("click",()=>{f(),d.close()}),d.querySelector("#remote-join-accept")?.addEventListener("click",async()=>{const p=d.querySelector("#remote-join-welcome-input"),h=d.querySelector("#remote-join-error"),m=(p?.value??"").replace(/[^A-Za-z0-9=+/]/g,"");if(!m){h&&(h.textContent="Please paste the welcome message.",h.style.display="");return}try{f(),Ws(m,n,d)}catch(y){h&&(h.textContent=y instanceof Error?y.message:"Failed to decrypt welcome message.",h.style.display="")}}),d.showModal()}catch(t){q(t instanceof Error?t.message:"Invalid remote invite.","error")}}function tf(){document.addEventListener("canary:create-group",()=>{x0()}),document.addEventListener("canary:show-invite",e=>{const{groupId:t}=e.detail,{groups:n}=_(),r=n[t];r&&Po(r)}),document.addEventListener("canary:confirm-member",e=>{const{identity:t,groups:n,activeGroupId:r}=_();if(!r||!t?.pubkey)return;const o=n[r];if(!o||!o.admins.includes(t.pubkey))return;const s=e.detail?.token??"";ie(async()=>{const{showConfirmMemberModal:i}=await Promise.resolve().then(()=>Ww);return{showConfirmMemberModal:i}},void 0,import.meta.url).then(({showConfirmMemberModal:i})=>{i(s)})}),document.addEventListener("canary:verify-call",e=>{const{groupId:t,pubkey:n}=e.detail;v0(t,n)}),document.addEventListener("canary:pin-enable",e=>{const t=e.detail?.pin;!t||t.length<6||Yg(t).then(()=>{X({settings:{..._().settings,pinEnabled:!0}}),Zd()})}),document.addEventListener("canary:pin-disable",()=>{Zg().then(()=>{X({settings:{..._().settings,pinEnabled:!1}}),Xd()})}),document.addEventListener("canary:lock",()=>{So(),ra()}),document.addEventListener("canary:sync-message",e=>{const{groupId:t,message:n,sender:r}=e.detail,{activeGroupId:o}=_();if(n.type==="beacon"){if(t!==o)return;a0(r,n.lat,n.lon,n.accuracy??2e4,n.timestamp)}else if(n.type==="duress-alert"){const s=n.subject||r,{identity:i}=_();if(i?.pubkey===s)return;gd(s,t,n.lat!=null?{lat:n.lat,lon:n.lon}:void 0,n.timestamp)}else n.type==="duress-clear"&&document.dispatchEvent(new CustomEvent("canary:duress-clear",{detail:{subject:n.subject,clearedBy:r,groupId:t}}))}),document.addEventListener("canary:resync",()=>{co()}),document.addEventListener("canary:vault-publish-now",()=>pn()),document.addEventListener("canary:sync-vault",()=>{B0()}),document.addEventListener("visibilitychange",()=>{if(document.hidden){yn(),pn();return}console.info("[canary:boot] App foregrounded — reconnecting and syncing vault"),un(),ie(async()=>{const{disconnectRelays:e}=await Promise.resolve().then(()=>Dn);return{disconnectRelays:e}},void 0,import.meta.url).then(({disconnectRelays:e})=>{e(),co()})})}async function A0(){let{identity:e}=_();const t=await $b({pubkey:e?.pubkey??"",privkey:e?.privkey}),n={pubkey:t.pubkey,privkey:t.privkey,displayName:e?.displayName??"You",signerType:"local"};(!e||e.pubkey!==n.pubkey)&&X({identity:Ks(n,e)})}async function co(){const{groups:e,identity:t,settings:n}=_(),r=Object.keys(e).length,o=!!t?.privkey,s=[],i=[];for(const d of Object.values(e))s.push(...d.readRelays??[]),i.push(...d.writeRelays??[]),s.push(...d.relays??[]),i.push(...d.relays??[]);s.push(...n.defaultReadRelays??n.defaultRelays),i.push(...n.defaultWriteRelays??n.defaultRelays);const a=Se(s),c=Se(i),l=Se([...a,...c]).length;if(l===0){console.warn("[canary:boot] No relays found — sync disabled"),r>0&&q(`Sync disabled — ${r} group(s), no relays configured`,"warning",5e3);return}if(!o&&t?.signerType!=="nip07"){console.warn("[canary:boot] No privkey and no NIP-07 — sync disabled"),q("Sync disabled — no private key","warning",5e3);return}if(console.warn("[canary:boot] Read relays:",a,"Write relays:",c),o){await Oe(a,c);const{waitForConnection:d}=await ie(async()=>{const{waitForConnection:f}=await Promise.resolve().then(()=>Dn);return{waitForConnection:f}},void 0,import.meta.url);await d(),console.info("[canary:vault] Relay connections ready, fetching vault...");try{const f=await Wd(t.privkey,t.pubkey);if(console.info("[canary:vault] Vault fetch result:",f?`${Object.keys(f).length} group(s)`:"null"),f&&Object.keys(f).length>0){const{groups:p}=_(),h=Vs(p,f),m=Object.keys(p).sort().join(","),y=Object.keys(h).sort().join(",");if(m!==y||Object.entries(h).some(([E,C])=>{const $=p[E];return $?C.epoch!==$.epoch||C.counter!==$.counter||C.usageOffset!==$.usageOffset||C.members.length!==$.members.length:!0})){X({groups:h});const E=Object.keys(h).length-Object.keys(p).length;E>0?q(`Restored ${E} group(s) from vault`,"success"):q("Synced from vault","success",1500)}}}catch(f){console.warn("[canary:vault] Vault fetch failed:",f)}uv(),q(`Syncing via ${l} relay(s)`,"success",2e3),typeof Notification<"u"&&Notification.permission==="granted"&&ie(()=>import("./push-O93_NOMB.js"),[],import.meta.url).then(async({getExistingSubscription:f,registerWithPushServer:p})=>{const h=await f();if(h){const{hashGroupTag:m}=await ie(async()=>{const{hashGroupTag:g}=await Promise.resolve().then(()=>Bi);return{hashGroupTag:g}},void 0,import.meta.url),y=Object.values(e).map(g=>({tagHash:m(g.id),livenessInterval:g.livenessInterval}));await p(h,y),console.info("[canary:push] Re-registered with push server, groups:",y.length)}else console.warn("[canary:push] Permission granted but no existing subscription found")}).catch(f=>console.error("[canary:push] Re-registration failed:",f))}else if(t?.signerType==="nip07"){const{connectRelays:d,waitForConnection:f}=await ie(async()=>{const{connectRelays:p,waitForConnection:h}=await Promise.resolve().then(()=>Dn);return{connectRelays:p,waitForConnection:h}},void 0,import.meta.url);d(a,c);try{await f(),console.info("[canary:vault] NIP-07 vault sync starting...");const p=await Jd(t.pubkey);if(console.info("[canary:vault] NIP-07 vault result:",p?`${Object.keys(p).length} group(s)`:"null"),p&&Object.keys(p).length>0){const{groups:h}=_(),m=Vs(h,p);if(Object.keys(m).length!==Object.keys(h).length||Object.entries(m).some(([g,E])=>{const C=h[g];return C?E.epoch!==C.epoch||E.counter!==C.counter:!0})){X({groups:m});const g=Object.keys(m).length-Object.keys(h).length;g>0?q(`Restored ${g} group(s) from vault`,"success"):q("Synced from vault","success",1500)}}}catch(p){console.warn("[canary:vault] NIP-07 vault sync failed:",p)}q(`Connected to ${l} relay(s)`,"success",2e3)}else{const{connectRelays:d}=await ie(async()=>{const{connectRelays:f}=await Promise.resolve().then(()=>Dn);return{connectRelays:f}},void 0,import.meta.url);d(a,c),q(`Connected to ${l} relay(s)`,"success",2e3)}const{fetchOwnProfile:u}=await ie(async()=>{const{fetchOwnProfile:d}=await Promise.resolve().then(()=>Bd);return{fetchOwnProfile:d}},void 0,import.meta.url);if(u(),oa(),o){const{startLivenessHeartbeat:d}=await ie(async()=>{const{startLivenessHeartbeat:f}=await Promise.resolve().then(()=>sv);return{startLivenessHeartbeat:f}},void 0,import.meta.url);d()}}function C0(e){return Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}function T0(e){const t=e.split(" ");let n=document.getElementById("recovery-phrase-modal");n||(n=document.createElement("dialog"),n.id="recovery-phrase-modal",n.className="modal",document.body.appendChild(n));const r=n;r.textContent="";const o=document.createElement("div");o.className="modal__form",o.style.maxWidth="420px";const s=document.createElement("h2");s.className="modal__title",s.textContent="Back up your recovery phrase",o.appendChild(s);const i=document.createElement("p");i.className="invite-hint",i.textContent="Write these words down in order. They're the only way to recover your account.",o.appendChild(i);const a=document.createElement("div");a.className="recovery-grid",a.style.cssText="display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin:1rem 0;",t.forEach((f,p)=>{const h=document.createElement("div");h.style.cssText="border:1px solid var(--border);border-radius:4px;padding:0.5rem;text-align:center;font-family:var(--font-mono,monospace);font-size:0.8rem;";const m=document.createElement("span");m.style.cssText="color:var(--text-muted);font-size:0.7rem;",m.textContent=`${p+1}. `;const y=document.createElement("span");y.style.fontWeight="500",y.textContent=f,h.append(m,y),a.appendChild(h)}),o.appendChild(a);const c=document.createElement("p");c.className="invite-hint",c.style.cssText="color:var(--duress);font-weight:500;",c.textContent="Do not share these words with anyone.",o.appendChild(c);const l=document.createElement("div");l.className="modal__actions",l.style.gap="0.5rem";const u=document.createElement("button");u.id="recovery-phrase-copy",u.className="btn btn--primary",u.type="button",u.textContent="Copy words",u.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(e),u.textContent="Copied!",setTimeout(()=>{u.textContent="Copy words"},2e3),setTimeout(()=>{navigator.clipboard.writeText("").catch(()=>{})},3e4)}catch{}});const d=document.createElement("button");d.id="recovery-phrase-skip",d.className="btn",d.type="button",d.textContent="Skip for now",d.addEventListener("click",()=>r.close()),l.append(u,d),o.appendChild(l),r.appendChild(o),r.showModal()}function N0(){const e=document.getElementById("app");e.innerHTML=`
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
              <p class="settings-hint" style="font-size: 0.7rem; margin: 0.5rem 0 0 0;">Read relays: ${ot.map(r=>j(r.replace("wss://",""))).join(", ")} + write relay(s)</p>
            </div>
          </details>
        </div>

      </div>
    </div>
  `,e.querySelector("#offline-form")?.addEventListener("submit",async r=>{r.preventDefault();const o=e.querySelector("#offline-name"),s=o?.value.trim();if(!s){o?.focus();return}const{generateMnemonic:i,mnemonicToKeypair:a}=await ie(async()=>{const{generateMnemonic:f,mnemonicToKeypair:p}=await Promise.resolve().then(()=>Oa);return{generateMnemonic:f,mnemonicToKeypair:p}},void 0,import.meta.url),c=i(),{pubkey:l,privkey:u}=a(c);X({identity:{pubkey:l,privkey:u,mnemonic:c,signerType:"local",displayName:s}}),await Mn();const{publishKind0:d}=await ie(async()=>{const{publishKind0:f}=await Promise.resolve().then(()=>Bd);return{publishKind0:f}},void 0,import.meta.url);d(s,u),T0(c)}),e.querySelector("#mnemonic-login-form")?.addEventListener("submit",async r=>{r.preventDefault();const s=e.querySelector("#login-mnemonic")?.value.trim();if(!s)return;if(s.split(/\s+/).length!==12){alert("Recovery phrase must be exactly 12 words.");return}try{const{validateMnemonic:a,mnemonicToKeypair:c}=await ie(async()=>{const{validateMnemonic:d,mnemonicToKeypair:f}=await Promise.resolve().then(()=>Oa);return{validateMnemonic:d,mnemonicToKeypair:f}},void 0,import.meta.url);if(!a(s)){alert("Invalid recovery phrase. Please check your words and try again.");return}const{pubkey:l,privkey:u}=c(s);X({identity:{pubkey:l,privkey:u,mnemonic:s,signerType:"local",displayName:"You"}}),await Mn()}catch{alert("Invalid recovery phrase.")}}),e.querySelector("#nsec-login-form")?.addEventListener("submit",async r=>{r.preventDefault();const s=e.querySelector("#login-nsec")?.value.trim();if(s)try{const i=_().identity,a=id(s);if(a.type!=="nsec"){alert("Not a valid nsec.");return}const c=a.data,l=C0(c),u=No(c);X({identity:Ks({pubkey:u,privkey:l,signerType:"local",displayName:"You"},i)}),await Mn()}catch(i){alert(i instanceof Error?i.message:"Invalid nsec format.")}}),e.querySelector("#login-nip07")?.addEventListener("click",async()=>{if(!Ju()){alert("No Nostr extension found. Install Alby, nos2x, or another NIP-07 extension and reload.");return}try{const r=_().identity,o=await window.nostr.getPublicKey();X({identity:Ks({pubkey:o,signerType:"nip07",displayName:"You"},r)}),await Mn()}catch{alert("Extension rejected the request.")}});function t(){const r=e.querySelector("#login-relay-list");if(!r)return;const o=_().settings.defaultWriteRelays??_().settings.defaultRelays;r.innerHTML=o.map((s,i)=>`
      <li style="display: flex; align-items: center; gap: 0.25rem; margin-bottom: 0.25rem;">
        <span class="settings-hint" style="flex: 1; font-size: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0;">${j(s)}</span>
        <button class="btn btn--ghost btn--sm login-relay-remove" data-relay-index="${i}" type="button" style="padding: 0 0.25rem; font-size: 0.7rem;">✕</button>
      </li>
    `).join(""),n()}function n(){e.querySelectorAll(".login-relay-remove").forEach(r=>{r.addEventListener("click",()=>{const o=Number(r.dataset.relayIndex),s=[..._().settings.defaultWriteRelays??_().settings.defaultRelays];s.splice(o,1),X({settings:{..._().settings,defaultWriteRelays:s,defaultRelays:s}}),t()})})}n(),e.querySelector("#login-relay-add")?.addEventListener("click",()=>{const r=e.querySelector("#login-relay-input"),o=r?.value.trim();if(!o||!k0(o))return;const s=[..._().settings.defaultWriteRelays??_().settings.defaultRelays];s.includes(o)||(s.push(o),X({settings:{..._().settings,defaultWriteRelays:s,defaultRelays:s}}),t()),r&&(r.value="")}),e.querySelector("#login-relay-input")?.addEventListener("keydown",r=>{r.key==="Enter"&&(r.preventDefault(),e.querySelector("#login-relay-add")?.click())})}async function Mn(){Qd(),window.location.hash==="#call"&&X({view:"call-demo"});const e=document.getElementById("header");e&&ji(e),ef(),document.getElementById("footer-sync-btn")?.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("canary:sync-vault"))}),sa(),Ur(oa),Ur(M0),tf(),ao(),window.addEventListener("hashchange",()=>ao()),co()}function L0(e){const t=document.getElementById("notification-prompt");t&&t.remove();const n=document.createElement("div");n.id="notification-prompt",n.className="notification-prompt";const r=document.createElement("div");r.className="notification-prompt__text";const o=document.createElement("strong");o.textContent="Enable notifications?";const s=document.createElement("span");s.textContent="We’ll alert you in emergencies and remind you to check in.",r.append(o,s);const i=document.createElement("div");i.className="notification-prompt__actions";const a=document.createElement("button");a.className="btn btn--sm btn--primary",a.textContent="Enable";const c=document.createElement("button");c.className="btn btn--sm",c.textContent="Not now",i.append(a,c),n.append(r,i),document.getElementById("app")?.appendChild(n),a.addEventListener("click",()=>{n.remove(),e()}),c.addEventListener("click",()=>n.remove())}function $0(){const e=document.getElementById("notification-prompt");e&&e.remove();const t=document.createElement("div");t.id="notification-prompt",t.className="notification-prompt";const n=document.createElement("div");n.className="notification-prompt__text";const r=document.createElement("strong");r.textContent="Add to Home Screen";const o=document.createElement("span");o.textContent='To receive emergency alerts and liveness reminders, add CANARY to your home screen. Tap the share button, then "Add to Home Screen".',n.append(r,o);const s=document.createElement("div");s.className="notification-prompt__actions";const i=document.createElement("button");i.className="btn btn--sm",i.textContent="Got it",s.append(i),t.append(n,s),document.getElementById("app")?.appendChild(t),i.addEventListener("click",()=>t.remove())}let on=null;const O0=3e4;function M0(){const{identity:e,groups:t}=_();e?.pubkey&&(!e.privkey&&e.signerType!=="nip07"||Object.keys(t).length!==0&&(on&&clearTimeout(on),on=setTimeout(()=>{const{identity:n,groups:r}=_();!n?.pubkey||Object.keys(r).length===0||(n.privkey?ta(r,n.privkey,n.pubkey):n.signerType==="nip07"&&na(r,n.pubkey))},O0)))}function pn(){on&&clearTimeout(on);const{identity:e,groups:t}=_();if(!e?.pubkey||Object.keys(t).length===0)return;(e.privkey?ta(t,e.privkey,e.pubkey):e.signerType==="nip07"?na(t,e.pubkey):null)?.then(()=>console.info("[canary:vault] Vault published OK")).catch(r=>{console.error("[canary:vault] Vault publish FAILED:",r),q(`Vault publish failed: ${r instanceof Error?r.message:r}`,"error")})}async function B0(){const{identity:e,groups:t}=_();if(!e?.pubkey){q("No identity — cannot sync","error");return}if(!e.privkey&&e.signerType!=="nip07"){q("No private key or extension — cannot sync","error");return}const n=!e.privkey&&e.signerType==="nip07",r=e.pubkey.slice(0,8);q(`Syncing as ${r}…${n?" (NIP-07)":""}`,"info",3e3),console.info(`[canary:vault] Manual sync for pubkey ${r} (${n?"NIP-07":"local key"})`);try{Object.keys(t).length>0&&(n?await na(t,e.pubkey):await ta(t,e.privkey,e.pubkey));const{waitForConnection:o}=await ie(async()=>{const{waitForConnection:i}=await Promise.resolve().then(()=>Dn);return{waitForConnection:i}},void 0,import.meta.url);await o();const s=n?await Jd(e.pubkey):await Wd(e.privkey,e.pubkey);if(s&&Object.keys(s).length>0){const{groups:i}=_(),a=Vs(i,s),c=Object.keys(a).length-Object.keys(i).length;X({groups:a}),yn(),c>0?q(`Synced — ${c} new group(s) restored`,"success"):q("Groups are in sync","success",2e3)}else q(`No vault found for ${r}… — are both devices using the same identity?`,"warning",5e3)}catch(o){console.error("[canary:vault] Manual sync failed:",o),q(`Sync failed: ${o instanceof Error?o.message:o}`,"error")}}window.addEventListener("pagehide",()=>{on&&pn()});async function kc(){if(Ru())ra();else{Wg();const{identity:e}=_();e?.pubkey?await Mn():N0()}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{kc()}):kc();
