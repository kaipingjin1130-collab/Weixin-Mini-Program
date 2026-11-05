type Api=<T>(url:string,options?:RequestInit)=>Promise<T>;
// Every HTTP request remains short; the durable worker continues after navigation.
export async function generateInBackground<T>(api:Api,url:string,body:unknown,onQueued:()=>void):Promise<T>{
 const submitted=await api<{job_id:string}>(url,{method:'POST',headers:{'Idempotency-Key':crypto.randomUUID()},body:JSON.stringify(body)});
 onQueued();
 const end=Date.now()+20*60*1000;
 while(Date.now()<end){
  const job=await api<{status:string;error:string|null;result:T}>('/model-generation-jobs/'+submitted.job_id);
  if(job.status==='succeeded')return job.result;
  if(job.status==='failed')throw new Error(job.error||'后台生成失败，请从任务工作台查看或重试。');
  await new Promise(resolve=>setTimeout(resolve,2000));
 }
 throw new Error('任务仍在后台处理，请从任务工作台查看进度；无需重复提交。');
}
