# 风险数据 · 历史报告（可编辑核验）

在 B 模块“风险数据”中增加“历史报告”视图，用于存放和人工核验这段时间解析的历史报告；数据源为解析成果库 `risk_history_20261102_v4`，**暂不做迁移**，部署到服务器时再随库上传/配置。

## 交互说明

- **列拖拽**：拖动表头可调整列顺序，“操作”默认排在最后；顺序保存在浏览器本地，可在“显示字段”面板中“恢复列顺序”。
- **列宽调节**：拖拽表头右侧边缘可手动调宽/调窄每一列（56–1000px，拖动 1:1 跟随鼠标，首次拖动会按当前实际渲染宽度锁定各列，避免跳变）；**双击该列边缘可恢复该列默认宽度**；列宽保存在浏览器本地，可在“显示字段”面板“恢复列宽”。表格区域高约 64vh 内滚动，表头固定在顶部，支持横向滚动。
- **操作列**：使用图标（编辑 / 查看证据 / 展开收起）代替文字，减少宽度占用；鼠标悬停显示名称，按钮带 aria-label。
- **顶部行标签**：内嵌页面中“数据来源 / 历史项目 / 风险数据”三个入口已并入 A 平台顶栏一行（面包屑右侧，风险数据页高亮），B 模块自身的页头标题行在嵌入时隐藏，两个红框内容合并为一行。
- **搜索工具栏**：搜索、项目筛选、只看待确认、显示字段、展开全部字段在同一行，去掉独立“搜索”标签行，面板高度由约 166px 收紧到约 113px。
- **列显示/隐藏**：点击表头右侧 × 可隐藏该列；“显示字段”面板列出**全部可选列**（14 个业务字段 + 照片/来源报告/状态/操作），状态默认不显示，可勾选恢复。
- **展开全部字段**：点击工具栏“展开全部字段”可一次展开当前页所有记录；也可点击任意行或行内“展开”查看该条 14 个业务字段的完整内容，再次点击收起。
- **照片**：表格“照片”列显示该条关联照片数量，点“查看 N 张”弹出大图；展开行内也直接显示照片缩略图。照片数据已存放在解析成果库的 `history_images` / `history_image_occurrences` / `history_image_links` 及 `history-storage` 图片目录中，本次**未新增“照片”业务字段、未在本机写入照片数据**；按你的要求，等传到服务器后再决定是否写入。
- **证据查看**：点击“证据”在当前页弹出居中浮层（不跳转页面底部），可关闭或按 Esc 退出；浮层内可下载原件、查看字段、原文证据和关联图片。
- **来源报告**：点击“来源报告”列的报告名，会**在新页面打开报告查看页**（`/api/v1/history-reader/documents/{id}/view`）：PDF 直接在浏览器内嵌预览，图片直接显示，Word 等格式提示下载原件并展示该报告关联照片；查看页提供“下载原件/浏览器打开”。原“原件”下载保留。
- **表格布局**：表格固定列宽并自适应容器，超宽可横向滚动；项目名等短字段省略显示，**问题描述完整换行显示、不再截断**（行高随内容自适应），悬停仍可看完整文本。
- **页面宽度**：A 平台 `.main` 与 B 模块 `main` 均取消 1600px/1500px 最大宽度限制，页面随窗口宽度自适应，大屏下占满可用宽度（表格列多时横向滚动）。

## 功能

- **历史报告**：按项目/关键词筛选报告，查看该报告的问题条目，下载原件。
- **问题条目**：按项目、关键词、报告筛选；可勾选显示字段（新增/移除列，浏览器本地记忆）。
- **人工修改**：编辑 14 个业务字段 → 保存为“待确认草稿”；修改不会立即改库。
- **批量确认**：勾选草稿后一键确认，确认时把修改**直接覆盖**解析成果库对应 `history_findings` 行；值在草稿保存后被他人改过的条目会转冲突，不覆盖。
- **修改日志**：保存草稿、确认、放弃、冲突全部写 `history_review_logs`，可追溯修改前后值与操作人。
- 只允许 14 个业务字段；问题描述不能为空；所有列表/修改均校验本机管理员身份。

## 接口（B 模块 `/api/v1/history-review`）

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/summary` | 计数、可编辑字段、待确认数 |
| GET | `/projects?q=&limit=` | 项目/工程下拉（按条目数排序） |
| GET | `/reports?q=&project=&offset=&limit=` | 历史报告列表 |
| GET | `/reports/{document_id}/findings` | 某份报告的问题条目 |
| GET | `/findings?q=&project=&document_id=&offset=&limit=` | 问题条目列表（带 `draft_id` 表示有待确认修改） |
| POST | `/drafts` | 保存/合并草稿 `{finding_id, changes}` |
| GET | `/drafts` | 待确认草稿列表 |
| POST | `/drafts/confirm` | 批量确认 `{ids:[...]}`，覆盖数据库并记日志 |
| POST | `/drafts/discard` | 放弃草稿 `{ids:[...]}` |
| GET | `/logs?finding_id=&document_id=&offset=&limit=` | 修改日志 |

读取复用既有只读连接「`/api/v1/history-reader`」（`ab_history_reader` 角色）；写入走新的
`.local/history-review.json` 配置，本地开发用库所有者连接，服务器请用
`platform-module/tools/setup_history_editor.py` 生成最小权限 `ab_history_editor` 角色。

## 本地验证

```powershell
cd 开发/ABversion/b-risk-knowledge
$env:PYTHONPATH = ".;D:\工作\0课题、标准、书籍\2026年公司数智创新大赛\b-risk-knowledge\.venv\Lib\site-packages"
python -m unittest tests.test_history_review -v          # 5 项：列表/筛选/草稿/确认/冲突/日志
```

前端构建（部署页 `platform-module/b-web`）：

```powershell
cd 开发/ABversion
python platform-module/build_frontend.py                  # 需要 Node.js/npm；产出 b-web 与 embedded
```

本地融合预览（A 平台内嵌 B 页面）：`打开ABversion.cmd`，地址 `http://127.0.0.1:18771/quality/`，
登录后在左侧“风险数据”打开。

## 部署到服务器（待用户确认后执行）

1. 上传/迁移 `risk_history_20261102_v4`（含本功能的 `history_review_*` 表）与 `history-storage` 原件/图片。
2. 在服务器项目上配置 `b-risk-knowledge/.local/history-reader.json`（只读）与 `.local/history-review.json`（写入）；可运行 `setup_history_editor.py` 生成角色与配置。
3. 重新执行 `build_frontend.py` 并用 `deploy_ab.py prepare/check/activate` 发布 A/B 融合页；本地修改的数据随库一起上线。
4. 修改日志保留在库内，用于上线后的追溯；未确认的草稿不会生效。

## 限制

- 只覆盖解析成果库中的问题条目字段；不新建、不删除隐患行，不迁移旧确认。
- 合并展示（`history_current_consolidated_findings`）里的同隐患多来源条目，编辑写入主记录；如需逐来源编辑需后续扩展。
- 修改字段目前不做原文 OCR 证据回写；原文证据仍通过“证据”查看。
