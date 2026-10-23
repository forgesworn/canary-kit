package dev.forgesworn.vouch;
import android.annotation.SuppressLint;
import android.bluetooth.*;
import android.bluetooth.le.*;
import android.os.ParcelUuid;
import android.os.SystemClock;
import java.nio.charset.StandardCharsets;
import java.util.*;

@SuppressLint("MissingPermission")
final class BleCarrier {
 static final UUID SERVICE=UUID.fromString(PublicCode.SERVICE),CARD=UUID.fromString(PublicCode.CARD);
 private final Radios owner;private final BluetoothManager manager;private final BluetoothAdapter adapter;
 private BluetoothGattServer server;private boolean running,scanning,reading;
 private int revision,traceBudget;
 private ScanCallback scan;private AdvertiseCallback advertising;
 private static final class Link {
  final BluetoothGatt gatt;final BleReadLoop loop;BluetoothGattCharacteristic card;
  Link(BluetoothGatt gatt){this.gatt=gatt;loop=new BleReadLoop(now());}
 }
 private final Map<String,Link> links=new HashMap<>();
 private final Map<String,String> snapshots=new HashMap<>();
 private final Set<String> incoming=new HashSet<>();
 private final LinkedHashMap<String,Long> cooldown=new LinkedHashMap<>();
 private final Runnable monitor=new Runnable(){public void run(){
  if(!running||!reading)return;
  for(var entry:new ArrayList<>(links.entrySet())){
   Link link=entry.getValue();switch(link.loop.tick(now())){
    case READ:read(link,entry.getKey());break;
    case CLOSE:trace("operation timeout or repeated read failure");close(link,entry.getKey());break;
    default:break;
   }
  }
  if(running&&reading)owner.host.main.postDelayed(this,150);
 }};
 private static long now(){return SystemClock.elapsedRealtime();}
 private void trace(String stage){if((owner.host.getApplicationInfo().flags&android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE)!=0&&traceBudget-->0)android.util.Log.i("VouchRuntime","BLE "+stage);}
 BleCarrier(Radios owner){this.owner=owner;manager=owner.host.getSystemService(BluetoothManager.class);adapter=manager==null?null:manager.getAdapter();}
 boolean start(){
  stop();if(adapter==null||!adapter.isEnabled()||adapter.getBluetoothLeAdvertiser()==null||adapter.getBluetoothLeScanner()==null)return false;
  running=reading=true;traceBudget=24;final int generation=revision;final String stamp=owner.session;
  try{
   advertising=new AdvertiseCallback(){
    @Override public void onStartSuccess(AdvertiseSettings settings){owner.host.main.post(()->{if(active(generation,stamp))trace("advertising ready");});}
    @Override public void onStartFailure(int error){owner.host.main.post(()->{if(active(generation,stamp))owner.state("Bluetooth advertising is unavailable. Try NFC or the camera.");});}
   };
   scan=new ScanCallback(){
    @Override public void onScanResult(int type,ScanResult result){owner.host.main.post(()->{if(active(generation,stamp))connect(result,generation,stamp);});}
    @Override public void onScanFailed(int error){owner.host.main.post(()->{if(active(generation,stamp))owner.state("Bluetooth scanning paused. Try nearby again, NFC or the camera.");});}
   };
   server=manager.openGattServer(owner.host,new BluetoothGattServerCallback(){
    @Override public void onConnectionStateChange(BluetoothDevice device,int status,int state){owner.host.main.post(()->{
     if(!active(generation,stamp))return;
     String address=device.getAddress();
     if(state==BluetoothProfile.STATE_CONNECTED){if(incoming.size()>=2&&!incoming.contains(address))server.cancelConnection(device);else incoming.add(address);}
     else if(state==BluetoothProfile.STATE_DISCONNECTED){incoming.remove(address);snapshots.remove(address);}
    });}
    @Override public void onCharacteristicReadRequest(BluetoothDevice device,int request,int offset,BluetoothGattCharacteristic characteristic){owner.host.main.post(()->{
     if(!active(generation,stamp)||server==null)return;
     if(!CARD.equals(characteristic.getUuid())){server.sendResponse(device,request,BluetoothGatt.GATT_READ_NOT_PERMITTED,offset,null);return;}
     String address=device.getAddress();
     if(offset==0){
      String value=owner.code;
      if(!PublicCode.valid(value)||(!snapshots.containsKey(address)&&snapshots.size()>=2)){server.sendResponse(device,request,BluetoothGatt.GATT_FAILURE,offset,null);return;}
      snapshots.put(address,value);
     }
     String value=snapshots.get(address);
     if(value==null||offset<0||offset>value.length()){server.sendResponse(device,request,BluetoothGatt.GATT_INVALID_OFFSET,offset,null);return;}
     // The stack applies the negotiated ATT MTU. Keep one snapshot across blob
     // offsets, and supply the complete remainder even when no MTU callback came.
     server.sendResponse(device,request,BluetoothGatt.GATT_SUCCESS,offset,PublicCode.readResponse(value,offset));
    });}
    @Override public void onServiceAdded(int status,BluetoothGattService service){owner.host.main.post(()->{
     if(!active(generation,stamp))return;
     if(status!=BluetoothGatt.GATT_SUCCESS){owner.state("Bluetooth service unavailable. Try nearby again or use the camera.");return;}
     adapter.getBluetoothLeAdvertiser().startAdvertising(new AdvertiseSettings.Builder().setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY).setConnectable(true).setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_LOW).build(),new AdvertiseData.Builder().addServiceUuid(new ParcelUuid(SERVICE)).build(),advertising);
    });}
   });
   if(server==null)throw new Exception();
   BluetoothGattService service=new BluetoothGattService(SERVICE,BluetoothGattService.SERVICE_TYPE_PRIMARY);
   service.addCharacteristic(new BluetoothGattCharacteristic(CARD,BluetoothGattCharacteristic.PROPERTY_READ,BluetoothGattCharacteristic.PERMISSION_READ));
   if(!server.addService(service))throw new Exception();
   scanning=true;adapter.getBluetoothLeScanner().startScan(List.of(new ScanFilter.Builder().setServiceUuid(new ParcelUuid(SERVICE)).build()),new ScanSettings.Builder().setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY).build(),scan);
   owner.host.main.postDelayed(monitor,150);return true;
  }catch(Exception ignored){stop();return false;}
 }
 private boolean active(int generation,String stamp){return running&&revision==generation&&owner.is(stamp);}
 private Link current(BluetoothGatt gatt,String address,int generation,String stamp){
  Link link=links.get(address);return active(generation,stamp)&&reading&&link!=null&&link.gatt==gatt?link:null;
 }
 private void connect(ScanResult result,int generation,String stamp){
  String address=result.getDevice().getAddress();
  if(!reading||result.getRssi() < -85||result.getRssi()>0||links.size()>=2||links.containsKey(address)||cooldown.getOrDefault(address,0L)>now())return;
  trace("peer discovered");
  try{
   BluetoothGatt value=result.getDevice().connectGatt(owner.host,false,new BluetoothGattCallback(){
    @Override public void onConnectionStateChange(BluetoothGatt gatt,int status,int state){owner.host.main.post(()->{
     Link link=current(gatt,address,generation,stamp);if(link==null)return;
     if(status!=BluetoothGatt.GATT_SUCCESS||state==BluetoothProfile.STATE_DISCONNECTED){close(link,address);return;}
     if(state==BluetoothProfile.STATE_CONNECTED&&link.loop.connected(now())){
      trace("connected; discovering service");owner.state("Connecting over Bluetooth. Keep both phones on Connect.");
      // Long reads work at the default ATT MTU. Waiting for an optional MTU
      // negotiation here used to strand the discovery operation.
      if(!gatt.discoverServices())close(link,address);
     }
    });}
    @Override public void onServicesDiscovered(BluetoothGatt gatt,int status){owner.host.main.post(()->{
     Link link=current(gatt,address,generation,stamp);if(link==null)return;
     var service=gatt.getService(SERVICE);link.card=service==null?null:service.getCharacteristic(CARD);
     if(status!=BluetoothGatt.GATT_SUCCESS||link.card==null||(link.card.getProperties()&BluetoothGattCharacteristic.PROPERTY_READ)==0){close(link,address);return;}
     if(link.loop.ready(now())){trace("public service ready");read(link,address);}
    });}
    @Override public void onCharacteristicRead(BluetoothGatt gatt,BluetoothGattCharacteristic characteristic,byte[] bytes,int status){received(gatt,characteristic,bytes,status);}
    @SuppressWarnings("deprecation") @Override public void onCharacteristicRead(BluetoothGatt gatt,BluetoothGattCharacteristic characteristic,int status){received(gatt,characteristic,characteristic.getValue(),status);}
    private void received(BluetoothGatt gatt,BluetoothGattCharacteristic characteristic,byte[] bytes,int status){
     // Legacy callbacks can expose mutable storage; capture before dispatch.
     byte[] copy=bytes==null?null:bytes.clone();owner.host.main.post(()->{
      Link link=current(gatt,address,generation,stamp);if(link==null||!CARD.equals(characteristic.getUuid()))return;
      String code=copy==null||copy.length>186?null:new String(copy,StandardCharsets.US_ASCII);
      boolean valid=status==BluetoothGatt.GATT_SUCCESS&&PublicCode.valid(code);
      if(link.loop.received(valid,now())){trace(valid?"complete public frame read":"read failed; retry scheduled");if(valid)owner.receive(code,"ble",stamp);}
     });
    }
   },BluetoothDevice.TRANSPORT_LE);
   if(value!=null)links.put(address,new Link(value));else delay(address);
  }catch(Exception ignored){delay(address);}
 }
 private void read(Link link,String address){try{if(link.card==null||!link.gatt.readCharacteristic(link.card))link.loop.received(false,now());}catch(Exception ignored){close(link,address);}}
 private void delay(String address){cooldown.put(address,now()+1_000);while(cooldown.size()>16)cooldown.remove(cooldown.keySet().iterator().next());}
 private void close(Link link,String address){
  if(links.get(address)!=link)return;links.remove(address);link.loop.close();delay(address);
  try{link.gatt.disconnect();}catch(Exception ignored){}link.gatt.close();
 }
 void finishReading(){
  reading=false;owner.host.main.removeCallbacks(monitor);
  if(scanning&&adapter!=null){try{adapter.getBluetoothLeScanner().stopScan(scan);}catch(Exception ignored){}scanning=false;}
  for(var link:links.values())link.loop.close();
  // Keep established links as well as advertising until stop: disconnecting a
  // central can interrupt the slower phone's reads on a shared LE connection.
 }
 void stop(){
  revision++;running=false;finishReading();
  for(var entry:new ArrayList<>(links.entrySet()))close(entry.getValue(),entry.getKey());
  if(adapter!=null&&advertising!=null)try{if(adapter.getBluetoothLeAdvertiser()!=null)adapter.getBluetoothLeAdvertiser().stopAdvertising(advertising);}catch(Exception ignored){}
  if(server!=null){server.close();server=null;}
  snapshots.clear();incoming.clear();cooldown.clear();scan=null;advertising=null;
 }
}
