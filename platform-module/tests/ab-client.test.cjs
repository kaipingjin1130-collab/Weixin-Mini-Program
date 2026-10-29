const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const source=fs.readFileSync(require('node:path').join(__dirname,'../candidate/web/ab-client.js'),'utf8');
async function render(job,permissions=['imports.retry','retrospective.generate'],enabled=true){
 const element={dataset:{abDelivery:'d'},innerHTML:'',querySelectorAll:()=>[]};
 const legacy={hidden:false};
 const document={currentScript:{src:'http://localhost/quality/ab-client.js'},body:{},querySelector:()=>element,
  querySelectorAll:s=>s==='[data-ab-legacy-retrospective]'?[legacy]:[element]};
 const ctx=vm.createContext({document,URL,URLSearchParams,AbortSignal,MutationObserver:class{observe(){}},
  fetch:async url=>({ok:enabled,json:async()=>url.endsWith('integration-context')?{subject_id:'admin'}:
   url.includes('integration-delivery')?{meta:{eligible:true,delivery_id:'d',delivery_version:1},permissions}:{items:[job]}})});
 vm.runInContext(source,ctx);
 await new Promise(resolve=>setImmediate(resolve));
 return {html:element.innerHTML,legacy};
}
test('failed retrospective exposes retry, not duplicate generation, under explicit retry permission',async()=>{
 const job={status:'ready',retrospective_status:'failed',capabilities:{can_generate_retrospective:true}};
 const result=await render(job);assert.match(result.html,/重试复盘/);assert.doesNotMatch(result.html,/生成复盘/);
 assert.doesNotMatch((await render(job,['retrospective.generate'])).html,/重试复盘/);
 assert.match((await render({...job,status:'failed'})).html,/重试接入/);
});
test('only not-created retrospective offers generation; active or completed jobs do not',async()=>{
 for(const status of ['not_created','queued','processing','ready']){
  const {html}=await render({status:'ready',retrospective_status:status,capabilities:{can_generate_retrospective:true}});
  assert.equal(html.includes('生成复盘'),status==='not_created');
 }
});
test('v1 hides legacy retrospective entry while legacy deployment retains it',async()=>{
 assert.equal((await render({status:'ready'})).legacy.hidden,true);
 assert.equal((await render({status:'ready'},[],false)).legacy.hidden,false);
});
