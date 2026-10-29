# A/B 联调开发约定 v1

日期：2026-10-28。状态：本轮确定的开发基线；接口实现及联调尚未完成。接口版本 `ab-integration/1.0`。本文件确定此前任务文档中尚未固定的路径、字段、鉴权和状态语义。

## 1. 架构与写入边界

一个平台入口，两个内部服务和数据库。A 负责登录、组织、项目及权限来源、巡查到归档的事实、网页外层及代理；B 负责知识、任务包接入、复盘与培训。A 不改 B 文件，B 不改 A 文件。先沿用现有两个工作目录开发，归并仓库不作为联调前置条件。

本机默认 A `127.0.0.1:8765`，B 前端 `127.0.0.1:5181`、B API `127.0.0.1:8181`；冲突则配置覆盖，不终止无关进程。统一网页入口 `http://127.0.0.1:8765/quality/`。这是一项待实现配置：当前 A 按前缀添加 Secure Cookie，本机 HTTP 联调时 A 必须显式支持仅回环开发模式的非 Secure Cookie；外部 HTTPS 保持 Secure，不能全局关闭。

| 浏览器入口 | A 转发目标 | 约定 |
|---|---|---|
| `/quality/`、`/quality/work` | A 自身 | 保留原业务 |
| `/quality/b/` 与静态资源 | B 前端 | B 构建 base 为 `/quality/b/` |
| `/quality/b/api/v1/...` | B `/api/v1/...` | 去掉 `/quality/b` 前缀 |
| `/quality/b/integration/v1/...` | B `/integration/v1/...` | 去掉 `/quality/b` 前缀 |

B 首轮采用 hash 页面路由：`/quality/b/#/knowledge`、`#/imports/{id}`、`#/retrospectives/{id}`、`#/training`。B 自行映射已有页面，A 仅提供菜单。返回 A 路径固定 `/quality/`，不接受任意外域 return URL。前端开发代理如需 HMR 由 A 处理升级连接；正式验证可使用 B 静态构建，不将 HMR 作为业务前置条件。

## 2. 身份与服务认证

确定使用回调校验，不另建 JWT 或跨站登录。

1. 浏览器只向 A 提交现有 HttpOnly `qaxc_session` Cookie。
2. A 验证会话，清理浏览器传入的 Authorization、Cookie 和所有 `X-AB-*` 后，向 B 注入 `Authorization: Bearer <A_TO_B_KEY>`、`X-AB-Session: <不透明A会话引用>`、`X-Request-ID`。不转发浏览器 Cookie 到 B。
3. B 验证 A_TO_B_KEY，再使用 `Authorization: Bearer <B_TO_A_KEY>` 及同一 `X-AB-Session` 调用 A 身份接口。两个方向使用不同密钥，不存入代码、URL、浏览器或日志。
4. A 返回当前权限；B 每个受保护请求调用解析，v1 不跨请求缓存有效授权。身份服务失败返回 503，不能转为 mock 或超级管理员。
5. B 后台取件使用 B_TO_A_KEY，无需保留发起人的会话。A 根据登记的组织、项目、操作范围独立检查服务权限。用户查看、重试、撤回等仍按当前用户授权。
6. A 代理写请求要求同源 Origin 和会话绑定 CSRF Token（`X-CSRF-Token`）；A 新增 `/api/csrf-token` 供页面同源获取，B 页面从 A 获取并携带。服务对服务接口用服务认证，不沿用浏览器 CSRF 检查。
7. A 转发或等待 B 时不得持有 SQLite 写事务、会话锁或数据库连接事务；B 必须能回调 A。A 原服务器支持并发处理，新增分支需保持可重入。写业务与远程等待分离。

未登录 401；身份有效但无项目或动作权限 403。A 失效/撤权后下一次请求拒绝。B 前端收到 401 展示登录失效并返回 A，不出现 B 独立登录界面。

服务授权登记是本机私有配置中的显式 org_id、project_ids、allowed_actions；不能根据正文创建授权。组织 ID 由 A 配置，未配置时拒绝真实集成启动，不猜测组织值。测试统一用 `demo-org`、`demo-project-001`、`demo-user-001`，必须标记测试。

## 3. 权限码

A 统一存储和分配项目级权限，B 定义检查点。已有角色只作为初始参考，不自动将 A 管理员赋予所有 B 权限。A 提供现有管理入口的配置扩展或受控初始化工具；不得仅隐藏按钮。

| 业务 | 固定权限码 |
|---|---|
| 知识 | `knowledge.read`、`knowledge.process`、`knowledge.review`、`knowledge.publish` |
| 成果接入 | `imports.read`、`imports.create`、`imports.retry`、`imports.withdraw` |
| 复盘 | `retrospective.read`、`retrospective.generate`、`retrospective.edit`、`retrospective.review` |
| 培训 | `training.learn`、`training.manage`、`training.review` |

