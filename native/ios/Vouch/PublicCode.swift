import Foundation

// The SELECT/exchange framing is adapted from My Signet's MIT-licensed
// HandshakeApdu (aa663efb). Vouch has its own AID and public-token profile.
enum PublicCode {
 static let aid="F043565543483031"
 static let service="c7f6c891-0c38-4c2b-909b-c91d837f1893",card="c7f6c892-0c38-4c2b-909b-c91d837f1893"
 static let aidBytes=Data([0xf0,0x43,0x56,0x55,0x43,0x48,0x30,0x31])
 static let select=Data([0,0xa4,4,0,8])+aidBytes+Data([0])
 static func valid(_ value:String)->Bool {
  guard value.utf8.count<=186,value.range(of:"^CANARY-MEET:1:[A-Za-z0-9_-]{107}(:[A-Za-z0-9_-]{64})?$",options:.regularExpression) != nil else{return false}
  let parts=value.split(separator:":");return decode(String(parts[2]),80) && (parts.count==3 || decode(String(parts[3]),48))
 }
 private static func decode(_ value:String,_ count:Int)->Bool {
  var encoded=value.replacingOccurrences(of:"-",with:"+").replacingOccurrences(of:"_",with:"/")
  encoded+=String(repeating:"=",count:(4-encoded.count%4)%4)
  guard let bytes=Data(base64Encoded:encoded),bytes.count==count else{return false}
  return bytes.base64EncodedString().replacingOccurrences(of:"+",with:"-").replacingOccurrences(of:"/",with:"_").replacingOccurrences(of:"=",with:"")==value
 }
 static func exchange(_ code:String)->Data {precondition(valid(code));return Data([0x80,0x10,0,0,UInt8(code.utf8.count)])+Data(code.utf8)+Data([0])}
 static func response(_ bytes:Data)->String? {
  guard bytes.count>=2,bytes.suffix(2)==Data([0x90,0]),let code=String(data:bytes.dropLast(2),encoding:.ascii),valid(code) else{return nil};return code
 }
}

// A local comparison result does not mean the other phone received our reveal.
final class NfcDelivery {
 private var finalCode:String?
 func finishAfterSending(_ code:String){finalCode=code}
 func delivered(_ sent:String)->Bool {finalCode==sent}
 func reset(){finalCode=nil}
}
