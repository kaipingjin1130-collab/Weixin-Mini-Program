// Select a local signature image; nothing is uploaded until the signer confirms.
async function choose(){
 const result=await new Promise((resolve,reject)=>wx.chooseMedia({count:1,mediaType:['image'],sourceType:['album'],sizeType:['original'],success:resolve,fail:e=>String(e.errMsg).includes('cancel')?resolve(null):reject(Error('无法选择签名图片'))}));
 if(!result)return null;
 const file=result.tempFiles[0];if(file.size>1400000)throw Error('签名图片请控制在1.4MB以内，支持PNG/JPG');
 const base64=await new Promise((resolve,reject)=>wx.getFileSystemManager().readFile({filePath:file.tempFilePath,encoding:'base64',success:r=>resolve(r.data),fail:()=>reject(Error('签名图片读取失败'))}));
 if(base64.length>2000000)throw Error('签名图片过大，请压缩后重试');
 return {path:file.tempFilePath,base64};
}
module.exports={choose};
