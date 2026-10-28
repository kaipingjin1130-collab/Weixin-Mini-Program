# 质量安全小察 · ABversion

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
