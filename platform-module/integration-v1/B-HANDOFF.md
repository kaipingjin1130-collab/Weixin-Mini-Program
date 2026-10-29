# 发给 B 开发者：ABversion 联调缺口

核对日期：2026-10-29。用户已明确：本轮只修改 A，B 的缺口交 B 开发者处理。
保留 ABversion 全部网页端代码和原登录。不要用 new-agent 整体覆盖 ABversion。

## 已核对版本及证据范围

GitHub API 本轮读取到：

- ABversion：a798237250c219af7061c26fc247d580f5e5ca19（完整整合平台基线）。
- new-agent：397c58ad0259d428a10965096f07444aa01a79cf。
- beta-version：2cefeb10d64344f05d9e70581a4db8b4cb8c74f2。
- A 本地实施提交：9b20729，分支 codex/a-integration-v1，基于上述 ABversion。

以下结论来自该版本源码核对，不冒充云端 HTTP 验收。腾讯云终端 UI 可见，但输入控制仍不稳定；本轮未取得云端 OpenAPI 响应。

## 阻断联调的 B 缺口

| 优先级 | 现状证据（路径相对 b-risk-knowledge） | B 需完成 |
|---|---|---|
| P0 | backend/modules/task_packages/api.py 注册的是 /integration/v1/task-packages；backend/platform_archives.py 注册 /api/v1/platform-archives；backend/app.py 未注册 a-imports | 实现并注册共同约定的全部 a-imports 外层接口，不把旧路径直接改名冒充完成 |
| P0 | backend/auth.py 的 Actor.can 在显式 permissions 模式逐字匹配；多数路由仍检查 read/run/package_receive/package_read 等旧权限 | 按每个业务操作映射 knowledge.*、imports.*、retrospective.*、training.*；不能全局把一个读取权限扩成旧 run/audit 或管理员 |
| P0 | backend/platform_archives.py 通过 identity/archive、identity/attachment 取件，附件是 base64 JSON | 改为 B_TO_A_KEY 的独立服务取件，GET delivery-meta、snapshot、evidence-meta/evidence；附件带 deliveryId，接收文件流并校验哈希 |
| P0 | backend/platform_identity.py 的 worker_actor 调用 identity/subject；取件又调用 actor_for_user | 后台取件使用登记的服务组织/项目/动作范围，不把浏览器会话存入队列，不依赖未约定的 subject 回调；用户查看/重试/撤回继续校验实时用户权限 |
| P0 | 旧 platform_archives 的错误文案及来源检查按“补正或新版本替代即失效”处理 | 按指定 delivery_id/version 的 metadata 判定；旧归档版本在新版本产生后仍有效，只有明确 withdrawn 才阻断正文和派生使用 |
| P1 | frontend/src/Ingestion.tsx 的 /imports/{id} 当前是历史资料批次详情 | 让 /quality/b/#/imports/{import_id} 能准确显示 A 成果接入，不把新 import_id 当旧历史批次 ID；同时保留现有历史资料功能 |

知识外层 POST /integration/v1/a-knowledge/query **已经存在**：backend/modules/retrieval/api.py 与 backend/integrations/a/knowledge.py。
它使用 knowledge.read，并有来源引用转换、场景不足处理。不要重复开发；需完成真实身份、真实已发布知识的合同联测。

## 必须交付的 B 接口

统一前缀 /integration/v1；A 浏览器代理入口为 /quality/b/integration/v1。
以下均使用 A_TO_B_KEY + X-AB-Session，POST 携带 Idempotency-Key（知识查询除外）。

| 方法 | 路径 | 权限 / 要点 |
|---|---|---|
| POST | /a-imports | imports.create；正文 source_system=a、project_id、task_id、delivery_id、delivery_version；首次202、复用200 |
| GET | /a-imports/{id} | imports.read；返回完整状态 |
| GET | /a-imports?project_id=...&delivery_id=...&delivery_version=... | imports.read；三项必填；返回 items，用于刷新恢复 |
| POST | /a-imports/{id}/retry | imports.retry；expected_version；复用原任务 |
| POST | /a-imports/{id}/withdraw | imports.withdraw；expected_version、reason；仅撤回 B 接入 |
| POST | /a-imports/{id}/retrospectives | retrospective.generate；expected_version；首次202、复用200 |
| GET | /a-imports/{id}/retrospective | retrospective.read；不存在时 not_created 和 null ID |

状态响应字段、capabilities、warnings 等严格使用 reference/接口约定v1/schemas.json，详见 import_response/import_list/retrospective_response。
version 是操作并发版本，delivery_version 是 A 成果版本，不能混用。
接入 queued/fetching/validating/processing/ready/failed/withdrawn 与复盘状态分开。
幂等键和业务唯一键必须持久化；相同成果不同键也不能重复，授权必须先于幂等回放。

## A 已准备的对接能力

参见 README.md。开启 AB_INTEGRATION_VERSION=1.0 后提供固定身份解析、成果元信息、指定版本快照和附件文件流。
A 已提供显式权限配置模板与来源撤回工具；旧用户接口、小程序调用和原登录保留。
该开关在现有线上尚未启用：启用后旧 identity/subject/archive/attachment 将不可用，因此必须等 B 完成上述迁移再切换。

samples 内包含原有脱敏快照与 ZIP，manifest 标识来源及 SHA256。它们是旧测试样例，不能据此声称新联调已通过。
reference 是用户提供的只读合同；若需改变协议，先提出变更，不自行编辑副本后当成同一版本。

## B 自测后交回 A 的内容

1. 基于 ABversion 的 B 专属提交标识、修改文件清单，不覆盖 A 目录。
2. 接口运行地址和配置变量名称；密钥通过既有私有配置提供，不发进聊天/仓库。
3. 实际请求响应样例及 Schema 校验结果，附错误响应。
4. 验证：同键同正文复用、同键不同正文409、同成果不同键不重复、旧版本仍可取、撤回410、越权403、身份失效401、依赖故障503。
5. 验证：A 用户退出或 A 会话重启后，登记范围内后台取件仍可完成；结果查看仍须有效用户权限。
6. 浏览器验证：A 页面刷新恢复状态、B 详情深链接正确、接入/复盘分别显示、未知时间和缺照片不伪造。

双方真实联调完成之前，保持现有 ABversion 线上运行模式；不把模拟服务通过标记成 A06 完成。
本清单仅交接材料，未自动发送给任何人。
