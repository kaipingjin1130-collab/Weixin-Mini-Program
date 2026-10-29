"""Build both browser entries and stage deployable assets; no implicit installation."""
from pathlib import Path
import os
import shutil
import subprocess
import sys

root=Path(__file__).resolve().parents[1]
frontend=root/'b-risk-knowledge/frontend'
npm=shutil.which('npm.cmd' if sys.platform=='win32' else 'npm')
if not npm:
    raise SystemExit('Node.js/npm is required.')
env=dict(os.environ)
if sys.platform=='win32':
    temp=frontend/'.build-temp'
    temp.mkdir(exist_ok=True)
    env.update(TEMP=str(temp),TMP=str(temp))
if '--install' in sys.argv:
    subprocess.run([npm,'ci'],cwd=frontend,env=env,check=True)
subprocess.run([npm,'run','build'],cwd=frontend,env=env,check=True)
subprocess.run([npm,'exec','--','vite','build','--config','vite.embed.config.ts'],cwd=frontend,env=env,check=True)
shutil.copytree(frontend/'dist',root/'platform-module/b-web',dirs_exist_ok=True)
shutil.copytree(frontend/'dist-embed',root/'platform-module/b-web/embedded',dirs_exist_ok=True)
print('Deployable frontend: platform-module/b-web')
