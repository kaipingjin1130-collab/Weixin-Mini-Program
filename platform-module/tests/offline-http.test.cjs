const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{spawn}=require('node:child_process');
test('offline drafts synchronize through real backend and appear in web state without duplicates',{timeout:20000},async()=>{
 const root=path.resolve(__dirname,'..');const dir=fs.mkdtempSync(path.join(root,'offline-http-'));
 const py=spawn(process.env.QAXC_TEST_PYTHON || 'python',['-u','-c',"import server; server.init(); h=server.ThreadingHTTPServer(('127.0.0.1',0),server.Handler); print(h.server_port,flush=True); h.serve_forever()"],{cwd:path.join(root,'candidate'),env:{...process.env,QAXC_DATA:dir,QAXC_ROOT_PATH:'/quality',QAXC_AUTH_URL:'',QAXC_PASSWORD:'offline-test-password'},windowsHide:true});
 try{const port=await new Promise((resolve,reject)=>{py.stdout.once('data',b=>resolve(Number(String(b).trim())));py.once('error',reject);py.once('exit',c=>reject(Error('backend exit '+c)))});const base='http://127.0.0.1:'+port+'/quality';let token='';
 async function req(url,data){const r=await fetch(base+url,{method:data?'POST':'GET',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:data?JSON.stringify(data):undefined});const v=await r.json();if(!r.ok)throw Error(v.error);return v}
 token=(await req('/api/login',{username:'admin',password:'offline-test-password'})).token;
 const p=await req('/api/projects',{name:'离线集成测试项目',contract:'隔离测试合同'});
 let memory={};const wx={env:{USER_DATA_PATH:dir},getStorageSync:k=>memory[k],setStorageSync:(k,v)=>memory[k]=JSON.parse(JSON.stringify(v)),getFileSystemManager:()=>({mkdirSync:(p)=>fs.mkdirSync(p,{recursive:true}),accessSync:p=>fs.accessSync(p),copyFile:o=>{fs.copyFileSync(o.srcPath,o.destPath);o.success()},readFile:o=>{try{o.success({data:fs.readFileSync(o.filePath).toString('base64')})}catch(e){o.fail()}}})};
 const mod={exports:{}};vm.runInNewContext(fs.readFileSync(root+'/miniprogram/utils/offline.js','utf8'),{module:mod,wx,Date,Math,Set});const store=mod.exports;
 let lose=true;const api={base:()=>base,request:async(url,data)=>{const result=await req(url,data);if(lose&&url.endsWith('/issue')){lose=false;throw Error('模拟上传成功但响应丢失')}return result}};
 await store.prepare(api);let d=store.create(p.id);d.checklist=d.scenario.checklist.slice();const png=path.join(dir,'test.png');fs.writeFileSync(png,Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jZ1kAAAAASUVORK5CYII=','base64'));const photo=await store.savePhoto(png);
 d.issues=[{id:'first',category:'施工安全',subcategory:'防护',location:'三层',description:'临边防护缺失',reference:'核实依据',suggestion:'补齐防护',risk:'高',photos:[photo]}];store.update(d);
 await assert.rejects(store.sync(d.id,api),/响应丢失/);await store.sync(d.id,api);
 const state=await req('/api/work/state');assert.equal(state.tasks.length,1);assert.equal(state.tasks[0].issues.length,1);assert.equal(state.tasks[0].issues[0].description,'临边防护缺失');assert.equal(state.tasks[0].issues[0].evidence.length,1);assert.equal(store.get(d.id).status,'synced');await store.sync(d.id,api);assert.equal((await req('/api/work/state')).tasks.length,1);
 }finally{py.kill()}
});

