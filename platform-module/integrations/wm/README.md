# WM 互通接入包（未部署）

源平台核对目录：`D:\integration`。只读取源码，以隔离副本测试；未修改该目录、旧数据库或正式服务。

## 文件与身份

- `qaxc_auth.py`：未来放入 `wm/app/qaxc_auth.py`。
- `auth.patch`：基于本次读取的 `wm/app/auth.py`，加入服务签名身份入口。先在源码副本执行 `git apply --check --ignore-space-change auth.patch`，通过后再应用。CRLF 文件需要 `--ignore-space-change`。
- 原浏览器登录保持原有流程。互通请求仍通过 `ExternalIdentity`、账号 active 状态、角色权限和项目 ACL；不按姓名匹配、不自动开户，也不把小察管理员自动当成 WM 管理员。

服务签名覆盖时间戳、账号、HTTP 方法、路径（含查询串）和请求体 SHA-256。允许 60 秒时钟差，禁止重定向。创建任务沿用 WM 的持久化 `client_request_id`，更新沿用 `expected_revision`；不绕过原来的并发检查。

## 配置（示例占位值，不是真实账号或密钥）

小察服务环境：

```text
QAXC_WM_URL=http://127.0.0.1:19018
QAXC_WM_BRIDGE_KEY=<至少32字符的独立随机密钥>
QAXC_WM_PERSON_IDS={"host:admin:123":456}
```

WM 服务环境：

```text
WORKLOAD_QAXC_BRIDGE_KEY=<与小察一致的独立随机密钥>
WORKLOAD_QAXC_SUBJECTS={"host:admin:123":"user:789"}
```

先核对真实老平台 `admin_user` 与业务用户关联，以及 WM `ExternalIdentity` 中 `issuer + subject → person_id`。上面 123、456、789 不可当作实际映射使用。现有 `WORKLOAD_AUTH_ISSUER` 等正式认证设置仍然必需。只通过受控内网或 HTTPS 使用互通接口；不要把密钥放进小程序或提交到 GitHub。

在小程序“项目用工”配置老平台正式合同目录 `catalog_id` 和合同每次人数要求。为避免自动导入重复，一个 WM 合同目录只能绑定一个小察项目；合同内多个具体工地用任务的工地字段区分。需要多项目归集的情况须先明确映射，不能凭同名推断。

## 显式服务操作

以下是未来隔离或正式配置完成后的操作示例，本次没有执行任何正式端命令：

```powershell
# 推送已提交的计划 / 最终名单 / 实际人员；失败保留队列
python tools/mobile_services.py sync --data <明确的数据目录> --actor host:admin:123

# 从老平台拉取所选合同日期范围内尚未计量的任务
python tools/mobile_services.py pull --data <明确的数据目录> --actor host:admin:123 --project <小察项目ID> --leader <小察组长ID> --start 2026-11-16 --end 2026-11-22

# 工作认定后，且最新实际名单已同步，显式传送已发布Word成果
python tools/mobile_services.py archive --data <明确的数据目录> --actor host:admin:123 --task <小察任务ID>

# 发送待处理微信订阅提醒
python tools/mobile_services.py push --data <明确的数据目录> --actor host:admin:123
```

同步服务账号必须有相关项目访问权限，出站业务操作使用该任务操作人的身份重新核验；原平台仍可能因角色权限拒绝操作。成果归档遵循 WM 原成果规则，不强制改写 WM 状态。报告未工作认定或最新名单未同步时禁止上传成果。成果上传响应丢失标记 `uncertain`，必须核对 WM 文件及任务修订后再决定处理，避免重复归档。

导入只接受已有明确账号映射且在小察项目中具有检查角色的成员；无法映射的任务 ID 列在输出中。导入任务仍要求个人接单和组长确认名单，不能把旧平台已排班等同于本人已接单。已计量历史任务不转成新任务，其统计通过老平台读取入口查询。已关联任务的外部修订变化报告冲突，当前版本不自动合并两端同时修改。

当前任务没有安装常驻同步服务或调度器。若后续启用自动同步，应分别周期运行上述有界单次任务，保留运行结果监控；同一数据目录使用独占锁，避免多个同步进程重复发送。异常退出残留锁文件时须先核对进程。

## 微信订阅消息

```text
QAXC_WECHAT_APP_ID=<小程序AppID>
QAXC_WECHAT_APP_SECRET=<服务端AppSecret>
QAXC_WECHAT_TEMPLATE_ID=<已审核任务通知模板ID>
QAXC_WECHAT_TEMPLATE_FIELDS={"thing1":"title","date2":"date","thing3":"event"}
QAXC_WECHAT_STATE=developer
```

字段 ID 必须与实际审核模板一致；上面仅为示例。客户端通过用户主动点击调用 `wx.requestSubscribeMessage`，随后 `wx.login` code 在服务端兑换身份。默认消息跳转开发版的任务详情，不默认使用正式版。站内提醒不受订阅授权影响。

参考微信接口：[客户端订阅](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/subscribe-message/wx.requestSubscribeMessage.html)、[服务端发送](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/mp-message-management/subscribe-message/sendMessage.html)。模板配置和实际送达须后续真机验证。

## 隔离接口测试

把 `D:\integration\wm\app` 和 `tests` 复制到一个新的隔离目录，应用本包认证补丁；不得复制 `data`、`secrets` 或生产配置。安装 WM 自己的 requirements 和测试需要的 httpx 后，设置 `WM_TEST_SOURCE` 指向该隔离目录，运行 `platform-module/tests/test_mobile_wm_contract.py`。

该测试直接运行 WM 原 ASGI 路由和临时 SQLite，验证签名请求的创建、幂等重放、人员变更、修订冲突、合同关联、工作量读取与原权限拒绝；不访问服务器。源码副本的合同计量回归另行验证。
