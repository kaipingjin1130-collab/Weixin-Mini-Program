# A/B 同库分 schema：迁移准备与隔离演练

日期：2026-11-05。当前状态：**用户确认同事上传完成并授权后，已于北京时间 17:12 完成正式切换。A/B 共用 `qaxc_ab_20261105`，业务 schema 分别为 `a`、`b`。**

正式发布为 `/opt/qaxc-fusion-pg-20261105`，API 和 worker 使用同一副本。TAT `inv-was8wugqx0`，退出码 0，脚本用时 63 秒；这不是外部监控测得的精确不可用时长。最新停写备份与回滚材料位于 `/var/backups/qaxc-formal-20261105`，原 SQLite、B 库和历史库保留。18 个小程序文件逐文件摘要一致，不需要重新提交小程序版本。

逐表及附件对账通过：A 16 张表，B 71 张业务表，A/B 附件分别 45/418 个。正式 API 在本机隔离监听完成启动、身份边界和内容对账后开放；worker 心跳正常。已在网页用现有主平台账号重新登录，核对负责人汇总、报告列表/详情、照片/签名和 B 历史资料工作区。未做微信真机实测；浏览器 Word 下载工具超时，不计为下载验收通过。

以下是切换前的备份和演练记录，里面的“未切换”描述对应当时阶段。线上开放后不能直接恢复旧库丢弃新写入；须按“回滚边界”对当前合并库重新停写快照、反向导出并核对。

## 正式切换后的清理与复核

用户明确要求删除无效演练数据。先确认四个演练库无连接、四个目录无进程引用或挂载点，再复验正式停写备份，将测试摘要、日志、JUnit XML 和迁移补丁留存至 `/var/backups/qaxc-formal-20261105/rehearsal-evidence` 后清理。

- 已删除 `/var/tmp/qaxc-isolated-20261105t073438z`、`/var/tmp/qaxc-isolated-20261105t080321z`、`/var/tmp/qaxc-app-acceptance-20261105t081800z`、`/var/tmp/qaxc-recovery-acceptance-20261105t082946z`。
- 已删除 `qaxc_rehearsal_20261105t073438z`、`qaxc_rehearsal_20261105t080321z`、`qaxc_restore_20261105t073438z`、`qaxc_restore_20261105t080321z`。未删除既有 `risk_b_test`、历史库或原生产库。
- TAT `inv-2asa180nc2`，10 秒，退出码 0；北京时间 17:48:10 完成。根云盘剩余由 35.409 GiB 增至 **44.459 GiB**，净释放 **9.050 GiB**。这是实际盘点的演练范围，不以预估 11GB 扩大删除范围。
- 清理前后 API/worker PID 一致，worker 心跳正常，18 个小程序文件摘要一致。生产库中 9 份原报告全部生成 Word，并通过 ZIP 完整性及 `word/document.xml` 检查；此项为服务器生成验收，不等同于浏览器下载/微信真机验收。
- 原 SQLite、`qaxc_b`、正式新库、历史报告库、业务附件及两阶段完整备份均保留。清理摘要位于 `/var/backups/qaxc-formal-20261105/cleanup-summary.json`。
- 发布源码以远端 `230deed` 为基线应用同一演练补丁；八个变更运行文件的 SHA-256 与服务器正式副本逐一一致。使用独立工作树准备提交，不覆盖用户原工作树中的小程序配置或未提交脚本。

## 服务器实测证据（2026-11-05）

- 实例 `ins-ft1kcn59`，PG16 `qaxcb` 集群端口 55440，生产 B 库 `qaxc_b`；A `/var/lib/qaxc-test`，B 附件 `/var/lib/qaxc-b/storage`。首次检查根盘剩余约 48 GiB。
- API 实际运行代码 `/opt/qaxc-fusion-b230deed-20261105-122955`，worker 仍使用 `/opt/qaxc-fusion-a1b9411`；两套代码均已备份，不能以本地旧基线直接覆盖生产。
- A 独立安全备份：`/var/backups/qaxc-a-safety-20261105T070819Z`，SQLite 完整性、外键、45 个附件哈希通过。TAT `inv-was5bh07jc`。
- 完整备份：`/var/backups/qaxc-fusion-rehearsal-20261105T072229Z`，`data/manifest.json` 完整验证通过，A 16 张表、45 个文件；B 全部用户表和队列同一 PG 导出快照，418 个业务文件。另含两套代码压缩包、源文件摘要、受限服务配置。TAT `inv-2as5qsg2b2`，52 秒，退出码 0。
- 成功迁移库：`qaxc_rehearsal_20261105t080321z`；恢复库：`qaxc_restore_20261105t080321z`。产物 `/var/tmp/qaxc-isolated-20261105t080321z`。TAT `inv-0as6x00gs3`，126 秒，退出码 0。
- A 16 张表逐表内容摘要一致，B 71 张业务表迁入 `b` 后摘要一致；队列表/函数及 vector 留在 public。A 反向 SQLite、附件拷贝、54 条附件引用验证通过。
- 在隔离库增加 A favorite 与 B 专用测试表，验证跨 schema 外键、JOIN、故障注入共同回滚；提交新的测试记录后做最新快照恢复，A SQLite 和 B 恢复库均保留新增记录；原完整备份未改变。
- 备份时生产 `a_imports` 为 0，因此真实数据对账本身不能代替 A→B 业务验收。另在恢复后的生产副本中使用合成任务，通过了下述真实接口和 worker 验收；没有向生产库写入这些测试任务。
- 首次恢复因 `vector` 扩展注释所有权失败：扩展预建为 postgres 所有，现有业务角色不能 COMMENT。修正为两处 `pg_restore --no-comments`；保留原始 dump 中注释，不修改扩展所有者或提升角色权限。失败库和日志保留诊断，新建空库后完整重跑通过。
- 上述在线备份不是跨 A/B 的全局停写快照；未修改小程序源码，未切换生产连接，未重启生产服务。

