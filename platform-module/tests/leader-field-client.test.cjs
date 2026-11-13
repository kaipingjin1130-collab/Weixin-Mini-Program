const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),test=require('node:test'),path=require('node:path');
function setup(fail=false){
 let definition;const calls=[];
 let task={id:'task1',projectId:'p1',revision:3,status:'active',fieldStatus:'collecting',assignee:'inspector',receiver:'receiver',records:[],issues:[],scenario:{recordTypes:['巡查记录'],checklist:[]},materials:[],fieldBriefs:[]};
 const state=()=>({user:{id:'inspector',name:'现场员'},projects:[{id:'p1',name:'项目',role:'inspector',members:[]}],tasks:[task],scenarios:[],reminders:[],users:[]});
 const api={request:async(url,data)=>{calls.push({url,data});if(url==='/api/work/state')return state();if(fail)throw Error('服务暂时不可用');task={...task,revision:task.revision+1};if(url.endsWith('/issue'))task.issues=[...task.issues,{...data,id:'i'+(task.issues.length+1),status:'unassigned'}];if(url.endsWith('/record'))task.records=[{...data,id:'r1',status:data.confirm?'confirmed':'draft'}];if(url.endsWith('/submit-field'))task.fieldStatus='submitted';return task}};
 const signatureImage={choose:async()=>null,prepare:async image=>image};
 const wx={showModal:o=>o.success?.({confirm:true}),showToast:()=>{},enableAlertBeforeUnload:()=>{},disableAlertBeforeUnload:()=>{}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../miniprogram/pages/work/work.js'),'utf8'),{require:name=>name.endsWith('/signature')?signatureImage:name.endsWith('/image-import')?{select:async o=>{const r=await new Promise(resolve=>wx.chooseMedia({...o,sourceType:[o.source],success:resolve}));return r.tempFiles},normalize:async f=>({path:f.tempFilePath,extension:'jpg'})}:api,Page:d=>definition=d,wx,console});
 const p={...definition,data:JSON.parse(JSON.stringify(definition.data))};
 p.setData=values=>{for(const [key,value] of Object.entries(values)){const keys=key.split('.');let obj=p.data;for(const k of keys.slice(0,-1))obj=obj[k]??(obj[k]={});obj[keys.at(-1)]=value}};
 p.setData(state());p.setTask(task);p.data.record={type:'巡查记录',text:'现场检查内容',occurredAt:'2026-10-20T09:00:00+08:00',evidence:['photo1']};p.data.evidence=[{id:'photo1',selected:true}];
 return {p,calls,wx,api,signatureImage};
}

test('same-text reminders retain distinct task links and unique rendering keys',async()=>{
 const {p,api}=setup();p.data.task=null;
 api.request=async()=>({user:{id:'admin',isAdmin:true},projects:[],tasks:[],scenarios:[],users:[],reminders:[{taskId:'a',text:'临时巡查：任务逾期'},{taskId:'b',text:'临时巡查：任务逾期'},{taskId:'a',text:'临时巡查：任务逾期'}]});
 await p.refresh();assert.equal(new Set(p.data.reminders.map(r=>r.displayId)).size,3);
 assert.deepEqual(Array.from(p.data.reminders,r=>r.taskId),['a','b','a']);
});
test('field client confirms record with revision and stable evidence; clears saved selections',async()=>{
 const {p,calls}=setup();await p.saveRecord({currentTarget:{dataset:{confirm:'yes'}}});
 const req=calls.find(c=>c.url.endsWith('/record'));assert.equal(req.data.taskId,'task1');assert.equal(req.data.revision,3);assert.equal(req.data.confirm,true);assert.deepEqual([...req.data.evidence],['photo1']);assert.ok(req.data.requestId);
 assert.equal(p.data.record.text,'');assert.equal(p.data.evidence[0].selected,false);assert.equal(p.data.task.revision,4);
});
test('failed field save preserves text and attachments for retry',async()=>{
 const {p}=setup(true);await p.saveRecord({currentTarget:{dataset:{confirm:'yes'}}});assert.equal(p.data.record.text,'现场检查内容');assert.deepEqual([...p.data.record.evidence],['photo1']);assert.equal(p.data.task.revision,3);assert.equal(p.data.busy,false);
});
test('field submission uses separate handoff endpoint and makes collection read-only',async()=>{
 const {p,calls}=setup();p.data.task.issues=[{id:'saved1'}];p.data.inspectors='检查员';p.data.signer='检查员';p.data.signature='sign1';p.data.note='现场摘要';p.data.record={text:'',evidence:[]};await p.submitField();
 assert.equal(calls[0].url,'/api/work/submit-field');assert.equal(calls[0].data.text,'现场摘要');assert.equal(p.data.canCollect,false);assert.equal(p.data.task.fieldStatusName,'待平台接收');
 assert.equal(p.deliver,undefined);assert.equal(p.issueAction,undefined);assert.equal(p.archive,undefined);
});
test('field problem has no assignment controls in submitted payload',async()=>{
 const {p,calls}=setup();p.data.issue={description:'防护缺失',location:'三层',evidence:['own-photo'],assignee:'must-not-send',reviewer:'must-not-send'};
 await p.addIssue();const req=calls.find(c=>c.url.endsWith('/issue'));
 assert.equal(req.data.description,'防护缺失');assert.equal(req.data.assignee,undefined);assert.equal(req.data.reviewer,undefined);
});
test('ad hoc creation only offers inspection projects and keeps management fields out of request',async()=>{
 const {p,calls}=setup();
 p.data.projects.push({id:'other',name:'仅整改项目',role:'rectifier',members:[]});
 p.data.scenarios=[{id:'inspection',name:'质量安全巡查',fields:['检查区域','检查重点']}];
 p.prepareAdhoc();assert.equal(p.data.view,'create');assert.deepEqual(p.data.eligibleProjects.map(x=>x.id),['p1']);
 p.data.newTask={title:'临时巡查',object:'三号楼',dueDate:'2026-10-22',receiver:'must-not-send',assignee:'must-not-send'};
 p.data.fieldValues={'检查区域':'三层','检查重点':'防护'};
 await p.createAdhoc();
 const req=calls.find(c=>c.url.endsWith('/adhoc-tasks'));
 assert.equal(req.data.projectId,'p1');assert.equal(req.data.scenarioId,'inspection');
 assert.equal(req.data.receiver,undefined);assert.equal(req.data.assignee,undefined);
 assert.equal(p.data.view,'detail');
});
test('failed ad hoc creation keeps form for correction or retry',async()=>{
 const {p}=setup(true);p.data.scenarios=[{id:'inspection',name:'巡查'}];p.prepareAdhoc();
 p.data.newTask.object='保留的检查对象';await p.createAdhoc();
 assert.equal(p.data.view,'create');assert.equal(p.data.newTask.object,'保留的检查对象');assert.equal(p.data.busy,false);
});

test('structured hazard keeps its own photos and resets after saving',async()=>{
 const {p,calls}=setup();p.data.issue={category:'工程质量',subcategory:'混凝土',location:'三层',description:'裂缝',reference:'已核实条款',suggestion:'检查处理',evidence:['own-photo']};p.data.riskIndex=2;
 await p.addIssue();const req=calls.find(c=>c.url.endsWith('/issue'));assert.equal(req.data.location,'三层');assert.equal(req.data.risk,'高');assert.deepEqual([...req.data.evidence],['own-photo']);assert.equal(req.data.reference,'已核实条款');assert.equal(p.data.issue.description,'');assert.deepEqual([...p.data.record.evidence],['photo1']);
});
test('failed hazard save retains fields and photos',async()=>{
 const {p}=setup(true);p.data.issue={location:'三层',description:'裂缝',evidence:['own-photo']};await p.addIssue();assert.equal(p.data.issue.location,'三层');assert.equal(p.data.issue.evidence[0],'own-photo');
});
test('unsaved hazard blocks submission that would lock editing',async()=>{
 const {p,calls}=setup();p.data.record={text:'',evidence:[]};p.data.task.issues=[{id:'saved1'}];p.data.issue.description='未保存隐患';await p.submitField();assert.equal(calls.length,0);
});
test('camera and album upload directly to hazard without polluting record',async()=>{
 const {p,wx}=setup();const options=[];wx.chooseMedia=o=>{options.push(o);o.success({tempFiles:[{tempFilePath:'/photo.jpg',size:100}]})};const uploads=[];p.uploadPath=async(...args)=>uploads.push(args);
 await p.photo({currentTarget:{dataset:{source:'camera',target:'issue'}}});await p.photo({currentTarget:{dataset:{source:'album',target:'issue'}}});assert.equal(options[0].sourceType[0],'camera');assert.equal(options[0].count,1);assert.equal(options[1].count,9);assert.equal(uploads[0][2],'issue');
});

test('unsigned optional checklist can be submitted',async()=>{const {p,calls}=setup();p.data.record={text:'',evidence:[]};p.data.task.issues=[{id:'saved1'}];p.data.inspectors='张三';p.data.signer='张三';await p.submitField();assert.ok(calls.some(c=>c.url.endsWith('/submit-field')))});
test('failed signature upload retains drawing for retry',async()=>{const {p,wx}=setup(true);p.signDirty=true;wx.canvasToTempFilePath=o=>o.success({tempFilePath:'/sign.png'});wx.getFileSystemManager=()=>({readFile:o=>o.success({data:'image'})});await assert.rejects(()=>p.captureSign());assert.equal(p.signDirty,true)});

test('multiple saved hazards collapse individually and retain distinct photos',async()=>{
 const {p}=setup();
 for(let n=1;n<=2;n++){
  p.data.issue={description:'隐患'+n,evidence:['photo'+n]};
  await p.addIssue();
  assert.equal(p.data.expandedIssueId,'');
  assert.equal(p.data.issue.description,'');
 }
 assert.equal(p.data.task.issues.length,2);
 assert.equal(p.data.task.issues[0].evidence[0],'photo1');
 assert.equal(p.data.task.issues[1].evidence[0],'photo2');
 p.toggleIssue({currentTarget:{dataset:{id:'i1'}}});assert.equal(p.data.expandedIssueId,'i1');
 p.toggleIssue({currentTarget:{dataset:{id:'i1'}}});assert.equal(p.data.expandedIssueId,'');
});

test('empty checklist can submit without inventing no-hazard conclusion',async()=>{const {p,calls}=setup();p.data.record={text:'',evidence:[]};await p.submitField();assert.equal(calls[0].data.noHazard,false)});

test('explicit no-hazard conclusion can submit without issues',async()=>{
 const {p,calls}=setup();p.data.record={text:'',evidence:[]};p.data.noHazard=true;p.data.note='检查二层未发现隐患';p.data.inspectors='张三';p.data.signer='张三';p.data.signature='sign';await p.submitField();assert.equal(calls[0].data.noHazard,true);
});
test('no-hazard conclusion cannot contradict saved issues',async()=>{const {p,calls}=setup();p.data.record={text:'',evidence:[]};p.data.noHazard=true;p.data.task.issues=[{id:'existing'}];await p.submitField();assert.equal(calls.length,0)});

test('editing saved issue uses edit endpoint and resets after success',async()=>{
 const {p,calls}=setup();p.data.editingIssueId='existing';p.data.issue={description:'修改隐患',evidence:['photo']};await p.addIssue();const req=calls.find(c=>c.url.endsWith('/edit-issue'));assert.equal(req.data.issueId,'existing');assert.equal(p.data.editingIssueId,'');
});
test('failed edit preserves editing identity and contents',async()=>{
 const {p}=setup(true);p.data.editingIssueId='existing';p.data.issue={description:'修改隐患',evidence:['photo']};await p.addIssue();assert.equal(p.data.editingIssueId,'existing');assert.equal(p.data.issue.description,'修改隐患');
});
test('locked task does not allow edit or delete requests',async()=>{
 const {p,calls}=setup();p.data.canCollect=false;await p.editIssue({currentTarget:{dataset:{id:'existing'}}});await p.deleteIssue({currentTarget:{dataset:{id:'existing'}}});assert.equal(calls.length,0);
});

test('manual risk is trimmed, saved and reset; presets replace manual values',async()=>{
 const {p,calls}=setup();p.data.issue.description='防护缺失';p.riskInput({detail:{value:'  较大风险  '}});await p.addIssue();
 assert.equal(calls.find(c=>c.url.endsWith('/issue')).data.risk,'较大风险');assert.equal(p.data.customRisk,null);
 p.riskInput({detail:{value:'自定义'}});p.riskPick({detail:{value:'2'}});assert.equal(p.data.customRisk,null);assert.equal(p.data.riskIndex,2);
});
test('blank manual risk is optional and custom risk survives editing',async()=>{
 const {p,calls}=setup();p.data.issue.description='问题';p.riskInput({detail:{value:'   '}});await p.addIssue();assert.equal(calls[0].data.risk,'');
 p.data.task.issues=[{id:'custom',risk:'一级风险',status:'unassigned',history:[],evidence:[],description:'原问题'}];await p.editIssue({currentTarget:{dataset:{id:'custom'}}});assert.equal(p.data.customRisk,'一级风险');
 await p.addIssue();assert.equal(calls.find(c=>c.url.endsWith('/edit-issue')).data.risk,'一级风险');
});

test('optional leader is submitted without changing executor or project roles',async()=>{
 const {p,calls}=setup();p.data.scenarios=[{id:'inspection',fields:[]}];p.data.projects[0].members=[{id:'lead',name:'负责人'}];p.prepareAdhoc();
 assert.equal(p.data.leaderOptions[0].id,'');p.leaderPick({detail:{value:'1'}});await p.createAdhoc();
 const call=calls.find(c=>c.url.endsWith('/adhoc-tasks'));assert.equal(call.data.leaderId,'lead');assert.equal(call.data.assignee,undefined);
});
test('changing ad hoc project clears previous leader selection',()=>{
 const {p}=setup();p.data.projects=[{id:'p1',role:'inspector',members:[{id:'lead1',name:'甲'}]},{id:'p2',role:'inspector',members:[{id:'lead2',name:'乙'}]}];p.data.scenarios=[{id:'inspection',fields:[]}];p.prepareAdhoc();p.leaderPick({detail:{value:'1'}});p.adhocProjectPick({detail:{value:'1'}});
 assert.equal(p.data.leaderIndex,0);assert.equal(p.data.leaderOptions[1].id,'lead2');
});

test('save leader uses assignment endpoint and keeps unsaved field content',async()=>{
 const {p,calls}=setup();p.data.projects[0].members=[{id:'lead',name:'负责人'}];p.open({currentTarget:{dataset:{id:'task1'}}});
 p.data.issue.description='尚未保存的隐患';p.data.note='检查结论';p.leaderPick({detail:{value:'1'}});await p.saveLeader();
 const req=calls.find(c=>c.url.endsWith('/assign-leader'));assert.equal(req.data.leaderId,'lead');assert.equal(req.data.taskId,'task1');assert.equal(req.data.revision,3);
 assert.equal(p.data.issue.description,'尚未保存的隐患');assert.equal(p.data.note,'检查结论');assert.equal(p.data.leaderOptions[p.data.leaderIndex].id,'lead');
});

test('submission retains selected leader after saving another hazard',async()=>{
 const {p,calls}=setup();p.data.projects[0].members=[{id:'lead',name:'负责人'}];p.open({currentTarget:{dataset:{id:'task1'}}});p.leaderPick({detail:{value:'1'}});
 p.data.issue.description='待整改问题';await p.addIssue();await p.submitField();
 assert.equal(calls.find(c=>c.url.endsWith('/submit-field')).data.leaderId,'lead');
});

test('missing picker state preserves saved routing instead of clearing leader',async()=>{
 const {p,calls}=setup();p.data.task.leaderId='saved-lead';p.data.record={text:'',evidence:[]};await p.submitField();
 assert.equal(calls.find(c=>c.url.endsWith('/submit-field')).data.leaderId,'saved-lead');
});

test('submitted inspector cannot save task leader and failed saves keep selection',async()=>{
 const {p,calls}=setup();p.setTask({...p.data.task,fieldStatus:'submitted'});await p.saveLeader();assert.equal(calls.length,0);
 const h=setup(true);h.p.data.leaderOptions=[{id:'lead',name:'负责人'}];h.p.data.leaderIndex=0;await h.p.saveLeader();assert.equal(h.p.data.leaderIndex,0);assert.equal(h.p.data.task.revision,3);
});

 test('temporary task opens directly in collection with explicit quickStart',async()=>{const {p,calls}=setup();p.data.scenarios=[{id:'inspection',fields:[]}];await p.newAdhoc();const request=calls.find(c=>c.url.endsWith('/adhoc-tasks'));assert.equal(request.data.quickStart,true);assert.equal(p.data.view,'detail');assert.equal(p.data.canCollect,true);assert.equal(p.data.newTask.inspectors,'现场员')});
 test('multiple projects require choosing a project before automatic collection',async()=>{const {p,calls}=setup();p.data.projects.push({id:'p2',role:'inspector',name:'另一项目',members:[]});p.data.scenarios=[{id:'inspection',fields:[]}];await p.newAdhoc();assert.equal(p.data.view,'create');assert.equal(calls.length,0);p.adhocProjectPick({detail:{value:'1'}});await p.createAdhoc();assert.equal(calls.find(c=>c.url.endsWith('/adhoc-tasks')).data.projectId,'p2')});

for(const failure of [null,'adhoc-tasks','start','state'])test('legacy server enters hazard form with retry safety: '+(failure||'success'),async()=>{
 const {p,api,wx}=setup();p.data.scenarios=[{id:'inspection',fields:[]}];
 let task={...p.data.task,id:'legacy-task',source:'adhoc',status:'ready',revision:1};
 const state={user:p.data.user,projects:p.data.projects,scenarios:p.data.scenarios,users:[],reminders:[]};
 const requests=[],replies=new Map(),scrolls=[];let failed=false,creations=0,starts=0;
 wx.pageScrollTo=o=>scrolls.push(o.selector);
 api.request=async(url,data)=>{
  const action=url.split('/').at(-1);requests.push({action,data});
  if(action==='state'){
   if(failure==='state'&&!failed){failed=true;throw Error('刷新失败')}
   return {...state,tasks:[task]};
  }
  if(!replies.has(data.requestId)){
   if(action==='adhoc-tasks')creations++;
   else if(action==='start'){
    assert.equal(data.taskId,task.id);assert.equal(data.revision,task.revision);
    assert.equal(data.checklist.length,0);assert.equal(task.status,'ready');
    starts++;task={...task,status:'active',revision:2};
   }else throw Error('unexpected action '+action);
   replies.set(data.requestId,{...task});
  }
  if(action===failure&&!failed){failed=true;throw Error('响应丢失')}
  return replies.get(data.requestId);
 };
 await p.newAdhoc();
 if(failure){assert.equal(p.data.view,'create');assert.equal(p.data.busy,false);assert.ok(p.pendingAdhoc);await p.createAdhoc()}
 assert.equal(creations,1);assert.equal(starts,1);assert.equal(p.data.view,'detail');
 assert.equal(p.data.task.id,'legacy-task');assert.equal(p.data.canCollect,true);
 assert.equal(p.pendingAdhoc,null);assert.deepEqual(scrolls,['#report-leader']);
 for(const action of ['adhoc-tasks','start'])assert.equal(new Set(requests.filter(r=>r.action===action).map(r=>r.data.requestId)).size,1);
});

test('quickStart-capable server does not receive a redundant start request',async()=>{
 const {p,calls}=setup();p.data.scenarios=[{id:'inspection',fields:[]}];await p.newAdhoc();
 assert.equal(p.data.canCollect,true);assert.equal(calls.filter(c=>c.url.endsWith('/start')).length,0);
});

test('inspector electronic signature stays local until reporting and survives failed upload',async()=>{
 const {p,calls,signatureImage}=setup(true);signatureImage.choose=async()=>({path:'signature.png',base64:'image-data'});
 await p.insertSign();assert.equal(calls.length,0);assert.equal(p.data.signMode,'image');assert.equal(p.signDirty,true);
 await assert.rejects(()=>p.captureSign());assert.equal(p.signImage.base64,'image-data');assert.equal(p.signDirty,true);
});
test('reporting uploads imported inspector signature and records the method',async()=>{
 const {p,calls,signatureImage}=setup();signatureImage.choose=async()=>({path:'signature.jpg',base64:'image-data'});
 await p.insertSign();p.data.record={text:'',evidence:[]};p.data.task.issues=[{id:'saved'}];p.data.signer='现场员';p.data.inspectors='现场员';
 await p.submitField();assert.equal(calls.find(c=>c.url.endsWith('/upload')).data.base64,'image-data');assert.equal(calls.find(c=>c.url.endsWith('/submit-field')).data.signMethod,'image');assert.equal(p.signDirty,false);
});

test('previously selected signature is revalidated before upload and fields survive conversion failure',async()=>{
 const {p,calls,signatureImage}=setup();p.signImage={path:'old.jpeg',base64:'old-bytes'};p.signDirty=true;p.data.note='保留检查结论';
 signatureImage.prepare=async(image,page)=>{assert.equal(image.path,'old.jpeg');assert.equal(page,p);throw Error('图片转换失败')};
 await assert.rejects(p.captureSign(),/图片转换失败/);assert.equal(calls.length,0);assert.equal(p.signDirty,true);assert.equal(p.signImage.base64,'old-bytes');assert.equal(p.data.note,'保留检查结论');
 signatureImage.prepare=async()=>({path:'normalized.png',base64:'normalized-bytes'});await p.captureSign();
 assert.equal(calls[0].data.base64,'normalized-bytes');assert.equal(p.data.signPath,'normalized.png');assert.equal(p.data.note,'保留检查结论');
});
