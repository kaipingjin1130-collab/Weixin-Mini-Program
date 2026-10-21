# B04｜知识发布、索引与检索

日期：2026-10-21。已实现本地发布与检索流程，沿用模拟资料。当前向量是确定性的特征哈希，回答是审核事实摘录；没有接入真实语义模型、生成大模型或真实A身份。不能据此宣称具备真实工程智能问答效果。

## 试用步骤

1. Docker Desktop开启后，双击项目根目录“启动B模块.cmd”。已有历史数据治理和知识审核功能保持可用。
2. 管理员打开 <http://127.0.0.1:5181/releases>，选择已审核卡片，点击“构建发布”，等待“待启用”，再点击“启用发布”。每个批次是一个项目的**完整集合**，不是叠加补丁；替换时需选择仍要保留的卡片。
3. <http://127.0.0.1:5181/knowledge/library>显示已启用知识；可以切换新成员，只看到其授权项目。详情支持事实、来源、建议与依据状态、曾启用过的发布版本。
4. <http://127.0.0.1:5181/search>输入“疏散通道堆放了物品”。结果展示摘录事实和引用，点击“打开来源”查看结构化来源行。未提供原报告时不会显示虚构的附件预览。
5. 可在回答方式中选择“验证超时回退（模拟）”，只显示检索结果和证据，不返回答案块。索引失败场景由API的`mock_scenario=index_failure`及自动测试覆盖。
6. 审核权限可在知识详情填写原因撤回。来源撤回由既有文件可用性控制消费，B04未新增来源撤回管理页；测试验证修改来源可用状态后下一请求立即阻断。

本机已通过网页启用原有的一张v2模拟疏散通道案例，无需重建即可试用。未批量批准其他草稿。

## 模块与数据设计

| 文件/目录 | 职责 |
|---|---|
| `backend/modules/retrieval/publication.py` | 发布快照、启用事务、项目比较交换、撤回和统一可用性过滤 |
| `tasks.py` | 复用Procrastinate构建索引，逐项记账和恢复，失败不自动切换 |
| `adapters.py` | jieba中文分词、编号规范化、64/96维模拟向量适配器、事实摘录 |
| `search.py` | 同一个检索与引用服务，内部页面和A接口共同调用 |
| `api.py` / `schemas.py` | 内部接口、B00合同校验、反馈及发布证据入口 |
| `frontend/src/Retrieval.tsx` | 发布管理、知识库、知识详情、检索与证据展示 |
| `migrations/versions/0004_b04_retrieval.py` | 冻结DDL，不从实时模型生成迁移；增加6张表和知识撤回字段 |
| `tests/test_retrieval.py` / `tests/fixtures/b04-evaluation.json` | 数据库、队列、合同、状态与固定模拟评测 |

六张表为`knowledge_releases`、`release_entries`、`search_chunks`、`embedding_sets`、`chunk_embeddings`、`search_runs`。发布条目只保存固定修订ID，不复制成另一份可编辑正文。B03仍保存approved状态，是否published由启用发布集合派生，避免修改旧审核版本。

每个项目只有一个active发布，数据库部分唯一索引兜底。启用请求必须同时携带本批次`row_version`与`expected_active_id`（首次为null）。按项目事务锁串行启用；另一个人已切换时返回409。构建完成不等于已启用；失败项、未完成集合不能启用。可手动重新启用仍满足来源与审核条件的历史批次。

知识撤回保留时间、原因、审计和旧索引，不自动恢复。编辑已审核内容生成新修订；未重新审核发布前，普通用户仍只见原发布版本。历史查看只允许曾启用发布的版本，不包含草稿；历史证据也实时检查权限、来源和撤回状态。

## 索引配置与扩展

