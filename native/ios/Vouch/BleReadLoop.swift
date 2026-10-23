import Foundation

// Same bounded operation policy as Android; monotonic milliseconds, no peer data.
final class BleReadLoop {
 enum Action {case none,read,close}
 private enum Stage {case connecting,services,characteristics,reading,waiting,closed}
 private var stage=Stage.connecting,deadline:Double,failures=0
 init(now:Double){deadline=now+8_000}
 func connected(_ now:Double)->Bool{guard stage == .connecting else{return false};stage = .services;deadline=now+5_000;return true}
 func services(_ now:Double)->Bool{guard stage == .services else{return false};stage = .characteristics;deadline=now+5_000;return true}
 func ready(_ now:Double)->Bool{guard stage == .services || stage == .characteristics else{return false};reading(now);return true}
 func received(_ valid:Bool,_ now:Double)->Bool{
  guard stage == .reading else{return false}
  failures=valid ? 0:failures+1
  if failures>=3{close();return true}
  stage = .waiting;deadline=now+(valid ? 450:700*Double(failures));return true
 }
 func tick(_ now:Double)->Action{
  if stage == .closed{return .close}
  if now<deadline{return .none}
  if stage == .waiting{reading(now);return .read}
  close();return .close
 }
 private func reading(_ now:Double){stage = .reading;deadline=now+4_000}
 func close(){stage = .closed}
}
