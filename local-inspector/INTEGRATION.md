# 开发者 A 与 B 联调约定

版本：`1.0`。A 负责事实、流程状态、责任分工及成果版本；B 负责知识和复盘培训。双方不读写对方数据库。优先用文件包独立开发，再接真实知识接口及身份集成。

## 临时巡查入口

小程序调用 `POST /api/work/adhoc-tasks`，请求包含 `requestId`、`projectId`、`scenarioId`、`title`、`object`、`dueDate`、`fields`。与平台 `tasks` 接口共用任务结构，但服务器仅允许项目检查人、负责人或管理员调用，强制以当前登录人为执行人，不接受客户端指定执行人、接收人或任务状态。

新任务状态为 `ready`，确认准备清单后进入 `active`，不需平台先批准。任务新增 `source`（`adhoc`／`platform`）、`createdBy`、`createdByName`，这些字段随简报及正式快照导出。旧任务缺少 `source` 时按 `platform` 展示，属于兼容性新增字段。

临时巡查创建时 `receiver` 为空。平台调用 `receive-field` 并选择 `decision: "accept"` 时，若任务尚无接收人，可传 `receiverName` 手动填写接收人姓名（去除首尾空格后必填，最多100字）；兼容原 `receiver` 项目接收人或负责人账号。手填姓名不绑定账号，后续由平台负责人登记接收结果，记录实际操作人及 `recordedByManager` 标识。退回材料不要求该字段。后续整改、复核、成果交接和归档接口不变。

## 知识查询

A 的客户端调用 `POST /api/work/knowledge`：

```json
{"requestId":"客户端生成的唯一请求编号","taskId":"任务ID","question":"临边防护需要检查哪些内容"}
```

A 服务端校验登录与项目权限，取任务冻结的场景和对象，向环境变量 `QAXC_KNOWLEDGE_URL` 指定的服务发送 JSON：

```json
{"scene":"inspection","version":1,"object":"二号楼","question":"临边防护需要检查哪些内容"}
```

可用 `QAXC_KNOWLEDGE_TOKEN` 配置服务认证值，以 `Authorization: Bearer ...` 发送。不要把认证值写在小程序源码或提交到代码仓库。

B 响应约定：

```json
{
  "status":"ok",
  "version":"knowledge-2026-10",
  "items":[
    {"title":"作业要点","text":"经B维护的内容","reference":"来源文件及定位信息"}
  ]
}
```

每个条目必须有字符串 `title`、`text`、`reference`。B 可另外提供 `kind`（要点／规范候选／相似案例）、`sourceId`、`sourceVersion`、`locator` 等字段。A 保留并返回字段；当前界面展示前三项。A 补充 `requiresConfirmation: true`，结果不能直接改变业务状态。

超时、错误、格式不匹配或未配置时，A 返回 `status: "fallback"`、`version: "demo-1"` 与明确标记的演示提示。查询不变更任务修订号。

## 识别适配接口

这是 A 内部适配接口，不要求由 B 实现。`QAXC_RECOGNITION_URL` 和可选的 `QAXC_RECOGNITION_TOKEN` 指向管理员选择的识别服务。配置后，A 在用户点击提取时发送：

```json
{
  "kind":"audio/mpeg",
  "taskId":"任务ID",
  "evidenceId":"证据ID",
  "mime":"audio/mpeg",
  "sha256":"文件内容摘要",
  "base64":"原始文件内容的Base64"
}
```

供应商适配服务返回 `{"status":"ok","text":"提取的待确认文本"}`。未配置或出错时返回 `status: "manual"`，正文为空，提示人工整理。图像或录音的结果仅写入客户端草稿，用户核对后才能成为确认记录。原文件和证据关联保留。

文件最大 10MB；服务超时为 8 秒，响应最大 1MB。实际供应商鉴权、隐私约定和端到端识别质量需接入时验证。

## 完成任务包

网页平台从指定成果版本导出：

- `GET /api/work/package/{deliveryId}`：ZIP 包，包括 `task.json`、`report.html`、`evidence/` 中的实际附件。
- `GET /api/work/snapshot/{deliveryId}`：JSON 快照，附件使用需要认证的 A 服务相对地址。
- `GET /api/work/word/{deliveryId}`：正式报告 Word。
- `GET /api/work/issues/{deliveryId}`：CSV 问题清单。

