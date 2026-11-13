// Six independent synthetic accounts against an isolated localhost backend.
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
  const leadDialog=lead.locator('[role=dialog]');await leadDialog.locator('[data-manager][value="host:admin:12"]').check();
  for(const uid of [11,13])await leadDialog.locator(`[data-recipient][value="host:admin:${uid}"]`).check();
  await leadDialog.locator('[data-assign]').click();await leadDialog.locator('[data-sign]').waitFor();
  const download=await leadDialog.getByRole('link',{name:'下载整份 Word 报告'}).getAttribute('href');const id=download.split('/').at(-1);
  const [lead2,worker,other,receiver,receiver2]=await Promise.all(['lead2','worker','other','receiver','receiver2'].map(logged));
  const pages=[lead,lead2,worker,other,receiver,receiver2];
  for(const page of pages.slice(1)){await page.locator(`[data-combined="${id}"]`).click();await page.locator('[data-signing-status]').waitFor();assert.equal(await page.locator('img[alt="检查人员原签名"]').count(),2)}
  assert.equal(await worker.locator('[data-sign]').count(),0);assert.equal(await other.locator('[data-sign]').count(),0);
  async function addGuest(page,name,unit){await page.locator('[data-guest-name]').fill(name);await page.locator('[data-guest-unit]').fill(unit);await page.locator('[data-guest-add]').click();await page.getByRole('button',{name:`请${name}本人签字`,exact:true}).waitFor()}
  await Promise.all([addGuest(worker,'现场甲','单位甲'),addGuest(other,'现场乙','单位乙')]);
  await worker.getByRole('button',{name:'请现场甲本人签字',exact:true}).click();await other.getByRole('button',{name:'请现场乙本人签字',exact:true}).click();
  async function draw(page){const canvas=page.locator('[role=dialog] [data-sign]');await canvas.scrollIntoViewIfNeeded();const b=await canvas.boundingBox();await page.mouse.move(b.x+35,b.y+30);await page.mouse.down();await page.mouse.move(b.x+105,b.y+100,{steps:8});await page.mouse.move(b.x+185,b.y+35,{steps:8});await page.mouse.up();return canvas.evaluate(c=>c.toDataURL())}
  const imported=fs.readFileSync(path.resolve(__dirname,'../../local-inspector/tests/fixtures/upload-test.png'));
  const jpeg=Buffer.from((await lead.evaluate(async data=>{const image=new Image();image.src=data;await image.decode();const c=document.createElement('canvas');c.width=image.width;c.height=image.height;c.getContext('2d').drawImage(image,0,0);return c.toDataURL('image/jpeg')},'data:image/png;base64,'+imported.toString('base64'))).split(',')[1],'base64');
  const leadInk=await draw(lead);await draw(other);await draw(receiver);
  for(const page of [lead2,worker,receiver2]){await page.locator('[data-sign-image]').setInputFiles(page===receiver2?{name:'signature.jpg',mimeType:'image/jpeg',buffer:jpeg}:{name:'signature.png',mimeType:'image/png',buffer:imported});await page.locator('[data-sign-preview]').waitFor({state:'visible'})}
  const before=await (await lead.request.get(base+'/api/work/combined-data/'+id)).json();assert.equal(before.signedCount,0);
  async function submit(page){await page.locator('[role=dialog] [data-sign-save]').click();await page.locator('#dialogOK').click()}
  await submit(worker);
  await lead.locator('[data-signing-status] img').first().waitFor({timeout:12000});
  assert.equal(await leadDialog.locator('[data-sign]').evaluate(c=>c.toDataURL()),leadInk);assert.equal(await leadDialog.locator('[data-assignment]').count(),0);
  await Promise.all([lead,lead2,other,receiver,receiver2].map(submit));
  for(const page of pages){await page.locator('[data-signing-status] img').nth(5).waitFor({timeout:12000});assert.equal(await page.locator('[data-sign-save]').count(),0);const value=await (await page.request.get(base+'/api/work/combined-data/'+id)).json();assert.equal(value.id,id);assert.equal(value.signedCount,6);assert.equal(value.signers.filter(p=>p.role==='项目负责人').length,2);assert.equal(value.guestSigners.length,2);assert.equal(value.report.signatures.length,2)}
  await addGuest(worker,'现场丙','单位丙');await lead.getByRole('button',{name:'请现场丙本人签字',exact:true}).waitFor({timeout:12000});
  const word=await lead.request.get(base.replace('/quality','')+download);assert.equal(word.status(),200);assert.ok((await word.body()).subarray(0,2).equals(Buffer.from('PK')));
  await lead.setViewportSize({width:390,height:844});assert.equal(await lead.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  if(process.env.QAXC_QA_OUTPUT){fs.mkdirSync(process.env.QAXC_QA_OUTPUT,{recursive:true});await lead.locator('[data-signing-status]').scrollIntoViewIfNeeded();await lead.screenshot({path:path.join(process.env.QAXC_QA_OUTPUT,'shared-signatures-mobile.png')});await worker.locator('[data-signing-status]').scrollIntoViewIfNeeded();await worker.screenshot({path:path.join(process.env.QAXC_QA_OUTPUT,'onsite-signatures-shared-report.png')});fs.writeFileSync(path.join(process.env.QAXC_QA_OUTPUT,'shared-signatures-browser.docx'),await word.body())}
  assert.deepEqual(errors,[]);console.log('PASS: two leaders, two account recipients and two onsite recipients share one report; original inspector signatures retained; image import, concurrent signatures, appended slots, live sync and Word export verified.');
 }finally{await browser?.close();py.stdin.write('stop\n');await new Promise(resolve=>{py.once('exit',resolve);setTimeout(()=>{py.kill();resolve()},5000)})}
})().catch(e=>{console.error(e);process.exitCode=1});
