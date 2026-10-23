package dev.forgesworn.vouch;
import android.content.*;
import android.database.*;
import android.net.Uri;
import android.os.ParcelFileDescriptor;
import android.provider.OpenableColumns;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

public final class ExportProvider extends ContentProvider {
 static final String AUTHORITY="dev.forgesworn.vouch.prototype.exports";
 @Override public boolean onCreate(){return true;}
 static Uri write(Context context,String name,String contents)throws IOException{
  File folder=new File(context.getCacheDir(),"exports/"+UUID.randomUUID());if(!folder.mkdirs())throw new IOException("Export folder unavailable");
  File file=new File(folder,name);try(var output=new FileOutputStream(file)){output.write(contents.getBytes(StandardCharsets.UTF_8));}
  return new Uri.Builder().scheme("content").authority(AUTHORITY).appendPath(folder.getName()).appendPath(name).build();
 }
 static void purge(Context context){File base=new File(context.getCacheDir(),"exports");File[] dirs=base.listFiles();if(dirs==null)return;for(File folder:dirs)if(folder.lastModified()<System.currentTimeMillis()-1_800_000){File[] files=folder.listFiles();if(files!=null)for(File file:files)file.delete();folder.delete();}}
 private File file(Uri uri)throws FileNotFoundException{
  var pieces=uri.getPathSegments();if(!AUTHORITY.equals(uri.getAuthority())||pieces.size()!=2||!pieces.get(0).matches("[0-9a-f-]{36}")||!pieces.get(1).matches("[A-Za-z0-9_.-]{1,80}"))throw new FileNotFoundException();
  try{File base=new File(getContext().getCacheDir(),"exports").getCanonicalFile(),file=new File(new File(base,pieces.get(0)),pieces.get(1)).getCanonicalFile();if(!file.getPath().startsWith(base.getPath()+File.separator)||!file.isFile())throw new FileNotFoundException();return file;}catch(IOException e){throw new FileNotFoundException();}
 }
 @Override public ParcelFileDescriptor openFile(Uri uri,String mode)throws FileNotFoundException{if(!"r".equals(mode))throw new FileNotFoundException();return ParcelFileDescriptor.open(file(uri),ParcelFileDescriptor.MODE_READ_ONLY);}
 @Override public String getType(Uri uri){return uri.getLastPathSegment()!=null&&uri.getLastPathSegment().endsWith(".json")?"application/json":"text/plain";}
 @Override public Cursor query(Uri uri,String[] projection,String selection,String[] args,String sort){try{File f=file(uri);String[] columns=projection==null?new String[]{OpenableColumns.DISPLAY_NAME,OpenableColumns.SIZE}:projection;MatrixCursor c=new MatrixCursor(columns);Object[] row=new Object[columns.length];for(int i=0;i<columns.length;i++)row[i]=columns[i].equals(OpenableColumns.DISPLAY_NAME)?f.getName():columns[i].equals(OpenableColumns.SIZE)?f.length():null;c.addRow(row);return c;}catch(FileNotFoundException e){return null;}}
 @Override public Uri insert(Uri uri,ContentValues values){throw new UnsupportedOperationException();}
 @Override public int delete(Uri uri,String where,String[] args){throw new UnsupportedOperationException();}
 @Override public int update(Uri uri,ContentValues values,String where,String[] args){throw new UnsupportedOperationException();}
}
