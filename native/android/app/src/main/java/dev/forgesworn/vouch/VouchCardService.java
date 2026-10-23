package dev.forgesworn.vouch;
import android.nfc.cardemulation.HostApduService;
import android.os.Bundle;
public final class VouchCardService extends HostApduService {
 static volatile Radios current;
 @Override public byte[] processCommandApdu(byte[] command,Bundle extras){Radios value=current;String session=value==null?null:value.session;if(command!=null&&command.length>1&&command[1]==(byte)0xa4)android.util.Log.i("VouchRuntime","NFC SELECT received; Connect active="+(value!=null));return PublicCode.respond(command==null?new byte[0]:command,value==null?null:value.code,peer->{if(value!=null)value.receive(peer,"nfc",session);});}
 @Override public void onDeactivated(int reason){}
}
