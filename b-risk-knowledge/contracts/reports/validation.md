# B00本地合同验证

- 通过：70；失败：0
- 合同状态：proposed；未与A确认。
- 范围：Schema、OpenAPI、样例、引用和内存参考模型；不等于服务/数据库/权限系统/真实联调验收。

| 检查 | 结果 |
|---|---|
| schema:error.schema.json | 通过 |
| schema:knowledge-query.schema.json | 通过 |
| schema:knowledge-response.schema.json | 通过 |
| schema:task-package.schema.json | 通过 |
| schema:task-receipt.schema.json | 通过 |
| schema:task-status.schema.json | 通过 |
| schema:withdraw-request.schema.json | 通过 |
| schema:withdraw-response.schema.json | 通过 |
| openapi:official-meta-schema | 通过 |
| openapi:all-references-resolve | 通过 |
| openapi:standalone-schema-parity | 通过 |
| openapi:all-inline-examples | 通过 |
| fixture:package-valid.json | 通过 |
| fixture:package-no-time.json | 通过 |
| fixture:package-missing-attachments.json | 通过 |
| fixture:package-unknown-event.json | 通过 |
| fixture:package-repeat.json | 通过 |
| fixture:package-same-version-conflict.json | 通过 |
| fixture:package-v2.json | 通过 |
| fixture:package-old-arrival.json | 通过 |
| fixture:package-invalid-missing-project.json | 通过 |
| fixture:package-invalid-reference.json | 通过 |
| fixture:package-invalid-timezone.json | 通过 |
| fixture:query-valid.json | 通过 |
| fixture:query-invalid-limit.json | 通过 |
| fixture:response-answered.json | 通过 |
| fixture:response-no-evidence.json | 通过 |
| fixture:response-degraded.json | 通过 |
| fixture:response-invalid-citation.json | 通过 |
| fixture:receipt-accepted.json | 通过 |
| fixture:status-ready.json | 通过 |
| fixture:status-partial-evidence.json | 通过 |
| fixture:withdraw-request.json | 通过 |
| fixture:withdraw-response.json | 通过 |
| fixture:error-conflict.json | 通过 |
| state:same-key-same-body | 通过 |
| state:same-version-new-key | 通过 |
| state:same-key-different-content | 通过 |
| state:same-version-different-content | 通过 |
| state:new-version | 通过 |
| state:old-arrives-late | 通过 |
| hash:fixed-vector | 通过 |
| hash:sha256-library-known-vector | 通过 |
| hash:invariants-and-jcs-bytes | 通过 |
| negative:duplicate-event-id | 通过 |
| negative:dangling-actor | 通过 |
| negative:dangling-object | 通过 |
| negative:unknown-top-level-field | 通过 |
| negative:unsupported-schema-version | 通过 |
| negative:unregistered-scene | 通过 |
| negative:contradictory-completeness | 通过 |
| negative:timezone-with-impossible-date | 通过 |
| negative:inverted-task-time | 通过 |
| negative:unsafe-file-path | 通过 |
| negative:unsafe-url | 通过 |
| negative:attachment-over-limit | 通过 |
| negative:oversized-nested-text | 通过 |
| negative:unsafe-jcs-integer | 通过 |
| negative:non-finite | 通过 |
| negative:invalid-extension-namespace | 通过 |
| negative:query-duplicate-output | 通过 |
| negative:answered-without-content | 通过 |
| negative:unsupported-claim-in-insufficient | 通过 |
| negative:citation-without-release | 通过 |
| state:package-id-conflict | 通过 |
| state:ready-order-and-withdrawal | 通过 |
| reference-only:trusted-scope-denial | 通过 |
| parser:duplicate-keys-and-nonfinite | 通过 |
| negative:nested-depth-limit | 通过 |
| contract:assets-security-and-idempotency-headers | 通过 |
