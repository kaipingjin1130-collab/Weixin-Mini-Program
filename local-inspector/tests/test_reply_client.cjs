const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../web/work.js'),'utf8');
const handler=source.slice(source.indexOf(" root.querySelectorAll('[data-reply]')"),source.indexOf(" root.querySelectorAll('[data-issue]')"));
function setup(evidence,fail=false){
 const status={},textarea={value:'整改已完成'},form={dataset:{reply:'issue1'},elements:{text:textarea},querySelector:()=>status};
 const calls=[],drafts={};let pending;
 vm.runInNewContext(handler,{root:{querySelectorAll:()=>[form]},replyDrafts:drafts,t:{scenario:{workflow:{requireEvidence:true}}},selectedEvidence:()=>evidence,run:fn=>{pending=fn().catch(()=>{})},action:async(...args)=>{calls.push(args);if(fail)throw Error('保存失败，请重试')},toast:()=>{}});
 return {status,textarea,calls,drafts,submit:async()=>{form.onsubmit({preventDefault(){}});await pending}};
}
test('missing evidence blocks submission with persistent explanation and preserves reply',async()=>{
 const p=setup([]);await p.submit();assert.equal(p.calls.length,0);assert.match(p.status.textContent,/上传并勾选/);assert.equal(p.drafts.issue1,'整改已完成');
});
test('failed reply retains text and displays server error',async()=>{
 const p=setup(['photo1'],true);await p.submit();assert.equal(p.drafts.issue1,'整改已完成');assert.equal(p.status.textContent,'保存失败，请重试');
});
test('successful reply sends evidence and clears draft only after saving',async()=>{
 const p=setup(['photo1']);await p.submit();assert.equal(p.calls[0][0],'reply');assert.equal(p.calls[0][1].text,'整改已完成');assert.equal(p.calls[0][1].evidence[0],'photo1');assert.equal(p.drafts.issue1,undefined);
});
