const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../candidate/web/app.js'),'utf8');
function setup(script=source){
 const ctx=vm.createContext({document:{querySelector:()=>({})},location:{hash:''},window:{addEventListener(){}},fetch:()=>({catch:()=>({finally(){}})})});
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
test('dashboard counts and recent cards include task documents',()=>{
 const run=setup(),html=run('home()');assert.match(html,/已提交报告<strong>4/);assert.match(html,/待完成草稿<strong>1/);
 assert.match(html,/最新 4 份/);assert.match(html,/brief\/b/);assert.match(html,/report\/d2/);
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
