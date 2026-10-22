# Weixin-Mini-Program

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
