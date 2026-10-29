# 接口约定 v1：机器字段与测试样例

语义以 [AB联调开发约定v1](../AB联调开发约定v1.md) 为准。当前文件由本轮统一制定，交给两个开发者只读消费，不允许各自修改副本后当成同一版本。后续 A 维护 A 提供的接口，B 维护 B 提供的接口；兼容变化更新版本记录，破坏性变更升主版本。

- `schemas.json`：Draft 2020-12，`$defs` 包含身份、元信息、接入、知识、复盘与错误等12个边界结构；选择对应 `$ref` 验证。并非全部旧 A/B 业务接口的 OpenAPI。
- `examples.json`：24个手工构造的正向/负向字段样例。`valid=false` 表示应被Schema拒绝，不是服务业务错误响应；错误响应自身是合法JSON形状。样例不含真实凭据。
- `validate.py`：只做Schema及样例校验，不调用服务，不初始化或修改数据库。

在项目根目录使用现有 B Python 环境运行：

```powershell
& '.\b-risk-knowledge\.venv\Scripts\python.exe' -X utf8 '.\开发\联调任务\接口约定v1\validate.py'
```

其他开发机需已有 Python 和 jsonschema；由开发者使用现有项目环境执行，不要求安装第二套运行时。

提供方真实响应和消费方HTTP替身均应使用这些结构。Schema不替代如下语义测试：身份有效性、权限交集、元信息与快照一致、同键异内容冲突、文件哈希、历史版本、来源撤回及引用有效性。

完整A冻结快照样例优先复用 `开发/Weixin-Mini-Program/local-inspector/examples/completed-task-demo.json` 及同名ZIP；实施前核对样例来源、版本和附件，不把它伪装成本次新接口响应。本包只规定接口边界，不复制已有大样例或修改B内部任务包合同。

补充固定字段：接入 `capabilities` 包含 can_view_materials、can_generate_retrospective、evidence_complete 三个布尔值；警告结构为 code/path/message；知识引用为 citation_id/source_title/locator/knowledge_revision_id/evidence_id；复盘 result_path 为 `/quality/b/#/retrospectives/{id}` 或null，不能返回任意外部URL。知识引用ID必须能在返回citations中解析；ready状态与ID、资料能力必须语义一致。
