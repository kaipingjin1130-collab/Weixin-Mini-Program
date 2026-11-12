# 质量安全小察 · ABversion

2026-11-12：临时巡查直达拍照录入、单份 Word 合并报告及被检查单位负责人签字同步，见 [更新说明](platform-module/MOBILE-COMBINED-REPORTS.md)。

2026-10-30：新增可选巡查负责人、站内待阅及多成员报告汇总，使用与部署见 [负责人汇总说明](platform-module/LEADER-REPORTS.md)。
2026-10-30 新增开发入口：[知识管理融合版AI-Coding开发方案](知识管理融合版AI-Coding开发方案.md)。融合新建设方案全部要点，包含平台内dsh及组件改造任务。规范原文与版本首包已实现，实际验证与后续任务以该文档执行记录为准；以下内容保留历史说明。

本分支整合小察平台 A 与 `new-agent` 的 B 模块（基线 `397c58ad0259d428a10965096f07444aa01a79cf`）。

- `platform-module/candidate/`：线上小察服务源码、现有账号适配、B 同源代理和六个左侧菜单入口。
- `platform-module/miniprogram/`：平台小程序源码；`local-inspector/` 保留独立版 A 源码与测试。
- `b-risk-knowledge/`：历史资料治理、知识加工与检索、归档成果接入、复盘和培训学习。
- `platform-module/deploy_ab.py`：服务器安装、隔离测试、备份切换与回退脚本。
- [整合说明与部署记录](AB-INTEGRATION.md)。

正式模式继续使用小察现有登录和项目权限；不初始化演示账号或演示数据。数据库、上传资料、服务密钥、模型密钥和虚拟环境不进入 Git。

以下为上游 B 模块的开发说明，演示身份和启动脚本仅适用于本地开发环境。

## B模块：工程风险知识与复盘培训中心

本分支保存B模块源码、开发任务和B00接口合同。B01—B07已完成对应本地验证，支持历史数据治理、知识加工审核、发布检索、模拟A任务包接入、过程复盘/经验候选及培训学习记录；A/B合同仍为 `proposed`。当前使用模拟资料与身份；已支持配置云端兼容模型，真实服务和模型效果未验收，真实A尚未联调。

- [开发总索引与AI启动指令](B模块开发文档/README.md)
- [A/B接口约定](B模块开发文档/02-A-B接口约定.md)
- [B00合同、Schema与样例](b-risk-knowledge/contracts/README.md)
- [本地验证报告](b-risk-knowledge/contracts/reports/validation.md)
- [待A确认事项](b-risk-knowledge/contracts/decisions.md)
- [B模块运行与使用](b-risk-knowledge/README.md)
- [B05任务包接入与AI交接](b-risk-knowledge/reports/B05-design-and-use.md)
- [B05给A的接口说明](b-risk-knowledge/reports/B05-A-integration.md)
- [B06过程复盘、经验草稿与AI交接](b-risk-knowledge/reports/B06-design-and-use.md)
- [B06验证记录（44项完整检查）](b-risk-knowledge/reports/B06-validation.md)
- [B07培训、云端知识加工与AI交接](b-risk-knowledge/reports/B07-design-and-use.md)
- [知识萃取开源评估](b-risk-knowledge/reports/B07-open-source-and-extraction.md)
- [B07验证记录](b-risk-knowledge/reports/B07-validation.md)

合同样例为模拟数据。仓库不包含原始报告、业务数据集、Python环境或临时下载文件。文档中的本机资料路径是来源参考，其他机器须配置自己的路径。

校验方法及锁定依赖见合同目录README。对已有成果修改前，先阅读开发总索引和对应任务包，不覆盖历史人工修改。
# 风险数据（历史报告可编辑核验）

本机入口：`http://127.0.0.1:18771/quality/#/b/records`，或“知识管理 → 风险数据”。支持“历史报告 / 问题条目 / 修改日志”三个视图：按项目与关键词筛选、勾选显示字段、编辑14个业务字段、草稿批量确认后覆盖解析成果库、修改日志可追溯。详见 [历史报告核验说明](platform-module/HISTORY-REVIEW.md)。

读取：现有系统仍连接 `fusion`；独立读取 `risk_history_20261102_v4` 和 `.local/history-storage`。读取端仅允许本机融合测试管理员，使用独立 `ab_history_reader` 数据库账号，仅授予8张相关表的 SELECT，默认只读事务，查询限时5秒、锁等待限时0.5秒，连接池最多2个连接。不运行解析库迁移、初始化或后台任务。

写入：人工修改先保存为待确认草稿（`history_review_drafts`），批量确认后覆盖解析成果库 `history_findings` 对应行，并写 `history_review_logs`（保存/确认/放弃/冲突均记录前后值与操作人）。问题描述不能为空；草稿保存后值被他人改动的条目会转冲突、不覆盖；不新建/删除隐患行，不迁移旧确认。写入连接在 `b-risk-knowledge/.local/history-review.json`（本地凭据，不提交）；服务器用 `platform-module/tools/setup_history_editor.py` 生成最小权限 `ab_history_editor` 角色与复核表。

验证：`b-risk-knowledge/tests/test_history_reader.py` 的6项只读集成检查通过；`b-risk-knowledge/tests/test_history_review.py` 的5项（列表/筛选/草稿/批量确认/冲突与日志）通过。前端 TypeScript 与两种入口构建通过；`platform-module/build_frontend.py` 已重新产出 `platform-module/b-web` 与 embedded 资源，内嵌包包含“历史报告/批量确认”功能。