这些地址均要求 A 的有效会话及当前项目权限。跨系统不能把不带认证的相对 URL 当成公开附件链接。离线导入建议用 ZIP，B 解压后读取 `packagePath`，校验 `sha256`，再存入 B 的存储。

顶层数据：

| 字段 | 含义 |
| --- | --- |
| `schemaVersion` | 当前固定为 `1.0` |
| `packageId` | 当前不可变快照的唯一编号；重复导出不改变 |
| `version` | 当前任务的成果版本，包含初始交接及最终归档版本 |
| `exportedAt` | 快照生成时间；重复下载不改变 |
| `project` | 创建快照时的项目及合同信息 |
| `members` | 生成快照时的成员及角色 |
| `scenario` | 任务绑定的完整场景配置及版本 |
| `task` | 任务、对象、字段、确认记录、问题、整改历史、复核、事件、交接、接收及归档信息 |
| `evidence` | 证据清单，包含编号、原名、类型、版本、来源、时间、摘要及访问方式 |
| `summary` | 记录数量、问题数量、销项数量 |

`task.records` 包含稳定 ID、`occurredAt`、`uploadedAt`、作者、状态、证据 ID 数组及确认时间。导入旧报告时还包括 `sourceReportId` 与该报告的事实快照。

`task.issues` 包含问题 ID、描述、风险等级、责任人与复核人 ID、截止日期、状态及 `history`。历史包含处理意见、操作者、时间、证据关联及复核决定。

`task.events` 是按操作顺序追加的事件，包含事件 ID、动作、操作者、详情及服务端时间。`task.receipt` 保存接收结果并指向所接收的交接版本。归档版本包括该接收结果，初始交接版本不会被改写。

证据的 `reviewStatus` 表示文件登记状态；确认记录或复核销项不意味着文件经过独立真实性鉴定。B 应同时读关联记录和处理历史，不将 `unreviewed` 文件解释为已独立审核。

## 版本、去重与补正

1. B 按 `packageId` 去重；同一任务按 `task.id + version` 维护版本历史，不覆盖旧快照。
2. 相同版本的事实内容固定。B 发现缺证或错误时提供反馈清单，不直接更新 A 数据库。
3. A 的负责人填写补正原因，重新开放现场补充；现场端追加记录、再上报，平台重新接收、交接和归档。
4. 新成果版本有新的 `packageId`；原记录、原始简报及历史成果版本保留。
5. JSON 示例与 ZIP 样例在 `examples/`，由真实 A 接口生成，全部为测试数据。示例中的 UUID、账号名和日期不用于生产。

## A 内部写接口约定

接口前缀 `/api/work/`。写请求必须携带 `requestId`；任务更新另携带 `taskId`、`revision`。响应采用 HTTP 状态码：200 成功，400 校验失败，401 未登录，403 无权限，404 不存在，409 版本或状态冲突。失败格式为 `{"error":"可读原因"}`。任务 `status` 是业务状态，不是 HTTP 成功标记。

`requestId` 在当前用户范围内去重；同 ID 同正文返回原结果，同 ID 不同正文返回 409。客户端在收到明确失败后修正数据，应使用新 ID；网络结果未知时，可复用原 ID 和原正文重试。

主要动作：

| 端 | 动作 |
| --- | --- |
| 小程序 | `adhoc-tasks`、`start`、`upload`、`record`、`issue`、`submit-field`、`knowledge`、`recognize` |
| 网页平台 | `users`、`members`、`scenarios`、`tasks`、`materials`、`receive-field`、`reassign`、`reply`、`review`、`deliver`、`accept`、`archive`、`reopen` |
| 共享读取 | `GET state`、`GET evidence/{id}`、`GET evidence-meta/{id}` |

现场状态：`collecting → submitted → accepted`；平台退回变为 `collecting`。任务状态：`ready → active → handover → accepted → archived`。现场问题状态：`unassigned → assigned → review → closed`，复核退回为 `returned`，整改再次回复后回到 `review`。

身份集成目前是 A 内部账号与会话，不冒充已接通 B 的 SSO。B 的身份校验及权限映射需要双方后续联调。

## 手填整改与复核人员

平台分派使用 `assigneeName`、`reviewerName`（首尾去空格，必填，最多100字），启用人员分离的场景不允许同名。姓名不自动绑定账号；平台负责人代录整改回复和复核结果，历史保存 `recordedByManager`、`personName` 及实际 `actor`。原账号分派接口及权限仍兼容。
