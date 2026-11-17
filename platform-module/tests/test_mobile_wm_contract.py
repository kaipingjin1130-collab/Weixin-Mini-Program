"""Run with WM_TEST_SOURCE and its declared dependencies; never uses a live database."""
import asyncio
import io
import json
import os
from pathlib import Path
import sys
import unittest
from unittest.mock import patch
from urllib.parse import urlsplit
from urllib.error import HTTPError

source=os.getenv('WM_TEST_SOURCE')
if not source: raise unittest.SkipTest('WM_TEST_SOURCE must point at the isolated, patched WM source copy')
sys.path[:0]=[str(Path(source)),str(Path(source)/'tests'),str(Path(__file__).resolve().parents[1]/'candidate')]
import test_integration_security as wm
from app.auth import current_principal
from app.models import ContractCatalog, ExternalIdentity, PersonAccessProfile, WorkTask
import mobile_bridge


class WMContract(unittest.TestCase):
    def setUp(self):
        wm.IntegrationSecurityTest.setUp(self)
        self.env=patch.dict(os.environ,{'WORKLOAD_QAXC_BRIDGE_KEY':'test-bridge-secret-key-at-least-32-chars',
            'QAXC_WM_BRIDGE_KEY':'test-bridge-secret-key-at-least-32-chars','QAXC_WM_URL':'http://127.0.0.1',
            'WORKLOAD_AUTH_ISSUER':'isolated-wm','WORKLOAD_QAXC_SUBJECTS':json.dumps({'host:admin:7':'user:7','host:admin:9':'user:9'})})
        self.env.start()
        with self.Session() as db:
            for pid,sub,role in [(self.person_id,'user:7','super_admin'),(self.other_id,'user:9','project_manager')]:
                db.add(ExternalIdentity(issuer='isolated-wm',subject=sub,person_id=pid))
                p=db.get(PersonAccessProfile,pid)
                if p: p.role_code=role
                else: db.add(PersonAccessProfile(person_id=pid,role_code=role))
            catalog=ContractCatalog(year=2026,name='隔离互通测试合同',active=True)
            db.add(catalog);db.commit();self.catalog=catalog.id
        wm.app.dependency_overrides.pop(current_principal)
        class Opener:
            def open(_self,req,timeout=20):
                url=urlsplit(req.full_url);path=url.path+('?' +url.query if url.query else '')
                status,result=asyncio.run(wm.call_app(req.get_method(),path,req.data or b'',{k.lower():v for k,v in req.header_items()}))
                if status>=400: raise HTTPError(req.full_url,status,str(result),{},None)
                return io.BytesIO(json.dumps(result,ensure_ascii=False).encode())
        self.transport=patch.object(mobile_bridge,'build_opener',return_value=Opener());self.transport.start()
        self.actor={'id':'host:admin:7','name':'测试负责人'}

    def tearDown(self):
        self.transport.stop();self.env.stop();wm.IntegrationSecurityTest.tearDown(self)

    def payload(self):
        return dict(client_request_id='qaxc_test_request_123456',contract_name='楼栋巡查',catalog_id=self.catalog,
                    work_date='2026-11-17',participant_ids=[self.person_id,self.other_id],planned_people_count=3,
                    work_type='现场巡查',service_focus='三号楼',submit=True)

    def test_signed_create_replay_update_list_and_actual_workload_contract(self):
        payload=self.payload();first=mobile_bridge.call(self.actor,'POST','/api/tasks',payload)
        second=mobile_bridge.call(self.actor,'POST','/api/tasks',payload)
        self.assertEqual(first['id'],second['id']);self.assertEqual(first['planned_people_count'],3)
        self.assertFalse(first['counts_workload'])
        edited=mobile_bridge.call(self.actor,'PUT','/api/tasks/'+str(first['id']),dict(expected_revision=first['revision'],participant_ids=[self.person_id],remark='最终名单核定'))
        self.assertEqual(len(edited['participants']),1)
        rows=mobile_bridge.call(self.actor,'GET','/api/tasks?date_from=2026-11-17&date_to=2026-11-17&limit=200&offset=0')
        self.assertEqual(rows['items'][0]['catalog_id'],self.catalog)
        stats=mobile_bridge.call(self.actor,'GET','/api/workload?date_from=2026-11-17&date_to=2026-11-17&include_tasks=false')
        self.assertEqual(stats['total_person_workload'],0)

    def test_stale_revision_and_changed_request_never_overwrite_remote_task(self):
        payload=self.payload();first=mobile_bridge.call(self.actor,'POST','/api/tasks',payload)
        with self.assertRaises(mobile_bridge.BridgeError): mobile_bridge.call(self.actor,'POST','/api/tasks',dict(payload,planned_people_count=4))
        with self.assertRaises(mobile_bridge.BridgeError): mobile_bridge.call(self.actor,'PUT','/api/tasks/'+str(first['id']),dict(expected_revision=999,planned_people_count=4))
        self.assertEqual(mobile_bridge.call(self.actor,'GET','/api/tasks/'+str(first['id']))['planned_people_count'],3)

    def test_invalid_signature_unmapped_actor_and_existing_permission_checks(self):
        with patch.dict(os.environ,{'QAXC_WM_BRIDGE_KEY':'wrong-secret-key-at-least-32-characters'}):
            with self.assertRaises(mobile_bridge.BridgeError): mobile_bridge.call(self.actor,'GET','/api/tasks')
        with self.assertRaises(mobile_bridge.BridgeError): mobile_bridge.call({'id':'host:admin:999'},'GET','/api/tasks')
        first=mobile_bridge.call(self.actor,'POST','/api/tasks',self.payload())
        with self.assertRaises(mobile_bridge.BridgeError): mobile_bridge.call({'id':'host:admin:9'},'PUT','/api/tasks/'+str(first['id']),dict(expected_revision=first['revision'],planned_people_count=4))


if __name__=='__main__': unittest.main()
