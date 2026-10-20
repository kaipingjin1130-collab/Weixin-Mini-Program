# 用于离线合同验证的上游快照

下载日期：2026-10-20。因联网pip安装未完成，改用已有缓存的jsonschema/PyYAML，以及以下上游源文件；没有重写规范化库或自行设计OpenAPI元Schema。

- `rfc8785.py`：来自 https://raw.githubusercontent.com/trailofbits/rfc8785.py/main/src/rfc8785/_impl.py ，保存完整251行实现，只改变文件名以便本地导入，不修改实现内容。Apache-2.0，许可证在`RFC8785-LICENSE`。此为源码快照，不宣称已安装某个发行版。
- `openapi-3.1-schema.json`：来自 https://raw.githubusercontent.com/python-openapi/openapi-spec-validator/master/openapi_spec_validator/resources/schemas/v3.1/schema.json ，保存完整1449行；`$id`为`https://spec.openapis.org/oas/3.1/schema/2022-10-07`。许可证在`OPENAPI-LICENSE`。

来源经网页读取工具获得，抽取连续行并检查无缺行及重叠一致性。具体文件SHA256在最新验证报告中记录。主分支地址可能变化，本地快照和记录的摘要才是本轮复现依据。后续升级必须明确更换来源并重跑测试。

OpenAPI元Schema验证文档结构，不独自覆盖嵌入Schema或所有规范语义，因此校验脚本另外检查8份Schema合法性、OpenAPI与独立Schema一致性、全部本地引用、样例、引用关系及版本行为。未调用完整openapi-spec-validator包，不将其标为已执行。
