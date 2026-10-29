"""Local operator tool for A source withdrawal; never modifies frozen snapshots."""
import argparse
import server
import ab_v1


def withdraw(delivery_id, actor_id, reason):
    settings = ab_v1.config()
    if not reason.strip() or len(reason) > 1000:
        raise ValueError('撤回原因必填，最多1000字')
    if not server.host_auth.enabled():
        raise ValueError('撤回操作要求真实原平台身份服务')
    user = server.host_auth.identity(server.host_auth.call('identity', {'id': actor_id}, timeout=3))
    with server.db() as db:
        row = db.execute('SELECT payload FROM deliveries WHERE id=?', (delivery_id,)).fetchone()
    if not row:
        raise ValueError('成果不存在')
    import json
    pid = json.loads(row['payload'])['project']['id']
    grant = ab_v1.identity(server, user, settings, pid)['projects'][0]
    if 'imports.withdraw' not in grant['permissions']:
        raise ValueError('操作者没有撤回权限')
    with server.db() as db:
        db.execute('INSERT OR IGNORE INTO ab_source_withdrawals VALUES(?,?,?,?)',
                   (delivery_id, server.now(), reason.strip(), actor_id))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('delivery_id')
    parser.add_argument('--actor', required=True)
    parser.add_argument('--reason', required=True)
    args = parser.parse_args()
    server.init()
    withdraw(args.delivery_id, args.actor, args.reason)
    print('来源撤回已记录；冻结快照未修改。')
