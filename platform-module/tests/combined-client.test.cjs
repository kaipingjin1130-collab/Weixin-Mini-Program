const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
function setup(){let definition;const calls=[];const api={request:async(url,payload)=>{calls.push({url,payload});return {id:'combined',revision:2}}};const signatureImage={choose:async()=>null,prepare:async image=>image};const wx={createCanvasContext:()=>({setStrokeStyle(){},setLineWidth(){},setLineCap(){},clearRect(){},draw(){}}),showModal:o=>o.success?.({confirm:true}),canvasToTempFilePath:o=>o.success({tempFilePath:'signature.png'}),getFileSystemManager:()=>({readFile:o=>o.success({data:'signature-bytes'})})};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../miniprogram/pages/combined/combined.js'),'utf8'),{require:name=>name.endsWith('/signature')?signatureImage:api,Page:p=>definition=p,wx,clearInterval(){},setInterval(){},console});const page={...definition,data:structuredClone(definition.data)};page.setData=(value,done)=>{Object.assign(page.data,value);done?.()};return {page,api,calls,wx,signatureImage}}
test('lost merge response retries with the same idempotency key',async()=>{const {page,api,calls}=setup();let fail=true;api.request=async(url,payload)=>{calls.push({url,payload});if(fail){fail=false;throw Error('connection lost')}return {id:'same-report'}};await assert.rejects(()=>page.post('combined-create',{keys:['brief:a','brief:b']}));const result=await page.post('combined-create',{keys:['brief:a','brief:b']});assert.equal(result.id,'same-report');assert.equal(calls[0].payload.requestId,calls[1].payload.requestId)});
test('polling keeps an unfinished drawing when revision did not change',async()=>{const {page,api}=setup();page.data.report={id:'combined',revision:2};page.ink=true;api.request=async()=>({id:'combined',revision:2});let shown=0;page.show=()=>shown++;await page.poll();assert.equal(shown,0);assert.equal(page.ink,true)});
test('older in-flight poll cannot replace a newer signed revision',async()=>{const {page,api}=setup();page.data.report={id:'combined',revision:3};api.request=async()=>({id:'combined',revision:2});let shown=0;page.show=()=>shown++;await page.poll();assert.equal(shown,0);assert.equal(page.data.report.revision,3)});
test('sign sends explicit confirmation, exact revision and content hash',async()=>{const {page,calls}=setup();page.data.report={id:'combined',revision:2,contentHash:'reviewed-hash'};page.ink=true;page.show=()=>{};page.refresh=async()=>{};await page.sign();const request=calls[0];assert.equal(request.url,'/api/work/combined-sign');assert.equal(request.payload.confirmed,true);assert.equal(request.payload.contentHash,'reviewed-hash');assert.equal(request.payload.revision,2);assert.equal(request.payload.base64,'signature-bytes')});
test('cancelled signature confirmation retains the drawing and makes no write',async()=>{const {page,calls,wx}=setup();page.data.report={myRole:'检查人'};page.ink=true;wx.showModal=o=>o.success({confirm:false});await page.sign();assert.equal(calls.length,0);assert.equal(page.ink,true)});

test('peer signature sync preserves canvas while updating all signer states',async()=>{
 const {page,api}=setup();const report={id:'shared',projectId:'p',revision:2,contentHash:'content',assignmentHash:'people',canSign:true,report:{issues:[],signatures:[]},signers:[]};
 page.data.report=report;page.ink=true;const ctx={drawing:'unsubmitted'};page.ctx=ctx;
 api.request=async()=>({...report,revision:3,signers:[{userId:'peer',signature:{evidenceId:'signed'}}]});
 await page.poll();assert.equal(page.data.report.revision,3);assert.equal(page.data.report.signers.length,1);assert.equal(page.ink,true);assert.equal(page.ctx,ctx);
});
test('changed assignment clears old drawing and requires fresh review',async()=>{
 const {page,api}=setup();page.data.report={id:'shared',revision:2,contentHash:'content',assignmentHash:'old'};page.ink=true;
 api.request=async()=>({id:'shared',revision:3,contentHash:'content',assignmentHash:'new',canSign:true,report:{issues:[],signatures:[]}});
 await page.poll();assert.equal(page.ink,false);assert.equal(page.data.report.assignmentHash,'new');
});
test('multi-sign request binds both report content and assigned participants',async()=>{
 const {page,calls}=setup();page.data.report={id:'shared',revision:2,contentHash:'content',assignmentHash:'people',myRole:'检查人'};page.ink=true;page.show=()=>{};page.refresh=async()=>{};
 await page.sign();assert.equal(calls[0].payload.assignmentHash,'people');assert.equal(calls[0].payload.contentHash,'content');
});

test('missing backend stops automatic requests and manual refresh recovers after deployment',async()=>{
 const {page,api}=setup();let missing=true,count=0;
 api.request=async url=>{count++;if(missing)throw Object.assign(Error('接口不存在'),{status:404});return url.endsWith('/state')?{projects:[]}:[]};
 await page.reload();assert.match(page.data.message,/后台尚未更新/);const stoppedAt=count;
 await page.poll();assert.equal(count,stoppedAt);
 missing=false;await page.reload();assert.equal(page.data.message,'');assert.equal(page.unavailable,false);
 await page.poll();assert.ok(count>stoppedAt+3);
});

test('onsite imported signature is previewed locally then confirmed for the selected person',async()=>{
 const {page,calls,signatureImage}=setup();signatureImage.choose=async()=>({path:'local.png',base64:'signature-bytes'});
 page.data.report={id:'shared',revision:3,contentHash:'content',guestSigners:[{id:'guest-a',name:'甲',unit:'单位',slotHash:'slot-a'}]};page.data.guestTarget='guest-a';
 await page.insertSign();assert.equal(calls.length,0);assert.equal(page.data.signingImagePath,'local.png');
 page.show=()=>{};page.refresh=async()=>{};await page.sign();assert.equal(calls[0].url,'/api/work/combined-guest-sign');assert.equal(calls[0].payload.guestSignerId,'guest-a');assert.equal(calls[0].payload.slotHash,'slot-a');assert.equal(calls[0].payload.signMethod,'image');
});
test('peer signature and appended guest preserve an imported onsite signature',async()=>{
 const {page,api}=setup();const guest={id:'a',name:'甲',unit:'单位',slotHash:'slot',signature:null};const report={id:'shared',revision:2,contentHash:'content',assignmentHash:'people',canCollectGuest:true,guestSigners:[guest],report:{issues:[],signatures:[]}};
 page.data.report=report;page.data.guestTarget='a';page.data.signingImagePath='selected.jpg';page.signImage={path:'selected.jpg',base64:'bytes'};
 api.request=async()=>({...report,revision:3,guestSigners:[guest,{id:'b',name:'乙',slotHash:'other',signature:null}]});
 await page.poll();assert.equal(page.data.guestTarget,'a');assert.equal(page.data.signingImagePath,'selected.jpg');assert.equal(page.signImage.base64,'bytes');
});

test('new workflow sources are excluded from merging and stale selections are removed',async()=>{
 const {page,api}=setup();page.data.selected=['brief:new','brief:old'];
 api.request=async url=>url.endsWith('/combined-list')?[{id:'new-report'},{id:'old-report'}]:url.endsWith('/leader-inbox')?[{key:'brief:new',taskId:'new-task'},{key:'brief:old',taskId:'old-task'}]:{projects:[],tasks:[{id:'new-task',workflowVersion:2,combinedId:'new-report',title:'新任务'},{id:'old-task'}]};
 await page.refresh();assert.equal(page.data.rows.length,1);assert.equal(page.data.rows[0].key,'brief:old');assert.equal(page.data.workflowReports[0].id,'new-report');assert.equal(page.data.reports[0].id,'old-report');assert.equal(page.data.selected.join(','),'brief:old');
 page.select({detail:{value:['brief:new']}});assert.equal(page.data.selected.length,0);
 page.data.selected=['brief:new'];let writes=0;page.post=async()=>writes++;await page.create();assert.equal(writes,0);assert.match(page.data.message,/无需合并/);
});

function readyPublication(){
 const state={user:{id:'manager'},projects:[{id:'p',role:'manager',members:[]}],tasks:[{id:'task',projectId:'p',workflowVersion:2,stage:'signing',combinedId:'shared',revision:7,leaderId:'manager',confirmedIds:['inspector']}]};
 const report={id:'shared',title:'测试报告',projectId:'p',workflowVersion:2,taskId:'task',revision:4,contentHash:'reviewed',signers:[{userId:'manager',role:'项目负责人',signature:{}},{userId:'inspector',role:'检查人',signature:{}}],guestSigners:[{id:'guest',role:'被检查人',signature:{}}],report:{issues:[],signatures:[]}};
 return {state,report};
}

test('direct publication binds reviewed report and current task revisions',async()=>{
 const {page,api,calls}=setup();const {state,report}=readyPublication();page.state=state;page.data.report=report;
 api.request=async(url,payload)=>{calls.push({url,payload});return url.endsWith('/state')?state:url.includes('/combined-data/')?report:{}};
 page.refresh=async()=>{};page.show=()=>{};await page.publish();
 const write=calls.find(c=>c.url.endsWith('/mobile-publish'));assert.ok(write);assert.equal(write.payload.taskId,'task');assert.equal(write.payload.revision,7);assert.equal(write.payload.contentHash,'reviewed');assert.equal(write.payload.reportRevision,4);
});

test('cancelled publication and changed signed revision never publish',async()=>{
 for(const changed of [false,true]){const {page,api,calls,wx}=setup();const {state,report}=readyPublication();page.state=state;page.data.report=report;
 wx.showModal=o=>o.success?.({confirm:false});api.request=async(url,payload)=>{calls.push({url,payload});return url.endsWith('/state')?state:{...report,revision:changed?5:4}};
 await page.publish();assert.ok(calls.every(c=>!c.payload));if(changed)assert.match(page.data.message,/重新核对/);}
});

test('publication requires project authority, every required signer, and a recipient',()=>{
 const {page}=setup();const {state,report}=readyPublication();page.state=state;assert.equal(page.publication(report).ready,true);
 assert.equal(page.publication({...report,guestSigners:[]}).ready,false);
 assert.equal(page.publication({...report,signers:report.signers.slice(0,1)}).ready,false);
 assert.equal(page.publication({...report,guestSigners:[{role:'被检查人',signature:null}]}).ready,false);
 assert.equal(page.publication({...report,publishedAt:'now'}).ready,false);
 page.state={...state,user:{id:'inspector'},projects:[{id:'p',role:'inspector'}]};assert.equal(page.publication(report).canManage,false);assert.equal(page.publication(report).ready,false);
});

test('unselected workflow sources link to their task instead of a merge checkbox',async()=>{
 const {page,api}=setup();api.request=async url=>url.endsWith('/combined-list')?[]:url.endsWith('/leader-inbox')?[{key:'brief:a',taskId:'task'},{key:'brief:b',taskId:'task'}]:{projects:[],tasks:[{id:'task',workflowVersion:2,stage:'review'}]};
 await page.refresh();assert.equal(page.data.rows.length,0);assert.equal(page.data.workflowPending.length,1);assert.equal(page.data.workflowPending[0].taskId,'task');
});
