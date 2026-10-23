package dev.forgesworn.vouch;
import android.app.*;
import android.content.*;
import android.hardware.biometrics.BiometricPrompt;
import android.hardware.biometrics.BiometricManager;
import android.os.CancellationSignal;
import android.security.keystore.*;
import java.security.*;
import javax.crypto.*;
import javax.crypto.spec.GCMParameterSpec;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.BooleanSupplier;
import org.json.JSONObject;

final class DeviceKeys {
 interface Result{void done(JSONObject value,String error);}
 private final Activity activity;private final BooleanSupplier active;private CancellationSignal prompt;
 private final java.security.SecureRandom random=new SecureRandom();
 DeviceKeys(Activity activity,BooleanSupplier active){this.activity=activity;this.active=active;}
 private KeyStore store()throws Exception{var store=KeyStore.getInstance("AndroidKeyStore");store.load(null);return store;}
 private String alias(String id)throws Exception {byte[] value=Base64.getDecoder().decode(id);if(value.length!=16||!Base64.getEncoder().encodeToString(value).equals(id))throw new Exception("Invalid native device credential.");StringBuilder out=new StringBuilder("vouch.unlock.");for(byte b:value)out.append(String.format(Locale.ROOT,"%02x",b));return out.toString();}
 void create(Result done){
  try{
   if(!activity.getSystemService(KeyguardManager.class).isDeviceSecure())throw new Exception("Set a device PIN or use a vault passphrase.");
   if(activity.getSharedPreferences("vouch.keys",0).getAll().size()>=64)throw new Exception("Too many native unlock keys. Use a recovery passphrase.");
   byte[] id=new byte[16];random.nextBytes(id);String credential=Base64.getEncoder().encodeToString(id),name=alias(credential);
   var generator=KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES,"AndroidKeyStore");
   generator.init(new KeyGenParameterSpec.Builder(name,KeyProperties.PURPOSE_ENCRYPT|KeyProperties.PURPOSE_DECRYPT).setKeySize(256).setBlockModes(KeyProperties.BLOCK_MODE_GCM).setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE).setUserAuthenticationRequired(true).setUserAuthenticationParameters(0,KeyProperties.AUTH_BIOMETRIC_STRONG|KeyProperties.AUTH_DEVICE_CREDENTIAL).setUnlockedDeviceRequired(true).build());
   var key=generator.generateKey();Cipher cipher=Cipher.getInstance("AES/GCM/NoPadding");cipher.init(Cipher.ENCRYPT_MODE,key);
   authenticate(cipher,(authenticated,error)->{
    if(error!=null){try{store().deleteEntry(name);}catch(Exception ignored){}done.done(null,error);return;}
    byte[] secret=new byte[32];random.nextBytes(secret);
    try{
     byte[] ciphertext=authenticated.doFinal(secret);String value=Base64.getEncoder().encodeToString(authenticated.getIV())+":"+Base64.getEncoder().encodeToString(ciphertext);
     if(!activity.getSharedPreferences("vouch.keys",0).edit().putString(credential,value).commit())throw new Exception("Native key storage failed.");
     done.done(MainActivity.object("credential",credential,"secret",Base64.getEncoder().encodeToString(secret)),null);
    }catch(Exception e){try{store().deleteEntry(name);}catch(Exception ignored){}done.done(null,"Could not protect the native unlock key.");}finally{Arrays.fill(secret,(byte)0);}
   });
  }catch(Exception e){done.done(null,e.getMessage());}
 }
 void read(String credential,Result done){
  try{
   String name=alias(credential),stored=activity.getSharedPreferences("vouch.keys",0).getString(credential,null);if(stored==null)throw new Exception("This device unlock key is unavailable. Use your recovery backup.");
   String[] values=stored.split(":");if(values.length!=2)throw new Exception("Invalid protected device key.");
   Cipher cipher=Cipher.getInstance("AES/GCM/NoPadding");cipher.init(Cipher.DECRYPT_MODE,store().getKey(name,null),new GCMParameterSpec(128,Base64.getDecoder().decode(values[0])));
   authenticate(cipher,(authenticated,error)->{
    if(error!=null){done.done(null,error);return;}byte[] secret=null;
    try{secret=authenticated.doFinal(Base64.getDecoder().decode(values[1]));if(secret.length!=32)throw new Exception();done.done(MainActivity.object("secret",Base64.getEncoder().encodeToString(secret)),null);}catch(Exception e){done.done(null,"Could not unlock the protected device key. Use recovery if needed.");}finally{if(secret!=null)Arrays.fill(secret,(byte)0);}
   });
  }catch(Exception e){done.done(null,e.getMessage());}
 }
 interface Auth{void done(Cipher cipher,String error);}
 private void authenticate(Cipher cipher,Auth done){
  cancel();CancellationSignal signal=new CancellationSignal();prompt=signal;AtomicBoolean finished=new AtomicBoolean();
  var dialog=new BiometricPrompt.Builder(activity).setTitle("Unlock your Vouch vault").setSubtitle("Use your device biometric or screen-lock credential").setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG|BiometricManager.Authenticators.DEVICE_CREDENTIAL).build();
  dialog.authenticate(new BiometricPrompt.CryptoObject(cipher),signal,activity.getMainExecutor(),new BiometricPrompt.AuthenticationCallback(){
   @Override public void onAuthenticationSucceeded(BiometricPrompt.AuthenticationResult result){if(!finished.compareAndSet(false,true))return;if(prompt==signal)prompt=null;if(!active.getAsBoolean()||result.getCryptoObject()==null){done.done(null,"Unlock was cancelled when the app left the foreground.");return;}done.done(result.getCryptoObject().getCipher(),null);}
   @Override public void onAuthenticationError(int code,CharSequence message){if(finished.compareAndSet(false,true)){if(prompt==signal)prompt=null;done.done(null,"Device unlock was cancelled or unavailable. Use a passphrase if needed.");}}
  });
 }
 void cancel(){if(prompt!=null){prompt.cancel();prompt=null;}}
}
