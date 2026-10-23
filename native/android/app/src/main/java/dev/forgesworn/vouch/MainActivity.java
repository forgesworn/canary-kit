package dev.forgesworn.vouch;

import android.Manifest;
import android.app.*;
import android.content.*;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.*;
import android.webkit.*;
import org.json.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.function.Consumer;

public final class MainActivity extends Activity {
 static final String PAGE="https://appassets.androidplatform.net/index.html";
 final Handler main=new Handler(Looper.getMainLooper());
 WebView web;Radios radios;DeviceKeys keys;boolean foreground=true;
 private Consumer<Boolean> nearbyPermission;private PermissionRequest cameraRequest;
 private ValueCallback<Uri[]> fileResult;
 boolean active(){return foreground&&!isFinishing()&&web!=null&&PAGE.equals(web.getUrl());}
 @Override public void onCreate(Bundle state){
  super.onCreate(state);getWindow().addFlags(android.view.WindowManager.LayoutParams.FLAG_SECURE);getWindow().setStatusBarColor(0xfff6f4ec);getWindow().setNavigationBarColor(0xfff6f4ec);
  getWindow().setDecorFitsSystemWindows(false);getWindow().setSoftInputMode(android.view.WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING);
  var layout=new android.widget.FrameLayout(this);layout.setBackgroundColor(0xfff6f4ec);web=new WebView(this);layout.addView(web,new android.widget.FrameLayout.LayoutParams(-1,-1));setContentView(layout);
  layout.setOnApplyWindowInsetsListener((view,insets)->{var bars=insets.getInsets(android.view.WindowInsets.Type.systemBars()|android.view.WindowInsets.Type.displayCutout());var keyboard=insets.getInsets(android.view.WindowInsets.Type.ime());view.setPadding(bars.left,bars.top,bars.right,Math.max(bars.bottom,keyboard.bottom));return android.view.WindowInsets.CONSUMED;});layout.requestApplyInsets();
  keys=new DeviceKeys(this,this::active);radios=new Radios(this);
  var settings=web.getSettings();settings.setJavaScriptEnabled(true);settings.setDomStorageEnabled(true);settings.setAllowFileAccess(false);settings.setAllowContentAccess(false);settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);settings.setBlockNetworkLoads(true);settings.setSafeBrowsingEnabled(false);
  WebView.setWebContentsDebuggingEnabled(false);web.addJavascriptInterface(new Bridge(),"VouchNative");
  web.setWebViewClient(new WebViewClient(){
   @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request){
    if(request.getMethod().equals("GET")&&request.getUrl().toString().equals(PAGE)){
     try{return new WebResourceResponse("text/html","UTF-8",200,"OK",Map.of("Cache-Control","no-store","X-Content-Type-Options","nosniff"),getAssets().open("index.html"));}catch(IOException ignored){}
    }
    return new WebResourceResponse("text/plain","UTF-8",403,"Blocked",Map.of(),new ByteArrayInputStream(new byte[0]));
   }
   @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request){
    if(request.getUrl().toString().equals(PAGE))return false;
    if(request.isForMainFrame()&&request.hasGesture()&&"https".equals(request.getUrl().getScheme()))startActivity(new Intent(Intent.ACTION_VIEW,request.getUrl()));
    return true;
   }
  });
  web.setWebChromeClient(new WebChromeClient(){
   @Override public void onPermissionRequest(PermissionRequest request){main.post(()->{
    if(!active()||!request.getOrigin().toString().equals("https://appassets.androidplatform.net/")||!Arrays.equals(request.getResources(),new String[]{PermissionRequest.RESOURCE_VIDEO_CAPTURE})){request.deny();return;}
    if(checkSelfPermission(Manifest.permission.CAMERA)==PackageManager.PERMISSION_GRANTED)request.grant(new String[]{PermissionRequest.RESOURCE_VIDEO_CAPTURE});
    else{cameraRequest=request;requestPermissions(new String[]{Manifest.permission.CAMERA},102);}
   });}
   @Override public boolean onShowFileChooser(WebView view,ValueCallback<Uri[]> callback,FileChooserParams params){
    if(!active())return false;if(fileResult!=null)fileResult.onReceiveValue(null);fileResult=callback;
    Intent intent=new Intent(Intent.ACTION_OPEN_DOCUMENT).setType("*/*").addCategory(Intent.CATEGORY_OPENABLE);startActivityForResult(intent,103);return true;
   }
  });
  web.loadUrl(PAGE);ExportProvider.purge(this);
 }
 void ensureNearby(Consumer<Boolean> result){
  String[] names={Manifest.permission.BLUETOOTH_SCAN,Manifest.permission.BLUETOOTH_ADVERTISE,Manifest.permission.BLUETOOTH_CONNECT};
  boolean granted=true;for(String name:names)granted&=checkSelfPermission(name)==PackageManager.PERMISSION_GRANTED;
  if(granted){result.accept(true);return;}nearbyPermission=result;requestPermissions(names,101);
 }
 @Override public void onRequestPermissionsResult(int code,String[] names,int[] grants){super.onRequestPermissionsResult(code,names,grants);
  if(code==101&&nearbyPermission!=null){var cb=nearbyPermission;nearbyPermission=null;boolean all=grants.length==3;for(int value:grants)all&=value==PackageManager.PERMISSION_GRANTED;cb.accept(all&&active());}
  if(code==102&&cameraRequest!=null){if(active()&&grants.length==1&&grants[0]==PackageManager.PERMISSION_GRANTED)cameraRequest.grant(new String[]{PermissionRequest.RESOURCE_VIDEO_CAPTURE});else cameraRequest.deny();cameraRequest=null;}
 }
 @Override protected void onActivityResult(int request,int result,Intent data){super.onActivityResult(request,result,data);if(request==103&&fileResult!=null){fileResult.onReceiveValue(result==RESULT_OK&&data!=null?new Uri[]{data.getData()}:null);fileResult=null;}}
 void emit(JSONObject value){main.post(()->{if(web!=null)web.evaluateJavascript("window.__vouchNativeReceive&&window.__vouchNativeReceive("+value.toString()+")",null);});}
 static JSONObject object(Object... values){JSONObject result=new JSONObject();try{for(int i=0;i<values.length;i+=2)result.put((String)values[i],values[i+1]);}catch(JSONException e){throw new IllegalArgumentException(e);}return result;}
 void reply(long id,Object result){emit(object("v",1,"id",id,"result",result));}
 void fail(long id,String message){emit(object("v",1,"id",id,"error",message));}
 private final class Bridge {
  @JavascriptInterface public void postMessage(String raw){
   if(raw==null||raw.length()>1_100_000)return;
   main.post(()->{long id=-1;try{
    JSONObject message=new JSONObject(raw);id=message.getLong("id");if(message.getInt("v")!=1||id<1||id>Integer.MAX_VALUE||!active())throw new Exception("Unlock and use the foreground Vouch app.");
    JSONObject args=message.getJSONObject("args");String op=message.getString("op");final long request=id;
    switch(op){
     case "ready":android.util.Log.i("VouchRuntime","Bundled runtime ready; Web Crypto="+args.optBoolean("cryptoAvailable"));reply(id,object());break;
     case "vaultCreate":keys.create((value,error)->{if(error!=null)fail(request,error);else reply(request,value);});break;
     case "vaultRead":keys.read(args.getString("credential"),(value,error)->{if(error!=null)fail(request,error);else reply(request,value);});break;
     case "radioStart":{
      String session=args.getString("session"),code=args.getString("code");radios.prepare(session,code);
      if(getIntent().getBooleanExtra("vouch.nfcOnly",false)){reply(request,radios.start(false));break;}
      ensureNearby(granted->{if(!active()||!radios.is(session)){fail(request,"Connect was paused. Unlock and resume.");return;}reply(request,radios.start(granted));});break;
     }
     case "radioUpdate":radios.update(args.getString("session"),args.getString("code"),args.optBoolean("complete"));reply(id,object());break;
     case "radioStop":radios.stop(args.getString("session"));reply(id,object());break;
     case "nfcRead":radios.readNfc(args.getString("session"));reply(id,object());break;
     case "shareFile":share(args);reply(id,object());break;
     default:throw new Exception("Unsupported device operation.");
    }
   }catch(Exception e){if(id>0)fail(id,e.getMessage()!=null?e.getMessage():"The device operation did not finish.");}});
  }
 }
 void share(JSONObject args)throws Exception {
  String name=args.getString("name"),contents=args.getString("contents"),mime=args.getString("mime");
  if(!name.matches("[A-Za-z0-9_.-]{1,80}")||(!mime.equals("text/plain")&&!mime.equals("application/json"))||contents.getBytes(StandardCharsets.UTF_8).length>1_048_576)throw new Exception("Invalid export.");
  Uri uri=ExportProvider.write(this,name,contents);Intent send=new Intent(Intent.ACTION_SEND).setType(mime).putExtra(Intent.EXTRA_STREAM,uri).addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
  send.setClipData(ClipData.newRawUri(name,uri));startActivity(Intent.createChooser(send,"Keep your Vouch file"));
 }
 @Override protected void onStart(){super.onStart();foreground=true;}
 @Override protected void onStop(){foreground=false;if(radios!=null)radios.stopAll();if(keys!=null)keys.cancel();if(cameraRequest!=null){cameraRequest.deny();cameraRequest=null;}emit(object("v",1,"event","background"));super.onStop();}
 @Override protected void onDestroy(){if(radios!=null)radios.stopAll();if(web!=null){web.removeJavascriptInterface("VouchNative");web.destroy();web=null;}super.onDestroy();}
}
