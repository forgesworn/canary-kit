import { describe, expect, it } from 'vitest'
import qrcode from 'qrcode-generator'
import jsQR from 'jsqr'
import { beginConnect, acceptConnect, finishConnect } from './connect.js'
import { newDeviceRequest, deviceToken, makeDeviceCopy, openDeviceCopy } from './device-transfer.js'
import { joinPair } from './model.js'
import { encodeOptical, readOptical, opticalFrames, createOpticalFrameReader, encodeBase45, decodeBase45 } from './optical.js'

describe('bounded optical transfers adapted from Signet', () => {
  it('retains the RFC 9285 Base45 vectors', () => {
    expect(encodeBase45(new TextEncoder().encode('Hello!!'))).toBe('%69 VD92EX0')
    expect(new TextDecoder().decode(decodeBase45('%69 VD92EX0')!)).toBe('Hello!!')
  })
  it('carries public offers and encrypted replies without changing the pairing profile', () => {
    const offer=beginConnect('Video friend'),accepted=acceptConnect(offer.invite)
    for(const value of [offer.invite,accepted.reply]){
      const code=encodeOptical({kind:'connection',value}),frames=opticalFrames(code,true),reader=createOpticalFrameReader()
      let result:string|null=null
      for(const frame of frames.reverse())result=reader(frame,0)
      expect(readOptical(result!)).toEqual({kind:'connection',value})
    }
    expect(finishConnect(offer,accepted.reply).mnemonic).toBe(accepted.pair.mnemonic)
    const extra=JSON.stringify({...JSON.parse(offer.invite),secret:'must-not-travel'})
    expect(readOptical(encodeOptical({kind:'connection',value:extra})).value).not.toContain('must-not-travel')
  })
  it('carries only a public receiving request and a recipient-encrypted people copy', () => {
    const receive=newDeviceRequest(),pair=joinPair('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about')
    const copy=makeDeviceCopy(receive.request,[{id:'test-person',label:'Private name',pair}])
    for(const payload of [{kind:'device-request' as const,value:deviceToken(receive.request)},{kind:'device-copy' as const,value:copy.file}]){
      const raw=encodeOptical(payload),reader=createOpticalFrameReader();let result:string|null=null
      for(const frame of opticalFrames(raw,true))result=reader(frame,0)
      expect(readOptical(result!)).toEqual(payload)
      expect(raw).not.toContain(pair.mnemonic)
    }
    expect(openDeviceCopy(receive,copy.file)[0].label).toBe('Private name')
    expect(()=>encodeOptical({kind:'device-copy',value:JSON.stringify({entries:[{pair}]})})).toThrow()
  })
  it('uses coarse QR frames that the camera decoder can read from actual pixels', () => {
    const raw=encodeOptical({kind:'connection',value:beginConnect('Video').invite}),reader=createOpticalFrameReader()
    let result:string|null=null
    for(const frame of opticalFrames(raw,true)){
      const qr=qrcode(0,'M');qr.addData(frame,'Alphanumeric');qr.make();const modules=qr.getModuleCount()
      expect(modules).toBeLessThanOrEqual(41)
      const size=(modules+8)*4,pixels=new Uint8ClampedArray(size*size*4).fill(255)
      for(let y=0;y<modules;y++)for(let x=0;x<modules;x++)if(qr.isDark(y,x))for(let dy=0;dy<4;dy++)for(let dx=0;dx<4;dx++){
        const p=(((y+4)*4+dy)*size+(x+4)*4+dx)*4;pixels[p]=pixels[p+1]=pixels[p+2]=0
      }
      const decoded=jsQR(pixels,size,size);expect(decoded?.data).toBe(frame);result=reader(decoded!.data,0)
    }
    expect(result).toBe(raw)
  })
  it('rejects mixed, damaged, contradictory and expired assemblies and oversized transfers', () => {
    const frames=opticalFrames(encodeOptical({kind:'connection',value:beginConnect('First').invite}),true)
    const other=opticalFrames(encodeOptical({kind:'connection',value:beginConnect('Second').invite}),true)
    const reader=createOpticalFrameReader();expect(reader(frames[0],0)).toBeNull()
    for(const f of other.slice(1))expect(reader(f,1)).toBeNull()
    const corrupt=createOpticalFrameReader()
    for(const f of frames.slice(0,-1))corrupt(f,0)
    expect(corrupt(frames.at(-1)!.slice(0,-1)+'!',1)).toBeNull()
    const expired=createOpticalFrameReader();expired(frames[0],0)
    for(const f of frames.slice(1))expect(expired(f,180_001)).toBeNull()
    expect(()=>opticalFrames('VQP1:'+'A'.repeat(8192),true)).toThrow()
    expect(()=>readOptical('wallet secret')).toThrow()
  })
})
