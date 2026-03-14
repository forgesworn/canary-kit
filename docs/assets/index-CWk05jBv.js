const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./maplibre-gl-DwUhsmFz.css"])))=>i.map(i=>d[i]);
(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();const xu="modulepreload",Su=function(e,t){return new URL(e,t).href},Fi={},Te=function(t,n,r){let o=Promise.resolve();if(n&&n.length>0){let l=function(d){return Promise.all(d.map(u=>Promise.resolve(u).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};const a=document.getElementsByTagName("link"),i=document.querySelector("meta[property=csp-nonce]"),c=i?.nonce||i?.getAttribute("nonce");o=l(n.map(d=>{if(d=Su(d,r),d in Fi)return;Fi[d]=!0;const u=d.endsWith(".css"),f=u?'[rel="stylesheet"]':"";if(r)for(let p=a.length-1;p>=0;p--){const m=a[p];if(m.href===d&&(!u||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${f}`))return;const h=document.createElement("link");if(h.rel=u?"stylesheet":xu,u||(h.as="script"),h.crossOrigin="",h.href=d,c&&h.setAttribute("nonce",c),document.head.appendChild(h),u)return new Promise((p,m)=>{h.addEventListener("load",p),h.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${d}`)))})}))}function s(a){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=a,window.dispatchEvent(i),!i.defaultPrevented)throw a}return o.then(a=>{for(const i of a||[])i.status==="rejected"&&s(i.reason);return t().catch(s)})},et=["wss://relay.damus.io","wss://nos.lol","wss://relay.nostr.band"],qe="wss://relay.trotters.cc";function On(e){return e.readRelays?.length>0||e.writeRelays?.length>0||e.relays?.length>0?"online":"offline"}function Iu(e){try{const t=new URL(e);return t.pathname=t.pathname.replace(/\/+$/,""),t.toString()}catch{return e.replace(/\/+$/,"")}}function ke(e){const t=new Set,n=[];for(const r of e){const o=Iu(r);t.has(o)||(t.add(o),n.push(o))}return n}function Ru(e){return ke([...e.readRelays??[],...e.writeRelays??[],...e.relays??[]])}const Au={view:"groups",groups:{},activeGroupId:null,identity:null,settings:{theme:"dark",pinEnabled:!1,autoLockMinutes:5,defaultRelays:[qe],defaultReadRelays:[...et,qe],defaultWriteRelays:[qe]}};let ft=structuredClone(Au);const Jo=new Set;function Ts(){for(const e of Jo)try{e()}catch(t){console.error("[canary:state] subscriber threw:",t)}}function _(){return ft}function ee(e){ft={...ft,...e},Ts()}function J(e,t){const n=ft.groups[e];if(!n){console.warn(`[canary:state] updateGroup: unknown group id "${e}"`);return}ft={...ft,groups:{...ft.groups,[e]:{...n,...t}}},Ts()}function Er(e){return Jo.add(e),()=>{Jo.delete(e)}}function oc(e){ft=e,Ts()}const Cu=6e5,Tu=16,Yo=12;async function sc(e,t){const n=await crypto.subtle.importKey("raw",new TextEncoder().encode(e),"PBKDF2",!1,["deriveKey"]);return crypto.subtle.deriveKey({name:"PBKDF2",salt:t,iterations:Cu,hash:"SHA-256"},n,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}async function ic(e,t){const n=crypto.getRandomValues(new Uint8Array(Yo)),r=await crypto.subtle.encrypt({name:"AES-GCM",iv:n},t,new TextEncoder().encode(e)),o=new Uint8Array(n.length+new Uint8Array(r).length);o.set(n),o.set(new Uint8Array(r),n.length);let s="";for(let a=0;a<o.length;a++)s+=String.fromCharCode(o[a]);return btoa(s)}async function Fr(e,t){const n=Uint8Array.from(atob(e),a=>a.charCodeAt(0)),r=n.slice(0,Yo),o=n.slice(Yo),s=await crypto.subtle.decrypt({name:"AES-GCM",iv:r},t,o);return new TextDecoder().decode(s)}function Lu(){return crypto.getRandomValues(new Uint8Array(Tu))}function Nu(e){return btoa(String.fromCharCode(...e))}function ac(e){return Uint8Array.from(atob(e),t=>t.charCodeAt(0))}function Ls(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array"}function xe(e,t=""){if(!Number.isSafeInteger(e)||e<0){const n=t&&`"${t}" `;throw new Error(`${n}expected integer >= 0, got ${e}`)}}function F(e,t,n=""){const r=Ls(e),o=e?.length,s=t!==void 0;if(!r||s&&o!==t){const a=n&&`"${n}" `,i=s?` of length ${t}`:"",c=r?`length=${o}`:`type=${typeof e}`;throw new Error(a+"expected Uint8Array"+i+", got "+c)}return e}function Bn(e){if(typeof e!="function"||typeof e.create!="function")throw new Error("Hash must wrapped by utils.createHasher");xe(e.outputLen),xe(e.blockLen)}function kr(e,t=!0){if(e.destroyed)throw new Error("Hash instance has been destroyed");if(t&&e.finished)throw new Error("Hash#digest() has already been called")}function $u(e,t){F(e,void 0,"digestInto() output");const n=t.outputLen;if(e.length<n)throw new Error('"digestInto() output" expected to be of length >='+n)}function He(...e){for(let t=0;t<e.length;t++)e[t].fill(0)}function Nt(e){return new DataView(e.buffer,e.byteOffset,e.byteLength)}function Me(e,t){return e<<32-t|e>>>t}function Gn(e,t){return e<<t|e>>>32-t>>>0}const cc=typeof Uint8Array.from([]).toHex=="function"&&typeof Uint8Array.fromHex=="function",Mu=Array.from({length:256},(e,t)=>t.toString(16).padStart(2,"0"));function q(e){if(F(e),cc)return e.toHex();let t="";for(let n=0;n<e.length;n++)t+=Mu[e[n]];return t}const We={_0:48,_9:57,A:65,F:70,a:97,f:102};function Gi(e){if(e>=We._0&&e<=We._9)return e-We._0;if(e>=We.A&&e<=We.F)return e-(We.A-10);if(e>=We.a&&e<=We.f)return e-(We.a-10)}function z(e){if(typeof e!="string")throw new Error("hex string expected, got "+typeof e);if(cc)return Uint8Array.fromHex(e);const t=e.length,n=t/2;if(t%2)throw new Error("hex string expected, got unpadded hex of length "+t);const r=new Uint8Array(n);for(let o=0,s=0;o<n;o++,s+=2){const a=Gi(e.charCodeAt(s)),i=Gi(e.charCodeAt(s+1));if(a===void 0||i===void 0){const c=e[s]+e[s+1];throw new Error('hex string expected, got non-hex character "'+c+'" at index '+s)}r[o]=a*16+i}return r}function Ou(e){if(typeof e!="string")throw new Error("string expected");return new Uint8Array(new TextEncoder().encode(e))}function Ki(e,t=""){return typeof e=="string"?Ou(e):F(e,void 0,t)}function oe(...e){let t=0;for(let r=0;r<e.length;r++){const o=e[r];F(o),t+=o.length}const n=new Uint8Array(t);for(let r=0,o=0;r<e.length;r++){const s=e[r];n.set(s,o),o+=s.length}return n}function Bu(e,t){if(t!==void 0&&{}.toString.call(t)!=="[object Object]")throw new Error("options must be object or undefined");return Object.assign(e,t)}function Ns(e,t={}){const n=(o,s)=>e(s).update(o).digest(),r=e(void 0);return n.outputLen=r.outputLen,n.blockLen=r.blockLen,n.create=o=>e(o),Object.assign(n,t),Object.freeze(n)}function wt(e=32){const t=typeof globalThis=="object"?globalThis.crypto:null;if(typeof t?.getRandomValues!="function")throw new Error("crypto.getRandomValues must be defined");return t.getRandomValues(new Uint8Array(e))}const lc=e=>({oid:Uint8Array.from([6,9,96,134,72,1,101,3,4,2,e])});class dc{oHash;iHash;blockLen;outputLen;finished=!1;destroyed=!1;constructor(t,n){if(Bn(t),F(n,void 0,"key"),this.iHash=t.create(),typeof this.iHash.update!="function")throw new Error("Expected instance of class which extends utils.Hash");this.blockLen=this.iHash.blockLen,this.outputLen=this.iHash.outputLen;const r=this.blockLen,o=new Uint8Array(r);o.set(n.length>r?t.create().update(n).digest():n);for(let s=0;s<o.length;s++)o[s]^=54;this.iHash.update(o),this.oHash=t.create();for(let s=0;s<o.length;s++)o[s]^=106;this.oHash.update(o),He(o)}update(t){return kr(this),this.iHash.update(t),this}digestInto(t){kr(this),F(t,this.outputLen,"output"),this.finished=!0,this.iHash.digestInto(t),this.oHash.update(t),this.oHash.digestInto(t),this.destroy()}digest(){const t=new Uint8Array(this.oHash.outputLen);return this.digestInto(t),t}_cloneInto(t){t||=Object.create(Object.getPrototypeOf(this),{});const{oHash:n,iHash:r,finished:o,destroyed:s,blockLen:a,outputLen:i}=this;return t=t,t.finished=o,t.destroyed=s,t.blockLen=a,t.outputLen=i,t.oHash=n._cloneInto(t.oHash),t.iHash=r._cloneInto(t.iHash),t}clone(){return this._cloneInto()}destroy(){this.destroyed=!0,this.oHash.destroy(),this.iHash.destroy()}}const tt=(e,t,n)=>new dc(e,t).update(n).digest();tt.create=(e,t)=>new dc(e,t);function Pu(e,t,n,r){Bn(e);const o=Bu({dkLen:32,asyncTick:10},r),{c:s,dkLen:a,asyncTick:i}=o;if(xe(s,"c"),xe(a,"dkLen"),xe(i,"asyncTick"),s<1)throw new Error("iterations (c) must be >= 1");const c=Ki(t,"password"),l=Ki(n,"salt"),d=new Uint8Array(a),u=tt.create(e,c),f=u._cloneInto().update(l);return{c:s,dkLen:a,asyncTick:i,DK:d,PRF:u,PRFSalt:f}}function Uu(e,t,n,r,o){return e.destroy(),t.destroy(),r&&r.destroy(),He(o),n}function Du(e,t,n,r){const{c:o,dkLen:s,DK:a,PRF:i,PRFSalt:c}=Pu(e,t,n,r);let l;const d=new Uint8Array(4),u=Nt(d),f=new Uint8Array(i.outputLen);for(let h=1,p=0;p<s;h++,p+=i.outputLen){const m=a.subarray(p,p+i.outputLen);u.setInt32(0,h,!1),(l=c._cloneInto(l)).update(d).digestInto(f),m.set(f.subarray(0,m.length));for(let g=1;g<o;g++){i._cloneInto(l).update(f).digestInto(f);for(let b=0;b<m.length;b++)m[b]^=f[b]}}return Uu(i,c,a,l,f)}function ju(e,t,n){return e&t^~e&n}function qu(e,t,n){return e&t^e&n^t&n}class $s{blockLen;outputLen;padOffset;isLE;buffer;view;finished=!1;length=0;pos=0;destroyed=!1;constructor(t,n,r,o){this.blockLen=t,this.outputLen=n,this.padOffset=r,this.isLE=o,this.buffer=new Uint8Array(t),this.view=Nt(this.buffer)}update(t){kr(this),F(t);const{view:n,buffer:r,blockLen:o}=this,s=t.length;for(let a=0;a<s;){const i=Math.min(o-this.pos,s-a);if(i===o){const c=Nt(t);for(;o<=s-a;a+=o)this.process(c,a);continue}r.set(t.subarray(a,a+i),this.pos),this.pos+=i,a+=i,this.pos===o&&(this.process(n,0),this.pos=0)}return this.length+=t.length,this.roundClean(),this}digestInto(t){kr(this),$u(t,this),this.finished=!0;const{buffer:n,view:r,blockLen:o,isLE:s}=this;let{pos:a}=this;n[a++]=128,He(this.buffer.subarray(a)),this.padOffset>o-a&&(this.process(r,0),a=0);for(let u=a;u<o;u++)n[u]=0;r.setBigUint64(o-8,BigInt(this.length*8),s),this.process(r,0);const i=Nt(t),c=this.outputLen;if(c%4)throw new Error("_sha2: outputLen must be aligned to 32bit");const l=c/4,d=this.get();if(l>d.length)throw new Error("_sha2: outputLen bigger than state");for(let u=0;u<l;u++)i.setUint32(4*u,d[u],s)}digest(){const{buffer:t,outputLen:n}=this;this.digestInto(t);const r=t.slice(0,n);return this.destroy(),r}_cloneInto(t){t||=new this.constructor,t.set(...this.get());const{blockLen:n,buffer:r,length:o,finished:s,destroyed:a,pos:i}=this;return t.destroyed=a,t.finished=s,t.length=o,t.pos=i,o%n&&t.buffer.set(r),t}clone(){return this._cloneInto()}}const ot=Uint32Array.from([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),ce=Uint32Array.from([1779033703,4089235720,3144134277,2227873595,1013904242,4271175723,2773480762,1595750129,1359893119,2917565137,2600822924,725511199,528734635,4215389547,1541459225,327033209]),Kn=BigInt(2**32-1),Vi=BigInt(32);function Hu(e,t=!1){return t?{h:Number(e&Kn),l:Number(e>>Vi&Kn)}:{h:Number(e>>Vi&Kn)|0,l:Number(e&Kn)|0}}function Fu(e,t=!1){const n=e.length;let r=new Uint32Array(n),o=new Uint32Array(n);for(let s=0;s<n;s++){const{h:a,l:i}=Hu(e[s],t);[r[s],o[s]]=[a,i]}return[r,o]}const Wi=(e,t,n)=>e>>>n,zi=(e,t,n)=>e<<32-n|t>>>n,qt=(e,t,n)=>e>>>n|t<<32-n,Ht=(e,t,n)=>e<<32-n|t>>>n,Vn=(e,t,n)=>e<<64-n|t>>>n-32,Wn=(e,t,n)=>e>>>n-32|t<<64-n;function ze(e,t,n,r){const o=(t>>>0)+(r>>>0);return{h:e+n+(o/2**32|0)|0,l:o|0}}const Gu=(e,t,n)=>(e>>>0)+(t>>>0)+(n>>>0),Ku=(e,t,n,r)=>t+n+r+(e/2**32|0)|0,Vu=(e,t,n,r)=>(e>>>0)+(t>>>0)+(n>>>0)+(r>>>0),Wu=(e,t,n,r,o)=>t+n+r+o+(e/2**32|0)|0,zu=(e,t,n,r,o)=>(e>>>0)+(t>>>0)+(n>>>0)+(r>>>0)+(o>>>0),Ju=(e,t,n,r,o,s)=>t+n+r+o+s+(e/2**32|0)|0,Yu=Uint32Array.from([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),st=new Uint32Array(64);class Zu extends $s{constructor(t){super(64,t,8,!1)}get(){const{A:t,B:n,C:r,D:o,E:s,F:a,G:i,H:c}=this;return[t,n,r,o,s,a,i,c]}set(t,n,r,o,s,a,i,c){this.A=t|0,this.B=n|0,this.C=r|0,this.D=o|0,this.E=s|0,this.F=a|0,this.G=i|0,this.H=c|0}process(t,n){for(let u=0;u<16;u++,n+=4)st[u]=t.getUint32(n,!1);for(let u=16;u<64;u++){const f=st[u-15],h=st[u-2],p=Me(f,7)^Me(f,18)^f>>>3,m=Me(h,17)^Me(h,19)^h>>>10;st[u]=m+st[u-7]+p+st[u-16]|0}let{A:r,B:o,C:s,D:a,E:i,F:c,G:l,H:d}=this;for(let u=0;u<64;u++){const f=Me(i,6)^Me(i,11)^Me(i,25),h=d+f+ju(i,c,l)+Yu[u]+st[u]|0,m=(Me(r,2)^Me(r,13)^Me(r,22))+qu(r,o,s)|0;d=l,l=c,c=i,i=a+h|0,a=s,s=o,o=r,r=h+m|0}r=r+this.A|0,o=o+this.B|0,s=s+this.C|0,a=a+this.D|0,i=i+this.E|0,c=c+this.F|0,l=l+this.G|0,d=d+this.H|0,this.set(r,o,s,a,i,c,l,d)}roundClean(){He(st)}destroy(){this.set(0,0,0,0,0,0,0,0),He(this.buffer)}}class Xu extends Zu{A=ot[0]|0;B=ot[1]|0;C=ot[2]|0;D=ot[3]|0;E=ot[4]|0;F=ot[5]|0;G=ot[6]|0;H=ot[7]|0;constructor(){super(32)}}const uc=Fu(["0x428a2f98d728ae22","0x7137449123ef65cd","0xb5c0fbcfec4d3b2f","0xe9b5dba58189dbbc","0x3956c25bf348b538","0x59f111f1b605d019","0x923f82a4af194f9b","0xab1c5ed5da6d8118","0xd807aa98a3030242","0x12835b0145706fbe","0x243185be4ee4b28c","0x550c7dc3d5ffb4e2","0x72be5d74f27b896f","0x80deb1fe3b1696b1","0x9bdc06a725c71235","0xc19bf174cf692694","0xe49b69c19ef14ad2","0xefbe4786384f25e3","0x0fc19dc68b8cd5b5","0x240ca1cc77ac9c65","0x2de92c6f592b0275","0x4a7484aa6ea6e483","0x5cb0a9dcbd41fbd4","0x76f988da831153b5","0x983e5152ee66dfab","0xa831c66d2db43210","0xb00327c898fb213f","0xbf597fc7beef0ee4","0xc6e00bf33da88fc2","0xd5a79147930aa725","0x06ca6351e003826f","0x142929670a0e6e70","0x27b70a8546d22ffc","0x2e1b21385c26c926","0x4d2c6dfc5ac42aed","0x53380d139d95b3df","0x650a73548baf63de","0x766a0abb3c77b2a8","0x81c2c92e47edaee6","0x92722c851482353b","0xa2bfe8a14cf10364","0xa81a664bbc423001","0xc24b8b70d0f89791","0xc76c51a30654be30","0xd192e819d6ef5218","0xd69906245565a910","0xf40e35855771202a","0x106aa07032bbd1b8","0x19a4c116b8d2d0c8","0x1e376c085141ab53","0x2748774cdf8eeb99","0x34b0bcb5e19b48a8","0x391c0cb3c5c95a63","0x4ed8aa4ae3418acb","0x5b9cca4f7763e373","0x682e6ff3d6b2b8a3","0x748f82ee5defb2fc","0x78a5636f43172f60","0x84c87814a1f0ab72","0x8cc702081a6439ec","0x90befffa23631e28","0xa4506cebde82bde9","0xbef9a3f7b2c67915","0xc67178f2e372532b","0xca273eceea26619c","0xd186b8c721c0c207","0xeada7dd6cde0eb1e","0xf57d4f7fee6ed178","0x06f067aa72176fba","0x0a637dc5a2c898a6","0x113f9804bef90dae","0x1b710b35131c471b","0x28db77f523047d84","0x32caab7b40c72493","0x3c9ebe0a15c9bebc","0x431d67c49c100d4c","0x4cc5d4becb3e42b6","0x597f299cfc657e2a","0x5fcb6fab3ad6faec","0x6c44198c4a475817"].map(e=>BigInt(e))),Qu=uc[0],ef=uc[1],it=new Uint32Array(80),at=new Uint32Array(80);class tf extends $s{constructor(t){super(128,t,16,!1)}get(){const{Ah:t,Al:n,Bh:r,Bl:o,Ch:s,Cl:a,Dh:i,Dl:c,Eh:l,El:d,Fh:u,Fl:f,Gh:h,Gl:p,Hh:m,Hl:g}=this;return[t,n,r,o,s,a,i,c,l,d,u,f,h,p,m,g]}set(t,n,r,o,s,a,i,c,l,d,u,f,h,p,m,g){this.Ah=t|0,this.Al=n|0,this.Bh=r|0,this.Bl=o|0,this.Ch=s|0,this.Cl=a|0,this.Dh=i|0,this.Dl=c|0,this.Eh=l|0,this.El=d|0,this.Fh=u|0,this.Fl=f|0,this.Gh=h|0,this.Gl=p|0,this.Hh=m|0,this.Hl=g|0}process(t,n){for(let T=0;T<16;T++,n+=4)it[T]=t.getUint32(n),at[T]=t.getUint32(n+=4);for(let T=16;T<80;T++){const $=it[T-15]|0,O=at[T-15]|0,N=qt($,O,1)^qt($,O,8)^Wi($,O,7),w=Ht($,O,1)^Ht($,O,8)^zi($,O,7),v=it[T-2]|0,y=at[T-2]|0,S=qt(v,y,19)^Vn(v,y,61)^Wi(v,y,6),I=Ht(v,y,19)^Wn(v,y,61)^zi(v,y,6),A=Vu(w,I,at[T-7],at[T-16]),E=Wu(A,N,S,it[T-7],it[T-16]);it[T]=E|0,at[T]=A|0}let{Ah:r,Al:o,Bh:s,Bl:a,Ch:i,Cl:c,Dh:l,Dl:d,Eh:u,El:f,Fh:h,Fl:p,Gh:m,Gl:g,Hh:b,Hl:k}=this;for(let T=0;T<80;T++){const $=qt(u,f,14)^qt(u,f,18)^Vn(u,f,41),O=Ht(u,f,14)^Ht(u,f,18)^Wn(u,f,41),N=u&h^~u&m,w=f&p^~f&g,v=zu(k,O,w,ef[T],at[T]),y=Ju(v,b,$,N,Qu[T],it[T]),S=v|0,I=qt(r,o,28)^Vn(r,o,34)^Vn(r,o,39),A=Ht(r,o,28)^Wn(r,o,34)^Wn(r,o,39),E=r&s^r&i^s&i,R=o&a^o&c^a&c;b=m|0,k=g|0,m=h|0,g=p|0,h=u|0,p=f|0,{h:u,l:f}=ze(l|0,d|0,y|0,S|0),l=i|0,d=c|0,i=s|0,c=a|0,s=r|0,a=o|0;const x=Gu(S,A,R);r=Ku(x,y,I,E),o=x|0}({h:r,l:o}=ze(this.Ah|0,this.Al|0,r|0,o|0)),{h:s,l:a}=ze(this.Bh|0,this.Bl|0,s|0,a|0),{h:i,l:c}=ze(this.Ch|0,this.Cl|0,i|0,c|0),{h:l,l:d}=ze(this.Dh|0,this.Dl|0,l|0,d|0),{h:u,l:f}=ze(this.Eh|0,this.El|0,u|0,f|0),{h,l:p}=ze(this.Fh|0,this.Fl|0,h|0,p|0),{h:m,l:g}=ze(this.Gh|0,this.Gl|0,m|0,g|0),{h:b,l:k}=ze(this.Hh|0,this.Hl|0,b|0,k|0),this.set(r,o,s,a,i,c,l,d,u,f,h,p,m,g,b,k)}roundClean(){He(it,at)}destroy(){He(this.buffer),this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)}}class nf extends tf{Ah=ce[0]|0;Al=ce[1]|0;Bh=ce[2]|0;Bl=ce[3]|0;Ch=ce[4]|0;Cl=ce[5]|0;Dh=ce[6]|0;Dl=ce[7]|0;Eh=ce[8]|0;El=ce[9]|0;Fh=ce[10]|0;Fl=ce[11]|0;Gh=ce[12]|0;Gl=ce[13]|0;Hh=ce[14]|0;Hl=ce[15]|0;constructor(){super(64)}}const se=Ns(()=>new Xu,lc(1)),Zo=Ns(()=>new nf,lc(3));function tn(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array"}function rf(e){if(!tn(e))throw new Error("Uint8Array expected")}function fc(e,t){return Array.isArray(t)?t.length===0?!0:e?t.every(n=>typeof n=="string"):t.every(n=>Number.isSafeInteger(n)):!1}function hc(e){if(typeof e!="function")throw new Error("function expected");return!0}function Ot(e,t){if(typeof t!="string")throw new Error(`${e}: string expected`);return!0}function an(e){if(!Number.isSafeInteger(e))throw new Error(`invalid integer: ${e}`)}function _r(e){if(!Array.isArray(e))throw new Error("array expected")}function xr(e,t){if(!fc(!0,t))throw new Error(`${e}: array of strings expected`)}function Ms(e,t){if(!fc(!1,t))throw new Error(`${e}: array of numbers expected`)}function Pn(...e){const t=s=>s,n=(s,a)=>i=>s(a(i)),r=e.map(s=>s.encode).reduceRight(n,t),o=e.map(s=>s.decode).reduce(n,t);return{encode:r,decode:o}}function Gr(e){const t=typeof e=="string"?e.split(""):e,n=t.length;xr("alphabet",t);const r=new Map(t.map((o,s)=>[o,s]));return{encode:o=>(_r(o),o.map(s=>{if(!Number.isSafeInteger(s)||s<0||s>=n)throw new Error(`alphabet.encode: digit index outside alphabet "${s}". Allowed: ${e}`);return t[s]})),decode:o=>(_r(o),o.map(s=>{Ot("alphabet.decode",s);const a=r.get(s);if(a===void 0)throw new Error(`Unknown letter: "${s}". Allowed: ${e}`);return a}))}}function Kr(e=""){return Ot("join",e),{encode:t=>(xr("join.decode",t),t.join(e)),decode:t=>(Ot("join.decode",t),t.split(e))}}function pc(e,t="="){return an(e),Ot("padding",t),{encode(n){for(xr("padding.encode",n);n.length*e%8;)n.push(t);return n},decode(n){xr("padding.decode",n);let r=n.length;if(r*e%8)throw new Error("padding: invalid, string should have whole number of bytes");for(;r>0&&n[r-1]===t;r--)if((r-1)*e%8===0)throw new Error("padding: invalid, string has too much padding");return n.slice(0,r)}}}function Xo(e,t,n){if(t<2)throw new Error(`convertRadix: invalid from=${t}, base cannot be less than 2`);if(n<2)throw new Error(`convertRadix: invalid to=${n}, base cannot be less than 2`);if(_r(e),!e.length)return[];let r=0;const o=[],s=Array.from(e,i=>{if(an(i),i<0||i>=t)throw new Error(`invalid integer: ${i}`);return i}),a=s.length;for(;;){let i=0,c=!0;for(let l=r;l<a;l++){const d=s[l],u=t*i,f=u+d;if(!Number.isSafeInteger(f)||u/t!==i||f-d!==u)throw new Error("convertRadix: carry overflow");const h=f/n;i=f%n;const p=Math.floor(h);if(s[l]=p,!Number.isSafeInteger(p)||p*n+i!==f)throw new Error("convertRadix: carry overflow");if(c)p?c=!1:r=l;else continue}if(o.push(i),c)break}for(let i=0;i<e.length-1&&e[i]===0;i++)o.push(0);return o.reverse()}const mc=(e,t)=>t===0?e:mc(t,e%t),Sr=(e,t)=>e+(t-mc(e,t)),lr=(()=>{let e=[];for(let t=0;t<40;t++)e.push(2**t);return e})();function Ir(e,t,n,r){if(_r(e),t<=0||t>32)throw new Error(`convertRadix2: wrong from=${t}`);if(n<=0||n>32)throw new Error(`convertRadix2: wrong to=${n}`);if(Sr(t,n)>32)throw new Error(`convertRadix2: carry overflow from=${t} to=${n} carryBits=${Sr(t,n)}`);let o=0,s=0;const a=lr[t],i=lr[n]-1,c=[];for(const l of e){if(an(l),l>=a)throw new Error(`convertRadix2: invalid data word=${l} from=${t}`);if(o=o<<t|l,s+t>32)throw new Error(`convertRadix2: carry overflow pos=${s} from=${t}`);for(s+=t;s>=n;s-=n)c.push((o>>s-n&i)>>>0);const d=lr[s];if(d===void 0)throw new Error("invalid carry");o&=d-1}if(o=o<<n-s&i,!r&&s>=t)throw new Error("Excess padding");if(!r&&o>0)throw new Error(`Non-zero padding: ${o}`);return r&&s>0&&c.push(o>>>0),c}function yc(e){an(e);const t=2**8;return{encode:n=>{if(!tn(n))throw new Error("radix.encode input should be Uint8Array");return Xo(Array.from(n),t,e)},decode:n=>(Ms("radix.decode",n),Uint8Array.from(Xo(n,e,t)))}}function Os(e,t=!1){if(an(e),e<=0||e>32)throw new Error("radix2: bits should be in (0..32]");if(Sr(8,e)>32||Sr(e,8)>32)throw new Error("radix2: carry overflow");return{encode:n=>{if(!tn(n))throw new Error("radix2.encode input should be Uint8Array");return Ir(Array.from(n),8,e,!t)},decode:n=>(Ms("radix2.decode",n),Uint8Array.from(Ir(n,e,8,t)))}}function Ji(e){return hc(e),function(...t){try{return e.apply(null,t)}catch{}}}function gc(e,t){return an(e),hc(t),{encode(n){if(!tn(n))throw new Error("checksum.encode: input should be Uint8Array");const r=t(n).slice(0,e),o=new Uint8Array(n.length+e);return o.set(n),o.set(r,n.length),o},decode(n){if(!tn(n))throw new Error("checksum.decode: input should be Uint8Array");const r=n.slice(0,-e),o=n.slice(-e),s=t(r).slice(0,e);for(let a=0;a<e;a++)if(s[a]!==o[a])throw new Error("Invalid checksum");return r}}}const zn={alphabet:Gr,chain:Pn,checksum:gc,convertRadix:Xo,convertRadix2:Ir,radix:yc,radix2:Os,join:Kr,padding:pc},of=typeof Uint8Array.from([]).toBase64=="function"&&typeof Uint8Array.fromBase64=="function",sf=(e,t)=>{Ot("base64",e);const n=/^[A-Za-z0-9=+/]+$/,r="base64";if(e.length>0&&!n.test(e))throw new Error("invalid base64");return Uint8Array.fromBase64(e,{alphabet:r,lastChunkHandling:"strict"})},Fe=of?{encode(e){return rf(e),e.toBase64()},decode(e){return sf(e)}}:Pn(Os(6),Gr("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"),pc(6),Kr("")),af=e=>Pn(yc(58),Gr(e),Kr("")),cf=af("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"),lf=e=>Pn(gc(4,t=>e(e(t))),cf),Qo=Pn(Gr("qpzry9x8gf2tvdw0s3jn54khce6mua7l"),Kr("")),Yi=[996825010,642813549,513874426,1027748829,705979059];function fn(e){const t=e>>25;let n=(e&33554431)<<5;for(let r=0;r<Yi.length;r++)(t>>r&1)===1&&(n^=Yi[r]);return n}function Zi(e,t,n=1){const r=e.length;let o=1;for(let s=0;s<r;s++){const a=e.charCodeAt(s);if(a<33||a>126)throw new Error(`Invalid prefix (${e})`);o=fn(o)^a>>5}o=fn(o);for(let s=0;s<r;s++)o=fn(o)^e.charCodeAt(s)&31;for(let s of t)o=fn(o)^s;for(let s=0;s<6;s++)o=fn(o);return o^=n,Qo.encode(Ir([o%lr[30]],30,5,!1))}function df(e){const t=e==="bech32"?1:734539939,n=Os(5),r=n.decode,o=n.encode,s=Ji(r);function a(u,f,h=90){Ot("bech32.encode prefix",u),tn(f)&&(f=Array.from(f)),Ms("bech32.encode",f);const p=u.length;if(p===0)throw new TypeError(`Invalid prefix length ${p}`);const m=p+7+f.length;if(h!==!1&&m>h)throw new TypeError(`Length ${m} exceeds limit ${h}`);const g=u.toLowerCase(),b=Zi(g,f,t);return`${g}1${Qo.encode(f)}${b}`}function i(u,f=90){Ot("bech32.decode input",u);const h=u.length;if(h<8||f!==!1&&h>f)throw new TypeError(`invalid string length: ${h} (${u}). Expected (8..${f})`);const p=u.toLowerCase();if(u!==p&&u!==u.toUpperCase())throw new Error("String must be lowercase or uppercase");const m=p.lastIndexOf("1");if(m===0||m===-1)throw new Error('Letter "1" must be present between prefix and data only');const g=p.slice(0,m),b=p.slice(m+1);if(b.length<6)throw new Error("Data must be at least 6 characters long");const k=Qo.decode(b).slice(0,-6),T=Zi(g,k,t);if(!b.endsWith(T))throw new Error(`Invalid checksum in ${u}: expected "${T}"`);return{prefix:g,words:k}}const c=Ji(i);function l(u){const{prefix:f,words:h}=i(u,!1);return{prefix:f,words:h,bytes:r(h)}}function d(u,f){return a(u,o(f))}return{encode:a,decode:i,encodeFromBytes:d,decodeToBytes:l,decodeUnsafe:c,fromWords:r,fromWordsUnsafe:s,toWords:o}}const Ge=df("bech32");const uf=e=>e[0]==="あいこくしん";function bc(e){if(typeof e!="string")throw new TypeError("invalid mnemonic type: "+typeof e);return e.normalize("NFKD")}function vc(e){const t=bc(e),n=t.split(" ");if(![12,15,18,21,24].includes(n.length))throw new Error("Invalid mnemonic");return{nfkd:t,words:n}}function wc(e){if(F(e),![16,20,24,28,32].includes(e.length))throw new Error("invalid entropy length")}function ff(e,t=128){if(xe(t),t%32!==0||t>256)throw new TypeError("Invalid entropy");return mf(wt(t/8),e)}const hf=e=>{const t=8-e.length/4;return new Uint8Array([se(e)[0]>>t<<t])};function Ec(e){if(!Array.isArray(e)||e.length!==2048||typeof e[0]!="string")throw new Error("Wordlist: expected array of 2048 strings");return e.forEach(t=>{if(typeof t!="string")throw new Error("wordlist: non-string element: "+t)}),zn.chain(zn.checksum(1,hf),zn.radix2(11,!0),zn.alphabet(e))}function pf(e,t){const{words:n}=vc(e),r=Ec(t).decode(n);return wc(r),r}function mf(e,t){return wc(e),Ec(t).encode(e).join(uf(t)?"　":" ")}function yf(e,t){try{pf(e,t)}catch{return!1}return!0}const gf=e=>bc("mnemonic"+e);function bf(e,t=""){return Du(Zo,vc(e).nfkd,gf(t),{c:2048,dkLen:64})}const kc=`abandon
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
`);const Bs=BigInt(0),es=BigInt(1);function Rr(e,t=""){if(typeof e!="boolean"){const n=t&&`"${t}" `;throw new Error(n+"expected boolean, got type="+typeof e)}return e}function _c(e){if(typeof e=="bigint"){if(!dr(e))throw new Error("positive bigint expected, got "+e)}else xe(e);return e}function Jn(e){const t=_c(e).toString(16);return t.length&1?"0"+t:t}function xc(e){if(typeof e!="string")throw new Error("hex string expected, got "+typeof e);return e===""?Bs:BigInt("0x"+e)}function Un(e){return xc(q(e))}function Sc(e){return xc(q(vf(F(e)).reverse()))}function Ps(e,t){xe(t),e=_c(e);const n=z(e.toString(16).padStart(t*2,"0"));if(n.length!==t)throw new Error("number too large");return n}function Ic(e,t){return Ps(e,t).reverse()}function vf(e){return Uint8Array.from(e)}function wf(e){return Uint8Array.from(e,(t,n)=>{const r=t.charCodeAt(0);if(t.length!==1||r>127)throw new Error(`string contains non-ASCII character "${e[n]}" with code ${r} at position ${n}`);return r})}const dr=e=>typeof e=="bigint"&&Bs<=e;function Ef(e,t,n){return dr(e)&&dr(t)&&dr(n)&&t<=e&&e<n}function kf(e,t,n,r){if(!Ef(t,n,r))throw new Error("expected valid "+e+": "+n+" <= n < "+r+", got "+t)}function _f(e){let t;for(t=0;e>Bs;e>>=es,t+=1);return t}const Us=e=>(es<<BigInt(e))-es;function xf(e,t,n){if(xe(e,"hashLen"),xe(t,"qByteLen"),typeof n!="function")throw new Error("hmacFn must be a function");const r=g=>new Uint8Array(g),o=Uint8Array.of(),s=Uint8Array.of(0),a=Uint8Array.of(1),i=1e3;let c=r(e),l=r(e),d=0;const u=()=>{c.fill(1),l.fill(0),d=0},f=(...g)=>n(l,oe(c,...g)),h=(g=o)=>{l=f(s,g),c=f(),g.length!==0&&(l=f(a,g),c=f())},p=()=>{if(d++>=i)throw new Error("drbg: tried max amount of iterations");let g=0;const b=[];for(;g<t;){c=f();const k=c.slice();b.push(k),g+=c.length}return oe(...b)};return(g,b)=>{u(),h(g);let k;for(;!(k=b(p()));)h();return u(),k}}function Ds(e,t={},n={}){if(!e||typeof e!="object")throw new Error("expected valid options object");function r(s,a,i){const c=e[s];if(i&&c===void 0)return;const l=typeof c;if(l!==a||c===null)throw new Error(`param "${s}" is invalid: expected ${a}, got ${l}`)}const o=(s,a)=>Object.entries(s).forEach(([i,c])=>r(i,c,a));o(t,!1),o(n,!0)}function Xi(e){const t=new WeakMap;return(n,...r)=>{const o=t.get(n);if(o!==void 0)return o;const s=e(n,...r);return t.set(n,s),s}}const me=BigInt(0),he=BigInt(1),It=BigInt(2),Rc=BigInt(3),Ac=BigInt(4),Cc=BigInt(5),Sf=BigInt(7),Tc=BigInt(8),If=BigInt(9),Lc=BigInt(16);function Ie(e,t){const n=e%t;return n>=me?n:t+n}function we(e,t,n){let r=e;for(;t-- >me;)r*=r,r%=n;return r}function Qi(e,t){if(e===me)throw new Error("invert: expected non-zero number");if(t<=me)throw new Error("invert: expected positive modulus, got "+t);let n=Ie(e,t),r=t,o=me,s=he;for(;n!==me;){const i=r/n,c=r%n,l=o-s*i;r=n,n=c,o=s,s=l}if(r!==he)throw new Error("invert: does not exist");return Ie(o,t)}function js(e,t,n){if(!e.eql(e.sqr(t),n))throw new Error("Cannot find square root")}function Nc(e,t){const n=(e.ORDER+he)/Ac,r=e.pow(t,n);return js(e,r,t),r}function Rf(e,t){const n=(e.ORDER-Cc)/Tc,r=e.mul(t,It),o=e.pow(r,n),s=e.mul(t,o),a=e.mul(e.mul(s,It),o),i=e.mul(s,e.sub(a,e.ONE));return js(e,i,t),i}function Af(e){const t=Vr(e),n=$c(e),r=n(t,t.neg(t.ONE)),o=n(t,r),s=n(t,t.neg(r)),a=(e+Sf)/Lc;return(i,c)=>{let l=i.pow(c,a),d=i.mul(l,r);const u=i.mul(l,o),f=i.mul(l,s),h=i.eql(i.sqr(d),c),p=i.eql(i.sqr(u),c);l=i.cmov(l,d,h),d=i.cmov(f,u,p);const m=i.eql(i.sqr(d),c),g=i.cmov(l,d,m);return js(i,g,c),g}}function $c(e){if(e<Rc)throw new Error("sqrt is not defined for small field");let t=e-he,n=0;for(;t%It===me;)t/=It,n++;let r=It;const o=Vr(e);for(;ea(o,r)===1;)if(r++>1e3)throw new Error("Cannot find square root: probably non-prime P");if(n===1)return Nc;let s=o.pow(r,t);const a=(t+he)/It;return function(c,l){if(c.is0(l))return l;if(ea(c,l)!==1)throw new Error("Cannot find square root");let d=n,u=c.mul(c.ONE,s),f=c.pow(l,t),h=c.pow(l,a);for(;!c.eql(f,c.ONE);){if(c.is0(f))return c.ZERO;let p=1,m=c.sqr(f);for(;!c.eql(m,c.ONE);)if(p++,m=c.sqr(m),p===d)throw new Error("Cannot find square root");const g=he<<BigInt(d-p-1),b=c.pow(u,g);d=p,u=c.sqr(b),f=c.mul(f,u),h=c.mul(h,b)}return h}}function Cf(e){return e%Ac===Rc?Nc:e%Tc===Cc?Rf:e%Lc===If?Af(e):$c(e)}const Tf=["create","isValid","is0","neg","inv","sqrt","sqr","eql","add","sub","mul","pow","div","addN","subN","mulN","sqrN"];function Lf(e){const t={ORDER:"bigint",BYTES:"number",BITS:"number"},n=Tf.reduce((r,o)=>(r[o]="function",r),t);return Ds(e,n),e}function Nf(e,t,n){if(n<me)throw new Error("invalid exponent, negatives unsupported");if(n===me)return e.ONE;if(n===he)return t;let r=e.ONE,o=t;for(;n>me;)n&he&&(r=e.mul(r,o)),o=e.sqr(o),n>>=he;return r}function Mc(e,t,n=!1){const r=new Array(t.length).fill(n?e.ZERO:void 0),o=t.reduce((a,i,c)=>e.is0(i)?a:(r[c]=a,e.mul(a,i)),e.ONE),s=e.inv(o);return t.reduceRight((a,i,c)=>e.is0(i)?a:(r[c]=e.mul(a,r[c]),e.mul(a,i)),s),r}function ea(e,t){const n=(e.ORDER-he)/It,r=e.pow(t,n),o=e.eql(r,e.ONE),s=e.eql(r,e.ZERO),a=e.eql(r,e.neg(e.ONE));if(!o&&!s&&!a)throw new Error("invalid Legendre symbol result");return o?1:s?0:-1}function $f(e,t){t!==void 0&&xe(t);const n=t!==void 0?t:e.toString(2).length,r=Math.ceil(n/8);return{nBitLength:n,nByteLength:r}}class Mf{ORDER;BITS;BYTES;isLE;ZERO=me;ONE=he;_lengths;_sqrt;_mod;constructor(t,n={}){if(t<=me)throw new Error("invalid field: expected ORDER > 0, got "+t);let r;this.isLE=!1,n!=null&&typeof n=="object"&&(typeof n.BITS=="number"&&(r=n.BITS),typeof n.sqrt=="function"&&(this.sqrt=n.sqrt),typeof n.isLE=="boolean"&&(this.isLE=n.isLE),n.allowedLengths&&(this._lengths=n.allowedLengths?.slice()),typeof n.modFromBytes=="boolean"&&(this._mod=n.modFromBytes));const{nBitLength:o,nByteLength:s}=$f(t,r);if(s>2048)throw new Error("invalid field: expected ORDER of <= 2048 bytes");this.ORDER=t,this.BITS=o,this.BYTES=s,this._sqrt=void 0,Object.preventExtensions(this)}create(t){return Ie(t,this.ORDER)}isValid(t){if(typeof t!="bigint")throw new Error("invalid field element: expected bigint, got "+typeof t);return me<=t&&t<this.ORDER}is0(t){return t===me}isValidNot0(t){return!this.is0(t)&&this.isValid(t)}isOdd(t){return(t&he)===he}neg(t){return Ie(-t,this.ORDER)}eql(t,n){return t===n}sqr(t){return Ie(t*t,this.ORDER)}add(t,n){return Ie(t+n,this.ORDER)}sub(t,n){return Ie(t-n,this.ORDER)}mul(t,n){return Ie(t*n,this.ORDER)}pow(t,n){return Nf(this,t,n)}div(t,n){return Ie(t*Qi(n,this.ORDER),this.ORDER)}sqrN(t){return t*t}addN(t,n){return t+n}subN(t,n){return t-n}mulN(t,n){return t*n}inv(t){return Qi(t,this.ORDER)}sqrt(t){return this._sqrt||(this._sqrt=Cf(this.ORDER)),this._sqrt(this,t)}toBytes(t){return this.isLE?Ic(t,this.BYTES):Ps(t,this.BYTES)}fromBytes(t,n=!1){F(t);const{_lengths:r,BYTES:o,isLE:s,ORDER:a,_mod:i}=this;if(r){if(!r.includes(t.length)||t.length>o)throw new Error("Field.fromBytes: expected "+r+" bytes, got "+t.length);const l=new Uint8Array(o);l.set(t,s?0:l.length-t.length),t=l}if(t.length!==o)throw new Error("Field.fromBytes: expected "+o+" bytes, got "+t.length);let c=s?Sc(t):Un(t);if(i&&(c=Ie(c,a)),!n&&!this.isValid(c))throw new Error("invalid field element: outside of range 0..ORDER");return c}invertBatch(t){return Mc(this,t)}cmov(t,n,r){return r?n:t}}function Vr(e,t={}){return new Mf(e,t)}function Oc(e){if(typeof e!="bigint")throw new Error("field order must be bigint");const t=e.toString(2).length;return Math.ceil(t/8)}function Bc(e){const t=Oc(e);return t+Math.ceil(t/2)}function Pc(e,t,n=!1){F(e);const r=e.length,o=Oc(t),s=Bc(t);if(r<16||r<s||r>1024)throw new Error("expected "+s+"-1024 bytes of input, got "+r);const a=n?Sc(e):Un(e),i=Ie(a,t-he)+he;return n?Ic(i,o):Ps(i,o)}const nn=BigInt(0),Rt=BigInt(1);function Ar(e,t){const n=t.negate();return e?n:t}function ta(e,t){const n=Mc(e.Fp,t.map(r=>r.Z));return t.map((r,o)=>e.fromAffine(r.toAffine(n[o])))}function Uc(e,t){if(!Number.isSafeInteger(e)||e<=0||e>t)throw new Error("invalid window size, expected [1.."+t+"], got W="+e)}function wo(e,t){Uc(e,t);const n=Math.ceil(t/e)+1,r=2**(e-1),o=2**e,s=Us(e),a=BigInt(e);return{windows:n,windowSize:r,mask:s,maxNumber:o,shiftBy:a}}function na(e,t,n){const{windowSize:r,mask:o,maxNumber:s,shiftBy:a}=n;let i=Number(e&o),c=e>>a;i>r&&(i-=s,c+=Rt);const l=t*r,d=l+Math.abs(i)-1,u=i===0,f=i<0,h=t%2!==0;return{nextN:c,offset:d,isZero:u,isNeg:f,isNegF:h,offsetF:l}}const Eo=new WeakMap,Dc=new WeakMap;function ko(e){return Dc.get(e)||1}function ra(e){if(e!==nn)throw new Error("invalid wNAF")}class Of{BASE;ZERO;Fn;bits;constructor(t,n){this.BASE=t.BASE,this.ZERO=t.ZERO,this.Fn=t.Fn,this.bits=n}_unsafeLadder(t,n,r=this.ZERO){let o=t;for(;n>nn;)n&Rt&&(r=r.add(o)),o=o.double(),n>>=Rt;return r}precomputeWindow(t,n){const{windows:r,windowSize:o}=wo(n,this.bits),s=[];let a=t,i=a;for(let c=0;c<r;c++){i=a,s.push(i);for(let l=1;l<o;l++)i=i.add(a),s.push(i);a=i.double()}return s}wNAF(t,n,r){if(!this.Fn.isValid(r))throw new Error("invalid scalar");let o=this.ZERO,s=this.BASE;const a=wo(t,this.bits);for(let i=0;i<a.windows;i++){const{nextN:c,offset:l,isZero:d,isNeg:u,isNegF:f,offsetF:h}=na(r,i,a);r=c,d?s=s.add(Ar(f,n[h])):o=o.add(Ar(u,n[l]))}return ra(r),{p:o,f:s}}wNAFUnsafe(t,n,r,o=this.ZERO){const s=wo(t,this.bits);for(let a=0;a<s.windows&&r!==nn;a++){const{nextN:i,offset:c,isZero:l,isNeg:d}=na(r,a,s);if(r=i,!l){const u=n[c];o=o.add(d?u.negate():u)}}return ra(r),o}getPrecomputes(t,n,r){let o=Eo.get(n);return o||(o=this.precomputeWindow(n,t),t!==1&&(typeof r=="function"&&(o=r(o)),Eo.set(n,o))),o}cached(t,n,r){const o=ko(t);return this.wNAF(o,this.getPrecomputes(o,t,r),n)}unsafe(t,n,r,o){const s=ko(t);return s===1?this._unsafeLadder(t,n,o):this.wNAFUnsafe(s,this.getPrecomputes(s,t,r),n,o)}createCache(t,n){Uc(n,this.bits),Dc.set(t,n),Eo.delete(t)}hasCache(t){return ko(t)!==1}}function Bf(e,t,n,r){let o=t,s=e.ZERO,a=e.ZERO;for(;n>nn||r>nn;)n&Rt&&(s=s.add(o)),r&Rt&&(a=a.add(o)),o=o.double(),n>>=Rt,r>>=Rt;return{p1:s,p2:a}}function oa(e,t,n){if(t){if(t.ORDER!==e)throw new Error("Field.ORDER must match order: Fp == p, Fn == n");return Lf(t),t}else return Vr(e,{isLE:n})}function Pf(e,t,n={},r){if(r===void 0&&(r=e==="edwards"),!t||typeof t!="object")throw new Error(`expected valid ${e} CURVE object`);for(const c of["p","n","h"]){const l=t[c];if(!(typeof l=="bigint"&&l>nn))throw new Error(`CURVE.${c} must be positive bigint`)}const o=oa(t.p,n.Fp,r),s=oa(t.n,n.Fn,r),i=["Gx","Gy","a","b"];for(const c of i)if(!o.isValid(t[c]))throw new Error(`CURVE.${c} must be valid field element of CURVE.Fp`);return t=Object.freeze(Object.assign({},t)),{CURVE:t,Fp:o,Fn:s}}function jc(e,t){return function(r){const o=e(r);return{secretKey:o,publicKey:t(o)}}}const sa=(e,t)=>(e+(e>=0?t:-t)/qc)/t;function Uf(e,t,n){const[[r,o],[s,a]]=t,i=sa(a*e,n),c=sa(-o*e,n);let l=e-i*r-c*s,d=-i*o-c*a;const u=l<Xe,f=d<Xe;u&&(l=-l),f&&(d=-d);const h=Us(Math.ceil(_f(n)/2))+Yt;if(l<Xe||l>=h||d<Xe||d>=h)throw new Error("splitScalar (endomorphism): failed, k="+e);return{k1neg:u,k1:l,k2neg:f,k2:d}}function ts(e){if(!["compact","recovered","der"].includes(e))throw new Error('Signature format must be "compact", "recovered", or "der"');return e}function _o(e,t){const n={};for(let r of Object.keys(t))n[r]=e[r]===void 0?t[r]:e[r];return Rr(n.lowS,"lowS"),Rr(n.prehash,"prehash"),n.format!==void 0&&ts(n.format),n}class Df extends Error{constructor(t=""){super(t)}}const ut={Err:Df,_tlv:{encode:(e,t)=>{const{Err:n}=ut;if(e<0||e>256)throw new n("tlv.encode: wrong tag");if(t.length&1)throw new n("tlv.encode: unpadded data");const r=t.length/2,o=Jn(r);if(o.length/2&128)throw new n("tlv.encode: long form length too big");const s=r>127?Jn(o.length/2|128):"";return Jn(e)+s+o+t},decode(e,t){const{Err:n}=ut;let r=0;if(e<0||e>256)throw new n("tlv.encode: wrong tag");if(t.length<2||t[r++]!==e)throw new n("tlv.decode: wrong tlv");const o=t[r++],s=!!(o&128);let a=0;if(!s)a=o;else{const c=o&127;if(!c)throw new n("tlv.decode(long): indefinite length not supported");if(c>4)throw new n("tlv.decode(long): byte length is too big");const l=t.subarray(r,r+c);if(l.length!==c)throw new n("tlv.decode: length bytes not complete");if(l[0]===0)throw new n("tlv.decode(long): zero leftmost byte");for(const d of l)a=a<<8|d;if(r+=c,a<128)throw new n("tlv.decode(long): not minimal encoding")}const i=t.subarray(r,r+a);if(i.length!==a)throw new n("tlv.decode: wrong value length");return{v:i,l:t.subarray(r+a)}}},_int:{encode(e){const{Err:t}=ut;if(e<Xe)throw new t("integer: negative integers are not allowed");let n=Jn(e);if(Number.parseInt(n[0],16)&8&&(n="00"+n),n.length&1)throw new t("unexpected DER parsing assertion: unpadded hex");return n},decode(e){const{Err:t}=ut;if(e[0]&128)throw new t("invalid signature integer: negative");if(e[0]===0&&!(e[1]&128))throw new t("invalid signature integer: unnecessary leading zero");return Un(e)}},toSig(e){const{Err:t,_int:n,_tlv:r}=ut,o=F(e,void 0,"signature"),{v:s,l:a}=r.decode(48,o);if(a.length)throw new t("invalid signature: left bytes after parsing");const{v:i,l:c}=r.decode(2,s),{v:l,l:d}=r.decode(2,c);if(d.length)throw new t("invalid signature: left bytes after parsing");return{r:n.decode(i),s:n.decode(l)}},hexFromSig(e){const{_tlv:t,_int:n}=ut,r=t.encode(2,n.encode(e.r)),o=t.encode(2,n.encode(e.s)),s=r+o;return t.encode(48,s)}},Xe=BigInt(0),Yt=BigInt(1),qc=BigInt(2),Yn=BigInt(3),jf=BigInt(4);function qf(e,t={}){const n=Pf("weierstrass",e,t),{Fp:r,Fn:o}=n;let s=n.CURVE;const{h:a,n:i}=s;Ds(t,{},{allowInfinityPoint:"boolean",clearCofactor:"function",isTorsionFree:"function",fromBytes:"function",toBytes:"function",endo:"object"});const{endo:c}=t;if(c&&(!r.is0(s.a)||typeof c.beta!="bigint"||!Array.isArray(c.basises)))throw new Error('invalid endo: expected "beta": bigint and "basises": array');const l=Fc(r,o);function d(){if(!r.isOdd)throw new Error("compression is not supported: Field does not have .isOdd()")}function u(A,E,R){const{x,y:L}=E.toAffine(),C=r.toBytes(x);if(Rr(R,"isCompressed"),R){d();const M=!r.isOdd(L);return oe(Hc(M),C)}else return oe(Uint8Array.of(4),C,r.toBytes(L))}function f(A){F(A,void 0,"Point");const{publicKey:E,publicKeyUncompressed:R}=l,x=A.length,L=A[0],C=A.subarray(1);if(x===E&&(L===2||L===3)){const M=r.fromBytes(C);if(!r.isValid(M))throw new Error("bad point: is not on curve, wrong x");const B=m(M);let P;try{P=r.sqrt(B)}catch(K){const Y=K instanceof Error?": "+K.message:"";throw new Error("bad point: is not on curve, sqrt error"+Y)}d();const U=r.isOdd(P);return(L&1)===1!==U&&(P=r.neg(P)),{x:M,y:P}}else if(x===R&&L===4){const M=r.BYTES,B=r.fromBytes(C.subarray(0,M)),P=r.fromBytes(C.subarray(M,M*2));if(!g(B,P))throw new Error("bad point: is not on curve");return{x:B,y:P}}else throw new Error(`bad point: got length ${x}, expected compressed=${E} or uncompressed=${R}`)}const h=t.toBytes||u,p=t.fromBytes||f;function m(A){const E=r.sqr(A),R=r.mul(E,A);return r.add(r.add(R,r.mul(A,s.a)),s.b)}function g(A,E){const R=r.sqr(E),x=m(A);return r.eql(R,x)}if(!g(s.Gx,s.Gy))throw new Error("bad curve params: generator point");const b=r.mul(r.pow(s.a,Yn),jf),k=r.mul(r.sqr(s.b),BigInt(27));if(r.is0(r.add(b,k)))throw new Error("bad curve params: a or b");function T(A,E,R=!1){if(!r.isValid(E)||R&&r.is0(E))throw new Error(`bad point coordinate ${A}`);return E}function $(A){if(!(A instanceof y))throw new Error("Weierstrass Point expected")}function O(A){if(!c||!c.basises)throw new Error("no endo");return Uf(A,c.basises,o.ORDER)}const N=Xi((A,E)=>{const{X:R,Y:x,Z:L}=A;if(r.eql(L,r.ONE))return{x:R,y:x};const C=A.is0();E==null&&(E=C?r.ONE:r.inv(L));const M=r.mul(R,E),B=r.mul(x,E),P=r.mul(L,E);if(C)return{x:r.ZERO,y:r.ZERO};if(!r.eql(P,r.ONE))throw new Error("invZ was invalid");return{x:M,y:B}}),w=Xi(A=>{if(A.is0()){if(t.allowInfinityPoint&&!r.is0(A.Y))return;throw new Error("bad point: ZERO")}const{x:E,y:R}=A.toAffine();if(!r.isValid(E)||!r.isValid(R))throw new Error("bad point: x or y not field elements");if(!g(E,R))throw new Error("bad point: equation left != right");if(!A.isTorsionFree())throw new Error("bad point: not in prime-order subgroup");return!0});function v(A,E,R,x,L){return R=new y(r.mul(R.X,A),R.Y,R.Z),E=Ar(x,E),R=Ar(L,R),E.add(R)}class y{static BASE=new y(s.Gx,s.Gy,r.ONE);static ZERO=new y(r.ZERO,r.ONE,r.ZERO);static Fp=r;static Fn=o;X;Y;Z;constructor(E,R,x){this.X=T("x",E),this.Y=T("y",R,!0),this.Z=T("z",x),Object.freeze(this)}static CURVE(){return s}static fromAffine(E){const{x:R,y:x}=E||{};if(!E||!r.isValid(R)||!r.isValid(x))throw new Error("invalid affine point");if(E instanceof y)throw new Error("projective point not allowed");return r.is0(R)&&r.is0(x)?y.ZERO:new y(R,x,r.ONE)}static fromBytes(E){const R=y.fromAffine(p(F(E,void 0,"point")));return R.assertValidity(),R}static fromHex(E){return y.fromBytes(z(E))}get x(){return this.toAffine().x}get y(){return this.toAffine().y}precompute(E=8,R=!0){return I.createCache(this,E),R||this.multiply(Yn),this}assertValidity(){w(this)}hasEvenY(){const{y:E}=this.toAffine();if(!r.isOdd)throw new Error("Field doesn't support isOdd");return!r.isOdd(E)}equals(E){$(E);const{X:R,Y:x,Z:L}=this,{X:C,Y:M,Z:B}=E,P=r.eql(r.mul(R,B),r.mul(C,L)),U=r.eql(r.mul(x,B),r.mul(M,L));return P&&U}negate(){return new y(this.X,r.neg(this.Y),this.Z)}double(){const{a:E,b:R}=s,x=r.mul(R,Yn),{X:L,Y:C,Z:M}=this;let B=r.ZERO,P=r.ZERO,U=r.ZERO,D=r.mul(L,L),K=r.mul(C,C),Y=r.mul(M,M),V=r.mul(L,C);return V=r.add(V,V),U=r.mul(L,M),U=r.add(U,U),B=r.mul(E,U),P=r.mul(x,Y),P=r.add(B,P),B=r.sub(K,P),P=r.add(K,P),P=r.mul(B,P),B=r.mul(V,B),U=r.mul(x,U),Y=r.mul(E,Y),V=r.sub(D,Y),V=r.mul(E,V),V=r.add(V,U),U=r.add(D,D),D=r.add(U,D),D=r.add(D,Y),D=r.mul(D,V),P=r.add(P,D),Y=r.mul(C,M),Y=r.add(Y,Y),D=r.mul(Y,V),B=r.sub(B,D),U=r.mul(Y,K),U=r.add(U,U),U=r.add(U,U),new y(B,P,U)}add(E){$(E);const{X:R,Y:x,Z:L}=this,{X:C,Y:M,Z:B}=E;let P=r.ZERO,U=r.ZERO,D=r.ZERO;const K=s.a,Y=r.mul(s.b,Yn);let V=r.mul(R,C),ne=r.mul(x,M),ie=r.mul(L,B),$e=r.add(R,x),re=r.add(C,M);$e=r.mul($e,re),re=r.add(V,ne),$e=r.sub($e,re),re=r.add(R,L);let ae=r.add(C,B);return re=r.mul(re,ae),ae=r.add(V,ie),re=r.sub(re,ae),ae=r.add(x,L),P=r.add(M,B),ae=r.mul(ae,P),P=r.add(ne,ie),ae=r.sub(ae,P),D=r.mul(K,re),P=r.mul(Y,ie),D=r.add(P,D),P=r.sub(ne,D),D=r.add(ne,D),U=r.mul(P,D),ne=r.add(V,V),ne=r.add(ne,V),ie=r.mul(K,ie),re=r.mul(Y,re),ne=r.add(ne,ie),ie=r.sub(V,ie),ie=r.mul(K,ie),re=r.add(re,ie),V=r.mul(ne,re),U=r.add(U,V),V=r.mul(ae,re),P=r.mul($e,P),P=r.sub(P,V),V=r.mul($e,ne),D=r.mul(ae,D),D=r.add(D,V),new y(P,U,D)}subtract(E){return this.add(E.negate())}is0(){return this.equals(y.ZERO)}multiply(E){const{endo:R}=t;if(!o.isValidNot0(E))throw new Error("invalid scalar: out of range");let x,L;const C=M=>I.cached(this,M,B=>ta(y,B));if(R){const{k1neg:M,k1:B,k2neg:P,k2:U}=O(E),{p:D,f:K}=C(B),{p:Y,f:V}=C(U);L=K.add(V),x=v(R.beta,D,Y,M,P)}else{const{p:M,f:B}=C(E);x=M,L=B}return ta(y,[x,L])[0]}multiplyUnsafe(E){const{endo:R}=t,x=this;if(!o.isValid(E))throw new Error("invalid scalar: out of range");if(E===Xe||x.is0())return y.ZERO;if(E===Yt)return x;if(I.hasCache(this))return this.multiply(E);if(R){const{k1neg:L,k1:C,k2neg:M,k2:B}=O(E),{p1:P,p2:U}=Bf(y,x,C,B);return v(R.beta,P,U,L,M)}else return I.unsafe(x,E)}toAffine(E){return N(this,E)}isTorsionFree(){const{isTorsionFree:E}=t;return a===Yt?!0:E?E(y,this):I.unsafe(this,i).is0()}clearCofactor(){const{clearCofactor:E}=t;return a===Yt?this:E?E(y,this):this.multiplyUnsafe(a)}isSmallOrder(){return this.multiplyUnsafe(a).is0()}toBytes(E=!0){return Rr(E,"isCompressed"),this.assertValidity(),h(y,this,E)}toHex(E=!0){return q(this.toBytes(E))}toString(){return`<Point ${this.is0()?"ZERO":this.toHex()}>`}}const S=o.BITS,I=new Of(y,t.endo?Math.ceil(S/2):S);return y.BASE.precompute(8),y}function Hc(e){return Uint8Array.of(e?2:3)}function Fc(e,t){return{secretKey:t.BYTES,publicKey:1+e.BYTES,publicKeyUncompressed:1+2*e.BYTES,publicKeyHasPrefix:!0,signature:2*t.BYTES}}function Hf(e,t={}){const{Fn:n}=e,r=t.randomBytes||wt,o=Object.assign(Fc(e.Fp,n),{seed:Bc(n.ORDER)});function s(h){try{const p=n.fromBytes(h);return n.isValidNot0(p)}catch{return!1}}function a(h,p){const{publicKey:m,publicKeyUncompressed:g}=o;try{const b=h.length;return p===!0&&b!==m||p===!1&&b!==g?!1:!!e.fromBytes(h)}catch{return!1}}function i(h=r(o.seed)){return Pc(F(h,o.seed,"seed"),n.ORDER)}function c(h,p=!0){return e.BASE.multiply(n.fromBytes(h)).toBytes(p)}function l(h){const{secretKey:p,publicKey:m,publicKeyUncompressed:g}=o;if(!Ls(h)||"_lengths"in n&&n._lengths||p===m)return;const b=F(h,void 0,"key").length;return b===m||b===g}function d(h,p,m=!0){if(l(h)===!0)throw new Error("first arg must be private key");if(l(p)===!1)throw new Error("second arg must be public key");const g=n.fromBytes(h);return e.fromBytes(p).multiply(g).toBytes(m)}const u={isValidSecretKey:s,isValidPublicKey:a,randomSecretKey:i},f=jc(i,c);return Object.freeze({getPublicKey:c,getSharedSecret:d,keygen:f,Point:e,utils:u,lengths:o})}function Ff(e,t,n={}){Bn(t),Ds(n,{},{hmac:"function",lowS:"boolean",randomBytes:"function",bits2int:"function",bits2int_modN:"function"}),n=Object.assign({},n);const r=n.randomBytes||wt,o=n.hmac||((R,x)=>tt(t,R,x)),{Fp:s,Fn:a}=e,{ORDER:i,BITS:c}=a,{keygen:l,getPublicKey:d,getSharedSecret:u,utils:f,lengths:h}=Hf(e,n),p={prehash:!0,lowS:typeof n.lowS=="boolean"?n.lowS:!0,format:"compact",extraEntropy:!1},m=i*qc<s.ORDER;function g(R){const x=i>>Yt;return R>x}function b(R,x){if(!a.isValidNot0(x))throw new Error(`invalid signature ${R}: out of range 1..Point.Fn.ORDER`);return x}function k(){if(m)throw new Error('"recovered" sig type is not supported for cofactor >2 curves')}function T(R,x){ts(x);const L=h.signature,C=x==="compact"?L:x==="recovered"?L+1:void 0;return F(R,C)}class ${r;s;recovery;constructor(x,L,C){if(this.r=b("r",x),this.s=b("s",L),C!=null){if(k(),![0,1,2,3].includes(C))throw new Error("invalid recovery id");this.recovery=C}Object.freeze(this)}static fromBytes(x,L=p.format){T(x,L);let C;if(L==="der"){const{r:U,s:D}=ut.toSig(F(x));return new $(U,D)}L==="recovered"&&(C=x[0],L="compact",x=x.subarray(1));const M=h.signature/2,B=x.subarray(0,M),P=x.subarray(M,M*2);return new $(a.fromBytes(B),a.fromBytes(P),C)}static fromHex(x,L){return this.fromBytes(z(x),L)}assertRecovery(){const{recovery:x}=this;if(x==null)throw new Error("invalid recovery id: must be present");return x}addRecoveryBit(x){return new $(this.r,this.s,x)}recoverPublicKey(x){const{r:L,s:C}=this,M=this.assertRecovery(),B=M===2||M===3?L+i:L;if(!s.isValid(B))throw new Error("invalid recovery id: sig.r+curve.n != R.x");const P=s.toBytes(B),U=e.fromBytes(oe(Hc((M&1)===0),P)),D=a.inv(B),K=N(F(x,void 0,"msgHash")),Y=a.create(-K*D),V=a.create(C*D),ne=e.BASE.multiplyUnsafe(Y).add(U.multiplyUnsafe(V));if(ne.is0())throw new Error("invalid recovery: point at infinify");return ne.assertValidity(),ne}hasHighS(){return g(this.s)}toBytes(x=p.format){if(ts(x),x==="der")return z(ut.hexFromSig(this));const{r:L,s:C}=this,M=a.toBytes(L),B=a.toBytes(C);return x==="recovered"?(k(),oe(Uint8Array.of(this.assertRecovery()),M,B)):oe(M,B)}toHex(x){return q(this.toBytes(x))}}const O=n.bits2int||function(x){if(x.length>8192)throw new Error("input is too large");const L=Un(x),C=x.length*8-c;return C>0?L>>BigInt(C):L},N=n.bits2int_modN||function(x){return a.create(O(x))},w=Us(c);function v(R){return kf("num < 2^"+c,R,Xe,w),a.toBytes(R)}function y(R,x){return F(R,void 0,"message"),x?F(t(R),void 0,"prehashed message"):R}function S(R,x,L){const{lowS:C,prehash:M,extraEntropy:B}=_o(L,p);R=y(R,M);const P=N(R),U=a.fromBytes(x);if(!a.isValidNot0(U))throw new Error("invalid private key");const D=[v(U),v(P)];if(B!=null&&B!==!1){const ne=B===!0?r(h.secretKey):B;D.push(F(ne,void 0,"extraEntropy"))}const K=oe(...D),Y=P;function V(ne){const ie=O(ne);if(!a.isValidNot0(ie))return;const $e=a.inv(ie),re=e.BASE.multiply(ie).toAffine(),ae=a.create(re.x);if(ae===Xe)return;const Fn=a.create($e*a.create(Y+ae*U));if(Fn===Xe)return;let qi=(re.x===ae?0:2)|Number(re.y&Yt),Hi=Fn;return C&&g(Fn)&&(Hi=a.neg(Fn),qi^=1),new $(ae,Hi,m?void 0:qi)}return{seed:K,k2sig:V}}function I(R,x,L={}){const{seed:C,k2sig:M}=S(R,x,L);return xf(t.outputLen,a.BYTES,o)(C,M).toBytes(L.format)}function A(R,x,L,C={}){const{lowS:M,prehash:B,format:P}=_o(C,p);if(L=F(L,void 0,"publicKey"),x=y(x,B),!Ls(R)){const U=R instanceof $?", use sig.toBytes()":"";throw new Error("verify expects Uint8Array signature"+U)}T(R,P);try{const U=$.fromBytes(R,P),D=e.fromBytes(L);if(M&&U.hasHighS())return!1;const{r:K,s:Y}=U,V=N(x),ne=a.inv(Y),ie=a.create(V*ne),$e=a.create(K*ne),re=e.BASE.multiplyUnsafe(ie).add(D.multiplyUnsafe($e));return re.is0()?!1:a.create(re.x)===K}catch{return!1}}function E(R,x,L={}){const{prehash:C}=_o(L,p);return x=y(x,C),$.fromBytes(R,"recovered").recoverPublicKey(x).toBytes()}return Object.freeze({keygen:l,getPublicKey:d,getSharedSecret:u,utils:f,lengths:h,Point:e,sign:I,verify:A,recoverPublicKey:E,Signature:$,hash:t})}const Wr={p:BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),n:BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),h:BigInt(1),a:BigInt(0),b:BigInt(7),Gx:BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),Gy:BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")},Gf={beta:BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),basises:[[BigInt("0x3086d221a7d46bcde86c90e49284eb15"),-BigInt("0xe4437ed6010e88286f547fa90abfe4c3")],[BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"),BigInt("0x3086d221a7d46bcde86c90e49284eb15")]]},Kf=BigInt(0),ns=BigInt(2);function Vf(e){const t=Wr.p,n=BigInt(3),r=BigInt(6),o=BigInt(11),s=BigInt(22),a=BigInt(23),i=BigInt(44),c=BigInt(88),l=e*e*e%t,d=l*l*e%t,u=we(d,n,t)*d%t,f=we(u,n,t)*d%t,h=we(f,ns,t)*l%t,p=we(h,o,t)*h%t,m=we(p,s,t)*p%t,g=we(m,i,t)*m%t,b=we(g,c,t)*g%t,k=we(b,i,t)*m%t,T=we(k,n,t)*d%t,$=we(T,a,t)*p%t,O=we($,r,t)*l%t,N=we(O,ns,t);if(!Cr.eql(Cr.sqr(N),e))throw new Error("Cannot find square root");return N}const Cr=Vr(Wr.p,{sqrt:Vf}),Dt=qf(Wr,{Fp:Cr,endo:Gf}),Ue=Ff(Dt,se),ia={};function Tr(e,...t){let n=ia[e];if(n===void 0){const r=se(wf(e));n=oe(r,r),ia[e]=n}return se(oe(n,...t))}const qs=e=>e.toBytes(!0).slice(1),Hs=e=>e%ns===Kf;function rs(e){const{Fn:t,BASE:n}=Dt,r=t.fromBytes(e),o=n.multiply(r);return{scalar:Hs(o.y)?r:t.neg(r),bytes:qs(o)}}function Gc(e){const t=Cr;if(!t.isValidNot0(e))throw new Error("invalid x: Fail if x ≥ p");const n=t.create(e*e),r=t.create(n*e+BigInt(7));let o=t.sqrt(r);Hs(o)||(o=t.neg(o));const s=Dt.fromAffine({x:e,y:o});return s.assertValidity(),s}const xn=Un;function Kc(...e){return Dt.Fn.create(xn(Tr("BIP0340/challenge",...e)))}function aa(e){return rs(e).bytes}function Wf(e,t,n=wt(32)){const{Fn:r}=Dt,o=F(e,void 0,"message"),{bytes:s,scalar:a}=rs(t),i=F(n,32,"auxRand"),c=r.toBytes(a^xn(Tr("BIP0340/aux",i))),l=Tr("BIP0340/nonce",c,s,o),{bytes:d,scalar:u}=rs(l),f=Kc(d,s,o),h=new Uint8Array(64);if(h.set(d,0),h.set(r.toBytes(r.create(u+f*a)),32),!Vc(h,o,s))throw new Error("sign: Invalid signature produced");return h}function Vc(e,t,n){const{Fp:r,Fn:o,BASE:s}=Dt,a=F(e,64,"signature"),i=F(t,void 0,"message"),c=F(n,32,"publicKey");try{const l=Gc(xn(c)),d=xn(a.subarray(0,32));if(!r.isValidNot0(d))return!1;const u=xn(a.subarray(32,64));if(!o.isValidNot0(u))return!1;const f=Kc(o.toBytes(d),qs(l),i),h=s.multiplyUnsafe(u).add(l.multiplyUnsafe(o.neg(f))),{x:p,y:m}=h.toAffine();return!(h.is0()||!Hs(m)||p!==d)}catch{return!1}}const Q=(()=>{const n=(r=wt(48))=>Pc(r,Wr.n);return{keygen:jc(n,aa),getPublicKey:aa,sign:Wf,verify:Vc,Point:Dt,utils:{randomSecretKey:n,taggedHash:Tr,lift_x:Gc,pointToBytes:qs},lengths:{secretKey:32,publicKey:32,publicKeyHasPrefix:!1,signature:64,seed:48}}})(),zf=Uint8Array.from([7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8]),Wc=Uint8Array.from(new Array(16).fill(0).map((e,t)=>t)),Jf=Wc.map(e=>(9*e+5)%16),zc=(()=>{const n=[[Wc],[Jf]];for(let r=0;r<4;r++)for(let o of n)o.push(o[r].map(s=>zf[s]));return n})(),Jc=zc[0],Yc=zc[1],Zc=[[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8],[12,13,11,15,6,9,9,7,12,15,11,13,7,8,7,7],[13,15,14,11,7,7,6,8,13,14,13,12,5,5,6,9],[14,11,12,14,8,6,5,5,15,12,15,14,9,9,8,6],[15,12,13,13,9,5,8,6,14,11,12,11,8,6,5,5]].map(e=>Uint8Array.from(e)),Yf=Jc.map((e,t)=>e.map(n=>Zc[t][n])),Zf=Yc.map((e,t)=>e.map(n=>Zc[t][n])),Xf=Uint32Array.from([0,1518500249,1859775393,2400959708,2840853838]),Qf=Uint32Array.from([1352829926,1548603684,1836072691,2053994217,0]);function ca(e,t,n,r){return e===0?t^n^r:e===1?t&n|~t&r:e===2?(t|~n)^r:e===3?t&r|n&~r:t^(n|~r)}const Zn=new Uint32Array(16);class eh extends $s{h0=1732584193;h1=-271733879;h2=-1732584194;h3=271733878;h4=-1009589776;constructor(){super(64,20,8,!0)}get(){const{h0:t,h1:n,h2:r,h3:o,h4:s}=this;return[t,n,r,o,s]}set(t,n,r,o,s){this.h0=t|0,this.h1=n|0,this.h2=r|0,this.h3=o|0,this.h4=s|0}process(t,n){for(let h=0;h<16;h++,n+=4)Zn[h]=t.getUint32(n,!0);let r=this.h0|0,o=r,s=this.h1|0,a=s,i=this.h2|0,c=i,l=this.h3|0,d=l,u=this.h4|0,f=u;for(let h=0;h<5;h++){const p=4-h,m=Xf[h],g=Qf[h],b=Jc[h],k=Yc[h],T=Yf[h],$=Zf[h];for(let O=0;O<16;O++){const N=Gn(r+ca(h,s,i,l)+Zn[b[O]]+m,T[O])+u|0;r=u,u=l,l=Gn(i,10)|0,i=s,s=N}for(let O=0;O<16;O++){const N=Gn(o+ca(p,a,c,d)+Zn[k[O]]+g,$[O])+f|0;o=f,f=d,d=Gn(c,10)|0,c=a,a=N}}this.set(this.h1+i+d|0,this.h2+l+f|0,this.h3+u+o|0,this.h4+r+a|0,this.h0+s+c|0)}roundClean(){He(Zn)}destroy(){this.destroyed=!0,He(this.buffer),this.set(0,0,0,0,0)}}const th=Ns(()=>new eh);const bn=Ue.Point,{Fn:hn}=bn,xo=lf(se),nh=Uint8Array.from("Bitcoin seed".split(""),e=>e.charCodeAt(0)),So={private:76066276,public:76067358},Io=2147483648,rh=e=>th(se(e)),oh=e=>Nt(e).getUint32(0,!1),Xn=e=>{if(!Number.isSafeInteger(e)||e<0||e>2**32-1)throw new Error("invalid number, should be from 0 to 2**32-1, got "+e);const t=new Uint8Array(4);return Nt(t).setUint32(0,e,!1),t};class St{get fingerprint(){if(!this.pubHash)throw new Error("No publicKey set!");return oh(this.pubHash)}get identifier(){return this.pubHash}get pubKeyHash(){return this.pubHash}get privateKey(){return this._privateKey||null}get publicKey(){return this._publicKey||null}get privateExtendedKey(){const t=this._privateKey;if(!t)throw new Error("No private key");return xo.encode(this.serialize(this.versions.private,oe(Uint8Array.of(0),t)))}get publicExtendedKey(){if(!this._publicKey)throw new Error("No public key");return xo.encode(this.serialize(this.versions.public,this._publicKey))}static fromMasterSeed(t,n=So){if(F(t),8*t.length<128||8*t.length>512)throw new Error("HDKey: seed length must be between 128 and 512 bits; 256 bits is advised, got "+t.length);const r=tt(Zo,nh,t),o=r.slice(0,32),s=r.slice(32);return new St({versions:n,chainCode:s,privateKey:o})}static fromExtendedKey(t,n=So){const r=xo.decode(t),o=Nt(r),s=o.getUint32(0,!1),a={versions:n,depth:r[4],parentFingerprint:o.getUint32(5,!1),index:o.getUint32(9,!1),chainCode:r.slice(13,45)},i=r.slice(45),c=i[0]===0;if(s!==n[c?"private":"public"])throw new Error("Version mismatch");return c?new St({...a,privateKey:i.slice(1)}):new St({...a,publicKey:i})}static fromJSON(t){return St.fromExtendedKey(t.xpriv)}versions;depth=0;index=0;chainCode=null;parentFingerprint=0;_privateKey;_publicKey;pubHash;constructor(t){if(!t||typeof t!="object")throw new Error("HDKey.constructor must not be called directly");if(this.versions=t.versions||So,this.depth=t.depth||0,this.chainCode=t.chainCode||null,this.index=t.index||0,this.parentFingerprint=t.parentFingerprint||0,!this.depth&&(this.parentFingerprint||this.index))throw new Error("HDKey: zero depth with non-zero index/parent fingerprint");if(this.depth>255)throw new Error("HDKey: depth exceeds the serializable value 255");if(t.publicKey&&t.privateKey)throw new Error("HDKey: publicKey and privateKey at same time.");if(t.privateKey){if(!Ue.utils.isValidSecretKey(t.privateKey))throw new Error("Invalid private key");this._privateKey=t.privateKey,this._publicKey=Ue.getPublicKey(t.privateKey,!0)}else if(t.publicKey)this._publicKey=bn.fromBytes(t.publicKey).toBytes(!0);else throw new Error("HDKey: no public or private key provided");this.pubHash=rh(this._publicKey)}derive(t){if(!/^[mM]'?/.test(t))throw new Error('Path must start with "m" or "M"');if(/^[mM]'?$/.test(t))return this;const n=t.replace(/^[mM]'?\//,"").split("/");let r=this;for(const o of n){const s=/^(\d+)('?)$/.exec(o),a=s&&s[1];if(!s||s.length!==3||typeof a!="string")throw new Error("invalid child index: "+o);let i=+a;if(!Number.isSafeInteger(i)||i>=Io)throw new Error("Invalid index");s[2]==="'"&&(i+=Io),r=r.deriveChild(i)}return r}deriveChild(t){if(!this._publicKey||!this.chainCode)throw new Error("No publicKey or chainCode set");let n=Xn(t);if(t>=Io){const c=this._privateKey;if(!c)throw new Error("Could not derive hardened child key");n=oe(Uint8Array.of(0),c,n)}else n=oe(this._publicKey,n);const r=tt(Zo,this.chainCode,n),o=r.slice(0,32),s=r.slice(32);if(!Ue.utils.isValidSecretKey(o))throw new Error("Tweak bigger than curve order");const a={versions:this.versions,chainCode:s,depth:this.depth+1,parentFingerprint:this.fingerprint,index:t},i=hn.fromBytes(o);try{if(this._privateKey){const c=hn.create(hn.fromBytes(this._privateKey)+i);if(!hn.isValidNot0(c))throw new Error("The tweak was out of range or the resulted private key is invalid");a.privateKey=hn.toBytes(c)}else{const c=bn.fromBytes(this._publicKey).add(bn.BASE.multiply(i));if(c.equals(bn.ZERO))throw new Error("The tweak was equal to negative P, which made the result key invalid");a.publicKey=c.toBytes(!0)}return new St(a)}catch{return this.deriveChild(t+1)}}sign(t){if(!this._privateKey)throw new Error("No privateKey set!");return F(t,32),Ue.sign(t,this._privateKey,{prehash:!1})}verify(t,n){if(F(t,32),F(n,64),!this._publicKey)throw new Error("No publicKey set!");return Ue.verify(n,t,this._publicKey,{prehash:!1})}wipePrivateData(){return this._privateKey&&(this._privateKey.fill(0),this._privateKey=void 0),this}toJSON(){return{xpriv:this.privateExtendedKey,xpub:this.publicExtendedKey}}serialize(t,n){if(!this.chainCode)throw new Error("No chainCode set");return F(n,33),oe(Xn(t),new Uint8Array([this.depth]),Xn(this.parentFingerprint),Xn(this.index),this.chainCode,n)}}function sh(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array"}function la(e){if(typeof e!="boolean")throw new Error(`boolean expected, not ${e}`)}function Ro(e){if(!Number.isSafeInteger(e)||e<0)throw new Error("positive integer expected, got "+e)}function pe(e,t,n=""){const r=sh(e),o=e?.length,s=t!==void 0;if(!r||s&&o!==t){const a=n&&`"${n}" `,i=s?` of length ${t}`:"",c=r?`length=${o}`:`type=${typeof e}`;throw new Error(a+"expected Uint8Array"+i+", got "+c)}return e}function ue(e){return new Uint32Array(e.buffer,e.byteOffset,Math.floor(e.byteLength/4))}function rn(...e){for(let t=0;t<e.length;t++)e[t].fill(0)}const ih=new Uint8Array(new Uint32Array([287454020]).buffer)[0]===68;function ah(e,t){return e.buffer===t.buffer&&e.byteOffset<t.byteOffset+t.byteLength&&t.byteOffset<e.byteOffset+e.byteLength}function Xc(e,t){if(ah(e,t)&&e.byteOffset<t.byteOffset)throw new Error("complex overlap of input and output is not supported")}function ch(e,t){if(t==null||typeof t!="object")throw new Error("options must be defined");return Object.assign(e,t)}function Qc(e,t){if(e.length!==t.length)return!1;let n=0;for(let r=0;r<e.length;r++)n|=e[r]^t[r];return n===0}const lh=(e,t)=>{function n(r,...o){if(pe(r,void 0,"key"),!ih)throw new Error("Non little-endian hardware is not yet supported");if(e.nonceLength!==void 0){const d=o[0];pe(d,e.varSizeNonce?void 0:e.nonceLength,"nonce")}const s=e.tagLength;s&&o[1]!==void 0&&pe(o[1],void 0,"AAD");const a=t(r,...o),i=(d,u)=>{if(u!==void 0){if(d!==2)throw new Error("cipher output not supported");pe(u,void 0,"output")}};let c=!1;return{encrypt(d,u){if(c)throw new Error("cannot encrypt() twice with same key + nonce");return c=!0,pe(d),i(a.encrypt.length,u),a.encrypt(d,u)},decrypt(d,u){if(pe(d),s&&d.length<s)throw new Error('"ciphertext" expected length bigger than tagLength='+s);return i(a.decrypt.length,u),a.decrypt(d,u)}}}return Object.assign(n,e),n};function el(e,t,n=!0){if(t===void 0)return new Uint8Array(e);if(t.length!==e)throw new Error('"output" expected Uint8Array of length '+e+", got: "+t.length);if(n&&!Zt(t))throw new Error("invalid output, must be aligned");return t}function Zt(e){return e.byteOffset%4===0}function $t(e){return Uint8Array.from(e)}const mt=16,dh=283;function uh(e){if(![16,24,32].includes(e.length))throw new Error('"aes key" expected Uint8Array of length 16/24/32, got length='+e.length)}function Fs(e){return e<<1^dh&-(e>>7)}function Jt(e,t){let n=0;for(;t>0;t>>=1)n^=e&-(t&1),e=Fs(e);return n}const os=(()=>{const e=new Uint8Array(256);for(let n=0,r=1;n<256;n++,r^=Fs(r))e[n]=r;const t=new Uint8Array(256);t[0]=99;for(let n=0;n<255;n++){let r=e[255-n];r|=r<<8,t[e[n]]=(r^r>>4^r>>5^r>>6^r>>7^99)&255}return rn(e),t})(),fh=os.map((e,t)=>os.indexOf(t)),hh=e=>e<<24|e>>>8,Ao=e=>e<<8|e>>>24;function tl(e,t){if(e.length!==256)throw new Error("Wrong sbox length");const n=new Uint32Array(256).map((l,d)=>t(e[d])),r=n.map(Ao),o=r.map(Ao),s=o.map(Ao),a=new Uint32Array(256*256),i=new Uint32Array(256*256),c=new Uint16Array(256*256);for(let l=0;l<256;l++)for(let d=0;d<256;d++){const u=l*256+d;a[u]=n[l]^r[d],i[u]=o[l]^s[d],c[u]=e[l]<<8|e[d]}return{sbox:e,sbox2:c,T0:n,T1:r,T2:o,T3:s,T01:a,T23:i}}const Gs=tl(os,e=>Jt(e,3)<<24|e<<16|e<<8|Jt(e,2)),nl=tl(fh,e=>Jt(e,11)<<24|Jt(e,13)<<16|Jt(e,9)<<8|Jt(e,14)),ph=(()=>{const e=new Uint8Array(16);for(let t=0,n=1;t<16;t++,n=Fs(n))e[t]=n;return e})();function rl(e){pe(e);const t=e.length;uh(e);const{sbox2:n}=Gs,r=[];Zt(e)||r.push(e=$t(e));const o=ue(e),s=o.length,a=c=>je(n,c,c,c,c),i=new Uint32Array(t+28);i.set(o);for(let c=s;c<i.length;c++){let l=i[c-1];c%s===0?l=a(hh(l))^ph[c/s-1]:s>6&&c%s===4&&(l=a(l)),i[c]=i[c-s]^l}return rn(...r),i}function mh(e){const t=rl(e),n=t.slice(),r=t.length,{sbox2:o}=Gs,{T0:s,T1:a,T2:i,T3:c}=nl;for(let l=0;l<r;l+=4)for(let d=0;d<4;d++)n[l+d]=t[r-l-4+d];rn(t);for(let l=4;l<r-4;l++){const d=n[l],u=je(o,d,d,d,d);n[l]=s[u&255]^a[u>>>8&255]^i[u>>>16&255]^c[u>>>24]}return n}function ht(e,t,n,r,o,s){return e[n<<8&65280|r>>>8&255]^t[o>>>8&65280|s>>>24&255]}function je(e,t,n,r,o){return e[t&255|n&65280]|e[r>>>16&255|o>>>16&65280]<<16}function da(e,t,n,r,o){const{sbox2:s,T01:a,T23:i}=Gs;let c=0;t^=e[c++],n^=e[c++],r^=e[c++],o^=e[c++];const l=e.length/4-2;for(let p=0;p<l;p++){const m=e[c++]^ht(a,i,t,n,r,o),g=e[c++]^ht(a,i,n,r,o,t),b=e[c++]^ht(a,i,r,o,t,n),k=e[c++]^ht(a,i,o,t,n,r);t=m,n=g,r=b,o=k}const d=e[c++]^je(s,t,n,r,o),u=e[c++]^je(s,n,r,o,t),f=e[c++]^je(s,r,o,t,n),h=e[c++]^je(s,o,t,n,r);return{s0:d,s1:u,s2:f,s3:h}}function yh(e,t,n,r,o){const{sbox2:s,T01:a,T23:i}=nl;let c=0;t^=e[c++],n^=e[c++],r^=e[c++],o^=e[c++];const l=e.length/4-2;for(let p=0;p<l;p++){const m=e[c++]^ht(a,i,t,o,r,n),g=e[c++]^ht(a,i,n,t,o,r),b=e[c++]^ht(a,i,r,n,t,o),k=e[c++]^ht(a,i,o,r,n,t);t=m,n=g,r=b,o=k}const d=e[c++]^je(s,t,o,r,n),u=e[c++]^je(s,n,t,o,r),f=e[c++]^je(s,r,n,t,o),h=e[c++]^je(s,o,r,n,t);return{s0:d,s1:u,s2:f,s3:h}}function gh(e){if(pe(e),e.length%mt!==0)throw new Error("aes-(cbc/ecb).decrypt ciphertext should consist of blocks with size "+mt)}function bh(e,t,n){pe(e);let r=e.length;const o=r%mt;if(!t&&o!==0)throw new Error("aec/(cbc-ecb): unpadded plaintext with disabled padding");Zt(e)||(e=$t(e));const s=ue(e);if(t){let i=mt-o;i||(i=mt),r=r+i}n=el(r,n),Xc(e,n);const a=ue(n);return{b:s,o:a,out:n}}function vh(e,t){if(!t)return e;const n=e.length;if(!n)throw new Error("aes/pcks5: empty ciphertext not allowed");const r=e[n-1];if(r<=0||r>16)throw new Error("aes/pcks5: wrong padding");const o=e.subarray(0,-r);for(let s=0;s<r;s++)if(e[n-s-1]!==r)throw new Error("aes/pcks5: wrong padding");return o}function wh(e){const t=new Uint8Array(16),n=ue(t);t.set(e);const r=mt-e.length;for(let o=mt-r;o<mt;o++)t[o]=r;return n}const ol=lh({blockSize:16,nonceLength:16},function(t,n,r={}){const o=!r.disablePadding;return{encrypt(s,a){const i=rl(t),{b:c,o:l,out:d}=bh(s,o,a);let u=n;const f=[i];Zt(u)||f.push(u=$t(u));const h=ue(u);let p=h[0],m=h[1],g=h[2],b=h[3],k=0;for(;k+4<=c.length;)p^=c[k+0],m^=c[k+1],g^=c[k+2],b^=c[k+3],{s0:p,s1:m,s2:g,s3:b}=da(i,p,m,g,b),l[k++]=p,l[k++]=m,l[k++]=g,l[k++]=b;if(o){const T=wh(s.subarray(k*4));p^=T[0],m^=T[1],g^=T[2],b^=T[3],{s0:p,s1:m,s2:g,s3:b}=da(i,p,m,g,b),l[k++]=p,l[k++]=m,l[k++]=g,l[k++]=b}return rn(...f),d},decrypt(s,a){gh(s);const i=mh(t);let c=n;const l=[i];Zt(c)||l.push(c=$t(c));const d=ue(c);a=el(s.length,a),Zt(s)||l.push(s=$t(s)),Xc(s,a);const u=ue(s),f=ue(a);let h=d[0],p=d[1],m=d[2],g=d[3];for(let b=0;b+4<=u.length;){const k=h,T=p,$=m,O=g;h=u[b+0],p=u[b+1],m=u[b+2],g=u[b+3];const{s0:N,s1:w,s2:v,s3:y}=yh(i,h,p,m,g);f[b++]=N^k,f[b++]=w^T,f[b++]=v^$,f[b++]=y^O}return rn(...l),vh(a,o)}}}),sl=e=>Uint8Array.from(e.split(""),t=>t.charCodeAt(0)),Eh=sl("expand 16-byte k"),kh=sl("expand 32-byte k"),_h=ue(Eh),xh=ue(kh);function W(e,t){return e<<t|e>>>32-t}function ss(e){return e.byteOffset%4===0}const Qn=64,Sh=16,il=2**32-1,ua=Uint32Array.of();function Ih(e,t,n,r,o,s,a,i){const c=o.length,l=new Uint8Array(Qn),d=ue(l),u=ss(o)&&ss(s),f=u?ue(o):ua,h=u?ue(s):ua;for(let p=0;p<c;a++){if(e(t,n,r,d,a,i),a>=il)throw new Error("arx: counter overflow");const m=Math.min(Qn,c-p);if(u&&m===Qn){const g=p/4;if(p%4!==0)throw new Error("arx: invalid block position");for(let b=0,k;b<Sh;b++)k=g+b,h[k]=f[k]^d[b];p+=Qn;continue}for(let g=0,b;g<m;g++)b=p+g,s[b]=o[b]^l[g];p+=m}}function Rh(e,t){const{allowShortKeys:n,extendNonceFn:r,counterLength:o,counterRight:s,rounds:a}=ch({allowShortKeys:!1,counterLength:8,counterRight:!1,rounds:20},t);if(typeof e!="function")throw new Error("core must be a function");return Ro(o),Ro(a),la(s),la(n),(i,c,l,d,u=0)=>{pe(i,void 0,"key"),pe(c,void 0,"nonce"),pe(l,void 0,"data");const f=l.length;if(d===void 0&&(d=new Uint8Array(f)),pe(d,void 0,"output"),Ro(u),u<0||u>=il)throw new Error("arx: counter overflow");if(d.length<f)throw new Error(`arx: output (${d.length}) is shorter than data (${f})`);const h=[];let p=i.length,m,g;if(p===32)h.push(m=$t(i)),g=xh;else if(p===16&&n)m=new Uint8Array(32),m.set(i),m.set(i,16),g=_h,h.push(m);else throw pe(i,32,"arx key"),new Error("invalid key size");ss(c)||h.push(c=$t(c));const b=ue(m);if(r){if(c.length!==24)throw new Error("arx: extended nonce must be 24 bytes");r(g,b,ue(c.subarray(0,16)),b),c=c.subarray(16)}const k=16-o;if(k!==c.length)throw new Error(`arx: nonce must be ${k} or 16 bytes`);if(k!==12){const $=new Uint8Array(12);$.set(c,s?0:12-c.length),c=$,h.push(c)}const T=ue(c);return Ih(e,g,b,T,l,d,u,a),rn(...h),d}}function Ah(e,t,n,r,o,s=20){let a=e[0],i=e[1],c=e[2],l=e[3],d=t[0],u=t[1],f=t[2],h=t[3],p=t[4],m=t[5],g=t[6],b=t[7],k=o,T=n[0],$=n[1],O=n[2],N=a,w=i,v=c,y=l,S=d,I=u,A=f,E=h,R=p,x=m,L=g,C=b,M=k,B=T,P=$,U=O;for(let K=0;K<s;K+=2)N=N+S|0,M=W(M^N,16),R=R+M|0,S=W(S^R,12),N=N+S|0,M=W(M^N,8),R=R+M|0,S=W(S^R,7),w=w+I|0,B=W(B^w,16),x=x+B|0,I=W(I^x,12),w=w+I|0,B=W(B^w,8),x=x+B|0,I=W(I^x,7),v=v+A|0,P=W(P^v,16),L=L+P|0,A=W(A^L,12),v=v+A|0,P=W(P^v,8),L=L+P|0,A=W(A^L,7),y=y+E|0,U=W(U^y,16),C=C+U|0,E=W(E^C,12),y=y+E|0,U=W(U^y,8),C=C+U|0,E=W(E^C,7),N=N+I|0,U=W(U^N,16),L=L+U|0,I=W(I^L,12),N=N+I|0,U=W(U^N,8),L=L+U|0,I=W(I^L,7),w=w+A|0,M=W(M^w,16),C=C+M|0,A=W(A^C,12),w=w+A|0,M=W(M^w,8),C=C+M|0,A=W(A^C,7),v=v+E|0,B=W(B^v,16),R=R+B|0,E=W(E^R,12),v=v+E|0,B=W(B^v,8),R=R+B|0,E=W(E^R,7),y=y+S|0,P=W(P^y,16),x=x+P|0,S=W(S^x,12),y=y+S|0,P=W(P^y,8),x=x+P|0,S=W(S^x,7);let D=0;r[D++]=a+N|0,r[D++]=i+w|0,r[D++]=c+v|0,r[D++]=l+y|0,r[D++]=d+S|0,r[D++]=u+I|0,r[D++]=f+A|0,r[D++]=h+E|0,r[D++]=p+R|0,r[D++]=m+x|0,r[D++]=g+L|0,r[D++]=b+C|0,r[D++]=k+M|0,r[D++]=T+B|0,r[D++]=$+P|0,r[D++]=O+U|0}const zr=Rh(Ah,{counterRight:!1,counterLength:4,allowShortKeys:!1});function al(e,t,n){return Bn(e),n===void 0&&(n=new Uint8Array(e.outputLen)),tt(e,n,t)}const Co=Uint8Array.of(0),fa=Uint8Array.of();function cl(e,t,n,r=32){Bn(e),xe(r,"length");const o=e.outputLen;if(r>255*o)throw new Error("Length must be <= 255*HashLen");const s=Math.ceil(r/o);n===void 0?n=fa:F(n,void 0,"info");const a=new Uint8Array(s*o),i=tt.create(e,t),c=i._cloneInto(),l=new Uint8Array(i.outputLen);for(let d=0;d<s;d++)Co[0]=d+1,c.update(d===0?fa:l).update(n).update(Co).digestInto(l),a.set(l,o*d),i._cloneInto(c);return i.destroy(),c.destroy(),He(l,Co),a.slice(0,r)}var Ch=Object.defineProperty,Z=(e,t)=>{for(var n in t)Ch(e,n,{get:t[n],enumerable:!0})},Ft=Symbol("verified"),Th=e=>e instanceof Object;function Ks(e){if(!Th(e)||typeof e.kind!="number"||typeof e.content!="string"||typeof e.created_at!="number"||typeof e.pubkey!="string"||!e.pubkey.match(/^[a-f0-9]{64}$/)||!Array.isArray(e.tags))return!1;for(let t=0;t<e.tags.length;t++){let n=e.tags[t];if(!Array.isArray(n))return!1;for(let r=0;r<n.length;r++)if(typeof n[r]!="string")return!1}return!0}var Lh={};Z(Lh,{binarySearch:()=>Vs,bytesToHex:()=>q,hexToBytes:()=>z,insertEventIntoAscendingList:()=>Mh,insertEventIntoDescendingList:()=>$h,mergeReverseSortedLists:()=>Oh,normalizeURL:()=>Nh,utf8Decoder:()=>Qe,utf8Encoder:()=>Se});var Qe=new TextDecoder("utf-8"),Se=new TextEncoder;function Nh(e){try{e.indexOf("://")===-1&&(e="wss://"+e);let t=new URL(e);return t.protocol==="http:"?t.protocol="ws:":t.protocol==="https:"&&(t.protocol="wss:"),t.pathname=t.pathname.replace(/\/+/g,"/"),t.pathname.endsWith("/")&&(t.pathname=t.pathname.slice(0,-1)),(t.port==="80"&&t.protocol==="ws:"||t.port==="443"&&t.protocol==="wss:")&&(t.port=""),t.searchParams.sort(),t.hash="",t.toString()}catch{throw new Error(`Invalid URL: ${e}`)}}function $h(e,t){const[n,r]=Vs(e,o=>t.id===o.id?0:t.created_at===o.created_at?-1:o.created_at-t.created_at);return r||e.splice(n,0,t),e}function Mh(e,t){const[n,r]=Vs(e,o=>t.id===o.id?0:t.created_at===o.created_at?-1:t.created_at-o.created_at);return r||e.splice(n,0,t),e}function Vs(e,t){let n=0,r=e.length-1;for(;n<=r;){const o=Math.floor((n+r)/2),s=t(e[o]);if(s===0)return[o,!0];s<0?r=o-1:n=o+1}return[n,!1]}function Oh(e,t){const n=new Array(e.length+t.length);n.length=0;let r=0,o=0,s=[];for(;r<e.length&&o<t.length;){let a;if(e[r]?.created_at>t[o]?.created_at?(a=e[r],r++):(a=t[o],o++),n.length>0&&n[n.length-1].created_at===a.created_at){if(s.includes(a.id))continue}else s.length=0;n.push(a),s.push(a.id)}for(;r<e.length;){const a=e[r];if(r++,n.length>0&&n[n.length-1].created_at===a.created_at){if(s.includes(a.id))continue}else s.length=0;n.push(a),s.push(a.id)}for(;o<t.length;){const a=t[o];if(o++,n.length>0&&n[n.length-1].created_at===a.created_at){if(s.includes(a.id))continue}else s.length=0;n.push(a),s.push(a.id)}return n}var Bh=class{generateSecretKey(){return Q.utils.randomSecretKey()}getPublicKey(t){return q(Q.getPublicKey(t))}finalizeEvent(t,n){const r=t;return r.pubkey=q(Q.getPublicKey(n)),r.id=ur(r),r.sig=q(Q.sign(z(ur(r)),n)),r[Ft]=!0,r}verifyEvent(t){if(typeof t[Ft]=="boolean")return t[Ft];try{const n=ur(t);if(n!==t.id)return t[Ft]=!1,!1;const r=Q.verify(z(t.sig),z(n),z(t.pubkey));return t[Ft]=r,r}catch{return t[Ft]=!1,!1}}};function Ph(e){if(!Ks(e))throw new Error("can't serialize event with wrong or missing properties");return JSON.stringify([0,e.pubkey,e.created_at,e.kind,e.tags,e.content])}function ur(e){let t=se(Se.encode(Ph(e)));return q(t)}var Jr=new Bh,Uh=Jr.generateSecretKey,Yr=Jr.getPublicKey,Ve=Jr.finalizeEvent,Ws=Jr.verifyEvent,Dh={};Z(Dh,{Application:()=>Zp,BadgeAward:()=>Wh,BadgeDefinition:()=>Gp,BlockedRelaysList:()=>Ip,BlossomServerList:()=>$p,BookmarkList:()=>_p,Bookmarksets:()=>qp,Calendar:()=>om,CalendarEventRSVP:()=>sm,ChannelCreation:()=>pl,ChannelHideMessage:()=>gl,ChannelMessage:()=>yl,ChannelMetadata:()=>ml,ChannelMuteUser:()=>bl,ChatMessage:()=>zh,ClassifiedListing:()=>em,ClientAuth:()=>wl,Comment:()=>rp,CommunitiesList:()=>xp,CommunityDefinition:()=>lm,CommunityPostApproval:()=>up,Contacts:()=>Gh,CreateOrUpdateProduct:()=>Wp,CreateOrUpdateStall:()=>Vp,Curationsets:()=>Hp,Date:()=>nm,DirectMessageRelaysList:()=>Lp,DraftClassifiedListing:()=>tm,DraftLong:()=>Jp,Emojisets:()=>Yp,EncryptedDirectMessage:()=>Kh,EventDeletion:()=>Vh,FavoriteRelays:()=>Ap,FileMessage:()=>Yh,FileMetadata:()=>np,FileServerPreference:()=>Np,Followsets:()=>Up,ForumThread:()=>Jh,GenericRepost:()=>Xs,Genericlists:()=>Dp,GiftWrap:()=>vl,GroupMetadata:()=>dm,HTTPAuth:()=>Qs,Handlerinformation:()=>cm,Handlerrecommendation:()=>am,Highlights:()=>bp,InterestsList:()=>Cp,Interestsets:()=>Kp,JobFeedback:()=>pp,JobRequest:()=>fp,JobResult:()=>hp,Label:()=>dp,LightningPubRPC:()=>Op,LiveChatMessage:()=>op,LiveEvent:()=>Xp,LongFormArticle:()=>zp,Metadata:()=>Hh,Mutelist:()=>wp,NWCWalletInfo:()=>Mp,NWCWalletRequest:()=>El,NWCWalletResponse:()=>Bp,NormalVideo:()=>Xh,NostrConnect:()=>Pp,OpenTimestamps:()=>ep,Photo:()=>Zh,Pinlist:()=>Ep,Poll:()=>tp,PollResponse:()=>vp,PrivateDirectMessage:()=>hl,ProblemTracker:()=>ap,ProfileBadges:()=>Fp,PublicChatsList:()=>Sp,Reaction:()=>Zs,RecommendRelay:()=>Fh,RelayList:()=>kp,RelayReview:()=>im,Relaysets:()=>jp,Report:()=>cp,Reporting:()=>lp,Repost:()=>Ys,Seal:()=>fl,SearchRelaysList:()=>Rp,ShortTextNote:()=>ul,ShortVideo:()=>Qh,Time:()=>rm,UserEmojiList:()=>Tp,UserStatuses:()=>Qp,Voice:()=>sp,VoiceComment:()=>ip,Zap:()=>gp,ZapGoal:()=>mp,ZapRequest:()=>yp,classifyKind:()=>jh,isAddressableKind:()=>Js,isEphemeralKind:()=>dl,isKind:()=>qh,isRegularKind:()=>ll,isReplaceableKind:()=>zs});function ll(e){return e<1e4&&e!==0&&e!==3}function zs(e){return e===0||e===3||1e4<=e&&e<2e4}function dl(e){return 2e4<=e&&e<3e4}function Js(e){return 3e4<=e&&e<4e4}function jh(e){return ll(e)?"regular":zs(e)?"replaceable":dl(e)?"ephemeral":Js(e)?"parameterized":"unknown"}function qh(e,t){const n=t instanceof Array?t:[t];return Ks(e)&&n.includes(e.kind)||!1}var Hh=0,ul=1,Fh=2,Gh=3,Kh=4,Vh=5,Ys=6,Zs=7,Wh=8,zh=9,Jh=11,fl=13,hl=14,Yh=15,Xs=16,Zh=20,Xh=21,Qh=22,pl=40,ml=41,yl=42,gl=43,bl=44,ep=1040,vl=1059,tp=1068,np=1063,rp=1111,op=1311,sp=1222,ip=1244,ap=1971,cp=1984,lp=1984,dp=1985,up=4550,fp=5999,hp=6999,pp=7e3,mp=9041,yp=9734,gp=9735,bp=9802,vp=1018,wp=1e4,Ep=10001,kp=10002,_p=10003,xp=10004,Sp=10005,Ip=10006,Rp=10007,Ap=10012,Cp=10015,Tp=10030,Lp=10050,Np=10096,$p=10063,Mp=13194,Op=21e3,wl=22242,El=23194,Bp=23195,Pp=24133,Qs=27235,Up=3e4,Dp=30001,jp=30002,qp=30003,Hp=30004,Fp=30008,Gp=30009,Kp=30015,Vp=30017,Wp=30018,zp=30023,Jp=30024,Yp=30030,Zp=30078,Xp=30311,Qp=30315,em=30402,tm=30403,nm=31922,rm=31923,om=31924,sm=31925,im=31987,am=31989,cm=31990,lm=34550,dm=39e3,um={};Z(um,{getHex64:()=>ei,getInt:()=>kl,getSubscriptionId:()=>fm,matchEventId:()=>hm,matchEventKind:()=>mm,matchEventPubkey:()=>pm});function ei(e,t){let n=t.length+3,r=e.indexOf(`"${t}":`)+n,o=e.slice(r).indexOf('"')+r+1;return e.slice(o,o+64)}function kl(e,t){let n=t.length,r=e.indexOf(`"${t}":`)+n+3,o=e.slice(r),s=Math.min(o.indexOf(","),o.indexOf("}"));return parseInt(o.slice(0,s),10)}function fm(e){let t=e.slice(0,22).indexOf('"EVENT"');if(t===-1)return null;let n=e.slice(t+7+1).indexOf('"');if(n===-1)return null;let r=t+7+1+n,o=e.slice(r+1,80).indexOf('"');if(o===-1)return null;let s=r+1+o;return e.slice(r+1,s)}function hm(e,t){return t===ei(e,"id")}function pm(e,t){return t===ei(e,"pubkey")}function mm(e,t){return t===kl(e,"kind")}var ym={};Z(ym,{makeAuthEvent:()=>gm});function gm(e,t){return{kind:wl,created_at:Math.floor(Date.now()/1e3),tags:[["relay",e],["challenge",t]],content:""}}var bm;try{bm=WebSocket}catch{}var vm;try{vm=WebSocket}catch{}var wm={};Z(wm,{BECH32_REGEX:()=>_l,Bech32MaxSize:()=>ti,NostrTypeGuard:()=>Em,decode:()=>Zr,decodeNostrURI:()=>_m,encodeBytes:()=>Qr,naddrEncode:()=>Cm,neventEncode:()=>Am,noteEncode:()=>Im,nprofileEncode:()=>Rm,npubEncode:()=>Sm,nsecEncode:()=>xm});var Em={isNProfile:e=>/^nprofile1[a-z\d]+$/.test(e||""),isNEvent:e=>/^nevent1[a-z\d]+$/.test(e||""),isNAddr:e=>/^naddr1[a-z\d]+$/.test(e||""),isNSec:e=>/^nsec1[a-z\d]{58}$/.test(e||""),isNPub:e=>/^npub1[a-z\d]{58}$/.test(e||""),isNote:e=>/^note1[a-z\d]+$/.test(e||""),isNcryptsec:e=>/^ncryptsec1[a-z\d]+$/.test(e||"")},ti=5e3,_l=/[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;function km(e){const t=new Uint8Array(4);return t[0]=e>>24&255,t[1]=e>>16&255,t[2]=e>>8&255,t[3]=e&255,t}function _m(e){try{return e.startsWith("nostr:")&&(e=e.substring(6)),Zr(e)}catch{return{type:"invalid",data:null}}}function Zr(e){let{prefix:t,words:n}=Ge.decode(e,ti),r=new Uint8Array(Ge.fromWords(n));switch(t){case"nprofile":{let o=To(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for nprofile");if(o[0][0].length!==32)throw new Error("TLV 0 should be 32 bytes");return{type:"nprofile",data:{pubkey:q(o[0][0]),relays:o[1]?o[1].map(s=>Qe.decode(s)):[]}}}case"nevent":{let o=To(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for nevent");if(o[0][0].length!==32)throw new Error("TLV 0 should be 32 bytes");if(o[2]&&o[2][0].length!==32)throw new Error("TLV 2 should be 32 bytes");if(o[3]&&o[3][0].length!==4)throw new Error("TLV 3 should be 4 bytes");return{type:"nevent",data:{id:q(o[0][0]),relays:o[1]?o[1].map(s=>Qe.decode(s)):[],author:o[2]?.[0]?q(o[2][0]):void 0,kind:o[3]?.[0]?parseInt(q(o[3][0]),16):void 0}}}case"naddr":{let o=To(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for naddr");if(!o[2]?.[0])throw new Error("missing TLV 2 for naddr");if(o[2][0].length!==32)throw new Error("TLV 2 should be 32 bytes");if(!o[3]?.[0])throw new Error("missing TLV 3 for naddr");if(o[3][0].length!==4)throw new Error("TLV 3 should be 4 bytes");return{type:"naddr",data:{identifier:Qe.decode(o[0][0]),pubkey:q(o[2][0]),kind:parseInt(q(o[3][0]),16),relays:o[1]?o[1].map(s=>Qe.decode(s)):[]}}}case"nsec":return{type:t,data:r};case"npub":case"note":return{type:t,data:q(r)};default:throw new Error(`unknown prefix ${t}`)}}function To(e){let t={},n=e;for(;n.length>0;){let r=n[0],o=n[1],s=n.slice(2,2+o);if(n=n.slice(2+o),s.length<o)throw new Error(`not enough data to read on TLV ${r}`);t[r]=t[r]||[],t[r].push(s)}return t}function xm(e){return Qr("nsec",e)}function Sm(e){return Qr("npub",z(e))}function Im(e){return Qr("note",z(e))}function Xr(e,t){let n=Ge.toWords(t);return Ge.encode(e,n,ti)}function Qr(e,t){return Xr(e,t)}function Rm(e){let t=ni({0:[z(e.pubkey)],1:(e.relays||[]).map(n=>Se.encode(n))});return Xr("nprofile",t)}function Am(e){let t;e.kind!==void 0&&(t=km(e.kind));let n=ni({0:[z(e.id)],1:(e.relays||[]).map(r=>Se.encode(r)),2:e.author?[z(e.author)]:[],3:t?[new Uint8Array(t)]:[]});return Xr("nevent",n)}function Cm(e){let t=new ArrayBuffer(4);new DataView(t).setUint32(0,e.kind,!1);let n=ni({0:[Se.encode(e.identifier)],1:(e.relays||[]).map(r=>Se.encode(r)),2:[z(e.pubkey)],3:[new Uint8Array(t)]});return Xr("naddr",n)}function ni(e){let t=[];return Object.entries(e).reverse().forEach(([n,r])=>{r.forEach(o=>{let s=new Uint8Array(o.length+2);s.set([parseInt(n)],0),s.set([o.length],1),s.set(o,2),t.push(s)})}),oe(...t)}var Tm={};Z(Tm,{decrypt:()=>Lm,encrypt:()=>xl});function xl(e,t,n){const r=e instanceof Uint8Array?e:z(e),o=Ue.getSharedSecret(r,z("02"+t)),s=Sl(o);let a=Uint8Array.from(wt(16)),i=Se.encode(n),c=ol(s,a).encrypt(i),l=Fe.encode(new Uint8Array(c)),d=Fe.encode(new Uint8Array(a.buffer));return`${l}?iv=${d}`}function Lm(e,t,n){const r=e instanceof Uint8Array?e:z(e);let[o,s]=n.split("?iv="),a=Ue.getSharedSecret(r,z("02"+t)),i=Sl(a),c=Fe.decode(s),l=Fe.decode(o),d=ol(i,c).decrypt(l);return Qe.decode(d)}function Sl(e){return e.slice(1,33)}var Nm={};Z(Nm,{NIP05_REGEX:()=>ri,isNip05:()=>$m,isValid:()=>Bm,queryProfile:()=>Il,searchDomain:()=>Om,useFetchImplementation:()=>Mm});var ri=/^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/,$m=e=>ri.test(e||""),eo;try{eo=fetch}catch{}function Mm(e){eo=e}async function Om(e,t=""){try{const n=`https://${e}/.well-known/nostr.json?name=${t}`,r=await eo(n,{redirect:"manual"});if(r.status!==200)throw Error("Wrong response code");return(await r.json()).names}catch{return{}}}async function Il(e){const t=e.match(ri);if(!t)return null;const[,n="_",r]=t;try{const o=`https://${r}/.well-known/nostr.json?name=${n}`,s=await eo(o,{redirect:"manual"});if(s.status!==200)throw Error("Wrong response code");const a=await s.json(),i=a.names[n];return i?{pubkey:i,relays:a.relays?.[i]}:null}catch{return null}}async function Bm(e,t){const n=await Il(t);return n?n.pubkey===e:!1}var Pm={};Z(Pm,{parse:()=>Um});function Um(e){const t={reply:void 0,root:void 0,mentions:[],profiles:[],quotes:[]};let n,r;for(let o=e.tags.length-1;o>=0;o--){const s=e.tags[o];if(s[0]==="e"&&s[1]){const[a,i,c,l,d]=s,u={id:i,relays:c?[c]:[],author:d};if(l==="root"){t.root=u;continue}if(l==="reply"){t.reply=u;continue}if(l==="mention"){t.mentions.push(u);continue}n?r=u:n=u,t.mentions.push(u);continue}if(s[0]==="q"&&s[1]){const[a,i,c]=s;t.quotes.push({id:i,relays:c?[c]:[]})}if(s[0]==="p"&&s[1]){t.profiles.push({pubkey:s[1],relays:s[2]?[s[2]]:[]});continue}}return t.root||(t.root=r||n||t.reply),t.reply||(t.reply=n||t.root),[t.reply,t.root].forEach(o=>{if(!o)return;let s=t.mentions.indexOf(o);if(s!==-1&&t.mentions.splice(s,1),o.author){let a=t.profiles.find(i=>i.pubkey===o.author);a&&a.relays&&(o.relays||(o.relays=[]),a.relays.forEach(i=>{o.relays?.indexOf(i)===-1&&o.relays.push(i)}),a.relays=o.relays)}}),t.mentions.forEach(o=>{if(o.author){let s=t.profiles.find(a=>a.pubkey===o.author);s&&s.relays&&(o.relays||(o.relays=[]),s.relays.forEach(a=>{o.relays.indexOf(a)===-1&&o.relays.push(a)}),s.relays=o.relays)}}),t}var Dm={};Z(Dm,{fetchRelayInformation:()=>qm,useFetchImplementation:()=>jm});var Rl;try{Rl=fetch}catch{}function jm(e){Rl=e}async function qm(e){return await(await fetch(e.replace("ws://","http://").replace("wss://","https://"),{headers:{Accept:"application/nostr+json"}})).json()}var Hm={};Z(Hm,{getPow:()=>Fm,minePow:()=>Km});function Fm(e){let t=0;for(let n=0;n<64;n+=8){const r=parseInt(e.substring(n,n+8),16);if(r===0)t+=32;else{t+=Math.clz32(r);break}}return t}function Gm(e){let t=0;for(let n=0;n<e.length;n++){const r=e[n];if(r===0)t+=8;else{t+=Math.clz32(r)-24;break}}return t}function Km(e,t){let n=0;const r=e,o=["nonce",n.toString(),t.toString()];for(r.tags.push(o);;){const s=Math.floor(new Date().getTime()/1e3);s!==r.created_at&&(n=0,r.created_at=s),o[1]=(++n).toString();const a=se(Se.encode(JSON.stringify([0,r.pubkey,r.created_at,r.kind,r.tags,r.content])));if(Gm(a)>=t){r.id=q(a);break}}return r}var Vm={};Z(Vm,{unwrapEvent:()=>oy,unwrapManyEvents:()=>sy,wrapEvent:()=>jl,wrapManyEvents:()=>ry});var Wm={};Z(Wm,{createRumor:()=>Bl,createSeal:()=>Pl,createWrap:()=>Ul,unwrapEvent:()=>ci,unwrapManyEvents:()=>Dl,wrapEvent:()=>Lr,wrapManyEvents:()=>ty});var zm={};Z(zm,{decrypt:()=>ai,encrypt:()=>ii,getConversationKey:()=>oi,v2:()=>Qm});var Al=1,Cl=65535;function oi(e,t){const n=Ue.getSharedSecret(e,z("02"+t)).subarray(1,33);return al(se,n,Se.encode("nip44-v2"))}function Tl(e,t){const n=cl(se,e,t,76);return{chacha_key:n.subarray(0,32),chacha_nonce:n.subarray(32,44),hmac_key:n.subarray(44,76)}}function si(e){if(!Number.isSafeInteger(e)||e<1)throw new Error("expected positive integer");if(e<=32)return 32;const t=1<<Math.floor(Math.log2(e-1))+1,n=t<=256?32:t/8;return n*(Math.floor((e-1)/n)+1)}function Jm(e){if(!Number.isSafeInteger(e)||e<Al||e>Cl)throw new Error("invalid plaintext size: must be between 1 and 65535 bytes");const t=new Uint8Array(2);return new DataView(t.buffer).setUint16(0,e,!1),t}function Ym(e){const t=Se.encode(e),n=t.length,r=Jm(n),o=new Uint8Array(si(n)-n);return oe(r,t,o)}function Zm(e){const t=new DataView(e.buffer).getUint16(0),n=e.subarray(2,2+t);if(t<Al||t>Cl||n.length!==t||e.length!==2+si(t))throw new Error("invalid padding");return Qe.decode(n)}function Ll(e,t,n){if(n.length!==32)throw new Error("AAD associated data must be 32 bytes");const r=oe(n,t);return tt(se,e,r)}function Xm(e){if(typeof e!="string")throw new Error("payload must be a valid string");const t=e.length;if(t<132||t>87472)throw new Error("invalid payload length: "+t);if(e[0]==="#")throw new Error("unknown encryption version");let n;try{n=Fe.decode(e)}catch(s){throw new Error("invalid base64: "+s.message)}const r=n.length;if(r<99||r>65603)throw new Error("invalid data length: "+r);const o=n[0];if(o!==2)throw new Error("unknown encryption version "+o);return{nonce:n.subarray(1,33),ciphertext:n.subarray(33,-32),mac:n.subarray(-32)}}function ii(e,t,n=wt(32)){const{chacha_key:r,chacha_nonce:o,hmac_key:s}=Tl(t,n),a=Ym(e),i=zr(r,o,a),c=Ll(s,i,n);return Fe.encode(oe(new Uint8Array([2]),n,i,c))}function ai(e,t){const{nonce:n,ciphertext:r,mac:o}=Xm(e),{chacha_key:s,chacha_nonce:a,hmac_key:i}=Tl(t,n),c=Ll(i,r,n);if(!Qc(c,o))throw new Error("invalid MAC");const l=zr(s,a,r);return Zm(l)}var Qm={utils:{getConversationKey:oi,calcPaddedLen:si},encrypt:ii,decrypt:ai},ey=2880*60,Nl=()=>Math.round(Date.now()/1e3),$l=()=>Math.round(Nl()-Math.random()*ey),Ml=(e,t)=>oi(e,t),Ol=(e,t,n)=>ii(JSON.stringify(e),Ml(t,n)),ha=(e,t)=>JSON.parse(ai(e.content,Ml(t,e.pubkey)));function Bl(e,t){const n={created_at:Nl(),content:"",tags:[],...e,pubkey:Yr(t)};return n.id=ur(n),n}function Pl(e,t,n){return Ve({kind:fl,content:Ol(e,t,n),created_at:$l(),tags:[]},t)}function Ul(e,t){const n=Uh();return Ve({kind:vl,content:Ol(e,n,t),created_at:$l(),tags:[["p",t]]},n)}function Lr(e,t,n){const r=Bl(e,t),o=Pl(r,t,n);return Ul(o,n)}function ty(e,t,n){if(!n||n.length===0)throw new Error("At least one recipient is required.");const r=Yr(t),o=[Lr(e,t,r)];return n.forEach(s=>{o.push(Lr(e,t,s))}),o}function ci(e,t){const n=ha(e,t);return ha(n,t)}function Dl(e,t){let n=[];return e.forEach(r=>{n.push(ci(r,t))}),n.sort((r,o)=>r.created_at-o.created_at),n}function ny(e,t,n,r){const o={created_at:Math.ceil(Date.now()/1e3),kind:hl,tags:[],content:t};return(Array.isArray(e)?e:[e]).forEach(({publicKey:a,relayUrl:i})=>{o.tags.push(i?["p",a,i]:["p",a])}),r&&o.tags.push(["e",r.eventId,r.relayUrl||"","reply"]),n&&o.tags.push(["subject",n]),o}function jl(e,t,n,r,o){const s=ny(t,n,r,o);return Lr(s,e,t.publicKey)}function ry(e,t,n,r,o){if(!t||t.length===0)throw new Error("At least one recipient is required.");return[{publicKey:Yr(e)},...t].map(a=>jl(e,a,n,r,o))}var oy=ci,sy=Dl,iy={};Z(iy,{finishRepostEvent:()=>ay,getRepostedEvent:()=>cy,getRepostedEventPointer:()=>ql});function ay(e,t,n,r){let o;const s=[...e.tags??[],["e",t.id,n],["p",t.pubkey]];return t.kind===ul?o=Ys:(o=Xs,s.push(["k",String(t.kind)])),Ve({kind:o,tags:s,content:e.content===""||t.tags?.find(a=>a[0]==="-")?"":JSON.stringify(t),created_at:e.created_at},r)}function ql(e){if(![Ys,Xs].includes(e.kind))return;let t,n;for(let r=e.tags.length-1;r>=0&&(t===void 0||n===void 0);r--){const o=e.tags[r];o.length>=2&&(o[0]==="e"&&t===void 0?t=o:o[0]==="p"&&n===void 0&&(n=o))}if(t!==void 0)return{id:t[1],relays:[t[2],n?.[2]].filter(r=>typeof r=="string"),author:n?.[1]}}function cy(e,{skipVerification:t}={}){const n=ql(e);if(n===void 0||e.content==="")return;let r;try{r=JSON.parse(e.content)}catch{return}if(r.id===n.id&&!(!t&&!Ws(r)))return r}var ly={};Z(ly,{NOSTR_URI_REGEX:()=>li,parse:()=>uy,test:()=>dy});var li=new RegExp(`nostr:(${_l.source})`);function dy(e){return typeof e=="string"&&new RegExp(`^${li.source}$`).test(e)}function uy(e){const t=e.match(new RegExp(`^${li.source}$`));if(!t)throw new Error(`Invalid Nostr URI: ${e}`);return{uri:t[0],value:t[1],decoded:Zr(t[1])}}var fy={};Z(fy,{finishReactionEvent:()=>hy,getReactedEventPointer:()=>py});function hy(e,t,n){const r=t.tags.filter(o=>o.length>=2&&(o[0]==="e"||o[0]==="p"));return Ve({...e,kind:Zs,tags:[...e.tags??[],...r,["e",t.id],["p",t.pubkey]],content:e.content??"+"},n)}function py(e){if(e.kind!==Zs)return;let t,n;for(let r=e.tags.length-1;r>=0&&(t===void 0||n===void 0);r--){const o=e.tags[r];o.length>=2&&(o[0]==="e"&&t===void 0?t=o:o[0]==="p"&&n===void 0&&(n=o))}if(!(t===void 0||n===void 0))return{id:t[1],relays:[t[2],n[2]].filter(r=>r!==void 0),author:n[1]}}var my={};Z(my,{parse:()=>gy});var Lo=/\W/m,pa=/[^\w\/] |[^\w\/]$|$|,| /m,yy=42;function*gy(e){let t=[];if(typeof e!="string"){for(let s=0;s<e.tags.length;s++){const a=e.tags[s];a[0]==="emoji"&&a.length>=3&&t.push({type:"emoji",shortcode:a[1],url:a[2]})}e=e.content}const n=e.length;let r=0,o=0;e:for(;o<n;){const s=e.indexOf(":",o),a=e.indexOf("#",o);if(s===-1&&a===-1)break e;if(s===-1||a>=0&&a<s){if(a===0||e[a-1].match(Lo)){const i=e.slice(a+1,a+yy).match(Lo),c=i?a+1+i.index:n;yield{type:"text",text:e.slice(r,a)},yield{type:"hashtag",value:e.slice(a+1,c)},o=c,r=o;continue e}o=a+1;continue e}if(e.slice(s-5,s)==="nostr"){const i=e.slice(s+60).match(Lo),c=i?s+60+i.index:n;try{let l,{data:d,type:u}=Zr(e.slice(s+1,c));switch(u){case"npub":l={pubkey:d};break;case"note":l={id:d};break;case"nsec":o=c+1;continue;default:l=d}r!==s-5&&(yield{type:"text",text:e.slice(r,s-5)}),yield{type:"reference",pointer:l},o=c,r=o;continue e}catch{o=s+1;continue e}}else if(e.slice(s-5,s)==="https"||e.slice(s-4,s)==="http"){const i=e.slice(s+4).match(pa),c=i?s+4+i.index:n,l=e[s-1]==="s"?5:4;try{let d=new URL(e.slice(s-l,c));if(d.hostname.indexOf(".")===-1)throw new Error("invalid url");if(r!==s-l&&(yield{type:"text",text:e.slice(r,s-l)}),/\.(png|jpe?g|gif|webp|heic|svg)$/i.test(d.pathname)){yield{type:"image",url:d.toString()},o=c,r=o;continue e}if(/\.(mp4|avi|webm|mkv|mov)$/i.test(d.pathname)){yield{type:"video",url:d.toString()},o=c,r=o;continue e}if(/\.(mp3|aac|ogg|opus|wav|flac)$/i.test(d.pathname)){yield{type:"audio",url:d.toString()},o=c,r=o;continue e}yield{type:"url",url:d.toString()},o=c,r=o;continue e}catch{o=c+1;continue e}}else if(e.slice(s-3,s)==="wss"||e.slice(s-2,s)==="ws"){const i=e.slice(s+4).match(pa),c=i?s+4+i.index:n,l=e[s-1]==="s"?3:2;try{let d=new URL(e.slice(s-l,c));if(d.hostname.indexOf(".")===-1)throw new Error("invalid ws url");r!==s-l&&(yield{type:"text",text:e.slice(r,s-l)}),yield{type:"relay",url:d.toString()},o=c,r=o;continue e}catch{o=c+1;continue e}}else{for(let i=0;i<t.length;i++){const c=t[i];if(e[s+c.shortcode.length+1]===":"&&e.slice(s+1,s+c.shortcode.length+1)===c.shortcode){r!==s&&(yield{type:"text",text:e.slice(r,s)}),yield c,o=s+c.shortcode.length+2,r=o;continue e}}o=s+1;continue e}}r!==n&&(yield{type:"text",text:e.slice(r)})}var by={};Z(by,{channelCreateEvent:()=>vy,channelHideMessageEvent:()=>ky,channelMessageEvent:()=>Ey,channelMetadataEvent:()=>wy,channelMuteUserEvent:()=>_y});var vy=(e,t)=>{let n;if(typeof e.content=="object")n=JSON.stringify(e.content);else if(typeof e.content=="string")n=e.content;else return;return Ve({kind:pl,tags:[...e.tags??[]],content:n,created_at:e.created_at},t)},wy=(e,t)=>{let n;if(typeof e.content=="object")n=JSON.stringify(e.content);else if(typeof e.content=="string")n=e.content;else return;return Ve({kind:ml,tags:[["e",e.channel_create_event_id],...e.tags??[]],content:n,created_at:e.created_at},t)},Ey=(e,t)=>{const n=[["e",e.channel_create_event_id,e.relay_url,"root"]];return e.reply_to_channel_message_event_id&&n.push(["e",e.reply_to_channel_message_event_id,e.relay_url,"reply"]),Ve({kind:yl,tags:[...n,...e.tags??[]],content:e.content,created_at:e.created_at},t)},ky=(e,t)=>{let n;if(typeof e.content=="object")n=JSON.stringify(e.content);else if(typeof e.content=="string")n=e.content;else return;return Ve({kind:gl,tags:[["e",e.channel_message_event_id],...e.tags??[]],content:n,created_at:e.created_at},t)},_y=(e,t)=>{let n;if(typeof e.content=="object")n=JSON.stringify(e.content);else if(typeof e.content=="string")n=e.content;else return;return Ve({kind:bl,tags:[["p",e.pubkey_to_mute],...e.tags??[]],content:n,created_at:e.created_at},t)},xy={};Z(xy,{EMOJI_SHORTCODE_REGEX:()=>Hl,matchAll:()=>Sy,regex:()=>di,replaceAll:()=>Iy});var Hl=/:(\w+):/,di=()=>new RegExp(`\\B${Hl.source}\\B`,"g");function*Sy(e){const t=e.matchAll(di());for(const n of t)try{const[r,o]=n;yield{shortcode:r,name:o,start:n.index,end:n.index+r.length}}catch{}}function Iy(e,t){return e.replaceAll(di(),(n,r)=>t({shortcode:n,name:r}))}var Ry={};Z(Ry,{useFetchImplementation:()=>Ay,validateGithub:()=>Cy});var ui;try{ui=fetch}catch{}function Ay(e){ui=e}async function Cy(e,t,n){try{return await(await ui(`https://gist.github.com/${t}/${n}/raw`)).text()===`Verifying that I control the following Nostr public key: ${e}`}catch{return!1}}var Ty={};Z(Ty,{makeNwcRequestEvent:()=>Ny,parseConnectionString:()=>Ly});function Ly(e){const{host:t,pathname:n,searchParams:r}=new URL(e),o=n||t,s=r.get("relay"),a=r.get("secret");if(!o||!s||!a)throw new Error("invalid connection string");return{pubkey:o,relay:s,secret:a}}async function Ny(e,t,n){const o=xl(t,e,JSON.stringify({method:"pay_invoice",params:{invoice:n}})),s={kind:El,created_at:Math.round(Date.now()/1e3),content:o,tags:[["p",e]]};return Ve(s,t)}var $y={};Z($y,{normalizeIdentifier:()=>My});function My(e){return e=e.trim().toLowerCase(),e=e.normalize("NFKC"),Array.from(e).map(t=>new RegExp("\\p{Letter}","u").test(t)||new RegExp("\\p{Number}","u").test(t)?t:"-").join("")}var Oy={};Z(Oy,{getSatoshisAmountFromBolt11:()=>qy,getZapEndpoint:()=>Py,makeZapReceipt:()=>jy,makeZapRequest:()=>Uy,useFetchImplementation:()=>By,validateZapRequest:()=>Dy});var fi;try{fi=fetch}catch{}function By(e){fi=e}async function Py(e){try{let t="",{lud06:n,lud16:r}=JSON.parse(e.content);if(r){let[a,i]=r.split("@");t=new URL(`/.well-known/lnurlp/${a}`,`https://${i}`).toString()}else if(n){let{words:a}=Ge.decode(n,1e3),i=Ge.fromWords(a);t=Qe.decode(i)}else return null;let s=await(await fi(t)).json();if(s.allowsNostr&&s.nostrPubkey)return s.callback}catch{}return null}function Uy(e){let t={kind:9734,created_at:Math.round(Date.now()/1e3),content:e.comment||"",tags:[["p","pubkey"in e?e.pubkey:e.event.pubkey],["amount",e.amount.toString()],["relays",...e.relays]]};if("event"in e){if(t.tags.push(["e",e.event.id]),zs(e.event.kind)){const n=["a",`${e.event.kind}:${e.event.pubkey}:`];t.tags.push(n)}else if(Js(e.event.kind)){let n=e.event.tags.find(([o,s])=>o==="d"&&s);if(!n)throw new Error("d tag not found or is empty");const r=["a",`${e.event.kind}:${e.event.pubkey}:${n[1]}`];t.tags.push(r)}t.tags.push(["k",e.event.kind.toString()])}return t}function Dy(e){let t;try{t=JSON.parse(e)}catch{return"Invalid zap request JSON."}if(!Ks(t))return"Zap request is not a valid Nostr event.";if(!Ws(t))return"Invalid signature on zap request.";let n=t.tags.find(([s,a])=>s==="p"&&a);if(!n)return"Zap request doesn't have a 'p' tag.";if(!n[1].match(/^[a-f0-9]{64}$/))return"Zap request 'p' tag is not valid hex.";let r=t.tags.find(([s,a])=>s==="e"&&a);return r&&!r[1].match(/^[a-f0-9]{64}$/)?"Zap request 'e' tag is not valid hex.":t.tags.find(([s,a])=>s==="relays"&&a)?null:"Zap request doesn't have a 'relays' tag."}function jy({zapRequest:e,preimage:t,bolt11:n,paidAt:r}){let o=JSON.parse(e),s=o.tags.filter(([i])=>i==="e"||i==="p"||i==="a"),a={kind:9735,created_at:Math.round(r.getTime()/1e3),content:"",tags:[...s,["P",o.pubkey],["bolt11",n],["description",e]]};return t&&a.tags.push(["preimage",t]),a}function qy(e){if(e.length<50)return 0;e=e.substring(0,50);const t=e.lastIndexOf("1");if(t===-1)return 0;const n=e.substring(0,t);if(!n.startsWith("lnbc"))return 0;const r=n.substring(4);if(r.length<1)return 0;const o=r[r.length-1],s=o.charCodeAt(0)-48,a=s>=0&&s<=9;let i=r.length-1;if(a&&i++,i<1)return 0;const c=parseInt(r.substring(0,i));switch(o){case"m":return c*1e5;case"u":return c*100;case"n":return c/10;case"p":return c/1e4;default:return c*1e8}}var Hy={};Z(Hy,{Negentropy:()=>Gl,NegentropyStorageVector:()=>Ky,NegentropySync:()=>Vy});var No=97,Xt=32,Fl=16,Et={Skip:0,Fingerprint:1,IdList:2},Ye=class{_raw;length;constructor(e){typeof e=="number"?(this._raw=new Uint8Array(e),this.length=0):e instanceof Uint8Array?(this._raw=new Uint8Array(e),this.length=e.length):(this._raw=new Uint8Array(512),this.length=0)}unwrap(){return this._raw.subarray(0,this.length)}get capacity(){return this._raw.byteLength}extend(e){if(e instanceof Ye&&(e=e.unwrap()),typeof e.length!="number")throw Error("bad length");const t=e.length+this.length;if(this.capacity<t){const n=this._raw,r=Math.max(this.capacity*2,t);this._raw=new Uint8Array(r),this._raw.set(n)}this._raw.set(e,this.length),this.length+=e.length}shift(){const e=this._raw[0];return this._raw=this._raw.subarray(1),this.length--,e}shiftN(e=1){const t=this._raw.subarray(0,e);return this._raw=this._raw.subarray(e),this.length-=e,t}};function er(e){let t=0;for(;;){if(e.length===0)throw Error("parse ends prematurely");let n=e.shift();if(t=t<<7|n&127,(n&128)===0)break}return t}function Je(e){if(e===0)return new Ye(new Uint8Array([0]));let t=[];for(;e!==0;)t.push(e&127),e>>>=7;t.reverse();for(let n=0;n<t.length-1;n++)t[n]|=128;return new Ye(new Uint8Array(t))}function Fy(e){return fr(e,1)[0]}function fr(e,t){if(e.length<t)throw Error("parse ends prematurely");return e.shiftN(t)}var Gy=class{buf;constructor(){this.setToZero()}setToZero(){this.buf=new Uint8Array(Xt)}add(e){let t=0,n=0,r=new DataView(this.buf.buffer),o=new DataView(e.buffer);for(let s=0;s<8;s++){let a=s*4,i=r.getUint32(a,!0),c=o.getUint32(a,!0),l=i;l+=t,l+=c,l>4294967295&&(n=1),r.setUint32(a,l&4294967295,!0),t=n,n=0}}negate(){let e=new DataView(this.buf.buffer);for(let n=0;n<8;n++){let r=n*4;e.setUint32(r,~e.getUint32(r,!0))}let t=new Uint8Array(Xt);t[0]=1,this.add(t)}getFingerprint(e){let t=new Ye;return t.extend(this.buf),t.extend(Je(e)),se(t.unwrap()).subarray(0,Fl)}},Ky=class{items;sealed;constructor(){this.items=[],this.sealed=!1}insert(e,t){if(this.sealed)throw Error("already sealed");const n=z(t);if(n.byteLength!==Xt)throw Error("bad id size for added item");this.items.push({timestamp:e,id:n})}seal(){if(this.sealed)throw Error("already sealed");this.sealed=!0,this.items.sort($o);for(let e=1;e<this.items.length;e++)if($o(this.items[e-1],this.items[e])===0)throw Error("duplicate item inserted")}unseal(){this.sealed=!1}size(){return this._checkSealed(),this.items.length}getItem(e){if(this._checkSealed(),e>=this.items.length)throw Error("out of range");return this.items[e]}iterate(e,t,n){this._checkSealed(),this._checkBounds(e,t);for(let r=e;r<t&&n(this.items[r],r);++r);}findLowerBound(e,t,n){return this._checkSealed(),this._checkBounds(e,t),this._binarySearch(this.items,e,t,r=>$o(r,n)<0)}fingerprint(e,t){let n=new Gy;return n.setToZero(),this.iterate(e,t,r=>(n.add(r.id),!0)),n.getFingerprint(t-e)}_checkSealed(){if(!this.sealed)throw Error("not sealed")}_checkBounds(e,t){if(e>t||t>this.items.length)throw Error("bad range")}_binarySearch(e,t,n,r){let o=n-t;for(;o>0;){let s=t,a=Math.floor(o/2);s+=a,r(e[s])?(t=++s,o-=a+1):o=a}return t}},Gl=class{storage;frameSizeLimit;lastTimestampIn;lastTimestampOut;constructor(e,t=6e4){if(t<4096)throw Error("frameSizeLimit too small");this.storage=e,this.frameSizeLimit=t,this.lastTimestampIn=0,this.lastTimestampOut=0}_bound(e,t){return{timestamp:e,id:t||new Uint8Array(0)}}initiate(){let e=new Ye;return e.extend(new Uint8Array([No])),this.splitRange(0,this.storage.size(),this._bound(Number.MAX_VALUE),e),q(e.unwrap())}reconcile(e,t,n){const r=new Ye(z(e));this.lastTimestampIn=this.lastTimestampOut=0;let o=new Ye;o.extend(new Uint8Array([No]));let s=Fy(r);if(s<96||s>111)throw Error("invalid negentropy protocol version byte");if(s!==No)throw Error("unsupported negentropy protocol version requested: "+(s-96));let a=this.storage.size(),i=this._bound(0),c=0,l=!1;for(;r.length!==0;){let d=new Ye,u=()=>{l&&(l=!1,d.extend(this.encodeBound(i)),d.extend(Je(Et.Skip)))},f=this.decodeBound(r),h=er(r),p=c,m=this.storage.findLowerBound(c,a,f);if(h===Et.Skip)l=!0;else if(h===Et.Fingerprint){let g=fr(r,Fl),b=this.storage.fingerprint(p,m);Kl(g,b)!==0?(u(),this.splitRange(p,m,f,d)):l=!0}else if(h===Et.IdList){let g=er(r),b={};for(let k=0;k<g;k++){let T=fr(r,Xt);b[q(T)]=T}if(l=!0,this.storage.iterate(p,m,k=>{let T=k.id;const $=q(T);return b[$]?delete b[q(T)]:t?.($),!0}),n)for(let k of Object.values(b))n(q(k))}else throw Error("unexpected mode");if(this.exceededFrameSizeLimit(o.length+d.length)){let g=this.storage.fingerprint(m,a);o.extend(this.encodeBound(this._bound(Number.MAX_VALUE))),o.extend(Je(Et.Fingerprint)),o.extend(g);break}else o.extend(d);c=m,i=f}return o.length===1?null:q(o.unwrap())}splitRange(e,t,n,r){let o=t-e,s=16;if(o<s*2)r.extend(this.encodeBound(n)),r.extend(Je(Et.IdList)),r.extend(Je(o)),this.storage.iterate(e,t,a=>(r.extend(a.id),!0));else{let a=Math.floor(o/s),i=o%s,c=e;for(let l=0;l<s;l++){let d=a+(l<i?1:0),u=this.storage.fingerprint(c,c+d);c+=d;let f;if(c===t)f=n;else{let h,p;this.storage.iterate(c-1,c+1,(m,g)=>(g===c-1?h=m:p=m,!0)),f=this.getMinimalBound(h,p)}r.extend(this.encodeBound(f)),r.extend(Je(Et.Fingerprint)),r.extend(u)}}}exceededFrameSizeLimit(e){return e>this.frameSizeLimit-200}decodeTimestampIn(e){let t=er(e);return t=t===0?Number.MAX_VALUE:t-1,this.lastTimestampIn===Number.MAX_VALUE||t===Number.MAX_VALUE?(this.lastTimestampIn=Number.MAX_VALUE,Number.MAX_VALUE):(t+=this.lastTimestampIn,this.lastTimestampIn=t,t)}decodeBound(e){let t=this.decodeTimestampIn(e),n=er(e);if(n>Xt)throw Error("bound key too long");let r=fr(e,n);return{timestamp:t,id:r}}encodeTimestampOut(e){if(e===Number.MAX_VALUE)return this.lastTimestampOut=Number.MAX_VALUE,Je(0);let t=e;return e-=this.lastTimestampOut,this.lastTimestampOut=t,Je(e+1)}encodeBound(e){let t=new Ye;return t.extend(this.encodeTimestampOut(e.timestamp)),t.extend(Je(e.id.length)),t.extend(e.id),t}getMinimalBound(e,t){if(t.timestamp!==e.timestamp)return this._bound(t.timestamp);{let n=0,r=t.id,o=e.id;for(let s=0;s<Xt&&r[s]===o[s];s++)n++;return this._bound(t.timestamp,t.id.subarray(0,n+1))}}};function Kl(e,t){for(let n=0;n<e.byteLength;n++){if(e[n]<t[n])return-1;if(e[n]>t[n])return 1}return e.byteLength>t.byteLength?1:e.byteLength<t.byteLength?-1:0}function $o(e,t){return e.timestamp===t.timestamp?Kl(e.id,t.id):e.timestamp-t.timestamp}var Vy=class{relay;storage;neg;filter;subscription;onhave;onneed;constructor(e,t,n,r={}){this.relay=e,this.storage=t,this.neg=new Gl(t),this.onhave=r.onhave,this.onneed=r.onneed,this.filter=n,this.subscription=this.relay.prepareSubscription([{}],{label:r.label||"negentropy"}),this.subscription.oncustom=o=>{switch(o[0]){case"NEG-MSG":{o.length<3&&console.warn(`got invalid NEG-MSG from ${this.relay.url}: ${o}`);try{const s=this.neg.reconcile(o[2],this.onhave,this.onneed);s?this.relay.send(`["NEG-MSG", "${this.subscription.id}", "${s}"]`):(this.close(),r.onclose?.())}catch(s){console.error("negentropy reconcile error:",s),r?.onclose?.(`reconcile error: ${s}`)}break}case"NEG-CLOSE":{const s=o[2];console.warn("negentropy error:",s),r.onclose?.(s);break}case"NEG-ERR":r.onclose?.()}}}async start(){const e=this.neg.initiate();this.relay.send(`["NEG-OPEN","${this.subscription.id}",${JSON.stringify(this.filter)},"${e}"]`)}close(){this.relay.send(`["NEG-CLOSE","${this.subscription.id}"]`),this.subscription.close()}},Wy={};Z(Wy,{getToken:()=>zy,hashPayload:()=>hi,unpackEventFromToken:()=>Wl,validateEvent:()=>Ql,validateEventKind:()=>Jl,validateEventMethodTag:()=>Zl,validateEventPayloadTag:()=>Xl,validateEventTimestamp:()=>zl,validateEventUrlTag:()=>Yl,validateToken:()=>Jy});var Vl="Nostr ";async function zy(e,t,n,r=!1,o){const s={kind:Qs,tags:[["u",e],["method",t]],created_at:Math.round(new Date().getTime()/1e3),content:""};o&&s.tags.push(["payload",hi(o)]);const a=await n(s);return(r?Vl:"")+Fe.encode(Se.encode(JSON.stringify(a)))}async function Jy(e,t,n){const r=await Wl(e).catch(s=>{throw s});return await Ql(r,t,n).catch(s=>{throw s})}async function Wl(e){if(!e)throw new Error("Missing token");e=e.replace(Vl,"");const t=Qe.decode(Fe.decode(e));if(!t||t.length===0||!t.startsWith("{"))throw new Error("Invalid token");return JSON.parse(t)}function zl(e){return e.created_at?Math.round(new Date().getTime()/1e3)-e.created_at<60:!1}function Jl(e){return e.kind===Qs}function Yl(e,t){const n=e.tags.find(r=>r[0]==="u");return n?n.length>0&&n[1]===t:!1}function Zl(e,t){const n=e.tags.find(r=>r[0]==="method");return n?n.length>0&&n[1].toLowerCase()===t.toLowerCase():!1}function hi(e){const t=se(Se.encode(JSON.stringify(e)));return q(t)}function Xl(e,t){const n=e.tags.find(o=>o[0]==="payload");if(!n)return!1;const r=hi(t);return n.length>0&&n[1]===r}async function Ql(e,t,n,r){if(!Ws(e))throw new Error("Invalid nostr event, signature invalid");if(!Jl(e))throw new Error("Invalid nostr event, kind invalid");if(!zl(e))throw new Error("Invalid nostr event, created_at timestamp invalid");if(!Yl(e,t))throw new Error("Invalid nostr event, url tag invalid");if(!Zl(e,n))throw new Error("Invalid nostr event, method tag invalid");if(r&&typeof r=="object"&&Object.keys(r).length>0&&!Xl(e,r))throw new Error("Invalid nostr event, payload tag does not match request body hash");return!0}function Yy(e){return Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}const Zy="m/44'/1237'/0'/0/0";function Xy(){return ff(kc,128)}function ed(e){return yf(e,kc)}function td(e){const t=bf(e),r=St.fromMasterSeed(t).derive(Zy);if(!r.privateKey)throw new Error("Failed to derive private key");const o=Yy(r.privateKey);return{pubkey:Yr(r.privateKey),privkey:o}}const ma=Object.freeze(Object.defineProperty({__proto__:null,generateMnemonic:Xy,mnemonicToKeypair:td,validateMnemonic:ed},Symbol.toStringTag,{value:"Module"})),is="canary:duress-queue";let as=null,cs=null,Cn=null;function Qy(e){as=e.encrypt,cs=e.decrypt,Cn=e.getPinKey}function Mo(e){return Array.isArray(e)?e.every(t=>t!=null&&typeof t=="object"&&typeof t.groupId=="string"&&t.message!=null):!1}async function eg(){try{const e=localStorage.getItem(is);if(!e)return[];const t=JSON.parse(e);if(Mo(t))return t;if(t&&typeof t=="object"&&typeof t.entries=="string"){if(t.encrypted&&cs&&Cn){const r=Cn();if(!r)return[];const o=await cs(t.entries,r),s=JSON.parse(o);return Mo(s)?s:[]}const n=JSON.parse(t.entries);return Mo(n)?n:[]}return[]}catch{return[]}}async function tg(e){try{const t=JSON.stringify(e);if(as&&Cn){const n=Cn();if(n){const r=await as(t,n);localStorage.setItem(is,JSON.stringify({encrypted:!0,entries:r}));return}}localStorage.setItem(is,JSON.stringify({entries:t}))}catch{}}async function ng(e){const t=await eg(),n=t.filter(o=>o.groupId===e),r=t.filter(o=>o.groupId!==e);return await tg(r),n.map(o=>o.message)}const Nr="canary:groups",$r="canary:identity",to="canary:settings",no="canary:pin-salt",Sn="canary:active-group",ls="canary:mnemonic";let Qt=null;function nd(e){Qt=e}function ro(){Qt=null}const tr={theme:"dark",pinEnabled:!0,autoLockMinutes:5,defaultRelays:[qe],defaultReadRelays:[...et,qe],defaultWriteRelays:[qe]};function rt(e){try{const t=localStorage.getItem(e);return t===null?null:JSON.parse(t)}catch{return null}}function kt(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch{}}function Re(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function cn(e){return Re(e)&&e._encrypted===!0&&typeof e.ciphertext=="string"}async function Oo(e,t){return{_encrypted:!0,ciphertext:await ic(JSON.stringify(e),t)}}async function pi(e,t){return JSON.parse(await Fr(e.ciphertext,t))}function rd(e){return Re(e)?Object.values(e).some(t=>Re(t)&&t._seedEncrypted===!0):!1}function od(e){return Re(e)&&e._privkeyEncrypted===!0}function sd(){return localStorage.getItem(no)}function rg(){const e=Lu(),t=Nu(e);return localStorage.setItem(no,t),t}function id(){localStorage.removeItem(no)}async function og(e,t){const n={};for(const[r,o]of Object.entries(e)){const{_seedEncrypted:s,...a}=o;n[r]={...a,seed:s?await Fr(o.seed,t):o.seed}}return n}function sg(e){if(e.readRelays?.length||e.writeRelays?.length)return{readRelays:e.readRelays??[],writeRelays:e.writeRelays??[]};const t=e.relays??[],n=t.length>0?t:[qe],r=new Set([...et,...n]);return{readRelays:Array.from(r),writeRelays:n}}function mi(e){const t={...tr,...e??{}};return t.defaultRelays?.length||(t.defaultRelays=[...tr.defaultRelays]),t.defaultReadRelays?.length||(t.defaultReadRelays=[...tr.defaultReadRelays]),t.defaultWriteRelays?.length||(t.defaultWriteRelays=[...tr.defaultWriteRelays]),t}function hr(e){if(!Re(e))return{};const t={};for(const[n,r]of Object.entries(e)){if(!Re(r)||typeof r.name!="string")continue;const o=sg(r);t[n]={...r,id:n,usedInvites:Array.isArray(r.usedInvites)?r.usedInvites.filter(s=>typeof s=="string"):[],latestInviteIssuedAt:typeof r.latestInviteIssuedAt=="number"?r.latestInviteIssuedAt:0,tolerance:typeof r.tolerance=="number"?r.tolerance:1,livenessInterval:typeof r.livenessInterval=="number"?r.livenessInterval:typeof r.rotationInterval=="number"?r.rotationInterval:604800,livenessCheckins:Re(r.livenessCheckins)?Object.fromEntries(Object.entries(r.livenessCheckins).filter(([,s])=>typeof s=="number").map(([s,a])=>[s,a])):{},memberNames:Re(r.memberNames)?Object.fromEntries(Object.entries(r.memberNames).filter(([,s])=>typeof s=="string").map(([s,a])=>[s,a])):void 0,lastPositions:Re(r.lastPositions)?Object.fromEntries(Object.entries(r.lastPositions).filter(([,s])=>Re(s)).map(([s,a])=>[s,a])):void 0,beaconPrecision:typeof r.beaconPrecision=="number"?r.beaconPrecision:5,duressPrecision:typeof r.duressPrecision=="number"?r.duressPrecision:9,nostrEnabled:typeof r.nostrEnabled=="boolean"?r.nostrEnabled:o.writeRelays.length>0||o.readRelays.length>0,...o}}return t}function ds(e){return!Re(e)||typeof e.pubkey!="string"?null:{pubkey:e.pubkey,privkey:typeof e.privkey=="string"?e.privkey:void 0,nsec:typeof e.nsec=="string"?e.nsec:void 0,mnemonic:typeof e.mnemonic=="string"?e.mnemonic:void 0,displayName:typeof e.displayName=="string"?e.displayName:void 0,picture:typeof e.picture=="string"?e.picture:void 0,signerType:e.signerType==="nip07"?"nip07":"local"}}function In(e){const t=localStorage.getItem(ls);if(!t)return{identity:e,migrated:!1};let n=e;const r=t.trim().replace(/\s+/g," ");try{if(n&&ed(r)){const{pubkey:o}=td(r);o===n.pubkey&&(n={...n,mnemonic:r})}}catch{}return localStorage.removeItem(ls),{identity:n,migrated:!0}}function ad(e,t){if(typeof e=="string"&&e in t)return e;const n=Object.keys(t);return n.length>0?n[0]:null}async function ig(e){const t=rt(Nr);if(t===null)return{groups:{},migrated:!1};if(cn(t)){if(!e)throw new Error("Encrypted groups require PIN unlock");const n=await pi(t,e);return{groups:hr(n),migrated:!1}}if(rd(t)){if(!e)throw new Error("Encrypted groups require PIN unlock");const n=await og(t,e);return{groups:hr(n),migrated:!0}}return{groups:hr(t),migrated:e!==void 0}}function ag(){const e=rt(Nr);return e===null||cn(e)||rd(e)?{groups:{},migrated:!1}:{groups:hr(e),migrated:!1}}async function cg(e){const t=rt($r);if(t===null)return In(null);if(cn(t)){if(!e)throw new Error("Encrypted identity requires PIN unlock");const s=await pi(t,e);return In(ds(s))}let n=t,r=e!==void 0;if(od(t)){if(!e)throw new Error("Encrypted identity requires PIN unlock");const s=t.privkey?await Fr(t.privkey,e):void 0,{_privkeyEncrypted:a,...i}=t;n={...i,privkey:s},r=!0}const o=In(ds(n));return{identity:o.identity,migrated:r||o.migrated}}function lg(){const e=rt($r);return e===null||cn(e)||od(e)?In(null):In(ds(e))}async function dg(e){const t=rt(Sn);if(t===null)return{activeGroupId:null,migrated:!1};if(cn(t)){if(!e)throw new Error("Encrypted active group requires PIN unlock");const n=await pi(t,e);return{activeGroupId:typeof n=="string"?n:null,migrated:!1}}return{activeGroupId:typeof t=="string"?t:null,migrated:e!==void 0}}function ug(){const e=rt(Sn);return e===null||cn(e)?{activeGroupId:null,migrated:!1}:{activeGroupId:typeof e=="string"?e:null,migrated:!1}}async function oo(e,t){if(t){const[n,r,o]=await Promise.all([Oo(e.groups,t),Oo(e.identity,t),Oo(e.activeGroupId,t)]);kt(Nr,n),kt($r,r),kt(Sn,o)}else kt(Nr,e.groups),kt($r,e.identity),e.activeGroupId===null?localStorage.removeItem(Sn):kt(Sn,e.activeGroupId);kt(to,e.settings),localStorage.removeItem(ls)}async function yi(){const e=_(),t=!!sd();if(e.settings.pinEnabled&&t&&Qt===null){console.error("[canary:storage] PIN enabled but key not loaded — state NOT persisted.");return}try{await oo(e,e.settings.pinEnabled&&Qt!==null?Qt:void 0)}catch(n){console.error("[canary:storage] Persistence failed — state NOT persisted:",n)}}function cd(){return localStorage.getItem(no)!==null}function fg(){const e=rt(to);return mi(e)}async function hg(e){const t=sd();if(!t)throw new Error("No PIN salt found");const n=ac(t),r=await sc(e,n),o=rt(to),s=mi(o),[a,i,c]=await Promise.all([ig(r),cg(r),dg(r)]),l={view:"groups",groups:a.groups,activeGroupId:ad(c.activeGroupId,a.groups),identity:i.identity,settings:s};nd(r),oc(l),(a.migrated||i.migrated||c.migrated)&&await oo(l,r)}function pg(){const e=rt(to),t=mi(e),n=ag(),r=lg(),o=ug(),s={view:"groups",groups:n.groups,activeGroupId:ad(o.activeGroupId,n.groups),identity:r.identity,settings:t};oc(s),(n.migrated||r.migrated||o.migrated)&&yi()}let us=0,fs,ya=Promise.resolve();const mg=100;function yg(){Qy({encrypt:ic,decrypt:Fr,getPinKey:()=>Qt}),Er(()=>{const e=++us;clearTimeout(fs),fs=setTimeout(()=>{ya=ya.then(async()=>{e===us&&await yi()}).catch(t=>{console.error("[canary:storage] Serialised write failed:",t)})},mg)}),window.addEventListener("pagehide",()=>gi())}function gi(){clearTimeout(fs),us++,yi().catch(()=>{})}async function gg(e){const t=rg(),n=ac(t),r=await sc(e,n);nd(r);try{const o=_();await oo({...o,settings:{...o.settings,pinEnabled:!0}},r)}catch(o){throw ro(),id(),o}}async function bg(){const e=_();await oo({...e,settings:{...e.settings,pinEnabled:!1}}),ro(),id()}const vg=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],wg=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]);function Oe(e,t){return(e>>>t|e<<32-t)>>>0}function ge(e){const t=e.length*8,n=new Uint8Array(Math.ceil((e.length+9)/64)*64);n.set(e),n[e.length]=128;const r=new DataView(n.buffer);r.setUint32(n.length-8,Math.floor(t/4294967296),!1),r.setUint32(n.length-4,t>>>0,!1);let[o,s,a,i,c,l,d,u]=vg;const f=new Uint32Array(64);for(let m=0;m<n.length;m+=64){for(let v=0;v<16;v++)f[v]=r.getUint32(m+v*4,!1);for(let v=16;v<64;v++){const y=f[v-15],S=f[v-2],I=Oe(y,7)^Oe(y,18)^y>>>3,A=Oe(S,17)^Oe(S,19)^S>>>10;f[v]=f[v-16]+I+f[v-7]+A>>>0}let g=o,b=s,k=a,T=i,$=c,O=l,N=d,w=u;for(let v=0;v<64;v++){const y=Oe($,6)^Oe($,11)^Oe($,25),S=$&O^~$&N,I=w+y+S+wg[v]+f[v]>>>0,A=Oe(g,2)^Oe(g,13)^Oe(g,22),E=g&b^g&k^b&k,R=A+E>>>0;w=N,N=O,O=$,$=T+I>>>0,T=k,k=b,b=g,g=I+R>>>0}o=o+g>>>0,s=s+b>>>0,a=a+k>>>0,i=i+T>>>0,c=c+$>>>0,l=l+O>>>0,d=d+N>>>0,u=u+w>>>0}const h=new Uint8Array(32),p=new DataView(h.buffer);return p.setUint32(0,o,!1),p.setUint32(4,s,!1),p.setUint32(8,a,!1),p.setUint32(12,i,!1),p.setUint32(16,c,!1),p.setUint32(20,l,!1),p.setUint32(24,d,!1),p.setUint32(28,u,!1),h}const pn=64;function gt(e,t){const n=e.length>pn?ge(e):e,r=new Uint8Array(pn);r.set(n);const o=new Uint8Array(pn),s=new Uint8Array(pn);for(let c=0;c<pn;c++)o[c]=r[c]^54,s[c]=r[c]^92;const a=ge(bt(o,t)),i=ge(bt(s,a));return r.fill(0),o.fill(0),s.fill(0),i}function ld(){const e=new Uint8Array(32);return crypto.getRandomValues(e),Ke(e)}function G(e){if(e.length%2!==0)throw new Error(`hexToBytes: odd-length hex string (${e.length} chars)`);const t=new Uint8Array(e.length/2);for(let n=0;n<t.length;n++){const r=e.slice(n*2,n*2+2);if(!/^[0-9a-fA-F]{2}$/.test(r))throw new TypeError(`Invalid hex character at position ${n*2}`);t[n]=parseInt(r,16)}return t}function Ke(e){let t="";for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,"0");return t}function Eg(e,t){if(t+1>=e.length)throw new RangeError(`readUint16BE: offset ${t} out of bounds for length ${e.length}`);return(e[t]<<8|e[t+1])>>>0}function bt(...e){const t=e.reduce((o,s)=>o+s.length,0),n=new Uint8Array(t);let r=0;for(const o of e)n.set(o,r),r+=o.length;return n}function dd(e){let t="";for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return btoa(t)}function kg(e){const t=atob(e),n=new Uint8Array(t.length);for(let r=0;r<t.length;r++)n[r]=t.charCodeAt(r);return n}function _g(e,t){const n=Math.max(e.length,t.length);let r=e.length^t.length;for(let o=0;o<n;o++)r|=(e[o]??0)^(t[o]??0);return r===0}const ga=new TextEncoder;function Bo(e,t){return _g(ga.encode(e),ga.encode(t))}function so(e){return new TextEncoder().encode(e)}function xg(e){return gt(G(e),so("canary:sync:key"))}async function Sg(e,t){const n=crypto.getRandomValues(new Uint8Array(12)),r=await crypto.subtle.importKey("raw",e,{name:"AES-GCM"},!1,["encrypt"]),o=await crypto.subtle.encrypt({name:"AES-GCM",iv:n},r,so(t)),s=bt(n,new Uint8Array(o));return dd(s)}async function Ig(e,t){const n=kg(t);if(n.length<28)throw new Error("decryptEnvelope: encoded data too short (minimum 28 bytes: 12-byte IV + 16-byte GCM tag)");const r=n.slice(0,12),o=n.slice(12),s=await crypto.subtle.importKey("raw",e,{name:"AES-GCM"},!1,["decrypt"]);let a;try{a=await crypto.subtle.decrypt({name:"AES-GCM",iv:r},s,o)}catch{throw new Error("decryptEnvelope: decryption failed — wrong key or tampered data")}return new TextDecoder().decode(a)}function Rg(e,t){if(!/^[0-9a-f]{64}$/.test(t))throw new Error("personalPrivkeyHex must be a 64-character lowercase hex string (32 bytes)");const n=bt(so("canary:sync:sign:"),G(t));return gt(G(e),n)}function Ag(e){return Ke(ge(so(e)))}const bi=604800,ba=100;function yt(e,t=bi){if(!Number.isFinite(e)||e<0)throw new RangeError(`timestampSec must be a non-negative finite number, got ${e}`);if(!Number.isFinite(t)||t<=0)throw new RangeError(`rotationIntervalSec must be a positive finite number, got ${t}`);return Math.floor(e/t)}const Mr=["ability","able","about","above","absent","absorb","abstract","absurd","access","accident","account","accuse","achieve","acid","acorn","acoustic","acquire","across","act","action","actor","actress","actual","adapt","add","addict","address","adjust","admiral","admit","adult","advance","advice","aerobic","affair","afford","afraid","again","age","agent","agree","ahead","aim","air","airport","aisle","alarm","album","alcohol","alert","alien","all","alley","allow","almost","alone","alpha","alpine","already","also","always","amateur","amazing","amber","among","amount","amused","analyst","anchor","ancient","anger","angle","animal","ankle","announce","annual","another","answer","antenna","antique","anvil","anxiety","any","apart","apology","appear","apple","approve","april","apron","arch","arctic","area","arena","argue","arm","armed","armor","army","around","arrange","arrive","arrow","art","artefact","artist","artwork","ask","aspect","asset","assist","assume","asthma","athlete","atom","attack","attend","attitude","attract","auction","audit","august","aunt","author","auto","autumn","average","avocado","avoid","awake","aware","away","awesome","awful","awkward","axis","baby","bachelor","bacon","badge","badger","bag","bakery","balance","balcony","ball","balm","bamboo","banana","banjo","banner","bar","barely","bargain","barrel","base","basic","basil","basket","battle","beach","beacon","bean","beauty","because","become","beef","beetle","before","begin","behave","behind","belfry","believe","below","belt","bench","benefit","berry","best","better","between","beyond","bicycle","bid","bike","bind","biology","birch","bird","birth","bishop","bitter","black","blame","blanket","bleak","bless","bloom","blossom","blouse","blue","blur","blush","board","boat","bobcat","body","boil","bone","bonfire","bonus","book","boost","border","boring","borrow","boss","bottom","bounce","bouquet","box","boy","bracket","brain","branch","brand","brass","brave","bread","breaker","breeze","brick","bridge","brief","bright","bring","brisk","broccoli","bronze","brook","broom","brother","brown","brush","bubble","buckle","buddy","budget","buffalo","bugle","build","bulb","bulk","bumble","bundle","bunker","burger","burrow","burst","bus","bushel","business","busy","butter","buyer","buzz","cabbage","cabin","cable","cactus","cage","cairn","cake","call","calm","camel","camera","camp","can","canal","cancel","candy","canoe","canopy","canvas","canyon","capable","cape","capital","captain","car","caravan","carbon","card","cargo","carpet","carry","cart","case","cash","casino","castle","casual","cat","catalog","catch","category","cattle","caught","cause","caution","cave","cedar","ceiling","celery","cellar","cement","census","century","cereal","certain","chair","chalk","champion","change","chapter","charge","charter","chase","chat","cheap","check","cheese","chef","cherry","chest","chestnut","chicken","chief","child","chimney","choice","choose","chuckle","chunk","churn","cider","cigar","cinnamon","circle","citizen","city","civil","claim","clam","clap","clarify","claw","clay","clean","clerk","clever","click","client","cliff","climb","clinic","clip","cloak","clock","clog","close","cloth","cloud","clown","club","clump","cluster","clutch","coach","coast","cobalt","cocoa","coconut","code","codex","coffee","coil","coin","collect","color","column","combine","come","comet","comfort","comic","common","company","concert","condor","conduct","confirm","congress","connect","consider","consul","control","convince","cook","cool","copper","copy","coral","core","cork","corn","cornet","correct","cosmos","cost","cotton","couch","cougar","country","couple","course","cousin","cover","coyote","crack","cradle","craft","cram","crane","crater","crawl","cream","credit","creek","crew","cricket","crisp","critic","croft","crop","cross","crouch","crowd","crown","crucial","cruise","crumble","crunch","cry","crystal","cube","culture","cup","cupboard","curious","current","curtain","curve","cushion","custom","cute","cycle","cypress","dad","dagger","dahlia","damp","damsel","dance","danger","dapple","daring","dash","daughter","dawn","day","deal","debate","decade","december","decide","decline","decorate","decrease","defense","define","defy","degree","delay","deliver","delta","demand","demise","denial","denim","dentist","depart","depend","deposit","depot","depth","deputy","derive","describe","desert","design","desk","detail","detect","develop","device","devote","diagram","dial","diamond","diary","dice","diesel","diet","differ","digital","dignity","dilemma","dinner","dinosaur","direct","dirt","disagree","discover","dish","display","distance","divert","divide","divorce","dizzy","doctor","document","dog","doll","dolphin","domain","donate","donkey","donor","door","dorsal","double","dove","draft","drafter","dragon","drake","drama","drastic","draw","dream","dress","drift","drifter","drill","drink","drive","drop","droplet","drum","drummer","dry","duck","dulcet","dune","dungeon","during","dusk","dust","dutch","duty","dwarf","dynamic","eager","eagle","early","earn","earth","easily","east","easy","echo","ecology","economy","edge","edgeway","edit","educate","effort","egg","eight","either","elbow","elder","electric","elegant","element","elephant","elevator","elite","elm","else","embark","ember","embody","embrace","emerald","emerge","emotion","employ","empower","empty","enable","enact","end","endless","endorse","enemy","energy","enforce","engage","engine","enhance","enjoy","enlist","enough","enrich","enroll","ensign","ensure","enter","entire","entry","envelope","episode","epoch","equal","equip","era","erase","erode","erosion","error","escape","essay","essence","estate","estuary","eternal","ether","ethics","everest","evidence","evil","evolve","exact","example","exchange","excite","exclude","excuse","execute","exercise","exhaust","exhibit","exist","exit","exotic","expand","expect","explain","express","extend","extra","eye","eyebrow","fabric","face","faculty","fade","faint","faith","falcon","fall","fallow","false","fame","family","famous","fancy","fantasy","farm","fashion","fat","father","fathom","fatigue","favorite","feature","february","federal","fee","feed","feel","female","fence","fennel","fern","festival","fetch","fever","fiber","fiction","fiddle","field","figure","file","film","filter","final","finch","find","finger","finish","fire","firm","first","fiscal","fish","fit","fitness","fix","fjord","flag","flagon","flame","flannel","flash","flat","flavor","flicker","flight","flint","flip","float","flock","floor","floret","fluid","flush","flutter","fly","foal","foam","focus","fog","foil","fold","follow","food","foot","force","forest","forge","forget","fork","fortune","forum","forward","fossil","foster","found","foundry","fox","foxglove","fragile","frame","frequent","fresco","fresh","friend","fringe","frog","front","frost","frown","frozen","fruit","fuel","fun","funny","furnace","furrow","future","gadget","gain","galaxy","gallery","galley","game","gap","garage","garbage","garden","garland","garlic","garment","garnet","gas","gasp","gate","gather","gauge","gaze","gazelle","general","genius","genre","gentle","genuine","gesture","geyser","giant","gibbon","gift","giggle","ginger","giraffe","girl","give","glacier","glad","glance","glare","glass","glen","glide","glimpse","globe","gloom","glory","glove","glow","glue","goat","goblet","goddess","gold","golden","good","goose","gopher","gorge","gorilla","gospel","gossip","govern","gown","grab","grace","grain","granite","grant","grape","grass","gravity","great","green","grid","grocery","group","grow","grunt","guard","guess","guide","guilt","guitar","guppy","gust","gym","habit","half","hamlet","hammer","hammock","hamster","hand","happy","harbor","hard","harness","harvest","hat","have","hawk","hawthorn","head","health","heart","hearth","heavy","hedgehog","height","hello","helmet","help","hen","herald","hermit","hero","heron","hickory","hidden","high","hill","hint","hip","hire","history","hobby","hockey","hold","hole","holiday","hollow","home","homeward","honey","hood","hope","horizon","horn","hornet","horse","hospital","host","hotel","hour","hover","howler","hub","huge","human","humble","humor","hundred","hungry","hunt","hunter","hurdle","hurry","husband","hybrid","ice","icon","idea","identify","idle","igloo","ignore","ill","image","imitate","immune","impact","improve","inch","include","income","increase","index","indicate","indigo","indoor","industry","infant","inflict","inform","inhale","inherit","initial","inject","inkwell","inlet","inmate","inner","innocent","input","inquiry","insect","inside","inspire","install","intact","interest","into","invest","invite","involve","inward","iris","iron","island","issue","item","ivory","jacket","jade","jaguar","jar","jasmine","javelin","jazz","jeans","jelly","jersey","jewel","job","join","joke","jostle","journal","journey","joy","jubilee","judge","juice","jumble","jump","junco","jungle","junior","juniper","just","kangaroo","kayak","keen","keep","keeper","kelp","kennel","kernel","kestrel","ketchup","kettle","key","kick","kid","kidney","kind","kindle","kingdom","kinglet","kipper","kiss","kit","kitchen","kite","kitten","kiwi","knapsack","knee","knife","knock","lab","label","labor","ladder","lady","lake","lamp","language","lantern","lapis","laptop","larch","large","later","latin","laugh","laundry","laurel","lava","lavender","law","lawn","layer","lazy","leader","leaf","learn","leave","lecture","left","leg","legal","legend","leisure","lemon","lend","length","lens","leopard","lesson","letter","level","liar","liberty","library","license","lichen","life","lift","light","like","limit","linden","link","linnet","lion","liquid","list","little","live","lizard","llama","load","loan","lobster","local","lock","locust","lodge","logic","long","loom","loop","lottery","lotus","loud","lounge","love","loyal","lucky","luggage","lumber","lumen","lunar","lunch","luxury","machine","mackerel","magic","magnet","main","major","make","mammal","man","manage","mandate","mango","mansion","mantis","manual","maple","marble","march","margin","marine","market","marriage","marsh","marten","mask","masonry","mass","master","match","material","math","matrix","matter","maximum","maze","meadow","mean","measure","mechanic","medal","media","melody","melt","member","memory","mention","menu","mercy","merge","merit","merlin","merry","mesa","mesh","message","metal","method","micron","middle","midnight","milk","millet","million","mimic","mind","minimum","minnow","minor","minute","miracle","mirage","mirror","miss","mistake","mix","mixed","mixture","moat","mobile","model","modify","mohawk","mom","moment","monarch","mongrel","monitor","monkey","month","moon","moose","moral","more","morning","mortar","mosaic","mosquito","mother","motion","motor","mountain","mouse","move","movie","much","muffin","mullet","multiply","muscle","museum","mushroom","music","muslin","mussel","must","mustang","mutual","myrtle","myself","mystery","myth","naive","name","napkin","narrow","narwhal","nation","nature","near","neck","nectar","need","negative","neither","nephew","nest","nester","net","nettle","network","neutral","never","news","newt","next","nice","nimble","noble","noggin","noise","nomad","nominee","noodle","normal","north","nose","notable","note","nothing","notice","novel","now","nuclear","number","nurse","nut","nutmeg","oak","oakmoss","oasis","obey","object","oblige","observe","obsidian","obtain","ocean","octave","october","odor","off","offer","office","often","oil","okay","old","olive","olympic","omit","once","onion","online","only","onyx","opal","open","opera","opinion","oppose","option","orange","orbit","orchard","orchid","order","ordinary","organ","orient","original","oriole","orphan","osprey","ostrich","other","otter","outdoor","outer","outpost","output","outside","oval","oven","over","own","owner","oxygen","oyster","ozone","pact","paddle","page","pagoda","palace","palm","panda","panel","panther","paper","parade","parent","park","parrot","party","pass","patch","path","patient","patrol","pattern","pause","pave","payment","peanut","peasant","pelican","pen","pencil","people","pepper","perfect","permit","person","phone","photo","phrase","physical","piano","picnic","picture","pigeon","pill","pilot","pink","pioneer","pipe","pitch","pizza","place","planet","plastic","plate","play","please","pledge","pluck","plug","poem","poet","point","polar","pole","police","pond","pony","pool","popular","portion","position","possible","post","potato","pottery","powder","power","practice","praise","predict","prefer","prepare","present","pretty","prevent","price","pride","primary","print","priority","private","prize","process","produce","profit","program","project","promote","proof","property","prosper","protect","proud","provide","public","pudding","pull","pulp","pulse","pumpkin","puppy","purchase","purity","purpose","purse","push","put","puzzle","pyramid","quality","quantum","quarter","question","quick","quiz","quote","rabbit","race","rack","radar","radio","rail","rain","raise","rally","ramp","ranch","random","range","rapid","rare","rate","rather","raven","raw","razor","ready","real","reason","rebuild","recall","receive","recipe","record","recycle","reduce","reflect","reform","refuse","region","regular","relax","release","relief","rely","remain","remember","remove","render","renew","rent","reopen","repair","repeat","replace","report","require","rescue","resource","response","result","retire","retreat","return","reunion","reveal","review","reward","rhythm","rib","ribbon","rice","rich","ride","ridge","rifle","ring","ripple","risk","ritual","rival","river","road","roast","robot","robust","rocket","romance","roof","rookie","room","rose","rotate","round","route","royal","rubber","rug","rule","run","runway","rural","saddle","sadness","safe","salad","salmon","salon","salt","salute","same","sample","sand","satisfy","satoshi","sauce","sausage","save","say","scale","scan","school","science","scorpion","scout","screen","script","scrub","search","season","seat","second","secret","section","security","seed","seek","segment","select","sell","seminar","senior","sense","sentence","service","session","settle","setup","seven","shadow","shallow","share","shed","shell","sheriff","shield","shift","shine","shoe","shoot","shop","short","shoulder","shove","shrimp","shuffle","shy","sibling","sick","side","sight","sign","silent","silk","silly","silver","similar","simple","since","sister","situate","six","size","skate","sketch","ski","skill","skin","skirt","slab","slam","sleep","slice","slide","slight","slim","small","smart","smile","smooth","snack","snake","snow","soap","soccer","social","sock","soda","soft","solar","soldier","solid","solution","solve","someone","song","soon","sort","soul","sound","soup","source","south","space","spare","spatial","speak","special","speed","spell","spend","sphere","spice","spider","spike","spin","spirit","spoil","sponsor","spoon","sport","spot","spray","spread","spring","spy","square","squirrel","stable","stadium","staff","stage","stairs","stamp","stand","start","state","stay","steak","stem","step","stereo","stick","still","stock","stomach","stone","stool","story","stove","strategy","street","strong","student","style","subject","submit","subway","success","such","sudden","sugar","suggest","suit","summer","sunny","sunset","super","supply","supreme","sure","surface","surge","surprise","surround","survey","sustain","swap","swarm","sweet","swift","swim","swing","switch","sword","symbol","syrup","system","table","tackle","tag","talent","talk","tape","task","taste","taxi","teach","team","tell","tennis","term","test","text","thank","theme","then","theory","they","this","thought","thrive","throw","thumb","thunder","ticket","tide","tiger","tilt","timber","time","tiny","tip","tired","tissue","title","toast","today","toddler","together","toilet","token","tomato","tomorrow","tone","tonight","tool","tooth","top","topic","topple","torch","tortoise","toss","total","tourist","tower","town","toy","track","trade","traffic","train","transfer","trap","travel","tray","treat","trend","tribe","trick","trigger","trim","trip","trophy","truck","true","trumpet","truth","try","tuition","tunnel","turkey","turn","turtle","twelve","twenty","twice","twin","twist","two","type","typical","umbrella","unable","unaware","uncle","uncover","under","undo","unfair","unfold","uniform","unique","unit","universe","unknown","unlock","until","unusual","update","upgrade","uphold","upon","upper","upset","urban","urge","usage","use","used","useful","useless","usual","utility","vague","valid","valley","valve","vapor","various","vast","vehicle","velvet","vendor","venue","verb","verify","version","very","vessel","veteran","viable","vibrant","vicious","victory","video","village","vintage","violin","virtual","visa","visit","visual","vital","vivid","vocal","voice","volcano","vote","voyage","wagon","walk","wall","walnut","want","warm","warrior","wash","wasp","water","wave","way","wealth","weasel","web","wedding","weekend","welcome","west","wet","whale","what","wheat","wheel","when","whip","whisper","wide","width","wife","wild","will","win","window","wine","wing","wink","winner","winter","wire","wisdom","wise","wish","witness","wolf","woman","wonder","wool","word","work","world","worry","worth","wreck","wrestle","yard","year","yellow","you","young","youth","zebra","zero","zone","zoo"],hs=2048,Cg=new Map;for(let e=0;e<Mr.length;e++)Cg.set(Mr[e],e);function pr(e){if(e<0||e>=hs)throw new RangeError(`Wordlist index out of range: ${e} (must be 0-${hs-1})`);return Mr[e]}const Dn={format:"words",count:1};function Tg(e,t=1,n=Mr){if(n.length!==2048)throw new RangeError("Wordlist must contain exactly 2048 entries");if(t<1||t>16)throw new RangeError("Word count must be 1–16");if(e.length<t*2)throw new RangeError("Not enough bytes for requested word count");const r=[];for(let o=0;o<t;o++){const s=Eg(e,o*2)%n.length;r.push(n[s])}return r}function Lg(e,t=4){if(t<1||t>10)throw new RangeError("PIN digits must be 1–10");const n=Math.min(Math.ceil(t*.415),e.length),r=Math.pow(10,t);if(t>=9){let s=0n;for(let a=0;a<n;a++)s=s*256n+BigInt(e[a]);return Number(s%BigInt(r)).toString().padStart(t,"0")}let o=0;for(let s=0;s<n;s++)o=o*256+e[s]>>>0;return(o%r).toString().padStart(t,"0")}function Ng(e,t=8){if(t<1||t>64)throw new RangeError("Hex length must be 1–64");const n=Math.ceil(t/2);let r="";for(let o=0;o<n&&o<e.length;o++)r+=e[o].toString(16).padStart(2,"0");return r.slice(0,t)}function ps(e,t=Dn){switch(t.format){case"words":return Tg(e,t.count??1,t.wordlist).join(" ");case"pin":return Lg(e,t.digits??4);case"hex":return Ng(e,t.length??8)}}const vt=10,$g=new TextEncoder;function Tn(e){return $g.encode(e)}function vi(e){if(!Number.isInteger(e)||e<0||e>4294967295)throw new RangeError(`Counter must be an integer 0–${4294967295}, got ${e}`);const t=new Uint8Array(4);return new DataView(t.buffer).setUint32(0,e,!1),t}const va=16;function wi(e){const t=typeof e=="string"?G(e):e;if(t.length<va)throw new RangeError(`Secret must be at least ${va} bytes, got ${t.length}`);return t}function Mg(e,t,n){const r=wi(e),o=bt(Tn(t),vi(n));return gt(r,o)}function Le(e,t,n,r=Dn){const o=Mg(e,t,n);return ps(o,r)}function io(e,t,n,r,o=Dn,s){if(!Number.isInteger(s)||s<0)throw new RangeError("maxTolerance must be a non-negative integer");if(s>vt)throw new RangeError(`maxTolerance must be <= ${vt}, got ${s}`);const a=new Set,i=2*s,c=Math.max(0,r-i),l=Math.min(4294967295,r+i);for(let m=c;m<=l;m++)a.add(Le(e,t,m,o));const d=wi(e),u=bt(Tn(t+":duress"),new Uint8Array([0]),Tn(n),vi(r));let f=gt(d,u),h=ps(f,o),p=1;for(;a.has(h)&&p<=255;)f=gt(d,bt(u,new Uint8Array([p]))),h=ps(f,o),p++;if(a.has(h))throw new Error("Duress token collision unresolvable after 255 retries");return h}function ms(e,t,n,r,o,s){const a=s?.encoding??Dn,i=s?.tolerance??0;if(!Number.isInteger(i)||i<0)throw new RangeError("Tolerance must be a non-negative integer");if(i>vt)throw new RangeError(`Tolerance must be <= ${vt}, got ${i}`);const c=r.toLowerCase().trim().replace(/\s+/g," "),l=Bo(c,Le(e,t,n,a)),d=Math.max(0,n-i),u=Math.min(4294967295,n+i),f=[];for(const p of o){let m=!1;for(let g=d;g<=u;g++)Bo(c,io(e,t,p,g,a,i))&&(m=!0);m&&f.push(p)}let h=!1;for(let p=d;p<=u;p++)p!==n&&Bo(c,Le(e,t,p,a))&&(h=!0);return l?{status:"valid"}:f.length>0?{status:"duress",identities:f}:h?{status:"valid"}:{status:"invalid"}}function Og(e,t,n,r){const o=wi(e),s=bt(Tn(t+":alive"),new Uint8Array([0]),Tn(n),vi(r));return gt(o,s)}function Bg(e,t,n,r,o=Dn){return{[n[0]]:Le(e,`${t}:${n[0]}`,r,o),[n[1]]:Le(e,`${t}:${n[1]}`,r,o)}}const Po=Object.freeze({family:Object.freeze({wordCount:1,rotationInterval:bi,description:"Casual verification for family and friends. Single word, weekly rotation. Adequate for live voice/video calls where the attacker gets one attempt. NOT suitable for text-based verification — 11 bits of entropy is trivially brute-forceable without rate limiting."}),"field-ops":Object.freeze({wordCount:2,rotationInterval:86400,description:"High-security preset for journalism, activism, and field operations. Two-word phrases (~22 bits) with daily rotation. Use burn-after-use for maximum protection."}),enterprise:Object.freeze({wordCount:2,rotationInterval:172800,description:"Enterprise incident response. Two-word phrases with 48-hour rotation. Balances security with operational convenience for larger teams."}),event:Object.freeze({wordCount:1,rotationInterval:14400,description:"Temporary groups for conferences, festivals, and meetups. Single word with 4-hour rotation. Fast setup, easy to share at the door."})}),Pg=/^[0-9a-f]{64}$/,wa=100;function ys(e){if(!Pg.test(e))throw new Error(`Invalid member pubkey: expected 64 hex characters, got ${e.length} chars`)}function Ug(e){if(e.preset!==void 0&&(typeof e.preset!="string"||!Object.hasOwn(Po,e.preset)))throw new Error(`Unknown preset: "${e.preset}". Valid presets: ${Object.keys(Po).join(", ")}`);const t=Math.floor(Date.now()/1e3),n=e.preset!==void 0?Po[e.preset]:void 0,r=e.rotationInterval??n?.rotationInterval??bi,o=e.wordCount??n?.wordCount??1,s=e.tolerance??1;if(!Number.isInteger(r)||r<=0)throw new Error(`rotationInterval must be a positive integer, got ${r}`);if(o!==1&&o!==2&&o!==3)throw new Error(`wordCount must be 1, 2, or 3, got ${o}`);if(!Number.isInteger(s)||s<0||s>vt)throw new RangeError(`tolerance must be an integer 0–${vt}, got ${s}`);if(e.beaconInterval!==void 0&&(!Number.isInteger(e.beaconInterval)||e.beaconInterval<=0))throw new Error(`beaconInterval must be a positive integer, got ${e.beaconInterval}`);if(e.beaconPrecision!==void 0&&(!Number.isInteger(e.beaconPrecision)||e.beaconPrecision<1||e.beaconPrecision>11))throw new Error(`beaconPrecision must be an integer between 1 and 11, got ${e.beaconPrecision}`);for(const a of e.members)ys(a);if(e.creator!==void 0&&(ys(e.creator),!e.members.includes(e.creator)))throw new Error("creator must be in members");return o===1&&e.members.length>=10&&console.warn(`[canary-kit] Group "${e.name}" has ${e.members.length} members with 1-word encoding. CANARY spec recommends 2+ words for groups of 10+ members to avoid duress collision (~2.2% at 10 members).`),{name:e.name,seed:ld(),members:[...e.members],rotationInterval:r,wordCount:o,tolerance:s,wordlist:e.wordlist??"en-v1",counter:yt(t,r),usageOffset:0,createdAt:t,beaconInterval:e.beaconInterval??300,beaconPrecision:e.beaconPrecision??6,admins:e.creator?[e.creator]:[],epoch:0,consumedOps:[]}}function Dg(e){const t=yt(Math.floor(Date.now()/1e3),e.rotationInterval),n=e.counter+e.usageOffset+1;if(n>t+ba)throw new RangeError(`Cannot advance counter: effective counter ${n} would exceed time-based counter ${t} + MAX_COUNTER_OFFSET (${ba})`);return{...e,usageOffset:e.usageOffset+1}}function Ei(e){return{...e,seed:ld(),usageOffset:0}}function ud(e,t){if(ys(t),e.members.includes(t))return e;if(e.members.length>=wa)throw new Error(`Cannot add member: group has reached the maximum of ${wa} members`);return{...e,members:[...e.members,t]}}function fd(e,t){return{...e,members:e.members.filter(n=>n!==t)}}function jg(e,t=Math.floor(Date.now()/1e3)){const n=yt(t,e.rotationInterval);return n<=e.counter?e:{...e,counter:n,usageOffset:0}}const qg=new Set(["member-join","member-leave","counter-advance","reseed","beacon","duress-alert","duress-clear","liveness-checkin","state-snapshot"]),Be=/^[0-9a-f]{64}$/,Ea=100,Hg=2e7,gs=300,ka=1e3;function Uo(e,t,n,r){const o=[...e,t];return o.length>ka?{consumedOps:o.slice(-ka),consumedOpsFloor:Math.max(r??0,n)}:{consumedOps:o,consumedOpsFloor:r}}const Ce=2;function Wt(e){return typeof e=="number"&&Number.isFinite(e)}function Pe(e){return Wt(e)&&Number.isInteger(e)&&e>=0}function _a(e){const t={...e,protocolVersion:Ce};if(e.type==="reseed"){const{seed:n,...r}=t;return JSON.stringify({...r,seed:Ke(e.seed)})}return JSON.stringify(t)}function Or(e){if(e==null)return"null";if(typeof e=="boolean"||typeof e=="number"||typeof e=="string")return JSON.stringify(e);if(Array.isArray(e))return"["+e.map(Or).join(",")+"]";if(e instanceof Uint8Array)throw new Error("stableStringify: Uint8Array must be hex-encoded before serialisation");if(typeof e=="object"){const t=e;return"{"+Object.keys(t).sort().filter(o=>t[o]!==void 0).map(o=>JSON.stringify(o)+":"+Or(t[o])).join(",")+"}"}throw new Error(`stableStringify: unsupported type ${typeof e}`)}function nr(e){if(e.type==="reseed"){const{seed:t,...n}=e;return Or({...n,seed:Ke(t)})}return Or(e)}function xa(e){let t;try{t=JSON.parse(e)}catch{throw new Error("Invalid sync message: not valid JSON")}const n=t.type;if(typeof n!="string"||!qg.has(n))throw new Error(`Invalid sync message type: ${String(n)}`);const r=t.timestamp;if(!Pe(r))throw new Error("Invalid sync message: missing or invalid timestamp");const o=t.protocolVersion;if(o==null)throw new Error("Invalid sync message: protocolVersion is required");if(o!==Ce)throw new Error(`Unsupported protocol version: ${o} (expected: ${Ce})`);switch(n){case"member-join":if(typeof t.pubkey!="string"||!Be.test(t.pubkey))throw new Error("Invalid sync message: member-join requires a 64-char hex pubkey");if(!Pe(t.epoch))throw new Error("Invalid sync message: member-join requires a non-negative epoch");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: member-join requires a non-empty opId (max 128 chars)");break;case"member-leave":if(typeof t.pubkey!="string"||!Be.test(t.pubkey))throw new Error("Invalid sync message: member-leave requires a 64-char hex pubkey");if(!Pe(t.epoch))throw new Error("Invalid sync message: member-leave requires a non-negative epoch");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: member-leave requires a non-empty opId (max 128 chars)");break;case"liveness-checkin":if(typeof t.pubkey!="string"||!Be.test(t.pubkey))throw new Error("Invalid sync message: liveness-checkin requires a 64-char hex pubkey");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: liveness-checkin requires a non-empty opId (max 128 chars)");break;case"counter-advance":if(!Pe(t.counter))throw new Error("Invalid sync message: counter-advance requires a non-negative counter");if(!Pe(t.usageOffset))throw new Error("Invalid sync message: counter-advance requires a non-negative usageOffset");break;case"reseed":if(typeof t.seed!="string"||!Be.test(t.seed))throw new Error("Invalid sync message: reseed.seed must be a 64-char hex string");if(!Pe(t.counter))throw new Error("Invalid sync message: reseed requires a non-negative counter");if(!Pe(t.epoch))throw new Error("Invalid sync message: reseed requires a non-negative epoch");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: reseed requires a non-empty opId (max 128 chars)");if(!Array.isArray(t.admins)||!t.admins.every(s=>typeof s=="string"&&Be.test(s)))throw new Error("Invalid sync message: reseed.admins must be 64-char hex pubkeys");if(!Array.isArray(t.members)||!t.members.every(s=>typeof s=="string"&&Be.test(s)))throw new Error("Invalid sync message: reseed.members must be 64-char hex pubkeys");return{type:n,seed:G(t.seed),counter:t.counter,timestamp:r,epoch:t.epoch,opId:t.opId,admins:[...t.admins],members:[...t.members],protocolVersion:Ce};case"beacon":if(!Wt(t.lat)||!Wt(t.lon))throw new Error("Invalid sync message: beacon requires numeric lat and lon");if(t.lat<-90||t.lat>90||t.lon<-180||t.lon>180)throw new Error("Invalid sync message: beacon lat/lon out of range");if(!Wt(t.accuracy)||t.accuracy<0||t.accuracy>Hg)throw new Error("Invalid sync message: beacon requires a non-negative accuracy");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: beacon requires a non-empty opId (max 128 chars)");break;case"duress-alert":if(!Wt(t.lat)||!Wt(t.lon))throw new Error("Invalid sync message: duress-alert requires numeric lat and lon");if(t.lat<-90||t.lat>90||t.lon<-180||t.lon>180)throw new Error("Invalid sync message: duress-alert lat/lon out of range");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: duress-alert requires a non-empty opId (max 128 chars)");break;case"state-snapshot":if(typeof t.seed!="string"||!Be.test(t.seed))throw new Error("Invalid sync message: state-snapshot requires a 64-char hex seed");if(!Pe(t.counter))throw new Error("Invalid sync message: state-snapshot requires a non-negative counter");if(!Pe(t.usageOffset))throw new Error("Invalid sync message: state-snapshot requires a non-negative usageOffset");if(!Array.isArray(t.members)||!t.members.every(s=>typeof s=="string"&&Be.test(s)))throw new Error("Invalid sync message: state-snapshot members must be 64-char hex pubkeys");if(!Array.isArray(t.admins)||!t.admins.every(s=>typeof s=="string"&&Be.test(s)))throw new Error("Invalid sync message: state-snapshot admins must be 64-char hex pubkeys");if(!Pe(t.epoch))throw new Error("Invalid sync message: state-snapshot requires a non-negative epoch");if(typeof t.opId!="string"||t.opId.length===0||t.opId.length>128)throw new Error("Invalid sync message: state-snapshot requires a non-empty opId (max 128 chars)");if(t.prevEpochSeed!==void 0&&(typeof t.prevEpochSeed!="string"||!Be.test(t.prevEpochSeed)))throw new Error("Invalid sync message: state-snapshot.prevEpochSeed must be a 64-char hex string");break}return t}function Sa(e,t){return e.type==="reseed"||e.type==="state-snapshot"||e.type==="member-join"&&e.pubkey!==t||e.type==="member-leave"&&e.pubkey!==t}function hd(e,t,n=Math.floor(Date.now()/1e3),r){if(Sa(t,r)){if(!r||!e.admins.includes(r))return e;const o=t.epoch,s=t.opId;if(o===void 0||s===void 0||o<e.epoch)return e;if(t.type==="reseed"){if(o!==e.epoch+1)return e;const a=t;if(!a.admins||!a.members)return e;const i=new Set(a.members);if(!a.admins.every(c=>i.has(c)))return e}else if(t.type==="state-snapshot"){if(o<e.epoch)return e;const a=t;if(!a.admins||!a.members)return e;const i=new Set(a.members);if(!a.admins.every(c=>i.has(c)))return e}else if(o!==e.epoch)return e;if(t.type!=="reseed"&&!(t.type==="state-snapshot"&&o>e.epoch)&&(new Set(e.consumedOps).has(s)||e.consumedOpsFloor!==void 0&&t.timestamp<=e.consumedOpsFloor))return e}if(t.type==="duress-alert"||t.type==="beacon"||t.type==="liveness-checkin"){const o=n-t.timestamp;if(o>gs||o<-60)return e}if(t.type==="liveness-checkin"&&r&&t.pubkey!==r||t.type==="member-leave"&&!Sa(t,r)&&(new Set(e.consumedOps).has(t.opId)||e.consumedOpsFloor!==void 0&&t.timestamp<=e.consumedOpsFloor))return e;switch(t.type){case"member-join":{const o=ud(e,t.pubkey),s=Uo(o.consumedOps,t.opId,t.timestamp,e.consumedOpsFloor),a=t.displayName?{memberNames:{...o.memberNames,[t.pubkey]:t.displayName}}:{};return{...o,...s,...a}}case"member-leave":if(!e.members.includes(t.pubkey))return e;{const o=fd(e,t.pubkey),s=Uo(o.consumedOps,t.opId,t.timestamp,e.consumedOpsFloor);return{...o,...s}}case"counter-advance":{if(!r||!e.members.includes(r)||t.usageOffset>Ea)return e;const o=e.counter+e.usageOffset,s=t.counter+t.usageOffset;if(s<=o)return e;const i=Math.floor(n/e.rotationInterval)+Ea;return s>i?e:{...e,counter:t.counter,usageOffset:t.usageOffset}}case"reseed":return{...e,seed:Ke(t.seed),counter:t.counter,usageOffset:0,members:[...t.members],admins:[...t.admins],epoch:t.epoch,consumedOps:[t.opId]};case"state-snapshot":{if(t.epoch===e.epoch){if(t.seed!==e.seed)return e;const o=e.counter+e.usageOffset;if(t.counter+t.usageOffset<o||!e.members.every(i=>t.members.includes(i))||!e.admins.every(i=>t.admins.includes(i)))return e;const a=Uo(e.consumedOps,t.opId,t.timestamp,e.consumedOpsFloor);return{...e,counter:t.counter,usageOffset:t.usageOffset,members:[...t.members],admins:[...t.admins],...a}}return e}case"beacon":case"duress-alert":case"liveness-checkin":return e;default:return e}}var Gt=Symbol("verified"),Fg=e=>e instanceof Object;function Gg(e){if(!Fg(e)||typeof e.kind!="number"||typeof e.content!="string"||typeof e.created_at!="number"||typeof e.pubkey!="string"||!e.pubkey.match(/^[a-f0-9]{64}$/)||!Array.isArray(e.tags))return!1;for(let t=0;t<e.tags.length;t++){let n=e.tags[t];if(!Array.isArray(n))return!1;for(let r=0;r<n.length;r++)if(typeof n[r]!="string")return!1}return!0}new TextDecoder("utf-8");var Kg=new TextEncoder,Vg=class{generateSecretKey(){return Q.utils.randomSecretKey()}getPublicKey(t){return q(Q.getPublicKey(t))}finalizeEvent(t,n){const r=t;return r.pubkey=q(Q.getPublicKey(n)),r.id=Do(r),r.sig=q(Q.sign(z(Do(r)),n)),r[Gt]=!0,r}verifyEvent(t){if(typeof t[Gt]=="boolean")return t[Gt];try{const n=Do(t);if(n!==t.id)return t[Gt]=!1,!1;const r=Q.verify(z(t.sig),z(n),z(t.pubkey));return t[Gt]=r,r}catch{return t[Gt]=!1,!1}}};function Wg(e){if(!Gg(e))throw new Error("can't serialize event with wrong or missing properties");return JSON.stringify([0,e.pubkey,e.created_at,e.kind,e.tags,e.content])}function Do(e){let t=se(Kg.encode(Wg(e)));return q(t)}var ao=new Vg,zg=ao.generateSecretKey,co=ao.getPublicKey,nt=ao.finalizeEvent,Ia=ao.verifyEvent,Jg=new TextDecoder("utf-8"),pd=new TextEncoder,md=1,yd=65535;function be(e,t){const n=Ue.getSharedSecret(e,z("02"+t)).subarray(1,33);return al(se,n,pd.encode("nip44-v2"))}function gd(e,t){const n=cl(se,e,t,76);return{chacha_key:n.subarray(0,32),chacha_nonce:n.subarray(32,44),hmac_key:n.subarray(44,76)}}function bd(e){if(!Number.isSafeInteger(e)||e<1)throw new Error("expected positive integer");if(e<=32)return 32;const t=1<<Math.floor(Math.log2(e-1))+1,n=t<=256?32:t/8;return n*(Math.floor((e-1)/n)+1)}function Yg(e){if(!Number.isSafeInteger(e)||e<md||e>yd)throw new Error("invalid plaintext size: must be between 1 and 65535 bytes");const t=new Uint8Array(2);return new DataView(t.buffer).setUint16(0,e,!1),t}function Zg(e){const t=pd.encode(e),n=t.length,r=Yg(n),o=new Uint8Array(bd(n)-n);return oe(r,t,o)}function Xg(e){const t=new DataView(e.buffer).getUint16(0),n=e.subarray(2,2+t);if(t<md||t>yd||n.length!==t||e.length!==2+bd(t))throw new Error("invalid padding");return Jg.decode(n)}function vd(e,t,n){if(n.length!==32)throw new Error("AAD associated data must be 32 bytes");const r=oe(n,t);return tt(se,e,r)}function Qg(e){if(typeof e!="string")throw new Error("payload must be a valid string");const t=e.length;if(t<132||t>87472)throw new Error("invalid payload length: "+t);if(e[0]==="#")throw new Error("unknown encryption version");let n;try{n=Fe.decode(e)}catch(s){throw new Error("invalid base64: "+s.message)}const r=n.length;if(r<99||r>65603)throw new Error("invalid data length: "+r);const o=n[0];if(o!==2)throw new Error("unknown encryption version "+o);return{nonce:n.subarray(1,33),ciphertext:n.subarray(33,-32),mac:n.subarray(-32)}}function Bt(e,t,n=wt(32)){const{chacha_key:r,chacha_nonce:o,hmac_key:s}=gd(t,n),a=Zg(e),i=zr(r,o,a),c=vd(s,i,n);return Fe.encode(oe(new Uint8Array([2]),n,i,c))}function Pt(e,t){const{nonce:n,ciphertext:r,mac:o}=Qg(e),{chacha_key:s,chacha_nonce:a,hmac_key:i}=gd(t,n),c=vd(i,r,n);if(!Qc(c,o))throw new Error("invalid MAC");const l=zr(s,a,r);return Xg(l)}function jo(e){if(!/^[0-9a-f]*$/i.test(e)||e.length%2!==0)throw new Error(`Invalid hex string: "${e.slice(0,20)}${e.length>20?"…":""}"`);const t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function eb(e){return Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}class Ra{constructor(t,n){this.pubkey=t,this.privkeyHex=n}async sign(t){const n=jo(this.privkeyHex);return nt(t,n)}async encrypt(t,n){const r=jo(this.privkeyHex),o=be(r,n);return Bt(t,o)}async decrypt(t,n){const r=jo(this.privkeyHex),o=be(r,n);return Pt(t,o)}}class wd{pubkey;signingKey;constructor(t,n){this.signingKey=Rg(t,n),this.pubkey=co(this.signingKey)}async sign(t){return nt(t,this.signingKey)}}function Ed(){return typeof window.nostr?.signEvent=="function"}async function tb(e){if(e.privkey&&e.pubkey)return{signer:new Ra(e.pubkey,e.privkey),signerType:"local",pubkey:e.pubkey,privkey:e.privkey};const t=zg(),n=co(t),r=eb(t);return{signer:new Ra(n,r),signerType:"local",pubkey:n,privkey:r}}var xt=Symbol("verified"),nb=e=>e instanceof Object;function rb(e){if(!nb(e)||typeof e.kind!="number"||typeof e.content!="string"||typeof e.created_at!="number"||typeof e.pubkey!="string"||!e.pubkey.match(/^[a-f0-9]{64}$/)||!Array.isArray(e.tags))return!1;for(let t=0;t<e.tags.length;t++){let n=e.tags[t];if(!Array.isArray(n))return!1;for(let r=0;r<n.length;r++)if(typeof n[r]!="string")return!1}return!0}new TextDecoder("utf-8");var ob=new TextEncoder;function vn(e){try{e.indexOf("://")===-1&&(e="wss://"+e);let t=new URL(e);return t.protocol==="http:"?t.protocol="ws:":t.protocol==="https:"&&(t.protocol="wss:"),t.pathname=t.pathname.replace(/\/+/g,"/"),t.pathname.endsWith("/")&&(t.pathname=t.pathname.slice(0,-1)),(t.port==="80"&&t.protocol==="ws:"||t.port==="443"&&t.protocol==="wss:")&&(t.port=""),t.searchParams.sort(),t.hash="",t.toString()}catch{throw new Error(`Invalid URL: ${e}`)}}var sb=class{generateSecretKey(){return Q.utils.randomSecretKey()}getPublicKey(e){return q(Q.getPublicKey(e))}finalizeEvent(e,t){const n=e;return n.pubkey=q(Q.getPublicKey(t)),n.id=qo(n),n.sig=q(Q.sign(z(qo(n)),t)),n[xt]=!0,n}verifyEvent(e){if(typeof e[xt]=="boolean")return e[xt];try{const t=qo(e);if(t!==e.id)return e[xt]=!1,!1;const n=Q.verify(z(e.sig),z(t),z(e.pubkey));return e[xt]=n,n}catch{return e[xt]=!1,!1}}};function ib(e){if(!rb(e))throw new Error("can't serialize event with wrong or missing properties");return JSON.stringify([0,e.pubkey,e.created_at,e.kind,e.tags,e.content])}function qo(e){let t=se(ob.encode(ib(e)));return q(t)}var lo=new sb;lo.generateSecretKey;lo.getPublicKey;lo.finalizeEvent;var ab=lo.verifyEvent,cb=22242;function lb(e,t){if(e.ids&&e.ids.indexOf(t.id)===-1||e.kinds&&e.kinds.indexOf(t.kind)===-1||e.authors&&e.authors.indexOf(t.pubkey)===-1)return!1;for(let n in e)if(n[0]==="#"){let r=n.slice(1),o=e[`#${r}`];if(o&&!t.tags.find(([s,a])=>s===n.slice(1)&&o.indexOf(a)!==-1))return!1}return!(e.since&&t.created_at<e.since||e.until&&t.created_at>e.until)}function db(e,t){for(let n=0;n<e.length;n++)if(lb(e[n],t))return!0;return!1}function ub(e,t){let n=t.length+3,r=e.indexOf(`"${t}":`)+n,o=e.slice(r).indexOf('"')+r+1;return e.slice(o,o+64)}function fb(e){let t=e.slice(0,22).indexOf('"EVENT"');if(t===-1)return null;let n=e.slice(t+7+1).indexOf('"');if(n===-1)return null;let r=t+7+1+n,o=e.slice(r+1,80).indexOf('"');if(o===-1)return null;let s=r+1+o;return e.slice(r+1,s)}function hb(e,t){return{kind:cb,created_at:Math.floor(Date.now()/1e3),tags:[["relay",e],["challenge",t]],content:""}}var kd=class extends Error{constructor(e,t){super(`Tried to send message '${e} on a closed connection to ${t}.`),this.name="SendingOnClosedConnection"}},_d=class{url;_connected=!1;onclose=null;onnotice=e=>console.debug(`NOTICE from ${this.url}: ${e}`);onauth;baseEoseTimeout=4400;publishTimeout=4400;pingFrequency=29e3;pingTimeout=2e4;resubscribeBackoff=[1e4,1e4,1e4,2e4,2e4,3e4,6e4];openSubs=new Map;enablePing;enableReconnect;idleSince=Date.now();ongoingOperations=0;reconnectTimeoutHandle;pingIntervalHandle;reconnectAttempts=0;skipReconnection=!1;connectionPromise;openCountRequests=new Map;openEventPublishes=new Map;ws;challenge;authPromise;serial=0;verifyEvent;_WebSocket;constructor(e,t){this.url=vn(e),this.verifyEvent=t.verifyEvent,this._WebSocket=t.websocketImplementation||WebSocket,this.enablePing=t.enablePing,this.enableReconnect=t.enableReconnect||!1}static async connect(e,t){const n=new _d(e,t);return await n.connect(t),n}closeAllSubscriptions(e){for(let[t,n]of this.openSubs)n.close(e);this.openSubs.clear();for(let[t,n]of this.openEventPublishes)n.reject(new Error(e));this.openEventPublishes.clear();for(let[t,n]of this.openCountRequests)n.reject(new Error(e));this.openCountRequests.clear()}get connected(){return this._connected}async reconnect(){const e=this.resubscribeBackoff[Math.min(this.reconnectAttempts,this.resubscribeBackoff.length-1)];this.reconnectAttempts++,this.reconnectTimeoutHandle=setTimeout(async()=>{try{await this.connect()}catch{}},e)}handleHardClose(e){this.pingIntervalHandle&&(clearInterval(this.pingIntervalHandle),this.pingIntervalHandle=void 0),this._connected=!1,this.connectionPromise=void 0,this.idleSince=void 0,this.enableReconnect&&!this.skipReconnection?this.reconnect():(this.onclose?.(),this.closeAllSubscriptions(e))}async connect(e){let t;return this.connectionPromise?this.connectionPromise:(this.challenge=void 0,this.authPromise=void 0,this.skipReconnection=!1,this.connectionPromise=new Promise((n,r)=>{e?.timeout&&(t=setTimeout(()=>{r("connection timed out"),this.connectionPromise=void 0,this.skipReconnection=!0,this.onclose?.(),this.handleHardClose("relay connection timed out")},e.timeout)),e?.abort&&(e.abort.onabort=r);try{this.ws=new this._WebSocket(this.url)}catch(o){clearTimeout(t),r(o);return}this.ws.onopen=()=>{this.reconnectTimeoutHandle&&(clearTimeout(this.reconnectTimeoutHandle),this.reconnectTimeoutHandle=void 0),clearTimeout(t),this._connected=!0;const o=this.reconnectAttempts>0;this.reconnectAttempts=0;for(const s of this.openSubs.values()){if(s.eosed=!1,o)for(let a=0;a<s.filters.length;a++)s.lastEmitted&&(s.filters[a].since=s.lastEmitted+1);s.fire()}this.enablePing&&(this.pingIntervalHandle=setInterval(()=>this.pingpong(),this.pingFrequency)),n()},this.ws.onerror=()=>{clearTimeout(t),r("connection failed"),this.connectionPromise=void 0,this.skipReconnection=!0,this.onclose?.(),this.handleHardClose("relay connection failed")},this.ws.onclose=o=>{clearTimeout(t),r(o.message||"websocket closed"),this.handleHardClose("relay connection closed")},this.ws.onmessage=this._onmessage.bind(this)}),this.connectionPromise)}waitForPingPong(){return new Promise(e=>{this.ws.once("pong",()=>e(!0)),this.ws.ping()})}waitForDummyReq(){return new Promise((e,t)=>{if(!this.connectionPromise)return t(new Error(`no connection to ${this.url}, can't ping`));try{const n=this.subscribe([{ids:["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"],limit:0}],{label:"<forced-ping>",oneose:()=>{e(!0),n.close()},onclose(){e(!0)},eoseTimeout:this.pingTimeout+1e3})}catch(n){t(n)}})}async pingpong(){this.ws?.readyState===1&&(await Promise.any([this.ws&&this.ws.ping&&this.ws.once?this.waitForPingPong():this.waitForDummyReq(),new Promise(t=>setTimeout(()=>t(!1),this.pingTimeout))])||this.ws?.readyState===this._WebSocket.OPEN&&this.ws?.close())}async send(e){if(!this.connectionPromise)throw new kd(e,this.url);this.connectionPromise.then(()=>{this.ws?.send(e)})}async auth(e){const t=this.challenge;if(!t)throw new Error("can't perform auth, no challenge was received");return this.authPromise?this.authPromise:(this.authPromise=new Promise(async(n,r)=>{try{let o=await e(hb(this.url,t)),s=setTimeout(()=>{let a=this.openEventPublishes.get(o.id);a&&(a.reject(new Error("auth timed out")),this.openEventPublishes.delete(o.id))},this.publishTimeout);this.openEventPublishes.set(o.id,{resolve:n,reject:r,timeout:s}),this.send('["AUTH",'+JSON.stringify(o)+"]")}catch(o){console.warn("subscribe auth function failed:",o)}}),this.authPromise)}async publish(e){this.idleSince=void 0,this.ongoingOperations++;const t=new Promise((n,r)=>{const o=setTimeout(()=>{const s=this.openEventPublishes.get(e.id);s&&(s.reject(new Error("publish timed out")),this.openEventPublishes.delete(e.id))},this.publishTimeout);this.openEventPublishes.set(e.id,{resolve:n,reject:r,timeout:o})});return this.send('["EVENT",'+JSON.stringify(e)+"]"),this.ongoingOperations--,this.ongoingOperations===0&&(this.idleSince=Date.now()),t}async count(e,t){this.serial++;const n=t?.id||"count:"+this.serial,r=new Promise((o,s)=>{this.openCountRequests.set(n,{resolve:o,reject:s})});return this.send('["COUNT","'+n+'",'+JSON.stringify(e).substring(1)),r}subscribe(e,t){t.label!=="<forced-ping>"&&(this.idleSince=void 0,this.ongoingOperations++);const n=this.prepareSubscription(e,t);return n.fire(),t.abort&&(t.abort.onabort=()=>n.close(String(t.abort.reason||"<aborted>"))),n}prepareSubscription(e,t){this.serial++;const n=t.id||(t.label?t.label+":":"sub:")+this.serial,r=new pb(this,n,e,t);return this.openSubs.set(n,r),r}close(){this.skipReconnection=!0,this.reconnectTimeoutHandle&&(clearTimeout(this.reconnectTimeoutHandle),this.reconnectTimeoutHandle=void 0),this.pingIntervalHandle&&(clearInterval(this.pingIntervalHandle),this.pingIntervalHandle=void 0),this.closeAllSubscriptions("relay connection closed by us"),this._connected=!1,this.idleSince=void 0,this.onclose?.(),this.ws?.readyState===this._WebSocket.OPEN&&this.ws?.close()}_onmessage(e){const t=e.data;if(!t)return;const n=fb(t);if(n){const r=this.openSubs.get(n);if(!r)return;const o=ub(t,"id"),s=r.alreadyHaveEvent?.(o);if(r.receivedEvent?.(this,o),s)return}try{let r=JSON.parse(t);switch(r[0]){case"EVENT":{const o=this.openSubs.get(r[1]),s=r[2];this.verifyEvent(s)&&db(o.filters,s)?o.onevent(s):o.oninvalidevent?.(s),(!o.lastEmitted||o.lastEmitted<s.created_at)&&(o.lastEmitted=s.created_at);return}case"COUNT":{const o=r[1],s=r[2],a=this.openCountRequests.get(o);a&&(a.resolve(s.count),this.openCountRequests.delete(o));return}case"EOSE":{const o=this.openSubs.get(r[1]);if(!o)return;o.receivedEose();return}case"OK":{const o=r[1],s=r[2],a=r[3],i=this.openEventPublishes.get(o);i&&(clearTimeout(i.timeout),s?i.resolve(a):i.reject(new Error(a)),this.openEventPublishes.delete(o));return}case"CLOSED":{const o=r[1],s=this.openSubs.get(o);if(!s)return;s.closed=!0,s.close(r[2]);return}case"NOTICE":{this.onnotice(r[1]);return}case"AUTH":{this.challenge=r[1],this.onauth&&this.auth(this.onauth);return}default:{this.openSubs.get(r[1])?.oncustom?.(r);return}}}catch(r){try{const[o,s,a]=JSON.parse(t);console.warn(`[nostr] relay ${this.url} error processing message:`,r,a)}catch{console.warn(`[nostr] relay ${this.url} error processing message:`,r)}return}}},pb=class{relay;id;lastEmitted;closed=!1;eosed=!1;filters;alreadyHaveEvent;receivedEvent;onevent;oninvalidevent;oneose;onclose;oncustom;eoseTimeout;eoseTimeoutHandle;constructor(e,t,n,r){if(n.length===0)throw new Error("subscription can't be created with zero filters");this.relay=e,this.filters=n,this.id=t,this.alreadyHaveEvent=r.alreadyHaveEvent,this.receivedEvent=r.receivedEvent,this.eoseTimeout=r.eoseTimeout||e.baseEoseTimeout,this.oneose=r.oneose,this.onclose=r.onclose,this.oninvalidevent=r.oninvalidevent,this.onevent=r.onevent||(o=>{console.warn(`onevent() callback not defined for subscription '${this.id}' in relay ${this.relay.url}. event received:`,o)})}fire(){this.relay.send('["REQ","'+this.id+'",'+JSON.stringify(this.filters).substring(1)),this.eoseTimeoutHandle=setTimeout(this.receivedEose.bind(this),this.eoseTimeout)}receivedEose(){this.eosed||(clearTimeout(this.eoseTimeoutHandle),this.eosed=!0,this.oneose?.())}close(e="closed by caller"){if(!this.closed&&this.relay.connected){try{this.relay.send('["CLOSE",'+JSON.stringify(this.id)+"]")}catch(t){if(!(t instanceof kd))throw t}this.closed=!0}this.relay.openSubs.delete(this.id),this.relay.ongoingOperations--,this.relay.ongoingOperations===0&&(this.relay.idleSince=Date.now()),this.onclose?.(e)}},mb=e=>(e[xt]=!0,!0),yb=class{relays=new Map;seenOn=new Map;trackRelays=!1;verifyEvent;enablePing;enableReconnect;automaticallyAuth;trustedRelayURLs=new Set;onRelayConnectionFailure;onRelayConnectionSuccess;allowConnectingToRelay;maxWaitForConnection;_WebSocket;constructor(e){this.verifyEvent=e.verifyEvent,this._WebSocket=e.websocketImplementation,this.enablePing=e.enablePing,this.enableReconnect=e.enableReconnect||!1,this.automaticallyAuth=e.automaticallyAuth,this.onRelayConnectionFailure=e.onRelayConnectionFailure,this.onRelayConnectionSuccess=e.onRelayConnectionSuccess,this.allowConnectingToRelay=e.allowConnectingToRelay,this.maxWaitForConnection=e.maxWaitForConnection||3e3}async ensureRelay(e,t){e=vn(e);let n=this.relays.get(e);if(n||(n=new _d(e,{verifyEvent:this.trustedRelayURLs.has(e)?mb:this.verifyEvent,websocketImplementation:this._WebSocket,enablePing:this.enablePing,enableReconnect:this.enableReconnect}),n.onclose=()=>{this.relays.delete(e)},this.relays.set(e,n)),this.automaticallyAuth){const r=this.automaticallyAuth(e);r&&(n.onauth=r)}try{await n.connect({timeout:t?.connectionTimeout,abort:t?.abort})}catch(r){throw this.relays.delete(e),r}return n}close(e){e.map(vn).forEach(t=>{this.relays.get(t)?.close(),this.relays.delete(t)})}subscribe(e,t,n){const r=[],o=[];for(let s=0;s<e.length;s++){const a=vn(e[s]);r.find(i=>i.url===a)||o.indexOf(a)===-1&&(o.push(a),r.push({url:a,filter:t}))}return this.subscribeMap(r,n)}subscribeMany(e,t,n){return this.subscribe(e,t,n)}subscribeMap(e,t){const n=new Map;for(const f of e){const{url:h,filter:p}=f;n.has(h)||n.set(h,[]),n.get(h).push(p)}const r=Array.from(n.entries()).map(([f,h])=>({url:f,filters:h}));this.trackRelays&&(t.receivedEvent=(f,h)=>{let p=this.seenOn.get(h);p||(p=new Set,this.seenOn.set(h,p)),p.add(f)});const o=new Set,s=[],a=[];let i=f=>{a[f]||(a[f]=!0,a.filter(h=>h).length===r.length&&(t.oneose?.(),i=()=>{}))};const c=[];let l=(f,h)=>{c[f]||(i(f),c[f]=h,c.filter(p=>p).length===r.length&&(t.onclose?.(c),l=()=>{}))};const d=f=>{if(t.alreadyHaveEvent?.(f))return!0;const h=o.has(f);return o.add(f),h},u=Promise.all(r.map(async({url:f,filters:h},p)=>{if(this.allowConnectingToRelay?.(f,["read",h])===!1){l(p,"connection skipped by allowConnectingToRelay");return}let m;try{m=await this.ensureRelay(f,{connectionTimeout:this.maxWaitForConnection<(t.maxWait||0)?Math.max(t.maxWait*.8,t.maxWait-1e3):this.maxWaitForConnection,abort:t.abort})}catch(b){this.onRelayConnectionFailure?.(f),l(p,b?.message||String(b));return}this.onRelayConnectionSuccess?.(f);let g=m.subscribe(h,{...t,oneose:()=>i(p),onclose:b=>{b.startsWith("auth-required: ")&&t.onauth?m.auth(t.onauth).then(()=>{m.subscribe(h,{...t,oneose:()=>i(p),onclose:k=>{l(p,k)},alreadyHaveEvent:d,eoseTimeout:t.maxWait,abort:t.abort})}).catch(k=>{l(p,`auth was required and attempted, but failed with: ${k}`)}):l(p,b)},alreadyHaveEvent:d,eoseTimeout:t.maxWait,abort:t.abort});s.push(g)}));return{async close(f){await u,s.forEach(h=>{h.close(f)})}}}subscribeEose(e,t,n){let r;return r=this.subscribe(e,t,{...n,oneose(){const o="closed automatically on eose";r?r.close(o):n.onclose?.(e.map(s=>o))}}),r}subscribeManyEose(e,t,n){return this.subscribeEose(e,t,n)}async querySync(e,t,n){return new Promise(async r=>{const o=[];this.subscribeEose(e,t,{...n,onevent(s){o.push(s)},onclose(s){r(o)}})})}async get(e,t,n){t.limit=1;const r=await this.querySync(e,t,n);return r.sort((o,s)=>s.created_at-o.created_at),r[0]||null}publish(e,t,n){return e.map(vn).map(async(r,o,s)=>{if(s.indexOf(r)!==o)return Promise.reject("duplicate url");if(this.allowConnectingToRelay?.(r,["write",t])===!1)return Promise.reject("connection skipped by allowConnectingToRelay");let a;try{a=await this.ensureRelay(r,{connectionTimeout:this.maxWaitForConnection<(n?.maxWait||0)?Math.max(n.maxWait*.8,n.maxWait-1e3):this.maxWaitForConnection,abort:n?.abort})}catch(i){return this.onRelayConnectionFailure?.(r),"connection failure: "+String(i)}return a.publish(t).catch(async i=>{if(i instanceof Error&&i.message.startsWith("auth-required: ")&&n?.onauth)return await a.auth(n.onauth),a.publish(t);throw i}).then(i=>{if(this.trackRelays){let c=this.seenOn.get(t.id);c||(c=new Set,this.seenOn.set(t.id,c)),c.add(a)}return i})})}listConnectionStatus(){const e=new Map;return this.relays.forEach((t,n)=>e.set(n,t.connected)),e}destroy(){this.relays.forEach(e=>e.close()),this.relays=new Map}pruneIdleRelays(e=1e4){const t=[];for(const[n,r]of this.relays)r.idleSince&&Date.now()-r.idleSince>=e&&(this.relays.delete(n),t.push(n),r.close());return t}},xd;try{xd=WebSocket}catch{}var gb=class extends yb{constructor(e){super({verifyEvent:ab,websocketImplementation:xd,maxWaitForConnection:3e3,...e})}};let _e=null,on=!1,uo=0,At=[],Ct=[];function Br(){const e=new Set([...At,...Ct]);return Array.from(e)}let Sd=Promise.resolve();function ki(e,t){const n=ke(e),r=t?ke(t):[...n];_e&&n.length===At.length&&n.every(s=>At.includes(s))&&r.length===Ct.length&&r.every(s=>Ct.includes(s))||(_e&&(_e.close(Br()),_e=null,on=!1,uo=0,At=[],Ct=[]),At=n,Ct=r,Br().length===0)||(_e=new gb,on=!1,Sd=bb())}function fo(){return Sd}async function bb(){if(!_e)return;const e=_e,t=Br();if(t.length===0)return;let n=0;for(const r of t)try{await e.ensureRelay(r,{connectionTimeout:5e3}),n++}catch(o){console.warn(`[canary:relay] Failed to connect to ${r}:`,o)}_e===e&&(on=n>0,uo=n,on?console.info(`[canary:relay] Connected to ${n}/${t.length} relay(s)`):console.error("[canary:relay] Could not connect to any relay:",t))}function Id(){_e&&_e.close(Br()),_e=null,on=!1,uo=0,At=[],Ct=[]}function de(){return _e}function jt(){return on}function Ut(){return uo}function Rd(){return[...At]}function Ad(){return[...Ct]}const Cd=Object.freeze(Object.defineProperty({__proto__:null,connectRelays:ki,disconnectRelays:Id,getPool:de,getReadRelayUrls:Rd,getRelayCount:Ut,getWriteRelayUrls:Ad,isConnected:jt,waitForConnection:fo},Symbol.toStringTag,{value:"Module"})),Aa=new Set(["member-join","member-leave","counter-advance","reseed","state-snapshot","duress-alert","duress-clear"]),Ca=29111,Ta=39111,Ho=29112,Fo=29113,rr=/^[0-9a-f]{64}$/,La=/^[0-9a-f]{128}$/,or=new TextEncoder,vb=3,wb=6e4;class Eb{constructor(t){this.capacity=t}items=[];has(t){return this.items.includes(t)}add(t){this.has(t)||(this.items.length>=this.capacity&&this.items.shift(),this.items.push(t))}}class Pr{constructor(t,n,r,o){this.personalPubkey=r,this.personalPrivkey=o,this.readRelays=ke(t),this.writeRelays=ke(n)}subs=new Map;groupKeys=new Map;tagHashToGroupId=new Map;seenEventIds=new Eb(1e3);decryptFailures=new Map;recoveryPending=new Map;recoverySub=null;readRelays;writeRelays;updateRelays(t,n){this.readRelays=ke(t),this.writeRelays=n?ke(n):[...this.readRelays]}get allRelays(){return ke([...this.readRelays,...this.writeRelays])}registerGroup(t,n,r,o,s){const a=Ag(t);console.info("[canary:sync] registerGroup",t.slice(0,8),"→ tagHash",a.slice(0,12),"members:",o.length),this.groupKeys.set(t,{key:xg(n),signer:r,tagHash:a,members:new Set(o),admins:new Set(s?.admins??[]),onRecoveryRequest:s?.onRecoveryRequest,onRecoveryResponse:s?.onRecoveryResponse}),this.tagHashToGroupId.set(a,t)}unregisterGroup(t){const n=this.groupKeys.get(t);n&&this.tagHashToGroupId.delete(n.tagHash),this.groupKeys.delete(t),this.decryptFailures.delete(t),this.recoveryPending.delete(t)}async send(t,n,r){jt()||ki(this.readRelays,this.writeRelays);const o=de();if(!o)return;const s=this.groupKeys.get(t);if(!s){console.warn("[canary:sync] No group key registered for",t);return}const a=_a(n),i={...n,protocolVersion:Ce},c=nr(i),l=ge(or.encode(c)),d=Ke(Q.sign(l,G(this.personalPrivkey))),u=JSON.stringify({s:this.personalPubkey,sig:d,p:a}),f=await Sg(s.key,u),h=Aa.has(n.type),p=h?Ta:Ca,g=[["d",h?`${s.tagHash}:${n.type}`:s.tagHash]];h&&g.push(["expiration",String(Math.floor(Date.now()/1e3)+10080*60)]);const b={kind:p,content:f,tags:g,created_at:Math.floor(Date.now()/1e3)};try{const k=await s.signer.sign(b);typeof k.id=="string"&&this.seenEventIds.add(k.id),console.info("[canary:sync] Publishing",n.type,"to",t.slice(0,8),"→ d-tag:",s.tagHash.slice(0,12),"(write relays only)"),await o.publish(this.writeRelays,k),console.info("[canary:sync] Published OK")}catch(k){console.error("[canary:sync] Publish failed:",k)}}subscribe(t,n){const r=de();if(!r)return()=>{};const o=this.groupKeys.get(t);if(!o)return console.warn("[canary:sync] No group key registered for",t),()=>{};this._ensureRecoverySub();const s=Array.from(Aa).map(c=>`${o.tagHash}:${c}`),a={kinds:[Ta,Ca],"#d":[o.tagHash,...s],since:Math.floor(Date.now()/1e3)-10080*60};console.info("[canary:sync] Subscribing to",t.slice(0,8),"→ filter:",JSON.stringify(a));const i=r.subscribeMany(this.allRelays,a,{onevent:async c=>{try{if(!c||typeof c!="object"||typeof c.pubkey!="string"||typeof c.content!="string")return;console.info("[canary:sync] Received event",c.id?.slice(0,12),"kind:",c.kind,"from pubkey:",c.pubkey?.slice(0,12));const l=this.groupKeys.get(t);if(!l)return;if(!Ia(c)){console.warn("[canary:sync] Rejected event with invalid signature");return}if(typeof c.id=="string"&&this.seenEventIds.has(c.id))return;let d;try{d=await Ig(l.key,c.content)}catch{this._trackDecryptFailure(t);return}this.decryptFailures.delete(t);const u=JSON.parse(d);if(!u||typeof u!="object"){console.warn("[canary:sync] Rejected malformed envelope");return}const f=u.s,h=u.sig,p=u.p;if(typeof f!="string"||typeof h!="string"||typeof p!="string"){console.warn("[canary:sync] Rejected envelope with missing sender proof fields");return}if(!rr.test(f)||!La.test(h)){console.warn("[canary:sync] Rejected envelope with invalid sender proof encoding");return}const m=xa(p),g={...m,protocolVersion:Ce},b=nr(g),k=ge(or.encode(b));if(!Q.verify(G(h),k,G(f))){console.warn("[canary:sync] Rejected envelope with invalid sender proof");return}if(m.type!=="member-join"&&!l.members.has(f)){console.warn("[canary:sync] Rejected message from non-member pubkey");return}if(m.type==="liveness-checkin"&&m.pubkey!==f){console.warn("[canary:sync] Rejected liveness-checkin with mismatched sender");return}console.info("[canary:sync] Dispatching",m.type,"from sender",f.slice(0,8)),n(m,f),typeof c.id=="string"&&this.seenEventIds.add(c.id)}catch(l){console.warn("[canary:sync] Failed to process event:",l)}}});return this.subs.set(t,i),()=>{i.close(),this.subs.delete(t)}}async requestRecovery(t,n,r){const o=de();if(!o)return;const s=this.groupKeys.get(t);if(!s)return;this.recoveryPending.set(t,Date.now());const a=G(this.personalPrivkey);for(const i of s.admins)if(i!==this.personalPubkey)try{const c=JSON.stringify({groupTag:s.tagHash,epoch:n,counter:r}),l=be(a,i),d=Bt(c,l),u={kind:Ho,content:d,tags:[["p",i]],created_at:Math.floor(Date.now()/1e3)},f=nt(u,a);await o.publish(this.writeRelays,f)}catch(c){console.warn("[canary:sync] Recovery request to",i.slice(0,8),"failed:",c)}}_ensureRecoverySub(){if(this.recoverySub)return;const t=de();if(!t)return;const n={kinds:[Ho,Fo],"#p":[this.personalPubkey],since:Math.floor(Date.now()/1e3)-300};this.recoverySub=t.subscribeMany(this.allRelays,n,{onevent:async r=>{try{if(!r||typeof r!="object"||!Ia(r))return;r.kind===Ho?await this._handleRecoveryRequest(r):r.kind===Fo&&await this._handleRecoveryResponse(r)}catch(o){console.warn("[canary:sync] Recovery event processing failed:",o)}}})}async _handleRecoveryRequest(t){const n=de();if(!n)return;const r=t.pubkey;if(!rr.test(r))return;const o=G(this.personalPrivkey),s=be(o,r),a=Pt(t.content,s),i=JSON.parse(a),c=i.groupTag,l=i.epoch,d=i.counter;if(typeof c!="string"||typeof l!="number"||typeof d!="number")return;const u=this.tagHashToGroupId.get(c);if(!u)return;const f=this.groupKeys.get(u);if(!f)return;if(!f.members.has(r)){console.warn("[canary:sync] Recovery request from non-member",r.slice(0,8));return}if(!f.onRecoveryRequest)return;const h=f.onRecoveryRequest(r,l,d);if(!h)return;const p=_a(h),m={...h,protocolVersion:Ce},g=nr(m),b=ge(or.encode(g)),k=Ke(Q.sign(b,o)),T=JSON.stringify({s:this.personalPubkey,sig:k,groupTag:c,p}),$=be(o,r),O=Bt(T,$),N={kind:Fo,content:O,tags:[["p",r]],created_at:Math.floor(Date.now()/1e3)},w=nt(N,o);await n.publish(this.writeRelays,w),console.info("[canary:sync] Sent recovery response to",r.slice(0,8))}async _handleRecoveryResponse(t){const n=t.pubkey;if(!rr.test(n))return;const r=G(this.personalPrivkey),o=be(r,n),s=Pt(t.content,o),a=JSON.parse(s),i=a.s,c=a.sig,l=a.groupTag,d=a.p;if(typeof i!="string"||typeof c!="string"||typeof l!="string"||typeof d!="string"||!rr.test(i)||!La.test(c)||i!==n)return;const u=this.tagHashToGroupId.get(l);if(!u)return;const f=this.groupKeys.get(u);if(!f)return;if(!f.admins.has(n)){console.warn("[canary:sync] Recovery response from non-admin",n.slice(0,8));return}const h=xa(d),p={...h,protocolVersion:Ce},m=nr(p),g=ge(or.encode(m));if(!Q.verify(G(c),g,G(n))){console.warn("[canary:sync] Recovery response with invalid signature");return}if(h.type!=="state-snapshot"){console.warn("[canary:sync] Recovery response contains non-snapshot type:",h.type);return}if(!h.admins.includes(n)){console.warn("[canary:sync] Recovery response sender not in snapshot admins");return}this.decryptFailures.delete(u),this.recoveryPending.delete(u),f.onRecoveryResponse&&f.onRecoveryResponse(h,n),console.info("[canary:sync] Applied recovery response from",n.slice(0,8))}_trackDecryptFailure(t){const n=(this.decryptFailures.get(t)??0)+1;if(this.decryptFailures.set(t,n),n<vb)return;const r=this.recoveryPending.get(t);if(r!==void 0&&Date.now()-r<wb)return;this.recoveryPending.delete(t);const o=this.groupKeys.get(t);o&&o.admins.size>0&&o.onRecoveryResponse&&(console.warn(`[canary:sync] ${n} decrypt failures for group — requesting recovery`),this.requestRecovery(t,0,0).catch(s=>{console.warn("[canary:sync] Auto-recovery request failed:",s)}))}disconnect(){for(const[,t]of this.subs)t.close();this.subs.clear(),this.recoverySub&&(this.recoverySub.close(),this.recoverySub=null)}}function H(e,t="info",n=4e3){const r=document.getElementById("toast-container")??kb(),o=document.createElement("div");o.className=`toast toast--${t}`,o.textContent=e,r.appendChild(o),requestAnimationFrame(()=>o.classList.add("toast--visible")),setTimeout(()=>{o.classList.remove("toast--visible"),setTimeout(()=>o.remove(),300)},n)}function kb(){const e=document.createElement("div");return e.id="toast-container",e.className="toast-container",document.body.appendChild(e),e}const _b=Object.freeze(Object.defineProperty({__proto__:null,showToast:H},Symbol.toStringTag,{value:"Module"}));let Rn=null;function xb(e=6e4){Rn||(Na(),Rn=setInterval(Na,e))}function Td(){Rn&&(clearInterval(Rn),Rn=null)}function Na(){const{groups:e,identity:t}=_();if(!t)return;const n=Math.floor(Date.now()/1e3);for(const[r,o]of Object.entries(e)){ve(r,{type:"liveness-checkin",pubkey:t.pubkey,timestamp:n,opId:crypto.randomUUID()});const s={...o.livenessCheckins,[t.pubkey]:n};J(r,{livenessCheckins:s})}}const Sb=60;function Ld(e,t,n){const r=_().groups[e];if(!r)return;const o=Math.floor(Date.now()/1e3);if(n>o+Sb)return;const s=r.livenessCheckins[t]??0;if(n<=s)return;const a={...r.livenessCheckins,[t]:n};J(e,{livenessCheckins:a})}const Ib=Object.freeze(Object.defineProperty({__proto__:null,recordCheckin:Ld,startLivenessHeartbeat:xb,stopLivenessHeartbeat:Td},Symbol.toStringTag,{value:"Module"}));let fe=null;const Ur=new Map,Rb=500,bs=new Map;function $a(e,t){const n=bs.get(e);return n?n.includes(t):!1}function Ma(e,t){let n=bs.get(e);n||(n=[],bs.set(e,n)),n.length>=Rb&&n.shift(),n.push(t)}function Ab(e){fe=e}async function Ne(e,t,n){const{identity:r}=_(),o=t??e;if(!(!r||!r.privkey||e.length===0&&o.length===0))try{ki(e,o),fe?fe instanceof Pr&&fe.updateRelays(e,o):Ab(new Pr(e,o,r.pubkey,r.privkey)),n&&$d(n),n&&ng(n).then(s=>{for(const a of s)ve(n,a)}),fo().then(()=>Ln(jt(),Ut()))}catch(s){console.warn("[canary:sync] ensureTransport failed:",s),Ln(!1,0)}}function ve(e,t){!fe||!_().groups[e]||fe.send(e,t).catch(r=>{console.warn("[canary:sync] broadcast failed:",r)})}function ln(e){if(!(fe instanceof Pr))return;const{identity:t,groups:n}=_(),r=n[e];if(!t?.privkey||!r?.seed)return;fe.unregisterGroup(e);const o=new wd(r.seed,t.privkey);fe.registerGroup(e,r.seed,o,r.members,Nd(e))}function Nd(e){return{admins:_().groups[e]?.admins??[],onRecoveryRequest:(t,n,r)=>{const{groups:o}=_(),s=o[e];return!s||!s.members.includes(t)?null:{type:"state-snapshot",seed:s.seed,counter:s.counter,usageOffset:s.usageOffset,members:s.members,admins:s.admins,epoch:s.epoch,opId:`recovery-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,timestamp:Math.floor(Date.now()/1e3)}},onRecoveryResponse:(t,n)=>{const{groups:r}=_(),o=r[e];if(!o)return;const s=hd(o,t,void 0,n);s!==o&&(J(e,s),ln(e),H("Group state recovered from admin","success"))}}}function Cb(e,t,n,r=Math.floor(Date.now()/1e3),o=Tb){if(t.type==="liveness-checkin"){if(!n)return;const s=r-t.timestamp;s<=gs&&s>=-60&&($a(e,t.opId)||(Ma(e,t.opId),Ld(e,n,t.timestamp)));return}if(t.type==="beacon"||t.type==="duress-alert"||t.type==="duress-clear"){const s=r-t.timestamp;if(s>gs||s<-60||$a(e,t.opId))return;Ma(e,t.opId),o(e,t,n)}}function Tb(e,t,n){document.dispatchEvent(new CustomEvent("canary:sync-message",{detail:{groupId:e,message:t,sender:n}}))}function $d(e){if(!fe)return;if(Ur.get(e)?.(),fe instanceof Pr){const{identity:n,groups:r}=_(),o=r[e];if(n?.privkey&&o?.seed){const s=new wd(o.seed,n.privkey);fe.registerGroup(e,o.seed,s,o.members,Nd(e))}}const t=fe.subscribe(e,(n,r)=>{const{groups:o}=_(),s=o[e];if(!s)return;const a=hd(s,n,void 0,r);if(a!==s&&J(e,a),(n.type==="member-join"||n.type==="member-leave"||n.type==="reseed"||n.type==="state-snapshot")&&ln(e),n.type==="member-join"&&a!==s){const i=n.pubkey?a.memberNames?.[n.pubkey]??r?.slice(0,8)??"Someone":"Someone";document.dispatchEvent(new CustomEvent("canary:member-joined",{detail:{groupId:e,pubkey:n.pubkey,name:i}}))}if(n.type==="member-join"&&a!==s){const i=n.pubkey?a.memberNames?.[n.pubkey]??r?.slice(0,8)??"Someone":"Someone";H(`${i} joined the group`,"success")}else n.type==="reseed"?H("Group secret was rotated","warning"):n.type==="state-snapshot"&&H("Group state recovered","success");Cb(e,n,r),Pb(),setTimeout(()=>Ln(jt(),Ut()),1500)});Ur.set(e,t)}function Lb(){const{groups:e}=_();for(const t of Object.keys(e))$d(t)}function sn(){Td();for(const e of Ur.values())e();Ur.clear(),fe?.disconnect(),fe=null}var sr=new TextDecoder("utf-8");new TextEncoder;var Md=5e3;function Od(e){let{prefix:t,words:n}=Ge.decode(e,Md),r=new Uint8Array(Ge.fromWords(n));switch(t){case"nprofile":{let o=Go(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for nprofile");if(o[0][0].length!==32)throw new Error("TLV 0 should be 32 bytes");return{type:"nprofile",data:{pubkey:q(o[0][0]),relays:o[1]?o[1].map(s=>sr.decode(s)):[]}}}case"nevent":{let o=Go(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for nevent");if(o[0][0].length!==32)throw new Error("TLV 0 should be 32 bytes");if(o[2]&&o[2][0].length!==32)throw new Error("TLV 2 should be 32 bytes");if(o[3]&&o[3][0].length!==4)throw new Error("TLV 3 should be 4 bytes");return{type:"nevent",data:{id:q(o[0][0]),relays:o[1]?o[1].map(s=>sr.decode(s)):[],author:o[2]?.[0]?q(o[2][0]):void 0,kind:o[3]?.[0]?parseInt(q(o[3][0]),16):void 0}}}case"naddr":{let o=Go(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for naddr");if(!o[2]?.[0])throw new Error("missing TLV 2 for naddr");if(o[2][0].length!==32)throw new Error("TLV 2 should be 32 bytes");if(!o[3]?.[0])throw new Error("missing TLV 3 for naddr");if(o[3][0].length!==4)throw new Error("TLV 3 should be 4 bytes");return{type:"naddr",data:{identifier:sr.decode(o[0][0]),pubkey:q(o[2][0]),kind:parseInt(q(o[3][0]),16),relays:o[1]?o[1].map(s=>sr.decode(s)):[]}}}case"nsec":return{type:t,data:r};case"npub":case"note":return{type:t,data:q(r)};default:throw new Error(`unknown prefix ${t}`)}}function Go(e){let t={},n=e;for(;n.length>0;){let r=n[0],o=n[1],s=n.slice(2,2+o);if(n=n.slice(2+o),s.length<o)throw new Error(`not enough data to read on TLV ${r}`);t[r]=t[r]||[],t[r].push(s)}return t}function Nb(e){return Mb("nsec",e)}function $b(e,t){let n=Ge.toWords(t);return Ge.encode(e,n,Md)}function Mb(e,t){return $b(e,t)}function Bd(){return document.documentElement.getAttribute("data-theme")==="light"?"light":"dark"}function Ob(e){e==="light"?document.documentElement.setAttribute("data-theme","light"):document.documentElement.removeAttribute("data-theme")}function Pd(e){const t=Bd();e.setAttribute("aria-label",t==="dark"?"Switch to light mode":"Switch to dark mode"),e.textContent="◐"}function Bb(e){const t=Bd()==="dark"?"light":"dark";Ob(t),ee({settings:{..._().settings,theme:t}}),Pd(e)}function _i(e){const t=_().view;e.innerHTML=`
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
  `;const n=e.querySelector("#theme-toggle");n&&(Pd(n),n.addEventListener("click",()=>Bb(n)));const r=e.querySelector("#reset-btn");r&&r.addEventListener("click",()=>{confirm("Clear all data and reset the demo?")&&(localStorage.clear(),window.location.reload())}),xi();const o=e.querySelector("#identity-btn");o?.addEventListener("click",()=>jb(o)),jt()&&Ln(!0,Ut()),document.addEventListener("canary:vault-synced",()=>{const a=document.getElementById("vault-sync-status");a&&(a.hidden=!1,a.textContent="☁",setTimeout(()=>{a.hidden=!0},3e3))}),e.querySelector("#header-nav")?.addEventListener("click",a=>{const i=a.target.closest("[data-view]");if(!i)return;const c=i.dataset.view;if(c){if(c==="groups"&&window.innerWidth<=768){const l=document.getElementById("sidebar"),d=document.getElementById("sidebar-overlay");if(l&&d){const u=l.classList.contains("sidebar--open");l.classList.toggle("sidebar--open",!u),d.classList.toggle("sidebar-overlay--visible",!u)}}c!==_().view&&ee({view:c})}})}function Ln(e,t){const n=document.getElementById("relay-status");if(!n)return;const r=n.querySelector(".relay-dot"),o=n.querySelector(".relay-label");!e||t===0?(n.removeAttribute("hidden"),r?.setAttribute("class","relay-dot relay-dot--offline"),o&&(o.textContent="Offline"),n.title="Not connected to any relay"):(n.removeAttribute("hidden"),r?.setAttribute("class","relay-dot relay-dot--synced"),o&&(o.textContent=`Synced · ${t} relay${t===1?"":"s"}`),n.title=`Connected to ${t} relay${t===1?"":"s"}`)}function Pb(){const e=document.getElementById("relay-status");if(!e)return;const t=e.querySelector(".relay-dot"),n=e.querySelector(".relay-label");e.removeAttribute("hidden"),t?.setAttribute("class","relay-dot relay-dot--syncing"),n&&(n.textContent="Syncing...")}function xi(){const e=document.getElementById("identity-dot"),t=document.getElementById("identity-label"),n=document.getElementById("identity-avatar");if(!e||!t)return;const{identity:r}=_();if(!r?.pubkey){t.textContent="No identity",e.className="header__identity-dot header__identity-dot--none",n&&(n.hidden=!0);return}const o=`${r.pubkey.slice(0,6)}…${r.pubkey.slice(-4)}`,s=r.displayName&&r.displayName!=="You"?r.displayName:o;t.textContent=s,n&&r.picture?(n.src=r.picture,n.hidden=!1,e.hidden=!0):(n&&(n.hidden=!0),e.hidden=!1,e.className=r.signerType==="nip07"?"header__identity-dot header__identity-dot--extension":"header__identity-dot header__identity-dot--local")}function Ub(e){return Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}function Ud(e,t){return t?.pubkey===e.pubkey&&t.mnemonic?{...e,mnemonic:t.mnemonic}:e}function Db(e,t){try{const n=_().identity,r=Od(e.trim());if(r.type!=="nsec")return alert('Not a valid nsec. Expected a bech32-encoded private key starting with "nsec1".'),!1;const o=r.data,s=Ub(o),a=co(o),i=Ud({pubkey:a,privkey:s,signerType:"local",displayName:t??"You"},n);return sn(),ee({identity:i,groups:{},activeGroupId:null}),xi(),document.dispatchEvent(new CustomEvent("canary:resync")),!0}catch{return alert("Invalid nsec format."),!1}}function jb(e){document.getElementById("identity-popover")?.remove();const{identity:t}=_(),n=t?.pubkey??"",r=n?`${n.slice(0,8)}…${n.slice(-8)}`:"None",o=t?.signerType==="nip07"?"Extension (NIP-07)":"Local key",s=document.createElement("div");s.id="identity-popover",s.className="identity-popover",s.innerHTML=`
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
  `,e.parentElement?.appendChild(s),s.querySelector("#identity-logout-btn")?.addEventListener("click",()=>{sn(),ee({identity:null,groups:{},activeGroupId:null}),s.remove(),window.location.reload()}),s.querySelector("#recovery-reveal-btn")?.addEventListener("click",()=>{const i=s.querySelector("#recovery-reveal-area");if(!i)return;const c=_().identity?.mnemonic;if(!c){i.textContent="";const f=document.createElement("p");f.style.cssText="font-size:0.75rem;color:var(--text-muted);",f.textContent="No recovery phrase stored (key was imported via nsec).",i.appendChild(f);return}const l=c.split(" ");i.textContent="";const d=document.createElement("div");d.style.cssText="display:grid;grid-template-columns:repeat(3,1fr);gap:0.375rem;margin:0.375rem 0;",l.forEach((f,h)=>{const p=document.createElement("div");p.style.cssText="border:1px solid var(--border);border-radius:3px;padding:0.25rem;text-align:center;font-family:var(--font-mono,monospace);font-size:0.7rem;";const m=document.createElement("span");m.style.color="var(--text-muted)",m.textContent=`${h+1}. `;const g=document.createElement("span");g.textContent=f,p.append(m,g),d.appendChild(p)}),i.appendChild(d);const u=document.createElement("button");u.className="btn btn--sm",u.type="button",u.style.cssText="width:100%;margin-top:0.375rem;",u.textContent="Copy words",u.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(c),u.textContent="Copied!",setTimeout(()=>{u.textContent="Copy words"},2e3)}catch{}}),i.appendChild(u)}),s.querySelector("#nsec-reveal-btn")?.addEventListener("click",()=>{const i=s.querySelector("#nsec-reveal-area");if(!i||!t?.privkey)return;const c=Nb(G(t.privkey));i.innerHTML=`
      <code style="font-size: 0.65rem; word-break: break-all; display: block; background: var(--bg); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border); user-select: all;">${c}</code>
      <button class="btn btn--sm" id="nsec-copy-btn" type="button" style="width: 100%; margin-top: 0.375rem;">Copy nsec</button>
    `,i.querySelector("#nsec-copy-btn")?.addEventListener("click",async l=>{const d=l.currentTarget;try{await navigator.clipboard.writeText(c),d.textContent="Copied!",setTimeout(()=>{d.textContent="Copy nsec"},2e3)}catch{}})}),s.querySelector("#nsec-login-form")?.addEventListener("submit",i=>{i.preventDefault();const c=s.querySelector("#nsec-input");c?.value.trim()&&Db(c.value)&&s.remove()}),s.querySelector("#nip07-connect-btn")?.addEventListener("click",async()=>{if(!Ed()){alert("No Nostr extension found. Install Alby, nos2x, or another NIP-07 extension and reload.");return}try{sn();const i=await window.nostr.getPublicKey(),c=Ud({pubkey:i,signerType:"nip07",displayName:t?.displayName??"You"},t);ee({identity:c,groups:{},activeGroupId:null}),xi(),document.dispatchEvent(new CustomEvent("canary:resync")),s.remove()}catch{alert("Extension rejected the request.")}});const a=i=>{!s.contains(i.target)&&i.target!==e&&(s.remove(),document.removeEventListener("click",a))};requestAnimationFrame(()=>document.addEventListener("click",a))}function j(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Oa(e){const t=Math.floor(e/86400);if(t>=1)return`${t}d`;const n=Math.floor(e/3600);return n>=1?`${n}h`:`${Math.floor(e/60)}m`}function qb(e){if(!e)return"";const t=e.displayName??`${e.pubkey.slice(0,8)}…`;return`
    <div class="identity-badge">
      <span class="identity-badge__name">${j(t)}</span>
    </div>
  `}function Hb(e,t){const n=Object.values(e);return n.length===0?'<div class="group-list__empty">No groups yet</div>':n.map(r=>{const o=r.id===t,s=o?" group-list__item--active":"",a=Oa(r.livenessInterval),i=Oa(r.livenessInterval);return`
        <button
          class="group-list__item${s}"
          data-group-id="${j(r.id)}"
          aria-current="${o?"true":"false"}"
        >
          <span class="group-list__name">${j(r.name)}</span>
          <span class="group-list__preset">${j(a)} · ${j(i)}</span>
        </button>
      `}).join("")}function Fb(e){const{identity:t,groups:n,activeGroupId:r}=_();e.innerHTML=`
    <div class="sidebar__tagline">spoken-word verification</div>
    ${qb(t)}
    <nav class="group-list" aria-label="Groups">
      ${Hb(n,r)}
    </nav>
    <button class="btn btn--primary" id="create-group-btn">+ New Group</button>
  `,e.querySelector(".group-list")?.addEventListener("click",a=>{const i=a.target.closest("[data-group-id]");if(!i)return;const c=i.dataset.groupId;c&&ee({activeGroupId:c})}),e.querySelector("#create-group-btn")?.addEventListener("click",()=>{e.dispatchEvent(new CustomEvent("canary:create-group",{bubbles:!0}))})}const vs="app-modal";function Si(e,t){let n=document.getElementById(vs);if(n||(n=document.createElement("dialog"),n.id=vs,n.className="modal",document.body.appendChild(n)),n.innerHTML=`
    <form class="modal__form" method="dialog" id="modal-form">
      ${e}
    </form>
  `,t){const r=n.querySelector("#modal-form");r?.addEventListener("submit",o=>{o.preventDefault();const s=new FormData(r);t(s),Ba()})}n.addEventListener("click",r=>{r.target===n&&Ba()}),n.showModal()}function Ba(){document.getElementById(vs)?.close()}const Gb=/^[0-9a-f]{64}$/,Kb=new TextEncoder().encode("canary:beacon:key");function Ii(e){return gt(G(e),Kb)}async function Dd(e,t){const n=crypto.getRandomValues(new Uint8Array(12)),r=await crypto.subtle.importKey("raw",e,{name:"AES-GCM"},!1,["encrypt"]),o=new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM",iv:n},r,t)),s=new Uint8Array(12+o.length);return s.set(n),s.set(o,12),dd(s)}async function jd(e,t,n){const r={geohash:t,precision:n,timestamp:Math.floor(Date.now()/1e3)};return Dd(e,new TextEncoder().encode(JSON.stringify(r)))}function Vb(e,t){if(!Gb.test(e))throw new Error(`Invalid member pubkey: expected 64 lowercase hex characters, got "${e.length>80?e.slice(0,20)+"…":e}"`);return{type:"duress",member:e,geohash:"",precision:0,locationSource:"none",timestamp:Math.floor(Date.now()/1e3)}}async function Wb(e,t){return Dd(e,new TextEncoder().encode(JSON.stringify(t)))}function qd(){const{identity:e}=_();if(!e?.pubkey)throw new Error("No local identity — cannot perform privileged action.");return e.pubkey}function ho(e){const t=qd();if(!e.admins.includes(t))throw new Error(`Not authorised — you are not an admin of "${e.name}".`)}function zb(e){const t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function Jb(e,t,n){const r=crypto.randomUUID(),s=Ug({name:e,members:n?[n]:[],preset:t,creator:n}),a=_().settings,i=[...a.defaultReadRelays??a.defaultRelays],c=[...a.defaultWriteRelays??a.defaultRelays],l={family:"words","field-ops":"words",enterprise:"words",event:"pin"},d={...s,id:r,nostrEnabled:c.length>0||i.length>0,relays:c,readRelays:i,writeRelays:c,encodingFormat:l[t]??"words",usedInvites:[],latestInviteIssuedAt:0,livenessInterval:s.rotationInterval,livenessCheckins:{},tolerance:1,memberNames:{},duressMode:"immediate"},{groups:u}=_();return ee({groups:{...u,[r]:d},activeGroupId:r}),n&&ve(r,{type:"member-join",pubkey:n,timestamp:Math.floor(Date.now()/1e3),epoch:0,opId:crypto.randomUUID()}),r}function Yb(e){const{groups:t,activeGroupId:n}=_(),r={...t};delete r[e],ee({groups:r,activeGroupId:n===e?null:n})}function Zb(e){const{groups:t}=_(),n=t[e];if(!n){console.warn(`[canary:actions] reseedGroup: unknown group id "${e}"`);return}ho(n);const r=Ei(n),o=(n.epoch??0)+1,s=crypto.randomUUID(),a=[...n.admins??[]];ve(e,{type:"reseed",seed:zb(r.seed),counter:r.counter,timestamp:Math.floor(Date.now()/1e3),epoch:o,opId:s,admins:a,members:[...n.members]}),J(e,{...r,epoch:o,consumedOps:[s],admins:a}),ln(e)}function Xb(e){const{groups:t}=_(),n=t[e];if(!n){console.warn(`[canary:actions] compromiseReseed: unknown group id "${e}"`);return}ho(n);const r=Ei(n),o=(n.epoch??0)+1;J(e,{...r,epoch:o,consumedOps:[],admins:[...n.admins??[]]}),ln(e)}function ws(e,t,n){const{groups:r}=_(),o=r[e];if(!o){console.warn(`[canary:actions] addGroupMember: unknown group id "${e}"`);return}ho(o);const s=crypto.randomUUID(),a=ud(o,t);J(e,{...a,consumedOps:[...o.consumedOps??[],s]}),ln(e),ve(e,{type:"member-join",pubkey:t,displayName:n||void 0,timestamp:Math.floor(Date.now()/1e3),epoch:o.epoch??0,opId:s})}function Qb(e,t){const{groups:n}=_(),r=n[e];if(!r){console.warn(`[canary:actions] removeGroupMember: unknown group id "${e}"`);return}const o=qd();if(t!==o&&ho(r),!r.members.includes(t))return;const s=fd(r,t),a=Ei(s),i=(r.epoch??0)+1,c={...r.memberNames??{}};delete c[t];const l={...r.livenessCheckins??{}};delete l[t];const d=(r.admins??[]).filter(u=>u!==t);J(e,{...a,memberNames:c,livenessCheckins:l,admins:d,epoch:i,consumedOps:[]}),ln(e)}function ev(e){const{groups:t}=_(),n=t[e];if(!n){console.warn(`[canary:actions] burnWord: unknown group id "${e}"`);return}const r=Dg(n);J(e,r),ve(e,{type:"counter-advance",counter:r.counter,usageOffset:r.usageOffset,timestamp:Math.floor(Date.now()/1e3)})}const Ko=/^[0-9a-f]{64}$/;function tv(e){if(!e||typeof e!="object")throw new Error("Import failed — expected a JSON object.");const t=e;if(typeof t.name!="string"||t.name.trim().length===0)throw new Error("Import failed — name is required.");if(typeof t.seed!="string"||!Ko.test(t.seed))throw new Error("Import failed — seed must be a 64-character lowercase hex string.");if(!Array.isArray(t.members)||t.members.length===0)throw new Error("Import failed — members must be a non-empty array.");for(const n of t.members)if(typeof n!="string"||!Ko.test(n))throw new Error(`Import failed — invalid member pubkey: "${String(n)}".`);if(Array.isArray(t.admins)){for(const r of t.admins)if(typeof r!="string"||!Ko.test(r))throw new Error(`Import failed — invalid admin pubkey: "${String(r)}".`);const n=new Set(t.members);for(const r of t.admins)if(!n.has(r))throw new Error(`Import failed — admin "${r}" is not in the members list.`)}if(t.rotationInterval!==void 0&&(typeof t.rotationInterval!="number"||!Number.isInteger(t.rotationInterval)||t.rotationInterval<=0))throw new Error("Import failed — rotationInterval must be a positive integer.");if(t.wordCount!==void 0&&t.wordCount!==1&&t.wordCount!==2&&t.wordCount!==3)throw new Error("Import failed — wordCount must be 1, 2, or 3.");if(t.encodingFormat!==void 0&&t.encodingFormat!=="words"&&t.encodingFormat!=="pin"&&t.encodingFormat!=="hex")throw new Error("Import failed — encodingFormat must be words, pin, or hex.");if(t.epoch!==void 0&&(typeof t.epoch!="number"||!Number.isInteger(t.epoch)||t.epoch<0))throw new Error("Import failed — epoch must be a non-negative integer.");if(t.consumedOps!==void 0&&(!Array.isArray(t.consumedOps)||!t.consumedOps.every(n=>typeof n=="string")))throw new Error("Import failed — consumedOps must be an array of strings.")}function nv(e){const{groups:t}=_();if(Object.keys(t).length>0){e.hidden=!0;return}e.hidden=!1,e.innerHTML=`
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
  `,document.getElementById("welcome-create").addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("canary:create-group"))}),document.getElementById("welcome-join").addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("canary:join-group"))})}const Tt="canary:group";function Mt(e){switch(e.encodingFormat){case"pin":return{format:"pin",digits:6};case"hex":return{format:"hex",length:8};default:return{format:"words",count:e.wordCount}}}function Es(e,t){return t==="pin"&&e.length===6?`${e.slice(0,3)}-${e.slice(3)}`:t==="hex"&&e.length===8?`${e.slice(0,4)}-${e.slice(4)}`:e}function rv(e,t){const{identity:n}=_();if(n?.pubkey===e)return"You";const r=t.memberNames?.[e];return r||e.slice(0,8)+"…"}let mr=null;function Vo(){mr!==null&&(clearInterval(mr),mr=null)}function ov(e=new Date){return e.toISOString().slice(11,19)+" UTC"}function sv(e){return e.replace(/[a-zA-Z0-9]/g,"•")}function Pa(e){if(e<=0)return"0s";const t=Math.floor(e/86400),n=Math.floor(e%86400/3600),r=Math.floor(e%3600/60),o=Math.floor(e%60);return t>=1?n>0?`${t}d ${n}h`:`${t}d`:n>=1?r>0?`${n}h ${r}m`:`${n}h`:r>=1?o>0?`${r}m ${o}s`:`${r}m`:`${o}s`}function Ua(e){const t=Math.floor(Date.now()/1e3),r=(yt(t,e.rotationInterval)+1)*e.rotationInterval;return Math.max(0,r-t)}const iv=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],av=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function Da(e,t){if(t>=86400){const n=new Date(Date.now()+e*1e3),r=iv[n.getUTCDay()],o=n.getUTCDate(),s=av[n.getUTCMonth()],a=String(n.getUTCHours()).padStart(2,"0"),i=String(n.getUTCMinutes()).padStart(2,"0");return`rotates ${r} ${o} ${s} at ${a}:${i} UTC (${Pa(e)})`}return`rotates in ${Pa(e)} · ${ov()}`}function cv(e){const t=e.counter+e.usageOffset;return Le(e.seed,Tt,t,Mt(e))}function lv(e){const{identity:t}=_();if(!t?.pubkey)return null;const n=e.counter+e.usageOffset;return io(e.seed,Tt,t.pubkey,n,Mt(e),e.tolerance)}function Hd(e){Vo();const{groups:t,activeGroupId:n}=_();if(!n){e.innerHTML="";return}const r=t[n];if(!r){e.innerHTML="";return}const o=jg(r);if(o!==r){J(n,o);return}const s=cv(r),a=Es(s,r.encodingFormat),i=lv(r),c=i?Es(i,r.encodingFormat):null,l=sv(a),d=Ua(r),u=Math.min(100,Math.max(0,(r.rotationInterval-d)/r.rotationInterval*100));e.innerHTML=`
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
        <span class="hero__countdown-label" id="hero-countdown-label">${Da(d,r.rotationInterval)}</span>
      </div>

      <p class="hero__hint">Press and hold to reveal. Tap the right side for your alternate word.</p>

      <button class="btn btn--ghost" id="burn-btn" type="button" title="Rotate to a new word now. All group members will get a new word too.">I used this word</button>
      <button class="btn btn--outline" id="hero-invite-btn" type="button" title="Share group access with someone new">Invite Someone</button>
      ${r.members.length>=2?'<button class="btn btn--outline" id="hero-call-btn" type="button" title="Start a phone call verification">Verify Call</button>':""}

    </section>
  `;const f=e.querySelector("#hero-word"),h=e.querySelector("#hero-reveal-btn");function p(O){f&&(f.textContent=O&&c?c:a,f.classList.remove("hero__word--masked"),f.classList.add("hero__word--revealed"))}function m(){f&&(f.textContent=l,f.classList.remove("hero__word--revealed"),f.classList.add("hero__word--masked"))}h&&(h.addEventListener("pointerdown",O=>{O.preventDefault();const N=h.getBoundingClientRect(),v=O.clientX-N.left>N.width/2;p(v)}),h.addEventListener("pointerup",m),h.addEventListener("pointerleave",m),h.addEventListener("pointercancel",m)),e.querySelector("#burn-btn")?.addEventListener("click",()=>{try{const O=e.querySelector("#hero-word");O&&(O.classList.add("hero__word--rotating"),O.addEventListener("animationend",()=>O.classList.remove("hero__word--rotating"),{once:!0})),ev(n);const N=On(_().groups[n]??r)==="online";H(N?"Word rotated — syncing to group":"Word rotated","success",2e3),document.dispatchEvent(new CustomEvent("canary:vault-publish-now"))}catch(O){H(O instanceof Error?O.message:"Failed to rotate word","error")}}),e.querySelector("#hero-invite-btn")?.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("canary:show-invite",{detail:{groupId:n}}))}),e.querySelector("#hero-call-btn")?.addEventListener("click",()=>{const{identity:O}=_(),N=r.members.filter(y=>y!==O?.pubkey);if(N.length===0)return;if(N.length===1){document.dispatchEvent(new CustomEvent("canary:verify-call",{detail:{groupId:n,pubkey:N[0]}}));return}const w=N.map(y=>`
      <button class="btn btn--outline member-pick-btn" data-pubkey="${j(y)}" type="button" style="width:100%;text-align:left;margin-bottom:0.5rem;">
        ${j(rv(y,r))}
      </button>
    `).join("");let v=document.getElementById("member-picker");v||(v=document.createElement("dialog"),v.id="member-picker",v.className="modal",document.body.appendChild(v)),v.innerHTML=`
      <div class="modal__form" style="min-width:240px;">
        <h2 class="modal__title">Who are you calling?</h2>
        ${w}
        <div class="modal__actions">
          <button class="btn" id="picker-cancel" type="button">Cancel</button>
        </div>
      </div>
    `,v.querySelector("#picker-cancel")?.addEventListener("click",()=>v.close()),v.addEventListener("click",y=>{y.target===v&&v.close()}),v.querySelectorAll(".member-pick-btn").forEach(y=>{y.addEventListener("click",()=>{const S=y.dataset.pubkey;v.close(),S&&document.dispatchEvent(new CustomEvent("canary:verify-call",{detail:{groupId:n,pubkey:S}}))})}),v.showModal()});const T=e.querySelector("#hero-progress-bar"),$=e.querySelector("#hero-countdown-label");mr=setInterval(()=>{const{groups:O}=_(),N=O[n];if(!N){Vo();return}const w=Ua(N),v=Math.min(100,Math.max(0,(N.rotationInterval-w)/N.rotationInterval*100));T&&(T.style.width=`${v}%`),$&&($.textContent=Da(w,N.rotationInterval)),w===0&&(Vo(),Hd(e))},1e3)}function Dr(e,t){const n=_().groups[t];if(!n)return e.slice(0,8);const{identity:r}=_();if(r?.pubkey===e)return"You";const o=n.memberNames?.[e];return o||`${e.slice(0,8)}…${e.slice(-4)}`}function dv(e){const n=Math.floor(Date.now()/1e3)-e;if(n<30)return"just now";if(n<60)return`${n}s ago`;const r=Math.floor(n/60);return r<60?`${r} min ago`:new Date(e*1e3).toLocaleTimeString()}function Fd(e,t,n,r){const o=document.querySelector(".duress-overlay");o&&o.remove();const s=Dr(e,t),a=r?dv(r):new Date().toLocaleTimeString(),i=document.createElement("div");i.className="duress-overlay",i.dataset.subject=e,i.dataset.groupId=t,i.setAttribute("role","alertdialog"),i.setAttribute("aria-label",`${s} needs help`);const c=document.createElement("div");c.className="duress-overlay__content";const l=document.createElement("div");l.className="duress-overlay__icon",l.setAttribute("aria-hidden","true"),l.textContent="!",c.appendChild(l);const d=document.createElement("h1");d.className="duress-overlay__title",d.textContent=s,c.appendChild(d);const u=document.createElement("h2");if(u.className="duress-overlay__subtitle",u.textContent="NEEDS HELP",c.appendChild(u),n&&(n.lat!==0||n.lon!==0)){const g=document.createElement("p");g.className="duress-overlay__location",g.textContent=`Last known: ${n.lat.toFixed(4)}, ${n.lon.toFixed(4)}`,c.appendChild(g)}const f=document.createElement("p");f.className="duress-overlay__time",f.textContent=a,c.appendChild(f);const h=document.createElement("button");h.className="btn btn--lg duress-overlay__dismiss",h.textContent="I'm Responding",h.title="Dismiss this alert on your screen only — does not clear the duress for others",h.addEventListener("click",()=>{i.classList.remove("duress-overlay--visible"),setTimeout(()=>i.remove(),300)}),c.appendChild(h);const p=document.createElement("button");p.className="btn btn--lg duress-overlay__stand-down",p.textContent="Stand Down — Person is Safe",p.title="Broadcast to all group members that this person has been confirmed safe",p.addEventListener("click",()=>{ve(t,{type:"duress-clear",subject:e,timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID()}),i.classList.remove("duress-overlay--visible"),setTimeout(()=>i.remove(),300);const{identity:g}=_(),b=g?.pubkey===e?"Self":Dr(g?.pubkey??"",t);H(`Duress stood down for ${s} by ${b}`,"success")}),c.appendChild(p),i.appendChild(c),document.body.appendChild(i),requestAnimationFrame(()=>i.classList.add("duress-overlay--visible"));function m(g){g.key==="Escape"&&(i.classList.remove("duress-overlay--visible"),setTimeout(()=>i.remove(),300),document.removeEventListener("keydown",m))}document.addEventListener("keydown",m)}document.addEventListener("canary:duress-clear",(e=>{const{subject:t,clearedBy:n}=e.detail,r=document.querySelector(`.duress-overlay[data-subject="${t}"]`);r&&(r.classList.remove("duress-overlay--visible"),setTimeout(()=>r.remove(),300));const o=e.detail.groupId,s=Dr(t,o),a=Dr(n,o);H(t===n?`${s} self-cleared their duress`:`${a} confirmed ${s} is safe`,"success")}));function Wo(e){const{groups:t,activeGroupId:n,identity:r}=_();if(r?.pubkey===e)return"You";if(!n)return e.slice(0,8)+"…";const o=t[n];if(!o)return e.slice(0,8)+"…";const s=o.memberNames?.[e];return s||e.slice(0,8)+"…"}function uv(e,t){const n=[],r=new Set(t);for(;n.length<e;){const o=Math.floor(Math.random()*hs),s=pr(o).toLowerCase();r.has(s)||(r.add(s),n.push(s))}return n}function fv(e){for(let t=e.length-1;t>0;t--){const n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}return e}function ja(e,t){for(const s of e)Fd(s,t,void 0,Math.floor(Date.now()/1e3));document.dispatchEvent(new CustomEvent("canary:duress",{detail:{members:e},bubbles:!0}));const{groups:n}=_(),r=n[t];if(!r)return;const o=Ii(r.seed);for(const s of e){const a=Vb(s);Wb(o,a).then(i=>{console.info("[canary] Duress alert encrypted:",i.slice(0,32)+"…")}),ve(t,{type:"duress-alert",lat:0,lon:0,timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID(),subject:s})}}function hv(e){const{groups:t,activeGroupId:n}=_();if(!n){e.innerHTML="";return}const r=t[n];if(!r){e.innerHTML="";return}const{identity:o}=_(),s=r.members.filter(b=>b!==o?.pubkey);if(s.length===0){e.innerHTML=`
      <section class="panel verify-panel">
        <h2 class="panel__title">Verify Someone</h2>
        <p class="settings-hint">No other members to verify yet. Invite someone first.</p>
      </section>
    `;return}const a=s.map(b=>`<button class="verify-member-btn btn btn--outline" data-pubkey="${j(b)}" type="button">${j(Wo(b))}</button>`).join("");e.innerHTML=`
    <section class="panel verify-panel">
      <h2 class="panel__title">Verify Someone</h2>
      <p class="settings-hint">Who are you verifying?</p>

      <div class="verify-member-list" id="verify-member-list">
        ${a}
      </div>

      <div id="verify-choices-area" hidden>
        <p class="settings-hint" id="verify-prompt"></p>
        <div class="verify-choices" id="verify-choices"></div>
        <div id="verify-result" class="verify-result" hidden></div>
        <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
          <button class="btn btn--ghost" id="verify-back" type="button">Verify another</button>
        </div>
      </div>

      <details class="verify-fallback" style="margin-top: 0.75rem;">
        <summary class="settings-hint" style="cursor: pointer;">Type manually</summary>
        <div class="verify-form" style="margin-top: 0.5rem;">
          <input class="input" id="verify-input" type="text" placeholder="${r.encodingFormat==="pin"?"Enter PIN":"Enter word"}" autocomplete="off" spellcheck="false" />
          <button class="btn btn--primary" id="verify-btn" type="button">Verify</button>
        </div>
      </details>
    </section>
  `;const i=e.querySelector("#verify-member-list"),c=e.querySelector("#verify-choices-area"),l=e.querySelector("#verify-choices"),d=e.querySelector("#verify-prompt"),u=e.querySelector("#verify-result");function f(b){const{groups:k,activeGroupId:T}=_();if(!T)return;const $=k[T];if(!$)return;const O=Math.floor(Date.now()/1e3),N=yt(O,$.rotationInterval)+$.usageOffset,w=Mt($),v=Le($.seed,Tt,N,w).toLowerCase(),y=io($.seed,Tt,b,N,w,$.tolerance)?.toLowerCase(),S=new Set([v]);y&&S.add(y);const A=uv(y?2:3,S),E=fv([v,...y?[y]:[],...A]),R=Wo(b);d.textContent=`Tap the word ${R} just said:`,u.hidden=!0,l.innerHTML=E.map(x=>`<button class="verify-choice" data-word="${j(x)}" type="button">${j(Es(x,$.encodingFormat))}</button>`).join(""),i.hidden=!0,c.hidden=!1,l.querySelectorAll(".verify-choice").forEach(x=>{x.addEventListener("click",()=>h(x.dataset.word??"",x,b))})}function h(b,k,T){const{groups:$,activeGroupId:O}=_();if(!O)return;const N=$[O];if(!N)return;const w=yt(Math.floor(Date.now()/1e3),N.rotationInterval)+N.usageOffset,v=ms(N.seed,Tt,w,b,N.members,{encoding:Mt(N),tolerance:N.tolerance}),y=v.status==="valid",S=Wo(T);l.querySelectorAll(".verify-choice").forEach(I=>I.classList.remove("verify-choice--correct","verify-choice--wrong")),k.classList.add(y?"verify-choice--correct":"verify-choice--wrong"),u.hidden=!1,u.className=`verify-result verify-result--${y?"valid":"invalid"}`,u.textContent=y?`${S} is verified.`:`${S} gave the wrong word.`,v.status==="duress"&&ja(v.identities??[],O)}e.querySelectorAll(".verify-member-btn").forEach(b=>{b.addEventListener("click",()=>{const k=b.dataset.pubkey;k&&f(k)})}),e.querySelector("#verify-back")?.addEventListener("click",()=>{i.hidden=!1,c.hidden=!0});const p=e.querySelector("#verify-input"),m=e.querySelector("#verify-btn");function g(){const b=p?.value.trim().toLowerCase().replace(/-/g,"")??"";if(!b)return;const{groups:k,activeGroupId:T}=_();if(!T)return;const $=k[T];if(!$)return;const O=yt(Math.floor(Date.now()/1e3),$.rotationInterval)+$.usageOffset,N=ms($.seed,Tt,O,b,$.members,{encoding:Mt($),tolerance:$.tolerance}),w=N.status==="valid";u.hidden=!1,u.className=`verify-result verify-result--${w?"valid":"invalid"}`,u.textContent=w?"Verified.":"Wrong word.",N.status==="duress"&&ja(N.identities??[],T)}m?.addEventListener("click",g),p?.addEventListener("keydown",b=>{b.key==="Enter"&&g()})}function Gd(e){const t=JSON.stringify(e),n=new TextEncoder().encode(t);let r="";for(let o=0;o<n.length;o++)r+=String.fromCharCode(n[o]);return btoa(r)}function po(e){const t=atob(e),n=new Uint8Array(t.length);for(let r=0;r<t.length;r++)n[r]=t.charCodeAt(r);return JSON.parse(new TextDecoder().decode(n))}function pv(e){return Gd(e).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function Kd(e){let t=e.replace(/-/g,"+").replace(/_/g,"/");const n=t.length%4;return n===2?t+="==":n===3&&(t+="="),po(t)}function mv(e){let t="";for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function yv(e){let t=e.replace(/-/g,"+").replace(/_/g,"/");const n=t.length%4;n===2?t+="==":n===3&&(t+="=");const r=atob(t),o=new Uint8Array(r.length);for(let s=0;s<r.length;s++)o[s]=r.charCodeAt(s);return o}const Vd=/^[0-9a-f]{64}$/,gv=/^[0-9a-f]{128}$/,Wd=/^[0-9a-f]{32}$/;function zd(e){const{adminSig:t,...n}=e,r=Object.keys(n).sort().reduce((o,s)=>(o[s]=n[s],o),{});return new TextEncoder().encode(JSON.stringify(r))}function bv(e){const{groupName:t,groupId:n,adminPubkey:r,adminPrivkey:o,relays:s,expiresInSec:a=86400}=e,i=new Uint8Array(16);crypto.getRandomValues(i);const c=Ke(i),l={groupName:t,groupId:n,adminPubkey:r,inviteId:c,expiresAt:Math.floor(Date.now()/1e3)+a,relays:[...s],adminSig:""},d=ge(zd(l));return l.adminSig=Ke(Q.sign(d,G(o))),l}function Jd(e){if(e==null||typeof e!="object")throw new Error("Remote invite token must be a non-null object");const t=e;if(typeof t.groupName!="string"||t.groupName.length===0)throw new Error("groupName must be a non-empty string");if(typeof t.groupId!="string"||t.groupId.length===0)throw new Error("groupId must be a non-empty string");if(typeof t.adminPubkey!="string"||!Vd.test(t.adminPubkey))throw new Error("adminPubkey must be a 64-character hex string");if(typeof t.inviteId!="string"||!Wd.test(t.inviteId))throw new Error("inviteId must be a 32-character hex string");if(typeof t.adminSig!="string"||!gv.test(t.adminSig))throw new Error("adminSig must be a 128-character hex string");if(!Array.isArray(t.relays)||!t.relays.every(a=>typeof a=="string"))throw new Error("relays must be an array of strings");if(typeof t.expiresAt!="number"||!Number.isFinite(t.expiresAt))throw new Error("expiresAt must be a finite number");const n=Math.floor(Date.now()/1e3);if(t.expiresAt<=n)throw new Error("Remote invite token has expired");const r=e,o=ge(zd(r));if(!Q.verify(G(r.adminSig),o,G(r.adminPubkey)))throw new Error("Remote invite token signature is invalid")}function vv(e){const{welcome:t,adminPrivkey:n,joinerPubkey:r}=e,o=JSON.stringify(t),s=be(G(n),r);return Bt(o,s)}function wv(e){const{envelope:t,joinerPrivkey:n,adminPubkey:r,expectedInviteId:o}=e,s=be(G(n),r),a=Pt(t,s),i=JSON.parse(a);if(typeof i.inviteId!="string"||!Wd.test(i.inviteId))throw new Error("Welcome payload must include a valid inviteId");if(i.inviteId!==o)throw new Error("Welcome payload inviteId does not match the pending invite");if(typeof i.seed!="string"||!Vd.test(i.seed))throw new Error("Welcome payload seed must be a 64-character hex string");if(typeof i.groupId!="string"||i.groupId.length===0)throw new Error("Welcome payload must include a non-empty groupId");return i}function Ev(e){if(e.startsWith("wss://"))return!0;if(e.startsWith("ws://"))try{const t=new URL(e);return t.hostname==="localhost"||t.hostname==="127.0.0.1"||t.hostname==="[::1]"}catch{return!1}return!1}const wn=/^[0-9a-f]{64}$/,Yd=/^[0-9a-f]{128}$/,kv=/^[0-9a-f]{32}$/,_v=10080*60,Zd=300;function Kt(e){return typeof e=="number"&&Number.isInteger(e)&&e>=0}function xv(){const e=new Uint8Array(16);return crypto.getRandomValues(e),Array.from(e).map(t=>t.toString(16).padStart(2,"0")).join("")}function Sv(e){const t=e;if(!t||typeof t!="object")throw new Error("Invalid invite payload — expected an object.");if(typeof t.groupId!="string"||t.groupId.length===0)throw new Error("Invalid invite payload — groupId is required.");if(typeof t.seed!="string"||!wn.test(t.seed))throw new Error("Invalid invite payload — seed must be 64-char hex.");if(typeof t.groupName!="string"||t.groupName.trim().length===0)throw new Error("Invalid invite payload — groupName is required.");if(!Number.isInteger(t.rotationInterval)||t.rotationInterval<=0)throw new Error("Invalid invite payload — rotationInterval must be > 0.");if(t.wordCount!==1&&t.wordCount!==2&&t.wordCount!==3)throw new Error("Invalid invite payload — wordCount must be 1, 2, or 3.");if(typeof t.wordlist!="string"||t.wordlist.length===0)throw new Error("Invalid invite payload — wordlist is required.");if(!Kt(t.counter)||!Kt(t.usageOffset))throw new Error("Invalid invite payload — counter and usageOffset must be non-negative integers.");if(typeof t.nonce!="string"||!kv.test(t.nonce))throw new Error("Invalid invite payload — nonce must be 32-char hex.");if(!Number.isInteger(t.beaconInterval)||t.beaconInterval<=0)throw new Error("Invalid invite payload — beaconInterval must be > 0.");if(!Number.isInteger(t.beaconPrecision)||t.beaconPrecision<1||t.beaconPrecision>11)throw new Error("Invalid invite payload — beaconPrecision must be 1..11.");if(!Array.isArray(t.members)||!t.members.every(r=>typeof r=="string"&&wn.test(r)))throw new Error("Invalid invite payload — members must be 64-char hex pubkeys.");if(!Array.isArray(t.relays)||!t.relays.every(r=>typeof r=="string"&&Ev(r)))throw new Error("Invalid invite payload — relays must be wss:// URLs (or ws:// for localhost).");if(t.encodingFormat!=="words"&&t.encodingFormat!=="pin"&&t.encodingFormat!=="hex")throw new Error("Invalid invite payload — encodingFormat must be words|pin|hex.");if(!Kt(t.tolerance))throw new Error("Invalid invite payload — tolerance must be a non-negative integer.");if(t.tolerance>10)throw new Error("Invalid invite payload — tolerance must be <= 10.");if(!Kt(t.issuedAt)||!Kt(t.expiresAt))throw new Error("Invalid invite payload — issuedAt/expiresAt must be unix seconds.");if(t.expiresAt<=t.issuedAt)throw new Error("Invalid invite payload — expiresAt must be after issuedAt.");if(!Kt(t.epoch))throw new Error("Invalid invite payload — epoch must be a non-negative integer.");if(!Array.isArray(t.admins)||!t.admins.every(r=>typeof r=="string"&&wn.test(r)))throw new Error("Invalid invite payload — admins must be 64-char hex pubkeys.");const n=new Set(t.members);if(!t.admins.every(r=>n.has(r)))throw new Error("Invalid invite payload — all admins must be in members.");if(t.protocolVersion===void 0||t.protocolVersion===null)throw new Error("Invalid invite payload — protocolVersion is required.");if(t.protocolVersion!==Ce)throw new Error(`Unsupported invite protocol version: ${t.protocolVersion} (expected: ${Ce})`);if(typeof t.inviterPubkey!="string"||!wn.test(t.inviterPubkey))throw new Error("Invalid invite payload — inviterPubkey must be a 64-char hex pubkey.");if(!t.admins.includes(t.inviterPubkey))throw new Error("Invalid invite payload — inviterPubkey must be in admins.");if(typeof t.inviterSig!="string"||!Yd.test(t.inviterSig))throw new Error("Invalid invite payload — inviterSig must be a 128-char hex Schnorr signature.")}function Xd(e){const{inviterSig:t,memberNames:n,relays:r,...o}=e,s=Object.keys(o).sort().reduce((a,i)=>(a[i]=o[i],a),{});return new TextEncoder().encode(JSON.stringify(s))}function Iv(e,t){const n=Xd(e),r=ge(n);return Ke(Q.sign(r,G(t)))}function Rv(e){const t=Xd(e),n=ge(t);return Q.verify(G(e.inviterSig),n,G(e.inviterPubkey))}function Qd(e){const{nonce:t,relays:n,memberNames:r,...o}=e,s=JSON.stringify(o),a=new TextEncoder,i=gt(G(t),a.encode(s)),c=i[0]<<25|i[1]<<17|i[2]<<9|i[3]<<1|i[4]>>7,l=c>>>22&2047,d=c>>>11&2047,u=c&2047;return`${pr(l)} ${pr(d)} ${pr(u)}`}function Av(e){const{identity:t}=_();if(!t?.pubkey)throw new Error("No identity — sign in first.");if(!t.privkey)throw new Error("Invite creation requires a local key (nsec). NIP-07 extensions cannot sign invites.");if(!e.admins.includes(t.pubkey))throw new Error(`Not authorised — you are not an admin of "${e.name}".`);const n=xv(),r=Math.floor(Date.now()/1e3),o={groupId:e.id,seed:e.seed,groupName:e.name,rotationInterval:e.rotationInterval,wordCount:e.wordCount,wordlist:e.wordlist,counter:e.counter,usageOffset:e.usageOffset,nonce:n,beaconInterval:e.beaconInterval,beaconPrecision:e.beaconPrecision,members:[...e.members],relays:[...e.writeRelays??e.relays??[]],encodingFormat:e.encodingFormat??"words",tolerance:e.tolerance??1,issuedAt:r,expiresAt:r+_v,epoch:e.epoch??0,admins:[...e.admins??[]],protocolVersion:Ce,inviterPubkey:t.pubkey,inviterSig:"",memberNames:{...e.memberNames}};o.inviterSig=Iv(o,t.privkey);const s=Qd(o);return{payload:o,confirmCode:s}}function Cv(e,t){let n;try{n=po(e)}catch{throw new Error("Invalid invite payload — could not decode.")}Sv(n);const r={groupId:n.groupId,seed:n.seed,groupName:n.groupName,rotationInterval:n.rotationInterval,wordCount:n.wordCount,wordlist:n.wordlist,counter:n.counter,usageOffset:n.usageOffset,nonce:n.nonce,beaconInterval:n.beaconInterval,beaconPrecision:n.beaconPrecision,members:[...n.members],relays:[...n.relays],encodingFormat:n.encodingFormat,tolerance:n.tolerance,issuedAt:n.issuedAt,expiresAt:n.expiresAt,epoch:n.epoch,admins:[...n.admins],protocolVersion:n.protocolVersion,inviterPubkey:n.inviterPubkey,inviterSig:n.inviterSig,memberNames:n.memberNames&&typeof n.memberNames=="object"?{...n.memberNames}:void 0};if(!Rv(r))throw new Error("Invite signature is invalid — the inviter could not prove control of the admin key.");if(!t?.trim())throw new Error("Confirmation code is required — ask the sender to read it to you.");const o=Qd(r),s=t.trim().replace(/[-\s]+/g," ").toLowerCase(),a=o.toLowerCase();if(s!==a)throw new Error("Confirmation words do not match — invite may have been tampered with.");const i=Math.floor(Date.now()/1e3);if(r.expiresAt<=i)throw new Error("Invite has expired. Ask for a new invite.");if(r.issuedAt>i+Zd)throw new Error("Invite timestamp is too far in the future — check your device clock.");return r}function Tv(e,t){const{groups:n}=_(),r=n[e];return r?Array.isArray(r.usedInvites)&&r.usedInvites.includes(t):!1}function Lv(e,t){const{groups:n}=_(),r=n[e];if(!r){console.warn(`[canary:invite] consumeInvite: unknown group id "${e}"`);return}J(e,{usedInvites:Array.from(new Set([...r.usedInvites,t]))})}const Nv=10080*60;function $v(e){const t=Object.keys(e).sort().reduce((n,r)=>(n[r]=e[r],n),{});return new TextEncoder().encode(JSON.stringify(t))}function Mv(e,t){let n;try{n=po(e)}catch{return{valid:!1,error:"Invalid join token — could not decode."}}if(n.g!==t.groupId)return{valid:!1,error:"Join token is for a different group."};if(typeof n.p!="string"||!wn.test(n.p))return{valid:!1,error:"Join token has invalid pubkey."};if(typeof n.s!="string"||!Yd.test(n.s))return{valid:!1,error:"Join token has invalid signature."};const r=Math.floor(Date.now()/1e3);if(typeof n.t!="number"||n.t<r-Nv)return{valid:!1,error:"Join token has expired or is stale."};if(n.t>r+Zd)return{valid:!1,error:"Join token timestamp is too far in the future."};const{s:o,...s}=n,a=ge($v(s));try{if(!Q.verify(G(n.s),a,G(n.p)))return{valid:!1,error:"Join token signature is invalid."}}catch{return{valid:!1,error:"Join token signature verification failed."}}const i=(n.w||"").toLowerCase(),c=t.tolerance??1;let l=!1;for(let d=t.counter-c;d<=t.counter+c;d++)if(!(d<0)&&i===Le(t.groupSeed,t.context,d,t.encoding).toLowerCase()){l=!0;break}return l?{valid:!0,pubkey:n.p,displayName:n.n||"",word:n.w||""}:{valid:!1,error:"Join token word does not match — seed possession not proven."}}let Nn=null;function Ov(e){const{identity:t}=_();if(!t?.pubkey)throw new Error("No identity — sign in first.");if(!t.privkey)throw new Error("Invite creation requires a local key (nsec). NIP-07 extensions cannot sign invites.");if(!e.admins.includes(t.pubkey))throw new Error(`Not authorised — you are not an admin of "${e.name}".`);const n=e.writeRelays?.length?[...e.writeRelays]:[..._().settings.defaultWriteRelays??_().settings.defaultRelays],r=bv({groupName:e.name,groupId:e.id,adminPubkey:t.pubkey,adminPrivkey:t.privkey,relays:n}),o=pv(r);return Nn={groupId:e.id,tokenPayload:o,inviteId:r.inviteId},Nn}function qa(e,t){const{identity:n}=_();if(!n?.privkey)throw new Error("No local identity — cannot create welcome envelope.");if(!Nn)throw new Error("No active remote invite session — cannot create welcome envelope.");const r={inviteId:Nn.inviteId,seed:e.seed,counter:e.counter,usageOffset:e.usageOffset,epoch:e.epoch??0,wordCount:e.wordCount,rotationInterval:e.rotationInterval,groupId:e.id,groupName:e.name,wordlist:e.wordlist,beaconInterval:e.beaconInterval,beaconPrecision:e.beaconPrecision,encodingFormat:e.encodingFormat??"words",tolerance:e.tolerance??1,members:[...e.members],admins:[...e.admins??[]],relays:[...e.writeRelays??e.relays??[]],memberNames:e.memberNames?{...e.memberNames}:void 0};return vv({welcome:r,adminPrivkey:n.privkey,joinerPubkey:t})}function mn(){Nn=null}function yn(e){const t=new Uint8Array(e.length/2);for(let n=0;n<t.length;n++)t[n]=parseInt(e.substring(n*2,n*2+2),16);return t}function gn(e){let t="";for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,"0");return t}const Bv={words:0,pin:1,hex:2},Pv={0:"words",1:"pin",2:"hex"},Uv={"en-v1":0},Dv={0:"en-v1"},eu=1,Ha=new TextEncoder,Fa=new TextDecoder;function jv(e){const t=Ha.encode(e.groupId),n=Ha.encode(e.groupName),r=e.admins.map(d=>{const u=e.members.indexOf(d);if(u===-1)throw new Error(`Admin ${d} not found in members array`);return u}),s=177+1+e.members.length*32+1+r.length+1+t.length+1+n.length,a=new ArrayBuffer(s),i=new DataView(a),c=new Uint8Array(a);let l=0;i.setUint8(l,eu),l+=1,c.set(yn(e.seed),l),l+=32,c.set(yn(e.inviterPubkey),l),l+=32,c.set(yn(e.inviterSig),l),l+=64,c.set(yn(e.nonce),l),l+=16,i.setUint32(l,e.counter),l+=4,i.setUint16(l,e.usageOffset),l+=2,i.setUint32(l,e.epoch),l+=4,i.setUint32(l,e.rotationInterval),l+=4,i.setUint32(l,e.beaconInterval),l+=4,i.setUint8(l,e.beaconPrecision),l+=1,i.setUint8(l,e.wordCount),l+=1,i.setUint8(l,e.tolerance),l+=1,i.setUint8(l,Bv[e.encodingFormat]??0),l+=1,i.setUint8(l,Uv[e.wordlist]??0),l+=1,i.setUint32(l,e.issuedAt),l+=4,i.setUint32(l,e.expiresAt),l+=4,i.setUint8(l,e.protocolVersion),l+=1,i.setUint8(l,e.members.length),l+=1;for(const d of e.members)c.set(yn(d),l),l+=32;i.setUint8(l,r.length),l+=1;for(const d of r)i.setUint8(l,d),l+=1;return i.setUint8(l,t.length),l+=1,c.set(t,l),l+=t.length,i.setUint8(l,n.length),l+=1,c.set(n,l),l+=n.length,c}function qv(e){const t=new DataView(e.buffer,e.byteOffset,e.byteLength);let n=0;const r=t.getUint8(n);if(n+=1,r!==eu)throw new Error(`Unsupported binary invite version: ${r}`);const o=gn(e.slice(n,n+32));n+=32;const s=gn(e.slice(n,n+32));n+=32;const a=gn(e.slice(n,n+64));n+=64;const i=gn(e.slice(n,n+16));n+=16;const c=t.getUint32(n);n+=4;const l=t.getUint16(n);n+=2;const d=t.getUint32(n);n+=4;const u=t.getUint32(n);n+=4;const f=t.getUint32(n);n+=4;const h=t.getUint8(n);n+=1;const p=t.getUint8(n);n+=1;const m=t.getUint8(n);n+=1;const g=Pv[t.getUint8(n)]??"words";n+=1;const b=Dv[t.getUint8(n)]??"en-v1";n+=1;const k=t.getUint32(n);n+=4;const T=t.getUint32(n);n+=4;const $=t.getUint8(n);n+=1;const O=t.getUint8(n);n+=1;const N=[];for(let E=0;E<O;E++)N.push(gn(e.slice(n,n+32))),n+=32;const w=t.getUint8(n);n+=1;const v=[];for(let E=0;E<w;E++){const R=t.getUint8(n);n+=1,v.push(N[R])}const y=t.getUint8(n);n+=1;const S=Fa.decode(e.slice(n,n+y));n+=y;const I=t.getUint8(n);n+=1;const A=Fa.decode(e.slice(n,n+I));return n+=I,{groupId:S,seed:o,groupName:A,rotationInterval:u,wordCount:p,wordlist:b,counter:c,usageOffset:l,nonce:i,beaconInterval:f,beaconPrecision:h,members:N,relays:[],encodingFormat:g,tolerance:m,issuedAt:k,expiresAt:T,epoch:d,admins:v,protocolVersion:$,inviterPubkey:s,inviterSig:a}}const dn=function(e,t){let o=e;const s=En[t];let a=null,i=0,c=null;const l=[],d={},u=function(w,v){i=o*4+17,a=(function(y){const S=new Array(y);for(let I=0;I<y;I+=1){S[I]=new Array(y);for(let A=0;A<y;A+=1)S[I][A]=null}return S})(i),f(0,0),f(i-7,0),f(0,i-7),m(),p(),b(w,v),o>=7&&g(w),c==null&&(c=$(o,s,l)),k(c,v)},f=function(w,v){for(let y=-1;y<=7;y+=1)if(!(w+y<=-1||i<=w+y))for(let S=-1;S<=7;S+=1)v+S<=-1||i<=v+S||(0<=y&&y<=6&&(S==0||S==6)||0<=S&&S<=6&&(y==0||y==6)||2<=y&&y<=4&&2<=S&&S<=4?a[w+y][v+S]=!0:a[w+y][v+S]=!1)},h=function(){let w=0,v=0;for(let y=0;y<8;y+=1){u(!0,y);const S=lt.getLostPoint(d);(y==0||w>S)&&(w=S,v=y)}return v},p=function(){for(let w=8;w<i-8;w+=1)a[w][6]==null&&(a[w][6]=w%2==0);for(let w=8;w<i-8;w+=1)a[6][w]==null&&(a[6][w]=w%2==0)},m=function(){const w=lt.getPatternPosition(o);for(let v=0;v<w.length;v+=1)for(let y=0;y<w.length;y+=1){const S=w[v],I=w[y];if(a[S][I]==null)for(let A=-2;A<=2;A+=1)for(let E=-2;E<=2;E+=1)A==-2||A==2||E==-2||E==2||A==0&&E==0?a[S+A][I+E]=!0:a[S+A][I+E]=!1}},g=function(w){const v=lt.getBCHTypeNumber(o);for(let y=0;y<18;y+=1){const S=!w&&(v>>y&1)==1;a[Math.floor(y/3)][y%3+i-8-3]=S}for(let y=0;y<18;y+=1){const S=!w&&(v>>y&1)==1;a[y%3+i-8-3][Math.floor(y/3)]=S}},b=function(w,v){const y=s<<3|v,S=lt.getBCHTypeInfo(y);for(let I=0;I<15;I+=1){const A=!w&&(S>>I&1)==1;I<6?a[I][8]=A:I<8?a[I+1][8]=A:a[i-15+I][8]=A}for(let I=0;I<15;I+=1){const A=!w&&(S>>I&1)==1;I<8?a[8][i-I-1]=A:I<9?a[8][15-I-1+1]=A:a[8][15-I-1]=A}a[i-8][8]=!w},k=function(w,v){let y=-1,S=i-1,I=7,A=0;const E=lt.getMaskFunction(v);for(let R=i-1;R>0;R-=2)for(R==6&&(R-=1);;){for(let x=0;x<2;x+=1)if(a[S][R-x]==null){let L=!1;A<w.length&&(L=(w[A]>>>I&1)==1),E(S,R-x)&&(L=!L),a[S][R-x]=L,I-=1,I==-1&&(A+=1,I=7)}if(S+=y,S<0||i<=S){S-=y,y=-y;break}}},T=function(w,v){let y=0,S=0,I=0;const A=new Array(v.length),E=new Array(v.length);for(let C=0;C<v.length;C+=1){const M=v[C].dataCount,B=v[C].totalCount-M;S=Math.max(S,M),I=Math.max(I,B),A[C]=new Array(M);for(let K=0;K<A[C].length;K+=1)A[C][K]=255&w.getBuffer()[K+y];y+=M;const P=lt.getErrorCorrectPolynomial(B),D=$n(A[C],P.getLength()-1).mod(P);E[C]=new Array(P.getLength()-1);for(let K=0;K<E[C].length;K+=1){const Y=K+D.getLength()-E[C].length;E[C][K]=Y>=0?D.getAt(Y):0}}let R=0;for(let C=0;C<v.length;C+=1)R+=v[C].totalCount;const x=new Array(R);let L=0;for(let C=0;C<S;C+=1)for(let M=0;M<v.length;M+=1)C<A[M].length&&(x[L]=A[M][C],L+=1);for(let C=0;C<I;C+=1)for(let M=0;M<v.length;M+=1)C<E[M].length&&(x[L]=E[M][C],L+=1);return x},$=function(w,v,y){const S=Ga.getRSBlocks(w,v),I=Ka();for(let E=0;E<y.length;E+=1){const R=y[E];I.put(R.getMode(),4),I.put(R.getLength(),lt.getLengthInBits(R.getMode(),w)),R.write(I)}let A=0;for(let E=0;E<S.length;E+=1)A+=S[E].dataCount;if(I.getLengthInBits()>A*8)throw"code length overflow. ("+I.getLengthInBits()+">"+A*8+")";for(I.getLengthInBits()+4<=A*8&&I.put(0,4);I.getLengthInBits()%8!=0;)I.putBit(!1);for(;!(I.getLengthInBits()>=A*8||(I.put(236,8),I.getLengthInBits()>=A*8));)I.put(17,8);return T(I,S)};d.addData=function(w,v){v=v||"Byte";let y=null;switch(v){case"Numeric":y=Hv(w);break;case"Alphanumeric":y=Fv(w);break;case"Byte":y=Gv(w);break;case"Kanji":y=Kv(w);break;default:throw"mode:"+v}l.push(y),c=null},d.isDark=function(w,v){if(w<0||i<=w||v<0||i<=v)throw w+","+v;return a[w][v]},d.getModuleCount=function(){return i},d.make=function(){if(o<1){let w=1;for(;w<40;w++){const v=Ga.getRSBlocks(w,s),y=Ka();for(let I=0;I<l.length;I++){const A=l[I];y.put(A.getMode(),4),y.put(A.getLength(),lt.getLengthInBits(A.getMode(),w)),A.write(y)}let S=0;for(let I=0;I<v.length;I++)S+=v[I].dataCount;if(y.getLengthInBits()<=S*8)break}o=w}u(!1,h())},d.createTableTag=function(w,v){w=w||2,v=typeof v>"u"?w*4:v;let y="";y+='<table style="',y+=" border-width: 0px; border-style: none;",y+=" border-collapse: collapse;",y+=" padding: 0px; margin: "+v+"px;",y+='">',y+="<tbody>";for(let S=0;S<d.getModuleCount();S+=1){y+="<tr>";for(let I=0;I<d.getModuleCount();I+=1)y+='<td style="',y+=" border-width: 0px; border-style: none;",y+=" border-collapse: collapse;",y+=" padding: 0px; margin: 0px;",y+=" width: "+w+"px;",y+=" height: "+w+"px;",y+=" background-color: ",y+=d.isDark(S,I)?"#000000":"#ffffff",y+=";",y+='"/>';y+="</tr>"}return y+="</tbody>",y+="</table>",y},d.createSvgTag=function(w,v,y,S){let I={};typeof arguments[0]=="object"&&(I=arguments[0],w=I.cellSize,v=I.margin,y=I.alt,S=I.title),w=w||2,v=typeof v>"u"?w*4:v,y=typeof y=="string"?{text:y}:y||{},y.text=y.text||null,y.id=y.text?y.id||"qrcode-description":null,S=typeof S=="string"?{text:S}:S||{},S.text=S.text||null,S.id=S.text?S.id||"qrcode-title":null;const A=d.getModuleCount()*w+v*2;let E,R,x,L,C="",M;for(M="l"+w+",0 0,"+w+" -"+w+",0 0,-"+w+"z ",C+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',C+=I.scalable?"":' width="'+A+'px" height="'+A+'px"',C+=' viewBox="0 0 '+A+" "+A+'" ',C+=' preserveAspectRatio="xMinYMin meet"',C+=S.text||y.text?' role="img" aria-labelledby="'+O([S.id,y.id].join(" ").trim())+'"':"",C+=">",C+=S.text?'<title id="'+O(S.id)+'">'+O(S.text)+"</title>":"",C+=y.text?'<description id="'+O(y.id)+'">'+O(y.text)+"</description>":"",C+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',C+='<path d="',x=0;x<d.getModuleCount();x+=1)for(L=x*w+v,E=0;E<d.getModuleCount();E+=1)d.isDark(x,E)&&(R=E*w+v,C+="M"+R+","+L+M);return C+='" stroke="transparent" fill="black"/>',C+="</svg>",C},d.createDataURL=function(w,v){w=w||2,v=typeof v>"u"?w*4:v;const y=d.getModuleCount()*w+v*2,S=v,I=y-v;return Jv(y,y,function(A,E){if(S<=A&&A<I&&S<=E&&E<I){const R=Math.floor((A-S)/w),x=Math.floor((E-S)/w);return d.isDark(x,R)?0:1}else return 1})},d.createImgTag=function(w,v,y){w=w||2,v=typeof v>"u"?w*4:v;const S=d.getModuleCount()*w+v*2;let I="";return I+="<img",I+=' src="',I+=d.createDataURL(w,v),I+='"',I+=' width="',I+=S,I+='"',I+=' height="',I+=S,I+='"',y&&(I+=' alt="',I+=O(y),I+='"'),I+="/>",I};const O=function(w){let v="";for(let y=0;y<w.length;y+=1){const S=w.charAt(y);switch(S){case"<":v+="&lt;";break;case">":v+="&gt;";break;case"&":v+="&amp;";break;case'"':v+="&quot;";break;default:v+=S;break}}return v},N=function(w){w=typeof w>"u"?2:w;const y=d.getModuleCount()*1+w*2,S=w,I=y-w;let A,E,R,x,L;const C={"██":"█","█ ":"▀"," █":"▄","  ":" "},M={"██":"▀","█ ":"▀"," █":" ","  ":" "};let B="";for(A=0;A<y;A+=2){for(R=Math.floor((A-S)/1),x=Math.floor((A+1-S)/1),E=0;E<y;E+=1)L="█",S<=E&&E<I&&S<=A&&A<I&&d.isDark(R,Math.floor((E-S)/1))&&(L=" "),S<=E&&E<I&&S<=A+1&&A+1<I&&d.isDark(x,Math.floor((E-S)/1))?L+=" ":L+="█",B+=w<1&&A+1>=I?M[L]:C[L];B+=`
`}return y%2&&w>0?B.substring(0,B.length-y-1)+Array(y+1).join("▀"):B.substring(0,B.length-1)};return d.createASCII=function(w,v){if(w=w||1,w<2)return N(v);w-=1,v=typeof v>"u"?w*2:v;const y=d.getModuleCount()*w+v*2,S=v,I=y-v;let A,E,R,x;const L=Array(w+1).join("██"),C=Array(w+1).join("  ");let M="",B="";for(A=0;A<y;A+=1){for(R=Math.floor((A-S)/w),B="",E=0;E<y;E+=1)x=1,S<=E&&E<I&&S<=A&&A<I&&d.isDark(R,Math.floor((E-S)/w))&&(x=0),B+=x?L:C;for(R=0;R<w;R+=1)M+=B+`
`}return M.substring(0,M.length-1)},d.renderTo2dContext=function(w,v){v=v||2;const y=d.getModuleCount();for(let S=0;S<y;S++)for(let I=0;I<y;I++)w.fillStyle=d.isDark(S,I)?"black":"white",w.fillRect(I*v,S*v,v,v)},d};dn.stringToBytes=function(e){const t=[];for(let n=0;n<e.length;n+=1){const r=e.charCodeAt(n);t.push(r&255)}return t};dn.createStringToBytes=function(e,t){const n=(function(){const o=Wv(e),s=function(){const c=o.read();if(c==-1)throw"eof";return c};let a=0;const i={};for(;;){const c=o.read();if(c==-1)break;const l=s(),d=s(),u=s(),f=String.fromCharCode(c<<8|l),h=d<<8|u;i[f]=h,a+=1}if(a!=t)throw a+" != "+t;return i})(),r=63;return function(o){const s=[];for(let a=0;a<o.length;a+=1){const i=o.charCodeAt(a);if(i<128)s.push(i);else{const c=n[o.charAt(a)];typeof c=="number"?(c&255)==c?s.push(c):(s.push(c>>>8),s.push(c&255)):s.push(r)}}return s}};const le={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},En={L:1,M:0,Q:3,H:2},ct={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},lt=(function(){const e=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],t=1335,n=7973,r=21522,o={},s=function(a){let i=0;for(;a!=0;)i+=1,a>>>=1;return i};return o.getBCHTypeInfo=function(a){let i=a<<10;for(;s(i)-s(t)>=0;)i^=t<<s(i)-s(t);return(a<<10|i)^r},o.getBCHTypeNumber=function(a){let i=a<<12;for(;s(i)-s(n)>=0;)i^=n<<s(i)-s(n);return a<<12|i},o.getPatternPosition=function(a){return e[a-1]},o.getMaskFunction=function(a){switch(a){case ct.PATTERN000:return function(i,c){return(i+c)%2==0};case ct.PATTERN001:return function(i,c){return i%2==0};case ct.PATTERN010:return function(i,c){return c%3==0};case ct.PATTERN011:return function(i,c){return(i+c)%3==0};case ct.PATTERN100:return function(i,c){return(Math.floor(i/2)+Math.floor(c/3))%2==0};case ct.PATTERN101:return function(i,c){return i*c%2+i*c%3==0};case ct.PATTERN110:return function(i,c){return(i*c%2+i*c%3)%2==0};case ct.PATTERN111:return function(i,c){return(i*c%3+(i+c)%2)%2==0};default:throw"bad maskPattern:"+a}},o.getErrorCorrectPolynomial=function(a){let i=$n([1],0);for(let c=0;c<a;c+=1)i=i.multiply($n([1,dt.gexp(c)],0));return i},o.getLengthInBits=function(a,i){if(1<=i&&i<10)switch(a){case le.MODE_NUMBER:return 10;case le.MODE_ALPHA_NUM:return 9;case le.MODE_8BIT_BYTE:return 8;case le.MODE_KANJI:return 8;default:throw"mode:"+a}else if(i<27)switch(a){case le.MODE_NUMBER:return 12;case le.MODE_ALPHA_NUM:return 11;case le.MODE_8BIT_BYTE:return 16;case le.MODE_KANJI:return 10;default:throw"mode:"+a}else if(i<41)switch(a){case le.MODE_NUMBER:return 14;case le.MODE_ALPHA_NUM:return 13;case le.MODE_8BIT_BYTE:return 16;case le.MODE_KANJI:return 12;default:throw"mode:"+a}else throw"type:"+i},o.getLostPoint=function(a){const i=a.getModuleCount();let c=0;for(let u=0;u<i;u+=1)for(let f=0;f<i;f+=1){let h=0;const p=a.isDark(u,f);for(let m=-1;m<=1;m+=1)if(!(u+m<0||i<=u+m))for(let g=-1;g<=1;g+=1)f+g<0||i<=f+g||m==0&&g==0||p==a.isDark(u+m,f+g)&&(h+=1);h>5&&(c+=3+h-5)}for(let u=0;u<i-1;u+=1)for(let f=0;f<i-1;f+=1){let h=0;a.isDark(u,f)&&(h+=1),a.isDark(u+1,f)&&(h+=1),a.isDark(u,f+1)&&(h+=1),a.isDark(u+1,f+1)&&(h+=1),(h==0||h==4)&&(c+=3)}for(let u=0;u<i;u+=1)for(let f=0;f<i-6;f+=1)a.isDark(u,f)&&!a.isDark(u,f+1)&&a.isDark(u,f+2)&&a.isDark(u,f+3)&&a.isDark(u,f+4)&&!a.isDark(u,f+5)&&a.isDark(u,f+6)&&(c+=40);for(let u=0;u<i;u+=1)for(let f=0;f<i-6;f+=1)a.isDark(f,u)&&!a.isDark(f+1,u)&&a.isDark(f+2,u)&&a.isDark(f+3,u)&&a.isDark(f+4,u)&&!a.isDark(f+5,u)&&a.isDark(f+6,u)&&(c+=40);let l=0;for(let u=0;u<i;u+=1)for(let f=0;f<i;f+=1)a.isDark(f,u)&&(l+=1);const d=Math.abs(100*l/i/i-50)/5;return c+=d*10,c},o})(),dt=(function(){const e=new Array(256),t=new Array(256);for(let r=0;r<8;r+=1)e[r]=1<<r;for(let r=8;r<256;r+=1)e[r]=e[r-4]^e[r-5]^e[r-6]^e[r-8];for(let r=0;r<255;r+=1)t[e[r]]=r;const n={};return n.glog=function(r){if(r<1)throw"glog("+r+")";return t[r]},n.gexp=function(r){for(;r<0;)r+=255;for(;r>=256;)r-=255;return e[r]},n})(),$n=function(e,t){if(typeof e.length>"u")throw e.length+"/"+t;const n=(function(){let o=0;for(;o<e.length&&e[o]==0;)o+=1;const s=new Array(e.length-o+t);for(let a=0;a<e.length-o;a+=1)s[a]=e[a+o];return s})(),r={};return r.getAt=function(o){return n[o]},r.getLength=function(){return n.length},r.multiply=function(o){const s=new Array(r.getLength()+o.getLength()-1);for(let a=0;a<r.getLength();a+=1)for(let i=0;i<o.getLength();i+=1)s[a+i]^=dt.gexp(dt.glog(r.getAt(a))+dt.glog(o.getAt(i)));return $n(s,0)},r.mod=function(o){if(r.getLength()-o.getLength()<0)return r;const s=dt.glog(r.getAt(0))-dt.glog(o.getAt(0)),a=new Array(r.getLength());for(let i=0;i<r.getLength();i+=1)a[i]=r.getAt(i);for(let i=0;i<o.getLength();i+=1)a[i]^=dt.gexp(dt.glog(o.getAt(i))+s);return $n(a,0).mod(o)},r},Ga=(function(){const e=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(o,s){const a={};return a.totalCount=o,a.dataCount=s,a},n={},r=function(o,s){switch(s){case En.L:return e[(o-1)*4+0];case En.M:return e[(o-1)*4+1];case En.Q:return e[(o-1)*4+2];case En.H:return e[(o-1)*4+3];default:return}};return n.getRSBlocks=function(o,s){const a=r(o,s);if(typeof a>"u")throw"bad rs block @ typeNumber:"+o+"/errorCorrectionLevel:"+s;const i=a.length/3,c=[];for(let l=0;l<i;l+=1){const d=a[l*3+0],u=a[l*3+1],f=a[l*3+2];for(let h=0;h<d;h+=1)c.push(t(u,f))}return c},n})(),Ka=function(){const e=[];let t=0;const n={};return n.getBuffer=function(){return e},n.getAt=function(r){const o=Math.floor(r/8);return(e[o]>>>7-r%8&1)==1},n.put=function(r,o){for(let s=0;s<o;s+=1)n.putBit((r>>>o-s-1&1)==1)},n.getLengthInBits=function(){return t},n.putBit=function(r){const o=Math.floor(t/8);e.length<=o&&e.push(0),r&&(e[o]|=128>>>t%8),t+=1},n},Hv=function(e){const t=le.MODE_NUMBER,n=e,r={};r.getMode=function(){return t},r.getLength=function(a){return n.length},r.write=function(a){const i=n;let c=0;for(;c+2<i.length;)a.put(o(i.substring(c,c+3)),10),c+=3;c<i.length&&(i.length-c==1?a.put(o(i.substring(c,c+1)),4):i.length-c==2&&a.put(o(i.substring(c,c+2)),7))};const o=function(a){let i=0;for(let c=0;c<a.length;c+=1)i=i*10+s(a.charAt(c));return i},s=function(a){if("0"<=a&&a<="9")return a.charCodeAt(0)-48;throw"illegal char :"+a};return r},Fv=function(e){const t=le.MODE_ALPHA_NUM,n=e,r={};r.getMode=function(){return t},r.getLength=function(s){return n.length},r.write=function(s){const a=n;let i=0;for(;i+1<a.length;)s.put(o(a.charAt(i))*45+o(a.charAt(i+1)),11),i+=2;i<a.length&&s.put(o(a.charAt(i)),6)};const o=function(s){if("0"<=s&&s<="9")return s.charCodeAt(0)-48;if("A"<=s&&s<="Z")return s.charCodeAt(0)-65+10;switch(s){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+s}};return r},Gv=function(e){const t=le.MODE_8BIT_BYTE,n=dn.stringToBytes(e),r={};return r.getMode=function(){return t},r.getLength=function(o){return n.length},r.write=function(o){for(let s=0;s<n.length;s+=1)o.put(n[s],8)},r},Kv=function(e){const t=le.MODE_KANJI,n=dn.stringToBytes;(function(s,a){const i=n(s);if(i.length!=2||(i[0]<<8|i[1])!=a)throw"sjis not supported."})("友",38726);const r=n(e),o={};return o.getMode=function(){return t},o.getLength=function(s){return~~(r.length/2)},o.write=function(s){const a=r;let i=0;for(;i+1<a.length;){let c=(255&a[i])<<8|255&a[i+1];if(33088<=c&&c<=40956)c-=33088;else if(57408<=c&&c<=60351)c-=49472;else throw"illegal char at "+(i+1)+"/"+c;c=(c>>>8&255)*192+(c&255),s.put(c,13),i+=2}if(i<a.length)throw"illegal char at "+(i+1)},o},tu=function(){const e=[],t={};return t.writeByte=function(n){e.push(n&255)},t.writeShort=function(n){t.writeByte(n),t.writeByte(n>>>8)},t.writeBytes=function(n,r,o){r=r||0,o=o||n.length;for(let s=0;s<o;s+=1)t.writeByte(n[s+r])},t.writeString=function(n){for(let r=0;r<n.length;r+=1)t.writeByte(n.charCodeAt(r))},t.toByteArray=function(){return e},t.toString=function(){let n="";n+="[";for(let r=0;r<e.length;r+=1)r>0&&(n+=","),n+=e[r];return n+="]",n},t},Vv=function(){let e=0,t=0,n=0,r="";const o={},s=function(i){r+=String.fromCharCode(a(i&63))},a=function(i){if(i<0)throw"n:"+i;if(i<26)return 65+i;if(i<52)return 97+(i-26);if(i<62)return 48+(i-52);if(i==62)return 43;if(i==63)return 47;throw"n:"+i};return o.writeByte=function(i){for(e=e<<8|i&255,t+=8,n+=1;t>=6;)s(e>>>t-6),t-=6},o.flush=function(){if(t>0&&(s(e<<6-t),e=0,t=0),n%3!=0){const i=3-n%3;for(let c=0;c<i;c+=1)r+="="}},o.toString=function(){return r},o},Wv=function(e){const t=e;let n=0,r=0,o=0;const s={};s.read=function(){for(;o<8;){if(n>=t.length){if(o==0)return-1;throw"unexpected end of file./"+o}const c=t.charAt(n);if(n+=1,c=="=")return o=0,-1;if(c.match(/^\s$/))continue;r=r<<6|a(c.charCodeAt(0)),o+=6}const i=r>>>o-8&255;return o-=8,i};const a=function(i){if(65<=i&&i<=90)return i-65;if(97<=i&&i<=122)return i-97+26;if(48<=i&&i<=57)return i-48+52;if(i==43)return 62;if(i==47)return 63;throw"c:"+i};return s},zv=function(e,t){const n=e,r=t,o=new Array(e*t),s={};s.setPixel=function(l,d,u){o[d*n+l]=u},s.write=function(l){l.writeString("GIF87a"),l.writeShort(n),l.writeShort(r),l.writeByte(128),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(0),l.writeByte(255),l.writeByte(255),l.writeByte(255),l.writeString(","),l.writeShort(0),l.writeShort(0),l.writeShort(n),l.writeShort(r),l.writeByte(0);const d=2,u=i(d);l.writeByte(d);let f=0;for(;u.length-f>255;)l.writeByte(255),l.writeBytes(u,f,255),f+=255;l.writeByte(u.length-f),l.writeBytes(u,f,u.length-f),l.writeByte(0),l.writeString(";")};const a=function(l){const d=l;let u=0,f=0;const h={};return h.write=function(p,m){if(p>>>m)throw"length over";for(;u+m>=8;)d.writeByte(255&(p<<u|f)),m-=8-u,p>>>=8-u,f=0,u=0;f=p<<u|f,u=u+m},h.flush=function(){u>0&&d.writeByte(f)},h},i=function(l){const d=1<<l,u=(1<<l)+1;let f=l+1;const h=c();for(let k=0;k<d;k+=1)h.add(String.fromCharCode(k));h.add(String.fromCharCode(d)),h.add(String.fromCharCode(u));const p=tu(),m=a(p);m.write(d,f);let g=0,b=String.fromCharCode(o[g]);for(g+=1;g<o.length;){const k=String.fromCharCode(o[g]);g+=1,h.contains(b+k)?b=b+k:(m.write(h.indexOf(b),f),h.size()<4095&&(h.size()==1<<f&&(f+=1),h.add(b+k)),b=k)}return m.write(h.indexOf(b),f),m.write(u,f),m.flush(),p.toByteArray()},c=function(){const l={};let d=0;const u={};return u.add=function(f){if(u.contains(f))throw"dup key:"+f;l[f]=d,d+=1},u.size=function(){return d},u.indexOf=function(f){return l[f]},u.contains=function(f){return typeof l[f]<"u"},u};return s},Jv=function(e,t,n){const r=zv(e,t);for(let i=0;i<t;i+=1)for(let c=0;c<e;c+=1)r.setPixel(c,i,n(c,i));const o=tu();r.write(o);const s=Vv(),a=o.toByteArray();for(let i=0;i<a.length;i+=1)s.writeByte(a[i]);return s.flush(),"data:image/gif;base64,"+s};dn.stringToBytes;function Yv(e,t=4){const n=dn(0,"L");return n.addData(e),n.make(),n.createSvgTag({cellSize:t,margin:2,scalable:!0})}const jr=25519;function nu(e){const t=de(),{identity:n}=_();if(!t||!n?.pubkey||!n?.privkey)return e.onError("No relay pool or identity available."),()=>{};const{inviteId:r,adminPubkey:o,readRelays:s,writeRelays:a,onWelcome:i,onError:c}=e,l=n.privkey;n.pubkey;const d=Array.from(new Set([...s,...a])),u=be(G(l),o),f=JSON.stringify({type:"join-request",inviteId:r}),h=Bt(f,u),p=nt({kind:jr,created_at:Math.floor(Date.now()/1e3),tags:[["d",r],["p",o]],content:h},G(l));Promise.allSettled(t.publish(a,p)).catch(()=>{});const m=t.subscribeMany(d,{kinds:[jr],"#d":[r],authors:[o]},{onevent(b){try{const k=Pt(b.content,u),T=JSON.parse(k);T.type==="welcome"&&T.inviteId===r&&T.envelope&&(i(T.envelope),m.close())}catch{}},oneose(){}}),g=setTimeout(()=>{m.close(),c("Timed out waiting for welcome message from admin.")},12e4);return()=>{clearTimeout(g),m.close()}}function Zv(e){const t=de(),{identity:n}=_();if(!t||!n?.pubkey||!n?.privkey)return e.onError("No relay pool or identity available."),()=>{};const{inviteId:r,readRelays:o,writeRelays:s,onJoinRequest:a,onError:i}=e,c=n.privkey,l=Array.from(new Set([...o,...s])),d=t.subscribeMany(l,{kinds:[jr],"#d":[r],"#p":[n.pubkey]},{onevent(f){try{const h=be(G(c),f.pubkey),p=Pt(f.content,h),m=JSON.parse(p);m.type==="join-request"&&m.inviteId===r&&a(f.pubkey)}catch{}},oneose(){}}),u=setTimeout(()=>{d.close(),i("Timed out waiting for join request.")},3e5);return()=>{clearTimeout(u),d.close()}}function Xv(e){const t=de(),{identity:n}=_();if(!t||!n?.privkey)return;const{inviteId:r,joinerPubkey:o,envelope:s,writeRelays:a}=e,i=be(G(n.privkey),o),c=JSON.stringify({type:"welcome",inviteId:r,envelope:s}),l=Bt(c,i),d=nt({kind:jr,created_at:Math.floor(Date.now()/1e3),tags:[["d",r],["p",o]],content:l},G(n.privkey));Promise.allSettled(t.publish(a,d)).catch(()=>{})}const ru=35520;function Qv(e){const t=de(),{identity:n}=_();if(!t||!n?.privkey)return;const{token:r,writeRelays:o}=e,s=JSON.stringify(r),a=String(Math.floor(Date.now()/1e3)+10080*60),i=nt({kind:ru,created_at:Math.floor(Date.now()/1e3),tags:[["d",r.inviteId],["expiration",a]],content:s},G(n.privkey));Promise.allSettled(t.publish(o,i)).catch(()=>{})}function e0(e){const t=de();if(!t)return e.onError("No relay pool available."),()=>{};const{inviteId:n,readRelays:r,onToken:o,onError:s}=e;let a=!1;const i=t.subscribeMany(r,{kinds:[ru],"#d":[n]},{onevent(l){if(!a)try{const d=JSON.parse(l.content);d.inviteId===n&&(a=!0,o(d),i.close())}catch{}},oneose(){a||(i.close(),s("Invite not found on relay — it may have expired."))}}),c=setTimeout(()=>{a||(i.close(),s("Timed out looking for invite on relay."))},15e3);return()=>{clearTimeout(c),i.close()}}const Ze=new Map,yr=new Map,t0=6e4,Ee=new Set;function Ri(e){const t=Ze.get(e);if(t)return t.display_name||t.name||void 0}function un(e){return Ze.get(e)}function ou(e,t){const n=de();if(!n){console.warn("[profiles] no pool — skipping");return}const r=Date.now(),o=e.filter(c=>{if(Ze.has(c)||Ee.has(c))return!1;const l=yr.get(c);return!(l&&r-l<t0)});if(o.length===0){console.warn("[profiles] all cached/pending — nothing to fetch");return}for(const c of o)Ee.add(c);const s=r0(t),a=[...new Set([...s,...su])];if(console.warn("[profiles] fetching",o.length,"profiles from",a,"for group",t?.slice(0,8)),a.length===0){for(const c of o)Ee.delete(c);return}const i=n.subscribeMany(a,{kinds:[0],authors:o},{onevent(c){try{const l=JSON.parse(c.content);console.warn("[profiles] got profile for",c.pubkey.slice(0,8),l.display_name||l.name||"(no name)"),Ze.set(c.pubkey,l),Ee.delete(c.pubkey);const d=l.display_name||l.name;if(d&&t){const u=_().groups[t];u&&u.memberNames?.[c.pubkey]!==d&&J(t,{memberNames:{...u.memberNames,[c.pubkey]:d}})}}catch{yr.set(c.pubkey,Date.now()),Ee.delete(c.pubkey)}},oneose(){console.warn("[profiles] EOSE — found:",o.filter(c=>Ze.has(c)).length,"missing:",o.filter(c=>!Ze.has(c)).length);for(const c of o)Ze.has(c)||yr.set(c,Date.now()),Ee.delete(c);i.close()}})}const Ai=["wss://purplepag.es","wss://relay.damus.io","wss://nos.lol"],su=Ai;async function n0(){await fo();const e=de(),{identity:t,settings:n}=_();if(!e||!t?.pubkey)return;const r=t.pubkey;if(Ee.has(r))return;Ze.delete(r),yr.delete(r),Ee.add(r);const o=n?.defaultRelays?.length?n.defaultRelays:[],s=[...new Set([...o,...su])];if(s.length===0){Ee.delete(r);return}console.warn("[profiles] fetching own kind 0 from",s);const a=e.subscribeMany(s,{kinds:[0],authors:[r]},{onevent(i){try{const c=JSON.parse(i.content);console.warn("[profiles] got own profile from relay:",c.display_name||c.name||"(no name)"),Ze.set(i.pubkey,c),Ee.delete(i.pubkey);const l=c.display_name||c.name,d=c.picture,{identity:u}=_();if(u&&u.pubkey===i.pubkey){const f={};l&&u.displayName!==l&&(f.displayName=l),d&&u.picture!==d&&(f.picture=d),Object.keys(f).length>0&&ee({identity:{...u,...f}})}}catch{Ee.delete(i.pubkey)}},oneose(){Ee.delete(r),a.close()}})}function r0(e){if(e){const n=_().groups[e];if(n?.relays?.length)return n.relays}const t=_().settings;return t?.defaultRelays?.length?t.defaultRelays:[]}function o0(e){const t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function s0(e,t){setTimeout(async()=>{try{const n=de();if(!n){console.warn("[profiles] no pool — skipping kind 0 publish");return}await fo();const r=JSON.stringify({name:e}),o={kind:0,created_at:Math.floor(Date.now()/1e3),tags:[],content:r},s=o0(t),a=nt(o,s),{settings:i}=_(),c=i?.defaultWriteRelays?.length?i.defaultWriteRelays:i?.defaultRelays?.length?i.defaultRelays:[],l=ke([...Ai,...c]);console.warn("[profiles] publishing kind 0 to",l);const d=n.publish(l,a),f=(await Promise.allSettled(d)).filter(h=>h.status==="fulfilled").length;console.warn(`[profiles] kind 0 published to ${f}/${l.length} relay(s)`)}catch(n){console.warn("[profiles] kind 0 publish failed:",n)}},2e3)}const iu=Object.freeze(Object.defineProperty({__proto__:null,PROFILE_RELAYS:Ai,fetchOwnProfile:n0,fetchProfiles:ou,getCachedName:Ri,getCachedProfile:un,publishKind0:s0},Symbol.toStringTag,{value:"Module"})),Va=[210,140,30,280,60,330,170,0];function i0(e,t){const n=t.indexOf(e);return Va[(n>=0?n:0)%Va.length]}function a0(e,t,n,r){const o=i0(e,t),s=n[e]??0;if(s===0)return`hsl(${o}, 55%, 55%)`;const a=Math.floor(Date.now()/1e3)-s;return a<=r?`hsl(${o}, 70%, 55%)`:a<=r*1.25?`hsl(${o}, 40%, 50%)`:"#94a3b8"}function ks(e,t,n){const{identity:r,groups:o}=_(),s=r?.pubkey===e;let a;if(n){const c=o[n]?.memberNames?.[e];c&&c!=="You"&&(a=c)}return a||(a=Ri(e)),s?a?`${a} (you)`:"You":a||`${e.slice(0,8)}…${e.slice(-4)}`}function mo(e,t){const n=t?.title??"Invite to Group",r=t?.scanHint??"Scan with your phone camera to join";t?.showConfirmMemberNote,On(e);let o=document.getElementById("invite-modal");o||(o=document.createElement("dialog"),o.id="invite-modal",o.className="modal",document.body.appendChild(o),o.addEventListener("click",u=>{u.target===o&&(mn(),o.close())}));const s=o;function a(){s.innerHTML=`
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
    `,s.querySelector("#invite-qr-path")?.addEventListener("click",l),s.querySelector("#invite-link-path")?.addEventListener("click",d),s.querySelector("#invite-close-btn")?.addEventListener("click",()=>{mn(),s.close()})}function i(u){s.innerHTML=`
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
    `,s.querySelector("#remote-back-2")?.addEventListener("click",u),s.querySelector("#remote-next-2")?.addEventListener("click",()=>{const f=s.querySelector("#remote-joincode-input"),h=s.querySelector("#remote-joincode-error"),p=f?.value.trim()??"";if(!/^[0-9a-f]{64}$/.test(p)){h&&(h.textContent="Invalid join code — must be a 64-character hex public key.",h.style.display="");return}try{const m=_().groups[e.id];if(!m)throw new Error("Group not found.");const g=qa(m,p);c(g,p)}catch(m){h&&(h.textContent=m instanceof Error?m.message:"Failed to create welcome envelope.",h.style.display="")}})}function c(u,f){s.innerHTML=`
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
    `,s.querySelector("#remote-copy-welcome")?.addEventListener("click",async h=>{const p=h.currentTarget;try{await navigator.clipboard.writeText(u),p.textContent="Copied!",p.classList.add("btn--copied"),setTimeout(()=>{p.textContent="Copy Welcome Message",p.classList.remove("btn--copied")},2e3)}catch{}}),s.querySelector("#remote-done")?.addEventListener("click",()=>{try{const h=_().groups[e.id];if(h&&!h.members.includes(f)){const p=s.querySelector("#remote-joiner-name")?.value.trim()??"";ws(e.id,f,p),H(p?`${p} added to group`:"Member added to group","success")}}catch(h){H(h instanceof Error?h.message:"Failed to add member","error")}mn(),s.close()})}function l(){let u,f,h;try{const b=Av(e);u=b.payload,f=b.confirmCode,h=jv(u)}catch(b){H(b instanceof Error?b.message:"Failed to create invite.","error");return}const m=`${window.location.href.split("#")[0]}#inv/${mv(h)}`,g=Yv(m);s.innerHTML=`
      <div class="modal__form invite-share">
        <h2 class="modal__title">${j(n)}</h2>

        <div class="qr-container" data-url="${j(m)}">${g}</div>
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
    `,s.querySelector("#invite-back-btn")?.addEventListener("click",()=>{a()}),s.querySelector("#invite-done-btn")?.addEventListener("click",()=>{s.close()})}function d(){let u;try{u=Ov(e)}catch(b){H(b instanceof Error?b.message:"Failed to create remote invite.","error");return}const h=`${window.location.href.split("#")[0]}#j/${u.inviteId}`,p=e.readRelays?.length?e.readRelays:_().settings.defaultReadRelays,m=e.writeRelays?.length?e.writeRelays:_().settings.defaultWriteRelays;Ne(p,m).then(()=>{Qv({token:Kd(u.tokenPayload),writeRelays:m})});let g=()=>{};s.innerHTML=`
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
    `,s.querySelector("#remote-copy-link")?.addEventListener("click",async b=>{const k=b.currentTarget;try{await navigator.clipboard.writeText(h),k.textContent="Copied!",k.classList.add("btn--copied"),setTimeout(()=>{k.textContent="Copy Link",k.classList.remove("btn--copied")},2e3)}catch{}}),Ne(p,m).then(()=>{g=Zv({inviteId:u.inviteId,readRelays:p,writeRelays:m,onJoinRequest(b){g();try{const k=_().groups[e.id];if(!k)return;const T=qa(k,b);Xv({inviteId:u.inviteId,joinerPubkey:b,envelope:T,writeRelays:m}),k.members.includes(b)||ws(e.id,b),mn(),s.close(),H("Member joined via relay","success")}catch(k){H(k instanceof Error?k.message:"Failed to send welcome","error")}},onError(b){const k=s.querySelector("#remote-relay-status");k&&(k.textContent=b||"Relay unavailable — use manual fallback below.")}})}),s.querySelector("#remote-manual-fallback")?.addEventListener("click",()=>{g(),i(()=>{g=()=>{},d()})}),s.querySelector("#remote-back-btn")?.addEventListener("click",()=>{g(),mn(),a()})}a(),o.showModal()}function _s(e){mo(e,{title:"Share Group State",scanHint:"Share with existing members to sync the latest group state.",showConfirmMemberNote:!1})}function c0(e,t){const{identity:n,groups:r}=_(),o=r[t],s=n?.pubkey===e,a=o?.admins.includes(e)??!1,i=ks(e,o?.members??[],t),c=un(e),l=o?.memberNames?.[e],d=o?.livenessCheckins?.[e];let u="Never checked in";if(d){const b=Math.floor(Date.now()/1e3)-d;b<60?u="Active now":b<3600?u=`${Math.floor(b/60)}m ago`:u=`${Math.floor(b/3600)}h ago`}const f=[s?'<span class="member-detail__badge">You</span>':"",a?'<span class="member-detail__badge member-detail__badge--admin">Admin</span>':""].filter(Boolean).join(" "),h=c?.display_name||c?.name,p=(b,k)=>`<div class="member-detail__row"><span class="member-detail__label">${b}</span><span class="member-detail__value">${j(k)}</span></div>`,m=[p("Pubkey",`${e.slice(0,16)}…${e.slice(-8)}`)];h&&m.push(p("Nostr name",h)),c?.nip05&&m.push(p("NIP-05",c.nip05)),c?.about&&m.push(p("About",c.about.length>80?c.about.slice(0,80)+"…":c.about)),c?.lud16&&m.push(p("Lightning",c.lud16)),c?.website&&m.push(p("Website",c.website)),l&&l!=="You"&&l!==h&&m.push(p("Display name",l)),m.push(p("Liveness",u)),c||m.push('<div class="member-detail__row"><span class="member-detail__label" style="color: var(--text-muted); font-style: italic;">No Nostr profile found on relay</span></div>');const g=c?.picture?`<img class="member-detail__avatar" src="${j(c.picture)}" alt="" />`:"";Si(`
    <div class="member-detail__header">
      ${g}
      <div>
        <h2 class="modal__title" style="margin:0;">${j(i)} ${f}</h2>
      </div>
    </div>
    <div class="member-detail__rows">${m.join("")}</div>
    <div class="modal__actions">
      <button class="btn btn--sm" id="member-detail-copy" type="button">Copy Pubkey</button>
      <button class="btn" id="modal-cancel-btn" type="button">Close</button>
    </div>
  `,()=>{}),requestAnimationFrame(()=>{document.getElementById("member-detail-copy")?.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(e);const b=document.getElementById("member-detail-copy");b.textContent="Copied!",setTimeout(()=>{b.textContent="Copy Pubkey"},1500)}catch{}}),document.getElementById("modal-cancel-btn")?.addEventListener("click",()=>{document.getElementById("app-modal")?.close()})})}function au(e){const{groups:t,activeGroupId:n}=_();if(!n){e.innerHTML="";return}const r=t[n];if(!r){e.innerHTML="";return}const{identity:o}=_(),s=!!o?.pubkey&&r.admins.includes(o.pubkey);ou(r.members,n);const a=r.members.length>0?r.members.map(i=>{const c=a0(i,r.members,r.livenessCheckins??{},r.livenessInterval),l=un(i),d=l?.picture?`<img src="${j(l.picture)}" alt="" style="width:24px;height:24px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid ${c};box-shadow:0 0 6px ${c}80;" />`:`<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${c};flex-shrink:0;box-shadow:0 0 6px ${c}80;"></span>`;return`
          <li class="member-item" data-pubkey="${j(i)}">
            ${d}
            <button class="member-item__name-btn" data-pubkey="${j(i)}" type="button">${j(ks(i,r.members,n))}</button>
            ${s?`<button
              class="btn btn--sm member-item__remove"
              data-pubkey="${j(i)}"
              type="button"
              aria-label="Remove member"
            >✕</button>`:""}
          </li>`}).join(""):'<li class="member-item member-item--empty">No members yet.</li>';e.innerHTML=`
    <section class="panel members-panel">
      <h2 class="panel__title">Members</h2>
      <ul class="member-list">
        ${a}
      </ul>
      ${s?`<div class="members-actions">
        <button class="btn btn--sm" id="invite-btn" type="button" title="Invite a new person to join this group">+ Invite</button>
        <button class="btn btn--sm" id="share-state-btn" type="button" title="Share the latest group state with existing members after changes">Share State</button>
        <button class="btn btn--sm" id="confirm-member-btn" type="button" title="Verify and add a member using their acknowledgement token or verification word">Confirm Member</button>
      </div>`:""}
    </section>
  `,e.querySelectorAll(".member-item__name-btn").forEach(i=>{i.addEventListener("click",()=>{const c=i.dataset.pubkey;c&&c0(c,n)})}),e.querySelector(".member-list")?.addEventListener("click",i=>{const c=i.target.closest(".member-item__remove");if(!c)return;const l=c.dataset.pubkey;if(!l)return;const{groups:d}=_(),u=d[n]?.members??[];if(!confirm(`Remove ${ks(l,u,n)} from the group?

This rotates the group secret immediately. Remaining members must re-join using a fresh invite.`))return;const{activeGroupId:f}=_();if(!f)return;Qb(f,l);const{groups:h}=_(),p=h[f];p&&p.members.length>0&&_s(p)}),e.querySelector("#invite-btn")?.addEventListener("click",()=>{const{groups:i,activeGroupId:c}=_();if(!c)return;const l=i[c];l&&mo(l)}),e.querySelector("#share-state-btn")?.addEventListener("click",()=>{const{groups:i,activeGroupId:c}=_();if(!c)return;const l=i[c];l&&_s(l)}),e.querySelector("#confirm-member-btn")?.addEventListener("click",()=>{cu()})}function Wa(e,t,n){const{groups:r,identity:o}=_(),s=r[e];if(!s||!o?.pubkey||!s.admins.includes(o.pubkey))return!1;s.members.includes(t)||ws(e,t,n);const a=_().groups[e];return a&&n&&J(e,{memberNames:{...a.memberNames,[t]:n}}),!0}function cu(e){const{groups:t,activeGroupId:n}=_();!n||!t[n]||(Si(`
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
  `,o=>{try{const s=o.get("ackToken")?.trim(),a=o.get("word")?.trim().toLowerCase(),i=o.get("memberName")?.trim(),{activeGroupId:c}=_();if(!c)throw new Error("No active group.");const{groups:l}=_(),d=l[c];if(!d)throw new Error("Group not found.");if(s){const u=s.includes("#ack/")?decodeURIComponent(s.split("#ack/")[1]):s,f=Mv(u,{groupId:c,groupSeed:d.seed,counter:d.counter+(d.usageOffset??0),context:"canary:group",encoding:Mt(d),tolerance:d.tolerance??1});if(!f.valid)throw new Error(f.error??"Invalid join token.");if(!Wa(c,f.pubkey,f.displayName||i||""))throw new Error("Member could not be added — they may already be in the group or you are not an admin.");H(`${f.displayName||"Member"} has joined the group`,"success")}else if(a){if(!i)throw new Error("Please enter the member name.");const u=d.counter+(d.usageOffset??0),f=Le(d.seed,Tt,u,Mt(d)).toLowerCase();if(a!==f)throw new Error("Word does not match — the member may not have the current group key.");const h=new Uint8Array(32);crypto.getRandomValues(h);const p=Array.from(h,m=>m.toString(16).padStart(2,"0")).join("");if(!Wa(c,p,i))throw new Error("Member could not be added — you may not be an admin of this group.");H(`${i} has joined the group`,"success")}else throw new Error("Provide either an ack token or a verification word.")}catch(s){throw alert(s instanceof Error?s.message:"Confirmation failed."),s}}),requestAnimationFrame(()=>{document.getElementById("modal-cancel-btn")?.addEventListener("click",()=>{document.getElementById("app-modal")?.close()})}))}const l0=Object.freeze(Object.defineProperty({__proto__:null,renderMembers:au,showConfirmMemberModal:cu,showInviteModal:mo,showShareStateModal:_s},Symbol.toStringTag,{value:"Module"})),xs="0123456789bcdefghjkmnpqrstuvwxyz",Ci={};for(let e=0;e<xs.length;e++)Ci[xs[e]]=e;function d0(e){for(const t of e)if(!(t in Ci))throw new TypeError(`Invalid geohash character: '${t}' in "${e}"`)}function Ti(e,t,n=5){if(!Number.isFinite(e)||e<-90||e>90)throw new RangeError(`Invalid latitude: ${e}`);if(!Number.isFinite(t)||t<-180||t>180)throw new RangeError(`Invalid longitude: ${t}`);if(!Number.isFinite(n))throw new RangeError(`Invalid precision: ${n}`);if(n=Math.round(n),n<1)throw new RangeError(`Invalid precision: ${n}`);n=Math.min(12,n);let r=-90,o=90,s=-180,a=180,i="",c=0,l=0,d=!0;for(;i.length<n;){if(d){const u=(s+a)/2;t>=u?(l|=1<<4-c,s=u):a=u}else{const u=(r+o)/2;e>=u?(l|=1<<4-c,r=u):o=u}d=!d,c++,c===5&&(i+=xs[l],c=0,l=0)}return i}function lu(e){if(e.length===0)throw new TypeError("Cannot decode an empty geohash");const t=u0(e);return{lat:(t.minLat+t.maxLat)/2,lon:(t.minLon+t.maxLon)/2,error:{lat:(t.maxLat-t.minLat)/2,lon:(t.maxLon-t.minLon)/2}}}function u0(e){d0(e);let t=-90,n=90,r=-180,o=180,s=!0;for(const a of e){const i=Ci[a];for(let c=4;c>=0;c--){if(s){const l=(r+o)/2;i>>c&1?r=l:o=l}else{const l=(t+n)/2;i>>c&1?t=l:n=l}s=!s}}return{minLat:t,maxLat:n,minLon:r,maxLon:o}}const f0=[0,25e5,63e4,78e3,2e4,2400,610,76,19,2.4];function Li(e){if(!Number.isFinite(e))throw new RangeError(`Invalid precision: ${e}`);const t=Math.max(1,Math.min(9,Math.round(e)));return f0[t]}let te=null,De=null,pt={},ye={},Ni={},Ae=null,yo=new Set,go=!1;const h0=[{label:"City",value:4,hint:"~20 km"},{label:"Neighbourhood",value:5,hint:"~2.4 km"},{label:"Street",value:6,hint:"~610 m"},{label:"Exact",value:9,hint:"~2 m"}],za=6371e3;function p0(e,t,n,r=48){const o=[];for(let s=0;s<=r;s++){const a=s/r*2*Math.PI,i=n/za*Math.cos(a)*(180/Math.PI),c=n/(za*Math.cos(e*Math.PI/180))*Math.sin(a)*(180/Math.PI);o.push([t+c,e+i])}return o}const Ja=[210,140,30,280,60,330,170,0];function ir(e){const{groups:t,activeGroupId:n}=_(),s=((n?t[n]:null)?.members??[]).indexOf(e);return Ja[(s>=0?s:0)%Ja.length]}function $i(e){if(yo.has(e))return"#f87171";const{groups:t,activeGroupId:n}=_(),r=n?t[n]:null;if(!r)return`hsl(${ir(e)}, 70%, 55%)`;const o=r.livenessCheckins[e]??0;if(o===0)return`hsl(${ir(e)}, 20%, 50%)`;const s=Math.floor(Date.now()/1e3)-o,a=r.livenessInterval;return s<=a?`hsl(${ir(e)}, 70%, 55%)`:s<=a*1.25?`hsl(${ir(e)}, 40%, 50%)`:"#94a3b8"}function du(){return{type:"FeatureCollection",features:Object.entries(ye).map(([e,t])=>({type:"Feature",properties:{pubkey:e,duress:yo.has(e),colour:$i(e)},geometry:{type:"Polygon",coordinates:[p0(t.lat,t.lon,Li(t.precision))]}}))}}const uu="5.19.0",m0=`https://unpkg.com/maplibre-gl@${uu}/dist/maplibre-gl.js`,y0=`https://unpkg.com/maplibre-gl@${uu}/dist/maplibre-gl.css`,g0="sha384-pEfbADcwebVj4NNOvWFLUkm+FiGTICE5bChpV647czG7OpSqcHNgxM8QawfAkbRO",b0="sha384-MGCxhspF/+ufueUgol3FDkiAYQbpSNRhBT0VWHJt64U8qIy9qlnXWx8LAbj6niPH";async function v0(){if(De)return De;try{const[t]=await Promise.all([Te(()=>import("./maplibre-gl-DFGd9893.js").then(n=>n.m),[],import.meta.url),Te(()=>Promise.resolve({}),__vite__mapDeps([0]),import.meta.url)]);return De=t,t}catch{}const e=document.createElement("link");return e.rel="stylesheet",e.href=y0,e.integrity=b0,e.crossOrigin="anonymous",document.head.appendChild(e),await new Promise((t,n)=>{const r=document.createElement("script");r.src=m0,r.integrity=g0,r.crossOrigin="anonymous",r.onload=()=>t(),r.onerror=n,document.head.appendChild(r)}),De=window.maplibregl,De}async function fu(e){const{groups:t,activeGroupId:n}=_();if(!n||!t[n]){te&&(te.remove(),te=null,go=!1),e.innerHTML="";return}const r=t[n],o=r.beaconPrecision??5;if(Object.keys(ye).length===0&&r.lastPositions)for(const[s,a]of Object.entries(r.lastPositions))ye[s]=a;if(!(te&&document.getElementById("beacon-map"))){e.innerHTML=`
    <section class="panel beacon-panel">
      <h3 class="panel__title">Location</h3>
      <p class="settings-hint" style="margin-bottom: 0.5rem;">Approximate location of group members. Circles show the geohash area — your exact position is never shared. In an emergency, full GPS precision is used so your group can help. Circles turn <span style="color: #f87171; font-weight: 500;">red</span> when an emergency signal is active.</p>
      <div class="beacon-map" id="beacon-map" style="height: 500px; border-radius: 8px;"></div>
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-top: 0.5rem; flex-wrap: wrap;">
        <button class="btn ${Ae!==null?"btn--primary":""}" id="beacon-toggle-btn" type="button">
          ${Ae!==null?"Sharing Location":"Share Location"}
        </button>
        <button class="btn btn--ghost" id="beacon-fit-btn" type="button" title="Zoom to fit all group members on the map">Fit All</button>
        ${Ae!==null?'<span class="settings-hint" style="margin: 0;">Your approximate area is visible to group members</span>':""}
      </div>
      <div style="margin-top: 0.75rem;">
        <span class="input-label">"I'm Alive" precision</span>
        <div class="segmented" id="beacon-precision-picker">
          ${h0.map(s=>`<button class="segmented__btn ${o===s.value?"segmented__btn--active":""}" data-beacon-precision="${s.value}" title="${s.hint}">${s.label}</button>`).join("")}
        </div>
        <p class="settings-hint">How precisely your location is shared in routine check-ins</p>
      </div>
      <p class="settings-hint" style="margin-top: 0.5rem; color: var(--duress);">Emergency signals always share your exact GPS so your group can find you.</p>
      <div class="beacon-list" id="beacon-list"></div>
    </section>
  `,e.querySelectorAll("[data-beacon-precision]").forEach(s=>{s.addEventListener("click",()=>{const a=Number(s.dataset.beaconPrecision),{activeGroupId:i}=_();i&&(J(i,{beaconPrecision:a}),Ae!==null&&(Ya(),Ss()),e.querySelectorAll("[data-beacon-precision]").forEach(c=>{c.classList.toggle("segmented__btn--active",Number(c.dataset.beaconPrecision)===a)}))})}),e.querySelector("#beacon-toggle-btn")?.addEventListener("click",()=>{Ae!==null?Ya():Ss(),fu(e)}),e.querySelector("#beacon-fit-btn")?.addEventListener("click",()=>{qn()});try{await v0(),w0()}catch{e.querySelector(".beacon-map").innerHTML='<p style="color: var(--text-muted); text-align: center; padding: 2rem;">Map unavailable offline</p>'}}}function w0(){const e=document.getElementById("beacon-map");if(!e||te||!De)return;const n=document.documentElement.dataset.theme!=="light"?"https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json":"https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";te=new De.Map({container:e,style:n,center:[-.1278,51.5074],zoom:12}),te.on("load",()=>{go=!0,console.info("[canary:beacon] map loaded, positions to catch up:",Object.keys(ye).length),te.addSource("geohash-circles",{type:"geojson",data:du()}),te.addLayer({id:"geohash-fill",type:"fill",source:"geohash-circles",paint:{"fill-color":["get","colour"],"fill-opacity":["case",["get","duress"],.35,.2]}}),te.addLayer({id:"geohash-stroke",type:"line",source:"geohash-circles",paint:{"line-color":["get","colour"],"line-width":2.5,"line-opacity":["case",["get","duress"],.9,.6]}});for(const[r,o]of Object.entries(ye))bo(r,o.lat,o.lon);Object.keys(ye).length>0&&qn()})}function Mi(){const{activeGroupId:e}=_();e&&J(e,{lastPositions:{...ye}})}function jn(){if(!te||!go)return;const e=te.getSource("geohash-circles");e&&e.setData(du())}function Ya(){Ae!==null&&(navigator.geolocation.clearWatch(Ae),Ae=null);const{identity:e}=_();e?.pubkey&&(delete ye[e.pubkey],delete Ni[e.pubkey],pt[e.pubkey]&&(pt[e.pubkey].remove(),delete pt[e.pubkey]),jn(),vo())}function Ss(){if(Ae!==null||!("geolocation"in navigator))return;const{groups:e,activeGroupId:t,identity:n}=_();if(!t||!e[t]||!n?.pubkey)return;const r=e[t],o=Ii(r.seed),s=r.beaconPrecision||5;Ae=navigator.geolocation.watchPosition(async a=>{const i=Ti(a.coords.latitude,a.coords.longitude,s),c=lu(i),l=c.lat,d=c.lon,u=await jd(o,i,s);n?.pubkey&&(Ni[n.pubkey]=u,ye[n.pubkey]={lat:l,lon:d,geohash:i,precision:s,timestamp:Math.floor(Date.now()/1e3)},bo(n.pubkey,l,d),jn(),qn(),vo(),Mi(),t&&ve(t,{type:"beacon",lat:l,lon:d,accuracy:Li(s),timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID()}))},a=>{console.warn("[canary:beacon] watchPosition error",a.code,a.message)},{enableHighAccuracy:!1,maximumAge:6e4,timeout:15e3})}function bo(e,t,n){if(!te||!De){console.warn("[canary:beacon] updateMapMarker skipped — map not ready",{map:!!te,maplibregl:!!De,pubkey:e.slice(0,8)});return}const r=$i(e),o=yo.has(e),s=hu(e),a=un(e),i=!!a?.picture,c=o?40:32;if(pt[e]){pt[e].setLngLat([n,t]);const l=pt[e].getElement(),d=l.querySelector(".beacon-dot");d&&(i||(d.style.background=r),d.style.width=`${c}px`,d.style.height=`${c}px`,d.style.borderColor=r,d.style.boxShadow=`0 0 10px ${r}80`,d.style.animation=o?"beacon-pulse 1s ease-in-out infinite":"none");const u=l.querySelector(".beacon-label");u&&(u.textContent=s)}else{const l=document.createElement("div");l.style.display="flex",l.style.flexDirection="column",l.style.alignItems="center",l.style.pointerEvents="none";let d;i?(d=document.createElement("img"),d.src=a.picture,d.style.objectFit="cover"):(d=document.createElement("div"),d.style.background=r),d.className="beacon-dot",d.style.width=`${c}px`,d.style.height=`${c}px`,d.style.borderRadius="50%",d.style.border=`3px solid ${r}`,d.style.boxShadow=`0 0 10px ${r}80`,d.style.zIndex="2",o&&(d.style.animation="beacon-pulse 1s ease-in-out infinite"),l.appendChild(d);const u=document.createElement("div");u.className="beacon-label",u.textContent=s,u.style.fontSize="11px",u.style.fontWeight="600",u.style.color="#fff",u.style.textShadow="0 1px 3px rgba(0,0,0,0.8)",u.style.marginTop="2px",u.style.whiteSpace="nowrap",l.appendChild(u),pt[e]=new De.Marker({element:l,anchor:"center"}).setLngLat([n,t]).addTo(te)}}function qn(){if(!te)return;const e=Object.values(ye);if(e.length===0)return;if(e.length===1){te.flyTo({center:[e[0].lon,e[0].lat],zoom:13});return}const t=e.map(r=>r.lon),n=e.map(r=>r.lat);te.fitBounds([[Math.min(...t),Math.min(...n)],[Math.max(...t),Math.max(...n)]],{padding:60,maxZoom:14})}function hu(e){const{groups:t,activeGroupId:n,identity:r}=_(),o=n?t[n]:null,s=r?.pubkey===e;let a;const i=o?.memberNames?.[e];return i&&i!=="You"&&(a=i),a||(a=Ri(e)),s?a?`${a} (you)`:"You":a||`${e.slice(0,8)}…`}function vo(){const e=document.getElementById("beacon-list");if(!e)return;const t=Object.entries(ye).map(([n,r])=>{const o=$i(n),s=hu(n),a=un(n),i=Math.floor(Date.now()/1e3)-r.timestamp,c=i<60?"just now":i<3600?`${Math.floor(i/60)}m ago`:`${Math.floor(i/3600)}h ago`;return`
      <div class="beacon-entry" style="display:flex;align-items:center;gap:0.5rem;padding:0.25rem 0;">
        ${a?.picture?`<img src="${j(a.picture)}" alt="" style="width:20px;height:20px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid ${o};" />`:`<span style="width:8px;height:8px;border-radius:50%;background:${o};flex-shrink:0;"></span>`}
        <span class="beacon-member" style="font-weight:500;">${j(s)}</span>
        <span class="beacon-geohash" style="color:var(--text-muted);font-size:0.8rem;">${j(r.geohash)}</span>
        <span style="color:var(--text-muted);font-size:0.75rem;margin-left:auto;">${j(c)}</span>
      </div>
    `}).join("");e.innerHTML=t||'<p class="settings-hint">No beacons yet — enable location to start</p>'}document.addEventListener("canary:duress",(e=>{const{members:t}=e.detail;if(!t?.length)return;for(const r of t)yo.add(r),E0(r);jn();const n=t.map(r=>ye[r]).filter(Boolean);if(te&&n.length===1)te.flyTo({center:[n[0].lon,n[0].lat],zoom:14});else if(te&&n.length>1){const r=n.map(s=>s.lon),o=n.map(s=>s.lat);te.fitBounds([[Math.min(...r),Math.min(...o)],[Math.max(...r),Math.max(...o)]],{padding:60})}}));function E0(e){const t=pt[e];if(!t)return;const n=t.getElement();n.style.background="#f87171",n.style.width="14px",n.style.height="14px",n.style.boxShadow="0 0 12px rgba(248, 113, 113, 0.6)"}function k0(){if(console.info("[canary:beacon] sendLocationPing called",{hasGeo:"geolocation"in navigator,map:!!te,mapReady:go}),!("geolocation"in navigator))return;const{groups:e,activeGroupId:t,identity:n}=_();if(!t||!e[t]||!n?.pubkey){console.warn("[canary:beacon] sendLocationPing: missing state",{activeGroupId:t,hasPubkey:!!n?.pubkey});return}const r=e[t],o=Ii(r.seed),s=r.beaconPrecision||5;Ae===null&&Ss(),navigator.geolocation.getCurrentPosition(async a=>{const i=Ti(a.coords.latitude,a.coords.longitude,s),c=lu(i),l=c.lat,d=c.lon,u=await jd(o,i,s);n?.pubkey&&(Ni[n.pubkey]=u,ye[n.pubkey]={lat:l,lon:d,geohash:i,precision:s,timestamp:Math.floor(Date.now()/1e3)},bo(n.pubkey,l,d),jn(),qn(),vo(),Mi(),t&&ve(t,{type:"beacon",lat:l,lon:d,accuracy:Li(s),timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID()}))},a=>{console.warn("[canary:beacon] getCurrentPosition FAILED",a.code,a.message),Te(async()=>{const{showToast:i}=await Promise.resolve().then(()=>_b);return{showToast:i}},void 0,import.meta.url).then(({showToast:i})=>{a.code===1?i("Location permission denied","error",3e3):a.code===3?i("Location request timed out","error",3e3):i("Could not get location","error",3e3)})},{enableHighAccuracy:!1,maximumAge:3e4,timeout:1e4})}function _0(e,t,n,r,o){const s=x0(r),a=Ti(t,n,s);ye[e]={lat:t,lon:n,geohash:a,precision:s,timestamp:o},bo(e,t,n),jn(),qn(),vo(),Mi()}function x0(e){return e<=3?9:e<=20?8:e<=80?7:e<=620?6:e<=2500?5:e<=2e4?4:e<=8e4?3:e<=63e4?2:1}function S0(e){return new Date(e*1e3).toISOString().slice(11,19)+" UTC"}function I0(e,t){return e<=t?"green":e<=t*1.25?"amber":"red"}function R0(e,t){return e<60?S0(t):e<3600?`${Math.floor(e/60)}m ago`:e<86400?`${Math.floor(e/3600)}h ago`:`${Math.floor(e/86400)}d ago`}const A0=[{label:"1h",value:3600},{label:"4h",value:14400},{label:"24h",value:86400},{label:"7d",value:604800}];function C0(e){const{groups:t,activeGroupId:n,identity:r}=_();if(!n||!t[n]){e.innerHTML="";return}const o=t[n],s=Math.floor(Date.now()/1e3),a=o.livenessInterval,i=o.members.map(d=>{const u=o.livenessCheckins[d]??0,f=u>0,h=f?s-u:1/0,p=f?I0(h,a):"grey",m=f?Math.max(0,Math.min(100,(1-h/a)*100)):0,g=r?.pubkey===d,b=o.memberNames?.[d],k=g?"You":b??`${d.slice(0,8)}…`;return`
      <li class="liveness-item liveness-item--${p}">
        <span class="liveness-dot liveness-dot--${p}"></span>
        <span class="liveness-name">${j(k)}</span>
        <span class="liveness-time">${f?R0(h,u):"awaiting first check-in"}</span>
        <div class="liveness-bar">
          <div class="liveness-bar__fill liveness-bar__fill--${p}" style="width: ${m}%"></div>
        </div>
      </li>
    `}).join(""),c=r?.pubkey!=null&&o.members.includes(r.pubkey),l=A0.map(d=>`<button class="segmented__btn ${a===d.value?"segmented__btn--active":""}" data-liveness-interval="${d.value}">${d.label}</button>`).join("");e.innerHTML=`
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
        ${i}
      </ul>
      ${c?`
        <button class="btn btn--primary" id="checkin-btn" type="button" title="Check in with your group and share your approximate location">I'm Alive</button>
      `:""}
    </section>
  `,e.querySelectorAll("[data-liveness-interval]").forEach(d=>{d.addEventListener("click",()=>{const u=Number(d.dataset.livenessInterval);J(n,{livenessInterval:u})})}),document.getElementById("checkin-btn")?.addEventListener("click",()=>{try{const{identity:d,activeGroupId:u,groups:f}=_();if(!d?.pubkey||!u){console.warn("[canary:liveness] No identity or activeGroupId",{pubkey:d?.pubkey,gid:u});return}const h=f[u];if(!h){console.warn("[canary:liveness] Group not found",u);return}const p=Math.floor(Date.now()/1e3),m=yt(p,h.rotationInterval);Og(h.seed,"canary:liveness",d.pubkey,m);const g={...h.livenessCheckins,[d.pubkey]:p};J(u,{livenessCheckins:g}),ve(u,{type:"liveness-checkin",pubkey:d.pubkey,timestamp:p,opId:crypto.randomUUID()}),k0(),setTimeout(()=>{document.getElementById("beacon-container")?.scrollIntoView({behavior:"smooth",block:"center"})},300),H("Check-in sent — location updated","success",2e3)}catch(d){console.error("[canary:liveness] Check-in failed:",d),H("Check-in failed","error",3e3)}})}function Za(e){if(e.startsWith("wss://"))return!0;if(e.startsWith("ws://"))try{const t=new URL(e);return t.hostname==="localhost"||t.hostname==="127.0.0.1"||t.hostname==="[::1]"}catch{return!1}return!1}let Vt=!1;function T0(e){const{groups:t,activeGroupId:n}=_();if(!n||!t[n]){e.innerHTML="";return}const r=t[n],{identity:o}=_(),s=!!o?.pubkey&&r.admins.includes(o.pubkey);e.innerHTML=`
    <div class="settings-drawer" id="settings-drawer">
      <button class="settings-toggle" id="settings-toggle">
        <span>Group Settings</span>
        <span class="settings-chevron" style="${Vt?"transform: rotate(90deg);":""}">&#9658;</span>
      </button>

      <div class="settings-body" id="settings-body"${Vt?"":" hidden"}>
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
                ${(r.writeRelays??[]).map((i,c)=>`
                  <li class="relay-item">
                    <span class="relay-url">${j(i)}</span>
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
                ${(r.readRelays??[]).map((i,c)=>`
                  <li class="relay-item">
                    <span class="relay-url">${j(i)}</span>
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
                ${jt()?`Connected to ${Ut()} relay${Ut()===1?"":"s"}`:"Not connected"}
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
  `,document.getElementById("settings-toggle").addEventListener("click",()=>{Vt=!Vt;const i=document.getElementById("settings-body"),c=e.querySelector(".settings-chevron");i.hidden=!Vt,c.style.transform=Vt?"rotate(90deg)":""}),document.getElementById("settings-name").addEventListener("change",i=>{const c=i.target.value.trim();c&&J(n,{name:c})}),e.querySelectorAll("[data-interval]").forEach(i=>{i.addEventListener("click",()=>{J(n,{rotationInterval:Number(i.dataset.interval)})})}),e.querySelectorAll("[data-words]").forEach(i=>{i.addEventListener("click",()=>{J(n,{wordCount:Number(i.dataset.words)})})}),e.querySelectorAll("[data-enc]").forEach(i=>{i.addEventListener("click",()=>{J(n,{encodingFormat:i.dataset.enc})})}),e.querySelectorAll("[data-tolerance]").forEach(i=>{i.addEventListener("click",()=>{J(n,{tolerance:Number(i.dataset.tolerance)})})}),e.querySelectorAll("[data-duress-mode]").forEach(i=>{i.addEventListener("click",()=>{J(n,{duressMode:i.dataset.duressMode})})}),document.getElementById("nostr-toggle").addEventListener("change",i=>{const c=i.target.checked;J(n,{nostrEnabled:c});const l=document.getElementById("nostr-settings");if(l.hidden=!c,c){const d=_().groups[n],u=d?.readRelays??[],f=d?.writeRelays??[];Ne(u,f,n).then(()=>{Qa()}),Xa()}else sn(),Id(),Ln(!1,0),Qa()});function a(){const i=_().groups[n];i?.nostrEnabled&&Ne(i.readRelays??[],i.writeRelays??[],n)}e.querySelectorAll(".write-relay-remove").forEach(i=>{i.addEventListener("click",()=>{const c=Number(i.dataset.relayIndex),l=[..._().groups[n]?.writeRelays??[]];l.splice(c,1),J(n,{writeRelays:l}),a()})}),e.querySelectorAll(".read-relay-remove").forEach(i=>{i.addEventListener("click",()=>{const c=Number(i.dataset.relayIndex),l=[..._().groups[n]?.readRelays??[]];l.splice(c,1),J(n,{readRelays:l}),a()})}),document.getElementById("write-relay-add-btn").addEventListener("click",()=>{const i=document.getElementById("write-relay-add-input"),c=i.value.trim();if(!Za(c)){i.focus();return}const l=[..._().groups[n]?.writeRelays??[]];l.includes(c)?i.value="":(l.push(c),J(n,{writeRelays:l}),i.value="",a())}),document.getElementById("read-relay-add-btn").addEventListener("click",()=>{const i=document.getElementById("read-relay-add-input"),c=i.value.trim();if(!Za(c)){i.focus();return}const l=[..._().groups[n]?.readRelays??[]];l.includes(c)?i.value="":(l.push(c),J(n,{readRelays:l}),i.value="",a())}),document.getElementById("write-relay-add-input").addEventListener("keydown",i=>{i.key==="Enter"&&document.getElementById("write-relay-add-btn").click()}),document.getElementById("read-relay-add-input").addEventListener("keydown",i=>{i.key==="Enter"&&document.getElementById("read-relay-add-btn").click()}),r.nostrEnabled&&Xa(),document.getElementById("reseed-btn")?.addEventListener("click",()=>{const{groups:i}=_(),c=i[n],d=(c?On(c)==="online":!1)?"Rotate the group key? This broadcasts the new key to all members via the relay.":"Rotate the group key? Remaining members will need to re-sync via Share State.";confirm(d)&&(Zb(n),H("Key rotated. New verification words are active.","warning",6e3))}),document.getElementById("compromise-reseed-btn")?.addEventListener("click",()=>{confirm("Compromise reseed? This generates a new key WITHOUT broadcasting. All members will need new invites.")&&(Xb(n),H("Emergency reseed complete. No broadcast sent — share new invites with all members.","warning",8e3))}),document.getElementById("dissolve-btn").addEventListener("click",()=>{confirm(`Dissolve "${r.name}"? This cannot be undone.`)&&Yb(n)}),document.getElementById("export-btn").addEventListener("click",()=>{if(!confirm("This exports the group secret in cleartext. Treat the file like a password."))return;const i=new Blob([JSON.stringify(r,null,2)],{type:"application/json"}),c=URL.createObjectURL(i),l=document.createElement("a");l.href=c,l.download=`canary-${r.name.toLowerCase().replace(/\s+/g,"-")}.json`,l.click(),URL.revokeObjectURL(c)}),document.getElementById("import-btn").addEventListener("click",()=>{if(!confirm("Only import files from trusted sources — the file contains the group secret."))return;const i=document.createElement("input");i.type="file",i.accept=".json",i.addEventListener("change",async()=>{const c=i.files?.[0];if(c)try{const l=await c.text(),d=JSON.parse(l);tv(d);const u=crypto.randomUUID(),f={id:u,name:String(d.name),seed:String(d.seed),members:d.members.filter(p=>typeof p=="string"),memberNames:{},nostrEnabled:!1,relays:[],wordlist:typeof d.wordlist=="string"?d.wordlist:"en-v1",wordCount:[1,2,3].includes(d.wordCount)?d.wordCount:2,counter:typeof d.counter=="number"&&d.counter>=0?d.counter:0,usageOffset:typeof d.usageOffset=="number"&&d.usageOffset>=0?d.usageOffset:0,rotationInterval:typeof d.rotationInterval=="number"&&d.rotationInterval>0?d.rotationInterval:86400,encodingFormat:["words","pin","hex"].includes(d.encodingFormat)?d.encodingFormat:"words",usedInvites:[],latestInviteIssuedAt:0,livenessInterval:typeof d.rotationInterval=="number"&&d.rotationInterval>0?d.rotationInterval:86400,livenessCheckins:{},tolerance:typeof d.tolerance=="number"&&d.tolerance>=0&&d.tolerance<=10?d.tolerance:1,beaconInterval:typeof d.beaconInterval=="number"&&d.beaconInterval>0?d.beaconInterval:60,beaconPrecision:typeof d.beaconPrecision=="number"&&d.beaconPrecision>0?d.beaconPrecision:5,duressPrecision:typeof d.duressPrecision=="number"&&d.duressPrecision>0?d.duressPrecision:9,duressMode:["immediate","dead-drop","both"].includes(d.duressMode)?d.duressMode:"immediate",createdAt:typeof d.createdAt=="number"?d.createdAt:Math.floor(Date.now()/1e3),admins:Array.isArray(d.admins)?d.admins.filter(p=>typeof p=="string"):[],epoch:typeof d.epoch=="number"&&d.epoch>=0?d.epoch:0,consumedOps:Array.isArray(d.consumedOps)?d.consumedOps.filter(p=>typeof p=="string"):[]},{groups:h}=_();ee({groups:{...h,[u]:f},activeGroupId:u})}catch{alert("Could not import group file. Check the file format.")}}),i.click()})}function Xa(){const e=document.getElementById("nostr-identity");if(!e)return;const{identity:t}=_();if(!t?.pubkey){e.innerHTML='<span class="settings-hint">No identity available.</span>';return}const n=`${t.pubkey.slice(0,8)}…${t.pubkey.slice(-8)}`;e.innerHTML=`
    <div class="nostr-identity-row">
      <span class="input-label">Identity (Local key)</span>
      <span class="relay-url nostr-pubkey" title="${j(t.pubkey)}">${j(n)}</span>
    </div>
    <p class="settings-hint">Your identity is stored locally on this device.</p>
  `}function Qa(){const e=document.getElementById("nostr-conn-status");if(!e)return;const t=Ut();e.textContent=jt()?`Connected to ${t} relay${t===1?"":"s"}`:"Not connected"}new TextEncoder;function pu(){const e=new Uint8Array(32);return crypto.getRandomValues(e),e}const Mn=Object.freeze({call:Object.freeze({wordCount:1,rotationSeconds:30,tolerance:1,directional:!0,description:"Phone verification for insurance, banking, and call centres. Single word with 30-second rotation. Deepfake-proof — cloning a voice does not help derive the current word."}),handoff:Object.freeze({wordCount:1,rotationSeconds:0,tolerance:0,directional:!0,description:"Physical handoff verification for rideshare, delivery, and task completion. Single-use token per event. No time dependency — counter is the task/event ID."})});function Is(e){const t=e.preset?Mn[e.preset]:void 0,n=e.rotationSeconds??t?.rotationSeconds??30,r=e.tolerance??t?.tolerance??0,o=t?.wordCount??1,s=e.encoding??{format:"words",count:o};if(e.roles[0]===e.roles[1])throw new Error(`Roles must be distinct, got ["${e.roles[0]}", "${e.roles[1]}"]`);if(e.myRole!==e.roles[0]&&e.myRole!==e.roles[1])throw new Error(`myRole "${e.myRole}" is not one of the configured roles ["${e.roles[0]}", "${e.roles[1]}"]`);if(!Number.isInteger(n)||n<0)throw new RangeError(`rotationSeconds must be a non-negative integer, got ${n}`);if(!Number.isInteger(r)||r<0)throw new RangeError(`tolerance must be a non-negative integer, got ${r}`);if(r>vt)throw new RangeError(`tolerance must be <= ${vt}, got ${r}`);if(n===0&&e.counter===void 0)throw new Error("Fixed counter mode (rotationSeconds=0) requires config.counter");if(n===0&&e.counter!==void 0&&(!Number.isInteger(e.counter)||e.counter<0||e.counter>4294967295))throw new RangeError(`counter must be an integer 0–${4294967295}, got ${e.counter}`);if(n>0&&e.counter!==void 0)throw new Error("counter must not be set when rotationSeconds > 0 (counter is derived from time)");const a=typeof e.secret=="string"?G(e.secret):e.secret,i=e.roles[0]===e.myRole?e.roles[1]:e.roles[0],c=`${e.namespace}:${e.myRole}`,l=`${e.namespace}:${i}`,d=n===0;function u(f){if(d){if(e.counter===void 0)throw new Error("Fixed counter mode (rotationSeconds=0) requires config.counter");return e.counter}const h=f??Math.floor(Date.now()/1e3);return Math.floor(h/n)}return{counter:u,myToken(f){return Le(a,c,u(f),s)},theirToken(f){return Le(a,l,u(f),s)},verify(f,h){const p=[];return e.theirIdentity&&p.push(e.theirIdentity),ms(a,l,u(h),f,p,{encoding:s,tolerance:r})},pair(f){return Bg(a,e.namespace,e.roles,u(f),s)}}}const kn={insurance:{label:"Insurance",namespace:"aviva",roles:["caller","agent"],preset:"call"},pickup:{label:"Pickup",namespace:"family",roles:["child","adult"],preset:"handoff"},rideshare:{label:"Rideshare",namespace:"dispatch",roles:["requester","driver"],preset:"handoff",encoding:"pin"}};let Oi=pu(),X=kn.insurance,zt,gr,br=null,Bi=1;function Rs(){const e=X.preset==="handoff",t=X.encoding==="pin"?{format:"pin",digits:4}:void 0,n={secret:Oi,namespace:X.namespace,roles:X.roles,preset:X.preset,...e?{counter:Bi}:{},...t?{encoding:t}:{}};zt=Is({...n,myRole:X.roles[0],theirIdentity:X.roles[1]}),gr=Is({...n,myRole:X.roles[1],theirIdentity:X.roles[0]})}Rs();function ar(e,t){const n=X.preset==="handoff",r=Mn[X.preset],o=n?Bi:Math.floor((t??Math.floor(Date.now()/1e3))/r.rotationSeconds),s=`${X.namespace}:${e}`,a=X.encoding==="pin"?{format:"pin",digits:4}:{format:"words",count:1};return io(Oi,s,e,o,a,r.tolerance)}function vr(){br!==null&&(clearInterval(br),br=null)}function cr(e){if(e<=0)return"0s";const t=Math.floor(e/60),n=Math.floor(e%60);return t>0?`${t}m ${n}s`:`${n}s`}function ec(e){if(e===0)return 0;const t=Math.floor(Date.now()/1e3),r=(Math.floor(t/e)+1)*e;return Math.max(0,r-t)}function wr(e){vr();const t=Math.floor(Date.now()/1e3),n=X.preset==="handoff",r=n?0:Mn[X.preset].rotationSeconds,o=ec(r),s=r>0?Math.min(100,(r-o)/r*100):100,a=X.roles[0],i=X.roles[1];e.innerHTML=`
    <div class="call-sim">
      <div class="call-sim__header">
        <h2 class="call-sim__title">CANARY Call Verification Demo</h2>
        <div class="call-sim__scenarios" id="call-scenarios">
          ${Object.entries(kn).map(([m,g])=>`<button class="btn call-sim__scenario-btn${X===g?" call-sim__scenario-btn--active":""}" data-scenario="${m}">${g.label}</button>`).join("")}
        </div>
      </div>

      <div class="call-sim__panels">
        <div class="call-sim__panel call-sim__panel--caller">
          <h3 class="call-sim__role">${a.toUpperCase()}</h3>
          <div class="call-sim__token-group">
            <span class="call-sim__label">Your code — tap to reveal:</span>
            <div class="call-sim__token call-sim__token--reveal" id="caller-reveal" data-real="${zt.myToken(t)}" data-alt="${ar(a,t)}">••••••••</div>
          </div>
          ${n?'<span class="call-sim__countdown">Single-use</span>':`
          <div class="call-sim__progress"><div class="call-sim__progress-bar" id="caller-progress" style="width: ${s}%"></div></div>
          <span class="call-sim__countdown" id="caller-countdown">${cr(o)}</span>
          `}
          <div class="call-sim__verify">
            <input type="text" class="input call-sim__input" id="caller-verify-input" placeholder="Type ${i}'s word..." autocomplete="off" />
            <button class="btn btn--primary call-sim__verify-btn" id="caller-verify-btn">Verify</button>
          </div>
          <div class="call-sim__result" id="caller-result" hidden></div>
        </div>

        <div class="call-sim__divider"></div>

        <div class="call-sim__panel call-sim__panel--agent">
          <h3 class="call-sim__role">${i.toUpperCase()}</h3>
          <div class="call-sim__token-group">
            <span class="call-sim__label">Your code — tap to reveal:</span>
            <div class="call-sim__token call-sim__token--reveal" id="agent-reveal" data-real="${gr.myToken(t)}" data-alt="${ar(i,t)}">••••••••</div>
          </div>
          ${n?'<span class="call-sim__countdown">Single-use</span>':`
          <div class="call-sim__progress"><div class="call-sim__progress-bar" id="agent-progress" style="width: ${s}%"></div></div>
          <span class="call-sim__countdown" id="agent-countdown">${cr(o)}</span>
          `}
          <div class="call-sim__verify">
            <input type="text" class="input call-sim__input" id="agent-verify-input" placeholder="Type ${a}'s word..." autocomplete="off" />
            <button class="btn btn--primary call-sim__verify-btn" id="agent-verify-btn">Verify</button>
          </div>
          <div class="call-sim__result" id="agent-result" hidden></div>
        </div>
      </div>

      <div class="call-sim__banner call-sim__banner--valid" id="call-verified-banner" hidden></div>

      <div class="call-sim__footer">
        <span class="call-sim__meta">Namespace: <strong>${X.namespace}</strong></span>
        <span class="call-sim__meta">Rotation: <strong>${n?"single-use":r+"s"}</strong></span>
        <span class="call-sim__meta">Encoding: <strong>${X.encoding??"words"}</strong></span>
        <span class="call-sim__meta">Tolerance: <strong>+/-${n?"0":Mn[X.preset].tolerance}</strong></span>
        <button class="btn" id="call-reset-seed">Reset seed</button>
      </div>

      <div class="call-sim__pair" id="call-pair">
        <span class="call-sim__meta">Pair: <code id="pair-display"></code></span>
      </div>
    </div>
  `,e.querySelector("#call-scenarios")?.addEventListener("click",m=>{const g=m.target.closest("[data-scenario]");if(!g)return;const b=g.dataset.scenario;kn[b]&&kn[b]!==X&&(X=kn[b],Rs(),wr(e))}),e.querySelector("#call-reset-seed")?.addEventListener("click",()=>{Oi=pu(),X.preset==="handoff"&&Bi++,Rs(),wr(e)});let c=!1,l=!1,d=!1;function u(){if(!d&&c&&l){vr();const m=e.querySelector("#call-verified-banner");m&&(m.hidden=!1,m.textContent="Call Verified — both parties authenticated"),e.querySelectorAll(".call-sim__progress, .call-sim__countdown").forEach(g=>{g.hidden=!0})}}function f(m,g,b,k,T){const $=e.querySelector(`#${m}`),O=e.querySelector(`#${g}`),N=e.querySelector(`#${b}`);if(!$||!O||!N)return;function w(){const v=$.value.trim();if(!v)return;const y=k.verify(v);N.hidden=!1,N.className="call-sim__result",y.status==="valid"?(N.classList.add("call-sim__result--valid"),N.textContent="Verified ✓",T==="caller"?c=!0:l=!0,u()):y.status==="duress"?(N.classList.add("call-sim__result--invalid"),N.textContent="Failed ✗",d=!0):(N.classList.add("call-sim__result--invalid"),N.textContent="Failed ✗")}O.addEventListener("click",w),$.addEventListener("keydown",v=>{v.key==="Enter"&&w()})}f("caller-verify-input","caller-verify-btn","caller-result",zt,"caller"),f("agent-verify-input","agent-verify-btn","agent-result",gr,"agent");function h(m){const g=e.querySelector(`#${m}`);if(!g)return;function b(T){T.preventDefault();const $=g.getBoundingClientRect(),O=T.clientX-$.left;g.textContent=O<$.width/2?g.dataset.real:g.dataset.alt}function k(){g.textContent="••••••••"}g.addEventListener("pointerdown",b),g.addEventListener("pointerup",k),g.addEventListener("pointerleave",k),g.addEventListener("pointercancel",k)}h("caller-reveal"),h("agent-reveal");const p=e.querySelector("#pair-display");if(p){const m=zt.pair(t),g=Object.entries(m).map(([b,k])=>`${b}: ${k}`).join(" | ");p.textContent=g}!n&&r>0&&(br=setInterval(()=>{const m=ec(r),g=Math.min(100,(r-m)/r*100),b=e.querySelector("#caller-progress"),k=e.querySelector("#agent-progress"),T=e.querySelector("#caller-countdown"),$=e.querySelector("#agent-countdown"),O=Math.max(0,100-g),N=O>50?`hsl(${Math.round(120*(O/100))}, 70%, 45%)`:`hsl(${Math.round(120*(O/100))}, 80%, 45%)`;b&&(b.style.width=`${g}%`,b.style.background=N),k&&(k.style.width=`${g}%`,k.style.background=N),T&&(T.textContent=cr(m)),$&&($.textContent=cr(m));const w=Math.floor(Date.now()/1e3),v=e.querySelector("#caller-reveal"),y=e.querySelector("#agent-reveal"),S=zt.myToken(w),I=v&&v.dataset.real!==S;if(v&&(v.dataset.real=S,v.dataset.alt=ar(a,w)),y&&(y.dataset.real=gr.myToken(w),y.dataset.alt=ar(i,w)),I){c=!1,l=!1,d=!1;const E=e.querySelector("#caller-result"),R=e.querySelector("#agent-result");E&&(E.hidden=!0,E.className="call-sim__result"),R&&(R.hidden=!0,R.className="call-sim__result");const x=e.querySelector("#caller-verify-input"),L=e.querySelector("#agent-verify-input");x&&(x.value=""),L&&(L.value="");const C=e.querySelector("#call-verified-banner");C&&(C.hidden=!0),e.querySelectorAll(".call-sim__progress, .call-sim__countdown").forEach(M=>{M.hidden=!1})}const A=e.querySelector("#pair-display");if(A){const E=zt.pair(),R=Object.entries(E).map(([x,L])=>`${x}: ${L}`).join(" | ");A.textContent=R}m===0&&(vr(),wr(e))},1e3))}function L0(){vr()}let _t=null;function N0(e,t){const n=_().groups[t];if(!n)return e.slice(0,8);const{identity:r}=_();if(r?.pubkey===e)return"You";const o=n.memberNames?.[e];return o||`${e.slice(0,8)}…${e.slice(-4)}`}function $0(e,t){_t&&(_t(),_t=null),document.querySelector(".call-verify")?.remove();const{groups:n,identity:r}=_(),o=n[e];if(!o||!r)return;const s=r.pubkey,a=N0(t,e),i=un(t),c=s<t?[s,t]:[t,s],l=Is({secret:o.seed,namespace:"canary:call",roles:c,myRole:s,preset:"call"}),d=Mn.call.rotationSeconds,u=Math.floor(Date.now()/1e3),f=l.myToken(u),h=l.theirToken(u),p=document.createElement("div");p.className="call-verify",p.innerHTML=`
    <div class="call-verify__content">
      ${i?.picture?`<img class="call-verify__avatar" src="${j(i.picture)}" alt="" />`:""}
      <h2 class="call-verify__title">Call with ${j(a)}</h2>
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
  `;let m=null;function g(){const $=Math.floor(Date.now()/1e3),O=p.querySelector("#cv-word-mine"),N=p.querySelector("#cv-word-theirs"),w=p.querySelector("#cv-countdown");if(O&&(O.textContent=l.myToken($)),N&&(N.textContent=l.theirToken($)),w){const v=$%d;w.textContent=String(d-v)}}m=setInterval(g,1e3);function b(){m!==null&&(clearInterval(m),m=null)}function k(){_t&&(_t(),_t=null),p.classList.remove("call-verify--visible"),setTimeout(()=>p.remove(),300)}function T($){$.key==="Escape"&&k()}_t=()=>{b(),document.removeEventListener("keydown",T)},document.body.appendChild(p),requestAnimationFrame(()=>p.classList.add("call-verify--visible")),document.addEventListener("keydown",T),p.querySelector("#cv-match")?.addEventListener("click",()=>{b(),p.innerHTML=`
      <div class="call-verify__content">
        <h2 class="call-verify__title" style="color: var(--clr-success, #27ae60);">Call Verified</h2>
        <p class="call-verify__warning" style="color: var(--text-secondary);">${j(a)} is who they say they are. The call is authenticated.</p>
        <div class="call-verify__actions">
          <button class="btn btn--primary call-verify__btn" id="cv-dismiss-ok">Done</button>
        </div>
      </div>
    `,p.querySelector("#cv-dismiss-ok")?.addEventListener("click",k)}),p.querySelector("#cv-close")?.addEventListener("click",k),p.querySelector("#cv-mismatch")?.addEventListener("click",()=>{b(),p.innerHTML=`
      <div class="call-verify__content">
        <h2 class="call-verify__title" style="color: var(--clr-danger, #e74c3c);">Verification Failed</h2>
        <p class="call-verify__warning">The word didn't match. This person may not be who they claim to be.</p>
        <div class="call-verify__actions">
          <button class="btn call-verify__btn" id="cv-dismiss-fail">Dismiss</button>
        </div>
      </div>
    `,p.querySelector("#cv-dismiss-fail")?.addEventListener("click",k)})}const mu=30078,yu="canary:vault",M0=2160*60*60;function Pi(e){const t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function O0(e){const t={};for(const[r,o]of Object.entries(e)){const{lastPositions:s,...a}=o;t[r]={...a,livenessCheckins:{}}}return JSON.stringify({version:1,groups:t})}function tc(e){try{const t=JSON.parse(e);return!t||typeof t!="object"||typeof t.groups!="object"||t.groups===null?{}:t.groups}catch{return{}}}function B0(e,t,n){const r=Pi(t),o=be(r,n);return Bt(e,o)}function nc(e,t,n){try{const r=Pi(t),o=be(r,n);return Pt(e,o)}catch{return null}}function P0(e,t){const n=Pi(t),r=Math.floor(Date.now()/1e3),o={kind:mu,created_at:r,tags:[["d",yu],["expiration",String(r+M0)]],content:e};return nt(o,n)}async function gu(e,t,n){const r=de();if(!r)throw new Error("No relay pool — connect first");const o=Ad();if(o.length===0)throw new Error("No write relays configured");const s=O0(e),a=B0(s,t,n),i=P0(a,t);document.dispatchEvent(new CustomEvent("canary:vault-syncing")),await Promise.allSettled(r.publish(o,i)),document.dispatchEvent(new CustomEvent("canary:vault-synced",{detail:{timestamp:Math.floor(Date.now()/1e3)}}))}async function U0(e,t){const n=de();if(!n)return null;const r=Rd();return r.length===0?null:new Promise(o=>{let s=!1,a=null;const i=setTimeout(()=>{if(!s){if(s=!0,c.close(),a){const l=nc(a.content,e,t);if(l){o(tc(l));return}}o(null)}},1e4),c=n.subscribeMany(r,{kinds:[mu],authors:[t],"#d":[yu],limit:1},{onevent(l){(!a||l.created_at>a.created_at)&&(a=l)},oneose(){if(!s){if(s=!0,clearTimeout(i),c.close(),a){const l=nc(a.content,e,t);if(l){o(tc(l));return}}o(null)}}})})}function D0(e,t){const n={...e};for(const[r,o]of Object.entries(t)){const s=e[r];if(!s){n[r]=o;continue}const a=s.epoch??0,i=o.epoch??0;if(i>a)n[r]=o;else if(i===a){const c=s.counter??0;(o.counter??0)>c&&(n[r]=o)}}return n}function j0(e){if(e.startsWith("wss://"))return!0;if(e.startsWith("ws://"))try{const t=new URL(e);return t.hostname==="localhost"||t.hostname==="127.0.0.1"||t.hostname==="[::1]"}catch{return!1}return!1}function As(e,t){return t?.pubkey===e.pubkey&&t.mnemonic?{...e,mnemonic:t.mnemonic}:e}function bu(e,t){return e?typeof t.epoch=="number"&&t.epoch<e.epoch?"This invite is older than the group state already stored on this device.":typeof t.latestInviteIssuedAt=="number"&&e.latestInviteIssuedAt>0&&t.latestInviteIssuedAt<e.latestInviteIssuedAt?"A newer invite has already been accepted for this group on this device.":typeof t.epoch=="number"&&t.epoch===e.epoch&&typeof t.counter=="number"&&t.counter<e.counter?"This invite would roll the group back to an older counter.":null:null}yg();const q0=fg();q0.theme==="light"?document.documentElement.setAttribute("data-theme","light"):document.documentElement.removeAttribute("data-theme");let Lt=null;function An(){Lt!==null&&(clearTimeout(Lt),Lt=null);const{settings:e}=_();!e.pinEnabled||e.autoLockMinutes<=0||!cd()||(Lt=setTimeout(()=>{ro(),Ui()},e.autoLockMinutes*60*1e3))}function vu(){document.addEventListener("pointerdown",An,{passive:!0}),document.addEventListener("keydown",An,{passive:!0}),An()}function wu(){document.removeEventListener("pointerdown",An),document.removeEventListener("keydown",An),Lt!==null&&(clearTimeout(Lt),Lt=null)}function Ui(){wu(),sn();const e=document.getElementById("app");e.innerHTML=`
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
  `;const t=document.getElementById("pin-input"),n=document.getElementById("pin-error"),r=document.getElementById("pin-submit");let o=0;const s=[0,1e3,2e3,5e3,15e3,3e4];async function a(){const i=t.value.trim();if(i.length<6){n.textContent="PIN must be at least 6 digits.",n.hidden=!1,t.focus();return}r.disabled=!0,r.textContent="Unlocking…",n.hidden=!0;try{await hg(i),await V0(),Eu();const c=document.getElementById("header");c&&_i(c),ku(),ji(),Er(Di),vu(),_u(),qr(),window.addEventListener("hashchange",()=>qr()),Hr()}catch{o++;const c=s[Math.min(o,s.length-1)];n.textContent=c>0?`Incorrect PIN. Wait ${c/1e3}s before retrying.`:"Incorrect PIN. Try again.",n.hidden=!1,t.value="",r.disabled=!0,r.textContent="Unlock",c>0?setTimeout(()=>{r.disabled=!1,t.focus()},c):(r.disabled=!1,t.focus())}}r.addEventListener("click",()=>{a()}),t.addEventListener("keydown",i=>{i.key==="Enter"&&a()}),requestAnimationFrame(()=>t.focus())}function Eu(){const e=document.getElementById("app");if(!e)throw new Error("Missing #app mount point");e.innerHTML=`
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
  `}function ku(){const e=document.getElementById("hamburger"),t=document.getElementById("sidebar"),n=document.getElementById("sidebar-overlay");if(!e||!t||!n)return;function r(){t.classList.add("sidebar--open"),n.classList.add("sidebar-overlay--visible"),e.setAttribute("aria-expanded","true")}function o(){t.classList.remove("sidebar--open"),n.classList.remove("sidebar-overlay--visible"),e.setAttribute("aria-expanded","false")}e.setAttribute("aria-expanded","false"),e.addEventListener("click",()=>{t.classList.contains("sidebar--open")?o():r()}),n.addEventListener("click",()=>{o()}),t.addEventListener("click",s=>{s.target.closest("[data-group-id]")&&o()})}let zo=!1;function Di(){zo||(zo=!0,requestAnimationFrame(()=>{zo=!1,ji()}))}function ji(){const{view:e}=_(),t=document.getElementById("groups-view"),n=document.getElementById("call-demo-view");t&&(t.hidden=e!=="groups"),n&&(n.hidden=e!=="call-demo");const r=document.getElementById("header");if(r&&_i(r),e==="groups"){L0();const o=document.getElementById("welcome-container");o&&nv(o);const s=document.getElementById("sidebar");s&&Fb(s);const a=document.getElementById("hero-container");a&&Hd(a);const i=document.getElementById("verify-container");i&&hv(i);const c=document.getElementById("members-container");c&&au(c);const l=_().groups[_().activeGroupId??""],d=l?On(l)==="online":!1,u=document.getElementById("beacon-container");u&&(d?(u.hidden=!1,fu(u)):(u.hidden=!0,u.innerHTML=""));const f=document.getElementById("liveness-container");f&&(d?(f.hidden=!1,C0(f)):(f.hidden=!0,f.innerHTML=""));const h=document.getElementById("settings-container");h&&T0(h)}else if(e==="call-demo"){const o=document.getElementById("call-simulation-container");o&&wr(o)}}function H0(){const{identity:e}=_(),t=e?.displayName&&e.displayName!=="You"?e.displayName:"";Si(`
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
  `,r=>{const o=r.get("name")?.trim()??"";if(!o)return;const s=t||r.get("myname")?.trim()||"",i=document.querySelector(".segmented__btn.segmented__btn--active[data-preset]")?.dataset.preset??"family",c=Jb(o,i,e?.pubkey);if(s&&e?.pubkey){const d=_().groups[c];d&&J(c,{memberNames:{...d.memberNames,[e.pubkey]:s}})}const l=_().groups[c];l&&On(l)==="online"&&Ru(l).length>0&&Ne(l.readRelays??[],l.writeRelays??[],c),Hn()}),requestAnimationFrame(()=>{document.getElementById("modal-cancel-btn")?.addEventListener("click",()=>{document.getElementById("app-modal")?.close()}),document.querySelectorAll(".segmented__btn[data-preset]").forEach(r=>{r.addEventListener("click",()=>{document.querySelectorAll(".segmented__btn[data-preset]").forEach(o=>o.classList.remove("segmented__btn--active")),r.classList.add("segmented__btn--active")})})})}function qr(){const e=window.location.hash;if(e.startsWith("#ack/")){let t;try{t=decodeURIComponent(e.slice(5))}catch{console.warn("[canary] Malformed ack fragment — ignoring."),window.location.hash="";return}window.location.hash="",document.dispatchEvent(new CustomEvent("canary:confirm-member",{detail:{token:t}}))}else if(e.startsWith("#inv/")){const t=e.slice(5);window.location.hash="",F0(t)}else if(e.startsWith("#j/")){const t=e.slice(3);window.location.hash="",/^[0-9a-f]{32}$/.test(t)?G0(t):H("Invalid invite link.","error")}else if(e.startsWith("#remote/")){let t=e.slice(8);try{t=decodeURIComponent(t)}catch{}window.location.hash="",K0(t)}}function F0(e){try{const t=yv(e),n=qv(t),{identity:r}=_();if(!r?.pubkey){H("No local identity — create or import one first.","error");return}let o=document.getElementById("binary-join-modal");o||(o=document.createElement("dialog"),o.id="binary-join-modal",o.className="modal",document.body.appendChild(o),o.addEventListener("click",a=>{a.target===o&&o.close()}));const s=o;s.innerHTML=`
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
    `,s.querySelector("#binary-join-cancel")?.addEventListener("click",()=>s.close()),s.querySelector("#binary-join-accept")?.addEventListener("click",()=>{const a=s.querySelector("#binary-join-confirm"),i=s.querySelector("#binary-join-error"),c=a?.value.trim()??"";if(!c){i&&(i.textContent="Please enter the confirmation words.",i.style.display="");return}try{const l=Gd(n),d=Cv(l,c);if(Tv(d.groupId,d.nonce))throw new Error("This invite has already been used.");const u=d.groupId,{groups:f}=_(),h=bu(f[u],{epoch:d.epoch,counter:d.counter,latestInviteIssuedAt:d.issuedAt});if(h)throw new Error(h);const p=new Set(d.members);p.add(r.pubkey);const m=_().settings,g=d.relays.length>0?d.relays:m.defaultWriteRelays?.length?[...m.defaultWriteRelays]:[qe],b=Array.from(new Set([...m.defaultReadRelays?.length?m.defaultReadRelays:et,...g])),k=g.length>0,T={id:u,name:d.groupName,seed:d.seed,members:Array.from(p),memberNames:d.memberNames??{},nostrEnabled:k,relays:d.relays,readRelays:b,writeRelays:g,wordlist:d.wordlist,wordCount:d.wordCount,counter:d.counter,usageOffset:d.usageOffset,rotationInterval:d.rotationInterval,encodingFormat:d.encodingFormat,usedInvites:[d.nonce],latestInviteIssuedAt:d.issuedAt,beaconInterval:d.beaconInterval,beaconPrecision:d.beaconPrecision,duressMode:"immediate",livenessInterval:d.rotationInterval,livenessCheckins:{},tolerance:d.tolerance,createdAt:Math.floor(Date.now()/1e3),admins:[...d.admins],epoch:d.epoch,consumedOps:[]},$={...f,[u]:T};ee({groups:$,activeGroupId:u}),Lv(u,d.nonce),gi(),Hn(),k&&r&&Ne(b,g,u).then(()=>{ve(u,{type:"member-join",pubkey:r.pubkey,displayName:r.displayName&&r.displayName!=="You"?r.displayName:void 0,timestamp:Math.floor(Date.now()/1e3),epoch:d.epoch,opId:crypto.randomUUID()})}),s.close(),H(`Joined ${d.groupName}`,"success")}catch(l){i&&(i.textContent=l instanceof Error?l.message:"Failed to join group.",i.style.display="")}}),s.showModal()}catch(t){H(t instanceof Error?t.message:"Invalid QR invite.","error")}}function Cs(e,t,n){const{identity:r}=_();if(!r?.pubkey||!r?.privkey)return;const o=wv({envelope:e,joinerPrivkey:r.privkey,adminPubkey:t.adminPubkey,expectedInviteId:t.inviteId}),s=o.groupId,{groups:a}=_(),i=bu(a[s],{epoch:o.epoch,counter:o.counter});if(i)throw new Error(i);const c=new Set(o.members);c.add(r.pubkey);const l={...o.memberNames??{}};r.displayName&&r.displayName!=="You"&&(l[r.pubkey]=r.displayName);const d=[...o.relays??[]],u=d.length>0?d:[qe],f=Array.from(new Set([...et,...u])),h=u.length>0,p={id:s,name:o.groupName,seed:o.seed,members:Array.from(c),memberNames:l,nostrEnabled:h,relays:d,readRelays:f,writeRelays:u,wordlist:o.wordlist,wordCount:o.wordCount,counter:o.counter,usageOffset:o.usageOffset,rotationInterval:o.rotationInterval,encodingFormat:o.encodingFormat,usedInvites:[],latestInviteIssuedAt:0,beaconInterval:o.beaconInterval,beaconPrecision:o.beaconPrecision,duressMode:"immediate",livenessInterval:o.rotationInterval,livenessCheckins:{},tolerance:o.tolerance,createdAt:Math.floor(Date.now()/1e3),admins:[...o.admins],epoch:o.epoch,consumedOps:[]},m={...a,[s]:p};ee({groups:m,activeGroupId:s}),gi(),Hn(),h&&r&&Ne(f,u,s).then(()=>{ve(s,{type:"member-join",pubkey:r.pubkey,displayName:r.displayName&&r.displayName!=="You"?r.displayName:void 0,timestamp:Math.floor(Date.now()/1e3),epoch:o.epoch,opId:crypto.randomUUID()})}),n.close(),H(`Joined ${o.groupName}`,"success")}function G0(e){const{identity:t,settings:n}=_();if(!t?.pubkey||!t?.privkey){H("No local identity — create or import one first.","error");return}const r=Array.from(new Set([...et,...n.defaultWriteRelays??[]])),o=n.defaultWriteRelays??[qe];let s=document.getElementById("relay-join-modal");s||(s=document.createElement("dialog"),s.id="relay-join-modal",s.className="modal",document.body.appendChild(s),s.addEventListener("click",l=>{l.target===s&&s.close()}));const a=s;a.innerHTML=`
    <div class="modal__form invite-share">
      <h2 class="modal__title">Joining...</h2>
      <p class="invite-hint" id="relay-join-status">Looking for invite on relay...</p>
      <div class="modal__actions">
        <button class="btn" id="relay-join-cancel" type="button">Cancel</button>
      </div>
    </div>
  `;let i=()=>{},c=()=>{};a.querySelector("#relay-join-cancel")?.addEventListener("click",()=>{i(),c(),a.close()}),a.showModal(),Ne(r,o).then(()=>{i=e0({inviteId:e,readRelays:r,onToken(l){try{Jd(l)}catch(p){const m=a.querySelector("#relay-join-status");m&&(m.textContent=p instanceof Error?p.message:"Invalid invite token.",m.style.color="var(--duress)");return}const d=l.relays?.length?l.relays:o,u=d,f=Array.from(new Set([...et,...d])),h=a.querySelector("#relay-join-status");h&&(h.textContent=`Joining ${l.groupName}...`),Ne(f,u).then(()=>{c=nu({inviteId:l.inviteId,adminPubkey:l.adminPubkey,readRelays:f,writeRelays:u,onWelcome(p){try{Cs(p,l,a)}catch{h&&(h.textContent="Failed to join — welcome message could not be decrypted.",h.style.color="var(--duress)")}},onError(p){h&&(h.textContent=p,h.style.color="var(--duress)")}})})},onError(l){const d=a.querySelector("#relay-join-status");d&&(d.textContent=l,d.style.color="var(--duress)")}})})}function K0(e){try{let t;try{t=Kd(e)}catch{try{t=po(e)}catch{throw new Error("Invalid invite — could not decode token.")}}Jd(t);const n=t,{identity:r,settings:o}=_();if(!r?.pubkey||!r?.privkey){H("No local identity — create or import one first.","error");return}const s=`${n.adminPubkey.slice(0,8)}…${n.adminPubkey.slice(-4)}`,a=n.relays?.length?n.relays:o.defaultWriteRelays,i=a,c=Array.from(new Set([...et,...a])),l=Array.from(new Set([...c,...i]));let d=document.getElementById("remote-join-modal");d||(d=document.createElement("dialog"),d.id="remote-join-modal",d.className="modal",document.body.appendChild(d),d.addEventListener("click",h=>{h.target===d&&d.close()}));const u=d;let f=()=>{};u.innerHTML=`
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
    `,l.length>0&&Ne(c,i).then(()=>{const h=u.querySelector("#remote-join-relay-status");h&&(h.textContent="Waiting for admin to send group key..."),f=nu({inviteId:n.inviteId,adminPubkey:n.adminPubkey,readRelays:c,writeRelays:i,onWelcome(p){try{Cs(p,n,u)}catch{h&&(h.textContent="Auto-join failed — paste welcome message manually.",h.style.color="var(--duress)")}},onError(p){h&&(h.textContent=p,h.style.color="var(--duress)")}})}),u.querySelector("#remote-join-copy-pubkey")?.addEventListener("click",async h=>{const p=h.currentTarget;try{await navigator.clipboard.writeText(r.pubkey),p.textContent="Copied!",setTimeout(()=>{p.textContent="Copy"},1500)}catch{}}),u.querySelector("#remote-join-cancel")?.addEventListener("click",()=>{f(),u.close()}),u.querySelector("#remote-join-accept")?.addEventListener("click",async()=>{const h=u.querySelector("#remote-join-welcome-input"),p=u.querySelector("#remote-join-error"),m=(h?.value??"").replace(/[^A-Za-z0-9=+/]/g,"");if(!m){p&&(p.textContent="Please paste the welcome message.",p.style.display="");return}try{f(),Cs(m,n,u)}catch(g){p&&(p.textContent=g instanceof Error?g.message:"Failed to decrypt welcome message.",p.style.display="")}}),u.showModal()}catch(t){H(t instanceof Error?t.message:"Invalid remote invite.","error")}}function _u(){document.addEventListener("canary:create-group",()=>{H0()}),document.addEventListener("canary:show-invite",e=>{const{groupId:t}=e.detail,{groups:n}=_(),r=n[t];r&&mo(r)}),document.addEventListener("canary:confirm-member",e=>{const{identity:t,groups:n,activeGroupId:r}=_();if(!r||!t?.pubkey)return;const o=n[r];if(!o||!o.admins.includes(t.pubkey))return;const s=e.detail?.token??"";Te(async()=>{const{showConfirmMemberModal:a}=await Promise.resolve().then(()=>l0);return{showConfirmMemberModal:a}},void 0,import.meta.url).then(({showConfirmMemberModal:a})=>{a(s)})}),document.addEventListener("canary:verify-call",e=>{const{groupId:t,pubkey:n}=e.detail;$0(t,n)}),document.addEventListener("canary:pin-enable",e=>{const t=e.detail?.pin;!t||t.length<6||gg(t).then(()=>{ee({settings:{..._().settings,pinEnabled:!0}}),vu()})}),document.addEventListener("canary:pin-disable",()=>{bg().then(()=>{ee({settings:{..._().settings,pinEnabled:!1}}),wu()})}),document.addEventListener("canary:lock",()=>{ro(),Ui()}),document.addEventListener("canary:sync-message",e=>{const{groupId:t,message:n,sender:r}=e.detail;if(n.type==="beacon")_0(r,n.lat,n.lon,n.accuracy??2e4,n.timestamp);else if(n.type==="duress-alert"){const o=n.subject||r,{identity:s}=_();if(s?.pubkey===o)return;Fd(o,t,n.lat!=null?{lat:n.lat,lon:n.lon}:void 0,n.timestamp)}else n.type==="duress-clear"&&document.dispatchEvent(new CustomEvent("canary:duress-clear",{detail:{subject:n.subject,clearedBy:r,groupId:t}}))}),document.addEventListener("canary:resync",()=>{Hr()}),document.addEventListener("canary:vault-publish-now",()=>Hn()),document.addEventListener("visibilitychange",()=>{document.hidden||(console.info("[canary:boot] App foregrounded — reconnecting and syncing vault"),sn(),Te(async()=>{const{disconnectRelays:e}=await Promise.resolve().then(()=>Cd);return{disconnectRelays:e}},void 0,import.meta.url).then(({disconnectRelays:e})=>{e(),Hr()}))})}async function V0(){let{identity:e}=_();const t=await tb({pubkey:e?.pubkey??"",privkey:e?.privkey}),n={pubkey:t.pubkey,privkey:t.privkey,displayName:e?.displayName??"You",signerType:"local"};(!e||e.pubkey!==n.pubkey)&&ee({identity:As(n,e)})}async function Hr(){const{groups:e,identity:t,settings:n}=_(),r=Object.keys(e).length,o=!!t?.privkey,s=[],a=[];for(const u of Object.values(e))s.push(...u.readRelays??[]),a.push(...u.writeRelays??[]),s.push(...u.relays??[]),a.push(...u.relays??[]);s.push(...n.defaultReadRelays??n.defaultRelays),a.push(...n.defaultWriteRelays??n.defaultRelays);const i=ke(s),c=ke(a),l=ke([...i,...c]).length;if(l===0){console.warn("[canary:boot] No relays found — sync disabled"),r>0&&H(`Sync disabled — ${r} group(s), no relays configured`,"warning",5e3);return}if(!o&&t?.signerType!=="nip07"){console.warn("[canary:boot] No privkey and no NIP-07 — sync disabled"),H("Sync disabled — no private key","warning",5e3);return}if(console.warn("[canary:boot] Read relays:",i,"Write relays:",c),o){await Ne(i,c);try{const u=await U0(t.privkey,t.pubkey);if(u&&Object.keys(u).length>0){const{groups:f}=_(),h=D0(f,u),p=Object.keys(f).sort().join(","),m=Object.keys(h).sort().join(",");if(p!==m||Object.entries(h).some(([b,k])=>{const T=f[b];return T?k.epoch!==T.epoch||k.counter!==T.counter||k.usageOffset!==T.usageOffset||k.members.length!==T.members.length:!0})){ee({groups:h});const b=Object.keys(h).length-Object.keys(f).length;b>0?H(`Restored ${b} group(s) from vault`,"success"):H("Synced from vault","success",1500)}}}catch(u){console.warn("[canary:vault] Vault fetch failed:",u)}Lb(),H(`Syncing via ${l} relay(s)`,"success",2e3)}else{const{connectRelays:u}=await Te(async()=>{const{connectRelays:f}=await Promise.resolve().then(()=>Cd);return{connectRelays:f}},void 0,import.meta.url);u(i,c),H(`Connected to ${l} relay(s)`,"success",2e3)}const{fetchOwnProfile:d}=await Te(async()=>{const{fetchOwnProfile:u}=await Promise.resolve().then(()=>iu);return{fetchOwnProfile:u}},void 0,import.meta.url);if(d(),Di(),o){const{startLivenessHeartbeat:u}=await Te(async()=>{const{startLivenessHeartbeat:f}=await Promise.resolve().then(()=>Ib);return{startLivenessHeartbeat:f}},void 0,import.meta.url);u()}}function W0(e){return Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}function z0(e){const t=e.split(" ");let n=document.getElementById("recovery-phrase-modal");n||(n=document.createElement("dialog"),n.id="recovery-phrase-modal",n.className="modal",document.body.appendChild(n));const r=n;r.textContent="";const o=document.createElement("div");o.className="modal__form",o.style.maxWidth="420px";const s=document.createElement("h2");s.className="modal__title",s.textContent="Back up your recovery phrase",o.appendChild(s);const a=document.createElement("p");a.className="invite-hint",a.textContent="Write these words down in order. They're the only way to recover your account.",o.appendChild(a);const i=document.createElement("div");i.className="recovery-grid",i.style.cssText="display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin:1rem 0;",t.forEach((f,h)=>{const p=document.createElement("div");p.style.cssText="border:1px solid var(--border);border-radius:4px;padding:0.5rem;text-align:center;font-family:var(--font-mono,monospace);font-size:0.8rem;";const m=document.createElement("span");m.style.cssText="color:var(--text-muted);font-size:0.7rem;",m.textContent=`${h+1}. `;const g=document.createElement("span");g.style.fontWeight="500",g.textContent=f,p.append(m,g),i.appendChild(p)}),o.appendChild(i);const c=document.createElement("p");c.className="invite-hint",c.style.cssText="color:var(--duress);font-weight:500;",c.textContent="Do not share these words with anyone.",o.appendChild(c);const l=document.createElement("div");l.className="modal__actions",l.style.gap="0.5rem";const d=document.createElement("button");d.id="recovery-phrase-copy",d.className="btn btn--primary",d.type="button",d.textContent="Copy words",d.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(e),d.textContent="Copied!",setTimeout(()=>{d.textContent="Copy words"},2e3)}catch{}});const u=document.createElement("button");u.id="recovery-phrase-skip",u.className="btn",u.type="button",u.textContent="Skip for now",u.addEventListener("click",()=>r.close()),l.append(d,u),o.appendChild(l),r.appendChild(o),r.showModal()}function J0(){const e=document.getElementById("app");e.innerHTML=`
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
              <p class="settings-hint" style="font-size: 0.7rem; margin: 0.5rem 0 0 0;">Read relays: ${et.map(r=>j(r.replace("wss://",""))).join(", ")} + write relay(s)</p>
            </div>
          </details>
        </div>

      </div>
    </div>
  `,e.querySelector("#offline-form")?.addEventListener("submit",async r=>{r.preventDefault();const o=e.querySelector("#offline-name"),s=o?.value.trim();if(!s){o?.focus();return}const{generateMnemonic:a,mnemonicToKeypair:i}=await Te(async()=>{const{generateMnemonic:f,mnemonicToKeypair:h}=await Promise.resolve().then(()=>ma);return{generateMnemonic:f,mnemonicToKeypair:h}},void 0,import.meta.url),c=a(),{pubkey:l,privkey:d}=i(c);ee({identity:{pubkey:l,privkey:d,mnemonic:c,signerType:"local",displayName:s}}),await _n();const{publishKind0:u}=await Te(async()=>{const{publishKind0:f}=await Promise.resolve().then(()=>iu);return{publishKind0:f}},void 0,import.meta.url);u(s,d),z0(c)}),e.querySelector("#mnemonic-login-form")?.addEventListener("submit",async r=>{r.preventDefault();const s=e.querySelector("#login-mnemonic")?.value.trim();if(!s)return;if(s.split(/\s+/).length!==12){alert("Recovery phrase must be exactly 12 words.");return}try{const{validateMnemonic:i,mnemonicToKeypair:c}=await Te(async()=>{const{validateMnemonic:u,mnemonicToKeypair:f}=await Promise.resolve().then(()=>ma);return{validateMnemonic:u,mnemonicToKeypair:f}},void 0,import.meta.url);if(!i(s)){alert("Invalid recovery phrase. Please check your words and try again.");return}const{pubkey:l,privkey:d}=c(s);ee({identity:{pubkey:l,privkey:d,mnemonic:s,signerType:"local",displayName:"You"}}),await _n()}catch{alert("Invalid recovery phrase.")}}),e.querySelector("#nsec-login-form")?.addEventListener("submit",async r=>{r.preventDefault();const s=e.querySelector("#login-nsec")?.value.trim();if(s)try{const a=_().identity,i=Od(s);if(i.type!=="nsec"){alert("Not a valid nsec.");return}const c=i.data,l=W0(c),d=co(c);ee({identity:As({pubkey:d,privkey:l,signerType:"local",displayName:"You"},a)}),await _n()}catch(a){alert(a instanceof Error?a.message:"Invalid nsec format.")}}),e.querySelector("#login-nip07")?.addEventListener("click",async()=>{if(!Ed()){alert("No Nostr extension found. Install Alby, nos2x, or another NIP-07 extension and reload.");return}try{const r=_().identity,o=await window.nostr.getPublicKey();ee({identity:As({pubkey:o,signerType:"nip07",displayName:"You"},r)}),await _n()}catch{alert("Extension rejected the request.")}});function t(){const r=e.querySelector("#login-relay-list");if(!r)return;const o=_().settings.defaultWriteRelays??_().settings.defaultRelays;r.innerHTML=o.map((s,a)=>`
      <li style="display: flex; align-items: center; gap: 0.25rem; margin-bottom: 0.25rem;">
        <span class="settings-hint" style="flex: 1; font-size: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0;">${j(s)}</span>
        <button class="btn btn--ghost btn--sm login-relay-remove" data-relay-index="${a}" type="button" style="padding: 0 0.25rem; font-size: 0.7rem;">✕</button>
      </li>
    `).join(""),n()}function n(){e.querySelectorAll(".login-relay-remove").forEach(r=>{r.addEventListener("click",()=>{const o=Number(r.dataset.relayIndex),s=[..._().settings.defaultWriteRelays??_().settings.defaultRelays];s.splice(o,1),ee({settings:{..._().settings,defaultWriteRelays:s,defaultRelays:s}}),t()})})}n(),e.querySelector("#login-relay-add")?.addEventListener("click",()=>{const r=e.querySelector("#login-relay-input"),o=r?.value.trim();if(!o||!j0(o))return;const s=[..._().settings.defaultWriteRelays??_().settings.defaultRelays];s.includes(o)||(s.push(o),ee({settings:{..._().settings,defaultWriteRelays:s,defaultRelays:s}}),t()),r&&(r.value="")}),e.querySelector("#login-relay-input")?.addEventListener("keydown",r=>{r.key==="Enter"&&(r.preventDefault(),e.querySelector("#login-relay-add")?.click())})}async function _n(){Eu(),window.location.hash==="#call"&&ee({view:"call-demo"});const e=document.getElementById("header");e&&_i(e),ku(),ji(),Er(Di),Er(Z0),_u(),qr(),window.addEventListener("hashchange",()=>qr()),Hr()}let en=null;const Y0=3e4;function Z0(){const{identity:e,groups:t}=_();!e?.privkey||!e?.pubkey||Object.keys(t).length!==0&&(en&&clearTimeout(en),en=setTimeout(()=>{const{identity:n,groups:r}=_();n?.privkey&&n?.pubkey&&Object.keys(r).length>0&&gu(r,n.privkey,n.pubkey)},Y0))}function Hn(){en&&clearTimeout(en);const{identity:e,groups:t}=_();e?.privkey&&e?.pubkey&&Object.keys(t).length>0&&gu(t,e.privkey,e.pubkey).then(()=>console.info("[canary:vault] Vault published OK")).catch(n=>{console.error("[canary:vault] Vault publish FAILED:",n),H(`Vault publish failed: ${n instanceof Error?n.message:n}`,"error")})}window.addEventListener("beforeunload",()=>{en&&Hn()});async function rc(){if(cd())Ui();else{pg();const{identity:e}=_();e?.pubkey?await _n():J0()}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{rc()}):rc();
