const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../candidate/web/app.js'),'utf8');
function setup(script=source){
 const ctx=vm.createContext({URLSearchParams,sessionStorage:{getItem:()=>null,setItem(){},removeItem(){}},document:{querySelector:()=>({addEventListener(){}}),createElement:()=>({}),head:{append(){}}},location:{hash:''},window:{addEventListener(){}},fetch:()=>({catch:()=>({finally(){}})})});
 vm.runInContext(script,ctx);
 vm.runInContext(`state={reports:[{id:'original',status:'submitted',project:'项目',contract:'合同',number:'001',inspector:'甲',date:'2026-10-22',issues:[]},{id:'draft',status:'draft',project:'项目',contract:'合同',number:'002',inspector:'乙',date:'2026-10-21',issues:[]}],projects:[{id:'p'}],knowledge:[]};lifecycleState={projects:[{id:'p',name:'项目',contract:'合同'}],tasks:[{id:'task',projectId:'p',title:'临时巡查',number:'T1',inspectors:'甲',sourceReportId:'original',records:[{sourceReportId:'original'}],fieldBriefs:[{id:'b',version:1,createdAt:'2026-10-28T10:00:00+08:00'},{id:'b',version:1,createdAt:'2026-10-28T10:00:00+08:00'}],deliveries:[{id:'d',version:1,createdAt:'2026-10-28T11:00:00+08:00'},{id:'d2',version:2,createdAt:'2026-10-28T12:00:00+08:00'}]},{id:'empty',projectId:'p',records:[],fieldBriefs:[],deliveries:[]}]};`,ctx);
 return code=>vm.runInContext(code,ctx);
}
test('catalogue combines actual documents, retains versions and deduplicates by type/id',()=>{
 const run=setup();assert.equal(run('reportCatalog().length'),5);
 assert.equal(run('reportCatalog()[0].id'),'d2');
 assert.equal(run("reportCatalog().filter(r=>r.kind==='inspection').length"),2);
 assert.equal(run("reportCatalog().find(r=>r.id==='b').url"),'/api/work/brief/b');
});
test('workbench unifies linked reports with tasks while keeping drafts editable',()=>{
 const run=setup(),html=run('home()');assert.equal(run('workbenchRows().length'),3);
 assert.equal(run("workbenchRows().filter(r=>r.kind==='report').length"),1);
 assert.match(html,/data-open="draft"/);assert.match(html,/data-open="original"/);
 assert.match(html,/原始报告/);assert.match(html,/待提交草稿/);
});
test('report centre search/filter and original editing stay separate',()=>{
 const run=setup();let html=run('reports()');assert.match(html,/data-copy="original"/);
 assert.doesNotMatch(html,/data-copy="b"/);assert.match(html,/brief-word\/b/);
 html=run("filter='draft';reports()");assert.doesNotMatch(html,/brief-word/);assert.match(html,/data-open="draft"/);
 html=run("filter='all';search='临时巡查';reports()");assert.match(html,/brief-word/);assert.doesNotMatch(html,/data-open="original"/);
});
test('empty accessible task set never adds reports from another project',()=>{
 const run=setup();assert.equal(run('lifecycleState.tasks=[];reportCatalog().length'),2);
});
test('deployment URL prefix is added once to document and download links',()=>{
 const prefixed=source.replace(/(["'`])\/(?!\/)(?=api\/|media\/|work(?:[?"'`]|\.js)|style\.css|app\.js|followup\.js|#|["'`])/g,'$1/quality/');
 const run=setup(prefixed);
 assert.equal(run("reportCatalog().find(r=>r.id==='b').url"),'/quality/api/work/brief/b');
 assert.equal(run("reportCatalog().find(r=>r.id==='d').wordUrl"),'/quality/api/work/word/d');
 assert.doesNotMatch(run('home()'),/brief\/quality\//);
});

test('deep knowledge routes retain the matching unified navigation section',()=>{
 const run=setup();for(const [route,section] of [['/training/questions','blearn'],['/settings/models','bprocess'],['/knowledge/drafts','bprocess'],['/reviews','bprocess'],['/archive-review/id','bretro'],['/jobs','bservices'],['/imports/id','bsources']])assert.equal(run(`bPageFor('${route}')`),section);
});

test('grouped navigation retains every original destination and adds risk records',()=>{
 const run=setup();const ids=JSON.parse(run("JSON.stringify(navigationGroups.flatMap(g=>g.items.flatMap(i=>[i.id,...(i.children||[]).map(c=>c.id)])))"));
 const expected=['home','reports','rectification','bknowledge','bprocess','bretro','blearn','bservices','profile','projects','brisks'];
 assert.deepEqual(ids.slice().sort(),expected.sort());assert.equal(new Set(ids).size,ids.length);
 assert.equal(run("bPageFor('/records/test')"),'brisks');assert.equal(run("bPageFor('/imports/test')"),'bsources');
 assert.deepEqual(JSON.parse(run('JSON.stringify(navigationGroups.map(g=>g.label))')),['工程风险管理','知识管理','个人中心']);
});

test('navigation permits all groups to remain expanded together',()=>{
 const run=setup();const html=run('navigation()');
 assert.doesNotMatch(html,/name="primary-navigation"/);
 assert.equal((html.match(/class="nav-group" open/g)||[]).length,3);
 assert.equal((html.match(/class="nav-subgroup" open/g)||[]).length,1);
});

test('deduplication uses explicit source IDs, never titles or document versions',()=>{
 const run=setup();
 run("lifecycleState.tasks[0].sourceReportId='';lifecycleState.tasks[0].records=[{sourceReportId:'original'}]");
 assert.equal(run('workbenchRows().length'),3);
 run("lifecycleState.tasks[0].records=[]");assert.equal(run('workbenchRows().length'),4);
 run("state.reports[0].status='draft';lifecycleState.tasks[0].sourceReportId='original'");
 assert.equal(run("workbenchRows().filter(r=>r.stage==='draft').length"),2);
});
test('workbench filtering and pagination preserve rows without changing source data',()=>{
 const run=setup();const original=run('JSON.stringify(state.reports)');
 run("workbenchFilter='draft'");assert.doesNotMatch(run('home()'),/原始报告/);
 run("workbenchFilter='all';workbenchSearch='T1'");assert.doesNotMatch(run('home()'),/data-open="draft"/);
 assert.equal(run('JSON.stringify(state.reports)'),original);
 run("workbenchSearch='';state.reports=Array.from({length:23},(_,i)=>({id:'r'+i,status:'draft',number:'R'+i}));lifecycleState.tasks=[];workbenchPage=3");
 assert.match(run('home()'),/3 \/ 3/);assert.equal((run('home()').match(/继续填写/g)||[]).length,3);
 run("workbenchSearch='no-match'");assert.match(run('home()'),/暂无匹配记录/);assert.equal(run('workbenchPage'),1);
});
test('task stage selects the existing permission-checked workflow destination',()=>{
 const run=setup();run("lifecycleState.tasks[0].fieldStatus='accepted';lifecycleState.tasks[0].issues=[{status:'review'}]");
 assert.match(run('home()'),/section=rectification/);
 run("lifecycleState.tasks[0].status='archived'");assert.match(run('home()'),/section=archive/);
});
test('assign action is limited to managers or admins in the selected project',()=>{
 const run=setup();assert.equal(run('canAssignTask()'),false);
 run("lifecycleState.projects=[{id:'p',role:'manager'},{id:'q',role:'inspector'}]");assert.equal(run('canAssignTask()'),true);
 run("selectedProject='q'");assert.equal(run('canAssignTask()'),false);
 run("lifecycleState.user={isAdmin:true}");assert.equal(run('canAssignTask()'),true);
});
test('one report-centre menu preserves four tabs and deep-route selection',()=>{
 const run=setup();for(const section of ['reports','archives','bsources','bpackages']){
  run(`page='${section}'`);assert.equal(run("navActive('reports')"),true);
  const html=run('reportCentreTabs()');for(const label of ['巡查报告','成果归档','历史资料','成果接入'])assert.ok(html.includes(label));
  assert.equal((html.match(/aria-current="page"/g)||[]).length,1);
 }
 run("page='tasks';location.hash='#/work?section=archive&task=x'");assert.equal(run('reportCentreSection()'),'archives');assert.equal(run("navActive('home')"),false);
 run("location.hash='#/work?module=tasks&task=x'");assert.equal(run("navActive('home')"),true);
 run("page='form'");assert.equal(run("navActive('home')"),true);
});
test('untrusted task content is escaped in the unified table',()=>{
 const run=setup();run("lifecycleState.tasks[0].title='<img src=x onerror=alert(1)>'");assert.doesNotMatch(run('home()'),/<img src=x/);
});
