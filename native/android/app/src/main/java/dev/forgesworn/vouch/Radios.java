package dev.forgesworn.vouch;
import org.json.JSONObject;

final class Radios {
 final MainActivity host;private final NfcCarrier nfc;private final BleCarrier ble;
 volatile String session,code;private int frames;
 private final Runnable deadline=this::pause;
 private void pause(){String id=session;stopAll();if(id!=null){android.util.Log.i("VouchRuntime","Nearby session paused at activity limit");host.emit(MainActivity.object("v",1,"event","paused","session",id,"message","Nearby paused. Your encrypted setup is saved. Tap Try nearby again."));}}
 Radios(MainActivity host){this.host=host;nfc=new NfcCarrier(this);ble=new BleCarrier(this);}
 boolean is(String id){return session!=null&&session.equals(id);}
 void prepare(String id,String value)throws Exception {
  if(id==null||!id.matches("[0-9a-f]{32}")||!PublicCode.valid(value))throw new Exception("Invalid public connection session.");
  stopAll();session=id;code=value;frames=0;nfc.startCard();host.main.postDelayed(deadline,60_000);
 }
 JSONObject start(boolean granted){
  boolean available=granted&&ble.start();
  state(available?"Looking for the other phone nearby. NFC tap is also available on supported phones.":nfc.available()?"Ready for an NFC tap. The other phone starts NFC while you keep Connect open, or use the camera instead.":"NFC is off or unavailable. Turn NFC on in this phone’s Settings, then tap Try nearby again. You can also use the camera.");
  return MainActivity.object("nfc",nfc.available(),"ble",available);
 }
 void update(String id,String value,boolean complete)throws Exception {
  if(!is(id)||!PublicCode.valid(value))throw new Exception("Nearby was paused. Tap Try nearby again.");code=value;
  if(complete){nfc.finishAfterSending(value);ble.finishReading();state("Compare all four words together before saving.");}
 }
 void receive(String value,String via){
  receive(value,via,session);
 }
 void receive(String value,String via,String stamp){
  if(stamp==null||!is(stamp)||!PublicCode.valid(value))return;
  host.main.post(()->{if(!is(stamp)||!host.active())return;if(++frames>256){deadline.run();return;}if(frames<=3)android.util.Log.i("VouchRuntime","Public peer frame received via "+via);host.emit(MainActivity.object("v",1,"event","peer","session",stamp,"code",value,"via",via));});
 }
 void state(String message){String id=session;if(id!=null)host.emit(MainActivity.object("v",1,"event","status","session",id,"message",message));}
 void readNfc(String id)throws Exception {if(!is(id))throw new Exception("Resume Connect first.");nfc.read();}
 void stop(String id){if(is(id))stopAll();}
 void stopAll(){session=null;code=null;host.main.removeCallbacks(deadline);nfc.stop();ble.stop();}
}
