const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),test=require('node:test'),path=require('node:path');
function setup(fail=false){
 let definition;const calls=[];
 let task={id:'task1',projectId:'p1',revision:3,status:'active',fieldStatus:'collecting',assignee:'inspector',receiver:'receiver',records:[],issues:[],scenario:{recordTypes:['巡查记录'],checklist:[]},materials:[],fieldBriefs:[]};
 const state=()=>({user:{id:'inspector',name:'现场员'},projects:[{id:'p1',name:'项目',role:'inspector',members:[]}],tasks:[task],scenarios:[],reminders:[],users:[]});
 const api={request:async(url,data)=>{calls.push({url,data});if(url==='/api/work/state')return state();if(fail)throw Error('服务暂时不可用');task={...task,revision:task.revision+1};if(url.endsWith('/issue'))task.issues=[...task.issues,{...data,id:'i'+(task.issues.length+1),status:'unassigned'}];if(url.endsWith('/record'))task.records=[{...data,id:'r1',status:data.confirm?'confirmed':'draft'}];if(url.endsWith('/submit-field'))task.fieldStatus='submitted';return task}};
 const wx={showModal:o=>o.success?.({confirm:true}),showToast:()=>{},enableAlertBeforeUnload:()=>{},disableAlertBeforeUnload:()=>{}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../miniprogram/pages/work/work.js'),'utf8'),{require:()=>api,Page:d=>definition=d,wx,console});
 const p={...definition,data:JSON.parse(JSON.stringify(definition.data))};
 p.setData=values=>{for(const [key,value] of Object.entries(values)){const keys=key.split('.');let obj=p.data;for(const k of keys.slice(0,-1))obj=obj[k]??(obj[k]={});obj[keys.at(-1)]=value}};
 p.setData(state());p.setTask(task);p.data.record={type:'巡查记录',text:'现场检查内容',occurredAt:'2026-10-20T09:00:00+08:00',evidence:['photo1']};p.data.evidence=[{id:'photo1',selected:true}];
 return {p,calls,wx};
}
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
 p.newAdhoc();assert.equal(p.data.view,'create');assert.deepEqual(p.data.eligibleProjects.map(x=>x.id),['p1']);
 p.data.newTask={title:'临时巡查',object:'三号楼',dueDate:'2026-10-22',receiver:'must-not-send',assignee:'must-not-send'};
 p.data.fieldValues={'检查区域':'三层','检查重点':'防护'};
 await p.createAdhoc();
 const req=calls.find(c=>c.url.endsWith('/adhoc-tasks'));
 assert.equal(req.data.projectId,'p1');assert.equal(req.data.scenarioId,'inspection');
 assert.equal(req.data.receiver,undefined);assert.equal(req.data.assignee,undefined);
 assert.equal(p.data.view,'detail');
});
test('failed ad hoc creation keeps form for correction or retry',async()=>{
 const {p}=setup(true);p.data.scenarios=[{id:'inspection',name:'巡查'}];p.newAdhoc();
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

test('unsigned brief cannot be submitted',async()=>{const {p,calls}=setup();p.data.record={text:'',evidence:[]};p.data.task.issues=[{id:'saved1'}];p.data.inspectors='张三';p.data.signer='张三';await p.submitField();assert.equal(calls.length,0)});
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

test('zero saved hazards blocks brief even with summary and signature',async()=>{
 const {p,calls,wx}=setup();let message='';wx.showModal=o=>{message=o.content};
 p.data.record={text:'',evidence:[]};p.data.inspectors='检查员';p.data.signer='检查员';p.data.signature='signature';p.data.note='检查摘要';
 await p.submitField();assert.equal(calls.length,0);assert.ok(message.includes('至少保存一条隐患'));
});