### 真实应用与恢复验收

1. 从当前 API 版本的已验证代码备份恢复到 `/var/tmp/qaxc-app-acceptance-20261105t081800z/release`，数据库适配补丁 `git apply --check` 通过，只应用到该副本。新增 `pg_storage.py`，未修改副本中的小程序源码。使用服务器现有虚拟环境和锁定依赖，未安装或修改生产依赖。
2. 环境仅提供测试所需变量；A/B 都指向演练库 `qaxc_rehearsal_20261105t080321z`，schema 分别为 a/b。同库校验通过。身份配置为隔离测试身份，不调用主平台真实鉴权接口。Python 测试进程加了仅允许 loopback 连接的保护；worker 只消费每项测试的专用队列，不启动生产 worker。
3. `b-risk-knowledge/tests/test_a_v1_flow.py` 的专用库保护在副本中改为上述明确演练库名，其余测试逻辑不改。**6 项通过，无失败、错误或跳过**：真实接入/退出登录后后台处理/旧版本/复盘/撤回；幂等与权限；失败重试/并发/依赖/B 撤回；知识发布与回查/训练权限/源撤回；缺失附件与复盘重试；真实 Cookie 代理/CSRF/即时撤权。
4. TAT `inv-was7cu0inw`，44 秒，退出码 0。日志、JUnit XML、契约证据与摘要均留在该受限隔离目录。测试新增数据只在演练库中，原始备份未改。
5. 从未应用数据库适配补丁的 API 原版代码归档恢复到 `/var/tmp/qaxc-recovery-acceptance-20261105t082946z/old-release`，A 使用回滚 SQLite 的新副本，B 使用 `qaxc_restore_20261105t080321z` 的 public 业务表。分别启动新旧两个真实统一 ASGI 服务（随机本机端口，依次启动并停止），登录、读取 9 份报告、B 身份代理、原附件内容哈希均通过；首次可用约 1.38 秒/1.34 秒。**这些启动耗时不是生产切换/回滚窗口承诺。**
6. 旧版代码在恢复库上再次运行上述 6 项真实业务流程，全部通过，无跳过。TAT `inv-0as7pv0ss1`，80 秒，退出码 0。证据位于 `/var/tmp/qaxc-recovery-acceptance-20261105t082946z`。
7. 最终复核原始完整备份未变、当前生产关键源文件哈希未变、qaxc-test 与 qaxc-b-worker 均 active、生产 API PID 未变；根盘剩余 35.95 GiB。测试服务已退出。旧 worker 原目录仍留在生产中，正式切换时须将 API/worker 一起指向经验证的同一发布副本，不能只改 API。

本轮服务器验收基于实际生产数据库结构与备份，新增业务流使用合成数据和隔离身份。没有执行真实主平台账号/微信真机的生产验收，也没有正式切换。生产副本包含私有数据，保留在服务器 0700 目录，不进入 Git。

## 已实现的范围

