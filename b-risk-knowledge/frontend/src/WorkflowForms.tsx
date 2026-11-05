import React from 'react';
export type Value = string|number|null|boolean|Value[]|{[key:string]:Value};
export type Catalog = {id:string;kind:string;label:string;work_kind?:string}[];
const ev = {kind:'asset',id:'',quote:'',locator:''};
const record = {record_key:'',kind:'inspection',date:'',text:'',evidence:[ev]};
const category = {code:'',name:'',parent:null,positive_examples:[''],negative_examples:['']};
const claim = {text:'',nature:'fact',evidence:[ev]};
const step = {number:'',title:'',operation:'',risks:[''],measures:[''],checks:[''],evidence:[ev]};
const parameter = {name:'',value:null,evidence:[ev]};
export const templates:Record<string,Value> = {
 taxonomy:{kind:'taxonomy',rule:'',categories:[category]},
 hazard:{kind:'hazard',description:'',occurred_on:'',stage:'',object_name:'',taxonomy_id:'',category:'',subcategory:'',tags:[],classification_reason:'',original_risk:'待核实',reviewed_risk:'待核实',risk_reason:'',status:'unverified',nature:'observed_hazard',split_reason:'',relation:'independent',related_event_id:null,records:[record]},
 compilation:{kind:'compilation',mode:'single',event_ids:[''],background:'',claims:[claim],differences:'',limitations:[''],missing:[]},
 guide:{kind:'guide',conditions:{项目类型:'',地域:'',作业对象:'',设备型号:'',环境:'',人员:'',前置方案:''},required_conditions:['项目类型','作业对象','人员','前置方案'],preparation:'',implementation:'',risk_control:'',acceptance:'',emergency:'',steps:[step],parameters:[],missing:[],conflicts:[]},
 question:{kind:'question',guide_id:'',chapter:'',role:'',step:'',risk:'',point:'',cognitive_level:'recall',difficulty:'medium',type:'single',stem:'',options:{a:'',b:'',c:'',d:''},answer:['a'],explanation:'',rubric:[],evidence:[{...ev,kind:'work'}],historical_case_ids:[]}
};
const arrayItems:Record<string,Value>={evidence:ev,records:record,categories:category,claims:claim,steps:step,parameters:parameter};
export const labels:Record<string,string>={taxonomy:'分类字典',hazard:'隐患事件',compilation:'案例汇编',guide:'作业指导书',question:'指导书题目',
 kind:'类型',title:'标题',rule:'分类规则',categories:'分类项',code:'分类编码',name:'名称',parent:'父分类编码（可空）',positive_examples:'正例',negative_examples:'反例',
 description:'隐患原始描述',occurred_on:'发生日期',stage:'阶段',object_name:'作业对象',taxonomy_id:'分类规则版本',category:'主分类编码',subcategory:'子分类编码',tags:'辅助标签',classification_reason:'分类理由',original_risk:'原始风险等级',reviewed_risk:'人工核查等级',risk_reason:'等级核查依据',status:'闭环状态',nature:'性质',split_reason:'问题拆分依据',relation:'与其他事件的关系',related_event_id:'关联事件（可空）',records:'检查 / 整改 / 复查记录',record_key:'原记录唯一编号',date:'日期',text:'内容',evidence:'来源证据',id:'来源版本',quote:'精确原文摘录',locator:'页码 / 段落 / 表格位置',mode:'汇编类型',event_ids:'固定事件版本',background:'项目与场景背景',claims:'事实、结论与分析',differences:'差异及适用边界',limitations:'限制与缺失证据说明',missing:'待补充项',conditions:'项目条件',required_conditions:'企业必填条件',preparation:'准备',implementation:'实施',risk_control:'风险控制',acceptance:'检查验收',emergency:'异常处置',steps:'步骤—风险—措施—检查—依据',parameters:'关键参数',value:'参数值（无依据留空）',number:'步骤编号',operation:'操作说明',risks:'风险',measures:'控制措施',checks:'检查要求',conflicts:'未解决冲突',guide_id:'已发布指导书版本',chapter:'章节',role:'岗位',step:'步骤编号',risk:'风险点',point:'考点',cognitive_level:'考查层次',difficulty:'预设难度',type:'题型',stem:'题干',options:'选项（案例/判断题请移除）',answer:'答案',explanation:'解析',rubric:'评分要点',historical_case_ids:'历史案例版本'};
