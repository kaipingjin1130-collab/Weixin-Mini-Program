// Real local backend, two authenticated browsers and synthetic reports only.
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const py=spawn(process.env.QAXC_TEST_PYTHON||'python',['-u',path.join(__dirname,'combined_browser_server.py')],{cwd:path.resolve(__dirname,'../..'),windowsHide:true});
 let browser;const errors=[];
 try{
  const {port}=await new Promise((resolve,reject)=>{let buffer='';py.stdout.on('data',b=>{buffer+=b;const line=buffer.split('\n')[0];if(buffer.includes('\n')){try{resolve(JSON.parse(line))}catch(e){reject(Error(buffer))}}});py.stderr.on('data',b=>process.stderr.write(b));py.once('exit',c=>reject(Error('fixture stopped '+c)));py.once('error',reject)});
  const base=`http://127.0.0.1:${port}/quality`;
  browser=await chromium.launch({headless:true,channel:'msedge'});
  async function logged(name){const context=await browser.newContext({viewport:{width:1360,height:960}});const r=await context.request.post(base+'/api/login',{data:{username:name,password:'synthetic-password'}});assert.equal(r.status(),200);const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/#leaders');await page.getByRole('heading',{name:'负责人汇总',exact:true}).waitFor();return page}
  const lead=await logged('lead');await lead.locator('#leaderSelectAll').click();await lead.locator('#leaderCombine').click();
  await lead.locator('[role=dialog] [data-recipient]').waitFor();
  const dialog=lead.locator('[role=dialog]');assert.equal(await dialog.locator('img[alt="隐患照片"]').count(),2);
  const download=await dialog.getByRole('link',{name:'下载整份 Word 报告'}).getAttribute('href');assert.match(download,/^\/quality\/api\/work\/combined-word\//);
  const id=download.split('/').at(-1);await dialog.locator('[data-recipient]').selectOption('host:admin:10');await dialog.locator('[data-assign]').click();await dialog.locator('p').filter({hasText:/^host:admin:10$/}).waitFor();
  const signer=await logged('other');await signer.locator(`[data-combined="${id}"]`).click();
  const signDialog=signer.locator('[role=dialog]');const canvas=signDialog.locator('[data-sign]');await canvas.waitFor();
  await canvas.scrollIntoViewIfNeeded();const box=await canvas.boundingBox();await signer.mouse.move(box.x+45,box.y+50);await signer.mouse.down();await signer.mouse.move(box.x+125,box.y+100,{steps:10});await signer.mouse.move(box.x+205,box.y+45,{steps:10});await signer.mouse.up();
  await signDialog.locator('[data-sign-save]').click();
  // ask() opens the application confirmation dialog.
  await signer.locator('#dialogOK').click();
  await signDialog.locator('img[alt="被检查单位负责人签字"]').waitFor({timeout:10000});
  await dialog.locator('img[alt="被检查单位负责人签字"]').waitFor({timeout:12000});
  assert.equal(await dialog.locator('[data-assign]').count(),0);
  assert.equal(await signDialog.locator('[data-sign-save]').count(),0);
  const response=await lead.request.get(base.replace('/quality','')+download);assert.equal(response.status(),200);assert.ok((await response.body()).subarray(0,2).equals(Buffer.from('PK')));
  await lead.setViewportSize({width:390,height:844});assert.equal(await lead.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  if(process.env.QAXC_QA_OUTPUT){fs.mkdirSync(process.env.QAXC_QA_OUTPUT,{recursive:true});await lead.screenshot({path:path.join(process.env.QAXC_QA_OUTPUT,'combined-mobile.png')});await signer.screenshot({path:path.join(process.env.QAXC_QA_OUTPUT,'combined-signed-desktop.png')})}
  assert.deepEqual(errors,[]);console.log('PASS: merge, photos, assigned signer, countersign, cross-browser live sync, Word download, mobile width.');
 }finally{await browser?.close();py.stdin.write('stop\n');await new Promise(resolve=>{py.once('exit',resolve);setTimeout(()=>{py.kill();resolve()},5000)})}
})().catch(e=>{console.error(e);process.exitCode=1});
