"""Explicit permissions for the existing loopback fusion acceptance fixture only."""
import json
import sqlite3
from pathlib import Path


def configure(root: Path):
    local = root / '.local/fusion-integration'
    database = local / 'a-data/inspections.sqlite3'
    if not database.is_file():
        raise RuntimeError('请先初始化本机融合验收库；不会使用独立 B 演示身份。')
    with sqlite3.connect(database.as_uri()+'?mode=ro',uri=True) as db:
        projects = [r[0] for r in db.execute('SELECT id FROM projects ORDER BY id')]
    if not projects:
        raise RuntimeError('本机融合库暂无项目，请先在融合入口建立验收项目。')
    actions = [f'{group}.{action}' for group, values in {
        'knowledge':('read','process','review','publish'), 'imports':('read','create','retry','withdraw'),
        'retrospective':('read','generate','edit','review'), 'training':('learn','manage','review')
    }.items() for action in values]
    service={'org_id':'fusion-test','project_ids':projects,'allowed_actions':['delivery.meta','delivery.snapshot','delivery.attachment']}
    directory=local/'v1'; directory.mkdir(exist_ok=True)
    configs = {
        'authorization.json': {'org_id':'fusion-test','is_demo':True,'service':{**service,'allowed_actions':['metadata.read','snapshot.read','evidence.read']},
            'grants':{'host:admin:900001':{p:actions for p in projects},
                      'host:admin:900002':{p:['knowledge.read','training.learn'] for p in projects}}},
        'source.json':{'source_system':'a',**service,'enabled':True},
        'worker.json':{'org_id':'fusion-test','projects':{p:actions for p in projects}},
    }
    for name,value in configs.items():
        path=directory/name
        if not path.exists():path.write_text(json.dumps(value,ensure_ascii=False,indent=2),encoding='utf-8')
    return {'AB_INTEGRATION_VERSION':'1.0','AB_AUTHORIZATION_FILE':str(directory/'authorization.json'),
            'B_A_SOURCE_REGISTRATION':str(directory/'source.json'),'B_WORKER_AUTHORIZATION':str(directory/'worker.json'),
            'B_MODEL_ADMIN_IDENTITIES':json.dumps([{'org_id':'fusion-test','subject_id':'host:admin:900001'}])}
