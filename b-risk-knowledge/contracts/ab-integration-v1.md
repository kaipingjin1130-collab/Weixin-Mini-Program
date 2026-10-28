# B 对 A 的 v1 边界合同

版本 `ab-integration/1.0`。`ab-integration-v1.schema.json` 和 `ab-integration-v1.examples.json` 从共同合同 v1 中提取 B 提供的九种结构及 17 个样例，字段含义和错误语义以共同《AB联调开发约定v1》为准。结构和样例是目标合同，**不表示接口已实现**。A 提供的身份、成果和附件合同没有在此维护。

目标接口：`POST /integration/v1/a-imports`、`GET /integration/v1/a-imports/{id}`、`GET /integration/v1/a-imports`、`POST /integration/v1/a-imports/{id}/retry`、`POST /integration/v1/a-imports/{id}/withdraw`、`POST /integration/v1/a-imports/{id}/retrospectives`、`GET /integration/v1/a-imports/{id}/retrospective`、`POST /integration/v1/a-knowledge/query`。所有 POST 中除知识查询外要求 `Idempotency-Key`。接入状态 queued、fetching、validating、processing、ready、failed、withdrawn；复盘状态 not_created、queued、processing、ready、failed、withdrawn。ready 不保证证据齐全。

错误结构为 code、message、details、request_id；状态码包含 401、403、404、409、410、413、422、429 和 503。每项业务操作需先检查相应项目权限，再执行幂等回放；不可用身份或来源不得降级为模拟成功。