B 的现有动作逐项映射到上述权限，不由显示姓名判断；缺少权限默认拒绝。

## 4. A 提供的接口

下表为去掉部署前缀后的路径。B 的 `A_INTERNAL_BASE` 默认 `http://127.0.0.1:8765/quality`，路径只拼接一次。

| 方法与路径 | 状态 | 请求／返回 |
|---|---|---|
| POST `/integration/v1/identity/resolve` | 新增 | 正文 `{project_id}`，可为 null 表示所有当前授权项目；返回 active=true、subject_id、display_name、org_id、projects[{project_id,permissions}]。指定项目无权限返回403 |
| GET `/api/work/snapshot/{deliveryId}` | 已有，补服务认证 | 返回现有冻结快照，保持原外层结构 |
| GET `/api/work/package/{deliveryId}` | 已有 | 保留用户导出，用于离线测试交接 |
| GET `/api/work/delivery-meta/{deliveryId}` | 新增 | 返回下述元信息；必须服务授权通过 |
| GET `/api/work/evidence-meta/{id}?deliveryId=...` | 已有，补校验 | 元数据，服务调用必须给成果引用 |
| GET `/api/work/evidence/{id}?deliveryId=...` | 已有，补校验 | 文件流；验证该文件在冻结成果 evidence 清单中 |

元信息必填字段：`source_system`（固定 a）、`org_id`、`project_id`、`task_id`、`delivery_id`、`delivery_version`（正整数）、`eligible`（布尔）、`ineligible_reason`（字符串或 null）、`withdrawn`（布尔）、`withdrawn_at`（ISO时间或 null）、`withdraw_reason`（字符串或 null）、`is_demo`（布尔）。

v1 接入资格：该固定版本确为归档时生成的正式成果、未撤回、服务与当前操作人范围正确。后来产生更高版本不自动使历史归档成果失效，以支持历史读取和版本乱序测试；页面默认选择最新可用归档版本。简报和交接中间版不符合资格。A 结合保存快照及归档事实判断，不能只看任务当前 status 或目录的 submitted。

`eligible=false` 返回200及原因，B 创建任务时拒绝。撤回元信息仍可读并返回 withdrawn=true；被撤回正文及文件返回410。来源撤回由 A 自身管理动作维护，元信息和取件检查同一状态；A 内部撤回操作路径由 A 决定，不作为 B 依赖接口。

附件元数据至少 id、name、mime、size（非负整数）、sha256（64位小写十六进制）。文件读取结果须与冻结清单一致；不把本机路径提供给 B。B 服务读取若缺 deliveryId 返回422；普通用户原有调用保持兼容。

## 5. B 提供的接入与复盘接口

A_TO_B_KEY + 用户会话引用保护以下全部接口。B 后台任务使用服务身份取 A 资料，不把用户会话写进队列。

| 方法与路径 | 请求 | 成功响应／权限 |
|---|---|---|
| POST `/integration/v1/a-imports` | source_system=a、project_id、task_id、delivery_id、delivery_version | 首次202，命中200；imports.create |
| GET `/integration/v1/a-imports/{id}` | 无正文 | 200接入状态；imports.read |
| GET `/integration/v1/a-imports?project_id=...&delivery_id=...&delivery_version=...` | 三项必填 | 200 `{items:[...]}`，用于刷新恢复；imports.read |
| POST `/integration/v1/a-imports/{id}/retry` | `{expected_version}` | 202或幂等回放200；imports.retry |
| POST `/integration/v1/a-imports/{id}/withdraw` | `{expected_version,reason}` | 200；imports.withdraw |
| POST `/integration/v1/a-imports/{id}/retrospectives` | `{expected_version}` | 首次202、复用200；retrospective.generate |
| GET `/integration/v1/a-imports/{id}/retrospective` | 无正文 | 200；retrospective.read |

所有上述 POST 要求 `Idempotency-Key`。接入响应统一：`import_id`、`version`（操作并发版本）、`project_id`、`task_id`、`delivery_id`、`delivery_version`、`status`、`receipt_id`（可null）、`warnings`（数组）、`missing_fields`（数组）、`capabilities`（对象）、`retrospective_id`（可null）、`retrospective_status`、`updated_at`、`replayed`、`error`（对象或null）。

接入状态固定 `queued → fetching → validating → processing → ready`，可转 failed；撤回后 withdrawn 终态。ready 不代表证据齐全，需读取 warnings/capabilities。failed 只能显式重试或按下述策略恢复。复盘状态固定 `not_created/queued/processing/ready/failed/withdrawn`；不将它与接入状态合并。GET复盘无成果时200返回not_created及null ID，不伪造链接。

