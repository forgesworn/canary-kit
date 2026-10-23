import Foundation
import CoreNFC

final class NfcCarrier:NSObject,NFCTagReaderSessionDelegate {
 static var available:Bool {NFCTagReaderSession.readingAvailable}
 private let code:()->String?,peer:(String)->Void,state:(String)->Void
 private var reader:NFCTagReaderSession?,tag:NFCISO7816Tag?,revision=0
 private let delivery=NfcDelivery()
 init(code:@escaping()->String?,peer:@escaping(String)->Void,state:@escaping(String)->Void){self.code=code;self.peer=peer;self.state=state}
 func start()throws {
  guard Self.available else{throw NativeError.message("NFC is unavailable here. Use nearby Bluetooth or the camera.")}
  stopReader();let value=NFCTagReaderSession(pollingOption:.iso14443,delegate:self,queue:.main)
  reader=value;value?.alertMessage="Hold the top of your iPhone near an Android phone with Vouch Connect open.";value?.begin()
 }
 private func trace(_ event:String){
  #if DEBUG
  print("Vouch NFC \(event)")
  #endif
 }
 func tagReaderSessionDidBecomeActive(_ session:NFCTagReaderSession){trace("reader active")}
 func tagReaderSession(_ session:NFCTagReaderSession,didInvalidateWithError error:Error){trace("reader invalidated code=\((error as NSError).code)");if reader===session{reader=nil;tag=nil;revision+=1;state("NFC paused. Your setup is saved. Try the tap again or use Bluetooth.")}}
 func tagReaderSession(_ session:NFCTagReaderSession,didDetect tags:[NFCTag]){
  guard reader===session else{return}
  trace("tag detected")
  guard tags.count==1,case .iso7816(let found)=tags[0] else{session.alertMessage="Use one Android phone with Vouch Connect open.";session.restartPolling();return}
  let stamp=revision
  session.connect(to:tags[0]){[weak self] error in
   guard let self=self,self.reader===session,self.revision==stamp else{return}
   guard error==nil else{session.restartPolling();return};self.tag=found
   self.send(PublicCode.select,to:found,stamp:stamp){[weak self] response in
    guard let self=self else{return}
    if response==Data([0x90,0]){self.trace("public service selected");self.exchange(found,stamp:stamp,count:0)}else{self.trace("public service selection failed");session.invalidate(errorMessage:"This is not a Vouch connection. Keep Connect open on the Android phone.")}
   }
  }
 }
 private func send(_ data:Data,to tag:NFCISO7816Tag,stamp:Int,completion:@escaping(Data?)->Void){
  guard let apdu=NFCISO7816APDU(data:data),reader != nil,revision==stamp else{return}
  tag.sendCommand(apdu:apdu){[weak self] bytes,sw1,sw2,error in DispatchQueue.main.async{
   guard let self=self,self.reader != nil,self.revision==stamp else{return};completion(error==nil ? bytes+Data([sw1,sw2]):nil)
  }}
 }
 private func exchange(_ found:NFCISO7816Tag,stamp:Int,count:Int){
  guard revision==stamp,count<240,let sent=code(),PublicCode.valid(sent) else{return}
  send(PublicCode.exchange(sent),to:found,stamp:stamp){[weak self] response in
   guard let self=self else{return}
   guard let response=response,let value=PublicCode.response(response) else{self.reader?.invalidate(errorMessage:"Keep the phones together and try NFC again. Your setup is saved.");return}
   self.peer(value)
   if self.delivery.delivered(sent){self.reader?.alertMessage="Compare the four words on both phones.";self.stopReader();return}
   DispatchQueue.main.asyncAfter(deadline:.now()+0.25){[weak self] in self?.exchange(found,stamp:stamp,count:count+1)}
  }
 }
 func finishAfterSending(_ code:String){delivery.finishAfterSending(code)}
 private func stopReader(){revision+=1;let value=reader;reader=nil;tag=nil;value?.invalidate()}
 func stop(){stopReader();delivery.reset()}
}
