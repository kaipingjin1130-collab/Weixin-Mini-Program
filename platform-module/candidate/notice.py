"""Optional notice metadata shared by inspection clients and Word exports."""
import re
from urllib.parse import quote

FIELDS = {'noticeNumber':'告知单编号', 'projectName':'项目名称', 'progress':'项目进度',
          'client':'委托单位', 'developer':'建设单位', 'contractor':'施工单位',
          'supervisor':'监理单位', 'inspectionDate':'检查时间', 'subject':'事由',
          'recipient':'受检单位人员', 'recipientDate':'受检日期'}

def clean(value):
    if not isinstance(value, dict):
        raise ValueError('告知单信息格式错误')
    result = {}
    for key in FIELDS:
        text = value.get(key, '')
        if not isinstance(text, str) or len(text) > 1000:
            raise ValueError('告知单字段应为1000字以内的文本')
        result[key] = text.strip()
    return result

def filename(value, fallback='隐患清单'):
    stem = re.sub(r'[<>:"/\\|?*\x00-\x1f]', '_', value or fallback).strip(' .')[:150]
    return (stem or '隐患清单') + '.docx'

def disposition(value, fallback='隐患清单'):
    return "attachment; filename=hazards.docx; filename*=UTF-8''" + quote(filename(value, fallback))
