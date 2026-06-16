const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./maplibre-gl-B2k4QVOw.css","./shamir-modal-DJMuykU-.js","./state-JOArEur-.js","./types-CD6bIACn.js","./escape-B_Hg2WOy.js","./dist-DVxUQaK0.js","./sha2-BVaAH8hI.js","./linkage-proof-CoLtxD1e.js","./persona-tree-Bj_vowVF.js","./persona-BC7tlCrW.js","./persona--Nt5lgWe.js","./hmac-BoYH8Ta2.js","./base-eQgr18fE.js","./export-modal-Cq5sZej7.js","./persona-DTjhk3W7.js","./connect-Ce_17kge.js","./connect-GjoBYe0p.js","./utils-BKa5XZQI.js"])))=>i.map(i=>d[i]);
import{a as e,i as t,n,o as r,r as i,s as a,t as o}from"./types-CD6bIACn.js";import{a as s,i as c,n as l,o as u,r as d,t as f}from"./state-JOArEur-.js";import{_ as p,d as m,f as h,i as g,m as _,n as v,o as y,p as ee,r as te,s as b,t as x,u as S,v as C,y as w}from"./sha2-BVaAH8hI.js";import{a as T,f as E,n as D,p as O,t as k,u as A}from"./persona--Nt5lgWe.js";import{t as j}from"./hmac-BoYH8Ta2.js";import{n as M,t as N}from"./base-eQgr18fE.js";import{c as P,d as F,i as I,m as ne,o as L,r as re,s as ie,t as ae}from"./utils-BKa5XZQI.js";import{a as oe,c as se,d as ce,f as le,i as ue,l as de,n as fe,o as pe,p as me,r as R,s as he,t as ge,u as _e}from"./connect-GjoBYe0p.js";import{a as ve,c as ye,i as be,l as xe,n as Se,o as Ce,r as we,t as Te,u as Ee}from"./persona-BC7tlCrW.js";import{i as De,r as Oe,t as z}from"./persona-tree-Bj_vowVF.js";import{t as B}from"./escape-B_Hg2WOy.js";var ke=Object.create,Ae=Object.defineProperty,je=Object.getOwnPropertyDescriptor,Me=Object.getOwnPropertyNames,Ne=Object.getPrototypeOf,Pe=Object.prototype.hasOwnProperty,Fe=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),Ie=(e,t)=>{let n={};for(var r in e)Ae(n,r,{get:e[r],enumerable:!0});return t||Ae(n,Symbol.toStringTag,{value:`Module`}),n},Le=(e,t,n,r)=>{if(t&&typeof t==`object`||typeof t==`function`)for(var i=Me(t),a=0,o=i.length,s;a<o;a++)s=i[a],!Pe.call(e,s)&&s!==n&&Ae(e,s,{get:(e=>t[e]).bind(null,s),enumerable:!(r=je(t,s))||r.enumerable});return e},Re=(e,t,n)=>(n=e==null?{}:ke(Ne(e)),Le(t||!e||!e.__esModule?Ae(n,`default`,{value:e,enumerable:!0}):n,e));(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var ze=6e5,Be=16,Ve=12;async function He(e,t){let n=await crypto.subtle.importKey(`raw`,new TextEncoder().encode(e),`PBKDF2`,!1,[`deriveKey`]);return crypto.subtle.deriveKey({name:`PBKDF2`,salt:t,iterations:ze,hash:`SHA-256`},n,{name:`AES-GCM`,length:256},!1,[`encrypt`,`decrypt`])}async function Ue(e,t){let n=crypto.getRandomValues(new Uint8Array(Ve)),r=await crypto.subtle.encrypt({name:`AES-GCM`,iv:n},t,new TextEncoder().encode(e)),i=new Uint8Array(n.length+new Uint8Array(r).length);i.set(n),i.set(new Uint8Array(r),n.length);let a=``;for(let e=0;e<i.length;e++)a+=String.fromCharCode(i[e]);return btoa(a)}async function We(e,t){let n=Uint8Array.from(atob(e),e=>e.charCodeAt(0)),r=n.slice(0,Ve),i=n.slice(Ve),a=await crypto.subtle.decrypt({name:`AES-GCM`,iv:r},t,i);return new TextDecoder().decode(a)}function Ge(){return crypto.getRandomValues(new Uint8Array(Be))}function Ke(e){return btoa(String.fromCharCode(...e))}function qe(e){return Uint8Array.from(atob(e),e=>e.charCodeAt(0))}var Je=Uint8Array.from([7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8]),Ye=Uint8Array.from(Array(16).fill(0).map((e,t)=>t)),Xe=Ye.map(e=>(9*e+5)%16),Ze=(()=>{let e=[[Ye],[Xe]];for(let t=0;t<4;t++)for(let n of e)n.push(n[t].map(e=>Je[e]));return e})(),Qe=Ze[0],$e=Ze[1],et=[[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8],[12,13,11,15,6,9,9,7,12,15,11,13,7,8,7,7],[13,15,14,11,7,7,6,8,13,14,13,12,5,5,6,9],[14,11,12,14,8,6,5,5,15,12,15,14,9,9,8,6],[15,12,13,13,9,5,8,6,14,11,12,11,8,6,5,5]].map(e=>Uint8Array.from(e)),tt=Qe.map((e,t)=>e.map(e=>et[t][e])),nt=$e.map((e,t)=>e.map(e=>et[t][e])),rt=Uint32Array.from([0,1518500249,1859775393,2400959708,2840853838]),it=Uint32Array.from([1352829926,1548603684,1836072691,2053994217,0]);function at(e,t,n,r){return e===0?t^n^r:e===1?t&n|~t&r:e===2?(t|~n)^r:e===3?t&r|n&~r:t^(n|~r)}var ot=new Uint32Array(16),st=class extends te{h0=1732584193;h1=-271733879;h2=-1732584194;h3=271733878;h4=-1009589776;constructor(){super(64,20,8,!0)}get(){let{h0:e,h1:t,h2:n,h3:r,h4:i}=this;return[e,t,n,r,i]}set(e,t,n,r,i){this.h0=e|0,this.h1=t|0,this.h2=n|0,this.h3=r|0,this.h4=i|0}process(e,t){for(let n=0;n<16;n++,t+=4)ot[n]=e.getUint32(t,!0);let n=this.h0|0,r=n,i=this.h1|0,a=i,o=this.h2|0,s=o,c=this.h3|0,l=c,u=this.h4|0,d=u;for(let e=0;e<5;e++){let t=4-e,f=rt[e],p=it[e],m=Qe[e],h=$e[e],g=tt[e],_=nt[e];for(let t=0;t<16;t++){let r=w(n+at(e,i,o,c)+ot[m[t]]+f,g[t])+u|0;n=u,u=c,c=w(o,10)|0,o=i,i=r}for(let e=0;e<16;e++){let n=w(r+at(t,a,s,l)+ot[h[e]]+p,_[e])+d|0;r=d,d=l,l=w(s,10)|0,s=a,a=n}}this.set(this.h1+o+l|0,this.h2+c+d|0,this.h3+u+r|0,this.h4+n+a|0,this.h0+i+s|0)}roundClean(){m(ot)}destroy(){this.destroyed=!0,m(this.buffer),this.set(0,0,0,0,0)}},ct=ee(()=>new st);function lt(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name===`Uint8Array`&&`BYTES_PER_ELEMENT`in e&&e.BYTES_PER_ELEMENT===1}function ut(e,t){return Array.isArray(t)?t.length===0?!0:e?t.every(e=>typeof e==`string`):t.every(e=>Number.isSafeInteger(e)):!1}function dt(e){if(typeof e!=`function`)throw TypeError(`function expected`);return!0}function ft(e,t){if(typeof t!=`string`)throw TypeError(`${e}: string expected`);return!0}function pt(e){if(typeof e!=`number`)throw TypeError(`number expected, got ${typeof e}`);if(!Number.isSafeInteger(e))throw RangeError(`invalid integer: ${e}`)}function mt(e){if(!Array.isArray(e))throw TypeError(`array expected`)}function ht(e,t){if(!ut(!0,t))throw TypeError(`${e}: array of strings expected`)}function gt(e,t){if(!ut(!1,t))throw TypeError(`${e}: array of numbers expected`)}function V(...e){let t=e=>e,n=(e,t)=>n=>e(t(n));return{encode:e.map(e=>e.encode).reduceRight(n,t),decode:e.map(e=>e.decode).reduce(n,t)}}function _t(e){let t=typeof e==`string`?e.split(``):e,n=t.length;ht(`alphabet`,t);let r=new Map(t.map((e,t)=>[e,t]));return{encode:r=>(mt(r),r.map(r=>{if(!Number.isSafeInteger(r)||r<0||r>=n)throw Error(`alphabet.encode: digit index outside alphabet "${r}". Allowed: ${e}`);return t[r]})),decode:t=>(mt(t),t.map(t=>{ft(`alphabet.decode`,t);let n=r.get(t);if(n===void 0)throw Error(`Unknown letter: "${t}". Allowed: ${e}`);return n}))}}function vt(e=``){return ft(`join`,e),{encode:t=>(ht(`join.decode`,t),t.join(e)),decode:t=>(ft(`join.decode`,t),t.split(e))}}function yt(e,t=`=`){return pt(e),ft(`padding`,t),{encode(n){for(ht(`padding.encode`,n);n.length*e%8;)n.push(t);return n},decode(n){ht(`padding.decode`,n);let r=n.length;if(r*e%8)throw Error(`padding: invalid, string should have whole number of bytes`);for(;r>0&&n[r-1]===t;r--)if((r-1)*e%8==0)throw Error(`padding: invalid, string has too much padding`);return n.slice(0,r)}}}function bt(e){return dt(e),{encode:e=>e,decode:t=>e(t)}}function xt(e,t,n){if(t<2)throw RangeError(`convertRadix: invalid from=${t}, base cannot be less than 2`);if(n<2)throw RangeError(`convertRadix: invalid to=${n}, base cannot be less than 2`);if(mt(e),!e.length)return[];let r=0,i=[],a=Array.from(e,e=>{if(pt(e),e<0||e>=t)throw Error(`invalid integer: ${e}`);return e}),o=a.length;for(;;){let e=0,s=!0;for(let i=r;i<o;i++){let o=a[i],c=t*e,l=c+o;if(!Number.isSafeInteger(l)||c/t!==e||l-o!==c)throw Error(`convertRadix: carry overflow`);let u=l/n;e=l%n;let d=Math.floor(u);if(a[i]=d,!Number.isSafeInteger(d)||d*n+e!==l)throw Error(`convertRadix: carry overflow`);if(s)d?s=!1:r=i;else continue}if(i.push(e),s)break}for(let t=0;t<e.length-1&&e[t]===0;t++)i.push(0);return i.reverse()}var St=(e,t)=>t===0?e:St(t,e%t),Ct=(e,t)=>e+(t-St(e,t)),wt=(()=>{let e=[];for(let t=0;t<40;t++)e.push(2**t);return e})();function Tt(e,t,n,r){if(mt(e),t<=0||t>32)throw RangeError(`convertRadix2: wrong from=${t}`);if(n<=0||n>32)throw RangeError(`convertRadix2: wrong to=${n}`);if(Ct(t,n)>32)throw Error(`convertRadix2: carry overflow from=${t} to=${n} carryBits=${Ct(t,n)}`);let i=0,a=0,o=wt[t],s=wt[n]-1,c=[];for(let r of e){if(pt(r),r>=o)throw Error(`convertRadix2: invalid data word=${r} from=${t}`);if(i=i<<t|r,a+t>32)throw Error(`convertRadix2: carry overflow pos=${a} from=${t}`);for(a+=t;a>=n;a-=n)c.push((i>>a-n&s)>>>0);let e=wt[a];if(e===void 0)throw Error(`invalid carry`);i&=e-1}if(i=i<<n-a&s,!r&&a>=t)throw Error(`Excess padding`);if(!r&&i>0)throw Error(`Non-zero padding: ${i}`);return r&&a>0&&c.push(i>>>0),c}function Et(e){return pt(e),{encode:t=>{if(!lt(t))throw TypeError(`radix.encode input should be Uint8Array`);return xt(Array.from(t),256,e)},decode:t=>(gt(`radix.decode`,t),Uint8Array.from(xt(t,e,256)))}}function Dt(e,t=!1){if(pt(e),e<=0||e>32)throw RangeError(`radix2: bits should be in (0..32]`);if(Ct(8,e)>32||Ct(e,8)>32)throw RangeError(`radix2: carry overflow`);return{encode:n=>{if(!lt(n))throw TypeError(`radix2.encode input should be Uint8Array`);return Tt(Array.from(n),8,e,!t)},decode:n=>(gt(`radix2.decode`,n),Uint8Array.from(Tt(n,e,8,t)))}}function Ot(e){return dt(e),function(...t){try{return e.apply(null,t)}catch{}}}function kt(e,t){if(pt(e),e<=0)throw RangeError(`checksum length must be positive: ${e}`);dt(t);let n=t;return{encode(t){if(!lt(t))throw TypeError(`checksum.encode: input should be Uint8Array`);let r=n(t).slice(0,e),i=new Uint8Array(t.length+e);return i.set(t),i.set(r,t.length),i},decode(t){if(!lt(t))throw TypeError(`checksum.decode: input should be Uint8Array`);let r=t.slice(0,-e),i=t.slice(-e),a=n(r).slice(0,e);for(let t=0;t<e;t++)if(a[t]!==i[t])throw Error(`Invalid checksum`);return r}}}V(Dt(4),_t(`0123456789ABCDEF`),vt(``)),V(Dt(5),_t(`ABCDEFGHIJKLMNOPQRSTUVWXYZ234567`),yt(5),vt(``)),V(Dt(5),_t(`ABCDEFGHIJKLMNOPQRSTUVWXYZ234567`),vt(``)),V(Dt(5),_t(`0123456789ABCDEFGHIJKLMNOPQRSTUV`),yt(5),vt(``)),V(Dt(5),_t(`0123456789ABCDEFGHIJKLMNOPQRSTUV`),vt(``)),V(Dt(5),_t(`0123456789ABCDEFGHJKMNPQRSTVWXYZ`),vt(``),bt(e=>e.toUpperCase().replace(/O/g,`0`).replace(/[IL]/g,`1`)));var At=typeof Uint8Array.from([]).toBase64==`function`&&typeof Uint8Array.fromBase64==`function`;At||V(Dt(6),_t(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`),yt(6),vt(``)),V(Dt(6),_t(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`),vt(``)),At||V(Dt(6),_t(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`),yt(6),vt(``)),V(Dt(6),_t(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`),vt(``));var jt=Object.freeze((e=>V(Et(58),_t(e),vt(``)))(`123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz`)),Mt=e=>{dt(e);let t=e;return V(kt(4,e=>t(t(e))),jt)},Nt=V(_t(`qpzry9x8gf2tvdw0s3jn54khce6mua7l`),vt(``)),Pt=[996825010,642813549,513874426,1027748829,705979059];function Ft(e){let t=e>>25,n=(e&33554431)<<5;for(let e=0;e<Pt.length;e++)(t>>e&1)==1&&(n^=Pt[e]);return n}function It(e,t,n=1){let r=e.length,i=1;for(let t=0;t<r;t++){let n=e.charCodeAt(t);if(n<33||n>126)throw Error(`Invalid prefix (${e})`);i=Ft(i)^n>>5}i=Ft(i);for(let t=0;t<r;t++)i=Ft(i)^e.charCodeAt(t)&31;for(let e of t)i=Ft(i)^e;for(let e=0;e<6;e++)i=Ft(i);return i^=n,Nt.encode(Tt([i%wt[30]],30,5,!1))}function Lt(e){let t=e===`bech32`?1:734539939,n=Dt(5),r=n.decode,i=n.encode,a=Ot(r);function o(e,n,r=90){ft(`bech32.encode prefix`,e),lt(n)&&(n=Array.from(n)),gt(`bech32.encode`,n);let i=e.length;if(i===0)throw TypeError(`Invalid prefix length ${i}`);let a=i+7+n.length;if(r!==!1&&a>r)throw TypeError(`Length ${a} exceeds limit ${r}`);let o=e.toLowerCase(),s=It(o,n,t);return`${o}1${Nt.encode(n)}${s}`}function s(e,n=90){ft(`bech32.decode input`,e);let r=e.length;if(r<8||n!==!1&&r>n)throw TypeError(`invalid string length: ${r} (${e}). Expected (8..${n})`);let i=e.toLowerCase();if(e!==i&&e!==e.toUpperCase())throw Error(`String must be lowercase or uppercase`);let a=i.lastIndexOf(`1`);if(a===0||a===-1)throw Error(`Letter "1" must be present between prefix and data only`);let o=i.slice(0,a),s=i.slice(a+1);if(s.length<6)throw Error(`Data must be at least 6 characters long`);let c=Nt.decode(s).slice(0,-6),l=It(o,c,t);if(!s.endsWith(l))throw Error(`Invalid checksum in ${e}: expected "${l}"`);return{prefix:o,words:c}}let c=Ot(s);function l(e){let{prefix:t,words:n}=s(e,!1);return{prefix:t,words:n,bytes:r(n)}}function u(e,t){return o(e,i(t))}return{encode:o,decode:s,encodeFromBytes:u,decodeToBytes:l,decodeUnsafe:c,fromWords:r,fromWordsUnsafe:a,toWords:i}}Lt(`bech32`),Lt(`bech32m`),typeof Uint8Array.from([]).toHex==`function`&&typeof Uint8Array.fromHex==`function`||V(Dt(4),_t(`0123456789abcdef`),vt(``),bt(e=>{if(typeof e!=`string`||e.length%2!=0)throw TypeError(`hex.decode: expected string, got ${typeof e} with length ${e.length}`);return e.toLowerCase()}));var Rt=O.Point,zt=Rt.Fn,Bt=Mt(x),Vt=Uint8Array.from(`Bitcoin seed`.split(``),e=>e.charCodeAt(0)),Ht={private:76066276,public:76067358},Ut=2147483648,Wt=e=>ct(x(e)),Gt=e=>_(e).getUint32(0,!1),Kt=e=>{if(typeof e!=`number`)throw TypeError(`invalid number, should be from 0 to 2**32-1, got `+e);if(!Number.isSafeInteger(e)||e<0||e>2**32-1)throw RangeError(`invalid number, should be from 0 to 2**32-1, got `+e);let t=new Uint8Array(4);return _(t).setUint32(0,e,!1),t},qt=class e{get fingerprint(){if(!this.pubHash)throw Error(`No publicKey set!`);return Gt(this.pubHash)}get identifier(){return this.pubHash}get pubKeyHash(){return this.pubHash}get privateKey(){return this._privateKey||null}get publicKey(){return this._publicKey||null}get privateExtendedKey(){let e=this._privateKey;if(!e)throw Error(`No private key`);return Bt.encode(this.serialize(this.versions.private,h(Uint8Array.of(0),e)))}get publicExtendedKey(){if(!this._publicKey)throw Error(`No public key`);return Bt.encode(this.serialize(this.versions.public,this._publicKey))}static fromMasterSeed(t,n=Ht){if(g(t),8*t.length<128||8*t.length>512)throw RangeError(`HDKey: seed length must be between 128 and 512 bits; 256 bits is advised, got `+t.length);let r=j(v,Vt,t),i=r.slice(0,32);return new e({versions:n,chainCode:r.slice(32),privateKey:i})}static fromExtendedKey(t,n=Ht){let r=Bt.decode(t),i=_(r),a=i.getUint32(0,!1),o={versions:n,depth:r[4],parentFingerprint:i.getUint32(5,!1),index:i.getUint32(9,!1),chainCode:r.slice(13,45)},s=r.slice(45),c=s[0]===0;if(a!==n[c?`private`:`public`])throw Error(`Version mismatch`);return c?new e({...o,privateKey:s.slice(1)}):new e({...o,publicKey:s})}static fromJSON(t){return e.fromExtendedKey(t.xpriv)}versions;depth=0;index=0;chainCode=null;parentFingerprint=0;_privateKey;_publicKey;pubHash;constructor(e){if(!e||typeof e!=`object`)throw Error(`HDKey.constructor must not be called directly`);if(this.versions=e.versions||Ht,this.depth=e.depth||0,this.chainCode=e.chainCode?Uint8Array.from(e.chainCode):null,this.index=e.index||0,this.parentFingerprint=e.parentFingerprint||0,!this.depth&&(this.parentFingerprint||this.index))throw Error(`HDKey: zero depth with non-zero index/parent fingerprint`);if(this.depth>255)throw Error(`HDKey: depth exceeds the serializable value 255`);if(e.publicKey&&e.privateKey)throw Error(`HDKey: publicKey and privateKey at same time.`);if(e.privateKey){if(!O.utils.isValidSecretKey(e.privateKey))throw Error(`Invalid private key`);this._privateKey=Uint8Array.from(e.privateKey),this._publicKey=O.getPublicKey(this._privateKey,!0)}else if(e.publicKey)this._publicKey=Rt.fromBytes(e.publicKey).toBytes(!0);else throw Error(`HDKey: no public or private key provided`);this.pubHash=Wt(this._publicKey)}derive(e){if(!/^[mM]'?/.test(e))throw Error(`Path must start with "m" or "M"`);if(/^[mM]'?$/.test(e))return this;let t=e.replace(/^[mM]'?\//,``).split(`/`),n=this;for(let e of t){let t=/^(\d+)('?)$/.exec(e),r=t&&t[1];if(!t||t.length!==3||typeof r!=`string`)throw Error(`invalid child index: `+e);let i=+r;if(!Number.isSafeInteger(i)||i>=2147483648)throw Error(`Invalid index`);t[2]===`'`&&(i+=Ut),n=n.deriveChild(i)}return n}deriveChild(t,n){if(!this._publicKey||!this.chainCode)throw Error(`No publicKey or chainCode set`);let r=Kt(t);if(t>=2147483648){let e=this._privateKey;if(!e)throw Error(`Could not derive hardened child key`);r=h(Uint8Array.of(0),e,r)}else r=h(this._publicKey,r);let i=n||j(v,this.chainCode,r);g(i,64);let a=i.slice(0,32),o=i.slice(32),s={versions:this.versions,chainCode:o,depth:this.depth+1,parentFingerprint:this.fingerprint,index:t};if(s.depth>255)throw Error(`HDKey: depth exceeds the serializable value 255`);try{let t=zt.fromBytes(a);if(this._privateKey){let e=zt.create(zt.fromBytes(this._privateKey)+t);if(!zt.isValidNot0(e))throw Error(`The tweak was out of range or the resulted private key is invalid`);s.privateKey=zt.toBytes(e)}else{let e=Rt.fromBytes(this._publicKey),n=t===0n?e:e.add(Rt.BASE.multiply(t));if(n.equals(Rt.ZERO))throw Error(`The tweak was equal to negative P, which made the result key invalid`);s.publicKey=n.toBytes(!0)}return new e(s)}catch{return this.deriveChild(t+1)}}sign(e){if(!this._privateKey)throw Error(`No privateKey set!`);return g(e,32),O.sign(e,this._privateKey,{prehash:!1})}verify(e,t){if(g(e,32),g(t,64),!this._publicKey)throw Error(`No publicKey set!`);return O.verify(t,e,this._publicKey,{prehash:!1})}wipePrivateData(){return this._privateKey&&=(this._privateKey.fill(0),void 0),this}toJSON(){return{xpriv:this.privateExtendedKey,xpub:this.publicExtendedKey}}serialize(e,t){if(!this.chainCode)throw Error(`No chainCode set`);return g(t,33),h(Kt(e),new Uint8Array([this.depth]),Kt(this.parentFingerprint),Kt(this.index),this.chainCode,t)}};function Jt(e,t,n,r){y(e);let{c:i,dkLen:a,asyncTick:o}=S({dkLen:32,asyncTick:10},r);if(b(i,`c`),b(a,`dkLen`),b(o,`asyncTick`),i<1)throw Error(`iterations (c) must be >= 1`);if(a<1)throw Error(`"dkLen" must be >= 1`);if(a>(2**32-1)*e.outputLen)throw Error(`derived key too long`);let s=p(t,`password`),c=p(n,`salt`),l=new Uint8Array(a),u=j.create(e,s);return{c:i,dkLen:a,asyncTick:o,DK:l,PRF:u,PRFSalt:u._cloneInto().update(c)}}function Yt(e,t,n,r,i){return e.destroy(),t.destroy(),r&&r.destroy(),m(i),n}function Xt(e,t,n,r){let{c:i,dkLen:a,DK:o,PRF:s,PRFSalt:c}=Jt(e,t,n,r),l,u=new Uint8Array(4),d=_(u),f=new Uint8Array(s.outputLen);for(let e=1,t=0;t<a;e++,t+=s.outputLen){let n=o.subarray(t,t+s.outputLen);d.setInt32(0,e,!1),(l=c._cloneInto(l)).update(u).digestInto(f),n.set(f.subarray(0,n.length));for(let e=1;e<i;e++){s._cloneInto(l).update(f).digestInto(f);for(let e=0;e<n.length;e++)n[e]^=f[e]}}return Yt(s,c,o,l,f)}function Zt(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name===`Uint8Array`&&`BYTES_PER_ELEMENT`in e&&e.BYTES_PER_ELEMENT===1}function Qt(e,t){return Array.isArray(t)?t.length===0?!0:e?t.every(e=>typeof e==`string`):t.every(e=>Number.isSafeInteger(e)):!1}function $t(e){if(typeof e!=`function`)throw TypeError(`function expected`);return!0}function en(e,t){if(typeof t!=`string`)throw TypeError(`${e}: string expected`);return!0}function tn(e){if(typeof e!=`number`)throw TypeError(`number expected, got ${typeof e}`);if(!Number.isSafeInteger(e))throw RangeError(`invalid integer: ${e}`)}function nn(e){if(!Array.isArray(e))throw TypeError(`array expected`)}function rn(e,t){if(!Qt(!0,t))throw TypeError(`${e}: array of strings expected`)}function an(e,t){if(!Qt(!1,t))throw TypeError(`${e}: array of numbers expected`)}function on(...e){let t=e=>e,n=(e,t)=>n=>e(t(n));return{encode:e.map(e=>e.encode).reduceRight(n,t),decode:e.map(e=>e.decode).reduce(n,t)}}function sn(e){let t=typeof e==`string`?e.split(``):e,n=t.length;rn(`alphabet`,t);let r=new Map(t.map((e,t)=>[e,t]));return{encode:r=>(nn(r),r.map(r=>{if(!Number.isSafeInteger(r)||r<0||r>=n)throw Error(`alphabet.encode: digit index outside alphabet "${r}". Allowed: ${e}`);return t[r]})),decode:t=>(nn(t),t.map(t=>{en(`alphabet.decode`,t);let n=r.get(t);if(n===void 0)throw Error(`Unknown letter: "${t}". Allowed: ${e}`);return n}))}}function cn(e=``){return en(`join`,e),{encode:t=>(rn(`join.decode`,t),t.join(e)),decode:t=>(en(`join.decode`,t),t.split(e))}}function ln(e,t=`=`){return tn(e),en(`padding`,t),{encode(n){for(rn(`padding.encode`,n);n.length*e%8;)n.push(t);return n},decode(n){rn(`padding.decode`,n);let r=n.length;if(r*e%8)throw Error(`padding: invalid, string should have whole number of bytes`);for(;r>0&&n[r-1]===t;r--)if((r-1)*e%8==0)throw Error(`padding: invalid, string has too much padding`);return n.slice(0,r)}}}function un(e){return $t(e),{encode:e=>e,decode:t=>e(t)}}function dn(e,t,n){if(t<2)throw RangeError(`convertRadix: invalid from=${t}, base cannot be less than 2`);if(n<2)throw RangeError(`convertRadix: invalid to=${n}, base cannot be less than 2`);if(nn(e),!e.length)return[];let r=0,i=[],a=Array.from(e,e=>{if(tn(e),e<0||e>=t)throw Error(`invalid integer: ${e}`);return e}),o=a.length;for(;;){let e=0,s=!0;for(let i=r;i<o;i++){let o=a[i],c=t*e,l=c+o;if(!Number.isSafeInteger(l)||c/t!==e||l-o!==c)throw Error(`convertRadix: carry overflow`);let u=l/n;e=l%n;let d=Math.floor(u);if(a[i]=d,!Number.isSafeInteger(d)||d*n+e!==l)throw Error(`convertRadix: carry overflow`);if(s)d?s=!1:r=i;else continue}if(i.push(e),s)break}for(let t=0;t<e.length-1&&e[t]===0;t++)i.push(0);return i.reverse()}var fn=(e,t)=>t===0?e:fn(t,e%t),pn=(e,t)=>e+(t-fn(e,t)),mn=(()=>{let e=[];for(let t=0;t<40;t++)e.push(2**t);return e})();function hn(e,t,n,r){if(nn(e),t<=0||t>32)throw RangeError(`convertRadix2: wrong from=${t}`);if(n<=0||n>32)throw RangeError(`convertRadix2: wrong to=${n}`);if(pn(t,n)>32)throw Error(`convertRadix2: carry overflow from=${t} to=${n} carryBits=${pn(t,n)}`);let i=0,a=0,o=mn[t],s=mn[n]-1,c=[];for(let r of e){if(tn(r),r>=o)throw Error(`convertRadix2: invalid data word=${r} from=${t}`);if(i=i<<t|r,a+t>32)throw Error(`convertRadix2: carry overflow pos=${a} from=${t}`);for(a+=t;a>=n;a-=n)c.push((i>>a-n&s)>>>0);let e=mn[a];if(e===void 0)throw Error(`invalid carry`);i&=e-1}if(i=i<<n-a&s,!r&&a>=t)throw Error(`Excess padding`);if(!r&&i>0)throw Error(`Non-zero padding: ${i}`);return r&&a>0&&c.push(i>>>0),c}function gn(e){return tn(e),{encode:t=>{if(!Zt(t))throw TypeError(`radix.encode input should be Uint8Array`);return dn(Array.from(t),256,e)},decode:t=>(an(`radix.decode`,t),Uint8Array.from(dn(t,e,256)))}}function _n(e,t=!1){if(tn(e),e<=0||e>32)throw RangeError(`radix2: bits should be in (0..32]`);if(pn(8,e)>32||pn(e,8)>32)throw RangeError(`radix2: carry overflow`);return{encode:n=>{if(!Zt(n))throw TypeError(`radix2.encode input should be Uint8Array`);return hn(Array.from(n),8,e,!t)},decode:n=>(an(`radix2.decode`,n),Uint8Array.from(hn(n,e,8,t)))}}function vn(e){return $t(e),function(...t){try{return e.apply(null,t)}catch{}}}function yn(e,t){if(tn(e),e<=0)throw RangeError(`checksum length must be positive: ${e}`);$t(t);let n=t;return{encode(t){if(!Zt(t))throw TypeError(`checksum.encode: input should be Uint8Array`);let r=n(t).slice(0,e),i=new Uint8Array(t.length+e);return i.set(t),i.set(r,t.length),i},decode(t){if(!Zt(t))throw TypeError(`checksum.decode: input should be Uint8Array`);let r=t.slice(0,-e),i=t.slice(-e),a=n(r).slice(0,e);for(let t=0;t<e;t++)if(a[t]!==i[t])throw Error(`Invalid checksum`);return r}}}var bn=Object.freeze({alphabet:sn,chain:on,checksum:yn,convertRadix:dn,convertRadix2:hn,radix:gn,radix2:_n,join:cn,padding:ln});on(_n(4),sn(`0123456789ABCDEF`),cn(``)),on(_n(5),sn(`ABCDEFGHIJKLMNOPQRSTUVWXYZ234567`),ln(5),cn(``)),on(_n(5),sn(`ABCDEFGHIJKLMNOPQRSTUVWXYZ234567`),cn(``)),on(_n(5),sn(`0123456789ABCDEFGHIJKLMNOPQRSTUV`),ln(5),cn(``)),on(_n(5),sn(`0123456789ABCDEFGHIJKLMNOPQRSTUV`),cn(``)),on(_n(5),sn(`0123456789ABCDEFGHJKMNPQRSTVWXYZ`),cn(``),un(e=>e.toUpperCase().replace(/O/g,`0`).replace(/[IL]/g,`1`)));var xn=typeof Uint8Array.from([]).toBase64==`function`&&typeof Uint8Array.fromBase64==`function`;xn||on(_n(6),sn(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`),ln(6),cn(``)),on(_n(6),sn(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`),cn(``)),xn||on(_n(6),sn(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`),ln(6),cn(``)),on(_n(6),sn(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`),cn(``));var Sn=on(sn(`qpzry9x8gf2tvdw0s3jn54khce6mua7l`),cn(``)),Cn=[996825010,642813549,513874426,1027748829,705979059];function wn(e){let t=e>>25,n=(e&33554431)<<5;for(let e=0;e<Cn.length;e++)(t>>e&1)==1&&(n^=Cn[e]);return n}function Tn(e,t,n=1){let r=e.length,i=1;for(let t=0;t<r;t++){let n=e.charCodeAt(t);if(n<33||n>126)throw Error(`Invalid prefix (${e})`);i=wn(i)^n>>5}i=wn(i);for(let t=0;t<r;t++)i=wn(i)^e.charCodeAt(t)&31;for(let e of t)i=wn(i)^e;for(let e=0;e<6;e++)i=wn(i);return i^=n,Sn.encode(hn([i%mn[30]],30,5,!1))}function En(e){let t=e===`bech32`?1:734539939,n=_n(5),r=n.decode,i=n.encode,a=vn(r);function o(e,n,r=90){en(`bech32.encode prefix`,e),Zt(n)&&(n=Array.from(n)),an(`bech32.encode`,n);let i=e.length;if(i===0)throw TypeError(`Invalid prefix length ${i}`);let a=i+7+n.length;if(r!==!1&&a>r)throw TypeError(`Length ${a} exceeds limit ${r}`);let o=e.toLowerCase(),s=Tn(o,n,t);return`${o}1${Sn.encode(n)}${s}`}function s(e,n=90){en(`bech32.decode input`,e);let r=e.length;if(r<8||n!==!1&&r>n)throw TypeError(`invalid string length: ${r} (${e}). Expected (8..${n})`);let i=e.toLowerCase();if(e!==i&&e!==e.toUpperCase())throw Error(`String must be lowercase or uppercase`);let a=i.lastIndexOf(`1`);if(a===0||a===-1)throw Error(`Letter "1" must be present between prefix and data only`);let o=i.slice(0,a),s=i.slice(a+1);if(s.length<6)throw Error(`Data must be at least 6 characters long`);let c=Sn.decode(s).slice(0,-6),l=Tn(o,c,t);if(!s.endsWith(l))throw Error(`Invalid checksum in ${e}: expected "${l}"`);return{prefix:o,words:c}}let c=vn(s);function l(e){let{prefix:t,words:n}=s(e,!1);return{prefix:t,words:n,bytes:r(n)}}function u(e,t){return o(e,i(t))}return{encode:o,decode:s,encodeFromBytes:u,decodeToBytes:l,decodeUnsafe:c,fromWords:r,fromWordsUnsafe:a,toWords:i}}En(`bech32`),En(`bech32m`),typeof Uint8Array.from([]).toHex==`function`&&typeof Uint8Array.fromHex==`function`||on(_n(4),sn(`0123456789abcdef`),cn(``),un(e=>{if(typeof e!=`string`||e.length%2!=0)throw TypeError(`hex.decode: expected string, got ${typeof e} with length ${e.length}`);return e.toLowerCase()}));var Dn=Ie({entropyToMnemonic:()=>In,generateMnemonic:()=>Mn,mnemonicToEntropy:()=>Fn,mnemonicToSeedSync:()=>zn,validateMnemonic:()=>Ln}),On=e=>e[0]===`あいこくしん`;function kn(e){if(typeof e!=`string`)throw TypeError(`invalid mnemonic type: `+typeof e);return e.normalize(`NFKD`)}function An(e){let t=kn(e),n=t.split(` `);if(![12,15,18,21,24].includes(n.length))throw Error(`Invalid mnemonic`);return{nfkd:t,words:n}}function jn(e){if(g(e),![16,20,24,28,32].includes(e.length))throw RangeError(`invalid entropy length`)}function Mn(e,t=128){if(b(t),t%32!=0||t>256)throw RangeError(`Invalid entropy`);return In(C(t/8),e)}var Nn=e=>{let t=8-e.length/4;return new Uint8Array([x(e)[0]>>t<<t])};function Pn(e){if(!Array.isArray(e)||e.length!==2048||typeof e[0]!=`string`)throw TypeError(`Wordlist: expected array of 2048 strings`);return e.forEach(e=>{if(typeof e!=`string`)throw TypeError(`wordlist: non-string element: `+e)}),bn.chain(bn.checksum(1,Nn),bn.radix2(11,!0),bn.alphabet(e))}function Fn(e,t){let{words:n}=An(e),r=Pn(t).decode(n);return jn(r),r}function In(e,t){return jn(e),Pn(t).encode(e).join(On(t)?`　`:` `)}function Ln(e,t){try{Fn(e,t)}catch{return!1}return!0}var Rn=e=>kn(`mnemonic`+e);function zn(e,t=``){return Xt(v,An(e).nfkd,Rn(t),{c:2048,dkLen:64})}var Bn=Ie({wordlist:()=>Vn}),Vn=Object.freeze(`abandon
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
`)),Hn=`m/44'/1237'/727'/0'/0'`;function Un(e,t){if(typeof e!=`string`)throw new A(`mnemonic must be a string`);if(t!==void 0&&typeof t!=`string`)throw new A(`passphrase must be a string`);if(!Ln(e,Vn))throw new A(`Invalid BIP-39 mnemonic`);let n=zn(e,t),r=qt.fromMasterSeed(n),i=r.derive(Hn);if(!i.privateKey)throw new A(`Failed to derive private key at nsec-tree path`);let a=new Uint8Array(i.privateKey);n.fill(0),i.privateKey&&i.privateKey.fill(0),r.privateKey&&r.privateKey.fill(0);let o=T(a);return a.fill(0),o}var Wn=Ie({restoreFromMnemonic:()=>Gn,validateMnemonic:()=>Ln});function Gn(e){if(!Ln(e,Vn))throw Error(`Invalid mnemonic`);let t=Un(e);return{root:t,defaultPersona:D(t,`personal`,0)}}var Kn=`canary:duress-queue`,qn=null,Jn=null,Yn=null;function Xn(e){qn=e.encrypt,Jn=e.decrypt,Yn=e.getPinKey}function Zn(e){return Array.isArray(e)?e.every(e=>typeof e==`object`&&!!e&&typeof e.groupId==`string`&&e.message!=null):!1}async function Qn(){try{let e=localStorage.getItem(Kn);if(!e)return[];let t=JSON.parse(e);if(Zn(t))return t;if(t&&typeof t==`object`&&typeof t.entries==`string`){if(t.encrypted&&Jn&&Yn){let e=Yn();if(!e)return[];let n=await Jn(t.entries,e),r=JSON.parse(n);return Zn(r)?r:[]}let e=JSON.parse(t.entries);return Zn(e)?e:[]}return[]}catch{return[]}}async function $n(e){try{let t=JSON.stringify(e);if(qn&&Yn){let e=Yn();if(e){let n=await qn(t,e);localStorage.setItem(Kn,JSON.stringify({encrypted:!0,entries:n}));return}}localStorage.setItem(Kn,JSON.stringify({entries:t}))}catch{}}async function er(e){let t=await Qn(),n=t.filter(t=>t.groupId===e);return await $n(t.filter(t=>t.groupId!==e)),n.map(e=>e.message)}var tr=`canary:groups`,nr=`canary:identity`,rr=`canary:settings`,ir=`canary:pin-salt`,ar=`canary:active-group`,or=`canary:mnemonic`,sr=null;function cr(e){sr=e}function lr(){sr=null}var ur={theme:`dark`,pinEnabled:!0,autoLockMinutes:5,defaultRelays:[o],defaultReadRelays:[...n,o],defaultWriteRelays:[o]};function dr(e){try{let t=localStorage.getItem(e);return t===null?null:JSON.parse(t)}catch{return null}}function fr(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch{}}function pr(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function mr(e){return pr(e)&&e._encrypted===!0&&typeof e.ciphertext==`string`}async function hr(e,t){return{_encrypted:!0,ciphertext:await Ue(JSON.stringify(e),t)}}async function gr(e,t){return JSON.parse(await We(e.ciphertext,t))}function _r(e){return pr(e)?Object.values(e).some(e=>pr(e)&&e._seedEncrypted===!0):!1}function vr(e){return pr(e)&&e._privkeyEncrypted===!0}function yr(){return localStorage.getItem(ir)}function br(){let e=Ke(Ge());return localStorage.setItem(ir,e),e}function xr(){localStorage.removeItem(ir)}async function Sr(e,t){let n={};for(let[r,i]of Object.entries(e)){let{_seedEncrypted:e,...a}=i;n[r]={...a,seed:e?await We(i.seed,t):i.seed}}return n}function Cr(e){if(e.readRelays?.length||e.writeRelays?.length)return{readRelays:e.readRelays??[],writeRelays:e.writeRelays??[]};let t=e.relays??[],r=t.length>0?t:[o],i=new Set([...n,...r]);return{readRelays:Array.from(i),writeRelays:r}}function wr(e){let t={...ur,...e??{}};return t.defaultRelays?.length||(t.defaultRelays=[...ur.defaultRelays]),t.defaultReadRelays?.length||(t.defaultReadRelays=[...ur.defaultReadRelays]),t.defaultWriteRelays?.length||(t.defaultWriteRelays=[...ur.defaultWriteRelays]),t}function Tr(e){if(!pr(e))return{};let t={};for(let[n,r]of Object.entries(e)){if(!pr(r)||typeof r.name!=`string`)continue;let e=Cr(r);t[n]={...r,id:n,usedInvites:Array.isArray(r.usedInvites)?r.usedInvites.filter(e=>typeof e==`string`):[],latestInviteIssuedAt:typeof r.latestInviteIssuedAt==`number`?r.latestInviteIssuedAt:0,tolerance:typeof r.tolerance==`number`?r.tolerance:1,livenessInterval:typeof r.livenessInterval==`number`?r.livenessInterval:typeof r.rotationInterval==`number`?r.rotationInterval:604800,livenessCheckins:pr(r.livenessCheckins)?Object.fromEntries(Object.entries(r.livenessCheckins).filter(([,e])=>typeof e==`number`).map(([e,t])=>[e,t])):{},memberNames:pr(r.memberNames)?Object.fromEntries(Object.entries(r.memberNames).filter(([,e])=>typeof e==`string`).map(([e,t])=>[e,t])):void 0,lastPositions:pr(r.lastPositions)?Object.fromEntries(Object.entries(r.lastPositions).filter(([,e])=>pr(e)).map(([e,t])=>[e,t])):void 0,beaconPrecision:typeof r.beaconPrecision==`number`?r.beaconPrecision:5,duressPrecision:typeof r.duressPrecision==`number`?r.duressPrecision:9,nostrEnabled:typeof r.nostrEnabled==`boolean`?r.nostrEnabled:e.writeRelays.length>0||e.readRelays.length>0,...e}}return t}function Er(e){return!pr(e)||typeof e.pubkey!=`string`?null:{pubkey:e.pubkey,privkey:typeof e.privkey==`string`?e.privkey:void 0,nsec:typeof e.nsec==`string`?e.nsec:void 0,mnemonic:typeof e.mnemonic==`string`?e.mnemonic:void 0,displayName:typeof e.displayName==`string`?e.displayName:void 0,picture:typeof e.picture==`string`?e.picture:void 0,signerType:e.signerType===`nip07`?`nip07`:`local`}}function Dr(e){let t=localStorage.getItem(or);if(!t)return{identity:e,migrated:!1};let n=e,r=t.trim().replace(/\s+/g,` `);try{n&&Ln(r)&&(n={...n,mnemonic:r})}catch{}return localStorage.removeItem(or),{identity:n,migrated:!0}}function Or(e,t){if(typeof e==`string`&&e in t)return e;let n=Object.keys(t);return n.length>0?n[0]:null}async function kr(e){let t=dr(tr);if(t===null)return{groups:{},migrated:!1};if(mr(t)){if(!e)throw Error(`Encrypted groups require PIN unlock`);return{groups:Tr(await gr(t,e)),migrated:!1}}if(_r(t)){if(!e)throw Error(`Encrypted groups require PIN unlock`);return{groups:Tr(await Sr(t,e)),migrated:!0}}return{groups:Tr(t),migrated:e!==void 0}}function Ar(){let e=dr(tr);return e===null||mr(e)||_r(e)?{groups:{},migrated:!1}:{groups:Tr(e),migrated:!1}}async function jr(e){let t=dr(nr);if(t===null)return Dr(null);if(mr(t)){if(!e)throw Error(`Encrypted identity requires PIN unlock`);return Dr(Er(await gr(t,e)))}let n=t,r=e!==void 0;if(vr(t)){if(!e)throw Error(`Encrypted identity requires PIN unlock`);let i=t.privkey?await We(t.privkey,e):void 0,{_privkeyEncrypted:a,...o}=t;n={...o,privkey:i},r=!0}let i=Dr(Er(n));return{identity:i.identity,migrated:r||i.migrated}}function Mr(){let e=dr(nr);return e===null||mr(e)||vr(e)?Dr(null):Dr(Er(e))}async function Nr(e){let t=dr(ar);if(t===null)return{activeGroupId:null,migrated:!1};if(mr(t)){if(!e)throw Error(`Encrypted active group requires PIN unlock`);let n=await gr(t,e);return{activeGroupId:typeof n==`string`?n:null,migrated:!1}}return{activeGroupId:typeof t==`string`?t:null,migrated:e!==void 0}}function Pr(){let e=dr(ar);return e===null||mr(e)?{activeGroupId:null,migrated:!1}:{activeGroupId:typeof e==`string`?e:null,migrated:!1}}async function Fr(e,t){if(t){let[n,r,i]=await Promise.all([hr(e.groups,t),hr(e.identity,t),hr(e.activeGroupId,t)]);fr(tr,n),fr(nr,r),fr(ar,i)}else fr(tr,e.groups),fr(nr,e.identity),e.activeGroupId===null?localStorage.removeItem(ar):fr(ar,e.activeGroupId);fr(rr,e.settings),localStorage.removeItem(or)}async function Ir(){let e=l(),t=!!yr();if(e.settings.pinEnabled&&t&&sr===null){console.error(`[canary:storage] PIN enabled but key not loaded — state NOT persisted.`);return}try{await Fr(e,e.settings.pinEnabled&&sr!==null?sr:void 0)}catch(e){console.error(`[canary:storage] Persistence failed — state NOT persisted:`,e)}}function Lr(){return localStorage.getItem(ir)!==null}function Rr(){return wr(dr(rr))}async function zr(e){let t=yr();if(!t)throw Error(`No PIN salt found`);let n=await He(e,qe(t)),r=wr(dr(rr)),[i,a,o]=await Promise.all([kr(n),jr(n),Nr(n)]),s={view:`groups`,groups:i.groups,activeGroupId:Or(o.activeGroupId,i.groups),identity:a.identity,settings:r,personas:{},activePersonaId:null,deletedGroupIds:[]};cr(n),d(s),(i.migrated||a.migrated||o.migrated)&&await Fr(s,n)}function Br(){let e=wr(dr(rr)),t=Ar(),n=Mr(),r=Pr();d({view:`groups`,groups:t.groups,activeGroupId:Or(r.activeGroupId,t.groups),identity:n.identity,settings:e,personas:{},activePersonaId:null,deletedGroupIds:[]}),(t.migrated||n.migrated||r.migrated)&&Ir()}var Vr=0,Hr,Ur=Promise.resolve(),Wr=100;function Gr(){Xn({encrypt:Ue,decrypt:We,getPinKey:()=>sr}),c(()=>{let e=++Vr;clearTimeout(Hr),Hr=setTimeout(()=>{Ur=Ur.then(async()=>{e===Vr&&await Ir()}).catch(e=>{console.error(`[canary:storage] Serialised write failed:`,e)})},Wr)}),window.addEventListener(`pagehide`,()=>Kr())}function Kr(){clearTimeout(Hr),Vr++,Ir().catch(()=>{})}async function qr(e){let t=await He(e,qe(br()));cr(t);try{let e=l();await Fr({...e,settings:{...e.settings,pinEnabled:!0}},t)}catch(e){throw lr(),xr(),e}}async function Jr(){let e=l();await Fr({...e,settings:{...e.settings,pinEnabled:!1}}),lr(),xr()}var Yr=Symbol(`verified`),Xr=e=>e instanceof Object;function Zr(e){if(!Xr(e)||typeof e.kind!=`number`||typeof e.content!=`string`||typeof e.created_at!=`number`||typeof e.pubkey!=`string`||!e.pubkey.match(/^[a-f0-9]{64}$/)||!Array.isArray(e.tags))return!1;for(let t=0;t<e.tags.length;t++){let n=e.tags[t];if(!Array.isArray(n))return!1;for(let e=0;e<n.length;e++)if(typeof n[e]!=`string`)return!1}return!0}new TextDecoder(`utf-8`);var Qr=new TextEncoder,$r=class{generateSecretKey(){return _e.utils.randomSecretKey()}getPublicKey(e){return L(_e.getPublicKey(e))}finalizeEvent(e,t){let n=e;return n.pubkey=L(_e.getPublicKey(t)),n.id=ti(n),n.sig=L(_e.sign(F(ti(n)),t)),n[Yr]=!0,n}verifyEvent(e){if(typeof e[Yr]==`boolean`)return e[Yr];try{let t=ti(e);if(t!==e.id)return e[Yr]=!1,!1;let n=_e.verify(F(e.sig),F(t),F(e.pubkey));return e[Yr]=n,n}catch{return e[Yr]=!1,!1}}};function ei(e){if(!Zr(e))throw Error(`can't serialize event with wrong or missing properties`);return JSON.stringify([0,e.pubkey,e.created_at,e.kind,e.tags,e.content])}function ti(e){return L(me(Qr.encode(ei(e))))}var ni=new $r,ri=ni.generateSecretKey,ii=ni.getPublicKey,ai=ni.finalizeEvent,oi=ni.verifyEvent;function si(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name===`Uint8Array`}function ci(e){if(typeof e!=`boolean`)throw Error(`boolean expected, not ${e}`)}function li(e){if(!Number.isSafeInteger(e)||e<0)throw Error(`positive integer expected, got `+e)}function ui(e,t,n=``){let r=si(e),i=e?.length,a=t!==void 0;if(!r||a&&i!==t){let o=n&&`"${n}" `,s=a?` of length ${t}`:``,c=r?`length=${i}`:`type=${typeof e}`;throw Error(o+`expected Uint8Array`+s+`, got `+c)}return e}function di(e,t=!0){if(e.destroyed)throw Error(`Hash instance has been destroyed`);if(t&&e.finished)throw Error(`Hash#digest() has already been called`)}function fi(e,t){ui(e,void 0,`output`);let n=t.outputLen;if(e.length<n)throw Error(`digestInto() expects output buffer of length at least `+n)}function pi(e){return new Uint32Array(e.buffer,e.byteOffset,Math.floor(e.byteLength/4))}function mi(...e){for(let t=0;t<e.length;t++)e[t].fill(0)}new Uint8Array(new Uint32Array([287454020]).buffer)[0];function hi(e,t){if(typeof t!=`object`||!t)throw Error(`options must be defined`);return Object.assign(e,t)}function gi(e,t){if(e.length!==t.length)return!1;let n=0;for(let r=0;r<e.length;r++)n|=e[r]^t[r];return n===0}function _i(e){return Uint8Array.from(e)}var vi=e=>Uint8Array.from(e.split(``),e=>e.charCodeAt(0)),yi=vi(`expand 16-byte k`),bi=vi(`expand 32-byte k`),xi=pi(yi),Si=pi(bi);function H(e,t){return e<<t|e>>>32-t}function Ci(e){return e.byteOffset%4==0}var wi=64,Ti=16,Ei=2**32-1,Di=Uint32Array.of();function Oi(e,t,n,r,i,a,o,s){let c=i.length,l=new Uint8Array(wi),u=pi(l),d=Ci(i)&&Ci(a),f=d?pi(i):Di,p=d?pi(a):Di;for(let m=0;m<c;o++){if(e(t,n,r,u,o,s),o>=Ei)throw Error(`arx: counter overflow`);let h=Math.min(wi,c-m);if(d&&h===wi){let e=m/4;if(m%4!=0)throw Error(`arx: invalid block position`);for(let t=0,n;t<Ti;t++)n=e+t,p[n]=f[n]^u[t];m+=wi;continue}for(let e=0,t;e<h;e++)t=m+e,a[t]=i[t]^l[e];m+=h}}function ki(e,t){let{allowShortKeys:n,extendNonceFn:r,counterLength:i,counterRight:a,rounds:o}=hi({allowShortKeys:!1,counterLength:8,counterRight:!1,rounds:20},t);if(typeof e!=`function`)throw Error(`core must be a function`);return li(i),li(o),ci(a),ci(n),(t,s,c,l,u=0)=>{ui(t,void 0,`key`),ui(s,void 0,`nonce`),ui(c,void 0,`data`);let d=c.length;if(l===void 0&&(l=new Uint8Array(d)),ui(l,void 0,`output`),li(u),u<0||u>=Ei)throw Error(`arx: counter overflow`);if(l.length<d)throw Error(`arx: output (${l.length}) is shorter than data (${d})`);let f=[],p=t.length,m,h;if(p===32)f.push(m=_i(t)),h=Si;else if(p===16&&n)m=new Uint8Array(32),m.set(t),m.set(t,16),h=xi,f.push(m);else throw ui(t,32,`arx key`),Error(`invalid key size`);Ci(s)||f.push(s=_i(s));let g=pi(m);if(r){if(s.length!==24)throw Error(`arx: extended nonce must be 24 bytes`);r(h,g,pi(s.subarray(0,16)),g),s=s.subarray(16)}let _=16-i;if(_!==s.length)throw Error(`arx: nonce must be ${_} or 16 bytes`);if(_!==12){let e=new Uint8Array(12);e.set(s,a?0:12-s.length),s=e,f.push(s)}let v=pi(s);return Oi(e,h,g,v,c,l,u,o),mi(...f),l}}function U(e,t){return e[t++]&255|(e[t++]&255)<<8}var Ai=class{blockLen=16;outputLen=16;buffer=new Uint8Array(16);r=new Uint16Array(10);h=new Uint16Array(10);pad=new Uint16Array(8);pos=0;finished=!1;constructor(e){e=_i(ui(e,32,`key`));let t=U(e,0),n=U(e,2),r=U(e,4),i=U(e,6),a=U(e,8),o=U(e,10),s=U(e,12),c=U(e,14);this.r[0]=t&8191,this.r[1]=(t>>>13|n<<3)&8191,this.r[2]=(n>>>10|r<<6)&7939,this.r[3]=(r>>>7|i<<9)&8191,this.r[4]=(i>>>4|a<<12)&255,this.r[5]=a>>>1&8190,this.r[6]=(a>>>14|o<<2)&8191,this.r[7]=(o>>>11|s<<5)&8065,this.r[8]=(s>>>8|c<<8)&8191,this.r[9]=c>>>5&127;for(let t=0;t<8;t++)this.pad[t]=U(e,16+2*t)}process(e,t,n=!1){let r=n?0:2048,{h:i,r:a}=this,o=a[0],s=a[1],c=a[2],l=a[3],u=a[4],d=a[5],f=a[6],p=a[7],m=a[8],h=a[9],g=U(e,t+0),_=U(e,t+2),v=U(e,t+4),y=U(e,t+6),ee=U(e,t+8),te=U(e,t+10),b=U(e,t+12),x=U(e,t+14),S=i[0]+(g&8191),C=i[1]+((g>>>13|_<<3)&8191),w=i[2]+((_>>>10|v<<6)&8191),T=i[3]+((v>>>7|y<<9)&8191),E=i[4]+((y>>>4|ee<<12)&8191),D=i[5]+(ee>>>1&8191),O=i[6]+((ee>>>14|te<<2)&8191),k=i[7]+((te>>>11|b<<5)&8191),A=i[8]+((b>>>8|x<<8)&8191),j=i[9]+(x>>>5|r),M=0,N=M+S*o+5*h*C+5*m*w+5*p*T+5*f*E;M=N>>>13,N&=8191,N+=5*d*D+5*u*O+5*l*k+5*c*A+5*s*j,M+=N>>>13,N&=8191;let P=M+S*s+C*o+5*h*w+5*m*T+5*p*E;M=P>>>13,P&=8191,P+=5*f*D+5*d*O+5*u*k+5*l*A+5*c*j,M+=P>>>13,P&=8191;let F=M+S*c+C*s+w*o+5*h*T+5*m*E;M=F>>>13,F&=8191,F+=5*p*D+5*f*O+5*d*k+5*u*A+5*l*j,M+=F>>>13,F&=8191;let I=M+S*l+C*c+w*s+T*o+5*h*E;M=I>>>13,I&=8191,I+=5*m*D+5*p*O+5*f*k+5*d*A+5*u*j,M+=I>>>13,I&=8191;let ne=M+S*u+C*l+w*c+T*s+E*o;M=ne>>>13,ne&=8191,ne+=5*h*D+5*m*O+5*p*k+5*f*A+5*d*j,M+=ne>>>13,ne&=8191;let L=M+S*d+C*u+w*l+T*c+E*s;M=L>>>13,L&=8191,L+=D*o+5*h*O+5*m*k+5*p*A+5*f*j,M+=L>>>13,L&=8191;let re=M+S*f+C*d+w*u+T*l+E*c;M=re>>>13,re&=8191,re+=D*s+O*o+5*h*k+5*m*A+5*p*j,M+=re>>>13,re&=8191;let ie=M+S*p+C*f+w*d+T*u+E*l;M=ie>>>13,ie&=8191,ie+=D*c+O*s+k*o+5*h*A+5*m*j,M+=ie>>>13,ie&=8191;let ae=M+S*m+C*p+w*f+T*d+E*u;M=ae>>>13,ae&=8191,ae+=D*l+O*c+k*s+A*o+5*h*j,M+=ae>>>13,ae&=8191;let oe=M+S*h+C*m+w*p+T*f+E*d;M=oe>>>13,oe&=8191,oe+=D*u+O*l+k*c+A*s+j*o,M+=oe>>>13,oe&=8191,M=(M<<2)+M|0,M=M+N|0,N=M&8191,M>>>=13,P+=M,i[0]=N,i[1]=P,i[2]=F,i[3]=I,i[4]=ne,i[5]=L,i[6]=re,i[7]=ie,i[8]=ae,i[9]=oe}finalize(){let{h:e,pad:t}=this,n=new Uint16Array(10),r=e[1]>>>13;e[1]&=8191;for(let t=2;t<10;t++)e[t]+=r,r=e[t]>>>13,e[t]&=8191;e[0]+=r*5,r=e[0]>>>13,e[0]&=8191,e[1]+=r,r=e[1]>>>13,e[1]&=8191,e[2]+=r,n[0]=e[0]+5,r=n[0]>>>13,n[0]&=8191;for(let t=1;t<10;t++)n[t]=e[t]+r,r=n[t]>>>13,n[t]&=8191;n[9]-=8192;let i=(r^1)-1;for(let e=0;e<10;e++)n[e]&=i;i=~i;for(let t=0;t<10;t++)e[t]=e[t]&i|n[t];e[0]=(e[0]|e[1]<<13)&65535,e[1]=(e[1]>>>3|e[2]<<10)&65535,e[2]=(e[2]>>>6|e[3]<<7)&65535,e[3]=(e[3]>>>9|e[4]<<4)&65535,e[4]=(e[4]>>>12|e[5]<<1|e[6]<<14)&65535,e[5]=(e[6]>>>2|e[7]<<11)&65535,e[6]=(e[7]>>>5|e[8]<<8)&65535,e[7]=(e[8]>>>8|e[9]<<5)&65535;let a=e[0]+t[0];e[0]=a&65535;for(let n=1;n<8;n++)a=(e[n]+t[n]|0)+(a>>>16)|0,e[n]=a&65535;mi(n)}update(e){di(this),ui(e),e=_i(e);let{buffer:t,blockLen:n}=this,r=e.length;for(let i=0;i<r;){let a=Math.min(n-this.pos,r-i);if(a===n){for(;n<=r-i;i+=n)this.process(e,i);continue}t.set(e.subarray(i,i+a),this.pos),this.pos+=a,i+=a,this.pos===n&&(this.process(t,0,!1),this.pos=0)}return this}destroy(){mi(this.h,this.r,this.buffer,this.pad)}digestInto(e){di(this),fi(e,this),this.finished=!0;let{buffer:t,h:n}=this,{pos:r}=this;if(r){for(t[r++]=1;r<16;r++)t[r]=0;this.process(t,0,!0)}this.finalize();let i=0;for(let t=0;t<8;t++)e[i++]=n[t]>>>0,e[i++]=n[t]>>>8;return e}digest(){let{buffer:e,outputLen:t}=this;this.digestInto(e);let n=e.slice(0,t);return this.destroy(),n}};function ji(e){let t=(t,n)=>e(n).update(t).digest(),n=e(new Uint8Array(32));return t.outputLen=n.outputLen,t.blockLen=n.blockLen,t.create=t=>e(t),t}ji(e=>new Ai(e));function Mi(e,t,n,r,i,a=20){let o=e[0],s=e[1],c=e[2],l=e[3],u=t[0],d=t[1],f=t[2],p=t[3],m=t[4],h=t[5],g=t[6],_=t[7],v=i,y=n[0],ee=n[1],te=n[2],b=o,x=s,S=c,C=l,w=u,T=d,E=f,D=p,O=m,k=h,A=g,j=_,M=v,N=y,P=ee,F=te;for(let e=0;e<a;e+=2)b=b+w|0,M=H(M^b,16),O=O+M|0,w=H(w^O,12),b=b+w|0,M=H(M^b,8),O=O+M|0,w=H(w^O,7),x=x+T|0,N=H(N^x,16),k=k+N|0,T=H(T^k,12),x=x+T|0,N=H(N^x,8),k=k+N|0,T=H(T^k,7),S=S+E|0,P=H(P^S,16),A=A+P|0,E=H(E^A,12),S=S+E|0,P=H(P^S,8),A=A+P|0,E=H(E^A,7),C=C+D|0,F=H(F^C,16),j=j+F|0,D=H(D^j,12),C=C+D|0,F=H(F^C,8),j=j+F|0,D=H(D^j,7),b=b+T|0,F=H(F^b,16),A=A+F|0,T=H(T^A,12),b=b+T|0,F=H(F^b,8),A=A+F|0,T=H(T^A,7),x=x+E|0,M=H(M^x,16),j=j+M|0,E=H(E^j,12),x=x+E|0,M=H(M^x,8),j=j+M|0,E=H(E^j,7),S=S+D|0,N=H(N^S,16),O=O+N|0,D=H(D^O,12),S=S+D|0,N=H(N^S,8),O=O+N|0,D=H(D^O,7),C=C+w|0,P=H(P^C,16),k=k+P|0,w=H(w^k,12),C=C+w|0,P=H(P^C,8),k=k+P|0,w=H(w^k,7);let I=0;r[I++]=o+b|0,r[I++]=s+x|0,r[I++]=c+S|0,r[I++]=l+C|0,r[I++]=u+w|0,r[I++]=d+T|0,r[I++]=f+E|0,r[I++]=p+D|0,r[I++]=m+O|0,r[I++]=h+k|0,r[I++]=g+A|0,r[I++]=_+j|0,r[I++]=v+M|0,r[I++]=y+N|0,r[I++]=ee+P|0,r[I++]=te+F|0}var Ni=ki(Mi,{counterRight:!1,counterLength:4,allowShortKeys:!1});function Pi(e,t,n){return re(e),n===void 0&&(n=new Uint8Array(e.outputLen)),le(e,n,t)}var Fi=Uint8Array.of(0),Ii=Uint8Array.of();function Li(e,t,n,r=32){re(e),I(r,`length`);let i=e.outputLen;if(r>255*i)throw Error(`Length must be <= 255*HashLen`);let a=Math.ceil(r/i);n===void 0?n=Ii:ae(n,void 0,`info`);let o=new Uint8Array(a*i),s=le.create(e,t),c=s._cloneInto(),l=new Uint8Array(s.outputLen);for(let e=0;e<a;e++)Fi[0]=e+1,c.update(e===0?Ii:l).update(n).update(Fi).digestInto(l),o.set(l,i*e),s._cloneInto(c);return s.destroy(),c.destroy(),ie(l,Fi),o.slice(0,r)}var Ri=new TextDecoder(`utf-8`),zi=new TextEncoder,Bi=1,Vi=4294967295,Hi=65536;function Ui(e,t){return Pi(me,ce.getSharedSecret(e,F(`02`+t)).subarray(1,33),zi.encode(`nip44-v2`))}function Wi(e,t){let n=Li(me,e,t,76);return{chacha_key:n.subarray(0,32),chacha_nonce:n.subarray(32,44),hmac_key:n.subarray(44,76)}}function Gi(e){if(!Number.isSafeInteger(e)||e<1)throw Error(`expected positive integer`);if(e<=32)return 32;let t=2**(Math.floor(Math.log2(e-1))+1),n=t<=256?32:t/8;return n*(Math.floor((e-1)/n)+1)}function Ki(e){if(!Number.isSafeInteger(e)||e<Bi||e>65535)throw Error(`invalid plaintext size: must be between 1 and 65535 bytes`);let t=new Uint8Array(2);return new DataView(t.buffer).setUint16(0,e,!1),t}function qi(e){if(!Number.isSafeInteger(e)||e<Hi||e>Vi)throw Error(`invalid plaintext size: must be between 65536 and 4294967295 bytes`);let t=new Uint8Array(4);return new DataView(t.buffer).setUint32(0,e,!1),t}function Ji(e){let t=zi.encode(e),n=t.length;if(n<Bi||n>Vi)throw Error(`invalid plaintext size: must be between 1 and 4294967295 bytes`);return P(n>=Hi?P(new Uint8Array([0,0]),qi(n)):Ki(n),t,new Uint8Array(Gi(n)-n))}function Yi(e){let t=new DataView(e.buffer,e.byteOffset,e.byteLength),n=t.getUint16(0),r,i;if(n===0){if(r=t.getUint32(2),r<Hi)throw Error(`invalid padding`);i=6}else r=n,i=2;let a=e.subarray(i,i+r);if(r<Bi||r>Vi||a.length!==r||e.length!==i+Gi(r))throw Error(`invalid padding`);return Ri.decode(a)}function Xi(e,t,n){if(n.length!==32)throw Error(`AAD associated data must be 32 bytes`);return le(me,e,P(n,t))}function Zi(e){if(typeof e!=`string`)throw Error(`payload must be a valid string`);let t=e.length;if(t<132)throw Error(`invalid payload length: `+t);if(e[0]===`#`)throw Error(`unknown encryption version`);let n;try{n=N.decode(e)}catch(e){throw Error(`invalid base64: `+e.message)}let r=n.length;if(r<99)throw Error(`invalid data length: `+r);let i=n[0];if(i!==2)throw Error(`unknown encryption version `+i);return{nonce:n.subarray(1,33),ciphertext:n.subarray(33,-32),mac:n.subarray(-32)}}function Qi(e,t,n=ne(32)){let{chacha_key:r,chacha_nonce:i,hmac_key:a}=Wi(t,n),o=Ni(r,i,Ji(e)),s=Xi(a,o,n);return N.encode(P(new Uint8Array([2]),n,o,s))}function $i(e,t){let{nonce:n,ciphertext:r,mac:i}=Zi(e),{chacha_key:a,chacha_nonce:o,hmac_key:s}=Wi(t,n);if(!gi(Xi(s,r,n),i))throw Error(`invalid MAC`);return Yi(Ni(a,o,r))}function ea(e){if(!/^[0-9a-f]*$/i.test(e)||e.length%2!=0)throw Error(`Invalid hex string: "${e.slice(0,20)}${e.length>20?`…`:``}"`);let t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function ta(e){return Array.from(e,e=>e.toString(16).padStart(2,`0`)).join(``)}var na=class{pubkey;privkeyHex;constructor(e,t){this.pubkey=e,this.privkeyHex=t}async sign(e){return ai(e,ea(this.privkeyHex))}async encrypt(e,t){return Qi(e,Ui(ea(this.privkeyHex),t))}async decrypt(e,t){return $i(e,Ui(ea(this.privkeyHex),t))}},ra=class{pubkey;signingKey;constructor(e){this.signingKey=e.privateKey,this.pubkey=ta(e.publicKey)}async sign(e){return ai(e,this.signingKey)}};function ia(){return typeof window.nostr?.signEvent==`function`}async function aa(e){if(e.privkey&&e.pubkey)return{signer:new na(e.pubkey,e.privkey),signerType:`local`,pubkey:e.pubkey,privkey:e.privkey};let t=ri(),n=ii(t),r=ta(t);return{signer:new na(n,r),signerType:`local`,pubkey:n,privkey:r}}var oa=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],sa=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]);function ca(e,t){return(e>>>t|e<<32-t)>>>0}function la(e){let t=e.length*8,n=new Uint8Array(Math.ceil((e.length+9)/64)*64);n.set(e),n[e.length]=128;let r=new DataView(n.buffer);r.setUint32(n.length-8,Math.floor(t/4294967296),!1),r.setUint32(n.length-4,t>>>0,!1);let[i,a,o,s,c,l,u,d]=oa,f=new Uint32Array(64);for(let e=0;e<n.length;e+=64){for(let t=0;t<16;t++)f[t]=r.getUint32(e+t*4,!1);for(let e=16;e<64;e++){let t=f[e-15],n=f[e-2],r=ca(t,7)^ca(t,18)^t>>>3,i=ca(n,17)^ca(n,19)^n>>>10;f[e]=f[e-16]+r+f[e-7]+i>>>0}let t=i,n=a,p=o,m=s,h=c,g=l,_=u,v=d;for(let e=0;e<64;e++){let r=ca(h,6)^ca(h,11)^ca(h,25),i=h&g^~h&_,a=v+r+i+sa[e]+f[e]>>>0,o=(ca(t,2)^ca(t,13)^ca(t,22))+(t&n^t&p^n&p)>>>0;v=_,_=g,g=h,h=m+a>>>0,m=p,p=n,n=t,t=a+o>>>0}i=i+t>>>0,a=a+n>>>0,o=o+p>>>0,s=s+m>>>0,c=c+h>>>0,l=l+g>>>0,u=u+_>>>0,d=d+v>>>0}n.fill(0),f.fill(0);let p=new Uint8Array(32),m=new DataView(p.buffer);return m.setUint32(0,i,!1),m.setUint32(4,a,!1),m.setUint32(8,o,!1),m.setUint32(12,s,!1),m.setUint32(16,c,!1),m.setUint32(20,l,!1),m.setUint32(24,u,!1),m.setUint32(28,d,!1),p}var ua=64;function da(e,t){let n=e.length>ua?la(e):e,r=new Uint8Array(ua);r.set(n);let i=new Uint8Array(ua),a=new Uint8Array(ua);for(let e=0;e<ua;e++)i[e]=r[e]^54,a[e]=r[e]^92;let o=ha(i,t),s=la(o),c=ha(a,s),l=la(c);return r.fill(0),i.fill(0),a.fill(0),s.fill(0),o.fill(0),c.fill(0),n!==e&&n.fill(0),l}function fa(){let e=new Uint8Array(32);crypto.getRandomValues(e);let t=pa(e);return e.fill(0),t}function W(e){if(e.length%2!=0)throw Error(`hexToBytes: odd-length hex string (${e.length} chars)`);let t=new Uint8Array(e.length/2);for(let n=0;n<t.length;n++){let r=e.slice(n*2,n*2+2);if(!/^[0-9a-fA-F]{2}$/.test(r))throw TypeError(`Invalid hex character at position ${n*2}`);t[n]=parseInt(r,16)}return t}function pa(e){let t=``;for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,`0`);return t}function ma(e,t){if(!Number.isInteger(t)||t<0||t+2>e.length)throw RangeError(`readUint16BE: offset ${t} out of bounds for length ${e.length}`);return(e[t]<<8|e[t+1])>>>0}function ha(...e){let t=e.reduce((e,t)=>e+t.length,0),n=new Uint8Array(t),r=0;for(let t of e)n.set(t,r),r+=t.length;return n}function ga(e){let t=``;for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return btoa(t)}function _a(e){let t=atob(e),n=new Uint8Array(t.length);for(let e=0;e<t.length;e++)n[e]=t.charCodeAt(e);return n}function va(e,t){let n=Math.max(e.length,t.length),r=new Uint8Array(n),i=new Uint8Array(n);r.set(e),i.set(t);let a=e.length^t.length;for(let e=0;e<n;e++)a|=r[e]^i[e];return a===0}var ya=new TextEncoder;function ba(e,t){return va(ya.encode(e),ya.encode(t))}var xa=`ability.able.about.above.absent.absorb.abstract.absurd.access.accident.account.accuse.achieve.acid.acorn.acoustic.acquire.across.act.action.actor.actress.actual.adapt.add.addict.address.adjust.admiral.admit.adult.advance.advice.aerobic.affair.afford.afraid.again.age.agent.agree.ahead.aim.air.airport.aisle.alarm.album.alcohol.alert.alien.all.alley.allow.almost.alone.alpha.alpine.already.also.always.amateur.amazing.amber.among.amount.amused.analyst.anchor.ancient.anger.angle.animal.ankle.announce.annual.another.answer.antenna.antique.anvil.anxiety.any.apart.apology.appear.apple.approve.april.apron.arch.arctic.area.arena.argue.arm.armed.armor.army.around.arrange.arrive.arrow.art.artefact.artist.artwork.ask.aspect.asset.assist.assume.asthma.athlete.atom.attack.attend.attitude.attract.auction.audit.august.aunt.author.auto.autumn.average.avocado.avoid.awake.aware.away.awesome.awful.awkward.axis.baby.bachelor.bacon.badge.badger.bag.bakery.balance.balcony.ball.balm.bamboo.banana.banjo.banner.bar.barely.bargain.barrel.base.basic.basil.basket.battle.beach.beacon.bean.beauty.because.become.beef.beetle.before.begin.behave.behind.belfry.believe.below.belt.bench.benefit.berry.best.better.between.beyond.bicycle.bid.bike.bind.biology.birch.bird.birth.bishop.bitter.black.blame.blanket.bleak.bless.bloom.blossom.blouse.blue.blur.blush.board.boat.bobcat.body.boil.bone.bonfire.bonus.book.boost.border.boring.borrow.boss.bottom.bounce.bouquet.box.boy.bracket.brain.branch.brand.brass.brave.bread.breaker.breeze.brick.bridge.brief.bright.bring.brisk.broccoli.bronze.brook.broom.brother.brown.brush.bubble.buckle.buddy.budget.buffalo.bugle.build.bulb.bulk.bumble.bundle.bunker.burger.burrow.burst.bus.bushel.business.busy.butter.buyer.buzz.cabbage.cabin.cable.cactus.cage.cairn.cake.call.calm.camel.camera.camp.can.canal.cancel.candy.canoe.canopy.canvas.canyon.capable.cape.capital.captain.car.caravan.carbon.card.cargo.carpet.carry.cart.case.cash.casino.castle.casual.cat.catalog.catch.category.cattle.caught.cause.caution.cave.cedar.ceiling.celery.cellar.cement.census.century.cereal.certain.chair.chalk.champion.change.chapter.charge.charter.chase.chat.cheap.check.cheese.chef.cherry.chest.chestnut.chicken.chief.child.chimney.choice.choose.chuckle.chunk.churn.cider.cigar.cinnamon.circle.citizen.city.civil.claim.clam.clap.clarify.claw.clay.clean.clerk.clever.click.client.cliff.climb.clinic.clip.cloak.clock.clog.close.cloth.cloud.clown.club.clump.cluster.clutch.coach.coast.cobalt.cocoa.coconut.code.codex.coffee.coil.coin.collect.color.column.combine.come.comet.comfort.comic.common.company.concert.condor.conduct.confirm.congress.connect.consider.consul.control.convince.cook.cool.copper.copy.coral.core.cork.corn.cornet.correct.cosmos.cost.cotton.couch.cougar.country.couple.course.cousin.cover.coyote.crack.cradle.craft.cram.crane.crater.crawl.cream.credit.creek.crew.cricket.crisp.critic.croft.crop.cross.crouch.crowd.crown.crucial.cruise.crumble.crunch.cry.crystal.cube.culture.cup.cupboard.curious.current.curtain.curve.cushion.custom.cute.cycle.cypress.dad.dagger.dahlia.damp.damsel.dance.danger.dapple.daring.dash.daughter.dawn.day.deal.debate.decade.december.decide.decline.decorate.decrease.defense.define.defy.degree.delay.deliver.delta.demand.demise.denial.denim.dentist.depart.depend.deposit.depot.depth.deputy.derive.describe.desert.design.desk.detail.detect.develop.device.devote.diagram.dial.diamond.diary.dice.diesel.diet.differ.digital.dignity.dilemma.dinner.dinosaur.direct.dirt.disagree.discover.dish.display.distance.divert.divide.divorce.dizzy.doctor.document.dog.doll.dolphin.domain.donate.donkey.donor.door.dorsal.double.dove.draft.drafter.dragon.drake.drama.drastic.draw.dream.dress.drift.drifter.drill.drink.drive.drop.droplet.drum.drummer.dry.duck.dulcet.dune.dungeon.during.dusk.dust.dutch.duty.dwarf.dynamic.eager.eagle.early.earn.earth.easily.east.easy.echo.ecology.economy.edge.edgeway.edit.educate.effort.egg.eight.either.elbow.elder.electric.elegant.element.elephant.elevator.elite.elm.else.embark.ember.embody.embrace.emerald.emerge.emotion.employ.empower.empty.enable.enact.end.endless.endorse.enemy.energy.enforce.engage.engine.enhance.enjoy.enlist.enough.enrich.enroll.ensign.ensure.enter.entire.entry.envelope.episode.epoch.equal.equip.era.erase.erode.erosion.error.escape.essay.essence.estate.estuary.eternal.ether.ethics.everest.evidence.evil.evolve.exact.example.exchange.excite.exclude.excuse.execute.exercise.exhaust.exhibit.exist.exit.exotic.expand.expect.explain.express.extend.extra.eye.eyebrow.fabric.face.faculty.fade.faint.faith.falcon.fall.fallow.false.fame.family.famous.fancy.fantasy.farm.fashion.fat.father.fathom.fatigue.favorite.feature.february.federal.fee.feed.feel.female.fence.fennel.fern.festival.fetch.fever.fiber.fiction.fiddle.field.figure.file.film.filter.final.finch.find.finger.finish.fire.firm.first.fiscal.fish.fit.fitness.fix.fjord.flag.flagon.flame.flannel.flash.flat.flavor.flicker.flight.flint.flip.float.flock.floor.floret.fluid.flush.flutter.fly.foal.foam.focus.fog.foil.fold.follow.food.foot.force.forest.forge.forget.fork.fortune.forum.forward.fossil.foster.found.foundry.fox.foxglove.fragile.frame.frequent.fresco.fresh.friend.fringe.frog.front.frost.frown.frozen.fruit.fuel.fun.funny.furnace.furrow.future.gadget.gain.galaxy.gallery.galley.game.gap.garage.garbage.garden.garland.garlic.garment.garnet.gas.gasp.gate.gather.gauge.gaze.gazelle.general.genius.genre.gentle.genuine.gesture.geyser.giant.gibbon.gift.giggle.ginger.giraffe.girl.give.glacier.glad.glance.glare.glass.glen.glide.glimpse.globe.gloom.glory.glove.glow.glue.goat.goblet.goddess.gold.golden.good.goose.gopher.gorge.gorilla.gospel.gossip.govern.gown.grab.grace.grain.granite.grant.grape.grass.gravity.great.green.grid.grocery.group.grow.grunt.guard.guess.guide.guilt.guitar.guppy.gust.gym.habit.half.hamlet.hammer.hammock.hamster.hand.happy.harbor.hard.harness.harvest.hat.have.hawk.hawthorn.head.health.heart.hearth.heavy.hedgehog.height.hello.helmet.help.hen.herald.hermit.hero.heron.hickory.hidden.high.hill.hint.hip.hire.history.hobby.hockey.hold.hole.holiday.hollow.home.homeward.honey.hood.hope.horizon.horn.hornet.horse.hospital.host.hotel.hour.hover.howler.hub.huge.human.humble.humor.hundred.hungry.hunt.hunter.hurdle.hurry.husband.hybrid.ice.icon.idea.identify.idle.igloo.ignore.ill.image.imitate.immune.impact.improve.inch.include.income.increase.index.indicate.indigo.indoor.industry.infant.inflict.inform.inhale.inherit.initial.inject.inkwell.inlet.inmate.inner.innocent.input.inquiry.insect.inside.inspire.install.intact.interest.into.invest.invite.involve.inward.iris.iron.island.issue.item.ivory.jacket.jade.jaguar.jar.jasmine.javelin.jazz.jeans.jelly.jersey.jewel.job.join.joke.jostle.journal.journey.joy.jubilee.judge.juice.jumble.jump.junco.jungle.junior.juniper.just.kangaroo.kayak.keen.keep.keeper.kelp.kennel.kernel.kestrel.ketchup.kettle.key.kick.kid.kidney.kind.kindle.kingdom.kinglet.kipper.kiss.kit.kitchen.kite.kitten.kiwi.knapsack.knee.knife.knock.lab.label.labor.ladder.lady.lake.lamp.language.lantern.lapis.laptop.larch.large.later.latin.laugh.laundry.laurel.lava.lavender.law.lawn.layer.lazy.leader.leaf.learn.leave.lecture.left.leg.legal.legend.leisure.lemon.lend.length.lens.leopard.lesson.letter.level.liar.liberty.library.license.lichen.life.lift.light.like.limit.linden.link.linnet.lion.liquid.list.little.live.lizard.llama.load.loan.lobster.local.lock.locust.lodge.logic.long.loom.loop.lottery.lotus.loud.lounge.love.loyal.lucky.luggage.lumber.lumen.lunar.lunch.luxury.machine.mackerel.magic.magnet.main.major.make.mammal.man.manage.mandate.mango.mansion.mantis.manual.maple.marble.march.margin.marine.market.marriage.marsh.marten.mask.masonry.mass.master.match.material.math.matrix.matter.maximum.maze.meadow.mean.measure.mechanic.medal.media.melody.melt.member.memory.mention.menu.mercy.merge.merit.merlin.merry.mesa.mesh.message.metal.method.micron.middle.midnight.milk.millet.million.mimic.mind.minimum.minnow.minor.minute.miracle.mirage.mirror.miss.mistake.mix.mixed.mixture.moat.mobile.model.modify.mohawk.mom.moment.monarch.mongrel.monitor.monkey.month.moon.moose.moral.more.morning.mortar.mosaic.mosquito.mother.motion.motor.mountain.mouse.move.movie.much.muffin.mullet.multiply.muscle.museum.mushroom.music.muslin.mussel.must.mustang.mutual.myrtle.myself.mystery.myth.naive.name.napkin.narrow.narwhal.nation.nature.near.neck.nectar.need.negative.neither.nephew.nest.nester.net.nettle.network.neutral.never.news.newt.next.nice.nimble.noble.noggin.noise.nomad.nominee.noodle.normal.north.nose.notable.note.nothing.notice.novel.now.nuclear.number.nurse.nut.nutmeg.oak.oakmoss.oasis.obey.object.oblige.observe.obsidian.obtain.ocean.octave.october.odor.off.offer.office.often.oil.okay.old.olive.olympic.omit.once.onion.online.only.onyx.opal.open.opera.opinion.oppose.option.orange.orbit.orchard.orchid.order.ordinary.organ.orient.original.oriole.orphan.osprey.ostrich.other.otter.outdoor.outer.outpost.output.outside.oval.oven.over.own.owner.oxygen.oyster.ozone.pact.paddle.page.pagoda.palace.palm.panda.panel.panther.paper.parade.parent.park.parrot.party.pass.patch.path.patient.patrol.pattern.pause.pave.payment.peanut.peasant.pelican.pen.pencil.people.pepper.perfect.permit.person.phone.photo.phrase.physical.piano.picnic.picture.pigeon.pill.pilot.pink.pioneer.pipe.pitch.pizza.place.planet.plastic.plate.play.please.pledge.pluck.plug.poem.poet.point.polar.pole.police.pond.pony.pool.popular.portion.position.possible.post.potato.pottery.powder.power.practice.praise.predict.prefer.prepare.present.pretty.prevent.price.pride.primary.print.priority.private.prize.process.produce.profit.program.project.promote.proof.property.prosper.protect.proud.provide.public.pudding.pull.pulp.pulse.pumpkin.puppy.purchase.purity.purpose.purse.push.put.puzzle.pyramid.quality.quantum.quarter.question.quick.quiz.quote.rabbit.race.rack.radar.radio.rail.rain.raise.rally.ramp.ranch.random.range.rapid.rare.rate.rather.raven.raw.razor.ready.real.reason.rebuild.recall.receive.recipe.record.recycle.reduce.reflect.reform.refuse.region.regular.relax.release.relief.rely.remain.remember.remove.render.renew.rent.reopen.repair.repeat.replace.report.require.rescue.resource.response.result.retire.retreat.return.reunion.reveal.review.reward.rhythm.rib.ribbon.rice.rich.ride.ridge.rifle.ring.ripple.risk.ritual.rival.river.road.roast.robot.robust.rocket.romance.roof.rookie.room.rose.rotate.round.route.royal.rubber.rug.rule.run.runway.rural.saddle.sadness.safe.salad.salmon.salon.salt.salute.same.sample.sand.satisfy.satoshi.sauce.sausage.save.say.scale.scan.school.science.scorpion.scout.screen.script.scrub.search.season.seat.second.secret.section.security.seed.seek.segment.select.sell.seminar.senior.sense.sentence.service.session.settle.setup.seven.shadow.shallow.share.shed.shell.sheriff.shield.shift.shine.shoe.shoot.shop.short.shoulder.shove.shrimp.shuffle.shy.sibling.sick.side.sight.sign.silent.silk.silly.silver.similar.simple.since.sister.situate.six.size.skate.sketch.ski.skill.skin.skirt.slab.slam.sleep.slice.slide.slight.slim.small.smart.smile.smooth.snack.snake.snow.soap.soccer.social.sock.soda.soft.solar.soldier.solid.solution.solve.someone.song.soon.sort.soul.sound.soup.source.south.space.spare.spatial.speak.special.speed.spell.spend.sphere.spice.spider.spike.spin.spirit.spoil.sponsor.spoon.sport.spot.spray.spread.spring.spy.square.squirrel.stable.stadium.staff.stage.stairs.stamp.stand.start.state.stay.steak.stem.step.stereo.stick.still.stock.stomach.stone.stool.story.stove.strategy.street.strong.student.style.subject.submit.subway.success.such.sudden.sugar.suggest.suit.summer.sunny.sunset.super.supply.supreme.sure.surface.surge.surprise.surround.survey.sustain.swap.swarm.sweet.swift.swim.swing.switch.sword.symbol.syrup.system.table.tackle.tag.talent.talk.tape.task.taste.taxi.teach.team.tell.tennis.term.test.text.thank.theme.then.theory.they.this.thought.thrive.throw.thumb.thunder.ticket.tide.tiger.tilt.timber.time.tiny.tip.tired.tissue.title.toast.today.toddler.together.toilet.token.tomato.tomorrow.tone.tonight.tool.tooth.top.topic.topple.torch.tortoise.toss.total.tourist.tower.town.toy.track.trade.traffic.train.transfer.trap.travel.tray.treat.trend.tribe.trick.trigger.trim.trip.trophy.truck.true.trumpet.truth.try.tuition.tunnel.turkey.turn.turtle.twelve.twenty.twice.twin.twist.two.type.typical.umbrella.unable.unaware.uncle.uncover.under.undo.unfair.unfold.uniform.unique.unit.universe.unknown.unlock.until.unusual.update.upgrade.uphold.upon.upper.upset.urban.urge.usage.use.used.useful.useless.usual.utility.vague.valid.valley.valve.vapor.various.vast.vehicle.velvet.vendor.venue.verb.verify.version.very.vessel.veteran.viable.vibrant.vicious.victory.video.village.vintage.violin.virtual.visa.visit.visual.vital.vivid.vocal.voice.volcano.vote.voyage.wagon.walk.wall.walnut.want.warm.warrior.wash.wasp.water.wave.way.wealth.weasel.web.wedding.weekend.welcome.west.wet.whale.what.wheat.wheel.when.whip.whisper.wide.width.wife.wild.will.win.window.wine.wing.wink.winner.winter.wire.wisdom.wise.wish.witness.wolf.woman.wonder.wool.word.work.world.worry.worth.wreck.wrestle.yard.year.yellow.you.young.youth.zebra.zero.zone.zoo`.split(`.`);Object.freeze(xa);var Sa=2048,Ca=new Map;for(let e=0;e<xa.length;e++)Ca.set(xa[e],e);function wa(e){if(!Number.isInteger(e)||e<0||e>=2048)throw RangeError(`Wordlist index out of range: ${e} (must be an integer 0-${Sa-1})`);return xa[e]}var Ta={format:`words`,count:1};function Ea(e,t=1,n=xa){if(n.length!==2048)throw RangeError(`Wordlist must contain exactly 2048 entries`);if(!Number.isInteger(t)||t<1||t>16)throw RangeError(`Word count must be an integer 1–16`);if(e.length<t*2)throw RangeError(`Not enough bytes for requested word count`);let r=[];for(let i=0;i<t;i++){let t=ma(e,i*2)%n.length;r.push(n[t])}return r}var Da=[0,2,2,3,3,3,4,4,5,5,6];function Oa(e,t=4){if(!Number.isInteger(t)||t<1||t>10)throw RangeError(`PIN digits must be an integer 1–10`);if(e.length===0)throw RangeError(`Cannot encode empty byte array as PIN`);let n=Da[t];if(e.length<n)throw RangeError(`Not enough bytes for ${t}-digit PIN: need ${n}, got ${e.length}`);let r=10**t;if(n>4){let i=0n;for(let t=0;t<n;t++)i=i*256n+BigInt(e[t]);return Number(i%BigInt(r)).toString().padStart(t,`0`)}let i=0;for(let t=0;t<n;t++)i=i*256+e[t]>>>0;return(i%r).toString().padStart(t,`0`)}function ka(e,t=8){if(!Number.isInteger(t)||t<1||t>64)throw RangeError(`Hex length must be an integer 1–64`);let n=Math.ceil(t/2);if(e.length<n)throw RangeError(`Not enough bytes: need ${n}, got ${e.length}`);let r=``;for(let t=0;t<n&&t<e.length;t++)r+=e[t].toString(16).padStart(2,`0`);return r.slice(0,t)}function Aa(e,t=Ta){switch(t.format){case`words`:return Ea(e,t.count??1,t.wordlist).join(` `);case`pin`:return Oa(e,t.digits??4);case`hex`:return ka(e,t.length??8);default:throw Error(`Unsupported encoding format: ${t.format}`)}}var ja=new TextEncoder;function Ma(e){return ja.encode(e)}function Na(e){if(!Number.isInteger(e)||e<0||e>4294967295)throw RangeError(`Counter must be an integer 0–4294967295, got ${e}`);let t=new Uint8Array(4);return new DataView(t.buffer).setUint32(0,e,!1),t}var Pa=16;function Fa(e){let t=typeof e==`string`?W(e):e;if(t.length<Pa)throw RangeError(`Secret must be at least ${Pa} bytes, got ${t.length}`);return t}function Ia(e,t,n,r){if(!t||!t.trim())throw Error(`context must be a non-empty string`);if(r!==void 0&&!r.trim())throw Error(`identity must be a non-empty string when provided`);if(r!==void 0&&r.includes(`\0`))throw Error(`identity must not contain null bytes`);return da(Fa(e),r?ha(Ma(t),new Uint8Array([0]),Ma(r),Na(n)):ha(Ma(t),Na(n)))}function La(e,t,n,r){if(t.includes(`\0`))throw Error(`context must not contain null bytes`);return Ia(e,t,n,r)}function Ra(e,t,n,r=Ta,i){if(t.includes(`\0`))throw Error(`context must not contain null bytes`);if(i!==void 0&&i.includes(`\0`))throw Error(`identity must not contain null bytes`);return Aa(La(e,t,n,i),r)}function za(e,t,n,r,i=Ta){if(!t||!t.trim())throw Error(`namespace must be a non-empty string`);if(t.includes(`\0`))throw Error(`namespace must not contain null bytes`);if(!n[0]||!n[1]||!n[0].trim()||!n[1].trim())throw Error(`Both roles must be non-empty strings`);if(n[0].includes(`\0`)||n[1].includes(`\0`))throw Error(`Roles must not contain null bytes`);if(n[0]===n[1])throw Error(`Roles must be distinct, got ["${n[0]}", "${n[1]}"]`);return{[n[0]]:Aa(Ia(e,`pair\0${t}\0${n[0]}`,r),i),[n[1]]:Aa(Ia(e,`pair\0${t}\0${n[1]}`,r),i)}}var Ba=604800;function Va(e,t=Ba){if(!Number.isFinite(e)||e<0)throw RangeError(`timestampSec must be a non-negative finite number, got ${e}`);if(!Number.isFinite(t)||t<=0)throw RangeError(`rotationIntervalSec must be a positive finite number, got ${t}`);let n=Math.floor(e/t);if(n>4294967295)throw RangeError(`Counter exceeds uint32 range (${n}). Use a larger rotation interval.`);return n}function Ha(e){return new TextEncoder().encode(e)}var Ua=/^[0-9a-f]{64}$/;function Wa(e){if(!Ua.test(e))throw Error(`seedHex must be a 64-character lowercase hex string (32 bytes)`)}function Ga(e){if(e.length!==32)throw Error(`AES-256-GCM requires a 32-byte key`)}function Ka(e){return Wa(e),da(W(e),Ha(`canary:sync:key`))}async function qa(e,t){Ga(e);let n=crypto.getRandomValues(new Uint8Array(12)),r=await crypto.subtle.importKey(`raw`,e,{name:`AES-GCM`},!1,[`encrypt`]),i=await crypto.subtle.encrypt({name:`AES-GCM`,iv:n},r,Ha(t));return ga(ha(n,new Uint8Array(i)))}async function Ja(e,t){Ga(e);let n=_a(t);if(n.length<28)throw Error(`decryptEnvelope: encoded data too short (minimum 28 bytes: 12-byte IV + 16-byte GCM tag)`);let r=n.slice(0,12),i=n.slice(12),a=await crypto.subtle.importKey(`raw`,e,{name:`AES-GCM`},!1,[`decrypt`]),o;try{o=await crypto.subtle.decrypt({name:`AES-GCM`,iv:r},a,i)}catch{throw Error(`decryptEnvelope: decryption failed — wrong key or tampered data`)}return new TextDecoder().decode(o)}function Ya(e,t,n){return k(e,`canary:group:${t}`,n)}function Xa(e){return pa(la(Ha(e)))}var Za=new TextEncoder;function Qa(e){return Za.encode(e)}function $a(e){if(!Number.isInteger(e)||e<0||e>4294967295)throw RangeError(`Counter must be an integer 0–4294967295, got ${e}`);let t=new Uint8Array(4);return new DataView(t.buffer).setUint32(0,e,!1),t}var eo=16,to=100;function no(e){let t=typeof e==`string`?W(e):e;if(t.length<eo)throw RangeError(`Secret must be at least ${eo} bytes, got ${t.length}`);return t}function ro(e,t,n,r,i=Ta,a,o){if(!Number.isInteger(a)||a<0)throw RangeError(`maxTolerance must be a non-negative integer`);if(a>10)throw RangeError(`maxTolerance must be <= 10, got ${a}`);let s=new Set,c=2*a,l=Math.max(0,r-c),u=Math.min(4294967295,r+c);for(let n=l;n<=u;n++)if(s.add(Ra(e,t,n,i)),o)for(let r of o)s.add(Ra(e,t,n,i,r));let d=no(e),f=ha(Qa(t+`:duress`),new Uint8Array([0]),Qa(n),$a(r)),p=da(d,f),m=Aa(p,i),h=1;for(;s.has(m)&&h<=255;)p=da(d,ha(f,new Uint8Array([h]))),m=Aa(p,i),h++;if(s.has(m))throw Error(`Duress token collision unresolvable after 255 retries`);return m}function io(e,t,n,r,i,a){let o=a?.encoding??Ta,s=a?.tolerance??0;if(!Number.isInteger(s)||s<0)throw RangeError(`Tolerance must be a non-negative integer`);if(s>10)throw RangeError(`Tolerance must be <= 10, got ${s}`);if(i.length>to)throw RangeError(`identities array must not exceed ${to} entries, got ${i.length}`);let c=r.toLowerCase().trim().replace(/\s+/g,` `),l=Math.max(0,n-s),u=Math.min(4294967295,n+s),d=null;for(let r of i)ba(c,Ra(e,t,n,o,r))&&(d=r);let f=[];for(let n of i){let r=!1;for(let a=l;a<=u;a++)ba(c,ro(e,t,n,a,o,s,i))&&(r=!0);r&&f.push(n)}let p=null;for(let r of i)for(let i=l;i<=u;i++)i!==n&&ba(c,Ra(e,t,i,o,r))&&(p=r);let m=!1;for(let n=l;n<=u;n++)ba(c,Ra(e,t,n,o))&&(m=!0);return f.length>0?{status:`duress`,identities:f}:d?{status:`valid`,identities:[d]}:p?{status:`valid`,identities:[p]}:m?{status:`valid`}:{status:`invalid`}}function ao(e,t,n,r){return da(no(e),ha(Qa(t+`:alive`),new Uint8Array([0]),Qa(n),$a(r)))}var oo=Object.freeze({family:Object.freeze({wordCount:1,rotationInterval:Ba,description:`Casual verification for family and friends. Single word, weekly rotation. Adequate for live voice/video calls where the attacker gets one attempt. NOT suitable for text-based verification — 11 bits of entropy is trivially brute-forceable without rate limiting.`}),"field-ops":Object.freeze({wordCount:2,rotationInterval:86400,description:`High-security preset for journalism, activism, and field operations. Two-word phrases (~22 bits) with daily rotation. Use burn-after-use for maximum protection.`}),enterprise:Object.freeze({wordCount:2,rotationInterval:172800,description:`Enterprise incident response. Two-word phrases with 48-hour rotation. Balances security with operational convenience for larger teams.`}),event:Object.freeze({wordCount:1,rotationInterval:14400,description:`Temporary groups for conferences, festivals, and meetups. Single word with 4-hour rotation. Fast setup, easy to share at the door.`})}),so=/^[0-9a-f]{64}$/,co=100;function lo(e){if(!so.test(e))throw Error(`Invalid member pubkey: expected 64 hex characters, got ${e.length} chars`)}function uo(e){if(typeof e.name!=`string`||e.name.length===0)throw Error(`name must be a non-empty string`);if(e.name.length>256)throw Error(`name must be at most 256 characters`);if(e.preset!==void 0&&(typeof e.preset!=`string`||!Object.hasOwn(oo,e.preset)))throw Error(`Unknown preset: "${e.preset}". Valid presets: ${Object.keys(oo).join(`, `)}`);let t=Math.floor(Date.now()/1e3),n=e.preset===void 0?void 0:oo[e.preset],r=e.rotationInterval??n?.rotationInterval??604800,i=e.wordCount??n?.wordCount??1,a=e.tolerance??1;if(!Number.isInteger(r)||r<=0)throw Error(`rotationInterval must be a positive integer, got ${r}`);if(i!==1&&i!==2&&i!==3)throw Error(`wordCount must be 1, 2, or 3, got ${i}`);if(!Number.isInteger(a)||a<0||a>10)throw RangeError(`tolerance must be an integer 0–10, got ${a}`);if(e.beaconInterval!==void 0&&(!Number.isInteger(e.beaconInterval)||e.beaconInterval<=0))throw Error(`beaconInterval must be a positive integer, got ${e.beaconInterval}`);if(e.beaconPrecision!==void 0&&(!Number.isInteger(e.beaconPrecision)||e.beaconPrecision<1||e.beaconPrecision>11))throw Error(`beaconPrecision must be an integer between 1 and 11, got ${e.beaconPrecision}`);for(let t of e.members)lo(t);if(new Set(e.members).size!==e.members.length)throw Error(`Duplicate pubkeys in members array`);if(e.creator!==void 0&&(lo(e.creator),!e.members.includes(e.creator)))throw Error(`creator must be in members`);return i===1&&e.members.length>=10&&console.warn(`[canary-kit] Group has ${e.members.length} members with 1-word encoding. CANARY spec recommends 2+ words for groups of 10+ members to avoid duress collision (~2.2% at 10 members).`),{name:e.name,seed:fa(),members:[...e.members],rotationInterval:r,wordCount:i,tolerance:a,wordlist:e.wordlist??`en-v1`,counter:Va(t,r),usageOffset:0,createdAt:t,beaconInterval:e.beaconInterval??300,beaconPrecision:e.beaconPrecision??6,admins:e.creator?[e.creator]:[],epoch:0,consumedOps:[]}}function fo(e){let t=Va(Math.floor(Date.now()/1e3),e.rotationInterval),n=e.counter+e.usageOffset+1;if(n>t+100)throw RangeError(`Cannot advance counter: effective counter ${n} would exceed time-based counter ${t} + MAX_COUNTER_OFFSET (100)`);return{...e,usageOffset:e.usageOffset+1}}function po(e){return{...e,seed:fa(),usageOffset:0}}function mo(e,t){if(lo(t),e.members.includes(t))return e;if(e.members.length>=co)throw Error(`Cannot add member: group has reached the maximum of ${co} members`);return{...e,members:[...e.members,t]}}function ho(e,t){return lo(t),{...e,members:e.members.filter(e=>e!==t)}}function go(e,t=Math.floor(Date.now()/1e3)){let n=Va(t,e.rotationInterval);return n<=e.counter?e:{...e,counter:n,usageOffset:0}}var _o=Ie({FIRE_AND_FORGET_FRESHNESS_SEC:()=>300,MAX_FUTURE_SKEW_SEC:()=>60,PROTOCOL_VERSION:()=>2,STORED_MESSAGE_TYPES:()=>yo,applySyncMessage:()=>Po,applySyncMessageWithResult:()=>Fo,canonicaliseSyncMessage:()=>jo,decodeSyncMessage:()=>Mo,decryptEnvelope:()=>Ja,deriveGroupIdentity:()=>Ya,deriveGroupKey:()=>Ka,encodeSyncMessage:()=>ko,encryptEnvelope:()=>qa,hashGroupTag:()=>Xa,stableStringify:()=>Ao}),vo=new Set([`member-join`,`member-leave`,`counter-advance`,`reseed`,`beacon`,`duress-alert`,`duress-clear`,`liveness-checkin`,`state-snapshot`]),yo=new Set([`member-join`,`member-leave`,`counter-advance`,`reseed`,`state-snapshot`,`duress-alert`,`duress-clear`]),bo=/^[0-9a-f]{64}$/,xo=100,So=100,Co=2e7,wo=256,To=1e3;function Eo(e,t,n,r){let i=[...e,t];return i.length>To?{consumedOps:i.slice(-1e3),consumedOpsFloor:Math.max(r??0,n)}:{consumedOps:i,consumedOpsFloor:r}}function Do(e){return typeof e==`number`&&Number.isFinite(e)}function Oo(e){return Do(e)&&Number.isInteger(e)&&e>=0}function ko(e){let t={...e,protocolVersion:2};if(e.type===`reseed`){let{seed:n,...r}=t;return JSON.stringify({...r,seed:pa(e.seed)})}return JSON.stringify(t)}function Ao(e){if(e==null)return`null`;if(typeof e==`number`){if(!Number.isFinite(e))throw Error(`stableStringify: NaN/Infinity not allowed in canonical signing`);return JSON.stringify(e)}if(typeof e==`boolean`||typeof e==`string`)return JSON.stringify(e);if(Array.isArray(e))return`[`+e.map(Ao).join(`,`)+`]`;if(e instanceof Uint8Array)throw Error(`stableStringify: Uint8Array must be hex-encoded before serialisation`);if(typeof e==`object`){let t=e;return`{`+Object.keys(t).sort().filter(e=>t[e]!==void 0).map(e=>JSON.stringify(e)+`:`+Ao(t[e])).join(`,`)+`}`}throw Error(`stableStringify: unsupported type ${typeof e}`)}function jo(e){if(e.type===`reseed`){let{seed:t,...n}=e;return Ao({...n,seed:pa(t)})}return Ao(e)}function Mo(e){let t;try{t=JSON.parse(e)}catch{throw Error(`Invalid sync message: not valid JSON`)}let n=t.type;if(typeof n!=`string`||!vo.has(n))throw Error(`Invalid sync message type: ${String(n)}`);let r=t.timestamp;if(!Oo(r))throw Error(`Invalid sync message: missing or invalid timestamp`);let i=t.protocolVersion;if(i==null)throw Error(`Invalid sync message: protocolVersion is required`);if(i!==2)throw Error(`Unsupported protocol version: ${JSON.stringify(i)} (expected: 2)`);switch(n){case`member-join`:if(typeof t.pubkey!=`string`||!bo.test(t.pubkey))throw Error(`Invalid sync message: member-join requires a 64-char hex pubkey`);if(!Oo(t.epoch))throw Error(`Invalid sync message: member-join requires a non-negative epoch`);if(typeof t.opId!=`string`||t.opId.length===0||t.opId.length>128)throw Error(`Invalid sync message: member-join requires a non-empty opId (max 128 chars)`);if(t.displayName!==void 0&&(typeof t.displayName!=`string`||t.displayName.length>256))throw Error(`Invalid sync message: member-join displayName must be a string of at most 256 characters`);return{type:n,pubkey:t.pubkey,timestamp:r,epoch:t.epoch,opId:t.opId,...t.displayName===void 0?{}:{displayName:t.displayName},protocolVersion:2};case`member-leave`:if(typeof t.pubkey!=`string`||!bo.test(t.pubkey))throw Error(`Invalid sync message: member-leave requires a 64-char hex pubkey`);if(!Oo(t.epoch))throw Error(`Invalid sync message: member-leave requires a non-negative epoch`);if(typeof t.opId!=`string`||t.opId.length===0||t.opId.length>128)throw Error(`Invalid sync message: member-leave requires a non-empty opId (max 128 chars)`);return{type:n,pubkey:t.pubkey,timestamp:r,epoch:t.epoch,opId:t.opId,protocolVersion:2};case`liveness-checkin`:if(typeof t.pubkey!=`string`||!bo.test(t.pubkey))throw Error(`Invalid sync message: liveness-checkin requires a 64-char hex pubkey`);if(typeof t.opId!=`string`||t.opId.length===0||t.opId.length>128)throw Error(`Invalid sync message: liveness-checkin requires a non-empty opId (max 128 chars)`);return{type:n,pubkey:t.pubkey,timestamp:r,opId:t.opId,protocolVersion:2};case`counter-advance`:if(!Oo(t.counter)||t.counter>4294967295)throw Error(`Invalid sync message: counter-advance requires a non-negative counter within uint32 range`);if(!Oo(t.usageOffset))throw Error(`Invalid sync message: counter-advance requires a non-negative usageOffset`);if(t.usageOffset>xo)throw Error(`Invalid sync message: counter-advance usageOffset exceeds maximum of ${xo}`);return{type:n,counter:t.counter,usageOffset:t.usageOffset,timestamp:r,protocolVersion:2};case`reseed`:if(typeof t.seed!=`string`||!bo.test(t.seed))throw Error(`Invalid sync message: reseed.seed must be a 64-char hex string`);if(!Oo(t.counter))throw Error(`Invalid sync message: reseed requires a non-negative counter`);if(!Oo(t.epoch))throw Error(`Invalid sync message: reseed requires a non-negative epoch`);if(typeof t.opId!=`string`||t.opId.length===0||t.opId.length>128)throw Error(`Invalid sync message: reseed requires a non-empty opId (max 128 chars)`);if(!Array.isArray(t.admins)||!t.admins.every(e=>typeof e==`string`&&bo.test(e)))throw Error(`Invalid sync message: reseed.admins must be 64-char hex pubkeys`);if(!Array.isArray(t.members)||!t.members.every(e=>typeof e==`string`&&bo.test(e)))throw Error(`Invalid sync message: reseed.members must be 64-char hex pubkeys`);if(t.members.length>So)throw Error(`Invalid sync message: reseed.members exceeds maximum of ${So}`);if(t.admins.length>So)throw Error(`Invalid sync message: reseed.admins exceeds maximum of ${So}`);return{type:n,seed:W(t.seed),counter:t.counter,timestamp:r,epoch:t.epoch,opId:t.opId,admins:[...t.admins],members:[...t.members],protocolVersion:2};case`beacon`:if(!Do(t.lat)||!Do(t.lon))throw Error(`Invalid sync message: beacon requires numeric lat and lon`);if(t.lat<-90||t.lat>90||t.lon<-180||t.lon>180)throw Error(`Invalid sync message: beacon lat/lon out of range`);if(!Do(t.accuracy)||t.accuracy<0||t.accuracy>Co)throw Error(`Invalid sync message: beacon requires a non-negative accuracy`);if(typeof t.opId!=`string`||t.opId.length===0||t.opId.length>128)throw Error(`Invalid sync message: beacon requires a non-empty opId (max 128 chars)`);return{type:n,lat:t.lat,lon:t.lon,accuracy:t.accuracy,timestamp:r,opId:t.opId,protocolVersion:2};case`duress-alert`:if(!Do(t.lat)||!Do(t.lon))throw Error(`Invalid sync message: duress-alert requires numeric lat and lon`);if(t.lat<-90||t.lat>90||t.lon<-180||t.lon>180)throw Error(`Invalid sync message: duress-alert lat/lon out of range`);if(typeof t.opId!=`string`||t.opId.length===0||t.opId.length>128)throw Error(`Invalid sync message: duress-alert requires a non-empty opId (max 128 chars)`);if(t.subject!==void 0&&(typeof t.subject!=`string`||t.subject.length>wo))throw Error(`Invalid sync message: duress-alert subject must be a string of at most ${wo} characters`);return{type:n,lat:t.lat,lon:t.lon,timestamp:r,opId:t.opId,...t.subject===void 0?{}:{subject:t.subject},protocolVersion:2};case`duress-clear`:if(typeof t.subject!=`string`||t.subject.length===0)throw Error(`Invalid sync message: duress-clear requires a non-empty subject`);if(t.subject.length>wo)throw Error(`Invalid sync message: duress-clear subject exceeds maximum length of ${wo} characters`);if(typeof t.opId!=`string`||t.opId.length===0||t.opId.length>128)throw Error(`Invalid sync message: duress-clear requires a non-empty opId (max 128 chars)`);return{type:n,subject:t.subject,timestamp:r,opId:t.opId,protocolVersion:2};case`state-snapshot`:if(typeof t.seed!=`string`||!bo.test(t.seed))throw Error(`Invalid sync message: state-snapshot requires a 64-char hex seed`);if(!Oo(t.counter))throw Error(`Invalid sync message: state-snapshot requires a non-negative counter`);if(!Oo(t.usageOffset))throw Error(`Invalid sync message: state-snapshot requires a non-negative usageOffset`);if(!Array.isArray(t.members)||!t.members.every(e=>typeof e==`string`&&bo.test(e)))throw Error(`Invalid sync message: state-snapshot members must be 64-char hex pubkeys`);if(!Array.isArray(t.admins)||!t.admins.every(e=>typeof e==`string`&&bo.test(e)))throw Error(`Invalid sync message: state-snapshot admins must be 64-char hex pubkeys`);if(t.members.length>So)throw Error(`Invalid sync message: state-snapshot members exceeds maximum of ${So}`);if(t.admins.length>So)throw Error(`Invalid sync message: state-snapshot admins exceeds maximum of ${So}`);if(!Oo(t.epoch))throw Error(`Invalid sync message: state-snapshot requires a non-negative epoch`);if(typeof t.opId!=`string`||t.opId.length===0||t.opId.length>128)throw Error(`Invalid sync message: state-snapshot requires a non-empty opId (max 128 chars)`);if(t.prevEpochSeed!==void 0&&(typeof t.prevEpochSeed!=`string`||!bo.test(t.prevEpochSeed)))throw Error(`Invalid sync message: state-snapshot.prevEpochSeed must be a 64-char hex string`);return{type:n,seed:t.seed,counter:t.counter,usageOffset:t.usageOffset,members:[...t.members],admins:[...t.admins],epoch:t.epoch,opId:t.opId,timestamp:r,...t.prevEpochSeed===void 0?{}:{prevEpochSeed:t.prevEpochSeed},protocolVersion:2}}throw Error(`Invalid sync message type: ${n}`)}function No(e,t){return e.type===`reseed`||e.type===`state-snapshot`||e.type===`member-join`&&e.pubkey!==t||e.type===`member-leave`&&e.pubkey!==t}function Po(e,t,n=Math.floor(Date.now()/1e3),r){if(No(t,r)){if(!r||!e.admins.includes(r))return e;let n=t.epoch,i=t.opId;if(n===void 0||i===void 0||n<e.epoch)return e;if(t.type===`reseed`){if(n!==e.epoch+1)return e;let r=t;if(!r.admins||!r.members)return e;let i=new Set(r.members);if(!r.admins.every(e=>i.has(e)))return e}else if(t.type===`state-snapshot`){if(n<e.epoch)return e;let r=t;if(!r.admins||!r.members)return e;let i=new Set(r.members);if(!r.admins.every(e=>i.has(e)))return e}else if(n!==e.epoch)return e;if(t.type!==`reseed`&&!(t.type===`state-snapshot`&&n>e.epoch)&&(new Set(e.consumedOps).has(i)||e.consumedOpsFloor!==void 0&&t.timestamp<=e.consumedOpsFloor))return e}if(t.type===`duress-alert`||t.type===`duress-clear`||t.type===`beacon`||t.type===`liveness-checkin`){let r=n-t.timestamp;if(r>300||r<-60)return e}if(yo.has(t.type)&&t.timestamp>n+60||t.type===`liveness-checkin`&&r&&t.pubkey!==r||(t.type===`member-leave`||t.type===`member-join`||t.type===`duress-clear`)&&!No(t,r)&&(new Set(e.consumedOps).has(t.opId)||e.consumedOpsFloor!==void 0&&t.timestamp<=e.consumedOpsFloor))return e;switch(t.type){case`member-join`:{let n;try{n=mo(e,t.pubkey)}catch{return e}let r=Eo(n.consumedOps,t.opId,t.timestamp,e.consumedOpsFloor),i=t.displayName?{memberNames:{...n.memberNames,[t.pubkey]:t.displayName}}:{};return{...n,...r,...i}}case`member-leave`:if(!e.members.includes(t.pubkey))return e;{let n=ho(e,t.pubkey),r=Eo(n.consumedOps,t.opId,t.timestamp,e.consumedOpsFloor);return{...n,...r}}case`counter-advance`:{if(!r||!e.members.includes(r)||t.usageOffset>xo)return e;let i=e.counter+e.usageOffset,a=t.counter+t.usageOffset;return a<=i||a>Math.floor(n/e.rotationInterval)+xo?e:{...e,counter:t.counter,usageOffset:t.usageOffset}}case`reseed`:return{...e,seed:pa(t.seed),counter:t.counter,usageOffset:0,members:[...t.members],admins:[...t.admins],epoch:t.epoch,consumedOps:[t.opId]};case`state-snapshot`:if(t.epoch===e.epoch){if(t.seed!==e.seed)return e;let n=e.counter+e.usageOffset;if(t.counter+t.usageOffset<n||!e.members.every(e=>t.members.includes(e))||!e.admins.every(e=>t.admins.includes(e)))return e;let r=Eo(e.consumedOps,t.opId,t.timestamp,e.consumedOpsFloor);return{...e,counter:t.counter,usageOffset:t.usageOffset,members:[...t.members],admins:[...t.admins],...r}}return e;case`duress-clear`:{let n=Eo(e.consumedOps,t.opId,t.timestamp,e.consumedOpsFloor);return{...e,...n}}case`beacon`:case`duress-alert`:case`liveness-checkin`:return e;default:return e}}function Fo(e,t,n=Math.floor(Date.now()/1e3),r){let i=Po(e,t,n,r);if(t.type===`beacon`||t.type===`duress-alert`||t.type===`liveness-checkin`){let e=n-t.timestamp,a=e<=300&&e>=-60,o=t.type!==`liveness-checkin`||!r||t.pubkey===r;return{state:i,applied:a&&o}}return{state:i,applied:i!==e}}var Io={groupState:30078,signal:20078,giftWrap:1059},Lo=new Set([`member-join`,`member-leave`,`counter-advance`,`reseed`,`state-snapshot`,`duress-alert`,`duress-clear`]),Ro=/^[0-9a-f]{64}$/,zo=/^[0-9a-f]{128}$/,Bo=new TextEncoder,Vo=3,Ho=6e4,Uo=class{capacity;order=[];items=new Set;constructor(e){this.capacity=e}has(e){return this.items.has(e)}add(e){if(!this.items.has(e)){if(this.order.length>=this.capacity){let e=this.order.shift();this.items.delete(e)}this.order.push(e),this.items.add(e)}}},Wo=class{personalPubkey;personalPrivkey;subs=new Map;groupKeys=new Map;tagHashToGroupId=new Map;seenEventIds=new Uo(1e3);decryptFailures=new Map;recoveryPending=new Map;recoverySub=null;readRelays;writeRelays;constructor(e,n,r,i){this.personalPubkey=r,this.personalPrivkey=i,this.readRelays=t(e),this.writeRelays=t(n)}updateRelays(e,n){this.readRelays=t(e),this.writeRelays=n?t(n):[...this.readRelays]}get allRelays(){return t([...this.readRelays,...this.writeRelays])}registerGroup(e,t,n,r,i){let a=Xa(e);console.info(`[canary:sync] registerGroup`,e.slice(0,8),`→ tagHash`,a.slice(0,12),`members:`,r.length),this.groupKeys.set(e,{key:Ka(t),signer:n,tagHash:a,members:new Set(r),admins:new Set(i?.admins??[]),onRecoveryRequest:i?.onRecoveryRequest,onRecoveryResponse:i?.onRecoveryResponse}),this.tagHashToGroupId.set(a,e)}unregisterGroup(e){let t=this.groupKeys.get(e);t&&(t.key.fill(0),this.tagHashToGroupId.delete(t.tagHash)),this.groupKeys.delete(e),this.decryptFailures.delete(e),this.recoveryPending.delete(e)}async send(e,t,n){he()||ge(this.readRelays,this.writeRelays);let r=R();if(!r)return;let i=this.groupKeys.get(e);if(!i){console.warn(`[canary:sync] No group key registered for`,e);return}let a=ko(t),o=jo({...t,protocolVersion:2}),s=la(Bo.encode(o)),c=pa(E.sign(s,W(this.personalPrivkey))),l=JSON.stringify({s:this.personalPubkey,sig:c,p:a}),u=await qa(i.key,l),d=Lo.has(t.type),f=d?Io.groupState:Io.signal,p=[[`d`,d?`ssg/${i.tagHash}:${t.type}`:`ssg/${i.tagHash}`]];d?p.push([`expiration`,String(Math.floor(Date.now()/1e3)+10080*60)]):p.push([`t`,t.type]);let m={kind:f,content:u,tags:p,created_at:Math.floor(Date.now()/1e3)};try{let n=await i.signer.sign(m);typeof n.id==`string`&&this.seenEventIds.add(n.id),console.info(`[canary:sync] Publishing`,t.type,`to`,e.slice(0,8),`→ d-tag:`,i.tagHash.slice(0,12),`(write relays only)`),await r.publish(this.writeRelays,n),console.info(`[canary:sync] Published OK`)}catch(e){console.error(`[canary:sync] Publish failed:`,e)}}subscribe(e,t){let n=R();if(!n)return()=>{};let r=this.groupKeys.get(e);if(!r)return console.warn(`[canary:sync] No group key registered for`,e),()=>{};this._ensureRecoverySub();let i=Array.from(Lo).map(e=>`ssg/${r.tagHash}:${e}`),a={kinds:[Io.groupState,Io.signal],"#d":[`ssg/${r.tagHash}`,...i],since:Math.floor(Date.now()/1e3)-10080*60};console.info(`[canary:sync] Subscribing to`,e.slice(0,8),`→ filter:`,JSON.stringify(a));let o=n.subscribeMany(this.allRelays,a,{onevent:async n=>{try{if(!n||typeof n!=`object`||typeof n.pubkey!=`string`||typeof n.content!=`string`)return;console.info(`[canary:sync] Received event`,n.id?.slice(0,12),`kind:`,n.kind,`from pubkey:`,n.pubkey?.slice(0,12));let r=this.groupKeys.get(e);if(!r)return;if(!oi(n)){console.warn(`[canary:sync] Rejected event with invalid signature`);return}if(typeof n.id==`string`&&this.seenEventIds.has(n.id))return;if(typeof n.content==`string`&&n.content.length>65536){console.warn(`[canary:sync] Rejected oversized event content`);return}let i;try{i=await Ja(r.key,n.content)}catch{this._trackDecryptFailure(e);return}this.decryptFailures.delete(e);let a;try{a=JSON.parse(i)}catch{console.warn(`[canary:sync] Rejected malformed envelope`);return}if(!a||typeof a!=`object`){console.warn(`[canary:sync] Rejected malformed envelope`);return}let o=a.s,s=a.sig,c=a.p;if(typeof o!=`string`||typeof s!=`string`||typeof c!=`string`){console.warn(`[canary:sync] Rejected envelope with missing sender proof fields`);return}if(!Ro.test(o)||!zo.test(s)){console.warn(`[canary:sync] Rejected envelope with invalid sender proof encoding`);return}let l=Mo(c),u=jo({...l,protocolVersion:2}),d=la(Bo.encode(u));if(!E.verify(W(s),d,W(o))){console.warn(`[canary:sync] Rejected envelope with invalid sender proof`);return}if(l.type!==`member-join`&&!r.members.has(o)){console.warn(`[canary:sync] Rejected message from non-member pubkey`);return}if(l.type===`liveness-checkin`&&l.pubkey!==o){console.warn(`[canary:sync] Rejected liveness-checkin with mismatched sender`);return}console.info(`[canary:sync] Dispatching`,l.type,`from sender`,o.slice(0,8)),t(l,o),typeof n.id==`string`&&this.seenEventIds.add(n.id)}catch(e){console.warn(`[canary:sync] Failed to process event:`,e)}}});return this.subs.set(e,o),()=>{o.close(),this.subs.delete(e)}}async requestRecovery(e,t,n){let r=R();if(!r)return;let i=this.groupKeys.get(e);if(!i)return;this.recoveryPending.set(e,Date.now());let a=W(this.personalPrivkey);for(let e of i.admins)if(e!==this.personalPubkey)try{let o=Qi(JSON.stringify({groupTag:i.tagHash,epoch:t,counter:n}),Ui(a,e)),s=ai({kind:Io.signal,content:o,tags:[[`p`,e],[`t`,`ssg:recovery-request`]],created_at:Math.floor(Date.now()/1e3)},a);await r.publish(this.writeRelays,s)}catch(t){console.warn(`[canary:sync] Recovery request to`,e.slice(0,8),`failed:`,t)}}_ensureRecoverySub(){if(this.recoverySub)return;let e=R();if(!e)return;let t={kinds:[Io.signal],"#p":[this.personalPubkey],"#t":[`ssg:recovery-request`,`ssg:recovery-response`],since:Math.floor(Date.now()/1e3)-300};this.recoverySub=e.subscribeMany(this.allRelays,t,{onevent:async e=>{try{if(!e||typeof e!=`object`||!oi(e))return;let t=(e.tags||[]).filter(e=>e[0]===`t`).map(e=>e[1]);t.includes(`ssg:recovery-request`)?await this._handleRecoveryRequest(e):t.includes(`ssg:recovery-response`)&&await this._handleRecoveryResponse(e)}catch(e){console.warn(`[canary:sync] Recovery event processing failed:`,e)}}})}async _handleRecoveryRequest(e){let t=R();if(!t)return;let n=e.pubkey;if(!Ro.test(n))return;let r=W(this.personalPrivkey),i=Ui(r,n),a=$i(e.content,i),o;try{o=JSON.parse(a)}catch{return}let s=o.groupTag,c=o.epoch,l=o.counter;if(typeof s!=`string`||typeof c!=`number`||typeof l!=`number`)return;let u=this.tagHashToGroupId.get(s);if(!u)return;let d=this.groupKeys.get(u);if(!d)return;if(!d.members.has(n)){console.warn(`[canary:sync] Recovery request from non-member`,n.slice(0,8));return}if(!d.onRecoveryRequest)return;let f=d.onRecoveryRequest(n,c,l);if(!f)return;let p=ko(f),m=jo({...f,protocolVersion:2}),h=la(Bo.encode(m)),g=pa(E.sign(h,r)),_=Qi(JSON.stringify({s:this.personalPubkey,sig:g,groupTag:s,p}),Ui(r,n)),v=ai({kind:Io.signal,content:_,tags:[[`p`,n],[`t`,`ssg:recovery-response`]],created_at:Math.floor(Date.now()/1e3)},r);await t.publish(this.writeRelays,v),console.info(`[canary:sync] Sent recovery response to`,n.slice(0,8))}async _handleRecoveryResponse(e){let t=e.pubkey;if(!Ro.test(t))return;let n=Ui(W(this.personalPrivkey),t),r=$i(e.content,n),i;try{i=JSON.parse(r)}catch{return}let a=i.s,o=i.sig,s=i.groupTag,c=i.p;if(typeof a!=`string`||typeof o!=`string`||typeof s!=`string`||typeof c!=`string`||!Ro.test(a)||!zo.test(o)||a!==t)return;let l=this.tagHashToGroupId.get(s);if(!l)return;let u=this.groupKeys.get(l);if(!u)return;if(!u.admins.has(t)){console.warn(`[canary:sync] Recovery response from non-admin`,t.slice(0,8));return}let d=Mo(c),f=jo({...d,protocolVersion:2}),p=la(Bo.encode(f));if(!E.verify(W(o),p,W(t))){console.warn(`[canary:sync] Recovery response with invalid signature`);return}if(d.type!==`state-snapshot`){console.warn(`[canary:sync] Recovery response contains non-snapshot type:`,d.type);return}if(!d.admins.includes(t)){console.warn(`[canary:sync] Recovery response sender not in snapshot admins`);return}this.decryptFailures.delete(l),this.recoveryPending.delete(l),u.onRecoveryResponse&&u.onRecoveryResponse(d,t),console.info(`[canary:sync] Applied recovery response from`,t.slice(0,8))}_trackDecryptFailure(e){let t=(this.decryptFailures.get(e)??0)+1;if(this.decryptFailures.set(e,t),t<Vo)return;let n=this.recoveryPending.get(e);if(n!==void 0&&Date.now()-n<Ho)return;this.recoveryPending.delete(e);let r=this.groupKeys.get(e);r&&r.admins.size>0&&r.onRecoveryResponse&&(console.warn(`[canary:sync] ${t} decrypt failures for group — requesting recovery`),this.requestRecovery(e,0,0).catch(e=>{console.warn(`[canary:sync] Auto-recovery request failed:`,e)}))}disconnect(){for(let[,e]of this.subs)e.close();this.subs.clear(),this.recoverySub&&=(this.recoverySub.close(),null)}},Go=Ie({showToast:()=>G});function G(e,t=`info`,n=4e3){let r=document.getElementById(`toast-container`)??Ko(),i=document.createElement(`div`);i.className=`toast toast--${t}`,i.textContent=e,r.appendChild(i),requestAnimationFrame(()=>i.classList.add(`toast--visible`)),setTimeout(()=>{i.classList.remove(`toast--visible`),setTimeout(()=>i.remove(),300)},n)}function Ko(){let e=document.createElement(`div`);return e.id=`toast-container`,e.className=`toast-container`,document.body.appendChild(e),e}var qo=Ie({recordCheckin:()=>$o,startLivenessHeartbeat:()=>Yo,stopLivenessHeartbeat:()=>Xo}),Jo=null;function Yo(e=6e4){Jo||=(Zo(),setInterval(Zo,e))}function Xo(){Jo&&=(clearInterval(Jo),null)}function Zo(){let{groups:e,identity:t}=l();if(!t)return;let n=Math.floor(Date.now()/1e3);for(let[r,i]of Object.entries(e))os(r,{type:`liveness-checkin`,pubkey:t.pubkey,timestamp:n,opId:crypto.randomUUID()}),u(r,{livenessCheckins:{...i.livenessCheckins,[t.pubkey]:n}})}var Qo=60;function $o(e,t,n){let r=l().groups[e];r&&(n>Math.floor(Date.now()/1e3)+Qo||n<=(r.livenessCheckins[t]??0)||u(e,{livenessCheckins:{...r.livenessCheckins,[t]:n}}))}var K=null,es=new Map,ts=new Map;function ns(e,t){let n=ts.get(e);return n?n.includes(t):!1}function rs(e,t){let n=ts.get(e);n||(n=[],ts.set(e,n)),n.length>=500&&n.shift(),n.push(t)}function is(e){K=e}async function as(e,t,n){let{identity:r}=l(),i=t??e,a=!!r?.privkey||r?.signerType===`nip07`;if(!(!r||!a||e.length===0&&i.length===0))try{ge(e,i),r.privkey&&(K?K instanceof Wo&&K.updateRelays(e,i):is(new Wo(e,i,r.pubkey,r.privkey))),n&&K&&ds(n),n&&er(n).then(e=>{for(let t of e)os(n,t)}),se().then(()=>Ls(he(),oe()))}catch(e){console.warn(`[canary:sync] ensureTransport failed:`,e),Ls(!1,0)}}function os(e,t){K&&l().groups[e]&&K.send(e,t).catch(e=>{console.warn(`[canary:sync] broadcast failed:`,e)})}function ss(e){if(!(K instanceof Wo))return;let{identity:t,groups:n}=l(),r=n[e];if(!t?.privkey||!r?.seed||(K.unregisterGroup(e),!Ee()))return;let i=new ra(ve(r.personaId,e,r.epoch));K.registerGroup(e,r.seed,i,r.members,cs(e))}function cs(e){return{admins:l().groups[e]?.admins??[],onRecoveryRequest:(t,n,r)=>{let{groups:i}=l(),a=i[e];return!a||!a.members.includes(t)?null:{type:`state-snapshot`,seed:a.seed,counter:a.counter,usageOffset:a.usageOffset,members:a.members,admins:a.admins,epoch:a.epoch,opId:crypto.randomUUID(),timestamp:Math.floor(Date.now()/1e3)}},onRecoveryResponse:(t,n)=>{let{groups:r}=l(),i=r[e];if(!i)return;let a=Po(i,t,void 0,n);a!==i&&(u(e,a),ss(e),G(`Group state recovered from admin`,`success`))}}}function ls(e,t,n,r=Math.floor(Date.now()/1e3),i=us){if(t.type===`liveness-checkin`){if(!n)return;let i=r-t.timestamp;i<=300&&i>=-60&&(ns(e,t.opId)||(rs(e,t.opId),$o(e,n,t.timestamp)));return}if(t.type===`beacon`||t.type===`duress-alert`||t.type===`duress-clear`){let a=r-t.timestamp;if(a>300||a<-60||ns(e,t.opId))return;rs(e,t.opId),i(e,t,n)}}function us(e,t,n){document.dispatchEvent(new CustomEvent(`canary:sync-message`,{detail:{groupId:e,message:t,sender:n}}))}function ds(e){if(!K)return;if(es.get(e)?.(),K instanceof Wo){let{identity:t,groups:n}=l(),r=n[e];if(t?.privkey&&r?.seed){if(!Ee())return;let t=new ra(ve(r.personaId,e,r.epoch));K.registerGroup(e,r.seed,t,r.members,cs(e))}}let t=K.subscribe(e,(t,n)=>{let{groups:r}=l(),i=r[e];if(!i)return;let a=Po(i,t,void 0,n);if(a!==i&&u(e,a),(t.type===`member-join`||t.type===`member-leave`||t.type===`reseed`||t.type===`state-snapshot`)&&ss(e),t.type===`member-join`&&a!==i){let r=t.pubkey?a.memberNames?.[t.pubkey]??n?.slice(0,8)??`Someone`:`Someone`;document.dispatchEvent(new CustomEvent(`canary:member-joined`,{detail:{groupId:e,pubkey:t.pubkey,name:r}}))}t.type===`member-join`&&a!==i?G(`${t.pubkey?a.memberNames?.[t.pubkey]??n?.slice(0,8)??`Someone`:`Someone`} joined the group`,`success`):t.type===`reseed`?G(`Group secret was rotated`,`warning`):t.type===`state-snapshot`&&G(`Group state recovered`,`success`),ls(e,t,n),Rs(),setTimeout(()=>Ls(he(),oe()),1500)});es.set(e,t)}function fs(){let{groups:e}=l();for(let t of Object.keys(e))ds(t)}function ps(){Xo();for(let e of es.values())e();es.clear(),K?.disconnect(),K=null}var ms=new TextDecoder(`utf-8`);new TextEncoder;var hs=5e3;function gs(e){let{prefix:t,words:n}=M.decode(e,hs),r=new Uint8Array(M.fromWords(n));switch(t){case`nprofile`:{let e=_s(r);if(!e[0]?.[0])throw Error(`missing TLV 0 for nprofile`);if(e[0][0].length!==32)throw Error(`TLV 0 should be 32 bytes`);return{type:`nprofile`,data:{pubkey:L(e[0][0]),relays:e[1]?e[1].map(e=>ms.decode(e)):[]}}}case`nevent`:{let e=_s(r);if(!e[0]?.[0])throw Error(`missing TLV 0 for nevent`);if(e[0][0].length!==32)throw Error(`TLV 0 should be 32 bytes`);if(e[2]&&e[2][0].length!==32)throw Error(`TLV 2 should be 32 bytes`);if(e[3]&&e[3][0].length!==4)throw Error(`TLV 3 should be 4 bytes`);return{type:`nevent`,data:{id:L(e[0][0]),relays:e[1]?e[1].map(e=>ms.decode(e)):[],author:e[2]?.[0]?L(e[2][0]):void 0,kind:e[3]?.[0]?parseInt(L(e[3][0]),16):void 0}}}case`naddr`:{let e=_s(r);if(!e[0]?.[0])throw Error(`missing TLV 0 for naddr`);if(!e[2]?.[0])throw Error(`missing TLV 2 for naddr`);if(e[2][0].length!==32)throw Error(`TLV 2 should be 32 bytes`);if(!e[3]?.[0])throw Error(`missing TLV 3 for naddr`);if(e[3][0].length!==4)throw Error(`TLV 3 should be 4 bytes`);return{type:`naddr`,data:{identifier:ms.decode(e[0][0]),pubkey:L(e[2][0]),kind:parseInt(L(e[3][0]),16),relays:e[1]?e[1].map(e=>ms.decode(e)):[]}}}case`nsec`:return{type:t,data:r};case`npub`:case`note`:return{type:t,data:L(r)};default:throw Error(`unknown prefix ${t}`)}}function _s(e){let t={},n=e;for(;n.length>0;){let e=n[0],r=n[1],i=n.slice(2,2+r);if(n=n.slice(2+r),i.length<r)throw Error(`not enough data to read on TLV ${e}`);t[e]=t[e]||[],t[e].push(i)}return t}function vs(e){return xs(`nsec`,e)}function ys(e){return xs(`npub`,F(e))}function bs(e,t){let n=M.toWords(t);return M.encode(e,n,hs)}function xs(e,t){return bs(e,t)}function Ss(e){let t=5381;for(let n=0;n<e.length;n++)t=t*33^e.charCodeAt(n),t>>>=0;return t%360}function Cs(e){return`hsl(${Ss(e)}, 60%, 45%)`}function ws(e){let t=Cs(e),n=B(e.slice(0,1).toUpperCase());return`<span class="persona-badge" style="background-color:${t}" title="${B(e)}">${n}</span>`}function Ts(e){return e.length<=16?e:`${e.slice(0,8)}\u2026${e.slice(-4)}`}function Es(e,t){let n=e.displayName?`${B(e.displayName)} (${B(Ts(e.npub))})`:`${B(e.name)} · ${B(Ts(e.npub))}`,r=e.id===t?` selected`:``;return`<option value="${B(e.id)}"${r}>${n}</option>`}function Ds(){if(!Ee())return``;let{personas:e,activePersonaId:t}=l(),n=Object.values(e).filter(e=>!e.archived);return n.length===0?``:`<select class="persona-picker" aria-label="Filter by persona">${[`<option value=""${t===null?` selected`:``}>All groups</option>`,...n.map(e=>Es(e,t))].join(``)}</select>`}function Os(e){let t=e.querySelector(`.persona-picker`);t&&t.addEventListener(`change`,()=>{let e=t.value;s({activePersonaId:e===``?null:e})})}var ks=`modulepreload`,As=function(e,t){return new URL(e,t).href},js={},q=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}r=o(t.map(t=>{if(t=As(t,n),t in js)return;js[t]=!0;let r=t.endsWith(`.css`),i=r?`[rel="stylesheet"]`:``;if(n)for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${t}"]${i}`))return;let o=document.createElement(`link`);if(o.rel=r?`stylesheet`:ks,r||(o.as=`script`),o.crossOrigin=``,o.href=t,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),r)return new Promise((e,n)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})};function Ms(){return document.documentElement.getAttribute(`data-theme`)===`light`?`light`:`dark`}function Ns(e){e===`light`?document.documentElement.setAttribute(`data-theme`,`light`):document.documentElement.removeAttribute(`data-theme`)}function Ps(e){let t=Ms();e.setAttribute(`aria-label`,t===`dark`?`Switch to light mode`:`Switch to dark mode`),e.textContent=`◐`}function Fs(e){let t=Ms()===`dark`?`light`:`dark`;Ns(t),s({settings:{...l().settings,theme:t}}),Ps(e)}function Is(e){let t=l().view;e.innerHTML=`
    <button class="header__hamburger" id="hamburger" aria-label="Toggle menu">&#9776;</button>
    <div class="header__brand">CANARY <span class="header__version">v2.7.3</span></div>
    <nav class="header__nav" id="header-nav">
      <button class="header__nav-tab${t===`groups`?` header__nav-tab--active`:``}" data-view="groups">Groups</button>
      <button class="header__nav-tab${t===`call-demo`?` header__nav-tab--active`:``}" data-view="call-demo">Call Demo</button>
      <button class="header__nav-tab${t===`identities`?` header__nav-tab--active`:``}" data-view="identities">Identities</button>
    </nav>
    ${Ds()}
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
      <a class="theme-toggle" href="https://github.com/forgesworn/canary-kit" target="_blank" rel="noopener" aria-label="View source on GitHub" title="View source on GitHub">
        <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
      </a>
      <button class="theme-toggle" id="theme-toggle" aria-label="Switch to light mode">&#9680;</button>
      <button class="theme-toggle" id="reset-btn" aria-label="Reset demo" title="Clear all data and reset">&#8634;</button>
    </div>
  `,Os(e);let n=e.querySelector(`#theme-toggle`);n&&(Ps(n),n.addEventListener(`click`,()=>Fs(n)));let r=e.querySelector(`#reset-btn`);r&&r.addEventListener(`click`,()=>{confirm(`Clear all data and reset the demo?`)&&(localStorage.clear(),window.location.reload())}),zs();let i=e.querySelector(`#identity-btn`);i?.addEventListener(`click`,()=>Us(i)),he()&&Ls(!0,oe()),document.addEventListener(`canary:vault-synced`,()=>{let e=document.getElementById(`vault-sync-status`);e&&(e.hidden=!1,e.textContent=`☁`,setTimeout(()=>{e.hidden=!0},3e3))}),e.querySelector(`#header-nav`)?.addEventListener(`click`,e=>{let t=e.target.closest(`[data-view]`);if(!t)return;let n=t.dataset.view;if(n){if(n===`groups`&&window.innerWidth<=768){let e=document.getElementById(`sidebar`),t=document.getElementById(`sidebar-overlay`);if(e&&t){let n=e.classList.contains(`sidebar--open`);e.classList.toggle(`sidebar--open`,!n),t.classList.toggle(`sidebar-overlay--visible`,!n)}}n!==l().view&&s({view:n})}})}function Ls(e,t){let n=document.getElementById(`relay-status`);if(!n)return;let r=n.querySelector(`.relay-dot`),i=n.querySelector(`.relay-label`);!e||t===0?(n.removeAttribute(`hidden`),r?.setAttribute(`class`,`relay-dot relay-dot--offline`),i&&(i.textContent=`Offline`),n.title=`Not connected to any relay`):(n.removeAttribute(`hidden`),r?.setAttribute(`class`,`relay-dot relay-dot--synced`),i&&(i.textContent=`Synced · ${t} relay${t===1?``:`s`}`),n.title=`Connected to ${t} relay${t===1?``:`s`}`)}function Rs(){let e=document.getElementById(`relay-status`);if(!e)return;let t=e.querySelector(`.relay-dot`),n=e.querySelector(`.relay-label`);e.removeAttribute(`hidden`),t?.setAttribute(`class`,`relay-dot relay-dot--syncing`),n&&(n.textContent=`Syncing...`)}function zs(){let e=document.getElementById(`identity-dot`),t=document.getElementById(`identity-label`),n=document.getElementById(`identity-avatar`);if(!e||!t)return;let{identity:r,activePersonaId:i,personas:a}=l();if(!r?.pubkey){t.textContent=`No identity`,e.className=`header__identity-dot header__identity-dot--none`,n&&(n.hidden=!0);return}let o=i?Object.values(a).find(e=>e.id===i)??null:null,s=o?`${o.npub.slice(0,8)}\u2026${o.npub.slice(-4)}`:`${r.pubkey.slice(0,6)}\u2026${r.pubkey.slice(-4)}`;t.textContent=o?o.displayName??o.name:r.displayName&&r.displayName!==`You`?r.displayName:s,n&&r.picture?(n.src=r.picture,n.hidden=!1,e.hidden=!0):(n&&(n.hidden=!0),e.hidden=!1,e.className=r.signerType===`nip07`?`header__identity-dot header__identity-dot--extension`:`header__identity-dot header__identity-dot--local`)}function Bs(e){return Array.from(e,e=>e.toString(16).padStart(2,`0`)).join(``)}function Vs(e,t){return t?.pubkey===e.pubkey&&t.mnemonic?{...e,mnemonic:t.mnemonic}:e}function Hs(e,t){try{let n=l().identity,r=gs(e.trim());if(r.type!==`nsec`)return alert(`Not a valid nsec. Expected a bech32-encoded private key starting with "nsec1".`),!1;let i=r.data,a=Bs(i),o=Vs({pubkey:ii(i),privkey:a,signerType:`local`,displayName:t??`You`},n);return ps(),s({identity:o,groups:{},activeGroupId:null}),zs(),document.dispatchEvent(new CustomEvent(`canary:resync`)),t&&t!==`You`&&q(async()=>{let{publishKind0:e}=await Promise.resolve().then(()=>Gu);return{publishKind0:e}},void 0,import.meta.url).then(({publishKind0:e})=>e(t,a)),!0}catch{return alert(`Invalid nsec format.`),!1}}function Us(e){document.getElementById(`identity-popover`)?.remove();let{identity:t}=l(),n=t?.pubkey??``,r=n?`${n.slice(0,8)}\u2026${n.slice(-8)}`:`None`,i=t?.signerType===`nip07`?`Extension (NIP-07)`:`Local key`,a=document.createElement(`div`);a.id=`identity-popover`,a.className=`identity-popover`,a.innerHTML=`
    <div class="identity-popover__row">
      <span class="identity-popover__label">Pubkey</span>
      <span class="identity-popover__value" title="${B(n)}">${B(r)}</span>
    </div>
    <div class="identity-popover__row">
      <span class="identity-popover__label">Signer</span>
      <span class="identity-popover__value">${i}</span>
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
    `:``}
    ${t?.privkey?`
      <div class="identity-popover__section" style="padding-top: 0;">
        <details style="font-size: 0.75rem;">
          <summary style="cursor: pointer; color: var(--text-muted);">Advanced: show nsec</summary>
          <div id="nsec-reveal-area" style="margin-top: 0.375rem;">
            <button class="btn btn--sm" id="nsec-reveal-btn" type="button" style="width: 100%;">Show nsec</button>
          </div>
        </details>
      </div>
    `:``}

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
  `,e.parentElement?.appendChild(a),a.querySelector(`#identity-logout-btn`)?.addEventListener(`click`,()=>{ps(),s({identity:null,groups:{},activeGroupId:null}),a.remove(),window.location.reload()}),a.querySelector(`#recovery-reveal-btn`)?.addEventListener(`click`,()=>{let e=a.querySelector(`#recovery-reveal-area`);if(!e)return;let t=l().identity?.mnemonic;if(!t){e.textContent=``;let t=document.createElement(`p`);t.style.cssText=`font-size:0.75rem;color:var(--text-muted);`,t.textContent=`No recovery phrase stored (key was imported via nsec).`,e.appendChild(t);return}let n=t.split(` `);e.textContent=``;let r=document.createElement(`div`);r.style.cssText=`display:grid;grid-template-columns:repeat(3,1fr);gap:0.375rem;margin:0.375rem 0;`,n.forEach((e,t)=>{let n=document.createElement(`div`);n.style.cssText=`border:1px solid var(--border);border-radius:3px;padding:0.25rem;text-align:center;font-family:var(--font-mono,monospace);font-size:0.7rem;`;let i=document.createElement(`span`);i.style.color=`var(--text-muted)`,i.textContent=`${t+1}. `;let a=document.createElement(`span`);a.textContent=e,n.append(i,a),r.appendChild(n)}),e.appendChild(r);let i=document.createElement(`button`);i.className=`btn btn--sm`,i.type=`button`,i.style.cssText=`width:100%;margin-top:0.375rem;`,i.textContent=`Copy words`,i.addEventListener(`click`,async()=>{try{await navigator.clipboard.writeText(t),i.textContent=`Copied!`,setTimeout(()=>{i.textContent=`Copy words`},2e3),setTimeout(()=>{navigator.clipboard.writeText(``).catch(()=>{})},3e4)}catch{}}),e.appendChild(i)}),a.querySelector(`#nsec-reveal-btn`)?.addEventListener(`click`,()=>{let e=a.querySelector(`#nsec-reveal-area`);if(!e||!t?.privkey)return;let n=vs(W(t.privkey));e.innerHTML=`
      <code style="font-size: 0.65rem; word-break: break-all; display: block; background: var(--bg); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border); user-select: all;">${B(n)}</code>
      <button class="btn btn--sm" id="nsec-copy-btn" type="button" style="width: 100%; margin-top: 0.375rem;">Copy nsec</button>
    `,e.querySelector(`#nsec-copy-btn`)?.addEventListener(`click`,async e=>{let t=e.currentTarget;try{await navigator.clipboard.writeText(n),t.textContent=`Copied!`,setTimeout(()=>{t.textContent=`Copy nsec`},2e3),setTimeout(()=>{navigator.clipboard.writeText(``).catch(()=>{})},3e4)}catch{}})}),a.querySelector(`#nsec-login-form`)?.addEventListener(`submit`,e=>{e.preventDefault();let t=a.querySelector(`#nsec-input`);t?.value.trim()&&Hs(t.value)&&a.remove()}),a.querySelector(`#nip07-connect-btn`)?.addEventListener(`click`,async()=>{if(!ia()){alert(`No Nostr extension found. Install Alby, nos2x, or another NIP-07 extension and reload.`);return}try{ps(),s({identity:Vs({pubkey:await window.nostr.getPublicKey(),signerType:`nip07`,displayName:t?.displayName??`You`},t),groups:{},activeGroupId:null}),zs(),document.dispatchEvent(new CustomEvent(`canary:resync`)),a.remove()}catch{alert(`Extension rejected the request.`)}});let o=t=>{!a.contains(t.target)&&t.target!==e&&(a.remove(),document.removeEventListener(`click`,o))};requestAnimationFrame(()=>document.addEventListener(`click`,o))}function Ws(e){let t=Math.floor(e/86400);if(t>=1)return`${t}d`;let n=Math.floor(e/3600);return n>=1?`${n}h`:`${Math.floor(e/60)}m`}function Gs(e){return e?`
    <div class="identity-badge">
      <span class="identity-badge__name">${B(e.displayName??`${e.pubkey.slice(0,8)}…`)}</span>
    </div>
  `:``}function Ks(e,t){let n=Object.values(e);if(n.length===0)return`<div class="group-list__empty">No groups yet</div>`;let{activePersonaId:r,personas:i}=l();return n.map(e=>{let n=e.id===t,a=n?` group-list__item--active`:``,o=Ws(e.livenessInterval),s=Ws(e.livenessInterval),c=e.personaId?Object.values(i).find(t=>t.id===e.personaId):void 0,l=c?ws(c.name):``,u=c?.archived||r&&e.personaId!==r?` hidden`:``;return`
        <button
          class="group-list__item${a}"
          data-group-id="${B(e.id)}"
          aria-current="${n?`true`:`false`}"
          ${u}
        >
          ${l}<span class="group-list__name">${B(e.name)}</span>
          <span class="group-list__preset">${B(o)} · ${B(s)}</span>
        </button>
      `}).join(``)}function qs(e){let{identity:t,groups:n,activeGroupId:r}=l();e.innerHTML=`
    <div class="sidebar__tagline">spoken-word verification</div>
    ${Gs(t)}
    <nav class="group-list" aria-label="Groups">
      ${Ks(n,r)}
    </nav>
    <button class="btn btn--primary" id="create-group-btn">+ New Group</button>
    <button class="btn btn--sm sidebar__sync-btn" id="sync-groups-btn" title="Sync groups from other devices">Sync Groups</button>
  `,e.querySelector(`.group-list`)?.addEventListener(`click`,e=>{let t=e.target.closest(`[data-group-id]`);if(!t)return;let n=t.dataset.groupId;n&&s({activeGroupId:n})}),e.querySelector(`#create-group-btn`)?.addEventListener(`click`,()=>{e.dispatchEvent(new CustomEvent(`canary:create-group`,{bubbles:!0}))}),e.querySelector(`#sync-groups-btn`)?.addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:sync-vault`))})}var Js=`app-modal`;function Ys(e,t){let n=document.getElementById(Js);if(n||(n=document.createElement(`dialog`),n.id=Js,n.className=`modal`,document.body.appendChild(n)),n.innerHTML=`
    <form class="modal__form" method="dialog" id="modal-form">
      ${e}
    </form>
  `,t){let e=n.querySelector(`#modal-form`);e?.addEventListener(`submit`,n=>{n.preventDefault(),t(new FormData(e)),Xs()})}n.addEventListener(`click`,e=>{e.target===n&&Xs()}),n.showModal()}function Xs(){document.getElementById(Js)?.close()}var Zs=/^[0-9a-f]{64}$/,Qs=/^[0-9b-hjkmnp-z]+$/,$s=new TextEncoder().encode(`canary:beacon:key`),ec=new TextEncoder().encode(`canary:duress:key`);function tc(e){if(!Zs.test(e))throw Error(`seedHex must be a 64-character lowercase hex string (32 bytes)`)}function nc(e){if(e.length!==32)throw Error(`AES-256-GCM requires a 32-byte key`)}function rc(e){return tc(e),da(W(e),$s)}function ic(e){return tc(e),da(W(e),ec)}async function ac(e,t){nc(e);let n=crypto.getRandomValues(new Uint8Array(12)),r=await crypto.subtle.importKey(`raw`,e,{name:`AES-GCM`},!1,[`encrypt`]),i=new Uint8Array(await crypto.subtle.encrypt({name:`AES-GCM`,iv:n},r,t)),a=new Uint8Array(12+i.length);return a.set(n),a.set(i,12),ga(a)}async function oc(e,t,n){if(typeof t!=`string`||t.length===0||t.length>11)throw Error(`geohash must be a non-empty string of at most 11 characters`);if(!Qs.test(t))throw Error(`geohash contains invalid characters (valid: 0-9, b-h, j-k, m-n, p-z)`);if(!Number.isInteger(n)||n<1||n>11)throw Error(`precision must be an integer between 1 and 11`);let r={geohash:t,precision:n,timestamp:Math.floor(Date.now()/1e3)};return ac(e,new TextEncoder().encode(JSON.stringify(r)))}function sc(e,t,n){if(!Zs.test(e))throw Error(`Invalid member pubkey: expected 64 lowercase hex characters, got ${e.length} chars`);if(t){if(typeof t.geohash!=`string`||t.geohash.length===0||t.geohash.length>11)throw Error(`location.geohash must be a non-empty string of at most 11 characters`);if(!Qs.test(t.geohash))throw Error(`location.geohash contains invalid characters (valid: 0-9, b-h, j-k, m-n, p-z)`);if(!Number.isInteger(t.precision)||t.precision<1||t.precision>11)throw Error(`location.precision must be an integer between 1 and 11`);return{type:`duress`,member:e,geohash:t.geohash,precision:t.precision,locationSource:t.locationSource,timestamp:Math.floor(Date.now()/1e3),scope:n?.scope??`group`,...n?.originGroupId!==void 0&&{originGroupId:n.originGroupId}}}return{type:`duress`,member:e,geohash:``,precision:0,locationSource:`none`,timestamp:Math.floor(Date.now()/1e3),scope:n?.scope??`group`,...n?.originGroupId!==void 0&&{originGroupId:n.originGroupId}}}async function cc(e,t){return ac(e,new TextEncoder().encode(JSON.stringify(t)))}function lc(){let{identity:e}=l();if(!e?.pubkey)throw Error(`No local identity — cannot perform privileged action.`);return e.pubkey}function uc(e){let t=lc();if(!e.admins.includes(t))throw Error(`Not authorised — you are not an admin of "${e.name}".`)}function dc(e){let t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function fc(e,t,n,r){let i=crypto.randomUUID(),a=uo({name:e,members:n?[n]:[],preset:t,creator:n}),o=l().settings,c=[...o.defaultReadRelays??o.defaultRelays],u=[...o.defaultWriteRelays??o.defaultRelays],d={family:`words`,"field-ops":`words`,enterprise:`words`,event:`pin`},f={...a,id:i,nostrEnabled:u.length>0||c.length>0,relays:u,readRelays:c,writeRelays:u,encodingFormat:d[t]??`words`,usedInvites:[],latestInviteIssuedAt:0,livenessInterval:a.rotationInterval,livenessCheckins:{},tolerance:1,memberNames:{},duressMode:`immediate`,personaId:r??``},{groups:p}=l();return s({groups:{...p,[i]:f},activeGroupId:i}),n&&os(i,{type:`member-join`,pubkey:n,timestamp:Math.floor(Date.now()/1e3),epoch:0,opId:crypto.randomUUID()}),i}function pc(e){let{groups:t,activeGroupId:n,deletedGroupIds:r}=l(),i={...t};delete i[e];let a=r.includes(e)?r:[...r,e];s({groups:i,activeGroupId:n===e?null:n,deletedGroupIds:a}),document.dispatchEvent(new CustomEvent(`canary:vault-publish-now`))}function mc(e){let{groups:t}=l(),n=t[e];if(!n){console.warn(`[canary:actions] reseedGroup: unknown group id "${e}"`);return}uc(n);let r=po(n),i=(n.epoch??0)+1,a=crypto.randomUUID(),o=[...n.admins??[]];os(e,{type:`reseed`,seed:dc(r.seed),counter:r.counter,timestamp:Math.floor(Date.now()/1e3),epoch:i,opId:a,admins:o,members:[...n.members]}),u(e,{...r,epoch:i,consumedOps:[a],admins:o}),ss(e)}function hc(e){let{groups:t}=l(),n=t[e];if(!n){console.warn(`[canary:actions] compromiseReseed: unknown group id "${e}"`);return}uc(n);let r=po(n),i=(n.epoch??0)+1;u(e,{...r,epoch:i,consumedOps:[],admins:[...n.admins??[]]}),ss(e)}function gc(e,t,n){let{groups:r}=l(),i=r[e];if(!i){console.warn(`[canary:actions] addGroupMember: unknown group id "${e}"`);return}uc(i);let a=crypto.randomUUID();u(e,{...mo(i,t),consumedOps:[...i.consumedOps??[],a]}),ss(e),os(e,{type:`member-join`,pubkey:t,displayName:n||void 0,timestamp:Math.floor(Date.now()/1e3),epoch:i.epoch??0,opId:a})}function _c(e,t){let{groups:n}=l(),r=n[e];if(!r){console.warn(`[canary:actions] removeGroupMember: unknown group id "${e}"`);return}if(t!==lc()&&uc(r),!r.members.includes(t))return;let i=po(ho(r,t)),a=(r.epoch??0)+1,o={...r.memberNames??{}};delete o[t];let s={...r.livenessCheckins??{}};delete s[t];let c=(r.admins??[]).filter(e=>e!==t);u(e,{...i,memberNames:o,livenessCheckins:s,admins:c,epoch:a,consumedOps:[]}),ss(e)}function vc(e){let{groups:t}=l(),n=t[e];if(!n){console.warn(`[canary:actions] burnWord: unknown group id "${e}"`);return}let r=fo(n);u(e,r),os(e,{type:`counter-advance`,counter:r.counter,usageOffset:r.usageOffset,timestamp:Math.floor(Date.now()/1e3)})}var yc=/^[0-9a-f]{64}$/;function bc(e){if(!e||typeof e!=`object`)throw Error(`Import failed — expected a JSON object.`);let t=e;if(typeof t.name!=`string`||t.name.trim().length===0)throw Error(`Import failed — name is required.`);if(typeof t.seed!=`string`||!yc.test(t.seed))throw Error(`Import failed — seed must be a 64-character lowercase hex string.`);if(!Array.isArray(t.members)||t.members.length===0)throw Error(`Import failed — members must be a non-empty array.`);for(let e of t.members)if(typeof e!=`string`||!yc.test(e))throw Error(`Import failed — invalid member pubkey: "${String(e)}".`);if(Array.isArray(t.admins)){for(let e of t.admins)if(typeof e!=`string`||!yc.test(e))throw Error(`Import failed — invalid admin pubkey: "${String(e)}".`);let e=new Set(t.members);for(let n of t.admins)if(!e.has(n))throw Error(`Import failed — admin "${n}" is not in the members list.`)}if(t.rotationInterval!==void 0&&(typeof t.rotationInterval!=`number`||!Number.isInteger(t.rotationInterval)||t.rotationInterval<=0))throw Error(`Import failed — rotationInterval must be a positive integer.`);if(t.wordCount!==void 0&&t.wordCount!==1&&t.wordCount!==2&&t.wordCount!==3)throw Error(`Import failed — wordCount must be 1, 2, or 3.`);if(t.encodingFormat!==void 0&&t.encodingFormat!==`words`&&t.encodingFormat!==`pin`&&t.encodingFormat!==`hex`)throw Error(`Import failed — encodingFormat must be words, pin, or hex.`);if(t.epoch!==void 0&&(typeof t.epoch!=`number`||!Number.isInteger(t.epoch)||t.epoch<0))throw Error(`Import failed — epoch must be a non-negative integer.`);if(t.consumedOps!==void 0&&(!Array.isArray(t.consumedOps)||!t.consumedOps.every(e=>typeof e==`string`)))throw Error(`Import failed — consumedOps must be an array of strings.`)}function xc(e){let{groups:t}=l();if(Object.keys(t).length>0){e.hidden=!0;return}e.hidden=!1,e.innerHTML=`
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
  `,document.getElementById(`welcome-create`).addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:create-group`))}),document.getElementById(`welcome-join`).addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:join-group`))})}var Sc=`canary:group`;function Cc(e){switch(e.encodingFormat){case`pin`:return{format:`pin`,digits:6};case`hex`:return{format:`hex`,length:8};default:return{format:`words`,count:e.wordCount}}}function wc(e,t){return t===`pin`&&e.length===6?`${e.slice(0,3)}-${e.slice(3)}`:t===`hex`&&e.length===8?`${e.slice(0,4)}-${e.slice(4)}`:e}function Tc(e,t){let{identity:n}=l();return n?.pubkey===e?`You`:t.memberNames?.[e]||e.slice(0,8)+`…`}var Ec=null;function Dc(){Ec!==null&&(clearInterval(Ec),Ec=null)}function Oc(e=new Date){return e.toISOString().slice(11,19)+` UTC`}function kc(e){return e.replace(/[a-zA-Z0-9]/g,`•`)}var Ac=`ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789•·∘◦○●◈◆▪▫`;function jc(e,t,n=600){let r=t.length,i=Math.ceil(n/30),a=e=>Math.floor(e/r*i*.7)+Math.floor(i*.3),o=0,s=setInterval(()=>{o++;let n=``;for(let e=0;e<r;e++)o>=a(e)?n+=t[e]:n+=Ac[Math.floor(Math.random()*65)];e.textContent=n,o>=i&&(clearInterval(s),e.textContent=t)},30)}function Mc(e){if(e<=0)return`0s`;let t=Math.floor(e/86400),n=Math.floor(e%86400/3600),r=Math.floor(e%3600/60),i=Math.floor(e%60);return t>=1?n>0?`${t}d ${n}h`:`${t}d`:n>=1?r>0?`${n}h ${r}m`:`${n}h`:r>=1?i>0?`${r}m ${i}s`:`${r}m`:`${i}s`}function Nc(e){let t=Math.floor(Date.now()/1e3),n=(Va(t,e.rotationInterval)+1)*e.rotationInterval;return Math.max(0,n-t)}var Pc=[`Sun`,`Mon`,`Tue`,`Wed`,`Thu`,`Fri`,`Sat`],Fc=[`Jan`,`Feb`,`Mar`,`Apr`,`May`,`Jun`,`Jul`,`Aug`,`Sep`,`Oct`,`Nov`,`Dec`];function Ic(e,t){if(t>=86400){let t=new Date(Date.now()+e*1e3);return`rotates ${Pc[t.getUTCDay()]} ${t.getUTCDate()} ${Fc[t.getUTCMonth()]} at ${String(t.getUTCHours()).padStart(2,`0`)}:${String(t.getUTCMinutes()).padStart(2,`0`)} UTC (${Mc(e)})`}return`rotates in ${Mc(e)} · ${Oc()}`}function Lc(e){let{identity:t}=l(),n=e.counter+e.usageOffset;return Ra(e.seed,Sc,n,Cc(e),t?.pubkey)}function Rc(e){let{identity:t}=l();if(!t?.pubkey)return null;let n=e.counter+e.usageOffset;return ro(e.seed,Sc,t.pubkey,n,Cc(e),e.tolerance)}function zc(t){Dc();let{groups:n,activeGroupId:r}=l();if(!r){t.innerHTML=``;return}let i=n[r];if(!i){t.innerHTML=``;return}let a=go(i);if(a!==i){u(r,a);return}let o=wc(Lc(i),i.encodingFormat),s=Rc(i),c=s?wc(s,i.encodingFormat):null,d=kc(o),f=Nc(i);t.innerHTML=`
    <section class="hero">

      <div class="hero__word-container">
        <div class="hero__word hero__word--masked" id="hero-word">${d}</div>
        <button
          class="hero__reveal-btn btn"
          id="hero-reveal-btn"
          type="button"
          aria-label="Hold to reveal verification word"
        >Hold to Reveal</button>
      </div>

      <div class="hero__countdown">
        <div class="hero__progress">
          <div class="hero__progress-bar" id="hero-progress-bar" style="width: ${Math.min(100,Math.max(0,(i.rotationInterval-f)/i.rotationInterval*100))}%"></div>
        </div>
        <span class="hero__countdown-label" id="hero-countdown-label">${Ic(f,i.rotationInterval)}</span>
      </div>

      <p class="hero__hint">Press and hold to reveal. Tap the right side for your alternate word.</p>

      <button class="btn btn--ghost" id="burn-btn" type="button" title="Rotate to a new word now. All group members will get a new word too.">I used this word</button>
      <button class="btn btn--outline" id="hero-invite-btn" type="button" title="Share group access with someone new">Invite Someone</button>
      ${i.members.length>=2?`<button class="btn btn--outline" id="hero-call-btn" type="button" title="Start a phone call verification">Verify Call</button>`:``}

    </section>
  `;let p=t.querySelector(`#hero-word`),m=t.querySelector(`#hero-reveal-btn`);function h(e){p&&(p.textContent=e&&c?c:o,p.classList.remove(`hero__word--masked`),p.classList.add(`hero__word--revealed`))}function g(){p&&(p.textContent=d,p.classList.remove(`hero__word--revealed`),p.classList.add(`hero__word--masked`))}m&&(m.addEventListener(`pointerdown`,e=>{e.preventDefault();let t=m.getBoundingClientRect();h(e.clientX-t.left>t.width/2)}),m.addEventListener(`pointerup`,g),m.addEventListener(`pointerleave`,g),m.addEventListener(`pointercancel`,g)),t.querySelector(`#burn-btn`)?.addEventListener(`click`,()=>{try{vc(r),G(e(l().groups[r]??i)===`online`?`Word rotated — syncing to group`:`Word rotated`,`success`,2e3),document.dispatchEvent(new CustomEvent(`canary:vault-publish-now`)),requestAnimationFrame(()=>{let e=document.getElementById(`hero-word`);e&&jc(e,e.textContent??`••••••••`)})}catch(e){G(e instanceof Error?e.message:`Failed to rotate word`,`error`)}}),t.querySelector(`#hero-invite-btn`)?.addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:show-invite`,{detail:{groupId:r}}))}),t.querySelector(`#hero-call-btn`)?.addEventListener(`click`,()=>{let{identity:e}=l(),t=i.members.filter(t=>t!==e?.pubkey);if(t.length===0)return;if(t.length===1){document.dispatchEvent(new CustomEvent(`canary:verify-call`,{detail:{groupId:r,pubkey:t[0]}}));return}let n=t.map(e=>`
      <button class="btn btn--outline member-pick-btn" data-pubkey="${B(e)}" type="button" style="width:100%;text-align:left;margin-bottom:0.5rem;">
        ${B(Tc(e,i))}
      </button>
    `).join(``),a=document.getElementById(`member-picker`);a||(a=document.createElement(`dialog`),a.id=`member-picker`,a.className=`modal`,document.body.appendChild(a)),a.innerHTML=`
      <div class="modal__form" style="min-width:240px;">
        <h2 class="modal__title">Who are you calling?</h2>
        ${n}
        <div class="modal__actions">
          <button class="btn" id="picker-cancel" type="button">Cancel</button>
        </div>
      </div>
    `,a.querySelector(`#picker-cancel`)?.addEventListener(`click`,()=>a.close()),a.addEventListener(`click`,e=>{e.target===a&&a.close()}),a.querySelectorAll(`.member-pick-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.pubkey;a.close(),t&&document.dispatchEvent(new CustomEvent(`canary:verify-call`,{detail:{groupId:r,pubkey:t}}))})}),a.showModal()});let _=t.querySelector(`#hero-progress-bar`),v=t.querySelector(`#hero-countdown-label`);Ec=setInterval(()=>{let{groups:e}=l(),n=e[r];if(!n){Dc();return}let i=Nc(n),a=Math.min(100,Math.max(0,(n.rotationInterval-i)/n.rotationInterval*100));_&&(_.style.width=`${a}%`),v&&(v.textContent=Ic(i,n.rotationInterval)),i===0&&(Dc(),zc(t))},1e3)}var Bc=`canary:duress-dismissed`;function Vc(){try{let e=localStorage.getItem(Bc);return e?new Set(JSON.parse(e)):new Set}catch{return new Set}}function Hc(e){let t=Vc();t.add(e),localStorage.setItem(Bc,JSON.stringify([...t]))}function Uc(e){let t=Vc();t.delete(e),localStorage.setItem(Bc,JSON.stringify([...t]))}function Wc(e,t){let n=l().groups[t];if(!n)return e.slice(0,8);let{identity:r}=l();return r?.pubkey===e?`You`:n.memberNames?.[e]||`${e.slice(0,8)}\u2026${e.slice(-4)}`}function Gc(e){let t=Math.floor(Date.now()/1e3)-e;if(t<30)return`just now`;if(t<60)return`${t}s ago`;let n=Math.floor(t/60);return n<60?`${n} min ago`:new Date(e*1e3).toLocaleTimeString()}function Kc(e,t,n,r,i){if(!i&&Vc().has(e))return;let a=document.querySelector(`.duress-overlay`);a&&a.remove();let o=Wc(e,t),s=r?Gc(r):new Date().toLocaleTimeString(),c=document.createElement(`div`);c.className=`duress-overlay`,c.dataset.subject=e,c.dataset.groupId=t,c.setAttribute(`role`,`alertdialog`),c.setAttribute(`aria-label`,`${o} needs help`);let u=document.createElement(`div`);u.className=`duress-overlay__content`;let d=document.createElement(`div`);d.className=`duress-overlay__icon`,d.setAttribute(`aria-hidden`,`true`),d.textContent=`!`,u.appendChild(d);let f=document.createElement(`h1`);f.className=`duress-overlay__title`,f.textContent=o,u.appendChild(f);let p=document.createElement(`h2`);if(p.className=`duress-overlay__subtitle`,p.textContent=`NEEDS HELP`,u.appendChild(p),n&&(n.lat!==0||n.lon!==0)){let e=document.createElement(`p`);e.className=`duress-overlay__location`,e.textContent=`Last known: ${n.lat.toFixed(4)}, ${n.lon.toFixed(4)}`,u.appendChild(e)}let m=document.createElement(`p`);m.className=`duress-overlay__time`,m.textContent=s,u.appendChild(m);let h=document.createElement(`button`);h.className=`btn btn--lg duress-overlay__dismiss`,h.textContent=`I'm Responding`,h.title=`Dismiss this alert on your screen only — does not clear the duress for others`,h.addEventListener(`click`,()=>{Hc(e),c.classList.remove(`duress-overlay--visible`),setTimeout(()=>c.remove(),300)}),u.appendChild(h);let g=document.createElement(`button`);g.className=`btn btn--lg duress-overlay__stand-down`,g.textContent=`Stand Down — Person is Safe`,g.title=`Broadcast to all group members that this person has been confirmed safe`,g.addEventListener(`click`,()=>{Hc(e),os(t,{type:`duress-clear`,subject:e,timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID()}),c.classList.remove(`duress-overlay--visible`),setTimeout(()=>c.remove(),300);let{identity:n}=l();G(`Duress stood down for ${o} by ${n?.pubkey===e?`Self`:Wc(n?.pubkey??``,t)}`,`success`)}),u.appendChild(g),c.appendChild(u),document.body.appendChild(c),requestAnimationFrame(()=>c.classList.add(`duress-overlay--visible`));function _(e){e.key===`Escape`&&(c.classList.remove(`duress-overlay--visible`),setTimeout(()=>c.remove(),300),document.removeEventListener(`keydown`,_))}document.addEventListener(`keydown`,_)}document.addEventListener(`canary:duress-clear`,(e=>{let{subject:t,clearedBy:n}=e.detail;Uc(t);let r=Array.from(document.querySelectorAll(`.duress-overlay`)).find(e=>e.dataset.subject===t);r&&(r.classList.remove(`duress-overlay--visible`),setTimeout(()=>r.remove(),300));let i=e.detail.groupId,a=Wc(t,i),o=Wc(n,i);G(t===n?`${a} self-cleared their duress`:`${o} confirmed ${a} is safe`,`success`)}));function qc(e){let t=new Uint32Array(1);return crypto.getRandomValues(t),t[0]%e}function Jc(e){let{groups:t,activeGroupId:n,identity:r}=l();if(r?.pubkey===e)return`You`;if(!n)return e.slice(0,8)+`…`;let i=t[n];return i&&i.memberNames?.[e]||e.slice(0,8)+`…`}function Yc(e,t){let n=[],r=new Set(t);for(;n.length<e;){let e=wa(qc(Sa)).toLowerCase();r.has(e)||(r.add(e),n.push(e))}return n}function Xc(e){for(let t=e.length-1;t>0;t--){let n=qc(t+1);[e[t],e[n]]=[e[n],e[t]]}return e}function Zc(e,t){for(let n of e)Kc(n,t,void 0,Math.floor(Date.now()/1e3),!0);document.dispatchEvent(new CustomEvent(`canary:duress`,{detail:{members:e},bubbles:!0}));let{groups:n}=l(),r=n[t];if(!r)return;let i=ic(r.seed);for(let n of e)cc(i,sc(n,null)),os(t,{type:`duress-alert`,lat:0,lon:0,timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID(),subject:n})}function Qc(e){let{groups:t,activeGroupId:n}=l();if(!n){e.innerHTML=``;return}let r=t[n];if(!r){e.innerHTML=``;return}let{identity:i}=l(),a=r.members.filter(e=>e!==i?.pubkey);if(a.length===0){e.innerHTML=`
      <section class="panel verify-panel">
        <h2 class="panel__title">Verify Someone</h2>
        <p class="settings-hint">No other members to verify yet. Invite someone first.</p>
      </section>
    `;return}e.innerHTML=`
    <section class="panel verify-panel">
      <h2 class="panel__title">Verify Someone</h2>
      <p class="settings-hint">Who are you verifying?</p>

      <div class="verify-member-list" id="verify-member-list">
        ${a.map(e=>`<button class="verify-member-btn btn btn--outline" data-pubkey="${B(e)}" type="button">${B(Jc(e))}</button>`).join(``)}
      </div>

      <div id="verify-choices-area" hidden>
        <p class="settings-hint" id="verify-prompt"></p>
        <div class="verify-choices" id="verify-choices"></div>
      </div>

      <details class="verify-fallback" style="margin-top: 0.75rem;">
        <summary class="settings-hint" style="cursor: pointer;">Type manually</summary>
        <div class="verify-form" style="margin-top: 0.5rem;">
          <input class="input" id="verify-input" type="text" placeholder="${r.encodingFormat===`pin`?`Enter PIN`:`Enter word`}" autocomplete="off" spellcheck="false" />
          <button class="btn btn--primary" id="verify-btn" type="button">Verify</button>
        </div>
      </details>

      <div id="verify-result" class="verify-result" hidden></div>
      <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
        <button class="btn btn--ghost" id="verify-back" type="button" hidden>Verify another</button>
      </div>
    </section>
  `;let o=e.querySelector(`#verify-member-list`),s=e.querySelector(`#verify-choices-area`),c=e.querySelector(`#verify-choices`),u=e.querySelector(`#verify-prompt`),d=e.querySelector(`#verify-result`),f=e.querySelector(`#verify-back`);function p(e){let{groups:t,activeGroupId:n}=l();if(!n)return;let r=t[n];if(!r)return;let i=Va(Math.floor(Date.now()/1e3),r.rotationInterval)+r.usageOffset,a=Cc(r),f=Ra(r.seed,Sc,i,a,e).toLowerCase(),p=ro(r.seed,Sc,e,i,a,r.tolerance)?.toLowerCase(),h=new Set([f]);p&&h.add(p);let g=Yc(p?2:3,h),_=Xc([f,...p?[p]:[],...g]);u.textContent=`Tap the word ${Jc(e)} just said:`,d.hidden=!0,c.innerHTML=_.map(e=>`<button class="verify-choice" data-word="${B(e)}" type="button">${B(wc(e,r.encodingFormat))}</button>`).join(``),o.hidden=!0,s.hidden=!1,c.querySelectorAll(`.verify-choice`).forEach(t=>{t.addEventListener(`click`,()=>m(t.dataset.word??``,t,e))})}function m(e,t,n){let{groups:r,activeGroupId:i}=l();if(!i)return;let a=r[i];if(!a)return;let o=Va(Math.floor(Date.now()/1e3),a.rotationInterval)+a.usageOffset,s=io(a.seed,Sc,o,e,a.members,{encoding:Cc(a),tolerance:a.tolerance}),u=s.status===`valid`,p=Jc(n);c.querySelectorAll(`.verify-choice`).forEach(e=>e.classList.remove(`verify-choice--correct`,`verify-choice--wrong`)),t.classList.add(u?`verify-choice--correct`:`verify-choice--wrong`),d.hidden=!1,d.className=`verify-result verify-result--${u?`valid`:`invalid`}`,d.textContent=u?`${p} is verified.`:`${p} gave the wrong word.`,f.hidden=!1,s.status===`duress`&&Zc(s.identities??[],i)}e.querySelectorAll(`.verify-member-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.pubkey;t&&p(t)})}),f.addEventListener(`click`,()=>{o.hidden=!1,s.hidden=!0,d.hidden=!0,f.hidden=!0});let h=e.querySelector(`#verify-input`),g=e.querySelector(`#verify-btn`);function _(){let e=h?.value.trim().toLowerCase().replace(/-/g,``)??``;if(!e)return;let{groups:t,activeGroupId:n}=l();if(!n)return;let r=t[n];if(!r)return;let i=Va(Math.floor(Date.now()/1e3),r.rotationInterval)+r.usageOffset,a=io(r.seed,Sc,i,e,r.members,{encoding:Cc(r),tolerance:r.tolerance}),o=a.status===`valid`;d.hidden=!1,d.className=`verify-result verify-result--${o?`valid`:`invalid`}`,d.textContent=o?`Verified.`:`Wrong word.`,f.hidden=!1,a.status===`duress`&&Zc(a.identities??[],n)}g?.addEventListener(`click`,_),h?.addEventListener(`keydown`,e=>{e.key===`Enter`&&_()})}function $c(e){let t=JSON.stringify(e),n=new TextEncoder().encode(t),r=``;for(let e=0;e<n.length;e++)r+=String.fromCharCode(n[e]);return btoa(r)}function el(e){let t=atob(e),n=new Uint8Array(t.length);for(let e=0;e<t.length;e++)n[e]=t.charCodeAt(e);return JSON.parse(new TextDecoder().decode(n))}function tl(e){return $c(e).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=+$/,``)}function nl(e){let t=e.replace(/-/g,`+`).replace(/_/g,`/`),n=t.length%4;return n===2?t+=`==`:n===3&&(t+=`=`),el(t)}function rl(e){let t=``;for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return btoa(t).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=+$/,``)}function il(e){let t=e.replace(/-/g,`+`).replace(/_/g,`/`),n=t.length%4;n===2?t+=`==`:n===3&&(t+=`=`);let r=atob(t),i=new Uint8Array(r.length);for(let e=0;e<r.length;e++)i[e]=r.charCodeAt(e);return i}var al=/^[0-9a-f]{64}$/,ol=/^[0-9a-f]{128}$/,sl=/^[0-9a-f]{32}$/;function cl(e){let{adminSig:t,...n}=e,r=Object.keys(n).sort().reduce((e,t)=>(e[t]=n[t],e),{});return new TextEncoder().encode(JSON.stringify(r))}var ll=27235;function ul(e){return{kind:ll,created_at:e.issuedAt??Math.max(0,e.expiresAt-86400),tags:[[`client`,`canary-kit`],[`canary-protocol`,`remote-invite-v1`],[`g`,e.groupId],[`d`,e.inviteId]],content:new TextDecoder().decode(cl(e))}}function dl(e){return W(ti({...ul(e),pubkey:e.adminPubkey}))}function fl(e){try{let t=la(cl(e));if(E.verify(W(e.adminSig),t,W(e.adminPubkey)))return!0}catch{}try{return E.verify(W(e.adminSig),dl(e),W(e.adminPubkey))}catch{return!1}}function pl(e,t,n){let r=e;if(!r||typeof r!=`object`)throw Error(`NIP-07 signer returned an invalid event.`);if(r.pubkey!==t)throw Error(`NIP-07 signer used a different public key.`);if(typeof r.sig!=`string`||!ol.test(r.sig))throw Error(`NIP-07 signer returned an invalid signature.`);let i=ti({...n,pubkey:t});if(r.id&&r.id!==i)throw Error(`NIP-07 signer returned a signature for a different event.`)}function ml(e){let{groupName:t,groupId:n,adminPubkey:r,adminPrivkey:i,relays:a,expiresInSec:o=86400}=e,s=new Uint8Array(16);crypto.getRandomValues(s);let c=pa(s),l=Math.floor(Date.now()/1e3),u={groupName:t,groupId:n,adminPubkey:r,inviteId:c,issuedAt:l,expiresAt:l+o,relays:[...a],adminSig:``},d=la(cl(u));return u.adminSig=pa(E.sign(d,W(i))),u}async function hl(e){let{groupName:t,groupId:n,adminPubkey:r,relays:i,signEvent:a,expiresInSec:o=86400}=e,s=new Uint8Array(16);crypto.getRandomValues(s);let c=pa(s),l=Math.floor(Date.now()/1e3),u={groupName:t,groupId:n,adminPubkey:r,inviteId:c,issuedAt:l,expiresAt:l+o,relays:[...i],adminSig:``},d=ul(u),f=await a(d);return pl(f,r,d),u.adminSig=f.sig,u}function gl(e){if(typeof e!=`object`||!e)throw Error(`Remote invite token must be a non-null object`);let t=e;if(typeof t.groupName!=`string`||t.groupName.length===0)throw Error(`groupName must be a non-empty string`);if(typeof t.groupId!=`string`||t.groupId.length===0)throw Error(`groupId must be a non-empty string`);if(typeof t.adminPubkey!=`string`||!al.test(t.adminPubkey))throw Error(`adminPubkey must be a 64-character hex string`);if(typeof t.inviteId!=`string`||!sl.test(t.inviteId))throw Error(`inviteId must be a 32-character hex string`);if(typeof t.adminSig!=`string`||!ol.test(t.adminSig))throw Error(`adminSig must be a 128-character hex string`);if(!Array.isArray(t.relays)||!t.relays.every(e=>typeof e==`string`))throw Error(`relays must be an array of strings`);if(typeof t.expiresAt!=`number`||!Number.isFinite(t.expiresAt))throw Error(`expiresAt must be a finite number`);if(t.issuedAt!==void 0&&(typeof t.issuedAt!=`number`||!Number.isFinite(t.issuedAt)))throw Error(`issuedAt must be a finite number`);let n=Math.floor(Date.now()/1e3);if(t.expiresAt<=n)throw Error(`Remote invite token has expired`);if(!fl(e))throw Error(`Remote invite token signature is invalid`)}function _l(e){let{welcome:t,adminPrivkey:n,joinerPubkey:r}=e;return Qi(JSON.stringify(t),Ui(W(n),r))}function vl(e){let{envelope:t,joinerPrivkey:n,adminPubkey:r,expectedInviteId:i}=e;return yl($i(t,Ui(W(n),r)),i)}function yl(e,t){let n=JSON.parse(e);if(typeof n.inviteId!=`string`||!sl.test(n.inviteId))throw Error(`Welcome payload must include a valid inviteId`);if(n.inviteId!==t)throw Error(`Welcome payload inviteId does not match the pending invite`);if(typeof n.seed!=`string`||!al.test(n.seed))throw Error(`Welcome payload seed must be a 64-character hex string`);if(typeof n.groupId!=`string`||n.groupId.length===0)throw Error(`Welcome payload must include a non-empty groupId`);return n}function bl(e){if(e.startsWith(`wss://`))return!0;if(e.startsWith(`ws://`))try{let t=new URL(e);return t.hostname===`localhost`||t.hostname===`127.0.0.1`||t.hostname===`[::1]`}catch{return!1}return!1}var xl=/^[0-9a-f]{64}$/,Sl=/^[0-9a-f]{128}$/,Cl=/^[0-9a-f]{32}$/,wl=10080*60,Tl=300;function El(e){return typeof e==`number`&&Number.isInteger(e)&&e>=0}function Dl(){let e=new Uint8Array(16);return crypto.getRandomValues(e),Array.from(e).map(e=>e.toString(16).padStart(2,`0`)).join(``)}function Ol(e){let t=e;if(!t||typeof t!=`object`)throw Error(`Invalid invite payload — expected an object.`);if(typeof t.groupId!=`string`||t.groupId.length===0)throw Error(`Invalid invite payload — groupId is required.`);if(typeof t.seed!=`string`||!xl.test(t.seed))throw Error(`Invalid invite payload — seed must be 64-char hex.`);if(typeof t.groupName!=`string`||t.groupName.trim().length===0)throw Error(`Invalid invite payload — groupName is required.`);if(!Number.isInteger(t.rotationInterval)||t.rotationInterval<=0)throw Error(`Invalid invite payload — rotationInterval must be > 0.`);if(t.wordCount!==1&&t.wordCount!==2&&t.wordCount!==3)throw Error(`Invalid invite payload — wordCount must be 1, 2, or 3.`);if(typeof t.wordlist!=`string`||t.wordlist.length===0)throw Error(`Invalid invite payload — wordlist is required.`);if(!El(t.counter)||!El(t.usageOffset))throw Error(`Invalid invite payload — counter and usageOffset must be non-negative integers.`);if(typeof t.nonce!=`string`||!Cl.test(t.nonce))throw Error(`Invalid invite payload — nonce must be 32-char hex.`);if(!Number.isInteger(t.beaconInterval)||t.beaconInterval<=0)throw Error(`Invalid invite payload — beaconInterval must be > 0.`);if(!Number.isInteger(t.beaconPrecision)||t.beaconPrecision<1||t.beaconPrecision>11)throw Error(`Invalid invite payload — beaconPrecision must be 1..11.`);if(!Array.isArray(t.members)||!t.members.every(e=>typeof e==`string`&&xl.test(e)))throw Error(`Invalid invite payload — members must be 64-char hex pubkeys.`);if(!Array.isArray(t.relays)||!t.relays.every(e=>typeof e==`string`&&bl(e)))throw Error(`Invalid invite payload — relays must be wss:// URLs (or ws:// for localhost).`);if(t.encodingFormat!==`words`&&t.encodingFormat!==`pin`&&t.encodingFormat!==`hex`)throw Error(`Invalid invite payload — encodingFormat must be words|pin|hex.`);if(!El(t.tolerance))throw Error(`Invalid invite payload — tolerance must be a non-negative integer.`);if(t.tolerance>10)throw Error(`Invalid invite payload — tolerance must be <= 10.`);if(!El(t.issuedAt)||!El(t.expiresAt))throw Error(`Invalid invite payload — issuedAt/expiresAt must be unix seconds.`);if(t.expiresAt<=t.issuedAt)throw Error(`Invalid invite payload — expiresAt must be after issuedAt.`);if(!El(t.epoch))throw Error(`Invalid invite payload — epoch must be a non-negative integer.`);if(!Array.isArray(t.admins)||!t.admins.every(e=>typeof e==`string`&&xl.test(e)))throw Error(`Invalid invite payload — admins must be 64-char hex pubkeys.`);let n=new Set(t.members);if(!t.admins.every(e=>n.has(e)))throw Error(`Invalid invite payload — all admins must be in members.`);if(t.protocolVersion===void 0||t.protocolVersion===null)throw Error(`Invalid invite payload — protocolVersion is required.`);if(t.protocolVersion!==2)throw Error(`Unsupported invite protocol version: ${t.protocolVersion} (expected: 2)`);if(typeof t.inviterPubkey!=`string`||!xl.test(t.inviterPubkey))throw Error(`Invalid invite payload — inviterPubkey must be a 64-char hex pubkey.`);if(!t.admins.includes(t.inviterPubkey))throw Error(`Invalid invite payload — inviterPubkey must be in admins.`);if(typeof t.inviterSig!=`string`||!Sl.test(t.inviterSig))throw Error(`Invalid invite payload — inviterSig must be a 128-char hex Schnorr signature.`)}function kl(e){let{inviterSig:t,memberNames:n,relays:r,...i}=e,a=Object.keys(i).sort().reduce((e,t)=>(e[t]=i[t],e),{});return new TextEncoder().encode(JSON.stringify(a))}function Al(e,t){let n=la(kl(e));return pa(E.sign(n,W(t)))}var jl=27234;function Ml(e){return{kind:jl,created_at:e.issuedAt,tags:[[`client`,`canary-kit`],[`canary-protocol`,`invite-v1`],[`g`,e.groupId],[`nonce`,e.nonce]],content:new TextDecoder().decode(kl(e))}}function Nl(e){return W(ti({...Ml(e),pubkey:e.inviterPubkey}))}function Pl(e,t,n){let r=e;if(!r||typeof r!=`object`)throw Error(`NIP-07 signer returned an invalid event.`);if(r.pubkey!==t)throw Error(`NIP-07 signer used a different public key.`);if(typeof r.sig!=`string`||!Sl.test(r.sig))throw Error(`NIP-07 signer returned an invalid signature.`);let i=ti({...n,pubkey:t});if(r.id&&r.id!==i)throw Error(`NIP-07 signer returned a signature for a different event.`)}function Fl(){if(typeof window>`u`)return null;let e=window.nostr?.signEvent;return typeof e==`function`?t=>e.call(window.nostr,t):null}async function Il(e,t=Fl()??(()=>Promise.reject(Error(`NIP-07 signer is not available.`)))){let n=Ml(e),r=await t(n);return Pl(r,e.inviterPubkey,n),r.sig}function Ll(e){try{let t=la(kl(e));if(E.verify(W(e.inviterSig),t,W(e.inviterPubkey)))return!0}catch{}try{return E.verify(W(e.inviterSig),Nl(e),W(e.inviterPubkey))}catch{return!1}}function Rl(e){let{nonce:t,relays:n,memberNames:r,...i}=e,a=JSON.stringify(i),o=new TextEncoder,s=da(W(t),o.encode(a)),c=s[0]<<25|s[1]<<17|s[2]<<9|s[3]<<1|s[4]>>7,l=c>>>22&2047,u=c>>>11&2047,d=c&2047;return`${wa(l)} ${wa(u)} ${wa(d)}`}function zl(e,t){if(!e?.pubkey)throw Error(`No identity — sign in first.`);if(!t.admins.includes(e.pubkey))throw Error(`Not authorised — you are not an admin of "${t.name}".`)}function Bl(e,t){let n=Dl(),r=Math.floor(Date.now()/1e3);return{groupId:e.id,seed:e.seed,groupName:e.name,rotationInterval:e.rotationInterval,wordCount:e.wordCount,wordlist:e.wordlist,counter:e.counter,usageOffset:e.usageOffset,nonce:n,beaconInterval:e.beaconInterval,beaconPrecision:e.beaconPrecision,members:[...e.members],relays:[...e.writeRelays??e.relays??[]],encodingFormat:e.encodingFormat??`words`,tolerance:e.tolerance??1,issuedAt:r,expiresAt:r+wl,epoch:e.epoch??0,admins:[...e.admins??[]],protocolVersion:2,inviterPubkey:t,inviterSig:``,memberNames:{...e.memberNames}}}async function Vl(e,t){if(t.privkey)return Al(e,t.privkey);if(t.signerType===`nip07`)return Il(e);throw Error(`Invite creation requires a local key or a NIP-07 signer.`)}async function Hl(e){let{identity:t}=l();zl(t,e);let n=Bl(e,t.pubkey);return n.inviterSig=await Vl(n,t),{payload:n,confirmCode:Rl(n)}}function Ul(e,t){let n;try{n=el(e)}catch{throw Error(`Invalid invite payload — could not decode.`)}Ol(n);let r={groupId:n.groupId,seed:n.seed,groupName:n.groupName,rotationInterval:n.rotationInterval,wordCount:n.wordCount,wordlist:n.wordlist,counter:n.counter,usageOffset:n.usageOffset,nonce:n.nonce,beaconInterval:n.beaconInterval,beaconPrecision:n.beaconPrecision,members:[...n.members],relays:[...n.relays],encodingFormat:n.encodingFormat,tolerance:n.tolerance,issuedAt:n.issuedAt,expiresAt:n.expiresAt,epoch:n.epoch,admins:[...n.admins],protocolVersion:n.protocolVersion,inviterPubkey:n.inviterPubkey,inviterSig:n.inviterSig,memberNames:n.memberNames&&typeof n.memberNames==`object`?{...n.memberNames}:void 0};if(!Ll(r))throw Error(`Invite signature is invalid — the inviter could not prove control of the admin key.`);if(!t?.trim())throw Error(`Confirmation code is required — ask the sender to read it to you.`);let i=Rl(r);if(t.trim().replace(/[-\s]+/g,` `).toLowerCase()!==i.toLowerCase())throw Error(`Confirmation words do not match — invite may have been tampered with.`);let a=Math.floor(Date.now()/1e3);if(r.expiresAt<=a)throw Error(`Invite has expired. Ask for a new invite.`);if(r.issuedAt>a+Tl)throw Error(`Invite timestamp is too far in the future — check your device clock.`);return r}function Wl(e,t){let{groups:n}=l(),r=n[e];return r?Array.isArray(r.usedInvites)&&r.usedInvites.includes(t):!1}function Gl(e,t){let{groups:n}=l(),r=n[e];if(!r){console.warn(`[canary:invite] consumeInvite: unknown group id "${e}"`);return}u(e,{usedInvites:Array.from(new Set([...r.usedInvites,t]))})}var Kl=10080*60;function ql(e){let t=Object.keys(e).sort().reduce((t,n)=>(t[n]=e[n],t),{});return new TextEncoder().encode(JSON.stringify(t))}function Jl(e,t){let n;try{n=el(e)}catch{return{valid:!1,error:`Invalid join token — could not decode.`}}if(n.g!==t.groupId)return{valid:!1,error:`Join token is for a different group.`};if(typeof n.p!=`string`||!xl.test(n.p))return{valid:!1,error:`Join token has invalid pubkey.`};if(typeof n.s!=`string`||!Sl.test(n.s))return{valid:!1,error:`Join token has invalid signature.`};let r=Math.floor(Date.now()/1e3);if(typeof n.t!=`number`||n.t<r-Kl)return{valid:!1,error:`Join token has expired or is stale.`};if(n.t>r+Tl)return{valid:!1,error:`Join token timestamp is too far in the future.`};let{s:i,...a}=n,o=la(ql(a));try{if(!E.verify(W(n.s),o,W(n.p)))return{valid:!1,error:`Join token signature is invalid.`}}catch{return{valid:!1,error:`Join token signature verification failed.`}}let s=(n.w||``).toLowerCase(),c=t.tolerance??1,l=!1;for(let e=t.counter-c;e<=t.counter+c;e++)if(!(e<0)&&s===Ra(t.groupSeed,t.context,e,t.encoding).toLowerCase()){l=!0;break}return l?{valid:!0,pubkey:n.p,displayName:n.n||``,word:n.w||``}:{valid:!1,error:`Join token word does not match — seed possession not proven.`}}var Yl=null;function Xl(e){return e.writeRelays?.length?[...e.writeRelays]:[...l().settings.defaultWriteRelays??l().settings.defaultRelays]}function Zl(e,t){if(!e?.pubkey)throw Error(`No identity — sign in first.`);if(!t.admins.includes(e.pubkey))throw Error(`Not authorised — you are not an admin of "${t.name}".`)}function Ql(e,t){return{inviteId:t,seed:e.seed,counter:e.counter,usageOffset:e.usageOffset,epoch:e.epoch??0,wordCount:e.wordCount,rotationInterval:e.rotationInterval,groupId:e.id,groupName:e.name,wordlist:e.wordlist,beaconInterval:e.beaconInterval,beaconPrecision:e.beaconPrecision,encodingFormat:e.encodingFormat??`words`,tolerance:e.tolerance??1,members:[...e.members],admins:[...e.admins??[]],relays:[...e.writeRelays??e.relays??[]],memberNames:e.memberNames?{...e.memberNames}:void 0}}function $l(){if(typeof window>`u`)return null;let e=window.nostr?.nip44?.encrypt;return typeof e==`function`?(t,n)=>e.call(window.nostr.nip44,t,n):null}async function eu(e){let{identity:t}=l();Zl(t,e);let n=Xl(e),r=t.privkey?ml({groupName:e.name,groupId:e.id,adminPubkey:t.pubkey,adminPrivkey:t.privkey,relays:n}):t.signerType===`nip07`?await hl({groupName:e.name,groupId:e.id,adminPubkey:t.pubkey,relays:n,signEvent:e=>tu(e)}):null;if(!r)throw Error(`Invite creation requires a local key or a NIP-07 signer.`);return Yl={groupId:e.id,tokenPayload:tl(r),inviteId:r.inviteId},Yl}function tu(e){let t=Fl();return t?t(e):Promise.reject(Error(`NIP-07 signer is not available.`))}async function nu(e,t){let{identity:n}=l();if(!n?.pubkey)throw Error(`No identity — sign in first.`);if(!Yl)throw Error(`No active remote invite session — cannot create welcome envelope.`);let r=Ql(e,Yl.inviteId);if(n.privkey)return _l({welcome:r,adminPrivkey:n.privkey,joinerPubkey:t});if(n.signerType===`nip07`){let e=$l();if(!e)throw Error(`NIP-07 extension does not support NIP-44 encryption.`);return e(t,JSON.stringify(r))}throw Error(`No local key or NIP-07 signer — cannot create welcome envelope.`)}function ru(){Yl=null}function iu(e){let t=new Uint8Array(e.length/2);for(let n=0;n<t.length;n++)t[n]=parseInt(e.substring(n*2,n*2+2),16);return t}function au(e){let t=``;for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,`0`);return t}var ou={words:0,pin:1,hex:2},su={0:`words`,1:`pin`,2:`hex`},cu={"en-v1":0},lu={0:`en-v1`},uu=1,du=new TextEncoder,fu=new TextDecoder;function pu(e){let t=du.encode(e.groupId),n=du.encode(e.groupName),r=e.admins.map(t=>{let n=e.members.indexOf(t);if(n===-1)throw Error(`Admin ${t} not found in members array`);return n}),i=178+e.members.length*32+1+r.length+1+t.length+1+n.length,a=new ArrayBuffer(i),o=new DataView(a),s=new Uint8Array(a),c=0;o.setUint8(c,uu),c+=1,s.set(iu(e.seed),c),c+=32,s.set(iu(e.inviterPubkey),c),c+=32,s.set(iu(e.inviterSig),c),c+=64,s.set(iu(e.nonce),c),c+=16,o.setUint32(c,e.counter),c+=4,o.setUint16(c,e.usageOffset),c+=2,o.setUint32(c,e.epoch),c+=4,o.setUint32(c,e.rotationInterval),c+=4,o.setUint32(c,e.beaconInterval),c+=4,o.setUint8(c,e.beaconPrecision),c+=1,o.setUint8(c,e.wordCount),c+=1,o.setUint8(c,e.tolerance),c+=1,o.setUint8(c,ou[e.encodingFormat]??0),c+=1,o.setUint8(c,cu[e.wordlist]??0),c+=1,o.setUint32(c,e.issuedAt),c+=4,o.setUint32(c,e.expiresAt),c+=4,o.setUint8(c,e.protocolVersion),c+=1,o.setUint8(c,e.members.length),c+=1;for(let t of e.members)s.set(iu(t),c),c+=32;o.setUint8(c,r.length),c+=1;for(let e of r)o.setUint8(c,e),c+=1;return o.setUint8(c,t.length),c+=1,s.set(t,c),c+=t.length,o.setUint8(c,n.length),c+=1,s.set(n,c),c+=n.length,s}function mu(e){let t=new DataView(e.buffer,e.byteOffset,e.byteLength),n=0,r=t.getUint8(n);if(n+=1,r!==uu)throw Error(`Unsupported binary invite version: ${r}`);let i=au(e.slice(n,n+32));n+=32;let a=au(e.slice(n,n+32));n+=32;let o=au(e.slice(n,n+64));n+=64;let s=au(e.slice(n,n+16));n+=16;let c=t.getUint32(n);n+=4;let l=t.getUint16(n);n+=2;let u=t.getUint32(n);n+=4;let d=t.getUint32(n);n+=4;let f=t.getUint32(n);n+=4;let p=t.getUint8(n);n+=1;let m=t.getUint8(n);n+=1;let h=t.getUint8(n);n+=1;let g=su[t.getUint8(n)]??`words`;n+=1;let _=lu[t.getUint8(n)]??`en-v1`;n+=1;let v=t.getUint32(n);n+=4;let y=t.getUint32(n);n+=4;let ee=t.getUint8(n);n+=1;let te=t.getUint8(n);n+=1;let b=[];for(let t=0;t<te;t++)b.push(au(e.slice(n,n+32))),n+=32;let x=t.getUint8(n);n+=1;let S=[];for(let e=0;e<x;e++){let e=t.getUint8(n);if(n+=1,e>=b.length)throw Error(`Invalid admin index ${e} in binary invite (${b.length} members)`);S.push(b[e])}let C=t.getUint8(n);n+=1;let w=fu.decode(e.slice(n,n+C));n+=C;let T=t.getUint8(n);n+=1;let E=fu.decode(e.slice(n,n+T));return n+=T,{groupId:w,seed:i,groupName:E,rotationInterval:d,wordCount:m,wordlist:_,counter:c,usageOffset:l,nonce:s,beaconInterval:f,beaconPrecision:p,members:b,relays:[],encodingFormat:g,tolerance:h,issuedAt:v,expiresAt:y,epoch:u,admins:S,protocolVersion:ee,inviterPubkey:a,inviterSig:o}}var hu=function(e,t){let n=e,r=gu[t],i=null,a=0,o=null,s=[],c={},l=function(e,t){a=n*4+17,i=function(e){let t=Array(e);for(let n=0;n<e;n+=1){t[n]=Array(e);for(let r=0;r<e;r+=1)t[n][r]=null}return t}(a),u(0,0),u(a-7,0),u(0,a-7),p(),f(),h(e,t),n>=7&&m(e),o??=v(n,r,s),g(o,t)},u=function(e,t){for(let n=-1;n<=7;n+=1)if(!(e+n<=-1||a<=e+n))for(let r=-1;r<=7;r+=1)t+r<=-1||a<=t+r||(0<=n&&n<=6&&(r==0||r==6)||0<=r&&r<=6&&(n==0||n==6)||2<=n&&n<=4&&2<=r&&r<=4?i[e+n][t+r]=!0:i[e+n][t+r]=!1)},d=function(){let e=0,t=0;for(let n=0;n<8;n+=1){l(!0,n);let r=vu.getLostPoint(c);(n==0||e>r)&&(e=r,t=n)}return t},f=function(){for(let e=8;e<a-8;e+=1)i[e][6]??(i[e][6]=e%2==0);for(let e=8;e<a-8;e+=1)i[6][e]??(i[6][e]=e%2==0)},p=function(){let e=vu.getPatternPosition(n);for(let t=0;t<e.length;t+=1)for(let n=0;n<e.length;n+=1){let r=e[t],a=e[n];if(i[r][a]==null)for(let e=-2;e<=2;e+=1)for(let t=-2;t<=2;t+=1)e==-2||e==2||t==-2||t==2||e==0&&t==0?i[r+e][a+t]=!0:i[r+e][a+t]=!1}},m=function(e){let t=vu.getBCHTypeNumber(n);for(let n=0;n<18;n+=1){let r=!e&&(t>>n&1)==1;i[Math.floor(n/3)][n%3+a-8-3]=r}for(let n=0;n<18;n+=1){let r=!e&&(t>>n&1)==1;i[n%3+a-8-3][Math.floor(n/3)]=r}},h=function(e,t){let n=r<<3|t,o=vu.getBCHTypeInfo(n);for(let t=0;t<15;t+=1){let n=!e&&(o>>t&1)==1;t<6?i[t][8]=n:t<8?i[t+1][8]=n:i[a-15+t][8]=n}for(let t=0;t<15;t+=1){let n=!e&&(o>>t&1)==1;t<8?i[8][a-t-1]=n:t<9?i[8][15-t-1+1]=n:i[8][15-t-1]=n}i[a-8][8]=!e},g=function(e,t){let n=-1,r=a-1,o=7,s=0,c=vu.getMaskFunction(t);for(let t=a-1;t>0;t-=2)for(t==6&&--t;;){for(let n=0;n<2;n+=1)if(i[r][t-n]==null){let a=!1;s<e.length&&(a=(e[s]>>>o&1)==1),c(r,t-n)&&(a=!a),i[r][t-n]=a,--o,o==-1&&(s+=1,o=7)}if(r+=n,r<0||a<=r){r-=n,n=-n;break}}},_=function(e,t){let n=0,r=0,i=0,a=Array(t.length),o=Array(t.length);for(let s=0;s<t.length;s+=1){let c=t[s].dataCount,l=t[s].totalCount-c;r=Math.max(r,c),i=Math.max(i,l),a[s]=Array(c);for(let t=0;t<a[s].length;t+=1)a[s][t]=255&e.getBuffer()[t+n];n+=c;let u=vu.getErrorCorrectPolynomial(l),d=bu(a[s],u.getLength()-1).mod(u);o[s]=Array(u.getLength()-1);for(let e=0;e<o[s].length;e+=1){let t=e+d.getLength()-o[s].length;o[s][e]=t>=0?d.getAt(t):0}}let s=0;for(let e=0;e<t.length;e+=1)s+=t[e].totalCount;let c=Array(s),l=0;for(let e=0;e<r;e+=1)for(let n=0;n<t.length;n+=1)e<a[n].length&&(c[l]=a[n][e],l+=1);for(let e=0;e<i;e+=1)for(let n=0;n<t.length;n+=1)e<o[n].length&&(c[l]=o[n][e],l+=1);return c},v=function(e,t,n){let r=xu.getRSBlocks(e,t),i=Su();for(let t=0;t<n.length;t+=1){let r=n[t];i.put(r.getMode(),4),i.put(r.getLength(),vu.getLengthInBits(r.getMode(),e)),r.write(i)}let a=0;for(let e=0;e<r.length;e+=1)a+=r[e].dataCount;if(i.getLengthInBits()>a*8)throw`code length overflow. (`+i.getLengthInBits()+`>`+a*8+`)`;for(i.getLengthInBits()+4<=a*8&&i.put(0,4);i.getLengthInBits()%8!=0;)i.putBit(!1);for(;!(i.getLengthInBits()>=a*8||(i.put(236,8),i.getLengthInBits()>=a*8));)i.put(17,8);return _(i,r)};c.addData=function(e,t){t||=`Byte`;let n=null;switch(t){case`Numeric`:n=Cu(e);break;case`Alphanumeric`:n=wu(e);break;case`Byte`:n=Tu(e);break;case`Kanji`:n=Eu(e);break;default:throw`mode:`+t}s.push(n),o=null},c.isDark=function(e,t){if(e<0||a<=e||t<0||a<=t)throw e+`,`+t;return i[e][t]},c.getModuleCount=function(){return a},c.make=function(){if(n<1){let e=1;for(;e<40;e++){let t=xu.getRSBlocks(e,r),n=Su();for(let t=0;t<s.length;t++){let r=s[t];n.put(r.getMode(),4),n.put(r.getLength(),vu.getLengthInBits(r.getMode(),e)),r.write(n)}let i=0;for(let e=0;e<t.length;e++)i+=t[e].dataCount;if(n.getLengthInBits()<=i*8)break}n=e}l(!1,d())},c.createTableTag=function(e,t){e||=2,t=t===void 0?e*4:t;let n=``;n+=`<table style="`,n+=` border-width: 0px; border-style: none;`,n+=` border-collapse: collapse;`,n+=` padding: 0px; margin: `+t+`px;`,n+=`">`,n+=`<tbody>`;for(let t=0;t<c.getModuleCount();t+=1){n+=`<tr>`;for(let r=0;r<c.getModuleCount();r+=1)n+=`<td style="`,n+=` border-width: 0px; border-style: none;`,n+=` border-collapse: collapse;`,n+=` padding: 0px; margin: 0px;`,n+=` width: `+e+`px;`,n+=` height: `+e+`px;`,n+=` background-color: `,n+=c.isDark(t,r)?`#000000`:`#ffffff`,n+=`;`,n+=`"/>`;n+=`</tr>`}return n+=`</tbody>`,n+=`</table>`,n},c.createSvgTag=function(e,t,n,r){let i={};typeof arguments[0]==`object`&&(i=arguments[0],e=i.cellSize,t=i.margin,n=i.alt,r=i.title),e||=2,t=t===void 0?e*4:t,n=typeof n==`string`?{text:n}:n||{},n.text=n.text||null,n.id=n.text?n.id||`qrcode-description`:null,r=typeof r==`string`?{text:r}:r||{},r.text=r.text||null,r.id=r.text?r.id||`qrcode-title`:null;let a=c.getModuleCount()*e+t*2,o,s,l,u,d=``,f;for(f=`l`+e+`,0 0,`+e+` -`+e+`,0 0,-`+e+`z `,d+=`<svg version="1.1" xmlns="http://www.w3.org/2000/svg"`,d+=i.scalable?``:` width="`+a+`px" height="`+a+`px"`,d+=` viewBox="0 0 `+a+` `+a+`" `,d+=` preserveAspectRatio="xMinYMin meet"`,d+=r.text||n.text?` role="img" aria-labelledby="`+y([r.id,n.id].join(` `).trim())+`"`:``,d+=`>`,d+=r.text?`<title id="`+y(r.id)+`">`+y(r.text)+`</title>`:``,d+=n.text?`<description id="`+y(n.id)+`">`+y(n.text)+`</description>`:``,d+=`<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>`,d+=`<path d="`,l=0;l<c.getModuleCount();l+=1)for(u=l*e+t,o=0;o<c.getModuleCount();o+=1)c.isDark(l,o)&&(s=o*e+t,d+=`M`+s+`,`+u+f);return d+=`" stroke="transparent" fill="black"/>`,d+=`</svg>`,d},c.createDataURL=function(e,t){e||=2,t=t===void 0?e*4:t;let n=c.getModuleCount()*e+t*2,r=t,i=n-t;return ju(n,n,function(t,n){if(r<=t&&t<i&&r<=n&&n<i){let i=Math.floor((t-r)/e),a=Math.floor((n-r)/e);return+!c.isDark(a,i)}else return 1})},c.createImgTag=function(e,t,n){e||=2,t=t===void 0?e*4:t;let r=c.getModuleCount()*e+t*2,i=``;return i+=`<img`,i+=` src="`,i+=c.createDataURL(e,t),i+=`"`,i+=` width="`,i+=r,i+=`"`,i+=` height="`,i+=r,i+=`"`,n&&(i+=` alt="`,i+=y(n),i+=`"`),i+=`/>`,i};let y=function(e){let t=``;for(let n=0;n<e.length;n+=1){let r=e.charAt(n);switch(r){case`<`:t+=`&lt;`;break;case`>`:t+=`&gt;`;break;case`&`:t+=`&amp;`;break;case`"`:t+=`&quot;`;break;default:t+=r;break}}return t},ee=function(e){e=e===void 0?2:e;let t=c.getModuleCount()*1+e*2,n=e,r=t-e,i,a,o,s,l,u={"██":`█`,"█ ":`▀`," █":`▄`,"  ":` `},d={"██":`▀`,"█ ":`▀`," █":` `,"  ":` `},f=``;for(i=0;i<t;i+=2){for(o=Math.floor((i-n)/1),s=Math.floor((i+1-n)/1),a=0;a<t;a+=1)l=`█`,n<=a&&a<r&&n<=i&&i<r&&c.isDark(o,Math.floor((a-n)/1))&&(l=` `),n<=a&&a<r&&n<=i+1&&i+1<r&&c.isDark(s,Math.floor((a-n)/1))?l+=` `:l+=`█`,f+=e<1&&i+1>=r?d[l]:u[l];f+=`
`}return t%2&&e>0?f.substring(0,f.length-t-1)+Array(t+1).join(`▀`):f.substring(0,f.length-1)};return c.createASCII=function(e,t){if(e||=1,e<2)return ee(t);--e,t=t===void 0?e*2:t;let n=c.getModuleCount()*e+t*2,r=t,i=n-t,a,o,s,l,u=Array(e+1).join(`██`),d=Array(e+1).join(`  `),f=``,p=``;for(a=0;a<n;a+=1){for(s=Math.floor((a-r)/e),p=``,o=0;o<n;o+=1)l=1,r<=o&&o<i&&r<=a&&a<i&&c.isDark(s,Math.floor((o-r)/e))&&(l=0),p+=l?u:d;for(s=0;s<e;s+=1)f+=p+`
`}return f.substring(0,f.length-1)},c.renderTo2dContext=function(e,t){t||=2;let n=c.getModuleCount();for(let r=0;r<n;r++)for(let i=0;i<n;i++)e.fillStyle=c.isDark(r,i)?`black`:`white`,e.fillRect(i*t,r*t,t,t)},c};hu.stringToBytes=function(e){let t=[];for(let n=0;n<e.length;n+=1){let r=e.charCodeAt(n);t.push(r&255)}return t},hu.createStringToBytes=function(e,t){let n=function(){let n=ku(e),r=function(){let e=n.read();if(e==-1)throw`eof`;return e},i=0,a={};for(;;){let e=n.read();if(e==-1)break;let t=r(),o=r(),s=r(),c=String.fromCharCode(e<<8|t);a[c]=o<<8|s,i+=1}if(i!=t)throw i+` != `+t;return a}();return function(e){let t=[];for(let r=0;r<e.length;r+=1){let i=e.charCodeAt(r);if(i<128)t.push(i);else{let i=n[e.charAt(r)];typeof i==`number`?(i&255)==i?t.push(i):(t.push(i>>>8),t.push(i&255)):t.push(63)}}return t}};var J={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},gu={L:1,M:0,Q:3,H:2},_u={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},vu=function(){let e=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],t=1335,n=7973,r={},i=function(e){let t=0;for(;e!=0;)t+=1,e>>>=1;return t};return r.getBCHTypeInfo=function(e){let n=e<<10;for(;i(n)-i(t)>=0;)n^=t<<i(n)-i(t);return(e<<10|n)^21522},r.getBCHTypeNumber=function(e){let t=e<<12;for(;i(t)-i(n)>=0;)t^=n<<i(t)-i(n);return e<<12|t},r.getPatternPosition=function(t){return e[t-1]},r.getMaskFunction=function(e){switch(e){case _u.PATTERN000:return function(e,t){return(e+t)%2==0};case _u.PATTERN001:return function(e,t){return e%2==0};case _u.PATTERN010:return function(e,t){return t%3==0};case _u.PATTERN011:return function(e,t){return(e+t)%3==0};case _u.PATTERN100:return function(e,t){return(Math.floor(e/2)+Math.floor(t/3))%2==0};case _u.PATTERN101:return function(e,t){return e*t%2+e*t%3==0};case _u.PATTERN110:return function(e,t){return(e*t%2+e*t%3)%2==0};case _u.PATTERN111:return function(e,t){return(e*t%3+(e+t)%2)%2==0};default:throw`bad maskPattern:`+e}},r.getErrorCorrectPolynomial=function(e){let t=bu([1],0);for(let n=0;n<e;n+=1)t=t.multiply(bu([1,yu.gexp(n)],0));return t},r.getLengthInBits=function(e,t){if(1<=t&&t<10)switch(e){case J.MODE_NUMBER:return 10;case J.MODE_ALPHA_NUM:return 9;case J.MODE_8BIT_BYTE:return 8;case J.MODE_KANJI:return 8;default:throw`mode:`+e}else if(t<27)switch(e){case J.MODE_NUMBER:return 12;case J.MODE_ALPHA_NUM:return 11;case J.MODE_8BIT_BYTE:return 16;case J.MODE_KANJI:return 10;default:throw`mode:`+e}else if(t<41)switch(e){case J.MODE_NUMBER:return 14;case J.MODE_ALPHA_NUM:return 13;case J.MODE_8BIT_BYTE:return 16;case J.MODE_KANJI:return 12;default:throw`mode:`+e}else throw`type:`+t},r.getLostPoint=function(e){let t=e.getModuleCount(),n=0;for(let r=0;r<t;r+=1)for(let i=0;i<t;i+=1){let a=0,o=e.isDark(r,i);for(let n=-1;n<=1;n+=1)if(!(r+n<0||t<=r+n))for(let s=-1;s<=1;s+=1)i+s<0||t<=i+s||n==0&&s==0||o==e.isDark(r+n,i+s)&&(a+=1);a>5&&(n+=3+a-5)}for(let r=0;r<t-1;r+=1)for(let i=0;i<t-1;i+=1){let t=0;e.isDark(r,i)&&(t+=1),e.isDark(r+1,i)&&(t+=1),e.isDark(r,i+1)&&(t+=1),e.isDark(r+1,i+1)&&(t+=1),(t==0||t==4)&&(n+=3)}for(let r=0;r<t;r+=1)for(let i=0;i<t-6;i+=1)e.isDark(r,i)&&!e.isDark(r,i+1)&&e.isDark(r,i+2)&&e.isDark(r,i+3)&&e.isDark(r,i+4)&&!e.isDark(r,i+5)&&e.isDark(r,i+6)&&(n+=40);for(let r=0;r<t;r+=1)for(let i=0;i<t-6;i+=1)e.isDark(i,r)&&!e.isDark(i+1,r)&&e.isDark(i+2,r)&&e.isDark(i+3,r)&&e.isDark(i+4,r)&&!e.isDark(i+5,r)&&e.isDark(i+6,r)&&(n+=40);let r=0;for(let n=0;n<t;n+=1)for(let i=0;i<t;i+=1)e.isDark(i,n)&&(r+=1);let i=Math.abs(100*r/t/t-50)/5;return n+=i*10,n},r}(),yu=function(){let e=Array(256),t=Array(256);for(let t=0;t<8;t+=1)e[t]=1<<t;for(let t=8;t<256;t+=1)e[t]=e[t-4]^e[t-5]^e[t-6]^e[t-8];for(let n=0;n<255;n+=1)t[e[n]]=n;let n={};return n.glog=function(e){if(e<1)throw`glog(`+e+`)`;return t[e]},n.gexp=function(t){for(;t<0;)t+=255;for(;t>=256;)t-=255;return e[t]},n}(),bu=function(e,t){if(e.length===void 0)throw e.length+`/`+t;let n=function(){let n=0;for(;n<e.length&&e[n]==0;)n+=1;let r=Array(e.length-n+t);for(let t=0;t<e.length-n;t+=1)r[t]=e[t+n];return r}(),r={};return r.getAt=function(e){return n[e]},r.getLength=function(){return n.length},r.multiply=function(e){let t=Array(r.getLength()+e.getLength()-1);for(let n=0;n<r.getLength();n+=1)for(let i=0;i<e.getLength();i+=1)t[n+i]^=yu.gexp(yu.glog(r.getAt(n))+yu.glog(e.getAt(i)));return bu(t,0)},r.mod=function(e){if(r.getLength()-e.getLength()<0)return r;let t=yu.glog(r.getAt(0))-yu.glog(e.getAt(0)),n=Array(r.getLength());for(let e=0;e<r.getLength();e+=1)n[e]=r.getAt(e);for(let r=0;r<e.getLength();r+=1)n[r]^=yu.gexp(yu.glog(e.getAt(r))+t);return bu(n,0).mod(e)},r},xu=function(){let e=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(e,t){let n={};return n.totalCount=e,n.dataCount=t,n},n={},r=function(t,n){switch(n){case gu.L:return e[(t-1)*4+0];case gu.M:return e[(t-1)*4+1];case gu.Q:return e[(t-1)*4+2];case gu.H:return e[(t-1)*4+3];default:return}};return n.getRSBlocks=function(e,n){let i=r(e,n);if(i===void 0)throw`bad rs block @ typeNumber:`+e+`/errorCorrectionLevel:`+n;let a=i.length/3,o=[];for(let e=0;e<a;e+=1){let n=i[e*3+0],r=i[e*3+1],a=i[e*3+2];for(let e=0;e<n;e+=1)o.push(t(r,a))}return o},n}(),Su=function(){let e=[],t=0,n={};return n.getBuffer=function(){return e},n.getAt=function(t){return(e[Math.floor(t/8)]>>>7-t%8&1)==1},n.put=function(e,t){for(let r=0;r<t;r+=1)n.putBit((e>>>t-r-1&1)==1)},n.getLengthInBits=function(){return t},n.putBit=function(n){let r=Math.floor(t/8);e.length<=r&&e.push(0),n&&(e[r]|=128>>>t%8),t+=1},n},Cu=function(e){let t=J.MODE_NUMBER,n=e,r={};r.getMode=function(){return t},r.getLength=function(e){return n.length},r.write=function(e){let t=n,r=0;for(;r+2<t.length;)e.put(i(t.substring(r,r+3)),10),r+=3;r<t.length&&(t.length-r==1?e.put(i(t.substring(r,r+1)),4):t.length-r==2&&e.put(i(t.substring(r,r+2)),7))};let i=function(e){let t=0;for(let n=0;n<e.length;n+=1)t=t*10+a(e.charAt(n));return t},a=function(e){if(`0`<=e&&e<=`9`)return e.charCodeAt(0)-48;throw`illegal char :`+e};return r},wu=function(e){let t=J.MODE_ALPHA_NUM,n=e,r={};r.getMode=function(){return t},r.getLength=function(e){return n.length},r.write=function(e){let t=n,r=0;for(;r+1<t.length;)e.put(i(t.charAt(r))*45+i(t.charAt(r+1)),11),r+=2;r<t.length&&e.put(i(t.charAt(r)),6)};let i=function(e){if(`0`<=e&&e<=`9`)return e.charCodeAt(0)-48;if(`A`<=e&&e<=`Z`)return e.charCodeAt(0)-65+10;switch(e){case` `:return 36;case`$`:return 37;case`%`:return 38;case`*`:return 39;case`+`:return 40;case`-`:return 41;case`.`:return 42;case`/`:return 43;case`:`:return 44;default:throw`illegal char :`+e}};return r},Tu=function(e){let t=J.MODE_8BIT_BYTE,n=hu.stringToBytes(e),r={};return r.getMode=function(){return t},r.getLength=function(e){return n.length},r.write=function(e){for(let t=0;t<n.length;t+=1)e.put(n[t],8)},r},Eu=function(e){let t=J.MODE_KANJI,n=hu.stringToBytes;(function(e,t){let r=n(e);if(r.length!=2||(r[0]<<8|r[1])!=t)throw`sjis not supported.`})(`友`,38726);let r=n(e),i={};return i.getMode=function(){return t},i.getLength=function(e){return~~(r.length/2)},i.write=function(e){let t=r,n=0;for(;n+1<t.length;){let r=(255&t[n])<<8|255&t[n+1];if(33088<=r&&r<=40956)r-=33088;else if(57408<=r&&r<=60351)r-=49472;else throw`illegal char at `+(n+1)+`/`+r;r=(r>>>8&255)*192+(r&255),e.put(r,13),n+=2}if(n<t.length)throw`illegal char at `+(n+1)},i},Du=function(){let e=[],t={};return t.writeByte=function(t){e.push(t&255)},t.writeShort=function(e){t.writeByte(e),t.writeByte(e>>>8)},t.writeBytes=function(e,n,r){n||=0,r||=e.length;for(let i=0;i<r;i+=1)t.writeByte(e[i+n])},t.writeString=function(e){for(let n=0;n<e.length;n+=1)t.writeByte(e.charCodeAt(n))},t.toByteArray=function(){return e},t.toString=function(){let t=``;t+=`[`;for(let n=0;n<e.length;n+=1)n>0&&(t+=`,`),t+=e[n];return t+=`]`,t},t},Ou=function(){let e=0,t=0,n=0,r=``,i={},a=function(e){r+=String.fromCharCode(o(e&63))},o=function(e){if(e<0)throw`n:`+e;if(e<26)return 65+e;if(e<52)return 97+(e-26);if(e<62)return 48+(e-52);if(e==62)return 43;if(e==63)return 47;throw`n:`+e};return i.writeByte=function(r){for(e=e<<8|r&255,t+=8,n+=1;t>=6;)a(e>>>t-6),t-=6},i.flush=function(){if(t>0&&(a(e<<6-t),e=0,t=0),n%3!=0){let e=3-n%3;for(let t=0;t<e;t+=1)r+=`=`}},i.toString=function(){return r},i},ku=function(e){let t=e,n=0,r=0,i=0,a={};a.read=function(){for(;i<8;){if(n>=t.length){if(i==0)return-1;throw`unexpected end of file./`+i}let e=t.charAt(n);if(n+=1,e==`=`)return i=0,-1;e.match(/^\s$/)||(r=r<<6|o(e.charCodeAt(0)),i+=6)}let e=r>>>i-8&255;return i-=8,e};let o=function(e){if(65<=e&&e<=90)return e-65;if(97<=e&&e<=122)return e-97+26;if(48<=e&&e<=57)return e-48+52;if(e==43)return 62;if(e==47)return 63;throw`c:`+e};return a},Au=function(e,t){let n=e,r=t,i=Array(e*t),a={};a.setPixel=function(e,t,r){i[t*n+e]=r},a.write=function(e){e.writeString(`GIF87a`),e.writeShort(n),e.writeShort(r),e.writeByte(128),e.writeByte(0),e.writeByte(0),e.writeByte(0),e.writeByte(0),e.writeByte(0),e.writeByte(255),e.writeByte(255),e.writeByte(255),e.writeString(`,`),e.writeShort(0),e.writeShort(0),e.writeShort(n),e.writeShort(r),e.writeByte(0);let t=s(2);e.writeByte(2);let i=0;for(;t.length-i>255;)e.writeByte(255),e.writeBytes(t,i,255),i+=255;e.writeByte(t.length-i),e.writeBytes(t,i,t.length-i),e.writeByte(0),e.writeString(`;`)};let o=function(e){let t=e,n=0,r=0,i={};return i.write=function(e,i){if(e>>>i)throw`length over`;for(;n+i>=8;)t.writeByte(255&(e<<n|r)),i-=8-n,e>>>=8-n,r=0,n=0;r=e<<n|r,n+=i},i.flush=function(){n>0&&t.writeByte(r)},i},s=function(e){let t=1<<e,n=(1<<e)+1,r=e+1,a=c();for(let e=0;e<t;e+=1)a.add(String.fromCharCode(e));a.add(String.fromCharCode(t)),a.add(String.fromCharCode(n));let s=Du(),l=o(s);l.write(t,r);let u=0,d=String.fromCharCode(i[u]);for(u+=1;u<i.length;){let e=String.fromCharCode(i[u]);u+=1,a.contains(d+e)?d+=e:(l.write(a.indexOf(d),r),a.size()<4095&&(a.size()==1<<r&&(r+=1),a.add(d+e)),d=e)}return l.write(a.indexOf(d),r),l.write(n,r),l.flush(),s.toByteArray()},c=function(){let e={},t=0,n={};return n.add=function(r){if(n.contains(r))throw`dup key:`+r;e[r]=t,t+=1},n.size=function(){return t},n.indexOf=function(t){return e[t]},n.contains=function(t){return e[t]!==void 0},n};return a},ju=function(e,t,n){let r=Au(e,t);for(let i=0;i<t;i+=1)for(let t=0;t<e;t+=1)r.setPixel(t,i,n(t,i));let i=Du();r.write(i);let a=Ou(),o=i.toByteArray();for(let e=0;e<o.length;e+=1)a.writeByte(o[e]);return a.flush(),`data:image/gif;base64,`+a};hu.stringToBytes;function Mu(e,t=4){let n=hu(0,`L`);return n.addData(e),n.make(),n.createSvgTag({cellSize:t,margin:2,scalable:!0})}var Nu=25519;function Pu(){return typeof window>`u`?null:window.nostr??null}async function Fu(e,t){if(e.privkey)return ai(t,W(e.privkey));if(e.signerType===`nip07`){let n=Pu();if(typeof n?.signEvent!=`function`)throw Error(`NIP-07 signer is not available.`);let r=await n.signEvent(t);if(!r||r.pubkey!==e.pubkey)throw Error(`NIP-07 signer used a different public key.`);return r}throw Error(`No local key or NIP-07 signer available.`)}async function Iu(e,t,n){if(e.privkey)return Qi(n,Ui(W(e.privkey),t));if(e.signerType===`nip07`){let e=Pu();if(typeof e?.nip44?.encrypt!=`function`)throw Error(`NIP-07 extension does not support NIP-44 encryption.`);return e.nip44.encrypt(t,n)}throw Error(`No local key or NIP-07 encryption available.`)}async function Lu(e,t,n){if(e.privkey)return $i(n,Ui(W(e.privkey),t));if(e.signerType===`nip07`){let e=Pu();if(typeof e?.nip44?.decrypt!=`function`)throw Error(`NIP-07 extension does not support NIP-44 decryption.`);return e.nip44.decrypt(t,n)}throw Error(`No local key or NIP-07 decryption available.`)}function Ru(e){return e instanceof Error?e.message:String(e)}function zu(e){let t=R(),{identity:n}=l();if(!t||!n?.pubkey)return e.onError(`No relay pool or identity available.`),()=>{};let{inviteId:r,adminPubkey:i,readRelays:a,writeRelays:o,onWelcome:s,onError:c}=e,u=Array.from(new Set([...a,...o])),d=!1,f=null,p=null;return(async()=>{try{let e=await Iu(n,i,JSON.stringify({type:`join-request`,inviteId:r})),a=await Fu(n,{kind:Nu,created_at:Math.floor(Date.now()/1e3),tags:[[`d`,r],[`p`,i]],content:e});if(d)return;Promise.allSettled(t.publish(o,a)).catch(()=>{}),f=t.subscribeMany(u,{kinds:[Nu],"#d":[r],authors:[i]},{onevent(e){oi(e)&&(typeof e.content==`string`&&e.content.length>65536||(async()=>{try{let t=await Lu(n,i,e.content),a=JSON.parse(t);a.type===`welcome`&&a.inviteId===r&&a.envelope&&(s(a.envelope),f?.close())}catch{}})())},oneose(){}}),p=setTimeout(()=>{f?.close(),c(`Timed out waiting for welcome message from admin.`)},12e4)}catch(e){d||c(Ru(e))}})(),()=>{d=!0,p&&clearTimeout(p),f?.close()}}function Bu(e){let t=R(),{identity:n}=l();if(!t||!n?.pubkey)return e.onError(`No relay pool or identity available.`),()=>{};let{inviteId:r,readRelays:i,writeRelays:a,onJoinRequest:o,onError:s}=e,c=Array.from(new Set([...i,...a])),u=t.subscribeMany(c,{kinds:[Nu],"#d":[r],"#p":[n.pubkey]},{onevent(e){oi(e)&&(typeof e.content==`string`&&e.content.length>65536||(async()=>{try{let t=await Lu(n,e.pubkey,e.content),i=JSON.parse(t);i.type===`join-request`&&i.inviteId===r&&o(e.pubkey)}catch{}})())},oneose(){}}),d=setTimeout(()=>{u.close(),s(`Timed out waiting for join request.`)},3e5);return()=>{clearTimeout(d),u.close()}}async function Vu(e){let t=R(),{identity:n}=l();if(!t||!n?.pubkey)return;let{inviteId:r,joinerPubkey:i,envelope:a,writeRelays:o}=e,s=await Iu(n,i,JSON.stringify({type:`welcome`,inviteId:r,envelope:a})),c=await Fu(n,{kind:Nu,created_at:Math.floor(Date.now()/1e3),tags:[[`d`,r],[`p`,i]],content:s});await Promise.allSettled(t.publish(o,c))}var Hu=35520;function Uu(e){let t=R(),{identity:n}=l();if(!t||!n?.pubkey)return;let{token:r,writeRelays:i}=e,a=JSON.stringify(r);(async()=>{try{let e=String(Math.floor(Date.now()/1e3)+10080*60),o=await Fu(n,{kind:Hu,created_at:Math.floor(Date.now()/1e3),tags:[[`d`,r.inviteId],[`expiration`,e]],content:a});Promise.allSettled(t.publish(i,o)).catch(()=>{})}catch(e){console.warn(`[canary:invite] Failed to publish invite token:`,e)}})()}function Wu(e){let t=R();if(!t)return e.onError(`No relay pool available.`),()=>{};let{inviteId:n,readRelays:r,onToken:i,onError:a}=e,o=!1,s=t.subscribeMany(r,{kinds:[Hu],"#d":[n]},{onevent(e){if(oi(e)&&!(typeof e.content==`string`&&e.content.length>65536)&&!o)try{let t=JSON.parse(e.content);t.inviteId===n&&(o=!0,i(t),s.close())}catch{}},oneose(){o||(s.close(),a(`Invite not found on relay — it may have expired.`))}}),c=setTimeout(()=>{o||(s.close(),a(`Timed out looking for invite on relay.`))},15e3);return()=>{clearTimeout(c),s.close()}}var Gu=Ie({PROFILE_RELAYS:()=>ed,fetchOwnProfile:()=>nd,fetchPersonaProfiles:()=>sd,fetchProfiles:()=>$u,getCachedName:()=>Zu,getCachedProfile:()=>Qu,publishKind0:()=>ad,publishPersonaProfile:()=>od});function Ku(e){if(!e||typeof e!=`object`)return{};let t=e;return{...typeof t.name==`string`?{name:t.name}:{},...typeof t.display_name==`string`?{display_name:t.display_name}:{},...typeof t.picture==`string`?{picture:t.picture}:{},...typeof t.about==`string`?{about:t.about}:{},...typeof t.nip05==`string`?{nip05:t.nip05}:{},...typeof t.lud16==`string`?{lud16:t.lud16}:{},...typeof t.lud06==`string`?{lud06:t.lud06}:{},...typeof t.website==`string`?{website:t.website}:{},...typeof t.banner==`string`?{banner:t.banner}:{}}}var qu=new Map,Ju=new Map,Yu=6e4,Xu=new Set;function Zu(e){let t=qu.get(e);if(t)return t.display_name||t.name||void 0}function Qu(e){return qu.get(e)}function $u(e,t){let n=R();if(!n){console.warn(`[profiles] no pool — skipping`);return}let r=Date.now(),i=e.filter(e=>{if(qu.has(e)||Xu.has(e))return!1;let t=Ju.get(e);return!(t&&r-t<Yu)});if(i.length===0){console.warn(`[profiles] all cached/pending — nothing to fetch`);return}for(let e of i)Xu.add(e);let a=rd(t),o=[...new Set([...a,...td])];if(console.warn(`[profiles] fetching`,i.length,`profiles from`,o,`for group`,t?.slice(0,8)),o.length===0){for(let e of i)Xu.delete(e);return}let s=n.subscribeMany(o,{kinds:[0],authors:i},{onevent(e){if(oi(e)&&!(typeof e.content==`string`&&e.content.length>65536))try{let n=Ku(JSON.parse(e.content));console.warn(`[profiles] got profile for`,e.pubkey.slice(0,8),n.display_name||n.name||`(no name)`),qu.set(e.pubkey,n),Xu.delete(e.pubkey);let r=n.display_name||n.name;if(r&&t){let n=l().groups[t];n&&n.memberNames?.[e.pubkey]!==r&&u(t,{memberNames:{...n.memberNames,[e.pubkey]:r}})}}catch{Ju.set(e.pubkey,Date.now()),Xu.delete(e.pubkey)}},oneose(){console.warn(`[profiles] EOSE — found:`,i.filter(e=>qu.has(e)).length,`missing:`,i.filter(e=>!qu.has(e)).length);for(let e of i)qu.has(e)||Ju.set(e,Date.now()),Xu.delete(e);s.close()}})}var ed=[`wss://purplepag.es`,`wss://relay.damus.io`,`wss://nos.lol`],td=ed;async function nd(){await se();let e=R(),{identity:t,settings:n}=l();if(!e||!t?.pubkey)return;let r=t.pubkey,i=qu.get(r);if(i){let e=i.display_name||i.name,n=i.picture,r={};e&&t.displayName!==e&&(r.displayName=e),n&&t.picture!==n&&(r.picture=n),Object.keys(r).length>0&&s({identity:{...t,...r}});return}if(Xu.has(r))return;qu.delete(r),Ju.delete(r),Xu.add(r);let a=n?.defaultRelays?.length?n.defaultRelays:[],o=[...new Set([...a,...td])];if(o.length===0){Xu.delete(r);return}console.warn(`[profiles] fetching own kind 0 from`,o);let c=e.subscribeMany(o,{kinds:[0],authors:[r]},{onevent(e){if(oi(e)&&!(typeof e.content==`string`&&e.content.length>65536))try{let t=Ku(JSON.parse(e.content));console.warn(`[profiles] got own profile from relay:`,t.display_name||t.name||`(no name)`),qu.set(e.pubkey,t),Xu.delete(e.pubkey);let n=t.display_name||t.name,r=t.picture,{identity:i}=l();if(i&&i.pubkey===e.pubkey){let e={};n&&i.displayName!==n&&(e.displayName=n),r&&i.picture!==r&&(e.picture=r),Object.keys(e).length>0&&s({identity:{...i,...e}})}}catch{Xu.delete(e.pubkey)}},oneose(){Xu.delete(r),c.close()}})}function rd(e){if(e){let t=l().groups[e];if(t?.relays?.length)return t.relays}let t=l().settings;return t?.defaultRelays?.length?t.defaultRelays:[]}function id(e){let t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function ad(e,n){setTimeout(async()=>{try{let r=R();if(!r){console.warn(`[profiles] no pool — skipping kind 0 publish`);return}await se();let i=JSON.stringify({name:e}),a=ai({kind:0,created_at:Math.floor(Date.now()/1e3),tags:[],content:i},id(n)),{settings:o}=l(),s=o?.defaultWriteRelays?.length?o.defaultWriteRelays:o?.defaultRelays?.length?o.defaultRelays:[],c=t([...ed,...s]);console.warn(`[profiles] publishing kind 0 to`,c);let u=r.publish(c,a),d=(await Promise.allSettled(u)).filter(e=>e.status===`fulfilled`).length;console.warn(`[profiles] kind 0 published to ${d}/${c.length} relay(s)`)}catch(e){console.warn(`[profiles] kind 0 publish failed:`,e)}},2e3)}async function od(e,t){let{settings:n}=l(),r=t&&t.length>0?t:e.writeRelays&&e.writeRelays.length>0?e.writeRelays:n?.defaultWriteRelays?.length?n.defaultWriteRelays:[];if(r.length!==0)try{let t=Ce(e.name,e.index),n=JSON.stringify({name:e.displayName??e.name,about:e.about??``,picture:e.picture??``}),i=ai({kind:0,created_at:Math.floor(Date.now()/1e3),tags:[],content:n},t.identity.privateKey),a=new de;try{let t=a.publish(r,i),n=(await Promise.allSettled(t)).filter(e=>e.status===`fulfilled`).length;console.warn(`[profiles] persona "${e.name}" kind 0 published to ${n}/${r.length} relay(s)`)}finally{a.close(r)}}catch(t){console.warn(`[profiles] persona "${e.name}" kind 0 publish failed:`,t)}}async function sd(e){let{settings:t}=l(),n=e&&e.length>0?e:t?.defaultReadRelays?.length?t.defaultReadRelays:[];if(n.length!==0)try{let{personas:e}=l(),t=Object.values(e);if(t.length===0)return;let r=new Map;for(let e of t)try{let t=gs(e.npub);t.type===`npub`&&r.set(t.data,e.id)}catch{}if(r.size===0)return;let i=Array.from(r.keys());await new Promise(e=>{let t=new de,a=t.subscribeMany(n,[{kinds:[0],authors:i}],{onevent(e){if(!oi(e)||typeof e.content==`string`&&e.content.length>65536)return;let t=r.get(e.pubkey);if(t)try{let n=Ku(JSON.parse(e.content)),{personas:r}=l(),i=r[t];if(!i)return;let a={...i,...n.display_name||n.name?{displayName:n.display_name||n.name}:{},...n.picture?{picture:n.picture}:{},...n.about===void 0?{}:{about:n.about}};s({personas:{...r,[t]:a}})}catch{}},oneose(){a.close(),t.close(n),e()}})})}catch(e){console.warn(`[profiles] fetchPersonaProfiles failed:`,e)}}var cd=Ie({renderMembers:()=>gd,showConfirmMemberModal:()=>vd,showInviteModal:()=>pd,showShareStateModal:()=>md}),ld=[210,140,30,280,60,330,170,0];function ud(e,t){let n=t.indexOf(e);return ld[(n>=0?n:0)%ld.length]}function dd(e,t,n,r){let i=ud(e,t),a=n[e]??0;if(a===0)return`hsl(${i}, 55%, 55%)`;let o=Math.floor(Date.now()/1e3)-a;return o<=r?`hsl(${i}, 70%, 55%)`:o<=r*1.25?`hsl(${i}, 40%, 50%)`:`#94a3b8`}function fd(e,t,n){let{identity:r,groups:i}=l(),a=r?.pubkey===e,o;if(n){let t=i[n]?.memberNames?.[e];t&&t!==`You`&&(o=t)}return o||=Zu(e),a?o?`${o} (you)`:`You`:o||`${e.slice(0,8)}\u2026${e.slice(-4)}`}function pd(t,n){let r=n?.title??`Invite to Group`,i=n?.scanHint??`Scan with your phone camera to join`;n?.showConfirmMemberNote,e(t);let a=document.getElementById(`invite-modal`);a||(a=document.createElement(`dialog`),a.id=`invite-modal`,a.className=`modal`,document.body.appendChild(a),a.addEventListener(`click`,e=>{e.target===a&&(ru(),a.close())}));let o=a;function s(){o.innerHTML=`
      <div class="modal__form invite-share">
        <h2 class="modal__title">${B(r)}</h2>
        <p class="invite-hint">How are you sharing this?</p>

        <div class="invite-share__actions" style="flex-direction: column; gap: 0.75rem;">
          <button class="btn btn--primary" id="invite-qr-path" type="button">Scan QR &mdash; they're with me</button>
          <button class="btn btn--primary" id="invite-link-path" type="button">Secure Channel &mdash; Signal, WhatsApp, etc.</button>
        </div>

        <div class="modal__actions">
          <button class="btn" id="invite-close-btn" type="button">Cancel</button>
        </div>
      </div>
    `,o.querySelector(`#invite-qr-path`)?.addEventListener(`click`,d),o.querySelector(`#invite-link-path`)?.addEventListener(`click`,f),o.querySelector(`#invite-close-btn`)?.addEventListener(`click`,()=>{ru(),o.close()})}function c(e){o.innerHTML=`
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
    `,o.querySelector(`#remote-back-2`)?.addEventListener(`click`,e),o.querySelector(`#remote-next-2`)?.addEventListener(`click`,async()=>{let e=o.querySelector(`#remote-joincode-input`),n=o.querySelector(`#remote-joincode-error`),r=o.querySelector(`#remote-next-2`),i=e?.value.trim()??``;if(!/^[0-9a-f]{64}$/.test(i)){n&&(n.textContent=`Invalid join code — must be a 64-character hex public key.`,n.style.display=``);return}try{r&&(r.disabled=!0,r.textContent=`Generating...`);let e=l().groups[t.id];if(!e)throw Error(`Group not found.`);u(await nu(e,i),i)}catch(e){n&&(n.textContent=e instanceof Error?e.message:`Failed to create welcome envelope.`,n.style.display=``),r&&(r.disabled=!1,r.textContent=`Generate Welcome`)}})}function u(e,n){o.innerHTML=`
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
    `,o.querySelector(`#remote-copy-welcome`)?.addEventListener(`click`,async t=>{let n=t.currentTarget;try{await navigator.clipboard.writeText(e),n.textContent=`Copied!`,n.classList.add(`btn--copied`),setTimeout(()=>{n.textContent=`Copy Welcome Message`,n.classList.remove(`btn--copied`)},2e3)}catch{}}),o.querySelector(`#remote-done`)?.addEventListener(`click`,()=>{try{let e=l().groups[t.id];if(e&&!e.members.includes(n)){let e=o.querySelector(`#remote-joiner-name`)?.value.trim()??``;gc(t.id,n,e),G(e?`${e} added to group`:`Member added to group`,`success`)}}catch(e){G(e instanceof Error?e.message:`Failed to add member`,`error`)}ru(),o.close()})}async function d(){let e,n,a;try{let r=await Hl(t);e=r.payload,n=r.confirmCode,a=pu(e)}catch(e){G(e instanceof Error?e.message:`Failed to create invite.`,`error`);return}let c=`${window.location.href.split(`#`)[0]}#inv/${rl(a)}`,l=Mu(c);o.innerHTML=`
      <div class="modal__form invite-share">
        <h2 class="modal__title">${B(r)}</h2>

        <div class="qr-container" data-url="${B(c)}">${l}</div>
        <p class="invite-hint">${B(i)}</p>
        <p class="invite-hint" style="color: var(--duress); font-weight: 500;">Contains the group key &mdash; only share in person.</p>

        <div style="margin: 1rem 0; padding: 0.75rem; border-radius: 0.5rem; background: var(--surface-alt, rgba(255,255,255,0.05));">
          <p class="invite-hint" style="font-weight: 600; margin-bottom: 0.25rem;">Read these words aloud:</p>
          <p style="font-size: 1.25rem; font-weight: 700; letter-spacing: 0.05em; text-align: center;">${B(n)}</p>
        </div>

        <div class="modal__actions" style="gap: 0.5rem;">
          <button class="btn" id="invite-back-btn" type="button">Back</button>
          <button class="btn" id="invite-done-btn" type="button">Done</button>
        </div>
      </div>
    `,o.querySelector(`#invite-back-btn`)?.addEventListener(`click`,()=>{s()}),o.querySelector(`#invite-done-btn`)?.addEventListener(`click`,()=>{o.close()})}async function f(){let e;try{e=await eu(t)}catch(e){G(e instanceof Error?e.message:`Failed to create remote invite.`,`error`);return}let n=`${window.location.href.split(`#`)[0]}#j/${e.inviteId}`,r=t.readRelays?.length?t.readRelays:l().settings.defaultReadRelays,i=t.writeRelays?.length?t.writeRelays:l().settings.defaultWriteRelays;as(r,i).then(()=>{Uu({token:nl(e.tokenPayload),writeRelays:i})});let a=()=>{};o.innerHTML=`
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
    `,o.querySelector(`#remote-copy-link`)?.addEventListener(`click`,async e=>{let t=e.currentTarget;try{await navigator.clipboard.writeText(n),t.textContent=`Copied!`,t.classList.add(`btn--copied`),setTimeout(()=>{t.textContent=`Copy Link`,t.classList.remove(`btn--copied`)},2e3)}catch{}}),as(r,i).then(()=>{a=Bu({inviteId:e.inviteId,readRelays:r,writeRelays:i,async onJoinRequest(n){a();try{let r=l().groups[t.id];if(!r)return;let a=await nu(r,n);await Vu({inviteId:e.inviteId,joinerPubkey:n,envelope:a,writeRelays:i}),r.members.includes(n)||gc(t.id,n),ru(),o.close(),G(`Member joined via relay`,`success`)}catch(e){G(e instanceof Error?e.message:`Failed to send welcome`,`error`)}},onError(e){let t=o.querySelector(`#remote-relay-status`);t&&(t.textContent=e||`Relay unavailable — use manual fallback below.`)}})}),o.querySelector(`#remote-manual-fallback`)?.addEventListener(`click`,()=>{a(),c(()=>{a=()=>{},f()})}),o.querySelector(`#remote-back-btn`)?.addEventListener(`click`,()=>{a(),ru(),s()})}s(),a.showModal()}function md(e){pd(e,{title:`Share Group State`,scanHint:`Share with existing members to sync the latest group state.`,showConfirmMemberNote:!1})}function hd(e,t){let{identity:n,groups:r}=l(),i=r[t],a=n?.pubkey===e,o=i?.admins.includes(e)??!1,s=fd(e,i?.members??[],t),c=Qu(e),u=i?.memberNames?.[e],d=i?.livenessCheckins?.[e],f=`Never checked in`;if(d){let e=Math.floor(Date.now()/1e3)-d;f=e<60?`Active now`:e<3600?`${Math.floor(e/60)}m ago`:`${Math.floor(e/3600)}h ago`}let p=[a?`<span class="member-detail__badge">You</span>`:``,o?`<span class="member-detail__badge member-detail__badge--admin">Admin</span>`:``].filter(Boolean).join(` `),m=c?.display_name||c?.name,h=(e,t)=>`<div class="member-detail__row"><span class="member-detail__label">${e}</span><span class="member-detail__value">${B(t)}</span></div>`,g=[h(`Pubkey`,`${e.slice(0,16)}…${e.slice(-8)}`)];m&&g.push(h(`Nostr name`,m)),c?.nip05&&g.push(h(`NIP-05`,c.nip05)),c?.about&&g.push(h(`About`,c.about.length>80?c.about.slice(0,80)+`…`:c.about)),c?.lud16&&g.push(h(`Lightning`,c.lud16)),c?.website&&g.push(h(`Website`,c.website)),u&&u!==`You`&&u!==m&&g.push(h(`Display name`,u)),g.push(h(`Liveness`,f)),c||g.push(`<div class="member-detail__row"><span class="member-detail__label" style="color: var(--text-muted); font-style: italic;">No Nostr profile found on relay</span></div>`),Ys(`
    <div class="member-detail__header">
      ${c?.picture?`<img class="member-detail__avatar" src="${B(c.picture)}" alt="" />`:``}
      <div>
        <h2 class="modal__title" style="margin:0;">${B(s)} ${p}</h2>
      </div>
    </div>
    <div class="member-detail__rows">${g.join(``)}</div>
    <div class="modal__actions">
      <button class="btn btn--sm" id="member-detail-copy" type="button">Copy Pubkey</button>
      <button class="btn" id="modal-cancel-btn" type="button">Close</button>
    </div>
  `,()=>{}),requestAnimationFrame(()=>{document.getElementById(`member-detail-copy`)?.addEventListener(`click`,async()=>{try{await navigator.clipboard.writeText(e);let t=document.getElementById(`member-detail-copy`);t.textContent=`Copied!`,setTimeout(()=>{t.textContent=`Copy Pubkey`},1500)}catch{}}),document.getElementById(`modal-cancel-btn`)?.addEventListener(`click`,()=>{document.getElementById(`app-modal`)?.close()})})}function gd(e){let{groups:t,activeGroupId:n}=l();if(!n){e.innerHTML=``;return}let r=t[n];if(!r){e.innerHTML=``;return}let{identity:i}=l(),a=!!i?.pubkey&&r.admins.includes(i.pubkey);$u(r.members,n),e.innerHTML=`
    <section class="panel members-panel">
      <h2 class="panel__title">Members</h2>
      <ul class="member-list">
        ${r.members.length>0?r.members.map(e=>{let t=dd(e,r.members,r.livenessCheckins??{},r.livenessInterval),i=Qu(e),o=i?.picture?`<img src="${B(i.picture)}" alt="" style="width:24px;height:24px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid ${t};box-shadow:0 0 6px ${t}80;" />`:`<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${t};flex-shrink:0;box-shadow:0 0 6px ${t}80;"></span>`;return`
          <li class="member-item" data-pubkey="${B(e)}">
            ${o}
            <button class="member-item__name-btn" data-pubkey="${B(e)}" type="button">${B(fd(e,r.members,n))}</button>
            ${a?`<button
              class="btn btn--sm member-item__remove"
              data-pubkey="${B(e)}"
              type="button"
              aria-label="Remove member"
            >\u2715</button>`:``}
          </li>`}).join(``):`<li class="member-item member-item--empty">No members yet.</li>`}
      </ul>
      ${a?`<div class="members-actions">
        <button class="btn btn--sm" id="invite-btn" type="button" title="Invite a new person to join this group">+ Invite</button>
        <button class="btn btn--sm" id="share-state-btn" type="button" title="Share the latest group state with existing members after changes">Share State</button>
        <button class="btn btn--sm" id="confirm-member-btn" type="button" title="Verify and add a member using their acknowledgement token or verification word">Confirm Member</button>
      </div>`:``}
    </section>
  `,e.querySelectorAll(`.member-item__name-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.pubkey;t&&hd(t,n)})}),e.querySelector(`.member-list`)?.addEventListener(`click`,e=>{let t=e.target.closest(`.member-item__remove`);if(!t)return;let r=t.dataset.pubkey;if(!r)return;let{groups:i}=l(),a=i[n]?.members??[];if(!confirm(`Remove ${fd(r,a,n)} from the group?\n\nThis rotates the group secret immediately. Remaining members must re-join using a fresh invite.`))return;let{activeGroupId:o}=l();if(!o)return;_c(o,r);let{groups:s}=l(),c=s[o];c&&c.members.length>0&&md(c)}),e.querySelector(`#invite-btn`)?.addEventListener(`click`,()=>{let{groups:e,activeGroupId:t}=l();if(!t)return;let n=e[t];n&&pd(n)}),e.querySelector(`#share-state-btn`)?.addEventListener(`click`,()=>{let{groups:e,activeGroupId:t}=l();if(!t)return;let n=e[t];n&&md(n)}),e.querySelector(`#confirm-member-btn`)?.addEventListener(`click`,()=>{vd()})}function _d(e,t,n){let{groups:r,identity:i}=l(),a=r[e];if(!a||!i?.pubkey||!a.admins.includes(i.pubkey))return!1;a.members.includes(t)||gc(e,t,n);let o=l().groups[e];return o&&n&&u(e,{memberNames:{...o.memberNames,[t]:n}}),!0}function vd(e){let{groups:t,activeGroupId:n}=l();n&&t[n]&&(Ys(`
    <h2 class="modal__title">Confirm Member</h2>

    <label class="input-label">Acknowledgement link or token
      <textarea name="ackToken" class="input" rows="2" placeholder="Paste #ack/... link or token">${B(e??``)}</textarea>
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
  `,e=>{try{let t=e.get(`ackToken`)?.trim(),n=e.get(`word`)?.trim().toLowerCase(),r=e.get(`memberName`)?.trim(),{activeGroupId:i}=l();if(!i)throw Error(`No active group.`);let{groups:a}=l(),o=a[i];if(!o)throw Error(`Group not found.`);if(t){let e=Jl(t.includes(`#ack/`)?decodeURIComponent(t.split(`#ack/`)[1]):t,{groupId:i,groupSeed:o.seed,counter:o.counter+(o.usageOffset??0),context:`canary:group`,encoding:Cc(o),tolerance:o.tolerance??1});if(!e.valid)throw Error(e.error??`Invalid join token.`);if(!_d(i,e.pubkey,e.displayName||r||``))throw Error(`Member could not be added — they may already be in the group or you are not an admin.`);G(`${e.displayName||`Member`} has joined the group`,`success`)}else if(n){if(!r)throw Error(`Please enter the member name.`);let e=o.counter+(o.usageOffset??0);if(n!==Ra(o.seed,`canary:group`,e,Cc(o)).toLowerCase())throw Error(`Word does not match — the member may not have the current group key.`);let t=new Uint8Array(32);if(crypto.getRandomValues(t),!_d(i,Array.from(t,e=>e.toString(16).padStart(2,`0`)).join(``),r))throw Error(`Member could not be added — you may not be an admin of this group.`);G(`${r} has joined the group`,`success`)}else throw Error(`Provide either an ack token or a verification word.`)}catch(e){throw alert(e instanceof Error?e.message:`Confirmation failed.`),e}}),requestAnimationFrame(()=>{document.getElementById(`modal-cancel-btn`)?.addEventListener(`click`,()=>{document.getElementById(`app-modal`)?.close()})}))}var yd=`0123456789bcdefghjkmnpqrstuvwxyz`,bd=Object.create(null);for(let e=0;e<32;e++)bd[yd[e]]=e;function xd(e){for(let t of e)if(!(t in bd))throw TypeError(`Invalid geohash character: '${t}' in "${e}"`)}function Sd(e,t,n=5){if(!Number.isFinite(e)||e<-90||e>90)throw RangeError(`Invalid latitude: ${e}`);if(!Number.isFinite(t)||t<-180||t>180)throw RangeError(`Invalid longitude: ${t}`);if(!Number.isFinite(n)||(n=Math.round(n),n<1))throw RangeError(`Invalid precision: ${n}`);n=Math.min(12,n);let r=-90,i=90,a=-180,o=180,s=``,c=0,l=0,u=!0;for(;s.length<n;){if(u){let e=(a+o)/2;t>=e?(l|=1<<4-c,a=e):o=e}else{let t=(r+i)/2;e>=t?(l|=1<<4-c,r=t):i=t}u=!u,c++,c===5&&(s+=yd[l],c=0,l=0)}return s}function Cd(e){if(e.length===0)throw TypeError(`Cannot decode an empty geohash`);let t=wd(e);return{lat:(t.minLat+t.maxLat)/2,lon:(t.minLon+t.maxLon)/2,error:{lat:(t.maxLat-t.minLat)/2,lon:(t.maxLon-t.minLon)/2}}}function wd(e){xd(e);let t=-90,n=90,r=-180,i=180,a=!0;for(let o of e){let e=bd[o];for(let o=4;o>=0;o--){if(a){let t=(r+i)/2;e>>o&1?r=t:i=t}else{let r=(t+n)/2;e>>o&1?t=r:n=r}a=!a}}return{minLat:t,maxLat:n,minLon:r,maxLon:i}}var Td=[0,25e5,63e4,78e3,2e4,2400,610,76,19,2.4];function Ed(e){if(!Number.isFinite(e))throw RangeError(`Invalid precision: ${e}`);return Td[Math.max(1,Math.min(9,Math.round(e)))]}var Y=null,Dd=null,Od={},X={},kd={},Z=null,Ad=new Set,jd=!1,Md=null,Nd=[{label:`City`,value:4,hint:`~20 km`},{label:`Neighbourhood`,value:5,hint:`~2.4 km`},{label:`Street`,value:6,hint:`~610 m`},{label:`Exact`,value:9,hint:`~2 m`}],Pd=6371e3;function Fd(e,t,n,r=48){let i=[];for(let a=0;a<=r;a++){let o=a/r*2*Math.PI,s=n/Pd*Math.cos(o)*(180/Math.PI),c=n/(Pd*Math.cos(e*Math.PI/180))*Math.sin(o)*(180/Math.PI);i.push([t+c,e+s])}return i}var Id=[210,140,30,280,60,330,170,0];function Ld(e){let{groups:t,activeGroupId:n}=l(),r=((n?t[n]:null)?.members??[]).indexOf(e);return Id[(r>=0?r:0)%Id.length]}function Rd(e){if(Ad.has(e))return`#f87171`;let{groups:t,activeGroupId:n}=l(),r=n?t[n]:null;if(!r)return`hsl(${Ld(e)}, 70%, 55%)`;let i=r.livenessCheckins[e]??0;if(i===0)return`hsl(${Ld(e)}, 20%, 50%)`;let a=Math.floor(Date.now()/1e3)-i,o=r.livenessInterval;return a<=o?`hsl(${Ld(e)}, 70%, 55%)`:a<=o*1.25?`hsl(${Ld(e)}, 40%, 50%)`:`#94a3b8`}function zd(){return{type:`FeatureCollection`,features:Object.entries(X).map(([e,t])=>({type:`Feature`,properties:{pubkey:e,duress:Ad.has(e),colour:Rd(e)},geometry:{type:`Polygon`,coordinates:[Fd(t.lat,t.lon,Ed(t.precision))]}}))}}var Bd=`5.19.0`,Vd=`https://unpkg.com/maplibre-gl@${Bd}/dist/maplibre-gl.js`,Hd=`https://unpkg.com/maplibre-gl@${Bd}/dist/maplibre-gl.css`,Ud=`sha384-pEfbADcwebVj4NNOvWFLUkm+FiGTICE5bChpV647czG7OpSqcHNgxM8QawfAkbRO`,Wd=`sha384-MGCxhspF/+ufueUgol3FDkiAYQbpSNRhBT0VWHJt64U8qIy9qlnXWx8LAbj6niPH`;async function Gd(){if(Dd)return Dd;try{let[e]=await Promise.all([q(()=>import(`./maplibre-gl-B5kDdQ5J.js`).then(e=>Re(e.default,1)),[],import.meta.url),q(()=>Promise.resolve({}),__vite__mapDeps([0]),import.meta.url)]);return Dd=e,e}catch{}let e=document.createElement(`link`);return e.rel=`stylesheet`,e.href=Hd,e.integrity=Wd,e.crossOrigin=`anonymous`,document.head.appendChild(e),await new Promise((e,t)=>{let n=document.createElement(`script`);n.src=Vd,n.integrity=Ud,n.crossOrigin=`anonymous`,n.onload=()=>e(),n.onerror=t,document.head.appendChild(n)}),Dd=window.maplibregl,Dd}async function Kd(e){let{groups:t,activeGroupId:n}=l();if(!n||!t[n]){Y&&(Y.remove(),Y=null,jd=!1),e.innerHTML=``;return}let r=t[n],i=r.beaconPrecision??5;if(Md!==n){X={},kd={},Ad.clear();for(let[e,t]of Object.entries(Od))t.remove(),delete Od[e];if(Md=n,r.lastPositions)for(let[e,t]of Object.entries(r.lastPositions))X[e]=t}if(Y&&document.getElementById(`beacon-map`)){Yd();for(let[e,t]of Object.entries(X))Qd(e,t.lat,t.lon);tf(),Object.keys(X).length>0&&$d();return}queueMicrotask(()=>tf()),e.innerHTML=`
    <section class="panel beacon-panel">
      <h3 class="panel__title">Location</h3>
      <p class="settings-hint" style="margin-bottom: 0.5rem;">Approximate location of group members. Circles show the geohash area — your exact position is never shared. In an emergency, full GPS precision is used so your group can help. Circles turn <span style="color: #f87171; font-weight: 500;">red</span> when an emergency signal is active.</p>
      <div class="beacon-map" id="beacon-map" style="height: 500px; border-radius: 8px;"></div>
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-top: 0.5rem; flex-wrap: wrap;">
        <button class="btn ${Z===null?``:`btn--primary`}" id="beacon-toggle-btn" type="button">
          ${Z===null?`Share Location`:`Sharing Location`}
        </button>
        <button class="btn btn--ghost" id="beacon-fit-btn" type="button" title="Zoom to fit all group members on the map">Fit All</button>
        ${Z===null?``:`<span class="settings-hint" style="margin: 0;">Your approximate area is visible to group members</span>`}
      </div>
      <div style="margin-top: 0.75rem;">
        <span class="input-label">"I'm Alive" precision</span>
        <div class="segmented" id="beacon-precision-picker">
          ${Nd.map(e=>`<button class="segmented__btn ${i===e.value?`segmented__btn--active`:``}" data-beacon-precision="${e.value}" title="${e.hint}">${e.label}</button>`).join(``)}
        </div>
        <p class="settings-hint">How precisely your location is shared in routine check-ins</p>
      </div>
      <p class="settings-hint" style="margin-top: 0.5rem; color: var(--duress);">Emergency signals always share your exact GPS so your group can find you.</p>
      <div class="beacon-list" id="beacon-list"></div>
    </section>
  `,e.querySelectorAll(`[data-beacon-precision]`).forEach(t=>{t.addEventListener(`click`,()=>{let n=Number(t.dataset.beaconPrecision),{activeGroupId:r}=l();r&&(u(r,{beaconPrecision:n}),Z!==null&&(Xd(),Zd()),e.querySelectorAll(`[data-beacon-precision]`).forEach(e=>{e.classList.toggle(`segmented__btn--active`,Number(e.dataset.beaconPrecision)===n)}))})}),e.querySelector(`#beacon-toggle-btn`)?.addEventListener(`click`,()=>{Z===null?Zd():Xd(),Kd(e)}),e.querySelector(`#beacon-fit-btn`)?.addEventListener(`click`,()=>{$d()});try{await Gd(),qd()}catch{e.querySelector(`.beacon-map`).innerHTML=`<p style="color: var(--text-muted); text-align: center; padding: 2rem;">Map unavailable offline</p>`}}function qd(){let e=document.getElementById(`beacon-map`);if(!e||Y||!Dd)return;let t=document.documentElement.dataset.theme===`light`?`https://basemaps.cartocdn.com/gl/positron-gl-style/style.json`:`https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`;Y=new Dd.Map({container:e,style:t,center:[-.1278,51.5074],zoom:12}),Y.on(`load`,()=>{jd=!0,console.info(`[canary:beacon] map loaded, positions to catch up:`,Object.keys(X).length),Y.addSource(`geohash-circles`,{type:`geojson`,data:zd()}),Y.addLayer({id:`geohash-fill`,type:`fill`,source:`geohash-circles`,paint:{"fill-color":[`get`,`colour`],"fill-opacity":[`case`,[`get`,`duress`],.35,.2]}}),Y.addLayer({id:`geohash-stroke`,type:`line`,source:`geohash-circles`,paint:{"line-color":[`get`,`colour`],"line-width":2.5,"line-opacity":[`case`,[`get`,`duress`],.9,.6]}});for(let[e,t]of Object.entries(X))Qd(e,t.lat,t.lon);Object.keys(X).length>0&&$d()})}function Jd(){let{activeGroupId:e}=l();e&&u(e,{lastPositions:{...X}})}function Yd(){if(!Y||!jd)return;let e=Y.getSource(`geohash-circles`);e&&e.setData(zd())}function Xd(){Z!==null&&(navigator.geolocation.clearWatch(Z),Z=null);let{identity:e}=l();e?.pubkey&&(delete X[e.pubkey],delete kd[e.pubkey],Od[e.pubkey]&&(Od[e.pubkey].remove(),delete Od[e.pubkey]),Yd(),tf())}function Zd(){if(Z!==null||!(`geolocation`in navigator))return;let{groups:e,activeGroupId:t,identity:n}=l();if(!t||!e[t]||!n?.pubkey)return;let r=e[t],i=rc(r.seed),a=r.beaconPrecision||5;Z=navigator.geolocation.watchPosition(async e=>{let r=Sd(e.coords.latitude,e.coords.longitude,a),o=Cd(r),s=o.lat,c=o.lon,l=await oc(i,r,a);n?.pubkey&&(kd[n.pubkey]=l,X[n.pubkey]={lat:s,lon:c,geohash:r,precision:a,timestamp:Math.floor(Date.now()/1e3)},Qd(n.pubkey,s,c),Yd(),$d(),tf(),Jd(),t&&os(t,{type:`beacon`,lat:s,lon:c,accuracy:Ed(a),timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID()}))},e=>{console.warn(`[canary:beacon] watchPosition error`,e.code,e.message)},{enableHighAccuracy:!1,maximumAge:6e4,timeout:15e3})}function Qd(e,t,n){if(!Y||!Dd){console.warn(`[canary:beacon] updateMapMarker skipped — map not ready`,{map:!!Y,maplibregl:!!Dd,pubkey:e.slice(0,8)});return}let r=Rd(e),i=Ad.has(e),a=ef(e),o=Qu(e),s=!!o?.picture,c=i?40:32;if(Od[e]){Od[e].setLngLat([n,t]);let o=Od[e].getElement(),l=o.querySelector(`.beacon-dot`);l&&(s||(l.style.background=r),l.style.width=`${c}px`,l.style.height=`${c}px`,l.style.borderColor=r,l.style.boxShadow=`0 0 10px ${r}80`,l.style.animation=i?`beacon-pulse 1s ease-in-out infinite`:`none`);let u=o.querySelector(`.beacon-label`);u&&(u.textContent=a)}else{let l=document.createElement(`div`);l.style.display=`flex`,l.style.flexDirection=`column`,l.style.alignItems=`center`,l.style.pointerEvents=`none`;let u;s?(u=document.createElement(`img`),u.src=o.picture,u.style.objectFit=`cover`):(u=document.createElement(`div`),u.style.background=r),u.className=`beacon-dot`,u.style.width=`${c}px`,u.style.height=`${c}px`,u.style.borderRadius=`50%`,u.style.border=`3px solid ${r}`,u.style.boxShadow=`0 0 10px ${r}80`,u.style.zIndex=`2`,i&&(u.style.animation=`beacon-pulse 1s ease-in-out infinite`),l.appendChild(u);let d=document.createElement(`div`);d.className=`beacon-label`,d.textContent=a,d.style.fontSize=`11px`,d.style.fontWeight=`600`,d.style.color=`#fff`,d.style.textShadow=`0 1px 3px rgba(0,0,0,0.8)`,d.style.marginTop=`2px`,d.style.whiteSpace=`nowrap`,l.appendChild(d),Od[e]=new Dd.Marker({element:l,anchor:`center`}).setLngLat([n,t]).addTo(Y)}}function $d(){if(!Y)return;let e=Object.values(X);if(e.length===0)return;if(e.length===1){Y.flyTo({center:[e[0].lon,e[0].lat],zoom:13});return}let t=e.map(e=>e.lon),n=e.map(e=>e.lat);Y.fitBounds([[Math.min(...t),Math.min(...n)],[Math.max(...t),Math.max(...n)]],{padding:60,maxZoom:14})}function ef(e){let{groups:t,activeGroupId:n,identity:r}=l(),i=n?t[n]:null,a=r?.pubkey===e,o,s=i?.memberNames?.[e];return s&&s!==`You`&&(o=s),o||=Zu(e),a?o?`${o} (you)`:`You`:o||`${e.slice(0,8)}\u2026`}function tf(){let e=document.getElementById(`beacon-list`);e&&(e.innerHTML=Object.entries(X).map(([e,t])=>{let n=Rd(e),r=ef(e),i=Qu(e),a=Math.floor(Date.now()/1e3)-t.timestamp,o=a<60?`just now`:a<3600?`${Math.floor(a/60)}m ago`:`${Math.floor(a/3600)}h ago`;return`
      <div class="beacon-entry" style="display:flex;align-items:center;gap:0.5rem;padding:0.25rem 0;">
        ${i?.picture?`<img src="${B(i.picture)}" alt="" style="width:20px;height:20px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid ${n};" />`:`<span style="width:8px;height:8px;border-radius:50%;background:${n};flex-shrink:0;"></span>`}
        <span class="beacon-member" style="font-weight:500;">${B(r)}</span>
        <span class="beacon-geohash" style="color:var(--text-muted);font-size:0.8rem;">${B(t.geohash)}</span>
        <span style="color:var(--text-muted);font-size:0.75rem;margin-left:auto;">${B(o)}</span>
      </div>
    `}).join(``)||`<p class="settings-hint">No beacons yet — enable location to start</p>`)}document.addEventListener(`canary:duress`,(e=>{let{members:t}=e.detail;if(!t?.length)return;for(let e of t)Ad.add(e),nf(e);Yd();let n=t.map(e=>X[e]).filter(Boolean);if(Y&&n.length===1)Y.flyTo({center:[n[0].lon,n[0].lat],zoom:14});else if(Y&&n.length>1){let e=n.map(e=>e.lon),t=n.map(e=>e.lat);Y.fitBounds([[Math.min(...e),Math.min(...t)],[Math.max(...e),Math.max(...t)]],{padding:60})}}));function nf(e){let t=Od[e];if(!t)return;let n=t.getElement();n.style.background=`#f87171`,n.style.width=`14px`,n.style.height=`14px`,n.style.boxShadow=`0 0 12px rgba(248, 113, 113, 0.6)`}function rf(){if(console.info(`[canary:beacon] sendLocationPing called`,{hasGeo:`geolocation`in navigator,map:!!Y,mapReady:jd}),!(`geolocation`in navigator))return;let{groups:e,activeGroupId:t,identity:n}=l();if(!t||!e[t]||!n?.pubkey){console.warn(`[canary:beacon] sendLocationPing: missing state`,{activeGroupId:t,hasPubkey:!!n?.pubkey});return}if(Z!==null){console.info(`[canary:beacon] watch already active, skipping getCurrentPosition`);return}Zd();let r=e[t],i=rc(r.seed),a=r.beaconPrecision||5;navigator.geolocation.getCurrentPosition(async e=>{let r=Sd(e.coords.latitude,e.coords.longitude,a),o=Cd(r),s=o.lat,c=o.lon,l=await oc(i,r,a);n?.pubkey&&(kd[n.pubkey]=l,X[n.pubkey]={lat:s,lon:c,geohash:r,precision:a,timestamp:Math.floor(Date.now()/1e3)},Qd(n.pubkey,s,c),Yd(),$d(),tf(),Jd(),t&&os(t,{type:`beacon`,lat:s,lon:c,accuracy:Ed(a),timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID()}))},e=>{console.warn(`[canary:beacon] getCurrentPosition FAILED`,e.code,e.message),q(async()=>{let{showToast:e}=await Promise.resolve().then(()=>Go);return{showToast:e}},void 0,import.meta.url).then(({showToast:t})=>{e.code===1?t(`Location permission denied`,`error`,3e3):e.code===3?t(`Location request timed out`,`error`,3e3):t(`Could not get location`,`error`,3e3)})},{enableHighAccuracy:!1,maximumAge:3e4,timeout:1e4})}function af(e,t,n,r,i){let{groups:a,activeGroupId:o}=l(),s=o?a[o]:null;if(!s||!s.members.includes(e))return;let c=of(r),u=Sd(t,n,c);X[e]={lat:t,lon:n,geohash:u,precision:c,timestamp:i},Qd(e,t,n),Yd(),$d(),tf(),Jd()}function of(e){return e<=3?9:e<=20?8:e<=80?7:e<=620?6:e<=2500?5:e<=2e4?4:e<=8e4?3:e<=63e4?2:1}function sf(){Z!==null&&navigator.geolocation.clearWatch(Z),Z=null,jd=!1,Y&&=(Y.remove(),null),Od={},X={},kd={},Ad.clear(),Md=null}function cf(e){return new Date(e*1e3).toISOString().slice(11,19)+` UTC`}function lf(e,t){return e<=t?`green`:e<=t*1.25?`amber`:`red`}function uf(e,t){return e<60?cf(t):e<3600?`${Math.floor(e/60)}m ago`:e<86400?`${Math.floor(e/3600)}h ago`:`${Math.floor(e/86400)}d ago`}var df=[{label:`1m`,value:60},{label:`2m`,value:120},{label:`5m`,value:300},{label:`15m`,value:900},{label:`1h`,value:3600},{label:`4h`,value:14400},{label:`24h`,value:86400},{label:`7d`,value:604800}];function ff(e){let{groups:t,activeGroupId:n,identity:r}=l();if(!n||!t[n]){e.innerHTML=``;return}let i=t[n],a=Math.floor(Date.now()/1e3),o=i.livenessInterval,s=i.members.map(e=>{let t=i.livenessCheckins[e]??0,n=t>0,s=n?a-t:1/0,c=n?lf(s,o):`grey`,l=n?Math.max(0,Math.min(100,(1-s/o)*100)):0,u=r?.pubkey===e,d=i.memberNames?.[e];return`
      <li class="liveness-item liveness-item--${c}">
        <span class="liveness-dot liveness-dot--${c}"></span>
        <span class="liveness-name">${B(u?`You`:d??`${e.slice(0,8)}\u2026`)}</span>
        <span class="liveness-time">${n?uf(s,t):`awaiting first check-in`}</span>
        <div class="liveness-bar">
          <div class="liveness-bar__fill liveness-bar__fill--${c}" style="width: ${l}%"></div>
        </div>
      </li>
    `}).join(``),c=r?.pubkey!=null&&i.members.includes(r.pubkey);e.innerHTML=`
    <section class="panel liveness-panel">
      <h3 class="panel__title">Liveness</h3>

      <div class="settings-section">
        <span class="input-label">Check-in interval</span>
        <div class="segmented" id="liveness-interval-picker">
          ${df.map(e=>`<button class="segmented__btn ${o===e.value?`segmented__btn--active`:``}" data-liveness-interval="${e.value}">${e.label}</button>`).join(``)}
        </div>
        <p class="settings-hint">How often members must check in</p>
      </div>

      <ul class="liveness-list" id="liveness-list">
        ${s}
      </ul>
      ${c?`
        <button class="btn btn--primary" id="checkin-btn" type="button" title="Check in with your group and share your approximate location">I'm Alive</button>
      `:``}
    </section>
  `,e.querySelectorAll(`[data-liveness-interval]`).forEach(e=>{e.addEventListener(`click`,()=>{u(n,{livenessInterval:Number(e.dataset.livenessInterval)})})}),document.getElementById(`checkin-btn`)?.addEventListener(`click`,()=>{try{let{identity:e,activeGroupId:t,groups:n}=l();if(!e?.pubkey||!t){console.warn(`[canary:liveness] No identity or activeGroupId`,{pubkey:e?.pubkey,gid:t});return}let r=n[t];if(!r){console.warn(`[canary:liveness] Group not found`,t);return}let i=Math.floor(Date.now()/1e3),a=Va(i,r.rotationInterval);ao(r.seed,`canary:liveness`,e.pubkey,a),u(t,{livenessCheckins:{...r.livenessCheckins,[e.pubkey]:i}}),os(t,{type:`liveness-checkin`,pubkey:e.pubkey,timestamp:i,opId:crypto.randomUUID()}),Promise.all([q(()=>import(`./push-BYeuOIYg.js`),[],import.meta.url),q(()=>Promise.resolve().then(()=>_o),void 0,import.meta.url)]).then(([{notifyCheckin:e},{hashGroupTag:n}])=>{e(n(t))}).catch(()=>{}),rf(),setTimeout(()=>{document.getElementById(`beacon-container`)?.scrollIntoView({behavior:`smooth`,block:`center`})},300),G(`Check-in sent — location updated`,`success`,2e3)}catch(e){console.error(`[canary:liveness] Check-in failed:`,e),G(`Check-in failed`,`error`,3e3)}})}function pf(e){if(e.startsWith(`wss://`))return!0;if(e.startsWith(`ws://`))try{let t=new URL(e);return t.hostname===`localhost`||t.hostname===`127.0.0.1`||t.hostname===`[::1]`}catch{return!1}return!1}var mf=!1;function hf(){let{personas:e}=l(),t=Object.values(e);return t.length===0?`<li class="relay-item"><span class="settings-hint">No personas yet</span></li>`:t.map(e=>{let t=e.npub.length>16?`${e.npub.slice(0,8)}\u2026${e.npub.slice(-4)}`:e.npub;return`
      <li class="relay-item">
        ${ws(e.name)}
        <span class="relay-url">${B(e.displayName??e.name)}</span>
        <span class="settings-hint" style="margin-left: 0.25rem;">${B(t)}</span>
        <button class="btn btn--ghost btn--sm persona-publish-btn" data-persona-id="${B(e.id)}" title="Publish profile">Publish</button>
      </li>
    `}).join(``)}function gf(t){let{groups:n,activeGroupId:r}=l();if(!r||!n[r]){t.innerHTML=``;return}let i=n[r],{identity:a}=l(),o=!!a?.pubkey&&i.admins.includes(a.pubkey);t.innerHTML=`
    <div class="settings-drawer" id="settings-drawer">
      <button class="settings-toggle" id="settings-toggle">
        <span>Group Settings</span>
        <span class="settings-chevron" style="${mf?`transform: rotate(90deg);`:``}">&#9658;</span>
      </button>

      <div class="settings-body" id="settings-body"${mf?``:` hidden`}>
        <!-- Group Name -->
        <label class="input-label">Name
          <input class="input" id="settings-name" value="${B(i.name)}">
        </label>

        <!-- Rotation Interval -->
        <div class="settings-section">
          <span class="input-label">Rotation</span>
          <div class="segmented">
            <button class="segmented__btn ${i.rotationInterval===30?`segmented__btn--active`:``}" data-interval="30">30s</button>
            <button class="segmented__btn ${i.rotationInterval===86400?`segmented__btn--active`:``}" data-interval="86400">24h</button>
            <button class="segmented__btn ${i.rotationInterval===604800?`segmented__btn--active`:``}" data-interval="604800">7d</button>
            <button class="segmented__btn ${i.rotationInterval===2592e3?`segmented__btn--active`:``}" data-interval="2592000">30d</button>
          </div>
          <p class="settings-hint">How often the verification word changes</p>
        </div>

        ${i.encodingFormat===`words`?`
        <!-- Word Count -->
        <div class="settings-section">
          <span class="input-label">Words</span>
          <div class="segmented">
            <button class="segmented__btn ${i.wordCount===1?`segmented__btn--active`:``}" data-words="1">1</button>
            <button class="segmented__btn ${i.wordCount===2?`segmented__btn--active`:``}" data-words="2">2</button>
            <button class="segmented__btn ${i.wordCount===3?`segmented__btn--active`:``}" data-words="3">3</button>
          </div>
          <p class="settings-hint">More words = stronger security</p>
        </div>
        `:``}

        <!-- Encoding Format -->
        <div class="settings-section">
          <span class="input-label">Display Format</span>
          <div class="segmented">
            <button class="segmented__btn ${i.encodingFormat===`words`?`segmented__btn--active`:``}" data-enc="words">Word</button>
            <button class="segmented__btn ${i.encodingFormat===`pin`?`segmented__btn--active`:``}" data-enc="pin">PIN</button>
            <button class="segmented__btn ${i.encodingFormat===`hex`?`segmented__btn--active`:``}" data-enc="hex">Hex</button>
          </div>
          <p class="settings-hint">Words for voice, PINs for digital input, Hex for machine-to-machine</p>
        </div>

        <!-- Tolerance Window -->
        <div class="settings-section">
          <span class="input-label">Tolerance</span>
          <div class="segmented">
            <button class="segmented__btn ${i.tolerance===0?`segmented__btn--active`:``}" data-tolerance="0">0</button>
            <button class="segmented__btn ${i.tolerance===1?`segmented__btn--active`:``}" data-tolerance="1">+/-1</button>
            <button class="segmented__btn ${i.tolerance===2?`segmented__btn--active`:``}" data-tolerance="2">+/-2</button>
            <button class="segmented__btn ${i.tolerance===3?`segmented__btn--active`:``}" data-tolerance="3">+/-3</button>
          </div>
          <p class="settings-hint">Accept words from neighbouring time windows (higher = more forgiving, less secure)</p>
        </div>

        <!-- Duress Mode -->
        <div class="settings-section">
          <span class="input-label">Emergency Alert Mode</span>
          <div class="segmented">
            <button class="segmented__btn ${i.duressMode===`immediate`||!i.duressMode?`segmented__btn--active`:``}" data-duress-mode="immediate">Immediate</button>
            <button class="segmented__btn ${i.duressMode===`dead-drop`?`segmented__btn--active`:``}" data-duress-mode="dead-drop">Dead Drop</button>
            <button class="segmented__btn ${i.duressMode===`both`?`segmented__btn--active`:``}" data-duress-mode="both">Both</button>
          </div>
          <p class="settings-hint">Immediate alerts members now. Dead drop records silently for later retrieval.</p>
        </div>

        <!-- Nostr Sync Toggle -->
        <div class="settings-section">
          <label class="toggle-label">
            <input type="checkbox" id="nostr-toggle" ${i.nostrEnabled?`checked`:``}>
            <span>Nostr Sync</span>
          </label>
          <div class="nostr-settings" id="nostr-settings"${i.nostrEnabled?``:` hidden`}>
            <!-- Identity -->
            <div class="nostr-identity" id="nostr-identity">
              <span class="settings-hint">Loading identity…</span>
            </div>

            <!-- Write relays (publishing) -->
            <div class="nostr-relays">
              <span class="input-label">Write Relays <span class="settings-hint" style="font-weight:normal;">(publishing)</span></span>
              <ul class="relay-list" id="write-relay-list">
                ${(i.writeRelays??[]).map((e,t)=>`
                  <li class="relay-item">
                    <span class="relay-url">${B(e)}</span>
                    <button class="btn btn--ghost btn--sm write-relay-remove" data-relay-index="${t}" aria-label="Remove write relay">✕</button>
                  </li>
                `).join(``)}
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
                ${(i.readRelays??[]).map((e,t)=>`
                  <li class="relay-item">
                    <span class="relay-url">${B(e)}</span>
                    <button class="btn btn--ghost btn--sm read-relay-remove" data-relay-index="${t}" aria-label="Remove read relay">✕</button>
                  </li>
                `).join(``)}
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
                ${he()?`Connected to ${oe()} relay${oe()===1?``:`s`}`:`Not connected`}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="settings-actions">
          <button class="btn btn--ghost" id="export-btn">Export Group</button>
          <button class="btn btn--ghost" id="import-btn">Import Group</button>
          ${o?`<button class="btn btn--warning" id="reseed-btn">Rotate Key</button>`:``}
          ${o?`<button class="btn btn--danger" id="compromise-reseed-btn">Compromise Reseed</button>`:``}
          <button class="btn btn--danger" id="dissolve-btn">Dissolve Group</button>
        </div>

        <!-- Personas -->
        <div class="settings-section">
          <span class="input-label">Personas</span>
          <ul class="relay-list" id="persona-list">
            ${hf()}
          </ul>
          <div class="relay-add-row" style="margin-top: 0.5rem;">
            <input class="input relay-add-input" id="persona-name-input" type="text" placeholder="New persona name">
            <button class="btn btn--ghost btn--sm" id="persona-create-btn">Create</button>
          </div>
        </div>
      </div>
    </div>
  `,document.getElementById(`settings-toggle`).addEventListener(`click`,()=>{mf=!mf;let e=document.getElementById(`settings-body`),n=t.querySelector(`.settings-chevron`);e.hidden=!mf,n.style.transform=mf?`rotate(90deg)`:``}),document.getElementById(`settings-name`).addEventListener(`change`,e=>{let t=e.target.value.trim();t&&u(r,{name:t})}),t.querySelectorAll(`[data-interval]`).forEach(e=>{e.addEventListener(`click`,()=>{u(r,{rotationInterval:Number(e.dataset.interval)})})}),t.querySelectorAll(`[data-words]`).forEach(e=>{e.addEventListener(`click`,()=>{u(r,{wordCount:Number(e.dataset.words)})})}),t.querySelectorAll(`[data-enc]`).forEach(e=>{e.addEventListener(`click`,()=>{u(r,{encodingFormat:e.dataset.enc})})}),t.querySelectorAll(`[data-tolerance]`).forEach(e=>{e.addEventListener(`click`,()=>{u(r,{tolerance:Number(e.dataset.tolerance)})})}),t.querySelectorAll(`[data-duress-mode]`).forEach(e=>{e.addEventListener(`click`,()=>{u(r,{duressMode:e.dataset.duressMode})})}),document.getElementById(`nostr-toggle`).addEventListener(`change`,e=>{let t=e.target.checked;u(r,{nostrEnabled:t});let n=document.getElementById(`nostr-settings`);if(n.hidden=!t,t){let e=l().groups[r];as(e?.readRelays??[],e?.writeRelays??[],r).then(()=>{vf()}),_f()}else ps(),fe(),Ls(!1,0),vf()});function c(){let e=l().groups[r];e?.nostrEnabled&&as(e.readRelays??[],e.writeRelays??[],r)}t.querySelectorAll(`.write-relay-remove`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Number(e.dataset.relayIndex),n=[...l().groups[r]?.writeRelays??[]];n.splice(t,1),u(r,{writeRelays:n}),c()})}),t.querySelectorAll(`.read-relay-remove`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Number(e.dataset.relayIndex),n=[...l().groups[r]?.readRelays??[]];n.splice(t,1),u(r,{readRelays:n}),c()})}),document.getElementById(`write-relay-add-btn`).addEventListener(`click`,()=>{let e=document.getElementById(`write-relay-add-input`),t=e.value.trim();if(!pf(t)){e.focus();return}let n=[...l().groups[r]?.writeRelays??[]];n.includes(t)?e.value=``:(n.push(t),u(r,{writeRelays:n}),e.value=``,c())}),document.getElementById(`read-relay-add-btn`).addEventListener(`click`,()=>{let e=document.getElementById(`read-relay-add-input`),t=e.value.trim();if(!pf(t)){e.focus();return}let n=[...l().groups[r]?.readRelays??[]];n.includes(t)?e.value=``:(n.push(t),u(r,{readRelays:n}),e.value=``,c())}),document.getElementById(`write-relay-add-input`).addEventListener(`keydown`,e=>{e.key===`Enter`&&document.getElementById(`write-relay-add-btn`).click()}),document.getElementById(`read-relay-add-input`).addEventListener(`keydown`,e=>{e.key===`Enter`&&document.getElementById(`read-relay-add-btn`).click()}),i.nostrEnabled&&_f(),document.getElementById(`reseed-btn`)?.addEventListener(`click`,()=>{let{groups:t}=l(),n=t[r],i=n&&e(n)===`online`?`Rotate the group key? This broadcasts the new key to all members via the relay.`:`Rotate the group key? Remaining members will need to re-sync via Share State.`;confirm(i)&&(mc(r),G(`Key rotated. New verification words are active.`,`warning`,6e3))}),document.getElementById(`compromise-reseed-btn`)?.addEventListener(`click`,()=>{confirm(`Compromise reseed? This generates a new key WITHOUT broadcasting. All members will need new invites.`)&&(hc(r),G(`Emergency reseed complete. No broadcast sent — share new invites with all members.`,`warning`,8e3))}),document.getElementById(`dissolve-btn`).addEventListener(`click`,()=>{confirm(`Dissolve "${i.name}"? This cannot be undone.`)&&pc(r)}),document.getElementById(`export-btn`).addEventListener(`click`,()=>{if(!confirm(`This exports the group secret in cleartext. Treat the file like a password.`))return;let e=new Blob([JSON.stringify(i,null,2)],{type:`application/json`}),t=URL.createObjectURL(e),n=document.createElement(`a`);n.href=t,n.download=`canary-${i.name.toLowerCase().replace(/\s+/g,`-`)}.json`,n.click(),URL.revokeObjectURL(t)}),document.getElementById(`import-btn`).addEventListener(`click`,()=>{if(!confirm(`Only import files from trusted sources — the file contains the group secret.`))return;let e=document.createElement(`input`);e.type=`file`,e.accept=`.json`,e.addEventListener(`change`,async()=>{let t=e.files?.[0];if(t)try{let e=await t.text(),n=JSON.parse(e);bc(n);let r=crypto.randomUUID(),i={id:r,name:String(n.name),seed:String(n.seed),members:n.members.filter(e=>typeof e==`string`),memberNames:{},nostrEnabled:!1,relays:[],wordlist:typeof n.wordlist==`string`?n.wordlist:`en-v1`,wordCount:[1,2,3].includes(n.wordCount)?n.wordCount:2,counter:typeof n.counter==`number`&&n.counter>=0?n.counter:0,usageOffset:typeof n.usageOffset==`number`&&n.usageOffset>=0?n.usageOffset:0,rotationInterval:typeof n.rotationInterval==`number`&&n.rotationInterval>0?n.rotationInterval:86400,encodingFormat:[`words`,`pin`,`hex`].includes(n.encodingFormat)?n.encodingFormat:`words`,usedInvites:[],latestInviteIssuedAt:0,livenessInterval:typeof n.rotationInterval==`number`&&n.rotationInterval>0?n.rotationInterval:86400,livenessCheckins:{},tolerance:typeof n.tolerance==`number`&&n.tolerance>=0&&n.tolerance<=10?n.tolerance:1,beaconInterval:typeof n.beaconInterval==`number`&&n.beaconInterval>0?n.beaconInterval:60,beaconPrecision:typeof n.beaconPrecision==`number`&&n.beaconPrecision>0?n.beaconPrecision:5,duressPrecision:typeof n.duressPrecision==`number`&&n.duressPrecision>0?n.duressPrecision:9,duressMode:[`immediate`,`dead-drop`,`both`].includes(n.duressMode)?n.duressMode:`immediate`,createdAt:typeof n.createdAt==`number`?n.createdAt:Math.floor(Date.now()/1e3),admins:Array.isArray(n.admins)?n.admins.filter(e=>typeof e==`string`):[],epoch:typeof n.epoch==`number`&&n.epoch>=0?n.epoch:0,consumedOps:Array.isArray(n.consumedOps)?n.consumedOps.filter(e=>typeof e==`string`):[]},{groups:a}=l();s({groups:{...a,[r]:i},activeGroupId:r})}catch{alert(`Could not import group file. Check the file format.`)}}),e.click()}),document.getElementById(`persona-create-btn`)?.addEventListener(`click`,()=>{let e=document.getElementById(`persona-name-input`),t=e?.value.trim();if(!t){e?.focus();return}try{let n=Se(t),{personas:r}=l();s({personas:{...r,[t]:n}}),e&&(e.value=``),G(`Persona "${t}" created`,`success`)}catch(e){G(e instanceof Error?e.message:`Failed to create persona.`,`error`)}}),document.getElementById(`persona-name-input`)?.addEventListener(`keydown`,e=>{e.key===`Enter`&&document.getElementById(`persona-create-btn`)?.click()}),t.querySelectorAll(`.persona-publish-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.personaId;t&&(document.dispatchEvent(new CustomEvent(`canary:publish-persona-profile`,{detail:{personaId:t}})),G(`Publishing profile for "${Object.values(l().personas).find(e=>e.id===t)?.name??t}"…`,`info`))})})}function _f(){let e=document.getElementById(`nostr-identity`);if(!e)return;let{identity:t}=l();if(!t?.pubkey){e.innerHTML=`<span class="settings-hint">No identity available.</span>`;return}let n=`${t.pubkey.slice(0,8)}…${t.pubkey.slice(-8)}`;e.innerHTML=`
    <div class="nostr-identity-row">
      <span class="input-label">Identity (Local key)</span>
      <span class="relay-url nostr-pubkey" title="${B(t.pubkey)}">${B(n)}</span>
    </div>
    <p class="settings-hint">Your identity is stored locally on this device.</p>
  `}function vf(){let e=document.getElementById(`nostr-conn-status`);if(!e)return;let t=oe();e.textContent=he()?`Connected to ${t} relay${t===1?``:`s`}`:`Not connected`}var yf=new TextEncoder;function bf(e){let t=new Uint8Array(4);return new DataView(t.buffer).setUint32(0,e,!1),t}function xf(){let e=new Uint8Array(32);return crypto.getRandomValues(e),e}var Sf=Object.freeze({call:Object.freeze({wordCount:1,rotationSeconds:30,tolerance:1,directional:!0,description:`Phone verification for insurance, banking, and call centres. Single word with 30-second rotation. Deepfake-proof — cloning a voice does not help derive the current word.`}),handoff:Object.freeze({wordCount:1,rotationSeconds:0,tolerance:0,directional:!0,description:`Physical handoff verification for rideshare, delivery, and task completion. Single-use token per event. No time dependency — counter is the task/event ID.`})});function Cf(e){let t=e.preset?Sf[e.preset]:void 0,n=e.rotationSeconds??t?.rotationSeconds??30,r=e.tolerance??t?.tolerance??0,i=t?.wordCount??1,a=e.encoding??{format:`words`,count:i};if(!e.namespace)throw Error(`namespace must be a non-empty string`);if(e.namespace.includes(`\0`))throw Error(`namespace must not contain null bytes`);if(!e.roles[0]||!e.roles[1])throw Error(`Both roles must be non-empty strings`);if(e.roles[0].includes(`\0`)||e.roles[1].includes(`\0`))throw Error(`Roles must not contain null bytes`);if(e.roles[0]===e.roles[1])throw Error(`Roles must be distinct, got ["${e.roles[0]}", "${e.roles[1]}"]`);if(e.myRole!==e.roles[0]&&e.myRole!==e.roles[1])throw Error(`myRole "${e.myRole}" is not one of the configured roles ["${e.roles[0]}", "${e.roles[1]}"]`);if(!Number.isInteger(n)||n<0)throw RangeError(`rotationSeconds must be a non-negative integer, got ${n}`);if(!Number.isInteger(r)||r<0)throw RangeError(`tolerance must be a non-negative integer, got ${r}`);if(r>10)throw RangeError(`tolerance must be <= 10, got ${r}`);if(n===0&&e.counter===void 0)throw Error(`Fixed counter mode (rotationSeconds=0) requires config.counter`);if(n===0&&e.counter!==void 0&&(!Number.isInteger(e.counter)||e.counter<0||e.counter>4294967295))throw RangeError(`counter must be an integer 0–4294967295, got ${e.counter}`);if(n>0&&e.counter!==void 0)throw Error(`counter must not be set when rotationSeconds > 0 (counter is derived from time)`);let o=typeof e.secret==`string`?W(e.secret):e.secret,s=e.roles[0]===e.myRole?e.roles[1]:e.roles[0],c=`pair:${e.namespace}:${s}`,l=n===0;function u(t){if(l){if(e.counter===void 0)throw Error(`Fixed counter mode (rotationSeconds=0) requires config.counter`);return e.counter}let r=t??Math.floor(Date.now()/1e3);return Math.floor(r/n)}return{counter:u,myToken(t){return za(o,e.namespace,e.roles,u(t),a)[e.myRole]},theirToken(t){return za(o,e.namespace,e.roles,u(t),a)[s]},verify(t,n){let i=t.toLowerCase().trim().replace(/\s+/g,` `),l=u(n),d=Math.max(0,l-r),f=Math.min(4294967295,l+r),p=!1;for(let t=d;t<=f;t++)ba(i,za(o,e.namespace,e.roles,t,a)[s])&&(p=!0);let m=[];if(e.theirIdentity){let t=new Set,n=2*r,u=Math.max(0,l-n),p=Math.min(4294967295,l+n);for(let n=u;n<=p;n++){let r=za(o,e.namespace,e.roles,n,a);t.add(r[s])}for(let n=d;n<=f;n++){let r=ha(yf.encode(c+`:duress`),new Uint8Array([0]),yf.encode(e.theirIdentity),bf(n)),s=da(o,r),l=Aa(s,a),u=1;for(;t.has(l)&&u<=255;)s=da(o,ha(r,new Uint8Array([u]))),l=Aa(s,a),u++;ba(i,l)&&m.push(e.theirIdentity)}}return m.length>0?{status:`duress`,identities:m}:p?{status:`valid`}:{status:`invalid`}},pair(t){return za(o,e.namespace,e.roles,u(t),a)}}}var wf={insurance:{label:`Insurance`,namespace:`aviva`,roles:[`caller`,`agent`],preset:`call`},pickup:{label:`Pickup`,namespace:`family`,roles:[`child`,`adult`],preset:`handoff`},rideshare:{label:`Rideshare`,namespace:`dispatch`,roles:[`requester`,`driver`],preset:`handoff`,encoding:`pin`}},Tf=xf(),Q=wf.insurance,Ef,Df,Of=null,kf=1;function Af(){let e=Q.preset===`handoff`,t=Q.encoding===`pin`?{format:`pin`,digits:4}:void 0,n={secret:Tf,namespace:Q.namespace,roles:Q.roles,preset:Q.preset,...e?{counter:kf}:{},...t?{encoding:t}:{}};Ef=Cf({...n,myRole:Q.roles[0],theirIdentity:Q.roles[1]}),Df=Cf({...n,myRole:Q.roles[1],theirIdentity:Q.roles[0]})}Af();function jf(e,t){let n=Q.preset===`handoff`,r=Sf[Q.preset],i=n?kf:Math.floor((t??Math.floor(Date.now()/1e3))/r.rotationSeconds),a=`pair:${Q.namespace}:${e}`,o=Q.encoding===`pin`?{format:`pin`,digits:4}:{format:`words`,count:1};return ro(Tf,a,e,i,o,r.tolerance)}function Mf(){Of!==null&&(clearInterval(Of),Of=null)}function Nf(e){if(e<=0)return`0s`;let t=Math.floor(e/60),n=Math.floor(e%60);return t>0?`${t}m ${n}s`:`${n}s`}function Pf(e){if(e===0)return 0;let t=Math.floor(Date.now()/1e3),n=(Math.floor(t/e)+1)*e;return Math.max(0,n-t)}function Ff(e){Mf();let t=Math.floor(Date.now()/1e3),n=Q.preset===`handoff`,r=n?0:Sf[Q.preset].rotationSeconds,i=Pf(r),a=r>0?Math.min(100,(r-i)/r*100):100,o=Q.roles[0],s=Q.roles[1];e.innerHTML=`
    <div class="call-sim">
      <div class="call-sim__header">
        <h2 class="call-sim__title">CANARY Call Verification Demo</h2>
        <div class="call-sim__scenarios" id="call-scenarios">
          ${Object.entries(wf).map(([e,t])=>`<button class="btn call-sim__scenario-btn${Q===t?` call-sim__scenario-btn--active`:``}" data-scenario="${e}">${t.label}</button>`).join(``)}
        </div>
      </div>

      <div class="call-sim__panels">
        <div class="call-sim__panel call-sim__panel--caller">
          <h3 class="call-sim__role">${o.toUpperCase()}</h3>
          <div class="call-sim__token-group">
            <span class="call-sim__label">Your code — tap to reveal:</span>
            <div class="call-sim__token call-sim__token--reveal" id="caller-reveal" data-real="${Ef.myToken(t)}" data-alt="${jf(o,t)}">••••••••</div>
          </div>
          ${n?`<span class="call-sim__countdown">Single-use</span>`:`
          <div class="call-sim__progress"><div class="call-sim__progress-bar" id="caller-progress" style="width: ${a}%"></div></div>
          <span class="call-sim__countdown" id="caller-countdown">${Nf(i)}</span>
          `}
          <div class="call-sim__verify">
            <input type="text" class="input call-sim__input" id="caller-verify-input" placeholder="Type ${s}'s word..." autocomplete="off" />
            <button class="btn btn--primary call-sim__verify-btn" id="caller-verify-btn">Verify</button>
          </div>
          <div class="call-sim__result" id="caller-result" hidden></div>
        </div>

        <div class="call-sim__divider"></div>

        <div class="call-sim__panel call-sim__panel--agent">
          <h3 class="call-sim__role">${s.toUpperCase()}</h3>
          <div class="call-sim__token-group">
            <span class="call-sim__label">Your code — tap to reveal:</span>
            <div class="call-sim__token call-sim__token--reveal" id="agent-reveal" data-real="${Df.myToken(t)}" data-alt="${jf(s,t)}">••••••••</div>
          </div>
          ${n?`<span class="call-sim__countdown">Single-use</span>`:`
          <div class="call-sim__progress"><div class="call-sim__progress-bar" id="agent-progress" style="width: ${a}%"></div></div>
          <span class="call-sim__countdown" id="agent-countdown">${Nf(i)}</span>
          `}
          <div class="call-sim__verify">
            <input type="text" class="input call-sim__input" id="agent-verify-input" placeholder="Type ${o}'s word..." autocomplete="off" />
            <button class="btn btn--primary call-sim__verify-btn" id="agent-verify-btn">Verify</button>
          </div>
          <div class="call-sim__result" id="agent-result" hidden></div>
        </div>
      </div>

      <div class="call-sim__banner call-sim__banner--valid" id="call-verified-banner" hidden></div>

      <div class="call-sim__footer">
        <span class="call-sim__meta">Namespace: <strong>${Q.namespace}</strong></span>
        <span class="call-sim__meta">Rotation: <strong>${n?`single-use`:r+`s`}</strong></span>
        <span class="call-sim__meta">Encoding: <strong>${Q.encoding??`words`}</strong></span>
        <span class="call-sim__meta">Tolerance: <strong>+/-${n?`0`:Sf[Q.preset].tolerance}</strong></span>
        <button class="btn" id="call-reset-seed">Reset seed</button>
      </div>

      <div class="call-sim__pair" id="call-pair">
        <span class="call-sim__meta">Pair: <code id="pair-display"></code></span>
      </div>
    </div>
  `,e.querySelector(`#call-scenarios`)?.addEventListener(`click`,t=>{let n=t.target.closest(`[data-scenario]`);if(!n)return;let r=n.dataset.scenario;wf[r]&&wf[r]!==Q&&(Q=wf[r],Af(),Ff(e))}),e.querySelector(`#call-reset-seed`)?.addEventListener(`click`,()=>{Tf=xf(),Q.preset===`handoff`&&kf++,Af(),Ff(e)});let c=!1,l=!1,u=!1;function d(){if(!u&&c&&l){Mf();let t=e.querySelector(`#call-verified-banner`);t&&(t.hidden=!1,t.textContent=`Call Verified — both parties authenticated`),e.querySelectorAll(`.call-sim__progress, .call-sim__countdown`).forEach(e=>{e.hidden=!0})}}function f(t,n,r,i,a){let o=e.querySelector(`#${t}`),s=e.querySelector(`#${n}`),f=e.querySelector(`#${r}`);if(!o||!s||!f)return;function p(){let e=o.value.trim();if(!e)return;let t=i.verify(e);f.hidden=!1,f.className=`call-sim__result`,t.status===`valid`?(f.classList.add(`call-sim__result--valid`),f.textContent=`Verified ✓`,a===`caller`?c=!0:l=!0,d()):t.status===`duress`?(f.classList.add(`call-sim__result--invalid`),f.textContent=`Failed ✗`,u=!0):(f.classList.add(`call-sim__result--invalid`),f.textContent=`Failed ✗`)}s.addEventListener(`click`,p),o.addEventListener(`keydown`,e=>{e.key===`Enter`&&p()})}f(`caller-verify-input`,`caller-verify-btn`,`caller-result`,Ef,`caller`),f(`agent-verify-input`,`agent-verify-btn`,`agent-result`,Df,`agent`);function p(t){let n=e.querySelector(`#${t}`);if(!n)return;function r(e){e.preventDefault();let t=n.getBoundingClientRect();n.textContent=e.clientX-t.left<t.width/2?n.dataset.real:n.dataset.alt}function i(){n.textContent=`••••••••`}n.addEventListener(`pointerdown`,r),n.addEventListener(`pointerup`,i),n.addEventListener(`pointerleave`,i),n.addEventListener(`pointercancel`,i)}p(`caller-reveal`),p(`agent-reveal`);let m=e.querySelector(`#pair-display`);if(m){let e=Ef.pair(t);m.textContent=Object.entries(e).map(([e,t])=>`${e}: ${t}`).join(` | `)}!n&&r>0&&(Of=setInterval(()=>{let t=Pf(r),n=Math.min(100,(r-t)/r*100),i=e.querySelector(`#caller-progress`),a=e.querySelector(`#agent-progress`),d=e.querySelector(`#caller-countdown`),f=e.querySelector(`#agent-countdown`),p=Math.max(0,100-n),m=p>50?`hsl(${Math.round(p/100*120)}, 70%, 45%)`:`hsl(${Math.round(p/100*120)}, 80%, 45%)`;i&&(i.style.width=`${n}%`,i.style.background=m),a&&(a.style.width=`${n}%`,a.style.background=m),d&&(d.textContent=Nf(t)),f&&(f.textContent=Nf(t));let h=Math.floor(Date.now()/1e3),g=e.querySelector(`#caller-reveal`),_=e.querySelector(`#agent-reveal`),v=Ef.myToken(h),y=g&&g.dataset.real!==v;if(g&&(g.dataset.real=v,g.dataset.alt=jf(o,h)),_&&(_.dataset.real=Df.myToken(h),_.dataset.alt=jf(s,h)),y){c=!1,l=!1,u=!1;let t=e.querySelector(`#caller-result`),n=e.querySelector(`#agent-result`);t&&(t.hidden=!0,t.className=`call-sim__result`),n&&(n.hidden=!0,n.className=`call-sim__result`);let r=e.querySelector(`#caller-verify-input`),i=e.querySelector(`#agent-verify-input`);r&&(r.value=``),i&&(i.value=``);let a=e.querySelector(`#call-verified-banner`);a&&(a.hidden=!0),e.querySelectorAll(`.call-sim__progress, .call-sim__countdown`).forEach(e=>{e.hidden=!1})}let ee=e.querySelector(`#pair-display`);if(ee){let e=Ef.pair();ee.textContent=Object.entries(e).map(([e,t])=>`${e}: ${t}`).join(` | `)}t===0&&(Mf(),Ff(e))},1e3))}function If(){Mf()}var Lf=`
  .id-tree {
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    margin-bottom: 1.25rem;
  }

  .id-tree__root {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    color: var(--text-primary);
    font-weight: 600;
  }

  .id-tree__root-icon {
    font-size: 1rem;
  }

  .id-tree__node {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0;
    cursor: pointer;
    transition: background 0.1s;
    border-radius: 3px;
  }

  .id-tree__node--selected {
    background: var(--bg-hover, rgba(255,255,255,0.04));
    border-left: 2px solid var(--amber-500);
  }

  .id-tree__node:hover {
    background: var(--bg-hover, rgba(255,255,255,0.04));
  }

  .id-tree__connector {
    color: var(--text-muted);
    white-space: pre;
    user-select: none;
    flex-shrink: 0;
  }

  .id-tree__badge {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.625rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .id-tree__name {
    color: var(--text-primary);
    font-weight: 500;
  }

  .id-tree__display-name {
    color: var(--text-muted);
    font-size: 0.75rem;
  }

  .id-tree__type {
    font-size: 0.625rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 0.05rem 0.35rem;
  }

  .id-tree__groups {
    margin-left: auto;
    font-size: 0.6875rem;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .id-tree__groups:hover {
    color: var(--amber-400);
  }

  .id-tree__add-btn {
    font-size: 0.75rem;
    color: var(--text-muted);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0 0.25rem;
    opacity: 0;
    transition: opacity 0.15s;
    flex-shrink: 0;
  }

  .id-tree__node:hover .id-tree__add-btn {
    opacity: 1;
  }

  .id-tree__add-btn:hover {
    color: var(--amber-400);
  }

  .id-tree__inline-input {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    background: var(--bg-deep);
    border: 1px solid var(--amber-500);
    border-radius: 3px;
    color: var(--text-primary);
    padding: 0.125rem 0.375rem;
    outline: none;
    width: 10rem;
  }

  .id-tree__inline-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0;
  }
`;function Rf(e,t){let n=0;for(let r of Object.values(t))r.personaId===e&&n++;return n}function zf(e,t){for(let[n,r]of Object.entries(t))if(r.personaId===e)return n;return null}function Bf(e,t,n,i,a,o){if(e.archived)return``;let s=n===0?``:i?`└── `:`├── `,c=Cs(e.name),l=B(e.name.slice(0,1).toUpperCase()),u=Rf(e.id,t),d=u>0?`${u} group${u===1?``:`s`}`:``,f=e.displayName&&e.displayName!==e.name?` <span class="id-tree__display-name">(${B(e.displayName)})</span>`:``,p=`<span class="id-tree__type">${B(r(e))}</span>`,m=n*1.5,h=`
    <div class="id-tree__node${e.id===o?` id-tree__node--selected`:``}" data-tree-persona-id="${B(e.id)}" style="padding-left: ${m}rem;">
      <span class="id-tree__connector">${a}${s}</span>
      <span class="id-tree__badge" style="background: ${c};">${l}</span>
      <span class="id-tree__name">${B(e.name)}</span>${f}
      ${p}
      <button class="id-tree__add-btn" data-tree-add-child="${B(e.id)}" title="Add child persona or account">+</button>
      ${d?`<span class="id-tree__groups" data-tree-groups-persona="${B(e.id)}">${d}</span>`:``}
    </div>
  `,g=Object.values(e.children).filter(e=>!e.archived),_=n===0?``:a+(i?`    `:`│   `);return h+g.map((e,r)=>{let i=r===g.length-1;return Bf(e,t,n+1,i,_,o)}).join(``)}function Vf(e){let{identity:t,personas:n,groups:r}=l();if(!t)return`<div class="id-tree"></div>`;let i=`<style id="identity-tree-styles">${Lf}</style>`,a=t.displayName&&t.displayName!==`You`?B(t.displayName):`Master Identity`,o=Object.values(n).filter(e=>!e.archived);return`
    ${i}
    <div class="id-tree">
      <div class="id-tree__root">
        <span class="id-tree__root-icon">&#128273;</span>
        <span>${a}</span>
      </div>
      ${o.map((t,n)=>Bf(t,r,0,n===o.length-1,``,e)).join(``)}
    </div>
  `}function Hf(e){let t=e.querySelector(`.id-tree`);t&&(t.addEventListener(`click`,e=>{let n=e.target,r=n.closest(`[data-tree-add-child]`);if(r){e.stopPropagation();let n=r.dataset.treeAddChild;Uf(t,r,n);return}let i=n.closest(`[data-tree-groups-persona]`);if(i){e.stopPropagation();let t=i.dataset.treeGroupsPersona,{groups:n}=l(),r=zf(t,n);s(r?{view:`groups`,activeGroupId:r}:{view:`groups`});return}let a=n.closest(`[data-tree-persona-id]`);if(a){let e=a.dataset.treePersonaId;e&&document.dispatchEvent(new CustomEvent(`canary:select-persona`,{detail:{personaId:e}}))}}),t.addEventListener(`keydown`,e=>{let t=e.target;(e.key===`Enter`||e.key===` `)&&t.matches(`[data-tree-persona-id]`)&&(e.preventDefault(),t.click())}))}function Uf(e,t,n){if(e.querySelector(`.id-tree__inline-row`))return;let r=t.closest(`.id-tree__node`);if(!r)return;let i=parseFloat(r.style.paddingLeft||`0`)+1.5,a=document.createElement(`div`);a.className=`id-tree__inline-row`,a.style.paddingLeft=i+`rem`;let o=document.createElement(`input`);o.className=`id-tree__inline-input`,o.type=`text`,o.placeholder=`child name`,o.maxLength=32,o.autocomplete=`off`;let c=document.createElement(`select`);c.className=`input`,c.style.cssText=`font-size:0.75rem;padding:0.125rem 0.375rem;max-width:8rem;`,c.innerHTML=`
    <option value="account">Account</option>
    <option value="persona">Persona</option>
  `,a.appendChild(o),a.appendChild(c),r.insertAdjacentElement(`afterend`,a),o.focus();function u(){a.remove()}function d(){let e=o.value.trim().toLowerCase();if(!e||e.length===0||e.length>32||e!==e.toLowerCase()||/\s/.test(e)){u();return}try{let t=Te(n,e,c.value===`persona`?`persona`:`account`),{personas:r}=l();z(r,n)&&(s({personas:Wf(r,n,t)}),document.dispatchEvent(new CustomEvent(`canary:select-persona`,{detail:{personaId:t.id}})))}catch{}u()}o.addEventListener(`keydown`,e=>{e.key===`Enter`?(e.preventDefault(),d()):e.key===`Escape`&&(e.preventDefault(),u())}),o.addEventListener(`blur`,()=>{setTimeout(u,150)})}function Wf(e,t,n){let r={};for(let[i,a]of Object.entries(e))i===t?r[i]={...a,children:{...a.children,[n.id]:n}}:a.children&&Object.keys(a.children).length>0?r[i]={...a,children:Wf(a.children,t,n)}:r[i]=a;return r}var Gf=!1,Kf=!1,$=null,qf=!1,Jf=!1,Yf=!1,Xf=null,Zf=[{name:``,index:0},{name:``,index:0},{name:``,index:0}],Qf=!1;function $f(e){return e.length<=16?e:`${e.slice(0,8)}\u2026${e.slice(-4)}`}function ep(e){return!(e.length===0||e.length>32||e!==e.toLowerCase()||/\s/.test(e))}function tp(e){return a(e)===`account`?`A standalone child key you can export as an nsec account.`:`A reusable branch for related identities, profiles, and group keys.`}function np(e){return a(e)===`account`?`account`:`persona`}function rp(){let e=l().identity;return e?e.signerType===`nip07`?{label:`Extension managed`,detail:`Your browser extension keeps the root secret private, so canary-kit cannot derive or back up the tree here.`,recoveryBacked:!1}:e.mnemonic?{label:`Mnemonic-backed root`,detail:`This root supports the full nsec-tree workflow: derived personas, derived accounts, proofs, and phrase/Shamir recovery.`,recoveryBacked:!0}:{label:`nsec-backed root`,detail:`This imported nsec can still derive the identity tree, but it has no recovery phrase. Create a new mnemonic-backed root only if you want phrase/Shamir recovery.`,recoveryBacked:!1}:{label:`No identity`,detail:`Create or restore a mnemonic-backed root to use the identity tree and recovery features.`,recoveryBacked:!1}}function ip(e,t){let n=t.querySelector(`[data-field="displayName"]`),r=t.querySelector(`[data-field="about"]`),i=t.querySelector(`[data-field="picture"]`);return!n&&!r&&!i?!1:(n?.value??``)!==(e.displayName??``)||(r?.value??``)!==(e.about??``)||(i?.value??``)!==(e.picture??``)}function ap(){if(!$)return null;let e=z(l().personas,$);return e?[...e.ancestors.map(e=>({name:e.name,index:e.index})),{name:e.persona.name,index:e.persona.index}]:null}function op(e){Zf=[{name:e[0]?.name??``,index:e[0]?.index??0},{name:e[1]?.name??``,index:e[1]?.index??0},{name:e[2]?.name??``,index:e[2]?.index??0}],Qf=!1}function sp(e){return e.map((e,t)=>t===0?`derivePersona(${e.name}, ${e.index??0})`:`persona:${e.name}@${e.index??0}`).join(` → `)}function cp(){let e=Zf.map(e=>({name:e.name.trim(),index:e.index??0})).filter(e=>e.name.length>0);if(e.length===0)return null;try{let t=we(e);return{path:e,npub:t.npub,nsec:t.nsec}}catch(e){return{error:e instanceof Error?e.message:`Unable to derive identity`}}}function lp(){let e=cp();return e===null?`<div class="id-derive__hint">Add at least the first level to derive an identity.</div>`:`error`in e?`<div class="id-derive__error">${B(e.error)}</div>`:`
    <div class="id-derive__result">
      <div class="id-derive__chain">Path: ${B(sp(e.path))}</div>
      <div class="id-derive__row">
        <span class="id-derive__key">npub</span>
        <code class="id-derive__value">${B(e.npub)}</code>
      </div>
      <div class="id-derive__row">
        <span class="id-derive__key">nsec</span>
        <code class="id-derive__value id-derive__value--secret${Qf?` id-derive__value--revealed`:``}">${B(e.nsec)}</code>
      </div>
      <div class="id-derive__copy">
        <button class="btn btn--sm" id="id-derive-copy-npub">Copy npub</button>
        <button class="btn btn--sm" id="id-derive-copy-nsec">${Qf?`Copy nsec`:`Reveal + copy nsec`}</button>
      </div>
    </div>
  `}function up(e){let t=e.querySelector(`#id-derive-feedback`);t&&(t.innerHTML=lp())}var dp=`
  .id-hub { max-width: 600px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }

  .id-hub__heading {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 400;
    color: var(--text-bright);
    margin: 0 0 0.25rem;
    letter-spacing: 0.01em;
  }

  .id-hub__sub {
    font-size: 0.75rem;
    color: var(--text-muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
  }

  /* ── Master card ────────────────────────────────── */

  .id-master {
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-left: 3px solid var(--amber-500);
    border-radius: 6px;
    padding: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .id-master__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .id-master__stats {
    font-size: 0.8125rem;
    color: var(--text-secondary);
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .id-master__actions {
    display: flex;
    gap: 0.375rem;
    flex-wrap: wrap;
  }

  .id-master__mnemonic {
    margin-top: 1rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    padding: 0.625rem 0.75rem;
    background: var(--bg-deep);
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text-primary);
    cursor: pointer;
    user-select: none;
    filter: blur(5px);
    transition: filter 0.2s var(--ease-out);
    line-height: 1.6;
    word-spacing: 0.25em;
  }

  .id-master__mnemonic--revealed {
    filter: none;
    user-select: text;
  }

  .id-master__mnemonic-hint {
    font-size: 0.6875rem;
    color: var(--text-muted);
    margin-top: 0.25rem;
    display: block;
  }

  .id-choice {
    margin-top: 1rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg-deep);
    padding: 0.875rem;
    display: grid;
    gap: 0.75rem;
  }

  .id-choice__title {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--text-bright);
  }

  .id-choice__sub {
    margin: 0;
    font-size: 0.75rem;
    line-height: 1.55;
    color: var(--text-secondary);
  }

  .id-choice__grid {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  }

  .id-choice__card {
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg-surface);
    padding: 0.75rem;
    display: grid;
    gap: 0.5rem;
  }

  .id-choice__card-title {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--text-primary);
  }

  .id-choice__list {
    margin: 0;
    padding-left: 1rem;
    font-size: 0.75rem;
    line-height: 1.55;
    color: var(--text-secondary);
  }

  .id-derive {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
    display: grid;
    gap: 0.75rem;
  }

  .id-derive__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .id-derive__title {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-bright);
  }

  .id-derive__sub {
    margin: 0.25rem 0 0;
    font-size: 0.75rem;
    color: var(--text-muted);
    line-height: 1.5;
  }

  .id-derive__actions {
    display: flex;
    gap: 0.375rem;
    flex-wrap: wrap;
  }

  .id-derive__grid {
    display: grid;
    gap: 0.625rem;
    grid-template-columns: 1fr;
  }

  .id-derive__field {
    display: grid;
    gap: 0.25rem;
  }

  .id-derive__label {
    font-size: 0.6875rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .id-derive__hint,
  .id-derive__error {
    font-size: 0.75rem;
    line-height: 1.5;
  }

  .id-derive__hint { color: var(--text-muted); }
  .id-derive__error { color: var(--failed); }

  .id-derive__result {
    background: var(--bg-deep);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.75rem;
    display: grid;
    gap: 0.625rem;
  }

  .id-derive__chain {
    font-size: 0.6875rem;
    color: var(--text-muted);
    word-break: break-word;
  }

  .id-derive__row {
    display: grid;
    gap: 0.25rem;
  }

  .id-derive__key {
    font-size: 0.6875rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .id-derive__value {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-primary);
    word-break: break-all;
  }

  .id-derive__value--secret {
    filter: blur(5px);
    user-select: none;
  }

  .id-derive__value--revealed {
    filter: none;
    user-select: text;
  }

  .id-derive__copy {
    display: flex;
    gap: 0.375rem;
    flex-wrap: wrap;
  }

  /* ── Empty state ────────────────────────────────── */

  .id-empty {
    text-align: center;
    padding: 3rem 1.5rem;
    border: 1px dashed var(--border);
    border-radius: 8px;
    margin-bottom: 1.5rem;
  }

  .id-empty__icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
    opacity: 0.4;
  }

  .id-empty__title {
    font-family: var(--font-display);
    font-size: 1.125rem;
    color: var(--text-primary);
    margin: 0 0 0.5rem;
  }

  .id-empty__text {
    font-size: 0.8125rem;
    color: var(--text-muted);
    line-height: 1.6;
    max-width: 380px;
    margin: 0 auto 1.25rem;
  }

  /* ── Create form ────────────────────────────────── */

  .id-create {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 0.25rem;
  }

  .id-create__error {
    font-size: 0.75rem;
    color: var(--failed);
    min-height: 1.125rem;
  }

  /* ── Section divider ────────────────────────────── */

  .id-divider {
    border: none;
    border-top: 1px solid var(--border);
    margin: 1.5rem 0;
  }

  /* ── Archived ───────────────────────────────────── */

  .id-archived__toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem 0;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    text-align: left;
  }

  .id-archived__toggle:hover { color: var(--text-secondary); }

  .id-archived__list {
    overflow: hidden;
    transition: max-height 0.3s var(--ease-out);
  }

  .id-archived__row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border);
    font-size: 0.8125rem;
  }

  .id-archived__badge {
    width: 1.375rem;
    height: 1.375rem;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.625rem;
    font-weight: 700;
    color: #fff;
    opacity: 0.5;
  }

  .id-archived__name { color: var(--text-muted); }
  .id-archived__npub { color: var(--text-muted); opacity: 0.5; font-size: 0.6875rem; flex: 1; }

  /* ── NIP-07 fallback ────────────────────────────── */

  .id-nip07 { padding: 2rem 1.5rem; }

  .id-nip07__card {
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 1.25rem;
    margin-bottom: 1rem;
  }

  .id-nip07__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .id-nip07__icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: var(--bg-hover);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }

  .id-nip07__why {
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 1.25rem;
  }

  .id-nip07__why h3 {
    font-family: var(--font-display);
    font-size: 0.9375rem;
    margin: 0 0 0.75rem;
    color: var(--text-primary);
  }

  .id-nip07__why p {
    font-size: 0.8125rem;
    color: var(--text-muted);
    line-height: 1.6;
    margin: 0 0 0.625rem;
  }

  .id-nip07__why details {
    font-size: 0.75rem;
    color: var(--text-muted);
    opacity: 0.7;
    margin-top: 0.75rem;
  }

  .id-nip07__why summary { cursor: pointer; }
  .id-nip07__why code { font-family: var(--font-mono); font-size: 0.6875rem; }

  /* ── Detail panel ────────────────────────────────── */

  .id-detail {
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-left: 3px solid var(--amber-500);
    border-radius: 6px;
    padding: 1rem 1.25rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  .id-detail__hint {
    font-size: 0.8125rem;
    color: var(--text-muted);
    text-align: center;
    padding: 1.5rem 0;
  }

  .id-detail__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .persona-card__badge {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .persona-card__breadcrumb {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    color: var(--text-muted);
    padding-top: 0.625rem;
    line-height: 1.4;
  }

  .persona-card__breadcrumb-sep {
    opacity: 0.4;
    margin: 0 0.125rem;
  }

  .persona-card__breadcrumb-current {
    color: var(--text-secondary);
  }

  .persona-card__npub {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    color: var(--text-muted);
    padding: 0.625rem 0;
    word-break: break-all;
  }

  .persona-card__section {
    padding: 0.5rem 0;
  }

  .persona-card__section-title {
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    margin: 0 0 0.5rem;
    font-weight: 600;
  }

  .persona-card__field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 0.5rem;
  }

  .persona-card__field-label {
    font-size: 0.6875rem;
    color: var(--text-muted);
  }

  .persona-card__input {
    font-size: 0.8125rem;
  }

  .persona-card__publish-btn {
    margin-top: 0.375rem;
  }

  .persona-card__relay-default {
    font-size: 0.8125rem;
    color: var(--text-muted);
  }

  .persona-card__customise-link {
    font-size: 0.75rem;
    color: var(--amber-400);
    margin-left: 0.5rem;
    text-decoration: none;
  }

  .persona-card__customise-link:hover {
    text-decoration: underline;
  }

  .persona-card__group-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  .persona-card__group-chip {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    background: var(--bg-deep);
    border: 1px solid var(--border);
    border-radius: 3px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: border-color 0.15s var(--ease-out);
  }

  .persona-card__group-chip:hover {
    border-color: var(--amber-400);
    color: var(--text-primary);
  }

  .persona-card__group-chip-wrap {
    display: inline-flex;
    align-items: center;
    gap: 0;
  }

  .persona-card__group-remove {
    font-size: 0.75rem;
    line-height: 1;
    padding: 0.25rem 0.25rem;
    background: none;
    border: 1px solid var(--border);
    border-left: none;
    border-radius: 0 3px 3px 0;
    color: var(--text-muted);
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s, color 0.15s;
  }

  .persona-card__group-chip-wrap:hover .persona-card__group-remove {
    opacity: 1;
  }

  .persona-card__group-remove:hover {
    color: var(--failed);
  }

  .persona-card__group-chip-wrap .persona-card__group-chip {
    border-radius: 3px 0 0 3px;
  }

  .persona-card__assign-select {
    margin-top: 0.375rem;
  }

  .persona-card__actions {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding-top: 0.75rem;
    flex-wrap: wrap;
  }

  .persona-card__more {
    position: relative;
    margin-left: auto;
  }

  .persona-card__more-btn {
    font-size: 1rem;
    padding: 0.25rem 0.5rem;
  }

  .persona-card__menu {
    position: absolute;
    right: 0;
    top: 100%;
    z-index: 10;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 4px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    min-width: 160px;
    padding: 0.25rem 0;
  }

  .persona-card__menu-item {
    display: block;
    width: 100%;
    padding: 0.5rem 0.75rem;
    text-align: left;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-primary);
    background: none;
    border: none;
    cursor: pointer;
    transition: background 0.1s;
  }

  .persona-card__menu-item:hover {
    background: var(--bg-hover);
  }

  .persona-card__menu-item--danger {
    color: var(--failed);
  }

  .persona-card__qr {
    text-align: center;
    padding: 0.75rem 0;
  }

  .persona-card__qr-label {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.625rem;
    color: var(--text-muted);
    margin-top: 0.375rem;
  }

  .persona-card__meta {
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  /* ── Mobile ─────────────────────────────────────── */

  @media (max-width: 480px) {
    .id-hub { padding: 1rem 0.75rem 2rem; }

    .id-master__row {
      flex-direction: column;
      align-items: flex-start;
    }

    .id-master__actions {
      width: 100%;
    }

    .id-master__actions .btn {
      flex: 1;
      min-width: 0;
      text-align: center;
    }

    .id-create {
      flex-direction: column;
    }

    .id-create .input {
      width: 100%;
    }

    .persona-card__actions {
      flex-direction: column;
      align-items: stretch;
    }

    .persona-card__more {
      margin-left: 0;
    }

    .persona-card__menu {
      position: fixed;
      left: 0.75rem;
      right: 0.75rem;
      bottom: 0.75rem;
      top: auto;
      border-radius: 8px;
    }

    .persona-card__menu-item {
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
    }
  }
`;function fp(){let{identity:e,groups:t}=l(),n=e?.pubkey??``,r=n?`${n.slice(0,8)}\u2026${n.slice(-4)}`:`unknown`,i=Object.keys(t).length;return`
    <div class="id-nip07">
      <div class="id-nip07__card">
        <div class="id-nip07__header">
          <div class="id-nip07__icon">\u{1F511}</div>
          <div>
            <div style="font-weight: 600; font-size: 0.9375rem;">Your Identity</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${B(r)} \u00B7 NIP-07 extension \u00B7 ${i} group${i===1?``:`s`}</div>
          </div>
        </div>
      </div>

      <div class="id-nip07__why">
        <h3>Why can\u2019t I manage personas?</h3>
        <p>Your NIP-07 browser extension keeps your private key secure by never exposing it to apps. This is good security \u2014 but it means canary-kit cannot derive sub-identities from your key.</p>
        <p>Personas, Shamir backup, nsec export, and linkage proofs all require the raw private key for cryptographic derivation. Your extension only allows signing and encryption.</p>
        <p>To use persona features, create a new account with a recovery phrase or import an existing one.</p>
        <details>
          <summary>Technical detail</summary>
          <p style="margin: 0.5rem 0 0; line-height: 1.5;">nsec-tree derives child keys via <code>HMAC-SHA256(master_key, purpose)</code>. NIP-07 extensions expose <code>signEvent()</code> and <code>nip44.encrypt()</code> but not the raw key bytes. A future NIP could add <code>deriveChild(purpose, index)</code> to bridge this gap.</p>
        </details>
      </div>
    </div>
  `}function pp(){let{groups:e,personas:t}=l(),n=Object.values(e);if(n.length===0)return``;let r=new Map;for(let e of n){let t=e.personaId||`(unassigned)`,n=r.get(t)??[];n.push(e),r.set(t,n)}let i=[];for(let[e,n]of r){let r=e===`(unassigned)`,a=(r?null:z(t,e))?.persona,o=a?.archived,s=a?.name??e,c=r?`<span style="color:var(--text-muted);font-style:italic;">unassigned</span>`:`<span${o?` style="opacity:0.5;"`:``}>${B(s)}</span>`,l=n.map(e=>`<button class="persona-card__group-chip" data-navigate-group="${B(e.id)}">${B(e.name)}</button>`).join(` `);i.push(`<div style="display:flex;align-items:baseline;gap:0.5rem;margin-bottom:0.375rem;flex-wrap:wrap;">
      <span style="font-size:0.75rem;min-width:5rem;">${c}</span>${l}
    </div>`)}return`
    <div style="margin-top:0.75rem;padding-top:0.75rem;border-top:1px solid var(--border);">
      <h4 class="persona-card__section-title" style="margin-bottom:0.5rem;">Groups</h4>
      ${i.join(``)}
    </div>
  `}function mp(e){return`
    <div class="id-choice">
      <div>
        <h4 class="id-choice__title">Which path should I choose?</h4>
        <p class="id-choice__sub">Both imported <code>nsec</code> roots and mnemonic-backed roots can derive the full <code>nsec-tree</code> hierarchy. The difference is whether the root itself has phrase/Shamir recovery.</p>
      </div>
      <div class="id-choice__grid">
        <div class="id-choice__card">
          <h5 class="id-choice__card-title">Keep using this nsec-backed root</h5>
          <ul class="id-choice__list">
            <li>Best when this is already your live public identity</li>
            <li>Still derives personas, anonymous accounts, and proofs</li>
            <li>No phrase or Shamir recovery unless you already have the mnemonic elsewhere</li>
          </ul>
        </div>
        <div class="id-choice__card">
          <h5 class="id-choice__card-title">Create or restore a mnemonic-backed root</h5>
          <ul class="id-choice__list">
            <li>Best when you want long-term recovery and backup</li>
            <li>Adds 12-word phrase recovery and Shamir splitting</li>
            <li>${e?`You already have this capability on the current root.`:`Creates a new root or restores an existing mnemonic-backed one; it does not convert the current nsec in place.`}</li>
          </ul>
        </div>
      </div>
    </div>
  `}function hp(){let{identity:e,personas:t,groups:n}=l();if(!e)return``;let r=0,i=0;for(let{persona:e}of De(t))e.archived||(a(e)===`account`?i++:r++);let o=Object.keys(n).length,s=!!e.mnemonic,c=ap(),u=rp(),d=e.privkey?`
    <div class="id-derive">
      <div class="id-derive__header">
        <div>
          <h4 class="id-derive__title">Developer derivation example</h4>
          <p class="id-derive__sub">Enter up to three tree levels plus explicit indices and canary-kit recreates the deterministic child identity, including its <code>npub</code> and <code>nsec</code>.</p>
        </div>
        <div class="id-derive__actions">
          ${c&&c.length<=3?`<button class="btn btn--sm" id="id-derive-use-selected">Use selected persona</button>`:``}
          <button class="btn btn--sm" id="id-derive-clear">Clear</button>
        </div>
      </div>
      <div class="id-derive__grid">
        ${[0,1,2].map(e=>`
          <div class="id-derive__field">
            <span class="id-derive__label">Level ${e+1}</span>
            <div style="display:grid;grid-template-columns:minmax(0,1fr) 5.25rem;gap:0.5rem;align-items:end;">
              <input
                class="input"
                id="id-derive-level-${e+1}"
                data-derive-slot-name="${e}"
                type="text"
                value="${B(Zf[e]?.name??``)}"
                placeholder="${e===0?`personal`:e===1?`team`:`ops`}"
                autocomplete="off"
                spellcheck="false"
              />
              <label style="display:grid;gap:0.25rem;">
                <span class="id-derive__label">Index</span>
                <input
                  class="input"
                  id="id-derive-index-${e+1}"
                  data-derive-slot-index="${e}"
                  type="number"
                  min="0"
                  step="1"
                  value="${String(Zf[e]?.index??0)}"
                  placeholder="0"
                  inputmode="numeric"
                />
              </label>
            </div>
          </div>
        `).join(``)}
      </div>
      <div class="id-derive__hint">
        ${c?`Selected path: <code>${B(c.map(e=>`${e.name}@${e.index??0}`).join(` / `))}</code>${c.length>3?` — this example only exposes the first three tree levels, so fill it manually if you need a deeper path.`:``}`:`Tip: select a persona in the tree, then load it here to show that the same derivation inputs recreate the same identity. Change indices to match rotated personas.`}
      </div>
      <div id="id-derive-feedback">${lp()}</div>
    </div>
  `:`
    <div class="id-derive">
      <div class="id-derive__header">
        <div>
          <h4 class="id-derive__title">Developer derivation example</h4>
          <p class="id-derive__sub">This needs a local key. Browser extensions keep the raw secret hidden, so canary-kit cannot recreate child identities here.</p>
        </div>
      </div>
    </div>
  `;return`
    <div class="id-master">
      <div class="id-master__row">
        <div class="id-master__stats">
          <span>${r} persona${r===1?``:`s`}</span>
          <span>\u00B7</span>
          <span>${i} account${i===1?``:`s`}</span>
          <span>\u00B7</span>
          <span>${o} group${o===1?``:`s`}</span>
          <span>\u00B7</span>
          <span>${s?`Backed up`:`No backup`}</span>
        </div>
        <div class="id-master__actions">
          ${s?`<button class="btn btn--sm" id="id-backup-btn">Backup</button>`:``}
          <button class="btn btn--sm" id="id-shamir-btn"${s?``:` disabled title="Shamir backup requires a mnemonic-backed root"`}>Shamir</button>
          <button class="btn btn--sm" id="id-verify-proof-btn">Verify proof</button>
        </div>
      </div>
      ${s?`
        <div id="id-mnemonic" class="id-master__mnemonic${Kf?` id-master__mnemonic--revealed`:``}">${B(e.mnemonic??``)}</div>
        <span class="id-master__mnemonic-hint">${Kf?`Click to hide`:`Click to reveal recovery phrase`}</span>
      `:`
        <span class="id-master__mnemonic-hint">This root can derive personas and accounts, but it cannot be recovered with a phrase or split with Shamir because no mnemonic is stored.</span>
        <div class="id-master__actions" style="margin-top:0.75rem;">
          <button class="btn btn--sm btn--primary" id="id-create-recovery-root">Create or restore mnemonic-backed root</button>
        </div>
      `}
      <div class="id-derive__hint"><strong>${B(u.label)}.</strong> ${B(u.detail)}</div>
      <div class="id-derive__hint">One root can create many unlinkable personas and exportable nsec accounts. Use proofs only when you want to prove continuity between identities.</div>
      ${mp(s)}
      ${pp()}
      ${d}
    </div>
  `}function gp(e){return e.length===0?``:`<div class="persona-card__breadcrumb">${e.map((t,n)=>{let r=n===e.length-1,i=B(t.name);return r?`<span class="persona-card__breadcrumb-current">${i}</span>`:`<span>${i}</span>`}).join(` <span class="persona-card__breadcrumb-sep">/</span> `)}</div>`}function _p(e){return`
    <div class="persona-card__section">
      <h4 class="persona-card__section-title">Profile</h4>
      <label class="persona-card__field">
        <span class="persona-card__field-label">Display name</span>
        <input class="input persona-card__input" type="text" data-field="displayName"
          value="${B(e.displayName??``)}" placeholder="Display name" />
      </label>
      <label class="persona-card__field">
        <span class="persona-card__field-label">About</span>
        <input class="input persona-card__input" type="text" data-field="about"
          value="${B(e.about??``)}" placeholder="Short bio" />
      </label>
      <label class="persona-card__field">
        <span class="persona-card__field-label">Picture URL</span>
        <input class="input persona-card__input" type="url" data-field="picture"
          value="${B(e.picture??``)}" placeholder="https://..." />
      </label>
      <button class="btn btn--sm btn--primary persona-card__publish-btn" id="id-detail-publish" hidden>
        Publish
      </button>
    </div>
  `}function vp(e){let{settings:t}=l();if(!(e.readRelays&&e.readRelays.length>0||e.writeRelays&&e.writeRelays.length>0)&&!Yf)return`
      <div class="persona-card__section">
        <h4 class="persona-card__section-title">Relays</h4>
        <span class="persona-card__relay-default">Using default relays</span>
        <a href="#" class="persona-card__customise-link" id="id-detail-customise-relays">Customise</a>
      </div>
    `;let n=e.readRelays??t.defaultReadRelays??[],r=e.writeRelays??t.defaultWriteRelays??[];return`
    <div class="persona-card__section">
      <h4 class="persona-card__section-title">Relays</h4>
      <label class="persona-card__field">
        <span class="persona-card__field-label">Read relays</span>
        <input class="input persona-card__input" type="text" data-relay-field="read"
          value="${B(n.join(`, `))}" placeholder="wss://relay.example.com" />
      </label>
      <label class="persona-card__field">
        <span class="persona-card__field-label">Write relays</span>
        <input class="input persona-card__input" type="text" data-relay-field="write"
          value="${B(r.join(`, `))}" placeholder="wss://relay.example.com" />
      </label>
      <button class="btn btn--sm btn--primary" id="id-detail-save-relays">Save relays</button>
    </div>
  `}function yp(e){let{groups:t,personas:n}=l(),r=Object.values(t),i=r.filter(t=>t.personaId===e.id),a=r.filter(t=>t.personaId!==e.id),o=i.map(e=>`
    <span class="persona-card__group-chip-wrap">
      <button class="persona-card__group-chip" data-navigate-group="${B(e.id)}">${B(e.name)}</button>
      <button class="persona-card__group-remove" data-unassign-group="${B(e.id)}"
        title="Unassign from this persona" aria-label="Unassign ${B(e.name)}">\u00D7</button>
    </span>
  `).join(``);function s(e){if(!e.personaId)return``;for(let{persona:t}of De(n))if(t.id===e.personaId)return t.name;return``}let c=a.length>0?`<select class="input persona-card__assign-select" id="id-detail-assign" style="font-size:0.75rem;padding:0.25rem 0.375rem;">
        <option value="">+ Assign group\u2026</option>
        ${a.map(e=>{let t=s(e),n=t?` (${B(t)})`:``;return`<option value="${B(e.id)}">${B(e.name)}${n}</option>`}).join(``)}
      </select>`:``;return`
    <div class="persona-card__section">
      <h4 class="persona-card__section-title">Groups</h4>
      ${i.length>0?`<div class="persona-card__group-chips">${o}</div>`:`<span class="persona-card__meta">No groups assigned</span>`}
      ${c}
    </div>
  `}function bp(e){let t=np(e);return`
    <div class="persona-card__actions">
      <button class="btn btn--sm" id="id-detail-export">Export nsec</button>
      <div class="persona-card__more">
        <button class="btn btn--sm persona-card__more-btn" id="id-detail-menu-btn"
          aria-label="More actions" title="More actions">\u22EF</button>
        ${qf?`
          <div class="persona-card__menu" id="id-detail-menu-panel">
            <button class="persona-card__menu-item" id="id-detail-copy-npub">Copy npub</button>
            <button class="persona-card__menu-item" id="id-detail-show-qr">
              ${Jf?`Hide QR`:`Show QR`}
            </button>
            <button class="persona-card__menu-item" id="id-detail-rotate">Rotate ${t}</button>
            <button class="persona-card__menu-item" id="id-detail-prove">Prove continuity</button>
            <button class="persona-card__menu-item persona-card__menu-item--danger" id="id-detail-archive">Archive ${t}</button>
          </div>
        `:``}
      </div>
    </div>
    ${Jf?`
      <div class="persona-card__qr">
        ${Mu(e.npub,3)}
        <span class="persona-card__qr-label">${B($f(e.npub))}</span>
      </div>
    `:``}
  `}function xp(){let{personas:e}=l(),t=[...De(e)].filter(({persona:e})=>!e.archived);if(t.length>0?$&&t.some(({persona:e})=>e.id===$)||($=t[0].persona.id):$=null,!$)return`
      <div class="id-detail" id="id-detail">
        <div class="id-detail__hint">Select a persona or account from the tree above</div>
      </div>
    `;let n=z(e,$);if(!n)return`
      <div class="id-detail" id="id-detail">
        <div class="id-detail__hint">Select a persona or account from the tree above</div>
      </div>
    `;let{persona:i,ancestors:a}=n,o=Cs(i.name),s=B(i.name.slice(0,1).toUpperCase()),c=r(i),u=tp(i);return`
    <div class="id-detail" id="id-detail" data-detail-persona-id="${B(i.id)}">
      <div class="id-detail__header">
        <span class="persona-card__badge" style="background-color:${o}">${s}</span>
        <div>
          <div style="font-weight:600;font-size:0.9375rem;color:var(--text-primary);">${B(i.name)}</div>
          ${i.displayName?`<div style="font-size:0.8125rem;color:var(--text-secondary);">${B(i.displayName)}</div>`:``}
        </div>
      </div>
      <div class="id-derive__hint"><strong>${B(c)}.</strong> ${B(u)}</div>
      ${gp([...a,i])}
      <div class="persona-card__npub">${B(i.npub)}</div>
      ${_p(i)}
      ${vp(i)}
      ${yp(i)}
      ${bp(i)}
    </div>
  `}function Sp(){return`
    <div class="id-create">
      <input class="input" type="text" id="id-new-name" placeholder="persona or account name" maxlength="32" autocomplete="off" style="flex: 1; min-width: 0;" />
      <select class="input" id="id-new-type" style="max-width: 10rem;">
        <option value="persona">Persona</option>
        <option value="account">Anonymous account</option>
      </select>
      <button class="btn btn--primary btn--sm" id="id-create-btn">+ Create</button>
    </div>
    <div class="id-derive__hint">Personas are reusable branches. Anonymous accounts are standalone exportable nsec identities, unlinkable by default.</div>
    <div class="id-create__error" id="id-create-error"></div>
  `}function Cp(){let{personas:e}=l(),t=[...De(e)].filter(({persona:e})=>e.archived).map(({persona:e})=>e);if(t.length===0)return``;let n=t.map(e=>`
      <div class="id-archived__row">
        <span class="id-archived__badge" style="background: var(--text-muted);">${B(e.name.slice(0,1).toUpperCase())}</span>
        <span class="id-archived__name">${B(e.name)}</span>
        <span class="id-archived__npub">${B($f(e.npub))}</span>
        <button class="btn btn--sm" data-restore-persona="${B(e.id)}">Restore</button>
      </div>
    `).join(``);return`
    <hr class="id-divider" />
    <div>
      <button class="id-archived__toggle" id="id-archived-toggle">
        <span>${Gf?`▼`:`▶`}</span>
        <span>Archived (${t.length})</span>
      </button>
      <div class="id-archived__list" id="id-archived-list" style="max-height: ${Gf?`1000px`:`0`};">
        ${n}
      </div>
    </div>
  `}function wp(e){Xf?.abort(),Xf=new AbortController;let{signal:t}=Xf;if(e.textContent=``,!document.getElementById(`id-hub-styles`)){let e=document.createElement(`style`);e.id=`id-hub-styles`,e.textContent=dp,document.head.appendChild(e)}if(!Ee()){let t=document.createElement(`div`);t.className=`id-hub`,t.innerHTML=fp(),e.appendChild(t);return}let n=document.createElement(`div`);n.className=`id-hub`,n.innerHTML=[`<h1 class="id-hub__heading">Identities</h1>`,`<div class="id-hub__sub">Derived from your master key</div>`,hp(),Vf($),xp(),Sp(),Cp()].join(``),e.appendChild(n),Hf(e),document.addEventListener(`canary:select-persona`,(t=>{let{personaId:n}=t.detail;n!==$&&($=n,qf=!1,Jf=!1,Yf=!1,wp(e))}),{signal:t});let i=e.querySelector(`#id-backup-btn`),a=e.querySelector(`#id-mnemonic`),o=a?.nextElementSibling;function c(){a&&(Kf=!Kf,a.classList.toggle(`id-master__mnemonic--revealed`,Kf),o&&(o.textContent=Kf?`Click to hide`:`Click to reveal recovery phrase`))}i?.addEventListener(`click`,c,{signal:t}),a?.addEventListener(`click`,c,{signal:t}),e.querySelector(`#id-shamir-btn`)?.addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:shamir-split`,{bubbles:!0}))},{signal:t}),e.querySelector(`#id-verify-proof-btn`)?.addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:verify-proof`,{bubbles:!0}))},{signal:t}),e.querySelector(`#id-create-recovery-root`)?.addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:open-recovery-root-modal`,{bubbles:!0}))},{signal:t}),e.querySelectorAll(`[data-derive-slot-name]`).forEach(n=>{n.addEventListener(`input`,()=>{let t=Number(n.dataset.deriveSlotName);Zf[t]={...Zf[t],name:n.value},Qf=!1,up(e)},{signal:t})}),e.querySelectorAll(`[data-derive-slot-index]`).forEach(n=>{n.addEventListener(`input`,()=>{let t=Number(n.dataset.deriveSlotIndex),r=n.value.trim(),i=r===``?0:Number(r);Zf[t]={...Zf[t],index:i},Qf=!1,up(e)},{signal:t})}),e.querySelector(`#id-derive-clear`)?.addEventListener(`click`,()=>{op([]),wp(e)},{signal:t}),e.querySelector(`#id-derive-use-selected`)?.addEventListener(`click`,()=>{let t=ap();t&&(op(t),wp(e))},{signal:t}),e.querySelector(`#id-derive-copy-npub`)?.addEventListener(`click`,()=>{let e=cp();!e||`error`in e||navigator.clipboard.writeText(e.npub).then(()=>{G(`npub copied`,`success`)}).catch(()=>{})},{signal:t}),e.querySelector(`#id-derive-copy-nsec`)?.addEventListener(`click`,()=>{let t=cp();!t||`error`in t||(Qf=!0,navigator.clipboard.writeText(t.nsec).then(()=>{G(`nsec copied`,`success`),up(e)}).catch(()=>{up(e)}))},{signal:t});let d=e.querySelector(`#id-detail`);if(d&&$){let n=$;d.addEventListener(`input`,e=>{if(!e.target.dataset.field)return;let{personas:t}=l(),r=z(t,n);if(!r)return;let i=d.querySelector(`#id-detail-publish`);i&&(i.hidden=!ip(r.persona,d))},{signal:t}),d.querySelector(`#id-detail-publish`)?.addEventListener(`click`,()=>{let{personas:e}=l(),t=z(e,n);if(!t)return;let r=d.querySelector(`[data-field="displayName"]`),i=d.querySelector(`[data-field="about"]`),a=d.querySelector(`[data-field="picture"]`);s({personas:Ep(e,n,{...t.persona,displayName:r?.value||void 0,about:i?.value||void 0,picture:a?.value||void 0})}),G(`Profile saved for "${t.persona.name}"`,`success`)},{signal:t}),d.querySelector(`#id-detail-customise-relays`)?.addEventListener(`click`,t=>{t.preventDefault(),Yf=!0,wp(e)},{signal:t}),d.querySelector(`#id-detail-save-relays`)?.addEventListener(`click`,()=>{let e=d.querySelector(`[data-relay-field="read"]`),t=d.querySelector(`[data-relay-field="write"]`),r=(e?.value??``).split(`,`).map(e=>e.trim()).filter(Boolean),i=(t?.value??``).split(`,`).map(e=>e.trim()).filter(Boolean),{personas:a}=l(),o=z(a,n);o&&(s({personas:Ep(a,n,{...o.persona,readRelays:r,writeRelays:i})}),Yf=!1,G(`Relays saved for "${o.persona.name}"`,`success`))},{signal:t}),d.addEventListener(`click`,t=>{let n=t.target.closest(`[data-navigate-group]`);if(n){let e=n.dataset.navigateGroup;s({view:`groups`,activeGroupId:e});return}let r=t.target.closest(`[data-unassign-group]`);if(r){t.stopPropagation();let e=r.dataset.unassignGroup,{groups:n}=l(),i=n[e];if(!i)return;u(e,{personaId:``}),G(`"${i.name}" unassigned`,`info`);return}if(qf){let n=t.target.closest(`#id-detail-menu-panel`),r=t.target.closest(`#id-detail-menu-btn`);!n&&!r&&(qf=!1,wp(e))}},{signal:t}),d.querySelector(`#id-detail-assign`)?.addEventListener(`change`,e=>{let t=e.target,r=t.value;if(!r)return;let{groups:i,personas:a}=l(),o=i[r];if(!o)return;u(r,{personaId:n});let s=z(a,n);G(`"${o.name}" assigned to ${s?.persona.name??n}`,`success`),t.value=``},{signal:t}),d.querySelector(`#id-detail-export`)?.addEventListener(`click`,()=>{let{personas:t}=l();z(t,n)&&e.dispatchEvent(new CustomEvent(`canary:export-persona`,{bubbles:!0,detail:{personaId:n}}))},{signal:t}),d.querySelector(`#id-detail-menu-btn`)?.addEventListener(`click`,()=>{qf=!qf,wp(e)},{signal:t}),d.querySelector(`#id-detail-copy-npub`)?.addEventListener(`click`,()=>{let{personas:t}=l(),r=z(t,n);r&&(navigator.clipboard.writeText(r.persona.npub).then(()=>{G(`npub copied`,`success`)}).catch(()=>{}),qf=!1,wp(e))},{signal:t}),d.querySelector(`#id-detail-show-qr`)?.addEventListener(`click`,()=>{Jf=!Jf,qf=!1,wp(e)},{signal:t}),d.querySelector(`#id-detail-rotate`)?.addEventListener(`click`,()=>{let{personas:t}=l();z(t,n)&&(qf=!1,e.dispatchEvent(new CustomEvent(`canary:rotate-persona`,{bubbles:!0,detail:{personaId:n}})))},{signal:t}),d.querySelector(`#id-detail-prove`)?.addEventListener(`click`,()=>{let{personas:t}=l();z(t,n)&&(qf=!1,e.dispatchEvent(new CustomEvent(`canary:prove-ownership`,{bubbles:!0,detail:{personaId:n}})))},{signal:t}),d.querySelector(`#id-detail-archive`)?.addEventListener(`click`,()=>{let{personas:t}=l();z(t,n)&&(qf=!1,e.dispatchEvent(new CustomEvent(`canary:archive-persona`,{bubbles:!0,detail:{personaId:n}})))},{signal:t})}e.querySelector(`.id-master`)?.addEventListener(`click`,e=>{let t=e.target.closest(`[data-navigate-group]`);if(t){let e=t.dataset.navigateGroup;s({view:`groups`,activeGroupId:e})}},{signal:t});let f=e.querySelector(`#id-new-name`),p=e.querySelector(`#id-new-type`),m=e.querySelector(`#id-create-btn`),h=e.querySelector(`#id-create-error`);function g(){if(!f||!h)return;let e=f.value.trim();if(!ep(e)){h.textContent=`Lowercase, no spaces, max 32 characters.`;return}let{personas:t}=l();if(Object.values(t).some(t=>t.name===e)){h.textContent=`That name is already taken.`;return}try{let n=Se(e,p?.value===`account`?`account`:`persona`);s({personas:{...t,[n.id]:n}}),f.value=``,p&&(p.value=`persona`),h.textContent=``,$=n.id,qf=!1,Jf=!1,Yf=!1,G(`${r(n)} "${n.name}" created`,`success`)}catch(e){h.textContent=e instanceof Error?e.message:`Failed to create item.`}}m?.addEventListener(`click`,g,{signal:t}),f?.addEventListener(`keydown`,e=>{e.key===`Enter`&&g()},{signal:t});let _=e.querySelector(`#id-archived-toggle`),v=e.querySelector(`#id-archived-list`);_&&v&&_.addEventListener(`click`,()=>{Gf=!Gf,v.style.maxHeight=Gf?v.scrollHeight+`px`:`0`;let e=_.querySelector(`span`);e&&(e.textContent=Gf?`▼`:`▶`)},{signal:t}),e.addEventListener(`click`,e=>{let t=e.target.closest(`[data-restore-persona]`);if(!t)return;let n=t.dataset.restorePersona,{personas:r}=l();z(r,n)&&s({personas:Tp(r,n,!1)})},{signal:t})}function Tp(e,t,n){let r={};for(let[i,a]of Object.entries(e))i===t?r[i]={...a,archived:n}:a.children&&Object.keys(a.children).length>0?r[i]={...a,children:Tp(a.children,t,n)}:r[i]=a;return r}function Ep(e,t,n){let r={};for(let[i,a]of Object.entries(e))i===t?r[i]=n:a.children&&Object.keys(a.children).length>0?r[i]={...a,children:Ep(a.children,t,n)}:r[i]=a;return r}var Dp=null;function Op(e,t){let n=l().groups[t];if(!n)return e.slice(0,8);let{identity:r}=l();return r?.pubkey===e?`You`:n.memberNames?.[e]||`${e.slice(0,8)}\u2026${e.slice(-4)}`}function kp(e,t){Dp&&=(Dp(),null),document.querySelector(`.call-verify`)?.remove();let{groups:n,identity:r}=l(),i=n[e];if(!i||!r)return;let a=r.pubkey,o=Op(t,e),s=Qu(t),c=a<t?[a,t]:[t,a],u=Cf({secret:i.seed,namespace:`canary:call`,roles:c,myRole:a,preset:`call`}),d=Sf.call.rotationSeconds,f=Math.floor(Date.now()/1e3),p=u.myToken(f),m=u.theirToken(f),h=document.createElement(`div`);h.className=`call-verify`,h.innerHTML=`
    <div class="call-verify__content">
      ${s?.picture?`<img class="call-verify__avatar" src="${B(s.picture)}" alt="" />`:``}
      <h2 class="call-verify__title">Call with ${B(o)}</h2>
      <p class="call-verify__instruction">Speak your word. Listen for theirs. If it matches, the call is verified.</p>

      <div class="call-verify__section call-verify__section--say">
        <span class="call-verify__label">Say this:</span>
        <span class="call-verify__word call-verify__word--mine" id="cv-word-mine">${B(p)}</span>
      </div>

      <div class="call-verify__divider"></div>

      <div class="call-verify__section call-verify__section--hear">
        <span class="call-verify__label">They should say:</span>
        <span class="call-verify__word call-verify__word--theirs" id="cv-word-theirs">${B(m)}</span>
      </div>

      <p class="call-verify__timer">Words change in <span id="cv-countdown">${d}</span>s</p>

      <p class="call-verify__instruction" style="margin-top: 1.5rem; font-size: 0.75rem;">In a real call, if they say the wrong word, it could be an emergency signal. A production app would automatically check and silently alert the group.</p>
      <div class="call-verify__actions">
        <button class="btn btn--primary call-verify__btn" id="cv-match">Match</button>
        <button class="btn call-verify__btn call-verify__btn--danger" id="cv-mismatch">Wrong Word</button>
        <button class="btn call-verify__btn" id="cv-close">Close</button>
      </div>
    </div>
  `;let g=null;function _(){let e=Math.floor(Date.now()/1e3),t=h.querySelector(`#cv-word-mine`),n=h.querySelector(`#cv-word-theirs`),r=h.querySelector(`#cv-countdown`);if(t&&(t.textContent=u.myToken(e)),n&&(n.textContent=u.theirToken(e)),r){let t=e%d;r.textContent=String(d-t)}}g=setInterval(_,1e3);function v(){g!==null&&(clearInterval(g),g=null)}function y(){Dp&&=(Dp(),null),h.classList.remove(`call-verify--visible`),setTimeout(()=>h.remove(),300)}function ee(e){e.key===`Escape`&&y()}Dp=()=>{v(),document.removeEventListener(`keydown`,ee)},document.body.appendChild(h),requestAnimationFrame(()=>h.classList.add(`call-verify--visible`)),document.addEventListener(`keydown`,ee),h.querySelector(`#cv-match`)?.addEventListener(`click`,()=>{v(),h.innerHTML=`
      <div class="call-verify__content">
        <h2 class="call-verify__title" style="color: var(--clr-success, #27ae60);">Call Verified</h2>
        <p class="call-verify__warning" style="color: var(--text-secondary);">${B(o)} is who they say they are. The call is authenticated.</p>
        <div class="call-verify__actions">
          <button class="btn btn--primary call-verify__btn" id="cv-dismiss-ok">Done</button>
        </div>
      </div>
    `,h.querySelector(`#cv-dismiss-ok`)?.addEventListener(`click`,y)}),h.querySelector(`#cv-close`)?.addEventListener(`click`,y),h.querySelector(`#cv-mismatch`)?.addEventListener(`click`,()=>{v(),h.innerHTML=`
      <div class="call-verify__content">
        <h2 class="call-verify__title" style="color: var(--clr-danger, #e74c3c);">Verification Failed</h2>
        <p class="call-verify__warning">The word didn't match. This person may not be who they claim to be.</p>
        <div class="call-verify__actions">
          <button class="btn call-verify__btn" id="cv-dismiss-fail">Dismiss</button>
        </div>
      </div>
    `,h.querySelector(`#cv-dismiss-fail`)?.addEventListener(`click`,y)})}var Ap=Ie({VAULT_D_TAG:()=>Mp,VAULT_KIND:()=>jp,buildVaultEvent:()=>zp,decryptVault:()=>Rp,deserialiseVault:()=>Ip,encryptVault:()=>Lp,fetchVault:()=>Vp,fetchVaultNip07:()=>Wp,mergeVaultGroups:()=>Yp,publishVault:()=>Bp,publishVaultNip07:()=>Up,serialiseVault:()=>Fp,subscribeToVault:()=>qp,unsubscribeFromVault:()=>Jp}),jp=30078,Mp=`canary:vault`,Np=2160*60*60;function Pp(e){let t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function Fp(e,t={},n=[]){let r={};for(let[t,n]of Object.entries(e)){let{lastPositions:e,...i}=n;r[t]={...i,livenessCheckins:{}}}return JSON.stringify({version:3,groups:r,personas:t,deletedGroupIds:n})}function Ip(e){try{let t=JSON.parse(e);if(!t||typeof t!=`object`||typeof t.groups!=`object`||t.groups===null)return{groups:{},personas:{},deletedGroupIds:[]};if(t.version===3)return{groups:t.groups,personas:t.personas&&typeof t.personas==`object`&&!Array.isArray(t.personas)?t.personas:{},deletedGroupIds:Array.isArray(t.deletedGroupIds)?t.deletedGroupIds:[]};console.info(`[canary:vault] Migrating vault from version`,t.version??1,`to v3`);let n=t.groups;for(let e of Object.values(n))!e.personaName&&!e.personaId&&(e.personaName=`personal`);let r=Array.isArray(t.personas)?t.personas:[],i={},a={};for(let e of r){let t=Oe();a[e.name]=t,i[t]={...e,id:t,children:{}}}for(let e of Object.values(n)){let t=e.personaName??`personal`;if(!a[t]){let e=Oe();a[t]=e,i[e]={name:t,id:e,index:0,npub:``,children:{}}}e.personaId||(e.personaId=a[t],delete e.personaName)}return{groups:n,personas:i,deletedGroupIds:Array.isArray(t.deletedGroupIds)?t.deletedGroupIds:[]}}catch{return{groups:{},personas:{},deletedGroupIds:[]}}}function Lp(e,t,n){return Qi(e,Ui(Pp(t),n))}function Rp(e,t,n){try{return $i(e,Ui(Pp(t),n))}catch{return null}}function zp(e,t){let n=Pp(t),r=Math.floor(Date.now()/1e3);return ai({kind:jp,created_at:r,tags:[[`d`,Mp],[`expiration`,String(r+Np)]],content:e},n)}async function Bp(e,t,n,r={},i=[]){let a=R();if(!a)throw Error(`No relay pool — connect first`);let o=pe();if(o.length===0)throw Error(`No write relays configured`);let s=zp(Lp(Fp(e,r,i),t,n),t);console.info(`[canary:vault] Publishing vault (${Object.keys(e).length} groups) to`,o),document.dispatchEvent(new CustomEvent(`canary:vault-syncing`));let c=await Promise.allSettled(a.publish(o,s)),l=c.filter(e=>e.status===`fulfilled`).length,u=c.filter(e=>e.status===`rejected`).length;console.info(`[canary:vault] Publish results: ${l} OK, ${u} failed`),u>0&&c.forEach((e,t)=>{e.status===`rejected`&&console.warn(`[canary:vault] Relay ${o[t]} rejected:`,e.reason)}),document.dispatchEvent(new CustomEvent(`canary:vault-synced`,{detail:{timestamp:Math.floor(Date.now()/1e3)}}))}async function Vp(e,t){let n=R();if(!n)return console.warn(`[canary:vault] fetchVault: no pool`),null;let r=ue();return r.length===0?(console.warn(`[canary:vault] fetchVault: no read relays`),null):(console.info(`[canary:vault] Fetching vault from`,r,`for`,t.slice(0,8)),new Promise(i=>{let a=!1,o=null,s=setTimeout(()=>{if(!a){if(a=!0,c.close(),console.warn(`[canary:vault] fetchVault timed out after 10s`),o){let n=Rp(o.content,e,t);if(n){let e=Ip(n);if(Object.keys(e.groups).length>0){i(e);return}}}i(null)}},1e4),c=n.subscribeMany(r,{kinds:[jp],authors:[t],"#d":[Mp],limit:1},{onevent(e){oi(e)&&(typeof e.content==`string`&&e.content.length>262144||(console.info(`[canary:vault] Received vault event created_at=${e.created_at}`),(!o||e.created_at>o.created_at)&&(o=e)))},oneose(){if(!a){if(a=!0,clearTimeout(s),c.close(),o){console.info(`[canary:vault] EOSE — decrypting vault event`);let n=Rp(o.content,e,t);if(n){let e=Ip(n);if(Object.keys(e.groups).length>0){i(e);return}}console.warn(`[canary:vault] Vault decryption failed`)}else console.info(`[canary:vault] EOSE — no vault event found`);i(null)}}})}))}function Hp(){return!!window.nostr?.nip44?.encrypt&&!!window.nostr?.nip44?.decrypt}async function Up(e,t,n={},r=[]){let i=R();if(!i)throw Error(`No relay pool — connect first`);if(!Hp())throw Error(`NIP-07 extension does not support NIP-44`);let a=pe();if(a.length===0)throw Error(`No write relays configured`);let o=Fp(e,n,r),s=await window.nostr.nip44.encrypt(t,o),c=Math.floor(Date.now()/1e3),l={kind:jp,created_at:c,tags:[[`d`,Mp],[`expiration`,String(c+Np)]],content:s},u=await window.nostr.signEvent(l);console.info(`[canary:vault] Publishing vault via NIP-07 (${Object.keys(e).length} groups) to`,a),document.dispatchEvent(new CustomEvent(`canary:vault-syncing`));let d=await Promise.allSettled(i.publish(a,u)),f=d.filter(e=>e.status===`fulfilled`).length,p=d.filter(e=>e.status===`rejected`).length;console.info(`[canary:vault] NIP-07 publish results: ${f} OK, ${p} failed`),document.dispatchEvent(new CustomEvent(`canary:vault-synced`,{detail:{timestamp:c}}))}async function Wp(e){let t=R();if(!t)return console.warn(`[canary:vault] fetchVaultNip07: no pool`),null;if(!Hp())return console.warn(`[canary:vault] fetchVaultNip07: extension lacks NIP-44`),null;let n=ue();return n.length===0?(console.warn(`[canary:vault] fetchVaultNip07: no read relays`),null):(console.info(`[canary:vault] Fetching vault via NIP-07 from`,n,`for`,e.slice(0,8)),new Promise(r=>{let i=!1,a=null,o=setTimeout(async()=>{if(!i){if(i=!0,s.close(),console.warn(`[canary:vault] fetchVaultNip07 timed out after 10s`),a)try{let t=Ip(await window.nostr.nip44.decrypt(e,a.content));if(Object.keys(t.groups).length>0){r(t);return}}catch{}r(null)}},1e4),s=t.subscribeMany(n,{kinds:[jp],authors:[e],"#d":[Mp],limit:1},{onevent(e){oi(e)&&(typeof e.content==`string`&&e.content.length>262144||(console.info(`[canary:vault] NIP-07 received vault event created_at=${e.created_at}`),(!a||e.created_at>a.created_at)&&(a=e)))},async oneose(){if(!i){if(i=!0,clearTimeout(o),s.close(),a){console.info(`[canary:vault] NIP-07 EOSE — decrypting vault event`);try{let t=Ip(await window.nostr.nip44.decrypt(e,a.content));if(Object.keys(t.groups).length>0){r(t);return}}catch(e){console.warn(`[canary:vault] NIP-07 vault decryption failed:`,e)}}else console.info(`[canary:vault] NIP-07 EOSE — no vault event found`);r(null)}}})}))}var Gp=null,Kp=0;function qp(e,t,n){Jp();let r=R();if(!r)return;let i=ue();if(i.length===0)return;Kp=Math.floor(Date.now()/1e3),console.info(`[canary:vault] Subscribing to live vault updates for`,e.slice(0,8));let a=r.subscribeMany(i,{kinds:[jp],authors:[e],"#d":[Mp],since:Kp},{async onevent(e){if(oi(e)&&!(e.created_at<=Kp)&&!(typeof e.content==`string`&&e.content.length>262144)){console.info(`[canary:vault] Live vault update received created_at=${e.created_at}`),Kp=e.created_at;try{let r=await t(e.content);if(!r)return;let{groups:i,personas:a}=Ip(r);if(Object.keys(i).length===0)return;n(i,Object.keys(i).length,a)}catch(e){console.warn(`[canary:vault] Live vault decrypt failed:`,e)}}},oneose(){console.info(`[canary:vault] Live vault subscription EOSE — watching for updates`)}});Gp=()=>a.close()}function Jp(){Gp?.(),Gp=null}function Yp(e,t,n=[]){let r={...e},i=new Set(n);for(let[n,a]of Object.entries(t)){if(i.has(n))continue;let t=e[n];if(!t){r[n]=a;continue}let o=t.epoch??0,s=a.epoch??0;if(s>o)r[n]=a;else if(s===o){let e=t.counter??0;(a.counter??0)>e&&(r[n]=a)}}return r}function Xp(e){if(e.startsWith(`wss://`))return!0;if(e.startsWith(`ws://`))try{let t=new URL(e);return t.hostname===`localhost`||t.hostname===`127.0.0.1`||t.hostname===`[::1]`}catch{return!1}return!1}function Zp(e,t){return t?.pubkey===e.pubkey&&t.mnemonic?{...e,mnemonic:t.mnemonic}:e}function Qp(e,t){return e?typeof t.epoch==`number`&&t.epoch<e.epoch?`This invite is older than the group state already stored on this device.`:typeof t.latestInviteIssuedAt==`number`&&e.latestInviteIssuedAt>0&&t.latestInviteIssuedAt<e.latestInviteIssuedAt?`A newer invite has already been accepted for this group on this device.`:typeof t.epoch==`number`&&t.epoch===e.epoch&&typeof t.counter==`number`&&t.counter<e.counter?`This invite would roll the group back to an older counter.`:null:null}Gr(),Rr().theme===`light`?document.documentElement.setAttribute(`data-theme`,`light`):document.documentElement.removeAttribute(`data-theme`);var $p=null;function em(){$p!==null&&(clearTimeout($p),$p=null);let{settings:e}=l();!e.pinEnabled||e.autoLockMinutes<=0||!Lr()||($p=setTimeout(async()=>{await Kr(),be(),lr(),f(),rm()},e.autoLockMinutes*60*1e3))}function tm(){document.addEventListener(`pointerdown`,em,{passive:!0}),document.addEventListener(`keydown`,em,{passive:!0}),em()}function nm(){document.removeEventListener(`pointerdown`,em),document.removeEventListener(`keydown`,em),$p!==null&&(clearTimeout($p),$p=null)}function rm(){nm(),ps();let e=document.getElementById(`app`);e.innerHTML=`
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
  `;let t=document.getElementById(`pin-input`),n=document.getElementById(`pin-error`),r=document.getElementById(`pin-submit`),i=0,a=[0,1e3,2e3,5e3,15e3,3e4];async function o(){let e=t.value.trim();if(e.length<6){n.textContent=`PIN must be at least 6 digits.`,n.hidden=!1,t.focus();return}r.disabled=!0,r.textContent=`Unlocking…`,n.hidden=!0;try{await zr(e),await gm();{let{identity:e,personas:t}=l();e?.privkey&&(Object.keys(t).length>0?xe(e,t):ye(e))}im();let t=document.getElementById(`header`);t&&Is(t),am(),cm(),c(sm),tm(),hm(),um(),window.addEventListener(`hashchange`,()=>um()),vm(),sd().catch(()=>{})}catch{i++;let e=a[Math.min(i,a.length-1)];n.textContent=e>0?`Incorrect PIN. Wait ${e/1e3}s before retrying.`:`Incorrect PIN. Try again.`,n.hidden=!1,t.value=``,r.disabled=!0,r.textContent=`Unlock`,e>0?setTimeout(()=>{r.disabled=!1,t.focus()},e):(r.disabled=!1,t.focus())}}r.addEventListener(`click`,()=>{o()}),t.addEventListener(`keydown`,e=>{e.key===`Enter`&&o()}),requestAnimationFrame(()=>t.focus())}function im(){let e=document.getElementById(`app`);if(!e)throw Error(`Missing #app mount point`);e.innerHTML=`
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

    <div id="identities-view" style="display:none"></div>

    <footer class="app-footer" id="app-footer">
      <button class="app-footer__sync" id="footer-sync-btn">Sync Groups</button>
      <span class="app-footer__sep">&middot;</span>
      <span class="app-footer__version">CANARY v2.7.3</span>
    </footer>
  `}function am(){let e=document.getElementById(`hamburger`),t=document.getElementById(`sidebar`),n=document.getElementById(`sidebar-overlay`);if(!e||!t||!n)return;function r(){t.classList.add(`sidebar--open`),n.classList.add(`sidebar-overlay--visible`),e.setAttribute(`aria-expanded`,`true`)}function i(){t.classList.remove(`sidebar--open`),n.classList.remove(`sidebar-overlay--visible`),e.setAttribute(`aria-expanded`,`false`)}e.setAttribute(`aria-expanded`,`false`),e.addEventListener(`click`,()=>{t.classList.contains(`sidebar--open`)?i():r()}),n.addEventListener(`click`,()=>{i()}),t.addEventListener(`click`,e=>{e.target.closest(`[data-group-id]`)&&i()})}var om=!1;function sm(){om||(om=!0,requestAnimationFrame(()=>{om=!1,cm()}))}function cm(){let{view:t}=l(),n=document.getElementById(`groups-view`),r=document.getElementById(`call-demo-view`),i=document.getElementById(`identities-view`);n&&(n.hidden=t!==`groups`),r&&(r.hidden=t!==`call-demo`),i&&(i.style.display=t===`identities`?``:`none`);let a=document.getElementById(`header`);if(a&&Is(a),t===`groups`){If();let t=document.getElementById(`welcome-container`);t&&xc(t);let n=document.getElementById(`sidebar`);n&&qs(n);let r=document.getElementById(`hero-container`);r&&zc(r);let i=document.getElementById(`verify-container`);i&&Qc(i);let a=document.getElementById(`members-container`);a&&gd(a);let o=l().groups[l().activeGroupId??``],s=o?e(o)===`online`:!1,c=document.getElementById(`beacon-container`);c&&(s?(c.hidden=!1,Kd(c)):(sf(),c.hidden=!0,c.innerHTML=``));let u=document.getElementById(`liveness-container`);u&&(s?(u.hidden=!1,ff(u)):(u.hidden=!0,u.innerHTML=``));let d=document.getElementById(`settings-container`);d&&gf(d)}else if(t===`call-demo`){let e=document.getElementById(`call-simulation-container`);e&&Ff(e)}else if(t===`identities`){If();let e=document.getElementById(`identities-view`);e&&wp(e)}}function lm(){let{identity:t,personas:n,activePersonaId:r}=l(),a=t?.displayName&&t.displayName!==`You`?t.displayName:``,o=Object.values(n),s=o.length>0?o.map(e=>{let t=e.id===r?` selected`:``;return`<option value="${B(e.id)}"${t}>${B(e.name)}</option>`}).join(``):`<option value="">—</option>`;Ys(`
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
    ${a?``:`
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
    <label class="input-label" style="margin-top: 0.5rem;">
      <span>Persona</span>
      <select class="input" name="persona">${s}</select>
    </label>
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
  `,n=>{let r=n.get(`name`)?.trim()??``;if(!r)return;let o=a||n.get(`myname`)?.trim()||``,s=n.get(`persona`)?.trim()||``,c=fc(r,document.querySelector(`.segmented__btn.segmented__btn--active[data-preset]`)?.dataset.preset??`family`,t?.pubkey,s);if(o&&t?.pubkey){let e=l().groups[c];e&&u(c,{memberNames:{...e.memberNames,[t.pubkey]:o}})}let d=l().groups[c];d&&e(d)===`online`&&i(d).length>0&&as(d.readRelays??[],d.writeRelays??[],c),Om(),q(async()=>{let{shouldPromptForNotifications:e,shouldPromptAddToHomeScreen:t,isMacSafari:n,subscribeToPush:r,registerWithPushServer:i}=await import(`./push-BYeuOIYg.js`);return{shouldPromptForNotifications:e,shouldPromptAddToHomeScreen:t,isMacSafari:n,subscribeToPush:r,registerWithPushServer:i}},[],import.meta.url).then(({shouldPromptForNotifications:e,shouldPromptAddToHomeScreen:t,isMacSafari:n,subscribeToPush:r,registerWithPushServer:i})=>{if(t()){setTimeout(()=>{wm()},1500);return}if(n()&&!(`Notification`in window)){console.info(`[canary:push] Mac Safari without notification support — skipping prompt`);return}e()&&setTimeout(()=>{Cm(async()=>{try{let e=await r();if(!e){console.warn(`[canary:push] subscribeToPush returned null — permission denied or unavailable`);return}let{hashGroupTag:t}=await q(async()=>{let{hashGroupTag:e}=await Promise.resolve().then(()=>_o);return{hashGroupTag:e}},void 0,import.meta.url),{groups:n}=l(),a=Object.values(n).map(e=>({tagHash:t(e.id),livenessInterval:e.livenessInterval}));await i(e,a),console.info(`[canary:push] Registered with push server, groups:`,a.length),G(`Notifications enabled`,`success`)}catch(e){console.error(`[canary:push] Registration failed:`,e),G(`Failed to enable notifications`,`error`)}})},1500)}).catch(e=>console.error(`[canary:push] Import failed:`,e))}),requestAnimationFrame(()=>{document.getElementById(`modal-cancel-btn`)?.addEventListener(`click`,()=>{document.getElementById(`app-modal`)?.close()}),document.querySelectorAll(`.segmented__btn[data-preset]`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.segmented__btn[data-preset]`).forEach(e=>e.classList.remove(`segmented__btn--active`)),e.classList.add(`segmented__btn--active`)})})})}function um(){let e=window.location.hash;if(e.startsWith(`#ack/`)){let t;try{t=decodeURIComponent(e.slice(5))}catch{console.warn(`[canary] Malformed ack fragment — ignoring.`),window.location.hash=``;return}window.location.hash=``,document.dispatchEvent(new CustomEvent(`canary:confirm-member`,{detail:{token:t}}))}else if(e.startsWith(`#inv/`)){let t=e.slice(5);window.location.hash=``,dm(t)}else if(e.startsWith(`#j/`)){let t=e.slice(3);window.location.hash=``,/^[0-9a-f]{32}$/.test(t)?pm(t):G(`Invalid invite link.`,`error`)}else if(e.startsWith(`#remote/`)){let t=e.slice(8);try{t=decodeURIComponent(t)}catch{}window.location.hash=``,mm(t)}}function dm(e){try{let t=mu(il(e)),{identity:r}=l();if(!r?.pubkey){G(`No local identity — create or import one first.`,`error`);return}let i=document.getElementById(`binary-join-modal`);i||(i=document.createElement(`dialog`),i.id=`binary-join-modal`,i.className=`modal`,document.body.appendChild(i),i.addEventListener(`click`,e=>{e.target===i&&i.close()}));let a=i;a.innerHTML=`
      <div class="modal__form invite-share">
        <h2 class="modal__title">Join ${B(t.groupName)}</h2>
        <p class="invite-hint">Invited by <code>${B(t.inviterPubkey.slice(0,8))}\u2026</code></p>
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
    `,a.querySelector(`#binary-join-cancel`)?.addEventListener(`click`,()=>a.close()),a.querySelector(`#binary-join-accept`)?.addEventListener(`click`,()=>{let e=a.querySelector(`#binary-join-confirm`),i=a.querySelector(`#binary-join-error`),c=e?.value.trim()??``;if(!c){i&&(i.textContent=`Please enter the confirmation words.`,i.style.display=``);return}try{let e=Ul($c(t),c);if(Wl(e.groupId,e.nonce))throw Error(`This invite has already been used.`);let i=e.groupId,{groups:u}=l(),d=Qp(u[i],{epoch:e.epoch,counter:e.counter,latestInviteIssuedAt:e.issuedAt});if(d)throw Error(d);let f=new Set(e.members);f.add(r.pubkey);let p=l().settings,m=e.relays.length>0?e.relays:p.defaultWriteRelays?.length?[...p.defaultWriteRelays]:[o],h=Array.from(new Set([...p.defaultReadRelays?.length?p.defaultReadRelays:n,...m])),g=m.length>0,_={id:i,name:e.groupName,seed:e.seed,members:Array.from(f),memberNames:e.memberNames??{},nostrEnabled:g,relays:e.relays,readRelays:h,writeRelays:m,wordlist:e.wordlist,wordCount:e.wordCount,counter:e.counter,usageOffset:e.usageOffset,rotationInterval:e.rotationInterval,encodingFormat:e.encodingFormat,usedInvites:[e.nonce],latestInviteIssuedAt:e.issuedAt,beaconInterval:e.beaconInterval,beaconPrecision:e.beaconPrecision,duressMode:`immediate`,livenessInterval:e.rotationInterval,livenessCheckins:{},tolerance:e.tolerance,personaId:l().activePersonaId??``,createdAt:Math.floor(Date.now()/1e3),admins:[...e.admins],epoch:e.epoch,consumedOps:[]};s({groups:{...u,[i]:_},activeGroupId:i}),Gl(i,e.nonce),Kr(),Om(),g&&r&&as(h,m,i).then(()=>{os(i,{type:`member-join`,pubkey:r.pubkey,displayName:r.displayName&&r.displayName!==`You`?r.displayName:void 0,timestamp:Math.floor(Date.now()/1e3),epoch:e.epoch,opId:crypto.randomUUID()})}),a.close(),G(`Joined ${e.groupName}`,`success`)}catch(e){i&&(i.textContent=e instanceof Error?e.message:`Failed to join group.`,i.style.display=``)}}),a.showModal()}catch(e){G(e instanceof Error?e.message:`Invalid QR invite.`,`error`)}}async function fm(e,t,r){let{identity:i}=l();if(!i?.pubkey)return;let a=i.privkey?vl({envelope:e,joinerPrivkey:i.privkey,adminPubkey:t.adminPubkey,expectedInviteId:t.inviteId}):i.signerType===`nip07`?await(async()=>{let n=window.nostr?.nip44?.decrypt;if(typeof n!=`function`)throw Error(`NIP-07 extension does not support NIP-44 decryption.`);return yl(await n.call(window.nostr.nip44,t.adminPubkey,e),t.inviteId)})():null;if(!a)throw Error(`No local key or NIP-07 signer — cannot decrypt welcome message.`);let c=a.groupId,{groups:u}=l(),d=Qp(u[c],{epoch:a.epoch,counter:a.counter});if(d)throw Error(d);let f=new Set(a.members);f.add(i.pubkey);let p={...a.memberNames??{}};i.displayName&&i.displayName!==`You`&&(p[i.pubkey]=i.displayName);let m=[...a.relays??[]],h=m.length>0?m:[o],g=Array.from(new Set([...n,...h])),_=h.length>0,v={id:c,name:a.groupName,seed:a.seed,members:Array.from(f),memberNames:p,nostrEnabled:_,relays:m,readRelays:g,writeRelays:h,wordlist:a.wordlist,wordCount:a.wordCount,counter:a.counter,usageOffset:a.usageOffset,rotationInterval:a.rotationInterval,encodingFormat:a.encodingFormat,usedInvites:[],latestInviteIssuedAt:0,beaconInterval:a.beaconInterval,beaconPrecision:a.beaconPrecision,duressMode:`immediate`,livenessInterval:a.rotationInterval,livenessCheckins:{},tolerance:a.tolerance,personaId:l().activePersonaId??``,createdAt:Math.floor(Date.now()/1e3),admins:[...a.admins],epoch:a.epoch,consumedOps:[]};s({groups:{...u,[c]:v},activeGroupId:c}),Kr(),Om(),_&&i&&as(g,h,c).then(()=>{os(c,{type:`member-join`,pubkey:i.pubkey,displayName:i.displayName&&i.displayName!==`You`?i.displayName:void 0,timestamp:Math.floor(Date.now()/1e3),epoch:a.epoch,opId:crypto.randomUUID()})}),r.close(),G(`Joined ${a.groupName}`,`success`)}function pm(e){let{identity:t,settings:r}=l();if(!t?.pubkey||!t.privkey&&t.signerType!==`nip07`){G(`No local identity — create or import one first.`,`error`);return}let i=Array.from(new Set([...n,...r.defaultWriteRelays??[]])),a=r.defaultWriteRelays??[`wss://relay.trotters.cc`],o=document.getElementById(`relay-join-modal`);o||(o=document.createElement(`dialog`),o.id=`relay-join-modal`,o.className=`modal`,document.body.appendChild(o),o.addEventListener(`click`,e=>{e.target===o&&o.close()}));let s=o;s.innerHTML=`
    <div class="modal__form invite-share">
      <h2 class="modal__title">Joining...</h2>
      <p class="invite-hint" id="relay-join-status">Looking for invite on relay...</p>
      <div class="modal__actions">
        <button class="btn" id="relay-join-cancel" type="button">Cancel</button>
      </div>
    </div>
  `;let c=()=>{},u=()=>{};s.querySelector(`#relay-join-cancel`)?.addEventListener(`click`,()=>{c(),u(),s.close()}),s.showModal(),as(i,a).then(()=>{c=Wu({inviteId:e,readRelays:i,onToken(e){try{gl(e)}catch(e){let t=s.querySelector(`#relay-join-status`);t&&(t.textContent=e instanceof Error?e.message:`Invalid invite token.`,t.style.color=`var(--duress)`);return}let t=e.relays?.length?e.relays:a,r=t,i=Array.from(new Set([...n,...t])),o=s.querySelector(`#relay-join-status`);o&&(o.textContent=`Joining ${e.groupName}...`),as(i,r).then(()=>{u=zu({inviteId:e.inviteId,adminPubkey:e.adminPubkey,readRelays:i,writeRelays:r,async onWelcome(t){try{await fm(t,e,s)}catch{o&&(o.textContent=`Failed to join — welcome message could not be decrypted.`,o.style.color=`var(--duress)`)}},onError(e){o&&(o.textContent=e,o.style.color=`var(--duress)`)}})})},onError(e){let t=s.querySelector(`#relay-join-status`);t&&(t.textContent=e,t.style.color=`var(--duress)`)}})})}function mm(e){try{let t;try{t=nl(e)}catch{try{t=el(e)}catch{throw Error(`Invalid invite — could not decode token.`)}}gl(t);let r=t,{identity:i,settings:a}=l();if(!i?.pubkey||!i.privkey&&i.signerType!==`nip07`){G(`No local identity — create or import one first.`,`error`);return}let o=`${r.adminPubkey.slice(0,8)}\u2026${r.adminPubkey.slice(-4)}`,s=r.relays?.length?r.relays:a.defaultWriteRelays,c=s,u=Array.from(new Set([...n,...s])),d=Array.from(new Set([...u,...c])),f=document.getElementById(`remote-join-modal`);f||(f=document.createElement(`dialog`),f.id=`remote-join-modal`,f.className=`modal`,document.body.appendChild(f),f.addEventListener(`click`,e=>{e.target===f&&f.close()}));let p=f,m=()=>{};p.innerHTML=`
      <div class="modal__form invite-share">
        <h2 class="modal__title">Remote Invite</h2>
        <p class="invite-hint">You've been invited to <strong>${B(r.groupName)}</strong> by <code>${B(o)}</code></p>

        <p class="invite-hint" id="remote-join-relay-status" style="color: var(--verified); font-weight: 500;">${d.length>0?`Connecting to relay...`:``}</p>

        <div style="margin: 1rem 0;">
          <p class="invite-hint" style="font-weight: 500;">Or send this join code manually:</p>
          <div style="display: flex; align-items: center; gap: 0.5rem; justify-content: center; margin: 0.5rem 0;">
            <code style="font-size: 0.75rem; word-break: break-all; max-width: 80%;">${B(i.pubkey)}</code>
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
    `,d.length>0&&as(u,c).then(()=>{let e=p.querySelector(`#remote-join-relay-status`);e&&(e.textContent=`Waiting for admin to send group key...`),m=zu({inviteId:r.inviteId,adminPubkey:r.adminPubkey,readRelays:u,writeRelays:c,async onWelcome(t){try{await fm(t,r,p)}catch{e&&(e.textContent=`Auto-join failed — paste welcome message manually.`,e.style.color=`var(--duress)`)}},onError(t){e&&(e.textContent=t,e.style.color=`var(--duress)`)}})}),p.querySelector(`#remote-join-copy-pubkey`)?.addEventListener(`click`,async e=>{let t=e.currentTarget;try{await navigator.clipboard.writeText(i.pubkey),t.textContent=`Copied!`,setTimeout(()=>{t.textContent=`Copy`},1500)}catch{}}),p.querySelector(`#remote-join-cancel`)?.addEventListener(`click`,()=>{m(),p.close()}),p.querySelector(`#remote-join-accept`)?.addEventListener(`click`,async()=>{let e=p.querySelector(`#remote-join-welcome-input`),t=p.querySelector(`#remote-join-error`),n=(e?.value??``).replace(/[^A-Za-z0-9=+/]/g,``);if(!n){t&&(t.textContent=`Please paste the welcome message.`,t.style.display=``);return}try{m(),await fm(n,r,p)}catch(e){t&&(t.textContent=e instanceof Error?e.message:`Failed to decrypt welcome message.`,t.style.display=``)}}),p.showModal()}catch(e){G(e instanceof Error?e.message:`Invalid remote invite.`,`error`)}}function hm(){document.addEventListener(`canary:create-group`,()=>{lm()}),document.addEventListener(`canary:show-invite`,e=>{let{groupId:t}=e.detail,{groups:n}=l(),r=n[t];r&&pd(r)}),document.addEventListener(`canary:confirm-member`,e=>{let{identity:t,groups:n,activeGroupId:r}=l();if(!r||!t?.pubkey)return;let i=n[r];if(!i||!i.admins.includes(t.pubkey))return;let a=e.detail?.token??``;q(async()=>{let{showConfirmMemberModal:e}=await Promise.resolve().then(()=>cd);return{showConfirmMemberModal:e}},void 0,import.meta.url).then(({showConfirmMemberModal:e})=>{e(a)})}),document.addEventListener(`canary:verify-call`,e=>{let{groupId:t,pubkey:n}=e.detail;kp(t,n)}),document.addEventListener(`canary:shamir-split`,()=>{q(async()=>{let{showShamirModal:e}=await import(`./shamir-modal-DJMuykU-.js`);return{showShamirModal:e}},__vite__mapDeps([1,2,3,4,5,6]),import.meta.url).then(({showShamirModal:e})=>{e()})}),document.addEventListener(`canary:verify-proof`,()=>{q(async()=>{let{showVerifyProofModal:e}=await import(`./linkage-proof-CoLtxD1e.js`);return{showVerifyProofModal:e}},__vite__mapDeps([7,8,9,2,3,10,6,11,12,4]),import.meta.url).then(({showVerifyProofModal:e})=>{e()})}),document.addEventListener(`canary:open-recovery-root-modal`,()=>{q(async()=>{let{showRecoveryRootModal:e}=await import(`./recovery-root-modal-Duq1pYEp.js`);return{showRecoveryRootModal:e}},[],import.meta.url).then(({showRecoveryRootModal:e})=>{e()})}),document.addEventListener(`canary:create-recovery-root`,async e=>{let t=(e.detail?.name??``).trim();if(!t){alert(`Please enter a name for the new mnemonic-backed root.`);return}let{generateMnemonic:n}=await q(async()=>{let{generateMnemonic:e}=await Promise.resolve().then(()=>Dn);return{generateMnemonic:e}},void 0,import.meta.url),{wordlist:r}=await q(async()=>{let{wordlist:e}=await Promise.resolve().then(()=>Bn);return{wordlist:e}},void 0,import.meta.url),{restoreFromMnemonic:i}=await q(async()=>{let{restoreFromMnemonic:e}=await Promise.resolve().then(()=>Wn);return{restoreFromMnemonic:e}},void 0,import.meta.url),a=n(r),{root:o,defaultPersona:c}=i(a),l=ym(c.identity.privateKey),u=ym(c.identity.publicKey);c.identity.privateKey.fill(0),o.destroy(),ps(),s({identity:{pubkey:u,privkey:l,mnemonic:a,signerType:`local`,displayName:t},groups:{},personas:{},activeGroupId:null,activePersonaId:null}),document.dispatchEvent(new CustomEvent(`canary:resync`)),cm(),bm(a)}),document.addEventListener(`canary:restore-recovery-root`,async e=>{let t=(e.detail?.mnemonic??``).trim().replace(/\s+/g,` `);if(!t){alert(`Please paste a recovery phrase first.`);return}if(t.split(/\s+/).length!==12){alert(`Recovery phrase must be exactly 12 words.`);return}try{let{validateMnemonic:e,restoreFromMnemonic:n}=await q(async()=>{let{validateMnemonic:e,restoreFromMnemonic:t}=await Promise.resolve().then(()=>Wn);return{validateMnemonic:e,restoreFromMnemonic:t}},void 0,import.meta.url),{wordlist:r}=await q(async()=>{let{wordlist:e}=await Promise.resolve().then(()=>Bn);return{wordlist:e}},void 0,import.meta.url);if(!e(t,r)){alert(`Invalid recovery phrase. Please check your words and try again.`);return}let{root:i,defaultPersona:a}=n(t),o=ym(a.identity.privateKey),c=ym(a.identity.publicKey);a.identity.privateKey.fill(0),i.destroy(),ps(),s({identity:{pubkey:c,privkey:o,mnemonic:t,signerType:`local`,displayName:`You`},groups:{},personas:{},activeGroupId:null,activePersonaId:null}),document.dispatchEvent(new CustomEvent(`canary:resync`)),cm()}catch{alert(`Invalid recovery phrase.`)}}),document.addEventListener(`canary:export-persona`,e=>{let{personaId:t}=e.detail,{personas:n}=l(),r=z(n,t);r&&q(async()=>{let{showExportModal:e}=await import(`./export-modal-Cq5sZej7.js`);return{showExportModal:e}},__vite__mapDeps([13,9,8,2,3,10,6,11,12,4]),import.meta.url).then(({showExportModal:e})=>{e(r.persona)})}),document.addEventListener(`canary:prove-ownership`,e=>{let{personaId:t}=e.detail;q(async()=>{let{showProveOwnershipModal:e}=await import(`./linkage-proof-CoLtxD1e.js`);return{showProveOwnershipModal:e}},__vite__mapDeps([7,8,9,2,3,10,6,11,12,4]),import.meta.url).then(({showProveOwnershipModal:e})=>{e(t)})}),document.addEventListener(`canary:archive-persona`,e=>{let{personaId:t}=e.detail,{personas:n}=l(),r=z(n,t);if(!r)return;function i(e,t){let n={};for(let[r,a]of Object.entries(e))a.id===t?n[r]={...a,archived:!0}:a.children&&Object.keys(a.children).length>0?n[r]={...a,children:i(a.children,t)}:n[r]=a;return n}s({personas:i(n,t)}),G(`Archived "${r.persona.name}"`,`success`)}),document.addEventListener(`canary:rotate-persona`,e=>{let{personaId:t}=e.detail;q(async()=>{let{rotatePersona:e}=await import(`./persona-DTjhk3W7.js`);return{rotatePersona:e}},__vite__mapDeps([14,9,8,2,3,10,6,11,12]),import.meta.url).then(({rotatePersona:e})=>{let{personas:n}=l(),r=z(n,t);if(!r)return;let i=e(t,r.persona.index);n[t]&&s({personas:{...n,[t]:i}}),G(`Rotated "${r.persona.name}" to index ${i.index}`,`success`)})}),document.addEventListener(`canary:pin-enable`,e=>{let t=e.detail?.pin;!t||t.length<6||qr(t).then(()=>{s({settings:{...l().settings,pinEnabled:!0}}),tm()})}),document.addEventListener(`canary:pin-disable`,()=>{Jr().then(()=>{s({settings:{...l().settings,pinEnabled:!1}}),nm()})}),document.addEventListener(`canary:lock`,()=>{be(),lr(),rm()}),document.addEventListener(`canary:sync-message`,e=>{let{groupId:t,message:n,sender:r}=e.detail,{activeGroupId:i}=l();if(n.type===`beacon`){if(t!==i)return;af(r,n.lat,n.lon,n.accuracy??2e4,n.timestamp)}else if(n.type===`duress-alert`){let e=n.subject||r,{identity:i}=l();if(i?.pubkey===e)return;Kc(e,t,n.lat==null?void 0:{lat:n.lat,lon:n.lon},n.timestamp)}else n.type===`duress-clear`&&document.dispatchEvent(new CustomEvent(`canary:duress-clear`,{detail:{subject:n.subject,clearedBy:r,groupId:t}}))}),document.addEventListener(`canary:resync`,()=>void vm()),document.addEventListener(`canary:publish-persona-profile`,async e=>{let{personaId:t}=e.detail,n=l().personas[t];n&&await od(n)}),document.addEventListener(`canary:vault-publish-now`,()=>Om()),document.addEventListener(`canary:sync-vault`,()=>void km()),document.addEventListener(`visibilitychange`,()=>{if(document.hidden){Kr(),Om();return}console.info(`[canary:boot] App foregrounded — reconnecting and syncing vault`),Jp(),ps(),q(async()=>{let{disconnectRelays:e}=await import(`./connect-Ce_17kge.js`);return{disconnectRelays:e}},__vite__mapDeps([15,16,3,17]),import.meta.url).then(({disconnectRelays:e})=>{e(),vm()})})}async function gm(){let{identity:e}=l(),t=await aa({pubkey:e?.pubkey??``,privkey:e?.privkey}),n={pubkey:t.pubkey,privkey:t.privkey,displayName:e?.displayName??`You`,signerType:`local`};(!e||e.pubkey!==n.pubkey)&&s({identity:Zp(n,e)})}function _m(){let{identity:e}=l();if(!e?.pubkey)return;let t=e.privkey?async t=>{let{decryptVault:n}=await q(async()=>{let{decryptVault:e}=await Promise.resolve().then(()=>Ap);return{decryptVault:e}},void 0,import.meta.url);return n(t,e.privkey,e.pubkey)}:e.signerType===`nip07`?async t=>{try{return await window.nostr.nip44.decrypt(e.pubkey,t)}catch{return null}}:null;t&&qp(e.pubkey,t,(e,t)=>{let{groups:n}=l(),r=Yp(n,e,l().deletedGroupIds),i=Object.keys(r).length-Object.keys(n).length;(i>0||Object.entries(r).some(([e,t])=>{let r=n[e];return r?t.epoch!==r.epoch||t.counter!==r.counter:!0}))&&(s({groups:r}),Kr(),i>0?G(`${i} new group(s) synced from another device`,`success`):G(`Groups updated from another device`,`success`,2e3))})}async function vm(){let{groups:e,identity:n,settings:r}=l(),i=Object.keys(e).length,a=!!n?.privkey,o=[],c=[];for(let t of Object.values(e))o.push(...t.readRelays??[]),c.push(...t.writeRelays??[]),o.push(...t.relays??[]),c.push(...t.relays??[]);o.push(...r.defaultReadRelays??r.defaultRelays),c.push(...r.defaultWriteRelays??r.defaultRelays);let u=t(o),d=t(c),f=t([...u,...d]).length;if(f===0){console.warn(`[canary:boot] No relays found — sync disabled`),i>0&&G(`Sync disabled — ${i} group(s), no relays configured`,`warning`,5e3);return}if(!a&&n?.signerType!==`nip07`){console.warn(`[canary:boot] No privkey and no NIP-07 — sync disabled`),G(`Sync disabled — no private key`,`warning`,5e3);return}if(console.warn(`[canary:boot] Read relays:`,u,`Write relays:`,d),a){await as(u,d);let{waitForConnection:t}=await q(async()=>{let{waitForConnection:e}=await import(`./connect-Ce_17kge.js`);return{waitForConnection:e}},__vite__mapDeps([15,16,3,17]),import.meta.url);await t(),console.info(`[canary:vault] Relay connections ready, fetching vault...`);try{let e=await Vp(n.privkey,n.pubkey),t=e?.groups;if(console.info(`[canary:vault] Vault fetch result:`,t?`${Object.keys(t).length} group(s)`:`null`),t&&Object.keys(t).length>0){let{groups:e}=l(),n=Yp(e,t,l().deletedGroupIds);if(Object.keys(e).sort().join(`,`)!==Object.keys(n).sort().join(`,`)||Object.entries(n).some(([t,n])=>{let r=e[t];return r?n.epoch!==r.epoch||n.counter!==r.counter||n.usageOffset!==r.usageOffset||n.members.length!==r.members.length:!0})){s({groups:n});let t=Object.keys(n).length-Object.keys(e).length;t>0?G(`Restored ${t} group(s) from vault`,`success`):G(`Synced from vault`,`success`,1500)}}if(e?.personas&&Object.keys(e.personas).length>0){let{personas:t}=l(),n={...t};for(let[t,r]of Object.entries(e.personas))n[t]?n[t]={...n[t],...r,npub:n[t].npub}:n[t]=r;s({personas:n})}}catch(e){console.warn(`[canary:vault] Vault fetch failed:`,e)}fs(),_m(),G(`Syncing via ${f} relay(s)`,`success`,2e3),typeof Notification<`u`&&Notification.permission===`granted`&&q(async()=>{let{getExistingSubscription:e,registerWithPushServer:t}=await import(`./push-BYeuOIYg.js`);return{getExistingSubscription:e,registerWithPushServer:t}},[],import.meta.url).then(async({getExistingSubscription:t,registerWithPushServer:n})=>{let r=await t();if(r){let{hashGroupTag:t}=await q(async()=>{let{hashGroupTag:e}=await Promise.resolve().then(()=>_o);return{hashGroupTag:e}},void 0,import.meta.url),i=Object.values(e).map(e=>({tagHash:t(e.id),livenessInterval:e.livenessInterval}));await n(r,i),console.info(`[canary:push] Re-registered with push server, groups:`,i.length)}else console.warn(`[canary:push] Permission granted but no existing subscription found`)}).catch(e=>console.error(`[canary:push] Re-registration failed:`,e))}else if(n?.signerType===`nip07`){let{connectRelays:e,waitForConnection:t}=await q(async()=>{let{connectRelays:e,waitForConnection:t}=await import(`./connect-Ce_17kge.js`);return{connectRelays:e,waitForConnection:t}},__vite__mapDeps([15,16,3,17]),import.meta.url);e(u,d);try{await t(),console.info(`[canary:vault] NIP-07 vault sync starting...`);let e=await Wp(n.pubkey),r=e?.groups;if(console.info(`[canary:vault] NIP-07 vault result:`,r?`${Object.keys(r).length} group(s)`:`null`),r&&Object.keys(r).length>0){let{groups:e}=l(),t=Yp(e,r,l().deletedGroupIds);if(Object.keys(t).length!==Object.keys(e).length||Object.entries(t).some(([t,n])=>{let r=e[t];return r?n.epoch!==r.epoch||n.counter!==r.counter:!0})){s({groups:t});let n=Object.keys(t).length-Object.keys(e).length;n>0?G(`Restored ${n} group(s) from vault`,`success`):G(`Synced from vault`,`success`,1500)}}if(e?.personas&&Object.keys(e.personas).length>0){let{personas:t}=l(),n={...t};for(let[t,r]of Object.entries(e.personas))n[t]?n[t]={...n[t],...r,npub:n[t].npub}:n[t]=r;s({personas:n})}}catch(e){console.warn(`[canary:vault] NIP-07 vault sync failed:`,e)}_m(),G(`Connected to ${f} relay(s)`,`success`,2e3)}else{let{connectRelays:e}=await q(async()=>{let{connectRelays:e}=await import(`./connect-Ce_17kge.js`);return{connectRelays:e}},__vite__mapDeps([15,16,3,17]),import.meta.url);e(u,d),G(`Connected to ${f} relay(s)`,`success`,2e3)}let{fetchOwnProfile:p}=await q(async()=>{let{fetchOwnProfile:e}=await Promise.resolve().then(()=>Gu);return{fetchOwnProfile:e}},void 0,import.meta.url);if(p(),sm(),a){let{startLivenessHeartbeat:e}=await q(async()=>{let{startLivenessHeartbeat:e}=await Promise.resolve().then(()=>qo);return{startLivenessHeartbeat:e}},void 0,import.meta.url);e()}}function ym(e){return Array.from(e,e=>e.toString(16).padStart(2,`0`)).join(``)}function bm(e){let t=e.split(` `),n=document.getElementById(`recovery-phrase-modal`);n||(n=document.createElement(`dialog`),n.id=`recovery-phrase-modal`,n.className=`modal`,document.body.appendChild(n));let r=n;r.textContent=``;let i=document.createElement(`div`);i.className=`modal__form`,i.style.maxWidth=`420px`;let a=document.createElement(`h2`);a.className=`modal__title`,a.textContent=`Back up your recovery phrase`,i.appendChild(a);let o=document.createElement(`p`);o.className=`invite-hint`,o.textContent=`Write these words down in order. They're the only way to recover your account.`,i.appendChild(o);let s=document.createElement(`div`);s.className=`recovery-grid`,s.style.cssText=`display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin:1rem 0;`,t.forEach((e,t)=>{let n=document.createElement(`div`);n.style.cssText=`border:1px solid var(--border);border-radius:4px;padding:0.5rem;text-align:center;font-family:var(--font-mono,monospace);font-size:0.8rem;`;let r=document.createElement(`span`);r.style.cssText=`color:var(--text-muted);font-size:0.7rem;`,r.textContent=`${t+1}. `;let i=document.createElement(`span`);i.style.fontWeight=`500`,i.textContent=e,n.append(r,i),s.appendChild(n)}),i.appendChild(s);let c=document.createElement(`p`);c.className=`invite-hint`,c.style.cssText=`color:var(--duress);font-weight:500;`,c.textContent=`Do not share these words with anyone.`,i.appendChild(c);let l=document.createElement(`div`);l.className=`modal__actions`,l.style.gap=`0.5rem`;let u=document.createElement(`button`);u.id=`recovery-phrase-copy`,u.className=`btn btn--primary`,u.type=`button`,u.textContent=`Copy words`,u.addEventListener(`click`,async()=>{try{await navigator.clipboard.writeText(e),u.textContent=`Copied!`,setTimeout(()=>{u.textContent=`Copy words`},2e3),setTimeout(()=>{navigator.clipboard.writeText(``).catch(()=>{})},3e4)}catch{}});let d=document.createElement(`button`);d.id=`recovery-phrase-skip`,d.className=`btn`,d.type=`button`,d.textContent=`Skip for now`,d.addEventListener(`click`,()=>r.close()),l.append(u,d),i.appendChild(l),r.appendChild(i),r.showModal()}function xm(){let e=document.getElementById(`app`);e.innerHTML=`
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

          <div style="display: flex; gap: 0; margin-bottom: 0.75rem; border-bottom: 1px solid var(--border);">
            <button id="tab-recovery-phrase" type="button" class="btn btn--ghost btn--sm" style="border-bottom: 2px solid var(--accent); border-radius: 0; padding: 0.375rem 0.75rem; font-size: 0.75rem; opacity: 1;">Recovery Phrase</button>
            <button id="tab-shamir-shares" type="button" class="btn btn--ghost btn--sm" style="border-bottom: 2px solid transparent; border-radius: 0; padding: 0.375rem 0.75rem; font-size: 0.75rem; opacity: 0.6;">Shamir Shares</button>
          </div>

          <div id="panel-recovery-phrase">
            <p class="settings-hint" style="margin-bottom: 0.5rem;">Paste your 12-word recovery phrase to restore your account.</p>
            <form id="mnemonic-login-form" autocomplete="off" style="display: flex; flex-direction: column; gap: 0.375rem;">
              <textarea class="input" id="login-mnemonic" placeholder="Enter your 12 recovery words..." rows="3" style="width: 100%; font-size: 0.8rem; resize: none; padding: 0.5rem; font-family: var(--font-mono, monospace);"></textarea>
              <button class="btn btn--primary" type="submit">Recover account</button>
            </form>
          </div>

          <div id="panel-shamir-shares" style="display: none;">
            <p class="settings-hint" style="margin-bottom: 0.5rem;">Paste Shamir shares one at a time to reconstruct your recovery phrase.</p>
            <div style="display: flex; flex-direction: column; gap: 0.375rem;">
              <textarea class="input" id="shamir-share-input" placeholder="Paste a Shamir share (word list)..." rows="3" style="width: 100%; font-size: 0.8rem; resize: none; padding: 0.5rem; font-family: var(--font-mono, monospace);"></textarea>
              <button class="btn btn--primary" id="shamir-add-share" type="button">Add share</button>
              <p class="settings-hint" id="shamir-status" style="margin: 0; font-size: 0.75rem;"></p>
              <ul id="shamir-share-list" style="list-style: none; padding: 0; margin: 0;"></ul>
              <button class="btn btn--primary" id="shamir-recover" type="button" disabled style="margin-top: 0.25rem;">Recover</button>
            </div>
          </div>
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
                ${(l().settings.defaultWriteRelays??l().settings.defaultRelays).map((e,t)=>`
                  <li style="display: flex; align-items: center; gap: 0.25rem; margin-bottom: 0.25rem;">
                    <span class="settings-hint" style="flex: 1; font-size: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0;">${B(e)}</span>
                    <button class="btn btn--ghost btn--sm login-relay-remove" data-relay-index="${t}" type="button" style="padding: 0 0.25rem; font-size: 0.7rem;">✕</button>
                  </li>
                `).join(``)}
              </ul>
              <div style="display: flex; gap: 0.25rem;">
                <input class="input" type="url" id="login-relay-input" placeholder="wss://relay.example.com" style="flex: 1; font-size: 0.75rem; padding: 0.375rem;" />
                <button class="btn btn--ghost btn--sm" id="login-relay-add" type="button">Add</button>
              </div>
              <p class="settings-hint" style="font-size: 0.7rem; margin: 0.5rem 0 0 0;">Read relays: ${n.map(e=>B(e.replace(`wss://`,``))).join(`, `)} + write relay(s)</p>
            </div>
          </details>
        </div>

      </div>
    </div>
  `,e.querySelector(`#offline-form`)?.addEventListener(`submit`,async t=>{t.preventDefault();let n=e.querySelector(`#offline-name`),r=n?.value.trim();if(!r){n?.focus();return}let{generateMnemonic:i}=await q(async()=>{let{generateMnemonic:e}=await Promise.resolve().then(()=>Dn);return{generateMnemonic:e}},void 0,import.meta.url),{wordlist:a}=await q(async()=>{let{wordlist:e}=await Promise.resolve().then(()=>Bn);return{wordlist:e}},void 0,import.meta.url),{restoreFromMnemonic:o}=await q(async()=>{let{restoreFromMnemonic:e}=await Promise.resolve().then(()=>Wn);return{restoreFromMnemonic:e}},void 0,import.meta.url),c=i(a),{root:l,defaultPersona:u}=o(c),d=Array.from(u.identity.privateKey,e=>e.toString(16).padStart(2,`0`)).join(``),f=Array.from(u.identity.publicKey,e=>e.toString(16).padStart(2,`0`)).join(``);l.destroy(),s({identity:{pubkey:f,privkey:d,mnemonic:c,signerType:`local`,displayName:r}}),await Sm();let{publishKind0:p}=await q(async()=>{let{publishKind0:e}=await Promise.resolve().then(()=>Gu);return{publishKind0:e}},void 0,import.meta.url);p(r,d),bm(c)}),e.querySelector(`#mnemonic-login-form`)?.addEventListener(`submit`,async t=>{t.preventDefault();let n=e.querySelector(`#login-mnemonic`)?.value.trim();if(n){if(n.split(/\s+/).length!==12){alert(`Recovery phrase must be exactly 12 words.`);return}try{let{validateMnemonic:e,restoreFromMnemonic:t}=await q(async()=>{let{validateMnemonic:e,restoreFromMnemonic:t}=await Promise.resolve().then(()=>Wn);return{validateMnemonic:e,restoreFromMnemonic:t}},void 0,import.meta.url),{wordlist:r}=await q(async()=>{let{wordlist:e}=await Promise.resolve().then(()=>Bn);return{wordlist:e}},void 0,import.meta.url);if(!e(n,r)){alert(`Invalid recovery phrase. Please check your words and try again.`);return}let{root:i,defaultPersona:a}=t(n),o=Array.from(a.identity.privateKey,e=>e.toString(16).padStart(2,`0`)).join(``),c=Array.from(a.identity.publicKey,e=>e.toString(16).padStart(2,`0`)).join(``);i.destroy(),s({identity:{pubkey:c,privkey:o,mnemonic:n,signerType:`local`,displayName:`You`}}),await Sm()}catch{alert(`Invalid recovery phrase.`)}}});let t=e.querySelector(`#tab-recovery-phrase`),r=e.querySelector(`#tab-shamir-shares`),i=e.querySelector(`#panel-recovery-phrase`),a=e.querySelector(`#panel-shamir-shares`);t.addEventListener(`click`,()=>{i.style.display=``,a.style.display=`none`,t.style.borderBottomColor=`var(--accent)`,t.style.opacity=`1`,r.style.borderBottomColor=`transparent`,r.style.opacity=`0.6`}),r.addEventListener(`click`,()=>{i.style.display=`none`,a.style.display=``,r.style.borderBottomColor=`var(--accent)`,r.style.opacity=`1`,t.style.borderBottomColor=`transparent`,t.style.opacity=`0.6`});let o=[],c=0;function u(){let t=e.querySelector(`#shamir-status`),n=e.querySelector(`#shamir-share-list`),r=e.querySelector(`#shamir-recover`);n.textContent=``;for(let e=0;e<o.length;e++){let t=document.createElement(`li`);t.className=`settings-hint`,t.style.cssText=`font-size: 0.75rem; padding: 0.125rem 0;`,t.textContent=`Share ${e+1} added`,n.appendChild(t)}if(o.length===0)t.textContent=``,r.disabled=!0;else if(o.length<c){let e=c-o.length;t.textContent=`Share ${o.length} added. Need ${e} more.`,r.disabled=!0}else t.textContent=`Ready to recover!`,r.disabled=!1}e.querySelector(`#shamir-add-share`)?.addEventListener(`click`,async()=>{let t=e.querySelector(`#shamir-share-input`),n=t.value.trim();if(n)try{let{wordsToShare:e}=await q(async()=>{let{wordsToShare:e}=await import(`./dist-DVxUQaK0.js`);return{wordsToShare:e}},__vite__mapDeps([5,6]),import.meta.url),r=e(n.split(/\s+/));if(o.some(e=>e.id===r.id)){alert(`Share ${r.id} has already been added.`);return}if(o.length===0)c=r.threshold;else if(r.threshold!==c){alert(`Threshold mismatch: expected ${c}, got ${r.threshold}. Shares must be from the same set.`);return}o.push(r),t.value=``,u()}catch(e){alert(e instanceof Error?e.message:`Invalid share. Please check the words and try again.`)}}),e.querySelector(`#shamir-recover`)?.addEventListener(`click`,async()=>{if(!(o.length<c))try{let{reconstructSecret:e}=await q(async()=>{let{reconstructSecret:e}=await import(`./dist-DVxUQaK0.js`);return{reconstructSecret:e}},__vite__mapDeps([5,6]),import.meta.url),t=e(o,c),n=new TextDecoder().decode(t),{validateMnemonic:r,restoreFromMnemonic:i}=await q(async()=>{let{validateMnemonic:e,restoreFromMnemonic:t}=await Promise.resolve().then(()=>Wn);return{validateMnemonic:e,restoreFromMnemonic:t}},void 0,import.meta.url),{wordlist:a}=await q(async()=>{let{wordlist:e}=await Promise.resolve().then(()=>Bn);return{wordlist:e}},void 0,import.meta.url);if(!r(n,a)){alert(`Reconstructed phrase is not a valid mnemonic. Please check your shares.`);return}let{root:l,defaultPersona:u}=i(n),d=Array.from(u.identity.privateKey,e=>e.toString(16).padStart(2,`0`)).join(``),f=Array.from(u.identity.publicKey,e=>e.toString(16).padStart(2,`0`)).join(``);l.destroy(),s({identity:{pubkey:f,privkey:d,mnemonic:n,signerType:`local`,displayName:`You`}}),await Sm()}catch(e){alert(e instanceof Error?e.message:`Failed to reconstruct secret from shares.`)}}),e.querySelector(`#nsec-login-form`)?.addEventListener(`submit`,async t=>{t.preventDefault();let n=e.querySelector(`#login-nsec`)?.value.trim();if(n)try{let e=l().identity,t=gs(n);if(t.type!==`nsec`){alert(`Not a valid nsec.`);return}let r=t.data,i=ym(r);s({identity:Zp({pubkey:ii(r),privkey:i,signerType:`local`,displayName:`You`},e)}),await Sm()}catch(e){alert(e instanceof Error?e.message:`Invalid nsec format.`)}}),e.querySelector(`#login-nip07`)?.addEventListener(`click`,async()=>{if(!ia()){alert(`No Nostr extension found. Install Alby, nos2x, or another NIP-07 extension and reload.`);return}try{let e=l().identity;s({identity:Zp({pubkey:await window.nostr.getPublicKey(),signerType:`nip07`,displayName:`You`},e)}),await Sm()}catch{alert(`Extension rejected the request.`)}});function d(){let t=e.querySelector(`#login-relay-list`);t&&(t.innerHTML=(l().settings.defaultWriteRelays??l().settings.defaultRelays).map((e,t)=>`
      <li style="display: flex; align-items: center; gap: 0.25rem; margin-bottom: 0.25rem;">
        <span class="settings-hint" style="flex: 1; font-size: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0;">${B(e)}</span>
        <button class="btn btn--ghost btn--sm login-relay-remove" data-relay-index="${t}" type="button" style="padding: 0 0.25rem; font-size: 0.7rem;">✕</button>
      </li>
    `).join(``),f())}function f(){e.querySelectorAll(`.login-relay-remove`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Number(e.dataset.relayIndex),n=[...l().settings.defaultWriteRelays??l().settings.defaultRelays];n.splice(t,1),s({settings:{...l().settings,defaultWriteRelays:n,defaultRelays:n}}),d()})})}f(),e.querySelector(`#login-relay-add`)?.addEventListener(`click`,()=>{let t=e.querySelector(`#login-relay-input`),n=t?.value.trim();if(!n||!Xp(n))return;let r=[...l().settings.defaultWriteRelays??l().settings.defaultRelays];r.includes(n)||(r.push(n),s({settings:{...l().settings,defaultWriteRelays:r,defaultRelays:r}}),d()),t&&(t.value=``)}),e.querySelector(`#login-relay-input`)?.addEventListener(`keydown`,t=>{t.key===`Enter`&&(t.preventDefault(),e.querySelector(`#login-relay-add`)?.click())})}async function Sm(){{let{identity:e,personas:t}=l();e?.privkey&&(Object.keys(t).length>0?xe(e,t):ye(e))}im(),window.location.hash===`#call`&&s({view:`call-demo`});let e=document.getElementById(`header`);e&&Is(e),am(),document.getElementById(`footer-sync-btn`)?.addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:sync-vault`))}),cm(),c(sm),c(Dm),hm(),um(),window.addEventListener(`hashchange`,()=>um()),vm(),sd().catch(()=>{})}function Cm(e){let t=document.getElementById(`notification-prompt`);t&&t.remove();let n=document.createElement(`div`);n.id=`notification-prompt`,n.className=`notification-prompt`;let r=document.createElement(`div`);r.className=`notification-prompt__text`;let i=document.createElement(`strong`);i.textContent=`Enable notifications?`;let a=document.createElement(`span`);a.textContent=`We’ll alert you in emergencies and remind you to check in.`,r.append(i,a);let o=document.createElement(`div`);o.className=`notification-prompt__actions`;let s=document.createElement(`button`);s.className=`btn btn--sm btn--primary`,s.textContent=`Enable`;let c=document.createElement(`button`);c.className=`btn btn--sm`,c.textContent=`Not now`,o.append(s,c),n.append(r,o),document.getElementById(`app`)?.appendChild(n),s.addEventListener(`click`,()=>{n.remove(),e()}),c.addEventListener(`click`,()=>n.remove())}function wm(){let e=document.getElementById(`notification-prompt`);e&&e.remove();let t=document.createElement(`div`);t.id=`notification-prompt`,t.className=`notification-prompt`;let n=document.createElement(`div`);n.className=`notification-prompt__text`;let r=document.createElement(`strong`);r.textContent=`Add to Home Screen`;let i=document.createElement(`span`);i.textContent=`To receive emergency alerts and liveness reminders, add CANARY to your home screen. Tap the share button, then "Add to Home Screen".`,n.append(r,i);let a=document.createElement(`div`);a.className=`notification-prompt__actions`;let o=document.createElement(`button`);o.className=`btn btn--sm`,o.textContent=`Got it`,a.append(o),t.append(n,a),document.getElementById(`app`)?.appendChild(t),o.addEventListener(`click`,()=>t.remove())}var Tm=null,Em=3e4;function Dm(){let{identity:e,groups:t}=l();e?.pubkey&&(!e.privkey&&e.signerType!==`nip07`||Object.keys(t).length!==0&&(Tm&&clearTimeout(Tm),Tm=setTimeout(()=>{let{identity:e,groups:t,personas:n,deletedGroupIds:r}=l();!e?.pubkey||Object.keys(t).length===0||(e.privkey?Bp(t,e.privkey,e.pubkey,n,r):e.signerType===`nip07`&&Up(t,e.pubkey,n,r))},Em)))}function Om(){Tm&&clearTimeout(Tm);let{identity:e,groups:t,personas:n,deletedGroupIds:r}=l();!e?.pubkey||Object.keys(t).length===0||(e.privkey?Bp(t,e.privkey,e.pubkey,n,r):e.signerType===`nip07`?Up(t,e.pubkey,n,r):null)?.then(()=>console.info(`[canary:vault] Vault published OK`)).catch(e=>{console.error(`[canary:vault] Vault publish FAILED:`,e),G(`Vault publish failed: ${e instanceof Error?e.message:e}`,`error`)})}async function km(){let{identity:e,groups:t,personas:n}=l();if(!e?.pubkey){G(`No identity — cannot sync`,`error`);return}if(!e.privkey&&e.signerType!==`nip07`){G(`No private key or extension — cannot sync`,`error`);return}let r=!e.privkey&&e.signerType===`nip07`,i=e.pubkey.slice(0,8);G(`Syncing as ${i}\u2026${r?` (NIP-07)`:``}`,`info`,3e3),console.info(`[canary:vault] Manual sync for pubkey ${i} (${r?`NIP-07`:`local key`})`);try{let{deletedGroupIds:a}=l();Object.keys(t).length>0&&(r?await Up(t,e.pubkey,n,a):await Bp(t,e.privkey,e.pubkey,n,a));let{waitForConnection:o}=await q(async()=>{let{waitForConnection:e}=await import(`./connect-Ce_17kge.js`);return{waitForConnection:e}},__vite__mapDeps([15,16,3,17]),import.meta.url);await o();let c=r?await Wp(e.pubkey):await Vp(e.privkey,e.pubkey),u=c?.groups;if(u&&Object.keys(u).length>0){let{groups:e}=l(),t=Yp(e,u,l().deletedGroupIds),n=Object.keys(t).length-Object.keys(e).length;s({groups:t}),Kr(),n>0?G(`Synced — ${n} new group(s) restored`,`success`):G(`Groups are in sync`,`success`,2e3)}else G(`No vault found for ${i}\u2026 — are both devices using the same identity?`,`warning`,5e3);if(c?.personas&&Object.keys(c.personas).length>0){let{personas:e}=l(),t={...e};for(let[e,n]of Object.entries(c.personas))t[e]?t[e]={...t[e],...n,npub:t[e].npub}:t[e]=n;s({personas:t})}}catch(e){console.error(`[canary:vault] Manual sync failed:`,e),G(`Sync failed: ${e instanceof Error?e.message:e}`,`error`)}}window.addEventListener(`pagehide`,()=>{Tm&&Om()});async function Am(){if(Lr())rm();else{Br();let{identity:e}=l();e?.pubkey?await Sm():xm()}}document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,()=>{Am()}):Am();export{Fe as a,Vn as i,Cs as n,ys as r,Mu as t};