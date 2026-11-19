const api=require('../../utils/api');
const uid=()=>Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
const today=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
Page({
 data:{busy:false,platformOpen:false,platformUsers:[],manualProject:false,projectName:'',creationMode:'dispatch',pushConfig:{enabled:false},tab:'tasks',tasks:[],projects:[],statistics:[],projectStatistics:[],notifications:[],user:{},projectIndex:0,leaderIndex:0,members:[],leaders:[],task:null,creating:false,scope:'self',legacy:null,from:'',to:'',selectedIds:[],confirmedIds:[],actualIds:[],reason:'',note:'',noHazard:false,hours:'8',form:{title:'现场巡查',site:'',workDate:today(),requiredPeople:'1'},contractPeople:'',basis:'',catalogId:'',message:'',stageNames:['1 工地信息 / 派单','2 现场检查','3 报告生成','4 工作认定']},
 onLoad(options){this.targetId=options?.taskId||'';this.initialMode=options?.mode||''},
 onShow(){this.reload()},
 async onPullDownRefresh(){try{await this.reload()}finally{wx.stopPullDownRefresh()}},
 async run(fn){if(this.data.busy)return;this.setData({busy:true});try{await fn()}catch(e){this.setData({message:e.status===404?'当前后台尚未安装本地新版流程，请使用配套本地服务。':e.message});wx.showModal({title:'任务提示',content:this.data.message,showCancel:false})}finally{this.setData({busy:false})}},
 async post(action,payload){const fingerprint=JSON.stringify({action,payload});if(this.pending?.fingerprint!==fingerprint)this.pending={fingerprint,id:uid()};const r=await api.request('/api/work/'+action,{...payload,requestId:this.pending.id});this.pending=null;return r},
 reload(){return this.run(()=>this.refresh())},
 async refresh(){const q='?scope='+this.data.scope+'&from='+encodeURIComponent(this.data.from)+'&to='+encodeURIComponent(this.data.to);const s=await api.request('/api/work/mobile-state'+q);const id=this.data.task?.id||this.targetId;const projectAccess=s.projects.map(p=>({id:p.id,name:p.name,canDispatch:['manager','admin'].includes(p.role),canAccept:['manager','admin','inspector'].includes(p.role),roleName:({manager:'项目经理',admin:'管理员',inspector:'检查员',rectifier:'整改人',reviewer:'复核人',receiver:'接收人',viewer:'查看者'})[p.role]||'项目成员',dispatchers:(p.members||[]).filter(m=>m.role==='manager').map(m=>m.name).join('、')}));this.setData({...s,projectAccess,message:'',unread:s.notifications.filter(n=>!n.readAt).length,platformOpen:s.canCreate===true,canCreate:s.canCreate===true||projectAccess.some(p=>p.canDispatch)});this.projectData();if(id){const t=s.tasks.find(t=>t.id===id);if(t)this.show(t);else this.setData({task:null})}this.targetId='';if(this.initialMode==='temporary'){this.initialMode='';this.temporaryView()}},
 tab(e){this.setData({tab:e.currentTarget.dataset.tab,task:null,creating:false})},
 input(e){this.setData({[e.currentTarget.dataset.key]:e.detail.value})},
 pick(e){this.setData({[e.currentTarget.dataset.key]:Number(e.detail.value)});if(e.currentTarget.dataset.key==='projectIndex')this.projectData()},
 checks(e){this.setData({[e.currentTarget.dataset.key]:e.detail.value})},
 noHazard(e){this.setData({noHazard:e.detail.value})},
 projectData(){const p=this.data.projects[this.data.projectIndex];const members=this.data.platformOpen?this.data.platformUsers:(p?.members||[]).filter(m=>['inspector','manager'].includes(m.role));const config=this.data.projectStatistics.find(x=>x.id===p?.id)?.config||{};this.setData({members,leaders:members,leaderIndex:0,projectCanManage:p?.role==='admin'||p?.role==='manager',contractPeople:config.contractPeople===undefined?'':String(config.contractPeople),basis:config.basis||'',catalogId:config.catalogId?String(config.catalogId):'',configRevision:config.revision||0})},
 createView(){if(this.data.platformOpen){this.setData({creating:true,task:null,creationMode:'dispatch',projectIndex:0,manualProject:!this.data.projects.length});this.projectData();this.setData({leaderIndex:Math.max(0,this.data.leaders.findIndex(p=>p.id===this.data.user.id))});return}const projectIndex=this.data.projects.findIndex(p=>['manager','admin'].includes(p.role));if(projectIndex<0){wx.showModal({title:'当前账号无派单权限',content:'请由该项目的项目经理本人登录派单，项目内具备巡查权限的人员可在任务发布后自主报名。',showCancel:false});return}this.setData({creating:true,task:null,projectIndex});this.projectData()},
 switchAccount(){return this.run(async()=>{if(!(await this.confirm('退出当前账号并返回登录页？请由需要测试的人员本人输入账号和密码。')))return;try{await api.request('/api/logout',{})}catch(e){if(e.status!==401)throw e}wx.removeStorageSync('token');api.reset();wx.reLaunch({url:'/pages/index/index'})})},
 temporaryView(){this.createView();if(this.data.creating)this.setData({creationMode:'temporary','form.title':'临时巡查','form.requiredPeople':'1'})},
 projectMode(e){this.setData({manualProject:e.detail.value==='manual'})},
 async create(){await this.run(async()=>{const p=this.data.projects[this.data.projectIndex];const temporary=this.data.creationMode==='temporary';const leader=temporary?this.data.user:this.data.leaders[this.data.leaderIndex];if((!this.data.manualProject&&!p)||!leader?.id)throw Error('请选择项目和组长');const projectName=this.data.projectName.trim();if(this.data.manualProject&&!projectName)throw Error('请填写项目名称');if(!this.data.form.title.trim()||!this.data.form.site.trim())throw Error('请填写任务名称和工地信息');const task=await this.post(temporary?'mobile-adhoc':'mobile-create',{...this.data.form,requiredPeople:temporary?1:Number(this.data.form.requiredPeople),...(this.data.manualProject?{projectName}:{projectId:p.id}),leaderId:leader.id});this.setData({creating:false});this.targetId=task.id;await this.refresh();if(temporary)wx.navigateTo({url:'/pages/work/work?taskId='+task.id})})},
 open(e){const task=this.data.tasks.find(t=>t.id===e.currentTarget.dataset.id);if(task)this.show(task)},
 show(task){const members=this.data.platformUsers?.length?this.data.platformUsers:this.data.projects.find(p=>p.id===task.projectId)?.members||[];this.setData({task,creating:false,confirmedIds:task.acceptedIds.slice(),actualIds:task.confirmedIds.slice(),selectedIds:[],reason:'',note:task.fieldSummary||'',noHazard:task.noHazard||false,acceptedPeople:task.acceptedPeople.map(p=>({...p,checked:true})),actualPeople:task.confirmedIds.map(id=>({id,name:members.find(m=>m.id===id)?.name||id,checked:true})),draftItems:[...task.issues.map(i=>({...i,kind:'隐患',text:(i.location?i.location+'：':'')+(i.description||'照片记录')})),...task.records.map(i=>({...i,kind:'现场记录'}))]})},
 back(){this.setData({task:null,creating:false})},
 confirm(content){return new Promise(resolve=>wx.showModal({title:'请核对',content,success:r=>resolve(!!r.confirm),fail:()=>resolve(false)}))},
 async action(action,payload={}){const t=this.data.task;await this.post(action,{taskId:t.id,revision:t.revision,...payload});await this.refresh()},
 accept(){return this.run(()=>this.action('mobile-accept'))},
 leaderStart(){return this.run(async()=>{const t=this.data.task;if(!t?.canLeaderStart)return;const reason=(this.data.reason||'').trim();if(t.requiredPeople>1&&!reason)throw Error('需求超过1人，请填写组长提前单人开始的原因');if(await this.confirm('确认由你本人直接开始巡查？本次最终检查名单仅包含你本人，计1人；其他报名人员不入选，确认后停止报名。'+(t.requiredPeople>1?'需求为'+t.requiredPeople+'人，提前单人开始原因：'+reason:'')))await this.action('mobile-leader-start',{reason})})},
 removeApplicant(e){
  const person=this.data.acceptedPeople.find(p=>p.id===e.currentTarget.dataset.id);
  if(!person||!this.data.task?.canConfirmRoster)return;
  return this.run(async()=>{
   if(!(await this.confirm('移除 '+person.name+' 的报名？该人员将不能重复报名本任务。')))return;
   const selected=this.data.confirmedIds.filter(id=>id!==person.id),reason=this.data.reason;
   await this.action('mobile-remove-applicant',{userId:person.id,reason});
   const confirmedIds=selected.filter(id=>this.data.task.acceptedIds.includes(id));
   this.setData({confirmedIds,reason,acceptedPeople:this.data.acceptedPeople.map(p=>({...p,checked:confirmedIds.includes(p.id)}))});
  });
 },
 roster(){return this.run(async()=>{if(await this.confirm('确认所选人员为最终检查名单？确认后停止报名、锁定名单并开始现场检查。'))await this.action('mobile-roster',{confirmedIds:this.data.confirmedIds,reason:this.data.reason})})},
 field(){wx.navigateTo({url:'/pages/work/work?taskId='+this.data.task.id})},
 complete(){return this.run(async()=>{if(await this.confirm('检查完成后草稿将锁定并交由组长筛选，是否继续？'))await this.action('mobile-complete',{noHazard:this.data.noHazard,text:this.data.note})})},
 returnDraft(){return this.run(()=>this.action('mobile-return',{text:this.data.reason}))},
 select(){return this.run(async()=>{if(await this.confirm('确认筛选清单？所选记录将生成待签字报告，未选记录保留在草稿记录中。'))await this.action('mobile-select',{selectedIds:this.data.selectedIds,reason:this.data.reason,noHazard:this.data.noHazard,text:this.data.note})})},
 report(){wx.navigateTo({url:'/pages/combined/combined?reportId='+this.data.task.combinedId})},
 reportList(){wx.navigateTo({url:'/pages/combined/combined'})},
 publish(){return this.run(async()=>{const r=await api.request('/api/work/combined-data/'+this.data.task.combinedId);if(await this.confirm('已签字 '+r.signedCount+' 人。确认各方均已核对本报告并正式发布？'))await this.action('mobile-publish',{contentHash:r.contentHash,reportRevision:r.revision})})},
 recognize(){return this.run(async()=>{if(await this.confirm('认定 '+this.data.actualIds.length+' 人，每人 '+this.data.hours+' 小时。确认后计入工作统计，不能重复认定。'))await this.action('mobile-recognize',{actualIds:this.data.actualIds,hoursPerPerson:Number(this.data.hours),text:this.data.note})})},
 async statsScope(e){this.setData({scope:e.currentTarget.dataset.scope,legacy:null});await this.reload()},
 legacyStats(){return this.run(async()=>{const legacy=await api.request('/api/work/mobile-legacy-statistics?scope='+this.data.scope+'&from='+encodeURIComponent(this.data.from)+'&to='+encodeURIComponent(this.data.to));this.setData({legacy})})},
 saveConfig(){return this.run(async()=>{const p=this.data.projects[this.data.projectIndex];await this.post('mobile-project-config',{projectId:p.id,revision:this.data.configRevision,contractPeople:Number(this.data.contractPeople),basis:this.data.basis,catalogId:this.data.catalogId?Number(this.data.catalogId):null});await this.refresh()})},
 read(e){return this.run(async()=>{await this.post('mobile-notification-read',{id:e.currentTarget.dataset.id});this.targetId=e.currentTarget.dataset.task;await this.refresh();this.setData({tab:'tasks'})})},
 async subscribe(){await this.run(async()=>{const config=this.data.pushConfig;if(!config.enabled)throw Error('微信订阅消息待配置，派单、名单确认和发布提醒仍可在本页消息中心查看。');const consent=await new Promise((resolve,reject)=>wx.requestSubscribeMessage({tmplIds:config.templateIds,success:resolve,fail:()=>reject(Error('订阅未完成，可继续使用站内提醒'))}));const login=await new Promise((resolve,reject)=>wx.login({success:resolve,fail:()=>reject(Error('微信登录失败'))}));await this.post('mobile-push-bind',{code:login.code,accepted:consent[config.templateIds[0]]==='accept'});wx.showToast({title:'订阅选择已保存',icon:'none'})})},
 history(){wx.navigateTo({url:'/pages/work/work'})}
});
