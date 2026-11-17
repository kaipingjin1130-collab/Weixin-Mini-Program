"""Service-authenticated QAXC requests; WM's existing per-person ACL still applies.

Copy to wm/app/qaxc_auth.py and apply auth.patch. Disabled without a separate key.
Account bindings must be explicitly checked against ExternalIdentity, never names.
"""
import hashlib
import hmac
import json
import os
import re
import time
from fastapi import HTTPException


async def verify_qaxc(request):
    key=os.getenv('WORKLOAD_QAXC_BRIDGE_KEY','')
    actor=request.headers.get('x-qaxc-actor','')
    stamp=request.headers.get('x-qaxc-time','')
    signature=request.headers.get('x-qaxc-signature','')
    if len(key)<32 or not re.fullmatch(r'host:admin:[1-9][0-9]*',actor):
        raise HTTPException(403,'小察互通身份未配置')
    try:
        if abs(time.time()-int(stamp))>60: raise ValueError()
    except ValueError:
        raise HTTPException(403,'互通请求已过期')
    body=await request.body()
    if len(body)>20*1024*1024: raise HTTPException(413,'互通请求过大')
    target=request.url.path
    root=request.scope.get('root_path','')
    if root and target.startswith(root+'/'): target=target[len(root):]
    if request.url.query: target+='?'+request.url.query
    message='\n'.join([stamp,actor,request.method,target,hashlib.sha256(body).hexdigest()]).encode()
    expected=hmac.new(key.encode(),message,hashlib.sha256).hexdigest()
    if not hmac.compare_digest(signature,expected): raise HTTPException(403,'互通签名校验失败')
    subjects=json.loads(os.getenv('WORKLOAD_QAXC_SUBJECTS','{}'))
    subject=subjects.get(actor)
    if not isinstance(subject,str) or not re.fullmatch(r'(?:user|admin):[1-9][0-9]*',subject):
        raise HTTPException(403,'请先核对小察账号与工作量平台的身份映射')
    return dict(active=True,iss=os.environ['WORKLOAD_AUTH_ISSUER'],aud='workload-management',sub=subject)
