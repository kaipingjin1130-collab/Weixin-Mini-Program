import {useEffect,useState} from 'react';
type Api=<T>(url:string,options?:RequestInit)=>Promise<T>;
type Settings={enabled:boolean;base_url:string;model:string;api_key_configured:boolean;timeout_seconds:number;max_tokens:number};
type Preset={id:string;name:string;base_url:string;default_model:string;models:{id:string;name:string}[]};

export function ModelSettings({api}:{api:Api}) {
 const [settings,setSettings]=useState<Settings|null>(null),[presets,setPresets]=useState<Preset[]>([]);
 const [provider,setProvider]=useState('openai'),[secret,setSecret]=useState(''),[busy,setBusy]=useState(false);
 const [error,setError]=useState(''),[notice,setNotice]=useState('');
 useEffect(()=>{let stale=false;void Promise.all([api<Settings>('/models/settings'),api<{items:Preset[]}>('/models/presets')]).then(([s,p])=>{
  if(stale)return;setPresets(p.items);const selected=p.items.find(x=>x.base_url===s.base_url);
  if(!s.model&&!s.api_key_configured){const initial=p.items[0];setProvider(initial.id);setSettings({...s,base_url:initial.base_url,model:initial.default_model});}
  else {setProvider(selected?.id||'custom');setSettings(s);}
 }).catch(e=>{if(!stale)setError(e.message);});return()=>{stale=true;};},[]);
 const selectProvider=(id:string)=>{const p=presets.find(x=>x.id===id);setProvider(id);setSecret('');setNotice('');setError('');
  if(settings)setSettings({...settings,base_url:p?.base_url||'',model:p?.default_model||'',api_key_configured:false});};
 const save=async()=>{if(!settings)return;setBusy(true);setError('');setNotice('');try{
  const {api_key_configured,...fields}=settings;
  const saved=await api<Settings>('/models/settings',{method:'PUT',body:JSON.stringify({...fields,enabled:true,...(secret?{api_key:secret}:{})})});
  setSettings(saved);setSecret('');setNotice('配置已保存，正在测试连接…');
  const result=await api<{status:string}>('/models/test',{method:'POST'});
  if(result.status!=='ok')throw new Error('配置已保存，但模型未返回预期结果，请重新测试。');
  setNotice('连接测试通过，可以开始知识萃取和案例评分。');
 }catch(e){setNotice('');setError((e as Error).message);}finally{setBusy(false);}};
 return <section className="panel"><div className="panel-heading"><h2>选择模型并连接</h2><span>填写对应服务的 API Key</span></div><div className="proof-body">
 {error&&<p className="feedback error" role="alert">{error}</p>}{notice&&<p className="feedback success" role="status">{notice}</p>}
 {!settings?<p>正在读取模型配置…</p>:<>
 <label>模型服务<select aria-label="模型服务" disabled={busy} value={provider} onChange={e=>selectProvider(e.target.value)}>{presets.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}<option value="custom">其他兼容服务（自定义）</option></select></label>
 {provider==='custom'?<><label>服务地址<input aria-label="模型服务地址" disabled={busy} value={settings.base_url} onChange={e=>setSettings({...settings,base_url:e.target.value,api_key_configured:false})}/></label><label>模型名称<input aria-label="模型名称" disabled={busy} value={settings.model} onChange={e=>setSettings({...settings,model:e.target.value})}/></label></>:<label>模型<select aria-label="模型名称" disabled={busy} value={settings.model} onChange={e=>setSettings({...settings,model:e.target.value})}>{!presets.find(p=>p.id===provider)?.models.some(m=>m.id===settings.model)&&<option value={settings.model}>{settings.model}（已保存）</option>}{presets.find(p=>p.id===provider)?.models.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></label>}
 <label>API Key<input aria-label="模型密钥" type="password" autoComplete="new-password" disabled={busy} value={secret} onChange={e=>setSecret(e.target.value)} placeholder={settings.api_key_configured?'已保存，留空继续使用':'粘贴所选服务的 API Key'}/></label>
 <details><summary>高级设置</summary><div className="form-grid"><label>请求超时（秒）<input aria-label="模型超时" type="number" min={5} max={180} value={settings.timeout_seconds} onChange={e=>setSettings({...settings,timeout_seconds:Number(e.target.value)})}/></label><label>最大输出 token<input aria-label="模型输出限制" type="number" min={256} max={16000} value={settings.max_tokens} onChange={e=>setSettings({...settings,max_tokens:Number(e.target.value)})}/></label></div><p className="small-note">服务地址：{settings.base_url}</p></details>
 <div className="card-actions"><button className="button primary" disabled={busy||!settings.model||(!secret.trim()&&!settings.api_key_configured)} onClick={()=>void save()}>{busy?'正在保存并测试…':'保存并测试'}</button>{settings.enabled&&<button className="button secondary" disabled={busy} onClick={()=>{setBusy(true);setError('');const {api_key_configured,...fields}=settings;void api<Settings>('/models/settings',{method:'PUT',body:JSON.stringify({...fields,enabled:false})}).then(s=>{setSettings(s);setNotice('云端调用已停用。');}).catch(e=>setError(e.message)).finally(()=>setBusy(false));}}>停用云端调用</button>}</div>
 <p className="small-note">保存并测试会启用云端调用，测试仅发送连接检查文本。业务加工只发送所选资料；密钥不回显。ChatGPT 网页订阅与 API 额度分别计费。</p>
 </>}
 </div></section>;
}
