"""Install an expiring, forced-command-only identity channel. Run in cloud console."""
import datetime
import json
import os
from pathlib import Path
import subprocess
import sys
import time


def main(bundle):
    assert os.geteuid() == 0
    folder = Path('/opt/qaxc-identity-uat-20261118')
    assert not folder.exists(), 'Temporary channel already exists; inspect before retrying'
    keyfile = Path('/home/ubuntu/.ssh/authorized_keys')
    original = keyfile.read_text() if keyfile.exists() else ''
    pubkey = bundle['public_key'].strip()
    assert pubkey.startswith('ssh-ed25519 ') and '\n' not in pubkey
    assert 'qaxc-identity-uat-20261118' in pubkey
    deadline = int(time.time()) + 14400
    expiry = datetime.datetime.fromtimestamp(deadline, datetime.timezone.utc).strftime('%Y%m%d%H%M%SZ')
    folder.mkdir(mode=0o755)
    for name in ('uat_identity_gateway.py', 'uat_ssh_relay.py'):
        (folder / name).write_text(bundle[name])
        (folder / name).chmod(0o644)
    config = folder / 'config.json'
    config.touch(mode=0o600)
    config.write_text(json.dumps({'token': bundle['token'], 'expires': deadline}))
    line = f'restrict,expiry-time="{expiry}",command="/usr/bin/timeout 20 /usr/bin/python3 {folder}/uat_ssh_relay.py" {pubkey}'
    cleanup = '''import pathlib, subprocess
folder = pathlib.Path('/opt/qaxc-identity-uat-20261118')
keyfile = pathlib.Path('/home/ubuntu/.ssh/authorized_keys')
key = (folder / 'key-line.txt').read_text().strip()
lines = keyfile.read_text().splitlines(keepends=True)
keyfile.write_text(''.join(line for line in lines if line.strip() != key))
subprocess.run(['systemctl','stop','qaxc-identity-uat-gateway.service'],check=False)
for name in ('config.json','uat_identity_gateway.py','uat_ssh_relay.py','key-line.txt','revoke.py'):
    (folder / name).unlink(missing_ok=True)
folder.rmdir()
print('UAT_CHANNEL_REVOKED')
'''
    (folder / 'key-line.txt').write_text(line)
    (folder / 'revoke.py').write_text(cleanup)
    (folder / 'revoke.py').chmod(0o700)
    subprocess.run(['systemd-run', '--unit=qaxc-identity-uat-expiry', '--on-active=4h',
                    '/usr/bin/python3', str(folder / 'revoke.py')], check=True)
    subprocess.run(['systemd-run', '--unit=qaxc-identity-uat-gateway',
                    '--property=RuntimeMaxSec=4h', '--property=NoNewPrivileges=yes',
                    '--property=ProtectSystem=strict', '--property=PrivateTmp=yes',
                    '/usr/bin/python3', str(folder / 'uat_identity_gateway.py')], check=True)
    keyfile.parent.mkdir(mode=0o700, exist_ok=True)
    if not keyfile.exists():
        keyfile.touch(mode=0o600)
        import pwd
        account = pwd.getpwnam('ubuntu')
        os.chown(keyfile, account.pw_uid, account.pw_gid)
    with keyfile.open('a') as stream:
        stream.write(('\n' if original and not original.endswith('\n') else '') + line + '\n')
    print('UAT_CHANNEL_INSTALLED; expires=' + expiry)


if __name__ == '__main__':
    main(json.load(sys.stdin))
