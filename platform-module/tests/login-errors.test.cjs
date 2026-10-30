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

function sessionClient(status,fail=false){
 const calls=[],context={AbortSignal,fetch:async(path,options)=>{calls.push({path,options});if(fail)throw Error('network');return {status}}};
 vm.createContext(context);vm.runInContext(source.slice(source.indexOf('async function restoreHostSession(){'),source.indexOf('restoreHostSession().finally(boot);')),context);
 return {restore:context.restoreHostSession,calls};
}
test('refresh preserves explicit inspection login instead of replacing it with host identity',async()=>{
 const c=sessionClient(200);await c.restore();assert.deepEqual(c.calls.map(c=>c.path),['/api/session']);
});
test('host sign-in is restored only when inspection session is absent',async()=>{
 const c=sessionClient(401);await c.restore();assert.deepEqual(c.calls.map(c=>c.path),['/api/session','/api/host-session']);assert.equal(c.calls[1].options.method,'POST');
});
test('temporary service failure never switches to another host account',async()=>{
 const c=sessionClient(503);await c.restore();assert.equal(c.calls.length,1);const down=sessionClient(0,true);await down.restore();assert.equal(down.calls.length,1);
});
