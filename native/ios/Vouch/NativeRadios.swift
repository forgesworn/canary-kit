import Foundation

final class NativeRadios {
 private let emit:([String:Any])->Void
 private(set) var session:String?,code:String?
 private var nfc:NfcCarrier?,ble:NearbyCarrier?,deadline:DispatchWorkItem?,frames=0
 var bluetoothEnabled:Bool {!ProcessInfo.processInfo.arguments.contains("--nfc-only")}
 init(emit:@escaping([String:Any])->Void){self.emit=emit}
 func start(_ args:[String:Any])throws {
  guard let id=args["session"] as? String,id.range(of:"^[0-9a-f]{32}$",options:.regularExpression) != nil,let value=args["code"] as? String,PublicCode.valid(value) else{throw NativeError.message("Invalid public connection session.")}
  stopAll();session=id;code=value;frames=0
  nfc=NfcCarrier(code:{[weak self] in self?.code},peer:{[weak self] value in self?.peer(value,"nfc")},state:{[weak self] value in self?.state(value)})
  if bluetoothEnabled {ble=NearbyCarrier(code:{[weak self] in self?.code},peer:{[weak self] value in self?.peer(value,"ble")},state:{[weak self] value in self?.state(value)})}
  else{state("NFC-only device test. Start the tap on this iPhone while the Android stays on Connect.")}
  let stop=DispatchWorkItem{[weak self] in guard let self=self,self.session==id else{return};self.stopAll();print("Vouch nearby session paused at activity limit");self.emit(["v":1,"event":"paused","session":id,"message":"Nearby paused. Your encrypted setup is saved. Tap Try nearby again."])}
  deadline=stop;DispatchQueue.main.asyncAfter(deadline:.now()+60,execute:stop)
 }
 func update(_ args:[String:Any])throws {
  guard let id=args["session"] as? String,id==session,let value=args["code"] as? String,PublicCode.valid(value) else{throw NativeError.message("Nearby was paused. Tap Try nearby again.")}
  code=value
  if args["complete"] as? Bool==true{nfc?.finishAfterSending(value);ble?.finishReading();state("Compare all four words together before saving.")}
 }
 func read(_ id:String?)throws {guard let id=id,id==session else{throw NativeError.message("Resume Connect first.")};try nfc?.start()}
 private func peer(_ value:String,_ via:String){guard let id=session,PublicCode.valid(value) else{return};frames+=1;if frames>256{stopAll();emit(["v":1,"event":"paused","session":id,"message":"Nearby paused. Tap Try nearby again to resume your saved setup."]);return}
  #if DEBUG
  if frames<=3{print("Vouch public peer frame received via \(via)")}
  #endif
  emit(["v":1,"event":"peer","session":id,"code":value,"via":via])}
 private func state(_ message:String){if let id=session{emit(["v":1,"event":"status","session":id,"message":message])}}
 func stop(_ id:String?){if id==session{stopAll()}}
 func stopAll(){session=nil;code=nil;deadline?.cancel();deadline=nil;nfc?.stop();nfc=nil;ble?.stop();ble=nil}
}
