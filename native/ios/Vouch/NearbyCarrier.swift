import Foundation
import CoreBluetooth

final class NearbyCarrier:NSObject,CBCentralManagerDelegate,CBPeripheralManagerDelegate,CBPeripheralDelegate {
 private static let service=CBUUID(string:PublicCode.service),card=CBUUID(string:PublicCode.card)
 private let code:()->String?,peer:(String)->Void,state:(String)->Void
 private var central:CBCentralManager!,peripheral:CBPeripheralManager!
 private final class Link {
  let peripheral:CBPeripheral,loop:BleReadLoop
  var card:CBCharacteristic?
  init(_ value:CBPeripheral){peripheral=value;loop=BleReadLoop(now:ProcessInfo.processInfo.systemUptime*1000)}
 }
 private var peers:[UUID:Link]=[:],snapshots:[UUID:Data]=[:],cooldown:[UUID:Double]=[:]
 private var running=true,reading=true,serviceAdded=false
 private var monitor:Timer?
 private var traceBudget=24
 private var now:Double{ProcessInfo.processInfo.systemUptime*1000}
 private func trace(_ stage:String){
  #if DEBUG
  if traceBudget>0{traceBudget-=1;print("Vouch BLE \(stage)")}
  #endif
 }
 init(code:@escaping()->String?,peer:@escaping(String)->Void,state:@escaping(String)->Void){
  self.code=code;self.peer=peer;self.state=state;super.init()
  central=CBCentralManager(delegate:self,queue:.main,options:[CBCentralManagerOptionShowPowerAlertKey:true]);peripheral=CBPeripheralManager(delegate:self,queue:.main)
  monitor=Timer.scheduledTimer(withTimeInterval:0.15,repeats:true){[weak self] _ in self?.tick()}
 }
 private func tick(){
  guard running,reading else{return}
  for link in Array(peers.values){switch link.loop.tick(now){
   case .read:if let card=link.card{link.peripheral.readValue(for:card)}else{close(link)}
   case .close:trace("operation timeout or repeated read failure");close(link)
   case .none:break
  }}
 }
 private func current(_ found:CBPeripheral)->Link?{guard running,reading,let link=peers[found.identifier],link.peripheral===found else{return nil};return link}
 private func close(_ link:Link){
  let id=link.peripheral.identifier
  guard peers[id]===link else{return}
  peers.removeValue(forKey:id);link.loop.close();cooldown[id]=now+1000
  if cooldown.count>16,let oldest=cooldown.min(by:{$0.value<$1.value})?.key{cooldown.removeValue(forKey:oldest)}
  central.cancelPeripheralConnection(link.peripheral)
 }
 func centralManagerDidUpdateState(_ value:CBCentralManager){
  guard running else{return}
  trace("central state=\(value.state.rawValue)")
  if value.state == .poweredOn{if reading{value.scanForPeripherals(withServices:[Self.service],options:[CBCentralManagerScanOptionAllowDuplicatesKey:true]);state("Looking for the other Vouch phone nearby. Keep both phones on Connect.")}}
  else{
   for link in Array(peers.values){close(link)}
   if value.state == .unauthorized{state("Bluetooth permission is unavailable. Use NFC or the camera.")}
   else if value.state == .poweredOff{state("Turn Bluetooth on, or use an NFC tap or camera.")}
  }
 }
 func peripheralManagerDidUpdateState(_ value:CBPeripheralManager){
  guard running else{return}
  trace("peripheral state=\(value.state.rawValue)")
  if value.state == .poweredOn,!serviceAdded{
   serviceAdded=true
   let service=CBMutableService(type:Self.service,primary:true);service.characteristics=[CBMutableCharacteristic(type:Self.card,properties:[.read],value:nil,permissions:[.readable])];value.add(service)
  }else if value.state != .poweredOn{serviceAdded=false;snapshots.removeAll()}
 }
 func peripheralManager(_ value:CBPeripheralManager,didAdd service:CBService,error:Error?){
  guard running else{return};trace("service added; success=\(error==nil)")
  if error==nil{value.startAdvertising([CBAdvertisementDataServiceUUIDsKey:[Self.service]])}
  else{serviceAdded=false;state("Bluetooth service unavailable. Try nearby again or use the camera.")}
 }
 func peripheralManagerDidStartAdvertising(_ value:CBPeripheralManager,error:Error?){if running{trace("advertising ready=\(error==nil)");if error != nil{state("Bluetooth advertising unavailable. Try nearby again or use the camera.")}}}
 func peripheralManager(_ value:CBPeripheralManager,didReceiveRead request:CBATTRequest){
  guard running,request.characteristic.uuid==Self.card else{value.respond(to:request,withResult:.readNotPermitted);return}
  if request.offset==0{
   guard let current=code(),PublicCode.valid(current),snapshots[request.central.identifier] != nil || snapshots.count<2 else{value.respond(to:request,withResult:.unlikelyError);return}
   snapshots[request.central.identifier]=Data(current.utf8)
  }
  guard let bytes=snapshots[request.central.identifier],request.offset>=0,request.offset<=bytes.count else{value.respond(to:request,withResult:.invalidOffset);return}
  request.value=Data(bytes.dropFirst(request.offset));value.respond(to:request,withResult:.success)
 }
 func centralManager(_ value:CBCentralManager,didDiscover found:CBPeripheral,advertisementData:[String:Any],rssi:NSNumber){
  guard running,reading,rssi.intValue >= -85,rssi.intValue<=0,peers.count<2,peers[found.identifier]==nil,(cooldown[found.identifier] ?? 0)<=now else{return}
  trace("peer discovered");peers[found.identifier]=Link(found);found.delegate=self;value.connect(found)
 }
 func centralManager(_ value:CBCentralManager,didConnect found:CBPeripheral){
  if running,!reading,peers[found.identifier]?.peripheral===found{return}
  guard let link=current(found) else{value.cancelPeripheralConnection(found);return}
  if link.loop.connected(now){trace("connected; discovering service");state("Connecting over Bluetooth. Keep both phones on Connect.");found.discoverServices([Self.service])}
 }
 func centralManager(_ value:CBCentralManager,didFailToConnect found:CBPeripheral,error:Error?){if let link=current(found){close(link)}}
 func centralManager(_ value:CBCentralManager,didDisconnectPeripheral found:CBPeripheral,error:Error?){if let link=current(found){close(link)}}
 func peripheral(_ found:CBPeripheral,didDiscoverServices error:Error?){
  guard let link=current(found) else{return}
  guard error==nil,let service=found.services?.first(where:{$0.uuid==Self.service}) else{close(link);return}
  if link.loop.services(now){found.discoverCharacteristics([Self.card],for:service)}
 }
 func peripheral(_ found:CBPeripheral,didDiscoverCharacteristicsFor service:CBService,error:Error?){
  guard let link=current(found) else{return}
  guard error==nil,let card=service.characteristics?.first(where:{$0.uuid==Self.card&&$0.properties.contains(.read)}) else{close(link);return}
  if link.loop.ready(now){link.card=card;trace("public service ready");found.readValue(for:card)}
 }
 func peripheral(_ found:CBPeripheral,didUpdateValueFor characteristic:CBCharacteristic,error:Error?){
  guard let link=current(found),characteristic.uuid==Self.card else{return}
  let data=characteristic.value
  let value=(data?.count ?? 187)<=186 ? data.flatMap{String(data:$0,encoding:.ascii)}:nil
  let valid=error==nil && value.map{PublicCode.valid($0)}==true
  if link.loop.received(valid,now){trace(valid ? "complete public frame read":"read failed; retry scheduled");if valid,let value=value{peer(value)}}
 }
 func finishReading(){
  reading=false;monitor?.invalidate();monitor=nil;central?.stopScan()
  for link in peers.values{link.loop.close()}
  // Keep established connections, advertising and snapshots for the slower
  // peer; cancelling a central can disrupt its reads on a shared LE link.
 }
 func stop(){running=false;finishReading();for link in Array(peers.values){close(link)};peripheral?.stopAdvertising();peripheral?.removeAllServices();snapshots.removeAll();cooldown.removeAll()}
}
