const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const test=require('node:test'),assert=require('node:assert/strict');
function setup(){
  let def,calls=0;
  const storage={rememberedAccount:{username:'existing',password:'old-test-password'}};
  const wx={getStorageSync:k=>storage[k],setStorageSync:(k,v)=>storage[k]=v,showModal:()=>{}};
  const api={identityUat:true,base:()=> 'http://127.0.0.1:18818',reset:()=>{},request:async()=>{calls++;return {token:'test-only-token'}}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../miniprogram/pages/index/index.js'),'utf8'),{require:()=>api,Page:p=>def=p,wx});
  const p={...def,data:{...def.data},setData(x){Object.assign(this.data,x)},refresh:async()=>{},openWork:()=>{}};
  return {p,storage,calls:()=>calls};
}
test('acceptance login never restores or persists a password',async()=>{
  const {p,storage}=setup();await p.onLoad();assert.equal(p.data.password,'');assert.equal(p.data.identityUat,true);
  p.data.password='test-only-password';await p.login();assert.equal(p.data.password,'');
  assert.equal(storage.rememberedAccount.username,'existing');assert.equal(storage.rememberedAccount.password,undefined);
});
test('acceptance login requires explicit credentials',async()=>{
  const {p,calls}=setup();p.data.username='';p.data.password='';await p.login();assert.equal(calls(),0);
});