业务唯一键 `(source_system,delivery_id,delivery_version)`。同幂等键不同正文409；同成果不同引用或事实内容409；相同成果不同幂等键仍返回已有接入。幂等键按调用身份＋动作作用域保存，需持久化；权限校验必须发生在回放之前，不能回放越权结果。

A 页面保留一次用户操作的幂等键直至结果明确，超时用同键和正文重试；刷新后可用查询接口恢复关联。B 独占队列、重试和当前可用版本管理，A 不建重复任务队列。

B 接入撤回仅撤回 B 的接入及派生使用，不修改 A 原始成果；A 来源撤回则使 B 来源失效。v1 在处理开始、取件、发布就绪前及用户读取复盘/相关证据时检查 A 元信息；A 不可用时相关来源结果返回503，不展示为有效。来源失效后保留审计但阻断正文、引用、培训派生使用。后续可优化通知机制，本轮不要求跨系统事务。

## 6. 知识交互

保留 A `/api/work/knowledge` 及小程序现有入口。A 取服务端任务事实后调用 B 新增外层 `POST /integration/v1/a-knowledge/query`，权限 knowledge.read。请求：request_id、project_id、task_id、question、scenario_id、scenario_version、object（原始文本）、stage（preparation/execution/review/training）、conditions（对象）。A 不进行 B 内部结构映射。

B 将 inspection 映射 general_inspection；handover 暂不硬映射为施工类场景，返回 insufficient_evidence 及 SCENE_UNSUPPORTED 警告。新增场景由 B 后续注册，不凭 AI 猜测业务含义。普通巡查缺少对象分类时 B 内部用 unknown 标识并保留原始对象文本，需通过实际检索合同检查；无匹配返回不足。

B 返回 `query_id`、`status`（answered/insufficient_evidence/degraded）、`knowledge_release_id`（可null）、`items`（数组，条目含title/text/reference/citation_ids）、`citations`（数组）、`missing_conditions`（数组）、`warnings`（数组）、`requiresConfirmation=true`。B 复用现有检索与知识合同，负责转换；A 适配旧客户端所需 version/items 字段并增量保留引用。无结果 items=[]；服务完全不可用503，不返回演示条文冒充正式答案。

## 7. 通用约定与边界

- 新集成接口错误格式固定 `{code,message,details,request_id}`；details为数组。旧 A 用户接口保持 `{error}` 兼容，新增服务分支使用标准错误，B 客户端对旧格式兼容记录但不误判成功。
- 401无效身份，403越权，404不存在，409幂等/版本冲突，410撤回正文，422字段/资格不符，413超限，429限流，503依赖不可用。request_id来自X-Request-ID，没有则服务端生成。
- JSON UTF-8；业务时间ISO8601带时区；未知null。ID是稳定字符串，不用显示姓名关联。生产组织不默认填demo-org。来源字段is_demo来自可信元信息，不能靠修改标识绕过授权。
- 身份请求总超时3秒；知识查询B内部10秒、A等待15秒；接入创建尽量5秒内返回，不在请求中取完整附件。附件单次总超时60秒，最多10MiB/件；JSON快照最多5MiB、最多100附件、最多500事件，超过明确拒绝不截断。业务量需要扩大时双方版本化调整。
- 后台连接/503/429可按2、10、30秒退避，最多3次自动重试；其他4xx及哈希不匹配不自动重试。429有Retry-After时遵从并限制任务总等待。人工重试复用接入任务，不新增业务包。
- 原始快照不修改。旧报告零点拼接时间根据sourceReportId/sourceReport/source标记日期精度，不能用于精确耗时计算。手填业务办理人与实际代录账号分别保留。
- ZIP是离线测试/导入路径，必须防目录穿越、限制展开大小与文件数、校验哈希；离线通过不等于真实身份/撤回通过。

## 8. 交接、所有权与验收

本文件是本轮统一基线，只读交给两人。A 后续只维护 A 提供接口的Schema/样例，B 只维护 B 提供接口的Schema/样例，引用本版本；一方发现差异提交变更说明，不能自行改消费副本。非兼容变更升主版本。现有B内部contracts仍为内部资料，不能未经同步假称已完成真实A验收。

测试数据固定 demo-org/demo-project-001/demo-user-001。正常测试至少包括：归档有问题成果、无隐患成果、同任务两个版本、旧报告日期级时间、手填人员、缺照片、坏哈希、未归档、来源撤回、无权限用户。允许从真实A接口生成测试数据，不能包含生产账号或报告。

验收层次：①合同与样例自检；②各自HTTP替身测试；③两个真实服务联调；④从A网页操作验收。分别记录证据，不互相替代。密钥、实际组织和服务端口通过私有配置，不写入交接包。

最终标准：A登录→B知识查询有来源→选归档成果→B取得固定事实和照片→重复提交无重复→A显示准确状态→生成并查看对应版本复盘→撤权/撤回后拒绝。两人各自分支只合入本模块变更。
