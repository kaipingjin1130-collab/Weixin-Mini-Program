"""Explicit, single-run integration worker. Never launched by the web server."""
import argparse
import json
import os
from pathlib import Path
import sys


def main():
    parser=argparse.ArgumentParser(description='小察本地服务：互通同步 / 微信提醒（不会部署）')
    parser.add_argument('action',choices=['sync','pull','push','archive'])
    parser.add_argument('--data',type=Path,required=True,help='明确选择已经初始化的数据目录')
    parser.add_argument('--actor',required=True,help='已核验的 host:admin:N 账号')
    parser.add_argument('--project');parser.add_argument('--leader');parser.add_argument('--start');parser.add_argument('--end');parser.add_argument('--task')
    args=parser.parse_args()
    data=args.data.resolve()
    if not data.is_dir(): parser.error('数据目录不存在；本工具不初始化或恢复业务数据')
    os.environ['QAXC_DATA']=str(data)
    sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'candidate'))
    import server as s
    import workflow
    import mobile_bridge
    import mobile_push
    lock=data/'mobile-services.lock'
    try: fd=os.open(lock,os.O_CREAT|os.O_EXCL|os.O_WRONLY)
    except FileExistsError: raise SystemExit('服务正在执行或上次异常退出；请核对进程后再处理锁文件')
    try:
        os.write(fd,str(os.getpid()).encode());os.close(fd)
        with s.db() as c:
            row=c.execute('SELECT id,username,name FROM users WHERE id=?',(args.actor,)).fetchone()
            if not row: parser.error('所选账号尚未登录本地平台')
            # Revalidate host status rather than trusting the historical users row.
            identity=s.host_auth.identity(s.host_auth.call('identity',{'id':args.actor})) if s.host_auth.enabled() else dict(row)
            if s.host_auth.enabled() and identity['id']!=args.actor: parser.error('账号核对失败')
            w=workflow.Workflow(s,c,identity)
            if args.action=='sync': result=mobile_bridge.sync(w)
            elif args.action=='push': result=mobile_push.deliver(w)
            elif args.action=='archive': result=mobile_bridge.archive_result(w,args.task)
            else: result=mobile_bridge.pull(w,args.project,args.leader,args.start,args.end)
            print(json.dumps(result,ensure_ascii=False))
    finally:
        lock.unlink(missing_ok=True)


if __name__=='__main__':main()
