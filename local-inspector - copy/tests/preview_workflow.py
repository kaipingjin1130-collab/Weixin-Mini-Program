"""Isolated UI acceptance server. Never uses the user's business database."""
import json
import threading
from pathlib import Path
from test_workflow import Collaboration

if __name__=='__main__':
 Collaboration.setUpClass()
 test=Collaboration('test_mobile_submission_platform_return_and_brief_versions')
 try:
  test.setUp()
  test.start()
  test.act('record',test.record(),'inspector')
  test.act('issue',dict(description='演示问题：二层临边防护缺失（非真实业务）',risk='中',evidence=[test.ev['id']]),'inspector')
  test.act('submit-field',{'text':'功能验收用现场材料，非真实业务数据。'},'inspector')
  path=Path(__file__).parents[1]/'.test-temp'/'preview.json'
  path.write_text(json.dumps(dict(url=test.url+'/work',taskId=test.t['id'],database=str(test.tmp.name)),ensure_ascii=False),encoding='utf-8')
  print(test.url+'/work',flush=True)
  threading.Event().wait()
 finally:
  Collaboration.tearDownClass()