- A 增加可选 `QAXC_DB_URL`、`QAXC_DB_SCHEMA=a`；未配置时仍使用原 SQLite。SQL 改为两种数据库均支持的显式 upsert；保留 HTTP 地址、字段、鉴权、照片、报告和离线幂等规则。
- A 的 PostgreSQL `payload/result` 使用 JSONB，适配层保持原业务代码读取 JSON 字符串的行为。任务隐式 `rowid` 转为内部 `_row_order`，不向客户端返回该内部列。
- B 增加 `B_DATABASE_SCHEMA=b`，默认仍为 `public`。schema 缺失时拒绝静默落到 `public`。统一服务在启用 A PostgreSQL 后核对 A/B 的实际数据库地址、端口、库名和 schema，拒绝两边指向不同数据库。
- B 业务表迁入 `b`；A 业务表迁入 `a`。现有 Procrastinate 队列表/函数、pgvector 扩展暂留 `public`，避免破坏队列函数引用。B 的 API 和 worker 都需要配置业务 schema；不能把数据库角色的默认 search_path 改成 b 来代替应用配置。
- 本阶段保留 A 原 `BEGIN IMMEDIATE` 的串行写语义：PG 用事务级 advisory lock 防止 JSON 整行读改写丢失更新。这是兼容迁移，**尚未宣称提升 A 并发写吞吐量**。
- 会话仍使用原内存实现。共享会话、多 API 实例和滚动升级未交付，不应在此阶段增加 API worker 数量。

本次工具仅支持现有 SQLite 的表、主键、唯一约束和简单外键；遇到默认值、自定义索引、视图、触发器、复合/级联外键时停止，要求显式补充迁移。不能遇到新结构就跳过它。

## 备份工具

`tools/database_backup.py`：SQLite Online Backup API、一致性及外键检查、逐表规范化内容摘要、A 附件引用/哈希、B 同一导出快照下的 pg_dump 与逐表摘要、A/B 附件目录拷贝及二次哈希。成功后才生成 `manifest.json`；半成品不能作为演练输入。

备份源按只读方式访问。不得覆盖已有备份，不能把备份目录放进源附件目录。连接串通过受保护环境变量传入，命令行和结果不打印密码。生产副本只应留在授权服务器及批准的备份位置，不随源码推送。

服务器路径已核对；下列命令仍以占位符保留，后续执行需选新的备份目录，不能覆盖本轮验收产物。

```bash
# 在服务器受保护环境中设置 QAXC_BACKUP_B_URL，不在聊天/命令历史打印它。
python platform-module/tools/database_backup.py \
  --a-data /var/lib/qaxc-test \
  --b-storage /REPLACE_VERIFIED_B_STORAGE \
  --destination /var/backups/REPLACE_NEW_BACKUP_DIRECTORY

python platform-module/tools/database_backup.py --verify /var/backups/REPLACE_NEW_BACKUP_DIRECTORY
```

默认必须包含 A+B；仅做 A 备份须显式加 `--a-only`。每个数据库快照内部一致，但线上 A、B 和附件分别取快照，**这不是可直接用于正式切换的全局停写快照**。正式切换需要停止相关写入口和 worker 后再取得最终快照，并核对引用。定时备份、异机副本、物理基础备份/WAL 归档尚未在服务器安装或验收。

## 隔离迁移

`tools/database_rehearsal.py` 只接受本机回环地址、显式目标库名与实际连接库名一致的空库。库名必须以 `qaxc_rehearsal_` 或 `qaxc_restore_` 开头。脚本不创建/删除数据库，不改生产配置、不重启服务；由操作者先创建独立空库，并设置受保护的 `QAXC_REHEARSAL_URL`。

```bash
python platform-module/tools/database_rehearsal.py \
  --backup /var/backups/REPLACE_NEW_BACKUP_DIRECTORY \
  --target-name qaxc_rehearsal_REPLACE_LOWERCASE_ID \
  --output /REPLACE_NEW_REHEARSAL_DIRECTORY
```

实际步骤：验证备份 → 还原完整 B dump → 核对 B 原始摘要 → 创建 a/b schema → 迁移 B 业务表 → 迁入 A 结构和数据 → 核对两边逐表摘要 → 检查成果关联 → 反向导出新的 SQLite 并核对 → 复制和验证附件。失败的测试库保留诊断，不自动清空后重跑；下一次使用新库。

这只迁移当前旧布局（A SQLite、B 业务表位于 public），不是任意数据库的通用迁移器。历史报告库不在本次输入范围内，未访问、搬迁或重建。

## 回滚边界及演练

未接受新写入之前，可以在停写状态下恢复旧程序与对应最终快照。已经接受新写入之后，**不能直接切回迁移前 SQLite**。

`--rollback-target-name` 演练后一种情形：在隔离服务与 worker 已停写、附件已冻结时，对当前合并库做新 dump，恢复到另一个全新测试库，将当前 A 数据反向导出到新的 SQLite，把 B 表移回 public，核对当前数据摘要和附件引用。结果为恢复材料，不会替换任何正在使用的文件或数据库。

```bash
# QAXC_REHEARSAL_URL 指向当前演练合并库；QAXC_RESTORE_URL 指向另一独立空库。
python platform-module/tools/database_rehearsal.py \
  --backup /var/backups/REPLACE_ORIGINAL_VERIFIED_BACKUP \
  --target-name qaxc_rehearsal_REPLACE_LOWERCASE_ID \
  --rollback-target-name qaxc_restore_REPLACE_LOWERCASE_ID \
  --a-uploads /REPLACE_CURRENT_REHEARSAL_A_UPLOADS \
  --b-storage /REPLACE_CURRENT_REHEARSAL_B_STORAGE \
  --output /REPLACE_NEW_ROLLBACK_DIRECTORY
```

