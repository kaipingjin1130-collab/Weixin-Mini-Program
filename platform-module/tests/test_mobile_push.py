import json
import os
import unittest
from unittest.mock import patch
from test_leader_reports import LeaderReports, s
import mobile_push


class MobilePush(unittest.TestCase):
    setUp=LeaderReports.setUp
    tearDown=LeaderReports.tearDown
    request=LeaderReports.request
    login=LeaderReports.login
    post=LeaderReports.post

    def test_binding_uses_server_wechat_exchange_and_rejects_shared_identity(self):
        with patch.dict(os.environ,{'QAXC_WECHAT_APP_ID':'test-app','QAXC_WECHAT_APP_SECRET':'test-secret','QAXC_WECHAT_TEMPLATE_ID':'test-template'}),patch.object(mobile_push,'call',return_value={'openid':'verified-openid','session_key':'never-store'}):
            self.post('mobile-push-bind',self.worker,code='one-use-code',accepted=True,openid='forged')
            with s.db() as c:
                row=c.execute("SELECT payload FROM mobile_settings WHERE id='wechat:host:admin:9'").fetchone()[0]
                self.assertEqual(json.loads(row)['openid'],'verified-openid');self.assertNotIn('never-store',row);self.assertNotIn('forged',row)
            status,_,_=self.request('/quality/api/work/mobile-push-bind',dict(requestId='second-binding',code='other-code',accepted=True),self.other)
            self.assertEqual(status,409)

    def test_unconfigured_push_has_explicit_status(self):
        with patch.dict(os.environ,{'QAXC_WECHAT_APP_ID':'','QAXC_WECHAT_APP_SECRET':'','QAXC_WECHAT_TEMPLATE_ID':''}):
            status,result,_=self.request('/quality/api/work/mobile-push-config',token=self.worker)
            self.assertEqual(status,200);self.assertFalse(result['enabled'])


if __name__=='__main__':unittest.main()
