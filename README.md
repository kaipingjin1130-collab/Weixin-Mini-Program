# 质量安全小察 · Beta 源码

本快照对应北京时间 2026-10-27 晚至 2026-10-28 凌晨的开发版本，小程序上传版本为 1.0.2。

- `local-inspector/`：完整微信小程序、独立本地平台、文档及测试。微信开发者工具导入 `local-inspector/miniprogram`。
- `platform-module/candidate/`：接入原平台的网页、Python 后端与统一账号认证适配，是本次线上 `/quality/` 模块对应源码。
- `platform-module/miniprogram/`：同一版完整小程序源码，供模块集成测试使用。
- `platform-module/QaxcAuthController.php`、`qaxc-route.php`：原平台认证桥接，包含凌晨修复的登录摘要处理。

独立运行方式见 `local-inspector/README.md`。集成运行需设置 `QAXC_ROOT_PATH=/quality`、`QAXC_AUTH_URL` 和 `QAXC_AUTH_KEY`；认证密钥由部署环境提供，不能提交到仓库。PHP 桥接需按原平台路由与内部访问限制配置。

本次仅归档源码，不执行服务器部署。数据库、上传照片、真实账号、运行日志、本机私有配置及部署凭据不包含在此仓库。

验证命令（在仓库根目录执行）：

```sh
python platform-module/test_integration.py
node --test platform-module/tests/offline.test.cjs platform-module/tests/offline-http.test.cjs
```

HTTP 集成测试当前使用原开发机的 Python 路径，其他环境需先调整测试中的解释器路径。手机端完整离线同步仍需实机验收。
