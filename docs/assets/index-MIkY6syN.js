const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./maplibre-gl-M8MIwJma.js","./chunk-QTnfLwEv.js","./maplibre-gl-B2k4QVOw.css","./shamir-modal-Ip607TpO.js","./state-bZTa5D05.js","./types-C4CFP7V4.js","./escape-B_Hg2WOy.js","./dist-EKXgOgNQ.js","./sha2-BVaAH8hI.js","./linkage-proof-Dv0U3c6r.js","./persona-tree-Bj_vowVF.js","./persona-BPEQFwWF.js","./persona--Nt5lgWe.js","./hmac-BoYH8Ta2.js","./base-eQgr18fE.js","./export-modal-CGGwVxUB.js","./connect-CR1o--Iy.js","./utils-BKa5XZQI.js"])))=>i.map(i=>d[i]);
import{n as e,r as t,t as n}from"./chunk-QTnfLwEv.js";import{a as r,i,n as a,o,r as s,s as c,t as l}from"./types-C4CFP7V4.js";import{a as u,i as d,n as f,o as p,r as m,t as h}from"./state-bZTa5D05.js";import{_ as g,d as _,f as v,i as y,m as b,n as x,o as S,p as C,r as w,s as T,t as E,u as D,v as O,y as k}from"./sha2-BVaAH8hI.js";import{a as A,f as j,n as M,p as N,t as P,u as F}from"./persona--Nt5lgWe.js";import{t as I}from"./hmac-BoYH8Ta2.js";import{n as L,t as R}from"./base-eQgr18fE.js";import{a as ee,c as te,i as ne,l as re,n as ie,o as ae,r as oe,s as se,t as ce}from"./persona-BPEQFwWF.js";import{i as le,r as ue,t as z}from"./persona-tree-Bj_vowVF.js";import{c as de,d as fe,i as pe,m as me,o as he,r as ge,s as _e,t as ve}from"./utils-BKa5XZQI.js";import{a as ye,c as be,d as xe,f as Se,i as B,l as Ce,m as we,o as Te,p as Ee,r as De,s as Oe,t as ke,u as Ae}from"./connect-CR1o--Iy.js";import{a as je,i as Me,n as Ne,r as Pe,t as Fe}from"./pure-BiP5h0gQ.js";import{t as V}from"./escape-B_Hg2WOy.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var Ie=6e5,Le=16,Re=12;async function ze(e,t){let n=await crypto.subtle.importKey(`raw`,new TextEncoder().encode(e),`PBKDF2`,!1,[`deriveKey`]);return crypto.subtle.deriveKey({name:`PBKDF2`,salt:t,iterations:Ie,hash:`SHA-256`},n,{name:`AES-GCM`,length:256},!1,[`encrypt`,`decrypt`])}async function Be(e,t){let n=crypto.getRandomValues(new Uint8Array(Re)),r=await crypto.subtle.encrypt({name:`AES-GCM`,iv:n},t,new TextEncoder().encode(e)),i=new Uint8Array(n.length+new Uint8Array(r).length);i.set(n),i.set(new Uint8Array(r),n.length);let a=``;for(let e=0;e<i.length;e++)a+=String.fromCharCode(i[e]);return btoa(a)}async function Ve(e,t){let n=Uint8Array.from(atob(e),e=>e.charCodeAt(0)),r=n.slice(0,Re),i=n.slice(Re),a=await crypto.subtle.decrypt({name:`AES-GCM`,iv:r},t,i);return new TextDecoder().decode(a)}function He(){return crypto.getRandomValues(new Uint8Array(Le))}function Ue(e){return btoa(String.fromCharCode(...e))}function We(e){return Uint8Array.from(atob(e),e=>e.charCodeAt(0))}var Ge=Uint8Array.from([7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8]),Ke=Uint8Array.from(Array(16).fill(0).map((e,t)=>t)),qe=Ke.map(e=>(9*e+5)%16),Je=(()=>{let e=[[Ke],[qe]];for(let t=0;t<4;t++)for(let n of e)n.push(n[t].map(e=>Ge[e]));return e})(),Ye=Je[0],Xe=Je[1],Ze=[[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8],[12,13,11,15,6,9,9,7,12,15,11,13,7,8,7,7],[13,15,14,11,7,7,6,8,13,14,13,12,5,5,6,9],[14,11,12,14,8,6,5,5,15,12,15,14,9,9,8,6],[15,12,13,13,9,5,8,6,14,11,12,11,8,6,5,5]].map(e=>Uint8Array.from(e)),Qe=Ye.map((e,t)=>e.map(e=>Ze[t][e])),$e=Xe.map((e,t)=>e.map(e=>Ze[t][e])),et=Uint32Array.from([0,1518500249,1859775393,2400959708,2840853838]),tt=Uint32Array.from([1352829926,1548603684,1836072691,2053994217,0]);function nt(e,t,n,r){return e===0?t^n^r:e===1?t&n|~t&r:e===2?(t|~n)^r:e===3?t&r|n&~r:t^(n|~r)}var rt=new Uint32Array(16),it=class extends w{h0=1732584193;h1=-271733879;h2=-1732584194;h3=271733878;h4=-1009589776;constructor(){super(64,20,8,!0)}get(){let{h0:e,h1:t,h2:n,h3:r,h4:i}=this;return[e,t,n,r,i]}set(e,t,n,r,i){this.h0=e|0,this.h1=t|0,this.h2=n|0,this.h3=r|0,this.h4=i|0}process(e,t){for(let n=0;n<16;n++,t+=4)rt[n]=e.getUint32(t,!0);let n=this.h0|0,r=n,i=this.h1|0,a=i,o=this.h2|0,s=o,c=this.h3|0,l=c,u=this.h4|0,d=u;for(let e=0;e<5;e++){let t=4-e,f=et[e],p=tt[e],m=Ye[e],h=Xe[e],g=Qe[e],_=$e[e];for(let t=0;t<16;t++){let r=k(n+nt(e,i,o,c)+rt[m[t]]+f,g[t])+u|0;n=u,u=c,c=k(o,10)|0,o=i,i=r}for(let e=0;e<16;e++){let n=k(r+nt(t,a,s,l)+rt[h[e]]+p,_[e])+d|0;r=d,d=l,l=k(s,10)|0,s=a,a=n}}this.set(this.h1+o+l|0,this.h2+c+d|0,this.h3+u+r|0,this.h4+n+a|0,this.h0+i+s|0)}roundClean(){_(rt)}destroy(){this.destroyed=!0,_(this.buffer),this.set(0,0,0,0,0)}},at=C(()=>new it);function ot(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name===`Uint8Array`&&`BYTES_PER_ELEMENT`in e&&e.BYTES_PER_ELEMENT===1}function st(e,t){return Array.isArray(t)?t.length===0?!0:e?t.every(e=>typeof e==`string`):t.every(e=>Number.isSafeInteger(e)):!1}function ct(e){if(typeof e!=`function`)throw TypeError(`function expected`);return!0}function lt(e,t){if(typeof t!=`string`)throw TypeError(`${e}: string expected`);return!0}function ut(e){if(typeof e!=`number`)throw TypeError(`number expected, got ${typeof e}`);if(!Number.isSafeInteger(e))throw RangeError(`invalid integer: ${e}`)}function dt(e){if(!Array.isArray(e))throw TypeError(`array expected`)}function ft(e,t){if(!st(!0,t))throw TypeError(`${e}: array of strings expected`)}function pt(e,t){if(!st(!1,t))throw TypeError(`${e}: array of numbers expected`)}function mt(...e){let t=e=>e,n=(e,t)=>n=>e(t(n));return{encode:e.map(e=>e.encode).reduceRight(n,t),decode:e.map(e=>e.decode).reduce(n,t)}}function ht(e){let t=typeof e==`string`?e.split(``):e,n=t.length;ft(`alphabet`,t);let r=new Map(t.map((e,t)=>[e,t]));return{encode:r=>(dt(r),r.map(r=>{if(!Number.isSafeInteger(r)||r<0||r>=n)throw Error(`alphabet.encode: digit index outside alphabet "${r}". Allowed: ${e}`);return t[r]})),decode:t=>(dt(t),t.map(t=>{lt(`alphabet.decode`,t);let n=r.get(t);if(n===void 0)throw Error(`Unknown letter: "${t}". Allowed: ${e}`);return n}))}}function gt(e=``){return lt(`join`,e),{encode:t=>(ft(`join.decode`,t),t.join(e)),decode:t=>(lt(`join.decode`,t),t.split(e))}}function _t(e,t=`=`){return ut(e),lt(`padding`,t),{encode(n){for(ft(`padding.encode`,n);n.length*e%8;)n.push(t);return n},decode(n){ft(`padding.decode`,n);let r=n.length;if(r*e%8)throw Error(`padding: invalid, string should have whole number of bytes`);for(;r>0&&n[r-1]===t;r--)if((r-1)*e%8==0)throw Error(`padding: invalid, string has too much padding`);return n.slice(0,r)}}}function vt(e){return ct(e),{encode:e=>e,decode:t=>e(t)}}function yt(e,t,n){if(t<2)throw RangeError(`convertRadix: invalid from=${t}, base cannot be less than 2`);if(n<2)throw RangeError(`convertRadix: invalid to=${n}, base cannot be less than 2`);if(dt(e),!e.length)return[];let r=0,i=[],a=Array.from(e,e=>{if(ut(e),e<0||e>=t)throw Error(`invalid integer: ${e}`);return e}),o=a.length;for(;;){let e=0,s=!0;for(let i=r;i<o;i++){let o=a[i],c=t*e,l=c+o;if(!Number.isSafeInteger(l)||c/t!==e||l-o!==c)throw Error(`convertRadix: carry overflow`);let u=l/n;e=l%n;let d=Math.floor(u);if(a[i]=d,!Number.isSafeInteger(d)||d*n+e!==l)throw Error(`convertRadix: carry overflow`);if(s)d?s=!1:r=i;else continue}if(i.push(e),s)break}for(let t=0;t<e.length-1&&e[t]===0;t++)i.push(0);return i.reverse()}var bt=(e,t)=>t===0?e:bt(t,e%t),xt=(e,t)=>e+(t-bt(e,t)),St=(()=>{let e=[];for(let t=0;t<40;t++)e.push(2**t);return e})();function Ct(e,t,n,r){if(dt(e),t<=0||t>32)throw RangeError(`convertRadix2: wrong from=${t}`);if(n<=0||n>32)throw RangeError(`convertRadix2: wrong to=${n}`);if(xt(t,n)>32)throw Error(`convertRadix2: carry overflow from=${t} to=${n} carryBits=${xt(t,n)}`);let i=0,a=0,o=St[t],s=St[n]-1,c=[];for(let r of e){if(ut(r),r>=o)throw Error(`convertRadix2: invalid data word=${r} from=${t}`);if(i=i<<t|r,a+t>32)throw Error(`convertRadix2: carry overflow pos=${a} from=${t}`);for(a+=t;a>=n;a-=n)c.push((i>>a-n&s)>>>0);let e=St[a];if(e===void 0)throw Error(`invalid carry`);i&=e-1}if(i=i<<n-a&s,!r&&a>=t)throw Error(`Excess padding`);if(!r&&i>0)throw Error(`Non-zero padding: ${i}`);return r&&a>0&&c.push(i>>>0),c}function wt(e){return ut(e),{encode:t=>{if(!ot(t))throw TypeError(`radix.encode input should be Uint8Array`);return yt(Array.from(t),256,e)},decode:t=>(pt(`radix.decode`,t),Uint8Array.from(yt(t,e,256)))}}function Tt(e,t=!1){if(ut(e),e<=0||e>32)throw RangeError(`radix2: bits should be in (0..32]`);if(xt(8,e)>32||xt(e,8)>32)throw RangeError(`radix2: carry overflow`);return{encode:n=>{if(!ot(n))throw TypeError(`radix2.encode input should be Uint8Array`);return Ct(Array.from(n),8,e,!t)},decode:n=>(pt(`radix2.decode`,n),Uint8Array.from(Ct(n,e,8,t)))}}function Et(e){return ct(e),function(...t){try{return e.apply(null,t)}catch{}}}function Dt(e,t){if(ut(e),e<=0)throw RangeError(`checksum length must be positive: ${e}`);ct(t);let n=t;return{encode(t){if(!ot(t))throw TypeError(`checksum.encode: input should be Uint8Array`);let r=n(t).slice(0,e),i=new Uint8Array(t.length+e);return i.set(t),i.set(r,t.length),i},decode(t){if(!ot(t))throw TypeError(`checksum.decode: input should be Uint8Array`);let r=t.slice(0,-e),i=t.slice(-e),a=n(r).slice(0,e);for(let t=0;t<e;t++)if(a[t]!==i[t])throw Error(`Invalid checksum`);return r}}}mt(Tt(4),ht(`0123456789ABCDEF`),gt(``)),mt(Tt(5),ht(`ABCDEFGHIJKLMNOPQRSTUVWXYZ234567`),_t(5),gt(``)),mt(Tt(5),ht(`ABCDEFGHIJKLMNOPQRSTUVWXYZ234567`),gt(``)),mt(Tt(5),ht(`0123456789ABCDEFGHIJKLMNOPQRSTUV`),_t(5),gt(``)),mt(Tt(5),ht(`0123456789ABCDEFGHIJKLMNOPQRSTUV`),gt(``)),mt(Tt(5),ht(`0123456789ABCDEFGHJKMNPQRSTVWXYZ`),gt(``),vt(e=>e.toUpperCase().replace(/O/g,`0`).replace(/[IL]/g,`1`)));var Ot=typeof Uint8Array.from([]).toBase64==`function`&&typeof Uint8Array.fromBase64==`function`;Ot||mt(Tt(6),ht(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`),_t(6),gt(``)),mt(Tt(6),ht(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`),gt(``)),Ot||mt(Tt(6),ht(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`),_t(6),gt(``)),mt(Tt(6),ht(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`),gt(``));var kt=Object.freeze((e=>mt(wt(58),ht(e),gt(``)))(`123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz`)),At=e=>{ct(e);let t=e;return mt(Dt(4,e=>t(t(e))),kt)},jt=mt(ht(`qpzry9x8gf2tvdw0s3jn54khce6mua7l`),gt(``)),Mt=[996825010,642813549,513874426,1027748829,705979059];function Nt(e){let t=e>>25,n=(e&33554431)<<5;for(let e=0;e<Mt.length;e++)(t>>e&1)==1&&(n^=Mt[e]);return n}function Pt(e,t,n=1){let r=e.length,i=1;for(let t=0;t<r;t++){let n=e.charCodeAt(t);if(n<33||n>126)throw Error(`Invalid prefix (${e})`);i=Nt(i)^n>>5}i=Nt(i);for(let t=0;t<r;t++)i=Nt(i)^e.charCodeAt(t)&31;for(let e of t)i=Nt(i)^e;for(let e=0;e<6;e++)i=Nt(i);return i^=n,jt.encode(Ct([i%St[30]],30,5,!1))}function Ft(e){let t=e===`bech32`?1:734539939,n=Tt(5),r=n.decode,i=n.encode,a=Et(r);function o(e,n,r=90){lt(`bech32.encode prefix`,e),ot(n)&&(n=Array.from(n)),pt(`bech32.encode`,n);let i=e.length;if(i===0)throw TypeError(`Invalid prefix length ${i}`);let a=i+7+n.length;if(r!==!1&&a>r)throw TypeError(`Length ${a} exceeds limit ${r}`);let o=e.toLowerCase(),s=Pt(o,n,t);return`${o}1${jt.encode(n)}${s}`}function s(e,n=90){lt(`bech32.decode input`,e);let r=e.length;if(r<8||n!==!1&&r>n)throw TypeError(`invalid string length: ${r} (${e}). Expected (8..${n})`);let i=e.toLowerCase();if(e!==i&&e!==e.toUpperCase())throw Error(`String must be lowercase or uppercase`);let a=i.lastIndexOf(`1`);if(a===0||a===-1)throw Error(`Letter "1" must be present between prefix and data only`);let o=i.slice(0,a),s=i.slice(a+1);if(s.length<6)throw Error(`Data must be at least 6 characters long`);let c=jt.decode(s).slice(0,-6),l=Pt(o,c,t);if(!s.endsWith(l))throw Error(`Invalid checksum in ${e}: expected "${l}"`);return{prefix:o,words:c}}let c=Et(s);function l(e){let{prefix:t,words:n}=s(e,!1);return{prefix:t,words:n,bytes:r(n)}}function u(e,t){return o(e,i(t))}return{encode:o,decode:s,encodeFromBytes:u,decodeToBytes:l,decodeUnsafe:c,fromWords:r,fromWordsUnsafe:a,toWords:i}}Ft(`bech32`),Ft(`bech32m`),typeof Uint8Array.from([]).toHex==`function`&&typeof Uint8Array.fromHex==`function`||mt(Tt(4),ht(`0123456789abcdef`),gt(``),vt(e=>{if(typeof e!=`string`||e.length%2!=0)throw TypeError(`hex.decode: expected string, got ${typeof e} with length ${e.length}`);return e.toLowerCase()}));var It=N.Point,Lt=It.Fn,Rt=At(E),zt=Uint8Array.from(`Bitcoin seed`.split(``),e=>e.charCodeAt(0)),Bt={private:76066276,public:76067358},Vt=2147483648,Ht=e=>at(E(e)),Ut=e=>b(e).getUint32(0,!1),Wt=e=>{if(typeof e!=`number`)throw TypeError(`invalid number, should be from 0 to 2**32-1, got `+e);if(!Number.isSafeInteger(e)||e<0||e>2**32-1)throw RangeError(`invalid number, should be from 0 to 2**32-1, got `+e);let t=new Uint8Array(4);return b(t).setUint32(0,e,!1),t},Gt=class e{get fingerprint(){if(!this.pubHash)throw Error(`No publicKey set!`);return Ut(this.pubHash)}get identifier(){return this.pubHash}get pubKeyHash(){return this.pubHash}get privateKey(){return this._privateKey||null}get publicKey(){return this._publicKey||null}get privateExtendedKey(){let e=this._privateKey;if(!e)throw Error(`No private key`);return Rt.encode(this.serialize(this.versions.private,v(Uint8Array.of(0),e)))}get publicExtendedKey(){if(!this._publicKey)throw Error(`No public key`);return Rt.encode(this.serialize(this.versions.public,this._publicKey))}static fromMasterSeed(t,n=Bt){if(y(t),8*t.length<128||8*t.length>512)throw RangeError(`HDKey: seed length must be between 128 and 512 bits; 256 bits is advised, got `+t.length);let r=I(x,zt,t),i=r.slice(0,32);return new e({versions:n,chainCode:r.slice(32),privateKey:i})}static fromExtendedKey(t,n=Bt){let r=Rt.decode(t),i=b(r),a=i.getUint32(0,!1),o={versions:n,depth:r[4],parentFingerprint:i.getUint32(5,!1),index:i.getUint32(9,!1),chainCode:r.slice(13,45)},s=r.slice(45),c=s[0]===0;if(a!==n[c?`private`:`public`])throw Error(`Version mismatch`);return c?new e({...o,privateKey:s.slice(1)}):new e({...o,publicKey:s})}static fromJSON(t){return e.fromExtendedKey(t.xpriv)}versions;depth=0;index=0;chainCode=null;parentFingerprint=0;_privateKey;_publicKey;pubHash;constructor(e){if(!e||typeof e!=`object`)throw Error(`HDKey.constructor must not be called directly`);if(this.versions=e.versions||Bt,this.depth=e.depth||0,this.chainCode=e.chainCode?Uint8Array.from(e.chainCode):null,this.index=e.index||0,this.parentFingerprint=e.parentFingerprint||0,!this.depth&&(this.parentFingerprint||this.index))throw Error(`HDKey: zero depth with non-zero index/parent fingerprint`);if(this.depth>255)throw Error(`HDKey: depth exceeds the serializable value 255`);if(e.publicKey&&e.privateKey)throw Error(`HDKey: publicKey and privateKey at same time.`);if(e.privateKey){if(!N.utils.isValidSecretKey(e.privateKey))throw Error(`Invalid private key`);this._privateKey=Uint8Array.from(e.privateKey),this._publicKey=N.getPublicKey(this._privateKey,!0)}else if(e.publicKey)this._publicKey=It.fromBytes(e.publicKey).toBytes(!0);else throw Error(`HDKey: no public or private key provided`);this.pubHash=Ht(this._publicKey)}derive(e){if(!/^[mM]'?/.test(e))throw Error(`Path must start with "m" or "M"`);if(/^[mM]'?$/.test(e))return this;let t=e.replace(/^[mM]'?\//,``).split(`/`),n=this;for(let e of t){let t=/^(\d+)('?)$/.exec(e),r=t&&t[1];if(!t||t.length!==3||typeof r!=`string`)throw Error(`invalid child index: `+e);let i=+r;if(!Number.isSafeInteger(i)||i>=2147483648)throw Error(`Invalid index`);t[2]===`'`&&(i+=Vt),n=n.deriveChild(i)}return n}deriveChild(t,n){if(!this._publicKey||!this.chainCode)throw Error(`No publicKey or chainCode set`);let r=Wt(t);if(t>=2147483648){let e=this._privateKey;if(!e)throw Error(`Could not derive hardened child key`);r=v(Uint8Array.of(0),e,r)}else r=v(this._publicKey,r);let i=n||I(x,this.chainCode,r);y(i,64);let a=i.slice(0,32),o=i.slice(32),s={versions:this.versions,chainCode:o,depth:this.depth+1,parentFingerprint:this.fingerprint,index:t};if(s.depth>255)throw Error(`HDKey: depth exceeds the serializable value 255`);try{let t=Lt.fromBytes(a);if(this._privateKey){let e=Lt.create(Lt.fromBytes(this._privateKey)+t);if(!Lt.isValidNot0(e))throw Error(`The tweak was out of range or the resulted private key is invalid`);s.privateKey=Lt.toBytes(e)}else{let e=It.fromBytes(this._publicKey),n=t===0n?e:e.add(It.BASE.multiply(t));if(n.equals(It.ZERO))throw Error(`The tweak was equal to negative P, which made the result key invalid`);s.publicKey=n.toBytes(!0)}return new e(s)}catch{return this.deriveChild(t+1)}}sign(e){if(!this._privateKey)throw Error(`No privateKey set!`);return y(e,32),N.sign(e,this._privateKey,{prehash:!1})}verify(e,t){if(y(e,32),y(t,64),!this._publicKey)throw Error(`No publicKey set!`);return N.verify(t,e,this._publicKey,{prehash:!1})}wipePrivateData(){return this._privateKey&&=(this._privateKey.fill(0),void 0),this}toJSON(){return{xpriv:this.privateExtendedKey,xpub:this.publicExtendedKey}}serialize(e,t){if(!this.chainCode)throw Error(`No chainCode set`);return y(t,33),v(Wt(e),new Uint8Array([this.depth]),Wt(this.parentFingerprint),Wt(this.index),this.chainCode,t)}};function Kt(e,t,n,r){S(e);let{c:i,dkLen:a,asyncTick:o}=D({dkLen:32,asyncTick:10},r);if(T(i,`c`),T(a,`dkLen`),T(o,`asyncTick`),i<1)throw Error(`iterations (c) must be >= 1`);if(a<1)throw Error(`"dkLen" must be >= 1`);if(a>(2**32-1)*e.outputLen)throw Error(`derived key too long`);let s=g(t,`password`),c=g(n,`salt`),l=new Uint8Array(a),u=I.create(e,s);return{c:i,dkLen:a,asyncTick:o,DK:l,PRF:u,PRFSalt:u._cloneInto().update(c)}}function qt(e,t,n,r,i){return e.destroy(),t.destroy(),r&&r.destroy(),_(i),n}function Jt(e,t,n,r){let{c:i,dkLen:a,DK:o,PRF:s,PRFSalt:c}=Kt(e,t,n,r),l,u=new Uint8Array(4),d=b(u),f=new Uint8Array(s.outputLen);for(let e=1,t=0;t<a;e++,t+=s.outputLen){let n=o.subarray(t,t+s.outputLen);d.setInt32(0,e,!1),(l=c._cloneInto(l)).update(u).digestInto(f),n.set(f.subarray(0,n.length));for(let e=1;e<i;e++){s._cloneInto(l).update(f).digestInto(f);for(let e=0;e<n.length;e++)n[e]^=f[e]}}return qt(s,c,o,l,f)}function Yt(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name===`Uint8Array`&&`BYTES_PER_ELEMENT`in e&&e.BYTES_PER_ELEMENT===1}function Xt(e,t){return Array.isArray(t)?t.length===0?!0:e?t.every(e=>typeof e==`string`):t.every(e=>Number.isSafeInteger(e)):!1}function Zt(e){if(typeof e!=`function`)throw TypeError(`function expected`);return!0}function Qt(e,t){if(typeof t!=`string`)throw TypeError(`${e}: string expected`);return!0}function $t(e){if(typeof e!=`number`)throw TypeError(`number expected, got ${typeof e}`);if(!Number.isSafeInteger(e))throw RangeError(`invalid integer: ${e}`)}function en(e){if(!Array.isArray(e))throw TypeError(`array expected`)}function tn(e,t){if(!Xt(!0,t))throw TypeError(`${e}: array of strings expected`)}function nn(e,t){if(!Xt(!1,t))throw TypeError(`${e}: array of numbers expected`)}function rn(...e){let t=e=>e,n=(e,t)=>n=>e(t(n));return{encode:e.map(e=>e.encode).reduceRight(n,t),decode:e.map(e=>e.decode).reduce(n,t)}}function an(e){let t=typeof e==`string`?e.split(``):e,n=t.length;tn(`alphabet`,t);let r=new Map(t.map((e,t)=>[e,t]));return{encode:r=>(en(r),r.map(r=>{if(!Number.isSafeInteger(r)||r<0||r>=n)throw Error(`alphabet.encode: digit index outside alphabet "${r}". Allowed: ${e}`);return t[r]})),decode:t=>(en(t),t.map(t=>{Qt(`alphabet.decode`,t);let n=r.get(t);if(n===void 0)throw Error(`Unknown letter: "${t}". Allowed: ${e}`);return n}))}}function on(e=``){return Qt(`join`,e),{encode:t=>(tn(`join.decode`,t),t.join(e)),decode:t=>(Qt(`join.decode`,t),t.split(e))}}function sn(e,t=`=`){return $t(e),Qt(`padding`,t),{encode(n){for(tn(`padding.encode`,n);n.length*e%8;)n.push(t);return n},decode(n){tn(`padding.decode`,n);let r=n.length;if(r*e%8)throw Error(`padding: invalid, string should have whole number of bytes`);for(;r>0&&n[r-1]===t;r--)if((r-1)*e%8==0)throw Error(`padding: invalid, string has too much padding`);return n.slice(0,r)}}}function cn(e){return Zt(e),{encode:e=>e,decode:t=>e(t)}}function ln(e,t,n){if(t<2)throw RangeError(`convertRadix: invalid from=${t}, base cannot be less than 2`);if(n<2)throw RangeError(`convertRadix: invalid to=${n}, base cannot be less than 2`);if(en(e),!e.length)return[];let r=0,i=[],a=Array.from(e,e=>{if($t(e),e<0||e>=t)throw Error(`invalid integer: ${e}`);return e}),o=a.length;for(;;){let e=0,s=!0;for(let i=r;i<o;i++){let o=a[i],c=t*e,l=c+o;if(!Number.isSafeInteger(l)||c/t!==e||l-o!==c)throw Error(`convertRadix: carry overflow`);let u=l/n;e=l%n;let d=Math.floor(u);if(a[i]=d,!Number.isSafeInteger(d)||d*n+e!==l)throw Error(`convertRadix: carry overflow`);if(s)d?s=!1:r=i;else continue}if(i.push(e),s)break}for(let t=0;t<e.length-1&&e[t]===0;t++)i.push(0);return i.reverse()}var un=(e,t)=>t===0?e:un(t,e%t),dn=(e,t)=>e+(t-un(e,t)),fn=(()=>{let e=[];for(let t=0;t<40;t++)e.push(2**t);return e})();function pn(e,t,n,r){if(en(e),t<=0||t>32)throw RangeError(`convertRadix2: wrong from=${t}`);if(n<=0||n>32)throw RangeError(`convertRadix2: wrong to=${n}`);if(dn(t,n)>32)throw Error(`convertRadix2: carry overflow from=${t} to=${n} carryBits=${dn(t,n)}`);let i=0,a=0,o=fn[t],s=fn[n]-1,c=[];for(let r of e){if($t(r),r>=o)throw Error(`convertRadix2: invalid data word=${r} from=${t}`);if(i=i<<t|r,a+t>32)throw Error(`convertRadix2: carry overflow pos=${a} from=${t}`);for(a+=t;a>=n;a-=n)c.push((i>>a-n&s)>>>0);let e=fn[a];if(e===void 0)throw Error(`invalid carry`);i&=e-1}if(i=i<<n-a&s,!r&&a>=t)throw Error(`Excess padding`);if(!r&&i>0)throw Error(`Non-zero padding: ${i}`);return r&&a>0&&c.push(i>>>0),c}function mn(e){return $t(e),{encode:t=>{if(!Yt(t))throw TypeError(`radix.encode input should be Uint8Array`);return ln(Array.from(t),256,e)},decode:t=>(nn(`radix.decode`,t),Uint8Array.from(ln(t,e,256)))}}function hn(e,t=!1){if($t(e),e<=0||e>32)throw RangeError(`radix2: bits should be in (0..32]`);if(dn(8,e)>32||dn(e,8)>32)throw RangeError(`radix2: carry overflow`);return{encode:n=>{if(!Yt(n))throw TypeError(`radix2.encode input should be Uint8Array`);return pn(Array.from(n),8,e,!t)},decode:n=>(nn(`radix2.decode`,n),Uint8Array.from(pn(n,e,8,t)))}}function gn(e){return Zt(e),function(...t){try{return e.apply(null,t)}catch{}}}function _n(e,t){if($t(e),e<=0)throw RangeError(`checksum length must be positive: ${e}`);Zt(t);let n=t;return{encode(t){if(!Yt(t))throw TypeError(`checksum.encode: input should be Uint8Array`);let r=n(t).slice(0,e),i=new Uint8Array(t.length+e);return i.set(t),i.set(r,t.length),i},decode(t){if(!Yt(t))throw TypeError(`checksum.decode: input should be Uint8Array`);let r=t.slice(0,-e),i=t.slice(-e),a=n(r).slice(0,e);for(let t=0;t<e;t++)if(a[t]!==i[t])throw Error(`Invalid checksum`);return r}}}var vn=Object.freeze({alphabet:an,chain:rn,checksum:_n,convertRadix:ln,convertRadix2:pn,radix:mn,radix2:hn,join:on,padding:sn});rn(hn(4),an(`0123456789ABCDEF`),on(``)),rn(hn(5),an(`ABCDEFGHIJKLMNOPQRSTUVWXYZ234567`),sn(5),on(``)),rn(hn(5),an(`ABCDEFGHIJKLMNOPQRSTUVWXYZ234567`),on(``)),rn(hn(5),an(`0123456789ABCDEFGHIJKLMNOPQRSTUV`),sn(5),on(``)),rn(hn(5),an(`0123456789ABCDEFGHIJKLMNOPQRSTUV`),on(``)),rn(hn(5),an(`0123456789ABCDEFGHJKMNPQRSTVWXYZ`),on(``),cn(e=>e.toUpperCase().replace(/O/g,`0`).replace(/[IL]/g,`1`)));var yn=typeof Uint8Array.from([]).toBase64==`function`&&typeof Uint8Array.fromBase64==`function`;yn||rn(hn(6),an(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`),sn(6),on(``)),rn(hn(6),an(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`),on(``)),yn||rn(hn(6),an(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`),sn(6),on(``)),rn(hn(6),an(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`),on(``));var bn=rn(an(`qpzry9x8gf2tvdw0s3jn54khce6mua7l`),on(``)),xn=[996825010,642813549,513874426,1027748829,705979059];function Sn(e){let t=e>>25,n=(e&33554431)<<5;for(let e=0;e<xn.length;e++)(t>>e&1)==1&&(n^=xn[e]);return n}function Cn(e,t,n=1){let r=e.length,i=1;for(let t=0;t<r;t++){let n=e.charCodeAt(t);if(n<33||n>126)throw Error(`Invalid prefix (${e})`);i=Sn(i)^n>>5}i=Sn(i);for(let t=0;t<r;t++)i=Sn(i)^e.charCodeAt(t)&31;for(let e of t)i=Sn(i)^e;for(let e=0;e<6;e++)i=Sn(i);return i^=n,bn.encode(pn([i%fn[30]],30,5,!1))}function wn(e){let t=e===`bech32`?1:734539939,n=hn(5),r=n.decode,i=n.encode,a=gn(r);function o(e,n,r=90){Qt(`bech32.encode prefix`,e),Yt(n)&&(n=Array.from(n)),nn(`bech32.encode`,n);let i=e.length;if(i===0)throw TypeError(`Invalid prefix length ${i}`);let a=i+7+n.length;if(r!==!1&&a>r)throw TypeError(`Length ${a} exceeds limit ${r}`);let o=e.toLowerCase(),s=Cn(o,n,t);return`${o}1${bn.encode(n)}${s}`}function s(e,n=90){Qt(`bech32.decode input`,e);let r=e.length;if(r<8||n!==!1&&r>n)throw TypeError(`invalid string length: ${r} (${e}). Expected (8..${n})`);let i=e.toLowerCase();if(e!==i&&e!==e.toUpperCase())throw Error(`String must be lowercase or uppercase`);let a=i.lastIndexOf(`1`);if(a===0||a===-1)throw Error(`Letter "1" must be present between prefix and data only`);let o=i.slice(0,a),s=i.slice(a+1);if(s.length<6)throw Error(`Data must be at least 6 characters long`);let c=bn.decode(s).slice(0,-6),l=Cn(o,c,t);if(!s.endsWith(l))throw Error(`Invalid checksum in ${e}: expected "${l}"`);return{prefix:o,words:c}}let c=gn(s);function l(e){let{prefix:t,words:n}=s(e,!1);return{prefix:t,words:n,bytes:r(n)}}function u(e,t){return o(e,i(t))}return{encode:o,decode:s,encodeFromBytes:u,decodeToBytes:l,decodeUnsafe:c,fromWords:r,fromWordsUnsafe:a,toWords:i}}wn(`bech32`),wn(`bech32m`),typeof Uint8Array.from([]).toHex==`function`&&typeof Uint8Array.fromHex==`function`||rn(hn(4),an(`0123456789abcdef`),on(``),cn(e=>{if(typeof e!=`string`||e.length%2!=0)throw TypeError(`hex.decode: expected string, got ${typeof e} with length ${e.length}`);return e.toLowerCase()}));var Tn=e({entropyToMnemonic:()=>Pn,generateMnemonic:()=>An,mnemonicToEntropy:()=>Nn,mnemonicToSeedSync:()=>Ln,validateMnemonic:()=>Fn}),En=e=>e[0]===`あいこくしん`;function Dn(e){if(typeof e!=`string`)throw TypeError(`invalid mnemonic type: `+typeof e);return e.normalize(`NFKD`)}function On(e){let t=Dn(e),n=t.split(` `);if(![12,15,18,21,24].includes(n.length))throw Error(`Invalid mnemonic`);return{nfkd:t,words:n}}function kn(e){if(y(e),![16,20,24,28,32].includes(e.length))throw RangeError(`invalid entropy length`)}function An(e,t=128){if(T(t),t%32!=0||t>256)throw RangeError(`Invalid entropy`);return Pn(O(t/8),e)}var jn=e=>{let t=8-e.length/4;return new Uint8Array([E(e)[0]>>t<<t])};function Mn(e){if(!Array.isArray(e)||e.length!==2048||typeof e[0]!=`string`)throw TypeError(`Wordlist: expected array of 2048 strings`);return e.forEach(e=>{if(typeof e!=`string`)throw TypeError(`wordlist: non-string element: `+e)}),vn.chain(vn.checksum(1,jn),vn.radix2(11,!0),vn.alphabet(e))}function Nn(e,t){let{words:n}=On(e),r=Mn(t).decode(n);return kn(r),r}function Pn(e,t){return kn(e),Mn(t).encode(e).join(En(t)?`　`:` `)}function Fn(e,t){try{Nn(e,t)}catch{return!1}return!0}var In=e=>Dn(`mnemonic`+e);function Ln(e,t=``){return Jt(x,On(e).nfkd,In(t),{c:2048,dkLen:64})}var Rn=e({wordlist:()=>zn}),zn=Object.freeze(`abandon
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
`)),Bn=`m/44'/1237'/727'/0'/0'`;function Vn(e,t){if(typeof e!=`string`)throw new F(`mnemonic must be a string`);if(t!==void 0&&typeof t!=`string`)throw new F(`passphrase must be a string`);if(!Fn(e,zn))throw new F(`Invalid BIP-39 mnemonic`);let n=Ln(e,t),r=Gt.fromMasterSeed(n),i=r.derive(Bn);if(!i.privateKey)throw new F(`Failed to derive private key at nsec-tree path`);let a=new Uint8Array(i.privateKey);n.fill(0),i.privateKey&&i.privateKey.fill(0),r.privateKey&&r.privateKey.fill(0);let o=A(a);return a.fill(0),o}var Hn=e({restoreFromMnemonic:()=>Un,validateMnemonic:()=>Fn});function Un(e){if(!Fn(e,zn))throw Error(`Invalid mnemonic`);let t=Vn(e);return{root:t,defaultPersona:M(t,`personal`,0)}}var Wn=`canary:duress-queue`,Gn=null,Kn=null,qn=null;function Jn(e){Gn=e.encrypt,Kn=e.decrypt,qn=e.getPinKey}function Yn(e){return Array.isArray(e)?e.every(e=>typeof e==`object`&&!!e&&typeof e.groupId==`string`&&e.message!=null):!1}async function Xn(){try{let e=localStorage.getItem(Wn);if(!e)return[];let t=JSON.parse(e);if(Yn(t))return t;if(t&&typeof t==`object`&&typeof t.entries==`string`){if(t.encrypted&&Kn&&qn){let e=qn();if(!e)return[];let n=await Kn(t.entries,e),r=JSON.parse(n);return Yn(r)?r:[]}let e=JSON.parse(t.entries);return Yn(e)?e:[]}return[]}catch{return[]}}async function Zn(e){try{let t=JSON.stringify(e);if(Gn&&qn){let e=qn();if(e){let n=await Gn(t,e);localStorage.setItem(Wn,JSON.stringify({encrypted:!0,entries:n}));return}}localStorage.setItem(Wn,JSON.stringify({entries:t}))}catch{}}async function Qn(e){let t=await Xn(),n=t.filter(t=>t.groupId===e);return await Zn(t.filter(t=>t.groupId!==e)),n.map(e=>e.message)}var $n=`canary:groups`,er=`canary:identity`,tr=`canary:settings`,nr=`canary:pin-salt`,rr=`canary:active-group`,ir=`canary:mnemonic`,ar=null;function or(e){ar=e}function sr(){ar=null}var cr=i([l,...a]),lr={theme:`dark`,pinEnabled:!0,autoLockMinutes:5,knownRelays:cr,defaultRelays:[l],defaultReadRelays:[...a,l],defaultWriteRelays:[l]};function ur(e){try{let t=localStorage.getItem(e);return t===null?null:JSON.parse(t)}catch{return null}}function dr(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch{}}function fr(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function pr(e){return fr(e)&&e._encrypted===!0&&typeof e.ciphertext==`string`}async function mr(e,t){return{_encrypted:!0,ciphertext:await Be(JSON.stringify(e),t)}}async function hr(e,t){return JSON.parse(await Ve(e.ciphertext,t))}function gr(e){return fr(e)?Object.values(e).some(e=>fr(e)&&e._seedEncrypted===!0):!1}function _r(e){return fr(e)&&e._privkeyEncrypted===!0}function vr(){return localStorage.getItem(nr)}function yr(){let e=Ue(He());return localStorage.setItem(nr,e),e}function br(){localStorage.removeItem(nr)}async function xr(e,t){let n={};for(let[r,i]of Object.entries(e)){let{_seedEncrypted:e,...a}=i;n[r]={...a,seed:e?await Ve(i.seed,t):i.seed}}return n}function Sr(e){if(Array.isArray(e.readRelays)||Array.isArray(e.writeRelays))return{readRelays:Cr(e.readRelays,[]),writeRelays:Cr(e.writeRelays,[])};let t=e.relays??[],n=t.length>0?t:[l];return{readRelays:i([...a,...n]),writeRelays:Cr(n,[])}}function Cr(e,t){return Array.isArray(e)?i(e.filter(e=>typeof e==`string`)):[...t]}function wr(e){let t=e??{},n=Cr(t.defaultRelays,lr.defaultRelays),r=Cr(t.defaultReadRelays,lr.defaultReadRelays),a=Cr(t.defaultWriteRelays,lr.defaultWriteRelays),o=i([...cr,...n,...r,...a]),s=i([...Cr(t.knownRelays,t.knownRelays===void 0?o:[]),...n,...r,...a]);return{...lr,...t,knownRelays:s,defaultRelays:n,defaultReadRelays:r,defaultWriteRelays:a}}function Tr(e){if(!fr(e))return{};let t={};for(let[n,r]of Object.entries(e)){if(!fr(r)||typeof r.name!=`string`)continue;let e=Sr(r),a=i([...Cr(r.knownRelays,[]),...Cr(r.relays,[]),...e.readRelays,...e.writeRelays]);t[n]={...r,id:n,usedInvites:Array.isArray(r.usedInvites)?r.usedInvites.filter(e=>typeof e==`string`):[],latestInviteIssuedAt:typeof r.latestInviteIssuedAt==`number`?r.latestInviteIssuedAt:0,tolerance:typeof r.tolerance==`number`?r.tolerance:1,livenessInterval:typeof r.livenessInterval==`number`?r.livenessInterval:typeof r.rotationInterval==`number`?r.rotationInterval:604800,livenessCheckins:fr(r.livenessCheckins)?Object.fromEntries(Object.entries(r.livenessCheckins).filter(([,e])=>typeof e==`number`).map(([e,t])=>[e,t])):{},memberNames:fr(r.memberNames)?Object.fromEntries(Object.entries(r.memberNames).filter(([,e])=>typeof e==`string`).map(([e,t])=>[e,t])):void 0,lastPositions:fr(r.lastPositions)?Object.fromEntries(Object.entries(r.lastPositions).filter(([,e])=>fr(e)).map(([e,t])=>[e,t])):void 0,beaconPrecision:typeof r.beaconPrecision==`number`?r.beaconPrecision:5,duressPrecision:typeof r.duressPrecision==`number`?r.duressPrecision:9,nostrEnabled:typeof r.nostrEnabled==`boolean`?r.nostrEnabled:e.writeRelays.length>0||e.readRelays.length>0,knownRelays:a,...e}}return t}function Er(e){if(!fr(e)||typeof e.pubkey!=`string`)return null;let t=typeof e.signerMethod==`string`&&[`nip07`,`redirect`,`bunker`,`nsec`,`amber`].includes(e.signerMethod)?e.signerMethod:void 0;return{pubkey:e.pubkey,privkey:typeof e.privkey==`string`?e.privkey:void 0,nsec:typeof e.nsec==`string`?e.nsec:void 0,mnemonic:typeof e.mnemonic==`string`?e.mnemonic:void 0,displayName:typeof e.displayName==`string`?e.displayName:void 0,picture:typeof e.picture==`string`?e.picture:void 0,signerMethod:t,signerType:e.signerType===`nip07`?`nip07`:`local`}}function Dr(e){let t=localStorage.getItem(ir);if(!t)return{identity:e,migrated:!1};let n=e,r=t.trim().replace(/\s+/g,` `);try{n&&Fn(r)&&(n={...n,mnemonic:r})}catch{}return localStorage.removeItem(ir),{identity:n,migrated:!0}}function Or(e,t){if(typeof e==`string`&&e in t)return e;let n=Object.keys(t);return n.length>0?n[0]:null}async function kr(e){let t=ur($n);if(t===null)return{groups:{},migrated:!1};if(pr(t)){if(!e)throw Error(`Encrypted groups require PIN unlock`);return{groups:Tr(await hr(t,e)),migrated:!1}}if(gr(t)){if(!e)throw Error(`Encrypted groups require PIN unlock`);return{groups:Tr(await xr(t,e)),migrated:!0}}return{groups:Tr(t),migrated:e!==void 0}}function Ar(){let e=ur($n);return e===null||pr(e)||gr(e)?{groups:{},migrated:!1}:{groups:Tr(e),migrated:!1}}async function jr(e){let t=ur(er);if(t===null)return Dr(null);if(pr(t)){if(!e)throw Error(`Encrypted identity requires PIN unlock`);return Dr(Er(await hr(t,e)))}let n=t,r=e!==void 0;if(_r(t)){if(!e)throw Error(`Encrypted identity requires PIN unlock`);let i=t.privkey?await Ve(t.privkey,e):void 0,{_privkeyEncrypted:a,...o}=t;n={...o,privkey:i},r=!0}let i=Dr(Er(n));return{identity:i.identity,migrated:r||i.migrated}}function Mr(){let e=ur(er);return e===null||pr(e)||_r(e)?Dr(null):Dr(Er(e))}async function Nr(e){let t=ur(rr);if(t===null)return{activeGroupId:null,migrated:!1};if(pr(t)){if(!e)throw Error(`Encrypted active group requires PIN unlock`);let n=await hr(t,e);return{activeGroupId:typeof n==`string`?n:null,migrated:!1}}return{activeGroupId:typeof t==`string`?t:null,migrated:e!==void 0}}function Pr(){let e=ur(rr);return e===null||pr(e)?{activeGroupId:null,migrated:!1}:{activeGroupId:typeof e==`string`?e:null,migrated:!1}}async function Fr(e,t){if(t){let[n,r,i]=await Promise.all([mr(e.groups,t),mr(e.identity,t),mr(e.activeGroupId,t)]);dr($n,n),dr(er,r),dr(rr,i)}else dr($n,e.groups),dr(er,e.identity),e.activeGroupId===null?localStorage.removeItem(rr):dr(rr,e.activeGroupId);dr(tr,e.settings),localStorage.removeItem(ir)}async function Ir(){let e=f(),t=!!vr();if(e.settings.pinEnabled&&t&&ar===null){console.error(`[canary:storage] PIN enabled but key not loaded — state NOT persisted.`);return}try{await Fr(e,e.settings.pinEnabled&&ar!==null?ar:void 0)}catch(e){console.error(`[canary:storage] Persistence failed — state NOT persisted:`,e)}}function Lr(){return localStorage.getItem(nr)!==null}function Rr(){return wr(ur(tr))}async function zr(e){let t=vr();if(!t)throw Error(`No PIN salt found`);let n=await ze(e,We(t)),r=wr(ur(tr)),[i,a,o]=await Promise.all([kr(n),jr(n),Nr(n)]),s={view:`groups`,groups:i.groups,activeGroupId:Or(o.activeGroupId,i.groups),identity:a.identity,settings:r,personas:{},activePersonaId:null,deletedGroupIds:[]};or(n),m(s),(i.migrated||a.migrated||o.migrated)&&await Fr(s,n)}function Br(){let e=wr(ur(tr)),t=Ar(),n=Mr(),r=Pr();m({view:`groups`,groups:t.groups,activeGroupId:Or(r.activeGroupId,t.groups),identity:n.identity,settings:e,personas:{},activePersonaId:null,deletedGroupIds:[]}),(t.migrated||n.migrated||r.migrated)&&Ir()}var Vr=0,Hr,Ur=Promise.resolve(),Wr=100;function Gr(){Jn({encrypt:Be,decrypt:Ve,getPinKey:()=>ar}),d(()=>{let e=++Vr;clearTimeout(Hr),Hr=setTimeout(()=>{Ur=Ur.then(async()=>{e===Vr&&await Ir()}).catch(e=>{console.error(`[canary:storage] Serialised write failed:`,e)})},Wr)}),window.addEventListener(`pagehide`,()=>Kr())}function Kr(){clearTimeout(Hr),Vr++,Ir().catch(()=>{})}async function qr(e){let t=await ze(e,We(yr()));or(t);try{let e=f();await Fr({...e,settings:{...e.settings,pinEnabled:!0}},t)}catch(e){throw sr(),br(),e}}async function Jr(){let e=f();await Fr({...e,settings:{...e.settings,pinEnabled:!1}}),sr(),br()}var Yr=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],Xr=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]);function Zr(e,t){return(e>>>t|e<<32-t)>>>0}function Qr(e){let t=e.length*8,n=new Uint8Array(Math.ceil((e.length+9)/64)*64);n.set(e),n[e.length]=128;let r=new DataView(n.buffer);r.setUint32(n.length-8,Math.floor(t/4294967296),!1),r.setUint32(n.length-4,t>>>0,!1);let[i,a,o,s,c,l,u,d]=Yr,f=new Uint32Array(64);for(let e=0;e<n.length;e+=64){for(let t=0;t<16;t++)f[t]=r.getUint32(e+t*4,!1);for(let e=16;e<64;e++){let t=f[e-15],n=f[e-2],r=Zr(t,7)^Zr(t,18)^t>>>3,i=Zr(n,17)^Zr(n,19)^n>>>10;f[e]=f[e-16]+r+f[e-7]+i>>>0}let t=i,n=a,p=o,m=s,h=c,g=l,_=u,v=d;for(let e=0;e<64;e++){let r=Zr(h,6)^Zr(h,11)^Zr(h,25),i=h&g^~h&_,a=v+r+i+Xr[e]+f[e]>>>0,o=(Zr(t,2)^Zr(t,13)^Zr(t,22))+(t&n^t&p^n&p)>>>0;v=_,_=g,g=h,h=m+a>>>0,m=p,p=n,n=t,t=a+o>>>0}i=i+t>>>0,a=a+n>>>0,o=o+p>>>0,s=s+m>>>0,c=c+h>>>0,l=l+g>>>0,u=u+_>>>0,d=d+v>>>0}n.fill(0),f.fill(0);let p=new Uint8Array(32),m=new DataView(p.buffer);return m.setUint32(0,i,!1),m.setUint32(4,a,!1),m.setUint32(8,o,!1),m.setUint32(12,s,!1),m.setUint32(16,c,!1),m.setUint32(20,l,!1),m.setUint32(24,u,!1),m.setUint32(28,d,!1),p}var $r=64;function ei(e,t){let n=e.length>$r?Qr(e):e,r=new Uint8Array($r);r.set(n);let i=new Uint8Array($r),a=new Uint8Array($r);for(let e=0;e<$r;e++)i[e]=r[e]^54,a[e]=r[e]^92;let o=ii(i,t),s=Qr(o),c=ii(a,s),l=Qr(c);return r.fill(0),i.fill(0),a.fill(0),s.fill(0),o.fill(0),c.fill(0),n!==e&&n.fill(0),l}function ti(){let e=new Uint8Array(32);crypto.getRandomValues(e);let t=ni(e);return e.fill(0),t}function H(e){if(e.length%2!=0)throw Error(`hexToBytes: odd-length hex string (${e.length} chars)`);let t=new Uint8Array(e.length/2);for(let n=0;n<t.length;n++){let r=e.slice(n*2,n*2+2);if(!/^[0-9a-fA-F]{2}$/.test(r))throw TypeError(`Invalid hex character at position ${n*2}`);t[n]=parseInt(r,16)}return t}function ni(e){let t=``;for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,`0`);return t}function ri(e,t){if(!Number.isInteger(t)||t<0||t+2>e.length)throw RangeError(`readUint16BE: offset ${t} out of bounds for length ${e.length}`);return(e[t]<<8|e[t+1])>>>0}function ii(...e){let t=e.reduce((e,t)=>e+t.length,0),n=new Uint8Array(t),r=0;for(let t of e)n.set(t,r),r+=t.length;return n}function ai(e){let t=``;for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return btoa(t)}function oi(e){let t=atob(e),n=new Uint8Array(t.length);for(let e=0;e<t.length;e++)n[e]=t.charCodeAt(e);return n}function si(e,t){let n=Math.max(e.length,t.length),r=new Uint8Array(n),i=new Uint8Array(n);r.set(e),i.set(t);let a=e.length^t.length;for(let e=0;e<n;e++)a|=r[e]^i[e];return a===0}var ci=new TextEncoder;function li(e,t){return si(ci.encode(e),ci.encode(t))}var ui=`ability.able.about.above.absent.absorb.abstract.absurd.access.accident.account.accuse.achieve.acid.acorn.acoustic.acquire.across.act.action.actor.actress.actual.adapt.add.addict.address.adjust.admiral.admit.adult.advance.advice.aerobic.affair.afford.afraid.again.age.agent.agree.ahead.aim.air.airport.aisle.alarm.album.alcohol.alert.alien.all.alley.allow.almost.alone.alpha.alpine.already.also.always.amateur.amazing.amber.among.amount.amused.analyst.anchor.ancient.anger.angle.animal.ankle.announce.annual.another.answer.antenna.antique.anvil.anxiety.any.apart.apology.appear.apple.approve.april.apron.arch.arctic.area.arena.argue.arm.armed.armor.army.around.arrange.arrive.arrow.art.artefact.artist.artwork.ask.aspect.asset.assist.assume.asthma.athlete.atom.attack.attend.attitude.attract.auction.audit.august.aunt.author.auto.autumn.average.avocado.avoid.awake.aware.away.awesome.awful.awkward.axis.baby.bachelor.bacon.badge.badger.bag.bakery.balance.balcony.ball.balm.bamboo.banana.banjo.banner.bar.barely.bargain.barrel.base.basic.basil.basket.battle.beach.beacon.bean.beauty.because.become.beef.beetle.before.begin.behave.behind.belfry.believe.below.belt.bench.benefit.berry.best.better.between.beyond.bicycle.bid.bike.bind.biology.birch.bird.birth.bishop.bitter.black.blame.blanket.bleak.bless.bloom.blossom.blouse.blue.blur.blush.board.boat.bobcat.body.boil.bone.bonfire.bonus.book.boost.border.boring.borrow.boss.bottom.bounce.bouquet.box.boy.bracket.brain.branch.brand.brass.brave.bread.breaker.breeze.brick.bridge.brief.bright.bring.brisk.broccoli.bronze.brook.broom.brother.brown.brush.bubble.buckle.buddy.budget.buffalo.bugle.build.bulb.bulk.bumble.bundle.bunker.burger.burrow.burst.bus.bushel.business.busy.butter.buyer.buzz.cabbage.cabin.cable.cactus.cage.cairn.cake.call.calm.camel.camera.camp.can.canal.cancel.candy.canoe.canopy.canvas.canyon.capable.cape.capital.captain.car.caravan.carbon.card.cargo.carpet.carry.cart.case.cash.casino.castle.casual.cat.catalog.catch.category.cattle.caught.cause.caution.cave.cedar.ceiling.celery.cellar.cement.census.century.cereal.certain.chair.chalk.champion.change.chapter.charge.charter.chase.chat.cheap.check.cheese.chef.cherry.chest.chestnut.chicken.chief.child.chimney.choice.choose.chuckle.chunk.churn.cider.cigar.cinnamon.circle.citizen.city.civil.claim.clam.clap.clarify.claw.clay.clean.clerk.clever.click.client.cliff.climb.clinic.clip.cloak.clock.clog.close.cloth.cloud.clown.club.clump.cluster.clutch.coach.coast.cobalt.cocoa.coconut.code.codex.coffee.coil.coin.collect.color.column.combine.come.comet.comfort.comic.common.company.concert.condor.conduct.confirm.congress.connect.consider.consul.control.convince.cook.cool.copper.copy.coral.core.cork.corn.cornet.correct.cosmos.cost.cotton.couch.cougar.country.couple.course.cousin.cover.coyote.crack.cradle.craft.cram.crane.crater.crawl.cream.credit.creek.crew.cricket.crisp.critic.croft.crop.cross.crouch.crowd.crown.crucial.cruise.crumble.crunch.cry.crystal.cube.culture.cup.cupboard.curious.current.curtain.curve.cushion.custom.cute.cycle.cypress.dad.dagger.dahlia.damp.damsel.dance.danger.dapple.daring.dash.daughter.dawn.day.deal.debate.decade.december.decide.decline.decorate.decrease.defense.define.defy.degree.delay.deliver.delta.demand.demise.denial.denim.dentist.depart.depend.deposit.depot.depth.deputy.derive.describe.desert.design.desk.detail.detect.develop.device.devote.diagram.dial.diamond.diary.dice.diesel.diet.differ.digital.dignity.dilemma.dinner.dinosaur.direct.dirt.disagree.discover.dish.display.distance.divert.divide.divorce.dizzy.doctor.document.dog.doll.dolphin.domain.donate.donkey.donor.door.dorsal.double.dove.draft.drafter.dragon.drake.drama.drastic.draw.dream.dress.drift.drifter.drill.drink.drive.drop.droplet.drum.drummer.dry.duck.dulcet.dune.dungeon.during.dusk.dust.dutch.duty.dwarf.dynamic.eager.eagle.early.earn.earth.easily.east.easy.echo.ecology.economy.edge.edgeway.edit.educate.effort.egg.eight.either.elbow.elder.electric.elegant.element.elephant.elevator.elite.elm.else.embark.ember.embody.embrace.emerald.emerge.emotion.employ.empower.empty.enable.enact.end.endless.endorse.enemy.energy.enforce.engage.engine.enhance.enjoy.enlist.enough.enrich.enroll.ensign.ensure.enter.entire.entry.envelope.episode.epoch.equal.equip.era.erase.erode.erosion.error.escape.essay.essence.estate.estuary.eternal.ether.ethics.everest.evidence.evil.evolve.exact.example.exchange.excite.exclude.excuse.execute.exercise.exhaust.exhibit.exist.exit.exotic.expand.expect.explain.express.extend.extra.eye.eyebrow.fabric.face.faculty.fade.faint.faith.falcon.fall.fallow.false.fame.family.famous.fancy.fantasy.farm.fashion.fat.father.fathom.fatigue.favorite.feature.february.federal.fee.feed.feel.female.fence.fennel.fern.festival.fetch.fever.fiber.fiction.fiddle.field.figure.file.film.filter.final.finch.find.finger.finish.fire.firm.first.fiscal.fish.fit.fitness.fix.fjord.flag.flagon.flame.flannel.flash.flat.flavor.flicker.flight.flint.flip.float.flock.floor.floret.fluid.flush.flutter.fly.foal.foam.focus.fog.foil.fold.follow.food.foot.force.forest.forge.forget.fork.fortune.forum.forward.fossil.foster.found.foundry.fox.foxglove.fragile.frame.frequent.fresco.fresh.friend.fringe.frog.front.frost.frown.frozen.fruit.fuel.fun.funny.furnace.furrow.future.gadget.gain.galaxy.gallery.galley.game.gap.garage.garbage.garden.garland.garlic.garment.garnet.gas.gasp.gate.gather.gauge.gaze.gazelle.general.genius.genre.gentle.genuine.gesture.geyser.giant.gibbon.gift.giggle.ginger.giraffe.girl.give.glacier.glad.glance.glare.glass.glen.glide.glimpse.globe.gloom.glory.glove.glow.glue.goat.goblet.goddess.gold.golden.good.goose.gopher.gorge.gorilla.gospel.gossip.govern.gown.grab.grace.grain.granite.grant.grape.grass.gravity.great.green.grid.grocery.group.grow.grunt.guard.guess.guide.guilt.guitar.guppy.gust.gym.habit.half.hamlet.hammer.hammock.hamster.hand.happy.harbor.hard.harness.harvest.hat.have.hawk.hawthorn.head.health.heart.hearth.heavy.hedgehog.height.hello.helmet.help.hen.herald.hermit.hero.heron.hickory.hidden.high.hill.hint.hip.hire.history.hobby.hockey.hold.hole.holiday.hollow.home.homeward.honey.hood.hope.horizon.horn.hornet.horse.hospital.host.hotel.hour.hover.howler.hub.huge.human.humble.humor.hundred.hungry.hunt.hunter.hurdle.hurry.husband.hybrid.ice.icon.idea.identify.idle.igloo.ignore.ill.image.imitate.immune.impact.improve.inch.include.income.increase.index.indicate.indigo.indoor.industry.infant.inflict.inform.inhale.inherit.initial.inject.inkwell.inlet.inmate.inner.innocent.input.inquiry.insect.inside.inspire.install.intact.interest.into.invest.invite.involve.inward.iris.iron.island.issue.item.ivory.jacket.jade.jaguar.jar.jasmine.javelin.jazz.jeans.jelly.jersey.jewel.job.join.joke.jostle.journal.journey.joy.jubilee.judge.juice.jumble.jump.junco.jungle.junior.juniper.just.kangaroo.kayak.keen.keep.keeper.kelp.kennel.kernel.kestrel.ketchup.kettle.key.kick.kid.kidney.kind.kindle.kingdom.kinglet.kipper.kiss.kit.kitchen.kite.kitten.kiwi.knapsack.knee.knife.knock.lab.label.labor.ladder.lady.lake.lamp.language.lantern.lapis.laptop.larch.large.later.latin.laugh.laundry.laurel.lava.lavender.law.lawn.layer.lazy.leader.leaf.learn.leave.lecture.left.leg.legal.legend.leisure.lemon.lend.length.lens.leopard.lesson.letter.level.liar.liberty.library.license.lichen.life.lift.light.like.limit.linden.link.linnet.lion.liquid.list.little.live.lizard.llama.load.loan.lobster.local.lock.locust.lodge.logic.long.loom.loop.lottery.lotus.loud.lounge.love.loyal.lucky.luggage.lumber.lumen.lunar.lunch.luxury.machine.mackerel.magic.magnet.main.major.make.mammal.man.manage.mandate.mango.mansion.mantis.manual.maple.marble.march.margin.marine.market.marriage.marsh.marten.mask.masonry.mass.master.match.material.math.matrix.matter.maximum.maze.meadow.mean.measure.mechanic.medal.media.melody.melt.member.memory.mention.menu.mercy.merge.merit.merlin.merry.mesa.mesh.message.metal.method.micron.middle.midnight.milk.millet.million.mimic.mind.minimum.minnow.minor.minute.miracle.mirage.mirror.miss.mistake.mix.mixed.mixture.moat.mobile.model.modify.mohawk.mom.moment.monarch.mongrel.monitor.monkey.month.moon.moose.moral.more.morning.mortar.mosaic.mosquito.mother.motion.motor.mountain.mouse.move.movie.much.muffin.mullet.multiply.muscle.museum.mushroom.music.muslin.mussel.must.mustang.mutual.myrtle.myself.mystery.myth.naive.name.napkin.narrow.narwhal.nation.nature.near.neck.nectar.need.negative.neither.nephew.nest.nester.net.nettle.network.neutral.never.news.newt.next.nice.nimble.noble.noggin.noise.nomad.nominee.noodle.normal.north.nose.notable.note.nothing.notice.novel.now.nuclear.number.nurse.nut.nutmeg.oak.oakmoss.oasis.obey.object.oblige.observe.obsidian.obtain.ocean.octave.october.odor.off.offer.office.often.oil.okay.old.olive.olympic.omit.once.onion.online.only.onyx.opal.open.opera.opinion.oppose.option.orange.orbit.orchard.orchid.order.ordinary.organ.orient.original.oriole.orphan.osprey.ostrich.other.otter.outdoor.outer.outpost.output.outside.oval.oven.over.own.owner.oxygen.oyster.ozone.pact.paddle.page.pagoda.palace.palm.panda.panel.panther.paper.parade.parent.park.parrot.party.pass.patch.path.patient.patrol.pattern.pause.pave.payment.peanut.peasant.pelican.pen.pencil.people.pepper.perfect.permit.person.phone.photo.phrase.physical.piano.picnic.picture.pigeon.pill.pilot.pink.pioneer.pipe.pitch.pizza.place.planet.plastic.plate.play.please.pledge.pluck.plug.poem.poet.point.polar.pole.police.pond.pony.pool.popular.portion.position.possible.post.potato.pottery.powder.power.practice.praise.predict.prefer.prepare.present.pretty.prevent.price.pride.primary.print.priority.private.prize.process.produce.profit.program.project.promote.proof.property.prosper.protect.proud.provide.public.pudding.pull.pulp.pulse.pumpkin.puppy.purchase.purity.purpose.purse.push.put.puzzle.pyramid.quality.quantum.quarter.question.quick.quiz.quote.rabbit.race.rack.radar.radio.rail.rain.raise.rally.ramp.ranch.random.range.rapid.rare.rate.rather.raven.raw.razor.ready.real.reason.rebuild.recall.receive.recipe.record.recycle.reduce.reflect.reform.refuse.region.regular.relax.release.relief.rely.remain.remember.remove.render.renew.rent.reopen.repair.repeat.replace.report.require.rescue.resource.response.result.retire.retreat.return.reunion.reveal.review.reward.rhythm.rib.ribbon.rice.rich.ride.ridge.rifle.ring.ripple.risk.ritual.rival.river.road.roast.robot.robust.rocket.romance.roof.rookie.room.rose.rotate.round.route.royal.rubber.rug.rule.run.runway.rural.saddle.sadness.safe.salad.salmon.salon.salt.salute.same.sample.sand.satisfy.satoshi.sauce.sausage.save.say.scale.scan.school.science.scorpion.scout.screen.script.scrub.search.season.seat.second.secret.section.security.seed.seek.segment.select.sell.seminar.senior.sense.sentence.service.session.settle.setup.seven.shadow.shallow.share.shed.shell.sheriff.shield.shift.shine.shoe.shoot.shop.short.shoulder.shove.shrimp.shuffle.shy.sibling.sick.side.sight.sign.silent.silk.silly.silver.similar.simple.since.sister.situate.six.size.skate.sketch.ski.skill.skin.skirt.slab.slam.sleep.slice.slide.slight.slim.small.smart.smile.smooth.snack.snake.snow.soap.soccer.social.sock.soda.soft.solar.soldier.solid.solution.solve.someone.song.soon.sort.soul.sound.soup.source.south.space.spare.spatial.speak.special.speed.spell.spend.sphere.spice.spider.spike.spin.spirit.spoil.sponsor.spoon.sport.spot.spray.spread.spring.spy.square.squirrel.stable.stadium.staff.stage.stairs.stamp.stand.start.state.stay.steak.stem.step.stereo.stick.still.stock.stomach.stone.stool.story.stove.strategy.street.strong.student.style.subject.submit.subway.success.such.sudden.sugar.suggest.suit.summer.sunny.sunset.super.supply.supreme.sure.surface.surge.surprise.surround.survey.sustain.swap.swarm.sweet.swift.swim.swing.switch.sword.symbol.syrup.system.table.tackle.tag.talent.talk.tape.task.taste.taxi.teach.team.tell.tennis.term.test.text.thank.theme.then.theory.they.this.thought.thrive.throw.thumb.thunder.ticket.tide.tiger.tilt.timber.time.tiny.tip.tired.tissue.title.toast.today.toddler.together.toilet.token.tomato.tomorrow.tone.tonight.tool.tooth.top.topic.topple.torch.tortoise.toss.total.tourist.tower.town.toy.track.trade.traffic.train.transfer.trap.travel.tray.treat.trend.tribe.trick.trigger.trim.trip.trophy.truck.true.trumpet.truth.try.tuition.tunnel.turkey.turn.turtle.twelve.twenty.twice.twin.twist.two.type.typical.umbrella.unable.unaware.uncle.uncover.under.undo.unfair.unfold.uniform.unique.unit.universe.unknown.unlock.until.unusual.update.upgrade.uphold.upon.upper.upset.urban.urge.usage.use.used.useful.useless.usual.utility.vague.valid.valley.valve.vapor.various.vast.vehicle.velvet.vendor.venue.verb.verify.version.very.vessel.veteran.viable.vibrant.vicious.victory.video.village.vintage.violin.virtual.visa.visit.visual.vital.vivid.vocal.voice.volcano.vote.voyage.wagon.walk.wall.walnut.want.warm.warrior.wash.wasp.water.wave.way.wealth.weasel.web.wedding.weekend.welcome.west.wet.whale.what.wheat.wheel.when.whip.whisper.wide.width.wife.wild.will.win.window.wine.wing.wink.winner.winter.wire.wisdom.wise.wish.witness.wolf.woman.wonder.wool.word.work.world.worry.worth.wreck.wrestle.yard.year.yellow.you.young.youth.zebra.zero.zone.zoo`.split(`.`);Object.freeze(ui);var di=2048,fi=new Map;for(let e=0;e<ui.length;e++)fi.set(ui[e],e);function pi(e){if(!Number.isInteger(e)||e<0||e>=2048)throw RangeError(`Wordlist index out of range: ${e} (must be an integer 0-${di-1})`);return ui[e]}var mi={format:`words`,count:1};function hi(e,t=1,n=ui){if(n.length!==2048)throw RangeError(`Wordlist must contain exactly 2048 entries`);if(!Number.isInteger(t)||t<1||t>16)throw RangeError(`Word count must be an integer 1–16`);if(e.length<t*2)throw RangeError(`Not enough bytes for requested word count`);let r=[];for(let i=0;i<t;i++){let t=ri(e,i*2)%n.length;r.push(n[t])}return r}var gi=[0,2,2,3,3,3,4,4,5,5,6];function _i(e,t=4){if(!Number.isInteger(t)||t<1||t>10)throw RangeError(`PIN digits must be an integer 1–10`);if(e.length===0)throw RangeError(`Cannot encode empty byte array as PIN`);let n=gi[t];if(e.length<n)throw RangeError(`Not enough bytes for ${t}-digit PIN: need ${n}, got ${e.length}`);let r=10**t;if(n>4){let i=0n;for(let t=0;t<n;t++)i=i*256n+BigInt(e[t]);return Number(i%BigInt(r)).toString().padStart(t,`0`)}let i=0;for(let t=0;t<n;t++)i=i*256+e[t]>>>0;return(i%r).toString().padStart(t,`0`)}function vi(e,t=8){if(!Number.isInteger(t)||t<1||t>64)throw RangeError(`Hex length must be an integer 1–64`);let n=Math.ceil(t/2);if(e.length<n)throw RangeError(`Not enough bytes: need ${n}, got ${e.length}`);let r=``;for(let t=0;t<n&&t<e.length;t++)r+=e[t].toString(16).padStart(2,`0`);return r.slice(0,t)}function yi(e,t=mi){switch(t.format){case`words`:return hi(e,t.count??1,t.wordlist).join(` `);case`pin`:return _i(e,t.digits??4);case`hex`:return vi(e,t.length??8);default:throw Error(`Unsupported encoding format: ${t.format}`)}}var bi=new TextEncoder;function xi(e){return bi.encode(e)}function Si(e){if(!Number.isInteger(e)||e<0||e>4294967295)throw RangeError(`Counter must be an integer 0–4294967295, got ${e}`);let t=new Uint8Array(4);return new DataView(t.buffer).setUint32(0,e,!1),t}var Ci=16;function wi(e){let t=typeof e==`string`?H(e):e;if(t.length<Ci)throw RangeError(`Secret must be at least ${Ci} bytes, got ${t.length}`);return t}function Ti(e,t,n,r){if(!t||!t.trim())throw Error(`context must be a non-empty string`);if(r!==void 0&&!r.trim())throw Error(`identity must be a non-empty string when provided`);if(r!==void 0&&r.includes(`\0`))throw Error(`identity must not contain null bytes`);return ei(wi(e),r?ii(xi(t),new Uint8Array([0]),xi(r),Si(n)):ii(xi(t),Si(n)))}function Ei(e,t,n,r){if(t.includes(`\0`))throw Error(`context must not contain null bytes`);return Ti(e,t,n,r)}function Di(e,t,n,r=mi,i){if(t.includes(`\0`))throw Error(`context must not contain null bytes`);if(i!==void 0&&i.includes(`\0`))throw Error(`identity must not contain null bytes`);return yi(Ei(e,t,n,i),r)}function Oi(e,t,n,r,i=mi){if(!t||!t.trim())throw Error(`namespace must be a non-empty string`);if(t.includes(`\0`))throw Error(`namespace must not contain null bytes`);if(!n[0]||!n[1]||!n[0].trim()||!n[1].trim())throw Error(`Both roles must be non-empty strings`);if(n[0].includes(`\0`)||n[1].includes(`\0`))throw Error(`Roles must not contain null bytes`);if(n[0]===n[1])throw Error(`Roles must be distinct, got ["${n[0]}", "${n[1]}"]`);return{[n[0]]:yi(Ti(e,`pair\0${t}\0${n[0]}`,r),i),[n[1]]:yi(Ti(e,`pair\0${t}\0${n[1]}`,r),i)}}var ki=604800;function Ai(e,t=ki){if(!Number.isFinite(e)||e<0)throw RangeError(`timestampSec must be a non-negative finite number, got ${e}`);if(!Number.isFinite(t)||t<=0)throw RangeError(`rotationIntervalSec must be a positive finite number, got ${t}`);let n=Math.floor(e/t);if(n>4294967295)throw RangeError(`Counter exceeds uint32 range (${n}). Use a larger rotation interval.`);return n}function ji(e){return new TextEncoder().encode(e)}var Mi=/^[0-9a-f]{64}$/;function Ni(e){if(!Mi.test(e))throw Error(`seedHex must be a 64-character lowercase hex string (32 bytes)`)}function Pi(e){if(e.length!==32)throw Error(`AES-256-GCM requires a 32-byte key`)}function Fi(e){return Ni(e),ei(H(e),ji(`canary:sync:key`))}async function Ii(e,t){Pi(e);let n=crypto.getRandomValues(new Uint8Array(12)),r=await crypto.subtle.importKey(`raw`,e,{name:`AES-GCM`},!1,[`encrypt`]),i=await crypto.subtle.encrypt({name:`AES-GCM`,iv:n},r,ji(t));return ai(ii(n,new Uint8Array(i)))}async function Li(e,t){Pi(e);let n=oi(t);if(n.length<28)throw Error(`decryptEnvelope: encoded data too short (minimum 28 bytes: 12-byte IV + 16-byte GCM tag)`);let r=n.slice(0,12),i=n.slice(12),a=await crypto.subtle.importKey(`raw`,e,{name:`AES-GCM`},!1,[`decrypt`]),o;try{o=await crypto.subtle.decrypt({name:`AES-GCM`,iv:r},a,i)}catch{throw Error(`decryptEnvelope: decryption failed — wrong key or tampered data`)}return new TextDecoder().decode(o)}function Ri(e,t,n){return P(e,`canary:group:${t}`,n)}function zi(e){return ni(Qr(ji(e)))}var Bi=new TextEncoder;function Vi(e){return Bi.encode(e)}function Hi(e){if(!Number.isInteger(e)||e<0||e>4294967295)throw RangeError(`Counter must be an integer 0–4294967295, got ${e}`);let t=new Uint8Array(4);return new DataView(t.buffer).setUint32(0,e,!1),t}var Ui=16,Wi=100;function Gi(e){let t=typeof e==`string`?H(e):e;if(t.length<Ui)throw RangeError(`Secret must be at least ${Ui} bytes, got ${t.length}`);return t}function Ki(e,t,n,r,i=mi,a,o){if(!Number.isInteger(a)||a<0)throw RangeError(`maxTolerance must be a non-negative integer`);if(a>10)throw RangeError(`maxTolerance must be <= 10, got ${a}`);let s=new Set,c=2*a,l=Math.max(0,r-c),u=Math.min(4294967295,r+c);for(let n=l;n<=u;n++)if(s.add(Di(e,t,n,i)),o)for(let r of o)s.add(Di(e,t,n,i,r));let d=Gi(e),f=ii(Vi(t+`:duress`),new Uint8Array([0]),Vi(n),Hi(r)),p=ei(d,f),m=yi(p,i),h=1;for(;s.has(m)&&h<=255;)p=ei(d,ii(f,new Uint8Array([h]))),m=yi(p,i),h++;if(s.has(m))throw Error(`Duress token collision unresolvable after 255 retries`);return m}function qi(e,t,n,r,i,a){let o=a?.encoding??mi,s=a?.tolerance??0;if(!Number.isInteger(s)||s<0)throw RangeError(`Tolerance must be a non-negative integer`);if(s>10)throw RangeError(`Tolerance must be <= 10, got ${s}`);if(i.length>Wi)throw RangeError(`identities array must not exceed ${Wi} entries, got ${i.length}`);let c=r.toLowerCase().trim().replace(/\s+/g,` `),l=Math.max(0,n-s),u=Math.min(4294967295,n+s),d=null;for(let r of i)li(c,Di(e,t,n,o,r))&&(d=r);let f=[];for(let n of i){let r=!1;for(let a=l;a<=u;a++)li(c,Ki(e,t,n,a,o,s,i))&&(r=!0);r&&f.push(n)}let p=null;for(let r of i)for(let i=l;i<=u;i++)i!==n&&li(c,Di(e,t,i,o,r))&&(p=r);let m=!1;for(let n=l;n<=u;n++)li(c,Di(e,t,n,o))&&(m=!0);return f.length>0?{status:`duress`,identities:f}:d?{status:`valid`,identities:[d]}:p?{status:`valid`,identities:[p]}:m?{status:`valid`}:{status:`invalid`}}function Ji(e,t,n,r){return ei(Gi(e),ii(Vi(t+`:alive`),new Uint8Array([0]),Vi(n),Hi(r)))}var Yi=Object.freeze({family:Object.freeze({wordCount:1,rotationInterval:ki,description:`Casual verification for family and friends. Single word, weekly rotation. Adequate for live voice/video calls where the attacker gets one attempt. NOT suitable for text-based verification — 11 bits of entropy is trivially brute-forceable without rate limiting.`}),"field-ops":Object.freeze({wordCount:2,rotationInterval:86400,description:`High-security preset for journalism, activism, and field operations. Two-word phrases (~22 bits) with daily rotation. Use burn-after-use for maximum protection.`}),enterprise:Object.freeze({wordCount:2,rotationInterval:172800,description:`Enterprise incident response. Two-word phrases with 48-hour rotation. Balances security with operational convenience for larger teams.`}),event:Object.freeze({wordCount:1,rotationInterval:14400,description:`Temporary groups for conferences, festivals, and meetups. Single word with 4-hour rotation. Fast setup, easy to share at the door.`})}),Xi=/^[0-9a-f]{64}$/,Zi=100;function Qi(e){if(!Xi.test(e))throw Error(`Invalid member pubkey: expected 64 hex characters, got ${e.length} chars`)}function $i(e){if(typeof e.name!=`string`||e.name.length===0)throw Error(`name must be a non-empty string`);if(e.name.length>256)throw Error(`name must be at most 256 characters`);if(e.preset!==void 0&&(typeof e.preset!=`string`||!Object.hasOwn(Yi,e.preset)))throw Error(`Unknown preset: "${e.preset}". Valid presets: ${Object.keys(Yi).join(`, `)}`);let t=Math.floor(Date.now()/1e3),n=e.preset===void 0?void 0:Yi[e.preset],r=e.rotationInterval??n?.rotationInterval??604800,i=e.wordCount??n?.wordCount??1,a=e.tolerance??1;if(!Number.isInteger(r)||r<=0)throw Error(`rotationInterval must be a positive integer, got ${r}`);if(i!==1&&i!==2&&i!==3)throw Error(`wordCount must be 1, 2, or 3, got ${i}`);if(!Number.isInteger(a)||a<0||a>10)throw RangeError(`tolerance must be an integer 0–10, got ${a}`);if(e.beaconInterval!==void 0&&(!Number.isInteger(e.beaconInterval)||e.beaconInterval<=0))throw Error(`beaconInterval must be a positive integer, got ${e.beaconInterval}`);if(e.beaconPrecision!==void 0&&(!Number.isInteger(e.beaconPrecision)||e.beaconPrecision<1||e.beaconPrecision>11))throw Error(`beaconPrecision must be an integer between 1 and 11, got ${e.beaconPrecision}`);for(let t of e.members)Qi(t);if(new Set(e.members).size!==e.members.length)throw Error(`Duplicate pubkeys in members array`);if(e.creator!==void 0&&(Qi(e.creator),!e.members.includes(e.creator)))throw Error(`creator must be in members`);return i===1&&e.members.length>=10&&console.warn(`[canary-kit] Group has ${e.members.length} members with 1-word encoding. CANARY spec recommends 2+ words for groups of 10+ members to avoid duress collision (~2.2% at 10 members).`),{name:e.name,seed:ti(),members:[...e.members],rotationInterval:r,wordCount:i,tolerance:a,wordlist:e.wordlist??`en-v1`,counter:Ai(t,r),usageOffset:0,createdAt:t,beaconInterval:e.beaconInterval??300,beaconPrecision:e.beaconPrecision??6,admins:e.creator?[e.creator]:[],epoch:0,consumedOps:[]}}function ea(e){let t=Ai(Math.floor(Date.now()/1e3),e.rotationInterval),n=e.counter+e.usageOffset+1;if(n>t+100)throw RangeError(`Cannot advance counter: effective counter ${n} would exceed time-based counter ${t} + MAX_COUNTER_OFFSET (100)`);return{...e,usageOffset:e.usageOffset+1}}function ta(e){return{...e,seed:ti(),usageOffset:0}}function na(e,t){if(Qi(t),e.members.includes(t))return e;if(e.members.length>=Zi)throw Error(`Cannot add member: group has reached the maximum of ${Zi} members`);return{...e,members:[...e.members,t]}}function ra(e,t){return Qi(t),{...e,members:e.members.filter(e=>e!==t)}}function ia(e,t=Math.floor(Date.now()/1e3)){let n=Ai(t,e.rotationInterval);return n<=e.counter?e:{...e,counter:n,usageOffset:0}}var aa=e({FIRE_AND_FORGET_FRESHNESS_SEC:()=>300,MAX_FUTURE_SKEW_SEC:()=>60,PROTOCOL_VERSION:()=>2,STORED_MESSAGE_TYPES:()=>sa,applySyncMessage:()=>Sa,applySyncMessageWithResult:()=>Ca,canonicaliseSyncMessage:()=>ya,decodeSyncMessage:()=>ba,decryptEnvelope:()=>Li,deriveGroupIdentity:()=>Ri,deriveGroupKey:()=>Fi,encodeSyncMessage:()=>_a,encryptEnvelope:()=>Ii,hashGroupTag:()=>zi,stableStringify:()=>va}),oa=new Set([`member-join`,`member-leave`,`counter-advance`,`reseed`,`beacon`,`duress-alert`,`duress-clear`,`liveness-checkin`,`state-snapshot`]),sa=new Set([`member-join`,`member-leave`,`counter-advance`,`reseed`,`state-snapshot`,`duress-alert`,`duress-clear`]),ca=/^[0-9a-f]{64}$/,la=100,ua=100,da=2e7,fa=256,pa=1e3;function ma(e,t,n,r){let i=[...e,t];return i.length>pa?{consumedOps:i.slice(-1e3),consumedOpsFloor:Math.max(r??0,n)}:{consumedOps:i,consumedOpsFloor:r}}function ha(e){return typeof e==`number`&&Number.isFinite(e)}function ga(e){return ha(e)&&Number.isInteger(e)&&e>=0}function _a(e){let t={...e,protocolVersion:2};if(e.type===`reseed`){let{seed:n,...r}=t;return JSON.stringify({...r,seed:ni(e.seed)})}return JSON.stringify(t)}function va(e){if(e==null)return`null`;if(typeof e==`number`){if(!Number.isFinite(e))throw Error(`stableStringify: NaN/Infinity not allowed in canonical signing`);return JSON.stringify(e)}if(typeof e==`boolean`||typeof e==`string`)return JSON.stringify(e);if(Array.isArray(e))return`[`+e.map(va).join(`,`)+`]`;if(e instanceof Uint8Array)throw Error(`stableStringify: Uint8Array must be hex-encoded before serialisation`);if(typeof e==`object`){let t=e;return`{`+Object.keys(t).sort().filter(e=>t[e]!==void 0).map(e=>JSON.stringify(e)+`:`+va(t[e])).join(`,`)+`}`}throw Error(`stableStringify: unsupported type ${typeof e}`)}function ya(e){if(e.type===`reseed`){let{seed:t,...n}=e;return va({...n,seed:ni(t)})}return va(e)}function ba(e){let t;try{t=JSON.parse(e)}catch{throw Error(`Invalid sync message: not valid JSON`)}let n=t.type;if(typeof n!=`string`||!oa.has(n))throw Error(`Invalid sync message type: ${String(n)}`);let r=t.timestamp;if(!ga(r))throw Error(`Invalid sync message: missing or invalid timestamp`);let i=t.protocolVersion;if(i==null)throw Error(`Invalid sync message: protocolVersion is required`);if(i!==2)throw Error(`Unsupported protocol version: ${JSON.stringify(i)} (expected: 2)`);switch(n){case`member-join`:if(typeof t.pubkey!=`string`||!ca.test(t.pubkey))throw Error(`Invalid sync message: member-join requires a 64-char hex pubkey`);if(!ga(t.epoch))throw Error(`Invalid sync message: member-join requires a non-negative epoch`);if(typeof t.opId!=`string`||t.opId.length===0||t.opId.length>128)throw Error(`Invalid sync message: member-join requires a non-empty opId (max 128 chars)`);if(t.displayName!==void 0&&(typeof t.displayName!=`string`||t.displayName.length>256))throw Error(`Invalid sync message: member-join displayName must be a string of at most 256 characters`);return{type:n,pubkey:t.pubkey,timestamp:r,epoch:t.epoch,opId:t.opId,...t.displayName===void 0?{}:{displayName:t.displayName},protocolVersion:2};case`member-leave`:if(typeof t.pubkey!=`string`||!ca.test(t.pubkey))throw Error(`Invalid sync message: member-leave requires a 64-char hex pubkey`);if(!ga(t.epoch))throw Error(`Invalid sync message: member-leave requires a non-negative epoch`);if(typeof t.opId!=`string`||t.opId.length===0||t.opId.length>128)throw Error(`Invalid sync message: member-leave requires a non-empty opId (max 128 chars)`);return{type:n,pubkey:t.pubkey,timestamp:r,epoch:t.epoch,opId:t.opId,protocolVersion:2};case`liveness-checkin`:if(typeof t.pubkey!=`string`||!ca.test(t.pubkey))throw Error(`Invalid sync message: liveness-checkin requires a 64-char hex pubkey`);if(typeof t.opId!=`string`||t.opId.length===0||t.opId.length>128)throw Error(`Invalid sync message: liveness-checkin requires a non-empty opId (max 128 chars)`);return{type:n,pubkey:t.pubkey,timestamp:r,opId:t.opId,protocolVersion:2};case`counter-advance`:if(!ga(t.counter)||t.counter>4294967295)throw Error(`Invalid sync message: counter-advance requires a non-negative counter within uint32 range`);if(!ga(t.usageOffset))throw Error(`Invalid sync message: counter-advance requires a non-negative usageOffset`);if(t.usageOffset>la)throw Error(`Invalid sync message: counter-advance usageOffset exceeds maximum of ${la}`);return{type:n,counter:t.counter,usageOffset:t.usageOffset,timestamp:r,protocolVersion:2};case`reseed`:if(typeof t.seed!=`string`||!ca.test(t.seed))throw Error(`Invalid sync message: reseed.seed must be a 64-char hex string`);if(!ga(t.counter))throw Error(`Invalid sync message: reseed requires a non-negative counter`);if(!ga(t.epoch))throw Error(`Invalid sync message: reseed requires a non-negative epoch`);if(typeof t.opId!=`string`||t.opId.length===0||t.opId.length>128)throw Error(`Invalid sync message: reseed requires a non-empty opId (max 128 chars)`);if(!Array.isArray(t.admins)||!t.admins.every(e=>typeof e==`string`&&ca.test(e)))throw Error(`Invalid sync message: reseed.admins must be 64-char hex pubkeys`);if(!Array.isArray(t.members)||!t.members.every(e=>typeof e==`string`&&ca.test(e)))throw Error(`Invalid sync message: reseed.members must be 64-char hex pubkeys`);if(t.members.length>ua)throw Error(`Invalid sync message: reseed.members exceeds maximum of ${ua}`);if(t.admins.length>ua)throw Error(`Invalid sync message: reseed.admins exceeds maximum of ${ua}`);return{type:n,seed:H(t.seed),counter:t.counter,timestamp:r,epoch:t.epoch,opId:t.opId,admins:[...t.admins],members:[...t.members],protocolVersion:2};case`beacon`:if(!ha(t.lat)||!ha(t.lon))throw Error(`Invalid sync message: beacon requires numeric lat and lon`);if(t.lat<-90||t.lat>90||t.lon<-180||t.lon>180)throw Error(`Invalid sync message: beacon lat/lon out of range`);if(!ha(t.accuracy)||t.accuracy<0||t.accuracy>da)throw Error(`Invalid sync message: beacon requires a non-negative accuracy`);if(typeof t.opId!=`string`||t.opId.length===0||t.opId.length>128)throw Error(`Invalid sync message: beacon requires a non-empty opId (max 128 chars)`);return{type:n,lat:t.lat,lon:t.lon,accuracy:t.accuracy,timestamp:r,opId:t.opId,protocolVersion:2};case`duress-alert`:if(!ha(t.lat)||!ha(t.lon))throw Error(`Invalid sync message: duress-alert requires numeric lat and lon`);if(t.lat<-90||t.lat>90||t.lon<-180||t.lon>180)throw Error(`Invalid sync message: duress-alert lat/lon out of range`);if(typeof t.opId!=`string`||t.opId.length===0||t.opId.length>128)throw Error(`Invalid sync message: duress-alert requires a non-empty opId (max 128 chars)`);if(t.subject!==void 0&&(typeof t.subject!=`string`||t.subject.length>fa))throw Error(`Invalid sync message: duress-alert subject must be a string of at most ${fa} characters`);return{type:n,lat:t.lat,lon:t.lon,timestamp:r,opId:t.opId,...t.subject===void 0?{}:{subject:t.subject},protocolVersion:2};case`duress-clear`:if(typeof t.subject!=`string`||t.subject.length===0)throw Error(`Invalid sync message: duress-clear requires a non-empty subject`);if(t.subject.length>fa)throw Error(`Invalid sync message: duress-clear subject exceeds maximum length of ${fa} characters`);if(typeof t.opId!=`string`||t.opId.length===0||t.opId.length>128)throw Error(`Invalid sync message: duress-clear requires a non-empty opId (max 128 chars)`);return{type:n,subject:t.subject,timestamp:r,opId:t.opId,protocolVersion:2};case`state-snapshot`:if(typeof t.seed!=`string`||!ca.test(t.seed))throw Error(`Invalid sync message: state-snapshot requires a 64-char hex seed`);if(!ga(t.counter))throw Error(`Invalid sync message: state-snapshot requires a non-negative counter`);if(!ga(t.usageOffset))throw Error(`Invalid sync message: state-snapshot requires a non-negative usageOffset`);if(!Array.isArray(t.members)||!t.members.every(e=>typeof e==`string`&&ca.test(e)))throw Error(`Invalid sync message: state-snapshot members must be 64-char hex pubkeys`);if(!Array.isArray(t.admins)||!t.admins.every(e=>typeof e==`string`&&ca.test(e)))throw Error(`Invalid sync message: state-snapshot admins must be 64-char hex pubkeys`);if(t.members.length>ua)throw Error(`Invalid sync message: state-snapshot members exceeds maximum of ${ua}`);if(t.admins.length>ua)throw Error(`Invalid sync message: state-snapshot admins exceeds maximum of ${ua}`);if(!ga(t.epoch))throw Error(`Invalid sync message: state-snapshot requires a non-negative epoch`);if(typeof t.opId!=`string`||t.opId.length===0||t.opId.length>128)throw Error(`Invalid sync message: state-snapshot requires a non-empty opId (max 128 chars)`);if(t.prevEpochSeed!==void 0&&(typeof t.prevEpochSeed!=`string`||!ca.test(t.prevEpochSeed)))throw Error(`Invalid sync message: state-snapshot.prevEpochSeed must be a 64-char hex string`);return{type:n,seed:t.seed,counter:t.counter,usageOffset:t.usageOffset,members:[...t.members],admins:[...t.admins],epoch:t.epoch,opId:t.opId,timestamp:r,...t.prevEpochSeed===void 0?{}:{prevEpochSeed:t.prevEpochSeed},protocolVersion:2}}throw Error(`Invalid sync message type: ${n}`)}function xa(e,t){return e.type===`reseed`||e.type===`state-snapshot`||e.type===`member-join`&&e.pubkey!==t||e.type===`member-leave`&&e.pubkey!==t}function Sa(e,t,n=Math.floor(Date.now()/1e3),r){if(xa(t,r)){if(!r||!e.admins.includes(r))return e;let n=t.epoch,i=t.opId;if(n===void 0||i===void 0||n<e.epoch)return e;if(t.type===`reseed`){if(n!==e.epoch+1)return e;let r=t;if(!r.admins||!r.members)return e;let i=new Set(r.members);if(!r.admins.every(e=>i.has(e)))return e}else if(t.type===`state-snapshot`){if(n<e.epoch)return e;let r=t;if(!r.admins||!r.members)return e;let i=new Set(r.members);if(!r.admins.every(e=>i.has(e)))return e}else if(n!==e.epoch)return e;if(t.type!==`reseed`&&!(t.type===`state-snapshot`&&n>e.epoch)&&(new Set(e.consumedOps).has(i)||e.consumedOpsFloor!==void 0&&t.timestamp<=e.consumedOpsFloor))return e}if(t.type===`duress-alert`||t.type===`duress-clear`||t.type===`beacon`||t.type===`liveness-checkin`){let r=n-t.timestamp;if(r>300||r<-60)return e}if(sa.has(t.type)&&t.timestamp>n+60||t.type===`liveness-checkin`&&r&&t.pubkey!==r||(t.type===`member-leave`||t.type===`member-join`||t.type===`duress-clear`)&&!xa(t,r)&&(new Set(e.consumedOps).has(t.opId)||e.consumedOpsFloor!==void 0&&t.timestamp<=e.consumedOpsFloor))return e;switch(t.type){case`member-join`:{let n;try{n=na(e,t.pubkey)}catch{return e}let r=ma(n.consumedOps,t.opId,t.timestamp,e.consumedOpsFloor),i=t.displayName?{memberNames:{...n.memberNames,[t.pubkey]:t.displayName}}:{};return{...n,...r,...i}}case`member-leave`:if(!e.members.includes(t.pubkey))return e;{let n=ra(e,t.pubkey),r=ma(n.consumedOps,t.opId,t.timestamp,e.consumedOpsFloor);return{...n,...r}}case`counter-advance`:{if(!r||!e.members.includes(r)||t.usageOffset>la)return e;let i=e.counter+e.usageOffset,a=t.counter+t.usageOffset;return a<=i||a>Math.floor(n/e.rotationInterval)+la?e:{...e,counter:t.counter,usageOffset:t.usageOffset}}case`reseed`:return{...e,seed:ni(t.seed),counter:t.counter,usageOffset:0,members:[...t.members],admins:[...t.admins],epoch:t.epoch,consumedOps:[t.opId]};case`state-snapshot`:if(t.epoch===e.epoch){if(t.seed!==e.seed)return e;let n=e.counter+e.usageOffset;if(t.counter+t.usageOffset<n||!e.members.every(e=>t.members.includes(e))||!e.admins.every(e=>t.admins.includes(e)))return e;let r=ma(e.consumedOps,t.opId,t.timestamp,e.consumedOpsFloor);return{...e,counter:t.counter,usageOffset:t.usageOffset,members:[...t.members],admins:[...t.admins],...r}}return e;case`duress-clear`:{let n=ma(e.consumedOps,t.opId,t.timestamp,e.consumedOpsFloor);return{...e,...n}}case`beacon`:case`duress-alert`:case`liveness-checkin`:return e;default:return e}}function Ca(e,t,n=Math.floor(Date.now()/1e3),r){let i=Sa(e,t,n,r);if(t.type===`beacon`||t.type===`duress-alert`||t.type===`liveness-checkin`){let e=n-t.timestamp,a=e<=300&&e>=-60,o=t.type!==`liveness-checkin`||!r||t.pubkey===r;return{state:i,applied:a&&o}}return{state:i,applied:i!==e}}function wa(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name===`Uint8Array`}function Ta(e){if(typeof e!=`boolean`)throw Error(`boolean expected, not ${e}`)}function Ea(e){if(!Number.isSafeInteger(e)||e<0)throw Error(`positive integer expected, got `+e)}function Da(e,t,n=``){let r=wa(e),i=e?.length,a=t!==void 0;if(!r||a&&i!==t){let o=n&&`"${n}" `,s=a?` of length ${t}`:``,c=r?`length=${i}`:`type=${typeof e}`;throw Error(o+`expected Uint8Array`+s+`, got `+c)}return e}function Oa(e,t=!0){if(e.destroyed)throw Error(`Hash instance has been destroyed`);if(t&&e.finished)throw Error(`Hash#digest() has already been called`)}function ka(e,t){Da(e,void 0,`output`);let n=t.outputLen;if(e.length<n)throw Error(`digestInto() expects output buffer of length at least `+n)}function Aa(e){return new Uint32Array(e.buffer,e.byteOffset,Math.floor(e.byteLength/4))}function ja(...e){for(let t=0;t<e.length;t++)e[t].fill(0)}new Uint8Array(new Uint32Array([287454020]).buffer)[0];function Ma(e,t){if(typeof t!=`object`||!t)throw Error(`options must be defined`);return Object.assign(e,t)}function Na(e,t){if(e.length!==t.length)return!1;let n=0;for(let r=0;r<e.length;r++)n|=e[r]^t[r];return n===0}function Pa(e){return Uint8Array.from(e)}var Fa=e=>Uint8Array.from(e.split(``),e=>e.charCodeAt(0)),Ia=Fa(`expand 16-byte k`),La=Fa(`expand 32-byte k`),Ra=Aa(Ia),za=Aa(La);function U(e,t){return e<<t|e>>>32-t}function Ba(e){return e.byteOffset%4==0}var Va=64,Ha=16,Ua=2**32-1,Wa=Uint32Array.of();function Ga(e,t,n,r,i,a,o,s){let c=i.length,l=new Uint8Array(Va),u=Aa(l),d=Ba(i)&&Ba(a),f=d?Aa(i):Wa,p=d?Aa(a):Wa;for(let m=0;m<c;o++){if(e(t,n,r,u,o,s),o>=Ua)throw Error(`arx: counter overflow`);let h=Math.min(Va,c-m);if(d&&h===Va){let e=m/4;if(m%4!=0)throw Error(`arx: invalid block position`);for(let t=0,n;t<Ha;t++)n=e+t,p[n]=f[n]^u[t];m+=Va;continue}for(let e=0,t;e<h;e++)t=m+e,a[t]=i[t]^l[e];m+=h}}function Ka(e,t){let{allowShortKeys:n,extendNonceFn:r,counterLength:i,counterRight:a,rounds:o}=Ma({allowShortKeys:!1,counterLength:8,counterRight:!1,rounds:20},t);if(typeof e!=`function`)throw Error(`core must be a function`);return Ea(i),Ea(o),Ta(a),Ta(n),(t,s,c,l,u=0)=>{Da(t,void 0,`key`),Da(s,void 0,`nonce`),Da(c,void 0,`data`);let d=c.length;if(l===void 0&&(l=new Uint8Array(d)),Da(l,void 0,`output`),Ea(u),u<0||u>=Ua)throw Error(`arx: counter overflow`);if(l.length<d)throw Error(`arx: output (${l.length}) is shorter than data (${d})`);let f=[],p=t.length,m,h;if(p===32)f.push(m=Pa(t)),h=za;else if(p===16&&n)m=new Uint8Array(32),m.set(t),m.set(t,16),h=Ra,f.push(m);else throw Da(t,32,`arx key`),Error(`invalid key size`);Ba(s)||f.push(s=Pa(s));let g=Aa(m);if(r){if(s.length!==24)throw Error(`arx: extended nonce must be 24 bytes`);r(h,g,Aa(s.subarray(0,16)),g),s=s.subarray(16)}let _=16-i;if(_!==s.length)throw Error(`arx: nonce must be ${_} or 16 bytes`);if(_!==12){let e=new Uint8Array(12);e.set(s,a?0:12-s.length),s=e,f.push(s)}let v=Aa(s);return Ga(e,h,g,v,c,l,u,o),ja(...f),l}}function W(e,t){return e[t++]&255|(e[t++]&255)<<8}var qa=class{blockLen=16;outputLen=16;buffer=new Uint8Array(16);r=new Uint16Array(10);h=new Uint16Array(10);pad=new Uint16Array(8);pos=0;finished=!1;constructor(e){e=Pa(Da(e,32,`key`));let t=W(e,0),n=W(e,2),r=W(e,4),i=W(e,6),a=W(e,8),o=W(e,10),s=W(e,12),c=W(e,14);this.r[0]=t&8191,this.r[1]=(t>>>13|n<<3)&8191,this.r[2]=(n>>>10|r<<6)&7939,this.r[3]=(r>>>7|i<<9)&8191,this.r[4]=(i>>>4|a<<12)&255,this.r[5]=a>>>1&8190,this.r[6]=(a>>>14|o<<2)&8191,this.r[7]=(o>>>11|s<<5)&8065,this.r[8]=(s>>>8|c<<8)&8191,this.r[9]=c>>>5&127;for(let t=0;t<8;t++)this.pad[t]=W(e,16+2*t)}process(e,t,n=!1){let r=n?0:2048,{h:i,r:a}=this,o=a[0],s=a[1],c=a[2],l=a[3],u=a[4],d=a[5],f=a[6],p=a[7],m=a[8],h=a[9],g=W(e,t+0),_=W(e,t+2),v=W(e,t+4),y=W(e,t+6),b=W(e,t+8),x=W(e,t+10),S=W(e,t+12),C=W(e,t+14),w=i[0]+(g&8191),T=i[1]+((g>>>13|_<<3)&8191),E=i[2]+((_>>>10|v<<6)&8191),D=i[3]+((v>>>7|y<<9)&8191),O=i[4]+((y>>>4|b<<12)&8191),k=i[5]+(b>>>1&8191),A=i[6]+((b>>>14|x<<2)&8191),j=i[7]+((x>>>11|S<<5)&8191),M=i[8]+((S>>>8|C<<8)&8191),N=i[9]+(C>>>5|r),P=0,F=P+w*o+5*h*T+5*m*E+5*p*D+5*f*O;P=F>>>13,F&=8191,F+=5*d*k+5*u*A+5*l*j+5*c*M+5*s*N,P+=F>>>13,F&=8191;let I=P+w*s+T*o+5*h*E+5*m*D+5*p*O;P=I>>>13,I&=8191,I+=5*f*k+5*d*A+5*u*j+5*l*M+5*c*N,P+=I>>>13,I&=8191;let L=P+w*c+T*s+E*o+5*h*D+5*m*O;P=L>>>13,L&=8191,L+=5*p*k+5*f*A+5*d*j+5*u*M+5*l*N,P+=L>>>13,L&=8191;let R=P+w*l+T*c+E*s+D*o+5*h*O;P=R>>>13,R&=8191,R+=5*m*k+5*p*A+5*f*j+5*d*M+5*u*N,P+=R>>>13,R&=8191;let ee=P+w*u+T*l+E*c+D*s+O*o;P=ee>>>13,ee&=8191,ee+=5*h*k+5*m*A+5*p*j+5*f*M+5*d*N,P+=ee>>>13,ee&=8191;let te=P+w*d+T*u+E*l+D*c+O*s;P=te>>>13,te&=8191,te+=k*o+5*h*A+5*m*j+5*p*M+5*f*N,P+=te>>>13,te&=8191;let ne=P+w*f+T*d+E*u+D*l+O*c;P=ne>>>13,ne&=8191,ne+=k*s+A*o+5*h*j+5*m*M+5*p*N,P+=ne>>>13,ne&=8191;let re=P+w*p+T*f+E*d+D*u+O*l;P=re>>>13,re&=8191,re+=k*c+A*s+j*o+5*h*M+5*m*N,P+=re>>>13,re&=8191;let ie=P+w*m+T*p+E*f+D*d+O*u;P=ie>>>13,ie&=8191,ie+=k*l+A*c+j*s+M*o+5*h*N,P+=ie>>>13,ie&=8191;let ae=P+w*h+T*m+E*p+D*f+O*d;P=ae>>>13,ae&=8191,ae+=k*u+A*l+j*c+M*s+N*o,P+=ae>>>13,ae&=8191,P=(P<<2)+P|0,P=P+F|0,F=P&8191,P>>>=13,I+=P,i[0]=F,i[1]=I,i[2]=L,i[3]=R,i[4]=ee,i[5]=te,i[6]=ne,i[7]=re,i[8]=ie,i[9]=ae}finalize(){let{h:e,pad:t}=this,n=new Uint16Array(10),r=e[1]>>>13;e[1]&=8191;for(let t=2;t<10;t++)e[t]+=r,r=e[t]>>>13,e[t]&=8191;e[0]+=r*5,r=e[0]>>>13,e[0]&=8191,e[1]+=r,r=e[1]>>>13,e[1]&=8191,e[2]+=r,n[0]=e[0]+5,r=n[0]>>>13,n[0]&=8191;for(let t=1;t<10;t++)n[t]=e[t]+r,r=n[t]>>>13,n[t]&=8191;n[9]-=8192;let i=(r^1)-1;for(let e=0;e<10;e++)n[e]&=i;i=~i;for(let t=0;t<10;t++)e[t]=e[t]&i|n[t];e[0]=(e[0]|e[1]<<13)&65535,e[1]=(e[1]>>>3|e[2]<<10)&65535,e[2]=(e[2]>>>6|e[3]<<7)&65535,e[3]=(e[3]>>>9|e[4]<<4)&65535,e[4]=(e[4]>>>12|e[5]<<1|e[6]<<14)&65535,e[5]=(e[6]>>>2|e[7]<<11)&65535,e[6]=(e[7]>>>5|e[8]<<8)&65535,e[7]=(e[8]>>>8|e[9]<<5)&65535;let a=e[0]+t[0];e[0]=a&65535;for(let n=1;n<8;n++)a=(e[n]+t[n]|0)+(a>>>16)|0,e[n]=a&65535;ja(n)}update(e){Oa(this),Da(e),e=Pa(e);let{buffer:t,blockLen:n}=this,r=e.length;for(let i=0;i<r;){let a=Math.min(n-this.pos,r-i);if(a===n){for(;n<=r-i;i+=n)this.process(e,i);continue}t.set(e.subarray(i,i+a),this.pos),this.pos+=a,i+=a,this.pos===n&&(this.process(t,0,!1),this.pos=0)}return this}destroy(){ja(this.h,this.r,this.buffer,this.pad)}digestInto(e){Oa(this),ka(e,this),this.finished=!0;let{buffer:t,h:n}=this,{pos:r}=this;if(r){for(t[r++]=1;r<16;r++)t[r]=0;this.process(t,0,!0)}this.finalize();let i=0;for(let t=0;t<8;t++)e[i++]=n[t]>>>0,e[i++]=n[t]>>>8;return e}digest(){let{buffer:e,outputLen:t}=this;this.digestInto(e);let n=e.slice(0,t);return this.destroy(),n}};function Ja(e){let t=(t,n)=>e(n).update(t).digest(),n=e(new Uint8Array(32));return t.outputLen=n.outputLen,t.blockLen=n.blockLen,t.create=t=>e(t),t}Ja(e=>new qa(e));function Ya(e,t,n,r,i,a=20){let o=e[0],s=e[1],c=e[2],l=e[3],u=t[0],d=t[1],f=t[2],p=t[3],m=t[4],h=t[5],g=t[6],_=t[7],v=i,y=n[0],b=n[1],x=n[2],S=o,C=s,w=c,T=l,E=u,D=d,O=f,k=p,A=m,j=h,M=g,N=_,P=v,F=y,I=b,L=x;for(let e=0;e<a;e+=2)S=S+E|0,P=U(P^S,16),A=A+P|0,E=U(E^A,12),S=S+E|0,P=U(P^S,8),A=A+P|0,E=U(E^A,7),C=C+D|0,F=U(F^C,16),j=j+F|0,D=U(D^j,12),C=C+D|0,F=U(F^C,8),j=j+F|0,D=U(D^j,7),w=w+O|0,I=U(I^w,16),M=M+I|0,O=U(O^M,12),w=w+O|0,I=U(I^w,8),M=M+I|0,O=U(O^M,7),T=T+k|0,L=U(L^T,16),N=N+L|0,k=U(k^N,12),T=T+k|0,L=U(L^T,8),N=N+L|0,k=U(k^N,7),S=S+D|0,L=U(L^S,16),M=M+L|0,D=U(D^M,12),S=S+D|0,L=U(L^S,8),M=M+L|0,D=U(D^M,7),C=C+O|0,P=U(P^C,16),N=N+P|0,O=U(O^N,12),C=C+O|0,P=U(P^C,8),N=N+P|0,O=U(O^N,7),w=w+k|0,F=U(F^w,16),A=A+F|0,k=U(k^A,12),w=w+k|0,F=U(F^w,8),A=A+F|0,k=U(k^A,7),T=T+E|0,I=U(I^T,16),j=j+I|0,E=U(E^j,12),T=T+E|0,I=U(I^T,8),j=j+I|0,E=U(E^j,7);let R=0;r[R++]=o+S|0,r[R++]=s+C|0,r[R++]=c+w|0,r[R++]=l+T|0,r[R++]=u+E|0,r[R++]=d+D|0,r[R++]=f+O|0,r[R++]=p+k|0,r[R++]=m+A|0,r[R++]=h+j|0,r[R++]=g+M|0,r[R++]=_+N|0,r[R++]=v+P|0,r[R++]=y+F|0,r[R++]=b+I|0,r[R++]=x+L|0}var Xa=Ka(Ya,{counterRight:!1,counterLength:4,allowShortKeys:!1});function Za(e,t,n){return ge(e),n===void 0&&(n=new Uint8Array(e.outputLen)),Ee(e,n,t)}var Qa=Uint8Array.of(0),$a=Uint8Array.of();function eo(e,t,n,r=32){ge(e),pe(r,`length`);let i=e.outputLen;if(r>255*i)throw Error(`Length must be <= 255*HashLen`);let a=Math.ceil(r/i);n===void 0?n=$a:ve(n,void 0,`info`);let o=new Uint8Array(a*i),s=Ee.create(e,t),c=s._cloneInto(),l=new Uint8Array(s.outputLen);for(let e=0;e<a;e++)Qa[0]=e+1,c.update(e===0?$a:l).update(n).update(Qa).digestInto(l),o.set(l,i*e),s._cloneInto(c);return s.destroy(),c.destroy(),_e(l,Qa),o.slice(0,r)}var to=new TextDecoder(`utf-8`),no=new TextEncoder,ro=1,io=4294967295,ao=65536;function G(e,t){return Za(we,Se.getSharedSecret(e,fe(`02`+t)).subarray(1,33),no.encode(`nip44-v2`))}function oo(e,t){let n=eo(we,e,t,76);return{chacha_key:n.subarray(0,32),chacha_nonce:n.subarray(32,44),hmac_key:n.subarray(44,76)}}function so(e){if(!Number.isSafeInteger(e)||e<1)throw Error(`expected positive integer`);if(e<=32)return 32;let t=2**(Math.floor(Math.log2(e-1))+1),n=t<=256?32:t/8;return n*(Math.floor((e-1)/n)+1)}function co(e){if(!Number.isSafeInteger(e)||e<ro||e>65535)throw Error(`invalid plaintext size: must be between 1 and 65535 bytes`);let t=new Uint8Array(2);return new DataView(t.buffer).setUint16(0,e,!1),t}function lo(e){if(!Number.isSafeInteger(e)||e<ao||e>io)throw Error(`invalid plaintext size: must be between 65536 and 4294967295 bytes`);let t=new Uint8Array(4);return new DataView(t.buffer).setUint32(0,e,!1),t}function uo(e){let t=no.encode(e),n=t.length;if(n<ro||n>io)throw Error(`invalid plaintext size: must be between 1 and 4294967295 bytes`);return de(n>=ao?de(new Uint8Array([0,0]),lo(n)):co(n),t,new Uint8Array(so(n)-n))}function fo(e){let t=new DataView(e.buffer,e.byteOffset,e.byteLength),n=t.getUint16(0),r,i;if(n===0){if(r=t.getUint32(2),r<ao)throw Error(`invalid padding`);i=6}else r=n,i=2;let a=e.subarray(i,i+r);if(r<ro||r>io||a.length!==r||e.length!==i+so(r))throw Error(`invalid padding`);return to.decode(a)}function po(e,t,n){if(n.length!==32)throw Error(`AAD associated data must be 32 bytes`);return Ee(we,e,de(n,t))}function mo(e){if(typeof e!=`string`)throw Error(`payload must be a valid string`);let t=e.length;if(t<132)throw Error(`invalid payload length: `+t);if(e[0]===`#`)throw Error(`unknown encryption version`);let n;try{n=R.decode(e)}catch(e){throw Error(`invalid base64: `+e.message)}let r=n.length;if(r<99)throw Error(`invalid data length: `+r);let i=n[0];if(i!==2)throw Error(`unknown encryption version `+i);return{nonce:n.subarray(1,33),ciphertext:n.subarray(33,-32),mac:n.subarray(-32)}}function ho(e,t,n=me(32)){let{chacha_key:r,chacha_nonce:i,hmac_key:a}=oo(t,n),o=Xa(r,i,uo(e)),s=po(a,o,n);return R.encode(de(new Uint8Array([2]),n,o,s))}function go(e,t){let{nonce:n,ciphertext:r,mac:i}=mo(e),{chacha_key:a,chacha_nonce:o,hmac_key:s}=oo(t,n);if(!Na(po(s,r,n),i))throw Error(`invalid MAC`);return fo(Xa(a,o,r))}function _o(e){if(!/^[0-9a-f]*$/i.test(e)||e.length%2!=0)throw Error(`Invalid hex string: "${e.slice(0,20)}${e.length>20?`…`:``}"`);let t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function vo(e){return Array.from(e,e=>e.toString(16).padStart(2,`0`)).join(``)}var yo=class{pubkey;privkeyHex;constructor(e,t){this.pubkey=e,this.privkeyHex=t}async sign(e){return Fe(e,_o(this.privkeyHex))}async encrypt(e,t){return ho(e,G(_o(this.privkeyHex),t))}async decrypt(e,t){return go(e,G(_o(this.privkeyHex),t))}},bo=class{pubkey;signingKey;constructor(e){this.signingKey=e.privateKey,this.pubkey=vo(e.publicKey)}async sign(e){return Fe(e,this.signingKey)}};async function xo(e){if(e.privkey&&e.pubkey)return{signer:new yo(e.pubkey,e.privkey),signerType:`local`,pubkey:e.pubkey,privkey:e.privkey};let t=Ne(),n=Me(t),r=vo(t);return{signer:new yo(n,r),signerType:`local`,pubkey:n,privkey:r}}var So={groupState:30078,signal:20078,giftWrap:1059},Co=new Set([`member-join`,`member-leave`,`counter-advance`,`reseed`,`state-snapshot`,`duress-alert`,`duress-clear`]),wo=/^[0-9a-f]{64}$/,To=/^[0-9a-f]{128}$/,Eo=new TextEncoder,Do=3,Oo=6e4,ko=class{capacity;order=[];items=new Set;constructor(e){this.capacity=e}has(e){return this.items.has(e)}add(e){if(!this.items.has(e)){if(this.order.length>=this.capacity){let e=this.order.shift();this.items.delete(e)}this.order.push(e),this.items.add(e)}}},Ao=class{personalPubkey;personalPrivkey;subs=new Map;groupKeys=new Map;tagHashToGroupId=new Map;seenEventIds=new ko(1e3);decryptFailures=new Map;recoveryPending=new Map;recoverySub=null;readRelays;writeRelays;constructor(e,t,n,r){this.personalPubkey=n,this.personalPrivkey=r,this.readRelays=i(e),this.writeRelays=i(t)}updateRelays(e,t){this.readRelays=i(e),this.writeRelays=t?i(t):[...this.readRelays]}get allRelays(){return i([...this.readRelays,...this.writeRelays])}registerGroup(e,t,n,r,i){let a=zi(e);console.info(`[canary:sync] registerGroup`,e.slice(0,8),`→ tagHash`,a.slice(0,12),`members:`,r.length),this.groupKeys.set(e,{key:Fi(t),signer:n,tagHash:a,members:new Set(r),admins:new Set(i?.admins??[]),onRecoveryRequest:i?.onRecoveryRequest,onRecoveryResponse:i?.onRecoveryResponse}),this.tagHashToGroupId.set(a,e)}unregisterGroup(e){let t=this.groupKeys.get(e);t&&(t.key.fill(0),this.tagHashToGroupId.delete(t.tagHash)),this.groupKeys.delete(e),this.decryptFailures.delete(e),this.recoveryPending.delete(e)}async send(e,t,n){be()||ke(this.readRelays,this.writeRelays);let r=B();if(!r)return;let i=this.groupKeys.get(e);if(!i){console.warn(`[canary:sync] No group key registered for`,e);return}let a=_a(t),o=ya({...t,protocolVersion:2}),s=Qr(Eo.encode(o)),c=ni(j.sign(s,H(this.personalPrivkey))),l=JSON.stringify({s:this.personalPubkey,sig:c,p:a}),u=await Ii(i.key,l),d=Co.has(t.type),f=d?So.groupState:So.signal,p=[[`d`,d?`ssg/${i.tagHash}:${t.type}`:`ssg/${i.tagHash}`]];d?p.push([`expiration`,String(Math.floor(Date.now()/1e3)+10080*60)]):p.push([`t`,t.type]);let m={kind:f,content:u,tags:p,created_at:Math.floor(Date.now()/1e3)};try{let n=await i.signer.sign(m);typeof n.id==`string`&&this.seenEventIds.add(n.id),console.info(`[canary:sync] Publishing`,t.type,`to`,e.slice(0,8),`→ d-tag:`,i.tagHash.slice(0,12),`(write relays only)`),await r.publish(this.writeRelays,n),console.info(`[canary:sync] Published OK`)}catch(e){console.error(`[canary:sync] Publish failed:`,e)}}subscribe(e,t){let n=B();if(!n)return()=>{};let r=this.groupKeys.get(e);if(!r)return console.warn(`[canary:sync] No group key registered for`,e),()=>{};this._ensureRecoverySub();let i=Array.from(Co).map(e=>`ssg/${r.tagHash}:${e}`),a={kinds:[So.groupState,So.signal],"#d":[`ssg/${r.tagHash}`,...i],since:Math.floor(Date.now()/1e3)-10080*60};console.info(`[canary:sync] Subscribing to`,e.slice(0,8),`→ filter:`,JSON.stringify(a));let o=n.subscribeMany(this.allRelays,a,{onevent:async n=>{try{if(!n||typeof n!=`object`||typeof n.pubkey!=`string`||typeof n.content!=`string`)return;console.info(`[canary:sync] Received event`,n.id?.slice(0,12),`kind:`,n.kind,`from pubkey:`,n.pubkey?.slice(0,12));let r=this.groupKeys.get(e);if(!r)return;if(!je(n)){console.warn(`[canary:sync] Rejected event with invalid signature`);return}if(typeof n.id==`string`&&this.seenEventIds.has(n.id))return;if(typeof n.content==`string`&&n.content.length>65536){console.warn(`[canary:sync] Rejected oversized event content`);return}let i;try{i=await Li(r.key,n.content)}catch{this._trackDecryptFailure(e);return}this.decryptFailures.delete(e);let a;try{a=JSON.parse(i)}catch{console.warn(`[canary:sync] Rejected malformed envelope`);return}if(!a||typeof a!=`object`){console.warn(`[canary:sync] Rejected malformed envelope`);return}let o=a.s,s=a.sig,c=a.p;if(typeof o!=`string`||typeof s!=`string`||typeof c!=`string`){console.warn(`[canary:sync] Rejected envelope with missing sender proof fields`);return}if(!wo.test(o)||!To.test(s)){console.warn(`[canary:sync] Rejected envelope with invalid sender proof encoding`);return}let l=ba(c),u=ya({...l,protocolVersion:2}),d=Qr(Eo.encode(u));if(!j.verify(H(s),d,H(o))){console.warn(`[canary:sync] Rejected envelope with invalid sender proof`);return}if(l.type!==`member-join`&&!r.members.has(o)){console.warn(`[canary:sync] Rejected message from non-member pubkey`);return}if(l.type===`liveness-checkin`&&l.pubkey!==o){console.warn(`[canary:sync] Rejected liveness-checkin with mismatched sender`);return}console.info(`[canary:sync] Dispatching`,l.type,`from sender`,o.slice(0,8)),t(l,o),typeof n.id==`string`&&this.seenEventIds.add(n.id)}catch(e){console.warn(`[canary:sync] Failed to process event:`,e)}}});return this.subs.set(e,o),()=>{o.close(),this.subs.delete(e)}}async requestRecovery(e,t,n){let r=B();if(!r)return;let i=this.groupKeys.get(e);if(!i)return;this.recoveryPending.set(e,Date.now());let a=H(this.personalPrivkey);for(let e of i.admins)if(e!==this.personalPubkey)try{let o=ho(JSON.stringify({groupTag:i.tagHash,epoch:t,counter:n}),G(a,e)),s=Fe({kind:So.signal,content:o,tags:[[`p`,e],[`t`,`ssg:recovery-request`]],created_at:Math.floor(Date.now()/1e3)},a);await r.publish(this.writeRelays,s)}catch(t){console.warn(`[canary:sync] Recovery request to`,e.slice(0,8),`failed:`,t)}}_ensureRecoverySub(){if(this.recoverySub)return;let e=B();if(!e)return;let t={kinds:[So.signal],"#p":[this.personalPubkey],"#t":[`ssg:recovery-request`,`ssg:recovery-response`],since:Math.floor(Date.now()/1e3)-300};this.recoverySub=e.subscribeMany(this.allRelays,t,{onevent:async e=>{try{if(!e||typeof e!=`object`||!je(e))return;let t=(e.tags||[]).filter(e=>e[0]===`t`).map(e=>e[1]);t.includes(`ssg:recovery-request`)?await this._handleRecoveryRequest(e):t.includes(`ssg:recovery-response`)&&await this._handleRecoveryResponse(e)}catch(e){console.warn(`[canary:sync] Recovery event processing failed:`,e)}}})}async _handleRecoveryRequest(e){let t=B();if(!t)return;let n=e.pubkey;if(!wo.test(n))return;let r=H(this.personalPrivkey),i=G(r,n),a=go(e.content,i),o;try{o=JSON.parse(a)}catch{return}let s=o.groupTag,c=o.epoch,l=o.counter;if(typeof s!=`string`||typeof c!=`number`||typeof l!=`number`)return;let u=this.tagHashToGroupId.get(s);if(!u)return;let d=this.groupKeys.get(u);if(!d)return;if(!d.members.has(n)){console.warn(`[canary:sync] Recovery request from non-member`,n.slice(0,8));return}if(!d.onRecoveryRequest)return;let f=d.onRecoveryRequest(n,c,l);if(!f)return;let p=_a(f),m=ya({...f,protocolVersion:2}),h=Qr(Eo.encode(m)),g=ni(j.sign(h,r)),_=ho(JSON.stringify({s:this.personalPubkey,sig:g,groupTag:s,p}),G(r,n)),v=Fe({kind:So.signal,content:_,tags:[[`p`,n],[`t`,`ssg:recovery-response`]],created_at:Math.floor(Date.now()/1e3)},r);await t.publish(this.writeRelays,v),console.info(`[canary:sync] Sent recovery response to`,n.slice(0,8))}async _handleRecoveryResponse(e){let t=e.pubkey;if(!wo.test(t))return;let n=G(H(this.personalPrivkey),t),r=go(e.content,n),i;try{i=JSON.parse(r)}catch{return}let a=i.s,o=i.sig,s=i.groupTag,c=i.p;if(typeof a!=`string`||typeof o!=`string`||typeof s!=`string`||typeof c!=`string`||!wo.test(a)||!To.test(o)||a!==t)return;let l=this.tagHashToGroupId.get(s);if(!l)return;let u=this.groupKeys.get(l);if(!u)return;if(!u.admins.has(t)){console.warn(`[canary:sync] Recovery response from non-admin`,t.slice(0,8));return}let d=ba(c),f=ya({...d,protocolVersion:2}),p=Qr(Eo.encode(f));if(!j.verify(H(o),p,H(t))){console.warn(`[canary:sync] Recovery response with invalid signature`);return}if(d.type!==`state-snapshot`){console.warn(`[canary:sync] Recovery response contains non-snapshot type:`,d.type);return}if(!d.admins.includes(t)){console.warn(`[canary:sync] Recovery response sender not in snapshot admins`);return}this.decryptFailures.delete(l),this.recoveryPending.delete(l),u.onRecoveryResponse&&u.onRecoveryResponse(d,t),console.info(`[canary:sync] Applied recovery response from`,t.slice(0,8))}_trackDecryptFailure(e){let t=(this.decryptFailures.get(e)??0)+1;if(this.decryptFailures.set(e,t),t<Do)return;let n=this.recoveryPending.get(e);if(n!==void 0&&Date.now()-n<Oo)return;this.recoveryPending.delete(e);let r=this.groupKeys.get(e);r&&r.admins.size>0&&r.onRecoveryResponse&&(console.warn(`[canary:sync] ${t} decrypt failures for group — requesting recovery`),this.requestRecovery(e,0,0).catch(e=>{console.warn(`[canary:sync] Auto-recovery request failed:`,e)}))}disconnect(){for(let[,e]of this.subs)e.close();this.subs.clear(),this.recoverySub&&=(this.recoverySub.close(),null)}},jo={relayUrl:`wss://relay.damus.io`,signetAppOrigin:`https://mysignet.app`,timeout:12e4,theme:`auto`,persist:!0,mode:`relay`},K={pubkey:`signet:login.pubkey`,method:`signet:login.method`,authEvent:`signet:login.authEvent`,bunkerUri:`signet:login.bunkerUri`,bunkerClientSk:`signet:login.bunkerClientSk`,clientSk:`signet:login.clientSk`,expiresAt:`signet:login.expiresAt`,displayName:`signet:login.displayName`,pendingRedirect:`signet:login.pendingRedirect`},Mo=Symbol(`verified`),No=e=>e instanceof Object;function Po(e){if(!No(e)||typeof e.kind!=`number`||typeof e.content!=`string`||typeof e.created_at!=`number`||typeof e.pubkey!=`string`||!e.pubkey.match(/^[a-f0-9]{64}$/)||!Array.isArray(e.tags))return!1;for(let t=0;t<e.tags.length;t++){let n=e.tags[t];if(!Array.isArray(n))return!1;for(let e=0;e<n.length;e++)if(typeof n[e]!=`string`)return!1}return!0}var Fo=new TextDecoder(`utf-8`),Io=new TextEncoder;function Lo(e){try{e.indexOf(`://`)===-1&&(e=`wss://`+e);let t=new URL(e);return t.protocol===`http:`?t.protocol=`ws:`:t.protocol===`https:`&&(t.protocol=`wss:`),t.pathname=t.pathname.replace(/\/+/g,`/`),t.pathname.endsWith(`/`)&&(t.pathname=t.pathname.slice(0,-1)),(t.port===`80`&&t.protocol===`ws:`||t.port===`443`&&t.protocol===`wss:`)&&(t.port=``),t.searchParams.sort(),t.hash=``,t.toString()}catch{throw Error(`Invalid URL: ${e}`)}}var Ro=class{generateSecretKey(){return xe.utils.randomSecretKey()}getPublicKey(e){return he(xe.getPublicKey(e))}finalizeEvent(e,t){let n=e;return n.pubkey=he(xe.getPublicKey(t)),n.id=Bo(n),n.sig=he(xe.sign(fe(Bo(n)),t)),n[Mo]=!0,n}verifyEvent(e){if(typeof e[Mo]==`boolean`)return e[Mo];try{let t=Bo(e);if(t!==e.id)return e[Mo]=!1,!1;let n=xe.verify(fe(e.sig),fe(t),fe(e.pubkey));return e[Mo]=n,n}catch{return e[Mo]=!1,!1}}};function zo(e){if(!Po(e))throw Error(`can't serialize event with wrong or missing properties`);return JSON.stringify([0,e.pubkey,e.created_at,e.kind,e.tags,e.content])}function Bo(e){return he(we(Io.encode(zo(e))))}var Vo=new Ro;Vo.generateSecretKey;var Ho=Vo.getPublicKey,Uo=Vo.finalizeEvent,Wo=Vo.verifyEvent,Go=1,Ko=4294967295,qo=65536;function Jo(e,t){return Za(we,Se.getSharedSecret(e,fe(`02`+t)).subarray(1,33),Io.encode(`nip44-v2`))}function Yo(e,t){let n=eo(we,e,t,76);return{chacha_key:n.subarray(0,32),chacha_nonce:n.subarray(32,44),hmac_key:n.subarray(44,76)}}function Xo(e){if(!Number.isSafeInteger(e)||e<1)throw Error(`expected positive integer`);if(e<=32)return 32;let t=2**(Math.floor(Math.log2(e-1))+1),n=t<=256?32:t/8;return n*(Math.floor((e-1)/n)+1)}function Zo(e){if(!Number.isSafeInteger(e)||e<Go||e>65535)throw Error(`invalid plaintext size: must be between 1 and 65535 bytes`);let t=new Uint8Array(2);return new DataView(t.buffer).setUint16(0,e,!1),t}function Qo(e){if(!Number.isSafeInteger(e)||e<qo||e>Ko)throw Error(`invalid plaintext size: must be between 65536 and 4294967295 bytes`);let t=new Uint8Array(4);return new DataView(t.buffer).setUint32(0,e,!1),t}function $o(e){let t=Io.encode(e),n=t.length;if(n<Go||n>Ko)throw Error(`invalid plaintext size: must be between 1 and 4294967295 bytes`);return de(n>=qo?de(new Uint8Array([0,0]),Qo(n)):Zo(n),t,new Uint8Array(Xo(n)-n))}function es(e){let t=new DataView(e.buffer,e.byteOffset,e.byteLength),n=t.getUint16(0),r,i;if(n===0){if(r=t.getUint32(2),r<qo)throw Error(`invalid padding`);i=6}else r=n,i=2;let a=e.subarray(i,i+r);if(r<Go||r>Ko||a.length!==r||e.length!==i+Xo(r))throw Error(`invalid padding`);return Fo.decode(a)}function ts(e,t,n){if(n.length!==32)throw Error(`AAD associated data must be 32 bytes`);return Ee(we,e,de(n,t))}function ns(e){if(typeof e!=`string`)throw Error(`payload must be a valid string`);let t=e.length;if(t<132)throw Error(`invalid payload length: `+t);if(e[0]===`#`)throw Error(`unknown encryption version`);let n;try{n=R.decode(e)}catch(e){throw Error(`invalid base64: `+e.message)}let r=n.length;if(r<99)throw Error(`invalid data length: `+r);let i=n[0];if(i!==2)throw Error(`unknown encryption version `+i);return{nonce:n.subarray(1,33),ciphertext:n.subarray(33,-32),mac:n.subarray(-32)}}function rs(e,t,n=me(32)){let{chacha_key:r,chacha_nonce:i,hmac_key:a}=Yo(t,n),o=Xa(r,i,$o(e)),s=ts(a,o,n);return R.encode(de(new Uint8Array([2]),n,o,s))}function is(e,t){let{nonce:n,ciphertext:r,mac:i}=ns(e),{chacha_key:a,chacha_nonce:o,hmac_key:s}=Yo(t,n);if(!Na(ts(s,r,n),i))throw Error(`invalid MAC`);return es(Xa(a,o,r))}var as=/^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/,os=22242,ss=24133;function cs(e,t){if(e.ids&&e.ids.indexOf(t.id)===-1||e.kinds&&e.kinds.indexOf(t.kind)===-1||e.authors&&e.authors.indexOf(t.pubkey)===-1)return!1;for(let n in e)if(n[0]===`#`){let r=e[`#${n.slice(1)}`];if(r&&!t.tags.find(([e,t])=>e===n.slice(1)&&r.indexOf(t)!==-1))return!1}return!(e.since&&t.created_at<e.since||e.until&&t.created_at>e.until)}function ls(e,t){for(let n=0;n<e.length;n++)if(cs(e[n],t))return!0;return!1}function us(e,t){let n=t.length+3,r=e.indexOf(`"${t}":`)+n,i=e.slice(r).indexOf(`"`)+r+1;return e.slice(i,i+64)}function ds(e){let t=e.slice(0,22).indexOf(`"EVENT"`);if(t===-1)return null;let n=e.slice(t+7+1).indexOf(`"`);if(n===-1)return null;let r=t+7+1+n,i=e.slice(r+1,80).indexOf(`"`);if(i===-1)return null;let a=r+1+i;return e.slice(r+1,a)}function fs(e,t){return{kind:os,created_at:Math.floor(Date.now()/1e3),tags:[[`relay`,e],[`challenge`,t]],content:``}}var ps=class extends Error{constructor(e,t){super(`Tried to send message '${e} on a closed connection to ${t}.`),this.name=`SendingOnClosedConnection`}},ms=class{url;_connected=!1;onclose=null;onnotice=e=>console.debug(`NOTICE from ${this.url}: ${e}`);onauth;baseEoseTimeout=4400;publishTimeout=4400;pingFrequency=29e3;pingTimeout=2e4;resubscribeBackoff=[1e4,1e4,1e4,2e4,2e4,3e4,6e4];openSubs=new Map;enablePing;enableReconnect;idleSince=Date.now();ongoingOperations=0;reconnectTimeoutHandle;pingIntervalHandle;reconnectAttempts=0;skipReconnection=!1;connectionPromise;openCountRequests=new Map;openEventPublishes=new Map;ws;challenge;authPromise;serial=0;verifyEvent;_WebSocket;constructor(e,t){this.url=Lo(e),this.verifyEvent=t.verifyEvent,this._WebSocket=t.websocketImplementation||WebSocket,this.enablePing=t.enablePing,this.enableReconnect=t.enableReconnect||!1}static async connect(e,t){let n=new ms(e,t);return await n.connect(t),n}closeAllSubscriptions(e){for(let[t,n]of this.openSubs)n.close(e);this.openSubs.clear();for(let[t,n]of this.openEventPublishes)n.reject(Error(e));this.openEventPublishes.clear();for(let[t,n]of this.openCountRequests)n.reject(Error(e));this.openCountRequests.clear()}get connected(){return this._connected}async reconnect(){let e=this.resubscribeBackoff[Math.min(this.reconnectAttempts,this.resubscribeBackoff.length-1)];this.reconnectAttempts++,this.reconnectTimeoutHandle=setTimeout(async()=>{try{await this.connect()}catch{}},e)}handleHardClose(e){this.pingIntervalHandle&&=(clearInterval(this.pingIntervalHandle),void 0),this._connected=!1,this.connectionPromise=void 0,this.idleSince=void 0,this.enableReconnect&&!this.skipReconnection?this.reconnect():(this.onclose?.(),this.closeAllSubscriptions(e))}async connect(e){let t;return this.connectionPromise?this.connectionPromise:(this.challenge=void 0,this.authPromise=void 0,this.skipReconnection=!1,this.connectionPromise=new Promise((n,r)=>{e?.timeout&&(t=setTimeout(()=>{r(`connection timed out`),this.connectionPromise=void 0,this.skipReconnection=!0,this.onclose?.(),this.handleHardClose(`relay connection timed out`)},e.timeout)),e?.abort&&(e.abort.onabort=r);try{this.ws=new this._WebSocket(this.url)}catch(e){clearTimeout(t),r(e);return}this.ws.onopen=()=>{this.reconnectTimeoutHandle&&=(clearTimeout(this.reconnectTimeoutHandle),void 0),clearTimeout(t),this._connected=!0;let e=this.reconnectAttempts>0;this.reconnectAttempts=0;for(let t of this.openSubs.values()){if(t.eosed=!1,e)for(let e=0;e<t.filters.length;e++)t.lastEmitted&&(t.filters[e].since=t.lastEmitted+1);t.fire()}this.enablePing&&(this.pingIntervalHandle=setInterval(()=>this.pingpong(),this.pingFrequency)),n()},this.ws.onerror=()=>{clearTimeout(t),r(`connection failed`),this.connectionPromise=void 0,this.skipReconnection=!0,this.onclose?.(),this.handleHardClose(`relay connection failed`)},this.ws.onclose=e=>{clearTimeout(t),r(e.message||`websocket closed`),this.handleHardClose(`relay connection closed`)},this.ws.onmessage=this._onmessage.bind(this)}),this.connectionPromise)}waitForPingPong(){return new Promise(e=>{this.ws.once(`pong`,()=>e(!0)),this.ws.ping()})}waitForDummyReq(){return new Promise((e,t)=>{if(!this.connectionPromise)return t(Error(`no connection to ${this.url}, can't ping`));try{let t=this.subscribe([{ids:[`aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`],limit:0}],{label:`<forced-ping>`,oneose:()=>{e(!0),t.close()},onclose(){e(!0)},eoseTimeout:this.pingTimeout+1e3})}catch(e){t(e)}})}async pingpong(){this.ws?.readyState===1&&(await Promise.any([this.ws&&this.ws.ping&&this.ws.once?this.waitForPingPong():this.waitForDummyReq(),new Promise(e=>setTimeout(()=>e(!1),this.pingTimeout))])||this.ws?.readyState===this._WebSocket.OPEN&&this.ws?.close())}async send(e){if(!this.connectionPromise)throw new ps(e,this.url);this.connectionPromise.then(()=>{this.ws?.send(e)})}async auth(e){let t=this.challenge;if(!t)throw Error(`can't perform auth, no challenge was received`);return this.authPromise||=new Promise(async(n,r)=>{try{let i=await e(fs(this.url,t)),a=setTimeout(()=>{let e=this.openEventPublishes.get(i.id);e&&(e.reject(Error(`auth timed out`)),this.openEventPublishes.delete(i.id))},this.publishTimeout);this.openEventPublishes.set(i.id,{resolve:n,reject:r,timeout:a}),this.send(`["AUTH",`+JSON.stringify(i)+`]`)}catch(e){console.warn(`subscribe auth function failed:`,e)}}),this.authPromise}async publish(e){this.idleSince=void 0,this.ongoingOperations++;let t=new Promise((t,n)=>{let r=setTimeout(()=>{let t=this.openEventPublishes.get(e.id);t&&(t.reject(Error(`publish timed out`)),this.openEventPublishes.delete(e.id))},this.publishTimeout);this.openEventPublishes.set(e.id,{resolve:t,reject:n,timeout:r})});return this.send(`["EVENT",`+JSON.stringify(e)+`]`),this.ongoingOperations--,this.ongoingOperations===0&&(this.idleSince=Date.now()),t}async count(e,t){this.serial++;let n=t?.id||`count:`+this.serial,r=new Promise((e,t)=>{this.openCountRequests.set(n,{resolve:e,reject:t})});return this.send(`["COUNT","`+n+`",`+JSON.stringify(e).substring(1)),r}subscribe(e,t){t.label!==`<forced-ping>`&&(this.idleSince=void 0,this.ongoingOperations++);let n=this.prepareSubscription(e,t);return n.fire(),t.abort&&(t.abort.onabort=()=>n.close(String(t.abort.reason||`<aborted>`))),n}prepareSubscription(e,t){this.serial++;let n=t.id||(t.label?t.label+`:`:`sub:`)+this.serial,r=new hs(this,n,e,t);return this.openSubs.set(n,r),r}close(){this.skipReconnection=!0,this.reconnectTimeoutHandle&&=(clearTimeout(this.reconnectTimeoutHandle),void 0),this.pingIntervalHandle&&=(clearInterval(this.pingIntervalHandle),void 0),this.closeAllSubscriptions(`relay connection closed by us`),this._connected=!1,this.idleSince=void 0,this.onclose?.(),this.ws?.readyState===this._WebSocket.OPEN&&this.ws?.close()}_onmessage(e){let t=e.data;if(!t)return;let n=ds(t);if(n){let e=this.openSubs.get(n);if(!e)return;let r=us(t,`id`),i=e.alreadyHaveEvent?.(r);if(e.receivedEvent?.(this,r),i)return}try{let e=JSON.parse(t);switch(e[0]){case`EVENT`:{let t=this.openSubs.get(e[1]),n=e[2];this.verifyEvent(n)&&ls(t.filters,n)?t.onevent(n):t.oninvalidevent?.(n),(!t.lastEmitted||t.lastEmitted<n.created_at)&&(t.lastEmitted=n.created_at);return}case`COUNT`:{let t=e[1],n=e[2],r=this.openCountRequests.get(t);r&&(r.resolve(n.count),this.openCountRequests.delete(t));return}case`EOSE`:{let t=this.openSubs.get(e[1]);if(!t)return;t.receivedEose();return}case`OK`:{let t=e[1],n=e[2],r=e[3],i=this.openEventPublishes.get(t);i&&(clearTimeout(i.timeout),n?i.resolve(r):i.reject(Error(r)),this.openEventPublishes.delete(t));return}case`CLOSED`:{let t=e[1],n=this.openSubs.get(t);if(!n)return;n.closed=!0,n.close(e[2]);return}case`NOTICE`:this.onnotice(e[1]);return;case`AUTH`:this.challenge=e[1],this.onauth&&this.auth(this.onauth).catch(e=>{if(!(e instanceof ps))throw e});return;default:this.openSubs.get(e[1])?.oncustom?.(e);return}}catch(e){try{let[n,r,i]=JSON.parse(t);console.warn(`[nostr] relay ${this.url} error processing message:`,e,i)}catch{console.warn(`[nostr] relay ${this.url} error processing message:`,e)}return}}},hs=class{relay;id;lastEmitted;closed=!1;eosed=!1;filters;alreadyHaveEvent;receivedEvent;onevent;oninvalidevent;oneose;onclose;oncustom;eoseTimeout;eoseTimeoutHandle;constructor(e,t,n,r){if(n.length===0)throw Error(`subscription can't be created with zero filters`);this.relay=e,this.filters=n,this.id=t,this.alreadyHaveEvent=r.alreadyHaveEvent,this.receivedEvent=r.receivedEvent,this.eoseTimeout=r.eoseTimeout||e.baseEoseTimeout,this.oneose=r.oneose,this.onclose=r.onclose,this.oninvalidevent=r.oninvalidevent,this.onevent=r.onevent||(e=>{console.warn(`onevent() callback not defined for subscription '${this.id}' in relay ${this.relay.url}. event received:`,e)})}fire(){this.relay.send(`["REQ","`+this.id+`",`+JSON.stringify(this.filters).substring(1)),this.eoseTimeoutHandle=setTimeout(this.receivedEose.bind(this),this.eoseTimeout)}receivedEose(){this.eosed||(clearTimeout(this.eoseTimeoutHandle),this.eosed=!0,this.oneose?.())}close(e=`closed by caller`){if(!this.closed&&this.relay.connected){try{this.relay.send(`["CLOSE",`+JSON.stringify(this.id)+`]`)}catch(e){if(!(e instanceof ps))throw e}this.closed=!0}this.relay.openSubs.delete(this.id),this.relay.ongoingOperations--,this.relay.ongoingOperations===0&&(this.relay.idleSince=Date.now()),this.onclose?.(e)}},gs=e=>(e[Mo]=!0,!0),_s=class{relays=new Map;seenOn=new Map;trackRelays=!1;verifyEvent;enablePing;enableReconnect;automaticallyAuth;trustedRelayURLs=new Set;onRelayConnectionFailure;onRelayConnectionSuccess;allowConnectingToRelay;maxWaitForConnection;_WebSocket;constructor(e){this.verifyEvent=e.verifyEvent,this._WebSocket=e.websocketImplementation,this.enablePing=e.enablePing,this.enableReconnect=e.enableReconnect||!1,this.automaticallyAuth=e.automaticallyAuth,this.onRelayConnectionFailure=e.onRelayConnectionFailure,this.onRelayConnectionSuccess=e.onRelayConnectionSuccess,this.allowConnectingToRelay=e.allowConnectingToRelay,this.maxWaitForConnection=e.maxWaitForConnection||3e3}async ensureRelay(e,t){e=Lo(e);let n=this.relays.get(e);if(n||(n=new ms(e,{verifyEvent:this.trustedRelayURLs.has(e)?gs:this.verifyEvent,websocketImplementation:this._WebSocket,enablePing:this.enablePing,enableReconnect:this.enableReconnect}),n.onclose=()=>{this.relays.delete(e)},this.relays.set(e,n)),this.automaticallyAuth){let t=this.automaticallyAuth(e);t&&(n.onauth=t)}try{await n.connect({timeout:t?.connectionTimeout,abort:t?.abort})}catch(t){throw this.relays.delete(e),t}return n}close(e){e.map(Lo).forEach(e=>{this.relays.get(e)?.close(),this.relays.delete(e)})}subscribe(e,t,n){let r=[],i=[];for(let n=0;n<e.length;n++){let a=Lo(e[n]);r.find(e=>e.url===a)||i.indexOf(a)===-1&&(i.push(a),r.push({url:a,filter:t}))}return this.subscribeMap(r,n)}subscribeMany(e,t,n){return this.subscribe(e,t,n)}subscribeMap(e,t){let n=new Map;for(let t of e){let{url:e,filter:r}=t;n.has(e)||n.set(e,[]),n.get(e).push(r)}let r=Array.from(n.entries()).map(([e,t])=>({url:e,filters:t}));this.trackRelays&&(t.receivedEvent=(e,t)=>{let n=this.seenOn.get(t);n||(n=new Set,this.seenOn.set(t,n)),n.add(e)});let i=new Set,a=[],o=[],s=e=>{o[e]||(o[e]=!0,o.filter(e=>e).length===r.length&&(t.oneose?.(),s=()=>{}))},c=[],l=(e,n)=>{c[e]||(s(e),c[e]=n,c.filter(e=>e).length===r.length&&(t.onclose?.(c),l=()=>{}))},u=e=>{if(t.alreadyHaveEvent?.(e))return!0;let n=i.has(e);return i.add(e),n},d=Promise.all(r.map(async({url:e,filters:n},r)=>{if(this.allowConnectingToRelay?.(e,[`read`,n])===!1){l(r,`connection skipped by allowConnectingToRelay`);return}let i;try{i=await this.ensureRelay(e,{connectionTimeout:this.maxWaitForConnection<(t.maxWait||0)?Math.max(t.maxWait*.8,t.maxWait-1e3):this.maxWaitForConnection,abort:t.abort})}catch(t){this.onRelayConnectionFailure?.(e),l(r,t?.message||String(t));return}this.onRelayConnectionSuccess?.(e);let o=i.subscribe(n,{...t,oneose:()=>s(r),onclose:e=>{e.startsWith(`auth-required: `)&&t.onauth?i.auth(t.onauth).then(()=>{i.subscribe(n,{...t,oneose:()=>s(r),onclose:e=>{l(r,e)},alreadyHaveEvent:u,eoseTimeout:t.maxWait,abort:t.abort})}).catch(e=>{l(r,`auth was required and attempted, but failed with: ${e}`)}):l(r,e)},alreadyHaveEvent:u,eoseTimeout:t.maxWait,abort:t.abort});a.push(o)}));return{async close(e){await d,a.forEach(t=>{t.close(e)})}}}subscribeEose(e,t,n){let r;return r=this.subscribe(e,t,{...n,oneose(){let t=`closed automatically on eose`;r?r.close(t):n.onclose?.(e.map(e=>t))}}),r}subscribeManyEose(e,t,n){return this.subscribeEose(e,t,n)}async querySync(e,t,n){return new Promise(async r=>{let i=[];this.subscribeEose(e,t,{...n,onevent(e){i.push(e)},onclose(e){r(i)}})})}async get(e,t,n){t.limit=1;let r=await this.querySync(e,t,n);return r.sort((e,t)=>t.created_at-e.created_at),r[0]||null}publish(e,t,n){return e.map(Lo).map(async(e,r,i)=>{if(i.indexOf(e)!==r)return Promise.reject(`duplicate url`);if(this.allowConnectingToRelay?.(e,[`write`,t])===!1)return Promise.reject(`connection skipped by allowConnectingToRelay`);let a;try{a=await this.ensureRelay(e,{connectionTimeout:this.maxWaitForConnection<(n?.maxWait||0)?Math.max(n.maxWait*.8,n.maxWait-1e3):this.maxWaitForConnection,abort:n?.abort})}catch(t){return this.onRelayConnectionFailure?.(e),String(`connection failure: `+String(t))}return a.publish(t).catch(async e=>{if(e instanceof Error&&e.message.startsWith(`auth-required: `)&&n?.onauth)return await a.auth(n.onauth),a.publish(t);throw e}).then(e=>{if(this.trackRelays){let e=this.seenOn.get(t.id);e||(e=new Set,this.seenOn.set(t.id,e)),e.add(a)}return e})})}listConnectionStatus(){let e=new Map;return this.relays.forEach((t,n)=>e.set(n,t.connected)),e}destroy(){this.relays.forEach(e=>e.close()),this.relays=new Map}pruneIdleRelays(e=1e4){let t=[];for(let[n,r]of this.relays)r.idleSince&&Date.now()-r.idleSince>=e&&(this.relays.delete(n),t.push(n),r.close());return t}},vs;try{vs=WebSocket}catch{}var ys=class extends _s{constructor(e){super({verifyEvent:Wo,websocketImplementation:vs,maxWaitForConnection:3e3,...e})}},bs;try{bs=fetch}catch{}var xs=/^bunker:\/\/([0-9a-f]{64})\??([?\/\w:.=&%-]*)$/;async function Ss(e){let t=e.match(xs);if(t)try{let e=t[1],n=new URLSearchParams(t[2]);return{pubkey:e,relays:n.getAll(`relay`),secret:n.get(`secret`)}}catch{}return Cs(e)}async function Cs(e){let t=e.match(as);if(!t)return null;let[n,r=`_`,i]=t;try{let e=`https://${i}/.well-known/nostr.json?name=${r}`,t=await(await bs(e,{redirect:`error`})).json(),n=t.names[r];return{pubkey:n,relays:t.nip46[n]||[],secret:null}}catch{return null}}var ws=class{params;pool;subCloser;isOpen;serial;idPrefix;listeners;waitingForAuth;secretKey;conversationKey;bp;cachedPubKey;constructor(e,t){this.params=t,this.pool=t.pool||new ys,this.secretKey=e,this.isOpen=!1,this.idPrefix=Math.random().toString(36).substring(7),this.serial=0,this.listeners={},this.waitingForAuth={}}static fromBunker(e,t,n={}){if(t.relays.length===0)throw Error(`no relays specified for this bunker`);let r=new ws(e,n);return r.conversationKey=Jo(e,t.pubkey),r.bp=t,r.setupSubscription(),r}static async fromURI(e,t,n={},r=3e5){let i=new ws(e,n),a=new URL(t),o=Ho(e);return new Promise((t,s)=>{let c=!1,l=i.pool.subscribe(a.searchParams.getAll(`relay`),{kinds:[ss],"#p":[o],limit:0},{onevent:async r=>{try{let o=Jo(e,r.pubkey),s=is(r.content,o);JSON.parse(s).result===a.searchParams.get(`secret`)&&(l.close(),i.bp={pubkey:r.pubkey,relays:a.searchParams.getAll(`relay`),secret:a.searchParams.get(`secret`)},i.conversationKey=Jo(e,r.pubkey),i.setupSubscription(),c=!0,n.skipSwitchRelays||await Promise.race([new Promise(e=>setTimeout(e,1e3)),i.switchRelays()]),t(i))}catch(e){console.warn(`failed to process potential connection event`,e)}},onclose:()=>{c||s(Error(`subscription closed before connection was established.`))},maxWait:typeof r==`number`?r:void 0,abort:typeof r==`number`?void 0:r})})}setupSubscription(){let e=this.listeners,t=this.waitingForAuth,n=this.conversationKey;this.subCloser=this.pool.subscribe(this.bp.relays,{kinds:[ss],authors:[this.bp.pubkey],"#p":[Ho(this.secretKey)],limit:0},{onevent:async r=>{let{id:i,result:a,error:o}=JSON.parse(is(r.content,n));if(a===`auth_url`&&t[i]){delete t[i],this.params.onauth?this.params.onauth(o):console.warn(`nostr-tools/nip46: remote signer ${this.bp.pubkey} tried to send an "auth_url"='${o}' but there was no onauth() callback configured.`);return}let s=e[i];s&&(o?s.reject(o):a&&s.resolve(a),delete e[i])},onclose:()=>{this.subCloser=void 0}}),this.isOpen=!0}async switchRelays(){try{let e=await this.sendRequest(`switch_relays`,[]),t=JSON.parse(e);if(!t||JSON.stringify(t.sort())===JSON.stringify(this.bp.relays))return!1;this.bp.relays=t;let n=this.subCloser;return setTimeout(()=>{n.close()},5e3),this.subCloser=void 0,this.setupSubscription(),!0}catch{return!1}}async close(){this.isOpen=!1,this.subCloser.close()}async sendRequest(e,t){return new Promise(async(n,r)=>{try{if(!this.isOpen)throw Error(`this signer is not open anymore, create a new one`);this.subCloser||this.setupSubscription(),this.serial++;let i=`${this.idPrefix}-${this.serial}`,a=rs(JSON.stringify({id:i,method:e,params:t}),this.conversationKey),o=Uo({kind:ss,tags:[[`p`,this.bp.pubkey]],content:a,created_at:Math.floor(Date.now()/1e3)},this.secretKey);this.listeners[i]={resolve:n,reject:r},this.waitingForAuth[i]=!0,await Promise.any(this.pool.publish(this.bp.relays,o))}catch(e){r(e)}})}async ping(){let e=await this.sendRequest(`ping`,[]);if(e!==`pong`)throw Error(`result is not pong: ${e}`)}async connect(){await this.sendRequest(`connect`,[this.bp.pubkey,this.bp.secret||``])}async getPublicKey(){return this.cachedPubKey||=await this.sendRequest(`get_public_key`,[]),this.cachedPubKey}async signEvent(e){let t=await this.sendRequest(`sign_event`,[JSON.stringify(e)]),n=JSON.parse(t);if(Wo(n))return n;throw Error(`event returned from bunker is improperly signed: ${JSON.stringify(n)}`)}async nip04Encrypt(e,t){return await this.sendRequest(`nip04_encrypt`,[e,t])}async nip04Decrypt(e,t){return await this.sendRequest(`nip04_decrypt`,[e,t])}async nip44Encrypt(e,t){return await this.sendRequest(`nip44_encrypt`,[e,t])}async nip44Decrypt(e,t){return await this.sendRequest(`nip44_decrypt`,[e,t])}},Ts=new TextDecoder(`utf-8`);new TextEncoder;var Es=5e3;function Ds(e){let{prefix:t,words:n}=L.decode(e,Es),r=new Uint8Array(L.fromWords(n));switch(t){case`nprofile`:{let e=Os(r);if(!e[0]?.[0])throw Error(`missing TLV 0 for nprofile`);if(e[0][0].length!==32)throw Error(`TLV 0 should be 32 bytes`);return{type:`nprofile`,data:{pubkey:he(e[0][0]),relays:e[1]?e[1].map(e=>Ts.decode(e)):[]}}}case`nevent`:{let e=Os(r);if(!e[0]?.[0])throw Error(`missing TLV 0 for nevent`);if(e[0][0].length!==32)throw Error(`TLV 0 should be 32 bytes`);if(e[2]&&e[2][0].length!==32)throw Error(`TLV 2 should be 32 bytes`);if(e[3]&&e[3][0].length!==4)throw Error(`TLV 3 should be 4 bytes`);return{type:`nevent`,data:{id:he(e[0][0]),relays:e[1]?e[1].map(e=>Ts.decode(e)):[],author:e[2]?.[0]?he(e[2][0]):void 0,kind:e[3]?.[0]?parseInt(he(e[3][0]),16):void 0}}}case`naddr`:{let e=Os(r);if(!e[0]?.[0])throw Error(`missing TLV 0 for naddr`);if(!e[2]?.[0])throw Error(`missing TLV 2 for naddr`);if(e[2][0].length!==32)throw Error(`TLV 2 should be 32 bytes`);if(!e[3]?.[0])throw Error(`missing TLV 3 for naddr`);if(e[3][0].length!==4)throw Error(`TLV 3 should be 4 bytes`);return{type:`naddr`,data:{identifier:Ts.decode(e[0][0]),pubkey:he(e[2][0]),kind:parseInt(he(e[3][0]),16),relays:e[1]?e[1].map(e=>Ts.decode(e)):[]}}}case`nsec`:return{type:t,data:r};case`npub`:case`note`:return{type:t,data:he(r)};default:throw Error(`unknown prefix ${t}`)}}function Os(e){let t={},n=e;for(;n.length>0;){let e=n[0],r=n[1],i=n.slice(2,2+r);if(n=n.slice(2+r),i.length<r)throw Error(`not enough data to read on TLV ${e}`);t[e]=t[e]||[],t[e].push(i)}return t}function ks(e){return Ms(`nsec`,e)}function As(e){return Ms(`npub`,fe(e))}function js(e,t){let n=L.toWords(t);return L.encode(e,n,Es)}function Ms(e,t){return js(e,t)}function Ns(){return typeof window<`u`&&!!window.nostr&&typeof window.nostr.signEvent==`function`}var Ps=class{constructor(e,t){this.pubkey=e,this.provider=t,this.method=`nip07`,this.capabilities={canSignEvents:!0,hasNip44:!!t.nip44},t.nip44&&(this.nip44={encrypt:(e,n)=>t.nip44.encrypt(e,n),decrypt:(e,n)=>t.nip44.decrypt(e,n)})}async signEvent(e){return Fs(()=>this.provider.signEvent(e))}async close(){}};async function Fs(e){try{return await e()}catch(t){if(!Is(t))throw t;return await new Promise(e=>setTimeout(e,250)),e()}}function Is(e){let t=e instanceof Error?e.message:String(e);return/Request failed|Receiving end does not exist|Extension context invalidated|message port closed|context invalidated/i.test(t)}async function Ls(){if(!Ns())throw Error(`no-nip07-provider`);let e=window.nostr,t=await e.getPublicKey();if(!/^[0-9a-f]{64}$/i.test(t))throw Error(`invalid-pubkey-from-nip07`);return new Ps(t.toLowerCase(),e)}var Rs=class{constructor(e,t,n,r){this.pubkey=e,this.bunker=t,this.bunkerUri=n,this.clientSecretKey=r,this.method=`bunker`,this.capabilities={canSignEvents:!0,hasNip44:!0},this.nip44={encrypt:(e,n)=>t.nip44Encrypt(e,n),decrypt:(e,n)=>t.nip44Decrypt(e,n)}}async signEvent(e){let{pubkey:t,...n}=e,r={kind:n.kind,content:n.content,created_at:n.created_at??Math.floor(Date.now()/1e3),tags:n.tags??[]};return await this.bunker.signEvent(r)}async close(){await this.bunker.close()}};async function zs(e){let{uri:t,clientSecretKey:n,abortSignal:r}=e;if(n.length!==32)throw Error(`invalid-client-secret-key`);let i=r?await ws.fromURI(n,t,void 0,r):await ws.fromURI(n,t),a=await i.getPublicKey();if(!/^[0-9a-f]{64}$/i.test(a))throw await i.close().catch(()=>{}),Error(`invalid-pubkey-from-bunker`);let o=Vs(t,a);return new Rs(a.toLowerCase(),i,o,n)}function Bs(e){let{clientPubkeyHex:t,secret:n}=e;if(!/^[0-9a-f]{64}$/i.test(t))throw Error(`invalid-client-pubkey`);let r=(e.relayUrls??(e.relayUrl?[e.relayUrl]:[])).map(e=>e.trim()).filter(Boolean);if(r.length===0)throw Error(`relay-url-required`);for(let e of r)if(!/^wss?:\/\//.test(e))throw Error(`invalid-relay-url`);let i=new URLSearchParams;for(let e of r)i.append(`relay`,e);return i.set(`secret`,n),e.perms&&e.perms.length>0&&i.set(`perms`,e.perms.join(`,`)),e.appName&&i.set(`name`,e.appName),e.appUrl&&i.set(`url`,e.appUrl),`nostrconnect://${t}?${i.toString()}`}function Vs(e,t){if(!/^[0-9a-f]{64}$/i.test(t))throw Error(`invalid-signer-pubkey`);let n;try{n=new URL(e)}catch{throw Error(`invalid-nostrconnect-uri`)}if(n.protocol!==`nostrconnect:`)throw Error(`invalid-nostrconnect-uri`);let r=n.searchParams.getAll(`relay`).map(e=>e.trim()).filter(Boolean);if(r.length===0)throw Error(`relay-url-required`);for(let e of r)if(!/^wss?:\/\//.test(e))throw Error(`invalid-relay-url`);let i=n.searchParams.get(`secret`),a=new URLSearchParams;for(let e of r)a.append(`relay`,e);return i&&a.set(`secret`,i),`bunker://${t.toLowerCase()}?${a.toString()}`}function Hs(e){return e.trim().toLowerCase().startsWith(`bunker://`)}function Us(e){return e.trim().toLowerCase().startsWith(`nostrconnect://`)}function Ws(e){return Hs(e)||Us(e)}async function Gs(e,t,n){let r,i=new Promise((e,i)=>{r=setTimeout(()=>{n.close().catch(()=>{}),i(Error(`bunker-connect-timeout`))},t)});try{return await Promise.race([e,i])}finally{r!==void 0&&clearTimeout(r)}}async function Ks(e){let t=e.uri.trim();if(!t)throw Error(`empty-bunker-uri`);let n=await Ss(t);if(!n)throw Error(`invalid-bunker-uri`);let r=e.clientSecretKey??qs();if(r.length!==32)throw Error(`invalid-client-secret-key`);let i=ws.fromBunker(r,n,{onauth:e.onauth}),a=(async()=>(await i.connect(),i.getPublicKey()))(),o=e.timeoutMs&&e.timeoutMs>0?await Gs(a,e.timeoutMs,i):await a;if(!/^[0-9a-f]{64}$/i.test(o))throw await i.close().catch(()=>{}),Error(`invalid-pubkey-from-bunker`);return new Rs(o.toLowerCase(),i,t,r)}function qs(){let e=new Uint8Array(32);return crypto.getRandomValues(e),e}var Js=class{constructor(e,t){this.pubkey=e,this.privkey=t,this.method=`nsec`,this.capabilities={canSignEvents:!0,hasNip44:!0},this.nip44={encrypt:async(e,t)=>ho(t,G(this.privkey,e)),decrypt:async(e,t)=>go(t,G(this.privkey,e))}}async signEvent(e){return Fe({kind:e.kind,content:e.content,created_at:e.created_at??Math.floor(Date.now()/1e3),tags:e.tags??[]},this.privkey)}async close(){this.privkey.fill(0)}};function Ys(e){let t=e.trim();if(!t)throw Error(`empty-nsec`);let n;if(t.startsWith(`nsec1`)){let e=Ds(t);if(e.type!==`nsec`)throw Error(`not-an-nsec`);n=e.data}else if(/^[0-9a-f]{64}$/i.test(t)){n=new Uint8Array(32);for(let e=0;e<32;e++)n[e]=parseInt(t.slice(e*2,e*2+2),16)}else throw Error(`invalid-nsec-format`);if(n.length!==32)throw Error(`invalid-nsec-length`);let r=Me(n);if(!/^[0-9a-f]{64}$/i.test(r))throw Error(`invalid-pubkey-from-nsec`);return new Js(r.toLowerCase(),n)}var Xs=class{constructor(e,t){this.pubkey=e,this.authEvent=t,this.method=`redirect`,this.capabilities={canSignEvents:!1,hasNip44:!1}}async signEvent(e){throw Error(`signer-auth-only: this session was established via redirect and cannot sign new events. Install a NIP-07 extension (bark, Alby) or paste a bunker URI to upgrade.`)}async close(){}},Zs=class{constructor(e,t,n,r,i,a=!0){this.pubkey=e,this.authEvent=t,this.upgrade=n,this.bunkerUri=r,this.clientSecretKey=i,this.method=`bunker`,this.capabilities={canSignEvents:a,hasNip44:a},this.upgrade.then(e=>{e&&(this.capabilities.canSignEvents=!0,this.capabilities.hasNip44=!0)}),this.nip44={encrypt:async(e,t)=>(await this.live()).nip44.encrypt(e,t),decrypt:async(e,t)=>(await this.live()).nip44.decrypt(e,t)}}async live(){let e=await this.upgrade;if(!e)throw Error(`signer-auth-only: the redirect bunker handoff did not connect, so this session cannot sign. Reconnect the signer or paste a bunker URI to upgrade.`);return e}async signEvent(e){return(await this.live()).signEvent(e)}async close(){let e=await this.upgrade.catch(()=>null);e&&await e.close().catch(()=>{})}};function Qs(e){try{return typeof localStorage<`u`?localStorage.getItem(e):null}catch{return null}}function $s(e,t){try{typeof localStorage<`u`&&localStorage.setItem(e,t)}catch{}}function ec(e){try{typeof localStorage<`u`&&localStorage.removeItem(e)}catch{}}async function tc(e,t){if(!e)return Qs(t);try{return await e.getItem(t)}catch{return null}}async function nc(e,t,n){if(!e){$s(t,n);return}try{await e.setItem(t,n)}catch{}}async function rc(e,t){if(!e){ec(t);return}try{await e.removeItem(t)}catch{}}async function ic(e,t){await nc(t,K.pubkey,e.pubkey),await nc(t,K.method,e.method),await nc(t,K.authEvent,e.authEventJson),e.bunkerUri===void 0?await rc(t,K.bunkerUri):await nc(t,K.bunkerUri,e.bunkerUri),e.bunkerClientSkHex===void 0?await rc(t,K.bunkerClientSk):await nc(t,K.bunkerClientSk,e.bunkerClientSkHex),e.expiresAt===void 0?await rc(t,K.expiresAt):await nc(t,K.expiresAt,String(e.expiresAt)),e.displayName===void 0?await rc(t,K.displayName):await nc(t,K.displayName,e.displayName)}function ac(e){let{pubkey:t,authEventJson:n}=e,r=e.method;if(!t||!r||!n||!/^[0-9a-f]{64}$/i.test(t)||r!==`nip07`&&r!==`redirect`&&r!==`bunker`&&r!==`amber`)return null;let i;try{if(i=JSON.parse(n),typeof i!=`object`||!i||i.pubkey!==t)return null}catch{return null}let a=e.expiresAtRaw?Number(e.expiresAtRaw):void 0;if(a!==void 0&&!Number.isFinite(a))return null;let o={pubkey:t,method:r,authEventJson:n};return e.bunkerUri&&(o.bunkerUri=e.bunkerUri),e.bunkerClientSkHex&&(o.bunkerClientSkHex=e.bunkerClientSkHex),a!==void 0&&(o.expiresAt=a),e.displayName&&(o.displayName=e.displayName),o}async function oc(e){let t=ac({pubkey:await tc(e,K.pubkey),method:await tc(e,K.method),authEventJson:await tc(e,K.authEvent),bunkerUri:await tc(e,K.bunkerUri),bunkerClientSkHex:await tc(e,K.bunkerClientSk),expiresAtRaw:await tc(e,K.expiresAt),displayName:await tc(e,K.displayName)});return t?t.expiresAt!==void 0&&Date.now()>t.expiresAt?(await sc(e),null):t:null}async function sc(e){await rc(e,K.pubkey),await rc(e,K.method),await rc(e,K.authEvent),await rc(e,K.bunkerUri),await rc(e,K.bunkerClientSk),await rc(e,K.expiresAt),await rc(e,K.displayName)}async function cc(e){let t=await tc(e,K.clientSk);if(t&&/^[0-9a-f]{64}$/i.test(t))try{return mc(t)}catch{}let n=new Uint8Array(32);return crypto.getRandomValues(n),await nc(e,K.clientSk,pc(n)),n}async function lc(e,t){await nc(t,K.pendingRedirect,JSON.stringify(e))}function uc(e){if(!e)return null;try{let t=JSON.parse(e),n=t.challenge,r=t.origin,i=t.appName,a=t.createdAt;return typeof n!=`string`||!/^[0-9a-f]{64}$/i.test(n)||typeof r!=`string`||r.length===0||typeof i!=`string`||i.length===0||typeof a!=`number`||!Number.isFinite(a)?null:{challenge:n,origin:r,appName:i,createdAt:a}}catch{return null}}async function dc(e){return uc(await tc(e,K.pendingRedirect))}async function fc(e){await rc(e,K.pendingRedirect)}function pc(e){let t=``;for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,`0`);return t}function mc(e){if(e.length%2!=0)throw Error(`odd-hex-length`);let t=new Uint8Array(e.length/2);for(let n=0;n<t.length;n++)t[n]=parseInt(e.slice(n*2,n*2+2),16);return t}function hc(){return typeof navigator>`u`?!1:/android/i.test(navigator.userAgent)}var gc=/^[0-9a-f]{64}$/i;function _c(e){return{kind:21236,content:``,created_at:Math.floor(Date.now()/1e3),tags:[[`challenge`,e.challenge],[`origin`,e.origin],[`app`,e.appName]]}}function vc(e){let t=_c(e),n=JSON.stringify(t),r=typeof btoa==`function`?btoa(n):Buffer.from(n,`utf-8`).toString(`base64`),i=e.redirectCallback??`${e.origin}/?signet_amber=1`;return`nostrsigner:${r}?${new URLSearchParams({type:`sign_event`,compressionType:`base64`,returnType:`event`,callbackUrl:i}).toString()}`}async function yc(e){if(typeof window>`u`)throw Error(`signet-login: amber mode requires a browser environment`);return await lc({challenge:e.challenge,origin:e.origin,appName:e.appName,createdAt:Date.now()},e.storage),window.location.href=vc(e),new Promise(()=>{})}function bc(){if(typeof window>`u`)return;let e=new URL(window.location.href),t=!1;for(let n of[`event`,`signet_amber`,`error`])e.searchParams.has(n)&&(e.searchParams.delete(n),t=!0);if(!t)return;let n=e.pathname+(e.search?e.search:``)+e.hash;try{window.history.replaceState(window.history.state,document.title,n)}catch{}}function xc(e,t){if(typeof window>`u`)return{kind:`no-callback`};let n=new URLSearchParams(window.location.search);if(!(n.has(`signet_amber`)||n.has(`event`)))return{kind:`no-callback`};if(n.get(`error`)===`denied`)return t({kind:`denied`});if(!e)return t({kind:`invalid`,reason:`no-pending-state`});if(e.origin!==window.location.origin)return t({kind:`invalid`,reason:`origin-mismatch`});if(Date.now()-e.createdAt>3e5)return t({kind:`invalid`,reason:`pending-stale`});let r=n.get(`event`);if(!r)return t({kind:`invalid`,reason:`no-event-param`});let i;try{let e;try{e=typeof atob==`function`?atob(r):Buffer.from(r,`base64`).toString(`utf-8`)}catch{e=r}i=JSON.parse(e)}catch{return t({kind:`invalid`,reason:`event-malformed`})}if(typeof i!=`object`||!i)return t({kind:`invalid`,reason:`event-not-object`});let a=i;if(typeof a.id!=`string`||!gc.test(a.id)||typeof a.pubkey!=`string`||!gc.test(a.pubkey)||typeof a.sig!=`string`||!/^[0-9a-f]{128}$/i.test(a.sig)||typeof a.created_at!=`number`||!Array.isArray(a.tags)||a.kind!==21236||typeof a.content!=`string`)return t({kind:`invalid`,reason:`event-shape-invalid`});let o=a.tags.find(e=>Array.isArray(e)&&e[0]===`challenge`);if(!o||o[1]!==e.challenge)return t({kind:`invalid`,reason:`challenge-mismatch`});let s={id:a.id.toLowerCase(),pubkey:a.pubkey.toLowerCase(),kind:21236,created_at:a.created_at,tags:a.tags,content:a.content,sig:a.sig.toLowerCase()},c=new Xs(s.pubkey,s);return t({kind:`session`,session:{pubkey:s.pubkey,method:`amber`,signer:c,authEvent:s}})}async function Sc(e){return await xc(await dc(e),async t=>(await fc(e),bc(),t))}var Cc=typeof globalThis==`object`&&`crypto`in globalThis?globalThis.crypto:void 0;function wc(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name===`Uint8Array`}function Tc(e){if(!Number.isSafeInteger(e)||e<0)throw Error(`positive integer expected, got `+e)}function Ec(e,...t){if(!wc(e))throw Error(`Uint8Array expected`);if(t.length>0&&!t.includes(e.length))throw Error(`Uint8Array expected of length `+t+`, got length=`+e.length)}function Dc(e){if(typeof e!=`function`||typeof e.create!=`function`)throw Error(`Hash should be wrapped by utils.createHasher`);Tc(e.outputLen),Tc(e.blockLen)}function Oc(e,t=!0){if(e.destroyed)throw Error(`Hash instance has been destroyed`);if(t&&e.finished)throw Error(`Hash#digest() has already been called`)}function kc(e,t){Ec(e);let n=t.outputLen;if(e.length<n)throw Error(`digestInto() expects output buffer of length at least `+n)}function Ac(...e){for(let t=0;t<e.length;t++)e[t].fill(0)}function jc(e){return new DataView(e.buffer,e.byteOffset,e.byteLength)}function Mc(e,t){return e<<32-t|e>>>t}var Nc=typeof Uint8Array.from([]).toHex==`function`&&typeof Uint8Array.fromHex==`function`,Pc=Array.from({length:256},(e,t)=>t.toString(16).padStart(2,`0`));function Fc(e){if(Ec(e),Nc)return e.toHex();let t=``;for(let n=0;n<e.length;n++)t+=Pc[e[n]];return t}var Ic={_0:48,_9:57,A:65,F:70,a:97,f:102};function Lc(e){if(e>=Ic._0&&e<=Ic._9)return e-Ic._0;if(e>=Ic.A&&e<=Ic.F)return e-(Ic.A-10);if(e>=Ic.a&&e<=Ic.f)return e-(Ic.a-10)}function Rc(e){if(typeof e!=`string`)throw Error(`hex string expected, got `+typeof e);if(Nc)return Uint8Array.fromHex(e);let t=e.length,n=t/2;if(t%2)throw Error(`hex string expected, got unpadded hex of length `+t);let r=new Uint8Array(n);for(let t=0,i=0;t<n;t++,i+=2){let n=Lc(e.charCodeAt(i)),a=Lc(e.charCodeAt(i+1));if(n===void 0||a===void 0){let t=e[i]+e[i+1];throw Error(`hex string expected, got non-hex character "`+t+`" at index `+i)}r[t]=n*16+a}return r}function zc(e){if(typeof e!=`string`)throw Error(`string expected`);return new Uint8Array(new TextEncoder().encode(e))}function Bc(e){return typeof e==`string`&&(e=zc(e)),Ec(e),e}function Vc(...e){let t=0;for(let n=0;n<e.length;n++){let r=e[n];Ec(r),t+=r.length}let n=new Uint8Array(t);for(let t=0,r=0;t<e.length;t++){let i=e[t];n.set(i,r),r+=i.length}return n}var Hc=class{};function Uc(e){let t=t=>e().update(Bc(t)).digest(),n=e();return t.outputLen=n.outputLen,t.blockLen=n.blockLen,t.create=()=>e(),t}function Wc(e=32){if(Cc&&typeof Cc.getRandomValues==`function`)return Cc.getRandomValues(new Uint8Array(e));if(Cc&&typeof Cc.randomBytes==`function`)return Uint8Array.from(Cc.randomBytes(e));throw Error(`crypto.getRandomValues must be defined`)}function Gc(e,t,n,r){if(typeof e.setBigUint64==`function`)return e.setBigUint64(t,n,r);let i=BigInt(32),a=BigInt(4294967295),o=Number(n>>i&a),s=Number(n&a),c=r?4:0,l=r?0:4;e.setUint32(t+c,o,r),e.setUint32(t+l,s,r)}function Kc(e,t,n){return e&t^~e&n}function qc(e,t,n){return e&t^e&n^t&n}var Jc=class extends Hc{constructor(e,t,n,r){super(),this.finished=!1,this.length=0,this.pos=0,this.destroyed=!1,this.blockLen=e,this.outputLen=t,this.padOffset=n,this.isLE=r,this.buffer=new Uint8Array(e),this.view=jc(this.buffer)}update(e){Oc(this),e=Bc(e),Ec(e);let{view:t,buffer:n,blockLen:r}=this,i=e.length;for(let a=0;a<i;){let o=Math.min(r-this.pos,i-a);if(o===r){let t=jc(e);for(;r<=i-a;a+=r)this.process(t,a);continue}n.set(e.subarray(a,a+o),this.pos),this.pos+=o,a+=o,this.pos===r&&(this.process(t,0),this.pos=0)}return this.length+=e.length,this.roundClean(),this}digestInto(e){Oc(this),kc(e,this),this.finished=!0;let{buffer:t,view:n,blockLen:r,isLE:i}=this,{pos:a}=this;t[a++]=128,Ac(this.buffer.subarray(a)),this.padOffset>r-a&&(this.process(n,0),a=0);for(let e=a;e<r;e++)t[e]=0;Gc(n,r-8,BigInt(this.length*8),i),this.process(n,0);let o=jc(e),s=this.outputLen;if(s%4)throw Error(`_sha2: outputLen should be aligned to 32bit`);let c=s/4,l=this.get();if(c>l.length)throw Error(`_sha2: outputLen bigger than state`);for(let e=0;e<c;e++)o.setUint32(4*e,l[e],i)}digest(){let{buffer:e,outputLen:t}=this;this.digestInto(e);let n=e.slice(0,t);return this.destroy(),n}_cloneInto(e){e||=new this.constructor,e.set(...this.get());let{blockLen:t,buffer:n,length:r,finished:i,destroyed:a,pos:o}=this;return e.destroyed=a,e.finished=i,e.length=r,e.pos=o,r%t&&e.buffer.set(n),e}clone(){return this._cloneInto()}},Yc=Uint32Array.from([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),Xc=Uint32Array.from([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),Zc=new Uint32Array(64),Qc=class extends Jc{constructor(e=32){super(64,e,8,!1),this.A=Yc[0]|0,this.B=Yc[1]|0,this.C=Yc[2]|0,this.D=Yc[3]|0,this.E=Yc[4]|0,this.F=Yc[5]|0,this.G=Yc[6]|0,this.H=Yc[7]|0}get(){let{A:e,B:t,C:n,D:r,E:i,F:a,G:o,H:s}=this;return[e,t,n,r,i,a,o,s]}set(e,t,n,r,i,a,o,s){this.A=e|0,this.B=t|0,this.C=n|0,this.D=r|0,this.E=i|0,this.F=a|0,this.G=o|0,this.H=s|0}process(e,t){for(let n=0;n<16;n++,t+=4)Zc[n]=e.getUint32(t,!1);for(let e=16;e<64;e++){let t=Zc[e-15],n=Zc[e-2],r=Mc(t,7)^Mc(t,18)^t>>>3;Zc[e]=(Mc(n,17)^Mc(n,19)^n>>>10)+Zc[e-7]+r+Zc[e-16]|0}let{A:n,B:r,C:i,D:a,E:o,F:s,G:c,H:l}=this;for(let e=0;e<64;e++){let t=Mc(o,6)^Mc(o,11)^Mc(o,25),u=l+t+Kc(o,s,c)+Xc[e]+Zc[e]|0,d=(Mc(n,2)^Mc(n,13)^Mc(n,22))+qc(n,r,i)|0;l=c,c=s,s=o,o=a+u|0,a=i,i=r,r=n,n=u+d|0}n=n+this.A|0,r=r+this.B|0,i=i+this.C|0,a=a+this.D|0,o=o+this.E|0,s=s+this.F|0,c=c+this.G|0,l=l+this.H|0,this.set(n,r,i,a,o,s,c,l)}roundClean(){Ac(Zc)}destroy(){this.set(0,0,0,0,0,0,0,0),Ac(this.buffer)}},$c=Uc(()=>new Qc),el=class extends Hc{constructor(e,t){super(),this.finished=!1,this.destroyed=!1,Dc(e);let n=Bc(t);if(this.iHash=e.create(),typeof this.iHash.update!=`function`)throw Error(`Expected instance of class which extends utils.Hash`);this.blockLen=this.iHash.blockLen,this.outputLen=this.iHash.outputLen;let r=this.blockLen,i=new Uint8Array(r);i.set(n.length>r?e.create().update(n).digest():n);for(let e=0;e<i.length;e++)i[e]^=54;this.iHash.update(i),this.oHash=e.create();for(let e=0;e<i.length;e++)i[e]^=106;this.oHash.update(i),Ac(i)}update(e){return Oc(this),this.iHash.update(e),this}digestInto(e){Oc(this),Ec(e,this.outputLen),this.finished=!0,this.iHash.digestInto(e),this.oHash.update(e),this.oHash.digestInto(e),this.destroy()}digest(){let e=new Uint8Array(this.oHash.outputLen);return this.digestInto(e),e}_cloneInto(e){e||=Object.create(Object.getPrototypeOf(this),{});let{oHash:t,iHash:n,finished:r,destroyed:i,blockLen:a,outputLen:o}=this;return e=e,e.finished=r,e.destroyed=i,e.blockLen=a,e.outputLen=o,e.oHash=t._cloneInto(e.oHash),e.iHash=n._cloneInto(e.iHash),e}clone(){return this._cloneInto()}destroy(){this.destroyed=!0,this.oHash.destroy(),this.iHash.destroy()}},tl=(e,t,n)=>new el(e,t).update(n).digest();tl.create=(e,t)=>new el(e,t);var nl=BigInt(0),rl=BigInt(1);function il(e,t=``){if(typeof e!=`boolean`){let n=t&&`"${t}"`;throw Error(n+`expected boolean, got type=`+typeof e)}return e}function al(e,t,n=``){let r=wc(e),i=e?.length,a=t!==void 0;if(!r||a&&i!==t){let o=n&&`"${n}" `,s=a?` of length ${t}`:``,c=r?`length=${i}`:`type=${typeof e}`;throw Error(o+`expected Uint8Array`+s+`, got `+c)}return e}function ol(e){let t=e.toString(16);return t.length&1?`0`+t:t}function sl(e){if(typeof e!=`string`)throw Error(`hex string expected, got `+typeof e);return e===``?nl:BigInt(`0x`+e)}function cl(e){return sl(Fc(e))}function ll(e){return Ec(e),sl(Fc(Uint8Array.from(e).reverse()))}function ul(e,t){return Rc(e.toString(16).padStart(t*2,`0`))}function dl(e,t){return ul(e,t).reverse()}function q(e,t,n){let r;if(typeof t==`string`)try{r=Rc(t)}catch(t){throw Error(e+` must be hex string or Uint8Array, cause: `+t)}else if(wc(t))r=Uint8Array.from(t);else throw Error(e+` must be hex string or Uint8Array`);let i=r.length;if(typeof n==`number`&&i!==n)throw Error(e+` of length `+n+` expected, got `+i);return r}var fl=e=>typeof e==`bigint`&&nl<=e;function pl(e,t,n){return fl(e)&&fl(t)&&fl(n)&&t<=e&&e<n}function ml(e,t,n,r){if(!pl(t,n,r))throw Error(`expected valid `+e+`: `+n+` <= n < `+r+`, got `+t)}function hl(e){let t;for(t=0;e>nl;e>>=rl,t+=1);return t}var gl=e=>(rl<<BigInt(e))-rl;function _l(e,t,n){if(typeof e!=`number`||e<2)throw Error(`hashLen must be a number`);if(typeof t!=`number`||t<2)throw Error(`qByteLen must be a number`);if(typeof n!=`function`)throw Error(`hmacFn must be a function`);let r=e=>new Uint8Array(e),i=e=>Uint8Array.of(e),a=r(e),o=r(e),s=0,c=()=>{a.fill(1),o.fill(0),s=0},l=(...e)=>n(o,a,...e),u=(e=r(0))=>{o=l(i(0),e),a=l(),e.length!==0&&(o=l(i(1),e),a=l())},d=()=>{if(s++>=1e3)throw Error(`drbg: tried 1000 values`);let e=0,n=[];for(;e<t;){a=l();let t=a.slice();n.push(t),e+=a.length}return Vc(...n)};return(e,t)=>{c(),u(e);let n;for(;!(n=t(d()));)u();return c(),n}}function vl(e,t,n={}){if(!e||typeof e!=`object`)throw Error(`expected valid options object`);function r(t,n,r){let i=e[t];if(r&&i===void 0)return;let a=typeof i;if(a!==n||i===null)throw Error(`param "${t}" is invalid: expected ${n}, got ${a}`)}Object.entries(t).forEach(([e,t])=>r(e,t,!1)),Object.entries(n).forEach(([e,t])=>r(e,t,!0))}function yl(e){let t=new WeakMap;return(n,...r)=>{let i=t.get(n);if(i!==void 0)return i;let a=e(n,...r);return t.set(n,a),a}}var bl=BigInt(0),xl=BigInt(1),Sl=BigInt(2),Cl=BigInt(3),wl=BigInt(4),Tl=BigInt(5),El=BigInt(7),Dl=BigInt(8),Ol=BigInt(9),kl=BigInt(16);function Al(e,t){let n=e%t;return n>=bl?n:t+n}function jl(e,t,n){let r=e;for(;t-- >bl;)r*=r,r%=n;return r}function Ml(e,t){if(e===bl)throw Error(`invert: expected non-zero number`);if(t<=bl)throw Error(`invert: expected positive modulus, got `+t);let n=Al(e,t),r=t,i=bl,a=xl,o=xl,s=bl;for(;n!==bl;){let e=r/n,t=r%n,c=i-o*e,l=a-s*e;r=n,n=t,i=o,a=s,o=c,s=l}if(r!==xl)throw Error(`invert: does not exist`);return Al(i,t)}function Nl(e,t,n){if(!e.eql(e.sqr(t),n))throw Error(`Cannot find square root`)}function Pl(e,t){let n=(e.ORDER+xl)/wl,r=e.pow(t,n);return Nl(e,r,t),r}function Fl(e,t){let n=(e.ORDER-Tl)/Dl,r=e.mul(t,Sl),i=e.pow(r,n),a=e.mul(t,i),o=e.mul(e.mul(a,Sl),i),s=e.mul(a,e.sub(o,e.ONE));return Nl(e,s,t),s}function Il(e){let t=Gl(e),n=Ll(e),r=n(t,t.neg(t.ONE)),i=n(t,r),a=n(t,t.neg(r)),o=(e+El)/kl;return(e,t)=>{let n=e.pow(t,o),s=e.mul(n,r),c=e.mul(n,i),l=e.mul(n,a),u=e.eql(e.sqr(s),t),d=e.eql(e.sqr(c),t);n=e.cmov(n,s,u),s=e.cmov(l,c,d);let f=e.eql(e.sqr(s),t),p=e.cmov(n,s,f);return Nl(e,p,t),p}}function Ll(e){if(e<Cl)throw Error(`sqrt is not defined for small field`);let t=e-xl,n=0;for(;t%Sl===bl;)t/=Sl,n++;let r=Sl,i=Gl(e);for(;Ul(i,r)===1;)if(r++>1e3)throw Error(`Cannot find square root: probably non-prime P`);if(n===1)return Pl;let a=i.pow(r,t),o=(t+xl)/Sl;return function(e,r){if(e.is0(r))return r;if(Ul(e,r)!==1)throw Error(`Cannot find square root`);let i=n,s=e.mul(e.ONE,a),c=e.pow(r,t),l=e.pow(r,o);for(;!e.eql(c,e.ONE);){if(e.is0(c))return e.ZERO;let t=1,n=e.sqr(c);for(;!e.eql(n,e.ONE);)if(t++,n=e.sqr(n),t===i)throw Error(`Cannot find square root`);let r=xl<<BigInt(i-t-1),a=e.pow(s,r);i=t,s=e.sqr(a),c=e.mul(c,s),l=e.mul(l,a)}return l}}function Rl(e){return e%wl===Cl?Pl:e%Dl===Tl?Fl:e%kl===Ol?Il(e):Ll(e)}var zl=[`create`,`isValid`,`is0`,`neg`,`inv`,`sqrt`,`sqr`,`eql`,`add`,`sub`,`mul`,`pow`,`div`,`addN`,`subN`,`mulN`,`sqrN`];function Bl(e){return vl(e,zl.reduce((e,t)=>(e[t]=`function`,e),{ORDER:`bigint`,MASK:`bigint`,BYTES:`number`,BITS:`number`})),e}function Vl(e,t,n){if(n<bl)throw Error(`invalid exponent, negatives unsupported`);if(n===bl)return e.ONE;if(n===xl)return t;let r=e.ONE,i=t;for(;n>bl;)n&xl&&(r=e.mul(r,i)),i=e.sqr(i),n>>=xl;return r}function Hl(e,t,n=!1){let r=Array(t.length).fill(n?e.ZERO:void 0),i=t.reduce((t,n,i)=>e.is0(n)?t:(r[i]=t,e.mul(t,n)),e.ONE),a=e.inv(i);return t.reduceRight((t,n,i)=>e.is0(n)?t:(r[i]=e.mul(t,r[i]),e.mul(t,n)),a),r}function Ul(e,t){let n=(e.ORDER-xl)/Sl,r=e.pow(t,n),i=e.eql(r,e.ONE),a=e.eql(r,e.ZERO),o=e.eql(r,e.neg(e.ONE));if(!i&&!a&&!o)throw Error(`invalid Legendre symbol result`);return i?1:a?0:-1}function Wl(e,t){t!==void 0&&Tc(t);let n=t===void 0?e.toString(2).length:t;return{nBitLength:n,nByteLength:Math.ceil(n/8)}}function Gl(e,t,n=!1,r={}){if(e<=bl)throw Error(`invalid field: expected ORDER > 0, got `+e);let i,a,o=!1,s;if(typeof t==`object`&&t){if(r.sqrt||n)throw Error(`cannot specify opts in two arguments`);let e=t;e.BITS&&(i=e.BITS),e.sqrt&&(a=e.sqrt),typeof e.isLE==`boolean`&&(n=e.isLE),typeof e.modFromBytes==`boolean`&&(o=e.modFromBytes),s=e.allowedLengths}else typeof t==`number`&&(i=t),r.sqrt&&(a=r.sqrt);let{nBitLength:c,nByteLength:l}=Wl(e,i);if(l>2048)throw Error(`invalid field: expected ORDER of <= 2048 bytes`);let u,d=Object.freeze({ORDER:e,isLE:n,BITS:c,BYTES:l,MASK:gl(c),ZERO:bl,ONE:xl,allowedLengths:s,create:t=>Al(t,e),isValid:t=>{if(typeof t!=`bigint`)throw Error(`invalid field element: expected bigint, got `+typeof t);return bl<=t&&t<e},is0:e=>e===bl,isValidNot0:e=>!d.is0(e)&&d.isValid(e),isOdd:e=>(e&xl)===xl,neg:t=>Al(-t,e),eql:(e,t)=>e===t,sqr:t=>Al(t*t,e),add:(t,n)=>Al(t+n,e),sub:(t,n)=>Al(t-n,e),mul:(t,n)=>Al(t*n,e),pow:(e,t)=>Vl(d,e,t),div:(t,n)=>Al(t*Ml(n,e),e),sqrN:e=>e*e,addN:(e,t)=>e+t,subN:(e,t)=>e-t,mulN:(e,t)=>e*t,inv:t=>Ml(t,e),sqrt:a||(t=>(u||=Rl(e),u(d,t))),toBytes:e=>n?dl(e,l):ul(e,l),fromBytes:(t,r=!0)=>{if(s){if(!s.includes(t.length)||t.length>l)throw Error(`Field.fromBytes: expected `+s+` bytes, got `+t.length);let e=new Uint8Array(l);e.set(t,n?0:e.length-t.length),t=e}if(t.length!==l)throw Error(`Field.fromBytes: expected `+l+` bytes, got `+t.length);let i=n?ll(t):cl(t);if(o&&(i=Al(i,e)),!r&&!d.isValid(i))throw Error(`invalid field element: outside of range 0..ORDER`);return i},invertBatch:e=>Hl(d,e),cmov:(e,t,n)=>n?t:e});return Object.freeze(d)}function Kl(e){if(typeof e!=`bigint`)throw Error(`field order must be bigint`);let t=e.toString(2).length;return Math.ceil(t/8)}function ql(e){let t=Kl(e);return t+Math.ceil(t/2)}function Jl(e,t,n=!1){let r=e.length,i=Kl(t),a=ql(t);if(r<16||r<a||r>1024)throw Error(`expected `+a+`-1024 bytes of input, got `+r);let o=Al(n?ll(e):cl(e),t-xl)+xl;return n?dl(o,i):ul(o,i)}var Yl=BigInt(0),Xl=BigInt(1);function Zl(e,t){let n=t.negate();return e?n:t}function Ql(e,t){let n=Hl(e.Fp,t.map(e=>e.Z));return t.map((t,r)=>e.fromAffine(t.toAffine(n[r])))}function $l(e,t){if(!Number.isSafeInteger(e)||e<=0||e>t)throw Error(`invalid window size, expected [1..`+t+`], got W=`+e)}function eu(e,t){$l(e,t);let n=Math.ceil(t/e)+1,r=2**(e-1),i=2**e;return{windows:n,windowSize:r,mask:gl(e),maxNumber:i,shiftBy:BigInt(e)}}function tu(e,t,n){let{windowSize:r,mask:i,maxNumber:a,shiftBy:o}=n,s=Number(e&i),c=e>>o;s>r&&(s-=a,c+=Xl);let l=t*r,u=l+Math.abs(s)-1,d=s===0,f=s<0,p=t%2!=0;return{nextN:c,offset:u,isZero:d,isNeg:f,isNegF:p,offsetF:l}}function nu(e,t){if(!Array.isArray(e))throw Error(`array expected`);e.forEach((e,n)=>{if(!(e instanceof t))throw Error(`invalid point at index `+n)})}function ru(e,t){if(!Array.isArray(e))throw Error(`array of scalars expected`);e.forEach((e,n)=>{if(!t.isValid(e))throw Error(`invalid scalar at index `+n)})}var iu=new WeakMap,au=new WeakMap;function ou(e){return au.get(e)||1}function su(e){if(e!==Yl)throw Error(`invalid wNAF`)}var cu=class{constructor(e,t){this.BASE=e.BASE,this.ZERO=e.ZERO,this.Fn=e.Fn,this.bits=t}_unsafeLadder(e,t,n=this.ZERO){let r=e;for(;t>Yl;)t&Xl&&(n=n.add(r)),r=r.double(),t>>=Xl;return n}precomputeWindow(e,t){let{windows:n,windowSize:r}=eu(t,this.bits),i=[],a=e,o=a;for(let e=0;e<n;e++){o=a,i.push(o);for(let e=1;e<r;e++)o=o.add(a),i.push(o);a=o.double()}return i}wNAF(e,t,n){if(!this.Fn.isValid(n))throw Error(`invalid scalar`);let r=this.ZERO,i=this.BASE,a=eu(e,this.bits);for(let e=0;e<a.windows;e++){let{nextN:o,offset:s,isZero:c,isNeg:l,isNegF:u,offsetF:d}=tu(n,e,a);n=o,c?i=i.add(Zl(u,t[d])):r=r.add(Zl(l,t[s]))}return su(n),{p:r,f:i}}wNAFUnsafe(e,t,n,r=this.ZERO){let i=eu(e,this.bits);for(let e=0;e<i.windows&&n!==Yl;e++){let{nextN:a,offset:o,isZero:s,isNeg:c}=tu(n,e,i);if(n=a,!s){let e=t[o];r=r.add(c?e.negate():e)}}return su(n),r}getPrecomputes(e,t,n){let r=iu.get(t);return r||(r=this.precomputeWindow(t,e),e!==1&&(typeof n==`function`&&(r=n(r)),iu.set(t,r))),r}cached(e,t,n){let r=ou(e);return this.wNAF(r,this.getPrecomputes(r,e,n),t)}unsafe(e,t,n,r){let i=ou(e);return i===1?this._unsafeLadder(e,t,r):this.wNAFUnsafe(i,this.getPrecomputes(i,e,n),t,r)}createCache(e,t){$l(t,this.bits),au.set(e,t),iu.delete(e)}hasCache(e){return ou(e)!==1}};function lu(e,t,n,r){let i=t,a=e.ZERO,o=e.ZERO;for(;n>Yl||r>Yl;)n&Xl&&(a=a.add(i)),r&Xl&&(o=o.add(i)),i=i.double(),n>>=Xl,r>>=Xl;return{p1:a,p2:o}}function uu(e,t,n,r){nu(n,e),ru(r,t);let i=n.length,a=r.length;if(i!==a)throw Error(`arrays of points and scalars must have equal length`);let o=e.ZERO,s=hl(BigInt(i)),c=1;s>12?c=s-3:s>4?c=s-2:s>0&&(c=2);let l=gl(c),u=Array(Number(l)+1).fill(o),d=Math.floor((t.BITS-1)/c)*c,f=o;for(let e=d;e>=0;e-=c){u.fill(o);for(let t=0;t<a;t++){let i=r[t],a=Number(i>>BigInt(e)&l);u[a]=u[a].add(n[t])}let t=o;for(let e=u.length-1,n=o;e>0;e--)n=n.add(u[e]),t=t.add(n);if(f=f.add(t),e!==0)for(let e=0;e<c;e++)f=f.double()}return f}function du(e,t,n){if(t){if(t.ORDER!==e)throw Error(`Field.ORDER must match order: Fp == p, Fn == n`);return Bl(t),t}else return Gl(e,{isLE:n})}function fu(e,t,n={},r){if(r===void 0&&(r=e===`edwards`),!t||typeof t!=`object`)throw Error(`expected valid ${e} CURVE object`);for(let e of[`p`,`n`,`h`]){let n=t[e];if(!(typeof n==`bigint`&&n>Yl))throw Error(`CURVE.${e} must be positive bigint`)}let i=du(t.p,n.Fp,r),a=du(t.n,n.Fn,r),o=[`Gx`,`Gy`,`a`,e===`weierstrass`?`b`:`d`];for(let e of o)if(!i.isValid(t[e]))throw Error(`CURVE.${e} must be valid field element of CURVE.Fp`);return t=Object.freeze(Object.assign({},t)),{CURVE:t,Fp:i,Fn:a}}var pu=(e,t)=>(e+(e>=0?t:-t)/bu)/t;function mu(e,t,n){let[[r,i],[a,o]]=t,s=pu(o*e,n),c=pu(-i*e,n),l=e-s*r-c*a,u=-s*i-c*o,d=l<vu,f=u<vu;d&&(l=-l),f&&(u=-u);let p=gl(Math.ceil(hl(n)/2))+yu;if(l<vu||l>=p||u<vu||u>=p)throw Error(`splitScalar (endomorphism): failed, k=`+e);return{k1neg:d,k1:l,k2neg:f,k2:u}}function hu(e){if(![`compact`,`recovered`,`der`].includes(e))throw Error(`Signature format must be "compact", "recovered", or "der"`);return e}function gu(e,t){let n={};for(let r of Object.keys(t))n[r]=e[r]===void 0?t[r]:e[r];return il(n.lowS,`lowS`),il(n.prehash,`prehash`),n.format!==void 0&&hu(n.format),n}var _u={Err:class extends Error{constructor(e=``){super(e)}},_tlv:{encode:(e,t)=>{let{Err:n}=_u;if(e<0||e>256)throw new n(`tlv.encode: wrong tag`);if(t.length&1)throw new n(`tlv.encode: unpadded data`);let r=t.length/2,i=ol(r);if(i.length/2&128)throw new n(`tlv.encode: long form length too big`);let a=r>127?ol(i.length/2|128):``;return ol(e)+a+i+t},decode(e,t){let{Err:n}=_u,r=0;if(e<0||e>256)throw new n(`tlv.encode: wrong tag`);if(t.length<2||t[r++]!==e)throw new n(`tlv.decode: wrong tlv`);let i=t[r++],a=!!(i&128),o=0;if(!a)o=i;else{let e=i&127;if(!e)throw new n(`tlv.decode(long): indefinite length not supported`);if(e>4)throw new n(`tlv.decode(long): byte length is too big`);let a=t.subarray(r,r+e);if(a.length!==e)throw new n(`tlv.decode: length bytes not complete`);if(a[0]===0)throw new n(`tlv.decode(long): zero leftmost byte`);for(let e of a)o=o<<8|e;if(r+=e,o<128)throw new n(`tlv.decode(long): not minimal encoding`)}let s=t.subarray(r,r+o);if(s.length!==o)throw new n(`tlv.decode: wrong value length`);return{v:s,l:t.subarray(r+o)}}},_int:{encode(e){let{Err:t}=_u;if(e<vu)throw new t(`integer: negative integers are not allowed`);let n=ol(e);if(Number.parseInt(n[0],16)&8&&(n=`00`+n),n.length&1)throw new t(`unexpected DER parsing assertion: unpadded hex`);return n},decode(e){let{Err:t}=_u;if(e[0]&128)throw new t(`invalid signature integer: negative`);if(e[0]===0&&!(e[1]&128))throw new t(`invalid signature integer: unnecessary leading zero`);return cl(e)}},toSig(e){let{Err:t,_int:n,_tlv:r}=_u,i=q(`signature`,e),{v:a,l:o}=r.decode(48,i);if(o.length)throw new t(`invalid signature: left bytes after parsing`);let{v:s,l:c}=r.decode(2,a),{v:l,l:u}=r.decode(2,c);if(u.length)throw new t(`invalid signature: left bytes after parsing`);return{r:n.decode(s),s:n.decode(l)}},hexFromSig(e){let{_tlv:t,_int:n}=_u,r=t.encode(2,n.encode(e.r))+t.encode(2,n.encode(e.s));return t.encode(48,r)}},vu=BigInt(0),yu=BigInt(1),bu=BigInt(2),xu=BigInt(3),Su=BigInt(4);function Cu(e,t){let{BYTES:n}=e,r;if(typeof t==`bigint`)r=t;else{let i=q(`private key`,t);try{r=e.fromBytes(i)}catch{throw Error(`invalid private key: expected ui8a of size ${n}, got ${typeof t}`)}}if(!e.isValidNot0(r))throw Error(`invalid private key: out of range [1..N-1]`);return r}function wu(e,t={}){let n=fu(`weierstrass`,e,t),{Fp:r,Fn:i}=n,a=n.CURVE,{h:o,n:s}=a;vl(t,{},{allowInfinityPoint:`boolean`,clearCofactor:`function`,isTorsionFree:`function`,fromBytes:`function`,toBytes:`function`,endo:`object`,wrapPrivateKey:`boolean`});let{endo:c}=t;if(c&&(!r.is0(a.a)||typeof c.beta!=`bigint`||!Array.isArray(c.basises)))throw Error(`invalid endo: expected "beta": bigint and "basises": array`);let l=Eu(r,i);function u(){if(!r.isOdd)throw Error(`compression is not supported: Field does not have .isOdd()`)}function d(e,t,n){let{x:i,y:a}=t.toAffine(),o=r.toBytes(i);return il(n,`isCompressed`),n?(u(),Vc(Tu(!r.isOdd(a)),o)):Vc(Uint8Array.of(4),o,r.toBytes(a))}function f(e){al(e,void 0,`Point`);let{publicKey:t,publicKeyUncompressed:n}=l,i=e.length,a=e[0],o=e.subarray(1);if(i===t&&(a===2||a===3)){let e=r.fromBytes(o);if(!r.isValid(e))throw Error(`bad point: is not on curve, wrong x`);let t=h(e),n;try{n=r.sqrt(t)}catch(e){let t=e instanceof Error?`: `+e.message:``;throw Error(`bad point: is not on curve, sqrt error`+t)}u();let i=r.isOdd(n);return(a&1)==1!==i&&(n=r.neg(n)),{x:e,y:n}}else if(i===n&&a===4){let e=r.BYTES,t=r.fromBytes(o.subarray(0,e)),n=r.fromBytes(o.subarray(e,e*2));if(!g(t,n))throw Error(`bad point: is not on curve`);return{x:t,y:n}}else throw Error(`bad point: got length ${i}, expected compressed=${t} or uncompressed=${n}`)}let p=t.toBytes||d,m=t.fromBytes||f;function h(e){let t=r.sqr(e),n=r.mul(t,e);return r.add(r.add(n,r.mul(e,a.a)),a.b)}function g(e,t){let n=r.sqr(t),i=h(e);return r.eql(n,i)}if(!g(a.Gx,a.Gy))throw Error(`bad curve params: generator point`);let _=r.mul(r.pow(a.a,xu),Su),v=r.mul(r.sqr(a.b),BigInt(27));if(r.is0(r.add(_,v)))throw Error(`bad curve params: a or b`);function y(e,t,n=!1){if(!r.isValid(t)||n&&r.is0(t))throw Error(`bad point coordinate ${e}`);return t}function b(e){if(!(e instanceof T))throw Error(`ProjectivePoint expected`)}function x(e){if(!c||!c.basises)throw Error(`no endo`);return mu(e,c.basises,i.ORDER)}let S=yl((e,t)=>{let{X:n,Y:i,Z:a}=e;if(r.eql(a,r.ONE))return{x:n,y:i};let o=e.is0();t??=o?r.ONE:r.inv(a);let s=r.mul(n,t),c=r.mul(i,t),l=r.mul(a,t);if(o)return{x:r.ZERO,y:r.ZERO};if(!r.eql(l,r.ONE))throw Error(`invZ was invalid`);return{x:s,y:c}}),C=yl(e=>{if(e.is0()){if(t.allowInfinityPoint&&!r.is0(e.Y))return;throw Error(`bad point: ZERO`)}let{x:n,y:i}=e.toAffine();if(!r.isValid(n)||!r.isValid(i))throw Error(`bad point: x or y not field elements`);if(!g(n,i))throw Error(`bad point: equation left != right`);if(!e.isTorsionFree())throw Error(`bad point: not in prime-order subgroup`);return!0});function w(e,t,n,i,a){return n=new T(r.mul(n.X,e),n.Y,n.Z),t=Zl(i,t),n=Zl(a,n),t.add(n)}class T{constructor(e,t,n){this.X=y(`x`,e),this.Y=y(`y`,t,!0),this.Z=y(`z`,n),Object.freeze(this)}static CURVE(){return a}static fromAffine(e){let{x:t,y:n}=e||{};if(!e||!r.isValid(t)||!r.isValid(n))throw Error(`invalid affine point`);if(e instanceof T)throw Error(`projective point not allowed`);return r.is0(t)&&r.is0(n)?T.ZERO:new T(t,n,r.ONE)}static fromBytes(e){let t=T.fromAffine(m(al(e,void 0,`point`)));return t.assertValidity(),t}static fromHex(e){return T.fromBytes(q(`pointHex`,e))}get x(){return this.toAffine().x}get y(){return this.toAffine().y}precompute(e=8,t=!0){return D.createCache(this,e),t||this.multiply(xu),this}assertValidity(){C(this)}hasEvenY(){let{y:e}=this.toAffine();if(!r.isOdd)throw Error(`Field doesn't support isOdd`);return!r.isOdd(e)}equals(e){b(e);let{X:t,Y:n,Z:i}=this,{X:a,Y:o,Z:s}=e,c=r.eql(r.mul(t,s),r.mul(a,i)),l=r.eql(r.mul(n,s),r.mul(o,i));return c&&l}negate(){return new T(this.X,r.neg(this.Y),this.Z)}double(){let{a:e,b:t}=a,n=r.mul(t,xu),{X:i,Y:o,Z:s}=this,c=r.ZERO,l=r.ZERO,u=r.ZERO,d=r.mul(i,i),f=r.mul(o,o),p=r.mul(s,s),m=r.mul(i,o);return m=r.add(m,m),u=r.mul(i,s),u=r.add(u,u),c=r.mul(e,u),l=r.mul(n,p),l=r.add(c,l),c=r.sub(f,l),l=r.add(f,l),l=r.mul(c,l),c=r.mul(m,c),u=r.mul(n,u),p=r.mul(e,p),m=r.sub(d,p),m=r.mul(e,m),m=r.add(m,u),u=r.add(d,d),d=r.add(u,d),d=r.add(d,p),d=r.mul(d,m),l=r.add(l,d),p=r.mul(o,s),p=r.add(p,p),d=r.mul(p,m),c=r.sub(c,d),u=r.mul(p,f),u=r.add(u,u),u=r.add(u,u),new T(c,l,u)}add(e){b(e);let{X:t,Y:n,Z:i}=this,{X:o,Y:s,Z:c}=e,l=r.ZERO,u=r.ZERO,d=r.ZERO,f=a.a,p=r.mul(a.b,xu),m=r.mul(t,o),h=r.mul(n,s),g=r.mul(i,c),_=r.add(t,n),v=r.add(o,s);_=r.mul(_,v),v=r.add(m,h),_=r.sub(_,v),v=r.add(t,i);let y=r.add(o,c);return v=r.mul(v,y),y=r.add(m,g),v=r.sub(v,y),y=r.add(n,i),l=r.add(s,c),y=r.mul(y,l),l=r.add(h,g),y=r.sub(y,l),d=r.mul(f,v),l=r.mul(p,g),d=r.add(l,d),l=r.sub(h,d),d=r.add(h,d),u=r.mul(l,d),h=r.add(m,m),h=r.add(h,m),g=r.mul(f,g),v=r.mul(p,v),h=r.add(h,g),g=r.sub(m,g),g=r.mul(f,g),v=r.add(v,g),m=r.mul(h,v),u=r.add(u,m),m=r.mul(y,v),l=r.mul(_,l),l=r.sub(l,m),m=r.mul(_,h),d=r.mul(y,d),d=r.add(d,m),new T(l,u,d)}subtract(e){return this.add(e.negate())}is0(){return this.equals(T.ZERO)}multiply(e){let{endo:n}=t;if(!i.isValidNot0(e))throw Error(`invalid scalar: out of range`);let r,a,o=e=>D.cached(this,e,e=>Ql(T,e));if(n){let{k1neg:t,k1:i,k2neg:s,k2:c}=x(e),{p:l,f:u}=o(i),{p:d,f}=o(c);a=u.add(f),r=w(n.beta,l,d,t,s)}else{let{p:t,f:n}=o(e);r=t,a=n}return Ql(T,[r,a])[0]}multiplyUnsafe(e){let{endo:n}=t,r=this;if(!i.isValid(e))throw Error(`invalid scalar: out of range`);if(e===vu||r.is0())return T.ZERO;if(e===yu)return r;if(D.hasCache(this))return this.multiply(e);if(n){let{k1neg:t,k1:i,k2neg:a,k2:o}=x(e),{p1:s,p2:c}=lu(T,r,i,o);return w(n.beta,s,c,t,a)}else return D.unsafe(r,e)}multiplyAndAddUnsafe(e,t,n){let r=this.multiplyUnsafe(t).add(e.multiplyUnsafe(n));return r.is0()?void 0:r}toAffine(e){return S(this,e)}isTorsionFree(){let{isTorsionFree:e}=t;return o===yu?!0:e?e(T,this):D.unsafe(this,s).is0()}clearCofactor(){let{clearCofactor:e}=t;return o===yu?this:e?e(T,this):this.multiplyUnsafe(o)}isSmallOrder(){return this.multiplyUnsafe(o).is0()}toBytes(e=!0){return il(e,`isCompressed`),this.assertValidity(),p(T,this,e)}toHex(e=!0){return Fc(this.toBytes(e))}toString(){return`<Point ${this.is0()?`ZERO`:this.toHex()}>`}get px(){return this.X}get py(){return this.X}get pz(){return this.Z}toRawBytes(e=!0){return this.toBytes(e)}_setWindowSize(e){this.precompute(e)}static normalizeZ(e){return Ql(T,e)}static msm(e,t){return uu(T,i,e,t)}static fromPrivateKey(e){return T.BASE.multiply(Cu(i,e))}}T.BASE=new T(a.Gx,a.Gy,r.ONE),T.ZERO=new T(r.ZERO,r.ONE,r.ZERO),T.Fp=r,T.Fn=i;let E=i.BITS,D=new cu(T,t.endo?Math.ceil(E/2):E);return T.BASE.precompute(8),T}function Tu(e){return Uint8Array.of(e?2:3)}function Eu(e,t){return{secretKey:t.BYTES,publicKey:1+e.BYTES,publicKeyUncompressed:1+2*e.BYTES,publicKeyHasPrefix:!0,signature:2*t.BYTES}}function Du(e,t={}){let{Fn:n}=e,r=t.randomBytes||Wc,i=Object.assign(Eu(e.Fp,n),{seed:ql(n.ORDER)});function a(e){try{return!!Cu(n,e)}catch{return!1}}function o(t,n){let{publicKey:r,publicKeyUncompressed:a}=i;try{let i=t.length;return n===!0&&i!==r||n===!1&&i!==a?!1:!!e.fromBytes(t)}catch{return!1}}function s(e=r(i.seed)){return Jl(al(e,i.seed,`seed`),n.ORDER)}function c(t,r=!0){return e.BASE.multiply(Cu(n,t)).toBytes(r)}function l(e){let t=s(e);return{secretKey:t,publicKey:c(t)}}function u(t){if(typeof t==`bigint`)return!1;if(t instanceof e)return!0;let{secretKey:r,publicKey:a,publicKeyUncompressed:o}=i;if(n.allowedLengths||r===a)return;let s=q(`key`,t).length;return s===a||s===o}function d(t,r,i=!0){if(u(t)===!0)throw Error(`first arg must be private key`);if(u(r)===!1)throw Error(`second arg must be public key`);let a=Cu(n,t);return e.fromHex(r).multiply(a).toBytes(i)}return Object.freeze({getPublicKey:c,getSharedSecret:d,keygen:l,Point:e,utils:{isValidSecretKey:a,isValidPublicKey:o,randomSecretKey:s,isValidPrivateKey:a,randomPrivateKey:s,normPrivateKeyToScalar:e=>Cu(n,e),precompute(t=8,n=e.BASE){return n.precompute(t,!1)}},lengths:i})}function Ou(e,t,n={}){Dc(t),vl(n,{},{hmac:`function`,lowS:`boolean`,randomBytes:`function`,bits2int:`function`,bits2int_modN:`function`});let r=n.randomBytes||Wc,i=n.hmac||((e,...n)=>tl(t,e,Vc(...n))),{Fp:a,Fn:o}=e,{ORDER:s,BITS:c}=o,{keygen:l,getPublicKey:u,getSharedSecret:d,utils:f,lengths:p}=Du(e,n),m={prehash:!1,lowS:typeof n.lowS==`boolean`?n.lowS:!1,format:void 0,extraEntropy:!1},h=`compact`;function g(e){return e>s>>yu}function _(e,t){if(!o.isValidNot0(t))throw Error(`invalid signature ${e}: out of range 1..Point.Fn.ORDER`);return t}function v(e,t){hu(t);let n=p.signature;return al(e,t===`compact`?n:t===`recovered`?n+1:void 0,`${t} signature`)}class y{constructor(e,t,n){this.r=_(`r`,e),this.s=_(`s`,t),n!=null&&(this.recovery=n),Object.freeze(this)}static fromBytes(e,t=h){v(e,t);let n;if(t===`der`){let{r:t,s:n}=_u.toSig(al(e));return new y(t,n)}t===`recovered`&&(n=e[0],t=`compact`,e=e.subarray(1));let r=o.BYTES,i=e.subarray(0,r),a=e.subarray(r,r*2);return new y(o.fromBytes(i),o.fromBytes(a),n)}static fromHex(e,t){return this.fromBytes(Rc(e),t)}addRecoveryBit(e){return new y(this.r,this.s,e)}recoverPublicKey(t){let n=a.ORDER,{r,s:i,recovery:c}=this;if(c==null||![0,1,2,3].includes(c))throw Error(`recovery id invalid`);if(s*bu<n&&c>1)throw Error(`recovery id is ambiguous for h>1 curve`);let l=c===2||c===3?r+s:r;if(!a.isValid(l))throw Error(`recovery id 2 or 3 invalid`);let u=a.toBytes(l),d=e.fromBytes(Vc(Tu((c&1)==0),u)),f=o.inv(l),p=x(q(`msgHash`,t)),m=o.create(-p*f),h=o.create(i*f),g=e.BASE.multiplyUnsafe(m).add(d.multiplyUnsafe(h));if(g.is0())throw Error(`point at infinify`);return g.assertValidity(),g}hasHighS(){return g(this.s)}toBytes(e=h){if(hu(e),e===`der`)return Rc(_u.hexFromSig(this));let t=o.toBytes(this.r),n=o.toBytes(this.s);if(e===`recovered`){if(this.recovery==null)throw Error(`recovery bit must be present`);return Vc(Uint8Array.of(this.recovery),t,n)}return Vc(t,n)}toHex(e){return Fc(this.toBytes(e))}assertValidity(){}static fromCompact(e){return y.fromBytes(q(`sig`,e),`compact`)}static fromDER(e){return y.fromBytes(q(`sig`,e),`der`)}normalizeS(){return this.hasHighS()?new y(this.r,o.neg(this.s),this.recovery):this}toDERRawBytes(){return this.toBytes(`der`)}toDERHex(){return Fc(this.toBytes(`der`))}toCompactRawBytes(){return this.toBytes(`compact`)}toCompactHex(){return Fc(this.toBytes(`compact`))}}let b=n.bits2int||function(e){if(e.length>8192)throw Error(`input is too large`);let t=cl(e),n=e.length*8-c;return n>0?t>>BigInt(n):t},x=n.bits2int_modN||function(e){return o.create(b(e))},S=gl(c);function C(e){return ml(`num < 2^`+c,e,vu,S),o.toBytes(e)}function w(e,n){return al(e,void 0,`message`),n?al(t(e),void 0,`prehashed message`):e}function T(t,n,i){if([`recovered`,`canonical`].some(e=>e in i))throw Error(`sign() legacy options not supported`);let{lowS:a,prehash:s,extraEntropy:c}=gu(i,m);t=w(t,s);let l=x(t),u=Cu(o,n),d=[C(u),C(l)];if(c!=null&&c!==!1){let e=c===!0?r(p.secretKey):c;d.push(q(`extraEntropy`,e))}let f=Vc(...d),h=l;function _(t){let n=b(t);if(!o.isValidNot0(n))return;let r=o.inv(n),i=e.BASE.multiply(n).toAffine(),s=o.create(i.x);if(s===vu)return;let c=o.create(r*o.create(h+s*u));if(c===vu)return;let l=(i.x===s?0:2)|Number(i.y&yu),d=c;return a&&g(c)&&(d=o.neg(c),l^=1),new y(s,d,l)}return{seed:f,k2sig:_}}function E(e,n,r={}){e=q(`message`,e);let{seed:a,k2sig:s}=T(e,n,r);return _l(t.outputLen,o.BYTES,i)(a,s)}function D(e){let t,n=typeof e==`string`||wc(e),r=!n&&typeof e==`object`&&!!e&&typeof e.r==`bigint`&&typeof e.s==`bigint`;if(!n&&!r)throw Error(`invalid signature, expected Uint8Array, hex string or Signature instance`);if(r)t=new y(e.r,e.s);else if(n){try{t=y.fromBytes(q(`sig`,e),`der`)}catch(e){if(!(e instanceof _u.Err))throw e}if(!t)try{t=y.fromBytes(q(`sig`,e),`compact`)}catch{return!1}}return t||!1}function O(t,n,r,i={}){let{lowS:a,prehash:s,format:c}=gu(i,m);if(r=q(`publicKey`,r),n=w(q(`message`,n),s),`strict`in i)throw Error(`options.strict was renamed to lowS`);let l=c===void 0?D(t):y.fromBytes(q(`sig`,t),c);if(l===!1)return!1;try{let t=e.fromBytes(r);if(a&&l.hasHighS())return!1;let{r:i,s}=l,c=x(n),u=o.inv(s),d=o.create(c*u),f=o.create(i*u),p=e.BASE.multiplyUnsafe(d).add(t.multiplyUnsafe(f));return p.is0()?!1:o.create(p.x)===i}catch{return!1}}function k(e,t,n={}){let{prehash:r}=gu(n,m);return t=w(t,r),y.fromBytes(e,`recovered`).recoverPublicKey(t).toBytes()}return Object.freeze({keygen:l,getPublicKey:u,getSharedSecret:d,utils:f,lengths:p,Point:e,sign:E,verify:O,recoverPublicKey:k,Signature:y,hash:t})}function ku(e){let t={a:e.a,b:e.b,p:e.Fp.ORDER,n:e.n,h:e.h,Gx:e.Gx,Gy:e.Gy},n=e.Fp,r=e.allowedPrivateKeyLengths?Array.from(new Set(e.allowedPrivateKeyLengths.map(e=>Math.ceil(e/2)))):void 0;return{CURVE:t,curveOpts:{Fp:n,Fn:Gl(t.n,{BITS:e.nBitLength,allowedLengths:r,modFromBytes:e.wrapPrivateKey}),allowInfinityPoint:e.allowInfinityPoint,endo:e.endo,isTorsionFree:e.isTorsionFree,clearCofactor:e.clearCofactor,fromBytes:e.fromBytes,toBytes:e.toBytes}}}function Au(e){let{CURVE:t,curveOpts:n}=ku(e),r={hmac:e.hmac,randomBytes:e.randomBytes,lowS:e.lowS,bits2int:e.bits2int,bits2int_modN:e.bits2int_modN};return{CURVE:t,curveOpts:n,hash:e.hash,ecdsaOpts:r}}function ju(e,t){let n=t.Point;return Object.assign({},t,{ProjectivePoint:n,CURVE:Object.assign({},e,Wl(n.Fn.ORDER,n.Fn.BITS))})}function Mu(e){let{CURVE:t,curveOpts:n,hash:r,ecdsaOpts:i}=Au(e);return ju(e,Ou(wu(t,n),r,i))}function Nu(e,t){let n=t=>Mu({...e,hash:t});return{...n(t),create:n}}var Pu={p:BigInt(`0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f`),n:BigInt(`0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141`),h:BigInt(1),a:BigInt(0),b:BigInt(7),Gx:BigInt(`0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798`),Gy:BigInt(`0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8`)},Fu={beta:BigInt(`0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee`),basises:[[BigInt(`0x3086d221a7d46bcde86c90e49284eb15`),-BigInt(`0xe4437ed6010e88286f547fa90abfe4c3`)],[BigInt(`0x114ca50f7a8e2f3f657c1108d9d44cfd8`),BigInt(`0x3086d221a7d46bcde86c90e49284eb15`)]]},Iu=BigInt(0),Lu=BigInt(1),Ru=BigInt(2);function zu(e){let t=Pu.p,n=BigInt(3),r=BigInt(6),i=BigInt(11),a=BigInt(22),o=BigInt(23),s=BigInt(44),c=BigInt(88),l=e*e*e%t,u=l*l*e%t,d=jl(jl(jl(u,n,t)*u%t,n,t)*u%t,Ru,t)*l%t,f=jl(d,i,t)*d%t,p=jl(f,a,t)*f%t,m=jl(p,s,t)*p%t,h=jl(jl(jl(jl(jl(jl(m,c,t)*m%t,s,t)*p%t,n,t)*u%t,o,t)*f%t,r,t)*l%t,Ru,t);if(!Bu.eql(Bu.sqr(h),e))throw Error(`Cannot find square root`);return h}var Bu=Gl(Pu.p,{sqrt:zu}),Vu=Nu({...Pu,Fp:Bu,lowS:!0,endo:Fu},$c),Hu={};function Uu(e,...t){let n=Hu[e];if(n===void 0){let t=$c(zc(e));n=Vc(t,t),Hu[e]=n}return $c(Vc(n,...t))}var Wu=e=>e.toBytes(!0).slice(1),Gu=Vu.Point,Ku=e=>e%Ru===Iu;function qu(e){let{Fn:t,BASE:n}=Gu,r=Cu(t,e),i=n.multiply(r);return{scalar:Ku(i.y)?r:t.neg(r),bytes:Wu(i)}}function Ju(e){let t=Bu;if(!t.isValidNot0(e))throw Error(`invalid x: Fail if x ≥ p`);let n=t.create(e*e),r=t.create(n*e+BigInt(7)),i=t.sqrt(r);Ku(i)||(i=t.neg(i));let a=Gu.fromAffine({x:e,y:i});return a.assertValidity(),a}var Yu=cl;function Xu(...e){return Gu.Fn.create(Yu(Uu(`BIP0340/challenge`,...e)))}function Zu(e){return qu(e).bytes}function Qu(e,t,n=Wc(32)){let{Fn:r}=Gu,i=q(`message`,e),{bytes:a,scalar:o}=qu(t),s=q(`auxRand`,n,32),{bytes:c,scalar:l}=qu(Uu(`BIP0340/nonce`,r.toBytes(o^Yu(Uu(`BIP0340/aux`,s))),a,i)),u=Xu(c,a,i),d=new Uint8Array(64);if(d.set(c,0),d.set(r.toBytes(r.create(l+u*o)),32),!$u(d,i,a))throw Error(`sign: Invalid signature produced`);return d}function $u(e,t,n){let{Fn:r,BASE:i}=Gu,a=q(`signature`,e,64),o=q(`message`,t),s=q(`publicKey`,n,32);try{let e=Ju(Yu(s)),t=Yu(a.subarray(0,32));if(!pl(t,Lu,Pu.p))return!1;let n=Yu(a.subarray(32,64));if(!pl(n,Lu,Pu.n))return!1;let c=Xu(r.toBytes(t),Wu(e),o),l=i.multiplyUnsafe(n).add(e.multiplyUnsafe(r.neg(c))),{x:u,y:d}=l.toAffine();return!(l.is0()||!Ku(d)||u!==t)}catch{return!1}}var ed=(()=>{let e=(e=Wc(48))=>Jl(e,Pu.n);Vu.utils.randomSecretKey;function t(t){let n=e(t);return{secretKey:n,publicKey:Zu(n)}}return{keygen:t,getPublicKey:Zu,sign:Qu,verify:$u,Point:Gu,utils:{randomSecretKey:e,randomPrivateKey:e,taggedHash:Uu,lift_x:Ju,pointToBytes:Wu,numberToBytesBE:ul,bytesToNumberBE:cl,mod:Al},lengths:{secretKey:32,publicKey:32,publicKeyHasPrefix:!1,signature:64,seed:48}}})(),td=$c;function nd(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function rd(){let e=new Uint8Array(16);return crypto.getRandomValues(e),Array.from(e,e=>e.toString(16).padStart(2,`0`)).join(``)}function id(e,t){let n=e.find(e=>e[0]===t);return n?n[1]:void 0}function ad(e){let t=new Uint8Array(e.length/2);for(let n=0;n<t.length;n++)t[n]=parseInt(e.substr(n*2,2),16);return t}async function od(e){if(!e.id||!e.pubkey||!e.sig||!e.tags||e.kind!==30470||!/^[0-9a-f]{128}$/i.test(e.sig)||!/^[0-9a-f]{64}$/i.test(e.pubkey)||!/^[0-9a-f]{64}$/i.test(e.id)||e.tags.length>100||e.content.length>65536||e.tags.some(e=>e.some(e=>e.length>1024)))return!1;let t=e.tags.map(e=>e[0]);if(!t.includes(`tier`)||!t.includes(`age-range`)||!t.includes(`entity-type`))return!1;let n=JSON.stringify([0,e.pubkey,e.created_at,e.kind,e.tags,e.content]);if(Fc(td(new TextEncoder().encode(n)))!==e.id.toLowerCase())return!1;try{let t=ad(e.sig),n=ad(e.id),r=ad(e.pubkey);return ed.verify(t,n,r)}catch{return!1}}function sd(e,t){if(e===t||e===`18+`&&t===`18+`)return!0;let n=[`0-3`,`4-7`,`8-12`,`13-17`,`18+`],r=n.indexOf(e),i=n.indexOf(t);return r===-1||i===-1?!1:t===`18+`?e===`18+`:e===t}async function cd(e,t){if(t==null||!/^https:\/\//i.test(t)||!/^[0-9a-f]{64}$/i.test(e))return null;try{let n=await fetch(`${t}/status/${e}`,{signal:AbortSignal.timeout(5e3)});if(!n.ok)return null;let r=await n.json();if(typeof r!=`object`||!r)return null;let i=r;return{confirmed:i.confirmed===!0,method:[`A`,`B`,`C`,`D`].includes(i.method)?i.method:null,profession:typeof i.profession==`string`?i.profession:void 0,jurisdiction:typeof i.jurisdiction==`string`?i.jurisdiction:void 0}}catch{return null}}async function ld(e,t){if(![`0-3`,`4-7`,`8-12`,`13-17`,`18+`].includes(e))return{verified:!1,ageRange:null,tier:null,entityType:null,credentialId:null,verifierPubkey:null,verifierConfirmed:null,verifierMethod:null,issuedAt:null,expiresAt:null,error:`invalid-age-range`};let n={requiredAgeRange:e,relayUrl:t?.relayUrl||`wss://relay.damus.io`,theme:t?.theme||`auto`,timeout:t?.timeout||12e4,verifierCheckUrl:t?.verifierCheckUrl===void 0?`https://verify.signet.forgesworn.dev`:t.verifierCheckUrl,acceptUnconfirmed:t?.acceptUnconfirmed||!1,...t};n.timeout=Math.max(5e3,Math.min(n.timeout??12e4,6e5));let r=rd(),i={type:`signet-verify-request`,requestId:r,requiredAgeRange:n.requiredAgeRange,relayUrl:n.relayUrl,timestamp:Math.floor(Date.now()/1e3)},a=JSON.stringify(i),o=btoa(a);return new Promise(t=>{let i=document.createElement(`style`);i.textContent=`#signet-verify-dialog::backdrop{background:rgba(0,0,0,0.7)}`,document.head.appendChild(i);let a=n.theme===`dark`||n.theme===`auto`&&window.matchMedia(`(prefers-color-scheme: dark)`).matches,s=a?`#1a1a2e`:`#ffffff`,c=a?`#e0e0e0`:`#1a1a2e`,l=a?`#888`:`#666`,u=document.createElement(`dialog`);u.id=`signet-verify-dialog`,u.style.cssText=`border:none;border-radius:16px;padding:32px;max-width:380px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);background:${s};color:${c};font-family:system-ui,-apple-system,sans-serif;`,u.innerHTML=`
      <h2 style="margin:0 0 8px;font-size:1.3rem;">Verify your age with Signet</h2>
      <p style="margin:0 0 24px;color:${l};font-size:0.9rem;">Scan this QR code with your Signet app to prove you are ${nd(e)}. No personal data is shared.</p>
      <div id="signet-qr" style="display:flex;justify-content:center;margin-bottom:24px;"></div>
      <p style="margin:0 0 16px;color:${l};font-size:0.8rem;">Waiting for verification...</p>
      <button id="signet-cancel" style="background:none;border:1px solid ${l};color:${c};padding:10px 24px;border-radius:8px;cursor:pointer;font-size:0.9rem;">Cancel</button>
    `,document.body.appendChild(u),u.showModal();let d=u.querySelector(`#signet-qr`);if(d){let e=document.createElement(`div`);e.style.cssText=`width:200px;height:200px;background:${a?`#2a2a3e`:`#f0f0f0`};border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:0.75rem;color:${l};word-break:break-all;padding:12px;`,e.textContent=`signet:verify:${o.slice(0,40)}...`,d.appendChild(e)}let f=new BroadcastChannel(`signet-verify-`+r);u.querySelector(`#signet-cancel`)?.addEventListener(`click`,()=>{f.close(),u.close(),u.remove(),i.remove(),t({verified:!1,ageRange:null,tier:null,entityType:null,credentialId:null,verifierPubkey:null,verifierConfirmed:null,verifierMethod:null,issuedAt:null,expiresAt:null,error:`cancelled`})}),f.onmessage=async e=>{let a=e.data;if(typeof a!=`object`||!a)return;let o=a;if(o.type!==`signet-verify-response`||o.requestId!==r||!o.credential||typeof o.credential!=`object`||!Array.isArray(o.credential.tags))return;let s=o.credential,c=await od(s),l=id(s.tags,`age-range`),d=id(s.tags,`tier`),p=id(s.tags,`entity-type`),m=id(s.tags,`expires`),h=l?sd(l,n.requiredAgeRange):!1,g=await cd(s.pubkey,n.verifierCheckUrl),_=g?.confirmed??null,v=g?.method??null,y=n.acceptUnconfirmed||_===!0;u.close(),u.remove(),i.remove(),f.close();let b=d?parseInt(d,10):null,x=m?parseInt(m,10):null,S=Math.floor(Date.now()/1e3),C=x===null||!isNaN(x)&&x>S,w;c?C?h?y||(w=_===!1?`verifier-not-confirmed`:`verifier-check-unavailable`):w=`age-range-not-met`:w=`credential-expired`:w=`invalid-credential`,t({verified:c&&C&&h&&y,ageRange:l||null,tier:b!==null&&!isNaN(b)?b:null,entityType:p||null,credentialId:s.id,verifierPubkey:s.pubkey,verifierConfirmed:_,verifierMethod:v,issuedAt:s.created_at,expiresAt:x!==null&&!isNaN(x)?x:null,error:w})},setTimeout(()=>{u.close(),u.remove(),i.remove(),f.close(),t({verified:!1,ageRange:null,tier:null,entityType:null,credentialId:null,verifierPubkey:null,verifierConfirmed:null,verifierMethod:null,issuedAt:null,expiresAt:null,error:`timeout`})},n.timeout)})}function ud(e){let t=JSON.stringify([0,e.pubkey,e.created_at,e.kind,e.tags,e.content]);return Fc(td(new TextEncoder().encode(t)))}async function dd(e,t){try{let n=G(t,e.pubkey),r=go(e.content,n),i=JSON.parse(r);if(typeof i!=`object`||!i)return null;let a=i;if(a.kind!==13||typeof a.pubkey!=`string`||!/^[0-9a-f]{64}$/i.test(a.pubkey)||typeof a.created_at!=`number`||!Array.isArray(a.tags)||typeof a.content!=`string`||typeof a.id!=`string`||!/^[0-9a-f]{64}$/i.test(a.id)||typeof a.sig!=`string`||!/^[0-9a-f]{128}$/i.test(a.sig)||ud({pubkey:a.pubkey,created_at:a.created_at,kind:13,tags:a.tags,content:a.content})!==a.id.toLowerCase())return null;let o=ad(a.sig),s=ad(a.id),c=ad(a.pubkey);if(!ed.verify(o,s,c))return null;let l=G(t,a.pubkey),u=go(a.content,l),d=JSON.parse(u);if(typeof d!=`object`||!d)return null;let f=d;if(typeof f.pubkey!=`string`||f.pubkey!==a.pubkey||typeof f.kind!=`number`||typeof f.created_at!=`number`||!Array.isArray(f.tags)||typeof f.content!=`string`)return null;let p=typeof f.id==`string`?f.id:ud({pubkey:f.pubkey,created_at:f.created_at,kind:f.kind,tags:f.tags,content:f.content});return{pubkey:f.pubkey,id:p,kind:f.kind,created_at:f.created_at,tags:f.tags,content:f.content}}catch{return null}}function fd(e){if(typeof e!=`string`)return;let t=e.replace(/[\x00-\x1f\x7f-\x9f\u200b-\u200f\u2028-\u202e\u2066-\u2069]/g,``).trim().slice(0,64);return t.length>0?t:void 0}async function pd(e){if(!/^[0-9a-f]{64}$/i.test(e.requestId))throw Error(`invalid-request-id`);if(!(e.sessionPrivKey instanceof Uint8Array)||e.sessionPrivKey.length!==32)throw Error(`invalid-session-privkey`);if(!/^wss:\/\//i.test(e.relayUrl)&&!/^ws:\/\/(localhost|127\.0\.0\.1)([:\/]|$)/i.test(e.relayUrl))throw Error(`invalid-relay-url`);if(typeof e.expectedOrigin!=`string`||e.expectedOrigin.length===0)throw Error(`invalid-expected-origin`);let t=Fc(ed.getPublicKey(e.sessionPrivKey)),n=Math.max(5e3,Math.min(e.timeout??12e4,6e5)),r=e.requestId.toLowerCase(),i=e.expectedOrigin;return new Promise((a,o)=>{let s=`sa-${Math.random().toString(36).slice(2,12)}`,c=!1,l;try{l=new WebSocket(e.relayUrl)}catch{o(Error(`relay-error`));return}let u=e=>{if(!c){c=!0,clearTimeout(d);try{l.close()}catch{}e()}},d=setTimeout(()=>{u(()=>o(Error(`timeout`)))},n);l.onopen=()=>{let e=Math.floor(Date.now()/1e3)-60;l.send(JSON.stringify([`REQ`,s,{kinds:[1059],"#p":[t],since:e}]))},l.onmessage=async t=>{if(c)return;let n;try{n=JSON.parse(typeof t.data==`string`?t.data:``)}catch{return}if(!Array.isArray(n)||n[0]!==`EVENT`||n[1]!==s)return;let l=n[2];if(typeof l!=`object`||!l)return;let d=l;if(d.kind!==1059||typeof d.pubkey!=`string`||typeof d.content!=`string`)return;let f=await dd({pubkey:d.pubkey,content:d.content},e.sessionPrivKey);if(!f||f.kind!==29999)return;let p=f.tags.find(e=>e[0]===`session`);if(!p||p[1]!==r)return;let m=f.tags.find(e=>e[0]===`status`);if(m?.[1]===`rejected`){u(()=>o(Error(`denied`)));return}if(m?.[1]!==`approved`||Math.abs(Date.now()/1e3-f.created_at)>300)return;let h;try{let e=JSON.parse(f.content);if(typeof e!=`object`||!e)return;h=e}catch{return}if(h.type!==`signet-auth-response`||h.requestId!==r||typeof h.authEvent!=`object`||h.authEvent===null)return;let g=h.authEvent;if(typeof g.id!=`string`||!/^[0-9a-f]{64}$/i.test(g.id)||typeof g.pubkey!=`string`||!/^[0-9a-f]{64}$/i.test(g.pubkey)||typeof g.sig!=`string`||!/^[0-9a-f]{128}$/i.test(g.sig)||g.kind!==21236||typeof g.created_at!=`number`||!Array.isArray(g.tags)||typeof g.content!=`string`||g.pubkey.toLowerCase()!==f.pubkey.toLowerCase()||ud({pubkey:g.pubkey,created_at:g.created_at,kind:21236,tags:g.tags,content:g.content})!==g.id.toLowerCase())return;let _=!1;try{let e=ad(g.sig),t=ad(g.id),n=ad(g.pubkey);_=ed.verify(e,t,n)}catch{_=!1}if(!_)return;let v=g.tags,y=v.find(e=>Array.isArray(e)&&e[0]===`challenge`);if(!y||typeof y[1]!=`string`||y[1].toLowerCase()!==r)return;let b=v.find(e=>Array.isArray(e)&&e[0]===`origin`);if(!b||b[1]!==i||Math.abs(Date.now()/1e3-g.created_at)>300)return;let x={id:g.id.toLowerCase(),pubkey:g.pubkey.toLowerCase(),kind:21236,created_at:g.created_at,tags:v,content:g.content,sig:g.sig},S=fd(h.displayName),C=typeof h.bunkerUri==`string`&&/^bunker:\/\//i.test(h.bunkerUri)?h.bunkerUri:void 0;u(()=>a({pubkey:x.pubkey,authEvent:x,credential:h.credential,...S===void 0?{}:{displayName:S},...C===void 0?{}:{bunkerUri:C},createdAt:x.created_at}))},l.onerror=()=>{u(()=>o(Error(`relay-error`)))}})}typeof window<`u`&&(window.Signet={verifyAge:ld,waitForAuthResponse:pd});var md=typeof globalThis==`object`&&`crypto`in globalThis?globalThis.crypto:void 0;function hd(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name===`Uint8Array`}function gd(e){if(!Number.isSafeInteger(e)||e<0)throw Error(`positive integer expected, got `+e)}function _d(e,...t){if(!hd(e))throw Error(`Uint8Array expected`);if(t.length>0&&!t.includes(e.length))throw Error(`Uint8Array expected of length `+t+`, got length=`+e.length)}function vd(e){if(typeof e!=`function`||typeof e.create!=`function`)throw Error(`Hash should be wrapped by utils.createHasher`);gd(e.outputLen),gd(e.blockLen)}function yd(e,t=!0){if(e.destroyed)throw Error(`Hash instance has been destroyed`);if(t&&e.finished)throw Error(`Hash#digest() has already been called`)}function bd(e,t){_d(e);let n=t.outputLen;if(e.length<n)throw Error(`digestInto() expects output buffer of length at least `+n)}function xd(...e){for(let t=0;t<e.length;t++)e[t].fill(0)}function Sd(e){return new DataView(e.buffer,e.byteOffset,e.byteLength)}function Cd(e,t){return e<<32-t|e>>>t}var wd=typeof Uint8Array.from([]).toHex==`function`&&typeof Uint8Array.fromHex==`function`,Td=Array.from({length:256},(e,t)=>t.toString(16).padStart(2,`0`));function Ed(e){if(_d(e),wd)return e.toHex();let t=``;for(let n=0;n<e.length;n++)t+=Td[e[n]];return t}var Dd={_0:48,_9:57,A:65,F:70,a:97,f:102};function Od(e){if(e>=Dd._0&&e<=Dd._9)return e-Dd._0;if(e>=Dd.A&&e<=Dd.F)return e-(Dd.A-10);if(e>=Dd.a&&e<=Dd.f)return e-(Dd.a-10)}function kd(e){if(typeof e!=`string`)throw Error(`hex string expected, got `+typeof e);if(wd)return Uint8Array.fromHex(e);let t=e.length,n=t/2;if(t%2)throw Error(`hex string expected, got unpadded hex of length `+t);let r=new Uint8Array(n);for(let t=0,i=0;t<n;t++,i+=2){let n=Od(e.charCodeAt(i)),a=Od(e.charCodeAt(i+1));if(n===void 0||a===void 0){let t=e[i]+e[i+1];throw Error(`hex string expected, got non-hex character "`+t+`" at index `+i)}r[t]=n*16+a}return r}function Ad(e){if(typeof e!=`string`)throw Error(`string expected`);return new Uint8Array(new TextEncoder().encode(e))}function jd(e){return typeof e==`string`&&(e=Ad(e)),_d(e),e}function Md(...e){let t=0;for(let n=0;n<e.length;n++){let r=e[n];_d(r),t+=r.length}let n=new Uint8Array(t);for(let t=0,r=0;t<e.length;t++){let i=e[t];n.set(i,r),r+=i.length}return n}var Nd=class{};function Pd(e){let t=t=>e().update(jd(t)).digest(),n=e();return t.outputLen=n.outputLen,t.blockLen=n.blockLen,t.create=()=>e(),t}function Fd(e=32){if(md&&typeof md.getRandomValues==`function`)return md.getRandomValues(new Uint8Array(e));if(md&&typeof md.randomBytes==`function`)return Uint8Array.from(md.randomBytes(e));throw Error(`crypto.getRandomValues must be defined`)}function Id(e,t,n,r){if(typeof e.setBigUint64==`function`)return e.setBigUint64(t,n,r);let i=BigInt(32),a=BigInt(4294967295),o=Number(n>>i&a),s=Number(n&a),c=r?4:0,l=r?0:4;e.setUint32(t+c,o,r),e.setUint32(t+l,s,r)}function Ld(e,t,n){return e&t^~e&n}function Rd(e,t,n){return e&t^e&n^t&n}var zd=class extends Nd{constructor(e,t,n,r){super(),this.finished=!1,this.length=0,this.pos=0,this.destroyed=!1,this.blockLen=e,this.outputLen=t,this.padOffset=n,this.isLE=r,this.buffer=new Uint8Array(e),this.view=Sd(this.buffer)}update(e){yd(this),e=jd(e),_d(e);let{view:t,buffer:n,blockLen:r}=this,i=e.length;for(let a=0;a<i;){let o=Math.min(r-this.pos,i-a);if(o===r){let t=Sd(e);for(;r<=i-a;a+=r)this.process(t,a);continue}n.set(e.subarray(a,a+o),this.pos),this.pos+=o,a+=o,this.pos===r&&(this.process(t,0),this.pos=0)}return this.length+=e.length,this.roundClean(),this}digestInto(e){yd(this),bd(e,this),this.finished=!0;let{buffer:t,view:n,blockLen:r,isLE:i}=this,{pos:a}=this;t[a++]=128,xd(this.buffer.subarray(a)),this.padOffset>r-a&&(this.process(n,0),a=0);for(let e=a;e<r;e++)t[e]=0;Id(n,r-8,BigInt(this.length*8),i),this.process(n,0);let o=Sd(e),s=this.outputLen;if(s%4)throw Error(`_sha2: outputLen should be aligned to 32bit`);let c=s/4,l=this.get();if(c>l.length)throw Error(`_sha2: outputLen bigger than state`);for(let e=0;e<c;e++)o.setUint32(4*e,l[e],i)}digest(){let{buffer:e,outputLen:t}=this;this.digestInto(e);let n=e.slice(0,t);return this.destroy(),n}_cloneInto(e){e||=new this.constructor,e.set(...this.get());let{blockLen:t,buffer:n,length:r,finished:i,destroyed:a,pos:o}=this;return e.destroyed=a,e.finished=i,e.length=r,e.pos=o,r%t&&e.buffer.set(n),e}clone(){return this._cloneInto()}},Bd=Uint32Array.from([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),Vd=Uint32Array.from([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),Hd=new Uint32Array(64),Ud=class extends zd{constructor(e=32){super(64,e,8,!1),this.A=Bd[0]|0,this.B=Bd[1]|0,this.C=Bd[2]|0,this.D=Bd[3]|0,this.E=Bd[4]|0,this.F=Bd[5]|0,this.G=Bd[6]|0,this.H=Bd[7]|0}get(){let{A:e,B:t,C:n,D:r,E:i,F:a,G:o,H:s}=this;return[e,t,n,r,i,a,o,s]}set(e,t,n,r,i,a,o,s){this.A=e|0,this.B=t|0,this.C=n|0,this.D=r|0,this.E=i|0,this.F=a|0,this.G=o|0,this.H=s|0}process(e,t){for(let n=0;n<16;n++,t+=4)Hd[n]=e.getUint32(t,!1);for(let e=16;e<64;e++){let t=Hd[e-15],n=Hd[e-2],r=Cd(t,7)^Cd(t,18)^t>>>3;Hd[e]=(Cd(n,17)^Cd(n,19)^n>>>10)+Hd[e-7]+r+Hd[e-16]|0}let{A:n,B:r,C:i,D:a,E:o,F:s,G:c,H:l}=this;for(let e=0;e<64;e++){let t=Cd(o,6)^Cd(o,11)^Cd(o,25),u=l+t+Ld(o,s,c)+Vd[e]+Hd[e]|0,d=(Cd(n,2)^Cd(n,13)^Cd(n,22))+Rd(n,r,i)|0;l=c,c=s,s=o,o=a+u|0,a=i,i=r,r=n,n=u+d|0}n=n+this.A|0,r=r+this.B|0,i=i+this.C|0,a=a+this.D|0,o=o+this.E|0,s=s+this.F|0,c=c+this.G|0,l=l+this.H|0,this.set(n,r,i,a,o,s,c,l)}roundClean(){xd(Hd)}destroy(){this.set(0,0,0,0,0,0,0,0),xd(this.buffer)}},Wd=Pd(()=>new Ud),Gd=class extends Nd{constructor(e,t){super(),this.finished=!1,this.destroyed=!1,vd(e);let n=jd(t);if(this.iHash=e.create(),typeof this.iHash.update!=`function`)throw Error(`Expected instance of class which extends utils.Hash`);this.blockLen=this.iHash.blockLen,this.outputLen=this.iHash.outputLen;let r=this.blockLen,i=new Uint8Array(r);i.set(n.length>r?e.create().update(n).digest():n);for(let e=0;e<i.length;e++)i[e]^=54;this.iHash.update(i),this.oHash=e.create();for(let e=0;e<i.length;e++)i[e]^=106;this.oHash.update(i),xd(i)}update(e){return yd(this),this.iHash.update(e),this}digestInto(e){yd(this),_d(e,this.outputLen),this.finished=!0,this.iHash.digestInto(e),this.oHash.update(e),this.oHash.digestInto(e),this.destroy()}digest(){let e=new Uint8Array(this.oHash.outputLen);return this.digestInto(e),e}_cloneInto(e){e||=Object.create(Object.getPrototypeOf(this),{});let{oHash:t,iHash:n,finished:r,destroyed:i,blockLen:a,outputLen:o}=this;return e=e,e.finished=r,e.destroyed=i,e.blockLen=a,e.outputLen=o,e.oHash=t._cloneInto(e.oHash),e.iHash=n._cloneInto(e.iHash),e}clone(){return this._cloneInto()}destroy(){this.destroyed=!0,this.oHash.destroy(),this.iHash.destroy()}},Kd=(e,t,n)=>new Gd(e,t).update(n).digest();Kd.create=(e,t)=>new Gd(e,t);var qd=BigInt(0),Jd=BigInt(1);function Yd(e,t=``){if(typeof e!=`boolean`){let n=t&&`"${t}"`;throw Error(n+`expected boolean, got type=`+typeof e)}return e}function Xd(e,t,n=``){let r=hd(e),i=e?.length,a=t!==void 0;if(!r||a&&i!==t){let o=n&&`"${n}" `,s=a?` of length ${t}`:``,c=r?`length=${i}`:`type=${typeof e}`;throw Error(o+`expected Uint8Array`+s+`, got `+c)}return e}function Zd(e){let t=e.toString(16);return t.length&1?`0`+t:t}function Qd(e){if(typeof e!=`string`)throw Error(`hex string expected, got `+typeof e);return e===``?qd:BigInt(`0x`+e)}function $d(e){return Qd(Ed(e))}function ef(e){return _d(e),Qd(Ed(Uint8Array.from(e).reverse()))}function tf(e,t){return kd(e.toString(16).padStart(t*2,`0`))}function nf(e,t){return tf(e,t).reverse()}function J(e,t,n){let r;if(typeof t==`string`)try{r=kd(t)}catch(t){throw Error(e+` must be hex string or Uint8Array, cause: `+t)}else if(hd(t))r=Uint8Array.from(t);else throw Error(e+` must be hex string or Uint8Array`);let i=r.length;if(typeof n==`number`&&i!==n)throw Error(e+` of length `+n+` expected, got `+i);return r}var rf=e=>typeof e==`bigint`&&qd<=e;function af(e,t,n){return rf(e)&&rf(t)&&rf(n)&&t<=e&&e<n}function of(e,t,n,r){if(!af(t,n,r))throw Error(`expected valid `+e+`: `+n+` <= n < `+r+`, got `+t)}function sf(e){let t;for(t=0;e>qd;e>>=Jd,t+=1);return t}var cf=e=>(Jd<<BigInt(e))-Jd;function lf(e,t,n){if(typeof e!=`number`||e<2)throw Error(`hashLen must be a number`);if(typeof t!=`number`||t<2)throw Error(`qByteLen must be a number`);if(typeof n!=`function`)throw Error(`hmacFn must be a function`);let r=e=>new Uint8Array(e),i=e=>Uint8Array.of(e),a=r(e),o=r(e),s=0,c=()=>{a.fill(1),o.fill(0),s=0},l=(...e)=>n(o,a,...e),u=(e=r(0))=>{o=l(i(0),e),a=l(),e.length!==0&&(o=l(i(1),e),a=l())},d=()=>{if(s++>=1e3)throw Error(`drbg: tried 1000 values`);let e=0,n=[];for(;e<t;){a=l();let t=a.slice();n.push(t),e+=a.length}return Md(...n)};return(e,t)=>{c(),u(e);let n;for(;!(n=t(d()));)u();return c(),n}}function uf(e,t,n={}){if(!e||typeof e!=`object`)throw Error(`expected valid options object`);function r(t,n,r){let i=e[t];if(r&&i===void 0)return;let a=typeof i;if(a!==n||i===null)throw Error(`param "${t}" is invalid: expected ${n}, got ${a}`)}Object.entries(t).forEach(([e,t])=>r(e,t,!1)),Object.entries(n).forEach(([e,t])=>r(e,t,!0))}function df(e){let t=new WeakMap;return(n,...r)=>{let i=t.get(n);if(i!==void 0)return i;let a=e(n,...r);return t.set(n,a),a}}var ff=BigInt(0),pf=BigInt(1),mf=BigInt(2),hf=BigInt(3),gf=BigInt(4),_f=BigInt(5),vf=BigInt(7),yf=BigInt(8),bf=BigInt(9),xf=BigInt(16);function Sf(e,t){let n=e%t;return n>=ff?n:t+n}function Cf(e,t,n){let r=e;for(;t-- >ff;)r*=r,r%=n;return r}function wf(e,t){if(e===ff)throw Error(`invert: expected non-zero number`);if(t<=ff)throw Error(`invert: expected positive modulus, got `+t);let n=Sf(e,t),r=t,i=ff,a=pf,o=pf,s=ff;for(;n!==ff;){let e=r/n,t=r%n,c=i-o*e,l=a-s*e;r=n,n=t,i=o,a=s,o=c,s=l}if(r!==pf)throw Error(`invert: does not exist`);return Sf(i,t)}function Tf(e,t,n){if(!e.eql(e.sqr(t),n))throw Error(`Cannot find square root`)}function Ef(e,t){let n=(e.ORDER+pf)/gf,r=e.pow(t,n);return Tf(e,r,t),r}function Df(e,t){let n=(e.ORDER-_f)/yf,r=e.mul(t,mf),i=e.pow(r,n),a=e.mul(t,i),o=e.mul(e.mul(a,mf),i),s=e.mul(a,e.sub(o,e.ONE));return Tf(e,s,t),s}function Of(e){let t=Lf(e),n=kf(e),r=n(t,t.neg(t.ONE)),i=n(t,r),a=n(t,t.neg(r)),o=(e+vf)/xf;return(e,t)=>{let n=e.pow(t,o),s=e.mul(n,r),c=e.mul(n,i),l=e.mul(n,a),u=e.eql(e.sqr(s),t),d=e.eql(e.sqr(c),t);n=e.cmov(n,s,u),s=e.cmov(l,c,d);let f=e.eql(e.sqr(s),t),p=e.cmov(n,s,f);return Tf(e,p,t),p}}function kf(e){if(e<hf)throw Error(`sqrt is not defined for small field`);let t=e-pf,n=0;for(;t%mf===ff;)t/=mf,n++;let r=mf,i=Lf(e);for(;Ff(i,r)===1;)if(r++>1e3)throw Error(`Cannot find square root: probably non-prime P`);if(n===1)return Ef;let a=i.pow(r,t),o=(t+pf)/mf;return function(e,r){if(e.is0(r))return r;if(Ff(e,r)!==1)throw Error(`Cannot find square root`);let i=n,s=e.mul(e.ONE,a),c=e.pow(r,t),l=e.pow(r,o);for(;!e.eql(c,e.ONE);){if(e.is0(c))return e.ZERO;let t=1,n=e.sqr(c);for(;!e.eql(n,e.ONE);)if(t++,n=e.sqr(n),t===i)throw Error(`Cannot find square root`);let r=pf<<BigInt(i-t-1),a=e.pow(s,r);i=t,s=e.sqr(a),c=e.mul(c,s),l=e.mul(l,a)}return l}}function Af(e){return e%gf===hf?Ef:e%yf===_f?Df:e%xf===bf?Of(e):kf(e)}var jf=[`create`,`isValid`,`is0`,`neg`,`inv`,`sqrt`,`sqr`,`eql`,`add`,`sub`,`mul`,`pow`,`div`,`addN`,`subN`,`mulN`,`sqrN`];function Mf(e){return uf(e,jf.reduce((e,t)=>(e[t]=`function`,e),{ORDER:`bigint`,MASK:`bigint`,BYTES:`number`,BITS:`number`})),e}function Nf(e,t,n){if(n<ff)throw Error(`invalid exponent, negatives unsupported`);if(n===ff)return e.ONE;if(n===pf)return t;let r=e.ONE,i=t;for(;n>ff;)n&pf&&(r=e.mul(r,i)),i=e.sqr(i),n>>=pf;return r}function Pf(e,t,n=!1){let r=Array(t.length).fill(n?e.ZERO:void 0),i=t.reduce((t,n,i)=>e.is0(n)?t:(r[i]=t,e.mul(t,n)),e.ONE),a=e.inv(i);return t.reduceRight((t,n,i)=>e.is0(n)?t:(r[i]=e.mul(t,r[i]),e.mul(t,n)),a),r}function Ff(e,t){let n=(e.ORDER-pf)/mf,r=e.pow(t,n),i=e.eql(r,e.ONE),a=e.eql(r,e.ZERO),o=e.eql(r,e.neg(e.ONE));if(!i&&!a&&!o)throw Error(`invalid Legendre symbol result`);return i?1:a?0:-1}function If(e,t){t!==void 0&&gd(t);let n=t===void 0?e.toString(2).length:t;return{nBitLength:n,nByteLength:Math.ceil(n/8)}}function Lf(e,t,n=!1,r={}){if(e<=ff)throw Error(`invalid field: expected ORDER > 0, got `+e);let i,a,o=!1,s;if(typeof t==`object`&&t){if(r.sqrt||n)throw Error(`cannot specify opts in two arguments`);let e=t;e.BITS&&(i=e.BITS),e.sqrt&&(a=e.sqrt),typeof e.isLE==`boolean`&&(n=e.isLE),typeof e.modFromBytes==`boolean`&&(o=e.modFromBytes),s=e.allowedLengths}else typeof t==`number`&&(i=t),r.sqrt&&(a=r.sqrt);let{nBitLength:c,nByteLength:l}=If(e,i);if(l>2048)throw Error(`invalid field: expected ORDER of <= 2048 bytes`);let u,d=Object.freeze({ORDER:e,isLE:n,BITS:c,BYTES:l,MASK:cf(c),ZERO:ff,ONE:pf,allowedLengths:s,create:t=>Sf(t,e),isValid:t=>{if(typeof t!=`bigint`)throw Error(`invalid field element: expected bigint, got `+typeof t);return ff<=t&&t<e},is0:e=>e===ff,isValidNot0:e=>!d.is0(e)&&d.isValid(e),isOdd:e=>(e&pf)===pf,neg:t=>Sf(-t,e),eql:(e,t)=>e===t,sqr:t=>Sf(t*t,e),add:(t,n)=>Sf(t+n,e),sub:(t,n)=>Sf(t-n,e),mul:(t,n)=>Sf(t*n,e),pow:(e,t)=>Nf(d,e,t),div:(t,n)=>Sf(t*wf(n,e),e),sqrN:e=>e*e,addN:(e,t)=>e+t,subN:(e,t)=>e-t,mulN:(e,t)=>e*t,inv:t=>wf(t,e),sqrt:a||(t=>(u||=Af(e),u(d,t))),toBytes:e=>n?nf(e,l):tf(e,l),fromBytes:(t,r=!0)=>{if(s){if(!s.includes(t.length)||t.length>l)throw Error(`Field.fromBytes: expected `+s+` bytes, got `+t.length);let e=new Uint8Array(l);e.set(t,n?0:e.length-t.length),t=e}if(t.length!==l)throw Error(`Field.fromBytes: expected `+l+` bytes, got `+t.length);let i=n?ef(t):$d(t);if(o&&(i=Sf(i,e)),!r&&!d.isValid(i))throw Error(`invalid field element: outside of range 0..ORDER`);return i},invertBatch:e=>Pf(d,e),cmov:(e,t,n)=>n?t:e});return Object.freeze(d)}function Rf(e){if(typeof e!=`bigint`)throw Error(`field order must be bigint`);let t=e.toString(2).length;return Math.ceil(t/8)}function zf(e){let t=Rf(e);return t+Math.ceil(t/2)}function Bf(e,t,n=!1){let r=e.length,i=Rf(t),a=zf(t);if(r<16||r<a||r>1024)throw Error(`expected `+a+`-1024 bytes of input, got `+r);let o=Sf(n?ef(e):$d(e),t-pf)+pf;return n?nf(o,i):tf(o,i)}var Vf=BigInt(0),Hf=BigInt(1);function Uf(e,t){let n=t.negate();return e?n:t}function Wf(e,t){let n=Pf(e.Fp,t.map(e=>e.Z));return t.map((t,r)=>e.fromAffine(t.toAffine(n[r])))}function Gf(e,t){if(!Number.isSafeInteger(e)||e<=0||e>t)throw Error(`invalid window size, expected [1..`+t+`], got W=`+e)}function Kf(e,t){Gf(e,t);let n=Math.ceil(t/e)+1,r=2**(e-1),i=2**e;return{windows:n,windowSize:r,mask:cf(e),maxNumber:i,shiftBy:BigInt(e)}}function qf(e,t,n){let{windowSize:r,mask:i,maxNumber:a,shiftBy:o}=n,s=Number(e&i),c=e>>o;s>r&&(s-=a,c+=Hf);let l=t*r,u=l+Math.abs(s)-1,d=s===0,f=s<0,p=t%2!=0;return{nextN:c,offset:u,isZero:d,isNeg:f,isNegF:p,offsetF:l}}function Jf(e,t){if(!Array.isArray(e))throw Error(`array expected`);e.forEach((e,n)=>{if(!(e instanceof t))throw Error(`invalid point at index `+n)})}function Yf(e,t){if(!Array.isArray(e))throw Error(`array of scalars expected`);e.forEach((e,n)=>{if(!t.isValid(e))throw Error(`invalid scalar at index `+n)})}var Xf=new WeakMap,Zf=new WeakMap;function Qf(e){return Zf.get(e)||1}function $f(e){if(e!==Vf)throw Error(`invalid wNAF`)}var ep=class{constructor(e,t){this.BASE=e.BASE,this.ZERO=e.ZERO,this.Fn=e.Fn,this.bits=t}_unsafeLadder(e,t,n=this.ZERO){let r=e;for(;t>Vf;)t&Hf&&(n=n.add(r)),r=r.double(),t>>=Hf;return n}precomputeWindow(e,t){let{windows:n,windowSize:r}=Kf(t,this.bits),i=[],a=e,o=a;for(let e=0;e<n;e++){o=a,i.push(o);for(let e=1;e<r;e++)o=o.add(a),i.push(o);a=o.double()}return i}wNAF(e,t,n){if(!this.Fn.isValid(n))throw Error(`invalid scalar`);let r=this.ZERO,i=this.BASE,a=Kf(e,this.bits);for(let e=0;e<a.windows;e++){let{nextN:o,offset:s,isZero:c,isNeg:l,isNegF:u,offsetF:d}=qf(n,e,a);n=o,c?i=i.add(Uf(u,t[d])):r=r.add(Uf(l,t[s]))}return $f(n),{p:r,f:i}}wNAFUnsafe(e,t,n,r=this.ZERO){let i=Kf(e,this.bits);for(let e=0;e<i.windows&&n!==Vf;e++){let{nextN:a,offset:o,isZero:s,isNeg:c}=qf(n,e,i);if(n=a,!s){let e=t[o];r=r.add(c?e.negate():e)}}return $f(n),r}getPrecomputes(e,t,n){let r=Xf.get(t);return r||(r=this.precomputeWindow(t,e),e!==1&&(typeof n==`function`&&(r=n(r)),Xf.set(t,r))),r}cached(e,t,n){let r=Qf(e);return this.wNAF(r,this.getPrecomputes(r,e,n),t)}unsafe(e,t,n,r){let i=Qf(e);return i===1?this._unsafeLadder(e,t,r):this.wNAFUnsafe(i,this.getPrecomputes(i,e,n),t,r)}createCache(e,t){Gf(t,this.bits),Zf.set(e,t),Xf.delete(e)}hasCache(e){return Qf(e)!==1}};function tp(e,t,n,r){let i=t,a=e.ZERO,o=e.ZERO;for(;n>Vf||r>Vf;)n&Hf&&(a=a.add(i)),r&Hf&&(o=o.add(i)),i=i.double(),n>>=Hf,r>>=Hf;return{p1:a,p2:o}}function np(e,t,n,r){Jf(n,e),Yf(r,t);let i=n.length,a=r.length;if(i!==a)throw Error(`arrays of points and scalars must have equal length`);let o=e.ZERO,s=sf(BigInt(i)),c=1;s>12?c=s-3:s>4?c=s-2:s>0&&(c=2);let l=cf(c),u=Array(Number(l)+1).fill(o),d=Math.floor((t.BITS-1)/c)*c,f=o;for(let e=d;e>=0;e-=c){u.fill(o);for(let t=0;t<a;t++){let i=r[t],a=Number(i>>BigInt(e)&l);u[a]=u[a].add(n[t])}let t=o;for(let e=u.length-1,n=o;e>0;e--)n=n.add(u[e]),t=t.add(n);if(f=f.add(t),e!==0)for(let e=0;e<c;e++)f=f.double()}return f}function rp(e,t,n){if(t){if(t.ORDER!==e)throw Error(`Field.ORDER must match order: Fp == p, Fn == n`);return Mf(t),t}else return Lf(e,{isLE:n})}function ip(e,t,n={},r){if(r===void 0&&(r=e===`edwards`),!t||typeof t!=`object`)throw Error(`expected valid ${e} CURVE object`);for(let e of[`p`,`n`,`h`]){let n=t[e];if(!(typeof n==`bigint`&&n>Vf))throw Error(`CURVE.${e} must be positive bigint`)}let i=rp(t.p,n.Fp,r),a=rp(t.n,n.Fn,r),o=[`Gx`,`Gy`,`a`,e===`weierstrass`?`b`:`d`];for(let e of o)if(!i.isValid(t[e]))throw Error(`CURVE.${e} must be valid field element of CURVE.Fp`);return t=Object.freeze(Object.assign({},t)),{CURVE:t,Fp:i,Fn:a}}var ap=(e,t)=>(e+(e>=0?t:-t)/fp)/t;function op(e,t,n){let[[r,i],[a,o]]=t,s=ap(o*e,n),c=ap(-i*e,n),l=e-s*r-c*a,u=-s*i-c*o,d=l<up,f=u<up;d&&(l=-l),f&&(u=-u);let p=cf(Math.ceil(sf(n)/2))+dp;if(l<up||l>=p||u<up||u>=p)throw Error(`splitScalar (endomorphism): failed, k=`+e);return{k1neg:d,k1:l,k2neg:f,k2:u}}function sp(e){if(![`compact`,`recovered`,`der`].includes(e))throw Error(`Signature format must be "compact", "recovered", or "der"`);return e}function cp(e,t){let n={};for(let r of Object.keys(t))n[r]=e[r]===void 0?t[r]:e[r];return Yd(n.lowS,`lowS`),Yd(n.prehash,`prehash`),n.format!==void 0&&sp(n.format),n}var lp={Err:class extends Error{constructor(e=``){super(e)}},_tlv:{encode:(e,t)=>{let{Err:n}=lp;if(e<0||e>256)throw new n(`tlv.encode: wrong tag`);if(t.length&1)throw new n(`tlv.encode: unpadded data`);let r=t.length/2,i=Zd(r);if(i.length/2&128)throw new n(`tlv.encode: long form length too big`);let a=r>127?Zd(i.length/2|128):``;return Zd(e)+a+i+t},decode(e,t){let{Err:n}=lp,r=0;if(e<0||e>256)throw new n(`tlv.encode: wrong tag`);if(t.length<2||t[r++]!==e)throw new n(`tlv.decode: wrong tlv`);let i=t[r++],a=!!(i&128),o=0;if(!a)o=i;else{let e=i&127;if(!e)throw new n(`tlv.decode(long): indefinite length not supported`);if(e>4)throw new n(`tlv.decode(long): byte length is too big`);let a=t.subarray(r,r+e);if(a.length!==e)throw new n(`tlv.decode: length bytes not complete`);if(a[0]===0)throw new n(`tlv.decode(long): zero leftmost byte`);for(let e of a)o=o<<8|e;if(r+=e,o<128)throw new n(`tlv.decode(long): not minimal encoding`)}let s=t.subarray(r,r+o);if(s.length!==o)throw new n(`tlv.decode: wrong value length`);return{v:s,l:t.subarray(r+o)}}},_int:{encode(e){let{Err:t}=lp;if(e<up)throw new t(`integer: negative integers are not allowed`);let n=Zd(e);if(Number.parseInt(n[0],16)&8&&(n=`00`+n),n.length&1)throw new t(`unexpected DER parsing assertion: unpadded hex`);return n},decode(e){let{Err:t}=lp;if(e[0]&128)throw new t(`invalid signature integer: negative`);if(e[0]===0&&!(e[1]&128))throw new t(`invalid signature integer: unnecessary leading zero`);return $d(e)}},toSig(e){let{Err:t,_int:n,_tlv:r}=lp,i=J(`signature`,e),{v:a,l:o}=r.decode(48,i);if(o.length)throw new t(`invalid signature: left bytes after parsing`);let{v:s,l:c}=r.decode(2,a),{v:l,l:u}=r.decode(2,c);if(u.length)throw new t(`invalid signature: left bytes after parsing`);return{r:n.decode(s),s:n.decode(l)}},hexFromSig(e){let{_tlv:t,_int:n}=lp,r=t.encode(2,n.encode(e.r))+t.encode(2,n.encode(e.s));return t.encode(48,r)}},up=BigInt(0),dp=BigInt(1),fp=BigInt(2),pp=BigInt(3),mp=BigInt(4);function hp(e,t){let{BYTES:n}=e,r;if(typeof t==`bigint`)r=t;else{let i=J(`private key`,t);try{r=e.fromBytes(i)}catch{throw Error(`invalid private key: expected ui8a of size ${n}, got ${typeof t}`)}}if(!e.isValidNot0(r))throw Error(`invalid private key: out of range [1..N-1]`);return r}function gp(e,t={}){let n=ip(`weierstrass`,e,t),{Fp:r,Fn:i}=n,a=n.CURVE,{h:o,n:s}=a;uf(t,{},{allowInfinityPoint:`boolean`,clearCofactor:`function`,isTorsionFree:`function`,fromBytes:`function`,toBytes:`function`,endo:`object`,wrapPrivateKey:`boolean`});let{endo:c}=t;if(c&&(!r.is0(a.a)||typeof c.beta!=`bigint`||!Array.isArray(c.basises)))throw Error(`invalid endo: expected "beta": bigint and "basises": array`);let l=vp(r,i);function u(){if(!r.isOdd)throw Error(`compression is not supported: Field does not have .isOdd()`)}function d(e,t,n){let{x:i,y:a}=t.toAffine(),o=r.toBytes(i);return Yd(n,`isCompressed`),n?(u(),Md(_p(!r.isOdd(a)),o)):Md(Uint8Array.of(4),o,r.toBytes(a))}function f(e){Xd(e,void 0,`Point`);let{publicKey:t,publicKeyUncompressed:n}=l,i=e.length,a=e[0],o=e.subarray(1);if(i===t&&(a===2||a===3)){let e=r.fromBytes(o);if(!r.isValid(e))throw Error(`bad point: is not on curve, wrong x`);let t=h(e),n;try{n=r.sqrt(t)}catch(e){let t=e instanceof Error?`: `+e.message:``;throw Error(`bad point: is not on curve, sqrt error`+t)}u();let i=r.isOdd(n);return(a&1)==1!==i&&(n=r.neg(n)),{x:e,y:n}}else if(i===n&&a===4){let e=r.BYTES,t=r.fromBytes(o.subarray(0,e)),n=r.fromBytes(o.subarray(e,e*2));if(!g(t,n))throw Error(`bad point: is not on curve`);return{x:t,y:n}}else throw Error(`bad point: got length ${i}, expected compressed=${t} or uncompressed=${n}`)}let p=t.toBytes||d,m=t.fromBytes||f;function h(e){let t=r.sqr(e),n=r.mul(t,e);return r.add(r.add(n,r.mul(e,a.a)),a.b)}function g(e,t){let n=r.sqr(t),i=h(e);return r.eql(n,i)}if(!g(a.Gx,a.Gy))throw Error(`bad curve params: generator point`);let _=r.mul(r.pow(a.a,pp),mp),v=r.mul(r.sqr(a.b),BigInt(27));if(r.is0(r.add(_,v)))throw Error(`bad curve params: a or b`);function y(e,t,n=!1){if(!r.isValid(t)||n&&r.is0(t))throw Error(`bad point coordinate ${e}`);return t}function b(e){if(!(e instanceof T))throw Error(`ProjectivePoint expected`)}function x(e){if(!c||!c.basises)throw Error(`no endo`);return op(e,c.basises,i.ORDER)}let S=df((e,t)=>{let{X:n,Y:i,Z:a}=e;if(r.eql(a,r.ONE))return{x:n,y:i};let o=e.is0();t??=o?r.ONE:r.inv(a);let s=r.mul(n,t),c=r.mul(i,t),l=r.mul(a,t);if(o)return{x:r.ZERO,y:r.ZERO};if(!r.eql(l,r.ONE))throw Error(`invZ was invalid`);return{x:s,y:c}}),C=df(e=>{if(e.is0()){if(t.allowInfinityPoint&&!r.is0(e.Y))return;throw Error(`bad point: ZERO`)}let{x:n,y:i}=e.toAffine();if(!r.isValid(n)||!r.isValid(i))throw Error(`bad point: x or y not field elements`);if(!g(n,i))throw Error(`bad point: equation left != right`);if(!e.isTorsionFree())throw Error(`bad point: not in prime-order subgroup`);return!0});function w(e,t,n,i,a){return n=new T(r.mul(n.X,e),n.Y,n.Z),t=Uf(i,t),n=Uf(a,n),t.add(n)}class T{constructor(e,t,n){this.X=y(`x`,e),this.Y=y(`y`,t,!0),this.Z=y(`z`,n),Object.freeze(this)}static CURVE(){return a}static fromAffine(e){let{x:t,y:n}=e||{};if(!e||!r.isValid(t)||!r.isValid(n))throw Error(`invalid affine point`);if(e instanceof T)throw Error(`projective point not allowed`);return r.is0(t)&&r.is0(n)?T.ZERO:new T(t,n,r.ONE)}static fromBytes(e){let t=T.fromAffine(m(Xd(e,void 0,`point`)));return t.assertValidity(),t}static fromHex(e){return T.fromBytes(J(`pointHex`,e))}get x(){return this.toAffine().x}get y(){return this.toAffine().y}precompute(e=8,t=!0){return D.createCache(this,e),t||this.multiply(pp),this}assertValidity(){C(this)}hasEvenY(){let{y:e}=this.toAffine();if(!r.isOdd)throw Error(`Field doesn't support isOdd`);return!r.isOdd(e)}equals(e){b(e);let{X:t,Y:n,Z:i}=this,{X:a,Y:o,Z:s}=e,c=r.eql(r.mul(t,s),r.mul(a,i)),l=r.eql(r.mul(n,s),r.mul(o,i));return c&&l}negate(){return new T(this.X,r.neg(this.Y),this.Z)}double(){let{a:e,b:t}=a,n=r.mul(t,pp),{X:i,Y:o,Z:s}=this,c=r.ZERO,l=r.ZERO,u=r.ZERO,d=r.mul(i,i),f=r.mul(o,o),p=r.mul(s,s),m=r.mul(i,o);return m=r.add(m,m),u=r.mul(i,s),u=r.add(u,u),c=r.mul(e,u),l=r.mul(n,p),l=r.add(c,l),c=r.sub(f,l),l=r.add(f,l),l=r.mul(c,l),c=r.mul(m,c),u=r.mul(n,u),p=r.mul(e,p),m=r.sub(d,p),m=r.mul(e,m),m=r.add(m,u),u=r.add(d,d),d=r.add(u,d),d=r.add(d,p),d=r.mul(d,m),l=r.add(l,d),p=r.mul(o,s),p=r.add(p,p),d=r.mul(p,m),c=r.sub(c,d),u=r.mul(p,f),u=r.add(u,u),u=r.add(u,u),new T(c,l,u)}add(e){b(e);let{X:t,Y:n,Z:i}=this,{X:o,Y:s,Z:c}=e,l=r.ZERO,u=r.ZERO,d=r.ZERO,f=a.a,p=r.mul(a.b,pp),m=r.mul(t,o),h=r.mul(n,s),g=r.mul(i,c),_=r.add(t,n),v=r.add(o,s);_=r.mul(_,v),v=r.add(m,h),_=r.sub(_,v),v=r.add(t,i);let y=r.add(o,c);return v=r.mul(v,y),y=r.add(m,g),v=r.sub(v,y),y=r.add(n,i),l=r.add(s,c),y=r.mul(y,l),l=r.add(h,g),y=r.sub(y,l),d=r.mul(f,v),l=r.mul(p,g),d=r.add(l,d),l=r.sub(h,d),d=r.add(h,d),u=r.mul(l,d),h=r.add(m,m),h=r.add(h,m),g=r.mul(f,g),v=r.mul(p,v),h=r.add(h,g),g=r.sub(m,g),g=r.mul(f,g),v=r.add(v,g),m=r.mul(h,v),u=r.add(u,m),m=r.mul(y,v),l=r.mul(_,l),l=r.sub(l,m),m=r.mul(_,h),d=r.mul(y,d),d=r.add(d,m),new T(l,u,d)}subtract(e){return this.add(e.negate())}is0(){return this.equals(T.ZERO)}multiply(e){let{endo:n}=t;if(!i.isValidNot0(e))throw Error(`invalid scalar: out of range`);let r,a,o=e=>D.cached(this,e,e=>Wf(T,e));if(n){let{k1neg:t,k1:i,k2neg:s,k2:c}=x(e),{p:l,f:u}=o(i),{p:d,f}=o(c);a=u.add(f),r=w(n.beta,l,d,t,s)}else{let{p:t,f:n}=o(e);r=t,a=n}return Wf(T,[r,a])[0]}multiplyUnsafe(e){let{endo:n}=t,r=this;if(!i.isValid(e))throw Error(`invalid scalar: out of range`);if(e===up||r.is0())return T.ZERO;if(e===dp)return r;if(D.hasCache(this))return this.multiply(e);if(n){let{k1neg:t,k1:i,k2neg:a,k2:o}=x(e),{p1:s,p2:c}=tp(T,r,i,o);return w(n.beta,s,c,t,a)}else return D.unsafe(r,e)}multiplyAndAddUnsafe(e,t,n){let r=this.multiplyUnsafe(t).add(e.multiplyUnsafe(n));return r.is0()?void 0:r}toAffine(e){return S(this,e)}isTorsionFree(){let{isTorsionFree:e}=t;return o===dp?!0:e?e(T,this):D.unsafe(this,s).is0()}clearCofactor(){let{clearCofactor:e}=t;return o===dp?this:e?e(T,this):this.multiplyUnsafe(o)}isSmallOrder(){return this.multiplyUnsafe(o).is0()}toBytes(e=!0){return Yd(e,`isCompressed`),this.assertValidity(),p(T,this,e)}toHex(e=!0){return Ed(this.toBytes(e))}toString(){return`<Point ${this.is0()?`ZERO`:this.toHex()}>`}get px(){return this.X}get py(){return this.X}get pz(){return this.Z}toRawBytes(e=!0){return this.toBytes(e)}_setWindowSize(e){this.precompute(e)}static normalizeZ(e){return Wf(T,e)}static msm(e,t){return np(T,i,e,t)}static fromPrivateKey(e){return T.BASE.multiply(hp(i,e))}}T.BASE=new T(a.Gx,a.Gy,r.ONE),T.ZERO=new T(r.ZERO,r.ONE,r.ZERO),T.Fp=r,T.Fn=i;let E=i.BITS,D=new ep(T,t.endo?Math.ceil(E/2):E);return T.BASE.precompute(8),T}function _p(e){return Uint8Array.of(e?2:3)}function vp(e,t){return{secretKey:t.BYTES,publicKey:1+e.BYTES,publicKeyUncompressed:1+2*e.BYTES,publicKeyHasPrefix:!0,signature:2*t.BYTES}}function yp(e,t={}){let{Fn:n}=e,r=t.randomBytes||Fd,i=Object.assign(vp(e.Fp,n),{seed:zf(n.ORDER)});function a(e){try{return!!hp(n,e)}catch{return!1}}function o(t,n){let{publicKey:r,publicKeyUncompressed:a}=i;try{let i=t.length;return n===!0&&i!==r||n===!1&&i!==a?!1:!!e.fromBytes(t)}catch{return!1}}function s(e=r(i.seed)){return Bf(Xd(e,i.seed,`seed`),n.ORDER)}function c(t,r=!0){return e.BASE.multiply(hp(n,t)).toBytes(r)}function l(e){let t=s(e);return{secretKey:t,publicKey:c(t)}}function u(t){if(typeof t==`bigint`)return!1;if(t instanceof e)return!0;let{secretKey:r,publicKey:a,publicKeyUncompressed:o}=i;if(n.allowedLengths||r===a)return;let s=J(`key`,t).length;return s===a||s===o}function d(t,r,i=!0){if(u(t)===!0)throw Error(`first arg must be private key`);if(u(r)===!1)throw Error(`second arg must be public key`);let a=hp(n,t);return e.fromHex(r).multiply(a).toBytes(i)}return Object.freeze({getPublicKey:c,getSharedSecret:d,keygen:l,Point:e,utils:{isValidSecretKey:a,isValidPublicKey:o,randomSecretKey:s,isValidPrivateKey:a,randomPrivateKey:s,normPrivateKeyToScalar:e=>hp(n,e),precompute(t=8,n=e.BASE){return n.precompute(t,!1)}},lengths:i})}function bp(e,t,n={}){vd(t),uf(n,{},{hmac:`function`,lowS:`boolean`,randomBytes:`function`,bits2int:`function`,bits2int_modN:`function`});let r=n.randomBytes||Fd,i=n.hmac||((e,...n)=>Kd(t,e,Md(...n))),{Fp:a,Fn:o}=e,{ORDER:s,BITS:c}=o,{keygen:l,getPublicKey:u,getSharedSecret:d,utils:f,lengths:p}=yp(e,n),m={prehash:!1,lowS:typeof n.lowS==`boolean`?n.lowS:!1,format:void 0,extraEntropy:!1},h=`compact`;function g(e){return e>s>>dp}function _(e,t){if(!o.isValidNot0(t))throw Error(`invalid signature ${e}: out of range 1..Point.Fn.ORDER`);return t}function v(e,t){sp(t);let n=p.signature;return Xd(e,t===`compact`?n:t===`recovered`?n+1:void 0,`${t} signature`)}class y{constructor(e,t,n){this.r=_(`r`,e),this.s=_(`s`,t),n!=null&&(this.recovery=n),Object.freeze(this)}static fromBytes(e,t=h){v(e,t);let n;if(t===`der`){let{r:t,s:n}=lp.toSig(Xd(e));return new y(t,n)}t===`recovered`&&(n=e[0],t=`compact`,e=e.subarray(1));let r=o.BYTES,i=e.subarray(0,r),a=e.subarray(r,r*2);return new y(o.fromBytes(i),o.fromBytes(a),n)}static fromHex(e,t){return this.fromBytes(kd(e),t)}addRecoveryBit(e){return new y(this.r,this.s,e)}recoverPublicKey(t){let n=a.ORDER,{r,s:i,recovery:c}=this;if(c==null||![0,1,2,3].includes(c))throw Error(`recovery id invalid`);if(s*fp<n&&c>1)throw Error(`recovery id is ambiguous for h>1 curve`);let l=c===2||c===3?r+s:r;if(!a.isValid(l))throw Error(`recovery id 2 or 3 invalid`);let u=a.toBytes(l),d=e.fromBytes(Md(_p((c&1)==0),u)),f=o.inv(l),p=x(J(`msgHash`,t)),m=o.create(-p*f),h=o.create(i*f),g=e.BASE.multiplyUnsafe(m).add(d.multiplyUnsafe(h));if(g.is0())throw Error(`point at infinify`);return g.assertValidity(),g}hasHighS(){return g(this.s)}toBytes(e=h){if(sp(e),e===`der`)return kd(lp.hexFromSig(this));let t=o.toBytes(this.r),n=o.toBytes(this.s);if(e===`recovered`){if(this.recovery==null)throw Error(`recovery bit must be present`);return Md(Uint8Array.of(this.recovery),t,n)}return Md(t,n)}toHex(e){return Ed(this.toBytes(e))}assertValidity(){}static fromCompact(e){return y.fromBytes(J(`sig`,e),`compact`)}static fromDER(e){return y.fromBytes(J(`sig`,e),`der`)}normalizeS(){return this.hasHighS()?new y(this.r,o.neg(this.s),this.recovery):this}toDERRawBytes(){return this.toBytes(`der`)}toDERHex(){return Ed(this.toBytes(`der`))}toCompactRawBytes(){return this.toBytes(`compact`)}toCompactHex(){return Ed(this.toBytes(`compact`))}}let b=n.bits2int||function(e){if(e.length>8192)throw Error(`input is too large`);let t=$d(e),n=e.length*8-c;return n>0?t>>BigInt(n):t},x=n.bits2int_modN||function(e){return o.create(b(e))},S=cf(c);function C(e){return of(`num < 2^`+c,e,up,S),o.toBytes(e)}function w(e,n){return Xd(e,void 0,`message`),n?Xd(t(e),void 0,`prehashed message`):e}function T(t,n,i){if([`recovered`,`canonical`].some(e=>e in i))throw Error(`sign() legacy options not supported`);let{lowS:a,prehash:s,extraEntropy:c}=cp(i,m);t=w(t,s);let l=x(t),u=hp(o,n),d=[C(u),C(l)];if(c!=null&&c!==!1){let e=c===!0?r(p.secretKey):c;d.push(J(`extraEntropy`,e))}let f=Md(...d),h=l;function _(t){let n=b(t);if(!o.isValidNot0(n))return;let r=o.inv(n),i=e.BASE.multiply(n).toAffine(),s=o.create(i.x);if(s===up)return;let c=o.create(r*o.create(h+s*u));if(c===up)return;let l=(i.x===s?0:2)|Number(i.y&dp),d=c;return a&&g(c)&&(d=o.neg(c),l^=1),new y(s,d,l)}return{seed:f,k2sig:_}}function E(e,n,r={}){e=J(`message`,e);let{seed:a,k2sig:s}=T(e,n,r);return lf(t.outputLen,o.BYTES,i)(a,s)}function D(e){let t,n=typeof e==`string`||hd(e),r=!n&&typeof e==`object`&&!!e&&typeof e.r==`bigint`&&typeof e.s==`bigint`;if(!n&&!r)throw Error(`invalid signature, expected Uint8Array, hex string or Signature instance`);if(r)t=new y(e.r,e.s);else if(n){try{t=y.fromBytes(J(`sig`,e),`der`)}catch(e){if(!(e instanceof lp.Err))throw e}if(!t)try{t=y.fromBytes(J(`sig`,e),`compact`)}catch{return!1}}return t||!1}function O(t,n,r,i={}){let{lowS:a,prehash:s,format:c}=cp(i,m);if(r=J(`publicKey`,r),n=w(J(`message`,n),s),`strict`in i)throw Error(`options.strict was renamed to lowS`);let l=c===void 0?D(t):y.fromBytes(J(`sig`,t),c);if(l===!1)return!1;try{let t=e.fromBytes(r);if(a&&l.hasHighS())return!1;let{r:i,s}=l,c=x(n),u=o.inv(s),d=o.create(c*u),f=o.create(i*u),p=e.BASE.multiplyUnsafe(d).add(t.multiplyUnsafe(f));return p.is0()?!1:o.create(p.x)===i}catch{return!1}}function k(e,t,n={}){let{prehash:r}=cp(n,m);return t=w(t,r),y.fromBytes(e,`recovered`).recoverPublicKey(t).toBytes()}return Object.freeze({keygen:l,getPublicKey:u,getSharedSecret:d,utils:f,lengths:p,Point:e,sign:E,verify:O,recoverPublicKey:k,Signature:y,hash:t})}function xp(e){let t={a:e.a,b:e.b,p:e.Fp.ORDER,n:e.n,h:e.h,Gx:e.Gx,Gy:e.Gy},n=e.Fp,r=e.allowedPrivateKeyLengths?Array.from(new Set(e.allowedPrivateKeyLengths.map(e=>Math.ceil(e/2)))):void 0;return{CURVE:t,curveOpts:{Fp:n,Fn:Lf(t.n,{BITS:e.nBitLength,allowedLengths:r,modFromBytes:e.wrapPrivateKey}),allowInfinityPoint:e.allowInfinityPoint,endo:e.endo,isTorsionFree:e.isTorsionFree,clearCofactor:e.clearCofactor,fromBytes:e.fromBytes,toBytes:e.toBytes}}}function Sp(e){let{CURVE:t,curveOpts:n}=xp(e),r={hmac:e.hmac,randomBytes:e.randomBytes,lowS:e.lowS,bits2int:e.bits2int,bits2int_modN:e.bits2int_modN};return{CURVE:t,curveOpts:n,hash:e.hash,ecdsaOpts:r}}function Cp(e,t){let n=t.Point;return Object.assign({},t,{ProjectivePoint:n,CURVE:Object.assign({},e,If(n.Fn.ORDER,n.Fn.BITS))})}function wp(e){let{CURVE:t,curveOpts:n,hash:r,ecdsaOpts:i}=Sp(e);return Cp(e,bp(gp(t,n),r,i))}function Tp(e,t){let n=t=>wp({...e,hash:t});return{...n(t),create:n}}var Ep={p:BigInt(`0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f`),n:BigInt(`0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141`),h:BigInt(1),a:BigInt(0),b:BigInt(7),Gx:BigInt(`0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798`),Gy:BigInt(`0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8`)},Dp={beta:BigInt(`0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee`),basises:[[BigInt(`0x3086d221a7d46bcde86c90e49284eb15`),-BigInt(`0xe4437ed6010e88286f547fa90abfe4c3`)],[BigInt(`0x114ca50f7a8e2f3f657c1108d9d44cfd8`),BigInt(`0x3086d221a7d46bcde86c90e49284eb15`)]]},Op=BigInt(0),kp=BigInt(1),Ap=BigInt(2);function jp(e){let t=Ep.p,n=BigInt(3),r=BigInt(6),i=BigInt(11),a=BigInt(22),o=BigInt(23),s=BigInt(44),c=BigInt(88),l=e*e*e%t,u=l*l*e%t,d=Cf(Cf(Cf(u,n,t)*u%t,n,t)*u%t,Ap,t)*l%t,f=Cf(d,i,t)*d%t,p=Cf(f,a,t)*f%t,m=Cf(p,s,t)*p%t,h=Cf(Cf(Cf(Cf(Cf(Cf(m,c,t)*m%t,s,t)*p%t,n,t)*u%t,o,t)*f%t,r,t)*l%t,Ap,t);if(!Mp.eql(Mp.sqr(h),e))throw Error(`Cannot find square root`);return h}var Mp=Lf(Ep.p,{sqrt:jp}),Np=Tp({...Ep,Fp:Mp,lowS:!0,endo:Dp},Wd),Pp={};function Fp(e,...t){let n=Pp[e];if(n===void 0){let t=Wd(Ad(e));n=Md(t,t),Pp[e]=n}return Wd(Md(n,...t))}var Ip=e=>e.toBytes(!0).slice(1),Lp=Np.Point,Rp=e=>e%Ap===Op;function zp(e){let{Fn:t,BASE:n}=Lp,r=hp(t,e),i=n.multiply(r);return{scalar:Rp(i.y)?r:t.neg(r),bytes:Ip(i)}}function Bp(e){let t=Mp;if(!t.isValidNot0(e))throw Error(`invalid x: Fail if x ≥ p`);let n=t.create(e*e),r=t.create(n*e+BigInt(7)),i=t.sqrt(r);Rp(i)||(i=t.neg(i));let a=Lp.fromAffine({x:e,y:i});return a.assertValidity(),a}var Vp=$d;function Hp(...e){return Lp.Fn.create(Vp(Fp(`BIP0340/challenge`,...e)))}function Up(e){return zp(e).bytes}function Wp(e,t,n=Fd(32)){let{Fn:r}=Lp,i=J(`message`,e),{bytes:a,scalar:o}=zp(t),s=J(`auxRand`,n,32),{bytes:c,scalar:l}=zp(Fp(`BIP0340/nonce`,r.toBytes(o^Vp(Fp(`BIP0340/aux`,s))),a,i)),u=Hp(c,a,i),d=new Uint8Array(64);if(d.set(c,0),d.set(r.toBytes(r.create(l+u*o)),32),!Gp(d,i,a))throw Error(`sign: Invalid signature produced`);return d}function Gp(e,t,n){let{Fn:r,BASE:i}=Lp,a=J(`signature`,e,64),o=J(`message`,t),s=J(`publicKey`,n,32);try{let e=Bp(Vp(s)),t=Vp(a.subarray(0,32));if(!af(t,kp,Ep.p))return!1;let n=Vp(a.subarray(32,64));if(!af(n,kp,Ep.n))return!1;let c=Hp(r.toBytes(t),Ip(e),o),l=i.multiplyUnsafe(n).add(e.multiplyUnsafe(r.neg(c))),{x:u,y:d}=l.toAffine();return!(l.is0()||!Rp(d)||u!==t)}catch{return!1}}var Kp=(()=>{let e=(e=Fd(48))=>Bf(e,Ep.n);Np.utils.randomSecretKey;function t(t){let n=e(t);return{secretKey:n,publicKey:Up(n)}}return{keygen:t,getPublicKey:Up,sign:Wp,verify:Gp,Point:Lp,utils:{randomSecretKey:e,randomPrivateKey:e,taggedHash:Fp,lift_x:Bp,pointToBytes:Ip,numberToBytesBE:tf,bytesToNumberBE:$d,mod:Sf},lengths:{secretKey:32,publicKey:32,publicKeyHasPrefix:!1,signature:64,seed:48}}})(),qp=n(((e,t)=>{t.exports=function(){return typeof Promise==`function`&&Promise.prototype&&Promise.prototype.then}})),Jp=n((e=>{var t,n=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];e.getSymbolSize=function(e){if(!e)throw Error(`"version" cannot be null or undefined`);if(e<1||e>40)throw Error(`"version" should be in range from 1 to 40`);return e*4+17},e.getSymbolTotalCodewords=function(e){return n[e]},e.getBCHDigit=function(e){let t=0;for(;e!==0;)t++,e>>>=1;return t},e.setToSJISFunction=function(e){if(typeof e!=`function`)throw Error(`"toSJISFunc" is not a valid function.`);t=e},e.isKanjiModeEnabled=function(){return t!==void 0},e.toSJIS=function(e){return t(e)}})),Yp=n((e=>{e.L={bit:1},e.M={bit:0},e.Q={bit:3},e.H={bit:2};function t(t){if(typeof t!=`string`)throw Error(`Param is not a string`);switch(t.toLowerCase()){case`l`:case`low`:return e.L;case`m`:case`medium`:return e.M;case`q`:case`quartile`:return e.Q;case`h`:case`high`:return e.H;default:throw Error(`Unknown EC Level: `+t)}}e.isValid=function(e){return e&&e.bit!==void 0&&e.bit>=0&&e.bit<4},e.from=function(n,r){if(e.isValid(n))return n;try{return t(n)}catch{return r}}})),Xp=n(((e,t)=>{function n(){this.buffer=[],this.length=0}n.prototype={get:function(e){let t=Math.floor(e/8);return(this.buffer[t]>>>7-e%8&1)==1},put:function(e,t){for(let n=0;n<t;n++)this.putBit((e>>>t-n-1&1)==1)},getLengthInBits:function(){return this.length},putBit:function(e){let t=Math.floor(this.length/8);this.buffer.length<=t&&this.buffer.push(0),e&&(this.buffer[t]|=128>>>this.length%8),this.length++}},t.exports=n})),Zp=n(((e,t)=>{function n(e){if(!e||e<1)throw Error(`BitMatrix size must be defined and greater than 0`);this.size=e,this.data=new Uint8Array(e*e),this.reservedBit=new Uint8Array(e*e)}n.prototype.set=function(e,t,n,r){let i=e*this.size+t;this.data[i]=n,r&&(this.reservedBit[i]=!0)},n.prototype.get=function(e,t){return this.data[e*this.size+t]},n.prototype.xor=function(e,t,n){this.data[e*this.size+t]^=n},n.prototype.isReserved=function(e,t){return this.reservedBit[e*this.size+t]},t.exports=n})),Qp=n((e=>{var t=Jp().getSymbolSize;e.getRowColCoords=function(e){if(e===1)return[];let n=Math.floor(e/7)+2,r=t(e),i=r===145?26:Math.ceil((r-13)/(2*n-2))*2,a=[r-7];for(let e=1;e<n-1;e++)a[e]=a[e-1]-i;return a.push(6),a.reverse()},e.getPositions=function(t){let n=[],r=e.getRowColCoords(t),i=r.length;for(let e=0;e<i;e++)for(let t=0;t<i;t++)e===0&&t===0||e===0&&t===i-1||e===i-1&&t===0||n.push([r[e],r[t]]);return n}})),$p=n((e=>{var t=Jp().getSymbolSize,n=7;e.getPositions=function(e){let r=t(e);return[[0,0],[r-n,0],[0,r-n]]}})),em=n((e=>{e.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};var t={N1:3,N2:3,N3:40,N4:10};e.isValid=function(e){return e!=null&&e!==``&&!isNaN(e)&&e>=0&&e<=7},e.from=function(t){return e.isValid(t)?parseInt(t,10):void 0},e.getPenaltyN1=function(e){let n=e.size,r=0,i=0,a=0,o=null,s=null;for(let c=0;c<n;c++){i=a=0,o=s=null;for(let l=0;l<n;l++){let n=e.get(c,l);n===o?i++:(i>=5&&(r+=t.N1+(i-5)),o=n,i=1),n=e.get(l,c),n===s?a++:(a>=5&&(r+=t.N1+(a-5)),s=n,a=1)}i>=5&&(r+=t.N1+(i-5)),a>=5&&(r+=t.N1+(a-5))}return r},e.getPenaltyN2=function(e){let n=e.size,r=0;for(let t=0;t<n-1;t++)for(let i=0;i<n-1;i++){let n=e.get(t,i)+e.get(t,i+1)+e.get(t+1,i)+e.get(t+1,i+1);(n===4||n===0)&&r++}return r*t.N2},e.getPenaltyN3=function(e){let n=e.size,r=0,i=0,a=0;for(let t=0;t<n;t++){i=a=0;for(let o=0;o<n;o++)i=i<<1&2047|e.get(t,o),o>=10&&(i===1488||i===93)&&r++,a=a<<1&2047|e.get(o,t),o>=10&&(a===1488||a===93)&&r++}return r*t.N3},e.getPenaltyN4=function(e){let n=0,r=e.data.length;for(let t=0;t<r;t++)n+=e.data[t];return Math.abs(Math.ceil(n*100/r/5)-10)*t.N4};function n(t,n,r){switch(t){case e.Patterns.PATTERN000:return(n+r)%2==0;case e.Patterns.PATTERN001:return n%2==0;case e.Patterns.PATTERN010:return r%3==0;case e.Patterns.PATTERN011:return(n+r)%3==0;case e.Patterns.PATTERN100:return(Math.floor(n/2)+Math.floor(r/3))%2==0;case e.Patterns.PATTERN101:return n*r%2+n*r%3==0;case e.Patterns.PATTERN110:return(n*r%2+n*r%3)%2==0;case e.Patterns.PATTERN111:return(n*r%3+(n+r)%2)%2==0;default:throw Error(`bad maskPattern:`+t)}}e.applyMask=function(e,t){let r=t.size;for(let i=0;i<r;i++)for(let a=0;a<r;a++)t.isReserved(a,i)||t.xor(a,i,n(e,a,i))},e.getBestMask=function(t,n){let r=Object.keys(e.Patterns).length,i=0,a=1/0;for(let o=0;o<r;o++){n(o),e.applyMask(o,t);let r=e.getPenaltyN1(t)+e.getPenaltyN2(t)+e.getPenaltyN3(t)+e.getPenaltyN4(t);e.applyMask(o,t),r<a&&(a=r,i=o)}return i}})),tm=n((e=>{var t=Yp(),n=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],r=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];e.getBlocksCount=function(e,r){switch(r){case t.L:return n[(e-1)*4+0];case t.M:return n[(e-1)*4+1];case t.Q:return n[(e-1)*4+2];case t.H:return n[(e-1)*4+3];default:return}},e.getTotalCodewordsCount=function(e,n){switch(n){case t.L:return r[(e-1)*4+0];case t.M:return r[(e-1)*4+1];case t.Q:return r[(e-1)*4+2];case t.H:return r[(e-1)*4+3];default:return}}})),nm=n((e=>{var t=new Uint8Array(512),n=new Uint8Array(256);(function(){let e=1;for(let r=0;r<255;r++)t[r]=e,n[e]=r,e<<=1,e&256&&(e^=285);for(let e=255;e<512;e++)t[e]=t[e-255]})(),e.log=function(e){if(e<1)throw Error(`log(`+e+`)`);return n[e]},e.exp=function(e){return t[e]},e.mul=function(e,r){return e===0||r===0?0:t[n[e]+n[r]]}})),rm=n((e=>{var t=nm();e.mul=function(e,n){let r=new Uint8Array(e.length+n.length-1);for(let i=0;i<e.length;i++)for(let a=0;a<n.length;a++)r[i+a]^=t.mul(e[i],n[a]);return r},e.mod=function(e,n){let r=new Uint8Array(e);for(;r.length-n.length>=0;){let e=r[0];for(let i=0;i<n.length;i++)r[i]^=t.mul(n[i],e);let i=0;for(;i<r.length&&r[i]===0;)i++;r=r.slice(i)}return r},e.generateECPolynomial=function(n){let r=new Uint8Array([1]);for(let i=0;i<n;i++)r=e.mul(r,new Uint8Array([1,t.exp(i)]));return r}})),im=n(((e,t)=>{var n=rm();function r(e){this.genPoly=void 0,this.degree=e,this.degree&&this.initialize(this.degree)}r.prototype.initialize=function(e){this.degree=e,this.genPoly=n.generateECPolynomial(this.degree)},r.prototype.encode=function(e){if(!this.genPoly)throw Error(`Encoder not initialized`);let t=new Uint8Array(e.length+this.degree);t.set(e);let r=n.mod(t,this.genPoly),i=this.degree-r.length;if(i>0){let e=new Uint8Array(this.degree);return e.set(r,i),e}return r},t.exports=r})),am=n((e=>{e.isValid=function(e){return!isNaN(e)&&e>=1&&e<=40}})),om=n((e=>{var t=`[0-9]+`,n=`[A-Z $%*+\\-./:]+`,r=`(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+`;r=r.replace(/u/g,`\\u`);var i=`(?:(?![A-Z0-9 $%*+\\-./:]|`+r+`)(?:.|[\r
]))+`;e.KANJI=new RegExp(r,`g`),e.BYTE_KANJI=RegExp(`[^A-Z0-9 $%*+\\-./:]+`,`g`),e.BYTE=new RegExp(i,`g`),e.NUMERIC=new RegExp(t,`g`),e.ALPHANUMERIC=new RegExp(n,`g`);var a=RegExp(`^`+r+`$`),o=RegExp(`^[0-9]+$`),s=RegExp(`^[A-Z0-9 $%*+\\-./:]+$`);e.testKanji=function(e){return a.test(e)},e.testNumeric=function(e){return o.test(e)},e.testAlphanumeric=function(e){return s.test(e)}})),sm=n((e=>{var t=am(),n=om();e.NUMERIC={id:`Numeric`,bit:1,ccBits:[10,12,14]},e.ALPHANUMERIC={id:`Alphanumeric`,bit:2,ccBits:[9,11,13]},e.BYTE={id:`Byte`,bit:4,ccBits:[8,16,16]},e.KANJI={id:`Kanji`,bit:8,ccBits:[8,10,12]},e.MIXED={bit:-1},e.getCharCountIndicator=function(e,n){if(!e.ccBits)throw Error(`Invalid mode: `+e);if(!t.isValid(n))throw Error(`Invalid version: `+n);return n>=1&&n<10?e.ccBits[0]:n<27?e.ccBits[1]:e.ccBits[2]},e.getBestModeForData=function(t){return n.testNumeric(t)?e.NUMERIC:n.testAlphanumeric(t)?e.ALPHANUMERIC:n.testKanji(t)?e.KANJI:e.BYTE},e.toString=function(e){if(e&&e.id)return e.id;throw Error(`Invalid mode`)},e.isValid=function(e){return e&&e.bit&&e.ccBits};function r(t){if(typeof t!=`string`)throw Error(`Param is not a string`);switch(t.toLowerCase()){case`numeric`:return e.NUMERIC;case`alphanumeric`:return e.ALPHANUMERIC;case`kanji`:return e.KANJI;case`byte`:return e.BYTE;default:throw Error(`Unknown mode: `+t)}}e.from=function(t,n){if(e.isValid(t))return t;try{return r(t)}catch{return n}}})),cm=n((e=>{var t=Jp(),n=tm(),r=Yp(),i=sm(),a=am(),o=7973,s=t.getBCHDigit(o);function c(t,n,r){for(let i=1;i<=40;i++)if(n<=e.getCapacity(i,r,t))return i}function l(e,t){return i.getCharCountIndicator(e,t)+4}function u(e,t){let n=0;return e.forEach(function(e){let r=l(e.mode,t);n+=r+e.getBitsLength()}),n}function d(t,n){for(let r=1;r<=40;r++)if(u(t,r)<=e.getCapacity(r,n,i.MIXED))return r}e.from=function(e,t){return a.isValid(e)?parseInt(e,10):t},e.getCapacity=function(e,r,o){if(!a.isValid(e))throw Error(`Invalid QR Code version`);o===void 0&&(o=i.BYTE);let s=(t.getSymbolTotalCodewords(e)-n.getTotalCodewordsCount(e,r))*8;if(o===i.MIXED)return s;let c=s-l(o,e);switch(o){case i.NUMERIC:return Math.floor(c/10*3);case i.ALPHANUMERIC:return Math.floor(c/11*2);case i.KANJI:return Math.floor(c/13);case i.BYTE:default:return Math.floor(c/8)}},e.getBestVersionForData=function(e,t){let n,i=r.from(t,r.M);if(Array.isArray(e)){if(e.length>1)return d(e,i);if(e.length===0)return 1;n=e[0]}else n=e;return c(n.mode,n.getLength(),i)},e.getEncodedBits=function(e){if(!a.isValid(e)||e<7)throw Error(`Invalid QR Code version`);let n=e<<12;for(;t.getBCHDigit(n)-s>=0;)n^=o<<t.getBCHDigit(n)-s;return e<<12|n}})),lm=n((e=>{var t=Jp(),n=1335,r=21522,i=t.getBCHDigit(n);e.getEncodedBits=function(e,a){let o=e.bit<<3|a,s=o<<10;for(;t.getBCHDigit(s)-i>=0;)s^=n<<t.getBCHDigit(s)-i;return(o<<10|s)^r}})),um=n(((e,t)=>{var n=sm();function r(e){this.mode=n.NUMERIC,this.data=e.toString()}r.getBitsLength=function(e){return 10*Math.floor(e/3)+(e%3?e%3*3+1:0)},r.prototype.getLength=function(){return this.data.length},r.prototype.getBitsLength=function(){return r.getBitsLength(this.data.length)},r.prototype.write=function(e){let t,n,r;for(t=0;t+3<=this.data.length;t+=3)n=this.data.substr(t,3),r=parseInt(n,10),e.put(r,10);let i=this.data.length-t;i>0&&(n=this.data.substr(t),r=parseInt(n,10),e.put(r,i*3+1))},t.exports=r})),dm=n(((e,t)=>{var n=sm(),r=`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:`.split(``);function i(e){this.mode=n.ALPHANUMERIC,this.data=e}i.getBitsLength=function(e){return 11*Math.floor(e/2)+e%2*6},i.prototype.getLength=function(){return this.data.length},i.prototype.getBitsLength=function(){return i.getBitsLength(this.data.length)},i.prototype.write=function(e){let t;for(t=0;t+2<=this.data.length;t+=2){let n=r.indexOf(this.data[t])*45;n+=r.indexOf(this.data[t+1]),e.put(n,11)}this.data.length%2&&e.put(r.indexOf(this.data[t]),6)},t.exports=i})),fm=n(((e,t)=>{var n=sm();function r(e){this.mode=n.BYTE,typeof e==`string`?this.data=new TextEncoder().encode(e):this.data=new Uint8Array(e)}r.getBitsLength=function(e){return e*8},r.prototype.getLength=function(){return this.data.length},r.prototype.getBitsLength=function(){return r.getBitsLength(this.data.length)},r.prototype.write=function(e){for(let t=0,n=this.data.length;t<n;t++)e.put(this.data[t],8)},t.exports=r})),pm=n(((e,t)=>{var n=sm(),r=Jp();function i(e){this.mode=n.KANJI,this.data=e}i.getBitsLength=function(e){return e*13},i.prototype.getLength=function(){return this.data.length},i.prototype.getBitsLength=function(){return i.getBitsLength(this.data.length)},i.prototype.write=function(e){let t;for(t=0;t<this.data.length;t++){let n=r.toSJIS(this.data[t]);if(n>=33088&&n<=40956)n-=33088;else if(n>=57408&&n<=60351)n-=49472;else throw Error(`Invalid SJIS character: `+this.data[t]+`
Make sure your charset is UTF-8`);n=(n>>>8&255)*192+(n&255),e.put(n,13)}},t.exports=i})),mm=n(((e,t)=>{var n={single_source_shortest_paths:function(e,t,r){var i={},a={};a[t]=0;var o=n.PriorityQueue.make();o.push(t,0);for(var s,c,l,u,d,f,p,m,h;!o.empty();)for(l in s=o.pop(),c=s.value,u=s.cost,d=e[c]||{},d)d.hasOwnProperty(l)&&(f=d[l],p=u+f,m=a[l],h=a[l]===void 0,(h||m>p)&&(a[l]=p,o.push(l,p),i[l]=c));if(r!==void 0&&a[r]===void 0){var g=[`Could not find a path from `,t,` to `,r,`.`].join(``);throw Error(g)}return i},extract_shortest_path_from_predecessor_list:function(e,t){for(var n=[],r=t;r;)n.push(r),e[r],r=e[r];return n.reverse(),n},find_path:function(e,t,r){var i=n.single_source_shortest_paths(e,t,r);return n.extract_shortest_path_from_predecessor_list(i,r)},PriorityQueue:{make:function(e){var t=n.PriorityQueue,r={},i;for(i in e||={},t)t.hasOwnProperty(i)&&(r[i]=t[i]);return r.queue=[],r.sorter=e.sorter||t.default_sorter,r},default_sorter:function(e,t){return e.cost-t.cost},push:function(e,t){var n={value:e,cost:t};this.queue.push(n),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};t!==void 0&&(t.exports=n)})),hm=n((e=>{var t=sm(),n=um(),r=dm(),i=fm(),a=pm(),o=om(),s=Jp(),c=mm();function l(e){return unescape(encodeURIComponent(e)).length}function u(e,t,n){let r=[],i;for(;(i=e.exec(n))!==null;)r.push({data:i[0],index:i.index,mode:t,length:i[0].length});return r}function d(e){let n=u(o.NUMERIC,t.NUMERIC,e),r=u(o.ALPHANUMERIC,t.ALPHANUMERIC,e),i,a;return s.isKanjiModeEnabled()?(i=u(o.BYTE,t.BYTE,e),a=u(o.KANJI,t.KANJI,e)):(i=u(o.BYTE_KANJI,t.BYTE,e),a=[]),n.concat(r,i,a).sort(function(e,t){return e.index-t.index}).map(function(e){return{data:e.data,mode:e.mode,length:e.length}})}function f(e,o){switch(o){case t.NUMERIC:return n.getBitsLength(e);case t.ALPHANUMERIC:return r.getBitsLength(e);case t.KANJI:return a.getBitsLength(e);case t.BYTE:return i.getBitsLength(e)}}function p(e){return e.reduce(function(e,t){let n=e.length-1>=0?e[e.length-1]:null;return n&&n.mode===t.mode?(e[e.length-1].data+=t.data,e):(e.push(t),e)},[])}function m(e){let n=[];for(let r=0;r<e.length;r++){let i=e[r];switch(i.mode){case t.NUMERIC:n.push([i,{data:i.data,mode:t.ALPHANUMERIC,length:i.length},{data:i.data,mode:t.BYTE,length:i.length}]);break;case t.ALPHANUMERIC:n.push([i,{data:i.data,mode:t.BYTE,length:i.length}]);break;case t.KANJI:n.push([i,{data:i.data,mode:t.BYTE,length:l(i.data)}]);break;case t.BYTE:n.push([{data:i.data,mode:t.BYTE,length:l(i.data)}])}}return n}function h(e,n){let r={},i={start:{}},a=[`start`];for(let o=0;o<e.length;o++){let s=e[o],c=[];for(let e=0;e<s.length;e++){let l=s[e],u=``+o+e;c.push(u),r[u]={node:l,lastCount:0},i[u]={};for(let e=0;e<a.length;e++){let o=a[e];r[o]&&r[o].node.mode===l.mode?(i[o][u]=f(r[o].lastCount+l.length,l.mode)-f(r[o].lastCount,l.mode),r[o].lastCount+=l.length):(r[o]&&(r[o].lastCount=l.length),i[o][u]=f(l.length,l.mode)+4+t.getCharCountIndicator(l.mode,n))}}a=c}for(let e=0;e<a.length;e++)i[a[e]].end=0;return{map:i,table:r}}function g(e,o){let c,l=t.getBestModeForData(e);if(c=t.from(o,l),c!==t.BYTE&&c.bit<l.bit)throw Error(`"`+e+`" cannot be encoded with mode `+t.toString(c)+`.
 Suggested mode is: `+t.toString(l));switch(c===t.KANJI&&!s.isKanjiModeEnabled()&&(c=t.BYTE),c){case t.NUMERIC:return new n(e);case t.ALPHANUMERIC:return new r(e);case t.KANJI:return new a(e);case t.BYTE:return new i(e)}}e.fromArray=function(e){return e.reduce(function(e,t){return typeof t==`string`?e.push(g(t,null)):t.data&&e.push(g(t.data,t.mode)),e},[])},e.fromString=function(t,n){let r=h(m(d(t,s.isKanjiModeEnabled())),n),i=c.find_path(r.map,`start`,`end`),a=[];for(let e=1;e<i.length-1;e++)a.push(r.table[i[e]].node);return e.fromArray(p(a))},e.rawSplit=function(t){return e.fromArray(d(t,s.isKanjiModeEnabled()))}})),gm=n((e=>{var t=Jp(),n=Yp(),r=Xp(),i=Zp(),a=Qp(),o=$p(),s=em(),c=tm(),l=im(),u=cm(),d=lm(),f=sm(),p=hm();function m(e,t){let n=e.size,r=o.getPositions(t);for(let t=0;t<r.length;t++){let i=r[t][0],a=r[t][1];for(let t=-1;t<=7;t++)if(!(i+t<=-1||n<=i+t))for(let r=-1;r<=7;r++)a+r<=-1||n<=a+r||(t>=0&&t<=6&&(r===0||r===6)||r>=0&&r<=6&&(t===0||t===6)||t>=2&&t<=4&&r>=2&&r<=4?e.set(i+t,a+r,!0,!0):e.set(i+t,a+r,!1,!0))}}function h(e){let t=e.size;for(let n=8;n<t-8;n++){let t=n%2==0;e.set(n,6,t,!0),e.set(6,n,t,!0)}}function g(e,t){let n=a.getPositions(t);for(let t=0;t<n.length;t++){let r=n[t][0],i=n[t][1];for(let t=-2;t<=2;t++)for(let n=-2;n<=2;n++)t===-2||t===2||n===-2||n===2||t===0&&n===0?e.set(r+t,i+n,!0,!0):e.set(r+t,i+n,!1,!0)}}function _(e,t){let n=e.size,r=u.getEncodedBits(t),i,a,o;for(let t=0;t<18;t++)i=Math.floor(t/3),a=t%3+n-8-3,o=(r>>t&1)==1,e.set(i,a,o,!0),e.set(a,i,o,!0)}function v(e,t,n){let r=e.size,i=d.getEncodedBits(t,n),a,o;for(a=0;a<15;a++)o=(i>>a&1)==1,a<6?e.set(a,8,o,!0):a<8?e.set(a+1,8,o,!0):e.set(r-15+a,8,o,!0),a<8?e.set(8,r-a-1,o,!0):a<9?e.set(8,15-a-1+1,o,!0):e.set(8,15-a-1,o,!0);e.set(r-8,8,1,!0)}function y(e,t){let n=e.size,r=-1,i=n-1,a=7,o=0;for(let s=n-1;s>0;s-=2)for(s===6&&s--;;){for(let n=0;n<2;n++)if(!e.isReserved(i,s-n)){let r=!1;o<t.length&&(r=(t[o]>>>a&1)==1),e.set(i,s-n,r),a--,a===-1&&(o++,a=7)}if(i+=r,i<0||n<=i){i-=r,r=-r;break}}}function b(e,n,i){let a=new r;i.forEach(function(t){a.put(t.mode.bit,4),a.put(t.getLength(),f.getCharCountIndicator(t.mode,e)),t.write(a)});let o=(t.getSymbolTotalCodewords(e)-c.getTotalCodewordsCount(e,n))*8;for(a.getLengthInBits()+4<=o&&a.put(0,4);a.getLengthInBits()%8!=0;)a.putBit(0);let s=(o-a.getLengthInBits())/8;for(let e=0;e<s;e++)a.put(e%2?17:236,8);return x(a,e,n)}function x(e,n,r){let i=t.getSymbolTotalCodewords(n),a=i-c.getTotalCodewordsCount(n,r),o=c.getBlocksCount(n,r),s=o-i%o,u=Math.floor(i/o),d=Math.floor(a/o),f=d+1,p=u-d,m=new l(p),h=0,g=Array(o),_=Array(o),v=0,y=new Uint8Array(e.buffer);for(let e=0;e<o;e++){let t=e<s?d:f;g[e]=y.slice(h,h+t),_[e]=m.encode(g[e]),h+=t,v=Math.max(v,t)}let b=new Uint8Array(i),x=0,S,C;for(S=0;S<v;S++)for(C=0;C<o;C++)S<g[C].length&&(b[x++]=g[C][S]);for(S=0;S<p;S++)for(C=0;C<o;C++)b[x++]=_[C][S];return b}function S(e,n,r,a){let o;if(Array.isArray(e))o=p.fromArray(e);else if(typeof e==`string`){let t=n;if(!t){let n=p.rawSplit(e);t=u.getBestVersionForData(n,r)}o=p.fromString(e,t||40)}else throw Error(`Invalid data`);let c=u.getBestVersionForData(o,r);if(!c)throw Error(`The amount of data is too big to be stored in a QR Code`);if(!n)n=c;else if(n<c)throw Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+c+`.
`);let l=b(n,r,o),d=new i(t.getSymbolSize(n));return m(d,n),h(d),g(d,n),v(d,r,0),n>=7&&_(d,n),y(d,l),isNaN(a)&&(a=s.getBestMask(d,v.bind(null,d,r))),s.applyMask(a,d),v(d,r,a),{modules:d,version:n,errorCorrectionLevel:r,maskPattern:a,segments:o}}e.create=function(e,r){if(e===void 0||e===``)throw Error(`No input text`);let i=n.M,a,o;return r!==void 0&&(i=n.from(r.errorCorrectionLevel,n.M),a=u.from(r.version),o=s.from(r.maskPattern),r.toSJISFunc&&t.setToSJISFunction(r.toSJISFunc)),S(e,a,i,o)}})),_m=n((e=>{function t(e){if(typeof e==`number`&&(e=e.toString()),typeof e!=`string`)throw Error(`Color should be defined as hex string`);let t=e.slice().replace(`#`,``).split(``);if(t.length<3||t.length===5||t.length>8)throw Error(`Invalid hex color: `+e);(t.length===3||t.length===4)&&(t=Array.prototype.concat.apply([],t.map(function(e){return[e,e]}))),t.length===6&&t.push(`F`,`F`);let n=parseInt(t.join(``),16);return{r:n>>24&255,g:n>>16&255,b:n>>8&255,a:n&255,hex:`#`+t.slice(0,6).join(``)}}e.getOptions=function(e){e||={},e.color||={};let n=e.margin===void 0||e.margin===null||e.margin<0?4:e.margin,r=e.width&&e.width>=21?e.width:void 0,i=e.scale||4;return{width:r,scale:r?4:i,margin:n,color:{dark:t(e.color.dark||`#000000ff`),light:t(e.color.light||`#ffffffff`)},type:e.type,rendererOpts:e.rendererOpts||{}}},e.getScale=function(e,t){return t.width&&t.width>=e+t.margin*2?t.width/(e+t.margin*2):t.scale},e.getImageWidth=function(t,n){let r=e.getScale(t,n);return Math.floor((t+n.margin*2)*r)},e.qrToImageData=function(t,n,r){let i=n.modules.size,a=n.modules.data,o=e.getScale(i,r),s=Math.floor((i+r.margin*2)*o),c=r.margin*o,l=[r.color.light,r.color.dark];for(let e=0;e<s;e++)for(let n=0;n<s;n++){let u=(e*s+n)*4,d=r.color.light;if(e>=c&&n>=c&&e<s-c&&n<s-c){let t=Math.floor((e-c)/o),r=Math.floor((n-c)/o);d=l[+!!a[t*i+r]]}t[u++]=d.r,t[u++]=d.g,t[u++]=d.b,t[u]=d.a}}})),vm=n((e=>{var t=_m();function n(e,t,n){e.clearRect(0,0,t.width,t.height),t.style||={},t.height=n,t.width=n,t.style.height=n+`px`,t.style.width=n+`px`}function r(){try{return document.createElement(`canvas`)}catch{throw Error(`You need to specify a canvas element`)}}e.render=function(e,i,a){let o=a,s=i;o===void 0&&(!i||!i.getContext)&&(o=i,i=void 0),i||(s=r()),o=t.getOptions(o);let c=t.getImageWidth(e.modules.size,o),l=s.getContext(`2d`),u=l.createImageData(c,c);return t.qrToImageData(u.data,e,o),n(l,s,c),l.putImageData(u,0,0),s},e.renderToDataURL=function(t,n,r){let i=r;i===void 0&&(!n||!n.getContext)&&(i=n,n=void 0),i||={};let a=e.render(t,n,i),o=i.type||`image/png`,s=i.rendererOpts||{};return a.toDataURL(o,s.quality)}})),ym=n((e=>{var t=_m();function n(e,t){let n=e.a/255,r=t+`="`+e.hex+`"`;return n<1?r+` `+t+`-opacity="`+n.toFixed(2).slice(1)+`"`:r}function r(e,t,n){let r=e+t;return n!==void 0&&(r+=` `+n),r}function i(e,t,n){let i=``,a=0,o=!1,s=0;for(let c=0;c<e.length;c++){let l=Math.floor(c%t),u=Math.floor(c/t);!l&&!o&&(o=!0),e[c]?(s++,c>0&&l>0&&e[c-1]||(i+=o?r(`M`,l+n,.5+u+n):r(`m`,a,0),a=0,o=!1),l+1<t&&e[c+1]||(i+=r(`h`,s),s=0)):a++}return i}e.render=function(e,r,a){let o=t.getOptions(r),s=e.modules.size,c=e.modules.data,l=s+o.margin*2,u=o.color.light.a?`<path `+n(o.color.light,`fill`)+` d="M0 0h`+l+`v`+l+`H0z"/>`:``,d=`<path `+n(o.color.dark,`stroke`)+` d="`+i(c,s,o.margin)+`"/>`,f=`viewBox="0 0 `+l+` `+l+`"`,p=`<svg xmlns="http://www.w3.org/2000/svg" `+(o.width?`width="`+o.width+`" height="`+o.width+`" `:``)+f+` shape-rendering="crispEdges">`+u+d+`</svg>
`;return typeof a==`function`&&a(null,p),p}})),bm=n((e=>{var t=qp(),n=gm(),r=vm(),i=ym();function a(e,r,i,a,o){let s=[].slice.call(arguments,1),c=s.length,l=typeof s[c-1]==`function`;if(!l&&!t())throw Error(`Callback required as last argument`);if(l){if(c<2)throw Error(`Too few arguments provided`);c===2?(o=i,i=r,r=a=void 0):c===3&&(r.getContext&&o===void 0?(o=a,a=void 0):(o=a,a=i,i=r,r=void 0))}else{if(c<1)throw Error(`Too few arguments provided`);return c===1?(i=r,r=a=void 0):c===2&&!r.getContext&&(a=i,i=r,r=void 0),new Promise(function(t,o){try{t(e(n.create(i,a),r,a))}catch(e){o(e)}})}try{let t=n.create(i,a);o(null,e(t,r,a))}catch(e){o(e)}}e.create=n.create,e.toCanvas=a.bind(null,r.render),e.toDataURL=a.bind(null,r.renderToDataURL),e.toString=a.bind(null,function(e,t,n){return i.render(e,n)})})),xm=n(((e,t)=>{(function(n,r){typeof e==`object`&&typeof t==`object`?t.exports=r():typeof define==`function`&&define.amd?define([],r):typeof e==`object`?e.jsQR=r():n.jsQR=r()})(typeof self<`u`?self:e,function(){return(function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,`a`,t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p=``,n(n.s=3)})([(function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.BitMatrix=function(){function e(e,t){this.width=t,this.height=e.length/t,this.data=e}return e.createEmpty=function(t,n){return new e(new Uint8ClampedArray(t*n),t)},e.prototype.get=function(e,t){return e<0||e>=this.width||t<0||t>=this.height?!1:!!this.data[t*this.width+e]},e.prototype.set=function(e,t,n){this.data[t*this.width+e]=+!!n},e.prototype.setRegion=function(e,t,n,r,i){for(var a=t;a<t+r;a++)for(var o=e;o<e+n;o++)this.set(o,a,!!i)},e}()}),(function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0});var r=n(2);function i(e,t){return e^t}t.addOrSubtractGF=i,t.default=function(){function e(e,t,n){this.primitive=e,this.size=t,this.generatorBase=n,this.expTable=Array(this.size),this.logTable=Array(this.size);for(var i=1,a=0;a<this.size;a++)this.expTable[a]=i,i*=2,i>=this.size&&(i=(i^this.primitive)&this.size-1);for(var a=0;a<this.size-1;a++)this.logTable[this.expTable[a]]=a;this.zero=new r.default(this,Uint8ClampedArray.from([0])),this.one=new r.default(this,Uint8ClampedArray.from([1]))}return e.prototype.multiply=function(e,t){return e===0||t===0?0:this.expTable[(this.logTable[e]+this.logTable[t])%(this.size-1)]},e.prototype.inverse=function(e){if(e===0)throw Error(`Can't invert 0`);return this.expTable[this.size-this.logTable[e]-1]},e.prototype.buildMonomial=function(e,t){if(e<0)throw Error(`Invalid monomial degree less than 0`);if(t===0)return this.zero;var n=new Uint8ClampedArray(e+1);return n[0]=t,new r.default(this,n)},e.prototype.log=function(e){if(e===0)throw Error(`Can't take log(0)`);return this.logTable[e]},e.prototype.exp=function(e){return this.expTable[e]},e}()}),(function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0});var r=n(1);t.default=function(){function e(e,t){if(t.length===0)throw Error(`No coefficients.`);this.field=e;var n=t.length;if(n>1&&t[0]===0){for(var r=1;r<n&&t[r]===0;)r++;if(r===n)this.coefficients=e.zero.coefficients;else{this.coefficients=new Uint8ClampedArray(n-r);for(var i=0;i<this.coefficients.length;i++)this.coefficients[i]=t[r+i]}}else this.coefficients=t}return e.prototype.degree=function(){return this.coefficients.length-1},e.prototype.isZero=function(){return this.coefficients[0]===0},e.prototype.getCoefficient=function(e){return this.coefficients[this.coefficients.length-1-e]},e.prototype.addOrSubtract=function(t){var n;if(this.isZero())return t;if(t.isZero())return this;var i=this.coefficients,a=t.coefficients;i.length>a.length&&(n=[a,i],i=n[0],a=n[1]);for(var o=new Uint8ClampedArray(a.length),s=a.length-i.length,c=0;c<s;c++)o[c]=a[c];for(var c=s;c<a.length;c++)o[c]=r.addOrSubtractGF(i[c-s],a[c]);return new e(this.field,o)},e.prototype.multiply=function(t){if(t===0)return this.field.zero;if(t===1)return this;for(var n=this.coefficients.length,r=new Uint8ClampedArray(n),i=0;i<n;i++)r[i]=this.field.multiply(this.coefficients[i],t);return new e(this.field,r)},e.prototype.multiplyPoly=function(t){if(this.isZero()||t.isZero())return this.field.zero;for(var n=this.coefficients,i=n.length,a=t.coefficients,o=a.length,s=new Uint8ClampedArray(i+o-1),c=0;c<i;c++)for(var l=n[c],u=0;u<o;u++)s[c+u]=r.addOrSubtractGF(s[c+u],this.field.multiply(l,a[u]));return new e(this.field,s)},e.prototype.multiplyByMonomial=function(t,n){if(t<0)throw Error(`Invalid degree less than 0`);if(n===0)return this.field.zero;for(var r=this.coefficients.length,i=new Uint8ClampedArray(r+t),a=0;a<r;a++)i[a]=this.field.multiply(this.coefficients[a],n);return new e(this.field,i)},e.prototype.evaluateAt=function(e){var t=0;if(e===0)return this.getCoefficient(0);var n=this.coefficients.length;if(e===1)return this.coefficients.forEach(function(e){t=r.addOrSubtractGF(t,e)}),t;t=this.coefficients[0];for(var i=1;i<n;i++)t=r.addOrSubtractGF(this.field.multiply(e,t),this.coefficients[i]);return t},e}()}),(function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0});var r=n(4),i=n(5),a=n(11),o=n(12);function s(e){var t=o.locate(e);if(!t)return null;for(var n=0,r=t;n<r.length;n++){var s=r[n],c=a.extract(e,s),l=i.decode(c.matrix);if(l)return{binaryData:l.bytes,data:l.text,chunks:l.chunks,version:l.version,location:{topRightCorner:c.mappingFunction(s.dimension,0),topLeftCorner:c.mappingFunction(0,0),bottomRightCorner:c.mappingFunction(s.dimension,s.dimension),bottomLeftCorner:c.mappingFunction(0,s.dimension),topRightFinderPattern:s.topRight,topLeftFinderPattern:s.topLeft,bottomLeftFinderPattern:s.bottomLeft,bottomRightAlignmentPattern:s.alignmentPattern}}}return null}var c={inversionAttempts:`attemptBoth`};function l(e,t,n,i){i===void 0&&(i={});var a=c;Object.keys(a||{}).forEach(function(e){a[e]=i[e]||a[e]});var o=a.inversionAttempts===`attemptBoth`||a.inversionAttempts===`invertFirst`,l=a.inversionAttempts===`onlyInvert`||a.inversionAttempts===`invertFirst`,u=r.binarize(e,t,n,o),d=u.binarized,f=u.inverted,p=s(l?f:d);return!p&&(a.inversionAttempts===`attemptBoth`||a.inversionAttempts===`invertFirst`)&&(p=s(l?d:f)),p}l.default=l,t.default=l}),(function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0});var r=n(0),i=8,a=24;function o(e,t,n){return e<t?t:e>n?n:e}var s=function(){function e(e,t){this.width=e,this.data=new Uint8ClampedArray(e*t)}return e.prototype.get=function(e,t){return this.data[t*this.width+e]},e.prototype.set=function(e,t,n){this.data[t*this.width+e]=n},e}();function c(e,t,n,c){if(e.length!==t*n*4)throw Error(`Malformed data passed to binarizer.`);for(var l=new s(t,n),u=0;u<t;u++)for(var d=0;d<n;d++){var f=e[(d*t+u)*4+0],p=e[(d*t+u)*4+1],m=e[(d*t+u)*4+2];l.set(u,d,.2126*f+.7152*p+.0722*m)}for(var h=Math.ceil(t/i),g=Math.ceil(n/i),_=new s(h,g),v=0;v<g;v++)for(var y=0;y<h;y++){for(var b=0,x=1/0,S=0,d=0;d<i;d++)for(var u=0;u<i;u++){var C=l.get(y*i+u,v*i+d);b+=C,x=Math.min(x,C),S=Math.max(S,C)}var w=b/i**2;if(S-x<=a&&(w=x/2,v>0&&y>0)){var T=(_.get(y,v-1)+2*_.get(y-1,v)+_.get(y-1,v-1))/4;x<T&&(w=T)}_.set(y,v,w)}var E=r.BitMatrix.createEmpty(t,n),D=null;c&&(D=r.BitMatrix.createEmpty(t,n));for(var v=0;v<g;v++)for(var y=0;y<h;y++){for(var O=o(y,2,h-3),k=o(v,2,g-3),b=0,A=-2;A<=2;A++)for(var j=-2;j<=2;j++)b+=_.get(O+A,k+j);for(var M=b/25,A=0;A<i;A++)for(var j=0;j<i;j++){var u=y*i+A,d=v*i+j,N=l.get(u,d);E.set(u,d,N<=M),c&&D.set(u,d,!(N<=M))}}return c?{binarized:E,inverted:D}:{binarized:E}}t.binarize=c}),(function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0});var r=n(0),i=n(6),a=n(9),o=n(10);function s(e,t){for(var n=e^t,r=0;n;)r++,n&=n-1;return r}function c(e,t){return t<<1|e}var l=[{bits:21522,formatInfo:{errorCorrectionLevel:1,dataMask:0}},{bits:20773,formatInfo:{errorCorrectionLevel:1,dataMask:1}},{bits:24188,formatInfo:{errorCorrectionLevel:1,dataMask:2}},{bits:23371,formatInfo:{errorCorrectionLevel:1,dataMask:3}},{bits:17913,formatInfo:{errorCorrectionLevel:1,dataMask:4}},{bits:16590,formatInfo:{errorCorrectionLevel:1,dataMask:5}},{bits:20375,formatInfo:{errorCorrectionLevel:1,dataMask:6}},{bits:19104,formatInfo:{errorCorrectionLevel:1,dataMask:7}},{bits:30660,formatInfo:{errorCorrectionLevel:0,dataMask:0}},{bits:29427,formatInfo:{errorCorrectionLevel:0,dataMask:1}},{bits:32170,formatInfo:{errorCorrectionLevel:0,dataMask:2}},{bits:30877,formatInfo:{errorCorrectionLevel:0,dataMask:3}},{bits:26159,formatInfo:{errorCorrectionLevel:0,dataMask:4}},{bits:25368,formatInfo:{errorCorrectionLevel:0,dataMask:5}},{bits:27713,formatInfo:{errorCorrectionLevel:0,dataMask:6}},{bits:26998,formatInfo:{errorCorrectionLevel:0,dataMask:7}},{bits:5769,formatInfo:{errorCorrectionLevel:3,dataMask:0}},{bits:5054,formatInfo:{errorCorrectionLevel:3,dataMask:1}},{bits:7399,formatInfo:{errorCorrectionLevel:3,dataMask:2}},{bits:6608,formatInfo:{errorCorrectionLevel:3,dataMask:3}},{bits:1890,formatInfo:{errorCorrectionLevel:3,dataMask:4}},{bits:597,formatInfo:{errorCorrectionLevel:3,dataMask:5}},{bits:3340,formatInfo:{errorCorrectionLevel:3,dataMask:6}},{bits:2107,formatInfo:{errorCorrectionLevel:3,dataMask:7}},{bits:13663,formatInfo:{errorCorrectionLevel:2,dataMask:0}},{bits:12392,formatInfo:{errorCorrectionLevel:2,dataMask:1}},{bits:16177,formatInfo:{errorCorrectionLevel:2,dataMask:2}},{bits:14854,formatInfo:{errorCorrectionLevel:2,dataMask:3}},{bits:9396,formatInfo:{errorCorrectionLevel:2,dataMask:4}},{bits:8579,formatInfo:{errorCorrectionLevel:2,dataMask:5}},{bits:11994,formatInfo:{errorCorrectionLevel:2,dataMask:6}},{bits:11245,formatInfo:{errorCorrectionLevel:2,dataMask:7}}],u=[function(e){return(e.y+e.x)%2==0},function(e){return e.y%2==0},function(e){return e.x%3==0},function(e){return(e.y+e.x)%3==0},function(e){return(Math.floor(e.y/2)+Math.floor(e.x/3))%2==0},function(e){return e.x*e.y%2+e.x*e.y%3==0},function(e){return(e.y*e.x%2+e.y*e.x%3)%2==0},function(e){return((e.y+e.x)%2+e.y*e.x%3)%2==0}];function d(e){var t=17+4*e.versionNumber,n=r.BitMatrix.createEmpty(t,t);n.setRegion(0,0,9,9,!0),n.setRegion(t-8,0,8,9,!0),n.setRegion(0,t-8,9,8,!0);for(var i=0,a=e.alignmentPatternCenters;i<a.length;i++)for(var o=a[i],s=0,c=e.alignmentPatternCenters;s<c.length;s++){var l=c[s];o===6&&l===6||o===6&&l===t-7||o===t-7&&l===6||n.setRegion(o-2,l-2,5,5,!0)}return n.setRegion(6,9,1,t-17,!0),n.setRegion(9,6,t-17,1,!0),e.versionNumber>6&&(n.setRegion(t-11,0,3,6,!0),n.setRegion(0,t-11,6,3,!0)),n}function f(e,t,n){for(var r=u[n.dataMask],i=e.height,a=d(t),o=[],s=0,l=0,f=!0,p=i-1;p>0;p-=2){p===6&&p--;for(var m=0;m<i;m++)for(var h=f?i-1-m:m,g=0;g<2;g++){var _=p-g;if(!a.get(_,h)){l++;var v=e.get(_,h);r({y:h,x:_})&&(v=!v),s=c(v,s),l===8&&(o.push(s),l=0,s=0)}}f=!f}return o}function p(e){var t=e.height,n=Math.floor((t-17)/4);if(n<=6)return o.VERSIONS[n-1];for(var r=0,i=5;i>=0;i--)for(var a=t-9;a>=t-11;a--)r=c(e.get(a,i),r);for(var l=0,a=5;a>=0;a--)for(var i=t-9;i>=t-11;i--)l=c(e.get(a,i),l);for(var u=1/0,d,f=0,p=o.VERSIONS;f<p.length;f++){var m=p[f];if(m.infoBits===r||m.infoBits===l)return m;var h=s(r,m.infoBits);h<u&&(d=m,u=h),h=s(l,m.infoBits),h<u&&(d=m,u=h)}if(u<=3)return d}function m(e){for(var t=0,n=0;n<=8;n++)n!==6&&(t=c(e.get(n,8),t));for(var r=7;r>=0;r--)r!==6&&(t=c(e.get(8,r),t));for(var i=e.height,a=0,r=i-1;r>=i-7;r--)a=c(e.get(8,r),a);for(var n=i-8;n<i;n++)a=c(e.get(n,8),a);for(var o=1/0,u=null,d=0,f=l;d<f.length;d++){var p=f[d],m=p.bits,h=p.formatInfo;if(m===t||m===a)return h;var g=s(t,m);g<o&&(u=h,o=g),t!==a&&(g=s(a,m),g<o&&(u=h,o=g))}return o<=3?u:null}function h(e,t,n){var r=t.errorCorrectionLevels[n],i=[],a=0;if(r.ecBlocks.forEach(function(e){for(var t=0;t<e.numBlocks;t++)i.push({numDataCodewords:e.dataCodewordsPerBlock,codewords:[]}),a+=e.dataCodewordsPerBlock+r.ecCodewordsPerBlock}),e.length<a)return null;e=e.slice(0,a);for(var o=r.ecBlocks[0].dataCodewordsPerBlock,s=0;s<o;s++)for(var c=0,l=i;c<l.length;c++){var u=l[c];u.codewords.push(e.shift())}if(r.ecBlocks.length>1)for(var d=r.ecBlocks[0].numBlocks,f=r.ecBlocks[1].numBlocks,s=0;s<f;s++)i[d+s].codewords.push(e.shift());for(;e.length>0;)for(var p=0,m=i;p<m.length;p++){var u=m[p];u.codewords.push(e.shift())}return i}function g(e){var t=p(e);if(!t)return null;var n=m(e);if(!n)return null;var r=h(f(e,t,n),t,n.errorCorrectionLevel);if(!r)return null;for(var o=r.reduce(function(e,t){return e+t.numDataCodewords},0),s=new Uint8ClampedArray(o),c=0,l=0,u=r;l<u.length;l++){var d=u[l],g=a.decode(d.codewords,d.codewords.length-d.numDataCodewords);if(!g)return null;for(var _=0;_<d.numDataCodewords;_++)s[c++]=g[_]}try{return i.decode(s,t.versionNumber)}catch{return null}}function _(e){if(e==null)return null;var t=g(e);if(t)return t;for(var n=0;n<e.width;n++)for(var r=n+1;r<e.height;r++)e.get(n,r)!==e.get(r,n)&&(e.set(n,r,!e.get(n,r)),e.set(r,n,!e.get(r,n)));return g(e)}t.decode=_}),(function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0});var r=n(7),i=n(8),a;(function(e){e.Numeric=`numeric`,e.Alphanumeric=`alphanumeric`,e.Byte=`byte`,e.Kanji=`kanji`,e.ECI=`eci`})(a=t.Mode||={});var o;(function(e){e[e.Terminator=0]=`Terminator`,e[e.Numeric=1]=`Numeric`,e[e.Alphanumeric=2]=`Alphanumeric`,e[e.Byte=4]=`Byte`,e[e.Kanji=8]=`Kanji`,e[e.ECI=7]=`ECI`})(o||={});function s(e,t){for(var n=[],r=``,i=[10,12,14][t],a=e.readBits(i);a>=3;){var o=e.readBits(10);if(o>=1e3)throw Error(`Invalid numeric value above 999`);var s=Math.floor(o/100),c=Math.floor(o/10)%10,l=o%10;n.push(48+s,48+c,48+l),r+=s.toString()+c.toString()+l.toString(),a-=3}if(a===2){var o=e.readBits(7);if(o>=100)throw Error(`Invalid numeric value above 99`);var s=Math.floor(o/10),c=o%10;n.push(48+s,48+c),r+=s.toString()+c.toString()}else if(a===1){var o=e.readBits(4);if(o>=10)throw Error(`Invalid numeric value above 9`);n.push(48+o),r+=o.toString()}return{bytes:n,text:r}}var c=`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:`.split(``);function l(e,t){for(var n=[],r=``,i=[9,11,13][t],a=e.readBits(i);a>=2;){var o=e.readBits(11),s=Math.floor(o/45),l=o%45;n.push(c[s].charCodeAt(0),c[l].charCodeAt(0)),r+=c[s]+c[l],a-=2}if(a===1){var s=e.readBits(6);n.push(c[s].charCodeAt(0)),r+=c[s]}return{bytes:n,text:r}}function u(e,t){for(var n=[],r=``,i=[8,16,16][t],a=e.readBits(i),o=0;o<a;o++){var s=e.readBits(8);n.push(s)}try{r+=decodeURIComponent(n.map(function(e){return`%`+(`0`+e.toString(16)).substr(-2)}).join(``))}catch{}return{bytes:n,text:r}}function d(e,t){for(var n=[],r=``,a=[8,10,12][t],o=e.readBits(a),s=0;s<o;s++){var c=e.readBits(13),l=Math.floor(c/192)<<8|c%192;l<7936?l+=33088:l+=49472,n.push(l>>8,l&255),r+=String.fromCharCode(i.shiftJISTable[l])}return{bytes:n,text:r}}function f(e,t){for(var n,i,c,f,p=new r.BitStream(e),m=t<=9?0:t<=26?1:2,h={text:``,bytes:[],chunks:[],version:t};p.available()>=4;){var g=p.readBits(4);if(g===o.Terminator)return h;if(g===o.ECI)p.readBits(1)===0?h.chunks.push({type:a.ECI,assignmentNumber:p.readBits(7)}):p.readBits(1)===0?h.chunks.push({type:a.ECI,assignmentNumber:p.readBits(14)}):p.readBits(1)===0?h.chunks.push({type:a.ECI,assignmentNumber:p.readBits(21)}):h.chunks.push({type:a.ECI,assignmentNumber:-1});else if(g===o.Numeric){var _=s(p,m);h.text+=_.text,(n=h.bytes).push.apply(n,_.bytes),h.chunks.push({type:a.Numeric,text:_.text})}else if(g===o.Alphanumeric){var v=l(p,m);h.text+=v.text,(i=h.bytes).push.apply(i,v.bytes),h.chunks.push({type:a.Alphanumeric,text:v.text})}else if(g===o.Byte){var y=u(p,m);h.text+=y.text,(c=h.bytes).push.apply(c,y.bytes),h.chunks.push({type:a.Byte,bytes:y.bytes,text:y.text})}else if(g===o.Kanji){var b=d(p,m);h.text+=b.text,(f=h.bytes).push.apply(f,b.bytes),h.chunks.push({type:a.Kanji,bytes:b.bytes,text:b.text})}}if(p.available()===0||p.readBits(p.available())===0)return h}t.decode=f}),(function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.BitStream=function(){function e(e){this.byteOffset=0,this.bitOffset=0,this.bytes=e}return e.prototype.readBits=function(e){if(e<1||e>32||e>this.available())throw Error(`Cannot read `+e.toString()+` bits`);var t=0;if(this.bitOffset>0){var n=8-this.bitOffset,r=e<n?e:n,i=n-r,a=255>>8-r<<i;t=(this.bytes[this.byteOffset]&a)>>i,e-=r,this.bitOffset+=r,this.bitOffset===8&&(this.bitOffset=0,this.byteOffset++)}if(e>0){for(;e>=8;)t=t<<8|this.bytes[this.byteOffset]&255,this.byteOffset++,e-=8;if(e>0){var i=8-e,a=255>>i<<i;t=t<<e|(this.bytes[this.byteOffset]&a)>>i,this.bitOffset+=e}}return t},e.prototype.available=function(){return 8*(this.bytes.length-this.byteOffset)-this.bitOffset},e}()}),(function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.shiftJISTable={32:32,33:33,34:34,35:35,36:36,37:37,38:38,39:39,40:40,41:41,42:42,43:43,44:44,45:45,46:46,47:47,48:48,49:49,50:50,51:51,52:52,53:53,54:54,55:55,56:56,57:57,58:58,59:59,60:60,61:61,62:62,63:63,64:64,65:65,66:66,67:67,68:68,69:69,70:70,71:71,72:72,73:73,74:74,75:75,76:76,77:77,78:78,79:79,80:80,81:81,82:82,83:83,84:84,85:85,86:86,87:87,88:88,89:89,90:90,91:91,92:165,93:93,94:94,95:95,96:96,97:97,98:98,99:99,100:100,101:101,102:102,103:103,104:104,105:105,106:106,107:107,108:108,109:109,110:110,111:111,112:112,113:113,114:114,115:115,116:116,117:117,118:118,119:119,120:120,121:121,122:122,123:123,124:124,125:125,126:8254,33088:12288,33089:12289,33090:12290,33091:65292,33092:65294,33093:12539,33094:65306,33095:65307,33096:65311,33097:65281,33098:12443,33099:12444,33100:180,33101:65344,33102:168,33103:65342,33104:65507,33105:65343,33106:12541,33107:12542,33108:12445,33109:12446,33110:12291,33111:20189,33112:12293,33113:12294,33114:12295,33115:12540,33116:8213,33117:8208,33118:65295,33119:92,33120:12316,33121:8214,33122:65372,33123:8230,33124:8229,33125:8216,33126:8217,33127:8220,33128:8221,33129:65288,33130:65289,33131:12308,33132:12309,33133:65339,33134:65341,33135:65371,33136:65373,33137:12296,33138:12297,33139:12298,33140:12299,33141:12300,33142:12301,33143:12302,33144:12303,33145:12304,33146:12305,33147:65291,33148:8722,33149:177,33150:215,33152:247,33153:65309,33154:8800,33155:65308,33156:65310,33157:8806,33158:8807,33159:8734,33160:8756,33161:9794,33162:9792,33163:176,33164:8242,33165:8243,33166:8451,33167:65509,33168:65284,33169:162,33170:163,33171:65285,33172:65283,33173:65286,33174:65290,33175:65312,33176:167,33177:9734,33178:9733,33179:9675,33180:9679,33181:9678,33182:9671,33183:9670,33184:9633,33185:9632,33186:9651,33187:9650,33188:9661,33189:9660,33190:8251,33191:12306,33192:8594,33193:8592,33194:8593,33195:8595,33196:12307,33208:8712,33209:8715,33210:8838,33211:8839,33212:8834,33213:8835,33214:8746,33215:8745,33224:8743,33225:8744,33226:172,33227:8658,33228:8660,33229:8704,33230:8707,33242:8736,33243:8869,33244:8978,33245:8706,33246:8711,33247:8801,33248:8786,33249:8810,33250:8811,33251:8730,33252:8765,33253:8733,33254:8757,33255:8747,33256:8748,33264:8491,33265:8240,33266:9839,33267:9837,33268:9834,33269:8224,33270:8225,33271:182,33276:9711,33359:65296,33360:65297,33361:65298,33362:65299,33363:65300,33364:65301,33365:65302,33366:65303,33367:65304,33368:65305,33376:65313,33377:65314,33378:65315,33379:65316,33380:65317,33381:65318,33382:65319,33383:65320,33384:65321,33385:65322,33386:65323,33387:65324,33388:65325,33389:65326,33390:65327,33391:65328,33392:65329,33393:65330,33394:65331,33395:65332,33396:65333,33397:65334,33398:65335,33399:65336,33400:65337,33401:65338,33409:65345,33410:65346,33411:65347,33412:65348,33413:65349,33414:65350,33415:65351,33416:65352,33417:65353,33418:65354,33419:65355,33420:65356,33421:65357,33422:65358,33423:65359,33424:65360,33425:65361,33426:65362,33427:65363,33428:65364,33429:65365,33430:65366,33431:65367,33432:65368,33433:65369,33434:65370,33439:12353,33440:12354,33441:12355,33442:12356,33443:12357,33444:12358,33445:12359,33446:12360,33447:12361,33448:12362,33449:12363,33450:12364,33451:12365,33452:12366,33453:12367,33454:12368,33455:12369,33456:12370,33457:12371,33458:12372,33459:12373,33460:12374,33461:12375,33462:12376,33463:12377,33464:12378,33465:12379,33466:12380,33467:12381,33468:12382,33469:12383,33470:12384,33471:12385,33472:12386,33473:12387,33474:12388,33475:12389,33476:12390,33477:12391,33478:12392,33479:12393,33480:12394,33481:12395,33482:12396,33483:12397,33484:12398,33485:12399,33486:12400,33487:12401,33488:12402,33489:12403,33490:12404,33491:12405,33492:12406,33493:12407,33494:12408,33495:12409,33496:12410,33497:12411,33498:12412,33499:12413,33500:12414,33501:12415,33502:12416,33503:12417,33504:12418,33505:12419,33506:12420,33507:12421,33508:12422,33509:12423,33510:12424,33511:12425,33512:12426,33513:12427,33514:12428,33515:12429,33516:12430,33517:12431,33518:12432,33519:12433,33520:12434,33521:12435,33600:12449,33601:12450,33602:12451,33603:12452,33604:12453,33605:12454,33606:12455,33607:12456,33608:12457,33609:12458,33610:12459,33611:12460,33612:12461,33613:12462,33614:12463,33615:12464,33616:12465,33617:12466,33618:12467,33619:12468,33620:12469,33621:12470,33622:12471,33623:12472,33624:12473,33625:12474,33626:12475,33627:12476,33628:12477,33629:12478,33630:12479,33631:12480,33632:12481,33633:12482,33634:12483,33635:12484,33636:12485,33637:12486,33638:12487,33639:12488,33640:12489,33641:12490,33642:12491,33643:12492,33644:12493,33645:12494,33646:12495,33647:12496,33648:12497,33649:12498,33650:12499,33651:12500,33652:12501,33653:12502,33654:12503,33655:12504,33656:12505,33657:12506,33658:12507,33659:12508,33660:12509,33661:12510,33662:12511,33664:12512,33665:12513,33666:12514,33667:12515,33668:12516,33669:12517,33670:12518,33671:12519,33672:12520,33673:12521,33674:12522,33675:12523,33676:12524,33677:12525,33678:12526,33679:12527,33680:12528,33681:12529,33682:12530,33683:12531,33684:12532,33685:12533,33686:12534,33695:913,33696:914,33697:915,33698:916,33699:917,33700:918,33701:919,33702:920,33703:921,33704:922,33705:923,33706:924,33707:925,33708:926,33709:927,33710:928,33711:929,33712:931,33713:932,33714:933,33715:934,33716:935,33717:936,33718:937,33727:945,33728:946,33729:947,33730:948,33731:949,33732:950,33733:951,33734:952,33735:953,33736:954,33737:955,33738:956,33739:957,33740:958,33741:959,33742:960,33743:961,33744:963,33745:964,33746:965,33747:966,33748:967,33749:968,33750:969,33856:1040,33857:1041,33858:1042,33859:1043,33860:1044,33861:1045,33862:1025,33863:1046,33864:1047,33865:1048,33866:1049,33867:1050,33868:1051,33869:1052,33870:1053,33871:1054,33872:1055,33873:1056,33874:1057,33875:1058,33876:1059,33877:1060,33878:1061,33879:1062,33880:1063,33881:1064,33882:1065,33883:1066,33884:1067,33885:1068,33886:1069,33887:1070,33888:1071,33904:1072,33905:1073,33906:1074,33907:1075,33908:1076,33909:1077,33910:1105,33911:1078,33912:1079,33913:1080,33914:1081,33915:1082,33916:1083,33917:1084,33918:1085,33920:1086,33921:1087,33922:1088,33923:1089,33924:1090,33925:1091,33926:1092,33927:1093,33928:1094,33929:1095,33930:1096,33931:1097,33932:1098,33933:1099,33934:1100,33935:1101,33936:1102,33937:1103,33951:9472,33952:9474,33953:9484,33954:9488,33955:9496,33956:9492,33957:9500,33958:9516,33959:9508,33960:9524,33961:9532,33962:9473,33963:9475,33964:9487,33965:9491,33966:9499,33967:9495,33968:9507,33969:9523,33970:9515,33971:9531,33972:9547,33973:9504,33974:9519,33975:9512,33976:9527,33977:9535,33978:9501,33979:9520,33980:9509,33981:9528,33982:9538,34975:20124,34976:21782,34977:23043,34978:38463,34979:21696,34980:24859,34981:25384,34982:23030,34983:36898,34984:33909,34985:33564,34986:31312,34987:24746,34988:25569,34989:28197,34990:26093,34991:33894,34992:33446,34993:39925,34994:26771,34995:22311,34996:26017,34997:25201,34998:23451,34999:22992,35e3:34427,35001:39156,35002:32098,35003:32190,35004:39822,35005:25110,35006:31903,35007:34999,35008:23433,35009:24245,35010:25353,35011:26263,35012:26696,35013:38343,35014:38797,35015:26447,35016:20197,35017:20234,35018:20301,35019:20381,35020:20553,35021:22258,35022:22839,35023:22996,35024:23041,35025:23561,35026:24799,35027:24847,35028:24944,35029:26131,35030:26885,35031:28858,35032:30031,35033:30064,35034:31227,35035:32173,35036:32239,35037:32963,35038:33806,35039:34915,35040:35586,35041:36949,35042:36986,35043:21307,35044:20117,35045:20133,35046:22495,35047:32946,35048:37057,35049:30959,35050:19968,35051:22769,35052:28322,35053:36920,35054:31282,35055:33576,35056:33419,35057:39983,35058:20801,35059:21360,35060:21693,35061:21729,35062:22240,35063:23035,35064:24341,35065:39154,35066:28139,35067:32996,35068:34093,35136:38498,35137:38512,35138:38560,35139:38907,35140:21515,35141:21491,35142:23431,35143:28879,35144:32701,35145:36802,35146:38632,35147:21359,35148:40284,35149:31418,35150:19985,35151:30867,35152:33276,35153:28198,35154:22040,35155:21764,35156:27421,35157:34074,35158:39995,35159:23013,35160:21417,35161:28006,35162:29916,35163:38287,35164:22082,35165:20113,35166:36939,35167:38642,35168:33615,35169:39180,35170:21473,35171:21942,35172:23344,35173:24433,35174:26144,35175:26355,35176:26628,35177:27704,35178:27891,35179:27945,35180:29787,35181:30408,35182:31310,35183:38964,35184:33521,35185:34907,35186:35424,35187:37613,35188:28082,35189:30123,35190:30410,35191:39365,35192:24742,35193:35585,35194:36234,35195:38322,35196:27022,35197:21421,35198:20870,35200:22290,35201:22576,35202:22852,35203:23476,35204:24310,35205:24616,35206:25513,35207:25588,35208:27839,35209:28436,35210:28814,35211:28948,35212:29017,35213:29141,35214:29503,35215:32257,35216:33398,35217:33489,35218:34199,35219:36960,35220:37467,35221:40219,35222:22633,35223:26044,35224:27738,35225:29989,35226:20985,35227:22830,35228:22885,35229:24448,35230:24540,35231:25276,35232:26106,35233:27178,35234:27431,35235:27572,35236:29579,35237:32705,35238:35158,35239:40236,35240:40206,35241:40644,35242:23713,35243:27798,35244:33659,35245:20740,35246:23627,35247:25014,35248:33222,35249:26742,35250:29281,35251:20057,35252:20474,35253:21368,35254:24681,35255:28201,35256:31311,35257:38899,35258:19979,35259:21270,35260:20206,35261:20309,35262:20285,35263:20385,35264:20339,35265:21152,35266:21487,35267:22025,35268:22799,35269:23233,35270:23478,35271:23521,35272:31185,35273:26247,35274:26524,35275:26550,35276:27468,35277:27827,35278:28779,35279:29634,35280:31117,35281:31166,35282:31292,35283:31623,35284:33457,35285:33499,35286:33540,35287:33655,35288:33775,35289:33747,35290:34662,35291:35506,35292:22057,35293:36008,35294:36838,35295:36942,35296:38686,35297:34442,35298:20420,35299:23784,35300:25105,35301:29273,35302:30011,35303:33253,35304:33469,35305:34558,35306:36032,35307:38597,35308:39187,35309:39381,35310:20171,35311:20250,35312:35299,35313:22238,35314:22602,35315:22730,35316:24315,35317:24555,35318:24618,35319:24724,35320:24674,35321:25040,35322:25106,35323:25296,35324:25913,35392:39745,35393:26214,35394:26800,35395:28023,35396:28784,35397:30028,35398:30342,35399:32117,35400:33445,35401:34809,35402:38283,35403:38542,35404:35997,35405:20977,35406:21182,35407:22806,35408:21683,35409:23475,35410:23830,35411:24936,35412:27010,35413:28079,35414:30861,35415:33995,35416:34903,35417:35442,35418:37799,35419:39608,35420:28012,35421:39336,35422:34521,35423:22435,35424:26623,35425:34510,35426:37390,35427:21123,35428:22151,35429:21508,35430:24275,35431:25313,35432:25785,35433:26684,35434:26680,35435:27579,35436:29554,35437:30906,35438:31339,35439:35226,35440:35282,35441:36203,35442:36611,35443:37101,35444:38307,35445:38548,35446:38761,35447:23398,35448:23731,35449:27005,35450:38989,35451:38990,35452:25499,35453:31520,35454:27179,35456:27263,35457:26806,35458:39949,35459:28511,35460:21106,35461:21917,35462:24688,35463:25324,35464:27963,35465:28167,35466:28369,35467:33883,35468:35088,35469:36676,35470:19988,35471:39993,35472:21494,35473:26907,35474:27194,35475:38788,35476:26666,35477:20828,35478:31427,35479:33970,35480:37340,35481:37772,35482:22107,35483:40232,35484:26658,35485:33541,35486:33841,35487:31909,35488:21e3,35489:33477,35490:29926,35491:20094,35492:20355,35493:20896,35494:23506,35495:21002,35496:21208,35497:21223,35498:24059,35499:21914,35500:22570,35501:23014,35502:23436,35503:23448,35504:23515,35505:24178,35506:24185,35507:24739,35508:24863,35509:24931,35510:25022,35511:25563,35512:25954,35513:26577,35514:26707,35515:26874,35516:27454,35517:27475,35518:27735,35519:28450,35520:28567,35521:28485,35522:29872,35523:29976,35524:30435,35525:30475,35526:31487,35527:31649,35528:31777,35529:32233,35530:32566,35531:32752,35532:32925,35533:33382,35534:33694,35535:35251,35536:35532,35537:36011,35538:36996,35539:37969,35540:38291,35541:38289,35542:38306,35543:38501,35544:38867,35545:39208,35546:33304,35547:20024,35548:21547,35549:23736,35550:24012,35551:29609,35552:30284,35553:30524,35554:23721,35555:32747,35556:36107,35557:38593,35558:38929,35559:38996,35560:39e3,35561:20225,35562:20238,35563:21361,35564:21916,35565:22120,35566:22522,35567:22855,35568:23305,35569:23492,35570:23696,35571:24076,35572:24190,35573:24524,35574:25582,35575:26426,35576:26071,35577:26082,35578:26399,35579:26827,35580:26820,35648:27231,35649:24112,35650:27589,35651:27671,35652:27773,35653:30079,35654:31048,35655:23395,35656:31232,35657:32e3,35658:24509,35659:35215,35660:35352,35661:36020,35662:36215,35663:36556,35664:36637,35665:39138,35666:39438,35667:39740,35668:20096,35669:20605,35670:20736,35671:22931,35672:23452,35673:25135,35674:25216,35675:25836,35676:27450,35677:29344,35678:30097,35679:31047,35680:32681,35681:34811,35682:35516,35683:35696,35684:25516,35685:33738,35686:38816,35687:21513,35688:21507,35689:21931,35690:26708,35691:27224,35692:35440,35693:30759,35694:26485,35695:40653,35696:21364,35697:23458,35698:33050,35699:34384,35700:36870,35701:19992,35702:20037,35703:20167,35704:20241,35705:21450,35706:21560,35707:23470,35708:24339,35709:24613,35710:25937,35712:26429,35713:27714,35714:27762,35715:27875,35716:28792,35717:29699,35718:31350,35719:31406,35720:31496,35721:32026,35722:31998,35723:32102,35724:26087,35725:29275,35726:21435,35727:23621,35728:24040,35729:25298,35730:25312,35731:25369,35732:28192,35733:34394,35734:35377,35735:36317,35736:37624,35737:28417,35738:31142,35739:39770,35740:20136,35741:20139,35742:20140,35743:20379,35744:20384,35745:20689,35746:20807,35747:31478,35748:20849,35749:20982,35750:21332,35751:21281,35752:21375,35753:21483,35754:21932,35755:22659,35756:23777,35757:24375,35758:24394,35759:24623,35760:24656,35761:24685,35762:25375,35763:25945,35764:27211,35765:27841,35766:29378,35767:29421,35768:30703,35769:33016,35770:33029,35771:33288,35772:34126,35773:37111,35774:37857,35775:38911,35776:39255,35777:39514,35778:20208,35779:20957,35780:23597,35781:26241,35782:26989,35783:23616,35784:26354,35785:26997,35786:29577,35787:26704,35788:31873,35789:20677,35790:21220,35791:22343,35792:24062,35793:37670,35794:26020,35795:27427,35796:27453,35797:29748,35798:31105,35799:31165,35800:31563,35801:32202,35802:33465,35803:33740,35804:34943,35805:35167,35806:35641,35807:36817,35808:37329,35809:21535,35810:37504,35811:20061,35812:20534,35813:21477,35814:21306,35815:29399,35816:29590,35817:30697,35818:33510,35819:36527,35820:39366,35821:39368,35822:39378,35823:20855,35824:24858,35825:34398,35826:21936,35827:31354,35828:20598,35829:23507,35830:36935,35831:38533,35832:20018,35833:27355,35834:37351,35835:23633,35836:23624,35904:25496,35905:31391,35906:27795,35907:38772,35908:36705,35909:31402,35910:29066,35911:38536,35912:31874,35913:26647,35914:32368,35915:26705,35916:37740,35917:21234,35918:21531,35919:34219,35920:35347,35921:32676,35922:36557,35923:37089,35924:21350,35925:34952,35926:31041,35927:20418,35928:20670,35929:21009,35930:20804,35931:21843,35932:22317,35933:29674,35934:22411,35935:22865,35936:24418,35937:24452,35938:24693,35939:24950,35940:24935,35941:25001,35942:25522,35943:25658,35944:25964,35945:26223,35946:26690,35947:28179,35948:30054,35949:31293,35950:31995,35951:32076,35952:32153,35953:32331,35954:32619,35955:33550,35956:33610,35957:34509,35958:35336,35959:35427,35960:35686,35961:36605,35962:38938,35963:40335,35964:33464,35965:36814,35966:39912,35968:21127,35969:25119,35970:25731,35971:28608,35972:38553,35973:26689,35974:20625,35975:27424,35976:27770,35977:28500,35978:31348,35979:32080,35980:34880,35981:35363,35982:26376,35983:20214,35984:20537,35985:20518,35986:20581,35987:20860,35988:21048,35989:21091,35990:21927,35991:22287,35992:22533,35993:23244,35994:24314,35995:25010,35996:25080,35997:25331,35998:25458,35999:26908,36e3:27177,36001:29309,36002:29356,36003:29486,36004:30740,36005:30831,36006:32121,36007:30476,36008:32937,36009:35211,36010:35609,36011:36066,36012:36562,36013:36963,36014:37749,36015:38522,36016:38997,36017:39443,36018:40568,36019:20803,36020:21407,36021:21427,36022:24187,36023:24358,36024:28187,36025:28304,36026:29572,36027:29694,36028:32067,36029:33335,36030:35328,36031:35578,36032:38480,36033:20046,36034:20491,36035:21476,36036:21628,36037:22266,36038:22993,36039:23396,36040:24049,36041:24235,36042:24359,36043:25144,36044:25925,36045:26543,36046:28246,36047:29392,36048:31946,36049:34996,36050:32929,36051:32993,36052:33776,36053:34382,36054:35463,36055:36328,36056:37431,36057:38599,36058:39015,36059:40723,36060:20116,36061:20114,36062:20237,36063:21320,36064:21577,36065:21566,36066:23087,36067:24460,36068:24481,36069:24735,36070:26791,36071:27278,36072:29786,36073:30849,36074:35486,36075:35492,36076:35703,36077:37264,36078:20062,36079:39881,36080:20132,36081:20348,36082:20399,36083:20505,36084:20502,36085:20809,36086:20844,36087:21151,36088:21177,36089:21246,36090:21402,36091:21475,36092:21521,36160:21518,36161:21897,36162:22353,36163:22434,36164:22909,36165:23380,36166:23389,36167:23439,36168:24037,36169:24039,36170:24055,36171:24184,36172:24195,36173:24218,36174:24247,36175:24344,36176:24658,36177:24908,36178:25239,36179:25304,36180:25511,36181:25915,36182:26114,36183:26179,36184:26356,36185:26477,36186:26657,36187:26775,36188:27083,36189:27743,36190:27946,36191:28009,36192:28207,36193:28317,36194:30002,36195:30343,36196:30828,36197:31295,36198:31968,36199:32005,36200:32024,36201:32094,36202:32177,36203:32789,36204:32771,36205:32943,36206:32945,36207:33108,36208:33167,36209:33322,36210:33618,36211:34892,36212:34913,36213:35611,36214:36002,36215:36092,36216:37066,36217:37237,36218:37489,36219:30783,36220:37628,36221:38308,36222:38477,36224:38917,36225:39321,36226:39640,36227:40251,36228:21083,36229:21163,36230:21495,36231:21512,36232:22741,36233:25335,36234:28640,36235:35946,36236:36703,36237:40633,36238:20811,36239:21051,36240:21578,36241:22269,36242:31296,36243:37239,36244:40288,36245:40658,36246:29508,36247:28425,36248:33136,36249:29969,36250:24573,36251:24794,36252:39592,36253:29403,36254:36796,36255:27492,36256:38915,36257:20170,36258:22256,36259:22372,36260:22718,36261:23130,36262:24680,36263:25031,36264:26127,36265:26118,36266:26681,36267:26801,36268:28151,36269:30165,36270:32058,36271:33390,36272:39746,36273:20123,36274:20304,36275:21449,36276:21766,36277:23919,36278:24038,36279:24046,36280:26619,36281:27801,36282:29811,36283:30722,36284:35408,36285:37782,36286:35039,36287:22352,36288:24231,36289:25387,36290:20661,36291:20652,36292:20877,36293:26368,36294:21705,36295:22622,36296:22971,36297:23472,36298:24425,36299:25165,36300:25505,36301:26685,36302:27507,36303:28168,36304:28797,36305:37319,36306:29312,36307:30741,36308:30758,36309:31085,36310:25998,36311:32048,36312:33756,36313:35009,36314:36617,36315:38555,36316:21092,36317:22312,36318:26448,36319:32618,36320:36001,36321:20916,36322:22338,36323:38442,36324:22586,36325:27018,36326:32948,36327:21682,36328:23822,36329:22524,36330:30869,36331:40442,36332:20316,36333:21066,36334:21643,36335:25662,36336:26152,36337:26388,36338:26613,36339:31364,36340:31574,36341:32034,36342:37679,36343:26716,36344:39853,36345:31545,36346:21273,36347:20874,36348:21047,36416:23519,36417:25334,36418:25774,36419:25830,36420:26413,36421:27578,36422:34217,36423:38609,36424:30352,36425:39894,36426:25420,36427:37638,36428:39851,36429:30399,36430:26194,36431:19977,36432:20632,36433:21442,36434:23665,36435:24808,36436:25746,36437:25955,36438:26719,36439:29158,36440:29642,36441:29987,36442:31639,36443:32386,36444:34453,36445:35715,36446:36059,36447:37240,36448:39184,36449:26028,36450:26283,36451:27531,36452:20181,36453:20180,36454:20282,36455:20351,36456:21050,36457:21496,36458:21490,36459:21987,36460:22235,36461:22763,36462:22987,36463:22985,36464:23039,36465:23376,36466:23629,36467:24066,36468:24107,36469:24535,36470:24605,36471:25351,36472:25903,36473:23388,36474:26031,36475:26045,36476:26088,36477:26525,36478:27490,36480:27515,36481:27663,36482:29509,36483:31049,36484:31169,36485:31992,36486:32025,36487:32043,36488:32930,36489:33026,36490:33267,36491:35222,36492:35422,36493:35433,36494:35430,36495:35468,36496:35566,36497:36039,36498:36060,36499:38604,36500:39164,36501:27503,36502:20107,36503:20284,36504:20365,36505:20816,36506:23383,36507:23546,36508:24904,36509:25345,36510:26178,36511:27425,36512:28363,36513:27835,36514:29246,36515:29885,36516:30164,36517:30913,36518:31034,36519:32780,36520:32819,36521:33258,36522:33940,36523:36766,36524:27728,36525:40575,36526:24335,36527:35672,36528:40235,36529:31482,36530:36600,36531:23437,36532:38635,36533:19971,36534:21489,36535:22519,36536:22833,36537:23241,36538:23460,36539:24713,36540:28287,36541:28422,36542:30142,36543:36074,36544:23455,36545:34048,36546:31712,36547:20594,36548:26612,36549:33437,36550:23649,36551:34122,36552:32286,36553:33294,36554:20889,36555:23556,36556:25448,36557:36198,36558:26012,36559:29038,36560:31038,36561:32023,36562:32773,36563:35613,36564:36554,36565:36974,36566:34503,36567:37034,36568:20511,36569:21242,36570:23610,36571:26451,36572:28796,36573:29237,36574:37196,36575:37320,36576:37675,36577:33509,36578:23490,36579:24369,36580:24825,36581:20027,36582:21462,36583:23432,36584:25163,36585:26417,36586:27530,36587:29417,36588:29664,36589:31278,36590:33131,36591:36259,36592:37202,36593:39318,36594:20754,36595:21463,36596:21610,36597:23551,36598:25480,36599:27193,36600:32172,36601:38656,36602:22234,36603:21454,36604:21608,36672:23447,36673:23601,36674:24030,36675:20462,36676:24833,36677:25342,36678:27954,36679:31168,36680:31179,36681:32066,36682:32333,36683:32722,36684:33261,36685:33311,36686:33936,36687:34886,36688:35186,36689:35728,36690:36468,36691:36655,36692:36913,36693:37195,36694:37228,36695:38598,36696:37276,36697:20160,36698:20303,36699:20805,36700:21313,36701:24467,36702:25102,36703:26580,36704:27713,36705:28171,36706:29539,36707:32294,36708:37325,36709:37507,36710:21460,36711:22809,36712:23487,36713:28113,36714:31069,36715:32302,36716:31899,36717:22654,36718:29087,36719:20986,36720:34899,36721:36848,36722:20426,36723:23803,36724:26149,36725:30636,36726:31459,36727:33308,36728:39423,36729:20934,36730:24490,36731:26092,36732:26991,36733:27529,36734:28147,36736:28310,36737:28516,36738:30462,36739:32020,36740:24033,36741:36981,36742:37255,36743:38918,36744:20966,36745:21021,36746:25152,36747:26257,36748:26329,36749:28186,36750:24246,36751:32210,36752:32626,36753:26360,36754:34223,36755:34295,36756:35576,36757:21161,36758:21465,36759:22899,36760:24207,36761:24464,36762:24661,36763:37604,36764:38500,36765:20663,36766:20767,36767:21213,36768:21280,36769:21319,36770:21484,36771:21736,36772:21830,36773:21809,36774:22039,36775:22888,36776:22974,36777:23100,36778:23477,36779:23558,36780:23567,36781:23569,36782:23578,36783:24196,36784:24202,36785:24288,36786:24432,36787:25215,36788:25220,36789:25307,36790:25484,36791:25463,36792:26119,36793:26124,36794:26157,36795:26230,36796:26494,36797:26786,36798:27167,36799:27189,36800:27836,36801:28040,36802:28169,36803:28248,36804:28988,36805:28966,36806:29031,36807:30151,36808:30465,36809:30813,36810:30977,36811:31077,36812:31216,36813:31456,36814:31505,36815:31911,36816:32057,36817:32918,36818:33750,36819:33931,36820:34121,36821:34909,36822:35059,36823:35359,36824:35388,36825:35412,36826:35443,36827:35937,36828:36062,36829:37284,36830:37478,36831:37758,36832:37912,36833:38556,36834:38808,36835:19978,36836:19976,36837:19998,36838:20055,36839:20887,36840:21104,36841:22478,36842:22580,36843:22732,36844:23330,36845:24120,36846:24773,36847:25854,36848:26465,36849:26454,36850:27972,36851:29366,36852:30067,36853:31331,36854:33976,36855:35698,36856:37304,36857:37664,36858:22065,36859:22516,36860:39166,36928:25325,36929:26893,36930:27542,36931:29165,36932:32340,36933:32887,36934:33394,36935:35302,36936:39135,36937:34645,36938:36785,36939:23611,36940:20280,36941:20449,36942:20405,36943:21767,36944:23072,36945:23517,36946:23529,36947:24515,36948:24910,36949:25391,36950:26032,36951:26187,36952:26862,36953:27035,36954:28024,36955:28145,36956:30003,36957:30137,36958:30495,36959:31070,36960:31206,36961:32051,36962:33251,36963:33455,36964:34218,36965:35242,36966:35386,36967:36523,36968:36763,36969:36914,36970:37341,36971:38663,36972:20154,36973:20161,36974:20995,36975:22645,36976:22764,36977:23563,36978:29978,36979:23613,36980:33102,36981:35338,36982:36805,36983:38499,36984:38765,36985:31525,36986:35535,36987:38920,36988:37218,36989:22259,36990:21416,36992:36887,36993:21561,36994:22402,36995:24101,36996:25512,36997:27700,36998:28810,36999:30561,37e3:31883,37001:32736,37002:34928,37003:36930,37004:37204,37005:37648,37006:37656,37007:38543,37008:29790,37009:39620,37010:23815,37011:23913,37012:25968,37013:26530,37014:36264,37015:38619,37016:25454,37017:26441,37018:26905,37019:33733,37020:38935,37021:38592,37022:35070,37023:28548,37024:25722,37025:23544,37026:19990,37027:28716,37028:30045,37029:26159,37030:20932,37031:21046,37032:21218,37033:22995,37034:24449,37035:24615,37036:25104,37037:25919,37038:25972,37039:26143,37040:26228,37041:26866,37042:26646,37043:27491,37044:28165,37045:29298,37046:29983,37047:30427,37048:31934,37049:32854,37050:22768,37051:35069,37052:35199,37053:35488,37054:35475,37055:35531,37056:36893,37057:37266,37058:38738,37059:38745,37060:25993,37061:31246,37062:33030,37063:38587,37064:24109,37065:24796,37066:25114,37067:26021,37068:26132,37069:26512,37070:30707,37071:31309,37072:31821,37073:32318,37074:33034,37075:36012,37076:36196,37077:36321,37078:36447,37079:30889,37080:20999,37081:25305,37082:25509,37083:25666,37084:25240,37085:35373,37086:31363,37087:31680,37088:35500,37089:38634,37090:32118,37091:33292,37092:34633,37093:20185,37094:20808,37095:21315,37096:21344,37097:23459,37098:23554,37099:23574,37100:24029,37101:25126,37102:25159,37103:25776,37104:26643,37105:26676,37106:27849,37107:27973,37108:27927,37109:26579,37110:28508,37111:29006,37112:29053,37113:26059,37114:31359,37115:31661,37116:32218,37184:32330,37185:32680,37186:33146,37187:33307,37188:33337,37189:34214,37190:35438,37191:36046,37192:36341,37193:36984,37194:36983,37195:37549,37196:37521,37197:38275,37198:39854,37199:21069,37200:21892,37201:28472,37202:28982,37203:20840,37204:31109,37205:32341,37206:33203,37207:31950,37208:22092,37209:22609,37210:23720,37211:25514,37212:26366,37213:26365,37214:26970,37215:29401,37216:30095,37217:30094,37218:30990,37219:31062,37220:31199,37221:31895,37222:32032,37223:32068,37224:34311,37225:35380,37226:38459,37227:36961,37228:40736,37229:20711,37230:21109,37231:21452,37232:21474,37233:20489,37234:21930,37235:22766,37236:22863,37237:29245,37238:23435,37239:23652,37240:21277,37241:24803,37242:24819,37243:25436,37244:25475,37245:25407,37246:25531,37248:25805,37249:26089,37250:26361,37251:24035,37252:27085,37253:27133,37254:28437,37255:29157,37256:20105,37257:30185,37258:30456,37259:31379,37260:31967,37261:32207,37262:32156,37263:32865,37264:33609,37265:33624,37266:33900,37267:33980,37268:34299,37269:35013,37270:36208,37271:36865,37272:36973,37273:37783,37274:38684,37275:39442,37276:20687,37277:22679,37278:24974,37279:33235,37280:34101,37281:36104,37282:36896,37283:20419,37284:20596,37285:21063,37286:21363,37287:24687,37288:25417,37289:26463,37290:28204,37291:36275,37292:36895,37293:20439,37294:23646,37295:36042,37296:26063,37297:32154,37298:21330,37299:34966,37300:20854,37301:25539,37302:23384,37303:23403,37304:23562,37305:25613,37306:26449,37307:36956,37308:20182,37309:22810,37310:22826,37311:27760,37312:35409,37313:21822,37314:22549,37315:22949,37316:24816,37317:25171,37318:26561,37319:33333,37320:26965,37321:38464,37322:39364,37323:39464,37324:20307,37325:22534,37326:23550,37327:32784,37328:23729,37329:24111,37330:24453,37331:24608,37332:24907,37333:25140,37334:26367,37335:27888,37336:28382,37337:32974,37338:33151,37339:33492,37340:34955,37341:36024,37342:36864,37343:36910,37344:38538,37345:40667,37346:39899,37347:20195,37348:21488,37349:22823,37350:31532,37351:37261,37352:38988,37353:40441,37354:28381,37355:28711,37356:21331,37357:21828,37358:23429,37359:25176,37360:25246,37361:25299,37362:27810,37363:28655,37364:29730,37365:35351,37366:37944,37367:28609,37368:35582,37369:33592,37370:20967,37371:34552,37372:21482,37440:21481,37441:20294,37442:36948,37443:36784,37444:22890,37445:33073,37446:24061,37447:31466,37448:36799,37449:26842,37450:35895,37451:29432,37452:40008,37453:27197,37454:35504,37455:20025,37456:21336,37457:22022,37458:22374,37459:25285,37460:25506,37461:26086,37462:27470,37463:28129,37464:28251,37465:28845,37466:30701,37467:31471,37468:31658,37469:32187,37470:32829,37471:32966,37472:34507,37473:35477,37474:37723,37475:22243,37476:22727,37477:24382,37478:26029,37479:26262,37480:27264,37481:27573,37482:30007,37483:35527,37484:20516,37485:30693,37486:22320,37487:24347,37488:24677,37489:26234,37490:27744,37491:30196,37492:31258,37493:32622,37494:33268,37495:34584,37496:36933,37497:39347,37498:31689,37499:30044,37500:31481,37501:31569,37502:33988,37504:36880,37505:31209,37506:31378,37507:33590,37508:23265,37509:30528,37510:20013,37511:20210,37512:23449,37513:24544,37514:25277,37515:26172,37516:26609,37517:27880,37518:34411,37519:34935,37520:35387,37521:37198,37522:37619,37523:39376,37524:27159,37525:28710,37526:29482,37527:33511,37528:33879,37529:36015,37530:19969,37531:20806,37532:20939,37533:21899,37534:23541,37535:24086,37536:24115,37537:24193,37538:24340,37539:24373,37540:24427,37541:24500,37542:25074,37543:25361,37544:26274,37545:26397,37546:28526,37547:29266,37548:30010,37549:30522,37550:32884,37551:33081,37552:33144,37553:34678,37554:35519,37555:35548,37556:36229,37557:36339,37558:37530,37559:38263,37560:38914,37561:40165,37562:21189,37563:25431,37564:30452,37565:26389,37566:27784,37567:29645,37568:36035,37569:37806,37570:38515,37571:27941,37572:22684,37573:26894,37574:27084,37575:36861,37576:37786,37577:30171,37578:36890,37579:22618,37580:26626,37581:25524,37582:27131,37583:20291,37584:28460,37585:26584,37586:36795,37587:34086,37588:32180,37589:37716,37590:26943,37591:28528,37592:22378,37593:22775,37594:23340,37595:32044,37596:29226,37597:21514,37598:37347,37599:40372,37600:20141,37601:20302,37602:20572,37603:20597,37604:21059,37605:35998,37606:21576,37607:22564,37608:23450,37609:24093,37610:24213,37611:24237,37612:24311,37613:24351,37614:24716,37615:25269,37616:25402,37617:25552,37618:26799,37619:27712,37620:30855,37621:31118,37622:31243,37623:32224,37624:33351,37625:35330,37626:35558,37627:36420,37628:36883,37696:37048,37697:37165,37698:37336,37699:40718,37700:27877,37701:25688,37702:25826,37703:25973,37704:28404,37705:30340,37706:31515,37707:36969,37708:37841,37709:28346,37710:21746,37711:24505,37712:25764,37713:36685,37714:36845,37715:37444,37716:20856,37717:22635,37718:22825,37719:23637,37720:24215,37721:28155,37722:32399,37723:29980,37724:36028,37725:36578,37726:39003,37727:28857,37728:20253,37729:27583,37730:28593,37731:3e4,37732:38651,37733:20814,37734:21520,37735:22581,37736:22615,37737:22956,37738:23648,37739:24466,37740:26007,37741:26460,37742:28193,37743:30331,37744:33759,37745:36077,37746:36884,37747:37117,37748:37709,37749:30757,37750:30778,37751:21162,37752:24230,37753:22303,37754:22900,37755:24594,37756:20498,37757:20826,37758:20908,37760:20941,37761:20992,37762:21776,37763:22612,37764:22616,37765:22871,37766:23445,37767:23798,37768:23947,37769:24764,37770:25237,37771:25645,37772:26481,37773:26691,37774:26812,37775:26847,37776:30423,37777:28120,37778:28271,37779:28059,37780:28783,37781:29128,37782:24403,37783:30168,37784:31095,37785:31561,37786:31572,37787:31570,37788:31958,37789:32113,37790:21040,37791:33891,37792:34153,37793:34276,37794:35342,37795:35588,37796:35910,37797:36367,37798:36867,37799:36879,37800:37913,37801:38518,37802:38957,37803:39472,37804:38360,37805:20685,37806:21205,37807:21516,37808:22530,37809:23566,37810:24999,37811:25758,37812:27934,37813:30643,37814:31461,37815:33012,37816:33796,37817:36947,37818:37509,37819:23776,37820:40199,37821:21311,37822:24471,37823:24499,37824:28060,37825:29305,37826:30563,37827:31167,37828:31716,37829:27602,37830:29420,37831:35501,37832:26627,37833:27233,37834:20984,37835:31361,37836:26932,37837:23626,37838:40182,37839:33515,37840:23493,37841:37193,37842:28702,37843:22136,37844:23663,37845:24775,37846:25958,37847:27788,37848:35930,37849:36929,37850:38931,37851:21585,37852:26311,37853:37389,37854:22856,37855:37027,37856:20869,37857:20045,37858:20970,37859:34201,37860:35598,37861:28760,37862:25466,37863:37707,37864:26978,37865:39348,37866:32260,37867:30071,37868:21335,37869:26976,37870:36575,37871:38627,37872:27741,37873:20108,37874:23612,37875:24336,37876:36841,37877:21250,37878:36049,37879:32905,37880:34425,37881:24319,37882:26085,37883:20083,37884:20837,37952:22914,37953:23615,37954:38894,37955:20219,37956:22922,37957:24525,37958:35469,37959:28641,37960:31152,37961:31074,37962:23527,37963:33905,37964:29483,37965:29105,37966:24180,37967:24565,37968:25467,37969:25754,37970:29123,37971:31896,37972:20035,37973:24316,37974:20043,37975:22492,37976:22178,37977:24745,37978:28611,37979:32013,37980:33021,37981:33075,37982:33215,37983:36786,37984:35223,37985:34468,37986:24052,37987:25226,37988:25773,37989:35207,37990:26487,37991:27874,37992:27966,37993:29750,37994:30772,37995:23110,37996:32629,37997:33453,37998:39340,37999:20467,38e3:24259,38001:25309,38002:25490,38003:25943,38004:26479,38005:30403,38006:29260,38007:32972,38008:32954,38009:36649,38010:37197,38011:20493,38012:22521,38013:23186,38014:26757,38016:26995,38017:29028,38018:29437,38019:36023,38020:22770,38021:36064,38022:38506,38023:36889,38024:34687,38025:31204,38026:30695,38027:33833,38028:20271,38029:21093,38030:21338,38031:25293,38032:26575,38033:27850,38034:30333,38035:31636,38036:31893,38037:33334,38038:34180,38039:36843,38040:26333,38041:28448,38042:29190,38043:32283,38044:33707,38045:39361,38046:40614,38047:20989,38048:31665,38049:30834,38050:31672,38051:32903,38052:31560,38053:27368,38054:24161,38055:32908,38056:30033,38057:30048,38058:20843,38059:37474,38060:28300,38061:30330,38062:37271,38063:39658,38064:20240,38065:32624,38066:25244,38067:31567,38068:38309,38069:40169,38070:22138,38071:22617,38072:34532,38073:38588,38074:20276,38075:21028,38076:21322,38077:21453,38078:21467,38079:24070,38080:25644,38081:26001,38082:26495,38083:27710,38084:27726,38085:29256,38086:29359,38087:29677,38088:30036,38089:32321,38090:33324,38091:34281,38092:36009,38093:31684,38094:37318,38095:29033,38096:38930,38097:39151,38098:25405,38099:26217,38100:30058,38101:30436,38102:30928,38103:34115,38104:34542,38105:21290,38106:21329,38107:21542,38108:22915,38109:24199,38110:24444,38111:24754,38112:25161,38113:25209,38114:25259,38115:26e3,38116:27604,38117:27852,38118:30130,38119:30382,38120:30865,38121:31192,38122:32203,38123:32631,38124:32933,38125:34987,38126:35513,38127:36027,38128:36991,38129:38750,38130:39131,38131:27147,38132:31800,38133:20633,38134:23614,38135:24494,38136:26503,38137:27608,38138:29749,38139:30473,38140:32654,38208:40763,38209:26570,38210:31255,38211:21305,38212:30091,38213:39661,38214:24422,38215:33181,38216:33777,38217:32920,38218:24380,38219:24517,38220:30050,38221:31558,38222:36924,38223:26727,38224:23019,38225:23195,38226:32016,38227:30334,38228:35628,38229:20469,38230:24426,38231:27161,38232:27703,38233:28418,38234:29922,38235:31080,38236:34920,38237:35413,38238:35961,38239:24287,38240:25551,38241:30149,38242:31186,38243:33495,38244:37672,38245:37618,38246:33948,38247:34541,38248:39981,38249:21697,38250:24428,38251:25996,38252:27996,38253:28693,38254:36007,38255:36051,38256:38971,38257:25935,38258:29942,38259:19981,38260:20184,38261:22496,38262:22827,38263:23142,38264:23500,38265:20904,38266:24067,38267:24220,38268:24598,38269:25206,38270:25975,38272:26023,38273:26222,38274:28014,38275:29238,38276:31526,38277:33104,38278:33178,38279:33433,38280:35676,38281:36e3,38282:36070,38283:36212,38284:38428,38285:38468,38286:20398,38287:25771,38288:27494,38289:33310,38290:33889,38291:34154,38292:37096,38293:23553,38294:26963,38295:39080,38296:33914,38297:34135,38298:20239,38299:21103,38300:24489,38301:24133,38302:26381,38303:31119,38304:33145,38305:35079,38306:35206,38307:28149,38308:24343,38309:25173,38310:27832,38311:20175,38312:29289,38313:39826,38314:20998,38315:21563,38316:22132,38317:22707,38318:24996,38319:25198,38320:28954,38321:22894,38322:31881,38323:31966,38324:32027,38325:38640,38326:25991,38327:32862,38328:19993,38329:20341,38330:20853,38331:22592,38332:24163,38333:24179,38334:24330,38335:26564,38336:20006,38337:34109,38338:38281,38339:38491,38340:31859,38341:38913,38342:20731,38343:22721,38344:30294,38345:30887,38346:21029,38347:30629,38348:34065,38349:31622,38350:20559,38351:22793,38352:29255,38353:31687,38354:32232,38355:36794,38356:36820,38357:36941,38358:20415,38359:21193,38360:23081,38361:24321,38362:38829,38363:20445,38364:33303,38365:37610,38366:22275,38367:25429,38368:27497,38369:29995,38370:35036,38371:36628,38372:31298,38373:21215,38374:22675,38375:24917,38376:25098,38377:26286,38378:27597,38379:31807,38380:33769,38381:20515,38382:20472,38383:21253,38384:21574,38385:22577,38386:22857,38387:23453,38388:23792,38389:23791,38390:23849,38391:24214,38392:25265,38393:25447,38394:25918,38395:26041,38396:26379,38464:27861,38465:27873,38466:28921,38467:30770,38468:32299,38469:32990,38470:33459,38471:33804,38472:34028,38473:34562,38474:35090,38475:35370,38476:35914,38477:37030,38478:37586,38479:39165,38480:40179,38481:40300,38482:20047,38483:20129,38484:20621,38485:21078,38486:22346,38487:22952,38488:24125,38489:24536,38490:24537,38491:25151,38492:26292,38493:26395,38494:26576,38495:26834,38496:20882,38497:32033,38498:32938,38499:33192,38500:35584,38501:35980,38502:36031,38503:37502,38504:38450,38505:21536,38506:38956,38507:21271,38508:20693,38509:21340,38510:22696,38511:25778,38512:26420,38513:29287,38514:30566,38515:31302,38516:37350,38517:21187,38518:27809,38519:27526,38520:22528,38521:24140,38522:22868,38523:26412,38524:32763,38525:20961,38526:30406,38528:25705,38529:30952,38530:39764,38531:40635,38532:22475,38533:22969,38534:26151,38535:26522,38536:27598,38537:21737,38538:27097,38539:24149,38540:33180,38541:26517,38542:39850,38543:26622,38544:40018,38545:26717,38546:20134,38547:20451,38548:21448,38549:25273,38550:26411,38551:27819,38552:36804,38553:20397,38554:32365,38555:40639,38556:19975,38557:24930,38558:28288,38559:28459,38560:34067,38561:21619,38562:26410,38563:39749,38564:24051,38565:31637,38566:23724,38567:23494,38568:34588,38569:28234,38570:34001,38571:31252,38572:33032,38573:22937,38574:31885,38575:27665,38576:30496,38577:21209,38578:22818,38579:28961,38580:29279,38581:30683,38582:38695,38583:40289,38584:26891,38585:23167,38586:23064,38587:20901,38588:21517,38589:21629,38590:26126,38591:30431,38592:36855,38593:37528,38594:40180,38595:23018,38596:29277,38597:28357,38598:20813,38599:26825,38600:32191,38601:32236,38602:38754,38603:40634,38604:25720,38605:27169,38606:33538,38607:22916,38608:23391,38609:27611,38610:29467,38611:30450,38612:32178,38613:32791,38614:33945,38615:20786,38616:26408,38617:40665,38618:30446,38619:26466,38620:21247,38621:39173,38622:23588,38623:25147,38624:31870,38625:36016,38626:21839,38627:24758,38628:32011,38629:38272,38630:21249,38631:20063,38632:20918,38633:22812,38634:29242,38635:32822,38636:37326,38637:24357,38638:30690,38639:21380,38640:24441,38641:32004,38642:34220,38643:35379,38644:36493,38645:38742,38646:26611,38647:34222,38648:37971,38649:24841,38650:24840,38651:27833,38652:30290,38720:35565,38721:36664,38722:21807,38723:20305,38724:20778,38725:21191,38726:21451,38727:23461,38728:24189,38729:24736,38730:24962,38731:25558,38732:26377,38733:26586,38734:28263,38735:28044,38736:29494,38737:29495,38738:30001,38739:31056,38740:35029,38741:35480,38742:36938,38743:37009,38744:37109,38745:38596,38746:34701,38747:22805,38748:20104,38749:20313,38750:19982,38751:35465,38752:36671,38753:38928,38754:20653,38755:24188,38756:22934,38757:23481,38758:24248,38759:25562,38760:25594,38761:25793,38762:26332,38763:26954,38764:27096,38765:27915,38766:28342,38767:29076,38768:29992,38769:31407,38770:32650,38771:32768,38772:33865,38773:33993,38774:35201,38775:35617,38776:36362,38777:36965,38778:38525,38779:39178,38780:24958,38781:25233,38782:27442,38784:27779,38785:28020,38786:32716,38787:32764,38788:28096,38789:32645,38790:34746,38791:35064,38792:26469,38793:33713,38794:38972,38795:38647,38796:27931,38797:32097,38798:33853,38799:37226,38800:20081,38801:21365,38802:23888,38803:27396,38804:28651,38805:34253,38806:34349,38807:35239,38808:21033,38809:21519,38810:23653,38811:26446,38812:26792,38813:29702,38814:29827,38815:30178,38816:35023,38817:35041,38818:37324,38819:38626,38820:38520,38821:24459,38822:29575,38823:31435,38824:33870,38825:25504,38826:30053,38827:21129,38828:27969,38829:28316,38830:29705,38831:30041,38832:30827,38833:31890,38834:38534,38835:31452,38836:40845,38837:20406,38838:24942,38839:26053,38840:34396,38841:20102,38842:20142,38843:20698,38844:20001,38845:20940,38846:23534,38847:26009,38848:26753,38849:28092,38850:29471,38851:30274,38852:30637,38853:31260,38854:31975,38855:33391,38856:35538,38857:36988,38858:37327,38859:38517,38860:38936,38861:21147,38862:32209,38863:20523,38864:21400,38865:26519,38866:28107,38867:29136,38868:29747,38869:33256,38870:36650,38871:38563,38872:40023,38873:40607,38874:29792,38875:22593,38876:28057,38877:32047,38878:39006,38879:20196,38880:20278,38881:20363,38882:20919,38883:21169,38884:23994,38885:24604,38886:29618,38887:31036,38888:33491,38889:37428,38890:38583,38891:38646,38892:38666,38893:40599,38894:40802,38895:26278,38896:27508,38897:21015,38898:21155,38899:28872,38900:35010,38901:24265,38902:24651,38903:24976,38904:28451,38905:29001,38906:31806,38907:32244,38908:32879,38976:34030,38977:36899,38978:37676,38979:21570,38980:39791,38981:27347,38982:28809,38983:36034,38984:36335,38985:38706,38986:21172,38987:23105,38988:24266,38989:24324,38990:26391,38991:27004,38992:27028,38993:28010,38994:28431,38995:29282,38996:29436,38997:31725,38998:32769,38999:32894,39e3:34635,39001:37070,39002:20845,39003:40595,39004:31108,39005:32907,39006:37682,39007:35542,39008:20525,39009:21644,39010:35441,39011:27498,39012:36036,39013:33031,39014:24785,39015:26528,39016:40434,39017:20121,39018:20120,39019:39952,39020:35435,39021:34241,39022:34152,39023:26880,39024:28286,39025:30871,39026:33109,39071:24332,39072:19984,39073:19989,39074:20010,39075:20017,39076:20022,39077:20028,39078:20031,39079:20034,39080:20054,39081:20056,39082:20098,39083:20101,39084:35947,39085:20106,39086:33298,39087:24333,39088:20110,39089:20126,39090:20127,39091:20128,39092:20130,39093:20144,39094:20147,39095:20150,39096:20174,39097:20173,39098:20164,39099:20166,39100:20162,39101:20183,39102:20190,39103:20205,39104:20191,39105:20215,39106:20233,39107:20314,39108:20272,39109:20315,39110:20317,39111:20311,39112:20295,39113:20342,39114:20360,39115:20367,39116:20376,39117:20347,39118:20329,39119:20336,39120:20369,39121:20335,39122:20358,39123:20374,39124:20760,39125:20436,39126:20447,39127:20430,39128:20440,39129:20443,39130:20433,39131:20442,39132:20432,39133:20452,39134:20453,39135:20506,39136:20520,39137:20500,39138:20522,39139:20517,39140:20485,39141:20252,39142:20470,39143:20513,39144:20521,39145:20524,39146:20478,39147:20463,39148:20497,39149:20486,39150:20547,39151:20551,39152:26371,39153:20565,39154:20560,39155:20552,39156:20570,39157:20566,39158:20588,39159:20600,39160:20608,39161:20634,39162:20613,39163:20660,39164:20658,39232:20681,39233:20682,39234:20659,39235:20674,39236:20694,39237:20702,39238:20709,39239:20717,39240:20707,39241:20718,39242:20729,39243:20725,39244:20745,39245:20737,39246:20738,39247:20758,39248:20757,39249:20756,39250:20762,39251:20769,39252:20794,39253:20791,39254:20796,39255:20795,39256:20799,39257:20800,39258:20818,39259:20812,39260:20820,39261:20834,39262:31480,39263:20841,39264:20842,39265:20846,39266:20864,39267:20866,39268:22232,39269:20876,39270:20873,39271:20879,39272:20881,39273:20883,39274:20885,39275:20886,39276:20900,39277:20902,39278:20898,39279:20905,39280:20906,39281:20907,39282:20915,39283:20913,39284:20914,39285:20912,39286:20917,39287:20925,39288:20933,39289:20937,39290:20955,39291:20960,39292:34389,39293:20969,39294:20973,39296:20976,39297:20981,39298:20990,39299:20996,39300:21003,39301:21012,39302:21006,39303:21031,39304:21034,39305:21038,39306:21043,39307:21049,39308:21071,39309:21060,39310:21067,39311:21068,39312:21086,39313:21076,39314:21098,39315:21108,39316:21097,39317:21107,39318:21119,39319:21117,39320:21133,39321:21140,39322:21138,39323:21105,39324:21128,39325:21137,39326:36776,39327:36775,39328:21164,39329:21165,39330:21180,39331:21173,39332:21185,39333:21197,39334:21207,39335:21214,39336:21219,39337:21222,39338:39149,39339:21216,39340:21235,39341:21237,39342:21240,39343:21241,39344:21254,39345:21256,39346:30008,39347:21261,39348:21264,39349:21263,39350:21269,39351:21274,39352:21283,39353:21295,39354:21297,39355:21299,39356:21304,39357:21312,39358:21318,39359:21317,39360:19991,39361:21321,39362:21325,39363:20950,39364:21342,39365:21353,39366:21358,39367:22808,39368:21371,39369:21367,39370:21378,39371:21398,39372:21408,39373:21414,39374:21413,39375:21422,39376:21424,39377:21430,39378:21443,39379:31762,39380:38617,39381:21471,39382:26364,39383:29166,39384:21486,39385:21480,39386:21485,39387:21498,39388:21505,39389:21565,39390:21568,39391:21548,39392:21549,39393:21564,39394:21550,39395:21558,39396:21545,39397:21533,39398:21582,39399:21647,39400:21621,39401:21646,39402:21599,39403:21617,39404:21623,39405:21616,39406:21650,39407:21627,39408:21632,39409:21622,39410:21636,39411:21648,39412:21638,39413:21703,39414:21666,39415:21688,39416:21669,39417:21676,39418:21700,39419:21704,39420:21672,39488:21675,39489:21698,39490:21668,39491:21694,39492:21692,39493:21720,39494:21733,39495:21734,39496:21775,39497:21780,39498:21757,39499:21742,39500:21741,39501:21754,39502:21730,39503:21817,39504:21824,39505:21859,39506:21836,39507:21806,39508:21852,39509:21829,39510:21846,39511:21847,39512:21816,39513:21811,39514:21853,39515:21913,39516:21888,39517:21679,39518:21898,39519:21919,39520:21883,39521:21886,39522:21912,39523:21918,39524:21934,39525:21884,39526:21891,39527:21929,39528:21895,39529:21928,39530:21978,39531:21957,39532:21983,39533:21956,39534:21980,39535:21988,39536:21972,39537:22036,39538:22007,39539:22038,39540:22014,39541:22013,39542:22043,39543:22009,39544:22094,39545:22096,39546:29151,39547:22068,39548:22070,39549:22066,39550:22072,39552:22123,39553:22116,39554:22063,39555:22124,39556:22122,39557:22150,39558:22144,39559:22154,39560:22176,39561:22164,39562:22159,39563:22181,39564:22190,39565:22198,39566:22196,39567:22210,39568:22204,39569:22209,39570:22211,39571:22208,39572:22216,39573:22222,39574:22225,39575:22227,39576:22231,39577:22254,39578:22265,39579:22272,39580:22271,39581:22276,39582:22281,39583:22280,39584:22283,39585:22285,39586:22291,39587:22296,39588:22294,39589:21959,39590:22300,39591:22310,39592:22327,39593:22328,39594:22350,39595:22331,39596:22336,39597:22351,39598:22377,39599:22464,39600:22408,39601:22369,39602:22399,39603:22409,39604:22419,39605:22432,39606:22451,39607:22436,39608:22442,39609:22448,39610:22467,39611:22470,39612:22484,39613:22482,39614:22483,39615:22538,39616:22486,39617:22499,39618:22539,39619:22553,39620:22557,39621:22642,39622:22561,39623:22626,39624:22603,39625:22640,39626:27584,39627:22610,39628:22589,39629:22649,39630:22661,39631:22713,39632:22687,39633:22699,39634:22714,39635:22750,39636:22715,39637:22712,39638:22702,39639:22725,39640:22739,39641:22737,39642:22743,39643:22745,39644:22744,39645:22757,39646:22748,39647:22756,39648:22751,39649:22767,39650:22778,39651:22777,39652:22779,39653:22780,39654:22781,39655:22786,39656:22794,39657:22800,39658:22811,39659:26790,39660:22821,39661:22828,39662:22829,39663:22834,39664:22840,39665:22846,39666:31442,39667:22869,39668:22864,39669:22862,39670:22874,39671:22872,39672:22882,39673:22880,39674:22887,39675:22892,39676:22889,39744:22904,39745:22913,39746:22941,39747:20318,39748:20395,39749:22947,39750:22962,39751:22982,39752:23016,39753:23004,39754:22925,39755:23001,39756:23002,39757:23077,39758:23071,39759:23057,39760:23068,39761:23049,39762:23066,39763:23104,39764:23148,39765:23113,39766:23093,39767:23094,39768:23138,39769:23146,39770:23194,39771:23228,39772:23230,39773:23243,39774:23234,39775:23229,39776:23267,39777:23255,39778:23270,39779:23273,39780:23254,39781:23290,39782:23291,39783:23308,39784:23307,39785:23318,39786:23346,39787:23248,39788:23338,39789:23350,39790:23358,39791:23363,39792:23365,39793:23360,39794:23377,39795:23381,39796:23386,39797:23387,39798:23397,39799:23401,39800:23408,39801:23411,39802:23413,39803:23416,39804:25992,39805:23418,39806:23424,39808:23427,39809:23462,39810:23480,39811:23491,39812:23495,39813:23497,39814:23508,39815:23504,39816:23524,39817:23526,39818:23522,39819:23518,39820:23525,39821:23531,39822:23536,39823:23542,39824:23539,39825:23557,39826:23559,39827:23560,39828:23565,39829:23571,39830:23584,39831:23586,39832:23592,39833:23608,39834:23609,39835:23617,39836:23622,39837:23630,39838:23635,39839:23632,39840:23631,39841:23409,39842:23660,39843:23662,39844:20066,39845:23670,39846:23673,39847:23692,39848:23697,39849:23700,39850:22939,39851:23723,39852:23739,39853:23734,39854:23740,39855:23735,39856:23749,39857:23742,39858:23751,39859:23769,39860:23785,39861:23805,39862:23802,39863:23789,39864:23948,39865:23786,39866:23819,39867:23829,39868:23831,39869:23900,39870:23839,39871:23835,39872:23825,39873:23828,39874:23842,39875:23834,39876:23833,39877:23832,39878:23884,39879:23890,39880:23886,39881:23883,39882:23916,39883:23923,39884:23926,39885:23943,39886:23940,39887:23938,39888:23970,39889:23965,39890:23980,39891:23982,39892:23997,39893:23952,39894:23991,39895:23996,39896:24009,39897:24013,39898:24019,39899:24018,39900:24022,39901:24027,39902:24043,39903:24050,39904:24053,39905:24075,39906:24090,39907:24089,39908:24081,39909:24091,39910:24118,39911:24119,39912:24132,39913:24131,39914:24128,39915:24142,39916:24151,39917:24148,39918:24159,39919:24162,39920:24164,39921:24135,39922:24181,39923:24182,39924:24186,39925:40636,39926:24191,39927:24224,39928:24257,39929:24258,39930:24264,39931:24272,39932:24271,4e4:24278,40001:24291,40002:24285,40003:24282,40004:24283,40005:24290,40006:24289,40007:24296,40008:24297,40009:24300,40010:24305,40011:24307,40012:24304,40013:24308,40014:24312,40015:24318,40016:24323,40017:24329,40018:24413,40019:24412,40020:24331,40021:24337,40022:24342,40023:24361,40024:24365,40025:24376,40026:24385,40027:24392,40028:24396,40029:24398,40030:24367,40031:24401,40032:24406,40033:24407,40034:24409,40035:24417,40036:24429,40037:24435,40038:24439,40039:24451,40040:24450,40041:24447,40042:24458,40043:24456,40044:24465,40045:24455,40046:24478,40047:24473,40048:24472,40049:24480,40050:24488,40051:24493,40052:24508,40053:24534,40054:24571,40055:24548,40056:24568,40057:24561,40058:24541,40059:24755,40060:24575,40061:24609,40062:24672,40064:24601,40065:24592,40066:24617,40067:24590,40068:24625,40069:24603,40070:24597,40071:24619,40072:24614,40073:24591,40074:24634,40075:24666,40076:24641,40077:24682,40078:24695,40079:24671,40080:24650,40081:24646,40082:24653,40083:24675,40084:24643,40085:24676,40086:24642,40087:24684,40088:24683,40089:24665,40090:24705,40091:24717,40092:24807,40093:24707,40094:24730,40095:24708,40096:24731,40097:24726,40098:24727,40099:24722,40100:24743,40101:24715,40102:24801,40103:24760,40104:24800,40105:24787,40106:24756,40107:24560,40108:24765,40109:24774,40110:24757,40111:24792,40112:24909,40113:24853,40114:24838,40115:24822,40116:24823,40117:24832,40118:24820,40119:24826,40120:24835,40121:24865,40122:24827,40123:24817,40124:24845,40125:24846,40126:24903,40127:24894,40128:24872,40129:24871,40130:24906,40131:24895,40132:24892,40133:24876,40134:24884,40135:24893,40136:24898,40137:24900,40138:24947,40139:24951,40140:24920,40141:24921,40142:24922,40143:24939,40144:24948,40145:24943,40146:24933,40147:24945,40148:24927,40149:24925,40150:24915,40151:24949,40152:24985,40153:24982,40154:24967,40155:25004,40156:24980,40157:24986,40158:24970,40159:24977,40160:25003,40161:25006,40162:25036,40163:25034,40164:25033,40165:25079,40166:25032,40167:25027,40168:25030,40169:25018,40170:25035,40171:32633,40172:25037,40173:25062,40174:25059,40175:25078,40176:25082,40177:25076,40178:25087,40179:25085,40180:25084,40181:25086,40182:25088,40183:25096,40184:25097,40185:25101,40186:25100,40187:25108,40188:25115,40256:25118,40257:25121,40258:25130,40259:25134,40260:25136,40261:25138,40262:25139,40263:25153,40264:25166,40265:25182,40266:25187,40267:25179,40268:25184,40269:25192,40270:25212,40271:25218,40272:25225,40273:25214,40274:25234,40275:25235,40276:25238,40277:25300,40278:25219,40279:25236,40280:25303,40281:25297,40282:25275,40283:25295,40284:25343,40285:25286,40286:25812,40287:25288,40288:25308,40289:25292,40290:25290,40291:25282,40292:25287,40293:25243,40294:25289,40295:25356,40296:25326,40297:25329,40298:25383,40299:25346,40300:25352,40301:25327,40302:25333,40303:25424,40304:25406,40305:25421,40306:25628,40307:25423,40308:25494,40309:25486,40310:25472,40311:25515,40312:25462,40313:25507,40314:25487,40315:25481,40316:25503,40317:25525,40318:25451,40320:25449,40321:25534,40322:25577,40323:25536,40324:25542,40325:25571,40326:25545,40327:25554,40328:25590,40329:25540,40330:25622,40331:25652,40332:25606,40333:25619,40334:25638,40335:25654,40336:25885,40337:25623,40338:25640,40339:25615,40340:25703,40341:25711,40342:25718,40343:25678,40344:25898,40345:25749,40346:25747,40347:25765,40348:25769,40349:25736,40350:25788,40351:25818,40352:25810,40353:25797,40354:25799,40355:25787,40356:25816,40357:25794,40358:25841,40359:25831,40360:33289,40361:25824,40362:25825,40363:25260,40364:25827,40365:25839,40366:25900,40367:25846,40368:25844,40369:25842,40370:25850,40371:25856,40372:25853,40373:25880,40374:25884,40375:25861,40376:25892,40377:25891,40378:25899,40379:25908,40380:25909,40381:25911,40382:25910,40383:25912,40384:30027,40385:25928,40386:25942,40387:25941,40388:25933,40389:25944,40390:25950,40391:25949,40392:25970,40393:25976,40394:25986,40395:25987,40396:35722,40397:26011,40398:26015,40399:26027,40400:26039,40401:26051,40402:26054,40403:26049,40404:26052,40405:26060,40406:26066,40407:26075,40408:26073,40409:26080,40410:26081,40411:26097,40412:26482,40413:26122,40414:26115,40415:26107,40416:26483,40417:26165,40418:26166,40419:26164,40420:26140,40421:26191,40422:26180,40423:26185,40424:26177,40425:26206,40426:26205,40427:26212,40428:26215,40429:26216,40430:26207,40431:26210,40432:26224,40433:26243,40434:26248,40435:26254,40436:26249,40437:26244,40438:26264,40439:26269,40440:26305,40441:26297,40442:26313,40443:26302,40444:26300,40512:26308,40513:26296,40514:26326,40515:26330,40516:26336,40517:26175,40518:26342,40519:26345,40520:26352,40521:26357,40522:26359,40523:26383,40524:26390,40525:26398,40526:26406,40527:26407,40528:38712,40529:26414,40530:26431,40531:26422,40532:26433,40533:26424,40534:26423,40535:26438,40536:26462,40537:26464,40538:26457,40539:26467,40540:26468,40541:26505,40542:26480,40543:26537,40544:26492,40545:26474,40546:26508,40547:26507,40548:26534,40549:26529,40550:26501,40551:26551,40552:26607,40553:26548,40554:26604,40555:26547,40556:26601,40557:26552,40558:26596,40559:26590,40560:26589,40561:26594,40562:26606,40563:26553,40564:26574,40565:26566,40566:26599,40567:27292,40568:26654,40569:26694,40570:26665,40571:26688,40572:26701,40573:26674,40574:26702,40576:26803,40577:26667,40578:26713,40579:26723,40580:26743,40581:26751,40582:26783,40583:26767,40584:26797,40585:26772,40586:26781,40587:26779,40588:26755,40589:27310,40590:26809,40591:26740,40592:26805,40593:26784,40594:26810,40595:26895,40596:26765,40597:26750,40598:26881,40599:26826,40600:26888,40601:26840,40602:26914,40603:26918,40604:26849,40605:26892,40606:26829,40607:26836,40608:26855,40609:26837,40610:26934,40611:26898,40612:26884,40613:26839,40614:26851,40615:26917,40616:26873,40617:26848,40618:26863,40619:26920,40620:26922,40621:26906,40622:26915,40623:26913,40624:26822,40625:27001,40626:26999,40627:26972,40628:27e3,40629:26987,40630:26964,40631:27006,40632:26990,40633:26937,40634:26996,40635:26941,40636:26969,40637:26928,40638:26977,40639:26974,40640:26973,40641:27009,40642:26986,40643:27058,40644:27054,40645:27088,40646:27071,40647:27073,40648:27091,40649:27070,40650:27086,40651:23528,40652:27082,40653:27101,40654:27067,40655:27075,40656:27047,40657:27182,40658:27025,40659:27040,40660:27036,40661:27029,40662:27060,40663:27102,40664:27112,40665:27138,40666:27163,40667:27135,40668:27402,40669:27129,40670:27122,40671:27111,40672:27141,40673:27057,40674:27166,40675:27117,40676:27156,40677:27115,40678:27146,40679:27154,40680:27329,40681:27171,40682:27155,40683:27204,40684:27148,40685:27250,40686:27190,40687:27256,40688:27207,40689:27234,40690:27225,40691:27238,40692:27208,40693:27192,40694:27170,40695:27280,40696:27277,40697:27296,40698:27268,40699:27298,40700:27299,40768:27287,40769:34327,40770:27323,40771:27331,40772:27330,40773:27320,40774:27315,40775:27308,40776:27358,40777:27345,40778:27359,40779:27306,40780:27354,40781:27370,40782:27387,40783:27397,40784:34326,40785:27386,40786:27410,40787:27414,40788:39729,40789:27423,40790:27448,40791:27447,40792:30428,40793:27449,40794:39150,40795:27463,40796:27459,40797:27465,40798:27472,40799:27481,40800:27476,40801:27483,40802:27487,40803:27489,40804:27512,40805:27513,40806:27519,40807:27520,40808:27524,40809:27523,40810:27533,40811:27544,40812:27541,40813:27550,40814:27556,40815:27562,40816:27563,40817:27567,40818:27570,40819:27569,40820:27571,40821:27575,40822:27580,40823:27590,40824:27595,40825:27603,40826:27615,40827:27628,40828:27627,40829:27635,40830:27631,40832:40638,40833:27656,40834:27667,40835:27668,40836:27675,40837:27684,40838:27683,40839:27742,40840:27733,40841:27746,40842:27754,40843:27778,40844:27789,40845:27802,40846:27777,40847:27803,40848:27774,40849:27752,40850:27763,40851:27794,40852:27792,40853:27844,40854:27889,40855:27859,40856:27837,40857:27863,40858:27845,40859:27869,40860:27822,40861:27825,40862:27838,40863:27834,40864:27867,40865:27887,40866:27865,40867:27882,40868:27935,40869:34893,40870:27958,40871:27947,40872:27965,40873:27960,40874:27929,40875:27957,40876:27955,40877:27922,40878:27916,40879:28003,40880:28051,40881:28004,40882:27994,40883:28025,40884:27993,40885:28046,40886:28053,40887:28644,40888:28037,40889:28153,40890:28181,40891:28170,40892:28085,40893:28103,40894:28134,40895:28088,40896:28102,40897:28140,40898:28126,40899:28108,40900:28136,40901:28114,40902:28101,40903:28154,40904:28121,40905:28132,40906:28117,40907:28138,40908:28142,40909:28205,40910:28270,40911:28206,40912:28185,40913:28274,40914:28255,40915:28222,40916:28195,40917:28267,40918:28203,40919:28278,40920:28237,40921:28191,40922:28227,40923:28218,40924:28238,40925:28196,40926:28415,40927:28189,40928:28216,40929:28290,40930:28330,40931:28312,40932:28361,40933:28343,40934:28371,40935:28349,40936:28335,40937:28356,40938:28338,40939:28372,40940:28373,40941:28303,40942:28325,40943:28354,40944:28319,40945:28481,40946:28433,40947:28748,40948:28396,40949:28408,40950:28414,40951:28479,40952:28402,40953:28465,40954:28399,40955:28466,40956:28364,161:65377,162:65378,163:65379,164:65380,165:65381,166:65382,167:65383,168:65384,169:65385,170:65386,171:65387,172:65388,173:65389,174:65390,175:65391,176:65392,177:65393,178:65394,179:65395,180:65396,181:65397,182:65398,183:65399,184:65400,185:65401,186:65402,187:65403,188:65404,189:65405,190:65406,191:65407,192:65408,193:65409,194:65410,195:65411,196:65412,197:65413,198:65414,199:65415,200:65416,201:65417,202:65418,203:65419,204:65420,205:65421,206:65422,207:65423,208:65424,209:65425,210:65426,211:65427,212:65428,213:65429,214:65430,215:65431,216:65432,217:65433,218:65434,219:65435,220:65436,221:65437,222:65438,223:65439,57408:28478,57409:28435,57410:28407,57411:28550,57412:28538,57413:28536,57414:28545,57415:28544,57416:28527,57417:28507,57418:28659,57419:28525,57420:28546,57421:28540,57422:28504,57423:28558,57424:28561,57425:28610,57426:28518,57427:28595,57428:28579,57429:28577,57430:28580,57431:28601,57432:28614,57433:28586,57434:28639,57435:28629,57436:28652,57437:28628,57438:28632,57439:28657,57440:28654,57441:28635,57442:28681,57443:28683,57444:28666,57445:28689,57446:28673,57447:28687,57448:28670,57449:28699,57450:28698,57451:28532,57452:28701,57453:28696,57454:28703,57455:28720,57456:28734,57457:28722,57458:28753,57459:28771,57460:28825,57461:28818,57462:28847,57463:28913,57464:28844,57465:28856,57466:28851,57467:28846,57468:28895,57469:28875,57470:28893,57472:28889,57473:28937,57474:28925,57475:28956,57476:28953,57477:29029,57478:29013,57479:29064,57480:29030,57481:29026,57482:29004,57483:29014,57484:29036,57485:29071,57486:29179,57487:29060,57488:29077,57489:29096,57490:29100,57491:29143,57492:29113,57493:29118,57494:29138,57495:29129,57496:29140,57497:29134,57498:29152,57499:29164,57500:29159,57501:29173,57502:29180,57503:29177,57504:29183,57505:29197,57506:29200,57507:29211,57508:29224,57509:29229,57510:29228,57511:29232,57512:29234,57513:29243,57514:29244,57515:29247,57516:29248,57517:29254,57518:29259,57519:29272,57520:29300,57521:29310,57522:29314,57523:29313,57524:29319,57525:29330,57526:29334,57527:29346,57528:29351,57529:29369,57530:29362,57531:29379,57532:29382,57533:29380,57534:29390,57535:29394,57536:29410,57537:29408,57538:29409,57539:29433,57540:29431,57541:20495,57542:29463,57543:29450,57544:29468,57545:29462,57546:29469,57547:29492,57548:29487,57549:29481,57550:29477,57551:29502,57552:29518,57553:29519,57554:40664,57555:29527,57556:29546,57557:29544,57558:29552,57559:29560,57560:29557,57561:29563,57562:29562,57563:29640,57564:29619,57565:29646,57566:29627,57567:29632,57568:29669,57569:29678,57570:29662,57571:29858,57572:29701,57573:29807,57574:29733,57575:29688,57576:29746,57577:29754,57578:29781,57579:29759,57580:29791,57581:29785,57582:29761,57583:29788,57584:29801,57585:29808,57586:29795,57587:29802,57588:29814,57589:29822,57590:29835,57591:29854,57592:29863,57593:29898,57594:29903,57595:29908,57596:29681,57664:29920,57665:29923,57666:29927,57667:29929,57668:29934,57669:29938,57670:29936,57671:29937,57672:29944,57673:29943,57674:29956,57675:29955,57676:29957,57677:29964,57678:29966,57679:29965,57680:29973,57681:29971,57682:29982,57683:29990,57684:29996,57685:30012,57686:30020,57687:30029,57688:30026,57689:30025,57690:30043,57691:30022,57692:30042,57693:30057,57694:30052,57695:30055,57696:30059,57697:30061,57698:30072,57699:30070,57700:30086,57701:30087,57702:30068,57703:30090,57704:30089,57705:30082,57706:30100,57707:30106,57708:30109,57709:30117,57710:30115,57711:30146,57712:30131,57713:30147,57714:30133,57715:30141,57716:30136,57717:30140,57718:30129,57719:30157,57720:30154,57721:30162,57722:30169,57723:30179,57724:30174,57725:30206,57726:30207,57728:30204,57729:30209,57730:30192,57731:30202,57732:30194,57733:30195,57734:30219,57735:30221,57736:30217,57737:30239,57738:30247,57739:30240,57740:30241,57741:30242,57742:30244,57743:30260,57744:30256,57745:30267,57746:30279,57747:30280,57748:30278,57749:30300,57750:30296,57751:30305,57752:30306,57753:30312,57754:30313,57755:30314,57756:30311,57757:30316,57758:30320,57759:30322,57760:30326,57761:30328,57762:30332,57763:30336,57764:30339,57765:30344,57766:30347,57767:30350,57768:30358,57769:30355,57770:30361,57771:30362,57772:30384,57773:30388,57774:30392,57775:30393,57776:30394,57777:30402,57778:30413,57779:30422,57780:30418,57781:30430,57782:30433,57783:30437,57784:30439,57785:30442,57786:34351,57787:30459,57788:30472,57789:30471,57790:30468,57791:30505,57792:30500,57793:30494,57794:30501,57795:30502,57796:30491,57797:30519,57798:30520,57799:30535,57800:30554,57801:30568,57802:30571,57803:30555,57804:30565,57805:30591,57806:30590,57807:30585,57808:30606,57809:30603,57810:30609,57811:30624,57812:30622,57813:30640,57814:30646,57815:30649,57816:30655,57817:30652,57818:30653,57819:30651,57820:30663,57821:30669,57822:30679,57823:30682,57824:30684,57825:30691,57826:30702,57827:30716,57828:30732,57829:30738,57830:31014,57831:30752,57832:31018,57833:30789,57834:30862,57835:30836,57836:30854,57837:30844,57838:30874,57839:30860,57840:30883,57841:30901,57842:30890,57843:30895,57844:30929,57845:30918,57846:30923,57847:30932,57848:30910,57849:30908,57850:30917,57851:30922,57852:30956,57920:30951,57921:30938,57922:30973,57923:30964,57924:30983,57925:30994,57926:30993,57927:31001,57928:31020,57929:31019,57930:31040,57931:31072,57932:31063,57933:31071,57934:31066,57935:31061,57936:31059,57937:31098,57938:31103,57939:31114,57940:31133,57941:31143,57942:40779,57943:31146,57944:31150,57945:31155,57946:31161,57947:31162,57948:31177,57949:31189,57950:31207,57951:31212,57952:31201,57953:31203,57954:31240,57955:31245,57956:31256,57957:31257,57958:31264,57959:31263,57960:31104,57961:31281,57962:31291,57963:31294,57964:31287,57965:31299,57966:31319,57967:31305,57968:31329,57969:31330,57970:31337,57971:40861,57972:31344,57973:31353,57974:31357,57975:31368,57976:31383,57977:31381,57978:31384,57979:31382,57980:31401,57981:31432,57982:31408,57984:31414,57985:31429,57986:31428,57987:31423,57988:36995,57989:31431,57990:31434,57991:31437,57992:31439,57993:31445,57994:31443,57995:31449,57996:31450,57997:31453,57998:31457,57999:31458,58e3:31462,58001:31469,58002:31472,58003:31490,58004:31503,58005:31498,58006:31494,58007:31539,58008:31512,58009:31513,58010:31518,58011:31541,58012:31528,58013:31542,58014:31568,58015:31610,58016:31492,58017:31565,58018:31499,58019:31564,58020:31557,58021:31605,58022:31589,58023:31604,58024:31591,58025:31600,58026:31601,58027:31596,58028:31598,58029:31645,58030:31640,58031:31647,58032:31629,58033:31644,58034:31642,58035:31627,58036:31634,58037:31631,58038:31581,58039:31641,58040:31691,58041:31681,58042:31692,58043:31695,58044:31668,58045:31686,58046:31709,58047:31721,58048:31761,58049:31764,58050:31718,58051:31717,58052:31840,58053:31744,58054:31751,58055:31763,58056:31731,58057:31735,58058:31767,58059:31757,58060:31734,58061:31779,58062:31783,58063:31786,58064:31775,58065:31799,58066:31787,58067:31805,58068:31820,58069:31811,58070:31828,58071:31823,58072:31808,58073:31824,58074:31832,58075:31839,58076:31844,58077:31830,58078:31845,58079:31852,58080:31861,58081:31875,58082:31888,58083:31908,58084:31917,58085:31906,58086:31915,58087:31905,58088:31912,58089:31923,58090:31922,58091:31921,58092:31918,58093:31929,58094:31933,58095:31936,58096:31941,58097:31938,58098:31960,58099:31954,58100:31964,58101:31970,58102:39739,58103:31983,58104:31986,58105:31988,58106:31990,58107:31994,58108:32006,58176:32002,58177:32028,58178:32021,58179:32010,58180:32069,58181:32075,58182:32046,58183:32050,58184:32063,58185:32053,58186:32070,58187:32115,58188:32086,58189:32078,58190:32114,58191:32104,58192:32110,58193:32079,58194:32099,58195:32147,58196:32137,58197:32091,58198:32143,58199:32125,58200:32155,58201:32186,58202:32174,58203:32163,58204:32181,58205:32199,58206:32189,58207:32171,58208:32317,58209:32162,58210:32175,58211:32220,58212:32184,58213:32159,58214:32176,58215:32216,58216:32221,58217:32228,58218:32222,58219:32251,58220:32242,58221:32225,58222:32261,58223:32266,58224:32291,58225:32289,58226:32274,58227:32305,58228:32287,58229:32265,58230:32267,58231:32290,58232:32326,58233:32358,58234:32315,58235:32309,58236:32313,58237:32323,58238:32311,58240:32306,58241:32314,58242:32359,58243:32349,58244:32342,58245:32350,58246:32345,58247:32346,58248:32377,58249:32362,58250:32361,58251:32380,58252:32379,58253:32387,58254:32213,58255:32381,58256:36782,58257:32383,58258:32392,58259:32393,58260:32396,58261:32402,58262:32400,58263:32403,58264:32404,58265:32406,58266:32398,58267:32411,58268:32412,58269:32568,58270:32570,58271:32581,58272:32588,58273:32589,58274:32590,58275:32592,58276:32593,58277:32597,58278:32596,58279:32600,58280:32607,58281:32608,58282:32616,58283:32617,58284:32615,58285:32632,58286:32642,58287:32646,58288:32643,58289:32648,58290:32647,58291:32652,58292:32660,58293:32670,58294:32669,58295:32666,58296:32675,58297:32687,58298:32690,58299:32697,58300:32686,58301:32694,58302:32696,58303:35697,58304:32709,58305:32710,58306:32714,58307:32725,58308:32724,58309:32737,58310:32742,58311:32745,58312:32755,58313:32761,58314:39132,58315:32774,58316:32772,58317:32779,58318:32786,58319:32792,58320:32793,58321:32796,58322:32801,58323:32808,58324:32831,58325:32827,58326:32842,58327:32838,58328:32850,58329:32856,58330:32858,58331:32863,58332:32866,58333:32872,58334:32883,58335:32882,58336:32880,58337:32886,58338:32889,58339:32893,58340:32895,58341:32900,58342:32902,58343:32901,58344:32923,58345:32915,58346:32922,58347:32941,58348:20880,58349:32940,58350:32987,58351:32997,58352:32985,58353:32989,58354:32964,58355:32986,58356:32982,58357:33033,58358:33007,58359:33009,58360:33051,58361:33065,58362:33059,58363:33071,58364:33099,58432:38539,58433:33094,58434:33086,58435:33107,58436:33105,58437:33020,58438:33137,58439:33134,58440:33125,58441:33126,58442:33140,58443:33155,58444:33160,58445:33162,58446:33152,58447:33154,58448:33184,58449:33173,58450:33188,58451:33187,58452:33119,58453:33171,58454:33193,58455:33200,58456:33205,58457:33214,58458:33208,58459:33213,58460:33216,58461:33218,58462:33210,58463:33225,58464:33229,58465:33233,58466:33241,58467:33240,58468:33224,58469:33242,58470:33247,58471:33248,58472:33255,58473:33274,58474:33275,58475:33278,58476:33281,58477:33282,58478:33285,58479:33287,58480:33290,58481:33293,58482:33296,58483:33302,58484:33321,58485:33323,58486:33336,58487:33331,58488:33344,58489:33369,58490:33368,58491:33373,58492:33370,58493:33375,58494:33380,58496:33378,58497:33384,58498:33386,58499:33387,58500:33326,58501:33393,58502:33399,58503:33400,58504:33406,58505:33421,58506:33426,58507:33451,58508:33439,58509:33467,58510:33452,58511:33505,58512:33507,58513:33503,58514:33490,58515:33524,58516:33523,58517:33530,58518:33683,58519:33539,58520:33531,58521:33529,58522:33502,58523:33542,58524:33500,58525:33545,58526:33497,58527:33589,58528:33588,58529:33558,58530:33586,58531:33585,58532:33600,58533:33593,58534:33616,58535:33605,58536:33583,58537:33579,58538:33559,58539:33560,58540:33669,58541:33690,58542:33706,58543:33695,58544:33698,58545:33686,58546:33571,58547:33678,58548:33671,58549:33674,58550:33660,58551:33717,58552:33651,58553:33653,58554:33696,58555:33673,58556:33704,58557:33780,58558:33811,58559:33771,58560:33742,58561:33789,58562:33795,58563:33752,58564:33803,58565:33729,58566:33783,58567:33799,58568:33760,58569:33778,58570:33805,58571:33826,58572:33824,58573:33725,58574:33848,58575:34054,58576:33787,58577:33901,58578:33834,58579:33852,58580:34138,58581:33924,58582:33911,58583:33899,58584:33965,58585:33902,58586:33922,58587:33897,58588:33862,58589:33836,58590:33903,58591:33913,58592:33845,58593:33994,58594:33890,58595:33977,58596:33983,58597:33951,58598:34009,58599:33997,58600:33979,58601:34010,58602:34e3,58603:33985,58604:33990,58605:34006,58606:33953,58607:34081,58608:34047,58609:34036,58610:34071,58611:34072,58612:34092,58613:34079,58614:34069,58615:34068,58616:34044,58617:34112,58618:34147,58619:34136,58620:34120,58688:34113,58689:34306,58690:34123,58691:34133,58692:34176,58693:34212,58694:34184,58695:34193,58696:34186,58697:34216,58698:34157,58699:34196,58700:34203,58701:34282,58702:34183,58703:34204,58704:34167,58705:34174,58706:34192,58707:34249,58708:34234,58709:34255,58710:34233,58711:34256,58712:34261,58713:34269,58714:34277,58715:34268,58716:34297,58717:34314,58718:34323,58719:34315,58720:34302,58721:34298,58722:34310,58723:34338,58724:34330,58725:34352,58726:34367,58727:34381,58728:20053,58729:34388,58730:34399,58731:34407,58732:34417,58733:34451,58734:34467,58735:34473,58736:34474,58737:34443,58738:34444,58739:34486,58740:34479,58741:34500,58742:34502,58743:34480,58744:34505,58745:34851,58746:34475,58747:34516,58748:34526,58749:34537,58750:34540,58752:34527,58753:34523,58754:34543,58755:34578,58756:34566,58757:34568,58758:34560,58759:34563,58760:34555,58761:34577,58762:34569,58763:34573,58764:34553,58765:34570,58766:34612,58767:34623,58768:34615,58769:34619,58770:34597,58771:34601,58772:34586,58773:34656,58774:34655,58775:34680,58776:34636,58777:34638,58778:34676,58779:34647,58780:34664,58781:34670,58782:34649,58783:34643,58784:34659,58785:34666,58786:34821,58787:34722,58788:34719,58789:34690,58790:34735,58791:34763,58792:34749,58793:34752,58794:34768,58795:38614,58796:34731,58797:34756,58798:34739,58799:34759,58800:34758,58801:34747,58802:34799,58803:34802,58804:34784,58805:34831,58806:34829,58807:34814,58808:34806,58809:34807,58810:34830,58811:34770,58812:34833,58813:34838,58814:34837,58815:34850,58816:34849,58817:34865,58818:34870,58819:34873,58820:34855,58821:34875,58822:34884,58823:34882,58824:34898,58825:34905,58826:34910,58827:34914,58828:34923,58829:34945,58830:34942,58831:34974,58832:34933,58833:34941,58834:34997,58835:34930,58836:34946,58837:34967,58838:34962,58839:34990,58840:34969,58841:34978,58842:34957,58843:34980,58844:34992,58845:35007,58846:34993,58847:35011,58848:35012,58849:35028,58850:35032,58851:35033,58852:35037,58853:35065,58854:35074,58855:35068,58856:35060,58857:35048,58858:35058,58859:35076,58860:35084,58861:35082,58862:35091,58863:35139,58864:35102,58865:35109,58866:35114,58867:35115,58868:35137,58869:35140,58870:35131,58871:35126,58872:35128,58873:35148,58874:35101,58875:35168,58876:35166,58944:35174,58945:35172,58946:35181,58947:35178,58948:35183,58949:35188,58950:35191,58951:35198,58952:35203,58953:35208,58954:35210,58955:35219,58956:35224,58957:35233,58958:35241,58959:35238,58960:35244,58961:35247,58962:35250,58963:35258,58964:35261,58965:35263,58966:35264,58967:35290,58968:35292,58969:35293,58970:35303,58971:35316,58972:35320,58973:35331,58974:35350,58975:35344,58976:35340,58977:35355,58978:35357,58979:35365,58980:35382,58981:35393,58982:35419,58983:35410,58984:35398,58985:35400,58986:35452,58987:35437,58988:35436,58989:35426,58990:35461,58991:35458,58992:35460,58993:35496,58994:35489,58995:35473,58996:35493,58997:35494,58998:35482,58999:35491,59e3:35524,59001:35533,59002:35522,59003:35546,59004:35563,59005:35571,59006:35559,59008:35556,59009:35569,59010:35604,59011:35552,59012:35554,59013:35575,59014:35550,59015:35547,59016:35596,59017:35591,59018:35610,59019:35553,59020:35606,59021:35600,59022:35607,59023:35616,59024:35635,59025:38827,59026:35622,59027:35627,59028:35646,59029:35624,59030:35649,59031:35660,59032:35663,59033:35662,59034:35657,59035:35670,59036:35675,59037:35674,59038:35691,59039:35679,59040:35692,59041:35695,59042:35700,59043:35709,59044:35712,59045:35724,59046:35726,59047:35730,59048:35731,59049:35734,59050:35737,59051:35738,59052:35898,59053:35905,59054:35903,59055:35912,59056:35916,59057:35918,59058:35920,59059:35925,59060:35938,59061:35948,59062:35960,59063:35962,59064:35970,59065:35977,59066:35973,59067:35978,59068:35981,59069:35982,59070:35988,59071:35964,59072:35992,59073:25117,59074:36013,59075:36010,59076:36029,59077:36018,59078:36019,59079:36014,59080:36022,59081:36040,59082:36033,59083:36068,59084:36067,59085:36058,59086:36093,59087:36090,59088:36091,59089:36100,59090:36101,59091:36106,59092:36103,59093:36111,59094:36109,59095:36112,59096:40782,59097:36115,59098:36045,59099:36116,59100:36118,59101:36199,59102:36205,59103:36209,59104:36211,59105:36225,59106:36249,59107:36290,59108:36286,59109:36282,59110:36303,59111:36314,59112:36310,59113:36300,59114:36315,59115:36299,59116:36330,59117:36331,59118:36319,59119:36323,59120:36348,59121:36360,59122:36361,59123:36351,59124:36381,59125:36382,59126:36368,59127:36383,59128:36418,59129:36405,59130:36400,59131:36404,59132:36426,59200:36423,59201:36425,59202:36428,59203:36432,59204:36424,59205:36441,59206:36452,59207:36448,59208:36394,59209:36451,59210:36437,59211:36470,59212:36466,59213:36476,59214:36481,59215:36487,59216:36485,59217:36484,59218:36491,59219:36490,59220:36499,59221:36497,59222:36500,59223:36505,59224:36522,59225:36513,59226:36524,59227:36528,59228:36550,59229:36529,59230:36542,59231:36549,59232:36552,59233:36555,59234:36571,59235:36579,59236:36604,59237:36603,59238:36587,59239:36606,59240:36618,59241:36613,59242:36629,59243:36626,59244:36633,59245:36627,59246:36636,59247:36639,59248:36635,59249:36620,59250:36646,59251:36659,59252:36667,59253:36665,59254:36677,59255:36674,59256:36670,59257:36684,59258:36681,59259:36678,59260:36686,59261:36695,59262:36700,59264:36706,59265:36707,59266:36708,59267:36764,59268:36767,59269:36771,59270:36781,59271:36783,59272:36791,59273:36826,59274:36837,59275:36834,59276:36842,59277:36847,59278:36999,59279:36852,59280:36869,59281:36857,59282:36858,59283:36881,59284:36885,59285:36897,59286:36877,59287:36894,59288:36886,59289:36875,59290:36903,59291:36918,59292:36917,59293:36921,59294:36856,59295:36943,59296:36944,59297:36945,59298:36946,59299:36878,59300:36937,59301:36926,59302:36950,59303:36952,59304:36958,59305:36968,59306:36975,59307:36982,59308:38568,59309:36978,59310:36994,59311:36989,59312:36993,59313:36992,59314:37002,59315:37001,59316:37007,59317:37032,59318:37039,59319:37041,59320:37045,59321:37090,59322:37092,59323:25160,59324:37083,59325:37122,59326:37138,59327:37145,59328:37170,59329:37168,59330:37194,59331:37206,59332:37208,59333:37219,59334:37221,59335:37225,59336:37235,59337:37234,59338:37259,59339:37257,59340:37250,59341:37282,59342:37291,59343:37295,59344:37290,59345:37301,59346:37300,59347:37306,59348:37312,59349:37313,59350:37321,59351:37323,59352:37328,59353:37334,59354:37343,59355:37345,59356:37339,59357:37372,59358:37365,59359:37366,59360:37406,59361:37375,59362:37396,59363:37420,59364:37397,59365:37393,59366:37470,59367:37463,59368:37445,59369:37449,59370:37476,59371:37448,59372:37525,59373:37439,59374:37451,59375:37456,59376:37532,59377:37526,59378:37523,59379:37531,59380:37466,59381:37583,59382:37561,59383:37559,59384:37609,59385:37647,59386:37626,59387:37700,59388:37678,59456:37657,59457:37666,59458:37658,59459:37667,59460:37690,59461:37685,59462:37691,59463:37724,59464:37728,59465:37756,59466:37742,59467:37718,59468:37808,59469:37804,59470:37805,59471:37780,59472:37817,59473:37846,59474:37847,59475:37864,59476:37861,59477:37848,59478:37827,59479:37853,59480:37840,59481:37832,59482:37860,59483:37914,59484:37908,59485:37907,59486:37891,59487:37895,59488:37904,59489:37942,59490:37931,59491:37941,59492:37921,59493:37946,59494:37953,59495:37970,59496:37956,59497:37979,59498:37984,59499:37986,59500:37982,59501:37994,59502:37417,59503:38e3,59504:38005,59505:38007,59506:38013,59507:37978,59508:38012,59509:38014,59510:38017,59511:38015,59512:38274,59513:38279,59514:38282,59515:38292,59516:38294,59517:38296,59518:38297,59520:38304,59521:38312,59522:38311,59523:38317,59524:38332,59525:38331,59526:38329,59527:38334,59528:38346,59529:28662,59530:38339,59531:38349,59532:38348,59533:38357,59534:38356,59535:38358,59536:38364,59537:38369,59538:38373,59539:38370,59540:38433,59541:38440,59542:38446,59543:38447,59544:38466,59545:38476,59546:38479,59547:38475,59548:38519,59549:38492,59550:38494,59551:38493,59552:38495,59553:38502,59554:38514,59555:38508,59556:38541,59557:38552,59558:38549,59559:38551,59560:38570,59561:38567,59562:38577,59563:38578,59564:38576,59565:38580,59566:38582,59567:38584,59568:38585,59569:38606,59570:38603,59571:38601,59572:38605,59573:35149,59574:38620,59575:38669,59576:38613,59577:38649,59578:38660,59579:38662,59580:38664,59581:38675,59582:38670,59583:38673,59584:38671,59585:38678,59586:38681,59587:38692,59588:38698,59589:38704,59590:38713,59591:38717,59592:38718,59593:38724,59594:38726,59595:38728,59596:38722,59597:38729,59598:38748,59599:38752,59600:38756,59601:38758,59602:38760,59603:21202,59604:38763,59605:38769,59606:38777,59607:38789,59608:38780,59609:38785,59610:38778,59611:38790,59612:38795,59613:38799,59614:38800,59615:38812,59616:38824,59617:38822,59618:38819,59619:38835,59620:38836,59621:38851,59622:38854,59623:38856,59624:38859,59625:38876,59626:38893,59627:40783,59628:38898,59629:31455,59630:38902,59631:38901,59632:38927,59633:38924,59634:38968,59635:38948,59636:38945,59637:38967,59638:38973,59639:38982,59640:38991,59641:38987,59642:39019,59643:39023,59644:39024,59712:39025,59713:39028,59714:39027,59715:39082,59716:39087,59717:39089,59718:39094,59719:39108,59720:39107,59721:39110,59722:39145,59723:39147,59724:39171,59725:39177,59726:39186,59727:39188,59728:39192,59729:39201,59730:39197,59731:39198,59732:39204,59733:39200,59734:39212,59735:39214,59736:39229,59737:39230,59738:39234,59739:39241,59740:39237,59741:39248,59742:39243,59743:39249,59744:39250,59745:39244,59746:39253,59747:39319,59748:39320,59749:39333,59750:39341,59751:39342,59752:39356,59753:39391,59754:39387,59755:39389,59756:39384,59757:39377,59758:39405,59759:39406,59760:39409,59761:39410,59762:39419,59763:39416,59764:39425,59765:39439,59766:39429,59767:39394,59768:39449,59769:39467,59770:39479,59771:39493,59772:39490,59773:39488,59774:39491,59776:39486,59777:39509,59778:39501,59779:39515,59780:39511,59781:39519,59782:39522,59783:39525,59784:39524,59785:39529,59786:39531,59787:39530,59788:39597,59789:39600,59790:39612,59791:39616,59792:39631,59793:39633,59794:39635,59795:39636,59796:39646,59797:39647,59798:39650,59799:39651,59800:39654,59801:39663,59802:39659,59803:39662,59804:39668,59805:39665,59806:39671,59807:39675,59808:39686,59809:39704,59810:39706,59811:39711,59812:39714,59813:39715,59814:39717,59815:39719,59816:39720,59817:39721,59818:39722,59819:39726,59820:39727,59821:39730,59822:39748,59823:39747,59824:39759,59825:39757,59826:39758,59827:39761,59828:39768,59829:39796,59830:39827,59831:39811,59832:39825,59833:39830,59834:39831,59835:39839,59836:39840,59837:39848,59838:39860,59839:39872,59840:39882,59841:39865,59842:39878,59843:39887,59844:39889,59845:39890,59846:39907,59847:39906,59848:39908,59849:39892,59850:39905,59851:39994,59852:39922,59853:39921,59854:39920,59855:39957,59856:39956,59857:39945,59858:39955,59859:39948,59860:39942,59861:39944,59862:39954,59863:39946,59864:39940,59865:39982,59866:39963,59867:39973,59868:39972,59869:39969,59870:39984,59871:40007,59872:39986,59873:40006,59874:39998,59875:40026,59876:40032,59877:40039,59878:40054,59879:40056,59880:40167,59881:40172,59882:40176,59883:40201,59884:40200,59885:40171,59886:40195,59887:40198,59888:40234,59889:40230,59890:40367,59891:40227,59892:40223,59893:40260,59894:40213,59895:40210,59896:40257,59897:40255,59898:40254,59899:40262,59900:40264,59968:40285,59969:40286,59970:40292,59971:40273,59972:40272,59973:40281,59974:40306,59975:40329,59976:40327,59977:40363,59978:40303,59979:40314,59980:40346,59981:40356,59982:40361,59983:40370,59984:40388,59985:40385,59986:40379,59987:40376,59988:40378,59989:40390,59990:40399,59991:40386,59992:40409,59993:40403,59994:40440,59995:40422,59996:40429,59997:40431,59998:40445,59999:40474,6e4:40475,60001:40478,60002:40565,60003:40569,60004:40573,60005:40577,60006:40584,60007:40587,60008:40588,60009:40594,60010:40597,60011:40593,60012:40605,60013:40613,60014:40617,60015:40632,60016:40618,60017:40621,60018:38753,60019:40652,60020:40654,60021:40655,60022:40656,60023:40660,60024:40668,60025:40670,60026:40669,60027:40672,60028:40677,60029:40680,60030:40687,60032:40692,60033:40694,60034:40695,60035:40697,60036:40699,60037:40700,60038:40701,60039:40711,60040:40712,60041:30391,60042:40725,60043:40737,60044:40748,60045:40766,60046:40778,60047:40786,60048:40788,60049:40803,60050:40799,60051:40800,60052:40801,60053:40806,60054:40807,60055:40812,60056:40810,60057:40823,60058:40818,60059:40822,60060:40853,60061:40860,60062:40864,60063:22575,60064:27079,60065:36953,60066:29796,60067:20956,60068:29081}}),(function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),i=n(2);function a(e,t,n,r){var i;t.degree()<n.degree()&&(i=[n,t],t=i[0],n=i[1]);for(var a=t,o=n,s=e.zero,c=e.one;o.degree()>=r/2;){var l=a,u=s;if(a=o,s=c,a.isZero())return null;o=l;for(var d=e.zero,f=a.getCoefficient(a.degree()),p=e.inverse(f);o.degree()>=a.degree()&&!o.isZero();){var m=o.degree()-a.degree(),h=e.multiply(o.getCoefficient(o.degree()),p);d=d.addOrSubtract(e.buildMonomial(m,h)),o=o.addOrSubtract(a.multiplyByMonomial(m,h))}if(c=d.multiplyPoly(s).addOrSubtract(u),o.degree()>=a.degree())return null}var g=c.getCoefficient(0);if(g===0)return null;var _=e.inverse(g);return[c.multiply(_),o.multiply(_)]}function o(e,t){var n=t.degree();if(n===1)return[t.getCoefficient(1)];for(var r=Array(n),i=0,a=1;a<e.size&&i<n;a++)t.evaluateAt(a)===0&&(r[i]=e.inverse(a),i++);return i===n?r:null}function s(e,t,n){for(var i=n.length,a=Array(i),o=0;o<i;o++){for(var s=e.inverse(n[o]),c=1,l=0;l<i;l++)o!==l&&(c=e.multiply(c,r.addOrSubtractGF(1,e.multiply(n[l],s))));a[o]=e.multiply(t.evaluateAt(s),e.inverse(c)),e.generatorBase!==0&&(a[o]=e.multiply(a[o],s))}return a}function c(e,t){var n=new Uint8ClampedArray(e.length);n.set(e);for(var c=new r.default(285,256,0),l=new i.default(c,n),u=new Uint8ClampedArray(t),d=!1,f=0;f<t;f++){var p=l.evaluateAt(c.exp(f+c.generatorBase));u[u.length-1-f]=p,p!==0&&(d=!0)}if(!d)return n;var m=new i.default(c,u),h=a(c,c.buildMonomial(t,1),m,t);if(h===null)return null;var g=o(c,h[0]);if(g==null)return null;for(var _=s(c,h[1],g),v=0;v<g.length;v++){var y=n.length-1-c.log(g[v]);if(y<0)return null;n[y]=r.addOrSubtractGF(n[y],_[v])}return n}t.decode=c}),(function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.VERSIONS=[{infoBits:null,versionNumber:1,alignmentPatternCenters:[],errorCorrectionLevels:[{ecCodewordsPerBlock:7,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:19}]},{ecCodewordsPerBlock:10,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:16}]},{ecCodewordsPerBlock:13,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:13}]},{ecCodewordsPerBlock:17,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:9}]}]},{infoBits:null,versionNumber:2,alignmentPatternCenters:[6,18],errorCorrectionLevels:[{ecCodewordsPerBlock:10,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:34}]},{ecCodewordsPerBlock:16,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:28}]},{ecCodewordsPerBlock:22,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:22}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:16}]}]},{infoBits:null,versionNumber:3,alignmentPatternCenters:[6,22],errorCorrectionLevels:[{ecCodewordsPerBlock:15,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:55}]},{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:44}]},{ecCodewordsPerBlock:18,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:17}]},{ecCodewordsPerBlock:22,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:13}]}]},{infoBits:null,versionNumber:4,alignmentPatternCenters:[6,26],errorCorrectionLevels:[{ecCodewordsPerBlock:20,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:80}]},{ecCodewordsPerBlock:18,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:32}]},{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:24}]},{ecCodewordsPerBlock:16,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:9}]}]},{infoBits:null,versionNumber:5,alignmentPatternCenters:[6,30],errorCorrectionLevels:[{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:108}]},{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:43}]},{ecCodewordsPerBlock:18,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:15},{numBlocks:2,dataCodewordsPerBlock:16}]},{ecCodewordsPerBlock:22,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:11},{numBlocks:2,dataCodewordsPerBlock:12}]}]},{infoBits:null,versionNumber:6,alignmentPatternCenters:[6,34],errorCorrectionLevels:[{ecCodewordsPerBlock:18,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:68}]},{ecCodewordsPerBlock:16,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:27}]},{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:19}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:15}]}]},{infoBits:31892,versionNumber:7,alignmentPatternCenters:[6,22,38],errorCorrectionLevels:[{ecCodewordsPerBlock:20,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:78}]},{ecCodewordsPerBlock:18,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:31}]},{ecCodewordsPerBlock:18,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:14},{numBlocks:4,dataCodewordsPerBlock:15}]},{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:13},{numBlocks:1,dataCodewordsPerBlock:14}]}]},{infoBits:34236,versionNumber:8,alignmentPatternCenters:[6,24,42],errorCorrectionLevels:[{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:97}]},{ecCodewordsPerBlock:22,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:38},{numBlocks:2,dataCodewordsPerBlock:39}]},{ecCodewordsPerBlock:22,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:18},{numBlocks:2,dataCodewordsPerBlock:19}]},{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:14},{numBlocks:2,dataCodewordsPerBlock:15}]}]},{infoBits:39577,versionNumber:9,alignmentPatternCenters:[6,26,46],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:116}]},{ecCodewordsPerBlock:22,ecBlocks:[{numBlocks:3,dataCodewordsPerBlock:36},{numBlocks:2,dataCodewordsPerBlock:37}]},{ecCodewordsPerBlock:20,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:16},{numBlocks:4,dataCodewordsPerBlock:17}]},{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:12},{numBlocks:4,dataCodewordsPerBlock:13}]}]},{infoBits:42195,versionNumber:10,alignmentPatternCenters:[6,28,50],errorCorrectionLevels:[{ecCodewordsPerBlock:18,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:68},{numBlocks:2,dataCodewordsPerBlock:69}]},{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:43},{numBlocks:1,dataCodewordsPerBlock:44}]},{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:6,dataCodewordsPerBlock:19},{numBlocks:2,dataCodewordsPerBlock:20}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:6,dataCodewordsPerBlock:15},{numBlocks:2,dataCodewordsPerBlock:16}]}]},{infoBits:48118,versionNumber:11,alignmentPatternCenters:[6,30,54],errorCorrectionLevels:[{ecCodewordsPerBlock:20,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:81}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:50},{numBlocks:4,dataCodewordsPerBlock:51}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:22},{numBlocks:4,dataCodewordsPerBlock:23}]},{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:3,dataCodewordsPerBlock:12},{numBlocks:8,dataCodewordsPerBlock:13}]}]},{infoBits:51042,versionNumber:12,alignmentPatternCenters:[6,32,58],errorCorrectionLevels:[{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:92},{numBlocks:2,dataCodewordsPerBlock:93}]},{ecCodewordsPerBlock:22,ecBlocks:[{numBlocks:6,dataCodewordsPerBlock:36},{numBlocks:2,dataCodewordsPerBlock:37}]},{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:20},{numBlocks:6,dataCodewordsPerBlock:21}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:7,dataCodewordsPerBlock:14},{numBlocks:4,dataCodewordsPerBlock:15}]}]},{infoBits:55367,versionNumber:13,alignmentPatternCenters:[6,34,62],errorCorrectionLevels:[{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:107}]},{ecCodewordsPerBlock:22,ecBlocks:[{numBlocks:8,dataCodewordsPerBlock:37},{numBlocks:1,dataCodewordsPerBlock:38}]},{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:8,dataCodewordsPerBlock:20},{numBlocks:4,dataCodewordsPerBlock:21}]},{ecCodewordsPerBlock:22,ecBlocks:[{numBlocks:12,dataCodewordsPerBlock:11},{numBlocks:4,dataCodewordsPerBlock:12}]}]},{infoBits:58893,versionNumber:14,alignmentPatternCenters:[6,26,46,66],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:3,dataCodewordsPerBlock:115},{numBlocks:1,dataCodewordsPerBlock:116}]},{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:40},{numBlocks:5,dataCodewordsPerBlock:41}]},{ecCodewordsPerBlock:20,ecBlocks:[{numBlocks:11,dataCodewordsPerBlock:16},{numBlocks:5,dataCodewordsPerBlock:17}]},{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:11,dataCodewordsPerBlock:12},{numBlocks:5,dataCodewordsPerBlock:13}]}]},{infoBits:63784,versionNumber:15,alignmentPatternCenters:[6,26,48,70],errorCorrectionLevels:[{ecCodewordsPerBlock:22,ecBlocks:[{numBlocks:5,dataCodewordsPerBlock:87},{numBlocks:1,dataCodewordsPerBlock:88}]},{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:5,dataCodewordsPerBlock:41},{numBlocks:5,dataCodewordsPerBlock:42}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:5,dataCodewordsPerBlock:24},{numBlocks:7,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:11,dataCodewordsPerBlock:12},{numBlocks:7,dataCodewordsPerBlock:13}]}]},{infoBits:68472,versionNumber:16,alignmentPatternCenters:[6,26,50,74],errorCorrectionLevels:[{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:5,dataCodewordsPerBlock:98},{numBlocks:1,dataCodewordsPerBlock:99}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:7,dataCodewordsPerBlock:45},{numBlocks:3,dataCodewordsPerBlock:46}]},{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:15,dataCodewordsPerBlock:19},{numBlocks:2,dataCodewordsPerBlock:20}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:3,dataCodewordsPerBlock:15},{numBlocks:13,dataCodewordsPerBlock:16}]}]},{infoBits:70749,versionNumber:17,alignmentPatternCenters:[6,30,54,78],errorCorrectionLevels:[{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:107},{numBlocks:5,dataCodewordsPerBlock:108}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:10,dataCodewordsPerBlock:46},{numBlocks:1,dataCodewordsPerBlock:47}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:22},{numBlocks:15,dataCodewordsPerBlock:23}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:14},{numBlocks:17,dataCodewordsPerBlock:15}]}]},{infoBits:76311,versionNumber:18,alignmentPatternCenters:[6,30,56,82],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:5,dataCodewordsPerBlock:120},{numBlocks:1,dataCodewordsPerBlock:121}]},{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:9,dataCodewordsPerBlock:43},{numBlocks:4,dataCodewordsPerBlock:44}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:17,dataCodewordsPerBlock:22},{numBlocks:1,dataCodewordsPerBlock:23}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:14},{numBlocks:19,dataCodewordsPerBlock:15}]}]},{infoBits:79154,versionNumber:19,alignmentPatternCenters:[6,30,58,86],errorCorrectionLevels:[{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:3,dataCodewordsPerBlock:113},{numBlocks:4,dataCodewordsPerBlock:114}]},{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:3,dataCodewordsPerBlock:44},{numBlocks:11,dataCodewordsPerBlock:45}]},{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:17,dataCodewordsPerBlock:21},{numBlocks:4,dataCodewordsPerBlock:22}]},{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:9,dataCodewordsPerBlock:13},{numBlocks:16,dataCodewordsPerBlock:14}]}]},{infoBits:84390,versionNumber:20,alignmentPatternCenters:[6,34,62,90],errorCorrectionLevels:[{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:3,dataCodewordsPerBlock:107},{numBlocks:5,dataCodewordsPerBlock:108}]},{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:3,dataCodewordsPerBlock:41},{numBlocks:13,dataCodewordsPerBlock:42}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:15,dataCodewordsPerBlock:24},{numBlocks:5,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:15,dataCodewordsPerBlock:15},{numBlocks:10,dataCodewordsPerBlock:16}]}]},{infoBits:87683,versionNumber:21,alignmentPatternCenters:[6,28,50,72,94],errorCorrectionLevels:[{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:116},{numBlocks:4,dataCodewordsPerBlock:117}]},{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:17,dataCodewordsPerBlock:42}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:17,dataCodewordsPerBlock:22},{numBlocks:6,dataCodewordsPerBlock:23}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:19,dataCodewordsPerBlock:16},{numBlocks:6,dataCodewordsPerBlock:17}]}]},{infoBits:92361,versionNumber:22,alignmentPatternCenters:[6,26,50,74,98],errorCorrectionLevels:[{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:111},{numBlocks:7,dataCodewordsPerBlock:112}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:17,dataCodewordsPerBlock:46}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:7,dataCodewordsPerBlock:24},{numBlocks:16,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:34,dataCodewordsPerBlock:13}]}]},{infoBits:96236,versionNumber:23,alignmentPatternCenters:[6,30,54,74,102],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:121},{numBlocks:5,dataCodewordsPerBlock:122}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:47},{numBlocks:14,dataCodewordsPerBlock:48}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:11,dataCodewordsPerBlock:24},{numBlocks:14,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:16,dataCodewordsPerBlock:15},{numBlocks:14,dataCodewordsPerBlock:16}]}]},{infoBits:102084,versionNumber:24,alignmentPatternCenters:[6,28,54,80,106],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:6,dataCodewordsPerBlock:117},{numBlocks:4,dataCodewordsPerBlock:118}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:6,dataCodewordsPerBlock:45},{numBlocks:14,dataCodewordsPerBlock:46}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:11,dataCodewordsPerBlock:24},{numBlocks:16,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:30,dataCodewordsPerBlock:16},{numBlocks:2,dataCodewordsPerBlock:17}]}]},{infoBits:102881,versionNumber:25,alignmentPatternCenters:[6,32,58,84,110],errorCorrectionLevels:[{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:8,dataCodewordsPerBlock:106},{numBlocks:4,dataCodewordsPerBlock:107}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:8,dataCodewordsPerBlock:47},{numBlocks:13,dataCodewordsPerBlock:48}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:7,dataCodewordsPerBlock:24},{numBlocks:22,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:22,dataCodewordsPerBlock:15},{numBlocks:13,dataCodewordsPerBlock:16}]}]},{infoBits:110507,versionNumber:26,alignmentPatternCenters:[6,30,58,86,114],errorCorrectionLevels:[{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:10,dataCodewordsPerBlock:114},{numBlocks:2,dataCodewordsPerBlock:115}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:19,dataCodewordsPerBlock:46},{numBlocks:4,dataCodewordsPerBlock:47}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:28,dataCodewordsPerBlock:22},{numBlocks:6,dataCodewordsPerBlock:23}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:33,dataCodewordsPerBlock:16},{numBlocks:4,dataCodewordsPerBlock:17}]}]},{infoBits:110734,versionNumber:27,alignmentPatternCenters:[6,34,62,90,118],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:8,dataCodewordsPerBlock:122},{numBlocks:4,dataCodewordsPerBlock:123}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:22,dataCodewordsPerBlock:45},{numBlocks:3,dataCodewordsPerBlock:46}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:8,dataCodewordsPerBlock:23},{numBlocks:26,dataCodewordsPerBlock:24}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:12,dataCodewordsPerBlock:15},{numBlocks:28,dataCodewordsPerBlock:16}]}]},{infoBits:117786,versionNumber:28,alignmentPatternCenters:[6,26,50,74,98,122],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:3,dataCodewordsPerBlock:117},{numBlocks:10,dataCodewordsPerBlock:118}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:3,dataCodewordsPerBlock:45},{numBlocks:23,dataCodewordsPerBlock:46}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:24},{numBlocks:31,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:11,dataCodewordsPerBlock:15},{numBlocks:31,dataCodewordsPerBlock:16}]}]},{infoBits:119615,versionNumber:29,alignmentPatternCenters:[6,30,54,78,102,126],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:7,dataCodewordsPerBlock:116},{numBlocks:7,dataCodewordsPerBlock:117}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:21,dataCodewordsPerBlock:45},{numBlocks:7,dataCodewordsPerBlock:46}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:23},{numBlocks:37,dataCodewordsPerBlock:24}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:19,dataCodewordsPerBlock:15},{numBlocks:26,dataCodewordsPerBlock:16}]}]},{infoBits:126325,versionNumber:30,alignmentPatternCenters:[6,26,52,78,104,130],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:5,dataCodewordsPerBlock:115},{numBlocks:10,dataCodewordsPerBlock:116}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:19,dataCodewordsPerBlock:47},{numBlocks:10,dataCodewordsPerBlock:48}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:15,dataCodewordsPerBlock:24},{numBlocks:25,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:23,dataCodewordsPerBlock:15},{numBlocks:25,dataCodewordsPerBlock:16}]}]},{infoBits:127568,versionNumber:31,alignmentPatternCenters:[6,30,56,82,108,134],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:13,dataCodewordsPerBlock:115},{numBlocks:3,dataCodewordsPerBlock:116}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:46},{numBlocks:29,dataCodewordsPerBlock:47}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:42,dataCodewordsPerBlock:24},{numBlocks:1,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:23,dataCodewordsPerBlock:15},{numBlocks:28,dataCodewordsPerBlock:16}]}]},{infoBits:133589,versionNumber:32,alignmentPatternCenters:[6,34,60,86,112,138],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:17,dataCodewordsPerBlock:115}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:10,dataCodewordsPerBlock:46},{numBlocks:23,dataCodewordsPerBlock:47}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:10,dataCodewordsPerBlock:24},{numBlocks:35,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:19,dataCodewordsPerBlock:15},{numBlocks:35,dataCodewordsPerBlock:16}]}]},{infoBits:136944,versionNumber:33,alignmentPatternCenters:[6,30,58,86,114,142],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:17,dataCodewordsPerBlock:115},{numBlocks:1,dataCodewordsPerBlock:116}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:14,dataCodewordsPerBlock:46},{numBlocks:21,dataCodewordsPerBlock:47}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:29,dataCodewordsPerBlock:24},{numBlocks:19,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:11,dataCodewordsPerBlock:15},{numBlocks:46,dataCodewordsPerBlock:16}]}]},{infoBits:141498,versionNumber:34,alignmentPatternCenters:[6,34,62,90,118,146],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:13,dataCodewordsPerBlock:115},{numBlocks:6,dataCodewordsPerBlock:116}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:14,dataCodewordsPerBlock:46},{numBlocks:23,dataCodewordsPerBlock:47}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:44,dataCodewordsPerBlock:24},{numBlocks:7,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:59,dataCodewordsPerBlock:16},{numBlocks:1,dataCodewordsPerBlock:17}]}]},{infoBits:145311,versionNumber:35,alignmentPatternCenters:[6,30,54,78,102,126,150],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:12,dataCodewordsPerBlock:121},{numBlocks:7,dataCodewordsPerBlock:122}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:12,dataCodewordsPerBlock:47},{numBlocks:26,dataCodewordsPerBlock:48}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:39,dataCodewordsPerBlock:24},{numBlocks:14,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:22,dataCodewordsPerBlock:15},{numBlocks:41,dataCodewordsPerBlock:16}]}]},{infoBits:150283,versionNumber:36,alignmentPatternCenters:[6,24,50,76,102,128,154],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:6,dataCodewordsPerBlock:121},{numBlocks:14,dataCodewordsPerBlock:122}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:6,dataCodewordsPerBlock:47},{numBlocks:34,dataCodewordsPerBlock:48}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:46,dataCodewordsPerBlock:24},{numBlocks:10,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:15},{numBlocks:64,dataCodewordsPerBlock:16}]}]},{infoBits:152622,versionNumber:37,alignmentPatternCenters:[6,28,54,80,106,132,158],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:17,dataCodewordsPerBlock:122},{numBlocks:4,dataCodewordsPerBlock:123}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:29,dataCodewordsPerBlock:46},{numBlocks:14,dataCodewordsPerBlock:47}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:49,dataCodewordsPerBlock:24},{numBlocks:10,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:24,dataCodewordsPerBlock:15},{numBlocks:46,dataCodewordsPerBlock:16}]}]},{infoBits:158308,versionNumber:38,alignmentPatternCenters:[6,32,58,84,110,136,162],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:122},{numBlocks:18,dataCodewordsPerBlock:123}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:13,dataCodewordsPerBlock:46},{numBlocks:32,dataCodewordsPerBlock:47}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:48,dataCodewordsPerBlock:24},{numBlocks:14,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:42,dataCodewordsPerBlock:15},{numBlocks:32,dataCodewordsPerBlock:16}]}]},{infoBits:161089,versionNumber:39,alignmentPatternCenters:[6,26,54,82,110,138,166],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:20,dataCodewordsPerBlock:117},{numBlocks:4,dataCodewordsPerBlock:118}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:40,dataCodewordsPerBlock:47},{numBlocks:7,dataCodewordsPerBlock:48}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:43,dataCodewordsPerBlock:24},{numBlocks:22,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:10,dataCodewordsPerBlock:15},{numBlocks:67,dataCodewordsPerBlock:16}]}]},{infoBits:167017,versionNumber:40,alignmentPatternCenters:[6,30,58,86,114,142,170],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:19,dataCodewordsPerBlock:118},{numBlocks:6,dataCodewordsPerBlock:119}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:18,dataCodewordsPerBlock:47},{numBlocks:31,dataCodewordsPerBlock:48}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:34,dataCodewordsPerBlock:24},{numBlocks:34,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:20,dataCodewordsPerBlock:15},{numBlocks:61,dataCodewordsPerBlock:16}]}]}]}),(function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0});var r=n(0);function i(e,t,n,r){var i=e.x-t.x+n.x-r.x,a=e.y-t.y+n.y-r.y;if(i===0&&a===0)return{a11:t.x-e.x,a12:t.y-e.y,a13:0,a21:n.x-t.x,a22:n.y-t.y,a23:0,a31:e.x,a32:e.y,a33:1};var o=t.x-n.x,s=r.x-n.x,c=t.y-n.y,l=r.y-n.y,u=o*l-s*c,d=(i*l-s*a)/u,f=(o*a-i*c)/u;return{a11:t.x-e.x+d*t.x,a12:t.y-e.y+d*t.y,a13:d,a21:r.x-e.x+f*r.x,a22:r.y-e.y+f*r.y,a23:f,a31:e.x,a32:e.y,a33:1}}function a(e,t,n,r){var a=i(e,t,n,r);return{a11:a.a22*a.a33-a.a23*a.a32,a12:a.a13*a.a32-a.a12*a.a33,a13:a.a12*a.a23-a.a13*a.a22,a21:a.a23*a.a31-a.a21*a.a33,a22:a.a11*a.a33-a.a13*a.a31,a23:a.a13*a.a21-a.a11*a.a23,a31:a.a21*a.a32-a.a22*a.a31,a32:a.a12*a.a31-a.a11*a.a32,a33:a.a11*a.a22-a.a12*a.a21}}function o(e,t){return{a11:e.a11*t.a11+e.a21*t.a12+e.a31*t.a13,a12:e.a12*t.a11+e.a22*t.a12+e.a32*t.a13,a13:e.a13*t.a11+e.a23*t.a12+e.a33*t.a13,a21:e.a11*t.a21+e.a21*t.a22+e.a31*t.a23,a22:e.a12*t.a21+e.a22*t.a22+e.a32*t.a23,a23:e.a13*t.a21+e.a23*t.a22+e.a33*t.a23,a31:e.a11*t.a31+e.a21*t.a32+e.a31*t.a33,a32:e.a12*t.a31+e.a22*t.a32+e.a32*t.a33,a33:e.a13*t.a31+e.a23*t.a32+e.a33*t.a33}}function s(e,t){for(var n=a({x:3.5,y:3.5},{x:t.dimension-3.5,y:3.5},{x:t.dimension-6.5,y:t.dimension-6.5},{x:3.5,y:t.dimension-3.5}),s=o(i(t.topLeft,t.topRight,t.alignmentPattern,t.bottomLeft),n),c=r.BitMatrix.createEmpty(t.dimension,t.dimension),l=function(e,t){var n=s.a13*e+s.a23*t+s.a33;return{x:(s.a11*e+s.a21*t+s.a31)/n,y:(s.a12*e+s.a22*t+s.a32)/n}},u=0;u<t.dimension;u++)for(var d=0;d<t.dimension;d++){var f=l(d+.5,u+.5);c.set(d,u,e.get(Math.floor(f.x),Math.floor(f.y)))}return{matrix:c,mappingFunction:l}}t.extract=s}),(function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0});var r=4,i=.5,a=1.5,o=function(e,t){return Math.sqrt((t.x-e.x)**2+(t.y-e.y)**2)};function s(e){return e.reduce(function(e,t){return e+t})}function c(e,t,n){var r,i,a,s,c=o(e,t),l=o(t,n),u=o(e,n),d,f,p;return l>=c&&l>=u?(r=[t,e,n],d=r[0],f=r[1],p=r[2]):u>=l&&u>=c?(i=[e,t,n],d=i[0],f=i[1],p=i[2]):(a=[e,n,t],d=a[0],f=a[1],p=a[2]),(p.x-f.x)*(d.y-f.y)-(p.y-f.y)*(d.x-f.x)<0&&(s=[p,d],d=s[0],p=s[1]),{bottomLeft:d,topLeft:f,topRight:p}}function l(e,t,n,r){var i=(s(d(e,n,r,5))/7+s(d(e,t,r,5))/7+s(d(n,e,r,5))/7+s(d(t,e,r,5))/7)/4;if(i<1)throw Error(`Invalid module size`);var a=Math.round(o(e,t)/i),c=Math.round(o(e,n)/i),l=Math.floor((a+c)/2)+7;switch(l%4){case 0:l++;break;case 2:l--;break}return{dimension:l,moduleSize:i}}function u(e,t,n,r){var i=[{x:Math.floor(e.x),y:Math.floor(e.y)}],a=Math.abs(t.y-e.y)>Math.abs(t.x-e.x),s,c,l,u;a?(s=Math.floor(e.y),c=Math.floor(e.x),l=Math.floor(t.y),u=Math.floor(t.x)):(s=Math.floor(e.x),c=Math.floor(e.y),l=Math.floor(t.x),u=Math.floor(t.y));for(var d=Math.abs(l-s),f=Math.abs(u-c),p=Math.floor(-d/2),m=s<l?1:-1,h=c<u?1:-1,g=!0,_=s,v=c;_!==l+m;_+=m){var y=a?v:_,b=a?_:v;if(n.get(y,b)!==g&&(g=!g,i.push({x:y,y:b}),i.length===r+1))break;if(p+=f,p>0){if(v===u)break;v+=h,p-=d}}for(var x=[],S=0;S<r;S++)i[S]&&i[S+1]?x.push(o(i[S],i[S+1])):x.push(0);return x}function d(e,t,n,r){var i,a=t.y-e.y,o=t.x-e.x,s=u(e,t,n,Math.ceil(r/2)),c=u(e,{x:e.x-o,y:e.y-a},n,Math.ceil(r/2)),l=s.shift()+c.shift()-1;return(i=c.concat(l)).concat.apply(i,s)}function f(e,t){var n=s(e)/s(t),r=0;return t.forEach(function(t,i){r+=(e[i]-t*n)**2}),{averageSize:n,error:r}}function p(e,t,n){try{var r=d(e,{x:-1,y:e.y},n,t.length),i=d(e,{x:e.x,y:-1},n,t.length),a=d(e,{x:Math.max(0,e.x-e.y)-1,y:Math.max(0,e.y-e.x)-1},n,t.length),o=d(e,{x:Math.min(n.width,e.x+e.y)+1,y:Math.min(n.height,e.y+e.x)+1},n,t.length),s=f(r,t),c=f(i,t),l=f(a,t),u=f(o,t),p=Math.sqrt(s.error*s.error+c.error*c.error+l.error*l.error+u.error*u.error),m=(s.averageSize+c.averageSize+l.averageSize+u.averageSize)/4;return p+((s.averageSize-m)**2+(c.averageSize-m)**2+(l.averageSize-m)**2+(u.averageSize-m)**2)/m}catch{return 1/0}}function m(e,t){for(var n=Math.round(t.x);e.get(n,Math.round(t.y));)n--;for(var r=Math.round(t.x);e.get(r,Math.round(t.y));)r++;for(var i=(n+r)/2,a=Math.round(t.y);e.get(Math.round(i),a);)a--;for(var o=Math.round(t.y);e.get(Math.round(i),o);)o++;return{x:i,y:(a+o)/2}}function h(e){for(var t=[],n=[],o=[],l=[],u=function(r){for(var c=0,u=!1,d=[0,0,0,0,0],f=function(t){var o=e.get(t,r);if(o===u)c++;else{d=[d[1],d[2],d[3],d[4],c],c=1,u=o;var f=s(d)/7,p=Math.abs(d[0]-f)<f&&Math.abs(d[1]-f)<f&&Math.abs(d[2]-3*f)<3*f&&Math.abs(d[3]-f)<f&&Math.abs(d[4]-f)<f&&!o,m=s(d.slice(-3))/3,h=Math.abs(d[2]-m)<m&&Math.abs(d[3]-m)<m&&Math.abs(d[4]-m)<m&&o;if(p){var g=t-d[3]-d[4],_=g-d[2],v={startX:_,endX:g,y:r},y=n.filter(function(e){return _>=e.bottom.startX&&_<=e.bottom.endX||g>=e.bottom.startX&&_<=e.bottom.endX||_<=e.bottom.startX&&g>=e.bottom.endX&&d[2]/(e.bottom.endX-e.bottom.startX)<a&&d[2]/(e.bottom.endX-e.bottom.startX)>i});y.length>0?y[0].bottom=v:n.push({top:v,bottom:v})}if(h){var b=t-d[4],x=b-d[3],v={startX:x,y:r,endX:b},y=l.filter(function(e){return x>=e.bottom.startX&&x<=e.bottom.endX||b>=e.bottom.startX&&x<=e.bottom.endX||x<=e.bottom.startX&&b>=e.bottom.endX&&d[2]/(e.bottom.endX-e.bottom.startX)<a&&d[2]/(e.bottom.endX-e.bottom.startX)>i});y.length>0?y[0].bottom=v:l.push({top:v,bottom:v})}}},p=-1;p<=e.width;p++)f(p);t.push.apply(t,n.filter(function(e){return e.bottom.y!==r&&e.bottom.y-e.top.y>=2})),n=n.filter(function(e){return e.bottom.y===r}),o.push.apply(o,l.filter(function(e){return e.bottom.y!==r})),l=l.filter(function(e){return e.bottom.y===r})},d=0;d<=e.height;d++)u(d);t.push.apply(t,n.filter(function(e){return e.bottom.y-e.top.y>=2})),o.push.apply(o,l);var f=t.filter(function(e){return e.bottom.y-e.top.y>=2}).map(function(t){var n=(t.top.startX+t.top.endX+t.bottom.startX+t.bottom.endX)/4,r=(t.top.y+t.bottom.y+1)/2;if(e.get(Math.round(n),Math.round(r))){var i=[t.top.endX-t.top.startX,t.bottom.endX-t.bottom.startX,t.bottom.y-t.top.y+1],a=s(i)/i.length;return{score:p({x:Math.round(n),y:Math.round(r)},[1,1,3,1,1],e),x:n,y:r,size:a}}}).filter(function(e){return!!e}).sort(function(e,t){return e.score-t.score}).map(function(e,t,n){if(t>r)return null;var i=n.filter(function(e,n){return t!==n}).map(function(t){return{x:t.x,y:t.y,score:t.score+(t.size-e.size)**2/e.size,size:t.size}}).sort(function(e,t){return e.score-t.score});if(i.length<2)return null;var a=e.score+i[0].score+i[1].score;return{points:[e].concat(i.slice(0,2)),score:a}}).filter(function(e){return!!e}).sort(function(e,t){return e.score-t.score});if(f.length===0)return null;var h=c(f[0].points[0],f[0].points[1],f[0].points[2]),_=h.topRight,v=h.topLeft,y=h.bottomLeft,b=g(e,o,_,v,y),x=[];b&&x.push({alignmentPattern:{x:b.alignmentPattern.x,y:b.alignmentPattern.y},bottomLeft:{x:y.x,y:y.y},dimension:b.dimension,topLeft:{x:v.x,y:v.y},topRight:{x:_.x,y:_.y}});var S=m(e,_),C=m(e,v),w=m(e,y),T=g(e,o,S,C,w);return T&&x.push({alignmentPattern:{x:T.alignmentPattern.x,y:T.alignmentPattern.y},bottomLeft:{x:w.x,y:w.y},topLeft:{x:C.x,y:C.y},topRight:{x:S.x,y:S.y},dimension:T.dimension}),x.length===0?null:x}t.locate=h;function g(e,t,n,r,i){var a,c,u;try{a=l(r,n,i,e),c=a.dimension,u=a.moduleSize}catch{return null}var d={x:n.x-r.x+i.x,y:n.y-r.y+i.y},f=(o(r,i)+o(r,n))/2/u,m=1-3/f,h={x:r.x+m*(d.x-r.x),y:r.y+m*(d.y-r.y)},g=t.map(function(t){var n=(t.top.startX+t.top.endX+t.bottom.startX+t.bottom.endX)/4,r=(t.top.y+t.bottom.y+1)/2;if(e.get(Math.floor(n),Math.floor(r))){var i=[t.top.endX-t.top.startX,t.bottom.endX-t.bottom.startX,t.bottom.y-t.top.y+1];return s(i)/i.length,{x:n,y:r,score:p({x:Math.floor(n),y:Math.floor(r)},[1,1,1],e)+o({x:n,y:r},h)}}}).filter(function(e){return!!e}).sort(function(e,t){return e.score-t.score});return{alignmentPattern:f>=15&&g.length?g[0]:h,dimension:c}}})]).default})})),Sm=t(bm(),1),Cm=t(xm(),1),wm=8e3,Tm=[`nip07`,`amber`,`local-signet`,`remote-signet`,`bunker`,`nostrconnect`,`nsec`],Em=[...Tm,`redirect`,`qr`],Dm=[`bunker`,`nostrconnect`,`nsec`],Om=[`sign_event`,`nip44_encrypt`,`nip44_decrypt`];function km(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function Am(){let e=new Uint8Array(32);return crypto.getRandomValues(e),Array.from(e,e=>e.toString(16).padStart(2,`0`)).join(``)}function jm(e){return e===`dark`?!0:e===`light`?!1:typeof window<`u`&&window.matchMedia(`(prefers-color-scheme: dark)`).matches}function Mm(e){let t=document.createElement(`style`);t.textContent=`#signet-login-dialog::backdrop{background:rgba(0,0,0,0.7)}`,document.head.appendChild(t);let n=jm(e),r=n?`#1a1a2e`:`#ffffff`,i=n?`#e0e0e0`:`#1a1a2e`,a=document.createElement(`dialog`);a.id=`signet-login-dialog`,a.style.cssText=`border:none;border-radius:16px;padding:32px;max-width:460px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);background:${r};color:${i};font-family:system-ui,-apple-system,sans-serif;`,document.body.appendChild(a),a.showModal();let o=()=>Array.from(a.querySelectorAll(`button`)).filter(e=>{if(e.disabled||!e.isConnected)return!1;let t=window.getComputedStyle(e);return t.display!==`none`&&t.visibility!==`hidden`}),s=()=>document.activeElement instanceof HTMLButtonElement&&a.contains(document.activeElement)?document.activeElement:null,c=0,l=()=>{let e=o();e.length!==0&&(c=Math.min(Math.max(c,0),e.length-1),e[c].focus())},u=e=>{if(!a.isConnected||!a.open)return;let t=e.target;if(t&&(t.tagName===`INPUT`||t.tagName===`TEXTAREA`)&&e.isTrusted)return;let n=o();if(n.length===0)return;let r=e.key||e.code,i=e.code||e.key,l=r===`ArrowDown`||i===`ArrowDown`||r===`ArrowRight`||i===`ArrowRight`?1:r===`ArrowUp`||i===`ArrowUp`||r===`ArrowLeft`||i===`ArrowLeft`?-1:0;if(l){e.preventDefault(),e.stopImmediatePropagation();let t=s(),r=t?n.indexOf(t):-1;c=((r>=0?r:c)+l+n.length)%n.length,n[c].focus();return}e.isTrusted||(e.key===`Enter`||e.key===` `||e.code===`Space`||e.code===`Enter`?(e.preventDefault(),e.stopImmediatePropagation(),n[Math.min(Math.max(c,0),n.length-1)].click()):(e.key===`Escape`||e.code===`Escape`)&&(e.preventDefault(),e.stopImmediatePropagation(),(a.querySelector(`[data-action="back"]`)??a.querySelector(`[data-action="cancel"],[data-choice="cancel"]`))?.click()))};window.addEventListener(`keydown`,u,!0);let d=new MutationObserver(()=>{c=0,l()});return d.observe(a,{childList:!0}),l(),{dialog:a,style:t,cleanupNav:()=>{window.removeEventListener(`keydown`,u,!0),d.disconnect()}}}function Nm(e){e.cleanupNav?.();try{e.dialog.close()}catch{}e.dialog.remove(),e.style.remove()}function Pm(e,t=!1){return t?`background:#2c3e8f;color:white;border:0;padding:12px 16px;border-radius:8px;cursor:pointer;font-size:0.95rem;width:100%;margin-bottom:8px;text-align:left;display:flex;align-items:center;gap:12px;`:`background:transparent;color:${e?`#e0e0e0`:`#1a1a2e`};border:1px solid ${e?`#3a3a4e`:`#d0d0d0`};padding:12px 16px;border-radius:8px;cursor:pointer;font-size:0.95rem;width:100%;margin-bottom:8px;text-align:left;display:flex;align-items:center;gap:12px;`}function Fm(){return typeof navigator<`u`&&!!navigator.mediaDevices&&typeof navigator.mediaDevices.getUserMedia==`function`&&typeof document<`u`}function Im(e,t){let n=e.trim().toLowerCase();return t.some(e=>n.startsWith(e))}async function Lm(e){let{container:t,status:n,acceptedPrefixes:r,onValue:i}=e;if(!Fm())throw Error(`camera-unavailable`);let a=!1,o=0,s=null,c=document.createElement(`video`),l=document.createElement(`canvas`),u=document.createElement(`button`);c.muted=!0,c.playsInline=!0,c.style.cssText=`display:block;width:100%;max-height:240px;object-fit:cover;border-radius:8px;background:#000;margin:0 0 8px;`,l.style.display=`none`,u.type=`button`,u.dataset.action=`stop-scan`,u.textContent=`Stop scan`,u.style.cssText=`display:block;margin:0 auto 8px;background:transparent;border:1px solid currentColor;border-radius:8px;padding:8px 12px;cursor:pointer;color:inherit;`;let d=()=>{if(!a){if(a=!0,o&&cancelAnimationFrame(o),s)for(let e of s.getTracks())e.stop();t.hidden=!0,t.replaceChildren()}};u.addEventListener(`click`,()=>{d(),n&&(n.textContent=`QR scan stopped.`,n.style.color=``)}),t.hidden=!1,t.replaceChildren(c,l,u),n&&(n.textContent=`Point your camera at a QR code...`,n.style.color=``);try{s=await navigator.mediaDevices.getUserMedia({audio:!1,video:{facingMode:{ideal:`environment`}}}),c.srcObject=s,await c.play()}catch(e){throw d(),e}let f=l.getContext(`2d`,{willReadFrequently:!0});if(!f)throw d(),Error(`canvas-unavailable`);let p=()=>{if(!a){if(c.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA&&c.videoWidth>0&&c.videoHeight>0){l.width=c.videoWidth,l.height=c.videoHeight,f.drawImage(c,0,0,l.width,l.height);let e=f.getImageData(0,0,l.width,l.height),t=(0,Cm.default)(e.data,e.width,e.height,{inversionAttempts:`attemptBoth`})?.data?.trim();if(t){if(Im(t,r)){i(t),n&&(n.textContent=`QR code scanned.`,n.style.color=``),d();return}n&&(n.textContent=`That QR is not a supported pairing URI.`,n.style.color=`#d04848`)}}o=requestAnimationFrame(p)}};return o=requestAnimationFrame(p),{stop:d}}var Rm={nip07:{icon:`🌐`,title:`Browser extension`,hint:`bark, Alby, nos2x`},amber:{icon:`🤖`,title:`Sign in with Amber`,hint:`Android signer (NIP-55)`},"local-signet":{icon:`🪪`,title:`Local Signet`,hint:`Open Signet on this device`},"remote-signet":{icon:`📱`,title:`Remote Signet`,hint:`Scan with Signet on another device`},redirect:{icon:`🪪`,title:`Local Signet`,hint:`Open Signet on this device`},qr:{icon:`📱`,title:`Remote Signet`,hint:`Scan with Signet on another device`},bunker:{icon:`🔑`,title:`Paste bunker URI`,hint:`For NIP-46 power users`},nostrconnect:{icon:`📡`,title:`Connect a Nostr signer`,hint:`Scan with nsec.app, Amber, Keychat...`},nsec:{icon:`⚠️`,title:`Paste private key`,hint:`In-memory only - risky, last resort`}};function zm(e){return e===`local-signet`||e===`redirect`?`local-signet`:e===`remote-signet`||e===`qr`?`remote-signet`:e}function Bm(e){return e===`local-signet`?`redirect`:e===`remote-signet`?`qr`:e}function Vm(e){return e===`nip07`?Ns():e===`amber`?hc():!0}function Hm(e,t,n,r){let i=Rm[e];return`<button data-choice="${e}" style="${Pm(t,r)}"><span style="font-size:1.2rem;">${i.icon}</span><span><strong>${i.title}</strong><br><span style="font-size:0.8rem;color:${r?`rgba(255,255,255,0.8)`:n};">${i.hint}</span></span></button>`}function Um(e,t){let n=jm(t.theme),r=n?`#888`:`#666`;return new Promise(i=>{let a=!1,o=t.methods.filter(Vm),s=new Set(t.advancedMethods.map(zm)),c=o.filter(e=>!s.has(zm(e))),l=o.filter(e=>s.has(zm(e))),u=()=>{e.dialog.querySelectorAll(`button[data-choice]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.choice;i(t)})}),e.dialog.querySelector(`[data-action="advanced"]`)?.addEventListener(`click`,()=>{a=!0,d()})},d=()=>{let i=a||c.length===0,s=c.map((e,t)=>Hm(e,n,r,t===0)).join(``),d=i?l.map((e,t)=>Hm(e,n,r,c.length===0&&t===0)).join(``):``,f=l.length>0&&!i?`<button data-action="advanced" style="${Pm(n)}justify-content:center;text-align:center;">Advanced</button>`:``,p=o.length===0?`<p style="margin:0 0 12px;color:${r};font-size:0.85rem;">No configured sign-in methods are available on this device.</p>`:``;e.dialog.innerHTML=`
        <h2 style="margin:0 0 8px;font-size:1.3rem;">Sign in to ${km(t.appName)}</h2>
        <p style="margin:0 0 24px;color:${r};font-size:0.9rem;">Choose how you want to sign in. Your keys never leave your control.</p>
        <div style="display:flex;flex-direction:column;">
          ${p}
          ${s}
          ${f}
          ${d}
        </div>
        <button data-choice="cancel" style="background:transparent;color:${n?`#e0e0e0`:`#1a1a2e`};border:1px solid ${n?`#3a3a4e`:`#d0d0d0`};border-radius:8px;padding:12px;cursor:pointer;font-size:0.95rem;width:100%;margin-top:12px;text-align:center;">Cancel</button>
      `,u()};d()})}async function Wm(e,t){let n=jm(t.theme),r=n?`#888`:`#666`,i=n?`#e0e0e0`:`#1a1a2e`;e.dialog.innerHTML=`
    <h2 style="margin:0 0 8px;font-size:1.2rem;">Waiting for your extension</h2>
    <p style="margin:0 0 20px;color:${r};font-size:0.85rem;">Approve the sign-in prompt in bark, Alby, nos2x, or whichever NIP-07 extension you use. Cold-start can take a few seconds.</p>
    <div style="display:flex;align-items:center;justify-content:center;gap:14px;margin:0 0 24px;color:${i};">
      <div style="width:28px;height:28px;border:3px solid ${n?`#3a3a4e`:`#d0d0d0`};border-top-color:#5b6dff;border-radius:50%;animation:signet-login-spin 0.9s linear infinite;"></div>
      <span id="signet-login-nip07-elapsed" style="font-variant-numeric:tabular-nums;font-size:0.95rem;">Connecting…</span>
    </div>
    <div style="display:flex;gap:8px;justify-content:space-between;">
      <button data-action="back" style="${Pm(n)}width:auto;flex:0 0 auto;padding:8px 16px;">← Back</button>
      <button data-action="cancel" style="${Pm(n)}width:auto;flex:0 0 auto;padding:8px 16px;">Cancel</button>
    </div>
    <style>@keyframes signet-login-spin{to{transform:rotate(360deg)}}</style>
  `;let a=e.dialog.querySelector(`#signet-login-nip07-elapsed`),o=0,s=window.setInterval(()=>{o+=1,a&&(a.textContent=`Waiting for your signer (${o}s)…`)},1e3),c=new Promise(t=>{e.dialog.querySelector(`[data-action="back"]`)?.addEventListener(`click`,()=>t(null)),e.dialog.querySelector(`[data-action="cancel"]`)?.addEventListener(`click`,()=>t(null))});try{let e=await Promise.race([Ls(),c]);if(!e)return null;let n=await Promise.race([e.signEvent({kind:21236,content:``,tags:[[`challenge`,t.challenge],[`origin`,t.origin],[`app`,t.appName]]}),c]);if(!n){try{await e.close()}catch{}return null}return{pubkey:e.pubkey,authEvent:n}}catch(e){return a&&(a.textContent=`✗ ${e instanceof Error?e.message:String(e)}`,a.style.color=`#d04848`),await Promise.race([new Promise(e=>setTimeout(e,2500)),c]),null}finally{window.clearInterval(s)}}async function Gm(e,t,n={}){let r=jm(t.theme),i=r?`#888`:`#666`,a=n.sameDevice===!0,o=Kp.utils.randomPrivateKey(),s=Ed(Kp.getPublicKey(o)),c=new URLSearchParams({auth:`1`,challenge:t.challenge,origin:t.origin,name:t.appName,callback:t.redirectCallback??`${t.origin}/`,t:String(Math.floor(Date.now()/1e3)),relay:t.relayUrl,sessionPubkey:s}),l=`${t.signetAppOrigin}/?${c.toString()}`;e.dialog.innerHTML=`
    <h2 style="margin:0 0 8px;font-size:1.2rem;">${a?`Open My Signet`:`Sign in with Signet`}</h2>
    <p style="margin:0 0 16px;color:${i};font-size:0.85rem;">${a?`Approve in My Signet and keep that tab open so it can sign for this app.`:`Open the link on your phone, or scan the QR if rendered.`}</p>
    <div style="background:${r?`#0f0f1f`:`#f5f5f8`};border-radius:8px;padding:16px;margin-bottom:16px;">
      <canvas id="signet-login-qr" width="360" height="360" style="display:block;width:360px;height:360px;max-width:100%;margin:0 auto 12px;background:#ffffff;border-radius:6px;box-sizing:border-box;"></canvas>
      <a id="signet-login-open-signet" href="${km(l)}" target="_blank" rel="noopener" style="${a?Pm(r,!0)+`justify-content:center;text-align:center;text-decoration:none;`:`display:block;color:#5b6dff;font-size:0.75rem;word-break:break-all;text-decoration:none;`}">${a?`Open My Signet`:`${km(l.slice(0,80))}…`}</a>
    </div>
    <p id="signet-login-status" style="margin:0 0 12px;color:${i};font-size:0.85rem;">${a?`Waiting for My Signet approval…`:`Waiting for approval…`}</p>
    <div style="display:flex;gap:8px;justify-content:space-between;">
      <button data-action="back" style="${Pm(r)}width:auto;flex:0 0 auto;padding:8px 16px;">← Back</button>
      <button data-action="cancel" style="${Pm(r)}width:auto;flex:0 0 auto;padding:8px 16px;">Cancel</button>
    </div>
  `;let u=e.dialog.querySelector(`#signet-login-qr`);if(u&&Sm.toCanvas(u,l,{width:360,margin:1,errorCorrectionLevel:`H`,color:{dark:`#0a0418`,light:`#ffffff`}}).catch(()=>{}),a&&typeof window<`u`)try{window.open(l,`_blank`,`noopener,noreferrer`)}catch{}return new Promise(n=>{let r=!1,i=e=>{r||(r=!0,n(e))};e.dialog.querySelector(`[data-action="back"]`)?.addEventListener(`click`,()=>{i(null)}),e.dialog.querySelector(`[data-action="cancel"]`)?.addEventListener(`click`,()=>{i(null)}),pd({requestId:t.challenge,relayUrl:t.relayUrl,sessionPrivKey:o,expectedOrigin:t.origin,timeout:t.timeout}).then(e=>{let t=e,n={id:t.authEvent.id,pubkey:t.authEvent.pubkey,kind:21236,created_at:t.authEvent.created_at,tags:t.authEvent.tags,content:t.authEvent.content,sig:t.authEvent.sig},r={pubkey:t.pubkey,authEvent:n};t.displayName&&(r.displayName=t.displayName),t.bunkerUri&&(r.bunkerUri=t.bunkerUri),i(r)}).catch(t=>{let n=e.dialog.querySelector(`#signet-login-status`);n&&(n.textContent=`✗ ${t instanceof Error?t.message:String(t)}`,n.style.color=`#d04848`)})})}async function Km(e,t,n,r){let i=new Xs(t.pubkey,t.authEvent),a=`redirect`;if(t.bunkerUri){let r=await cc(n.storage),o=t.pubkey,s=e.dialog.querySelector(`#signet-login-status`);s&&(s.textContent=`Connecting signer...`);try{let e=await Ks({uri:t.bunkerUri,clientSecretKey:r,timeoutMs:wm});e.pubkey.toLowerCase()===o.toLowerCase()?(i=e,a=`bunker`):(console.warn(`[signet-login] Signet relay upgrade: bunker pubkey mismatch — continuing identity-only`,{connected:e.pubkey,expected:o}),e.close().catch(()=>{}))}catch(e){console.warn(`[signet-login] Signet relay upgrade: createBunkerSigner failed — continuing identity-only (auth-only).`,e)}}else console.warn(`[signet-login] Signet relay login carried no bunkerUri — auth-only ephemeral (cannot sign). The signer device must have its NIP-46 server enabled to hand back a bunker:// URI.`);let o={pubkey:t.pubkey,method:a,signer:i,authEvent:t.authEvent};return t.displayName&&(o.displayName=t.displayName),o}async function qm(e,t){let n=jm(t.theme),r=n?`#888`:`#666`,i=n?`#0f0f1f`:`#f5f5f8`,a=n?`#e0e0e0`:`#1a1a2e`,o=Fm()?`<button data-action="scan" style="${Pm(n)}width:auto;flex:0 0 auto;padding:8px 16px;">Scan QR</button>`:``;return e.dialog.innerHTML=`
    <h2 style="margin:0 0 8px;font-size:1.2rem;">Paste bunker URI</h2>
    <p style="margin:0 0 16px;color:${r};font-size:0.85rem;">Connect to your NIP-46 bunker (Heartwood, nsecBunker, Amber, or any compatible signer).</p>
    <textarea id="signet-login-bunker-input" placeholder="bunker://..." rows="3" style="width:100%;background:${i};color:${a};border:1px solid ${n?`#3a3a4e`:`#d0d0d0`};border-radius:8px;padding:10px;font-size:0.85rem;font-family:ui-monospace,monospace;box-sizing:border-box;resize:vertical;margin-bottom:12px;"></textarea>
    <div id="signet-login-bunker-scan" hidden style="margin:0 0 12px;"></div>
    <p id="signet-login-bunker-status" style="margin:0 0 12px;color:${r};font-size:0.85rem;min-height:1.2em;"></p>
    <div style="display:flex;gap:8px;justify-content:space-between;">
      <button data-action="back" style="${Pm(n)}width:auto;flex:0 0 auto;padding:8px 16px;">← Back</button>
      ${o}
      <button data-action="connect" style="${Pm(n,!0)}width:auto;flex:1;padding:8px 16px;text-align:center;">Connect</button>
    </div>
  `,new Promise(n=>{let r=!1,i=0,a=e=>{r||(r=!0,i++,d?.stop(),n(e))},o=e.dialog.querySelector(`#signet-login-bunker-input`),s=e.dialog.querySelector(`#signet-login-bunker-status`),c=e.dialog.querySelector(`#signet-login-bunker-scan`),l=e.dialog.querySelector(`[data-action="connect"]`),u=e.dialog.querySelector(`[data-action="scan"]`),d=null;e.dialog.querySelector(`[data-action="back"]`)?.addEventListener(`click`,()=>{d?.stop(),a(null)}),u?.addEventListener(`click`,()=>{if(!o||!c)return;d?.stop(),d=null;let e=++i;Lm({container:c,status:s,acceptedPrefixes:[`bunker://`],onValue:e=>{o.value=e,o.focus()}}).then(t=>{if(r||e!==i){t.stop();return}d=t}).catch(t=>{r||e!==i||s&&(s.textContent=`✗ ${t instanceof Error?t.message:String(t)}`,s.style.color=`#d04848`)})}),l?.addEventListener(`click`,async()=>{let e=o?.value.trim()??``;if(!e){s&&(s.textContent=`Please paste a bunker URI.`);return}s&&(s.textContent=`Connecting…`,s.style.color=``),l.disabled=!0;try{a(await Ks({uri:e,clientSecretKey:await cc(t.storage)}))}catch(e){s&&(s.textContent=`✗ ${e instanceof Error?e.message:String(e)}`,s.style.color=`#d04848`),l.disabled=!1}})})}async function Jm(e,t){let n=jm(t.theme),r=n?`#888`:`#666`,i=await cc(t.storage),a=Ed(Kp.getPublicKey(i)),o=Ed(Kp.utils.randomPrivateKey()).slice(0,32),s=Bs({clientPubkeyHex:a,relayUrls:t.relayUrls,secret:o,perms:t.nostrConnectPerms,appName:t.appName,appUrl:t.origin});e.dialog.innerHTML=`
    <h2 style="margin:0 0 8px;font-size:1.2rem;">Connect a Nostr signer</h2>
    <p style="margin:0 0 16px;color:${r};font-size:0.85rem;">Scan or paste this into your signer (nsec.app, Amber, Keychat...). The connection happens over your configured relay${t.relayUrls.length>1?`s`:``}.</p>
    <div style="background:${n?`#0f0f1f`:`#f5f5f8`};border-radius:8px;padding:16px;margin-bottom:16px;">
      <canvas id="signet-login-nc-qr" width="200" height="200" style="display:block;width:200px;height:200px;margin:0 auto 12px;background:#ffffff;border-radius:6px;box-sizing:border-box;"></canvas>
      <button data-action="copy" style="${Pm(n)}width:auto;font-size:0.75rem;padding:6px 10px;margin:0 auto;display:block;">Copy URI</button>
    </div>
    <p id="signet-login-nc-status" style="margin:0 0 12px;color:${r};font-size:0.85rem;">Waiting for signer to connect…</p>
    <div style="display:flex;gap:8px;justify-content:space-between;">
      <button data-action="back" style="${Pm(n)}width:auto;flex:0 0 auto;padding:8px 16px;">← Back</button>
      <button data-action="cancel" style="${Pm(n)}width:auto;flex:0 0 auto;padding:8px 16px;">Cancel</button>
    </div>
  `;let c=e.dialog.querySelector(`#signet-login-nc-qr`);c&&Sm.toCanvas(c,s,{width:200,margin:1,errorCorrectionLevel:`M`,color:{dark:`#0a0418`,light:`#ffffff`}}).catch(()=>{});let l=e.dialog.querySelector(`[data-action="copy"]`);l?.addEventListener(`click`,()=>{navigator.clipboard?.writeText(s).then(()=>{l.textContent=`Copied ✓`,window.setTimeout(()=>{l.textContent=`Copy URI`},1500)})});let u=new AbortController,d=e.dialog.querySelector(`#signet-login-nc-status`);return new Promise(t=>{let n=!1,r=e=>{n||(n=!0,t(e))};e.dialog.querySelector(`[data-action="back"]`)?.addEventListener(`click`,()=>{u.abort(),r(null)}),e.dialog.querySelector(`[data-action="cancel"]`)?.addEventListener(`click`,()=>{u.abort(),r(null)}),zs({uri:s,clientSecretKey:i,abortSignal:u.signal}).then(e=>r(e)).catch(e=>{n||d&&(d.textContent=`✗ ${e instanceof Error?e.message:String(e)}`,d.style.color=`#d04848`)})})}async function Ym(e,t){let n=jm(t.theme),r=n?`#888`:`#666`,i=n?`#0f0f1f`:`#f5f5f8`,a=n?`#e0e0e0`:`#1a1a2e`;return e.dialog.innerHTML=`
    <h2 style="margin:0 0 8px;font-size:1.2rem;">Paste private key</h2>
    <p style="margin:0 0 12px;color:#d04848;font-size:0.85rem;font-weight:600;">⚠️ Last-resort method — only paste keys you can afford to lose.</p>
    <p style="margin:0 0 16px;color:${r};font-size:0.8rem;line-height:1.4;">Held in memory for this session only. Cleared on page reload. Prefer a browser extension or bunker URI for any key with real value.</p>
    <textarea id="signet-login-nsec-input" placeholder="nsec1..." rows="2" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" style="width:100%;background:${i};color:${a};border:1px solid ${n?`#3a3a4e`:`#d0d0d0`};border-radius:8px;padding:10px;font-size:0.85rem;font-family:ui-monospace,monospace;box-sizing:border-box;resize:vertical;margin-bottom:12px;-webkit-text-security:disc;text-security:disc;"></textarea>
    <p id="signet-login-nsec-status" style="margin:0 0 12px;color:${r};font-size:0.85rem;min-height:1.2em;"></p>
    <div style="display:flex;gap:8px;justify-content:space-between;">
      <button data-action="back" style="${Pm(n)}width:auto;flex:0 0 auto;padding:8px 16px;">← Back</button>
      <button data-action="connect" style="${Pm(n,!0)}width:auto;flex:1;padding:8px 16px;text-align:center;">Sign in</button>
    </div>
  `,new Promise(t=>{let n=!1,r=e=>{n||(n=!0,t(e))},i=e.dialog.querySelector(`#signet-login-nsec-input`),a=e.dialog.querySelector(`#signet-login-nsec-status`),o=e.dialog.querySelector(`[data-action="connect"]`);e.dialog.querySelector(`[data-action="back"]`)?.addEventListener(`click`,()=>{i&&(i.value=``),r(null)}),o?.addEventListener(`click`,()=>{let e=i?.value??``;if(!e.trim()){a&&(a.textContent=`Please paste an nsec.`);return}try{let t=Ys(e);i&&(i.value=``),r(t)}catch(e){a&&(a.textContent=`✗ ${e instanceof Error?e.message:String(e)}`,a.style.color=`#d04848`)}})})}function Xm(e,t){let n=e??t,r=new Set(Em),i=new Set,a=[];for(let e of n){if(!r.has(e))continue;let t=zm(e);i.has(t)||(i.add(t),a.push(e))}return e===void 0&&a.length===0?[...t]:a}function Zm(e){let t=Xm(e.methods,Tm),n=new Set(t.map(zm));return{methods:t,advancedMethods:Xm(e.advancedMethods,Dm).filter(e=>n.has(zm(e)))}}function Qm(e){let t=(e.relayUrls??(e.relayUrl?[e.relayUrl]:[jo.relayUrl])).map(e=>e.trim()).filter(Boolean);return t.length>0?t:[jo.relayUrl]}function $m(e){let t=e.challenge??Am();if(!/^[0-9a-f]{64}$/i.test(t))throw Error(`challenge-must-be-64-hex`);let n=typeof window<`u`?window.location.origin:`http://localhost`,r=Math.max(5e3,Math.min(e.timeout??jo.timeout,6e5)),i=Qm(e),a=Zm(e),o={appName:e.appName,challenge:t.toLowerCase(),origin:n,methods:a.methods,advancedMethods:a.advancedMethods,relayUrl:i[0],relayUrls:i,nostrConnectPerms:e.nostrConnectPerms??Om,theme:e.theme??jo.theme,timeout:r,signetAppOrigin:e.signetAppOrigin??jo.signetAppOrigin};return e.preferredMethod!==void 0&&(o.preferredMethod=e.preferredMethod),e.redirectCallback!==void 0&&(o.redirectCallback=e.redirectCallback),e.storage!==void 0&&(o.storage=e.storage),o}var eh=Promise.resolve();async function th(e){let t=eh,n;eh=new Promise(e=>{n=e}),await t;try{return await nh(e)}finally{n()}}async function nh(e){if(!e.appName||e.appName.length===0)throw Error(`appName-required`);if(e.appName.length>64)throw Error(`appName-too-long`);let t=$m(e),n=Mm(t.theme),r=!1,i=new Promise(e=>{n.dialog.addEventListener(`cancel`,()=>{r=!0,e(null)})});try{for(;;){let e=t.preferredMethod?t.preferredMethod:await Promise.race([Um(n,t),i]),a=e===null?null:Bm(e);if(r||a===null||a===`cancel`)return null;if(a===`nip07`){let e=await Promise.race([Wm(n,t),i]);if(r)return null;if(!e){if(t.preferredMethod)return null;continue}let a=await Ls();return{pubkey:e.pubkey,method:`nip07`,signer:a,authEvent:e.authEvent}}if(a===`redirect`){let e=await Promise.race([Gm(n,t,{sameDevice:!0}),i]);if(r)return null;if(!e){if(t.preferredMethod)return null;continue}let a=await Km(n,e,t,i);if(r)return null;if(!a){if(t.preferredMethod)return null;continue}return a}if(a===`amber`)return await yc({appName:t.appName,challenge:t.challenge,origin:t.origin,...t.redirectCallback===void 0?{}:{redirectCallback:t.redirectCallback},...t.storage===void 0?{}:{storage:t.storage}}),null;if(a===`qr`){let e=await Promise.race([Gm(n,t),i]);if(r)return null;if(!e){if(t.preferredMethod)return null;continue}let a=await Km(n,e,t,i);if(r)return null;if(!a){if(t.preferredMethod)return null;continue}return a}if(a===`bunker`){let e=await Promise.race([qm(n,t),i]);if(r)return null;if(!e){if(t.preferredMethod)return null;continue}let a=await e.signEvent({kind:21236,content:``,tags:[[`challenge`,t.challenge],[`origin`,t.origin],[`app`,t.appName]]});return{pubkey:e.pubkey,method:`bunker`,signer:e,authEvent:a}}if(a===`nostrconnect`){let e=await Promise.race([Jm(n,t),i]);if(r)return null;if(!e){if(t.preferredMethod)return null;continue}let a=await e.signEvent({kind:21236,content:``,tags:[[`challenge`,t.challenge],[`origin`,t.origin],[`app`,t.appName]]});return{pubkey:e.pubkey,method:`bunker`,signer:e,authEvent:a}}if(a===`nsec`){let e=await Promise.race([Ym(n,t),i]);if(r)return null;if(!e){if(t.preferredMethod)return null;continue}let a=await e.signEvent({kind:21236,content:``,tags:[[`challenge`,t.challenge],[`origin`,t.origin],[`app`,t.appName]]});return{pubkey:e.pubkey,method:`nsec`,signer:e,authEvent:a}}}}finally{Nm(n)}}function rh(e){let t={};typeof window<`u`&&new URLSearchParams(window.location.search).forEach((e,n)=>{t[n]=e});let n=typeof window<`u`&&!!window.opener&&window.opener!==window;if(n){try{window.opener.postMessage({type:`signet-login-callback`,params:t},`*`)}catch{}if(e?.closeAfterPost??!0)try{window.close()}catch{}}return{params:t,isPopup:n}}var ih=/^[0-9a-f]{64}$/i,ah=/^[0-9a-f]{128}$/i;function oh(e){let t=e.redirectCallback??`${e.origin}/`,n=new URLSearchParams({auth:`1`,challenge:e.challenge,origin:e.origin,name:e.appName,callback:t,t:String(Math.floor(Date.now()/1e3))});return`${e.signetAppOrigin}/?${n.toString()}`}async function sh(e){if(typeof window>`u`)throw Error(`signet-login: redirect mode requires a browser environment`);await lc({challenge:e.challenge,origin:e.origin,appName:e.appName,createdAt:Date.now()},e.storage);let t=oh(e);return window.location.href=t,new Promise(()=>{})}function ch(){if(typeof window>`u`)return;let e=new URL(window.location.href),t=[`pubkey`,`npub`,`signature`,`eventId`,`error`,`warnings`,`fromNP`,`display_name`,`t`,`bunker`,`avatar_hash`,`avatar_url`,`avatar_key`],n=!1;for(let r of t)e.searchParams.has(r)&&(e.searchParams.delete(r),n=!0);if(!n)return;let r=e.pathname+(e.search?e.search:``)+e.hash;try{window.history.replaceState(window.history.state,document.title,r)}catch{}}function lh(e,t){if(typeof window>`u`)return{kind:`no-callback`};let n=new URLSearchParams(window.location.search),r=n.get(`error`),i=n.get(`pubkey`),a=n.get(`signature`),o=n.get(`eventId`);if(!r&&!i&&!a&&!o)return{kind:`no-callback`};if(r===`denied`)return t({kind:`denied`});if(!e)return t({kind:`invalid`,reason:`no-pending-state`});if(e.origin!==window.location.origin)return t({kind:`invalid`,reason:`origin-mismatch`});if(Date.now()-e.createdAt>3e5)return t({kind:`invalid`,reason:`pending-stale`});if(!i||!ih.test(i))return t({kind:`invalid`,reason:`pubkey-malformed`});if(!a||!ah.test(a))return t({kind:`invalid`,reason:`signature-malformed`});if(!o||!ih.test(o))return t({kind:`invalid`,reason:`eventId-malformed`});let s,c=n.get(`t`);if(c&&/^\d+$/.test(c)){let e=Number(c);if(!Number.isFinite(e))return t({kind:`invalid`,reason:`t-malformed`});s=e}else s=Math.floor(Date.now()/1e3),typeof console<`u`&&console.warn("signet-login: redirect callback missing `t` param — auth event created_at approximated. Server-side verification may reject. Upgrade signet-app to emit `t` in the redirect URL.");let l=i.toLowerCase(),u=a.toLowerCase(),d=o.toLowerCase(),f=[[`challenge`,e.challenge],[`origin`,e.origin]],p=n.get(`avatar_hash`),m=n.get(`avatar_url`),h=n.get(`avatar_key`);p&&/^[0-9a-f]{64}$/i.test(p)&&f.push([`avatar_hash`,p]),m&&m.length<=500&&f.push([`avatar_url`,m]),h&&/^[0-9a-f]{64}$/i.test(h)&&f.push([`avatar_key`,h]);let g={id:d,pubkey:l,kind:21236,created_at:s,tags:f,content:``,sig:u},_=n.get(`display_name`)||void 0,v={pubkey:l,method:`redirect`,signer:new Xs(l,g),authEvent:g};_&&(v.displayName=_);let y=n.get(`bunker`),b;return y&&y.length>=9&&y.length<=8192&&y.slice(0,9).toLowerCase()===`bunker://`&&(b=y),t(b?{kind:`session`,session:v,bunkerUri:b}:{kind:`session`,session:v})}async function uh(e){return await lh(await dc(e),async t=>(await fc(e),ch(),t))}var dh=8e3;async function fh(e){if(e.mode===`redirect`){if(typeof window>`u`)throw Error(`signet-login: redirect mode requires a browser environment`);let t=e.challenge??hh();if(!/^[0-9a-f]{64}$/i.test(t))throw Error(`challenge-must-be-64-hex`);if(!e.appName||e.appName.length===0)throw Error(`appName-required`);if(e.appName.length>64)throw Error(`appName-too-long`);return sh({appName:e.appName,challenge:t.toLowerCase(),origin:window.location.origin,signetAppOrigin:e.signetAppOrigin??jo.signetAppOrigin,...e.redirectCallback===void 0?{}:{redirectCallback:e.redirectCallback},...e.storage===void 0?{}:{storage:e.storage}})}let t=await th(e);return t?(e.persist!==!1&&await bh(t,e.storage),t):null}async function ph(e,t){let{appName:n}=t;if(!n||n.length===0)throw Error(`appName-required`);if(n.length>64)throw Error(`appName-too-long`);let r=t.challenge??hh();if(!/^[0-9a-f]{64}$/i.test(r))throw Error(`challenge-must-be-64-hex`);let i=t.origin??(typeof window<`u`?window.location.origin:`http://localhost`);if(!i)throw Error(`origin-required`);return await e.signEvent({kind:21236,content:``,tags:[[`challenge`,r.toLowerCase()],[`origin`,i],[`app`,n]]})}async function mh(e,t){let n=await ph(e,t);return{pubkey:e.pubkey,method:e.method,signer:e,authEvent:n}}function hh(){let e=new Uint8Array(32);return crypto.getRandomValues(e),Array.from(e,e=>e.toString(16).padStart(2,`0`)).join(``)}async function gh(e){let t=await oc(e?.storage);if(!t)return null;let n;try{n=JSON.parse(t.authEventJson)}catch{return await sc(e?.storage),null}if(t.method===`nip07`){if(!Ns()){let e=new Xs(t.pubkey,n);return{pubkey:t.pubkey,method:`redirect`,signer:e,authEvent:n}}try{let r=await Ls();return r.pubkey===t.pubkey?{pubkey:t.pubkey,method:`nip07`,signer:r,authEvent:n}:(await sc(e?.storage),null)}catch{return await sc(e?.storage),null}}if(t.method===`bunker`){if(e?.reconnectBunker===!1){let e=new Xs(t.pubkey,n);return{pubkey:t.pubkey,method:`redirect`,signer:e,authEvent:n}}if(!t.bunkerUri||!t.bunkerClientSkHex)return console.warn(`[signet-login] restore: stored bunker session has no reconnect creds (bunkerUri/clientSk) — it was an auth-only login. Clearing.`),await sc(e?.storage),null;try{let r=await Ks({uri:t.bunkerUri,clientSecretKey:await cc(e?.storage)});return r.pubkey===t.pubkey?{pubkey:t.pubkey,method:`bunker`,signer:r,authEvent:n}:(console.warn(`[signet-login] restore: reconnected bunker pubkey mismatch — clearing session`,{connected:r.pubkey,expected:t.pubkey}),await r.close(),await sc(e?.storage),null)}catch(e){return console.warn(`[signet-login] restore: bunker reconnect failed — keeping creds for the next retry (NOT clearing). The signer device should still recognise us on reconnect.`,e),null}}let r=new Xs(t.pubkey,n),i={pubkey:t.pubkey,method:t.method,signer:r,authEvent:n};return t.displayName&&(i.displayName=t.displayName),i}var _h=rh;async function vh(e={}){let t=await Sc(e.storage);if(t.kind===`session`)return await bh(t.session,e.storage),t;if(t.kind!==`no-callback`)return t;let n=await uh(e.storage);if(n.kind!==`session`)return n;if(n.bunkerUri){let t=n.session.pubkey,r=n.session.authEvent,i=n.session.displayName,a=await cc(e.storage),o=Ks({uri:n.bunkerUri,clientSecretKey:a,timeoutMs:dh}).then(n=>{if(n.pubkey.toLowerCase()!==t.toLowerCase())return console.warn(`[signet-login] redirect upgrade: bunker pubkey mismatch — staying auth-only (cannot sign)`,{connected:n.pubkey,expected:t}),n.close().catch(()=>{}),null;let a={pubkey:t,method:`bunker`,signer:n,authEvent:r};return i&&(a.displayName=i),bh(a,e.storage),n}).catch(e=>(console.warn(`[signet-login] redirect upgrade: createBunkerSigner failed — staying auth-only (no live signing). Reconnect/relay issue or signer device unreachable.`,e),null));if(e.waitForBunker){let n=await o;if(n){let a={pubkey:t,method:`bunker`,signer:n,authEvent:r};return i&&(a.displayName=i),await bh(a,e.storage),{kind:`session`,session:a}}}let s={pubkey:t,method:`bunker`,signer:new Zs(t,r,o,n.bunkerUri,a,!1),authEvent:r};return i&&(s.displayName=i),await bh(s,e.storage),{kind:`session`,session:s}}return console.warn(`[signet-login] redirect login carried no bunkerUri — auth-only ephemeral (cannot sign). The signer device must enable its NIP-46 server to return a bunker:// URI.`),await bh(n.session,e.storage),n}async function yh(e,t){if(e)try{await e.signer.close()}catch{}await sc(t?.storage)}async function bh(e,t){if(e.method===`nsec`)return;let n={pubkey:e.pubkey,method:e.method,authEventJson:JSON.stringify(e.authEvent)};if(e.method===`bunker`){let t=e.signer;t.bunkerUri&&t.clientSecretKey instanceof Uint8Array&&(n.bunkerUri=t.bunkerUri,n.bunkerClientSkHex=pc(t.clientSecretKey))}e.expiresAt!==void 0&&(n.expiresAt=e.expiresAt),e.displayName!==void 0&&(n.displayName=e.displayName),await ic(n,t)}if(typeof window<`u`){let e=window.Signet??{};Object.assign(e,{login:fh,hasNip07:Ns,createNip07Signer:Ls,createBunkerSigner:Ks,createBunkerSignerFromNostrConnect:zs,buildNostrConnectUri:Bs,buildBunkerUriFromNostrConnectUri:Vs,isBunkerUri:Hs,isNostrConnectUri:Us,isSupportedPairingUri:Ws,createLocalSignerFromNsec:Ys,generateSecretKey:qs,createLoginAuthEvent:ph,createSessionFromSigner:mh,restoreSession:gh,logout:yh,handleCallback:_h,handleRedirectCallback:vh}),window.Signet=e}var xh=`CANARY`,Sh=[`local-signet`,`remote-signet`,`nip07`,`bunker`,`nostrconnect`,`nsec`],Ch=[`bunker`,`nsec`],wh=[`sign_event`,`nip44_encrypt`,`nip44_decrypt`],Th=null;function Eh(e){return e.capabilities.canSignEvents&&e.capabilities.hasNip44&&!!e.nip44}function Dh(e){let t=e?jh(e):`Signet`;return Error(`${t} proved your identity, but CANARY also needs a live signer connection to sign events and decrypt NIP-44 invite messages. Keep Signet open on its signing screen and try again, or choose Browser extension, Connect a Nostr signer, or Paste bunker URI.`)}function Oh(e){return!e.signerMethod||e.signerMethod===`redirect`||e.signerMethod===`amber`?`nip07`:e.signerMethod}function kh(e){return!!e?.pubkey&&!e.privkey&&e.signerType===`nip07`}function Ah(e){return!!e?.privkey||kh(e)}function jh(e){switch(e){case`nip07`:return`Browser extension`;case`bunker`:return`NIP-46 bunker`;case`redirect`:return`Signet`;case`amber`:return`Amber`;case`nsec`:return`nsec`;default:return`Signet`}}function Mh(e){return e?e.privkey||e.signerType===`local`?`Local key`:`Signet (${jh(e.signerMethod)})`:`None`}function Nh(e,t,n=`You`){let r={pubkey:e.pubkey,signerType:`nip07`,signerMethod:e.method,displayName:e.displayName??t?.displayName??n};return t?.pubkey===r.pubkey&&t.mnemonic?{...r,mnemonic:t.mnemonic}:r}async function Ph(e={}){let t=await fh({appName:xh,relayUrl:l,theme:e.theme??`auto`,timeout:12e4,preferredMethod:e.preferredMethod,methods:Sh,advancedMethods:Ch,relayUrls:[l],nostrConnectPerms:wh});if(!t)return null;if(!Eh(t.signer))throw await yh(t).catch(()=>{}),Dh(t.method);return Th=t,Nh(t,null,e.displayNameFallback)}async function Fh(){if(Th)return Th;try{return Th=await gh({defaultRelay:l}),Th}catch(e){return console.warn(`[canary:signet] session restore failed:`,e),Th=null,null}}async function Ih(){let e=Th;Th=null,await yh(e??void 0).catch(()=>{})}async function Lh(e,t={}){if(!kh(e))throw Error(`Signet signer requested for a local identity.`);let n=await Fh();if(n?.pubkey===e.pubkey&&Eh(n.signer))return n.signer;if(!t.interactive)throw Error(`Signet signer is not available. Sign in with Signet again.`);let r=await Ph({preferredMethod:Oh(e),theme:t.theme,displayNameFallback:e.displayName});if(!r||!Th)throw Error(`Signet login was cancelled.`);if(r.pubkey!==e.pubkey)throw await Ih(),Error(`Signet returned a different public key. Switch back to the original account and try again.`);return Th.signer}async function Rh(e,t,n={}){let r=await(await Lh(e,n)).signEvent(t);if(r.pubkey!==e.pubkey)throw Error(`Signet signer used a different public key.`);return r}async function zh(e,t,n,r={}){let i=await Lh(e,r);if(!i.nip44)throw Dh(i.method);return i.nip44.encrypt(t,n)}async function Bh(e,t,n,r={}){let i=await Lh(e,r);if(!i.nip44)throw Dh(i.method);return i.nip44.decrypt(t,n)}var Vh=e({showToast:()=>Y});function Y(e,t=`info`,n=4e3){let r=document.getElementById(`toast-container`)??Hh(),i=document.createElement(`div`);i.className=`toast toast--${t}`,i.textContent=e,r.appendChild(i),requestAnimationFrame(()=>i.classList.add(`toast--visible`)),setTimeout(()=>{i.classList.remove(`toast--visible`),setTimeout(()=>i.remove(),300)},n)}function Hh(){let e=document.createElement(`div`);return e.id=`toast-container`,e.className=`toast-container`,document.body.appendChild(e),e}var Uh=e({recordCheckin:()=>Yh,startLivenessHeartbeat:()=>Gh,stopLivenessHeartbeat:()=>Kh}),Wh=null;function Gh(e=6e4){Wh||=(qh(),setInterval(qh,e))}function Kh(){Wh&&=(clearInterval(Wh),null)}function qh(){let{groups:e,identity:t}=f();if(!t)return;let n=Math.floor(Date.now()/1e3);for(let[r,i]of Object.entries(e))rg(r,{type:`liveness-checkin`,pubkey:t.pubkey,timestamp:n,opId:crypto.randomUUID()}),p(r,{livenessCheckins:{...i.livenessCheckins,[t.pubkey]:n}})}var Jh=60;function Yh(e,t,n){let r=f().groups[e];r&&(n>Math.floor(Date.now()/1e3)+Jh||n<=(r.livenessCheckins[t]??0)||p(e,{livenessCheckins:{...r.livenessCheckins,[t]:n}}))}var Xh=null,Zh=new Map,Qh=new Map;function $h(e,t){let n=Qh.get(e);return n?n.includes(t):!1}function eg(e,t){let n=Qh.get(e);n||(n=[],Qh.set(e,n)),n.length>=500&&n.shift(),n.push(t)}function tg(e){Xh=e}async function ng(e,t,n){let{identity:r}=f(),i=t??e,a=Ah(r);if(!(!r||!a||e.length===0&&i.length===0))try{ke(e,i),r.privkey&&(Xh?Xh instanceof Ao&&Xh.updateRelays(e,i):tg(new Ao(e,i,r.pubkey,r.privkey))),n&&Xh&&cg(n),n&&Qn(n).then(e=>{for(let t of e)rg(n,t)}),Ce().then(()=>Eg(be(),Te()))}catch(e){console.warn(`[canary:sync] ensureTransport failed:`,e),Eg(!1,0)}}function rg(e,t){Xh&&f().groups[e]&&Xh.send(e,t).catch(e=>{console.warn(`[canary:sync] broadcast failed:`,e)})}function ig(e){if(!(Xh instanceof Ao))return;let{identity:t,groups:n}=f(),r=n[e];if(!t?.privkey||!r?.seed||(Xh.unregisterGroup(e),!re()))return;let i=new bo(ee(r.personaId,e,r.epoch));Xh.registerGroup(e,r.seed,i,r.members,ag(e))}function ag(e){return{admins:f().groups[e]?.admins??[],onRecoveryRequest:(t,n,r)=>{let{groups:i}=f(),a=i[e];return!a||!a.members.includes(t)?null:{type:`state-snapshot`,seed:a.seed,counter:a.counter,usageOffset:a.usageOffset,members:a.members,admins:a.admins,epoch:a.epoch,opId:crypto.randomUUID(),timestamp:Math.floor(Date.now()/1e3)}},onRecoveryResponse:(t,n)=>{let{groups:r}=f(),i=r[e];if(!i)return;let a=Sa(i,t,void 0,n);a!==i&&(p(e,a),ig(e),Y(`Group state recovered from admin`,`success`))}}}function og(e,t,n,r=Math.floor(Date.now()/1e3),i=sg){if(t.type===`liveness-checkin`){if(!n)return;let i=r-t.timestamp;i<=300&&i>=-60&&($h(e,t.opId)||(eg(e,t.opId),Yh(e,n,t.timestamp)));return}if(t.type===`beacon`||t.type===`duress-alert`||t.type===`duress-clear`){let a=r-t.timestamp;if(a>300||a<-60||$h(e,t.opId))return;eg(e,t.opId),i(e,t,n)}}function sg(e,t,n){document.dispatchEvent(new CustomEvent(`canary:sync-message`,{detail:{groupId:e,message:t,sender:n}}))}function cg(e){if(!Xh)return;if(Zh.get(e)?.(),Xh instanceof Ao){let{identity:t,groups:n}=f(),r=n[e];if(t?.privkey&&r?.seed){if(!re())return;let t=new bo(ee(r.personaId,e,r.epoch));Xh.registerGroup(e,r.seed,t,r.members,ag(e))}}let t=Xh.subscribe(e,(t,n)=>{let{groups:r}=f(),i=r[e];if(!i)return;let a=Sa(i,t,void 0,n);if(a!==i&&p(e,a),(t.type===`member-join`||t.type===`member-leave`||t.type===`reseed`||t.type===`state-snapshot`)&&ig(e),t.type===`member-join`&&a!==i){let r=t.pubkey?a.memberNames?.[t.pubkey]??n?.slice(0,8)??`Someone`:`Someone`;document.dispatchEvent(new CustomEvent(`canary:member-joined`,{detail:{groupId:e,pubkey:t.pubkey,name:r}}))}t.type===`member-join`&&a!==i?Y(`${t.pubkey?a.memberNames?.[t.pubkey]??n?.slice(0,8)??`Someone`:`Someone`} joined the group`,`success`):t.type===`reseed`?Y(`Group secret was rotated`,`warning`):t.type===`state-snapshot`&&Y(`Group state recovered`,`success`),og(e,t,n),Dg(),setTimeout(()=>Eg(be(),Te()),1500)});Zh.set(e,t)}function lg(){let{groups:e}=f();for(let t of Object.keys(e))cg(t)}function ug(){Kh();for(let e of Zh.values())e();Zh.clear(),Xh?.disconnect(),Xh=null}function dg(e){let t=5381;for(let n=0;n<e.length;n++)t=t*33^e.charCodeAt(n),t>>>=0;return t%360}function fg(e){return`hsl(${dg(e)}, 60%, 45%)`}function pg(e){let t=fg(e),n=V(e.slice(0,1).toUpperCase());return`<span class="persona-badge" style="background-color:${t}" title="${V(e)}">${n}</span>`}function mg(e){return e.length<=16?e:`${e.slice(0,8)}\u2026${e.slice(-4)}`}function hg(e,t){let n=e.displayName?`${V(e.displayName)} (${V(mg(e.npub))})`:`${V(e.name)} · ${V(mg(e.npub))}`,r=e.id===t?` selected`:``;return`<option value="${V(e.id)}"${r}>${n}</option>`}function gg(){if(!re())return``;let{personas:e,activePersonaId:t}=f(),n=Object.values(e).filter(e=>!e.archived);return n.length===0?``:`<select class="persona-picker" aria-label="Filter by persona">${[`<option value=""${t===null?` selected`:``}>All groups</option>`,...n.map(e=>hg(e,t))].join(``)}</select>`}function _g(e){let t=e.querySelector(`.persona-picker`);t&&t.addEventListener(`change`,()=>{let e=t.value;u({activePersonaId:e===``?null:e})})}var vg=`modulepreload`,yg=function(e,t){return new URL(e,t).href},bg={},X=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}r=o(t.map(t=>{if(t=yg(t,n),t in bg)return;bg[t]=!0;let r=t.endsWith(`.css`),i=r?`[rel="stylesheet"]`:``;if(n)for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${t}"]${i}`))return;let o=document.createElement(`link`);if(o.rel=r?`stylesheet`:vg,r||(o.as=`script`),o.crossOrigin=``,o.href=t,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),r)return new Promise((e,n)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})};function xg(){return document.documentElement.getAttribute(`data-theme`)===`light`?`light`:`dark`}function Sg(e){e===`light`?document.documentElement.setAttribute(`data-theme`,`light`):document.documentElement.removeAttribute(`data-theme`)}function Cg(e){let t=xg();e.setAttribute(`aria-label`,t===`dark`?`Switch to light mode`:`Switch to dark mode`),e.textContent=`◐`}function wg(e){let t=xg()===`dark`?`light`:`dark`;Sg(t),u({settings:{...f().settings,theme:t}}),Cg(e)}function Tg(e){let t=f().view;e.innerHTML=`
    <button class="header__hamburger" id="hamburger" aria-label="Toggle menu">&#9776;</button>
    <div class="header__brand">CANARY <span class="header__version">v2.8.4</span></div>
    <nav class="header__nav" id="header-nav">
      <button class="header__nav-tab${t===`groups`?` header__nav-tab--active`:``}" data-view="groups">Groups</button>
      <button class="header__nav-tab${t===`call-demo`?` header__nav-tab--active`:``}" data-view="call-demo">Call Demo</button>
      <button class="header__nav-tab${t===`identities`?` header__nav-tab--active`:``}" data-view="identities">Identities</button>
    </nav>
    ${gg()}
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
  `,_g(e);let n=e.querySelector(`#theme-toggle`);n&&(Cg(n),n.addEventListener(`click`,()=>wg(n)));let r=e.querySelector(`#reset-btn`);r&&r.addEventListener(`click`,()=>{confirm(`Clear all data and reset the demo?`)&&(localStorage.clear(),window.location.reload())}),Og();let i=e.querySelector(`#identity-btn`);i?.addEventListener(`click`,()=>Mg(i)),be()&&Eg(!0,Te()),document.addEventListener(`canary:vault-synced`,()=>{let e=document.getElementById(`vault-sync-status`);e&&(e.hidden=!1,e.textContent=`☁`,setTimeout(()=>{e.hidden=!0},3e3))}),e.querySelector(`#header-nav`)?.addEventListener(`click`,e=>{let t=e.target.closest(`[data-view]`);if(!t)return;let n=t.dataset.view;if(n){if(n===`groups`&&window.innerWidth<=768){let e=document.getElementById(`sidebar`),t=document.getElementById(`sidebar-overlay`);if(e&&t){let n=e.classList.contains(`sidebar--open`);e.classList.toggle(`sidebar--open`,!n),t.classList.toggle(`sidebar-overlay--visible`,!n)}}n!==f().view&&u({view:n})}})}function Eg(e,t){let n=document.getElementById(`relay-status`);if(!n)return;let r=n.querySelector(`.relay-dot`),i=n.querySelector(`.relay-label`);!e||t===0?(n.removeAttribute(`hidden`),r?.setAttribute(`class`,`relay-dot relay-dot--offline`),i&&(i.textContent=`Offline`),n.title=`Not connected to any relay`):(n.removeAttribute(`hidden`),r?.setAttribute(`class`,`relay-dot relay-dot--synced`),i&&(i.textContent=`Synced · ${t} relay${t===1?``:`s`}`),n.title=`Connected to ${t} relay${t===1?``:`s`}`)}function Dg(){let e=document.getElementById(`relay-status`);if(!e)return;let t=e.querySelector(`.relay-dot`),n=e.querySelector(`.relay-label`);e.removeAttribute(`hidden`),t?.setAttribute(`class`,`relay-dot relay-dot--syncing`),n&&(n.textContent=`Syncing...`)}function Og(){let e=document.getElementById(`identity-dot`),t=document.getElementById(`identity-label`),n=document.getElementById(`identity-avatar`);if(!e||!t)return;let{identity:r,activePersonaId:i,personas:a}=f();if(!r?.pubkey){t.textContent=`No identity`,e.className=`header__identity-dot header__identity-dot--none`,n&&(n.hidden=!0);return}let o=i?Object.values(a).find(e=>e.id===i)??null:null,s=o?`${o.npub.slice(0,8)}\u2026${o.npub.slice(-4)}`:`${r.pubkey.slice(0,6)}\u2026${r.pubkey.slice(-4)}`;t.textContent=o?o.displayName??o.name:r.displayName&&r.displayName!==`You`?r.displayName:s,n&&r.picture?(n.src=r.picture,n.hidden=!1,e.hidden=!0):(n&&(n.hidden=!0),e.hidden=!1,e.className=r.signerType===`nip07`?`header__identity-dot header__identity-dot--extension`:`header__identity-dot header__identity-dot--local`)}function kg(e){return Array.from(e,e=>e.toString(16).padStart(2,`0`)).join(``)}function Ag(e,t){return t?.pubkey===e.pubkey&&t.mnemonic?{...e,mnemonic:t.mnemonic}:e}function jg(e,t){try{let n=f().identity,r=Ds(e.trim());if(r.type!==`nsec`)return alert(`Not a valid nsec. Expected a bech32-encoded private key starting with "nsec1".`),!1;let i=r.data,a=kg(i),o=Ag({pubkey:Me(i),privkey:a,signerType:`local`,displayName:t??`You`},n);return ug(),u({identity:o,groups:{},activeGroupId:null}),Og(),document.dispatchEvent(new CustomEvent(`canary:resync`)),t&&t!==`You`&&X(async()=>{let{publishKind0:e}=await Promise.resolve().then(()=>Ay);return{publishKind0:e}},void 0,import.meta.url).then(({publishKind0:e})=>e(t,a)),!0}catch{return alert(`Invalid nsec format.`),!1}}function Mg(e){document.getElementById(`identity-popover`)?.remove();let{identity:t}=f(),n=t?.pubkey??``,r=n?`${n.slice(0,8)}\u2026${n.slice(-8)}`:`None`,i=Mh(t),a=document.createElement(`div`);a.id=`identity-popover`,a.className=`identity-popover`,a.innerHTML=`
    <div class="identity-popover__row">
      <span class="identity-popover__label">Pubkey</span>
      <span class="identity-popover__value" title="${V(n)}">${V(r)}</span>
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

        <button class="btn btn--sm" id="signet-connect-btn" type="button" style="width: 100%;">Sign in with Signet</button>
      </div>
    </details>
  `,e.parentElement?.appendChild(a),a.querySelector(`#identity-logout-btn`)?.addEventListener(`click`,()=>{ug(),Ih(),u({identity:null,groups:{},activeGroupId:null}),a.remove(),window.location.reload()}),a.querySelector(`#recovery-reveal-btn`)?.addEventListener(`click`,()=>{let e=a.querySelector(`#recovery-reveal-area`);if(!e)return;let t=f().identity?.mnemonic;if(!t){e.textContent=``;let t=document.createElement(`p`);t.style.cssText=`font-size:0.75rem;color:var(--text-muted);`,t.textContent=`No recovery phrase stored (key was imported via nsec).`,e.appendChild(t);return}let n=t.split(` `);e.textContent=``;let r=document.createElement(`div`);r.style.cssText=`display:grid;grid-template-columns:repeat(3,1fr);gap:0.375rem;margin:0.375rem 0;`,n.forEach((e,t)=>{let n=document.createElement(`div`);n.style.cssText=`border:1px solid var(--border);border-radius:3px;padding:0.25rem;text-align:center;font-family:var(--font-mono,monospace);font-size:0.7rem;`;let i=document.createElement(`span`);i.style.color=`var(--text-muted)`,i.textContent=`${t+1}. `;let a=document.createElement(`span`);a.textContent=e,n.append(i,a),r.appendChild(n)}),e.appendChild(r);let i=document.createElement(`button`);i.className=`btn btn--sm`,i.type=`button`,i.style.cssText=`width:100%;margin-top:0.375rem;`,i.textContent=`Copy words`,i.addEventListener(`click`,async()=>{try{await navigator.clipboard.writeText(t),i.textContent=`Copied!`,setTimeout(()=>{i.textContent=`Copy words`},2e3),setTimeout(()=>{navigator.clipboard.writeText(``).catch(()=>{})},3e4)}catch{}}),e.appendChild(i)}),a.querySelector(`#nsec-reveal-btn`)?.addEventListener(`click`,()=>{let e=a.querySelector(`#nsec-reveal-area`);if(!e||!t?.privkey)return;let n=ks(H(t.privkey));e.innerHTML=`
      <code style="font-size: 0.65rem; word-break: break-all; display: block; background: var(--bg); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border); user-select: all;">${V(n)}</code>
      <button class="btn btn--sm" id="nsec-copy-btn" type="button" style="width: 100%; margin-top: 0.375rem;">Copy nsec</button>
    `,e.querySelector(`#nsec-copy-btn`)?.addEventListener(`click`,async e=>{let t=e.currentTarget;try{await navigator.clipboard.writeText(n),t.textContent=`Copied!`,setTimeout(()=>{t.textContent=`Copy nsec`},2e3),setTimeout(()=>{navigator.clipboard.writeText(``).catch(()=>{})},3e4)}catch{}})}),a.querySelector(`#nsec-login-form`)?.addEventListener(`submit`,e=>{e.preventDefault();let t=a.querySelector(`#nsec-input`);t?.value.trim()&&jg(t.value)&&a.remove()}),a.querySelector(`#signet-connect-btn`)?.addEventListener(`click`,async()=>{try{ug();let e=await Ph({theme:xg(),displayNameFallback:t?.displayName??`You`});if(!e)return;u({identity:Ag(e,t),groups:{},activeGroupId:null}),Og(),document.dispatchEvent(new CustomEvent(`canary:resync`)),a.remove()}catch(e){alert(e instanceof Error?e.message:`Signet rejected the request.`)}});let o=t=>{!a.contains(t.target)&&t.target!==e&&(a.remove(),document.removeEventListener(`click`,o))};requestAnimationFrame(()=>document.addEventListener(`click`,o))}function Ng(e){let t=Math.floor(e/86400);if(t>=1)return`${t}d`;let n=Math.floor(e/3600);return n>=1?`${n}h`:`${Math.floor(e/60)}m`}function Pg(e){return e?`
    <div class="identity-badge">
      <span class="identity-badge__name">${V(e.displayName??`${e.pubkey.slice(0,8)}…`)}</span>
    </div>
  `:``}function Fg(e,t){let n=Object.values(e);if(n.length===0)return`<div class="group-list__empty">No groups yet</div>`;let{activePersonaId:r,personas:i}=f();return n.map(e=>{let n=e.id===t,a=n?` group-list__item--active`:``,o=Ng(e.livenessInterval),s=Ng(e.livenessInterval),c=e.personaId?Object.values(i).find(t=>t.id===e.personaId):void 0,l=c?pg(c.name):``,u=c?.archived||r&&e.personaId!==r?` hidden`:``;return`
        <button
          class="group-list__item${a}"
          data-group-id="${V(e.id)}"
          aria-current="${n?`true`:`false`}"
          ${u}
        >
          ${l}<span class="group-list__name">${V(e.name)}</span>
          <span class="group-list__preset">${V(o)} · ${V(s)}</span>
        </button>
      `}).join(``)}function Ig(e){let{identity:t,groups:n,activeGroupId:r}=f();e.innerHTML=`
    <div class="sidebar__tagline">spoken-word verification</div>
    ${Pg(t)}
    <nav class="group-list" aria-label="Groups">
      ${Fg(n,r)}
    </nav>
    <button class="btn btn--primary" id="create-group-btn">+ New Group</button>
    <button class="btn btn--sm sidebar__sync-btn" id="sync-groups-btn" title="Sync groups from other devices">Sync Groups</button>
  `,e.querySelector(`.group-list`)?.addEventListener(`click`,e=>{let t=e.target.closest(`[data-group-id]`);if(!t)return;let n=t.dataset.groupId;n&&u({activeGroupId:n})}),e.querySelector(`#create-group-btn`)?.addEventListener(`click`,()=>{e.dispatchEvent(new CustomEvent(`canary:create-group`,{bubbles:!0}))}),e.querySelector(`#sync-groups-btn`)?.addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:sync-vault`))})}var Lg=`app-modal`;function Rg(e,t){let n=document.getElementById(Lg);if(n||(n=document.createElement(`dialog`),n.id=Lg,n.className=`modal`,document.body.appendChild(n)),n.innerHTML=`
    <form class="modal__form" method="dialog" id="modal-form">
      ${e}
    </form>
  `,t){let e=n.querySelector(`#modal-form`);e?.addEventListener(`submit`,n=>{n.preventDefault(),t(new FormData(e)),zg()})}n.addEventListener(`click`,e=>{e.target===n&&zg()}),n.showModal()}function zg(){document.getElementById(Lg)?.close()}var Bg=/^[0-9a-f]{64}$/,Vg=/^[0-9b-hjkmnp-z]+$/,Hg=new TextEncoder().encode(`canary:beacon:key`),Ug=new TextEncoder().encode(`canary:duress:key`);function Wg(e){if(!Bg.test(e))throw Error(`seedHex must be a 64-character lowercase hex string (32 bytes)`)}function Gg(e){if(e.length!==32)throw Error(`AES-256-GCM requires a 32-byte key`)}function Kg(e){return Wg(e),ei(H(e),Hg)}function qg(e){return Wg(e),ei(H(e),Ug)}async function Jg(e,t){Gg(e);let n=crypto.getRandomValues(new Uint8Array(12)),r=await crypto.subtle.importKey(`raw`,e,{name:`AES-GCM`},!1,[`encrypt`]),i=new Uint8Array(await crypto.subtle.encrypt({name:`AES-GCM`,iv:n},r,t)),a=new Uint8Array(12+i.length);return a.set(n),a.set(i,12),ai(a)}async function Yg(e,t,n){if(typeof t!=`string`||t.length===0||t.length>11)throw Error(`geohash must be a non-empty string of at most 11 characters`);if(!Vg.test(t))throw Error(`geohash contains invalid characters (valid: 0-9, b-h, j-k, m-n, p-z)`);if(!Number.isInteger(n)||n<1||n>11)throw Error(`precision must be an integer between 1 and 11`);let r={geohash:t,precision:n,timestamp:Math.floor(Date.now()/1e3)};return Jg(e,new TextEncoder().encode(JSON.stringify(r)))}function Xg(e,t,n){if(!Bg.test(e))throw Error(`Invalid member pubkey: expected 64 lowercase hex characters, got ${e.length} chars`);if(t){if(typeof t.geohash!=`string`||t.geohash.length===0||t.geohash.length>11)throw Error(`location.geohash must be a non-empty string of at most 11 characters`);if(!Vg.test(t.geohash))throw Error(`location.geohash contains invalid characters (valid: 0-9, b-h, j-k, m-n, p-z)`);if(!Number.isInteger(t.precision)||t.precision<1||t.precision>11)throw Error(`location.precision must be an integer between 1 and 11`);return{type:`duress`,member:e,geohash:t.geohash,precision:t.precision,locationSource:t.locationSource,timestamp:Math.floor(Date.now()/1e3),scope:n?.scope??`group`,...n?.originGroupId!==void 0&&{originGroupId:n.originGroupId}}}return{type:`duress`,member:e,geohash:``,precision:0,locationSource:`none`,timestamp:Math.floor(Date.now()/1e3),scope:n?.scope??`group`,...n?.originGroupId!==void 0&&{originGroupId:n.originGroupId}}}async function Zg(e,t){return Jg(e,new TextEncoder().encode(JSON.stringify(t)))}function Qg(){let{identity:e}=f();if(!e?.pubkey)throw Error(`No local identity — cannot perform privileged action.`);return e.pubkey}function $g(e){let t=Qg();if(!e.admins.includes(t))throw Error(`Not authorised — you are not an admin of "${e.name}".`)}function e_(e){let t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function t_(e,t,n,r){let a=crypto.randomUUID(),o=$i({name:e,members:n?[n]:[],preset:t,creator:n}),s=f().settings,c=[...s.defaultReadRelays??s.defaultRelays],l=[...s.defaultWriteRelays??s.defaultRelays],d=i([...s.knownRelays??[],...c,...l]),p={family:`words`,"field-ops":`words`,enterprise:`words`,event:`pin`},m={...o,id:a,nostrEnabled:l.length>0||c.length>0,relays:l,readRelays:c,writeRelays:l,knownRelays:d,encodingFormat:p[t]??`words`,usedInvites:[],latestInviteIssuedAt:0,livenessInterval:o.rotationInterval,livenessCheckins:{},tolerance:1,memberNames:{},duressMode:`immediate`,personaId:r??``},{groups:h}=f();return u({groups:{...h,[a]:m},activeGroupId:a}),n&&rg(a,{type:`member-join`,pubkey:n,timestamp:Math.floor(Date.now()/1e3),epoch:0,opId:crypto.randomUUID()}),a}function n_(e){let{groups:t,activeGroupId:n,deletedGroupIds:r}=f(),i={...t};delete i[e];let a=r.includes(e)?r:[...r,e];u({groups:i,activeGroupId:n===e?null:n,deletedGroupIds:a}),document.dispatchEvent(new CustomEvent(`canary:vault-publish-now`))}function r_(e){let{groups:t}=f(),n=t[e];if(!n){console.warn(`[canary:actions] reseedGroup: unknown group id "${e}"`);return}$g(n);let r=ta(n),i=(n.epoch??0)+1,a=crypto.randomUUID(),o=[...n.admins??[]];rg(e,{type:`reseed`,seed:e_(r.seed),counter:r.counter,timestamp:Math.floor(Date.now()/1e3),epoch:i,opId:a,admins:o,members:[...n.members]}),p(e,{...r,epoch:i,consumedOps:[a],admins:o}),ig(e)}function i_(e){let{groups:t}=f(),n=t[e];if(!n){console.warn(`[canary:actions] compromiseReseed: unknown group id "${e}"`);return}$g(n);let r=ta(n),i=(n.epoch??0)+1;p(e,{...r,epoch:i,consumedOps:[],admins:[...n.admins??[]]}),ig(e)}function a_(e,t,n){let{groups:r}=f(),i=r[e];if(!i){console.warn(`[canary:actions] addGroupMember: unknown group id "${e}"`);return}$g(i);let a=crypto.randomUUID();p(e,{...na(i,t),consumedOps:[...i.consumedOps??[],a]}),ig(e),rg(e,{type:`member-join`,pubkey:t,displayName:n||void 0,timestamp:Math.floor(Date.now()/1e3),epoch:i.epoch??0,opId:a})}function o_(e,t){let{groups:n}=f(),r=n[e];if(!r){console.warn(`[canary:actions] removeGroupMember: unknown group id "${e}"`);return}if(t!==Qg()&&$g(r),!r.members.includes(t))return;let i=ta(ra(r,t)),a=(r.epoch??0)+1,o={...r.memberNames??{}};delete o[t];let s={...r.livenessCheckins??{}};delete s[t];let c=(r.admins??[]).filter(e=>e!==t);p(e,{...i,memberNames:o,livenessCheckins:s,admins:c,epoch:a,consumedOps:[]}),ig(e)}function s_(e){let{groups:t}=f(),n=t[e];if(!n){console.warn(`[canary:actions] burnWord: unknown group id "${e}"`);return}let r=ea(n);p(e,r),rg(e,{type:`counter-advance`,counter:r.counter,usageOffset:r.usageOffset,timestamp:Math.floor(Date.now()/1e3)})}var c_=/^[0-9a-f]{64}$/;function l_(e){if(!e||typeof e!=`object`)throw Error(`Import failed — expected a JSON object.`);let t=e;if(typeof t.name!=`string`||t.name.trim().length===0)throw Error(`Import failed — name is required.`);if(typeof t.seed!=`string`||!c_.test(t.seed))throw Error(`Import failed — seed must be a 64-character lowercase hex string.`);if(!Array.isArray(t.members)||t.members.length===0)throw Error(`Import failed — members must be a non-empty array.`);for(let e of t.members)if(typeof e!=`string`||!c_.test(e))throw Error(`Import failed — invalid member pubkey: "${String(e)}".`);if(Array.isArray(t.admins)){for(let e of t.admins)if(typeof e!=`string`||!c_.test(e))throw Error(`Import failed — invalid admin pubkey: "${String(e)}".`);let e=new Set(t.members);for(let n of t.admins)if(!e.has(n))throw Error(`Import failed — admin "${n}" is not in the members list.`)}if(t.rotationInterval!==void 0&&(typeof t.rotationInterval!=`number`||!Number.isInteger(t.rotationInterval)||t.rotationInterval<=0))throw Error(`Import failed — rotationInterval must be a positive integer.`);if(t.wordCount!==void 0&&t.wordCount!==1&&t.wordCount!==2&&t.wordCount!==3)throw Error(`Import failed — wordCount must be 1, 2, or 3.`);if(t.encodingFormat!==void 0&&t.encodingFormat!==`words`&&t.encodingFormat!==`pin`&&t.encodingFormat!==`hex`)throw Error(`Import failed — encodingFormat must be words, pin, or hex.`);if(t.epoch!==void 0&&(typeof t.epoch!=`number`||!Number.isInteger(t.epoch)||t.epoch<0))throw Error(`Import failed — epoch must be a non-negative integer.`);if(t.consumedOps!==void 0&&(!Array.isArray(t.consumedOps)||!t.consumedOps.every(e=>typeof e==`string`)))throw Error(`Import failed — consumedOps must be an array of strings.`)}function u_(e){let{groups:t}=f();if(Object.keys(t).length>0){e.hidden=!0;return}e.hidden=!1,e.innerHTML=`
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
  `,document.getElementById(`welcome-create`).addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:create-group`))}),document.getElementById(`welcome-join`).addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:join-group`))})}var d_=`canary:group`;function f_(e){switch(e.encodingFormat){case`pin`:return{format:`pin`,digits:6};case`hex`:return{format:`hex`,length:8};default:return{format:`words`,count:e.wordCount}}}function p_(e,t){return t===`pin`&&e.length===6?`${e.slice(0,3)}-${e.slice(3)}`:t===`hex`&&e.length===8?`${e.slice(0,4)}-${e.slice(4)}`:e}function m_(e,t){let{identity:n}=f();return n?.pubkey===e?`You`:t.memberNames?.[e]||e.slice(0,8)+`…`}var h_=null;function g_(){h_!==null&&(clearInterval(h_),h_=null)}function __(e=new Date){return e.toISOString().slice(11,19)+` UTC`}function v_(e){return e.replace(/[a-zA-Z0-9]/g,`•`)}var y_=`ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789•·∘◦○●◈◆▪▫`;function b_(e,t,n=600){let r=t.length,i=Math.ceil(n/30),a=e=>Math.floor(e/r*i*.7)+Math.floor(i*.3),o=0,s=setInterval(()=>{o++;let n=``;for(let e=0;e<r;e++)o>=a(e)?n+=t[e]:n+=y_[Math.floor(Math.random()*65)];e.textContent=n,o>=i&&(clearInterval(s),e.textContent=t)},30)}function x_(e){if(e<=0)return`0s`;let t=Math.floor(e/86400),n=Math.floor(e%86400/3600),r=Math.floor(e%3600/60),i=Math.floor(e%60);return t>=1?n>0?`${t}d ${n}h`:`${t}d`:n>=1?r>0?`${n}h ${r}m`:`${n}h`:r>=1?i>0?`${r}m ${i}s`:`${r}m`:`${i}s`}function S_(e){let t=Math.floor(Date.now()/1e3),n=(Ai(t,e.rotationInterval)+1)*e.rotationInterval;return Math.max(0,n-t)}var C_=[`Sun`,`Mon`,`Tue`,`Wed`,`Thu`,`Fri`,`Sat`],w_=[`Jan`,`Feb`,`Mar`,`Apr`,`May`,`Jun`,`Jul`,`Aug`,`Sep`,`Oct`,`Nov`,`Dec`];function T_(e,t){if(t>=86400){let t=new Date(Date.now()+e*1e3);return`rotates ${C_[t.getUTCDay()]} ${t.getUTCDate()} ${w_[t.getUTCMonth()]} at ${String(t.getUTCHours()).padStart(2,`0`)}:${String(t.getUTCMinutes()).padStart(2,`0`)} UTC (${x_(e)})`}return`rotates in ${x_(e)} · ${__()}`}function E_(e){let{identity:t}=f(),n=e.counter+e.usageOffset;return Di(e.seed,d_,n,f_(e),t?.pubkey)}function D_(e){let{identity:t}=f();if(!t?.pubkey)return null;let n=e.counter+e.usageOffset;return Ki(e.seed,d_,t.pubkey,n,f_(e),e.tolerance)}function O_(e){g_();let{groups:t,activeGroupId:n}=f();if(!n){e.innerHTML=``;return}let i=t[n];if(!i){e.innerHTML=``;return}let a=ia(i);if(a!==i){p(n,a);return}let o=p_(E_(i),i.encodingFormat),s=D_(i),c=s?p_(s,i.encodingFormat):null,l=v_(o),u=S_(i);e.innerHTML=`
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
          <div class="hero__progress-bar" id="hero-progress-bar" style="width: ${Math.min(100,Math.max(0,(i.rotationInterval-u)/i.rotationInterval*100))}%"></div>
        </div>
        <span class="hero__countdown-label" id="hero-countdown-label">${T_(u,i.rotationInterval)}</span>
      </div>

      <p class="hero__hint">Press and hold to reveal. Tap the right side for your alternate word.</p>

      <button class="btn btn--ghost" id="burn-btn" type="button" title="Rotate to a new word now. All group members will get a new word too.">I used this word</button>
      <button class="btn btn--outline" id="hero-invite-btn" type="button" title="Share group access with someone new">Invite Someone</button>
      ${i.members.length>=2?`<button class="btn btn--outline" id="hero-call-btn" type="button" title="Start a phone call verification">Verify Call</button>`:``}

    </section>
  `;let d=e.querySelector(`#hero-word`),m=e.querySelector(`#hero-reveal-btn`);function h(e){d&&(d.textContent=e&&c?c:o,d.classList.remove(`hero__word--masked`),d.classList.add(`hero__word--revealed`))}function g(){d&&(d.textContent=l,d.classList.remove(`hero__word--revealed`),d.classList.add(`hero__word--masked`))}m&&(m.addEventListener(`pointerdown`,e=>{e.preventDefault();let t=m.getBoundingClientRect();h(e.clientX-t.left>t.width/2)}),m.addEventListener(`pointerup`,g),m.addEventListener(`pointerleave`,g),m.addEventListener(`pointercancel`,g)),e.querySelector(`#burn-btn`)?.addEventListener(`click`,()=>{try{s_(n),Y(r(f().groups[n]??i)===`online`?`Word rotated — syncing to group`:`Word rotated`,`success`,2e3),document.dispatchEvent(new CustomEvent(`canary:vault-publish-now`)),requestAnimationFrame(()=>{let e=document.getElementById(`hero-word`);e&&b_(e,e.textContent??`••••••••`)})}catch(e){Y(e instanceof Error?e.message:`Failed to rotate word`,`error`)}}),e.querySelector(`#hero-invite-btn`)?.addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:show-invite`,{detail:{groupId:n}}))}),e.querySelector(`#hero-call-btn`)?.addEventListener(`click`,()=>{let{identity:e}=f(),t=i.members.filter(t=>t!==e?.pubkey);if(t.length===0)return;if(t.length===1){document.dispatchEvent(new CustomEvent(`canary:verify-call`,{detail:{groupId:n,pubkey:t[0]}}));return}let r=t.map(e=>`
      <button class="btn btn--outline member-pick-btn" data-pubkey="${V(e)}" type="button" style="width:100%;text-align:left;margin-bottom:0.5rem;">
        ${V(m_(e,i))}
      </button>
    `).join(``),a=document.getElementById(`member-picker`);a||(a=document.createElement(`dialog`),a.id=`member-picker`,a.className=`modal`,document.body.appendChild(a)),a.innerHTML=`
      <div class="modal__form" style="min-width:240px;">
        <h2 class="modal__title">Who are you calling?</h2>
        ${r}
        <div class="modal__actions">
          <button class="btn" id="picker-cancel" type="button">Cancel</button>
        </div>
      </div>
    `,a.querySelector(`#picker-cancel`)?.addEventListener(`click`,()=>a.close()),a.addEventListener(`click`,e=>{e.target===a&&a.close()}),a.querySelectorAll(`.member-pick-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.pubkey;a.close(),t&&document.dispatchEvent(new CustomEvent(`canary:verify-call`,{detail:{groupId:n,pubkey:t}}))})}),a.showModal()});let _=e.querySelector(`#hero-progress-bar`),v=e.querySelector(`#hero-countdown-label`);h_=setInterval(()=>{let{groups:t}=f(),r=t[n];if(!r){g_();return}let i=S_(r),a=Math.min(100,Math.max(0,(r.rotationInterval-i)/r.rotationInterval*100));_&&(_.style.width=`${a}%`),v&&(v.textContent=T_(i,r.rotationInterval)),i===0&&(g_(),O_(e))},1e3)}var k_=`canary:duress-dismissed`;function A_(){try{let e=localStorage.getItem(k_);return e?new Set(JSON.parse(e)):new Set}catch{return new Set}}function j_(e){let t=A_();t.add(e),localStorage.setItem(k_,JSON.stringify([...t]))}function M_(e){let t=A_();t.delete(e),localStorage.setItem(k_,JSON.stringify([...t]))}function N_(e,t){let n=f().groups[t];if(!n)return e.slice(0,8);let{identity:r}=f();return r?.pubkey===e?`You`:n.memberNames?.[e]||`${e.slice(0,8)}\u2026${e.slice(-4)}`}function P_(e){let t=Math.floor(Date.now()/1e3)-e;if(t<30)return`just now`;if(t<60)return`${t}s ago`;let n=Math.floor(t/60);return n<60?`${n} min ago`:new Date(e*1e3).toLocaleTimeString()}function F_(e,t,n,r,i){if(!i&&A_().has(e))return;let a=document.querySelector(`.duress-overlay`);a&&a.remove();let o=N_(e,t),s=r?P_(r):new Date().toLocaleTimeString(),c=document.createElement(`div`);c.className=`duress-overlay`,c.dataset.subject=e,c.dataset.groupId=t,c.setAttribute(`role`,`alertdialog`),c.setAttribute(`aria-label`,`${o} needs help`);let l=document.createElement(`div`);l.className=`duress-overlay__content`;let u=document.createElement(`div`);u.className=`duress-overlay__icon`,u.setAttribute(`aria-hidden`,`true`),u.textContent=`!`,l.appendChild(u);let d=document.createElement(`h1`);d.className=`duress-overlay__title`,d.textContent=o,l.appendChild(d);let p=document.createElement(`h2`);if(p.className=`duress-overlay__subtitle`,p.textContent=`NEEDS HELP`,l.appendChild(p),n&&(n.lat!==0||n.lon!==0)){let e=document.createElement(`p`);e.className=`duress-overlay__location`,e.textContent=`Last known: ${n.lat.toFixed(4)}, ${n.lon.toFixed(4)}`,l.appendChild(e)}let m=document.createElement(`p`);m.className=`duress-overlay__time`,m.textContent=s,l.appendChild(m);let h=document.createElement(`button`);h.className=`btn btn--lg duress-overlay__dismiss`,h.textContent=`I'm Responding`,h.title=`Dismiss this alert on your screen only — does not clear the duress for others`,h.addEventListener(`click`,()=>{j_(e),c.classList.remove(`duress-overlay--visible`),setTimeout(()=>c.remove(),300)}),l.appendChild(h);let g=document.createElement(`button`);g.className=`btn btn--lg duress-overlay__stand-down`,g.textContent=`Stand Down — Person is Safe`,g.title=`Broadcast to all group members that this person has been confirmed safe`,g.addEventListener(`click`,()=>{j_(e),rg(t,{type:`duress-clear`,subject:e,timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID()}),c.classList.remove(`duress-overlay--visible`),setTimeout(()=>c.remove(),300);let{identity:n}=f();Y(`Duress stood down for ${o} by ${n?.pubkey===e?`Self`:N_(n?.pubkey??``,t)}`,`success`)}),l.appendChild(g),c.appendChild(l),document.body.appendChild(c),requestAnimationFrame(()=>c.classList.add(`duress-overlay--visible`));function _(e){e.key===`Escape`&&(c.classList.remove(`duress-overlay--visible`),setTimeout(()=>c.remove(),300),document.removeEventListener(`keydown`,_))}document.addEventListener(`keydown`,_)}document.addEventListener(`canary:duress-clear`,(e=>{let{subject:t,clearedBy:n}=e.detail;M_(t);let r=Array.from(document.querySelectorAll(`.duress-overlay`)).find(e=>e.dataset.subject===t);r&&(r.classList.remove(`duress-overlay--visible`),setTimeout(()=>r.remove(),300));let i=e.detail.groupId,a=N_(t,i),o=N_(n,i);Y(t===n?`${a} self-cleared their duress`:`${o} confirmed ${a} is safe`,`success`)}));function I_(e){let t=new Uint32Array(1);return crypto.getRandomValues(t),t[0]%e}function L_(e){let{groups:t,activeGroupId:n,identity:r}=f();if(r?.pubkey===e)return`You`;if(!n)return e.slice(0,8)+`…`;let i=t[n];return i&&i.memberNames?.[e]||e.slice(0,8)+`…`}function R_(e,t){let n=[],r=new Set(t);for(;n.length<e;){let e=pi(I_(di)).toLowerCase();r.has(e)||(r.add(e),n.push(e))}return n}function z_(e){for(let t=e.length-1;t>0;t--){let n=I_(t+1);[e[t],e[n]]=[e[n],e[t]]}return e}function B_(e,t){for(let n of e)F_(n,t,void 0,Math.floor(Date.now()/1e3),!0);document.dispatchEvent(new CustomEvent(`canary:duress`,{detail:{members:e},bubbles:!0}));let{groups:n}=f(),r=n[t];if(!r)return;let i=qg(r.seed);for(let n of e)Zg(i,Xg(n,null)),rg(t,{type:`duress-alert`,lat:0,lon:0,timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID(),subject:n})}function V_(e){let{groups:t,activeGroupId:n}=f();if(!n){e.innerHTML=``;return}let r=t[n];if(!r){e.innerHTML=``;return}let{identity:i}=f(),a=r.members.filter(e=>e!==i?.pubkey);if(a.length===0){e.innerHTML=`
      <section class="panel verify-panel">
        <h2 class="panel__title">Verify Someone</h2>
        <p class="settings-hint">No other members to verify yet. Invite someone first.</p>
      </section>
    `;return}e.innerHTML=`
    <section class="panel verify-panel">
      <h2 class="panel__title">Verify Someone</h2>
      <p class="settings-hint">Who are you verifying?</p>

      <div class="verify-member-list" id="verify-member-list">
        ${a.map(e=>`<button class="verify-member-btn btn btn--outline" data-pubkey="${V(e)}" type="button">${V(L_(e))}</button>`).join(``)}
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
  `;let o=e.querySelector(`#verify-member-list`),s=e.querySelector(`#verify-choices-area`),c=e.querySelector(`#verify-choices`),l=e.querySelector(`#verify-prompt`),u=e.querySelector(`#verify-result`),d=e.querySelector(`#verify-back`);function p(e){let{groups:t,activeGroupId:n}=f();if(!n)return;let r=t[n];if(!r)return;let i=Ai(Math.floor(Date.now()/1e3),r.rotationInterval)+r.usageOffset,a=f_(r),d=Di(r.seed,d_,i,a,e).toLowerCase(),p=Ki(r.seed,d_,e,i,a,r.tolerance)?.toLowerCase(),h=new Set([d]);p&&h.add(p);let g=R_(p?2:3,h),_=z_([d,...p?[p]:[],...g]);l.textContent=`Tap the word ${L_(e)} just said:`,u.hidden=!0,c.innerHTML=_.map(e=>`<button class="verify-choice" data-word="${V(e)}" type="button">${V(p_(e,r.encodingFormat))}</button>`).join(``),o.hidden=!0,s.hidden=!1,c.querySelectorAll(`.verify-choice`).forEach(t=>{t.addEventListener(`click`,()=>m(t.dataset.word??``,t,e))})}function m(e,t,n){let{groups:r,activeGroupId:i}=f();if(!i)return;let a=r[i];if(!a)return;let o=Ai(Math.floor(Date.now()/1e3),a.rotationInterval)+a.usageOffset,s=qi(a.seed,d_,o,e,a.members,{encoding:f_(a),tolerance:a.tolerance}),l=s.status===`valid`,p=L_(n);c.querySelectorAll(`.verify-choice`).forEach(e=>e.classList.remove(`verify-choice--correct`,`verify-choice--wrong`)),t.classList.add(l?`verify-choice--correct`:`verify-choice--wrong`),u.hidden=!1,u.className=`verify-result verify-result--${l?`valid`:`invalid`}`,u.textContent=l?`${p} is verified.`:`${p} gave the wrong word.`,d.hidden=!1,s.status===`duress`&&B_(s.identities??[],i)}e.querySelectorAll(`.verify-member-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.pubkey;t&&p(t)})}),d.addEventListener(`click`,()=>{o.hidden=!1,s.hidden=!0,u.hidden=!0,d.hidden=!0});let h=e.querySelector(`#verify-input`),g=e.querySelector(`#verify-btn`);function _(){let e=h?.value.trim().toLowerCase().replace(/-/g,``)??``;if(!e)return;let{groups:t,activeGroupId:n}=f();if(!n)return;let r=t[n];if(!r)return;let i=Ai(Math.floor(Date.now()/1e3),r.rotationInterval)+r.usageOffset,a=qi(r.seed,d_,i,e,r.members,{encoding:f_(r),tolerance:r.tolerance}),o=a.status===`valid`;u.hidden=!1,u.className=`verify-result verify-result--${o?`valid`:`invalid`}`,u.textContent=o?`Verified.`:`Wrong word.`,d.hidden=!1,a.status===`duress`&&B_(a.identities??[],n)}g?.addEventListener(`click`,_),h?.addEventListener(`keydown`,e=>{e.key===`Enter`&&_()})}function H_(e){let t=JSON.stringify(e),n=new TextEncoder().encode(t),r=``;for(let e=0;e<n.length;e++)r+=String.fromCharCode(n[e]);return btoa(r)}function U_(e){let t=atob(e),n=new Uint8Array(t.length);for(let e=0;e<t.length;e++)n[e]=t.charCodeAt(e);return JSON.parse(new TextDecoder().decode(n))}function W_(e){return H_(e).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=+$/,``)}function G_(e){let t=e.replace(/-/g,`+`).replace(/_/g,`/`),n=t.length%4;return n===2?t+=`==`:n===3&&(t+=`=`),U_(t)}function K_(e){let t=``;for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return btoa(t).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=+$/,``)}function q_(e){let t=e.replace(/-/g,`+`).replace(/_/g,`/`),n=t.length%4;n===2?t+=`==`:n===3&&(t+=`=`);let r=atob(t),i=new Uint8Array(r.length);for(let e=0;e<r.length;e++)i[e]=r.charCodeAt(e);return i}var J_=/^[0-9a-f]{64}$/,Y_=/^[0-9a-f]{128}$/,X_=/^[0-9a-f]{32}$/;function Z_(e){let{adminSig:t,...n}=e,r=Object.keys(n).sort().reduce((e,t)=>(e[t]=n[t],e),{});return new TextEncoder().encode(JSON.stringify(r))}var Q_=27235;function $_(e){return{kind:Q_,created_at:e.issuedAt??Math.max(0,e.expiresAt-86400),tags:[[`client`,`canary-kit`],[`canary-protocol`,`remote-invite-v1`],[`g`,e.groupId],[`d`,e.inviteId]],content:new TextDecoder().decode(Z_(e))}}function ev(e){return H(Pe({...$_(e),pubkey:e.adminPubkey}))}function tv(e){try{let t=Qr(Z_(e));if(j.verify(H(e.adminSig),t,H(e.adminPubkey)))return!0}catch{}try{return j.verify(H(e.adminSig),ev(e),H(e.adminPubkey))}catch{return!1}}function nv(e,t,n){let r=e;if(!r||typeof r!=`object`)throw Error(`NIP-07 signer returned an invalid event.`);if(r.pubkey!==t)throw Error(`NIP-07 signer used a different public key.`);if(typeof r.sig!=`string`||!Y_.test(r.sig))throw Error(`NIP-07 signer returned an invalid signature.`);let i=Pe({...n,pubkey:t});if(r.id&&r.id!==i)throw Error(`NIP-07 signer returned a signature for a different event.`)}function rv(e){let{groupName:t,groupId:n,adminPubkey:r,adminPrivkey:i,relays:a,expiresInSec:o=86400}=e,s=new Uint8Array(16);crypto.getRandomValues(s);let c=ni(s),l=Math.floor(Date.now()/1e3),u={groupName:t,groupId:n,adminPubkey:r,inviteId:c,issuedAt:l,expiresAt:l+o,relays:[...a],adminSig:``},d=Qr(Z_(u));return u.adminSig=ni(j.sign(d,H(i))),u}async function iv(e){let{groupName:t,groupId:n,adminPubkey:r,relays:i,signEvent:a,expiresInSec:o=86400}=e,s=new Uint8Array(16);crypto.getRandomValues(s);let c=ni(s),l=Math.floor(Date.now()/1e3),u={groupName:t,groupId:n,adminPubkey:r,inviteId:c,issuedAt:l,expiresAt:l+o,relays:[...i],adminSig:``},d=$_(u),f=await a(d);return nv(f,r,d),u.adminSig=f.sig,u}function av(e){if(typeof e!=`object`||!e)throw Error(`Remote invite token must be a non-null object`);let t=e;if(typeof t.groupName!=`string`||t.groupName.length===0)throw Error(`groupName must be a non-empty string`);if(typeof t.groupId!=`string`||t.groupId.length===0)throw Error(`groupId must be a non-empty string`);if(typeof t.adminPubkey!=`string`||!J_.test(t.adminPubkey))throw Error(`adminPubkey must be a 64-character hex string`);if(typeof t.inviteId!=`string`||!X_.test(t.inviteId))throw Error(`inviteId must be a 32-character hex string`);if(typeof t.adminSig!=`string`||!Y_.test(t.adminSig))throw Error(`adminSig must be a 128-character hex string`);if(!Array.isArray(t.relays)||!t.relays.every(e=>typeof e==`string`))throw Error(`relays must be an array of strings`);if(typeof t.expiresAt!=`number`||!Number.isFinite(t.expiresAt))throw Error(`expiresAt must be a finite number`);if(t.issuedAt!==void 0&&(typeof t.issuedAt!=`number`||!Number.isFinite(t.issuedAt)))throw Error(`issuedAt must be a finite number`);let n=Math.floor(Date.now()/1e3);if(t.expiresAt<=n)throw Error(`Remote invite token has expired`);if(!tv(e))throw Error(`Remote invite token signature is invalid`)}function ov(e){let{welcome:t,adminPrivkey:n,joinerPubkey:r}=e;return ho(JSON.stringify(t),G(H(n),r))}function sv(e){let{envelope:t,joinerPrivkey:n,adminPubkey:r,expectedInviteId:i}=e;return cv(go(t,G(H(n),r)),i)}function cv(e,t){let n=JSON.parse(e);if(typeof n.inviteId!=`string`||!X_.test(n.inviteId))throw Error(`Welcome payload must include a valid inviteId`);if(n.inviteId!==t)throw Error(`Welcome payload inviteId does not match the pending invite`);if(typeof n.seed!=`string`||!J_.test(n.seed))throw Error(`Welcome payload seed must be a 64-character hex string`);if(typeof n.groupId!=`string`||n.groupId.length===0)throw Error(`Welcome payload must include a non-empty groupId`);return n}function lv(e){if(e.startsWith(`wss://`))return!0;if(e.startsWith(`ws://`))try{let t=new URL(e);return t.hostname===`localhost`||t.hostname===`127.0.0.1`||t.hostname===`[::1]`}catch{return!1}return!1}var uv=/^[0-9a-f]{64}$/,dv=/^[0-9a-f]{128}$/,fv=/^[0-9a-f]{32}$/,pv=10080*60,mv=300;function hv(e){return typeof e==`number`&&Number.isInteger(e)&&e>=0}function gv(){let e=new Uint8Array(16);return crypto.getRandomValues(e),Array.from(e).map(e=>e.toString(16).padStart(2,`0`)).join(``)}function _v(e){let t=e;if(!t||typeof t!=`object`)throw Error(`Invalid invite payload — expected an object.`);if(typeof t.groupId!=`string`||t.groupId.length===0)throw Error(`Invalid invite payload — groupId is required.`);if(typeof t.seed!=`string`||!uv.test(t.seed))throw Error(`Invalid invite payload — seed must be 64-char hex.`);if(typeof t.groupName!=`string`||t.groupName.trim().length===0)throw Error(`Invalid invite payload — groupName is required.`);if(!Number.isInteger(t.rotationInterval)||t.rotationInterval<=0)throw Error(`Invalid invite payload — rotationInterval must be > 0.`);if(t.wordCount!==1&&t.wordCount!==2&&t.wordCount!==3)throw Error(`Invalid invite payload — wordCount must be 1, 2, or 3.`);if(typeof t.wordlist!=`string`||t.wordlist.length===0)throw Error(`Invalid invite payload — wordlist is required.`);if(!hv(t.counter)||!hv(t.usageOffset))throw Error(`Invalid invite payload — counter and usageOffset must be non-negative integers.`);if(typeof t.nonce!=`string`||!fv.test(t.nonce))throw Error(`Invalid invite payload — nonce must be 32-char hex.`);if(!Number.isInteger(t.beaconInterval)||t.beaconInterval<=0)throw Error(`Invalid invite payload — beaconInterval must be > 0.`);if(!Number.isInteger(t.beaconPrecision)||t.beaconPrecision<1||t.beaconPrecision>11)throw Error(`Invalid invite payload — beaconPrecision must be 1..11.`);if(!Array.isArray(t.members)||!t.members.every(e=>typeof e==`string`&&uv.test(e)))throw Error(`Invalid invite payload — members must be 64-char hex pubkeys.`);if(!Array.isArray(t.relays)||!t.relays.every(e=>typeof e==`string`&&lv(e)))throw Error(`Invalid invite payload — relays must be wss:// URLs (or ws:// for localhost).`);if(t.encodingFormat!==`words`&&t.encodingFormat!==`pin`&&t.encodingFormat!==`hex`)throw Error(`Invalid invite payload — encodingFormat must be words|pin|hex.`);if(!hv(t.tolerance))throw Error(`Invalid invite payload — tolerance must be a non-negative integer.`);if(t.tolerance>10)throw Error(`Invalid invite payload — tolerance must be <= 10.`);if(!hv(t.issuedAt)||!hv(t.expiresAt))throw Error(`Invalid invite payload — issuedAt/expiresAt must be unix seconds.`);if(t.expiresAt<=t.issuedAt)throw Error(`Invalid invite payload — expiresAt must be after issuedAt.`);if(!hv(t.epoch))throw Error(`Invalid invite payload — epoch must be a non-negative integer.`);if(!Array.isArray(t.admins)||!t.admins.every(e=>typeof e==`string`&&uv.test(e)))throw Error(`Invalid invite payload — admins must be 64-char hex pubkeys.`);let n=new Set(t.members);if(!t.admins.every(e=>n.has(e)))throw Error(`Invalid invite payload — all admins must be in members.`);if(t.protocolVersion===void 0||t.protocolVersion===null)throw Error(`Invalid invite payload — protocolVersion is required.`);if(t.protocolVersion!==2)throw Error(`Unsupported invite protocol version: ${t.protocolVersion} (expected: 2)`);if(typeof t.inviterPubkey!=`string`||!uv.test(t.inviterPubkey))throw Error(`Invalid invite payload — inviterPubkey must be a 64-char hex pubkey.`);if(!t.admins.includes(t.inviterPubkey))throw Error(`Invalid invite payload — inviterPubkey must be in admins.`);if(typeof t.inviterSig!=`string`||!dv.test(t.inviterSig))throw Error(`Invalid invite payload — inviterSig must be a 128-char hex Schnorr signature.`)}function vv(e){let{inviterSig:t,memberNames:n,relays:r,...i}=e,a=Object.keys(i).sort().reduce((e,t)=>(e[t]=i[t],e),{});return new TextEncoder().encode(JSON.stringify(a))}function yv(e,t){let n=Qr(vv(e));return ni(j.sign(n,H(t)))}var bv=27234;function xv(e){return{kind:bv,created_at:e.issuedAt,tags:[[`client`,`canary-kit`],[`canary-protocol`,`invite-v1`],[`g`,e.groupId],[`nonce`,e.nonce]],content:new TextDecoder().decode(vv(e))}}function Sv(e){return H(Pe({...xv(e),pubkey:e.inviterPubkey}))}function Cv(e,t,n){let r=e;if(!r||typeof r!=`object`)throw Error(`External signer returned an invalid event.`);if(r.pubkey!==t)throw Error(`External signer used a different public key.`);if(typeof r.sig!=`string`||!dv.test(r.sig))throw Error(`External signer returned an invalid signature.`);let i=Pe({...n,pubkey:t});if(r.id&&r.id!==i)throw Error(`External signer returned a signature for a different event.`)}function wv(e){try{let t=Qr(vv(e));if(j.verify(H(e.inviterSig),t,H(e.inviterPubkey)))return!0}catch{}try{return j.verify(H(e.inviterSig),Sv(e),H(e.inviterPubkey))}catch{return!1}}function Tv(e){let{nonce:t,relays:n,memberNames:r,...i}=e,a=JSON.stringify(i),o=new TextEncoder,s=ei(H(t),o.encode(a)),c=s[0]<<25|s[1]<<17|s[2]<<9|s[3]<<1|s[4]>>7,l=c>>>22&2047,u=c>>>11&2047,d=c&2047;return`${pi(l)} ${pi(u)} ${pi(d)}`}function Ev(e,t){if(!e?.pubkey)throw Error(`No identity — sign in first.`);if(!t.admins.includes(e.pubkey))throw Error(`Not authorised — you are not an admin of "${t.name}".`)}function Dv(e,t){let n=gv(),r=Math.floor(Date.now()/1e3);return{groupId:e.id,seed:e.seed,groupName:e.name,rotationInterval:e.rotationInterval,wordCount:e.wordCount,wordlist:e.wordlist,counter:e.counter,usageOffset:e.usageOffset,nonce:n,beaconInterval:e.beaconInterval,beaconPrecision:e.beaconPrecision,members:[...e.members],relays:[...e.writeRelays??e.relays??[]],encodingFormat:e.encodingFormat??`words`,tolerance:e.tolerance??1,issuedAt:r,expiresAt:r+pv,epoch:e.epoch??0,admins:[...e.admins??[]],protocolVersion:2,inviterPubkey:t,inviterSig:``,memberNames:{...e.memberNames}}}async function Ov(e,t){if(t.privkey)return yv(e,t.privkey);if(kh(t)){let n=xv(e),r=await Rh(t,n,{interactive:!0});return Cv(r,e.inviterPubkey,n),r.sig}throw Error(`Invite creation requires a local key or a Signet signer.`)}async function kv(e){let{identity:t}=f();Ev(t,e);let n=Dv(e,t.pubkey);return n.inviterSig=await Ov(n,t),{payload:n,confirmCode:Tv(n)}}function Av(e,t){let n;try{n=U_(e)}catch{throw Error(`Invalid invite payload — could not decode.`)}_v(n);let r={groupId:n.groupId,seed:n.seed,groupName:n.groupName,rotationInterval:n.rotationInterval,wordCount:n.wordCount,wordlist:n.wordlist,counter:n.counter,usageOffset:n.usageOffset,nonce:n.nonce,beaconInterval:n.beaconInterval,beaconPrecision:n.beaconPrecision,members:[...n.members],relays:[...n.relays],encodingFormat:n.encodingFormat,tolerance:n.tolerance,issuedAt:n.issuedAt,expiresAt:n.expiresAt,epoch:n.epoch,admins:[...n.admins],protocolVersion:n.protocolVersion,inviterPubkey:n.inviterPubkey,inviterSig:n.inviterSig,memberNames:n.memberNames&&typeof n.memberNames==`object`?{...n.memberNames}:void 0};if(!wv(r))throw Error(`Invite signature is invalid — the inviter could not prove control of the admin key.`);if(!t?.trim())throw Error(`Confirmation code is required — ask the sender to read it to you.`);let i=Tv(r);if(t.trim().replace(/[-\s]+/g,` `).toLowerCase()!==i.toLowerCase())throw Error(`Confirmation words do not match — invite may have been tampered with.`);let a=Math.floor(Date.now()/1e3);if(r.expiresAt<=a)throw Error(`Invite has expired. Ask for a new invite.`);if(r.issuedAt>a+mv)throw Error(`Invite timestamp is too far in the future — check your device clock.`);return r}function jv(e,t){let{groups:n}=f(),r=n[e];return r?Array.isArray(r.usedInvites)&&r.usedInvites.includes(t):!1}function Mv(e,t){let{groups:n}=f(),r=n[e];if(!r){console.warn(`[canary:invite] consumeInvite: unknown group id "${e}"`);return}p(e,{usedInvites:Array.from(new Set([...r.usedInvites,t]))})}var Nv=10080*60;function Pv(e){let t=Object.keys(e).sort().reduce((t,n)=>(t[n]=e[n],t),{});return new TextEncoder().encode(JSON.stringify(t))}function Fv(e,t){let n;try{n=U_(e)}catch{return{valid:!1,error:`Invalid join token — could not decode.`}}if(n.g!==t.groupId)return{valid:!1,error:`Join token is for a different group.`};if(typeof n.p!=`string`||!uv.test(n.p))return{valid:!1,error:`Join token has invalid pubkey.`};if(typeof n.s!=`string`||!dv.test(n.s))return{valid:!1,error:`Join token has invalid signature.`};let r=Math.floor(Date.now()/1e3);if(typeof n.t!=`number`||n.t<r-Nv)return{valid:!1,error:`Join token has expired or is stale.`};if(n.t>r+mv)return{valid:!1,error:`Join token timestamp is too far in the future.`};let{s:i,...a}=n,o=Qr(Pv(a));try{if(!j.verify(H(n.s),o,H(n.p)))return{valid:!1,error:`Join token signature is invalid.`}}catch{return{valid:!1,error:`Join token signature verification failed.`}}let s=(n.w||``).toLowerCase(),c=t.tolerance??1,l=!1;for(let e=t.counter-c;e<=t.counter+c;e++)if(!(e<0)&&s===Di(t.groupSeed,t.context,e,t.encoding).toLowerCase()){l=!0;break}return l?{valid:!0,pubkey:n.p,displayName:n.n||``,word:n.w||``}:{valid:!1,error:`Join token word does not match — seed possession not proven.`}}var Iv=null;function Lv(e){return e.writeRelays?.length?[...e.writeRelays]:[...f().settings.defaultWriteRelays??f().settings.defaultRelays]}function Rv(e,t){if(!e?.pubkey)throw Error(`No identity — sign in first.`);if(!t.admins.includes(e.pubkey))throw Error(`Not authorised — you are not an admin of "${t.name}".`)}function zv(e,t){return{inviteId:t,seed:e.seed,counter:e.counter,usageOffset:e.usageOffset,epoch:e.epoch??0,wordCount:e.wordCount,rotationInterval:e.rotationInterval,groupId:e.id,groupName:e.name,wordlist:e.wordlist,beaconInterval:e.beaconInterval,beaconPrecision:e.beaconPrecision,encodingFormat:e.encodingFormat??`words`,tolerance:e.tolerance??1,members:[...e.members],admins:[...e.admins??[]],relays:[...e.writeRelays??e.relays??[]],memberNames:e.memberNames?{...e.memberNames}:void 0}}async function Bv(e){let{identity:t}=f();Rv(t,e);let n=Lv(e),r=t.privkey?rv({groupName:e.name,groupId:e.id,adminPubkey:t.pubkey,adminPrivkey:t.privkey,relays:n}):kh(t)?await iv({groupName:e.name,groupId:e.id,adminPubkey:t.pubkey,relays:n,signEvent:e=>Rh(t,e,{interactive:!0})}):null;if(!r)throw Error(`Invite creation requires a local key or a Signet signer.`);return Iv={groupId:e.id,tokenPayload:W_(r),inviteId:r.inviteId},Iv}async function Vv(e,t){let{identity:n}=f();if(!n?.pubkey)throw Error(`No identity — sign in first.`);if(!Iv)throw Error(`No active remote invite session — cannot create welcome envelope.`);let r=zv(e,Iv.inviteId);if(n.privkey)return ov({welcome:r,adminPrivkey:n.privkey,joinerPubkey:t});if(kh(n))return zh(n,t,JSON.stringify(r),{interactive:!0});throw Error(`No local key or Signet signer — cannot create welcome envelope.`)}function Hv(){Iv=null}function Uv(e){let t=new Uint8Array(e.length/2);for(let n=0;n<t.length;n++)t[n]=parseInt(e.substring(n*2,n*2+2),16);return t}function Wv(e){let t=``;for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,`0`);return t}var Gv={words:0,pin:1,hex:2},Kv={0:`words`,1:`pin`,2:`hex`},qv={"en-v1":0},Jv={0:`en-v1`},Yv=1,Xv=new TextEncoder,Zv=new TextDecoder;function Qv(e){let t=Xv.encode(e.groupId),n=Xv.encode(e.groupName),r=e.admins.map(t=>{let n=e.members.indexOf(t);if(n===-1)throw Error(`Admin ${t} not found in members array`);return n}),i=178+e.members.length*32+1+r.length+1+t.length+1+n.length,a=new ArrayBuffer(i),o=new DataView(a),s=new Uint8Array(a),c=0;o.setUint8(c,Yv),c+=1,s.set(Uv(e.seed),c),c+=32,s.set(Uv(e.inviterPubkey),c),c+=32,s.set(Uv(e.inviterSig),c),c+=64,s.set(Uv(e.nonce),c),c+=16,o.setUint32(c,e.counter),c+=4,o.setUint16(c,e.usageOffset),c+=2,o.setUint32(c,e.epoch),c+=4,o.setUint32(c,e.rotationInterval),c+=4,o.setUint32(c,e.beaconInterval),c+=4,o.setUint8(c,e.beaconPrecision),c+=1,o.setUint8(c,e.wordCount),c+=1,o.setUint8(c,e.tolerance),c+=1,o.setUint8(c,Gv[e.encodingFormat]??0),c+=1,o.setUint8(c,qv[e.wordlist]??0),c+=1,o.setUint32(c,e.issuedAt),c+=4,o.setUint32(c,e.expiresAt),c+=4,o.setUint8(c,e.protocolVersion),c+=1,o.setUint8(c,e.members.length),c+=1;for(let t of e.members)s.set(Uv(t),c),c+=32;o.setUint8(c,r.length),c+=1;for(let e of r)o.setUint8(c,e),c+=1;return o.setUint8(c,t.length),c+=1,s.set(t,c),c+=t.length,o.setUint8(c,n.length),c+=1,s.set(n,c),c+=n.length,s}function $v(e){let t=new DataView(e.buffer,e.byteOffset,e.byteLength),n=0,r=t.getUint8(n);if(n+=1,r!==Yv)throw Error(`Unsupported binary invite version: ${r}`);let i=Wv(e.slice(n,n+32));n+=32;let a=Wv(e.slice(n,n+32));n+=32;let o=Wv(e.slice(n,n+64));n+=64;let s=Wv(e.slice(n,n+16));n+=16;let c=t.getUint32(n);n+=4;let l=t.getUint16(n);n+=2;let u=t.getUint32(n);n+=4;let d=t.getUint32(n);n+=4;let f=t.getUint32(n);n+=4;let p=t.getUint8(n);n+=1;let m=t.getUint8(n);n+=1;let h=t.getUint8(n);n+=1;let g=Kv[t.getUint8(n)]??`words`;n+=1;let _=Jv[t.getUint8(n)]??`en-v1`;n+=1;let v=t.getUint32(n);n+=4;let y=t.getUint32(n);n+=4;let b=t.getUint8(n);n+=1;let x=t.getUint8(n);n+=1;let S=[];for(let t=0;t<x;t++)S.push(Wv(e.slice(n,n+32))),n+=32;let C=t.getUint8(n);n+=1;let w=[];for(let e=0;e<C;e++){let e=t.getUint8(n);if(n+=1,e>=S.length)throw Error(`Invalid admin index ${e} in binary invite (${S.length} members)`);w.push(S[e])}let T=t.getUint8(n);n+=1;let E=Zv.decode(e.slice(n,n+T));n+=T;let D=t.getUint8(n);n+=1;let O=Zv.decode(e.slice(n,n+D));return n+=D,{groupId:E,seed:i,groupName:O,rotationInterval:d,wordCount:m,wordlist:_,counter:c,usageOffset:l,nonce:s,beaconInterval:f,beaconPrecision:p,members:S,relays:[],encodingFormat:g,tolerance:h,issuedAt:v,expiresAt:y,epoch:u,admins:w,protocolVersion:b,inviterPubkey:a,inviterSig:o}}var ey=function(e,t){let n=e,r=ny[t],i=null,a=0,o=null,s=[],c={},l=function(e,t){a=n*4+17,i=function(e){let t=Array(e);for(let n=0;n<e;n+=1){t[n]=Array(e);for(let r=0;r<e;r+=1)t[n][r]=null}return t}(a),u(0,0),u(a-7,0),u(0,a-7),p(),f(),h(e,t),n>=7&&m(e),o??=v(n,r,s),g(o,t)},u=function(e,t){for(let n=-1;n<=7;n+=1)if(!(e+n<=-1||a<=e+n))for(let r=-1;r<=7;r+=1)t+r<=-1||a<=t+r||(0<=n&&n<=6&&(r==0||r==6)||0<=r&&r<=6&&(n==0||n==6)||2<=n&&n<=4&&2<=r&&r<=4?i[e+n][t+r]=!0:i[e+n][t+r]=!1)},d=function(){let e=0,t=0;for(let n=0;n<8;n+=1){l(!0,n);let r=iy.getLostPoint(c);(n==0||e>r)&&(e=r,t=n)}return t},f=function(){for(let e=8;e<a-8;e+=1)i[e][6]??(i[e][6]=e%2==0);for(let e=8;e<a-8;e+=1)i[6][e]??(i[6][e]=e%2==0)},p=function(){let e=iy.getPatternPosition(n);for(let t=0;t<e.length;t+=1)for(let n=0;n<e.length;n+=1){let r=e[t],a=e[n];if(i[r][a]==null)for(let e=-2;e<=2;e+=1)for(let t=-2;t<=2;t+=1)e==-2||e==2||t==-2||t==2||e==0&&t==0?i[r+e][a+t]=!0:i[r+e][a+t]=!1}},m=function(e){let t=iy.getBCHTypeNumber(n);for(let n=0;n<18;n+=1){let r=!e&&(t>>n&1)==1;i[Math.floor(n/3)][n%3+a-8-3]=r}for(let n=0;n<18;n+=1){let r=!e&&(t>>n&1)==1;i[n%3+a-8-3][Math.floor(n/3)]=r}},h=function(e,t){let n=r<<3|t,o=iy.getBCHTypeInfo(n);for(let t=0;t<15;t+=1){let n=!e&&(o>>t&1)==1;t<6?i[t][8]=n:t<8?i[t+1][8]=n:i[a-15+t][8]=n}for(let t=0;t<15;t+=1){let n=!e&&(o>>t&1)==1;t<8?i[8][a-t-1]=n:t<9?i[8][15-t-1+1]=n:i[8][15-t-1]=n}i[a-8][8]=!e},g=function(e,t){let n=-1,r=a-1,o=7,s=0,c=iy.getMaskFunction(t);for(let t=a-1;t>0;t-=2)for(t==6&&--t;;){for(let n=0;n<2;n+=1)if(i[r][t-n]==null){let a=!1;s<e.length&&(a=(e[s]>>>o&1)==1),c(r,t-n)&&(a=!a),i[r][t-n]=a,--o,o==-1&&(s+=1,o=7)}if(r+=n,r<0||a<=r){r-=n,n=-n;break}}},_=function(e,t){let n=0,r=0,i=0,a=Array(t.length),o=Array(t.length);for(let s=0;s<t.length;s+=1){let c=t[s].dataCount,l=t[s].totalCount-c;r=Math.max(r,c),i=Math.max(i,l),a[s]=Array(c);for(let t=0;t<a[s].length;t+=1)a[s][t]=255&e.getBuffer()[t+n];n+=c;let u=iy.getErrorCorrectPolynomial(l),d=oy(a[s],u.getLength()-1).mod(u);o[s]=Array(u.getLength()-1);for(let e=0;e<o[s].length;e+=1){let t=e+d.getLength()-o[s].length;o[s][e]=t>=0?d.getAt(t):0}}let s=0;for(let e=0;e<t.length;e+=1)s+=t[e].totalCount;let c=Array(s),l=0;for(let e=0;e<r;e+=1)for(let n=0;n<t.length;n+=1)e<a[n].length&&(c[l]=a[n][e],l+=1);for(let e=0;e<i;e+=1)for(let n=0;n<t.length;n+=1)e<o[n].length&&(c[l]=o[n][e],l+=1);return c},v=function(e,t,n){let r=sy.getRSBlocks(e,t),i=cy();for(let t=0;t<n.length;t+=1){let r=n[t];i.put(r.getMode(),4),i.put(r.getLength(),iy.getLengthInBits(r.getMode(),e)),r.write(i)}let a=0;for(let e=0;e<r.length;e+=1)a+=r[e].dataCount;if(i.getLengthInBits()>a*8)throw`code length overflow. (`+i.getLengthInBits()+`>`+a*8+`)`;for(i.getLengthInBits()+4<=a*8&&i.put(0,4);i.getLengthInBits()%8!=0;)i.putBit(!1);for(;!(i.getLengthInBits()>=a*8||(i.put(236,8),i.getLengthInBits()>=a*8));)i.put(17,8);return _(i,r)};c.addData=function(e,t){t||=`Byte`;let n=null;switch(t){case`Numeric`:n=ly(e);break;case`Alphanumeric`:n=uy(e);break;case`Byte`:n=dy(e);break;case`Kanji`:n=fy(e);break;default:throw`mode:`+t}s.push(n),o=null},c.isDark=function(e,t){if(e<0||a<=e||t<0||a<=t)throw e+`,`+t;return i[e][t]},c.getModuleCount=function(){return a},c.make=function(){if(n<1){let e=1;for(;e<40;e++){let t=sy.getRSBlocks(e,r),n=cy();for(let t=0;t<s.length;t++){let r=s[t];n.put(r.getMode(),4),n.put(r.getLength(),iy.getLengthInBits(r.getMode(),e)),r.write(n)}let i=0;for(let e=0;e<t.length;e++)i+=t[e].dataCount;if(n.getLengthInBits()<=i*8)break}n=e}l(!1,d())},c.createTableTag=function(e,t){e||=2,t=t===void 0?e*4:t;let n=``;n+=`<table style="`,n+=` border-width: 0px; border-style: none;`,n+=` border-collapse: collapse;`,n+=` padding: 0px; margin: `+t+`px;`,n+=`">`,n+=`<tbody>`;for(let t=0;t<c.getModuleCount();t+=1){n+=`<tr>`;for(let r=0;r<c.getModuleCount();r+=1)n+=`<td style="`,n+=` border-width: 0px; border-style: none;`,n+=` border-collapse: collapse;`,n+=` padding: 0px; margin: 0px;`,n+=` width: `+e+`px;`,n+=` height: `+e+`px;`,n+=` background-color: `,n+=c.isDark(t,r)?`#000000`:`#ffffff`,n+=`;`,n+=`"/>`;n+=`</tr>`}return n+=`</tbody>`,n+=`</table>`,n},c.createSvgTag=function(e,t,n,r){let i={};typeof arguments[0]==`object`&&(i=arguments[0],e=i.cellSize,t=i.margin,n=i.alt,r=i.title),e||=2,t=t===void 0?e*4:t,n=typeof n==`string`?{text:n}:n||{},n.text=n.text||null,n.id=n.text?n.id||`qrcode-description`:null,r=typeof r==`string`?{text:r}:r||{},r.text=r.text||null,r.id=r.text?r.id||`qrcode-title`:null;let a=c.getModuleCount()*e+t*2,o,s,l,u,d=``,f;for(f=`l`+e+`,0 0,`+e+` -`+e+`,0 0,-`+e+`z `,d+=`<svg version="1.1" xmlns="http://www.w3.org/2000/svg"`,d+=i.scalable?``:` width="`+a+`px" height="`+a+`px"`,d+=` viewBox="0 0 `+a+` `+a+`" `,d+=` preserveAspectRatio="xMinYMin meet"`,d+=r.text||n.text?` role="img" aria-labelledby="`+y([r.id,n.id].join(` `).trim())+`"`:``,d+=`>`,d+=r.text?`<title id="`+y(r.id)+`">`+y(r.text)+`</title>`:``,d+=n.text?`<description id="`+y(n.id)+`">`+y(n.text)+`</description>`:``,d+=`<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>`,d+=`<path d="`,l=0;l<c.getModuleCount();l+=1)for(u=l*e+t,o=0;o<c.getModuleCount();o+=1)c.isDark(l,o)&&(s=o*e+t,d+=`M`+s+`,`+u+f);return d+=`" stroke="transparent" fill="black"/>`,d+=`</svg>`,d},c.createDataURL=function(e,t){e||=2,t=t===void 0?e*4:t;let n=c.getModuleCount()*e+t*2,r=t,i=n-t;return _y(n,n,function(t,n){if(r<=t&&t<i&&r<=n&&n<i){let i=Math.floor((t-r)/e),a=Math.floor((n-r)/e);return+!c.isDark(a,i)}else return 1})},c.createImgTag=function(e,t,n){e||=2,t=t===void 0?e*4:t;let r=c.getModuleCount()*e+t*2,i=``;return i+=`<img`,i+=` src="`,i+=c.createDataURL(e,t),i+=`"`,i+=` width="`,i+=r,i+=`"`,i+=` height="`,i+=r,i+=`"`,n&&(i+=` alt="`,i+=y(n),i+=`"`),i+=`/>`,i};let y=function(e){let t=``;for(let n=0;n<e.length;n+=1){let r=e.charAt(n);switch(r){case`<`:t+=`&lt;`;break;case`>`:t+=`&gt;`;break;case`&`:t+=`&amp;`;break;case`"`:t+=`&quot;`;break;default:t+=r;break}}return t},b=function(e){e=e===void 0?2:e;let t=c.getModuleCount()*1+e*2,n=e,r=t-e,i,a,o,s,l,u={"██":`█`,"█ ":`▀`," █":`▄`,"  ":` `},d={"██":`▀`,"█ ":`▀`," █":` `,"  ":` `},f=``;for(i=0;i<t;i+=2){for(o=Math.floor((i-n)/1),s=Math.floor((i+1-n)/1),a=0;a<t;a+=1)l=`█`,n<=a&&a<r&&n<=i&&i<r&&c.isDark(o,Math.floor((a-n)/1))&&(l=` `),n<=a&&a<r&&n<=i+1&&i+1<r&&c.isDark(s,Math.floor((a-n)/1))?l+=` `:l+=`█`,f+=e<1&&i+1>=r?d[l]:u[l];f+=`
`}return t%2&&e>0?f.substring(0,f.length-t-1)+Array(t+1).join(`▀`):f.substring(0,f.length-1)};return c.createASCII=function(e,t){if(e||=1,e<2)return b(t);--e,t=t===void 0?e*2:t;let n=c.getModuleCount()*e+t*2,r=t,i=n-t,a,o,s,l,u=Array(e+1).join(`██`),d=Array(e+1).join(`  `),f=``,p=``;for(a=0;a<n;a+=1){for(s=Math.floor((a-r)/e),p=``,o=0;o<n;o+=1)l=1,r<=o&&o<i&&r<=a&&a<i&&c.isDark(s,Math.floor((o-r)/e))&&(l=0),p+=l?u:d;for(s=0;s<e;s+=1)f+=p+`
`}return f.substring(0,f.length-1)},c.renderTo2dContext=function(e,t){t||=2;let n=c.getModuleCount();for(let r=0;r<n;r++)for(let i=0;i<n;i++)e.fillStyle=c.isDark(r,i)?`black`:`white`,e.fillRect(i*t,r*t,t,t)},c};ey.stringToBytes=function(e){let t=[];for(let n=0;n<e.length;n+=1){let r=e.charCodeAt(n);t.push(r&255)}return t},ey.createStringToBytes=function(e,t){let n=function(){let n=hy(e),r=function(){let e=n.read();if(e==-1)throw`eof`;return e},i=0,a={};for(;;){let e=n.read();if(e==-1)break;let t=r(),o=r(),s=r(),c=String.fromCharCode(e<<8|t);a[c]=o<<8|s,i+=1}if(i!=t)throw i+` != `+t;return a}();return function(e){let t=[];for(let r=0;r<e.length;r+=1){let i=e.charCodeAt(r);if(i<128)t.push(i);else{let i=n[e.charAt(r)];typeof i==`number`?(i&255)==i?t.push(i):(t.push(i>>>8),t.push(i&255)):t.push(63)}}return t}};var ty={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},ny={L:1,M:0,Q:3,H:2},ry={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},iy=function(){let e=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],t=1335,n=7973,r={},i=function(e){let t=0;for(;e!=0;)t+=1,e>>>=1;return t};return r.getBCHTypeInfo=function(e){let n=e<<10;for(;i(n)-i(t)>=0;)n^=t<<i(n)-i(t);return(e<<10|n)^21522},r.getBCHTypeNumber=function(e){let t=e<<12;for(;i(t)-i(n)>=0;)t^=n<<i(t)-i(n);return e<<12|t},r.getPatternPosition=function(t){return e[t-1]},r.getMaskFunction=function(e){switch(e){case ry.PATTERN000:return function(e,t){return(e+t)%2==0};case ry.PATTERN001:return function(e,t){return e%2==0};case ry.PATTERN010:return function(e,t){return t%3==0};case ry.PATTERN011:return function(e,t){return(e+t)%3==0};case ry.PATTERN100:return function(e,t){return(Math.floor(e/2)+Math.floor(t/3))%2==0};case ry.PATTERN101:return function(e,t){return e*t%2+e*t%3==0};case ry.PATTERN110:return function(e,t){return(e*t%2+e*t%3)%2==0};case ry.PATTERN111:return function(e,t){return(e*t%3+(e+t)%2)%2==0};default:throw`bad maskPattern:`+e}},r.getErrorCorrectPolynomial=function(e){let t=oy([1],0);for(let n=0;n<e;n+=1)t=t.multiply(oy([1,ay.gexp(n)],0));return t},r.getLengthInBits=function(e,t){if(1<=t&&t<10)switch(e){case ty.MODE_NUMBER:return 10;case ty.MODE_ALPHA_NUM:return 9;case ty.MODE_8BIT_BYTE:return 8;case ty.MODE_KANJI:return 8;default:throw`mode:`+e}else if(t<27)switch(e){case ty.MODE_NUMBER:return 12;case ty.MODE_ALPHA_NUM:return 11;case ty.MODE_8BIT_BYTE:return 16;case ty.MODE_KANJI:return 10;default:throw`mode:`+e}else if(t<41)switch(e){case ty.MODE_NUMBER:return 14;case ty.MODE_ALPHA_NUM:return 13;case ty.MODE_8BIT_BYTE:return 16;case ty.MODE_KANJI:return 12;default:throw`mode:`+e}else throw`type:`+t},r.getLostPoint=function(e){let t=e.getModuleCount(),n=0;for(let r=0;r<t;r+=1)for(let i=0;i<t;i+=1){let a=0,o=e.isDark(r,i);for(let n=-1;n<=1;n+=1)if(!(r+n<0||t<=r+n))for(let s=-1;s<=1;s+=1)i+s<0||t<=i+s||n==0&&s==0||o==e.isDark(r+n,i+s)&&(a+=1);a>5&&(n+=3+a-5)}for(let r=0;r<t-1;r+=1)for(let i=0;i<t-1;i+=1){let t=0;e.isDark(r,i)&&(t+=1),e.isDark(r+1,i)&&(t+=1),e.isDark(r,i+1)&&(t+=1),e.isDark(r+1,i+1)&&(t+=1),(t==0||t==4)&&(n+=3)}for(let r=0;r<t;r+=1)for(let i=0;i<t-6;i+=1)e.isDark(r,i)&&!e.isDark(r,i+1)&&e.isDark(r,i+2)&&e.isDark(r,i+3)&&e.isDark(r,i+4)&&!e.isDark(r,i+5)&&e.isDark(r,i+6)&&(n+=40);for(let r=0;r<t;r+=1)for(let i=0;i<t-6;i+=1)e.isDark(i,r)&&!e.isDark(i+1,r)&&e.isDark(i+2,r)&&e.isDark(i+3,r)&&e.isDark(i+4,r)&&!e.isDark(i+5,r)&&e.isDark(i+6,r)&&(n+=40);let r=0;for(let n=0;n<t;n+=1)for(let i=0;i<t;i+=1)e.isDark(i,n)&&(r+=1);let i=Math.abs(100*r/t/t-50)/5;return n+=i*10,n},r}(),ay=function(){let e=Array(256),t=Array(256);for(let t=0;t<8;t+=1)e[t]=1<<t;for(let t=8;t<256;t+=1)e[t]=e[t-4]^e[t-5]^e[t-6]^e[t-8];for(let n=0;n<255;n+=1)t[e[n]]=n;let n={};return n.glog=function(e){if(e<1)throw`glog(`+e+`)`;return t[e]},n.gexp=function(t){for(;t<0;)t+=255;for(;t>=256;)t-=255;return e[t]},n}(),oy=function(e,t){if(e.length===void 0)throw e.length+`/`+t;let n=function(){let n=0;for(;n<e.length&&e[n]==0;)n+=1;let r=Array(e.length-n+t);for(let t=0;t<e.length-n;t+=1)r[t]=e[t+n];return r}(),r={};return r.getAt=function(e){return n[e]},r.getLength=function(){return n.length},r.multiply=function(e){let t=Array(r.getLength()+e.getLength()-1);for(let n=0;n<r.getLength();n+=1)for(let i=0;i<e.getLength();i+=1)t[n+i]^=ay.gexp(ay.glog(r.getAt(n))+ay.glog(e.getAt(i)));return oy(t,0)},r.mod=function(e){if(r.getLength()-e.getLength()<0)return r;let t=ay.glog(r.getAt(0))-ay.glog(e.getAt(0)),n=Array(r.getLength());for(let e=0;e<r.getLength();e+=1)n[e]=r.getAt(e);for(let r=0;r<e.getLength();r+=1)n[r]^=ay.gexp(ay.glog(e.getAt(r))+t);return oy(n,0).mod(e)},r},sy=function(){let e=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(e,t){let n={};return n.totalCount=e,n.dataCount=t,n},n={},r=function(t,n){switch(n){case ny.L:return e[(t-1)*4+0];case ny.M:return e[(t-1)*4+1];case ny.Q:return e[(t-1)*4+2];case ny.H:return e[(t-1)*4+3];default:return}};return n.getRSBlocks=function(e,n){let i=r(e,n);if(i===void 0)throw`bad rs block @ typeNumber:`+e+`/errorCorrectionLevel:`+n;let a=i.length/3,o=[];for(let e=0;e<a;e+=1){let n=i[e*3+0],r=i[e*3+1],a=i[e*3+2];for(let e=0;e<n;e+=1)o.push(t(r,a))}return o},n}(),cy=function(){let e=[],t=0,n={};return n.getBuffer=function(){return e},n.getAt=function(t){return(e[Math.floor(t/8)]>>>7-t%8&1)==1},n.put=function(e,t){for(let r=0;r<t;r+=1)n.putBit((e>>>t-r-1&1)==1)},n.getLengthInBits=function(){return t},n.putBit=function(n){let r=Math.floor(t/8);e.length<=r&&e.push(0),n&&(e[r]|=128>>>t%8),t+=1},n},ly=function(e){let t=ty.MODE_NUMBER,n=e,r={};r.getMode=function(){return t},r.getLength=function(e){return n.length},r.write=function(e){let t=n,r=0;for(;r+2<t.length;)e.put(i(t.substring(r,r+3)),10),r+=3;r<t.length&&(t.length-r==1?e.put(i(t.substring(r,r+1)),4):t.length-r==2&&e.put(i(t.substring(r,r+2)),7))};let i=function(e){let t=0;for(let n=0;n<e.length;n+=1)t=t*10+a(e.charAt(n));return t},a=function(e){if(`0`<=e&&e<=`9`)return e.charCodeAt(0)-48;throw`illegal char :`+e};return r},uy=function(e){let t=ty.MODE_ALPHA_NUM,n=e,r={};r.getMode=function(){return t},r.getLength=function(e){return n.length},r.write=function(e){let t=n,r=0;for(;r+1<t.length;)e.put(i(t.charAt(r))*45+i(t.charAt(r+1)),11),r+=2;r<t.length&&e.put(i(t.charAt(r)),6)};let i=function(e){if(`0`<=e&&e<=`9`)return e.charCodeAt(0)-48;if(`A`<=e&&e<=`Z`)return e.charCodeAt(0)-65+10;switch(e){case` `:return 36;case`$`:return 37;case`%`:return 38;case`*`:return 39;case`+`:return 40;case`-`:return 41;case`.`:return 42;case`/`:return 43;case`:`:return 44;default:throw`illegal char :`+e}};return r},dy=function(e){let t=ty.MODE_8BIT_BYTE,n=ey.stringToBytes(e),r={};return r.getMode=function(){return t},r.getLength=function(e){return n.length},r.write=function(e){for(let t=0;t<n.length;t+=1)e.put(n[t],8)},r},fy=function(e){let t=ty.MODE_KANJI,n=ey.stringToBytes;(function(e,t){let r=n(e);if(r.length!=2||(r[0]<<8|r[1])!=t)throw`sjis not supported.`})(`友`,38726);let r=n(e),i={};return i.getMode=function(){return t},i.getLength=function(e){return~~(r.length/2)},i.write=function(e){let t=r,n=0;for(;n+1<t.length;){let r=(255&t[n])<<8|255&t[n+1];if(33088<=r&&r<=40956)r-=33088;else if(57408<=r&&r<=60351)r-=49472;else throw`illegal char at `+(n+1)+`/`+r;r=(r>>>8&255)*192+(r&255),e.put(r,13),n+=2}if(n<t.length)throw`illegal char at `+(n+1)},i},py=function(){let e=[],t={};return t.writeByte=function(t){e.push(t&255)},t.writeShort=function(e){t.writeByte(e),t.writeByte(e>>>8)},t.writeBytes=function(e,n,r){n||=0,r||=e.length;for(let i=0;i<r;i+=1)t.writeByte(e[i+n])},t.writeString=function(e){for(let n=0;n<e.length;n+=1)t.writeByte(e.charCodeAt(n))},t.toByteArray=function(){return e},t.toString=function(){let t=``;t+=`[`;for(let n=0;n<e.length;n+=1)n>0&&(t+=`,`),t+=e[n];return t+=`]`,t},t},my=function(){let e=0,t=0,n=0,r=``,i={},a=function(e){r+=String.fromCharCode(o(e&63))},o=function(e){if(e<0)throw`n:`+e;if(e<26)return 65+e;if(e<52)return 97+(e-26);if(e<62)return 48+(e-52);if(e==62)return 43;if(e==63)return 47;throw`n:`+e};return i.writeByte=function(r){for(e=e<<8|r&255,t+=8,n+=1;t>=6;)a(e>>>t-6),t-=6},i.flush=function(){if(t>0&&(a(e<<6-t),e=0,t=0),n%3!=0){let e=3-n%3;for(let t=0;t<e;t+=1)r+=`=`}},i.toString=function(){return r},i},hy=function(e){let t=e,n=0,r=0,i=0,a={};a.read=function(){for(;i<8;){if(n>=t.length){if(i==0)return-1;throw`unexpected end of file./`+i}let e=t.charAt(n);if(n+=1,e==`=`)return i=0,-1;e.match(/^\s$/)||(r=r<<6|o(e.charCodeAt(0)),i+=6)}let e=r>>>i-8&255;return i-=8,e};let o=function(e){if(65<=e&&e<=90)return e-65;if(97<=e&&e<=122)return e-97+26;if(48<=e&&e<=57)return e-48+52;if(e==43)return 62;if(e==47)return 63;throw`c:`+e};return a},gy=function(e,t){let n=e,r=t,i=Array(e*t),a={};a.setPixel=function(e,t,r){i[t*n+e]=r},a.write=function(e){e.writeString(`GIF87a`),e.writeShort(n),e.writeShort(r),e.writeByte(128),e.writeByte(0),e.writeByte(0),e.writeByte(0),e.writeByte(0),e.writeByte(0),e.writeByte(255),e.writeByte(255),e.writeByte(255),e.writeString(`,`),e.writeShort(0),e.writeShort(0),e.writeShort(n),e.writeShort(r),e.writeByte(0);let t=s(2);e.writeByte(2);let i=0;for(;t.length-i>255;)e.writeByte(255),e.writeBytes(t,i,255),i+=255;e.writeByte(t.length-i),e.writeBytes(t,i,t.length-i),e.writeByte(0),e.writeString(`;`)};let o=function(e){let t=e,n=0,r=0,i={};return i.write=function(e,i){if(e>>>i)throw`length over`;for(;n+i>=8;)t.writeByte(255&(e<<n|r)),i-=8-n,e>>>=8-n,r=0,n=0;r=e<<n|r,n+=i},i.flush=function(){n>0&&t.writeByte(r)},i},s=function(e){let t=1<<e,n=(1<<e)+1,r=e+1,a=c();for(let e=0;e<t;e+=1)a.add(String.fromCharCode(e));a.add(String.fromCharCode(t)),a.add(String.fromCharCode(n));let s=py(),l=o(s);l.write(t,r);let u=0,d=String.fromCharCode(i[u]);for(u+=1;u<i.length;){let e=String.fromCharCode(i[u]);u+=1,a.contains(d+e)?d+=e:(l.write(a.indexOf(d),r),a.size()<4095&&(a.size()==1<<r&&(r+=1),a.add(d+e)),d=e)}return l.write(a.indexOf(d),r),l.write(n,r),l.flush(),s.toByteArray()},c=function(){let e={},t=0,n={};return n.add=function(r){if(n.contains(r))throw`dup key:`+r;e[r]=t,t+=1},n.size=function(){return t},n.indexOf=function(t){return e[t]},n.contains=function(t){return e[t]!==void 0},n};return a},_y=function(e,t,n){let r=gy(e,t);for(let i=0;i<t;i+=1)for(let t=0;t<e;t+=1)r.setPixel(t,i,n(t,i));let i=py();r.write(i);let a=my(),o=i.toByteArray();for(let e=0;e<o.length;e+=1)a.writeByte(o[e]);return a.flush(),`data:image/gif;base64,`+a};ey.stringToBytes;function vy(e,t=4){let n=ey(0,`L`);return n.addData(e),n.make(),n.createSvgTag({cellSize:t,margin:2,scalable:!0})}var yy=25519;async function by(e,t){if(e.privkey)return Fe(t,H(e.privkey));if(kh(e)){let n=await Rh(e,t,{interactive:!0});if(!n||n.pubkey!==e.pubkey)throw Error(`Signet signer used a different public key.`);return n}throw Error(`No local key or Signet signer available.`)}async function xy(e,t,n){if(e.privkey)return ho(n,G(H(e.privkey),t));if(kh(e))return zh(e,t,n,{interactive:!0});throw Error(`No local key or Signet encryption available.`)}async function Sy(e,t,n){if(e.privkey)return go(n,G(H(e.privkey),t));if(kh(e))return Bh(e,t,n,{interactive:!0});throw Error(`No local key or Signet decryption available.`)}function Cy(e){return e instanceof Error?e.message:String(e)}function wy(e){let t=B(),{identity:n}=f();if(!t||!n?.pubkey)return e.onError(`No relay pool or identity available.`),()=>{};let{inviteId:r,adminPubkey:i,readRelays:a,writeRelays:o,onWelcome:s,onError:c}=e,l=Array.from(new Set([...a,...o])),u=!1,d=null,p=null;return(async()=>{try{let e=await xy(n,i,JSON.stringify({type:`join-request`,inviteId:r})),a=await by(n,{kind:yy,created_at:Math.floor(Date.now()/1e3),tags:[[`d`,r],[`p`,i]],content:e});if(u)return;Promise.allSettled(t.publish(o,a)).catch(()=>{}),d=t.subscribeMany(l,{kinds:[yy],"#d":[r],authors:[i]},{onevent(e){je(e)&&(typeof e.content==`string`&&e.content.length>65536||(async()=>{try{let t=await Sy(n,i,e.content),a=JSON.parse(t);a.type===`welcome`&&a.inviteId===r&&a.envelope&&(s(a.envelope),d?.close())}catch{}})())},oneose(){}}),p=setTimeout(()=>{d?.close(),c(`Timed out waiting for welcome message from admin.`)},12e4)}catch(e){u||c(Cy(e))}})(),()=>{u=!0,p&&clearTimeout(p),d?.close()}}function Ty(e){let t=B(),{identity:n}=f();if(!t||!n?.pubkey)return e.onError(`No relay pool or identity available.`),()=>{};let{inviteId:r,readRelays:i,writeRelays:a,onJoinRequest:o,onError:s}=e,c=Array.from(new Set([...i,...a])),l=t.subscribeMany(c,{kinds:[yy],"#d":[r],"#p":[n.pubkey]},{onevent(e){je(e)&&(typeof e.content==`string`&&e.content.length>65536||(async()=>{try{let t=await Sy(n,e.pubkey,e.content),i=JSON.parse(t);i.type===`join-request`&&i.inviteId===r&&o(e.pubkey)}catch{}})())},oneose(){}}),u=setTimeout(()=>{l.close(),s(`Timed out waiting for join request.`)},3e5);return()=>{clearTimeout(u),l.close()}}async function Ey(e){let t=B(),{identity:n}=f();if(!t||!n?.pubkey)return;let{inviteId:r,joinerPubkey:i,envelope:a,writeRelays:o}=e,s=await xy(n,i,JSON.stringify({type:`welcome`,inviteId:r,envelope:a})),c=await by(n,{kind:yy,created_at:Math.floor(Date.now()/1e3),tags:[[`d`,r],[`p`,i]],content:s});await Promise.allSettled(t.publish(o,c))}var Dy=35520;function Oy(e){let t=B(),{identity:n}=f();if(!t||!n?.pubkey)return;let{token:r,writeRelays:i}=e,a=JSON.stringify(r);(async()=>{try{let e=String(Math.floor(Date.now()/1e3)+10080*60),o=await by(n,{kind:Dy,created_at:Math.floor(Date.now()/1e3),tags:[[`d`,r.inviteId],[`expiration`,e]],content:a});Promise.allSettled(t.publish(i,o)).catch(()=>{})}catch(e){console.warn(`[canary:invite] Failed to publish invite token:`,e)}})()}function ky(e){let t=B();if(!t)return e.onError(`No relay pool available.`),()=>{};let{inviteId:n,readRelays:r,onToken:i,onError:a}=e,o=!1,s=t.subscribeMany(r,{kinds:[Dy],"#d":[n]},{onevent(e){if(je(e)&&!(typeof e.content==`string`&&e.content.length>65536)&&!o)try{let t=JSON.parse(e.content);t.inviteId===n&&(o=!0,i(t),s.close())}catch{}},oneose(){o||(s.close(),a(`Invite not found on relay — it may have expired.`))}}),c=setTimeout(()=>{o||(s.close(),a(`Timed out looking for invite on relay.`))},15e3);return()=>{clearTimeout(c),s.close()}}var Ay=e({PROFILE_RELAYS:()=>zy,fetchOwnProfile:()=>Vy,fetchPersonaProfiles:()=>Ky,fetchProfiles:()=>Ry,getCachedName:()=>Iy,getCachedProfile:()=>Ly,publishKind0:()=>Wy,publishPersonaProfile:()=>Gy});function jy(e){if(!e||typeof e!=`object`)return{};let t=e;return{...typeof t.name==`string`?{name:t.name}:{},...typeof t.display_name==`string`?{display_name:t.display_name}:{},...typeof t.picture==`string`?{picture:t.picture}:{},...typeof t.about==`string`?{about:t.about}:{},...typeof t.nip05==`string`?{nip05:t.nip05}:{},...typeof t.lud16==`string`?{lud16:t.lud16}:{},...typeof t.lud06==`string`?{lud06:t.lud06}:{},...typeof t.website==`string`?{website:t.website}:{},...typeof t.banner==`string`?{banner:t.banner}:{}}}var My=new Map,Ny=new Map,Py=6e4,Fy=new Set;function Iy(e){let t=My.get(e);if(t)return t.display_name||t.name||void 0}function Ly(e){return My.get(e)}function Ry(e,t){let n=B();if(!n){console.warn(`[profiles] no pool — skipping`);return}let r=Date.now(),i=e.filter(e=>{if(My.has(e)||Fy.has(e))return!1;let t=Ny.get(e);return!(t&&r-t<Py)});if(i.length===0){console.warn(`[profiles] all cached/pending — nothing to fetch`);return}for(let e of i)Fy.add(e);let a=Hy(t),o=[...new Set([...a,...By])];if(console.warn(`[profiles] fetching`,i.length,`profiles from`,o,`for group`,t?.slice(0,8)),o.length===0){for(let e of i)Fy.delete(e);return}let s=n.subscribeMany(o,{kinds:[0],authors:i},{onevent(e){if(je(e)&&!(typeof e.content==`string`&&e.content.length>65536))try{let n=jy(JSON.parse(e.content));console.warn(`[profiles] got profile for`,e.pubkey.slice(0,8),n.display_name||n.name||`(no name)`),My.set(e.pubkey,n),Fy.delete(e.pubkey);let r=n.display_name||n.name;if(r&&t){let n=f().groups[t];n&&n.memberNames?.[e.pubkey]!==r&&p(t,{memberNames:{...n.memberNames,[e.pubkey]:r}})}}catch{Ny.set(e.pubkey,Date.now()),Fy.delete(e.pubkey)}},oneose(){console.warn(`[profiles] EOSE — found:`,i.filter(e=>My.has(e)).length,`missing:`,i.filter(e=>!My.has(e)).length);for(let e of i)My.has(e)||Ny.set(e,Date.now()),Fy.delete(e);s.close()}})}var zy=[`wss://purplepag.es`,`wss://relay.damus.io`,`wss://nos.lol`],By=zy;async function Vy(){await Ce();let e=B(),{identity:t,settings:n}=f();if(!e||!t?.pubkey)return;let r=t.pubkey,i=My.get(r);if(i){let e=i.display_name||i.name,n=i.picture,r={};e&&t.displayName!==e&&(r.displayName=e),n&&t.picture!==n&&(r.picture=n),Object.keys(r).length>0&&u({identity:{...t,...r}});return}if(Fy.has(r))return;My.delete(r),Ny.delete(r),Fy.add(r);let a=n?.defaultRelays?.length?n.defaultRelays:[],o=[...new Set([...a,...By])];if(o.length===0){Fy.delete(r);return}console.warn(`[profiles] fetching own kind 0 from`,o);let s=e.subscribeMany(o,{kinds:[0],authors:[r]},{onevent(e){if(je(e)&&!(typeof e.content==`string`&&e.content.length>65536))try{let t=jy(JSON.parse(e.content));console.warn(`[profiles] got own profile from relay:`,t.display_name||t.name||`(no name)`),My.set(e.pubkey,t),Fy.delete(e.pubkey);let n=t.display_name||t.name,r=t.picture,{identity:i}=f();if(i&&i.pubkey===e.pubkey){let e={};n&&i.displayName!==n&&(e.displayName=n),r&&i.picture!==r&&(e.picture=r),Object.keys(e).length>0&&u({identity:{...i,...e}})}}catch{Fy.delete(e.pubkey)}},oneose(){Fy.delete(r),s.close()}})}function Hy(e){if(e){let t=f().groups[e];if(t?.relays?.length)return t.relays}let t=f().settings;return t?.defaultRelays?.length?t.defaultRelays:[]}function Uy(e){let t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function Wy(e,t){setTimeout(async()=>{try{let n=B();if(!n){console.warn(`[profiles] no pool — skipping kind 0 publish`);return}await Ce();let r=JSON.stringify({name:e}),a=Fe({kind:0,created_at:Math.floor(Date.now()/1e3),tags:[],content:r},Uy(t)),{settings:o}=f(),s=o?.defaultWriteRelays?.length?o.defaultWriteRelays:o?.defaultRelays?.length?o.defaultRelays:[],c=i([...zy,...s]);console.warn(`[profiles] publishing kind 0 to`,c);let l=n.publish(c,a),u=(await Promise.allSettled(l)).filter(e=>e.status===`fulfilled`).length;console.warn(`[profiles] kind 0 published to ${u}/${c.length} relay(s)`)}catch(e){console.warn(`[profiles] kind 0 publish failed:`,e)}},2e3)}async function Gy(e,t){let{settings:n}=f(),r=t&&t.length>0?t:e.writeRelays&&e.writeRelays.length>0?e.writeRelays:n?.defaultWriteRelays?.length?n.defaultWriteRelays:[];if(r.length!==0)try{let t=ae(e.name,e.index),n=JSON.stringify({name:e.displayName??e.name,about:e.about??``,picture:e.picture??``}),i=Fe({kind:0,created_at:Math.floor(Date.now()/1e3),tags:[],content:n},t.identity.privateKey),a=new Ae;try{let t=a.publish(r,i),n=(await Promise.allSettled(t)).filter(e=>e.status===`fulfilled`).length;console.warn(`[profiles] persona "${e.name}" kind 0 published to ${n}/${r.length} relay(s)`)}finally{a.close(r)}}catch(t){console.warn(`[profiles] persona "${e.name}" kind 0 publish failed:`,t)}}async function Ky(e){let{settings:t}=f(),n=e&&e.length>0?e:t?.defaultReadRelays?.length?t.defaultReadRelays:[];if(n.length!==0)try{let{personas:e}=f(),t=Object.values(e);if(t.length===0)return;let r=new Map;for(let e of t)try{let t=Ds(e.npub);t.type===`npub`&&r.set(t.data,e.id)}catch{}if(r.size===0)return;let i=Array.from(r.keys());await new Promise(e=>{let t=new Ae,a=t.subscribeMany(n,[{kinds:[0],authors:i}],{onevent(e){if(!je(e)||typeof e.content==`string`&&e.content.length>65536)return;let t=r.get(e.pubkey);if(t)try{let n=jy(JSON.parse(e.content)),{personas:r}=f(),i=r[t];if(!i)return;let a={...i,...n.display_name||n.name?{displayName:n.display_name||n.name}:{},...n.picture?{picture:n.picture}:{},...n.about===void 0?{}:{about:n.about}};u({personas:{...r,[t]:a}})}catch{}},oneose(){a.close(),t.close(n),e()}})})}catch(e){console.warn(`[profiles] fetchPersonaProfiles failed:`,e)}}var qy=e({renderMembers:()=>tb,showConfirmMemberModal:()=>rb,showInviteModal:()=>Qy,showShareStateModal:()=>$y}),Jy=[210,140,30,280,60,330,170,0];function Yy(e,t){let n=t.indexOf(e);return Jy[(n>=0?n:0)%Jy.length]}function Xy(e,t,n,r){let i=Yy(e,t),a=n[e]??0;if(a===0)return`hsl(${i}, 55%, 55%)`;let o=Math.floor(Date.now()/1e3)-a;return o<=r?`hsl(${i}, 70%, 55%)`:o<=r*1.25?`hsl(${i}, 40%, 50%)`:`#94a3b8`}function Zy(e,t,n){let{identity:r,groups:i}=f(),a=r?.pubkey===e,o;if(n){let t=i[n]?.memberNames?.[e];t&&t!==`You`&&(o=t)}return o||=Iy(e),a?o?`${o} (you)`:`You`:o||`${e.slice(0,8)}\u2026${e.slice(-4)}`}function Qy(e,t){let n=t?.title??`Invite to Group`,i=t?.scanHint??`Scan with your phone camera to join`;t?.showConfirmMemberNote,r(e);let a=document.getElementById(`invite-modal`);a||(a=document.createElement(`dialog`),a.id=`invite-modal`,a.className=`modal`,document.body.appendChild(a),a.addEventListener(`click`,e=>{e.target===a&&(Hv(),a.close())}));let o=a;function s(){o.innerHTML=`
      <div class="modal__form invite-share">
        <h2 class="modal__title">${V(n)}</h2>
        <p class="invite-hint">How are you sharing this?</p>

        <div class="invite-share__actions" style="flex-direction: column; gap: 0.75rem;">
          <button class="btn btn--primary" id="invite-qr-path" type="button">Scan QR &mdash; they're with me</button>
          <button class="btn btn--primary" id="invite-link-path" type="button">Secure Channel &mdash; Signal, WhatsApp, etc.</button>
        </div>

        <div class="modal__actions">
          <button class="btn" id="invite-close-btn" type="button">Cancel</button>
        </div>
      </div>
    `,o.querySelector(`#invite-qr-path`)?.addEventListener(`click`,u),o.querySelector(`#invite-link-path`)?.addEventListener(`click`,d),o.querySelector(`#invite-close-btn`)?.addEventListener(`click`,()=>{Hv(),o.close()})}function c(t){o.innerHTML=`
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
    `,o.querySelector(`#remote-back-2`)?.addEventListener(`click`,t),o.querySelector(`#remote-next-2`)?.addEventListener(`click`,async()=>{let t=o.querySelector(`#remote-joincode-input`),n=o.querySelector(`#remote-joincode-error`),r=o.querySelector(`#remote-next-2`),i=t?.value.trim()??``;if(!/^[0-9a-f]{64}$/.test(i)){n&&(n.textContent=`Invalid join code — must be a 64-character hex public key.`,n.style.display=``);return}try{r&&(r.disabled=!0,r.textContent=`Generating...`);let t=f().groups[e.id];if(!t)throw Error(`Group not found.`);l(await Vv(t,i),i)}catch(e){n&&(n.textContent=e instanceof Error?e.message:`Failed to create welcome envelope.`,n.style.display=``),r&&(r.disabled=!1,r.textContent=`Generate Welcome`)}})}function l(t,n){o.innerHTML=`
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
    `,o.querySelector(`#remote-copy-welcome`)?.addEventListener(`click`,async e=>{let n=e.currentTarget;try{await navigator.clipboard.writeText(t),n.textContent=`Copied!`,n.classList.add(`btn--copied`),setTimeout(()=>{n.textContent=`Copy Welcome Message`,n.classList.remove(`btn--copied`)},2e3)}catch{}}),o.querySelector(`#remote-done`)?.addEventListener(`click`,()=>{try{let t=f().groups[e.id];if(t&&!t.members.includes(n)){let t=o.querySelector(`#remote-joiner-name`)?.value.trim()??``;a_(e.id,n,t),Y(t?`${t} added to group`:`Member added to group`,`success`)}}catch(e){Y(e instanceof Error?e.message:`Failed to add member`,`error`)}Hv(),o.close()})}async function u(){let t,r,a;try{let n=await kv(e);t=n.payload,r=n.confirmCode,a=Qv(t)}catch(e){Y(e instanceof Error?e.message:`Failed to create invite.`,`error`);return}let c=`${window.location.href.split(`#`)[0]}#inv/${K_(a)}`,l=vy(c);o.innerHTML=`
      <div class="modal__form invite-share">
        <h2 class="modal__title">${V(n)}</h2>

        <div class="qr-container" data-url="${V(c)}">${l}</div>
        <p class="invite-hint">${V(i)}</p>
        <p class="invite-hint" style="color: var(--duress); font-weight: 500;">Contains the group key &mdash; only share in person.</p>

        <div style="margin: 1rem 0; padding: 0.75rem; border-radius: 0.5rem; background: var(--surface-alt, rgba(255,255,255,0.05));">
          <p class="invite-hint" style="font-weight: 600; margin-bottom: 0.25rem;">Read these words aloud:</p>
          <p style="font-size: 1.25rem; font-weight: 700; letter-spacing: 0.05em; text-align: center;">${V(r)}</p>
        </div>

        <div class="modal__actions" style="gap: 0.5rem;">
          <button class="btn" id="invite-back-btn" type="button">Back</button>
          <button class="btn" id="invite-done-btn" type="button">Done</button>
        </div>
      </div>
    `,o.querySelector(`#invite-back-btn`)?.addEventListener(`click`,()=>{s()}),o.querySelector(`#invite-done-btn`)?.addEventListener(`click`,()=>{o.close()})}async function d(){let t;try{t=await Bv(e)}catch(e){Y(e instanceof Error?e.message:`Failed to create remote invite.`,`error`);return}let n=`${window.location.href.split(`#`)[0]}#j/${t.inviteId}`,r=e.readRelays?.length?e.readRelays:f().settings.defaultReadRelays,i=e.writeRelays?.length?e.writeRelays:f().settings.defaultWriteRelays;ng(r,i).then(()=>{Oy({token:G_(t.tokenPayload),writeRelays:i})});let a=()=>{};o.innerHTML=`
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
    `,o.querySelector(`#remote-copy-link`)?.addEventListener(`click`,async e=>{let t=e.currentTarget;try{await navigator.clipboard.writeText(n),t.textContent=`Copied!`,t.classList.add(`btn--copied`),setTimeout(()=>{t.textContent=`Copy Link`,t.classList.remove(`btn--copied`)},2e3)}catch{}}),ng(r,i).then(()=>{a=Ty({inviteId:t.inviteId,readRelays:r,writeRelays:i,async onJoinRequest(n){a();try{let r=f().groups[e.id];if(!r)return;let a=await Vv(r,n);await Ey({inviteId:t.inviteId,joinerPubkey:n,envelope:a,writeRelays:i}),r.members.includes(n)||a_(e.id,n),Hv(),o.close(),Y(`Member joined via relay`,`success`)}catch(e){Y(e instanceof Error?e.message:`Failed to send welcome`,`error`)}},onError(e){let t=o.querySelector(`#remote-relay-status`);t&&(t.textContent=e||`Relay unavailable — use manual fallback below.`)}})}),o.querySelector(`#remote-manual-fallback`)?.addEventListener(`click`,()=>{a(),c(()=>{a=()=>{},d()})}),o.querySelector(`#remote-back-btn`)?.addEventListener(`click`,()=>{a(),Hv(),s()})}s(),a.showModal()}function $y(e){Qy(e,{title:`Share Group State`,scanHint:`Share with existing members to sync the latest group state.`,showConfirmMemberNote:!1})}function eb(e,t){let{identity:n,groups:r}=f(),i=r[t],a=n?.pubkey===e,o=i?.admins.includes(e)??!1,s=Zy(e,i?.members??[],t),c=Ly(e),l=i?.memberNames?.[e],u=i?.livenessCheckins?.[e],d=`Never checked in`;if(u){let e=Math.floor(Date.now()/1e3)-u;d=e<60?`Active now`:e<3600?`${Math.floor(e/60)}m ago`:`${Math.floor(e/3600)}h ago`}let p=[a?`<span class="member-detail__badge">You</span>`:``,o?`<span class="member-detail__badge member-detail__badge--admin">Admin</span>`:``].filter(Boolean).join(` `),m=c?.display_name||c?.name,h=(e,t)=>`<div class="member-detail__row"><span class="member-detail__label">${e}</span><span class="member-detail__value">${V(t)}</span></div>`,g=[h(`Pubkey`,`${e.slice(0,16)}…${e.slice(-8)}`)];m&&g.push(h(`Nostr name`,m)),c?.nip05&&g.push(h(`NIP-05`,c.nip05)),c?.about&&g.push(h(`About`,c.about.length>80?c.about.slice(0,80)+`…`:c.about)),c?.lud16&&g.push(h(`Lightning`,c.lud16)),c?.website&&g.push(h(`Website`,c.website)),l&&l!==`You`&&l!==m&&g.push(h(`Display name`,l)),g.push(h(`Liveness`,d)),c||g.push(`<div class="member-detail__row"><span class="member-detail__label" style="color: var(--text-muted); font-style: italic;">No Nostr profile found on relay</span></div>`),Rg(`
    <div class="member-detail__header">
      ${c?.picture?`<img class="member-detail__avatar" src="${V(c.picture)}" alt="" />`:``}
      <div>
        <h2 class="modal__title" style="margin:0;">${V(s)} ${p}</h2>
      </div>
    </div>
    <div class="member-detail__rows">${g.join(``)}</div>
    <div class="modal__actions">
      <button class="btn btn--sm" id="member-detail-copy" type="button">Copy Pubkey</button>
      <button class="btn" id="modal-cancel-btn" type="button">Close</button>
    </div>
  `,()=>{}),requestAnimationFrame(()=>{document.getElementById(`member-detail-copy`)?.addEventListener(`click`,async()=>{try{await navigator.clipboard.writeText(e);let t=document.getElementById(`member-detail-copy`);t.textContent=`Copied!`,setTimeout(()=>{t.textContent=`Copy Pubkey`},1500)}catch{}}),document.getElementById(`modal-cancel-btn`)?.addEventListener(`click`,()=>{document.getElementById(`app-modal`)?.close()})})}function tb(e){let{groups:t,activeGroupId:n}=f();if(!n){e.innerHTML=``;return}let r=t[n];if(!r){e.innerHTML=``;return}let{identity:i}=f(),a=!!i?.pubkey&&r.admins.includes(i.pubkey);Ry(r.members,n),e.innerHTML=`
    <section class="panel members-panel">
      <h2 class="panel__title">Members</h2>
      <ul class="member-list">
        ${r.members.length>0?r.members.map(e=>{let t=Xy(e,r.members,r.livenessCheckins??{},r.livenessInterval),i=Ly(e),o=i?.picture?`<img src="${V(i.picture)}" alt="" style="width:24px;height:24px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid ${t};box-shadow:0 0 6px ${t}80;" />`:`<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${t};flex-shrink:0;box-shadow:0 0 6px ${t}80;"></span>`;return`
          <li class="member-item" data-pubkey="${V(e)}">
            ${o}
            <button class="member-item__name-btn" data-pubkey="${V(e)}" type="button">${V(Zy(e,r.members,n))}</button>
            ${a?`<button
              class="btn btn--sm member-item__remove"
              data-pubkey="${V(e)}"
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
  `,e.querySelectorAll(`.member-item__name-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.pubkey;t&&eb(t,n)})}),e.querySelector(`.member-list`)?.addEventListener(`click`,e=>{let t=e.target.closest(`.member-item__remove`);if(!t)return;let r=t.dataset.pubkey;if(!r)return;let{groups:i}=f(),a=i[n]?.members??[];if(!confirm(`Remove ${Zy(r,a,n)} from the group?\n\nThis rotates the group secret immediately. Remaining members must re-join using a fresh invite.`))return;let{activeGroupId:o}=f();if(!o)return;o_(o,r);let{groups:s}=f(),c=s[o];c&&c.members.length>0&&$y(c)}),e.querySelector(`#invite-btn`)?.addEventListener(`click`,()=>{let{groups:e,activeGroupId:t}=f();if(!t)return;let n=e[t];n&&Qy(n)}),e.querySelector(`#share-state-btn`)?.addEventListener(`click`,()=>{let{groups:e,activeGroupId:t}=f();if(!t)return;let n=e[t];n&&$y(n)}),e.querySelector(`#confirm-member-btn`)?.addEventListener(`click`,()=>{rb()})}function nb(e,t,n){let{groups:r,identity:i}=f(),a=r[e];if(!a||!i?.pubkey||!a.admins.includes(i.pubkey))return!1;a.members.includes(t)||a_(e,t,n);let o=f().groups[e];return o&&n&&p(e,{memberNames:{...o.memberNames,[t]:n}}),!0}function rb(e){let{groups:t,activeGroupId:n}=f();n&&t[n]&&(Rg(`
    <h2 class="modal__title">Confirm Member</h2>

    <label class="input-label">Acknowledgement link or token
      <textarea name="ackToken" class="input" rows="2" placeholder="Paste #ack/... link or token">${V(e??``)}</textarea>
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
  `,e=>{try{let t=e.get(`ackToken`)?.trim(),n=e.get(`word`)?.trim().toLowerCase(),r=e.get(`memberName`)?.trim(),{activeGroupId:i}=f();if(!i)throw Error(`No active group.`);let{groups:a}=f(),o=a[i];if(!o)throw Error(`Group not found.`);if(t){let e=Fv(t.includes(`#ack/`)?decodeURIComponent(t.split(`#ack/`)[1]):t,{groupId:i,groupSeed:o.seed,counter:o.counter+(o.usageOffset??0),context:`canary:group`,encoding:f_(o),tolerance:o.tolerance??1});if(!e.valid)throw Error(e.error??`Invalid join token.`);if(!nb(i,e.pubkey,e.displayName||r||``))throw Error(`Member could not be added — they may already be in the group or you are not an admin.`);Y(`${e.displayName||`Member`} has joined the group`,`success`)}else if(n){if(!r)throw Error(`Please enter the member name.`);let e=o.counter+(o.usageOffset??0);if(n!==Di(o.seed,`canary:group`,e,f_(o)).toLowerCase())throw Error(`Word does not match — the member may not have the current group key.`);let t=new Uint8Array(32);if(crypto.getRandomValues(t),!nb(i,Array.from(t,e=>e.toString(16).padStart(2,`0`)).join(``),r))throw Error(`Member could not be added — you may not be an admin of this group.`);Y(`${r} has joined the group`,`success`)}else throw Error(`Provide either an ack token or a verification word.`)}catch(e){throw alert(e instanceof Error?e.message:`Confirmation failed.`),e}}),requestAnimationFrame(()=>{document.getElementById(`modal-cancel-btn`)?.addEventListener(`click`,()=>{document.getElementById(`app-modal`)?.close()})}))}var ib=`0123456789bcdefghjkmnpqrstuvwxyz`,ab=Object.create(null);for(let e=0;e<32;e++)ab[ib[e]]=e;function ob(e){for(let t of e)if(!(t in ab))throw TypeError(`Invalid geohash character: '${t}' in "${e}"`)}function sb(e,t,n=5){if(!Number.isFinite(e)||e<-90||e>90)throw RangeError(`Invalid latitude: ${e}`);if(!Number.isFinite(t)||t<-180||t>180)throw RangeError(`Invalid longitude: ${t}`);if(!Number.isFinite(n)||(n=Math.round(n),n<1))throw RangeError(`Invalid precision: ${n}`);n=Math.min(12,n);let r=-90,i=90,a=-180,o=180,s=``,c=0,l=0,u=!0;for(;s.length<n;){if(u){let e=(a+o)/2;t>=e?(l|=1<<4-c,a=e):o=e}else{let t=(r+i)/2;e>=t?(l|=1<<4-c,r=t):i=t}u=!u,c++,c===5&&(s+=ib[l],c=0,l=0)}return s}function cb(e){if(e.length===0)throw TypeError(`Cannot decode an empty geohash`);let t=lb(e);return{lat:(t.minLat+t.maxLat)/2,lon:(t.minLon+t.maxLon)/2,error:{lat:(t.maxLat-t.minLat)/2,lon:(t.maxLon-t.minLon)/2}}}function lb(e){ob(e);let t=-90,n=90,r=-180,i=180,a=!0;for(let o of e){let e=ab[o];for(let o=4;o>=0;o--){if(a){let t=(r+i)/2;e>>o&1?r=t:i=t}else{let r=(t+n)/2;e>>o&1?t=r:n=r}a=!a}}return{minLat:t,maxLat:n,minLon:r,maxLon:i}}var ub=[0,25e5,63e4,78e3,2e4,2400,610,76,19,2.4];function db(e){if(!Number.isFinite(e))throw RangeError(`Invalid precision: ${e}`);return ub[Math.max(1,Math.min(9,Math.round(e)))]}var Z=null,fb=null,pb={},Q={},mb={},hb=null,gb=new Set,_b=!1,vb=null,yb=[{label:`City`,value:4,hint:`~20 km`},{label:`Neighbourhood`,value:5,hint:`~2.4 km`},{label:`Street`,value:6,hint:`~610 m`},{label:`Exact`,value:9,hint:`~2 m`}],bb=6371e3;function xb(e,t,n,r=48){let i=[];for(let a=0;a<=r;a++){let o=a/r*2*Math.PI,s=n/bb*Math.cos(o)*(180/Math.PI),c=n/(bb*Math.cos(e*Math.PI/180))*Math.sin(o)*(180/Math.PI);i.push([t+c,e+s])}return i}var Sb=[210,140,30,280,60,330,170,0];function Cb(e){let{groups:t,activeGroupId:n}=f(),r=((n?t[n]:null)?.members??[]).indexOf(e);return Sb[(r>=0?r:0)%Sb.length]}function wb(e){if(gb.has(e))return`#f87171`;let{groups:t,activeGroupId:n}=f(),r=n?t[n]:null;if(!r)return`hsl(${Cb(e)}, 70%, 55%)`;let i=r.livenessCheckins[e]??0;if(i===0)return`hsl(${Cb(e)}, 20%, 50%)`;let a=Math.floor(Date.now()/1e3)-i,o=r.livenessInterval;return a<=o?`hsl(${Cb(e)}, 70%, 55%)`:a<=o*1.25?`hsl(${Cb(e)}, 40%, 50%)`:`#94a3b8`}function Tb(){return{type:`FeatureCollection`,features:Object.entries(Q).map(([e,t])=>({type:`Feature`,properties:{pubkey:e,duress:gb.has(e),colour:wb(e)},geometry:{type:`Polygon`,coordinates:[xb(t.lat,t.lon,db(t.precision))]}}))}}var Eb=`5.19.0`,Db=`https://unpkg.com/maplibre-gl@${Eb}/dist/maplibre-gl.js`,Ob=`https://unpkg.com/maplibre-gl@${Eb}/dist/maplibre-gl.css`,kb=`sha384-pEfbADcwebVj4NNOvWFLUkm+FiGTICE5bChpV647czG7OpSqcHNgxM8QawfAkbRO`,Ab=`sha384-MGCxhspF/+ufueUgol3FDkiAYQbpSNRhBT0VWHJt64U8qIy9qlnXWx8LAbj6niPH`;async function jb(){if(fb)return fb;try{let[e]=await Promise.all([X(()=>import(`./maplibre-gl-M8MIwJma.js`).then(e=>t(e.default,1)),__vite__mapDeps([0,1]),import.meta.url),X(()=>Promise.resolve({}),__vite__mapDeps([2]),import.meta.url)]);return fb=e,e}catch{}let e=document.createElement(`link`);return e.rel=`stylesheet`,e.href=Ob,e.integrity=Ab,e.crossOrigin=`anonymous`,document.head.appendChild(e),await new Promise((e,t)=>{let n=document.createElement(`script`);n.src=Db,n.integrity=kb,n.crossOrigin=`anonymous`,n.onload=()=>e(),n.onerror=t,document.head.appendChild(n)}),fb=window.maplibregl,fb}async function Mb(e){let{groups:t,activeGroupId:n}=f();if(!n||!t[n]){Z&&(Z.remove(),Z=null,_b=!1),e.innerHTML=``;return}let r=t[n],i=r.beaconPrecision??5;if(vb!==n){Q={},mb={},gb.clear();for(let[e,t]of Object.entries(pb))t.remove(),delete pb[e];if(vb=n,r.lastPositions)for(let[e,t]of Object.entries(r.lastPositions))Q[e]=t}if(Z&&document.getElementById(`beacon-map`)){Fb();for(let[e,t]of Object.entries(Q))Rb(e,t.lat,t.lon);Vb(),Object.keys(Q).length>0&&zb();return}queueMicrotask(()=>Vb()),e.innerHTML=`
    <section class="panel beacon-panel">
      <h3 class="panel__title">Location</h3>
      <p class="settings-hint" style="margin-bottom: 0.5rem;">Approximate location of group members. Circles show the geohash area — your exact position is never shared. In an emergency, full GPS precision is used so your group can help. Circles turn <span style="color: #f87171; font-weight: 500;">red</span> when an emergency signal is active.</p>
      <div class="beacon-map" id="beacon-map" style="height: 500px; border-radius: 8px;"></div>
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-top: 0.5rem; flex-wrap: wrap;">
        <button class="btn ${hb===null?``:`btn--primary`}" id="beacon-toggle-btn" type="button">
          ${hb===null?`Share Location`:`Sharing Location`}
        </button>
        <button class="btn btn--ghost" id="beacon-fit-btn" type="button" title="Zoom to fit all group members on the map">Fit All</button>
        ${hb===null?``:`<span class="settings-hint" style="margin: 0;">Your approximate area is visible to group members</span>`}
      </div>
      <div style="margin-top: 0.75rem;">
        <span class="input-label">"I'm Alive" precision</span>
        <div class="segmented" id="beacon-precision-picker">
          ${yb.map(e=>`<button class="segmented__btn ${i===e.value?`segmented__btn--active`:``}" data-beacon-precision="${e.value}" title="${e.hint}">${e.label}</button>`).join(``)}
        </div>
        <p class="settings-hint">How precisely your location is shared in routine check-ins</p>
      </div>
      <p class="settings-hint" style="margin-top: 0.5rem; color: var(--duress);">Emergency signals always share your exact GPS so your group can find you.</p>
      <div class="beacon-list" id="beacon-list"></div>
    </section>
  `,e.querySelectorAll(`[data-beacon-precision]`).forEach(t=>{t.addEventListener(`click`,()=>{let n=Number(t.dataset.beaconPrecision),{activeGroupId:r}=f();r&&(p(r,{beaconPrecision:n}),hb!==null&&(Ib(),Lb()),e.querySelectorAll(`[data-beacon-precision]`).forEach(e=>{e.classList.toggle(`segmented__btn--active`,Number(e.dataset.beaconPrecision)===n)}))})}),e.querySelector(`#beacon-toggle-btn`)?.addEventListener(`click`,()=>{hb===null?Lb():Ib(),Mb(e)}),e.querySelector(`#beacon-fit-btn`)?.addEventListener(`click`,()=>{zb()});try{await jb(),Nb()}catch{e.querySelector(`.beacon-map`).innerHTML=`<p style="color: var(--text-muted); text-align: center; padding: 2rem;">Map unavailable offline</p>`}}function Nb(){let e=document.getElementById(`beacon-map`);if(!e||Z||!fb)return;let t=document.documentElement.dataset.theme===`light`?`https://basemaps.cartocdn.com/gl/positron-gl-style/style.json`:`https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`;Z=new fb.Map({container:e,style:t,center:[-.1278,51.5074],zoom:12}),Z.on(`load`,()=>{_b=!0,console.info(`[canary:beacon] map loaded, positions to catch up:`,Object.keys(Q).length),Z.addSource(`geohash-circles`,{type:`geojson`,data:Tb()}),Z.addLayer({id:`geohash-fill`,type:`fill`,source:`geohash-circles`,paint:{"fill-color":[`get`,`colour`],"fill-opacity":[`case`,[`get`,`duress`],.35,.2]}}),Z.addLayer({id:`geohash-stroke`,type:`line`,source:`geohash-circles`,paint:{"line-color":[`get`,`colour`],"line-width":2.5,"line-opacity":[`case`,[`get`,`duress`],.9,.6]}});for(let[e,t]of Object.entries(Q))Rb(e,t.lat,t.lon);Object.keys(Q).length>0&&zb()})}function Pb(){let{activeGroupId:e}=f();e&&p(e,{lastPositions:{...Q}})}function Fb(){if(!Z||!_b)return;let e=Z.getSource(`geohash-circles`);e&&e.setData(Tb())}function Ib(){hb!==null&&(navigator.geolocation.clearWatch(hb),hb=null);let{identity:e}=f();e?.pubkey&&(delete Q[e.pubkey],delete mb[e.pubkey],pb[e.pubkey]&&(pb[e.pubkey].remove(),delete pb[e.pubkey]),Fb(),Vb())}function Lb(){if(hb!==null||!(`geolocation`in navigator))return;let{groups:e,activeGroupId:t,identity:n}=f();if(!t||!e[t]||!n?.pubkey)return;let r=e[t],i=Kg(r.seed),a=r.beaconPrecision||5;hb=navigator.geolocation.watchPosition(async e=>{let r=sb(e.coords.latitude,e.coords.longitude,a),o=cb(r),s=o.lat,c=o.lon,l=await Yg(i,r,a);n?.pubkey&&(mb[n.pubkey]=l,Q[n.pubkey]={lat:s,lon:c,geohash:r,precision:a,timestamp:Math.floor(Date.now()/1e3)},Rb(n.pubkey,s,c),Fb(),zb(),Vb(),Pb(),t&&rg(t,{type:`beacon`,lat:s,lon:c,accuracy:db(a),timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID()}))},e=>{console.warn(`[canary:beacon] watchPosition error`,e.code,e.message)},{enableHighAccuracy:!1,maximumAge:6e4,timeout:15e3})}function Rb(e,t,n){if(!Z||!fb){console.warn(`[canary:beacon] updateMapMarker skipped — map not ready`,{map:!!Z,maplibregl:!!fb,pubkey:e.slice(0,8)});return}let r=wb(e),i=gb.has(e),a=Bb(e),o=Ly(e),s=!!o?.picture,c=i?40:32;if(pb[e]){pb[e].setLngLat([n,t]);let o=pb[e].getElement(),l=o.querySelector(`.beacon-dot`);l&&(s||(l.style.background=r),l.style.width=`${c}px`,l.style.height=`${c}px`,l.style.borderColor=r,l.style.boxShadow=`0 0 10px ${r}80`,l.style.animation=i?`beacon-pulse 1s ease-in-out infinite`:`none`);let u=o.querySelector(`.beacon-label`);u&&(u.textContent=a)}else{let l=document.createElement(`div`);l.style.display=`flex`,l.style.flexDirection=`column`,l.style.alignItems=`center`,l.style.pointerEvents=`none`;let u;s?(u=document.createElement(`img`),u.src=o.picture,u.style.objectFit=`cover`):(u=document.createElement(`div`),u.style.background=r),u.className=`beacon-dot`,u.style.width=`${c}px`,u.style.height=`${c}px`,u.style.borderRadius=`50%`,u.style.border=`3px solid ${r}`,u.style.boxShadow=`0 0 10px ${r}80`,u.style.zIndex=`2`,i&&(u.style.animation=`beacon-pulse 1s ease-in-out infinite`),l.appendChild(u);let d=document.createElement(`div`);d.className=`beacon-label`,d.textContent=a,d.style.fontSize=`11px`,d.style.fontWeight=`600`,d.style.color=`#fff`,d.style.textShadow=`0 1px 3px rgba(0,0,0,0.8)`,d.style.marginTop=`2px`,d.style.whiteSpace=`nowrap`,l.appendChild(d),pb[e]=new fb.Marker({element:l,anchor:`center`}).setLngLat([n,t]).addTo(Z)}}function zb(){if(!Z)return;let e=Object.values(Q);if(e.length===0)return;if(e.length===1){Z.flyTo({center:[e[0].lon,e[0].lat],zoom:13});return}let t=e.map(e=>e.lon),n=e.map(e=>e.lat);Z.fitBounds([[Math.min(...t),Math.min(...n)],[Math.max(...t),Math.max(...n)]],{padding:60,maxZoom:14})}function Bb(e){let{groups:t,activeGroupId:n,identity:r}=f(),i=n?t[n]:null,a=r?.pubkey===e,o,s=i?.memberNames?.[e];return s&&s!==`You`&&(o=s),o||=Iy(e),a?o?`${o} (you)`:`You`:o||`${e.slice(0,8)}\u2026`}function Vb(){let e=document.getElementById(`beacon-list`);e&&(e.innerHTML=Object.entries(Q).map(([e,t])=>{let n=wb(e),r=Bb(e),i=Ly(e),a=Math.floor(Date.now()/1e3)-t.timestamp,o=a<60?`just now`:a<3600?`${Math.floor(a/60)}m ago`:`${Math.floor(a/3600)}h ago`;return`
      <div class="beacon-entry" style="display:flex;align-items:center;gap:0.5rem;padding:0.25rem 0;">
        ${i?.picture?`<img src="${V(i.picture)}" alt="" style="width:20px;height:20px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid ${n};" />`:`<span style="width:8px;height:8px;border-radius:50%;background:${n};flex-shrink:0;"></span>`}
        <span class="beacon-member" style="font-weight:500;">${V(r)}</span>
        <span class="beacon-geohash" style="color:var(--text-muted);font-size:0.8rem;">${V(t.geohash)}</span>
        <span style="color:var(--text-muted);font-size:0.75rem;margin-left:auto;">${V(o)}</span>
      </div>
    `}).join(``)||`<p class="settings-hint">No beacons yet — enable location to start</p>`)}document.addEventListener(`canary:duress`,(e=>{let{members:t}=e.detail;if(!t?.length)return;for(let e of t)gb.add(e),Hb(e);Fb();let n=t.map(e=>Q[e]).filter(Boolean);if(Z&&n.length===1)Z.flyTo({center:[n[0].lon,n[0].lat],zoom:14});else if(Z&&n.length>1){let e=n.map(e=>e.lon),t=n.map(e=>e.lat);Z.fitBounds([[Math.min(...e),Math.min(...t)],[Math.max(...e),Math.max(...t)]],{padding:60})}}));function Hb(e){let t=pb[e];if(!t)return;let n=t.getElement();n.style.background=`#f87171`,n.style.width=`14px`,n.style.height=`14px`,n.style.boxShadow=`0 0 12px rgba(248, 113, 113, 0.6)`}function Ub(){if(console.info(`[canary:beacon] sendLocationPing called`,{hasGeo:`geolocation`in navigator,map:!!Z,mapReady:_b}),!(`geolocation`in navigator))return;let{groups:e,activeGroupId:t,identity:n}=f();if(!t||!e[t]||!n?.pubkey){console.warn(`[canary:beacon] sendLocationPing: missing state`,{activeGroupId:t,hasPubkey:!!n?.pubkey});return}if(hb!==null){console.info(`[canary:beacon] watch already active, skipping getCurrentPosition`);return}Lb();let r=e[t],i=Kg(r.seed),a=r.beaconPrecision||5;navigator.geolocation.getCurrentPosition(async e=>{let r=sb(e.coords.latitude,e.coords.longitude,a),o=cb(r),s=o.lat,c=o.lon,l=await Yg(i,r,a);n?.pubkey&&(mb[n.pubkey]=l,Q[n.pubkey]={lat:s,lon:c,geohash:r,precision:a,timestamp:Math.floor(Date.now()/1e3)},Rb(n.pubkey,s,c),Fb(),zb(),Vb(),Pb(),t&&rg(t,{type:`beacon`,lat:s,lon:c,accuracy:db(a),timestamp:Math.floor(Date.now()/1e3),opId:crypto.randomUUID()}))},e=>{console.warn(`[canary:beacon] getCurrentPosition FAILED`,e.code,e.message),X(async()=>{let{showToast:e}=await Promise.resolve().then(()=>Vh);return{showToast:e}},void 0,import.meta.url).then(({showToast:t})=>{e.code===1?t(`Location permission denied`,`error`,3e3):e.code===3?t(`Location request timed out`,`error`,3e3):t(`Could not get location`,`error`,3e3)})},{enableHighAccuracy:!1,maximumAge:3e4,timeout:1e4})}function Wb(e,t,n,r,i){let{groups:a,activeGroupId:o}=f(),s=o?a[o]:null;if(!s||!s.members.includes(e))return;let c=Gb(r),l=sb(t,n,c);Q[e]={lat:t,lon:n,geohash:l,precision:c,timestamp:i},Rb(e,t,n),Fb(),zb(),Vb(),Pb()}function Gb(e){return e<=3?9:e<=20?8:e<=80?7:e<=620?6:e<=2500?5:e<=2e4?4:e<=8e4?3:e<=63e4?2:1}function Kb(){hb!==null&&navigator.geolocation.clearWatch(hb),hb=null,_b=!1,Z&&=(Z.remove(),null),pb={},Q={},mb={},gb.clear(),vb=null}function qb(e){return new Date(e*1e3).toISOString().slice(11,19)+` UTC`}function Jb(e,t){return e<=t?`green`:e<=t*1.25?`amber`:`red`}function Yb(e,t){return e<60?qb(t):e<3600?`${Math.floor(e/60)}m ago`:e<86400?`${Math.floor(e/3600)}h ago`:`${Math.floor(e/86400)}d ago`}var Xb=[{label:`1m`,value:60},{label:`2m`,value:120},{label:`5m`,value:300},{label:`15m`,value:900},{label:`1h`,value:3600},{label:`4h`,value:14400},{label:`24h`,value:86400},{label:`7d`,value:604800}];function Zb(e){let{groups:t,activeGroupId:n,identity:r}=f();if(!n||!t[n]){e.innerHTML=``;return}let i=t[n],a=Math.floor(Date.now()/1e3),o=i.livenessInterval,s=i.members.map(e=>{let t=i.livenessCheckins[e]??0,n=t>0,s=n?a-t:1/0,c=n?Jb(s,o):`grey`,l=n?Math.max(0,Math.min(100,(1-s/o)*100)):0,u=r?.pubkey===e,d=i.memberNames?.[e];return`
      <li class="liveness-item liveness-item--${c}">
        <span class="liveness-dot liveness-dot--${c}"></span>
        <span class="liveness-name">${V(u?`You`:d??`${e.slice(0,8)}\u2026`)}</span>
        <span class="liveness-time">${n?Yb(s,t):`awaiting first check-in`}</span>
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
          ${Xb.map(e=>`<button class="segmented__btn ${o===e.value?`segmented__btn--active`:``}" data-liveness-interval="${e.value}">${e.label}</button>`).join(``)}
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
  `,e.querySelectorAll(`[data-liveness-interval]`).forEach(e=>{e.addEventListener(`click`,()=>{p(n,{livenessInterval:Number(e.dataset.livenessInterval)})})}),document.getElementById(`checkin-btn`)?.addEventListener(`click`,()=>{try{let{identity:e,activeGroupId:t,groups:n}=f();if(!e?.pubkey||!t){console.warn(`[canary:liveness] No identity or activeGroupId`,{pubkey:e?.pubkey,gid:t});return}let r=n[t];if(!r){console.warn(`[canary:liveness] Group not found`,t);return}let i=Math.floor(Date.now()/1e3),a=Ai(i,r.rotationInterval);Ji(r.seed,`canary:liveness`,e.pubkey,a),p(t,{livenessCheckins:{...r.livenessCheckins,[e.pubkey]:i}}),rg(t,{type:`liveness-checkin`,pubkey:e.pubkey,timestamp:i,opId:crypto.randomUUID()}),Promise.all([X(()=>import(`./push-BYeuOIYg.js`),[],import.meta.url),X(()=>Promise.resolve().then(()=>aa),void 0,import.meta.url)]).then(([{notifyCheckin:e},{hashGroupTag:n}])=>{e(n(t))}).catch(()=>{}),Ub(),setTimeout(()=>{document.getElementById(`beacon-container`)?.scrollIntoView({behavior:`smooth`,block:`center`})},300),Y(`Check-in sent — location updated`,`success`,2e3)}catch(e){console.error(`[canary:liveness] Check-in failed:`,e),Y(`Check-in failed`,`error`,3e3)}})}function Qb(e){if(e.startsWith(`wss://`))return!0;if(e.startsWith(`ws://`))try{let t=new URL(e);return t.hostname===`localhost`||t.hostname===`127.0.0.1`||t.hostname===`[::1]`}catch{return!1}return!1}function $b(e){return i((e??[]).filter(Qb))}function ex(e){return i([...$b(e.knownRelays),...$b(e.relays),...$b(e.readRelays),...$b(e.writeRelays)])}function tx(e,t){let n=$b(e.readRelays).includes(t),r=$b(e.writeRelays).includes(t);return n&&r?`readwrite`:n?`read`:`off`}function nx(e){return e.replace(/^wss?:\/\//,``).replace(/\/$/,``)}function rx(e){let t=ex(e);return t.length===0?`<li class="login-relay-empty">No relays configured.</li>`:t.map(t=>{let n=tx(e,t),r=n!==`off`,i=n===`read`?`read`:`readwrite`;return`
      <li class="login-relay-item" data-group-relay-row="${V(t)}">
        <button class="login-relay-toggle" data-group-relay-toggle="${V(t)}" type="button" aria-pressed="${r}">${r?`On`:`Off`}</button>
        <span class="login-relay-url" title="${V(t)}">${V(nx(t))}</span>
        <select class="input login-relay-mode" data-group-relay-mode="${V(t)}" aria-label="Relay mode for ${V(nx(t))}" ${r?``:`disabled`}>
          <option value="readwrite"${i===`readwrite`?` selected`:``}>Read/write</option>
          <option value="read"${i===`read`?` selected`:``}>Read</option>
        </select>
        <button class="btn btn--ghost btn--sm login-relay-delete" data-group-relay-delete="${V(t)}" type="button" aria-label="Delete relay">×</button>
      </li>
    `}).join(``)}var ix=!1;function ax(){let{personas:e}=f(),t=Object.values(e);return t.length===0?`<li class="relay-item"><span class="settings-hint">No personas yet</span></li>`:t.map(e=>{let t=e.npub.length>16?`${e.npub.slice(0,8)}\u2026${e.npub.slice(-4)}`:e.npub;return`
      <li class="relay-item">
        ${pg(e.name)}
        <span class="relay-url">${V(e.displayName??e.name)}</span>
        <span class="settings-hint" style="margin-left: 0.25rem;">${V(t)}</span>
        <button class="btn btn--ghost btn--sm persona-publish-btn" data-persona-id="${V(e.id)}" title="Publish profile">Publish</button>
      </li>
    `}).join(``)}function ox(e){let{groups:t,activeGroupId:n}=f();if(!n||!t[n]){e.innerHTML=``;return}let a=t[n],{identity:o}=f(),s=!!o?.pubkey&&a.admins.includes(o.pubkey);e.innerHTML=`
    <div class="settings-drawer" id="settings-drawer">
      <button class="settings-toggle" id="settings-toggle">
        <span>Group Settings</span>
        <span class="settings-chevron" style="${ix?`transform: rotate(90deg);`:``}">&#9658;</span>
      </button>

      <div class="settings-body" id="settings-body"${ix?``:` hidden`}>
        <!-- Group Name -->
        <label class="input-label">Name
          <input class="input" id="settings-name" value="${V(a.name)}">
        </label>

        <!-- Rotation Interval -->
        <div class="settings-section">
          <span class="input-label">Rotation</span>
          <div class="segmented">
            <button class="segmented__btn ${a.rotationInterval===30?`segmented__btn--active`:``}" data-interval="30">30s</button>
            <button class="segmented__btn ${a.rotationInterval===86400?`segmented__btn--active`:``}" data-interval="86400">24h</button>
            <button class="segmented__btn ${a.rotationInterval===604800?`segmented__btn--active`:``}" data-interval="604800">7d</button>
            <button class="segmented__btn ${a.rotationInterval===2592e3?`segmented__btn--active`:``}" data-interval="2592000">30d</button>
          </div>
          <p class="settings-hint">How often the verification word changes</p>
        </div>

        ${a.encodingFormat===`words`?`
        <!-- Word Count -->
        <div class="settings-section">
          <span class="input-label">Words</span>
          <div class="segmented">
            <button class="segmented__btn ${a.wordCount===1?`segmented__btn--active`:``}" data-words="1">1</button>
            <button class="segmented__btn ${a.wordCount===2?`segmented__btn--active`:``}" data-words="2">2</button>
            <button class="segmented__btn ${a.wordCount===3?`segmented__btn--active`:``}" data-words="3">3</button>
          </div>
          <p class="settings-hint">More words = stronger security</p>
        </div>
        `:``}

        <!-- Encoding Format -->
        <div class="settings-section">
          <span class="input-label">Display Format</span>
          <div class="segmented">
            <button class="segmented__btn ${a.encodingFormat===`words`?`segmented__btn--active`:``}" data-enc="words">Word</button>
            <button class="segmented__btn ${a.encodingFormat===`pin`?`segmented__btn--active`:``}" data-enc="pin">PIN</button>
            <button class="segmented__btn ${a.encodingFormat===`hex`?`segmented__btn--active`:``}" data-enc="hex">Hex</button>
          </div>
          <p class="settings-hint">Words for voice, PINs for digital input, Hex for machine-to-machine</p>
        </div>

        <!-- Tolerance Window -->
        <div class="settings-section">
          <span class="input-label">Tolerance</span>
          <div class="segmented">
            <button class="segmented__btn ${a.tolerance===0?`segmented__btn--active`:``}" data-tolerance="0">0</button>
            <button class="segmented__btn ${a.tolerance===1?`segmented__btn--active`:``}" data-tolerance="1">+/-1</button>
            <button class="segmented__btn ${a.tolerance===2?`segmented__btn--active`:``}" data-tolerance="2">+/-2</button>
            <button class="segmented__btn ${a.tolerance===3?`segmented__btn--active`:``}" data-tolerance="3">+/-3</button>
          </div>
          <p class="settings-hint">Accept words from neighbouring time windows (higher = more forgiving, less secure)</p>
        </div>

        <!-- Duress Mode -->
        <div class="settings-section">
          <span class="input-label">Emergency Alert Mode</span>
          <div class="segmented">
            <button class="segmented__btn ${a.duressMode===`immediate`||!a.duressMode?`segmented__btn--active`:``}" data-duress-mode="immediate">Immediate</button>
            <button class="segmented__btn ${a.duressMode===`dead-drop`?`segmented__btn--active`:``}" data-duress-mode="dead-drop">Dead Drop</button>
            <button class="segmented__btn ${a.duressMode===`both`?`segmented__btn--active`:``}" data-duress-mode="both">Both</button>
          </div>
          <p class="settings-hint">Immediate alerts members now. Dead drop records silently for later retrieval.</p>
        </div>

        <!-- Nostr Sync Toggle -->
        <div class="settings-section">
          <label class="toggle-label">
            <input type="checkbox" id="nostr-toggle" ${a.nostrEnabled?`checked`:``}>
            <span>Nostr Sync</span>
          </label>
          <div class="nostr-settings" id="nostr-settings"${a.nostrEnabled?``:` hidden`}>
            <!-- Identity -->
            <div class="nostr-identity" id="nostr-identity">
              <span class="settings-hint">Loading identity…</span>
            </div>

            <!-- Relay policy -->
            <div class="nostr-relays">
              <span class="input-label">Relays</span>
              <p class="settings-hint" style="margin: 0.25rem 0 0.5rem 0;">Choose which relays this group reads from and writes to.</p>
              <ul class="login-relay-list" id="group-relay-list">
                ${rx(a)}
              </ul>
              <div class="login-relay-add">
                <input
                  class="input login-relay-add__input"
                  id="group-relay-add-input"
                  type="url"
                  placeholder="wss://relay.example.com"
                >
                <button class="btn btn--ghost btn--sm" id="group-relay-add-btn">Add</button>
                <button class="btn btn--ghost btn--sm" id="group-relay-reset-btn">Reset</button>
              </div>
              <p class="settings-hint login-status-text" id="group-relay-status"></p>
            </div>

            <!-- Connection status -->
            <div class="nostr-connection-status">
              <span id="nostr-conn-status" class="settings-hint">
                ${be()?`Connected to ${Te()} relay${Te()===1?``:`s`}`:`Not connected`}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="settings-actions">
          <button class="btn btn--ghost" id="export-btn">Export Group</button>
          <button class="btn btn--ghost" id="import-btn">Import Group</button>
          ${s?`<button class="btn btn--warning" id="reseed-btn">Rotate Key</button>`:``}
          ${s?`<button class="btn btn--danger" id="compromise-reseed-btn">Compromise Reseed</button>`:``}
          <button class="btn btn--danger" id="dissolve-btn">Dissolve Group</button>
        </div>

        <!-- Personas -->
        <div class="settings-section">
          <span class="input-label">Personas</span>
          <ul class="relay-list" id="persona-list">
            ${ax()}
          </ul>
          <div class="relay-add-row" style="margin-top: 0.5rem;">
            <input class="input relay-add-input" id="persona-name-input" type="text" placeholder="New persona name">
            <button class="btn btn--ghost btn--sm" id="persona-create-btn">Create</button>
          </div>
        </div>
      </div>
    </div>
  `,document.getElementById(`settings-toggle`).addEventListener(`click`,()=>{ix=!ix;let t=document.getElementById(`settings-body`),n=e.querySelector(`.settings-chevron`);t.hidden=!ix,n.style.transform=ix?`rotate(90deg)`:``}),document.getElementById(`settings-name`).addEventListener(`change`,e=>{let t=e.target.value.trim();t&&p(n,{name:t})}),e.querySelectorAll(`[data-interval]`).forEach(e=>{e.addEventListener(`click`,()=>{p(n,{rotationInterval:Number(e.dataset.interval)})})}),e.querySelectorAll(`[data-words]`).forEach(e=>{e.addEventListener(`click`,()=>{p(n,{wordCount:Number(e.dataset.words)})})}),e.querySelectorAll(`[data-enc]`).forEach(e=>{e.addEventListener(`click`,()=>{p(n,{encodingFormat:e.dataset.enc})})}),e.querySelectorAll(`[data-tolerance]`).forEach(e=>{e.addEventListener(`click`,()=>{p(n,{tolerance:Number(e.dataset.tolerance)})})}),e.querySelectorAll(`[data-duress-mode]`).forEach(e=>{e.addEventListener(`click`,()=>{p(n,{duressMode:e.dataset.duressMode})})}),document.getElementById(`nostr-toggle`).addEventListener(`change`,e=>{let t=e.target.checked;p(n,{nostrEnabled:t});let r=document.getElementById(`nostr-settings`);if(r.hidden=!t,t){let e=f().groups[n];ng(e?.readRelays??[],e?.writeRelays??[],n).then(()=>{cx()}),sx()}else ug(),De(),Eg(!1,0),cx()});function c(){let e=f().groups[n];e?.nostrEnabled&&ng(e.readRelays??[],e.writeRelays??[],n)}function l(e,t){let r=i([e])[0]??e,a=f().groups[n];if(!a)return;let o=$b(a.readRelays).filter(e=>e!==r),s=$b(a.writeRelays).filter(e=>e!==r);(t===`read`||t===`readwrite`)&&o.push(r),t===`readwrite`&&s.push(r);let l=i(s);p(n,{knownRelays:i([...ex(a),r]),relays:l,readRelays:i(o),writeRelays:l}),c()}function d(e){let t=f().groups[n];if(!t)return;let r=ex(t).filter(t=>t!==e),i=$b(t.readRelays).filter(t=>t!==e),a=$b(t.writeRelays).filter(t=>t!==e);p(n,{knownRelays:r,relays:a,readRelays:i,writeRelays:a}),c()}function m(){let{settings:e}=f(),t=$b(e.defaultReadRelays??e.defaultRelays),r=$b(e.defaultWriteRelays??e.defaultRelays);p(n,{knownRelays:i([...$b(e.knownRelays),...t,...r]),relays:r,readRelays:t,writeRelays:r}),c()}e.querySelectorAll(`[data-group-relay-toggle]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.groupRelayToggle;if(!t)return;let r=f().groups[n];if(!r)return;let i=tx(r,t)===`off`?`readwrite`:`off`;l(t,i),Y(`${nx(t)} ${i===`off`?`disabled`:`enabled`}.`,`info`)})}),e.querySelectorAll(`[data-group-relay-mode]`).forEach(e=>{e.addEventListener(`change`,()=>{let t=e.dataset.groupRelayMode;if(!t)return;let n=e.value===`read`?`read`:`readwrite`;l(t,n),Y(`${nx(t)} set to ${n===`read`?`read only`:`read/write`}.`,`info`)})}),e.querySelectorAll(`[data-group-relay-delete]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.groupRelayDelete;t&&(d(t),Y(`${nx(t)} deleted.`,`info`))})}),document.getElementById(`group-relay-add-btn`)?.addEventListener(`click`,()=>{let e=document.getElementById(`group-relay-add-input`),t=e?.value.trim(),n=t?i([t])[0]??t:``;if(!n||!Qb(n)){e?.focus();return}l(n,`readwrite`),e&&(e.value=``),Y(`${nx(n)} added.`,`info`)}),document.getElementById(`group-relay-reset-btn`)?.addEventListener(`click`,()=>{m(),Y(`Group relays reset to defaults.`,`info`)}),document.getElementById(`group-relay-add-input`)?.addEventListener(`keydown`,e=>{e.key===`Enter`&&document.getElementById(`group-relay-add-btn`)?.click()}),a.nostrEnabled&&sx(),document.getElementById(`reseed-btn`)?.addEventListener(`click`,()=>{let{groups:e}=f(),t=e[n],i=t&&r(t)===`online`?`Rotate the group key? This broadcasts the new key to all members via the relay.`:`Rotate the group key? Remaining members will need to re-sync via Share State.`;confirm(i)&&(r_(n),Y(`Key rotated. New verification words are active.`,`warning`,6e3))}),document.getElementById(`compromise-reseed-btn`)?.addEventListener(`click`,()=>{confirm(`Compromise reseed? This generates a new key WITHOUT broadcasting. All members will need new invites.`)&&(i_(n),Y(`Emergency reseed complete. No broadcast sent — share new invites with all members.`,`warning`,8e3))}),document.getElementById(`dissolve-btn`).addEventListener(`click`,()=>{confirm(`Dissolve "${a.name}"? This cannot be undone.`)&&n_(n)}),document.getElementById(`export-btn`).addEventListener(`click`,()=>{if(!confirm(`This exports the group secret in cleartext. Treat the file like a password.`))return;let e=new Blob([JSON.stringify(a,null,2)],{type:`application/json`}),t=URL.createObjectURL(e),n=document.createElement(`a`);n.href=t,n.download=`canary-${a.name.toLowerCase().replace(/\s+/g,`-`)}.json`,n.click(),URL.revokeObjectURL(t)}),document.getElementById(`import-btn`).addEventListener(`click`,()=>{if(!confirm(`Only import files from trusted sources — the file contains the group secret.`))return;let e=document.createElement(`input`);e.type=`file`,e.accept=`.json`,e.addEventListener(`change`,async()=>{let t=e.files?.[0];if(t)try{let e=await t.text(),n=JSON.parse(e);l_(n);let r=crypto.randomUUID(),i={id:r,name:String(n.name),seed:String(n.seed),members:n.members.filter(e=>typeof e==`string`),memberNames:{},nostrEnabled:!1,relays:[],wordlist:typeof n.wordlist==`string`?n.wordlist:`en-v1`,wordCount:[1,2,3].includes(n.wordCount)?n.wordCount:2,counter:typeof n.counter==`number`&&n.counter>=0?n.counter:0,usageOffset:typeof n.usageOffset==`number`&&n.usageOffset>=0?n.usageOffset:0,rotationInterval:typeof n.rotationInterval==`number`&&n.rotationInterval>0?n.rotationInterval:86400,encodingFormat:[`words`,`pin`,`hex`].includes(n.encodingFormat)?n.encodingFormat:`words`,usedInvites:[],latestInviteIssuedAt:0,livenessInterval:typeof n.rotationInterval==`number`&&n.rotationInterval>0?n.rotationInterval:86400,livenessCheckins:{},tolerance:typeof n.tolerance==`number`&&n.tolerance>=0&&n.tolerance<=10?n.tolerance:1,beaconInterval:typeof n.beaconInterval==`number`&&n.beaconInterval>0?n.beaconInterval:60,beaconPrecision:typeof n.beaconPrecision==`number`&&n.beaconPrecision>0?n.beaconPrecision:5,duressPrecision:typeof n.duressPrecision==`number`&&n.duressPrecision>0?n.duressPrecision:9,duressMode:[`immediate`,`dead-drop`,`both`].includes(n.duressMode)?n.duressMode:`immediate`,createdAt:typeof n.createdAt==`number`?n.createdAt:Math.floor(Date.now()/1e3),admins:Array.isArray(n.admins)?n.admins.filter(e=>typeof e==`string`):[],epoch:typeof n.epoch==`number`&&n.epoch>=0?n.epoch:0,consumedOps:Array.isArray(n.consumedOps)?n.consumedOps.filter(e=>typeof e==`string`):[]},{groups:a}=f();u({groups:{...a,[r]:i},activeGroupId:r})}catch{alert(`Could not import group file. Check the file format.`)}}),e.click()}),document.getElementById(`persona-create-btn`)?.addEventListener(`click`,()=>{let e=document.getElementById(`persona-name-input`),t=e?.value.trim();if(!t){e?.focus();return}try{let n=ie(t),{personas:r}=f();u({personas:{...r,[t]:n}}),e&&(e.value=``),Y(`Persona "${t}" created`,`success`)}catch(e){Y(e instanceof Error?e.message:`Failed to create persona.`,`error`)}}),document.getElementById(`persona-name-input`)?.addEventListener(`keydown`,e=>{e.key===`Enter`&&document.getElementById(`persona-create-btn`)?.click()}),e.querySelectorAll(`.persona-publish-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.personaId;t&&(document.dispatchEvent(new CustomEvent(`canary:publish-persona-profile`,{detail:{personaId:t}})),Y(`Publishing profile for "${Object.values(f().personas).find(e=>e.id===t)?.name??t}"…`,`info`))})})}function sx(){let e=document.getElementById(`nostr-identity`);if(!e)return;let{identity:t}=f();if(!t?.pubkey){e.innerHTML=`<span class="settings-hint">No identity available.</span>`;return}let n=`${t.pubkey.slice(0,8)}…${t.pubkey.slice(-8)}`;e.innerHTML=`
    <div class="nostr-identity-row">
      <span class="input-label">Identity (Local key)</span>
      <span class="relay-url nostr-pubkey" title="${V(t.pubkey)}">${V(n)}</span>
    </div>
    <p class="settings-hint">Your identity is stored locally on this device.</p>
  `}function cx(){let e=document.getElementById(`nostr-conn-status`);if(!e)return;let t=Te();e.textContent=be()?`Connected to ${t} relay${t===1?``:`s`}`:`Not connected`}var lx=new TextEncoder;function ux(e){let t=new Uint8Array(4);return new DataView(t.buffer).setUint32(0,e,!1),t}function dx(){let e=new Uint8Array(32);return crypto.getRandomValues(e),e}var fx=Object.freeze({call:Object.freeze({wordCount:1,rotationSeconds:30,tolerance:1,directional:!0,description:`Phone verification for insurance, banking, and call centres. Single word with 30-second rotation. Deepfake-proof — cloning a voice does not help derive the current word.`}),handoff:Object.freeze({wordCount:1,rotationSeconds:0,tolerance:0,directional:!0,description:`Physical handoff verification for rideshare, delivery, and task completion. Single-use token per event. No time dependency — counter is the task/event ID.`})});function px(e){let t=e.preset?fx[e.preset]:void 0,n=e.rotationSeconds??t?.rotationSeconds??30,r=e.tolerance??t?.tolerance??0,i=t?.wordCount??1,a=e.encoding??{format:`words`,count:i};if(!e.namespace)throw Error(`namespace must be a non-empty string`);if(e.namespace.includes(`\0`))throw Error(`namespace must not contain null bytes`);if(!e.roles[0]||!e.roles[1])throw Error(`Both roles must be non-empty strings`);if(e.roles[0].includes(`\0`)||e.roles[1].includes(`\0`))throw Error(`Roles must not contain null bytes`);if(e.roles[0]===e.roles[1])throw Error(`Roles must be distinct, got ["${e.roles[0]}", "${e.roles[1]}"]`);if(e.myRole!==e.roles[0]&&e.myRole!==e.roles[1])throw Error(`myRole "${e.myRole}" is not one of the configured roles ["${e.roles[0]}", "${e.roles[1]}"]`);if(!Number.isInteger(n)||n<0)throw RangeError(`rotationSeconds must be a non-negative integer, got ${n}`);if(!Number.isInteger(r)||r<0)throw RangeError(`tolerance must be a non-negative integer, got ${r}`);if(r>10)throw RangeError(`tolerance must be <= 10, got ${r}`);if(n===0&&e.counter===void 0)throw Error(`Fixed counter mode (rotationSeconds=0) requires config.counter`);if(n===0&&e.counter!==void 0&&(!Number.isInteger(e.counter)||e.counter<0||e.counter>4294967295))throw RangeError(`counter must be an integer 0–4294967295, got ${e.counter}`);if(n>0&&e.counter!==void 0)throw Error(`counter must not be set when rotationSeconds > 0 (counter is derived from time)`);let o=typeof e.secret==`string`?H(e.secret):e.secret,s=e.roles[0]===e.myRole?e.roles[1]:e.roles[0],c=`pair:${e.namespace}:${s}`,l=n===0;function u(t){if(l){if(e.counter===void 0)throw Error(`Fixed counter mode (rotationSeconds=0) requires config.counter`);return e.counter}let r=t??Math.floor(Date.now()/1e3);return Math.floor(r/n)}return{counter:u,myToken(t){return Oi(o,e.namespace,e.roles,u(t),a)[e.myRole]},theirToken(t){return Oi(o,e.namespace,e.roles,u(t),a)[s]},verify(t,n){let i=t.toLowerCase().trim().replace(/\s+/g,` `),l=u(n),d=Math.max(0,l-r),f=Math.min(4294967295,l+r),p=!1;for(let t=d;t<=f;t++)li(i,Oi(o,e.namespace,e.roles,t,a)[s])&&(p=!0);let m=[];if(e.theirIdentity){let t=new Set,n=2*r,u=Math.max(0,l-n),p=Math.min(4294967295,l+n);for(let n=u;n<=p;n++){let r=Oi(o,e.namespace,e.roles,n,a);t.add(r[s])}for(let n=d;n<=f;n++){let r=ii(lx.encode(c+`:duress`),new Uint8Array([0]),lx.encode(e.theirIdentity),ux(n)),s=ei(o,r),l=yi(s,a),u=1;for(;t.has(l)&&u<=255;)s=ei(o,ii(r,new Uint8Array([u]))),l=yi(s,a),u++;li(i,l)&&m.push(e.theirIdentity)}}return m.length>0?{status:`duress`,identities:m}:p?{status:`valid`}:{status:`invalid`}},pair(t){return Oi(o,e.namespace,e.roles,u(t),a)}}}var mx={insurance:{label:`Insurance`,namespace:`aviva`,roles:[`caller`,`agent`],preset:`call`},pickup:{label:`Pickup`,namespace:`family`,roles:[`child`,`adult`],preset:`handoff`},rideshare:{label:`Rideshare`,namespace:`dispatch`,roles:[`requester`,`driver`],preset:`handoff`,encoding:`pin`}},hx=dx(),$=mx.insurance,gx,_x,vx=null,yx=1;function bx(){let e=$.preset===`handoff`,t=$.encoding===`pin`?{format:`pin`,digits:4}:void 0,n={secret:hx,namespace:$.namespace,roles:$.roles,preset:$.preset,...e?{counter:yx}:{},...t?{encoding:t}:{}};gx=px({...n,myRole:$.roles[0],theirIdentity:$.roles[1]}),_x=px({...n,myRole:$.roles[1],theirIdentity:$.roles[0]})}bx();function xx(e,t){let n=$.preset===`handoff`,r=fx[$.preset],i=n?yx:Math.floor((t??Math.floor(Date.now()/1e3))/r.rotationSeconds),a=`pair:${$.namespace}:${e}`,o=$.encoding===`pin`?{format:`pin`,digits:4}:{format:`words`,count:1};return Ki(hx,a,e,i,o,r.tolerance)}function Sx(){vx!==null&&(clearInterval(vx),vx=null)}function Cx(e){if(e<=0)return`0s`;let t=Math.floor(e/60),n=Math.floor(e%60);return t>0?`${t}m ${n}s`:`${n}s`}function wx(e){if(e===0)return 0;let t=Math.floor(Date.now()/1e3),n=(Math.floor(t/e)+1)*e;return Math.max(0,n-t)}function Tx(e){Sx();let t=Math.floor(Date.now()/1e3),n=$.preset===`handoff`,r=n?0:fx[$.preset].rotationSeconds,i=wx(r),a=r>0?Math.min(100,(r-i)/r*100):100,o=$.roles[0],s=$.roles[1];e.innerHTML=`
    <div class="call-sim">
      <div class="call-sim__header">
        <h2 class="call-sim__title">CANARY Call Verification Demo</h2>
        <div class="call-sim__scenarios" id="call-scenarios">
          ${Object.entries(mx).map(([e,t])=>`<button class="btn call-sim__scenario-btn${$===t?` call-sim__scenario-btn--active`:``}" data-scenario="${e}">${t.label}</button>`).join(``)}
        </div>
      </div>

      <div class="call-sim__panels">
        <div class="call-sim__panel call-sim__panel--caller">
          <h3 class="call-sim__role">${o.toUpperCase()}</h3>
          <div class="call-sim__token-group">
            <span class="call-sim__label">Your code — tap to reveal:</span>
            <div class="call-sim__token call-sim__token--reveal" id="caller-reveal" data-real="${gx.myToken(t)}" data-alt="${xx(o,t)}">••••••••</div>
          </div>
          ${n?`<span class="call-sim__countdown">Single-use</span>`:`
          <div class="call-sim__progress"><div class="call-sim__progress-bar" id="caller-progress" style="width: ${a}%"></div></div>
          <span class="call-sim__countdown" id="caller-countdown">${Cx(i)}</span>
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
            <div class="call-sim__token call-sim__token--reveal" id="agent-reveal" data-real="${_x.myToken(t)}" data-alt="${xx(s,t)}">••••••••</div>
          </div>
          ${n?`<span class="call-sim__countdown">Single-use</span>`:`
          <div class="call-sim__progress"><div class="call-sim__progress-bar" id="agent-progress" style="width: ${a}%"></div></div>
          <span class="call-sim__countdown" id="agent-countdown">${Cx(i)}</span>
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
        <span class="call-sim__meta">Namespace: <strong>${$.namespace}</strong></span>
        <span class="call-sim__meta">Rotation: <strong>${n?`single-use`:r+`s`}</strong></span>
        <span class="call-sim__meta">Encoding: <strong>${$.encoding??`words`}</strong></span>
        <span class="call-sim__meta">Tolerance: <strong>+/-${n?`0`:fx[$.preset].tolerance}</strong></span>
        <button class="btn" id="call-reset-seed">Reset seed</button>
      </div>

      <div class="call-sim__pair" id="call-pair">
        <span class="call-sim__meta">Pair: <code id="pair-display"></code></span>
      </div>
    </div>
  `,e.querySelector(`#call-scenarios`)?.addEventListener(`click`,t=>{let n=t.target.closest(`[data-scenario]`);if(!n)return;let r=n.dataset.scenario;mx[r]&&mx[r]!==$&&($=mx[r],bx(),Tx(e))}),e.querySelector(`#call-reset-seed`)?.addEventListener(`click`,()=>{hx=dx(),$.preset===`handoff`&&yx++,bx(),Tx(e)});let c=!1,l=!1,u=!1;function d(){if(!u&&c&&l){Sx();let t=e.querySelector(`#call-verified-banner`);t&&(t.hidden=!1,t.textContent=`Call Verified — both parties authenticated`),e.querySelectorAll(`.call-sim__progress, .call-sim__countdown`).forEach(e=>{e.hidden=!0})}}function f(t,n,r,i,a){let o=e.querySelector(`#${t}`),s=e.querySelector(`#${n}`),f=e.querySelector(`#${r}`);if(!o||!s||!f)return;function p(){let e=o.value.trim();if(!e)return;let t=i.verify(e);f.hidden=!1,f.className=`call-sim__result`,t.status===`valid`?(f.classList.add(`call-sim__result--valid`),f.textContent=`Verified ✓`,a===`caller`?c=!0:l=!0,d()):t.status===`duress`?(f.classList.add(`call-sim__result--invalid`),f.textContent=`Failed ✗`,u=!0):(f.classList.add(`call-sim__result--invalid`),f.textContent=`Failed ✗`)}s.addEventListener(`click`,p),o.addEventListener(`keydown`,e=>{e.key===`Enter`&&p()})}f(`caller-verify-input`,`caller-verify-btn`,`caller-result`,gx,`caller`),f(`agent-verify-input`,`agent-verify-btn`,`agent-result`,_x,`agent`);function p(t){let n=e.querySelector(`#${t}`);if(!n)return;function r(e){e.preventDefault();let t=n.getBoundingClientRect();n.textContent=e.clientX-t.left<t.width/2?n.dataset.real:n.dataset.alt}function i(){n.textContent=`••••••••`}n.addEventListener(`pointerdown`,r),n.addEventListener(`pointerup`,i),n.addEventListener(`pointerleave`,i),n.addEventListener(`pointercancel`,i)}p(`caller-reveal`),p(`agent-reveal`);let m=e.querySelector(`#pair-display`);if(m){let e=gx.pair(t);m.textContent=Object.entries(e).map(([e,t])=>`${e}: ${t}`).join(` | `)}!n&&r>0&&(vx=setInterval(()=>{let t=wx(r),n=Math.min(100,(r-t)/r*100),i=e.querySelector(`#caller-progress`),a=e.querySelector(`#agent-progress`),d=e.querySelector(`#caller-countdown`),f=e.querySelector(`#agent-countdown`),p=Math.max(0,100-n),m=p>50?`hsl(${Math.round(p/100*120)}, 70%, 45%)`:`hsl(${Math.round(p/100*120)}, 80%, 45%)`;i&&(i.style.width=`${n}%`,i.style.background=m),a&&(a.style.width=`${n}%`,a.style.background=m),d&&(d.textContent=Cx(t)),f&&(f.textContent=Cx(t));let h=Math.floor(Date.now()/1e3),g=e.querySelector(`#caller-reveal`),_=e.querySelector(`#agent-reveal`),v=gx.myToken(h),y=g&&g.dataset.real!==v;if(g&&(g.dataset.real=v,g.dataset.alt=xx(o,h)),_&&(_.dataset.real=_x.myToken(h),_.dataset.alt=xx(s,h)),y){c=!1,l=!1,u=!1;let t=e.querySelector(`#caller-result`),n=e.querySelector(`#agent-result`);t&&(t.hidden=!0,t.className=`call-sim__result`),n&&(n.hidden=!0,n.className=`call-sim__result`);let r=e.querySelector(`#caller-verify-input`),i=e.querySelector(`#agent-verify-input`);r&&(r.value=``),i&&(i.value=``);let a=e.querySelector(`#call-verified-banner`);a&&(a.hidden=!0),e.querySelectorAll(`.call-sim__progress, .call-sim__countdown`).forEach(e=>{e.hidden=!1})}let b=e.querySelector(`#pair-display`);if(b){let e=gx.pair();b.textContent=Object.entries(e).map(([e,t])=>`${e}: ${t}`).join(` | `)}t===0&&(Sx(),Tx(e))},1e3))}function Ex(){Sx()}var Dx=`
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
`;function Ox(e,t){let n=0;for(let r of Object.values(t))r.personaId===e&&n++;return n}function kx(e,t){for(let[n,r]of Object.entries(t))if(r.personaId===e)return n;return null}function Ax(e,t,n,r,i,a){if(e.archived)return``;let s=n===0?``:r?`└── `:`├── `,c=fg(e.name),l=V(e.name.slice(0,1).toUpperCase()),u=Ox(e.id,t),d=u>0?`${u} group${u===1?``:`s`}`:``,f=e.displayName&&e.displayName!==e.name?` <span class="id-tree__display-name">(${V(e.displayName)})</span>`:``,p=`<span class="id-tree__type">${V(o(e))}</span>`,m=n*1.5,h=`
    <div class="id-tree__node${e.id===a?` id-tree__node--selected`:``}" data-tree-persona-id="${V(e.id)}" style="padding-left: ${m}rem;">
      <span class="id-tree__connector">${i}${s}</span>
      <span class="id-tree__badge" style="background: ${c};">${l}</span>
      <span class="id-tree__name">${V(e.name)}</span>${f}
      ${p}
      <button class="id-tree__add-btn" data-tree-add-child="${V(e.id)}" title="Add child persona or account">+</button>
      ${d?`<span class="id-tree__groups" data-tree-groups-persona="${V(e.id)}">${d}</span>`:``}
    </div>
  `,g=Object.values(e.children).filter(e=>!e.archived),_=n===0?``:i+(r?`    `:`│   `);return h+g.map((e,r)=>{let i=r===g.length-1;return Ax(e,t,n+1,i,_,a)}).join(``)}function jx(e){let{identity:t,personas:n,groups:r}=f();if(!t)return`<div class="id-tree"></div>`;let i=`<style id="identity-tree-styles">${Dx}</style>`,a=t.displayName&&t.displayName!==`You`?V(t.displayName):`Master Identity`,o=Object.values(n).filter(e=>!e.archived);return`
    ${i}
    <div class="id-tree">
      <div class="id-tree__root">
        <span class="id-tree__root-icon">&#128273;</span>
        <span>${a}</span>
      </div>
      ${o.map((t,n)=>Ax(t,r,0,n===o.length-1,``,e)).join(``)}
    </div>
  `}function Mx(e){let t=e.querySelector(`.id-tree`);t&&(t.addEventListener(`click`,e=>{let n=e.target,r=n.closest(`[data-tree-add-child]`);if(r){e.stopPropagation();let n=r.dataset.treeAddChild;Nx(t,r,n);return}let i=n.closest(`[data-tree-groups-persona]`);if(i){e.stopPropagation();let t=i.dataset.treeGroupsPersona,{groups:n}=f(),r=kx(t,n);u(r?{view:`groups`,activeGroupId:r}:{view:`groups`});return}let a=n.closest(`[data-tree-persona-id]`);if(a){let e=a.dataset.treePersonaId;e&&document.dispatchEvent(new CustomEvent(`canary:select-persona`,{detail:{personaId:e}}))}}),t.addEventListener(`keydown`,e=>{let t=e.target;(e.key===`Enter`||e.key===` `)&&t.matches(`[data-tree-persona-id]`)&&(e.preventDefault(),t.click())}))}function Nx(e,t,n){if(e.querySelector(`.id-tree__inline-row`))return;let r=t.closest(`.id-tree__node`);if(!r)return;let i=parseFloat(r.style.paddingLeft||`0`)+1.5,a=document.createElement(`div`);a.className=`id-tree__inline-row`,a.style.paddingLeft=i+`rem`;let o=document.createElement(`input`);o.className=`id-tree__inline-input`,o.type=`text`,o.placeholder=`child name`,o.maxLength=32,o.autocomplete=`off`;let s=document.createElement(`select`);s.className=`input`,s.style.cssText=`font-size:0.75rem;padding:0.125rem 0.375rem;max-width:8rem;`,s.innerHTML=`
    <option value="account">Account</option>
    <option value="persona">Persona</option>
  `,a.appendChild(o),a.appendChild(s),r.insertAdjacentElement(`afterend`,a),o.focus();function c(){a.remove()}function l(){let e=o.value.trim().toLowerCase();if(!e||e.length===0||e.length>32||e!==e.toLowerCase()||/\s/.test(e)){c();return}try{let t=ce(n,e,s.value===`persona`?`persona`:`account`),{personas:r}=f();z(r,n)&&(u({personas:Px(r,n,t)}),document.dispatchEvent(new CustomEvent(`canary:select-persona`,{detail:{personaId:t.id}})))}catch{}c()}o.addEventListener(`keydown`,e=>{e.key===`Enter`?(e.preventDefault(),l()):e.key===`Escape`&&(e.preventDefault(),c())}),o.addEventListener(`blur`,()=>{setTimeout(c,150)})}function Px(e,t,n){let r={};for(let[i,a]of Object.entries(e))i===t?r[i]={...a,children:{...a.children,[n.id]:n}}:a.children&&Object.keys(a.children).length>0?r[i]={...a,children:Px(a.children,t,n)}:r[i]=a;return r}var Fx=!1,Ix=!1,Lx=null,Rx=!1,zx=!1,Bx=!1,Vx=null,Hx=[{name:``,index:0},{name:``,index:0},{name:``,index:0}],Ux=!1;function Wx(e){return e.length<=16?e:`${e.slice(0,8)}\u2026${e.slice(-4)}`}function Gx(e){return!(e.length===0||e.length>32||e!==e.toLowerCase()||/\s/.test(e))}function Kx(e){return c(e)===`account`?`A standalone child key you can export as an nsec account.`:`A reusable branch for related identities, profiles, and group keys.`}function qx(e){return c(e)===`account`?`account`:`persona`}function Jx(){let e=f().identity;return e?e.signerType===`nip07`?{label:`Signet managed`,detail:`Your external signer keeps the root secret private, so canary-kit cannot derive or back up the tree here.`,recoveryBacked:!1}:e.mnemonic?{label:`Mnemonic-backed root`,detail:`This root supports the full nsec-tree workflow: derived personas, derived accounts, proofs, and phrase/Shamir recovery.`,recoveryBacked:!0}:{label:`nsec-backed root`,detail:`This imported nsec can still derive the identity tree, but it has no recovery phrase. Create a new mnemonic-backed root only if you want phrase/Shamir recovery.`,recoveryBacked:!1}:{label:`No identity`,detail:`Create or restore a mnemonic-backed root to use the identity tree and recovery features.`,recoveryBacked:!1}}function Yx(e,t){let n=t.querySelector(`[data-field="displayName"]`),r=t.querySelector(`[data-field="about"]`),i=t.querySelector(`[data-field="picture"]`);return!n&&!r&&!i?!1:(n?.value??``)!==(e.displayName??``)||(r?.value??``)!==(e.about??``)||(i?.value??``)!==(e.picture??``)}function Xx(){if(!Lx)return null;let e=z(f().personas,Lx);return e?[...e.ancestors.map(e=>({name:e.name,index:e.index})),{name:e.persona.name,index:e.persona.index}]:null}function Zx(e){Hx=[{name:e[0]?.name??``,index:e[0]?.index??0},{name:e[1]?.name??``,index:e[1]?.index??0},{name:e[2]?.name??``,index:e[2]?.index??0}],Ux=!1}function Qx(e){return e.map((e,t)=>t===0?`derivePersona(${e.name}, ${e.index??0})`:`persona:${e.name}@${e.index??0}`).join(` → `)}function $x(){let e=Hx.map(e=>({name:e.name.trim(),index:e.index??0})).filter(e=>e.name.length>0);if(e.length===0)return null;try{let t=oe(e);return{path:e,npub:t.npub,nsec:t.nsec}}catch(e){return{error:e instanceof Error?e.message:`Unable to derive identity`}}}function eS(){let e=$x();return e===null?`<div class="id-derive__hint">Add at least the first level to derive an identity.</div>`:`error`in e?`<div class="id-derive__error">${V(e.error)}</div>`:`
    <div class="id-derive__result">
      <div class="id-derive__chain">Path: ${V(Qx(e.path))}</div>
      <div class="id-derive__row">
        <span class="id-derive__key">npub</span>
        <code class="id-derive__value">${V(e.npub)}</code>
      </div>
      <div class="id-derive__row">
        <span class="id-derive__key">nsec</span>
        <code class="id-derive__value id-derive__value--secret${Ux?` id-derive__value--revealed`:``}">${V(e.nsec)}</code>
      </div>
      <div class="id-derive__copy">
        <button class="btn btn--sm" id="id-derive-copy-npub">Copy npub</button>
        <button class="btn btn--sm" id="id-derive-copy-nsec">${Ux?`Copy nsec`:`Reveal + copy nsec`}</button>
      </div>
    </div>
  `}function tS(e){let t=e.querySelector(`#id-derive-feedback`);t&&(t.innerHTML=eS())}var nS=`
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
`;function rS(){let{identity:e,groups:t}=f(),n=e?.pubkey??``,r=n?`${n.slice(0,8)}\u2026${n.slice(-4)}`:`unknown`,i=Object.keys(t).length,a=Mh(e);return`
    <div class="id-nip07">
      <div class="id-nip07__card">
        <div class="id-nip07__header">
          <div class="id-nip07__icon">\u{1F511}</div>
          <div>
            <div style="font-weight: 600; font-size: 0.9375rem;">Your Identity</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${V(r)} \u00B7 ${V(a)} \u00B7 ${i} group${i===1?``:`s`}</div>
          </div>
        </div>
      </div>

      <div class="id-nip07__why">
        <h3>Why can\u2019t I manage personas?</h3>
        <p>Your external signer keeps your private key secure by never exposing it to apps. This is good security \u2014 but it means canary-kit cannot derive sub-identities from your key.</p>
        <p>Personas, Shamir backup, nsec export, and linkage proofs all require the raw private key for cryptographic derivation. Your signer only allows signing and encryption.</p>
        <p>To use persona features, create a new account with a recovery phrase or import an existing one.</p>
        <details>
          <summary>Technical detail</summary>
          <p style="margin: 0.5rem 0 0; line-height: 1.5;">nsec-tree derives child keys via <code>HMAC-SHA256(master_key, purpose)</code>. Signet signers expose <code>signEvent()</code> and <code>nip44.encrypt()</code> but not the raw key bytes. A future NIP could add <code>deriveChild(purpose, index)</code> to bridge this gap.</p>
        </details>
      </div>
    </div>
  `}function iS(){let{groups:e,personas:t}=f(),n=Object.values(e);if(n.length===0)return``;let r=new Map;for(let e of n){let t=e.personaId||`(unassigned)`,n=r.get(t)??[];n.push(e),r.set(t,n)}let i=[];for(let[e,n]of r){let r=e===`(unassigned)`,a=(r?null:z(t,e))?.persona,o=a?.archived,s=a?.name??e,c=r?`<span style="color:var(--text-muted);font-style:italic;">unassigned</span>`:`<span${o?` style="opacity:0.5;"`:``}>${V(s)}</span>`,l=n.map(e=>`<button class="persona-card__group-chip" data-navigate-group="${V(e.id)}">${V(e.name)}</button>`).join(` `);i.push(`<div style="display:flex;align-items:baseline;gap:0.5rem;margin-bottom:0.375rem;flex-wrap:wrap;">
      <span style="font-size:0.75rem;min-width:5rem;">${c}</span>${l}
    </div>`)}return`
    <div style="margin-top:0.75rem;padding-top:0.75rem;border-top:1px solid var(--border);">
      <h4 class="persona-card__section-title" style="margin-bottom:0.5rem;">Groups</h4>
      ${i.join(``)}
    </div>
  `}function aS(e){return`
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
  `}function oS(){let{identity:e,personas:t,groups:n}=f();if(!e)return``;let r=0,i=0;for(let{persona:e}of le(t))e.archived||(c(e)===`account`?i++:r++);let a=Object.keys(n).length,o=!!e.mnemonic,s=Xx(),l=Jx(),u=e.privkey?`
    <div class="id-derive">
      <div class="id-derive__header">
        <div>
          <h4 class="id-derive__title">Developer derivation example</h4>
          <p class="id-derive__sub">Enter up to three tree levels plus explicit indices and canary-kit recreates the deterministic child identity, including its <code>npub</code> and <code>nsec</code>.</p>
        </div>
        <div class="id-derive__actions">
          ${s&&s.length<=3?`<button class="btn btn--sm" id="id-derive-use-selected">Use selected persona</button>`:``}
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
                value="${V(Hx[e]?.name??``)}"
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
                  value="${String(Hx[e]?.index??0)}"
                  placeholder="0"
                  inputmode="numeric"
                />
              </label>
            </div>
          </div>
        `).join(``)}
      </div>
      <div class="id-derive__hint">
        ${s?`Selected path: <code>${V(s.map(e=>`${e.name}@${e.index??0}`).join(` / `))}</code>${s.length>3?` — this example only exposes the first three tree levels, so fill it manually if you need a deeper path.`:``}`:`Tip: select a persona in the tree, then load it here to show that the same derivation inputs recreate the same identity. Change indices to match rotated personas.`}
      </div>
      <div id="id-derive-feedback">${eS()}</div>
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
          <span>${a} group${a===1?``:`s`}</span>
          <span>\u00B7</span>
          <span>${o?`Backed up`:`No backup`}</span>
        </div>
        <div class="id-master__actions">
          ${o?`<button class="btn btn--sm" id="id-backup-btn">Backup</button>`:``}
          <button class="btn btn--sm" id="id-shamir-btn"${o?``:` disabled title="Shamir backup requires a mnemonic-backed root"`}>Shamir</button>
          <button class="btn btn--sm" id="id-verify-proof-btn">Verify proof</button>
        </div>
      </div>
      ${o?`
        <div id="id-mnemonic" class="id-master__mnemonic${Ix?` id-master__mnemonic--revealed`:``}">${V(e.mnemonic??``)}</div>
        <span class="id-master__mnemonic-hint">${Ix?`Click to hide`:`Click to reveal recovery phrase`}</span>
      `:`
        <span class="id-master__mnemonic-hint">This root can derive personas and accounts, but it cannot be recovered with a phrase or split with Shamir because no mnemonic is stored.</span>
        <div class="id-master__actions" style="margin-top:0.75rem;">
          <button class="btn btn--sm btn--primary" id="id-create-recovery-root">Create or restore mnemonic-backed root</button>
        </div>
      `}
      <div class="id-derive__hint"><strong>${V(l.label)}.</strong> ${V(l.detail)}</div>
      <div class="id-derive__hint">One root can create many unlinkable personas and exportable nsec accounts. Use proofs only when you want to prove continuity between identities.</div>
      ${aS(o)}
      ${iS()}
      ${u}
    </div>
  `}function sS(e){return e.length===0?``:`<div class="persona-card__breadcrumb">${e.map((t,n)=>{let r=n===e.length-1,i=V(t.name);return r?`<span class="persona-card__breadcrumb-current">${i}</span>`:`<span>${i}</span>`}).join(` <span class="persona-card__breadcrumb-sep">/</span> `)}</div>`}function cS(e){return`
    <div class="persona-card__section">
      <h4 class="persona-card__section-title">Profile</h4>
      <label class="persona-card__field">
        <span class="persona-card__field-label">Display name</span>
        <input class="input persona-card__input" type="text" data-field="displayName"
          value="${V(e.displayName??``)}" placeholder="Display name" />
      </label>
      <label class="persona-card__field">
        <span class="persona-card__field-label">About</span>
        <input class="input persona-card__input" type="text" data-field="about"
          value="${V(e.about??``)}" placeholder="Short bio" />
      </label>
      <label class="persona-card__field">
        <span class="persona-card__field-label">Picture URL</span>
        <input class="input persona-card__input" type="url" data-field="picture"
          value="${V(e.picture??``)}" placeholder="https://..." />
      </label>
      <button class="btn btn--sm btn--primary persona-card__publish-btn" id="id-detail-publish" hidden>
        Publish
      </button>
    </div>
  `}function lS(e){let{settings:t}=f();if(!(e.readRelays&&e.readRelays.length>0||e.writeRelays&&e.writeRelays.length>0)&&!Bx)return`
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
          value="${V(n.join(`, `))}" placeholder="wss://relay.example.com" />
      </label>
      <label class="persona-card__field">
        <span class="persona-card__field-label">Write relays</span>
        <input class="input persona-card__input" type="text" data-relay-field="write"
          value="${V(r.join(`, `))}" placeholder="wss://relay.example.com" />
      </label>
      <button class="btn btn--sm btn--primary" id="id-detail-save-relays">Save relays</button>
    </div>
  `}function uS(e){let{groups:t,personas:n}=f(),r=Object.values(t),i=r.filter(t=>t.personaId===e.id),a=r.filter(t=>t.personaId!==e.id),o=i.map(e=>`
    <span class="persona-card__group-chip-wrap">
      <button class="persona-card__group-chip" data-navigate-group="${V(e.id)}">${V(e.name)}</button>
      <button class="persona-card__group-remove" data-unassign-group="${V(e.id)}"
        title="Unassign from this persona" aria-label="Unassign ${V(e.name)}">\u00D7</button>
    </span>
  `).join(``);function s(e){if(!e.personaId)return``;for(let{persona:t}of le(n))if(t.id===e.personaId)return t.name;return``}let c=a.length>0?`<select class="input persona-card__assign-select" id="id-detail-assign" style="font-size:0.75rem;padding:0.25rem 0.375rem;">
        <option value="">+ Assign group\u2026</option>
        ${a.map(e=>{let t=s(e),n=t?` (${V(t)})`:``;return`<option value="${V(e.id)}">${V(e.name)}${n}</option>`}).join(``)}
      </select>`:``;return`
    <div class="persona-card__section">
      <h4 class="persona-card__section-title">Groups</h4>
      ${i.length>0?`<div class="persona-card__group-chips">${o}</div>`:`<span class="persona-card__meta">No groups assigned</span>`}
      ${c}
    </div>
  `}function dS(e){let t=qx(e);return`
    <div class="persona-card__actions">
      <button class="btn btn--sm" id="id-detail-export">Export nsec</button>
      <div class="persona-card__more">
        <button class="btn btn--sm persona-card__more-btn" id="id-detail-menu-btn"
          aria-label="More actions" title="More actions">\u22EF</button>
        ${Rx?`
          <div class="persona-card__menu" id="id-detail-menu-panel">
            <button class="persona-card__menu-item" id="id-detail-copy-npub">Copy npub</button>
            <button class="persona-card__menu-item" id="id-detail-show-qr">
              ${zx?`Hide QR`:`Show QR`}
            </button>
            <button class="persona-card__menu-item" id="id-detail-rotate">Rotate ${t}</button>
            <button class="persona-card__menu-item" id="id-detail-prove">Prove continuity</button>
            <button class="persona-card__menu-item persona-card__menu-item--danger" id="id-detail-archive">Archive ${t}</button>
          </div>
        `:``}
      </div>
    </div>
    ${zx?`
      <div class="persona-card__qr">
        ${vy(e.npub,3)}
        <span class="persona-card__qr-label">${V(Wx(e.npub))}</span>
      </div>
    `:``}
  `}function fS(){let{personas:e}=f(),t=[...le(e)].filter(({persona:e})=>!e.archived);if(t.length>0?Lx&&t.some(({persona:e})=>e.id===Lx)||(Lx=t[0].persona.id):Lx=null,!Lx)return`
      <div class="id-detail" id="id-detail">
        <div class="id-detail__hint">Select a persona or account from the tree above</div>
      </div>
    `;let n=z(e,Lx);if(!n)return`
      <div class="id-detail" id="id-detail">
        <div class="id-detail__hint">Select a persona or account from the tree above</div>
      </div>
    `;let{persona:r,ancestors:i}=n,a=fg(r.name),s=V(r.name.slice(0,1).toUpperCase()),c=o(r),l=Kx(r);return`
    <div class="id-detail" id="id-detail" data-detail-persona-id="${V(r.id)}">
      <div class="id-detail__header">
        <span class="persona-card__badge" style="background-color:${a}">${s}</span>
        <div>
          <div style="font-weight:600;font-size:0.9375rem;color:var(--text-primary);">${V(r.name)}</div>
          ${r.displayName?`<div style="font-size:0.8125rem;color:var(--text-secondary);">${V(r.displayName)}</div>`:``}
        </div>
      </div>
      <div class="id-derive__hint"><strong>${V(c)}.</strong> ${V(l)}</div>
      ${sS([...i,r])}
      <div class="persona-card__npub">${V(r.npub)}</div>
      ${cS(r)}
      ${lS(r)}
      ${uS(r)}
      ${dS(r)}
    </div>
  `}function pS(){return`
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
  `}function mS(){let{personas:e}=f(),t=[...le(e)].filter(({persona:e})=>e.archived).map(({persona:e})=>e);if(t.length===0)return``;let n=t.map(e=>`
      <div class="id-archived__row">
        <span class="id-archived__badge" style="background: var(--text-muted);">${V(e.name.slice(0,1).toUpperCase())}</span>
        <span class="id-archived__name">${V(e.name)}</span>
        <span class="id-archived__npub">${V(Wx(e.npub))}</span>
        <button class="btn btn--sm" data-restore-persona="${V(e.id)}">Restore</button>
      </div>
    `).join(``);return`
    <hr class="id-divider" />
    <div>
      <button class="id-archived__toggle" id="id-archived-toggle">
        <span>${Fx?`▼`:`▶`}</span>
        <span>Archived (${t.length})</span>
      </button>
      <div class="id-archived__list" id="id-archived-list" style="max-height: ${Fx?`1000px`:`0`};">
        ${n}
      </div>
    </div>
  `}function hS(e){Vx?.abort(),Vx=new AbortController;let{signal:t}=Vx;if(e.textContent=``,!document.getElementById(`id-hub-styles`)){let e=document.createElement(`style`);e.id=`id-hub-styles`,e.textContent=nS,document.head.appendChild(e)}if(!re()){let t=document.createElement(`div`);t.className=`id-hub`,t.innerHTML=rS(),e.appendChild(t);return}let n=document.createElement(`div`);n.className=`id-hub`,n.innerHTML=[`<h1 class="id-hub__heading">Identities</h1>`,`<div class="id-hub__sub">Derived from your master key</div>`,oS(),jx(Lx),fS(),pS(),mS()].join(``),e.appendChild(n),Mx(e),document.addEventListener(`canary:select-persona`,(t=>{let{personaId:n}=t.detail;n!==Lx&&(Lx=n,Rx=!1,zx=!1,Bx=!1,hS(e))}),{signal:t});let r=e.querySelector(`#id-backup-btn`),i=e.querySelector(`#id-mnemonic`),a=i?.nextElementSibling;function s(){i&&(Ix=!Ix,i.classList.toggle(`id-master__mnemonic--revealed`,Ix),a&&(a.textContent=Ix?`Click to hide`:`Click to reveal recovery phrase`))}r?.addEventListener(`click`,s,{signal:t}),i?.addEventListener(`click`,s,{signal:t}),e.querySelector(`#id-shamir-btn`)?.addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:shamir-split`,{bubbles:!0}))},{signal:t}),e.querySelector(`#id-verify-proof-btn`)?.addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:verify-proof`,{bubbles:!0}))},{signal:t}),e.querySelector(`#id-create-recovery-root`)?.addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:open-recovery-root-modal`,{bubbles:!0}))},{signal:t}),e.querySelectorAll(`[data-derive-slot-name]`).forEach(n=>{n.addEventListener(`input`,()=>{let t=Number(n.dataset.deriveSlotName);Hx[t]={...Hx[t],name:n.value},Ux=!1,tS(e)},{signal:t})}),e.querySelectorAll(`[data-derive-slot-index]`).forEach(n=>{n.addEventListener(`input`,()=>{let t=Number(n.dataset.deriveSlotIndex),r=n.value.trim(),i=r===``?0:Number(r);Hx[t]={...Hx[t],index:i},Ux=!1,tS(e)},{signal:t})}),e.querySelector(`#id-derive-clear`)?.addEventListener(`click`,()=>{Zx([]),hS(e)},{signal:t}),e.querySelector(`#id-derive-use-selected`)?.addEventListener(`click`,()=>{let t=Xx();t&&(Zx(t),hS(e))},{signal:t}),e.querySelector(`#id-derive-copy-npub`)?.addEventListener(`click`,()=>{let e=$x();!e||`error`in e||navigator.clipboard.writeText(e.npub).then(()=>{Y(`npub copied`,`success`)}).catch(()=>{})},{signal:t}),e.querySelector(`#id-derive-copy-nsec`)?.addEventListener(`click`,()=>{let t=$x();!t||`error`in t||(Ux=!0,navigator.clipboard.writeText(t.nsec).then(()=>{Y(`nsec copied`,`success`),tS(e)}).catch(()=>{tS(e)}))},{signal:t});let c=e.querySelector(`#id-detail`);if(c&&Lx){let n=Lx;c.addEventListener(`input`,e=>{if(!e.target.dataset.field)return;let{personas:t}=f(),r=z(t,n);if(!r)return;let i=c.querySelector(`#id-detail-publish`);i&&(i.hidden=!Yx(r.persona,c))},{signal:t}),c.querySelector(`#id-detail-publish`)?.addEventListener(`click`,()=>{let{personas:e}=f(),t=z(e,n);if(!t)return;let r=c.querySelector(`[data-field="displayName"]`),i=c.querySelector(`[data-field="about"]`),a=c.querySelector(`[data-field="picture"]`);u({personas:_S(e,n,{...t.persona,displayName:r?.value||void 0,about:i?.value||void 0,picture:a?.value||void 0})}),Y(`Profile saved for "${t.persona.name}"`,`success`)},{signal:t}),c.querySelector(`#id-detail-customise-relays`)?.addEventListener(`click`,t=>{t.preventDefault(),Bx=!0,hS(e)},{signal:t}),c.querySelector(`#id-detail-save-relays`)?.addEventListener(`click`,()=>{let e=c.querySelector(`[data-relay-field="read"]`),t=c.querySelector(`[data-relay-field="write"]`),r=(e?.value??``).split(`,`).map(e=>e.trim()).filter(Boolean),i=(t?.value??``).split(`,`).map(e=>e.trim()).filter(Boolean),{personas:a}=f(),o=z(a,n);o&&(u({personas:_S(a,n,{...o.persona,readRelays:r,writeRelays:i})}),Bx=!1,Y(`Relays saved for "${o.persona.name}"`,`success`))},{signal:t}),c.addEventListener(`click`,t=>{let n=t.target.closest(`[data-navigate-group]`);if(n){let e=n.dataset.navigateGroup;u({view:`groups`,activeGroupId:e});return}let r=t.target.closest(`[data-unassign-group]`);if(r){t.stopPropagation();let e=r.dataset.unassignGroup,{groups:n}=f(),i=n[e];if(!i)return;p(e,{personaId:``}),Y(`"${i.name}" unassigned`,`info`);return}if(Rx){let n=t.target.closest(`#id-detail-menu-panel`),r=t.target.closest(`#id-detail-menu-btn`);!n&&!r&&(Rx=!1,hS(e))}},{signal:t}),c.querySelector(`#id-detail-assign`)?.addEventListener(`change`,e=>{let t=e.target,r=t.value;if(!r)return;let{groups:i,personas:a}=f(),o=i[r];if(!o)return;p(r,{personaId:n});let s=z(a,n);Y(`"${o.name}" assigned to ${s?.persona.name??n}`,`success`),t.value=``},{signal:t}),c.querySelector(`#id-detail-export`)?.addEventListener(`click`,()=>{let{personas:t}=f();z(t,n)&&e.dispatchEvent(new CustomEvent(`canary:export-persona`,{bubbles:!0,detail:{personaId:n}}))},{signal:t}),c.querySelector(`#id-detail-menu-btn`)?.addEventListener(`click`,()=>{Rx=!Rx,hS(e)},{signal:t}),c.querySelector(`#id-detail-copy-npub`)?.addEventListener(`click`,()=>{let{personas:t}=f(),r=z(t,n);r&&(navigator.clipboard.writeText(r.persona.npub).then(()=>{Y(`npub copied`,`success`)}).catch(()=>{}),Rx=!1,hS(e))},{signal:t}),c.querySelector(`#id-detail-show-qr`)?.addEventListener(`click`,()=>{zx=!zx,Rx=!1,hS(e)},{signal:t}),c.querySelector(`#id-detail-rotate`)?.addEventListener(`click`,()=>{let{personas:t}=f();z(t,n)&&(Rx=!1,e.dispatchEvent(new CustomEvent(`canary:rotate-persona`,{bubbles:!0,detail:{personaId:n}})))},{signal:t}),c.querySelector(`#id-detail-prove`)?.addEventListener(`click`,()=>{let{personas:t}=f();z(t,n)&&(Rx=!1,e.dispatchEvent(new CustomEvent(`canary:prove-ownership`,{bubbles:!0,detail:{personaId:n}})))},{signal:t}),c.querySelector(`#id-detail-archive`)?.addEventListener(`click`,()=>{let{personas:t}=f();z(t,n)&&(Rx=!1,e.dispatchEvent(new CustomEvent(`canary:archive-persona`,{bubbles:!0,detail:{personaId:n}})))},{signal:t})}e.querySelector(`.id-master`)?.addEventListener(`click`,e=>{let t=e.target.closest(`[data-navigate-group]`);if(t){let e=t.dataset.navigateGroup;u({view:`groups`,activeGroupId:e})}},{signal:t});let l=e.querySelector(`#id-new-name`),d=e.querySelector(`#id-new-type`),m=e.querySelector(`#id-create-btn`),h=e.querySelector(`#id-create-error`);function g(){if(!l||!h)return;let e=l.value.trim();if(!Gx(e)){h.textContent=`Lowercase, no spaces, max 32 characters.`;return}let{personas:t}=f();if(Object.values(t).some(t=>t.name===e)){h.textContent=`That name is already taken.`;return}try{let n=ie(e,d?.value===`account`?`account`:`persona`);u({personas:{...t,[n.id]:n}}),l.value=``,d&&(d.value=`persona`),h.textContent=``,Lx=n.id,Rx=!1,zx=!1,Bx=!1,Y(`${o(n)} "${n.name}" created`,`success`)}catch(e){h.textContent=e instanceof Error?e.message:`Failed to create item.`}}m?.addEventListener(`click`,g,{signal:t}),l?.addEventListener(`keydown`,e=>{e.key===`Enter`&&g()},{signal:t});let _=e.querySelector(`#id-archived-toggle`),v=e.querySelector(`#id-archived-list`);_&&v&&_.addEventListener(`click`,()=>{Fx=!Fx,v.style.maxHeight=Fx?v.scrollHeight+`px`:`0`;let e=_.querySelector(`span`);e&&(e.textContent=Fx?`▼`:`▶`)},{signal:t}),e.addEventListener(`click`,e=>{let t=e.target.closest(`[data-restore-persona]`);if(!t)return;let n=t.dataset.restorePersona,{personas:r}=f();z(r,n)&&u({personas:gS(r,n,!1)})},{signal:t})}function gS(e,t,n){let r={};for(let[i,a]of Object.entries(e))i===t?r[i]={...a,archived:n}:a.children&&Object.keys(a.children).length>0?r[i]={...a,children:gS(a.children,t,n)}:r[i]=a;return r}function _S(e,t,n){let r={};for(let[i,a]of Object.entries(e))i===t?r[i]=n:a.children&&Object.keys(a.children).length>0?r[i]={...a,children:_S(a.children,t,n)}:r[i]=a;return r}var vS=null;function yS(e,t){let n=f().groups[t];if(!n)return e.slice(0,8);let{identity:r}=f();return r?.pubkey===e?`You`:n.memberNames?.[e]||`${e.slice(0,8)}\u2026${e.slice(-4)}`}function bS(e,t){vS&&=(vS(),null),document.querySelector(`.call-verify`)?.remove();let{groups:n,identity:r}=f(),i=n[e];if(!i||!r)return;let a=r.pubkey,o=yS(t,e),s=Ly(t),c=a<t?[a,t]:[t,a],l=px({secret:i.seed,namespace:`canary:call`,roles:c,myRole:a,preset:`call`}),u=fx.call.rotationSeconds,d=Math.floor(Date.now()/1e3),p=l.myToken(d),m=l.theirToken(d),h=document.createElement(`div`);h.className=`call-verify`,h.innerHTML=`
    <div class="call-verify__content">
      ${s?.picture?`<img class="call-verify__avatar" src="${V(s.picture)}" alt="" />`:``}
      <h2 class="call-verify__title">Call with ${V(o)}</h2>
      <p class="call-verify__instruction">Speak your word. Listen for theirs. If it matches, the call is verified.</p>

      <div class="call-verify__section call-verify__section--say">
        <span class="call-verify__label">Say this:</span>
        <span class="call-verify__word call-verify__word--mine" id="cv-word-mine">${V(p)}</span>
      </div>

      <div class="call-verify__divider"></div>

      <div class="call-verify__section call-verify__section--hear">
        <span class="call-verify__label">They should say:</span>
        <span class="call-verify__word call-verify__word--theirs" id="cv-word-theirs">${V(m)}</span>
      </div>

      <p class="call-verify__timer">Words change in <span id="cv-countdown">${u}</span>s</p>

      <p class="call-verify__instruction" style="margin-top: 1.5rem; font-size: 0.75rem;">In a real call, if they say the wrong word, it could be an emergency signal. A production app would automatically check and silently alert the group.</p>
      <div class="call-verify__actions">
        <button class="btn btn--primary call-verify__btn" id="cv-match">Match</button>
        <button class="btn call-verify__btn call-verify__btn--danger" id="cv-mismatch">Wrong Word</button>
        <button class="btn call-verify__btn" id="cv-close">Close</button>
      </div>
    </div>
  `;let g=null;function _(){let e=Math.floor(Date.now()/1e3),t=h.querySelector(`#cv-word-mine`),n=h.querySelector(`#cv-word-theirs`),r=h.querySelector(`#cv-countdown`);if(t&&(t.textContent=l.myToken(e)),n&&(n.textContent=l.theirToken(e)),r){let t=e%u;r.textContent=String(u-t)}}g=setInterval(_,1e3);function v(){g!==null&&(clearInterval(g),g=null)}function y(){vS&&=(vS(),null),h.classList.remove(`call-verify--visible`),setTimeout(()=>h.remove(),300)}function b(e){e.key===`Escape`&&y()}vS=()=>{v(),document.removeEventListener(`keydown`,b)},document.body.appendChild(h),requestAnimationFrame(()=>h.classList.add(`call-verify--visible`)),document.addEventListener(`keydown`,b),h.querySelector(`#cv-match`)?.addEventListener(`click`,()=>{v(),h.innerHTML=`
      <div class="call-verify__content">
        <h2 class="call-verify__title" style="color: var(--clr-success, #27ae60);">Call Verified</h2>
        <p class="call-verify__warning" style="color: var(--text-secondary);">${V(o)} is who they say they are. The call is authenticated.</p>
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
    `,h.querySelector(`#cv-dismiss-fail`)?.addEventListener(`click`,y)})}var xS=e({VAULT_D_TAG:()=>CS,VAULT_KIND:()=>SS,buildVaultEvent:()=>AS,decryptVault:()=>kS,deserialiseVault:()=>DS,encryptVault:()=>OS,fetchVault:()=>MS,fetchVaultNip07:()=>PS,mergeVaultGroups:()=>zS,publishVault:()=>jS,publishVaultNip07:()=>NS,serialiseVault:()=>ES,subscribeToVault:()=>LS,unsubscribeFromVault:()=>RS}),SS=30078,CS=`canary:vault`,wS=2160*60*60;function TS(e){let t=new Uint8Array(e.length/2);for(let n=0;n<e.length;n+=2)t[n/2]=parseInt(e.slice(n,n+2),16);return t}function ES(e,t={},n=[]){let r={};for(let[t,n]of Object.entries(e)){let{lastPositions:e,...i}=n;r[t]={...i,livenessCheckins:{}}}return JSON.stringify({version:3,groups:r,personas:t,deletedGroupIds:n})}function DS(e){try{let t=JSON.parse(e);if(!t||typeof t!=`object`||typeof t.groups!=`object`||t.groups===null)return{groups:{},personas:{},deletedGroupIds:[]};if(t.version===3)return{groups:t.groups,personas:t.personas&&typeof t.personas==`object`&&!Array.isArray(t.personas)?t.personas:{},deletedGroupIds:Array.isArray(t.deletedGroupIds)?t.deletedGroupIds:[]};console.info(`[canary:vault] Migrating vault from version`,t.version??1,`to v3`);let n=t.groups;for(let e of Object.values(n))!e.personaName&&!e.personaId&&(e.personaName=`personal`);let r=Array.isArray(t.personas)?t.personas:[],i={},a={};for(let e of r){let t=ue();a[e.name]=t,i[t]={...e,id:t,children:{}}}for(let e of Object.values(n)){let t=e.personaName??`personal`;if(!a[t]){let e=ue();a[t]=e,i[e]={name:t,id:e,index:0,npub:``,children:{}}}e.personaId||(e.personaId=a[t],delete e.personaName)}return{groups:n,personas:i,deletedGroupIds:Array.isArray(t.deletedGroupIds)?t.deletedGroupIds:[]}}catch{return{groups:{},personas:{},deletedGroupIds:[]}}}function OS(e,t,n){return ho(e,G(TS(t),n))}function kS(e,t,n){try{return go(e,G(TS(t),n))}catch{return null}}function AS(e,t){let n=TS(t),r=Math.floor(Date.now()/1e3);return Fe({kind:SS,created_at:r,tags:[[`d`,CS],[`expiration`,String(r+wS)]],content:e},n)}async function jS(e,t,n,r={},i=[]){let a=B();if(!a)throw Error(`No relay pool — connect first`);let o=Oe();if(o.length===0)throw Error(`No write relays configured`);let s=AS(OS(ES(e,r,i),t,n),t);console.info(`[canary:vault] Publishing vault (${Object.keys(e).length} groups) to`,o),document.dispatchEvent(new CustomEvent(`canary:vault-syncing`));let c=await Promise.allSettled(a.publish(o,s)),l=c.filter(e=>e.status===`fulfilled`).length,u=c.filter(e=>e.status===`rejected`).length;console.info(`[canary:vault] Publish results: ${l} OK, ${u} failed`),u>0&&c.forEach((e,t)=>{e.status===`rejected`&&console.warn(`[canary:vault] Relay ${o[t]} rejected:`,e.reason)}),document.dispatchEvent(new CustomEvent(`canary:vault-synced`,{detail:{timestamp:Math.floor(Date.now()/1e3)}}))}async function MS(e,t){let n=B();if(!n)return console.warn(`[canary:vault] fetchVault: no pool`),null;let r=ye();return r.length===0?(console.warn(`[canary:vault] fetchVault: no read relays`),null):(console.info(`[canary:vault] Fetching vault from`,r,`for`,t.slice(0,8)),new Promise(i=>{let a=!1,o=null,s=setTimeout(()=>{if(!a){if(a=!0,c.close(),console.warn(`[canary:vault] fetchVault timed out after 10s`),o){let n=kS(o.content,e,t);if(n){let e=DS(n);if(Object.keys(e.groups).length>0){i(e);return}}}i(null)}},1e4),c=n.subscribeMany(r,{kinds:[SS],authors:[t],"#d":[CS],limit:1},{onevent(e){je(e)&&(typeof e.content==`string`&&e.content.length>262144||(console.info(`[canary:vault] Received vault event created_at=${e.created_at}`),(!o||e.created_at>o.created_at)&&(o=e)))},oneose(){if(!a){if(a=!0,clearTimeout(s),c.close(),o){console.info(`[canary:vault] EOSE — decrypting vault event`);let n=kS(o.content,e,t);if(n){let e=DS(n);if(Object.keys(e.groups).length>0){i(e);return}}console.warn(`[canary:vault] Vault decryption failed`)}else console.info(`[canary:vault] EOSE — no vault event found`);i(null)}}})}))}async function NS(e,t,n={},r=[],i={pubkey:t,signerType:`nip07`,signerMethod:`nip07`},a={}){let o=B();if(!o)throw Error(`No relay pool — connect first`);let s=Oe();if(s.length===0)throw Error(`No write relays configured`);let c=await zh(i,t,ES(e,n,r),a),l=Math.floor(Date.now()/1e3),u=await Rh(i,{kind:SS,created_at:l,tags:[[`d`,CS],[`expiration`,String(l+wS)]],content:c},a);console.info(`[canary:vault] Publishing vault via Signet (${Object.keys(e).length} groups) to`,s),document.dispatchEvent(new CustomEvent(`canary:vault-syncing`));let d=await Promise.allSettled(o.publish(s,u)),f=d.filter(e=>e.status===`fulfilled`).length,p=d.filter(e=>e.status===`rejected`).length;console.info(`[canary:vault] Signet publish results: ${f} OK, ${p} failed`),document.dispatchEvent(new CustomEvent(`canary:vault-synced`,{detail:{timestamp:l}}))}async function PS(e,t={pubkey:e,signerType:`nip07`,signerMethod:`nip07`},n={}){let r=B();if(!r)return console.warn(`[canary:vault] fetchVaultNip07: no pool`),null;let i=ye();return i.length===0?(console.warn(`[canary:vault] fetchVaultNip07: no read relays`),null):(console.info(`[canary:vault] Fetching vault via Signet from`,i,`for`,e.slice(0,8)),new Promise(a=>{let o=!1,s=null,c=setTimeout(async()=>{if(!o){if(o=!0,l.close(),console.warn(`[canary:vault] fetchVaultNip07 timed out after 10s`),s)try{let r=DS(await Bh(t,e,s.content,n));if(Object.keys(r.groups).length>0){a(r);return}}catch{}a(null)}},1e4),l=r.subscribeMany(i,{kinds:[SS],authors:[e],"#d":[CS],limit:1},{onevent(e){je(e)&&(typeof e.content==`string`&&e.content.length>262144||(console.info(`[canary:vault] Signet received vault event created_at=${e.created_at}`),(!s||e.created_at>s.created_at)&&(s=e)))},async oneose(){if(!o){if(o=!0,clearTimeout(c),l.close(),s){console.info(`[canary:vault] Signet EOSE — decrypting vault event`);try{let r=DS(await Bh(t,e,s.content,n));if(Object.keys(r.groups).length>0){a(r);return}}catch(e){console.warn(`[canary:vault] Signet vault decryption failed:`,e)}}else console.info(`[canary:vault] Signet EOSE — no vault event found`);a(null)}}})}))}var FS=null,IS=0;function LS(e,t,n){RS();let r=B();if(!r)return;let i=ye();if(i.length===0)return;IS=Math.floor(Date.now()/1e3),console.info(`[canary:vault] Subscribing to live vault updates for`,e.slice(0,8));let a=r.subscribeMany(i,{kinds:[SS],authors:[e],"#d":[CS],since:IS},{async onevent(e){if(je(e)&&!(e.created_at<=IS)&&!(typeof e.content==`string`&&e.content.length>262144)){console.info(`[canary:vault] Live vault update received created_at=${e.created_at}`),IS=e.created_at;try{let r=await t(e.content);if(!r)return;let{groups:i,personas:a}=DS(r);if(Object.keys(i).length===0)return;n(i,Object.keys(i).length,a)}catch(e){console.warn(`[canary:vault] Live vault decrypt failed:`,e)}}},oneose(){console.info(`[canary:vault] Live vault subscription EOSE — watching for updates`)}});FS=()=>a.close()}function RS(){FS?.(),FS=null}function zS(e,t,n=[]){let r={...e},i=new Set(n);for(let[n,a]of Object.entries(t)){if(i.has(n))continue;let t=e[n];if(!t){r[n]=a;continue}let o=t.epoch??0,s=a.epoch??0;if(s>o)r[n]=a;else if(s===o){let e=t.counter??0;(a.counter??0)>e&&(r[n]=a)}}return r}function BS(e){if(e.startsWith(`wss://`))return!0;if(e.startsWith(`ws://`))try{let t=new URL(e);return t.hostname===`localhost`||t.hostname===`127.0.0.1`||t.hostname===`[::1]`}catch{return!1}return!1}function VS(e,t){return t?.pubkey===e.pubkey&&t.mnemonic?{...e,mnemonic:t.mnemonic}:e}var HS=i([l,...a]);function US(e){return i((e??[]).filter(BS))}function WS(e=f().settings){return i([...US(e.knownRelays===void 0?HS:e.knownRelays),...US(e.defaultRelays),...US(e.defaultReadRelays),...US(e.defaultWriteRelays)])}function GS(e,t=f().settings){let n=US(t.defaultReadRelays).includes(e),r=US(t.defaultWriteRelays).includes(e);return n&&r?`readwrite`:n?`read`:`off`}function KS(e,t){let n=i([e])[0]??e,r=f().settings,a=i([...WS(r),n]),o=US(r.defaultReadRelays).filter(e=>e!==n),s=US(r.defaultWriteRelays).filter(e=>e!==n);(t===`read`||t===`readwrite`)&&o.push(n),t===`readwrite`&&s.push(n);let c=i(s);u({settings:{...r,knownRelays:a,defaultRelays:c,defaultReadRelays:i(o),defaultWriteRelays:c}})}function qS(e){let t=f().settings,n=WS(t).filter(t=>t!==e),r=US(t.defaultReadRelays).filter(t=>t!==e),i=US(t.defaultWriteRelays).filter(t=>t!==e);u({settings:{...t,knownRelays:n,defaultRelays:i,defaultReadRelays:r,defaultWriteRelays:i}})}function JS(){u({settings:{...f().settings,knownRelays:HS,defaultRelays:[l],defaultReadRelays:i([...a,l]),defaultWriteRelays:[l]}})}function YS(e){return e.replace(/^wss?:\/\//,``).replace(/\/$/,``)}function XS(){let e=WS();return e.length===0?`<li class="login-relay-empty">No relays configured.</li>`:e.map(e=>{let t=GS(e),n=t!==`off`,r=t===`read`?`read`:`readwrite`;return`
      <li class="login-relay-item" data-relay-row="${V(e)}">
        <button class="login-relay-toggle" data-relay-toggle="${V(e)}" type="button" aria-pressed="${n}">${n?`On`:`Off`}</button>
        <span class="login-relay-url" title="${V(e)}">${V(YS(e))}</span>
        <select class="input login-relay-mode" data-relay-mode="${V(e)}" aria-label="Relay mode for ${V(YS(e))}" ${n?``:`disabled`}>
          <option value="readwrite"${r===`readwrite`?` selected`:``}>Read/write</option>
          <option value="read"${r===`read`?` selected`:``}>Read</option>
        </select>
        <button class="btn btn--ghost btn--sm login-relay-delete" data-relay-delete="${V(e)}" type="button" aria-label="Delete relay">×</button>
      </li>
    `}).join(``)}function ZS(e=window.location.hash){if(e.startsWith(`#j/`)){let t=e.slice(3);return/^[0-9a-f]{32}$/.test(t)?{label:`Secure invite`,title:`You have been invited to a CANARY group`,hint:`Sign in with Signet to request the group key over relays.`,signetButton:`Join with Signet`,quickStartHint:`No Nostr account needed. Enter your name to create a local identity and continue joining.`}:null}if(e.startsWith(`#remote/`)){let t=e.slice(8);try{t=decodeURIComponent(t)}catch{}try{let e=G_(t);return av(e),{label:`Remote invite`,title:`Join ${e.groupName}`,hint:`Sign in with Signet to decrypt the welcome message and add this group.`,signetButton:`Join with Signet`,quickStartHint:`No Nostr account needed. Enter your name to create a local identity and continue joining.`}}catch{return{label:`Remote invite`,title:`You have been invited to a CANARY group`,hint:`Sign in with Signet to continue joining.`,signetButton:`Join with Signet`,quickStartHint:`No Nostr account needed. Enter your name to create a local identity and continue joining.`}}}if(e.startsWith(`#inv/`))try{return{label:`In-person invite`,title:`Join ${$v(q_(e.slice(5))).groupName}`,hint:`Sign in first, then enter the confirmation words from the admin.`,signetButton:`Continue with Signet`,quickStartHint:`No Nostr account needed. Enter your name to create a local identity and continue joining.`}}catch{return{label:`In-person invite`,title:`You have been invited to a CANARY group`,hint:`Sign in first, then enter the confirmation words from the admin.`,signetButton:`Continue with Signet`,quickStartHint:`No Nostr account needed. Enter your name to create a local identity and continue joining.`}}return null}var QS=!1;function $S(){QS||(QS=!0,window.addEventListener(`hashchange`,()=>{f().identity?.pubkey||document.querySelector(`.login-panel`)&&CC()}))}function eC(e,t){return e?typeof t.epoch==`number`&&t.epoch<e.epoch?`This invite is older than the group state already stored on this device.`:typeof t.latestInviteIssuedAt==`number`&&e.latestInviteIssuedAt>0&&t.latestInviteIssuedAt<e.latestInviteIssuedAt?`A newer invite has already been accepted for this group on this device.`:typeof t.epoch==`number`&&t.epoch===e.epoch&&typeof t.counter==`number`&&t.counter<e.counter?`This invite would roll the group back to an older counter.`:null:null}Gr(),Rr().theme===`light`?document.documentElement.setAttribute(`data-theme`,`light`):document.documentElement.removeAttribute(`data-theme`);var tC=null;function nC(){tC!==null&&(clearTimeout(tC),tC=null);let{settings:e}=f();!e.pinEnabled||e.autoLockMinutes<=0||!Lr()||(tC=setTimeout(async()=>{await Kr(),ne(),sr(),h(),aC()},e.autoLockMinutes*60*1e3))}function rC(){document.addEventListener(`pointerdown`,nC,{passive:!0}),document.addEventListener(`keydown`,nC,{passive:!0}),nC()}function iC(){document.removeEventListener(`pointerdown`,nC),document.removeEventListener(`keydown`,nC),tC!==null&&(clearTimeout(tC),tC=null)}function aC(){iC(),ug();let e=document.getElementById(`app`);e.innerHTML=`
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
  `;let t=document.getElementById(`pin-input`),n=document.getElementById(`pin-error`),r=document.getElementById(`pin-submit`),i=0,a=[0,1e3,2e3,5e3,15e3,3e4];async function o(){let e=t.value.trim();if(e.length<6){n.textContent=`PIN must be at least 6 digits.`,n.hidden=!1,t.focus();return}r.disabled=!0,r.textContent=`Unlocking…`,n.hidden=!0;try{await zr(e),await vC();{let{identity:e,personas:t}=f();e?.privkey&&(Object.keys(t).length>0?te(e,t):se(e))}oC();let t=document.getElementById(`header`);t&&Tg(t),sC(),uC(),d(lC),rC(),_C(),fC(),window.addEventListener(`hashchange`,()=>fC()),bC(),Ky().catch(()=>{})}catch{i++;let e=a[Math.min(i,a.length-1)];n.textContent=e>0?`Incorrect PIN. Wait ${e/1e3}s before retrying.`:`Incorrect PIN. Try again.`,n.hidden=!1,t.value=``,r.disabled=!0,r.textContent=`Unlock`,e>0?setTimeout(()=>{r.disabled=!1,t.focus()},e):(r.disabled=!1,t.focus())}}r.addEventListener(`click`,()=>{o()}),t.addEventListener(`keydown`,e=>{e.key===`Enter`&&o()}),requestAnimationFrame(()=>t.focus())}function oC(){let e=document.getElementById(`app`);if(!e)throw Error(`Missing #app mount point`);e.innerHTML=`
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
      <span class="app-footer__version">CANARY v2.8.4</span>
    </footer>
  `}function sC(){let e=document.getElementById(`hamburger`),t=document.getElementById(`sidebar`),n=document.getElementById(`sidebar-overlay`);if(!e||!t||!n)return;function r(){t.classList.add(`sidebar--open`),n.classList.add(`sidebar-overlay--visible`),e.setAttribute(`aria-expanded`,`true`)}function i(){t.classList.remove(`sidebar--open`),n.classList.remove(`sidebar-overlay--visible`),e.setAttribute(`aria-expanded`,`false`)}e.setAttribute(`aria-expanded`,`false`),e.addEventListener(`click`,()=>{t.classList.contains(`sidebar--open`)?i():r()}),n.addEventListener(`click`,()=>{i()}),t.addEventListener(`click`,e=>{e.target.closest(`[data-group-id]`)&&i()})}var cC=!1;function lC(){cC||(cC=!0,requestAnimationFrame(()=>{cC=!1,uC()}))}function uC(){let{view:e}=f(),t=document.getElementById(`groups-view`),n=document.getElementById(`call-demo-view`),i=document.getElementById(`identities-view`);t&&(t.hidden=e!==`groups`),n&&(n.hidden=e!==`call-demo`),i&&(i.style.display=e===`identities`?``:`none`);let a=document.getElementById(`header`);if(a&&Tg(a),e===`groups`){Ex();let e=document.getElementById(`welcome-container`);e&&u_(e);let t=document.getElementById(`sidebar`);t&&Ig(t);let n=document.getElementById(`hero-container`);n&&O_(n);let i=document.getElementById(`verify-container`);i&&V_(i);let a=document.getElementById(`members-container`);a&&tb(a);let o=f().groups[f().activeGroupId??``],s=o?r(o)===`online`:!1,c=document.getElementById(`beacon-container`);c&&(s?(c.hidden=!1,Mb(c)):(Kb(),c.hidden=!0,c.innerHTML=``));let l=document.getElementById(`liveness-container`);l&&(s?(l.hidden=!1,Zb(l)):(l.hidden=!0,l.innerHTML=``));let u=document.getElementById(`settings-container`);u&&ox(u)}else if(e===`call-demo`){let e=document.getElementById(`call-simulation-container`);e&&Tx(e)}else if(e===`identities`){Ex();let e=document.getElementById(`identities-view`);e&&hS(e)}}function dC(){let{identity:e,personas:t,activePersonaId:n}=f(),i=e?.displayName&&e.displayName!==`You`?e.displayName:``,a=Object.values(t),o=a.length>0?a.map(e=>{let t=e.id===n?` selected`:``;return`<option value="${V(e.id)}"${t}>${V(e.name)}</option>`}).join(``):`<option value="">—</option>`;Rg(`
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
    ${i?``:`
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
      <select class="input" name="persona">${o}</select>
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
  `,t=>{let n=t.get(`name`)?.trim()??``;if(!n)return;let a=i||t.get(`myname`)?.trim()||``,o=t.get(`persona`)?.trim()||``,c=t_(n,document.querySelector(`.segmented__btn.segmented__btn--active[data-preset]`)?.dataset.preset??`family`,e?.pubkey,o);if(a&&e?.pubkey){let t=f().groups[c];t&&p(c,{memberNames:{...t.memberNames,[e.pubkey]:a}})}let l=f().groups[c];l&&r(l)===`online`&&s(l).length>0&&ng(l.readRelays??[],l.writeRelays??[],c),AC(),X(async()=>{let{shouldPromptForNotifications:e,shouldPromptAddToHomeScreen:t,isMacSafari:n,subscribeToPush:r,registerWithPushServer:i}=await import(`./push-BYeuOIYg.js`);return{shouldPromptForNotifications:e,shouldPromptAddToHomeScreen:t,isMacSafari:n,subscribeToPush:r,registerWithPushServer:i}},[],import.meta.url).then(({shouldPromptForNotifications:e,shouldPromptAddToHomeScreen:t,isMacSafari:n,subscribeToPush:r,registerWithPushServer:i})=>{if(t()){setTimeout(()=>{EC()},1500);return}if(n()&&!(`Notification`in window)){console.info(`[canary:push] Mac Safari without notification support — skipping prompt`);return}e()&&setTimeout(()=>{TC(async()=>{try{let e=await r();if(!e){console.warn(`[canary:push] subscribeToPush returned null — permission denied or unavailable`);return}let{hashGroupTag:t}=await X(async()=>{let{hashGroupTag:e}=await Promise.resolve().then(()=>aa);return{hashGroupTag:e}},void 0,import.meta.url),{groups:n}=f(),a=Object.values(n).map(e=>({tagHash:t(e.id),livenessInterval:e.livenessInterval}));await i(e,a),console.info(`[canary:push] Registered with push server, groups:`,a.length),Y(`Notifications enabled`,`success`)}catch(e){console.error(`[canary:push] Registration failed:`,e),Y(`Failed to enable notifications`,`error`)}})},1500)}).catch(e=>console.error(`[canary:push] Import failed:`,e))}),requestAnimationFrame(()=>{document.getElementById(`modal-cancel-btn`)?.addEventListener(`click`,()=>{document.getElementById(`app-modal`)?.close()}),document.querySelectorAll(`.segmented__btn[data-preset]`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.segmented__btn[data-preset]`).forEach(e=>e.classList.remove(`segmented__btn--active`)),e.classList.add(`segmented__btn--active`)})})})}function fC(){let e=window.location.hash;if(e.startsWith(`#ack/`)){let t;try{t=decodeURIComponent(e.slice(5))}catch{console.warn(`[canary] Malformed ack fragment — ignoring.`),window.location.hash=``;return}window.location.hash=``,document.dispatchEvent(new CustomEvent(`canary:confirm-member`,{detail:{token:t}}))}else if(e.startsWith(`#inv/`)){let t=e.slice(5);window.location.hash=``,pC(t)}else if(e.startsWith(`#j/`)){let t=e.slice(3);window.location.hash=``,/^[0-9a-f]{32}$/.test(t)?hC(t):Y(`Invalid invite link.`,`error`)}else if(e.startsWith(`#remote/`)){let t=e.slice(8);try{t=decodeURIComponent(t)}catch{}window.location.hash=``,gC(t)}}function pC(e){try{let t=$v(q_(e)),{identity:n}=f();if(!n?.pubkey){Y(`No local identity — create or import one first.`,`error`);return}let r=document.getElementById(`binary-join-modal`);r||(r=document.createElement(`dialog`),r.id=`binary-join-modal`,r.className=`modal`,document.body.appendChild(r),r.addEventListener(`click`,e=>{e.target===r&&r.close()}));let i=r;i.innerHTML=`
      <div class="modal__form invite-share">
        <h2 class="modal__title">Join ${V(t.groupName)}</h2>
        <p class="invite-hint">Invited by <code>${V(t.inviterPubkey.slice(0,8))}\u2026</code></p>
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
    `,i.querySelector(`#binary-join-cancel`)?.addEventListener(`click`,()=>i.close()),i.querySelector(`#binary-join-accept`)?.addEventListener(`click`,()=>{let e=i.querySelector(`#binary-join-confirm`),r=i.querySelector(`#binary-join-error`),o=e?.value.trim()??``;if(!o){r&&(r.textContent=`Please enter the confirmation words.`,r.style.display=``);return}try{let e=Av(H_(t),o);if(jv(e.groupId,e.nonce))throw Error(`This invite has already been used.`);let r=e.groupId,{groups:s}=f(),c=eC(s[r],{epoch:e.epoch,counter:e.counter,latestInviteIssuedAt:e.issuedAt});if(c)throw Error(c);let d=new Set(e.members);d.add(n.pubkey);let p=f().settings,m=e.relays.length>0?e.relays:p.defaultWriteRelays?.length?[...p.defaultWriteRelays]:[l],h=Array.from(new Set([...p.defaultReadRelays?.length?p.defaultReadRelays:a,...m])),g=m.length>0,_={id:r,name:e.groupName,seed:e.seed,members:Array.from(d),memberNames:e.memberNames??{},nostrEnabled:g,relays:e.relays,readRelays:h,writeRelays:m,wordlist:e.wordlist,wordCount:e.wordCount,counter:e.counter,usageOffset:e.usageOffset,rotationInterval:e.rotationInterval,encodingFormat:e.encodingFormat,usedInvites:[e.nonce],latestInviteIssuedAt:e.issuedAt,beaconInterval:e.beaconInterval,beaconPrecision:e.beaconPrecision,duressMode:`immediate`,livenessInterval:e.rotationInterval,livenessCheckins:{},tolerance:e.tolerance,personaId:f().activePersonaId??``,createdAt:Math.floor(Date.now()/1e3),admins:[...e.admins],epoch:e.epoch,consumedOps:[]};u({groups:{...s,[r]:_},activeGroupId:r}),Mv(r,e.nonce),Kr(),AC(),g&&n&&ng(h,m,r).then(()=>{rg(r,{type:`member-join`,pubkey:n.pubkey,displayName:n.displayName&&n.displayName!==`You`?n.displayName:void 0,timestamp:Math.floor(Date.now()/1e3),epoch:e.epoch,opId:crypto.randomUUID()})}),i.close(),Y(`Joined ${e.groupName}`,`success`)}catch(e){r&&(r.textContent=e instanceof Error?e.message:`Failed to join group.`,r.style.display=``)}}),i.showModal()}catch(e){Y(e instanceof Error?e.message:`Invalid QR invite.`,`error`)}}async function mC(e,t,n){let{identity:r}=f();if(!r?.pubkey)return;let i=r.privkey?sv({envelope:e,joinerPrivkey:r.privkey,adminPubkey:t.adminPubkey,expectedInviteId:t.inviteId}):kh(r)?await(async()=>cv(await Bh(r,t.adminPubkey,e,{interactive:!0}),t.inviteId))():null;if(!i)throw Error(`No local key or Signet signer — cannot decrypt welcome message.`);let o=i.groupId,{groups:s}=f(),c=eC(s[o],{epoch:i.epoch,counter:i.counter});if(c)throw Error(c);let d=new Set(i.members);d.add(r.pubkey);let p={...i.memberNames??{}};r.displayName&&r.displayName!==`You`&&(p[r.pubkey]=r.displayName);let m=[...i.relays??[]],h=m.length>0?m:[l],g=Array.from(new Set([...a,...h])),_=h.length>0,v={id:o,name:i.groupName,seed:i.seed,members:Array.from(d),memberNames:p,nostrEnabled:_,relays:m,readRelays:g,writeRelays:h,wordlist:i.wordlist,wordCount:i.wordCount,counter:i.counter,usageOffset:i.usageOffset,rotationInterval:i.rotationInterval,encodingFormat:i.encodingFormat,usedInvites:[],latestInviteIssuedAt:0,beaconInterval:i.beaconInterval,beaconPrecision:i.beaconPrecision,duressMode:`immediate`,livenessInterval:i.rotationInterval,livenessCheckins:{},tolerance:i.tolerance,personaId:f().activePersonaId??``,createdAt:Math.floor(Date.now()/1e3),admins:[...i.admins],epoch:i.epoch,consumedOps:[]};u({groups:{...s,[o]:v},activeGroupId:o}),Kr(),AC(),_&&r&&ng(g,h,o).then(()=>{rg(o,{type:`member-join`,pubkey:r.pubkey,displayName:r.displayName&&r.displayName!==`You`?r.displayName:void 0,timestamp:Math.floor(Date.now()/1e3),epoch:i.epoch,opId:crypto.randomUUID()})}),n.close(),Y(`Joined ${i.groupName}`,`success`)}function hC(e){let{identity:t,settings:n}=f();if(!t?.pubkey||!Ah(t)){Y(`No local identity — create or import one first.`,`error`);return}let r=Array.from(new Set([...a,...n.defaultWriteRelays??[]])),i=n.defaultWriteRelays??[`wss://relay.trotters.cc`],o=document.getElementById(`relay-join-modal`);o||(o=document.createElement(`dialog`),o.id=`relay-join-modal`,o.className=`modal`,document.body.appendChild(o),o.addEventListener(`click`,e=>{e.target===o&&o.close()}));let s=o;s.innerHTML=`
    <div class="modal__form invite-share">
      <h2 class="modal__title">Joining...</h2>
      <p class="invite-hint" id="relay-join-status">Looking for invite on relay...</p>
      <div class="modal__actions">
        <button class="btn" id="relay-join-cancel" type="button">Cancel</button>
      </div>
    </div>
  `;let c=()=>{},l=()=>{};s.querySelector(`#relay-join-cancel`)?.addEventListener(`click`,()=>{c(),l(),s.close()}),s.showModal(),ng(r,i).then(()=>{c=ky({inviteId:e,readRelays:r,onToken(e){try{av(e)}catch(e){let t=s.querySelector(`#relay-join-status`);t&&(t.textContent=e instanceof Error?e.message:`Invalid invite token.`,t.style.color=`var(--duress)`);return}let t=e.relays?.length?e.relays:i,n=t,r=Array.from(new Set([...a,...t])),o=s.querySelector(`#relay-join-status`);o&&(o.textContent=`Joining ${e.groupName}...`),ng(r,n).then(()=>{l=wy({inviteId:e.inviteId,adminPubkey:e.adminPubkey,readRelays:r,writeRelays:n,async onWelcome(t){try{await mC(t,e,s)}catch{o&&(o.textContent=`Failed to join — welcome message could not be decrypted.`,o.style.color=`var(--duress)`)}},onError(e){o&&(o.textContent=e,o.style.color=`var(--duress)`)}})})},onError(e){let t=s.querySelector(`#relay-join-status`);t&&(t.textContent=e,t.style.color=`var(--duress)`)}})})}function gC(e){try{let t;try{t=G_(e)}catch{try{t=U_(e)}catch{throw Error(`Invalid invite — could not decode token.`)}}av(t);let n=t,{identity:r,settings:i}=f();if(!r?.pubkey||!Ah(r)){Y(`No local identity — create or import one first.`,`error`);return}let o=`${n.adminPubkey.slice(0,8)}\u2026${n.adminPubkey.slice(-4)}`,s=n.relays?.length?n.relays:i.defaultWriteRelays,c=s,l=Array.from(new Set([...a,...s])),u=Array.from(new Set([...l,...c])),d=document.getElementById(`remote-join-modal`);d||(d=document.createElement(`dialog`),d.id=`remote-join-modal`,d.className=`modal`,document.body.appendChild(d),d.addEventListener(`click`,e=>{e.target===d&&d.close()}));let p=d,m=()=>{};p.innerHTML=`
      <div class="modal__form invite-share">
        <h2 class="modal__title">Remote Invite</h2>
        <p class="invite-hint">You've been invited to <strong>${V(n.groupName)}</strong> by <code>${V(o)}</code></p>

        <p class="invite-hint" id="remote-join-relay-status" style="color: var(--verified); font-weight: 500;">${u.length>0?`Connecting to relay...`:``}</p>

        <div style="margin: 1rem 0;">
          <p class="invite-hint" style="font-weight: 500;">Or send this join code manually:</p>
          <div style="display: flex; align-items: center; gap: 0.5rem; justify-content: center; margin: 0.5rem 0;">
            <code style="font-size: 0.75rem; word-break: break-all; max-width: 80%;">${V(r.pubkey)}</code>
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
    `,u.length>0&&ng(l,c).then(()=>{let e=p.querySelector(`#remote-join-relay-status`);e&&(e.textContent=`Waiting for admin to send group key...`),m=wy({inviteId:n.inviteId,adminPubkey:n.adminPubkey,readRelays:l,writeRelays:c,async onWelcome(t){try{await mC(t,n,p)}catch{e&&(e.textContent=`Auto-join failed — paste welcome message manually.`,e.style.color=`var(--duress)`)}},onError(t){e&&(e.textContent=t,e.style.color=`var(--duress)`)}})}),p.querySelector(`#remote-join-copy-pubkey`)?.addEventListener(`click`,async e=>{let t=e.currentTarget;try{await navigator.clipboard.writeText(r.pubkey),t.textContent=`Copied!`,setTimeout(()=>{t.textContent=`Copy`},1500)}catch{}}),p.querySelector(`#remote-join-cancel`)?.addEventListener(`click`,()=>{m(),p.close()}),p.querySelector(`#remote-join-accept`)?.addEventListener(`click`,async()=>{let e=p.querySelector(`#remote-join-welcome-input`),t=p.querySelector(`#remote-join-error`),r=(e?.value??``).replace(/[^A-Za-z0-9=+/]/g,``);if(!r){t&&(t.textContent=`Please paste the welcome message.`,t.style.display=``);return}try{m(),await mC(r,n,p)}catch(e){t&&(t.textContent=e instanceof Error?e.message:`Failed to decrypt welcome message.`,t.style.display=``)}}),p.showModal()}catch(e){Y(e instanceof Error?e.message:`Invalid remote invite.`,`error`)}}function _C(){document.addEventListener(`canary:create-group`,()=>{dC()}),document.addEventListener(`canary:show-invite`,e=>{let{groupId:t}=e.detail,{groups:n}=f(),r=n[t];r&&Qy(r)}),document.addEventListener(`canary:confirm-member`,e=>{let{identity:t,groups:n,activeGroupId:r}=f();if(!r||!t?.pubkey)return;let i=n[r];if(!i||!i.admins.includes(t.pubkey))return;let a=e.detail?.token??``;X(async()=>{let{showConfirmMemberModal:e}=await Promise.resolve().then(()=>qy);return{showConfirmMemberModal:e}},void 0,import.meta.url).then(({showConfirmMemberModal:e})=>{e(a)})}),document.addEventListener(`canary:verify-call`,e=>{let{groupId:t,pubkey:n}=e.detail;bS(t,n)}),document.addEventListener(`canary:shamir-split`,()=>{X(async()=>{let{showShamirModal:e}=await import(`./shamir-modal-Ip607TpO.js`);return{showShamirModal:e}},__vite__mapDeps([3,4,5,6,7,8]),import.meta.url).then(({showShamirModal:e})=>{e()})}),document.addEventListener(`canary:verify-proof`,()=>{X(async()=>{let{showVerifyProofModal:e}=await import(`./linkage-proof-Dv0U3c6r.js`);return{showVerifyProofModal:e}},__vite__mapDeps([9,10,11,1,4,5,12,8,13,14,6]),import.meta.url).then(({showVerifyProofModal:e})=>{e()})}),document.addEventListener(`canary:open-recovery-root-modal`,()=>{X(async()=>{let{showRecoveryRootModal:e}=await import(`./recovery-root-modal-Duq1pYEp.js`);return{showRecoveryRootModal:e}},[],import.meta.url).then(({showRecoveryRootModal:e})=>{e()})}),document.addEventListener(`canary:create-recovery-root`,async e=>{let t=(e.detail?.name??``).trim();if(!t){alert(`Please enter a name for the new mnemonic-backed root.`);return}let{generateMnemonic:n}=await X(async()=>{let{generateMnemonic:e}=await Promise.resolve().then(()=>Tn);return{generateMnemonic:e}},void 0,import.meta.url),{wordlist:r}=await X(async()=>{let{wordlist:e}=await Promise.resolve().then(()=>Rn);return{wordlist:e}},void 0,import.meta.url),{restoreFromMnemonic:i}=await X(async()=>{let{restoreFromMnemonic:e}=await Promise.resolve().then(()=>Hn);return{restoreFromMnemonic:e}},void 0,import.meta.url),a=n(r),{root:o,defaultPersona:s}=i(a),c=xC(s.identity.privateKey),l=xC(s.identity.publicKey);s.identity.privateKey.fill(0),o.destroy(),ug(),u({identity:{pubkey:l,privkey:c,mnemonic:a,signerType:`local`,displayName:t},groups:{},personas:{},activeGroupId:null,activePersonaId:null}),document.dispatchEvent(new CustomEvent(`canary:resync`)),uC(),SC(a)}),document.addEventListener(`canary:restore-recovery-root`,async e=>{let t=(e.detail?.mnemonic??``).trim().replace(/\s+/g,` `);if(!t){alert(`Please paste a recovery phrase first.`);return}if(t.split(/\s+/).length!==12){alert(`Recovery phrase must be exactly 12 words.`);return}try{let{validateMnemonic:e,restoreFromMnemonic:n}=await X(async()=>{let{validateMnemonic:e,restoreFromMnemonic:t}=await Promise.resolve().then(()=>Hn);return{validateMnemonic:e,restoreFromMnemonic:t}},void 0,import.meta.url),{wordlist:r}=await X(async()=>{let{wordlist:e}=await Promise.resolve().then(()=>Rn);return{wordlist:e}},void 0,import.meta.url);if(!e(t,r)){alert(`Invalid recovery phrase. Please check your words and try again.`);return}let{root:i,defaultPersona:a}=n(t),o=xC(a.identity.privateKey),s=xC(a.identity.publicKey);a.identity.privateKey.fill(0),i.destroy(),ug(),u({identity:{pubkey:s,privkey:o,mnemonic:t,signerType:`local`,displayName:`You`},groups:{},personas:{},activeGroupId:null,activePersonaId:null}),document.dispatchEvent(new CustomEvent(`canary:resync`)),uC()}catch{alert(`Invalid recovery phrase.`)}}),document.addEventListener(`canary:export-persona`,e=>{let{personaId:t}=e.detail,{personas:n}=f(),r=z(n,t);r&&X(async()=>{let{showExportModal:e}=await import(`./export-modal-CGGwVxUB.js`);return{showExportModal:e}},__vite__mapDeps([15,11,1,10,4,5,12,8,13,14,6]),import.meta.url).then(({showExportModal:e})=>{e(r.persona)})}),document.addEventListener(`canary:prove-ownership`,e=>{let{personaId:t}=e.detail;X(async()=>{let{showProveOwnershipModal:e}=await import(`./linkage-proof-Dv0U3c6r.js`);return{showProveOwnershipModal:e}},__vite__mapDeps([9,10,11,1,4,5,12,8,13,14,6]),import.meta.url).then(({showProveOwnershipModal:e})=>{e(t)})}),document.addEventListener(`canary:archive-persona`,e=>{let{personaId:t}=e.detail,{personas:n}=f(),r=z(n,t);if(!r)return;function i(e,t){let n={};for(let[r,a]of Object.entries(e))a.id===t?n[r]={...a,archived:!0}:a.children&&Object.keys(a.children).length>0?n[r]={...a,children:i(a.children,t)}:n[r]=a;return n}u({personas:i(n,t)}),Y(`Archived "${r.persona.name}"`,`success`)}),document.addEventListener(`canary:rotate-persona`,e=>{let{personaId:t}=e.detail;X(async()=>{let{rotatePersona:e}=await import(`./persona-BPEQFwWF.js`).then(e=>e.u);return{rotatePersona:e}},__vite__mapDeps([11,1,10,4,5,12,8,13,14]),import.meta.url).then(({rotatePersona:e})=>{let{personas:n}=f(),r=z(n,t);if(!r)return;let i=e(t,r.persona.index);n[t]&&u({personas:{...n,[t]:i}}),Y(`Rotated "${r.persona.name}" to index ${i.index}`,`success`)})}),document.addEventListener(`canary:pin-enable`,e=>{let t=e.detail?.pin;!t||t.length<6||qr(t).then(()=>{u({settings:{...f().settings,pinEnabled:!0}}),rC()})}),document.addEventListener(`canary:pin-disable`,()=>{Jr().then(()=>{u({settings:{...f().settings,pinEnabled:!1}}),iC()})}),document.addEventListener(`canary:lock`,()=>{ne(),sr(),aC()}),document.addEventListener(`canary:sync-message`,e=>{let{groupId:t,message:n,sender:r}=e.detail,{activeGroupId:i}=f();if(n.type===`beacon`){if(t!==i)return;Wb(r,n.lat,n.lon,n.accuracy??2e4,n.timestamp)}else if(n.type===`duress-alert`){let e=n.subject||r,{identity:i}=f();if(i?.pubkey===e)return;F_(e,t,n.lat==null?void 0:{lat:n.lat,lon:n.lon},n.timestamp)}else n.type===`duress-clear`&&document.dispatchEvent(new CustomEvent(`canary:duress-clear`,{detail:{subject:n.subject,clearedBy:r,groupId:t}}))}),document.addEventListener(`canary:resync`,()=>void bC()),document.addEventListener(`canary:publish-persona-profile`,async e=>{let{personaId:t}=e.detail,n=f().personas[t];n&&await Gy(n)}),document.addEventListener(`canary:vault-publish-now`,()=>AC()),document.addEventListener(`canary:sync-vault`,()=>void jC()),document.addEventListener(`visibilitychange`,()=>{if(document.hidden){Kr(),AC();return}console.info(`[canary:boot] App foregrounded — reconnecting and syncing vault`),RS(),ug(),X(async()=>{let{disconnectRelays:e}=await import(`./connect-CR1o--Iy.js`).then(e=>e.n);return{disconnectRelays:e}},__vite__mapDeps([16,1,5,17]),import.meta.url).then(({disconnectRelays:e})=>{e(),bC()})})}async function vC(){let{identity:e}=f(),t=await xo({pubkey:e?.pubkey??``,privkey:e?.privkey}),n={pubkey:t.pubkey,privkey:t.privkey,displayName:e?.displayName??`You`,signerType:`local`};(!e||e.pubkey!==n.pubkey)&&u({identity:VS(n,e)})}function yC(){let{identity:e}=f();if(!e?.pubkey)return;let t=e.privkey?async t=>{let{decryptVault:n}=await X(async()=>{let{decryptVault:e}=await Promise.resolve().then(()=>xS);return{decryptVault:e}},void 0,import.meta.url);return n(t,e.privkey,e.pubkey)}:kh(e)?async t=>{try{return await Bh(e,e.pubkey,t,{interactive:!1})}catch{return null}}:null;t&&LS(e.pubkey,t,(e,t)=>{let{groups:n}=f(),r=zS(n,e,f().deletedGroupIds),i=Object.keys(r).length-Object.keys(n).length;(i>0||Object.entries(r).some(([e,t])=>{let r=n[e];return r?t.epoch!==r.epoch||t.counter!==r.counter:!0}))&&(u({groups:r}),Kr(),i>0?Y(`${i} new group(s) synced from another device`,`success`):Y(`Groups updated from another device`,`success`,2e3))})}async function bC(){let{groups:e,identity:t,settings:n}=f(),r=Object.keys(e).length,a=!!t?.privkey,o=[],s=[];for(let t of Object.values(e))o.push(...t.readRelays??[]),s.push(...t.writeRelays??[]),o.push(...t.relays??[]),s.push(...t.relays??[]);o.push(...n.defaultReadRelays??n.defaultRelays),s.push(...n.defaultWriteRelays??n.defaultRelays);let c=i(o),l=i(s),d=i([...c,...l]).length;if(d===0){console.warn(`[canary:boot] No relays found — sync disabled`),r>0&&Y(`Sync disabled — ${r} group(s), no relays configured`,`warning`,5e3);return}let p=kh(t);if(!a&&!p){console.warn(`[canary:boot] No privkey and no Signet signer — sync disabled`),Y(`Sync disabled — no private key`,`warning`,5e3);return}if(console.warn(`[canary:boot] Read relays:`,c,`Write relays:`,l),a){await ng(c,l);let{waitForConnection:n}=await X(async()=>{let{waitForConnection:e}=await import(`./connect-CR1o--Iy.js`).then(e=>e.n);return{waitForConnection:e}},__vite__mapDeps([16,1,5,17]),import.meta.url);await n(),console.info(`[canary:vault] Relay connections ready, fetching vault...`);try{let e=await MS(t.privkey,t.pubkey),n=e?.groups;if(console.info(`[canary:vault] Vault fetch result:`,n?`${Object.keys(n).length} group(s)`:`null`),n&&Object.keys(n).length>0){let{groups:e}=f(),t=zS(e,n,f().deletedGroupIds);if(Object.keys(e).sort().join(`,`)!==Object.keys(t).sort().join(`,`)||Object.entries(t).some(([t,n])=>{let r=e[t];return r?n.epoch!==r.epoch||n.counter!==r.counter||n.usageOffset!==r.usageOffset||n.members.length!==r.members.length:!0})){u({groups:t});let n=Object.keys(t).length-Object.keys(e).length;n>0?Y(`Restored ${n} group(s) from vault`,`success`):Y(`Synced from vault`,`success`,1500)}}if(e?.personas&&Object.keys(e.personas).length>0){let{personas:t}=f(),n={...t};for(let[t,r]of Object.entries(e.personas))n[t]?n[t]={...n[t],...r,npub:n[t].npub}:n[t]=r;u({personas:n})}}catch(e){console.warn(`[canary:vault] Vault fetch failed:`,e)}lg(),yC(),Y(`Syncing via ${d} relay(s)`,`success`,2e3),typeof Notification<`u`&&Notification.permission===`granted`&&X(async()=>{let{getExistingSubscription:e,registerWithPushServer:t}=await import(`./push-BYeuOIYg.js`);return{getExistingSubscription:e,registerWithPushServer:t}},[],import.meta.url).then(async({getExistingSubscription:t,registerWithPushServer:n})=>{let r=await t();if(r){let{hashGroupTag:t}=await X(async()=>{let{hashGroupTag:e}=await Promise.resolve().then(()=>aa);return{hashGroupTag:e}},void 0,import.meta.url),i=Object.values(e).map(e=>({tagHash:t(e.id),livenessInterval:e.livenessInterval}));await n(r,i),console.info(`[canary:push] Re-registered with push server, groups:`,i.length)}else console.warn(`[canary:push] Permission granted but no existing subscription found`)}).catch(e=>console.error(`[canary:push] Re-registration failed:`,e))}else if(p){let{connectRelays:e,waitForConnection:n}=await X(async()=>{let{connectRelays:e,waitForConnection:t}=await import(`./connect-CR1o--Iy.js`).then(e=>e.n);return{connectRelays:e,waitForConnection:t}},__vite__mapDeps([16,1,5,17]),import.meta.url);e(c,l);try{await n(),console.info(`[canary:vault] Signet vault sync starting...`);let e=await PS(t.pubkey,t,{interactive:!1}),r=e?.groups;if(console.info(`[canary:vault] Signet vault result:`,r?`${Object.keys(r).length} group(s)`:`null`),r&&Object.keys(r).length>0){let{groups:e}=f(),t=zS(e,r,f().deletedGroupIds);if(Object.keys(t).length!==Object.keys(e).length||Object.entries(t).some(([t,n])=>{let r=e[t];return r?n.epoch!==r.epoch||n.counter!==r.counter:!0})){u({groups:t});let n=Object.keys(t).length-Object.keys(e).length;n>0?Y(`Restored ${n} group(s) from vault`,`success`):Y(`Synced from vault`,`success`,1500)}}if(e?.personas&&Object.keys(e.personas).length>0){let{personas:t}=f(),n={...t};for(let[t,r]of Object.entries(e.personas))n[t]?n[t]={...n[t],...r,npub:n[t].npub}:n[t]=r;u({personas:n})}}catch(e){console.warn(`[canary:vault] Signet vault sync failed:`,e)}yC(),Y(`Connected to ${d} relay(s)`,`success`,2e3)}else{let{connectRelays:e}=await X(async()=>{let{connectRelays:e}=await import(`./connect-CR1o--Iy.js`).then(e=>e.n);return{connectRelays:e}},__vite__mapDeps([16,1,5,17]),import.meta.url);e(c,l),Y(`Connected to ${d} relay(s)`,`success`,2e3)}let{fetchOwnProfile:m}=await X(async()=>{let{fetchOwnProfile:e}=await Promise.resolve().then(()=>Ay);return{fetchOwnProfile:e}},void 0,import.meta.url);if(m(),lC(),a){let{startLivenessHeartbeat:e}=await X(async()=>{let{startLivenessHeartbeat:e}=await Promise.resolve().then(()=>Uh);return{startLivenessHeartbeat:e}},void 0,import.meta.url);e()}}function xC(e){return Array.from(e,e=>e.toString(16).padStart(2,`0`)).join(``)}function SC(e){let t=e.split(` `),n=document.getElementById(`recovery-phrase-modal`);n||(n=document.createElement(`dialog`),n.id=`recovery-phrase-modal`,n.className=`modal`,document.body.appendChild(n));let r=n;r.textContent=``;let i=document.createElement(`div`);i.className=`modal__form`,i.style.maxWidth=`420px`;let a=document.createElement(`h2`);a.className=`modal__title`,a.textContent=`Back up your recovery phrase`,i.appendChild(a);let o=document.createElement(`p`);o.className=`invite-hint`,o.textContent=`Write these words down in order. They're the only way to recover your account.`,i.appendChild(o);let s=document.createElement(`div`);s.className=`recovery-grid`,s.style.cssText=`display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin:1rem 0;`,t.forEach((e,t)=>{let n=document.createElement(`div`);n.style.cssText=`border:1px solid var(--border);border-radius:4px;padding:0.5rem;text-align:center;font-family:var(--font-mono,monospace);font-size:0.8rem;`;let r=document.createElement(`span`);r.style.cssText=`color:var(--text-muted);font-size:0.7rem;`,r.textContent=`${t+1}. `;let i=document.createElement(`span`);i.style.fontWeight=`500`,i.textContent=e,n.append(r,i),s.appendChild(n)}),i.appendChild(s);let c=document.createElement(`p`);c.className=`invite-hint`,c.style.cssText=`color:var(--duress);font-weight:500;`,c.textContent=`Do not share these words with anyone.`,i.appendChild(c);let l=document.createElement(`div`);l.className=`modal__actions`,l.style.gap=`0.5rem`;let u=document.createElement(`button`);u.id=`recovery-phrase-copy`,u.className=`btn btn--primary`,u.type=`button`,u.textContent=`Copy words`,u.addEventListener(`click`,async()=>{try{await navigator.clipboard.writeText(e),u.textContent=`Copied!`,setTimeout(()=>{u.textContent=`Copy words`},2e3),setTimeout(()=>{navigator.clipboard.writeText(``).catch(()=>{})},3e4)}catch{}});let d=document.createElement(`button`);d.id=`recovery-phrase-skip`,d.className=`btn`,d.type=`button`,d.textContent=`Skip for now`,d.addEventListener(`click`,()=>r.close()),l.append(u,d),i.appendChild(l),r.appendChild(i),r.showModal()}function CC(){let e=document.getElementById(`app`),t=ZS();$S(),e.innerHTML=`
    <div class="lock-screen">
      <h1 class="lock-screen__brand">CANARY</h1>
      <p class="lock-screen__hint">${t?`Secure group invitation`:`Deepfake-proof identity verification`}</p>

      <div class="login-panel">
        ${t?`
          <section class="login-invite">
            <p class="login-invite__label">${V(t.label)}</p>
            <p class="login-invite__title">${V(t.title)}</p>
            <p class="settings-hint">${V(t.hint)}</p>
          </section>
        `:``}

        <div class="login-options">
          <section class="login-card login-card--featured">
            <div>
              <p class="input-label__text">${t?`Join with Nostr`:`Connect with Nostr`}</p>
              <p class="settings-hint">${t?`Use Signet to keep your key in your signer while CANARY joins the group.`:`Sync groups across devices via relays.`}</p>
            </div>
            <button class="btn btn--primary login-card__action" id="login-signet" type="button">${V(t?.signetButton??`Sign in with Signet`)}</button>
          </section>

          <section class="login-card">
            <div>
              <p class="input-label__text">Quick Start</p>
              <p class="settings-hint">${V(t?.quickStartHint??`No Nostr account needed. Enter your name to get started.`)}</p>
            </div>
            <form id="offline-form" class="login-inline-form" autocomplete="off">
              <input class="input login-inline-form__input" type="text" id="offline-name" placeholder="Enter your name" required />
              <button class="btn btn--primary" type="submit">Start</button>
            </form>
          </section>
        </div>

        <details class="login-card login-details">
          <summary class="login-details__summary">Recover Account</summary>
          <div class="login-details__body">
            <div class="login-tabs">
              <button id="tab-recovery-phrase" type="button" class="btn btn--ghost btn--sm login-tabs__btn login-tabs__btn--active">Recovery Phrase</button>
              <button id="tab-shamir-shares" type="button" class="btn btn--ghost btn--sm login-tabs__btn">Shamir Shares</button>
            </div>

            <div id="panel-recovery-phrase">
              <p class="settings-hint">Paste your 12-word recovery phrase to restore your account.</p>
              <form id="mnemonic-login-form" class="login-stack-form" autocomplete="off">
                <textarea class="input login-secret-input" id="login-mnemonic" placeholder="Enter your 12 recovery words..." rows="3"></textarea>
                <button class="btn btn--primary" type="submit">Recover account</button>
              </form>
            </div>

            <div id="panel-shamir-shares" style="display: none;">
              <p class="settings-hint">Paste Shamir shares one at a time to reconstruct your recovery phrase.</p>
              <div class="login-stack-form">
                <textarea class="input login-secret-input" id="shamir-share-input" placeholder="Paste a Shamir share (word list)..." rows="3"></textarea>
                <button class="btn btn--primary" id="shamir-add-share" type="button">Add share</button>
                <p class="settings-hint login-status-text" id="shamir-status"></p>
                <ul id="shamir-share-list" class="login-share-list"></ul>
                <button class="btn btn--primary" id="shamir-recover" type="button" disabled>Recover</button>
              </div>
            </div>
          </div>
        </details>

        <details class="login-card login-details">
          <summary class="login-details__summary">Relays</summary>
          <div class="login-details__body">
            <p class="settings-hint login-relay-label">Choose which relays CANARY reads from and writes to.</p>
            <ul id="login-relay-list" class="login-relay-list">
              ${XS()}
            </ul>
            <div class="login-relay-add">
              <input class="input login-relay-add__input" type="url" id="login-relay-input" placeholder="wss://relay.example.com" />
              <button class="btn btn--ghost btn--sm" id="login-relay-add" type="button">Add</button>
              <button class="btn btn--ghost btn--sm" id="login-relay-reset" type="button">Reset</button>
            </div>
            <p class="settings-hint login-status-text" id="login-relay-status"></p>
          </div>
        </details>

      </div>
    </div>
  `,e.querySelector(`#offline-form`)?.addEventListener(`submit`,async t=>{t.preventDefault();let n=e.querySelector(`#offline-name`),r=n?.value.trim();if(!r){n?.focus();return}let{generateMnemonic:i}=await X(async()=>{let{generateMnemonic:e}=await Promise.resolve().then(()=>Tn);return{generateMnemonic:e}},void 0,import.meta.url),{wordlist:a}=await X(async()=>{let{wordlist:e}=await Promise.resolve().then(()=>Rn);return{wordlist:e}},void 0,import.meta.url),{restoreFromMnemonic:o}=await X(async()=>{let{restoreFromMnemonic:e}=await Promise.resolve().then(()=>Hn);return{restoreFromMnemonic:e}},void 0,import.meta.url),s=i(a),{root:c,defaultPersona:l}=o(s),d=Array.from(l.identity.privateKey,e=>e.toString(16).padStart(2,`0`)).join(``),f=Array.from(l.identity.publicKey,e=>e.toString(16).padStart(2,`0`)).join(``);c.destroy(),u({identity:{pubkey:f,privkey:d,mnemonic:s,signerType:`local`,displayName:r}}),await wC();let{publishKind0:p}=await X(async()=>{let{publishKind0:e}=await Promise.resolve().then(()=>Ay);return{publishKind0:e}},void 0,import.meta.url);p(r,d),SC(s)}),e.querySelector(`#mnemonic-login-form`)?.addEventListener(`submit`,async t=>{t.preventDefault();let n=e.querySelector(`#login-mnemonic`)?.value.trim();if(n){if(n.split(/\s+/).length!==12){alert(`Recovery phrase must be exactly 12 words.`);return}try{let{validateMnemonic:e,restoreFromMnemonic:t}=await X(async()=>{let{validateMnemonic:e,restoreFromMnemonic:t}=await Promise.resolve().then(()=>Hn);return{validateMnemonic:e,restoreFromMnemonic:t}},void 0,import.meta.url),{wordlist:r}=await X(async()=>{let{wordlist:e}=await Promise.resolve().then(()=>Rn);return{wordlist:e}},void 0,import.meta.url);if(!e(n,r)){alert(`Invalid recovery phrase. Please check your words and try again.`);return}let{root:i,defaultPersona:a}=t(n),o=Array.from(a.identity.privateKey,e=>e.toString(16).padStart(2,`0`)).join(``),s=Array.from(a.identity.publicKey,e=>e.toString(16).padStart(2,`0`)).join(``);i.destroy(),u({identity:{pubkey:s,privkey:o,mnemonic:n,signerType:`local`,displayName:`You`}}),await wC()}catch{alert(`Invalid recovery phrase.`)}}});let n=e.querySelector(`#tab-recovery-phrase`),r=e.querySelector(`#tab-shamir-shares`),a=e.querySelector(`#panel-recovery-phrase`),o=e.querySelector(`#panel-shamir-shares`);n.addEventListener(`click`,()=>{a.style.display=``,o.style.display=`none`,n.classList.add(`login-tabs__btn--active`),r.classList.remove(`login-tabs__btn--active`)}),r.addEventListener(`click`,()=>{a.style.display=`none`,o.style.display=``,r.classList.add(`login-tabs__btn--active`),n.classList.remove(`login-tabs__btn--active`)});let s=[],c=0;function l(){let t=e.querySelector(`#shamir-status`),n=e.querySelector(`#shamir-share-list`),r=e.querySelector(`#shamir-recover`);n.textContent=``;for(let e=0;e<s.length;e++){let t=document.createElement(`li`);t.className=`settings-hint`,t.style.cssText=`font-size: 0.75rem; padding: 0.125rem 0;`,t.textContent=`Share ${e+1} added`,n.appendChild(t)}if(s.length===0)t.textContent=``,r.disabled=!0;else if(s.length<c){let e=c-s.length;t.textContent=`Share ${s.length} added. Need ${e} more.`,r.disabled=!0}else t.textContent=`Ready to recover!`,r.disabled=!1}e.querySelector(`#shamir-add-share`)?.addEventListener(`click`,async()=>{let t=e.querySelector(`#shamir-share-input`),n=t.value.trim();if(n)try{let{wordsToShare:e}=await X(async()=>{let{wordsToShare:e}=await import(`./dist-EKXgOgNQ.js`);return{wordsToShare:e}},__vite__mapDeps([7,8]),import.meta.url),r=e(n.split(/\s+/));if(s.some(e=>e.id===r.id)){alert(`Share ${r.id} has already been added.`);return}if(s.length===0)c=r.threshold;else if(r.threshold!==c){alert(`Threshold mismatch: expected ${c}, got ${r.threshold}. Shares must be from the same set.`);return}s.push(r),t.value=``,l()}catch(e){alert(e instanceof Error?e.message:`Invalid share. Please check the words and try again.`)}}),e.querySelector(`#shamir-recover`)?.addEventListener(`click`,async()=>{if(!(s.length<c))try{let{reconstructSecret:e}=await X(async()=>{let{reconstructSecret:e}=await import(`./dist-EKXgOgNQ.js`);return{reconstructSecret:e}},__vite__mapDeps([7,8]),import.meta.url),t=e(s,c),n=new TextDecoder().decode(t),{validateMnemonic:r,restoreFromMnemonic:i}=await X(async()=>{let{validateMnemonic:e,restoreFromMnemonic:t}=await Promise.resolve().then(()=>Hn);return{validateMnemonic:e,restoreFromMnemonic:t}},void 0,import.meta.url),{wordlist:a}=await X(async()=>{let{wordlist:e}=await Promise.resolve().then(()=>Rn);return{wordlist:e}},void 0,import.meta.url);if(!r(n,a)){alert(`Reconstructed phrase is not a valid mnemonic. Please check your shares.`);return}let{root:o,defaultPersona:l}=i(n),d=Array.from(l.identity.privateKey,e=>e.toString(16).padStart(2,`0`)).join(``),f=Array.from(l.identity.publicKey,e=>e.toString(16).padStart(2,`0`)).join(``);o.destroy(),u({identity:{pubkey:f,privkey:d,mnemonic:n,signerType:`local`,displayName:`You`}}),await wC()}catch(e){alert(e instanceof Error?e.message:`Failed to reconstruct secret from shares.`)}}),e.querySelector(`#login-signet`)?.addEventListener(`click`,async()=>{try{let e=f().identity,t=await Ph({theme:document.documentElement.getAttribute(`data-theme`)===`light`?`light`:`dark`,displayNameFallback:e?.displayName??`You`});if(!t)return;u({identity:VS(t,e)}),await wC()}catch(e){alert(e instanceof Error?e.message:`Signet rejected the request.`)}});function d(){let t=e.querySelector(`#login-relay-list`);t&&(t.innerHTML=XS(),m())}function p(t){let n=e.querySelector(`#login-relay-status`);n&&(n.textContent=t)}function m(){e.querySelectorAll(`[data-relay-toggle]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.relayToggle;if(!t)return;let n=GS(t)===`off`?`readwrite`:`off`;KS(t,n),p(n===`off`?`Disabled ${YS(t)}.`:`Enabled ${YS(t)}.`),d()})}),e.querySelectorAll(`[data-relay-mode]`).forEach(e=>{e.addEventListener(`change`,()=>{let t=e.dataset.relayMode;if(!t)return;let n=e.value===`read`?`read`:`readwrite`;KS(t,n),p(`${YS(t)} set to ${n===`read`?`read only`:`read/write`}.`),d()})}),e.querySelectorAll(`[data-relay-delete]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.relayDelete;t&&(qS(t),p(`Deleted ${YS(t)}.`),d())})})}m(),e.querySelector(`#login-relay-add`)?.addEventListener(`click`,()=>{let t=e.querySelector(`#login-relay-input`),n=t?.value.trim(),r=n?i([n])[0]??n:``;!r||!BS(r)||(KS(r,`readwrite`),p(`Added ${YS(r)}.`),d(),t&&(t.value=``))}),e.querySelector(`#login-relay-reset`)?.addEventListener(`click`,()=>{JS(),p(`Restored bundled relays.`),d()}),e.querySelector(`#login-relay-input`)?.addEventListener(`keydown`,t=>{t.key===`Enter`&&(t.preventDefault(),e.querySelector(`#login-relay-add`)?.click())})}async function wC(){{let{identity:e,personas:t}=f();e?.privkey&&(Object.keys(t).length>0?te(e,t):se(e))}oC(),window.location.hash===`#call`&&u({view:`call-demo`});let e=document.getElementById(`header`);e&&Tg(e),sC(),document.getElementById(`footer-sync-btn`)?.addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`canary:sync-vault`))}),uC(),d(lC),d(kC),_C(),fC(),window.addEventListener(`hashchange`,()=>fC()),bC(),Ky().catch(()=>{})}function TC(e){let t=document.getElementById(`notification-prompt`);t&&t.remove();let n=document.createElement(`div`);n.id=`notification-prompt`,n.className=`notification-prompt`;let r=document.createElement(`div`);r.className=`notification-prompt__text`;let i=document.createElement(`strong`);i.textContent=`Enable notifications?`;let a=document.createElement(`span`);a.textContent=`We’ll alert you in emergencies and remind you to check in.`,r.append(i,a);let o=document.createElement(`div`);o.className=`notification-prompt__actions`;let s=document.createElement(`button`);s.className=`btn btn--sm btn--primary`,s.textContent=`Enable`;let c=document.createElement(`button`);c.className=`btn btn--sm`,c.textContent=`Not now`,o.append(s,c),n.append(r,o),document.getElementById(`app`)?.appendChild(n),s.addEventListener(`click`,()=>{n.remove(),e()}),c.addEventListener(`click`,()=>n.remove())}function EC(){let e=document.getElementById(`notification-prompt`);e&&e.remove();let t=document.createElement(`div`);t.id=`notification-prompt`,t.className=`notification-prompt`;let n=document.createElement(`div`);n.className=`notification-prompt__text`;let r=document.createElement(`strong`);r.textContent=`Add to Home Screen`;let i=document.createElement(`span`);i.textContent=`To receive emergency alerts and liveness reminders, add CANARY to your home screen. Tap the share button, then "Add to Home Screen".`,n.append(r,i);let a=document.createElement(`div`);a.className=`notification-prompt__actions`;let o=document.createElement(`button`);o.className=`btn btn--sm`,o.textContent=`Got it`,a.append(o),t.append(n,a),document.getElementById(`app`)?.appendChild(t),o.addEventListener(`click`,()=>t.remove())}var DC=null,OC=3e4;function kC(){let{identity:e,groups:t}=f();e?.pubkey&&Ah(e)&&Object.keys(t).length!==0&&(DC&&clearTimeout(DC),DC=setTimeout(()=>{let{identity:e,groups:t,personas:n,deletedGroupIds:r}=f();!e?.pubkey||Object.keys(t).length===0||(e.privkey?jS(t,e.privkey,e.pubkey,n,r):kh(e)&&NS(t,e.pubkey,n,r,e,{interactive:!1}))},OC))}function AC(){DC&&clearTimeout(DC);let{identity:e,groups:t,personas:n,deletedGroupIds:r}=f();!e?.pubkey||Object.keys(t).length===0||(e.privkey?jS(t,e.privkey,e.pubkey,n,r):kh(e)?NS(t,e.pubkey,n,r,e,{interactive:!1}):null)?.then(()=>console.info(`[canary:vault] Vault published OK`)).catch(e=>{console.error(`[canary:vault] Vault publish FAILED:`,e),Y(`Vault publish failed: ${e instanceof Error?e.message:e}`,`error`)})}async function jC(){let{identity:e,groups:t,personas:n}=f();if(!e?.pubkey){Y(`No identity — cannot sync`,`error`);return}if(!Ah(e)){Y(`No private key or Signet signer — cannot sync`,`error`);return}let r=kh(e),i=e.pubkey.slice(0,8);Y(`Syncing as ${i}\u2026${r?` (${Mh(e)})`:``}`,`info`,3e3),console.info(`[canary:vault] Manual sync for pubkey ${i} (${r?Mh(e):`local key`})`);try{let{deletedGroupIds:a}=f();Object.keys(t).length>0&&(r?await NS(t,e.pubkey,n,a,e,{interactive:!0}):await jS(t,e.privkey,e.pubkey,n,a));let{waitForConnection:o}=await X(async()=>{let{waitForConnection:e}=await import(`./connect-CR1o--Iy.js`).then(e=>e.n);return{waitForConnection:e}},__vite__mapDeps([16,1,5,17]),import.meta.url);await o();let s=r?await PS(e.pubkey,e,{interactive:!0}):await MS(e.privkey,e.pubkey),c=s?.groups;if(c&&Object.keys(c).length>0){let{groups:e}=f(),t=zS(e,c,f().deletedGroupIds),n=Object.keys(t).length-Object.keys(e).length;u({groups:t}),Kr(),n>0?Y(`Synced — ${n} new group(s) restored`,`success`):Y(`Groups are in sync`,`success`,2e3)}else Y(`No vault found for ${i}\u2026 — are both devices using the same identity?`,`warning`,5e3);if(s?.personas&&Object.keys(s.personas).length>0){let{personas:e}=f(),t={...e};for(let[e,n]of Object.entries(s.personas))t[e]?t[e]={...t[e],...n,npub:t[e].npub}:t[e]=n;u({personas:t})}}catch(e){console.error(`[canary:vault] Manual sync failed:`,e),Y(`Sync failed: ${e instanceof Error?e.message:e}`,`error`)}}window.addEventListener(`pagehide`,()=>{DC&&AC()});async function MC(){if(Lr())aC();else{Br();let{identity:e}=f();e?.pubkey?await wC():CC()}}document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,()=>{MC()}):MC();export{zn as i,fg as n,As as r,vy as t};