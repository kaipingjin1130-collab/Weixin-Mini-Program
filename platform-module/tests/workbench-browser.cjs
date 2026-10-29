// Local fixtures only. Run with Playwright available on NODE_PATH.
const {chromium}=require('playwright');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const web=path.join(__dirname,'../candidate/web');
const project={id:'p',name:'示例项目 A',contract:'测试合同',role:'manager',members:[{id:'u',name:'检查员',role:'inspector'}]};
const scenario={id:'inspection',name:'质量安全巡查',version:1,fields:[],recordTypes:['inspection'],workflow:{},checklist:[]};
const draft={id:'draft',projectId:'p',project:project.name,contract:'测试合同',number:'R-001',status:'draft',date:'2026-10-29',codeId:'c',inspector:'',issues:[]};
const report={...draft,id:'original',status:'submitted',number:'R-002'};
const task={id:'t',projectId:'p',title:'临边防护专项巡查',number:'TASK-001',source:'report',sourceReportId:'original',records:[],issues:[],status:'active',fieldStatus:'submitted',updatedAt:'2026-10-29T10:00:00',scenario,fields:{},materials:[],events:[],fieldBriefs:[],deliveries:[],dueDate:'2026-10-30',revision:1};
const state={user:{id:'u',isAdmin:true},projects:[project],codes:[{id:'c',project_id:'p',number:'R-001'}],reports:[draft,report],knowledge:[],favorites:[]};
const work={user:state.user,projects:[project],users:[{id:'u',username:'u',name:'检查员'}],scenarios:[scenario],tasks:[task],reminders:[{taskId:'t',text:'待接收现场材料'}]};
const errors=[],writes=[];
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost'),p=url.pathname.replace(/^\/quality(?=\/)/,'');
 if(req.method==='POST')writes.push(p);
 if(p.startsWith('/api/')){res.setHeader('Content-Type','application/json');res.end(JSON.stringify(p==='/api/state'?state:p==='/api/work/state'?work:{}));return;}
 if(p==='/b/embedded/knowledge.js'){res.setHeader('Content-Type','text/javascript');res.end('export function mountKnowledge(host){host.textContent="B 页签模拟内容";return ()=>{}}');return;}
 if(p==='/b/embedded/knowledge.css'){res.end('');return;}
 const file=path.join(web,p==='/'?'index.html':p.slice(1));
 if(!file.startsWith(web)||!fs.existsSync(file)){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',p.endsWith('.js')?'text/javascript':p.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(file));
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHANNEL?{channel:process.env.PLAYWRIGHT_CHANNEL}:{})});const page=await browser.newPage({viewport:{width:1440,height:1000}});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.getByRole('heading',{name:'巡查工作台',exact:true}).waitFor();
  assert.equal(await page.locator('.workbench-table tbody tr').count(),2);
  assert.equal(await page.locator('.platform-nav [data-go="form"]').count(),0);
  assert.equal(await page.locator('.platform-nav [data-go="tasks"]').count(),0);
  await page.getByRole('button',{name:'草稿',exact:true}).click();assert.equal(await page.locator('.workbench-table tbody tr').count(),1);
  await page.getByRole('button',{name:'继续填写',exact:true}).click();await page.getByRole('heading',{name:'继续巡查',exact:true}).waitFor();
  await page.getByRole('button',{name:'← 巡查工作台',exact:true}).click();
  await page.getByRole('button',{name:'全部',exact:true}).click();
  await page.getByRole('link',{name:'接收材料',exact:true}).click();await page.getByRole('heading',{name:'现场上报与简报'}).waitFor();
  await page.getByRole('button',{name:'← 返回巡查工作台',exact:true}).click();await page.getByRole('heading',{name:'巡查工作台',exact:true}).waitFor();
  await page.getByRole('link',{name:'分派任务',exact:true}).click();await page.getByRole('heading',{name:'建立任务',exact:true}).waitFor();
  await page.getByRole('button',{name:'← 巡查工作台',exact:true}).click();
  await page.locator('.platform-nav [data-go="reports"]').click();
  for(const id of ['archives','bsources','bpackages','reports']){
   await page.locator('.report-centre-tabs [data-go="'+id+'"]').click();
   await page.waitForFunction(id=>document.querySelector('.report-centre-tabs [data-go="'+id+'"]').getAttribute('aria-current')==='page',id);
   assert.equal(await page.locator('.platform-nav [data-go="reports"][aria-current="page"]').count(),1);
  }
  if(process.env.WORKBENCH_SCREENSHOTS)await page.screenshot({path:path.join(process.env.WORKBENCH_SCREENSHOTS,'report-centre-desktop.png'),fullPage:true});
  await page.locator('.platform-nav [data-go="home"]').click();
  await page.evaluate(()=>{location.hash='/work?module=tasks'});await page.waitForFunction(()=>location.hash==='#home');
  if(process.env.WORKBENCH_SCREENSHOTS){fs.mkdirSync(process.env.WORKBENCH_SCREENSHOTS,{recursive:true});await page.screenshot({path:path.join(process.env.WORKBENCH_SCREENSHOTS,'workbench-desktop.png'),fullPage:true});}
  await page.setViewportSize({width:390,height:844});await page.reload();await page.getByRole('heading',{name:'巡查工作台',exact:true}).waitFor();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  if(process.env.WORKBENCH_SCREENSHOTS)await page.screenshot({path:path.join(process.env.WORKBENCH_SCREENSHOTS,'workbench-mobile.png'),fullPage:true});
  assert.deepEqual(errors,[]);assert.ok(writes.length>0);assert.ok(writes.every(p=>p==='/api/host-session'));
  console.log('PASS: unified workbench, draft, task, assignment, four report tabs, legacy route and mobile layout; no business writes. B content is mocked.');
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
