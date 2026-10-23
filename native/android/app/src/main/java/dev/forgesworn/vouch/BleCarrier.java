package dev.forgesworn.vouch;
import android.annotation.SuppressLint;
import android.bluetooth.*;
import android.bluetooth.le.*;
import android.os.ParcelUuid;
import java.nio.charset.StandardCharsets;
import java.util.*;

@SuppressLint("MissingPermission")
final class BleCarrier {
 static final UUID SERVICE=UUID.fromString(PublicCode.SERVICE),CARD=UUID.fromString(PublicCode.CARD);
 private final Radios owner;private final BluetoothManager manager;private final BluetoothAdapter adapter;
 private volatile BluetoothGattServer server;private volatile boolean running,scanning,reading;
 private volatile int revision;
 private final Map<String,BluetoothGatt> links=new HashMap<>();
 private final Map<String,String> snapshots=new java.util.concurrent.ConcurrentHashMap<>();
 private final Map<String,Integer> mtus=new java.util.concurrent.ConcurrentHashMap<>();
 private final Set<String> incoming=java.util.concurrent.ConcurrentHashMap.newKeySet();
 private final Set<Runnable> timers=new HashSet<>();
 BleCarrier(Radios owner){this.owner=owner;manager=owner.host.getSystemService(BluetoothManager.class);adapter=manager==null?null:manager.getAdapter();}
 boolean start(){
  stop();if(adapter==null||!adapter.isEnabled()||adapter.getBluetoothLeAdvertiser()==null)return false;
  running=reading=true;final int generation=revision;
  try{
   server=manager.openGattServer(owner.host,new BluetoothGattServerCallback(){
    @Override public void onConnectionStateChange(BluetoothDevice device,int status,int state){if(!running||revision!=generation)return;if(state==BluetoothProfile.STATE_CONNECTED){if(incoming.size()>=2&&!incoming.contains(device.getAddress())){if(server!=null)server.cancelConnection(device);}else incoming.add(device.getAddress());}else{incoming.remove(device.getAddress());snapshots.remove(device.getAddress());mtus.remove(device.getAddress());}}
    @Override public void onMtuChanged(BluetoothDevice device,int mtu){if(running&&revision==generation)mtus.put(device.getAddress(),mtu);}
    @Override public void onCharacteristicReadRequest(BluetoothDevice device,int request,int offset,BluetoothGattCharacteristic characteristic){
     BluetoothGattServer active=server;if(!running||active==null||revision!=generation)return;
     if(!CARD.equals(characteristic.getUuid())){active.sendResponse(device,request,BluetoothGatt.GATT_READ_NOT_PERMITTED,offset,null);return;}
     if(offset==0){String value=owner.code;if(!PublicCode.valid(value)){active.sendResponse(device,request,BluetoothGatt.GATT_FAILURE,offset,null);return;}snapshots.put(device.getAddress(),value);}
     String value=snapshots.get(device.getAddress());if(value==null||offset>value.length()){active.sendResponse(device,request,BluetoothGatt.GATT_INVALID_OFFSET,offset,null);return;}
     byte[] bytes=value.getBytes(StandardCharsets.US_ASCII);int end=Math.min(bytes.length,offset+Math.max(22,mtus.getOrDefault(device.getAddress(),23)-1));active.sendResponse(device,request,BluetoothGatt.GATT_SUCCESS,offset,Arrays.copyOfRange(bytes,offset,end));
    }
    @Override public void onServiceAdded(int status,BluetoothGattService service){owner.host.main.post(()->{if(!running||revision!=generation||status!=BluetoothGatt.GATT_SUCCESS)return;adapter.getBluetoothLeAdvertiser().startAdvertising(new AdvertiseSettings.Builder().setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY).setConnectable(true).setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_LOW).build(),new AdvertiseData.Builder().addServiceUuid(new ParcelUuid(SERVICE)).build(),advertising);});}
   });
   if(server==null)throw new Exception();BluetoothGattService service=new BluetoothGattService(SERVICE,BluetoothGattService.SERVICE_TYPE_PRIMARY);service.addCharacteristic(new BluetoothGattCharacteristic(CARD,BluetoothGattCharacteristic.PROPERTY_READ,BluetoothGattCharacteristic.PERMISSION_READ));server.addService(service);
   scanning=true;adapter.getBluetoothLeScanner().startScan(List.of(new ScanFilter.Builder().setServiceUuid(new ParcelUuid(SERVICE)).build()),new ScanSettings.Builder().setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY).build(),scan);return true;
  }catch(Exception ignored){stop();return false;}
 }
 private final AdvertiseCallback advertising=new AdvertiseCallback(){@Override public void onStartFailure(int error){owner.state("Bluetooth advertising is unavailable. Try NFC or the camera.");}};
 private final ScanCallback scan=new ScanCallback(){
  @Override public void onScanResult(int type,ScanResult result){owner.host.main.post(()->connect(result));}
  @Override public void onScanFailed(int error){owner.state("Bluetooth scanning paused. Try nearby again, NFC or the camera.");}
 };
 private void connect(ScanResult result){
  if(!running||!reading||result.getRssi() < -85||links.size()>=2||links.containsKey(result.getDevice().getAddress()))return;
  String stamp=owner.session,address=result.getDevice().getAddress();BluetoothGatt value=result.getDevice().connectGatt(owner.host,false,new BluetoothGattCallback(){
   private BluetoothGattCharacteristic card;
   @Override public void onConnectionStateChange(BluetoothGatt gatt,int status,int state){owner.host.main.post(()->{if(!valid(gatt,stamp)){gatt.close();return;}if(status==BluetoothGatt.GATT_SUCCESS&&state==BluetoothProfile.STATE_CONNECTED){if(!gatt.requestMtu(512))gatt.discoverServices();}else if(state==BluetoothProfile.STATE_DISCONNECTED){links.remove(address);gatt.close();}});}
   @Override public void onMtuChanged(BluetoothGatt gatt,int mtu,int status){owner.host.main.post(()->{if(valid(gatt,stamp))gatt.discoverServices();});}
   @Override public void onServicesDiscovered(BluetoothGatt gatt,int status){owner.host.main.post(()->{if(!valid(gatt,stamp))return;var service=gatt.getService(SERVICE);card=service==null?null:service.getCharacteristic(CARD);if(status!=BluetoothGatt.GATT_SUCCESS||card==null){close(gatt,address);return;}gatt.readCharacteristic(card);});}
   @Override public void onCharacteristicRead(BluetoothGatt gatt,BluetoothGattCharacteristic characteristic,byte[] bytes,int status){received(gatt,bytes,status);}
   @SuppressWarnings("deprecation") @Override public void onCharacteristicRead(BluetoothGatt gatt,BluetoothGattCharacteristic characteristic,int status){received(gatt,characteristic.getValue(),status);}
   private void received(BluetoothGatt gatt,byte[] bytes,int status){owner.host.main.post(()->{if(!valid(gatt,stamp))return;if(status==BluetoothGatt.GATT_SUCCESS&&bytes!=null&&bytes.length<=186)owner.receive(new String(bytes,StandardCharsets.US_ASCII),"ble");later(450,()->{if(valid(gatt,stamp)&&card!=null)gatt.readCharacteristic(card);});});}
  },BluetoothDevice.TRANSPORT_LE);
  if(value!=null){links.put(address,value);later(10_000,()->{if(owner.is(stamp)&&links.get(address)==value&&value.getServices().isEmpty())close(value,address);});}
 }
 private boolean valid(BluetoothGatt value,String stamp){return running&&reading&&owner.is(stamp)&&links.containsValue(value);}
 private void close(BluetoothGatt value,String address){links.remove(address);value.disconnect();value.close();}
 private void later(long ms,Runnable action){final Runnable[] wrapped=new Runnable[1];wrapped[0]=()->{timers.remove(wrapped[0]);action.run();};timers.add(wrapped[0]);owner.host.main.postDelayed(wrapped[0],ms);}
 void finishReading(){reading=false;if(scanning&&adapter!=null){try{adapter.getBluetoothLeScanner().stopScan(scan);}catch(Exception ignored){}scanning=false;}for(var value:links.values()){value.disconnect();value.close();}links.clear();for(var timer:timers)owner.host.main.removeCallbacks(timer);timers.clear();}
 void stop(){revision++;running=false;finishReading();if(adapter!=null)try{if(adapter.getBluetoothLeAdvertiser()!=null)adapter.getBluetoothLeAdvertiser().stopAdvertising(advertising);}catch(Exception ignored){}if(server!=null){server.close();server=null;}snapshots.clear();mtus.clear();incoming.clear();}
}
