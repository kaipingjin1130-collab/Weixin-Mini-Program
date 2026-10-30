import sys,unittest,io,zipfile
from pathlib import Path
sys.path.insert(0,str(Path('platform-module/tests').resolve()))
from test_leader_reports import LeaderReports,s
class NoticeTests(LeaderReports):
 def test_optional_metadata_and_routing(self):
  t=self.post('adhoc-tasks',self.worker,projectId=self.pid,scenarioId='inspection',notice={'noticeNumber':'20260922-三林项目-06','progress':'机电安装'})
  t=self.post('start',self.worker,taskId=t['id'],revision=t['revision'],checklist=[])
  t=self.post('issue',self.worker,taskId=t['id'],revision=t['revision'],description='',risk='',evidence=[])
  t=self.post('submit-field',self.worker,taskId=t['id'],revision=t['revision'],leaderId='host:admin:8')
  self.assertEqual(len(self.inbox()),1)
  bid=t['fieldBriefs'][0]['id'];status,data,headers=self.request('/quality/api/work/brief-word/'+bid,token=self.worker)
  self.assertEqual(status,200);self.assertIn('20260922-',headers['Content-Disposition']);self.assertIn("filename*=UTF-8''",headers['Content-Disposition'])
  with zipfile.ZipFile(io.BytesIO(data)) as z:
   xml=z.read('word/document.xml').decode();self.assertIn('隐患清单',xml);self.assertIn('20260922-三林项目-06',xml);self.assertIn('<w:tbl>',xml)
 def test_web_optional_and_safe_filename(self):
  code=self.request('/quality/api/codes',dict(projectId=self.pid,participants='测试'),self.owner)[1]['id']
  status,r,_=self.request('/quality/api/reports',dict(codeId=code,submit=True,notice={'noticeNumber':'20260922-三林项目-06'},issues=[{'description':'仅文字，无照片'}]),self.owner)
  self.assertEqual(status,200,r)
  status,data,headers=self.request('/quality/api/export/'+r['id'],token=self.owner);self.assertEqual(status,200)
  self.assertIn('%E4%B8%89',headers['Content-Disposition'])
 def test_invalid_notice_rejected(self):
  status,r,_=self.request('/quality/api/work/adhoc-tasks',dict(projectId=self.pid,scenarioId='inspection',notice={'noticeNumber':[]},requestId='badnotice'),self.worker)
  self.assertEqual(status,400)
if __name__=='__main__': unittest.main()
