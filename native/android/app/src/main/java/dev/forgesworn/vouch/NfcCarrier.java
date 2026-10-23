package dev.forgesworn.vouch;
import android.content.ComponentName;
import android.nfc.*;
import android.nfc.cardemulation.CardEmulation;
import android.nfc.tech.IsoDep;
import java.util.*;
import java.util.concurrent.*;

final class NfcCarrier {
 private final Radios owner;private final NfcAdapter adapter;private final ComponentName service;
 private volatile IsoDep link;private volatile boolean reading;
 private volatile int readRevision;
 private final NfcDelivery delivery=new NfcDelivery();
 private final ExecutorService worker=Executors.newSingleThreadExecutor(r->{Thread t=new Thread(r,"vouch-nfc");t.setDaemon(true);return t;});
 NfcCarrier(Radios owner){this.owner=owner;adapter=NfcAdapter.getDefaultAdapter(owner.host);service=new ComponentName(owner.host,VouchCardService.class);}
 boolean available(){return adapter!=null&&adapter.isEnabled();}
 void startCard(){if(!available()){android.util.Log.i("VouchRuntime","NFC card unavailable; adapter enabled=false");return;}try{var cards=CardEmulation.getInstance(adapter);boolean registered=cards.registerAidsForService(service,CardEmulation.CATEGORY_OTHER,List.of(PublicCode.AID));boolean preferred=cards.setPreferredService(owner.host,service);VouchCardService.current=owner;android.util.Log.i("VouchRuntime","NFC card registration="+registered+"; foreground preferred="+preferred);if(!registered)throw new Exception();}catch(Exception ignored){owner.state("NFC card mode is unavailable. Use Bluetooth or the camera.");}}
 void read()throws Exception{
  if(!available())throw new Exception("Turn NFC on, or use Bluetooth.");
  finishReader();reading=true;String stamp=owner.session;int revision=readRevision;
  adapter.enableReaderMode(owner.host,tag->{if(!reading||readRevision!=revision||!owner.is(stamp)||link!=null)return;IsoDep found=IsoDep.get(tag);if(found==null)return;link=found;worker.execute(()->exchange(found,stamp,revision));},NfcAdapter.FLAG_READER_NFC_A|NfcAdapter.FLAG_READER_SKIP_NDEF_CHECK|NfcAdapter.FLAG_READER_NO_PLATFORM_SOUNDS,null);
  owner.state("Hold this phone against the other Android phone. The other person leaves Connect open.");
 }
 private void exchange(IsoDep found,String stamp,int revision){
  try{
   if(!reading||readRevision!=revision||!owner.is(stamp))return;
   found.setTimeout(1200);found.connect();
   byte[] selected=found.transceive(PublicCode.select());if(selected.length!=2||selected[0]!=(byte)0x90||selected[1]!=0)throw new Exception();
   int exchanges=0;
   while(reading&&readRevision==revision&&owner.is(stamp)&&found.isConnected()&&exchanges++<240){
    String value=owner.code;if(!PublicCode.valid(value))break;
    String peer=PublicCode.response(found.transceive(PublicCode.exchange(value)));if(peer==null)throw new Exception();owner.receive(peer,"nfc",stamp);
    if(delivery.delivered(value)){owner.host.main.post(()->{if(reading&&readRevision==revision&&owner.is(stamp))finishReader();});break;}Thread.sleep(250);
   }
  }catch(Exception ignored){if(reading&&owner.is(stamp))owner.state("Keep the phones together, or try NFC again. Your setup is saved.");}
  finally{try{found.close();}catch(Exception ignored){}if(link==found)link=null;}
 }
 void finishAfterSending(String value){delivery.finishAfterSending(value);}
 void finishReader(){readRevision++;reading=false;IsoDep active=link;link=null;if(active!=null)try{active.close();}catch(Exception ignored){}if(adapter!=null)try{adapter.disableReaderMode(owner.host);}catch(Exception ignored){}}
 void stop(){finishReader();delivery.reset();if(VouchCardService.current==owner)VouchCardService.current=null;if(adapter!=null)try{var cards=CardEmulation.getInstance(adapter);cards.removeAidsForService(service,CardEmulation.CATEGORY_OTHER);cards.unsetPreferredService(owner.host);}catch(Exception ignored){}}
}
