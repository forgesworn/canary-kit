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
  print("Swift public-code grammar and NFC APDU golden vectors passed.")
 }
}
