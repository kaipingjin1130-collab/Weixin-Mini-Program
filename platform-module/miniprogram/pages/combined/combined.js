const api=require('../../utils/api');
const uid=()=>Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
Page({
 data:{busy:false,rows:[],reports:[],selected:[],report:null,members:[],recipientIndex:0,message:''},
 onShow(){clearInterval(this.timer);this.reload();this.timer=setInterval(()=>this.poll(),5000)},
 onHide(){clearInterval(this.timer)},
 onUnload(){clearInterval(this.timer)},
 async run(fn){if(this.data.busy)return;this.setData({busy:true});try{await fn()}catch(e){this.setData({message:e.message});wx.showModal({title:'报告提示',content:e.message,showCancel:false})}finally{this.setData({busy:false})}},
 async post(action,payload){const fingerprint=JSON.stringify({action,payload});if(this.pending?.fingerprint!==fingerprint)this.pending={fingerprint,id:uid()};const value=await api.request('/api/work/'+action,{...payload,requestId:this.pending.id});this.pending=null;return value},
 async refresh(){let reports;try{reports=await api.request('/api/work/combined-list')}catch(e){if(e.status===404){this.unavailable=true;throw Error('当前后台尚未更新合并报告功能，请完成后台部署后再刷新')}throw e}this.unavailable=false;const [rows,state]=await Promise.all([api.request('/api/work/leader-inbox'),api.request('/api/work/state')]);this.state=state;this.setData({rows,reports,message:''})},
 reload(){this.unavailable=false;return this.run(()=>this.refresh())},
 select(e){this.setData({selected:e.detail.value})},
 async create(){await this.run(async()=>{if(!this.data.selected.length)throw Error('请选择同一项目的报告，每个任务保留一个版本');const report=await this.post('combined-create',{keys:this.data.selected});await this.refresh();this.show(report)})},
 open(e){return this.run(async()=>{this.show(await api.request('/api/work/combined-data/'+e.currentTarget.dataset.id))})},
 show(report){const members=this.state?.projects.find(p=>p.id===report.projectId)?.members||[];report.report.issues=report.report.issues.map((i,n)=>({...i,displayId:'issue-'+n}));report.report.signatures=report.report.signatures.map((i,n)=>({...i,displayId:'signature-'+n}));this.ctx=null;this.ink=false;this.setData({report,members,recipientIndex:Math.max(0,members.findIndex(m=>m.id===report.recipientId)),message:'每5秒同步签字状态'},()=>this.clear())},
 back(){this.setData({report:null});this.reload()},
 recipient(e){this.setData({recipientIndex:Number(e.detail.value)})},
 async assign(){await this.run(async()=>{const r=this.data.report;const member=this.data.members[this.data.recipientIndex];if(!member)throw Error('请先将签名人账号加入本项目');this.show(await this.post('combined-assign',{combinedId:r.id,revision:r.revision,recipientId:member.id}))})},
 init(){this.ctx=wx.createCanvasContext('recipientSignature',this);this.ctx.setStrokeStyle('#193b30');this.ctx.setLineWidth(3);this.ctx.setLineCap('round')},
 start(e){if(this.data.busy)return;if(!this.ctx)this.init();this.last=e.touches[0]},
 move(e){if(this.data.busy||!this.last)return;const p=e.touches[0];this.ctx.beginPath();this.ctx.moveTo(this.last.x,this.last.y);this.ctx.lineTo(p.x,p.y);this.ctx.stroke();this.ctx.draw(true);this.last=p;this.ink=true},
 end(){this.last=null},
 clear(){this.last=null;this.ink=false;if(this.data.report?.canSign){this.init();this.ctx.clearRect(0,0,2000,2000);this.ctx.draw()}},
 async sign(){await this.run(async()=>{if(!this.ink)throw Error('请本人手写签名');const confirmed=await new Promise(resolve=>wx.showModal({title:'确认签署',content:'确认已核对整份隐患清单，并以被检查单位负责人身份签署？',success:r=>resolve(r.confirm),fail:()=>resolve(false)}));if(!confirmed)return;const path=await new Promise((resolve,reject)=>wx.canvasToTempFilePath({canvasId:'recipientSignature',fileType:'png',success:r=>resolve(r.tempFilePath),fail:()=>reject(Error('签名读取失败'))},this));const base64=await new Promise((resolve,reject)=>wx.getFileSystemManager().readFile({filePath:path,encoding:'base64',success:r=>resolve(r.data),fail:()=>reject(Error('签名读取失败'))}));const r=this.data.report;this.show(await this.post('combined-sign',{combinedId:r.id,revision:r.revision,contentHash:r.contentHash,base64,confirmed:true}));await this.refresh()})},
 async poll(){if(this.unavailable||this.data.busy||this.polling)return;this.polling=true;try{if(this.data.report){const report=await api.request('/api/work/combined-data/'+this.data.report.id);if(this.data.busy)return;if(this.data.report&&report.id===this.data.report.id&&report.revision>this.data.report.revision){this.show(report);this.setData({message:'签字状态已更新，请重新核对后签署'})}}else{await this.refresh()}}catch(e){this.setData({message:'同步失败：'+e.message})}finally{this.polling=false}},
 async download(url){return new Promise((resolve,reject)=>wx.downloadFile({url:api.base()+url,header:{Authorization:'Bearer '+wx.getStorageSync('token')},success:r=>r.statusCode===200?resolve(r.tempFilePath):reject(Error('文件不存在或无权限')),fail:()=>reject(Error('下载失败，请检查后台连接'))}))},
 async photo(e){await this.run(async()=>{const ref=e.currentTarget.dataset.ref;const [kind,...parts]=ref.split(':');const url=kind==='media'?'/media/'+parts.join(':'):'/api/work/evidence/'+parts.join(':');wx.previewImage({urls:[await this.download(url)]})})},
 async word(){await this.run(async()=>{const path=await this.download('/api/work/combined-word/'+this.data.report.id);await new Promise((resolve,reject)=>wx.openDocument({filePath:path,fileType:'docx',showMenu:true,success:resolve,fail:()=>reject(Error('Word预览失败，请在网页下载'))}))})}
});
