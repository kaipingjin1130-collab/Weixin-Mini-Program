"""Minimal standards-compliant Word export without an external document service."""
from io import BytesIO
from zipfile import ZipFile, ZIP_DEFLATED
from xml.sax.saxutils import escape

LABELS = {'description':'隐患描述','occurred_on':'事件日期','stage':'阶段','object_name':'作业对象','category':'主分类',
    'subcategory':'子分类','classification_reason':'分类依据','original_risk':'原始等级','reviewed_risk':'核查等级',
    'risk_reason':'调整依据','status':'闭环状态','records':'检查整改复查记录','background':'背景','claims':'事实与分析',
    'differences':'差异及适用边界','limitations':'限制','missing':'待补充','preparation':'准备','implementation':'实施',
    'risk_control':'风险控制','acceptance':'检查验收','emergency':'异常处置','conditions':'项目条件','steps':'步骤映射',
    'parameters':'关键参数','evidence':'来源依据','quote':'原文摘录','locator':'位置','nature':'性质','text':'内容',
    'stem':'题干','answer':'答案','explanation':'解析','rubric':'评分要点','options':'选项','point':'考点','role':'岗位'}


def paragraphs(value, prefix=''):
    if isinstance(value, dict):
        for key, item in value.items():
            yield from paragraphs(item, (prefix + ' / ' if prefix else '') + LABELS.get(key, key))
    elif isinstance(value, list):
        for n, item in enumerate(value, 1):
            yield from paragraphs(item, prefix + ' ' + str(n))
    else:
        yield prefix + '：' + ('待填' if value is None else str(value))


def make_docx(row):
    lines = [row.title, '版本：' + str(row.version) + '；状态：' + row.state,
        '已发布成果仍须按企业制度专业签认。' if row.state == 'published' else '草稿/非发布版本，不得用于现场执行。',
        '项目：' + row.project_id, '固定版本ID：' + row.id, *paragraphs(row.content)]
    body = ''.join('<w:p><w:r><w:rPr><w:color w:val="000000"/><w:rFonts w:eastAsia="宋体"/><w:sz w:val="22"/></w:rPr><w:t xml:space="preserve">' + escape(line) + '</w:t></w:r></w:p>' for line in lines)
    document = '<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' + body + '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body></w:document>'
    output = BytesIO()
    with ZipFile(output, 'w', ZIP_DEFLATED) as archive:
        archive.writestr('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
        archive.writestr('_rels/.rels', '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
        archive.writestr('word/document.xml', document.encode('utf-8'))
    return output.getvalue()
