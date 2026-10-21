"""Generate a synthetic package for developer B using the real workflow API."""
import io
import zipfile
from pathlib import Path
from test_workflow import Collaboration

if __name__=='__main__':
 Collaboration.setUpClass()
 test=Collaboration('test_end_to_end_handover_archive_package_and_correction')
 try:
  test.setUp();test.completed()
  test.act('deliver',{'text':'接口联调样例：纯测试数据，非真实巡查成果。'})
  test.act('accept',{'text':'测试接收确认','decision':'accept'},'receiver')
  test.act('archive')
  did=test.t['deliveries'][-1]['id']
  status,content=test.request('/api/work/package/'+did)
  if status!=200: raise RuntimeError(content)
  out=Path(__file__).parents[1]/'examples';out.mkdir(exist_ok=True)
  (out/'completed-task-demo.zip').write_bytes(content)
  with zipfile.ZipFile(io.BytesIO(content)) as z:
   (out/'completed-task-demo.json').write_bytes(z.read('task.json'))
  qa=Path(__file__).parents[1]/'.test-temp'
  for kind,identifier,name in [('brief-word',test.t['fieldBriefs'][0]['id'],'field-brief.docx'),('word',did,'formal-report.docx')]:
   status,content=test.request('/api/work/'+kind+'/'+identifier)
   if status!=200: raise RuntimeError(content)
   (qa/name).write_bytes(content)
  print('Synthetic package and report export fixtures generated.')
 finally:
  Collaboration.tearDownClass()
