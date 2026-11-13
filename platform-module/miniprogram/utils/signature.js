// Select a local signature image; nothing is uploaded until the signer confirms.
const images=require('./image-import');
async function choose(page){
 const source=await new Promise((resolve,reject)=>wx.showActionSheet({itemList:['从相册选择签名图片','从聊天文件选择签名图片'],success:r=>resolve(r.tapIndex===1?'message':'album'),fail:e=>String(e.errMsg).includes('cancel')?resolve(null):reject(Error('无法选择签名图片'))}));
 if(!source)return null;
 const files=await images.select({source,count:1});
 return files.length?images.normalize(files[0],page,{signature:true}):null;
}
// Recheck before submission too, including images selected before a compatibility update.
async function prepare(image,page){return images.normalize(image,page,{signature:true})}
module.exports={choose,prepare};
