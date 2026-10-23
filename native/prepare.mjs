import {mkdir,copyFile,writeFile} from 'node:fs/promises'
import {execFileSync} from 'node:child_process'
import {resolve} from 'node:path'
const root=resolve(import.meta.dirname,'..'),source=resolve(root,'local/pwa/icon-512.png')
const android=resolve(root,'native/android/app/src/main/res/drawable-nodpi');await mkdir(android,{recursive:true});await copyFile(source,resolve(android,'vouch_icon.png'))
if(process.platform==='darwin'){
 const base=resolve(root,'native/ios/Vouch/Assets.xcassets'),icons=resolve(base,'AppIcon.appiconset');await mkdir(icons,{recursive:true})
 const images=[]
 for(const [idiom,size,scale]of [['iphone',20,2],['iphone',20,3],['iphone',29,2],['iphone',29,3],['iphone',40,2],['iphone',40,3],['iphone',60,2],['iphone',60,3],['ipad',20,1],['ipad',20,2],['ipad',29,1],['ipad',29,2],['ipad',40,1],['ipad',40,2],['ipad',76,1],['ipad',76,2],['ipad',83.5,2],['ios-marketing',1024,1]]){
  const pixels=size*scale,name=`icon-${pixels}.png`
  execFileSync('sips',['-z',String(pixels),String(pixels),source,'--out',resolve(icons,name)],{stdio:'ignore'})
  images.push({idiom,size:`${size}x${size}`,scale:`${scale}x`,filename:name})
 }
 await writeFile(resolve(base,'Contents.json'),JSON.stringify({info:{version:1,author:'xcode'}},null,2)+'\n')
 await writeFile(resolve(icons,'Contents.json'),JSON.stringify({images,info:{version:1,author:'xcode'}},null,2)+'\n')
}
console.log('Native app icons prepared from the existing Signet mark.')
