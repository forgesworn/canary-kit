import SwiftUI
import WebKit

@main struct VouchApp:App {
 @StateObject private var host=WebHost()
 @Environment(\.scenePhase) private var phase
 var body:some Scene {
  WindowGroup {NativeView(host:host).background(Color(red:246/255,green:244/255,blue:236/255)).onChange(of:phase){value in
   if value == .background {host.background()}
   else if value == .inactive {host.web.isHidden=true}
   else if value == .active {host.resume()}
  }}
 }
}
struct NativeView:UIViewRepresentable {
 let host:WebHost
 func makeUIView(context:Context)->WKWebView {host.web}
 func updateUIView(_ view:WKWebView,context:Context){}
}
