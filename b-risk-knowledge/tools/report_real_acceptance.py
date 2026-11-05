"""Build the B09 Markdown readout from local acceptance evidence, no API calls."""
import json,statistics
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
DATA=ROOT/'b-risk-knowledge/.local/real-model-acceptance'
report=json.loads((DATA/'report.json').read_text(encoding='utf-8'))
chain=json.loads((DATA/'chain.json').read_text(encoding='utf-8'))
fusion=json.loads((ROOT/'.local/fusion-integration/b-real-acceptance.json').read_text(encoding='utf-8'))
assert report['status']=='engineering_passed' and chain['status']=='engineering_passed'
assert all(c['status']=='passed' for c in report['checks'])
usage=report['structured_usage']
cost=(usage['prompt_tokens']*2+usage['completion_tokens']*10)/1e6
lines=['# B 模块真实验收报告','',
 '日期：2026-10-29。分支：`codex/ab-fusion-integration`；基线提交：`2e70a5b`；本轮修改尚未提交或推送。',
 '', '**结论：开发与自动工程验收通过，真实模型链路通过；最终业务验收待审核人员和标准确认。未部署。**',
 '', '## 验收对象与边界','',
 '- 只修改 `开发/ABversion` 融合联调版本，统一入口为 <http://127.0.0.1:18771/quality/>。',
 '- 指定治理工作台来源19,202行，只读抽取14组41条；使用用户指定46分类。原文件没有被修改。',
 '- 用户资料仍带待人工核实标记。30张候选用于离线模型评测，不直接发布；融合页保留本轮实际后台生成的候选及复盘供核查。',
 '- 发布、学习包、作答及评分完整链使用明确标记的隔离测试知识；它证明真实接口链路，不证明真实候选已审核。',
 '', '## 自动验收证据','',
 '|检查|实际结果|','|---|---|',
 '|全量工程回归|128 passed、1 skipped；既有跳过项另由专用v1运行器覆盖|',
 '|最终A/B v1合同|6 passed；86.13秒|',
 '|题型结构、后台生成及审核阻断专项|12 passed|',
 '|任务结果入口和风险投影/新版移除专项|6 passed；与全量有重叠，不重复相加|',
 '|前端|TypeScript、普通资源与融合嵌入构建通过；未启动独立B服务|',
 '|真实评测|'+str(len(report['checks']))+'项通过；无失败项|',
 '|融合HTTP|41/41导入、46分类、真实后台萃取、来源未核实审批拦截、真实后台复盘|',
 '|旧成果覆盖|补齐2个缺失任务包风险投影；二次检查缺失0|',
 '|界面|融合导航、真实项目名、无iframe；桌面及390px窄屏场景表单检查|',
 '', '## 真实模型与检索结果','',
 '- 生成模型：`'+report['model']+'`。14组41条文本生成30张候选；逐项验证JSON结构、合法类别、证据归属及摘录原文连续片段。',
 '- 三种题型均通过真实输出结构、答案格式及原文引用检查；案例评分仍为待教员确认的建议分。',
 '- 向量模型：`text-embedding-3-small`，1536维；30张候选向量和3条预先固定查询均完成。',
 '- 3条查询是独立编写的工程探针，未用模型生成期望答案；缺少人工相关性标签，因此不报告准确率、Recall或泛化效果。',
 '', '|工程探针|首位返回候选|余弦相似度|','|---|---|---|']
for item in report['retrieval_probes']:
    top=item['top3'][0];lines.append('|'+item['query']+'|'+top['title'].replace('|','／')+'|'+str(top['similarity'])+'|')
