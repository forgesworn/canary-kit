package dev.forgesworn.vouch;
import org.junit.Test;
import static org.junit.Assert.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;
public class WireTest {
 private String field(String key)throws Exception {
  String text=new String(Files.readAllBytes(Path.of("../../shared/vectors.json")),StandardCharsets.UTF_8);
  var m=java.util.regex.Pattern.compile("\\\""+key+"\\\"\\s*:\\s*\\\"([^\\\"]+)\\\"").matcher(text);
  assertTrue(m.find());return m.group(1);
 }
 private String hex(byte[] bytes){return HexFormat.of().formatHex(bytes);}
 @Test public void readResponseDoesNotGuessThePeerMtu()throws Exception {
  String reveal=field("reveal");
  assertEquals(reveal,new String(PublicCode.readResponse(reveal,0),StandardCharsets.US_ASCII));
  assertEquals(reveal.substring(22),new String(PublicCode.readResponse(reveal,22),StandardCharsets.US_ASCII));
  assertEquals(0,PublicCode.readResponse(reveal,reveal.length()).length);
  assertThrows(IllegalArgumentException.class,()->PublicCode.readResponse(reveal,-1));
 }
 @Test public void completedReaderMustDeliverItsOwnFinalCode()throws Exception {
  String card=field("card"),reveal=field("reveal");var delivery=new NfcDelivery();
  assertFalse(delivery.delivered(card));delivery.finishAfterSending(reveal);
  assertFalse(delivery.delivered(card));assertTrue(delivery.delivered(reveal));
  delivery.reset();assertFalse(delivery.delivered(reveal));
 }
 @Test public void goldenVectorsAndInvalidFrames()throws Exception {
  String card=field("card"),reveal=field("reveal");assertTrue(PublicCode.valid(card));assertTrue(PublicCode.valid(reveal));
  assertEquals(field("service"),PublicCode.SERVICE);assertEquals(field("characteristic"),PublicCode.CARD);
  for(String bad:List.of(card+"x",card.toLowerCase(Locale.ROOT),"wallet secret","a".repeat(2048)))assertFalse(PublicCode.valid(bad));
  assertEquals(field("select"),hex(PublicCode.select()));assertEquals(field("exchange"),hex(PublicCode.exchange(card)));
  var seen=new ArrayList<String>();assertArrayEquals(new byte[]{(byte)0x90,0},PublicCode.respond(PublicCode.select(),card,seen::add));
  assertArrayEquals(new byte[]{(byte)0x90,0},PublicCode.respond(Arrays.copyOf(PublicCode.select(),13),card,seen::add));
  assertArrayEquals((reveal+"\u0090\u0000").getBytes(StandardCharsets.ISO_8859_1),PublicCode.respond(PublicCode.exchange(card),reveal,seen::add));assertEquals(List.of(card),seen);
  assertArrayEquals(new byte[]{0x6a,(byte)0x82},PublicCode.respond(PublicCode.select(),null,seen::add));
  assertArrayEquals(new byte[]{0x6a,(byte)0x80},PublicCode.respond(new byte[]{(byte)0x80,0x10,0,0,1,1,0},card,seen::add));
 }
}
