import Foundation
import UIKit
@preconcurrency import WebKit

private final class BridgeProxy:NSObject,WKScriptMessageHandler {
 weak var owner:WebHost?
 func userContentController(_ controller:WKUserContentController,didReceive message:WKScriptMessage){owner?.handle(message)}
}
final class WebHost:NSObject,ObservableObject,WKNavigationDelegate,WKUIDelegate {
 let web:WKWebView
 private let index:URL
 private var foreground=true,wasBackground=false
 private var radios:NativeRadios!
 private var keys:DeviceKeys!
 override init(){
  index=Bundle.main.url(forResource:"index",withExtension:"html",subdirectory:"web")!
  let config=WKWebViewConfiguration();config.websiteDataStore = .default();config.preferences.javaScriptCanOpenWindowsAutomatically=false
  let proxy=BridgeProxy();config.userContentController.add(proxy,name:"Vouch")
  web=WKWebView(frame:.zero,configuration:config)
  super.init();proxy.owner=self;web.navigationDelegate=self;web.uiDelegate=self;if #available(iOS 16.4,*){web.isInspectable=false}
  web.isOpaque=false;web.backgroundColor=UIColor(red:246/255,green:244/255,blue:236/255,alpha:1)
  keys=DeviceKeys(active:{[weak self] in self?.foreground==true})
  radios=NativeRadios(emit:{[weak self] value in self?.emit(value)})
  web.loadFileURL(index,allowingReadAccessTo:index.deletingLastPathComponent())
  purgeExports()
 }
 private var active:Bool {foreground && web.url?.standardizedFileURL==index.standardizedFileURL}
 func emit(_ value:[String:Any]){
  guard JSONSerialization.isValidJSONObject(value),let data=try? JSONSerialization.data(withJSONObject:value),let text=String(data:data,encoding:.utf8) else{return}
  DispatchQueue.main.async{[weak self] in self?.web.evaluateJavaScript("window.__vouchNativeReceive&&window.__vouchNativeReceive(\(text))",completionHandler:nil)}
 }
 func handle(_ message:WKScriptMessage){
  guard message.frameInfo.isMainFrame,active,let raw=message.body as? String,raw.utf8.count<=1_100_000,let data=raw.data(using:.utf8),let value=(try? JSONSerialization.jsonObject(with:data)) as? [String:Any],value["v"] as? Int==1,let id=value["id"] as? Int,id>0,id<=Int32.max,let op=value["op"] as? String,let args=value["args"] as? [String:Any] else{return}
  let done:([String:Any]?,String?)->Void = {[weak self] result,error in
   guard let self=self else{return}
   if let error=error{self.emit(["v":1,"id":id,"error":error])}else{self.emit(["v":1,"id":id,"result":result ?? [:]])}
  }
  do{
   switch op {
   case "ready":let ready=args["cryptoAvailable"] as? Bool == true;print("Vouch bundled runtime ready; Web Crypto=\(ready)");done([:],nil)
   case "vaultCreate":keys.create(done)
   case "vaultRead":keys.read(args["credential"] as? String ?? "",done)
   case "radioStart":try radios.start(args);done(["nfc":NfcCarrier.available,"ble":radios.bluetoothEnabled],nil)
   case "radioUpdate":try radios.update(args);done([:],nil)
   case "radioStop":radios.stop(args["session"] as? String);done([:],nil)
   case "nfcRead":try radios.read(args["session"] as? String);done([:],nil)
   case "shareFile":try share(args,done)
   case "shareText":try shareText(args,done)
   default:done(nil,"Unsupported device operation.")
   }
  }catch{done(nil,error.localizedDescription)}
 }
 func background(){foreground=false;wasBackground=true;web.isHidden=true;radios.stopAll();keys.cancel();emit(["v":1,"event":"background"])}
 func resume(){
  foreground=true
  if wasBackground {wasBackground=false;web.evaluateJavaScript("window.__vouchNativeReceive&&window.__vouchNativeReceive({v:1,event:'background'})"){[weak self] _,_ in self?.web.isHidden=false}}
  else{web.isHidden=false}
 }
 func webView(_ view:WKWebView,decidePolicyFor action:WKNavigationAction,decisionHandler:@escaping(WKNavigationActionPolicy)->Void){
  if action.request.url?.standardizedFileURL==index.standardizedFileURL {decisionHandler(.allow);return}
  if action.navigationType == .linkActivated,action.targetFrame?.isMainFrame==true,let url=action.request.url,url.scheme=="https"{UIApplication.shared.open(url)}
  decisionHandler(.cancel)
 }
 func webView(_ view:WKWebView,requestMediaCapturePermissionFor origin:WKSecurityOrigin,initiatedByFrame frame:WKFrameInfo,type:WKMediaCaptureType,decisionHandler:@escaping(WKPermissionDecision)->Void){decisionHandler(active && frame.isMainFrame && type == .camera ? .prompt:.deny)}
 private var exportRoot:URL {FileManager.default.temporaryDirectory.appendingPathComponent("VouchExports",isDirectory:true)}
 private func shareText(_ args:[String:Any],_ done:@escaping([String:Any]?,String?)->Void)throws {
  guard let text=args["text"] as? String,text.utf8.count<=6000,text.range(of:"^https://canary-words\\.cocoacod256\\.chatgpt\\.site/#(connect|device)=.+$",options:.regularExpression) != nil,let url=URL(string:text),let scene=UIApplication.shared.connectedScenes.first as? UIWindowScene,let controller=scene.windows.first(where:{$0.isKeyWindow})?.rootViewController,controller.presentedViewController==nil else{throw NativeError.message("Could not share this public Vouch link.")}
  let sheet=UIActivityViewController(activityItems:[url],applicationActivities:nil);sheet.popoverPresentationController?.sourceView=web
  sheet.completionWithItemsHandler={_,_,_,_ in done([:],nil)};controller.present(sheet,animated:true)
 }
 private func purgeExports(){for url in (try? FileManager.default.contentsOfDirectory(at:exportRoot,includingPropertiesForKeys:nil)) ?? [] {if let first=url.lastPathComponent.split(separator:"_").first,let created=Double(first),created<Date().timeIntervalSince1970-1800{try? FileManager.default.removeItem(at:url)}}}
 private func share(_ args:[String:Any],_ done:@escaping([String:Any]?,String?)->Void)throws {
  guard let name=args["name"] as? String,name.range(of:"^[A-Za-z0-9_.-]{1,80}$",options:.regularExpression) != nil,let text=args["contents"] as? String,text.utf8.count<=1_048_576,let mime=args["mime"] as? String,["text/plain","application/json"].contains(mime),let scene=UIApplication.shared.connectedScenes.first as? UIWindowScene,let controller=scene.windows.first(where:{$0.isKeyWindow})?.rootViewController,controller.presentedViewController==nil else{throw NativeError.message("Could not open the export sheet.")}
  let folder=exportRoot.appendingPathComponent("\(Int(Date().timeIntervalSince1970))_\(UUID().uuidString)",isDirectory:true);try FileManager.default.createDirectory(at:folder,withIntermediateDirectories:true)
  let url=folder.appendingPathComponent(name);try Data(text.utf8).write(to:url,options:[.atomic,.completeFileProtection])
  let sheet=UIActivityViewController(activityItems:[url],applicationActivities:nil);sheet.popoverPresentationController?.sourceView=web
  sheet.completionWithItemsHandler={_,_,_,_ in DispatchQueue.main.asyncAfter(deadline:.now()+60){try? FileManager.default.removeItem(at:folder)};done([:],nil)}
  controller.present(sheet,animated:true)
 }
}
enum NativeError:LocalizedError {
 case message(String)
 var errorDescription:String? {if case .message(let value)=self{return value};return nil}
}
