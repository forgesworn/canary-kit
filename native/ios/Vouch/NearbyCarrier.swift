import Foundation
import CoreBluetooth

final class NearbyCarrier:NSObject,CBCentralManagerDelegate,CBPeripheralManagerDelegate,CBPeripheralDelegate {
 private static let service=CBUUID(string:PublicCode.service),card=CBUUID(string:PublicCode.card)
 private let code:()->String?,peer:(String)->Void,state:(String)->Void
 private var central:CBCentralManager!,peripheral:CBPeripheralManager!
 private var peers:[UUID:CBPeripheral]=[:],snapshots:[UUID:Data]=[:]
 private var running=true,reading=true
 init(code:@escaping()->String?,peer:@escaping(String)->Void,state:@escaping(String)->Void){
  self.code=code;self.peer=peer;self.state=state;super.init()
  central=CBCentralManager(delegate:self,queue:.main,options:[CBCentralManagerOptionShowPowerAlertKey:true]);peripheral=CBPeripheralManager(delegate:self,queue:.main)
 }
 func centralManagerDidUpdateState(_ value:CBCentralManager){
  guard running else{return}
  if value.state == .poweredOn,reading{value.scanForPeripherals(withServices:[Self.service],options:[CBCentralManagerScanOptionAllowDuplicatesKey:true]);state("Looking for the other Vouch phone nearby. You can also tap an Android using NFC.")}
  else if value.state == .unauthorized{state("Bluetooth permission is unavailable. Use NFC or the camera.")}
  else if value.state == .poweredOff{state("Turn Bluetooth on, or use an NFC tap or camera.")}
 }
 func peripheralManagerDidUpdateState(_ value:CBPeripheralManager){
  guard running else{return}
  if value.state == .poweredOn{
   let service=CBMutableService(type:Self.service,primary:true);service.characteristics=[CBMutableCharacteristic(type:Self.card,properties:[.read],value:nil,permissions:[.readable])];value.add(service)
  }
 }
 func peripheralManager(_ value:CBPeripheralManager,didAdd service:CBService,error:Error?){if running && error==nil{value.startAdvertising([CBAdvertisementDataServiceUUIDsKey:[Self.service]])}}
 func peripheralManager(_ value:CBPeripheralManager,didReceiveRead request:CBATTRequest){
  guard running,request.characteristic.uuid==Self.card else{value.respond(to:request,withResult:.readNotPermitted);return}
  if request.offset==0{
   guard let current=code(),PublicCode.valid(current),snapshots[request.central.identifier] != nil || snapshots.count<2 else{value.respond(to:request,withResult:.unlikelyError);return}
   snapshots[request.central.identifier]=Data(current.utf8)
  }
  guard let bytes=snapshots[request.central.identifier],request.offset<=bytes.count else{value.respond(to:request,withResult:.invalidOffset);return}
  request.value=Data(bytes.dropFirst(request.offset));value.respond(to:request,withResult:.success)
 }
 func centralManager(_ value:CBCentralManager,didDiscover found:CBPeripheral,advertisementData:[String:Any],rssi:NSNumber){
  guard running,reading,rssi.intValue >= -85,peers.count<2,peers[found.identifier]==nil else{return}
  peers[found.identifier]=found;found.delegate=self;value.connect(found)
  DispatchQueue.main.asyncAfter(deadline:.now()+10){[weak self,weak found] in guard let self=self,let found=found,self.running,self.peers[found.identifier] != nil,found.state != .connected else{return};self.central.cancelPeripheralConnection(found);self.peers.removeValue(forKey:found.identifier)}
 }
 func centralManager(_ value:CBCentralManager,didConnect found:CBPeripheral){if running&&reading{found.discoverServices([Self.service])}else{value.cancelPeripheralConnection(found)}}
 func centralManager(_ value:CBCentralManager,didFailToConnect found:CBPeripheral,error:Error?){peers.removeValue(forKey:found.identifier)}
 func centralManager(_ value:CBCentralManager,didDisconnectPeripheral found:CBPeripheral,error:Error?){peers.removeValue(forKey:found.identifier)}
 func peripheral(_ found:CBPeripheral,didDiscoverServices error:Error?){guard running,reading,error==nil else{return};for service in found.services ?? [] where service.uuid==Self.service{found.discoverCharacteristics([Self.card],for:service)}}
 func peripheral(_ found:CBPeripheral,didDiscoverCharacteristicsFor service:CBService,error:Error?){guard running,reading,error==nil else{return};for card in service.characteristics ?? [] where card.uuid==Self.card{found.readValue(for:card)}}
 func peripheral(_ found:CBPeripheral,didUpdateValueFor characteristic:CBCharacteristic,error:Error?){
  guard running,reading,error==nil,characteristic.uuid==Self.card,let data=characteristic.value,data.count<=186 else{return}
  if let value=String(data:data,encoding:.ascii),PublicCode.valid(value){peer(value)}
  DispatchQueue.main.asyncAfter(deadline:.now()+0.45){[weak self,weak found] in guard let self=self,let found=found,self.running,self.reading,found.state == .connected else{return};found.readValue(for:characteristic)}
 }
 func finishReading(){reading=false;central?.stopScan();for found in peers.values{central?.cancelPeripheralConnection(found)};peers.removeAll()}
 func stop(){running=false;finishReading();peripheral?.stopAdvertising();peripheral?.removeAllServices();snapshots.removeAll()}
}
