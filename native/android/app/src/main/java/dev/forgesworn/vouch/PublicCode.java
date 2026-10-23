package dev.forgesworn.vouch;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.function.Consumer;

// Adapted from My Signet HandshakeApdu, MIT, ForgeSworn 2026 (aa663efb).
// This profile has a separate AID and carries only CANARY-MEET public tokens.
final class PublicCode {
 static final String AID="F043565543483031";
 static final String SERVICE="c7f6c891-0c38-4c2b-909b-c91d837f1893",CARD="c7f6c892-0c38-4c2b-909b-c91d837f1893";
 private static final byte[] SELECT={0,(byte)0xa4,4,0,8,(byte)0xf0,0x43,0x56,0x55,0x43,0x48,0x30,0x31,0};
 static boolean valid(String value){
  if(value==null||value.length()>186||!value.matches("CANARY-MEET:1:[A-Za-z0-9_-]{107}(:[A-Za-z0-9_-]{64})?"))return false;
  String[] p=value.split(":");return decoded(p[2],80)&&(p.length==3||decoded(p[3],48));
 }
 private static boolean decoded(String value,int length){try{byte[] bytes=Base64.getUrlDecoder().decode(value);return bytes.length==length&&Base64.getUrlEncoder().withoutPadding().encodeToString(bytes).equals(value);}catch(IllegalArgumentException e){return false;}}
 static byte[] select(){return SELECT.clone();}
 static byte[] readResponse(String code,int offset){
  if(!valid(code)||offset<0||offset>code.length())throw new IllegalArgumentException("Invalid public read offset");
  return Arrays.copyOfRange(code.getBytes(StandardCharsets.US_ASCII),offset,code.length());
 }
 static byte[] exchange(String code){
  if(!valid(code))throw new IllegalArgumentException("Invalid public code");byte[] value=code.getBytes(StandardCharsets.US_ASCII),out=new byte[value.length+6];
  out[0]=(byte)0x80;out[1]=0x10;out[4]=(byte)value.length;System.arraycopy(value,0,out,5,value.length);return out;
 }
 static byte[] respond(byte[] command,String own,Consumer<String> peer){
  if(!valid(own))return new byte[]{0x6a,(byte)0x82};
  // Core NFC performs its own SELECT before giving the tag to the app. Accept
  // the ISO 7816 case-3 and case-4 forms (with or without the trailing Le).
  if((command.length==13||command.length==14)&&command[0]==0&&command[1]==(byte)0xa4&&command[2]==4&&(command[3]==0||command[3]==0x0c)&&command[4]==8&&Arrays.equals(Arrays.copyOfRange(command,5,13),Arrays.copyOfRange(SELECT,5,13)))return new byte[]{(byte)0x90,0};
  if(command.length>=5&&command[0]==(byte)0x80&&command[1]==0x10&&command[2]==0&&command[3]==0){
   int n=command[4]&255;if(n==0||command.length!=n+6||command[command.length-1]!=0)return new byte[]{0x67,0};
   String code=new String(command,5,n,StandardCharsets.US_ASCII);if(!valid(code))return new byte[]{0x6a,(byte)0x80};peer.accept(code);
   byte[] value=own.getBytes(StandardCharsets.US_ASCII),out=Arrays.copyOf(value,value.length+2);out[value.length]=(byte)0x90;return out;
  }
  return new byte[]{0x6d,0};
 }
 static String response(byte[] value){if(value==null||value.length<2||value[value.length-2]!=(byte)0x90||value[value.length-1]!=0)return null;String code=new String(value,0,value.length-2,StandardCharsets.US_ASCII);return valid(code)?code:null;}
}

// Keep reading until a successful exchange actually sends our final reveal.
final class NfcDelivery {
 private volatile String finalCode;
 void finishAfterSending(String code){finalCode=code;}
 boolean delivered(String sent){return sent!=null&&sent.equals(finalCode);}
 void reset(){finalCode=null;}
}
