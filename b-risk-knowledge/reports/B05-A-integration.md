# B05｜给A的任务包接口交接

日期：2026-10-21。B00机器合同仍为proposed。以下为本地已实现行为，**不是A真实联调通过记录**。

## 地址、身份和模拟资料

- 后端基址：`http://127.0.0.1:8181`。内部页面通过5181访问；A的集成请求直接调用后端。
- 本地模拟服务Header：`Authorization: Bearer dev-a-service`。此固定演示身份不是JWT验签或真实服务凭据，不能用于部署。
- 当前登记producer=`a-demo`、org_id=`demo-org`，授权项目为`demo-airport`与`demo-metro`。这些值来自服务端mock身份和注册表，不能由正文自行授权。
- 用本地管理员/加工员访问`GET /api/v1/task-packages/samples/complete?project_id=demo-airport&task_id=your-demo-task`取得完整B00形状的模拟JSON。共8类模拟场景见`GET /api/v1/task-packages/samples`。
- B00原例中的`project-demo/org-demo`是占位示例。本地运行用上述已有演示项目映射；原始合同文件、字典及固定哈希向量没有修改。

## A接口

| 接口 | 规则 |
|---|---|
| POST `/integration/v1/task-packages` | 固定B00完整快照正文；服务身份；`Idempotency-Key`必传；首次202，重复200 |
| GET `/integration/v1/task-packages/{receipt_id}` | 同服务身份与当前项目授权；返回status、is_current、缺失/错误/警告、capabilities；retrospective_id当前始终null |
| POST `/integration/v1/task-packages/{receipt_id}/withdraw` | 同服务身份、撤回权限及幂等键；正文仅`reason`；200及固定withdrawn_at，重复replayed=true |

接收返回receipt_id、job_id、status、status_url、replayed，完全按B00 Schema与语义检查。错误结构继续是code/message/details/request_id。

业务哈希只排除顶层exported_at和每个附件access_ref，其余字段及数组顺序参与。相同键/版本同内容返回原receipt/job；同键异内容409 IDEMPOTENCY_CONFLICT；同任务版本异内容409 PACKAGE_VERSION_CONFLICT；package_id复用409 PACKAGE_ID_CONFLICT。不同用户/服务同一业务版本也不会创建第二份包。

任务ID归属不能从一个项目/组织迁移到另一个。缺失或无效身份401，身份/来源/组织/项目不匹配403，结构/语义错误422，正文超过5MiB为413，依赖失败503。当前明确拒绝`is_demo=false`。

## 内部开发接口

| 接口 | 说明 |
|---|---|
| POST `/api/v1/task-packages` | 本地离线导入；与A使用同一receive，不绕过校验 |
| POST `/api/v1/task-packages/preview` | 只做结构、引用和哈希预检；不创建接收包，不取附件 |
| GET `/api/v1/task-packages` | project_id/state/limit/cursor；稳定游标分页 |
| GET `/api/v1/task-packages/{id}` | 详情、校验、事件、附件、版本及差异；event_after控制事件分页 |
| GET `/api/v1/task-packages/{id}/snapshot` | 授权下读取原始快照；撤回410 |
| GET `/api/v1/task-packages/{id}/assets/{attachment_id}/content` | 包内明确证据关系、当前授权、文件校验后读取；撤回/未验证不可用 |
| POST `/api/v1/task-packages/{id}/withdraw` | 内部审核权限；同一撤回服务与B00正文 |
| POST `/api/v1/jobs/{job_id}/retry` | 失败job的内部授权重试；沿用row_version和Idempotency-Key；不重建receipt |

内部用户不能用普通开发身份冒充A的集成服务。新成员可只读项目内任务包；服务角色不自动获得全平台知识或通用任务管理权限。

## 附件适配协议

仍使用B00的`access_ref={connector_id,object_id}`，不新增URL或磁盘路径字段。

模拟`demo-store`只登记三个固定对象：airport-photo、airport-log、metro-log；分别属于机场/地铁项目。注册表指定真实文件和MIME，不由正文拼接路径。类型、实际大小和SHA256不符时，附件关系记录failed且没有可用asset_id；其他可处理事件仍保留，包可ready但capabilities受限。

状态ready不是“证据齐全”。A需要读取warnings、missing_fields和capabilities，不能只看HTTP200或ready。受控取件位置变化不改变包身份；B只接受经过重新授权和附件身份核对的更新，保留原始快照。重发失败包不自动重新入队，内部重试复用原job和已提交成果。

真正网络连接器应在`connectors.py`边界接入：由服务端登记可信源获取短期链接，限制来源域名/重定向、总量、超时和类型；获取失败应明确不可用，不读取包里任意URL。当前没有实现或测试网络取件、真实签名链接刷新、实际PDF/视频解析。

## 撤回和后续模块

撤回包立即阻断正文、事件、快照与附件读取，清空其当前指针但不复活旧版。高版本重新提交按新包处理；重发被撤回包仍返回withdrawn。已撤回版本的正文不会出现在其他版本差异中。

本轮创建唯一的pending下游失效通知，等待B06/B07接入；不宣称已撤回尚未实现的复盘、题目或学习内容。后续消费者必须同时检查实时来源状态，不能只依赖异步通知。

## A真实联调仍需提供或确认

1. A环境地址、调用身份、issuer/audience/验签方式及服务代用户上下文（如需）。
2. producer注册、组织/项目/用户ID及场景码的实际映射；包版本的生成责任和稳定事件ID规则。
3. 可信附件连接器的取件接口、权限、签名URL刷新、MIME/大小/哈希与文件ID规则。
4. 接收与查询超时、重试退避、撤回授权及审计口径。
5. 共同运行正常、缺时间、未知事件、部分附件、哈希错误、重复提交、同版本冲突、旧版晚到、中断重试和撤回案例。

本地验证：11个B00任务包文件逐一通过实际HTTP接收/拒绝检查；原始JCS固定摘要核对通过；重复/冲突/版本乱序/撤回的链式情形另有真实数据库与worker测试。详情见[B05验收记录](B05-validation.md)。
