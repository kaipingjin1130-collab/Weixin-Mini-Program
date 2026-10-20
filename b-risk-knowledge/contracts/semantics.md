# 合同语义和兼容规则

所有规则为B建议的proposed 1.0合同。Schema验证必要但不充分；还要执行引用、身份、版本与授权规则。

## 1. 类型、标识和扩展

- 外部ID：1—128字符，ASCII字母/数字开头，其后允许字母、数字、`_ . : -`；不是UUID。若A现有ID超出该范围，应确认后调整，不能静默转换身份。
- B内部ID：UUID字符串。日期时间采用带时区RFC3339子集：大写T/Z、秒0—59、不接受闰秒；使用标准库校验真实日历日期，需兼容其他表示时先更新合同。位置的page/table/row从1开始。
- schema_version表示数据结构；package_version表示A同任务内容版本；row_version仅用于B可编辑对象并发控制，不是包字段。
- 顶层和固定结构拒绝未知字段。可扩展元数据放`extensions`，键采用`a.key`等命名空间。
- payload是数据，不能提供指令、权限或执行代码；全局大小、深度、文本长度和JSON数值限制同样适用。
- 未知事件类型：保留、警告、不映射成已知事实，不用于确定性流程判断。
- 未注册场景：422，先双方注册再使用；不静默映射到一般巡查。
- 结构变更先更新合同版本。相同版本不得悄悄增加必填字段或收窄原字段。双方确认的字典更新同步发布。

## 2. 完整性与引用

完整性状态为complete、partial、missing、not_applicable。missing/not_applicable对应集合应为空。complete代表A声明完整，B不能仅凭此认为事实正确；后续仍校验证据可用性。

event_times为complete要求至少一个事件且时间全部已知；实际时间未知必须null，不能用exported_at补齐。complete_timeline仅在事件和时间都声明完整、没有未知事件且相关必需证据已核对后启用；否则partial_timeline或只提供historical_summary。B05负责实际能力判定，B00只验证结构和冲突。

事件与问题的evidence_refs均引用本包attachments.attachment_id；资料缺失时留空并标missing/partial，不能引用不存在的附件。非null actor_id必须来自participants。related_object_id引用task_id或issue_id；task_id和issue_id不能相同。

包内actor/event/issue/attachment各自ID唯一。不同版本允许沿用相同外部事件ID，但B保存到具体包版本，不能覆盖旧事件。

查询回答中每个事实性块、检查项和案例至少有一个引用；引用ID必须存在且唯一。引用关联固定knowledge_revision_id及evidence_id，发布ID不能在有引用时为空。insufficient_evidence不能携带事实答案、检查项或案例，可返回缺失条件和候选证据。degraded必须带原因。

## 3. 内容哈希：sha256-jcs-task-package-v1

1. 先严格解析JSON，拒绝重复键、NaN、Infinity、无效Unicode及超出JCS可安全表达的数字。业务大整数如标识用字符串。
2. 从通过校验的包深拷贝：只删除顶层exported_at和每个attachments条目中的access_ref。
3. 其余字段全部参与，包括package_id、package_version、is_demo、extensions、数组顺序、null值。数组不排序；不做Unicode、空白文本或时区归一化。
4. 使用RFC8785 JCS编码为UTF-8字节，计算SHA-256小写十六进制。
5. 令牌只能放Header，Schema不允许混入正文。access_ref是获取位置，不是证据身份；附件ID、sha256、mime_type、size、evidence_type全部参与内容哈希。

同一逻辑版本必须保留package_id和数组顺序。重新导出时间或受控取件标识变化不改变内容身份。对同一个包刷新access_ref须先重新授权并验证附件身份，不直接信任新位置。

固定向量在examples/hash-vectors.json。测试既核对固定摘要，也核对字段顺序、数字编码、业务变化与传输字段变化。

## 4. 幂等与状态

幂等键建议作用域：(可信调用者subject、producer、operationId、Idempotency-Key)。首次提交和业务身份约束在同一事务落实。proposed保留期为包记录存续期，不靠短期缓存实现最终去重。

- 新包：202，receipt/job建立，状态received；尚未成为可用于复盘的当前包。
- 同键同内容或同版本同内容：200，返回原receipt/job，replayed=true，不新增处理。新增幂等键可关联原记录。
- 同键不同内容：409 IDEMPOTENCY_CONFLICT。
- 同producer/task/version不同内容：409 PACKAGE_VERSION_CONFLICT。
- package_id复用于其他版本或任务：409 PACKAGE_ID_CONFLICT。
- 作用域和项目权限在查询原receipt之前检查，重试也不能绕过撤权。
- 内容异同按上述业务哈希判断。withdraw独立operation，reason属于其幂等请求内容；同撤回键异reason应409。

必须区分latest_received_version与current_ready_version。前者取通过接收校验的最高版本，后者仅在处理ready后向更高版本切换。新包失败不能替换可用旧版；旧版处理较晚完成不能覆盖新版。

状态：received→validating→processing→ready；异常进入failed；非withdrawn状态可撤回。failed同键重试返回原状态，是否重跑由授权的内部重试操作决定，不隐式重复入队。

ready表示已经完成可做的处理，不代表资料完整。部分附件不可用写入warnings和missing_fields，限制capabilities。

撤回接口返回200、withdrawn_at和replayed；先阻断在线访问，再异步标记派生对象。撤回当前包不自动复活旧包。新版本需重新授权和审核；同键重发旧包不解除撤回。

## 5. 传输和默认限制

默认：正文5MiB（原始解压后UTF-8字节），单附件100MiB、总附件1GiB、每包200附件、10000事件、2000问题；查询4000字符，limit≤20；单文本20000字符；JSON深度≤20、节点≤300000。

这些是建议限额，不是压力测试结果。Schema中的结构上限是当前1.0 profile；运行时可进一步收紧并公开配置，扩大结构上限应更新公开合同，不能仅改服务器隐藏参数。413用于正文超字节，422用于结构或语义违规，429用于运行时频率限制。

附件access_ref仅允许connector_id与object_id，二者是受控标识。签名URL应由可信connector运行时获取，不直接进入包。运行时必须核对下载大小、重定向、哈希和访问授权。

## 6. 身份与失败

OpenAPI暂用Bearer描述传输，不决定JWT格式、issuer、audience、密钥或代用户协议。缺/无效身份401，无项目范围403，目标不可见404；授权校验先于幂等记录查找。

查询模型失败但证据可用：200 degraded；无相关证据：200 insufficient_evidence；依赖整体不可用：503。超时建议由A配置可取消请求，具体响应时限待联调测量。

统一错误code、message、details、request_id，不返回堆栈、密钥或完整敏感原文。

## 7. 验证范围限制

参考账本只演示接收幂等、ready切换和撤回逻辑。权限用已信任的范围参数模拟，不证明验签；没有DB并发、网络重试、真实附件、worker恢复或A服务。上述运行能力分别在B01/B05验收。
