# 隐患清单与手机填写更新

## 2026-10-30 Word 模板样式修正

网页报告下载和小程序现场简报 Word 共用原告知单模板：保留公司标识、页眉文件版本号、黑色表框、首页合并单元格、签字日期栏和照片附件；编号栏灰底与用户截图一致。首页标题按最新要求为“第三方巡查隐患告知单”，附件为“隐患清单”，文件名仍采用告知单编号。所有示例业务数据与示例隐患照片均已从运行模板删除。

新增 `candidate/notice_docx.py` 和 `candidate/templates/hazard-notice.docx`，更新 `candidate/server.py`。这次仅影响服务器 Word 导出，小程序 1.0.3 不需要重新打包。既有报告再次下载时也使用新版模板，原始报告数据不改动。网页 HTML 报告详情不等同于 Word 排版。

模板回归 4 项、告知单及继承集成测试 37 项、平台集成测试 9 项通过。代表样例 4 页、全空白样例 2 页、长文本多照片样例 6 页均通过 Word 实际渲染与逐页检查。云端部署状态以另行记录的部署回执为准。

2026-10-30

小程序现场巡查及网页“新建巡查”增加告知单编号、项目名称、项目进度、委托单位、建设单位、施工单位、监理单位、检查时间、事由、受检人员及日期。巡查业务字段、隐患文字、图片和签名均可留空；仍按项目权限保存，每条隐患独立关联图片。空白清单不自动宣称“未发现隐患”。已填写签名仍校验签名人与检查人员名单一致。

Word 导出标题为“隐患清单”，包含序号、隐患问题描述、影像资料三列表格。文件名优先采用告知单编号，例如 `20260922-三林项目-06.docx`；留空时使用原系统巡查编号。非法文件名字符会替换，中文下载头使用 UTF-8 编码。小程序先保存同名本地文件再打开分享。

小程序固定服务地址为 `https://fxbxcx.jkec.info/quality`，登录页隐藏地址。仅成功登录后在微信本地存储中记住账号密码；失败不覆盖记忆，提供清除入口。密码不进入源码或日志。有效会话继续沿用。

现场检查上报区域增加可选项目负责人，可在提交时选择本项目既有账号。上报事务内校验负责人项目权限并写入快照；负责人通过原平台账号登录小察后可见站内待阅。此功能不是微信订阅消息，不发送短信或邮件。隔离测试使用原账号认证适配的模拟返回值；未发送生产测试报告。

离线草稿支持告知单字段和全选填采集；同步后可在现场任务提交区域选择负责人。手机按钮最小高度为 88rpx，保留逐条拍照和相册入口。

## 验证与发布顺序

执行 `python platform-module/tests/test_notice.py`、`python platform-module/test_integration.py`，以及 `node --test platform-module/tests/remember-login.test.cjs platform-module/tests/leader-field-client.test.cjs platform-module/tests/report-catalog.test.cjs platform-module/tests/login-errors.test.cjs platform-module/tests/offline.test.cjs platform-module/tests/offline-http.test.cjs`。

先部署 `candidate/server.py`、`candidate/workflow.py`、新增 `candidate/notice.py` 和 `candidate/web/app.js` 到实际运行目录，备份源码与 SQLite 数据后重启既有服务；不要覆盖账号、附件、环境配置或数据库。随后编译上传 `platform-module/miniprogram`，拟用版本号 `1.0.3`。仅上传源码不等于后台部署或微信提交审核。

本轮 Word XML、图片封装与中文文件名已做自动检查。打包文档渲染器因缺少 LibreOffice 无法运行，发布前仍需核验实际 Word 排版和微信编译、真机功能。发布结果以实际后台记录为准。

## 2026-10-30 后台部署核验

已核对线上部署回执：源码提交 `9c1bb3a` 部署成功，服务 `qaxc-test` 为 `active`，未登录接口返回401。实际目录 `/opt/qaxc-fusion-a1b9411/platform-module/candidate`，备份 `/var/backups/qaxc-notice-20261030-180206`。四个文件摘要与本次部署清单一致。

部署前后业务数量一致：项目1、用户5、成员关系2、巡查报告7、任务15、现场报告4、成果10、证据26。公网页面返回200并包含告知单字段及隐患清单。微信编译上传及审核仍须另行完成，不计入后台部署结果。