lines+=['','完整产品服务链验证：'+ '、'.join(chain['checks'])+'。',
 '', '## 用量、时效和费用口径','',
 f"本报告可对账的结构化验收用量：输入 {usage['prompt_tokens']:,} tokens，输出 {usage['completion_tokens']:,} tokens，合计 {usage['total_tokens']:,} tokens。",
 '', f'按GPT-6.1 Sol标准短上下文输入2美元/百万、输出10美元/百万估算，这部分约 **{cost:.4f}美元**（未扣缓存优惠）。价格核对日期2026-10-29，来源：[OpenAI API定价](https://developers.openai.com/api/docs/pricing)。',
 '', '**这不是本轮全部费用或账单。** 不含网络中断可能已计费的请求、首次探索调用、融合入口单独调用、隔离全链额外调用、评分及向量请求；最终以API账户账单为准。未宣称剩余额度或总费用已核对。',
 '', '保存的52项单项执行耗时中位数为 '+str(round(statistics.median(x['seconds'] for x in report['checks']),2))+' 秒，混合了向量、结构化生成及限次网络重试；不是纯模型延迟或生产SLA。缓存复用未作为新调用计费。',
 '', '## 失败与修复','',
 '1. 连接超时：复用本机已启用的回环系统代理；错误拆分为连接、响应超时、网络及输出结构问题。验收中的间歇网络中断限次重试，全部分组最终通过，成功输出保留复用。',
 '2. 真实单选输出不兼容：原答案字段是开放字典，模型可能使用其他键；按题型固定 selected 或 text，保留严格校验，三题型重新真实验证通过。',
 '3. 复盘绕过治理核实：补齐复盘批准、经验转换及知识引用的质量阻断检查。',
 '4. 长调用：复盘、出题接入既有队列，短请求提交，按项目授权查询进度，完成后从工作台打开结果；配置变更和失败不伪造成功。',
 '5. 本地工作进程：旧心跳可能导致启动器遗漏启动；现在先确认本仓库进程，任务恢复运行，真实融合复盘成功。',
 '6. 页面与资料标识：补齐项目名称、场景表单统一样式、复核退回步骤、真实/模拟资料标记，以及指定学习范围的人员列表隐私。',
 '', '## 来源与复跑','',
 '- 来源快照SHA-256：`'+report['source_sha256']+'`。',
 '- 分类SHA-256：`'+report['taxonomy_sha256']+'`。',
 '- 模型评测代码快照指纹：`'+report['code_sha256']+'`；来源及输入哈希还保存在JSON报告内。',
 '- 真实模型明细：[本地report.json](b-risk-knowledge/.local/real-model-acceptance/report.json)；每组输出、引用及用量位于同目录。',
 '- 发布及培训链：[本地chain.json](b-risk-knowledge/.local/real-model-acceptance/chain.json)。',
 '- 融合入口验收：[本地b-real-acceptance.json](.local/fusion-integration/b-real-acceptance.json)。',
 '- 工程回归：`b-risk-knowledge/tools/check.py`；v1：`tools/check_v1.py`；真实样本：`tools/accept_real_models.py`。',
 '- 真实产品链：`tools/accept_real_chain.py`，必须显式指向 `risk_b_test`；本地融合链：`platform-module/tools/accept_fused_b.py`。',
 '- 报告生成：`b-risk-knowledge/tools/report_real_acceptance.py`，只读验收结果，不调用模型。',
 '', '## 待业务确认','',
 '1. 指定审核人，核实41条来源和30张候选的事实、分类及适用性；当前没有人工金标，不填写虚构准确率。',
 '2. 确认首版标准：事实与原文一致、引用可追溯、建议与已发生事实分开、未核验规范不作为有效依据、分类适用。',
 '3. 正式使用前确认项目身份映射及现场附件。当前只验收指定真实文本，附件链使用明确测试资产验证；不声称已核实真实现场照片。',
 '', '以上是最终业务验收边界。治理候选、复盘和评分保持待审核；未操作服务器、未推送GitHub。',
 '', '## 候选清单（未审核）','', '|来源组|候选名称|','|---|---|']
for path in sorted(DATA.glob('extraction-*.json')):
    value=json.loads(path.read_text(encoding='utf-8'))
    if value.get('status')!='passed':continue
    for card in value['result']['output']['cards']:
        lines.append('|'+path.stem.removeprefix('extraction-')+'|'+card['title'].replace('|','／')+'|')
(ROOT/'B模块真实验收报告.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
print('B模块真实验收报告.md written; business acceptance remains pending')
