# 工程风险知识与复盘培训中心｜B01—B05

本地基础工程、B02模拟数据接入、B03模拟知识加工/审核、B04发布检索及B05模拟A任务包接入已实现。B00合同保留在 `contracts/`；A身份、真实数据、模型和任务包尚未联调。原始报告和旧治理工作台没有改动。

B02入口：<http://127.0.0.1:5181/sources>，支持模拟CSV、Excel和治理导出接入、增量版本、证据与候选关联。已准备4个来源、10条模拟记录供试用。[操作步骤与架构](reports/B02-design-and-use.md)、[12项测试及浏览器验收](reports/B02-validation.md)。

当前导航：“历史数据治理”可展开数据来源、历史项目、风险数据。历史项目等同导入批次；风险数据支持报告展开和逐条视图，字段后续按用户数据调整。B03入口 <http://127.0.0.1:5181/quality>，[使用与AI交接指令](reports/B03-design-and-use.md)、[验证记录](reports/B03-validation.md)。

## 本机使用

1. 打开 Docker Desktop。
2. 双击项目根目录的 **启动B模块.cmd**。它启动独立数据库、后端、worker、前端，并打开网页。
3. 网页：<http://127.0.0.1:5181/workbench>。接口文档：<http://127.0.0.1:8181/docs>。
4. 使用右上角的模拟身份验证权限；点击“运行演示检查”，可选正常完成、自动重试、手动重试。
5. 结束时双击 **停止B模块.cmd**。只停止本项目记录的进程及其子进程，保留数据库和资料。

重复启动复用已记录进程。端口被无关进程占用时会报错，不强行终止。日志在 `.local/logs/`，本机配置在 `.local/config.json`，均不进入版本库。配置含随机数据库密码，不应分享。迁移反复运行安全，初始化不会恢复已撤销的角色。

## 新环境准备

