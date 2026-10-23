package dev.forgesworn.vouch;

/** Foreground-only GATT operation deadlines. All callers use monotonic milliseconds. */
final class BleReadLoop {
 enum Action { NONE, READ, CLOSE }
 private enum Stage { CONNECTING, SERVICES, CHARACTERISTICS, READING, WAITING, CLOSED }
 private Stage stage=Stage.CONNECTING;
 private long deadline;
 private int failures;
 BleReadLoop(long now){deadline=now+8_000;}
 boolean connected(long now){if(stage!=Stage.CONNECTING)return false;stage=Stage.SERVICES;deadline=now+5_000;return true;}
 boolean services(long now){if(stage!=Stage.SERVICES)return false;stage=Stage.CHARACTERISTICS;deadline=now+5_000;return true;}
 boolean ready(long now){if(stage!=Stage.SERVICES&&stage!=Stage.CHARACTERISTICS)return false;reading(now);return true;}
 boolean received(boolean valid,long now){
  if(stage!=Stage.READING)return false;
  failures=valid?0:failures+1;
  if(failures>=3){close();return true;}
  stage=Stage.WAITING;deadline=now+(valid?450:700L*failures);return true;
 }
 Action tick(long now){
  if(stage==Stage.CLOSED)return Action.CLOSE;
  if(now<deadline)return Action.NONE;
  if(stage==Stage.WAITING){reading(now);return Action.READ;}
  close();return Action.CLOSE;
 }
 private void reading(long now){stage=Stage.READING;deadline=now+4_000;}
 void close(){stage=Stage.CLOSED;}
}