const choices:Record<string,[string,string][]>={status:[['unverified','待核实'],['open','未整改'],['rectifying','整改中'],['closed','复查闭环']],relation:[['independent','独立事件'],['recurrence','同对象再次发生'],['possible_duplicate','疑似重复（不自动合并）']],mode:[['single','单案例'],['category','类别汇编'],['project','项目汇编']],type:[['single','单选'],['multiple','多选'],['judgment','判断'],['case','案例分析']],cognitive_level:[['recall','识记'],['sequence','操作顺序'],['scenario','情境判断'],['case','案例分析']],difficulty:[['easy','容易'],['medium','中等'],['hard','困难']]};
export function FormFields({value,onChange,catalog,name='',path='content',readonly=false}:{value:Value;onChange:(v:Value)=>void;catalog:Catalog;name?:string;path?:string;readonly?:boolean}) {
 const label=labels[name]||name;
 if(Array.isArray(value))return <fieldset className="wf-group"><legend>{label}</legend>{value.map((v,i)=><div className="wf-array" key={i}><FormFields value={v} name={name.endsWith('_ids')?name.slice(0,-1):''} path={path+'.'+i} catalog={catalog} readonly={readonly} onChange={next=>onChange(value.map((old,n)=>n===i?next:old))}/>{!readonly&&<button type="button" className="button ghost" aria-label={'删除'+label+String(i+1)} onClick={()=>onChange(value.filter((_,n)=>i!==n))}>移除</button>}</div>)}{!readonly&&<button type="button" className="button ghost" onClick={()=>onChange([...value,structuredClone(arrayItems[name]??'')])}>添加{label}</button>}</fieldset>;
 if(value!==null&&typeof value==='object')return <div className="wf-fields">{Object.entries(value).map(([k,v])=> k==='kind'&&path==='content'?null:<FormFields key={k} name={k} value={v} path={path+'.'+k} catalog={catalog} readonly={readonly} onChange={next=>{
   const updated={...value,[k]:next};
   if(k==='type'&&['judgment','case'].includes(String(next)))updated.options={};
   if(k==='kind'&&'id' in value)updated.id='';
   onChange(updated);
 }}/>)}</div>;
 let options=choices[name];
 if(name==='kind')options=path.includes('.records.')?[['inspection','检查'],['rectification','整改'],['reinspection','复查']]:[['asset','原件'],['record','历史记录'],['standard','规范版本'],['work','知识成果']];
 if(name==='nature')options=path.includes('claims')?[['fact','原始事实'],['source_conclusion','资料已有结论'],['analysis','系统分析'],['hypothesis','待核实假设']]:[['observed_hazard','已发现隐患'],['potential_source','潜在风险源']];
 const workKind:Record<string,string>={taxonomy_id:'taxonomy',guide_id:'guide',related_event_id:'hazard',event_id:'hazard'};
 if(name==='id'||name in workKind||name==='historical_case_id') options=catalog.filter(c=>name in workKind?c.work_kind===workKind[name]:name==='historical_case_id'?['hazard','compilation'].includes(c.work_kind||''):true).map(c=>[c.id,c.label]);
 return <label className="wf-field" htmlFor={path}><span>{label||'内容'}</span>{readonly?<div className="wf-value">{options?.find(x=>x[0]===String(value))?.[1]||String(value??'待填')}</div>:options?<select id={path} value={String(value??'')} onChange={e=>onChange(e.target.value||null)}><option value="">请选择</option>{options.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>:name==='date'||name==='occurred_on'?<input id={path} type="date" value={String(value??'')} onChange={e=>onChange(e.target.value)}/>:<textarea id={path} rows={['description','text','quote','operation','rule','stem'].includes(name)?3:2} value={String(value??'')} onChange={e=>onChange(e.target.value===''&&['parent','value','related_event_id'].includes(name)?null:e.target.value)}/>}</label>;
}
