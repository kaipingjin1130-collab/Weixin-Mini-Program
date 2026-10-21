const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const test=require('node:test');
const path=require('node:path');
function setup({cancel=false,uploadError=false}={}){
 let definition,chosen,uploads=[],messages=[];
 const api={upload:async p=>{uploads.push(p);if(uploadError)throw Error('网络失败');return uploads.length===1?'image123':'image'+uploads.length}};
 const wx={canvasToTempFilePath:o=>o.success({tempFilePath:'/signature.png'}),nextTick:()=>{},getStorageSync:()=> 'session',showModal:o=>messages.push(o.content),enableAlertBeforeUnload:()=>{},chooseMedia:o=>{chosen=o;if(cancel)o.fail({errMsg:'chooseMedia:fail cancel'});else o.success({tempFiles:[{tempFilePath:'/local/test.jpg',size:128}]})}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../miniprogram/pages/index/index.js'),'utf8'),{require:()=>api,Page:d=>definition=d,wx,console});
 const p={...definition,data:JSON.parse(JSON.stringify(definition.data))};
 p.data.edit={issues:[{photos:[]}]};
 p.setData=values=>{for(const [key,value] of Object.entries(values)){let parts=key.replace(/\[(\d+)\]/g,'.$1').split('.');let object=p.data;for(const k of parts.slice(0,-1))object=object[k]??(object[k]={});object[parts.at(-1)]=value}};
 return {p,get chosen(){return chosen},uploads,messages};
}
test('direct capture selects camera only and binds uploaded photo to issue',async()=>{
 const s=setup();await s.p.photos({currentTarget:{dataset:{index:'0',source:'camera'}}});
 assert.equal(s.chosen.sourceType.join(','),'camera');assert.equal(s.chosen.mediaType.join(','),'image');assert.equal(s.chosen.camera,'back');assert.equal(s.chosen.count,1);assert.deepEqual(s.p.data.edit.issues[0].photos,['image123']);assert.equal(s.p.data.media.image123,'/local/test.jpg');
});
test('cancelled camera does not create a photo or show failure',async()=>{
 const s=setup({cancel:true});await s.p.photos({currentTarget:{dataset:{index:'0',source:'camera'}}});assert.equal(s.uploads.length,0);assert.equal(s.messages.length,0);assert.equal(s.p.data.edit.issues[0].photos.length,0);
});
test('failed upload preserves previous associations and exposes error',async()=>{
 const s=setup({uploadError:true});s.p.data.edit.issues[0].photos=['existing'];await s.p.photos({currentTarget:{dataset:{index:'0',source:'album'}}});assert.equal(s.chosen.sourceType.join(','),'album');assert.deepEqual(s.p.data.edit.issues[0].photos,['existing']);assert.equal(s.messages[0],'网络失败');assert.equal(s.p.data.busy,false);
});

test('switching signer captures each signature separately and retains both',async()=>{
 const {p}=setup();p.data.edit={inspector:'张三、李四',signature:'',signatures:[{name:'张三',signature:''},{name:'李四',signature:''}],issues:[]};p.initCanvas();
 p.signDirty=true;await p.chooseSigner({detail:{value:'1'}});
 assert.equal(p.data.edit.signatures[0].signature,'image123');assert.equal(p.data.edit.signature,'');
 p.signDirty=true;await p.captureSigner();assert.equal(p.data.edit.signatures[1].signature,'image2');
 await p.chooseSigner({detail:{value:'0'}});assert.equal(p.data.edit.signature,'image123');
 p.clearSign();assert.equal(p.data.edit.signatures[0].signature,'');assert.equal(p.data.edit.signatures[1].signature,'image2');
});
test('failed signer upload does not switch signer or discard drawing',async()=>{
 const {p,messages}=setup({uploadError:true});p.data.edit={inspector:'张三、李四',signature:'',signatures:[{name:'张三',signature:''},{name:'李四',signature:''}],issues:[]};p.initCanvas();p.signDirty=true;
 await p.chooseSigner({detail:{value:'1'}});assert.equal(p.data.signerIndex,0);assert.equal(p.signDirty,true);assert.equal(messages[0],'网络失败');
});
test('editing names clears old signatures; legacy single signer initializes correctly',()=>{
 const {p}=setup();p.data.edit={inspector:'张三',signature:'legacy',issues:[]};p.initCanvas();assert.equal(p.data.edit.signatures[0].signature,'legacy');
 p.field({currentTarget:{dataset:{field:'inspector'}},detail:{value:'张三，李四'}});assert.equal(p.data.edit.signatures.length,2);assert.ok(p.data.edit.signatures.every(x=>!x.signature));
});