- 复用[pgvector](https://github.com/pgvector/pgvector)与[Python集成](https://github.com/pgvector/pgvector-python)，没有新增独立向量数据库。中文关键词使用[jieba](https://github.com/fxsjy/jieba)，不依赖PostgreSQL默认英文分词。
- 每批次固定`model/model_version/dimension/chunk_strategy/tokenizer/is_mock`，保存于`knowledge_releases.index_config`；每批生成独立embedding_set。当前配置为`mock-hash-64`或`mock-hash-96`、`hash-demo-v1`、`fact-v1`、`jieba-0.42.1+standard-regex-v1`。
- `chunk_embeddings`按集合ID分区，每个物理分区有`vector_dims`维度约束和对应维度的HNSW表达式索引。查询只访问当前集合；不同模型、维度的向量不会混算。新批次记录实际构建毫秒数。
- 每条已审核事实为一个chunk，持久化引用路径与证据ID；不把模拟建议、未采用或待核验标准当作已验证事实索引。
- 关键词和向量两路合并排序，编号问题要求原文中的规范化编号匹配。编号命中只表示文本匹配，不意味着该标准有效或已独立核验。
- 查询先按项目权限、启用发布、来源可用性、知识撤回、场景、对象、阶段和条件限制两条检索路径。`scope.stages`和`scope.conditions`为已有JSON扩展位：限定条件必须由查询满足；没有限制的通用卡片不需要额外条件。B08再提供场景配置管理，不在本轮另造配置平台。
- 当前不启用服务端结果缓存，响应`no-store`；没有旧结果缓存绕过授权的路径。页面已显示的历史文字不会远程自动擦除，新的查询、详情、证据请求都会重新校验。
- search_runs只保存查询SHA256、参数类别、修订ID、耗时、模型标识及用户主动反馈，不落库查询正文和条件正文。不提供可绕过当前授权的旧答案下载接口。

真实模型后续应新增受控适配器与注册配置，固定模型版本和维度后新建集合，不原地改旧向量；重跑同一评测再决定是否启用重排。当前哈希向量只能用于流程和结构验证，无法证明中文语义理解。默认答案直接摘录审核事实，未声称已实现生成式RAG。

## 接口

| 方法与路径 | 关键规则 |
|---|---|
| POST `/api/v1/releases` | 审核权限；同项目明确修订列表；Idempotency-Key；202/重复200/异体409 |
| GET `/api/v1/releases`、`/{id}`、`/options` | 审核权限；游标分页、条目状态、构建耗时、当前启用ID和已审核候选 |
| POST `/api/v1/releases/{id}/activate` | row_version和expected_active_id必传，原子切换 |
| POST `/api/v1/knowledge/{id}/withdraw` | 审核权限、row_version、reason；在线访问立即阻断 |
| GET `/api/v1/knowledge/library` | 当前启用、授权、未撤回知识；project_id/scene_code/card_type/after_id |
| GET `/api/v1/published/knowledge/{id}` | 默认当前发布；显式revision_id可查曾发布历史，不能查未发布草稿 |
| GET `/api/v1/published/evidence/{id}` | revision_id绑定真实引用；显式historical可打开曾发布历史证据；最小来源行内容 |
| GET `/api/v1/published/evidence/{id}/content` | 仅可预览本修订已关联、来源仍可用的图片；校验文件哈希；不开放整份CSV下载 |
| POST `/api/v1/search` | 统一检索；project_id/question/scene_code/object_type/stage/conditions/card_type/limit |
| POST `/api/v1/search/{id}/feedback` | 仅当前查询者可反馈；useful/irrelevant/incorrect及可选说明 |
| POST `/integration/v1/knowledge/query` | 复用B00 Schema和语义验证及同一个search服务；仍为proposed合同与mock身份 |

内部B03的`GET /api/v1/knowledge/{id}`继续是加工区，不能让学员通过该入口读草稿。用户页面`/knowledge/{id}`调用上述published接口。内部与集成API的路由前缀不同，Vite本地反向代理只配置了内部`/api`；A联调应访问后端8181端口。

## 与A的本轮交付

请求与响应使用B00机器合同，并执行相同的注册场景检查、引用关系与状态语义检查。外部`general_inspection`映射为B03已有的内部`generic`场景；外部直接提交`generic`会422，未改动B00字典。`context.object_type/stage/conditions`参与过滤，正文不能授予项目权限。`output_types`控制answer/checkpoints/cases。

状态为answered、insufficient_evidence、degraded；不存在引用不允许返回。引用通过B受控证据入口解析，没有本机路径或公开下载地址。A需确认身份/代用户上下文、项目与场景ID、附件连接和超时。当前不能接真实服务身份，也未实现B05任务包接收。

## 数据库与启动

本项目专用容器已从postgres:15升级至`pgvector/pgvector:0.8.7-pg15-trixie`，仍使用`risk-b01-pgdata`和本机55439端口。原镜像为Debian Trixie，因此匹配同基础系统，避免排序库差异。迁移脚本`tools/ensure-vector.ps1`校验容器标签、数据卷、原始数量，保留一个容器配置回退位置直到验证成功，不删除数据卷、不影响其他容器。

Python依赖固定在requirements.txt，已移除本机wheel绝对路径。`jieba==0.42.1`当前依赖已弃用pkg_resources，因此固定`setuptools==80.9.0`，保留兼容性警告；后续替换分词器需提升配置版本并重建索引。Windows下载受限时可用项目内`tools/fetch_b04_dependencies.ps1`从PyPI下载并核对SHA256后安装；它只处理本项目环境。

## 给下一位AI的指令

```text
先读取B模块开发总索引、下一任务包及本文件，核对实际代码和本机状态。
复用B01身份/队列/审计/存储、B02来源版本和B03审核，不重写已完成平台。
普通查询必须调用retrieval.search.search与publication的可用性过滤；禁止另建A专用检索分支。
保留已发布快照与实际使用修订ID，任何旧引用都须检查当前权限、撤回和来源状态。
真实模型接入新增适配器、固定配置和独立向量集合；不能把哈希模拟标为语义模型。
模拟与真实效果分别报告，不导入或上传原始业务报告，不自动批准知识。
下一任务B05只在用户要求执行后启动；按B00合同接收任务包，不写A业务数据库。
修改后运行受影响测试、前端构建及关键网页操作，再更新原任务包和总索引。
```
