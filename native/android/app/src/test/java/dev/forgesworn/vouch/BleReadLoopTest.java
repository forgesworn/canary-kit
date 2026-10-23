package dev.forgesworn.vouch;

import org.junit.Test;
import static org.junit.Assert.*;

public class BleReadLoopTest {
 @Test public void lostCallbacksCloseTheLinkInsteadOfWaitingForTheWholeSession() {
  for (int stage=0;stage<4;stage++) {
   var loop=new BleReadLoop(0);
   if(stage>0)assertTrue(loop.connected(1));
   if(stage>1)assertTrue(loop.services(2));
   if(stage>2)assertTrue(loop.ready(3));
   assertEquals(BleReadLoop.Action.NONE,loop.tick(100));
   assertEquals(BleReadLoop.Action.CLOSE,loop.tick(9_000));
  }
 }
 @Test public void transientReadErrorsRetryButRepeatedErrorsReleaseThePeerSlot() {
  var loop=new BleReadLoop(0);loop.connected(1);loop.ready(2);
  assertTrue(loop.received(false,3));
  assertEquals(BleReadLoop.Action.NONE,loop.tick(600));
  assertEquals(BleReadLoop.Action.READ,loop.tick(703));
  assertTrue(loop.received(false,704));
  assertEquals(BleReadLoop.Action.READ,loop.tick(2104));
  assertTrue(loop.received(false,2105));
  assertEquals(BleReadLoop.Action.CLOSE,loop.tick(2105));
 }
 @Test public void successfulFramesResetBackoffAndLateCallbacksCannotStartMoreReads() {
  var loop=new BleReadLoop(0);assertFalse(loop.ready(1));
  assertTrue(loop.connected(2));assertFalse(loop.connected(3));
  assertTrue(loop.ready(4));assertTrue(loop.received(false,5));
  assertFalse(loop.received(true,6)); // Duplicate legacy/new Android callback.
  assertEquals(BleReadLoop.Action.READ,loop.tick(705));
  assertTrue(loop.received(true,706));
  assertEquals(BleReadLoop.Action.NONE,loop.tick(1155));
  assertEquals(BleReadLoop.Action.READ,loop.tick(1156));
  loop.close();assertFalse(loop.received(true,1157));
  assertEquals(BleReadLoop.Action.CLOSE,loop.tick(1158));
 }
}
