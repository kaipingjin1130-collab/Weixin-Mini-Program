// Four independent synthetic accounts against an isolated localhost backend.
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const py=spawn('python',['-u',path.join(__dirname,'combined_browser_server.py')],{cwd:path.resolve(__dirname,'../..'),windowsHide:true});
 let browser;const errors=[];
 try{
  const {port}=await new Promise((resolve,reject)=>{let buffer='';py.stdout.on('data',b=>{buffer+=b;if(buffer.includes('\n')){try{resolve(JSON.parse(buffer.split('\n')[0]))}catch(e){reject(e)}}});py.stderr.on('data',b=>process.stderr.write(b));py.once('error',reject);py.once('exit',c=>reject(Error('fixture stopped '+c)))});
  const base=`http://127.0.0.1:${port}/quality`;
  browser=await chromium.launch({headless:true,channel:'msedge'});
  async function logged(name){const context=await browser.newContext({viewport:{width:1360,height:960}});const r=await context.request.post(base+'/api/login',{data:{username:name,password:'synthetic-password'}});assert.equal(r.status(),200);const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/#leaders');await page.getByRole('heading',{name:'负责人汇总',exact:true}).waitFor();return page}
  const lead=await logged('lead');await lead.locator('#leaderSelectAll').click();await lead.locator('#leaderCombine').click();
  const leadDialog=lead.locator('[role=dialog]');await leadDialog.locator('[data-recipient]').selectOption('host:admin:11');
  for(const uid of [8,9,10])await leadDialog.locator(`[data-cosigner][value="host:admin:${uid}"]`).check();
  await leadDialog.locator('[data-assign]').click();await leadDialog.locator('[data-sign]').waitFor();
  const download=await leadDialog.getByRole('link',{name:'下载整份 Word 报告'}).getAttribute('href');const id=download.split('/').at(-1);
  const peers=await Promise.all(['worker','other','receiver'].map(logged));
  for(const page of peers){await page.locator(`[data-combined="${id}"]`).click();await page.locator('[role=dialog] [data-sign]').waitFor()}
  const pages=[lead,...peers];
  async function draw(page){const canvas=page.locator('[role=dialog] [data-sign]');await canvas.scrollIntoViewIfNeeded();const b=await canvas.boundingBox();await page.mouse.move(b.x+35,b.y+30);await page.mouse.down();await page.mouse.move(b.x+105,b.y+100,{steps:8});await page.mouse.move(b.x+185,b.y+35,{steps:8});await page.mouse.up();return canvas.evaluate(c=>c.toDataURL())}
  const ink=await Promise.all(pages.map(draw));
  async function submit(page){await page.locator('[role=dialog] [data-sign-save]').click();await page.locator('#dialogOK').click()}
  await submit(peers[0]);
  for(const page of [lead,peers[1],peers[2]])await page.locator('[data-signing-status] img').first().waitFor({timeout:12000});
  assert.equal(await leadDialog.locator('[data-sign]').evaluate(c=>c.toDataURL()),ink[0]);
  assert.equal(await leadDialog.locator('[data-assignment]').count(),0);
  await Promise.all([lead,peers[1],peers[2]].map(submit));
  for(const page of pages){await page.locator('[data-signing-status] img').nth(3).waitFor({timeout:12000});assert.equal(await page.locator('[data-sign-save]').count(),0);const r=await page.request.get(base+'/api/work/combined-data/'+id);const value=await r.json();assert.equal(value.id,id);assert.equal(value.signedCount,4);assert.equal(value.signers.length,4)}
  const word=await lead.request.get(base.replace('/quality','')+download);assert.equal(word.status(),200);assert.ok((await word.body()).subarray(0,2).equals(Buffer.from('PK')));
  await lead.setViewportSize({width:390,height:844});assert.equal(await lead.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  if(process.env.QAXC_QA_OUTPUT){fs.mkdirSync(process.env.QAXC_QA_OUTPUT,{recursive:true});await lead.locator('[data-signing-status]').scrollIntoViewIfNeeded();await lead.screenshot({path:path.join(process.env.QAXC_QA_OUTPUT,'four-signers-mobile.png')});await peers[2].locator('[data-signing-status]').scrollIntoViewIfNeeded();await peers[2].screenshot({path:path.join(process.env.QAXC_QA_OUTPUT,'four-signers-shared-report.png')});fs.writeFileSync(path.join(process.env.QAXC_QA_OUTPUT,'four-signers-browser.docx'),await word.body())}
  assert.deepEqual(errors,[]);console.log('PASS: four accounts share one report, four signatures retained, peer sync preserves drawing, Word contains signatures, mobile fits.');
 }finally{await browser?.close();py.stdin.write('stop\n');await new Promise(resolve=>{py.once('exit',resolve);setTimeout(()=>{py.kill();resolve()},5000)})}
})().catch(e=>{console.error(e);process.exitCode=1});
