# B 新 v1 协议对接交付与验收

日期：2026-10-29。开发基线：`d691151`；交付前已快进合入 A 的最新 `bf44d18`（统一工作台与报告中心），分支：`codex/ab-fusion-integration`。本交付落实 `platform-module/integration-v1/B-HANDOFF.md`；合同 reference 保持原样，未修改 A 代码或覆盖 A 的联调成果。

## 阶段与结果

| 阶段 | 实现 | 验收结果 |
| --- | --- | --- |
| 1 接入外层协议 | 全部七个 a-imports 接口；独立接入/复盘状态；持久化幂等键、成果唯一键、操作版本 | 首次 202、复用 200、同键异体 409、不同键同成果不重复、并发重放、必填查询参数与 Schema 校验通过 |
| 2 服务取件 | 登记组织/项目/动作，metadata、snapshot、evidence-meta、evidence 文件流；大小和 SHA256 校验 | 真实 A HTTP 服务与独立 B worker 通过；关闭 A 会话后后台成功，旧会话查看返回 401；损坏照片保留缺失提示 |
| 3 业务权限 | knowledge/imports/retrospective/training 分动作授权，页面按显式权限显示操作 | knowledge.read 可查询真实已发布知识，不能读加工草稿、发起复盘或管理权限；retrospective.read 可读复盘但不能修改；training.learn 可学习但不能管理学习包 |
| 4 版本、恢复、撤回 | 指定成果版本取件；失败重用原 import/run；复盘失败单独重试；撤回停止排队状态 | v2 接入后 v1 仍可读和生成复盘；A 撤回返回 410；B 撤回不修改 A；知识、引用与培训均实时阻断撤回来源，新的版本差异页不泄露已撤回旧版本正文 |
| 5 网页入口 | `/imports/ai_...` 显示 A 接入详情，旧 `/imports/{历史批次}` 保留；轮询与刷新恢复；未知结果重用原操作键 | 真实 Chrome 操作 A 页面生成复盘、刷新恢复、打开 B 详情和复盘成功；接入/复盘状态分别显示，未知时间不补造 |
| 6 回归与交接 | 隔离测试运行器、配置模板、实际 HTTP 合同证据 | 原有 99 项回归通过；新 v1 五组端到端场景通过；合入 A 最新导航后，A v1/代理 23 项和导航/登录 17 项通过；TypeScript、独立网页和嵌入构建通过 |

## 验收边界

本次使用仓库内**真实 A Handler、真实 B HTTP 服务、PostgreSQL 与独立后台进程**。账号、项目、成果与照片是隔离测试数据，不是生产业务数据，也没有用模拟 B 服务替代实现。`knowledge` 检索的是经过复盘审核、知识审核、索引构建和发布的真实测试知识。

测试通过不等于生产 A06 验收完成。遵守原交接要求，线上保持既有运行模式，未启用生产 `AB_INTEGRATION_VERSION=1.0`，未更换生产数据、配置或服务。内置复盘/出题模板仍明确标为模板；未将其包装成大模型质量验收。

历史观察（已由后续 A 验收提交修复，见 [A 侧验收记录](../../platform-module/integration-v1/A-ACCEPTANCE.md)）：A 宿主原有外层面包屑把 `/imports/*` 归到“历史资料”，B 内部已准确显示“A 成果接入”，且不会加载历史批次内容。该宿主导航文案归属 A，本提交不改 A 目录；不影响深链接、接入状态或旧历史资料功能。

## 接口与状态

B 内部前缀 `/integration/v1`；浏览器统一代理前缀 `/quality/b/integration/v1`。保留原七个接口的合同路径和权限。新 import ID 使用 `ai_` 加 32 位十六进制字符，区别于历史资料 UUID；客户端应把它当不透明标识。

- `version` 是操作并发版本；`delivery_version` 是 A 归档成果版本。
- 接入状态与复盘状态独立。`retry` 可重试导入失败，或在接入已 ready 时重试失败复盘，并保留原处理任务 ID。
- 每次用户请求先实时解析身份、校验权限，再查幂等结果。查看、重试和生成会检查指定来源版本。已撤回 B 接入仍可读取撤回状态，不开放材料或复盘正文。
- 创建与复盘生成分别使用持久化业务去重；操作幂等记录保存于 `a_import_requests`，不依赖浏览器内存。
- 后台取件只用 B_TO_A_KEY。队列保存 import/run 引用，不保存 X-AB-Session。worker 按具体任务类型和单个项目取得服务范围，不全局扩展为 read/run/admin。
- v1 启用后旧平台归档提交和直接任务包写入提示使用 a-imports，避免绕过外层状态。历史资料导入、知识、复盘、培训页面保留。

## 配置与接入部署

继续使用已有私有配置保存方向密钥；不要把真实密钥或账号密码写入这些模板。

