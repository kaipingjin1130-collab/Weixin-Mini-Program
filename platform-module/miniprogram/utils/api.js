let cache={};
function base(){return (wx.getStorageSync('server')||'https://fxbxcx.jkec.info/quality').replace(/\/$/,'')}
function token(){return wx.getStorageSync('token')||''}
function request(path,data){return new Promise((resolve,reject)=>wx.request({url:base()+path,method:data?'POST':'GET',header:{'Content-Type':'application/json','Authorization':'Bearer '+token()},data,timeout:30000,success:r=>{if(r.statusCode>=200&&r.statusCode<300)resolve(r.data);else{if(r.statusCode===401)wx.removeStorageSync('token');reject(Error((r.data&&r.data.error)||('请求失败，HTTP '+r.statusCode)))}},fail:e=>{const detail=String(e&&e.errMsg||'未知网络错误').slice(0,240);reject(Error('无法连接工作台\n服务地址：'+base()+'\n原因：'+detail))}}))}
function upload(path){return new Promise((resolve,reject)=>wx.getFileSystemManager().readFile({filePath:path,encoding:'base64',success:r=>request('/api/media',{base64:r.data}).then(x=>resolve(x.id),reject),fail:()=>reject(Error('无法读取照片，请重新拍摄'))}))}
function media(id){if(cache[id])return Promise.resolve(cache[id]);return new Promise((resolve,reject)=>wx.downloadFile({url:base()+'/media/'+id,header:{Authorization:'Bearer '+token()},success:r=>{if(r.statusCode!==200){reject(Error('照片下载失败'));return}cache[id]=r.tempFilePath;resolve(r.tempFilePath)},fail:()=>reject(Error('照片下载失败，请检查网络'))}))}
async function images(report){let ids=[...new Set([report.signature,...(report.signatures||[]).map(s=>s.signature),...report.issues.flatMap(i=>i.photos)].filter(Boolean))];let result={};for(let id of ids)result[id]=await media(id);return result}
function reset(){cache={}}
module.exports={base,request,upload,images,reset};
