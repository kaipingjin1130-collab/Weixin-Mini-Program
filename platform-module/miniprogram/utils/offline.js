// Durable local drafts. No network request is needed to read or edit a draft.
const KEY='qaxc.offline.v1';
const clone=x=>JSON.parse(JSON.stringify(x));
const uid=()=>Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
function read(){const value=wx.getStorageSync(KEY);if(!value)return {version:1,context:null,drafts:[]};if(value.version!==1||!Array.isArray(value.drafts))throw Error('离线数据格式异常，请勿清除缓存，联系管理员');return clone(value)}
function write(value){try{wx.setStorageSync(KEY,value)}catch(e){throw Error('手机本地保存失败，可能空间不足。请保留当前页面并释放空间后重试')}return value}
function update(d){const db=read();const i=db.drafts.findIndex(x=>x.id===d.id);d=clone(d);d.updatedAt=new Date().toISOString();if(i<0)db.drafts.unshift(d);else db.drafts[i]=d;write(db);return d}
function get(id){const d=read().drafts.find(x=>x.id===id);if(!d)throw Error('未找到本地草稿');return d}
async function prepare(api){const s=await api.request('/api/work/state');const projects=s.projects.filter(p=>(s.user.isAdmin||s.user.id==='admin')||['manager','inspector'].includes(p.role)).map(p=>({id:p.id,name:p.name,contract:p.contract}));const scenario=s.scenarios.find(x=>x.id==='inspection');if(!scenario)throw Error('平台未提供巡查场景');const db=read();db.context={server:api.base(),user:{id:s.user.id,name:s.user.name},projects,scenario,downloadedAt:new Date().toISOString()};write(db);return db.context}
function create(projectId){const c=read().context;if(!c)throw Error('请先连接办公室后台，下载项目资料');const p=c.projects.find(x=>x.id===projectId);if(!p)throw Error('请选择项目');const date=new Date();const day=[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');return update({id:uid(),server:c.server,user:clone(c.user),project:clone(p),scenario:clone(c.scenario),title:'离线巡查 '+day,object:'',inspectors:c.user.name||'',date:day,fields:{},checklist:[],issues:[],editor:null,status:'draft',journal:{},createdAt:date.toISOString()})}
async function savePhoto(path){const fs=wx.getFileSystemManager();const dir=wx.env.USER_DATA_PATH+'/qaxc-offline';try{fs.mkdirSync(dir,true)}catch(e){try{fs.accessSync(dir)}catch(_){throw Error('无法创建手机照片目录，请检查存储空间')}}const dest=dir+'/'+uid()+(path.toLowerCase().endsWith('.png')?'.png':'.jpg');await new Promise((resolve,reject)=>fs.copyFile({srcPath:path,destPath:dest,success:resolve,fail:()=>reject(Error('照片未保存，手机空间可能不足，请重试'))}));return {id:uid(),path:dest,name:dest.endsWith('.png')?'现场照片.png':'现场照片.jpg',occurredAt:new Date().toISOString()}}
function validate(d){if(!d.title.trim())throw Error('请填写巡查名称');if(!d.inspectors.trim())throw Error('请填写检查人员');if(!d.issues.length)throw Error('请先保存至少一条隐患');if(d.editor)throw Error('请先保存正在编辑的隐患');if(d.scenario.checklist.some(x=>!d.checklist.includes(x)))throw Error('请逐项确认现场准备清单');for(const i of d.issues){if(!i.description.trim()||!i.risk.trim())throw Error('请补齐隐患描述和风险等级');if(d.scenario.workflow?.requireEvidence&&!i.photos.length)throw Error('每条隐患需要现场照片')} }
const active=new Set();
async function sync(id,api){if(active.has(id))throw Error('这份记录正在同步');active.add(id);try{
 let d=get(id);if(d.status==='synced')return d;validate(d);
 if(api.base()!==d.server)throw Error('服务地址与采集时不一致。请连接原办公室后台；如电脑 IP 变化，请联系管理员确认原后台地址');
 const state=await api.request('/api/work/state');if(state.user.id!==d.user.id)throw Error('请使用采集这份记录的原账号登录后同步');
 const p=state.projects.find(x=>x.id===d.project.id);if(!p||!((state.user.isAdmin||state.user.id==='admin')||['manager','inspector'].includes(p.role)))throw Error('当前账号已无该项目检查权限，本地记录保留');
 d.status='syncing';d.error='';update(d);
 async function step(key,action,payload){let op=d.journal[key];if(op?.done)return op.result;if(!op){op={requestId:'off-'+d.id+'-'+key,payload:clone(payload)};d.journal[key]=op;update(d)}const result=await api.request('/api/work/'+action,{...op.payload,requestId:op.requestId});op.done=true;op.result=result;update(d);return result}
 let t=await step('create','adhoc-tasks',{projectId:d.project.id,scenarioId:d.scenario.id,title:d.title,object:d.object,inspectors:d.inspectors,dueDate:d.date,fields:d.fields});
 t=await step('start','start',{taskId:t.id,revision:t.revision,checklist:d.scenario.checklist});
 for(const i of d.issues){const evidence=[];for(const photo of i.photos){const key='photo-'+photo.id;let ev=d.journal[key]?.result;if(!d.journal[key]?.done){const base64=await new Promise((resolve,reject)=>wx.getFileSystemManager().readFile({filePath:photo.path,encoding:'base64',success:r=>resolve(r.data),fail:()=>reject(Error('本地照片无法读取，请勿清理微信数据'))}));
 // Photo bytes live in the durable file, not in the small key/value store.
 let op=d.journal[key];if(!op){op={requestId:'off-'+d.id+'-'+key};d.journal[key]=op;update(d)}
 ev=await api.request('/api/work/upload',{projectId:d.project.id,name:photo.name,occurredAt:photo.occurredAt,base64,requestId:op.requestId});op.done=true;op.result=ev;update(d)}evidence.push(ev.id)}
 t=await step('issue-'+i.id,'issue',{taskId:t.id,revision:t.revision,category:i.category,subcategory:i.subcategory,location:i.location,description:i.description,reference:i.reference,suggestion:i.suggestion,risk:i.risk,evidence});}
 d.status='synced';d.taskId=t.id;d.taskNumber=t.number;d.syncedAt=new Date().toISOString();d.error='';update(d);return d;
 }catch(e){try{const d=get(id);if(d.status==='syncing'){d.status='pending';d.error=e.message;update(d)}}catch(_){}throw e}finally{active.delete(id)}}
async function rebind(id,api){const d=get(id);if(active.has(id))throw Error('请等待同步结束');const s=await api.request('/api/work/state');const p=s.projects.find(x=>x.id===d.project.id);if(s.user.id!==d.user.id||!p||p.name!==d.project.name||(p.contract||'')!==(d.project.contract||''))throw Error('账号或项目与原后台不一致，不能更换地址');const taskId=d.journal.create?.result?.id;if(taskId&&!s.tasks.some(t=>t.id===taskId))throw Error('新地址中未找到已同步的任务，不能更换地址');d.server=api.base();return update(d)}
module.exports={read,update,get,prepare,create,savePhoto,sync,rebind,uid};
