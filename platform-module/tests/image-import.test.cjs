const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(__dirname+'/../miniprogram/utils/image-import.js','utf8');
function setup(){
 const calls=[],files={'/input':'iVBORw0KGgoAAA=='},wx={
  getImageInfo:o=>{calls.push('decode');o.success({width:100,height:50,path:o.src})},
  getFileSystemManager:()=>({readFile:o=>o.success({data:files[o.filePath]})}),
  chooseMedia:o=>{calls.push(o);o.success({tempFiles:[{tempFilePath:'/input',size:10}]})},
  chooseMessageFile:o=>{calls.push(o);o.success({tempFiles:[{path:'/input',name:'scan.WEBP',size:10}]})}
 };const module={exports:{}};vm.runInNewContext(source,{wx,module});return {wx,files,calls,images:module.exports};
}
test('PNG is verified and preserved without canvas conversion',async()=>{const h=setup(),r=await h.images.normalize({path:'/input'},{});assert.equal(r.path,'/input');assert.equal(r.extension,'png');assert.equal(r.base64,h.files['/input']);assert.equal(h.calls[0],'decode')});
test('JPEG is detected from bytes rather than a misleading filename',async()=>{const h=setup();h.files['/input']=Buffer.from([255,216,255,0,0,0,255,217]).toString('base64');assert.equal((await h.images.normalize({path:'/input',name:'wrong.webp'},{})).extension,'jpg')});
test('JPEG with trailing metadata must be re-encoded, never sent through unchanged',async()=>{
 const h=setup();h.files['/input']=Buffer.from([255,216,255,0,255,217,9,10]).toString('base64');
 let queried=false;h.wx.createSelectorQuery=()=>({in(){return this},select(){return this},fields(){return this},exec(fn){queried=true;fn([])}});
 await assert.rejects(h.images.normalize({path:'/input'},{}),/转换尚未就绪/);assert.equal(queried,true);
});
test('unreadable or unsupported image is rejected without upload or writes',async()=>{const h=setup();h.wx.getImageInfo=o=>o.fail();await assert.rejects(h.images.normalize({path:'/input',name:'scan.heic'},{}),/当前微信无法读取/)});
test('input size and pixel limits remain in force',async()=>{const h=setup();await assert.rejects(h.images.normalize({path:'/input',size:1400001},{},{signature:true}),/1.4MB/);await assert.rejects(h.images.normalize({path:'/input',size:10485761},{}),/10MB/);h.wx.getImageInfo=o=>o.success({width:10000,height:10000});await assert.rejects(h.images.normalize({path:'/input'},{}),/尺寸/)});
test('chat picker permits images supplied as files and normalizes paths',async()=>{const h=setup(),files=await h.images.select({source:'message',count:9});assert.equal(h.calls[0].type,'all');assert.equal(h.calls[0].count,9);assert.equal(files[0].path,'/input')});
test('cancelled selection returns no images',async()=>{const h=setup();h.wx.chooseMedia=o=>o.fail({errMsg:'chooseMedia:fail cancel'});assert.equal((await h.images.select()).length,0)});
test('signature uses selected source, normalizes locally and cancellation keeps old signature',async()=>{
 const signatureSource=fs.readFileSync(__dirname+'/../miniprogram/utils/signature.js','utf8'),module={exports:{}},calls=[],page={};
 const images={select:async o=>{calls.push(o);return [{path:'/input'}]},normalize:async(f,p,o)=>{assert.equal(p,page);assert.equal(o.signature,true);return {path:'/converted',base64:'bytes'}}};
 const wx={showActionSheet:o=>o.success({tapIndex:1})};vm.runInNewContext(signatureSource,{module,require:()=>images,wx});
 assert.equal((await module.exports.choose(page)).path,'/converted');assert.equal(calls[0].source,'message');wx.showActionSheet=o=>o.fail({errMsg:'cancel'});assert.equal(await module.exports.choose(page),null);assert.equal(calls.length,1);
});
