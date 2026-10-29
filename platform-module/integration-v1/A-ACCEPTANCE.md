# A 侧新 v1 联调验收

后续状态：用户另行授权后已完成 v1 上线及真实账号只读验收，最终运行代码为 `b1a7748`；见 [上线记录](PRODUCTION-DEPLOYMENT.md)。下文“不部署”描述的是本机验收时的阶段边界。

日期：2026-10-29。分支：`codex/ab-fusion-integration`；验收基线 `f733532`，包含 B `c33c447` 和 A `bf44d18`。本记录所在提交补齐 A 入口修复及真实同源代理验收，原始 `B-HANDOFF.md` 与 reference 合同保持不变。

## 结论与范围

仓库代码的 A/B 本机联调验收完成。使用真实 A Handler、B HTTP 服务、PostgreSQL 与独立 worker；使用隔离测试账号、项目和成果，不是生产数据。本次没有部署、没有修改服务器配置或授予生产权限，也不代表原平台身份服务、生产网络及真实业务账号已完成上线验收。

## 修复

- `/imports/ai_…` 深链接进入报告中心的“成果接入”，外层面包屑同步；旧导入批次及历史资料仍归原页签。
- 接入已就绪但复盘失败时，具备 `imports.retry` 权限的用户可“重试复盘”；生成、处理中及已就绪的复盘不重复展示生成按钮。
- v1 身份上下文成功加载后，隐藏归档页旧 `archive-review` 入口，使用同页新协议接入/生成/查看控件；旧模式继续保留原入口。没有删除原页面。
- A 代理读取已通过大小限制的请求正文后再执行 CSRF/Origin 拒绝，避免 Windows 因未读正文关闭连接而使客户端收不到 403。一次复跑暴露该偶发中断，修复后重新执行完整验收。

## 自动验收

| 范围 | 本次结果 |
| --- | --- |
| A v1、HTTP、同源网关 | 23 项通过 |
| A 导航、登录与接入控件 | 21 项通过 |
| 真实 A/B v1 端到端 | 6 组通过 |
| JavaScript 语法与 Git 差异检查 | 通过 |

新增同源场景实际从 `/quality/api/login` 获取 Cookie，再经 `/quality/b/integration/v1` 调用真实 B：缺少 CSRF/外站 Origin 为 403，创建为 202、重放为 200，后台取件与复盘成功；列表可恢复原接入；无效状态重试为 409；撤销权限后立即 403；B 撤回成功且不修改 A 来源；清除 A 会话后立即 401。代理响应也经过原合同 Schema 校验。

A 的 `/quality/api/work/knowledge` 使用服务端任务上下文查询真实 B：无已发布知识时返回 insufficient_evidence、空列表和需确认标识；发布测试知识后返回 answered、引用和对应发布版本，不回退演示内容。原有五组真实服务测试同时复跑，覆盖七个接入接口、幂等/并发、独立服务取件、历史版本、失败重试、附件损坏、来源撤回传播及知识/复盘/培训权限。

本次没有改动 B 运行代码或前端构建源码。之前 B 的 99 项回归、TypeScript 和独立/嵌入构建结果见 B 交付记录；不将历史检查写成本轮重复执行。

## Chrome 实际页面验收

独立本机浏览器上下文，真实登录后执行：A 归档页接入 v2 成果、生成复盘、刷新恢复；接入详情正确选中“成果接入”，无 iframe；v1 不显示旧协议入口。仅对本次隔离项目注入复盘失败状态后，A 出现“重试复盘”，点击后真实队列恢复为已就绪，刷新仍可查看复盘。自动端到端测试另覆盖真实生成异常后的重试，浏览器状态注入不替代后台失败测试。

## 配置核对与上线边界

测试配置已实际验证 A/B/API/worker 的组织、项目和双向密钥一致；A 服务范围 `metadata.read/snapshot.read/evidence.read` 与 B 来源登记 `delivery.meta/delivery.snapshot/delivery.attachment` 对应；缺失服务项目授权会被拒绝。用户授权采用显式权限和项目范围，实时撤权生效。测试配置并非服务器私有配置审核。

技术联调无需再等待 A 重做本机验收。以后获准上线时，仍须在目标环境核对私有配置、原平台真实身份与项目成员关系，并执行生产冒烟验收；当前明确不部署。

## 复现与证据

在已有项目 Python 依赖和本机专用 PostgreSQL 环境运行：

```text
python -m pytest platform-module/tests/test_ab_v1.py platform-module/tests/test_ab_v1_http.py platform-module/tests/test_ab_gateway.py -q
node --test platform-module/tests/ab-client.test.cjs platform-module/tests/report-catalog.test.cjs platform-module/tests/login-errors.test.cjs
python b-risk-knowledge/tools/check_v1.py
```

最后一项只使用本机专用 `risk_b_v1_test`；不要替换为业务库。实际同源 HTTP 请求响应见 [a-proxy-contract-evidence.json](a-proxy-contract-evidence.json)，不包含 Cookie、认证头或真实私有配置。完整最新运行证据由运行器写入 B 的 `.local/v1-contract-evidence.json` 和 `.local/v1-results.xml`。
