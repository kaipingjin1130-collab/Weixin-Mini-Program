# A/B 联调：B 侧独立开发进度

基线：共同约定 `ab-integration/1.0`；A 代码只读。本记录区分本地替身与真实联调。演示样例取自 A `local-inspector/examples/completed-task-demo`，属于纯测试数据，复制到 B 测试目录以便独立运行，不视为正式成果。

| 工作 | 当前结果 | 尚未完成 |
|---|---|---|
| B 合同 | 提取 B 边界 Schema 和测试样例 | 接口实现及对方服务实测 |
| 离线适配 | JSON/ZIP 读取、引用检查、转换、原文哈希、旧报告日期精度、附件校验 | 持久化原始字节、版本去重、接入任务包链 |
| 身份 | A 模式方向凭据检查、每请求回调及权限集合、拒绝失效和依赖故障 | 旧接口的动作逐一映射；现有粗粒度操作在 A 模式默认拒绝；真实 A 代理未验证 |
| 来源读取 | 服务凭据客户端、元信息资格与引用检查、快照转换、成果级附件元数据及哈希检查 | 服务登记和连接器接入、持久化、流式总耗时限制与真实 A 验证 |
| 知识 | 新增 `a-knowledge/query`：项目读取权限、固定场景映射、引用转换及无结果/超时语义；暂排除复盘派生资料 | 实际数据库检索、完整 HTTP/浏览器验证和来源撤回联动 |
| 接入、复盘、页面 | 仍为原有演示链 | 按新合同实施；现有模拟接口不是 A 联调实现 |

私有配置使用本机 `.local/config.json` 或环境变量：`B_AUTH_MODE=a`、`A_INTERNAL_BASE`、`A_ORG_ID`、`A_TO_B_KEY`、`B_TO_A_KEY`，后两项必须不同；禁止将密钥提交至仓库。A 模式尚不供正式使用，不可用本地模拟身份替代真实验证。默认演示模式仍只允许 development 环境。

自动化：`python -m pytest tests/test_a_identity.py tests/test_a_client.py tests/test_a_offline.py tests/test_ab_contract.py -q -p no:cacheprovider`。身份与成果客户端使用进程内 HTTP 模拟响应，未启动真实 HTTP 服务；离线测试不证明 A 的资格、权限或撤回功能。后台队列未保存用户会话这一要求仍待实现并验证。

知识适配单元检查：`python -m pytest tests/test_a_knowledge.py -q -p no:cacheprovider`，覆盖项目授权、引用、未支持场景、无结果和错误引用；以固定检索响应替代数据库，未验证实际索引和 HTTP 路径。超时后服务响应 503，后台执行线程可能继续至数据库调用结束。
