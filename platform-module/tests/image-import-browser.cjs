// Real image decoding + the mini-program converter via a wx adapter, against an isolated HTTP backend.
const {chromium}=require('playwright'),{spawn}=require('node:child_process'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const py=spawn('python',['-u',path.join(__dirname,'combined_browser_server.py')],{cwd:path.resolve(__dirname,'../..'),windowsHide:true});let browser;
 try{
  const {port}=await new Promise((resolve,reject)=>{let out='';py.stdout.on('data',b=>{out+=b;if(out.includes('\n')){try{resolve(JSON.parse(out.split('\n')[0]))}catch(e){reject(e)}}});py.stderr.on('data',b=>process.stderr.write(b));py.once('error',reject);py.once('exit',c=>reject(Error('fixture exit '+c)))});
  browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage();await page.goto('http://127.0.0.1:'+port+'/quality/');
  const bmp=Buffer.alloc(70);bmp.write('BM');bmp.writeUInt32LE(70,2);bmp.writeUInt32LE(54,10);bmp.writeUInt32LE(40,14);bmp.writeInt32LE(2,18);bmp.writeInt32LE(2,22);bmp.writeUInt16LE(1,26);bmp.writeUInt16LE(24,28);bmp.fill(150,54);
  const output=await page.evaluate(async({source,bmp})=>{
   const files={},made=document.createElement('canvas');made.width=20;made.height=10;const draw=made.getContext('2d');draw.fillStyle='#123456';draw.fillRect(3,3,9,3);
   files.png=made.toDataURL('image/png');files.jpeg=made.toDataURL('image/jpeg');files.webp=made.toDataURL('image/webp');files.bmp='data:image/bmp;base64,'+bmp;files.gif='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
   files.jpegTrailing='data:image/jpeg;base64,'+btoa(atob(files.jpeg.split(',')[1])+'trailing editor metadata');
   const decode=url=>new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=url});
   let sequence=0;const canvas=document.createElement('canvas');canvas.createImage=()=>new Image();
   const wx={getImageInfo:o=>decode(files[o.src]).then(i=>o.success({width:i.width,height:i.height,path:files[o.src]}),()=>o.fail()),getFileSystemManager:()=>({readFile:o=>o.success({data:files[o.filePath].split(',')[1]})}),createSelectorQuery:()=>({in(){return this},select(id){if(id!=='#imageImportCanvas')throw Error('wrong canvas');return this},fields(){return this},exec(fn){fn([{node:canvas}])}}),canvasToTempFilePath:o=>{const p='converted-'+sequence++;files[p]=o.canvas.toDataURL(o.fileType==='png'?'image/png':'image/jpeg',o.quality);o.success({tempFilePath:p})}};
   const module={exports:{}};new Function('wx','module',source)(wx,module);const output=[];
   for(const name of Object.keys(files).filter(n=>!n.startsWith('converted'))){for(const signature of [false,true]){
    const result=await module.exports.normalize({path:name,size:100},{},{signature});const image=await decode(files[result.path]);
    const c=document.createElement('canvas');c.width=image.width;c.height=image.height;c.getContext('2d').drawImage(image,0,0);const alpha=c.getContext('2d').getImageData(0,0,1,1).data[3];
    output.push({name,signature,alpha,width:image.width,height:image.height,...result});
   }}return output;
  },{source:fs.readFileSync(path.join(__dirname,'../miniprogram/utils/image-import.js'),'utf8'),bmp:bmp.toString('base64')});
  assert.equal(output.length,12);for(const x of output){assert.ok(['png','jpg'].includes(x.extension));assert.ok(x.width>0&&x.height>0);if(['webp','gif'].includes(x.name)&&x.signature)assert.equal(x.alpha,0);if(x.name==='jpegTrailing'){assert.notEqual(x.path,'jpegTrailing');assert.equal(x.extension,x.signature?'png':'jpg')}}
  const base='http://127.0.0.1:'+port+'/quality';let token='';async function req(route,data,raw=false){const r=await fetch(base+route,{method:data?'POST':'GET',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:data?JSON.stringify({...data,requestId:crypto.randomUUID()}):undefined});if(!r.ok)throw Error(await r.text());return raw?Buffer.from(await r.arrayBuffer()):r.json()}
  token=(await req('/api/login',{username:'owner',password:'synthetic-password'})).token;const state=await req('/api/work/state'),projectId=state.projects[0].id;
  let task=await req('/api/work/adhoc-tasks',{projectId,scenarioId:'inspection',title:'隔离格式验收',fields:{},quickStart:true}),signature='';
  for(const x of output){const ev=await req('/api/work/upload',{projectId,name:(x.signature?'签名.':'照片.')+x.extension,base64:x.base64,occurredAt:new Date().toISOString()});assert.equal(ev.mime,x.extension==='png'?'image/png':'image/jpeg');if(x.signature){signature=ev.id;continue}task=await req('/api/work/issue',{taskId:task.id,revision:task.revision,category:'其他',description:x.name+'格式测试',location:'隔离测试',risk:'低',evidence:[ev.id]})}
  task=await req('/api/work/submit-field',{taskId:task.id,revision:task.revision,inspectors:'格式测试员',signer:'格式测试员',signature,signMethod:'image'});const word=await req('/api/work/brief-word/'+task.fieldBriefs.at(-1).id,null,true);assert.equal(word.subarray(0,2).toString(),'PK');
  console.log('PASS: PNG/JPEG/WebP/BMP/GIF and JPEG with trailing metadata x photo/signature; transparent signatures; 12 real uploads and Word export.');
 }finally{if(browser)await browser.close();py.stdin.end();py.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