已执行“旧 API 备份版本从恢复材料启动并完成上述六项业务流程”的生产副本验收；不会承诺固定 10 分钟回滚。备份文件和附件必须成套恢复，B 后台任务应在核对队列状态后再启用，避免错误重放。后续接口测试产生的合成数据晚于第一次数据库回滚快照；不能把该较早快照误称为包含所有后续测试写入。

## 本机验证结果

便携 PostgreSQL 16.15，仅监听 `127.0.0.1:55449`，采用独立随机凭据；无系统服务注册。数据均为程序生成的模拟记录，不是服务器数据。测试依赖位于忽略目录 `.local/rehearsal-python`，不更改生产依赖锁文件；生产锁定版本还需在服务器副本环境复验。

| 验证 | 结果 | 边界 |
| --- | --- | --- |
| 备份异常、真实 PG 迁移/反向恢复、同库校验 | 14 项通过 | B 使用代表性项目/接入表及队列占位表，未运行完整 B worker/向量索引 |
| 现有 A 身份、告知单、报告、负责人接口 | SQLite 下 63 次通过；PG 下 63 次通过 | 包含继承测试重复执行，不是 126 个独立业务场景 |
| 未修改的小程序离线/登录逻辑 | 13 项通过 | 包含真实本机 HTTP → PG 的照片上传、响应丢失重试、去重；不是微信真机验收 |
| B 实际 SQLAlchemy schema 配置 | 通过 | 读到 b 的同名表；schema 缺失拒绝；A/B 不同库拒绝 |
| A/B 同一 SQL 事务故障注入 | 通过 | 两个 schema 中写入共同回滚；现有跨模块 HTTP 调用不会自动变成同一事务 |
| 写入后恢复 | 通过 | A/B 分别新增模拟记录，最新 dump 克隆后 A 反向导出、B 恢复 public，新增记录均保留 |

最终本机产物（被 Git 忽略）：`.local/rehearsal-944effe570a6/`，含 backup、restored、rollback 目录及校验记录。旧演练目录保留诊断。测试时曾发现地址返回 `127.0.0.1/32` 的防误连检查问题，已改用 `host(inet_server_addr())` 并通过复验。SQLite INTEGER 迁入 BIGINT，保留 64 位整数范围；参数适配已验证包含百分号和问号的 SQL 字面量。

## 正式切换前制定的操作边界（历史记录）

以下为正式切换前制定并据此执行的操作边界；实际切换结果以本文顶部记录为准。定时备份、异机副本/PITR、共享会话、多实例和更高并发不属于本轮已交付能力。

1. 将本记录交用户审阅，**另获正式切换确认及维护窗口后**才停止任何线上服务或改生产配置。推荐新建干净的正式合并库，保留旧 SQLite 与 qaxc_b 作为恢复来源；不得把含合成数据的演练库直接作为生产库。
2. 切换前重新核对线上发布哈希、磁盘空间和写入/队列状态；API 与 worker 必须使用同一经验证的发布版本。保留原服务配置和代码路径；本轮没有提交新的生产 unit/env。
3. 在批准的停写窗口排空或明确处理在途任务，再暂停 API 写入及 worker，取得最新 A/B/附件成套快照并验证。不能使用本轮 15:22 的在线备份覆盖其后真实新增数据。
4. 恢复到全新正式目标库、建 a/b schema、迁移并完整对账，配置 A/B 同库不同 schema；保留 public 队列/扩展，附件仍用既定受控目录。预建 vector 并跳过恢复注释，不修改现有角色为超级用户。
5. 单进程启动统一 API，检查主平台实际登录、报告/整改/照片/离线重试及 A→B 联动，再启用指向同库的 worker。维护期间短时不可用，现有内存会话在重启后需重新登录；不改小程序源码、域名或接口协议，因此本次方案不需要重新上传小程序版本。
6. 未接收新写入时可恢复旧配置及最终快照；接收新写入后必须再次停写，按已验收的最新快照反向导出 A SQLite 并恢复 B public 业务表，成套恢复附件，核对后启动旧版服务。不得直接切回旧 SQLite 丢弃新写入。
7. 正式切换验证后按仓库 AGENTS.md 推送对应发布源码至 `codex/ab-fusion-integration` 并报告 commit；当前只有隔离副本应用补丁，生产发布尚未执行。

小程序目录原有用户配置改动保持原样，本次未写入小程序源码，也未上传、提交或审核小程序版本。
