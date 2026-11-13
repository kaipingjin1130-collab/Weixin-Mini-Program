// Decode locally and export compatible pixels before upload; changing an extension is not conversion.
const MAX_PHOTO=10*1024*1024,MAX_SIGNATURE=1400000;
const decodeError=()=>Error('当前微信无法读取这张图片，请换用相册导入，或先转为PNG/JPG。HEIC、HEIF、TIFF、AVIF是否可用取决于设备；原文件不会修改。');
const read=path=>new Promise((resolve,reject)=>wx.getFileSystemManager().readFile({filePath:path,encoding:'base64',success:r=>resolve(r.data),fail:()=>reject(Error('图片读取失败，请重新选择'))}));
function sizeOf(base64){return Math.floor(base64.length*3/4)-(base64.endsWith('==')?2:base64.endsWith('=')?1:0)}
function jpegEndsAtEOI(base64){
 // Match the existing upload service: JPEG must end at FF D9. Some cameras/editors append metadata.
 const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
 let value=0,bits=0;const bytes=[];
 for(const c of base64.slice(-8).replace(/=+$/,'')){const digit=alphabet.indexOf(c);if(digit<0)return false;value=(value<<6)|digit;bits+=6;if(bits>=8){bits-=8;bytes.push((value>>bits)&255)}}
 return bytes[bytes.length-2]===255&&bytes[bytes.length-1]===217;
}
function nativeType(base64){return base64.startsWith('iVBORw0KGgo')?'png':base64.startsWith('/9j/')&&jpegEndsAtEOI(base64)?'jpg':''}
async function select({source='album',count=1}={}){
 const result=await new Promise((resolve,reject)=>{
  const callbacks={success:resolve,fail:e=>String(e.errMsg).includes('cancel')?resolve(null):reject(Error('无法选择图片，请检查权限或重试'))};
  // Some formats are sent as files and are absent from the album's image filter.
  if(source==='message')wx.chooseMessageFile({count,type:'all',...callbacks});
  else wx.chooseMedia({count,mediaType:['image'],sourceType:[source],sizeType:source==='camera'?['compressed']:['original'],camera:'back',...callbacks});
 });
 return result?(result.tempFiles||[]).map(f=>({...f,path:f.tempFilePath||f.path})):[];
}
async function normalize(file,page,{signature=false}={}){
 const path=file.path||file.tempFilePath,limit=signature?MAX_SIGNATURE:MAX_PHOTO;
 const sizeError=()=>Error(signature?'签名图片请控制在1.4MB以内':'单张照片不能超过10MB');
 if(file.size>limit)throw sizeError();
 const info=await new Promise((resolve,reject)=>wx.getImageInfo({src:path,success:resolve,fail:()=>reject(decodeError())}));
 if(!(info.width>0&&info.height>0)||info.width*info.height>60000000)throw Error('图片尺寸不支持，请缩小后重试');
 const base64=await read(path);if(sizeOf(base64)>limit)throw sizeError();
 const type=nativeType(base64);
 if(type)return {path,base64,extension:type,size:sizeOf(base64)};
 const canvas=await new Promise((resolve,reject)=>wx.createSelectorQuery().in(page).select('#imageImportCanvas').fields({node:true}).exec(rows=>rows?.[0]?.node?resolve(rows[0].node):reject(Error('图片转换尚未就绪，请返回页面后重试'))));
 const image=canvas.createImage();
 await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(decodeError());image.src=info.path||path});
 const width=image.width||info.width,height=image.height||info.height;
 const scale=Math.min(1,(signature?1600:4096)/Math.max(width,height));
 const extension=signature?'png':'jpg';
 try{
  for(let attempt=0;attempt<4;attempt++){
   canvas.width=Math.max(1,Math.round(width*scale*Math.pow(.75,attempt)));
   canvas.height=Math.max(1,Math.round(height*scale*Math.pow(.75,attempt)));
   const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);
   if(!signature){ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height)}
   ctx.drawImage(image,0,0,canvas.width,canvas.height);
   const output=await new Promise((resolve,reject)=>wx.canvasToTempFilePath({canvas,fileType:extension,quality:.92,success:r=>resolve(r.tempFilePath),fail:()=>reject(Error('图片转换失败，请重试或先转为PNG/JPG'))},page));
   const converted=await read(output);
   if(nativeType(converted)!==extension)throw Error('图片转换结果无效，请重试');
   if(sizeOf(converted)<=limit)return {path:output,base64:converted,extension,size:sizeOf(converted)};
  }
  throw sizeError();
 }finally{canvas.width=canvas.height=1}
}
module.exports={select,normalize};
