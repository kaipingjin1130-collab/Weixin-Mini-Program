const api=require('../../utils/api');
const signatureImage=require('../../utils/signature');
const uid=()=>Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
Page({
 onLoad(options){this.targetId=options?.reportId||""},
 data:{busy:false,rows:[],reports:[],workflowReports:[],workflowPending:[],selected:[],report:null,members:[],managerIds:[],recipientIds:[],guestName:'',guestUnit:'',guestTarget:'',canDraw:false,signingImagePath:'',message:'',publication:{}},
 onShow(){clearInterval(this.timer);this.reload();this.timer=setInterval(()=>this.poll(),5000)},
 onHide(){clearInterval(this.timer)},
 onUnload(){clearInterval(this.timer)},
 async run(fn){if(this.data.busy)return;this.setData({busy:true});try{await fn()}catch(e){this.setData({message:e.message});wx.showModal({title:'报告提示',content:e.message,showCancel:false})}finally{this.setData({busy:false})}},
 async post(action,payload){const fingerprint=JSON.stringify({action,payload});if(this.pending?.fingerprint!==fingerprint)this.pending={fingerprint,id:uid()};const value=await api.request('/api/work/'+action,{...payload,requestId:this.pending.id});this.pending=null;return value},
 async refresh(){let reports;try{reports=await api.request('/api/work/combined-list')}catch(e){if(e.status===404){this.unavailable=true;throw Error('当前后台尚未更新合并报告功能，请完成后台部署后再刷新')}throw e}this.unavailable=false;const [inbox,state]=await Promise.all([api.request('/api/work/leader-inbox'),api.request('/api/work/state')]);this.state=state;const tasks=state.tasks||[];const isWorkflow=row=>row.workflowVersion===2||tasks.some(t=>t.id===row.taskId&&t.workflowVersion===2);const rows=inbox.filter(row=>!isWorkflow(row));const decorated=reports.map(r=>{const task=this.reportTask(r);return {...r,workflowVersion:task?.workflowVersion||r.workflowVersion,taskId:task?.id||r.taskId,publishedAt:r.publishedAt||task?.publishedAt||'',taskTitle:task?.title||''}});const workflowPending=[...new Map(inbox.filter(isWorkflow).map(row=>{const task=tasks.find(t=>t.id===row.taskId);return [row.taskId,{...row,combinedId:task?.combinedId||''}]})).values()].filter(row=>!row.combinedId);this.setData({rows,reports:decorated.filter(r=>r.workflowVersion!==2),workflowReports:decorated.filter(r=>r.workflowVersion===2),workflowPending,selected:this.data.selected.filter(key=>rows.some(row=>row.key===key)),message:''})},
 reportTask(report){return (this.state?.tasks||[]).find(t=>t.combinedId===report.id||(report.taskId&&t.id===report.taskId))},
 publication(report){const task=this.reportTask(report);const isWorkflow=report.workflowVersion===2||task?.workflowVersion===2;if(!isWorkflow)return {isWorkflow:false};const temporary=!!report.temporaryInspection||task?.source==='adhoc';const user=this.state?.user||{};const role=this.state?.projects?.find(p=>p.id===report.projectId)?.role;const canManage=!!task&&(user.isAdmin===true||user.id==='admin'||task.createdBy===user.id||['manager','admin'].includes(role)||task.leaderId===user.id);const people=[...(report.signers||[]),...(report.guestSigners||[])];const signed=new Set(people.filter(p=>p.signature).map(p=>p.userId));const required=[...(task?.confirmedIds||report.requiredInspectorIds||[]),task?.leaderId||report.requiredLeaderId].filter(Boolean);const hasRecipient=people.some(p=>['被检查人','被检查单位负责人'].includes(p.role));const allSigned=people.length>0&&people.every(p=>p.signature)&&required.every(id=>signed.has(id));const published=!!(report.publishedAt||task?.publishedAt);const ready=canManage&&!published&&task.stage==='signing'&&hasRecipient&&allSigned;let reason=published?'已发布，报告内容和签字已锁定。':!task?'任务信息未加载，请刷新后重试。':!hasRecipient?'请先添加至少一位被检查人并由本人签字。':!allSigned?'请完成检查名单全员、组长和被检查人的签字。':!canManage?'签字已齐，请由组长或项目经理确认发布。':task.stage!=='signing'?'请进入任务工作台核对当前阶段。':'各方签字已齐，可核对后确认发布。';if(temporary){reason=published?'正式报告已生成，内容和签字已锁定。':!hasRecipient?'请添加被检查人账号，或在下方新增现场签字位置。':!allSigned?'请检查人和被检查人核对清单并完成各自签字。':!canManage?'各方已签齐，请临时巡查发起人生成正式报告。':'各方已签齐，可直接生成正式报告，无需项目负责人审批。'}return {isWorkflow,temporary,taskId:task?.id||report.taskId,canManage,published,ready,reason}},
 reload(){this.unavailable=false;return this.run(async()=>{await this.refresh();if(this.targetId){this.show(await api.request('/api/work/combined-data/'+this.targetId));this.targetId=''}})},
 select(e){this.setData({selected:e.detail.value.filter(key=>this.data.rows.some(row=>row.key===key))})},
 async create(){await this.run(async()=>{if(!this.data.selected.length)throw Error('请选择同一项目的历史报告，每个任务保留一个版本');if(this.data.selected.some(key=>!this.data.rows.some(row=>row.key===key)))throw Error('新流程报告请直接查看、签字和发布，无需合并。请刷新列表。');const report=await this.post('combined-create',{keys:this.data.selected});await this.refresh();this.show(report)})},
 openTask(e){const taskId=e?.currentTarget?.dataset?.task||this.data.publication.taskId;if(taskId)wx.navigateTo({url:'/pages/tasks/tasks?taskId='+encodeURIComponent(taskId)})},
 publish(){return this.run(async()=>{if(this.ink||this.signImage)throw Error('请先提交当前签名，再核对发布');const reviewed=this.data.report;if(!reviewed)throw Error('请先打开并核对报告');const [state,current]=await Promise.all([api.request('/api/work/state'),api.request('/api/work/combined-data/'+reviewed.id)]);this.state=state;if(current.revision!==reviewed.revision||current.contentHash!==reviewed.contentHash){this.show(current);throw Error('报告或签字状态已变化，请重新核对后发布')}const publication=this.publication(current);if(!publication.ready){this.show(current);throw Error(publication.reason||'当前报告不能发布')}const task=this.reportTask(current);const confirmed=await new Promise(resolve=>wx.showModal({title:publication.temporary?'生成正式报告':'确认发布报告',content:'确认已核对《'+current.title+'》及各方签字？生成正式报告后内容和签字将锁定。',success:r=>resolve(!!r.confirm),fail:()=>resolve(false)}));if(!confirmed)return;await this.post('mobile-publish',{taskId:task.id,revision:task.revision,contentHash:reviewed.contentHash,reportRevision:reviewed.revision});await this.refresh();this.show(await api.request('/api/work/combined-data/'+reviewed.id))})},
 open(e){return this.run(async()=>{this.show(await api.request('/api/work/combined-data/'+e.currentTarget.dataset.id))})},
 show(report,preserveInk=false){
  const managerIds=(report.coSigners||[]).filter(p=>p.role==='项目负责人').map(p=>p.userId);
  if(report.canAssign&&!managerIds.length&&!report.temporaryInspection)managerIds.push(report.createdBy);
  const recipientIds=[report.recipientId,...(report.coSigners||[]).filter(p=>p.role==='被检查人').map(p=>p.userId)].filter(Boolean);
  const members=(report.workflowVersion===2?this.state?.platformUsers||[]:this.state?.projects.find(p=>p.id===report.projectId)?.members||[]).map(m=>({...m,managerChecked:managerIds.includes(m.id),recipientChecked:recipientIds.includes(m.id)}));
  report.report.issues=report.report.issues.map((i,n)=>({...i,displayId:'issue-'+n}));report.report.signatures=report.report.signatures.map((i,n)=>({...i,displayId:'signature-'+n}));
  const target=(report.guestSigners||[]).find(p=>p.id===this.data.guestTarget&&!p.signature);
  const guestTarget=target&&report.canCollectGuest?target.id:'';
  if(!preserveInk){this.ctx=null;this.ink=false;this.signImage=null}
  this.setData({report,publication:this.publication(report),members,managerIds,recipientIds,guestTarget,canDraw:!!(guestTarget||report.canSign),targetName:guestTarget?target.name:'本人',targetRole:guestTarget?target.role:report.myRole,targetUnit:guestTarget?target.unit:'',...(!preserveInk?{signingImagePath:''}:{}),message:'共享同一份报告，每5秒同步各人的签字状态'},()=>{if(!preserveInk)this.clear()});
 },
 async discard(){if(!this.ink&&!this.signImage)return true;return new Promise(resolve=>wx.showModal({title:'尚未提交签名',content:'切换后当前未提交的签名将清除，是否继续？',success:r=>resolve(r.confirm),fail:()=>resolve(false)}))},
 async back(){if(!await this.discard())return;this.signImage=null;this.ink=false;this.setData({report:null,guestTarget:''});this.reload()},
 managers(e){this.setData({managerIds:e.detail.value})},
 recipients(e){this.setData({recipientIds:e.detail.value})},
 guestInput(e){this.setData({[e.currentTarget.dataset.key]:e.detail.value})},
 async assign(){await this.run(async()=>{if(!await this.discard())return;const r=this.data.report;this.show(await this.post('combined-assign',{combinedId:r.id,revision:r.revision,managerIds:this.data.managerIds,recipientIds:this.data.recipientIds}))})},
 async addGuest(){await this.run(async()=>{if(!await this.discard())return;const report=await this.post('combined-guest-add',{combinedId:this.data.report.id,name:this.data.guestName.trim(),unit:this.data.guestUnit.trim()});this.show(report);this.setData({guestName:'',guestUnit:''})})},
 async signGuest(e){if(this.data.busy||!await this.discard())return;const person=(this.data.report.guestSigners||[]).find(p=>p.id===e.currentTarget.dataset.id);if(!person||person.signature||!this.data.report.canCollectGuest)return;this.setData({guestTarget:person.id,canDraw:true,targetName:person.name,targetRole:person.role,targetUnit:person.unit},()=>this.clear())},
 async signSelf(){if(this.data.busy||!await this.discard())return;this.setData({guestTarget:'',canDraw:this.data.report.canSign,targetName:'本人',targetRole:this.data.report.myRole,targetUnit:''},()=>this.clear())},
 async insertSign(){await this.run(async()=>{const image=await signatureImage.choose(this);if(!image)return;this.signImage=image;this.ink=false;this.setData({signingImagePath:image.path})})},
 init(){this.ctx=wx.createCanvasContext('recipientSignature',this);this.ctx.setStrokeStyle('#193b30');this.ctx.setLineWidth(3);this.ctx.setLineCap('round')},
 start(e){if(this.data.busy)return;if(!this.ctx)this.init();this.last=e.touches[0]},
 move(e){if(this.data.busy||!this.last)return;const p=e.touches[0];this.ctx.beginPath();this.ctx.moveTo(this.last.x,this.last.y);this.ctx.lineTo(p.x,p.y);this.ctx.stroke();this.ctx.draw(true);this.last=p;this.ink=true},
 end(){this.last=null},
 clear(){this.last=null;this.ink=false;this.signImage=null;this.setData({signingImagePath:''},()=>{if(this.data.canDraw){this.init();this.ctx.clearRect(0,0,2000,2000);this.ctx.draw()}})},
 async sign(){await this.run(async()=>{
  if(!this.ink&&!this.signImage)throw Error('请手写签名或插入电子签名图片');
  const r=this.data.report;const guest=(r.guestSigners||[]).find(p=>p.id===this.data.guestTarget);
  const content=guest?'请将手机交给'+guest.unit+'的'+guest.name+'本人核对完整报告及签名，确认以被检查人身份签署？':'确认已核对整份报告和签名，并以'+(r.myRole||'会签人')+'身份签署？';
  const confirmed=await new Promise(resolve=>wx.showModal({title:'本人确认签署',content,success:r=>resolve(r.confirm),fail:()=>resolve(false)}));if(!confirmed)return;
  if(this.signImage){this.signImage=await signatureImage.prepare(this.signImage,this);this.setData({signingImagePath:this.signImage.path})}
  const path=this.signImage?.path||await new Promise((resolve,reject)=>wx.canvasToTempFilePath({canvasId:'recipientSignature',fileType:'png',success:r=>resolve(r.tempFilePath),fail:()=>reject(Error('签名读取失败'))},this));
  const base64=this.signImage?.base64||await new Promise((resolve,reject)=>wx.getFileSystemManager().readFile({filePath:path,encoding:'base64',success:r=>resolve(r.data),fail:()=>reject(Error('签名读取失败'))}));
  const payload={combinedId:r.id,revision:r.revision,contentHash:r.contentHash,base64,confirmed:true,signMethod:this.signImage?'image':'draw'};
  if(guest){payload.guestSignerId=guest.id;payload.slotHash=guest.slotHash}else payload.assignmentHash=r.assignmentHash;
  this.show(await this.post(guest?'combined-guest-sign':'combined-sign',payload));await this.refresh();
 })},
 async poll(){if(this.unavailable||this.data.busy||this.polling)return;this.polling=true;try{if(this.data.report){const report=await api.request('/api/work/combined-data/'+this.data.report.id);if(this.data.busy)return;const previous=this.data.report;if(previous&&report.id===previous.id&&report.revision>previous.revision){
  const guest=(report.guestSigners||[]).find(p=>p.id===this.data.guestTarget);const oldGuest=(previous.guestSigners||[]).find(p=>p.id===this.data.guestTarget);
  const sameSlot=this.data.guestTarget?guest&&!guest.signature&&report.canCollectGuest&&guest.slotHash===oldGuest?.slotHash:report.canSign&&report.assignmentHash&&report.assignmentHash===previous.assignmentHash;
  const preserve=!!((this.ink||this.last||this.signImage)&&report.contentHash===previous.contentHash&&sameSlot);this.show(report,preserve);this.setData({message:preserve?'其他人员签字已同步，当前未提交的签名已保留':'签字状态已更新，请核对后签署'});
 }}else{await this.refresh()}}catch(e){this.setData({message:'同步失败：'+e.message})}finally{this.polling=false}},
 async download(url){return new Promise((resolve,reject)=>wx.downloadFile({url:api.base()+url,header:{Authorization:'Bearer '+wx.getStorageSync('token')},success:r=>r.statusCode===200?resolve(r.tempFilePath):reject(Error('文件不存在或无权限')),fail:()=>reject(Error('下载失败，请检查后台连接'))}))},
 async photo(e){await this.run(async()=>{const ref=e.currentTarget.dataset.ref;const [kind,...parts]=ref.split(':');const url=kind==='media'?'/media/'+parts.join(':'):'/api/work/evidence/'+parts.join(':');wx.previewImage({urls:[await this.download(url)]})})},
 async word(){await this.run(async()=>{const path=await this.download('/api/work/combined-word/'+this.data.report.id);await new Promise((resolve,reject)=>wx.openDocument({filePath:path,fileType:'docx',showMenu:true,success:resolve,fail:()=>reject(Error('Word预览失败，请在网页下载'))}))})}
});