需要已有 Python 3.12+、Node.js 22+ 和 Docker Desktop。当前实测 Node 24、PostgreSQL 15。在 `b-risk-knowledge` 下执行：

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install --no-cache-dir -r requirements.txt
cd frontend
npm ci --ignore-scripts --no-audit --no-fund
cd ..
powershell -NoProfile -ExecutionPolicy Bypass -File tools/start.ps1
```

启动脚本负责生成本地配置、创建带 B01 所有权标签的数据库容器、等待就绪、迁移和初始化。只管理 `risk-b01-postgres` / `risk-b01-pgdata`；数据库仅绑定 `127.0.0.1:55439`，不连接旧系统数据库。首次无镜像需下载 `pgvector/pgvector:0.8.7-pg15-trixie`，沿用原PostgreSQL 15数据卷；启动器仅升级本项目标签与卷均匹配的专用容器。

开发模式仅绑定本机，模拟身份没有密码。`B_ENV=production` 或非 mock 模式会拒绝启动；接入真实身份前不能把它部署为多人在线正式系统。

## 结构与扩展点

| 目录/文件 | 职责与后续复用方式 |
|---|---|
| `frontend/src` | React/TypeScript工作台、任务、权限页面；访问真实API，无假统计 |
| `backend/auth.py` | 集中身份解析与授权；后续替换A身份适配，保留 `Actor` 和 `authorize` |
| `backend/job_service.py` | 提交幂等、重试版本校验、业务对象与队列同事务 |
| `backend/queue.py` | Procrastinate注册任务与恢复；新增加工任务复用队列，不能另造调度器 |
| `backend/storage.py` | 受控路径与原子写入；B02通过文件ID接入证据，不向调用方暴露路径 |
| `backend/modules/ingestion` | B02三类文件接入、字段校验、增量版本、逐行恢复、证据与跨来源候选 |
| `backend/modules/knowledge` | B03质量问题、模拟适配、证据校验、卡片修订和审核 |
| `scene-packs/generic` | 版本化知识卡Schema和模板 |
| `fixtures/b02` | 明确标注的模拟CSV、XLSX、治理导出和证据示意图 |
| `backend/models.py` / `migrations` | SQLAlchemy业务表、Alembic迁移；队列表由Procrastinate管理 |
| `tests/test_foundation.py` | 真实数据库、worker、文件与权限集成测试 |
| `contracts` | B00对A合同；当前proposed，B04/B05接口已本地实现，真实A未联调 |

授权取“来源项目范围 ∩ B内角色”，撤权下一次请求立即生效。演示仅有固定 `demo-org`，多租户组织隔离不在本轮实现；接真实身份需补齐组织映射。权限不会因重新启动被还原。

提交的幂等键按操作者唯一，同键不同内容返回409；重试还要求当前 `row_version`。队列插入使用SQLAlchemy同一条psycopg物理连接，因此两者共同提交或回滚。worker心跳每2秒更新，10秒失联视为停滞；重启立即尝试恢复，常驻恢复任务每分钟检查。结果文件按任务固定路径原子写入，结果对象按任务唯一，重复执行不会多产出结果对象。队列采用至少一次执行语义，未来涉及外部副作用的任务仍须各自实现幂等。

新增任务须注册明确的任务类型、输入Schema、权限动作和结果适配，不接受任意函数名/文件路径。当前类型为 `demo_check`、`source_import`、`knowledge_generation`、`release_build`、`task_package_import`；生成当前为显式模拟，不包含OCR或真实模型风险判断。

## API（前缀 `/api/v1`）

| 接口 | 用途 |
|---|---|
| `GET /health`、`GET /me`、`GET /dashboard` | 服务状态、身份范围、真实数量 |
| `GET /jobs?kind=&status=&limit=&cursor=` | 授权范围内分页及筛选 |
| `POST /jobs` | 创建演示任务，要求 `Idempotency-Key` |
| `GET /jobs/{id}`、`POST /jobs/{id}/retry` | 详情、失败重试；重试要求幂等键和版本 |
| `GET /assets/{id}/content` | 授权、可用性、受控路径、哈希校验后下载 |
| `GET /access`、`POST /role-bindings`、`DELETE /role-bindings/{id}` | 项目角色维护；删除要求版本 |
| `GET /audit-events` | 管理员/审核员授权范围内的审计分页 |

详细请求与错误结构以运行中的 `/openapi.json` 为准。mock演示令牌为 `Bearer dev-admin` / `dev-processor` / `dev-learner` / `dev-outsider`，它们只是本地选择器，不是真实认证凭证。业务拒绝、校验与服务错误均携带 `request_id`。

## 验证

```powershell
.\.venv\Scripts\python.exe -X utf8 tools/check.py
cd frontend
npm run build
```

`check.py` 只重建保留给测试的 `risk_b_test` 数据库，不清空开发库 `risk_b`。不要把其他数据存入测试库。测试文件落在 `.local/test-storage`。

实际证据见 [B01验证报告](reports/B01-validation.md)、[B02验证报告](reports/B02-validation.md)和[B03验证报告](reports/B03-validation.md)。锁定后端依赖在 `requirements.txt`，前端在 `package-lock.json`。测试工具有一项 Starlette/httpx 弃用提醒，当前测试通过；不为消除提醒额外升级未验证的测试依赖。

下一步可执行B04，基于已审核修订和固定证据实现发布与检索。真实数据接入仍需先核对表头、身份和图片锚点，不能将本轮模拟验证当作真实数据验收。

## B04发布检索

入口：[已发布知识](http://127.0.0.1:5181/knowledge/library)、[发布管理](http://127.0.0.1:5181/releases)、[检索](http://127.0.0.1:5181/search)。已有一张通过原审核流程的模拟卡片已启用供试用。详见[设计、接口与AI交接](reports/B04-design-and-use.md)、[本地验证](reports/B04-validation.md)。当前使用真实pgvector存储和索引、模拟特征向量及事实摘录；没有接入真实LLM或训练语义模型。

## B05任务包接入

入口：[任务包清单](http://127.0.0.1:5181/task-packages)、[导入模拟包](http://127.0.0.1:5181/task-packages/import)。接入后自动校验附件、保存事件和版本；本机已保留v1/v2演示。见[使用与AI交接](reports/B05-design-and-use.md)、[A接口说明](reports/B05-A-integration.md)、[验证记录](reports/B05-validation.md)。当前只有模拟资料与身份，尚未连接真实A，未生成复盘或培训。
