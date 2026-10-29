# A 方联调实施记录（2026-10-29）

基线：ABversion `a798237250c219af7061c26fc247d580f5e5ca19`。
工作分支：`codex/a-integration-v1`。仅修改 platform-module 下的 A 代码、文档和测试。
本轮依据用户提供的《AB联调开发约定v1》，reference 保留原件，不修改其中 Schema 或约定。
本地 Git 远端抓取 beta-version/new-agent 超时，尚未完成这两个分支最新版本核对。

## 启用及兼容边界

新接口必须显式设置 `AB_INTEGRATION_VERSION=1.0` 才启用；未启用时保留已部署的旧整合行为。
不能在旧 B 上直接开启：v1 关闭旧 identity/subject、archives、archive、attachment 私有入口，改用下述固定接口及显式权限。
B 必须已支持约定的点分权限码、独立后台服务取件、a-imports 与 a-knowledge/query。
目前未部署，也未声称真实 B 联调通过。

配置：

- `AB_AUTHORIZATION_FILE`：指向服务器私有 JSON，格式参考 authorization.example.json。
- `org_id`、`is_demo` 必填；服务登记组织必须一致，项目和 allowed_actions 显式配置。
- grants 按稳定用户 ID / 项目 ID / 权限码存储。真实授权取显式 grants 与 A 当前项目成员关系交集；管理员也不会自动获得 B 权限。
- `B_TO_A_KEY`、`A_TO_B_KEY` 使用现有私有环境配置，密钥不放入授权 JSON 或仓库。
- `QAXC_B_URL` 指向 B 内部服务；`QAXC_ROOT_PATH=/quality`。
- 本机 HTTP 测试可显式设 `QAXC_LOOPBACK_HTTP_DEV=1`；仅客户端和 Host 都为回环地址时省略 Secure Cookie，外部地址仍保留 Secure。
- 配置文件应限制操作系统访问权限，原子替换；每次请求重新读取，撤权下一请求生效。

## A 已实现的接口

部署前缀均只加一次 `/quality`。

| 路径 | 行为 |
|---|---|
| POST /integration/v1/identity/resolve | B_TO_A_KEY + X-AB-Session；可选 project_id；真实账号回调最长3秒；实时返回项目权限 |
| GET /api/work/delivery-meta/{id} | 独立 B 服务授权；返回资格、版本、撤回信息及 is_demo |
| GET /api/work/snapshot/{id} | B 服务读取冻结快照；原用户读取方式兼容 |
| GET /api/work/evidence-meta/{id}?deliveryId=... | 服务读取必须提供成果引用，检查冻结清单归属与哈希 |
| GET /api/work/evidence/{id}?deliveryId=... | 服务读取返回文件流，校验大小和哈希；最多10MiB |
| GET /api/work/integration-context | A 页面读取当前显式项目权限 |
| GET /api/work/integration-delivery/{id} | A 页面读取经授权的成果资格与可用动作 |
| POST /api/work/knowledge | v1 下读取服务端任务上下文，再调用 B a-knowledge/query；保留 version/items 并保留引用 |

服务动作枚举：metadata.read、snapshot.read、evidence.read。后台取件不依赖发起人的浏览器会话。
快照最多5MiB、100附件、500事件；超限拒绝，不截断。错误格式使用 code/message/details/request_id。
历史归档资格依据冻结 task.status，而非当前任务状态或最新版本。交接中间成果 eligible=false；产生新版本不会自动撤回旧归档。

## 来源撤回

新增独立 ab_source_withdrawals 表，不改冻结快照。受控本地工具：

```text
python candidate/ab_admin.py DELIVERY_ID --actor HOST_USER_ID --reason "撤回原因"
```

工具使用与 A 相同的数据目录、环境和授权配置；必须有原平台身份服务。
它重新核验操作者身份、项目成员关系及 imports.withdraw 权限，记录时间、原因、操作者。
重复撤回保留第一次审计记录。来源元信息仍可读；B 服务正文及附件返回410。
B 的接入撤回另由 B 的 /a-imports/{id}/withdraw 处理，不调用该工具、不修改 A 来源。

## 网页实现与待验证项

A 报告目录保留原逻辑，增加类型筛选；正式成果、归档页及任务成果区域共用 ab-client.js。
组件从 B 查询状态、刷新恢复关联，提供接入、重试、撤回和生成/查看复盘；按当前显式权限展示按钮，服务端仍须鉴权。
一次未确认操作的幂等键与正文存于当前浏览器 sessionStorage，超时后复用；不在 A 建队列。
接入状态与复盘状态分别显示，资料警告单独显示。知识查询失败不改任务状态、不回退演示条文。
代理网络等待和知识调用均在 SQLite 事务及会话锁之外。

浏览器端新控件尚未完成实际页面验收；B 已接入任务数的全局去重统计尚未新增。
知识查询 HTTP 测试使用 B 替身，尚未证明真实 B 的检索结果或页面路由兼容。

## 样例与验证

samples 是仓库已有脱敏协同测试快照及 ZIP 的原样副本，manifest 标注来源和 SHA-256；不是生产导出。
保留原 ID，不把旧样例伪装为本轮 demo-project-001 的新生成成果。
reference/接口约定v1 提供12个 Schema 和24个正反样例；该字段校验已通过。

本轮验证：

- test_ab_v1.py：10项，显式权限、跨项目、历史版本、撤回、附件归属/哈希、会话失效和兼容性。
- test_ab_gateway.py：10项原网关回归。
- test_integration.py：8项原认证与平台接口回归。
- test_ab_v1_http.py：3项真实 A HTTP + 模拟 B HTTP，验证退出后后台服务仍可取件、B回调身份、A等待时数据库可写、CSRF及回环Cookie例外。
- report-catalog.test.cjs：5项报告目录回归；offline.test.cjs：10项离线队列回归。
- app.js、work.js、ab-client.js 通过 Node 语法检查。

上述不等同 A06。首次 pytest 默认临时目录不可写，改为 D:/integration 下独立测试目录后通过；HTTP测试因沙箱阻止回环连接，使用批准的本机测试执行后通过。

## 进入真实联调前

1. 核对 beta-version/new-agent 的最新提交和 B 已实现的 v1 接口；只由 B 方修复 B 内部实现。
2. 确认真实组织、用户权限及 B 服务项目范围，不把测试授权配置用于生产。
3. 补齐专用完整测试资料组合（无隐患、两个实际归档版本、日期级时间、代录人员、缺照片等）。
4. 浏览器验证状态恢复、同键重试、无权限按钮、引用与跨模块返回，补全统计。
5. 连接真实服务完成知识、照片取件、接入、复盘、撤权/撤回完整链，再决定切换线上。

腾讯云终端可见但控制连接反复中断；本轮未在云端执行部署或修改数据。
