# B00合同交付入口

状态：`proposed`。这是本地可校验的接口设计和参考模型，不是已运行的API服务；A尚未确认，也未做真实联调。

## 文件

| 文件 | 用途 |
|---|---|
| [openapi-integration.yaml](openapi-integration.yaml) | 四条集成接口、身份声明、请求及响应 |
| [task-package.schema.json](task-package.schema.json) | 任务完整快照 |
| [knowledge-query.schema.json](knowledge-query.schema.json) | 知识查询请求 |
| [knowledge-response.schema.json](knowledge-response.schema.json) | 答案、案例、要点、引用与不足信息 |
| [task-receipt.schema.json](task-receipt.schema.json) / [task-status.schema.json](task-status.schema.json) | 接收及处理状态 |
| [withdraw-request.schema.json](withdraw-request.schema.json) / [withdraw-response.schema.json](withdraw-response.schema.json) | 撤回 |
| [error.schema.json](error.schema.json) | 统一错误 |
| [event-types.json](event-types.json) / [scene-codes.json](scene-codes.json) | 初始字典 |
| [limits.json](limits.json) | 建议限制，非实测容量 |
| [semantics.md](semantics.md) | Schema外的幂等、哈希、兼容和引用规则 |
| [domain-model.md](domain-model.md) | 数据关系与所有权 |
| [decisions.md](decisions.md) | A需要确认的事项 |
| [examples/manifest.json](examples/manifest.json) | 正反例预期 |
| [reports/validation.md](reports/validation.md) | 最新实际检查结果 |

所有样例为合成数据，附件哈希和对象标识是演示占位，不能用于实际下载或判断工程安全。

## 执行校验

在项目根目录的PowerShell运行：

```powershell
& '.\b-risk-knowledge\.venv-contracts\Scripts\python.exe' -X utf8 '.\b-risk-knowledge\contracts\tools\validate_contracts.py'
```

该命令校验现有交付物，不会重建预期样例，不连接网络或业务系统。成功退出码0，失败1；最新报告覆盖写入`reports/validation.json`和`validation.md`。

新机器可使用已有合适Python创建项目隔离环境，再安装`requirements-contracts.txt`。不需要安装FastAPI、数据库或模型服务。Windows临时目录权限异常时，将当前进程TEMP/TMP指向项目内`.contract-tmp`后重试，不修改系统Python。

本轮实际使用Python 3.12.10及项目隔离环境；依赖版本以`requirements-contracts.txt`和验证报告为准。联网pip未完成，已中止等待；jsonschema/PyYAML等来自本机既有缓存，RFC8785实现与OpenAPI元Schema采用许可文件齐全的[上游快照](tools/vendor/README.md)。没有运行完整openapi-spec-validator包。

## 修改合同

机器文件的当前编写源是`tools/build_contracts.py`。修改字段时先修改该源，再运行：

```powershell
& '.\b-risk-knowledge\.venv-contracts\Scripts\python.exe' -X utf8 '.\b-risk-knowledge\contracts\tools\build_contracts.py'
& '.\b-risk-knowledge\.venv-contracts\Scripts\python.exe' -X utf8 '.\b-risk-knowledge\contracts\tools\validate_contracts.py'
```

生成器会覆盖命名的Schema、OpenAPI、字典和样例，不覆盖说明、规则检查器或测试。运行前核对手工修改；不要为了让测试通过而重建固定哈希预期。正常复测只运行validate，不运行build。

`contract_rules.py`是合同语义检查和内存参考账本，B01/B05可参考其规则，但它没有数据库事务、令牌验签、队列、并发锁和文件下载能力，不能作为生产服务使用。

## B01可以开始的条件

本地合同检查通过即可开始工程基础、身份适配接口、文件服务和后台任务验证。真实身份接入和A附件下载仍需A确认。不要把本文的Bearer草案当成已批准的认证部署。

## 规范依据

- [OpenAPI 3.1.0](https://spec.openapis.org/oas/v3.1.0.html)：本交付固定采用该版本，不追逐最新版本。
- [JSON Schema 2020-12](https://json-schema.org/draft/2020-12)：字段验证。
- [RFC 8785 JCS](https://www.rfc-editor.org/rfc/rfc8785)：使用现有库实现规范化，不自研跨语言哈希序列化。
- [python-jsonschema验证说明](https://python-jsonschema.readthedocs.io/en/stable/validate/)：显式启用FormatChecker，不能只声明format而不校验日期。
