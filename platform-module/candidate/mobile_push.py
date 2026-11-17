"""Opt-in WeChat subscription binding and a durable notification delivery worker."""
import json
import os
from urllib.parse import urlencode
from urllib.request import Request, urlopen
import mobile_workflow as mobile


def config():
    template = os.getenv('QAXC_WECHAT_TEMPLATE_ID', '')
    return dict(enabled=bool(template and os.getenv('QAXC_WECHAT_APP_ID') and os.getenv('QAXC_WECHAT_APP_SECRET')),
                templateIds=[template] if template else [])


def call(path, query=None, data=None):
    url = 'https://api.weixin.qq.com/' + path + ('?' + urlencode(query) if query else '')
    request = Request(url, json.dumps(data, ensure_ascii=False).encode() if data is not None else None,
                      headers={'Content-Type':'application/json'})
    with urlopen(request, timeout=12) as response:
        value = json.loads(response.read(65536))
    if value.get('errcode'):
        raise ValueError('微信接口返回错误码 ' + str(value['errcode']))
    return value


def bind(w, d):
    if not config()['enabled']: w.fail('微信订阅消息尚未配置；站内任务提醒正常保留', 503)
    code = w.text(d, 'code', 256)
    try:
        session = call('sns/jscode2session', dict(appid=os.environ['QAXC_WECHAT_APP_ID'], secret=os.environ['QAXC_WECHAT_APP_SECRET'], js_code=code, grant_type='authorization_code'))
    except Exception:
        w.fail('微信身份核对暂不可用，请稍后重试', 503)
    openid = session.get('openid')
    if not openid: w.fail('微信登录凭据无效，请重试', 401)
    # Do not store session_key and never trust an openid supplied by the client.
    key = 'wechat:'+w.user['id']; old = mobile.setting(w, key)
    if old.get('openid') and old['openid'] != openid: w.fail('此平台账号已绑定其他微信身份，请由管理员核对', 409)
    for row in w.c.execute("SELECT id,payload FROM mobile_settings WHERE id LIKE 'wechat:%'"):
        if row['id'] != key and json.loads(row['payload']).get('openid') == openid:
            w.fail('该微信身份已绑定其他平台账号', 409)
    mobile.save_setting(w, key, dict(openid=openid, consent=d.get('accepted') is True, boundAt=w.s.now()))
    return dict(ok=True, accepted=d.get('accepted') is True)


def deliver(w, limit=30):
    if not config()['enabled']: return dict(sent=0, message='未配置微信订阅消息，未发送')
    # Each template has its own field IDs; deployment must supply its approved mapping.
    fields = json.loads(os.environ['QAXC_WECHAT_TEMPLATE_FIELDS'])
    if not isinstance(fields, dict) or not fields or any(v not in ('title','date','event') for v in fields.values()):
        raise ValueError('订阅模板字段配置无效')
    token = call('cgi-bin/token', dict(grant_type='client_credential', appid=os.environ['QAXC_WECHAT_APP_ID'], secret=os.environ['QAXC_WECHAT_APP_SECRET']))['access_token']
    sent=0
    for row in w.c.execute('SELECT * FROM mobile_notifications').fetchall():
        if sent>=limit: break
        n=json.loads(row['payload'])
        if n['pushStatus']!='pending': continue
        binding=mobile.setting(w,'wechat:'+row['user_id'])
        if not binding.get('consent'): continue
        if not w.c.execute('SELECT 1 FROM memberships WHERE project_id=? AND user_id=?',(n['projectId'],row['user_id'])).fetchone():
            n['pushStatus']='revoked'
        else:
            task=w.task(n['taskId'])
            values=dict(title=task['title'][:20],date=task['workDate'],event=n['text'][:20])
            # Reserve before external IO. A timeout is uncertain, never blindly resent.
            n['pushStatus']='sending'
            w.c.execute('UPDATE mobile_notifications SET payload=? WHERE id=?',(json.dumps(n,ensure_ascii=False),n['id']));w.c.commit()
            try:
                call('cgi-bin/message/subscribe/send',dict(access_token=token),dict(touser=binding['openid'],template_id=os.environ['QAXC_WECHAT_TEMPLATE_ID'],
                    page='pages/tasks/tasks?taskId='+n['taskId'],miniprogram_state=os.getenv('QAXC_WECHAT_STATE','developer'),lang='zh_CN',
                    data={k:{'value':values[v]} for k,v in fields.items()}))
                n.update(pushStatus='sent',sentAt=w.s.now());sent+=1
            except Exception as exc:
                n.update(pushStatus='failed' if isinstance(exc,ValueError) else 'uncertain',pushError=str(exc) if isinstance(exc,ValueError) else '网络结果不确定，保留站内提醒，不自动重发')
        w.c.execute('UPDATE mobile_notifications SET payload=? WHERE id=?',(json.dumps(n,ensure_ascii=False),n['id']))
        w.c.commit()
    return dict(sent=sent)
