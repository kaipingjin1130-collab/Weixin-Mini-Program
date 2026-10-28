import base64, concurrent.futures, importlib.util, io, json, os, struct, sys, tempfile, threading, unittest, urllib.request, urllib.error, zipfile, zlib
from pathlib import Path
from xml.etree import ElementTree

spec=importlib.util.spec_from_file_location('inspector',Path(__file__).parents[1]/'server.py')
server=importlib.util.module_from_spec(spec); spec.loader.exec_module(server)

def png():
 def chunk(t,d): return struct.pack('>I',len(d))+t+d+struct.pack('>I',zlib.crc32(t+d)&0xffffffff)
 return b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',2,2,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(b'\0'+b'\x20\x80\x40'*2+b'\0'+b'\x20\x80\x40'*2))+chunk(b'IEND',b'')

class Workflow(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  root=Path(__file__).resolve().parents[1]/'.test-temp';root.mkdir(exist_ok=True)
  cls.tmp=tempfile.TemporaryDirectory(dir=root); server.DATA=Path(cls.tmp.name); os.environ['QAXC_PASSWORD']='automated-test-password'; server.init()
  cls.http=server.ThreadingHTTPServer(('127.0.0.1',0),server.Handler); cls.url='http://127.0.0.1:'+str(cls.http.server_port)
  cls.thread=threading.Thread(target=cls.http.serve_forever,daemon=True); cls.thread.start()
 @classmethod
 def tearDownClass(cls):
  cls.http.shutdown();cls.http.server_close()
  assert Path(cls.tmp.name).resolve().parent == (Path(__file__).resolve().parents[1]/'.test-temp').resolve()
  import gc;gc.collect();cls.tmp.cleanup()
 def request(self,path,data=None,token=True):
  headers={'Content-Type':'application/json'}
  if token: headers['Authorization']='Bearer '+self.token
  req=urllib.request.Request(self.url+path,data=json.dumps(data).encode() if data is not None else None,headers=headers)
  try:
   with urllib.request.urlopen(req) as r:
    content=r.read(); return r.status,json.loads(content) if 'application/json' in r.headers.get('Content-Type','') else content
  except urllib.error.HTTPError as ex:return ex.code,json.loads(ex.read())
 def setUp(self):
  _,login=self.request('/api/login',{'password':'automated-test-password'},False);self.token=login['token']
  _,p=self.request('/api/projects',{'name':'测试项目','contract':'测试合同'});self.pid=p['id']
  _,c=self.request('/api/codes',{'projectId':self.pid,'participants':'测试员'});self.cid=c['id']
  _,m=self.request('/api/media',{'base64':base64.b64encode(png()).decode()});self.mid=m['id']
 def report(self): return dict(codeId=self.cid,date='2026-10-19',inspector='测试员',scope='2号楼临边巡查',signature=self.mid,noHazard=False,issues=[dict(category='施工安全',subcategory='临边防护',risk='中',location='2号楼三层',description='临边防护缺失',reference='测试依据',suggestion='补齐防护',photos=[self.mid])])
 def test_unauthorized_media_and_export(self):
  for path in ['/api/state','/media/'+self.mid,'/api/export/nope']:
   self.assertEqual(self.request(path,token=False)[0],401)
 def test_invalid_media_and_missing_fields(self):
  self.assertEqual(self.request('/api/media',{'base64':base64.b64encode(b'not image').decode()})[0],400)
  d=self.report();d['signature']='';d['submit']=True
  self.assertEqual(self.request('/api/reports',d)[0],400)
  d['signature']=self.mid;d['issues'][0]['photos']=[]
  self.assertEqual(self.request('/api/reports',d)[0],400)
 def test_submit_without_location(self):
  d=self.report();d['submit']=True
  for value in ['', '   ', None]:
   with self.subTest(location=value):
    if value is None:d['issues'][0].pop('location',None)
    else:d['issues'][0]['location']=value
    status,r=self.request('/api/reports',d)
    self.assertEqual(status,200);self.assertEqual(r['status'],'submitted')
  d['issues'][0]['description']=''
  self.assertEqual(self.request('/api/reports',d)[0],400)
 def test_multiple_inspectors_signatures_export_and_copy(self):
  d=self.report();d['inspector']='张三，李四';d['signature']='';d['signatures']=[{'name':'张三','signature':self.mid},{'name':'李四','signature':''}]
  status,draft=self.request('/api/reports',d);self.assertEqual(status,200)
  draft['submit']=True
  self.assertEqual(self.request('/api/reports',draft)[0],400)
  draft['signatures'][1]['signature']=self.mid
  status,r=self.request('/api/reports',draft);self.assertEqual(status,200);self.assertEqual(r['inspector'],'张三、李四')
  _,saved=self.request('/api/state');actual=next(x for x in saved['reports'] if x['id']==r['id']);self.assertEqual(actual['signatures'],r['signatures'])
  _,content=self.request('/api/export/'+r['id'])
  with zipfile.ZipFile(io.BytesIO(content)) as z:
   xml=z.read('word/document.xml').decode();self.assertIn('检查人手写签名：张三',xml);self.assertIn('检查人手写签名：李四',xml)
   self.assertEqual(len([n for n in z.namelist() if n.startswith('word/media/')]),3)
  _,copy=self.request('/api/reports/copy',{'id':r['id']});self.assertEqual([x['signature'] for x in copy['signatures']],['',''])
  _,merged=self.request('/api/reports/merge',{'ids':[r['id'],copy['id']]});self.assertTrue(all(not x['signature'] for x in merged['signatures']))
 def test_multiple_inspectors_reject_mismatched_signatures(self):
  d=self.report();d.update(inspector='张三、李四',submit=True)
  self.assertEqual(self.request('/api/reports',d)[0],400)
  d['signatures']=[{'name':'其他人','signature':self.mid}]
  self.assertEqual(self.request('/api/reports',d)[0],400)
  d['inspector']='张三、张三';d['signatures']=[]
  self.assertEqual(self.request('/api/reports',d)[0],400)
 def test_draft_conflict_and_submit_lock(self):
  status,r=self.request('/api/reports',self.report());self.assertEqual(status,200)
  _,updated=self.request('/api/reports',r);self.assertEqual(updated['revision'],2)
  self.assertEqual(self.request('/api/reports',r)[0],409)
  updated['submit']=True;_,submitted=self.request('/api/reports',updated)
  self.assertEqual(submitted['status'],'submitted')
  self.assertEqual(self.request('/api/reports',submitted)[0],409)
  self.assertEqual(self.request('/api/reports/delete',{'id':submitted['id']})[0],400)
 def test_snapshot_docx_contains_images_and_signature(self):
  d=self.report();d['submit']=True;_,r=self.request('/api/reports',d)
  self.request('/api/projects',{'id':self.pid,'name':'改名后的项目','contract':'新合同'})
  _,state=self.request('/api/state');saved=next(x for x in state['reports'] if x['id']==r['id']);self.assertEqual(saved['project'],'测试项目')
  status,content=self.request('/api/export/'+r['id']);self.assertEqual(status,200)
  with zipfile.ZipFile(io.BytesIO(content)) as z:
   for name in z.namelist():
    if name.endswith(('.xml','.rels')):ElementTree.fromstring(z.read(name))
   self.assertIn('临边防护缺失',z.read('word/document.xml').decode());self.assertEqual(len([n for n in z.namelist() if n.startswith('word/media/')]),2)
 def test_project_and_code_delete_protection(self):
  self.assertEqual(self.request('/api/projects/delete',{'id':self.pid})[0],400)
  self.request('/api/reports',self.report())
  self.assertEqual(self.request('/api/codes/delete',{'id':self.cid})[0],400)
 def test_no_hazard_validation(self):
  d=self.report();d.update(noHazard=True,submit=True)
  self.assertEqual(self.request('/api/reports',d)[0],400)
  d['issues']=[];d['scope']='';self.assertEqual(self.request('/api/reports',d)[0],400)
  d['scope']='已检查围挡及通道，未发现隐患';self.assertEqual(self.request('/api/reports',d)[0],200)
 def test_merge_same_code_and_copy(self):
  _,a=self.request('/api/reports',self.report());_,b=self.request('/api/reports',self.report())
  status,r=self.request('/api/reports/merge',{'ids':[a['id'],b['id']]});self.assertEqual(status,200);self.assertEqual(len(r['issues']),2);self.assertEqual(r['signature'],'')
  _,c=self.request('/api/codes',{'projectId':self.pid,'participants':'另一组'})
  d=self.report();d['codeId']=c['id'];_,other=self.request('/api/reports',d)
  self.assertEqual(self.request('/api/reports/merge',{'ids':[a['id'],other['id']]})[0],400)
  _,copy=self.request('/api/reports/copy',{'id':a['id']});self.assertNotEqual(copy['id'],a['id']);self.assertEqual(copy['signature'],'')
 def test_concurrent_draft_updates(self):
  _,r=self.request('/api/reports',self.report())
  with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:codes=list(pool.map(lambda _:self.request('/api/reports',r)[0],range(2)))
  self.assertEqual(sorted(codes),[200,409])
 def test_favorite_and_logout(self):
  self.request('/api/favorites',{'id':'k1','selected':True});_,s=self.request('/api/state');self.assertIn('k1',s['favorites'])
  self.request('/api/logout',{});self.assertEqual(self.request('/api/state')[0],401)

if __name__=='__main__':unittest.main()