| 变量 | 用途 |
| --- | --- |
| `AB_INTEGRATION_VERSION=1.0` | A、B API 和 B worker 同时显式启用新协议；本次未在生产启用 |
| `B_AUTH_MODE=a`、`A_ORG_ID` | B 使用 A 的真实身份解析与指定组织 |
| `A_INTERNAL_BASE` | A 服务基址，包含 `/quality`；仅服务端使用 |
| `A_TO_B_KEY`、`B_TO_A_KEY` | 两个不同方向的既有私有密钥 |
| `B_A_SOURCE_REGISTRATION` | 指向 B 私有来源登记 JSON，格式见同目录 source-registration 模板 |
| `B_WORKER_AUTHORIZATION` | 指向其他 B 后台业务的组织/项目/动作登记；知识加工、发布、评分使用，缺失时拒绝这些后台操作 |
| `AB_AUTHORIZATION_FILE` | A 的用户权限及服务范围私有配置，由 A 按其既有模板维护 |
| `B_DATABASE_URL`、`B_STORAGE` | 沿用 B 数据库和文件目录，不重建业务库 |
| `QAXC_B_URL`、`QAXC_B_STATIC` | A 现有同源 B 代理地址和构建静态文件目录 |

B 来源配置沿用已有客户端的内部动作名 `delivery.meta`、`delivery.snapshot`、`delivery.attachment`；A 端相应登记为 `metadata.read`、`snapshot.read`、`evidence.read`。两侧均须列出实际项目，不从用户请求正文推导授权。

数据库增量迁移 `0008_a_integration_v1` **仅新增** `a_imports`、`a_import_requests` 及索引/约束，不搬迁或清空历史表。在 B 项目环境执行 `python -m alembic upgrade head`。API 与 worker 必须使用同一代码版本和相同私有配置。

前端在 `b-risk-knowledge/frontend` 执行：

```text
npm run build
npm exec -- vite build --config vite.embed.config.ts
```

`dist-embed/knowledge.js` 和 `knowledge.css` 应放入 A 已配置静态目录的 `embedded/` 子目录；不能只部署独立 `dist` 而漏掉嵌入产物。仓库既有 `platform-module/build_frontend.py` 可完成整体装配；B 专属提交不提交 A 静态目录生成物。

完整生产切换需双方在目标环境校验私有授权登记、真实项目及账号，并确认新协议端到端验收。保留旧开关模式可回退；不要执行增量迁移的 downgrade 来删除已有接入记录。

## 可复现验收与实际证据

在配置好项目 Python 依赖及本机专用 PostgreSQL 后，从 B 项目执行：

```text
python tools/check_v1.py
python tools/check.py
```

`check_v1.py` 只连接本机数据库，创建/复用保留名 `risk_b_v1_test`，启动临时真实 A/B HTTP 服务及独立 worker。可用 `B_V1_TEST_DATABASE_URL` 指定本机专用连接；不会清理开发数据库。`check.py` 沿用项目既有流程，重建专用 `risk_b_test`，请勿将它用于业务库。

v1 测试覆盖：幂等/并发、200/202、401/403/409/410/422/503、退出后取件、旧版本、导入失败恢复、复盘失败恢复、附件损坏、知识发布查询、只读权限隔离、培训权限与撤回传播。默认回归集跳过需要独立数据库的 v1 测试模块；它由上述专用运行器单独执行，不能把 skipped 计为已跑。

实际请求、响应与各响应所用 Schema 见 [v1-contract-evidence.json](v1-contract-evidence.json)。它来自 HTTP 响应钩子，不包含认证头、会话或生产数据；每条记录均执行原合同 Draft202012Validator 与格式校验。后续复跑的最新原始结果位于 `.local/v1-contract-evidence.json` 和 `.local/v1-results.xml`。

浏览器本次在 `http://127.0.0.1:60086/quality/` 的隔离测试会话完成。该地址仅是本次临时验收环境，生产访问地址与登录方式不变。已验证：A 当前成果状态刷新恢复、从 A 生成复盘、B 接入详情深链接、B 复盘正文及未知时间提示；没有使用生产管理员账号操作测试数据。合入 `bf44d18` 后再次验证 B 深链接仍嵌入 A 的报告中心，页面无 iframe；A 当前生产导航不在本次部署范围。

## 修改范围

- `backend/integrations/a/`：接入模型、服务范围、外层路由、导入/复盘后台任务；复用现有 client、mapping 和 knowledge 查询，不重复实现协议。
- `backend/auth.py`、`platform_identity.py`、`platform_archives.py`、`platform_upload.py`、`job_service.py`、`queue.py`、`app.py`：权限、任务类型、独立取件与路由装配。
- `backend/modules/`：知识、资料、发布、复盘、任务包、培训的操作级权限与来源实时守卫；旧角色身份继续兼容。
- `frontend/src/`：A 接入详情、精确权限判断和对应业务按钮；保留原页面。
- `migrations/`、`tests/test_a_v1_flow.py`、`tools/check_v1.py`、本目录：增量迁移、复现验收与交接。

交付以本文件所在 B 专属 Git 提交为准；之后如更新根目录融合计划，独立形成文档提交。`git show --name-only <B提交>` 可核对未包含 `platform-module/` 或只读合同变更。
