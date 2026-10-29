const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../candidate/web/app.js'),'utf8');
function client(response){
 let logins=0;
 const context={fetch:async()=>response,AbortSignal,Error,Object,JSON,setTimeout,login:()=>logins++};
 vm.createContext(context);
 vm.runInContext(source.slice(source.indexOf('async function api('),source.indexOf('async function refresh(')),context);
 return {api:context.api,logins:()=>logins};
}
test('failed credential login shows the server reason, without expired-session handling',async()=>{
 const c=client({status:401,json:async()=>({error:'老平台账号或密码不正确，或账号已停用'})});
 await assert.rejects(c.api('/api/login',{username:'member',password:'incorrect'}),/老平台账号或密码不正确/);
 assert.equal(c.logins(),0);
});
test('expired business request still returns to login',async()=>{
 const c=client({status:401,json:async()=>({})});
 await assert.rejects(c.api('/api/state'),/登录已过期/);
 assert.equal(c.logins(),1);
});
test('login service failure preserves its reason instead of a save warning',async()=>{
 const c=client({status:503,ok:false,json:async()=>({error:'老平台认证服务暂不可用，请稍后重试'})});
 await assert.rejects(c.api('/api/login',{username:'member',password:'unused'}),/老平台认证服务暂不可用/);
 assert.equal(c.logins(),0);
});
