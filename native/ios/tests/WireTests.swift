import Foundation
@main struct WireTests {
 static func main() throws {
  let data=try Data(contentsOf:URL(fileURLWithPath:CommandLine.arguments[1]))
  let v=try JSONSerialization.jsonObject(with:data) as! [String:String]
  let card=v["card"]!,reveal=v["reveal"]!
  precondition(PublicCode.service==v["service"] && PublicCode.card==v["characteristic"])
  precondition(PublicCode.valid(card)&&PublicCode.valid(reveal))
  for invalid in [card+"x",card.lowercased(),"wallet secret",String(repeating:"a",count:2048)] {precondition(!PublicCode.valid(invalid))}
  precondition(PublicCode.select.map{String(format:"%02x",$0)}.joined()==v["select"])
  precondition(PublicCode.exchange(card).map{String(format:"%02x",$0)}.joined()==v["exchange"])
  precondition(PublicCode.response(Data(card.utf8)+Data([0x90,0]))==card)
  precondition(PublicCode.response(Data(card.utf8)+Data([0x6a,0x80]))==nil)
  let delivery=NfcDelivery()
  precondition(!delivery.delivered(card))
  delivery.finishAfterSending(reveal)
  precondition(!delivery.delivered(card)) // A response can arrive before our reveal has left.
  precondition(delivery.delivered(reveal))
  delivery.reset();precondition(!delivery.delivered(reveal))
  for stage in 0..<4 {
   let loop=BleReadLoop(now:0)
   if stage>0{precondition(loop.connected(1))}
   if stage>1{precondition(loop.services(2))}
   if stage>2{precondition(loop.ready(3))}
   precondition(loop.tick(100) == .none)
   precondition(loop.tick(9_000) == .close)
  }
  let retry=BleReadLoop(now:0)
  precondition(retry.connected(1));precondition(retry.ready(2))
  precondition(retry.received(false,3));precondition(retry.tick(600) == .none)
  precondition(retry.tick(703) == .read);precondition(retry.received(false,704))
  precondition(retry.tick(2104) == .read);precondition(retry.received(false,2105))
  precondition(retry.tick(2105) == .close)
  let reset=BleReadLoop(now:0)
  precondition(!reset.ready(1));precondition(reset.connected(2));precondition(!reset.connected(3))
  precondition(reset.ready(4));precondition(reset.received(false,5));precondition(!reset.received(true,6))
  precondition(reset.tick(705) == .read);precondition(reset.received(true,706))
  precondition(reset.tick(1155) == .none);precondition(reset.tick(1156) == .read)
  reset.close();precondition(!reset.received(true,1157))
  precondition(reset.tick(1158) == .close)
  print("Swift public-code, NFC APDU and BLE stalled-read recovery checks passed.")
 }
}
