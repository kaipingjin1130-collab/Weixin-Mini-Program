import json
import os
import unittest
from unittest.mock import patch
import test_mobile_workflow as fixtures
import mobile_bridge
import mobile_workflow
from workflow import Workflow


class MobileBridge(unittest.TestCase):
    setUp=fixtures.MobileWorkflow.setUp
    tearDown=fixtures.MobileWorkflow.tearDown
    request=fixtures.MobileWorkflow.request
    login=fixtures.MobileWorkflow.login
    post=fixtures.MobileWorkflow.post
    create=fixtures.MobileWorkflow.create
    change=fixtures.MobileWorkflow.change

    def w(self,c):
        return Workflow(fixtures.s,c,dict(id='host:admin:7',name='测试管理员',isAdmin=True))

    def configured(self):
        self.post('mobile-project-config',projectId=self.pid,contractPeople=1,basis='测试合同',catalogId=12)
        return self.create()

    def test_outbox_response_loss_retries_original_request_without_duplicates(self):
        t=self.configured();calls=[]
        def remote(actor,method,path,data=None,**kw):
            calls.append((method,path,data))
            if len(calls)==1: raise mobile_bridge.BridgeError('response lost')
            return dict(id=91,revision=1)
        with patch.dict(os.environ,{'QAXC_WM_PERSON_IDS':json.dumps({'host:admin:9':9})}),patch.object(mobile_bridge,'call',side_effect=remote),fixtures.s.db() as c:
            w=self.w(c)
            self.assertEqual(mobile_bridge.sync(w)['blocked'],1)
            self.assertEqual(mobile_bridge.sync(w)['synced'],1)
            self.assertEqual(calls[0][2],calls[1][2])
            self.assertEqual(w.task(t['id'])['legacyTaskId'],91)
            self.assertEqual(mobile_bridge.sync(w)['synced'],0)

    def test_recognition_payload_uses_actual_people_not_absentees(self):
        t=self.configured()
        t.update(confirmedIds=['host:admin:9','host:admin:10'],recognition={'actualIds':['host:admin:9']})
        with patch.dict(os.environ,{'QAXC_WM_PERSON_IDS':json.dumps({'host:admin:9':9,'host:admin:10':10})}),fixtures.s.db() as c:
            self.assertEqual(mobile_bridge.payload(self.w(c),t)['participant_ids'],[9])

    def test_pull_is_idempotent_and_preserves_external_revision_conflicts(self):
        self.post('mobile-project-config',projectId=self.pid,contractPeople=2,basis='测试合同',catalogId=12)
        remote=dict(id=91,revision=3,catalog_id=12,counts_workload=False,status='pending_upload',participants=[{'id':9}],
                    contract_name='老平台安排',service_focus='现场',work_date='2026-11-17',work_type='现场巡查',planned_people_count=1)
        with patch.dict(os.environ,{'QAXC_WM_PERSON_IDS':json.dumps({'host:admin:9':9})}),patch.object(mobile_bridge,'call',return_value={'items':[remote]}),fixtures.s.db() as c:
            w=self.w(c)
            self.assertEqual(mobile_bridge.pull(w,self.pid,'host:admin:8','2026-11-16','2026-11-22')['imported'],1)
            self.assertEqual(mobile_bridge.pull(w,self.pid,'host:admin:8','2026-11-16','2026-11-22')['imported'],0)
            t=w.state()['tasks'][0];self.assertEqual(t['acceptedIds'],[])
            remote['revision']=4;mobile_bridge.pull(w,self.pid,'host:admin:8','2026-11-16','2026-11-22')
            self.assertEqual(w.task(t['id'])['syncStatus'],'conflict')
            self.assertEqual(c.execute('SELECT COUNT(*) FROM mobile_outbox').fetchone()[0],0)


if __name__=='__main__':unittest.main()
