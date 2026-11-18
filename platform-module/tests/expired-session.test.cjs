const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
function setup(name,status){
 let definition,token='old-session';const calls=[];
 const api={request:async()=>{if(status!==200){if(status===401)token='';throw Object.assign(Error('request failed'),{status})}},reset:()=>calls.push('reset')};
 const wx={getStorageSync:()=>token,removeStorageSync:()=>{token='';calls.push('remove')},reLaunch:o=>calls.push(o.url),showModal:o=>o.success?.({confirm:true})};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,`../miniprogram/pages/${name}/${name}.js`),'utf8'),{require:()=>api,Page:p=>definition=p,wx});
 const page={...definition,data:structuredClone(definition.data)};
 page.data.mode='home';page.setData=v=>Object.assign(page.data,v);
 return {page,calls,token:()=>token};
}
test('expired task session can return to login after server restart',async()=>{
 const {page,calls,token}=setup('tasks',401);await page.switchAccount();
 assert.equal(token(),'');assert.deepEqual(calls,['remove','reset','/pages/index/index']);assert.equal(page.data.busy,false);
});
test('expired home session clears report state and opens login',async()=>{
 const {page,calls,token}=setup('index',401);await page.logout();
 assert.equal(token(),'');assert.equal(page.data.mode,'login');assert.equal(page.data.edit.issues.length,0);assert.deepEqual(calls,['remove','reset']);
});
for(const name of ['tasks','index'])test(`${name} does not hide an unrelated logout failure`,async()=>{
 const {page,calls,token}=setup(name,503);await page[name==='tasks'?'switchAccount':'logout']();
 assert.equal(token(),'old-session');assert.deepEqual(calls,[]);assert.equal(page.data.mode,'home');assert.equal(page.data.busy,false);
});
