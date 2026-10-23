import Foundation
import Security
import LocalAuthentication

final class DeviceKeys {
 typealias Done=([String:Any]?,String?)->Void
 private let active:()->Bool
 private var context:LAContext?
 private let service="dev.forgesworn.vouch.prototype.unlock"
 init(active:@escaping()->Bool){self.active=active}
 private func random(_ size:Int)throws->Data {var value=Data(count:size);let status=value.withUnsafeMutableBytes{SecRandomCopyBytes(kSecRandomDefault,size,$0.baseAddress!)};guard status==errSecSuccess else{throw NativeError.message("Secure random generation is unavailable.")};return value}
 func create(_ done:@escaping Done){
  guard context==nil else{done(nil,"Finish the current device unlock first.");return}
  let auth=LAContext();var error:NSError?
  guard auth.canEvaluatePolicy(.deviceOwnerAuthentication,error:&error) else{done(nil,"Set a device passcode, or use a vault passphrase.");return}
  context=auth
  auth.evaluatePolicy(.deviceOwnerAuthentication,localizedReason:"Protect your encrypted Vouch vault on this device"){[weak self] success,_ in DispatchQueue.main.async{
   guard let self=self else{return};guard self.context===auth else{done(nil,"Device setup was cancelled.");return};self.context=nil
   guard success,self.active() else{done(nil,"Device setup was cancelled. Use a passphrase if needed.");return}
   do{
    let id=try self.random(16).base64EncodedString();var secret=try self.random(32);defer{secret.resetBytes(in:0..<secret.count)}
    var accessError:Unmanaged<CFError>?
    guard let access=SecAccessControlCreateWithFlags(nil,kSecAttrAccessibleWhenPasscodeSetThisDeviceOnly,.userPresence,&accessError) else{throw NativeError.message("Could not create device-only unlock protection.")}
    let query:[String:Any]=[kSecClass as String:kSecClassGenericPassword,kSecAttrService as String:self.service,kSecAttrAccount as String:id,kSecAttrAccessControl as String:access,kSecAttrSynchronizable as String:false,kSecValueData as String:secret]
    guard SecItemAdd(query as CFDictionary,nil)==errSecSuccess else{throw NativeError.message("Could not save the protected unlock key.")}
    done(["credential":id,"secret":secret.base64EncodedString()],nil)
   }catch{done(nil,error.localizedDescription)}
  }}
 }
 func read(_ id:String,_ done:@escaping Done){
  guard context==nil,let data=Data(base64Encoded:id),data.count==16,data.base64EncodedString()==id else{done(nil,"This device unlock key is unavailable. Use recovery if needed.");return}
  let auth=LAContext();auth.localizedReason="Unlock your encrypted Vouch vault";context=auth
  let query:[String:Any]=[kSecClass as String:kSecClassGenericPassword,kSecAttrService as String:service,kSecAttrAccount as String:id,kSecAttrSynchronizable as String:false,kSecReturnData as String:true,kSecMatchLimit as String:kSecMatchLimitOne,kSecUseAuthenticationContext as String:auth]
  DispatchQueue.global(qos:.userInitiated).async{[weak self] in
   var result:CFTypeRef?;let status=SecItemCopyMatching(query as CFDictionary,&result)
   DispatchQueue.main.async{
    guard let self=self else{return};guard self.context===auth else{done(nil,"Device unlock was cancelled.");return};self.context=nil
    guard status==errSecSuccess,self.active(),var secret=result as? Data,secret.count==32 else{done(nil,"Could not unlock on this device. Use your recovery backup if needed.");return}
    done(["secret":secret.base64EncodedString()],nil);secret.resetBytes(in:0..<secret.count)
   }
  }
 }
 func cancel(){context?.invalidate();context=nil}
}
